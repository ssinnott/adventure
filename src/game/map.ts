// Map content and queries. A map is authored as rows of characters plus a legend; parseMap turns it
// into cells the renderer, movement and monsters read. No instance state lives here: what changed
// on a map (opened chests, dead groups, revealed automap) is in world.ts's MapState.
import type { Facing } from './types.ts';
import { FACING_DX, FACING_DY } from './types.ts';
import type { RegionId } from './weather.ts';
import type { Crossing } from './atlas.ts';
import type { Season, Tide } from './calendar.ts';
import type { When } from './quests.ts';
import type { Interior } from '../content/index.ts';
import type { GuildId } from '../content/guilds.ts';

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
 */
export type Terrain =
  | 'floor' | 'grass' | 'dirt' | 'road' | 'sand' | 'water' | 'deep' | 'swamp' | 'lava' | 'stone' | 'snow'
  | 'hills' | 'farm' | 'woods' | 'deadwood' | 'crystal' | 'chasm' | 'salt' | 'heather' | 'tidal';

/** Minutes a step onto hills costs over the usual six in the open. */
export const HILL_DRAG = 2;

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
}

/** Where a map hands the party to another map. */
export interface Exit {
  x: number; y: number;
  to: string;
  tx: number; ty: number;
  /** Facing on arrival; default: keep. */
  tf?: Facing;
  /** Shown in the log on arrival. */
  label?: string;
  /** Party flags that must all be set before the exit opens; `blockedText` says why not. */
  needFlag?: string | readonly string[];
  blockedText?: string;
}

/**
 * The painted room a business shows in the viewport while the party is inside it (ui/interiors/).
 * One per business, so no two shops share a picture. Each area lists its own (src/content/).
 */
export type { Interior };

/** What a statue gives for its riddle's answer: gold, items or a stat point to every member (game/wilds.ts). */
export interface Gift { gold?: number; items?: string[]; stat?: import('./party.ts').Stat; amount?: number }

/** A shrine's or a fountain's: `amount` (1) of `stat` to every member, once; `done` is said after. */
interface Blessing { x: number; y: number; id: string; name?: string; text: string; stat: import('./party.ts').Stat; amount?: number; done: string }

/**
 * What every business has: its room, and `hall` where it is also a guild's hall, which gives out
 * that guild's quests beside its own trade (game/guilds.ts; DESIGN §8).
 */
interface Business { x: number; y: number; name: string; interior: Interior; hall?: GuildId }

/** A thing in a cell the party can interact with by stepping on it or pressing the action key. */
export type Feature =
  | { kind: 'sign'; x: number; y: number; text: string; id?: string }
  | ({ kind: 'inn'; price: number } & Business)
  | ({ kind: 'temple' } & Business)
  | ({ kind: 'shop'; stock: string[]; prices?: Readonly<Record<string, number>> } & Business)
  | ({ kind: 'guild'; classes: string[]; fee: number; maxTier?: number } & Business)
  | ({ kind: 'trainer'; maxLevel: number } & Business)
  | { kind: 'chest'; x: number; y: number; id: string; gold: number; items: string[]; trapped?: boolean }
  /**
   * A person (game/people.ts). `lines` are the first meeting's, which sets `flag` (the hire) and
   * ends in `choice`; `quest` is the hand-ins, one or several; `says` the words once they hold.
   * `interior` makes the NPC a business you walk into (a tavern); a person in the street has none.
   * Where a person stands they stand only in their `when`, once `after` holds and until `until` does.
   * `passage` makes them a coachman or a boatman: once their words are said they sell the crossings
   * listed (game/passage.ts). `teaches` makes them a prestige's trainer: once their words are said
   * they offer it (game/prestige.ts). `hall`, on a person with a room, makes the tavern a guild's
   * hall, as a business's does: a hall that does not look like one.
   */
  | ({ kind: 'npc'; x: number; y: number; name: string; lines: string[]; flag?: string | readonly string[]; quest?: NpcQuest | readonly NpcQuest[]; says?: readonly Words[]; choice?: Choice; interior?: Interior; hall?: GuildId; passage?: readonly Passage[]; teaches?: Teaching } & Presence)
  /** A tear into a Rift (game/rifts.ts): stepped on, it takes the party through, as an exit does. */
  | { kind: 'rift'; x: number; y: number; id: string; to: string; tx: number; ty: number; tf?: Facing; label?: string }
  /** The wilderness features (game/wilds.ts). A shrine and a fountain are one shape, told apart by their words. */
  | ({ kind: 'shrine' } & Blessing)
  | ({ kind: 'fountain' } & Blessing)
  /** A cache under stones, given once, as a chest is. */
  | { kind: 'cairn'; x: number; y: number; id: string; name?: string; text?: string; gold: number; items: string[] }
  /** `text` is its look; the word `answer`, typed to its `riddle`, gives `gift` once, and `done` is said then and after. */
  | { kind: 'statue'; x: number; y: number; id: string; name?: string; text: string; riddle: string; answer: string; gift: Gift; done: string }
  /** Where the party may rest though monsters are about, as often as it likes. */
  | { kind: 'camp'; x: number; y: number; name?: string; text: string }
  /**
   * A den (game/dens.ts): it breeds `breeds`, its `brood` groups, back one a pace while it stands;
   * `keepers`, a group beside it that never leaves, guard it. `text` is its look, said when it is
   * first seen. Once the keepers are dead a step or Space puts `ask`, answered `burn` or `leave`;
   * burnt, it says `burnt`, gives its hoard (`gold`, `items`) and breeds no more, and `ruin` is said
   * thereafter. Groups are named by id, never by square, as the outdoors moves only the den.
   */
  | { kind: 'den'; x: number; y: number; id: string; name?: string; text: string; breeds: readonly string[]; keepers: string; brood: readonly string[]; ask: string; burn: string; leave?: string; burnt: string; ruin?: string; gold: number; items: string[] }
  | { kind: 'well'; x: number; y: number; text: string; heal?: boolean }
  | ({ kind: 'event'; x: number; y: number; id: string; text: string; once?: boolean } & Presence);

/**
 * A cell the party may not step onto until every flag is set: a gated exit whose way on is simply
 * the next cell. The outdoors has these where an exit used to join one zone map to the next.
 */
export interface Gate {
  x: number; y: number;
  needFlag: string | readonly string[];
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

/**
 * A hand-in: the first time the party meets the NPC carrying `item`, the NPC takes it, says `done`
 * (or `early`, to a company they never hired), pays and sets `setFlag`. See game/people.ts.
 */
export interface NpcQuest {
  item: string;
  /** Gold paid; 0 pays nothing and says no gold line. */
  reward: number;
  /** What the NPC says taking the item from a company they never hired; `done` if not given. */
  early?: string[];
  done: string[];
  setFlag: string;
  /** What the NPC says once the quest is complete; of several hand-ins, the last done that has any. */
  after?: string[];
}

/**
 * A prestige a person teaches (game/prestige.ts; DESIGN §5): the class's `prestige`th, to a member of
 * `cls` at its level who has the one before, for its price; the third for the quest `done`, which
 * must hold. Once their words are said, they offer it to the company's members of the class.
 */
export interface Teaching {
  cls: import('./party.ts').ClassId;
  prestige: 1 | 2 | 3;
  /** The third prestige's quest, done: the trainer teaches it once this holds. */
  done?: When;
  /** The id of the quest the trainer asks for the third; once it begins, seeking them is done (game/seeking.ts). */
  asks?: string;
  /** The journal's line when a member is to seek them, in the voice of the place; the system's own when absent. */
  seek?: string;
}

/**
 * A crossing a person sells (game/passage.ts; EXPANSION §2.1): a coach or a boat to `to`, a map (a
 * zone map's cells count), landing on `x`,`y`. It leaves at the hour `departs`, every day, and lands
 * `days` midnights later at the hour `arrives`: a boat that sails at 20 and lands at 6 is one. The
 * fare is the company's, not each member's, and pays its board: the company lands rested, as from
 * an inn. Open to anyone with the fare; `half` halves it once it holds, and `free` waives it.
 */
export interface Passage {
  to: string; x: number; y: number;
  /** Facing on landing; default: keep. */
  facing?: Facing;
  /** What the menu calls the far end. */
  name: string;
  by: 'coach' | 'boat';
  fare: number;
  departs: number;
  days: number;
  arrives: number;
  /** Said on landing; the passage's own line when absent. */
  label?: string;
  /** The seller's words to a company under the far end's floor, in place of the passage's own. */
  warning?: string;
  /** Once this holds the crossing costs nothing (#56's 22 makes the smugglers' boat free). */
  free?: When;
  /** Once this holds the fare is halved, rounded down (the Compact's boat for a member, EXPANSION §2.2); `free` beats it. */
  half?: When;
}

/**
 * What a person says once it holds, in place of their first meeting's lines: `after` and `until`
 * are the quest log's conditions and `when` the hours, as a group wears them. The first that holds
 * is said; it sets `sets` and may end in `choice`.
 */
export interface Words extends Presence {
  lines: readonly string[];
  sets?: string | readonly string[];
  choice?: Choice;
}

/** A question a person puts after their words, answered through the choice screen. Put until one answer's flags are set. */
export interface Choice {
  ask: string;
  answers: readonly Answer[];
}

/** An answer: it sets its flags, hands the company `gives` if it has an item and the person `says` it. */
export interface Answer {
  label: string;
  sets?: string | readonly string[];
  gives?: string;
  says: readonly string[];
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
  /** Said in the log when the party beats the group: what its death changes. */
  slainText?: string;
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
   * Once this holds it is over. A group stops coming back: one standing stays until it is killed.
   * A person or an event is gone.
   */
  until?: When;
  /** Not there until this holds. */
  after?: When;
}

export interface MapDef {
  id: string;
  name: string;
  kind: MapKind;
  /** Outdoors only: the floor tools/tests/density.ts holds it to. */
  density?: 'core' | 'country';
  rows: readonly string[];
  /** Extra legend entries for this map; merged over the kind's default legend. */
  legend?: Record<string, Partial<Cell>>;
  start: { x: number; y: number; facing: Facing };
  exits?: Exit[];
  features?: Feature[];
  /** Each secret door and the id of the event or sign on its near side that hints at it (tools/tests/pillars.ts). */
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
  /** The region whose climate and weather the map shares; the Foreland when absent. */
  region?: RegionId;
  /** Cells closed until flags are set. Written by game/outdoors.ts; a map as authored gates an exit instead. */
  gates?: Gate[];
  /** The outdoors only: the zone maps laid into it. Its cells take their name, band, region and palette from these. */
  zones?: MapZone[];
}

export interface MapPalette {
  wall: string;
  wallDark: string;
  floor: string;
  ceiling: string;
  door: string;
  /** 'stone' is large rough blocks; 'brick' is small fired courses; 'smooth' is one face with no join in it. */
  wallStyle: 'stone' | 'brick' | 'smooth';
  /** 'vault' is stone overhead; 'beams' is a timbered ceiling (cellars, inns). */
  ceilingStyle: 'vault' | 'beams';
  /** Colour of hung banners on this map. */
  banner: string;
}

export const DEFAULT_PALETTES: Record<MapKind, MapPalette> = {
  town:    { wall: '#e0cfa8', wallDark: '#a8906a', floor: '#a89068', ceiling: '#000000', door: '#6b4426', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#a83a2a' },
  dungeon: { wall: '#8a8492', wallDark: '#5c5866', floor: '#4a4650', ceiling: '#3a3640', door: '#6b4426', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#3a5aa0' },
  outdoor: { wall: '#9a9080', wallDark: '#6a6254', floor: '#4c9a3a', ceiling: '#000000', door: '#6b4426', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#a83a2a' },
};

const cell = (terrain: Terrain, solid: Solid = 'none', door: Door = 'none'): Cell => ({ terrain, solid, door, ch: '' });

/** The legend character for the void: the outdoors is made of it wherever no zone map is laid yet. */
export const VOID_CH = '%';

/** The shared legend. A map's `legend` may override or add characters. */
export const LEGEND: Record<string, Cell> = {
  '#': cell('floor', 'wall'),
  '.': cell('floor'),
  ' ': cell('floor', 'wall'),
  'D': cell('floor', 'none', 'door'),
  'L': cell('floor', 'none', 'locked'),
  'S': cell('floor', 'none', 'secret'),
  'o': cell('floor', 'pillar'),
  'B': cell('floor', 'building'),
  ',': cell('grass'),
  ':': cell('dirt'),
  '=': cell('road'),
  '_': cell('sand'),
  '~': cell('water'),
  'W': cell('deep'),
  'w': cell('swamp'),
  '!': cell('lava'),
  '*': cell('snow'),
  '^': cell('hills'),
  'f': cell('farm'),
  't': cell('woods'),
  'd': cell('deadwood'),
  'c': cell('crystal', 'tree'),
  'v': cell('chasm'),
  '-': cell('salt'),
  'h': cell('heather'),
  ';': cell('tidal'),
  'T': cell('grass', 'tree'),
  'r': cell('dirt', 'rock'),
  'M': cell('stone', 'mountain'),
  '"': cell('stone'),
  [VOID_CH]: cell('floor', 'void'),
};

/** Every void cell of a map is this one: nothing in the void ever changes. */
const VOID_CELL: Cell = Object.freeze({ ...LEGEND[VOID_CH], ch: VOID_CH });

/**
 * A landmark: a building square drawn as what it is, tall, over the land and from far off. A
 * lighthouse's lamp is lit by night once the party holds its `lit` flag.
 */
export interface Landmark { x: number; y: number; kind: 'lighthouse'; lit?: string }

export class GameMap {
  readonly id: string;
  readonly name: string;
  readonly kind: MapKind;
  readonly width: number;
  readonly height: number;
  readonly cells: Cell[];
  readonly exits: readonly Exit[];
  readonly features: readonly Feature[];
  readonly encounters: readonly EncounterDef[];
  readonly gates: readonly Gate[];
  readonly zones: readonly MapZone[];
  readonly palette: MapPalette;
  readonly def: MapDef;
  /** Each zone's palette over the map's, in the zones' order. */
  private readonly zonePalettes: readonly MapPalette[];
  /** The squares the map places a banner on, as y * width + x. */
  private readonly banners: ReadonlySet<number>;
  readonly landmarks: readonly Landmark[];

  constructor(def: MapDef) {
    this.def = def;
    this.id = def.id; this.name = def.name; this.kind = def.kind;
    this.height = def.rows.length;
    this.width = Math.max(...def.rows.map((r) => r.length));
    const legend: Record<string, Cell> = { ...LEGEND };
    for (const [k, v] of Object.entries(def.legend ?? {})) legend[k] = { ...(LEGEND[k] ?? cell('floor')), ...v, ch: k };
    this.cells = new Array(this.width * this.height);
    for (let y = 0; y < this.height; y++) {
      const row = def.rows[y];
      for (let x = 0; x < this.width; x++) {
        const ch = x < row.length ? row[x] : '#';
        const base = legend[ch];
        if (!base) throw new Error(`map ${def.id}: unknown legend char '${ch}' at ${x},${y}`);
        // Most of the outdoors is void, so its cells share one rather than taking one apiece.
        this.cells[y * this.width + x] = ch === VOID_CH && base.solid === 'void' ? VOID_CELL : { ...base, ch };
      }
    }
    this.exits = def.exits ?? [];
    this.features = def.features ?? [];
    this.encounters = def.encounters ?? [];
    this.gates = def.gates ?? [];
    this.zones = def.zones ?? [];
    this.palette = { ...DEFAULT_PALETTES[def.kind], ...(def.palette ?? {}) };
    this.zonePalettes = this.zones.map((z) => ({ ...this.palette, ...(z.palette ?? {}) }));
    this.banners = new Set((def.banners ?? []).map((b) => b.y * this.width + b.x));
    this.landmarks = def.landmarks ?? [];
    for (const e of this.encounters) if (e.monsters.length > 12) throw new Error(`map ${def.id}: encounter ${e.id} has more than 12 monsters`);
  }

  inBounds(x: number, y: number): boolean { return x >= 0 && y >= 0 && x < this.width && y < this.height; }

  /** The cell at x,y; out of bounds is solid wall, so the edge of every map is closed. */
  at(x: number, y: number): Cell {
    if (!this.inBounds(x, y)) return OUT_OF_BOUNDS;
    return this.cells[y * this.width + x];
  }

  /** Whether the map places a banner on x,y (`MapDef.banners`). */
  bannerAt(x: number, y: number): boolean { return this.inBounds(x, y) && this.banners.has(y * this.width + x); }
  landmarkAt(x: number, y: number): Landmark | undefined { return this.landmarks.find((l) => l.x === x && l.y === y); }

  /** The zone a cell lies in, on the outdoors; undefined anywhere else. */
  zoneAt(x: number, y: number): MapZone | undefined {
    return this.zones.find((z) => x >= z.x && y >= z.y && x < z.x + z.w && y < z.y + z.h);
  }

  /** The colours a cell is painted in: its zone's, on the outdoors. */
  paletteAt(x: number, y: number): MapPalette {
    const z = this.zoneAt(x, y);
    return z ? this.zonePalettes[this.zones.indexOf(z)] : this.palette;
  }

  /** Whether sight passes through the cell (billboards like trees do not stop the view). */
  blocksView(x: number, y: number): boolean {
    const c = this.at(x, y);
    return c.solid === 'wall' || c.solid === 'building' || c.solid === 'mountain' || c.solid === 'void' || c.door !== 'none';
  }

  /**
   * Whether walking is possible, given the party's terrain abilities and the tide; with no tide
   * given, tidal ground is read at low water, at its most open. A party afloat (Levitate) crosses the chasm.
   */
  passable(x: number, y: number, can: { swim?: boolean; climb?: boolean; keys?: number; tide?: Tide; float?: boolean } = {}): PassResult {
    const c = this.at(x, y);
    if (c.solid === 'void') return 'void';
    if (c.solid === 'wall' || c.solid === 'building' || c.solid === 'pillar') return 'wall';
    if (c.solid === 'tree' || c.solid === 'rock') return 'blocked';
    if (c.solid === 'mountain') return can.climb ? 'ok' : 'mountain';
    if (c.terrain === 'deep') return 'deep';
    if (c.terrain === 'chasm') return can.float ? 'ok' : 'chasm';
    if (c.terrain === 'water') return can.swim ? 'ok' : 'water';
    // At high water tidal ground is water: a swimmer wades it, and nobody else.
    if (c.terrain === 'tidal' && can.tide === 'high') return can.swim ? 'ok' : 'tide';
    if (c.door === 'locked') return can.keys ? 'unlock' : 'locked';
    return 'ok';
  }

  /** The way off the map on a square: an exit, or a tear into a Rift, which is walked through as one. */
  exitAt(x: number, y: number): Exit | undefined {
    return this.exits.find((e) => e.x === x && e.y === y) ?? this.features.find((f): f is Extract<Feature, { kind: 'rift' }> => f.kind === 'rift' && f.x === x && f.y === y);
  }
  gateAt(x: number, y: number): Gate | undefined { return this.gates.find((g) => g.x === x && g.y === y); }
  featuresAt(x: number, y: number): Feature[] { return this.features.filter((f) => f.x === x && f.y === y); }

  /** The cell ahead of x,y in the given facing, at the given distance. */
  ahead(x: number, y: number, f: Facing, d = 1): { x: number; y: number } {
    return { x: x + FACING_DX[f] * d, y: y + FACING_DY[f] * d };
  }
}

export type PassResult = 'ok' | 'wall' | 'blocked' | 'mountain' | 'water' | 'deep' | 'chasm' | 'tide' | 'locked' | 'unlock' | 'void';

const OUT_OF_BOUNDS: Cell = Object.freeze({ terrain: 'floor', solid: 'wall', door: 'none', ch: '#' }) as Cell;
