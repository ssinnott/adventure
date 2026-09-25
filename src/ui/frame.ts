// The frame around the viewport: the status strip, the automap, the party cards and the message
// log. Layout for the 640x360 canvas is fixed here in LAYOUT so every screen agrees on it.
import { drawText } from '../lib/engine/text.ts';
import type { World } from '../game/world.ts';
import type { Party, Character } from '../game/party.ts';
import { worstCondition, isDown, CLASSES, xpForLevel } from '../game/party.ts';
import { FACING_NAMES } from '../game/types.ts';
import { panel, bar, wrap } from './draw.ts';
import { viewCells } from './viewport.ts';
import { drawPortrait } from './portraits.ts';
import { INK, PANEL, PANEL_LIGHT, BRASS, BRASS_DARK, TEXT, TEXT_DIM, RED, BLUE, GREEN, YELLOW, PURPLE, TERRAIN_COLORS, PARCHMENT, WOOD, WOOD_DARK } from './palette.ts';
import { shade, rgba, mix } from '../lib/art/palettes.ts';
const PARCHMENT_DARK = '#d8c8a0';
import { hash } from './brush.ts';
import { shortDate } from '../game/calendar.ts';
import { classify, isRainy, isSnowy, SKY_NAMES } from '../game/weather.ts';
import type { Sky } from '../game/weather.ts';

export const LAYOUT = {
  view: { x: 8, y: 8, w: 400, h: 268 },
  status: { x: 416, y: 8, w: 216, h: 30 },
  map: { x: 416, y: 42, w: 216, h: 214 },
  purse: { x: 416, y: 260, w: 216, h: 16 },
  party: { x: 8, y: 284, w: 624, h: 68 },
  log: { x: 8, y: 8, w: 400, h: 268 },
} as const;

const CARD_W = 100, CARD_GAP = 4.8;

export function cardRect(i: number): { x: number; y: number; w: number; h: number } {
  return { x: Math.round(LAYOUT.party.x + i * (CARD_W + CARD_GAP)), y: LAYOUT.party.y, w: CARD_W, h: LAYOUT.party.h };
}

const COND_COLOR: Record<string, string> = {
  dead: RED, stoned: TEXT_DIM, unconscious: RED, paralysed: YELLOW, asleep: BLUE, poisoned: GREEN, diseased: PURPLE, cursed: PURPLE,
};

/** Two lines: the facing, the time and the map; then the date, and the sky with its glyph (not underground). */
export function drawStatus(ctx: CanvasRenderingContext2D, world: World): void {
  const r = LAYOUT.status;
  panel(ctx, r.x, r.y, r.w, r.h);
  const hh = String(world.hour).padStart(2, '0'), mm = String(world.minute).padStart(2, '0');
  drawText(ctx, `${FACING_NAMES[world.state.facing]}`, r.x + 6, r.y + 6, { size: 1, color: BRASS });
  drawText(ctx, `${hh}:${mm}`, r.x + 18, r.y + 6, { size: 1, color: TEXT });
  drawText(ctx, world.map.name, r.x + r.w - 6, r.y + 6, { size: 1, color: TEXT_DIM, align: 'right' });
  drawText(ctx, shortDate(world.date), r.x + 6, r.y + 17, { size: 1, color: TEXT });
  if (!world.underSky) return;
  const sky = (world.sky ?? classify(world.weather)).sky;
  const w = drawText(ctx, SKY_NAMES[sky], r.x + r.w - 6, r.y + 17, { size: 1, color: TEXT_DIM, align: 'right' });
  drawSkyGlyph(ctx, sky, r.x + r.w - 6 - w - 12, r.y + 17, world.daylight < 0.25);
}

/**
 * The sky's glyphs, 9 by 7 like the font: '#' the body (the sun, the moon, a cloud), 'o' what falls
 * or strikes from it. A clear or cloudy sky shows the sun by day and the moon by night.
 */
const SKY_GLYPHS: Record<string, string> = {
  sun: '....#....|.#.....#.|...###...|#.#####.#|...###...|.#.....#.|....#....',
  moon: '...###...|..##.....|.##......|.##......|.##......|..##.....|...###...',
  cloud: '.........|...##....|..####.#.|.#######.|#########|.#######.|.........',
  cloudy: '....o....|.o.o##...|...####.#|.#######.|#########|.#######.|.........',
  fog: '.........|#######..|.........|..#######|.........|#######..|.........',
  light: '...##....|..####.#.|#########|.#######.|.........|..o...o..|.o...o...',
  steady: '...##....|..####.#.|#########|.#######.|.........|.o.o.o.o.|o.o.o.o..',
  heavy: '...##....|..####.#.|#########|.#######.|o.o.o.o.o|.o.o.o.o.|o.o.o.o.o',
  storm: '...##....|..####.#.|#########|.#######.|....oo...|...oo....|..o......',
};
const GLYPH_OF: Record<Sky, string> = {
  clear: 'sun', cloudy: 'cloudy', overcast: 'cloud', fog: 'fog', drizzle: 'light', rain: 'steady', downpour: 'heavy', storm: 'storm',
  sleet: 'steady', flurries: 'light', snow: 'steady', heavy_snow: 'heavy', blizzard: 'heavy',
};

function drawSkyGlyph(ctx: CanvasRenderingContext2D, sky: Sky, x: number, y: number, night: boolean): void {
  let name = GLYPH_OF[sky];
  if (night && name === 'sun') name = 'moon';
  const body = name === 'sun' ? YELLOW : name === 'moon' ? '#d8dce8' : name === 'fog' ? '#b8bcc4' : sky === 'overcast' || isRainy(sky) || sky === 'sleet' ? '#9aa2ae' : '#c8ced8';
  // Rain falls blue, snow white, sleet both; a bolt is yellow, and the sun behind a cloud gold.
  const fall = sky === 'storm' ? YELLOW : isSnowy(sky) ? '#f4f6fa' : name === 'cloudy' ? (night ? '#d8dce8' : YELLOW) : BLUE;
  SKY_GLYPHS[name].split('|').forEach((row, j) => {
    for (let i = 0; i < row.length; i++) {
      if (row[i] === '.') continue;
      ctx.fillStyle = row[i] === 'o' ? (sky === 'sleet' && (i + j) % 2 ? '#f4f6fa' : fall) : body;
      ctx.fillRect(x + i, y + j, 1, 1);
    }
  });
}

export function drawAutomap(ctx: CanvasRenderingContext2D, world: World, frame: number): void {
  const r = LAYOUT.map;
  panel(ctx, r.x, r.y, r.w, r.h, PARCHMENT_DARK);
  // Parchment: a mottled field with a burnt edge.
  ctx.save(); ctx.beginPath(); ctx.rect(r.x + 2, r.y + 2, r.w - 4, r.h - 4); ctx.clip();
  for (let i = 0; i < 24; i++) {
    const px = r.x + hash(i, 1) * r.w, py = r.y + hash(i, 2) * r.h, pr = 14 + hash(i, 3) * 30;
    const g = ctx.createRadialGradient(px, py, 0, px, py, pr);
    g.addColorStop(0, rgba(hash(i, 4) > 0.5 ? '#6a4a20' : '#ffffff', 0.05)); g.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.fillStyle = g; ctx.fillRect(px - pr, py - pr, pr * 2, pr * 2);
  }
  ctx.restore();
  const edge = ctx.createLinearGradient(r.x, r.y, r.x, r.y + r.h);
  edge.addColorStop(0, 'rgba(60,30,10,0.25)'); edge.addColorStop(0.15, 'rgba(60,30,10,0)'); edge.addColorStop(0.85, 'rgba(60,30,10,0)'); edge.addColorStop(1, 'rgba(60,30,10,0.25)');
  ctx.fillStyle = edge; ctx.fillRect(r.x + 2, r.y + 2, r.w - 4, r.h - 4);
  const m = world.map;
  const cell = Math.max(3, Math.floor((Math.min(r.w, r.h) - 8) / Math.max(m.width, m.height)));
  const ox = r.x + Math.floor((r.w - cell * m.width) / 2), oy = r.y + Math.floor((r.h - cell * m.height) / 2);
  const inView = new Set(viewCells(m, world.state.x, world.state.y, world.state.facing, world.sight).map((c) => c.y * m.width + c.x));
  for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) {
    if (!world.explored(x, y)) continue;
    const c = m.at(x, y);
    // Inked onto parchment: walls dark, open ground a light wash in the terrain's hue.
    let col: string;
    if (c.solid === 'wall' || c.solid === 'building') col = '#4a3a30';
    else if (c.door !== 'none') col = c.door === 'secret' ? '#4a3a30' : '#a0602a';
    else if (c.solid === 'tree') col = '#4f7a3a';
    else if (c.solid === 'mountain') col = '#6a6058';
    else if (c.solid === 'rock' || c.solid === 'pillar') col = '#8a7a6a';
    else col = mix(TERRAIN_COLORS[c.terrain] ?? '#3c3a40', PARCHMENT, 0.55);
    ctx.fillStyle = col;
    ctx.fillRect(ox + x * cell, oy + y * cell, cell, cell);
    if ((c.solid === 'wall' || c.solid === 'building') && cell >= 6) { ctx.fillStyle = 'rgba(0,0,0,0.25)'; ctx.fillRect(ox + x * cell, oy + y * cell + cell - 1, cell, 1); }
  }
  // Features the party has stood next to.
  for (const f of m.features) {
    if (!world.explored(f.x, f.y) || f.kind === 'event') continue;
    if (f.kind === 'chest' && world.used(f.id)) continue;
    ctx.fillStyle = f.kind === 'chest' ? '#c08a1a' : f.kind === 'sign' ? '#6a5a4a' : '#8a3a9a';
    const s = Math.max(1, cell - 2);
    ctx.fillRect(ox + f.x * cell + 1, oy + f.y * cell + 1, s, s);
  }
  for (const e of m.exits) if (world.explored(e.x, e.y)) { ctx.fillStyle = GREEN; ctx.fillRect(ox + e.x * cell + 1, oy + e.y * cell + 1, Math.max(1, cell - 2), Math.max(1, cell - 2)); }
  // Monsters in view.
  for (const g of world.liveGroups()) {
    const k = g.state.y * m.width + g.state.x;
    if (!inView.has(k) && !(world.explored(g.state.x, g.state.y) && Math.abs(g.state.x - world.state.x) + Math.abs(g.state.y - world.state.y) <= 2)) continue;
    ctx.fillStyle = (frame >> 4) & 1 ? RED : '#ff8a7a';
    ctx.fillRect(ox + g.state.x * cell + 1, oy + g.state.y * cell + 1, Math.max(1, cell - 2), Math.max(1, cell - 2));
  }
  // The party: a triangle pointing the way it faces.
  const px = ox + world.state.x * cell + cell / 2, py = oy + world.state.y * cell + cell / 2, h = Math.max(2, cell / 2);
  const f = world.state.facing;
  const pts = f === 0 ? [px, py - h, px - h, py + h, px + h, py + h]
    : f === 1 ? [px + h, py, px - h, py - h, px - h, py + h]
    : f === 2 ? [px, py + h, px - h, py - h, px + h, py - h]
    : [px - h, py, px + h, py - h, px + h, py + h];
  ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); ctx.lineTo(pts[2], pts[3]); ctx.lineTo(pts[4], pts[5]); ctx.closePath();
  ctx.fillStyle = '#c6453c'; ctx.fill(); ctx.strokeStyle = INK; ctx.stroke();
  // A compass rose in the corner.
  const rx = r.x + r.w - 16, ry = r.y + 16;
  ctx.strokeStyle = '#4a3a30'; ctx.lineWidth = 1;
  ctx.beginPath(); ctx.arc(rx, ry, 8, 0, Math.PI * 2); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(rx, ry - 10); ctx.lineTo(rx + 3, ry); ctx.lineTo(rx, ry + 10); ctx.lineTo(rx - 3, ry); ctx.closePath(); ctx.fillStyle = '#4a3a30'; ctx.fill();
  ctx.fillStyle = '#c6453c'; ctx.beginPath(); ctx.moveTo(rx, ry - 10); ctx.lineTo(rx + 3, ry); ctx.lineTo(rx - 3, ry); ctx.closePath(); ctx.fill();
}

export function drawPartyCards(ctx: CanvasRenderingContext2D, party: Party, selected: number, frame: number): void {
  party.members.forEach((c, i) => drawCard(ctx, c, i, i === selected, frame));
}

function drawCard(ctx: CanvasRenderingContext2D, c: Character, i: number, selected: boolean, frame: number): void {
  const r = cardRect(i);
  const down = isDown(c);
  panel(ctx, r.x, r.y, r.w, r.h, down ? '#241418' : PANEL, selected ? BRASS : undefined);
  drawText(ctx, `${i + 1}`, r.x + 4, r.y + 4, { size: 1, color: TEXT_DIM });
  drawText(ctx, c.name, r.x + 14, r.y + 4, { size: 1, color: down ? RED : TEXT });
  drawText(ctx, `${CLASSES[c.cls].name.slice(0, 3)} L${c.level}`, r.x + r.w - 4, r.y + 4, { size: 1, color: TEXT_DIM, align: 'right' });
  drawPortrait(ctx, c, r.x + 4, r.y + 15);
  // HP and SP to the right of the portrait.
  const bx = r.x + 44, bw = r.w - 48;
  drawText(ctx, 'HP', bx, r.y + 16, { size: 1, color: TEXT_DIM });
  drawText(ctx, `${c.hp}/${c.maxHp}`, bx + bw, r.y + 16, { size: 1, color: c.hp < c.maxHp / 3 ? RED : TEXT, align: 'right' });
  bar(ctx, bx, r.y + 25, bw, 5, c.hp / c.maxHp, c.hp < c.maxHp / 3 ? RED : GREEN);
  if (c.maxSp > 0) {
    drawText(ctx, 'SP', bx, r.y + 34, { size: 1, color: TEXT_DIM });
    drawText(ctx, `${c.sp}/${c.maxSp}`, bx + bw, r.y + 34, { size: 1, color: TEXT, align: 'right' });
    bar(ctx, bx, r.y + 43, bw, 5, c.sp / c.maxSp, BLUE);
  }
  const cond = worstCondition(c);
  const ready = c.xp >= xpForLevel(c.level + 1);
  if (cond) drawText(ctx, cond.toUpperCase().slice(0, 9), bx, r.y + 52, { size: 1, color: COND_COLOR[cond] ?? TEXT });
  else if (ready && (frame >> 5) & 1) drawText(ctx, 'CAN TRAIN', bx, r.y + 52, { size: 1, color: YELLOW });
  else drawText(ctx, `AC ${armorClassOf(c)}`, bx, r.y + 52, { size: 1, color: TEXT_DIM });
  // Row marker under the portrait: brass for the front row.
  ctx.fillStyle = i < 3 ? BRASS : PANEL_LIGHT; ctx.fillRect(r.x + 4, r.y + 62, 36, 2);
}

import { armorClass as armorClassOf } from '../game/party.ts';

/** The last few log lines, over the bottom of the viewport. */
export function drawLog(ctx: CanvasRenderingContext2D, lines: readonly string[], max = 4): void {
  const r = LAYOUT.log;
  // Wrap each entry to the viewport, keep the newest, and highlight the latest entry's lines.
  const wrapped: { text: string; latest: boolean }[] = [];
  lines.slice(-max).forEach((l, i, arr) => { for (const w of wrap(l, r.w - 12)) wrapped.push({ text: w, latest: i === arr.length - 1 }); });
  const shown = wrapped.slice(-max);
  if (!shown.length) return;
  const h = shown.length * 10 + 6;
  ctx.fillStyle = 'rgba(10,8,12,0.72)';
  ctx.fillRect(r.x, r.y + r.h - h, r.w, h);
  shown.forEach((l, i) => drawText(ctx, l.text, r.x + 6, r.y + r.h - h + 4 + i * 10, { size: 1, color: l.latest ? TEXT : TEXT_DIM }));
}

export function drawPurse(ctx: CanvasRenderingContext2D, party: Party): void {
  const r = LAYOUT.purse;
  panel(ctx, r.x, r.y, r.w, r.h);
  drawText(ctx, `${party.gold} GOLD`, r.x + 6, r.y + 4, { size: 1, color: BRASS });
  drawText(ctx, `${party.food} FOOD`, r.x + r.w - 6, r.y + 4, { size: 1, color: party.food > 0 ? TEXT : RED, align: 'right' });
}

let frameCache: HTMLCanvasElement | null = null;

/** The carved wooden frame everything sits in, painted once: planks with grain, a brass border. */
export function drawFrameBackground(ctx: CanvasRenderingContext2D): void {
  if (!frameCache) {
    const cv = document.createElement('canvas'); cv.width = 640; cv.height = 360;
    const g = cv.getContext('2d')!;
    g.fillStyle = WOOD; g.fillRect(0, 0, 640, 360);
    // Planks.
    for (let y = 0; y < 360; y += 14) {
      const tone = 1 + (hash(y, 1) - 0.5) * 0.2;
      g.fillStyle = shade(WOOD, tone); g.fillRect(0, y, 640, 13);
      g.fillStyle = WOOD_DARK; g.fillRect(0, y + 13, 640, 1);
      g.strokeStyle = rgba(WOOD_DARK, 0.5); g.lineWidth = 1;
      for (let i = 0; i < 6; i++) {
        const gx = hash(y, i, 2) * 640, gl = 30 + hash(y, i, 3) * 90, gy = y + 2 + hash(y, i, 4) * 9;
        g.beginPath(); g.moveTo(gx, gy); g.quadraticCurveTo(gx + gl / 2, gy + (hash(y, i, 5) - 0.5) * 3, gx + gl, gy); g.stroke();
      }
      if (hash(y, 7) > 0.7) { g.fillStyle = shade(WOOD, 0.7); g.beginPath(); g.ellipse(hash(y, 8) * 640, y + 6, 3, 2, 0, 0, Math.PI * 2); g.fill(); }
    }
    // Outer brass border with corner plates.
    g.strokeStyle = BRASS_DARK; g.lineWidth = 2; g.strokeRect(1, 1, 638, 358);
    g.strokeStyle = BRASS; g.lineWidth = 1; g.strokeRect(3.5, 3.5, 633, 353);
    g.fillStyle = BRASS;
    for (const [x, y] of [[0, 0], [630, 0], [0, 350], [630, 350]]) { g.fillRect(x, y, 10, 10); g.fillStyle = INK; g.fillRect(x + 4, y + 4, 2, 2); g.fillStyle = BRASS; }
    frameCache = cv;
  }
  ctx.drawImage(frameCache, 0, 0);
}

/** A brass surround for the viewport, drawn after it. */
export function drawViewportFrame(ctx: CanvasRenderingContext2D): void {
  const v = LAYOUT.view;
  ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.strokeRect(v.x - 0.5, v.y - 0.5, v.w + 1, v.h + 1);
  ctx.strokeStyle = BRASS; ctx.strokeRect(v.x - 1.5, v.y - 1.5, v.w + 3, v.h + 3);
  ctx.strokeStyle = BRASS_DARK; ctx.strokeRect(v.x - 2.5, v.y - 2.5, v.w + 5, v.h + 5);
  ctx.fillStyle = BRASS;
  for (const [x, y] of [[v.x - 4, v.y - 4], [v.x + v.w - 2, v.y - 4], [v.x - 4, v.y + v.h - 2], [v.x + v.w - 2, v.y + v.h - 2]]) { ctx.fillRect(x, y, 6, 6); ctx.fillStyle = INK; ctx.fillRect(x + 2, y + 2, 2, 2); ctx.fillStyle = BRASS; }
}
