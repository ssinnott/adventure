// The viewport's scenery, cel-shaded with the engine's helpers through a Brush: the trees dressed by
// the season, the dead trees, the props scattered on open ground (#1103), the crystals, the lighthouse,
// the monastery, rocks, mountains, peaks,
// cliffs, the volcano, the creeper trees and the pillar. Every sprite draws front-facing, centred on
// (x, y) with y the ground line; `tone` darkens with distance. The monsters are ./sprites.ts's.
import { shade, mix, rgba } from '../lib/art/palettes.ts';
import { celBall, celCapsule, celPoly, celTaper, band } from '../lib/art/shading.ts';
import { B, stroke } from './monsters/common.ts';
import type { Prop } from './view/model.ts';

/**
 * How the time of year dresses a broadleaf tree: how much leaf is left (0 bare .. 1 full), how far it
 * has turned to autumn gold (`turn`) and on to brown (`brown`), spring's fresh green, blossom, and
 * the snow lying on it (0 .. 1).
 */
export interface TreeSeason { leaf: number; turn: number; brown: number; fresh: number; blossom: number; snow: number; }
export const HIGH_SUMMER: TreeSeason = { leaf: 1, turn: 0, brown: 0, fresh: 0, blossom: 0, snow: 0 };

const ramp = (v: number, a: number, b: number): number => Math.max(0, Math.min(1, (v - a) / (b - a)));
/**
 * The trees on a day of the year (see game/calendar.ts): buds in Thaw, blossom in Sowing, full leaf
 * through the summer, gold and orange in Leafturn, brown and falling through Mistfall, bare by Frost.
 */
export function treeSeason(day: number, snow: number): TreeSeason {
  return {
    leaf: ramp(day, 6, 20) * (1 - ramp(day, 80, 92)), turn: ramp(day, 58, 72), brown: ramp(day, 76, 88),
    fresh: ramp(day, 6, 12) * (1 - ramp(day, 22, 36)), blossom: ramp(day, 13, 19) * (1 - ramp(day, 24, 30)), snow,
  };
}

const LEAF = ['#3f7a3a', '#4a8a3a', '#7ab848', '#2f6a3a', '#3a7a4a'];
/** What each broadleaf variant turns to in the autumn: an orange, a gold, the birch's yellow. */
const AUTUMN = ['#c8662a', '#d8a030', '#e0c040'];
const SNOW_WHITE = '#eef2f7';

function leafColor(variant: number, s: TreeSeason): string {
  let c = mix(LEAF[variant], '#8ed058', s.fresh * 0.6);
  if (variant < 3) c = mix(mix(c, AUTUMN[variant], s.turn), '#7a5230', s.brown * 0.75);
  return c;
}

/** Bare limbs fanning up from the top of a trunk, each forking once, with snow along their tops. */
function bareCrown(ctx: CanvasRenderingContext2D, x: number, top: number, u: number, span: number, wood: string, snow: string | null, fine = false): void {
  const w = Math.max(1, u * (fine ? 0.045 : 0.07));
  for (const [dx, dy] of [[-0.62, 0.38], [-0.3, 0.7], [0.05, 0.85], [0.36, 0.66], [0.64, 0.34]]) {
    const ex = x + dx * span * u, ey = top - dy * span * u, mx = x + dx * span * u * 0.55, my = top - dy * span * u * 0.5;
    stroke(ctx, [x, top, mx, my, ex, ey], wood, w);
    stroke(ctx, [mx, my, mx + dx * u * 0.35 - u * 0.12, my - u * 0.32], wood, Math.max(1, w * 0.6));
    if (snow) stroke(ctx, [mx - 0.5, my - Math.max(1, w * 0.6), ex - 0.5, ey - Math.max(1, w * 0.6)], snow, Math.max(1, w * 0.55));
  }
}

export function drawTreeSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, variant: number, season: TreeSeason = HIGH_SUMMER): void {
  const conifer = variant >= 3;
  const trunk = shade('#5a3f2a', tone), leaf = shade(leafColor(variant, season), tone);
  const snow = season.snow > 0.15 ? shade(SNOW_WHITE, tone) : null;
  if (conifer) {
    const h = u * 2.6, w = u * 1.2;
    celCapsule(ctx, B, x, y, x, y - h * 0.3, u * 0.12, trunk, 0);
    for (let i = 0; i < 3; i++) {
      const ty = y - h * (0.25 + i * 0.25), tw = w * (1 - i * 0.22), th = h * 0.36;
      celPoly(ctx, B, [x - tw / 2, ty, x, ty - th, x + tw / 2, ty], shade(leaf, 1 - i * 0.06), 0.4, 0.25);
      // Snow on each tier: a cap at the point and a rim along the boughs.
      if (snow) {
        const k = 0.3 + 0.35 * season.snow;
        celPoly(ctx, B, [x - tw * k / 2, ty - th * (1 - k), x, ty - th, x + tw * k / 2, ty - th * (1 - k)], snow, 0.2, 0.2);
        stroke(ctx, [x - tw * 0.46, ty - th * 0.06, x - tw * 0.2, ty - th * 0.14, x + tw * 0.2, ty - th * 0.14, x + tw * 0.46, ty - th * 0.06], snow, Math.max(1, u * 0.05 * season.snow));
      }
    }
  } else if (variant === 2) {
    // A birch: pale trunk with dark marks, a taller, lighter crown.
    const h = u * 2.6, r = u * 0.6 * (0.55 + 0.45 * season.leaf), bark = shade('#e8e4d8', tone);
    celTaper(ctx, B, x, y, x, y - h * 0.62, u * 0.11, u * 0.07, bark, 0.2);
    ctx.fillStyle = shade('#3a3630', tone);
    for (let i = 0; i < 5; i++) ctx.fillRect(Math.round(x - u * 0.08 + (i % 2) * u * 0.06), Math.round(y - h * (0.1 + i * 0.11)), Math.max(1, Math.round(u * 0.09)), Math.max(1, Math.round(u * 0.03)));
    if (season.leaf < 0.6) bareCrown(ctx, x, y - h * 0.6, u, 0.75, shade('#4a4038', tone), season.leaf < 0.15 ? snow : null, true);
    if (season.leaf >= 0.15) {
      celBall(ctx, B, x - r * 0.5, y - h * 0.62, r * 0.55, shade(leaf, 0.9));
      celBall(ctx, B, x + r * 0.5, y - h * 0.66, r * 0.55, shade(leaf, 1.05));
      celBall(ctx, B, x, y - h * 0.82, r * 0.62, leaf);
    }
  } else {
    const h = u * 2.3, r = u * 0.8 * (0.5 + 0.5 * season.leaf);
    celTaper(ctx, B, x, y, x, y - h * 0.5, u * 0.16, u * 0.11, trunk, 0.2);
    // Branch hints; the whole crown of limbs once the leaves thin.
    stroke(ctx, [x, y - h * 0.4, x - u * 0.35, y - h * 0.55], trunk, Math.max(1, u * 0.08));
    stroke(ctx, [x, y - h * 0.45, x + u * 0.3, y - h * 0.6], trunk, Math.max(1, u * 0.08));
    if (season.leaf < 0.6) bareCrown(ctx, x, y - h * 0.48, u, 0.95, trunk, season.leaf < 0.15 ? snow : null);
    if (season.leaf >= 0.15) {
      celBall(ctx, B, x - r * 0.55, y - h * 0.55, r * 0.62, shade(leaf, 0.92));
      celBall(ctx, B, x + r * 0.55, y - h * 0.58, r * 0.62, shade(leaf, 1.05));
      celBall(ctx, B, x, y - h * 0.72, r * 0.75, leaf);
      celBall(ctx, B, x - r * 0.2, y - h * 0.5, r * 0.5, shade(leaf, 0.85), false);
      // Blossom on the first variant in Sowing: white and pink dabs over the crown.
      if (variant === 0 && season.blossom > 0.1 && u > 8) {
        for (let i = 0; i < 9; i++) {
          if (i / 9 > season.blossom) break;
          const a = i * 2.4, rr = r * (0.3 + 0.5 * ((i * 37) % 10) / 10);
          ctx.fillStyle = shade(i % 3 ? '#fff4f6' : '#f0a8c0', tone);
          ctx.fillRect(Math.round(x + Math.cos(a) * rr), Math.round(y - h * 0.66 + Math.sin(a) * rr * 0.7), Math.max(1, Math.round(u * 0.07)), Math.max(1, Math.round(u * 0.07)));
        }
      }
    }
  }
}

/**
 * A dead tree: a grey trunk, bleached and bare in every season, its limbs fanned or its top snapped
 * off short (`variant` 0 to 2). Snow lies along its limbs.
 */
export function drawDeadTreeSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, variant: number, snow = 0): void {
  const bark = shade(['#aaa498', '#bab4a8', '#948e84'][variant % 3], tone), dark = shade('#4a4640', tone);
  const white = snow > 0.15 ? shade(SNOW_WHITE, tone) : null;
  if (variant === 1) {
    // Snapped: a short stump of a trunk, its broken top jagged, one limb left.
    const h = u * 1.3;
    celTaper(ctx, B, x, y, x, y - h, u * 0.17, u * 0.13, bark, 0.2);
    celPoly(ctx, B, [x - u * 0.13, y - h, x - u * 0.05, y - h - u * 0.22, x + u * 0.02, y - h - u * 0.08, x + u * 0.13, y - h - u * 0.3, x + u * 0.13, y - h], bark, 0.3, 0.2);
    stroke(ctx, [x, y - h * 0.62, x - u * 0.42, y - h * 0.95], bark, Math.max(1, u * 0.07));
    if (white) stroke(ctx, [x - u * 0.13, y - h - 0.5, x + u * 0.13, y - h - 0.5], white, Math.max(1, u * 0.05));
  } else {
    const h = u * (variant === 2 ? 2.5 : 2.1);
    celTaper(ctx, B, x, y, x, y - h * 0.55, u * 0.15, u * 0.09, bark, 0.2);
    bareCrown(ctx, x, y - h * 0.52, u, variant === 2 ? 0.8 : 1, bark, white, variant === 2);
  }
  // Splits in the bark.
  ctx.fillStyle = dark;
  for (let i = 0; i < 3; i++) ctx.fillRect(Math.round(x - u * 0.04 + (i % 2) * u * 0.05), Math.round(y - u * (0.25 + i * 0.28)), Math.max(1, Math.round(u * 0.03)), Math.max(1, Math.round(u * 0.14)));
}

// ---- What stands scattered on open ground (#1103) ---------------------------------------------------

/**
 * How a prop is coloured: `ink` takes a colour as the ground under it takes its own (darker by night,
 * into the haze with distance and murk, darker in the rain), `ground` is that ground's colour in the
 * season, `snow` how far snow lies on it (0 .. 1), `bloom` how far the flowers are out (0 .. 1) and
 * `pick` a hash for its shape.
 */
interface PropInk { ink: (c: string) => string; ground: string; snow: number; bloom: number; pick: number }
/** A colour whitened as far as the snow lies, as the top of a rock is. */
const snowed = (c: string, snow: number): string => (snow > 0.2 ? mix(c, SNOW_WHITE, Math.min(1, snow * 1.2)) : c);
/** A dot of colour, a pixel at the least. */
function dab(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, c: string): void {
  ctx.fillStyle = c; ctx.fillRect(Math.round(x), Math.round(y), Math.max(1, Math.round(w)), Math.max(1, Math.round(h)));
}

/**
 * The props, each drawn about its foot at (x, y), `u` the square's half width there. Each is small, under
 * half a wall's height, and ONE thing: a boulder or a stone is one rounded rock, never stacked
 * or ringed, a snag is no post and the peat a low turf mound, so that none is taken for a feature's
 * drawing (#1110). A deep snow buries the low ones.
 */
const PROPS: Record<Prop, (ctx: CanvasRenderingContext2D, x: number, y: number, u: number, k: PropInk) => void> = {
  bush(ctx, x, y, u, { ink, ground, snow, pick }) {
    const r = u * (0.12 + 0.03 * pick), leaf = ink(mix(ground, '#24401e', 0.5));
    celBall(ctx, B, x - r * 0.75, y - r * 0.7, r * 0.8, shade(leaf, 0.9));
    celBall(ctx, B, x + r * 0.8, y - r * 0.65, r * 0.75, leaf);
    celBall(ctx, B, x, y - r * 1.15, r, shade(leaf, 1.08));
    if (snow > 0.2) { ctx.fillStyle = ink(SNOW_WHITE); ctx.beginPath(); ctx.ellipse(x, y - r * 1.9, r * 0.85, r * 0.3 * Math.min(1, snow * 1.5), 0, 0, Math.PI * 2); ctx.fill(); }
  },
  boulder(ctx, x, y, u, { ink, ground, snow, pick }) {
    const w = u * (0.16 + 0.04 * pick), h = w * (0.72 + 0.14 * pick), c = mix('#7a756c', ground, 0.15);
    celPoly(ctx, B, [x - w, y, x - w * 0.92, y - h * 0.5, x - w * 0.6, y - h * 0.9, x - w * 0.1, y - h, x + w * 0.45, y - h * 0.88, x + w * 0.88, y - h * 0.5, x + w, y], ink(c), 0.4, 0.3);
    if (snow > 0.2) celPoly(ctx, B, [x - w * 0.78, y - h * 0.7, x - w * 0.55, y - h * 0.9, x - w * 0.1, y - h, x + w * 0.45, y - h * 0.88, x + w * 0.7, y - h * 0.66, x, y - h * 0.8], ink(snowed(c, snow)), 0.2, 0.2);
  },
  thistle(ctx, x, y, u, { ink, ground, snow, bloom, pick }) {
    if (snow > 0.55) return;
    const h = u * (0.22 + 0.06 * pick), stem = ink(mix('#56704a', ground, 0.3)), lw = Math.max(1, u * 0.022);
    stroke(ctx, [x, y, x + u * 0.01, y - h], stem, lw);
    for (const s of [-1, 1]) stroke(ctx, [x, y - h * 0.3, x + s * u * 0.05, y - h * 0.42, x + s * u * 0.09, y - h * 0.4], stem, lw);
    // Its head on a green bulb: purple in flower, brown gone to seed.
    celBall(ctx, B, x + u * 0.01, y - h, u * 0.035, stem, false);
    dab(ctx, x - u * 0.02, y - h - u * 0.075, u * 0.06, u * 0.04, ink(mix('#7a6448', '#9a4ca0', bloom)));
  },
  molehill(ctx, x, y, u, { ink, snow, pick }) {
    if (snow > 0.55) return;
    const w = u * (0.13 + 0.03 * pick), h = w * 0.75, earth = '#4a3626';
    ctx.fillStyle = ink(snowed(earth, snow)); ctx.beginPath(); ctx.ellipse(x, y, w, h, 0, Math.PI, 0); ctx.fill();
    for (const [dx, dy] of [[-0.45, 0.45], [0.1, 0.8], [0.4, 0.35]]) dab(ctx, x + dx * w, y - dy * h, u * 0.02, u * 0.015, ink(shade(earth, 1.4)));
  },
  gorse(ctx, x, y, u, { ink, ground, snow, bloom, pick }) {
    // Spiny and ragged along its top, and in flower nearly all the year.
    const w = u * (0.15 + 0.04 * pick), h = w * 1.25, pts = [x - w, y];
    for (let i = 0; i <= 8; i++) { const t = i / 8; pts.push(x - w + 2 * w * t, y - h * Math.sin(Math.PI * (0.08 + 0.84 * t)) * (i % 2 ? 1 : 0.8)); }
    pts.push(x + w, y);
    celPoly(ctx, B, pts, ink(mix('#2e4a24', ground, 0.2)), 0.4, 0.25);
    if (snow > 0.2) { stroke(ctx, [x - w * 0.6, y - h * 0.85, x, y - h * 1.02, x + w * 0.6, y - h * 0.85], ink(SNOW_WHITE), Math.max(1, u * 0.04)); return; }
    for (let i = 0; i < 2 + Math.round(3 * bloom); i++) dab(ctx, x + w * 0.7 * Math.sin(i * 2.3 + pick * 6), y - h * (0.3 + 0.45 * ((i * 0.37 + pick) % 1)), u * 0.025, u * 0.025, ink('#e8c434'));
  },
  peat(ctx, x, y, u, { ink, ground, snow, pick }) {
    if (snow > 0.55) return;
    // Cut turves left to dry: a low mound, dark brown under the moor's own top.
    const w = u * (0.15 + 0.03 * pick), h = w * 0.45;
    celPoly(ctx, B, [x - w, y, x - w * 0.86, y - h * 0.75, x - w * 0.55, y - h, x + w * 0.55, y - h, x + w * 0.86, y - h * 0.75, x + w, y], ink('#3a2a20'), 0.35, 0.2);
    dab(ctx, x - w * 0.6, y - h, w * 1.2, h * 0.28, ink(snowed(mix(ground, '#3a2a28', 0.35), snow)));
  },
  tussock(ctx, x, y, u, { ink, ground, snow, pick }) {
    if (snow > 0.55) return;
    // A clump of the steppe's grass, dark at its heart and standing taller than its tufts, all leaning one way.
    const h = u * (0.2 + 0.06 * pick), lw = Math.max(1, u * 0.022), pale = ink(shade(ground, 1.25)), dun = ink(shade(ground, 0.8));
    celPoly(ctx, B, [x - u * 0.1, y, x - u * 0.07, y - h * 0.45, x, y - h * 0.6, x + u * 0.09, y - h * 0.5, x + u * 0.12, y], ink(shade(ground, 0.6)), 0.3, 0);
    for (let i = 0; i < 7; i++) {
      const t = i / 6 - 0.5, bx = x + t * u * 0.12, top = y - h * (1 - Math.abs(t) * 0.7), lean = u * (t * 0.22 + 0.04);
      stroke(ctx, [bx, y, bx + lean * 0.4, (y + top) / 2, bx + lean, top], i % 2 ? dun : pale, lw);
    }
  },
  skull(ctx, x, y, u, { ink, snow }) {
    if (snow > 0.55) return;
    // An ox's skull bleached on the ground, its horns curving up.
    const w = u * 0.07, bone = ink('#e2dac6'), lw = Math.max(1, u * 0.025);
    for (const s of [-1, 1]) stroke(ctx, [x + s * w * 0.8, y - w * 1.3, x + s * w * 2, y - w * 1.6, x + s * w * 2.3, y - w * 2.4], bone, lw);
    celPoly(ctx, B, [x - w, y - w * 1.5, x + w, y - w * 1.5, x + w * 0.8, y - w * 0.6, x + w * 0.4, y, x - w * 0.4, y, x - w * 0.8, y - w * 0.6], bone, 0.3, 0.2);
    for (const s of [-1, 1]) dab(ctx, x + s * w * 0.45 - w * 0.15, y - w * 1.15, w * 0.3, w * 0.3, ink('#3a3228'));
  },
  stone(ctx, x, y, u, { ink, ground, snow, pick }) {
    if (snow > 0.7) return;
    const w = u * (0.08 + 0.03 * pick), h = w * 0.7, c = mix('#857d70', ground, 0.25);
    celPoly(ctx, B, [x - w, y, x - w * 0.8, y - h * 0.7, x - w * 0.2, y - h, x + w * 0.5, y - h * 0.85, x + w, y - h * 0.3, x + w * 0.9, y], ink(snowed(c, snow * 0.6)), 0.4, 0.3);
  },
  stump(ctx, x, y, u, { ink, snow, pick }) {
    // A charred stump, its top burnt ragged, the char cracked across.
    const w = u * 0.075, h = u * (0.2 + 0.06 * pick), c = ink('#2c2622');
    celPoly(ctx, B, [x - w * 1.5, y, x - w, y - h * 0.3, x - w, y - h * 0.92, x - w * 0.45, y - h, x - w * 0.05, y - h * 0.8, x + w * 0.35, y - h * 1.1, x + w, y - h * 0.86, x + w, y - h * 0.3, x + w * 1.6, y], c, 0.3, 0.2);
    for (let i = 0; i < 3; i++) dab(ctx, x - w * 0.6 + (i % 2) * w * 0.5, y - h * (0.25 + 0.22 * i), w * 0.7, u * 0.015, ink('#4e423a'));
    if (snow > 0.2) stroke(ctx, [x - w * 0.9, y - h * 0.95, x + w * 0.9, y - h * 0.9], ink(SNOW_WHITE), Math.max(1, u * 0.03));
  },
  steam(ctx, x, y, u, { ink, pick }) {
    // The crack it rises from and the wisp leaning off it, its puffs run together, drawn still as the volcano's smoke is.
    const lean = (pick < 0.5 ? -1 : 1) * u * (0.04 + 0.04 * Math.abs(2 * pick - 1));
    ctx.fillStyle = ink('#1a1616'); ctx.beginPath(); ctx.ellipse(x, y, u * 0.07, u * 0.02, 0, 0, Math.PI * 2); ctx.fill();
    for (let j = 0; j < 3; j++) {
      ctx.fillStyle = rgba(ink('#e8eaec'), 0.5 - j * 0.12);
      ctx.beginPath(); ctx.arc(x + lean * (j + 0.5), y - u * (0.07 + 0.085 * j), u * (0.045 + 0.025 * j), 0, Math.PI * 2); ctx.fill();
    }
  },
  cinder(ctx, x, y, u, { ink, snow, pick }) {
    // A lump of clinker, pitted where the gas came out of it.
    const w = u * (0.11 + 0.03 * pick), h = w * 0.8, c = '#5a4034';
    celPoly(ctx, B, [x - w, y, x - w * 0.95, y - h * 0.55, x - w * 0.5, y - h * 0.95, x + w * 0.15, y - h, x + w * 0.7, y - h * 0.7, x + w, y - h * 0.2, x + w * 0.9, y], ink(c), 0.4, 0.3);
    for (const [dx, dy] of [[-0.45, 0.5], [0.1, 0.72], [0.45, 0.35]]) dab(ctx, x + dx * w, y - dy * h, u * 0.025, u * 0.02, ink('#221c1a'));
    if (snow > 0.2) stroke(ctx, [x - w * 0.5, y - h * 0.92, x + w * 0.15, y - h, x + w * 0.65, y - h * 0.72], ink(SNOW_WHITE), Math.max(1, u * 0.03));
  },
  drift(ctx, x, y, u, { ink, pick }) {
    // A stone, and the snow the wind banked against its lee to its shoulder.
    const w = u * (0.09 + 0.03 * pick), h = w * 0.95, s = pick < 0.5 ? -1 : 1, white = ink(SNOW_WHITE);
    celPoly(ctx, B, [x - w, y, x - w * 0.85, y - h * 0.7, x - w * 0.3, y - h, x + w * 0.4, y - h * 0.9, x + w, y - h * 0.4, x + w * 0.95, y], ink('#605c58'), 0.4, 0.3);
    celPoly(ctx, B, [x + s * w * 0.2, y, x + s * w * 0.55, y - h * 0.75, x + s * w * 0.95, y - h * 0.6, x + s * w * 2.6, y], white, 0.25, 0.15);
    stroke(ctx, [x - w * 0.55, y - h * 0.86, x - w * 0.2, y - h, x + w * 0.3, y - h * 0.9], white, Math.max(1, u * 0.03));
  },
  reeds(ctx, x, y, u, { ink, ground, pick }) {
    // Pale against the swamp's green, two of them with a brown head.
    const h = u * (0.32 + 0.08 * pick), lw = Math.max(1, u * 0.03), blade = ink(mix('#b8c068', ground, 0.15)), dark = ink(mix('#4e5a2a', ground, 0.2)), head = ink('#5a3a22');
    for (let i = 0; i < 6; i++) {
      const t = i / 5 - 0.5, bx = x + t * u * 0.14, top = y - h * (0.62 + 0.38 * (((i * 7 + 3) % 5) / 4)), lean = u * t * 0.08;
      stroke(ctx, [bx, y, bx + lean, top], i % 2 ? dark : blade, lw);
      if (i === 1 || i === 4) celCapsule(ctx, B, bx + lean * 0.9, top + u * 0.03, bx + lean * 0.8, top + u * 0.09, u * 0.022, head, 0.3);
    }
  },
  snag(ctx, x, y, u, { ink, snow, pick }) {
    // A dead trunk standing in the wet, leaning, snapped off ragged, the stub of a limb on it.
    const h = u * (0.3 + 0.08 * pick), s = pick < 0.5 ? -1 : 1, lean = u * 0.05 * s, wood = ink('#8c867c');
    celTaper(ctx, B, x, y, x + lean, y - h, u * 0.045, u * 0.028, wood, 0.2);
    celPoly(ctx, B, [x + lean - u * 0.028, y - h, x + lean - u * 0.01, y - h - u * 0.06, x + lean + u * 0.008, y - h - u * 0.02, x + lean + u * 0.028, y - h - u * 0.08, x + lean + u * 0.028, y - h], wood, 0.3, 0.2);
    stroke(ctx, [x + lean * 0.5, y - h * 0.55, x + lean * 0.5 - s * u * 0.1, y - h * 0.78], wood, Math.max(1, u * 0.025));
    if (snow > 0.2) stroke(ctx, [x + lean - u * 0.025, y - h - u * 0.01, x + lean + u * 0.025, y - h - u * 0.01], ink(SNOW_WHITE), Math.max(1, u * 0.025));
  },
  driftwood(ctx, x, y, u, { ink, snow, pick }) {
    // A bleached log the water left, a broken limb up from it.
    const w = u * (0.16 + 0.04 * pick), r = u * 0.032, wood = ink(snowed('#c4baa6', snow * 0.5));
    celCapsule(ctx, B, x - w, y - r, x + w, y - r * 1.3, r, wood, 0.3);
    stroke(ctx, [x + w * 0.45, y - r * 1.8, x + w * 0.7, y - r * 4.2], wood, Math.max(1, r * 0.9));
  },
  shells(ctx, x, y, u, { ink, ground, snow, pick }) {
    if (snow > 0.55) return;
    // A few shells the tide left, each with its shadow on the sand.
    const r = Math.max(1, u * 0.04), under = ink(shade(ground, 0.72));
    for (let j = 0; j < 4; j++) {
      const sx = x + u * (j * 0.08 - 0.12 + 0.03 * Math.sin(pick * 9 + j)), sy = y - u * 0.02 * (j % 2);
      ctx.fillStyle = under; ctx.beginPath(); ctx.ellipse(sx + r * 0.2, sy + r * 0.15, r, r * 0.45, 0, 0, Math.PI * 2); ctx.fill();
      ctx.fillStyle = ink(['#f6efe2', '#d89a84', '#efe0c8', '#c8b8a8'][j]);
      ctx.beginPath(); ctx.ellipse(sx, sy, r, r * 0.75, 0, Math.PI, 0); ctx.fill();
    }
  },
};

/** A prop scattered on open ground (#1103), its foot at (x, y), `u` the square's half width there. */
export function drawPropSprite(ctx: CanvasRenderingContext2D, prop: Prop, x: number, y: number, u: number, k: PropInk): void { PROPS[prop](ctx, x, y, u, k); }

/**
 * A glass tree of the Sunder's lip: shards of crystal standing up from one root, the tallest in the
 * middle (`variant` 0 to 2 its tint and lean). By day (`glint` 0 .. 1) a point of light catches it.
 */
export function drawCrystalSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, variant: number, glint = 0): void {
  const glass = ['#b8d8f0', '#c8bef0', '#a8e4e0'][variant % 3], lean = [0, 0.12, -0.1][variant % 3];
  const lit = shade(mix(glass, '#ffffff', 0.35), tone), body = shade(glass, tone), deep = shade(mix(glass, '#2a3458', 0.5), tone);
  // Base offset, height, width at the foot and lean, each in squares.
  const shards: [number, number, number, number][] = [[-0.34, 1.4, 0.26, -0.28], [0.36, 1.7, 0.28, 0.22], [-0.1, 0.9, 0.22, -0.12], [0.02, 2.5, 0.36, lean], [0.22, 1.0, 0.2, 0.3]];
  ctx.save(); ctx.globalAlpha = 0.88;
  let tip: [number, number] = [x, y];
  for (const [dx, h, w, l] of shards) {
    const bx = x + dx * u, tx = bx + l * u, ty = y - h * u, hw = (w * u) / 2;
    ctx.fillStyle = deep; ctx.beginPath(); ctx.moveTo(bx - hw, y); ctx.lineTo(tx, ty); ctx.lineTo(bx, y); ctx.closePath(); ctx.fill();
    ctx.fillStyle = body; ctx.beginPath(); ctx.moveTo(bx, y); ctx.lineTo(tx, ty); ctx.lineTo(bx + hw, y); ctx.closePath(); ctx.fill();
    ctx.strokeStyle = lit; ctx.lineWidth = Math.max(1, u * 0.03); ctx.beginPath(); ctx.moveTo(bx, y); ctx.lineTo(tx, ty); ctx.stroke();
    if (ty < tip[1]) tip = [tx, ty];
  }
  ctx.restore();
  ctx.strokeStyle = shade('#1a1e2e', tone); ctx.lineWidth = 1;
  for (const [dx, h, w, l] of shards) { const bx = x + dx * u, hw = (w * u) / 2; ctx.beginPath(); ctx.moveTo(bx - hw, y); ctx.lineTo(bx + l * u, y - h * u); ctx.lineTo(bx + hw, y); ctx.stroke(); }
  // The light it catches: a four-pointed star a little under the tallest tip.
  if (glint > 0.2) {
    const [gx, gy] = [tip[0] - u * 0.02, tip[1] + u * 0.35], s = Math.max(2, Math.min(8, u * 0.18) * glint);
    ctx.save(); ctx.globalAlpha = Math.min(1, glint); ctx.strokeStyle = '#ffffff'; ctx.lineWidth = Math.max(1, u * 0.04);
    ctx.beginPath(); ctx.moveTo(gx - s, gy); ctx.lineTo(gx + s, gy); ctx.moveTo(gx, gy - s); ctx.lineTo(gx, gy + s); ctx.stroke();
    ctx.restore();
  }
}

/**
 * A lighthouse standing on its square, its foot at y: a stone plinth, a white tower tapering up with
 * two red bands, the gallery's rail, the glazed lamp room and a red cap. The lamp room is dark glass,
 * or glowing when `lamp` is 1 (lit by night). Gives where the lamp is, for its light and its beam.
 */
/** A lighthouse's height over its foot, in squares' half widths, and its bands from the foot up (red or white). */
export const LIGHTHOUSE_HEIGHT = 5.2;
export const LIGHTHOUSE_BANDS: readonly [number, number, boolean][] = [[0, 0.33, false], [0.33, 0.47, true], [0.47, 0.73, false], [0.73, 0.86, true], [0.86, 1, false]];

export function drawLighthouseSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, lamp = 0, snow = 0): { x: number; y: number; r: number } {
  const H = u * LIGHTHOUSE_HEIGHT, wb = u * 0.42, wt = u * 0.26, plinth = u * 0.55;
  const white = shade('#ece6da', tone), shadow = shade('#bdb6a8', tone), red = shade('#b23a2c', tone), redShadow = shade('#86281e', tone);
  const stone = shade('#6e6a64', tone), dark = shade('#2a2622', tone);
  const halfAt = (h: number): number => wb + (wt - wb) * (h / H);
  // The plinth, snow along its top.
  ctx.fillStyle = stone; ctx.fillRect(Math.round(x - u * 0.55), Math.round(y - plinth), Math.round(u * 1.1), Math.round(plinth));
  ctx.fillStyle = shade('#56524c', tone); ctx.fillRect(Math.round(x + u * 0.1), Math.round(y - plinth), Math.round(u * 0.45), Math.round(plinth));
  if (snow > 0.2) { ctx.fillStyle = shade('#eef2f7', tone); ctx.fillRect(Math.round(x - u * 0.55), Math.round(y - plinth), Math.round(u * 1.1), Math.max(1, Math.round(u * 0.06))); }
  // The tower: a band at a time from the plinth up, lit on the left and shaded on the right.
  const top = y - H, base = y - plinth;
  for (const [a, b, isRed] of LIGHTHOUSE_BANDS) {
    const ya = base - (base - top) * a, yb = base - (base - top) * b, ha = halfAt(y - ya), hb = halfAt(y - yb);
    ctx.fillStyle = isRed ? red : white; ctx.beginPath(); ctx.moveTo(x - ha, ya); ctx.lineTo(x - hb, yb); ctx.lineTo(x, yb); ctx.lineTo(x, ya); ctx.closePath(); ctx.fill();
    ctx.fillStyle = isRed ? redShadow : shadow; ctx.beginPath(); ctx.moveTo(x, ya); ctx.lineTo(x, yb); ctx.lineTo(x + hb, yb); ctx.lineTo(x + ha, ya); ctx.closePath(); ctx.fill();
  }
  // A door and two windows up the tower.
  ctx.fillStyle = dark;
  ctx.fillRect(Math.round(x - u * 0.09), Math.round(base - u * 0.4), Math.max(1, Math.round(u * 0.18)), Math.max(1, Math.round(u * 0.4)));
  for (const f of [0.4, 0.62]) ctx.fillRect(Math.round(x - u * 0.04), Math.round(base - (base - top) * f), Math.max(1, Math.round(u * 0.08)), Math.max(1, Math.round(u * 0.14)));
  // The gallery: a rail wider than the tower's head.
  const gw = wt + u * 0.12, gh = Math.max(1, u * 0.08);
  ctx.fillStyle = dark; ctx.fillRect(Math.round(x - gw), Math.round(top - gh), Math.round(gw * 2), Math.round(gh));
  // The lamp room: glass between iron frames, dark or lit.
  const lw = wt * 0.8, lh = u * 0.5, ly = top - gh - lh;
  ctx.fillStyle = lamp > 0 ? mix(shade('#3a4450', tone), '#ffe7a0', lamp) : shade('#3a4450', tone);
  ctx.fillRect(Math.round(x - lw), Math.round(ly), Math.round(lw * 2), Math.round(lh));
  ctx.fillStyle = dark;
  for (const f of [-1, 0, 1]) ctx.fillRect(Math.round(x + f * lw * 0.95 - Math.max(1, u * 0.02)), Math.round(ly), Math.max(1, Math.round(u * 0.04)), Math.round(lh));
  // The cap: a red cone and a finial.
  const ch = u * 0.4;
  ctx.fillStyle = red; ctx.beginPath(); ctx.moveTo(x - lw * 1.2, ly); ctx.lineTo(x, ly - ch); ctx.lineTo(x + lw * 1.2, ly); ctx.closePath(); ctx.fill();
  ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, u * 0.03); ctx.beginPath(); ctx.moveTo(x, ly - ch); ctx.lineTo(x, ly - ch - u * 0.18); ctx.stroke();
  return { x, y: ly + lh / 2, r: Math.max(2, lw * 1.2) };
}

/**
 * A monastery standing on its square, its foot at y: a long wall of grey stone with its gate's arch
 * and a row of slits, the chapel's roof over it, and two bell towers standing up over it all, each
 * with its bell in an open belfry under a steep slate cap. No lamp: by night it is as dark as the
 * hills. Snow lies along the wall's top and on the caps when `snow` lies. Wider than its square, as
 * it is seen from far off; near to, the block of building squares it stands in hides its foot.
 */
export function drawMonasterySprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, snow = 0): void {
  const stone = shade('#a8a090', tone), shadow = shade('#7e776a', tone), coping = shade('#5e584e', tone);
  const slate = shade('#555660', tone), slateShadow = shade('#393a42', tone), dark = shade('#221e1a', tone);
  const bronze = shade('#b08a42', tone), white = shade('#eef2f7', tone), snowy = snow > 0.2;
  const R = Math.round, px = (v: number): number => Math.max(1, Math.round(v));
  const tri = (a: number, b: number, c: number, d: number, e: number, f: number, fill: string): void => {
    ctx.fillStyle = fill; ctx.beginPath(); ctx.moveTo(a, b); ctx.lineTo(c, d); ctx.lineTo(e, f); ctx.closePath(); ctx.fill();
  };
  // The wall, lit from the left and its right-hand end in shade, its coping, and snow along the top.
  const ww = u * 1.7, top = y - u * 1.25;
  ctx.fillStyle = stone; ctx.fillRect(R(x - ww), R(top), R(ww * 2), R(y - top));
  ctx.fillStyle = shadow; ctx.fillRect(R(x + ww * 0.7), R(top), R(ww * 0.3), R(y - top));
  ctx.fillStyle = coping; ctx.fillRect(R(x - ww), R(top), R(ww * 2), px(u * 0.08));
  if (snowy) { ctx.fillStyle = white; ctx.fillRect(R(x - ww), R(top - u * 0.05), R(ww * 2), px(u * 0.06)); }
  // The gate's arch in the middle of the wall's foot, and a row of slits.
  const gw = u * 0.22, gh = u * 0.62;
  ctx.fillStyle = dark; ctx.beginPath(); ctx.moveTo(x - gw, y); ctx.lineTo(x - gw, y - gh + gw); ctx.arc(x, y - gh + gw, gw, Math.PI, 0); ctx.lineTo(x + gw, y); ctx.closePath(); ctx.fill();
  for (const f of [-0.82, -0.5, 0.5, 0.82]) ctx.fillRect(R(x + f * ww - u * 0.03), R(top + u * 0.3), px(u * 0.06), px(u * 0.26));
  // The chapel's roof over the wall between the towers, a ridge of slate.
  tri(x - u * 0.62, top, x, top - u * 0.62, x, top, slate);
  tri(x, top, x, top - u * 0.62, x + u * 0.62, top, slateShadow);
  // The towers: each lit on its left, its belfry open with the bell hung in it, its cap steep slate
  // with a finial, and snow along the cap's foot.
  const tw = u * 0.3, tt = y - u * 3.55, cap = u * 1.05;
  for (const tx of [x - u * 0.9, x + u * 0.9]) {
    ctx.fillStyle = stone; ctx.fillRect(R(tx - tw), R(tt), R(tw), R(y - tt));
    ctx.fillStyle = shadow; ctx.fillRect(R(tx), R(tt), R(tw), R(y - tt));
    ctx.fillStyle = coping; ctx.fillRect(R(tx - tw * 1.15), R(tt + u * 0.82), R(tw * 2.3), px(u * 0.07));
    const bw = tw * 0.62, b0 = tt + u * 0.16, b1 = tt + u * 0.74;
    ctx.fillStyle = dark; ctx.beginPath(); ctx.moveTo(tx - bw, b1); ctx.lineTo(tx - bw, b0 + bw); ctx.arc(tx, b0 + bw, bw, Math.PI, 0); ctx.lineTo(tx + bw, b1); ctx.closePath(); ctx.fill();
    const bh = u * 0.24, bt = b0 + bw * 0.9;
    ctx.fillStyle = bronze; ctx.beginPath(); ctx.moveTo(tx - bw * 0.3, bt); ctx.lineTo(tx + bw * 0.3, bt); ctx.lineTo(tx + bw * 0.62, bt + bh); ctx.lineTo(tx - bw * 0.62, bt + bh); ctx.closePath(); ctx.fill();
    ctx.fillStyle = dark; ctx.fillRect(R(tx - tw * 0.04), R(tt + u * 1.3), px(u * 0.05), px(u * 0.22));
    tri(tx - tw * 1.25, tt, tx, tt - cap, tx, tt, slate);
    tri(tx, tt, tx, tt - cap, tx + tw * 1.25, tt, slateShadow);
    if (snowy) { ctx.fillStyle = white; ctx.fillRect(R(tx - tw * 1.25), R(tt - u * 0.05), R(tw * 2.5), px(u * 0.06)); }
    ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, u * 0.03); ctx.beginPath(); ctx.moveTo(tx, tt - cap); ctx.lineTo(tx, tt - cap - u * 0.3); ctx.stroke();
  }
}

export function drawRockSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, snow = 0): void {
  const w = u * 1.3, h = u * 0.8;
  const c = shade('#7a7468', tone);
  celPoly(ctx, B, [x - w / 2, y, x - w * 0.4, y - h * 0.7, x - w * 0.1, y - h, x + w * 0.25, y - h * 0.85, x + w / 2, y - h * 0.4, x + w * 0.42, y], c, 0.4, 0.3);
  // The top face, white once snow lies.
  const top = shade(c, 1.15);
  celPoly(ctx, B, [x - w * 0.4, y - h * 0.7, x - w * 0.1, y - h, x + w * 0.25, y - h * 0.85, x + w * 0.02, y - h * 0.62], snow > 0.2 ? mix(top, shade(SNOW_WHITE, tone), Math.min(1, snow * 1.2)) : top, 0.2, 0.2);
  celBall(ctx, B, x + w * 0.42, y - u * 0.12, u * 0.18, shade(c, 0.9), false);
}

export function drawMountainSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, variant: number): void {
  const w = u * 2.6, h = u * (1.7 + variant * 0.25);
  const c = shade('#6a6670', tone);
  celPoly(ctx, B, [x - w / 2, y, x - w * 0.22, y - h * 0.6, x - w * 0.08, y - h, x + w * 0.12, y - h * 0.8, x + w * 0.3, y - h * 0.55, x + w / 2, y], c, 0.45, 0.25);
  // Snow cap and a ridge line.
  celPoly(ctx, B, [x - w * 0.15, y - h * 0.78, x - w * 0.08, y - h, x + w * 0.12, y - h * 0.8, x + w * 0.05, y - h * 0.7, x - w * 0.02, y - h * 0.76], shade('#e8ecf0', tone), 0.3, 0.2);
  stroke(ctx, [x - w * 0.08, y - h, x - w * 0.02, y - h * 0.6, x + w * 0.06, y - h * 0.3], shade(c, 0.7), 1);
}

/**
 * A peak: a summit standing over the mountains, taller and steeper than any of them, white from its
 * top down to the snow line, `snow` of its height, and below the line in tongues down its gullies.
 */
export function drawPeakSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, variant: number, snow: number): void {
  const w = u * 2.4, h = u * (2.6 + variant * 0.25);
  // Its flanks as [height, offset], from the foot (0) to the top (1), the offset a share of its width.
  const left: [number, number][] = [[0, -0.5], [0.42, -0.3], [0.76, -0.13], [1, 0.02]];
  const right: [number, number][] = [[1, 0.02], [0.84, 0.13], [0.55, 0.3], [0, 0.5]];
  const across = (side: [number, number][], t: number): number => {
    for (let i = 0; i < side.length - 1; i++) {
      const [t0, f0] = side[i], [t1, f1] = side[i + 1];
      if ((t - t0) * (t - t1) <= 0) return f0 + ((f1 - f0) * (t - t0)) / (t1 - t0);
    }
    return 0;
  };
  const pt = (t: number, f: number): number[] => [x + f * w, y - t * h];
  const c = shade('#7c7e8a', tone);
  celPoly(ctx, B, [...left, ...right.slice(1)].flatMap(([t, f]) => pt(t, f)), c, 0.45, 0.25);
  // The snow: up the left flank from the line, over the top and down the right, then back along the
  // line in tongues, each inside the flanks, which only widen below it.
  const line = 1 - Math.min(0.88, Math.max(0.2, snow)), fl = across(left, line), fr = across(right, line);
  const cap = [...pt(line, fl), ...left.filter(([t]) => t > line).flatMap(([t, f]) => pt(t, f)), ...right.slice(1).filter(([t]) => t > line).flatMap(([t, f]) => pt(t, f)), ...pt(line, fr)];
  for (let k = 1; k < 8; k++) cap.push(...pt(k % 2 ? Math.max(0.03, line - 0.05 - 0.04 * ((k * 7 + variant * 3) % 3)) : line + 0.02, fr + ((fl - fr) * k) / 8));
  celPoly(ctx, B, cap, shade(SNOW_WHITE, tone), 0.22, 0.15);
  stroke(ctx, [...pt(1, 0.02), ...pt(0.72, 0.07), ...pt(0.45, 0.15)], shade(c, 0.75), 1);
}

/**
 * A cliff: an escarpment's sheer face, as tall as a mountain but upright at its sides and broken only
 * a little along its top, so a line of them stands as one face. Its beds run across it in ledges, lit
 * along their lips; snow lies along its top, `snow` of the way to its deepest (0 to 1), and once deep
 * on the ledges too.
 */
export function drawCliffSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, variant: number, snow: number): void {
  const w = u * 2.1, h = u * (1.9 + variant * 0.2), c = shade('#585c6a', tone);
  const pt = (t: number, f: number): number[] => [x + f * w, y - t * h];
  const top: [number, number][] = [[0.95, -0.49], [1, -0.32], [0.96, -0.1], [0.93 + 0.03 * variant, 0.16], [0.98, 0.34], [0.95, 0.49]];
  celPoly(ctx, B, [...pt(0, -0.5), ...top.flatMap(([t, f]) => pt(t, f)), ...pt(0, 0.5)], c, 0.3, 0.2);
  // The beds, each a ledge dark under its lip and lit along it, and the joints down the face.
  const lw = Math.max(1, u * 0.05), beds = [0.22, 0.47, 0.7];
  for (const t of beds) {
    stroke(ctx, [...pt(t, -0.47), ...pt(t + 0.02, 0.47)], shade(c, 0.66), lw);
    stroke(ctx, [...pt(t + 0.035, -0.46), ...pt(t + 0.055, 0.46)], shade(c, 1.18), Math.max(1, lw * 0.6));
  }
  for (const [f, t0, t1] of [[-0.3 + 0.08 * variant, 0.9, 0.5], [0.12, 0.45, 0.06], [0.33 - 0.06 * variant, 0.86, 0.24]]) stroke(ctx, [...pt(t0, f), ...pt(t1, f + 0.02)], shade(c, 0.6), 1);
  if (snow <= 0.05) return;
  const deep = 0.03 + 0.07 * Math.min(1, snow), white = shade(SNOW_WHITE, tone);
  celPoly(ctx, B, [...top.flatMap(([t, f]) => pt(t, f)), ...[...top].reverse().flatMap(([t, f]) => pt(t - deep, f * 0.98))], white, 0.2, 0.1);
  if (snow > 0.5) for (const t of beds) stroke(ctx, [...pt(t + 0.03, -0.45), ...pt(t + 0.05, 0.45)], white, lw);
}

/**
 * The volcano: a cone of black rock, broader than a mountain and cut off flat at its lip, with ash
 * run grey down its flanks. A vent (`vent`) is a mouth in it: its fire showing in the lip, `glow` of
 * the way to its brightest (by night), and its smoke going up. Snow lies thin under the lip, `snow`
 * of the way to its deepest, and never in the mouth.
 */
export function drawVolcanoSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, variant: number, vent: boolean, glow: number, snow: number): void {
  const w = u * 2.8, h = u * (1.75 + variant * 0.15), c = shade('#48302c', tone);
  const pt = (t: number, f: number): number[] => [x + f * w, y - t * h];
  const left: [number, number][] = [[0, -0.5], [0.18, -0.36], [0.45, -0.24], [0.75, -0.155], [1, -0.11]];
  const right: [number, number][] = [[1, 0.1], [0.72, 0.15], [0.42, 0.23], [0.16, 0.35], [0, 0.5]];
  celPoly(ctx, B, [...left.flatMap(([t, f]) => pt(t, f)), ...pt(0.97, -0.04), ...pt(0.99, 0.03), ...right.flatMap(([t, f]) => pt(t, f))], c, 0.45, 0.25);
  // The ash run down the flanks from the lip, each streak inside the cone.
  const ash = shade('#746a64', tone), lw = Math.max(1, u * 0.06);
  for (const [f0, f1, t1] of [[-0.08, -0.2, 0.3], [0.02 + 0.02 * variant, 0.05, 0.12], [0.07, 0.22, 0.25]]) stroke(ctx, [...pt(0.96, f0), ...pt(0.6, (f0 * 2 + f1) / 3), ...pt(t1, f1)], ash, lw);
  if (snow > 0.05) {
    const line = 1 - 0.3 * Math.min(1, snow), at = (side: [number, number][], t: number): number => {
      for (let i = 0; i < side.length - 1; i++) { const [t0, g0] = side[i], [t1, g1] = side[i + 1]; if ((t - t0) * (t - t1) <= 0) return g0 + ((g1 - g0) * (t - t0)) / (t1 - t0); }
      return 0;
    };
    const fl = at(left, line), fr = at(right, line), cap = [...pt(line, fl), ...pt(1, -0.11), ...pt(0.97, -0.04), ...pt(0.99, 0.03), ...pt(1, 0.1), ...pt(line, fr)];
    for (let k = 1; k < 6; k++) cap.push(...pt(k % 2 ? line + 0.06 : line - 0.04 * (1 + ((k + variant) % 2)), fr + ((fl - fr) * k) / 6));
    celPoly(ctx, B, cap, shade(SNOW_WHITE, tone), 0.22, 0.15);
  }
  if (!vent) return;
  // The mouth: dark rock about a fire that is dull by day and bright by night, whatever the light.
  const [mx, my] = pt(0.99, 0), mw = w * 0.16, mh = Math.max(1.5, h * 0.05);
  ctx.fillStyle = shade('#2a1e1e', tone); ctx.beginPath(); ctx.ellipse(mx, my, mw, mh, 0, 0, Math.PI * 2); ctx.fill();
  ctx.fillStyle = mix('#7a2a14', '#ffb040', glow); ctx.beginPath(); ctx.ellipse(mx, my + mh * 0.15, mw * 0.7, mh * 0.6, 0, 0, Math.PI * 2); ctx.fill();
  // The smoke, rising and leaning off with the wind, lit red from under by night.
  for (let k = 0; k < 3; k++) {
    const r = u * (0.14 + 0.06 * k), sx = mx + u * (0.05 + 0.1 * k) * (variant === 1 ? -1 : 1), sy = my - u * (0.16 + 0.27 * k);
    ctx.fillStyle = rgba(mix(shade('#9a948e', Math.max(tone, 0.4)), '#c0583a', glow * (0.5 - k * 0.12)), 0.6 - k * 0.14);
    ctx.beginPath(); ctx.arc(sx, sy, r, 0, Math.PI * 2); ctx.fill();
  }
}

/**
 * A tree of the shore hung with creepers: a leaning trunk, a broad crown and the creepers' curtains
 * hanging from it most of the way to the ground, leaves along each strand. They keep their green on
 * the warm shore, duller as the trees' leaves go; snow lies along the crown.
 */
export function drawVineSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, variant: number, season: TreeSeason = HIGH_SUMMER): void {
  const h = u * 2.5, dull = (1 - season.leaf) * 0.6, lean = u * 0.1 * (variant - 1);
  const trunk = shade('#4a3a2c', tone), leaf = shade(mix('#2a6a2e', '#5a6a34', dull), tone), strand = shade(mix('#3a7a30', '#6a6a38', dull), tone);
  const cx = x + lean, cy = y - h * 0.74, r = u * 0.7;
  celTaper(ctx, B, x, y, cx, y - h * 0.66, u * 0.15, u * 0.09, trunk, 0.2);
  celBall(ctx, B, cx - r * 0.62, cy + r * 0.12, r * 0.66, shade(leaf, 0.9));
  celBall(ctx, B, cx + r * 0.62, cy + r * 0.08, r * 0.66, shade(leaf, 1.05));
  celBall(ctx, B, cx, cy - r * 0.18, r * 0.78, leaf);
  // The curtains: strands from under the crown, longer and shorter by turns, each a little waved.
  const sw = Math.max(1, u * 0.045);
  for (let k = 0; k < 6; k++) {
    const sx = cx + (-0.8 + 0.32 * k) * r, top = cy + r * (0.3 + 0.25 * (1 - Math.abs(-0.8 + 0.32 * k))), len = h * (0.28 + 0.06 * ((k * 3 + variant * 2) % 5));
    const sway = u * 0.05 * (k % 2 ? 1 : -1);
    stroke(ctx, [sx, top, sx + sway, top + len * 0.5, sx, top + len], strand, sw);
    ctx.fillStyle = shade(leaf, 1.12);
    for (let j = 1; j < 4; j++) { const ly = top + (len * j) / 4, lx = sx + (j % 2 ? sway : -sway * 0.5); ctx.beginPath(); ctx.ellipse(lx + (j % 2 ? sw : -sw), ly, sw * 1.6, sw, 0, 0, Math.PI * 2); ctx.fill(); }
  }
  if (season.snow > 0.15) {
    const white = shade(SNOW_WHITE, tone), sl = Math.max(1, u * 0.08 * season.snow);
    stroke(ctx, [cx - r * 1.1, cy + r * 0.02, cx - r * 0.6, cy - r * 0.5, cx, cy - r * 0.92, cx + r * 0.6, cy - r * 0.52, cx + r * 1.1, cy - r * 0.02], white, sl);
  }
}

export function drawPillarSprite(ctx: CanvasRenderingContext2D, x: number, horizon: number, u: number, tone: number): void {
  const w = u * 0.5, c = shade('#8a8690', tone);
  celPoly(ctx, B, [x - w / 2, horizon + u, x - w * 0.4, horizon - u * 0.9, x + w * 0.4, horizon - u * 0.9, x + w / 2, horizon + u], c, 0.4, 0.3);
  band(ctx, B, x - w * 0.6, horizon - u, w * 1.2, u * 0.14, shade(c, 1.1));
  band(ctx, B, x - w * 0.6, horizon + u - u * 0.12, w * 1.2, u * 0.12, shade(c, 0.9));
}
