// The skeleton family: a skeleton and a bone knight, painted after the Xeen look. Bone is the one
// material whose parts are honestly separate objects, so each bone is its own small rendered mass
// (a knobbed, waisted shaft, no flat tones), the joints are dark gaps rather than seams, the skull
// is a cranium with a hanging jaw, and the ribcage is a real cage laid over a hollow so the gaps
// between the ribs read as space. The knight is the same bones inside dull steel plate, several
// steps darker and cooler than bone, with raw bone at the neck, elbows, knees and hands.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, groundShadow, eye } from './common.ts';
import { blob, glow, softLine, glossBall, glossPoly, glossTaper, appendCurve, lumpy } from './gloss.ts';
import type { Part } from './gloss.ts';
import { shade, mix, rgba } from '../../lib/art/palettes.ts';
import type { Arm, Mats } from './figure.ts';
import { blade, hand as fist, makeRig } from './figure.ts';

/** Bone, and the rusted iron this family carries: nothing here is bright. */
const BONE = (t: number): Mats => ({
  skin: shade('#d8d0c0', t), skinFar: shade('#a89e8c', t), hair: shade('#2a2420', t),
  leather: shade('#4a3424', t), strap: shade('#3a2a1c', t), boot: shade('#2a221e', t),
  steel: shade('#9c8a7c', t), dull: shade('#6a5a4a', t),
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
  const rag = shade('#6b6353', p.tone), leather = shade('#4a3424', p.tone);
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
    cx - h * 0.112, D(0.03), cx, D(0.016), cx + h * 0.118, D(0.034), cx + h * 0.104, D(0.1),
    cx + h * 0.07, D(0.15), cx, D(0.168), cx - h * 0.068, D(0.152), cx - h * 0.098, D(0.1),
  ], murk, 0.04, 6);

  // The far side: shoulder blade behind the cage, the far arm hanging back, the far leg behind.
  blob(ctx, B, old, [
    { k: 'ell', x: R.sFar.x - h * 0.012, y: R.sFar.y - h * 0.01, rx: h * 0.044, ry: h * 0.05, rot: 0.3 },
    ...limb(R.sFar.x, R.sFar.y, far[1].x, far[1].y, far[2].x, far[2].y, h * 0.023, h * 0.019, 31),
    { k: 'poly', pts: [
      far[2].x - h * 0.026, far[2].y - h * 0.012, far[2].x + h * 0.02, far[2].y - h * 0.014, far[2].x + h * 0.028, far[2].y + h * 0.012,
      far[2].x + h * 0.032, far[2].y + h * 0.056, far[2].x + h * 0.014, far[2].y + h * 0.03,
      far[2].x + h * 0.016, far[2].y + h * 0.078, far[2].x - h * 0.002, far[2].y + h * 0.032,
      far[2].x - h * 0.012, far[2].y + h * 0.076, far[2].x - h * 0.022, far[2].y + h * 0.03,
      far[2].x - h * 0.042, far[2].y + h * 0.058, far[2].x - h * 0.038, far[2].y + h * 0.008,
    ] },
  ], { h, formK: 0.5 });
  blob(ctx, B, old, [
    ...limb(R.legL[0].x, R.legL[0].y, R.legL[1].x, R.legL[1].y, R.legL[2].x, R.legL[2].y, h * 0.03, h * 0.025, 33),
    { k: 'poly', pts: [R.legL[2].x + h * 0.03, R.legL[2].y + h * 0.01, R.legL[2].x - h * 0.02, R.legL[2].y + h * 0.01, R.legL[2].x - h * 0.065, R.legL[2].y + h * 0.05, R.legL[2].x - h * 0.065, R.legL[2].y + h * 0.07, R.legL[2].x + h * 0.035, R.legL[2].y + h * 0.07] },
  ], { h, formK: 0.5 });
  gap(ctx, far[1].x, far[1].y, R.sFar.x, R.sFar.y, h * 0.023, murk);
  gap(ctx, far[2].x, far[2].y, far[1].x, far[1].y, h * 0.019, murk);
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
    { k: 'tube', pts: [cx + h * 0.006, D(0.034), cx + h * 0.01, D(0.138)], r0: h * 0.015, r1: h * 0.012 },
  ];
  // Four ribs with the same sag, so the dark between them stays open right across the chest:
  // widest at the middle of the cage and drawn in toward the waist. A finer pitch than this is
  // mud at combat size — 0.04h between ribs is under 2px at h = 40.
  const RW = [0.106, 0.126, 0.118, 0.082], RY = [0.03, 0.072, 0.112, 0.15];
  const rr = Math.max(h * 0.012, Math.min(1, h * 0.026) * 0.75);
  for (let i = 0; i < 4; i++) {
    const W = RW[i] * h, t = RY[i];
    bones.push({ k: 'tube', pts: [
      cx - W, D(t + 0.015), cx - W * 0.5, D(t + 0.028), cx + h * 0.008, D(t + 0.03),
      cx + W * 0.55, D(t + 0.026), cx + W * 1.04, D(t - 0.009),
    ], r0: rr, r1: rr });
  }
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
  pathEllipse(ctx, x - h * 0.05, D(0.286), h * 0.019, h * 0.014, 0.4); ctx.fill();
  pathEllipse(ctx, x + h * 0.066, D(0.286), h * 0.019, h * 0.014, -0.4); ctx.fill();
  ctx.strokeStyle = B.col(rgba(mix(bn, '#ffffff', 0.5), 0.5)); ctx.lineWidth = Math.max(1, 1.1 * u); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - h * 0.1, D(0.213)); ctx.quadraticCurveTo(x - h * 0.05, D(0.192), x - h * 0.006, D(0.21)); ctx.stroke();
  ctx.beginPath(); ctx.moveTo(x + h * 0.11, D(0.213)); ctx.quadraticCurveTo(x + h * 0.062, D(0.192), x + h * 0.02, D(0.21)); ctx.stroke();

  // One ragged scrap of rotted cloth off the far hip, in a dirty, washed-out tone.
  blob(ctx, B, rag, [{ k: 'curve', pts: [
    x - h * 0.125, D(0.215), x - h * 0.07, D(0.225), x - h * 0.075, D(0.295), x - h * 0.095, D(0.365), x - h * 0.085, D(0.435),
    x - h * 0.11, D(0.385), x - h * 0.125, D(0.475), x - h * 0.15, D(0.4), x - h * 0.18, D(0.445), x - h * 0.17, D(0.36), x - h * 0.165, D(0.255),
  ], wobble: 0.05, seed: 5, sub: 2 }], { h, tex: 'folds', seed: 5, amount: 0.5, formK: 0.35, spread: 0.7 });
  ctx.strokeStyle = B.col(leather); ctx.lineWidth = Math.max(1, 1.7 * u); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(R.sNear.x - h * 0.012, R.sNear.y - h * 0.02); ctx.quadraticCurveTo(cx, D(0.09), x - h * 0.08, D(0.215)); ctx.stroke();

  // The skull, tipped and turned a little off the spine, hung forward on the neck.
  skull(ctx, hx, hy, hr * 0.94, 0.16, bn, old, h, jd, murk);
  void p.light;
}

function knight(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const u = h / 100, X = (v: number) => x + v * u, Y = (v: number) => y + v * u;
  // The plate is the tint taken several steps down and cool, so it never reads as bone.
  const steel = mix(p.dark, '#303c4a', 0.52);
  const steelD = mix(steel, '#10151c', 0.42);
  const steelL = mix(steel, '#e4eef8', 0.3);
  const bn = shade('#f0e7d2', p.tone), old = shade('#d6cbb2', p.tone);
  const murk = mix(old, INK, 0.7);
  const cloth = shade('#5e2832', p.tone), plume = shade('#7a2a34', p.tone), leather = shade('#4a3424', p.tone);
  const blue = '#8ad0ff', pulse = 0.5 + 0.5 * Math.sin(p.frame / 8);
  const sw = p.breathe * 0.7, br = p.breathe * 0.5;
  groundShadow(ctx, x, y + 1, h * 0.62);

  // The warhammer's haft, set before the arm so the gauntlet closes over it.
  const h0x = X(19 + sw * 0.4), h0y = Y(-10), h1x = X(28 + sw * 0.6), h1y = Y(-90);
  const hdx = h1x - h0x, hdy = h1y - h0y, hL = Math.hypot(hdx, hdy), hex2 = hdx / hL, hey = hdy / hL;
  const pt = (t: number, s: number): [number, number] => [h0x + hex2 * hL * t - hey * s * u, h0y + hey * hL * t + hex2 * s * u];
  const nkx = X(22.8 + sw * 0.5), nky = Y(-40.5);   // the near hand on the haft, on the frame

  // The bones the plate leaves bare: the neck, both elbows, both knees. Each is its own small
  // object, lit on its own, so bone stays several steps brighter than the steel around it.
  glossTaper(ctx, B, X(3.2 + sw), Y(-81), X(2 + sw), Y(-70), 3.0 * u, 3.3 * u, bn, { h });
  for (let i = 0; i < 2; i++) softLine(ctx, B, [X(0.4 + sw), Y(-73.5 - i * 3), X(4.6 + sw), Y(-73.8 - i * 3)], murk, Math.max(1, 0.9 * u), 0.55);
  glossBall(ctx, B, X(23.1 + sw * 0.8), Y(-56.5), 3.4 * u, bn, { h });
  glossBall(ctx, B, X(-29.5 + sw * 0.8), Y(-60.3), 3.2 * u, old, { h });
  glossBall(ctx, B, X(10), Y(-28.5), 3.7 * u, bn, { h });
  glossBall(ctx, B, X(-11), Y(-28.5), 3.4 * u, old, { h });
  gap(ctx, X(23.1 + sw * 0.8), Y(-56.5), X(17.4 + sw), Y(-74.1), 2.8 * u, murk, 0.55);
  gap(ctx, X(-29.5 + sw * 0.8), Y(-60.3), X(-13.8 + sw), Y(-70.1), 2.6 * u, murk, 0.55);
  gap(ctx, X(10), Y(-28.5), X(8), Y(-50), 3.2 * u, murk, 0.55);
  gap(ctx, X(-11), Y(-28.5), X(-9), Y(-50), 3.0 * u, murk, 0.55);

  // The far side plate: darker still, behind. Cuisse, greave and sabaton; upper arm and vambrace.
  blob(ctx, B, steelD, [
    { k: 'cap', x0: X(-8), y0: Y(-50), x1: X(-10.5), y1: Y(-32.5), r0: 4.4 * u, r1: 3.6 * u },
    { k: 'cap', x0: X(-11.5), y0: Y(-23), x1: X(-12.5), y1: Y(-9), r0: 3.6 * u, r1: 3.2 * u },
    { k: 'curve', pts: [X(-18), Y(-6), X(-11), Y(-7.5), X(-7.5), Y(-4.5), X(-9), Y(-2.2), X(-19.5), Y(-2.5)], wobble: 0.04, seed: 12, sub: 2 },
    { k: 'cap', x0: X(-13.8 + sw), y0: Y(-70.1), x1: X(-28.6 + sw * 0.8), y1: Y(-61.2), r0: 3.8 * u, r1: 3.2 * u },
    { k: 'cap', x0: X(-29.5 + sw * 0.8), y0: Y(-59.8), x1: X(-23.5 + sw * 0.6), y1: Y(-45.5), r0: 3.2 * u, r1: 3 * u },
  ], { h, formK: 0.45 });

  // The shield on the far forearm: battered plate with a faded device.
  const shx = X(-24.7 + sw * 0.6), shy = Y(-48.5);
  blob(ctx, B, steelD, [
    { k: 'curve', pts: [shx - 10 * u, shy - 15 * u, shx + 1 * u, shy - 16 * u, shx + 10.5 * u, shy - 13 * u, shx + 9 * u, shy - 1 * u, shx + 3 * u, shy + 12 * u, shx - 2 * u, shy + 16 * u, shx - 8 * u, shy + 9 * u, shx - 12 * u, shy - 3 * u], wobble: 0.02, seed: 13, sub: 2 },
  ], { h, formK: 0.5, gloss: 0.2, tex: 'cracks', seed: 14, amount: 0.45, spread: 0.8 });
  ctx.fillStyle = B.col(rgba(mix(steelL, '#e8d8a0', 0.55), 0.4));
  ctx.beginPath(); ctx.moveTo(shx - 7 * u, shy - 9 * u); ctx.lineTo(shx, shy - 3 * u); ctx.lineTo(shx + 7 * u, shy - 9 * u); ctx.lineTo(shx + 7 * u, shy - 4 * u); ctx.lineTo(shx, shy + 3 * u); ctx.lineTo(shx - 7 * u, shy - 4 * u); ctx.closePath(); ctx.fill();
  softLine(ctx, B, [shx - 8 * u, shy - 12 * u, shx + 8 * u, shy - 10.5 * u], steelD, Math.max(1, u), 0.4);
  ctx.strokeStyle = B.col(rgba(mix(steelL, '#ffffff', 0.5), 0.45)); ctx.lineWidth = 1; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(shx - 9 * u, shy + 2 * u); ctx.lineTo(shx - 3 * u, shy + 9 * u); ctx.moveTo(shx + 4 * u, shy - 12 * u); ctx.lineTo(shx + 8 * u, shy - 7 * u); ctx.stroke();

  // The broken plume, its stump under the helm.
  blob(ctx, B, plume, [
    { k: 'curve', pts: [X(0.5 + sw), Y(-94), X(2.5 + sw), Y(-100), X(7 + sw), Y(-98.5), X(10.5 + sw), Y(-95.5), X(13 + sw), Y(-90.5), X(9.5 + sw), Y(-92.5), X(6 + sw), Y(-93)], wobble: 0.06, spiky: 0.14, seed: 9, sub: 2 },
  ], { h, formK: 0.4, spread: 0.7 });

  // The near plate: greave and cuisse, fauld, breastplate, near arm and gauntlet cuff. One dented mass.
  const cy = Y(-58.5 - br), cx = X(1 + sw);
  const plate: Part[] = [
    { k: 'cap', x0: X(8), y0: Y(-50), x1: X(9.5), y1: Y(-32.5), r0: 4.6 * u, r1: 3.8 * u },
    { k: 'cap', x0: X(10.5), y0: Y(-23), x1: X(11.5), y1: Y(-9), r0: 3.8 * u, r1: 3.3 * u },
    { k: 'curve', pts: [X(6.5), Y(-6), X(13), Y(-7.5), X(19), Y(-4.5), X(18), Y(-2.2), X(8), Y(-2.5)], wobble: 0.04, seed: 15, sub: 2 },
    { k: 'poly', pts: [X(-14 + sw * 0.5), Y(-51), X(15 + sw * 0.5), Y(-51), X(17), Y(-41), X(9), Y(-38.5), X(-9), Y(-38.5), X(-16), Y(-41)] },
    { k: 'curve', pts: [cx - 15.5 * u, cy - 13.5 * u, cx - 5 * u, cy - 15.5 * u, cx + 5 * u, cy - 15.5 * u, cx + 15.5 * u, cy - 13.5 * u, cx + 17.5 * u, cy - 2 * u, cx + 13 * u, cy + 11 * u, cx + 1 * u, cy + 14 * u, cx - 12 * u, cy + 11 * u, cx - 17 * u, cy - 2 * u], wobble: 0.025, seed: 11, sub: 2, gloss: 0.22 },
    { k: 'cap', x0: X(17.4 + sw), y0: Y(-74.1), x1: X(22.6 + sw * 0.8), y1: Y(-58), r0: 4 * u, r1: 3.4 * u },
    { k: 'cap', x0: X(23.1 + sw * 0.8), y0: Y(-55.5), x1: nkx, y1: nky + 3 * u, r0: 3.4 * u, r1: 3.6 * u },
    { k: 'cap', x0: X(-24.5 + sw * 0.6), y0: Y(-45.5), x1: X(-23 + sw * 0.6), y1: Y(-42), r0: 3.2 * u, r1: 3.5 * u },
  ];
  blob(ctx, B, steel, plate, { h, tex: 'cracks', seed: 20, amount: 0.9, formK: 0.55, gloss: 0.08, creases: [
    { x0: cx - 14 * u, y0: cy - 5 * u, x1: cx - 8 * u, y1: cy - 12 * u, r: 1.6 * u, a: 0.35 },
    { x0: cx + 15 * u, y0: cy - 5 * u, x1: cx + 9 * u, y1: cy - 12 * u, r: 1.6 * u, a: 0.35 },
    { x0: cx - 12 * u, y0: cy + 9 * u, x1: cx + 13 * u, y1: cy + 9 * u, r: 1.4 * u, a: 0.4 },
    { x0: cx - 1 * u, y0: cy - 12 * u, x1: cx - 2 * u, y1: cy + 8 * u, r: 1.2 * u, a: 0.22 },
    { x0: cx + 4 * u, y0: cy - 6 * u, x1: cx + 9 * u, y1: cy - 3 * u, r: 2.2 * u, a: 0.4 },
    { x0: cx - 9 * u, y0: cy + 2 * u, x1: cx - 5 * u, y1: cy + 5 * u, r: 1.8 * u, a: 0.35 },
  ] });
  // Scuffs and scratches across the breastplate, and the lit ridge down its centre.
  ctx.strokeStyle = B.col(rgba(mix(steelL, '#ffffff', 0.45), 0.5)); ctx.lineWidth = 1; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(cx - 0.5 * u, cy - 12 * u); ctx.quadraticCurveTo(cx - 3 * u, cy - 2 * u, cx - 1.5 * u, cy + 9 * u); ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 3 * u, cy - 8 * u); ctx.lineTo(cx + 10 * u, cy - 4.5 * u);
  ctx.moveTo(cx - 11 * u, cy + 1 * u); ctx.lineTo(cx - 5.5 * u, cy + 5.5 * u);
  ctx.moveTo(cx + 6 * u, cy + 4 * u); ctx.lineTo(cx + 11 * u, cy + 1 * u);
  ctx.moveTo(X(11), Y(-44)); ctx.lineTo(X(14), Y(-41));
  ctx.stroke();

  // The pauldrons: their own plates over the shoulders.
  blob(ctx, B, steel, [
    { k: 'curve', pts: ring(cx - 18 * u, cy - 10.5 * u, 7 * u, 6.2 * u, 9), wobble: 0.05, seed: 18, sub: 2, gloss: 0.18 },
    { k: 'curve', pts: ring(cx + 19 * u, cy - 10.5 * u, 7.6 * u, 6.8 * u, 9), wobble: 0.05, seed: 19, sub: 2, gloss: 0.22 },
  ], { h, formK: 0.6, creases: [
    { x0: cx - 22 * u, y0: cy - 7 * u, x1: cx - 13 * u, y1: cy - 6 * u, r: 1.2 * u, a: 0.35 },
    { x0: cx + 14 * u, y0: cy - 6 * u, x1: cx + 24 * u, y1: cy - 7 * u, r: 1.2 * u, a: 0.35 },
  ] });

  // The belt, and the tattered tabard hung over the hip plates: long on one side, ragged at the hem.
  ctx.strokeStyle = B.col(leather); ctx.lineWidth = Math.max(1, 2.4 * u); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(X(-15 + sw * 0.5), Y(-49)); ctx.quadraticCurveTo(X(1 + sw * 0.5), Y(-46.5), X(16 + sw * 0.5), Y(-49)); ctx.stroke();
  blob(ctx, B, cloth, [{ k: 'curve', pts: [
    X(-14.5 + sw * 0.5), Y(-49.5), X(14 + sw * 0.5), Y(-49.5), X(15.5), Y(-41), X(13), Y(-35),
    X(10.5), Y(-39.5), X(7.5), Y(-33), X(4.5), Y(-38), X(1.5), Y(-30), X(-2), Y(-35.5), X(-5), Y(-26),
    X(-8), Y(-32), X(-12), Y(-23), X(-15), Y(-17), X(-17.5), Y(-27), X(-16.5), Y(-40),
  ], wobble: 0.04, seed: 22, sub: 2 }], { h, tex: 'folds', seed: 22, amount: 0.8, formK: 0.4, spread: 0.7 });

  // The helm: a lumpy dome with a flared neck guard and a dark visor slit, lit from inside.
  const hx = X(3 + sw), hy = Y(-87.5);
  blob(ctx, B, steel, [
    { k: 'curve', pts: ring(hx, hy - 0.5 * u, 9.8 * u, 10 * u, 11, 0.1), wobble: 0.03, seed: 23, sub: 2, gloss: 0.3 },
    { k: 'ell', x: hx + 0.5 * u, y: hy + 6.4 * u, rx: 8.8 * u, ry: 3 * u },
  ], { h, formK: 0.5, creases: [{ x0: hx - 7.5 * u, y0: hy + 4.4 * u, x1: hx + 8 * u, y1: hy + 4.4 * u, r: 1.2 * u, a: 0.4 }] });
  ctx.fillStyle = B.col(INK);
  ctx.beginPath(); ctx.moveTo(hx - 7 * u, hy - 1.6 * u); ctx.lineTo(hx + 8.5 * u, hy - 2 * u); ctx.lineTo(hx + 8 * u, hy + 1.6 * u); ctx.lineTo(hx - 6.5 * u, hy + 1.8 * u); ctx.closePath(); ctx.fill();
  ctx.fillRect(Math.round(hx - 0.7 * u), Math.round(hy + 1.6 * u), Math.max(1, Math.round(1.4 * u)), Math.round(4.5 * u));
  ctx.strokeStyle = B.col(rgba(mix(steelL, '#ffffff', 0.45), 0.5)); ctx.lineWidth = 1;
  ctx.beginPath(); ctx.moveTo(hx - 0.5 * u, hy - 10 * u); ctx.quadraticCurveTo(hx - 2 * u, hy - 6 * u, hx - 1 * u, hy - 2.5 * u); ctx.moveTo(hx + 4 * u, hy - 8 * u); ctx.lineTo(hx + 7.5 * u, hy - 5 * u); ctx.stroke();
  glow(ctx, B, hx - 3.6 * u, hy, 5.5 * u, blue, 0.35 + 0.3 * pulse, '#d8f0ff');
  glow(ctx, B, hx + 3.8 * u, hy - 0.2 * u, 6 * u, blue, 0.4 + 0.3 * pulse, '#d8f0ff');
  eye(ctx, hx - 3.6 * u, hy, 1.2 * u, mix(blue, '#ffffff', 0.4 + 0.3 * pulse), false);
  eye(ctx, hx + 3.8 * u, hy - 0.2 * u, 1.35 * u, mix(blue, '#ffffff', 0.4 + 0.3 * pulse), false);

  // The warhammer's head: a blocky steel mass, a flat striking face one side and a spike the other,
  // collared onto the haft with two straps.
  glossTaper(ctx, B, h0x, h0y, h1x, h1y, 1.6 * u, 1.4 * u, leather, { h });
  softLine(ctx, B, [...pt(0.726, -1.9), ...pt(0.726, 1.9)], leather, Math.max(1, 1.3 * u), 0.85);
  softLine(ctx, B, [...pt(0.694, -1.8), ...pt(0.694, 1.8)], leather, Math.max(1, 1.1 * u), 0.75);
  glossPoly(ctx, B, [...pt(0.752, -3.6), ...pt(0.752, 3.6), ...pt(0.832, 3.6), ...pt(0.832, -3.6)], steelD, { h, gloss: 0.15 });
  glossPoly(ctx, B, [
    ...pt(0.858, -2.6), ...pt(0.889, -8.6), ...pt(0.921, -2.6),
    ...pt(0.962, -2.6), ...pt(0.962, 5.6), ...pt(0.944, 5.6), ...pt(0.944, 8.2), ...pt(0.836, 8.2),
    ...pt(0.836, 5.6), ...pt(0.817, 5.6), ...pt(0.817, -2.6),
  ], steel, { h, gloss: 0.28, spread: 0.55 });
  softLine(ctx, B, [...pt(0.828, 5.7), ...pt(0.952, 5.7)], steelD, Math.max(1, 1.2 * u), 0.65);
  softLine(ctx, B, [...pt(0.83, -2.4), ...pt(0.95, -2.4)], steelD, Math.max(1, u), 0.5);
  ctx.strokeStyle = B.col(rgba(mix(steelL, '#ffffff', 0.55), 0.55)); ctx.lineWidth = 1; ctx.lineCap = 'round';
  ctx.beginPath();
  ctx.moveTo(...pt(0.845, 7.7)); ctx.lineTo(...pt(0.936, 7.7));
  ctx.moveTo(...pt(0.836, -2.2)); ctx.lineTo(...pt(0.836, 5.0));
  ctx.moveTo(...pt(0.878, -3.0)); ctx.lineTo(...pt(0.888, -8.0));
  ctx.stroke();

  // The gauntlet: bone fingers closed over the haft.
  blob(ctx, B, bn, [
    { k: 'cap', x0: nkx - 2.8 * u, y0: nky - 2.4 * u, x1: nkx + 3.4 * u, y1: nky - 2.1 * u, r0: 1.4 * u, r1: 1.2 * u },
    { k: 'cap', x0: nkx - 3.2 * u, y0: nky + 0.6 * u, x1: nkx + 3.6 * u, y1: nky + 0.8 * u, r0: 1.5 * u, r1: 1.3 * u },
    { k: 'cap', x0: nkx - 2.6 * u, y0: nky + 3.4 * u, x1: nkx + 3 * u, y1: nky + 3.5 * u, r0: 1.3 * u, r1: 1.1 * u },
  ], { h, formK: 0.6 });
  softLine(ctx, B, [nkx - 3.2 * u, nky - 0.8 * u, nkx + 3.6 * u, nky - 0.6 * u], murk, Math.max(1, 0.9 * u), 0.6);
  softLine(ctx, B, [nkx - 3 * u, nky + 2.1 * u, nkx + 3.4 * u, nky + 2.2 * u], murk, Math.max(1, 0.9 * u), 0.6);
}
