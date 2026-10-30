// The atlas's schema: the shapes the world map's plan is written in, from a point in world cells to
// the whole Atlas: the land in strokes (the rim, the seas, the ridges, the rivers, the patches and
// the trails), the areas of the road of levels and their zones, the places, the sites, the links
// and the marks on the sea.
// Types alone, erased before anything runs, so a change here paints no map and reaches no area
// (tools/kit/changed.ts). game/atlas.ts re-exports every name.
import type { MapKind } from '../mapdef.ts';
import type { RegionId } from '../weather.ts';
import type { WorldTerrain } from './painter.ts';

/** A point in world cells: x east, y south. */
export type Pt = readonly [number, number];

/** What a site on the painted map is drawn as. `label` letters a name alone; `water` letters a water's name. */
export type SiteIcon =
  | 'city' | 'town' | 'village' | 'hold' | 'farm' | 'cave' | 'tower' | 'barrow' | 'grove' | 'stone'
  | 'port' | 'hearth' | 'monastery' | 'mine' | 'forge' | 'fortress' | 'volcano' | 'sunken' | 'gate'
  | 'wreck' | 'rift' | 'ring' | 'lodge' | 'obelisk' | 'lighthouse' | 'ruin' | 'camp' | 'falls'
  | 'springs' | 'label' | 'water';

/** How a way is travelled. */
/** `coach` is a crossing by road (game/passage.ts): it carries a company over the land, never walked. */
export type LinkKind = 'road' | 'enter' | 'stairs' | 'sea' | 'deep' | 'coach';

/** A closed outline in world cells. `rough` is how far, in cells, the land's edge may wander from it. */
interface Outline { pts: readonly Pt[]; rough?: number }

/** A line of high or broken ground: a range's crest line and how wide it stands. */
interface Ridge {
  pts: readonly Pt[];
  /** Cells across the range itself. */
  width: number;
  /** Mountains unless it says: a line of low hills, a cliff (an escarpment), the rift's chasm, or a lava flow. */
  kind?: 'mountains' | 'hills' | 'cliff' | 'chasm' | 'lava';
  /** Snow on the crest. */
  snow?: boolean;
  /** Cells of rougher ground either side, and what it is (hills unless it says). */
  foot?: number;
  footT?: WorldTerrain;
}

/** A river from its source to its mouth, with its width in cells at each end. */
export interface River { name?: string; pts: readonly Pt[]; width?: readonly [number, number] }

/** Land of one kind inside an outline: a wood, a fen, fields. Later patches lie over earlier ones. */
interface Patch { t: WorldTerrain; pts: readonly Pt[]; rough?: number }

/** A road across planned country. */
export interface Trail { pts: readonly Pt[] }

/** A step on the road of levels above ground: a named country made of zones. */
export interface AtlasArea {
  id: string;
  name: string;
  /** Its step on the one road of levels: 1 is the start. */
  order: number;
  /** Level band of the area's planned zones; built zones read their maps'. */
  band?: readonly [number, number];
  /** The area's Wardstone, if it has one. */
  stone?: string;
  /** Where the area's name is lettered, world cells (the centre of the text). */
  label: Pt;
  /** Grass colour inside the area, blended across its borders, so neighbouring country reads apart. */
  tint?: string;
  /** One line for the zone overlay: what the area is. */
  note?: string;
}

/** A built outdoor map of a zone, placed with its top-left cell at `at`: one box of the grid. */
export interface ZoneMap { map: string; at: Pt }

/** A zone: a named part of an area. Its built outdoor maps are boxes of the grid, one or several. */
export interface AtlasZone {
  id: string;
  name: string;
  /** Its area's region: a zone of an area that does not exist fails the typecheck (#945). */
  area: RegionId;
  /** Where the zone is: the walk that settles borders starts from these, and from all its maps' footprints. */
  seeds?: readonly Pt[];
  /** The outdoor maps built of this zone, each where its top-left cell sits. */
  maps?: readonly ZoneMap[];
  /** Planned zones only; the area's band when absent. */
  band?: readonly [number, number];
  /** Where the overlay letters the zone's name; its first seed when absent. */
  label?: Pt;
  /** The zone's own words for how its land feels to a company under its floor, in place of the world's (game/world.ts). */
  crossing?: Crossing;
  /** The groups met on its road, in order from its way in, as the game names a group, 'map:id' (tools/tests/gate.ts). */
  road?: readonly string[];
  /** Of the reach, off the road of levels: the pace and the rifts leave it be (tools/tests/pillars.ts). */
  reach?: true;
  /** The most monsters any group on its maps may hold (tools/tests/maps.ts). */
  maxGroup?: number;
}

/** How a zone's land feels to a company one or two levels under its floor (`harder`), or three or more (`warning`). */
export interface Crossing { harder?: string; warning?: string }

/** A town, dungeon or Underdeep segment: a map of its own, shown as a plate in the zone overlay. */
export interface AtlasPlace {
  /** The map's id once built; a planned place's own id otherwise. */
  id: string;
  /** Planned places only; a built place shows its map's name. */
  name?: string;
  kind: Exclude<MapKind, 'outdoor'> | 'deep';
  planned?: boolean;
  /** A step of its own on the road of levels (the Underdeep and the core are steps, not areas). */
  order?: number;
  band?: readonly [number, number];
  /** Centre of the plate, world cells. */
  at: Pt;
  note?: string;
}

/** Something painted on the map: a town, a cave mouth, a Wardstone, a name. */
export interface AtlasSite {
  name: string;
  icon: SiteIcon;
  /** A built map the position is relative to; world cells otherwise. */
  map?: string;
  at: Pt;
  /** Where the name goes; 'none' leaves it unlettered. */
  label?: 'above' | 'below' | 'left' | 'right' | 'none';
  /** Not in the game yet. Planned sites are still painted; the overlay treats them as such. */
  planned?: boolean;
  /** Lettering size for a name alone (`label`, `water`); 1 unless it says. */
  size?: number;
}

/**
 * A way no map's exits make yet. Ends name an area, a zone, a place or a built map. Built ways come
 * from `MapDef.exits`.
 */
export interface AtlasLink {
  from: string;
  to: string;
  kind: LinkKind;
  /** The way opens once this step is done (a road cleared, a ship found); absent means open. */
  opens?: number;
  /** World cells where the arrow leaves `from` and meets `to`; a place's plate or a zone's label when absent. */
  a?: Pt;
  b?: Pt;
  /** Points a sea route passes on its way, so it rounds islands and headlands. */
  via?: readonly Pt[];
  note?: string;
  /** Where the note and the step it opens after are lettered, world cells; beside the arrow when absent. */
  noteAt?: Pt;
}

/**
 * Something painted on the open sea: a ship, flying its `pennant` (a colour), a serpent or a
 * whirlpool. The world map (ui/worldmap.ts) paints one only on deep water, and the atlas check
 * holds each to it.
 */
export interface SeaMark { kind: 'ship' | 'serpent' | 'whirlpool'; at: Pt; pennant?: string }

export interface Atlas {
  /** World size in cells. */
  width: number;
  height: number;
  /** Cells a side of a box of the grid, the way the old maps were cut into A1, B2...: one outdoor map. */
  square: number;
  /** Where box A1's top-left corner is, world cells; the grid runs from it both ways. */
  corner: Pt;
  seed: number;
  /** The world's edge; beyond it is nothing. `width` is the band of mountains inside it. */
  rim: Outline & { width: number };
  seas: readonly Outline[];
  /** Land raised back out of the seas. */
  isles: readonly Outline[];
  lakes: readonly Outline[];
  /** Shores the tide leaves twice a day: inside each, the shallows that touch the land are tidal ground. */
  tides?: readonly Outline[];
  ridges: readonly Ridge[];
  rivers: readonly River[];
  patches: readonly Patch[];
  trails: readonly Trail[];
  areas: readonly AtlasArea[];
  zones: readonly AtlasZone[];
  places: readonly AtlasPlace[];
  sites: readonly AtlasSite[];
  links: readonly AtlasLink[];
  /** The ships, the serpents and the whirlpool on the sea, world cells. */
  marks: readonly SeaMark[];
}
