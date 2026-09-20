// The bandit family: bandit, archer, brigand and brigand archer, on the shared humanoid frame.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer } from './common.ts';
import { B, figure, head, sword, groundShadow } from './common.ts';
import { shade } from '../../lib/art/palettes.ts';
import { celBall, celPoly, band } from '../../lib/art/shading.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['bandit', 'archer', 'brigand', 'brigand_archer'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  void kind;
  groundShadow(ctx, x, y + 1, h * 0.7);
  bandit(ctx, x, y, h, p.base, p.dark, p.light, p.tone, p.breathe);
};

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
