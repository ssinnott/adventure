// The code map (tools/kit/codemap.ts, #1023): every file of src/ (not src/lib/), tools/ and types/
// has a header with a first paragraph, which is its row, and the committed docs/CODEMAP.md is what the
// headers make. Both fail on a copy of the tree with a header taken off and with one changed; a file
// added outside a collapsed folder is a row the map lacks, and one added to an area's folder changes
// that folder's count and writes no row.
import { COLLAPSED, MAP_FILE, header, headless, render, rows, stale, treeSources, written, type Source } from '../kit/codemap.ts';
import { ok } from './lib.ts';

export function codemap(): void {
  // The first paragraph, as the map reads it: up to the first blank comment line or the first line
  // that is no comment, the marks off, the lines joined and each run of spaces one.
  ok(header('// A first\n// line.\n//\n// Not this.\nimport x;\n') === 'A first line.'
    && header('// Usage:\n//   node tools/x.ts   does y\nconst a = 1;\n') === 'Usage: node tools/x.ts does y'
    && header('import x;\n// Late.\n') === '' && header('//\n// After a blank.\n') === '' && header('') === '',
  'a header\'s first paragraph is its comment up to a blank comment line, joined; a file that opens on code or on a blank comment has none');
  const cell = render([{ path: 'a.ts', text: 'a | b, <base> and `<area>|x`' }]).split('\n').find((l) => l.startsWith('| `a.ts`'));
  ok(cell === '| `a.ts` | a \\| b, \\<base> and `<area>\\|x` |', `a row's text is a table's cell: a pipe escaped, and a tag's bracket outside code (${cell})`);

  // The tree: every file has a header, and the map written is the map made.
  const tree = treeSources();
  const none = headless(tree);
  ok(tree.length > 600 && !none.length, `every one of the ${tree.length} files of src/ (not src/lib/), tools/ and types/ has a header with a first paragraph${none.length ? '; none in ' + none.join(', ') : ''}`);
  const made = render(rows(tree)), off = stale(written(), made);
  ok(!off.length, `${MAP_FILE} is what the headers make, ${rows(tree).length} rows${off.length ? '; run node tools/codemap.ts: ' + off.join('; ') : ''}`);
  ok(COLLAPSED.every((f) => made.includes(`| \`${f.row}\` | `)), `each of the ${COLLAPSED.length} collapsed folders is one row with its count (${COLLAPSED.map((f) => f.row).join(', ')})`);

  // A copy of the tree: a header taken off, a header changed, a file added beside them and one in a box.
  const copy = (f: (s: Source) => Source, ...more: Source[]): Source[] => [...tree.map(f), ...more];
  const at = (p: string, f: (t: string) => string) => (s: Source): Source => (s.path === p ? { ...s, text: f(s.text) } : s);
  const bare = copy(at('tools/kit/codemap.ts', (t) => t.replace(/^(\/\/.*\n)+/, '')));
  ok(headless(bare).join() === 'tools/kit/codemap.ts' && stale(made, render(rows(bare))).join() === 'tools/kit/codemap.ts: the row is not what its header says',
    'a copy with a header taken off fails both: the file is named as having none, and its row as stale');
  const changed = copy(at('tools/codemap.ts', (t) => t.replace('// The code map', '// The map of the code')));
  ok(!headless(changed).length && stale(made, render(rows(changed))).join() === 'tools/codemap.ts: the row is not what its header says',
    'a copy with a header changed fails the map, the row named');
  const area = tree.find((s) => s.path.startsWith('src/content/areas/'))!.path.split('/')[3];
  const added = copy((s) => s, { path: 'src/game/added.ts', text: '// A file added.\n' }, { path: `src/content/areas/${area}/maps/added.ts`, text: '// A box added.\n' });
  ok(rows(added).length === rows(tree).length + 1 && stale(made, render(rows(added))).join('; ') === 'src/content/areas/<area>/: the row is not what its header says; src/game/added.ts: no row',
    `a file added is a row the map lacks, named; one added to an area's folder (${area}'s) changes its folder's count and writes no row`);
}
