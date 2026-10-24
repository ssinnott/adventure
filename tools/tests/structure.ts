// The maps' structure, the rules any content has to keep: no iron key behind its own lock, however
// the party spends its keys, a key spent on a locked chest among them; nothing the road needs in a
// locked chest; no guardian that comes back (a group that drops a quest item or says something when
// it dies, beside the quests suite's check for groups a quest names); every respawn
// within 720 to 2,880 minutes; a group's `until` and `after` naming something real, and no sky
// underground; a group under the ice standing on ice; Thornmark's Rift stopping with the tear; every
// outdoor map one box of the atlas's grid. Each is first run on the content as it is, then on a map
// broken on purpose, to show it can fail. Last, game/dens.ts, quests.ts and stones.ts and every area's
// index each load first in a fresh process, with nothing before them: before #896, dens.ts and three
// areas' indexes did not.
import { spawn } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import { AREAS, MAP_DEFS, MONSTERS, ATLAS } from '../../src/content/index.ts';
import { TEAR_CLOSED } from '../../src/content/areas/thornmark/maps/grove2.ts';
import { gridFaults } from '../../src/game/atlas.ts';
import type { Atlas, AtlasZone } from '../../src/game/atlas.ts';
import { GameMap, anchored, landExits } from '../../src/game/map.ts';
import type { EncounterDef, Exit, Feature, MapDef } from '../../src/game/map.ts';
import { EAST, SOUTH } from '../../src/game/types.ts';
import { RESPAWN } from '../../src/game/keys.ts';
import { ok } from './lib.ts';
import { presenceFaults, strandedLocks, respawnsOutOfRange, returningGuardians, questItems, guardian } from '../kit/rules/structure.ts';

/**
 * What a locked chest holds that the road may need (#857): an item a quest turns on (`questItems`) or
 * an iron key, which a door needs. A locked chest opens to a Lockpick or a key, and to nothing else.
 */
export function lockedFaults(def: MapDef, items: ReadonlySet<string>): string[] {
  return (def.features ?? []).flatMap((f) => (f.kind === 'chest' && f.locked ? f.items.filter((i) => i === 'key_iron' || items.has(i)).map((i) => `${f.id} at ${f.x},${f.y} holds ${i}`) : []));
}

/** The groups of a map placed under the ice that do not stand on ice (#536). */
export function underFaults(def: MapDef): string[] {
  const m = new GameMap(def);
  return (def.encounters ?? []).filter((e) => e.under === 'ice' && m.at(e.x, e.y).terrain !== 'ice').map((e) => `${e.id} at ${e.x},${e.y} on ${m.at(e.x, e.y).terrain}`);
}

/** The respawning groups of a map with a Rift monster in them that do not stop coming back when the tear closes. */
export function riftStillComing(def: MapDef): string[] {
  return (def.encounters ?? []).filter((e) => e.respawn && e.monsters.some((id) => MONSTERS[id]?.kind === 'rift') && JSON.stringify(e.until) !== JSON.stringify(TEAR_CLOSED)).map((e) => e.id);
}

/**
 * Why a module fails to load first in a fresh process, with nothing loaded before it; '' if it loads.
 * A module that reads another's binding as it loads, through a cycle, throws there (#896).
 */
export function firstLoad(file: string): Promise<string> {
  return new Promise((done) => {
    const child = spawn(process.execPath, [file], { stdio: ['ignore', 'ignore', 'pipe'] });
    let err = '';
    child.stderr.on('data', (d: Buffer) => { err += String(d); });
    child.on('error', (e) => done(e.message));
    child.on('close', (code) => done(code === 0 ? '' : err.split('\n').find((l) => /^\w*Error\b/.test(l)) ?? `exit ${code}`));
  });
}

export async function structure(): Promise<void> {
  // Each in a process of its own, started now and read at the end: game/dens.ts, quests.ts and
  // stones.ts, which a cycle through the content once broke, and every area's index (#896).
  const firsts = ['src/game/dens.ts', 'src/game/quests.ts', 'src/game/stones.ts', ...AREAS.map((a) => `src/content/areas/${a.id}/index.ts`)];
  const loading = firsts.map((f) => firstLoad(fileURLToPath(new URL(`../../${f}`, import.meta.url))));
  const items = questItems();
  const list = (xs: string[]): string => (xs.length ? ' -> ' + xs.join(', ') : '');
  for (const def of MAP_DEFS) {
    const stranded = strandedLocks(def);
    ok(!stranded.length, `${def.id}: every locked door opens with a key found before it, in every order the keys are spent${list(stranded)}`);
    const back = returningGuardians(def, items);
    ok(!back.length, `${def.id}: no guardian respawns (a group that drops a quest item or has a slainText)${list(back)}`);
    const out = respawnsOutOfRange(def);
    ok(!out.length, `${def.id}: every respawn is ${RESPAWN.half} to ${RESPAWN.twoDays} minutes${list(out)}`);
    const when = presenceFaults(def);
    ok(!when.length, `${def.id}: every group's, person's, event's, blessing's and camp night's until and after names something real, and none asks for a sky underground${list(when)}`);
  }
  { // Nothing the road needs lies in a locked chest (#857): no item a quest turns on and no iron key;
    // the locked chests placed hold neither (Wrackholm's first, #881), so a fixture with one of each, and an
    // unlocked chest holding both, shows the check.
    const shut = MAP_DEFS.flatMap((d) => lockedFaults(d, items).map((f) => `${d.id}: ${f}`));
    const placed = MAP_DEFS.flatMap((d) => (d.features ?? []).filter((f) => f.kind === 'chest' && f.locked)).length;
    ok(!shut.length, `no locked chest holds an item a quest turns on or an iron key (${placed} locked chests placed)${list(shut)}`);
    const quest = [...items].sort()[0];
    const coffers: MapDef = { id: 'fx_coffers', name: 'Coffers', kind: 'dungeon', start: { x: 1, y: 1, facing: SOUTH }, rows: ['#####', '#...#', '#####'], features: [
      { kind: 'chest', x: 2, y: 1, id: 'c_quest', gold: 0, items: [quest], locked: true },
      { kind: 'chest', x: 3, y: 1, id: 'c_key', gold: 0, items: ['torch', 'key_iron'], locked: true },
      { kind: 'chest', x: 1, y: 1, id: 'c_open', gold: 0, items: [quest, 'key_iron'] },
    ] };
    const caught = lockedFaults(coffers, items);
    ok(caught.join('; ') === `c_quest at 2,1 holds ${quest}; c_key at 3,1 holds key_iron`, `a locked chest holding ${quest}, which a quest turns on, or an iron key is caught, and an unlocked chest holding both is not (${caught.join('; ') || 'nothing'})`);
  }
  { // A group under the ice stands on it: on any map, and not the mill's rats put under it on its floor.
    const iced = MAP_DEFS.flatMap((d) => (d.encounters ?? []).filter((e) => e.under === 'ice')).length;
    const wrong = MAP_DEFS.flatMap((d) => underFaults(d).map((f) => `${d.id}: ${f}`));
    ok(!wrong.length, `every group placed under the ice stands on ice (${iced} placed)${list(wrong)}`);
    const rats = MAP_DEFS.find((d) => d.id === 'mill')!;
    const floor = underFaults({ ...rats, encounters: (rats.encounters ?? []).map((e) => (e.id === 'm_rats' ? { ...e, under: 'ice' as const } : e)) });
    ok(floor.length === 1 && /^m_rats at \d+,\d+ on floor$/.test(floor[0]), `and the mill's rats put under the ice on its floor are refused${list(floor)}`);
  }
  const thornmark = AREAS.find((a) => a.id === 'thornmark')!.maps;
  for (const def of thornmark) {
    const rift = riftStillComing(def);
    ok(!rift.length, `${def.id}: every Rift group that comes back stops once the Warden of the Cut is dead${list(rift)}`);
  }

  // Every outdoor map is one box of the grid, laid once: 32 by 32, or a box cut to the world at its edge.
  const grid = gridFaults(ATLAS, MAP_DEFS);
  for (const def of MAP_DEFS.filter((d) => d.kind === 'outdoor')) {
    const mine = grid.filter((f) => f.startsWith(`map ${def.id} `));
    ok(!mine.length, `${def.id}: one box of the atlas's grid, laid once${list(mine)}`);
  }
  { // Off the grid on purpose: the Foreland a square east, a small map at a box's corner, a map laid
    // twice; and a map the height of row 1, which the world's edge cuts, on it.
    const moved = (id: string, at: readonly [number, number], extra: AtlasZone[] = []): Atlas => ({ ...ATLAS, zones: [...ATLAS.zones.map((z) => (z.maps?.some((m) => m.map === id) ? { ...z, maps: z.maps.map((m) => (m.map === id ? { map: id, at } : m)) } : z)), ...extra] });
    const fixture = (w: number, h: number): MapDef => ({ id: 'fixture_box', name: 'Box fixture', kind: 'outdoor', start: { x: 1, y: 1, facing: SOUTH }, rows: Array(h).fill(','.repeat(w)) });
    const laid = (w: number, h: number, at: readonly [number, number]): string[] => gridFaults({ ...ATLAS, zones: [...ATLAS.zones, { id: 'fixture_box', name: 'Box fixture', area: 'shelf', maps: [{ map: 'fixture_box', at }] }] }, [...MAP_DEFS, fixture(w, h)]);
    const east = gridFaults(moved('shelf', [201, 30]), MAP_DEFS);
    ok(east.length === 1 && /shelf/.test(east[0]) && /G2/.test(east[0]), `the Foreland's map laid a square east, at 201,30, fails, naming it and G2${list(east)}`);
    const small = laid(16, 16, [168, 30]);
    ok(small.length === 1 && /F2/.test(small[0]), `a 16 by 16 map at F2's corner fails${list(small)}`);
    const edge = laid(32, 30, [72, 0]);
    ok(!edge.length, `a 32 by 30 map at C1, a box of row 1, passes${list(edge)}`);
    const twice = gridFaults(moved('shelf', [200, 30], [{ id: 'fixture_twice', name: 'Twice', area: 'shelf', maps: [{ map: 'shelf', at: [168, 30] }] }]), MAP_DEFS);
    ok(twice.length === 1 && /laid twice/.test(twice[0]), `a map two zones lay fails${list(twice)}`);
  }
  { // Every exit lands on a named anchor of the map it leads to, which the join turns into its square
    // and facing (#993); an anchor the landing map lacks, an anchor named twice and an exit with both
    // an anchor and a square are each refused by name. Fresh fixtures each time: the join fills in place.
    const loose = MAP_DEFS.flatMap((d) => (d.exits ?? []).filter((e) => e.at === undefined).map((e) => `${d.id} ${e.x},${e.y}`));
    ok(!loose.length, `every exit of the areas' maps lands on an anchor (${MAP_DEFS.reduce((n, d) => n + (d.exits?.length ?? 0), 0)} exits)${list(loose)}`);
    const room = (id: string, more: Partial<MapDef> = {}): MapDef => ({ id, name: id, kind: 'dungeon', start: { x: 1, y: 1, facing: SOUTH }, rows: ['#####', '#...#', '#####'], ...more });
    const hall = (anchors: MapDef['anchors'] = { from_cell: { x: 2, y: 1, facing: EAST } }): MapDef => room('fx_hall', { anchors });
    const cell = (...exits: Exit[]): MapDef => room('fx_cell', { exits });
    const join = (defs: MapDef[]): string => { try { landExits(defs); return 'nothing refused'; } catch (e) { return (e as Error).message; } };
    const ways = [anchored({ x: 3, y: 1, to: 'fx_hall', at: 'start' }), anchored({ x: 2, y: 1, to: 'fx_hall', at: 'from_cell' })];
    const fine = join([cell(...ways), hall()]), [a, b] = ways.map((e) => `${e.tx},${e.ty} ${e.tf}`);
    ok(fine === 'nothing refused' && a === `1,1 ${SOUTH}` && b === `2,1 ${EAST}`, `an exit to the hall's start and one to its anchor land on their squares and facings (${fine}: ${a}; ${b})`);
    const lacks = join([cell(anchored({ x: 3, y: 1, to: 'fx_hall', at: 'from_yard' })), hall()]);
    ok(lacks === `exit of fx_cell at 3,1 to fx_hall lands at 'from_yard', and fx_hall has no such anchor`, `an anchor the landing map lacks is refused by name (${lacks})`);
    const twice = join([cell(anchored({ x: 3, y: 1, to: 'fx_hall', at: 'start' })), hall({ start: { x: 2, y: 1, facing: EAST } })]);
    ok(twice === `map fx_hall names the anchor 'start' twice: its start is one`, `an anchor named twice is refused by name (${twice})`);
    // Another name twice is a literal's, which keeps the last, so only the typecheck can refuse it.
    // @ts-expect-error: an anchor named twice in one literal
    const same: MapDef['anchors'] = { from_cell: { x: 2, y: 1, facing: EAST }, from_cell: { x: 3, y: 1, facing: EAST } };
    ok(Object.keys(same ?? {}).join() === 'from_cell', `any other name twice is the typecheck's to refuse, as the line above holds; the join sees it once (${Object.keys(same ?? {}).join()})`);
    const both = join([cell({ x: 3, y: 1, to: 'fx_hall', at: 'from_cell', tx: 2, ty: 1 }), hall()]);
    ok(both === `exit of fx_cell at 3,1 to fx_hall lands both at 'from_cell' and on a square`, `an exit with both an anchor and a square is refused by name (${both})`);
  }

  // Broken on purpose, each a copy of a real map, kept out of MAP_DEFS.
  const map = (id: string): MapDef => MAP_DEFS.find((d) => d.id === id)!;
  const moveChest = (d: MapDef, id: string, x: number, y: number): MapDef => ({ ...d, features: (d.features ?? []).map((f) => (f.kind === 'chest' && f.id === id ? { ...f, x, y } : f)) });
  const group = (d: MapDef, id: string, change: Partial<EncounterDef>): MapDef => ({ ...d, encounters: (d.encounters ?? []).map((e) => (e.id === id ? { ...e, ...change } : e)) });
  { // The key behind its own lock, which a flood with a key in hand walks straight past.
    const behind = moveChest(map('grove2'), 'g2_key', 8, 8);
    ok(strandedLocks(behind).join() === '7,9', 'grove2 with its key moved behind its lock at 7,9: the lock is left shut');
    const gw1 = moveChest(map('greywater1'), 'gw1_key', 13, 13);
    ok(strandedLocks(gw1).join() === '13,8', 'greywater1 with its key moved behind its lock at 13,8: the lock is left shut');
  }
  { // Two locks and one key before them, the second key behind the first lock: the right door first
    // opens both, the wrong one strands the other.
    const d: MapDef = {
      id: 'orders', name: 'Orders', kind: 'dungeon', start: { x: 1, y: 1, facing: SOUTH },
      rows: ['#######', '#....L#', '#.#####', '#L#...#', '#.#.###', '#.....#', '#######'],
      features: [{ kind: 'chest', x: 1, y: 1, id: 'k1', gold: 0, items: ['key_iron'] }, { kind: 'chest', x: 3, y: 3, id: 'k2', gold: 0, items: ['key_iron'] }],
    };
    ok(strandedLocks(d).join() === '1,3', 'two locks, one key before them and one behind the first: spending the key on the second strands the first');
    const both: MapDef = { ...d, features: [...d.features!, { kind: 'chest', x: 2, y: 1, id: 'k3', gold: 0, items: ['key_iron'] }] };
    ok(!strandedLocks(both).length, 'the same with a second key before them: no order strands a lock');
  }
  { // A locked chest (#857) is a lock the party need not open: a key spent on one before the door it
    // was for strands the door; one past the door, or a second key, strands nothing; a key inside one is
    // not the road's; and a chest is never itself stranded.
    type Chest = Extract<Feature, { kind: 'chest' }>;
    const coffer: Chest = { kind: 'chest', x: 3, y: 1, id: 'c1', gold: 50, items: [], locked: true };
    const fx = (features: Feature[]): MapDef => ({ id: 'coffers', name: 'Coffers', kind: 'dungeon', start: { x: 1, y: 1, facing: SOUTH }, rows: ['#####', '#...#', '##L##', '#...#', '#####'], features });
    const k1: Chest = { kind: 'chest', x: 1, y: 1, id: 'k1', gold: 0, items: ['key_iron'] };
    const before = strandedLocks(fx([k1, coffer]));
    const past = strandedLocks(fx([k1, { ...coffer, y: 3 }]));
    const two = strandedLocks(fx([k1, { ...k1, id: 'k2', x: 2 }, coffer]));
    const inside = strandedLocks(fx([{ ...coffer, items: ['key_iron'] }]));
    const alone = strandedLocks({ ...fx([coffer]), rows: ['#####', '#...#', '#####', '#...#', '#####'] });
    const plain = strandedLocks(fx([k1, { kind: 'chest', x: 3, y: 1, id: 'c1', gold: 50, items: [] }]));
    // Two doors in a row, one key before them and a locked chest of two keys: the key spent on the
    // first door, the chest still shut, strands the second; the chest opened first opens both.
    const rows = ['#######', '#.....#', '###L###', '#.....#', '###L###', '#.....#', '#######'];
    const deep = strandedLocks({ ...fx([{ ...k1, x: 1 }, { ...coffer, items: ['key_iron', 'key_iron'] }]), rows });
    ok(deep.join() === '3,4', `a locked chest's keys count only once it is opened: one key and a chest of two before two doors strand the second (${deep.join() || 'nothing'})`);
    ok(before.join() === '2,2' && !past.length && !two.length && inside.join() === '2,2' && !alone.length && !plain.length,
      `a key spent on a locked chest before its door strands the door (${before.join() || 'nothing'}); the chest past the door (${past.join() || 'nothing'}) or a second key (${two.join() || 'nothing'}) strands nothing; the door's one key inside a locked chest strands it (${inside.join() || 'nothing'}); a locked chest alone (${alone.join() || 'nothing'}) and the chest unlocked (${plain.join() || 'nothing'}) strand nothing`);
  }
  { // A guardian brought back: by its drop, and by its slainText alone.
    const hand = returningGuardians(group(map('grove2'), 'g2_hand', { respawn: 1440 }), items);
    ok(hand.join() === 'g2_hand (drops ashen_chisel)', `grove2's Hand of Ash given a respawn: it drops a quest item, and no quest names it${list(hand)}`);
    const cult = returningGuardians(group(map('mill'), 'm_cult1', { respawn: 1440, slainText: 'The chanting stops.' }), items);
    ok(cult.join() === 'm_cult1 (has a slainText)', `the mill's cultists given a slainText and a respawn${list(cult)}`);
  }
  { // Times to walk that name nothing, or that cannot mean anything.
    const faults = (d: MapDef): string => presenceFaults(d).join();
    ok(faults(group(map('mill'), 'm_rats', { respawn: 1440, until: { slain: 'shelf:road_rats' } })) === 'm_rats until: slain shelf:road_rats', 'an until naming a group that respawns is refused');
    ok(faults(group(map('mill'), 'm_rats', { respawn: 1440, after: { flag: 'no_such_flag' }, until: { slain: 'grove2:no_such_group' } })) === 'm_rats until: slain grove2:no_such_group,m_rats after: flag no_such_flag', 'and one naming nothing real, and an after');
    ok(faults(group(map('mill'), 'm_rats', { respawn: undefined, until: TEAR_CLOSED })) === 'm_rats: until, but it never comes back', 'an until on a group that never comes back is refused');
    ok(faults(group(map('mill'), 'm_rats', { respawn: undefined, until: TEAR_CLOSED, leaves: true })) === '', 'but not on one that leaves on it, standing or not (#747)');
    ok(faults(group(map('mill'), 'm_rats', { when: [{ hours: 'night' }, { sky: 'fog' }] })) === 'm_rats: a sky underground', 'and fog asked of a group underground; night is not');
    const worn = (f: MapDef['features']): string => presenceFaults({ ...map('mill'), features: f }).join();
    ok(worn([{ kind: 'event', x: 1, y: 1, id: 'fx_lamp', text: 'Dark.', until: { flag: 'no_such_flag' } }, { kind: 'npc', x: 1, y: 1, name: 'Alwin, a fixture', lines: ['Hm.'], after: { seen: 'mill:no_such_event' }, when: { sky: 'fog' } }])
      === 'fx_lamp until: flag no_such_flag,Alwin at 1,1 after: seen mill:no_such_event,Alwin at 1,1: a sky underground', "an event's until and a person's after naming nothing real are refused, and a person's fog underground");
    ok(worn([{ kind: 'shrine', x: 1, y: 1, id: 'fx_shrine', text: 'You kneel.', stat: 'luck', done: 'Quiet.', after: { flag: 'no_such_flag' } }, { kind: 'fountain', x: 2, y: 1, id: 'fx_fountain', text: 'You drink.', stat: 'speed', done: 'Dry.' }])
      === 'fx_shrine after: flag no_such_flag', "a shrine's after naming nothing real is refused, as an event's is, and a fountain with no presence passes");
    const camped: MapDef = { ...map('mill'), features: [{ kind: 'camp', x: 1, y: 1, text: 'Ashes.', nights: [{ sets: 'fx_night', after: { flag: 'no_such_flag' } }, { sets: 'fx_late', after: { flag: 'fx_night' } }, { sets: 'fx_free' }] }] };
    ok(presenceFaults(camped, [...MAP_DEFS, camped]).join() === 'camp at 1,1 night fx_night after: flag no_such_flag',
      "a camp's night whose after names nothing real is refused, and one after another night's flag, and one with no after, pass (#730)");
    const tm = map('thornmark');
    ok(riftStillComing(group(tm, 'tm_hounds', { until: undefined })).join() === 'tm_hounds', 'thornmark with tm_hounds coming back past the tear is refused');
    ok(!riftStillComing(group(tm, 'tm_wolves1', { until: undefined })).length, 'and its wolves, no Rift, need no until');
  }
  { // Respawns at the edges of the range and just past them.
    const at = (respawn: number | undefined): string[] => respawnsOutOfRange(group(map('mill'), 'm_rats', { respawn }));
    ok([719, 2881].every((r) => at(r).length === 1), 'a respawn of 719 or 2,881 minutes is out of range');
    ok([0, undefined, 720, 2880].every((r) => !at(r).length), 'none, 720 and 2,880 minutes are in range');
  }
  const why = await Promise.all(loading);
  firsts.forEach((f, i) => ok(!why[i], `${f} loads first in a fresh process, with nothing loaded before it${why[i] ? ' -> ' + why[i] : ''}`));
}
