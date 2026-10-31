// The first-person viewport: a depth-layered compositor in the Might and Magic III-V tradition. It draws
// the walls and the grounds, each as its look in view/ground/ gives it (#1030), and the ground past a hill
// seen from below it (`standsAt`), a landmark tall over its building's square out to `LANDMARK_REACH`, the
// tents, the wall dressing, the features on open ground (view/features.ts, #1110), the sky, the end of
// the world drawn as its look and the weather over it:
// `drawViewport`, the scene it caches and `paintScene`, which paints the scene back to front from the
// parts beside it (#1028).
//
// Everything is vector, textured procedurally (stone courses, timber frames, flagstones, tufts of
// grass) with a stable hash so the same wall always has the same darker block. The static scene
// is painted into two offscreen canvases, the sky and everything in front of it, so a lightning bolt
// can be drawn between them, and kept with the other facings of the square (kept.ts, #1073); monsters,
// the light flicker and the weather (rain, snow, fog, the flash of a strike) are drawn over it every
// frame.
//
// The weather and the time of year also reach into the cached scene: an overcast sky greys the
// light, fog and driving rain or snow swallow far faces into the haze, rain darkens the ground and
// leaves puddles, snow lies on the ground, the roofs and the trees, the grass goes from spring
// green to tawny, and the leaves turn and fall (see game/weather.ts and game/calendar.ts).
//
// Where the outdoors is not built yet the world ends in void, and the void is drawn as its look, the
// ground the world map paints there: the sea to the horizon, the rim's mountains (#829). A void with
// no look is painted as what it is, nothing: flat pink, unlit and untextured, standing up past the
// top of the view so that it hides the sky behind it as well as the ground.

import type { World } from '../../game/world.ts';
import { VIEW_DEPTH, VIEW_LATERAL, viewCell as cellAt, isSolidWall, lineOfSight, hillOver } from '../../game/world.ts';
import type { Cell, Landmark } from '../../game/mapdef.ts';
import { FACING_DX, FACING_DY } from '../../game/types.ts';
import type { Facing } from '../../game/types.ts';
import { shade, mix, rgba } from '../../lib/art/palettes.ts';
import { VOID_PINK } from '../palette.ts';
import { drawMonsterSprite } from '../sprites.ts';
import { drawTreeSprite, drawLighthouseSprite, drawMonasterySprite, drawRockSprite, drawMountainSprite, drawPillarSprite, treeSeason } from '../scenery.ts';
import type { MonsterSprite } from '../../game/monsters.ts';
import { weatherSight } from '../../game/weather.ts';
import { sunTimes } from '../../game/calendar.ts';
import { hash } from '../paint/brush.ts';
import { hearthBearing, hearthLook } from '../../game/stones.ts';
import { unit, CLEAR, paintOn, floorPt, pixel, addPoly } from './common.ts';
import type { ViewRect, Flame, Env, View } from './common.ts';
import { murkOf, toPair, drawnAt, standsAt, looksHouse, building, tentOf } from './model.ts';
import { airOf, hazeOf, drawSkyBand } from './sky.ts';
import type { SkyOpts } from './sky.ts';
import { drawWeather, strike, drawBolt } from './weather.ts';
import { drawFloor, drawCeiling } from './floor.ts';
import { GROUND, groundColor } from './ground/index.ts';
import { drawVoidFront, drawVoidSide, drawFrontFace, drawLighthouseFlank, LAMP_REACH, drawLamp, drawFlame, drawSideFace } from './walls.ts';
import { drawRoof, drawChimney } from './roofs.ts';
import { inTent, tentView, drawTentRoof } from './tents.ts';
import { Scenes } from './kept.ts';
import { drawFeatures } from './features.ts';

const DEPTH = VIEW_DEPTH;
const LATERAL = VIEW_LATERAL;
/** How many squares off a landmark stands over the land: a lighthouse seen from across the bay. */
const LANDMARK_REACH = 40;

/** A figure the viewport draws for a group: the monster, its sprite, tint and size. `under` draws it under the ice. */
export interface ViewMonster { id: string; sprite: MonsterSprite; tint: string; size: number; under?: 'ice'; }
/**
 * The scenes kept (kept.ts): each everything but the sky, which shows through where nothing was
 * painted, and the sky, sun, moon, stars and clouds behind it, with the flames it left alight.
 */
const scenes = new Scenes<HTMLCanvasElement>(() => document.createElement('canvas'));
/** The flames the scene last painted left alight, the array itself: the paint's result, kept as the scene is (#1029). */
let painted: Flame[] = [];
/** The flames the last scene painted left alight, or the kept scene drawn again since for another facing. */
export function paintedFlames(): readonly Flame[] { return painted; }
/** Every kept scene dropped, so the next frame paints afresh: what the smoke holds the kept ones to. */
export function dropScenes(): void { scenes.drop(); }
/** How many scenes the view keeps now, and the canvases and bytes it holds. */
export function keptScenes(): ReturnType<Scenes<HTMLCanvasElement>['held']> { return scenes.held(); }

/**
 * The first-person view at `r`. `weather` draws the rain, snow, fog and lightning over it; a fight
 * passes false and draws them over its monsters instead (see drawWeather).
 */
export function drawViewport(
  ctx: CanvasRenderingContext2D, world: World, r: ViewRect,
  monstersAt: (x: number, y: number) => readonly ViewMonster[] | null, frame: number, weather = true,
): void {
  // The scene drawn last while nothing it reads has changed, another facing of the square kept, or
  // painted now (kept.ts). The minute and the weather seed pin down the weather, so they key it with the place.
  const { scene, had } = scenes.scene(world, r, (canvas, sky) => {
    // Each torch's point is read back as the scene is painted (see `pixel`).
    paintScene(canvas.getContext('2d', { willReadFrequently: true })!, sky.getContext('2d')!, world, { x: 0, y: 0, w: r.w, h: r.h });
    return painted;
  });
  // A facing drawn again is the scene a paint now would be, its flames with it.
  if (had === 'kept') painted = scene.flames;
  ctx.save(); ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();
  // The sky, a lightning bolt in it, then the scene in front with the sky showing through.
  const wx = world.underSky ? world.weather : null;
  if (wx) {
    ctx.drawImage(scene.sky, r.x, r.y);
    const flash = strike(wx.storm, frame);
    if (flash) drawBolt(ctx, r, flash);
  }
  ctx.drawImage(scene.canvas, r.x, r.y);

  // Flames on the sconces and lanterns, animated over the cached scene; a monster stands before them.
  for (const fl of scene.flames) {
    if (fl.lamp) drawLamp(ctx, fl, r.x, r.y, frame);
    else drawFlame(ctx, r.x + fl.x, r.y + fl.y, fl.s, frame + Math.round(fl.x));
  }
  // Monsters, every frame, with a line-of-sight check against the cached walls.
  const map = world.map;
  const { x: px, y: py, facing: f } = world.state;
  const cx = r.x + r.w / 2, horizon = r.y + r.h / 2, view: View = { ctx, cx, horizon, h: r.h };
  const dark = world.isDark && map.kind !== 'dungeon';
  // Grey days dim them, and murk fades the far ones.
  const dim = wx ? 1 - 0.18 * wx.cloud : 1, murk = wx ? murkOf(wx) : 0;
  for (let d = Math.min(DEPTH, world.sight); d >= 1; d--) {
    for (let l = -LATERAL; l <= LATERAL; l++) {
      const c = cellAt(px, py, f, d, l);
      if (isSolidWall(map.at(c.x, c.y)) || !lineOfSight(map, px, py, f, d, l)) continue;
      const ms = monstersAt(c.x, c.y);
      if (!ms?.length) continue;
      const u = unit(d, r.h);
      const tone = (dark ? 0.5 : Math.max(0.55, 1 - d * 0.12)) * dim * (1 - murk * 0.12 * d);
      // A group's figures side by side, each kind of it among them (world.ts, groupDrawn).
      const n = ms.length;
      ms.forEach((m, i) => {
        const off = (i - (n - 1) / 2) * u * 0.8;
        if (m.under === 'ice') drawUnderIce(view, m, cx + l * 2 * u + off, d, l, tone, frame + i * 7);
        else drawMonsterSprite(ctx, m.sprite, cx + l * 2 * u + off, horizon + u * 0.95, u * 2 * m.size, m.tint, tone, frame + i * 7);
      });
    }
  }
  // Torch flicker in the dark: a vignette whose reach breathes a little.
  if (dark || (map.kind === 'dungeon' && world.state.light === 0)) {
    const flick = 0.75 + 0.05 * Math.sin(frame / 5) + 0.03 * Math.sin(frame / 13);
    const g = ctx.createRadialGradient(cx, horizon, r.h * 0.22, cx, horizon, r.h * flick);
    g.addColorStop(0, 'rgba(0,0,0,0)'); g.addColorStop(1, 'rgba(0,0,0,0.75)');
    ctx.fillStyle = g; ctx.fillRect(r.x, r.y, r.w, r.h);
  }
  ctx.restore();
  if (weather) drawWeather(ctx, world, r, frame);
}

/**
 * A figure under the ice: its shape dark through the ice, laid flat in its own square and clipped to
 * it, so nothing of it stands over the ice.
 */
function drawUnderIce(v: View, m: ViewMonster, x: number, d: number, l: number, tone: number, frame: number): void {
  const { ctx, cx, horizon, h } = v;
  const pt = (s: number, t: number): [number, number] => floorPt(cx, horizon, h, d, l, s, t);
  const near = pt(0, 0)[1], far = pt(1, 0)[1], mid = (near + far) / 2, tall = unit(d, h) * 2 * m.size;
  const squash = Math.min(0.45, ((near - far) * 0.8) / tall);
  ctx.save();
  ctx.beginPath(); addPoly(ctx, [pt(0, 0), pt(0, 1), pt(1, 1), pt(1, 0)]); ctx.clip();
  ctx.globalAlpha = 0.4;
  ctx.translate(x, mid); ctx.scale(1, squash); ctx.translate(-x, -mid);
  drawMonsterSprite(ctx, m.sprite, x, mid + tall / 2, tall, m.tint, tone * 0.5, frame);
  ctx.restore();
}

/**
 * Paint the scene into `ctx` and, under an open sky, the sky behind it into `skyCtx`. `backdrop`
 * replaces the sky, ground, ceiling and floor fills behind everything with one flat colour, so the
 * smoke test can look for it showing through between the walls.
 */
export function paintScene(ctx: CanvasRenderingContext2D, skyCtx: CanvasRenderingContext2D, world: World, r: ViewRect, backdrop?: string): void {
  const map = world.map;
  const { x: px, y: py, facing: f } = world.state;
  const dark = world.isDark && map.kind !== 'dungeon';
  const daylight = world.daylight;
  const sight = world.sight;
  const wx = world.underSky ? world.weather : null, day = world.date.dayOfYear;
  const env: Env = wx ? { murk: murkOf(wx), cover: wx.cover, wet: wx.cover < 0.3 ? wx.wet : 0, day, trees: treeSeason(day, wx.cover), tide: world.tide } : CLEAR;
  const cloud = wx?.cloud ?? 0;
  // A dark day lights the lamps early.
  const gloom = daylight * (1 - 0.3 * cloud - 0.25 * (wx?.precip ?? 0));
  // Far things fade toward the sky's foot, greyed by cloud and by murk, and the region's air (#1097).
  const look = hearthLook(world.hearth), air = airOf(world);
  const skyBottom = hazeOf(daylight, cloud, env.murk, look.cast, air);
  const haze = map.kind === 'dungeon' ? null : skyBottom;

  // The frame's Paint, which each painter below takes first (#1029): the light and the weather worked
  // out above, whether a feature is there now as the world says, and the flames the scene lights.
  const p = paintOn(ctx, r, map, { dark, haze, daylight, gloom, env, present: (q) => world.present(q) });
  const { cx, horizon } = p;
  ctx.save();
  ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();

  const pal = map.paletteAt(px, py);
  if (backdrop) { ctx.fillStyle = backdrop; ctx.fillRect(r.x, r.y, r.w, r.h); }
  else if (map.kind === 'dungeon') {
    ctx.fillStyle = shade(pal.ceiling, 0.7); ctx.fillRect(r.x, r.y, r.w, r.h / 2);
    ctx.fillStyle = shade(pal.floor, 0.5); ctx.fillRect(r.x, horizon, r.w, r.h / 2);
  } else {
    const { dawn, dusk } = sunTimes(day);
    const at = world.worldCell, hearth = at ? { bearing: hearthBearing(world.tables.atlas, at.x, at.y), step: look.step } : undefined;
    const sky: SkyOpts = { facing: f, hour: (world.state.minutes % 1440) / 60, daylight, dark, dawn, dusk, cloud, murk: env.murk, heavy: wx?.precip ?? 0, drift: world.state.minutes * 0.35, cover: env.cover, day, hearth, cast: look.cast, air };
    drawSkyBand(skyCtx, r, { ...sky, part: 'back' });
    drawSkyBand(ctx, r, { ...sky, part: 'hills' });
    // The ground runs on to the horizon in the terrain out past the last cell drawn, the void's as
    // its look; the bare void and a drop have none, so short of them the ground is the party's own,
    // and past a hill seen from below it the hill's (#53).
    const out = map.at(px + FACING_DX[f] * (DEPTH + 1), py + FACING_DY[f] * (DEPTH + 1)), far = out.look ?? out, brow = hillOver(map, px, py, f, DEPTH + 1, 0);
    const farCell = brow ? map.at(brow.x, brow.y) : far.solid === 'void' || GROUND[far.terrain].drop ? map.at(px, py) : far;
    const ground = shade(groundColor(p, farCell.terrain, pal.floor), dark ? 0.2 : 0.55);
    const gg = ctx.createLinearGradient(0, horizon, 0, horizon + unit(DEPTH + 0.5, r.h));
    gg.addColorStop(0, mix(ground, skyBottom, dark ? 0.1 : 0.5)); gg.addColorStop(1, ground);
    ctx.fillStyle = gg; ctx.fillRect(r.x, horizon, r.w, r.h / 2);
  }

  const order: number[] = [];
  for (let l = -LATERAL; l <= LATERAL; l++) order.push(l);
  order.sort((a, b) => Math.abs(b) - Math.abs(a));
  // A door outdoors among mountain, rock or trees is drawn as they are (drawnCell), and the void as
  // its look, the ground the world map paints there (#829).
  const eye = { x: px, y: py }, drawn = (x: number, y: number): Cell => drawnAt(map, x, y, eye);
  const { behind, solidAt, houseAt, tentAt } = standsAt(map, px, py, f, backdrop);
  const voidAt = (d: number, l: number): boolean => drawn(...toPair(cellAt(px, py, f, d, l))).solid === 'void';
  const boxAt = (d: number, l: number): boolean => solidAt(d, l) && !tentAt(d, l);
  const voids = new Path2D();
  // What a cell's seed steps by to the next cell across and ahead, so a block shared by two faces
  // can take one colour from both sides.
  const rf = ((f + 1) & 3) as Facing;
  const across = FACING_DX[rf] * 131 + FACING_DY[rf] * 17, ahead = FACING_DX[f] * 131 + FACING_DY[f] * 17;
  // Where a point in view space (see the roofs) falls on the screen.
  const at = (X: number, k: number, Y: number): [number, number] => { const u = unit(k, r.h); return [cx + X * u, horizon + Y * u]; };

  // A landmark drawn tall, its lamp lit by night once the party holds its flag; the lamp is drawn
  // every frame, and goes out as a torch does wherever anything nearer is painted over it.
  // One tone near and far, so the tower does not darken as it comes into the squares drawn.
  // The lamp and its flame are a lighthouse's: a monastery's towers stand dark by night.
  const landmarkTone = (dark ? 0.3 : 0.95) * (1 - env.murk * 0.5);
  const drawLandmark = (lm: Landmark, bx: number, by: number, u: number, tone = landmarkTone): void => {
    if (lm.kind === 'monastery') { drawMonasterySprite(ctx, bx, by, u, tone, env.cover); return; }
    const lit = (!lm.lit || !!world.party.flags[lm.lit]) && daylight < 0.35;
    const lamp = drawLighthouseSprite(ctx, bx, by, u, tone, lit ? 1 : 0, env.cover);
    if (!lit) return;
    const fl: Flame = { x: lamp.x, y: lamp.y, s: lamp.r, lamp: true, under: pixel(ctx, lamp.x, lamp.y) };
    // The strip the beam and the glow can reach, read now: what is painted over it later is nearer.
    const R = lamp.r * LAMP_REACH, G = lamp.r * 6;
    const x0 = Math.max(r.x, Math.floor(lamp.x - R)), x1 = Math.min(r.x + r.w, Math.ceil(lamp.x + R));
    const y0 = Math.max(r.y, Math.floor(lamp.y - G)), y1 = Math.min(r.y + r.h, Math.ceil(lamp.y + G));
    if (x1 > x0 && y1 > y0) fl.reach = { x: x0, y: y0, w: x1 - x0, h: y1 - y0, before: ctx.getImageData(x0, y0, x1 - x0, y1 - y0) };
    p.flames.push(fl);
  };
  // Past the squares drawn, a landmark still stands over the land, out to LANDMARK_REACH; anything
  // nearer is painted over it. The weather that takes the fourth square takes it too (fog, a
  // downpour), its lamp with it; short of that, murk fades its tone.
  if (map.kind === 'outdoor' && !backdrop && (!wx || weatherSight(wx) >= 4)) for (const lm of map.landmarks) {
    const dx = lm.x - px, dy = lm.y - py, k = dx * FACING_DX[f] + dy * FACING_DY[f], lat = dx * FACING_DX[rf] + dy * FACING_DY[rf];
    if (k <= Math.min(DEPTH, sight) || k > LANDMARK_REACH) continue;
    const u = unit(k, r.h), bx = cx + lat * 2 * u;
    if (bx < r.x - u * 2 || bx > r.x + r.w + u * 2) continue;
    drawLandmark(lm, bx, horizon + u, u);
  }

  for (let d = DEPTH; d >= 0; d--) {
    if (d > sight) continue;
    // The floors of a row go down before anything stands on them, so a hill can run on over the
    // next square's floor into the next hill; walls and sprites follow.
    for (const l of order) {
      const c = cellAt(px, py, f, d, l);
      const cell = drawn(c.x, c.y), brow = behind(d, l);
      if (brow) { drawFloor(p, 'hills', d, l, c.x * 131 + c.y * 17 + (map.id.length * 7), map.paletteAt(brow.x, brow.y).floor); continue; }
      if (isSolidWall(cell)) continue;
      const seed = c.x * 131 + c.y * 17 + (map.id.length * 7);
      const cellPal = map.paletteAt(c.x, c.y);
      const look = GROUND[cell.terrain];
      const plot = look.plot?.(map, c.x, c.y, f);
      // A drop's rims: where ground stands before it and beyond it, and not the drop.
      const rims = look.drop ? { near: d > 0 && !GROUND[drawn(...toPair(cellAt(px, py, f, d - 1, l))).terrain].drop, far: !GROUND[drawn(...toPair(cellAt(px, py, f, d + 1, l))).terrain].drop } : undefined;
      drawFloor(p, cell.terrain, d, l, seed, cellPal.floor, plot, rims);
      if (map.kind === 'dungeon') drawCeiling(p, cellPal, d, l, seed, f);
    }
    // A hill's mound, its look's, over the row's floors, of the kind its square's region names (#1105):
    // the region as `regionOf` finds it, but none in the void past the zones, whose hills are today's.
    if (d > 0) for (const l of order) {
      const c = cellAt(px, py, f, d, l);
      const t = drawn(c.x, c.y).terrain, mound = GROUND[t].mound;
      if (!mound || isSolidWall(drawn(c.x, c.y)) || behind(d, l)) continue;
      const hillAt = (dl: number): boolean => { const n = drawn(...toPair(cellAt(px, py, f, d, l + dl))); return !!GROUND[n.terrain].mound && !isSolidWall(n) && !behind(d, l + dl); };
      const region = map.zoneAt(c.x, c.y)?.region ?? map.def.region;
      mound(p, groundColor(p, t, map.paletteAt(c.x, c.y).floor), d, l, c.x * 131 + c.y * 17, hillAt(-1), hillAt(1), region && world.tables.looks[region].hills);
    }
    for (const l of order) {
      if (behind(d, l)) continue;
      const c = cellAt(px, py, f, d, l);
      const cell = drawn(c.x, c.y);
      // The party's own cell starts at k = -0.5, where u is infinite and the walls beside the party
      // would come out as NaN and not draw at all. Clip them at k = 0 instead: its edges already
      // project past the viewport (u(0) = 241 against a half-width of 200).
      const nearK = Math.max(0, d - 0.5), farK = d + 0.5;
      const uN = unit(nearK, r.h), uF = unit(farK, r.h);
      const xl = (u: number) => cx + (l - 0.5) * 2 * u, xr = (u: number) => cx + (l + 0.5) * 2 * u;
      const seed = c.x * 131 + c.y * 17 + (map.id.length * 7);

      if (cell.solid === 'void') {
        // The end of the world: a face wherever the cell toward the eye is not void too. A wall
        // there does not hide it, since the void stands taller than any wall; the wall is painted
        // over its foot afterwards, nearer cells coming later.
        const s = Math.sign(l);
        if (d > 0 && !voidAt(d - 1, l)) drawVoidFront(p, voids, xl(uN), xr(uN), r.y, horizon + uN);
        if (l !== 0 && !voidAt(d, l - s)) { const xIn = l > 0 ? xl : xr; drawVoidSide(p, voids, xIn(uN), horizon + uN, xIn(uF), horizon + uF, r.y); }
      } else if (d === 0 && l !== 0 && isSolidWall(cell) && map.landmarkAt(c.x, c.y)?.kind === 'lighthouse' && !backdrop) {
        // At its foot, beside the party: the tower's flank, white and banded red, up past the view. A
        // monastery's square there is the wall of the block it stands in.
        const xIn = l > 0 ? xl : xr;
        drawLighthouseFlank(ctx, xIn(uN), horizon + uN, xIn(uF), horizon + uF, uN, uF, landmarkTone);
      } else if (d > 0 && isSolidWall(cell) && map.landmarkAt(c.x, c.y) && !backdrop) {
        // A landmark stands on its square as it is, not as a wall. Over the smoke test's backdrop it
        // is the wall it stands in for, as the billboards stay out: the crack sweep looks at walls.
        const u = unit(d, r.h);
        drawLandmark(map.landmarkAt(c.x, c.y)!, cx + l * 2 * u, horizon + u, u);
      } else if (isSolidWall(cell)) {
        // A house's chimney stands on the roof behind its slopes, so it goes down before them.
        const b = looksHouse(map, c.x, c.y) ? building(map, c.x, c.y) : null;
        if (b && d > 0 && b.chimney === c.y * map.width + c.x) drawChimney(p, at, d, l);
        if (b) drawRoof(p, at, d, l, houseAt, b.seed, true);
        // A wall's faces are hidden by the wall beside them and join its faces; a tent's by its own
        // squares and by a wall, and they join only its own.
        const tent = tentAt(d, l) ? tentOf(map, c.x, c.y) : null;
        const own = tent ? (dd: number, ll: number): boolean => inTent(tent, cellAt(px, py, f, dd, ll)) && tentAt(dd, ll) : boxAt;
        const hid = tent ? (dd: number, ll: number): boolean => own(dd, ll) || boxAt(dd, ll) : boxAt;
        // The wall both its faces are drawn for.
        const wall = { cell, mx: c.x, my: c.y, d, seed, tent: !!tent };
        // Where a face runs on into the next face of the same wall, the two join with no seam and
        // no outline between them; outlines are for corners and for where a wall ends.
        if (d > 0 && !hid(d - 1, l)) {
          const joinL = own(d, l - 1) && !hid(d - 1, l - 1), joinR = own(d, l + 1) && !hid(d - 1, l + 1);
          drawFrontFace(p, wall, xl(uN), xr(uN), uN, joinL, joinR, across);
        }
        const s = Math.sign(l);
        if (l !== 0 && !hid(d, l - s)) {
          const joinNear = d === 0 || (own(d - 1, l) && !hid(d - 1, l - s)), joinFar = own(d + 1, l) && !hid(d + 1, l - s);
          const xIn = l > 0 ? xl : xr;
          drawSideFace(p, wall, { x: xIn(uN), u: uN }, { x: xIn(uF), u: uF }, l > 0, { joinNear, joinFar, openFar: !own(d + 1, l) }, ahead);
        }
        if (b) drawRoof(p, at, d, l, houseAt, b.seed, false);
        if (tent) drawTentRoof(p, at, tentView(tent, px, py, f), d, l, map.paletteAt(c.x, c.y));
        for (const fl of p.flames) fl.under ??= pixel(ctx, fl.x, fl.y);
      } else if (d > 0 && cell.solid !== 'none' && !backdrop) {
        // Over the smoke test's backdrop the billboards stay out: their gaps are not cracks.
        const u = unit(d, r.h);
        const bx = cx + l * 2 * u, by = horizon + u;
        const tone = (dark ? 0.3 : Math.max(0.5, 1 - d * 0.12)) * (1 - env.murk * 0.1 * d);
        // The ground may draw its own for what stands on it: a glass tree on crystal, a mountain by its rock.
        const own = GROUND[cell.terrain].boards?.[cell.solid];
        if (own) own(p, { x: bx, y: by, u, tone, mx: c.x, my: c.y, cloud });
        else if (cell.solid === 'tree') drawTreeSprite(ctx, bx, by, u, tone, Math.floor(hash(c.x, c.y) * 5), env.trees);
        else if (cell.solid === 'rock') drawRockSprite(ctx, bx, by, u, tone, env.cover);
        else if (cell.solid === 'mountain') drawMountainSprite(ctx, bx, by, u, tone, Math.floor(hash(c.x, c.y, 3) * 3));
        else if (cell.solid === 'pillar') drawPillarSprite(ctx, bx, horizon, u, tone);
      } else if (d > 0 && GROUND[cell.terrain].sides && !backdrop) {
        // Light woods: a tree or two stand to the sides of the square, leaving the way through it open,
        // each of the kind and size its look gives. None stands on a side a wall or the void closes:
        // drawn after them, it would stand in front.
        const u = unit(d, r.h), sides = GROUND[cell.terrain].sides!;
        const tone = (dark ? 0.3 : Math.max(0.5, 1 - d * 0.12)) * (1 - env.murk * 0.1 * d);
        for (const side of [-1, 1]) {
          if (hash(c.x, c.y, 60 + side) < sides.bare || solidAt(d, l + side)) continue;
          const bx = cx + (l * 2 + side * (0.62 + 0.22 * hash(c.x, c.y, 62 + side))) * u, by = horizon + u * (0.8 + 0.4 * hash(c.x, c.y, 64 + side));
          const s = u * (sides.size + sides.spread * hash(c.x, c.y, 66 + side));
          sides.tree(p, bx, by, s, tone, hash(c.x, c.y, 68 + side));
        }
      }
      // The features on open ground, each as the automap marks it, after what else stands there
      // (view/features.ts, #1110); over the smoke test's backdrop they stay out, as the billboards do.
      if (d > 0 && cell.solid === 'none' && !backdrop) drawFeatures(p, world, c.x, c.y, d, l);
    }
  }
  // A torch goes out where anything nearer was painted over it, a tree or a rock or a wall.
  p.flames = p.flames.filter((fl) => pixel(ctx, fl.x, fl.y) === fl.under);
  painted = p.flames;
  // A lamp's light shows only where nothing nearer was painted over the strip it reaches.
  for (const fl of p.flames) if (fl.reach?.before) {
    const { x, y, w, h, before } = fl.reach, now = ctx.getImageData(x, y, w, h).data, b = before.data;
    const mask = document.createElement('canvas'); mask.width = w; mask.height = h;
    const mctx = mask.getContext('2d')!, m = mctx.createImageData(w, h);
    for (let i = 0; i < now.length; i += 4) if (now[i] === b[i] && now[i + 1] === b[i + 1] && now[i + 2] === b[i + 2] && now[i + 3] === b[i + 3]) m.data[i + 3] = 255;
    mctx.putImageData(m, 0, 0);
    fl.reach = { x, y, w, h, mask };
  }
  // An overcast day's flat grey light over everything painted; the sky has its own greys.
  const veil = cloud * 0.2 + env.murk * 0.12;
  if (veil > 0.01) {
    ctx.globalCompositeOperation = 'source-atop';
    ctx.fillStyle = rgba(mix('#0a0c12', '#56606e', daylight), veil); ctx.fillRect(r.x, r.y, r.w, r.h);
    ctx.globalCompositeOperation = 'source-over';
  }
  // The end of the world, filled in behind everything painted: only the holes the void cut take it.
  ctx.globalCompositeOperation = 'destination-over';
  ctx.fillStyle = VOID_PINK; ctx.fill(voids);
  ctx.globalCompositeOperation = 'source-over';
  ctx.restore();
}
