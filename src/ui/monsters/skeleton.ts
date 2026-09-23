// The skeleton family: a skeleton and a bone knight, painted after the Xeen look. Bone is the one
// material whose parts are honestly separate objects, so each bone is its own small rendered mass
// (a knobbed, waisted shaft, no flat tones), the joints are dark gaps rather than seams, the skull
// is a cranium with a hanging jaw, and the ribcage is a real cage laid over a hollow so the gaps
// between the ribs read as space. The knight is the same bones inside dull steel plate, several
// steps darker and cooler than bone, with raw bone at the neck, elbows, knees and hands.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, groundShadow, eye } from './common.ts';
import { blob, glow, softLine, glossPoly, glossTaper, appendCurve, lumpy } from './gloss.ts';
import type { Part } from './gloss.ts';
import { shade, mix, rgba } from '../../lib/art/palettes.ts';
import type { Arm, Mats } from './figure.ts';
import { blade, hand as fist, makeRig } from './figure.ts';

/** Bone, and the rusted iron this family carries: nothing here is bright. */
const BONE = (t: number): Mats => ({
  skin: shade('#d8d0c0', t), skinFar: shade('#a89e8c', t), hair: shade('#2a2420', t),
  leather: shade('#4a3424', t), strap: shade('#3a2a1c', t), boot: shade('#2a221e', t),
  steel: shade('#8b9098', t), dull: shade('#4e545c', t),
  wood: shade('#5a4430', t), bone: shade('#e8dcc0', t), brass: shade('#7a6248', t),
});
import { pathEllipse } from '../../lib/art/shapes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['skeleton', 'bone_knight'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  if (kind === 'bone_knight') knight(ctx, x, y, h, p);
  else skeleton(ctx, x, y, h, p);
};

const INK = '#16121a';

/** A ring of n points, optionally pinched narrower toward the bottom (a helm's dome). */
function ring(cx: number, cy: number, rx: number, ry: number, n: number, pinch = 0): number[] {
  const o: number[] = [];
  for (let i = 0; i < n; i++) {
    const a = (i / n) * Math.PI * 2, s = Math.sin(a), k = 1 - pinch * Math.max(0, s);
    o.push(cx + Math.cos(a) * rx * k, cy + s * ry);
  }
  return o;
}

/** A long bone: a knob at each end, the shaft waisted between them, as one smooth contour. */
function shaft(x0: number, y0: number, x1: number, y1: number, r: number, seed: number): Part {
  const dx = x1 - x0, dy = y1 - y0, L = Math.hypot(dx, dy) || 1, ex = dx / L, ey = dy / L, nx = -ey, ny = ex;
  const P = (t: number, s: number) => [x0 + ex * L * t + nx * s * r, y0 + ey * L * t + ny * s * r];
  const e = r * 0.8 / L;
  return { k: 'curve', pts: [
    ...P(-e, 0), ...P(0.03, -0.92), ...P(0.13, -1.0), ...P(0.24, -0.72), ...P(0.36, -0.60),
    ...P(0.5, -0.56), ...P(0.64, -0.60), ...P(0.76, -0.72), ...P(0.87, -1.0), ...P(0.97, -0.92),
    ...P(1 + e, 0), ...P(0.97, 0.92), ...P(0.87, 1.0), ...P(0.76, 0.72), ...P(0.64, 0.60),
    ...P(0.5, 0.56), ...P(0.36, 0.60), ...P(0.24, 0.72), ...P(0.13, 1.0), ...P(0.03, 0.92),
  ], wobble: 0.02, seed, sub: 1 };
}

/** Two bones meeting at a joint (thigh-knee-shin, upper arm-elbow-forearm). */
function limb(x0: number, y0: number, x1: number, y1: number, x2: number, y2: number, r0: number, r1: number, seed: number): Part[] {
  return [shaft(x0, y0, x1, y1, r0, seed), shaft(x1, y1, x2, y2, r1, seed + 1)];
}

/** The dark gap at a joint: a short bar across the limb's axis, laid over the bone mass. */
function gap(ctx: CanvasRenderingContext2D, jx: number, jy: number, ax: number, ay: number, r: number, hex: string, a = 0.7): void {
  const dx = ax - jx, dy = ay - jy, L = Math.hypot(dx, dy) || 1, nx = -dy / L * r, ny = dx / L * r;
  softLine(ctx, B, [jx - nx, jy - ny, jx + nx, jy + ny], hex, Math.max(1, r * 0.55), a);
}

/** A flat dark shape: a cavity or a socket, not a material — no outline and no shading, it is a hole. */
function hollow(ctx: CanvasRenderingContext2D, pts: number[], hex: string, wobble = 0.03, seed = 0): void {
  ctx.beginPath(); appendCurve(ctx, lumpy(pts, wobble, seed, 2));
  ctx.fillStyle = B.col(hex); ctx.fill();
}

/**
 * The skull: a cranium widest above the eyes and tapering to the brow, sockets sunk under a bone
 * ridge, cheekbones catching the light, and a separate mandible hung below with a gap at the hinge.
 * Everything is laid out in skull-radius units around (cx, cy) and rotated by `rot`, so the head
 * can be tipped and turned without the parts drifting.
 */
function skull(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, rot: number, bn: string, old: string, h: number, jd: number, murk: string): void {
  const ca = Math.cos(rot), sa = Math.sin(rot);
  const P = (px: number, py: number): [number, number] => [cx + (px * ca - py * sa) * r, cy + (px * sa + py * ca) * r];
  const M = (a: readonly number[]): number[] => { const o: number[] = []; for (let i = 0; i < a.length; i += 2) o.push(...P(a[i], a[i + 1])); return o; };
  const quad = (a: readonly number[]): void => {
    ctx.beginPath(); ctx.moveTo(...P(a[0], a[1]));
    for (let i = 2; i < a.length; i += 2) ctx.lineTo(...P(a[i], a[i + 1]));
    ctx.closePath(); ctx.fill();
  };

  // The mandible, its own bone hanging below the cranium: rami up to the hinges, a chin across the bottom.
  blob(ctx, B, old, [{ k: 'curve', pts: M([
    -0.80, 0.44 + jd * 0.25, -0.90, 0.92 + jd, -0.74, 1.30 + jd, -0.26, 1.52 + jd, 0.28, 1.50 + jd,
    0.80, 1.28 + jd, 0.92, 0.88 + jd, 0.84, 0.42 + jd * 0.25,
    0.62, 0.68 + jd, 0.54, 1.06 + jd, 0.05, 1.14 + jd, -0.48, 1.08 + jd, -0.58, 0.66 + jd,
  ]), wobble: 0.03, seed: 21, sub: 2 }], { h, formK: 0.6, spread: 0.7 });

  // The hinge: a dark notch behind the ramus, most of it hidden under the cheekbone that follows.
  ctx.fillStyle = B.col(mix(murk, INK, 0.5));
  const j1 = P(0.86, 0.46), j2 = P(-0.82, 0.50);
  pathEllipse(ctx, j1[0], j1[1], r * 0.2, r * 0.13, rot + 0.5); ctx.fill();
  pathEllipse(ctx, j2[0], j2[1], r * 0.19, r * 0.13, rot - 0.5); ctx.fill();

  // The cranium: temples wide above the eyes, a taper through the brow, cheekbones flaring out again.
  blob(ctx, B, bn, [{ k: 'curve', pts: M([
    0.00, -1.06, 0.46, -0.98, 0.84, -0.70, 0.98, -0.28, 0.94, 0.06, 0.80, 0.26,
    0.90, 0.52, 0.66, 0.72, 0.44, 0.80, 0.32, 1.00, 0.02, 1.06, -0.30, 1.00,
    -0.42, 0.78, -0.64, 0.70, -0.86, 0.50, -0.78, 0.24, -0.92, 0.04, -1.00, -0.30,
    -0.84, -0.70, -0.46, -0.98,
  ]), wobble: 0.02, seed: 17, sub: 1 }], { h, tex: 'cracks', seed: 4, amount: 0.7, formK: 0.45, gloss: 0.08, spread: 0.85 });

  // The mouth: a dark cavity across both jaws, then squared teeth standing in it from above and below.
  ctx.fillStyle = B.col(INK);
  quad([-0.42, 0.80, 0.44, 0.78, 0.40, 1.22 + jd, -0.36, 1.24 + jd]);
  ctx.fillStyle = B.col(mix(bn, '#ffffff', 0.32));
  for (let i = -2; i <= 2; i++) { const tx = 0.02 + i * 0.25; quad([tx - 0.095, 0.82, tx + 0.095, 0.82, tx + 0.085, 1.02, tx - 0.085, 1.02]); }
  ctx.fillStyle = B.col(mix(bn, '#ffffff', 0.14));
  for (let i = -2; i <= 2; i++) { const tx = 0.03 + i * 0.25; quad([tx - 0.085, 1.20 + jd, tx + 0.085, 1.20 + jd, tx + 0.075, 1.05 + jd, tx - 0.075, 1.05 + jd]); }

  // Sockets (the near one larger for the turn of the head) and the nasal hole between and below them.
  ctx.fillStyle = B.col(INK);
  const s1 = P(-0.43, -0.02), s2 = P(0.42, -0.07);
  pathEllipse(ctx, s1[0], s1[1], r * 0.28, r * 0.32, rot + 0.16); ctx.fill();
  pathEllipse(ctx, s2[0], s2[1], r * 0.33, r * 0.35, rot - 0.12); ctx.fill();
  quad([0.0, 0.28, -0.16, 0.64, 0.2, 0.64]);

  // The brow ridge over the sockets, and the cheekbones: a lit edge with a shadow hollowed under it.
  ctx.lineCap = 'round'; ctx.lineWidth = Math.max(1, r * 0.13);
  ctx.strokeStyle = B.col(rgba(mix(bn, '#ffffff', 0.55), 0.55));
  const b0 = P(-0.72, -0.40), b1 = P(-0.04, -0.54), b2 = P(0.78, -0.42);
  ctx.beginPath(); ctx.moveTo(b0[0], b0[1]); ctx.quadraticCurveTo(b1[0], b1[1], b2[0], b2[1]); ctx.stroke();
  softLine(ctx, B, M([-0.70, -0.26, -0.03, -0.38, 0.76, -0.28]), old, Math.max(1, r * 0.12), 0.45);
  ctx.lineWidth = Math.max(1, r * 0.11);
  ctx.beginPath(); ctx.moveTo(...P(0.46, 0.38)); ctx.lineTo(...P(0.84, 0.34)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(...P(-0.44, 0.40)); ctx.lineTo(...P(-0.80, 0.36)); ctx.stroke();
  softLine(ctx, B, M([0.44, 0.58, 0.86, 0.52]), old, Math.max(1, r * 0.12), 0.5);
  softLine(ctx, B, M([-0.42, 0.60, -0.82, 0.54]), old, Math.max(1, r * 0.12), 0.5);
}

function skeleton(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: -0.018, hipTilt: 0.02, turn: 0.02, near: [0.085, 0.105, 0.12], far: [-0.082, -0.1, -0.118], toe: [0.7, -0.6] }, BONE);
  const { sy, hx, hy, hr } = R;
  const bn = p.base, old = p.dark, murk = mix(old, INK, 0.9);
  const rag = shade('#4c463a', p.tone), leather = shade('#3a2a1c', p.tone);
  const u = h / 100;
  const sw = p.breathe * h * 0.011;                                         // the upper body sways on the spine
  const jd = Math.pow(Math.max(0, Math.sin(p.frame / 19)), 14) * 0.3;       // the jaw drops now and then
  const D = (v: number) => sy + v * h;                                      // dy below the shoulder line
  const cx = x + h * 0.012 + sw;                                            // the spine's x through the chest
  groundShadow(ctx, x, y + 1, h * 0.5);

  // Both arms hang; the sword carries on DOWN and forward from the near forearm. It used to rise
  // from a hand at the hip, a 152 degree wrist, which is the same fault the bandits had.
  const near: Arm = [R.sNear, { x: x + h * 0.24, y: D(0.193) }, { x: x + h * 0.211, y: D(0.35) }];
  const far: Arm = [R.sFar, { x: x - h * 0.181, y: D(0.229) }, { x: x - h * 0.151, y: D(0.386) }];

  // The hollow inside the ribs, laid down first so the gaps between them read as space, not paint.
  hollow(ctx, [
    cx - h * 0.11, D(0.026), cx, D(0.012), cx + h * 0.118, D(0.03), cx + h * 0.112, D(0.105),
    cx + h * 0.082, D(0.176), cx + h * 0.012, D(0.146), cx - h * 0.054, D(0.176), cx - h * 0.098, D(0.105),
  ], murk, 0.04, 6);

  // What is left of a baldric, run behind the cage: over the ribs it read as a stick laid across them.
  ctx.strokeStyle = B.col(leather); ctx.lineWidth = Math.max(1, 1.5 * u); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(R.sNear.x - h * 0.012, R.sNear.y - h * 0.018); ctx.quadraticCurveTo(cx + h * 0.01, D(0.095), x - h * 0.078, D(0.212)); ctx.stroke();

  // The far side: the shoulder blade behind the cage, and the far leg behind.
  blob(ctx, B, old, [
    { k: 'ell', x: R.sFar.x - h * 0.014, y: R.sFar.y - h * 0.014, rx: h * 0.052, ry: h * 0.036, rot: 0.62 },
  ], { h, formK: 0.5 });
  blob(ctx, B, old, [
    ...limb(R.legL[0].x, R.legL[0].y, R.legL[1].x, R.legL[1].y, R.legL[2].x, R.legL[2].y, h * 0.03, h * 0.025, 33),
    { k: 'poly', pts: [R.legL[2].x + h * 0.03, R.legL[2].y + h * 0.01, R.legL[2].x - h * 0.02, R.legL[2].y + h * 0.01, R.legL[2].x - h * 0.065, R.legL[2].y + h * 0.05, R.legL[2].x - h * 0.065, R.legL[2].y + h * 0.07, R.legL[2].x + h * 0.035, R.legL[2].y + h * 0.07] },
  ], { h, formK: 0.5 });
  gap(ctx, R.legL[1].x, R.legL[1].y, R.legL[0].x, R.legL[0].y, h * 0.029, murk);
  gap(ctx, R.legL[2].x, R.legL[2].y, R.legL[1].x, R.legL[1].y, h * 0.023, murk);

  // A rusted blade hanging from the near fist, point down and forward past the leg.
  const ga = blade(ctx, R, near[2], x + h * 0.37, y - h * 0.105, h * 0.017, h * 0.058);

  // The axial bones and the near side: spine, ribs, clavicles, pelvis and the near limbs.
  const bones: Part[] = [
    // The lumbar column, with a knob per vertebra: below the last rib it stands against the
    // background rather than against the chest hollow, so it has to read as bone on its own.
    { k: 'tube', pts: [x + h * 0.006, D(0.215), cx - h * 0.002, D(0.19), cx, D(0.165)], r0: h * 0.028, r1: h * 0.025 },
    { k: 'ball', x: x + h * 0.007, y: D(0.205), r: h * 0.024 },
    { k: 'ball', x: cx - h * 0.002, y: D(0.186), r: h * 0.023 },
    { k: 'ball', x: cx, y: D(0.168), r: h * 0.021 },
    { k: 'tube', pts: [cx + sw * 0.2, D(0.01), hx - h * 0.004, hy + hr * 0.72], r0: h * 0.021, r1: h * 0.019 },
    // The sternum down the front of the cage.
    { k: 'tube', pts: [cx + h * 0.006, D(0.03), cx + h * 0.011, D(0.142)], r0: h * 0.016, r1: h * 0.011 },
  ];
  // Four ribs with the same sag, so the dark between them stays open right across the chest:
  // widest at the middle of the cage and drawn in toward the waist. A finer pitch than this is
  // mud at combat size — 0.04h between ribs is under 2px at h = 40.
  const RW = [0.098, 0.12, 0.126], RY = [0.02, 0.056, 0.092], RD = [0.026, 0.032, 0.036];
  const rr = Math.max(h * 0.012, Math.min(1, h * 0.026) * 0.75);
  for (let i = 0; i < 3; i++) {
    const W = RW[i] * h, t = RY[i], d = RD[i];
    bones.push({ k: 'tube', pts: [
      cx - W, D(t), cx - W * 0.66, D(t + d * 0.6), cx - W * 0.22, D(t + d * 0.96), cx + h * 0.006, D(t + d),
      cx + W * 0.4, D(t + d * 0.88), cx + W * 0.78, D(t + d * 0.46), cx + W * 1.06, D(t - 0.006),
    ], r0: rr * 1.05, r1: rr * 0.9 });
  }
  // The costal margin: the last ribs run down and OUT from the xiphoid, so the bottom of the cage
  // is a shallow W and not one more bar.
  bones.push({ k: 'tube', pts: [
    cx - h * 0.112, D(0.124), cx - h * 0.086, D(0.152), cx - h * 0.042, D(0.168), cx + h * 0.012, D(0.14),
    cx + h * 0.058, D(0.17), cx + h * 0.096, D(0.156), cx + h * 0.118, D(0.128),
  ], r0: rr * 0.95, r1: rr * 0.95 });
  bones.push(
    // Clavicles: the near shoulder sits lower than the far one, so the frame is not a diagram.
    { k: 'tube', pts: [R.sFar.x + h * 0.004, R.sFar.y - h * 0.03, cx, D(-0.012), R.sNear.x - h * 0.004, R.sNear.y - h * 0.032], r0: h * 0.017, r1: h * 0.019 },
    // The pelvis: a basin, two iliac blades flaring up and out from a narrow sacrum.
    { k: 'curve', pts: [
      x - h * 0.118, D(0.245), x - h * 0.108, D(0.205), x - h * 0.052, D(0.19), x + h * 0.008, D(0.214),
      x + h * 0.07, D(0.19), x + h * 0.118, D(0.205), x + h * 0.128, D(0.245),
      x + h * 0.09, D(0.31), x + h * 0.05, D(0.295), x + h * 0.008, D(0.275),
      x - h * 0.044, D(0.295), x - h * 0.08, D(0.31),
    ], wobble: 0.035, seed: 3, sub: 2 },
    ...limb(R.sNear.x, R.sNear.y, near[1].x, near[1].y, near[2].x, near[2].y, h * 0.026, h * 0.022, 37),
  );
  blob(ctx, B, bn, bones, { h, formK: 0.5, tex: 'cracks', seed: 8, amount: 0.4 });
  blob(ctx, B, bn, [
    ...limb(R.legR[0].x, R.legR[0].y, R.legR[1].x, R.legR[1].y, R.legR[2].x, R.legR[2].y, h * 0.032, h * 0.026, 35),
    { k: 'poly', pts: [R.legR[2].x - h * 0.03, R.legR[2].y + h * 0.01, R.legR[2].x + h * 0.025, R.legR[2].y + h * 0.01, R.legR[2].x + h * 0.065, R.legR[2].y + h * 0.05, R.legR[2].x + h * 0.065, R.legR[2].y + h * 0.075, R.legR[2].x - h * 0.035, R.legR[2].y + h * 0.075] },
  ], { h, formK: 0.5, tex: 'cracks', seed: 9, amount: 0.4 });
  // The fist closes on the grip after the blade, so the fingers lie across it.
  fist(ctx, R, near[2], ga, 42, { hex: bn, flip: -1, k: 0.92 });

  // Joints: a dark gap at every one, so the bones read as separate and the limbs as jointed.
  gap(ctx, near[1].x, near[1].y, R.sNear.x, R.sNear.y, h * 0.025, murk);
  gap(ctx, near[2].x, near[2].y, near[1].x, near[1].y, h * 0.022, murk);
  gap(ctx, R.sNear.x, R.sNear.y, near[1].x, near[1].y, h * 0.026, murk, 0.8);
  gap(ctx, cx - h * 0.002, D(0.186), x + h * 0.007, D(0.205), h * 0.025, murk, 0.7);
  gap(ctx, cx, D(0.168), cx - h * 0.002, D(0.186), h * 0.024, murk, 0.7);
  gap(ctx, R.legR[1].x, R.legR[1].y, R.legR[0].x, R.legR[0].y, h * 0.031, murk);
  gap(ctx, R.legR[2].x, R.legR[2].y, R.legR[1].x, R.legR[1].y, h * 0.024, murk);
  gap(ctx, R.legR[0].x, R.legR[0].y + h * 0.012, R.legR[1].x, R.legR[1].y, h * 0.03, murk, 0.5);
  // Toes, and the vertebrae up the neck.
  softLine(ctx, B, [R.legR[2].x + h * 0.03, R.legR[2].y + h * 0.03, R.legR[2].x + h * 0.04, R.legR[2].y + h * 0.072], murk, Math.max(1, 0.9 * u), 0.5);
  softLine(ctx, B, [R.legL[2].x - h * 0.026, R.legL[2].y + h * 0.026, R.legL[2].x - h * 0.036, R.legL[2].y + h * 0.064], murk, Math.max(1, 0.9 * u), 0.5);
  for (let i = 0; i < 2; i++) softLine(ctx, B, [cx - h * 0.022, D(0.18 + i * 0.03), cx + h * 0.026, D(0.183 + i * 0.03)], murk, Math.max(1, 0.9 * u), 0.6);
  for (let i = 0; i < 2; i++) softLine(ctx, B, [cx - h * 0.018 + sw * 0.4, D(-0.02 - i * 0.031), cx + h * 0.03 + sw * 0.4, D(-0.024 - i * 0.031)], murk, Math.max(1, 1.1 * u), 0.7);

  // The pelvic hollow and the two smaller holes under it; a lit edge along each iliac crest.
  ctx.fillStyle = B.col(mix(murk, INK, 0.45));
  pathEllipse(ctx, x + h * 0.008, D(0.256), h * 0.032, h * 0.021); ctx.fill();
  pathEllipse(ctx, x - h * 0.054, D(0.292), h * 0.015, h * 0.019, 0.5); ctx.fill();
  pathEllipse(ctx, x + h * 0.07, D(0.29), h * 0.015, h * 0.019, -0.5); ctx.fill();
  ctx.strokeStyle = B.col(rgba(mix(bn, '#ffffff', 0.5), 0.5)); ctx.lineWidth = Math.max(1, 1.1 * u); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - h * 0.1, D(0.213)); ctx.quadraticCurveTo(x - h * 0.05, D(0.192), x - h * 0.006, D(0.21)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + h * 0.11, D(0.213)); ctx.quadraticCurveTo(x + h * 0.062, D(0.192), x + h * 0.02, D(0.21)); ctx.stroke();

  // One ragged scrap of rotted cloth off the far hip, in a dirty, washed-out tone.
  blob(ctx, B, rag, [{ k: 'curve', pts: [
    x - h * 0.125, D(0.215), x - h * 0.07, D(0.225), x - h * 0.075, D(0.295), x - h * 0.095, D(0.365), x - h * 0.085, D(0.435),
    x - h * 0.11, D(0.385), x - h * 0.125, D(0.475), x - h * 0.15, D(0.4), x - h * 0.18, D(0.445), x - h * 0.17, D(0.36), x - h * 0.165, D(0.255),
  ], wobble: 0.05, seed: 5, sub: 2 }], { h, tex: 'folds', seed: 5, amount: 0.5, formK: 0.35, spread: 0.7 });
  // The far arm, hanging in front of the cloth and the hip: a humerus, a forearm and a hand of
  // splayed finger bones, each its own small mass in the far tone.
  blob(ctx, B, old, [
    ...limb(R.sFar.x, R.sFar.y, far[1].x, far[1].y, far[2].x, far[2].y, h * 0.023, h * 0.019, 31),
    { k: 'poly', pts: [
      far[2].x - h * 0.026, far[2].y - h * 0.012, far[2].x + h * 0.02, far[2].y - h * 0.014, far[2].x + h * 0.028, far[2].y + h * 0.012,
      far[2].x + h * 0.032, far[2].y + h * 0.056, far[2].x + h * 0.014, far[2].y + h * 0.03,
      far[2].x + h * 0.016, far[2].y + h * 0.078, far[2].x - h * 0.002, far[2].y + h * 0.032,
      far[2].x - h * 0.012, far[2].y + h * 0.076, far[2].x - h * 0.022, far[2].y + h * 0.03,
      far[2].x - h * 0.042, far[2].y + h * 0.058, far[2].x - h * 0.038, far[2].y + h * 0.008,
    ] },
  ], { h, formK: 0.5 });
  gap(ctx, far[1].x, far[1].y, R.sFar.x, R.sFar.y, h * 0.023, murk);
  gap(ctx, far[2].x, far[2].y, far[1].x, far[1].y, h * 0.019, murk);

  // The skull, tipped and turned a little off the spine, hung forward on the neck.
  skull(ctx, hx, hy, hr * 0.94, 0.16, bn, old, h, jd, murk);
  void p.light;
}

/**
 * The bone knight: the same bones inside dull plate, several steps darker and cooler, with raw bone
 * at the neck, both elbows, both knees and the fist. It stands on the measured frame, and every
 * piece of plate is its own mass — cuisse, greave, fauld, cuirass, pauldron, rerebrace, vambrace —
 * because plate sharing one outline with the body under it reads as a barrel with lumps, which is
 * what this was: the cuirass was widest at the waist, the near arm had no edge of its own, the
 * pauldrons sat low enough to read as biceps, and the tabard was an apron over the whole lower half.
 */
function knight(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, {
    tilt: -0.02, hipTilt: 0.014, turn: 0.01,
    near: [0.09, 0.105, 0.115], far: [-0.086, -0.104, -0.118], toe: [0.72, -0.6],
  }, BONE);
  const u = h / 100, X = (v: number) => x + v * u, Y = (v: number) => y + v * u;
  const lift = p.breathe * h * 0.007, BY = (v: number) => y + v * u - lift;   // the upper body rides the breath
  // The plate is the tint taken several steps down and cool, so it never reads as bone.
  const steel = mix(p.dark, '#303c4a', 0.52);
  const steelD = mix(steel, '#10151c', 0.44);
  const steelM = mix(steel, '#10151c', 0.22);
  const steelT = mix(steel, '#dce8f4', 0.14);
  const steelL = mix(steel, '#e4eef8', 0.3);
  const bn = shade('#f0e7d2', p.tone), old = shade('#d6cbb2', p.tone);
  const murk = mix(old, INK, 0.7);
  const cloth = shade('#5e2832', p.tone), plume = shade('#7a2a34', p.tone), leather = shade('#4a3424', p.tone);
  const blue = '#8ad0ff', pulse = 0.5 + 0.5 * Math.sin(p.frame / 8);
  const sw = p.breathe * 0.7;
  groundShadow(ctx, x, y + 1, h * 0.62);

  // The joints, solved off the frame: a real upper arm and forearm each side, the near arm hanging
  // with the maul and the far one bent up behind the shield.
  const nElb = { x: X(23.1 + sw * 0.8), y: BY(-56.5) }, nHand = { x: X(22.8 + sw * 0.5), y: BY(-40.5) };
  const fElb = { x: X(-29.5 + sw * 0.8), y: BY(-60.3) }, fHand = { x: X(-23.2 + sw * 0.6), y: BY(-44.8) };

  // The bones the plate leaves bare. Each is a shaft with a knob at both ends — the same primitive
  // the skeleton is built from — not a bead between two pipes, and each is its own small mass so
  // bone stays several steps brighter than the steel lapping over its ends.
  const bare = (x0: number, y0: number, x1: number, y1: number, r: number, hex: string, seed: number): void =>
    blob(ctx, B, hex, [shaft(x0, y0, x1, y1, r, seed)], { h, formK: 0.55 });
  bare(X(-10), Y(-36.4), X(-11), Y(-20.8), 3.9 * u, old, 51);
  bare(X(10.1), Y(-36.7), X(11), Y(-20.5), 4.2 * u, old, 52);
  bare(X(-27.4 + sw * 0.8), BY(-65.6), X(-31), BY(-55.4), 3.5 * u, old, 53);
  bare(X(22 + sw * 0.8), BY(-62.4), X(23.9 + sw * 0.8), BY(-50.8), 3.8 * u, bn, 54);
  // The neck: the top vertebrae between the helm's rim and the cuirass collar.
  glossTaper(ctx, B, X(3.4 + sw), BY(-84.2), X(2.4 + sw), BY(-74), 2.6 * u, 3.0 * u, old, { h });
  for (let i = 0; i < 2; i++) softLine(ctx, B, [X(0.8 + sw), BY(-81.6 + i * 2.6), X(5 + sw), BY(-82 + i * 2.6)], murk, Math.max(1, 0.9 * u), 0.55);

  blob(ctx, B, steelM, [{ k: 'ell', x: X(2.2 + sw), y: BY(-75.4), rx: 6.4 * u, ry: 3.4 * u }], { h, formK: 0.5, gloss: 0.2 });

  // The far side, a step darker still: cuisse, greave and sabaton, then the upper arm and vambrace.
  // Each is its own blob so no gradient runs the 0.6h from a pauldron to a sole, and so the plate
  // articulates: a hard edge at every lap is what says this is worn rather than moulded.
  blob(ctx, B, steelD, [{ k: 'cap', x0: R.legL[0].x - 0.8 * u, y0: R.legL[0].y, x1: X(-10.3), y1: Y(-35.4), r0: 4.4 * u, r1: 3.3 * u }], { h, formK: 0.5 });
  blob(ctx, B, steelD, [
    { k: 'cap', x0: X(-10.9), y0: Y(-21.6), x1: X(-11.8), y1: Y(-9.5), r0: 3.3 * u, r1: 3.2 * u },
    { k: 'curve', pts: [X(-18), Y(-3.8), X(-11), Y(-5.3), X(-7.5), Y(-2.3), X(-9), Y(0), X(-19.5), Y(-0.3)], wobble: 0.04, seed: 12, sub: 2 },
  ], { h, formK: 0.5 });
  blob(ctx, B, steelM, [{ k: 'cap', x0: R.sFar.x, y0: R.sFar.y, x1: X(-27.6 + sw * 0.8), y1: BY(-65), r0: 3.8 * u, r1: 2.9 * u }], { h, formK: 0.5, gloss: 0.08 });
  blob(ctx, B, steelM, [{ k: 'cap', x0: X(-30.8 + sw * 0.8), y0: BY(-55.8), x1: fHand.x, y1: fHand.y + 1.4 * u, r0: 2.9 * u, r1: 3.4 * u }], { h, formK: 0.5, gloss: 0.08 });
  blob(ctx, B, steelM, [
    { k: 'curve', pts: ring(X(-14.6 + sw * 0.9), BY(-66.6), 5.4 * u, 4.9 * u, 11, -0.1), wobble: 0.035, seed: 18, sub: 2, gloss: 0.16 },
  ], { h, formK: 0.6, creases: [
    { x0: X(-19.6 + sw * 0.9), y0: BY(-65.4), x1: X(-9.8 + sw * 0.9), y1: BY(-64.8), r: 1.3 * u, a: 0.4 },
  ] });

  // The shield on the far forearm: a battered heater with a faded device, its top rim low enough
  // that the bare elbow knuckle stands over it and the arm behind it still reads as an arm.
  const shx = X(-25 + sw * 0.6), shy = BY(-46);
  blob(ctx, B, steelD, [
    { k: 'curve', pts: [
      shx - 8.5 * u, shy - 10 * u, shx + 0.5 * u, shy - 11.5 * u, shx + 9 * u, shy - 9 * u,
      shx + 9.5 * u, shy + 0.5 * u, shx + 6 * u, shy + 10 * u, shx + 0.5 * u, shy + 16 * u,
      shx - 5.5 * u, shy + 9 * u, shx - 9 * u, shy - 0.5 * u,
    ], wobble: 0.02, seed: 13, sub: 2 },
  ], { h, formK: 0.5, gloss: 0.2, tex: 'cracks', seed: 14, amount: 0.45, spread: 0.8 });
  ctx.fillStyle = B.col(rgba(mix(steelL, '#e8d8a0', 0.55), 0.4));
  ctx.beginPath(); ctx.moveTo(shx - 6 * u, shy - 6.5 * u); ctx.lineTo(shx + 0.5 * u, shy - 1 * u); ctx.lineTo(shx + 6.5 * u, shy - 6.5 * u); ctx.lineTo(shx + 6 * u, shy - 2 * u); ctx.lineTo(shx + 0.5 * u, shy + 4.5 * u); ctx.lineTo(shx - 5.5 * u, shy - 2 * u); ctx.closePath(); ctx.fill();
  softLine(ctx, B, [shx - 7.5 * u, shy - 8.5 * u, shx + 8 * u, shy - 7.5 * u], steelD, Math.max(1, u), 0.4);
  ctx.strokeStyle = B.col(rgba(mix(steelL, '#ffffff', 0.5), 0.45)); ctx.lineWidth = 1; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(shx - 8 * u, shy + 2 * u); ctx.lineTo(shx - 3 * u, shy + 8 * u); ctx.moveTo(shx + 3 * u, shy - 9 * u); ctx.lineTo(shx + 7 * u, shy - 5 * u); ctx.stroke();

  // The near leg.
  blob(ctx, B, steelM, [{ k: 'cap', x0: R.legR[0].x + 0.8 * u, y0: R.legR[0].y, x1: X(10.4), y1: Y(-35.7), r0: 4.7 * u, r1: 3.5 * u }], { h, formK: 0.5, gloss: 0.1 });
  blob(ctx, B, steelM, [
    { k: 'cap', x0: X(10.8), y0: Y(-21.3), x1: X(11.5), y1: Y(-9.5), r0: 3.5 * u, r1: 3.3 * u },
    { k: 'curve', pts: [X(6.5), Y(-3.8), X(13), Y(-5.3), X(19), Y(-2.3), X(18), Y(0), X(8), Y(-0.3)], wobble: 0.04, seed: 15, sub: 2 },
  ], { h, formK: 0.5, gloss: 0.1 });

  // The fauld, hung from the cuirass over the hips in two lames. It goes down first so the
  // cuirass rim laps over its top: that lap is the only thing that says the waist articulates.
  blob(ctx, B, steelM, [{ k: 'curve', pts: [
    X(-12), BY(-61.5), X(12.8), BY(-61.5), X(13.4), BY(-54), X(12), BY(-48.4),
    X(4), BY(-46.8), X(-4), BY(-46.4), X(-12.2), BY(-48.2), X(-13.2), BY(-54),
  ], wobble: 0.025, seed: 16, sub: 2 }], { h, formK: 0.45, gloss: 0.12, creases: [
    { x0: X(-12.8), y0: BY(-53.6), x1: X(13), y1: BY(-53.8), r: 1.4 * u, a: 0.5 },
  ] });

  // The cuirass: widest across the chest and drawn in to a real waist at the rim, tilted with the
  // shoulders. It used to be 1.7 times the frame's waist and widest at the BOTTOM, which is why the
  // knight read as a tub — the ratio between chest and waist is the whole shape of a man in plate.
  const cx = X(1 + sw), cy = BY(-66);
  blob(ctx, B, steel, [{ k: 'curve', pts: [
    X(-12.8 + sw), BY(-73.4), X(-6.6 + sw), BY(-75.4), X(1.8 + sw), BY(-75.8), X(9 + sw), BY(-75.4), X(15 + sw), BY(-74.8),
    X(15.6 + sw), BY(-69.4), X(14.4 + sw), BY(-64.4), X(12 + sw), BY(-59.6),
    X(5 + sw), BY(-57.8), X(-4 + sw), BY(-58), X(-11.2 + sw), BY(-60.2),
    X(-13 + sw), BY(-65), X(-14.2 + sw), BY(-70),
  ], wobble: 0.025, seed: 11, sub: 2, gloss: 0.22 }], { h, tex: 'cracks', seed: 20, amount: 0.9, formK: 0.5, creases: [
    { x0: cx - 11 * u, y0: cy - 4 * u, x1: cx - 6 * u, y1: cy - 6.5 * u, r: 1.6 * u, a: 0.35 },
    { x0: cx + 12 * u, y0: cy - 3.5 * u, x1: cx + 7 * u, y1: cy - 6 * u, r: 1.6 * u, a: 0.35 },
    { x0: cx - 9 * u, y0: cy + 5.5 * u, x1: cx + 10 * u, y1: cy + 5.5 * u, r: 1.4 * u, a: 0.4 },
    { x0: cx + 3 * u, y0: cy - 1 * u, x1: cx + 8 * u, y1: cy + 1.5 * u, r: 2.2 * u, a: 0.4 },
    { x0: cx - 8 * u, y0: cy + 1 * u, x1: cx - 4 * u, y1: cy + 3.5 * u, r: 1.8 * u, a: 0.35 },
  ] });
  // The lit ridge down the breastplate's centre, and scratches across it.
  ctx.strokeStyle = B.col(rgba(mix(steelL, '#ffffff', 0.45), 0.5)); ctx.lineWidth = 1; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx + 1 * u, cy - 5.5 * u); ctx.quadraticCurveTo(cx - 1 * u, cy + 1 * u, cx, cy + 6.5 * u); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 3.5 * u, cy - 4 * u); ctx.lineTo(cx + 9 * u, cy - 1.5 * u);
  ctx.moveTo(cx - 9 * u, cy + 1.5 * u); ctx.lineTo(cx - 4.5 * u, cy + 4.5 * u);
  ctx.moveTo(cx + 5 * u, cy + 4 * u); ctx.lineTo(cx + 9.5 * u, cy + 1.5 * u);
  ctx.stroke();

  // What is left of the tabard: a narrow strip hung off the belt and torn to ribbons, not the apron
  // that used to cover both thighs and flatten the whole lower half.
  blob(ctx, B, cloth, [{ k: 'curve', pts: [
    X(-5.6 + sw), BY(-59.5), X(6 + sw), BY(-59.5), X(7.2), BY(-46), X(6.2), BY(-33),
    X(4.2), BY(-38.5), X(2.2), BY(-26), X(0), BY(-34.5), X(-2.2), BY(-24.5),
    X(-4.6), BY(-32), X(-6.4), BY(-22), X(-7.4), BY(-36), X(-6.8), BY(-48),
  ], wobble: 0.04, seed: 22, sub: 2 }], { h, tex: 'folds', seed: 22, amount: 0.8, formK: 0.4, spread: 0.7 });

  // The belt, buckled ON the cuirass rim where a waist belt goes, rather than a hand's width below
  // it across solid plate, which is where this one used to lie.
  ctx.strokeStyle = B.col(leather); ctx.lineWidth = Math.max(1, 2.4 * u); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(X(-11.4 + sw), BY(-59.6)); ctx.quadraticCurveTo(X(1 + sw), BY(-57.4), X(12.2 + sw), BY(-59.4)); ctx.stroke();
  glossPoly(ctx, B, [X(-2.4 + sw), BY(-59.6), X(2.4 + sw), BY(-59.6), X(2.4 + sw), BY(-56.4), X(-2.4 + sw), BY(-56.4)], R.brass, { h, gloss: 0.4 });

  // The shadows each piece throws on the one below: under the cuirass rim onto the fauld, under
  // the fauld hem onto the thighs, and into both armpits.
  softLine(ctx, B, [X(-10.6 + sw), BY(-56.6), X(11.4 + sw), BY(-56.4)], steelD, Math.max(1, 2 * u), 0.55);
  softLine(ctx, B, [X(-11 + sw), BY(-45.6), X(11.2 + sw), BY(-45.8)], steelD, Math.max(1, 1.8 * u), 0.5);
  softLine(ctx, B, [X(12.4 + sw), BY(-69.6), X(14.6 + sw), BY(-63.6)], steelD, Math.max(1, 2.2 * u), 0.5);
  softLine(ctx, B, [X(-10.6 + sw), BY(-67.6), X(-12.6 + sw), BY(-62.6)], steelD, Math.max(1, 2 * u), 0.45);

  // The near arm, its own mass so it has an edge against the chest, then the pauldron capping it.
  blob(ctx, B, steel, [{ k: 'cap', x0: R.sNear.x, y0: R.sNear.y, x1: X(22.4 + sw * 0.8), y1: BY(-60.4), r0: 4.1 * u, r1: 3.1 * u }], { h, formK: 0.5, gloss: 0.1 });
  blob(ctx, B, steelT, [
    { k: 'curve', pts: ring(X(17.4 + sw * 0.9), BY(-69.9), 6.2 * u, 5.5 * u, 11, -0.1), wobble: 0.035, seed: 19, sub: 2, gloss: 0.24 },
  ], { h, formK: 0.6, creases: [
    { x0: X(11.4 + sw * 0.9), y0: BY(-68.2), x1: X(23.4 + sw * 0.9), y1: BY(-69), r: 1.4 * u, a: 0.4 },
  ] });
  blob(ctx, B, steel, [{ k: 'cap', x0: X(23.3 + sw * 0.8), y0: BY(-53.2), x1: nHand.x, y1: nHand.y + 2.4 * u, r0: 3.1 * u, r1: 3.5 * u }], { h, formK: 0.5, gloss: 0.12 });

  // Dark gaps where bone leaves plate, so the joints read as joints and not as pale patches.
  gap(ctx, nElb.x, nElb.y, R.sNear.x, R.sNear.y, 3.1 * u, murk, 0.5);
  gap(ctx, fElb.x, fElb.y, R.sFar.x, R.sFar.y, 2.8 * u, murk, 0.5);
  gap(ctx, X(10.5), Y(-28.5), X(9), Y(-50), 3.4 * u, murk, 0.5);
  gap(ctx, X(-10.4), Y(-28.5), X(-8.6), Y(-50), 3.1 * u, murk, 0.5);

  // The broken crest, and the helm: a close dome on the skull with a flared neck guard and a dark
  // visor slit lit from inside. It used to be a third again too big and sat low enough to swallow
  // the neck bone it is meant to expose.
  const hlx = R.hx + 0.8 * u, hly = R.hy + 1.4 * u;
  blob(ctx, B, plume, [
    { k: 'curve', pts: [
      X(-1 + sw), BY(-97.4), X(-4.5 + sw), BY(-96.6), X(-8 + sw), BY(-93.4), X(-11 + sw), BY(-88.2), X(-12.6 + sw), BY(-83.4),
      X(-10 + sw), BY(-85.4), X(-9.4 + sw), BY(-80.4), X(-7.6 + sw), BY(-85.2), X(-6 + sw), BY(-82), X(-5.6 + sw), BY(-87.4),
      X(-4.4 + sw), BY(-91.2), X(-2.4 + sw), BY(-94.4),
    ], wobble: 0.06, spiky: 0.16, seed: 9, sub: 2 },
  ], { h, formK: 0.4, spread: 0.7 });
  blob(ctx, B, steel, [
    { k: 'curve', pts: ring(hlx, hly, 8.6 * u, 7.6 * u, 11, 0.1), wobble: 0.03, seed: 23, sub: 2, gloss: 0.3 },
    { k: 'ell', x: hlx + 1.2 * u, y: hly + 4.2 * u, rx: 7.6 * u, ry: 3.1 * u },
  ], { h, formK: 0.5, creases: [{ x0: hlx - 6.4 * u, y0: hly + 3.5 * u, x1: hlx + 6.8 * u, y1: hly + 3.5 * u, r: 1.2 * u, a: 0.4 }] });
  ctx.fillStyle = B.col(INK);
  ctx.beginPath(); ctx.moveTo(hlx - 6 * u, hly - 1.4 * u); ctx.lineTo(hlx + 7.2 * u, hly - 1.8 * u); ctx.lineTo(hlx + 6.8 * u, hly + 1.4 * u); ctx.lineTo(hlx - 5.6 * u, hly + 1.6 * u); ctx.closePath(); ctx.fill();
  ctx.fillRect(Math.round(hlx - 0.6 * u), Math.round(hly + 1.4 * u), Math.max(1, Math.round(1.3 * u)), Math.max(1, Math.round(3.6 * u)));
  ctx.strokeStyle = B.col(rgba(mix(steelL, '#ffffff', 0.45), 0.5)); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(hlx - 0.4 * u, hly - 7.4 * u); ctx.quadraticCurveTo(hlx - 1.8 * u, hly - 4.5 * u, hlx - 0.8 * u, hly - 2.2 * u); ctx.moveTo(hlx + 3.4 * u, hly - 6 * u); ctx.lineTo(hlx + 6.4 * u, hly - 3.6 * u); ctx.stroke();
  glow(ctx, B, hlx - 3.2 * u, hly, 5 * u, blue, 0.35 + 0.3 * pulse, '#d8f0ff');
  glow(ctx, B, hlx + 3.4 * u, hly - 0.2 * u, 5.4 * u, blue, 0.4 + 0.3 * pulse, '#d8f0ff');
  eye(ctx, hlx - 3.2 * u, hly, 1.1 * u, mix(blue, '#ffffff', 0.4 + 0.3 * pulse), false);
  eye(ctx, hlx + 3.4 * u, hly - 0.2 * u, 1.25 * u, mix(blue, '#ffffff', 0.4 + 0.3 * pulse), false);

  // The lit rim along the top-left of the pieces that face the light.
  ctx.strokeStyle = B.col(rgba(mix(steelL, '#ffffff', 0.5), 0.5)); ctx.lineWidth = Math.max(1, 1.2 * u); ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(X(-19.2 + sw * 0.9), BY(-67.6)); ctx.quadraticCurveTo(X(-18.4 + sw * 0.9), BY(-70.8), X(-14.6 + sw * 0.9), BY(-71.4));
  ctx.moveTo(X(11.8 + sw * 0.9), BY(-70.8)); ctx.quadraticCurveTo(X(12.8 + sw * 0.9), BY(-74.4), X(17.4 + sw * 0.9), BY(-75.2));
  ctx.moveTo(hlx - 7.8 * u, hly - 2.6 * u); ctx.quadraticCurveTo(hlx - 6.6 * u, hly - 6.6 * u, hlx - 2.6 * u, hly - 7.4 * u);
  ctx.stroke();

  // The maul, hanging head DOWN past the leg the way a resting weapon does — it used to stand with
  // its head level with the helm, which put the heaviest mass in the sprite beside the face. The
  // head is a squared block collared on the haft: a flat face one side, a beak the other.
  const h0x = X(19 + sw * 0.4), h0y = BY(-56), h1x = X(29.4 + sw * 0.6), h1y = BY(-14);
  const hdx = h1x - h0x, hdy = h1y - h0y, hL = Math.hypot(hdx, hdy), hex2 = hdx / hL, hey = hdy / hL;
  const pt = (t: number, s: number): [number, number] => [h0x + hex2 * hL * t - hey * s * u, h0y + hey * hL * t + hex2 * s * u];
  glossTaper(ctx, B, h0x, h0y, h1x, h1y, 1.5 * u, 1.7 * u, R.wood, { h });
  softLine(ctx, B, [...pt(0.19, -2), ...pt(0.19, 2)], leather, Math.max(1, 1.3 * u), 0.85);
  softLine(ctx, B, [...pt(0.35, -2), ...pt(0.35, 2)], leather, Math.max(1, 1.3 * u), 0.85);
  // The langets and the collar: two straps down the haft into a band under the head.
  softLine(ctx, B, [...pt(0.72, -2.4), ...pt(0.72, 2.4)], steelD, Math.max(1, 1.2 * u), 0.8);
  softLine(ctx, B, [...pt(0.78, -2.6), ...pt(0.78, 2.6)], steelD, Math.max(1, 1.4 * u), 0.85);
  glossPoly(ctx, B, [
    ...pt(0.83, 5.4), ...pt(0.985, 5.4), ...pt(0.985, -6.2), ...pt(0.945, -6.4),
    ...pt(0.905, -11.4), ...pt(0.865, -6.4), ...pt(0.83, -6.2),
  ], steel, { h, gloss: 0.3, spread: 0.55 });
  softLine(ctx, B, [...pt(0.845, 4.4), ...pt(0.97, 4.4)], steelD, Math.max(1, 1.2 * u), 0.6);
  softLine(ctx, B, [...pt(0.85, -5.4), ...pt(0.96, -5.4)], steelD, Math.max(1, u), 0.5);
  ctx.strokeStyle = B.col(rgba(mix(steelL, '#ffffff', 0.55), 0.55)); ctx.lineWidth = 1; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(...pt(0.84, 5.0)); ctx.lineTo(...pt(0.975, 5.0));
  ctx.moveTo(...pt(0.9, -6.6)); ctx.lineTo(...pt(0.903, -10.6));
  ctx.stroke();

  // The fist: bone fingers and a thumb closed round the haft, after it, so they lie across it.
  fist(ctx, R, nHand, Math.atan2(hdy, hdx), 42, { hex: old, flip: 1, k: 0.82 });
}
