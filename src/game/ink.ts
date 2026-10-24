// The automap's ink: what a cell is drawn as, and what the map marks (a feature there now, the groups
// in view or near and those a sense finds). The view draws its walls by it, the automap inks and
// marks its squares by it and the pilot's fair view (game/pilot/known.ts) reads the map through it,
// so all three show one map.
import type { GameMap } from './map.ts';
import type { Cell, Solid, Feature } from './mapdef.ts';
import type { Facing } from './types.ts';
import type { World, LiveGroup } from './world.ts';
import { AWARE, VIEW_DEPTH, VIEW_LATERAL, viewCell, hillHiding } from './world.ts';
import { hasSkill, SPIRIT_REACH } from './skills.ts';
import { monster } from './monsters.ts';
import { isDown } from './party.ts';

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

/** Which cells the viewport can show, for the automap's field-of-view highlight: none a hill hides (#53). */
export function viewCells(map: GameMap, px: number, py: number, f: Facing, sight: number): { x: number; y: number }[] {
  const out: { x: number; y: number }[] = [];
  for (let d = 0; d <= Math.min(VIEW_DEPTH, sight); d++) for (let l = -VIEW_LATERAL; l <= VIEW_LATERAL; l++) {
    const c = viewCell(px, py, f, d, l);
    if (map.inBounds(c.x, c.y) && !hillHiding(map, px, py, f, c.x, c.y)) out.push(c);
  }
  return out;
}

/** Whether the automap marks a feature: not an event, and not a person who is not there now. A feature of another map than the party's names it. */
export const onAutomap = (world: Pick<World, 'present'>, f: Feature, on?: string): boolean => f.kind !== 'event' && world.present(f, on);

/**
 * The live groups the automap marks: in view, or on a seen square within two steps of the party; none
 * a hill hides (#53). A member standing who has a sense (game/skills.ts; #856) marks more, through
 * walls, hills and dark: with Spirit Sense, a group all of the dead within `SPIRIT_REACH` steps; with
 * Danger Sense, a roaming group aware of the company, within its `aware` (as `moveMonsters` reads it).
 */
export function markedGroups(world: World): LiveGroup[] {
  const m = world.map, { x, y, facing } = world.state;
  const inView = new Set(viewCells(m, x, y, facing, world.sight).map((c) => c.y * m.width + c.x));
  const up = world.party.members.filter((c) => !isDown(c));
  const spirit = up.some((c) => hasSkill(c, 'spirit_sense')), danger = up.some((c) => hasSkill(c, 'danger_sense'));
  return world.liveGroups().filter(({ def, state: s }) => {
    const d = Math.abs(s.x - x) + Math.abs(s.y - y);
    return inView.has(s.y * m.width + s.x) || (world.explored(s.x, s.y) && d <= 2 && !world.hidden(s.x, s.y))
      || (spirit && d <= SPIRIT_REACH && def.monsters.every((id) => monster(world.tables.monsters, id).kind === 'dead'))
      || (danger && def.roams !== false && d <= (def.aware ?? AWARE));
  });
}
