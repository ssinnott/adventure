// The docs check (tools/kit/docs.ts, #1025): every live doc holds every rule, and the table of what is
// not ours holds no row that resolves or that no doc names. Copies made from the real docs, with a
// path made up, a name made up, a line cite added, a band changed and a lane's words changed in each
// table that carries them, are each refused by the rule that holds it, and by no other.
import { CITES_ASKED, LEFT_OUT, NOT_OURS, RULES, areaOf, readDocs, readTree, resolves, road, spans, unneeded, type Doc, type Tree } from '../kit/docs.ts';
import { ok } from './lib.ts';

export function docs(): void {
  const tree = readTree(), live = readDocs(tree);
  const areas = live.filter((d) => d.path.startsWith('docs/areas/')).length;
  ok(live.length >= 20 && areas >= 14 && live.every((d) => !(d.path in LEFT_OUT) && !/^docs\/(archive|areas\/[^/]+)\//.test(d.path)),
    `the live docs: README.md, CLAUDE.md, ${live.length - areas - 2} of docs/ and ${areas} areas' states; not ${Object.keys(LEFT_OUT).join(', ')}, the archive or an area's decisions and plan`);

  // Each rule, on every live doc.
  const said = (d: Doc, rule: string, t: Tree = tree): string[] => RULES[rule](d, t).map((f) => `${f.doc}:${f.line} ${f.what}`);
  for (const rule of Object.keys(RULES)) {
    const faults = live.flatMap((d) => said(d, rule));
    ok(!faults.length, `${rule}: every live doc holds it${faults.length ? ': ' + faults.join('; ') : ''}`);
  }
  const words = live.flatMap((d) => spans(d.text)).length;
  ok(words > 1000, `the live docs hold ${words} code spans, read outside their fenced blocks`);
  const off = unneeded(NOT_OURS, live, tree);
  ok(!off.length, `each of the ${NOT_OURS.length} rows of what is not ours names what a live doc names, and none resolves${off.length ? ': ' + off.join('; ') : ''}`);

  // The reading: a fenced block is left out, a span may take a backtick inside a longer run, and one
  // may wrap a line; a path resolves from the root, src/ or the area's folder, a place's doc its area's.
  const read = spans('a `one` and ``two ` two``\n```\n`fenced`\n```\nthe `three\nwords` end\n').map((s) => `${s.line}:${s.word}`);
  ok(read.join('|') === '1:one|1:two ` two|5:three words', `a doc's spans, as CommonMark reads them (${read.join(', ')})`);
  ok(resolves('src/game/', tree) && resolves('game/party.ts', tree) && resolves('checks.ts', tree, 'shelf') && !resolves('checks.ts', tree)
    && resolves('src/content/areas/<area>/checks.ts', tree) && resolves('tools/tests/*.ts', tree) && !resolves('src/game/party.ts/', tree)
    && areaOf('docs/areas/dead_drop.md') === 'wrackholm' && areaOf('docs/areas/shelf/plan.md') === undefined,
  'a path resolves from the root, src/ or its area\'s folder, a placeholder or a star standing for a name, one ending in a slash only as a folder; the Dead-Drop\'s doc is Wrackholm\'s');

  // Copies of the real docs, each with one thing changed, refused by the rule that holds it alone.
  const doc = (p: string): Doc => live.find((d) => d.path === p)!;
  const copy = (p: string, from: string, to: string): Doc => {
    const d = doc(p);
    if (!d.text.includes(from)) throw new Error(`${p} no longer says ${from}: the copy wants a new line to change`);
    return { path: p, text: d.text.replace(from, to) };
  };
  const only = (d: Doc, rule: string, ...want: string[]): boolean => {
    const got = Object.keys(RULES).flatMap((r) => said(d, r).map((f) => `${r} ${f}`));
    return got.length === want.length && want.every((w) => got.some((g) => g.startsWith(`${rule} `) && g.includes(w)));
  };
  ok(only(copy('docs/DESIGN.md', '`src/content/atlas.ts`', '`src/content/atlases.ts`'), 'paths', '`src/content/atlases.ts` names no tracked file or folder')
    && only(copy('docs/DESIGN.md', '`src/content/atlas.ts`', "`import './src/content/atlases.ts'`"), 'paths', '`src/content/atlases.ts` names no tracked file or folder'),
    'a copy of DESIGN.md with a path made up is refused, the path named, quoted in a phrase as well');
  ok(only(copy('docs/DESIGN.md', '`areaBand`', '`areaBandOf`'), 'names', '`areaBandOf` is no word of src/, tools/, types/ or .github/ (areaBandOf)'),
    'a copy of DESIGN.md with a name made up is refused, the word named');
  const cited = copy('docs/EXPANSION.md', '`tools/tests/curve.ts`)', '`tools/tests/curve.ts:42`), `docs/SYSTEMS.md`:12, `:7`, `tools/smoke.ts#L5`');
  ok(only(cited, 'lines', '`tools/tests/curve.ts:42` cites a line', '`docs/SYSTEMS.md`:12 cites a line', '`:7` cites a line', '`tools/smoke.ts#L5` cites a line')
    && !said({ path: CITES_ASKED[0], text: cited.text }, 'lines').length,
  `a copy of EXPANSION.md citing a line in a span, by an anchor, after one and bare is refused at each; the same lines in ${CITES_ASKED[0]}, which asks an issue for one, are not`);
  const row = road()[2];
  ok(only(copy('docs/DESIGN.md', `| ${row.band} |`, '| 10–13 |'), 'bands', `DESIGN §4's row 3 is ${row.name} 10–13; the atlas and CURVE (src/content/progression.ts) have ${row.name} ${row.band}`),
    `a copy of DESIGN.md with a band changed is refused, the row and CURVE's band named (${row.name}, ${row.band})`);
  const [a, b] = road();
  const swapped = copy('docs/DESIGN.md', `| **${a.name}** |`, '| **SWAP** |').text.replace(`| **${b.name}** |`, `| **${a.name}** |`).replace('| **SWAP** |', `| **${b.name}** |`);
  ok(said({ path: 'docs/DESIGN.md', text: swapped }, 'bands').length === 2, 'and one with two rows swapped, at both');
  ok(only(copy('docs/ISSUES.md', 'the save format, the registries', 'the save formats, the registries'), 'lanes', 'lane: systems reads')
    && only(copy('docs/EXPANSION.md', 'the save format, the registries', 'the save formats, the registries'), 'lanes', 'lane: systems reads')
    && only(copy('docs/ISSUES.md', '| `lane: design` |', '| `lane: designs` |'), 'lanes', 'no lane of .github/labels.json', 'has no row for lane: design')
    && !said(copy('docs/EXPANSION.md', '| one per family |', '| two per family |'), 'lanes').length,
  'a copy of ISSUES.md or EXPANSION.md with a lane\'s words changed is refused, and one with a lane renamed; EXPANSION\'s "At once" column is its own');

  // The table only shrinks: a row whose word comes to resolve goes, and so does one no doc names.
  const built: Tree = { ...tree, files: new Set([...tree.files, 'dist/index.js']), folders: new Set([...tree.folders, 'dist']) };
  const stale = unneeded([...NOT_OURS, { word: 'nowhere/made.ts', why: 'a row made up' }], live, built);
  ok(stale.join('; ') === 'dist/: it resolves now, so its row goes; nowhere/made.ts: no live doc names it, so its row goes',
    `a row that resolves is refused, and one no live doc names (${stale.join('; ')})`);
}
