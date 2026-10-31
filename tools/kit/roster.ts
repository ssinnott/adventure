// The roster (#1024, part of #848): docs/ROSTER.md, made from the monsters' defs. The monsters by
// area in road order, as each area's monsters.ts lists them, a row to each def: its name and id, its
// family (the module of src/ui/monsters/ that registers its drawing), its kind and level, its
// numbers, its look and what it can do, in words; then the families, each with the areas its defs
// are in. It holds nothing a map decides, so a box that places a group changes no row and a pull
// request that adds a monster changes the rows of its own. The library of tools/roster.ts, the
// command line, and a file of tools/kit/, which takes src only (the layers check,
// tools/tests/layers.ts): so its suite, tools/tests/roster.ts, takes it and not the tool.
//
// A def is its row: a pull request that adds or changes a monster runs `node tools/roster.ts`, and
// the suite names the rows of a stale roster. A conflict in docs/ROSTER.md is mended by running the
// tool, never by hand. Where a monster is met, its area's doc says: no map decides a row.
import { readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { AREAS, ATLAS, SPELLS } from '../../src/content/index.ts';
import type { MonsterDef } from '../../src/game/monsters.ts';
import { FAMILY_OF } from '../../src/ui/monsters/index.ts';
import { abilities as said, and } from '../../src/game/bestiary.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** Where the roster is written, from the root. */
export const ROSTER_FILE = 'docs/ROSTER.md';

/** An area as the roster reads it: its id, its name on the atlas and its defs in its monsters.ts's order. */
export interface RosterArea { id: string; name: string; monsters: readonly MonsterDef[] }
/** What the roster is made of: the areas in road order, the family that registers each drawing's kind and the spells by id. */
export interface Defs {
  areas: readonly RosterArea[];
  family: Readonly<Record<string, string>>;
  spells: Readonly<Record<string, { name: string }>>;
}
/** A line of the roster's tables: the def's id, or `the family <name>`, and the line. */
export interface Row { key: string; line: string }

/** The tree's defs: AREAS in road order (src/content/index.ts), named as the atlas names them, and the families' registry (src/ui/monsters/index.ts). */
export function treeDefs(): Defs {
  const names = new Map<string, string>(ATLAS.areas.map((a) => [a.id, a.name]));
  return { areas: AREAS.map((a) => ({ id: a.id, name: names.get(a.id) ?? a.id, monsters: a.monsters })), family: FAMILY_OF, spells: SPELLS };
}

/**
 * What a def can do, in words, its own fields alone (its kind's are its kind's, MONSTERS §2), as
 * src/game/bestiary.ts says it for the roster and the wiki alike. '' where it does none of it.
 */
export function abilities(d: MonsterDef, defs: Defs): string {
  const byId = new Map(defs.areas.flatMap((a) => a.monsters.map((m) => [m.id, m] as const)));
  return said(d, { spells: defs.spells, monster: (id) => byId.get(id) });
}

/** A text as a table's cell: a pipe escaped, and outside code spans a `<` or a `*`, which Markdown reads as a tag or emphasis. */
const cell = (s: string): string =>
  s.split(/(`[^`]*`)/).map((part, i) => (i % 2 ? part : part.replace(/[<*]/g, '\\$&'))).join('').replaceAll('|', '\\|');
const line = (cells: readonly (string | number)[]): string => `| ${cells.join(' | ')} |`;

const HEAD = ['Monster', 'Family', 'Kind', 'Level', 'HP', 'Armour', 'To hit', 'Blow', 'Speed', 'XP', 'Gold', 'Look', 'What it does'];
const ALIGN = ['---', '---', '---', '---:', '---:', '---:', '---:', '---', '---:', '---:', '---', '---', '---'];

/** A def's row: its name and id, family, kind, level, numbers, look and what it can do. */
function defRow(d: MonsterDef, defs: Defs): Row {
  const blow = `${d.dice}d${d.sides}${d.bonus > 0 ? `+${d.bonus}` : d.bonus < 0 ? d.bonus : ''}`;
  const gold = d.gold[0] === d.gold[1] ? `${d.gold[0]}` : `${d.gold[0]}–${d.gold[1]}`;
  return {
    key: d.id,
    line: line([`${cell(d.name)} (\`${d.id}\`)`, defs.family[d.sprite] ?? 'none', d.kind, d.level, d.hp, d.ac, `+${d.attack}`, blow, d.speed, d.xp, gold,
      d.look ? `*${cell(d.look)}*` : '', cell(abilities(d, defs))]),
  };
}

/** The families in the order the road first meets them, each with its defs by area. */
function families(defs: Defs): { name: string; by: { area: string; names: string[] }[] }[] {
  const out = new Map<string, { area: string; names: string[] }[]>();
  for (const a of defs.areas) {
    for (const d of a.monsters) {
      const f = defs.family[d.sprite] ?? 'none', by = out.get(f) ?? [];
      const last = by[by.length - 1];
      if (last?.area === a.name) last.names.push(d.name); else by.push({ area: a.name, names: [d.name] });
      out.set(f, by);
    }
  }
  return [...out].map(([name, by]) => ({ name, by }));
}

/** The roster's rows, in its order: each area's defs, then each family's row. */
export function rows(defs: Defs): Row[] {
  const where = (b: { area: string; names: string[] }): string => `${b.area} (${and(b.names.map(cell))})`;
  return [
    ...defs.areas.flatMap((a) => a.monsters.map((d) => defRow(d, defs))),
    ...families(defs).map((f) => ({ key: `the family ${f.name}`, line: line([`\`${f.name}\``, where(f.by[0]), f.by.length > 1 ? f.by.slice(1).map(where).join('; ') : 'none']) })),
  ];
}

const INTRO = [
  '# Roster',
  '',
  "Made by `node tools/roster.ts` from the monsters' defs (#1024); never edited by hand. The monsters",
  'by area in road order, as each area lists them in `src/content/areas/<area>/monsters.ts`, a row to',
  'each def: its family (the module of `src/ui/monsters/` that registers its drawing), its kind and',
  'level, its numbers, its look and what it can do; then the families. It holds nothing a map decides:',
  "where a monster is met, its area's doc says. A pull request that adds or changes a monster runs the",
  'tool: the `roster` suite names the rows of a stale roster, and a conflict here is mended by running',
  'the tool. What the monsters are for, their kinds and how their numbers are made is',
  '[MONSTERS.md](MONSTERS.md).',
  '',
  "Blow is a hit's dice; gold is what each drops. What it does is the def's own: its kind's (MONSTERS",
  '§2) are not repeated.',
];

const FAMILIES = [
  '## The families',
  '',
  'A family is a module of `src/ui/monsters/` that registers the kinds it draws in its `SPRITES`;',
  'each def is a kind of its own. First met is the first area in road order with a def of the family.',
  '',
  line(['Family', 'First met', 'Then']),
  '|---|---|---|',
];

/** The roster's text: the lines above, each area with defs under its name and its table, then the families. */
export function render(defs: Defs): string {
  const rs = rows(defs), byKey = new Map(rs.map((r) => [r.key, r.line]));
  const out = [...INTRO];
  for (const a of defs.areas) {
    if (!a.monsters.length) continue;
    out.push('', `## ${a.name} (\`${a.id}\`)`, '', line(HEAD), `|${ALIGN.join('|')}|`, ...a.monsters.map((d) => byKey.get(d.id)!));
  }
  out.push('', ...FAMILIES, ...rs.filter((r) => r.key.startsWith('the family ')).map((r) => r.line), '');
  return out.join('\n');
}

/** A written roster's table rows by their key, and its other lines. */
function parse(text: string): { rows: Map<string, string>; rest: string } {
  const out = new Map<string, string>(), rest: string[] = [];
  for (const l of text.split('\n')) {
    const def = /^\| [^|]*? \(`([^`]+)`\) \|/.exec(l), family = /^\| `([^`]+)` \|/.exec(l);
    if (def) out.set(def[1], l);
    else if (family) out.set(`the family ${family[1]}`, l);
    else rest.push(l);
  }
  return { rows: out, rest: rest.join('\n') };
}

/** The keys of a written roster's rows, in its order. */
export const keysOf = (text: string): string[] => [...parse(text).rows.keys()];

/** What differs between a written roster and the one the defs make, a line to each row, by key; none where they are the same. */
export function stale(written: string, made: string): string[] {
  if (written === made) return [];
  const w = parse(written), m = parse(made), out: string[] = [];
  if (w.rest !== m.rest) out.push('the lines that are no row');
  for (const [k, l] of m.rows) {
    if (!w.rows.has(k)) out.push(`${k}: no row`);
    else if (w.rows.get(k) !== l) out.push(`${k}: the row is not what ${k.startsWith('the family ') ? 'its defs make' : 'its def makes'}`);
  }
  for (const k of w.rows.keys()) if (!m.rows.has(k)) out.push(`${k}: a row for no ${k.startsWith('the family ') ? 'family' : 'def'}`);
  return out.length ? out : ['the rows are out of their order'];
}

/** The committed roster, read from the tree. */
export const written = (root = ROOT): string => readFileSync(path.join(root, ROSTER_FILE), 'utf8');
