// The world: which map the party is on, where it stands, what time it is, and what has changed on
// each map. Movement, the clock, the weather's reach into play, automap reveal, roaming monster
// groups and encounter triggers live here. The outdoors is one map (game/outdoors.ts), so outdoors
// the party's zone, not its map, says where it is, what the weather does and what the log calls
// the place. Pure with respect to rendering and input; the Game drives it and reads the results.
import type { RngInstance } from '../lib/engine/rng.ts';
import { GameMap, DRAG } from './map.ts';
import type { Feature, Exit, EncounterDef, Door, MapZone, Cell, Hours, Presence } from './map.ts';
import type { Facing } from './types.ts';
import { FACING_DX, FACING_DY, turnLeft, turnRight, turnBack, manhattan } from './types.ts';
import { partyCan, takeItem, isDown, hasTrait, companyLevel } from './party.ts';
import { monster } from './monsters.ts';
import type { Party } from './party.ts';
import { MINUTES_PER_DAY, dateAt, daylightAt, sunTimes, longDate, seasonName, clock, tideAt } from './calendar.ts';
import type { CalendarDate, Tide } from './calendar.ts';
import { weatherAt, classify, isSnowy, skyNews, weatherSight, snowDrag, rangedPenalty, rangedNote, fairStart, tempWord, SKY_NAMES } from './weather.ts';
import type { Climate, RegionId, Weather, SkyState } from './weather.ts';
import { CLIMATES } from '../content/index.ts';
import { holds } from './quests.ts';
import { pace, denLooks, densOf } from './dens.ts';
import { stonesRestored, steadier } from './stones.ts';
import { signLine, signSays } from './inscriptions.ts';

export { MINUTES_PER_DAY };
export const START_MINUTES = 7 * 60;
/** The weather seed of a save made before there was weather. */
export const LEGACY_WEATHER_SEED = 0x5ca1d;

export interface GroupState { x: number; y: number; /** Minute the group was killed, or -1 while alive. */ dead: number; }

export interface MapState {
  /** A bit per cell, set once seen, 32 cells to a number (see `seen`), so the whole outdoors saves small. */
  explored: number[];
  /** Feature and event ids used up. */
  used: Record<string, 1>;
  groups: Record<string, GroupState>;
  /** Door cells changed by play ("x,y" -> door), re-applied to the map on load. */
  doors: Record<string, Door>;
}

export interface WorldState {
  mapId: string;
  x: number; y: number; facing: Facing;
  minutes: number;
  maps: Record<string, MapState>;
  /** Steps of magical light remaining. */
  light: number;
  /** Steps during which the groups just fled from will not re-engage. */
  truce: number;
  truceGroups: string[];
  steps: number;
  /** The town map last stood in; Town Portal returns here. Absent in older saves: Helmstow. */
  lastTown?: string;
  /** What the weather is made from: the same seed brings the same skies. Absent in older saves. */
  weatherSeed?: number;
  /** The zones of the outdoors the party has set foot in, first first. Absent in older saves. */
  zones?: string[];
  /** The monster defs the company has seen or fought, first first, so each look is said once. Absent in older saves. */
  met?: string[];
  /** Steps left of Walk on Water, which bears the party over shallow water as a swimmer; a fight ends it. Absent: none. */
  walk?: number;
  /** Steps left of Levitate, which floats the party over the chasm. Absent: none. */
  float?: number;
  /** Waymark's mark, on an outdoor map the party stood on. Absent: none set. */
  mark?: { mapId: string; x: number; y: number; facing: Facing };
}

/** Whether cell `i` is set in a map's explored bits. */
export const seen = (bits: readonly number[], i: number): boolean => (((bits[i >> 5] ?? 0) >>> (i & 31)) & 1) === 1;
const see = (bits: number[], i: number): void => { bits[i >> 5] = (bits[i >> 5] ?? 0) | (1 << (i & 31)); };
const bitsFor = (cells: number): number[] => new Array(Math.ceil(cells / 32)).fill(0);

export type MoveResult =
  | { kind: 'moved'; messages: string[]; encounter?: string[]; arrived?: Exit }
  | { kind: 'blocked'; reason: string }
  | { kind: 'turned' };

export interface LiveGroup { def: EncounterDef; state: GroupState; }

/** Fog as the almanac reads it, and snow lying as it does. */
export const FOG = 0.35, SNOW_LYING = 0.15;

/**
 * Whether a time to walk holds at a minute, under a sky (null underground, where there is none).
 * Of a list any one will do, and an entry's parts all hold.
 */
export function hoursHold(when: Hours | readonly Hours[], minutes: number, weather: Weather | null): boolean {
  return [when].flat().some((h) => {
    if (h.hours && (daylightAt(minutes) < 0.25 ? 'night' : 'day') !== h.hours) return false;
    if (h.season && ![h.season].flat().includes(dateAt(minutes).season)) return false;
    if (h.tide && tideAt(minutes) !== h.tide) return false;
    if (h.sky === 'fog' && !(weather && weather.fog >= FOG)) return false;
    if (h.sky === 'snow' && !(weather && (isSnowy(classify(weather).sky) || weather.cover >= SNOW_LYING))) return false;
    return true;
  });
}

/** How deep and how wide the first-person view reaches: what the viewport draws, and what is seen. */
export const VIEW_DEPTH = 4, VIEW_LATERAL = 3;

/** Map coordinates of the cell at depth d, lateral l relative to the party. */
export function viewCell(px: number, py: number, f: Facing, d: number, l: number): { x: number; y: number } {
  const rf = ((f + 1) & 3) as Facing;
  return { x: px + FACING_DX[f] * d + FACING_DX[rf] * l, y: py + FACING_DY[f] * d + FACING_DY[rf] * l };
}

/** What is drawn as faces rather than as a floor and a sprite: walls, buildings, doors, and the void. */
export function isSolidWall(c: Cell): boolean { return c.solid === 'wall' || c.solid === 'building' || c.solid === 'void' || c.door !== 'none'; }

/** Whether the cell at (d, l) can be seen from the eye: walk the straight line and stop at walls. */
export function lineOfSight(map: GameMap, px: number, py: number, f: Facing, d: number, l: number): boolean {
  const steps = Math.max(d, Math.abs(l)) * 2;
  let lastD = 0, lastL = 0;
  for (let i = 1; i < steps; i++) {
    const t = i / steps;
    const dd = Math.round(d * t), ll = Math.round(l * t);
    if (dd === lastD && ll === lastL) continue;
    if (dd === d && ll === l) break;
    lastD = dd; lastL = ll;
    const c = viewCell(px, py, f, dd, ll);
    if (map.blocksView(c.x, c.y)) return false;
  }
  return true;
}

/** The most figures a group is drawn as while exploring. */
export const DRAWN_MAX = 3;
/**
 * The monsters a group is drawn as while exploring, to three: each kind once, in the order they
 * stand, then the rest in order, so no kind of the first three is hidden behind copies of another.
 */
export function groupDrawn(monsters: readonly string[]): string[] {
  const kinds = [...new Set(monsters)], out = kinds.slice(0, DRAWN_MAX), rest = [...monsters];
  for (const k of out) rest.splice(rest.indexOf(k), 1);
  return [...out, ...rest].slice(0, DRAWN_MAX);
}

// A sign as the log shows it: game/inscriptions.ts has it, beside an inscription's reading.
export { signLine };

export class World {
  readonly maps: Record<string, GameMap>;
  state: WorldState;
  party: Party;
  rng: RngInstance;

  /** The sky as the party last saw it, for the log; null underground or before the first look. Not saved. */
  sky: SkyState | null = null;
  private cached: { seed: number; minutes: number; region: RegionId; weather: Weather } | null = null;
  /** The last line crossed between zone maps, and when: a step straight back over it says no more. Not saved. */
  private lastCross?: { from: string; to: string; at: number };
  /** The weather of every region a group has asked after, this minute: liveGroups runs every frame. */
  private skies: { seed: number; minutes: number; by: Map<RegionId, Weather> } | null = null;

  constructor(maps: Record<string, GameMap>, party: Party, rng: RngInstance, state?: WorldState) {
    this.maps = maps; this.party = party; this.rng = rng;
    if (state) this.state = state;
    else {
      const first = Object.values(maps)[0];
      this.state = { mapId: first.id, x: first.def.start.x, y: first.def.start.y, facing: first.def.start.facing, minutes: START_MINUTES, maps: {}, light: 0, truce: 0, truceGroups: [], steps: 0, zones: [] };
      // The company sets out on a dry, clear morning: draw seeds until the first hours are fair.
      let seed = 0;
      for (let i = 0; i < 64; i++) { seed = rng.int(1, 0x7ffffffe); if (fairStart(seed, START_MINUTES, CLIMATES[first.def.region ?? 'shelf'])) break; }
      this.state.weatherSeed = seed;
    }
    this.state.weatherSeed ??= LEGACY_WEATHER_SEED;
    this.state.zones ??= [];
    this.state.met ??= [];
    for (const id of Object.keys(this.state.maps)) this.ensureMapState(id);
    this.ensureMapState(this.state.mapId);
    this.tread();
    this.reveal();
  }

  get map(): GameMap { return this.maps[this.state.mapId]; }
  get mapState(): MapState { return this.state.maps[this.state.mapId]; }

  ensureMapState(id: string): MapState {
    const m = this.maps[id];
    if (!m) throw new Error(`unknown map '${id}'`);
    const ms = (this.state.maps[id] ??= { explored: bitsFor(m.width * m.height), used: {}, groups: {}, doors: {} });
    // A group the map has gained since the save was made stands where the map puts it.
    for (const e of m.encounters) ms.groups[e.id] ??= { x: e.x, y: e.y, dead: -1 };
    // A door changed by play goes back only where the map still has a locked or secret door; one that
    // has moved is left in the save, not applied to a wall, a void or off the map.
    for (const [k, d] of Object.entries(ms.doors)) {
      const [x, y] = k.split(',').map(Number), c = m.at(x, y);
      if (c.door === 'locked' || c.door === 'secret') c.door = d;
    }
    return ms;
  }

  /**
   * Where a cell of a map as written is played: a zone map's cells are the outdoors', where the
   * zone sits; any other map's are its own. Lets tools and tests name the Foreland.
   */
  locate(mapId: string, x: number, y: number): { mapId: string; x: number; y: number } {
    if (!this.maps[mapId]) {
      for (const m of Object.values(this.maps)) {
        const z = m.zones.find((q) => q.id === mapId);
        if (z) return { mapId: m.id, x: x + z.x, y: y + z.y };
      }
    }
    return { mapId, x, y };
  }

  /** The zone of the outdoors the party stands in; undefined in a town or a dungeon. */
  get zone(): MapZone | undefined { return this.map.zoneAt(this.state.x, this.state.y); }

  /** What the party's whereabouts are called, and the levels they are tuned for: its zone outdoors, its map anywhere else. */
  get here(): { name: string; band?: readonly [number, number] } {
    const z = this.zone;
    return z ? { name: z.name, band: z.band } : { name: this.map.name, band: this.map.def.band };
  }

  /** Remember the zone the party stands in as one it has set foot in. */
  private tread(): MapZone | undefined {
    const z = this.zone, trod = (this.state.zones ??= []);
    if (z && !trod.includes(z.id)) trod.push(z.id);
    return z;
  }

  // ---- time ----
  get day(): number { return Math.floor(this.state.minutes / MINUTES_PER_DAY) + 1; }
  get hour(): number { return Math.floor((this.state.minutes % MINUTES_PER_DAY) / 60); }
  get minute(): number { return this.state.minutes % 60; }
  get date(): CalendarDate { return dateAt(this.state.minutes); }
  /** 0 at night, 1 in full day, through a dawn and a dusk that move with the season (see calendar.ts). */
  get daylight(): number { return daylightAt(this.state.minutes); }
  get isDark(): boolean { return this.daylight < 0.25 && this.map.kind !== 'dungeon'; }
  /** Whether the sky is overhead: everywhere but the dungeons. */
  get underSky(): boolean { return this.map.kind !== 'dungeon'; }
  /** How far the party can see: 4 by day or with light, 2 by night or in a dungeon without it; fog, driving rain and snow close in on that. */
  get sight(): number {
    const s = this.state.light > 0 ? 4 : this.map.kind === 'dungeon' || this.isDark ? 2 : 4;
    return this.underSky ? Math.min(s, weatherSight(this.weather)) : s;
  }

  // ---- weather ----
  get region(): RegionId { return this.zone?.region ?? this.map.def.region ?? 'shelf'; }
  get climate(): Climate { return CLIMATES[this.region]; }
  /** The weather in this map's region now; also the weather over a dungeon, though nobody there sees it. */
  get weather(): Weather {
    const c = this.cached, seed = this.state.weatherSeed!, minutes = this.state.minutes, region = this.region;
    if (c && c.seed === seed && c.minutes === minutes && c.region === region) return c.weather;
    const weather = weatherAt(seed, minutes, CLIMATES[region]);
    this.cached = { seed, minutes, region, weather };
    return weather;
  }

  /** The weather in a region now, whoever stands in it. */
  weatherIn(region: RegionId): Weather {
    if (region === this.region) return this.weather;
    const seed = this.state.weatherSeed!, minutes = this.state.minutes;
    if (!this.skies || this.skies.seed !== seed || this.skies.minutes !== minutes) this.skies = { seed, minutes, by: new Map() };
    let w = this.skies.by.get(region);
    if (!w) { w = weatherAt(seed, minutes, CLIMATES[region]); this.skies.by.set(region, w); }
    return w;
  }

  /**
   * Whether a thing with a time to walk is in the world now, at a square of this map: in its hours
   * (under the sky of that square's region) and past its `after`. `until` is `ended`'s.
   */
  walks(p: Presence, x: number, y: number): boolean {
    if (p.after && !holds(p.after, this.state, this.party)) return false;
    if (!p.when) return true;
    const m = this.map, region = m.zoneAt(x, y)?.region ?? m.def.region ?? 'shelf';
    return hoursHold(p.when, this.state.minutes, m.kind === 'dungeon' ? null : this.weatherIn(region));
  }

  /** Whether a thing's `until` holds: a group stops coming back, a person or an event is gone. */
  ended(p: Presence): boolean {
    return !!p.until && holds(p.until, this.state, this.party);
  }

  /**
   * A log line when the sky has changed since the party last looked, or on first seeing it (a new
   * game, a load, the way out of a dungeon); null when there is nothing to say. Underground the sky
   * is forgotten, so coming up says what it is doing now rather than what changed.
   */
  weatherNews(): string | null {
    if (!this.underSky) { this.sky = null; return null; }
    const prev = this.sky;
    this.sky = classify(this.weather, prev);
    return skyNews(prev?.sky ?? null, this.sky.sky, this.climate);
  }

  /** The Stones the company has restored, by which the Hearth steadies (game/stones.ts). */
  get stones(): number { return stonesRestored(this.state, this.party); }

  /**
   * Where the party stands in world cells: its square on the outdoors, which is laid out as the world
   * map charts it; in a town, the square its way out leads to; undefined underground.
   */
  get worldCell(): { x: number; y: number } | undefined {
    if (this.map.kind === 'outdoor') return { x: this.state.x, y: this.state.y };
    if (this.map.kind !== 'town') return undefined;
    const out = this.map.exits.find((e) => this.maps[e.to]?.kind === 'outdoor');
    return out ? { x: out.tx, y: out.ty } : undefined;
  }

  /** The M screen's almanac: the date and the season, the hours of light, the sky and what it is doing to the party. */
  almanac(): string {
    const d = this.date, sun = sunTimes(d.dayOfYear), date = longDate(d);
    const steady = steadier(this.stones);
    const lines = [`${date[0].toUpperCase()}${date.slice(1)}: ${seasonName(d)}. Day ${d.gameDay} since the Hearth flickered.${steady ? ' ' + steady : ''}`, `Dawn ${clock(sun.dawn)}, dusk ${clock(sun.dusk)}.`];
    if (!this.underSky) return [...lines, 'Underground, there is no telling the weather.'].join('\n');
    const wx = this.weather, sky = classify(wx, this.sky).sky, seen = weatherSight(wx);
    const cause = wx.fog >= 0.35 ? 'fog' : wx.snow >= 0.7 ? 'snow' : wx.snow > 0.3 ? 'sleet' : 'rain';
    const effects = [
      seen < 4 ? `The ${cause} hides all but ${seen === 2 ? 'two squares' : 'three squares'} ahead.` : '',
      rangedPenalty(wx) ? 'Bows and slings will shoot poorly.' : '',
      snowDrag(wx) ? 'Snow lies deep, and the going is slow.' : wx.cover >= 0.15 ? 'Snow lies on the ground.' : '',
    ].filter(Boolean);
    return [...lines, `${SKY_NAMES[sky]}, and ${tempWord(wx.temp)}.${effects.length ? ' ' + effects.join(' ') : ''}`].join('\n');
  }

  /** What the weather does to a fight here: a to-hit loss for bows on both sides, and a line for the log. */
  combatWeather(): { rangedPenalty: number; note?: string } {
    if (!this.underSky) return { rangedPenalty: 0 };
    return { rangedPenalty: rangedPenalty(this.weather), note: rangedNote(this.weather) };
  }

  advance(minutes: number): void {
    this.state.minutes += minutes;
  }

  /** Sleep through to the next morning: 07:00, or first light where the day breaks later, deep in winter. */
  sleepUntilMorning(): void {
    const now = this.state.minutes;
    let wake = Math.floor(now / MINUTES_PER_DAY) * MINUTES_PER_DAY + 7 * 60;
    if (wake <= now) wake += MINUTES_PER_DAY;
    const dawn = Math.floor(wake / MINUTES_PER_DAY) * MINUTES_PER_DAY + Math.ceil(sunTimes(dateAt(wake).dayOfYear).dawn * 60);
    this.advance(Math.max(wake, dawn) - now);
  }

  /** The tide now: high water or low, from the clock. */
  get tide(): Tide { return tideAt(this.state.minutes); }

  /** What the party can cross, at this tide. */
  private get can(): ReturnType<typeof partyCan> & { tide: Tide; float: boolean } {
    const can = partyCan(this.party);
    return { ...can, swim: can.swim || (this.state.walk ?? 0) > 0, tide: this.tide, float: (this.state.float ?? 0) > 0 };
  }

  /** Whether tidal ground lies within sight of the party, outdoors. */
  private tidalNear(): boolean {
    if (this.map.kind !== 'outdoor') return false;
    const r = VIEW_DEPTH, { x, y } = this.state;
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) if (this.map.at(x + dx, y + dy).terrain === 'tidal') return true;
    return false;
  }

  // ---- movement ----
  turn(dir: 'left' | 'right' | 'back'): MoveResult {
    const f = this.state.facing;
    this.state.facing = dir === 'left' ? turnLeft(f) : dir === 'right' ? turnRight(f) : turnBack(f);
    return { kind: 'turned' };
  }

  /** Step in a direction relative to the facing. */
  move(dir: 'forward' | 'back' | 'left' | 'right'): MoveResult {
    const f = this.state.facing;
    const mf: Facing = dir === 'forward' ? f : dir === 'back' ? turnBack(f) : dir === 'left' ? turnLeft(f) : turnRight(f);
    const nx = this.state.x + FACING_DX[mf], ny = this.state.y + FACING_DY[mf];
    const pass = this.map.passable(nx, ny, this.can);
    if (pass !== 'ok' && pass !== 'unlock') return { kind: 'blocked', reason: BLOCK_TEXT[pass] };
    // Levitate never leaves the party over the drop when it fails.
    if (this.map.at(nx, ny).terrain === 'chasm' && (this.state.float ?? 0) <= 1) return { kind: 'blocked', reason: FLOAT_FAILS };
    const gate = this.map.gateAt(nx, ny) ?? this.map.exitAt(nx, ny);
    if (gate?.needFlag && ![gate.needFlag].flat().every((k) => this.party.flags[k])) return { kind: 'blocked', reason: gate.blockedText ?? 'The way is closed.' };
    if (gate?.shut && holds(gate.shut, this.state, this.party)) return { kind: 'blocked', reason: gate.blockedText ?? 'The way is closed.' };
    const left = this.zone;
    const messages: string[] = [];
    if (pass === 'unlock') {
      const c = this.map.at(nx, ny);
      takeItem(this.party, 'key_iron');
      c.door = 'door';
      this.mapState.doors[`${nx},${ny}`] = 'door';
      messages.push('The lock turns. The key crumbles.');
    }
    this.state.x = nx; this.state.y = ny;
    this.state.steps++;
    // Six minutes a step in the open, more onto hills or ash and more through deep snow, the two
    // adding up; two in the streets and underground.
    const drag = DRAG[this.map.at(nx, ny).terrain] ?? 0;
    const tide = this.tide;
    this.advance(this.map.kind === 'outdoor' ? 6 + drag + snowDrag(this.weather) : 2);
    // The tide turning is said where the party can see the ground it covers.
    if (this.tide !== tide && this.tidalNear()) messages.push(TIDE_TEXT[this.tide]);
    if (this.state.light > 0) this.state.light--;
    if (this.state.truce > 0 && --this.state.truce === 0) this.state.truceGroups = [];
    if (this.state.walk && --this.state.walk === 0) messages.push(WALK_ENDS);
    if (this.state.float && --this.state.float === 0) messages.push(FLOAT_ENDS);
    this.reveal();
    const zone = this.tread();
    const arrived = this.map.exitAt(nx, ny);
    if (arrived) {
      this.travel(arrived.to, arrived.tx, arrived.ty, arrived.tf);
      if (arrived.label) messages.push(arrived.label);
      return { kind: 'moved', messages, arrived };
    }
    // Over the line into the next zone of the outdoors: what the way between them says, if anything,
    // and how the land feels.
    if (zone && left && zone !== left) messages.push(...this.crossing(left, zone));
    messages.push(...this.eventsHere());
    this.moveMonsters();
    // What comes into sight is said before the fight it may start.
    messages.push(...this.sightings());
    const encounter = this.adjacentGroups();
    return { kind: 'moved', messages, encounter: encounter.length ? encounter : undefined };
  }

  /**
   * What the log says crossing from one zone map into another (EXPANSION §5.2): the way's arrival
   * line, if it has one; the land's name where the atlas zone changes, unless the arrival line said
   * it; and how the land feels, all as one entry of the log where its floor is over the company's level and is new or higher than
   * the one left: harder one or two under, a plainer warning three or more under, in the zone's own
   * words if it has them. Never a wall. Stepping straight back over a line just crossed says no more
   * than the way's own line.
   */
  private crossing(left: MapZone, zone: MapZone): string[] {
    const arrival = zone.enter?.[left.id], was = this.lastCross, now = this.state.minutes;
    this.lastCross = { from: left.id, to: zone.id, at: now };
    if (was && was.from === zone.id && was.to === left.id && now - was.at < 60) return arrival ? [arrival] : [];
    const newLand = zone.land?.id !== left.land?.id, floor = zone.band?.[0];
    const under = floor === undefined ? 0 : floor - companyLevel(this.party);
    const rises = newLand || (floor ?? 0) > (left.band?.[0] ?? 0);
    const words = zone.land?.crossing;
    const feel = under <= 0 || !rises ? '' : under <= 2 ? words?.harder ?? HARDER : words?.warning ?? WARNING;
    const line = [newLand && !arrival && zone.land ? `${zone.land.name}.` : '', feel].filter(Boolean).join(' ');
    const said = [arrival, line].filter(Boolean).join(' ');
    return said ? [said] : [];
  }

  /** Put the party on a map (a zone map's cells count: see `locate`), facing on as it was unless told. */
  travel(to: string, x: number, y: number, facing?: Facing): void {
    const at = this.locate(to, x, y);
    this.ensureMapState(at.mapId);
    this.state.mapId = at.mapId; this.state.x = at.x; this.state.y = at.y;
    if (facing !== undefined) this.state.facing = facing;
    if (this.map.kind === 'town') this.state.lastTown = at.mapId;
    this.tread();
    this.reveal();
  }

  /** Town Portal: back to the start cell of the last town visited (Helmstow before any). */
  townPortal(): string {
    const id = this.state.lastTown && this.maps[this.state.lastTown] ? this.state.lastTown : Object.values(this.maps).find((m) => m.kind === 'town')!.id;
    const m = this.maps[id];
    this.travel(id, m.def.start.x, m.def.start.y, m.def.start.facing);
    this.state.truce = 0; this.state.truceGroups = [];
    return m.name;
  }

  /** Walk on Water and Levitate, cast: steps of each. */
  bear(what: 'walk' | 'float'): void { this.state[what] = what === 'walk' ? WALK_STEPS : FLOAT_STEPS; }
  /** A fight ends Walk on Water: the party stands where it stands. */
  endWalk(): void { delete this.state.walk; }

  /**
   * Whether Waymark can set its mark here: on an outdoor map, on ground the party stands on without
   * swimming or floating, and never tidal ground, which the sea may cover by the time it returns.
   */
  canMark(): boolean {
    const { x, y } = this.state;
    return this.map.kind === 'outdoor' && this.map.at(x, y).terrain !== 'tidal' && this.map.passable(x, y, { tide: this.tide }) === 'ok';
  }
  /** Waymark: set the mark where the party stands. False where it will not take (`canMark`). */
  setMark(): boolean {
    if (!this.canMark()) return false;
    this.state.mark = { mapId: this.state.mapId, x: this.state.x, y: this.state.y, facing: this.state.facing };
    return true;
  }
  /** Waymark: back to the mark, as Town Portal goes back to a town. False with no mark. */
  toMark(): boolean {
    const m = this.state.mark;
    if (!m || !this.maps[m.mapId]) return false;
    this.travel(m.mapId, m.x, m.y, m.facing);
    this.state.truce = 0; this.state.truceGroups = [];
    return true;
  }

  /** Mark cells around the party seen: the four neighbours always, more with sight. */
  reveal(radius = 1): void {
    const ms = this.mapState, m = this.map;
    const r = Math.max(radius, this.map.kind === 'outdoor' && !this.isDark && weatherSight(this.weather) >= 4 ? 2 : 1);
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      const x = this.state.x + dx, y = this.state.y + dy;
      if (m.inBounds(x, y)) see(ms.explored, y * m.width + x);
    }
    // And the corridor ahead, as far as the eye sees, so the automap matches the viewport.
    const f = this.state.facing;
    for (let d = 1; d <= this.sight; d++) {
      const x = this.state.x + FACING_DX[f] * d, y = this.state.y + FACING_DY[f] * d;
      if (!m.inBounds(x, y)) break;
      for (let s = -1; s <= 1; s++) {
        const sx = x + (f === 0 || f === 2 ? s : 0), sy = y + (f === 1 || f === 3 ? s : 0);
        if (m.inBounds(sx, sy)) see(ms.explored, sy * m.width + sx);
      }
      if (m.blocksView(x, y)) break;
    }
  }

  revealAll(radius: number): void {
    const ms = this.mapState, m = this.map;
    for (let dy = -radius; dy <= radius; dy++) for (let dx = -radius; dx <= radius; dx++) {
      const x = this.state.x + dx, y = this.state.y + dy;
      if (m.inBounds(x, y)) see(ms.explored, y * m.width + x);
    }
  }

  explored(x: number, y: number): boolean { return this.map.inBounds(x, y) && seen(this.mapState.explored, y * this.map.width + x); }

  // ---- monsters ----
  /**
   * Live groups on the current map: a killed one back once its respawn is up and its `until` does
   * not hold, and none out of its hours or before its `after`.
   */
  liveGroups(): LiveGroup[] {
    const out: LiveGroup[] = [];
    const ms = this.mapState;
    // A standing den's brood come back one a pace (game/dens.ts).
    pace(this);
    for (const def of this.map.encounters) {
      const st = ms.groups[def.id];
      if (!st) continue;
      if (st.dead >= 0) {
        if (def.respawn && this.state.minutes - st.dead >= def.respawn && !this.ended(def)) { st.dead = -1; st.x = def.x; st.y = def.y; }
        else continue;
      }
      if ((def.when || def.after) && !this.walks(def, def.x, def.y)) continue;
      out.push({ def, state: st });
    }
    return out;
  }

  /** The live groups the party can see, nearest first: the ones the viewport draws. */
  groupsInSight(): LiveGroup[] {
    const { x: px, y: py, facing: f } = this.state, m = this.map, out: LiveGroup[] = [];
    const live = this.liveGroups();
    for (let d = 1; d <= Math.min(VIEW_DEPTH, this.sight); d++) for (let l = -VIEW_LATERAL; l <= VIEW_LATERAL; l++) {
      const c = viewCell(px, py, f, d, l);
      if (!m.inBounds(c.x, c.y) || isSolidWall(m.at(c.x, c.y)) || !lineOfSight(m, px, py, f, d, l)) continue;
      const g = live.find((q) => q.state.x === c.x && q.state.y === c.y);
      if (g) out.push(g);
    }
    return out;
  }

  /**
   * Record the defs as met, and return the looks of those met for the first time, once each. What
   * has no look is recorded all the same.
   */
  meet(ids: readonly string[]): string[] {
    const met = (this.state.met ??= []), said: string[] = [];
    for (const id of ids) {
      if (met.includes(id)) continue;
      met.push(id);
      const look = monster(id).look;
      if (look) said.push(look);
    }
    return said;
  }

  /** The looks of the kinds now in sight that the company has not met: each group's kinds as it is drawn (`groupDrawn`). */
  sightings(): string[] {
    // A den's look first: the place, then what guards it.
    const dens = densOf(this.map).length ? denLooks(this, (x, y) => this.sees(x, y)) : [];
    return [...dens, ...this.meet(this.groupsInSight().flatMap((g) => groupDrawn(g.def.monsters)))];
  }

  /** Whether the party sees a square: its own, or one the viewport draws, by the same rule. */
  sees(x: number, y: number): boolean {
    const { x: px, y: py, facing: f } = this.state, rf = ((f + 1) & 3) as Facing, m = this.map;
    if (x === px && y === py) return true;
    const d = (x - px) * FACING_DX[f] + (y - py) * FACING_DY[f], l = (x - px) * FACING_DX[rf] + (y - py) * FACING_DY[rf];
    if (d < 1 || d > Math.min(VIEW_DEPTH, this.sight) || Math.abs(l) > VIEW_LATERAL) return false;
    return m.inBounds(x, y) && !isSolidWall(m.at(x, y)) && lineOfSight(m, px, py, f, d, l);
  }

  groupAt(x: number, y: number): LiveGroup | undefined {
    return this.liveGroups().find((g) => g.state.x === x && g.state.y === y);
  }

  /**
   * Where a group may step: where the party could with no key, swimmer or mountaineer, and no group
   * stands; a group under the ice, only under the ice.
   */
  private monsterPassable(x: number, y: number, g?: LiveGroup): boolean {
    if (g?.def.under === 'ice' && this.map.at(x, y).terrain !== 'ice') return false;
    return this.map.passable(x, y, { tide: this.tide }) === 'ok' && !this.groupAt(x, y);
  }

  /** Each aware, roaming group steps one cell toward the party. */
  moveMonsters(): void {
    if (this.state.truce > 0) return;
    const { x: px, y: py } = this.state;
    for (const g of this.liveGroups()) {
      if (g.def.roams === false) continue;
      const aware = g.def.aware ?? 5;
      const d = manhattan(g.state.x, g.state.y, px, py);
      if (d > aware || d <= 1) continue;
      const dx = px - g.state.x, dy = py - g.state.y;
      const tries: [number, number][] = Math.abs(dx) >= Math.abs(dy)
        ? [[Math.sign(dx), 0], [0, Math.sign(dy)]]
        : [[0, Math.sign(dy)], [Math.sign(dx), 0]];
      for (const [sx, sy] of tries) {
        if (sx === 0 && sy === 0) continue;
        if (this.monsterPassable(g.state.x + sx, g.state.y + sy, g)) { g.state.x += sx; g.state.y += sy; break; }
      }
    }
  }

  /**
   * Group ids within one cell of the party, up to 3 groups and 12 monsters; a group under the ice
   * only where the party stands on the ice.
   */
  adjacentGroups(): string[] {
    const ids: string[] = [];
    let n = 0;
    const onIce = this.map.at(this.state.x, this.state.y).terrain === 'ice';
    for (const g of this.liveGroups()) {
      if (this.state.truceGroups.includes(g.def.id)) continue;
      if (manhattan(g.state.x, g.state.y, this.state.x, this.state.y) > 1) continue;
      if (g.def.under === 'ice' && !onIce) continue;
      if (ids.length >= 3 || n + g.def.monsters.length > 12) break;
      ids.push(g.def.id); n += g.def.monsters.length;
    }
    return ids;
  }

  groupDefs(ids: string[]): { id: string; monsters: string[]; back?: number; leader?: string; under?: 'ice' }[] {
    return ids.map((id) => { const e = this.map.encounters.find((x) => x.id === id)!; return { id, monsters: e.monsters, back: e.back, leader: e.leader, under: e.under }; });
  }

  /** Mark the groups dead; returns what the log says about it (each group's `slainText`). */
  killGroups(ids: string[]): string[] {
    const said: string[] = [];
    for (const id of ids) {
      const st = this.mapState.groups[id]; if (st) st.dead = this.state.minutes;
      const text = this.map.encounters.find((e) => e.id === id)?.slainText;
      if (text) said.push(text);
    }
    return said;
  }

  /** After a successful flight: step back if possible and grant a truce with those groups. */
  flee(ids: string[]): void {
    this.state.truce = 4; this.state.truceGroups = ids;
    const f = turnBack(this.state.facing);
    const nx = this.state.x + FACING_DX[f], ny = this.state.y + FACING_DY[f];
    if (this.map.passable(nx, ny, this.can) === 'ok' && !this.groupAt(nx, ny)) { this.state.x = nx; this.state.y = ny; }
  }

  /**
   * Leaving a business: out of its doorway onto the open cell beside it (the one behind the party
   * if that is open), turned to face the door again. Not a step: no time passes and nothing moves.
   * False, and nothing changes, when there is no street to step into.
   */
  stepOut(): boolean {
    const { x, y, facing } = this.state;
    const street = (f: Facing): boolean => {
      const nx = x + FACING_DX[f], ny = y + FACING_DY[f];
      return this.map.passable(nx, ny, { tide: this.tide }) === 'ok' && this.map.at(nx, ny).door === 'none' && !this.map.exitAt(nx, ny) && !this.groupAt(nx, ny);
    };
    const out = ([turnBack(facing), 0, 1, 2, 3] as Facing[]).find(street);
    if (out === undefined) return false;
    this.state.x = x + FACING_DX[out]; this.state.y = y + FACING_DY[out];
    this.state.facing = turnBack(out);
    this.reveal();
    return true;
  }

  // ---- features ----
  /** The interactable in the party's cell, else the one directly ahead. */
  featureHere(): Feature | undefined {
    const here = this.map.featuresAt(this.state.x, this.state.y).filter((f) => f.kind !== 'event' && this.present(f));
    if (here.length) return here[0];
    const a = this.map.ahead(this.state.x, this.state.y, this.state.facing);
    return this.map.featuresAt(a.x, a.y).filter((f) => f.kind !== 'event' && f.kind !== 'sign' && this.present(f))[0];
  }

  /** The people standing on a square now with no room of their own: those in the business there. */
  peopleAt(x: number, y: number): Extract<Feature, { kind: 'npc' }>[] {
    return this.map.featuresAt(x, y).filter((f): f is Extract<Feature, { kind: 'npc' }> => f.kind === 'npc' && !f.interior && this.present(f));
  }

  /**
   * Whether a feature is there now. A person, an event, a business, a shrine or a fountain wears a
   * presence, as a group does: there only in its `when`, once its `after` holds and until its `until` does. Everything
   * else always is, having none.
   */
  present(f: Feature): boolean {
    const p = f as Presence;
    return this.walks(p, f.x, f.y) && !this.ended(p);
  }

  /** Event and sign texts for the party's cell; once-only events are marked used, and inscriptions a reader reads kept read. */
  eventsHere(): string[] {
    const out: string[] = [];
    for (const f of this.map.featuresAt(this.state.x, this.state.y)) {
      // An event out of its presence is not spent: a night's event waits for the night.
      if (f.kind === 'event' && this.present(f) && !(f.once && this.mapState.used[f.id])) {
        out.push(f.text);
        if (f.once) this.mapState.used[f.id] = 1;
        for (const flag of [f.sets ?? []].flat()) this.party.flags[flag] = 1;
      }
      if (f.kind === 'sign') out.push(...signSays(this, f));
    }
    return out;
  }

  used(id: string): boolean { return !!this.mapState.used[id]; }
  markUsed(id: string): void { this.mapState.used[id] = 1; }

  /** Search the cell ahead for a secret door. Returns true if one was found. */
  search(): boolean {
    const a = this.map.ahead(this.state.x, this.state.y, this.state.facing);
    const c = this.map.at(a.x, a.y);
    if (c.door !== 'secret') return false;
    const perceptive = this.party.members.some((m) => !isDown(m) && (m.race === 'elf' || m.race === 'gnome' || hasTrait(m, 'keen_eyes')));
    if (perceptive || this.rng.chance(0.5)) { c.door = 'door'; this.mapState.doors[`${a.x},${a.y}`] = 'door'; return true; }
    return false;
  }

  /** Eight hours of rest. Returns false if there is no food. */
  rest(): boolean {
    const need = this.party.members.filter((m) => !isDown(m) || m.hp > -10).length;
    if (this.party.food < need) return false;
    this.party.food -= need;
    this.advance(8 * 60);
    return true;
  }
}

/** How the land feels to a company one or two levels under its floor, and three or more (`crossing`). */
const HARDER = 'The land here is harder than the road behind.';
const WARNING = 'Nothing here would spare you. The road behind is still open.';

/** What the log says as the tide turns, near the ground it covers. */
const TIDE_TEXT: Record<Tide, string> = {
  high: 'The tide has turned. The sea comes in over the sand.',
  low: 'The tide has turned. The sea draws off the sand.',
};

/** The steps Walk on Water and Levitate last (DESIGN §7): a shortcut over a little water or a drop, never a road. */
export const WALK_STEPS = 12, FLOAT_STEPS = 6;
/** What the log says as each ends, and as a step would leave the party over the drop with the float spent. */
export const WALK_ENDS = 'The water no longer bears you.', FLOAT_ENDS = 'Your feet find the ground.', FLOAT_FAILS = 'You would fall before the far side.';

const BLOCK_TEXT: Record<string, string> = {
  void: 'The world ends here.',
  wall: 'A wall blocks the way.',
  blocked: 'Something blocks the way.',
  mountain: 'Too steep to climb without a Mountaineer.',
  water: 'The water is too deep to wade.',
  deep: 'The water is far too deep.',
  chasm: 'The ground falls away. There is no way down here.',
  tide: 'The tide is in. The sands will show again.',
  locked: 'Locked. A key would open it.',
};
