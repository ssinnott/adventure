// Kiln-script (#538; DESIGN §9, #434's call 2), on a fixture hall, since no map places an inscription
// yet: a sign with a second text, said only to a company with a reader, a standing member with
// Linguist, a dwarf, or anyone while an item that reads is carried. Read, it is kept by its id as a
// once-event is, so `seen` names it, through a save and by the shipped list; a reading that marks the
// world map marks its places once read, and says so once. A reading sets no flag and opens no door:
// never the road (EXPANSION §2.2). Then the content, and fixtures broken on purpose: every inscription
// with an id of its own on its map and a reading to say, every mark an atlas place, and no way that
// waits on a reading.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { GameMap } from '../../src/game/map.ts';
import type { MapDef } from '../../src/game/map.ts';
import { World } from '../../src/game/world.ts';
import { defaultParty, addCondition } from '../../src/game/party.ts';
import type { Party } from '../../src/game/party.ts';
import type { ItemDef } from '../../src/game/items.ts';
import type { Atlas } from '../../src/game/atlas.ts';
import type { QuestCond } from '../../src/game/quests.ts';
import { holds } from '../../src/game/quests.ts';
import { serialize, deserialize, SAVE_VERSION } from '../../src/game/save.ts';
import { NORTH } from '../../src/game/types.ts';
import { readerOf, readMarks, signLine, readLine, markLine, isInscription, marksOf, readId } from '../../src/game/inscriptions.ts';
import { ATLAS, MAP_DEFS, ITEMS } from '../../src/content/index.ts';
import { CONTENT, collect, compare } from '../shipped.ts';
import { ok } from './lib.ts';

const STORE = 'Cut over the wall, the dwarves\' words for plenty.', BREATH = 'The dwarves\' words for the mountain\'s breath.';

/** A hall of two rooms, a secret door between them that the first inscription hints at, a second that marks two places, and a plain sign. */
const FIXTURE: MapDef = {
  id: 'fixture_kiln', name: 'Kiln fixture', kind: 'dungeon', start: { x: 1, y: 1, facing: NORTH },
  rows: ['#######', '#.....#', '###S###', '#.....#', '#######'],
  secrets: [{ x: 3, y: 2, hint: 'fx_store' }],
  features: [
    { kind: 'sign', x: 2, y: 1, id: 'fx_store', text: STORE, read: 'STORE.' },
    { kind: 'sign', x: 4, y: 1, id: 'fx_vent', text: BREATH, read: 'VENT. STAND CLEAR.', marks: ['lava_tubes', 'sleepers_bay'] },
    { kind: 'sign', x: 5, y: 1, text: 'A plain sign.' },
  ],
};

const fresh = (setup?: (p: Party) => void, def: MapDef = FIXTURE): { world: World; party: Party } => {
  const rng = makeRng(7), party = defaultParty(rng);
  setup?.(party);
  return { world: new World({ [def.id]: new GameMap(def) }, party, rng), party };
};
/** What stepping onto a square of the fixture says. */
const stand = (world: World, x: number, y: number): string[] => { world.travel(FIXTURE.id, x, y); return world.eventsHere(); };

/**
 * What is wrong with the content's inscriptions: one with nothing to read, one whose id another
 * feature of its map has (its reading would be kept under the other's), a mark that names no atlas
 * place, and a way that waits on a reading (an exit's or a gate's `shut` naming one, which a reading
 * would close). What a reading opens is a hint, the shortcut a hint finds and the marks, never a way.
 */
export function inscriptionFaults(defs: readonly MapDef[], atlas: Atlas = ATLAS): string[] {
  const out: string[] = [], places = new Set(atlas.places.map((p) => p.id)), reads = new Set<string>();
  for (const d of defs) for (const f of d.features ?? []) {
    if (!isInscription(f)) continue;
    reads.add(`${d.id}:${f.id}`);
    const at = `${d.id}: the inscription ${f.id} at ${f.x},${f.y}`;
    if (!f.read.trim()) out.push(`${at} has nothing to read`);
    if ((d.features ?? []).filter((g) => 'id' in g && g.id === f.id).length > 1) out.push(`${at} shares its id with another feature of the map`);
    for (const p of marksOf(f)) if (!places.has(p)) out.push(`${at} marks '${p}', which is no place on the atlas`);
  }
  const named = (w: unknown): string[] => [w ?? []].flat().flatMap((c) => { const s = (c as QuestCond).seen; return s && reads.has(s) ? [s] : []; });
  for (const d of defs) for (const e of [...(d.exits ?? []), ...(d.gates ?? [])]) {
    for (const s of named(e.shut)) out.push(`${d.id}: the way at ${e.x},${e.y} waits on the reading of ${s}`);
  }
  return out;
}

export function inscriptions(): void {
  // Who reads: nobody in the premade six, the elf and the gnome among them.
  {
    const { world, party } = fresh();
    ok(!readerOf(party), 'nobody of the premade six reads Kiln-script: no dwarf, no Linguist, nothing carried that reads');
    const said = stand(world, 2, 1);
    ok(said.join(' / ') === signLine(STORE) && !world.used('fx_store'), `with no reader an inscription is a sign, said and not kept read ("${said.join(' / ')}")`);
  }
  // A dwarf reads free, and only standing.
  {
    const { world, party } = fresh((p) => { p.members[1].race = 'dwarf'; });
    const idris = party.members[1], flags = JSON.stringify(party.flags);
    const said = stand(world, 2, 1);
    ok(readerOf(party) === idris && said.join(' / ') === [signLine(STORE), readLine('Idris', 'STORE.')].join(' / '), `a dwarf reads it, after its words ("${said.join(' / ')}")`);
    ok(world.used('fx_store') && holds({ seen: 'fixture_kiln:fx_store' }, world.state, party), 'and it is kept read by its id, which a quest condition\'s seen names');
    // Never the road: a reading sets no flag, opens no door and moves nobody, and its secret door stays to be found.
    ok(JSON.stringify(party.flags) === flags && !Object.keys(world.mapState.doors).length && world.map.at(3, 2).door === 'secret' && world.state.x === 2 && world.state.y === 1,
      'a reading sets no flag, changes no door and moves nobody: the door it hints at is found by a search, as any is');
    addCondition(idris, 'unconscious');
    ok(!readerOf(party) && stand(world, 2, 1).length === 1, 'a dwarf knocked down reads nothing');
  }
  // A member with Linguist reads, the first in the company who has it.
  {
    const { world, party } = fresh((p) => { p.members[4].skills = ['linguist']; });
    const said = stand(world, 2, 1);
    ok(readerOf(party) === party.members[4] && said[1] === readLine('Maren', 'STORE.'), `a member with Linguist reads it ("${said[1]}")`);
  }
  // An item that reads (#56's 34's copybook, built with #471): carried in the bag, the first standing
  // member reads by it; in a pack, its carrier does; put down, nobody.
  {
    const book: ItemDef = { id: 'fx_copybook', name: 'A Copybook', slot: 'none', price: 0, skill: 'linguist' };
    (ITEMS as Record<string, ItemDef>)[book.id] = book;
    try {
      const { world, party } = fresh((p) => { p.bag.push(book.id); });
      ok(readerOf(party) === party.members[0] && stand(world, 2, 1)[1] === readLine('Bram', 'STORE.'), 'with the copybook in the bag the first standing member reads by it');
      party.bag.splice(party.bag.indexOf(book.id), 1); party.members[2].pack.push(book.id);
      ok(readerOf(party) === party.members[2], 'in a member\'s pack, its carrier reads');
      party.members[2].pack.pop();
      ok(!readerOf(party), 'and put down, nobody does');
    } finally { delete (ITEMS as Record<string, ItemDef>)[book.id]; }
  }
  // The marks: none before the reading; read, its two places, said once; a plain sign is kept by nothing.
  {
    const { world, party } = fresh((p) => { p.members[1].race = 'dwarf'; });
    ok(!readMarks(world).length, 'nothing is marked before a reading');
    const first = stand(world, 4, 1), again = stand(world, 4, 1);
    const marks = readMarks(world);
    ok(first.join(' / ') === [signLine(BREATH), readLine('Idris', 'VENT. STAND CLEAR.'), markLine('Idris')].join(' / ') && again.length === 2,
      `read, an inscription that marks says so the first time and not again ("${first.slice(1).join(' / ')}")`);
    ok(marks.join() === 'lava_tubes,sleepers_bay', `and the world map marks its places (${marks.join(', ')})`);
    const kept = Object.keys(world.mapState.used).join();
    ok(stand(world, 5, 1).length === 1 && readId(FIXTURE.features![2]) === undefined && Object.keys(world.mapState.used).join() === kept, 'a plain sign is said and kept by nothing, reader or none');
    // Through a save: the reading kept, the marks with it.
    const data = deserialize(serialize(world.state, party, 0));
    const loaded = new World({ fixture_kiln: new GameMap(FIXTURE) }, data.party, makeRng(1), data.world);
    ok(loaded.used('fx_vent') && readMarks(loaded).join() === marks.join(), 'a save keeps the reading and the marks it made');
  }
  // The shipped list keeps an inscription's reading as a map's, as an opened chest's, and catches it renamed.
  {
    const got = collect({ ...CONTENT, defs: [FIXTURE] }), used = got.maps.fixture_kiln?.used ?? [];
    ok(used.join() === 'fx_store,fx_vent', `the shipped list keeps each inscription's id among its map's (${used.join(', ')})`);
    const renamed = collect({ ...CONTENT, defs: [{ ...FIXTURE, features: FIXTURE.features!.map((f) => (isInscription(f) && f.id === 'fx_vent' ? { ...f, id: 'fx_vent2' } : f)) }] });
    ok(compare({ version: SAVE_VERSION, ...got }, renamed).problems.some((p) => p.includes('fx_vent is gone')), 'and one renamed is caught');
  }

  // The content: every inscription sound, every mark a place, no way waiting on a reading.
  {
    const found = MAP_DEFS.flatMap((d) => (d.features ?? []).filter(isInscription));
    const faults = inscriptionFaults(MAP_DEFS);
    ok(!faults.length, `the content's ${found.length} inscription(s) each have an id of their own, a reading and marks that name atlas places, and no way waits on a reading${faults.length ? ' -> ' + faults.join('; ') : ''}`);
    const broken = (extra: Partial<MapDef>): string[] => inscriptionFaults([{ ...FIXTURE, ...extra }]);
    const sign = FIXTURE.features![0];
    ok(!inscriptionFaults([FIXTURE]).length, 'the fixture is sound');
    ok(broken({ features: [{ kind: 'sign', x: 2, y: 1, id: 'fx_store', text: STORE, read: ' ' }] }).length === 1, 'an inscription with nothing to read fails');
    ok(broken({ features: [sign, { kind: 'event', x: 4, y: 1, id: 'fx_store', text: 'A draught.' }] }).length === 1, 'and one whose id another feature has');
    ok(broken({ features: [{ kind: 'sign', x: 2, y: 1, id: 'fx_store', text: STORE, read: 'STORE.', marks: 'nowhere' }] }).length === 1, 'and a mark that names no atlas place');
    ok(broken({ exits: [{ x: 5, y: 3, to: 'fixture_kiln', tx: 1, ty: 1, shut: { seen: 'fixture_kiln:fx_store' } }] }).length === 1, 'and a way that waits on a reading');
  }
}
