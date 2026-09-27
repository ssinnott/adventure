// The content: the areas in road order, and the tables the game reads, merged from them. Adding an
// area is its folder under areas/ and a line in AREAS. The unions the game types its content with
// (MonsterSprite, Interior, RegionId) are made from the areas here, so nobody edits them by hand.
// The maps as played, with the outdoors laid out, are in ./maps.ts.
import type { MapDef } from '../game/map.ts';
import type { MonsterDef } from '../game/monsters.ts';
import type { ItemDef } from '../game/items.ts';
import type { SpellDef } from '../game/spells.ts';
import type { QuestDef } from '../game/quests.ts';
import type { Climate } from '../game/weather.ts';
import { AREA as shelf } from './areas/shelf/index.ts';
import { AREA as thornmark } from './areas/thornmark/index.ts';
import { ITEMS as CORE_ITEMS } from './items.ts';
import { SPELLS as ALL_SPELLS } from './spells.ts';

/** The areas in road order. The order is behaviour: a new game starts on the first area's first map. */
export const AREAS = [shelf, thornmark] as const;

type AnyArea = (typeof AREAS)[number];
/** The regions, one to an area; each map names its region and shares its sky. */
export type RegionId = AnyArea['id'];
/** One kind per distinct drawing; kinds that share a family module share a frame but not a look. */
export type MonsterSprite = AnyArea['sprites'][number];
/** The painted room a business shows while the party is inside it, one per business. */
export type Interior = AnyArea['interiors'][number];

/** The maps as written, in road order, Harrow first. The outdoor ones are zones the atlas places. */
export const MAP_DEFS: readonly MapDef[] = AREAS.flatMap((a) => a.maps);

export const MONSTERS: Record<string, MonsterDef> = Object.fromEntries(AREAS.flatMap((a) => a.monsters).map((m) => [m.id, m]));

/** The items no area owns first, then each area's. */
export const ITEMS: Record<string, ItemDef> = Object.fromEntries([...CORE_ITEMS, ...AREAS.flatMap((a) => a.items)].map((i) => [i.id, i]));

export const SPELLS: Record<string, SpellDef> = ALL_SPELLS;

/** The quest log's quests, each area's in road order: the log lists them so. */
export const QUESTS: readonly QuestDef[] = AREAS.flatMap((a) => a.quests);

export const CLIMATES = Object.fromEntries(AREAS.map((a) => [a.id, a.climate])) as Record<RegionId, Climate>;

/** Every business's interior, in road order. */
export const INTERIORS: readonly Interior[] = AREAS.flatMap((a) => a.interiors);
