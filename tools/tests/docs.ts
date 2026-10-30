// The docs check (tools/kit/docs.ts, #1025): every live doc holds every rule, and the table of what is
// not ours holds no row that resolves or that no doc names. Copies made from the real docs, with a
// path made up, a name made up, a line cite added, a band changed and a lane's words changed in each
// table that carries them, are each refused by the rule that holds it, and by no other. Each lane's
// first read (#1026) is printed and held under the budget, a file read whole at its size; copies
// with each lane's own part grown past it, a heading renamed or named twice, CLAUDE.md naming a
// file more or one less or past its 60 lines, EXPANSION a byte over its most and a "Decided by"
// list in it are refused as well, and each grown only to its most passes.
import {
  BUDGET, CITES_ASKED, CLAUDE_MOST, EXPANSION_MOST, LEFT_OUT, NOT_OURS, RULES, areaOf, firstRead, listed, readDocs, readTree,
  resolves, road, spans, unneeded, type Doc, type Tree,
} from '../kit/docs.ts';
import { LANES, type Lane } from '../kit/lanes.ts';
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
  // A copy grown to plant one fault is judged without the sizes, EXPANSION's and the first reads',
  // which their own copies hold: a doc at its most stays a legal place to plant one.
  const SIZE = /^(?:expansion )?docs\/EXPANSION\.md:1 docs\/EXPANSION\.md is [\d,]+ bytes, over|^(?:budget )?CLAUDE\.md:\d+ the \w+ lane's first read is [\d,]+ bytes, over/;
  const onlyIn = (t: Tree, d: Doc, rule: string, ...want: string[]): boolean => {
    const sized = want.some((w) => w.includes('bytes, over'));
    const got = Object.keys(RULES).flatMap((r) => said(d, r, t).map((f) => `${r} ${f}`)).filter((g) => sized || !SIZE.test(g));
    return got.length === want.length && want.every((w) => got.some((g) => g.startsWith(`${rule} `) && g.includes(w)));
  };
  const only = (d: Doc, rule: string, ...want: string[]): boolean => onlyIn(tree, d, rule, ...want);
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

  // Each lane's first read, its files and what of each, at the budget or under, a file read whole
  // counted at its size. A copy with each lane's own part grown by what the lane has to spare
  // passes and one a byte longer is refused, the lane named: a section, a file's head, the largest
  // of several and a header past its first line. One with a heading FIRST_READ names renamed, or
  // named twice, is refused, the heading named. The texts a first read takes are the tree's.
  const n = (x: number): string => x.toLocaleString('en-GB');
  for (const lane of LANES) {
    const r = firstRead(lane, tree);
    const whole = r.reads.filter((x) => !x.of.length).every((x) => x.bytes === Buffer.byteLength(tree.texts.get(x.path)!));
    ok(r.bytes <= BUDGET && !r.lacks.length && whole,
      `${lane}: its first read is ${n(r.bytes)} bytes, ${n(Math.ceil(r.bytes / 4))} tokens of ${n(BUDGET / 4)}: ${listed(r)}${r.lacks.length ? '; ' + r.lacks.join('; ') : ''}${whole ? '' : '; a file read whole is not counted at its size'}`);
  }
  const claude = doc('CLAUDE.md'), design = tree.texts.get('docs/DESIGN.md')!;
  const withDesign = (from: string, to: string): Tree => {
    if (!design.includes(from)) throw new Error(`docs/DESIGN.md no longer says ${from}: the copy wants a new line to change`);
    return { ...tree, texts: new Map(tree.texts).set('docs/DESIGN.md', design.replace(from, to)) };
  };
  // Where each lane's own part grows: at the start of the line after a heading or a title (the
  // design lane's largest section's, wherever that stands), at the end of the largest state's first
  // line, or in a comment line put after a header's first.
  const state = [...tree.texts.keys()].filter((f) => /^docs\/areas\/[^/]+\.md$/.test(f))
    .reduce((a, b) => (Buffer.byteLength(tree.texts.get(b)!) > Buffer.byteLength(tree.texts.get(a)!) ? b : a));
  const written = firstRead('design', tree).largest!;
  const GROW: Readonly<Record<Lane, [string, string]>> = {
    systems: ['docs/DESIGN.md', '## 6. Combat\n'], area: [state, ''], creatures: ['docs/ROSTER.md', '# Roster\n'],
    interiors: ['src/ui/interiors/shops.ts', '//'], quality: ['tools/test.ts', '//'], design: [written.path, `## ${written.of}\n`],
  };
  const grownBy = (lane: Lane, by: number): Tree => {
    const [p, after] = GROW[lane], t = tree.texts.get(p)!, k = Math.max(0, by);
    const i = after === '//' || !after ? t.indexOf('\n') : t.indexOf(after) + after.length;
    if (after && after !== '//' && i < after.length) throw new Error(`${p} no longer says ${after}: the copy wants a new place to grow`);
    const pad = after === '//' && k >= 4 ? `\n// ${'a'.repeat(k - 4)}` : 'a'.repeat(k);
    return { ...tree, texts: new Map(tree.texts).set(p, t.slice(0, i) + pad + t.slice(i)) };
  };
  const bites = LANES.filter((lane) => {
    const room = BUDGET - firstRead(lane, tree).bytes;
    return !said(claude, 'budget', grownBy(lane, room)).length
      && onlyIn(grownBy(lane, room + 1), claude, 'budget', `the ${lane} lane's first read is ${n(BUDGET + 1)} bytes, over`);
  });
  ok(bites.length === LANES.length, `a copy with each lane's own part grown by what the lane has to spare passes, and one a byte longer is refused, the lane named (${LANES.map((l) => `${l} at ${GROW[l][0]}`).join(', ')})${bites.length < LANES.length ? `; not so for ${LANES.filter((l) => !bites.includes(l)).join(', ')}` : ''}`);
  ok(onlyIn(withDesign('### Races\n', '### The races\n'), claude, 'budget', "the systems lane's first read (FIRST_READ): `docs/DESIGN.md` has no heading `### Races`")
    && onlyIn(withDesign('## 14. ', '## 6. Combat\n\nAgain.\n\n## 14. '), claude, 'budget', "the systems lane's first read (FIRST_READ): `docs/DESIGN.md` has 2 headings `## 6.`"),
    'and one with a heading FIRST_READ names renamed, or named twice, the heading named');

  // CLAUDE.md names the first reads' files and no other; EXPANSION is at its most or under, with no
  // "Decided by" list (a decision goes to docs/decisions.md).
  const tall = claude.text.split('\n').length - 1;
  const taller = (k: number): Doc => copy('CLAUDE.md', '## The voice', `${'.\n'.repeat(Math.max(0, k))}## The voice`);
  ok(only(copy('CLAUDE.md', '`docs/SYSTEMS.md`', '`docs/SYSTEMS.md` and `docs/PILOT.md`'), 'reading', "names `docs/PILOT.md`, which no lane's first read holds")
    && only(copy('CLAUDE.md', '`docs/SYSTEMS.md`', 'SYSTEMS'), 'reading', "FIRST_READ's `docs/SYSTEMS.md` (systems) is not named")
    && !said(taller(CLAUDE_MOST - tall), 'reading').length && only(taller(CLAUDE_MOST - tall + 1), 'reading', `CLAUDE.md is ${CLAUDE_MOST + 1} lines, over ${CLAUDE_MOST}`),
  `a copy of CLAUDE.md naming a file FIRST_READ lacks is refused, the file named, and one lacking a file of FIRST_READ; one at its ${CLAUDE_MOST} lines passes, one a line longer is refused`);
  const spare = EXPANSION_MOST - Buffer.byteLength(doc('docs/EXPANSION.md').text), at = 'Its decisions: decisions.md.';
  const longer = (by: number): Doc => copy('docs/EXPANSION.md', at, `${at}${'a'.repeat(Math.max(0, by))}`);
  const ruled = (s: string): Doc => copy('docs/EXPANSION.md', at, s), list = 'EXPANSION holds a "Decided by" list';
  ok(!said(longer(spare), 'expansion').length && only(longer(spare + 1), 'expansion', `docs/EXPANSION.md is ${n(EXPANSION_MOST + 1)} bytes, over ${n(EXPANSION_MOST)}`)
    && only(ruled("Decided by the builder for #1026, each the owner's to overturn:"), 'expansion', list)
    && only(ruled("Decided by the builder for #1026, each the owner's to overturn.\n\n1. A call."), 'expansion', list)
    && only(ruled("Decided by the builder for #1026, each the owner's to overturn.\n1. A call."), 'expansion', list)
    && !said(ruled("Decided by the owner's delegate (#1026): kept as built."), 'expansion').filter((f) => !SIZE.test(f)).length,
  `a copy of EXPANSION.md grown by its ${n(spare)} bytes to spare passes, one a byte longer is refused, and one with a "Decided by" list, its first line ending on a colon or a list after it; one ruling in a sentence passes`);

  // The table only shrinks: a row whose word comes to resolve goes, and so does one no doc names.
  const built: Tree = { ...tree, files: new Set([...tree.files, 'dist/index.js']), folders: new Set([...tree.folders, 'dist']) };
  const stale = unneeded([...NOT_OURS, { word: 'nowhere/made.ts', why: 'a row made up' }], live, built);
  ok(stale.join('; ') === 'dist/: it resolves now, so its row goes; nowhere/made.ts: no live doc names it, so its row goes',
    `a row that resolves is refused, and one no live doc names (${stale.join('; ')})`);
}
