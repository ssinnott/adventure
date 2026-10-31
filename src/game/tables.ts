// The tables src/game reads, as content builds them (#973, part of #848): content fills one (`TABLES`,
// src/content/index.ts) and the app hands it in, so src/game imports none. A function that reads one
// table takes it first (`item(items, id)`); one that reads two or more, or hands them on, takes them
// all (`defaultParty(tables, rng)`). The game, the world and the fight carry them (`g.tables`,
// `w.tables`, `CombatState.tables`). A suite that lends a def plays a table of its own (`tablesWith`,
// tools/kit/headless.ts), and nothing writes content's. The types are content's, taken by type alone.
import type { ItemDef } from './items.ts';
import type { MonsterDef } from './monsters.ts';
import type { SpellDef } from './spells.ts';
import type { LogQuest } from './quests.ts';
import type { GuildQuest } from './guilds.ts';
import type { Climate, RegionId } from './weather.ts';
import type { Atlas } from './atlas.ts';
import type { MapDef } from './mapdef.ts';
import type { GuildDef, GuildId } from '../content/guilds.ts';
import type { Wardstone } from '../content/stones.ts';
import type { Ending, EndingId } from '../content/endings.ts';
import type { MapId } from '../content/index.ts';
import type { AreaLook } from '../content/area.ts';

/** The items by id. */
export type Items = Readonly<Record<string, ItemDef>>;

/** Every table src/game takes, read-only. */
export interface Tables {
  readonly items: Items;
  readonly monsters: Readonly<Record<string, MonsterDef>>;
  readonly spells: Readonly<Record<string, SpellDef>>;
  /** The quest log's quests (`QUESTS`). */
  readonly quests: readonly LogQuest[];
  readonly guildQuests: readonly GuildQuest[];
  readonly guilds: Readonly<Record<GuildId, GuildDef>>;
  readonly climates: Readonly<Record<RegionId, Climate>>;
  /** Each region's look (#1097), which the view alone reads: its air over the sky. */
  readonly looks: Readonly<Record<RegionId, AreaLook>>;
  readonly stones: readonly Wardstone[];
  readonly endings: Readonly<Record<EndingId, Ending>>;
  readonly atlas: Atlas;
  /** The maps as written (`MAP_DEFS`). */
  readonly maps: readonly MapDef<MapId>[];
}
