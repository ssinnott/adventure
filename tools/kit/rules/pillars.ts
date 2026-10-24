// The pillars' text rules the suites share (#984): a map's lines and hints, the glyphs the font
// lacks and the American spellings. The pillars suite holds every map to them; the dens, rifts and
// wilds suites take them from here.
import { AREAS, MAP_DEFS, ITEMS, MONSTERS, SPELLS, QUESTS, ATLAS, GUILD_QUESTS } from '../../../src/content/index.ts';
import { GUILDS } from '../../../src/content/guilds.ts';
import { CROSSINGS } from '../../../src/content/crossings.ts';
import type { Crossing } from '../../../src/content/crossings.ts';
import { GameMap } from '../../../src/game/map.ts';
import type { MapDef, Presence } from '../../../src/game/mapdef.ts';
import { CLASSES, RACES, TRAITS, NAME_MAX } from '../../../src/game/party.ts';
import { enclaveLine } from '../../../src/game/world.ts';
import { signTexts } from '../../../src/game/inscriptions.ts';
import { FONT_CHARS } from '../../../src/lib/engine/text.ts';
import { logLines, LOG_LINES } from '../../../src/ui/frame.ts';
import { lookLine } from '../../../src/game/wilds.ts';
import { handIns, choices, answerNote } from '../../../src/game/people.ts';
import { hoardLine } from '../../../src/game/dens.ts';
import { ENDINGS } from '../../../src/content/endings.ts';

/**
 * What is wrong with a map's secret doors and their hints: a secret door with no hint declared, a
 * hint on a square with no secret door, a hint that names nothing on the map, or one that cannot be
 * reached from the start with that door shut. The flood is the strictest: no keys, no swimming or
 * climbing; the other secret doors are walkable, as the party finds doors by walking into walls. A
 * hint is an event or a sign, and an inscription's reading counts (game/inscriptions.ts, #538).
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
    // A hint is there for as long as the door is: never by night alone, nor once or until a flag.
    if (hint.kind === 'event' && (hint.when || hint.after || hint.until)) out.push(`'${s.hint}' at ${hint.x},${hint.y} is not always there`);
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

/** The longest name a member can have, in the font's widest letter: who reads an inscription, as the line check hears it. */
export const LONGEST_NAME = 'M'.repeat(NAME_MAX);

/**
 * Whether two texts on a square are never shown together: one by day and the other by night, or
 * one until what the other waits for (`until` X against `after` X).
 */
function apart(a: Partial<Presence>, b: Partial<Presence>): boolean {
  const hours = (p: Partial<Presence>): string | undefined => { const h = [p.when ?? []].flat(); return h.length === 1 && !h[0].sky && !h[0].season ? h[0].hours : undefined; };
  const ha = hours(a), hb = hours(b);
  const same = (x: unknown, y: unknown): boolean => x !== undefined && JSON.stringify(x) === JSON.stringify(y);
  return (!!ha && !!hb && ha !== hb) || same(a.until, b.after) || same(b.until, a.after);
}

/**
 * What is wrong with a map's events and signs as the log shows them: one that wraps past
 * MOST_LINES, or a square whose texts that can show together are more than the log shows at once,
 * so the first is pushed off it. An inscription is said as a reader with the longest name hears it
 * the first time, its words, its reading and its mark each an entry (`signTexts`).
 */
export function lineFaults(def: MapDef): string[] {
  const out: string[] = [], squares = new Map<string, { n: number; p: Partial<Presence> }[]>();
  // A group's answer is said in the log as one entry, before the fight or the walk past (#544).
  for (const e of def.encounters ?? []) for (const a of e.choice?.answers ?? []) {
    const n = logLines([...a.says, ...answerNote(a)].join(' ')).length;
    if (n > MOST_LINES) out.push(`${e.id}'s answer '${a.label}' takes ${n} lines`);
  }
  // An enclave's door line (#845), at its longest: its band and the warning, as one entry.
  const door = def.band ? enclaveLine(def, def.band[0] - 3) : undefined, lines = door ? logLines(door).length : 0;
  if (lines > MOST_LINES) out.push(`its door's line takes ${lines} lines`);
  for (const f of def.features ?? []) {
    // A wilderness feature's lines are said on Space, one event at a time, each held to the most.
    if (f.kind === 'shrine' || f.kind === 'fountain' || f.kind === 'cairn' || f.kind === 'statue' || f.kind === 'camp') {
      // A statue's and a camp's text is logged inside the look (game/wilds.ts), so it is measured so.
      const text = f.kind === 'statue' || f.kind === 'camp' ? lookLine(f) : f.text;
      for (const [what, t] of [['text', text], ['done', 'done' in f ? f.done : undefined]] as const) {
        const n = t === undefined ? 0 : logLines(t).length;
        if (n > MOST_LINES) out.push(`the ${f.kind}'s ${what} at ${f.x},${f.y} takes ${n} lines`);
      }
      // A camp's night is said on waking as one entry, as a group's answer is (game/wilds.ts `restAndWake`, #730).
      if (f.kind === 'camp') for (const night of f.nights ?? []) {
        const k = logLines((night.says ?? []).join(' ')).length;
        if (k > MOST_LINES) out.push(`the camp's night ${night.sets} at ${f.x},${f.y} takes ${k} lines`);
      }
      continue;
    }
    // A den's look is said as a monster's is, held to its lines; its burning and its hoard together, and its ruin, to the most.
    if (f.kind === 'den') {
      const look = logLines(f.text).length, burning = logLines(f.burnt).length + (hoardLine(f) ? logLines(hoardLine(f)).length : 0), ruin = f.ruin ? logLines(f.ruin).length : 0;
      if (look > LOOK_LINES) out.push(`the den's look at ${f.x},${f.y} takes ${look} lines`);
      if (burning > MOST_LINES) out.push(`the den's burning at ${f.x},${f.y} takes ${burning} lines with its hoard`);
      if (ruin > MOST_LINES) out.push(`the den's ruin at ${f.x},${f.y} takes ${ruin} lines`);
      continue;
    }
    if (f.kind !== 'event' && f.kind !== 'sign') continue;
    const at = `${f.x},${f.y}`;
    for (const [i, t] of (f.kind === 'sign' ? signTexts(f, LONGEST_NAME) : [f.text]).entries()) {
      const n = logLines(t).length;
      if (n > MOST_LINES) out.push(`the ${f.kind}${i ? `'s ${i === 1 ? 'reading' : 'mark'}` : ''} at ${at} takes ${n} lines`);
      squares.set(at, [...(squares.get(at) ?? []), { n, p: f.kind === 'event' ? f : {} }]);
    }
  }
  for (const [at, texts] of squares) {
    // The most lines the texts that can be said together take: every set of them no two of which are apart.
    let most = 0;
    for (let mask = 1; mask < 1 << texts.length; mask++) {
      const set = texts.filter((_, i) => mask & (1 << i));
      if (set.every((a, i) => set.every((b, j) => i === j || !apart(a.p, b.p)))) most = Math.max(most, set.reduce((t, x) => t + x.n, 0));
    }
    if (most > LOG_LINES) out.push(`the texts at ${at} take ${most} lines together, more than the log's ${LOG_LINES}`);
  }
  return out;
}

/** The most lines of the log a monster's look may take: it is said with the step that sees it. */
export const LOOK_LINES = 2;

/**
 * Every text the company reads, by where it is: names, lines, events, notes. Ids, rows, legends and
 * palettes are not text. A crossing's words are three: where it goes as the menu names it, the line
 * said as it lands and the seller's warning (game/passage.ts), on a person who sells it and on each
 * end of the crossings between towns, which are held whether or not a town sells them yet.
 */
export function texts(defs: readonly MapDef[] = MAP_DEFS, crossings: readonly Crossing[] = CROSSINGS): { where: string; text: string }[] {
  const out: { where: string; text: string }[] = [];
  const add = (where: string, ...t: (string | readonly string[] | undefined)[]): void => { for (const x of t.flat()) if (x !== undefined) out.push({ where, text: x }); };
  for (const d of defs) {
    add(d.id, d.name);
    for (const f of d.features ?? []) {
      const where = `${d.id} ${f.kind} ${f.x},${f.y}`;
      if ('text' in f) add(where, f.text);
      if (f.kind === 'sign') add(where, f.read);
      if ('name' in f) add(where, f.name);
      if (f.kind === 'shrine' || f.kind === 'fountain' || f.kind === 'statue') add(where, f.done);
      if (f.kind === 'statue') add(where, f.riddle, f.answer);
      if (f.kind === 'den') add(where, f.ask, f.burn, f.leave, f.burnt, f.ruin);
      if (f.kind === 'camp') for (const n of f.nights ?? []) add(`${where} night ${n.sets}`, n.says);
      if (f.kind === 'npc') {
        add(where, f.lines, ...handIns(f).flatMap((q) => [q.early, q.done, q.after]), ...(f.says ?? []).map((w) => w.lines));
        for (const c of choices(f)) add(where, c.ask, ...c.answers.flatMap((a) => [a.label, a.says]));
        for (const p of f.passage ?? []) add(`${where} passage to ${p.to}`, p.name, p.label, p.warning);
      }
    }
    for (const e of d.exits ?? []) add(`${d.id} exit ${e.x},${e.y}`, e.label, e.blockedText);
    if (d.band) add(`${d.id} door`, enclaveLine(d, d.band[0] - 1), enclaveLine(d, d.band[0] - 3));
    for (const e of d.encounters ?? []) add(`${d.id} ${e.id}`, e.slainText);
  }
  for (const c of crossings) for (const e of c.ends) add(`crossing ${c.name} at ${e.at}`, e.name, e.label, e.warning);
  for (const i of Object.values(ITEMS)) add(`item ${i.id}`, i.name);
  for (const i of Object.values(ITEMS)) add(`item ${i.id}`, i.text);
  for (const m of Object.values(MONSTERS)) add(`monster ${m.id}`, m.name, m.plural, m.look);
  for (const sp of Object.values(SPELLS)) add(`spell ${sp.id}`, sp.name, sp.text);
  for (const c of Object.values(CLASSES)) add(`class ${c.id}`, c.name, c.blurb);
  for (const r of Object.values(RACES)) add(`race ${r.id}`, r.name, r.blurb);
  for (const t of Object.values(TRAITS)) add(`trait ${t.id}`, t.name, t.text);
  for (const q of QUESTS) {
    add(`quest ${q.id}`, q.title);
    for (const c of q.chapters ?? [q]) add(`quest ${q.id}/${c.id}`, c.title, c.entries.map((e) => e.text), c.goals.map((g) => g.text));
  }
  for (const q of GUILD_QUESTS) add(`guild quest ${q.id}`, q.offer, q.paid, q.early);
  for (const gd of Object.values(GUILDS)) add(`guild ${gd.id}`, gd.name, gd.ranks);
  for (const a of AREAS) add(`${a.id} climate`, a.climate.fogText, a.climate.thunderText);
  for (const a of ATLAS.areas) add(`atlas ${a.id}`, a.name, a.note);
  for (const z of ATLAS.zones) add(`atlas ${z.id}`, z.name);
  for (const p of ATLAS.places) add(`atlas ${p.id}`, p.name, p.note);
  for (const s of ATLAS.sites) add(`atlas site`, s.name);
  for (const l of ATLAS.links) add(`atlas ${l.from}-${l.to}`, l.note);
  for (const [id, e] of Object.entries(ENDINGS)) add(`ending ${id}`, e.title, e.pages);
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
