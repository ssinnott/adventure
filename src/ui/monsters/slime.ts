// The cellar slime: a lens of goo slumped on the floor, with what it has eaten still in it. There
// is no face on it, because the two round pits and the curved maw the old drawing carried put the
// eye-eye-mouth triangle inside the human canon (eye-to-mouth over interocular 1.29, against a
// human 1.05-1.15) and gave the maw a sagitta of +0.065h -- corners above the middle, which is a
// smile. A bone reads at every size the game draws this thing at and says what it does instead.
// The mass is widest where the floor stops it spreading and its underside bulges DOWN, because goo
// at rest does; it is DARK where it is thick and bright where the floor's light comes through the
// thin base, which is the whole of why it reads as jelly rather than as painted stone. Debris is
// drawn UNDER the jelly gradient so the goo tints it, bubbles are voids with a lit top and a dark
// floor, and the puddle carries no ink so the body melts into the ground instead of standing on a
// plate. Every green comes from the def's tint.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer, Paint } from './common.ts';
import { B, groundShadow } from './common.ts';
import { blob, lumpy, appendCurve, tubeOutline } from './gloss.ts';
import type { Part } from './gloss.ts';
import { shade, mix, rgba } from '../../lib/art/palettes.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['slime'];
export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => { void kind; slime(ctx, x, y, h, p); };

const MOUND: number[] = new Array<number>(40).fill(0);

/** Signed area, to give every subpath of the clip the same winding (gloss.ts keeps its own copy). */
function clockwise(pts: readonly number[]): number[] {
  let a = 0;
  for (let i = 0; i < pts.length; i += 2) {
    const j = (i + 2) % pts.length;
    a += pts[i] * pts[j + 1] - pts[j] * pts[i + 1];
  }
  if (a >= 0) return pts as number[];
  const o: number[] = [];
  for (let i = pts.length - 2; i >= 0; i -= 2) o.push(pts[i], pts[i + 1]);
  return o;
}

function slime(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, p: Paint): void {
  const wob = p.breathe;
  const w = h * 1.5 * (1 + wob * 0.03), hh = h * 0.86 * (1 - wob * 0.035);
  const tone = p.tone;
  // A slime is a lens, not a painted lump: it is DARK where the goo is thick and bright where it is
  // thin. The old drawing lit it top-left like a boulder and finished 61% of its body above L160
  // with 2% below L64, which is why it read as one flat bright green.
  const skin = shade(mix(p.base, '#2d6743', 0.56), tone);
  const deep = shade(mix(p.dark, '#04120a', 0.8), tone);
  const thin = shade(mix(p.light, '#e6ffc0', 0.56), tone);
  const rim = shade(mix(p.light, '#f2ffdc', 0.72), tone);
  const boneHex = shade(mix('#efe8d4', p.base, 0.16), tone);

  groundShadow(ctx, x, y + 1, w * 0.62);

  // --- the shape ------------------------------------------------------------------------------
  let k = 0;
  const M = (px: number, py: number): void => { MOUND[k++] = px; MOUND[k++] = py; };
  M(x - w * 0.560, y - hh * 0.06); M(x - w * 0.585, y - hh * 0.22); M(x - w * 0.545, y - hh * 0.40);
  M(x - w * 0.520, y - hh * 0.58); M(x - w * 0.430, y - hh * 0.78); M(x - w * 0.290, y - hh * 0.94);
  M(x - w * 0.120, y - hh * 1.02); M(x + w * 0.045, y - hh * 0.98); M(x + w * 0.120, y - hh * 0.88);
  M(x + w * 0.150, y - hh * 0.70);                                   // the cleft between the lobes
  M(x + w * 0.235, y - hh * 0.62); M(x + w * 0.320, y - hh * 0.72); M(x + w * 0.410, y - hh * 0.62);
  M(x + w * 0.470, y - hh * 0.44); M(x + w * 0.520, y - hh * 0.28); M(x + w * 0.540, y - hh * 0.12);
  M(x + w * 0.500, y - hh * 0.02);
  M(x + w * 0.270, y + hh * 0.012); M(x + w * 0.010, y + hh * 0.020); M(x - w * 0.280, y + hh * 0.010);
  const drips: Part[] = [
    // a pendant drop off the near overhang: thin where it leaves the mass, heavy at its tip, and
    // hanging clear of the floor
    { k: 'tube', pts: [x + w * 0.415, y - hh * 0.56, x + w * 0.455, y - hh * 0.44, x + w * 0.465, y - hh * 0.30 + wob * h * 0.022], r0: h * 0.030, r1: h * 0.044, wobble: 0.06, seed: 8 },
    // a tongue of it that has already run out onto the floor, thin and spread
    { k: 'curve', pts: [
      x - w * 0.70, y - hh * 0.02, x - w * 0.56, y - hh * 0.12, x - w * 0.40, y - hh * 0.07,
      x - w * 0.46, y + hh * 0.022, x - w * 0.64, y + hh * 0.018,
    ], wobble: 0.13, seed: 7, sub: 2 },
  ];
  const mound: Part = { k: 'curve', pts: MOUND, wobble: 0.028, seed: 2, sub: 3 };

  // The wet floor it sits in: no ink on it at all, so the body melts into the ground instead of
  // standing on a plate. The old puddle was its own outlined blob and read as exactly that.
  if (!B.override) {
    const pg = ctx.createRadialGradient(x - w * 0.04, y + h * 0.01, 0, x - w * 0.04, y + h * 0.01, w * 0.82);
    pg.addColorStop(0, rgba(deep, 0.34)); pg.addColorStop(0.55, rgba(deep, 0.26));
    pg.addColorStop(0.82, rgba(thin, 0.2)); pg.addColorStop(1, rgba(thin, 0));
    ctx.fillStyle = pg;
    ctx.save(); ctx.beginPath(); ctx.ellipse(x - w * 0.04, y + h * 0.006, w * 0.82, h * 0.1, 0, 0, Math.PI * 2);
    ctx.fill(); ctx.restore();
  }

  blob(ctx, B, skin, [mound, ...drips], { h, form: false, spread: 1.6 });
  if (B.override) return;

  // --- the jelly ------------------------------------------------------------------------------
  /**
   * The body's own contour: the mound AND the drips, every subpath wound the same way. It is traced
   * twice -- once to clip with and once to stroke the rim light along -- and it has to be rebuilt
   * the second time rather than reusing whatever path was left on the context, because anything
   * drawn in between (the bone) leaves ITS path there instead, and the rim light then strokes that.
   */
  const bodyPath = (): void => {
    ctx.beginPath();
    { const q = clockwise(lumpy(MOUND, 0.028, 2, 3)); appendCurve(ctx, q); }
    for (const d of drips) {
      if (d.k === 'tube') {
        const q = clockwise(tubeOutline(d.pts, d.r0, d.r1, d.wobble ?? 0, d.seed ?? 0));
        ctx.moveTo(q[0], q[1]);
        for (let i = 2; i < q.length; i += 2) ctx.lineTo(q[i], q[i + 1]);
        ctx.closePath();
      } else if (d.k === 'curve') {
        appendCurve(ctx, clockwise(lumpy(d.pts, d.wobble ?? 0.08, d.seed ?? 0, d.sub ?? 3)));
      }
    }
  };
  ctx.save();
  bodyPath();
  ctx.clip();

  // --- what is dissolving in it ---------------------------------------------------------------
  // ONE bone, and a big one. Three pieces measured worse than the face they replaced: the two
  // fragments' knuckles came to 0.42 px of relief at the largest size the game ever draws this
  // sprite (h = 69.4, sprites.ts:110), so they were tapered dashes with a ball welded on that
  // nothing could see, and all three ended up separating from the goo more by their 1 px of ink
  // than by their own fill -- which is what a sticker does. One piece can afford the width.
  const bx0 = x + w * 0.09, by0 = y - hh * 0.22, bx1 = x + w * 0.25, by1 = y - hh * 0.47;
  const br = h * 0.026, kn = h * 0.044;
  {
    const dx = bx1 - bx0, dy = by1 - by0, L = Math.hypot(dx, dy) || 1, nx = -dy / L, ny = dx / L;
    // formK is high on purpose: formPart lights a 'cap' ACROSS its axis, and it is the only thing
    // that will. blob's own union gradient is scaled to the bone's LENGTH, so across a shaft 3.6 px
    // wide it spans under a tenth of the ramp and leaves a flat bar -- the ogre's club again.
    blob(ctx, B, boneHex, [
      { k: 'cap', x0: bx0, y0: by0, x1: bx1, y1: by1, r0: br, r1: br * 0.94 },
      { k: 'ball', x: bx0 + nx * kn * 0.62, y: by0 + ny * kn * 0.62, r: kn },
      { k: 'ball', x: bx0 - nx * kn * 0.70, y: by0 - ny * kn * 0.70, r: kn * 0.86 },
      { k: 'ball', x: bx1 + nx * kn * 0.66, y: by1 + ny * kn * 0.66, r: kn * 0.92 },
      { k: 'ball', x: bx1 - nx * kn * 0.58, y: by1 - ny * kn * 0.58, r: kn * 0.80 },
    ], { h, formK: 0.95, spread: 1.15 });
  }

  // A lens is dark where you look through the most of it and bright where it thins to an edge --
  // at EVERY edge, not just along the bottom. The first version ran one vertical ramp down the
  // body, which is a map of HEIGHT and not of thickness: a regression of tone on ky alone came out
  // at R2 = 0.52, and the widest rows, which have the most goo in them, came out the brightest.
  const midx = x - w * 0.14, midy = y - hh * 0.46;
  const tg = ctx.createRadialGradient(midx, midy, 0, midx, midy, w * 0.46);
  tg.addColorStop(0, rgba(deep, 0.72)); tg.addColorStop(0.45, rgba(deep, 0.5));
  tg.addColorStop(0.8, rgba(deep, 0.16)); tg.addColorStop(1, rgba(deep, 0));
  ctx.save(); ctx.translate(midx, midy); ctx.scale(1, 0.82); ctx.translate(-midx, -midy);
  ctx.fillStyle = tg; ctx.fillRect(x - w * 0.9, y - hh * 1.2, w * 1.8, hh * 1.4); ctx.restore();
  // Light scattering back out of every thin edge. clip() leaves the path in place, so these stroke
  // the silhouette from the inside and only their inner half survives.
  ctx.lineJoin = 'round'; ctx.lineCap = 'round';
  bodyPath();
  for (let i = 0; i < 14; i++) {
    const u = 1 - i / 14;                                   // widest and faintest first
    ctx.strokeStyle = rgba(thin, 0.035 + 0.02 * (1 - u));
    ctx.lineWidth = h * (0.012 + 0.30 * u * u);
    ctx.stroke();
  }
  // and more of it along the base, where the floor is lit straight through the thinnest goo there
  // is. Tinted, not white: light through green goo comes out green.
  const jg = ctx.createLinearGradient(0, y - hh * 0.46, 0, y + h * 0.02);
  jg.addColorStop(0, rgba(thin, 0)); jg.addColorStop(0.55, rgba(thin, 0.22));
  jg.addColorStop(0.86, rgba(thin, 0.5)); jg.addColorStop(1, rgba(rim, 0.62));
  ctx.fillStyle = jg; ctx.fillRect(x - w * 0.9, y - hh * 0.5, w * 1.8, hh * 0.55);

  // The nucleus: the densest goo, low and off to one side, never centred like a face.
  {
    //         dx,     dy,    r,     squash, tilt,  alpha
    for (const [ux, uy, ur, sq, tl, a] of [
      [-0.268, 0.470, 0.115, 0.68, -0.20, 0.44], [-0.170, 0.400, 0.082, 0.86, 0.34, 0.34],
      [-0.330, 0.360, 0.066, 0.62, -0.5, 0.3],
    ] as const) {
      const nx = x + w * ux, ny = y - hh * uy, nr = w * ur;
      const ng = ctx.createRadialGradient(nx, ny, 0, nx, ny, nr);
      ng.addColorStop(0, rgba(deep, a)); ng.addColorStop(0.5, rgba(deep, a * 0.6));
      ng.addColorStop(0.85, rgba(deep, a * 0.14)); ng.addColorStop(1, rgba(deep, 0));
      ctx.fillStyle = ng;
      ctx.save(); ctx.translate(nx, ny); ctx.rotate(tl); ctx.scale(1, sq); ctx.translate(-nx, -ny);
      ctx.beginPath(); ctx.arc(nx, ny, nr, 0, Math.PI * 2); ctx.fill(); ctx.restore();
    }
  }

  // Bubbles. A void in the goo is DARK where the goo in front of it is thickest -- up and to the
  // left, towards the light -- and carries its lit crescent low and right, where light that has
  // come through the body exits the hole. Built the other way up they are lit convex beads, which
  // is the same construction common.ts eye() uses, and two of them beside a bone knuckle made a
  // pair of eyes once every cycle.
  for (let i = 0; i < 3; i++) {
    const t = ((p.frame * 0.32 + i * 43) % 130) / 130;
    const bbx = x - w * 0.34 + i * w * 0.20 + Math.sin(t * 6 + i * 2) * w * 0.03;
    const bby = y - hh * (0.08 + t * 0.96);
    const r = h * (0.050 + (i % 2) * 0.018) * (0.6 + t * 0.6);      // they swell as they rise
    const lit = 0.34 + t * 0.44;                                    // the goo above them thins out
    ctx.save(); ctx.translate(bbx, bby); ctx.scale(1, 0.88); ctx.translate(-bbx, -bby);
    const bg = ctx.createRadialGradient(bbx - r * 0.34, bby - r * 0.36, r * 0.06, bbx, bby, r);
    bg.addColorStop(0, rgba(deep, 0.5)); bg.addColorStop(0.55, rgba(deep, 0.26));
    bg.addColorStop(1, rgba(deep, 0.06));
    ctx.fillStyle = bg; ctx.beginPath(); ctx.arc(bbx, bby, r, 0, Math.PI * 2); ctx.fill();
    ctx.lineCap = 'round';
    ctx.strokeStyle = rgba(deep, 0.5); ctx.lineWidth = Math.max(1, r * 0.26);
    ctx.beginPath(); ctx.arc(bbx, bby, r * 0.9, Math.PI * 0.95, Math.PI * 1.75); ctx.stroke();
    ctx.strokeStyle = rgba(rim, lit); ctx.lineWidth = Math.max(1, r * 0.3);
    ctx.beginPath(); ctx.arc(bbx, bby, r * 0.88, -0.1, Math.PI * 0.72); ctx.stroke();
    ctx.restore();
  }

  // --- wet ------------------------------------------------------------------------------------
  // Every other colour on this sprite goes through shade(..., tone); a specular painted as literal
  // white does not, so the far, darkened slime came out shinier than the near one.
  const glare = shade('#ffffff', Math.max(0.45, tone));
  const wet = (cx: number, cy: number, rx: number, ry: number, rot: number, a: number): void => {
    ctx.save(); ctx.translate(cx, cy); ctx.rotate(rot); ctx.scale(Math.max(0.01, rx), Math.max(0.01, ry));
    const g = ctx.createRadialGradient(0, 0, 0, 0, 0, 1);
    g.addColorStop(0, rgba(glare, a)); g.addColorStop(0.45, rgba(glare, a * 0.38));
    g.addColorStop(1, rgba(glare, 0));
    ctx.fillStyle = g; ctx.beginPath(); ctx.arc(0, 0, 1, 0, Math.PI * 2); ctx.fill(); ctx.restore();
  };
  // All of them sit on surface that faces the top-left light. The old fourth one lay along the
  // base, whose outward normal points straight down -- 133 degrees off the light -- so it was a
  // white specular on the one face that cannot catch any; the transmitted band does that job now.
  wet(x - w * 0.30, y - hh * 0.78, w * 0.15, hh * 0.15, -0.6, 0.4);
  wet(x - w * 0.33, y - hh * 0.82, w * 0.115, hh * 0.075, -0.72, 0.95);
  wet(x + w * 0.335, y - hh * 0.64, w * 0.07, hh * 0.09, -0.5, 0.26);
  ctx.restore();

  // The lit edge where the body meets the floor, stroked on the contour itself rather than banded
  // across it with a fillRect.
  ctx.lineCap = 'round'; ctx.lineJoin = 'round';
  for (const [x0, x1, cy, a, lw] of [
    [-0.48, -0.33, 0.002, 0.44, 0.016], [-0.14, 0.26, 0.018, 0.6, 0.026],
  ] as const) {
    ctx.strokeStyle = rgba(rim, a); ctx.lineWidth = Math.max(1, h * lw);
    ctx.beginPath(); ctx.moveTo(x + w * x0, y - hh * 0.03);
    ctx.quadraticCurveTo(x + w * (x0 + x1) / 2, y + h * cy, x + w * x1, y - hh * 0.03);
    ctx.stroke();
  }
}
