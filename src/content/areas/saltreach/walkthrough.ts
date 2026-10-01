// Saltreach's walkthrough. Its chapter, The Tide Stone, is #180's, which plays it here; until then,
// the Delta road (C5 and D5, #170) walked: down off Kestrel Edge onto the shore, where the land says
// what it is to a company under its band; the hermit on the islet, who points up the spur; the
// barge under the causeway's arch found from its hint; and the box's groups and its Rift's won at
// its floor. Then the spur to Rietum (C4, #171): the eel-trapper's word on the poleman, the crews'
// hide found from the gap in the herons, Passage Paid answered both ways, and the box's groups won.
// Then west over the fen to Stienwierde (B5, #173): the duckboards to the plinth, empty; the hermit
// who counts the Rifts' lights; the hollow under the landing found from its pole-marks; and the
// box's groups and its two Rifts' won at 11.
import type { Walkthrough } from '../../area.ts';
import { newWalk, walkThrough, fight, listen, see } from '../../../../tools/walk.ts';
import { EAST, NORTH, SOUTH, WEST } from '../../../game/types.ts';
import { MAP_DEFS } from '../../index.ts';
import { meet, answer, heard } from '../../../game/people.ts';
import { questLog } from '../../../game/quests.ts';
import type { Person } from '../../../game/people.ts';

const D5 = MAP_DEFS.find((d) => d.id === 'delta_d5')!;
const C5 = MAP_DEFS.find((d) => d.id === 'delta_c5')!;
const RIFT = MAP_DEFS.find((d) => d.id === 'c5_rift')!;
const C4 = MAP_DEFS.find((d) => d.id === 'delta_c4')!;
const B5 = MAP_DEFS.find((d) => d.id === 'delta_b5')!;
const B5_COUNTER = B5.features!.find((f) => f.kind === 'npc') as Person;
const HERMIT = D5.features!.find((f) => f.kind === 'npc') as Person;
const person = (name: string): Person => C4.features!.find((f) => f.kind === 'npc' && f.name.startsWith(name)) as Person;
const TRAPPER = person('an eel-trapper'), MASTER = person('the master of the barge');
const CREW = C4.encounters!.find((e) => e.id === 'c4_crew')!;

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
  ok(milestone?.kind === 'sign' && milestone.text.includes('SALTMOUTH 4') && milestone.text.includes('RIETUM 5') && D5.rows[milestone.y][milestone.x - 1] === '=', 'the milestone stands by the road: Saltmouth 4, Rietum 5');

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

  // Up the spur from the fork into C4, the Long Water's east bank.
  walkThrough(w, 'delta_c5', 7, 1, NORTH, 'delta_c4', 3);

  // The eel-trapper at the ford heard the Stone's barge go by, and knows the poleman was no river man.
  w.world.travel('delta_c4', TRAPPER.x, TRAPPER.y);
  const told = meet(TRAPPER, w.party, heard(w.world, TRAPPER)).text;
  ok(told.includes('stroke') && told.includes('Hand'), 'the eel-trapper knows the poleman by his stroke: the Hand\'s, not the river\'s');

  // The secret: the one gap in the herons, the hut there, and the crews' hide behind its wall.
  w.world.travel('delta_c4', 4, 14, EAST);
  w.world.eventsHere();
  let hid = false;
  for (let i = 0; i < 20 && !hid; i++) hid = w.world.search();
  const inside = hid ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(hid && inside.every((r) => r.kind === 'moved'), 'searched from the gap in the herons, the hut\'s wall opens, and can be walked into');
  ok(w.world.used('c4_hide'), 'inside, the bargemen\'s hide is found');
  const hide = C4.features!.find((f) => f.kind === 'chest' && f.id === 'c4_hide_chest');
  ok(hide?.kind === 'chest' && hide.items.includes('brine_shard') && hide.items.includes('longsword+1') && hide.x === 6 && hide.y === 14, 'in the hide, a Brine Shard and a Long Sword +1');
  listen(w);

  // Passage Paid: the master on the shoal puts it. Cut loose, the people go ashore and a crew comes
  // up the bank after them; pushed off, the master's word pays the boat's fare from Saltmouth.
  const page = (): string => questLog(w.world.state, w.party).find((v) => v.def.id === 'passage')?.pages[0]?.entries.map((e) => e.text).join(' ') ?? '';
  for (const [label, flag] of [['Push her off.', 'q_passage_owed'], ['Cut them loose.', 'q_passage_freed']] as const) {
    for (const f of ['q_passage', 'q_passage_owed', 'q_passage_freed']) delete w.party.flags[f];
    ok(!w.world.walks(CREW, CREW.x, CREW.y), `before '${label}', no crew on the bank`);
    w.world.travel('delta_c4', MASTER.x, MASTER.y);
    const m = meet(MASTER, w.party, heard(w.world, MASTER)), a = m.choice?.answers.find((x) => x.label === label);
    ok(!!a && page().includes('Hessel'), `the master on the shoal asks, '${label}' is an answer, and the log has his barge (${m.choice?.ask ?? 'no question'})`);
    if (a) answer(a, w.party);
    ok(!!w.party.flags[flag] && !w.world.present(MASTER), `'${label}' sets ${flag}, and the barge is gone off the shoal`);
    ok(w.world.walks(CREW, CREW.x, CREW.y) === (flag === 'q_passage_freed'), `'${label}': a crew comes up the bank ${flag === 'q_passage_freed' ? 'after it' : 'only if they are freed'}`);
  }
  ok(page().includes('waded ashore'), 'the log says the passengers went ashore');

  // The box's groups, each won at its floor: the barge at the bank, the bull toad in the drain, the crew.
  for (const g of C4.encounters!) fight(w, `delta_c4:${g.id}`);

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
};
