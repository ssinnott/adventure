// The content: the areas in road order, and the tables the game reads, merged from them. Adding an
// area is its folder under areas/ and its line in AREAS (with the import above it); its drawings
// and rooms are src/ui's (SPRITES in ui/monsters/index.ts, SCENES in ui/interior.ts), which the typecheck
// holds to the lists here. The unions the game types its content with (MonsterSprite, Interior,
// RegionId, MapId, Flag) are made from the areas, so nobody edits them by hand. The one quest is joined here
// from the areas' chapters. The maps as played, with the outdoors laid out, are in ./maps.ts.
import type { MapDef } from '../game/map.ts';
import { landExits } from '../game/map.ts';
import type { MonsterDef } from '../game/monsters.ts';
import type { ItemDef } from '../game/items.ts';
import type { SpellDef } from '../game/spells.ts';
import type { LogQuest, ChapteredQuest } from '../game/quests.ts';
import type { GuildQuest } from '../game/guilds.ts';
import type { Area, Flags } from './area.ts';
import { guildQuestDef } from './guilds.ts';
import type { Climate } from '../game/weather.ts';
import type { Atlas } from '../game/atlas.ts';
import { AREA as shelf, MAPS as shelfMaps, FLAGS as shelfFlags } from './areas/shelf/index.ts';
import { AREA as thornmark, MAPS as thornmarkMaps, FLAGS as thornmarkFlags } from './areas/thornmark/index.ts';
import { AREA as saltreach, MAPS as saltreachMaps, FLAGS as saltreachFlags } from './areas/saltreach/index.ts';
import { AREA as wrackholm, MAPS as wrackholmMaps, FLAGS as wrackholmFlags } from './areas/wrackholm/index.ts';
import { AREA as sunderwood, MAPS as sunderwoodMaps, FLAGS as sunderwoodFlags } from './areas/sunderwood/index.ts';
import { AREA as kilns, MAPS as kilnsMaps, FLAGS as kilnsFlags } from './areas/kilns/index.ts';
import { AREA as cairnmoor, MAPS as cairnmoorMaps, FLAGS as cairnmoorFlags } from './areas/cairnmoor/index.ts';
import { AREA as rimewater, MAPS as rimewaterMaps, FLAGS as rimewaterFlags } from './areas/rimewater/index.ts';
import { AREA as whitespine, MAPS as whitespineMaps, FLAGS as whitespineFlags } from './areas/whitespine/index.ts';
import { AREA as ashfall, MAPS as ashfallMaps, FLAGS as ashfallFlags } from './areas/ashfall/index.ts';
import { AREA as glasswold, MAPS as glasswoldMaps, FLAGS as glasswoldFlags } from './areas/glasswold/index.ts';
import { AREA as hearth, MAPS as hearthMaps, FLAGS as hearthFlags } from './areas/hearth/index.ts';
import { ITEMS as CORE_ITEMS } from './items.ts';
import { FLAGS as CORE_FLAGS } from './flags.ts';
import { SPELLS as ALL_SPELLS } from './spells.ts';
import { PLAN } from './atlas.ts';

/**
 * The areas in road order. The order is behaviour: a new game starts on the first area's first map.
 * An area is listed from its first commit, its maps none yet if so (EXPANSION §8.2): its monsters,
 * rooms and items are merged as soon as it has them.
 */
export const AREAS = [shelf, thornmark, saltreach, wrackholm, sunderwood, kilns, cairnmoor, rimewater, whitespine, ashfall, glasswold, hearth] as const;

type AnyArea = (typeof AREAS)[number];
/** The regions, one to an area; each map names its region and shares its sky. */
export type RegionId = AnyArea['id'];
/** One kind per distinct drawing; kinds that share a family module share a frame but not a look. */
export type MonsterSprite = AnyArea['sprites'][number];
/** The painted room a business shows while the party is inside it, one per business. */
export type Interior = AnyArea['interiors'][number];
/**
 * The maps' ids, each kept literal where its map is declared (`MapDef<'cairns'>`): what an exit, a
 * quest and an area name a map by (#994). Made of each area's `MAPS`, not of AREAS: an area's literal
 * names maps (`outside`), so a union made of the areas would wait on itself.
 */
type AreaMaps = typeof shelfMaps | typeof thornmarkMaps | typeof saltreachMaps | typeof wrackholmMaps | typeof sunderwoodMaps | typeof kilnsMaps
  | typeof cairnmoorMaps | typeof rimewaterMaps | typeof whitespineMaps | typeof ashfallMaps | typeof glasswoldMaps | typeof hearthMaps;
export type MapId = AreaMaps[number]['id'];
/**
 * The flags by whose declaration holds them: each area's, of the flags it sets (its flags.ts), and the
 * code's own, for the whole (./flags.ts). Made of the declarations, not of AREAS, as MapId is (#995).
 */
type Declared = {
  shelf: keyof typeof shelfFlags; thornmark: keyof typeof thornmarkFlags; saltreach: keyof typeof saltreachFlags;
  wrackholm: keyof typeof wrackholmFlags; sunderwood: keyof typeof sunderwoodFlags; kilns: keyof typeof kilnsFlags;
  cairnmoor: keyof typeof cairnmoorFlags; rimewater: keyof typeof rimewaterFlags; whitespine: keyof typeof whitespineFlags;
  ashfall: keyof typeof ashfallFlags; glasswold: keyof typeof glasswoldFlags; hearth: keyof typeof hearthFlags;
  core: keyof typeof CORE_FLAGS;
};
/** A flag a save keeps, as the twelve fields that set or read one name it: one some declaration holds. */
export type Flag = Declared[keyof Declared];
/** The flags two of the declarations hold, each declaration's against the rest's: none, for the content's. */
export type Twice<D extends Record<string, string>> = { [K in keyof D]: D[K] & D[Exclude<keyof D, K>] }[keyof D];
/** `true` while no flag is declared twice, else the flags that are, so the typecheck names them. */
export type Once<D extends Record<string, string>> = [Twice<D>] extends [never] ? true : Twice<D>;

// The unions stay lists of names only while every area keeps its literals (`satisfies Area`, not
// `: Area`, and each map `MapDef<'id'>`). Widened to string, SPRITES and SCENES would stop catching a
// missing drawing or room, an exit a missing map and a field a flag nobody declares, so a widened
// union fails the typecheck here.
type Narrow<T extends string> = string extends T ? false : true;
export const NARROW: [Narrow<RegionId>, Narrow<MonsterSprite>, Narrow<Interior>, Narrow<MapId>, Narrow<Flag>] = [true, true, true, true, true];
/** Every area's maps are in MapId: an area left out of AreaMaps fails the typecheck here. */
export const LISTED: [Exclude<AnyArea['maps'][number]['id'], MapId>] extends [never] ? true : false = true;
/** No flag is declared twice: one that is fails the typecheck here, by name, and the load below (#995). */
export const ONCE: Once<Declared> = true;

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

/**
 * Every flag declared, by whose declaration holds it, refusing one declared twice by name (#995): the
 * typecheck refuses it first (`ONCE`), and this where the declarations are a list made at run time.
 */
export function flagOwners(owners: readonly { id: string; flags: Flags }[]): Readonly<Record<string, string>> {
  const out: Record<string, string> = {};
  for (const o of owners) for (const f of Object.keys(o.flags)) {
    if (Object.hasOwn(out, f)) throw new Error(`flag '${f}' is declared by ${out[f]} and ${o.id}`);
    out[f] = o.id;
  }
  return out;
}

/** Every flag, by the area that declares it, or `core` for the code's own (./flags.ts). */
export const FLAG_OWNERS = flagOwners([...AREAS, { id: 'core', flags: CORE_FLAGS }]);

/**
 * The maps as written, in road order, Helmstow first. The outdoor ones are zones the atlas places.
 * Each exit lands on an anchor of the map it leads to, which fills its square and facing here (#993).
 */
export const MAP_DEFS: readonly MapDef<MapId>[] = landExits(once('map', AREAS.flatMap<MapDef<MapId>>((a) => a.maps), (d) => d.id));

/** Read-only: a suite lends a def through `withDefs` (tools/tests/lib.ts), and nothing else writes it (#945). */
export const MONSTERS: Readonly<Record<string, MonsterDef>> = byId('monster', AREAS.flatMap((a) => a.monsters));

/** The items no area owns first, then each area's. Read-only: `withDefs` and the harness's `forge` alone write it (#945). */
export const ITEMS: Readonly<Record<string, ItemDef>> = byId('item', [...CORE_ITEMS, ...AREAS.flatMap((a) => a.items)]);

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
export const INTERIORS: readonly Interior[] = once('interior', AREAS.flatMap((a) => a.interiors), (i) => i);

/**
 * What the areas chart, then the plan: a row an area charts that the plan has too (a planned place
 * now built) takes the plan's row's place.
 */
function chart<T>(what: string, plan: readonly T[], built: readonly T[], key: (r: T) => string): readonly T[] {
  const mine = new Map(once(what, built, key).map((r) => [key(r), r]));
  const planned = new Set(plan.map(key));
  return [...built.filter((r) => !planned.has(key(r))), ...plan.map((r) => mine.get(key(r)) ?? r)];
}

/**
 * The world map: the plan (./atlas.ts) with each area's own zones, plates, sites and links. Everything
 * reads this one. The links are each area's, in road order, then the plan's between two areas: only the
 * zone overlay reads their order (game/atlas.ts), and draws the same for it.
 */
export const ATLAS: Atlas = {
  ...PLAN,
  zones: chart('zone', PLAN.zones, AREAS.flatMap((a) => a.atlas.zones), (z) => z.id),
  places: chart('place', PLAN.places, AREAS.flatMap((a) => a.atlas.places), (p) => p.id),
  sites: chart('site', PLAN.sites, AREAS.flatMap((a) => a.atlas.sites), (s) => s.name),
  links: [...AREAS.flatMap((a: Area) => a.atlas.links ?? []), ...PLAN.links],
};
