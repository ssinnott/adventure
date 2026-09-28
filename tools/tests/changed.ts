// What a pull request changed (tools/changed.ts), as the smoke test's sweep and the contact sheet
// read it: which files count every map, monster or interior, and which count only their own.
import { changedMaps, changedMonsters, changedInteriors } from '../changed.ts';
import { ok } from './lib.ts';

export async function changed(): Promise<void> {
  console.log('\nchanged');
  ok((await changedMaps(['src/game/atlas.ts'])).all, 'a change to game/atlas.ts re-lays the zones, so it counts every map');
  ok(!(await changedMaps(['docs/DESIGN.md'])).all, 'a change to the docs counts no map');
  const wolf = await changedMonsters(['src/ui/monsters/wolf.ts']);
  ok(!wolf.all && wolf.monsters.includes('dire_wolf') && !wolf.monsters.includes('brigand'), `a family module counts the monsters it draws, no others (${wolf.monsters.join(',')})`);
  ok((await changedMonsters(['src/ui/monsters/common.ts'])).all, 'a shared brush in ui/monsters/ (no KINDS) counts every monster');
  ok((await changedMonsters(['src/ui/sprites.ts'])).all, 'the dispatcher counts every monster');
  const fresh = await changedMonsters(['src/content/areas/thornmark/monsters.ts']);
  ok(fresh.monsters.length === 13, `an area's monsters with no base are all new (${fresh.monsters.length})`);
  const room = await changedInteriors(['src/ui/interiors/thornmark/split_oak.ts']);
  ok(!room.all && room.interiors.join() === 'split_oak', 'a scene file counts its own interior');
  ok((await changedInteriors(['src/ui/interiors/kit.ts'])).all, 'the kit counts every interior');
  ok(!(await changedInteriors(['src/ui/monsters/wolf.ts'])).all, 'a monster drawing counts no interior');
}
