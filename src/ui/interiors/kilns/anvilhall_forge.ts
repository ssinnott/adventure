// Anvilhall's forge, where the smiths make the band's steel: rock left as the pick cut it, black
// with soot to the roof, the hearth under an iron hood that runs up into the rock, the verse cut
// red over it, the great bellows, the anvil with a bar at heat on it, the slack tub and the steel
// racked for sale. The fire is the room's light; a slot in the rock lets the day in.
import { shade, rgba } from '../../../lib/art/palettes.ts';
import type { Scene, Stage } from '../kit.ts';
import { STAGE_W, rnd, block, flagstones, line, smudge, fillPoly, path, ink, slab, pool, contact, beam } from '../kit.ts';
import { K, anvil, warhammer, staff, bow, mail, shield } from '../props.ts';
import { glossPoly, glossBall } from '../../monsters/gloss.ts';
import { ROCK, IRON, BRASS, hewn, verse, rockWindow, terraceView, hammerPick, mattock, seax } from './hold.ts';

const FLOOR = 204, OAK = '#4a3424', LEATHER = '#6a4028', BLACK_SHIELD = '#2a2226';
/** The hearth: its middle, its half-width and the top of its bed where the coals lie. */
const HX = 180, HW = 66, BED = 156;

/**
 * The hearth: a waist-high bed of dressed blocks, the coals banked in its trough and over it a
 * hood of riveted iron plate funnelling the smoke up into the rock. The fire on the coals is the
 * room's light.
 */
function hearth(ctx: CanvasRenderingContext2D, s: Stage): void {
  // The hood, wide over the bed and narrowing to where it goes into the rock.
  const hb = 112, ht = 64, hood = [HX - HW - 6, hb, HX + HW + 6, hb, HX + 26, ht, HX - 26, ht];
  // The dark under the hood and the soot it has laid on the rock round it.
  smudge(ctx, HX, ht, 70, '#0a0606', 0.6);
  fillPoly(ctx, [HX - HW, hb, HX + HW, hb, HX + HW, BED, HX - HW, BED], '#160c08');
  smudge(ctx, HX, BED - 6, HW * 1.1, '#ff6a20', 0.45);
  glossPoly(ctx, K, hood, shade(IRON, 1.1), { gloss: 0.35, spread: 0.7 });
  ctx.save(); path(ctx, hood); ctx.clip();
  // Plates and their rivets.
  for (let i = 1; i < 4; i++) { const y = ht + (hb - ht) * (i / 4); line(ctx, [HX - HW, y, HX + HW, y], rgba('#120c14', 0.6), 1); }
  for (let r = 0; r < 4; r++) for (let i = 0; i < 12; i++) { const y = ht + 3 + (hb - ht) * (r / 4), u = (i + 0.5) / 12, half = 26 + (HW + 6 - 26) * ((y - ht) / (hb - ht)); glossBall(ctx, K, HX - half + u * half * 2, y, 1.2, shade(IRON, 1.7), { gloss: 0.6 }); }
  const sh = ctx.createLinearGradient(HX - HW, 0, HX + HW, 0); sh.addColorStop(0, rgba('#ffffff', 0.08)); sh.addColorStop(0.7, rgba('#0a0608', 0)); sh.addColorStop(1, rgba('#0a0608', 0.4));
  ctx.fillStyle = sh; ctx.fillRect(HX - HW - 6, ht, HW * 2 + 12, hb - ht);
  // The fire's light on the hood's underside.
  const under = ctx.createLinearGradient(0, hb - 18, 0, hb); under.addColorStop(0, rgba('#ff8a3a', 0)); under.addColorStop(1, rgba('#ff8a3a', 0.45));
  ctx.fillStyle = under; ctx.fillRect(HX - HW - 6, hb - 18, HW * 2 + 12, 18);
  ctx.restore();
  slab(ctx, HX - HW - 9, hb - 3, HW * 2 + 18, 6, shade(IRON, 0.9), { lit: 1 });
  // Chains from the rock holding the hood up.
  for (const sd of [-1, 1]) { const x0 = HX + sd * (HW + 2); line(ctx, [x0, hb - 4, x0 + sd * 10, 56], '#120c14', 2.5); for (let k = 0; k < 9; k++) { const u = k / 9; ctx.fillStyle = shade(IRON, 1.5); ctx.fillRect(Math.round(x0 + sd * 10 * u) - 1, Math.round(hb - 4 - (hb - 60) * u), 2, 2); } }
  // The bed, block on block, and its trough of coals.
  for (let r = 0; r < 3; r++) for (let i = 0; i < 4; i++) block(ctx, HX - HW + i * (HW * 2) / 4 + (r % 2) * 6 - 3, BED + r * 16, HW / 2 - 1, 15, shade('#5a4c44', 0.85 + rnd(621, r, i) * 0.25), 620 + r * 4 + i);
  ctx.save(); ctx.beginPath(); ctx.rect(HX - HW - 4, BED, HW * 2 + 8, FLOOR - BED); ctx.clip(); ctx.restore();
  slab(ctx, HX - HW - 4, BED - 4, HW * 2 + 8, 6, shade('#5a4c44', 1.1), { lit: 1 });
  const coal = ctx.createLinearGradient(0, BED - 12, 0, BED);
  coal.addColorStop(0, '#ffe08a'); coal.addColorStop(0.5, '#ff7a2a'); coal.addColorStop(1, '#8a2410');
  ctx.beginPath(); ctx.ellipse(HX, BED - 3, HW * 0.8, 9, 0, Math.PI, Math.PI * 2); ctx.fillStyle = coal; ctx.fill();
  for (let i = 0; i < 16; i++) { ctx.fillStyle = rgba('#3a120a', 0.6); ctx.beginPath(); ctx.ellipse(HX - HW * 0.7 + rnd(622, i) * HW * 1.4, BED - 3 - rnd(623, i) * 6, 2.4, 1.4, 0, 0, Math.PI * 2); ctx.fill(); }
  s.lights.push({ k: 'fire', x: HX, y: BED - 5, w: HW * 1.2, h: 36 });
  s.lights.push({ k: 'motes', x: HX - HW * 0.6, y: hb + 4, w: HW * 1.2, h: BED - hb - 14, color: '#ffc060', n: 12, rise: 0.7 });
  pool(s, HX, BED - 20, 280, '#ff8a3a', 1);
  pool(s, HX, BED - 10, 120, '#ffc070', 0.8);
}

/**
 * The great bellows beside the hearth, foot on y: two boards shaped like a pear with the leather
 * pleated between them, lying on a trestle with the nozzle in the hearth's side, worked by a pole
 * on a post with a chain down to the upper board's tail.
 */
function bellows(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  const mid = y - w * 0.66, nose = x + w * 0.64, tail = x - w * 0.6;
  for (const lx of [x - w * 0.36, x + w * 0.26]) { line(ctx, [lx - 6, y, lx, mid + 8, lx + 6, y], '#120c14', 4.5); line(ctx, [lx - 6, y, lx, mid + 8, lx + 6, y], OAK, 2.8); }
  // A board seen from a little above: round at the tail, drawing in to the neck.
  const board = (dy: number, k: number): number[] => {
    const pts: number[] = [], cx = tail + w * 0.34, rx = w * 0.34, ry = w * 0.15 * k;
    for (let i = 0; i <= 20; i++) { const a = Math.PI * 0.3 + (i / 20) * Math.PI * 1.4; pts.push(cx + Math.cos(a) * rx, mid + dy + Math.sin(a) * ry); }
    pts.push(nose - w * 0.1, mid + dy - ry * 0.18, nose - w * 0.1, mid + dy + ry * 0.18);
    return pts;
  };
  // The bottom board, the leather standing up from it in folds, then the top board over all.
  glossPoly(ctx, K, board(w * 0.1, 1), shade(OAK, 0.8), { gloss: 0.1 });
  const bag = board(w * 0.05, 0.96);
  glossPoly(ctx, K, bag, LEATHER, { gloss: 0.15, spread: 0.7 });
  ctx.save(); path(ctx, bag); ctx.clip();
  for (let i = 0; i < 14; i++) { const u = i / 13, bx = tail + (nose - tail) * u * 0.92; line(ctx, [bx, mid - w * 0.2, bx + 2, mid + w * 0.3], rgba('#2a1610', 0.55), 1); line(ctx, [bx + 1.5, mid - w * 0.2, bx + 3.5, mid + w * 0.3], rgba('#c8946a', 0.3), 1); }
  ctx.restore();
  const top = board(-w * 0.03, 0.92);
  glossPoly(ctx, K, top, shade(OAK, 1.25), { gloss: 0.25, spread: 0.7 });
  ctx.save(); path(ctx, top); ctx.clip();
  for (let i = 0; i < 4; i++) line(ctx, [tail, mid - w * 0.09 + i * w * 0.05, nose, mid - w * 0.04 + i * w * 0.02], rgba(shade(OAK, 0.6), 0.5), 1);
  ctx.restore();
  // The nozzle of iron, into the hearth's side.
  glossPoly(ctx, K, [nose - w * 0.12, mid - 5, nose + w * 0.22, mid - 2, nose + w * 0.22, mid + 2, nose - w * 0.12, mid + 4], shade(IRON, 1.2), { gloss: 0.5 });
  // The post and its pole, the chain from the pole's end to the board's tail, a rope to work it by.
  const px = x - w * 0.02, pt = mid - w * 0.9, ex = tail + w * 0.1;
  beam(ctx, px - 3, pt, 6, y - pt, OAK, 625);
  line(ctx, [ex - 6, pt + 6, x + w * 0.56, pt - 10], '#120c14', 6); line(ctx, [ex - 6, pt + 6, x + w * 0.56, pt - 10], shade(OAK, 1.15), 4);
  glossBall(ctx, K, px, pt - 1, 3, IRON, { gloss: 0.5 });
  line(ctx, [ex, pt + 6, ex, mid - w * 0.19], '#120c14', 2);
  for (let cy = pt + 8; cy < mid - w * 0.19; cy += 4) { ctx.fillStyle = shade(IRON, 1.5); ctx.fillRect(Math.round(ex) - 1, Math.round(cy), 2, 2); }
  line(ctx, [x + w * 0.56, pt - 10, x + w * 0.58, pt + 30], '#c8b080', 1.5);
  glossBall(ctx, K, x + w * 0.58, pt + 32, 2.5, OAK, {});
}

/** The slack tub: half a cask of black water by the hearth, holding the fire's colour; a pair of tongs left across it. Foot on y. */
function slackTub(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number): void {
  contact(ctx, x, y, w * 1.15, 0.5);
  const top = y - h, rim = h * 0.22;
  glossPoly(ctx, K, [x - w * 0.5, top, x - w * 0.44, y, x + w * 0.44, y, x + w * 0.5, top], '#5a3e2a', { gloss: 0.15, spread: 0.8 });
  for (let i = 1; i < 6; i++) { const u = i / 6 - 0.5; line(ctx, [x + u * w, top + 2, x + u * w * 0.88, y - 1], rgba('#2a1a10', 0.5), 1); }
  for (const f of [0.25, 0.75]) { const yy = top + h * f, half = w * (0.5 - f * 0.06); ctx.fillStyle = IRON; ctx.fillRect(Math.round(x - half), Math.round(yy - 1.5), Math.round(half * 2), 3); }
  ctx.beginPath(); ctx.ellipse(x, top, w * 0.5, rim, 0, 0, Math.PI * 2); ctx.fillStyle = '#4a3222'; ctx.fill(); ink(ctx);
  ctx.beginPath(); ctx.ellipse(x, top + 1, w * 0.44, rim * 0.72, 0, 0, Math.PI * 2); ctx.fillStyle = '#121014'; ctx.fill();
  for (let i = 0; i < 3; i++) line(ctx, [x - w * 0.28 + i * w * 0.16, top + 1 + (i % 2), x - w * 0.18 + i * w * 0.16, top + 1 + (i % 2)], rgba('#ff9a48', 0.75), 1);
  for (const sd of [-1, 1]) { line(ctx, [x - w * 0.62, top - 4 + sd, x + w * 0.4, top + 2 + sd * 2], '#120c14', 3); line(ctx, [x - w * 0.62, top - 4 + sd, x + w * 0.4, top + 2 + sd * 2], shade(IRON, 1.4), 1.2); }
}

/** Tongs hung on the hood's edge, their jaws at y. */
function tongs(ctx: CanvasRenderingContext2D, x: number, top: number, y: number): void {
  glossBall(ctx, K, x, top + 2, 1.8, IRON, {});
  for (const sd of [-1, 1]) { line(ctx, [x, top + 2, x + sd * 2.5, y - 6, x + sd * 1, y], '#120c14', 2.6); line(ctx, [x, top + 2, x + sd * 2.5, y - 6, x + sd * 1, y], shade(IRON, 1.5), 1.2); }
}

/** A dwarf's helm on the shelf, sat on y: a ribbed crown drawn up to a point, a brass brow band, a nasal and cheek guards. */
function helm(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, metal: string): void {
  for (const sd of [-1, 1]) glossPoly(ctx, K, [x + sd * w * 0.46, y - w * 0.4, x + sd * w * 0.5, y, x + sd * w * 0.28, y, x + sd * w * 0.3, y - w * 0.34], shade(metal, 0.85), { gloss: 0.4 });
  glossPoly(ctx, K, [x - w * 0.5, y - w * 0.36, x - w * 0.4, y - w * 0.74, x, y - w * 1.08, x + w * 0.4, y - w * 0.74, x + w * 0.5, y - w * 0.36], metal, { gloss: 0.7, spread: 0.6 });
  for (const f of [-0.22, 0, 0.22]) line(ctx, [x + f * w * 1.6, y - w * 0.42, x + f * w * 0.3, y - w * 1.0], rgba(shade(metal, 0.55), 0.8), 1);
  slab(ctx, x - w * 0.52, y - w * 0.44, w * 1.04, w * 0.12, BRASS, { lit: 1 });
  glossPoly(ctx, K, [x - w * 0.06, y - w * 0.4, x + w * 0.06, y - w * 0.4, x + w * 0.04, y - w * 0.06, x - w * 0.04, y - w * 0.06], shade(metal, 0.9), { gloss: 0.5 });
}

/** Bar iron stacked against the rock, the bars' feet on y, a basket of charcoal before them. */
function stock(ctx: CanvasRenderingContext2D, x: number, y: number): void {
  for (let i = 0; i < 7; i++) { const bx = x + i * 4, lean = 10 + i * 1.5; line(ctx, [bx, y, bx + lean, y - 56 - (i % 3) * 4], '#120c14', 3.5); line(ctx, [bx, y, bx + lean, y - 56 - (i % 3) * 4], shade(IRON, 1.2 + (i % 2) * 0.2), 2); }
  const cx = x + 30, top = y - 26;
  contact(ctx, cx, y + 8, 46, 0.5);
  glossPoly(ctx, K, [cx - 22, top, cx - 18, y + 8, cx + 18, y + 8, cx + 22, top], '#7a5a34', { gloss: 0.1, h: 60, tex: 'bristle', seed: 641, amount: 0.5 });
  for (let i = 0; i < 4; i++) line(ctx, [cx - 21 + i * 0.6, top + 6 + i * 7, cx + 21 - i * 0.6, top + 6 + i * 7], rgba('#3a2a14', 0.6), 1);
  for (let i = 0; i < 14; i++) glossBall(ctx, K, cx - 16 + rnd(642, i) * 32, top - 2 - rnd(643, i) * 5, 2.8, '#1e1a1e', { gloss: 0.3 });
}

/** A bar of iron at heat on the anvil's face, white at its middle; it glows. */
function heatBar(ctx: CanvasRenderingContext2D, s: Stage, x0: number, x1: number, y: number): void {
  const g = ctx.createLinearGradient(x0, 0, x1, 0);
  g.addColorStop(0, '#5a2a20'); g.addColorStop(0.3, '#ff6a20'); g.addColorStop(0.6, '#fff0b0'); g.addColorStop(1, '#ff8a30');
  ctx.fillStyle = '#120c14'; ctx.fillRect(x0 - 1, y - 3, x1 - x0 + 2, 5);
  ctx.fillStyle = g; ctx.fillRect(x0, y - 2, x1 - x0, 3);
  s.lights.push({ k: 'glow', x: (x0 + x1) / 2 + 4, y: y - 1, r: 16, color: '#ffb060', a: 0.5 });
  pool(s, (x0 + x1) / 2, y - 4, 70, '#ff9a48', 0.55);
}

export const FORGE: Scene = {
  ambient: ['#221a1a', '#4c4442'],
  paint(ctx: CanvasRenderingContext2D, s: Stage): void {
    hewn(ctx, 0, 0, STAGE_W, FLOOR, 631, shade(ROCK, 0.9));
    // Soot up the rock from three hundred years of the fire.
    const soot = ctx.createLinearGradient(0, 0, 0, FLOOR);
    soot.addColorStop(0, rgba('#0a0606', 0.75)); soot.addColorStop(0.45, rgba('#0a0606', 0.25)); soot.addColorStop(1, rgba('#0a0606', 0.1));
    ctx.fillStyle = soot; ctx.fillRect(0, 0, STAGE_W, FLOOR);
    flagstones(ctx, FLOOR, 200, 110, '#5a5048', 7, 632);
    // Scale knocked off the iron lies black on the floor about the anvil.
    for (let i = 0; i < 60; i++) { ctx.fillStyle = rgba('#141014', 0.7); ctx.fillRect(Math.round(200 + (rnd(633, i) - 0.3) * 200), Math.round(214 + rnd(634, i) * 50), 2, 1); }
    // The verse, cut big over the hearth and painted red.
    verse(ctx, ['THE FIRE IS KEPT BELOW', 'AND NOT ABOVE'], HX, 14, 2, shade(ROCK, 0.7));
    pool(s, HX, 34, 150, '#ff9a50', 0.6);
    rockWindow(ctx, s, 344, 26, 30, 30, terraceView(344, 26, 30, 30, s.daylight, 7), { bars: 2, splay: 8 });
    hearth(ctx, s);
    tongs(ctx, HX + HW - 2, 112, 146); tongs(ctx, HX + HW - 12, 112, 140);
    bellows(ctx, 58, FLOOR - 4, 76);
    // The steel for sale on the right: helms on the shelf; the mattock, the forge hammer, the banded
    // staff and the seax in their rack under it; the steel bow hung by them, the mail on its peg and
    // the forge shield on the rock with the hold's mark on it.
    beam(ctx, 268, 92, 128, 5, OAK, 635);
    for (let i = 0; i < 4; i++) helm(ctx, 284 + i * 28, 92, 18, i % 2 ? '#8a929e' : '#a2aab6');
    beam(ctx, 268, 192, 80, 6, OAK, 636);
    mattock(ctx, 280, 196, 82);
    warhammer(ctx, 300, 196, 78);
    staff(ctx, 318, 196, 96, '#6a4a2e');
    for (const f of [0.3, 0.5, 0.7]) slab(ctx, 315.5, 196 - 96 * f, 5, 3, IRON, { lit: 1, outline: false });
    seax(ctx, 333, 196, 54);
    glossBall(ctx, K, 364, 104, 1.6, IRON, {});
    bow(ctx, 364, 196, 90, '#9aa2ae', true);
    mail(ctx, 385, 104, 40, '#8a929e');
    shield(ctx, 382, 178, 14, BLACK_SHIELD, 'round');
    hammerPick(ctx, 382, 178, 12);
    // The anvil before the hearth with a bar at heat on it; the slack tub at the left; bar iron and
    // charcoal waiting at the right.
    anvil(ctx, 224, 254, 76);
    heatBar(ctx, s, 210, 244, 203);
    slackTub(ctx, 96, 258, 70, 36);
    stock(ctx, 322, 254);
  },
};

