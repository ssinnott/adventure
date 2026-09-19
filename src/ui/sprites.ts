// Vector sprites for the viewport and the combat screen, cel-shaded with the engine's helpers
// through a Brush. Every monster draws front-facing, centred on (x, y) with y the ground line and
// `h` the intended height. `tone` darkens with distance; `flash` paints the hit frame white.
import type { MonsterSprite } from '../game/monsters.ts';
import { shade, mix, rgba } from '../lib/art/palettes.ts';
import { pathEllipse, pathPoly } from '../lib/art/shapes.ts';
import { celBall, celCapsule, celPoly, celTaper, band, outlinePath, tones } from '../lib/art/shading.ts';
import { makeBrush, hash } from './brush.ts';

const B = makeBrush('#120c14', 1);

/** Outline + base + a hand-placed shadow half for an ellipse (the helpers have no ellipse). */
function celEllipse(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, hex: string, rot = 0): void {
  pathEllipse(ctx, cx, cy, rx, ry, rot);
  outlinePath(ctx, B);
  const t = tones(B, hex);
  ctx.fillStyle = B.col(t.base); ctx.fill();
  if (B.override) return;
  ctx.save(); ctx.clip();
  ctx.fillStyle = t.sh; ctx.fillRect(cx - rx - 2, cy + ry * 0.25, rx * 2 + 4, ry); ctx.fillRect(cx + rx * 0.45, cy - ry - 2, rx, ry * 2 + 4);
  if (Math.min(rx, ry) >= 6) { ctx.fillStyle = t.hi; pathEllipse(ctx, cx - rx * 0.35, cy - ry * 0.4, rx * 0.35, ry * 0.25); ctx.fill(); }
  ctx.restore();
}

function eye(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, pupil = true): void {
  ctx.beginPath(); ctx.arc(x, y, Math.max(0.8, r), 0, Math.PI * 2); ctx.fillStyle = B.col(color); ctx.fill();
  if (pupil && r >= 1.5 && !B.override) { ctx.fillStyle = '#120c14'; ctx.fillRect(Math.round(x - r * 0.3), Math.round(y - r * 0.3), Math.max(1, Math.round(r * 0.7)), Math.max(1, Math.round(r * 0.7))); }
}

function stroke(ctx: CanvasRenderingContext2D, pts: number[], color: string, w: number): void {
  ctx.strokeStyle = B.col(color); ctx.lineWidth = w; ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  ctx.beginPath(); ctx.moveTo(pts[0], pts[1]);
  for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]);
  ctx.stroke();
}

/** Contact shadow on the ground under a sprite. */
export function groundShadow(ctx: CanvasRenderingContext2D, x: number, y: number, w: number): void {
  pathEllipse(ctx, x, y, w / 2, Math.max(1.5, w * 0.12));
  ctx.fillStyle = 'rgba(0,0,0,0.35)'; ctx.fill();
}

// ---------------------------------------------------------------- scenery ----

export function drawTreeSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, variant: number): void {
  const conifer = variant >= 3;
  const trunk = shade('#5a3f2a', tone), leaf = shade(['#3f7a3a', '#4a8a3a', '#356a34', '#2f6a3a', '#3a7a4a'][variant], tone);
  if (conifer) {
    const h = u * 2.6, w = u * 1.2;
    celCapsule(ctx, B, x, y, x, y - h * 0.3, u * 0.12, trunk, 0);
    for (let i = 0; i < 3; i++) {
      const ty = y - h * (0.25 + i * 0.25), tw = w * (1 - i * 0.22), th = h * 0.36;
      celPoly(ctx, B, [x - tw / 2, ty, x, ty - th, x + tw / 2, ty], shade(leaf, 1 - i * 0.06), 0.4, 0.25);
    }
  } else {
    const h = u * 2.3, r = u * 0.8;
    celTaper(ctx, B, x, y, x, y - h * 0.5, u * 0.16, u * 0.11, trunk, 0.2);
    // Branch hints.
    stroke(ctx, [x, y - h * 0.4, x - u * 0.35, y - h * 0.55], trunk, Math.max(1, u * 0.08));
    stroke(ctx, [x, y - h * 0.45, x + u * 0.3, y - h * 0.6], trunk, Math.max(1, u * 0.08));
    celBall(ctx, B, x - r * 0.55, y - h * 0.55, r * 0.62, shade(leaf, 0.92));
    celBall(ctx, B, x + r * 0.55, y - h * 0.58, r * 0.62, shade(leaf, 1.05));
    celBall(ctx, B, x, y - h * 0.72, r * 0.75, leaf);
    celBall(ctx, B, x - r * 0.2, y - h * 0.5, r * 0.5, shade(leaf, 0.85), false);
  }
}

export function drawRockSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number): void {
  const w = u * 1.3, h = u * 0.8;
  const c = shade('#7a7468', tone);
  celPoly(ctx, B, [x - w / 2, y, x - w * 0.4, y - h * 0.7, x - w * 0.1, y - h, x + w * 0.25, y - h * 0.85, x + w / 2, y - h * 0.4, x + w * 0.42, y], c, 0.4, 0.3);
  celPoly(ctx, B, [x - w * 0.4, y - h * 0.7, x - w * 0.1, y - h, x + w * 0.25, y - h * 0.85, x + w * 0.02, y - h * 0.62], shade(c, 1.15), 0.2, 0.2);
  celBall(ctx, B, x + w * 0.42, y - u * 0.12, u * 0.18, shade(c, 0.9), false);
}

export function drawMountainSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, variant: number): void {
  const w = u * 2.6, h = u * (1.7 + variant * 0.25);
  const c = shade('#6a6670', tone);
  celPoly(ctx, B, [x - w / 2, y, x - w * 0.22, y - h * 0.6, x - w * 0.08, y - h, x + w * 0.12, y - h * 0.8, x + w * 0.3, y - h * 0.55, x + w / 2, y], c, 0.45, 0.25);
  // Snow cap and a ridge line.
  celPoly(ctx, B, [x - w * 0.15, y - h * 0.78, x - w * 0.08, y - h, x + w * 0.12, y - h * 0.8, x + w * 0.05, y - h * 0.7, x - w * 0.02, y - h * 0.76], shade('#e8ecf0', tone), 0.3, 0.2);
  stroke(ctx, [x - w * 0.08, y - h, x - w * 0.02, y - h * 0.6, x + w * 0.06, y - h * 0.3], shade(c, 0.7), 1);
}

export function drawPillarSprite(ctx: CanvasRenderingContext2D, x: number, horizon: number, u: number, tone: number): void {
  const w = u * 0.5, c = shade('#8a8690', tone);
  celPoly(ctx, B, [x - w / 2, horizon + u, x - w * 0.4, horizon - u * 0.9, x + w * 0.4, horizon - u * 0.9, x + w / 2, horizon + u], c, 0.4, 0.3);
  band(ctx, B, x - w * 0.6, horizon - u, w * 1.2, u * 0.14, shade(c, 1.1));
  band(ctx, B, x - w * 0.6, horizon + u - u * 0.12, w * 1.2, u * 0.12, shade(c, 0.9));
}

// ---------------------------------------------------------------- monsters ----

/**
 * Draw a monster. `h` is the intended height in px; `frame` drives a small idle motion.
 */
export function drawMonsterSprite(ctx: CanvasRenderingContext2D, kind: MonsterSprite, x: number, y: number, h: number, tint: string, tone: number, frame: number, flash = false): void {
  B.flash(flash);
  const breathe = Math.sin(frame / 14);
  const base = shade(tint, tone);
  const dark = shade(tint, tone * 0.72);
  const light = shade(tint, tone * 1.15);
  const amber = shade('#ffd070', Math.max(0.6, tone));
  groundShadow(ctx, x, y + 1, h * (kind === 'spider' ? 1.6 : kind === 'wolf' || kind === 'boar' || kind === 'rat' ? 1.3 : 0.7));
  switch (kind) {
    case 'rat': rat(ctx, x, y, h, base, dark, light, amber, breathe); break;
    case 'wolf': wolf(ctx, x, y, h, base, dark, light, amber, breathe); break;
    case 'boar': boar(ctx, x, y, h, base, dark, light, breathe); break;
    case 'spider': spider(ctx, x, y, h, base, dark, light, frame); break;
    case 'slime': slime(ctx, x, y, h, base, dark, light, breathe); break;
    case 'bandit': bandit(ctx, x, y, h, base, dark, light, tone, breathe); break;
    case 'cultist': cultist(ctx, x, y, h, base, dark, light, tone, frame); break;
    case 'skeleton': skeleton(ctx, x, y, h, tone, breathe); break;
    case 'riftling': riftling(ctx, x, y, h, base, dark, light, frame, false); break;
    case 'warden': riftling(ctx, x, y, h, base, dark, light, frame, true); break;
  }
  B.flash(false);
}

function rat(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, base: string, dark: string, light: string, amber: string, br: number): void {
  const w = h * 1.7;
  // Tail first (behind).
  ctx.strokeStyle = B.col(shade(base, 0.8)); ctx.lineWidth = Math.max(1, h * 0.07); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - w * 0.42, y - h * 0.3); ctx.quadraticCurveTo(x - w * 0.8, y - h * 0.6 + br * 2, x - w * 0.85, y - h * 0.05); ctx.stroke();
  // Hind and fore feet.
  for (const fx of [-0.28, -0.1, 0.18, 0.32]) celCapsule(ctx, B, x + w * fx, y - h * 0.12, x + w * fx + h * 0.08, y, h * 0.06, shade(base, 0.9), 0);
  // Body and head.
  celEllipse(ctx, x, y - h * 0.4 + br * 0.5, w * 0.42, h * 0.36, base);
  celEllipse(ctx, x + w * 0.4, y - h * 0.5, h * 0.3, h * 0.26, base);
  // Ears, snout, eye, whiskers, teeth.
  celBall(ctx, B, x + w * 0.3, y - h * 0.78, h * 0.11, light);
  celBall(ctx, B, x + w * 0.42, y - h * 0.8, h * 0.11, light);
  celBall(ctx, B, x + w * 0.62, y - h * 0.45, h * 0.07, dark, false);
  eye(ctx, x + w * 0.47, y - h * 0.56, h * 0.06, amber);
  stroke(ctx, [x + w * 0.58, y - h * 0.4, x + w * 0.78, y - h * 0.48], shade('#f0ead8', 0.8), 1);
  stroke(ctx, [x + w * 0.58, y - h * 0.38, x + w * 0.78, y - h * 0.32], shade('#f0ead8', 0.8), 1);
  ctx.fillStyle = B.col('#f0ead8'); ctx.fillRect(x + w * 0.54, y - h * 0.36, Math.max(1, h * 0.04), Math.max(1, h * 0.08));
}

function wolf(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, base: string, dark: string, light: string, amber: string, br: number): void {
  const w = h * 1.8;
  // Far legs, tail, body, near legs, head.
  celTaper(ctx, B, x - w * 0.28, y - h * 0.42, x - w * 0.34, y, h * 0.07, h * 0.06, dark, 0);
  celTaper(ctx, B, x + w * 0.18, y - h * 0.42, x + w * 0.14, y, h * 0.07, h * 0.06, dark, 0);
  celTaper(ctx, B, x - w * 0.45, y - h * 0.5, x - w * 0.7, y - h * 0.75 + br * 2, h * 0.09, h * 0.05, shade(base, 0.9), 0.2);
  celEllipse(ctx, x, y - h * 0.5, w * 0.45, h * 0.24, base, -0.05);
  celTaper(ctx, B, x - w * 0.2, y - h * 0.42, x - w * 0.22, y, h * 0.08, h * 0.07, base, 0.2);
  celTaper(ctx, B, x + w * 0.3, y - h * 0.42, x + w * 0.32, y, h * 0.08, h * 0.07, base, 0.2);
  // Chest ruff.
  celBall(ctx, B, x + w * 0.3, y - h * 0.5, h * 0.2, light, false);
  // Head with snout and ears.
  celEllipse(ctx, x + w * 0.42, y - h * 0.7, h * 0.24, h * 0.2, base);
  celTaper(ctx, B, x + w * 0.5, y - h * 0.66, x + w * 0.66, y - h * 0.6, h * 0.12, h * 0.07, base, 0.2);
  celBall(ctx, B, x + w * 0.68, y - h * 0.6, h * 0.05, '#1a1418', false);
  celPoly(ctx, B, [x + w * 0.32, y - h * 0.82, x + w * 0.3, y - h * 1.05, x + w * 0.4, y - h * 0.88], base, 0.4, 0);
  celPoly(ctx, B, [x + w * 0.44, y - h * 0.84, x + w * 0.46, y - h * 1.06, x + w * 0.52, y - h * 0.86], base, 0.4, 0);
  eye(ctx, x + w * 0.45, y - h * 0.73, h * 0.045, amber);
  // Teeth.
  ctx.fillStyle = B.col('#f0ead8');
  for (let i = 0; i < 3; i++) ctx.fillRect(x + w * (0.52 + i * 0.045), y - h * 0.56, Math.max(1, h * 0.025), Math.max(1, h * 0.05));
}

function boar(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, base: string, dark: string, light: string, br: number): void {
  const w = h * 1.75;
  for (const [fx, c] of [[-0.3, dark], [0.12, dark], [-0.18, base], [0.26, base]] as [number, string][]) celTaper(ctx, B, x + w * fx, y - h * 0.4, x + w * fx, y, h * 0.09, h * 0.08, c, 0.15);
  celEllipse(ctx, x, y - h * 0.52 + br * 0.4, w * 0.44, h * 0.32, base);
  // Bristle ridge.
  ctx.fillStyle = B.col(dark);
  for (let i = 0; i < 7; i++) { const bx = x - w * 0.3 + i * w * 0.08; ctx.beginPath(); ctx.moveTo(bx, y - h * 0.82); ctx.lineTo(bx + w * 0.03, y - h * 0.96); ctx.lineTo(bx + w * 0.06, y - h * 0.82); ctx.fill(); }
  // Head, snout disc, tusks, ear, eye.
  celEllipse(ctx, x + w * 0.4, y - h * 0.5, h * 0.3, h * 0.28, dark);
  celBall(ctx, B, x + w * 0.6, y - h * 0.42, h * 0.12, shade(base, 0.85));
  ctx.fillStyle = B.col('#2a1a18'); ctx.fillRect(x + w * 0.57, y - h * 0.45, h * 0.05, h * 0.04); ctx.fillRect(x + w * 0.63, y - h * 0.45, h * 0.05, h * 0.04);
  celPoly(ctx, B, [x + w * 0.5, y - h * 0.32, x + w * 0.62, y - h * 0.22, x + w * 0.56, y - h * 0.36], shade('#f0ead8', 0.95), 0.3, 0);
  celPoly(ctx, B, [x + w * 0.42, y - h * 0.32, x + w * 0.5, y - h * 0.2, x + w * 0.47, y - h * 0.36], shade('#f0ead8', 0.95), 0.3, 0);
  celPoly(ctx, B, [x + w * 0.28, y - h * 0.7, x + w * 0.26, y - h * 0.9, x + w * 0.38, y - h * 0.76], dark, 0.4, 0);
  eye(ctx, x + w * 0.46, y - h * 0.58, h * 0.04, '#e05030', false);
  void light;
}

function spider(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, base: string, dark: string, light: string, frame: number): void {
  const w = h * 2.0;
  // Eight legs with a knee each; near ones drawn after the body.
  const leg = (s: number, i: number, front: boolean) => {
    const a = -0.35 + i * 0.32 + (front ? 0 : 0.05);
    const twitch = Math.sin(frame / 9 + i) * h * 0.02;
    const kx = x + s * (w * 0.2 + Math.cos(a) * w * 0.28), ky = y - h * 0.62 - Math.abs(Math.sin(a)) * h * 0.2 + twitch;
    const fx = x + s * (w * 0.28 + Math.cos(a) * w * 0.5), fy = y + (i - 1.5) * h * 0.02;
    celTaper(ctx, B, x + s * w * 0.1, y - h * 0.48, kx, ky, h * 0.05, h * 0.04, front ? base : dark, 0);
    celTaper(ctx, B, kx, ky, fx, fy, h * 0.04, h * 0.02, front ? base : dark, 0);
  };
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) if (i % 2 === 0) leg(s, i, false);
  celEllipse(ctx, x - w * 0.05, y - h * 0.5, w * 0.22, h * 0.34, base);
  // Abdomen marking.
  celPoly(ctx, B, [x - w * 0.12, y - h * 0.62, x - w * 0.05, y - h * 0.78, x + w * 0.02, y - h * 0.62, x - w * 0.05, y - h * 0.4], light, 0.2, 0.2);
  celBall(ctx, B, x + w * 0.16, y - h * 0.42, h * 0.16, dark);
  for (const s of [-1, 1]) for (let i = 0; i < 4; i++) if (i % 2 === 1) leg(s, i, true);
  // Eyes cluster and fangs.
  for (const [ex, ey, r] of [[0.14, 0.5, 0.035], [0.2, 0.5, 0.035], [0.12, 0.44, 0.025], [0.22, 0.44, 0.025]]) eye(ctx, x + w * ex, y - h * ey, h * r, '#ff5a40', false);
  celPoly(ctx, B, [x + w * 0.14, y - h * 0.3, x + w * 0.16, y - h * 0.18, x + w * 0.19, y - h * 0.3], '#f0ead8', 0.2, 0);
  celPoly(ctx, B, [x + w * 0.2, y - h * 0.3, x + w * 0.23, y - h * 0.18, x + w * 0.25, y - h * 0.3], '#f0ead8', 0.2, 0);
}

function slime(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, base: string, dark: string, light: string, br: number): void {
  const w = h * 1.5 * (1 + br * 0.03), hh = h * 0.8 * (1 - br * 0.03);
  // Puddle, body, core, bubbles, drips.
  pathEllipse(ctx, x, y, w * 0.55, h * 0.08); ctx.fillStyle = B.col(rgba(dark, 0.6)); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(x - w / 2, y);
  ctx.bezierCurveTo(x - w * 0.55, y - hh * 0.9, x - w * 0.15, y - hh * 1.15, x + w * 0.05, y - hh);
  ctx.bezierCurveTo(x + w * 0.35, y - hh * 1.05, x + w * 0.52, y - hh * 0.5, x + w / 2, y);
  ctx.closePath();
  outlinePath(ctx, B);
  const t = tones(B, base);
  ctx.fillStyle = B.col(t.base); ctx.fill();
  if (!B.override) {
    ctx.save(); ctx.clip();
    ctx.fillStyle = t.sh; ctx.fillRect(x - w, y - hh * 0.35, w * 2, hh); ctx.fillRect(x + w * 0.25, y - hh * 2, w, hh * 3);
    ctx.fillStyle = t.hi; pathEllipse(ctx, x - w * 0.2, y - hh * 0.7, w * 0.16, hh * 0.12); ctx.fill();
    ctx.fillStyle = rgba(dark, 0.7); pathEllipse(ctx, x + w * 0.05, y - hh * 0.4, w * 0.16, hh * 0.18); ctx.fill();
    ctx.fillStyle = rgba(light, 0.5); for (let i = 0; i < 4; i++) { const bx = x - w * 0.3 + i * w * 0.18, by = y - hh * (0.25 + (i % 2) * 0.3); ctx.beginPath(); ctx.arc(bx, by, h * 0.035, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  eye(ctx, x - w * 0.12, y - hh * 0.5, h * 0.05, '#1a1418', false); eye(ctx, x + w * 0.14, y - hh * 0.52, h * 0.05, '#1a1418', false);
}

/** Shared humanoid frame: legs, boots, torso, arms; the callers add gear and head. */
function figure(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, cloth: string, trouser: string, skin: string, boots: string, br: number): { shoulder: number; hip: number; w: number } {
  const w = h * 0.42, hip = y - h * 0.48, shoulder = y - h * 0.74 + br * 0.5;
  // Legs and boots.
  for (const s of [-1, 1]) {
    celTaper(ctx, B, x + s * w * 0.2, hip, x + s * w * 0.26, y - h * 0.1, h * 0.075, h * 0.06, trouser, 0.15);
    celPoly(ctx, B, [x + s * w * 0.26 - h * 0.07, y - h * 0.12, x + s * w * 0.26 + h * 0.07, y - h * 0.12, x + s * w * 0.26 + h * 0.09, y, x + s * w * 0.26 - h * 0.08, y], boots, 0.35, 0.2);
  }
  // Torso.
  celPoly(ctx, B, [x - w * 0.5, shoulder, x + w * 0.5, shoulder, x + w * 0.42, hip + h * 0.04, x - w * 0.42, hip + h * 0.04], cloth, 0.35, 0.3);
  // Arms: upper and lower, hands.
  for (const s of [-1, 1]) {
    const ex = x + s * w * 0.72, ey = shoulder + h * 0.16;
    celTaper(ctx, B, x + s * w * 0.48, shoulder + h * 0.02, ex, ey, h * 0.055, h * 0.045, cloth, 0.15);
    celTaper(ctx, B, ex, ey, x + s * w * 0.6, ey + h * 0.16, h * 0.045, h * 0.04, cloth, 0.15);
    celBall(ctx, B, x + s * w * 0.6, ey + h * 0.18, h * 0.045, skin, false);
  }
  return { shoulder, hip, w };
}

function head(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, skin: string, hair: string | null): void {
  celCapsule(ctx, B, x, y + r * 0.9, x, y + r * 1.3, r * 0.4, skin, 0);
  celBall(ctx, B, x, y, r, skin);
  if (hair) celPoly(ctx, B, [x - r - 0.5, y - r * 0.2, x - r * 0.8, y - r * 0.9, x, y - r - 1, x + r * 0.8, y - r * 0.9, x + r + 0.5, y - r * 0.2, x + r * 0.6, y - r * 0.35, x - r * 0.6, y - r * 0.35], hair, 0.35, 0.25);
  eye(ctx, x - r * 0.38, y - r * 0.05, r * 0.16, '#f4f0e8'); eye(ctx, x + r * 0.38, y - r * 0.05, r * 0.16, '#f4f0e8');
  ctx.fillStyle = B.col('#3a2a24'); ctx.fillRect(Math.round(x - r * 0.25), Math.round(y + r * 0.4), Math.max(1, Math.round(r * 0.5)), 1);
}

function sword(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, h: number): void {
  const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
  celPoly(ctx, B, [x0 + nx * h * 0.02, y0 + ny * h * 0.02, x1 + nx * h * 0.005, y1 + ny * h * 0.005, x1 - nx * h * 0.005, y1 - ny * h * 0.005, x0 - nx * h * 0.02, y0 - ny * h * 0.02], '#c0c4cc', 0.4, 0.4);
  band(ctx, B, x0 - h * 0.035, y0 - h * 0.012, h * 0.07, h * 0.024, '#7a5f2a');
}

function bandit(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, base: string, dark: string, light: string, tone: number, br: number): void {
  const skin = shade('#c8a080', tone), boots = shade('#3a2a20', tone);
  const f = figure(ctx, x, y, h, base, dark, skin, boots, br);
  // Leather vest and belt.
  celPoly(ctx, B, [x - f.w * 0.42, f.shoulder + h * 0.02, x - f.w * 0.12, f.shoulder + h * 0.02, x - f.w * 0.1, f.hip, x - f.w * 0.36, f.hip], shade('#5a3a24', tone), 0.35, 0.2);
  celPoly(ctx, B, [x + f.w * 0.42, f.shoulder + h * 0.02, x + f.w * 0.12, f.shoulder + h * 0.02, x + f.w * 0.1, f.hip, x + f.w * 0.36, f.hip], shade('#5a3a24', tone), 0.35, 0.2);
  band(ctx, B, x - f.w * 0.44, f.hip - h * 0.03, f.w * 0.88, h * 0.035, shade('#2a1a14', tone));
  band(ctx, B, x - h * 0.02, f.hip - h * 0.035, h * 0.04, h * 0.045, shade('#c9a34a', tone));
  // Shield on the left, sword in the right.
  celBall(ctx, B, x - f.w * 0.7, f.shoulder + h * 0.2, h * 0.11, shade('#6a5a4a', tone));
  celBall(ctx, B, x - f.w * 0.7, f.shoulder + h * 0.2, h * 0.035, shade('#b9c0cc', tone), false);
  sword(ctx, x + f.w * 0.6, f.shoulder + h * 0.18, x + f.w * 0.85, f.shoulder - h * 0.22, h);
  // Head with a bandana and a scarf mask.
  const r = h * 0.11, hy = f.shoulder - r * 1.25;
  head(ctx, x, hy, r, skin, null);
  celPoly(ctx, B, [x - r - 0.5, hy - r * 0.1, x - r * 0.9, hy - r * 0.8, x, hy - r - 1, x + r * 0.9, hy - r * 0.8, x + r + 0.5, hy - r * 0.1, x + r * 0.7, hy - r * 0.25, x - r * 0.7, hy - r * 0.25], shade('#8a3a2a', tone), 0.35, 0.25);
  celPoly(ctx, B, [x - r * 0.9, hy + r * 0.25, x + r * 0.9, hy + r * 0.25, x + r * 0.7, hy + r * 0.95, x - r * 0.7, hy + r * 0.95], shade('#4a3a34', tone), 0.3, 0.1);
  void light;
}

function cultist(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, base: string, dark: string, light: string, tone: number, frame: number): void {
  const robe = shade('#4a3a48', tone), trim = shade('#b04a2a', tone), ember = '#ff9a40';
  const w = h * 0.5, shoulder = y - h * 0.74;
  // Robe: a long tapered gown with a hem, sleeves, a hood.
  celPoly(ctx, B, [x - w * 0.45, shoulder, x + w * 0.45, shoulder, x + w * 0.62, y, x - w * 0.62, y], robe, 0.38, 0.28);
  band(ctx, B, x - w * 0.62, y - h * 0.05, w * 1.24, h * 0.03, trim);
  band(ctx, B, x - h * 0.012, shoulder + h * 0.04, h * 0.024, h * 0.6, trim);
  for (const s of [-1, 1]) {
    celPoly(ctx, B, [x + s * w * 0.4, shoulder + h * 0.02, x + s * w * 0.9, shoulder + h * 0.3, x + s * w * 0.72, shoulder + h * 0.38, x + s * w * 0.3, shoulder + h * 0.2], robe, 0.35, 0.2);
    celBall(ctx, B, x + s * w * 0.8, shoulder + h * 0.36, h * 0.04, shade('#c8a080', tone * 0.9), false);
  }
  // Staff with an ember, in the right hand.
  celCapsule(ctx, B, x + w * 0.8, y - h * 0.05, x + w * 0.95, y - h * 0.95, h * 0.018, shade('#3a2a20', tone), 0);
  const pulse = 0.8 + 0.2 * Math.sin(frame / 6);
  ctx.fillStyle = B.col(rgba(ember, 0.35 * pulse)); ctx.beginPath(); ctx.arc(x + w * 0.95, y - h * 0.97, h * 0.07, 0, Math.PI * 2); ctx.fill();
  celBall(ctx, B, x + w * 0.95, y - h * 0.97, h * 0.035, ember, false);
  // Hood with the face in shadow and two lit eyes.
  const r = h * 0.11, hy = shoulder - r * 1.1;
  celPoly(ctx, B, [x - r * 1.3, hy + r * 1.2, x - r * 1.2, hy - r * 0.4, x, hy - r * 1.5, x + r * 1.2, hy - r * 0.4, x + r * 1.3, hy + r * 1.2], robe, 0.4, 0.25);
  pathEllipse(ctx, x, hy + r * 0.2, r * 0.75, r * 0.85); ctx.fillStyle = B.col('#16121a'); ctx.fill();
  eye(ctx, x - r * 0.35, hy + r * 0.1, r * 0.14, ember, false); eye(ctx, x + r * 0.35, hy + r * 0.1, r * 0.14, ember, false);
  void base; void dark; void light;
}

function skeleton(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, tone: number, br: number): void {
  const bone = shade('#d8d0c0', tone), old = shade('#a8a090', tone);
  const w = h * 0.4, hip = y - h * 0.46, shoulder = y - h * 0.72 + br * 0.5;
  // Legs.
  for (const s of [-1, 1]) {
    celCapsule(ctx, B, x + s * w * 0.18, hip, x + s * w * 0.22, y - h * 0.24, h * 0.03, bone, 0);
    celCapsule(ctx, B, x + s * w * 0.22, y - h * 0.24, x + s * w * 0.26, y - h * 0.03, h * 0.028, bone, 0);
    celBall(ctx, B, x + s * w * 0.22, y - h * 0.24, h * 0.035, old, false);
    band(ctx, B, x + s * w * 0.26 - h * 0.05, y - h * 0.03, h * 0.1, h * 0.03, old);
  }
  // Pelvis, spine, ribs.
  celPoly(ctx, B, [x - w * 0.32, hip - h * 0.04, x + w * 0.32, hip - h * 0.04, x + w * 0.22, hip + h * 0.05, x - w * 0.22, hip + h * 0.05], old, 0.35, 0.2);
  celCapsule(ctx, B, x, shoulder, x, hip, h * 0.022, bone, 0);
  for (let i = 0; i < 4; i++) {
    const ry = shoulder + h * 0.04 + i * h * 0.05, rw = w * (0.42 - i * 0.05);
    ctx.strokeStyle = B.col(bone); ctx.lineWidth = Math.max(1, h * 0.022); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x - rw, ry + h * 0.02); ctx.quadraticCurveTo(x - rw * 0.5, ry - h * 0.02, x, ry); ctx.quadraticCurveTo(x + rw * 0.5, ry - h * 0.02, x + rw, ry + h * 0.02); ctx.stroke();
  }
  // Shoulders and arms.
  band(ctx, B, x - w * 0.5, shoulder - h * 0.015, w, h * 0.03, old);
  for (const s of [-1, 1]) {
    celCapsule(ctx, B, x + s * w * 0.48, shoulder, x + s * w * 0.66, shoulder + h * 0.18, h * 0.025, bone, 0);
    celCapsule(ctx, B, x + s * w * 0.66, shoulder + h * 0.18, x + s * w * 0.58, shoulder + h * 0.36, h * 0.022, bone, 0);
    celBall(ctx, B, x + s * w * 0.66, shoulder + h * 0.18, h * 0.03, old, false);
  }
  // A rusty blade.
  celPoly(ctx, B, [x + w * 0.56, shoulder + h * 0.36, x + w * 0.62, shoulder + h * 0.36, x + w * 0.95, shoulder - h * 0.2, x + w * 0.85, shoulder - h * 0.22], shade('#8a6a4a', tone), 0.4, 0.2);
  // Skull: cranium, jaw, sockets, teeth.
  const r = h * 0.1, hy = shoulder - r * 1.35;
  celBall(ctx, B, x, hy, r, bone);
  celPoly(ctx, B, [x - r * 0.7, hy + r * 0.5, x + r * 0.7, hy + r * 0.5, x + r * 0.55, hy + r * 1.15, x - r * 0.55, hy + r * 1.15], old, 0.3, 0.1);
  pathEllipse(ctx, x - r * 0.38, hy, r * 0.26, r * 0.3); ctx.fillStyle = B.col('#16121a'); ctx.fill();
  pathEllipse(ctx, x + r * 0.38, hy, r * 0.26, r * 0.3); ctx.fill();
  celPoly(ctx, B, [x - r * 0.12, hy + r * 0.25, x + r * 0.12, hy + r * 0.25, x, hy + r * 0.55], old, 0.2, 0);
  ctx.fillStyle = B.col('#16121a'); for (let i = -2; i <= 2; i++) ctx.fillRect(Math.round(x + i * r * 0.28), Math.round(hy + r * 0.75), 1, Math.max(1, r * 0.2));
}

function riftling(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, base: string, dark: string, light: string, frame: number, warden: boolean): void {
  const w = h * (warden ? 1.1 : 0.9);
  const pulse = 0.75 + 0.25 * Math.sin(frame / 5);
  const ember = mix(base, '#ffd080', 0.55), glow = '#ff8a40';
  // Ember halo for the warden.
  if (warden) { ctx.fillStyle = B.col(rgba(glow, 0.18 * pulse)); ctx.beginPath(); ctx.arc(x, y - h * 0.55, h * 0.62, 0, Math.PI * 2); ctx.fill(); }
  // Jagged legs, body shards, arms.
  celPoly(ctx, B, [x - w * 0.35, y, x - w * 0.42, y - h * 0.35, x - w * 0.18, y - h * 0.3, x - w * 0.22, y], dark, 0.4, 0.2);
  celPoly(ctx, B, [x + w * 0.35, y, x + w * 0.42, y - h * 0.35, x + w * 0.18, y - h * 0.3, x + w * 0.22, y], dark, 0.4, 0.2);
  celPoly(ctx, B, [x - w * 0.45, y - h * 0.32, x - w * 0.5, y - h * 0.72, x - w * 0.15, y - h * 1.0, x + w * 0.2, y - h * 0.95, x + w * 0.5, y - h * 0.68, x + w * 0.42, y - h * 0.3, x + w * 0.15, y - h * 0.22, x - w * 0.15, y - h * 0.24], base, 0.4, 0.3);
  celPoly(ctx, B, [x - w * 0.5, y - h * 0.62, x - w * 0.95, y - h * 0.5 - pulse * 2, x - w * 0.8, y - h * 0.3, x - w * 0.45, y - h * 0.42], base, 0.4, 0.2);
  celPoly(ctx, B, [x + w * 0.5, y - h * 0.62, x + w * 0.95, y - h * 0.5 + pulse * 2, x + w * 0.8, y - h * 0.3, x + w * 0.45, y - h * 0.42], base, 0.4, 0.2);
  // Spikes.
  const spikes = warden ? 5 : 3;
  for (let i = 0; i < spikes; i++) {
    const sx = x - w * 0.3 + i * (w * 0.6 / (spikes - 1)), top = y - h * (1.0 + 0.18 * (1 - Math.abs(i - (spikes - 1) / 2) / spikes));
    celPoly(ctx, B, [sx - w * 0.06, y - h * 0.9, sx, top, sx + w * 0.06, y - h * 0.88], light, 0.3, 0.3);
  }
  // Glowing seams and the core.
  ctx.strokeStyle = B.col(rgba(glow, 0.9 * pulse)); ctx.lineWidth = Math.max(1, h * 0.02); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - w * 0.3, y - h * 0.5); ctx.lineTo(x - w * 0.1, y - h * 0.62); ctx.lineTo(x + w * 0.05, y - h * 0.45); ctx.lineTo(x + w * 0.3, y - h * 0.58); ctx.stroke();
  ctx.fillStyle = B.col(rgba(glow, 0.4 * pulse)); ctx.beginPath(); ctx.arc(x, y - h * 0.6, h * (warden ? 0.18 : 0.13), 0, Math.PI * 2); ctx.fill();
  celPoly(ctx, B, [x - w * 0.12, y - h * 0.6, x, y - h * 0.74, x + w * 0.12, y - h * 0.6, x, y - h * 0.46], ember, 0.2, 0.3);
  eye(ctx, x - w * 0.14, y - h * 0.82, h * 0.03, '#fff0a0', false); eye(ctx, x + w * 0.14, y - h * 0.82, h * 0.03, '#fff0a0', false);
  void hash;
}
