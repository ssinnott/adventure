// The world: which map the party is on, where it stands, what time it is, and what has changed on
// each map. Movement, the clock's readers, the exits and the ways, a lock opened (`unlock`), the
// features, rest, search and an enclave's door crossing in (`enclaveLine`, #845) live here. The
// outdoors is one map (game/outdoors.ts), so outdoors the party's zone, not its map, says where it
// is, what the weather does and what the log calls the place. Pure with respect to rendering and
// input; the Game drives it and reads the results. Its parts are in game/world/ (#1008): the sky
// (the weather's reach into play, the almanac, the clock's passing, the region of a square and when
// a thing walks), sight (the viewport's rule, `VIEW_DEPTH` and `lineOfSight`, what a hill hides
// from below it and automap reveal) and the groups (roaming monster groups, encounter triggers and
// the looks said on first meeting). It reads the climates, the Stones and the endings off the
// tables it is handed (`w.tables`, #976).
//
// Each part is functions of the world. A member that moved stays here as the call into its part,
// so no caller changes, and this file exports every name it did, each from the part that has it
// now. No part loads this file as it runs: each takes World and the state as types alone.
import type { RngInstance } from '../lib/engine/rng.ts';
import { GameMap, DRAG } from './map.ts';
import type { Feature, Exit, EncounterDef, Door, MapZone, Cell, Presence, Choice, Gate, MapDef } from './mapdef.ts';
import type { Facing } from './types.ts';
import { FACING_DX, FACING_DY, turnLeft, turnRight, turnBack } from './types.ts';
import { partyCan, takeItem, isDown, hasTrait, companyLevel } from './party.ts';
import type { Party } from './party.ts';
import { MINUTES_PER_DAY, dateAt, daylightAt, tideAt } from './calendar.ts';
import type { CalendarDate, Tide } from './calendar.ts';
import { snowDrag, fairStart } from './weather.ts';
import type { Climate, RegionId, Weather, SkyState } from './weather.ts';
import { holds } from './quests.ts';
import { stonesRestored, endingOf } from './stones.ts';
import type { Hearth } from './stones.ts';
import type { Tables } from './tables.ts';
import { signLine, signSays } from './inscriptions.ts';
import { hasSkill, skilled } from './skills.ts';
import { bitsFor, VIEW_DEPTH, sight, reveal, hidden, revealAll, explored, sees } from './world/sight.ts';
import { regionOf, cached, weather, weatherIn, walks, ended, weatherNews, almanac, combatWeather, advance, sleepUntilMorning } from './world/sky.ts';
import type { Reading } from './world/sky.ts';
import { liveGroups, groupsInSight, meet, sightings, groupAt, moveMonsters, adjacentGroups, question, standsAside, groupDefs, killGroups, flee, stepOut } from './world/groups.ts';

export { MINUTES_PER_DAY };
// What the parts have, from the path it always had (#1008).
export { seen, VIEW_DEPTH, VIEW_LATERAL, viewCell, isSolidWall, lineOfSight, hillOver, hillHiding } from './world/sight.ts';
export { FOG, hoursHold, regionOf, regionAt } from './world/sky.ts';
export { DRAWN_MAX, groupDrawn, AWARE } from './world/groups.ts';

export const START_MINUTES = 7 * 60;
/** The weather seed of a save made before there was weather. */
export const LEGACY_WEATHER_SEED = 0x5ca1d;

interface GroupState { x: number; y: number; /** Minute the group was killed, or -1 while alive. */ dead: number; }

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

export type MoveResult =
  /** `asks`: the group whose question comes before the fight (#544); then no `encounter`. */
  | { kind: 'moved'; messages: string[]; encounter?: string[]; asks?: string; arrived?: Exit<string> }
  | { kind: 'blocked'; reason: string }
  | { kind: 'turned' };

export interface LiveGroup { def: EncounterDef; state: GroupState; }

// A sign as the log shows it: game/inscriptions.ts has it, beside an inscription's reading.
export { signLine };

export class World {
  /** The tables it reads, handed in (#973). */
  readonly tables: Tables;
  readonly maps: Record<string, GameMap>;
  state: WorldState;
  party: Party;
  rng: RngInstance;

  /** The sky as the party last saw it, for the log; null underground or before the first look. Not saved. */
  sky: SkyState | null = null;
  /**
   * The weather's memo, kept in world/sky.ts; the smoke and the kept suite pin a sky through it
   * (`w['cached']`), so it is not private.
   */
  get cached(): Reading | null { return cached.get(this) ?? null; }
  set cached(c: Reading | null) { if (c) cached.set(this, c); else cached.delete(this); }
  /** The last line crossed between zone maps, and when: a step straight back over it says no more. Not saved. */
  private lastCross?: { from: string; to: string; at: number };

  constructor(tables: Tables, maps: Record<string, GameMap>, party: Party, rng: RngInstance, state?: WorldState) {
    this.tables = tables; this.maps = maps; this.party = party; this.rng = rng;
    if (state) this.state = state;
    else {
      const first = Object.values(maps)[0];
      this.state = { mapId: first.id, x: first.def.start.x, y: first.def.start.y, facing: first.def.start.facing, minutes: START_MINUTES, maps: {}, light: 0, truce: 0, truceGroups: [], steps: 0, zones: [] };
      // The company sets out on a dry, clear morning: draw seeds until the first hours are fair.
      let seed = 0;
      const climate = tables.climates[regionOf(first, first.def.start.x, first.def.start.y)];
      for (let i = 0; i < 64; i++) { seed = rng.int(1, 0x7ffffffe); if (fairStart(seed, START_MINUTES, climate)) break; }
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
  get sight(): number { return sight(this); }

  // ---- weather ----
  get region(): RegionId { return regionOf(this.map, this.state.x, this.state.y); }
  get climate(): Climate { return this.tables.climates[this.region]; }
  get weather(): Weather { return weather(this); }

  weatherIn(region: RegionId): Weather { return weatherIn(this, region); }

  walks(p: Presence, x: number, y: number, on?: string): boolean { return walks(this, p, x, y, on); }

  ended(p: Presence): boolean { return ended(this, p); }

  weatherNews(): string | null { return weatherNews(this); }

  /** The Stones the company has restored, by which the Hearth steadies (game/stones.ts). */
  get stones(): number { return stonesRestored(this.tables.stones, this.state, this.party); }

  /** The Hearth as the company has left it: the Stones restored, and the ending once one is taken (#750). */
  get hearth(): Hearth { return { stones: this.stones, ending: endingOf(this.tables.endings, this.party.flags) }; }

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

  almanac(): string { return almanac(this); }

  combatWeather(): { rangedPenalty: number; note?: string } { return combatWeather(this); }

  advance(minutes: number): void { advance(this, minutes); }

  sleepUntilMorning(): void { sleepUntilMorning(this); }

  /** The tide now: high water or low, from the clock. */
  get tide(): Tide { return tideAt(this.state.minutes); }

  /** What the party can cross, at this tide: public, as the groups' `flee` reads it (#1008). */
  get can(): ReturnType<typeof partyCan> & { tide: Tide; float: boolean } {
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

  /** Whether an exit is there now: one with an `after` is once it holds, as a presence is, and before that its square is no exit (#749). */
  there(e: Exit<string>): boolean {
    return !e.after || holds(e.after, this.state, this.party);
  }

  /** The exit on a square now, if it is there. */
  exitAt(x: number, y: number): Exit<string> | undefined {
    const e = this.map.exitAt(x, y);
    return e && this.there(e) ? e : undefined;
  }

  /**
   * Whether a way refuses the party: until every flag it needs is set; while its `shut` holds and
   * its `lifts` does not (#157, #749); and a gate until its `after` holds, since at a seam the
   * square is the way across. Each is read afresh at every step.
   */
  private closed(g: Gate | Exit): boolean {
    const now = (w: Exit['shut']): boolean => !!w && holds(w, this.state, this.party);
    if (g.needFlag && ![g.needFlag].flat().every((k) => this.party.flags[k])) return true;
    return (now(g.shut) && !now(g.lifts)) || (!!g.after && !now(g.after));
  }

  /** Step in a direction relative to the facing. */
  move(dir: 'forward' | 'back' | 'left' | 'right'): MoveResult {
    const f = this.state.facing;
    const mf: Facing = dir === 'forward' ? f : dir === 'back' ? turnBack(f) : dir === 'left' ? turnLeft(f) : turnRight(f);
    const nx = this.state.x + FACING_DX[mf], ny = this.state.y + FACING_DY[mf];
    const pass = this.map.passable(nx, ny, this.can);
    // An iron-key door opens to a key carried, or to a Lockpick with none (`unlock`, #857).
    const lock = pass === 'unlock' || (pass === 'locked' && this.picks);
    if (pass !== 'ok' && !lock) return { kind: 'blocked', reason: pass === 'void' ? worldsEnd(this.map.at(nx, ny)) : BLOCK_TEXT[pass] };
    // Levitate never leaves the party over the drop when it fails.
    if (this.map.at(nx, ny).terrain === 'chasm' && (this.state.float ?? 0) <= 1) return { kind: 'blocked', reason: FLOAT_FAILS };
    const gate = this.map.gateAt(nx, ny) ?? this.exitAt(nx, ny);
    if (gate && this.closed(gate)) return { kind: 'blocked', reason: gate.blockedText ?? 'The way is closed.' };
    const left = this.zone;
    const messages: string[] = [];
    if (lock) {
      const c = this.map.at(nx, ny);
      messages.push(this.unlock());
      c.door = 'door';
      this.mapState.doors[`${nx},${ny}`] = 'door';
    }
    this.state.x = nx; this.state.y = ny;
    this.state.steps++;
    // Six minutes a step in the open, more onto hills or ash and more through deep snow, the two
    // adding up; two in the streets and underground. A Pathfinder standing walks it all at the road's
    // six: no drag on the clock (#857).
    const drag = skilled(this.tables.items, this.party, 'pathfinder') ? 0 : (DRAG[this.map.at(nx, ny).terrain] ?? 0) + snowDrag(this.weather);
    const tide = this.tide;
    this.advance(this.map.kind === 'outdoor' ? 6 + drag : 2);
    // The tide turning is said where the party can see the ground it covers.
    if (this.tide !== tide && this.tidalNear()) messages.push(TIDE_TEXT[this.tide]);
    if (this.state.light > 0) this.state.light--;
    if (this.state.truce > 0 && --this.state.truce === 0) this.state.truceGroups = [];
    if (this.state.walk && --this.state.walk === 0) messages.push(WALK_ENDS);
    if (this.state.float && --this.state.float === 0) messages.push(FLOAT_ENDS);
    this.reveal();
    const zone = this.tread();
    const arrived = this.exitAt(nx, ny);
    if (arrived) {
      const from = this.map.def;
      this.travel(arrived.to, arrived.tx, arrived.ty, arrived.tf);
      if (arrived.label) messages.push(arrived.label);
      // Into an enclave (#845): its door's line, after the way's own, but none from a level of an
      // enclave whose floor is at or over its own: as at a border, it speaks where the floor rises.
      const asHard = from.enclave && (from.band?.[0] ?? 0) >= (this.map.def.band?.[0] ?? 0);
      const door = asHard ? undefined : enclaveLine(this.map.def, companyLevel(this.party));
      if (door) messages.push(door);
      // A jump from one zone of the outdoors to another (N8's notch onto M9): the line its border
      // would say, walked, after the way's own.
      const landed = this.zone;
      if (landed && left && landed.id !== left.id) messages.push(...this.crossing(left, landed, true));
      return { kind: 'moved', messages, arrived };
    }
    // Over the line into the next zone of the outdoors: what the way between them says, if anything,
    // and how the land feels.
    if (zone && left && zone !== left) messages.push(...this.crossing(left, zone));
    messages.push(...this.eventsHere());
    this.moveMonsters();
    // What comes into sight is said before the fight it may start.
    messages.push(...this.sightings());
    // A group that talks puts its question first (#544).
    const encounter = this.adjacentGroups(), asks = encounter.find((id) => this.question(id));
    return asks ? { kind: 'moved', messages, asks } : { kind: 'moved', messages, encounter: encounter.length ? encounter : undefined };
  }

  /**
   * What the log says crossing from one zone map into another (EXPANSION §5.2): the way's arrival
   * line, if it has one; the land's name where the atlas zone changes, unless the arrival line said
   * it; and how the land feels, all as one entry of the log where its floor is over the company's level and is new or higher than
   * the one left: harder one or two under, a plainer warning three or more under, in the zone's own
   * words if it has them. Never a wall. Stepping straight back over a line just crossed says no more
   * than the way's own line. A way `jumped` from one zone map to another has no arrival line: its
   * exit's label is said before this, as its own entry, and the land is named here.
   */
  private crossing(left: MapZone, zone: MapZone, jumped = false): string[] {
    const arrival = jumped ? undefined : zone.enter?.[left.id], was = this.lastCross, now = this.state.minutes;
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

  /** Town Portal's town: the last town visited, Helmstow (the maps' first town) before any. */
  portalTown(): string {
    return this.state.lastTown && this.maps[this.state.lastTown] ? this.state.lastTown : Object.values(this.maps).find((m) => m.kind === 'town')!.id;
  }

  /** Town Portal: back to the start cell of the last town visited (Helmstow before any). */
  townPortal(): string {
    const id = this.portalTown(), m = this.maps[id];
    this.travel(id, m.def.start.x, m.def.start.y, m.def.start.facing);
    this.state.truce = 0; this.state.truceGroups = [];
    return m.name;
  }

  /** Whether a lock opens to the company without a key: a Lockpick standing, or a set of picks carried (#857). */
  get picks(): boolean { return !!skilled(this.tables.items, this.party, 'lockpick'); }

  /**
   * Open an iron lock, a door's or a locked chest's (#857): a Lockpick standing, or a set of picks
   * carried, picks it and keeps the key; else an iron key carried turns it and is spent. The line it
   * says, or '' where nothing opens it, and nothing is spent.
   */
  unlock(): string {
    const pick = skilled(this.tables.items, this.party, 'lockpick');
    if (pick) return `${pick.name} picks the lock.`;
    return takeItem(this.party, 'key_iron') ? 'The lock turns. The key crumbles.' : '';
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

  reveal(radius = 1): void { reveal(this, radius); }

  hidden(x: number, y: number): boolean { return hidden(this, x, y); }

  revealAll(radius: number): void { revealAll(this, radius); }

  explored(x: number, y: number): boolean { return explored(this, x, y); }

  // ---- monsters ----
  liveGroups(): LiveGroup[] { return liveGroups(this); }

  groupsInSight(): LiveGroup[] { return groupsInSight(this); }

  meet(ids: readonly string[]): string[] { return meet(this, ids); }

  sightings(): string[] { return sightings(this); }

  sees(x: number, y: number): boolean { return sees(this, x, y); }

  groupAt(x: number, y: number): LiveGroup | undefined { return groupAt(this, x, y); }

  moveMonsters(): void { moveMonsters(this); }

  adjacentGroups(): string[] { return adjacentGroups(this); }

  question(id: string): Choice | undefined { return question(this, id); }

  standsAside(def: EncounterDef): boolean { return standsAside(this, def); }

  groupDefs(ids: string[]): { id: string; monsters: string[]; back?: number; leader?: string; under?: 'ice' }[] { return groupDefs(this, ids); }

  killGroups(ids: string[]): string[] { return killGroups(this, ids); }

  flee(ids: string[]): void { flee(this, ids); }

  stepOut(): boolean { return stepOut(this); }

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
   * else always is, having none. A feature of another map than the party's names it (`walks`).
   */
  present(f: Feature, on?: string): boolean {
    const p = f as Presence;
    return this.walks(p, f.x, f.y, on) && !this.ended(p);
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
      if (f.kind === 'sign') out.push(...signSays(this.tables.items, this, f));
    }
    return out;
  }

  used(id: string): boolean { return !!this.mapState.used[id]; }
  markUsed(id: string): void { this.mapState.used[id] = 1; }

  /**
   * Search the wall ahead for a secret door. Returns true if one was found. With a member standing who
   * has Perception (game/skills.ts; the elves and the gnomes are born to it) the find is sure, and in
   * the wall past an open square ahead too; Keen Eyes is the sure find in the wall ahead alone; else
   * it is found one time in two (#856).
   */
  search(): boolean {
    const { x, y, facing } = this.state, up = this.party.members.filter((m) => !isDown(m));
    const perception = up.some((m) => hasSkill(m, 'perception'));
    const found = (at: { x: number; y: number }): boolean => { this.map.at(at.x, at.y).door = 'door'; this.mapState.doors[`${at.x},${at.y}`] = 'door'; return true; };
    const a = this.map.ahead(x, y, facing), c = this.map.at(a.x, a.y);
    if (c.door === 'secret') return perception || up.some((m) => hasTrait(m, 'keen_eyes')) || this.rng.chance(0.5) ? found(a) : false;
    const b = this.map.ahead(x, y, facing, 2);
    return perception && c.solid === 'none' && c.door === 'none' && this.map.at(b.x, b.y).door === 'secret' ? found(b) : false;
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
/** How an enclave feels to a company one or two levels under its floor, and three or more (`enclaveLine`). */
export const HARDER_IN = 'What lives in here is harder than the road outside.';
export const WARNING_IN = 'Nothing in here would spare you. The way out is still open.';

/**
 * What an enclave's door says to a company of `level` crossing in from beyond it, or from a level
 * whose floor is under its own (#845), as one entry of the log: its name and band, as its sign gives
 * them; and how it feels, as a border says it (`World.crossing`): harder one or two under its floor,
 * a plainer warning three or more under, nothing more at its floor or over. Never a wall. Undefined
 * for a map that is no enclave.
 */
export function enclaveLine(def: Pick<MapDef, 'name' | 'band' | 'enclave'>, level: number): string | undefined {
  if (!def.enclave || !def.band) return undefined;
  const under = def.band[0] - level;
  const feel = under <= 0 ? '' : under <= 2 ? HARDER_IN : WARNING_IN;
  return [`${def.name}: levels ${def.band[0]}-${def.band[1]}.`, feel].filter(Boolean).join(' ');
}

/** What the log says as the tide turns, near the ground it covers. */
const TIDE_TEXT: Record<Tide, string> = {
  high: 'The tide has turned. The sea comes in over the sand.',
  low: 'The tide has turned. The sea draws off the sand.',
};

/** The steps Walk on Water and Levitate last (DESIGN §7): a shortcut over a little water or a drop, never a road. */
export const WALK_STEPS = 12;
const FLOAT_STEPS = 6;
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

/**
 * What the log says at the world's end, by what it is drawn as (#829): the sea, a mountain no one
 * climbs, or land with no way on. The bare void says the world ends.
 */
function worldsEnd(c: Cell): string {
  const look = c.look;
  if (!look) return BLOCK_TEXT.void;
  if (look.terrain === 'deep' || look.terrain === 'water') return BLOCK_TEXT.deep;
  if (look.solid === 'mountain') return 'Too steep for anyone to climb.';
  return 'There is no way on from here.';
}
