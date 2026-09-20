// Map content and queries. A map is authored as rows of characters plus a legend; parseMap turns it
// into cells the renderer, movement and monsters read. No instance state lives here: what changed
// on a map (opened chests, dead groups, revealed automap) is in world.ts's MapState.
import type { Facing } from './types.ts';
import { FACING_DX, FACING_DY } from './types.ts';

export type MapKind = 'town' | 'dungeon' | 'outdoor';

/** What the floor of a cell is. Drives the floor colour outdoors and the passability rules. */
export type Terrain =
  | 'floor' | 'grass' | 'dirt' | 'road' | 'sand' | 'water' | 'deep' | 'swamp' | 'lava' | 'stone' | 'snow';

/** What stands in a cell. `wall` blocks movement and sight; billboards block movement, not sight. */
export type Solid = 'none' | 'wall' | 'tree' | 'rock' | 'mountain' | 'pillar' | 'building';

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
  /** A party flag that must be set before the exit opens; `blockedText` says why not. */
  needFlag?: string;
  blockedText?: string;
}

/** A thing in a cell the party can interact with by stepping on it or pressing the action key. */
export type Feature =
  | { kind: 'sign'; x: number; y: number; text: string }
  | { kind: 'inn'; x: number; y: number; name: string; price: number }
  | { kind: 'temple'; x: number; y: number; name: string }
  | { kind: 'shop'; x: number; y: number; name: string; stock: string[] }
  | { kind: 'guild'; x: number; y: number; name: string; classes: string[]; fee: number; maxTier?: number }
  | { kind: 'trainer'; x: number; y: number; name: string; maxLevel: number }
  | { kind: 'chest'; x: number; y: number; id: string; gold: number; items: string[]; trapped?: boolean }
  | { kind: 'npc'; x: number; y: number; name: string; lines: string[]; flag?: string; quest?: NpcQuest }
  | { kind: 'rift'; x: number; y: number; id: string; to: string; tx: number; ty: number }
  | { kind: 'well'; x: number; y: number; text: string; heal?: boolean }
  | { kind: 'event'; x: number; y: number; id: string; text: string; once?: boolean };

/** A hand-in: when the party carries `item` and `needFlag` is set, the NPC says `done`, pays, and sets `setFlag`. */
export interface NpcQuest {
  item: string;
  needFlag?: string;
  reward: number;
  done: string[];
  setFlag: string;
  /** What the NPC says once the quest is complete. */
  after: string[];
}

/** A monster group placed on the map. `id` keys its instance state (dead, respawn) in MapState. */
export interface EncounterDef {
  id: string;
  x: number; y: number;
  /** Monster def ids; up to 12. */
  monsters: string[];
  /** Cells within which the group notices the party (manhattan). */
  aware?: number;
  /** false = stays put (a guardian). */
  roams?: boolean;
  /** In-game minutes before a killed group returns; 0 or absent = never. */
  respawn?: number;
}

export interface MapDef {
  id: string;
  name: string;
  kind: MapKind;
  rows: readonly string[];
  /** Extra legend entries for this map; merged over the kind's default legend. */
  legend?: Record<string, Partial<Cell>>;
  start: { x: number; y: number; facing: Facing };
  exits?: Exit[];
  features?: Feature[];
  encounters?: EncounterDef[];
  /** Wall and floor tints. */
  palette?: Partial<MapPalette>;
  /** Party level the content is tuned for; shown on the map sign and used by respawn scaling. */
  band?: [number, number];
}

export interface MapPalette {
  wall: string;
  wallDark: string;
  floor: string;
  ceiling: string;
  door: string;
  /** 'stone' is large rough blocks; 'brick' is small fired courses. */
  wallStyle: 'stone' | 'brick';
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
  'T': cell('grass', 'tree'),
  'r': cell('dirt', 'rock'),
  'M': cell('stone', 'mountain'),
  '"': cell('stone'),
};

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
  readonly palette: MapPalette;
  readonly def: MapDef;

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
        this.cells[y * this.width + x] = { ...base, ch };
      }
    }
    this.exits = def.exits ?? [];
    this.features = def.features ?? [];
    this.encounters = def.encounters ?? [];
    this.palette = { ...DEFAULT_PALETTES[def.kind], ...(def.palette ?? {}) };
    for (const e of this.encounters) if (e.monsters.length > 12) throw new Error(`map ${def.id}: encounter ${e.id} has more than 12 monsters`);
  }

  inBounds(x: number, y: number): boolean { return x >= 0 && y >= 0 && x < this.width && y < this.height; }

  /** The cell at x,y; out of bounds is solid wall, so the edge of every map is closed. */
  at(x: number, y: number): Cell {
    if (!this.inBounds(x, y)) return OUT_OF_BOUNDS;
    return this.cells[y * this.width + x];
  }

  /** Whether sight passes through the cell (billboards like trees do not stop the view). */
  blocksView(x: number, y: number): boolean {
    const c = this.at(x, y);
    return c.solid === 'wall' || c.solid === 'building' || c.solid === 'mountain' || c.door !== 'none';
  }

  /** Whether walking is possible, given the party's terrain abilities. */
  passable(x: number, y: number, can: { swim?: boolean; climb?: boolean; keys?: number } = {}): PassResult {
    const c = this.at(x, y);
    if (c.solid === 'wall' || c.solid === 'building' || c.solid === 'pillar') return 'wall';
    if (c.solid === 'tree' || c.solid === 'rock') return 'blocked';
    if (c.solid === 'mountain') return can.climb ? 'ok' : 'mountain';
    if (c.terrain === 'deep') return 'deep';
    if (c.terrain === 'water') return can.swim ? 'ok' : 'water';
    if (c.door === 'locked') return can.keys ? 'unlock' : 'locked';
    return 'ok';
  }

  exitAt(x: number, y: number): Exit | undefined { return this.exits.find((e) => e.x === x && e.y === y); }
  featuresAt(x: number, y: number): Feature[] { return this.features.filter((f) => f.x === x && f.y === y); }

  /** The cell ahead of x,y in the given facing, at the given distance. */
  ahead(x: number, y: number, f: Facing, d = 1): { x: number; y: number } {
    return { x: x + FACING_DX[f] * d, y: y + FACING_DY[f] * d };
  }
}

export type PassResult = 'ok' | 'wall' | 'blocked' | 'mountain' | 'water' | 'deep' | 'locked' | 'unlock';

const OUT_OF_BOUNDS: Cell = Object.freeze({ terrain: 'floor', solid: 'wall', door: 'none', ch: '#' }) as Cell;
