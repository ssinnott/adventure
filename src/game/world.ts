// The world: which map the party is on, where it stands, what time it is, and what has changed on
// each map. Movement, the clock, automap reveal, roaming monster groups and encounter triggers live
// here. Pure with respect to rendering and input; the Game drives it and reads the results.
import type { RngInstance } from '../lib/engine/rng.ts';
import { GameMap } from './map.ts';
import type { Feature, Exit, EncounterDef, Door } from './map.ts';
import type { Facing } from './types.ts';
import { FACING_DX, FACING_DY, turnLeft, turnRight, turnBack, manhattan } from './types.ts';
import { partyCan, takeItem, isDown } from './party.ts';
import type { Party } from './party.ts';

export const MINUTES_PER_DAY = 1440;
export const START_MINUTES = 7 * 60;

export interface GroupState { x: number; y: number; /** Minute the group was killed, or -1 while alive. */ dead: number; }

export interface MapState {
  /** One entry per cell, 1 once seen. */
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
  /** The town map last stood in; Town Portal returns here. Absent in older saves: Harrow. */
  lastTown?: string;
}

export type MoveResult =
  | { kind: 'moved'; messages: string[]; encounter?: string[]; arrived?: Exit }
  | { kind: 'blocked'; reason: string }
  | { kind: 'turned' };

export interface LiveGroup { def: EncounterDef; state: GroupState; }

export class World {
  readonly maps: Record<string, GameMap>;
  state: WorldState;
  party: Party;
  rng: RngInstance;

  constructor(maps: Record<string, GameMap>, party: Party, rng: RngInstance, state?: WorldState) {
    this.maps = maps; this.party = party; this.rng = rng;
    if (state) this.state = state;
    else {
      const first = Object.values(maps)[0];
      this.state = { mapId: first.id, x: first.def.start.x, y: first.def.start.y, facing: first.def.start.facing, minutes: START_MINUTES, maps: {}, light: 0, truce: 0, truceGroups: [], steps: 0 };
    }
    for (const id of Object.keys(this.state.maps)) this.ensureMapState(id);
    this.ensureMapState(this.state.mapId);
    this.reveal();
  }

  get map(): GameMap { return this.maps[this.state.mapId]; }
  get mapState(): MapState { return this.state.maps[this.state.mapId]; }

  ensureMapState(id: string): MapState {
    const m = this.maps[id];
    if (!m) throw new Error(`unknown map '${id}'`);
    let ms = this.state.maps[id];
    if (!ms) {
      ms = { explored: new Array(m.width * m.height).fill(0), used: {}, groups: {}, doors: {} };
      for (const e of m.encounters) ms.groups[e.id] = { x: e.x, y: e.y, dead: -1 };
      this.state.maps[id] = ms;
    }
    for (const [k, d] of Object.entries(ms.doors)) { const [x, y] = k.split(',').map(Number); m.at(x, y).door = d; }
    return ms;
  }

  // ---- time ----
  get day(): number { return Math.floor(this.state.minutes / MINUTES_PER_DAY) + 1; }
  get hour(): number { return Math.floor((this.state.minutes % MINUTES_PER_DAY) / 60); }
  get minute(): number { return this.state.minutes % 60; }
  /** 0 at midnight, 1 at noon: a triangle wave the sky and lighting read. */
  get daylight(): number {
    const h = (this.state.minutes % MINUTES_PER_DAY) / 60;
    // Dark 20:00-05:00, full light 08:00-17:00, dawn and dusk between.
    if (h < 5 || h >= 20) return 0;
    if (h < 8) return (h - 5) / 3;
    if (h < 17) return 1;
    return 1 - (h - 17) / 3;
  }
  get isDark(): boolean { return this.daylight < 0.25 && this.map.kind !== 'dungeon'; }
  /** How far the party can see: 4 by day or with light, 1 in a dark dungeon without a torch. */
  get sight(): number {
    if (this.state.light > 0) return 4;
    if (this.map.kind === 'dungeon') return 2;
    return this.isDark ? 2 : 4;
  }

  advance(minutes: number): void {
    this.state.minutes += minutes;
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
    const pass = this.map.passable(nx, ny, partyCan(this.party));
    if (pass !== 'ok' && pass !== 'unlock') return { kind: 'blocked', reason: BLOCK_TEXT[pass] };
    const gate = this.map.exitAt(nx, ny);
    if (gate?.needFlag && ![gate.needFlag].flat().every((k) => this.party.flags[k])) return { kind: 'blocked', reason: gate.blockedText ?? 'The way is closed.' };
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
    this.advance(this.map.kind === 'outdoor' ? 6 : 2);
    if (this.state.light > 0) this.state.light--;
    if (this.state.truce > 0 && --this.state.truce === 0) this.state.truceGroups = [];
    this.reveal();
    const arrived = this.map.exitAt(nx, ny);
    if (arrived) {
      this.travel(arrived.to, arrived.tx, arrived.ty, arrived.tf);
      if (arrived.label) messages.push(arrived.label);
      return { kind: 'moved', messages, arrived };
    }
    messages.push(...this.eventsHere());
    this.moveMonsters();
    const encounter = this.adjacentGroups();
    return { kind: 'moved', messages, encounter: encounter.length ? encounter : undefined };
  }

  travel(to: string, x: number, y: number, facing?: Facing): void {
    this.ensureMapState(to);
    this.state.mapId = to; this.state.x = x; this.state.y = y;
    if (facing !== undefined) this.state.facing = facing;
    if (this.map.kind === 'town') this.state.lastTown = to;
    this.reveal();
  }

  /** Town Portal: back to the start cell of the last town visited (Harrow before any). */
  townPortal(): string {
    const id = this.state.lastTown && this.maps[this.state.lastTown] ? this.state.lastTown : Object.values(this.maps).find((m) => m.kind === 'town')!.id;
    const m = this.maps[id];
    this.travel(id, m.def.start.x, m.def.start.y, m.def.start.facing);
    this.state.truce = 0; this.state.truceGroups = [];
    return m.name;
  }

  /** Mark cells around the party seen: the four neighbours always, more with sight. */
  reveal(radius = 1): void {
    const ms = this.mapState, m = this.map;
    const r = Math.max(radius, this.map.kind === 'outdoor' && !this.isDark ? 2 : 1);
    for (let dy = -r; dy <= r; dy++) for (let dx = -r; dx <= r; dx++) {
      const x = this.state.x + dx, y = this.state.y + dy;
      if (m.inBounds(x, y)) ms.explored[y * m.width + x] = 1;
    }
    // And the corridor ahead, as far as the eye sees, so the automap matches the viewport.
    const f = this.state.facing;
    for (let d = 1; d <= this.sight; d++) {
      const x = this.state.x + FACING_DX[f] * d, y = this.state.y + FACING_DY[f] * d;
      if (!m.inBounds(x, y)) break;
      for (let s = -1; s <= 1; s++) {
        const sx = x + (f === 0 || f === 2 ? s : 0), sy = y + (f === 1 || f === 3 ? s : 0);
        if (m.inBounds(sx, sy)) ms.explored[sy * m.width + sx] = 1;
      }
      if (m.blocksView(x, y)) break;
    }
  }

  revealAll(radius: number): void {
    const ms = this.mapState, m = this.map;
    for (let dy = -radius; dy <= radius; dy++) for (let dx = -radius; dx <= radius; dx++) {
      const x = this.state.x + dx, y = this.state.y + dy;
      if (m.inBounds(x, y)) ms.explored[y * m.width + x] = 1;
    }
  }

  explored(x: number, y: number): boolean { return !!this.mapState.explored[y * this.map.width + x]; }

  // ---- monsters ----
  /** Live groups on the current map. */
  liveGroups(): LiveGroup[] {
    const out: LiveGroup[] = [];
    const ms = this.mapState;
    for (const def of this.map.encounters) {
      const st = ms.groups[def.id];
      if (!st) continue;
      if (st.dead >= 0) {
        if (def.respawn && this.state.minutes - st.dead >= def.respawn) { st.dead = -1; st.x = def.x; st.y = def.y; }
        else continue;
      }
      out.push({ def, state: st });
    }
    return out;
  }

  groupAt(x: number, y: number): LiveGroup | undefined {
    return this.liveGroups().find((g) => g.state.x === x && g.state.y === y);
  }

  private monsterPassable(x: number, y: number): boolean {
    const c = this.map.at(x, y);
    if (c.solid !== 'none' || c.terrain === 'deep' || c.terrain === 'water' || c.door === 'locked') return false;
    return !this.groupAt(x, y);
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
        if (this.monsterPassable(g.state.x + sx, g.state.y + sy)) { g.state.x += sx; g.state.y += sy; break; }
      }
    }
  }

  /** Group ids within one cell of the party, up to 3 groups and 12 monsters. */
  adjacentGroups(): string[] {
    const ids: string[] = [];
    let n = 0;
    for (const g of this.liveGroups()) {
      if (this.state.truceGroups.includes(g.def.id)) continue;
      if (manhattan(g.state.x, g.state.y, this.state.x, this.state.y) > 1) continue;
      if (ids.length >= 3 || n + g.def.monsters.length > 12) break;
      ids.push(g.def.id); n += g.def.monsters.length;
    }
    return ids;
  }

  groupDefs(ids: string[]): { id: string; monsters: string[] }[] {
    return ids.map((id) => { const e = this.map.encounters.find((x) => x.id === id)!; return { id, monsters: e.monsters }; });
  }

  killGroups(ids: string[]): void {
    for (const id of ids) { const st = this.mapState.groups[id]; if (st) st.dead = this.state.minutes; }
  }

  /** After a successful flight: step back if possible and grant a truce with those groups. */
  flee(ids: string[]): void {
    this.state.truce = 4; this.state.truceGroups = ids;
    const f = turnBack(this.state.facing);
    const nx = this.state.x + FACING_DX[f], ny = this.state.y + FACING_DY[f];
    if (this.map.passable(nx, ny, partyCan(this.party)) === 'ok' && !this.groupAt(nx, ny)) { this.state.x = nx; this.state.y = ny; }
  }

  // ---- features ----
  /** The interactable in the party's cell, else the one directly ahead. */
  featureHere(): Feature | undefined {
    const here = this.map.featuresAt(this.state.x, this.state.y).filter((f) => f.kind !== 'event');
    if (here.length) return here[0];
    const a = this.map.ahead(this.state.x, this.state.y, this.state.facing);
    return this.map.featuresAt(a.x, a.y).filter((f) => f.kind !== 'event' && f.kind !== 'sign')[0];
  }

  /** Event and sign texts for the party's cell; once-only events are marked used. */
  eventsHere(): string[] {
    const out: string[] = [];
    for (const f of this.map.featuresAt(this.state.x, this.state.y)) {
      if (f.kind === 'event' && !(f.once && this.mapState.used[f.id])) { out.push(f.text); if (f.once) this.mapState.used[f.id] = 1; }
      if (f.kind === 'sign') out.push(`A sign reads: "${f.text}"`);
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
    const perceptive = this.party.members.some((m) => !isDown(m) && (m.race === 'elf' || m.race === 'gnome' || m.cls === 'thief'));
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

const BLOCK_TEXT: Record<string, string> = {
  wall: 'A wall blocks the way.',
  blocked: 'Something blocks the way.',
  mountain: 'Too steep to climb without a Mountaineer.',
  water: 'The water is too deep to wade.',
  deep: 'The water is far too deep.',
  locked: 'Locked. A key would open it.',
};
