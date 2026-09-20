// Shared plumbing for the monster drawings in this directory: the brush every family paints with,
// the small shape helpers the engine lacks, and the humanoid frame the bandit, cultist and ogre
// families are built on. Each family module exports a `draw` of type MonsterDrawer, and the
// dispatcher in ../sprites.ts picks the family by sprite kind. Every monster draws front-facing,
// centred on (x, y) with y the ground line and `h` the intended height.
import type { MonsterSprite } from '../../game/monsters.ts';
import { shade } from '../../lib/art/palettes.ts';
import { pathEllipse } from '../../lib/art/shapes.ts';
import { celBall, celCapsule, celPoly, celTaper, band, outlinePath, tones } from '../../lib/art/shading.ts';
import { makeBrush } from '../brush.ts';

/** One brush for every monster; `flash` paints the hit frame white. */
export const B = makeBrush('#120c14', 1);

/** The colours and motion a family draws with, derived once per sprite from the def's tint. */
export interface Paint {
  /** The def's tint, darkened with distance. */
  base: string;
  dark: string;
  light: string;
  /** A warm eye and tooth colour that stays readable in the dark. */
  amber: string;
  /** Distance and sleep darkening, 0..1. */
  tone: number;
  /** The animation frame, already offset per individual. */
  frame: number;
  /** A slow -1..1 idle wave, for breathing. */
  breathe: number;
}
/** A family's entry point: draws `kind` (one of the family's variants) at (x, y) with height h. */
export type MonsterDrawer = (ctx: CanvasRenderingContext2D, kind: MonsterSprite, x: number, y: number, h: number, p: Paint) => void;

export function paintFor(tint: string, tone: number, frame: number): Paint {
  return { base: shade(tint, tone), dark: shade(tint, tone * 0.72), light: shade(tint, tone * 1.15), amber: shade('#ffd070', Math.max(0.6, tone)), tone, frame, breathe: Math.sin(frame / 14) };
}

/** Outline + base + a hand-placed shadow half for an ellipse (the helpers have no ellipse). */
export function celEllipse(ctx: CanvasRenderingContext2D, cx: number, cy: number, rx: number, ry: number, hex: string, rot = 0): void {
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

/**
 * An eye: the iris, then a pupil and a catchlight. A pupil drawn as a square of rounded pixels is
 * right at two or three px across, which is all an eye used to get, and reads as a black block
 * once a sprite fills the viewport; so it is a square only while it is small enough to pass for
 * one, and an ellipse above that.
 */
export function eye(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, pupil = true): void {
  ctx.beginPath(); ctx.arc(x, y, Math.max(0.8, r), 0, Math.PI * 2); ctx.fillStyle = B.col(color); ctx.fill();
  if (!pupil || r < 1.5 || B.override) return;
  ctx.fillStyle = '#120c14';
  if (r < 2) { ctx.fillRect(Math.round(x - r * 0.3), Math.round(y - r * 0.3), Math.max(1, Math.round(r * 0.7)), Math.max(1, Math.round(r * 0.7))); return; }
  ctx.beginPath(); ctx.ellipse(x, y, r * 0.44, r * 0.52, 0, 0, Math.PI * 2); ctx.fill();
  // A catchlight on the lit side, which is what makes an eye look wet rather than painted on.
  ctx.fillStyle = 'rgba(255,255,255,0.85)';
  ctx.beginPath(); ctx.arc(x + B.light.x * r * 0.42, y + B.light.y * r * 0.42, Math.max(0.6, r * 0.2), 0, Math.PI * 2); ctx.fill();
}

export function stroke(ctx: CanvasRenderingContext2D, pts: number[], color: string, w: number): void {
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

/** Shared humanoid frame: legs, boots, torso, arms; the callers add gear and head. */
export function figure(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, cloth: string, trouser: string, skin: string, boots: string, br: number): { shoulder: number; hip: number; w: number } {
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

export function head(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, skin: string, hair: string | null): void {
  celCapsule(ctx, B, x, y + r * 0.9, x, y + r * 1.3, r * 0.4, skin, 0);
  celBall(ctx, B, x, y, r, skin);
  if (hair) celPoly(ctx, B, [x - r - 0.5, y - r * 0.2, x - r * 0.8, y - r * 0.9, x, y - r - 1, x + r * 0.8, y - r * 0.9, x + r + 0.5, y - r * 0.2, x + r * 0.6, y - r * 0.35, x - r * 0.6, y - r * 0.35], hair, 0.35, 0.25);
  eye(ctx, x - r * 0.38, y - r * 0.05, r * 0.16, '#f4f0e8'); eye(ctx, x + r * 0.38, y - r * 0.05, r * 0.16, '#f4f0e8');
  ctx.fillStyle = B.col('#3a2a24'); ctx.fillRect(Math.round(x - r * 0.25), Math.round(y + r * 0.4), Math.max(1, Math.round(r * 0.5)), 1);
}

export function sword(ctx: CanvasRenderingContext2D, x0: number, y0: number, x1: number, y1: number, h: number): void {
  const dx = x1 - x0, dy = y1 - y0, len = Math.hypot(dx, dy), nx = -dy / len, ny = dx / len;
  celPoly(ctx, B, [x0 + nx * h * 0.02, y0 + ny * h * 0.02, x1 + nx * h * 0.005, y1 + ny * h * 0.005, x1 - nx * h * 0.005, y1 - ny * h * 0.005, x0 - nx * h * 0.02, y0 - ny * h * 0.02], '#c0c4cc', 0.4, 0.4);
  band(ctx, B, x0 - h * 0.035, y0 - h * 0.012, h * 0.07, h * 0.024, '#7a5f2a');
}

