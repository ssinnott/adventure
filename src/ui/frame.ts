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
import { INK, PANEL, PANEL_LIGHT, BRASS, TEXT, TEXT_DIM, RED, BLUE, GREEN, YELLOW, PURPLE, TERRAIN_COLORS, PARCHMENT_DIM } from './palette.ts';

export const LAYOUT = {
  view: { x: 8, y: 8, w: 400, h: 268 },
  status: { x: 416, y: 8, w: 216, h: 20 },
  map: { x: 416, y: 32, w: 216, h: 224 },
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

export function drawStatus(ctx: CanvasRenderingContext2D, world: World): void {
  const r = LAYOUT.status;
  panel(ctx, r.x, r.y, r.w, r.h);
  const hh = String(world.hour).padStart(2, '0'), mm = String(world.minute).padStart(2, '0');
  drawText(ctx, `${FACING_NAMES[world.state.facing]}`, r.x + 6, r.y + 6, { size: 1, color: BRASS });
  drawText(ctx, `DAY ${world.day}  ${hh}:${mm}`, r.x + 24, r.y + 6, { size: 1, color: TEXT });
  drawText(ctx, world.map.name, r.x + r.w - 6, r.y + 6, { size: 1, color: TEXT_DIM, align: 'right' });
}

export function drawAutomap(ctx: CanvasRenderingContext2D, world: World, frame: number): void {
  const r = LAYOUT.map;
  panel(ctx, r.x, r.y, r.w, r.h);
  const m = world.map;
  const cell = Math.max(3, Math.floor((r.w - 8) / Math.max(m.width, m.height)));
  const ox = r.x + Math.floor((r.w - cell * m.width) / 2), oy = r.y + Math.floor((r.h - cell * m.height) / 2);
  const inView = new Set(viewCells(m, world.state.x, world.state.y, world.state.facing, world.sight).map((c) => c.y * m.width + c.x));
  for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) {
    if (!world.explored(x, y)) continue;
    const c = m.at(x, y);
    let col: string;
    if (c.solid === 'wall' || c.solid === 'building') col = '#8a8090';
    else if (c.door !== 'none') col = c.door === 'secret' ? '#8a8090' : '#b07a3a';
    else if (c.solid === 'tree') col = '#2f5a2a';
    else if (c.solid === 'mountain') col = '#5a5660';
    else if (c.solid === 'rock' || c.solid === 'pillar') col = '#6a6660';
    else col = TERRAIN_COLORS[c.terrain] ?? '#3c3a40';
    ctx.fillStyle = col;
    ctx.fillRect(ox + x * cell, oy + y * cell, cell, cell);
  }
  // Features the party has stood next to.
  for (const f of m.features) {
    if (!world.explored(f.x, f.y) || f.kind === 'event') continue;
    if (f.kind === 'chest' && world.used(f.id)) continue;
    ctx.fillStyle = f.kind === 'chest' ? YELLOW : f.kind === 'sign' ? PARCHMENT_DIM : BRASS;
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
  ctx.fillStyle = '#ffffff'; ctx.fill(); ctx.strokeStyle = INK; ctx.stroke();
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
  drawText(ctx, `${Math.max(c.hp, -10)}/${c.maxHp}`, bx + bw, r.y + 16, { size: 1, color: c.hp < c.maxHp / 3 ? RED : TEXT, align: 'right' });
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

export function drawFrameBackground(ctx: CanvasRenderingContext2D): void {
  ctx.fillStyle = INK; ctx.fillRect(0, 0, 640, 360);
  ctx.fillStyle = PANEL_LIGHT; ctx.fillRect(0, 0, 640, 360);
  ctx.fillStyle = PANEL; ctx.fillRect(2, 2, 636, 356);
}
