// Kilnhaven's inn, where the coach for Rime Lodge is boarded: a timber-framed room with the ore's
// red dust low on its plaster, the coach standing in the yard through the window, its board over
// the window, the guard's horn hung on the chimney breast, an iron fireback cast with a ship, a
// settle by the fire and travellers' trunks stacked by the door.
import { shade, rgba, mix } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, plaster, beam, flagstones, windowIn, skyFill, line, smudge, fillPoly, path, ink, slab, contact } from '../kit.ts';
import { K, hearth, lantern, tankard, jug, loaf, candle } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { drawText } from '../../../lib/engine/text.ts';
import { TAR, IRON, oreDust, rubble } from './port.ts';

const FLOOR = 204, WASH = '#d6cfbe', BRASS = '#c8a048', COACH = '#5a1e1c';

/**
 * The coach yard through the window: the coach for Rime Lodge stood unhorsed with its pole on the
 * cobbles, trunks roped on its roof and its lamp by the box; the yard wall and the heath beyond.
 * By night the lamp on the coach is lit, and one on the yard gate.
 */
function coachYard(x: number, y: number, w: number, h: number, daylight: number) {
  return (ctx: CanvasRenderingContext2D): void => {
    const d = daylight;
    skyFill(ctx, x, y, w, h, d, 831);
    // The heath on the skyline, the yard wall, the cobbles.
    fillPoly(ctx, [x, y + h * 0.52, x + w * 0.3, y + h * 0.46, x + w * 0.7, y + h * 0.5, x + w, y + h * 0.44, x + w, y + h, x, y + h], mix('#100e12', '#7a6a5a', d));
    ctx.fillStyle = mix('#141218', '#8a847a', d); ctx.fillRect(x, y + h * 0.5, w, h * 0.2);
    for (let i = 0; i < 6; i++) line(ctx, [x, y + h * (0.53 + i * 0.03), x + w, y + h * (0.53 + i * 0.03)], rgba('#0a0608', 0.25), 1);
    ctx.fillStyle = mix('#0e0c10', '#6a645c', d); ctx.fillRect(x, y + h * 0.7, w, h * 0.3);
    for (let r = 0; r < 4; r++) for (let i = 0; i < 9; i++) { ctx.fillStyle = shade(mix('#0e0c10', '#6a645c', d), 0.8 + rnd(832, r, i) * 0.4); ctx.beginPath(); ctx.ellipse(x + (i + (r % 2) * 0.5) * (w / 8), y + h * (0.74 + r * 0.07), w / 20, 1.5 + r * 0.5, 0, 0, Math.PI * 2); ctx.fill(); }
    // The coach: body on its springs, door and window, the roof with its rail and load, wheels.
    const cx = x + w * 0.5, base = y + h * 0.8, bw = w * 0.5, bh = h * 0.26, body = mix('#100808', COACH, d * 0.85 + 0.15), wheel = mix('#141008', '#c8a040', d * 0.9 + 0.1);
    const wheelAt = (wx: number, r: number): void => {
      ctx.strokeStyle = mix('#060406', '#1a1410', d); ctx.lineWidth = 2.5; ctx.beginPath(); ctx.arc(wx, base - r, r, 0, Math.PI * 2); ctx.stroke();
      for (let i = 0; i < 8; i++) { const a = (i / 8) * Math.PI * 2; line(ctx, [wx, base - r, wx + Math.cos(a) * r, base - r + Math.sin(a) * r], wheel, 1); }
      ctx.strokeStyle = wheel; ctx.lineWidth = 1; ctx.beginPath(); ctx.arc(wx, base - r, r - 1.5, 0, Math.PI * 2); ctx.stroke();
    };
    wheelAt(cx - bw * 0.36, h * 0.13); wheelAt(cx + bw * 0.4, h * 0.1);
    fillPoly(ctx, [cx - bw / 2, base - h * 0.2, cx - bw / 2 - 2, base - h * 0.2 - bh, cx + bw / 2 + 2, base - h * 0.2 - bh, cx + bw / 2, base - h * 0.2, cx + bw * 0.36, base - h * 0.14, cx - bw * 0.38, base - h * 0.14], body);
    path(ctx, [cx - bw / 2, base - h * 0.2, cx - bw / 2 - 2, base - h * 0.2 - bh, cx + bw / 2 + 2, base - h * 0.2 - bh, cx + bw / 2, base - h * 0.2, cx + bw * 0.36, base - h * 0.14, cx - bw * 0.38, base - h * 0.14]); ink(ctx);
    const top = base - h * 0.2 - bh;
    ctx.fillStyle = mix('#18141a', '#c8d8e0', d); ctx.fillRect(Math.round(cx - bw * 0.12), Math.round(top + bh * 0.16), Math.round(bw * 0.24), Math.round(bh * 0.34));
    line(ctx, [cx - bw * 0.14, top + bh * 0.1, cx - bw * 0.14, base - h * 0.17], rgba('#0a0608', 0.6), 1); line(ctx, [cx + bw * 0.14, top + bh * 0.1, cx + bw * 0.14, base - h * 0.17], rgba('#0a0608', 0.6), 1);
    ctx.fillStyle = mix('#060608', '#1a1a1e', d); ctx.fillRect(Math.round(cx - bw / 2 - 3), Math.round(top - 3), Math.round(bw + 6), 3);
    // Trunks roped on the roof, and the box seat at the front with its lamp.
    glossPoly(ctx, K, [cx - bw * 0.36, top - 3, cx - bw * 0.36, top - 9, cx + bw * 0.06, top - 9, cx + bw * 0.06, top - 3], mix('#100c0a', '#6a4a2a', d), {});
    glossPoly(ctx, K, [cx + bw * 0.1, top - 3, cx + bw * 0.12, top - 8, cx + bw * 0.34, top - 8, cx + bw * 0.36, top - 3], mix('#0c0a0a', '#3a3a3e', d), {});
    line(ctx, [cx + bw / 2, top + bh * 0.3, cx + bw * 0.78, top + bh * 0.1], mix('#060406', '#2a2018', d), 2);
    const lx = cx + bw * 0.56, ly = top + bh * 0.08;
    ctx.fillStyle = d < 0.5 ? '#ffe0a0' : mix('#2a2a30', '#c8c0a8', d); ctx.fillRect(Math.round(lx) - 1, Math.round(ly) - 2, 3, 4);
    // The pole down on the cobbles where the horses were taken out.
    line(ctx, [cx + bw * 0.46, base - h * 0.12, x + w, base + h * 0.06], mix('#08060a', '#5a4430', d), 2);
    if (d < 0.5) {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      smudge(ctx, lx, ly, h * 0.16, '#ffb060', 0.8 * (1 - d * 2));
      smudge(ctx, x + w * 0.08, y + h * 0.42, h * 0.12, '#ffb060', 0.6 * (1 - d * 2));
      ctx.restore();
      ctx.fillStyle = '#ffe8b0'; ctx.fillRect(Math.round(x + w * 0.08) - 1, Math.round(y + h * 0.42) - 1, 2, 3);
    }
  };
}

/** The guard's horn, a long straight coaching horn of brass hung on two pegs, its bell to the right. Mouthpiece at (x, y). */
function horn(ctx: CanvasRenderingContext2D, x: number, y: number, len: number): void {
  for (const px of [x + len * 0.2, x + len * 0.7]) glossBall(ctx, K, px, y - 2, 1.5, '#3a2a20', {});
  glossPoly(ctx, K, [x, y - 1, x + len * 0.86, y - 2.5, x + len, y - 7, x + len, y + 6, x + len * 0.86, y + 1.5, x, y + 1], BRASS, { gloss: 0.8, spread: 0.6 });
  glossEllipse(ctx, K, x + len, y - 0.5, 1.8, 6.5, shade(BRASS, 0.7), 0, {});
  glossBall(ctx, K, x - 1, y, 1.8, BRASS, { gloss: 0.8 });
}

/** The fireback, a plate of cast iron stood at the back of the firebox, a ship under sail cast on it. Its foot on y, centred on x. */
function fireback(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  const pts = [x - w / 2, y, x - w / 2, y - h * 0.7, x - w * 0.3, y - h * 0.86, x, y - h, x + w * 0.3, y - h * 0.86, x + w / 2, y - h * 0.7, x + w / 2, y];
  glossPoly(ctx, K, pts, '#2a2626', { gloss: 0.3, spread: 0.7 });
  const c = rgba('#6a5a52', 0.8);
  line(ctx, [x - w * 0.3, y - h * 0.3, x + w * 0.3, y - h * 0.3, x + w * 0.22, y - h * 0.2, x - w * 0.24, y - h * 0.2, x - w * 0.3, y - h * 0.3], c, 1);
  line(ctx, [x, y - h * 0.3, x, y - h * 0.8], c, 1);
  fillPoly(ctx, [x + 1, y - h * 0.76, x + w * 0.22, y - h * 0.38, x + 1, y - h * 0.38], c);
  fillPoly(ctx, [x - 1, y - h * 0.66, x - w * 0.18, y - h * 0.4, x - 1, y - h * 0.4], c);
}

/** A settle seen end on, its foot on y: a high back of boards with a curved top, the seat and its arm, facing the fire. */
function settle(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, wood: string): void {
  const back = [x, y, x, y - h, x + 6, y - h - 4, x + 12, y - h, x + 12, y];
  contact(ctx, x + 20, y, 60, 0.45);
  glossPoly(ctx, K, [x + 12, y - h * 0.44, x + 52, y - h * 0.44, x + 52, y - h * 0.36, x + 12, y - h * 0.36], shade(wood, 1.15), { gloss: 0.2 });
  slab(ctx, x + 46, y - h * 0.36, 6, h * 0.36, shade(wood, 0.8), { lit: 1 });
  glossPoly(ctx, K, [x + 12, y - h * 0.62, x + 40, y - h * 0.62, x + 44, y - h * 0.58, x + 44, y - h * 0.44, x + 40, y - h * 0.44, x + 40, y - h * 0.58, x + 12, y - h * 0.58], wood, { gloss: 0.2 });
  glossPoly(ctx, K, back, wood, { gloss: 0.2, spread: 0.7 });
  for (let i = 1; i < 6; i++) line(ctx, [x + 1, y - (h * i) / 6, x + 11, y - (h * i) / 6], rgba('#1a1008', 0.4), 1);
}

/** A travelling trunk on y: a domed lid, iron bands and corners, a brass lock. */
function trunk(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, hide: string): void {
  contact(ctx, x + w / 2, y, w * 1.05, 0.45);
  slab(ctx, x, y - h * 0.68, w, h * 0.68, hide, { lit: 2, dark: 0.25 });
  glossPoly(ctx, K, [x, y - h * 0.68, x + w * 0.06, y - h * 0.92, x + w * 0.3, y - h, x + w * 0.7, y - h, x + w * 0.94, y - h * 0.92, x + w, y - h * 0.68], shade(hide, 1.1), { gloss: 0.2, spread: 0.8 });
  for (const f of [0.18, 0.82]) { ctx.fillStyle = IRON; ctx.fillRect(Math.round(x + w * f - 2), Math.round(y - h), 4, Math.round(h)); }
  slab(ctx, x - 1, y - h * 0.7, w + 2, 3, IRON, { lit: 1, outline: false });
  glossPoly(ctx, K, [x + w / 2 - 3, y - h * 0.72, x + w / 2 + 3, y - h * 0.72, x + w / 2 + 3, y - h * 0.58, x + w / 2 - 3, y - h * 0.58], BRASS, { gloss: 0.7 });
}

export const KILNHAVEN_INN: Scene = {
  ambient: ['#2a2830', '#8e8a84'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    plaster(ctx, 0, 0, STAGE_W, FLOOR, WASH, 833);
    oreDust(ctx, 0, FLOOR - 70, STAGE_W, 70, 834, 0.5);
    flagstones(ctx, FLOOR, 200, 110, '#6e6a64', 6, 835);
    oreDust(ctx, 0, FLOOR, STAGE_W, STAGE_H - FLOOR, 836, 0.32);
    // The frame: tarred posts and rails with the plaster between, the ceiling's joists over all.
    beam(ctx, 0, 0, STAGE_W, 16, TAR, 837);
    for (const px of [18, 176, 244]) beam(ctx, px, 16, 10, FLOOR - 16, TAR, px);
    beam(ctx, 0, 150, 244, 8, TAR, 838);
    fillPoly(ctx, [176, 150, 186, 150, 228, 20, 218, 20], shade(TAR, 0.9)); path(ctx, [176, 150, 186, 150, 228, 20, 218, 20]); ink(ctx);
    // The window on the coach yard, and the coach's board over it.
    windowIn(ctx, s, 40, 52, 120, 84, TAR, { panes: [4, 3], view: coachYard(40, 52, 120, 84, s.daylight) });
    slab(ctx, 52, 24, 96, 18, '#2a3a2e', { lit: 2, dark: 0.2 });
    drawText(ctx, 'RIME LODGE', 100, 30, { size: 1, color: '#e8d080', align: 'center', shadowColor: '#120c14' });
    for (const px of [58, 142]) glossBall(ctx, K, px, 33, 1.4, BRASS, {});
    lantern(ctx, s, 196, 86, 10, IRON, 16, 160);
    // The hearth on the right, stone of the port, the fireback in it, the horn over the mantel.
    rubble(ctx, 254, 16, 146, FLOOR - 16, 9, 839);
    const box = hearth(ctx, s, 270, 54, 116, FLOOR, '#7a7a78', 840, { mantel: TAR, reach: 240 });
    fireback(ctx, box.x + box.w / 2, box.y + box.h - 10, box.w * 0.62, box.h * 0.62);
    horn(ctx, 284, 74, 84);
    candle(ctx, s, 300, box.y - box.w * 0.36, 12, '#efe4c8', 90); candle(ctx, s, 368, box.y - box.w * 0.36, 12, '#efe4c8', 90);
    // The trunks stacked by the door, left, waiting on the coach.
    trunk(ctx, 4, STAGE_H - 4, 64, 44, '#5a3a24');
    trunk(ctx, 12, STAGE_H - 48, 48, 30, '#3a3a44');
    glossPoly(ctx, K, [70, STAGE_H - 2, 72, STAGE_H - 30, 100, STAGE_H - 30, 102, STAGE_H - 2], '#7a5a3a', { gloss: 0.2 });
    line(ctx, [78, STAGE_H - 30, 86, STAGE_H - 40, 94, STAGE_H - 30], '#3a2a1a', 2);
    // The table in the middle, and the settle by the fire with its back to the room.
    contact(ctx, 196, STAGE_H - 6, 120, 0.35);
    slab(ctx, 136, 224, 120, 7, '#4a3a2e', { lit: 2, dark: 0.35 });
    fillPoly(ctx, [136, 224, 146, 216, 246, 216, 256, 224], shade('#5a4636', 1.15));
    for (const lx of [146, 238]) slab(ctx, lx, 231, 8, STAGE_H - 231, '#3a2e24', { lit: 1 });
    jug(ctx, 170, 220, 20, '#9a9aa4', '#5a5a64');
    tankard(ctx, 192, 220, 12, '#8a8e96', { band: '#5a5e68' }); tankard(ctx, 228, 221, 12, '#6a4a30', { band: '#2a1e18', handleLeft: true });
    loaf(ctx, 210, 221, 16);
    settle(ctx, 340, STAGE_H + 2, 84, '#4a3a2c');
  },
};
