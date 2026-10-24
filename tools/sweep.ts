// The crack sweep's plan on the command line (#953): the maps the smoke sweeps all four ways, read as the
// smoke reads them, and the plan of them (tools/kit/sweep.ts): its counts and the shards it calls for.
//   node tools/sweep.ts     the maps SMOKE_SWEEP names (all, or ids with commas between) or, unset, those
//                           changed since SMOKE_BASE; with SMOKE_SWEEP_AUDIT=1 the shards are the audit's
// In the checks the `plan` job runs it: to $GITHUB_OUTPUT go `shards`, a JSON list of i/n for the sweep
// job's matrix (empty where no map is swept), and `sweep`, the maps each shard sweeps; its line goes to
// the run's summary.
import { appendFileSync } from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { changedFiles, changedMaps } from './kit/changed.ts';
import { MAP_DEFS } from '../src/content/index.ts';
import { buildMaps } from '../src/content/maps.ts';
import { atlasOf, pairsOf, plan, shardsFor } from './kit/sweep.ts';

/** The maps to sweep all four ways: SMOKE_SWEEP=all or <id>,<id>, or what changed since SMOKE_BASE=<ref>; none when neither is set. */
export async function sweepAsked(): Promise<string[]> {
  const asked: string = process.env.SMOKE_SWEEP || (process.env.SMOKE_BASE ? await changedMaps(changedFiles(process.env.SMOKE_BASE)).then((c) => (c.all ? 'all' : c.maps.join(','))) : '');
  const ids = asked === 'all' ? MAP_DEFS.map((d) => d.id) : asked.split(',').filter(Boolean);
  for (const id of ids) if (!MAP_DEFS.some((d) => d.id === id)) throw new Error(`SMOKE_SWEEP names no map '${id}'`);
  return ids;
}

/** The shard SMOKE_SHARD=i/n names, the whole plan (1/1) when unset. */
export function shardAsked(): { i: number; n: number } {
  const s = process.env.SMOKE_SHARD || '1/1', m = /^(\d+)\/(\d+)$/.exec(s), i = Number(m?.[1]), n = Number(m?.[2]);
  if (!m || n < 1 || i < 1 || i > n) throw new Error(`SMOKE_SHARD must be i/n with 1 <= i <= n, not '${s}'`);
  return { i, n };
}

async function main(): Promise<void> {
  const ids = await sweepAsked(), audit = process.env.SMOKE_SWEEP_AUDIT === '1', t = Date.now();
  const p = plan(atlasOf(buildMaps()), ids.map((id) => ({ id, all: true }))), n = shardsFor(p, audit);
  const line = `${p.views.length} views of ${p.maps} maps: ${p.skipped} skipped, ${p.windows} windows, ${p.beside} with a wall beside the party; ${pairsOf(p, audit)} pairs to paint${audit ? ' in the audit' : ''}, ${n} shard${n === 1 ? '' : 's'} (planned in ${((Date.now() - t) / 1000).toFixed(1)} s)`;
  console.log(line);
  const out = process.env.GITHUB_OUTPUT, summary = process.env.GITHUB_STEP_SUMMARY;
  if (out) appendFileSync(out, `shards=${JSON.stringify(Array.from({ length: n }, (_, k) => `${k + 1}/${n}`))}\nsweep=${ids.length === MAP_DEFS.length ? 'all' : ids.join(',')}\n`);
  if (summary) appendFileSync(summary, `The crack sweep's plan: ${line}\n`);
}

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) await main();
