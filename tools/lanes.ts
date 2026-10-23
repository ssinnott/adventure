// The lanes a diff's files fall in (EXPANSION §8.1, docs/ISSUES.md §2), as code (#899): the table a
// reviewer read by hand, run over a pull request's files. It lists each lane with its files and,
// beside them, the lane labels the pull request carries, with a line for each lane a file falls in
// that the labels lack and each label whose lane no file falls in. It tells; it never gates.
//   node tools/lanes.ts <base>                          the files changed since <base>, by lane
//   node tools/lanes.ts <base> --labels "lane: area"    and beside those labels (an empty value: none)
// The files are those from the merge base with <base> to the working tree, new files included, and a
// rename counts at both its ends: a file moved from one lane to another is an edit in each. In the
// checks (the `lanes` job of .github/workflows/checks.yml runs `node tools/lanes.ts HEAD^1`) the labels
// are those the pull request's event carries ($GITHUB_EVENT_PATH) and the report is appended to the
// run's summary ($GITHUB_STEP_SUMMARY) as well as printed; there nothing fails the run: a report that
// cannot be made says so in its place.
import { execFileSync } from 'node:child_process';
import { appendFileSync, readFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');

/** The lanes of docs/ISSUES.md §2, in its order. */
export const LANES = ['systems', 'area', 'creatures', 'interiors', 'quality', 'design'] as const;
export type Lane = (typeof LANES)[number];
/** A lane's label, as `.github/labels.json` names it (tools/tests/lanes.ts holds the two together). */
export const labelOf = (lane: Lane): string => `lane: ${lane}`;

/** Where a file falls: in a lane (an area's carries the area as well), or outside every lane, with why. */
export type Place = { lane: Lane; area?: string } | { lane: null; why: string };

/**
 * The area docs not named for the folder of the area they belong to: a place's doc, in the area it
 * lies in (the Dead-Drop under Wrackholm's Tide Ship, Meridian Camp down Ashfall's vents, Hearth
 * Isle). tools/tests/lanes.ts holds each to an area of AREAS; a doc named for a place and not listed
 * here reads as an area of its own name, which tells nothing wrong of its lane.
 */
const DOC_AREA: Readonly<Record<string, string>> = { hearth_isle: 'hearth', dead_drop: 'wrackholm', meridian_camp: 'ashfall' };

const systems = (): Place => ({ lane: 'systems' });
const quality = (): Place => ({ lane: 'quality' });
const design = (): Place => ({ lane: 'design' });

/**
 * The table of docs/ISSUES.md §2, a line to a kind of file; the first line a file matches places
 * it. The save format needs no line of its own: `SAVE_VERSION`, the upgrades and the save keys are
 * all in src/game/.
 */
const TABLE: readonly (readonly [RegExp, (m: RegExpExecArray) => Place])[] = [
  // An area's own: its folder (maps, monsters, items, quests, walkthrough and its shipped.json) and its doc.
  [/^src\/content\/areas\/([^/]+)\//, (m) => ({ lane: 'area', area: m[1] })],
  [/^docs\/areas\/([^/]+)\.md$/, (m) => ({ lane: 'area', area: DOC_AREA[m[1]] ?? m[1] })],
  // The art modules, a lane each.
  [/^src\/ui\/monsters\//, () => ({ lane: 'creatures' })],
  [/^src\/ui\/interiors\//, () => ({ lane: 'interiors' })],
  // What a save may refer to that no area owns is the content contract's, so before the rest of src/content/.
  [/^src\/content\/shipped\.json$/, quality],
  // Vendored: fixed upstream, never edited here (DESIGN §13); before the rest of src/.
  [/^src\/lib\//, () => ({ lane: null, why: 'src/lib/ is vendored game-engine: fixed upstream, never edited here (DESIGN §13)' })],
  // Systems: src/game/, src/ui/ outside the art modules, src/content/ outside an area's folder and whatever else stands in src/
  // (main.ts, input.ts), so a new file there is placed; and the game's page.
  [/^src\//, systems],
  [/^index\.html$/, systems],
  // Quality: the tools, CI and the content contract, and what configures the checks (their scripts, the typecheck, the ignore list).
  [/^(tools|\.github|types)\//, quality],
  [/^(package\.json|package-lock\.json|tsconfig\.json|\.gitignore)$/, quality],
  // Design: docs/ but an area's doc, and the front pages that point at them.
  [/^docs\//, design],
  [/^(README|CLAUDE)\.md$/, design],
];

/** Where a file falls. A file no line names is outside every lane, which the report says, so a new kind of file wants a line. */
export function laneOf(file: string): Place {
  for (const [re, at] of TABLE) {
    const m = re.exec(file);
    if (m) return at(m);
  }
  return { lane: null, why: 'no line of the table in tools/lanes.ts names them' };
}

/** The files of one lane (of one area, for an area's), or those outside every lane for one reason. */
export interface Section { lane: Lane | null; name: string; files: string[]; why?: string }

/** The files grouped: lane by lane in the table's order, an area's by area, and last those outside every lane. */
export function sections(files: readonly string[]): Section[] {
  const by = new Map<string, Section>();
  for (const file of [...new Set(files)].sort()) {
    const p = laneOf(file);
    const name = p.lane === null ? 'no lane' : p.area ? `${p.lane}: ${p.area}` : p.lane;
    const key = p.lane === null ? `${name}: ${p.why}` : name;
    let s = by.get(key);
    if (!s) by.set(key, s = p.lane === null ? { lane: null, name, files: [], why: p.why } : { lane: p.lane, name, files: [] });
    s.files.push(file);
  }
  const rank = (s: Section): number => (s.lane === null ? LANES.length : LANES.indexOf(s.lane));
  return [...by.values()].sort((a, b) => rank(a) - rank(b) || a.name.localeCompare(b.name));
}

/** A list in words, with no comma before the last: `a, b and c`. */
const and = (xs: readonly string[]): string => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);
const count = (n: number): string => `${n} file${n === 1 ? '' : 's'}`;

/**
 * The report, in markdown: the lines that matter first (a label missing, a label with no file under
 * it, no lane label yet, files outside every lane), then each lane with its files. `labels` are the
 * pull request's, or null where there are none to compare (a local print without `--labels`).
 */
export function report(files: readonly string[], labels: readonly string[] | null): string {
  const secs = sections(files);
  const inLane = (lane: Lane): number => secs.filter((s) => s.lane === lane).reduce((n, s) => n + s.files.length, 0);
  const falls = LANES.filter((l) => inLane(l) > 0);
  const out = ['### Lanes', ''];
  if (!files.length) out.push('No file changed.', '');
  const lines: string[] = [];
  if (labels === null) out.push('Labels not given: `--labels "lane: area, lane: quality"` sets the ones to compare.', '');
  else {
    const carried = LANES.filter((l) => labels.includes(labelOf(l)));
    out.push(`Lane labels on the pull request: ${carried.length ? carried.map((l) => `\`${labelOf(l)}\``).join(', ') : 'none'}.`, '');
    if (!carried.length) lines.push(`No lane label yet: they go on after a pull request opens.${falls.length ? ` The files fall in ${and(falls)}.` : ''}`);
    else {
      for (const l of falls) if (!carried.includes(l)) lines.push(`\`${labelOf(l)}\` is missing: ${inLane(l) === 1 ? '1 file falls' : `${inLane(l)} files fall`} in it.`);
      for (const l of carried) if (!falls.includes(l)) lines.push(`\`${labelOf(l)}\` is on the pull request, but no file falls in ${l}.`);
      if (!lines.length) lines.push('The labels and the files agree.');
    }
  }
  for (const s of secs.filter((q) => q.lane === null)) lines.push(`${count(s.files.length)} fall in no lane: ${s.why}.`);
  for (const l of lines) out.push(`- ${l}`);
  for (const s of secs) {
    out.push('', s.lane === null ? `**no lane** (${s.why}): ${count(s.files.length)}` : `**${s.name}** (\`${labelOf(s.lane)}\`): ${count(s.files.length)}`, '');
    for (const f of s.files) out.push(`- \`${f}\``);
  }
  return out.join('\n');
}

/** A git command's lines, or its own words for why it failed. */
function git(...args: string[]): string[] {
  try { return execFileSync('git', args, { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'] }).split('\n').filter(Boolean); }
  catch (e) { throw new Error(`git ${args.join(' ')} failed: ${String((e as { stderr?: string }).stderr ?? e).trim()}`); }
}

/** The files changed since <base>, from where the branch left it, uncommitted and new files included, a rename at both its ends. */
export function changedPaths(base: string): string[] {
  const from = git('merge-base', base, 'HEAD')[0];
  if (!from) throw new Error(`${base} and HEAD have no merge base`);
  return [...new Set([...git('diff', '--name-only', '--no-renames', from), ...git('ls-files', '--others', '--exclude-standard')])].sort();
}

/** The labels a pull request's event carries, or null where the event is no pull request's (or there is none). */
export function eventLabels(file: string | undefined): string[] | null {
  if (!file) return null;
  const pr = (JSON.parse(readFileSync(file, 'utf8')) as { pull_request?: { labels?: { name?: string }[] } }).pull_request;
  return pr ? (pr.labels ?? []).map((l) => l.name ?? '') : null;
}

class Usage extends Error {}
const USAGE = 'usage: node tools/lanes.ts <base> [--labels "lane: area, lane: quality"]';

/** Strict, as tools/sheet.ts is: one base, and `--labels` once with a value; anything else is refused. */
function parse(args: readonly string[]): { base: string; labels?: string[] } {
  let base: string | undefined, labels: string[] | undefined;
  for (let i = 0; i < args.length; i++) {
    const a = args[i];
    if (a === '--labels') {
      if (labels) throw new Usage(`${a} given twice`);
      if (args[i + 1] === undefined) throw new Usage(`${a} needs a value (an empty one means none)`);
      labels = args[++i].split(',').map((s) => s.trim()).filter(Boolean);
    } else if (a.startsWith('--')) throw new Usage(`unknown flag ${a}`);
    else if (base === undefined) base = a;
    else throw new Usage(`one base only, not '${base}' and '${a}'`);
  }
  if (base === undefined) throw new Usage('no base to diff against');
  return { base, labels };
}

function main(args: readonly string[]): void {
  const summary = process.env.GITHUB_STEP_SUMMARY;
  try {
    const { base, labels } = parse(args);
    const text = report(changedPaths(base), labels ?? eventLabels(process.env.GITHUB_EVENT_PATH));
    console.log(text);
    if (summary) appendFileSync(summary, text + '\n');
  } catch (e) {
    const why = e instanceof Error ? e.message : String(e);
    // In the checks it tells and never fails the run; at a terminal a fault is a fault.
    if (!summary) { console.error(e instanceof Usage ? `${why}\n${USAGE}` : why); process.exit(e instanceof Usage ? 2 : 1); }
    const line = `### Lanes\n\nThe lanes could not be read: ${why}`;
    console.log(line);
    appendFileSync(summary, line + '\n');
  }
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) main(process.argv.slice(2));
