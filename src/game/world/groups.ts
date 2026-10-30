// The groups (#1008, cut from game/world.ts): the monster groups that roam a map, which live, come
// back (none to a box cleared whole, #1068), step toward the party, meet it, ask it and are fought;
// which of them stand in sight and the looks said on first meeting (`sightings`); how a group is
// drawn while exploring (`groupDrawn`); the beasts an Archdruid's company is left alone by; a
// flight's step back and the step out of a business.
//
// Functions of the world, each called by World's member of the same name; World is a type here
// alone, so nothing here loads game/world.ts. It takes the view's rule from sight.ts, the one edge
// among the parts.
import type { EncounterDef, Choice } from '../mapdef.ts';
import type { GameMap } from '../map.ts';
import type { Facing } from '../types.ts';
import { FACING_DX, FACING_DY, turnBack, manhattan } from '../types.ts';
import { isDown, prestigeOf } from '../party.ts';
import { monster, KINDS } from '../monsters.ts';
import { open, given } from '../people.ts';
import { pace, denLooks, densOf } from '../dens.ts';
import type { World, LiveGroup } from '../world.ts';
import { VIEW_DEPTH, VIEW_LATERAL, viewCell, isSolidWall, lineOfSight } from './sight.ts';

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

/**
 * Each map's boxes (#1068), found once, as `densOf` finds the dens: a box is the groups of one zone
 * map on the outdoors (the one its written square lies in) and of the map anywhere else, a dungeon a
 * level at a time. A group with an `until` follows its own story (a den's brood, a Rift's) and is in
 * none: it neither keeps a box from being cleared nor is kept from coming back by one.
 */
const boxes = new WeakMap<GameMap, Map<EncounterDef, EncounterDef[]>>();
function boxOf(map: GameMap, def: EncounterDef): EncounterDef[] | undefined {
  let of = boxes.get(map);
  if (!of) {
    const by = new Map<string, EncounterDef[]>();
    of = new Map();
    for (const e of map.encounters) {
      if (e.until) continue;
      const key = map.zoneAt(e.x, e.y)?.id ?? '', box = by.get(key) ?? [];
      by.set(key, box); box.push(e); of.set(e, box);
    }
    boxes.set(map, of);
  }
  return of.get(def);
}

/**
 * Whether a group's box is cleared whole: every group of it dead at once, but one answered without
 * a fight, which stands aside for good (`standsAside`). Read off the saved minutes each time it is
 * asked, so nothing new is saved and an old save's dead box stays dead.
 */
function cleared(world: World, def: EncounterDef): boolean {
  const box = boxOf(world.map, def), groups = world.mapState.groups;
  return !!box && box.every((e) => (groups[e.id]?.dead ?? -1) >= 0 || world.standsAside(e));
}

/**
 * Live groups on the current map: a killed one back once its respawn is up, its `until` does not
 * hold and its box is not cleared whole (`cleared`, #1068), none out of its hours or before its
 * `after`, and none that leaves once its `until` holds (#747). Every reader of a standing group
 * comes here: the viewport, the sight, the square, the steps, the fight and the rest.
 */
export function liveGroups(world: World): LiveGroup[] {
  const out: LiveGroup[] = [];
  const ms = world.mapState;
  // A standing den's brood come back one a pace (game/dens.ts).
  pace(world);
  for (const def of world.map.encounters) {
    const st = ms.groups[def.id];
    if (!st) continue;
    // The leave rule: gone, standing or killed, and its record left as it was, so not killed.
    if (def.leaves && world.ended(def)) continue;
    if (st.dead >= 0) {
      if (def.respawn && world.state.minutes - st.dead >= def.respawn && !world.ended(def) && !cleared(world, def)) { st.dead = -1; st.x = def.x; st.y = def.y; }
      else continue;
    }
    if ((def.when || def.after) && !world.walks(def, def.x, def.y)) continue;
    out.push({ def, state: st });
  }
  return out;
}

/** The live groups the party can see, nearest first: the ones the viewport draws. */
export function groupsInSight(world: World): LiveGroup[] {
  const { x: px, y: py, facing: f } = world.state, m = world.map, out: LiveGroup[] = [];
  const live = world.liveGroups();
  for (let d = 1; d <= Math.min(VIEW_DEPTH, world.sight); d++) for (let l = -VIEW_LATERAL; l <= VIEW_LATERAL; l++) {
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
export function meet(world: World, ids: readonly string[]): string[] {
  const met = (world.state.met ??= []), said: string[] = [];
  for (const id of ids) {
    if (met.includes(id)) continue;
    met.push(id);
    const look = monster(world.tables.monsters, id).look;
    if (look) said.push(look);
  }
  return said;
}

/** The looks of the kinds now in sight that the company has not met: each group's kinds as it is drawn (`groupDrawn`). */
export function sightings(world: World): string[] {
  // A den's look first: the place, then what guards it.
  const dens = densOf(world.map).length ? denLooks(world, (x, y) => world.sees(x, y)) : [];
  return [...dens, ...world.meet(world.groupsInSight().flatMap((g) => groupDrawn(g.def.monsters)))];
}

export function groupAt(world: World, x: number, y: number): LiveGroup | undefined {
  return world.liveGroups().find((g) => g.state.x === x && g.state.y === y);
}

/**
 * Where a group may step: where the party could with no key, swimmer or mountaineer, and no group
 * stands; a group under the ice, only under the ice.
 */
function monsterPassable(world: World, x: number, y: number, g?: LiveGroup): boolean {
  if (g?.def.under === 'ice' && world.map.at(x, y).terrain !== 'ice') return false;
  return world.map.passable(x, y, { tide: world.tide }) === 'ok' && !world.groupAt(x, y);
}

/**
 * The level of the highest druid of the third prestige standing in the company, or 0 with none:
 * the Archdruid's perk keeps the beasts under that level off the company (DESIGN §5, #809).
 */
function archdruidLevel(world: World): number {
  return Math.max(0, ...world.party.members.filter((m) => m.cls === 'druid' && prestigeOf(m) >= 3 && !isDown(m)).map((m) => m.level));
}

/**
 * Whether a group is beasts all (a kind that routs, `KINDS`), each of a level under `level`, with
 * no leader and no caller among them: the one an Archdruid's company is left alone by. Any other
 * group comes on as it always did.
 */
function beastsUnder(world: World, def: EncounterDef, level: number): boolean {
  return !def.leader && def.monsters.every((id) => { const m = monster(world.tables.monsters, id); return KINDS[m.kind].breaks === 'rout' && !m.calls && m.level < level; });
}

/**
 * Each aware, roaming group steps one cell toward the party, but for the beasts an Archdruid
 * leaves alone (`beastsUnder`): they stay where they are, and are fought as any group is where the
 * company steps up to them or strikes them. With the druid down they come on.
 */
export function moveMonsters(world: World): void {
  if (world.state.truce > 0) return;
  const { x: px, y: py } = world.state, archdruid = archdruidLevel(world);
  for (const g of world.liveGroups()) {
    if (g.def.roams === false || world.standsAside(g.def)) continue;
    const aware = g.def.aware ?? AWARE;
    const d = manhattan(g.state.x, g.state.y, px, py);
    if (d > aware || d <= 1 || (archdruid > 0 && beastsUnder(world, g.def, archdruid))) continue;
    const dx = px - g.state.x, dy = py - g.state.y;
    const tries: [number, number][] = Math.abs(dx) >= Math.abs(dy)
      ? [[Math.sign(dx), 0], [0, Math.sign(dy)]]
      : [[0, Math.sign(dy)], [Math.sign(dx), 0]];
    for (const [sx, sy] of tries) {
      if (sx === 0 && sy === 0) continue;
      if (monsterPassable(world, g.state.x + sx, g.state.y + sy, g)) { g.state.x += sx; g.state.y += sy; break; }
    }
  }
}

/**
 * Group ids within one cell of the party, up to 3 groups and 12 monsters; a group under the ice
 * only where the party stands on the ice, and none that stands aside (#544).
 */
export function adjacentGroups(world: World): string[] {
  const ids: string[] = [];
  let n = 0;
  const onIce = world.map.at(world.state.x, world.state.y).terrain === 'ice';
  for (const g of world.liveGroups()) {
    if (world.state.truceGroups.includes(g.def.id) || world.standsAside(g.def)) continue;
    if (manhattan(g.state.x, g.state.y, world.state.x, world.state.y) > 1) continue;
    if (g.def.under === 'ice' && !onIce) continue;
    if (ids.length >= 3 || n + g.def.monsters.length > 12) break;
    ids.push(g.def.id); n += g.def.monsters.length;
  }
  return ids;
}

/** A group's question while it is still put: none of its answers given (#544). */
export function question(world: World, id: string): Choice | undefined {
  return open(world.map.encounters.find((e) => e.id === id)?.choice, world.party);
}

/**
 * Whether a group has been answered without a fight: one of its question's answers that does not
 * fight is given, so for this company it neither asks nor fights, nor follows (#544).
 */
export function standsAside(world: World, def: EncounterDef): boolean {
  return !!def.choice?.answers.some((a) => !a.fight && given(a, world.party));
}

export function groupDefs(world: World, ids: string[]): { id: string; monsters: string[]; back?: number; leader?: string; under?: 'ice' }[] {
  return ids.map((id) => { const e = world.map.encounters.find((x) => x.id === id)!; return { id, monsters: e.monsters, back: e.back, leader: e.leader, under: e.under, clock: e.clock }; });
}

/**
 * Mark the groups dead and set each one's flags as its `slainText` is said, into the party's flags
 * as an event's are (#636); returns what the log says about it.
 */
export function killGroups(world: World, ids: string[]): string[] {
  const said: string[] = [];
  for (const id of ids) {
    const st = world.mapState.groups[id]; if (st) st.dead = world.state.minutes;
    const def = world.map.encounters.find((e) => e.id === id);
    if (def?.slainText) said.push(def.slainText);
    for (const flag of [def?.sets ?? []].flat()) world.party.flags[flag] = 1;
  }
  return said;
}

/** After a successful flight: step back if possible and grant a truce with those groups. */
export function flee(world: World, ids: string[]): void {
  world.state.truce = 4; world.state.truceGroups = ids;
  const f = turnBack(world.state.facing);
  const nx = world.state.x + FACING_DX[f], ny = world.state.y + FACING_DY[f];
  if (world.map.passable(nx, ny, world.can) === 'ok' && !world.groupAt(nx, ny)) { world.state.x = nx; world.state.y = ny; }
}

/**
 * Leaving a business: out of its doorway onto the open cell beside it (the one behind the party
 * if that is open), turned to face the door again. Not a step: no time passes and nothing moves.
 * False, and nothing changes, when there is no street to step into.
 */
export function stepOut(world: World): boolean {
  const { x, y, facing } = world.state;
  const street = (f: Facing): boolean => {
    const nx = x + FACING_DX[f], ny = y + FACING_DY[f];
    return world.map.passable(nx, ny, { tide: world.tide }) === 'ok' && world.map.at(nx, ny).door === 'none' && !world.map.exitAt(nx, ny) && !world.groupAt(nx, ny);
  };
  const out = ([turnBack(facing), 0, 1, 2, 3] as Facing[]).find(street);
  if (out === undefined) return false;
  world.state.x = x + FACING_DX[out]; world.state.y = y + FACING_DY[out];
  world.state.facing = turnBack(out);
  world.reveal();
  return true;
}

/** Cells within which a group notices the party where its def gives none (`EncounterDef.aware`). */
export const AWARE = 5;
