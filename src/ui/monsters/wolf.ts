// The wolf family: wolf, dire wolf and rift hound share one running quadruped frame.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer } from './common.ts';
import { B, celEllipse, eye, groundShadow } from './common.ts';
import { celBall, celPoly, celTaper } from '../../lib/art/shading.ts';
import { shade } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['wolf', 'dire_wolf', 'rift_hound'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  void kind;
  groundShadow(ctx, x, y + 1, h * 1.3);
  wolf(ctx, x, y, h, p.base, p.dark, p.light, p.amber, p.breathe);
};

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
