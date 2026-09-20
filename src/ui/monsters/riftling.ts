// The Rift family: riftling, riftling elder, Rift Warden and Warden of the Cut, crystal shards around an ember core.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer } from './common.ts';
import { B, eye, groundShadow } from './common.ts';
import { mix, rgba } from '../../lib/art/palettes.ts';
import { celPoly } from '../../lib/art/shading.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['riftling', 'riftling_elder', 'warden', 'cut_warden'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  void kind;
  const warden = kind === 'warden' || kind === 'cut_warden';
  groundShadow(ctx, x, y + 1, h * 0.7);
  riftling(ctx, x, y, h, p.base, p.dark, p.light, p.frame, warden);
};

function riftling(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, base: string, dark: string, light: string, frame: number, warden: boolean): void {
  const w = h * (warden ? 1.1 : 0.9);
  const pulse = 0.75 + 0.25 * Math.sin(frame / 5);
  const ember = mix(base, '#ffd080', 0.55), glow = '#ff8a40';
  // Ember halo for the warden.
  if (warden) { ctx.fillStyle = B.col(rgba(glow, 0.18 * pulse)); ctx.beginPath(); ctx.arc(x, y - h * 0.55, h * 0.62, 0, Math.PI * 2); ctx.fill(); }
  // Jagged legs, body shards, arms.
  celPoly(ctx, B, [x - w * 0.35, y, x - w * 0.42, y - h * 0.35, x - w * 0.18, y - h * 0.3, x - w * 0.22, y], dark, 0.4, 0.2);
  celPoly(ctx, B, [x + w * 0.35, y, x + w * 0.42, y - h * 0.35, x + w * 0.18, y - h * 0.3, x + w * 0.22, y], dark, 0.4, 0.2);
  celPoly(ctx, B, [x - w * 0.45, y - h * 0.32, x - w * 0.5, y - h * 0.72, x - w * 0.15, y - h * 1.0, x + w * 0.2, y - h * 0.95, x + w * 0.5, y - h * 0.68, x + w * 0.42, y - h * 0.3, x + w * 0.15, y - h * 0.22, x - w * 0.15, y - h * 0.24], base, 0.4, 0.3);
  celPoly(ctx, B, [x - w * 0.5, y - h * 0.62, x - w * 0.95, y - h * 0.5 - pulse * 2, x - w * 0.8, y - h * 0.3, x - w * 0.45, y - h * 0.42], base, 0.4, 0.2);
  celPoly(ctx, B, [x + w * 0.5, y - h * 0.62, x + w * 0.95, y - h * 0.5 + pulse * 2, x + w * 0.8, y - h * 0.3, x + w * 0.45, y - h * 0.42], base, 0.4, 0.2);
  // Spikes.
  const spikes = warden ? 5 : 3;
  for (let i = 0; i < spikes; i++) {
    const sx = x - w * 0.3 + i * (w * 0.6 / (spikes - 1)), top = y - h * (1.0 + 0.18 * (1 - Math.abs(i - (spikes - 1) / 2) / spikes));
    celPoly(ctx, B, [sx - w * 0.06, y - h * 0.9, sx, top, sx + w * 0.06, y - h * 0.88], light, 0.3, 0.3);
  }
  // Glowing seams and the core.
  ctx.strokeStyle = B.col(rgba(glow, 0.9 * pulse)); ctx.lineWidth = Math.max(1, h * 0.02); ctx.lineCap = 'round';
  ctx.beginPath(); ctx.moveTo(x - w * 0.3, y - h * 0.5); ctx.lineTo(x - w * 0.1, y - h * 0.62); ctx.lineTo(x + w * 0.05, y - h * 0.45); ctx.lineTo(x + w * 0.3, y - h * 0.58); ctx.stroke();
  ctx.fillStyle = B.col(rgba(glow, 0.4 * pulse)); ctx.beginPath(); ctx.arc(x, y - h * 0.6, h * (warden ? 0.18 : 0.13), 0, Math.PI * 2); ctx.fill();
  celPoly(ctx, B, [x - w * 0.12, y - h * 0.6, x, y - h * 0.74, x + w * 0.12, y - h * 0.6, x, y - h * 0.46], ember, 0.2, 0.3);
  eye(ctx, x - w * 0.14, y - h * 0.82, h * 0.03, '#fff0a0', false); eye(ctx, x + w * 0.14, y - h * 0.82, h * 0.03, '#fff0a0', false);
}
