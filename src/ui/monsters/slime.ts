// The cellar slime: a translucent mound with a dark core, bubbles and a puddle.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { rgba } from '../../lib/art/palettes.ts';
import { pathEllipse } from '../../lib/art/shapes.ts';
import { outlinePath, tones } from '../../lib/art/shading.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['slime'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  void kind;
  groundShadow(ctx, x, y + 1, h * 0.7);
  slime(ctx, x, y, h, p.base, p.dark, p.light, p.breathe);
};

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
