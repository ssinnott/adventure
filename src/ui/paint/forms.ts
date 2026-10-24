// The forms the families build their shapes from: a point, the unit frame a drawing is measured in,
// a ring of points round an ellipse and the smooth tube along a spine. Each is the code the copies
// in src/ui/monsters/ share. Part of the paint kit (#983); a family takes it when it is next edited,
// and the copies stay until then (EXPANSION §8.1).
import { hash } from './brush.ts';
import type { Part } from './gloss.ts';

/** A point. */
export interface Pt { x: number; y: number }

/** A unit frame: a drawing's own units (x right, y up from the ground, `u` pixels to one) to the canvas. */
export interface F { u: number; X: (v: number) => number; Y: (v: number) => number }

/** `n` points round an ellipse, from its right-hand end, clockwise on the screen. */
export function ring(cx: number, cy: number, rx: number, ry: number, n = 8): number[] {
  const o: number[] = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2; o.push(cx + Math.cos(a) * rx, cy + Math.sin(a) * ry); }
  return o;
}

/**
 * A bending tapered tube along a spine, as a smooth closed curve part. It walks the left side, the end
 * cap, the right side and the start cap, where the engine's own sweeps its caps from the wrong side and
 * leaves a half-disc notch at each end under nonzero filling. `wobble` swells and pinches the radius
 * by up to that share, by `seed`.
 */
export function tube(pts: readonly number[], r0: number, r1: number, wobble = 0, seed = 0): Part {
  const n = pts.length / 2;
  const P = (i: number, c: 0 | 1) => pts[Math.max(0, Math.min(n - 1, i)) * 2 + c];
  const spine: number[] = [];
  const S = 4;
  for (let i = 0; i < n - 1; i++) for (let s = 0; s < S; s++) {
    const t = s / S, t2 = t * t, t3 = t2 * t;
    for (const c of [0, 1] as const) {
      const p0 = P(i - 1, c), p1 = P(i, c), p2 = P(i + 1, c), p3 = P(i + 2, c);
      spine.push(0.5 * (2 * p1 + (-p0 + p2) * t + (2 * p0 - 5 * p1 + 4 * p2 - p3) * t2 + (-p0 + 3 * p1 - 3 * p2 + p3) * t3));
    }
  }
  spine.push(P(n - 1, 0), P(n - 1, 1));
  const m = spine.length / 2, left: number[] = [], right: number[] = [];
  for (let i = 0; i < m; i++) {
    const ax = spine[Math.max(0, i - 1) * 2], ay = spine[Math.max(0, i - 1) * 2 + 1], bx = spine[Math.min(m - 1, i + 1) * 2], by = spine[Math.min(m - 1, i + 1) * 2 + 1];
    const dx = bx - ax, dy = by - ay, len = Math.hypot(dx, dy) || 1, nx = -dy / len, ny = dx / len;
    const r = (r0 + (r1 - r0) * (i / (m - 1))) * (1 + (wobble ? (hash(seed, i, 1) - 0.5) * 2 * wobble : 0));
    left.push(spine[i * 2] + nx * r, spine[i * 2 + 1] + ny * r);
    right.push(spine[i * 2] - nx * r, spine[i * 2 + 1] - ny * r);
  }
  const out: number[] = [...left];
  const ex = spine[(m - 1) * 2], ey = spine[(m - 1) * 2 + 1], ea = Math.atan2(ey - spine[(m - 2) * 2 + 1], ex - spine[(m - 2) * 2]);
  for (let k = 1; k < 5; k++) { const a = ea + Math.PI / 2 - (k / 5) * Math.PI; out.push(ex + Math.cos(a) * r1, ey + Math.sin(a) * r1); }
  for (let i = m - 1; i >= 0; i--) out.push(right[i * 2], right[i * 2 + 1]);
  const sx = spine[0], sy = spine[1], sa = Math.atan2(spine[3] - sy, spine[2] - sx);
  for (let k = 1; k < 5; k++) { const a = sa - Math.PI / 2 - (k / 5) * Math.PI; out.push(sx + Math.cos(a) * r0, sy + Math.sin(a) * r0); }
  return { k: 'curve', pts: out, wobble: 0, sub: 1 };
}
