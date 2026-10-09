// The ways between maps, as the contact sheet (tools/sheet.ts) reads them: what leads out of a map, and
// the outdoor square a town, a ship or a dungeon is entered from, which its crop of the world map is
// centred on. They live here because the sheet drives a browser the moment it is imported, which a
// test cannot do (tools/tests/ways.ts).
import { worldPoint } from '../src/game/atlas.ts';
import type { Atlas } from '../src/game/atlas.ts';
import type { MapDef } from '../src/game/map.ts';
import type { Facing } from '../src/game/types.ts';

/** A way out of a map; `sold` marks a crossing a person sells, which is no gate. */
export type Way = { x: number; y: number; to: string; tx: number; ty: number; tf?: Facing; sold?: boolean };

/**
 * A map's ways out: its exits, its tears into Rifts, which are walked through as exits are, and the
 * crossings its people sell, from where the seller stands to where the crossing lands.
 */
export const waysOut = (d: MapDef): Way[] =>
  [...(d.exits ?? []), ...(d.features ?? []).flatMap((f): Way[] => (f.kind === 'rift' ? [f] : f.kind === 'npc' ? (f.passage ?? []).map((p) => ({ x: f.x, y: f.y, to: p.to, tx: p.x, ty: p.y, tf: p.facing, sold: true })) : []))];

/**
 * The outdoor square, as a world point, that leads to a map, through as many maps as it takes. A way
 * in by an exit or a rift, the gate, comes before one a crossing's seller gives, which is the ship's
 * port and not the town: a town's crop is centred on its gate. A map with a crossing alone, the Tide
 * Ship and the Dead-Drop under it, keeps the seller as its last resort.
 */
export function entrance(defs: readonly MapDef[], atlas: Atlas, id: string, seen = new Set<string>()): [number, number] | null {
  seen.add(id);
  for (const sold of [false, true]) for (const d of defs) for (const e of waysOut(d)) {
    if (!!e.sold !== sold || e.to !== id || seen.has(d.id)) continue;
    const p = worldPoint(atlas, d.id, e.x, e.y) ?? entrance(defs, atlas, d.id, seen);
    if (p) return p;
  }
  return null;
}
