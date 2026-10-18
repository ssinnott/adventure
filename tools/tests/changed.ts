// What a pull request changed (tools/changed.ts), as the smoke test's sweep and the contact sheet
// read it: which files count every map, monster or interior, which count every room of one area, and
// which count only their own.
import { changedMaps, changedMonsters, changedInteriors, familiesIn } from '../changed.ts';
import { AREAS, ROOMS_AHEAD, MONSTERS } from '../../src/content/index.ts';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { FAMILY_OF } from '../../src/ui/monsters/index.ts';
import { ok } from './lib.ts';

export async function changed(): Promise<void> {
  ok((await changedMaps(['src/game/atlas.ts'])).all, 'a change to game/atlas.ts re-lays the zones, so it counts every map');
  ok(!(await changedMaps(['docs/DESIGN.md'])).all, 'a change to the docs counts no map');
  const wolf = await changedMonsters(['src/ui/monsters/wolf.ts']);
  ok(!wolf.all && wolf.monsters.includes('dire_wolf') && !wolf.monsters.includes('brigand'), `a family module counts the monsters it draws, no others (${wolf.monsters.join(',')})`);
  ok((await changedMonsters(['src/ui/monsters/common.ts'])).all, 'a shared brush in ui/monsters/ (no SPRITES) counts every monster');
  ok((await changedMonsters(['src/ui/sprites.ts'])).all, 'the dispatcher counts every monster');
  // The scenery paints every map and no monster; the dispatcher and the families paint no map, as the scene the sweep
  // paints draws no monster (#915).
  const scenery = await changedMonsters(['src/ui/scenery.ts']);
  ok((await changedMaps(['src/ui/scenery.ts'])).all && !scenery.all && !scenery.monsters.length, 'the scenery counts every map and no monster');
  ok(!(await changedMaps(['src/ui/sprites.ts'])).all && !(await changedMaps(['src/ui/monsters/wolf.ts', 'src/ui/monsters/index.ts'])).all, 'the dispatcher, a family and the barrel count no map');
  // A change to the barrel counts the families it merges that its base did not, read from its import lines.
  const barrel = readFileSync(new URL('../../src/ui/monsters/index.ts', import.meta.url), 'utf8'), registered = [...new Set(Object.values(FAMILY_OF))];
  ok(familiesIn(barrel).sort().join() === registered.sort().join() && familiesIn("import { SPRITES as wolf } from './wolf.ts';\nimport type { Sprite } from './common.ts';").join() === 'wolf',
    `the barrel's import lines read as the ${registered.length} families it registers`);
  const thornmark = AREAS.find((a) => a.id === 'thornmark')!;
  const fresh = await changedMonsters(['src/content/areas/thornmark/monsters.ts']);
  ok(fresh.monsters.length === thornmark.monsters.length && thornmark.monsters.every((d) => fresh.monsters.includes(d.id)), `an area's monsters with no base are all new (${fresh.monsters.length})`);
  // Against HEAD, on files as committed: skipped while a session has them mid-edit, which would count.
  const files = ['src/content/areas/thornmark/monsters.ts', 'src/content/areas/thornmark/index.ts', 'src/ui/monsters/index.ts'];
  let clean = true;
  try { execFileSync('git', ['diff', '--quiet', 'HEAD', '--', ...files]); } catch { clean = false; }
  if (clean) {
    const same = await changedMonsters([files[0]], 'HEAD');
    ok(!same.all && !same.monsters.length, `against HEAD, an area's monsters as committed count none (${same.monsters.join(',')})`);
    const sameRooms = await changedInteriors([files[1]], 'HEAD');
    ok(!sameRooms.all && !sameRooms.interiors.length, `against HEAD, the interiors an area's index already listed count none (${sameRooms.interiors.join(',')})`);
    const sameBarrel = await changedMonsters([files[2]], 'HEAD');
    ok(!sameBarrel.all && !sameBarrel.monsters.length, `against HEAD, the barrel as committed adds no family, so counts none (${sameBarrel.monsters.join(',')})`);
    // A kind added to a family touches its family's file and its area's monsters and index (EXPANSION §8.2).
    const added = ['src/ui/monsters/wolf.ts', files[0], files[1]], kind = await changedMonsters(added, 'HEAD'), swept = await changedMaps(added);
    const wolves = Object.values(MONSTERS).filter((d) => FAMILY_OF[d.sprite] === 'wolf').map((d) => d.id);
    ok(wolves.length > 1 && !kind.all && kind.monsters.length === wolves.length && wolves.every((id) => kind.monsters.includes(id)) && !swept.all && !swept.maps.length,
      `a kind added to a family counts that family's ${wolves.length} monsters of the ${Object.keys(MONSTERS).length}, no others, and no map (${kind.monsters.join(',')})`);
  } else console.log('  skip: the checks against HEAD, as Thornmark\'s monsters or index, or the barrel, differ from it');
  ok((await changedMonsters(['src/ui/brush.ts'])).all && (await changedInteriors(['src/ui/brush.ts'])).all, 'ui/brush.ts counts every monster and every interior');
  ok((await changedInteriors(['src/ui/monsters/gloss.ts'])).all, 'ui/monsters/gloss.ts, which the scenes borrow, counts every interior');
  // A file under an area's folder of rooms counts every room of the area, as the folder's registry keys them: the helpers its
  // scenes share (kilns/hold.ts, kilns/port.ts, rimewater/lodge.ts) have no room of their own to be found by, and a scene may
  // borrow from another (shelf/throne_room.ts from warden_drillyard.ts), which no file's name says.
  const roomsOf = (area: string): string[] => [...[...AREAS, ...ROOMS_AHEAD].find((a) => a.id === area)!.interiors];
  const counts = (c: { all: boolean; interiors: string[] }, want: string[]): boolean => want.length > 0 && !c.all && c.interiors.length === want.length && want.every((i) => c.interiors.includes(i));
  const folders = readdirSync(new URL('../../src/ui/interiors/', import.meta.url), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  const adrift: string[] = [];
  for (const folder of folders) {
    const registry = ((await import(new URL(`../../src/ui/interiors/${folder}/index.ts`, import.meta.url).href)) as { SCENES: Record<string, unknown> }).SCENES;
    const listed = [...[...AREAS, ...ROOMS_AHEAD].find((a) => a.id === folder)?.interiors ?? []].sort().join();
    if (!listed || listed !== Object.keys(registry).sort().join()) adrift.push(folder);
  }
  ok(folders.length > 0 && !adrift.length, `each folder of rooms is an area's, and its registry keys the rooms its area lists, so the sheet knows every id it names (${folders.join(', ')})${adrift.length ? ' -> not: ' + adrift.join(', ') : ''}`);
  const hold = await changedInteriors(['src/ui/interiors/kilns/hold.ts']), port = await changedInteriors(['src/ui/interiors/kilns/port.ts']), lodge = await changedInteriors(['src/ui/interiors/rimewater/lodge.ts']);
  ok(counts(hold, roomsOf('kilns')) && counts(port, roomsOf('kilns')), `a helper the Kilns' scenes share counts every Kilns room, Anvilhall's and Kilnhaven's (${hold.interiors.length})`);
  ok(counts(lodge, roomsOf('rimewater')), `the lodge's helper counts every room of Rimewater, and none of the Kilns' (${lodge.interiors.length})`);
  ok(counts(await changedInteriors(['src/ui/interiors/thornmark/split_oak.ts']), roomsOf('thornmark')), 'a scene file counts every room of its area, since another scene may borrow from it');
  ok(counts(await changedInteriors(['src/ui/interiors/shelf/index.ts']), roomsOf('shelf')), 'and so does the folder\'s registry');
  ok(counts(await changedInteriors(['src/ui/interiors/kilns/a_helper_deleted.ts']), roomsOf('kilns')), 'and so does a file that is gone, as a deleted helper changes the rooms that used it');
  const stray = await changedInteriors(['src/ui/interiors/nowhere/hold.ts']);
  ok(!stray.all && !stray.interiors.length, 'a folder that is no area\'s, with no registry, counts no room');
  ok(counts(await changedInteriors(['src/ui/interiors/kilns/hold.ts', 'src/ui/interiors/rimewater/lodge.ts']), [...roomsOf('kilns'), ...roomsOf('rimewater')]), 'two areas\' helpers together count the rooms of both, each once');
  ok((await changedInteriors(['src/ui/interiors/kit.ts'])).all, 'the kit counts every interior');
  ok((await changedInteriors(['src/lib/engine/text.ts'])).all, 'the pixel font, which letters signs in some rooms, counts every interior');
  ok(!(await changedInteriors(['src/ui/monsters/wolf.ts'])).all, 'a monster drawing counts no interior');
}
