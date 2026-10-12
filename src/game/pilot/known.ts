// What the pilot may know of the world (#713, Decided 1): the automap's bits and its ink, the
// features and exits on squares the party has seen, the maps it has visited, the world map as drawn,
// what the company can cross, the groups in its sight and the lines it has heard. Nothing here reads
// a map as written: not its secrets or its encounters, what opens a gate or an exit or what an exit
// says on arrival, and of a feature nothing but what the automap and the hint show (its kind, its
// square and its name, the id it is known by, and a den's ash) until a menu has shown what it lists.
// What a feature says, holds, gives or wants is known once it is heard. A tear into a Rift is an exit
// to it, as the game walks it.
// A zone map's id names its part of the outdoors, at the zone's own squares (World.locate).
import type { Game } from '../game.ts';
import type { Cell, Door, Exit, Feature, GameMap } from '../map.ts';
import { seen as seenBit, drawnCell } from '../world.ts';
import type { MapState } from '../world.ts';
import { mapPlace } from '../atlas.ts';
import { partyCan } from '../party.ts';
import { spentId } from '../wilds.ts';
import { ATLAS, MAP_DEFS } from '../../content/index.ts';
import { onAutomap } from '../../ui/frame.ts';

/** What the party sees of a feature: its kind and square on the automap, the id it is known by, and its name, the hint's. */
const SEEN = ['kind', 'x', 'y', 'id', 'name'] as const;
/** What a menu tells of a feature (Pilot.tell): the crossings a person has offered, a shop's wares and prices, a trainer's levels. */
const TOLD = ['passage', 'stock', 'prices', 'maxLevel'] as const;
/** A den the automap inks burnt, as ash (frame.ts DEN_ASH). */
type Ash<F> = F extends { kind: 'den' } ? { ash?: true } : unknown;
type Sight<F> = F extends Feature ? Pick<F, Extract<keyof F, (typeof SEEN)[number]>> & Partial<Pick<F, Extract<keyof F, (typeof TOLD)[number]>>> & Ash<F> : never;

/** A feature as the party knows it: what it sees of it, and what a menu has told. */
export type Sighted = Sight<Feature>;
/** A cell as the automap inks it: no legend letter, so a secret door is a wall like any other, and a locked door a door. */
export type Inked = Omit<Cell, 'ch' | 'door'> & { door: Exclude<Door, 'locked' | 'secret'> };

export interface Known {
  /** The automap's bit: whether the party has seen the square (MapState.explored). */
  seen(map: string, x: number, y: number): boolean;
  /** The cell as the automap inks it (drawnCell), or undefined when unseen. A secret door comes back a wall, and a locked door a door: the pilot learns a lock by trying it. */
  cell(map: string, x: number, y: number): Inked | undefined;
  /** Features the automap draws (onAutomap, and not spent) on seen squares: each its kind, square, id and name, a burnt den its ash, and what a menu has shown. */
  features(map: string): Sighted[];
  /** Exits and tears into a Rift on seen squares, without what opens them or the line said on arrival: the pilot learns a way by trying it. The outdoors' zone crossings are plain walking. */
  exits(map: string): Exit[];
  /** Maps visited: the keys of state.maps. */
  visited(): string[];
  /** The map an id is played on: its own, or for a zone's the outdoors (World.locate). */
  mapOf(map: string): string;
  /** Where a map is on the world map, in world cells, as the world map places it (mapPlace). */
  placeOf(map: string): [number, number] | undefined;
  /** What the company can cross, as it knows itself: a swimmer, a Mountaineer and the iron keys it carries (partyCan). */
  can(): { swim: boolean; climb: boolean; keys: number };
  /** The squares of the groups in the party's sight now, as the viewport draws them (World.groupsInSight); none on any other map. */
  groups(map: string): { x: number; y: number }[];
  /** Lines heard: everything said through Game.say and every message opened (Pilot.hear). */
  heard: readonly string[];
}

/** A map by the id given, as the world plays it: its own, or a zone's outdoor map, with where the zone sits and its size. */
interface Frame { m: GameMap; ms?: MapState; ox: number; oy: number; w: number; h: number }

/** A feature as the party knows it, at its square on the map as named, a burnt den as ash; `told` adds what a menu has shown. */
function sight(f: Feature, fr: Frame, told: boolean): Sighted {
  const all = f as unknown as Record<string, unknown>, out: Record<string, unknown> = {};
  for (const k of told ? [...SEEN, ...TOLD] : SEEN) if (all[k] !== undefined) out[k] = all[k];
  if (f.kind === 'den' && fr.ms?.used[f.id]) out.ash = true;
  return { ...out, x: f.x - fr.ox, y: f.y - fr.oy } as unknown as Sighted;
}

export function knownOf(g: Game): Known {
  const w = g.world, p = g.pilot, all = !!p?.omniscient;
  const frame = (map: string): Frame | undefined => {
    const at = w.locate(map, 0, 0), m = g.maps[at.mapId];
    if (!m) return undefined;
    const z = at.mapId === map ? undefined : m.zones.find((q) => q.id === map);
    return { m, ms: w.state.maps[m.id], ox: at.x, oy: at.y, w: z?.w ?? m.width, h: z?.h ?? m.height };
  };
  const seenIn = (fr: Frame, x: number, y: number): boolean =>
    x >= 0 && y >= 0 && x < fr.w && y < fr.h && (all || (!!fr.ms && seenBit(fr.ms.explored, (fr.oy + y) * fr.m.width + fr.ox + x)));
  return {
    seen(map, x, y) { const fr = frame(map); return !!fr && seenIn(fr, x, y); },
    cell(map, x, y) {
      const fr = frame(map);
      if (!fr || !seenIn(fr, x, y)) return undefined;
      const c = drawnCell(fr.m, fr.ox + x, fr.oy + y);
      return c.door === 'secret' ? { terrain: c.terrain, solid: 'wall', door: 'none' } : { terrain: c.terrain, solid: c.solid, door: c.door === 'locked' ? 'door' : c.door };
    },
    features(map) {
      const fr = frame(map);
      if (!fr) return [];
      return fr.m.features.filter((f) => {
        if (!seenIn(fr, f.x - fr.ox, f.y - fr.oy) || !onAutomap(w, f)) return false;
        // As the automap has it: a den shows burnt, and anything else spent is gone.
        const spent = spentId(f);
        return f.kind === 'den' || !spent || !fr.ms?.used[spent];
      }).map((f) => sight(f, fr, !!p?.told.has(f)));
    },
    exits(map) {
      const fr = frame(map);
      if (!fr) return [];
      // A tear into a Rift is walked through as an exit is (GameMap.exitAt).
      const tears = fr.m.features.flatMap((f): Exit[] => (f.kind === 'rift' ? [{ x: f.x, y: f.y, to: f.to, tx: f.tx, ty: f.ty, tf: f.tf }] : []));
      return [...fr.m.exits, ...tears].filter((e) => seenIn(fr, e.x - fr.ox, e.y - fr.oy)).map(({ needFlag, shut, blockedText, label, ...e }) => ({ ...e, x: e.x - fr.ox, y: e.y - fr.oy }));
    },
    visited: () => Object.keys(w.state.maps),
    mapOf: (map) => w.locate(map, 0, 0).mapId,
    placeOf: (map) => mapPlace(ATLAS, MAP_DEFS, map),
    can: () => partyCan(g.party),
    groups(map) {
      const fr = frame(map);
      if (!fr || fr.m.id !== w.state.mapId) return [];
      return (all ? w.liveGroups() : w.groupsInSight()).map((q) => ({ x: q.state.x - fr.ox, y: q.state.y - fr.oy })).filter(({ x, y }) => x >= 0 && y >= 0 && x < fr.w && y < fr.h);
    },
    heard: p?.heard ?? [],
  };
}
