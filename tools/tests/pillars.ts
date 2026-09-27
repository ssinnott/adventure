// The pillars, where a machine can check them (EXPANSION §5.4): every secret door has a hint on its
// near side; no event or sign runs past three lines of the log, every glyph is in the font and the
// spelling is British; each area's claim of what is new in it holds. Each check is a function of the content it reads, so it runs over every area and over
// fixtures broken on purpose, which it must refuse.
import { readdirSync } from 'node:fs';
import { AREAS, MAP_DEFS, ITEMS, MONSTERS, SPELLS, QUESTS, ATLAS } from '../../src/content/index.ts';
import type { Area, Novelty } from '../../src/content/area.ts';
import { GameMap } from '../../src/game/map.ts';
import type { MapDef } from '../../src/game/map.ts';
import { CLASSES, RACES, TRAITS } from '../../src/game/party.ts';
import { signLine } from '../../src/game/world.ts';
import { NORTH } from '../../src/game/types.ts';
import { FONT_CHARS } from '../../src/lib/engine/text.ts';
import { logLines, LOG_LINES } from '../../src/ui/frame.ts';
import { ok } from './lib.ts';

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
        for (const flag of ['ranged', 'missile', 'mindless'] as const) if (m[flag]) out.mechanics.add(`monster:${flag}`);
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
  ok(!all.some((t) => t.text === 'armor'), 'the item slot armor, a saved key, is no text');

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
}
