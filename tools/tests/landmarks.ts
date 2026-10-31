// The landmarks over the land (#1096), with no canvas: every kind has a drawing, as tall as it says, and a reach,
// the lighthouse's and the monastery's 40, a volcano's the horizon's and the rest what their height earns; every
// landmark a zone map places stands on a site the world map charts; what of one the land nearer than it hides is
// `standsOver`'s, a pure function of the cast, and so is the Hearth's column by day, which shows from a daylight of
// 0.3, where its light by night shows only under it. How they look is the smoke's (tools/smoke/scenes.ts, `kinds`).
import { ATLAS, MAP_DEFS } from '../../src/content/index.ts';
import { GRID } from '../../src/content/maps.ts';
import { mapAt } from '../../src/game/atlas.ts';
import type { Landmark } from '../../src/game/mapdef.ts';
import type { Facing } from '../../src/game/types.ts';
import { VIEW_DEPTH } from '../../src/game/world.ts';
import { LANDMARK_HEIGHT, LANDMARK_SPRITES, VOLCANO_LIP } from '../../src/ui/scenery.ts';
import { unit } from '../../src/ui/view/common.ts';
import { castHorizon, standsOver, REACH } from '../../src/ui/view/horizon.ts';
import type { Horizon } from '../../src/ui/view/horizon.ts';
import { LANDMARK_REACH, MARK, landmarkShows, volcanoScale } from '../../src/ui/view/landmarks.ts';
import { drawSkyBand, hearthShows } from '../../src/ui/view/sky.ts';
import { ok } from './lib.ts';

/** Every kind of landmark, which the typecheck holds whole: a kind added to `Landmark` and not here fails it. */
const KINDS = Object.keys({ lighthouse: 1, monastery: 1, volcano: 1, city: 1, ring: 1, tower: 1, tree: 1, stacks: 1, fortress: 1, falls: 1, wreck: 1 } satisfies Record<Landmark['kind'], 1>) as Landmark['kind'][];
/** The kinds whose smoke goes up over what stands, which their height leaves out. */
const SMOKING: readonly Landmark['kind'][] = ['volcano', 'stacks'];
/** The view's size, as the game draws it. */
const W = 400, H = 268;

/** A call a recorder wrote down: its name (a setting's with `=`), its numbers and, for a setting, what it was set to. */
type Call = [string, number[], unknown?];

/** A 2D context that paints nothing and writes down each call and each setting, as tools/tests/horizon.ts's; a gradient is set as 'gradient'. */
function recorder(log: Call[]): CanvasRenderingContext2D {
  const gradient = { addColorStop: () => {} };
  return new Proxy({}, {
    get: (_, k) => (k === 'createLinearGradient' || k === 'createRadialGradient' ? () => gradient : (...a: unknown[]) => { log.push([String(k), a.map(Number)]); }),
    set: (_, k, v) => { log.push([`${String(k)}=`, [Number(v)], v === gradient ? 'gradient' : v]); return true; },
  }) as unknown as CanvasRenderingContext2D;
}

/** How high over its foot a drawing's topmost point stands, in `u`: the paths' points, the blocks' tops and the arcs' tops, a smoke's arcs left out. */
function topOf(log: Call[], y: number, u: number, arcs: boolean): number {
  let top = y;
  for (const [k, a] of log) {
    if (k === 'moveTo' || k === 'lineTo') top = Math.min(top, a[1]);
    else if (k === 'fillRect' || k === 'rect') top = Math.min(top, a[1]);
    else if (k === 'arc' && arcs) top = Math.min(top, a[1] - a[2]);
  }
  return (y - top) / u;
}

/** A world cell: a square of a zone map, where the atlas lays it. */
function on(map: string, x: number, y: number): { x: number; y: number } {
  const at = mapAt(ATLAS, map);
  if (!at) throw new Error(`${map} is not laid in the atlas`);
  return { x: at[0] + x, y: at[1] + y };
}

/** A cast of `w` columns with nothing standing but `spans` (each over its columns), for the pure checks. */
function castOf(w: number, spans: { from: number; to: number; d: number; top: number }[]): Horizon {
  const cols = Array.from({ length: w }, (_, c) => spans.filter((s) => c >= s.from && c < s.to).sort((a, b) => a.d - b.d).map((s) => ({ top: s.top, t: 0, cell: -1, d: s.d })));
  return { width: 1, cols, end: new Int16Array(w).fill(REACH), rows: 0, cells: new Int32Array(0), ts: new Uint8Array(0), ds: new Int16Array(0) };
}

export function landmarks(): void {
  // Every kind has a drawing, which paints, puts the alpha back and stands as tall as its height says, to a
  // fiftieth of a square's half width (a smoke's puffs apart); and a reach past the squares drawn and inside the horizon's.
  {
    const wrong: string[] = [], heights: string[] = [];
    for (const kind of KINDS) {
      const log: Call[] = [], u = 100, y = 1000;
      const draw = LANDMARK_SPRITES[kind];
      if (typeof draw !== 'function') { wrong.push(`${kind} has no drawing`); continue; }
      draw(recorder(log), 500, y, u, { tone: 1, snow: 0, wind: 0.5, glow: 1 });
      const fills = log.filter(([k]) => k === 'fill' || k === 'fillRect').length, alpha = log.filter(([k]) => k === 'globalAlpha=').at(-1)?.[1][0] ?? 1;
      const tall = topOf(log, y, u, !SMOKING.includes(kind)), reach = LANDMARK_REACH[kind];
      heights.push(`${kind} ${tall.toFixed(2)}`);
      if (fills < 5) wrong.push(`${kind} paints ${fills} fills`);
      if (alpha !== 1) wrong.push(`${kind} leaves the alpha at ${alpha}`);
      if (Math.abs(tall - LANDMARK_HEIGHT[kind]) > 0.02) wrong.push(`${kind} stands ${tall.toFixed(3)}, not ${LANDMARK_HEIGHT[kind]}`);
      if (!Number.isInteger(reach) || reach <= VIEW_DEPTH || reach > REACH) wrong.push(`${kind}'s reach is ${reach}`);
    }
    const extra = [LANDMARK_SPRITES, LANDMARK_HEIGHT, LANDMARK_REACH].flatMap((t) => Object.keys(t).filter((k) => !KINDS.includes(k as Landmark['kind'])));
    ok(wrong.length === 0 && extra.length === 0, `every kind of landmark has a drawing, as tall as its height says, and a reach past the squares drawn: ${KINDS.length} kinds, standing ${heights.join(', ')} squares' half widths${wrong.length ? ' -> ' + wrong.join('; ') : ''}${extra.length ? ' -> no kind: ' + extra.join(', ') : ''}`);
  }

  // The reach by kind: a lighthouse and a monastery keep their 40, a volcano's plume is seen out to the horizon's reach,
  // and the rest as far as their drawing still stands MARK rows of the view tall, and no square farther.
  {
    const earned = KINDS.filter((k) => k !== 'lighthouse' && k !== 'monastery' && k !== 'volcano');
    const off = earned.filter((k) => !(LANDMARK_HEIGHT[k] * unit(LANDMARK_REACH[k], H) >= MARK && LANDMARK_HEIGHT[k] * unit(LANDMARK_REACH[k] + 1, H) < MARK));
    ok(LANDMARK_REACH.lighthouse === 40 && LANDMARK_REACH.monastery === 40 && LANDMARK_REACH.volcano === REACH && off.length === 0,
      `a landmark stands over the land as far as its height earns, where it still stands ${MARK} of the view's ${H} rows tall: ${earned.map((k) => `${k} ${LANDMARK_REACH[k]}`).join(', ')} squares; the lighthouse and the monastery ${LANDMARK_REACH.lighthouse} and ${LANDMARK_REACH.monastery}, a volcano's plume ${LANDMARK_REACH.volcano}${off.length ? ' -> not earned: ' + off.join(', ') : ''}`);
  }

  // Each landmark a zone map places stands on a site the world map charts: the site's point within its square or
  // one beside it, as the world map's icon covers them (a name alone or a water's is no site).
  {
    const placed: string[] = [], lost: string[] = [];
    for (const def of MAP_DEFS) for (const l of def.landmarks ?? []) {
      const at = mapAt(ATLAS, def.id);
      if (!at) { lost.push(`${def.id}'s ${l.kind} at ${l.x},${l.y}, a map the atlas lays nowhere`); continue; }
      const wx = at[0] + l.x + 0.5, wy = at[1] + l.y + 0.5;
      const site = ATLAS.sites.find((s) => {
        if (s.icon === 'label' || s.icon === 'water') return false;
        const o = s.map ? mapAt(ATLAS, s.map) : [0, 0];
        return !!o && Math.abs(o[0] + s.at[0] - wx) <= 1.5 && Math.abs(o[1] + s.at[1] - wy) <= 1.5;
      });
      if (site) placed.push(`${site.name} (${site.icon}) under ${def.id}'s ${l.kind}`);
      else lost.push(`${def.id}'s ${l.kind} at ${l.x},${l.y}`);
    }
    ok(placed.length >= 2 && lost.length === 0, `every landmark a zone map places stands on a site the world map charts, on its square or one beside it: ${placed.join('; ')}${lost.length ? ' -> on none: ' + lost.join('; ') : ''}`);
  }

  // What of a landmark shows is the cast's alone: in each column the land nearer than it hides it up to that land's
  // height over the horizon, its foot with it, and land as far off or farther hides nothing of it.
  {
    const cast = castOf(10, [{ from: 0, to: 3, d: 5, top: 6 }, { from: 3, to: 7, d: 10, top: 30 }]);
    const runs = (d: number): string => landmarkShows(cast, 0, 10, d).map((q) => `${q.c}+${q.n}:${q.top}`).join(' ');
    const behind = runs(20), between = runs(8), before = runs(4), clipped = landmarkShows(cast, -5, 4, 20).map((q) => `${q.c}+${q.n}:${q.top}`).join(' ');
    ok(behind === '0+3:6 3+4:30 7+3:0' && between === '0+3:6 3+7:0' && before === '0+10:0' && clipped === '0+3:6 3+1:30',
      `a landmark is hidden by the land nearer than it, column by column, up to its height (standsOver): behind a hill 5 squares off and a range 10 off it shows over ${behind}; between them ${between}; before both ${before}; cut to the view, ${clipped}`);
  }

  // The same on the world: from Sheerpoint's 11,20 facing east, where a range stands from ten squares off over the
  // middle of the view, a landmark twenty off is hidden by it where one six off shows down to its foot (the smoke's spot).
  {
    const cast = castHorizon(GRID, on('sheerpoint_i9', 11, 20), 1 as Facing, W, H);
    const mid = (d: number): number[] => landmarkShows(cast, 170, 231, d).flatMap((q) => Array<number>(q.n).fill(q.top));
    const far = mid(20), near = mid(6), same = Array.from({ length: W }, (_, c) => c).every((c) => landmarkShows(cast, c, c + 1, 20)[0].top === standsOver(cast, c, 20));
    ok(Math.min(...far) >= 40 && Math.max(...near) === 0 && same, `from Sheerpoint's 11,20 facing east the range ten squares off hides a landmark twenty off up to ${Math.min(...far)} to ${Math.max(...far)} px over the middle of the view, where one six off shows down to its foot (${Math.max(...near)} px hidden); in every column it is standsOver's${same ? '' : ' -> not standsOver'}`);
  }

  // A volcano is drawn to the range the skyline stands there: its lip a fifth over it, its foot on the ground's row.
  {
    const bad = [5, 20, 60, 120, 200, 239].filter((k) => { const u = unit(k, H), range = 56 * (1 - k / REACH); return Math.abs(volcanoScale(range, u) * VOLCANO_LIP - u - range * 1.2) > 1e-9; });
    ok(bad.length === 0, `a volcano's lip stands a fifth over its range on the skyline, its foot on the ground's row, from 5 squares off to ${REACH - 1}${bad.length ? ' -> not at ' + bad.join(', ') : ''}`);
  }

  // The Hearth: its light by night only under a daylight of 0.3, its pale column by day only from it; both lost as
  // the moon is under cloud and murk, the day's the same whatever the Stones.
  {
    const wrong: string[] = [];
    for (let i = 0; i <= 100; i++) for (const seen of [0, 0.4, 1]) {
      const daylight = i / 100, { night, day } = hearthShows(daylight, seen);
      if (day > 0 && daylight < 0.3) wrong.push(`a column at ${daylight}`);
      if (night > 0 && daylight >= 0.3) wrong.push(`a light at ${daylight}`);
      if (seen === 0 && (day > 0 || night > 0)) wrong.push(`seen through a lid at ${daylight}`);
    }
    const noon = hearthShows(1, 1), midnight = hearthShows(0, 1);
    ok(wrong.length === 0 && noon.day === 1 && noon.night === 0 && midnight.night === 1 && midnight.day === 0, `the Hearth shows its pale column by day only from a daylight of 0.3 and its light by night only under it, both lost under cloud and murk (noon ${noon.day}, midnight ${midnight.night})${wrong.length ? ' -> ' + wrong.slice(0, 4).join(', ') : ''}`);
  }

  // Drawn, by day: ahead of the company over open land the column stands from the horizon, its top third fainter; behind
  // a range nearer than it only over the range, behind land standing as tall as it not at all, and a range past it hides
  // nothing; by dusk, under 0.3, there is none. Its blocks are told from the night's light by their flat colour.
  {
    const column = (daylight: number, spans: { from: number; to: number; d: number; top: number }[]): string => {
      const log: Call[] = [];
      drawSkyBand(recorder(log), { x: 0, y: 0, w: W, h: H }, { facing: 0, hour: 12, daylight, dark: false, horizon: castOf(W, spans), hearth: { bearing: 0, step: 2, far: 100 }, part: 'hills' });
      let flat = false;
      const rows: string[] = [];
      for (const [k, a, v] of log) {
        if (k === 'fillStyle=') flat = v !== 'gradient';
        else if (k === 'fillRect' && flat && a[0] === W / 2 - 1 && a[2] === 2) rows.push(`${a[1]}-${a[1] + a[3]}`);
      }
      return rows.join(' ');
    };
    const open = column(1, []), behind = column(1, [{ from: 190, to: 210, d: 30, top: 30 }]), hidden = column(1, [{ from: 190, to: 210, d: 30, top: 64 }]);
    const past = column(1, [{ from: 190, to: 210, d: 140, top: 30 }]), dusk = column(0.25, []), h = H / 2;
    ok(open === `${h - 43}-${h} ${h - 64}-${h - 43}` && behind === `${h - 43}-${h - 30} ${h - 64}-${h - 43}` && hidden === '' && past === open && dusk === '',
      `the Hearth's column by day stands over open land from the horizon (rows ${open}), behind a range nearer than it only over the range (${behind}), behind land as tall as it not at all (${hidden || 'none'}), and a range past it hides nothing (${past}); by dusk there is none (${dusk || 'none'})`);
  }
}
