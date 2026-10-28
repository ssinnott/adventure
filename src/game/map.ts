// What runs on a map: the shared legend, the palettes and `GameMap`, which turns a map's rows into
// the cells the renderer, movement and monsters read. What a map is written as is game/mapdef.ts,
// types alone, re-exported here (#1009). No instance state lives here: what changed on a map
// (opened chests, dead groups, revealed automap) is in world.ts's MapState.
import type { Facing } from './types.ts';
import { FACING_DX, FACING_DY } from './types.ts';
import type { Tide } from './calendar.ts';
import type { MapId } from '../content/index.ts';
import type { OUTDOORS } from './outdoors.ts';
import type { MapKind, Terrain, Solid, Door, Cell, Exit, Feature, Gate, MapZone, EncounterDef, MapDef, PlayedDef, Anchored, MapPalette, Landmark } from './mapdef.ts';

export type * from './mapdef.ts';

/** Minutes a step onto hills costs over the usual six in the open. */
export const HILL_DRAG = 2;
/** Minutes a step onto slow ground costs over the usual six in the open: hills, and ash and dunes as much. */
export const DRAG: Partial<Record<Terrain, number>> = { hills: HILL_DRAG, ash: HILL_DRAG,
  dunes: HILL_DRAG,
};

/**
 * An exit written by its anchor, typed as the exit it is once the maps are joined: the join fills
 * its `tx`, `ty` and `tf` in place (`landExits`) before anything reads them.
 */
export const anchored = (e: Anchored): Exit => e as Exit;

/**
 * Lands every exit written by an anchor (#993): fills its `tx`, `ty` and `tf` in place from the
 * anchor its `at` names on the map it leads to, so that every reader reads the square and facing
 * as it always has. Refuses, by name, an `at` the landing map lacks, an anchor named twice and an
 * exit with both an `at` and a square. Returns the maps it was given.
 */
export function landExits<T extends readonly MapDef[]>(defs: T): T {
  const byId = new Map(defs.map((d) => [d.id, d]));
  for (const d of defs) if (d.anchors && Object.hasOwn(d.anchors, 'start')) throw new Error(`map ${d.id} names the anchor 'start' twice: its start is one`);
  const landed = new Set<Exit>();
  for (const d of defs) for (const e of d.exits ?? []) {
    if (e.at === undefined || landed.has(e)) continue;
    const name = `exit of ${d.id} at ${e.x},${e.y} to ${e.to}`;
    if (e.tx !== undefined || e.ty !== undefined || e.tf !== undefined) throw new Error(`${name} lands both at '${e.at}' and on a square`);
    const to = byId.get(e.to);
    const a = e.at === 'start' ? to?.start : to?.anchors && Object.hasOwn(to.anchors, e.at) ? to.anchors[e.at] : undefined;
    if (!a) throw new Error(`${name} lands at '${e.at}', and ${to ? `${e.to} has no such anchor` : 'no map has that id'}`);
    e.tx = a.x; e.ty = a.y; e.tf = a.facing;
    landed.add(e);
  }
  return defs;
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
  'a': cell('ash'),
  'p': cell('pine'),
  'i': cell('ice'),
  'T': cell('grass', 'tree'),
  'r': cell('dirt', 'rock'),
  'M': cell('stone', 'mountain'),
  'A': cell('peak', 'mountain'),
  '|': cell('cliff', 'mountain'),
  's': cell('steppe'), 'u': cell('dunes'), '&': cell('vines'), 'V': cell('volcano', 'mountain'), '@': cell('vent', 'mountain'),
  '"': cell('stone'),
  [VOID_CH]: cell('floor', 'void'),
};

/** Every void cell of a map is this one, or one of these to each look: nothing in the void ever changes. */
const VOID_CELL: Cell = Object.freeze({ ...LEGEND[VOID_CH], ch: VOID_CH });
const VOID_LOOKS = new Map<string, Cell>();

/** The void drawn as a character of the shared legend (`MapDef.looks`), or the bare void for none. */
function voidCell(look: string | undefined): Cell {
  if (look === undefined || look === VOID_CH) return VOID_CELL;
  let c = VOID_LOOKS.get(look);
  if (!c) VOID_LOOKS.set(look, (c = Object.freeze({ ...VOID_CELL, look: Object.freeze({ ...LEGEND[look], ch: look }) })));
  return c;
}

export class GameMap {
  readonly id: string;
  readonly name: string;
  readonly kind: MapKind;
  readonly width: number;
  readonly height: number;
  readonly cells: Cell[];
  readonly exits: readonly Exit<MapId | typeof OUTDOORS>[];
  readonly features: readonly Feature[];
  readonly encounters: readonly EncounterDef[];
  readonly gates: readonly Gate[];
  readonly zones: readonly MapZone[];
  readonly palette: MapPalette;
  readonly def: PlayedDef;
  /** Each zone's palette over the map's, in the zones' order. */
  private readonly zonePalettes: readonly MapPalette[];
  /** The squares the map places a banner on, as y * width + x. */
  private readonly banners: ReadonlySet<number>;
  readonly landmarks: readonly Landmark[];

  constructor(def: PlayedDef) {
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
        // Most of the outdoors is void, so its cells share one to each look rather than taking one apiece.
        const look = ch === VOID_CH ? def.looks?.[y]?.[x] : undefined;
        if (look !== undefined && look !== VOID_CH && !LEGEND[look]) throw new Error(`map ${def.id}: unknown look '${look}' at ${x},${y}`);
        this.cells[y * this.width + x] = ch === VOID_CH && base.solid === 'void' ? voidCell(look) : { ...base, ch };
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

  /**
   * Whether the cell stops the view of an eye standing on `eye`: a wall, a building, the mountain,
   * the void and a door from anywhere, and a hill from lower ground, not from another hill or a
   * mountain's top (#53). Billboards like trees, and the woods, never do. With no eye given, only
   * what stops the view from anywhere.
   */
  blocksView(x: number, y: number, eye?: { x: number; y: number }): boolean {
    const c = this.at(x, y);
    if (c.solid === 'wall' || c.solid === 'building' || c.solid === 'mountain' || c.solid === 'void' || c.door !== 'none') return true;
    if (!eye || c.terrain !== 'hills') return false;
    const e = this.at(eye.x, eye.y);
    return e.terrain !== 'hills' && e.solid !== 'mountain';
  }

  /**
   * Whether the cell stands taller than a hill, and is seen over one from below it: the mountain, a
   * landmark and the void as it is drawn (#53): the bare void, and a void whose look is a mountain;
   * one drawn as the sea or as land lies as low as they do (#829's looks).
   */
  overtops(x: number, y: number): boolean {
    const c = this.at(x, y), drawn = c.look ?? c;
    return drawn.solid === 'mountain' || drawn.solid === 'void' || !!this.landmarkAt(x, y);
  }

  /**
   * Whether walking is possible, given the party's terrain abilities and the tide; with no tide
   * given, tidal ground is read at low water, at its most open. A party afloat (Levitate) crosses the chasm.
   */
  passable(x: number, y: number, can: Can = {}): PassResult {
    return passableCell(this.at(x, y), can);
  }

  /** The way off the map on a square: an exit, or a tear into a Rift, which is walked through as one. */
  exitAt(x: number, y: number): Exit<string> | undefined {
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
/** What a party can cross: a swimmer, a mountaineer, iron keys, the tide and a float (`passable`). */
export interface Can { swim?: boolean; climb?: boolean; keys?: number; tide?: Tide; float?: boolean }

/**
 * `GameMap.passable` for a cell given, not read off a map: the map's own, or one as the automap
 * inks it, which is how the pilot's navigator reads it (app/pilot/route.ts).
 */
export function passableCell(c: Pick<Cell, 'terrain' | 'solid' | 'door'>, can: Can = {}): PassResult {
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

const OUT_OF_BOUNDS: Cell = Object.freeze({ terrain: 'floor', solid: 'wall', door: 'none', ch: '#' }) as Cell;
