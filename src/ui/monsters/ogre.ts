// The ogre: a wide, stooped brute with a hide kilt and a great club.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer } from './common.ts';
import { B, figure, eye, groundShadow } from './common.ts';
import { shade } from '../../lib/art/palettes.ts';
import { celBall, celCapsule, celPoly, celTaper, band } from '../../lib/art/shading.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['ogre'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  void kind;
  groundShadow(ctx, x, y + 1, h * 0.7);
  ogre(ctx, x, y, h, p.base, p.dark, p.light, p.tone, p.breathe);
};

function ogre(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, base: string, dark: string, light: string, tone: number, br: number): void {
  // A wide, stooped brute: bare hide for a torso, a rope belt and a hide kilt, a great club.
  const hide = shade('#5a3a24', tone), boots = shade('#3a2a20', tone);
  const f = figure(ctx, x, y, h, base, hide, base, boots, br);
  const w = f.w * 1.35;
  // Gut and shoulders over the frame, so the ogre is broader than a man.
  celPoly(ctx, B, [x - w * 0.55, f.shoulder + h * 0.02, x + w * 0.55, f.shoulder + h * 0.02, x + w * 0.5, f.hip + h * 0.05, x - w * 0.5, f.hip + h * 0.05], base, 0.38, 0.3);
  celBall(ctx, B, x, f.hip - h * 0.06, w * 0.34, shade(base, 1.04), false);
  celBall(ctx, B, x - w * 0.5, f.shoulder + h * 0.03, h * 0.075, light, false);
  celBall(ctx, B, x + w * 0.5, f.shoulder + h * 0.03, h * 0.075, light, false);
  // Kilt and rope belt.
  celPoly(ctx, B, [x - w * 0.48, f.hip, x + w * 0.48, f.hip, x + w * 0.52, f.hip + h * 0.16, x - w * 0.52, f.hip + h * 0.16], hide, 0.35, 0.2);
  band(ctx, B, x - w * 0.5, f.hip - h * 0.02, w, h * 0.03, shade('#a08a5a', tone));
  // The club, held across the body in the right hand.
  const cx0 = x + w * 0.5, cy0 = f.shoulder + h * 0.2, cx1 = x + w * 0.95, cy1 = f.shoulder - h * 0.28;
  celTaper(ctx, B, cx0, cy0, cx1, cy1, h * 0.03, h * 0.07, shade('#6a4a2a', tone), 0.2);
  for (let i = 0; i < 3; i++) celBall(ctx, B, cx1 - (cx1 - cx0) * (0.1 + i * 0.12), cy1 - (cy1 - cy0) * (0.1 + i * 0.12), h * 0.014, shade('#b0b4bc', tone), false);
  // Head: low brow, jutting jaw, two tusks, a topknot.
  const r = h * 0.1, hy = f.shoulder - r * 0.9;
  celBall(ctx, B, x, hy, r, base);
  celPoly(ctx, B, [x - r * 0.9, hy + r * 0.2, x + r * 0.9, hy + r * 0.2, x + r * 0.75, hy + r * 1.05, x - r * 0.75, hy + r * 1.05], shade(base, 0.92), 0.3, 0.15);
  band(ctx, B, x - r * 0.8, hy - r * 0.35, r * 1.6, r * 0.22, dark);
  eye(ctx, x - r * 0.38, hy - r * 0.05, r * 0.14, '#f0e070', false); eye(ctx, x + r * 0.38, hy - r * 0.05, r * 0.14, '#f0e070', false);
  celPoly(ctx, B, [x - r * 0.5, hy + r * 0.8, x - r * 0.35, hy + r * 0.25, x - r * 0.2, hy + r * 0.8], '#f0ead8', 0.2, 0);
  celPoly(ctx, B, [x + r * 0.2, hy + r * 0.8, x + r * 0.35, hy + r * 0.25, x + r * 0.5, hy + r * 0.8], '#f0ead8', 0.2, 0);
  celCapsule(ctx, B, x, hy - r, x + r * 0.2, hy - r * 1.6, r * 0.18, shade('#2a2018', tone), 0);
}
