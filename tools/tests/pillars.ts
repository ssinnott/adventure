// The pillars, where a machine can check them (EXPANSION §5.4): every secret door has a hint on its
// near side; no event or sign runs past three lines of the log, every glyph is in the font and the
// spelling is British; each area's claim of what is new in it holds; a zone map's water and roads
// carry on into the atlas land beyond its edge; every story lock is signed in, none stands between
// areas, and every hand-in takes its item at the first meeting. Each check is a function of the content it reads, so it runs over every area and over
// fixtures broken on purpose, which it must refuse.
import { readdirSync } from 'node:fs';
import { AREAS, MAP_DEFS, ITEMS, MONSTERS, SPELLS, QUESTS, ATLAS } from '../../src/content/index.ts';
import type { Area, Novelty } from '../../src/content/area.ts';
import { LOCKS, MOST_AN_AREA, MOST_ON_THE_ROAD } from '../../src/content/locks.ts';
import type { StoryLock } from '../../src/content/locks.ts';
import { GameMap } from '../../src/game/map.ts';
import type { MapDef } from '../../src/game/map.ts';
import type { Atlas } from '../../src/game/atlas.ts';
import { worldGrid, isWater, TI, MAP_TERRAIN, TERRAINS } from '../../src/game/atlas.ts';
import { CLASSES, RACES, TRAITS } from '../../src/game/party.ts';
import { signLine } from '../../src/game/world.ts';
import { NORTH } from '../../src/game/types.ts';
import { FONT_CHARS } from '../../src/lib/engine/text.ts';
import { logLines, LOG_LINES } from '../../src/ui/frame.ts';
import { ok, owed } from './lib.ts';

/**
 * What is wrong with a map's secret doors and their hints: a secret door with no hint declared, a
 * hint on a square with no secret door, a hint that names nothing on the map, or one that cannot be
 * reached from the start with that door shut. The flood is the strictest: no keys, no swimming or
 * climbing; the other secret doors are walkable, as the party finds doors by walking into walls.
 */
export function hintFaults(def: MapDef): string[] {
  const map = new GameMap(def), out: string[] = [];
  const declared = def.secrets ?? [];
  for (let y = 0; y < map.height; y++) for (let x = 0; x < map.width; x++) {
    if (map.at(x, y).door === 'secret' && !declared.some((s) => s.x === x && s.y === y)) out.push(`the secret door at ${x},${y} names no hint`);
  }
  for (const s of declared) {
    if (map.at(s.x, s.y).door !== 'secret') { out.push(`${s.x},${s.y} has a hint but no secret door`); continue; }
    const hint = map.features.find((f) => 'id' in f && f.id === s.hint && (f.kind === 'event' || f.kind === 'sign'));
    if (!hint) { out.push(`the door at ${s.x},${s.y} names '${s.hint}', which is no event or sign on the map`); continue; }
    const seen = new Set([def.start.y * map.width + def.start.x]), todo = [[def.start.x, def.start.y]];
    while (todo.length) {
      const [x, y] = todo.pop()!;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy, i = ny * map.width + nx;
        if (seen.has(i) || (nx === s.x && ny === s.y) || map.passable(nx, ny) !== 'ok') continue;
        seen.add(i); todo.push([nx, ny]);
      }
    }
    if (!seen.has(hint.y * map.width + hint.x)) out.push(`'${s.hint}' at ${hint.x},${hint.y} lies behind the door at ${s.x},${s.y}, or out of reach`);
  }
  return out;
}

/** The most lines of the log an event or sign may take: two is the aim, and four fill it. */
export const MOST_LINES = 3;

/** An event or sign as the log shows it, a sign with its prefix. */
const shown = (f: { kind: string; text: string }): string => (f.kind === 'sign' ? signLine(f.text) : f.text);

/**
 * What is wrong with a map's events and signs as the log shows them: one that wraps past
 * MOST_LINES, or a square whose texts together are more than the log shows at once, so the first is
 * pushed off it.
 */
export function lineFaults(def: MapDef): string[] {
  const out: string[] = [], squares = new Map<string, number>();
  for (const f of def.features ?? []) {
    if (f.kind !== 'event' && f.kind !== 'sign') continue;
    const n = logLines(shown(f)).length, at = `${f.x},${f.y}`;
    if (n > MOST_LINES) out.push(`the ${f.kind} at ${at} takes ${n} lines`);
    squares.set(at, (squares.get(at) ?? 0) + n);
  }
  for (const [at, n] of squares) if (n > LOG_LINES) out.push(`the texts at ${at} take ${n} lines together, more than the log's ${LOG_LINES}`);
  return out;
}

/** Every text the company reads, by where it is: names, lines, events, notes. Ids, rows, legends and palettes are not text. */
export function texts(defs: readonly MapDef[] = MAP_DEFS): { where: string; text: string }[] {
  const out: { where: string; text: string }[] = [];
  const add = (where: string, ...t: (string | readonly string[] | undefined)[]): void => { for (const x of t.flat()) if (x !== undefined) out.push({ where, text: x }); };
  for (const d of defs) {
    add(d.id, d.name);
    for (const f of d.features ?? []) {
      const where = `${d.id} ${f.kind} ${f.x},${f.y}`;
      if ('text' in f) add(where, f.text);
      if ('name' in f) add(where, f.name);
      if (f.kind === 'npc') add(where, f.lines, f.quest?.done, f.quest?.after);
    }
    for (const e of d.exits ?? []) add(`${d.id} exit ${e.x},${e.y}`, e.label, e.blockedText);
    for (const e of d.encounters ?? []) add(`${d.id} ${e.id}`, e.slainText);
  }
  for (const i of Object.values(ITEMS)) add(`item ${i.id}`, i.name);
  for (const m of Object.values(MONSTERS)) add(`monster ${m.id}`, m.name, m.plural);
  for (const sp of Object.values(SPELLS)) add(`spell ${sp.id}`, sp.name, sp.text);
  for (const c of Object.values(CLASSES)) add(`class ${c.id}`, c.name, c.blurb);
  for (const r of Object.values(RACES)) add(`race ${r.id}`, r.name, r.blurb);
  for (const t of Object.values(TRAITS)) add(`trait ${t.id}`, t.name, t.text);
  for (const q of QUESTS) add(`quest ${q.id}`, q.title, q.entries.map((e) => e.text), q.goals.map((g) => g.text));
  for (const a of AREAS) add(`${a.id} climate`, a.climate.fogText, a.climate.thunderText);
  for (const a of ATLAS.areas) add(`atlas ${a.id}`, a.name, a.note);
  for (const z of ATLAS.zones) add(`atlas ${z.id}`, z.name);
  for (const p of ATLAS.places) add(`atlas ${p.id}`, p.name, p.note);
  for (const s of ATLAS.sites) add(`atlas site`, s.name);
  for (const l of ATLAS.links) add(`atlas ${l.from}-${l.to}`, l.note);
  return out;
}

/** Characters the pixel font has no glyph for; the font draws upper case only. */
export const missingGlyphs = (text: string): string[] => [...new Set(text.toUpperCase())].filter((ch) => !FONT_CHARS.includes(ch));

/**
 * American spellings the game's texts never use (it spells colour, armour, grey). A list, not a
 * rule: '-ize' alone would catch size, prize and seize. Only texts are read, so the item slot
 * 'armor', a saved key, is not.
 */
export const AMERICAN = [
  'color', 'colors', 'colored', 'armor', 'armored', 'armory', 'gray', 'grays', 'center', 'centers', 'honor', 'honors', 'honored',
  'favor', 'favors', 'favored', 'defense', 'defenses', 'offense', 'traveler', 'travelers', 'traveled', 'jewelry', 'theater',
  'somber', 'valor', 'rumor', 'rumors', 'harbor', 'harbors', 'neighbor', 'neighbors', 'labor', 'vapor', 'vapors', 'odor', 'odors',
  'plow', 'plowed', 'mold', 'moldy', 'ax', 'realize', 'realized', 'recognize', 'recognized', 'organize', 'organized',
  'apologize', 'civilization', 'fiber', 'meter', 'meters', 'liter', 'sulfur', 'molt', 'smolder', 'smoldering',
  'splendor', 'clamor', 'rancor', 'ardor', 'savior', 'glamor', 'endeavor', 'fervor', 'tumor', 'luster', 'saber', 'caliber',
  'specter', 'specters', 'sepulcher', 'sepulchers', 'paralyze', 'paralyzed', 'paralyzes', 'paralyzing', 'favorite', 'favorites',
  'behavior', 'behaviors', 'humor', 'humors', 'vigor', 'meager', 'grayish', 'grayer', 'grayest', 'colorful',
];
const AMERICAN_RE = new RegExp(`\\b(${AMERICAN.join('|')})\\b`, 'gi');
export const americanisms = (text: string): string[] => [...new Set(text.match(AMERICAN_RE) ?? [])];

/** Each monster family, the module in src/ui/monsters/ that draws it, and the kinds it draws. */
export async function families(): Promise<Map<string, readonly string[]>> {
  const dir = new URL('../../src/ui/monsters/', import.meta.url), out = new Map<string, readonly string[]>();
  for (const f of readdirSync(dir).filter((f) => f.endsWith('.ts')).sort()) {
    const kinds = ((await import(new URL(f, dir).href)) as { KINDS?: readonly string[] }).KINDS;
    if (kinds) out.set(f.slice(0, -3), kinds);
  }
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
    for (const f of def.features ?? []) out.mechanics.add(`feature:${f.kind}`);
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

/**
 * What is wrong with the areas' claims, in road order: a family with no module, a claim the area
 * does not use or an area earlier on the road already did, or an area after the first that claims
 * nothing new at all.
 */
export function noveltyFaults(areas: readonly Pick<Area, 'id' | 'maps' | 'atlas' | 'novel'>[], family: Map<string, readonly string[]>): string[] {
  const out: string[] = [], before: Uses = { families: new Set(), terrain: new Set(), mechanics: new Set(), landmarks: new Set() };
  areas.forEach((area, i) => {
    const here = uses(area, family);
    const kinds = Object.keys(before) as (keyof Novelty)[];
    for (const k of kinds) for (const thing of area.novel[k]) {
      if (k === 'families' && !family.has(thing)) out.push(`${area.id}: the family '${thing}' has no module in src/ui/monsters/`);
      else if (!here[k].has(thing)) out.push(`${area.id}: claims ${k} '${thing}', which it does not use`);
      else if (before[k].has(thing)) out.push(`${area.id}: claims ${k} '${thing}', which is on the road before it`);
    }
    if (i > 0 && kinds.every((k) => !area.novel[k].length)) out.push(`${area.id}: claims nothing new`);
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
  const laid = atlas.zones.flatMap((z) => {
    const def = defs.find((d) => d.id === z.map);
    return def && z.at ? [{ def, x: z.at[0], y: z.at[1], w: Math.max(...def.rows.map((r) => r.length)), h: def.rows.length }] : [];
  });
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
 * The squares where map and atlas disagree today, by whose fix they wait on: each is reported, and
 * fails once it agrees, so it is dropped here. Shelf 0,28 is where #47 opens the Salt Road.
 */
const EDGES_OWED: Record<string, readonly string[]> = {
  '#47': ['shelf 0,28'],
};

/** A flag that closes something, found in the maps: an exit, a hand-in, or anything else that names one. */
export interface FoundLock { kind: 'exit' | 'hand-in' | 'other'; flags: string[]; map: string; x: number; y: number; area: string; to?: string; key: string }

/**
 * Every `needFlag` in the maps, wherever it sits, so a door or a service given one later is found
 * without this check being told. An exit's lock stands between areas when it leads into another's
 * map.
 */
export function findLocks(areas: readonly Pick<Area, 'id' | 'maps'>[]): FoundLock[] {
  const areaOf = new Map(areas.flatMap((a) => a.maps.map((d) => [d.id, a.id] as const)));
  const out: FoundLock[] = [];
  for (const a of areas) for (const def of a.maps) {
    const walk = (v: unknown, path: string[], at: { x: number; y: number } | undefined): void => {
      if (Array.isArray(v)) { v.forEach((x, i) => walk(x, [...path, String(i)], at)); return; }
      if (!v || typeof v !== 'object') return;
      const o = v as Record<string, unknown>;
      const here = typeof o.x === 'number' && typeof o.y === 'number' ? { x: o.x, y: o.y } : at;
      if (o.needFlag !== undefined) {
        const kind = path[0] === 'exits' ? 'exit' : path.at(-1) === 'quest' ? 'hand-in' : 'other';
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
      for (const [k, x] of Object.entries(o)) if (k !== 'needFlag') walk(x, [...path, k], here);
    };
    walk(def, [], undefined);
  }
  return out;
}

/**
 * What is wrong with the locks: one found that is not signed in, one between areas, a hand-in that
 * withholds its item on a flag, signed in or not (the game takes it only once the flag is set,
 * game.ts's interact; EXPANSION §2.3 has every hand-in take it at the first meeting),
 * a signed-in row that names nothing, and more than the counts allow. `owing` are keys reported
 * elsewhere, as someone's to fix. If #43 keeps `needFlag` on a hand-in with new meaning rather than
 * removing it, the hand-in rule here gives way to #43's pure function.
 */
export function lockFaults(found: readonly FoundLock[], locks: readonly StoryLock[], areaOf: (map: string) => string | undefined, owing: readonly string[] = []): { area?: string; text: string }[] {
  const out: { area?: string; text: string }[] = [];
  const signed = (f: FoundLock): boolean => locks.some((l) => l.map === f.map && l.x === f.x && l.y === f.y && f.flags.includes(l.flag));
  for (const f of found) {
    if (owing.includes(f.key)) continue;
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

/** What #43 fixes, reported as its own until it lands: the three hand-ins. */
const LOCKS_OWED: Record<string, readonly string[]> = {
  '#43': ['hand-in harrow 9,5', 'hand-in shelf 29,8', 'hand-in thornhold 9,5'],
};

export async function pillars(): Promise<void> {
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
    ok(hintFaults(room([{ x: 3, y: 1, hint: 'near' }, { x: 2, y: 1, hint: 'near' }])).length === 1, 'a hint on a square with no secret door fails');
  }

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
    const long = 'The corridor runs on into the dark, and every step of it is carved with hands, palm out, hundreds of them, then thousands; some are small as a child\'s, and some are bigger than any hand that ever lived. Nobody has swept here.';
    const at = (features: MapDef['features']): MapDef => ({ id: 'fixture_text', name: 'Text fixture', kind: 'dungeon', start: { x: 1, y: 1, facing: NORTH }, rows: ['###', '#.#', '###'], features });
    ok(lineFaults(at([{ kind: 'event', x: 1, y: 1, id: 'e', text: long }])).length > 0, `an event of four lines fails (${logLines(long).length} lines)`);
    // Three lines by its words and four with the prefix: the prefix is counted.
    let sign = long.slice(0, 120);
    while (logLines(sign).length < 3 || logLines(signLine(sign)).length < 4) sign += ' more';
    ok(logLines(sign).length === 3 && lineFaults(at([{ kind: 'sign', x: 1, y: 1, text: sign }])).length > 0, 'a sign of three lines by its words and four as the log shows it fails');
    const two = 'A cold draught at your ankles, from the foot of the south wall. The mortar there is newer.';
    ok(logLines(two).length === 2 && lineFaults(at([{ kind: 'event', x: 1, y: 1, id: 'a', text: two }, { kind: 'event', x: 1, y: 1, id: 'b', text: two + ' ' + two }])).length === 1, 'two texts on one square that fill more than the log together fail');
  }

  // Every glyph is in the font, and the spelling is British, in every text.
  const all = texts();
  const unglyphed = all.flatMap((t) => missingGlyphs(t.text).map((ch) => `'${ch}' in ${t.where}`));
  ok(!unglyphed.length, `every character of the ${all.length} texts has a glyph in the pixel font${unglyphed.length ? ' -> ' + unglyphed.join(', ') : ''}`);
  const american = all.flatMap((t) => americanisms(t.text).map((w) => `'${w}' in ${t.where}`));
  ok(!american.length, `the ${all.length} texts spell as the game does, not American${american.length ? ' -> ' + american.join(', ') : ''}`);
  ok(missingGlyphs('Ashcombe—the café’s door').length === 3, 'a dash, an accent and a curled quote have no glyph, and fail');
  ok(americanisms('The gray walls lose their Color.').length === 2 && !americanisms('Armour of every size, a prize to seize.').length, 'gray and color fail; armour, size, prize and seize do not');

  // Novelty: each area's claim of what is new in it exists, is used in it and is nowhere earlier on the road.
  const family = await families();
  ok(family.size > 0, `the monster families: ${[...family.keys()].join(', ')}`);
  const faults = noveltyFaults(AREAS, family);
  for (const area of AREAS) {
    const mine = faults.filter((f) => f.startsWith(area.id + ':'));
    const claim = (Object.entries(area.novel) as [string, readonly string[]][]).filter(([, v]) => v.length).map(([k, v]) => `${k} ${v.join(', ')}`).join('; ');
    ok(!mine.length, `${area.id}: what it claims is new holds${claim ? ` (${claim})` : ' (nothing, as the first on the road)'}${mine.length ? ' -> ' + mine.join('; ') : ''}`);
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
  }

  // The land agrees with the map: water and roads carry on across a zone map's edge.
  const edges = edgeFaults(ATLAS, MAP_DEFS);
  for (const area of AREAS) for (const def of area.maps.filter((d) => d.kind === 'outdoor')) {
    const mine = edges.filter((e) => e.map === def.id);
    const known = Object.entries(EDGES_OWED).flatMap(([whose, keys]) => keys.filter((k) => k.startsWith(def.id + ' ')).map((k) => ({ whose, at: k.slice(def.id.length + 1) })));
    const fresh = mine.filter((e) => !known.some((k) => k.at === `${e.x},${e.y}`));
    ok(!fresh.length, `${area.id}/${def.id}: its water and roads carry on into the atlas beyond its edge${known.length ? `, but for ${known.length} square(s) owed` : ''}${fresh.length ? ' -> ' + fresh.map((e) => `${e.x},${e.y} ${e.why}`).join('; ') : ''}`);
    for (const { whose, at } of known) {
      const e = mine.find((f) => `${f.x},${f.y}` === at);
      owed(!e, `${def.id} ${at}: map and atlas agree at the edge${e ? ` (today ${e.why})` : ''}`, whose);
    }
  }
  {
    // A fixture zone laid on open atlas grass, as tools/tests/atlas.ts lays one. 168,30 is the corner
    // of F2, planned; #47, which builds it, moves the fixture to land no zone map covers.
    const lay = (rows: string[]): EdgeFault[] => {
      const fixture: MapDef = { id: 'fixture_edge', name: 'Edge fixture', kind: 'outdoor', start: { x: 2, y: 2, facing: NORTH }, rows };
      const zone = { id: 'fixture_edge', name: 'Edge fixture', area: ATLAS.zones[0].area, map: 'fixture_edge', at: [168, 30] as const };
      return edgeFaults({ ...ATLAS, zones: [...ATLAS.zones, zone] }, [...MAP_DEFS, fixture]).filter((e) => e.map === 'fixture_edge');
    };
    ok(!lay(['MMMMMM', 'M,,,,M', 'M,,,,M', 'M,,,,M', 'MMMMMM']).length, 'a fixture zone of grass on atlas grass agrees at its edges');
    ok(lay(['MMMMMM', 'M,,,,M', 'M====M', 'M,,,,M', 'MMMMMM']).length === 2, 'a road that runs into its ring against atlas land fails, at both ends');
    ok(lay(['MMMMMM', 'M,,,,M', 'MW,,,M', 'M,,,,M', 'MMMMMM']).length === 1, 'and so does sea at its edge');
    ok(lay(['MMMMMM', 'M,,,,M', '=,,,,M', 'M,,,,M', 'MMMMMM']).length === 1, 'and a road through a gap in the ring');
    // Land against open water along an edge: a shore, not water cut short. Laid in Thornmark's place,
    // its east edge faces Thornmere at 264,44-46; the premise is checked first.
    const coast = (rows: string[]): EdgeFault[] => {
      const fixture: MapDef = { id: 'fixture_coast', name: 'Coast fixture', kind: 'outdoor', start: { x: 2, y: 2, facing: NORTH }, rows };
      const w = rows[0].length, zone = { id: 'fixture_coast', name: 'Coast fixture', area: 'thornmark', map: 'fixture_coast', at: [264 - w, 43] as const };
      const others = ATLAS.zones.filter((z) => z.id !== 'thornmark');
      return edgeFaults({ ...ATLAS, zones: [...others, zone] }, [...MAP_DEFS.filter((d) => d.id !== 'thornmark'), fixture]).filter((e) => e.map === 'fixture_coast' && e.x === w - 1);
    };
    const shore = worldGrid(ATLAS, MAP_DEFS), open = [44, 45, 46].every((y) => {
      const i = y * shore.width + 264;
      return isWater(shore.t(264, y)) && !shore.river[i] && !shore.road[i] && !shore.built[i];
    });
    ok(open, 'the atlas at 264,44-46 is open water, no river, road or zone map');
    ok(open && !coast(['MMMMMM', 'M,,,,M', 'M,,,,M', 'M,,,,M', 'MMMMMM']).length, 'map land against open atlas water along an edge passes, a shore');
    // A ford: the atlas's road crosses a river beyond the edge, and only a road on the map meets it.
    const ford = { t: TI.shallow, road: true, river: true };
    ok(edgeAgrees('road', ford) === true && ['shallow', 'sea', 'grass'].every((m) => edgeAgrees(m, ford) === false), 'at a ford beyond the edge a road passes, and shallows, sea and grass fail');
    ok(edgeAgrees('grass', { t: TI.shallow, road: false, river: true }) === false && edgeAgrees('shallow', { t: TI.shallow, road: false, river: true }) === true, 'a river beyond the edge wants water on the map');
  }

  // Story locks: every one signed in, within the counts, none between areas; every hand-in takes
  // its item at the first meeting.
  const found = findLocks(AREAS);
  const areaOf = (map: string): string | undefined => AREAS.find((a) => a.maps.some((d) => d.id === map))?.id;
  const owing = Object.values(LOCKS_OWED).flat();
  const lockBad = lockFaults(found, LOCKS, areaOf, owing);
  for (const area of AREAS) {
    const mine = lockBad.filter((f) => f.area === area.id).map((f) => f.text);
    ok(!mine.length, `${area.id}: every flag that closes something is signed in, and no hand-in withholds its item${mine.length ? ' -> ' + mine.join('; ') : ''}`);
  }
  const road = lockBad.filter((f) => !f.area || !AREAS.some((a) => a.id === f.area)).map((f) => f.text);
  ok(!road.length, `the road's ${LOCKS.length} story lock(s) keep to ${MOST_AN_AREA} an area and ${MOST_ON_THE_ROAD} in all${road.length ? ' -> ' + road.join('; ') : ''}`);
  for (const [whose, keys] of Object.entries(LOCKS_OWED)) for (const key of keys) {
    const f = found.find((l) => l.key === key);
    owed(!f, key.startsWith('hand-in') ? `${key}: takes its item at the first meeting${f ? ` (today not before ${f.flags.join(', ')})` : ''}` : `${key}: no lock between areas${f ? ` (today ${f.flags.join(' and ')})` : ''}`, whose);
  }
  const opens = ATLAS.links.filter((l) => l.opens !== undefined);
  ok(!opens.length, `no way on the atlas opens on the story${opens.length ? ' -> ' + opens.map((l) => `${l.from}-${l.to} after step ${l.opens}`).join(', ') : ''}`);
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
    const door = room([], [{ kind: 'npc', x: 2, y: 1, name: 'Fixture', lines: ['Hm.'], quest: { item: 'rations', needFlag: 'q_hired', reward: 1, done: ['Ta.'], setFlag: 'q_fx', after: ['Ta.'] } }]);
    ok(within(door)[0]?.kind === 'hand-in' && lockFaults(within(door), [], of).length === 1, 'a hand-in that withholds its item on a flag fails');
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
  }
}
