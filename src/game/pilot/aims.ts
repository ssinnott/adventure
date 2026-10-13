// The strategist (#720): what the pilot is for. The one quest's goal first, then the nearest side or
// seeking quest's, each on the map its goal names; where that map lies in a zone over two levels past
// the company, levelling in the nearest zone it has trodden that is not; and with no goal, walking the
// map it stands on, or the nearest with something unseen, or one past a way it has seen and not taken.
// It goes by the ways it has seen, names the map or the zone to the explorer (#718) and leaves the
// walking to the navigator (#717): on the way a fight, a chest it opens, an event or a person (#721)
// moves the goal on. Three days on one goal and the goal is lost, said so, and tried again once the
// company has a level or a flag more. Crossed into a zone too strong for it that it is not bound for,
// it steps back. It reads the world only through Known: a zone's band once it has set foot there.
import type { Game } from '../game.ts';
import { ExploreScreen } from '../game.ts';
import type { Action } from '../../input.ts';
import { passCell } from '../map.ts';
import type { Exit, MapZone } from '../map.ts';
import { companyLevel } from '../party.ts';
import { questLog, goalMap } from '../quests.ts';
import type { QuestView } from '../quests.ts';
import { areaOf, worldPoint } from '../atlas.ts';
import { FACING_DX, FACING_DY } from '../types.ts';
import { ATLAS, THE_QUEST } from '../../content/index.ts';
import type { Known } from './known.ts';
import type { Brain, Pilot } from './pilot.ts';
import { route, routeMaps, nearestOn, stops, wayTo } from './route.ts';
import type { Goal } from './route.ts';
import { explore, frontier } from './explore.ts';
import { meeting } from './talk.ts';

export type Aim =
  | { kind: 'quest'; quest: string; map: string; text: string }
  | { kind: 'level'; zone: string; to: number }
  | { kind: 'explore'; map: string };

/** Three days on one goal, its words unchanged, and the goal is lost. */
export const LOST_AFTER = 3 * 24 * 60;
/** The why line stepping back out of a zone too strong for the company. */
export const BACK = 'Too strong for us yet: back.';
/** The why line's second, bound for a quest's goal with no way on: it searches where it stands, ten minutes a press, so the three days pass. */
export const WAIT = 'No way on yet: waiting.';
/** The most of a goal's words the why line gives. */
const CUT = 48;
/** The far squares of a zone a levelling company walks to and fro between, the nearest of them by the route. */
const FAR = 8;

/** A name to say in a line: "The" made "the" within it. */
const within = (s: string): string => s.replace(/^The /, 'the ');
/** The company's levels, all its members' together, and its flags: what a lost goal waits on. */
const levels = (g: Game): number => g.party.members.reduce((t, m) => t + m.level, 0);
const flags = (g: Game): number => Object.keys(g.party.flags).length;

/** What a map or a zone of the outdoors is called. */
function nameOf(g: Game, map: string): string {
  const at = g.world.locate(map, 0, 0);
  return (at.mapId === map ? g.maps[map]?.name : g.maps[at.mapId]?.zones.find((z) => z.id === map)?.name) ?? map;
}

/** Where the party stands on the world map: its square outdoors, else where its map is placed, a dungeon at its home map's. */
function here(g: Game, k: Known): readonly [number, number] | undefined {
  const w = g.world, z = w.zone;
  return z ? worldPoint(ATLAS, z.id, w.state.x - z.x, w.state.y - z.y) ?? undefined : k.placeOf(w.state.mapId);
}
const far = (a: readonly [number, number] | undefined, b: readonly [number, number] | undefined): number => (a && b ? Math.hypot(a[0] - b[0], a[1] - b[1]) : Infinity);

/** A zone it knows to be over two levels past the company: its band is known once it has set foot there. */
const beyond = (g: Game, k: Known, map: string): boolean => (k.band(map)?.[0] ?? 0) > companyLevel(g.party) + 1;

/**
 * Rules 1 to 3: the one quest's goal, on the map it names and not lost; else the nearest side or
 * seeking quest's, by the world map; and where that map lies in a zone known over two levels past the
 * company, a level in the nearest zone trodden that is not past it. With the goal's words it is for.
 */
function questAim(g: Game, k: Known, p: Pilot): [Aim, string] | null {
  const log = questLog(g.world.state, g.party), now = { levels: levels(g), flags: flags(g) }, from = here(g, k);
  const open = (v: QuestView): Extract<Aim, { kind: 'quest' }> | null => {
    const map = v.done || v.goal === null ? undefined : goalMap(v), was = v.goal === null ? undefined : p.lost.get(v.goal);
    if (!map || (was && now.levels <= was.levels && now.flags <= was.flags)) return null;
    return { kind: 'quest', quest: v.def.id, map, text: v.goal! };
  };
  const one = log.find((v) => v.def === THE_QUEST), side = log.filter((v) => v.def !== THE_QUEST).map(open).filter((q): q is Extract<Aim, { kind: 'quest' }> => q !== null);
  const quest = (one && open(one)) ?? side.sort((a, b) => far(from, k.placeOf(a.map)) - far(from, k.placeOf(b.map)))[0];
  if (!quest) return null;
  const level = companyLevel(g.party), zone = k.zoneOf(quest.map), band = zone === undefined ? undefined : k.band(zone);
  if (!band || band[0] <= level + 1) return [quest, quest.text];
  const safe = k.zones().filter((z) => (k.band(z)?.[0] ?? Infinity) <= level).sort((a, b) => far(from, k.placeOf(a)) - far(from, k.placeOf(b)))[0];
  return safe ? [{ kind: 'level', zone: safe, to: band[0] - 1 }, quest.text] : [quest, quest.text];
}

/** Whether two zones' boxes share an edge. */
const touch = (a: MapZone, b: MapZone): boolean =>
  ((a.x + a.w === b.x || b.x + b.w === a.x) && a.y < b.y + b.h && b.y < a.y + a.h) || ((a.y + a.h === b.y || b.y + b.h === a.y) && a.x < b.x + b.w && b.x < a.x + a.w);

/** The zones of the outdoors it has trodden and those beside them, as the world map draws their boxes: the ones it may have seen into. */
function zonesNear(g: Game, k: Known): string[] {
  const trod = new Set(k.zones()), first = k.zones()[0], all = first === undefined ? [] : g.maps[k.mapOf(first)]?.zones ?? [];
  return all.filter((z) => trod.has(z.id) || all.some((t) => trod.has(t.id) && touch(z, t))).map((z) => z.id);
}

/** A map or zone the explorer had nothing more to walk in, and no flag set since. */
const walkedOut = (g: Game, p: Pilot, map: string): boolean => (p.walked.get(map) ?? -1) >= flags(g);

/**
 * Rule 4, the maps and zones to walk, the first first: the one it stands on while it has a square
 * unseen beside one seen, a zone's across its line too; then, nearest first by the world map, a map
 * visited or a zone trodden or beside one with such a square, and a map, or the zone of the outdoors,
 * past a way it has seen and not taken, the way not shut. None it has walked out with no flag set
 * since, nor a zone it knows too strong for it.
 */
function walks(g: Game, k: Known, p: Pilot): string[] {
  const w = g.world, st = w.state, ground = w.zone?.id ?? st.mapId, from = here(g, k), trod = new Set(k.zones());
  const fit = (m: string): boolean => !walkedOut(g, p, m) && !beyond(g, k, m);
  const unseen = (m: string): boolean => (fit(m) && frontier(k, g, m).length > 0) || (!beyond(g, k, m) && rim(g, k, m).length > 0);
  const maps = k.visited().filter((m) => !g.maps[m]?.zones.length);
  // A way out onto the outdoors leads into the zone it lands in, as the world map's boxes show.
  const past = k.visited().flatMap((m) => k.exits(m).filter((e) => !p.shut.some((s) => s.map === m && s.x === e.x && s.y === e.y)).map((e) => g.maps[e.to]?.zoneAt(e.tx, e.ty)?.id ?? e.to))
    .filter((to) => (k.mapOf(to) === to ? !st.maps[to] : !trod.has(to)) && fit(to));
  const rest = [...new Set([...[...maps, ...zonesNear(g, k)].filter((m) => m !== ground && unseen(m)), ...past])].filter((m) => m !== ground);
  return [...(unseen(ground) ? [ground] : []), ...rest.sort((a, b) => far(from, k.placeOf(a)) - far(from, k.placeOf(b)))];
}

/** The aim, by the rules: the one quest, a side or seeking quest, a level, or a map to walk; null with none. */
export function chooseAim(g: Game, k: Known, p: Pilot): Aim | null {
  const quest = questAim(g, k, p);
  if (quest) return quest[0];
  const map = walks(g, k, p)[0];
  return map === undefined ? null : { kind: 'explore', map };
}

/** The strategist's own goals, told from another brain's: one it no longer wants it lets go. */
const MINE = new WeakSet<Goal>();

const drop = (p: Pilot): void => { if (p.goal && MINE.has(p.goal)) { p.goal = null; p.trip = null; p.plan = []; } };

/** Bound for `goal`, where it has seen a way there round every way shut to the navigator: the navigator's first key, or null, the goal let go. */
function go(g: Game, k: Known, p: Pilot, goal: Goal): Action | null {
  const at = g.world.locate(goal.map, goal.x, goal.y);
  if (p.shut.some((s) => s.map === at.mapId && s.x === at.x && s.y === at.y) || !wayTo(k, g.world.state, at, p.shut)) return null;
  MINE.add(goal);
  p.goal = goal; p.trip = null; p.plan = [];
  const key = route(g, k, p);
  if (!key) drop(p);
  return key;
}

/** Bound for a way off, named by where it leads. */
const off = (g: Game, k: Known, p: Pilot, map: string, e: Exit, why: string): Action | null =>
  go(g, k, p, { map, x: e.x, y: e.y, name: within(nameOf(g, e.to)), why });

/** The explorer on `prefer`: its first key, or null, and where that walks the ground the party stands on, that ground marked walked out. */
function roam(g: Game, k: Known, p: Pilot, prefer: string): Action | null {
  p.prefer = prefer;
  const key = explore(g, k, p), w = g.world, ground = w.zone?.id ?? w.state.mapId;
  // The explorer walks the zone preferred where it lies on the outdoors the party is on, else where it stands.
  if (!key && (prefer === ground || !w.map.zones.some((z) => z.id === prefer))) p.walked.set(ground, flags(g));
  return key;
}

/**
 * The first key towards a map or a zone of the outdoors, and over it. Off its game map: the way into
 * it, or into the zone it opens onto, on the first route there by ways seen; else that zone, where it
 * lies on the outdoors the party is on, walked to as below, and where it does not, the explorer walks
 * where the party stands. On it: the explorer walks it, and a zone stood in walked out, its edge where
 * it has seen nothing across the line. Outdoors, short of a zone with nothing to walk to in it: the
 * nearest square seen in it; a way seen into it; the zone nearest it it has trodden or seen into,
 * walked or its edge looked across; else a way into a zone not trodden, the nearest it first.
 */
function walk(g: Game, k: Known, p: Pilot, map: string, why: string): Action | null {
  const w = g.world, st = w.state, zone = k.zoneOf(map);
  if (k.mapOf(map) !== st.mapId) {
    for (const to of new Set([map, zone ?? map])) {
      const last = routeMaps(k, st.mapId, to, p.shut)?.at(-1), key = last && off(g, k, p, last.map, last.exit, why);
      if (key) return key;
    }
    // No way seen into a town or a dungeon: the zone it opens onto, as any zone of these outdoors.
    return zone && k.mapOf(zone) === st.mapId ? walk(g, k, p, zone, why) : roam(g, k, p, zone ?? map);
  }
  const key = roam(g, k, p, map);
  if (key || zone !== map) return key;
  if (w.zone?.id === map) return peek(g, k, p, map, why);
  // The nearest square seen in it, as a zone walked out is walked back into.
  const shut = p.shut.filter((s) => s.map === st.mapId), seen = squares(g, k, map);
  const near = seen.length ? nearestOn(k, st.mapId, st.x, st.y, st.facing, seen, shut) : null;
  const inn = near && go(g, k, p, { map: st.mapId, x: near.x, y: near.y, name: within(nameOf(g, map)), why });
  if (inn) return inn;
  const to = k.placeOf(map), nearest = (a: string, b: string): number => far(k.placeOf(a), to) - far(k.placeOf(b), to);
  const ways = k.exits(st.mapId).filter((e) => e.to !== w.zone?.id && k.mapOf(e.to) === st.mapId && !shut.some((s) => s.x === e.x && s.y === e.y));
  for (const e of ways.filter((q) => q.to === map)) { const on = off(g, k, p, st.mapId, e, why); if (on) return on; }
  for (const z of zonesNear(g, k).filter((q) => q !== map && !beyond(g, k, q)).sort(nearest)) {
    const on = (!walkedOut(g, p, z) && roam(g, k, p, z)) || peek(g, k, p, z, why);
    if (on) return on;
  }
  const fresh = ways.filter((e) => !k.zones().includes(e.to) && !beyond(g, k, e.to)).sort((a, b) => nearest(a.to, b.to));
  for (const e of fresh) { const on = off(g, k, p, st.mapId, e, why); if (on) return on; }
  return null;
}

/** Whether the company steps onto a seen square of `map`, as the navigator reads it. */
function floor(k: Known, map: string, x: number, y: number): boolean {
  const c = k.cell(map, x, y), pass = c && passCell(c, k.can());
  return pass === 'ok' || pass === 'unlock';
}

/** The seen squares of a zone the company may stand on, none a stop (route.ts), on the map as played. */
function squares(g: Game, k: Known, zone: string): { x: number; y: number }[] {
  const { w, h } = k.size(zone), o = g.world.locate(zone, 0, 0), barred = new Set(stops(k, zone).map((q) => `${q.x},${q.y}`)), out: { x: number; y: number }[] = [];
  for (let y = 0; y < h; y++) for (let x = 0; x < w; x++) if (!barred.has(`${x},${y}`) && floor(k, zone, x, y)) out.push({ x: x + o.x, y: y + o.y });
  return out;
}

/**
 * The squares on a zone's edge the company may stand on with a square of another zone across the line
 * unseen, none a stop: what the explorer, which walks a zone with its edge closed, leaves unseen. On
 * the map as played.
 */
function rim(g: Game, k: Known, zone: string): { x: number; y: number }[] {
  const o = g.world.locate(zone, 0, 0), m = g.maps[o.mapId], z = m?.zones.find((q) => q.id === zone);
  if (!m || !z) return [];
  const barred = new Set(stops(k, zone).map((q) => `${q.x},${q.y}`)), out: { x: number; y: number }[] = [];
  for (let y = 0; y < z.h; y++) for (let x = 0; x < z.w; x++) {
    if ((x > 0 && y > 0 && x < z.w - 1 && y < z.h - 1) || barred.has(`${x},${y}`) || !floor(k, zone, x, y)) continue;
    if (FACING_DX.some((dx, f) => {
      const nx = x + dx, ny = y + FACING_DY[f], gx = nx + o.x, gy = ny + o.y;
      return (nx < 0 || ny < 0 || nx >= z.w || ny >= z.h) && !!m.zoneAt(gx, gy) && !k.seen(o.mapId, gx, gy);
    })) out.push({ x: x + o.x, y: y + o.y });
  }
  return out;
}

/** To the nearest square on a zone's edge with another zone across it unseen, to look across. */
function peek(g: Game, k: Known, p: Pilot, zone: string, why: string): Action | null {
  const st = g.world.state, edge = rim(g, k, zone);
  const near = edge.length ? nearestOn(k, st.mapId, st.x, st.y, st.facing, edge, p.shut.filter((s) => s.map === st.mapId)) : null;
  return near && go(g, k, p, { map: st.mapId, x: near.x, y: near.y, name: `the edge of ${within(nameOf(g, zone))}`, why });
}

/** Levelling: the zone walked; walked out, at the nearest group in sight, else to and fro across it, for the fights to come. */
function level(g: Game, k: Known, p: Pilot, zone: string, why: string): Action | null {
  const key = walk(g, k, p, zone, why), w = g.world, st = w.state;
  if (key || w.zone?.id !== zone) return key;
  const shut = p.shut.filter((s) => s.map === st.mapId), foes = k.groups(st.mapId);
  p.why = [why];
  if (foes.some((q) => q.x === st.x + FACING_DX[st.facing] && q.y === st.y + FACING_DY[st.facing])) return 'forward';
  const by = foes.length ? nearestOn(k, st.mapId, st.x, st.y, st.facing, foes.flatMap((q) => FACING_DX.map((dx, f) => ({ x: q.x + dx, y: q.y + FACING_DY[f] }))), shut) : null;
  const at = by && go(g, k, p, { map: st.mapId, x: by.x, y: by.y, name: 'the group', why });
  if (at) return at;
  const away = squares(g, k, zone).sort((a, b) => Math.hypot(b.x - st.x, b.y - st.y) - Math.hypot(a.x - st.x, a.y - st.y)).slice(0, FAR);
  const there = nearestOn(k, st.mapId, st.x, st.y, st.facing, away, shut);
  return there && go(g, k, p, { map: st.mapId, x: there.x, y: there.y, name: within(nameOf(g, zone)), why });
}

/** The why line an aim is set with. */
function lines(g: Game, aim: Aim): [string, string?] {
  switch (aim.kind) {
    case 'quest': {
      const text = aim.text.length > CUT ? `${aim.text.slice(0, CUT - 1).trimEnd()}…` : aim.text.replace(/\.$/, '') + '.';
      return [`Bound for ${within(nameOf(g, aim.map))}.`, text];
    }
    case 'level': return [`Levelling in ${within(nameOf(g, aim.zone))} to ${aim.to}.`];
    case 'explore': return [`Walking ${within(nameOf(g, aim.map))}.`];
  }
}

/** Sets the aim: when, the goal's words, the why line, and what it was bound for let go. */
function set(g: Game, p: Pilot, aim: Aim | null, goal: string): void {
  drop(p);
  p.aim = aim; p.aimSince = g.world.state.minutes; p.aimGoal = goal; p.prefer = null;
  if (aim) p.why = lines(g, aim);
}

/** The zone an aim takes the company into, if any: a quest's map's, or the level's. */
const into = (k: Known, aim: Aim | null): string | undefined => (aim?.kind === 'quest' ? k.zoneOf(aim.map) : aim?.kind === 'level' ? aim.zone : undefined);

/** A chest seen on the party's map with a way to it, none it found no way to with no flag set since: the key there, or Space on it. */
function chest(g: Game, k: Known, p: Pilot): Action | null {
  const st = g.world.state, at = (q: { x: number; y: number }): string => `${st.mapId}:${q.x},${q.y}`;
  const chests = k.features(st.mapId).filter((f) => f.kind === 'chest' && (p.chests.get(at(f)) ?? -1) < flags(g));
  if (chests.some((f) => f.x === st.x && f.y === st.y)) { p.why = ['Opening the chest.']; return 'interact'; }
  const near = chests.length ? nearestOn(k, st.mapId, st.x, st.y, st.facing, chests, p.shut.filter((s) => s.map === st.mapId)) : null;
  const key = near && go(g, k, p, { map: st.mapId, x: near.x, y: near.y, name: 'the chest', why: 'To the chest.' });
  if (!key) for (const f of near ? [near] : chests) p.chests.set(at(f), flags(g));
  return key;
}

/**
 * The brain, on the street: the aim chosen anew where the quests give another; three days on one
 * goal and it is lost; a crossing into a zone too strong for the company that the aim is not in,
 * stepped back from; Space on a chest stood on. A walk under way goes on, the navigator's; once it is
 * done, or with none, the aim chosen anew where the walks give another, a chest on the map opened, a
 * person, a guild or a statue near or on the aim's map gone to (talk.ts, #721), and the aim walked; a
 * quest's with no way on, it searches where it stands, so the three days pass.
 */
export const aims: Brain = (g, k, p) => {
  if (!(g.top instanceof ExploreScreen)) return null;
  const st = g.world.state, quest = questAim(g, k, p);
  if (quest ? JSON.stringify(quest[0]) !== JSON.stringify(p.aim) : p.aim && p.aim.kind !== 'explore') set(g, p, quest?.[0] ?? null, quest?.[1] ?? '');
  if (p.aim?.kind === 'quest' && st.minutes - p.aimSince >= LOST_AFTER) {
    const zone = k.zoneOf(p.aim.map), line = `Lost in ${within(areaOf(ATLAS, zone ?? p.aim.map)?.name ?? nameOf(g, p.aim.map))}: three days, and no way on.`;
    p.lost.set(p.aimGoal, { levels: levels(g), flags: flags(g) });
    set(g, p, null, '');
    g.say(line);
    p.why = [line];
    return null;
  }
  // Over the line into a zone too strong for it, and not the aim's: back to the square before it.
  const [now, was] = p.trail;
  if (now?.zone && was?.zone && now.zone !== was.zone && now.map === was.map && beyond(g, k, now.zone) && into(k, p.aim) !== now.zone) {
    p.goal = null;
    const key = go(g, k, p, { map: was.map, x: was.x, y: was.y, name: 'the way back', why: BACK });
    p.why = [BACK];
    if (key) return key;
  }
  if (k.features(st.mapId).some((f) => f.kind === 'chest' && f.x === st.x && f.y === st.y)) { p.why = ['Opening the chest.']; return 'interact'; }
  if (p.goal) {
    const key = route(g, k, p);
    if (key || p.goal) return key;
  }
  const maps = quest ? [] : walks(g, k, p);
  if (!quest) {
    const want: Aim | null = maps[0] === undefined ? null : { kind: 'explore', map: maps[0] };
    if (JSON.stringify(want) !== JSON.stringify(p.aim)) set(g, p, want, '');
  }
  const aim = p.aim;
  if (!aim) { p.prefer = null; return meeting(g, k, p); }
  const opened = chest(g, k, p) ?? meeting(g, k, p);
  if (opened) return opened;
  const why = lines(g, aim)[0];
  switch (aim.kind) {
    case 'quest': {
      // No way on: the clock must move for the lost rule to come, so it searches where it stands.
      const key = walk(g, k, p, aim.map, why);
      if (!key) p.why = [why, WAIT];
      return key ?? 'search';
    }
    case 'level': return level(g, k, p, aim.zone, why);
    case 'explore':
      for (const map of maps) {
        const key = walk(g, k, p, map, `Walking ${within(nameOf(g, map))}.`);
        if (!key) continue;
        if (map !== aim.map) { p.aim = { kind: 'explore', map }; p.aimSince = st.minutes; }
        return key;
      }
      p.prefer = null;
      return null;
  }
};
