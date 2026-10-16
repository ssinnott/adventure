// The pilot's fair view of the world (epic #713, Decided 1; docs/PILOT.md): what the party has seen
// and heard, and nothing more. Every brain reads the world through it and never through `g.world`,
// `g.maps` or a map as written: the automap's bits, its cells as the automap inks them, the features
// and exits it marks, the maps walked, the world map as it is painted and the lines said. Nothing
// here reads a map's secrets or encounters, a gate's terms or what a person, a statue or a shop holds.
import type { Game } from '../game.ts';
import type { Cell, Exit, Feature, GameMap, MapZone } from '../map.ts';
import { seen as lit } from '../world.ts';
import { drawnCell } from '../ink.ts';
import { mapPlace } from '../atlas.ts';
import { spentId } from '../wilds.ts';
import { onAutomap } from '../../ui/frame.ts';
import { ATLAS, MAP_DEFS } from '../../content/index.ts';

/** A cell as the automap inks it, its legend letter gone: a secret door is a wall and no more. */
export type Inked = Omit<Cell, 'ch'>;

export interface Known {
  /** The automap's bit: whether the party has seen the square (`MapState.explored`). */
  seen(map: string, x: number, y: number): boolean;
  /** The cell as the automap inks it (`drawnCell`), or undefined when unseen: a secret door comes back a wall. */
  cell(map: string, x: number, y: number): Inked | undefined;
  /**
   * The features the automap marks on seen squares (`onAutomap`: no event, there now, not spent),
   * each a fair copy (`fair`): what only a meeting, a menu or a use shows is blank or gone.
   */
  features(map: string): Feature[];
  /** The exits on seen squares that are there now, as the automap marks them: where each leads, and no gate's terms. */
  exits(map: string): Exit[];
  /** The maps visited: the keys of `WorldState.maps`. */
  visited(): string[];
  /** Where a map is on the world map, in world cells, as the world map places it (`mapPlace`). */
  placeOf(map: string): [number, number] | undefined;
  /** Lines heard: everything said through `Game.say` and every message box opened, the last `HEARD_MAX`. */
  heard: readonly string[];
}

/**
 * The fair view of `g`. A zone map's id (a goal's map may be one) names the outdoors it lies in
 * (`World.locate`), and every reader takes and gives the outdoors' squares, as `g.world.state` has
 * them while the party is there: `seen` and `cell` answer for any of them, and the features and exits
 * are those in the zone's box. A goal's square written in the zone's own reckoning goes through
 * `World.locate` before it is compared. Features and exits of seen squares are as the world has them
 * now, not as last seen (a known simplification). A pilot's `omniscient` (the headless run, #723)
 * has every square seen.
 */
export function knownOf(g: Game): Known {
  const w = g.world, all = g.pilot?.omniscient ?? false;
  const seenOn = (m: GameMap, x: number, y: number): boolean => {
    if (!m.inBounds(x, y)) return false;
    const ms = w.state.maps[m.id];
    return all || (!!ms && lit(ms.explored, y * m.width + x));
  };
  /** The map as played that an id names (a zone map's is the outdoors), and the zone's box where a zone map's id named it. */
  const played = (map: string): { m: GameMap; box?: MapZone } | undefined => {
    const id = w.locate(map, 0, 0).mapId, m = g.maps[id];
    return m && { m, box: id === map ? undefined : m.zones.find((z) => z.id === map) };
  };
  const inBox = (box: MapZone | undefined, x: number, y: number): boolean => !box || (x >= box.x && y >= box.y && x < box.x + box.w && y < box.y + box.h);
  return {
    seen(map, x, y) {
      const p = played(map);
      return !!p && seenOn(p.m, x, y);
    },
    cell(map, x, y) {
      const p = played(map);
      if (!p || !seenOn(p.m, x, y)) return undefined;
      const { terrain, solid, door } = drawnCell(p.m, x, y);
      return door === 'secret' ? { terrain, solid: 'wall', door: 'none' } : { terrain, solid, door };
    },
    features(map) {
      const p = played(map);
      if (!p) return [];
      const used = w.state.maps[p.m.id]?.used ?? {};
      // As the automap marks them: a den standing or burnt, any other spent thing gone.
      const spent = (f: Feature): boolean => { const id = spentId(f); return f.kind !== 'den' && !!id && !!used[id]; };
      return p.m.features.filter((f) => inBox(p.box, f.x, f.y) && seenOn(p.m, f.x, f.y) && onAutomap(w, f) && !spent(f)).map(fair);
    },
    exits(map) {
      const p = played(map);
      if (!p) return [];
      return p.m.exits.filter((e) => inBox(p.box, e.x, e.y) && seenOn(p.m, e.x, e.y) && w.there(e))
        .map(({ x, y, to, tx, ty, tf }) => (tf === undefined ? { x, y, to, tx, ty } : { x, y, to, tx, ty, tf }));
    },
    visited: () => Object.keys(w.state.maps),
    placeOf: (map) => mapPlace(ATLAS, MAP_DEFS, map),
    heard: g.pilot?.heard ?? [],
  };
}

/**
 * A feature as the party knows it before it is met, used or bought from: its kind, its square, its
 * id and the name its hint shows. Words are '' and lists [] until said or shown, a number is NaN and
 * a gift {}; what it would say, ask, sell, teach or give, and when it is there, is gone. A rift keeps
 * where it leads, as an exit does.
 */
function fair(f: Feature): Feature {
  const { x, y } = f, named = 'name' in f && f.name ? { name: f.name } : {};
  switch (f.kind) {
    case 'sign': return { kind: 'sign', x, y, text: '' };
    case 'inn': return { kind: 'inn', x, y, name: f.name, interior: f.interior, price: NaN };
    case 'temple': return { kind: 'temple', x, y, name: f.name, interior: f.interior };
    case 'shop': return { kind: 'shop', x, y, name: f.name, interior: f.interior, stock: [] };
    case 'guild': return { kind: 'guild', x, y, name: f.name, interior: f.interior, classes: [], fee: NaN };
    case 'trainer': return { kind: 'trainer', x, y, name: f.name, interior: f.interior, maxLevel: NaN };
    case 'chest': return { kind: 'chest', x, y, id: f.id, gold: NaN, items: [] };
    case 'npc': return { kind: 'npc', x, y, name: f.name, lines: [], ...(f.interior ? { interior: f.interior } : {}) };
    case 'rift': return { kind: 'rift', x, y, id: f.id, to: f.to, tx: f.tx, ty: f.ty, ...(f.tf === undefined ? {} : { tf: f.tf }) };
    case 'shrine': return { kind: 'shrine', x, y, id: f.id, ...named, text: '', done: '' };
    case 'fountain': return { kind: 'fountain', x, y, id: f.id, ...named, text: '', done: '' };
    case 'cairn': return { kind: 'cairn', x, y, id: f.id, ...named, gold: NaN, items: [] };
    case 'statue': return { kind: 'statue', x, y, id: f.id, ...named, text: '', riddle: '', answer: '', gift: {}, done: '' };
    case 'camp': return { kind: 'camp', x, y, ...named, text: '' };
    case 'den': return { kind: 'den', x, y, id: f.id, ...named, text: '', breeds: [], keepers: '', brood: [], ask: '', burn: '', burnt: '', gold: NaN, items: [] };
    case 'well': return { kind: 'well', x, y, text: '' };
    case 'event': return { kind: 'event', x, y, id: f.id, text: '' };
  }
}
