// The Ashen cultist family: cultist, zealot, adept and the Hand of Ash, robed and hooded.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { shade, rgba } from '../../lib/art/palettes.ts';
import { pathEllipse } from '../../lib/art/shapes.ts';
import { celBall, celCapsule, celPoly, band } from '../../lib/art/shading.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['cultist', 'zealot', 'adept', 'ashen_hand'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  void kind;
  groundShadow(ctx, x, y + 1, h * 0.7);
  cultist(ctx, x, y, h, p.base, p.dark, p.light, p.tone, p.frame);
};

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
