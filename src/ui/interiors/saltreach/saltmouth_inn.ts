// Saltmouth's inn, a port's common room: limewash with the damp's tide-line on it under low black
// beams, a long bar, an iron stove, the ship's lamp in its gimbal, the tide table on the wall, the
// quay through the window and the coach yard through the door.
import { shade, rgba, mix } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, STAGE_H, rnd, plaster, beam, planks, floorboards, windowIn, skyFill, line, smudge, fillPoly, slab, pool, contact } from '../kit.ts';
import { K, counter, shelf, bottle, tankard, lantern, kegEnd, plate, cup, stool } from '../props.ts';
import { glossPoly, glossEllipse, glossBall } from '../../monsters/gloss.ts';
import { drawText } from '../../../lib/engine/text.ts';

const TAR = '#2a2224', SILVER = '#8a8478', LIME = '#e6e2d6', BRASS = '#c8a048', IRON = '#34343a';

/** Sea fog laid over a view: thick by day, a dark murk by night. */
function fog(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, daylight: number, a: number): void {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, rgba(mix('#2a3038', '#d8dcd8', daylight), a * 0.4)); g.addColorStop(1, rgba(mix('#1a2028', '#c8ccc8', daylight), a));
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
}

/** The quay through the window: masts going grey into the fog, the quay's edge and a bollard, and its lamp by night. */
function quay(x: number, y: number, w: number, h: number, daylight: number) {
  return (ctx: CanvasRenderingContext2D): void => {
    skyFill(ctx, x, y, w, h, daylight, 249);
    const sea = mix('#141c28', '#5a6e78', daylight), stone = mix('#1a1a20', '#7a7468', daylight);
    ctx.fillStyle = sea; ctx.fillRect(x, y + h * 0.58, w, h * 0.42);
    for (let i = 0; i < 4; i++) {
      const mx = x + w * (0.14 + i * 0.24), far = i % 2;
      ctx.fillStyle = rgba(mix('#0a0c14', '#3a3e44', daylight), far ? 0.45 : 0.9);
      ctx.fillRect(Math.round(mx), Math.round(y + h * (far ? 0.18 : 0.06)), far ? 1 : 2, Math.round(h * (far ? 0.42 : 0.56)));
      line(ctx, [mx - w * 0.12, y + h * (far ? 0.3 : 0.2), mx + w * 0.12, y + h * (far ? 0.3 : 0.2)], rgba('#0a0c14', far ? 0.35 : 0.7), 1);
      if (!far) fillPoly(ctx, [mx - w * 0.14, y + h * 0.6, mx + w * 0.16, y + h * 0.6, mx + w * 0.1, y + h * 0.68, mx - w * 0.1, y + h * 0.68], mix('#0a0a10', '#3a3430', daylight));
    }
    fog(ctx, x, y, w, h * 0.72, daylight, 0.45);
    ctx.fillStyle = stone; ctx.fillRect(x, y + h * 0.74, w, h * 0.26);
    ctx.fillStyle = shade(stone, 1.3); ctx.fillRect(x, y + h * 0.74, w, 1);
    glossPoly(ctx, K, [x + w * 0.7, y + h, x + w * 0.7, y + h * 0.82, x + w * 0.74, y + h * 0.78, x + w * 0.82, y + h * 0.78, x + w * 0.86, y + h * 0.82, x + w * 0.86, y + h], mix('#121216', '#3a3a40', daylight), {});
    if (daylight < 0.5) {
      const lx = x + w * 0.3, ly = y + h * 0.5;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; smudge(ctx, lx, ly, h * 0.35, '#ffc070', 0.6 * (1 - daylight * 2)); ctx.restore();
      ctx.fillStyle = '#ffe8b0'; ctx.fillRect(Math.round(lx) - 1, Math.round(ly) - 1, 3, 3);
    }
  };
}

/** The coach yard through the open door: wet cobbles, a coach wheel against the wall, the yard's lamp on its post. */
function coachYard(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, w: number, h: number): void {
  const d = s.daylight;
  skyFill(ctx, x, y, w, h, d, 250);
  const wall = mix('#16161c', '#8a8070', d), cob = mix('#121216', '#6a6660', d);
  ctx.fillStyle = wall; ctx.fillRect(x, y + h * 0.3, w, h * 0.4);
  ctx.fillStyle = shade(wall, 0.7); ctx.fillRect(x, y + h * 0.28, w, 3);
  fog(ctx, x, y, w, h * 0.7, d, 0.55);
  ctx.fillStyle = cob; ctx.fillRect(x, y + h * 0.7, w, h * 0.3);
  for (let r = 0; r < 5; r++) for (let i = 0; i < 7; i++) {
    const cx = x + (i + (r % 2) * 0.5) * (w / 6), cy = y + h * (0.73 + r * 0.06);
    ctx.fillStyle = shade(cob, 0.8 + rnd(251, r, i) * 0.4); ctx.beginPath(); ctx.ellipse(cx, cy, w / 15 + r, 2 + r * 0.4, 0, 0, Math.PI * 2); ctx.fill();
  }
  // The spare wheel leant on the far wall, spokes and iron tyre.
  const wx = x + w * 0.3, wy = y + h * 0.6, wr = h * 0.12, wood = mix('#1a1410', '#7a5634', d);
  ctx.strokeStyle = mix('#0a0a0e', '#3a3a40', d); ctx.lineWidth = 3; ctx.beginPath(); ctx.arc(wx, wy, wr, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = wood; ctx.lineWidth = 1.5; ctx.beginPath(); ctx.arc(wx, wy, wr - 2.5, 0, Math.PI * 2); ctx.stroke();
  for (let i = 0; i < 6; i++) { const a = (i / 6) * Math.PI * 2; line(ctx, [wx, wy, wx + Math.cos(a) * wr, wy + Math.sin(a) * wr], wood, 1); }
  ctx.fillStyle = wood; ctx.beginPath(); ctx.arc(wx, wy, 2, 0, Math.PI * 2); ctx.fill();
  // The yard's lamp on its post, lit by night.
  const px = x + w * 0.74, top = y + h * 0.36;
  line(ctx, [px, y + h * 0.86, px, top], mix('#0a0a0e', '#2a2a30', d), 2);
  line(ctx, [px - 4, top, px + 4, top], mix('#0a0a0e', '#2a2a30', d), 1);
  ctx.fillStyle = d < 0.5 ? '#ffe0a0' : mix('#2a2a30', '#9a9a90', d); ctx.fillRect(Math.round(px) - 2, Math.round(top) - 6, 5, 6);
  if (d < 0.5) {
    ctx.save(); ctx.globalCompositeOperation = 'lighter'; smudge(ctx, px, top - 3, h * 0.25, '#ffb060', 0.7 * (1 - d * 2)); ctx.restore();
    pool(s, px, top, 70, '#ffb060', 0.35 * (1 - d * 2));
  }
}

/** A net hung in one swag from pegs at x0 and x1 along y, cork floats on its edge. */
function net(ctx: CanvasRenderingContext2D, x0: number, x1: number, y: number, drop: number): void {
  const span = x1 - x0, sag = (u: number): number => y + Math.sin(u * Math.PI) * drop;
  for (let i = 0; i <= 14; i++) {
    const u = i / 14;
    line(ctx, [x0 + span * u, y, x0 + span * Math.min(1, u + 0.2), sag(Math.min(1, u + 0.2))], rgba('#b8ae90', 0.55), 1);
    line(ctx, [x0 + span * u, y, x0 + span * Math.max(0, u - 0.2), sag(Math.max(0, u - 0.2))], rgba('#b8ae90', 0.55), 1);
  }
  const edge: number[] = []; for (let i = 0; i <= 16; i++) edge.push(x0 + span * (i / 16), sag(i / 16));
  line(ctx, edge, '#c8bc98', 1.5);
  for (let i = 1; i < 6; i++) glossEllipse(ctx, K, x0 + span * (i / 6), sag(i / 6) + 2, 3, 2.2, '#c89a5a', 0, { gloss: 0.3 });
  for (const px of [x0, x1]) glossBall(ctx, K, px, y, 2.5, '#4a3a2a', {});
}

/** The ship's lamp, hung from the beam at `top` in its brass gimbal so it hangs true whatever the floor does. */
function shipsLamp(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, top: number): void {
  line(ctx, [x - 12, top, x - 12, y + 6], '#120c14', 2); line(ctx, [x + 12, top, x + 12, y + 6], '#120c14', 2);
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, y + 8, 13, 4, 0, 0, Math.PI * 2); ctx.stroke();
  ctx.strokeStyle = BRASS; ctx.lineWidth = 2; ctx.stroke();
  lantern(ctx, s, x, y, 12, BRASS, null, 190, '#ffe4a8');
  ctx.strokeStyle = '#120c14'; ctx.lineWidth = 4; ctx.beginPath(); ctx.ellipse(x, y + 8, 13, 4, 0, 0, Math.PI); ctx.stroke();
  ctx.strokeStyle = BRASS; ctx.lineWidth = 2; ctx.stroke();
}

/** The iron stove that stands in for a hearth: a box on legs, the grate's glow in its door, a flue up through the ceiling. Foot on y. */
function stove(ctx: CanvasRenderingContext2D, s: Stage, x: number, y: number, w: number): void {
  const h = w * 1.1, top = y - h;
  contact(ctx, x, y, w * 1.3, 0.5);
  line(ctx, [x, top - 4, x, 0], '#120c14', 9); line(ctx, [x, top - 4, x, 0], IRON, 7);
  ctx.fillStyle = rgba('#ffffff', 0.12); ctx.fillRect(Math.round(x - 3), 0, 1, top - 4);
  for (const sd of [-1, 1]) line(ctx, [x + sd * w * 0.4, y - 8, x + sd * w * 0.46, y], '#120c14', 3);
  glossPoly(ctx, K, [x - w / 2, y - 8, x - w / 2, top, x + w / 2, top, x + w / 2, y - 8], IRON, { gloss: 0.4, spread: 0.7 });
  slab(ctx, x - w * 0.58, top - 4, w * 1.16, 5, shade(IRON, 1.2), { lit: 1 });
  // The door, its grate glowing.
  const gx = x - w * 0.28, gy = top + h * 0.3, gw = w * 0.56, gh = h * 0.36;
  ctx.fillStyle = '#1a1014'; ctx.fillRect(gx, gy, gw, gh);
  for (let i = 0; i < 4; i++) { ctx.fillStyle = i % 2 ? '#ff8a30' : '#ffc060'; ctx.fillRect(Math.round(gx + 2 + i * gw / 4), Math.round(gy + gh * 0.4), Math.max(1, Math.round(gw / 8)), Math.round(gh * 0.5)); }
  for (let i = 1; i < 4; i++) { ctx.fillStyle = '#120c14'; ctx.fillRect(Math.round(gx), Math.round(gy + i * gh / 4), Math.round(gw), 1); }
  s.lights.push({ k: 'glow', x, y: gy + gh * 0.6, r: w * 0.7, color: '#ff9040', a: 0.45 });
  pool(s, x, gy + gh, 130, '#ff9a48', 0.6);
  // A kettle keeping warm on the top.
  glossEllipse(ctx, K, x + w * 0.12, top - 10, 8, 6, '#5a5a62', 0, { gloss: 0.6 });
  line(ctx, [x + w * 0.12 + 7, top - 12, x + w * 0.12 + 13, top - 17], '#120c14', 3);
}

/** The tide table: a painted board of the next two days' high and low waters, hung on a nail. */
function tideTable(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, rows: readonly string[]): void {
  line(ctx, [x + w / 2, y - 10, x + 6, y], '#3a2a20', 1); line(ctx, [x + w / 2, y - 10, x + w - 6, y], '#3a2a20', 1);
  glossBall(ctx, K, x + w / 2, y - 10, 1.5, '#5a5a62', {});
  slab(ctx, x, y, w, h, '#2e3a40', { lit: 2, dark: 0.12 });
  ctx.fillStyle = rgba('#e8e0c8', 0.35); ctx.fillRect(x + 4, y + 14, w - 8, 1);
  rows.forEach((r, i) => drawText(ctx, r, x + w / 2, y + 5 + i * (i ? 9 : 11), { size: 1, color: i ? '#d8d0b8' : '#e8c870', align: 'center', shadow: false }));
}

export const SALTMOUTH_INN: Scene = {
  ambient: ['#363844', '#9a9c98'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    const FLOOR = 196;
    // Limewashed walls, salt-bloomed, with the damp's own tide-line along their foot.
    plaster(ctx, 0, 0, STAGE_W, FLOOR, LIME, 249);
    const damp = ctx.createLinearGradient(0, FLOOR - 50, 0, FLOOR);
    damp.addColorStop(0, rgba('#6a7268', 0)); damp.addColorStop(0.3, rgba('#6a7268', 0.32)); damp.addColorStop(1, rgba('#4a5048', 0.45));
    ctx.fillStyle = damp; ctx.fillRect(0, FLOOR - 50, STAGE_W, 50);
    const tide: number[] = []; for (let i = 0; i <= 40; i++) tide.push(i * 10, FLOOR - 36 + Math.sin(i * 0.9) * 2 + rnd(249, i) * 3);
    line(ctx, tide, rgba('#5a6058', 0.5), 1);
    for (let i = 0; i < 30; i++) smudge(ctx, rnd(252, i) * STAGE_W, 30 + rnd(253, i) * 120, 2 + rnd(254, i) * 4, '#ffffff', 0.4);
    floorboards(ctx, FLOOR, 220, 100, SILVER, 9, 249);
    // A low ceiling: tarred boards, the joists close, and a heavy beam over the bar.
    planks(ctx, 0, 0, STAGE_W, 18, TAR, 1, false, 249);
    for (let i = 0; i < 11; i++) { const jx = 6 + i * 40; fillPoly(ctx, [jx, 0, jx + 12, 0, jx + 11, 16, jx + 1, 16], shade(TAR, 0.8)); }
    beam(ctx, 0, 16, STAGE_W, 12, TAR, 255);
    // Left: the door stood open on the coach yard.
    const dx = 14, dy = 70, dw = 58;
    ctx.fillStyle = '#120c14'; ctx.fillRect(dx - 2, dy - 2, dw + 4, FLOOR - dy + 2);
    ctx.save(); ctx.beginPath(); ctx.rect(dx, dy, dw, FLOOR - dy); ctx.clip(); coachYard(ctx, s, dx, dy, dw, FLOOR - dy); ctx.restore();
    beam(ctx, dx - 6, dy - 8, dw + 12, 8, TAR, 256);
    for (const px of [dx - 6, dx + dw]) beam(ctx, px, dy, 6, FLOOR - dy, TAR, px);
    if (s.daylight > 0.15) pool(s, dx + dw / 2, FLOOR - 30, 110, '#c8d4dc', 0.45 * s.daylight);
    planks(ctx, dx + dw + 6, dy + 4, 16, FLOOR - dy - 4, TAR, 3, true, 257);
    // The stove, and the bench by it where the coach's passengers wait.
    stove(ctx, s, 108, FLOOR + 2, 30);
    // The tide table over the bar's end, and the window on the quay.
    tideTable(ctx, 130, 48, 82, 60, ['HIGH    LOW', '05:40  11:52', '18:05  00:17', '06:30  12:42', '18:55  01:07']);
    windowIn(ctx, s, 262, 44, 70, 58, '#5a5a56', { panes: [3, 2], view: quay(262, 44, 70, 58, s.daylight) });
    net(ctx, 236, 396, 32, 22);
    // The bar back: a shelf of bottles, kegs racked under it.
    shelf(ctx, 140, 126, 256, TAR);
    for (let i = 0; i < 15; i++) bottle(ctx, 150 + i * 16.5, 126, 14 + rnd(258, i) * 9, ['#3a5a4a', '#5a2a2a', '#2a3a5a', '#7a6a3a', '#3a4a3a'][i % 5], { squat: i % 4 === 2, label: i % 5 === 0 ? '#e0d8c0' : undefined });
    for (let i = 0; i < 5; i++) kegEnd(ctx, 170 + i * 50, 150, 14, '#6a5038', '#2a2a30', BRASS);
    // The long bar, end to end, tarred dark, a brass rail along its foot.
    counter(ctx, 128, STAGE_W, 168, 10, 236, '#3e3430', 259, { panels: 4 });
    line(ctx, [128, 228, STAGE_W, 228], '#120c14', 4); line(ctx, [128, 228, STAGE_W, 228], BRASS, 2);
    tankard(ctx, 160, 178, 14, '#8a8e96', { band: '#5a5e68', foam: true });
    tankard(ctx, 284, 178, 14, '#6a4a30', { band: '#2a1e18', foam: true, handleLeft: true });
    glossEllipse(ctx, K, 214, 176, 9, 3, '#d8d0c0', 0, {});
    for (let i = 0; i < 4; i++) glossPoly(ctx, K, [208 + i * 4, 175, 211 + i * 4, 172, 214 + i * 4, 175, 211 + i * 4, 177], '#a8b0a8', { gloss: 0.6 });
    cup(ctx, 330, 178, 10, '#7a6a5a');
    // The ship's lamp over the bar, in its gimbal.
    shipsLamp(ctx, s, 236, 50, 28);
    lantern(ctx, s, 360, 112, 9, '#3a3a40', 28, 120, '#ffe0a0');
    // The sailors' long table and benches in the foreground.
    contact(ctx, 70, 266, 150, 0.35);
    slab(ctx, -4, 238, 150, 8, '#4a3e36', { lit: 2, dark: 0.35 });
    fillPoly(ctx, [-4, 238, 10, 228, 132, 228, 146, 238], shade('#5a4c40', 1.15));
    for (let i = 1; i < 3; i++) line(ctx, [-4 + i * 4.6, 238 - i * 3.3, 146 - i * 4.6, 238 - i * 3.3], rgba('#2a2018', 0.35), 1);
    for (const lx of [8, 124]) slab(ctx, lx, 246, 8, STAGE_H - 246, '#3a3028', { lit: 1 });
    slab(ctx, -4, 256, 140, 6, '#4a3e36', { lit: 1, dark: 0.3 });
    tankard(ctx, 30, 236, 13, '#8a8e96', { band: '#5a5e68' }); tankard(ctx, 92, 234, 12, '#6a4a30', { band: '#2a1e18', handleLeft: true });
    plate(ctx, 62, 236, 10, '#9aa0a8', '#5a6068');
    for (let i = 0; i < 3; i++) glossEllipse(ctx, K, 58 + i * 5, 233, 3.5, 1.4, '#d0a060', 0, { gloss: 0.4 });
    // A clay pipe left by the plate.
    line(ctx, [74, 237, 86, 233], '#e8e0d0', 1.5); glossBall(ctx, K, 74, 236, 2, '#e8e0d0', {});
    stool(ctx, 176, 268, 28, '#5a4c40');
  },
};
