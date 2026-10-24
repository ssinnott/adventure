// The level gates, measured: how often a company of a given level wins an area's fights, so a map's
// band can be held against what its monsters actually do (docs/EXPANSION.md §2.2, §5.2).
//   node tools/gate.ts                                 every map with monsters, levels 1-8, 10, 12 and 14
//   node tools/gate.ts --maps thornmark,grove2 --levels 2,3,4,5 --seeds 200
//   node tools/gate.ts --road thornmark:tm_wolves1,tm_brigands2,tm_hounds,tm_zealots
// The premade company is trained to each level, dressed by the ladder (GEAR, tools/kit/company.ts:
// to 28, the Hand's steel, and past it in that top step) and takes the prestiges its
// level brings, at 11, 19 and 27, as harness's company does (it is that company, `companyAt`),
// and fights every group of a map alone from full health, once per seed. --road instead fights the
// groups named, in order, with no rest between, and counts the companies still standing after each;
// one group is one fight. A plain bot plays the party, the game's own (src/game/bot.ts, which its
// auto-fight plays with the three from level 11): it mends, wakes, burns, casts, strikes or braces,
// and never sleeps, blesses, drinks or flees, so it is weaker than a player; single fights at full
// health are kinder than play. Harness's what-ifs reach it where a caller passes them (`Rules`): its
// company's tiers and its bot's options (#853), as harness's `--tiers` and `--bot` set them, and the
// bots' answers; play's unless passed (#865, #946). This command line takes none.
// A group that asks before it fights (#544) it refuses, and fights; the walk past it is `gatePass`.
// Between fights, where the gate check mends, it lifts stone first, by Absolve or the draught it
// carries from 25 (#546), as harness's company does.
// Read the numbers as where the fights bite, not as a promise. tools/tests/gate.ts holds every map
// and area to them (the gate check); it imports this file, whose table runs only from the command
// line.
import { pathToFileURL } from 'node:url';
import { MAX_LEVEL } from '../src/game/party.ts';
import { MAP_DEFS } from '../src/content/index.ts';
import { gateCompany } from './kit/company.ts';
import type { EncounterDef } from '../src/game/mapdef.ts';
import { gateOpts, gateFight, winRate } from './kit/fight.ts';


function main(): void {
  const args = process.argv.slice(2);
  const opt = (name: string): string | undefined => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : undefined; };
  const levels = (opt('levels') ?? '1,2,3,4,5,6,7,8,10,12,14').split(',').map(Number);
  const seeds = Number(opt('seeds') ?? 100);
  const only = opt('maps')?.split(',').filter(Boolean);
  if (levels.some((l) => !(l >= 1 && l <= MAX_LEVEL))) throw new Error(`levels run from 1 to ${MAX_LEVEL}`);

  const pct = (n: number, of: number): number => Math.round((100 * n) / of);
  const line = (label: string, cells: readonly (string | number)[]): void => console.log(label.padEnd(28) + cells.map((c) => String(c).padStart(5)).join(''));
  const heading = (label: string): void => line(label, levels.map((l) => `L${l}`));

  const road = opt('road');
  if (road) {
    const [mapId, ids = ''] = road.split(':');
    const groups: EncounterDef[] = ids.split(',').filter(Boolean).map((id) => {
      const g = MAP_DEFS.find((d) => d.id === mapId)?.encounters?.find((e) => e.id === id);
      if (!g) throw new Error(`no group '${id}' on '${mapId}'`);
      return g;
    });
    console.log(`${mapId}: companies still standing after each fight, no rest between (%, ${seeds} seeds)`);
    heading('fight');
    const standing = groups.map(() => levels.map(() => 0));
    levels.forEach((l, li) => {
      for (let k = 1; k <= seeds; k++) {
        const p = gateCompany(l, k);
        for (let f = 0; f < groups.length && gateFight(p, groups[f], k * 104729 + f, Infinity, gateOpts(groups[f])); f++) standing[f][li]++;
      }
    });
    groups.forEach((g, f) => line(`${f + 1}: ${g.id} [${g.monsters.length}]`, standing[f].map((n) => pct(n, seeds))));
  } else {
    console.log(`Fights won, each group alone from full health (%, ${seeds} seeds)`);
    heading('map (band)');
    for (const d of MAP_DEFS) {
      const groups = d.encounters ?? [];
      if (!groups.length || (only && !only.includes(d.id))) continue;
      line(`${d.id} (${d.band?.join('-') ?? '-'})`, levels.map((l) => {
        const won = groups.reduce((n, g) => n + Math.round(winRate(l, g, seeds, Infinity, gateOpts(g)) * seeds), 0);
        return pct(won, groups.length * seeds);
      }));
    }
  }
}

if (process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main();
