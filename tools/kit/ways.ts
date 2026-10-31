// The ways between maps, as the contact sheet (tools/sheet.ts) reads them: what leads out of a map, and
// the outdoor square a town, a ship or a dungeon is entered from, which its crop of the world map is
// centred on; and the square a landmark is seen from afar. They live here because the sheet drives a
// browser the moment it is imported, which a test cannot do (tools/tests/ways.ts).
import { worldPoint } from '../../src/game/atlas.ts';
import type { Atlas } from '../../src/game/atlas.ts';
import type { MapDef } from '../../src/game/mapdef.ts';
import { FACING_DX, FACING_DY } from '../../src/game/types.ts';
import type { Facing } from '../../src/game/types.ts';

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

/**
 * Where a landmark is seen from afar, which the views near it cannot show (within four squares a mountain's square
 * shows its own drawing and a building's walls hide the foot): a square from which it lies 8 to 10 ahead along one
 * of the four facings, in the facing's cone (no farther to either side than half the way ahead), the four squares
 * ahead of the viewer open too (`open`). The most nearly straight on wins, then the nearest to the map's start, the
 * way the party comes in, then the first found: north, east, south, west, the farthest first, from the left. Null
 * where no such square is.
 */
export function afar(l: { x: number; y: number }, start: { x: number; y: number }, open: (x: number, y: number) => boolean): { x: number; y: number; facing: Facing } | null {
  let best: { x: number; y: number; facing: Facing; side: number; near: number } | null = null;
  for (const facing of [0, 1, 2, 3] as Facing[]) {
    const fx = FACING_DX[facing], fy = FACING_DY[facing];
    for (const d of [10, 9, 8]) for (let side = -(d >> 1); side <= d >> 1; side++) {
      // The landmark is d ahead of the viewer and `side` to its right, whose way is (-fy, fx).
      const x = l.x - fx * d + fy * side, y = l.y - fy * d - fx * side;
      if (![0, 1, 2, 3, 4].every((k) => open(x + fx * k, y + fy * k))) continue;
      const near = Math.abs(x - start.x) + Math.abs(y - start.y);
      if (!best || Math.abs(side) < Math.abs(best.side) || (Math.abs(side) === Math.abs(best.side) && near < best.near)) best = { x, y, facing, side, near };
    }
  }
  return best && { x: best.x, y: best.y, facing: best.facing };
}
