// The map schema (#1009): what a map is written as, types alone. It declares no value and nothing
// imports it as the game runs, so a change to it is erased before anything paints and sweeps no map
// (tools/kit/changed.ts, `EVERY_MAP`). What runs on a map is game/map.ts, which re-exports this. A
// type a rule owns is declared in the rule's module and given on here, so every type of the schema
// is had from this file alone.
import type { Facing } from './types.ts';
import type { RegionId } from './weather.ts';
import type { Crossing } from './atlas.ts';
import type { Season, Tide } from './calendar.ts';
import type { When } from './quests.ts';
import type { Interior, MapId, Flag } from '../content/index.ts';
import type { GuildId } from '../content/guilds.ts';
import type { SkillId } from './skills.ts';
import type { Mastery } from './mastery.ts';
import type { Clock } from './combat.ts';
import type { OUTDOORS } from './outdoors.ts';
import type { NpcQuest, Words, Choice, Answer } from './people.ts';
import type { Passage } from './passage.ts';
import type { Teaching } from './prestige.ts';
import type { Gift, Night } from './wilds.ts';

export type { NpcQuest, Words, Choice, Answer, Passage, Teaching, Gift, Night };

export type MapKind = 'town' | 'dungeon' | 'outdoor';

/**
 * What the floor of a cell is. Drives the floor colour outdoors and the passability rules. Hills,
 * farm and woods are named as the atlas names them (WorldTerrain), so the two agree square for square.
 * Woods is light woodland, walked through: a ground with trees about it, not a wall of them (`T`).
 * Dead wood is walked through as the woods are, its trees long dead: grey trunks and no green.
 * Crystal is the ground the glass trees stand on (`c`, each a tree that blocks as the forest's do).
 * The chasm is the Sunder's drop: seen across, never walked, and no wall.
 * Salt is the pans' white crust, walked as sand is; heather is moor, walked as grass is.
 * Tidal ground is the shore the sea leaves twice a day: sand at low water, water at high (`tideAt`).
 * Ash is the vents' fall, deep and loose, walked as slowly as hills; pine is the pinewoods, walked
 * through among the pines as the woods are; ice is a frozen lake, walked, with what lives under it.
 * A peak (`A`) and a cliff (`|`) are the range's rock, solid as the mountain is and climbed as it is,
 * by a Mountaineer and nobody else: a summit over the mountains, and an escarpment's sheer face.
 * Steppe (`s`) is the Wold's open dry grass, walked as grass is; dunes (`u`) are sand in ridges,
 * walked as slowly as hills; vines (`&`) are the shore's creepers hung from its trees, walked through
 * as the woods are. The volcano (`V`) is the cone's black rock and a vent (`@`) a mouth smoking in it,
 * both solid as the mountain is and climbed as it is, by a Mountaineer and nobody else.
 */
export type Terrain =
  | 'floor' | 'grass' | 'dirt' | 'road' | 'sand' | 'water' | 'deep' | 'swamp' | 'lava' | 'stone' | 'snow'
  | 'hills' | 'farm' | 'woods' | 'deadwood' | 'crystal' | 'chasm' | 'salt' | 'heather' | 'tidal'
  | 'ash' | 'pine' | 'ice'
  | 'peak' | 'cliff'
  | 'steppe' | 'dunes' | 'vines' | 'volcano' | 'vent';

/**
 * What stands in a cell. `wall` blocks movement and sight; billboards block movement, not sight;
 * `void` is where the world ends for now: no ground, no sky, nothing to cross or see through.
 */
export type Solid = 'none' | 'wall' | 'tree' | 'rock' | 'mountain' | 'pillar' | 'building' | 'void';

export type Door = 'none' | 'door' | 'locked' | 'secret';

export interface Cell {
  terrain: Terrain;
  solid: Solid;
  door: Door;
  /** Legend char, kept for content tools and the automap glyph. */
  ch: string;
  /**
   * A void cell's: the ground the world map paints there, which the view draws and the automap inks.
   * For every rule the cell is still the void: nothing crosses it or sees through it (#829).
   */
  look?: Cell;
}

/** A named square of a map that another map's exit lands on, and the facing it lands with (#993). */
export interface Anchor { x: number; y: number; facing: Facing }

/**
 * Where a map hands the party to another map. An area's exit names a map the areas list (`MapId`,
 * #994); a map as played names the outdoors in place of a zone map (`PlayedDef`, game/outdoors.ts).
 */
export interface Exit<To extends string = MapId> {
  x: number; y: number;
  to: To;
  /**
   * The anchor of `to` it lands on, by name: `start`, or one of `to`'s `anchors` (#993). An area's
   * map lands every exit so, through `anchored`, and writes no square: the maps' join fills `tx`,
   * `ty` and `tf` from the anchor (`landExits`, content/index.ts), and the game reads those.
   */
  at?: string;
  /** Where it lands: filled from `at` where the maps are joined, or written so off the areas' maps (the Rift samples' way out, a fixture). */
  tx: number; ty: number;
  /** Facing on arrival; default: keep. */
  tf?: Facing;
  /** Shown in the log on arrival. */
  label?: string;
  /** Party flags that must all be set before the exit opens; `blockedText` says why not. */
  needFlag?: Flag | readonly Flag[];
  /**
   * Closed while this holds, read afresh at every step, so it opens again once it stops holding
   * (Helmstow's gate to a company with an orcblood member, #157); `blockedText` says why.
   */
  shut?: When;
  /** The `shut` is over while this holds, read afresh at every step as `shut` is (#749). */
  lifts?: When;
  /**
   * There once this holds, as a presence is, and before that the square is no exit (#749). It is no
   * lock: it waits on the company's own answer where it stands (tools/tests/pillars.ts, `findLocks`).
   */
  after?: When;
  /**
   * The one exit from a town or a dungeon into another region (#749), marked with the two regions it
   * joins, from and to ('hearth kilns'): every other shares its region (tools/tests/weather.ts).
   */
  crosses?: string;
  blockedText?: string;
}

/**
 * The painted room a business shows in the viewport while the party is inside it (ui/interiors/).
 * One per business, so no two shops share a picture. Each area lists its own (src/content/).
 */
export type { Interior };

/**
 * A shrine's or a fountain's: `amount` (1) of `stat` to every member, once, or `resist`, an element
 * kept off every member for good or `until` the next rest (#555), or both; `done` is said after. It
 * wears a presence, as an event does: out of it, it is not there, and nothing is spent (the Tidefolk's
 * blessing, there once the Tide Bell is back on its frame, #554).
 */
interface Blessing extends Presence { x: number; y: number; id: string; name?: string; text: string; stat?: import('./party.ts').Stat; amount?: number; resist?: import('./party.ts').Blessed; done: string }

/**
 * What every business has: its room, and `hall` where it is also a guild's hall, which gives out
 * that guild's quests beside its own trade (game/guilds.ts; DESIGN §8). It wears a presence, as a
 * person does: a shut door is one gone `until` a flag, and a twin on its square `after` it is the
 * business changed (Helmstow after Act II, #157).
 */
interface Business extends Presence { x: number; y: number; name: string; interior: Interior; hall?: GuildId }

/** A thing in a cell the party can interact with by stepping on it or pressing the action key. */
export type Feature =
  /**
   * A sign: its words, said to every company that steps on it, or stands on it and presses Space.
   * `read` makes it an inscription in Kiln-script (game/inscriptions.ts): a second text, said after
   * the first only to a company with a reader, which keeps it read by its `id` in the map's `used`, as
   * a once-event is (a quest condition's `seen` names it). `marks` are the atlas places (`AtlasPlace`)
   * its reading puts on the world map.
   */
  | { kind: 'sign'; x: number; y: number; text: string; id?: string; read?: undefined; marks?: undefined }
  | { kind: 'sign'; x: number; y: number; text: string; id: string; read: string; marks?: string | readonly string[] }
  /**
   * An inn. `nights` makes it count them (Rime Lodge's, docs/areas/rimewater.md §4.3): each stay
   * sets the first of its flags not yet set, so the nights come in order, a flag a night
   * (game/party/conditions.ts `stayNight`).
   */
  | ({ kind: 'inn'; price: number; nights?: readonly Flag[] } & Business)
  | ({ kind: 'temple' } & Business)
  | ({ kind: 'shop'; stock: string[]; prices?: Readonly<Record<string, number>> } & Business)
  | ({ kind: 'guild'; classes: string[]; fee: number; maxTier?: number } & Business)
  | ({ kind: 'trainer'; maxLevel: number } & Business)
  /**
   * A chest, opened once with Space. `locked` (#857) opens to a Lockpick standing or a set of picks
   * carried, or to an iron key, which it spends, and to nothing else (`World.unlock`): never on the road,
   * whose locks are doors with their keys. `trapped` is declared and unused.
   */
  | { kind: 'chest'; x: number; y: number; id: string; gold: number; items: string[]; trapped?: boolean; locked?: true }
  /**
   * A person (game/people.ts). `lines` are the first meeting's, which sets `flag` (the hire) and
   * ends in `choice`; `quest` is the hand-ins, one or several; `says` the words once they hold.
   * `interior` makes the NPC a business you walk into (a tavern); a person in the street has none.
   * Where a person stands they stand only in their `when`, once `after` holds and until `until` does.
   * `passage` makes them a coachman or a boatman: once their words are said they sell the crossings
   * listed (game/passage.ts). `teaches` makes them a prestige's trainer: once their words are said
   * they offer it (game/prestige.ts). `skill` makes them a teacher of a secondary skill, as its
   * guild's halls are: once their words are said they offer it to the company's members
   * (game/skills.ts). `mastery` makes them a Master's: once their words are said they offer their
   * line's Master to the company's members of it (game/mastery.ts). `hall`, on a person with a room,
   * makes the tavern a guild's hall, as a business's does: a hall that does not look like one.
   */
  | ({ kind: 'npc'; x: number; y: number; name: string; lines: string[]; flag?: Flag | readonly Flag[]; quest?: NpcQuest | readonly NpcQuest[]; says?: readonly Words[]; choice?: Choice; interior?: Interior; hall?: GuildId; passage?: readonly Passage[]; teaches?: Teaching; skill?: SkillId; mastery?: Mastery } & Presence)
  /** A tear into a Rift (game/rifts.ts): stepped on, it takes the party through, as an exit does. */
  | { kind: 'rift'; x: number; y: number; id: string; to: string; tx: number; ty: number; tf?: Facing; label?: string }
  /** The wilderness features (game/wilds.ts). A shrine and a fountain are one shape, told apart by their words. */
  | ({ kind: 'shrine' } & Blessing)
  | ({ kind: 'fountain' } & Blessing)
  /** A cache under stones, given once, as a chest is. */
  | { kind: 'cairn'; x: number; y: number; id: string; name?: string; text?: string; gold: number; items: string[] }
  /** `text` is its look; the word `answer`, typed to its `riddle`, gives `gift` once, and `done` is said then and after. */
  | { kind: 'statue'; x: number; y: number; id: string; name?: string; text: string; riddle: string; answer: string; gift: Gift; done: string }
  /**
   * Where the party may rest though monsters are about, as often as it likes. `nights` makes it count
   * them, as an inn's do (#730): a rest there sets the first night not yet set, if its `after` holds,
   * so the nights come in order, a flag a night, and a night not yet due keeps the later ones back. The
   * rest is the night, eight hours at whatever hour, and the night's `says` are said on waking in place
   * of "The party rests. Morning comes."; a night with none says that. A rest where no night is due, and
   * a camp with no `nights`, are as they were.
   */
  | { kind: 'camp'; x: number; y: number; name?: string; text: string; nights?: readonly Night[] }
  /**
   * A den (game/dens.ts): it breeds `breeds`, its `brood` groups, back one a pace while it stands;
   * `keepers`, a group beside it that never leaves, guard it. `text` is its look, said when it is
   * first seen. Once the keepers are dead a step or Space puts `ask`, answered `burn` or `leave`;
   * burnt, it says `burnt`, gives its hoard (`gold`, `items`) and breeds no more, and `ruin` is said
   * thereafter. Groups are named by id, never by square, as the outdoors moves only the den.
   */
  | { kind: 'den'; x: number; y: number; id: string; name?: string; text: string; breeds: readonly string[]; keepers: string; brood: readonly string[]; ask: string; burn: string; leave?: string; burnt: string; ruin?: string; gold: number; items: string[] }
  | { kind: 'well'; x: number; y: number; text: string; heal?: boolean }
  /** Said on stepping in; `sets` is set as it is said (Hale gone from the Scarth once the Delta is reached, #156). */
  | ({ kind: 'event'; x: number; y: number; id: string; text: string; once?: boolean; sets?: Flag | readonly Flag[] } & Presence);

/**
 * A cell the party may not step onto until every flag is set, or while `shut` holds: a gated exit whose way on is simply
 * the next cell. The outdoors has these where an exit used to join one zone map to the next.
 */
export interface Gate {
  x: number; y: number;
  needFlag?: Flag | readonly Flag[];
  /** Closed while this holds, as an exit's `shut` is, unless `lifts` holds. */
  shut?: When;
  lifts?: When;
  /** Closed until this holds: the exit's `after` at a seam, where its square is the way across (#749). */
  after?: When;
  blockedText?: string;
}

/**
 * A zone map laid into the outdoors (see game/outdoors.ts): the rectangle of cells it covers, and
 * what those cells take from it.
 */
export interface MapZone {
  /** The zone map's id, which is what quests, tools and the atlas know the zone by. */
  id: string;
  name: string;
  /** Where the zone map's top-left cell sits, and its size. */
  x: number; y: number; w: number; h: number;
  band?: [number, number];
  region?: RegionId;
  palette?: Partial<MapPalette>;
  /** What the log says on crossing into the zone, by the id of the zone left: the old exit's arrival line. */
  enter?: Record<string, string>;
  /** The atlas zone the map lies in: what the crossing line names, and its own words, if it has any. */
  land?: { id: string; name: string; crossing?: Crossing };
}

/** A monster group placed on the map. `id` keys its instance state (dead, respawn) in MapState. */
export interface EncounterDef extends Presence {
  id: string;
  x: number; y: number;
  /** Monster def ids; up to 12. */
  monsters: string[];
  /**
   * How many of `monsters`, from the end, stand in the back rank: a blade reaches them only once the
   * fight's front is down, and those with no bow or spell wait till then (docs/MONSTERS.md §3.3).
   */
  back?: number;
  /** The monster id of the group's leader: once every leader in the fight is down, its people break. */
  leader?: string;
  /** Cells within which the group notices the party (manhattan). */
  aware?: number;
  /** false = stays put (a guardian). */
  roams?: boolean;
  /** In-game minutes before a killed group returns; 0 or absent = never. */
  respawn?: number;
  /**
   * The leave rule (#747): once its `until` holds the group is gone, standing or killed, as a person
   * is. It was not killed: its `slainText` is not said and its `sets` are not set.
   */
  leaves?: boolean;
  /** Said in the log when the party beats the group: what its death changes. */
  slainText?: string;
  /** Flags set as the party beats the group, with its `slainText`: what its death changes holds before the next step (#636). */
  sets?: Flag | readonly Flag[];
  /**
   * A question put when the company comes beside the group, before the fight, as a person's is (the
   * giants' toll, MONSTERS §8.1, #544): its refusal starts the fight, and once another answer's
   * flags are set the group stands aside for that company, never asking or fighting unless set on.
   */
  choice?: Choice;
  /**
   * Placed on ice, it lives under it (the pike): it moves only under the ice, strikes only a company
   * standing on the ice beside it and in the fight reaches only the front row over it.
   */
  under?: 'ice';
  /**
   * The Core's clock (combat/state.ts `Clock`, docs/MONSTERS.md §9.3, #748): while a monster the `panel`
   * names stands, the group's `leader` calls one of `calls` every `every` rounds, past the cap of three
   * groups and up to twelve monsters, and the light dims a step a round to `dims`, where it holds.
   */
  clock?: Clock & { calls: string };
  /**
   * A boss: the gate judges it at its map's floor and two levels above, and leaves it out of the day
   * (tools/tests/gate.ts).
   */
  boss?: true;
}

/**
 * A time to walk: the hours, the sky or the season. The parts given all hold; of a list, any one
 * will do. Read from the clock and the weather, so nothing is saved.
 */
export interface Hours {
  /** Night is daylight under a quarter, underground too; day the rest. */
  hours?: 'day' | 'night';
  /** Fog as the almanac reads it (0.35 and over), or snow falling or lying. Never underground. */
  sky?: 'fog' | 'snow';
  season?: Season | readonly Season[];
  /** High water or low, read from the clock (`tideAt`). */
  tide?: Tide;
}

/**
 * When a thing is in the world, for groups now and for events and people to wear as well; World's
 * `walks` and `ended` read it. `until` and `after` are the quest log's conditions.
 */
export interface Presence {
  /** Only in these hours; out of them it is not there, and comes back where it was. */
  when?: Hours | readonly Hours[];
  /**
   * Once this holds it is over. A person or an event is gone. A group stops coming back: one
   * standing stays until it is killed. A group that `leaves` (the leave rule, #747) is gone, standing
   * or killed; that is no kill, so it says no `slainText` and sets none of its `sets`. Read from the
   * flags, so nothing is saved: after a load it is gone still.
   */
  until?: When;
  /** Not there until this holds. */
  after?: When;
}

/**
 * A map. An area's is declared with its id (`MapDef<'cairns'>`), which keeps the id literal in the
 * `MapId` union (content/index.ts, #994). Its exits name the areas' maps, and `Off` besides: the
 * outdoors on a map as played (`PlayedDef`). A suite's fixture hands its own maps on through `fxMap`.
 */
export interface MapDef<Id extends string = string, Off extends string = never> {
  id: Id;
  name: string;
  kind: MapKind;
  /** Outdoors only: the floor tools/tests/density.ts holds it to. */
  density?: 'core' | 'country';
  rows: readonly string[];
  /** Extra legend entries for this map; merged over the kind's default legend. */
  legend?: Record<string, Partial<Cell>>;
  start: { x: number; y: number; facing: Facing };
  /**
   * The squares other maps' exits land on, by name (#993); the start is one more, named `start`, and
   * no anchor takes that name. An exit names one as its `at`.
   */
  anchors?: Readonly<Record<string, Anchor>>;
  exits?: Exit<MapId | Off>[];
  features?: Feature[];
  /**
   * Each secret door and the id of the event or sign on its near side that hints at it
   * (tools/tests/pillars.ts); an inscription's reading may be the hint (game/inscriptions.ts).
   */
  secrets?: { x: number; y: number; hint: string }[];
  encounters?: EncounterDef[];
  /** Wall and floor tints. */
  palette?: Partial<MapPalette>;
  /**
   * A town's or a dungeon's: stone wall squares that always hang the map's banner (`palette.banner`),
   * wherever else they fall by chance. The outdoors is laid from its zone maps without them, so an
   * outdoor map places none (tools/tests/art.ts).
   */
  banners?: readonly { x: number; y: number }[];
  /** No wall dressing, not even a banner: a Rift's walls are its material and nothing hangs on them (ui/viewport.ts). */
  bare?: boolean;
  /** Landmarks drawn tall over their building squares and seen from far off (`Landmark`). */
  landmarks?: readonly Landmark[];
  /** Party level the content is tuned for; shown on the map sign and used by respawn scaling. */
  band?: [number, number];
  /**
   * An enclave (#845): a place of its own beside the road, a dungeon entered from a box (a hollow, a
   * cave, a ruin), held to its own `band`, over its box's: a band or two for an enclave, the cap's
   * (30-32) for an artifact lair. The gate and the curve judge it at that band, out of its area's
   * figures; no step of the quest lies in it; its door says its band and how it feels (`enclaveLine`);
   * the pilot keeps out of one whose floor is over its company. Content, never saved.
   */
  enclave?: true;
  /**
   * The region whose climate and weather the map shares. Every map as written names one; the laid
   * outdoors names none, its zones do. No sky is lent: a World asked the sky of a square with none throws (#945).
   */
  region?: RegionId;
  /** Cells closed until flags are set. Written by game/outdoors.ts; a map as authored gates an exit instead. */
  gates?: Gate[];
  /** The outdoors only: the zone maps laid into it. Its cells take their name, band, region and palette from these. */
  zones?: MapZone[];
  /**
   * The outdoors only: what each square is drawn as, row for row with `rows`, in characters of the
   * shared legend. A void square is drawn as its look (`Cell.look`), or as the void where it is
   * `VOID_CH`; any other square's character is its own and not read. Written by game/outdoors.ts.
   */
  looks?: readonly string[];
}

/**
 * A map as played (content/maps.ts): an exit onto a zone map laid into the outdoors names the
 * outdoors in its place (game/outdoors.ts), so its exits are not the areas' alone (#994).
 */
export type PlayedDef = MapDef<string, typeof OUTDOORS>;

/** An exit as an area writes it (#993): `at`, an anchor of the map it leads to, in place of `tx`, `ty` and `tf`. */
export type Anchored = Omit<Exit, 'at' | 'tx' | 'ty' | 'tf'> & { at: string };

export interface MapPalette {
  wall: string;
  wallDark: string;
  floor: string;
  ceiling: string;
  door: string;
  /**
   * 'stone' is large rough blocks; 'brick' is small fired courses; 'smooth' is one face with no join in
   * it; 'tent' is felt, and outside a town a building's square and its door are a tent: a low felt
   * wall under a pitched cloth roof up to a crown, its door a flap (ui/viewport.ts).
   */
  wallStyle: 'stone' | 'brick' | 'smooth' | 'tent';
  /** 'vault' is stone overhead; 'beams' is a timbered ceiling (cellars, inns). */
  ceilingStyle: 'vault' | 'beams';
  /** Colour of hung banners on this map. */
  banner: string;
}

/**
 * A landmark: a building square drawn as what it is, tall, over the land and from far off. A
 * lighthouse's lamp is lit by night once the party holds its `lit` flag. A monastery is bell towers
 * over a wall, with no lamp and no `lit`; it stands inside its block of building squares, whose walls
 * hide its foot near to.
 */
export interface Landmark { x: number; y: number; kind: 'lighthouse' | 'monastery'; lit?: string }
