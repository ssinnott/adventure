// What Rime Lodge's rooms share: the round logs its walls are laid in, moss and clay in the joints;
// the pelts, hung flat on a wall or laid on the boards; the frost on the glass; and the long loch
// through a window or a door, frozen, the keepers' fire out on the ice by the hole. The scenes are
// beside it, one to a business.
import { shade, rgba, mix } from '../../../lib/art/palettes.ts';
import type { Stage } from '../kit.ts';
import { INK, rnd, ramp, reversed, line, fillPoly, path, smudge, clipRect, skyFill, pool } from '../kit.ts';
import { K } from '../props.ts';
import { glossPoly, glossEllipse } from '../../monsters/gloss.ts';

/** The logs, the moss in their joints, the snow, the keepers' iron and the pelts (brown bear, ice bear and lynx), and the lodge's grey blankets with their red stripe. */
export const LOG = '#6a5442', CHINK = '#8e8a6a', SNOW = '#eef2f6', IRON = '#34323a';
export const BEAR = '#5c4433', WHITE_BEAR = '#d8d2c4', LYNX = '#bcae90', WOOL = '#77736a', STRIPE = '#9a3426';

/**
 * The lodge's walls: round logs laid one on the next, lit along the top and falling to shadow under
 * the curve, checked along the grain, with moss and clay packed in the joints between. From y down
 * `h`, in `rows` logs.
 */
export function logWall(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, rows: number, seed: number, wood = LOG): void {
  ctx.save(); clipRect(ctx, x, y, w, h);
  ctx.fillStyle = shade(CHINK, 0.85); ctx.fillRect(x, y, w, h);
  const rh = h / rows, n = Math.max(8, Math.round(w / 20));
  for (let i = 0; i < rows; i++) {
    const t0 = y + i * rh, col = shade(wood, 0.84 + rnd(seed, i) * 0.28), t = ramp(col);
    const top: number[] = [], bot: number[] = [];
    for (let k = 0; k <= n; k++) {
      const px = x - 2 + ((w + 4) * k) / n;
      top.push(px, t0 + 2 + Math.sin(k * 1.7 + i * 2.3 + seed) * 0.7 + rnd(seed, i, k) * 1);
      bot.push(px, t0 + rh - 1.2 - rnd(seed, i, k, 1) * 1.4);
    }
    const g = ctx.createLinearGradient(0, t0 + 1, 0, t0 + rh);
    g.addColorStop(0, t.sh); g.addColorStop(0.1, t.hi); g.addColorStop(0.3, mix(col, t.hi, 0.4)); g.addColorStop(0.55, col); g.addColorStop(0.8, t.sh); g.addColorStop(1, t.deep);
    const body = [...top, ...reversed(bot)];
    fillPoly(ctx, body, g);
    ctx.save(); path(ctx, body); ctx.clip();
    // Checks split along the grain, and a knot or two where a branch was.
    for (let c = 0; c < Math.round(w / 60); c++) {
      const cx = x + rnd(seed, i, c, 2) * w, cy = t0 + rh * (0.35 + rnd(seed, i, c, 3) * 0.35), len = 14 + rnd(seed, i, c, 4) * 40;
      line(ctx, [cx, cy, cx + len * 0.5, cy + (rnd(seed, i, c, 5) - 0.5) * 1.5, cx + len, cy + (rnd(seed, i, c, 6) - 0.5) * 2], rgba(t.deep, 0.55), 1);
    }
    for (let c = 0; c < Math.round(w / 110) + 1; c++) {
      if (rnd(seed, i, c, 7) > 0.55) continue;
      const kx = x + rnd(seed, i, c, 8) * w, ky = t0 + rh * (0.4 + rnd(seed, i, c, 9) * 0.25);
      ctx.beginPath(); ctx.ellipse(kx, ky, rh * 0.22, rh * 0.14, 0, 0, Math.PI * 2); ctx.fillStyle = rgba(t.deep, 0.65); ctx.fill();
      ctx.beginPath(); ctx.ellipse(kx - 0.5, ky - 0.5, rh * 0.1, rh * 0.06, 0, 0, Math.PI * 2); ctx.fillStyle = rgba(t.hi, 0.4); ctx.fill();
    }
    // Where one log ends and the next begins, now and then.
    if (rnd(seed, i, 10) < 0.35) {
      const jx = x + w * (0.15 + rnd(seed, i, 11) * 0.7);
      line(ctx, [jx, t0, jx + 1, t0 + rh], INK, 1.5); line(ctx, [jx + 1.5, t0 + 2, jx + 2.5, t0 + rh - 2], rgba(t.hi, 0.5), 1);
    }
    ctx.restore();
    line(ctx, top, rgba(INK, 0.7), 1); line(ctx, bot, INK, 1);
    // The moss and clay packed into the joint under the log.
    for (let k = 0; k < n * 2; k++) {
      const mx = x + rnd(seed, i, k, 12) * w, my = t0 + rh - 0.5 + rnd(seed, i, k, 13) * 2;
      ctx.fillStyle = rnd(seed, i, k, 14) < 0.5 ? rgba('#6a7a4a', 0.7) : rgba(shade(CHINK, 1.15), 0.8);
      ctx.fillRect(Math.round(mx), Math.round(my), 2 + Math.round(rnd(seed, i, k, 15) * 3), 1);
    }
  }
  ctx.restore();
}

/**
 * A pelt stretched flat, its head at (x, y), `w` across the legs and `h` long to the tail's tip: the
 * hide with its four legs and their claws, the fur's grain down it, the eyes cut out of the mask.
 * Hung on a wall it is seen straight on; `flat` lays it on a floor, squashed to that share of its
 * length. `spots` dapples it, as a lynx's is.
 */
export function pelt(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fur: string, seed: number, o: { spots?: string; tail?: number; flat?: number } = {}): void {
  const tail = o.tail ?? 0.14, f = o.flat ?? 1, at = (u: number, v: number): [number, number] => [x + u * w, y + v * h * f];
  const half: [number, number][] = [[0.05, 0], [0.11, 0.02], [0.13, 0.07], [0.09, 0.13], [0.24, 0.16], [0.46, 0.13], [0.48, 0.2], [0.42, 0.22], [0.24, 0.3], [0.25, 0.6],
    [0.4, 0.66], [0.5, 0.78], [0.44, 0.8], [0.3, 0.8], [0.14, 0.84], [0.06, 0.86], [0.04, 0.86 + tail], [0, 0.88 + tail]];
  const pts: number[] = [];
  for (const [u, v] of half) pts.push(...at(u, v));
  for (let i = half.length - 2; i >= 0; i--) pts.push(...at(-half[i][0], half[i][1]));
  glossPoly(ctx, K, pts, fur, { gloss: 0.05, spread: 0.8, h: 120, tex: 'fur', seed, amount: 0.7 });
  const t = ramp(fur);
  if (o.spots) {
    ctx.save(); path(ctx, pts); ctx.clip();
    for (let i = 0; i < 26; i++) { const [sx, sy] = at((rnd(seed, i) - 0.5) * 0.5, 0.15 + rnd(seed, i, 1) * 0.7); ctx.fillStyle = rgba(o.spots, 0.55); ctx.beginPath(); ctx.ellipse(sx, sy, 1.6, 1.1 * Math.max(0.5, f), 0, 0, Math.PI * 2); ctx.fill(); }
    ctx.restore();
  }
  // The darker stripe down the spine, the claws at the paws, and the mask's empty eyes and ears.
  line(ctx, [...at(0, 0.1), ...at(0, 0.84)], rgba(t.deep, 0.45), Math.max(2, w * 0.05 * Math.max(0.5, f)));
  for (const sd of [-1, 1]) {
    for (const [u, v] of [[0.47, 0.165], [0.47, 0.79]] as [number, number][]) for (let c = -1; c <= 1; c++) { const [cx, cy] = at(sd * (u + 0.02), v + c * 0.02); ctx.fillStyle = '#1a1414'; ctx.fillRect(Math.round(cx) - 1, Math.round(cy), 2, 1); }
    const [ex, ey] = at(sd * 0.045, 0.06), [ax, ay] = at(sd * 0.1, 0.015);
    ctx.fillStyle = INK; ctx.beginPath(); ctx.ellipse(ex, ey, Math.max(1, w * 0.018), Math.max(0.8, h * 0.008 * f), sd * 0.4, 0, Math.PI * 2); ctx.fill();
    glossEllipse(ctx, K, ax, ay, w * 0.035, Math.max(1.5, w * 0.03 * f), shade(fur, 0.85), 0, {});
  }
  const [nx, ny] = at(0, 0.005);
  glossEllipse(ctx, K, nx, ny, Math.max(1.5, w * 0.03), Math.max(1.2, w * 0.022 * f), '#2a2224', 0, { gloss: 0.6 });
}

/** Frost on glass: a haze thickest in the corners and along the foot of (x, y, w, h), small ferns of it grown in from the edges. */
export function frost(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, seed: number, a = 0.8): void {
  ctx.save(); clipRect(ctx, x, y, w, h);
  const g = ctx.createLinearGradient(0, y, 0, y + h);
  g.addColorStop(0, rgba('#e8f0f8', a * 0.2)); g.addColorStop(0.5, rgba('#e8f0f8', a * 0.06)); g.addColorStop(1, rgba('#e8f0f8', a * 0.5));
  ctx.fillStyle = g; ctx.fillRect(x, y, w, h);
  const r = Math.min(w, h) * 0.45;
  for (const [cx, cy] of [[x, y], [x + w, y], [x, y + h], [x + w, y + h]]) smudge(ctx, cx, cy, r, '#eef4fa', a * 0.55);
  const n = Math.max(8, Math.round((w + h) / 4));
  for (let i = 0; i < n; i++) {
    // Each fern starts at an edge, most along the foot and in the corners, and grows a little way in.
    const e = rnd(seed, i), u = rnd(seed, i, 1);
    let px = e < 0.5 ? x + u * w : e < 0.75 ? x : x + w, py = e < 0.5 ? y + h : y + h - u * h;
    let ang = e < 0.5 ? -Math.PI / 2 + (rnd(seed, i, 2) - 0.5) * 1.4 : e < 0.75 ? (rnd(seed, i, 2) - 0.5) * 1.2 : Math.PI + (rnd(seed, i, 2) - 0.5) * 1.2;
    const len = Math.min(w, h) * (0.08 + rnd(seed, i, 3) * 0.16);
    for (let k = 0; k < 3; k++) {
      const nx = px + Math.cos(ang) * len / 3, ny = py + Math.sin(ang) * len / 3;
      line(ctx, [px, py, nx, ny], rgba('#f4f8ff', a * 0.45), 1);
      for (const sd of [-1, 1]) line(ctx, [nx, ny, nx + Math.cos(ang + sd * 0.9) * len * 0.15, ny + Math.sin(ang + sd * 0.9) * len * 0.15], rgba('#f4f8ff', a * 0.3), 1);
      px = nx; py = ny; ang += (rnd(seed, i, k, 4) - 0.5) * 0.6;
    }
  }
  ctx.restore();
}

/**
 * The long loch from the lodge, painted into (x, y, w, h): the sky for the hour, the fells white
 * over the far shore's pines, the ice running out flat with the snow streaked on it, and the
 * keepers' fire beside the black ring of the hole, `at` across the view: smoke going up by day, its
 * light on the ice by night.
 */
export function loch(x: number, y: number, w: number, h: number, s: Stage, o: { at?: number; shore?: number; seed?: number; near?: number } = {}) {
  return (ctx: CanvasRenderingContext2D): void => {
    const d = s.daylight, seed = o.seed ?? 401, shore = y + h * (o.shore ?? 0.42);
    skyFill(ctx, x, y, w, h, d, seed);
    // The fells over the far shore, snow on them pale even at night.
    const fell = mix('#3a4256', '#e4ecf4', d), fellSh = mix('#262c3c', '#a8b8cc', d);
    const ridge: number[] = [x, shore];
    for (let i = 0; i <= 8; i++) ridge.push(x + (w * i) / 8, shore - h * (0.1 + rnd(seed, i) * 0.16));
    ridge.push(x + w, shore);
    fillPoly(ctx, ridge, fell);
    for (let i = 1; i < 8; i += 2) fillPoly(ctx, [x + (w * i) / 8, shore - h * (0.1 + rnd(seed, i) * 0.16), x + (w * (i + 1)) / 8, shore, x + (w * (i - 0.4)) / 8, shore], rgba(fellSh, 0.7));
    // The far shore's pines, a dark comb.
    const pine = mix('#0c1210', '#2e4434', d);
    ctx.fillStyle = pine; ctx.fillRect(x, shore - 2, w, 4);
    for (let i = 0; i < Math.round(w / 3); i++) { const px = x + rnd(seed, i, 1) * w, ph = 2 + rnd(seed, i, 2) * h * 0.06; fillPoly(ctx, [px - 1.5, shore + 1, px, shore - ph, px + 1.5, shore + 1], pine); }
    // The ice, flat to the foot of the view, the snow lying on it in streaks.
    const ice = ctx.createLinearGradient(0, shore, 0, y + h);
    ice.addColorStop(0, mix('#1c2434', '#c4d4e0', d)); ice.addColorStop(1, mix('#2a3446', '#e8f0f6', d));
    ctx.fillStyle = ice; ctx.fillRect(x, shore + 2, w, y + h - shore - 2);
    for (let i = 0; i < 10; i++) { const sy = shore + 4 + rnd(seed, i, 3) * (y + h - shore - 6), sx = x + rnd(seed, i, 4) * w, sl = w * (0.1 + rnd(seed, i, 5) * 0.3); line(ctx, [sx, sy, sx + sl, sy], rgba(mix('#4a5a70', '#ffffff', d), 0.5), 1); }
    // The hole and the fire kept beside it.
    const fx = x + w * (o.at ?? 0.6), near = o.near ?? 0.45, fy = shore + (y + h - shore) * near, r = Math.max(3, w * 0.07 * (0.5 + near));
    ctx.fillStyle = '#06080c'; ctx.beginPath(); ctx.ellipse(fx - r * 1.6, fy, r, r * 0.3, 0, 0, Math.PI * 2); ctx.fill();
    ctx.fillStyle = rgba(mix('#5a6a80', '#ffffff', d), 0.8); ctx.fillRect(Math.round(fx - r * 2.6), Math.round(fy - r * 0.35), Math.round(r * 2), 1);
    for (let i = 0; i < 3; i++) { ctx.fillStyle = mix('#14141a', '#5a5a60', d); ctx.fillRect(Math.round(fx - r * 0.5 + i * r * 0.4), Math.round(fy - 1), Math.max(1, Math.round(r * 0.3)), 2); }
    if (d > 0.4) {
      for (let i = 0; i < 6; i++) smudge(ctx, fx + i * r * 0.5 + Math.sin(i) * r * 0.4, fy - r - i * r * 1.1, r * (0.6 + i * 0.25), '#c8ccd4', 0.5 - i * 0.06);
      ctx.fillStyle = '#ffb050'; ctx.fillRect(Math.round(fx) - 1, Math.round(fy - 3), 2, 2);
    } else {
      ctx.save(); ctx.globalCompositeOperation = 'lighter';
      smudge(ctx, fx, fy - 1, r * 4, '#ff9a40', 0.55 * (1 - d));
      ctx.restore();
      fillPoly(ctx, [fx - r * 0.5, fy, fx, fy - r * 1.6, fx + r * 0.5, fy], '#ffc060');
      fillPoly(ctx, [fx - r * 0.25, fy, fx, fy - r * 0.9, fx + r * 0.25, fy], '#fff0b0');
      ctx.fillStyle = rgba('#ffa040', 0.35 * (1 - d)); ctx.beginPath(); ctx.ellipse(fx, fy + 1, r * 3, r * 0.5, 0, 0, Math.PI * 2); ctx.fill();
      pool(s, fx, fy, Math.max(30, w * 0.5), '#ffa050', 0.3 * (1 - d));
    }
  };
}
