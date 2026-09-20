// The bandit family: bandit, bandit archer, brigand and brigand archer, four human outlaws on one
// painted humanoid frame. Layout (units of h, y the ground line, x the centre): the figure stands
// three-quarter on with the near shoulder at the right, the weight on the left leg and the right
// leg relaxed out to the side, the head turned a little toward the viewer. Painted as materials,
// not parts: the far arm as its own dark mass behind, the trousers as two bending tubes, the boots,
// then the biggest garment in the def's tint as ONE blob (body and near sleeve, with a hood or a
// cloak where the kind has one) with folds, then the leather or steel over it as its own blob, the
// skin (head, neck, near hand) as one blob, hair and beard as spiky curves, and the crisp gear
// (sword, buckler, bow, shield, helm, crossbow) on top with the gloss helpers where it is metal.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, eye, groundShadow, stroke } from './common.ts';
import { blob, glossBall, glossEllipse, glossPoly, softLine } from './gloss.ts';
import type { Crease, Part } from './gloss.ts';
import { mix, shade } from '../../lib/art/palettes.ts';
import { band, celBall } from '../../lib/art/shading.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['bandit', 'archer', 'brigand', 'brigand_archer'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  if (kind === 'archer') archer(ctx, x, y, h, p);
  else if (kind === 'brigand') brigand(ctx, x, y, h, p);
  else if (kind === 'brigand_archer') brigandArcher(ctx, x, y, h, p);
  else bandit(ctx, x, y, h, p);
};

// ------------------------------------------------------------------ the frame ----

interface Pt { x: number; y: number }
/** Shoulder, elbow, hand. */
type Arm = [Pt, Pt, Pt];

/** The key points of the standing figure, computed once per draw. */
interface Rig {
  x: number; y: number; h: number; tone: number;
  /** Shoulder line (rises with the breath). */
  sy: number;
  /** Head centre and radius. */
  hx: number; hy: number; hr: number;
  /** Hip, knee, ankle of each leg. */
  legL: [Pt, Pt, Pt]; legR: [Pt, Pt, Pt];
  /** Fixed material colours, already toned. */
  skin: string; skinFar: string; hair: string; leather: string; strap: string; boot: string; steel: string; wood: string; bone: string; brass: string;
}

function makeRig(x: number, y: number, h: number, p: Paint): Rig {
  const lift = p.breathe * h * 0.007;
  const P = (u: number, v: number): Pt => ({ x: x + u * h, y: y + v * h });
  const sy = y - h * 0.7 - lift;
  const t = p.tone;
  return {
    x, y, h, tone: t, sy,
    hx: x + h * 0.012, hy: sy - h * 0.165 - lift * 0.4, hr: h * 0.095,
    legL: [P(-0.065, -0.5), P(-0.085, -0.28), P(-0.1, -0.1)],
    legR: [P(0.07, -0.5), P(0.13, -0.29), P(0.155, -0.1)],
    skin: shade('#c89a78', t), skinFar: shade('#8e6a50', t), hair: shade('#2e2018', t),
    leather: shade('#6a4226', t), strap: shade('#3a2416', t), boot: shade('#35261c', t),
    steel: shade('#a8aeb8', t), wood: shade('#6a4626', t), bone: shade('#e8dcc0', t), brass: shade('#c9a34a', t),
  };
}

/** Stable 0..1 noise for the tube wobble (the same mix as gloss.ts uses, kept local). */
function rnd(a: number, b: number, c: number): number {
  let h = (Math.imul(a | 0, 374761393) + Math.imul(b | 0, 668265263) + Math.imul(c | 0, 1274126177)) | 0;
  h = Math.imul(h ^ (h >>> 13), 1274126177);
  h = Math.imul(h ^ (h >>> 16), 0x85ebca6b);
  h ^= h >>> 13;
  return (h >>> 0) / 4294967296;
}

/**
 * A bending tapered tube along a spine, as a smooth closed curve part. Local stand-in for the
 * toolkit's 'tube' (its end caps are swept from the wrong side, which leaves a half-disc notch at
 * each end under nonzero filling); this one walks left side, end cap, right side, start cap.
 */
function tube(pts: readonly number[], r0: number, r1: number, wobble = 0, seed = 0): Part {
  const n = pts.length / 2;
  const P = (i: number, c: 0 | 1) => pts[Math.max(0, Math.min(n - 1, i)) * 2 + c];
  const spine: number[] = [];
  const S = 4;
  for (let i = 0; i < n - 1; i++) for (let s = 0; s < S; s++) {
    const t = s / S, t2 = t * t, t3 = t2 * t;
    for (const c of [0, 1] as const) {
      const p0 = P(i - 1, c), p1 = P(i, c), p2 = P(i + 1, c), p3 = P(i + 2, c);
      spine.push(0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3));
    }
  }
  spine.push(P(n - 1, 0), P(n - 1, 1));
  const m = spine.length / 2, left: number[] = [], right: number[] = [];
  for (let i = 0; i < m; i++) {
    const ax = spine[Math.max(0, i - 1) * 2], ay = spine[Math.max(0, i - 1) * 2 + 1], bx = spine[Math.min(m - 1, i + 1) * 2], by = spine[Math.min(m - 1, i + 1) * 2 + 1];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
    const r = (r0 + (r1 - r0) * (i / (m - 1))) * (1 + (wobble ? (rnd(seed, i, 1) - 0.5) * 2 * wobble : 0));
    left.push(spine[i * 2] + nx * r, spine[i * 2 + 1] + ny * r);
    right.push(spine[i * 2] - nx * r, spine[i * 2 + 1] - ny * r);
  }
  const out: number[] = [...left];
  const ex = spine[(m - 1) * 2], ey = spine[(m - 1) * 2 + 1], ea = Math.atan2(ey - spine[(m - 2) * 2 + 1], ex - spine[(m - 2) * 2]);
  for (let k = 1; k < 5; k++) { const a = ea + Math.PI / 2 - (k / 5) * Math.PI; out.push(ex + Math.cos(a) * r1, ey + Math.sin(a) * r1); }
  for (let i = m - 1; i >= 0; i--) out.push(right[i * 2], right[i * 2 + 1]);
  const sx = spine[0], sy = spine[1], sa = Math.atan2(spine[3] - sy, spine[2] - sx);
  for (let k = 1; k < 5; k++) { const a = sa - Math.PI / 2 - (k / 5) * Math.PI; out.push(sx + Math.cos(a) * r0, sy + Math.sin(a) * r0); }
  return { k: 'curve', pts: out, wobble: 0, sub: 1 };
}

/** A lumpy ring of n points: a fist, a pouch, a knot. */
function ring(cx: number, cy: number, rx: number, ry: number, n = 8): number[] {
  const o: number[] = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; o.push(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); }
  return o;
}

/** A head: a ring that narrows toward the jaw, so it is an egg, not a ball. */
function headRing(cx: number, cy: number, r: number): number[] {
  const o: number[] = [];
  const n = 12;
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, s = Math.sin(a);
    const rx = r * (0.92 - 0.14 * Math.max(0, s)), ry = r * (1 + 0.04 * Math.max(0, s));
    o.push(cx + Math.cos(a) * rx, cy + s * ry);
  }
  return o;
}

/** Spine of an arm for a tube part. */
const armPts = (a: Arm): number[] => [a[0].x, a[0].y, a[1].x, a[1].y, a[2].x, a[2].y];
const legPts = (l: [Pt, Pt, Pt]): number[] => [l[0].x, l[0].y, l[1].x, l[1].y, l[2].x, l[2].y];

/** A boot around an ankle: a flared lump with a toe turned outward on the relaxed side. */
function bootPart(R: Rig, ankle: Pt, out: number, seed: number): Part {
  const { h } = R, ax = ankle.x, y = R.y;
  const t = out * h * 0.02;
  return { k: 'curve', pts: [ax - h * 0.055, y - h * 0.17, ax + h * 0.055, y - h * 0.17, ax + h * 0.065, y - h * 0.07, ax + h * 0.085 + Math.max(0, t), y - h * 0.015, ax + h * 0.075 + Math.max(0, t), y, ax - h * 0.075 + Math.min(0, t), y, ax - h * 0.085 + Math.min(0, t), y - h * 0.015, ax - h * 0.065, y - h * 0.07], wobble: 0.04, seed, sub: 2 };
}

/** The far arm: its own darker mass behind the body, sleeve and fist. */
function farArm(ctx: CanvasRenderingContext2D, R: Rig, sleeve: string, arm: Arm, hand = true): void {
  const { h } = R;
  blob(ctx, B, sleeve, [tube(armPts(arm), h * 0.052, h * 0.04, 0.03, 31)], { h, formK: 0.4 });
  if (hand) fist(ctx, R, arm[2], 32, true);
}

/** Trousers as two bending tubes, one mass, then the boots as their own material. */
function legs(ctx: CanvasRenderingContext2D, R: Rig, trouser: string, seed: number, greave?: string): void {
  const { h, x, y } = R;
  const creases: Crease[] = [
    { x0: x, y0: y - h * 0.47, x1: x + h * 0.005, y1: y - h * 0.38, r: h * 0.03, a: 0.35 },
    { x0: R.legR[1].x - h * 0.02, y0: R.legR[1].y - h * 0.01, x1: R.legR[1].x + h * 0.03, y1: R.legR[1].y + h * 0.01, r: h * 0.02, a: 0.2 },
  ];
  blob(ctx, B, trouser, [tube(legPts(R.legL), h * 0.072, h * 0.052, 0.04, seed), tube(legPts(R.legR), h * 0.072, h * 0.052, 0.04, seed + 1)], { h, formK: 0.55, tex: 'folds', seed, amount: 0.5, creases });
  // Greaves: steel plates strapped over the shins, under the boot tops.
  if (greave) blob(ctx, B, greave, [
    { k: 'cap', x0: R.legL[1].x, y0: R.legL[1].y + h * 0.03, x1: R.legL[2].x, y1: R.legL[2].y - h * 0.04, r0: h * 0.05, r1: h * 0.042 },
    { k: 'cap', x0: R.legR[1].x + h * 0.005, y0: R.legR[1].y + h * 0.03, x1: R.legR[2].x, y1: R.legR[2].y - h * 0.04, r0: h * 0.05, r1: h * 0.042 },
  ], { h, formK: 0.6, gloss: 0.3, spread: 0.6 });
  blob(ctx, B, R.boot, [bootPart(R, R.legL[2], -0.4, seed + 2), bootPart(R, R.legR[2], 1, seed + 3)], { h, formK: 0.5, spread: 0.7 });
}

/** The torso of the biggest garment as a lumpy closed curve; hemY is where it ends over the trousers. */
function torsoPts(R: Rig, hemY: number, collar = 0.03): number[] {
  const { x, sy, h } = R;
  return [x - h * 0.2, sy + h * 0.01, x - h * 0.07, sy - h * collar, x + h * 0.08, sy - h * collar, x + h * 0.215, sy + h * 0.012,
    x + h * 0.195, sy + h * 0.15, x + h * 0.165, hemY, x - h * 0.14, hemY, x - h * 0.185, sy + h * 0.15];
}

/** Near sleeve as a tube part. */
const sleeve = (R: Rig, arm: Arm, seed: number): Part => tube(armPts(arm), R.h * 0.058, R.h * 0.044, 0.03, seed);

/** Armpit and waist creases of a tunic. */
function torsoCreases(R: Rig, hemY: number): Crease[] {
  const { x, sy, h } = R;
  return [
    { x0: x + h * 0.16, y0: sy + h * 0.06, x1: x + h * 0.15, y1: sy + h * 0.14, r: h * 0.025, a: 0.3 },
    { x0: x - h * 0.16, y0: sy + h * 0.05, x1: x - h * 0.15, y1: sy + h * 0.13, r: h * 0.022, a: 0.25 },
    { x0: x - h * 0.1, y0: hemY - h * 0.04, x1: x + h * 0.12, y1: hemY - h * 0.045, r: h * 0.02, a: 0.2 },
  ];
}

/** Skin: the head and neck as one mass, painted before the garments so the collar covers the neck base. */
function headNeck(ctx: CanvasRenderingContext2D, R: Rig): void {
  const { hx, hy, hr, h } = R;
  blob(ctx, B, R.skin, [
    { k: 'curve', pts: headRing(hx, hy, hr), wobble: 0.035, seed: 41, sub: 2 },
    { k: 'cap', x0: hx - h * 0.003, y0: hy + hr * 0.7, x1: hx - h * 0.006, y1: R.sy + h * 0.03, r0: hr * 0.42, r1: hr * 0.46 },
  ], { h, formK: 0.55, spread: 0.8, creases: [
    { x0: hx - hr * 0.5, y0: hy + hr * 0.9, x1: hx + hr * 0.45, y1: hy + hr * 0.92, r: hr * 0.14, a: 0.35 },
  ] });
}

/** A fist: a lumpy ring of skin over whatever it grips. */
function fist(ctx: CanvasRenderingContext2D, R: Rig, at: Pt, seed: number, far = false): void {
  const { h } = R;
  blob(ctx, B, far ? R.skinFar : R.skin, [{ k: 'curve', pts: ring(at.x, at.y, h * 0.042, h * 0.038), wobble: 0.07, seed, sub: 2 }], { h, formK: 0.5, spread: 0.7 });
}

/** Eyes under a scowl, a nose and (unless masked) a hard mouth. */
function face(ctx: CanvasRenderingContext2D, R: Rig, masked: boolean, scar = false): void {
  const { hx, hy, hr } = R;
  const er = hr * 0.19;
  const ex0 = hx - hr * 0.36, ex1 = hx + hr * 0.42, ey = hy - hr * 0.08;
  eye(ctx, ex0, ey, er, R.bone); eye(ctx, ex1, ey, er, R.bone);
  const bw = Math.max(1, hr * 0.17);
  softLine(ctx, B, [ex0 - er * 1.6, ey - er * 2.1, ex0 + er * 1.2, ey - er * 1.1], R.hair, bw, 0.85);
  softLine(ctx, B, [ex1 + er * 1.6, ey - er * 2.1, ex1 - er * 1.2, ey - er * 1.1], R.hair, bw, 0.85);
  softLine(ctx, B, [hx + hr * 0.06, hy - hr * 0.05, hx + hr * 0.14, hy + hr * 0.3], R.skin, Math.max(1, hr * 0.1), 0.4);
  if (!masked) softLine(ctx, B, [hx - hr * 0.32, hy + hr * 0.56, hx + hr * 0.02, hy + hr * 0.5, hx + hr * 0.36, hy + hr * 0.58], R.skin, Math.max(1, hr * 0.12), 0.75);
  if (scar && hr >= 6) stroke(ctx, [hx + hr * 0.75, hy - hr * 0.55, hx + hr * 0.45, hy + hr * 0.5], shade('#a05a50', R.tone), 1);
}

/** A crisp blade from the grip to the tip, steel with a gloss, then a crossguard and a wrapped grip. */
function blade(ctx: CanvasRenderingContext2D, R: Rig, gx: number, gy: number, tx: number, ty: number, w: number, guard: number): void {
  const dx = tx - gx, dy = ty - gy, len = Math.hypot(dx, dy) || 1, ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  const bx = gx + ux * R.h * 0.05, by = gy + uy * R.h * 0.05;
  glossPoly(ctx, B, [bx + nx * w, by + ny * w, tx - ux * w * 0.5 + nx * w * 0.9, ty - uy * w * 0.5 + ny * w * 0.9, tx, ty, tx - ux * w * 0.5 - nx * w * 0.9, ty - uy * w * 0.5 - ny * w * 0.9, bx - nx * w, by - ny * w], R.steel, { gloss: 0.55, spread: 0.6 });
  // Fuller: a soft line down the middle.
  if (len > 20) softLine(ctx, B, [bx + ux * w, by + uy * w, tx - ux * len * 0.25, ty - uy * len * 0.25], R.steel, 1, 0.35);
  glossPoly(ctx, B, [bx + nx * guard, by + ny * guard, bx + nx * guard + ux * w * 0.9, by + ny * guard + uy * w * 0.9, bx - nx * guard + ux * w * 0.9, by - ny * guard + uy * w * 0.9, bx - nx * guard, by - ny * guard], R.brass, { spread: 0.6 });
  blob(ctx, B, R.strap, [{ k: 'cap', x0: gx - ux * R.h * 0.01, y0: gy - uy * R.h * 0.01, x1: bx, y1: by, r0: w * 0.75 }], { h: R.h, form: false });
}

/** A short bow held in the hand at (hx, hy), tilted, with its string and a nocked arrow pointing out. */
function bow(ctx: CanvasRenderingContext2D, R: Rig, hand: Pt, sway: number): void {
  const { h } = R;
  const top = { x: hand.x + h * 0.1, y: hand.y - h * 0.36 }, bot = { x: hand.x - h * 0.06, y: hand.y + h * 0.34 };
  const cx = hand.x - h * 0.12, cy = hand.y - h * 0.01;
  const lw = Math.max(1.5, h * 0.024);
  // Limbs: dark ink under, wood over, a pale line along the lit edge.
  const limbs = () => { ctx.beginPath(); ctx.moveTo(top.x, top.y); ctx.quadraticCurveTo(cx, cy, bot.x, bot.y); };
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  limbs(); ctx.strokeStyle = B.col(B.outline); ctx.lineWidth = lw + 2; ctx.stroke();
  limbs(); ctx.strokeStyle = B.col(R.wood); ctx.lineWidth = lw; ctx.stroke();
  if (!B.override && lw >= 2.5) { limbs(); ctx.strokeStyle = shade(R.wood, 1.35); ctx.lineWidth = 1; ctx.stroke(); }
  // String, and an arrow nocked on it pointing away from the body.
  stroke(ctx, [top.x, top.y, bot.x, bot.y], R.bone, 1);
  const mx = (top.x + bot.x) / 2 + sway, my = (top.y + bot.y) / 2;
  const ax = mx - h * 0.2, ay = my - h * 0.03;
  stroke(ctx, [mx, my, ax, ay], R.wood, Math.max(1, h * 0.014));
  // Fletching at the string, a steel head at the point.
  const fx = mx - h * 0.02, fy = my - h * 0.003;
  ctx.fillStyle = B.col(shade('#b04030', R.tone));
  ctx.beginPath(); ctx.moveTo(fx, fy); ctx.lineTo(fx - h * 0.035, fy - h * 0.03); ctx.lineTo(fx - h * 0.05, fy - h * 0.005); ctx.lineTo(fx - h * 0.035, fy + h * 0.02); ctx.closePath(); ctx.fill();
  ctx.fillStyle = B.col(R.steel);
  ctx.beginPath(); ctx.moveTo(ax - h * 0.03, ay - h * 0.005); ctx.lineTo(ax + h * 0.01, ay - h * 0.015); ctx.lineTo(ax + h * 0.01, ay + h * 0.012); ctx.closePath(); ctx.fill();
  // The bow hand grips the middle: a fist over the limbs.
  blob(ctx, B, R.skin, [{ k: 'curve', pts: ring(hand.x, hand.y, h * 0.04, h * 0.036), wobble: 0.07, seed: 52, sub: 2 }], { h, formK: 0.5 });
}

// ------------------------------------------------------------------ the kinds ----

/** The road thug: tunic in the tint, leather vest, rag bandana, scarf mask, short sword and buckler. */
function bandit(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p);
  const { sy, hx, hy, hr } = R;
  const sway = Math.sin(p.frame / 19) * h * 0.012;
  const near: Arm = [{ x: x + h * 0.19, y: sy + h * 0.01 }, { x: x + h * 0.285, y: sy + h * 0.15 }, { x: x + h * 0.27, y: sy + h * 0.28 }];
  const far: Arm = [{ x: x - h * 0.17, y: sy + h * 0.01 }, { x: x - h * 0.27, y: sy + h * 0.14 }, { x: x - h * 0.26, y: sy + h * 0.25 }];
  const hemY = y - h * 0.42;
  groundShadow(ctx, x + h * 0.02, y + 1, h * 0.7);
  farArm(ctx, R, p.dark, far);
  legs(ctx, R, shade('#5a4a3c', p.tone), 11);
  headNeck(ctx, R);
  // The tunic: body and near sleeve, one mass in the tint.
  blob(ctx, B, p.base, [{ k: 'curve', pts: torsoPts(R, hemY), wobble: 0.03, seed: 3, sub: 3 }, sleeve(R, near, 12)], { h, formK: 0.5, tex: 'folds', seed: 3, amount: 0.7, creases: torsoCreases(R, hemY) });
  // The leather vest: two panels open at the chest, one material, darker than the tunic so the tint reads.
  blob(ctx, B, shade('#4e2e1a', p.tone), [
    { k: 'curve', pts: [x - h * 0.19, sy + h * 0.02, x - h * 0.06, sy + h * 0.03, x - h * 0.04, sy + h * 0.12, x - h * 0.05, hemY - h * 0.03, x - h * 0.165, hemY - h * 0.02, x - h * 0.185, sy + h * 0.14], wobble: 0.03, seed: 5, sub: 2 },
    { k: 'curve', pts: [x + h * 0.06, sy + h * 0.03, x + h * 0.2, sy + h * 0.02, x + h * 0.195, sy + h * 0.14, x + h * 0.17, hemY - h * 0.02, x + h * 0.06, hemY - h * 0.03, x + h * 0.045, sy + h * 0.12], wobble: 0.03, seed: 6, sub: 2 },
  ], { h, formK: 0.6, spread: 0.7, tex: 'stipple', seed: 5, amount: 0.25 });
  // Belt with a buckle and a pouch at the near hip.
  blob(ctx, B, R.strap, [{ k: 'curve', pts: [x - h * 0.16, hemY - h * 0.05, x + h * 0.175, hemY - h * 0.05, x + h * 0.175, hemY - h * 0.005, x - h * 0.16, hemY - h * 0.005], wobble: 0.01, seed: 7, sub: 2 }], { h, form: false });
  band(ctx, B, x - h * 0.03, hemY - h * 0.055, h * 0.05, h * 0.05, R.brass);
  blob(ctx, B, R.leather, [{ k: 'curve', pts: ring(x + h * 0.12, hemY + h * 0.01, h * 0.045, h * 0.05), wobble: 0.08, seed: 8, sub: 2 }], { h, formK: 0.6, spread: 0.6 });
  // Sword in the near hand, the fist over the grip.
  blade(ctx, R, near[2].x, near[2].y, x + h * 0.37, y - h * 0.86, h * 0.017, h * 0.05);
  fist(ctx, R, near[2], 42);
  // Hair tufts at the far temple, the scarf over the lower face, the bandana over the crown with its tail.
  blob(ctx, B, R.hair, [{ k: 'curve', pts: [hx - hr * 1.0, hy - hr * 0.3, hx - hr * 0.7, hy - hr * 0.2, hx - hr * 0.75, hy + hr * 0.5, hx - hr * 1.15, hy + hr * 0.3], wobble: 0.06, spiky: 0.15, seed: 9, sub: 2 }], { h, form: false });
  blob(ctx, B, shade('#4a4854', p.tone), [{ k: 'curve', pts: [hx - hr * 0.98, hy + hr * 0.12, hx + hr * 0.98, hy + hr * 0.12, hx + hr * 0.92, hy + hr * 0.75, hx + hr * 0.45, hy + hr * 1.2, hx - hr * 0.4, hy + hr * 1.22, hx - hr * 0.9, hy + hr * 0.75], wobble: 0.05, spiky: 0.02, seed: 13, sub: 2 }], { h, formK: 0.6, spread: 0.7, tex: 'folds', seed: 13, amount: 0.4 });
  const red = shade('#8c3628', p.tone);
  blob(ctx, B, red, [
    { k: 'curve', pts: [hx - hr * 1.05, hy - hr * 0.15, hx - hr * 0.92, hy - hr * 0.7, hx - hr * 0.3, hy - hr * 1.07, hx + hr * 0.4, hy - hr * 1.06, hx + hr * 0.97, hy - hr * 0.68, hx + hr * 1.04, hy - hr * 0.18, hx + hr * 0.7, hy - hr * 0.42, hx, hy - hr * 0.5, hx - hr * 0.7, hy - hr * 0.42], wobble: 0.04, seed: 14, sub: 2 },
    { k: 'curve', pts: ring(hx - hr * 1.02, hy - hr * 0.25, hr * 0.22, hr * 0.2), wobble: 0.08, seed: 15, sub: 2 },
    { k: 'curve', pts: [hx - hr * 1.1, hy - hr * 0.35, hx - hr * 0.95, hy - hr * 0.1, hx - hr * 1.3 + sway, hy + hr * 0.3, hx - hr * 1.55 + sway * 2, hy + hr * 0.75, hx - hr * 1.7 + sway * 2, hy + hr * 0.6, hx - hr * 1.45 + sway, hy + hr * 0.1], wobble: 0.05, spiky: 0.06, seed: 16, sub: 2 },
  ], { h, formK: 0.5, spread: 0.7, tex: 'folds', seed: 14, amount: 0.4 });
  face(ctx, R, true);
  // The buckler over the far fist: wood with a steel rim and boss.
  const bx = x - h * 0.31, by = y - h * 0.49;
  glossBall(ctx, B, bx, by, h * 0.105, R.wood, { gloss: 0.1, spread: 0.7, h, tex: 'cracks', seed: 17, amount: 0.6 });
  ctx.strokeStyle = B.col(R.steel); ctx.lineWidth = Math.max(1, h * 0.014); ctx.beginPath(); ctx.arc(bx, by, h * 0.09, 0, Math.PI * 2); ctx.stroke();
  glossBall(ctx, B, bx, by, h * 0.035, R.steel, { gloss: 0.6 });
  void p.light;
}

/** The archer: hooded tunic in the tint with a feather, shortbow with a nocked arrow, quiver, dagger. */
function archer(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p);
  const { sy, hx, hy, hr } = R;
  const sway = Math.sin(p.frame / 23) * h * 0.006;
  const near: Arm = [{ x: x + h * 0.19, y: sy + h * 0.01 }, { x: x + h * 0.27, y: sy + h * 0.15 }, { x: x + h * 0.17, y: sy + h * 0.26 }];
  const far: Arm = [{ x: x - h * 0.17, y: sy + h * 0.01 }, { x: x - h * 0.28, y: sy + h * 0.1 }, { x: x - h * 0.33, y: sy + h * 0.15 }];
  const hemY = y - h * 0.4;
  groundShadow(ctx, x - h * 0.03, y + 1, h * 0.72);
  // Quiver over the near shoulder, behind the body: leather tube with fletched arrows above it.
  blob(ctx, B, R.leather, [{ k: 'cap', x0: x + h * 0.1, y0: sy + h * 0.12, x1: x + h * 0.24, y1: sy - h * 0.1, r0: h * 0.045, r1: h * 0.04 }], { h, formK: 0.5, spread: 0.7 });
  for (let i = 0; i < 3; i++) {
    const qx = x + h * (0.19 + i * 0.03), qy = sy - h * (0.09 + (i === 1 ? 0.03 : 0.01));
    stroke(ctx, [qx, qy, qx + h * 0.03, qy - h * 0.07], R.wood, 1);
    ctx.fillStyle = B.col(shade(i === 1 ? '#c8c0a0' : '#8a3a30', p.tone));
    ctx.beginPath(); ctx.moveTo(qx + h * 0.03, qy - h * 0.07); ctx.lineTo(qx + h * 0.01, qy - h * 0.08); ctx.lineTo(qx + h * 0.04, qy - h * 0.095); ctx.lineTo(qx + h * 0.045, qy - h * 0.065); ctx.closePath(); ctx.fill();
  }
  farArm(ctx, R, p.dark, far, false);
  legs(ctx, R, shade('#4a3a2c', p.tone), 21);
  // The hooded tunic: hood, body and near sleeve, one mass in the tint.
  const hood: Part = { k: 'curve', pts: [hx - hr * 1.35, hy + hr * 1.1, hx - hr * 1.4, hy - hr * 0.1, hx - hr * 1.05, hy - hr * 1.15, hx - hr * 0.2, hy - hr * 1.5, hx + hr * 0.7, hy - hr * 1.3, hx + hr * 1.3, hy - hr * 0.5, hx + hr * 1.35, hy + hr * 1.1], wobble: 0.035, seed: 22, sub: 3 };
  blob(ctx, B, p.base, [hood, { k: 'curve', pts: torsoPts(R, hemY, 0.0), wobble: 0.03, seed: 23, sub: 3 }, sleeve(R, near, 24)], { h, formK: 0.5, tex: 'folds', seed: 23, amount: 0.8, creases: [...torsoCreases(R, hemY),
    { x0: hx - hr * 1.15, y0: hy + hr * 0.9, x1: hx + hr * 1.15, y1: hy + hr * 0.95, r: hr * 0.2, a: 0.3 }] });
  // Inside the hood: shadow, then the face.
  blob(ctx, B, shade(p.dark, 0.55), [{ k: 'curve', pts: [hx - hr * 0.95, hy - hr * 0.85, hx + hr * 0.95, hy - hr * 0.8, hx + hr * 1.0, hy + hr * 0.3, hx + hr * 0.5, hy + hr * 1.05, hx - hr * 0.5, hy + hr * 1.05, hx - hr * 1.0, hy + hr * 0.3], wobble: 0.04, seed: 25, sub: 2 }], { h, form: false, outline: false });
  // Dagger at the near hip, hilt up, the near fist resting on it.
  blade(ctx, R, x + h * 0.16, y - h * 0.44, x + h * 0.23, y - h * 0.28, h * 0.012, h * 0.03);
  // Belt over the tunic.
  blob(ctx, B, R.strap, [{ k: 'curve', pts: [x - h * 0.15, hemY - h * 0.06, x + h * 0.17, hemY - h * 0.06, x + h * 0.17, hemY - h * 0.02, x - h * 0.15, hemY - h * 0.02], wobble: 0.01, seed: 26, sub: 2 }], { h, form: false });
  band(ctx, B, x - h * 0.02, hemY - h * 0.065, h * 0.04, h * 0.045, R.brass);
  // The face inside the hood is smaller than a bare head: only the front of it shows.
  const facePart: Part = { k: 'curve', pts: [hx - hr * 0.72, hy - hr * 0.62, hx + hr * 0.72, hy - hr * 0.6, hx + hr * 0.86, hy + hr * 0.2, hx + hr * 0.45, hy + hr * 0.95, hx - hr * 0.4, hy + hr * 0.95, hx - hr * 0.82, hy + hr * 0.2], wobble: 0.03, seed: 27, sub: 2 };
  blob(ctx, B, R.skin, [facePart], { h, formK: 0.55, spread: 0.7 });
  fist(ctx, R, near[2], 28);
  // A short beard under the jaw.
  blob(ctx, B, R.hair, [{ k: 'curve', pts: [hx - hr * 0.7, hy + hr * 0.45, hx - hr * 0.3, hy + hr * 0.62, hx + hr * 0.3, hy + hr * 0.62, hx + hr * 0.75, hy + hr * 0.42, hx + hr * 0.55, hy + hr * 1.05, hx, hy + hr * 1.2, hx - hr * 0.55, hy + hr * 1.05], wobble: 0.06, spiky: 0.1, seed: 29, sub: 2 }], { h, formK: 0.4 });
  face(ctx, R, true);
  // The feather in the hood, at the near side.
  const fx = hx + hr * 1.05, fy = hy - hr * 0.9;
  glossEllipse(ctx, B, fx + hr * 0.5, fy - hr * 0.55 + sway, hr * 0.75, hr * 0.2, shade('#d8d0a8', p.tone), -0.95, { spread: 0.6 });
  softLine(ctx, B, [fx, fy + hr * 0.05, fx + hr * 0.95, fy - hr * 1.1 + sway], R.wood, 1, 0.6);
  // The shortbow in the far hand.
  bow(ctx, R, far[2], sway);
  void p.light;
}

/** The veteran: cloak and tabard in the tint over a mail shirt, kettle helm, heater shield, longsword up, greaves. */
function brigand(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p);
  const { sy, hx, hy, hr } = R;
  const sway = Math.sin(p.frame / 21) * h * 0.008;
  const near: Arm = [{ x: x + h * 0.2, y: sy + h * 0.01 }, { x: x + h * 0.33, y: sy + h * 0.15 }, { x: x + h * 0.3, y: sy + h * 0.04 }];
  const far: Arm = [{ x: x - h * 0.18, y: sy + h * 0.01 }, { x: x - h * 0.28, y: sy + h * 0.13 }, { x: x - h * 0.28, y: sy + h * 0.24 }];
  const hemY = y - h * 0.4;
  const mail = shade('#7e8490', p.tone);
  groundShadow(ctx, x, y + 1, h * 0.78);
  // The cloak, behind everything, hanging from the shoulders to the knees.
  blob(ctx, B, p.dark, [{ k: 'curve', pts: [x - h * 0.19, sy - h * 0.005, x + h * 0.21, sy - h * 0.005, x + h * 0.29, sy + h * 0.2, x + h * 0.31 + sway, y - h * 0.22, x - h * 0.3 + sway, y - h * 0.2, x - h * 0.28, sy + h * 0.2], wobble: 0.035, spiky: 0.035, seed: 61, sub: 3 }], { h, formK: 0.4, tex: 'folds', seed: 61, amount: 1.2, creases: [
    { x0: x - h * 0.22, y0: sy + h * 0.15, x1: x - h * 0.24, y1: y - h * 0.3, r: h * 0.02, a: 0.3 },
    { x0: x + h * 0.24, y0: sy + h * 0.15, x1: x + h * 0.26, y1: y - h * 0.3, r: h * 0.02, a: 0.3 }] });
  farArm(ctx, R, shade(mail, 0.7), far, false);
  legs(ctx, R, shade('#3c3a38', p.tone), 31, shade(R.steel, 0.82));
  headNeck(ctx, R);
  // The mail shirt: body and near sleeve, one mass. The ring texture goes on the sleeve alone below
  // (the toolkit strokes one arc per ring over the whole mass, most of it under the tabard).
  blob(ctx, B, mail, [{ k: 'curve', pts: torsoPts(R, hemY + h * 0.02), wobble: 0.025, seed: 33, sub: 3 }, sleeve(R, near, 34)], { h, formK: 0.55, gloss: 0.15, creases: torsoCreases(R, hemY) });
  // The tabard in the tint over the chest, belted, hanging below the mail.
  blob(ctx, B, p.base, [{ k: 'curve', pts: [x - h * 0.135, sy + h * 0.005, x + h * 0.145, sy + h * 0.005, x + h * 0.14, hemY - h * 0.02, x + h * 0.12, y - h * 0.3, x - h * 0.11, y - h * 0.3, x - h * 0.13, hemY - h * 0.02], wobble: 0.03, seed: 35, sub: 3 }], { h, formK: 0.45, tex: 'folds', seed: 35, amount: 0.7 });
  blob(ctx, B, mail, [sleeve(R, near, 34)], { h, outline: false, form: false, tex: 'mail', seed: 33 });
  blob(ctx, B, R.strap, [{ k: 'curve', pts: [x - h * 0.16, hemY - h * 0.06, x + h * 0.17, hemY - h * 0.06, x + h * 0.17, hemY - h * 0.015, x - h * 0.16, hemY - h * 0.015], wobble: 0.01, seed: 36, sub: 2 }], { h, form: false });
  band(ctx, B, x - h * 0.02, hemY - h * 0.065, h * 0.045, h * 0.05, R.brass);
  // The longsword held up in the near hand.
  blade(ctx, R, near[2].x, near[2].y, x + h * 0.35, y - h * 1.01, h * 0.021, h * 0.07);
  fist(ctx, R, near[2], 42);
  // Beard under the helm.
  blob(ctx, B, shade('#4a3a2a', p.tone), [{ k: 'curve', pts: [hx - hr * 0.8, hy + hr * 0.3, hx - hr * 0.3, hy + hr * 0.55, hx + hr * 0.3, hy + hr * 0.55, hx + hr * 0.85, hy + hr * 0.3, hx + hr * 0.65, hy + hr * 1.1, hx, hy + hr * 1.35, hx - hr * 0.6, hy + hr * 1.1], wobble: 0.06, spiky: 0.12, seed: 37, sub: 2 }], { h, formK: 0.4 });
  face(ctx, R, true);
  // Kettle helm: dome and wide brim, one steel mass with a shadow under the brim.
  softLine(ctx, B, [hx - hr * 0.95, hy - hr * 0.45, hx + hr * 0.95, hy - hr * 0.45], R.skin, hr * 0.3, 0.5);
  blob(ctx, B, R.steel, [
    { k: 'ell', x: hx, y: hy - hr * 0.55, rx: hr * 1.45, ry: hr * 0.36 },
    { k: 'ell', x: hx, y: hy - hr * 0.9, rx: hr * 0.95, ry: hr * 0.72, gloss: 0.5 },
  ], { h, formK: 0.6, spread: 0.6 });
  celBall(ctx, B, hx, hy - hr * 1.6, hr * 0.12, R.steel, false);
  // The heater shield on the far arm: steel rim, painted field with a pale chevron.
  const cx = x - h * 0.32, cy = y - h * 0.55, sw = h * 0.13, sh = h * 0.2;
  const shieldPts = [cx - sw, cy - sh * 0.9, cx + sw, cy - sh * 0.9, cx + sw * 0.95, cy + sh * 0.15, cx + sw * 0.5, cy + sh * 0.75, cx, cy + sh, cx - sw * 0.5, cy + sh * 0.75, cx - sw * 0.95, cy + sh * 0.15];
  glossPoly(ctx, B, shieldPts, R.steel, { spread: 0.7 });
  const field = shade('#7a2c24', p.tone);
  ctx.save(); ctx.beginPath(); ctx.moveTo(shieldPts[0], shieldPts[1]); for (let i = 2; i < shieldPts.length; i += 2) ctx.lineTo(shieldPts[i], shieldPts[i + 1]); ctx.closePath(); ctx.clip();
  glossPoly(ctx, B, [cx - sw * 0.82, cy - sh * 0.72, cx + sw * 0.82, cy - sh * 0.72, cx + sw * 0.78, cy + sh * 0.1, cx, cy + sh * 0.8, cx - sw * 0.78, cy + sh * 0.1], field, { spread: 0.6, gloss: 0.12 });
  ctx.restore();
  ctx.fillStyle = B.col(R.bone);
  ctx.beginPath(); ctx.moveTo(cx - sw * 0.7, cy - sh * 0.5); ctx.lineTo(cx, cy + sh * 0.05); ctx.lineTo(cx + sw * 0.7, cy - sh * 0.5); ctx.lineTo(cx + sw * 0.7, cy - sh * 0.15); ctx.lineTo(cx, cy + sh * 0.4); ctx.lineTo(cx - sw * 0.7, cy - sh * 0.15); ctx.closePath(); ctx.fill();
  void p.light;
}

/** The brigand archer: tunic and short cloak in the tint, leather cap, one pauldron, bolts at the hip, crossbow at port arms. */
function brigandArcher(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p);
  const { sy, hx, hy, hr } = R;
  const sway = Math.sin(p.frame / 21) * h * 0.007;
  const near: Arm = [{ x: x + h * 0.2, y: sy + h * 0.01 }, { x: x + h * 0.28, y: sy + h * 0.16 }, { x: x + h * 0.11, y: sy + h * 0.25 }];
  const far: Arm = [{ x: x - h * 0.17, y: sy + h * 0.01 }, { x: x - h * 0.27, y: sy + h * 0.1 }, { x: x - h * 0.16, y: sy + h * 0.11 }];
  const hemY = y - h * 0.41;
  groundShadow(ctx, x, y + 1, h * 0.7);
  // The short cloak, behind, fastened at the near shoulder and thrown back over the far one.
  blob(ctx, B, p.dark, [{ k: 'curve', pts: [x - h * 0.2, sy - h * 0.01, x + h * 0.2, sy - h * 0.01, x + h * 0.27, sy + h * 0.12, x + h * 0.3 + sway, y - h * 0.36, x - h * 0.33 + sway, y - h * 0.34, x - h * 0.3, sy + h * 0.1], wobble: 0.04, spiky: 0.04, seed: 71, sub: 3 }], { h, formK: 0.4, tex: 'folds', seed: 71, amount: 1.0 });
  farArm(ctx, R, p.dark, far, false);
  legs(ctx, R, shade('#4a4234', p.tone), 41);
  headNeck(ctx, R);
  // The tunic: body and near sleeve, one mass in the tint.
  blob(ctx, B, p.base, [{ k: 'curve', pts: torsoPts(R, hemY), wobble: 0.03, seed: 73, sub: 3 }, sleeve(R, near, 74)], { h, formK: 0.5, tex: 'folds', seed: 73, amount: 0.7, creases: torsoCreases(R, hemY) });
  // Studded leather jerkin over the chest.
  blob(ctx, B, R.leather, [{ k: 'curve', pts: [x - h * 0.17, sy + h * 0.03, x - h * 0.04, sy + h * 0.045, x + h * 0.05, sy + h * 0.045, x + h * 0.18, sy + h * 0.03, x + h * 0.17, hemY - h * 0.03, x - h * 0.15, hemY - h * 0.03], wobble: 0.03, seed: 75, sub: 2 }], { h, formK: 0.55, spread: 0.7, tex: 'stipple', seed: 75, amount: 0.5 });
  // Belt, and the quiver of bolts at the far hip.
  blob(ctx, B, R.strap, [{ k: 'curve', pts: [x - h * 0.16, hemY - h * 0.05, x + h * 0.175, hemY - h * 0.05, x + h * 0.175, hemY - h * 0.005, x - h * 0.16, hemY - h * 0.005], wobble: 0.01, seed: 76, sub: 2 }], { h, form: false });
  band(ctx, B, x - h * 0.02, hemY - h * 0.055, h * 0.045, h * 0.05, R.brass);
  for (let i = 0; i < 4; i++) {
    const qx = x - h * (0.2 - i * 0.022), qy = hemY - h * 0.02;
    stroke(ctx, [qx, qy, qx - h * 0.02, qy - h * 0.09], R.wood, 1);
    ctx.fillStyle = B.col(shade(i % 2 ? '#c8c0a0' : '#8a3a30', p.tone)); ctx.beginPath(); ctx.arc(qx - h * 0.02, qy - h * 0.09, Math.max(1, h * 0.012), 0, Math.PI * 2); ctx.fill();
  }
  blob(ctx, B, R.leather, [{ k: 'curve', pts: [x - h * 0.23, hemY - h * 0.02, x - h * 0.1, hemY - h * 0.02, x - h * 0.09, hemY + h * 0.1, x - h * 0.22, hemY + h * 0.1], wobble: 0.04, seed: 77, sub: 2 }], { h, formK: 0.55, spread: 0.6 });
  // The single pauldron on the near shoulder.
  glossEllipse(ctx, B, x + h * 0.2, sy + h * 0.02, h * 0.075, h * 0.05, R.steel, 0.35, { gloss: 0.45, spread: 0.6 });
  stroke(ctx, [x + h * 0.14, sy + h * 0.005, x + h * 0.25, sy + h * 0.05], R.strap, 1);
  // The crossbow at port arms across the chest: the stock from the near hip up to the left, the
  // steel prod as a bowed bar across its front end so its tips stand clear of the body.
  const gx = x + h * 0.1, gy = y - h * 0.44, fx = x - h * 0.27, fy = y - h * 0.7;
  const dx = fx - gx, dy = fy - gy, len = Math.hypot(dx, dy), ux = dx / len, uy = dy / len, nx = -uy, ny = ux;
  const pw = h * 0.19, sw = h * 0.022;
  const prod = () => { ctx.beginPath(); ctx.moveTo(fx + nx * pw - ux * h * 0.03, fy + ny * pw - uy * h * 0.03); ctx.quadraticCurveTo(fx + ux * h * 0.05, fy + uy * h * 0.05, fx - nx * pw - ux * h * 0.03, fy - ny * pw - uy * h * 0.03); };
  ctx.lineCap = 'round';
  prod(); ctx.strokeStyle = B.col(B.outline); ctx.lineWidth = Math.max(2, h * 0.03) + 2; ctx.stroke();
  prod(); ctx.strokeStyle = B.col(R.steel); ctx.lineWidth = Math.max(2, h * 0.03); ctx.stroke();
  if (!B.override && h >= 60) { prod(); ctx.strokeStyle = shade(R.steel, 1.3); ctx.lineWidth = 1; ctx.stroke(); }
  stroke(ctx, [fx + nx * pw - ux * h * 0.03, fy + ny * pw - uy * h * 0.03, fx - nx * pw - ux * h * 0.03, fy - ny * pw - uy * h * 0.03], R.bone, 1);
  // Stock: wood, with a deeper butt, a bolt lying along its top and the trigger lever below.
  glossPoly(ctx, B, [fx + nx * sw + ux * h * 0.04, fy + ny * sw + uy * h * 0.04, gx + nx * sw * 1.6 - ux * h * 0.08, gy + ny * sw * 1.6 - uy * h * 0.08, gx - nx * sw * 2.2 - ux * h * 0.09, gy - ny * sw * 2.2 - uy * h * 0.09, gx - nx * sw * 1.2 + ux * h * 0.02, gy - ny * sw * 1.2 + uy * h * 0.02, fx - nx * sw + ux * h * 0.04, fy - ny * sw + uy * h * 0.04], R.wood, { spread: 0.6, h, tex: 'cracks', seed: 81, amount: 0.4 });
  stroke(ctx, [fx + nx * sw * 1.3 + ux * h * 0.08, fy + ny * sw * 1.3 + uy * h * 0.08, gx + nx * sw * 1.3 - ux * h * 0.02, gy + ny * sw * 1.3 - uy * h * 0.02], shade('#d8d0b0', p.tone), Math.max(1, h * 0.012));
  ctx.fillStyle = B.col(R.steel); ctx.beginPath(); ctx.moveTo(fx + nx * sw * 1.3 + ux * h * 0.11, fy + ny * sw * 1.3 + uy * h * 0.11); ctx.lineTo(fx + nx * sw * 2.2 + ux * h * 0.075, fy + ny * sw * 2.2 + uy * h * 0.075); ctx.lineTo(fx + nx * sw * 0.5 + ux * h * 0.075, fy + ny * sw * 0.5 + uy * h * 0.075); ctx.closePath(); ctx.fill();
  stroke(ctx, [gx - nx * sw * 1.5 - ux * h * 0.01, gy - ny * sw * 1.5 - uy * h * 0.01, gx - nx * sw * 3.2 - ux * h * 0.03, gy - ny * sw * 3.2 - uy * h * 0.03], R.steel, Math.max(1, h * 0.012));
  // Both fists on the crossbow: the far one at the fore-end, the near one at the grip.
  fist(ctx, R, far[2], 78);
  fist(ctx, R, near[2], 42);
  // Stubble, the scar, the leather cap.
  blob(ctx, B, R.hair, [{ k: 'curve', pts: [hx - hr * 0.75, hy + hr * 0.4, hx - hr * 0.3, hy + hr * 0.6, hx + hr * 0.3, hy + hr * 0.6, hx + hr * 0.8, hy + hr * 0.38, hx + hr * 0.55, hy + hr * 0.95, hx, hy + hr * 1.08, hx - hr * 0.55, hy + hr * 0.95], wobble: 0.06, spiky: 0.06, seed: 79, sub: 2 }], { h, form: false, outline: false });
  face(ctx, R, false, true);
  blob(ctx, B, R.leather, [
    { k: 'curve', pts: [hx - hr * 1.02, hy - hr * 0.25, hx - hr * 0.9, hy - hr * 0.8, hx - hr * 0.3, hy - hr * 1.1, hx + hr * 0.4, hy - hr * 1.08, hx + hr * 0.95, hy - hr * 0.75, hx + hr * 1.02, hy - hr * 0.25, hx + hr * 1.08, hy + hr * 0.35, hx + hr * 0.85, hy + hr * 0.4, hx + hr * 0.75, hy - hr * 0.35, hx, hy - hr * 0.42, hx - hr * 0.75, hy - hr * 0.35, hx - hr * 0.85, hy + hr * 0.4, hx - hr * 1.08, hy + hr * 0.35], wobble: 0.03, seed: 80, sub: 2 },
  ], { h, formK: 0.55, spread: 0.6, tex: 'stipple', seed: 80, amount: 0.3 });
  void p.light; void mix;
}
