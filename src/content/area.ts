// The shape of an area: one step of the road of levels, with everything that is its own. Each lives
// in src/content/areas/<area>/ and is listed once, in road order, in src/content/index.ts.
import type { MapDef, Terrain, Feature, Door, EncounterDef } from '../game/map.ts';
import type { MonsterDef } from '../game/monsters.ts';
import type { Condition } from '../game/party.ts';
import type { ItemDef } from '../game/items.ts';
import type { QuestDef, Chapter } from '../game/quests.ts';
import type { GuildQuest } from '../game/guilds.ts';
import type { Climate } from '../game/weather.ts';
import type { AtlasZone, AtlasPlace, AtlasSite, SiteIcon } from '../game/atlas.ts';

export interface Area {
  /** Also the region its maps name for their weather (`MapDef.region`). */
  id: string;
  /** Its zone maps, towns and dungeons. A new game starts on the first area's first map. */
  maps: readonly MapDef[];
  /**
   * Its maps that pay outside any area's budget (EXPANSION §5.2): the deepest levels, past its band,
   * which the road never needs. Each is held to its own band, and no area's clear counts its xp or
   * gold (tools/tests/curve.ts).
   */
  outside?: readonly string[];
  /** Its monsters; any area's maps may place them. */
  monsters: readonly MonsterDef[];
  /** The drawings its monsters are drawn with: the MonsterSprite union is made of these. */
  sprites: readonly string[];
  /** Its items; any area's chests, shops and monsters may hold them. */
  items: readonly ItemDef[];
  /**
   * Its side quests, joined in road order after the one quest: what the company's journal says
   * about each quest as it moves, and what to do next. Every entry is keyed to something the save already
   * records (a flag an NPC sets, an item carried, a once-only event, a guardian killed, a map set
   * foot on), so the log needs no state of its own; tools/tests/quests.ts checks every key points at
   * something real and every page fits the screen.
   */
  quests: readonly QuestDef[];
  /**
   * Its chapter of the one quest (EXPANSION §5.8), keyed as `quests` is, each goal placed with `at`.
   * content/index.ts joins the chapters in road order. A reach area has none.
   */
  chapter?: Chapter;
  /**
   * Its guild quests, given out at the guilds' halls (game/guilds.ts). Each is in the quest log from
   * its taking, keyed to its own flags, so the same check holds it as the quests above.
   */
  guilds?: readonly GuildQuest[];
  /** The weather its maps share. */
  climate: Climate;
  /** Its businesses' painted rooms: the Interior union is made of these, and src/ui/interior.ts paints each. */
  interiors: readonly string[];
  /** What is new in it, which no area earlier on the road has (EXPANSION §5.4; tools/tests/pillars.ts). */
  novel: Novelty;
  /**
   * Its part of the world map: its zones (a built one lists its maps, each at its box of the
   * grid), the plates of its towns and dungeons, and its sites. Merged into ATLAS with the plan (atlas.ts).
   */
  atlas: { zones: readonly AtlasZone[]; places: readonly AtlasPlace[]; sites: readonly AtlasSite[] };
}

/**
 * What the suites hold of an area that is its own and no part of the game: written in the area's
 * checks.ts, which nothing in the game imports, found by its file as the runner finds a walkthrough
 * (tools/checks.ts). What describes one zone, group, monster or exit is a field of that instead
 * (`AtlasZone.road`, `reach` and `maxGroup`, `EncounterDef.boss`, `MonsterDef.offLine`, `Exit.crosses`).
 * Each suite reads these beside its own table and refuses a row in both, so a row moves one way (#897).
 */
export interface AreaChecks {
  /** What it owes, each row with the issue that pays it: reported as that issue's, not failed, until it holds. */
  owes?: Owes;
  /**
   * Its rungs of the ladder (EXPANSION §5.2): by a level, what a company has in its hands or its bag by
   * then. tools/harness.ts takes GEAR from the weapons, armour and shields, and KIT from the rest. A rung
   * is whole on the last area on the road whose items it holds (tools/tests/ladder.ts).
   */
  gear?: Readonly<Record<number, readonly string[]>>;
  /** How far over the next floor its clear leaves a company, held as built (`OVER_ROAD`, tools/tests/curve.ts). */
  overRoad?: { level: number; why: string };
  /** Its seams as built, each row as `SEAMS_AS_BUILT` writes it (tools/tests/outdoors.ts): a seam is the area's of the first box its key names. */
  seamsAsBuilt?: readonly SeamAsBuilt[];
  /** Its edges open on nothing, each row as `OPEN_ON_NOTHING` writes it (tools/tests/outdoors.ts): an edge is the area's whose box it is. */
  openOnNothing?: readonly OpenOnNothing[];
}

/** A seam of two built boxes that disagrees as built: the squares that fail each kind, exactly, written `'3-7 9'`, and why. */
export interface SeamAsBuilt { seam: string; walk?: string; water?: string; road?: string; way?: string; why: string }

/** An edge of a built box that faces no built box: the box's map and its side, the squares along it open to a walker, and why. */
export interface OpenOnNothing { edge: string; open: string; why: string }

/** What an area owes, by the table each kind of row stood in until it moved onto its area. */
export interface Owes {
  /** What a clear falls short of (`AreaCurve.owed`): `xp` (a member's share) and `gold` what a clear gives today, a floor. */
  curve?: { whose: string; why: string; xp?: number; gold?: number };
  /** A monster no map places yet, or a room no business opens into, by its id (`UNPLACED`, tools/tests/maps.ts). */
  unplaced?: Readonly<Record<string, string>>;
  /** A flag a condition reads before anything sets it, by the flag (`UNSET`, tools/tests/quests.ts). */
  unset?: Readonly<Record<string, string>>;
  /** A zone map the outdoors' start does not reach yet, by its id (`CUT_OFF`, tools/tests/outdoors.ts). */
  cutOff?: Readonly<Record<string, string>>;
  /**
   * Squares where a map and the atlas disagree, by the issue whose fix they wait on (`EDGES_OWED`,
   * tools/tests/pillars.ts): an issue may be owed by several areas, a square by one.
   */
  edges?: Readonly<Record<string, readonly string[]>>;
  /** Locks someone else fixes, by the issue that fixes them (`LOCKS_OWED`, tools/tests/pillars.ts): an issue may be owed by several areas, a lock by one. */
  locks?: Readonly<Record<string, readonly string[]>>;
}

/**
 * What an area claims is new in it. Families are the monster modules in src/ui/monsters/ (not
 * variants); terrain, the Terrain union; landmarks, the icons of its built sites on the world map.
 */
export interface Novelty {
  families: readonly string[];
  terrain: readonly Terrain[];
  mechanics: readonly Mechanic[];
  landmarks: readonly SiteIcon[];
}

/**
 * The mechanics an area can claim, all named in its data: a kind of feature or door, an inscription
 * in Kiln-script and a reading that marks the world map (`sign:read`, `sign:marks`, #538), a monster
 * that shoots, shrugs off a condition or inflicts a condition, a field an encounter uses. The list
 * grows with the systems.
 */
export type Mechanic =
  | `feature:${Feature['kind']}` | `door:${Exclude<Door, 'none'>}` | 'sign:read' | 'sign:marks'
  | 'monster:ranged' | 'monster:missile' | `immune:${Condition}` | `inflict:${NonNullable<MonsterDef['inflict']>['cond']}`
  | `encounter:${Exclude<keyof EncounterDef, 'id' | 'x' | 'y' | 'monsters'>}`;

/**
 * An area's end-to-end test, in src/content/areas/<area>/walkthrough.ts as `walkthrough`: it plays the
 * one quest's chapters up to its own, and its own, and checks each step with `ok`. tools/test.ts finds and runs it, and
 * awaits it if it is async; nothing in the game imports it, so it stays out of the build.
 */
export type Walkthrough = (ok: (cond: boolean, msg: string) => void) => void | Promise<void>;
