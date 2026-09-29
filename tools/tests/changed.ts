// What a pull request changed (tools/changed.ts), as the smoke test's sweep and the contact sheet
// read it: which files count every map, monster or interior, and which count only their own.
import { changedMaps, changedMonsters, changedInteriors, kindsOf } from '../changed.ts';
import { AREAS } from '../../src/content/index.ts';
import { execFileSync } from 'node:child_process';
import { readFileSync } from 'node:fs';
import { ok, familyModules } from './lib.ts';

export async function changed(): Promise<void> {
  ok((await changedMaps(['src/game/atlas.ts'])).all, 'a change to game/atlas.ts re-lays the zones, so it counts every map');
  ok(!(await changedMaps(['docs/DESIGN.md'])).all, 'a change to the docs counts no map');
  const wolf = await changedMonsters(['src/ui/monsters/wolf.ts']);
  ok(!wolf.all && wolf.monsters.includes('dire_wolf') && !wolf.monsters.includes('brigand'), `a family module counts the monsters it draws, no others (${wolf.monsters.join(',')})`);
  ok((await changedMonsters(['src/ui/monsters/common.ts'])).all, 'a shared brush in ui/monsters/ (no KINDS) counts every monster');
  // The sheet reads a family's kinds from its text; what it reads is what the module lists.
  const misread = (await familyModules()).filter((m) => {
    const read = kindsOf(readFileSync(new URL(`../../src/ui/monsters/${m.name}.ts`, import.meta.url), 'utf8'));
    return read?.join() !== m.kinds.join();
  }).map((m) => `${m.name}.ts`);
  ok(!misread.length, `each family module's KINDS reads from its text as it imports${misread.length ? ' -> misread: ' + misread.join(', ') : ''}`);
  ok((await changedMonsters(['src/ui/sprites.ts'])).all, 'the dispatcher counts every monster');
  const thornmark = AREAS.find((a) => a.id === 'thornmark')!;
  const fresh = await changedMonsters(['src/content/areas/thornmark/monsters.ts']);
  ok(fresh.monsters.length === thornmark.monsters.length && thornmark.monsters.every((d) => fresh.monsters.includes(d.id)), `an area's monsters with no base are all new (${fresh.monsters.length})`);
  // Against HEAD, on files as committed: skipped while a session has them mid-edit, which would count.
  const files = ['src/content/areas/thornmark/monsters.ts', 'src/content/areas/thornmark/index.ts'];
  let clean = true;
  try { execFileSync('git', ['diff', '--quiet', 'HEAD', '--', ...files]); } catch { clean = false; }
  if (clean) {
    const same = await changedMonsters([files[0]], 'HEAD');
    ok(!same.all && !same.monsters.length, `against HEAD, an area's monsters as committed count none (${same.monsters.join(',')})`);
    const sameRooms = await changedInteriors([files[1]], 'HEAD');
    ok(!sameRooms.all && !sameRooms.interiors.length, `against HEAD, the interiors an area's index already listed count none (${sameRooms.interiors.join(',')})`);
  } else console.log('  skip: the checks against HEAD, as Thornmark\'s monsters or index differ from it');
  ok((await changedMonsters(['src/ui/brush.ts'])).all && (await changedInteriors(['src/ui/brush.ts'])).all, 'ui/brush.ts counts every monster and every interior');
  ok((await changedInteriors(['src/ui/monsters/gloss.ts'])).all, 'ui/monsters/gloss.ts, which the scenes borrow, counts every interior');
  const room = await changedInteriors(['src/ui/interiors/thornmark/split_oak.ts']);
  ok(!room.all && room.interiors.join() === 'split_oak', 'a scene file counts its own interior');
  ok((await changedInteriors(['src/ui/interiors/kit.ts'])).all, 'the kit counts every interior');
  ok((await changedInteriors(['src/lib/engine/text.ts'])).all, 'the pixel font, which letters signs in some rooms, counts every interior');
  ok(!(await changedInteriors(['src/ui/monsters/wolf.ts'])).all, 'a monster drawing counts no interior');
}
