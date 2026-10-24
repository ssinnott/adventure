// The density rule the suites share (#984): a map measured against its floors and judged. The
// density suite holds every map to it; the others take it from here.
import { GameMap } from '../../../src/game/map.ts';
import type { MapDef } from '../../../src/game/mapdef.ts';

type Row = 'core' | 'country' | 'town' | 'dungeon';
/** 90% of the squares within `within` steps, and none past `cap`. Country held on every country box of the Downs (#47). */
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
  const said = m.features.filter((f) => (f.kind !== 'sign' && f.kind !== 'event') || f.text.trim() !== '');
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
