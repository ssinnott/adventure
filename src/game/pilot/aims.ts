// The strategist (#720; docs/PILOT.md): what the pilot is for. The one quest's goal first, then a side
// or seeking quest's, nearest first; levelling where the goal's zone is above the company; walking the
// land where nothing else is known. It reads the world through Known alone: a goal's map once the
// journal shows the goal, a zone's band once the party has set foot in it. It says where it is bound,
// gives a goal up after three days with no way on, and turns back over a line into a zone too hard.
import type { Game } from '../game.ts';
import { ExploreScreen } from '../game.ts';
import type { Action } from '../../input.ts';
import { companyLevel, partyCan } from '../party.ts';
import type { Party } from '../party.ts';
import { passableCell } from '../map.ts';
import { areaOf, homeMap } from '../atlas.ts';
import { OUTDOORS } from '../outdoors.ts';
import { ATLAS, MAP_DEFS, THE_QUEST } from '../../content/index.ts';
import type { Known } from './known.ts';
import type { Brain, Pilot } from './pilot.ts';
import { route, routeMaps, routeNearest, routeLengths } from './route.ts';
import type { Goal } from './route.ts';
import { explore, frontier } from './explore.ts';

export type Aim =
  | { kind: 'quest'; quest: string; map: string; text: string }
  | { kind: 'level'; zone: string; to: number }
  | { kind: 'explore'; map: string };

/** Three days of the world's minutes on one goal with no way on: the lost rule. */
export const LOST_MINUTES = 3 * 24 * 60;
/** The longest a goal's words run in the why line before they are cut. */
const GOAL_CUT = 48;

interface Square { x: number; y: number }
type Box = { x: number; y: number; w: number; h: number };
const inside = (b: Box, x: number, y: number): boolean => x >= b.x && y >= b.y && x < b.x + b.w && y < b.y + b.h;
const at = (q: Square): string => `${q.x},${q.y}`;
/** The members' levels together: a level gained by anyone moves it, where the company's mean may not. */
const levels = (p: Party): number => p.members.reduce((t, m) => t + m.level, 0);
const flagCount = (p: Party): number => Object.keys(p.flags).length;

/** What the strategist keeps between its ticks, by pilot (outside the save, as the rest of the pilot). */
interface Mem {
  /** The zone the party stood in at the last look, and its square then: the square before a crossing. */
  zone?: string; before?: Square;
  /** By a lost goal's words: the members' levels and the flags set when it was given up. */
  lostAt: Map<string, { levels: number; flags: number }>;
  /** The maps and zones found walked out, each with what that rested on (the squares seen and the flags). */
  out: Map<string, string>;
  /** The chests the route did not reach, by "map:x,y", with the squares seen then. */
  far: Map<string, number>;
  /** The chests Space was pressed on, by "map:x,y": one still there after is not pressed on again. */
  opened: Set<string>;
  /** The company's level at the last look on a level aim: a level gained starts its three days afresh. */
  levelAt?: number;
  /** The crossings turned back at ("zone:x,y"), with the levels and flags then: once each until one moves. */
  turned: Map<string, string>;
}
const MEMS = new WeakMap<Pilot, Mem>();
function memOf(p: Pilot): Mem {
  let m = MEMS.get(p);
  if (!m) MEMS.set(p, (m = { lostAt: new Map(), out: new Map(), far: new Map(), opened: new Set(), turned: new Map() }));
  return m;
}
/** Forgets what the strategist kept: a new game or a load (`Pilot.forget`). */
export function unaim(p: Pilot): void { MEMS.delete(p); }

/** The zone of the outdoors a map lies in: a zone map's own id, a town's or a dungeon's home map's (`homeMap`). */
function zoneOf(g: Game, map: string): string | undefined {
  if (g.maps[OUTDOORS]?.zones.some((z) => z.id === map)) return map;
  return homeMap(MAP_DEFS, map)?.id;
}
/** The band of the zone a map lies in, as Known gives it: once the party has set foot in the zone. */
const zoneBand = (g: Game, k: Known, map: string): readonly [number, number] | undefined => { const z = zoneOf(g, map); return z ? k.band(z) : undefined; };
/** Whether Known gives a place a band that starts above the company's level and one. */
const tooHard = (k: Known, place: string): boolean => { const b = k.band(place); return !!b && b[0] > companyLevel(k.party) + 1; };
/** The zones set foot in whose band starts at the company's level or under, and not given up: where it can level. */
const easyZones = (k: Known, p: Pilot): string[] => k.zones().filter((z) => { const b = k.band(z); return !!b && b[0] <= companyLevel(k.party) && !p.lost.has(`level:${z}`); });
/** Whether the zone a map lies in has a band, as Known gives it, that starts above the company's level and one. */
const zoneTooHard = (g: Game, k: Known, map: string): boolean => (zoneBand(g, k, map)?.[0] ?? 0) > companyLevel(k.party) + 1;

/** What the map's sign or the world map calls a map or a zone. */
function nameOf(g: Game, id: string): string {
  return g.maps[id]?.name ?? g.maps[OUTDOORS]?.zones.find((z) => z.id === id)?.name ?? MAP_DEFS.find((d) => d.id === id)?.name ?? id;
}
/** Within a line the world map's "The Foreland" is "the Foreland". */
const within = (name: string): string => name.replace(/^The /, 'the ');
/** The area a map lies in, as the world map names it; a map's own name where no area is drawn. */
const areaName = (g: Game, map: string): string => areaOf(ATLAS, zoneOf(g, map) ?? map)?.name ?? nameOf(g, map);

/** The party's world point: its square outdoors, else where the world map places its map (a dungeon's home's). */
function pointOf(g: Game, k: Known): [number, number] | undefined {
  const st = g.world.state;
  return st.mapId === OUTDOORS ? [st.x + 0.5, st.y + 0.5] : k.placeOf(st.mapId);
}
const distance = (a: [number, number] | undefined, b: [number, number] | undefined): number => (a && b ? Math.hypot(a[0] - b[0], a[1] - b[1]) : Infinity);

/** What a map or a zone being walked out rests on: its squares seen (a zone's in its box) and the flags. */
function stamp(g: Game, k: Known, map: string): string {
  const id = g.world.locate(map, 0, 0).mapId, box = id === map ? undefined : k.box(map);
  let n = box ? 0 : k.seenCount(id);
  for (let y = box?.y ?? 0; box && y < box.y + box.h; y++) for (let x = box.x; x < box.x + box.w; x++) if (k.seen(id, x, y)) n++;
  return `${n}|${flagCount(k.party)}`;
}
const walkedOut = (g: Game, k: Known, mem: Mem, map: string): boolean => mem.out.get(map) === stamp(g, k, map);

/**
 * The aim, in order: (1) the one quest's goal, where its map is known and its words are not given up
 * (`Pilot.lost`); (2) else a side or seeking quest's, the nearest first by where the world map places
 * its map; (3) either, where its zone's band as Known gives it starts above the company's level and
 * one, gives way to levelling in the nearest zone known whose band starts at the company's level or
 * under and is not given up, to the level under the goal's zone's floor, or with none is passed
 * over; (4) else walking: the party's map (outdoors its
 * zone) until walked out, then the nearest map visited or zone set foot in not walked out, then the
 * nearest zone not yet set foot in beside one that was, then a map not visited through the nearest
 * exit seen to it. A goal given up is tried again once anyone has gained a level or a flag is set.
 */
export function chooseAim(g: Game, k: Known, p: Pilot): Aim | null {
  const mem = memOf(p);
  retry(p, mem, k.party);
  const quest = questAim(g, k, p);
  if (quest) return quest;
  const from = pointOf(g, k), far = (map: string): number => distance(k.placeOf(map), from);
  const st = g.world.state, mine = g.world.zone?.id ?? st.mapId;
  const fresh = (m: string): boolean => !walkedOut(g, k, mem, m) && !tooHard(k, m);
  if (fresh(mine)) return { kind: 'explore', map: mine };
  // A way seen into a map not walked: a town's or a dungeon's own doors first (the keep's gate from
  // Helmstow, a dungeon's stair), the land's after the land.
  const seen = new Set(k.visited()), doors = k.visited().flatMap((m) => k.exits(m).filter((e) => !seen.has(e.to) && fresh(e.to)).map((e) => ({ m, e })));
  // The land's own gate out of a town is no door of the town's: the keep before the Foreland (#723).
  const ours = doors.filter((d) => d.m === st.mapId && d.e.to !== OUTDOORS), near = ours.length ? routeNearest(k, st.mapId, st.x, st.y, st.facing, new Set(ours.map((d) => at(d.e)))) : undefined;
  const door = near && ours.find((d) => d.e.x === near.x && d.e.y === near.y);
  if (door && st.mapId !== OUTDOORS) return { kind: 'explore', map: door.e.to };
  const walked = [...k.visited().filter((m) => m !== OUTDOORS), ...k.zones()].filter(fresh).sort((a, b) => far(a) - far(b));
  if (walked.length) return { kind: 'explore', map: walked[0] };
  const trod = new Set(k.zones()), zones = g.maps[OUTDOORS]?.zones ?? [];
  const beside = zones.filter((z) => !trod.has(z.id) && zones.some((t) => trod.has(t.id) && touches(t, z))).map((z) => z.id).filter(fresh).sort((a, b) => far(a) - far(b));
  if (beside.length) return { kind: 'explore', map: beside[0] };
  const any = door ?? doors.sort((a, b) => far(a.m) - far(b.m))[0];
  if (any) return { kind: 'explore', map: any.e.to };
  // Nothing left to walk: the goals given up are tried again (#723), else the pilot stands and the clock with it.
  if (!p.lost.size) return null;
  p.lost.clear();
  mem.lostAt.clear();
  return chooseAim(g, k, p);
}

/** The goals given up whose company has since gained a level (anyone's) or set a flag: tried again. */
function retry(p: Pilot, mem: Mem, party: Party): void {
  for (const [text, then] of mem.lostAt) if (levels(party) > then.levels || flagCount(party) > then.flags) { p.lost.delete(text); mem.lostAt.delete(text); }
}

/**
 * Rules 1 to 3: the one quest's goal, else the nearest side or seeking quest's, each with its map
 * known and its words not given up; a goal whose zone is too hard gives way to levelling in the
 * nearest zone it can, and with none left to level in it is passed over, as a goal lost is.
 */
function questAim(g: Game, k: Known, p: Pilot): Aim | undefined {
  const from = pointOf(g, k), far = (map: string): number => distance(k.placeOf(map), from);
  const open = k.goals().filter((q): q is { quest: string; text: string; map: string } => q.map !== undefined && !p.lost.has(q.text));
  const one = open.filter((v) => v.quest === THE_QUEST.id), side = open.filter((v) => v.quest !== THE_QUEST.id).sort((a, b) => far(a.map) - far(b.map));
  for (const q of [...one, ...side]) {
    const band = zoneBand(g, k, q.map);
    if (!band || band[0] <= companyLevel(k.party) + 1) return { kind: 'quest', quest: q.quest, map: q.map, text: q.text };
    const easy = easyZones(k, p).sort((a, b) => far(a) - far(b));
    if (easy.length) return { kind: 'level', zone: easy[0], to: band[0] - 1 };
  }
  return undefined;
}

/** Whether two boxes share a stretch of edge. */
function touches(a: Box, b: Box): boolean {
  const across = a.x < b.x + b.w && b.x < a.x + a.w, along = a.y < b.y + b.h && b.y < a.y + a.h;
  return (across && (a.y + a.h === b.y || b.y + b.h === a.y)) || (along && (a.x + a.w === b.x || b.x + b.w === a.x));
}

/** The why line of an aim chosen: where it is bound and for what, the level it levels to, or the map it walks. */
function whyOf(g: Game, aim: Aim): string {
  if (aim.kind === 'level') return `Levelling in ${within(nameOf(g, aim.zone))} to ${aim.to}.`;
  if (aim.kind === 'explore') return `Walking ${within(nameOf(g, aim.map))}.`;
  const words = aim.text.replace(/\.$/, ''), cut = words.length <= GOAL_CUT ? `${words}.` : `${words.slice(0, words.lastIndexOf(' ', GOAL_CUT))}...`;
  return `Bound for ${within(nameOf(g, aim.map))}: ${cut}`;
}

/** Whether an aim lies in a zone: a quest's map there, the zone levelled in, or the zone walked. */
const aimIn = (g: Game, aim: Aim | null, zone: string): boolean =>
  !!aim && (aim.kind === 'level' ? aim.zone === zone : aim.kind === 'explore' ? aim.map === zone : zoneOf(g, aim.map) === zone);

/**
 * The brain, with the map on top. (1) Over a line into a zone too hard for the company that the aim
 * is not in: back to the square before the line ("Too strong for us yet: back."). (2) The aim chosen
 * anew when there is none, when its quest's goal shows other words, when its zone's band is learnt too
 * high, when the level is reached or the map walked out, or when a quest's goal comes to a walk. (3)
 * The lost rule: three days of the world's on a goal whose words have not changed, or levelling with
 * no level gained, it says so, gives the goal (or `level:<zone>`) up and clears the aim. (4) A goal walked is the navigator's. (5) A chest stood on is
 * opened, one seen where the aim is is gone to. (6) The aim: to its map by the exits seen, else
 * nearer by the zones between, and there the explorer walks it (`Pilot.prefer`); walked out, the
 * party walks it again end to end, as a lost company would, while the days pass.
 */
export const aims: Brain = (g, k, p) => {
  if (!(g.top instanceof ExploreScreen)) return null;
  const mem = memOf(p), st = g.world.state, party = k.party, zone = g.world.zone?.id;
  // 1. The band rule.
  if (zone !== mem.zone) {
    const back = mem.zone !== undefined && zone !== undefined ? mem.before : undefined;
    mem.zone = zone;
    mem.before = undefined;
    const line = `${zone}:${back?.x},${back?.y}`, then = `${levels(party)}|${flagCount(party)}`;
    // Once a crossing, until a level or a flag is gained: a route that clips a hard zone's corner goes on.
    if (back && zone && tooHard(k, zone) && !aimIn(g, p.aim, zone) && mem.turned.get(line) !== then) {
      mem.turned.set(line, then);
      p.plan = [];
      return walk(g, k, p, { map: st.mapId, x: back.x, y: back.y, name: 'the road behind', why: 'Too strong for us yet: back.' });
    }
  }
  if (zone !== undefined) mem.before = { x: st.x, y: st.y };

  // 2. The aim, chosen anew when it is spent.
  retry(p, mem, party);
  const goals = k.goals(), aim = p.aim;
  const shown = aim?.kind === 'quest' ? goals.find((q) => q.quest === aim.quest)?.text ?? '' : '';
  const spent = !aim
    // A quest's zone learnt too hard turns it to levelling, or past it where there is nowhere to level.
    || (aim.kind === 'quest' && (shown !== p.aimGoal || zoneTooHard(g, k, aim.map)))
    || (aim.kind === 'level' && companyLevel(party) >= aim.to)
    || (aim.kind === 'explore' && (questAim(g, k, p) !== undefined || tooHard(k, aim.map)));
  if (spent) {
    const next = chooseAim(g, k, p);
    // A goal of the old aim's goes with it; one the quartermaster set for a need (its reason) stays.
    if (p.goal && !p.goal.reason) { p.goal = null; p.plan = []; }
    p.aim = next;
    p.aimSince = st.minutes;
    p.aimGoal = next?.kind === 'quest' ? next.text : '';
    p.prefer = null;
    mem.levelAt = companyLevel(party);
    if (!next) return null;
    p.why = [whyOf(g, next)];
  }
  const now = p.aim!;

  // 3. The lost rule: a quest's goal, or a level aim's three days with no level gained (each one starts them afresh).
  if (now.kind === 'level') {
    const lvl = companyLevel(party);
    if (mem.levelAt !== undefined && lvl > mem.levelAt) p.aimSince = st.minutes;
    mem.levelAt = lvl;
  }
  if (now.kind !== 'explore' && st.minutes - p.aimSince >= LOST_MINUTES) {
    const line = now.kind === 'quest' ? `Lost in ${within(areaName(g, now.map))}: three days, and no way on.` : `Three days in ${within(nameOf(g, now.zone))}, and no stronger.`;
    const given = now.kind === 'quest' ? now.text : `level:${now.zone}`;
    g.say(line);
    p.lost.add(given);
    mem.lostAt.set(given, { levels: levels(party), flags: flagCount(party) });
    p.aim = null;
    p.prefer = null;
    if (p.goal && !p.goal.reason) { p.goal = null; p.plan = []; }
    p.why = [line];
    return null;
  }

  // 4. A goal walked is the navigator's.
  if (p.goal) return null;

  // 5. Chests: one stood on opened, one seen where the aim is gone to.
  const area = now.kind === 'level' ? now.zone : now.map;
  const chests = k.features(st.mapId).filter((f) => f.kind === 'chest' && !mem.opened.has(`${st.mapId}:${at(f)}`));
  if (chests.some((c) => c.x === st.x && c.y === st.y)) { mem.opened.add(`${st.mapId}:${st.x},${st.y}`); p.why = ['Opening the chest.']; return 'interact'; }
  if (g.world.locate(area, 0, 0).mapId === st.mapId) {
    const box = k.box(area), seen = k.seenCount(st.mapId);
    const want = chests.filter((c) => (!box || inside(box, c.x, c.y)) && mem.far.get(`${st.mapId}:${at(c)}`) !== seen);
    if (want.length) {
      const near = routeNearest(k, st.mapId, st.x, st.y, st.facing, new Set(want.map(at)), p.shut.filter((s) => s.map === st.mapId));
      if (near) return walk(g, k, p, { map: st.mapId, x: near.x, y: near.y, name: 'the chest', why: 'To the chest.' });
      for (const c of want) mem.far.set(`${st.mapId}:${at(c)}`, seen);
    }
  }

  // 6. The aim.
  switch (now.kind) {
    case 'quest': return toward(g, k, p, now.map, whyOf(g, now)) ?? walkAgain(g, k, p, now.map);
    case 'level': return toward(g, k, p, now.zone, whyOf(g, now)) ?? walkAgain(g, k, p, now.zone);
    case 'explore': {
      const key = toward(g, k, p, now.map, whyOf(g, now));
      if (key) return key;
      // Walked out, or no way seen to it: chosen anew next tick.
      mem.out.set(now.map, stamp(g, k, now.map));
      p.aim = null;
      return null;
    }
  }
};

/**
 * To a map or a zone and over it: by the exits seen to the map it is played on (`routeMaps`), else by
 * the zone it lies in (a town's or a dungeon's home); there, the explorer walks it (`Pilot.prefer`).
 * Outdoors, where nothing seen leads into the zone, the explorer walks the zone beside the party's
 * that lies nearest it, then the party's own. Null when the explorer has nothing left there.
 */
function toward(g: Game, k: Known, p: Pilot, map: string, why: string): Action | null {
  const st = g.world.state, played = g.world.locate(map, 0, 0).mapId;
  if (st.mapId !== played) {
    const hops = routeMaps(k, st.mapId, played);
    if (hops?.length) return walk(g, k, p, { map: st.mapId, x: hops[0].exit.x, y: hops[0].exit.y, name: within(nameOf(g, map)), why });
    const zone = zoneOf(g, map);
    if (zone && zone !== map) return toward(g, k, p, zone, why);
    // No way seen out to it: the explorer walks this map for one.
    p.prefer = null;
    return explore(g, k, p);
  }
  p.prefer = map === OUTDOORS ? null : map;
  const key = explore(g, k, p), mine = g.world.zone;
  if (key || played !== OUTDOORS || map === OUTDOORS || !mine || mine.id === map) return key;
  // Outdoors, nothing seen leads into the zone: the zones on the way, the nearest it first, then the party's own.
  const zones = g.maps[OUTDOORS].zones, goal = zones.find((z) => z.id === map);
  if (!goal) return null;
  const centre = (b: Box): [number, number] => [b.x + b.w / 2, b.y + b.h / 2], off = (b: Box): number => distance(centre(b), centre(goal));
  const ways = zones.filter((z) => z.id !== mine.id && touches(z, mine) && off(z) < off(mine) && !tooHard(k, z.id) && frontier(k, g, z.id).length > 0).sort((a, b) => off(a) - off(b));
  for (const z of [...ways, mine]) {
    p.prefer = z.id;
    const a = explore(g, k, p);
    if (a) return a;
  }
  p.prefer = map;
  return null;
}

/**
 * The place walked again, to its farthest square seen and back, as a company with no way on would:
 * the days pass, the groups move, and the lost rule comes at three. The aim's map where the party is
 * on it, else the zone it lies in where the party is there, else where the party stands; never onto
 * an exit, a rift or a business's door, which would take the party away, nor onto a person, whom
 * talk meets with a goal of its own (#721).
 */
function walkAgain(g: Game, k: Known, p: Pilot, map: string): Action | null {
  const st = g.world.state, zone = zoneOf(g, map);
  // Where the party stands is walked when it is not on the aim's map or in its zone: the clock must run.
  const area = g.world.locate(map, 0, 0).mapId === st.mapId && (st.mapId !== OUTDOORS || g.world.zone?.id === map) ? map : zone && g.world.zone?.id === zone ? zone : g.world.zone?.id ?? st.mapId;
  const box = k.box(area), can = partyCan(k.party), shut = p.shut.filter((s) => s.map === st.mapId);
  const away = new Set([...k.exits(st.mapId), ...k.features(st.mapId).filter((f) => f.kind === 'rift' || f.kind === 'npc' || ('interior' in f && !!f.interior))].map(at));
  let best: Square | undefined, most = 1;
  for (const [sq, n] of routeLengths(k, st.mapId, st.x, st.y, st.facing, shut)) {
    const [x, y] = sq.split(',').map(Number), c = k.cell(st.mapId, x, y);
    if (n > most && !away.has(sq) && (!box || inside(box, x, y)) && c && passableCell(c, can) === 'ok') { most = n; best = { x, y }; }
  }
  return best ? walk(g, k, p, { map: st.mapId, x: best.x, y: best.y, name: 'the far side', why: `Searching ${within(nameOf(g, area))} again.` }) : null;
}

/** Sets the goal and asks the navigator for its first key. */
function walk(g: Game, k: Known, p: Pilot, goal: Goal): Action | null {
  p.goal = goal;
  return route(g, k, p);
}
