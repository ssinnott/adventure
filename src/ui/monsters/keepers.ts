// The keepers: the Bay Keeper first, then the Matron, on one frame that the Whitespine's brothers,
// bell-ringers and Abbot wear under their robes, and that the Dead-Drop's hold keeper and
// Tallymaster, the Underdeep's keeper and the Vault's lamplighters wear bare (MONSTERS §11). The
// first machines shaped like people: a figure facing the company, in hundredths of the sprite's
// height up from the ground line, too tall and too thin for anyone, in the knockers' smooth grey
// plate and jointed as they are, on balls. Long legs on small pointed feet; a pelvis like a bowl; a
// waist that is a stack of rings; a narrow chest plate with a seam ruled down it and the chisel's
// mark cut beside the seam, the knockers' lozenge on a stem; a neck of rings; and an egg of a head,
// tipped to one side, with two soft lights where the eyes would be and no mouth. The arms are long,
// and each hand is a palm with more fingers than a person's, long and jointed, their tips lit. Drawn
// as masses, back to front: the legs, the waist, the pelvis and the chest, what it wears, the head,
// then the arms and the hands. A robe, for a kind that wears one, goes where the Matron's apron does,
// over the legs and the body and under the head, the arms and the hands, so a brother is a Build and
// a robe.
//
// The Bay Keeper: tall and grey, with too many fingers, and gentle. Six fingers to a hand, the hands
// held out from the hips, open, the head tipped as if it listened. Idle: its weight goes from one leg
// to the other, its head tips from side to side, the fingers stir one after another, and now and
// then a hand comes up to lay its lit fingertips on whoever is nearest.
//
// The monks of Highcell are keepers in the dead monks' habits: wool from the shoulders to the shin,
// girt with a cord, the sleeves wide over the arms and the lit fingers out of the cuffs, so the walk
// and the hands are the bay's and the plate shows only at the shins and the feet. The Brother: a monk,
// walking as if someone had described walking to it. Brown, the hood up and the two lights in its
// shadow, the hands held out. Idle: now one foot, now the other, comes up stiff and high and is set
// down flat where it was. The Bell-ringer: oatmeal, the hood down in a cowl round the neck and the
// egg bare, a handbell held out in its right hand. Idle: eleven strokes, a gap, and eleven more. The
// Abbot: the tallest of the three, in black lined pale, the hood drawn up to a point and a crook in
// its left hand, the robe fallen open down the chest on the plate and the chisel's mark. Idle: at the
// hour it lifts the crook and sets it down, and the robe gapes wider.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, groundShadow } from './common.ts';
import { blob, glow, softLine } from './gloss.ts';
import type { Crease, Part } from './gloss.ts';
import { chiselMark } from './knockers.ts';
import { mix, rgba, shade } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['bay_keeper', 'matron', 'brother', 'bell_ringer', 'abbot'];

/**
 * The frame's parts, as proportions of the bay keeper's where they are numbers (1 = the keeper, 0 =
 * none), each named for the keeper that pushes it furthest, so a kind to come is a Build, a colouring
 * and what it wears or carries.
 */
interface Build {
  /** How long the legs are against the body: the Matron's are longest. */
  legs: number;
  /** How thick the limbs are, and the balls they turn on. */
  limb: number;
  /** How broad the shoulders and the chest plate are: the Matron's. */
  chest: number;
  /** How far the head comes down between hunched shoulders, 0 upright: the Matron's stoop. */
  stoop: number;
  /** How far the head tips to one side: the keeper listens. */
  tilt: number;
  /** The head's size. */
  head: number;
  /** Pairs of arms: the Matron's second pair, folded before her. */
  arms: number;
  /** Fingers to a hand, and how long they are. */
  fingers: number;
  finger: number;
  /** How far out from the hips the hands are held: the Matron's reach the furthest. */
  offer: number;
  /** The starched cap on the crown, 0 none: the Matron's. */
  cap: number;
  /** The apron of pale plate, a bib on the chest and a skirt to the knees, 0 none: the Matron's. */
  apron: number;
  /** How large the chisel's mark is cut. */
  mark: number;
  /** The robe, 0 none: its hem's height over the ground in body units, the Brother's at the shin and the Abbot's at the ankle. */
  hem: number;
  /** The hood up over the head, the face in its shadow; a robe with its hood down wears it as a cowl round the neck. */
  hood: number;
  /** How high the hood is drawn up to a point over the crown: the Abbot's. */
  peak: number;
  /** How far the robe has fallen open down the chest, on the plate and the chisel's mark: the Abbot's. */
  open: number;
  /** The Brother's walk: how high a foot comes up, now one and now the other. */
  march: number;
  /** What the right hand carries: the Bell-ringer's bell. */
  bell: number;
  /** What the left hand carries: the Abbot's crook. */
  crook: number;
  /** The cord at the robe's waist, and the lining of the Abbot's. */
  cordHex: string;
  /** The light in the eyes and the fingertips, and its glow. */
  lightHex: string;
  glowHex: string;
}
const KEEPER: Build = {
  legs: 1, limb: 1, chest: 1, stoop: 0, tilt: 1, head: 1, arms: 1, fingers: 6, finger: 1, offer: 1, cap: 0, apron: 0, mark: 1,
  hem: 0, hood: 0, peak: 0, open: 0, march: 0, bell: 0, crook: 0, cordHex: '#d2c6a2',
  lightHex: '#eefaff', glowHex: '#9ad6ff',
};
/**
 * The Matron: it has tended them for four hundred years. The tallest of them and stooped, the head
 * sunk between hunched shoulders under a starched cap, an apron of pale plate from the chest to the
 * knees, a second pair of arms folded across it with the fingers hanging laced, and eight long
 * fingers to each hand of the first, held out over the rows. Idle: she bows lower over a bed and
 * straightens, and her hands stir over it.
 */
const MATRON: Build = {
  legs: 1.06, limb: 1.12, chest: 1.18, stoop: 1, tilt: 0.45, head: 1.1, arms: 2, fingers: 8, finger: 1.3, offer: 1.3, cap: 1, apron: 1, mark: 1.25,
  hem: 0, hood: 0, peak: 0, open: 0, march: 0, bell: 0, crook: 0, cordHex: '#d2c6a2',
  lightHex: '#eefaff', glowHex: '#9ad6ff',
};
/** The Brother: a keeper in a habit with the hood up, its hands held out, walking as it was told to. */
const BROTHER: Build = { ...KEEPER, tilt: 0.7, hem: 13, hood: 1, march: 1 };
/** The Bell-ringer: the hood down and the head bare and listening, the bell in its right hand. */
const BELL_RINGER: Build = { ...KEEPER, tilt: 1.1, offer: 0.85, hem: 15, bell: 1, cordHex: '#5e4a36' };
/** The Abbot: the tallest of the three, its habit lined pale and fallen open, its hood drawn to a point, a crook. */
const ABBOT: Build = { ...KEEPER, legs: 1.05, limb: 1.08, chest: 1.14, head: 1.05, tilt: 0.3, offer: 1.15, mark: 1.2, hem: 6.5, hood: 1, peak: 1, open: 1, crook: 1, cordHex: '#d9d1bb' };
const BUILDS: Partial<Record<MonsterSprite, Build>> = { matron: MATRON, brother: BROTHER, bell_ringer: BELL_RINGER, abbot: ABBOT };
/** The plate under a robe, the Bay Keeper's grey: the def's tint is the robe's. */
const PLATE = '#8d9399';

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  keeper(ctx, x, y, h, p, BUILDS[kind] ?? KEEPER);
};

interface Pt { x: number; y: number }
/** A frame: body units (x right, y up from the ground) to the canvas. */
interface F { u: number; X: (v: number) => number; Y: (v: number) => number }
const at = (x: number, y: number): Pt => ({ x, y });
const plus = (a: Pt, b: Pt, k = 1): Pt => ({ x: a.x + b.x * k, y: a.y + b.y * k });
const turn = (v: Pt, a: number): Pt => ({ x: v.x * Math.cos(a) - v.y * Math.sin(a), y: v.x * Math.sin(a) + v.y * Math.cos(a) });

/** Where the figure's joints stand, worked out once a frame. */
interface Body {
  pelvis: Pt; hipY: number; pelvisTop: number; waistTop: number; chest: Pt; chestTop: number; shoulderY: number;
  neckTop: number; headC: Pt; hr: number; tilt: number; cw: number;
}

function keeper(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint, b: Build): void {
  const t = p.frame;
  // Laid out in body units and scaled to stand inside the height: the Matron's legs and cap would
  // otherwise run over it.
  const legLen = 21 * b.legs, ankleY = 4.2, kneeY = ankleY + legLen, hipY0 = kneeY + legLen;
  const pelvisTop0 = hipY0 + 4.4, waistTop0 = pelvisTop0 + 7.5, chestTop0 = waistTop0 + 19;
  const hr = 7 * b.head, neckTop0 = chestTop0 + 6 - 6 * b.stoop;
  // The Matron's cap and a hood stand over the crown, and the Abbot's hood is drawn up to a point.
  const top = neckTop0 + 2 * hr + b.cap * 4.6 + b.hood * (2.4 + 6.8 * b.peak);
  const u = (h / 100) * Math.min(1, 97 / top);
  const f: F = { u, X: (v) => x + v * u, Y: (v) => y - v * u };

  // The weight goes from one leg to the other: the pelvis shifts over the leg that bears it, the
  // other knee gives, and the body above follows a little less. The Matron bows lower and lifts.
  const w = Math.sin(t / 37), bow = b.stoop * (0.12 + 0.12 * Math.sin(t / 61));
  // The Brother's step: one foot comes up stiff and high and is set down, then the other.
  const step = (k: number): number => (b.march > 0 && k < 30 ? b.march * Math.sin((k / 30) * Math.PI) : 0);
  const lift: [number, number] = [step(t % 120), step((t + 60) % 120)];
  // The Abbot's hour: the crook comes up and is set down, once in 150 frames.
  const hour = b.crook > 0 && t % 150 < 30 ? Math.sin(((t % 150) / 30) * Math.PI) : 0;
  const pelvis = at(1.1 * w, hipY0), chest = at(0.75 * w, chestTop0);
  const body: Body = {
    pelvis, hipY: hipY0, pelvisTop: pelvisTop0, waistTop: waistTop0, chest, chestTop: chestTop0 - bow * 2,
    shoulderY: chestTop0 - 2 + 2 * b.stoop - bow * 1.5, neckTop: neckTop0 - bow * 3.5,
    headC: at(0.45 * w, neckTop0 + hr - bow * 3.5), hr, tilt: b.tilt * (0.26 + 0.1 * Math.sin(t / 53)), cw: 10 * b.chest,
  };
  const robed = b.hem > 0;
  const plate = robed ? shade(PLATE, p.tone) : p.base, limb = shade(plate, 0.93);
  const joint = shade(mix(robed ? shade(PLATE, p.tone * 0.72) : p.dark, '#20242a', 0.45), 0.95);
  const pale = mix(plate, shade('#f2f0e8', p.tone), 0.55), cloth = p.base, cord = shade(b.cordHex, p.tone);
  // Now and then a hand comes up to touch: the one on the company's right, for a while in every 180 frames.
  const k = t % 180, reach = k < 44 ? Math.sin((k / 44) * Math.PI) : 0;

  groundShadow(ctx, f.X(pelvis.x * 0.5), y + 1, 30 * u);
  legs(ctx, f, body, b, h, w, lift, limb, joint);
  trunk(ctx, f, body, b, h, plate, joint);
  // What it wears goes here, over the legs and the body: the Matron's apron, a brother's robe.
  if (b.apron > 0) apron(ctx, f, body, b, h, pale);
  if (robed) robe(ctx, f, body, b, h, w, lift, hour, cloth, cord);
  if (b.arms > 1) foldedArms(ctx, f, body, b, h, t, limb, joint, plate);
  head(ctx, f, body, b, h, t, plate, joint, pale, cloth);
  for (const side of [-1, 1] as const) {
    if (side > 0 && b.bell > 0) bellArm(ctx, f, body, b, h, t, cloth, joint, plate, shade('#b08a3e', p.tone));
    else if (side < 0 && b.crook > 0) crookArm(ctx, f, body, b, h, t, hour, top, cloth, joint, plate, shade('#4b3b2c', p.tone), shade('#c39d4e', p.tone));
    else arm(ctx, f, body, b, h, t, side, side > 0 ? reach : 0, limb, joint, plate, cloth);
  }
}

/** A part's points, in body units, to the canvas. */
const curve = (f: F, pts: readonly Pt[]): Part => ({ k: 'curve', pts: pts.flatMap((q) => [f.X(q.x), f.Y(q.y)]), wobble: 0, sub: 1 });
const cap = (f: F, a: Pt, b: Pt, r0: number, r1: number): Part => ({ k: 'cap', x0: f.X(a.x), y0: f.Y(a.y), x1: f.X(b.x), y1: f.Y(b.y), r0: r0 * f.u, r1: r1 * f.u });
const ball = (f: F, c: Pt, r: number): Part => ({ k: 'ball', x: f.X(c.x), y: f.Y(c.y), r: r * f.u });
const ell = (f: F, c: Pt, rx: number, ry: number, rot = 0): Part => ({ k: 'ell', x: f.X(c.x), y: f.Y(c.y), rx: rx * f.u, ry: ry * f.u, rot: -rot });
const flat = (f: F, pts: readonly Pt[]): number[] => pts.flatMap((q) => [f.X(q.x), f.Y(q.y)]);

/**
 * The legs: thigh and shin on balls at the hip, the knee and the ankle, and a small pointed foot
 * turned out. The leg that does not bear the weight gives at the knee, and its hip drops.
 */
function legs(ctx: CanvasRenderingContext2D, f: F, d: Body, b: Build, h: number, w: number, lift: readonly [number, number], limb: string, joint: string): void {
  const parts: Part[] = [], balls: Part[] = [], L = b.limb;
  for (const s of [-1, 1] as const) {
    // A foot the Brother lifts comes straight up, its knee out, and is set down flat.
    const slack = Math.max(0, -s * w), up = lift[s < 0 ? 0 : 1];
    const hip = at(d.pelvis.x + s * 4.6, d.hipY - 0.8 * slack), ankle = at(s * (5.6 + 0.6 * up), 4.2 + 8 * up);
    const knee = at((hip.x + ankle.x) / 2 + s * 0.4 - s * 1.4 * slack + s * 1.2 * up, (hip.y + ankle.y) / 2 - 0.4 * slack + 1.5 * up);
    parts.push(cap(f, hip, knee, 2.5 * L, 1.9 * L), cap(f, knee, ankle, 1.95 * L, 1.25 * L), ell(f, at(s * (6.6 + 0.6 * up), 1.45 + 8 * up), 3.4 * L, 1.45 * L, -s * 0.18));
    balls.push(ball(f, knee, 2.3 * L), ball(f, ankle, 1.55 * L), ball(f, hip, 2.6 * L));
  }
  blob(ctx, B, limb, parts, { h, formK: 0.4, spread: 0.8, gloss: 0.35 });
  blob(ctx, B, joint, balls, { h, formK: 0.5, spread: 0.7, gloss: 0.5 });
}

/**
 * The waist, the pelvis and the chest: a rod with rings stacked on it, the pelvis a bowl of plate
 * under it and the chest plate over it, narrow at the waist and square at the shoulders, a seam
 * ruled down its middle and another across, and the chisel's mark cut beside the seam. The shoulders
 * turn on balls at its top corners.
 */
function trunk(ctx: CanvasRenderingContext2D, f: F, d: Body, b: Build, h: number, plate: string, joint: string): void {
  const px = d.pelvis.x, cx = d.chest.x, pt = d.pelvisTop, wt = d.waistTop, ct = d.chestTop, cw = d.cw;
  // The rod and its rings, between the pelvis and the chest.
  const rings: Part[] = [cap(f, at(px * 0.6, pt - 1), at(cx * 0.9, wt + 1.5), 1.6, 1.6)];
  for (let i = 0; i < 3; i++) { const k = (i + 0.5) / 3; rings.push(ell(f, at(px + (cx - px) * k, pt + (wt - pt) * k), 2.9, 1.25)); }
  blob(ctx, B, joint, rings, { h, formK: 0.45, spread: 0.7, gloss: 0.4 });
  const hy = d.hipY;
  blob(ctx, B, plate, [curve(f, [
    at(px - 6.8, pt + 0.2), at(px - 3.4, pt + 0.9), at(px + 3.4, pt + 0.9), at(px + 6.8, pt + 0.2), at(px + 7.1, pt - 2.4),
    at(px + 5.6, hy - 0.6), at(px + 2.8, hy - 3.4), at(px, hy - 4.6), at(px - 2.8, hy - 3.4), at(px - 5.6, hy - 0.6), at(px - 7.1, pt - 2.4),
  ])], { h, form: false, spread: 0.75, gloss: 0.5 });
  const chest = [
    at(cx - 2.6, ct + 0.3), at(cx, ct - 0.5), at(cx + 2.6, ct + 0.3), at(cx + cw - 1.3, ct + 0.6), at(cx + cw, ct - 1.6),
    at(cx + cw - 0.6, ct - 7), at(cx + cw * 0.68, ct - 13), at(cx + 4.6, wt + 1.4), at(cx + 2.2, wt), at(cx - 2.2, wt),
    at(cx - 4.6, wt + 1.4), at(cx - cw * 0.68, ct - 13), at(cx - cw + 0.6, ct - 7), at(cx - cw, ct - 1.6), at(cx - cw + 1.3, ct + 0.6),
  ];
  blob(ctx, B, plate, [curve(f, chest)], { h, form: false, spread: 0.72, gloss: 0.55 });
  if (!B.override) {
    // The seams: down the middle, and across where the lower plate laps the upper.
    softLine(ctx, B, flat(f, [at(cx, ct - 1.2), at(cx, wt + 0.6)]), plate, Math.max(1, 0.9 * f.u), 0.7);
    softLine(ctx, B, flat(f, [at(cx - cw * 0.74, ct - 10.5), at(cx, ct - 12), at(cx + cw * 0.74, ct - 10.5)]), plate, Math.max(1, 0.9 * f.u), 0.6);
    ctx.strokeStyle = rgba(mix(plate, '#ffffff', 0.5), 0.45); ctx.lineWidth = Math.max(1, 0.5 * f.u);
    ctx.beginPath(); ctx.moveTo(f.X(cx + 0.7), f.Y(ct - 1.2)); ctx.lineTo(f.X(cx + 0.7), f.Y(wt + 0.6)); ctx.stroke();
  }
  chiselMark(ctx, f, at(cx + cw * 0.42, ct - 5.6), 1.6 * b.mark, 0, plate);
  blob(ctx, B, joint, [-1, 1].map((s) => ball(f, at(cx + s * (cw + 0.2), d.shoulderY), 2.6 * b.limb)), { h, formK: 0.5, spread: 0.7, gloss: 0.5 });
}

/**
 * The Matron's apron, of pale plate: a bib from below the mark to the waist, and a skirt from the
 * waist to the knees, flared and pleated, over the pelvis and the thighs.
 */
function apron(ctx: CanvasRenderingContext2D, f: F, d: Body, b: Build, h: number, pale: string): void {
  const cx = d.chest.x, px = d.pelvis.x, ct = d.chestTop, wt = d.waistTop, knee = 4.2 + 21 * b.legs + 3.5, a = b.apron;
  const hem = (s: number): number => px + s * 8.8 * a;
  blob(ctx, B, pale, [
    curve(f, [at(cx - 4.4, ct - 7.6), at(cx + 4.4, ct - 7.6), at(cx + 4.8, wt + 2), at(cx + 3.6, wt - 0.6), at(cx - 3.6, wt - 0.6), at(cx - 4.8, wt + 2)]),
    curve(f, [at(cx - 5.4, wt + 0.4), at(cx + 5.4, wt + 0.4), at(px + 7, d.pelvisTop - 3), at(hem(1), knee + 2), at(hem(0.92), knee - 0.6), at(hem(0.3), knee - 1.2), at(hem(-0.3), knee - 1.2), at(hem(-0.92), knee - 0.6), at(hem(-1), knee + 2), at(px - 7, d.pelvisTop - 3)]),
  ], { h, form: false, spread: 0.8, gloss: 0.3 });
  if (B.override) return;
  // The pleats, and the band where the skirt is gathered at the waist.
  for (const s of [-0.5, 0, 0.5]) softLine(ctx, B, flat(f, [at(px + s * 4.6, d.pelvisTop - 2.5), at(hem(s * 0.95), knee - 0.4)]), pale, Math.max(1, 0.6 * f.u), 0.4);
  softLine(ctx, B, flat(f, [at(cx - 5.2, wt + 0.2), at(cx + 5.2, wt + 0.2)]), pale, Math.max(1, 1 * f.u), 0.5);
}

/**
 * The neck of rings and the head: an egg of plate, tipped to one side, a face plate set into it with
 * a seam round it, two soft lights where the eyes would be and nothing where the mouth would be.
 * The Matron's sits low between her shoulders, so her eyes are low in it and her cap shows above.
 * In a hood the neck is hidden and the face is set back in the hood's shadow, smaller and darker.
 */
function head(ctx: CanvasRenderingContext2D, f: F, d: Body, b: Build, h: number, t: number, plate: string, joint: string, pale: string, cloth: string): void {
  const pivot = at(d.headC.x, d.neckTop), hr = d.hr, hw = hr * 0.72;
  const H0 = (v: Pt): Pt => plus(pivot, turn(plus(at(d.headC.x - pivot.x, d.headC.y - pivot.y), v), -d.tilt));
  const hooded = b.hood > 0, fs = hooded ? 0.84 : 1, drop = hooded ? 0.9 : 0;
  const H = (v: Pt): Pt => H0(at(v.x * fs, v.y * fs - drop));
  if (hooded) hood(ctx, f, d, b, h, H0, hr, hw, cloth);
  else if (d.neckTop - d.chestTop > 1.5) {
    const n: Part[] = [cap(f, at(d.chest.x, d.chestTop - 1), H(at(0, -hr * 0.8)), 1.3, 1.2)];
    for (const k of [0.3, 0.7]) n.push(ell(f, at(d.chest.x + (pivot.x - d.chest.x) * k, d.chestTop + (d.neckTop - d.chestTop) * k), 1.8, 0.9));
    blob(ctx, B, joint, n, { h, formK: 0.45, spread: 0.7, gloss: 0.4 });
  }
  const egg: Pt[] = [];
  for (let i = 0; i < 16; i++) {
    const a = (i / 16) * Math.PI * 2, c = Math.cos(a), s = Math.sin(a);
    // Fuller at the crown than at the chin, as an egg is.
    egg.push(H(at(c * hw * (s > 0 ? 1 : 0.86), s * hr)));
  }
  blob(ctx, B, hooded ? mix(plate, '#121418', 0.42) : plate, [curve(f, egg)], { h, form: false, spread: 0.75, gloss: 0.6 });
  if (b.cap > 0) starchedCap(ctx, f, H, hr, hw, h, b.cap, pale);
  if (B.override) return;
  // The face plate's seam, from temple to temple under the chin, and the brow over the eyes.
  const down = -1.7 * b.stoop;
  const seam: Pt[] = [];
  for (let i = 0; i <= 10; i++) { const a = Math.PI * (1.08 + (0.84 * i) / 10); seam.push(H(at(Math.cos(a) * hw * 0.82, 0.8 + down + Math.sin(a) * hr * 0.8))); }
  softLine(ctx, B, flat(f, seam), plate, Math.max(1, 0.7 * f.u), 0.5);
  softLine(ctx, B, flat(f, [H(at(-hw * 0.8, 2.2 + down)), H(at(0, 2.8 + down)), H(at(hw * 0.8, 2.2 + down))]), plate, Math.max(1, 0.8 * f.u), 0.6);
  // The eyes: soft lights in shallow hollows, breathing slowly.
  const on = 0.78 + 0.22 * (0.5 + 0.5 * Math.sin(t / 29));
  for (const s of [-1, 1]) {
    const e = H(at(s * hw * 0.42, 0.5 + down));
    ctx.fillStyle = rgba(shade(plate, 0.5), 0.75);
    ctx.beginPath(); ctx.ellipse(f.X(e.x), f.Y(e.y), 1.8 * f.u, 1.15 * f.u, d.tilt, 0, Math.PI * 2); ctx.fill();
    glow(ctx, B, f.X(e.x), f.Y(e.y), 4.2 * f.u, b.glowHex, 0.45 * on, b.lightHex);
    ctx.fillStyle = mix(b.glowHex, b.lightHex, on);
    ctx.beginPath(); ctx.ellipse(f.X(e.x), f.Y(e.y), Math.max(0.9, 1.35 * f.u), Math.max(0.7, 0.62 * f.u), d.tilt, 0, Math.PI * 2); ctx.fill();
  }
}

/**
 * The Matron's cap: a starched plate set on the crown and tipped back, wide and low, folded across
 * and with its band round the head; drawn over the egg, tipped with it.
 */
function starchedCap(ctx: CanvasRenderingContext2D, f: F, H: (v: Pt) => Pt, hr: number, hw: number, h: number, k: number, pale: string): void {
  // Flared from the band to its folded top edge, whose corners turn up and out as wings.
  const top = hr + 3.4 * k;
  blob(ctx, B, pale, [{ k: 'poly', pts: flat(f, [
    H(at(-hw * 0.82, hr - 2.2)), H(at(hw * 0.82, hr - 2.2)), H(at(hw * 1.62, top + 0.8)), H(at(hw * 1.2, top + 0.2)),
    H(at(0, top + 0.6)), H(at(-hw * 1.2, top + 0.2)), H(at(-hw * 1.62, top + 0.8)),
  ]) }], { h, form: false, spread: 0.8, gloss: 0.3 });
  if (B.override) return;
  // The band at the brow, and the fold along the top.
  softLine(ctx, B, flat(f, [H(at(-hw * 0.88, hr - 1.1)), H(at(0, hr - 0.7)), H(at(hw * 0.88, hr - 1.1))]), pale, Math.max(1, 1 * f.u), 0.55);
  softLine(ctx, B, flat(f, [H(at(-hw * 1.3, top - 0.7)), H(at(0, top - 0.6)), H(at(hw * 1.3, top - 0.7))]), pale, Math.max(1, 0.7 * f.u), 0.45);
}

/**
 * One arm of the pair that hangs: upper arm and forearm on balls at the shoulder, the elbow and the
 * wrist, the forearm turned out so the hand is held out from the hip, open. `reach` brings it up and
 * forward to touch.
 */
function arm(ctx: CanvasRenderingContext2D, f: F, d: Body, b: Build, h: number, t: number, s: -1 | 1, reach: number, limb: string, joint: string, plate: string, cloth: string): void {
  const L = b.limb, o = b.offer, robed = b.hem > 0;
  const sh = at(d.chest.x + s * (d.cw + 0.4), d.shoulderY - 0.6);
  const el = at(sh.x + s * (1.6 + 0.8 * o) + s * reach * 2.5, sh.y - 18.5 + reach * 6);
  const wr = at(el.x + s * (1.2 + 2.4 * o) + s * reach * 1, el.y - 16 + 2 * o + reach * 15);
  if (robed) sleeve(ctx, f, h, sh, el, wr, cloth);
  else blob(ctx, B, limb, [cap(f, sh, el, 1.95 * L, 1.6 * L), cap(f, el, wr, 1.6 * L, 1.3 * L)], { h, formK: 0.4, spread: 0.8, gloss: 0.35 });
  blob(ctx, B, joint, robed ? [ball(f, wr, 1.5 * L)] : [ball(f, el, 2.15 * L), ball(f, wr, 1.5 * L)], { h, formK: 0.5, spread: 0.7, gloss: 0.5 });
  hand(ctx, f, b, h, t, s, at(wr.x + s * 0.9, wr.y - 2.4), 1 + 0.35 * reach, -0.5 * reach * s, plate);
}

/**
 * The Matron's second pair of arms, from low on her chest, folded before her: the forearms come in
 * over her apron, and the hands rest one beside the other at her hips, their fingers hanging laced.
 */
function foldedArms(ctx: CanvasRenderingContext2D, f: F, d: Body, b: Build, h: number, t: number, limb: string, joint: string, plate: string): void {
  const L = b.limb * 0.85, parts: Part[] = [], balls: Part[] = [], palms: Pt[] = [];
  for (const s of [-1, 1] as const) {
    const sh = at(d.chest.x + s * d.cw * 0.66, d.chestTop - 10.5), el = at(sh.x + s * 2.4, d.waistTop - 3.5), wr = at(d.chest.x + s * 2.4, d.pelvisTop - 1.5);
    parts.push(cap(f, sh, el, 1.6 * L, 1.4 * L), cap(f, el, wr, 1.4 * L, 1.15 * L));
    balls.push(ball(f, sh, 1.9 * L), ball(f, el, 1.8 * L), ball(f, wr, 1.3 * L));
    palms.push(at(wr.x - s * 0.5, wr.y - 2.2));
  }
  blob(ctx, B, limb, parts, { h, formK: 0.4, spread: 0.8, gloss: 0.35 });
  blob(ctx, B, joint, balls, { h, formK: 0.5, spread: 0.7, gloss: 0.5 });
  palms.forEach((c, i) => hand(ctx, f, b, h, t, i ? 1 : -1, c, 0.85, 0, plate, true));
}

/**
 * A hand: a palm plate, and fingers fanned from its lower edge, more than a person's, each two long
 * joints curling in a little at the tip, the tip lit. They stir one after another; `span` scales the
 * fan and its length, `turnTo` turns the whole hand, and a `laced` hand's fingers hang close, crossing
 * the other's, and its tips are dark.
 */
function hand(ctx: CanvasRenderingContext2D, f: F, b: Build, h: number, t: number, s: -1 | 1, c: Pt, span: number, turnTo: number, plate: string, laced = false): void {
  const n = b.fingers, parts: Part[] = [ell(f, c, 2 * span + 0.3, 2.6 * span + 0.2, s * 0.2 + turnTo)], tips: Pt[] = [];
  const minR = 0.85 / f.u;
  for (let i = 0; i < n; i++) {
    const k = n > 1 ? i / (n - 1) : 0.5, mid = 1 - Math.abs(2 * k - 1);
    const a = (laced ? s * (-0.22 + 0.34 * k) : s * (-0.32 + 1.05 * k)) + turnTo;
    const dir = turn(at(0, -1), a), len = (laced ? 8.4 : 8.6 + 3 * mid) * b.finger * span;
    const stir = Math.sin(t / 9 - i * 0.8) * 0.12, curl = -s * (0.07 + stir) * (laced ? 0.2 : 1);
    const kn = plus(c, dir, 2 * span), mj = plus(kn, turn(dir, curl), len * 0.55), tip = plus(mj, turn(dir, curl * 2.4), len * 0.45);
    parts.push(cap(f, kn, mj, Math.max(minR, 0.8), Math.max(minR, 0.66)), cap(f, mj, tip, Math.max(minR, 0.66), Math.max(minR, 0.5)));
    tips.push(tip);
  }
  blob(ctx, B, plate, parts, { h, formK: 0.35, spread: 0.8, gloss: 0.35 });
  if (B.override || laced) return;
  // The lit tips, brighter as the hand comes up to touch.
  const bright = 0.22 + 0.35 * Math.max(0, span - 1) / 0.35;
  for (const q of tips) {
    glow(ctx, B, f.X(q.x), f.Y(q.y), 2.6 * f.u, b.glowHex, bright, b.lightHex);
    ctx.fillStyle = rgba(b.lightHex, 0.9);
    ctx.beginPath(); ctx.arc(f.X(q.x), f.Y(q.y), Math.max(0.6, 0.5 * f.u), 0, Math.PI * 2); ctx.fill();
  }
}

/**
 * A habit of wool, from the shoulders to the hem: narrow at the cord and falling wider to the hem,
 * which swings against the weight and lifts over a raised foot. A hood that is down lies round the
 * neck as a cowl. The Abbot's has fallen open down the chest to the cord, two halves with the gap
 * between them lined pale, on the plate and the chisel's mark, and it gapes wider at the hour.
 */
function robe(ctx: CanvasRenderingContext2D, f: F, d: Body, b: Build, h: number, w: number, lift: readonly [number, number], hour: number, cloth: string, cord: string): void {
  const cx = d.chest.x, px = d.pelvis.x, ct = d.chestTop, wt = d.waistTop, cw = d.cw, sy = d.shoulderY, hem = b.hem;
  const flare = 10.5 + 0.12 * (40 - hem), sway = -0.7 * w;
  const hx = (k: number): number => px * 0.4 + sway + k * flare;
  const up = (s: -1 | 1): number => 3.5 * lift[s < 0 ? 0 : 1];
  // One side, from the shoulder down to the hem.
  const side = (s: -1 | 1): Pt[] => [
    at(cx + s * (cw + 0.6), sy + 2.9), at(cx + s * (cw + 2.8), sy - 1.2), at(cx + s * (cw * 0.86 + 0.9), ct - 12.5),
    at(cx + s * 6.4, wt - 1), at(px + s * 8.4, d.hipY - 2), at(hx(s), hem + 1.4 + up(s)), at(hx(s * 0.55), hem - 0.3 + 0.6 * up(s)),
  ];
  const right = side(1), left = side(-1).reverse(), neckL = at(cx - 3.6, ct + 1), neckR = at(cx + 3.6, ct + 1);
  let halves: Pt[][] = [[neckL, neckR, ...right, at(hx(0), hem + 0.3), ...left]], edges: Pt[][] = [];
  if (b.open > 0) {
    // The gap's edges, from the neck down to the cord, where the halves close again and overlap.
    const o = b.open * (1 + 0.35 * hour);
    const gapL = [at(cx - 1.6 * o, ct - 0.2), at(cx - 0.7 * o, ct - 9), at(cx + 0.3, wt - 0.4)];
    const gapR = [at(cx + 8.2 * o, ct - 0.6), at(cx + 6.8 * o, ct - 9), at(cx + 2.6, wt - 0.4)];
    halves = [[neckL, ...gapL, at(hx(0.12), hem + 0.3), ...left], [neckR, ...right, at(hx(-0.12), hem + 0.3), ...[...gapR].reverse()]];
    edges = [gapL, gapR];
  }
  const creases: Crease[] = [
    { x0: f.X(cx - 6), y0: f.Y(wt - 1.9), x1: f.X(cx + 6), y1: f.Y(wt - 1.9), r: 0.9 * f.u, a: 0.3 },
    ...[-1, 0, 1].map((s) => ({ x0: f.X(px + s * 3.2), y0: f.Y(wt - 4), x1: f.X(hx(s * 0.5)), y1: f.Y(hem + 2.5), r: 0.7 * f.u, a: 0.22 })),
  ];
  blob(ctx, B, cloth, halves.map((q) => curve(f, q)), { h, form: false, tex: 'folds', seed: 17, amount: 0.6, spread: 0.8, gloss: 0.08, creases });
  if (edges.length) blob(ctx, B, cord, edges.flatMap((e) => [cap(f, e[0], e[1], 0.9, 0.8), cap(f, e[1], e[2], 0.8, 0.6)]), { h, form: false, outline: false, spread: 0.8, gloss: 0.2 });
  // The cord, knotted at the front with its end hanging; a hood that is down, bunched round the neck.
  const knot = at(cx - 2.4 + sway * 0.3, wt - 1.4), end = at(knot.x - 0.8 + sway * 0.5, wt - 15);
  blob(ctx, B, cord, [
    cap(f, at(cx - 6.6, wt - 0.9), at(cx + 6.6, wt - 0.9), 1.05, 1.05), cap(f, knot, end, 0.75, 0.65),
    ball(f, at((knot.x + end.x) / 2, (knot.y + end.y) / 2), 1.05), ball(f, end, 1),
  ], { h, formK: 0.4, spread: 0.8, gloss: 0.2 });
  if (b.hood === 0) blob(ctx, B, cloth, [ell(f, at(cx, sy + 2.2), 7.6, 3.2), cap(f, at(cx - 7.2, sy + 0.2), at(cx + 7.2, sy + 0.2), 2.9, 2.9)], { h, tex: 'folds', seed: 23, amount: 0.5, formK: 0.5, spread: 0.8, gloss: 0.08 });
}

/**
 * A hood drawn up over the head, its foot on the shoulders and coming to a point on the chest, its
 * crown tipped with the head and the face set back in its shadow; the Abbot's is drawn up to a point.
 */
function hood(ctx: CanvasRenderingContext2D, f: F, d: Body, b: Build, h: number, H: (v: Pt) => Pt, hr: number, hw: number, cloth: string): void {
  const cx = d.chest.x, sy = d.shoulderY, pk = b.peak;
  blob(ctx, B, cloth, [curve(f, [
    at(cx - hw * 1.8, sy + 0.4), H(at(-hw * 1.52, -hr * 0.2)), H(at(-hw * 1.38, hr * 0.6)), H(at(-hw * 0.86, hr * 1.12 + pk * 2.8)),
    H(at(0, hr * 1.3 + pk * 6.8)),
    H(at(hw * 0.86, hr * 1.12 + pk * 2.8)), H(at(hw * 1.38, hr * 0.6)), H(at(hw * 1.52, -hr * 0.2)), at(cx + hw * 1.8, sy + 0.4), at(cx, sy - 2),
  ])], { h, form: false, tex: 'folds', seed: 41, amount: 0.45, spread: 0.8, gloss: 0.08 });
  const hole: Pt[] = [];
  for (let i = 0; i < 14; i++) { const a = (i / 14) * Math.PI * 2, s = Math.sin(a); hole.push(H(at(Math.cos(a) * hw * 1.04, -0.6 + s * hr * (s > 0 ? 0.98 : 0.9)))); }
  blob(ctx, B, mix(cloth, '#09080a', 0.8), [curve(f, hole)], { h, form: false, outline: false, spread: 0.6 });
}

/** A wide sleeve of the habit over an arm, from the shoulder to a mouth at the wrist, dark inside. */
function sleeve(ctx: CanvasRenderingContext2D, f: F, h: number, sh: Pt, el: Pt, wr: Pt, cloth: string): void {
  const dx = wr.x - el.x, dy = wr.y - el.y, n = Math.hypot(dx, dy) || 1, dir = at(dx / n, dy / n);
  const mouth = plus(wr, dir, 0.4), a = Math.atan2(dir.y, dir.x);
  blob(ctx, B, cloth, [cap(f, sh, el, 3.1, 3.4), cap(f, el, mouth, 3.4, 4.4)], { h, tex: 'folds', seed: 29, amount: 0.5, formK: 0.4, spread: 0.8, gloss: 0.08 });
  blob(ctx, B, mix(cloth, '#09080a', 0.75), [ell(f, mouth, 3.7, 1.35, a + Math.PI / 2)], { h, form: false, outline: false, spread: 0.6 });
}

/**
 * The Bell-ringer's right arm, held out with the elbow down and the fist up at the hip, the bell hung
 * from it: eleven strokes, a gap, and eleven more. The bell swings about the fist, the arm gives with
 * it, and the clapper hangs back.
 */
function bellArm(ctx: CanvasRenderingContext2D, f: F, d: Body, b: Build, h: number, t: number, cloth: string, joint: string, plate: string, bronze: string): void {
  const k = t % 180, swing = k < 132 ? Math.sin(((k % 12) / 12) * Math.PI * 2) : 0;
  const sh = at(d.chest.x + d.cw + 0.4, d.shoulderY - 0.6), el = at(sh.x + 5, sh.y - 10);
  const wr = at(el.x + 6.2, el.y + 4.4 + 1.2 * swing), grip = at(wr.x + 1.6, wr.y + 0.4);
  sleeve(ctx, f, h, sh, el, wr, cloth);
  blob(ctx, B, joint, [ball(f, wr, 1.5 * b.limb)], { h, formK: 0.5, spread: 0.7, gloss: 0.5 });
  hand(ctx, f, b, h, t, 1, grip, 0.7, 0, plate, true);
  bell(ctx, f, h, grip, 0.42 * swing, bronze);
}

/** A handbell of bronze hung mouth down from `c` and turned by `a`: the handle, the crown, the waist flaring to the lip, and the clapper under it. */
function bell(ctx: CanvasRenderingContext2D, f: F, h: number, c: Pt, a: number, bronze: string): void {
  const P = (x: number, y: number): Pt => plus(c, turn(at(x * 1.2, y * 1.2), a));
  const pivot = P(0, -5), knob = plus(pivot, turn(at(0, -1), -0.5 * a), 13.7);
  blob(ctx, B, shade(bronze, 0.7), [cap(f, pivot, knob, 0.5, 0.5), ball(f, knob, 1.35)], { h, formK: 0.5, spread: 0.7, gloss: 0.5 });
  blob(ctx, B, bronze, [cap(f, P(0, 0.9), P(0, -3.2), 1.05, 0.95), ell(f, P(0, -3.6), 2.8, 1.2, a), curve(f, [
    P(-2.6, -3.4), P(2.6, -3.4), P(3.3, -6), P(3.9, -9.5), P(4.9, -12.4), P(6.3, -14.5), P(6, -15.6),
    P(0, -15.2), P(-6, -15.6), P(-6.3, -14.5), P(-4.9, -12.4), P(-3.9, -9.5), P(-3.3, -6),
  ])], { h, form: false, spread: 0.7, gloss: 0.7 });
  if (B.override) return;
  // The band at the lip, and another at the shoulder.
  softLine(ctx, B, flat(f, [P(-5.6, -13.5), P(0, -13.1), P(5.6, -13.5)]), bronze, Math.max(1, 0.8 * f.u), 0.6);
  softLine(ctx, B, flat(f, [P(-3.2, -5.4), P(0, -5.1), P(3.2, -5.4)]), bronze, Math.max(1, 0.6 * f.u), 0.45);
}

/**
 * The Abbot's left arm and its crook: the staff stood on the floor at its side, the fist round it at
 * the hip, and the crook curled in toward the hood. At the hour it lifts the staff and sets it down.
 */
function crookArm(ctx: CanvasRenderingContext2D, f: F, d: Body, b: Build, h: number, t: number, hour: number, top: number, cloth: string, joint: string, plate: string, wood: string, gilt: string): void {
  const sh = at(d.chest.x - d.cw - 0.4, d.shoulderY - 0.6), el = at(sh.x - 3.4, sh.y - 15 + 2.4 * hour);
  const wr = at(el.x - 3.6, el.y - 3.2 + 3.2 * hour), grip = at(wr.x - 1.2, wr.y - 1.6);
  const foot = at(grip.x, 0.5 + 3.2 * hour), T = at(grip.x, top - 10.8 + 3.2 * hour);
  const crook = [at(0, 0), at(0, 3.4), at(0.9, 5.8), at(3, 7), at(5.1, 6.3), at(5.9, 4.4), at(5.1, 2.6), at(3.4, 2.3), at(2.7, 3.6)].map((q) => plus(T, q));
  blob(ctx, B, wood, [cap(f, foot, T, 0.95, 1)], { h, formK: 0.4, spread: 0.8, gloss: 0.3 });
  blob(ctx, B, gilt, [{ k: 'tube', pts: flat(f, crook), r0: 1.15 * f.u, r1: 0.85 * f.u }, ball(f, T, 1.6)], { h, formK: 0.5, spread: 0.7, gloss: 0.7 });
  sleeve(ctx, f, h, sh, el, wr, cloth);
  blob(ctx, B, joint, [ball(f, wr, 1.5 * b.limb)], { h, formK: 0.5, spread: 0.7, gloss: 0.5 });
  hand(ctx, f, b, h, t, -1, grip, 0.75, 0, plate, true);
}
