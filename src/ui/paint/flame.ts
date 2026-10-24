// The flame every room's lights draw, and the soft glow it lights with, moved here from the rooms'
// kit (#983). Part of the paint kit; a family or a scene takes it when it is next edited (EXPANSION §8.1).
import { rgba } from '../../lib/art/palettes.ts';

/** A soft round of colour fading to nothing: a stain, a patch of light, a shadow on a wall. */
export function smudge(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string, a: number): void {
  if (r <= 0) return;
  const g = ctx.createRadialGradient(x, y, 0, x, y, r);
  g.addColorStop(0, rgba(color, a)); g.addColorStop(1, rgba(color, 0));
  ctx.fillStyle = g; ctx.fillRect(x - r, y - r, r * 2, r * 2);
}

/** A small flame: glow, outer tongue, hot core, leaning and stretching with the frame. */
export function drawFlame(ctx: CanvasRenderingContext2D, x: number, y: number, s: number, frame: number): void {
  const f1 = Math.sin(frame / 3.1), f2 = Math.sin(frame / 5.3 + 1), f3 = Math.sin(frame / 1.7 + 2);
  const hgt = s * (2.3 + 0.35 * f1 + 0.1 * f3), lean = s * 0.22 * f2;
  ctx.save(); ctx.globalCompositeOperation = 'lighter';
  smudge(ctx, x, y - s * 0.8, s * 5.5, '#ff9a40', 0.22 + 0.04 * f1);
  ctx.restore();
  ctx.beginPath(); ctx.moveTo(x - s * 0.5, y); ctx.quadraticCurveTo(x - s * 0.7, y - hgt * 0.45, x + lean, y - hgt); ctx.quadraticCurveTo(x + s * 0.7, y - hgt * 0.45, x + s * 0.5, y); ctx.closePath();
  ctx.fillStyle = '#ff8a30'; ctx.fill();
  ctx.beginPath(); ctx.moveTo(x - s * 0.28, y); ctx.quadraticCurveTo(x - s * 0.36, y - hgt * 0.32, x + lean * 0.6, y - hgt * 0.62); ctx.quadraticCurveTo(x + s * 0.36, y - hgt * 0.32, x + s * 0.28, y); ctx.closePath();
  ctx.fillStyle = '#ffe49a'; ctx.fill();
  if (s >= 3) { ctx.beginPath(); ctx.ellipse(x, y - s * 0.35, s * 0.16, s * 0.3, 0, 0, Math.PI * 2); ctx.fillStyle = '#fffbe8'; ctx.fill(); }
}
