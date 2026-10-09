// The outdoor square a map is entered from (tools/ways.ts), which the contact sheet centres its crop of
// the world map on (#638). A way in by an exit or a Rift, the gate, comes before a crossing's seller,
// whose end is the ship's port and not the town, even when the seller's map is listed first; a map
// with a crossing alone keeps the seller, since no gate leads in.
import { MAP_DEFS, ATLAS } from '../../src/content/index.ts';
import { worldPoint } from '../../src/game/atlas.ts';
import { waysOut, entrance } from '../ways.ts';
import { ok } from './lib.ts';

type Pt = readonly [number, number];
const show = (p: Pt | null): string => (p ? `(${p[0]}, ${p[1]})` : 'nowhere');
const is = (p: Pt | null, q: Pt): boolean => !!p && p[0] === q[0] && p[1] === q[1];
const index = (id: string): number => MAP_DEFS.findIndex((d) => d.id === id);
/** The ways from one map to another, gates (exits and Rifts) or crossings sold. */
const waysTo = (from: string, to: string, sold: boolean) => {
  const d = MAP_DEFS.find((m) => m.id === from);
  return d ? waysOut(d).filter((w) => w.to === to && !!w.sold === sold) : [];
};

/** Towns with a gate and a crossing sold in a map listed before the gate's: the first way out found was the seller's. */
const TOWNS: { id: string; gate: string; at: Pt; sells: string }[] = [
  { id: 'kilnhaven', gate: 'kilnmouth_l6', at: [388.5, 162.5], sells: 'saltmouth' },
  { id: 'rime_lodge', gate: 'longmere_m9', at: [410.5, 262.5], sells: 'kilnhaven' },
  { id: 'cinderport', gate: 'cindercoast_g10', at: [206.5, 288.5], sells: 'kilnhaven' },
];
/** The Tide Ship's four maps and the Dead-Drop's four, which hang from its third deck: a crossing alone leads in. */
const SHIP: Pt = [182.5, 188.5];
const ALONE = ['tide_ship', 'tide_ship2', 'tide_ship3', 'tide_ship_rift', 'dead_drop_stair', 'dead_drop', 'dead_drop2', 'dead_drop3'];

export function ways(): void {
  const at = (id: string): Pt | null => entrance(MAP_DEFS, ATLAS, id);
  for (const t of TOWNS) {
    const gates = waysTo(t.gate, t.id, false).map((w) => worldPoint(ATLAS, t.gate, w.x, w.y));
    ok(gates.some((p) => is(p, t.at)) && waysTo(t.sells, t.id, true).length > 0 && index(t.sells) < index(t.gate),
      `${t.id} has its gate on ${t.gate}, world ${show(t.at)}, and a crossing sold in ${t.sells}, which is listed first`);
    const got = at(t.id);
    ok(is(got, t.at), `${t.id} is entered at its gate, not at the seller's end${is(got, t.at) ? '' : ` -> got ${show(got)}`}`);
  }
  // A placed map with a way to it by exit or Rift is a gate; the ship has none, so only the seller leads in.
  const gated = (id: string): boolean => MAP_DEFS.some((d) => worldPoint(ATLAS, d.id, 0, 0) && waysOut(d).some((w) => w.to === id && !w.sold));
  const seller = MAP_DEFS.flatMap((d) => waysOut(d).filter((w) => w.sold && w.to === 'tide_ship').map((w) => worldPoint(ATLAS, d.id, w.x, w.y)));
  ok(seller.length === 1 && is(seller[0], SHIP), `the Tide Ship is sold at one square on the world map, ${show(SHIP)} (${seller.map(show).join(', ')})`);
  for (const id of ALONE) {
    const got = at(id);
    ok(!gated(id) && is(got, SHIP), `${id} keeps the seller for its entrance, world ${show(SHIP)}${gated(id) ? ' -> a gate leads in' : is(got, SHIP) ? '' : ` -> got ${show(got)}`}`);
  }
}
