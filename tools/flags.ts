// One-off for #995, not kept: lists each flag the shipped record holds with the area that records it,
// the file and line it is first set at and the nearest comment, and writes the declarations from the
// record: each area's in src/content/areas/<area>/flags.ts and the core's in src/content/flags.ts,
// each flag glossed from a table written by hand. Run again, it finds no flag undeclared.
//   node tools/flags.ts                 list every flag, then what is undeclared, or declared and unrecorded
//   node tools/flags.ts --write <tsv>   write the declarations that differ, each gloss from <tsv> (flag TAB gloss)
import { existsSync, readFileSync, readdirSync, writeFileSync } from 'node:fs';
import { join, relative } from 'node:path';

const ROOT = new URL('..', import.meta.url).pathname;
const AREAS_DIR = join(ROOT, 'src/content/areas');
const CORE = 'core';
const read = (f: string): string => readFileSync(f, 'utf8');
const areas = readdirSync(AREAS_DIR).filter((a) => existsSync(join(AREAS_DIR, a, 'shipped.json'))).sort();

/** Each flag the record holds, with the files that record it: an area's, or the central file's as `core`. */
const record = new Map<string, string[]>();
const recorded = (whose: string, file: string): void => {
  for (const f of JSON.parse(read(file)).flags ?? []) record.set(f, [...(record.get(f) ?? []), whose]);
};
for (const a of areas) recorded(a, join(AREAS_DIR, a, 'shipped.json'));
recorded(CORE, join(ROOT, 'src/content/shipped.json'));

const files = (dir: string): string[] => readdirSync(dir, { withFileTypes: true }).flatMap((e) =>
  e.isDirectory() ? files(join(dir, e.name)) : e.name.endsWith('.ts') && !['walkthrough.ts', 'checks.ts', 'flags.ts'].includes(e.name) ? [join(dir, e.name)] : []).sort();
const quoted = (s: string): RegExp => new RegExp(`(['"\`])${s.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\1`);

/** A line that sets what it names, by the fields that set a flag. */
const SETS = /\b(sets|setFlag|nights)\b|kind: 'npc'/;
interface Found { file: string; line: number; text: string; comment: string }

/** Where a flag is first set in the files given: a line that sets it, else a constant, else the first that names it. */
function firstSet(flag: string, among: readonly string[], also: readonly RegExp[] = []): Found | undefined {
  const pats = [quoted(flag), ...also];
  let best: { rank: number; at: Found } | undefined;
  for (const file of among) {
    const lines = read(file).split('\n');
    lines.forEach((l, i) => {
      if (!pats.some((p) => p.test(l))) return;
      const rank = SETS.test(l) ? 0 : /\bconst\b/.test(l) ? 1 : 2;
      if (best && best.rank <= rank) return;
      let comment = '';
      for (let j = i - 1; j >= Math.max(0, i - 30) && !comment; j--) {
        const t = lines[j].trim();
        if (t.startsWith('//') || t.startsWith('/**') || t.startsWith('* ')) comment = t;
      }
      // A constant of public.ts says the file it stood in (#992): the flag is that file's.
      const from = file.endsWith('public.ts') ? lines.slice(0, i).reverse().find((t) => /^\/\/ From \S+\.$/.test(t)) : undefined;
      const owner = from ? join(file, '..', from.slice('// From '.length, -1)) : file;
      best = { rank, at: { file: relative(ROOT, owner), line: i + 1, text: l.trim(), comment } };
    });
  }
  return best?.at;
}

/** The owner of a flag two areas record: the one whose public.ts declares it, as #995 gives `q_road_west` to Ashfall. */
function ownerOf(flag: string, whose: readonly string[]): string {
  if (whose.length === 1) return whose[0];
  const by = whose.filter((a) => a !== CORE && quoted(flag).test(read(join(AREAS_DIR, a, 'public.ts'))));
  if (by.length !== 1) throw new Error(`${flag} is recorded by ${whose.join(' and ')} and declared in the public.ts of ${by.length}`);
  return by[0];
}

const owned = new Map<string, Array<{ flag: string; at: Found | undefined; also: string[] }>>();
for (const [flag, whose] of [...record].sort(([a], [b]) => a.localeCompare(b))) {
  const owner = ownerOf(flag, whose);
  let at: Found | undefined;
  if (owner === CORE) {
    at = firstSet(flag, [join(ROOT, 'src/game/keys.ts'), join(ROOT, 'src/game/services.ts')], [new RegExp(`\\.${flag}\\b`)])
      ?? firstSet(flag.replace(/^rank_/, ''), [join(ROOT, 'src/content/guilds.ts')], [new RegExp(`\\b${flag.replace(/^rank_/, '')}: \\{`)]);
  } else {
    const among = files(join(AREAS_DIR, owner)), content = files(join(ROOT, 'src/content'));
    // A guild quest's taken and done flags are made from its id, a hall's fee from its name (src/game/keys.ts).
    const stem = flag.replace(/^q_/, '').replace(/_done$/, ''), hall = flag.replace(/^guild_/, '');
    at = firstSet(flag, among)
      ?? firstSet(stem, among.filter((f) => f.endsWith('guilds.ts')), [new RegExp(`id: (['"])${stem}\\1`)])
      ?? firstSet(hall, among, [new RegExp(`name: (['"])${hall.replace(/[.*+?^${}()|[\]\\]/g, '\\$&').replace(/'/g, "\\\\?'")}\\1`)])
      // Set by the owner through a constant another file spells: another area's public.ts, or the endings.
      ?? firstSet(flag, content);
  }
  owned.set(owner, [...(owned.get(owner) ?? []), { flag, at, also: whose.filter((w) => w !== owner) }]);
}

/** The declaration as written: each area's flags.ts, and the core's. */
const declFile = (owner: string): string => owner === CORE ? join(ROOT, 'src/content/flags.ts') : join(AREAS_DIR, owner, 'flags.ts');
const declared = new Map<string, string[]>();
for (const owner of [...areas, CORE]) {
  if (!existsSync(declFile(owner))) continue;
  const { FLAGS } = await import(declFile(owner)) as { FLAGS: Record<string, string> };
  for (const f of Object.keys(FLAGS)) declared.set(f, [...(declared.get(f) ?? []), owner]);
}

const write = process.argv[2] === '--write';
if (!write) {
  for (const [owner, flags] of owned) for (const { flag, at, also } of flags) {
    console.log([owner, flag, at ? `${at.file.replace('src/content/areas/', '')}:${at.line}` : 'not found', at?.text.slice(0, 120) ?? '', at?.comment.slice(0, 80) ?? '', also.length ? `also recorded by ${also.join(', ')}` : ''].join('\t'));
  }
  const undeclared = [...record.keys()].filter((f) => !declared.has(f));
  const unrecorded = [...declared.keys()].filter((f) => !record.has(f));
  const twice = [...declared].filter(([, by]) => by.length > 1);
  console.log(`${record.size} flags recorded, ${declared.size} declared`);
  for (const [what, list] of [['Undeclared', undeclared], ['Declared and unrecorded', unrecorded], ['Declared twice', twice.map(([f, by]) => `${f} (${by.join(', ')})`)]] as const) {
    if (list.length) console.log(`${what}: ${list.length}\n${list.map((l) => '  ' + l).join('\n')}`);
  }
  if (!undeclared.length && !unrecorded.length && !twice.length) console.log('No flag undeclared: nothing left to move.');
} else {
  const gloss = new Map(read(process.argv[3]).split('\n').filter((l) => l.trim()).map((l) => l.split('\t') as [string, string]));
  const lit = (s: string): string => (s.includes("'") ? JSON.stringify(s) : `'${s}'`);
  const key = (s: string): string => (/^[A-Za-z_$][\w$]*$/.test(s) ? s : lit(s));
  const name = (a: string): string => /The way into (.+?) from another area/.exec(read(join(AREAS_DIR, a, 'public.ts')))?.[1] ?? a;
  const missing: string[] = [], written: string[] = [];
  for (const [owner, flags] of owned) {
    const groups = new Map<string, typeof flags>();
    for (const f of flags) {
      if (!gloss.get(f.flag)) missing.push(f.flag);
      const file = f.at ? relative(owner === CORE ? join(ROOT, 'src') : join(AREAS_DIR, owner), join(ROOT, f.at.file)) : '?';
      groups.set(file, [...(groups.get(file) ?? []), f]);
    }
    const body = [...groups].sort(([a], [b]) => a.localeCompare(b)).flatMap(([file, fs]) => [
      `  // ${file}`,
      ...fs.sort((a, b) => (a.at?.line ?? 0) - (b.at?.line ?? 0) || a.flag.localeCompare(b.flag)).map((f) => `  ${key(f.flag)}: ${lit(gloss.get(f.flag) ?? '')},`),
    ]);
    const head = owner === CORE
      ? ['// The flags no area owns, which the code sets (src/game/keys.ts), each with what holding it means (#995):',
        '// declared once for the whole, as the core items are. `Flag` is made of every declaration (./index.ts).']
      : [`// The flags ${name(owner)} sets, each with what holding it means (#995), under the file that first sets it:`,
        '// its own, which public.ts gives on. `Flag` is made of every declaration (src/content/index.ts), and a',
        '// flag two declare is refused; the shipped suite holds them to the record (shipped.json).'];
    const text = [...head, 'export const FLAGS = {', ...body, '};', ''].join('\n');
    if (existsSync(declFile(owner)) && read(declFile(owner)) === text) continue;
    writeFileSync(declFile(owner), text);
    written.push(relative(ROOT, declFile(owner)));
  }
  if (missing.length) console.log(`No gloss: ${missing.length}\n${missing.map((m) => '  ' + m).join('\n')}`);
  console.log(written.length ? `Written:\n${written.map((w) => '  ' + w).join('\n')}` : 'Nothing left to move.');
}
