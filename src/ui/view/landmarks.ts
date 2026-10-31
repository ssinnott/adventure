// The landmarks over the land (#1096): how far off each kind stands over the land (`LANDMARK_REACH`), what of
// one past the fourth square the land nearer than it hides (`landmarkShows`, a pure function of the horizon's
// cast, horizon.ts) and the measure a volcano is drawn to, so its cone stands on the range the skyline draws
// there as its summit (`volcanoScale`). The compositor draws them (compositor.ts), each kind its drawing in
// ui/scenery.ts; the kind is the view's own, not the site's icon on the world map.
import type { Landmark } from '../../game/mapdef.ts';
import { LANDMARK_HEIGHT, VOLCANO_LIP } from '../scenery.ts';
import { unit } from './common.ts';
import { REACH, standsOver } from './horizon.ts';
import type { Horizon } from './horizon.ts';

/** The view's rows as the game draws it, which a reach is reckoned in. */
const ROWS = 268;
/** A drawing is still a mark, and no speck, while it stands this many of the view's rows tall. */
export const MARK = 12;

/** How far off a kind's drawing still stands `MARK` rows tall: what its height earns. */
const earned = (kind: Landmark['kind']): number => Math.floor((LANDMARK_HEIGHT[kind] * unit(0, ROWS)) / 2 / MARK - 0.5);

/**
 * How many squares off each kind stands over the land. A lighthouse and a monastery keep the 40 they had; a
 * volcano's plume is seen from across the sea, out to the horizon's `REACH`; the rest as far as their height
 * earns, where their drawing still stands `MARK` rows tall.
 */
export const LANDMARK_REACH: Readonly<Record<Landmark['kind'], number>> = {
  lighthouse: 40, monastery: 40, volcano: REACH,
  city: earned('city'), ring: earned('ring'), tower: earned('tower'), tree: earned('tree'), stacks: earned('stacks'),
  fortress: earned('fortress'), falls: earned('falls'), wreck: earned('wreck'),
};

/** A run of the view's columns a landmark stands in, from `c`, `n` across, and how high the land nearer than it stands there. */
interface Shown { c: number; n: number; top: number }

/**
 * What of a landmark `d` squares off shows, a run of the view's columns at a time from `c0` up to `c1`: in each,
 * how many pixels over the horizon the land nearer than it stands (`standsOver`), which hides its foot and as
 * much of it as that land's height covers; 0 where nothing nearer stands, and it shows down to its foot on the
 * ground's row for its distance.
 */
export function landmarkShows(cast: Horizon, c0: number, c1: number, d: number): Shown[] {
  const out: Shown[] = [];
  for (let c = Math.max(0, c0); c < Math.min(cast.cols.length, c1); c++) {
    const top = standsOver(cast, c, d), last = out.at(-1);
    if (last && last.top === top) last.n++;
    else out.push({ c, n: 1, top });
  }
  return out;
}

/**
 * The measure a volcano is drawn to, in place of `u`, a square's half width where it lies: its lip a fifth over
 * `range`, how high the horizon stands a volcano at the heart of its range there (`standing`, horizon.ts), and its
 * foot on the ground's row, so the cone stands on the range as its summit and its plume goes up off it.
 */
export function volcanoScale(range: number, u: number): number {
  return (range * 1.2 + u) / VOLCANO_LIP;
}
