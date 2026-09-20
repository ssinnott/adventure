// The wild boar: a bristled barrel on short legs, tusks and a snout disc.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer } from './common.ts';
import { B, celEllipse, eye, groundShadow } from './common.ts';
import { celBall, celPoly, celTaper } from '../../lib/art/shading.ts';
import { shade } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['boar'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  void kind;
  groundShadow(ctx, x, y + 1, h * 1.3);
  boar(ctx, x, y, h, p.base, p.dark, p.light, p.breathe);
};

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
