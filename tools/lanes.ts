// The lanes a diff's files fall in, and beside them the lane labels of a pull request (EXPANSION §8.1,
// docs/ISSUES.md §2; #899): the command line of tools/kit/lanes.ts, which holds the table and the report.
//   node tools/lanes.ts <base>                          the files changed since <base>, by lane
//   node tools/lanes.ts <base> --labels "lane: area"    and beside those labels (an empty value: none)
// In the checks (the `lanes` job of .github/workflows/checks.yml runs `node tools/lanes.ts HEAD^1`) the
// labels are those the pull request's event carries ($GITHUB_EVENT_PATH) and the report is appended to
// the run's summary ($GITHUB_STEP_SUMMARY) as well as printed; there nothing fails the run: a report
// that cannot be made says so in its place.
import { appendFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { changedPaths, eventLabels, report } from './kit/lanes.ts';

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
