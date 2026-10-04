// The risen dead: a skeleton, a bone knight, a ghoul, a drowned man and the Queen's barrow guard
// and her captain.
// The ghoul and the drowned man still carry flesh, which is the whole of why they are here and not
// in the wraith module -- a wraith is a spirit in a shroud, and these two are bodies. Painted after
// the Xeen look. Bone is the one material whose parts are honestly separate objects, so each bone
// is its own small rendered mass (a knobbed, waisted shaft, no flat tones), the joints are dark
// gaps rather than seams, the skull is a cranium with a hanging jaw, and the ribcage is a real cage
// laid over a hollow so the gaps between the ribs read as space. The knight is the same bones
// inside dull steel plate, several steps darker and cooler than bone, with raw bone at the neck,
// elbows, knees and hands. The barrow guard keeps less plate and wears the Queen's livery over it,
// in her blue and gold; her captain wears it under a cloak of her blue gone nearly black. The
// Drowned Temples' priests are bones in sodden robes with the drowned god's collar at the throat,
// the jaw open on the count; their Choirmaster is the same, taller and fuller, beating it on a bell.
// The temples' own drowned man is their congregation: heavier, bowed, salt-crusted, hugging the
// stone it roped to its neck. Cairnmoor's bog body is the dead the peat has kept, leather over bone
// with a rope still round its neck; the Cairn King is the oldest of them, crowned, on his seat.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, groundShadow, eye } from './common.ts';
import { blob, glow, patch, softLine, glossPoly, glossTaper, appendCurve, lumpy } from './gloss.ts';
import type { Crease, Part } from './gloss.ts';
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
export const KINDS: readonly MonsterSprite[] = ['skeleton', 'bone_knight', 'ghoul', 'drowned', 'barrow_guard', 'barrow_captain', 'temple_drowned', 'drowned_chanter', 'choirmaster', 'bog_body', 'cairn_king'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  if (kind === 'bog_body') bogBody(ctx, x, y, h, p);
  else if (kind === 'cairn_king') cairnKing(ctx, x, y, h, p);
  else if (kind === 'bone_knight') knight(ctx, x, y, h, p);
  else if (kind === 'ghoul') ghoul(ctx, x, y, h, p);
  else if (kind === 'drowned') drowned(ctx, x, y, h, p);
  else if (kind === 'temple_drowned') templeDrowned(ctx, x, y, h, p);
  else if (kind === 'barrow_guard') guard(ctx, x, y, h, p);
  else if (kind === 'barrow_captain') captain(ctx, x, y, h, p);
  else if (kind === 'drowned_chanter' || kind === 'choirmaster') priest(ctx, x, y, h, p, kind === 'choirmaster');
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

// ------------------------------------------------------------------ the ghoul ----
/**
 * The ghoul: a corpse that still has its flesh, which is what separates it from the two above. It
 * is drawn as skin stretched over the same frame rather than as bare bone -- the ribs and the hip
 * crests show THROUGH as creases, not as separate masses -- and it goes on its knuckles, hunched
 * so far forward that its head sits out in front of its shoulders instead of on top of them.
 */
function ghoul(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: -0.03, hipTilt: 0.026, turn: 0.03, near: [0.1, 0.19, 0.21], far: [-0.096, -0.15, -0.18], toe: [0.9, -0.7], lift: [0, 0.04] }, BONE);
  const { sy } = R;
  const hide = p.base, deep = shade(mix(p.dark, '#1a2418', 0.45), 1), nail = shade('#cfc6ae', p.tone);
  const sw = p.breathe * h * 0.008;
  const D = (v: number) => sy + v * h;
  const cx = x + h * 0.02 + sw;
  // Hunched: the head is carried forward and low, out past the shoulder line.
  const hx = x + h * 0.2 + sw, hy = sy - h * 0.052, hr = h * 0.075;
  groundShadow(ctx, x + h * 0.03, y + 1, h * 0.62);

  // The far arm, long enough to reach the floor: it takes weight on its knuckles.
  const farEl = { x: x - h * 0.23, y: D(0.2) }, farWr = { x: x - h * 0.2, y: D(0.44) };
  blob(ctx, B, shade(hide, 0.74), [
    ...limb(R.sFar.x, R.sFar.y, farEl.x, farEl.y, farWr.x, farWr.y, h * 0.044, h * 0.03, 71),
  ], { h, formK: 0.5, spread: 0.7 });
  // Legs: deeply bent, the heels off the ground.
  blob(ctx, B, shade(hide, 0.86), [
    ...limb(x - h * 0.07, D(0.28), x - h * 0.27, D(0.46), x - h * 0.145, D(0.71), h * 0.058, h * 0.034, 72),
    ...limb(x + h * 0.08, D(0.28), x + h * 0.315, D(0.44), x + h * 0.185, D(0.71), h * 0.064, h * 0.036, 73),
  ], { h, formK: 0.5, spread: 0.72 });
  blob(ctx, B, shade(hide, 0.8), [
    { k: 'curve', pts: [x - h * 0.21, y - h * 0.012, x - h * 0.13, y - h * 0.062, x - h * 0.07, y - h * 0.02, x - h * 0.18, y + h * 0.008], wobble: 0.06, seed: 74, sub: 2 },
    { k: 'curve', pts: [x + h * 0.13, y - h * 0.012, x + h * 0.21, y - h * 0.066, x + h * 0.28, y - h * 0.02, x + h * 0.15, y + h * 0.008], wobble: 0.06, seed: 75, sub: 2 },
  ], { h, formK: 0.45, spread: 0.7 });

  // The trunk: a gaunt barrel with the ribs and the hip crests showing through it.
  blob(ctx, B, hide, [
    // the neck, carrying the head out and down in front of the shoulder line
    { k: 'cap', x0: cx + h * 0.075, y0: D(0.0), x1: hx - hr * 0.5, y1: hy + hr * 0.55, r0: h * 0.044, r1: h * 0.038 },
    { k: 'curve', pts: [
      cx - h * 0.126, D(0.015), cx - h * 0.05, D(-0.036), cx + h * 0.06, D(-0.042), cx + h * 0.142, D(0.012),
      cx + h * 0.118, D(0.085), cx + h * 0.086, D(0.17), cx + h * 0.112, D(0.245), cx + h * 0.122, D(0.31),
      cx + h * 0.02, D(0.336), cx - h * 0.098, D(0.305), cx - h * 0.088, D(0.235), cx - h * 0.066, D(0.165),
      cx - h * 0.096, D(0.08),
    ], wobble: 0.03, seed: 76, sub: 3 },
    // the shoulder caps, so the arms grow out of the body instead of beginning in mid air
    { k: 'ball', x: R.sNear.x - h * 0.01, y: R.sNear.y + h * 0.012, r: h * 0.054 },
    { k: 'ball', x: R.sFar.x + h * 0.01, y: R.sFar.y + h * 0.014, r: h * 0.048 },
    // and the pelvis, bridging the trunk to the legs
    { k: 'ell', x: cx + h * 0.006, y: D(0.3), rx: h * 0.116, ry: h * 0.062, rot: 0.04 },
  ], { h, formK: 0.55, spread: 0.8, creases: [
    { x0: cx - h * 0.09, y0: D(0.19), x1: cx + h * 0.1, y1: D(0.2), r: h * 0.03, a: 0.42 },
  ] });
  // The ribs, as creases in the skin rather than bones of their own.
  if (!B.override) for (let i = 0; i < 4; i++) {
    const v = 0.04 + i * 0.038, w = h * (0.092 - i * 0.01), sag = h * (0.022 + i * 0.004);
    softLine(ctx, B, [cx - w, D(v), cx - w * 0.2, D(v + sag / h), cx + w * 0.62, D(v + sag / h * 0.86), cx + w, D(v + 0.004)], hide, Math.max(1, h * 0.011), 0.38);
    softLine(ctx, B, [cx - w * 0.9, D(v - 0.011), cx + w * 0.2, D(v + sag / h * 0.5)], shade(hide, 1.2), Math.max(1, h * 0.007), 0.24);
  }
  // The hip crests, showing through the same way.
  if (!B.override) for (const s2 of [-1, 1]) {
    softLine(ctx, B, [cx + s2 * h * 0.03, D(0.262), cx + s2 * h * 0.092, D(0.288)], hide, Math.max(1, h * 0.012), 0.34);
  }
  // The near arm over the trunk, and the clawed hands.
  const nearEl = { x: x + h * 0.27, y: D(0.19) }, nearWr = { x: x + h * 0.245, y: D(0.44) };
  blob(ctx, B, shade(hide, 0.96), [
    ...limb(R.sNear.x, R.sNear.y, nearEl.x, nearEl.y, nearWr.x, nearWr.y, h * 0.048, h * 0.032, 77),
  ], { h, formK: 0.5, spread: 0.7 });
  for (const [wx, wy, s, k] of [[farWr.x, farWr.y, -1, 0.9], [nearWr.x, nearWr.y, 1, 1]] as const) {
    const parts: Part[] = [{ k: 'ell', x: wx, y: wy + h * 0.016, rx: h * 0.028 * k, ry: h * 0.024 * k, rot: 0.2 * s }];
    for (let i = 0; i < 4; i++) {
      const a = Math.PI / 2 - s * (i - 1.4) * 0.34, l = h * (0.058 + (i === 1 ? 0.014 : 0)) * k;
      const bx = wx + s * (i - 1.4) * h * 0.016, by = wy + h * 0.024;
      parts.push({ k: 'tube', pts: [bx, by, bx + Math.cos(a) * l * 0.6, by + Math.sin(a) * l * 0.6,
        bx + Math.cos(a) * l * 0.6 + Math.cos(a + s * 0.8) * l * 0.5, by + Math.sin(a) * l * 0.6 + Math.sin(a + s * 0.8) * l * 0.5],
        r0: h * 0.012 * k, r1: h * 0.004, wobble: 0.05, seed: 80 + i });
    }
    blob(ctx, B, shade(hide, s > 0 ? 1.04 : 0.82), parts, { h, formK: 0.5, spread: 0.75 });
  }

  // The head: a skull under skin, carried out in front. Wide jaw, sunken sockets, no lips left.
  blob(ctx, B, shade(hide, 1.06), [
    { k: 'curve', pts: [
      hx - hr * 1.0, hy - hr * 0.1, hx - hr * 0.86, hy - hr * 0.86, hx - hr * 0.1, hy - hr * 1.16,
      hx + hr * 0.7, hy - hr * 0.96, hx + hr * 1.02, hy - hr * 0.22, hx + hr * 0.98, hy + hr * 0.54,
      hx + hr * 0.5, hy + hr * 1.0, hx - hr * 0.36, hy + hr * 0.98, hx - hr * 0.92, hy + hr * 0.48,
    ], wobble: 0.04, seed: 82, sub: 3 },
  ], { h, formK: 0.6, spread: 0.8, creases: [
    { x0: hx - hr * 0.7, y0: hy - hr * 0.1, x1: hx + hr * 0.8, y1: hy - hr * 0.16, r: hr * 0.2, a: 0.3 },
  ] });
  if (!B.override) {
    // Sockets: real holes, dark enough to be holes, with a point of light far back in each.
    ctx.fillStyle = B.col(shade('#140f12', Math.max(0.5, p.tone)));
    for (const s of [-1, 1]) {
      ctx.beginPath();
      ctx.ellipse(hx + s * hr * 0.42, hy - hr * 0.2, hr * 0.28, hr * 0.24, s * 0.3, 0, Math.PI * 2);
      ctx.fill();
    }
    glow(ctx, B, hx - hr * 0.42, hy - hr * 0.2, hr * 0.4, '#d8e8a0', 0.3, '#f4ffd0');
    glow(ctx, B, hx + hr * 0.42, hy - hr * 0.2, hr * 0.42, '#d8e8a0', 0.34, '#f4ffd0');
    eye(ctx, hx - hr * 0.42, hy - hr * 0.18, Math.max(0.8, hr * 0.09), shade('#e8f4c0', p.tone), false);
    eye(ctx, hx + hr * 0.44, hy - hr * 0.18, Math.max(0.8, hr * 0.1), shade('#e8f4c0', p.tone), false);
    // The mouth: a wide dark gape with teeth top and bottom, drawn as a gap in the face.
    ctx.fillStyle = B.col(deep);
    ctx.beginPath();
    ctx.moveTo(hx - hr * 0.68, hy + hr * 0.36);
    ctx.quadraticCurveTo(hx + hr * 0.1, hy + hr * 0.24, hx + hr * 0.84, hy + hr * 0.42);
    ctx.quadraticCurveTo(hx + hr * 0.2, hy + hr * 1.02, hx - hr * 0.68, hy + hr * 0.36);
    ctx.closePath(); ctx.fill();
    ctx.fillStyle = B.col(nail);
    for (let i = 0; i < 6; i++) {
      const t = i / 5, tx = hx + hr * (-0.58 + t * 1.3), ty = hy + hr * (0.4 + t * 0.06);
      const w = hr * (0.1 - Math.abs(t - 0.5) * 0.05);
      ctx.beginPath(); ctx.moveTo(tx - w, ty); ctx.lineTo(tx + w, ty); ctx.lineTo(tx, ty + hr * 0.24); ctx.closePath(); ctx.fill();
      if (i % 2 === 0) { ctx.beginPath(); ctx.moveTo(tx - w, ty + hr * 0.5); ctx.lineTo(tx + w, ty + hr * 0.5); ctx.lineTo(tx, ty + hr * 0.26); ctx.closePath(); ctx.fill(); }
    }
  }
  void p.light;
}

// ------------------------------------------------------------------ the drowned ----
/**
 * The drowned man: a body that has been in the water a long while, which is a different kind of
 * dead from the ghoul's. Nothing about him is gaunt -- he is swollen, and he hangs rather than
 * crouches: head lolled over, shoulders slack, arms straight down with the hands open. Weed in his
 * hair and off his elbows, the rags of what he went in wearing, and water still coming off him.
 */
function drowned(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: 0.022, hipTilt: -0.012, turn: -0.014, near: [0.078, 0.092, 0.11], far: [-0.086, -0.108, -0.132], toe: [0.5, -0.8] }, BONE);
  const { sy } = R;
  const flesh = p.base, deep = shade(mix(p.dark, '#0e1c1e', 0.5), 1);
  const weed = shade(mix(p.dark, '#2a3a1c', 0.55), 1);
  const rag = shade(mix(p.dark, '#3a3e34', 0.5), 1);
  const roll = Math.sin(p.frame / 29) * h * 0.006;
  const D = (v: number) => sy + v * h;
  const cx = x - h * 0.004 + roll;
  // The head lolls: over to the far side and tipped back, which is what a slack neck does.
  const hx = x - h * 0.072 + roll * 1.6, hy = sy - h * 0.128, hr = h * 0.076;
  groundShadow(ctx, x, y + 1, h * 0.66);

  const farEl = { x: x - h * 0.2, y: D(0.21) }, farWr = { x: x - h * 0.216, y: D(0.44) };
  blob(ctx, B, shade(flesh, 0.76), [
    ...limb(R.sFar.x, R.sFar.y, farEl.x, farEl.y, farWr.x, farWr.y, h * 0.05, h * 0.034, 91),
  ], { h, formK: 0.5, spread: 0.7 });
  blob(ctx, B, shade(flesh, 0.88), [
    ...limb(x - h * 0.078, D(0.3), x - h * 0.116, D(0.5), x - h * 0.132, D(0.72), h * 0.064, h * 0.042, 92),
    ...limb(x + h * 0.08, D(0.3), x + h * 0.106, D(0.5), x + h * 0.116, D(0.72), h * 0.068, h * 0.044, 93),
  ], { h, formK: 0.5, spread: 0.72 });
  blob(ctx, B, shade(flesh, 0.8), [
    { k: 'curve', pts: [x - h * 0.19, y - h * 0.01, x - h * 0.12, y - h * 0.058, x - h * 0.06, y - h * 0.018, x - h * 0.16, y + h * 0.008], wobble: 0.06, seed: 94, sub: 2 },
    { k: 'curve', pts: [x + h * 0.07, y - h * 0.014, x + h * 0.13, y - h * 0.06, x + h * 0.2, y - h * 0.016, x + h * 0.09, y + h * 0.008], wobble: 0.06, seed: 95, sub: 2 },
  ], { h, formK: 0.45, spread: 0.7 });

  // The trunk: swollen, widest at the belly, with the neck slack and off to one side.
  blob(ctx, B, flesh, [
    { k: 'cap', x0: cx - h * 0.01, y0: D(-0.004), x1: hx + hr * 0.42, y1: hy + hr * 0.6, r0: h * 0.05, r1: h * 0.044 },
    { k: 'curve', pts: [
      cx - h * 0.136, D(0.02), cx - h * 0.05, D(-0.036), cx + h * 0.07, D(-0.032), cx + h * 0.144, D(0.026),
      cx + h * 0.156, D(0.13), cx + h * 0.148, D(0.235), cx + h * 0.124, D(0.32),
      cx + h * 0.016, D(0.348), cx - h * 0.112, D(0.318), cx - h * 0.14, D(0.225), cx - h * 0.148, D(0.12),
    ], wobble: 0.04, seed: 96, sub: 3 },
    { k: 'ball', x: R.sNear.x - h * 0.012, y: R.sNear.y + h * 0.016, r: h * 0.058 },
    { k: 'ball', x: R.sFar.x + h * 0.012, y: R.sFar.y + h * 0.018, r: h * 0.052 },
    { k: 'ell', x: cx + h * 0.004, y: D(0.31), rx: h * 0.126, ry: h * 0.066, rot: -0.03 },
  ], { h, formK: 0.6, spread: 0.85, creases: [
    { x0: cx - h * 0.1, y0: D(0.21), x1: cx + h * 0.11, y1: D(0.215), r: h * 0.032, a: 0.34 },
    { x0: cx - h * 0.06, y0: D(0.06), x1: cx - h * 0.05, y1: D(0.2), r: h * 0.026, a: 0.24 },
  ] });
  const nearEl = { x: x + h * 0.214, y: D(0.2) }, nearWr = { x: x + h * 0.236, y: D(0.43) };
  blob(ctx, B, shade(flesh, 0.98), [
    ...limb(R.sNear.x, R.sNear.y, nearEl.x, nearEl.y, nearWr.x, nearWr.y, h * 0.054, h * 0.036, 97),
  ], { h, formK: 0.5, spread: 0.7 });
  // Slack open hands: the fingers hang, they do not reach.
  for (const [wx, wy, s, k] of [[farWr.x, farWr.y, -1, 0.92], [nearWr.x, nearWr.y, 1, 1]] as const) {
    const parts: Part[] = [{ k: 'ell', x: wx, y: wy + h * 0.018, rx: h * 0.03 * k, ry: h * 0.028 * k, rot: 0.1 * s }];
    for (let i = 0; i < 4; i++) {
      const bx = wx + s * (i - 1.4) * h * 0.017, by = wy + h * 0.03;
      const l = h * (0.05 + (i === 1 ? 0.01 : 0)) * k;
      parts.push({ k: 'tube', pts: [bx, by, bx + s * h * 0.004, by + l * 0.6, bx - s * h * 0.006, by + l], r0: h * 0.013 * k, r1: h * 0.007, wobble: 0.05, seed: 100 + i });
    }
    blob(ctx, B, shade(flesh, s > 0 ? 1.02 : 0.84), parts, { h, formK: 0.5, spread: 0.75 });
  }
  // What is left of his clothes: a shirt gone to rags across the chest and a skirt of it at the hip.
  blob(ctx, B, rag, [
    { k: 'curve', pts: [
      cx - h * 0.14, D(0.03), cx - h * 0.06, D(0.008), cx + h * 0.05, D(0.014), cx + h * 0.146, D(0.04),
      cx + h * 0.118, D(0.14), cx + h * 0.13, D(0.2), cx + h * 0.05, D(0.17), cx - h * 0.01, D(0.22),
      cx - h * 0.07, D(0.16), cx - h * 0.126, D(0.19), cx - h * 0.134, D(0.1),
    ], wobble: 0.08, spiky: 0.05, seed: 98, sub: 3 },
    { k: 'curve', pts: [
      cx - h * 0.132, D(0.27), cx - h * 0.02, D(0.252), cx + h * 0.128, D(0.274), cx + h * 0.112, D(0.4),
      cx + h * 0.05, D(0.352), cx - h * 0.006, D(0.43), cx - h * 0.072, D(0.35), cx - h * 0.126, D(0.39),
    ], wobble: 0.09, spiky: 0.06, seed: 99, sub: 3 },
  ], { h, formK: 0.5, spread: 0.7, tex: 'folds', seed: 98, amount: 0.5 });

  // The head: bloated and tipped back, the jaw slack. The face is meat, not bone.
  blob(ctx, B, shade(flesh, 1.05), [
    { k: 'curve', pts: [
      hx - hr * 1.0, hy - hr * 0.04, hx - hr * 0.8, hy - hr * 0.88, hx - hr * 0.02, hy - hr * 1.16,
      hx + hr * 0.78, hy - hr * 0.9, hx + hr * 1.0, hy - hr * 0.06, hx + hr * 0.86, hy + hr * 0.72,
      hx + hr * 0.24, hy + hr * 1.1, hx - hr * 0.48, hy + hr * 0.94,
    ], wobble: 0.045, seed: 101, sub: 3 },
  ], { h, formK: 0.6, spread: 0.8 });
  if (!B.override) {
    // Eyes gone white and blind, set in sockets the water has hollowed.
    ctx.fillStyle = B.col(deep);
    for (const s of [-1, 1]) {
      ctx.beginPath(); ctx.ellipse(hx + s * hr * 0.38, hy - hr * 0.18, hr * 0.26, hr * 0.2, s * 0.22, 0, Math.PI * 2); ctx.fill();
    }
    eye(ctx, hx - hr * 0.38, hy - hr * 0.16, Math.max(0.8, hr * 0.14), shade('#e4ece0', p.tone), false);
    eye(ctx, hx + hr * 0.38, hy - hr * 0.16, Math.max(0.8, hr * 0.14), shade('#e4ece0', p.tone), false);
    // The mouth hanging open, full of water rather than teeth.
    ctx.fillStyle = B.col(deep);
    ctx.beginPath();
    ctx.ellipse(hx + hr * 0.08, hy + hr * 0.54, hr * 0.32, hr * 0.28, 0.08, 0, Math.PI * 2);
    ctx.fill();
    softLine(ctx, B, [hx - hr * 0.6, hy + hr * 0.12, hx + hr * 0.62, hy + hr * 0.08], flesh, Math.max(1, h * 0.012), 0.3);
  }
  // Weed: off the crown, the far elbow and the hem, hanging straight down and heavy with water.
  const strands: Part[] = [];
  for (const [wx, wy, n, len] of [[hx - hr * 0.5, hy - hr * 0.9, 4, 0.2], [farEl.x - h * 0.02, farEl.y, 3, 0.16], [cx + h * 0.09, D(0.36), 3, 0.13]] as const) {
    for (let i = 0; i < n; i++) {
      const ox = wx + (i - (n - 1) / 2) * h * 0.026, l = h * len * (0.7 + ((i * 5) % 3) * 0.2);
      strands.push({ k: 'tube', pts: [ox, wy, ox + roll * 0.6 + h * 0.008, wy + l * 0.55, ox + roll * 1.4, wy + l], r0: h * 0.012, r1: h * 0.004, wobble: 0.14, seed: 110 + i });
    }
  }
  blob(ctx, B, weed, strands, { h, formK: 0.4, spread: 0.7 });
  // Water still running off him.
  if (!B.override) for (let i = 0; i < 4; i++) {
    const t = ((p.frame * 0.02 + i * 0.27) % 1);
    const dx2 = [hx + hr * 0.7, farWr.x, nearWr.x + h * 0.01, cx + h * 0.1][i];
    const dy2 = [hy + hr * 0.9, farWr.y + h * 0.05, nearWr.y + h * 0.05, D(0.42)][i];
    ctx.fillStyle = B.col(rgba(shade('#cfe4e0', p.tone), 0.5 * (1 - t)));
    ctx.beginPath(); ctx.ellipse(dx2, dy2 + t * h * 0.11, Math.max(0.6, h * 0.008), Math.max(0.8, h * 0.014), 0, 0, Math.PI * 2); ctx.fill();
  }
  void p.light;
}

/**
 * The temples' drowned man: one of the drowned god's congregation, who went down with the temple
 * and meant to. Where the Foreland's hangs slack with its head lolled back, this one stands planted
 * and squared, head bowed chin to chest, and hugs to its belly the ballast stone it roped to its own
 * neck, the knot hung with a scallop of the god's bronze. Salt and barnacles crust it, not weed.
 */
function templeDrowned(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const u = h / 100, X = (v: number) => x + v * u, Y = (v: number) => y + v * u;
  const lift = p.breathe * h * 0.006, BY = (v: number) => y + v * u - lift;
  const flesh = p.base, deep = shade(mix(p.dark, '#0e1c1e', 0.5), 1);
  const rag = shade(mix(p.dark, '#3a3e34', 0.5), 1);
  const salt = shade('#e6e2d4', p.tone), barn = shade('#bcb6a4', p.tone);
  const stone = shade('#7c7a72', p.tone), rope = shade('#5a4a34', p.tone);
  const gilt = shade(GILT, p.tone);
  const nod = Math.sin(p.frame / 37) * 0.6;                                     // the bowed head barely moves
  groundShadow(ctx, x, y + 1, h * 0.7);

  // ---- the legs, short and thick and set wide, the far one darker; flat heavy feet.
  blob(ctx, B, shade(flesh, 0.8), [
    ...limb(X(-9), Y(-42), X(-13), Y(-21), X(-14), Y(-3), 7 * u, 5.6 * u, 601),
    { k: 'ell', x: X(-16), y: Y(-1.6), rx: 6 * u, ry: 2.6 * u, rot: 0.05 },
  ], { h, formK: 0.5, spread: 0.72 });
  blob(ctx, B, shade(flesh, 0.92), [
    ...limb(X(9), Y(-42), X(13), Y(-21), X(14), Y(-3), 7.2 * u, 5.8 * u, 603),
    { k: 'ell', x: X(16), y: Y(-1.6), rx: 6.2 * u, ry: 2.6 * u, rot: -0.05 },
  ], { h, formK: 0.5, spread: 0.72 });
  // What is left of its clothes: a short rag at the hip, torn above the knee.
  blob(ctx, B, rag, [{ k: 'curve', pts: [
    X(-19), BY(-50), X(0), BY(-52), X(19), BY(-50), X(20), Y(-36), X(13), Y(-31), X(7), Y(-35),
    X(1), Y(-29), X(-5), Y(-34), X(-12), Y(-30), X(-20), Y(-35),
  ], wobble: 0.08, spiky: 0.05, seed: 605, sub: 3 }], { h, tex: 'folds', seed: 605, amount: 0.5, formK: 0.5, spread: 0.7 });

  // ---- the trunk: broad, the shoulders squared and hunched forward over the stone.
  blob(ctx, B, flesh, [
    { k: 'curve', pts: [
      X(-23), BY(-74), X(-12), BY(-81), X(0), BY(-82), X(12), BY(-81), X(23), BY(-74),
      X(22), BY(-60), X(19), BY(-46), X(0), BY(-43), X(-19), BY(-46), X(-22), BY(-60),
    ], wobble: 0.04, seed: 607, sub: 3 },
    { k: 'ball', x: X(-21), y: BY(-74), r: 8 * u },
    { k: 'ball', x: X(21), y: BY(-74), r: 8.4 * u },
  ], { h, formK: 0.6, spread: 0.85 });
  // The upper arms, down the flanks to the elbows at the stone's sides.
  blob(ctx, B, shade(flesh, 0.82), [shaft(X(-23), BY(-72), X(-26), BY(-55), 6 * u, 609)], { h, formK: 0.5, spread: 0.7 });
  blob(ctx, B, shade(flesh, 0.96), [shaft(X(23), BY(-72), X(26), BY(-55), 6.2 * u, 611)], { h, formK: 0.5, spread: 0.7 });

  // ---- the head, bowed chin to chest and sunk between the shoulders: the crown is what shows.
  const hx = X(0.5 + nod), hy = BY(-84), hr = 8.4 * u;
  blob(ctx, B, shade(flesh, 1.04), [{ k: 'curve', pts: [
    hx - hr, hy + hr * 0.2, hx - hr * 0.86, hy - hr * 0.62, hx, hy - hr * 1.0, hx + hr * 0.86, hy - hr * 0.62,
    hx + hr, hy + hr * 0.2, hx + hr * 0.7, hy + hr * 0.78, hx, hy + hr * 0.96, hx - hr * 0.7, hy + hr * 0.78,
  ], wobble: 0.04, seed: 613, sub: 3 }], { h, formK: 0.6, spread: 0.8 });
  // Salt crusted on the crown, where the head bows into the light.
  blob(ctx, B, salt, [{ k: 'curve', pts: [
    hx - hr * 0.78, hy - hr * 0.42, hx - hr * 0.3, hy - hr * 0.92, hx + hr * 0.4, hy - hr * 0.9, hx + hr * 0.8, hy - hr * 0.4,
    hx + hr * 0.4, hy - hr * 0.5, hx + hr * 0.1, hy - hr * 0.3, hx - hr * 0.3, hy - hr * 0.48,
  ], wobble: 0.1, spiky: 0.08, seed: 615, sub: 2 }], { h, tex: 'stipple', seed: 615, amount: 0.5, formK: 0.4, spread: 0.7, outline: false });
  if (!B.override) {
    // The face turned down: a heavy brow, the sockets under it with white blind eyes, a nose, no mouth to see.
    ctx.fillStyle = B.col(deep);
    for (const sd of [-1, 1]) { ctx.beginPath(); ctx.ellipse(hx + sd * hr * 0.36, hy + hr * 0.36, hr * 0.24, hr * 0.16, sd * 0.2, 0, Math.PI * 2); ctx.fill(); }
    eye(ctx, hx - hr * 0.36, hy + hr * 0.4, Math.max(0.8, hr * 0.09), shade('#e4ece0', p.tone), false);
    eye(ctx, hx + hr * 0.36, hy + hr * 0.4, Math.max(0.8, hr * 0.09), shade('#e4ece0', p.tone), false);
    softLine(ctx, B, [hx - hr * 0.7, hy + hr * 0.1, hx - hr * 0.2, hy + hr * 0.2, hx + hr * 0.2, hy + hr * 0.2, hx + hr * 0.7, hy + hr * 0.08], shade(flesh, 0.62), Math.max(1, 1.1 * u), 0.7);
    softLine(ctx, B, [hx + hr * 0.02, hy + hr * 0.3, hx + hr * 0.08, hy + hr * 0.66, hx - hr * 0.08, hy + hr * 0.72], shade(flesh, 0.66), Math.max(1, 0.8 * u), 0.6);
  }

  // ---- the noose round the neck under the chin, and the rope down to the knot on the stone.
  const sx = X(0), sy = BY(-58), srx = 18 * u, sry = 14.5 * u;
  const knot = { x: X(2), y: sy - sry + 1.5 * u };
  blob(ctx, B, rope, [
    { k: 'tube', pts: [X(-8.5), BY(-75), X(0), BY(-72.6), X(8.5), BY(-75)], r0: 1.5 * u, r1: 1.5 * u },
    { k: 'tube', pts: [X(-0.5), BY(-73), X(1.4), BY(-70.5), knot.x, knot.y], r0: 1.7 * u, r1: 1.6 * u, wobble: 0.05, seed: 617 },
  ], { h, formK: 0.5, spread: 0.7 });

  // ---- the stone, round and grey, as wide as the belly it is held against.
  blob(ctx, B, stone, [{ k: 'curve', pts: [
    sx - srx, sy, sx - srx * 0.72, sy - sry * 0.74, sx, sy - sry, sx + srx * 0.74, sy - sry * 0.72,
    sx + srx, sy + sry * 0.04, sx + srx * 0.7, sy + sry * 0.76, sx, sy + sry, sx - srx * 0.72, sy + sry * 0.72,
  ], wobble: 0.05, seed: 619, sub: 3 }], { h, tex: 'cracks', seed: 619, amount: 0.6, formK: 0.6, spread: 0.85 });
  // Salt along its top, and the barnacles that took to it on the bottom.
  blob(ctx, B, salt, [{ k: 'curve', pts: [
    sx - srx * 0.78, sy - sry * 0.5, sx - srx * 0.3, sy - sry * 0.96, sx + srx * 0.4, sy - sry * 0.94, sx + srx * 0.86, sy - sry * 0.42,
    sx + srx * 0.4, sy - sry * 0.62, sx, sy - sry * 0.5, sx - srx * 0.4, sy - sry * 0.62,
  ], wobble: 0.1, spiky: 0.08, seed: 621, sub: 2 }], { h, tex: 'stipple', seed: 621, amount: 0.5, formK: 0.4, spread: 0.7, outline: false });
  // The knot on top of it, and the god's scallop hung from the knot.
  blob(ctx, B, rope, [{ k: 'ball', x: knot.x, y: knot.y, r: 2.6 * u }], { h, formK: 0.5 });
  const scx = knot.x + 0.4 * u, scy = knot.y + 4.4 * u;
  blob(ctx, B, gilt, [{ k: 'curve', pts: [scx - 2.6 * u, scy - 1.2 * u, scx, scy - 3 * u, scx + 2.6 * u, scy - 1.2 * u, scx + 2 * u, scy + 1.8 * u, scx, scy + 2.6 * u, scx - 2 * u, scy + 1.8 * u], wobble: 0.02, seed: 623, sub: 2, gloss: 0.6 }], { h, formK: 0.5, spread: 0.7 });
  if (!B.override && u >= 0.8) softLine(ctx, B, [scx, scy - 2.2 * u, scx, scy + 1.8 * u], shade('#7a6230', p.tone), Math.max(1, 0.4 * u), 0.6);

  // ---- the forearms round the stone's sides, the hands cupped under it, the fingers curled up its front.
  for (const [s, k, seed] of [[-1, 0.84, 625], [1, 1, 629]] as const) {
    const el = { x: X(26 * s), y: BY(-55) }, wr = { x: X(11 * s), y: sy + sry * 0.94 };
    blob(ctx, B, shade(flesh, k), [
      { k: 'tube', pts: [el.x, el.y, X(23.5 * s), sy + sry * 0.56, X(18 * s), sy + sry * 0.92, wr.x, wr.y], r0: 5.4 * u, r1: 4 * u, wobble: 0.04, seed },
      { k: 'ell', x: wr.x - s * 1.6 * u, y: wr.y - 0.6 * u, rx: 4.6 * u, ry: 3.4 * u, rot: -0.2 * s },
    ], { h, formK: 0.5, spread: 0.72 });
    const fingers: Part[] = [];
    for (let i = 0; i < 4; i++) {
      const bx = wr.x - s * (2.8 + i * 1.6) * u, by = wr.y - (1.6 + i * 0.3) * u;
      fingers.push({ k: 'tube', pts: [bx, by, bx - s * 0.8 * u, by - 3 * u, bx - s * 0.4 * u, by - 5 * u], r0: 1.3 * u, r1: 0.9 * u, wobble: 0.05, seed: seed + 1 + i });
    }
    blob(ctx, B, shade(flesh, k * 1.04), fingers, { h, formK: 0.5, spread: 0.75 });
  }

  // ---- barnacles: on the shoulders and the stone's flanks, small white cones with a dark mouth.
  for (const [bx, by, r] of [[-22, -77, 1.8], [-18, -79.5, 1.3], [20, -78, 1.6], [24, -75, 1.2], [-14, -60, 1.6], [-12, -56.5, 1.2], [13.5, -62, 1.4]] as const) {
    const cx2 = X(bx), cy2 = BY(by);
    blob(ctx, B, barn, [{ k: 'ell', x: cx2, y: cy2, rx: r * u, ry: r * 0.86 * u, rot: 0 }], { h, formK: 0.5, spread: 0.7 });
    if (!B.override && u >= 0.8) { ctx.fillStyle = B.col(deep); ctx.beginPath(); ctx.ellipse(cx2, cy2 - r * 0.1 * u, r * 0.36 * u, r * 0.26 * u, 0, 0, Math.PI * 2); ctx.fill(); }
  }

  // Water still running off it: off the chin, the elbows and the stone's bottom.
  if (!B.override) for (let i = 0; i < 4; i++) {
    const t = ((p.frame * 0.02 + i * 0.27) % 1);
    const dx2 = [hx, X(-26), X(26), sx + srx * 0.3][i], dy2 = [hy + hr, BY(-52), BY(-52), sy + sry][i];
    ctx.fillStyle = B.col(rgba(shade('#cfe4e0', p.tone), 0.5 * (1 - t)));
    ctx.beginPath(); ctx.ellipse(dx2, dy2 + t * h * 0.1, Math.max(0.6, h * 0.008), Math.max(0.8, h * 0.014), 0, 0, Math.PI * 2); ctx.fill();
  }
  void p.light;
}

// ------------------------------------------------------------ the Queen's guard ----
/**
 * The Queen's colours (#17): one deep blue and one gold, fixed rather than taken from the def's
 * tint, since a tint recolours and these must stay hers. The barrow has faded them: `fade` is how
 * far each is taken toward its own dark, a third for the guard's tabard and further for the
 * captain's cloak, which has gone nearly black.
 */
const QUEEN_BLUE = '#1f3a7a', QUEEN_GOLD = '#d4a83a';
function queens(tone: number, fade: number): { blue: string; gold: string; goldD: string } {
  const blue = shade(mix(QUEEN_BLUE, '#080a14', fade), tone), gold = shade(mix(QUEEN_GOLD, '#2a1c0c', fade * 0.8), tone);
  return { blue, gold, goldD: mix(gold, INK, 0.4) };
}

/** Old plate: the def's tint taken down and cool, as the bone knight's is, in four steps. */
function plate(p: Paint): { st: string; stD: string; stM: string; stL: string } {
  const st = mix(p.dark, '#303c4a', 0.45);
  return { st, stD: mix(st, '#10151c', 0.44), stM: mix(st, '#10151c', 0.22), stL: mix(st, '#e4eef8', 0.3) };
}

/**
 * A leg of the Queen's dead: the bare thigh bone, a knee cop, a greave down the shin and the bone
 * foot. `s` is +1 for the near leg (toes out to the right) and -1 for the far one.
 */
function guardLeg(ctx: CanvasRenderingContext2D, leg: readonly { x: number; y: number }[], h: number, s: number, bone: string, st: string, murk: string, seed: number): void {
  const u = h / 100, [hip, knee, ank] = leg;
  blob(ctx, B, bone, [shaft(hip.x, hip.y, knee.x, knee.y, 3.4 * u, seed)], { h, formK: 0.55 });
  blob(ctx, B, bone, [{ k: 'poly', pts: [
    ank.x - s * 3 * u, ank.y + u, ank.x + s * 2.5 * u, ank.y + u, ank.x + s * 6.5 * u, ank.y + 5 * u,
    ank.x + s * 6.5 * u, ank.y + 7.5 * u, ank.x - s * 3.5 * u, ank.y + 7.5 * u,
  ] }], { h, formK: 0.5 });
  gap(ctx, knee.x, knee.y, hip.x, hip.y, 3.2 * u, murk, 0.6);
  blob(ctx, B, st, [{ k: 'cap', x0: knee.x, y0: knee.y + 3 * u, x1: ank.x, y1: ank.y - 1 * u, r0: 3.1 * u, r1: 2.6 * u }], { h, formK: 0.5, gloss: 0.12 });
  blob(ctx, B, mix(st, '#e4eef8', 0.12), [{ k: 'ell', x: knee.x + s * 0.4 * u, y: knee.y + 0.6 * u, rx: 3.2 * u, ry: 2.6 * u }], { h, formK: 0.6, gloss: 0.3 });
}

/** A pauldron: a domed steel cap on the shoulder, with its lame's crease. */
function pauldron(ctx: CanvasRenderingContext2D, cx: number, cy: number, r: number, hex: string, h: number, seed: number): void {
  blob(ctx, B, hex, [{ k: 'curve', pts: ring(cx, cy, r, r * 0.86, 11, -0.1), wobble: 0.035, seed, sub: 2, gloss: 0.2 }], { h, formK: 0.6, creases: [
    { x0: cx - r, y0: cy + r * 0.28, x1: cx + r, y1: cy + r * 0.2, r: r * 0.22, a: 0.4 },
  ] });
}

/**
 * The Queen's livery on a frame, from the belt up: a whole tabard in her blue from shoulder to
 * mid-thigh, a gold band at the hem and her crown on the breast, the belt with its gold buckle,
 * then the gorget and the bare neck above it. `lift` is the breath the upper body rides.
 */
function livery(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, lift: number, tone: number, q: ReturnType<typeof queens>, stM: string, old: string, murk: string): void {
  const u = h / 100, X = (v: number) => x + v * u, Y = (v: number) => y + v * u, T = (v: number) => y + v * u - lift;
  const leather = shade('#3e2c1e', tone);
  // The tabard, whole: shoulder to mid-thigh, drawn in at the belt, a gold band round the hem.
  const tab = [
    X(-12.4), T(-75.6), X(-4), T(-76.6), X(5), T(-76.6), X(14.6), T(-75.4),
    X(14.2), T(-66), X(12), T(-58), X(12.6), T(-48), X(13.2), Y(-39),
    X(9.5), Y(-37.6), X(7), Y(-38.8), X(1), Y(-38), X(-4), Y(-39), X(-7), Y(-37.8), X(-12), Y(-39),
    X(-11.4), Y(-48), X(-10.6), T(-58), X(-12.6), T(-66),
  ];
  blob(ctx, B, q.blue, [{ k: 'curve', pts: tab, wobble: 0.025, seed: 73, sub: 2 }], { h, tex: 'folds', seed: 73, amount: 0.55, formK: 0.45, spread: 0.75, creases: [
    { x0: X(-4), y0: Y(-54), x1: X(-5), y1: Y(-40), r: 1.4 * u, a: 0.35 },
    { x0: X(6), y0: Y(-54), x1: X(7), y1: Y(-40), r: 1.4 * u, a: 0.35 },
  ] });
  // The hem band and the edges in gold, and her crown on the breast.
  ctx.strokeStyle = B.col(q.gold); ctx.lineWidth = Math.max(1, 1.6 * u); ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(X(-11.4), Y(-41)); ctx.lineTo(X(-4), Y(-40.8)); ctx.lineTo(X(1), Y(-40.2)); ctx.lineTo(X(7), Y(-40.8)); ctx.lineTo(X(12.6), Y(-41)); ctx.stroke();
  ctx.fillStyle = B.col(q.gold);
  const kx = X(1.4), ky = T(-66);
  ctx.beginPath();
  ctx.moveTo(kx - 4.4 * u, ky + 2.4 * u); ctx.lineTo(kx - 4.6 * u, ky - 2.8 * u); ctx.lineTo(kx - 2.2 * u, ky - 0.4 * u);
  ctx.lineTo(kx, ky - 3.8 * u); ctx.lineTo(kx + 2.2 * u, ky - 0.4 * u); ctx.lineTo(kx + 4.6 * u, ky - 2.8 * u); ctx.lineTo(kx + 4.4 * u, ky + 2.4 * u);
  ctx.closePath(); ctx.fill();
  softLine(ctx, B, [kx - 4.2 * u, ky + 2.6 * u, kx + 4.2 * u, ky + 2.6 * u], q.gold, Math.max(1, u), 0.5);

  // The belt at the waist, a gold buckle on it.
  ctx.strokeStyle = B.col(leather); ctx.lineWidth = Math.max(1, 2.2 * u);
  ctx.beginPath(); ctx.moveTo(X(-10.8), T(-58.4)); ctx.quadraticCurveTo(X(1), T(-56.6), X(12.2), T(-58.4)); ctx.stroke();
  glossPoly(ctx, B, [X(-1.2), T(-59.6), X(3), T(-59.6), X(3), T(-56.2), X(-1.2), T(-56.2)], q.gold, { h, gloss: 0.4 });

  // The gorget round the neck.
  blob(ctx, B, stM, [{ k: 'ell', x: X(1.6), y: T(-75.6), rx: 6.8 * u, ry: 3.2 * u }], { h, formK: 0.5, gloss: 0.2 });
  glossTaper(ctx, B, X(2.6), T(-84), X(1.8), T(-76.5), 2.4 * u, 2.8 * u, old, { h });
  for (let i = 0; i < 2; i++) softLine(ctx, B, [X(0.2), T(-82 + i * 2.6), X(4.2), T(-82.4 + i * 2.6)], murk, Math.max(1, 0.9 * u), 0.55);
}

/**
 * The Barrow Guard: the Queen's guard, still standing to. Lighter than the bone knight — bare bone
 * at the arms and thighs, plate only in pieces (a kettle hat, a gorget, pauldrons, greaves) — and
 * a whole tabard in her blue and gold, faded but hers. The halberd stands grounded by the near
 * foot, held upright in both hands: he holds his ground and never roams.
 */
function guard(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: -0.012, hipTilt: 0.01, turn: 0.012, near: [0.09, 0.1, 0.11], far: [-0.086, -0.098, -0.108], toe: [0.7, -0.6] }, BONE);
  const u = h / 100, X = (v: number) => x + v * u, Y = (v: number) => y + v * u;
  const lift = p.breathe * h * 0.007, BY = (v: number) => y + v * u - lift;
  const { st, stD, stM, stL } = plate(p);
  const q = queens(p.tone, 0.33);
  const bn = shade('#ece2cc', p.tone), old = shade('#cfc3a8', p.tone), murk = mix(old, INK, 0.7);
  const jd = Math.pow(Math.max(0, Math.sin(p.frame / 23)), 16) * 0.2;
  groundShadow(ctx, x, y + 1, h * 0.55);

  // The legs, the far one a step darker; the tabard hangs over both tops.
  guardLeg(ctx, R.legL, h, -1, old, stD, murk, 61);
  guardLeg(ctx, R.legR, h, 1, bn, stM, murk, 63);

  // The far arm goes behind the tabard's edge at the shoulder and crosses in front of it lower
  // down, so it is drawn after; the far pauldron first, behind the gorget.
  pauldron(ctx, R.sFar.x + 1 * u, R.sFar.y - 1.5 * u, 5 * u, stD, h, 71);

  livery(ctx, x, y, h, lift, p.tone, q, stM, old, murk);

  // The arms, bone: the near one hangs to the haft at the hip, the far one crosses the belly to
  // take it higher. A vambrace on the near forearm, the only plate either arm has kept.
  const hx0 = X(19.5);                                                        // the haft's line
  const nElb = { x: X(23.4), y: BY(-59.6) }, nHand = { x: hx0, y: BY(-47) };
  const fElb = { x: X(-5), y: BY(-57) }, fHand = { x: hx0, y: BY(-61) };
  blob(ctx, B, old, [...limb(R.sFar.x, R.sFar.y, fElb.x, fElb.y, fHand.x - 2 * u, fHand.y, 2.3 * u, 2 * u, 75)], { h, formK: 0.5 });
  gap(ctx, fElb.x, fElb.y, R.sFar.x, R.sFar.y, 2.6 * u, murk, 0.6);
  blob(ctx, B, bn, [...limb(R.sNear.x, R.sNear.y, nElb.x, nElb.y, nHand.x + 1 * u, nHand.y, 2.6 * u, 2.3 * u, 77)], { h, formK: 0.5 });
  gap(ctx, nElb.x, nElb.y, R.sNear.x, R.sNear.y, 2.8 * u, murk, 0.6);
  blob(ctx, B, st, [{ k: 'cap', x0: X(22.6), y0: BY(-56.4), x1: X(20.8), y1: BY(-49.6), r0: 3.1 * u, r1: 3.3 * u }], { h, formK: 0.5, gloss: 0.12 });
  pauldron(ctx, R.sNear.x, R.sNear.y - 1.8 * u, 5.8 * u, st, h, 79);

  // The halberd, grounded by the near foot and upright: an ash haft, langets, an axe blade facing
  // out, a beak behind it and a spike on top.
  const top = Y(-121), hy0 = Y(-102);
  glossTaper(ctx, B, hx0, Y(0.5), hx0, Y(-104), 1.5 * u, 1.4 * u, R.wood, { h });
  softLine(ctx, B, [hx0, Y(-92), hx0, Y(-100)], stD, Math.max(1, 1.8 * u), 0.8);
  glossPoly(ctx, B, [
    hx0 + 1 * u, hy0 - 8 * u, hx0 + 4.5 * u, hy0 - 8.5 * u, hx0 + 8 * u, hy0 - 12 * u, hx0 + 10.5 * u, hy0 - 8 * u,
    hx0 + 11 * u, hy0 - 3 * u, hx0 + 10 * u, hy0 + 2 * u, hx0 + 7.5 * u, hy0 + 6 * u, hx0 + 4.5 * u, hy0 + 1.5 * u, hx0 + 1 * u, hy0 + 1 * u,
  ], st, { h, gloss: 0.35, spread: 0.6 });
  glossPoly(ctx, B, [hx0 - 1 * u, hy0 - 7 * u, hx0 - 7.5 * u, hy0 - 4.5 * u, hx0 - 1 * u, hy0 - 3 * u], stM, { h, gloss: 0.25 });
  glossPoly(ctx, B, [hx0 - 1.4 * u, hy0 - 9 * u, hx0, top, hx0 + 1.4 * u, hy0 - 9 * u], st, { h, gloss: 0.35 });
  ctx.strokeStyle = B.col(rgba(mix(stL, '#ffffff', 0.5), 0.55)); ctx.lineWidth = 1; ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(hx0 + 9.8 * u, hy0 - 8 * u); ctx.quadraticCurveTo(hx0 + 10.8 * u, hy0 - 3 * u, hx0 + 9.4 * u, hy0 + 2 * u); ctx.stroke();

  // The fists close on the haft after it, so the finger bones lie across it.
  fist(ctx, R, fHand, -Math.PI / 2, 42, { hex: old, flip: -1, k: 0.8 });
  fist(ctx, R, nHand, -Math.PI / 2, 44, { hex: bn, flip: 1, k: 0.85 });

  // The skull under a kettle hat: the brim shades the sockets, and the jaw still hangs.
  skull(ctx, R.hx, R.hy + 1 * u, R.hr * 0.92, 0.08, bn, old, h, jd, murk);
  const kx0 = R.hx + 0.6 * u, ky0 = R.hy - 2.4 * u;
  blob(ctx, B, st, [
    { k: 'ell', x: kx0, y: ky0 + 0.8 * u, rx: 11 * u, ry: 2.4 * u },
    { k: 'curve', pts: [kx0 - 7 * u, ky0, kx0 - 6.4 * u, ky0 - 5 * u, kx0 - 3 * u, ky0 - 8.2 * u, kx0 + 1 * u, ky0 - 9 * u, kx0 + 5 * u, ky0 - 7.6 * u, kx0 + 7.4 * u, ky0 - 4 * u, kx0 + 7.6 * u, ky0], wobble: 0.02, seed: 81, sub: 2, gloss: 0.3 },
  ], { h, formK: 0.5, tex: 'cracks', seed: 81, amount: 0.4, creases: [{ x0: kx0 - 7 * u, y0: ky0 - 0.6 * u, x1: kx0 + 7.4 * u, y1: ky0 - 0.6 * u, r: 1.2 * u, a: 0.45 }] });
  softLine(ctx, B, [kx0 - 9.6 * u, ky0 + 2.8 * u, kx0 + 9.8 * u, ky0 + 2.8 * u], stD, Math.max(1, 1.6 * u), 0.5);
  ctx.strokeStyle = B.col(rgba(mix(stL, '#ffffff', 0.45), 0.5)); ctx.lineWidth = Math.max(1, u);
  ctx.beginPath(); ctx.moveTo(kx0 - 5.8 * u, ky0 - 3.6 * u); ctx.quadraticCurveTo(kx0 - 4 * u, ky0 - 7.2 * u, kx0 - 0.4 * u, ky0 - 8 * u); ctx.stroke();
}

/**
 * The Barrow Captain: the guard's kit made a captain's, at his post beside the bier. A cloak in the
 * Queen's blue gone nearly black hangs from a mantle over both shoulders, closed at the throat in
 * gold; the helm is crested and whole, where the bone knight's is broken; and a longsword stands
 * grounded point-down before him, both bone hands on the pommel.
 */
function captain(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: -0.006, hipTilt: 0.006, turn: 0.008, near: [0.1, 0.11, 0.12], far: [-0.094, -0.106, -0.116], toe: [0.7, -0.6] }, BONE);
  const u = h / 100, X = (v: number) => x + v * u, Y = (v: number) => y + v * u;
  const lift = p.breathe * h * 0.007, BY = (v: number) => y + v * u - lift;
  const { st, stD, stM, stL } = plate(p);
  const q = queens(p.tone, 0.33), dusk = queens(p.tone, 0.74);
  const bn = shade('#ece2cc', p.tone), old = shade('#cfc3a8', p.tone), murk = mix(old, INK, 0.7);
  const jd = Math.pow(Math.max(0, Math.sin(p.frame / 29)), 18) * 0.15;
  const sway = p.breathe * 0.8;                                               // the cloak's hem stirs
  groundShadow(ctx, x, y + 1, h * 0.62);

  // The cloak behind him, wider than he is, its hem torn a little and stirring.
  blob(ctx, B, dusk.blue, [{ k: 'curve', pts: [
    X(-15), BY(-78), X(1), BY(-80), X(18), BY(-78), X(23), BY(-62), X(25), Y(-36), X(27 + sway), Y(-8),
    X(21 + sway), Y(-5), X(16 + sway), Y(-9), X(9 + sway), Y(-5.5), X(0 + sway), Y(-8), X(-8 + sway), Y(-5),
    X(-15 + sway), Y(-9), X(-20 + sway), Y(-5.5), X(-24 + sway), Y(-9), X(-22), Y(-36), X(-20), BY(-62),
  ], wobble: 0.03, seed: 91, sub: 2 }], { h, tex: 'folds', seed: 91, amount: 0.8, formK: 0.4, spread: 0.8, creases: [
    { x0: X(-17), y0: BY(-56), x1: X(-19), y1: Y(-12), r: 1.6 * u, a: 0.4 },
    { x0: X(20), y0: BY(-56), x1: X(22), y1: Y(-12), r: 1.6 * u, a: 0.4 },
  ] });

  guardLeg(ctx, R.legL, h, -1, old, stD, murk, 93);
  guardLeg(ctx, R.legR, h, 1, bn, stM, murk, 95);
  livery(ctx, x, y, h, lift, p.tone, q, stM, old, murk);

  // The arms come forward from under the mantle to the pommel, the far one behind the near.
  const hilt = { x: X(2.4), y: BY(-52) };
  const nElb = { x: X(19.5), y: BY(-58.5) }, fElb = { x: X(-14), y: BY(-58) };
  const nHand = { x: hilt.x + 1 * u, y: hilt.y + 1.5 * u }, fHand = { x: hilt.x - 0.6 * u, y: hilt.y - 2.6 * u };
  blob(ctx, B, old, [...limb(R.sFar.x, R.sFar.y, fElb.x, fElb.y, fHand.x, fHand.y, 2.4 * u, 2.1 * u, 97)], { h, formK: 0.5 });
  gap(ctx, fElb.x, fElb.y, R.sFar.x, R.sFar.y, 2.6 * u, murk, 0.6);
  blob(ctx, B, stD, [{ k: 'cap', x0: X(-12.4), y0: BY(-56.4), x1: X(-5), y1: BY(-54.6), r0: 3 * u, r1: 3.1 * u }], { h, formK: 0.5, gloss: 0.1 });

  // The longsword, grounded before him: blade(), as the skeleton's, run from the hands to the floor.
  const ga = blade(ctx, R, hilt, hilt.x + 0.4 * u, Y(-0.5), 1.8 * u, 7 * u);
  fist(ctx, R, fHand, ga, 46, { hex: old, flip: 1, k: 0.82 });
  blob(ctx, B, bn, [...limb(R.sNear.x, R.sNear.y, nElb.x, nElb.y, nHand.x + 1.5 * u, nHand.y, 2.7 * u, 2.3 * u, 99)], { h, formK: 0.5 });
  gap(ctx, nElb.x, nElb.y, R.sNear.x, R.sNear.y, 2.8 * u, murk, 0.6);
  blob(ctx, B, st, [{ k: 'cap', x0: X(17.6), y0: BY(-56.8), x1: X(9.5), y1: BY(-52.2), r0: 3.2 * u, r1: 3.3 * u }], { h, formK: 0.5, gloss: 0.12 });
  fist(ctx, R, nHand, ga, 48, { hex: bn, flip: -1, k: 0.86 });

  // The mantle over both shoulders, closed at the throat by a gold clasp and chain.
  blob(ctx, B, dusk.blue, [
    { k: 'curve', pts: ring(R.sFar.x + 0.5 * u, R.sFar.y - 0.5 * u, 7.4 * u, 6 * u, 11, -0.2), wobble: 0.03, seed: 101, sub: 2 },
    { k: 'curve', pts: ring(R.sNear.x, R.sNear.y - 0.8 * u, 7.8 * u, 6.2 * u, 11, -0.2), wobble: 0.03, seed: 103, sub: 2 },
    { k: 'ell', x: X(1.5), y: BY(-77), rx: 11 * u, ry: 3.6 * u },
  ], { h, tex: 'folds', seed: 105, amount: 0.5, formK: 0.5, spread: 0.8 });
  ctx.strokeStyle = B.col(q.gold); ctx.lineWidth = Math.max(1, 1.2 * u); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(X(-5), BY(-75.4)); ctx.quadraticCurveTo(X(1.5), BY(-72.4), X(8), BY(-75.4)); ctx.stroke();
  for (const cx of [-5, 8]) blob(ctx, B, q.gold, [{ k: 'ell', x: X(cx), y: BY(-75.6), rx: 2.2 * u, ry: 2 * u }], { h, formK: 0.6, gloss: 0.5 });

  // The skull in a close helm, the face left open under the brow; the crest whole, sweeping back.
  const hx = R.hx + 0.4 * u, hy = R.hy + 0.8 * u;
  const crest = mix(dusk.blue, q.blue, 0.4);
  blob(ctx, B, crest, [{ k: 'curve', pts: [
    hx + 4.6 * u, hy - 9.4 * u, hx + 3 * u, hy - 15 * u, hx - 2 * u, hy - 17.4 * u, hx - 8 * u, hy - 16.6 * u, hx - 13 * u, hy - 12.6 * u,
    hx - 15.6 * u, hy - 5 * u, hx - 14.4 * u, hy + 1.6 * u, hx - 12 * u, hy - 4.4 * u, hx - 9.6 * u, hy - 9.4 * u, hx - 4 * u, hy - 11.6 * u, hx + 1 * u, hy - 10.8 * u,
  ], wobble: 0.05, spiky: 0.1, seed: 107, sub: 2 }], { h, tex: 'folds', seed: 107, amount: 0.5, formK: 0.4, spread: 0.7 });
  softLine(ctx, B, [hx + 2.6 * u, hy - 14.6 * u, hx - 2 * u, hy - 16.4 * u, hx - 7.6 * u, hy - 15.6 * u], mix(crest, '#ffffff', 0.5), Math.max(1, u), 0.35);
  skull(ctx, hx, hy + 0.6 * u, R.hr * 0.9, 0.04, bn, old, h, jd, murk);
  blob(ctx, B, st, [
    { k: 'curve', pts: [
      hx - 8.2 * u, hy + 4.8 * u, hx - 8.8 * u, hy - 3 * u, hx - 6 * u, hy - 8.6 * u, hx + 0.5 * u, hy - 10.6 * u, hx + 6.6 * u, hy - 8.4 * u,
      hx + 9 * u, hy - 3 * u, hx + 8.4 * u, hy + 4.8 * u, hx + 5.6 * u, hy + 5.4 * u, hx + 6.4 * u, hy - 1.8 * u,
      hx + 0.4 * u, hy - 3.8 * u, hx - 5.8 * u, hy - 1.8 * u, hx - 5.2 * u, hy + 5.4 * u,
    ], wobble: 0.02, seed: 109, sub: 2, gloss: 0.3 },
  ], { h, formK: 0.5, tex: 'cracks', seed: 109, amount: 0.35 });
  // The comb the crest is set in, and a gold band over the brow.
  blob(ctx, B, stM, [{ k: 'curve', pts: [hx - 6 * u, hy - 8.4 * u, hx + 0.5 * u, hy - 12.6 * u, hx + 5 * u, hy - 9.8 * u, hx + 0.5 * u, hy - 10 * u], wobble: 0.02, seed: 111, sub: 2 }], { h, formK: 0.5 });
  ctx.strokeStyle = B.col(q.goldD); ctx.lineWidth = Math.max(1, 1.2 * u);
  ctx.beginPath(); ctx.moveTo(hx - 6.4 * u, hy - 2.6 * u); ctx.quadraticCurveTo(hx + 0.4 * u, hy - 5.2 * u, hx + 7 * u, hy - 2.6 * u); ctx.stroke();
  ctx.strokeStyle = B.col(rgba(mix(stL, '#ffffff', 0.45), 0.5)); ctx.lineWidth = Math.max(1, u);
  ctx.beginPath(); ctx.moveTo(hx - 7.4 * u, hy - 3.4 * u); ctx.quadraticCurveTo(hx - 5.8 * u, hy - 8 * u, hx - 1.4 * u, hy - 9.6 * u); ctx.stroke();
  // Two cold points far back in the sockets: he is still at his post.
  const pulse = 0.5 + 0.5 * Math.sin(p.frame / 11);
  eye(ctx, hx - R.hr * 0.4, hy + 0.6 * u, Math.max(0.8, 0.8 * u), mix(q.gold, '#fff4d0', 0.3 + 0.3 * pulse), false);
  eye(ctx, hx + R.hr * 0.38, hy + 0.2 * u, Math.max(0.8, 0.9 * u), mix(q.gold, '#fff4d0', 0.3 + 0.3 * pulse), false);
}

// ------------------------------------------------------------ the Drowned Temples ----
/** The drowned god's bronze, gone green in the water, with what gilding is left on it. */
const VERDIGRIS = '#4f8f78', GILT = '#c8a85a';

/**
 * An open hand of bones, held up: a palm and four finger bones fanning from it along `a` (radians,
 * -PI/2 is straight up), the thumb out to one side. One blob, so it is one piece with the wrist.
 */
function boneHand(ctx: CanvasRenderingContext2D, wx: number, wy: number, a: number, u: number, hex: string, side: number): void {
  const ux = Math.cos(a), uy = Math.sin(a), nx = -uy, ny = ux;
  const parts: Part[] = [{ k: 'ell', x: wx + ux * 2.2 * u, y: wy + uy * 2.2 * u, rx: 2.6 * u, ry: 2.2 * u, rot: a }];
  for (let i = 0; i < 4; i++) {
    const o = (i - 1.5) * 1.4 * u, l = (5.2 - Math.abs(i - 1.4) * 0.9) * u, bx = wx + ux * 3.6 * u + nx * o, by = wy + uy * 3.6 * u + ny * o;
    parts.push({ k: 'tube', pts: [bx, by, bx + ux * l + nx * o * 0.25, by + uy * l + ny * o * 0.25], r0: 0.75 * u, r1: 0.55 * u });
  }
  const tx = wx + ux * 1.6 * u - nx * side * 2.4 * u, ty = wy + uy * 1.6 * u - ny * side * 2.4 * u;
  parts.push({ k: 'tube', pts: [tx, ty, tx - nx * side * 2.6 * u + ux * 2 * u, ty - ny * side * 2.6 * u + uy * 2 * u], r0: 0.8 * u, r1: 0.6 * u });
  blob(ctx, B, hex, parts, { h: u * 100, formK: 0.5, spread: 0.7 });
}

/**
 * The Drowned Chanter and the Choirmaster. A priest of the drowned god: the bones in a hooded robe
 * gone heavy with the water, darker from the knee down where it still soaks, the hem torn and
 * trailing weed. A broad collar of the god's bronze lies across the chest, a row of scallops along
 * its edge. The jaw hangs open and works: the chant is a count. The chanter holds both hands up and
 * open before it. The Choirmaster is taller, its robe fuller and a mantle over it, a crown of whelk
 * shells on the skull; the bell hangs before it on two cords from the collar, the far hand on its
 * shoulder, and the near hand raised high with the beater, keeping time.
 */
function priest(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint, master: boolean): void {
  const R = makeRig(x, y, h, p, { tilt: -0.008, hipTilt: 0.008, turn: 0.01, near: [0.08, 0.09, 0.1], far: [-0.08, -0.09, -0.1], toe: [0.6, -0.6] }, BONE);
  const u = h / 100, X = (v: number) => x + v * u, Y = (v: number) => y + v * u;
  const lift = p.breathe * h * 0.007, BY = (v: number) => y + v * u - lift;
  const bn = shade('#d8d0bc', p.tone), old = shade('#a89e88', p.tone), murk = mix(old, INK, 0.75);
  const robe = p.base, soaked = shade(mix(p.dark, '#0e1c1e', 0.35), 1), weed = shade(mix(p.dark, '#2a3a1c', 0.55), 1);
  const bronze = shade(VERDIGRIS, p.tone), gilt = shade(GILT, p.tone);
  const sw = Math.sin(p.frame / 31) * 0.8;                                     // the wet hem barely stirs
  // The count: the jaw drops and closes, again and again, steady as a beat.
  const beat = Math.abs(Math.sin(p.frame / (master ? 9 : 7)));
  const jd = 0.16 + 0.22 * beat;
  const F = master ? 1.24 : 1;                                                  // how full the robe is below the waist
  groundShadow(ctx, x, y + 1, h * (master ? 0.7 : 0.6));

  // ---- the robe: one mass from the shoulders to the ground, the hem torn, then the soaked part.
  const hem = (k: number): number[] => [
    X(23 * F + sw), Y(-1.5), X(17 * F), Y(0.2), X(12 * F), Y(-2.4), X(6 * F), Y(0.6), X(0), Y(-2), X(-6 * F), Y(0.6),
    X(-12 * F), Y(-2.6), X(-17 * F), Y(0.2), X(-22 * F + sw), Y(-1.6), X(-19.5 * F), Y(-20 * k),
  ];
  const body = [X(-13), BY(-80), X(1), BY(-82), X(15), BY(-80), X(19), BY(-71), X(16.5), Y(-46), X(19 * F), Y(-22), ...hem(1), X(-16.5), Y(-46), X(-18), BY(-71)];
  blob(ctx, B, robe, [{ k: 'curve', pts: body, wobble: 0.025, seed: 501, sub: 2 }], { h, tex: 'folds', seed: 501, amount: 0.8, formK: 0.45, spread: 0.8, creases: [
    { x0: X(-6), y0: Y(-44), x1: X(-9 * F), y1: Y(-4), r: 1.6 * u, a: 0.4 },
    { x0: X(5), y0: Y(-44), x1: X(8 * F), y1: Y(-4), r: 1.6 * u, a: 0.4 },
    { x0: X(-0.5), y0: Y(-40), x1: X(0), y1: Y(-6), r: 1.2 * u, a: 0.3 },
  ] });
  // Below the waterline the cloth is still soaked through: a darker skirt with a ragged top edge.
  blob(ctx, B, soaked, [{ k: 'curve', pts: [
    X(18.5 * F), Y(-30), X(19.2 * F), Y(-22), ...hem(0.98).slice(0, -2), X(-19.4 * F), Y(-22), X(-18.6 * F), Y(-30),
    X(-12), Y(-27), X(-6), Y(-31), X(0), Y(-27.5), X(6), Y(-31.5), X(12), Y(-27),
  ], wobble: 0.04, seed: 503, sub: 2 }], { h, tex: 'folds', seed: 503, amount: 0.6, formK: 0.4, spread: 0.7, outline: false });
  // Bone toes under the hem, and weed off the hem, hanging straight and heavy.
  blob(ctx, B, old, [
    { k: 'poly', pts: [X(-11), Y(-1.4), X(-5), Y(-1.4), X(-4), Y(0.8), X(-11.6), Y(0.8)] },
    { k: 'poly', pts: [X(5), Y(-1.4), X(11.5), Y(-1.4), X(12.6), Y(0.8), X(4.6), Y(0.8)] },
  ], { h, formK: 0.5 });
  const strands: Part[] = [];
  for (const [wx, wy, l] of [[-15 * F, -12, 9], [-9 * F, -9, 7], [10 * F, -10, 8], [16 * F, -14, 11]] as const) {
    strands.push({ k: 'tube', pts: [X(wx), Y(wy), X(wx + 0.6 + sw * 0.3), Y(wy + l * 0.55), X(wx + sw * 0.8), Y(wy + l)], r0: 1.1 * u, r1: 0.45 * u, wobble: 0.14, seed: 505 });
  }
  blob(ctx, B, weed, strands, { h, formK: 0.4, spread: 0.7 });

  // ---- the arms, in wide sleeves that hang heavy from the elbow; bone from the cuff to the hand.
  const nEl = { x: X(20), y: BY(-58) }, fEl = { x: X(-19), y: BY(-57) };
  const nWr = master ? { x: X(25), y: BY(-96 + beat * 6) } : { x: X(18.5), y: BY(-69) };
  const fWr = master ? { x: X(-8), y: BY(-49) } : { x: X(-16), y: BY(-68) };
  const nElR = master ? { x: X(27), y: BY(-78) } : nEl;
  const sleeve = (sh: { x: number; y: number }, el: { x: number; y: number }, s: number, seed: number): Part => ({ k: 'curve', pts: [
    sh.x - s * 4 * u, sh.y - 3 * u, sh.x + s * 4.5 * u, sh.y - 1.5 * u, el.x + s * 5.5 * u, el.y - 2 * u, el.x + s * 6 * u, el.y + 7 * u,
    el.x + s * 2 * u, el.y + 12 * u, el.x - s * 3.5 * u, el.y + 9 * u, el.x - s * 5 * u, el.y + 2 * u, sh.x - s * 5 * u, sh.y + 8 * u,
  ], wobble: 0.04, seed, sub: 2 });
  // The far arm, darker, behind; then its forearm and hand.
  blob(ctx, B, shade(robe, 0.8), [sleeve(R.sFar, fEl, -1, 511)], { h, tex: 'folds', seed: 511, amount: 0.5, formK: 0.45, spread: 0.7 });
  blob(ctx, B, old, [shaft(fEl.x, fEl.y + 2 * u, fWr.x, fWr.y, 2 * u, 513)], { h, formK: 0.5 });

  // ---- the hood up behind the skull, its mouth a dark hollow.
  const hx = R.hx + 0.4 * u, hy = R.hy + (master ? 0.2 : 1.2) * u, hr = R.hr;
  blob(ctx, B, master ? shade(robe, 0.86) : robe, [{ k: 'curve', pts: [
    hx - hr * 1.5, hy + hr * 1.7, hx - hr * 1.62, hy + hr * 0.2, hx - hr * 1.28, hy - hr * 1.12, hx - hr * 0.2, hy - hr * 1.62,
    hx + hr * 0.92, hy - hr * 1.34, hx + hr * 1.56, hy - hr * 0.3, hx + hr * 1.56, hy + hr * 1.7, hx, hy + hr * 2.0,
  ], wobble: 0.03, seed: 515, sub: 2 }], { h, tex: 'folds', seed: 515, amount: 0.5, formK: 0.5, spread: 0.75 });
  hollow(ctx, [hx - hr * 1.12, hy + hr * 1.5, hx - hr * 1.22, hy - hr * 0.2, hx - hr * 0.6, hy - hr * 1.18, hx + hr * 0.4, hy - hr * 1.24, hx + hr * 1.12, hy - hr * 0.4, hx + hr * 1.16, hy + hr * 1.5], murk, 0.03, 517);

  // ---- the Choirmaster's mantle, over both shoulders.
  if (master) blob(ctx, B, shade(mix(robe, '#10181c', 0.35), 1), [
    { k: 'curve', pts: [X(-20), BY(-64), X(-21), BY(-76), X(-12), BY(-82.5), X(1), BY(-83.5), X(14), BY(-82), X(22), BY(-75), X(22.5), BY(-63), X(13), BY(-60), X(1), BY(-62), X(-11), BY(-60)], wobble: 0.04, seed: 519, sub: 2 },
  ], { h, tex: 'folds', seed: 519, amount: 0.6, formK: 0.45, spread: 0.8 });

  // ---- the skull in the hood, the jaw working.
  skull(ctx, hx, hy, hr * 0.92, 0.05, bn, old, h, jd, murk);
  const glint = 0.5 + 0.5 * Math.sin(p.frame / 13), cold = mix('#7fe0c4', '#e8fff8', 0.3 + 0.3 * glint);
  eye(ctx, hx - hr * 0.38, hy + 0.1 * u, Math.max(0.8, 0.8 * u), cold, false);
  eye(ctx, hx + hr * 0.36, hy - 0.2 * u, Math.max(0.8, 0.9 * u), cold, false);
  // The Choirmaster's crown: three whelk shells standing on the skull, the middle one tallest.
  if (master) {
    const shell = shade('#d8c8a8', p.tone);
    const crown: Part[] = [];
    for (const [ox, len, lean] of [[-5, 9, -0.25], [0.6, 13, 0.02], [6, 9, 0.28]] as const) {
      const bx = hx + ox * u, by = hy - hr * 0.86 + Math.abs(ox) * 0.14 * u, tx = bx + Math.sin(lean) * len * u, ty = by - Math.cos(lean) * len * u;
      crown.push({ k: 'tube', pts: [bx, by, (bx + tx) / 2, (by + ty) / 2, tx, ty], r0: 2.4 * u, r1: 0.5 * u });
    }
    blob(ctx, B, shell, crown, { h, tex: 'cracks', seed: 521, amount: 0.4, formK: 0.5, spread: 0.7 });
    if (!B.override) for (const [ox, len, lean] of [[-5, 9, -0.25], [0.6, 13, 0.02], [6, 9, 0.28]] as const) for (let i = 1; i < 4; i++) {
      const t = i / 4.4, bx = hx + ox * u, by = hy - hr * 0.86 + Math.abs(ox) * 0.14 * u, w = 2.4 * u * (1 - t * 0.8);
      const cx2 = bx + Math.sin(lean) * len * u * t, cy2 = by - Math.cos(lean) * len * u * t;
      softLine(ctx, B, [cx2 - w, cy2 + w * 0.3, cx2 + w, cy2 - w * 0.3], shade('#8a7a60', p.tone), Math.max(1, 0.5 * u), 0.6);
    }
  }

  // ---- the drowned god's collar across the chest, its lower edge in scallops.
  const cy0 = BY(-77), cy1 = BY(master ? -63 : -65);
  blob(ctx, B, bronze, [{ k: 'curve', pts: [
    X(-14), cy0, X(-6), BY(-73.5), X(1), BY(-72.5), X(8), BY(-73.5), X(15), cy0,
    X(16), BY(-71), X(10), cy1 + 2 * u, X(1), cy1, X(-8), cy1 + 2 * u, X(-15), BY(-71),
  ], wobble: 0.02, seed: 523, sub: 2, gloss: 0.4 }], { h, tex: 'cracks', seed: 523, amount: 0.35, formK: 0.5, spread: 0.7 });
  for (let i = 0; i < 5; i++) {
    const t = (i - 2) / 2, sx = X(1 + t * 10.5), sy2 = cy1 + Math.abs(t) * 1.6 * u - 0.6 * u;
    blob(ctx, B, gilt, [{ k: 'curve', pts: [sx - 2.4 * u, sy2 - 1 * u, sx, sy2 - 2.8 * u, sx + 2.4 * u, sy2 - 1 * u, sx + 1.8 * u, sy2 + 1.6 * u, sx, sy2 + 2.4 * u, sx - 1.8 * u, sy2 + 1.6 * u], wobble: 0.02, seed: 525 + i, sub: 2, gloss: 0.6 }], { h, formK: 0.5, spread: 0.7 });
    if (!B.override && u >= 0.8) softLine(ctx, B, [sx, sy2 - 2 * u, sx, sy2 + 1.6 * u], shade('#7a6230', p.tone), Math.max(1, 0.4 * u), 0.6);
  }

  // ---- the Choirmaster's bell, hung before it on two cords from the collar.
  if (master) {
    const bx = X(-1), by = BY(-41), bw = 6.4 * u, bh = 13 * u;
    ctx.strokeStyle = B.col(shade('#3a2a1c', p.tone)); ctx.lineWidth = Math.max(1, 0.8 * u); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(X(-8), cy1 + u); ctx.lineTo(bx - 2 * u, by - bh * 0.5); ctx.moveTo(X(5), cy1 + u); ctx.lineTo(bx + 2 * u, by - bh * 0.5); ctx.stroke();
    blob(ctx, B, bronze, [
      { k: 'curve', pts: [bx - bw * 0.42, by - bh * 0.42, bx, by - bh * 0.56, bx + bw * 0.42, by - bh * 0.42, bx + bw * 0.6, by + bh * 0.1, bx + bw * 1.0, by + bh * 0.46, bx, by + bh * 0.54, bx - bw * 1.0, by + bh * 0.46, bx - bw * 0.6, by + bh * 0.1], wobble: 0.02, seed: 531, sub: 2, gloss: 0.6 },
    ], { h, tex: 'cracks', seed: 531, amount: 0.3, formK: 0.55, spread: 0.7 });
    // The lip, the mouth under it and the clapper hanging in it.
    ctx.fillStyle = B.col(murk); ctx.beginPath(); ctx.ellipse(bx, by + bh * 0.48, bw * 0.92, bh * 0.08, 0, 0, Math.PI * 2); ctx.fill();
    blob(ctx, B, old, [{ k: 'ball', x: bx + Math.sin(p.frame / 9) * u * 0.8, y: by + bh * 0.52, r: 1.6 * u }], { h, formK: 0.5 });
    softLine(ctx, B, [bx - bw * 0.88, by + bh * 0.4, bx + bw * 0.88, by + bh * 0.4], gilt, Math.max(1, 0.9 * u), 0.7);
  }

  // ---- the near arm, in front: its sleeve, the forearm up, the hand open or on the beater.
  if (master) {
    blob(ctx, B, robe, [sleeve(R.sNear, nElR, 1, 533)], { h, tex: 'folds', seed: 533, amount: 0.5, formK: 0.45, spread: 0.7 });
    blob(ctx, B, bn, [shaft(nElR.x, nElR.y - 1 * u, nWr.x, nWr.y, 2.1 * u, 535)], { h, formK: 0.5 });
    // The beater: a bone haft and a knob of tarred rope, held out over the bell.
    const k0 = { x: nWr.x - 1 * u, y: nWr.y - 1.5 * u }, k1 = { x: nWr.x - 9 * u, y: nWr.y - 7 * u };
    blob(ctx, B, old, [{ k: 'tube', pts: [nWr.x + 2 * u, nWr.y + 1.5 * u, k0.x, k0.y, k1.x, k1.y], r0: 1.1 * u, r1: 1.1 * u }], { h, formK: 0.5 });
    blob(ctx, B, shade('#2e2620', p.tone), [{ k: 'ell', x: k1.x - 1.2 * u, y: k1.y - 1 * u, rx: 2.8 * u, ry: 2.5 * u, rot: 0.6 }], { h, formK: 0.5, tex: 'stipple', seed: 537, amount: 0.4 });
    fist(ctx, R, nWr, Math.atan2(k1.y - nWr.y, k1.x - nWr.x), 539, { hex: bn, flip: -1, k: 0.8 });
    // The far hand on the bell's shoulder, steadying it.
    boneHand(ctx, fWr.x, fWr.y, -0.3, u, old, -1);
  } else {
    boneHand(ctx, fWr.x, fWr.y, -1.75, u, old, -1);
    blob(ctx, B, robe, [sleeve(R.sNear, nEl, 1, 533)], { h, tex: 'folds', seed: 533, amount: 0.5, formK: 0.45, spread: 0.7 });
    blob(ctx, B, bn, [shaft(nEl.x, nEl.y + 2 * u, nWr.x, nWr.y, 2.1 * u, 535)], { h, formK: 0.5 });
    boneHand(ctx, nWr.x, nWr.y, -1.4, u, bn, 1);
  }
  gap(ctx, master ? nElR.x : nEl.x, (master ? nElR.y : nEl.y) + 2 * u, master ? nWr.x : nWr.x, nWr.y, 2 * u, murk, 0.5);

  // Water still running off the hem and the sleeves.
  if (!B.override) for (let i = 0; i < 4; i++) {
    const t = ((p.frame * 0.02 + i * 0.27) % 1);
    const dx2 = [X(-14 * F), nEl.x + 2 * u, fEl.x - 2 * u, X(13 * F)][i], dy2 = [Y(-3), nEl.y + 11 * u, fEl.y + 11 * u, Y(-3)][i];
    ctx.fillStyle = B.col(rgba(shade('#cfe4e0', p.tone), 0.45 * (1 - t)));
    ctx.beginPath(); ctx.ellipse(dx2, dy2 + t * h * (i % 3 ? 0.08 : 0.02), Math.max(0.6, h * 0.008), Math.max(0.8, h * 0.014), 0, 0, Math.PI * 2); ctx.fill();
  }
  void p.light;
}

// ------------------------------------------------------------------ the bog body ----
/**
 * The bog body: the dead the peat has kept, leather over bone. Not swollen, as the drowned are, nor
 * green and crouched, as the ghoul is: tanned dark and shining by the bog and pressed thin, the ribs
 * and the hips sharp under the hide, the hair dyed red. The rope it went into the bog with is still
 * round its neck, the knot under the near ear and the end hanging down its chest; the neck is broken,
 * so the head lolls to the far side, the eyes shut and the mouth drawn. One hand is up at the rope,
 * as if to loosen it. Peat is black and wet on it to the knees, and drips.
 */
function bogBody(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const R = makeRig(x, y, h, p, { tilt: 0.02, hipTilt: -0.012, turn: 0.006, near: [0.072, 0.088, 0.1], far: [-0.076, -0.094, -0.11], toe: [0.5, -0.7] }, BONE);
  const { sy } = R;
  const hide = p.base, deep = shade(mix(p.dark, '#140c08', 0.5), 1), sheen = mix(p.light, '#f0d0a0', 0.35);
  const peat = shade('#1c1410', p.tone), hair = shade('#6a301a', p.tone), rope = shade('#a48c62', p.tone), ropeD = shade('#5a4830', p.tone);
  const sway = Math.sin(p.frame / 31) * h * 0.006;
  const D = (v: number) => sy + v * h;
  const cx = x + sway;
  // The head lolls over to the far side on the broken neck, and rolls a little as the body sways.
  const roll = -0.42 + Math.sin(p.frame / 43) * 0.05;
  const hx = x - h * 0.056 + sway * 1.6, hy = sy - h * 0.1, hr = h * 0.068;
  groundShadow(ctx, x, y + 1, h * 0.56);

  // ---- the far arm, hanging, and the far leg: a step darker, behind.
  const farEl = { x: x - h * 0.17, y: D(0.2) }, farWr = { x: x - h * 0.162, y: D(0.42) };
  blob(ctx, B, shade(hide, 0.74), [
    ...limb(R.sFar.x, R.sFar.y, farEl.x, farEl.y, farWr.x, farWr.y, h * 0.036, h * 0.026, 121),
  ], { h, formK: 0.5, spread: 0.7 });
  bogHand(ctx, farWr.x, farWr.y, -1, 0.9, h, shade(hide, 0.78));
  /** A leg, hip, knee and ankle, and its foot, the toes turned out to side s. */
  const leg = (l: readonly { x: number; y: number }[], s: number, seed: number): Part[] => {
    const a = l[2];
    return [
      ...limb(l[0].x, l[0].y, l[1].x, l[1].y, a.x, a.y, h * 0.046, h * 0.03, seed),
      { k: 'curve', pts: [a.x - s * h * 0.03, y - h * 0.004, a.x - s * h * 0.014, y - h * 0.05, a.x + s * h * 0.03, y - h * 0.024, a.x + s * h * 0.072, y - h * 0.008, a.x + s * h * 0.062, y + h * 0.006, a.x - s * h * 0.02, y + h * 0.008], wobble: 0.05, seed: seed + 3, sub: 2 },
    ];
  };
  /** The peat it came up out of: black on the foot, and wet up the shin, thinning out below the knee. */
  const peatOn = (l: readonly { x: number; y: number }[], s: number, seed: number): void => {
    const [, , ank] = l;
    patch(ctx, B, peat, [{ k: 'curve', pts: [
      ank.x - h * 0.036, ank.y - h * 0.02, ank.x + h * 0.036, ank.y - h * 0.024, ank.x + s * h * 0.074, y - h * 0.004,
      ank.x + s * h * 0.02, y + h * 0.006, ank.x - s * h * 0.052, y + h * 0.002,
    ], wobble: 0.08, seed, sub: 2 }], { alpha: 0.88, feather: 0.25 });
  };
  /** The wet on the shin, as shadows laid in the leg's own mass, darker toward the foot. */
  const shin = (l: readonly { x: number; y: number }[]): Crease[] => {
    const [, knee, ank] = l, up = (k: number) => ({ x: ank.x + (knee.x - ank.x) * k, y: ank.y + (knee.y - ank.y) * k });
    return [0.62, 0.42, 0.24].map((k) => ({ x0: ank.x, y0: ank.y + h * 0.02, x1: up(k).x, y1: up(k).y, r: h * 0.036, a: 0.28 }));
  };
  // ---- the trunk, the neck and both legs, one hide: pressed thin, the shoulders sharp, the belly
  //      sunk. The far leg is shaded down in the same mass, so the hip runs into it with no seam.
  const fl = R.legL;
  blob(ctx, B, hide, [
    ...leg(fl, -1, 123),
    ...leg(R.legR, 1, 125),
    { k: 'cap', x0: cx - h * 0.004, y0: D(0.0), x1: hx + hr * 0.42, y1: hy + hr * 0.62, r0: h * 0.036, r1: h * 0.032 },
    { k: 'curve', pts: [
      cx - h * 0.124, D(0.02), cx - h * 0.05, D(-0.026), cx + h * 0.058, D(-0.03), cx + h * 0.136, D(0.016),
      cx + h * 0.112, D(0.09), cx + h * 0.076, D(0.172), cx + h * 0.1, D(0.25), cx + h * 0.108, D(0.31),
      cx + h * 0.016, D(0.334), cx - h * 0.09, D(0.306), cx - h * 0.098, D(0.244), cx - h * 0.07, D(0.168),
      cx - h * 0.1, D(0.086),
    ], wobble: 0.03, seed: 127, sub: 3 },
    { k: 'ball', x: R.sNear.x - h * 0.014, y: R.sNear.y + h * 0.012, r: h * 0.044 },
    { k: 'ball', x: R.sFar.x + h * 0.012, y: R.sFar.y + h * 0.014, r: h * 0.04 },
  ], { h, formK: 0.55, spread: 0.8, gloss: 0.22, creases: [
    { x0: cx - h * 0.07, y0: D(0.2), x1: cx + h * 0.08, y1: D(0.205), r: h * 0.026, a: 0.4 },     // the sunk belly
    { x0: R.legR[1].x - h * 0.02, y0: R.legR[1].y - h * 0.01, x1: R.legR[1].x + h * 0.022, y1: R.legR[1].y + h * 0.01, r: h * 0.016, a: 0.35 }, // the knee
    { x0: fl[0].x, y0: fl[0].y + h * 0.03, x1: fl[1].x, y1: fl[1].y, r: h * 0.05, a: 0.3 },               // the far leg, in shadow
    { x0: fl[1].x, y0: fl[1].y, x1: fl[2].x, y1: fl[2].y, r: h * 0.036, a: 0.3 },
    { x0: cx - h * 0.006, y0: D(0.31), x1: cx - h * 0.02, y1: D(0.4), r: h * 0.012, a: 0.4 },             // between the thighs
    ...shin(fl), ...shin(R.legR),
  ] });
  peatOn(fl, -1, 129);
  peatOn(R.legR, 1, 131);
  if (!B.override) {
    // The ribs, the sternum and the hips, showing through the hide; a shine along it where the bog left it wet.
    for (let i = 0; i < 4; i++) {
      const v = 0.04 + i * 0.034, w = h * (0.088 - i * 0.008), sag = h * (0.02 + i * 0.004);
      softLine(ctx, B, [cx - w, D(v), cx - w * 0.2, D(v + sag / h), cx + w * 0.6, D(v + sag / h * 0.86), cx + w, D(v + 0.004)], hide, Math.max(1, h * 0.01), 0.42);
    }
    softLine(ctx, B, [cx + h * 0.004, D(0.02), cx + h * 0.008, D(0.15)], hide, Math.max(1, h * 0.009), 0.35);
    for (const s2 of [-1, 1]) softLine(ctx, B, [cx + s2 * h * 0.03, D(0.26), cx + s2 * h * 0.088, D(0.288)], hide, Math.max(1, h * 0.011), 0.4);
    softLine(ctx, B, [R.sFar.x + h * 0.01, R.sFar.y - h * 0.012, cx - h * 0.04, D(-0.02)], sheen, Math.max(1, h * 0.008), 0.4);
    softLine(ctx, B, [cx - h * 0.09, D(0.06), cx - h * 0.072, D(0.15)], sheen, Math.max(1, h * 0.007), 0.3);
  }

  // ---- the head, a skull under leather, tipped over: brows, shut eyes, a pressed nose, a drawn mouth.
  const ca = Math.cos(roll), sa = Math.sin(roll);
  const P = (lx: number, ly: number): [number, number] => [hx + (lx * ca - ly * sa) * hr, hy + (lx * sa + ly * ca) * hr];
  const M = (a: readonly number[]): number[] => { const o: number[] = []; for (let i = 0; i < a.length; i += 2) o.push(...P(a[i], a[i + 1])); return o; };
  blob(ctx, B, shade(hide, 1.04), [{ k: 'curve', pts: M([
    0, -1.08, 0.66, -0.9, 0.96, -0.36, 0.92, 0.22, 0.7, 0.72, 0.3, 1.02, -0.22, 1.02, -0.64, 0.74, -0.94, 0.24, -0.98, -0.36, -0.64, -0.9,
  ]), wobble: 0.04, seed: 129, sub: 2 }], { h, formK: 0.6, spread: 0.8, gloss: 0.25, creases: [
    { x0: P(-0.7, 0.1)[0], y0: P(-0.7, 0.1)[1], x1: P(-0.5, 0.6)[0], y1: P(-0.5, 0.6)[1], r: hr * 0.18, a: 0.35 },   // the sunk cheeks
    { x0: P(0.7, 0.1)[0], y0: P(0.7, 0.1)[1], x1: P(0.5, 0.6)[0], y1: P(0.5, 0.6)[1], r: hr * 0.18, a: 0.35 },
  ] });
  // The hair, red from the peat, matted flat to the crown and down the back of the head.
  blob(ctx, B, hair, [{ k: 'curve', pts: M([
    -1.02, -0.2, -0.86, -0.78, -0.3, -1.12, 0.3, -1.12, 0.84, -0.8, 1.0, -0.24, 0.72, -0.5, 0.3, -0.7, -0.24, -0.66, -0.7, -0.5,
  ]), wobble: 0.06, spiky: 0.06, seed: 131, sub: 2 }], { h, formK: 0.4, spread: 0.7 });
  if (!B.override) {
    // The brow over the shut eyes, the eyes shut, the nose pressed flat, and the mouth a drawn line.
    softLine(ctx, B, M([-0.72, -0.2, -0.2, -0.3, 0.2, -0.3, 0.72, -0.2]), deep, Math.max(1, hr * 0.14), 0.55);
    for (const s2 of [-1, 1]) softLine(ctx, B, M([s2 * 0.62, 0.02, s2 * 0.4, 0.08, s2 * 0.18, 0.02]), deep, Math.max(1, hr * 0.12), 0.85);
    softLine(ctx, B, M([0.02, 0.1, 0.1, 0.4, -0.08, 0.46]), deep, Math.max(1, hr * 0.1), 0.6);
    softLine(ctx, B, M([-0.42, 0.7, -0.1, 0.66, 0.2, 0.7, 0.46, 0.62]), deep, Math.max(1, hr * 0.12), 0.8);
  }

  // ---- the rope: a noose drawn tight round the neck, the knot under the near ear, the end down the chest.
  const knot = { x: cx + h * 0.032, y: D(-0.046) };
  const swing = Math.sin(p.frame / 29) * h * 0.008;
  const end = [knot.x + h * 0.012, knot.y + h * 0.04, cx + h * 0.05 + swing * 0.5, D(0.06), cx + h * 0.044 + swing, D(0.15), cx + h * 0.054 + swing * 1.4, D(0.23)];
  blob(ctx, B, rope, [
    { k: 'tube', pts: [cx - h * 0.046, D(-0.044), cx - h * 0.02, D(-0.018), cx + h * 0.012, D(-0.022), knot.x, knot.y], r0: h * 0.012, r1: h * 0.012 },
    { k: 'tube', pts: [knot.x, knot.y, ...end], r0: h * 0.012, r1: h * 0.009 },
    { k: 'ball', x: knot.x, y: knot.y, r: h * 0.02 },
  ], { h, formK: 0.45, spread: 0.7 });
  if (!B.override && h >= 40) {
    // The rope's lay, a dark tick every so often down its length, and the frayed end.
    for (let i = 1; i < end.length / 2; i++) softLine(ctx, B, [end[i * 2] - h * 0.008, end[i * 2 + 1] - h * 0.004, end[i * 2] + h * 0.008, end[i * 2 + 1] + h * 0.004], ropeD, Math.max(1, h * 0.006), 0.7);
    const ex = end[end.length - 2], ey = end[end.length - 1];
    for (const dx of [-1, 0, 1]) softLine(ctx, B, [ex, ey, ex + dx * h * 0.008, ey + h * 0.022], rope, Math.max(1, h * 0.005), 0.8);
  }

  // ---- the near arm, bent up to the rope on its chest, the hand closed on it under the knot.
  const nearEl = { x: x + h * 0.18, y: D(0.19) }, nearWr = { x: cx + h * 0.1, y: D(0.07) };
  blob(ctx, B, shade(hide, 0.98), [
    ...limb(R.sNear.x, R.sNear.y, nearEl.x, nearEl.y, nearWr.x, nearWr.y, h * 0.04, h * 0.03, 133),
  ], { h, formK: 0.5, spread: 0.7, gloss: 0.18 });
  // The fist: the palm on the near side of the rope, the fingers round it and over its far side.
  const rx2 = cx + h * 0.05 + swing * 0.6, grip: Part[] = [{ k: 'ell', x: nearWr.x - h * 0.016, y: nearWr.y - h * 0.004, rx: h * 0.026, ry: h * 0.024, rot: 0.3 }];
  for (let i = 0; i < 3; i++) {
    const by = nearWr.y - h * 0.018 + i * h * 0.014;
    grip.push({ k: 'tube', pts: [nearWr.x - h * 0.02, by, rx2 - h * 0.006, by - h * 0.002, rx2 - h * 0.016, by + h * 0.008], r0: h * 0.008, r1: h * 0.006, wobble: 0.05, seed: 135 + i });
  }
  blob(ctx, B, shade(hide, 1.02), grip, { h, formK: 0.5, spread: 0.75 });

  // Peat-water running off it: off the far hand, the shins and the rope's end.
  if (!B.override) for (let i = 0; i < 4; i++) {
    const t = ((p.frame * 0.02 + i * 0.27) % 1);
    const dx2 = [farWr.x, R.legL[2].x + h * 0.02, R.legR[2].x + h * 0.03, end[end.length - 2]][i], dy2 = [farWr.y + h * 0.07, R.legL[1].y + h * 0.12, R.legR[1].y + h * 0.12, end[end.length - 1] + h * 0.02][i];
    ctx.fillStyle = B.col(rgba(shade('#2a1e14', p.tone), 0.45 * (1 - t)));
    ctx.beginPath(); ctx.ellipse(dx2, dy2 + t * h * 0.08, Math.max(0.6, h * 0.008), Math.max(0.8, h * 0.014), 0, 0, Math.PI * 2); ctx.fill();
  }
}

/** A hand hanging slack, long-fingered, as a bog body's do: the fingers hang, they do not reach. */
function bogHand(ctx: CanvasRenderingContext2D, wx: number, wy: number, s: number, k: number, h: number, hex: string): void {
  const parts: Part[] = [{ k: 'ell', x: wx, y: wy + h * 0.016, rx: h * 0.024 * k, ry: h * 0.024 * k, rot: 0.1 * s }];
  for (let i = 0; i < 4; i++) {
    const bx = wx + s * (i - 1.4) * h * 0.013, by = wy + h * 0.028, l = h * (0.058 + (i === 1 ? 0.01 : 0)) * k;
    parts.push({ k: 'tube', pts: [bx, by, bx + s * h * 0.004, by + l * 0.6, bx - s * h * 0.008, by + l], r0: h * 0.01 * k, r1: h * 0.005, wobble: 0.05, seed: 140 + i });
  }
  blob(ctx, B, hex, parts, { h, formK: 0.5, spread: 0.75 });
}

// ------------------------------------------------------------------ the Cairn King ----
/**
 * The Cairn King: crowned, and older than the crown. The oldest bones on the road, brown with age,
 * seated upright on a seat at the end of his chamber, a post at each corner of its back: a seat cut
 * cleaner than anything the hill folk made, dark, smooth and square, with nothing carved on it. A
 * mantle of fur gone black lies over his shoulders and down the seat behind him; the hill folk's
 * grave-gold is on him, a crescent collar on the breast, a ring on the arm and a crown of points on
 * the skull. The far hand rests on the arm of the seat; the near one is up, open toward the company,
 * and something cold is in the palm: the curse. In hundredths of the height up from the ground line,
 * the seat's back reaches 77, its posts 88 and the crown's points 97.
 */
function cairnKing(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const u = h / 100, X = (v: number) => x + v * u, U = (v: number) => y - v * u;
  const t = p.frame, tone = p.tone;
  const nod = Math.sin(t / 47) * 0.6, lift = p.breathe * 0.4;            // the old dead barely move
  // The curse: the open hand lifts a little and falls back, and the cold in it swells as it lifts.
  const curse = 0.5 + 0.5 * Math.sin(t / 17);
  const bn = p.base, old = p.dark, murk = mix(old, INK, 0.8);
  const seat = shade('#2e333c', tone), seatL = mix(seat, '#a8b4c4', 0.32), seatD = mix(seat, '#0a0c10', 0.45);
  const fur = shade('#34281f', tone), gold = shade('#d8ac48', Math.max(0.6, tone)), goldD = shade('#6e4e16', Math.max(0.6, tone));
  const cold = '#cbb8ff';
  groundShadow(ctx, x, y + 1, h * 0.62);

  // ---- the seat: the back, as high as his shoulders with a rounded post at each corner, so the
  //      crowned head stands clear of it between them, flashed as well as lit; the arms; and the
  //      block he sits on.
  const back: number[] = [X(-24), U(30), X(-24), U(85)];
  const post = (x0: number, x1: number): void => {
    for (let i = 0; i <= 6; i++) { const a = Math.PI - (i / 6) * Math.PI; back.push(X((x0 + x1) / 2 + Math.cos(a) * (x1 - x0) / 2), U(85 + Math.sin(a) * 3)); }
  };
  post(-24, -17); back.push(X(-17), U(77), X(17), U(77)); post(17, 24);
  back.push(X(24), U(85), X(24), U(30));
  blob(ctx, B, seat, [{ k: 'poly', pts: back }], { h, form: false, spread: 0.6, gloss: 0.25 });
  blob(ctx, B, shade(seat, 1.06), [
    { k: 'poly', pts: [X(-30), U(35), X(-30), U(48), X(-19), U(48), X(-19), U(35)] },
    { k: 'poly', pts: [X(19), U(35), X(19), U(48), X(30), U(48), X(30), U(35)] },
  ], { h, form: false, spread: 0.6, gloss: 0.3 });
  blob(ctx, B, shade(seat, 0.94), [{ k: 'poly', pts: [X(-27), U(0), X(-27), U(36), X(27), U(36), X(27), U(0)] }], { h, form: false, spread: 0.6 });
  if (!B.override) {
    // Its edges, cut clean: a fine lit line along each top and left edge, a dark one along the right.
    const lw = Math.max(1, 0.7 * u);
    softLine(ctx, B, [X(-22.6), U(31), X(-22.6), U(85), X(-20.5), U(86.6), X(-18.4), U(85), X(-18.4), U(76)], seatL, lw, 0.7);
    softLine(ctx, B, [X(-16), U(75.6), X(16), U(75.6)], seatL, lw, 0.5);
    softLine(ctx, B, [X(22.6), U(31), X(22.6), U(85)], seatD, lw * 1.4, 0.6);
    softLine(ctx, B, [X(-25.6), U(1), X(-25.6), U(34.6), X(25.6), U(34.6)], seatL, lw, 0.6);
    for (const s of [-1, 1]) softLine(ctx, B, [X(s * 29), U(36), X(s * 29), U(46.8), X(s * 20), U(46.8)], seatL, lw, 0.6);
    softLine(ctx, B, [X(-26), U(31.5), X(26), U(31.5)], seatD, lw, 0.45);
  }

  // ---- the mantle's fall, behind him and down the seat between his arms and its back.
  blob(ctx, B, fur, [{ k: 'curve', pts: [
    X(-19), U(76 + lift), X(0), U(79 + lift), X(19), U(76 + lift), X(22), U(62), X(21), U(42), X(15), U(37), X(-15), U(37), X(-21), U(42), X(-22), U(62),
  ], wobble: 0.05, spiky: 0.06, seed: 141, sub: 3 }], { h, tex: 'fur', seed: 141, amount: 0.6, formK: 0.4, spread: 0.7 });

  // ---- the far arm, a step darker, down to the seat's arm, the hand over its end.
  const fSh = { x: X(-15), y: U(71 + lift) }, fEl = { x: X(-22), y: U(53) }, fWr = { x: X(-24), y: U(46.5) };
  blob(ctx, B, old, limb(fSh.x, fSh.y, fEl.x, fEl.y, fWr.x, fWr.y, 2.5 * u, 2.1 * u, 143), { h, formK: 0.5 });
  gap(ctx, fEl.x, fEl.y, fSh.x, fSh.y, 2.4 * u, murk, 0.6);
  boneHand(ctx, fWr.x, fWr.y + 0.6 * u, 1.62, u, old, -1);

  // ---- the legs: the thighs on the seat toward the company, the knees at its edge, the shins down
  //      the block to the feet on the floor. The far one is a step darker.
  for (const s of [-1, 1] as const) {
    const hex = s < 0 ? old : bn, k = s < 0 ? 0.92 : 1;
    const hip = { x: X(s * 7.5), y: U(39) }, knee = { x: X(s * 11), y: U(33.5) }, ank = { x: X(s * 12.5), y: U(5) };
    blob(ctx, B, hex, [
      shaft(hip.x, hip.y, knee.x, knee.y, 4.2 * u * k, 145 + s),
      shaft(knee.x, knee.y + 1.2 * u, ank.x, ank.y, 3 * u * k, 147 + s),
      { k: 'ball', x: knee.x, y: knee.y + 0.6 * u, r: 3.6 * u * k },
      { k: 'poly', pts: [ank.x - s * 3 * u, ank.y, ank.x + s * 2.6 * u, ank.y, ank.x + s * 7 * u, U(1.4), ank.x + s * 6.4 * u, U(-0.6), ank.x - s * 3.4 * u, U(-0.6)] },
    ], { h, formK: 0.5 });
    gap(ctx, knee.x, knee.y + 2.4 * u, ank.x, ank.y, 2.8 * u, murk, 0.55);
  }

  // ---- the trunk: the pelvis on the seat, the spine up out of it, and the cage of the ribs over a
  //      hollow, so the dark between them reads as space.
  hollow(ctx, [X(-11), U(68), X(0), U(69.5), X(11), U(68), X(10.5), U(60), X(7.5), U(53), X(0), U(55), X(-7.5), U(53), X(-10.5), U(60)], murk, 0.04, 149);
  const ribs: Part[] = [
    { k: 'curve', pts: [X(-12), U(36), X(-11), U(41), X(-5), U(42.5), X(0), U(40.5), X(5), U(42.5), X(11), U(41), X(12), U(36), X(8), U(35), X(0), U(36.5), X(-8), U(35)], wobble: 0.03, seed: 151, sub: 2 },
    { k: 'tube', pts: [X(0), U(41), X(0.4), U(47), X(0), U(54)], r0: 2.6 * u, r1: 2.3 * u },
    { k: 'ball', x: X(0.2), y: U(44), r: 2.4 * u }, { k: 'ball', x: X(0.3), y: U(48.5), r: 2.3 * u },
  ];
  for (let i = 0; i < 3; i++) {
    const W = [10, 11.5, 11.8][i], v = 67 - i * 4.4, d = [2.6, 3.2, 3.6][i];
    ribs.push({ k: 'tube', pts: [X(-W), U(v), X(-W * 0.6), U(v - d * 0.6), X(0), U(v - d), X(W * 0.6), U(v - d * 0.6), X(W), U(v)], r0: 1.15 * u, r1: 1.05 * u });
  }
  ribs.push({ k: 'tube', pts: [X(-11), U(55.5), X(-6), U(53), X(-1), U(54.8), X(4), U(53.2), X(10.5), U(55.5)], r0: 1.05 * u, r1: 1.05 * u });
  ribs.push({ k: 'tube', pts: [X(0.4), U(70), X(0.6), U(56)], r0: 1.4 * u, r1: 1.1 * u });
  blob(ctx, B, bn, ribs, { h, formK: 0.5, tex: 'cracks', seed: 153, amount: 0.4 });
  if (!B.override) {
    ctx.fillStyle = B.col(mix(murk, INK, 0.45));
    pathEllipse(ctx, X(0), U(38.4), 2.6 * u, 1.6 * u); ctx.fill();
  }

  // ---- the near arm, raised from the elbow, the hand open to the company: the curse.
  const nSh = { x: X(15.5), y: U(71 + lift) }, nEl = { x: X(26), y: U(57) }, nWr = { x: X(29.5), y: U(67 + curse * 3) };
  blob(ctx, B, bn, limb(nSh.x, nSh.y, nEl.x, nEl.y, nWr.x, nWr.y, 2.6 * u, 2.2 * u, 155), { h, formK: 0.5 });
  gap(ctx, nEl.x, nEl.y, nSh.x, nSh.y, 2.5 * u, murk, 0.6);
  // A ring of gold on the forearm.
  const ra = Math.atan2(nWr.y - nEl.y, nWr.x - nEl.x), rx = nEl.x + (nWr.x - nEl.x) * 0.55, ry = nEl.y + (nWr.y - nEl.y) * 0.55;
  blob(ctx, B, gold, [{ k: 'ell', x: rx, y: ry, rx: 1.4 * u, ry: 3 * u, rot: ra }], { h, formK: 0.5, gloss: 0.6 });
  boneHand(ctx, nWr.x, nWr.y, -1.42 - curse * 0.12, u, bn, 1);
  if (!B.override) {
    glow(ctx, B, nWr.x + 1.4 * u, nWr.y - 5.5 * u, (7 + 4 * curse) * u, cold, 0.25 + 0.3 * curse, '#ffffff');
  }

  // ---- the mantle's collar over both shoulders, the arms out from under it.
  blob(ctx, B, fur, [
    { k: 'curve', pts: [X(-22), U(68), X(-21), U(75 + lift), X(-12), U(79.5 + lift), X(0), U(80.5 + lift), X(12), U(79.5 + lift), X(21), U(75 + lift), X(22), U(68), X(13), U(71.5), X(0), U(72.5), X(-13), U(71.5)], wobble: 0.06, spiky: 0.1, seed: 157, sub: 3 },
  ], { h, tex: 'fur', seed: 157, amount: 0.7, formK: 0.45, spread: 0.7 });

  // ---- the grave-gold collar, a crescent on the breast under the mantle's edge.
  blob(ctx, B, gold, [{ k: 'curve', pts: [
    X(-11.5), U(73), X(-6), U(71.6), X(0), U(71.2), X(6), U(71.6), X(11.5), U(73), X(9.5), U(68.6), X(5), U(65.6), X(0), U(64.8), X(-5), U(65.6), X(-9.5), U(68.6),
  ], wobble: 0.015, seed: 159, sub: 2 }], { h, formK: 0.5, spread: 0.6, gloss: 0.55 });
  if (!B.override && h >= 40) {
    // Rows of tooling round the crescent, and its lit edge.
    softLine(ctx, B, [X(-9), U(70.6), X(-4.5), U(68.6), X(0), U(68), X(4.5), U(68.6), X(9), U(70.6)], goldD, Math.max(1, 0.6 * u), 0.6);
    softLine(ctx, B, [X(-7.5), U(68.6), X(-3.5), U(66.8), X(0), U(66.4), X(3.5), U(66.8), X(7.5), U(68.6)], goldD, Math.max(1, 0.5 * u), 0.5);
  }

  // ---- the skull, a little bowed, and the crown on it.
  const hx = X(0.6 + nod * 0.3), hy = U(84.5 + lift), hr = 7.6 * u;
  skull(ctx, hx, hy, hr, 0.03 + nod * 0.02, bn, old, h, 0.02, murk);
  const cb = U(89.3 + lift), ct2 = U(91.8 + lift);
  const crown: number[] = [hx - 8 * u, cb + 0.6 * u];
  for (const [ox, top] of [[-7.6, 94], [-3.8, 95.8], [0, 97], [3.8, 95.8], [7.6, 94]] as const) {
    crown.push(hx + (ox - 1.6) * u, ct2, hx + ox * u, U(top + lift), hx + (ox + 1.6) * u, ct2);
  }
  crown.push(hx + 8 * u, cb + 0.6 * u, hx + 4 * u, cb + 1.6 * u, hx - 4 * u, cb + 1.6 * u);
  blob(ctx, B, gold, [{ k: 'poly', pts: crown }], { h, formK: 0.5, spread: 0.6, gloss: 0.5 });
  if (!B.override) {
    softLine(ctx, B, [hx - 7.4 * u, cb - 0.4 * u, hx, cb + 0.4 * u, hx + 7.4 * u, cb - 0.4 * u], goldD, Math.max(1, 0.7 * u), 0.6);
    // Points of cold far back in the sockets.
    const glint = mix(cold, '#ffffff', 0.15 + 0.35 * curse);
    for (const [ex, ey, r] of [[hx - hr * 0.42, hy, 0.55], [hx + hr * 0.4, hy - 0.4 * u, 0.62]] as const) {
      glow(ctx, B, ex, ey, 2.4 * u, cold, 0.3 + 0.3 * curse, '#ffffff');
      eye(ctx, ex, ey, Math.max(0.8, r * u), glint, false);
    }
  }
}

