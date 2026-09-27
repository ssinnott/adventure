// Pure-Node tests for the game model: maps, movement, combat determinism, saves, the quest log. No
// browser. One file per suite in tools/tests/, run in this order, then each area's walkthrough
// (src/content/areas/<area>/walkthrough.ts) where it has one.
//   node tools/test.ts                  run everything
//   node tools/test.ts maps combat      run selected suites
//   node tools/test.ts walkthrough:shelf  run one area's walkthrough
import { readdirSync, existsSync } from 'node:fs';
import { ok, fail, failureCount } from './tests/lib.ts';
import type { Walkthrough } from '../src/content/area.ts';
import { maps } from './tests/maps.ts';
import { movement } from './tests/movement.ts';
import { monsters } from './tests/monsters.ts';
import { combat } from './tests/combat.ts';
import { harness } from './tests/harness.ts';
import { party } from './tests/party.ts';
import { traits } from './tests/traits.ts';
import { calendar } from './tests/calendar.ts';
import { weather } from './tests/weather.ts';
import { atlas } from './tests/atlas.ts';
import { outdoors } from './tests/outdoors.ts';
import { save } from './tests/save.ts';
import { quests } from './tests/quests.ts';

const suites: Record<string, () => void> = { maps, movement, monsters, combat, harness, party, traits, calendar, weather, atlas, outdoors, save, quests };

// Each area's walkthrough, found by its file: an area adds one without touching this runner.
const areas = new URL('../src/content/areas/', import.meta.url);
for (const area of readdirSync(areas, { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name).sort()) {
  const file = new URL(`${area}/walkthrough.ts`, areas);
  if (!existsSync(file)) continue;
  const { walkthrough } = (await import(file.href)) as { walkthrough: Walkthrough };
  suites[`walkthrough:${area}`] = () => walkthrough(ok);
}

const wanted = process.argv.slice(2);
for (const [name, fn] of Object.entries(suites)) {
  if (wanted.length && !wanted.includes(name)) continue;
  console.log(`\n${name}`);
  try { fn(); } catch (e) { fail('threw ' + (e instanceof Error ? e.stack : String(e))); }
}
const failures = failureCount();
console.log(failures ? `\n${failures} FAILURE(S)` : '\nALL OK');
process.exit(failures ? 1 : 0);
