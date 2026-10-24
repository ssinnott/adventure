// What a save can refer to, as shipped: the shipped files list every id and placement a save may
// hold (EXPANSION §5.5), each area's own in src/content/areas/<area>/shipped.json and the version
// and what no area owns in src/content/shipped.json, joined into one record. A content edit reaches
// every old save, so what is in the list stays: a map keeps its size, a zone its place, a door its
// square, and no chest, event, inscription, group, flag, item, spell, monster, class, race, condition
// or skill goes, unless SAVE_VERSION goes up with an upgrade (src/game/upgrades.ts). New content
// only adds. tools/tests/shipped.ts holds the content to it.
//   node tools/shipped.ts    record what the content adds, each in the file of the area that owns
//                            it (a new area's first run makes its file), writing only a file that
//                            changed; refuses while something has gone or moved without a bump and
//                            its upgrade
import { existsSync, readFileSync, writeFileSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { SAVE_VERSION } from '../src/game/save.ts';
import { shippedFile, onDisk, CONTENT, collectShares, join, compare, readShares, readShipped } from './kit/shipped.ts';

if (process.argv[1] === fileURLToPath(import.meta.url)) {
  const read = readShares(), now = collectShares(CONTENT);
  const { problems, unrecorded } = Object.keys(read).length ? compare(readShipped(read), join(now)) : { problems: [], unrecorded: ['everything'] };
  if (problems.length) {
    console.log(`Not written: ${problems.length} problem(s)\n` + problems.map((p) => '  ' + p).join('\n'));
    process.exit(1);
  }
  const written: string[] = [];
  for (const [file, share] of Object.entries(now)) {
    const text = JSON.stringify(file === shippedFile() ? { version: SAVE_VERSION, ...share } : share, null, 2) + '\n';
    if (existsSync(onDisk(file)) && readFileSync(onDisk(file), 'utf8') === text) continue;
    writeFileSync(onDisk(file), text);
    written.push(file);
  }
  console.log(unrecorded.length ? `Recorded:\n${unrecorded.map((u) => '  ' + u).join('\n')}` : 'Nothing new.');
  if (written.length) console.log(`Written:\n${written.map((w) => '  ' + w).join('\n')}`);
}
