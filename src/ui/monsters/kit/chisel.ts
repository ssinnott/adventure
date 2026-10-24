// The chisel's mark, moved here from knockers.ts (#983): the knockers cut it in their shells, and the
// keepers, the crawlers and the heavy machines take it from there, which keeps re-exporting it.
import { mix, rgba } from '../../../lib/art/palettes.ts';
import type { F, Pt } from '../../paint/forms.ts';
import { B } from './common.ts';

/**
 * The chisel's mark: a lozenge on a stem, cut straight and even into the plate, the same on every
 * knocker and every keeper (keepers.ts). A cut is a dark groove with its far wall lit; under a few
 * pixels it is the groove alone.
 */
export function chiselMark(ctx: CanvasRenderingContext2D, f: F, c: Pt, s: number, rot: number, shell: string): void {
  if (B.override) return;
  const ca = Math.cos(rot), sa = Math.sin(rot);
  const P = (dx: number, dy: number): [number, number] => [f.X(c.x + dx * ca - dy * sa), f.Y(c.y + dx * sa + dy * ca)];
  const strokes: [number, number][][] = [[[0, 1], [0.55, 0], [0, -1], [-0.55, 0], [0, 1]], [[0, 1.75], [0, -1.75]]];
  const w = Math.max(1, s * 0.16 * f.u), cut = mix(shell, '#08090c', 0.75), lit = mix(shell, '#ffffff', 0.62);
  ctx.lineCap = 'butt'; ctx.lineJoin = 'miter';
  for (const [col, off, a] of [[lit, 0.7, 0.8], [cut, 0, 0.9]] as const) {
    if (col === lit && s * f.u < 4) continue;
    ctx.strokeStyle = rgba(col, a); ctx.lineWidth = w;
    for (const st of strokes) {
      ctx.beginPath();
      st.forEach(([dx, dy], i) => { const [px, py] = P(dx * s, dy * s); (i ? ctx.lineTo(px + off, py + off) : ctx.moveTo(px + off, py + off)); });
      ctx.stroke();
    }
  }
}
