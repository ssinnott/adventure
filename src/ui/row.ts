// The fight's row: where each monster stands across the view, and how tall it is drawn. Each line of
// the fight (its front, and a back rank behind it) stands a slot apart, as a row always has, wherever
// that keeps every drawing inside the view and no neighbour over more than OVERLAP of the next. Wider
// drawings stand further apart, by their spans (SPAN in ui/sprites.ts); a line that would run past the
// view's edge closes up, never past OVERLAP, and slides in; only a line still too wide makes the
// whole fight smaller. A row that fits stands as it did. Pure, so tools/tests/row.ts holds every
// fight the maps can start to it; ui/combat.ts draws what it returns.
import { combatHeight, SPAN, SPAN_SLACK } from './sprites.ts';
import { seatOf, BACK_SCALE } from './grouplabels.ts';
import type { LabelMonster } from './grouplabels.ts';
import type { MonsterSprite } from '../game/monsters.ts';

/** What the row needs of a monster in the fight: what a label needs, and its drawing and size. */
export interface RowMonster extends LabelMonster { def: LabelMonster['def'] & { sprite: MonsterSprite; size: number } }

/**
 * Where a monster stands, from the view's top left: its centre across, its foot down, the height it is
 * drawn and how far its span reaches either side of its centre.
 */
export interface Seat { x: number; foot: number; h: number; left: number; right: number }

/**
 * How far one neighbour may stand over the next in a line, as a share of the narrower's span: a tail,
 * a wing or a shield behind the next, never a body across it. A back rank stands behind its front by
 * design, and is not held to it.
 */
export const OVERLAP = 1 / 3;

/** The fight's living monsters, in the order they stand, seated in a view `width` by `height`: a seat for each, in the same order. */
export function seatRow(ms: readonly RowMonster[], width: number, height: number): Seat[] {
  const n = ms.length;
  if (!n) return [];
  const front: number[] = [], rear: number[] = [];
  ms.forEach((m, i) => (m.back ? rear : front).push(i));
  const ranked = front.length > 0 && rear.length > 0;
  // Two lines of the same parity would stand one behind another, so each steps a quarter aside.
  const step = ranked && (front.length - rear.length) % 2 === 0 ? 0.25 : 0;
  const slot = width / Math.max(5, (ranked ? Math.max(front.length, rear.length) : n) + 2 * step);
  const lines = ranked ? [front, rear] : [ms.map((_, i) => i)];
  const tall = ms.map((m) => combatHeight(m.def.size, n) * (m.back ? BACK_SCALE : 1));
  // At the fight's scale `s`: how far each reaches either side, and how near two neighbours may stand.
  const left = (i: number, s: number): number => SPAN[ms[i].def.sprite][0] * tall[i] * s;
  const right = (i: number, s: number): number => SPAN[ms[i].def.sprite][1] * tall[i] * s;
  const near = (a: number, b: number, s: number): number =>
    Math.max(0, right(a, s) + left(b, s) - OVERLAP * Math.min(left(a, s) + right(a, s), left(b, s) + right(b, s)));
  /** A line's width from its first's left to its last's right, its neighbours `floor` apart or as near as they may stand, whichever is further. */
  const across = (line: readonly number[], s: number, floor: number): number =>
    left(line[0], s) + right(line[line.length - 1], s) + line.slice(1).reduce((sum, b, j) => sum + Math.max(floor, near(line[j], b, s)), 0);
  const room = width - 2 * SPAN_SLACK;
  // Smaller only where a line closed right up still runs past the view: everything in `across` grows with the scale.
  const scale = Math.min(1, ...lines.map((line) => room / across(line, 1, 0)));
  const seats: Seat[] = [];
  lines.forEach((line, k) => {
    // A slot apart, or closer where that would run past the view: as far apart as fits.
    let floor = slot;
    if (across(line, scale, slot) > room) {
      let lo = 0, hi = slot;
      for (let it = 0; it < 40; it++) { const mid = (lo + hi) / 2; if (across(line, scale, mid) > room) hi = mid; else lo = mid; }
      floor = lo;
    }
    const gaps = line.slice(1).map((b, j) => Math.max(floor, near(line[j], b, scale)));
    const long = gaps.reduce((a, g) => a + g, 0);
    // Centred, the two lines each a quarter slot aside where one would stand behind the other; slid in from an edge it would run past.
    let x = (width - long) / 2 + (ranked ? (k === 1 ? step : -step) * slot : 0);
    const lo = x - left(line[0], scale), hi = x + long + right(line[line.length - 1], scale);
    if (lo < SPAN_SLACK) x += SPAN_SLACK - lo;
    else if (hi > width - SPAN_SLACK) x -= hi - (width - SPAN_SLACK);
    line.forEach((i, j) => {
      seats[i] = { x, foot: seatOf(ms[i], height, ms[i].def.size), h: tall[i] * scale, left: left(i, scale), right: right(i, scale) };
      x += gaps[j] ?? 0;
    });
  });
  return seats;
}
