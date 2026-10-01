// Saltreach's walkthrough. Its chapter, The Tide Stone, is #180's, which plays it here; until then,
// the Delta road (C5 and D5, #170) walked: down off Kestrel Edge onto the shore, where the land says
// what it is to a company under its band; the hermit on the islet, who points up the spur; the
// barge under the causeway's arch found from its hint; and the box's groups and its Rift's won at
// its floor. Then west over the fen to Stienwierde (B5, #173): the duckboards to the plinth, empty;
// the hermit who counts the Rifts' lights; the hollow under the landing found from its pole-marks;
// and the box's groups and its two Rifts' won at 11. Then back to the road and down it into
// Saltmouth's box (C6, #176): the Saltings named at the seam, the land gate at the road's end, the
// smugglers' stair found from the rope that hangs over it, and the quay's and the pans' groups won
// at the box's floor. Then in at the gate to Saltmouth (#177) and out again: the band's gear
// bought, training to 13 and a first prestige taken; the Cartographers' first task taken at the Map
// Room, the road chained stone to stone and the first rank's work done (#181), and the first
// Meridian journal read there; and the boat to Wrackholm's landing and back.
import type { Walkthrough } from '../../area.ts';
import { newWalk, walkThrough, fight, listen, see } from '../../../../tools/walk.ts';
import { EAST, NORTH, SOUTH, WEST } from '../../../game/types.ts';
import { GameMap } from '../../../game/map.ts';
import type { Feature } from '../../../game/map.ts';
import { buy, item } from '../../../game/items.ts';
import { canTrainAt, xpForLevel, prestigeOf, PRESTIGES } from '../../../game/party.ts';
import { teach } from '../../../game/prestige.ts';
import { questLog } from '../../../game/quests.ts';
import type { QuestView } from '../../../game/quests.ts';
import { sought, seekId } from '../../../game/seeking.ts';
import { take } from '../../../game/passage.ts';
import { take as takeWork, report, offered, rankOf, rankName } from '../../../game/guilds.ts';
import { countItem } from '../../../game/party.ts';
import { MINUTES_PER_DAY } from '../../../game/calendar.ts';
import { serialize, deserialize } from '../../../game/save.ts';
import { World } from '../../../game/world.ts';
import { buildMaps } from '../../maps.ts';
import { makeRng } from '../../../lib/engine/rng.ts';
import { ACT_II } from '../../../../tools/tests/ladder.ts';
import { MAP_DEFS } from '../../index.ts';
import { meet, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';

const D5 = MAP_DEFS.find((d) => d.id === 'delta_d5')!;
const C5 = MAP_DEFS.find((d) => d.id === 'delta_c5')!;
const RIFT = MAP_DEFS.find((d) => d.id === 'c5_rift')!;
const B5 = MAP_DEFS.find((d) => d.id === 'delta_b5')!;
const B5_COUNTER = B5.features!.find((f) => f.kind === 'npc') as Person;
const C6 = MAP_DEFS.find((d) => d.id === 'saltings_c6')!;
const TOWN = MAP_DEFS.find((d) => d.id === 'saltmouth')!;
const HERMIT = D5.features!.find((f) => f.kind === 'npc') as Person;

export const walkthrough: Walkthrough = (ok) => {
  const w = newWalk(ok);

  // Down off the Edge: the Salt Road leaves D4's foot and the shore under it is the Delta's, which
  // tells a company far under its band so, and is never a wall.
  w.world.travel('downs_d4', 1, 30, SOUTH);
  const said: string[] = [];
  for (let i = 0; i < 3 && w.world.zone?.id !== 'delta_d5'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') said.push(...r.messages); }
  ok(w.world.zone?.id === 'delta_d5', 'the Salt Road out of D4 leads onto the shore under the Edge, D5');
  ok(said.some((m) => m.includes('The Delta.') && m.includes('Nothing here would spare you')), `crossing into the Delta at level 1, the land is named and it warns (${said.join(' | ')})`);
  listen(w);
  const milestone = D5.features!.find((f) => f.kind === 'sign');
  ok(milestone?.kind === 'sign' && milestone.text.includes('SALTMOUTH 4') && milestone.text.includes('RIETUM 9') && D5.rows[milestone.y][milestone.x - 1] === '=', 'the milestone stands by the road: Saltmouth 4, Rietum 9');

  w.level = 10;
  // The hermit on the islet saw the barge go by, and sends the company up the spur.
  w.world.travel('delta_d5', HERMIT.x, HERMIT.y);
  const words = meet(HERMIT, w.party, heard(w.world, HERMIT)).text;
  ok(words.includes('Rietum') && words.includes('sacking'), 'the hermit saw the barge go by with a light in its sacking, and sends the company to Rietum');

  // On down the road into C5.
  walkThrough(w, 'delta_d5', 0, 2, WEST, 'delta_c5');

  // The secret: the mast's stump at the arch, then the search, the hollow and the barge's hold.
  w.world.travel('delta_c5', 26, 22, EAST);
  w.world.eventsHere();
  let found = false;
  for (let i = 0; i < 20 && !found; i++) found = w.world.search();
  const into = found ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(found && into.every((r) => r.kind === 'moved'), 'searched from the arch, the hollow under it opens, and can be walked into');
  ok(w.world.used('c5_barge'), 'in the hollow, the drowned barge is found');
  const hold = C5.features!.find((f) => f.kind === 'chest' && f.id === 'c5_barge_hold');
  ok(hold?.kind === 'chest' && hold.items.includes('brine_shard') && hold.x === 28 && hold.y === 22, 'in its straw, a Brine Shard');
  listen(w);

  // The box's groups, each won at its floor: the pools' leeches and eels, the bull toad at the far end.
  for (const g of C5.encounters!) fight(w, `delta_c5:${g.id}`);

  // The Rift on its islet: walked into from its neck, and its groups and its warden won at 10.
  walkThrough(w, 'delta_c5', 20, 13, NORTH, 'c5_rift', 2);
  for (const g of RIFT.encounters!) fight(w, `c5_rift:${g.id}`);

  // West off the Delta road over the fen, onto the duckboards of B5.
  w.level = 11;
  walkThrough(w, 'delta_c5', 0, 13, WEST, 'delta_b5', 2);

  // The step: the plinth on Stienwierde, empty, its socket cut clean.
  see(w, 'delta_b5:b5_plinth');
  ok(w.world.used('b5_plinth'), 'on Stienwierde the plinth stands empty');

  // The hermit on the hummock counts the Rifts' lights.
  w.world.travel('delta_b5', B5_COUNTER.x, B5_COUNTER.y);
  const count = meet(B5_COUNTER, w.party, heard(w.world, B5_COUNTER)).text;
  ok(count.includes('Two') && count.includes('island'), 'the hermit on the hummock counts two lights, and sends the company to the island');

  // The secret: the pole-marks on the landing, then the search, the hollow under it and its cache.
  w.world.travel('delta_b5', 13, 13, SOUTH);
  ok(w.world.eventsHere().some((m) => m.includes('barge-poles')), 'on the plinth\'s landing, the barge-poles\' marks');
  let under = false;
  for (let i = 0; i < 20 && !under; i++) under = w.world.search();
  const down = under ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(under && down.every((r) => r.kind === 'moved'), 'searched from the landing, the hollow under it opens, and can be walked into');
  ok(w.world.used('b5_under'), 'under the landing, what the thieves dropped');
  const cache = B5.features!.find((f) => f.kind === 'chest' && f.id === 'b5_under_cache');
  ok(cache?.kind === 'chest' && cache.items.includes('brine_shard') && cache.items.includes('shield+1'), 'in the hollow, a Brine Shard and a Kite Shield +1');
  listen(w);

  // The box's groups, each won at its floor.
  for (const g of B5.encounters!) fight(w, `delta_b5:${g.id}`);

  // The two Rifts, each walked into from its hummock and won at 11.
  for (const [id, x, y, f] of [['b5_rift_n', 16, 6, NORTH], ['b5_rift_s', 26, 25, SOUTH]] as const) {
    walkThrough(w, 'delta_b5', x, y, f, id, 2);
    for (const g of MAP_DEFS.find((d) => d.id === id)!.encounters!) fight(w, `${id}:${g.id}`);
  }

  // On down the road into Saltmouth's box: the fen gives way to the Saltings at the seam.
  w.world.travel('delta_c5', 26, 30, SOUTH);
  const crossed: string[] = [];
  for (let i = 0; i < 3 && w.world.zone?.id !== 'saltings_c6'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') crossed.push(...r.messages); }
  ok(w.world.zone?.id === 'saltings_c6' && crossed.some((m) => m.includes('The Saltings')), `the Salt Road out of C5 leads into the Saltings, C6, and the land is named (${crossed.join(' | ')})`);
  listen(w);
  const stone = C6.features!.find((f) => f.kind === 'sign');
  ok(stone?.kind === 'sign' && stone.text.includes('SALTMOUTH 2') && stone.text.includes('RIETUM 7') && C6.rows[stone.y][stone.x + 1] === '=', 'the milestone stands by the road: Saltmouth 2, Rietum 7');

  // The road's end is Saltmouth's land gate, open, a step past its event.
  const gate = C6.features!.find((f) => f.kind === 'event' && f.id === 'c6_gate');
  ok(gate?.kind === 'event' && new GameMap(C6).passable(gate.x, gate.y + 1) === 'ok' && !!C6.exits?.some((e) => e.x === gate.x && e.y === gate.y + 1 && e.to === 'saltmouth'), 'the road ends at Saltmouth\'s gate, and the gate is the way in');

  // The quay's crate, the crews' cargo: the Scale Mail.
  const crate = C6.features!.find((f) => f.kind === 'chest' && f.id === 'c6_crate');
  ok(crate?.kind === 'chest' && crate.items.includes('scale+1'), 'on the quay, a crate of the crews\' cargo holds a Scale Mail +1');

  // The secret: the rope over the sea wall's dry end, then the search, the stair and its cache.
  w.world.travel('saltings_c6', 28, 18, SOUTH);
  w.world.eventsHere();
  let opened = false;
  for (let i = 0; i < 20 && !opened; i++) opened = w.world.search();
  const up = opened ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(opened && up.every((r) => r.kind === 'moved'), 'searched under the rope, the sea wall opens, and the stair inside can be walked into');
  ok(w.world.used('c6_stair'), 'inside the wall, the stair up to the barred door and down to the shore');
  const stairCache = C6.features!.find((f) => f.kind === 'chest' && f.id === 'c6_stair_cache');
  ok(stairCache?.kind === 'chest' && C6.rows[stairCache.y][stairCache.x] === '.' && C6.rows[stairCache.y][stairCache.x + 1] === '#', 'at the stair\'s foot, by the barred sea door, the smugglers\' cache');
  listen(w);

  // The box's groups at its floor: the bargemen by day, the Hand's smugglers by night, the crabs.
  for (const g of C6.encounters!) fight(w, `saltings_c6:${g.id}`);

  // Into Saltmouth by the land gate (#177), and out by it again onto the road.
  walkThrough(w, 'saltings_c6', 26, 17, SOUTH, 'saltmouth');
  ok(w.world.state.x === TOWN.start.x && w.world.state.y === TOWN.start.y, 'the gate lets the company in at the head of the town\'s street');
  walkThrough(w, 'saltmouth', 7, 1, NORTH, 'saltings_c6');
  ok(w.world.zone?.id === 'saltings_c6' && w.world.state.x - w.world.zone.x === 26 && w.world.state.y - w.world.zone.y === 18, 'and out again onto the road before the gate');

  // A company of 10 rests, is cured, buys the band's gear, trains to 13 and takes a first prestige.
  const business = <K extends Feature['kind']>(kind: K): Extract<Feature, { kind: K }>[] => TOWN.features!.filter((f): f is Extract<Feature, { kind: K }> => f.kind === kind);
  ok(business('inn').length === 1 && business('temple').length === 1, 'Saltmouth has an inn to rest at and a shrine that cures');
  const armourer = business('shop').find((f) => f.interior === 'saltmouth_armourer')!;
  const rung = ACT_II.find((r) => r.level === 11)!;
  ok(w.party.members.every((m) => rung.classes[m.cls].every((id) => armourer.stock.includes(id))), 'the armourer sells each of the company\'s classes its step at 11');
  w.party.gold = 20000;
  for (const m of w.party.members) for (const id of rung.classes[m.cls]) ok(!!buy(w.party, armourer, id), `${m.name} buys a ${item(id).name} from the armourer`);
  const loft = business('trainer')[0];
  const ottilie = w.party.members.find((m) => m.cls === 'thief')!;
  ottilie.level = 12; ottilie.xp = xpForLevel(13);
  ok(loft.maxLevel === 13 && canTrainAt(ottilie, loft.maxLevel) && (ottilie.level = 13, !canTrainAt(ottilie, loft.maxLevel)), 'the loft trains a member of 12 to 13, and no further');

  // The four first prestiges taught here, each by a person at their trade; Ottilie, at 11, seeks
  // and takes the Thief's.
  const taught = TOWN.features!.flatMap((f) => (f.kind === 'npc' && f.teaches ? [f.teaches] : []));
  ok(['sorcerer', 'thief', 'barbarian', 'monk'].every((c) => taught.some((t) => t.cls === c && t.prestige === 1)) && taught.length === 4, 'Saltmouth teaches the first prestige of the sorcerer, the thief, the barbarian and the monk');
  ottilie.level = 11;
  const seeking = (): QuestView | undefined => questLog(w.world.state, w.party).find((v) => v.def.id === seekId(w.party.members.indexOf(ottilie), 1) && !v.done);
  ok(sought(questLog(w.world.state, w.party)).some((p) => p.at === 'saltmouth' && p.who.includes(ottilie.name)), `at 11, ${ottilie.name} is sent to Saltmouth (${seeking()?.goal})`);
  const locksmith = TOWN.features!.find((f): f is Person => f.kind === 'npc' && f.teaches?.cls === 'thief')!;
  w.party.gold = 1000;
  ok(teach(locksmith.teaches!, w.party, w.world.state, w.party.members.indexOf(ottilie)).taught && prestigeOf(ottilie) === 1 && w.party.gold === 0 && !seeking(), `the locksmith makes a ${PRESTIGES.thief.titles[0]} of ${ottilie.name} for 1,000 gold, and the seeking is done`);

  // The Cartographers' Guild (#181): a stranger takes the first task at the Map Room, chains the
  // Salt Road from the stone under the Edge to the one in the Saltings, and reports; a Chainman is
  // offered the first rank's two quests, and done they make the company Surveyors.
  const room = business('shop').find((f) => f.hall === 'cartographers');
  ok(!!room && room.interior === 'cartographers_room', `the map room is the Cartographers' hall (${room?.name})`);
  const first = offered('cartographers', w.party);
  ok(rankOf('cartographers', w.party) === 0 && first.length === 1 && first[0].id === 'carto_chain', `a stranger is offered the first task alone (${first.map((q) => q.title).join(', ')})`);
  ok(!takeWork(first[0], w.world.state, w.party).length, 'the first task is not paid on taking, though the company walked past both stones on the way in');
  const chain = (): QuestView | undefined => questLog(w.world.state, w.party).find((v) => v.def.id === 'carto_chain');
  ok(/Kestrel Edge/.test(chain()?.goal ?? ''), `the log sends the company back up the road (${chain()?.goal})`);
  see(w, 'delta_d5:d5_milestone');
  ok(/Saltings/.test(chain()?.goal ?? ''), `the chain begins at the stone under the Edge (${chain()?.goal})`);
  see(w, 'saltings_c6:c6_milestone');
  ok(/Map Room/.test(chain()?.goal ?? ''), `and holds to the stone in the Saltings (${chain()?.goal})`);
  const paid = report('cartographers', w.world.state, w.party);
  ok(rankOf('cartographers', w.party) === 1 && paid.at(-1) === `Your rank with the Cartographers' Guild is now ${rankName('cartographers', 1)}.` && !!chain()?.done, `the Map Room pays the chain and makes the company Chainmen (${paid.join(' | ').replace(/\n+/g, ' ')})`);
  const rank1 = offered('cartographers', w.party);
  ok(rank1.length === 2 && rank1.every((q) => q.rank === 1), `a Chainman is offered the first rank's two quests (${rank1.map((q) => q.title).join(', ')})`);
  for (const q of rank1) takeWork(q, w.world.state, w.party);
  see(w, 'delta_b5:b5_west');
  see(w, 'saltings_c6:c6_hut');
  report('cartographers', w.world.state, w.party);
  ok(rankOf('cartographers', w.party) === 2 && rank1.every((q) => questLog(w.world.state, w.party).find((v) => v.def.id === q.id)?.done), `the fen's edge and the west arm found and reported make the company ${rankName('cartographers', 2)}s`);
  // Ysolde reads the first Meridian journal to a company that carries it, and gives it back.
  const ysolde = TOWN.features!.find((f): f is Person => f.kind === 'npc' && f.name.startsWith('Ysolde'))!;
  w.party.bag.push('meridian_journal');
  const reading = meet(ysolde, w.party, heard(w.world, ysolde)).text;
  ok(!!w.party.flags.meridian_read && countItem(w.party, 'meridian_journal') === 1 && /Fane/.test(reading), `Ysolde reads the first Meridian journal and gives it back (${reading.split('\n\n')[1]})`);

  // The boat (#164): bought on the quay from Kitto, it sails at eight and lands on Wrackholm's stage
  // at six the next morning; a save made on the isle loads there; and Kitto sells the way back.
  const boat = TOWN.features!.find((f): f is Person => f.kind === 'npc' && !!f.passage?.length)!.passage![0];
  w.world.travel('saltmouth', 13, 10, WEST);
  w.party.gold = 200;
  const day = Math.floor(w.world.state.minutes / MINUTES_PER_DAY);
  const out = take(boat, w.world, w.party);
  ok(out.taken && w.party.gold === 50 && w.world.zone?.id === 'wrackholm_e6' && w.world.state.x - w.world.zone.x === 16 && w.world.state.y - w.world.zone.y === 15, `the boat from Saltmouth's quay lands the company on Wrackholm's stage for 150 gold (${out.lines.join(' ')})`);
  ok(Math.floor(w.world.state.minutes / MINUTES_PER_DAY) > day && w.world.hour === 6, `and the calendar has moved: it lands at ${w.world.hour}:00 the next day`);
  const saved = deserialize(serialize(w.world.state, w.party, 0));
  const loaded = new World(buildMaps(), saved.party, makeRng(1), saved.world);
  ok(loaded.zone?.id === 'wrackholm_e6' && loaded.state.minutes === w.world.state.minutes, 'a save made on the isle loads there');
  const back = MAP_DEFS.find((d) => d.id === 'wrackholm_e6')!.features!.find((f): f is Person => f.kind === 'npc' && !!f.passage?.length)?.passage?.[0];
  w.party.gold = 150;
  const home = back ? take(back, w.world, w.party) : undefined;
  ok(!!home?.taken && w.world.state.mapId === 'saltmouth' && w.party.gold === 0 && w.world.hour === 6, `and Kitto at the stage sells the way back, onto Saltmouth's quay (${home?.lines.join(' ')})`);
};
