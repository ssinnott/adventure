// Density: something to find within a few steps of every square (EXPANSION §1, §5.3). Walked in
// four-way steps from every point of interest at once (a feature, a group's start, a way in or out)
// over the squares a party can stand on; a point's own square is 0 steps and a locked door is open.
// The maps as written, not as played: the played outdoors joins the zones and makes their exits gates.
import { AREAS } from '../../src/content/index.ts';
import { GameMap, type MapDef } from '../../src/game/map.ts';
import { NORTH } from '../../src/game/types.ts';
import { ok } from './lib.ts';

type Row = 'core' | 'country' | 'town' | 'dungeon';
/** 90% of the squares within `within` steps, and none past `cap`. Country is a first guess, tuned in #47. */
export const FLOORS: Record<Row, { within: number; cap: number }> = {
  core: { within: 8, cap: 15 },
  country: { within: 12, cap: 20 },
  town: { within: 7, cap: 10 },
  dungeon: { within: 7, cap: 10 },
};
/** No more than one point of interest in this many may be a sign: a row of bare signs does not pass. */
export const SIGN_SHARE = 4;

/** The floor a map is held to; undefined for an outdoor map with no mark. */
export const rowOf = (def: MapDef): Row | undefined => (def.kind === 'outdoor' ? def.density : def.kind);

export interface Measure {
  /** Squares a party can stand on. */
  total: number;
  /** Each standable square's steps to the nearest point, or Infinity where none reaches it. */
  steps: number[];
  /** The furthest step; Infinity if any square is unreached. */
  max: number;
  /** Points of interest, and how many of them are signs. */
  points: number;
  signs: number;
}

/** Steps from every standable square to its nearest point of interest. */
export function measure(def: MapDef): Measure {
  const m = new GameMap(def);
  const stand = (x: number, y: number): boolean => { const p = m.passable(x, y, { keys: 1 }); return p === 'ok' || p === 'unlock'; };
  const pts = [...m.features, ...m.encounters, ...m.exits];
  const dist = new Array<number>(m.width * m.height).fill(Infinity);
  let queue: number[] = [];
  for (const p of pts) if (stand(p.x, p.y) && dist[p.y * m.width + p.x] !== 0) { dist[p.y * m.width + p.x] = 0; queue.push(p.y * m.width + p.x); }
  for (let d = 1; queue.length; d++) {
    const next: number[] = [];
    for (const i of queue) {
      const x = i % m.width, y = (i - x) / m.width;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        if (!m.inBounds(nx, ny) || !stand(nx, ny) || dist[ny * m.width + nx] <= d) continue;
        dist[ny * m.width + nx] = d; next.push(ny * m.width + nx);
      }
    }
    queue = next;
  }
  const steps: number[] = [];
  for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) if (stand(x, y)) steps.push(dist[y * m.width + x]);
  return { total: steps.length, steps, max: Math.max(0, ...steps), points: pts.length, signs: m.features.filter((f) => f.kind === 'sign').length };
}

/** Why a map misses its floor, or '' if it is inside it; and the line it is reported with. */
export function judge(def: MapDef): { why: string; line: string } {
  const row = rowOf(def);
  if (def.kind === 'outdoor' && !row) return { why: 'an outdoor map marked neither core nor country', line: def.id };
  if (def.kind !== 'outdoor' && def.density) return { why: `a ${def.kind} marked ${def.density}: only an outdoor map is`, line: def.id };
  const f = FLOORS[row!], r = measure(def);
  const within = r.steps.filter((s) => s <= f.within).length;
  const pct = r.total ? (100 * within / r.total).toFixed(1) : '100.0';
  const line = `${def.id} (${row}): ${pct}% within ${f.within} (${within} of ${r.total}, ${Math.ceil(0.9 * r.total)} needed), furthest ${r.max} of ${f.cap}; signs ${r.signs} of ${r.points}`;
  const why = [
    within * 10 < r.total * 9 ? `under 90% within ${f.within}` : '',
    r.max === Infinity ? 'a square nothing reaches' : r.max > f.cap ? `a square ${r.max} steps from anything, past ${f.cap}` : '',
    r.signs * SIGN_SHARE > r.points ? 'more than one point in four a sign' : '',
  ].filter(Boolean).join('; ');
  return { why, line };
}

export function density(): void {
  for (const a of AREAS) for (const def of a.maps) {
    const { why, line } = judge(def);
    ok(!why, `${a.id}/${line}${why ? ': ' + why : ''}`);
  }

  // The check catches what it is for: each fixture is a copy of a real map, never the map itself.
  const find = (id: string): MapDef => AREAS.flatMap((a) => a.maps).find((d) => d.id === id)!;
  const bare = (d: MapDef, extra: Partial<MapDef> = {}): MapDef => ({ ...d, features: [], ...extra });
  const fails = (d: MapDef, what: string, msg: string): void => { const w = judge(d).why; ok(w.includes(what), `${msg}: ${w || 'passes'}`); };
  const passes = (d: MapDef, msg: string): void => { const w = judge(d).why; ok(!w, `${msg}${w ? ': ' + w : ''}`); };
  const thornmark = find('thornmark'), shelf = find('shelf'), harrow = find('harrow');
  fails(bare(thornmark, { density: 'core' }), 'under 90%', 'Thornmark stripped of its features fails core');
  passes({ ...thornmark, density: 'country' }, 'Thornmark marked country passes the looser floor');
  fails(bare(harrow), 'past 10', 'Harrow stripped of its features fails the town floor');
  fails(bare(shelf, { density: 'core' }), 'under 90%', 'the Foreland stripped of its features fails core');
  passes(bare(shelf, { density: 'country' }), 'and passes country: the mark switches the floor');
  const sign = (n: number): MapDef['features'] => [...shelf.features!, ...Array.from({ length: n }, () => ({ kind: 'sign' as const, x: shelf.start.x, y: shelf.start.y, text: '' }))];
  passes({ ...shelf, density: 'core', features: sign(1) }, 'the Foreland with one more sign (6 of 24) passes');
  fails({ ...shelf, density: 'core', features: sign(2) }, 'a sign', 'and with two more (7 of 25) fails');
  fails({ ...shelf, density: undefined }, 'neither core nor country', 'an outdoor map with no mark fails');
  fails({ ...harrow, density: 'core' }, 'only an outdoor map', 'a town with a mark fails');
  const island: MapDef = { id: 'island', name: 'Island', kind: 'dungeon', start: { x: 1, y: 1, facing: NORTH }, rows: ['#####', '#.#.#', '#####'], exits: [] };
  fails(island, 'nothing reaches', 'a square nothing reaches fails');
}
