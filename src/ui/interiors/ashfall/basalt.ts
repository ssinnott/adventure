// What Cinderport's rooms share: the black basalt the port is built of, laid in courses in pale lime
// and limewashed above the sills; the ash off Fire Mountain, which lies on every sill and floor; the
// vines hung down from the shore's trees over a window; the cup in the old Cinder style; and two
// views, the Ember Sound through a window, the Compact's ship at the quay and the column of light
// beyond the water, and the mountain over the town, smoking by day and red at its mouth by night.
// The scenes are beside it, one to a business.
import { shade, rgba, mix } from '../../../lib/art/palettes.ts';
import type { Stage } from '../kit.ts';
import { rnd, line, fillPoly, smudge, skyFill, stones } from '../kit.ts';
import { K } from '../props.ts';
import { glossPoly, glossEllipse } from '../../monsters/gloss.ts';

/** The basalt, its lime and the limewash, the ash, the vines' stems and leaves, the port's timber and iron, the coast's red-brown clay (the Ash Husk's cup's), its red slip and the ash glaze. */
export const BASALT = '#4a484e', LIME = '#b8b2a2', WASH = '#cfc8b6', ASH = '#9a958c', STEM = '#3a4626', LEAF = '#4e6e34';
export const TIMBER = '#5a4434', IRON = '#34323a', CLAY = '#5c4636', SLIP = '#a04a2c', GLAZE = '#6e7c62';

/** A wall of the port's basalt: dark blocks, a long one to a short, in pale lime. */
export function basaltWall(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, rows: number, seed: number, base = BASALT): void {
  stones(ctx, x, y, w, h, base, rows, seed, { long: 1.4, mortar: mix(base, LIME, 0.6), mottle: '#5a4a46' });
}

/** The ash off the mountain, grey, thickest at the foot of what it lies on and thinning upward, with grit in it. */
export function ashDust(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, seed: number, a = 0.4): void {
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, rgba(ASH, 0)); g.addColorStop(0.6, rgba(ASH, a * 0.5)); g.addColorStop(1, rgba(ASH, a));
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  for (let i = 0; i < (w * h) / 160; i++) { const v = rnd(seed, i, 2); ctx.fillStyle = rgba(rnd(seed, i, 3) > 0.5 ? '#6a6660' : '#c8c4bc', 0.25 + v * 0.4); ctx.fillRect(Math.round(x + rnd(seed, i, 1) * w), Math.round(y + h * (1 - v * v)), 1, 1); }
}

/** Vines hung down from a lintel or an eave at y, between x and x + w: cords of stem each its own length up to `len`, leaves in pairs along them. */
export function vines(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, len: number, seed: number, n = Math.max(3, Math.round(w / 9))): void {
  for (let i = 0; i < n; i++) {
    const sx = x + (w * (i + 0.5)) / n + (rnd(seed, i) - 0.5) * (w / n) * 0.6, l = len * (0.3 + rnd(seed, i, 1) * 0.7), sway = (rnd(seed, i, 2) - 0.5) * 7;
    const at = (t: number): [number, number] => [sx + Math.sin(t * 2.6 + i) * sway * t, y + t * l];
    const pts: number[] = [];
    for (let k = 0; k <= 6; k++) pts.push(...at(k / 6));
    line(ctx, pts, '#120c14', 2.4); line(ctx, pts, STEM, 1.1);
    const leaves = Math.max(1, Math.round(l / 6));
    for (let k = 1; k <= leaves; k++) {
      const [lx, ly] = at(k / (leaves + 0.4)), sd = k % 2 ? -1 : 1, col = shade(LEAF, 0.78 + rnd(seed, i, k) * 0.45);
      glossPoly(ctx, K, [lx, ly, lx + sd * 3.5, ly - 2, lx + sd * 6, ly + 0.5, lx + sd * 3, ly + 2.5], col, { gloss: 0.3 });
    }
  }
}

/**
 * A cup in the old Cinder style, as Old Cinder's dead still hold theirs: a beaker flaring to its lip
 * on a short foot, in the coast's red-brown clay, a band of red slip under the rim. `glaze` runs an
 * ash glaze down from the lip; `raw` is one thrown and not yet fired, pale and dull. Foot on y.
 */
export function cinderCup(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, o: { glaze?: boolean; raw?: boolean } = {}): void {
  const body = o.raw ? '#a89480' : CLAY, rw = h * 0.3;
  const pts = [x - h * 0.2, y, x - h * 0.08, y - h * 0.1, x - h * 0.15, y - h * 0.18, x - rw, y - h, x + rw, y - h, x + h * 0.15, y - h * 0.18, x + h * 0.08, y - h * 0.1, x + h * 0.2, y];
  glossPoly(ctx, K, pts, body, { gloss: o.raw ? 0.05 : 0.3, spread: 0.7 });
  if (o.glaze) {
    ctx.save(); ctx.beginPath(); ctx.moveTo(pts[0], pts[1]); for (let i = 2; i < pts.length; i += 2) ctx.lineTo(pts[i], pts[i + 1]); ctx.closePath(); ctx.clip();
    ctx.fillStyle = rgba(GLAZE, 0.9); ctx.fillRect(x - rw - 1, y - h - 1, rw * 2 + 2, h * 0.42);
    for (const u of [-0.55, 0.1, 0.6]) ctx.fillRect(Math.round(x + u * rw), Math.round(y - h * 0.6), Math.max(1, Math.round(h * 0.08)), Math.round(h * 0.18 + Math.abs(u) * h * 0.1));
    ctx.restore();
  } else if (!o.raw) line(ctx, [x - rw * 0.92, y - h * 0.8, x + rw * 0.92, y - h * 0.8], SLIP, Math.max(1, h * 0.1));
  glossEllipse(ctx, K, x, y - h, rw, Math.max(1, h * 0.08), o.glaze ? GLAZE : body, 0, {});
  ctx.fillStyle = shade(body, 0.45); ctx.beginPath(); ctx.ellipse(x, y - h, rw * 0.78, Math.max(0.6, h * 0.05), 0, 0, Math.PI * 2); ctx.fill();
}

/** The column of light beyond the Sound, on the horizon at (cx, hz): a thread up the sky to y and its glitter on the water, brighter as the day goes. */
function column(ctx: CanvasRenderingContext2D, cx: number, y: number, hz: number, h: number, d: number): void {
  ctx.save(); ctx.globalCompositeOperation = 'lighter'; smudge(ctx, cx, hz, h * 0.22, '#ffe0a0', 0.3 + (1 - d) * 0.45); ctx.restore();
  ctx.fillStyle = rgba('#fff4d8', 0.5 + (1 - d) * 0.45); ctx.fillRect(Math.round(cx) - 1, y, 2, Math.round(hz - y));
  for (let i = 0; i < 5; i++) { const ww = 2 + i * 2.5; ctx.fillStyle = rgba('#ffe0a0', (0.5 - i * 0.08) * (0.4 + (1 - d) * 0.6)); ctx.fillRect(Math.round(cx - ww / 2), Math.round(hz + 2 + i * 3), Math.round(ww), 1); }
}

/** The ash in the air: a brown haze low over the sky by day, from y down to `foot`. */
function haze(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, foot: number, d: number): void {
  const g = ctx.createLinearGradient(0, y, 0, foot);
  g.addColorStop(0, rgba('#b0a090', 0)); g.addColorStop(1, rgba('#b0a090', 0.35 * d));
  ctx.fillStyle = g; ctx.fillRect(x, y, w, foot - y);
}

/**
 * The Ember Sound from the port, painted into (x, y, w, h): the sky for the hour, the ash browning it
 * low by day; the water out to the far shore's low line and the column of light standing up beyond
 * it at `light` across; the near shore's black sand. `ship` puts the Compact's ship at the quay, her
 * pennant at the masthead and her stern lamp lit by night; `vines` hangs the shore's creepers down
 * the top of the view.
 */
export function sound(x: number, y: number, w: number, h: number, s: Stage, o: { light?: number; ship?: boolean; vines?: boolean; seed?: number } = {}) {
  return (ctx: CanvasRenderingContext2D): void => {
    const d = s.daylight, seed = o.seed ?? 911, hz = y + h * 0.5;
    skyFill(ctx, x, y, w, hz - y + 2, d, seed);
    haze(ctx, x, y, w, hz, d);
    const sea = ctx.createLinearGradient(0, hz, 0, y + h);
    sea.addColorStop(0, mix('#141c26', '#6a8088', d)); sea.addColorStop(1, mix('#080c12', '#34484e', d));
    ctx.fillStyle = sea; ctx.fillRect(x, hz, w, y + h - hz);
    for (let i = 0; i < 7; i++) { const ly = hz + 3 + i * h * 0.05, lx = x + rnd(seed, i) * w; line(ctx, [lx, ly, lx + w * (0.08 + rnd(seed, i, 1) * 0.12), ly], rgba(mix('#2a3a4a', '#c8d8e0', d), 0.4), 1); }
    ctx.fillStyle = mix('#10141c', '#4e5a60', d); ctx.fillRect(Math.round(x + w * 0.3), Math.round(hz - 1), Math.round(w * 0.5), 2);
    column(ctx, x + w * (o.light ?? 0.62), y, hz, h, d);
    if (o.ship) {
      // The Compact's ship at the quay: a black hull with a pale strake, three masts, yards across and the sails furled on them.
      const sx = x + w * 0.3, sy = hz + h * 0.2, sw = w * 0.36, hull = mix('#06080c', '#2a2420', d);
      fillPoly(ctx, [sx - sw * 0.5, sy - sw * 0.1, sx + sw * 0.5, sy - sw * 0.14, sx + sw * 0.4, sy, sx - sw * 0.42, sy], hull);
      ctx.fillStyle = mix('#1a1a1e', '#a89a80', d); ctx.fillRect(Math.round(sx - sw * 0.46), Math.round(sy - sw * 0.09), Math.round(sw * 0.9), 1);
      for (const [mx, mh] of [[-0.26, 0.6], [0.02, 0.76], [0.28, 0.54]] as [number, number][]) {
        const px = sx + sw * mx, top = sy - sw * 0.1 - sw * mh;
        line(ctx, [px, sy - sw * 0.1, px, top], hull, 1);
        for (const f of [0.3, 0.62]) line(ctx, [px - sw * 0.1 * (1 - f * 0.4), top + sw * mh * f * 0.6, px + sw * 0.1 * (1 - f * 0.4), top + sw * mh * f * 0.6], mix('#14141a', '#c8bea8', d), 1.5);
      }
      const mast = sx + sw * 0.02, mtop = sy - sw * 0.86;
      fillPoly(ctx, [mast, mtop, mast + sw * 0.12, mtop + 1.5, mast, mtop + 3], mix('#3a1010', '#b03a2a', d));
      if (d < 0.5) { ctx.save(); ctx.globalCompositeOperation = 'lighter'; smudge(ctx, sx - sw * 0.44, sy - sw * 0.16, h * 0.08, '#ffc070', 0.8 * (1 - d * 2)); ctx.restore(); ctx.fillStyle = '#ffe8b0'; ctx.fillRect(Math.round(sx - sw * 0.44), Math.round(sy - sw * 0.17), 1, 1); }
    }
    const sand = y + h * 0.86, edge = [x, sand + 2, x + w * 0.3, sand - 1, x + w * 0.7, sand + 1, x + w, sand - 2];
    fillPoly(ctx, [...edge, x + w, y + h, x, y + h], mix('#08080a', '#2a2626', d));
    line(ctx, edge, rgba(mix('#3a4450', '#d8dcd8', d), 0.6), 1);
    if (o.vines) vines(ctx, x, y, w, h * 0.42, seed + 3);
  };
}

/**
 * Fire Mountain over the town, painted into (x, y, w, h): the sky for the hour; the cone at `at`
 * across, rising to its broken mouth with the ash streaked down its flanks; by day its smoke going up
 * and leaning off with the wind, by night its mouth red, a thread of fire down the near flank and
 * the smoke lit from under. `vines` as for the Sound.
 */
export function mountain(x: number, y: number, w: number, h: number, s: Stage, o: { at?: number; vines?: boolean; seed?: number } = {}) {
  return (ctx: CanvasRenderingContext2D): void => {
    const d = s.daylight, seed = o.seed ?? 931, cx = x + w * (o.at ?? 0.5), base = y + h, top = y + h * 0.26, half = w * 0.36, lip = w * 0.05;
    skyFill(ctx, x, y, w, h, d, seed);
    haze(ctx, x, y, w, base, d);
    const rock = mix('#160f10', '#5c5452', d);
    fillPoly(ctx, [cx - half, base, cx - lip, top, cx + lip, top + 1, cx + half, base], rock);
    fillPoly(ctx, [cx + lip * 0.3, top + 1, cx + lip, top + 1, cx + half, base, cx + half * 0.3, base], rgba(mix('#08060a', '#383232', d), 0.8));
    for (let i = 0; i < 7; i++) { const u = (rnd(seed, i) - 0.5) * 1.6; line(ctx, [cx + u * lip, top + 2, cx + u * half * 0.9, base - (base - top) * rnd(seed, i, 1) * 0.4], rgba(mix('#2a2626', '#aaa49c', d), 0.5), 1); }
    if (d >= 0.45) {
      for (let i = 0; i < 7; i++) smudge(ctx, cx + i * w * 0.035 + Math.sin(i * 1.3) * w * 0.015, top - 2 - i * h * 0.07, w * (0.05 + i * 0.016), '#8e8884', 0.65 - i * 0.07);
    } else {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      smudge(ctx, cx, top, w * 0.14, '#ff5a1a', 0.7 * (1 - d));
      for (let i = 1; i < 6; i++) smudge(ctx, cx + i * w * 0.035, top - 2 - i * h * 0.07, w * (0.035 + i * 0.012), '#a83a18', 0.3 * (1 - d) * (1 - i / 6));
      ctx.restore();
      fillPoly(ctx, [cx - lip, top, cx + lip, top + 1, cx + lip * 0.5, top + 3, cx - lip * 0.6, top + 3], '#ffb050');
      line(ctx, [cx - lip * 0.3, top + 3, cx - lip * 0.9, top + (base - top) * 0.25, cx - lip * 0.5, top + (base - top) * 0.4], rgba('#ff7a2a', 0.8 * (1 - d)), 1);
    }
    if (o.vines) vines(ctx, x, y, w, h * 0.42, seed + 3);
  };
}
