// The automap's ink: what a cell is drawn as. The view draws its walls by it, the automap inks its
// squares by it, and the pilot's fair view (game/pilot/known.ts) reads the map through it, so all
// three show one map.
import type { GameMap, Cell, Solid } from './map.ts';

/** The billboards a door outdoors may be set among, in the order a tie goes. */
const GUISES = ['mountain', 'rock', 'tree', 'glass'] as const;
/** What a cell stands as for a secret door beside it: a glass tree is a guise of its own, not a tree. */
const guiseOf = (c: Cell): Solid | 'glass' => (c.solid === 'tree' && c.terrain === 'crystal' ? 'glass' : c.solid);

/**
 * What a cell is drawn as. Outdoors or underground, a secret door set among mountain, rock or trees
 * (a sett in the fells, a cave in a crag, a gap behind a rock fall) is drawn as most of its
 * neighbours are, so it is found and never seen; beside a wall or a building it stays a door in the
 * wall. Once found it is a door, and so is every door the map shows: no door is hidden that has no
 * hint. Underground, a found one among them is the gap it is, open ground, since a dungeon's door
 * is drawn in its walls' style and a crag has none. Anywhere else, the cell itself.
 */
export function drawnCell(map: GameMap, x: number, y: number): Cell {
  const c = map.at(x, y);
  const found = map.kind === 'dungeon' && c.ch === 'S' && c.door === 'door';
  if (map.kind === 'town' || (c.door !== 'secret' && !found)) return c;
  const around = [[x - 1, y], [x + 1, y], [x, y - 1], [x, y + 1]].filter(([nx, ny]) => map.inBounds(nx, ny)).map(([nx, ny]) => map.at(nx, ny));
  if (around.some((n) => n.solid === 'wall' || n.solid === 'building')) return c;
  if (found) return { ...c, solid: 'none', door: 'none' };
  let best = c, most = 0;
  for (const g of GUISES) {
    const of = around.filter((n) => guiseOf(n) === g);
    if (of.length > most) { most = of.length; best = of[0]; }
  }
  return best;
}
