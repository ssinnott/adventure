// The content: the areas in road order, and the tables the game reads, merged from them. Adding an
// area is its folder under areas/ and its line in AREAS (with the import above it); its drawings
// and rooms are src/ui's (FAMILY in ui/sprites.ts, SCENES in ui/interior.ts), which the typecheck
// holds to the lists here. The unions the game types its content with (MonsterSprite, Interior,
// RegionId) are made from the areas, so nobody edits them by hand. The one quest is joined here
// from the areas' chapters. The maps as played, with the outdoors laid out, are in ./maps.ts.
import type { MapDef } from '../game/map.ts';
import type { MonsterDef } from '../game/monsters.ts';
import type { ItemDef } from '../game/items.ts';
import type { SpellDef } from '../game/spells.ts';
import type { LogQuest, ChapteredQuest } from '../game/quests.ts';
import type { GuildQuest } from '../game/guilds.ts';
import type { Area } from './area.ts';
import { guildQuestDef } from './guilds.ts';
import type { Climate } from '../game/weather.ts';
import type { Atlas } from '../game/atlas.ts';
import { AREA as shelf } from './areas/shelf/index.ts';
import { AREA as thornmark } from './areas/thornmark/index.ts';
import { AREA as saltreach } from './areas/saltreach/index.ts';
import { AREA as wrackholm } from './areas/wrackholm/index.ts';
import { AREA as sunderwood } from './areas/sunderwood/index.ts';
import { AREA as kilns } from './areas/kilns/index.ts';
import { AREA as cairnmoor } from './areas/cairnmoor/index.ts';
import { AREA as rimewater } from './areas/rimewater/index.ts';
import { AREA as whitespine } from './areas/whitespine/index.ts';
import * as ashfall from './areas/ashfall/monsters.ts';
import { ITEMS as ASHFALL_ITEMS } from './areas/ashfall/items.ts';
import * as ashfallRooms from './areas/ashfall/interiors.ts';
import { ITEMS as CORE_ITEMS } from './items.ts';
import { SPELLS as ALL_SPELLS } from './spells.ts';
import { PLAN } from './atlas.ts';

/** The areas in road order. The order is behaviour: a new game starts on the first area's first map. */
export const AREAS = [shelf, thornmark, saltreach, wrackholm, sunderwood, kilns, cairnmoor, rimewater, whitespine] as const;

/**
 * Monsters drawn ahead of their area: an area is listed in AREAS only once it has a map to start
 * on, and its monsters may be drawn before that. Each is merged into MONSTERS and MonsterSprite as
 * an area's are; once the area is listed, its Area takes the import and its line here goes.
 */
export const AHEAD = [
  { id: 'ashfall' as const, sprites: ashfall.SPRITES, monsters: ashfall.MONSTERS },
] as const;

/**
 * Rooms drawn ahead of their area, as AHEAD's monsters are: an area's businesses' rooms may be
 * drawn before its first map. Each area's list is merged into Interior and INTERIORS as a listed
 * area's is (src/ui/interior.ts paints every one); once the area is listed, its Area takes the
 * list as `interiors` and its line here goes.
 */
export const ROOMS_AHEAD = [
  { id: 'ashfall' as const, interiors: ashfallRooms.INTERIORS },
] as const;

/**
 * Items made ahead of their area, as AHEAD's monsters are: the gear ladder's steps are priced, and
 * the harness and the gate dress by them, before the towns that sell them and the boxes that hold
 * them are built (#535). Each area's table is merged into ITEMS as a listed area's is, and no save
 * can hold one until a listed area sells or places it (tools/shipped.ts records a listed area's);
 * once the area is listed, its Area takes the table as `items` and its line here goes.
 */
export const ITEMS_AHEAD = [
  { id: 'ashfall' as const, items: ASHFALL_ITEMS },
] as const;

type AnyArea = (typeof AREAS)[number];
/** The regions, one to an area; each map names its region and shares its sky. */
export type RegionId = AnyArea['id'];
/** One kind per distinct drawing; kinds that share a family module share a frame but not a look. */
export type MonsterSprite = AnyArea['sprites'][number] | (typeof AHEAD)[number]['sprites'][number];
/** The painted room a business shows while the party is inside it, one per business. */
export type Interior = AnyArea['interiors'][number] | (typeof ROOMS_AHEAD)[number]['interiors'][number];

// The unions stay lists of names only while every area keeps its literals (`satisfies Area`, not
// `: Area`). Widened to string, FAMILY and SCENES would stop catching a missing drawing or room,
// so a widened union fails the typecheck here.
type Narrow<T extends string> = string extends T ? false : true;
export const NARROW: [Narrow<RegionId>, Narrow<MonsterSprite>, Narrow<Interior>] = [true, true, true];

/** Rows keyed by id, in order, refusing an id given twice: two areas' 'wolf' would otherwise quietly become one. */
function byId<T extends { id: string }>(what: string, rows: readonly T[]): Record<string, T> {
  const out: Record<string, T> = {};
  for (const r of rows) {
    if (Object.hasOwn(out, r.id)) throw new Error(`${what} '${r.id}' is defined twice`);
    out[r.id] = r;
  }
  return out;
}
/** The same check where the table stays a list. */
function once<T>(what: string, rows: readonly T[], key: (r: T) => string): readonly T[] {
  byId(what, rows.map((r) => ({ id: key(r) })));
  return rows;
}

once('area', AREAS, (a) => a.id);

/** The maps as written, in road order, Helmstow first. The outdoor ones are zones the atlas places. */
export const MAP_DEFS: readonly MapDef[] = once('map', AREAS.flatMap((a) => a.maps), (d) => d.id);

export const MONSTERS: Record<string, MonsterDef> = byId('monster', [...AREAS, ...AHEAD].flatMap((a) => a.monsters));

/** The items no area owns first, then each area's, then those made ahead of their area. */
export const ITEMS: Record<string, ItemDef> = byId('item', [...CORE_ITEMS, ...[...AREAS, ...ITEMS_AHEAD].flatMap((a) => a.items)]);

export const SPELLS: Record<string, SpellDef> = byId('spell', ALL_SPELLS);

/** The one quest (EXPANSION §5.8), joined from each area's chapter in road order. */
export const THE_QUEST: ChapteredQuest = {
  id: 'dimming', title: 'The Dimming',
  chapters: once('chapter', AREAS.flatMap((a) => a.chapter ? [a.chapter] : []), (c) => c.id),
};

/** The guild quests, each area's in road order (game/guilds.ts). */
export const GUILD_QUESTS: readonly GuildQuest[] = AREAS.flatMap((a: Area) => a.guilds ?? []);

/**
 * The quest log's quests: the one quest, then each area's side quests in road order, then the guild
 * quests, each in the log from its taking to its pay by its own flags. The log lists them so.
 */
export const QUESTS: readonly LogQuest[] = once('quest', [THE_QUEST, ...AREAS.flatMap((a) => a.quests), ...GUILD_QUESTS.map(guildQuestDef)], (q) => q.id);
// A chapter's page is keyed under the quest's, and the log opens on a quest by its id: keep the two apart.
once('quest or chapter', [...QUESTS, ...THE_QUEST.chapters], (q) => q.id);

export const CLIMATES = Object.fromEntries(AREAS.map((a) => [a.id, a.climate])) as Record<RegionId, Climate>;

/** Every business's interior, in road order. */
export const INTERIORS: readonly Interior[] = once('interior', [...AREAS, ...ROOMS_AHEAD].flatMap((a) => a.interiors), (i) => i);

/**
 * What the areas chart, then the plan: a row an area charts that the plan has too (a planned place
 * now built) takes the plan's row's place.
 */
function chart<T>(what: string, plan: readonly T[], built: readonly T[], key: (r: T) => string): readonly T[] {
  const mine = new Map(once(what, built, key).map((r) => [key(r), r]));
  const planned = new Set(plan.map(key));
  return [...built.filter((r) => !planned.has(key(r))), ...plan.map((r) => mine.get(key(r)) ?? r)];
}

/** The world map: the plan (./atlas.ts) with each area's own zones, plates and sites. Everything reads this one. */
export const ATLAS: Atlas = {
  ...PLAN,
  zones: chart('zone', PLAN.zones, AREAS.flatMap((a) => a.atlas.zones), (z) => z.id),
  places: chart('place', PLAN.places, AREAS.flatMap((a) => a.atlas.places), (p) => p.id),
  sites: chart('site', PLAN.sites, AREAS.flatMap((a) => a.atlas.sites), (s) => s.name),
};
