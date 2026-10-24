// What a pull request changed (tools/changed.ts), as the smoke test's sweep and the contact sheet
// read it: which files count every map, monster or interior, which count every room of one area, and
// which count only their own.
import { changedMaps, changedMonsters, changedInteriors, familiesIn, reachedAreas, describeReach, type Reach } from '../changed.ts';
import { graph, treeFiles } from '../kit/graph.ts';
import { AREAS, MONSTERS } from '../../src/content/index.ts';
import { execFileSync } from 'node:child_process';
import { readFileSync, readdirSync } from 'node:fs';
import { FAMILY_OF } from '../../src/ui/monsters/index.ts';
import { ok } from './lib.ts';

/** The areas a diff reaches (#955), each rule on the tree's own graph: `removed` gives a table's `-` lines, none where unset. */
function reaches(): void {
  const text = (f: string): string => readFileSync(new URL(`../../${f}`, import.meta.url), 'utf8');
  const g = graph(treeFiles(), text);
  const reach = (files: string[], removed: Record<string, readonly string[] | null> = {}, added: Record<string, readonly string[]> = {}): Reach =>
    reachedAreas(files, (f) => (removed[f] === null ? null : { removed: removed[f] ?? [], added: added[f] ?? [] }), g, text);
  const def = (f: string, id: string): string => text(f).split('\n').find((l) => l.includes(`id: '${id}'`)) ?? `no def ${id}`;
  // 2: a table's line changed or removed reaches every area; a def only added, its own area alone.
  const bones = 'src/content/areas/shelf/monsters.ts', axe = 'src/content/areas/sunderwood/items.ts';
  const fought = AREAS.filter((a) => a.id !== 'shelf' && a.maps.some((d) => d.encounters?.some((e) => e.monsters.includes('skeleton')))).map((a) => a.id);
  const skeleton = reach([bones], { [bones]: [def(bones, 'skeleton')] });
  ok(fought.includes('thornmark') && skeleton.all?.file === bones, `a changed skeleton, the Foreland's, fought in the groups of ${fought.join(', ')}, reaches every area (${describeReach(skeleton)})`);
  const item = reach([axe], { [axe]: [def(axe, 'great_axe')] }), added = reach([axe]);
  ok(item.all?.file === axe && !added.all && [...added.areas.keys()].join() === 'sunderwood',
    `a changed item reaches every area, as the ladder dresses every company; a def only added reaches its own area alone, not the tables that import it (${describeReach(added)})`);
  const inert = reach([axe], { [axe]: ["import { P } from '../../../game/items.ts';", '  // a word', ''] });
  ok(!inert.all && reach([axe], { [axe]: null }).all?.why.startsWith('deleted') === true, 'an import, a comment or a blank changed reaches no further, and a table deleted reaches every area');
  // 1 and 3: an area's file reaches its area, and the areas whose files import it, in turn, as far
  // as the areas' own files go.
  const walk = 'src/content/areas/shelf/walkthrough.ts';
  const by = [...g.edges].filter(([f, to]) => to.has(walk) && f.startsWith('src/content/areas/') && !f.startsWith('src/content/areas/shelf/')).map(([f]) => f.split('/')[3]);
  const walked = reach([walk]);
  ok(by.includes('thornmark') && !walked.all && walked.areas.get('shelf') === walk && by.every((a) => walked.areas.get(a) === 'imports shelf/walkthrough.ts'),
    `the Foreland's walkthrough reaches the Foreland and each area whose files import it (${describeReach(walked)})`);
  // 3, by a walkthrough's text: a line of a map changed reaches also the walkthroughs that read every area's maps or
  // quests (a find found and never told, sold or chested elsewhere), which no import shows; a comment changed, none.
  const anvil = 'src/content/areas/kilns/maps/anvil_stone.ts';
  const map = reach([anvil], { [anvil]: ["  rows: ['#.#']"] }, { [anvil]: ["  rows: ['#..']"] }), note = reach([anvil], { [anvil]: ['// a word'] }, { [anvil]: ['// two words'] });
  const scanners = [...map.walks.keys()];
  ok(scanners.includes('cairnmoor') && !scanners.includes('kilns') && !scanners.includes('thornmark') && [...map.areas.keys()].join() === 'kilns' && !note.walks.size && [...note.areas.keys()].join() === 'kilns',
    `a line of a Kilns map changed reaches the Kilns, and the walkthroughs of ${scanners.join(', ')}, which read every area's maps or quests; a comment changed, the Kilns alone`);
  const index = reach(['src/content/areas/hearth/index.ts']);
  ok(!index.all && index.areas.size < AREAS.length, `the walk stops at the files outside the areas, as src/content/index.ts imports every area's (${describeReach(index)})`);
  // 4: elsewhere.
  const none = reach(['docs/DESIGN.md', 'README.md', 'CLAUDE.md', 'types/globals.d.ts', '.github/labels.json', 'tools/tests/outdoors.ts', 'tools/smoke.ts', 'src/ui/monsters/wolf.ts', 'src/ui/interiors/kilns/hold.ts']);
  ok(!none.all && !none.areas.size, `the docs, the front pages, types/, .github/ but the workflow, a module neither the gate nor a walkthrough loads and a drawing reach no area (${describeReach(none)})`);
  const all: [string, string][] = [['src/game/combat.ts', 'the gate or a walkthrough loads it'], ['tools/harness.ts', 'the gate or a walkthrough loads it'], ['tools/test.ts', 'it decides what runs'],
    ['tools/changed.ts', 'it decides what runs'], ['tools/kit/graph.ts', 'it decides what runs'], ['.github/workflows/checks.yml', 'it decides what runs'], ['package.json', 'the graph does not read it'],
    ['src/content/shipped.json', 'the graph does not read it'], ['tools/a_table_no_file_imports.json', 'the graph does not read it']];
  const missed = all.filter(([f, why]) => reach(['docs/DESIGN.md', f]).all?.why !== why).map(([f]) => f);
  ok(!missed.length, `a systems file, a tool the gate loads, what decides what runs and a file the graph does not read reach every area${missed.length ? ` (not: ${missed.join(', ')})` : ''}`);
}

export async function changed(): Promise<void> {
  reaches();
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
  ok((await changedMaps(['src/ui/monsters/common.ts'])).all, 'ui/monsters/common.ts, whose B and stroke the scenery paints with, counts every map');
  // A change to the barrel counts the families it merges that its base did not, read from its import lines.
  const barrel = readFileSync(new URL('../../src/ui/monsters/index.ts', import.meta.url), 'utf8'), registered = [...new Set(Object.values(FAMILY_OF))];
  ok(familiesIn(barrel).sort().join() === registered.sort().join() && familiesIn("import { SPRITES as wolf } from './wolf.ts';\nimport type { Sprite } from './common.ts';").join() === 'wolf',
    `the barrel's import lines read as the ${registered.length} families it registers`);
  const whole = await changedMonsters(['src/ui/monsters/index.ts']);
  ok(!whole.all && whole.monsters.length === Object.keys(MONSTERS).length, `a barrel with no base adds every family it registers, so counts all ${whole.monsters.length} monsters, as a list and not as a sweep of everything`);
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
  const roomsOf = (area: string): string[] => [...AREAS.find((a) => a.id === area)!.interiors];
  const counts = (c: { all: boolean; interiors: string[] }, want: string[]): boolean => want.length > 0 && !c.all && c.interiors.length === want.length && want.every((i) => c.interiors.includes(i));
  const folders = readdirSync(new URL('../../src/ui/interiors/', import.meta.url), { withFileTypes: true }).filter((d) => d.isDirectory()).map((d) => d.name);
  const adrift: string[] = [];
  for (const folder of folders) {
    const registry = ((await import(new URL(`../../src/ui/interiors/${folder}/index.ts`, import.meta.url).href)) as { SCENES: Record<string, unknown> }).SCENES;
    const listed = [...AREAS.find((a) => a.id === folder)?.interiors ?? []].sort().join();
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
