// Procedural front-facing portraits: one per character, deterministic from the name, race and
// class, cel-shaded with the engine's helpers, drawn once into an offscreen canvas and cached.
// Expression follows the character's state (well, hurt, down, dead).
import type { Character } from '../game/party.ts';
import { isDown, hasCondition } from '../game/party.ts';
import { celBall, celPoly, celRect, band, celCapsule, outlinePath, tones } from '../lib/art/shading.ts';
import { shade, mix } from '../lib/art/palettes.ts';
import { pathEllipse } from '../lib/art/shapes.ts';
import { makeBrush, hashStr } from './brush.ts';

export const PORTRAIT_W = 36, PORTRAIT_H = 46;

type Mood = 'well' | 'hurt' | 'down' | 'dead';

const SKIN: Record<string, string[]> = {
  human: ['#e8b890', '#d9a377', '#b97d52', '#8d5a3a', '#f0cdb0'],
  dwarf: ['#e0a882', '#c98b62', '#b07048'],
  elf: ['#f0d6c0', '#e2c0a4', '#d4b08e'],
  gnome: ['#eec0a0', '#d8a888', '#c29070'],
  tidefolk: ['#8fb4c0', '#7aa0b4', '#a0c4cc'],
  orcblood: ['#8fa070', '#7a8c5c', '#a4b080'],
};
const HAIR = ['#2a1a12', '#5a3418', '#8a5a2a', '#c08a40', '#d8c090', '#3a3a44', '#9a9aa4', '#b04a28', '#e8e0d0'];
const EYES = ['#3a5a8a', '#4a7a3a', '#6a4a2a', '#2a2a30', '#8a6a2a'];
const CLASS_BG: Record<string, string> = { knight: '#3a4a6a', paladin: '#6a5a2a', ranger: '#2f4a2a', cleric: '#5a5a70', sorcerer: '#3a2a5a', thief: '#2a2a2e', barbarian: '#5a2e24', monk: '#6a4a2a', bard: '#4a2a4a', druid: '#2a4a3a' };
const CLASS_CLOTH: Record<string, string> = { knight: '#8a8ea0', paladin: '#c9a34a', ranger: '#5a7a42', cleric: '#e8dcc0', sorcerer: '#5a4a9a', thief: '#4a4a52', barbarian: '#7a5a3a', monk: '#c07a2a', bard: '#8a3a6a', druid: '#6a8a4a' };

const cache = new Map<string, HTMLCanvasElement>();

function mood(c: Character): Mood {
  if (hasCondition(c, 'dead')) return 'dead';
  if (isDown(c)) return 'down';
  if (c.hp < c.maxHp / 3 || c.conditions.length) return 'hurt';
  return 'well';
}

/** Draw the character's portrait with its top-left at x,y. Cached per (identity, mood). */
export function drawPortrait(ctx: CanvasRenderingContext2D, c: Character, x: number, y: number): void {
  const m = mood(c);
  const key = `${c.name}|${c.race}|${c.cls}|${m}`;
  let cv = cache.get(key);
  if (!cv) {
    cv = document.createElement('canvas');
    cv.width = PORTRAIT_W; cv.height = PORTRAIT_H;
    paint(cv.getContext('2d')!, c, m);
    if (cache.size > 200) cache.clear();
    cache.set(key, cv);
  }
  ctx.drawImage(cv, x, y);
}

function paint(g: CanvasRenderingContext2D, c: Character, m: Mood): void {
  const W = PORTRAIT_W, H = PORTRAIT_H;
  const h = hashStr(c.name + c.race);
  const pick = <T,>(arr: readonly T[], salt: number): T => arr[Math.floor(hashStr(c.name + salt) * arr.length)];
  const b = makeBrush('#120c14', 1);
  const skin0 = pick(SKIN[c.race], 1), hair0 = pick(HAIR, 2), eye = pick(EYES, 3);
  const grey = m === 'dead';
  const tint = (col: string) => grey ? mix(shade(col, 0.6), '#6a6a72', 0.6) : col;
  const skin = tint(skin0), hair = tint(hair0), cloth = tint(CLASS_CLOTH[c.cls]);

  // Backdrop: class colour, darker at the bottom.
  const bg = g.createLinearGradient(0, 0, 0, H);
  bg.addColorStop(0, shade(CLASS_BG[c.cls], 1.1)); bg.addColorStop(1, shade(CLASS_BG[c.cls], 0.55));
  g.fillStyle = bg; g.fillRect(0, 0, W, H);

  // Proportions by race.
  const big = c.race === 'orcblood' || c.race === 'dwarf';
  const headR = c.race === 'gnome' ? 9 : c.race === 'elf' ? 9.5 : big ? 11 : 10;
  const cx = W / 2, cy = 19;
  const jawW = c.race === 'elf' ? 0.72 : c.race === 'orcblood' ? 1.0 : c.race === 'dwarf' ? 0.95 : 0.82;

  // Shoulders and collar.
  celPoly(g, b, [4, H, 6, 36, cx - 6, 32, cx + 6, 32, W - 6, 36, W - 4, H], cloth, 0.3, 0.25);
  if (c.cls === 'knight') { band(g, b, 8, 35, W - 16, 4, tint('#b9c0cc')); band(g, b, cx - 3, 31, 6, 6, tint('#b9c0cc')); }
  if (c.cls === 'paladin') band(g, b, cx - 8, 36, 16, 3, tint('#e8d090'));
  if (c.cls === 'thief') { celPoly(g, b, [6, 38, cx - 5, 30, cx + 5, 30, W - 6, 38, W - 6, H, 6, H], tint('#33333a'), 0.3, 0.2); }
  if (c.cls === 'sorcerer') band(g, b, 7, 37, W - 14, 2, tint('#c9a34a'));
  if (c.cls === 'barbarian') band(g, b, 6, 36, W - 12, 3, tint('#9a7a5a'));
  if (c.cls === 'bard') band(g, b, cx - 6, 35, 12, 2, tint('#e8d090'));
  if (c.cls === 'cleric') celPoly(g, b, [cx - 2, 33, cx + 2, 33, cx + 2, 44, cx - 2, 44], tint('#c9a34a'), 0.2, 0.2);

  // Neck.
  celRect(g, b, cx - 4, cy + headR - 3, 8, 8, 2, shade(skin, 0.92), 0.4, 0);
  if (c.race === 'tidefolk') { g.fillStyle = shade(skin, 0.6); for (let i = 0; i < 3; i++) g.fillRect(cx - 3, cy + headR + i * 2, 6, 1); }

  // Head: an ellipse with a jaw polygon so races differ in shape.
  const jw = headR * jawW;
  g.beginPath();
  g.moveTo(cx - headR, cy - 1);
  g.quadraticCurveTo(cx - headR, cy - headR - 1, cx, cy - headR - 1);
  g.quadraticCurveTo(cx + headR, cy - headR - 1, cx + headR, cy - 1);
  g.lineTo(cx + jw, cy + headR * 0.9);
  g.quadraticCurveTo(cx, cy + headR * 1.2, cx - jw, cy + headR * 0.9);
  g.closePath();
  // celPath through celPoly is polygon-only; outline + tone bands by hand here.
  outlinePath(g, b);
  const t = tones(b, skin);
  g.fillStyle = t.base; g.fill();
  g.save(); g.clip();
  g.fillStyle = t.sh; g.fillRect(cx + headR * 0.45, cy - headR - 2, headR, headR * 2.5); g.fillRect(cx - headR - 1, cy + headR * 0.55, headR * 2 + 2, headR);
  g.fillStyle = t.hi; g.fillRect(cx - headR * 0.75, cy - headR, headR * 0.6, headR * 0.5);
  g.restore();

  // Ears.
  if (c.race === 'elf') { celPoly(g, b, [cx - headR + 1, cy - 1, cx - headR - 4, cy - 6, cx - headR + 2, cy + 3], skin, 0.3, 0); celPoly(g, b, [cx + headR - 1, cy - 1, cx + headR + 4, cy - 6, cx + headR - 2, cy + 3], skin, 0.3, 0); }
  else if (c.race === 'gnome') { celBall(g, b, cx - headR, cy + 1, 3, skin); celBall(g, b, cx + headR, cy + 1, 3, skin); }
  else if (c.race !== 'tidefolk') { celBall(g, b, cx - headR + 0.5, cy + 1, 2, skin, false); celBall(g, b, cx + headR - 0.5, cy + 1, 2, skin, false); }
  else { celPoly(g, b, [cx - headR + 1, cy - 2, cx - headR - 3, cy + 1, cx - headR + 1, cy + 4], shade(skin, 0.85), 0.3, 0); celPoly(g, b, [cx + headR - 1, cy - 2, cx + headR + 3, cy + 1, cx + headR - 1, cy + 4], shade(skin, 0.85), 0.3, 0); }

  // Eyes.
  const ey = cy - 1, ex = headR * 0.42;
  const closed = m === 'down' || m === 'dead';
  for (const s of [-1, 1]) {
    const x = cx + s * ex;
    if (closed) {
      g.strokeStyle = '#120c14'; g.lineWidth = 1;
      if (m === 'dead') { g.beginPath(); g.moveTo(x - 2, ey - 2); g.lineTo(x + 2, ey + 2); g.moveTo(x + 2, ey - 2); g.lineTo(x - 2, ey + 2); g.stroke(); }
      else { g.beginPath(); g.moveTo(x - 2.5, ey + 0.5); g.lineTo(x + 2.5, ey + 0.5); g.stroke(); }
    } else {
      pathEllipse(g, x, ey, 2.6, 1.8); g.fillStyle = '#f4f0e8'; g.fill(); g.strokeStyle = '#120c14'; g.lineWidth = 1; g.stroke();
      g.fillStyle = eye; g.fillRect(x - 1, ey - 1, 2, 2);
      g.fillStyle = '#120c14'; g.fillRect(x - 0.5, ey - 0.5, 1, 1);
    }
    // Brow: angry when hurt, level otherwise; orcs and dwarves heavy.
    g.strokeStyle = shade(hair, 0.8); g.lineWidth = big ? 2 : 1;
    g.beginPath();
    const tilt = m === 'hurt' ? -s * 1.2 : 0;
    g.moveTo(x - 3, ey - 3.5 + tilt); g.lineTo(x + 3, ey - 3.5 - tilt); g.stroke();
  }
  // Nose.
  g.strokeStyle = shade(skin, 0.6); g.lineWidth = 1;
  if (c.race === 'gnome') { celBall(g, b, cx, cy + 2.5, 2.5, skin, false); }
  else { g.beginPath(); g.moveTo(cx - 0.5, ey + 1); g.lineTo(cx - 1.5, cy + 3); g.lineTo(cx + 1, cy + 3.5); g.stroke(); }
  // Mouth.
  const my = cy + headR * 0.55;
  g.strokeStyle = shade(skin, 0.5); g.lineWidth = 1; g.beginPath();
  if (m === 'hurt') { g.moveTo(cx - 3, my + 1); g.quadraticCurveTo(cx, my - 1.5, cx + 3, my + 1); }
  else if (m === 'well') { g.moveTo(cx - 3, my); g.quadraticCurveTo(cx, my + 1.5, cx + 3, my); }
  else { g.moveTo(cx - 2.5, my); g.lineTo(cx + 2.5, my); }
  g.stroke();
  if (c.race === 'orcblood') { g.fillStyle = '#f0ead8'; g.fillRect(cx - 4, my - 3, 1.5, 3); g.fillRect(cx + 2.5, my - 3, 1.5, 3); }

  // Beard for dwarves (and some human men by hash).
  if (c.race === 'dwarf' || (c.race === 'human' && h > 0.7)) {
    celPoly(g, b, [cx - jw - 1, cy + 2, cx + jw + 1, cy + 2, cx + jw * 0.8, cy + headR * 1.5 + (c.race === 'dwarf' ? 6 : 0), cx, cy + headR * 1.7 + (c.race === 'dwarf' ? 8 : 0), cx - jw * 0.8, cy + headR * 1.5 + (c.race === 'dwarf' ? 6 : 0)], hair, 0.35, 0.2);
    // Keep the mouth visible.
    g.strokeStyle = shade(hair, 0.5); g.beginPath(); g.moveTo(cx - 2.5, my); g.lineTo(cx + 2.5, my); g.stroke();
  }

  // Hair and headgear.
  const style = Math.floor(hashStr(c.name + 'hair') * 4); // 0 short, 1 long, 2 bald/cropped, 3 topknot
  const hooded = c.cls === 'sorcerer' || c.cls === 'thief' || c.cls === 'cleric' || c.cls === 'druid';
  if (hooded) {
    const hc = c.cls === 'sorcerer' ? tint('#5a4a9a') : c.cls === 'thief' ? tint('#33333a') : c.cls === 'druid' ? tint('#4a6a3a') : tint('#d8ccb0');
    celPoly(g, b, [cx - headR - 2, cy + 4, cx - headR - 1, cy - headR + 1, cx - headR * 0.5, cy - headR - 4, cx + headR * 0.5, cy - headR - 4, cx + headR + 1, cy - headR + 1, cx + headR + 2, cy + 4, cx + headR - 1, cy - 2, cx + headR * 0.6, cy - headR + 1, cx - headR * 0.6, cy - headR + 1, cx - headR + 1, cy - 2], hc, 0.4, 0.25);
    if (c.cls === 'thief') { g.fillStyle = 'rgba(10,8,12,0.35)'; g.fillRect(cx - headR + 2, cy - headR + 2, headR * 2 - 4, 5); }
  } else {
    if (style !== 2) {
      const hp = style === 1
        ? [cx - headR - 1, cy + 10, cx - headR - 1, cy - headR * 0.4, cx - headR * 0.6, cy - headR - 1, cx + headR * 0.6, cy - headR - 1, cx + headR + 1, cy - headR * 0.4, cx + headR + 1, cy + 10, cx + headR - 1, cy + 8, cx + headR - 1, cy - 3, cx + headR * 0.5, cy - headR + 1.5, cx - headR * 0.5, cy - headR + 1.5, cx - headR + 1, cy - 3, cx - headR + 1, cy + 8]
        : [cx - headR - 1, cy - 2, cx - headR - 0.5, cy - headR * 0.6, cx - headR * 0.6, cy - headR - 1.5, cx + headR * 0.6, cy - headR - 1.5, cx + headR + 0.5, cy - headR * 0.6, cx + headR + 1, cy - 2, cx + headR - 1, cy - 3, cx + headR * 0.5, cy - headR + 1.5, cx - headR * 0.5, cy - headR + 1.5, cx - headR + 1, cy - 3];
      celPoly(g, b, hp, hair, 0.35, 0.3);
      if (style === 3) celBall(g, b, cx, cy - headR - 2, 3, hair);
    } else { g.fillStyle = shade(skin, 0.9); g.fillRect(cx - headR * 0.5, cy - headR + 1, headR, 1); }
    if (c.cls === 'knight') {
      celPoly(g, b, [cx - headR - 2, cy - 1, cx - headR - 1, cy - headR + 0.5, cx - headR * 0.5, cy - headR - 3, cx + headR * 0.5, cy - headR - 3, cx + headR + 1, cy - headR + 0.5, cx + headR + 2, cy - 1, cx + headR * 0.75, cy - headR * 0.35, cx - headR * 0.75, cy - headR * 0.35], tint('#b9c0cc'), 0.35, 0.3);
      band(g, b, cx - 1, cy - headR - 6, 2, 5, tint('#c6453c'));
    } else if (c.cls === 'paladin') band(g, b, cx - headR + 1, cy - headR + 2, headR * 2 - 2, 2, tint('#e8d090'));
    else if (c.cls === 'monk') band(g, b, cx - headR + 1, cy - headR * 0.5, headR * 2 - 2, 2, tint('#c07a2a'));
    else if (c.cls === 'ranger') band(g, b, cx - headR + 1, cy - headR * 0.5, headR * 2 - 2, 2, tint('#3a5a2a'));
  }
  if (m === 'dead') { g.fillStyle = 'rgba(40,40,60,0.35)'; g.fillRect(0, 0, W, H); }
  if (m === 'down') { g.fillStyle = 'rgba(120,20,20,0.18)'; g.fillRect(0, 0, W, H); }
  // Frame.
  g.strokeStyle = 'rgba(10,8,12,0.9)'; g.strokeRect(0.5, 0.5, W - 1, H - 1);
}

/** For the sheet: the same portrait at 2x. */
export function drawPortraitLarge(ctx: CanvasRenderingContext2D, c: Character, x: number, y: number): void {
  ctx.save(); ctx.imageSmoothingEnabled = false;
  const m = mood(c);
  const key = `${c.name}|${c.race}|${c.cls}|${m}`;
  drawPortrait(ctx, c, -1000, -1000);
  const cv = cache.get(key)!;
  ctx.drawImage(cv, x, y, PORTRAIT_W * 2, PORTRAIT_H * 2);
  ctx.restore();
}

export { celCapsule };
