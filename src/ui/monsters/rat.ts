// The giant rat: a low, long body, a pointed head with a bare tail and pink ears.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer } from './common.ts';
import { B, celEllipse, eye, stroke, groundShadow } from './common.ts';
import { shade } from '../../lib/art/palettes.ts';
import { celBall, celCapsule } from '../../lib/art/shading.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['rat'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  void kind;
  groundShadow(ctx, x, y + 1, h * 1.3);
  rat(ctx, x, y, h, p.base, p.dark, p.light, p.amber, p.breathe);
};

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
