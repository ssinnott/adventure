// The sky (#1028): the band over the horizon with its sun or moon, clouds, stars and distant hills
// (`drawSkyBand`, the title's too), an ending's cast over its colours, the Hearth's light on the horizon
// by night and the title's dusk (`drawDusk`).

import { shade, mix, rgba } from '../../lib/art/palettes.ts';
import { hash } from '../paint/brush.ts';
import type { HearthLook } from '../../game/stones.ts';
import { grassColor } from './common.ts';
import type { ViewRect } from './common.ts';

export interface SkyOpts {
  facing: number; hour: number; daylight: number; dark: boolean;
  /** Dawn and dusk, the hours in the middle of each twilight, for the arcs of the sun and moon: 6.5 and 18.5 when absent. */
  dawn?: number; dusk?: number;
  /** Cloud cover, murk (fog, rain, snow) and how hard it is raining or snowing, 0 .. 1: a clear sky when absent. */
  cloud?: number; murk?: number; heavy?: number;
  /** How far the clouds have blown east, in pixels of the panorama: they move as the hours pass. */
  drift?: number;
  /** Snow lying on the hills, 0 .. 1, and the day of the year for their green. */
  cover?: number; day?: number;
  /** Paint only the sky behind everything, or only the hills in front of it; both when absent. */
  part?: 'back' | 'hills';
  /**
   * The Hearth on the horizon by night: its compass bearing from the party, and its step, a Stone
   * restored a step brighter and wider (#168) and past full once the voyage is finished (game/stones.ts,
   * #750). Not drawn when absent.
   */
  hearth?: { bearing: number; step: number };
  /** The sky's colours once the hull is opened (#750), by day the wrong colour: the sky's own when absent. */
  cast?: HearthLook['cast'];
}

/** A colour of the sky under an ending's cast: most of the way to it by day, less at dusk and none by night. */
export function cast(c: string, to: string | undefined, daylight: number): string {
  return to ? mix(c, to, 0.75 * Math.min(1, daylight / 0.5)) : c;
}

/** The sky, sun or moon, clouds, stars and distant hills for the top half of `r`. Also used by the title. */
export function drawSkyBand(ctx: CanvasRenderingContext2D, r: ViewRect, o: SkyOpts): void {
  const { facing: f, hour, daylight, dark } = o;
  const cloud = o.cloud ?? 0, murk = o.murk ?? 0, heavy = o.heavy ?? 0;
  const cx = r.x + r.w / 2, horizon = r.y + r.h / 2;
  // A clear sky's blues greyed toward an overcast lid, darkened by a downpour; murk pales the foot
  // of it, and fog washes the whole of it out.
  const bottom = cast(mix(mix('#1a1428', '#bcd8f0', daylight), mix('#181a20', '#b0b8c2', daylight), Math.min(1, cloud * 0.8 + murk * 0.6)), o.cast?.foot, daylight);
  if (o.part !== 'hills') {
    const top = mix(cast(mix(mix(mix('#07091a', '#2f7ad8', daylight), mix('#0c0e14', '#7a8490', daylight), cloud), mix('#06070a', '#3c424c', daylight), 0.55 * heavy), o.cast?.top, daylight), bottom, murk * 0.7);
    const dusk = (daylight > 0.05 && daylight < 0.6 ? 1 - Math.abs(daylight - 0.3) / 0.3 : 0) * (1 - 0.8 * cloud);
    const g = ctx.createLinearGradient(0, r.y, 0, horizon);
    g.addColorStop(0, top); g.addColorStop(0.7, mix(bottom, '#e8905a', dusk * 0.35)); g.addColorStop(1, mix(bottom, '#f0b070', dusk * 0.6));
    ctx.fillStyle = g; ctx.fillRect(r.x, r.y, r.w, r.h / 2);
    // Stars, fixed to the compass so they turn with the party; cloud and murk hide them.
    const starLight = 0.9 * (1 - daylight / 0.5) * (1 - cloud) * (1 - murk);
    if (daylight < 0.5 && starLight > 0.02) {
      for (let i = 0; i < 70; i++) {
        const sx = ((hash(i, 1) * 4 * r.w - f * r.w) % (4 * r.w) + 4 * r.w) % (4 * r.w);
        if (sx > r.w) continue;
        const sy = r.y + hash(i, 2) * (r.h / 2 - 30);
        ctx.fillStyle = rgba('#ffffff', starLight * (0.4 + 0.6 * hash(i, 3)));
        ctx.fillRect(Math.round(r.x + sx), Math.round(sy), hash(i, 4) > 0.8 ? 2 : 1, 1);
      }
    }
    // Sun by day, moon by night: east at dawn, overhead at noon, west at dusk. Dim through thin cloud.
    const drawOrb = (t: number, color: string, glow: string, rad: number) => {
      // t: 0 rising in the east .. 1 setting in the west. Compass bearing from east (90) to west (270).
      const bearing = 90 + t * 180;
      let rel = ((bearing - f * 90) % 360 + 360) % 360; if (rel > 180) rel -= 360;
      if (Math.abs(rel) > 100) return;
      const ox = cx + (rel / 90) * r.w * 0.55, oy = r.y + 24 + (1 - Math.sin(t * Math.PI)) * (r.h / 2 - 40);
      const gg = ctx.createRadialGradient(ox, oy, rad * 0.5, ox, oy, rad * 4);
      gg.addColorStop(0, rgba(glow, 0.35)); gg.addColorStop(1, rgba(glow, 0));
      ctx.fillStyle = gg; ctx.fillRect(ox - rad * 4, oy - rad * 4, rad * 8, rad * 8);
      ctx.beginPath(); ctx.arc(ox, oy, rad, 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
    };
    const dawn = o.dawn ?? 6.5, dusk2 = o.dusk ?? 18.5, seen = 1 - Math.min(1, cloud * 1.05 + murk * 0.5);
    if (seen > 0.05) {
      ctx.globalAlpha = seen;
      if (hour >= dawn - 1 && hour <= dusk2 + 1) drawOrb((hour - dawn + 1) / (dusk2 - dawn + 2), '#fff4c0', '#ffd080', 9);
      const night = 24 - (dusk2 - dawn), since = ((hour - dusk2) % 24 + 24) % 24;
      if (since <= night) drawOrb(since / night, '#e8ecf4', '#b0c0e0', 6);
      ctx.globalAlpha = 1;
    }
    // Clouds: soft blobs with a lit top, fixed to the compass and blown east as the hours pass; more
    // of them, bigger and darker as the sky closes over, their undersides merging into one mass, and
    // lost in fog.
    const drift = o.drift ?? 0;
    const lit = mix(mix(mix('#2a2a44', '#ffffff', daylight), mix('#22242c', '#9aa2ae', daylight), cloud), mix('#0a0b0e', '#4a505a', daylight), 0.5 * heavy);
    const under = mix(mix(mix('#20203a', '#a8bcd8', daylight), mix('#16181e', '#6a7280', daylight), cloud), lit, 0.55 * cloud);
    ctx.globalAlpha = 1 - 0.85 * murk;
    for (let i = 0; i < 7 + Math.round(cloud * 9); i++) {
      const cxp = ((hash(i, 11) * 4 * r.w + drift - f * r.w) % (4 * r.w) + 4 * r.w) % (4 * r.w);
      if (cxp < -80 || cxp > r.w + 80) continue;
      const cy = r.y + 18 + hash(i, 12) * (r.h / 2 - 70) * (1 - 0.4 * cloud), w = (40 + hash(i, 13) * 60) * (1 + cloud * 0.8), h = (8 + hash(i, 14) * 8) * (1 + cloud * 0.6);
      for (let j = 0; j < 4; j++) {
        const bx = r.x + cxp + (j - 1.5) * w * 0.22, by = cy + (j % 2) * h * 0.3, br = h * (0.7 + hash(i, j) * 0.6);
        ctx.beginPath(); ctx.arc(bx, by + br * 0.3, br, 0, Math.PI * 2); ctx.fillStyle = rgba(under, 0.85); ctx.fill();
        ctx.beginPath(); ctx.arc(bx, by, br, 0, Math.PI * 2); ctx.fillStyle = rgba(lit, 0.9); ctx.fill();
      }
    }
    // An overcast sky is a deck of cloud: ragged grey bands hung across the top.
    if (cloud > 0.55) {
      const a = (cloud - 0.55) / 0.45;
      for (let k = 0; k < 3; k++) {
        const y0 = r.y + k * r.h * 0.07;
        ctx.beginPath(); ctx.moveTo(r.x, r.y);
        for (let x = 0; x <= r.w; x += 10) {
          const px = (x + f * r.w + drift * (1 + k * 0.3) + k * 137) / (4 * r.w);
          ctx.lineTo(r.x + x, y0 + r.h * (0.07 + 0.035 * Math.sin(px * Math.PI * 2 * 7 + k * 2)) + 5 * hash(Math.floor(px * 90), k, 5));
        }
        ctx.lineTo(r.x + r.w, r.y); ctx.closePath();
        ctx.fillStyle = rgba(k === 1 ? lit : under, 0.45 * a); ctx.fill();
      }
    }
    ctx.globalAlpha = 1;
  }
  if (o.part !== 'back') {
    // Distant hills: two silhouette bands with a profile fixed to the compass, green by the season,
    // white under snow, and lost in the murk, the far band first.
    const cover = o.cover ?? 0, green = o.day === undefined ? '#3f8a4a' : mix('#3f8a4a', grassColor(o.day), 0.6);
    const far = mix(mix('#101426', mix('#6a8ab8', '#b4c2d6', cover * 0.8), daylight), bottom, Math.min(1, murk * 1.3));
    const near = mix(mix('#0c101e', mix(green, '#dfe6ee', cover * 0.85), daylight), bottom, Math.min(1, murk * 0.8));
    for (const [layer, col, amp, base] of [[0, far, 26, 30], [1, near, 16, 14]] as [number, string, number, number][]) {
      ctx.beginPath(); ctx.moveTo(r.x, horizon + 1);
      for (let x = 0; x <= r.w; x += 8) {
        const wx = (x + f * r.w * 1.0 + layer * 137) / (4 * r.w);
        const hgt = base + amp * (0.5 + 0.5 * Math.sin(wx * Math.PI * 2 * 3 + layer)) * (0.6 + 0.4 * hash(Math.floor(wx * 40), layer));
        ctx.lineTo(r.x + x, horizon - hgt);
      }
      ctx.lineTo(r.x + r.w, horizon + 1); ctx.closePath();
      ctx.fillStyle = dark ? shade(col, 0.5) : col; ctx.fill();
    }
    if (o.hearth) drawHearthLight(ctx, r, o.hearth.bearing - f * 90, o.hearth.step, daylight, 1 - Math.min(1, cloud * 1.05 + murk * 0.5));
  }
}

/** The view the title and the endings' pages (ui/title.ts, ui/ending.ts) share. */
const DUSK = { x: 8, y: 8, w: 624, h: 344 };

/**
 * Dusk over the inland sea, looking west at the Hearth: a column of light on the horizon that
 * flickers, and its path on the water, as `look` draws it (game/stones.ts): steadier, taller and
 * wider by a step for each Stone restored (#168), and as the ending left it once one is taken (#750).
 */
export function drawDusk(ctx: CanvasRenderingContext2D, frame: number, look: HearthLook): void {
  const v = DUSK;
  ctx.save(); ctx.beginPath(); ctx.rect(v.x, v.y, v.w, v.h); ctx.clip();
  drawSkyBand(ctx, v, { facing: 3, hour: 18.6, daylight: 0.45, dark: false, cast: look.cast });
  const horizon = v.y + v.h / 2;
  const sea = ctx.createLinearGradient(0, horizon, 0, v.y + v.h);
  sea.addColorStop(0, '#2a4a7a'); sea.addColorStop(1, '#101a30');
  ctx.fillStyle = sea; ctx.fillRect(v.x, horizon, v.w, v.h / 2);
  const n = look.step, amp = look.flicker;
  const flick = 1 - amp + amp * Math.sin(frame / 7) * Math.sin(frame / 3);
  const cx = v.x + v.w / 2, rad = 110 + 12 * n, peak = 0.45 + 0.05 * n, tall = Math.min(70 + 22 * n, horizon - v.y);
  const glow = ctx.createRadialGradient(cx, horizon, 4, cx, horizon, rad);
  glow.addColorStop(0, `rgba(255,220,150,${peak * flick})`); glow.addColorStop(1, 'rgba(255,200,120,0)');
  ctx.fillStyle = glow; ctx.fillRect(cx - rad, horizon - rad, rad * 2, rad * 2);
  // At full the column already meets the top of the view: past full it can stand no taller, so it stands wider.
  const half = 5 + Math.max(0, n - 5);
  const col = ctx.createLinearGradient(0, horizon - tall, 0, horizon);
  col.addColorStop(0, `rgba(255,230,170,${0.05 * flick})`); col.addColorStop(1, `rgba(255,220,150,${0.85 * flick})`);
  ctx.fillStyle = col; ctx.fillRect(cx - half, horizon - tall, half * 2, tall);
  ctx.fillStyle = `rgba(255,235,190,${0.9 * flick})`; ctx.fillRect(cx - 2, horizon - tall + 30, 4, tall - 30);
  for (let i = 0; i < 40; i++) {
    const y = horizon + 4 + i * 4, w = 12 + i * 3.5 * (0.7 + 0.3 * Math.sin(frame / 9 + i));
    ctx.fillStyle = `rgba(255,220,150,${(0.35 - i * 0.008) * flick})`; ctx.fillRect(cx - w / 2, y, w, 2);
  }
  // Far shore silhouette with Helmstow's towers.
  ctx.fillStyle = '#0e1224';
  ctx.fillRect(v.x, horizon - 6, v.w, 8);
  for (const [tx, th, tw] of [[60, 26, 10], [110, 18, 8], [500, 30, 12], [560, 20, 8], [600, 14, 6]]) ctx.fillRect(v.x + tx, horizon - th, tw, th);
  ctx.restore();
}

/**
 * The Hearth where it lies, `ahead` degrees right of the way the party faces, as the light goes: a column standing over the far hills and the glow
 * about its foot, faint from the first night and taller and brighter by a step for each Stone
 * restored (#168), and past full once the voyage is finished (#750); lost in cloud and murk as the
 * moon is. Not drawn when its bearing is out of view.
 */
function drawHearthLight(ctx: CanvasRenderingContext2D, r: ViewRect, ahead: number, n: number, daylight: number, seen: number): void {
  const light = Math.min(1, Math.max(0, (0.3 - daylight) / 0.3)) * seen;
  let rel = (ahead % 360 + 360) % 360; if (rel > 180) rel -= 360;
  if (light <= 0.02 || Math.abs(rel) > 100) return;
  const horizon = r.y + r.h / 2, hx = r.x + r.w / 2 + (rel / 90) * r.w * 0.55;
  const tall = 64 + 14 * n, rad = 18 + 5 * n, a = (0.25 + 0.1 * n) * light, foot = horizon - 30;
  const hg = ctx.createRadialGradient(hx, foot, 1, hx, foot, rad * 2);
  hg.addColorStop(0, rgba('#ffd890', a)); hg.addColorStop(1, rgba('#ffc070', 0));
  ctx.fillStyle = hg; ctx.fillRect(hx - rad * 2, foot - rad * 2, rad * 4, rad * 4);
  const col = ctx.createLinearGradient(0, horizon - tall, 0, horizon - 14);
  col.addColorStop(0, rgba('#fff0c0', 0)); col.addColorStop(1, rgba('#fff0c0', Math.min(1, a * 2)));
  ctx.fillStyle = col; ctx.fillRect(Math.round(hx) - 1, horizon - tall, 2, tall - 14);
}
