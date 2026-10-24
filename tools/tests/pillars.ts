// The pillars, where a machine can check them (EXPANSION §5.4): every secret door has a hint on its
// near side; no event, sign, landing line or seller's warning runs past three lines of the log, every
// glyph is in the font and the spelling is British; each area's claim of what is new in it holds; a
// zone map's water and roads carry on into the atlas land beyond its edge; every story lock is
// signed in, none stands between areas, and every hand-in takes its item at the first meeting. Each
// check is a function of the content it reads, so it runs over every area and over fixtures broken
// on purpose, which it must refuse.
import { AREAS, MAP_DEFS, MONSTERS, ATLAS } from '../../src/content/index.ts';
import type { MonsterDef } from '../../src/game/monsters.ts';
import type { Area, Novelty } from '../../src/content/area.ts';
import { LOCKS, MOST_AN_AREA, MOST_ON_THE_ROAD } from '../../src/content/locks.ts';
import type { StoryLock } from '../../src/content/locks.ts';
import { CROSSINGS } from '../../src/content/crossings.ts';
import type { Crossing, CrossingEnd } from '../../src/content/crossings.ts';
import { GameMap } from '../../src/game/map.ts';
import type { MapDef, Passage, Presence } from '../../src/game/mapdef.ts';
import type { Atlas, AtlasZone } from '../../src/game/atlas.ts';
import { worldGrid, isWater, mapAt, TI, MAP_TERRAIN, TERRAINS, areaBand, roadPlace, zoneOfMap, homeMap } from '../../src/game/atlas.ts';
import { signLine, enclaveLine } from '../../src/game/world.ts';
import { LAIR } from '../kit/rules/enclave.ts';
import { signTexts, readLine, isInscription, marksOf } from '../../src/game/inscriptions.ts';
import { NORTH } from '../../src/game/types.ts';
import { measureText } from '../../src/lib/engine/text.ts';
import { logLines, logTail, LOG_LINES, COMBAT_LOG_LINES, LAYOUT } from '../../src/ui/frame.ts';
import { ENDINGS } from '../../src/content/endings.ts';
import type { Ending } from '../../src/content/endings.ts';
import { PAGE, pageLines } from '../../src/ui/ending.ts';
import { areaRows, gatherLists, once } from '../kit/checks.ts';
import { ok, owed, familyModules, withDefs, fxMap, fxFlag } from './lib.ts';
import { lineFaults, texts, hintFaults, missingGlyphs, americanisms, MOST_LINES, LOOK_LINES, LONGEST_NAME } from '../kit/rules/pillars.ts';

/**
 * The endings' pages are the long-form exception (DESIGN §11; #750): they are not held to MOST_LINES
 * but to three pages to an ending, each within the lines its own screen writes (ui/ending.ts). Every
 * other text stays held to MOST_LINES, an ending's answer at the Heart among them.
 */
export const ENDING_PAGES = 3;

/** The endings of other than three pages, with a page longer than its screen, or with another's flag. */
export function endingFaults(endings: Readonly<Record<string, Ending>> = ENDINGS): string[] {
  const out: string[] = [], flags = new Set<string>();
  for (const [id, e] of Object.entries(endings)) {
    if (e.pages.length !== ENDING_PAGES) out.push(`${id} has ${e.pages.length} pages`);
    e.pages.forEach((p, i) => { const n = pageLines(p).length; if (n > PAGE.lines) out.push(`${id}'s page ${i + 1} takes ${n} lines`); });
    if (flags.has(e.flag)) out.push(`${id} sets ${e.flag}, another's flag`);
    flags.add(e.flag);
  }
  return out;
}

/** An event or sign as the log shows it, a sign with its prefix. */
const shown = (f: { kind: string; text: string }): string => (f.kind === 'sign' ? signLine(f.text) : f.text);

/** The monsters whose look takes more than LOOK_LINES of the log. */
export function lookFaults(monsters: readonly MonsterDef[]): string[] {
  return monsters.flatMap((m) => { const n = m.look ? logLines(m.look).length : 0; return n > LOOK_LINES ? [`${m.id}'s look takes ${n} lines`] : []; });
}

/**
 * The crossings' words that take more than MOST_LINES of the log: the line said as a company lands
 * and a seller's warning (game/passage.ts), held as an event is. Read on every passage a person sells
 * and on both ends of every crossing between towns, so an end's words are held before anyone sells
 * them. A passage's name is the menu's one row, and goes through the font and the spelling with every
 * text (`texts`).
 */
export function crossingLineFaults(defs: readonly MapDef[] = MAP_DEFS, crossings: readonly Crossing[] = CROSSINGS): string[] {
  const out: string[] = [];
  const hold = (whose: string, p: { label?: string; warning?: string }): void => {
    for (const [what, text] of [['landing line', p.label], ['warning', p.warning]] as const) {
      const n = text === undefined ? 0 : logLines(text).length;
      if (n > MOST_LINES) out.push(`${whose}: its ${what} takes ${n} lines`);
    }
  };
  for (const d of defs) for (const f of d.features ?? []) if (f.kind === 'npc') for (const p of f.passage ?? []) hold(`${d.id}'s ${f.name}, to ${p.name}`, p);
  for (const c of crossings) for (const e of c.ends) hold(`${c.name}, at ${e.name}`, e);
  return out;
}

type Uses = { [K in keyof Novelty]: Set<string> };
/** What an area uses, in the words of its claim: the families it places, the ground of its maps, its mechanics, its built sites. */
export function uses(area: Pick<Area, 'maps' | 'atlas'>, family: Map<string, readonly string[]>): Uses {
  const out: Uses = { families: new Set(), terrain: new Set(), mechanics: new Set(), landmarks: new Set() };
  const familyOf = (sprite: string): string | undefined => [...family].find(([, kinds]) => kinds.includes(sprite))?.[0];
  for (const def of area.maps) {
    const map = new GameMap(def);
    for (const c of map.cells) {
      if (c.solid !== 'void') out.terrain.add(c.terrain);
      if (c.door !== 'none') out.mechanics.add(`door:${c.door}`);
    }
    for (const f of def.features ?? []) {
      out.mechanics.add(`feature:${f.kind}`);
      // Kiln-script (#538): an inscription read, and a reading that marks the world map.
      if (isInscription(f)) { out.mechanics.add('sign:read'); if (marksOf(f).length) out.mechanics.add('sign:marks'); }
    }
    for (const e of def.encounters ?? []) {
      for (const k of Object.keys(e)) if (!['id', 'x', 'y', 'monsters'].includes(k)) out.mechanics.add(`encounter:${k}`);
      for (const id of e.monsters) {
        const m = MONSTERS[id];
        if (!m) continue;
        const fam = familyOf(m.sprite);
        if (fam) out.families.add(fam);
        for (const flag of ['ranged', 'missile'] as const) if (m[flag]) out.mechanics.add(`monster:${flag}`);
        for (const k of m.immune ?? []) out.mechanics.add(`immune:${k}`);
        if (m.inflict) out.mechanics.add(`inflict:${m.inflict.cond}`);
      }
    }
  }
  for (const s of area.atlas.sites) if (!s.planned && s.icon !== 'label' && s.icon !== 'water') out.landmarks.add(s.icon);
  return out;
}

/** A map as the pace check reads it: the area that lists it, and the atlas zone it lies in or opens from. */
export interface PacedMap { def: MapDef; area: string; zone?: string }


/**
 * The secret's pace (MONSTERS §2.2, #158): no machine on the road before the bottom of the Deep
 * Mines, and no Rift after Cairnmoor. A map stands at its `roadPlace`. A machine stands only past
 * the Kilns, or in the Kilns on the Deep Mines' last level (the highest-numbered `deep_mines` map);
 * with no Mines built, nowhere in the Kilns. A Rift is a tear, a group with a monster of the Rift's
 * kind, or a rift on the atlas, in an area past Cairnmoor. The reach is exempt.
 */
export function paceFaults(maps: readonly PacedMap[], kindOf: (monster: string) => MonsterDef['kind'] | undefined, atlas: Atlas = ATLAS, defs: readonly MapDef[] = maps.map((m) => m.def), grid?: { zone: Int16Array; width: number; height: number }): string[] {
  const order = (id: string): number => atlas.areas.find((a) => a.id === id)?.order ?? Infinity;
  const KILNS = order('kilns'), CAIRNMOOR = order('cairnmoor');
  // The reach (DESIGN §9): off the road by design, so the secret's pace does not bind it. Its zones say
  // so themselves (`AtlasZone.reach`, EXPANSION §5.8); a town or dungeon goes with the zone it opens from.
  const reach = new Set(atlas.zones.filter((z) => z.reach).map((z) => z.id));
  const placeOf = roadPlace(atlas, defs);
  const mines = maps.map((m) => /^deep_mines(\d*)$/.exec(m.def.id)).filter((x): x is RegExpExecArray => !!x);
  const bottom = mines.length ? Math.max(...mines.map((x) => Number(x[1] || 0))) : null;
  const out: string[] = [];
  for (const m of maps) {
    if (m.zone && reach.has(m.zone)) continue;
    const at = placeOf(m.area, m.def), mine = /^deep_mines(\d*)$/.exec(m.def.id);
    const machineOk = at > KILNS || (at === KILNS && !!mine && bottom !== null && Number(mine[1] || 0) === bottom);
    for (const g of m.def.encounters ?? []) {
      const kinds = new Set(g.monsters.map(kindOf));
      if (kinds.has('machine') && !machineOk) out.push(`${m.area}/${m.def.id}: a machine in ${g.id}, before the bottom of the Deep Mines`);
      if (kinds.has('rift') && at > CAIRNMOOR) out.push(`${m.area}/${m.def.id}: a Rift's monster in ${g.id}, after Cairnmoor`);
    }
    for (const f of m.def.features ?? []) if (f.kind === 'rift' && at > CAIRNMOOR) out.push(`${m.area}/${m.def.id}: a tear into a Rift at ${f.x},${f.y}, after Cairnmoor`);
  }
  if (grid) for (const site of atlas.sites.filter((q) => q.icon === 'rift' && !q.map)) {
    const z = atlas.zones[grid.zone[Math.floor(site.at[1]) * grid.width + Math.floor(site.at[0])]];
    if (z && !reach.has(z.id) && order(z.area) > CAIRNMOOR) out.push(`the atlas: ${site.name}, a rift in ${z.name}, after Cairnmoor`);
  }
  return out;
}

/**
 * What is wrong with the areas' claims, in road order: a family with no module, a claim the area
 * does not use or an area earlier on the road already did, or an area after the first that claims
 * nothing new at all. A map counts at its `roadPlace`, as in the pace check: in its folder's area,
 * or, where its floor is over that area's band, in the last area whose floor is at or under its own
 * (the Dead-Drop's knockers, keepers, heavy machines and calls stand with the Glasswold, after the
 * Kilns', Rimewater's and Ashfall's claims); in its own where that area is not listed. An area's
 * sites stay with it: a site is on the atlas, not on a map's floor.
 */
export function noveltyFaults(areas: readonly Pick<Area, 'id' | 'maps' | 'atlas' | 'novel'>[], family: Map<string, readonly string[]>, atlas: Atlas = ATLAS, defs: readonly MapDef[] = areas.flatMap((a) => a.maps)): string[] {
  const out: string[] = [], before: Uses = { families: new Set(), terrain: new Set(), mechanics: new Set(), landmarks: new Set() };
  const placeOf = roadPlace(atlas, defs), place = areas.map((a) => placeOf(a.id, {})), stand = areas.map(() => [] as MapDef[]);
  areas.forEach((area, i) => area.maps.forEach((def) => {
    const at = placeOf(area.id, def), j = at === place[i] ? i : place.indexOf(at);
    stand[j < 0 ? i : j].push(def);
  }));
  areas.forEach((area, i) => {
    const here = uses({ maps: stand[i], atlas: area.atlas }, family);
    const kinds = Object.keys(before) as (keyof Novelty)[];
    for (const k of kinds) for (const thing of area.novel[k]) {
      if (k === 'families' && !family.has(thing)) out.push(`${area.id}: the family '${thing}' has no module in src/ui/monsters/`);
      else if (!here[k].has(thing)) out.push(`${area.id}: claims ${k} '${thing}', which it does not use`);
      else if (before[k].has(thing)) out.push(`${area.id}: claims ${k} '${thing}', which is on the road before it`);
    }
    // An area with no map yet, as a new one starts (EXPANSION §8.2), has nothing to claim until its first.
    if (i > 0 && area.maps.length && kinds.every((k) => !area.novel[k].length)) out.push(`${area.id}: claims nothing new`);
    for (const k of kinds) for (const thing of here[k]) before[k].add(thing);
  });
  return out;
}

/** Where a zone map's edge and the atlas beyond it disagree: the square on the map, and why. */
export interface EdgeFault { map: string; x: number; y: number; why: string }

/**
 * Whether a map square at the edge agrees with the atlas square beyond it: 'skip' where the atlas
 * beyond is open water no river or road crosses. Where the atlas beyond is a road (a ford or a
 * bridge over water included) the map square must be a road; otherwise the two must be wet or dry
 * alike, and the map may have no road there.
 */
export function edgeAgrees(mine: string, beyond: { t: number; road: boolean; river: boolean }): boolean | 'skip' {
  if (isWater(beyond.t) && !beyond.river && !beyond.road) return 'skip';
  const wet = mine === 'sea' || mine === 'shallow';
  return beyond.road ? mine === 'road' : wet === isWater(beyond.t) && mine !== 'road';
}

/**
 * Where a zone map's edge meets unbuilt atlas land and its water and roads stop there, or the
 * atlas's rivers and roads stop at the map. A map's ring of mountains is its closed border and keeps
 * the atlas's ground, so behind a ring square the map's side is the square inside it. What lies
 * beyond the edge is no unbuilt land where another zone map covers it, or it is the void, or open
 * water, the sea or a lake (so a shore may run along an edge); a river or a road over water is still
 * checked. Sand counts as land. The atlas's roads are its trails (a planned road) and its built road.
 * The ring square's own atlas ground is not compared.
 */
export function edgeFaults(atlas: Atlas, defs: readonly MapDef[]): EdgeFault[] {
  const grid = worldGrid(atlas, defs), out: EdgeFault[] = [];
  const laid = atlas.zones.flatMap((z) => (z.maps ?? []).flatMap(({ map, at }) => {
    const def = defs.find((d) => d.id === map);
    return def ? [{ def, x: at[0], y: at[1], w: Math.max(...def.rows.map((r) => r.length)), h: def.rows.length }] : [];
  }));
  for (const z of laid) {
    for (let my = 0; my < z.h; my++) for (let mx = 0; mx < z.w; mx++) {
      for (const [dx, dy] of [[-1, 0], [1, 0], [0, -1], [0, 1]]) {
        const ox = mx + dx, oy = my + dy;
        if (ox >= 0 && oy >= 0 && ox < z.w && oy < z.h) continue;
        const ax = z.x + ox, ay = z.y + oy, t = grid.t(ax, ay);
        if (t === TI.void || laid.some((o) => o !== z && ax >= o.x && ay >= o.y && ax < o.x + o.w && ay < o.y + o.h)) continue;
        const ring = z.def.rows[my][mx] ?? 'M', ch = ring === 'M' ? z.def.rows[my - dy]?.[mx - dx] : ring;
        if (ch === undefined || ch === 'M') continue; // a corner of the ring
        const i = ay * grid.width + ax, mine = MAP_TERRAIN[ch] ?? 'grass', road = !!grid.road[i] || t === TI.road;
        const verdict = edgeAgrees(mine, { t, road, river: !!grid.river[i] });
        if (verdict === false) out.push({ map: z.def.id, x: mx, y: my, why: `${mine} against the atlas's ${road ? 'road' : TERRAINS[t]} at ${ax},${ay}` });
      }
    }
  }
  return out;
}

/**
 * The squares where map and atlas disagree today, owed by their areas by whose fix they wait on
 * (`Owes.edges`): each is reported, and fails once it agrees, so it is dropped. An issue may be owed by
 * several areas, and a square owed twice is refused.
 */
const edgesOwed = gatherLists(areaRows((c) => c.owes?.edges));

/**
 * A flag that closes something, found in the maps: an exit, a hand-in, a service, or anything else
 * that names one. `way`, where it is set, is why it is no lock: the way that stays open beside it.
 */
export interface FoundLock { kind: 'exit' | 'hand-in' | 'service' | 'other'; flags: string[]; map: string; x: number; y: number; area: string; to?: string; key: string; way?: string }

/** The kinds of business a flag may shut (game/mapdef.ts), and a person with a room, who is one too. */
const SERVICES = ['inn', 'temple', 'shop', 'guild', 'trainer'];
const isService = (o: Record<string, unknown>): boolean => typeof o.interior === 'string' && (SERVICES.includes(o.kind as string) || o.kind === 'npc');

/**
 * Every `needFlag` in the maps, wherever it sits, so a door or a service given one later is found
 * without this check being told; and every flag that shuts something once it is set (#157): an
 * exit's or a gate's `shut`, and a business gone `until` one. An exit's lock stands between areas
 * when it leads into another's map. A shut exit is no lock while another way from its map into the
 * same map stays open, and a shut business none while a twin takes its square or the same trade is sold
 * elsewhere; each is found with that way.
 *
 * An exit's `after` is not found, and that is a stance (#749): it is read as an appearance, as a
 * presence is, and closes nothing. The door marked CREW ONLY is there once the company has answered
 * at it, either way: it waits on nothing from anywhere else, only on that answer where it stands, and
 * the Kilns are reached by their own road whichever way it goes, so it is no lock between the Hearth
 * and the Kilns (docs/areas/hearth.md §6, 60; §9.1, 44). The act's one lock stays the Core's
 * door. An exit not there yet is no way beside a shut one either. A `lifts` only ends a shut, so the
 * shut is found as before.
 */
export function findLocks(areas: readonly Pick<Area, 'id' | 'maps'>[]): FoundLock[] {
  const areaOf = new Map(areas.flatMap((a) => a.maps.map((d) => [d.id, a.id] as const)));
  const out: FoundLock[] = [];
  const all = areas.flatMap((a) => a.maps);
  const condFlags = (w: unknown): string[] => [w].flat().flatMap((c) => {
    const k = c as { flag?: string | string[]; member?: { race?: string } };
    return [...[k.flag ?? []].flat(), ...(k.member?.race ? [`a member ${k.member.race}`] : [])];
  });
  // The way into `to` that stays open beside a shut exit, from the map the company is turned back on.
  const openWay = (def: MapDef, to: string, not: object): string | undefined => {
    const e = (def.exits ?? []).find((x) => x !== not && x.to === to && x.needFlag === undefined && x.shut === undefined && x.after === undefined);
    return e ? `${def.id} ${e.x},${e.y}` : undefined;
  };
  // Where a shut business's trade is still had: its twin on its square, or the same kind elsewhere.
  const stillHad = (def: MapDef, o: Record<string, unknown>): string | undefined => {
    const same = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);
    if ((def.features ?? []).some((f) => f !== o && f.x === o.x && f.y === o.y && f.kind === o.kind && 'interior' in f && same((f as { after?: unknown }).after, o.until))) return 'its twin, on its square';
    for (const d of all) for (const f of d.features ?? []) if (f !== o && f.kind === o.kind && f.kind !== 'npc' && 'interior' in f && !('until' in f)) return `${f.name}, ${d.id}`;
    return undefined;
  };
  for (const a of areas) for (const def of a.maps) {
    const walk = (v: unknown, path: string[], at: { x: number; y: number } | undefined): void => {
      if (Array.isArray(v)) { v.forEach((x, i) => walk(x, [...path, String(i)], at)); return; }
      if (!v || typeof v !== 'object') return;
      const o = v as Record<string, unknown>;
      const here = typeof o.x === 'number' && typeof o.y === 'number' ? { x: o.x, y: o.y } : at;
      if (o.needFlag !== undefined) {
        const kind = path[0] === 'exits' ? 'exit' : path.includes('quest') ? 'hand-in' : 'other';
        const to = kind === 'exit' ? areaOf.get(o.to as string) : undefined;
        const flags = [o.needFlag as string | string[]].flat();
        // A legend entry is one lock however many squares are drawn with its character (a gate two
        // wide), found and signed in at the first of them; a flag with no square at all is kept at
        // NaN, where no lock can be signed in, so it fails. The game does not honour a legend's
        // needFlag yet: this finds one before it does.
        const squares = here ? [here] : path[0] === 'legend' && path.length === 2
          ? def.rows.flatMap((r, y) => [...r].flatMap((ch, x) => (ch === path[1] ? [{ x, y }] : []))).slice(0, 1)
          : [];
        if (!squares.length) squares.push({ x: NaN, y: NaN });
        for (const q of squares) out.push({ kind, flags, map: def.id, x: q.x, y: q.y, area: a.id, to, key: `${kind} ${def.id} ${Number.isNaN(q.x) ? path.join('.') || 'itself' : `${q.x},${q.y}`}` });
      }
      if (o.shut !== undefined && here) {
        const kind = path[0] === 'exits' ? 'exit' : 'other';
        const to = kind === 'exit' ? areaOf.get(o.to as string) : undefined;
        const way = kind === 'exit' ? openWay(def, o.to as string, o) : undefined;
        out.push({ kind, flags: condFlags(o.shut), map: def.id, x: here.x, y: here.y, area: a.id, to, key: `${kind} ${def.id} ${here.x},${here.y} shut`, way });
      }
      if (o.until !== undefined && here && path[0] === 'features' && isService(o)) {
        out.push({ kind: 'service', flags: condFlags(o.until), map: def.id, x: here.x, y: here.y, area: a.id, key: `service ${def.id} ${here.x},${here.y} until`, way: stillHad(def, o) });
      }
      for (const [k, x] of Object.entries(o)) if (k !== 'needFlag') walk(x, [...path, k], here);
    };
    walk(def, [], undefined);
  }
  return out;
}

/**
 * What is wrong with the locks: one found that is not signed in, one between areas, a hand-in that
 * withholds its item on a flag, signed in or not (EXPANSION §2.3 has every hand-in take it at the
 * first meeting, as game/people.ts's `meet` does; `NpcQuest` has no `needFlag`, so this catches one
 * that grows it again), a signed-in row that names nothing, and more than the counts allow.
 * `owing` are keys reported elsewhere, as someone's to fix.
 */
export function lockFaults(found: readonly FoundLock[], locks: readonly StoryLock[], areaOf: (map: string) => string | undefined, owing: readonly string[] = []): { area?: string; text: string }[] {
  const out: { area?: string; text: string }[] = [];
  const signed = (f: FoundLock): boolean => locks.some((l) => l.map === f.map && l.x === f.x && l.y === f.y && f.flags.includes(l.flag));
  for (const f of found) {
    if (owing.includes(f.key)) continue;
    // Shut while the way beside it stays open, or its trade still had: no lock, though between areas.
    if (f.way) continue;
    if (f.to && f.to !== f.area) out.push({ area: f.area, text: `${f.key}: a lock between ${f.area} and ${f.to}` });
    else if (f.kind === 'hand-in') out.push({ area: f.area, text: `${f.key}: withholds its item until ${f.flags.join(', ')}; a hand-in takes it at the first meeting` });
    else if (!signed(f)) out.push({ area: f.area, text: `${f.key}: closed on ${f.flags.join(', ')}, and not signed in to src/content/locks.ts` });
  }
  const perArea = new Map<string, number>();
  for (const l of locks) {
    const area = areaOf(l.map);
    const f = found.find((f) => f.map === l.map && f.x === l.x && f.y === l.y && f.flags.includes(l.flag));
    if (!f) out.push({ area, text: `the lock '${l.flag}' at ${l.map} ${l.x},${l.y} closes nothing there` });
    if (area) perArea.set(area, (perArea.get(area) ?? 0) + 1);
  }
  for (const [area, n] of perArea) if (n > MOST_AN_AREA) out.push({ area, text: `${area} spends ${n} locks, more than ${MOST_AN_AREA}` });
  if (locks.length > MOST_ON_THE_ROAD) out.push({ text: `the road spends ${locks.length} locks, more than ${MOST_ON_THE_ROAD}` });
  return out;
}

/** The ways on the atlas that open on the story, once a step is done: none may (EXPANSION §2.3). */
export const storyWays = (links: Atlas['links']): string[] => links.filter((l) => l.opens !== undefined).map((l) => `${l.from}-${l.to} after step ${l.opens}`);

/**
 * Locks someone else fixes, owed by their areas by the issue that fixes them (`Owes.locks`) and reported
 * as theirs until it lands: an issue may be owed by several areas, and a lock owed twice is refused.
 */
const locksOwed = gatherLists(areaRows((c) => c.owes?.locks));

/**
 * The suite's parts (#1016), each a run of its own (`node tools/test.ts pillars:edges`), in the order a
 * whole run takes them.
 */
export const parts = (): string[] => [...PARTS.keys()];

/** The pillars, or one part of them; whole, the parts one after another. */
export async function pillars(part?: string): Promise<void> {
  if (part === undefined) { for (const q of parts()) await pillars(q); return; }
  const run = PARTS.get(part);
  if (!run) throw new Error(`the pillars have no part named ${part}`);
  await run();
}

const PARTS = new Map<string, () => void | Promise<void>>([['hints', hints], ['text', text], ['looks', looks], ['crossings', crossings], ['glyphs', glyphs],
  ['pace', pace], ['novelty', novelty], ['edges', edges], ['locks', locks]]);

/** Every secret door's hint. */
function hints(): void {
  // Hints: every secret door names one, on its near side.
  for (const area of AREAS) {
    let doors = 0, bad = 0;
    for (const def of area.maps) {
      const faults = hintFaults(def);
      doors += def.secrets?.length ?? 0; bad += faults.length;
      if (def.secrets?.length || faults.length) ok(!faults.length, `${area.id}/${def.id}: each secret door's hint can be reached without it${faults.length ? ' -> ' + faults.join('; ') : ''}`);
    }
    ok(!bad, `${area.id}: ${doors} secret door(s), each with its hint`);
  }
  {
    const room = (secrets: MapDef['secrets'], text = 'A draught.'): MapDef => ({
      id: 'fixture_hint', name: 'Hint fixture', kind: 'dungeon', start: { x: 1, y: 1, facing: NORTH },
      rows: ['#######', '#..S..#', '#######'], secrets,
      features: [{ kind: 'event', x: 2, y: 1, id: 'near', text }, { kind: 'event', x: 4, y: 1, id: 'far', text }, { kind: 'sign', x: 5, y: 1, id: 'far_sign', text }],
    });
    ok(!hintFaults(room([{ x: 3, y: 1, hint: 'near' }])).length, 'a hint on the near side of its door passes');
    ok(hintFaults(room(undefined)).length === 1, 'a secret door with no hint declared fails');
    ok(hintFaults(room([{ x: 3, y: 1, hint: 'far' }])).length === 1, 'a hint that lies behind its own door fails');
    ok(hintFaults(room([{ x: 3, y: 1, hint: 'far_sign' }])).length === 1, 'and so does a sign behind it');
    ok(hintFaults(room([{ x: 3, y: 1, hint: 'nowhere' }])).length === 1, 'a hint that names nothing fails');
    ok(hintFaults({ ...room([{ x: 3, y: 1, hint: 'near' }]), features: room([]).features!.map((f) => (f.kind === 'event' && f.id === 'near' ? { ...f, when: { hours: 'night' as const } } : f)) }).length === 1, 'a hint there only by night fails');
    ok(hintFaults(room([{ x: 3, y: 1, hint: 'near' }, { x: 2, y: 1, hint: 'near' }])).length === 1, 'a hint on a square with no secret door fails');
    // Kiln-script (#538): an inscription's reading may be the hint, on the near side, and counts; behind the door it fails as any sign does.
    const scribed = (x: number): MapDef => ({ ...room([{ x: 3, y: 1, hint: 'store' }]), features: [{ kind: 'sign', x, y: 1, id: 'store', text: 'The dwarves\' words for plenty.', read: 'STORE.' }] });
    ok(!hintFaults(scribed(2)).length && hintFaults(scribed(4)).length === 1, 'an inscription\'s reading on the near side is a hint the check counts, and behind the door it is not');
  }
}

/** Events and signs, the lair's door line, the endings' pages and the doubled "A sign reads". */
function text(): void {
  // Text: no event or sign wraps past three lines of the log as it shows them.
  for (const area of AREAS) {
    const count = [0, 0, 0, 0, 0];
    for (const def of area.maps) {
      for (const f of def.features ?? []) if (f.kind === 'event' || f.kind === 'sign') count[Math.min(4, logLines(shown(f)).length)]++;
      const faults = lineFaults(def);
      ok(!faults.length, `${area.id}/${def.id}: every event and sign fits ${MOST_LINES} lines of the log${faults.length ? ' -> ' + faults.join('; ') : ''}`);
    }
    console.log(`        ${area.id}: ${count.reduce((a, b) => a + b)} events and signs; by lines as shown, ${count.slice(1).map((n, i) => `${n} at ${i + 1}`).join(', ')}`);
  }
  {
    // An enclave's door line (#845) is held to the lines of the log, at its longest, and read with every text.
    const long = { ...LAIR, name: `The ${'Long '.repeat(30)}Hollow` }, door = enclaveLine(long, 27)!;
    ok(!lineFaults(LAIR).length && logLines(door).length > MOST_LINES && lineFaults(long).length === 1 && texts([LAIR], []).filter((t) => t.where === `${LAIR.id} door`).length === 2,
      `the fixture lair's door line fits the log at its longest (${logLines(enclaveLine(LAIR, 27)!).length} lines), one of ${logLines(door).length} fails, and both its feelings are read with every text`);
  }
  // The endings' pages (#750): the long-form exception, three to an ending, each within its screen and none held to the log's lines.
  {
    const faults = endingFaults(), widest = Object.values(ENDINGS).flatMap((e) => e.pages).reduce((a, p) => Math.max(a, logLines(p).length), 0);
    ok(!faults.length && widest > MOST_LINES, `each ending has ${ENDING_PAGES} pages, each within the ${PAGE.lines} lines of its screen (${Object.values(ENDINGS).map((e) => e.pages.map((p) => pageLines(p).length).join('+')).join(', ')}), though one takes ${widest} of the log${faults.length ? ' -> ' + faults.join('; ') : ''}`);
    const page = 'A fixture page, and short.', long = Array(30).fill('and the page goes on').join(' ');
    const fx = (pages: string[], flag = 'fx_end'): Record<string, Ending> => ({ fx: { flag: fxFlag(flag), title: 'Fixture', pages }, ...(flag === 'fx_end' ? {} : { other: { flag: fxFlag(flag), title: 'Other', pages } }) });
    ok(!endingFaults(fx([page, page, page])).length && endingFaults(fx([page, page])).length === 1 && endingFaults(fx([page, page, long])).length === 1 && endingFaults(fx([page, page, page], 'fx_twice')).length === 1,
      'a fixture ending of three short pages passes; of two, with a page longer than its screen, or setting another\'s flag, it fails');
  }
  // The log puts "A sign reads:" before a sign's words, so a sign's own text never says it again.
  const doubled = MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => (f.kind === 'sign' && /^\W*a sign reads/i.test(f.text) ? [`${d.id} ${f.x},${f.y}`] : [])));
  ok(!doubled.length, `no sign's text opens with "A sign reads", which the log adds${doubled.length ? ' -> ' + doubled.join('; ') : ''}`);
  {
    const long = 'The corridor runs on into the dark, and every step of it is carved with hands, palm out, hundreds of them, then thousands; some are small as a child\'s, and some are bigger than any hand that ever lived. Nobody has swept here.';
    const at = (features: MapDef['features']): MapDef => ({ id: 'fixture_text', name: 'Text fixture', kind: 'dungeon', start: { x: 1, y: 1, facing: NORTH }, rows: ['###', '#.#', '###'], features });
    ok(lineFaults(at([{ kind: 'event', x: 1, y: 1, id: 'e', text: long }])).length > 0, `an event of four lines fails (${logLines(long).length} lines)`);
    // Three lines by its words and four with the prefix: the prefix is counted.
    let sign = long.slice(0, 120);
    while (logLines(sign).length < 3 || logLines(signLine(sign)).length < 4) sign += ' more';
    ok(logLines(sign).length === 3 && lineFaults(at([{ kind: 'sign', x: 1, y: 1, text: sign }])).length > 0, 'a sign of three lines by its words and four as the log shows it fails');
    const two = 'A cold draught at your ankles, from the foot of the south wall. The mortar there is newer.';
    ok(logLines(two).length === 2 && lineFaults(at([{ kind: 'event', x: 1, y: 1, id: 'a', text: two }, { kind: 'event', x: 1, y: 1, id: 'b', text: two + ' ' + two }])).length === 1, 'two texts on one square that fill more than the log together fail');
    // A ford by day, its sign and the ford by night: six lines, never more than four at once.
    const trio = (night: Partial<Presence>): MapDef => at([{ kind: 'event', x: 1, y: 1, id: 'day', text: two, when: { hours: 'day' } }, { kind: 'sign', x: 1, y: 1, text: 'The ford.' }, { kind: 'event', x: 1, y: 1, id: 'night', text: two, ...night }]);
    ok(logLines(signLine('The ford.')).length + 2 * logLines(two).length > LOG_LINES && !lineFaults(trio({ when: { hours: 'night' } })).length && lineFaults(trio({})).length === 1,
      'a text by day and one by night on a square are not added together, but three that can all be said are');
    const lamp = (lit: Partial<Presence>): MapDef => at([{ kind: 'event', x: 1, y: 1, id: 'dark', text: two + ' ' + two, until: { flag: fxFlag('q_lit') } }, { kind: 'event', x: 1, y: 1, id: 'lit', text: two + ' ' + two, ...lit }]);
    ok(2 * logLines(two + ' ' + two).length > LOG_LINES && !lineFaults(lamp({ after: { flag: fxFlag('q_lit') } })).length && lineFaults(lamp({})).length === 1,
      'a text until a flag and one after it are not added together, but one with no presence is');
    // An inscription (#538) is measured as a reader with the longest name hears it the first time:
    // its words, its reading and its mark, three entries that are said together.
    const vent = (text: string, read: string, marks?: string): MapDef => at([{ kind: 'sign', x: 1, y: 1, id: 'vent', text, read, ...(marks ? { marks } : {}) }]);
    const mouth = 'The dwarves\' words for the mountain\'s breath, cut over the adit.';
    const heard = signTexts({ kind: 'sign', x: 1, y: 1, id: 'vent', text: mouth, read: 'VENT. STAND CLEAR.', marks: 'lava_tubes' }, LONGEST_NAME).map((t) => logLines(t).length);
    ok(heard.join() === '2,1,1' && !lineFaults(vent(mouth, 'VENT. STAND CLEAR.', 'lava_tubes')).length, `the Feuerstollen brief's inscription, read and marking the map, fills the log and no more (${heard.join(' + ')} lines)`);
    const longer = 'VENT. STAND CLEAR. NO NAKED FLAME. KEEP THIS DOOR SHUT.';
    ok(logLines(readLine(LONGEST_NAME, longer)).length === 2 && lineFaults(vent(mouth, longer, 'lava_tubes')).length === 1 && !lineFaults(vent(mouth, longer)).length,
      'a reading a line longer fails while it marks the map, and passes when it marks nothing');
    ok(lineFaults(vent(mouth, two + ' ' + two)).some((f) => f.includes('reading')), 'and a reading of four lines fails on its own');
  }
}

/** The monsters' looks. */
function looks(): void {
  // A monster's look fits two lines of the log; the looks go through the glyph and spelling checks below with every text.
  {
    const faults = lookFaults(Object.values(MONSTERS)), looks = Object.values(MONSTERS).filter((m) => m.look).length;
    ok(!faults.length, `every monster's look fits ${LOOK_LINES} lines of the log (${looks} of ${Object.keys(MONSTERS).length} have one)${faults.length ? ' -> ' + faults.join('; ') : ''}`);
    const long = 'A heap of wet rope and weed the size of a cart, that heaves itself up the shingle on a hundred pale arms, each ending in a hand.';
    ok(logLines(long).length === 3 && lookFaults([{ ...MONSTERS.rat, look: long }]).length === 1, 'a look of three lines fails');
    ok(!lookFaults([{ ...MONSTERS.rat, look: 'A rat the size of a dog, grey and scabbed.' }]).length, 'and one of a line passes');
    // A fight's log wraps as the exploring log does, so a look of two lines, said as it opens, shows whole.
    const two = 'A man in a leather coat matted with salt, a lantern held high on a pole and a knife in the other hand.';
    const shown = logTail(['2 Wreckers appear!', 'The fog spoils every archer\'s aim.', two], COMBAT_LOG_LINES);
    ok(logLines(two).length === 2 && LAYOUT.view.w === LAYOUT.log.w && shown.slice(-2).map((l) => l.text).join(' ') === two && shown.every((l) => measureText(l.text) <= LAYOUT.log.w - 12) && shown.slice(-2).every((l) => l.latest),
      `a fight's log shows a two-line look whole, each line inside the view (${shown.map((l) => measureText(l.text)).join(', ')} of ${LAYOUT.log.w - 12}px)`);
    const withLook = withDefs(MONSTERS, [{ ...MONSTERS.rat, look: 'A gray rat—big as a dog.' }], () => texts());
    const bad = withLook.filter((t) => t.where === 'monster rat');
    ok(bad.some((t) => missingGlyphs(t.text).length === 1 && americanisms(t.text).length === 1), 'a look is read with every text: a dash and gray in one are caught');
  }
}

/** A crossing's words. */
function crossings(): void {
  // A crossing's words (#539, game/passage.ts): where it goes as the menu names it, the line said as it lands and the seller's
  // warning. Those of every person who sells one and of both ends of every crossing between towns go through the glyph and
  // spelling checks below with every text, and the landing line and the warning are held to the lines of the log as an event is.
  {
    const sold = MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => (f.kind === 'npc' ? f.passage ?? [] : [])));
    const ends = CROSSINGS.flatMap((c) => c.ends);
    const faults = crossingLineFaults();
    ok(!faults.length, `every landing line and warning of a crossing fits ${MOST_LINES} lines of the log (${sold.length} passages sold, ${ends.length} crossing ends)${faults.length ? ' -> ' + faults.join('; ') : ''}`);
    const read = texts().filter((t) => t.where.includes(' passage to ') || t.where.startsWith('crossing ')).map((t) => t.text);
    const words = [...sold, ...ends].flatMap((p) => [p.name, p.label, p.warning]).filter((t): t is string => t !== undefined);
    ok(words.length > 0 && words.every((t) => read.includes(t)), `the ${words.length} words of the passages sold and the crossing ends are among the texts the company reads`);
    // Fixtures: a boatman who sells a passage, and a crossing between two towns, each with one word broken at a time.
    const person = (p: Partial<Passage>): MapDef => ({
      id: 'fixture_seller', name: 'Seller fixture', kind: 'town', start: { x: 1, y: 1, facing: NORTH }, rows: ['###', '#.#', '###'],
      features: [{ kind: 'npc', x: 1, y: 1, name: 'A boatman', lines: ['"Aye."'], passage: [{ to: 'nowhere', x: 1, y: 1, name: 'The isle', by: 'boat', fare: 10, departs: 20, days: 1, arrives: 6, ...p }] }],
    });
    const run = (e: Partial<CrossingEnd>): Crossing => ({ name: 'the fixture boat', by: 'boat', fare: 10, departs: 20, days: 1, arrives: 6, ends: [{ at: 'fx_isle', name: 'The isle', ...e }, { at: 'fx_port', name: 'The port' }] });
    const sellers = (p: Partial<Passage>): { text: string }[] => texts([person(p)], []).filter((t) => t.where.includes(' passage to '));
    const crossed = (e: Partial<CrossingEnd>): { text: string }[] => texts([], [run(e)]).filter((t) => t.where.startsWith('crossing the fixture boat '));
    const lacking = (t: { text: string }[]): number => t.reduce((n, x) => n + missingGlyphs(x.text).length, 0);
    const broken = { name: 'Café', label: 'The boat comes in—late.', warning: '"It’s no night for it."' } as const;
    ok(lacking(sellers({})) === 0 && lacking(crossed({})) === 0 && (['name', 'label', 'warning'] as const).every((k) => lacking(sellers({ [k]: broken[k] })) === 1 && lacking(crossed({ [k]: broken[k] })) === 1),
      "a passage's name, landing line or warning with a glyph the font lacks is caught, on a person who sells it and on the end of a crossing");
    const spelt = (t: { text: string }[]): number => t.reduce((n, x) => n + americanisms(x.text).length, 0);
    ok(spelt(sellers({ warning: '"I carry no armor."' })) === 1 && spelt(crossed({ label: 'The color of the sea.' })) === 1 && !spelt(sellers({ warning: '"I carry no armour."' })),
      'and so is an American spelling in one');
    let three = 'The boat comes in under the cliff with the tide.';
    while (logLines(three).length < MOST_LINES) three += ' Nobody speaks.';
    let four = three;
    while (logLines(four).length <= MOST_LINES) four += ' Nobody speaks.';
    ok(logLines(three).length === MOST_LINES && logLines(four).length === MOST_LINES + 1 && !crossingLineFaults([person({ label: three, warning: three })], [run({ label: three, warning: three })]).length,
      `a landing line and a warning of ${MOST_LINES} lines pass`);
    const long = [crossingLineFaults([person({ label: four })], []), crossingLineFaults([person({ warning: four })], []), crossingLineFaults([], [run({ label: four })]), crossingLineFaults([], [run({ warning: four })])];
    ok(long.every((f) => f.length === 1), `and of ${MOST_LINES + 1} fail, on a person who sells the passage and on the end of a crossing (${long.map((f) => f.join()).join('; ')})`);
  }
}

/** Every glyph and the spelling, in every text. */
function glyphs(): void {
  // Every glyph is in the font, and the spelling is British, in every text.
  const all = texts();
  const unglyphed = all.flatMap((t) => missingGlyphs(t.text).map((ch) => `'${ch}' in ${t.where}`));
  ok(!unglyphed.length, `every character of the ${all.length} texts has a glyph in the pixel font${unglyphed.length ? ' -> ' + unglyphed.join(', ') : ''}`);
  const american = all.flatMap((t) => americanisms(t.text).map((w) => `'${w}' in ${t.where}`));
  ok(!american.length, `the ${all.length} texts spell as the game does, not American${american.length ? ' -> ' + american.join(', ') : ''}`);
  ok(missingGlyphs('Ashcombe—the café’s door').length === 3, 'a dash, an accent and a curled quote have no glyph, and fail');
  ok(americanisms('The gray walls lose their Color.').length === 2 && !americanisms('Armour of every size, a prize to seize.').length, 'gray and color fail; armour, size, prize and seize do not');
}

/** The secret's pace. */
function pace(): void {
  // The secret's pace (#158): no machine before the bottom of the Deep Mines, no Rift after Cairnmoor.
  {
    const kindOf = (id: string): MonsterDef['kind'] | undefined => MONSTERS[id]?.kind;
    const zoneOf = (id: string): string | undefined => (zoneOfMap(ATLAS, id) ?? zoneOfMap(ATLAS, homeMap(MAP_DEFS, id)?.id ?? ''))?.id;
    const paced: PacedMap[] = AREAS.flatMap((a) => a.maps.map((def) => ({ def, area: a.id as string, zone: zoneOf(def.id) })));
    const pace = paceFaults(paced, kindOf, ATLAS, MAP_DEFS, worldGrid(ATLAS, MAP_DEFS));
    ok(!pace.length, `no machine before the bottom of the Deep Mines and no Rift after Cairnmoor, over ${paced.length} maps and the atlas${pace.length ? ' -> ' + pace.join('; ') : ''}`);
    // Fixtures: a keeper, a machine, on the Tide Ship fails; under it in the Dead-Drop, at 26, it does not.
    const fx = (id: string, band: [number, number], monsters: string[], extra: Partial<MapDef> = {}): MapDef =>
      ({ id, name: id, kind: 'dungeon', band, start: { x: 1, y: 1, facing: NORTH }, rows: ['###', '#.#', '###'], encounters: [{ id: `${id}_g`, x: 1, y: 1, monsters }], ...extra });
    const fxKind = (id: string): MonsterDef['kind'] | undefined => (id === 'keeper' ? 'machine' : id === 'riftling' ? 'rift' : kindOf(id));
    const judge = (...maps: PacedMap[]): string[] => paceFaults(maps, fxKind, ATLAS, [...MAP_DEFS, ...maps.map((m) => m.def)]);
    const ship = judge({ def: fx('tide_ship', [13, 14], ['keeper']), area: 'wrackholm' });
    ok(ship.length === 1 && /tide_ship: a machine/.test(ship[0]), `a keeper on the Tide Ship fails (${ship.join('; ')})`);
    ok(!judge({ def: fx('dead_drop', [26, 28], ['keeper']), area: 'wrackholm' }).length && judge({ def: fx('dead_drop', [26, 28], ['riftling']), area: 'wrackholm' }).length === 1,
      'under it, the Dead-Drop at 26 to 28 is placed by its band: a keeper passes there, and a riftling fails, past Cairnmoor');
    const mines = [fx('deep_mines1', [16, 17], ['keeper']), fx('deep_mines2', [17, 18], ['keeper'])].map((def) => ({ def, area: 'kilns' }));
    const deep = judge(...mines);
    ok(deep.length === 1 && /deep_mines1/.test(deep[0]) && judge({ def: fx('anvilhall', [16, 18], ['keeper']), area: 'kilns' }).length === 1 && judge({ def: fx('anvilhall', [16, 18], ['keeper']), area: 'kilns' }, ...mines).length === 2,
      `in the Kilns a machine stands only on the Deep Mines' last level (${deep.join('; ')}), and with no Mines built, nowhere`);
    ok(!judge({ def: fx('cairns', [18, 20], ['riftling'], { features: [{ kind: 'rift', x: 1, y: 1, id: 'r', to: 'x', tx: 0, ty: 0 }] }), area: 'cairnmoor' }).length
      && judge({ def: fx('rime_lodge', [20, 22], ['riftling']), area: 'rimewater' }).length === 1
      && judge({ def: fx('ice_caves', [20, 22], [], { features: [{ kind: 'rift', x: 1, y: 1, id: 'r', to: 'x', tx: 0, ty: 0 }] }), area: 'rimewater' }).length === 1,
      'a Rift in Cairnmoor passes, and a riftling or a tear in Rimewater after it fails');
    ok(!judge({ def: fx('ice_caves', [20, 22], ['riftling', 'keeper']), area: 'rimewater', zone: 'glacierfoot' }).length, 'the reach is exempt: Glacier Foot may hold either');
  }
}

/** What each area claims is new. */
async function novelty(): Promise<void> {
  // Novelty: each area's claim of what is new in it exists, is used in it and is nowhere earlier on the road.
  const family = new Map((await familyModules()).map((m) => [m.name, m.kinds]));
  ok(family.size > 0, `the monster families: ${[...family.keys()].join(', ')}`);
  const faults = noveltyFaults(AREAS, family, ATLAS, MAP_DEFS);
  for (const area of AREAS) {
    const mine = faults.filter((f) => f.startsWith(area.id + ':'));
    const claim = (Object.entries(area.novel) as [string, readonly string[]][]).filter(([, v]) => v.length).map(([k, v]) => `${k} ${v.join(', ')}`).join('; ');
    ok(!mine.length, `${area.id}: what it claims is new holds${claim ? ` (${claim})` : area.maps.length ? ' (nothing, as the first on the road)' : ' (nothing, with no map yet)'}${mine.length ? ' -> ' + mine.join('; ') : ''}`);
  }
  {
    const [first, second] = AREAS;
    const claim = (novel: Partial<Novelty>): string[] => noveltyFaults([first, { ...second, novel: { families: [], terrain: [], mechanics: [], landmarks: [], ...novel } }], family);
    ok(claim({ families: ['wolf'] }).length === 1, `${second.id} claiming wolves, which ${first.id} places, fails`);
    ok(claim({ families: ['dragon'] }).length === 1, 'a family with no module fails');
    ok(claim({ terrain: ['hills'] }).length === 1, 'terrain no map of the area uses fails');
    ok(claim({ landmarks: ['city'] }).length === 1, `a landmark ${first.id} already has fails`);
    ok(claim({ mechanics: ['feature:sign'] }).length === 1, `a mechanic ${first.id} already has fails`);
    ok(claim({}).length === 1, 'an area after the first that claims nothing fails');
    ok(!noveltyFaults([first, { ...second, maps: [], novel: { families: [], terrain: [], mechanics: [], landmarks: [] } }], family).length,
      'but one with no map yet, as a new area starts (EXPANSION §8.2), may claim nothing until its first');
    // Kiln-script (#538): an inscription is a mechanic of its own, and so is a reading that marks the map.
    const scribe: MapDef = { id: 'fixture_scribe', name: 'Scribe fixture', kind: 'dungeon', start: { x: 1, y: 1, facing: NORTH }, rows: ['###', '#.#', '###'], features: [{ kind: 'sign', x: 1, y: 1, id: 'fx_vent', text: 'Words.', read: 'VENT.', marks: 'lava_tubes' }] };
    const novel = (maps: readonly MapDef[]): string[] => noveltyFaults([first, { ...second, maps: [...second.maps, ...maps], novel: { families: [], terrain: [], mechanics: ['sign:read', 'sign:marks'], landmarks: [] } }], family);
    ok(!novel([scribe]).length && novel([]).length === 2, 'an area that reads an inscription marking the map may claim both, and one with none may not');
  }
  {
    // A map by its band (dead_drop §7): where its floor is over its area's band, it counts with the last
    // area whose floor is at or under its own, as the pace check places it. Wrackholm (12 to 14) lists
    // a level at 26, the Glasswold's; Ashfall (24 to 26) lies between.
    const placeOf = roadPlace(ATLAS, MAP_DEFS), order = (id: string): number => ATLAS.areas.find((a) => a.id === id)?.order ?? -1;
    ok(placeOf('wrackholm', { band: [26, 28] }) === order('glasswold') && placeOf('wrackholm', { band: [12, 13] }) === order('wrackholm') && placeOf('wrackholm', {}) === order('wrackholm'),
      'a map of Wrackholm at 26 to 28 is placed with the Glasswold; one in its band, or with none, stays with Wrackholm');
    const keeper = Object.values(MONSTERS).find((m) => family.get('keepers')?.includes(m.sprite))?.id ?? '';
    const room = (id: string, band: [number, number], monsters: string[] = []): MapDef =>
      ({ id, name: id, kind: 'dungeon', band, start: { x: 1, y: 1, facing: NORTH }, rows: ['###', '#.#', '###'], ...(monsters.length ? { encounters: [{ id: `${id}_g`, x: 1, y: 1, monsters }] } : {}) });
    // What the check says of a claim of the keepers when the level at 26 alone has them, and when a room of Ashfall's has them too.
    const claims = (claim: Record<string, Partial<Novelty>>, ashfall: MapDef[] = []): string[] => noveltyFaults([
      { id: 'wrackholm', maps: [room('fx_hold', [12, 13]), room('fx_drop', [26, 27], [keeper])] },
      { id: 'ashfall', maps: [room('fx_ash', [24, 25]), ...ashfall] },
      { id: 'glasswold', maps: [room('fx_glass', [26, 27])] },
    ].map((a) => ({ ...a, atlas: { zones: [], places: [], sites: [] }, novel: { families: [], terrain: [], mechanics: [], landmarks: [], ...claim[a.id] } })), family).filter((f) => f.includes("'keepers'"));
    const keepers = { families: ['keepers'] }, only = (faults: string[], re: RegExp): boolean => faults.length === 1 && re.test(faults[0]);
    const own = [room('fx_ash2', [24, 25], [keeper])];
    ok(keeper !== '' && !claims({ glasswold: keepers }).length, 'the Glasswold may claim the keepers that a level of Wrackholm at 26 places: the level counts with it');
    ok(only(claims({ wrackholm: keepers }), /^wrackholm: .*which it does not use/) && only(claims({ ashfall: keepers }), /^ashfall: .*which it does not use/),
      'Wrackholm may not claim them, and nor may Ashfall between: neither places them, and neither is told they are on the road before');
    ok(!claims({ ashfall: keepers }, own).length && only(claims({ ashfall: keepers, glasswold: keepers }, own), /^glasswold: .*on the road before it/),
      'Ashfall, placing them in a room of its own, may claim them (the level is not before it), and the Glasswold then may not');
  }
}

/** The owed rows read once, and the land agreeing with the map at a zone map's edge. */
function edges(): void {
  // An owed square and an owed lock are owed once, by one area, though an issue may be owed by several.
  ok(...once('every owed square and owed lock is named once', [...edgesOwed.twice, ...locksOwed.twice]));
  const owedFx = gatherLists([['#1', ['fx_a 1,1', 'fx_a 2,1']], ['#1', ['fx_b 1,1']], ['#2', ['fx_a 1,1']]]);
  ok(Object.entries(owedFx.all).join(' ') === 'fx_a 1,1,#1 fx_a 2,1,#1 fx_b 1,1,#1' && owedFx.twice.join() === 'fx_a 1,1',
    'an issue owed by two areas is read from both, and a square or a lock owed twice is refused (#897)');
  // The land agrees with the map: water and roads carry on across a zone map's edge.
  const edges = edgeFaults(ATLAS, MAP_DEFS);
  for (const area of AREAS) for (const def of area.maps.filter((d) => d.kind === 'outdoor')) {
    const mine = edges.filter((e) => e.map === def.id);
    const known = Object.entries(edgesOwed.all).filter(([k]) => k.startsWith(def.id + ' ')).map(([k, whose]) => ({ whose, at: k.slice(def.id.length + 1) }));
    const fresh = mine.filter((e) => !known.some((k) => k.at === `${e.x},${e.y}`));
    ok(!fresh.length, `${area.id}/${def.id}: its water and roads carry on into the atlas beyond its edge${known.length ? `, but for ${known.length} square(s) owed` : ''}${fresh.length ? ' -> ' + fresh.map((e) => `${e.x},${e.y} ${e.why}`).join('; ') : ''}`);
    for (const { whose, at } of known) {
      const e = mine.find((f) => `${f.x},${f.y}` === at);
      owed(!e, `${def.id} ${at}: map and atlas agree at the edge${e ? ` (today ${e.why})` : ''}`, whose);
    }
  }
  {
    // A fixture zone laid on open atlas land, as tools/tests/atlas.ts lays one, where no zone map is
    // laid: a map built there moves it. It lay on B2's grass until B2 was built (#830), and lies now on
    // the steppe of C10, in the Glass, the reach, which is drawn and left unbuilt (#828).
    const lay = (rows: string[]): EdgeFault[] => {
      const fixture: MapDef = { id: 'fixture_edge', name: 'Edge fixture', kind: 'outdoor', start: { x: 2, y: 2, facing: NORTH }, rows };
      const at: [number, number] = [88, 296];
      const zone: AtlasZone = { id: 'fixture_edge', name: 'Edge fixture', area: ATLAS.zones[0].area, maps: [{ map: 'fixture_edge', at }] };
      const atlas = { ...ATLAS, zones: [...ATLAS.zones, zone] };
      if (!mapAt(atlas, fixture.id)) throw new Error('the edge fixture is not laid: its checks would pass on nothing');
      const under = MAP_DEFS.find((d) => { const m = mapAt(ATLAS, d.id); return m && at[0] + 7 > m[0] && at[0] - 1 < m[0] + d.rows[0].length && at[1] + 6 > m[1] && at[1] - 1 < m[1] + d.rows.length; });
      if (under) throw new Error(`the edge fixture lies on or beside ${under.id}: move it to land no zone map covers`);
      return edgeFaults(atlas, [...MAP_DEFS, fixture]).filter((e) => e.map === 'fixture_edge');
    };
    ok(!lay(['MMMMMM', 'M,,,,M', 'M,,,,M', 'M,,,,M', 'MMMMMM']).length, 'a fixture zone of grass on atlas land agrees at its edges');
    ok(lay(['MMMMMM', 'M,,,,M', 'M====M', 'M,,,,M', 'MMMMMM']).length === 2, 'a road that runs into its ring against atlas land fails, at both ends');
    ok(lay(['MMMMMM', 'M,,,,M', 'MW,,,M', 'M,,,,M', 'MMMMMM']).length === 1, 'and so does sea at its edge');
    ok(lay(['MMMMMM', 'M,,,,M', '=,,,,M', 'M,,,,M', 'MMMMMM']).length === 1, 'and a road through a gap in the ring');
    // Land against open water along an edge: a shore, not water cut short. Laid on the Deepthorn's
    // west, in the cut H4, its east edge faces the inner sea at 226,96-98; the premise is checked first.
    const coast = (rows: string[]): EdgeFault[] => {
      const fixture: MapDef = { id: 'fixture_coast', name: 'Coast fixture', kind: 'outdoor', start: { x: 2, y: 2, facing: NORTH }, rows };
      const w = rows[0].length, zone: AtlasZone = { id: 'fixture_coast', name: 'Coast fixture', area: 'thornmark', maps: [{ map: 'fixture_coast', at: [226 - w, 95] }] };
      const atlas = { ...ATLAS, zones: [...ATLAS.zones, zone] };
      if (!mapAt(atlas, fixture.id)) throw new Error('the coast fixture is not laid: its checks would pass on nothing');
      return edgeFaults(atlas, [...MAP_DEFS, fixture]).filter((e) => e.map === 'fixture_coast' && e.x === w - 1);
    };
    const shore = worldGrid(ATLAS, MAP_DEFS), open = [96, 97, 98].every((y) => {
      const i = y * shore.width + 226;
      return isWater(shore.t(226, y)) && !shore.river[i] && !shore.road[i] && !shore.built[i];
    }) && [95, 96, 97, 98, 99].every((y) => Array.from({ length: 7 }, (_, k) => 220 + k).every((x) => !shore.built[y * shore.width + x]));
    ok(open, 'the atlas at 226,96-98 is open water, no river, road or zone map, and the fixture\'s squares beside it are no zone map\'s');
    ok(open && !coast(['MMMMMM', 'M,,,,M', 'M,,,,M', 'M,,,,M', 'MMMMMM']).length, 'map land against open atlas water along an edge passes, a shore');
    // A ford: the atlas's road crosses a river beyond the edge, and only a road on the map meets it.
    const ford = { t: TI.shallow, road: true, river: true };
    ok(edgeAgrees('road', ford) === true && ['shallow', 'sea', 'grass'].every((m) => edgeAgrees(m, ford) === false), 'at a ford beyond the edge a road passes, and shallows, sea and grass fail');
    ok(edgeAgrees('grass', { t: TI.shallow, road: false, river: true }) === false && edgeAgrees('shallow', { t: TI.shallow, road: false, river: true }) === true, 'a river beyond the edge wants water on the map');
  }
}

/** The story locks. */
function locks(): void {
  // Story locks: every one signed in, within the counts, none between areas; every hand-in takes
  // its item at the first meeting.
  const found = findLocks(AREAS);
  const areaOf = (map: string): string | undefined => AREAS.find((a) => a.maps.some((d) => d.id === map))?.id;
  const owing = Object.keys(locksOwed.all);
  const lockBad = lockFaults(found, LOCKS, areaOf, owing);
  for (const area of AREAS) {
    const mine = lockBad.filter((f) => f.area === area.id).map((f) => f.text);
    ok(!mine.length, `${area.id}: every flag that closes something is signed in, and no hand-in withholds its item${mine.length ? ' -> ' + mine.join('; ') : ''}`);
  }
  const open = found.filter((f) => f.way).map((f) => `${f.key} on ${f.flags.join(' and ')}, ${f.way}`);
  ok(true, `what a flag shuts with a way left open is no lock (${open.length}${open.length ? ': ' + open.join('; ') : ''})`);
  const road = lockBad.filter((f) => !f.area || !AREAS.some((a) => a.id === f.area)).map((f) => f.text);
  ok(!road.length, `the road's ${LOCKS.length} story lock(s) keep to ${MOST_AN_AREA} an area and ${MOST_ON_THE_ROAD} in all${road.length ? ' -> ' + road.join('; ') : ''}`);
  for (const [key, whose] of Object.entries(locksOwed.all)) {
    const f = found.find((l) => l.key === key);
    owed(!f, key.startsWith('hand-in') ? `${key}: takes its item at the first meeting${f ? ` (today not before ${f.flags.join(', ')})` : ''}` : `${key}: no lock between areas${f ? ` (today ${f.flags.join(' and ')})` : ''}`, whose);
  }
  const opens = storyWays(ATLAS.links);
  ok(!opens.length, `no way on the atlas opens on the story${opens.length ? ' -> ' + opens.join(', ') : ''}`);
  {
    const room = (exits: MapDef['exits'], features: MapDef['features'] = []): MapDef => ({ id: 'fixture_lock', name: 'Lock fixture', kind: 'dungeon', start: { x: 1, y: 1, facing: NORTH }, rows: ['#####', '#...#', '#####'], exits, features });
    const [first, second] = AREAS;
    const areas = (def: MapDef): Pick<Area, 'id' | 'maps'>[] => [{ id: first.id, maps: [...first.maps, def] }, { id: second.id, maps: second.maps }];
    const within = (def: MapDef): FoundLock[] => findLocks(areas(def)).filter((f) => f.map === def.id);
    const of = (map: string): string | undefined => map === 'fixture_lock' ? first.id : areaOf(map);
    const sealed = room([{ x: 3, y: 1, to: first.maps[0].id, tx: 1, ty: 1, needFlag: 'q_seal' }]);
    const lock = (l: Partial<StoryLock> = {}): StoryLock => ({ flag: 'q_seal', map: 'fixture_lock', x: 3, y: 1, what: 'A sealed door.', reason: 'The fixture.', ...l });
    ok(lockFaults(within(sealed), [], of).length === 1, 'an exit closed on a flag not signed in fails');
    ok(!lockFaults(within(sealed), [lock()], of).length, 'and passes once it is signed in');
    ok(lockFaults(within(sealed), [lock(), lock({ flag: 'q_other', x: 2 })], of).length === 2, 'a second lock in one area fails, and so does a lock that closes nothing');
    ok(lockFaults([], [0, 1, 2, 3, 4].map((i) => lock({ map: `m${i}` })), () => undefined).some((f) => f.text.startsWith('the road')), `more than ${MOST_ON_THE_ROAD} on the road fails`);
    const across = room([{ x: 3, y: 1, to: second.maps[0].id, tx: 1, ty: 1, needFlag: 'q_seal' }]);
    ok(lockFaults(within(across), [lock()], of).some((f) => f.text.includes('between')), 'a lock between areas fails, even signed in');
    // An exit there `after` the company's answer is an appearance, no lock, between areas too (#749).
    const answered = room([{ x: 3, y: 1, to: second.maps[0].id, tx: 1, ty: 1, after: [{ flag: fxFlag('q_open') }, { flag: fxFlag('q_shut') }] }]);
    ok(!within(answered).length && !lockFaults(within(answered), [], of).length, 'an exit that is there after a flag is found as no lock, though it leads into another area');
    const door = room([], [{ kind: 'npc', x: 2, y: 1, name: 'Fixture', lines: ['Hm.'], quest: { item: 'rations', needFlag: 'q_hired', reward: 1, done: ['Ta.'], setFlag: 'q_fx', after: ['Ta.'] } }] as unknown as MapDef['features']);
    ok(within(door)[0]?.kind === 'hand-in' && lockFaults(within(door), [], of).length === 1, 'a hand-in that withholds its item on a flag fails');
    const listed = room([], [{ kind: 'npc', x: 2, y: 1, name: 'Fixture', lines: ['Hm.'], quest: [{ item: 'rations', reward: 1, done: ['Ta.'], setFlag: 'q_fx' }, { item: 'rations', needFlag: 'q_hired', reward: 1, done: ['Ta.'], setFlag: 'q_fx2' }] }] as unknown as MapDef['features']);
    ok(within(listed)[0]?.kind === 'hand-in' && lockFaults(within(listed), [], of).length === 1, 'and so does one of a list of hand-ins');
    ok(lockFaults(within(door), [lock({ flag: 'q_hired', x: 2 })], of).some((f) => f.text.includes('first meeting')), 'and still fails with a lock signed in for it');
    const legend = { ...room([]), rows: ['#####', '#.X.#', '#####'], legend: { X: { door: 'door', needFlag: 'q_sealed' } } } as unknown as MapDef;
    ok(within(legend).length === 1 && within(legend)[0].x === 2 && lockFaults(within(legend), [], of).length === 1, 'a legend door closed on a flag is found on its square, and fails unsigned');
    const nowhere = { ...room([]), needFlag: 'q_sealed' } as unknown as MapDef;
    const lost = within(nowhere)[0];
    ok(within(nowhere).length === 1 && !!lost && lockFaults(within(nowhere), [lock({ flag: 'q_sealed', x: lost.x, y: lost.y })], of).some((f) => f.text.startsWith(lost.key + ':')), 'a flag with no square fails, and cannot be signed in');
    const gate = { ...room([]), rows: ['#####', '#XX.#', '#####'], legend: { X: { door: 'door', needFlag: 'q_sealed' } } } as unknown as MapDef;
    ok(within(gate).length === 1 && !lockFaults(within(gate), [lock({ flag: 'q_sealed', x: 1 })], of).length, 'a legend gate two wide is one lock, signed in at its first square');
    const service = { ...room([]), features: [{ kind: 'temple', x: 2, y: 1, name: 'Fixture', interior: first.interiors[0], needFlag: 'q_blessed' }] } as unknown as MapDef;
    ok(within(service)[0]?.kind === 'other' && lockFaults(within(service), [], of).length === 1, 'and so does a service closed on a flag no type knows yet');
    const to = first.maps[0].id;
    const turned = room([{ x: 3, y: 1, to, tx: 1, ty: 1, shut: { flag: 'q_seal', member: { race: 'orcblood' } } }, { x: 1, y: 1, to, tx: 1, ty: 1 }]);
    const alone = within({ ...turned, id: 'fixture_alone' }).filter((f) => f.key.endsWith('shut'));
    ok(alone.length === 1 && alone[0].kind === 'exit' && alone[0].flags.join() === 'q_seal,a member orcblood', 'an exit shut on a flag and a race is found');
    const only = room([{ x: 3, y: 1, to, tx: 1, ty: 1, shut: { flag: 'q_seal' } }]);
    ok(lockFaults(within(only).filter((f) => f.key.endsWith('shut')), [], of).length === 1, 'and fails with no other way from its map into the map it leads to');
    ok(!!within(turned)[0]?.way && !lockFaults(within(turned), [], of).length, 'and passes while another way from its map into that one stays open');
    const later = room([{ x: 3, y: 1, to, tx: 1, ty: 1, shut: { flag: 'q_seal' }, lifts: { flag: fxFlag('q_free') } }, { x: 1, y: 1, to, tx: 1, ty: 1, after: { flag: fxFlag('q_open') } }]);
    ok(lockFaults(within(later).filter((f) => f.key.endsWith('shut')), [], of).length === 1, 'a shut that lifts is still found, and an exit not there yet is no way beside it');
    const shutUp = room([], [{ kind: 'temple', x: 2, y: 1, name: 'Fixture', interior: first.interiors[0], until: { flag: 'q_seal' } }] as unknown as MapDef['features']);
    const lonely = findLocks([{ id: first.id, maps: [shutUp] }]).filter((f) => f.kind === 'service');
    ok(lonely.length === 1 && lockFaults(lonely, [], of).length === 1, 'a business gone on a flag is found as a service shut, and fails with its trade had nowhere else');
    const elsewhere = within(shutUp).filter((f) => f.kind === 'service');
    ok(!!elsewhere[0]?.way && !lockFaults(elsewhere, [], of).length, 'and passes while the same trade is sold elsewhere');
    // Act III's lock stays on the bay's door (#440): the pass from Loch Fuar into Monks' Vale shut on its
    // flag is a lock between areas, signed in or not, and the pass on the atlas opening on a step fails too.
    const [fuar, vale] = ['coldmere', 'monksvale'].map((z) => ATLAS.zones.find((x) => x.id === z)!.area);
    const pass = { ...room([{ x: 3, y: 1, to: fxMap('fixture_vale'), tx: 1, ty: 1, needFlag: 'q_wenna_up' }]), id: 'fixture_pass' };
    const beyond = [{ id: fuar, maps: [pass] }, { id: vale, maps: [{ ...room([]), id: 'fixture_vale' }] }];
    const shut = findLocks(beyond).filter((f) => f.map === pass.id), whose = (m: string): string | undefined => beyond.find((a) => a.maps.some((d) => d.id === m))?.id;
    ok(shut.length === 1 && lockFaults(shut, [lock({ flag: 'q_wenna_up', map: pass.id })], whose).some((f) => f.text.endsWith(`a lock between ${fuar} and ${vale}`)),
      'the pass from Loch Fuar into Monks\' Vale shut on the act\'s flag is a lock between areas, and fails signed in');
    const high = ATLAS.links.find((l) => l.from === 'coldmere' && l.to === 'monksvale');
    ok(!!high && high.opens === undefined && storyWays(ATLAS.links.map((l) => (l === high ? { ...l, opens: 1 } : l))).includes('coldmere-monksvale after step 1'),
      'the pass is open on the atlas from the start, and fails shut until a step is done');
  }
}
