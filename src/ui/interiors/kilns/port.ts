// What Kilnhaven's rooms share: the port's grey rubble and its tarred timber, the red dust of the
// ore that lies on every sill and floor and the harbour through a window: the ore quay with its
// staithe and heaps, the Compact ship riding at anchor, the ferry in, the sea going out to the far
// side and the Hearth standing on the horizon. The scenes are beside it, one to a business.
import { shade, rgba, mix } from '../../../lib/art/palettes.ts';
import { rnd, line, smudge, fillPoly, skyFill, stones } from '../kit.ts';

/** Tar, the boards it is laid on, the ore's red, the port's grey stone and its iron, hemp and the sea's light in a room. */
export const TAR = '#2c2624', BOARD = '#6a625a', ORE = '#8a4630', GRANITE = '#6a6c70', IRON = '#3a3a40', HEMP = '#c8b080', SEA_POOL = '#b4cce0';

/** A wall of the port's rubble: grey stones of all sizes in pale lime mortar. */
export function rubble(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, rows: number, seed: number, base = GRANITE): void {
  stones(ctx, x, y, w, h, base, rows, seed, { long: 1.15, mortar: mix(base, '#c8c4b8', 0.55), mottle: ORE });
}

/** The ore's dust, red-brown, thickest at the foot of what it lies on and thinning upward, with grit in it. */
export function oreDust(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, seed: number, a = 0.45): void {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, rgba(ORE, 0)); g.addColorStop(0.6, rgba(ORE, a * 0.5)); g.addColorStop(1, rgba(ORE, a));
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  for (let i = 0; i < (w * h) / 160; i++) { const v = rnd(seed, i, 2); ctx.fillStyle = rgba(rnd(seed, i, 3) > 0.5 ? '#6a2e1c' : '#a85a3a', 0.25 + v * 0.4); ctx.fillRect(Math.round(x + rnd(seed, i, 1) * w), Math.round(y + h * (1 - v * v)), 1, 1); }
}

/** A lump of the Fells' ore, centre (x, y), about r across: angular, black-red, a rusty face catching the light. */
export function oreLump(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, seed: number): void {
  const n = 5 + Math.floor(rnd(seed, 1) * 3), pts: number[] = [];
  for (let i = 0; i < n; i++) { const a = (i / n) * Math.PI * 2 + rnd(seed, i, 2) * 0.6, d = r * (0.7 + rnd(seed, i, 3) * 0.4); pts.push(x + Math.cos(a) * d, y + Math.sin(a) * d * 0.8); }
  const tone = ['#4a2a22', '#5e3424', '#3e3434'][Math.floor(rnd(seed, 4) * 3)];
  fillPoly(ctx, pts, tone);
  fillPoly(ctx, [pts[pts.length - 2], pts[pts.length - 1], pts[0], pts[1], pts[2], pts[3], x, y], shade(tone, 1.5));
  line(ctx, [...pts, pts[0], pts[1]], '#120c14', 1);
}

/**
 * The harbour from the town, painted into (x, y, w, h): sky, the sea out to the far side with the
 * Hearth standing on its rim, the Compact ship at anchor, the ferry and from the right the ore
 * quay with its staithe of timber and its red heaps. By night the sea is black and lamps burn on
 * the quay and at the ship's stern. `quay` and `ship` leave those out where a window is too small.
 */
export function harbour(x: number, y: number, w: number, h: number, daylight: number, seed = 0, o: { quay?: boolean; ship?: boolean; hearth?: boolean } = {}) {
  return (ctx: CanvasRenderingContext2D): void => {
    const d = daylight, hz = y + h * 0.5;
    skyFill(ctx, x, y, w, hz - y + 2, d, seed + 801);
    // A cold northern cast over the sky by day.
    ctx.fillStyle = rgba('#c8d8e0', 0.18 * d); ctx.fillRect(x, y, w, hz - y);
    // The sea, darker toward the near shore, its swell in lines.
    const sea = ctx.createLinearGradient(0, hz, 0, y + h);
    sea.addColorStop(0, mix('#18222e', '#7a909a', d)); sea.addColorStop(1, mix('#0a1018', '#3e5662', d));
    ctx.fillStyle = sea; ctx.fillRect(x, hz, w, y + h - hz);
    for (let i = 0; i < 9; i++) { const ly = hz + 3 + i * (h * 0.5 / 9) * (0.6 + i * 0.1), lx = x + rnd(seed, i) * w; line(ctx, [lx, ly, lx + w * (0.08 + rnd(seed, i, 1) * 0.1), ly], rgba(mix('#2a3a4a', '#c8d8e0', d), 0.45), 1); }
    if (o.hearth !== false) {
      // The Hearth on the rim of the sea: its column of light, and its glitter laid across the water toward the town.
      const cx = x + w * 0.56, glow = 0.3 + (1 - d) * 0.45;
      ctx.save(); ctx.globalCompositeOperation = 'lighter'; smudge(ctx, cx, hz, h * 0.22, '#ffe0a0', glow); ctx.restore();
      ctx.fillStyle = rgba('#fff4d8', 0.5 + (1 - d) * 0.45); ctx.fillRect(Math.round(cx) - 1, y, 2, Math.round(hz - y));
      for (let i = 0; i < 5; i++) { const ww = 2 + i * 2.5; ctx.fillStyle = rgba('#ffe0a0', (0.5 - i * 0.08) * (0.4 + (1 - d) * 0.6)); ctx.fillRect(Math.round(cx - ww / 2), Math.round(hz + 2 + i * 3), Math.round(ww), 1); }
    }
    // The far shore, a low line where the sea ends.
    ctx.fillStyle = mix('#10141c', '#5a6a72', d); ctx.fillRect(x, hz - 1, w * 0.4, 2);
    if (o.ship !== false) {
      // The Compact ship riding at anchor: a black hull with a pale strake, three masts, yards across.
      const sx = x + w * 0.34, sy = hz + h * 0.12, sw = w * 0.24, hull = mix('#06080c', '#2a2420', d);
      fillPoly(ctx, [sx - sw * 0.5, sy - sw * 0.1, sx + sw * 0.5, sy - sw * 0.14, sx + sw * 0.4, sy, sx - sw * 0.42, sy], hull);
      ctx.fillStyle = mix('#1a1a1e', '#a89a80', d); ctx.fillRect(Math.round(sx - sw * 0.46), Math.round(sy - sw * 0.09), Math.round(sw * 0.9), 1);
      for (const [mx, mh] of [[-0.26, 0.62], [0.02, 0.78], [0.28, 0.55]] as [number, number][]) {
        const px = sx + sw * mx, top = sy - sw * 0.1 - sw * mh;
        line(ctx, [px, sy - sw * 0.1, px, top], hull, 1);
        for (const f of [0.3, 0.62]) line(ctx, [px - sw * 0.1 * (1 - f * 0.4), top + sw * mh * f * 0.6, px + sw * 0.1 * (1 - f * 0.4), top + sw * mh * f * 0.6], hull, 1);
      }
      line(ctx, [sx - sw * 0.5, sy - sw * 0.1, sx - sw * 0.26, sy - sw * 0.72, sx + sw * 0.02, sy - sw * 0.88, sx + sw * 0.28, sy - sw * 0.65, sx + sw * 0.55, sy - sw * 0.14], rgba(hull, 0.6), 1);
      if (d < 0.5) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; smudge(ctx, sx - sw * 0.44, sy - sw * 0.16, h * 0.08, '#ffc070', 0.8 * (1 - d * 2)); ctx.restore(); ctx.fillStyle = '#ffe8b0'; ctx.fillRect(Math.round(sx - sw * 0.44), Math.round(sy - sw * 0.17), 1, 1); }
      // The ferry, a single mast, lying in nearer.
      const fx = x + w * 0.16, fy = hz + h * 0.3, fw = w * 0.1;
      fillPoly(ctx, [fx - fw * 0.5, fy - fw * 0.16, fx + fw * 0.5, fy - fw * 0.2, fx + fw * 0.36, fy, fx - fw * 0.4, fy], mix('#08080c', '#4a3a2c', d));
      line(ctx, [fx, fy - fw * 0.16, fx, fy - fw * 1.2], mix('#08080c', '#3a2e24', d), 1);
      fillPoly(ctx, [fx + 1, fy - fw * 1.1, fx + fw * 0.4, fy - fw * 0.3, fx + 1, fy - fw * 0.3], mix('#1a1a20', '#c8bea8', d));
    }
    if (o.quay !== false) {
      // The ore quay coming in from the right: its stone, the staithe standing over the water on its
      // legs with a chute down from it, an ore barge under the chute and the red heaps along the quay.
      const qy = y + h * 0.7, stone = mix('#121216', '#6a6660', d), wood = mix('#0a0808', '#3a2c22', d), ore = mix('#1e0e0a', ORE, d * 0.85 + 0.15);
      const deck = qy - h * 0.2;
      fillPoly(ctx, [x + w * 0.66, qy + h * 0.02, x + w * 0.84, qy + h * 0.01, x + w * 0.82, qy + h * 0.07, x + w * 0.68, qy + h * 0.07], mix('#06080c', '#2a2420', d));
      for (let i = 0; i < 5; i++) { const lx = x + w * (0.6 + i * 0.1); line(ctx, [lx, deck, lx + 1, qy + h * 0.03], wood, 2); line(ctx, [lx, deck + h * 0.02, lx + w * 0.1, qy], rgba(wood, 0.7), 1); }
      fillPoly(ctx, [x + w * 0.56, deck - 2, x + w, deck - h * 0.05, x + w, deck + 2, x + w * 0.56, deck + 3], wood);
      fillPoly(ctx, [x + w * 0.7, deck, x + w * 0.74, deck, x + w * 0.77, qy - h * 0.02, x + w * 0.73, qy - h * 0.02], wood);
      fillPoly(ctx, [x + w * 0.66, deck - 1, x + w * 0.69, deck - h * 0.07, x + w * 0.76, deck - h * 0.07, x + w * 0.79, deck - 1], ore);
      fillPoly(ctx, [x + w * 0.86, qy, x + w, qy - h * 0.04, x + w, y + h, x + w * 0.8, y + h], stone);
      ctx.fillStyle = shade(stone, 1.3); ctx.fillRect(Math.round(x + w * 0.86), Math.round(qy - 1), Math.round(w * 0.14), 1);
      for (let i = 0; i < 2; i++) { const hx = x + w * (0.9 + i * 0.08), hy = qy + h * 0.16; fillPoly(ctx, [hx - w * 0.07, hy, hx - w * 0.01, hy - h * 0.12, hx + w * 0.02, hy - h * 0.11, hx + w * 0.07, hy], ore); }
      if (d < 0.5) for (const lx of [0.62, 0.95]) { const px = x + w * lx, py = deck - h * 0.1; ctx.save(); ctx.globalCompositeOperation = 'lighter'; smudge(ctx, px, py, h * 0.1, '#ffb060', 0.7 * (1 - d * 2)); ctx.restore(); ctx.fillStyle = '#ffe0a0'; ctx.fillRect(Math.round(px), Math.round(py), 2, 2); }
    }
    // Gulls by day.
    if (d > 0.5) for (let i = 0; i < 3; i++) { const gx = x + w * (0.2 + rnd(seed, i, 5) * 0.6), gy = y + h * (0.12 + rnd(seed, i, 6) * 0.2); line(ctx, [gx - 3, gy - 1, gx, gy + 1, gx + 3, gy - 1], rgba('#2a2a30', 0.7), 1); }
  };
}
