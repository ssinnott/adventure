// The lanes check (tools/kit/lanes.ts, #899): the table of docs/ISSUES.md §2 as code, held to a sample of
// each of its lines, to the tree (every file in it falls in a lane, bar the vendored src/lib/), to the
// areas of AREAS and to .github/labels.json, and its report to the lines it must write.
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { AREAS } from '../../src/content/index.ts';
import { LANES, labelOf, laneOf, report, sections } from '../kit/lanes.ts';
import { ok } from './lib.ts';

/** Where the table puts a file, as `lane`, `lane: area` or `none`. */
const at = (file: string): string => { const p = laneOf(file); return p.lane === null ? 'none' : p.area ? `${p.lane}: ${p.area}` : p.lane; };

export function lanes(): void {
  const root = new URL('../../', import.meta.url);
  // A sample file under each line of the table, and under each place the lines must tell apart: the
  // shipped files (an area's, and the central one), the interiors' dispatcher and their folder, the three kits, an
  // area's doc and the files of its folder (#1011) and the rest of docs/, a place's doc and its folder named for its area.
  const cases: [string, string][] = [
    ['src/game/save.ts', 'systems'], ['src/app/pilot/index.ts', 'systems'], ['src/ui/viewport.ts', 'systems'], ['src/ui/interior.ts', 'systems'],
    ['src/content/index.ts', 'systems'], ['src/content/rifts/index.ts', 'systems'], ['src/content/areas/index.ts', 'systems'], ['src/main.ts', 'systems'], ['src/audio/new.ts', 'systems'], ['index.html', 'systems'],
    ['src/content/areas/shelf/maps/shelf.ts', 'area: shelf'], ['src/content/areas/shelf/shipped.json', 'area: shelf'], ['docs/areas/ashfall.md', 'area: ashfall'],
    ['docs/areas/hearth.md', 'area: hearth'], ['docs/areas/dead_drop.md', 'area: wrackholm'], ['docs/areas/meridian_camp.md', 'area: ashfall'],
    ['docs/areas/shelf/decisions.md', 'area: shelf'], ['docs/areas/shelf/plan.md', 'area: shelf'], ['docs/areas/dead_drop/plan.md', 'area: wrackholm'],
    ['docs/areas/hearth/decisions.md', 'area: hearth'], ['docs/areas/hearth/plan.md', 'area: hearth'],
    ['src/ui/monsters/wolf.ts', 'creatures'], ['src/ui/monsters/common.ts', 'creatures'], ['src/ui/interiors/shelf/index.ts', 'interiors'],
    ['src/ui/paint/brush.ts', 'systems'], ['src/ui/monsters/kit/common.ts', 'systems'], ['src/ui/interiors/kit/trades/temple.ts', 'systems'],
    ['tools/lanes.ts', 'quality'], ['tools/tests/gate.ts', 'quality'], ['.github/workflows/checks.yml', 'quality'], ['.github/labels.json', 'quality'], ['src/content/shipped.json', 'quality'],
    ['package.json', 'quality'], ['tsconfig.json', 'quality'], ['types/globals.d.ts', 'quality'],
    ['docs/SYSTEMS.md', 'design'], ['docs/ISSUES.md', 'design'], ['README.md', 'design'], ['CLAUDE.md', 'design'],
    ['src/lib/engine/text.ts', 'none'], ['scripts/new.sh', 'none'],
  ];
  const wrong = cases.filter(([f, want]) => at(f) !== want).map(([f, want]) => `${f} is ${at(f)}, not ${want}`);
  ok(!wrong.length, `the table places ${cases.length} sample files as docs/ISSUES.md §2 does${wrong.length ? ': ' + wrong.join('; ') : ''}`);

  // Every file in the tree falls in a lane but the vendored engine's: a new kind of file wants a line.
  const tracked = execFileSync('git', ['ls-files'], { cwd: fileURLToPath(root), encoding: 'utf8' }).split('\n').filter(Boolean);
  const unplaced = tracked.filter((f) => at(f) === 'none' && !f.startsWith('src/lib/'));
  ok(tracked.length > 100 && !unplaced.length, `every one of the tree's ${tracked.length} files falls in a lane, bar src/lib/'s${unplaced.length ? ': no line for ' + unplaced.join(', ') : ''}`);

  // Each area's folder names an area of AREAS, and so does each of the docs named for a place and not
  // its area, so a lane named for an area is a real one. (A new doc named for a place reads as an
  // area of its own name until it is listed in the table: the report is told no wrong lane, so this
  // does not stop the pull request that adds it.)
  const ids: string[] = AREAS.map((a) => a.id);
  const folders = readdirSync(new URL('src/content/areas/', root), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  const places = ['dead_drop', 'meridian_camp'].map((d) => at(`docs/areas/${d}.md`).replace('area: ', ''));
  const stray = folders.filter((f) => !ids.includes(f)).map((f) => `src/content/areas/${f}/`);
  ok(!stray.length && folders.length > 10 && places.every((a) => ids.includes(a)), `each of the ${folders.length} area folders names an area of AREAS, and each doc named for a place the area it lies in (${places.join(', ')})${stray.length ? ': ' + stray.join(', ') : ''}`);

  // The lanes' labels are the ones .github/labels.json holds, and it holds no other lane.
  const named = (JSON.parse(readFileSync(new URL('.github/labels.json', root), 'utf8')) as { name: string }[]).map((l) => l.name);
  const held = named.filter((n) => n.startsWith('lane: '));
  ok(LANES.every((l) => named.includes(labelOf(l))) && held.length === LANES.length, `.github/labels.json holds the ${LANES.length} lane labels the table names, and no other (${held.join(', ')})`);

  // The report. A pull request that touches quality, design and two areas.
  const files = ['tools/lanes.ts', 'docs/SYSTEMS.md', 'src/content/areas/shelf/index.ts', 'src/content/areas/shelf/items.ts', 'docs/areas/ashfall.md'];
  const said = (labels: string[] | null, ...lines: string[]): boolean => lines.every((l) => report(files, labels).includes(l));
  const lacks = (labels: string[] | null, ...lines: string[]): boolean => lines.every((l) => !report(files, labels).includes(l));
  ok(said(['lane: quality', 'lane: design', 'lane: area', 'approved'], 'The labels and the files agree.') && lacks(['lane: quality', 'lane: design', 'lane: area'], 'is missing', 'no file falls'),
    'labels that match the files\' lanes say so, and name no mismatch; a label that is no lane\'s is ignored');
  ok(said(['lane: area'], '`lane: quality` is missing: 1 file falls in it.', '`lane: design` is missing: 1 file falls in it.') && lacks(['lane: area'], '`lane: area` is missing', 'agree'),
    'a lane the files fall in that the labels lack is a line naming the label and the files\' count');
  ok(said(['lane: quality', 'lane: design', 'lane: area', 'lane: systems'], '`lane: systems` is on the pull request, but no file falls in systems.') && lacks(['lane: quality', 'lane: design', 'lane: area', 'lane: systems'], 'is missing', 'agree'),
    'a label whose lane no file falls in is a line naming the label');
  ok(said([], 'No lane label yet', 'The files fall in area, quality and design.') && said(['approved', 'epic'], 'No lane label yet') && lacks([], 'is missing'),
    'a pull request with no lane label gets one line saying so, not a line for each lane');
  ok(said(null, 'Labels not given') && lacks(null, 'is missing', 'no file falls', 'No lane label'), 'a print with no labels given compares none');
  ok(said(null, '**area: ashfall** (`lane: area`): 1 file', '**area: shelf** (`lane: area`): 2 files', '**quality** (`lane: quality`): 1 file', '- `src/content/areas/shelf/items.ts`'),
    'each lane is listed with its files, an area\'s by area, beside the label\'s text');
  const lib = report(['src/lib/engine/text.ts', 'tools/lanes.ts'], ['lane: quality']);
  ok(lib.includes('1 file fall in no lane: src/lib/ is vendored game-engine') && lib.includes('**no lane**'), 'a file under the vendored src/lib/ is told as outside every lane');
  ok(report([], ['lane: quality']).includes('No file changed.') && sections(['b.md', 'a.md', 'a.md']).every((s) => s.files.join() === 'a.md,b.md' || s.files.length === 0), 'an empty diff says so, and a file named twice is one');
}
