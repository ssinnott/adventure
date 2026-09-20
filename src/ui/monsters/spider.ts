// The spider family: marsh spider and thorn spider, eight jointed legs around a two-part body.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer } from './common.ts';
import { B, celEllipse, eye, groundShadow } from './common.ts';
import { celBall, celPoly, celTaper } from '../../lib/art/shading.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['spider', 'thorn_spider'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  void kind;
  groundShadow(ctx, x, y + 1, h * 1.6);
  spider(ctx, x, y, h, p.base, p.dark, p.light, p.frame);
};

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
