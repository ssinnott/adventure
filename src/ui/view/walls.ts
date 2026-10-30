// The walls (#1028): a wall's front and side faces in stone or a house's plaster and timber, the void's
// faces cut out of the scene, the dressing on a wall and a door's lantern and sign, a door and its seam,
// a town's gate (#1071), the lighthouse's flank, and the lamps and the torches' flames drawn every frame.
// A tent's felt is tents.ts and a house's roof roofs.ts.

import type { Cell, MapPalette } from '../../game/mapdef.ts';
import { shade, mix, rgba } from '../../lib/art/palettes.ts';
import { LIGHTHOUSE_HEIGHT, LIGHTHOUSE_BANDS } from '../scenery.ts';
import { hash } from '../paint/brush.ts';
import { fog, unhazed, LIT, outlineRect, quad, line, addPoly } from './common.ts';
import type { Flame, Paint, Front } from './common.ts';
import { looksHouse, isGateway, wallDressing, building } from './model.ts';
import { TENT_WALL, drawFeltFront, drawFlap } from './tents.ts';

/** The wall a face is drawn for (#1029): its cell and its square, how deep it stands, its seed, and whether it is a tent's felt. */
interface Wall { cell: Cell; mx: number; my: number; d: number; seed: number; tent: boolean }
/** A side face's near or far edge (#1029): where it stands across the view, and the unit at its depth. */
interface Edge { x: number; u: number }
/** Where a side face runs on into the next face of its wall, near and far, and whether its far end is outlined (#1029). */
interface Joins { joinNear: boolean; joinFar: boolean; openFar: boolean }

/**
 * The void's face toward the eye, from its foot on the floor up past the top of the view. Its edges
 * round as a wall's do, so faces side by side leave no seam; its foot runs a pixel into the floor in
 * front, which is painted after it. See `cutVoid` for how it is painted.
 */
export function drawVoidFront(p: Paint, voids: Path2D, x0: number, x1: number, top: number, foot: number): void {
  const X0 = Math.round(x0), X1 = Math.round(x1), F = Math.ceil(foot) + 1;
  cutVoid(p, voids, [[X0, top], [X1, top], [X1, F], [X0, F]]);
}

/** The void's side face, from its near edge to its far one, up past the top of the view. */
export function drawVoidSide(p: Paint, voids: Path2D, xN: number, footN: number, xF: number, footF: number, top: number): void {
  xN = Math.round(xN); xF = Math.round(xF);
  cutVoid(p, voids, [[xN, top], [xF, top], [xF, footF + 1], [xN, footN + 1]]);
}

/**
 * A face of the void is cut out of what is painted so far, which it stands in front of, and added
 * to `voids`; whatever is nearer is painted over the hole as usual. Once the scene is done the
 * holes are filled pink from behind, so no weather or light that greys the scene reaches them.
 * Every face is wound the same way, so filled together they union rather than cancel. A torch it
 * hides goes out: flames are drawn over the finished scene every frame.
 */
function cutVoid(p: Paint, voids: Path2D, pts: [number, number][]): void {
  const { ctx } = p;
  const face = new Path2D();
  addPoly(face, pts);
  ctx.globalCompositeOperation = 'destination-out';
  ctx.fillStyle = '#000'; ctx.fill(face);
  ctx.globalCompositeOperation = 'source-over';
  addPoly(voids, pts);
  p.flames = p.flames.filter((fl) => !ctx.isPointInPath(face, fl.x, fl.y));
}

/** A wall's front face; a tent's (`tent`) is its low felt wall, from TENT_WALL down. */
export function drawFrontFace(p: Paint, wall: Wall, x0: number, x1: number, u: number, joinL: boolean, joinR: boolean, across: number): void {
  const { map, horizon } = p, { cell, mx, my, d, seed, tent } = wall;
  const top = tent ? horizon + TENT_WALL * u : horizon - u, bottom = horizon + u, front: Front = { x0, x1, top, bottom, joinL, joinR };
  const isDoor = cell.door === 'door' || cell.door === 'locked';
  const house = looksHouse(map, mx, my), pal = map.paletteAt(mx, my), felt = !house && pal.wallStyle === 'tent';
  if (house) drawHouseFront(p, front, d, seed, building(map, mx, my).seed);
  else if (felt) drawFeltFront(p, pal, front, d);
  else drawStoneFront(p, pal, front, d, seed, map.kind === 'outdoor', across);
  if (!felt && isGateway(map, mx, my)) drawGate(p, x0, x1, u, pal, d, seed);
  else if (isDoor && pal.wallStyle === 'smooth') drawSeam(p, x0, x1, u, pal.wall, d);
  else if (isDoor && felt) drawFlap(p, x0, x1, top, bottom, pal, d);
  else if (isDoor) drawDoor(p, x0, x1, u, pal.door, d, cell.door === 'locked', map.kind === 'town');
  drawWallDecor(p, mx, my, front, d, seed, house, isDoor);
}

/**
 * Draw a wall's dressing (see wallDressing), and a house door's lantern and, for a business, its
 * sign.
 */
function drawWallDecor(p: Paint, mx: number, my: number, front: Front, d: number, seed: number, house: boolean, isDoor: boolean): void {
  const { ctx, map, gloom, present } = p, { x0, x1, top, bottom } = front;
  const w = x1 - x0, h = bottom - top;
  if (w < 14) return;
  const pal = map.paletteAt(mx, my);
  // The business there now: one gone `until` a flag hangs no sign, and its twin hangs its own.
  const feature = map.featuresAt(mx, my).find((q) => q.kind !== 'event' && present(q));
  const cx = (x0 + x1) / 2;
  const dressing = wallDressing(map, mx, my);
  if (house) {
    // A shop sign for service doors and a lantern by every door.
    if (isDoor && feature) {
      const sw = w * 0.34, sh = h * 0.14, sx = x1 - sw - w * 0.06, sy = top + h * 0.1;
      ctx.strokeStyle = fog(p, '#3a2a20', d); ctx.lineWidth = Math.max(1, w * 0.02);
      ctx.beginPath(); ctx.moveTo(sx + sw, sy - h * 0.06); ctx.lineTo(sx + sw, sy + sh); ctx.moveTo(sx, sy); ctx.lineTo(sx + sw, sy - h * 0.06); ctx.stroke();
      ctx.fillStyle = fog(p, '#c9a34a', d); ctx.fillRect(Math.round(sx), Math.round(sy), Math.round(sw), Math.round(sh));
      ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 1; ctx.strokeRect(Math.round(sx) + 0.5, Math.round(sy) + 0.5, Math.round(sw), Math.round(sh));
      drawSignGlyph(ctx, feature.kind, sx + sw / 2, sy + sh / 2, Math.min(sw, sh) * 0.7, fog(p, '#3a2a20', d));
    }
    if (isDoor) {
      const lx = x0 + w * 0.16, ly = top + h * 0.42;
      ctx.fillStyle = fog(p, '#3a3a40', d); ctx.fillRect(Math.round(lx - w * 0.03), Math.round(ly), Math.max(2, Math.round(w * 0.06)), Math.max(3, Math.round(h * 0.1)));
      if (gloom < 0.5) p.flames.push({ x: lx, y: ly + h * 0.06, s: Math.max(2, w * 0.05) });
    } else if (dressing === 'flowers') {
      // Flower box under the window.
      const bw = w * 0.3, bx = cx - bw / 2 + (hash(seed, 3) - 0.5) * w * 0.3, by = top + h * 0.43;
      ctx.fillStyle = fog(p, '#5a3a24', d); ctx.fillRect(Math.round(bx), Math.round(by), Math.round(bw), Math.max(2, Math.round(h * 0.05)));
      for (let i = 0; i < 5; i++) { ctx.fillStyle = fog(p, ['#e05a6a', '#f0e060', '#ffffff', '#c080e0'][i % 4], d); ctx.fillRect(Math.round(bx + bw * (i + 0.5) / 5) - 1, Math.round(by) - 2, 2, 2); }
    } else if (dressing === 'ivy') {
      // Ivy climbing a corner.
      const side = hash(seed, 4) > 0.5 ? x0 + w * 0.08 : x1 - w * 0.08;
      ctx.fillStyle = fog(p, '#3f8a3a', d);
      for (let i = 0; i < 12; i++) { const iy = bottom - i * h * 0.075, ix = side + Math.sin(i * 1.7 + seed) * w * 0.05; ctx.beginPath(); ctx.arc(ix, iy, Math.max(1, w * 0.025), 0, Math.PI * 2); ctx.fill(); }
    }
    return;
  }
  if (dressing === 'sconce') {
    // Torch sconce: iron bracket, then a flame drawn per frame.
    const sx = cx + (hash(seed, 5) - 0.5) * w * 0.4, sy = top + h * 0.38;
    ctx.fillStyle = fog(unhazed(p), '#2a2a30', d);
    ctx.fillRect(Math.round(sx - w * 0.025), Math.round(sy), Math.max(2, Math.round(w * 0.05)), Math.max(3, Math.round(h * 0.14)));
    ctx.fillRect(Math.round(sx - w * 0.05), Math.round(sy + h * 0.1), Math.max(3, Math.round(w * 0.1)), Math.max(1, Math.round(h * 0.03)));
    // Torch head.
    ctx.fillStyle = fog(unhazed(p), '#6a4a2a', d); ctx.fillRect(Math.round(sx - w * 0.02), Math.round(sy - h * 0.06), Math.max(2, Math.round(w * 0.04)), Math.max(2, Math.round(h * 0.08)));
    p.flames.push({ x: sx, y: sy - h * 0.06, s: Math.max(3, w * 0.07) });
  } else if (dressing === 'banner') {
    // A banner hung from a rod.
    const bw = w * 0.28, bx = cx - bw / 2 + (hash(seed, 6) - 0.5) * w * 0.3, by = top + h * 0.12, bh = h * 0.5;
    const col = fog(p, pal.banner, d);
    ctx.fillStyle = fog(p, '#3a3a40', d); ctx.fillRect(Math.round(bx - w * 0.03), Math.round(by), Math.round(bw + w * 0.06), Math.max(1, Math.round(h * 0.02)));
    ctx.beginPath(); ctx.moveTo(bx, by); ctx.lineTo(bx + bw, by); ctx.lineTo(bx + bw, by + bh * 0.8); ctx.lineTo(bx + bw / 2, by + bh); ctx.lineTo(bx, by + bh * 0.8); ctx.closePath();
    ctx.fillStyle = col; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 1; ctx.stroke();
    ctx.fillStyle = fog(p, shade(pal.banner, 0.6), d); ctx.fillRect(Math.round(bx + bw * 0.15), Math.round(by + bh * 0.2), Math.max(1, Math.round(bw * 0.7)), Math.max(1, Math.round(h * 0.02)));
    // The Lantern emblem: a ring.
    if (bw > 10) { ctx.strokeStyle = fog(p, '#e8d090', d); ctx.lineWidth = Math.max(1, bw * 0.08); ctx.beginPath(); ctx.arc(bx + bw / 2, by + bh * 0.5, bw * 0.2, 0, Math.PI * 2); ctx.stroke(); }
  } else if (dressing === 'cobweb') {
    // Cobweb in a top corner.
    const left = hash(seed, 8) > 0.5, ox = left ? x0 : x1, s = left ? 1 : -1, r = Math.min(w, h) * 0.28;
    ctx.strokeStyle = fog(p, '#d8d8e0', d); ctx.lineWidth = 1; ctx.globalAlpha = 0.55;
    for (let i = 0; i <= 4; i++) { const a = (i / 4) * Math.PI / 2; ctx.beginPath(); ctx.moveTo(ox, top); ctx.lineTo(ox + s * Math.cos(a) * r, top + Math.sin(a) * r); ctx.stroke(); }
    for (let k = 1; k <= 3; k++) { ctx.beginPath(); ctx.arc(ox, top, r * k / 3, left ? 0 : Math.PI / 2, left ? Math.PI / 2 : Math.PI); ctx.stroke(); }
    ctx.globalAlpha = 1;
  } else if (dressing === 'crack') {
    // A crack running down.
    const sx = x0 + w * (0.2 + hash(seed, 9) * 0.6);
    ctx.strokeStyle = fog(p, shade(pal.wallDark, 0.5), d); ctx.lineWidth = Math.max(1, w * 0.012);
    ctx.beginPath(); ctx.moveTo(sx, top + h * 0.1);
    for (let i = 1; i <= 5; i++) ctx.lineTo(sx + (hash(seed, 10, i) - 0.5) * w * 0.14, top + h * (0.1 + i * 0.13));
    ctx.stroke();
  } else if (dressing === 'damp') {
    // Damp streak with moss at the foot.
    const sx = x0 + w * (0.25 + hash(seed, 11) * 0.5), sw = w * 0.08;
    ctx.fillStyle = rgba('#000000', 0.22); ctx.fillRect(Math.round(sx), Math.round(top), Math.round(sw), Math.round(h * 0.8));
    ctx.fillStyle = fog(p, '#4f8a3a', d); ctx.beginPath(); ctx.ellipse(sx + sw / 2, bottom - h * 0.06, sw * 1.4, h * 0.05, 0, 0, Math.PI * 2); ctx.fill();
  } else if (dressing === 'ring') {
    // Iron ring on a plate.
    const rx = cx + (hash(seed, 12) - 0.5) * w * 0.5, ry = top + h * 0.5, r = Math.max(2, w * 0.05);
    ctx.fillStyle = fog(p, '#3a3a40', d); ctx.fillRect(Math.round(rx - r * 0.8), Math.round(ry - r * 1.2), Math.round(r * 1.6), Math.round(r * 0.8));
    ctx.strokeStyle = fog(p, '#6a6a74', d); ctx.lineWidth = Math.max(1, r * 0.3); ctx.beginPath(); ctx.arc(rx, ry, r, 0, Math.PI * 2); ctx.stroke();
  } else if (dressing === 'grate') {
    // A barred grate into the dark.
    const gw = w * 0.26, gh = h * 0.2, gx = cx - gw / 2 + (hash(seed, 13) - 0.5) * w * 0.3, gy = top + h * 0.25;
    ctx.fillStyle = '#0c0a10'; ctx.fillRect(Math.round(gx), Math.round(gy), Math.round(gw), Math.round(gh));
    ctx.fillStyle = fog(p, '#5a5a64', d);
    for (let i = 1; i < 4; i++) ctx.fillRect(Math.round(gx + gw * i / 4), Math.round(gy), Math.max(1, Math.round(w * 0.012)), Math.round(gh));
    ctx.strokeStyle = fog(p, '#3a3a40', d); ctx.lineWidth = 1; ctx.strokeRect(Math.round(gx) + 0.5, Math.round(gy) + 0.5, Math.round(gw), Math.round(gh));
  } else if (dressing === 'carving') {
    // A carved panel of old glyphs.
    const pw = w * 0.36, ph = h * 0.26, px = cx - pw / 2, py = top + h * 0.3;
    ctx.fillStyle = fog(p, shade(pal.wall, 0.85), d); ctx.fillRect(Math.round(px), Math.round(py), Math.round(pw), Math.round(ph));
    ctx.strokeStyle = fog(p, shade(pal.wallDark, 0.6), d); ctx.lineWidth = 1; ctx.strokeRect(Math.round(px) + 0.5, Math.round(py) + 0.5, Math.round(pw), Math.round(ph));
    if (pw > 16) for (let i = 0; i < 6; i++) {
      const gx = px + pw * (0.12 + (i % 3) * 0.3), gy = py + ph * (0.15 + Math.floor(i / 3) * 0.45), gs = pw * 0.12;
      ctx.beginPath(); ctx.moveTo(gx, gy + gs); ctx.lineTo(gx + gs * 0.5, gy); ctx.lineTo(gx + gs, gy + gs); if (hash(seed, 14, i) > 0.5) ctx.moveTo(gx, gy + gs * 0.5), ctx.lineTo(gx + gs, gy + gs * 0.5); ctx.stroke();
    }
  }
}

function drawSignGlyph(ctx: CanvasRenderingContext2D, kind: string, x: number, y: number, s: number, ink: string): void {
  ctx.fillStyle = ink; ctx.strokeStyle = ink; ctx.lineWidth = Math.max(1, s * 0.12); ctx.lineCap = 'round';
  switch (kind) {
    case 'inn': // a tankard
      ctx.fillRect(Math.round(x - s * 0.3), Math.round(y - s * 0.35), Math.round(s * 0.5), Math.round(s * 0.7));
      ctx.beginPath(); ctx.arc(x + s * 0.3, y, s * 0.2, -Math.PI / 2, Math.PI / 2); ctx.stroke(); break;
    case 'shop': // a scale
      ctx.beginPath(); ctx.moveTo(x, y - s * 0.4); ctx.lineTo(x, y + s * 0.4); ctx.moveTo(x - s * 0.4, y - s * 0.2); ctx.lineTo(x + s * 0.4, y - s * 0.2); ctx.stroke();
      ctx.beginPath(); ctx.arc(x - s * 0.4, y + s * 0.05, s * 0.15, 0, Math.PI); ctx.arc(x + s * 0.4, y + s * 0.05, s * 0.15, 0, Math.PI); ctx.stroke(); break;
    case 'temple': // a lantern ring
      ctx.beginPath(); ctx.arc(x, y, s * 0.3, 0, Math.PI * 2); ctx.stroke(); ctx.beginPath(); ctx.arc(x, y, s * 0.1, 0, Math.PI * 2); ctx.fill(); break;
    case 'guild': // an open book
      ctx.beginPath(); ctx.moveTo(x - s * 0.4, y - s * 0.25); ctx.lineTo(x, y - s * 0.1); ctx.lineTo(x + s * 0.4, y - s * 0.25); ctx.lineTo(x + s * 0.4, y + s * 0.3); ctx.lineTo(x, y + s * 0.4); ctx.lineTo(x - s * 0.4, y + s * 0.3); ctx.closePath(); ctx.stroke(); break;
    case 'trainer': // crossed swords
      ctx.beginPath(); ctx.moveTo(x - s * 0.4, y - s * 0.4); ctx.lineTo(x + s * 0.4, y + s * 0.4); ctx.moveTo(x + s * 0.4, y - s * 0.4); ctx.lineTo(x - s * 0.4, y + s * 0.4); ctx.stroke(); break;
    default: // a mug for the tavern and anything else
      ctx.fillRect(Math.round(x - s * 0.25), Math.round(y - s * 0.3), Math.round(s * 0.5), Math.round(s * 0.6));
  }
}

/**
 * A lighthouse's flank seen beside the party, from its near edge to its far one: the tower's white
 * and red bands at the heights the sprite paints them, each edge as high as its own depth makes it.
 */
export function drawLighthouseFlank(ctx: CanvasRenderingContext2D, xN: number, footN: number, xF: number, footF: number, uN: number, uF: number, tone: number): void {
  const H = LIGHTHOUSE_HEIGHT;
  for (const [a, b, red] of LIGHTHOUSE_BANDS) {
    ctx.fillStyle = shade(red ? '#9a3226' : '#d8d2c6', tone);
    ctx.beginPath();
    ctx.moveTo(xN, footN - a * H * uN); ctx.lineTo(xN, footN - b * H * uN); ctx.lineTo(xF, footF - b * H * uF); ctx.lineTo(xF, footF - a * H * uF);
    ctx.closePath(); ctx.fill();
  }
}

/** How far a lamp's beam reaches to either side, in the lamp's own size. */
export const LAMP_REACH = 26;
/** Where a lamp's light is drawn before it is masked to what nothing nearer covers. */
let lampScratch: HTMLCanvasElement | null = null;

/**
 * A lighthouse's lamp, lit: a glow, and the lens's bar turning, seen side on as a beam that sweeps
 * out to one side and flashes as it faces the eye before sweeping out to the other. Masked to the
 * strip of its reach that nothing nearer painted over.
 */
export function drawLamp(ctx: CanvasRenderingContext2D, fl: Flame, ox: number, oy: number, frame: number): void {
  const m = fl.reach?.mask;
  if (!m || !fl.reach) { lampLight(ctx, ox + fl.x, oy + fl.y, fl.s, frame); return; }
  const { x, y, w, h } = fl.reach;
  lampScratch ??= document.createElement('canvas');
  if (lampScratch.width < w || lampScratch.height < h) { lampScratch.width = Math.max(lampScratch.width, w); lampScratch.height = Math.max(lampScratch.height, h); }
  const sc = lampScratch.getContext('2d')!;
  sc.clearRect(0, 0, w, h);
  lampLight(sc, fl.x - x, fl.y - y, fl.s, frame);
  sc.globalCompositeOperation = 'destination-in'; sc.drawImage(m, 0, 0); sc.globalCompositeOperation = 'source-over';
  ctx.drawImage(lampScratch, 0, 0, w, h, ox + x, oy + y, w, h);
}

/** The lamp's glow and beam, unmasked. */
function lampLight(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, frame: number): void {
  const turn = frame / 45, face = Math.cos(turn), reach = s * LAMP_REACH * Math.abs(Math.sin(turn)), side = Math.sign(Math.sin(turn)) || 1;
  ctx.save();
  const glow = ctx.createRadialGradient(x, y, 0, x, y, s * (3 + 3 * Math.max(0, face)));
  glow.addColorStop(0, 'rgba(255,240,180,0.9)'); glow.addColorStop(1, 'rgba(255,220,140,0)');
  ctx.fillStyle = glow; ctx.fillRect(x - s * 6, y - s * 6, s * 12, s * 12);
  const beam = ctx.createLinearGradient(x, y, x + side * reach, y);
  beam.addColorStop(0, 'rgba(255,240,190,0.55)'); beam.addColorStop(1, 'rgba(255,240,190,0)');
  ctx.fillStyle = beam; ctx.beginPath(); ctx.moveTo(x, y - s * 0.4); ctx.lineTo(x + side * reach, y - s * 1.6); ctx.lineTo(x + side * reach, y + s * 1.6); ctx.lineTo(x, y + s * 0.4); ctx.closePath(); ctx.fill();
  ctx.restore();
}

/** A flame: two tones and a glow, flickering with the frame. */
export function drawFlame(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, frame: number): void {
  const f1 = Math.sin(frame / 3.1), f2 = Math.sin(frame / 5.3 + 1);
  const hgt = s * (2.2 + 0.4 * f1), lean = s * 0.25 * f2;
  const g = ctx.createRadialGradient(x, y - s * 0.5, s * 0.2, x, y - s * 0.5, s * 5);
  g.addColorStop(0, `rgba(255,180,80,${0.35 + 0.05 * f1})`); g.addColorStop(1, 'rgba(255,140,40,0)');
  ctx.fillStyle = g; ctx.fillRect(x - s * 5, y - s * 5.5, s * 10, s * 10);
  ctx.beginPath(); ctx.moveTo(x - s * 0.55, y); ctx.quadraticCurveTo(x - s * 0.7, y - hgt * 0.5, x + lean, y - hgt); ctx.quadraticCurveTo(x + s * 0.7, y - hgt * 0.5, x + s * 0.55, y); ctx.closePath();
  ctx.fillStyle = '#ff8a30'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - s * 0.3, y); ctx.quadraticCurveTo(x - s * 0.35, y - hgt * 0.35, x + lean * 0.6, y - hgt * 0.6); ctx.quadraticCurveTo(x + s * 0.35, y - hgt * 0.35, x + s * 0.3, y); ctx.closePath();
  ctx.fillStyle = '#ffe090'; ctx.fill();
}

/**
 * Stone block courses on an axis-aligned face. The face fills whole pixels from round(x0) to
 * round(x1), the same columns its neighbours and side faces round to, so no column of background
 * is left between them. Where the wall runs on into the next face (joinL, joinR) the half blocks of
 * the offset courses are halves of one block: no joint at the join, and one colour from a seed the
 * two faces share (`across` is what a seed steps by from one cell to the next on the right).
 */
function drawStoneFront(p: Paint, pal: MapPalette, front: Front, d: number, seed: number, mossy: boolean, across: number): void {
  const { ctx } = p, { x0, x1, top, bottom, joinL, joinR } = front;
  const wall = pal.wall, wallDark = pal.wallDark;
  const w = x1 - x0, h = bottom - top;
  const X0 = Math.round(x0), X1 = Math.round(x1), T = Math.round(top), B = Math.round(bottom);
  // A smooth wall is one face: no course, no block and no joint, outlined only where it ends.
  if (pal.wallStyle === 'smooth') {
    ctx.fillStyle = fog(p, wall, d); ctx.fillRect(X0, T, X1 - X0, B - T);
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1; outlineRect(ctx, X0, T, X1, B, !joinL, !joinR);
    return;
  }
  ctx.fillStyle = fog(p, wallDark, d); ctx.fillRect(X0, T, X1 - X0, B - T);
  const brick = pal.wallStyle === 'brick';
  const rows = brick ? 9 : 6, cols = brick ? 4 : 3;
  const rh = h / rows, cw = w / cols;
  const gap = rh > 6 ? 1 : 0;
  for (let i = 0; i < rows; i++) {
    const off = (i % 2) * cw * 0.5;
    const y0 = Math.round(top + i * rh) + gap, y1 = Math.round(top + (i + 1) * rh);
    for (let j = -1; j < cols; j++) {
      const bx = x0 + j * cw + off, bw = cw;
      const cx0 = Math.max(x0, bx), cx1 = Math.min(x1, bx + bw);
      if (cx1 - cx0 < 1) continue;
      const shareL = joinL && bx < x0 - 0.01, shareR = joinR && bx + bw > x1 + 0.01;
      const k = shareL ? seed * 2 - across : shareR ? seed * 2 + across : seed, jj = shareL || shareR ? cols : j;
      const v = hash(k, i, jj) - 0.5;
      let col = shade(wall, 1 + v * (brick ? 0.3 : 0.22));
      if (brick && hash(k, i, jj, 6) > 0.85) col = mix(col, '#7a3a2a', 0.5);
      if (mossy && hash(k, i, jj, 5) > 0.8) col = mix(col, '#4a6a3a', 0.4);
      ctx.fillStyle = fog(p, col, d);
      const bx0 = Math.round(cx0) + (shareL ? 0 : gap), bx1 = Math.round(cx1);
      ctx.fillRect(bx0, y0, bx1 - bx0, y1 - y0);
      if (rh > 10) { ctx.fillStyle = 'rgba(255,255,255,0.08)'; ctx.fillRect(bx0, y0, bx1 - bx0, 1); }
    }
  }
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1; outlineRect(ctx, X0, T, X1, B, !joinL, !joinR);
}

/** A timber-framed house front with a window; its roof is the building's, drawn by drawRoof. */
function drawHouseFront(p: Paint, front: Front, d: number, seed: number, bseed: number): void {
  const { ctx, gloom } = p, { x0, x1, top, bottom, joinL, joinR } = front;
  const w = x1 - x0, h = bottom - top;
  // Up to the whole pixel the wall's top falls in, so the eaves close over it with no sky between.
  const X0 = Math.round(x0), X1 = Math.round(x1), T = Math.floor(top), B = Math.round(bottom);
  const plaster = fog(p, shade('#d8c8a8', 1 + (hash(bseed, 1) - 0.5) * 0.15), d), beam = fog(p, '#4a3020', d);
  ctx.fillStyle = plaster; ctx.fillRect(X0, T, X1 - X0, B - T);
  // The eaves' shadow on the wall below them.
  const sh = ctx.createLinearGradient(0, T, 0, T + h * 0.12);
  sh.addColorStop(0, 'rgba(0,0,0,0.45)'); sh.addColorStop(1, 'rgba(0,0,0,0)');
  ctx.fillStyle = sh; ctx.fillRect(X0, T, X1 - X0, Math.round(h * 0.12));
  // Timber frame: posts, a sill beam, a mid beam and braces. Where the front runs on into the next
  // one, that one's post on the join is this one's, so the join is one post and not two.
  const bw = Math.max(1, Math.round(w * 0.035)), pl = joinL ? 0 : bw;
  ctx.fillStyle = beam;
  if (!joinL) ctx.fillRect(X0, T, bw, B - T);
  ctx.fillRect(X1 - bw, T, bw, B - T);
  ctx.fillRect(X0, T, X1 - X0, bw);
  ctx.fillRect(X0, Math.round(top + h * 0.55), X1 - X0, bw);
  if (w > 30) {
    ctx.strokeStyle = beam; ctx.lineWidth = bw;
    ctx.beginPath(); ctx.moveTo(x0 + pl, top + h * 0.55); ctx.lineTo(x0 + w * 0.25, top + bw); ctx.stroke();
    ctx.beginPath(); ctx.moveTo(x1 - bw, top + h * 0.55); ctx.lineTo(x1 - w * 0.25, top + bw); ctx.stroke();
  }
  // Window: frame, four panes, warm at night.
  const ww = w * 0.22, wh = h * 0.22, wx = x0 + w * 0.5 - ww / 2 + (hash(seed, 3) - 0.5) * w * 0.3, wy = top + h * 0.2;
  const lit = gloom < 0.4 && hash(seed, 4) > 0.3;
  ctx.fillStyle = beam; ctx.fillRect(Math.round(wx) - 1, Math.round(wy) - 1, Math.round(ww) + 2, Math.round(wh) + 2);
  ctx.fillStyle = lit ? fog(LIT, '#f0b860', d) : fog(p, '#2a3040', d); ctx.fillRect(Math.round(wx), Math.round(wy), Math.round(ww), Math.round(wh));
  if (ww > 8) { ctx.fillStyle = beam; ctx.fillRect(Math.round(wx + ww / 2), Math.round(wy), 1, Math.round(wh)); ctx.fillRect(Math.round(wx), Math.round(wy + wh / 2), Math.round(ww), 1); }
  if (lit) { const gg = ctx.createRadialGradient(wx + ww / 2, wy + wh / 2, 1, wx + ww / 2, wy + wh / 2, ww); gg.addColorStop(0, 'rgba(255,190,100,0.25)'); gg.addColorStop(1, 'rgba(255,190,100,0)'); ctx.fillStyle = gg; ctx.fillRect(wx - ww, wy - ww, ww * 3, ww * 3); }
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1; outlineRect(ctx, X0, T, X1, B, !joinL, !joinR);
}

/**
 * A side face in perspective: stone courses that converge, or a plain plastered wall for houses.
 * Its near and far edges sit on whole pixels, as the front faces' do, so it meets them and the next
 * side face along without a seam. Where the wall runs on into the next face (joinNear, joinFar) the
 * half blocks at the join are halves of one block (`ahead` is what a seed steps by one cell on).
 */
export function drawSideFace(p: Paint, wall: Wall, near: Edge, far: Edge, onRight: boolean, joins: Joins, ahead: number): void {
  const { ctx, map, horizon, dark, haze } = p, { mx, my, d, seed, tent } = wall, { joinNear, joinFar, openFar } = joins;
  const house = looksHouse(map, mx, my), pal = map.paletteAt(mx, my);
  const bseed = house ? building(map, mx, my).seed : 0;
  const baseCol = house ? shade('#d8c8a8', 0.8 * (1 + (hash(bseed, 1) - 0.5) * 0.15)) : pal.wallDark;
  const shadeSide = onRight ? 0.85 : 0.75;
  const xN = Math.round(near.x), xF = Math.round(far.x), uN = near.u, uF = far.u;
  const P = (s: number, t: number): [number, number] => {
    // s along depth (0 near .. 1 far), t along height (0 top .. 1 bottom). 1/u is linear in depth, so
    // stepping it evenly spaces the courses' joints as the true projection does.
    const u = 1 / (1 / uN + (1 / uF - 1 / uN) * s);
    const x = xN + (xF - xN) * (u - uN) / (uF - uN);
    return [x, horizon - u + 2 * u * t];
  };
  // Felt, the whole height of a wall or a tent's low wall, in strips fogged by their depth as a smooth
  // wall's are, with its ropes and the band round its foot.
  if (!house && pal.wallStyle === 'tent') {
    const t0 = tent ? (1 + TENT_WALL) / 2 : 0, kN = Math.max(0, d - 0.5), kF = d + 0.5, h = 1 - t0, strips = 6;
    // One face under the strips first, as a smooth wall's, so no seam between two strips shows what is behind.
    quad(ctx, P(0, t0), P(1, t0), P(1, 1), P(0, 1), fog(p, shade(pal.wall, shadeSide * 0.92), d));
    for (let j = 0; j < strips; j++) {
      const s0 = j / strips, s1 = Math.min(1, (j + 1.2) / strips), fd = kN + (kF - kN) * (s0 + s1) / 2;
      quad(ctx, P(s0, t0), P(s1, t0), P(s1, 1), P(s0, 1), fog(p, shade(pal.wall, shadeSide * 0.92), fd));
    }
    quad(ctx, P(0, 1 - h * 0.2), P(1, 1 - h * 0.2), P(1, 1 - h * 0.07), P(0, 1 - h * 0.07), fog(p, shade(pal.banner, shadeSide), d));
    ctx.strokeStyle = fog(p, shade(pal.wall, shadeSide * 0.6), d); ctx.lineWidth = Math.max(1, uN * 0.02); ctx.lineCap = 'butt';
    for (const t of [0.3, 0.58]) line(ctx, P(0, t0 + h * t), P(1, t0 + h * t));
    ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1;
    ctx.beginPath(); const a = P(0, t0), b = P(1, t0), c = P(1, 1), e = P(0, 1);
    ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.moveTo(e[0], e[1]); ctx.lineTo(c[0], c[1]);
    if (openFar) { const i = xF > xN ? -0.5 : 0.5; ctx.moveTo(b[0] + i, b[1]); ctx.lineTo(c[0] + i, c[1]); }
    ctx.stroke();
    return;
  }
  // A house wall runs a pixel or two up under its eaves, which close over its top with no sky between.
  const up = house ? -1 / uF : 0;
  quad(ctx, P(0, up), P(1, up), P(1, 1), P(0, 1), fog(p, shade(baseCol, shadeSide), d));
  if (house) {
    const beam = fog(p, '#4a3020', d);
    ctx.strokeStyle = beam; ctx.lineWidth = Math.max(1, uN * 0.03); ctx.lineCap = 'butt';
    // Sill and mid beams, a post at each end and the middle, and braces in the lower panels.
    line(ctx, P(0, 0.55), P(1, 0.55)); line(ctx, P(0, 0), P(1, 0)); line(ctx, P(0, 1), P(1, 1));
    line(ctx, P(0, 0), P(0, 1)); line(ctx, P(0.5, 0), P(0.5, 1)); line(ctx, P(1, 0), P(1, 1));
    line(ctx, P(0.02, 1), P(0.48, 0.57)); line(ctx, P(0.98, 1), P(0.52, 0.57));
    // A window in the upper half, shuttered dark by day and lit at night.
    if (uN > 30) {
      const wl = 0.62, wr = 0.88, wt = 0.14, wb = 0.42;
      quad(ctx, P(wl, wt), P(wr, wt), P(wr, wb), P(wl, wb), beam);
      const lit = hash(bseed, 9) > 0.4 && (haze === null || hash(bseed, 10) > 0.5);
      quad(ctx, P(wl + 0.02, wt + 0.03), P(wr - 0.02, wt + 0.03), P(wr - 0.02, wb - 0.03), P(wl + 0.02, wb - 0.03), lit && dark ? fog(LIT, '#f0b860', d) : fog(p, '#2a3040', d));
      ctx.strokeStyle = beam; ctx.lineWidth = 1; line(ctx, P((wl + wr) / 2, wt), P((wl + wr) / 2, wb)); line(ctx, P(wl, (wt + wb) / 2), P(wr, (wt + wb) / 2));
    }
    return;
  }
  const brick = pal.wallStyle === 'brick', smooth = pal.wallStyle === 'smooth';
  const rows = smooth ? 0 : brick ? 9 : 6;
  const cols = brick ? 4 : 3;
  // The planes the face spans, as paintScene clips them. Each block is fogged by its own depth, not
  // the cell's, so a wall darkens along its length instead of in a band per cell.
  const kN = Math.max(0, d - 0.5), kF = d + 0.5;
  // A smooth wall's side is one face, in strips that overlap so no seam shows, each fogged by its depth.
  const strips = 6;
  if (smooth) for (let j = 0; j < strips; j++) {
    const s0 = j / strips, s1 = Math.min(1, (j + 1.2) / strips), fd = kN + (kF - kN) * (s0 + s1) / 2;
    quad(ctx, P(s0, 0), P(s1, 0), P(s1, 1), P(s0, 1), fog(p, shade(pal.wallDark, shadeSide), fd));
  }
  for (let i = 0; i < rows; i++) {
    const t0 = i / rows, t1 = (i + 1) / rows;
    const off = (i % 2) * 0.5 / cols;
    for (let j = -1; j <= cols; j++) {
      const s0 = Math.max(0, j / cols + off), s1 = Math.min(1, (j + 1) / cols + off);
      if (s1 - s0 <= 0.01) continue;
      const shareN = joinNear && j / cols + off < -0.01, shareF = joinFar && (j + 1) / cols + off > 1.01;
      const k = shareN ? seed * 2 - ahead : shareF ? seed * 2 + ahead : seed, jj = shareN || shareF ? cols + 1 : j;
      const v = hash(k, i, jj, 2) - 0.5, fd = kN + (kF - kN) * (s0 + s1) / 2;
      const col = fog(p, shade(pal.wallDark, shadeSide * (1 + v * 0.22)), fd);
      quad(ctx, P(s0, t0), P(s1, t0), P(s1, t1), P(s0, t1), fog(p, shade(pal.wallDark, 0.55), fd));
      const g = uN > 40 ? 0.04 : 0.02;
      const gN = shareN ? 0 : g, gF = shareF ? 0 : g;
      quad(ctx, P(s0 + gN / cols, t0 + g / rows), P(s1 - gF / cols, t0 + g / rows), P(s1 - gF / cols, t1 - g / rows), P(s0 + gN / cols, t1 - g / rows), col);
    }
  }
  // Outlined along the top and the foot, and at the far end only where the wall ends there. The near
  // end is a join, or the corner the cell's own front face outlines, or behind the wall in front.
  ctx.strokeStyle = 'rgba(0,0,0,0.5)'; ctx.lineWidth = 1; ctx.lineCap = 'butt';
  ctx.beginPath(); const a = P(0, 0), b = P(1, 0), c = P(1, 1), e = P(0, 1);
  ctx.moveTo(a[0], a[1]); ctx.lineTo(b[0], b[1]); ctx.moveTo(e[0], e[1]); ctx.lineTo(c[0], c[1]);
  if (openFar) { const i = xF > xN ? -0.5 : 0.5; ctx.moveTo(b[0] + i, b[1]); ctx.lineTo(c[0] + i, c[1]); }
  ctx.stroke();
}

/** A door in a smooth wall: only its seam, a hairline up its sides and across its head, in the wall's colour darkened. */
function drawSeam(p: Paint, xl: number, xr: number, u: number, wall: string, d: number): void {
  const { ctx, horizon } = p;
  const w = xr - xl, dw = Math.round(w * 0.42), foot = Math.round(horizon + u);
  const x = Math.round(xl + (w - dw) / 2) + 0.5, y = Math.round(horizon + u - u * 1.55) + 0.5;
  ctx.strokeStyle = fog(unhazed(p), shade(wall, 0.7), d); ctx.lineWidth = 1; ctx.lineCap = 'butt';
  ctx.beginPath(); ctx.moveTo(x, foot); ctx.lineTo(x, y); ctx.lineTo(x + dw, y); ctx.lineTo(x + dw, foot); ctx.stroke();
}

function drawDoor(p: Paint, xl: number, xr: number, u: number, color: string, d: number, locked: boolean, arched: boolean): void {
  const { ctx, horizon } = p;
  const w = xr - xl, dw = w * 0.42, dh = u * 1.55;
  const x = xl + (w - dw) / 2, y = horizon + u - dh;
  const wood = fog(unhazed(p), color, d), darkWood = fog(unhazed(p), shade(color, 0.7), d), iron = fog(unhazed(p), '#6a6a74', d);
  // Frame stones.
  ctx.fillStyle = fog(unhazed(p), '#5a5560', d);
  ctx.fillRect(Math.round(x) - 2, Math.round(y) - 2, Math.round(dw) + 4, Math.round(dh) + 2);
  // The door, arched in towns.
  ctx.beginPath();
  if (arched) { ctx.moveTo(x, y + dh); ctx.lineTo(x, y + dw * 0.5); ctx.arc(x + dw / 2, y + dw * 0.5, dw / 2, Math.PI, 0); ctx.lineTo(x + dw, y + dh); }
  else ctx.rect(x, y, dw, dh);
  ctx.closePath();
  ctx.fillStyle = wood; ctx.fill(); ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.lineWidth = 1; ctx.stroke();
  ctx.save(); ctx.clip();
  // Planks and two iron bands with rivets.
  ctx.fillStyle = darkWood;
  for (let i = 1; i < 4; i++) ctx.fillRect(Math.round(x + dw * i / 4), Math.round(y), 1, Math.round(dh));
  ctx.fillStyle = iron;
  for (const t of [0.3, 0.7]) {
    ctx.fillRect(Math.round(x), Math.round(y + dh * t), Math.round(dw), Math.max(1, Math.round(u * 0.05)));
    if (dw > 16) for (let i = 0; i < 4; i++) { ctx.fillStyle = fog(unhazed(p), '#a0a0a8', d); ctx.fillRect(Math.round(x + dw * (i + 0.5) / 4), Math.round(y + dh * t), 1, 1); ctx.fillStyle = iron; }
  }
  ctx.restore();
  // Handle: a ring, or a padlock when locked.
  if (locked) {
    const px = x + dw * 0.72, py = y + dh * 0.5;
    ctx.fillStyle = fog(unhazed(p), '#c9a34a', d); ctx.fillRect(Math.round(px - u * 0.05), Math.round(py), Math.max(2, Math.round(u * 0.1)), Math.max(2, Math.round(u * 0.09)));
    ctx.strokeStyle = fog(unhazed(p), '#8a8a94', d); ctx.lineWidth = Math.max(1, u * 0.02); ctx.beginPath(); ctx.arc(px, py, Math.max(1.5, u * 0.04), Math.PI, 0); ctx.stroke();
  } else if (dw > 10) {
    ctx.strokeStyle = iron; ctx.lineWidth = Math.max(1, u * 0.02);
    ctx.beginPath(); ctx.arc(x + dw * 0.72, y + dh * 0.55, Math.max(1.5, u * 0.04), 0, Math.PI * 2); ctx.stroke();
  }
}

/**
 * A town's gate (#1071): the wall's own stone turned in a round arch on jambs over two timber leaves,
 * planked and strapped in iron as a door is and met in the middle; a cart's width, and nearly the
 * wall's height. In a smooth wall, only its seam, as a door's is.
 */
function drawGate(p: Paint, xl: number, xr: number, u: number, pal: MapPalette, d: number, seed: number): void {
  const { ctx, horizon } = p;
  const w = xr - xl, r = w * 0.34, cx = (xl + xr) / 2, foot = horizon + u, spring = foot - u * 1.02;
  const arch = (rad: number): void => { ctx.beginPath(); ctx.moveTo(cx - rad, foot); ctx.lineTo(cx - rad, spring); ctx.arc(cx, spring, rad, Math.PI, 0); ctx.lineTo(cx + rad, foot); };
  if (pal.wallStyle === 'smooth') {
    ctx.strokeStyle = fog(unhazed(p), shade(pal.wall, 0.7), d); ctx.lineWidth = 1; ctx.lineCap = 'butt';
    arch(r); ctx.moveTo(cx, foot); ctx.lineTo(cx, spring - r); ctx.stroke();
    return;
  }
  // The ring of voussoirs over the jambs' stones, each a little lighter or darker, the keystone lightest.
  const t = Math.max(1, u * 0.13), n = r > 12 ? 9 : r > 6 ? 5 : 1, outline = 'rgba(0,0,0,0.45)';
  const stone = (k: number): string => fog(p, shade(pal.wall, k), d);
  ctx.lineWidth = 1; ctx.strokeStyle = outline;
  for (let i = 0; i < n; i++) {
    const a0 = Math.PI * (1 + i / n), a1 = Math.PI * (1 + (i + 1) / n);
    ctx.beginPath(); ctx.arc(cx, spring, r + t, a0, a1); ctx.arc(cx, spring, r, a1, a0, true); ctx.closePath();
    ctx.fillStyle = stone(i === (n - 1) / 2 ? 1.14 : 0.94 + 0.12 * hash(seed, i, 7)); ctx.fill(); ctx.stroke();
  }
  for (const s of [-1, 1]) for (let k = 0; k < 3; k++) {
    const y0 = Math.round(spring + (foot - spring) * k / 3), y1 = Math.round(spring + (foot - spring) * (k + 1) / 3);
    const x0 = Math.round(s < 0 ? cx - r - t : cx + r), x1 = Math.round(s < 0 ? cx - r : cx + r + t);
    if (x1 - x0 < 1 || y1 - y0 < 1) continue;
    ctx.fillStyle = stone(0.94 + 0.12 * hash(seed, k, s + 9)); ctx.fillRect(x0, y0, x1 - x0, y1 - y0);
    ctx.strokeRect(x0 + 0.5, y0 + 0.5, x1 - x0 - 1, y1 - y0 - 1);
  }
  // The leaves under the arch: planks, the seam where they meet, two iron straps with their studs and a ring each.
  const wood = fog(unhazed(p), pal.door, d), dark = fog(unhazed(p), shade(pal.door, 0.62), d), iron = fog(unhazed(p), '#5a5a64', d);
  arch(r); ctx.closePath(); ctx.fillStyle = wood; ctx.fill();
  ctx.save(); ctx.clip();
  ctx.fillStyle = dark;
  const planks = r > 8 ? 8 : 4;
  for (let i = 1; i < planks; i++) ctx.fillRect(Math.round(cx - r + (2 * r * i) / planks), Math.round(spring - r), 1, Math.round(foot - spring + r));
  ctx.fillRect(Math.round(cx) - 1, Math.round(spring - r), Math.max(1, Math.round(u * 0.03)) + 1, Math.round(foot - spring + r));
  ctx.fillStyle = iron;
  for (const k of [0.22, 0.7]) {
    const by = Math.round(foot - (foot - spring) * k), bh = Math.max(1, Math.round(u * 0.06));
    ctx.fillRect(Math.round(cx - r), by, Math.round(2 * r), bh);
    if (r > 10) { ctx.fillStyle = fog(unhazed(p), '#a0a0a8', d); for (let i = 0; i < 8; i++) ctx.fillRect(Math.round(cx - r + (2 * r * (i + 0.5)) / 8), by + Math.floor(bh / 2), 1, 1); ctx.fillStyle = iron; }
  }
  ctx.restore();
  arch(r); ctx.strokeStyle = 'rgba(0,0,0,0.6)'; ctx.stroke();
  if (r > 10) {
    ctx.strokeStyle = iron; ctx.lineWidth = Math.max(1, u * 0.025);
    for (const s of [-1, 1]) { ctx.beginPath(); ctx.arc(cx + s * r * 0.22, foot - (foot - spring) * 0.46, Math.max(1.5, u * 0.05), 0, Math.PI * 2); ctx.stroke(); }
    ctx.lineWidth = 1;
  }
}
