// Density: something to find within a few steps of every square (EXPANSION §1, §5.3). Walked in
// four-way steps from every point of interest at once (a feature, a group's start, a way in or out)
// over the squares a party can stand on; a point's own square is 0 steps and a locked door is open.
// Points are counted by square, and a sign, well or event that says nothing is no point, so neither a
// stack of points on one square nor a scatter of empty ones meets the floor or dilutes the sign cap.
// The maps as written, not as played: the played outdoors joins the zones and makes their exits gates.
import { AREAS } from '../../src/content/index.ts';
import { GameMap, type Feature, type MapDef } from '../../src/game/map.ts';
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
  /** Squares holding a point of interest, and how many of them hold a sign. */
  points: number;
  signs: number;
}

/** Steps from every standable square to its nearest point of interest. */
export function measure(def: MapDef): Measure {
  const m = new GameMap(def);
  const stand = (x: number, y: number): boolean => { const p = m.passable(x, y, { keys: 1 }); return p === 'ok' || p === 'unlock'; };
  const said = m.features.filter((f) => !('text' in f) || f.text.trim() !== '');
  const square = (p: { x: number; y: number }): number => p.y * m.width + p.x;
  const pts = new Set([...said, ...m.encounters, ...m.exits].map(square));
  const signs = new Set(said.filter((f) => f.kind === 'sign').map(square));
  const dist = new Array<number>(m.width * m.height).fill(Infinity);
  let queue: number[] = [];
  for (const i of pts) if (stand(i % m.width, Math.floor(i / m.width))) { dist[i] = 0; queue.push(i); }
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
  return { total: steps.length, steps, max: steps.reduce((a, b) => Math.max(a, b), 0), points: pts.size, signs: signs.size };
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

  // The check catches what it is for. Stripped copies of maps far below their floor; everything
  // else on fields built here, so no edit to the maps can turn a fixture red.
  const find = (id: string): MapDef => AREAS.flatMap((a) => a.maps).find((d) => d.id === id)!;
  const fails = (d: MapDef, what: string, msg: string): void => { const w = judge(d).why; ok(w.includes(what), `${msg}: ${w || 'passes'}`); };
  const passes = (d: MapDef, msg: string): void => { const w = judge(d).why; ok(!w, `${msg}${w ? ': ' + w : ''}`); };
  const thornmark = find('thornmark'), harrow = find('harrow');
  fails({ ...thornmark, density: 'core', features: [] }, 'under 90%', 'Thornmark stripped of its features fails core');
  fails({ ...harrow, features: [] }, 'past 10', 'Harrow stripped of its features fails the town floor');

  // A road of grass 73 squares long with a chest every 24: all within 12, a quarter past 8.
  const chest = (x: number, y = 0): Feature => ({ kind: 'chest', x, y, id: `c${x}_${y}`, gold: 1, items: [] });
  const road = (features: Feature[], density?: 'core' | 'country'): MapDef =>
    ({ id: 'road', name: 'Road', kind: 'outdoor', density, start: { x: 0, y: 0, facing: NORTH }, rows: [','.repeat(73)], features });
  const every24 = [0, 24, 48, 72].map((x) => chest(x));
  passes(road(every24, 'country'), 'a chest every 24 squares passes country');
  fails(road(every24, 'core'), 'under 90% within 8', 'and fails core: the mark switches the floor');
  const empty = (x: number, text = ''): Feature => ({ kind: 'event', x, y: 0, id: `e${x}`, text });
  const between = [4, 8, 12, 16, 20, 28, 32, 36, 40, 44, 52, 56, 60, 64, 68];
  fails(road([...every24, ...between.map((x) => empty(x))], 'core'), 'under 90% within 8', 'events that say nothing do not meet the floor');
  passes(road([...every24, ...between.map((x) => empty(x, 'A stone.'))], 'core'), 'the same events with something to say do');
  fails(road(every24, undefined), 'neither core nor country', 'an outdoor map with no mark fails');
  fails({ ...harrow, density: 'core' }, 'only an outdoor map', 'a town with a mark fails');

  // The sign cap on a hall of stone: one square in four a sign passes, one more fails.
  const hall = (features: Feature[]): MapDef =>
    ({ id: 'hall', name: 'Hall', kind: 'dungeon', start: { x: 1, y: 1, facing: NORTH }, rows: ['#########', '#.......#', '#########'], features });
  const sign = (x: number): Feature => ({ kind: 'sign', x, y: 1, text: 'Hall.' });
  passes(hall([chest(1, 1), chest(3, 1), chest(5, 1), sign(7)]), 'three chests and a sign pass (1 of 4)');
  fails(hall([chest(1, 1), chest(3, 1), chest(5, 1), sign(6), sign(7)]), 'a sign', 'three chests and two signs fail (2 of 5)');
  const stack = Array.from({ length: 30 }, (_, i) => ({ kind: 'event' as const, x: 1, y: 1, id: `s${i}`, text: 'Here.' }));
  fails(hall([chest(3, 1), sign(7), ...stack]), 'a sign', 'thirty events on one square are one point (1 sign of 3)');
  fails(hall([chest(3, 1), chest(5, 1), sign(7), ...[1, 2, 4, 6].map((x) => ({ ...empty(x), y: 1 }))]), 'a sign', 'and empty ones are none (1 sign of 3)');
  const island: MapDef = { id: 'island', name: 'Island', kind: 'dungeon', start: { x: 1, y: 1, facing: NORTH }, rows: ['#####', '#.#.#', '#####'], exits: [] };
  fails(island, 'nothing reaches', 'a square nothing reaches fails');
}
