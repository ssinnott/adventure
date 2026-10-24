// What a pull request changed, for the checks that look only at that: the files since the base, and
// the maps among them to sweep, and the monsters and interiors among them for the contact sheet
// (tools/sheet.ts). A change to how every map, monster or room is laid out or painted counts them all,
// and a change to any file in an area's folder of rooms counts every room of that area. And the areas
// a diff reaches, whose gate and walkthroughs a pull request runs (tools/test.ts --since, #955).
//   node tools/changed.ts <base>              the files changed since <base>, one a line
//   node tools/changed.ts <base> maps         'all', or the ids of the maps changed, comma-separated
//   node tools/changed.ts <base> monsters     the same for the monsters
//   node tools/changed.ts <base> interiors    and for the interiors
//   node tools/changed.ts <base> areas        the areas the diff reaches, each with why, or all
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import { changedFiles, changedMaps, changedMonsters, changedInteriors, changedAreas } from './kit/changed.ts';

if (process.argv[1] && path.resolve(process.argv[1]) === fileURLToPath(import.meta.url)) {
  const [base, what] = process.argv.slice(2);
  if (!base || (what && !['maps', 'monsters', 'interiors', 'areas'].includes(what))) { console.error('usage: node tools/changed.ts <base> [maps|monsters|interiors|areas]'); process.exit(2); }
  const files = changedFiles(base);
  if (what === 'maps') { const c = await changedMaps(files); console.log(c.all ? 'all' : c.maps.join(',')); }
  else if (what === 'monsters') { const c = await changedMonsters(files, base); console.log(c.all ? 'all' : c.monsters.join(',')); }
  else if (what === 'interiors') { const c = await changedInteriors(files, base); console.log(c.all ? 'all' : c.interiors.join(',')); }
  else if (what === 'areas') {
    const r = changedAreas(base);
    console.log(r.all ? `all: ${r.all.file} (${r.all.why})` : [...[...r.areas].map(([a, why]) => `${a}: ${why}`), ...[...r.walks].map(([a, why]) => `walkthrough:${a}: ${why}`)].join('\n') || 'none');
  }
  else console.log(files.join('\n'));
}
