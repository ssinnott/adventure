// Headless proof that the game RENDERS IN A BROWSER through the dev server with nothing compiled to
// disk: load index.html, start a new game through the title screen, walk a few steps, open a fight,
// walk into a business and out again, and assert that every frame painted and no page error fired.
// This is the runner (#1006): it reads the environment, serves the tree, opens the page through the kit
// and runs the parts of tools/smoke/ one after another, each in its frame (boot.ts): a part that fails a
// check reports it, one that throws is `FAIL: <part> threw` and the others still report.
import { randomInt } from 'node:crypto';
import { readFileSync } from 'node:fs';
import { createServer } from './server.ts';
import { open } from './kit/browser.ts';
import { shardAsked, sweepAsked } from './sweep.ts';
import { frame, type Part, type Run } from './smoke/boot.ts';
import { asked, attract, coach, drawing, edge, explore, fall, hall, inn, kept, lampglass, pass, pilot, questlog, script, thornmark, title, trainer, waymark, weather, worldmap } from './smoke/flows.ts';
import { ice, landmarks, lighthouse, range, smooth, sunder, terrains, torches } from './smoke/scenes.ts';
import { endings, hearth, hills, interiors, silhouettes, winding } from './smoke/art.ts';
import { cracks, sweep } from './smoke/cracks.ts';

// Every run plays the same world: the page's Math.random is pinned, so the new game's seed is SMOKE_SEED
// (the first draw floors to it in freshSeed) and every draw after it follows from it. SMOKE_SEED=random
// picks one and prints it; SMOKE_SEED=<n> replays that world.
const DEFAULT_SEED = 1;
const SEED = process.env.SMOKE_SEED === 'random' ? randomInt(1, 0x7fffffff) : Number(process.env.SMOKE_SEED || DEFAULT_SEED);
if (!Number.isInteger(SEED) || SEED < 1 || SEED >= 0x7fffffff) throw new Error(`SMOKE_SEED must be random or a whole number from 1 to ${0x7fffffff - 1}`);
if (process.env.SMOKE_SEED === 'random') console.log(`SMOKE_SEED=${SEED}`);

// The parts in the order they run, each starting from the state it makes (boot.ts).
const PARTS: Part[] = [title, explore, kept, thornmark, inn, coach, trainer, script, hall, interiors, terrains, torches, sunder, smooth, lighthouse, landmarks, ice, range,
  questlog, asked, weather, worldmap, edge, pass, winding, cracks, hills, silhouettes, hearth, endings, lampglass, waymark, pilot, attract, drawing, fall, sweep];

// The crack sweep looks one way from every square of the cellar, Helmstow and its keep on every
// run, and all four ways from every square of the maps a pull request changes. SMOKE_BASE=<ref>
// sweeps what changed since that ref; SMOKE_SWEEP=all or <id>,<id> names the maps instead (CI's plan
// job passes the maps on, tools/sweep.ts). SMOKE_PART=rest runs every part but the four-way sweep and
// SMOKE_PART=sweep that sweep alone, both when unset (the `cracks` part then sweeping the maps asked
// all four ways); SMOKE_PART=<part> or <part>,<part> runs those parts alone, in the run's order; a part
// with a - before it is left out (#848: CI's smoke job runs rest,-silhouettes and the silhouettes job
// that part, and the run holds the jobs checks.yml gives to run every part once).
// SMOKE_SHARD=i/n sweeps the plan's i-th shard of n (tools/kit/sweep.ts); SMOKE_SWEEP_AUDIT=1 judges
// every view the old way as well.
const SWEEP = await sweepAsked();
const PART = process.env.SMOKE_PART ?? '';
/** The parts a SMOKE_PART asks for, in the run's order; it throws on a part the smoke has not, or rest beside a part named. */
const partsFor = (asked: string): Part[] => {
  const words = asked.split(',').filter(Boolean), out = words.filter((w) => w.startsWith('-')).map((w) => w.slice(1)), named = words.filter((w) => w !== 'rest' && !w.startsWith('-'));
  const unknown = [...named, ...out].filter((n) => !PARTS.some((p) => p.name === n));
  if (unknown.length || (named.length && words.includes('rest'))) throw new Error(`SMOKE_PART must be rest, sweep or parts of the smoke (${PARTS.map((p) => p.name).join(', ')}), each it leaves out with a - before it, not '${asked}'`);
  return (named.length ? PARTS.filter((p) => named.includes(p.name)) : PARTS.filter((p) => p !== sweep)).filter((p) => !out.includes(p.name));
};
const parts = partsFor(PART);
// The smoke's jobs in CI: each SMOKE_PART checks.yml sets, the smoke job's, the silhouettes job's and the
// sweep's, and the jobs that run one only on a condition (an `if:` on the job or on the step that runs the
// smoke), which the sweep's alone may.
const CI = readFileSync(new URL('../.github/workflows/checks.yml', import.meta.url), 'utf8').split(/^(?= {2}[\w-]+:$)/m);
const JOBS = CI.flatMap((job) => [...job.matchAll(/^ +SMOKE_PART: (\S+)$/gm)].map((m) => m[1]));
const iffy = CI.filter((job) => { const [head, ...steps] = job.split(/^(?= +- )/m); return /^ +SMOKE_PART: (?!sweep$)\S+$/m.test(job) && (/^ +if: /m.test(head) || steps.some((s) => /^ +SMOKE_PART: /m.test(s) && /^ +(- )?if: /m.test(s))); }).map((job) => job.trim().split(':')[0]);

const server = createServer();
await new Promise<void>((r) => server.listen(0, () => r()));
const port = (server.address() as { port: number }).port;

const { browser, page, errors } = await open(port, { seed: SEED });
let bad = 0;
const ok = (cond: boolean, msg: string) => { console.log((cond ? '  ok:   ' : '  FAIL: ') + msg); if (!cond) bad++; };
// The split (#848): CI's smoke jobs between them run every part once, none in two jobs or in none.
const runIn = new Map(PARTS.map((p) => [p.name, JOBS.filter((j) => partsFor(j).includes(p))]));
const split = [...runIn].filter(([, js]) => js.length !== 1).map(([n, js]) => `${n} in ${js.length ? js.join(' and ') : 'none'}`);
ok(JOBS.length > 0 && !split.length && !iffy.length, `CI's smoke jobs run every part once: ${JOBS.join('; ')}${split.length ? ' -> ' + split.join(', ') : ''}${iffy.length ? ` -> ${iffy.join(', ')} only on a condition` : ''}`);
const run: Run = { page, seed: SEED, ok, errors, sweep: { maps: SWEEP, four: PART.split(',').includes('rest') ? [] : SWEEP, shard: shardAsked(), audit: process.env.SMOKE_SWEEP_AUDIT === '1' } };

const secs: string[] = [];
for (const part of parts) {
  secs.push(`${part.name} ${(await frame(part, run)).toFixed(1)}`);
  // The screenshot CI keeps of a failed run: the page after the winding part, or after the last part when that is not run.
  if (process.env.SMOKE_SHOT && (part === winding || (part === parts.at(-1) && !parts.includes(winding)))) await page.screenshot({ path: process.env.SMOKE_SHOT });
}
ok(errors.length === 0, `no page errors${errors.length ? ' -> ' + errors.join(' | ') : ''}`);
const weatherSeed = await page.evaluate(() => window.__game?.game?.world?.state.weatherSeed).catch(() => undefined);
await browser.close();
server.close();

console.log(`\nEach part's seconds: ${secs.join(', ')}.`);
if (bad) console.log(`\nSMOKE_SEED=${SEED} (weather seed ${weatherSeed}) replays this run.`);
console.log(bad ? '\nSMOKE FAILED' : PART === 'sweep' ? '\nSMOKE OK: the crack sweep.' : '\nSMOKE OK: the game renders in a browser, served as TypeScript with no build step.');
process.exit(bad ? 1 : 0);
