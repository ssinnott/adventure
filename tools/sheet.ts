// The contact sheet: every new map, monster and interior of a pull request on one page, for the owner
// to judge from pictures rather than a checkout (EXPANSION §5.7).
//   node tools/sheet.ts out.png --area thornmark
//   node tools/sheet.ts out.png [--maps thornhold,grove1] [--monsters tm_ogre] [--interiors green_man]
//   node tools/sheet.ts out.png --changed origin/main
//   node tools/sheet.ts out.png --rifts all          (or --rifts ring,spiral)
//   node tools/sheet.ts out.png --ground all         (or --ground ash,ice or cliff,peak)
// --changed draws what changed since the base, as tools/changed.ts reads it; with nothing changed
// it says so, writes nothing and exits 0. A change to this tool draws everything. --rifts draws the
// Rift templates as content/rifts' samples dress them, which no area places; a placed Rift is a map.
// --ground draws the samples of the ground underfoot (tools/grounds.ts), and so does a change that
// draws every map or the samples, so a new ground is seen before any map holds it.
// Each map from its arrivals and, outdoors, from each of its sites on the world map, by day and by
// night, with its automap revealed whole and its crop of the world map; a dungeon once, lit, since
// it has no day or night. Each monster as a strip of idle frames ending on the hit flash. Each
// interior at noon and at night. The world is pinned (the seed as the smoke test pins it, high
// summer, a clear sky), so the same tree makes the same PNG.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { createServer } from './server.ts';
import { changedFiles, changedMaps, changedMonsters, changedInteriors } from './changed.ts';
import { AREAS, MAP_DEFS as PLACED, MONSTERS, INTERIORS, ATLAS, CLIMATES } from '../src/content/index.ts';
import { RIFT_SAMPLES } from '../src/content/rifts/index.ts';
import { GROUND_SAMPLES } from './grounds.ts';
import { GameMap } from '../src/game/map.ts';
import { worldPoint, mapAt } from '../src/game/atlas.ts';
import type { MapDef } from '../src/game/map.ts';
import { FACING_DX, FACING_DY } from '../src/game/types.ts';
import type { Facing } from '../src/game/types.ts';
import { weatherAt, classify } from '../src/game/weather.ts';
import type { RegionId } from '../src/game/weather.ts';
import { daylightAt, MINUTES_PER_DAY, MIDSUMMER, EPOCH_DAY, DAYS_PER_YEAR } from '../src/game/calendar.ts';

const require = createRequire(import.meta.url);
const USAGE = 'usage: node tools/sheet.ts out.png [--area <id>] [--maps a,b] [--monsters x,y] [--interiors p,q] [--rifts all|a,b] [--ground all|a,b] [--changed <base>]';
const fail = (msg: string): never => { console.error(msg); process.exit(2); };
// Strict: one output path, and each known flag once with a value. Anything else is refused, so a
// misspelt flag never makes an empty sheet that looks like nothing changed.
const FLAGS = ['area', 'maps', 'monsters', 'interiors', 'rifts', 'ground', 'changed'];
const opts: Record<string, string> = {};
let out: string | undefined;
for (let i = 2; i < process.argv.length; i++) {
  const a = process.argv[i];
  if (a.startsWith('--')) {
    const name = a.slice(2), v = process.argv[i + 1];
    if (!FLAGS.includes(name)) fail(`unknown flag ${a}\n${USAGE}`);
    if (name in opts) fail(`${a} given twice\n${USAGE}`);
    if (v === undefined || v.startsWith('--') || v === '') fail(`${a} needs a value\n${USAGE}`);
    opts[name] = v; i++;
  } else if (out === undefined) out = a;
  else fail(`one output path only, not '${out}' and '${a}'\n${USAGE}`);
}
if (!out) fail(USAGE);
if (!/\.png$/i.test(out!)) fail(`'${out}' is not a .png: the sheet is written as a PNG\n${USAGE}`);
if (!Object.keys(opts).length) fail(`nothing to draw\n${USAGE}`);
const opt = (name: string): string | undefined => opts[name];
const list = (name: string): string[] => opt(name)?.split(',').filter(Boolean) ?? [];

// ---------------------------------------------------------------- what goes on it

let maps = list('maps'), monsters = list('monsters'), interiors = list('interiors');
// The Rift samples by template, drawn as maps: put with the maps as written so the rest finds them.
// The ground's samples are always with them, so a change that draws every map draws them too.
const samples = opt('rifts') === 'all' ? RIFT_SAMPLES.map((d) => d.id) : list('rifts').map((t) => `rift_${t}`);
const grounds = opt('ground') === 'all' ? GROUND_SAMPLES.map((d) => d.id) : list('ground').map((t) => `ground_${t}`);
const SAMPLES = [...RIFT_SAMPLES, ...GROUND_SAMPLES];
const MAP_DEFS = [...PLACED, ...RIFT_SAMPLES.filter((d) => samples.includes(d.id)), ...GROUND_SAMPLES];
maps = [...maps, ...samples, ...grounds];
const areaId = opt('area');
if (areaId) {
  const area = AREAS.find((a) => a.id === areaId) ?? fail(`unknown area '${areaId}' (${AREAS.map((a) => a.id).join(', ')})`);
  maps = [...maps, ...area.maps.map((d) => d.id)];
  monsters = [...monsters, ...area.monsters.map((d) => d.id)];
  interiors = [...interiors, ...area.interiors];
}
const base = opt('changed');
if (base) {
  const files = changedFiles(base);
  const everything = files.includes('tools/sheet.ts');
  const m = await changedMaps(files), mo = await changedMonsters(files, base), i = await changedInteriors(files, base);
  maps = [...maps, ...(everything || m.all ? MAP_DEFS.map((d) => d.id) : m.maps), ...(files.includes('tools/grounds.ts') ? GROUND_SAMPLES.map((d) => d.id) : [])];
  monsters = [...monsters, ...(everything || mo.all ? Object.keys(MONSTERS) : mo.monsters)];
  interiors = [...interiors, ...(everything || i.all ? INTERIORS : i.interiors)];
}
maps = [...new Set(maps)]; monsters = [...new Set(monsters)]; interiors = [...new Set(interiors)];
const unknown = [
  ...maps.filter((id) => !MAP_DEFS.some((d) => d.id === id)).map((id) => (id.startsWith('rift_') && samples.includes(id) ? `rift template '${id.slice(5)}'` : grounds.includes(id) ? `ground '${id.slice(7)}'` : `map '${id}'`)),
  ...monsters.filter((id) => !Object.hasOwn(MONSTERS, id)).map((id) => `monster '${id}'`),
  ...interiors.filter((id) => !(INTERIORS as readonly string[]).includes(id)).map((id) => `interior '${id}'`),
];
if (unknown.length) fail(`unknown ${unknown.join(', ')}`);
if (!maps.length && !monsters.length && !interiors.length) {
  if (base) { console.log(`nothing new since ${base}: no sheet`); process.exit(0); }
  fail(`nothing to draw\n${USAGE}`);
}

interface View { label: string; x: number; y: number; facing: Facing }
interface MapPlan { id: string; name: string; kind: string; region: RegionId; views: View[]; world: { x: number; y: number; w: number; h: number; mark: [number, number] } | null; sample?: MapDef; ground?: boolean }

const FACING_NAME = ['north', 'east', 'south', 'west'];
const open = (m: GameMap, x: number, y: number): boolean => m.inBounds(x, y) && m.at(x, y).solid === 'none' && !['water', 'deep', 'lava', 'chasm'].includes(m.at(x, y).terrain);

/**
 * A map's ways out: its exits, its tears into Rifts, which are walked through as exits are, and the
 * crossings its people sell, from where the seller stands to where the crossing lands.
 */
type Way = { x: number; y: number; to: string; tx: number; ty: number; tf?: Facing };
const waysOut = (d: MapDef): Way[] =>
  [...(d.exits ?? []), ...(d.features ?? []).flatMap((f): Way[] => (f.kind === 'rift' ? [f] : f.kind === 'npc' ? (f.passage ?? []).map((p) => ({ x: f.x, y: f.y, to: p.to, tx: p.x, ty: p.y, tf: p.facing })) : []))];

/** Where the party arrives: the map's start, and every other map's way in, once each. */
function arrivals(def: MapDef): View[] {
  const seen = new Set<string>(), views: View[] = [];
  const add = (x: number, y: number, facing: Facing, from: string): void => {
    const k = `${x},${y},${facing}`;
    if (seen.has(k)) return;
    seen.add(k); views.push({ label: `from ${from}, ${x},${y} facing ${FACING_NAME[facing]}`, x, y, facing });
  };
  add(def.start.x, def.start.y, def.start.facing, 'the start');
  for (const d of MAP_DEFS) for (const e of waysOut(d)) if (e.to === def.id && d.id !== def.id) add(e.tx, e.ty, e.tf ?? def.start.facing, d.name);
  return views;
}

/**
 * Where a site on the world map is seen from: an open square two or three back from it, looking
 * straight at it, nearest first; failing that, the nearest open square, facing the way that looks
 * most nearly at it.
 */
function siteView(m: GameMap, name: string, at: readonly [number, number]): View | null {
  const sx = Math.floor(at[0]), sy = Math.floor(at[1]);
  for (const d of [2, 3]) for (const f of [0, 1, 2, 3] as Facing[]) {
    const x = sx - FACING_DX[f] * d, y = sy - FACING_DY[f] * d;
    if (open(m, x, y) && open(m, x + FACING_DX[f], y + FACING_DY[f])) return { label: `${name}, from ${x},${y} facing ${FACING_NAME[f]}`, x, y, facing: f };
  }
  for (let r = 1; r <= 4; r++) for (let y = sy - r; y <= sy + r; y++) for (let x = sx - r; x <= sx + r; x++) {
    if (!open(m, x, y) || Math.max(Math.abs(x - sx), Math.abs(y - sy)) !== r) continue;
    const dx = sx - x, dy = sy - y;
    const facing: Facing = Math.abs(dx) > Math.abs(dy) ? (dx > 0 ? 1 : 3) : (dy > 0 ? 2 : 0);
    return { label: `${name}, from ${x},${y} facing ${FACING_NAME[facing]}`, x, y, facing };
  }
  return null;
}

/** The outdoor square, as a world point, that leads to a map, through as many maps as it takes. */
function entrance(id: string, seen = new Set<string>()): [number, number] | null {
  seen.add(id);
  for (const d of MAP_DEFS) for (const e of waysOut(d)) {
    if (e.to !== id || seen.has(d.id)) continue;
    const p = worldPoint(ATLAS, d.id, e.x, e.y) ?? entrance(d.id, seen);
    if (p) return p;
  }
  return null;
}

function planMap(id: string): MapPlan {
  const def = MAP_DEFS.find((d) => d.id === id)!;
  const m = new GameMap(def);
  const views = arrivals(def);
  for (const s of ATLAS.sites) {
    if (s.map !== id || s.planned) continue;
    const v = siteView(m, s.name, s.at);
    if (v) views.push(v); else fail(`site '${s.name}' on ${id} has no open square within four`);
  }
  // Its crop of the world map, in world cells, with `mark` ringed: outdoors, the zone with a
  // margin and the first view's square; a town or a dungeon, round the outdoor square it is
  // entered from (through the maps that lead to it), which the art cloth draws where the plate
  // centre is not.
  const at = mapAt(ATLAS, id);
  let world: MapPlan['world'] | undefined;
  if (at) world = { x: at[0] - 8, y: at[1] - 8, w: m.width + 16, h: m.height + 16, mark: [at[0] + views[0].x + 0.5, at[1] + views[0].y + 0.5] };
  else {
    const door = entrance(id);
    if (door) world = { x: Math.floor(door[0]) - 20, y: Math.floor(door[1]) - 20, w: 40, h: 40, mark: door };
  }
  // A sample is entered from nowhere, so it has no crop; it is put into the game's maps to be shot.
  const sample = SAMPLES.find((d) => d.id === id);
  if (!world && !sample) return fail(`map '${id}' has no zone and no way in from the outdoors`);
  return { id, name: def.name, kind: def.kind, region: def.region ?? 'shelf', views, world: world ?? null, ...(sample ? { sample, ground: GROUND_SAMPLES.includes(sample) } : {}) };
}

const mapPlans = maps.map(planMap);

// ---------------------------------------------------------------- the pinned world

// The page's Math.random is pinned as the smoke test pins it (tools/smoke.ts), so the new game's
// seed, and so its weather seed, is the same every run.
const SEED = 1;

function loadPlaywright(): any {
  for (const c of ['/opt/node22/lib/node_modules/playwright', '/usr/lib/node_modules/playwright', 'playwright', 'playwright-core']) {
    try { return require(c); } catch { /* next */ }
  }
  throw new Error('Playwright not found');
}
async function launch(chromium: any): Promise<any> {
  try { return await chromium.launch(); }
  catch (e) {
    const exe = process.env.PLAYWRIGHT_CHROMIUM || '/opt/pw-browsers/chromium';
    if (fs.existsSync(exe)) return chromium.launch({ executablePath: exe });
    throw e;
  }
}

const t0 = Date.now();
const server = createServer();
await new Promise<void>((r) => server.listen(0, () => r()));
const port = (server.address() as { port: number }).port;
const { chromium } = loadPlaywright();
const browser = await launch(chromium);
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
await page.addInitScript((seed: number) => {
  let s = seed >>> 0, first = true;
  Math.random = () => {
    if (first) { first = false; return (seed + 0.5) / 0x7fffffff; }
    s = (s + 0x6d2b79f5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}, SEED);
const errors: string[] = [];
page.on('pageerror', (e: Error) => errors.push('pageerror: ' + e.message));
page.on('console', (m: any) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
await page.goto(`http://localhost:${port}/`, { waitUntil: 'load' });
await page.waitForFunction(() => (window as any).__game?.ready === true, null, { timeout: 15000 });
// Title, then the premade company.
await page.keyboard.press('Space'); await page.waitForTimeout(80);
await page.keyboard.press('Space'); await page.waitForTimeout(120);
const weatherSeed: number = await page.evaluate(() => (window as any).__game.game.world.state.weatherSeed);

/**
 * The day and the two hours each region is shot at: high summer, so the trees are in leaf and the
 * night short, on the first day from midsummer with a clear sky at noon and at the first hour of
 * full dark; a cloudy one if a month has no clear one.
 */
function when(region: RegionId): { day: number; noon: number; night: number; sky: string } {
  const midsummer = ((MIDSUMMER - EPOCH_DAY) % DAYS_PER_YEAR + DAYS_PER_YEAR) % DAYS_PER_YEAR;
  const at = (day: number): { noon: number; night: number } => {
    const noon = day * MINUTES_PER_DAY + 12 * 60;
    let night = noon;
    while (daylightAt(night) > 0) night += 60;
    return { noon, night };
  };
  const sky = (min: number): string => classify(weatherAt(weatherSeed, min, CLIMATES[region])).sky;
  for (const ok of [['clear'], ['clear', 'cloudy']]) {
    for (let d = 0; d < 30; d++) {
      const day = midsummer + d, t = at(day);
      if (ok.includes(sky(t.noon)) && ok.includes(sky(t.night))) return { day, ...t, sky: ok.join(' or ') };
    }
  }
  return { day: midsummer, ...at(midsummer), sky: 'whatever came' };
}
const times = Object.fromEntries([...new Set(mapPlans.map((p) => p.region))].map((r) => [r, when(r)]));

// ---------------------------------------------------------------- the page

const monsterIds = monsters, interiorIds = interiors;
const shot = await page.evaluate(async (o: { maps: MapPlan[]; times: Record<string, { day: number; noon: number; night: number; sky: string }>; monsters: string[]; interiors: string[] }) => {
  // Served by the dev server, resolved by the browser: opaque to the typechecker on purpose.
  const load = (p: string): Promise<any> => import(p);
  const T = await load('/src/lib/engine/text.ts');
  const S = await load('/src/ui/sprites.ts');
  const I = await load('/src/ui/interior.ts');
  const WM = await load('/src/ui/worldmap.ts');
  const C = await load('/src/content/index.ts');
  const GM = await load('/src/game/map.ts');
  const P = await load('/src/ui/palette.ts');
  const g = (window as any).__game.game, w = g.world;

  // The stage's top: the view, the status strip, the automap and the purse, above the party cards.
  const SHOT = { w: 640, h: 284 }, GAP = 12, CAP = 14, MARGIN = 16, CROP = 284;
  const stage = document.createElement('canvas'); stage.width = 640; stage.height = 360;
  const sctx = stage.getContext('2d')!;
  // The cloth at 4 pixels a world cell inside a 16-pixel border (ui/worldmap.ts's S and PAD).
  const CS = 4, CPAD = 16;
  if (WM.CLOTH.w !== C.ATLAS.width * CS + CPAD * 2) throw new Error('the cloth is no longer 4 pixels a cell inside 16: update tools/sheet.ts');
  const cloth: HTMLCanvasElement | null = o.maps.length ? WM.renderCloth('art', null, 0) : null;

  // Draw each part into a list of blocks, then lay the blocks down the page.
  type Block = { h: number; w: number; draw: (ctx: CanvasRenderingContext2D, x: number, y: number) => void };
  const blocks: Block[] = [];
  const heading = (text: string): void => { blocks.push({ w: 0, h: 22, draw: (ctx, x, y) => T.drawText(ctx, text.toUpperCase(), x, y + 6, { size: 2, color: '#e8dcc0' }) }); };
  const caption = (ctx: CanvasRenderingContext2D, text: string, x: number, y: number): void => T.drawText(ctx, text, x, y + 2, { size: 1, color: '#c8bca0' });
  const snapshot = (): HTMLCanvasElement => { const c = document.createElement('canvas'); c.width = SHOT.w; c.height = SHOT.h; c.getContext('2d')!.drawImage(stage, 0, 0); return c; };
  const clock = (min: number): string => `${String(Math.floor(min % 1440 / 60)).padStart(2, '0')}:00`;

  for (const m of o.maps) {
    if (m.sample) w.maps[m.id] = new GM.GameMap(m.sample);
    const t = o.times[m.region], dungeon = m.kind === 'dungeon';
    heading(`${m.name} (${m.id}, ${m.kind})`);
    const shots: { label: string; day: HTMLCanvasElement; night: HTMLCanvasElement | null }[] = [];
    for (const v of m.views) {
      const one = (min: number): HTMLCanvasElement => {
        w.travel(m.id, v.x, v.y, v.facing);
        w.state.minutes = min; w.sky = null;
        w.state.light = dungeon ? 999 : 0;
        // The whole map revealed on the automap (outdoors, the zone's own cells, not its neighbours'
        // or the void round them), and a clear log: nothing over the view but the game.
        const ms = w.mapState, mw = w.map.width, z = w.map.zones.find((q: any) => q.id === m.id);
        const r = z ?? { x: 0, y: 0, w: mw, h: w.map.height };
        for (let yy = r.y; yy < r.y + r.h; yy++) for (let xx = r.x; xx < r.x + r.w; xx++) { const i = yy * mw + xx; ms.explored[i >> 5] |= 1 << (i & 31); }
        g.log = [];
        g.frame = 0;
        sctx.clearRect(0, 0, 640, 360);
        // No 'A sign: Space' hint over the view: the sheet shows the place, not what is to hand in
        // it. A group ahead keeps its 'Space to attack', since the same lookup draws the group.
        w.featureHere = () => undefined;
        try { g.render(sctx); } finally { delete w.featureHere; }
        return snapshot();
      };
      shots.push({ label: v.label, day: one(t.noon), night: dungeon ? null : one(t.night) });
    }
    const crop = document.createElement('canvas'); crop.width = crop.height = CROP;
    const cc = crop.getContext('2d')!;
    cc.imageSmoothingEnabled = false;
    cc.fillStyle = '#120c14'; cc.fillRect(0, 0, CROP, CROP);
    if (m.world) {
      const k = CROP / (Math.max(m.world.w, m.world.h) * CS);
      const cx = CPAD + m.world.x * CS, cy = CPAD + m.world.y * CS;
      cc.drawImage(cloth!, cx, cy, m.world.w * CS, m.world.h * CS, 0, 0, m.world.w * CS * k, m.world.h * CS * k);
      const [mx, my] = [(CPAD + m.world.mark[0] * CS - cx) * k, (CPAD + m.world.mark[1] * CS - cy) * k];
      cc.strokeStyle = '#c0201a'; cc.lineWidth = 2; cc.beginPath(); cc.arc(mx, my, 6, 0, Math.PI * 2); cc.stroke();
    } else if (m.sample) {
      // A sample is on no world map: its plan instead, the tear red, the warden and the groups
      // orange, the hoard gold, the looks pale and the way in green; a ground's in its grounds' colours.
      const d = m.sample, cs = Math.floor(CROP / d.rows.length), dot = (x: number, y: number, c: string): void => { cc.fillStyle = c; cc.fillRect(x * cs + cs / 4, y * cs + cs / 4, cs / 2, cs / 2); };
      const ground = (ch: string): string => { const q = GM.LEGEND[ch]; return q.solid === 'wall' ? '#3a3440' : q.solid === 'mountain' ? (q.terrain === 'peak' || q.terrain === 'cliff' ? P.TERRAIN_COLORS[q.terrain] : '#6a6058') : q.solid === 'rock' ? '#8a7a6a' : P.TERRAIN_COLORS[q.terrain]; };
      d.rows.forEach((row: string, y: number) => [...row].forEach((ch, x) => { cc.fillStyle = m.ground ? ground(ch) : ch === '#' ? '#3a3440' : ch === 'o' ? '#6a6070' : ch === 'D' ? '#8a5a2a' : '#d8ccb0'; cc.fillRect(x * cs, y * cs, cs - 1, cs - 1); }));
      for (const f of d.features ?? []) dot(f.x, f.y, f.kind === 'chest' ? '#e0b030' : 'id' in f && /_look\d+$/.test(f.id ?? '') ? '#9aa0b0' : '#c0201a');
      for (const e of d.encounters ?? []) dot(e.x, e.y, '#e07020');
      for (const e of d.exits ?? []) dot(e.x, e.y, '#3a9a3a');
    }
    shots.forEach((s, i) => {
      const hh = CAP + SHOT.h;
      blocks.push({ w: CROP + GAP + SHOT.w * 2 + GAP, h: hh, draw: (ctx, x, y) => {
        if (i === 0) { caption(ctx, m.world ? 'on the world map' : 'its plan', x, y); ctx.drawImage(crop, x, y + CAP); }
        const x1 = x + CROP + GAP;
        caption(ctx, `${s.label}: ${dungeon ? 'lit' : clock(t.noon)}`, x1, y);
        ctx.drawImage(s.day, x1, y + CAP);
        if (s.night) { caption(ctx, `${clock(t.night)}, ${t.sky}`, x1 + SHOT.w + GAP, y); ctx.drawImage(s.night, x1 + SHOT.w + GAP, y + CAP); }
      } });
    });
  }

  if (o.monsters.length) {
    heading('Monsters');
    // A strip as tools/gallery.ts --frames 4 --flash draws it, at the combat screen's size.
    const FRAMES = 4, FW = 160, CELL_W = FW * FRAMES + 20;
    for (let i = 0; i < o.monsters.length; i += 2) {
      const pair = o.monsters.slice(i, i + 2).map((id) => C.MONSTERS[id]);
      const mainH = Math.round(Math.max(...pair.map((d: any) => S.combatHeight(d.size, 3))) * 1.5);
      const hh = CAP + mainH + 8;
      blocks.push({ w: CELL_W * 2 + GAP, h: hh, draw: (ctx, x, y) => pair.forEach((d: any, j: number) => {
        const x0 = x + j * (CELL_W + GAP), y0 = y + CAP, ground = y0 + mainH * 0.93;
        caption(ctx, `${d.name}  (${d.id}, ${d.sprite}, size ${d.size})`, x0, y);
        ctx.fillStyle = '#7a8a5a'; ctx.fillRect(x0, y0, CELL_W, mainH);
        ctx.fillStyle = '#5a6a3a'; ctx.fillRect(x0, ground, CELL_W, y0 + mainH - ground);
        ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, CELL_W, mainH); ctx.clip();
        for (let f = 0; f < FRAMES; f++) S.drawMonsterSprite(ctx, d.sprite, x0 + 10 + FW * (f + 0.5), ground, S.combatHeight(d.size, 3), d.tint, 1, f * 6, f === FRAMES - 1);
        ctx.restore();
      }) });
    }
  }

  if (o.interiors.length) {
    heading('Interiors');
    const IW = 400, IH = 268;
    for (let i = 0; i < o.interiors.length; i += 2) {
      const pair = o.interiors.slice(i, i + 2);
      blocks.push({ w: (IW * 2 + GAP) * 2 + GAP, h: CAP + IH, draw: (ctx, x, y) => pair.forEach((k: string, j: number) => {
        for (const [n, daylight, hour] of [[0, 1, '12:00'], [1, 0, '21:00']] as const) {
          const x0 = x + (j * 2 + n) * (IW + GAP);
          caption(ctx, `${k}  ${hour}`, x0, y);
          ctx.save(); ctx.beginPath(); ctx.rect(x0, y + CAP, IW, IH); ctx.clip();
          I.drawInterior(ctx, k, { x: x0, y: y + CAP, w: IW, h: IH }, daylight, 40);
          ctx.restore();
        }
      }) });
    }
  }

  const c = document.createElement('canvas');
  c.width = Math.max(...blocks.map((b) => b.w)) + MARGIN * 2;
  c.height = blocks.reduce((h, b) => h + b.h + GAP, MARGIN * 2 - GAP);
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  ctx.fillStyle = '#1c1720'; ctx.fillRect(0, 0, c.width, c.height);
  let y = MARGIN;
  for (const b of blocks) { b.draw(ctx, MARGIN, y); y += b.h + GAP; }
  return { png: c.toDataURL('image/png'), w: c.width, h: c.height };
}, { maps: mapPlans, times, monsters: monsterIds, interiors: interiorIds });

await browser.close(); server.close();
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
fs.writeFileSync(out!, Buffer.from(shot.png.slice(shot.png.indexOf(',') + 1), 'base64'));
const views = mapPlans.reduce((n, p) => n + p.views.length, 0);
console.log(`wrote ${out} (${maps.length} maps from ${views} views, ${monsters.length} monsters, ${interiors.length} interiors; ${shot.w}x${shot.h}, ${((Date.now() - t0) / 1000).toFixed(1)} s)`);
