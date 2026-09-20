// The wraith: a hooded shroud that hangs in the air, frayed below the waist, with a pale inner glow.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer } from './common.ts';
import { B, eye, stroke, groundShadow } from './common.ts';
import { mix, rgba } from '../../lib/art/palettes.ts';
import { pathEllipse } from '../../lib/art/shapes.ts';
import { celPoly, celTaper } from '../../lib/art/shading.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['wraith'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  void kind;
  groundShadow(ctx, x, y + 1, h * 0.5);
  wraith(ctx, x, y, h, p.base, p.dark, p.light, p.frame);
};

function wraith(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, base: string, dark: string, light: string, frame: number): void {
  // A hooded shroud that hangs in the air, frayed to nothing below the waist; a pale inner glow.
  const drift = Math.sin(frame / 11) * h * 0.03, pulse = 0.7 + 0.3 * Math.sin(frame / 7);
  const yy = y - h * 0.1 + drift, w = h * 0.5, shoulder = yy - h * 0.72;
  ctx.fillStyle = B.col(rgba(light, 0.12 * pulse)); ctx.beginPath(); ctx.arc(x, yy - h * 0.5, h * 0.42, 0, Math.PI * 2); ctx.fill();
  // The shroud: shoulders, then a jagged hem walked right to left, so the tatters hang in points.
  const pts = [x - w * 0.45, shoulder, x + w * 0.45, shoulder];
  for (let i = 6; i >= 0; i--) pts.push(x - w * 0.6 + (i / 6) * w * 1.2, yy - h * (i % 2 ? 0.02 : 0.16) - Math.sin(frame / 8 + i) * h * 0.02);
  celPoly(ctx, B, pts, base, 0.4, 0.25);
  // Reaching arms, long-fingered.
  for (const s of [-1, 1]) {
    const ex = x + s * w * 0.95, ey = shoulder + h * 0.12 + s * drift;
    celTaper(ctx, B, x + s * w * 0.4, shoulder + h * 0.04, ex, ey, h * 0.05, h * 0.03, dark, 0.15);
    for (let k = -1; k <= 1; k++) stroke(ctx, [ex, ey, ex + s * h * 0.07, ey + k * h * 0.035 + h * 0.02], light, 1);
  }
  // Hood, a dark void inside, two cold eyes.
  const r = h * 0.11, hy = shoulder - r * 1.05;
  celPoly(ctx, B, [x - r * 1.3, hy + r * 1.3, x - r * 1.15, hy - r * 0.5, x, hy - r * 1.55, x + r * 1.15, hy - r * 0.5, x + r * 1.3, hy + r * 1.3], base, 0.4, 0.25);
  pathEllipse(ctx, x, hy + r * 0.25, r * 0.75, r * 0.9); ctx.fillStyle = B.col('#0c0a12'); ctx.fill();
  eye(ctx, x - r * 0.32, hy + r * 0.1, r * 0.13, mix(light, '#ffffff', 0.5 * pulse), false); eye(ctx, x + r * 0.32, hy + r * 0.1, r * 0.13, mix(light, '#ffffff', 0.5 * pulse), false);
}
