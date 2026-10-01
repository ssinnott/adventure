// Saltreach's walkthrough. Its chapter, The Tide Stone, is #180's, which plays it here; until then,
// the Delta road (C5 and D5, #170) walked: down off Kestrel Edge onto the shore, where the land says
// what it is to a company under its band; the hermit on the islet, who points up the spur; the
// barge under the causeway's arch found from its hint; and the box's groups and its Rift's won at
// its floor. Then the spur to Rietum (C4, #171): the eel-trapper's word on the poleman, the crews'
// hide found from the gap in the herons, Passage Paid answered both ways, and the box's groups won.
// Then up the track into Rietum (C3, #172): the Upper Water named at the seam; the quay-hand who saw
// the Stone go by, the step, and the priest's word on a pole's mark; the old smuggler's cache found
// from the clean stone in the quay and reached no other way; the two second prestiges taught off the
// road; and the box's groups won at 10.
// Then west over the fen to Stienwierde (B5, #173): the duckboards to the plinth, empty; the hermit
// who counts the Rifts' lights; the hollow under the landing found from its pole-marks; and the
// box's groups and its two Rifts' won at 11. Then south to the Drowned Temples' approach (B6, #174):
// the priestess at the dry door and her count; the far roof's door found from the count's pause;
// and the box's groups won at 11. Then back to the road and down it into Saltmouth's box (C6, #176):
// the Saltings named at the seam, the land gate at the road's end, the smugglers' stair found from
// the rope that hangs over it, and the quay's and the pans' groups won at the box's floor. Then in
// at the gate to Saltmouth (#177) and out again: the band's gear bought, training to 13 and a first
// prestige taken; the Cartographers' first task taken at the Map Room, the road chained stone to
// stone and the first rank's work done (#181), and the first Meridian journal read there; the Salt
// Compact joined at the Keel (#182) by its run of brandy past the customs house, and its first
// rank's crate; the way down through the Keel's cellar to the stair found from its sawdust; and the
// boat to Wrackholm's landing and back, at the half fare a member pays. Then south into the pans
// (C7, #178): the Scarp across the south and its stair's fallen foot, the sealed pan's hoard found
// from the trodden wall, and the crabs and the toads won at 11.
import type { Walkthrough } from '../../area.ts';
import { newWalk, walkThrough, fight, listen, see } from '../../../../tools/walk.ts';
import { EAST, NORTH, SOUTH, WEST } from '../../../game/types.ts';
import { GameMap } from '../../../game/map.ts';
import type { Feature } from '../../../game/map.ts';
import { buy, item } from '../../../game/items.ts';
import { canTrainAt, xpForLevel, prestigeOf, takePrestige, createCharacter, PRESTIGES } from '../../../game/party.ts';
import { teach } from '../../../game/prestige.ts';
import { questLog } from '../../../game/quests.ts';
import type { QuestView } from '../../../game/quests.ts';
import { sought, seekId } from '../../../game/seeking.ts';
import { take, fareOf } from '../../../game/passage.ts';
import { take as takeWork, report, offered, rankOf, rankName } from '../../../game/guilds.ts';
import { countItem } from '../../../game/party.ts';
import { MINUTES_PER_DAY } from '../../../game/calendar.ts';
import { serialize, deserialize } from '../../../game/save.ts';
import { World } from '../../../game/world.ts';
import { buildMaps } from '../../maps.ts';
import { makeRng } from '../../../lib/engine/rng.ts';
import { ACT_II } from '../../../../tools/tests/ladder.ts';
import { MAP_DEFS, GUILD_QUESTS } from '../../index.ts';
import { meet, heard, answer } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';

const D5 = MAP_DEFS.find((d) => d.id === 'delta_d5')!;
const C5 = MAP_DEFS.find((d) => d.id === 'delta_c5')!;
const RIFT = MAP_DEFS.find((d) => d.id === 'c5_rift')!;
const C4 = MAP_DEFS.find((d) => d.id === 'delta_c4')!;
const B5 = MAP_DEFS.find((d) => d.id === 'delta_b5')!;
const B5_COUNTER = B5.features!.find((f) => f.kind === 'npc') as Person;
const B6 = MAP_DEFS.find((d) => d.id === 'delta_b6')!;
const PRIESTESS = B6.features!.find((f) => f.kind === 'npc') as Person;
const C6 = MAP_DEFS.find((d) => d.id === 'saltings_c6')!;
const C7 = MAP_DEFS.find((d) => d.id === 'saltings_c7')!;
const TOWN = MAP_DEFS.find((d) => d.id === 'saltmouth')!;
const HERMIT = D5.features!.find((f) => f.kind === 'npc') as Person;
const person = (name: string): Person => C4.features!.find((f) => f.kind === 'npc' && f.name.startsWith(name)) as Person;
const TRAPPER = person('an eel-trapper'), MASTER = person('the master of the barge');
const CREW = C4.encounters!.find((e) => e.id === 'c4_crew')!;
const C3 = MAP_DEFS.find((d) => d.id === 'upperwater_c3')!;
const c3person = (name: string): Person => C3.features!.find((f) => f.kind === 'npc' && f.name.includes(name)) as Person;
const QUAYHAND = c3person('quay'), PRIEST = c3person('priest'), SMUGGLER = C3.features!.find((f): f is Person => f.kind === 'npc' && f.teaches?.cls === 'thief')!;

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
  const intoHut = hid ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(hid && intoHut.every((r) => r.kind === 'moved'), 'searched from the gap in the herons, the hut\'s wall opens, and can be walked into');
  ok(w.world.used('c4_hide'), 'inside, the bargemen\'s hide is found');
  const hide = C4.features!.find((f) => f.kind === 'chest' && f.id === 'c4_hide_chest');
  ok(hide?.kind === 'chest' && hide.items.includes('brine_shard') && hide.items.includes('longsword+1') && hide.x === 6 && hide.y === 14, 'in the hide, a Brine Shard and a Long Sword +1');
  listen(w);

  // Passage Paid: the master on the shoal puts it. Cut loose, the people go ashore and a crew comes
  // up the bank after them; pushed off, the master's word pays the boat's fare from Saltmouth.
  // The shoal is reached on foot, from the track, by a company with no swimmer in it at either tide.
  const c4 = new GameMap(C4);
  const onFoot = (tide: 'high' | 'low'): boolean => {
    const seen = new Set([`${C4.start.x},${C4.start.y}`]), q = [[C4.start.x, C4.start.y]];
    while (q.length) {
      const [x, y] = q.shift()!;
      if (x === MASTER.x && y === MASTER.y) return true;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        const p = c4.passable(nx, ny, { tide });
        if (!seen.has(`${nx},${ny}`) && (p === 'ok' || p === 'unlock')) { seen.add(`${nx},${ny}`); q.push([nx, ny]); }
      }
    }
    return false;
  };
  ok(onFoot('high') && onFoot('low'), 'the master on the shoal can be walked to from the way in with no swimmer, at either tide');
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
  // Hessel's word waives the boat's fare out of Saltmouth; the passengers cut loose, it does not.
  const kitto = TOWN.features!.find((f): f is Person => f.kind === 'npc' && !!f.passage?.length)!.passage![0];
  w.party.flags.q_passage_owed = 1;
  const owedFare = fareOf(kitto, w.world);
  const kittoP = TOWN.features!.find((f): f is Person => f.kind === 'npc' && !!f.passage?.length)!;
  const kittoSays = meet(kittoP, w.party, heard(w.world, kittoP)).text;
  delete w.party.flags.q_passage_owed;
  ok(owedFare === 0 && kittoSays.includes('Hessel') && fareOf(kitto, w.world) === kitto.fare, `pushed off, Hessel's word pays the boat's fare to Wrackholm; cut loose, it is ${kitto.fare}`);

  // The box's groups, each won at its floor: the barge at the bank, the bull toad in the drain, the crew.
  for (const g of C4.encounters!) fight(w, `delta_c4:${g.id}`);

  // Up the track out of C4 onto Rietum's fields: the Upper Water, named at the seam.
  w.world.travel('delta_c4', 3, 1, NORTH);
  const upper: string[] = [];
  for (let i = 0; i < 3 && w.world.zone?.id !== 'upperwater_c3'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') upper.push(...r.messages); }
  ok(w.world.zone?.id === 'upperwater_c3' && upper.some((m) => m.includes('The Upper Water')), `the track out of C4 leads into the Upper Water, C3, and the land is named (${upper.join(' | ')})`);
  listen(w);

  // The step: the quay-hand saw the Stone go by, and turns the company west to the plinth.
  w.world.travel('upperwater_c3', QUAYHAND.x, QUAYHAND.y);
  const saw = meet(QUAYHAND, w.party, heard(w.world, QUAYHAND)).text;
  ok(saw.includes('sacking') && saw.includes('west') && !!w.party.flags.c3_saw_stone, `on the quay, the Stone went by glowing in its sacking, and the company is sent west; c3_saw_stone is set (${QUAYHAND.name})`);
  listen(w);
  // The priest reads poles' marks, B5's hint, without naming the plinth's landing.
  const marks = meet(PRIEST, w.party, heard(w.world, PRIEST)).text;
  ok(marks.includes('pole') && !marks.includes('Stienwierde'), `the priest at the sluice knows what a pole's mark says (${PRIEST.name})`);

  // The secret: the clean stone in the quay's face, and the smuggler's old cache behind it, which
  // nothing else reaches: not on foot, not a swimmer, at either tide.
  const c3 = new GameMap(C3);
  const reach = (to: { x: number; y: number }, can: { swim?: boolean; tide: 'high' | 'low' }, secrets: boolean): boolean => {
    const seen = new Set([`${C3.start.x},${C3.start.y}`]), q = [[C3.start.x, C3.start.y]];
    while (q.length) {
      const [x, y] = q.shift()!;
      if (x === to.x && y === to.y) return true;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        if (!c3.inBounds(nx, ny) || seen.has(`${nx},${ny}`) || (!secrets && c3.at(nx, ny).door === 'secret')) continue;
        const p = c3.passable(nx, ny, can);
        if (p === 'ok' || p === 'unlock') { seen.add(`${nx},${ny}`); q.push([nx, ny]); }
      }
    }
    return false;
  };
  const quayCache = C3.features!.find((f) => f.kind === 'chest' && f.id === 'c3_cache_chest')!;
  ok((['high', 'low'] as const).every((tide) => !reach(quayCache, { swim: true, tide }, false) && reach(quayCache, { tide }, true)),
    'the cache under the quay is reached through its secret door and no other way, by a swimmer or at either tide');
  const people = C3.features!.filter((f): f is Person => f.kind === 'npc');
  ok(people.length >= 5 && people.every((f) => (['high', 'low'] as const).every((tide) => reach(f, { tide }, false))), `Rietum's ${people.length} people are each walked to on foot from the way in, with no swimmer, at either tide`);
  w.world.travel('upperwater_c3', 8, 13, EAST);
  w.world.eventsHere();
  let faceOpen = false;
  for (let i = 0; i < 20 && !faceOpen; i++) faceOpen = w.world.search();
  const intoCache = faceOpen ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(faceOpen && intoCache.every((r) => r.kind === 'moved') && w.world.used('c3_cache'), 'searched from the clean stone, the quay\'s face opens on the old smuggler\'s cache');
  ok(quayCache.kind === 'chest' && ['chain+1', 'smugglers_sword', 'stiletto+1', 'tidefolk_robe+1'].every((id) => quayCache.items.includes(id)), `in the cache, the smuggler's mail and sword and the ladder's Stiletto +1 and Tidefolk Robe +1 (${quayCache.kind === 'chest' ? quayCache.items.map((id) => item(id).name).join(', ') : ''})`);
  listen(w);

  // The two second prestiges here, off the road: the old smuggler's Nightjar in the north fields
  // and the Windwalker in Sjonghol. A company has neither until 19, and then each is sent to its
  // trainer, the world map marking the box, and takes it for 4,000 gold.
  const trainers = people.filter((f) => f.teaches);
  ok(trainers.length === 2 && trainers.some((f) => f.teaches!.cls === 'thief' && f.teaches!.prestige === 2) && trainers.some((f) => f.teaches!.cls === 'monk' && f.teaches!.prestige === 2), 'Rietum\'s box teaches the Thief\'s and the Monk\'s second prestiges');
  const road = C3.rows.flatMap((r, y) => [...r].flatMap((ch, x) => (ch === '=' ? [{ x, y }] : [])));
  ok(trainers.every((f) => road.every((r) => Math.abs(r.x - f.x) + Math.abs(r.y - f.y) > 10)), 'each is more than ten squares off the road');
  const later = newWalk(ok).party;
  // The premade six have no monk; one joins for the look ahead.
  if (!later.members.some((c) => c.cls === 'monk')) later.members[later.members.length - 1] = createCharacter('Sjoerd', 'human', 'monk', {}, makeRng(19));
  for (const c of later.members) { c.xp = xpForLevel(19); c.level = 19; if (c.cls === 'thief' || c.cls === 'monk') takePrestige(c); }
  const marked = sought(questLog(w.world.state, later)).filter((p) => p.at === 'upperwater_c3');
  ok(['thief', 'monk'].every((cls) => marked.some((p) => p.who.includes(later.members.find((c) => c.cls === cls)!.name))), `at 19 the thief and the monk are sent to Rietum's box (${marked.map((p) => p.who).join(', ')})`);
  for (const t of trainers) {
    const who = later.members.findIndex((c) => c.cls === t.teaches!.cls);
    later.gold = 4000;
    ok(who >= 0 && (teach(t.teaches!, later, w.world.state, who).taught && prestigeOf(later.members[who]) === 2 && later.gold === 0), `${t.name} makes a ${PRESTIGES[t.teaches!.cls].titles[1]} for 4,000 gold`);
  }
  // The old smuggler knows his sword, and lets it go.
  const before = meet(SMUGGLER, w.party, heard(w.world, SMUGGLER)).text;
  w.party.bag.push('smugglers_sword');
  const after = meet(SMUGGLER, w.party, heard(w.world, SMUGGLER)).text;
  w.party.bag.splice(w.party.bag.indexOf('smugglers_sword'), 1);
  ok(after !== before, `the old smuggler knows his sword in the company's hands (${after.slice(0, 60)}...)`);

  // The box's groups, each won at its floor: the herons, the quay's crew by day, the brinelings at
  // the child's window by night and the bull toad in the drain under the Edge.
  for (const g of C3.encounters!) fight(w, `upperwater_c3:${g.id}`);

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

  // South off Stienwierde over the fen to the temples' roofs.
  walkThrough(w, 'delta_b5', 16, 31, SOUTH, 'delta_b6', 2);

  // The step: the priestess at the dry door, counting.
  w.world.travel('delta_b6', PRIESTESS.x, PRIESTESS.y);
  const number = meet(PRIESTESS, w.party, heard(w.world, PRIESTESS)).text;
  ok(number.toLowerCase().includes('eleven'), 'at the temples\' dry door the priestess says the number');
  see(w, 'delta_b6:b6_door');

  // The secret: the count beside her and its pause, then the far roof's wall searched from its ledge.
  w.world.travel('delta_b6', 17, 12);
  ok(w.world.eventsHere().some((m) => m.includes('ten')), 'beside the priestess, her count of the doors');
  w.world.travel('delta_b6', 8, 22, SOUTH);
  let door = false;
  for (let i = 0; i < 20 && !door; i++) door = w.world.search();
  const porch = door ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(door && porch.every((r) => r.kind === 'moved'), 'searched from the far roof\'s ledge, a door in its wall opens, and can be walked into');
  ok(w.world.used('b6_stair'), 'behind it, the stair down');
  listen(w);

  // The box's groups, each won at its floor.
  for (const g of B6.encounters!) fight(w, `delta_b6:${g.id}`);

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

  // The Salt Compact (#182): the Keel is its hall, and a stranger is offered the run alone. The
  // clerk on C6's quay hands over the cask once the run is taken; the customs house door shows
  // itself only to the cask; the hall takes the cask and the company is a Runner.
  const boat = TOWN.features!.find((f): f is Person => f.kind === 'npc' && !!f.passage?.length)!.passage![0];
  const keel = TOWN.features!.find((f): f is Person => f.kind === 'npc' && f.hall === 'compact');
  ok(keel?.name === 'The Keel' && keel.interior === 'harbour_tavern', 'the Keel, the harbour tavern, is the Salt Compact\'s hall');
  ok(TOWN.features!.some((f) => f.kind === 'npc' && f.x === keel!.x && f.y === keel!.y && !f.interior && f.name.startsWith('Ruan')), 'and Ruan keeps it');
  const work = (): string => offered('compact', w.party).map((q) => q.id).join(', ');
  ok(work() === 'compact_run' && fareOf(boat, w.world) === 150, `a stranger is offered the run alone (${work()}), and pays the boat's whole fare`);
  const run = GUILD_QUESTS.find((q) => q.id === 'compact_run')!;
  takeWork(run, w.world.state, w.party);
  const clerk = C6.features!.find((f): f is Person => f.kind === 'npc' && f.name === 'the warehouse clerk')!;
  w.world.travel('saltings_c6', clerk.x, clerk.y + 1, NORTH);
  const sent = meet(clerk, w.party, heard(w.world, clerk));
  ok(!!sent.choice && sent.text.includes('The Keel sent you'), `the warehouse clerk has the cask for the Keel (${sent.text})`);
  answer(sent.choice!.answers[0], w.party);
  ok(w.party.bag.includes('brandy_cask'), 'and hands it over');
  ok(report('compact', w.world.state, w.party).length === 0, 'the cask carried straight in is not the run: the hall pays nothing yet');
  w.world.travel('saltmouth', 4, 13, WEST);
  const passed = w.world.eventsHere();
  ok(passed.some((t) => t.includes('customs house door stays shut')), `carried the long way, past the customs house door (${passed.join(' ')})`);
  const runPaid = report('compact', w.world.state, w.party);
  ok(rankOf('compact', w.party) === 1 && !w.party.bag.includes('brandy_cask') && runPaid.at(-1) === 'Your rank with the Salt Compact is now Runner.', `the hall takes the cask and the company is a Runner (${runPaid.join(' | ').replace(/\n+/g, ' ')})`);
  ok(questLog(w.world.state, w.party).find((v) => v.def.id === 'compact_run')?.done === true, 'and the log has the run finished');
  ok(fareOf(boat, w.world) === 75, 'a member pays half the boat\'s fare, never more');
  ok(work() === 'compact_crate, compact_lookout', `a Runner is offered the first rank's two (${work()})`);
  // The first rank's crate, walked in the log: taken, the crate opened on C6's quay, reported.
  const crateWork = GUILD_QUESTS.find((q) => q.id === 'compact_crate')!;
  takeWork(crateWork, w.world.state, w.party);
  const goal = (): string => questLog(w.world.state, w.party).find((v) => v.def.id === 'compact_crate')?.goal ?? '';
  ok(goal().includes('Open a crate'), `the log sends the company to the crews' crate (${goal()})`);
  // Opened as the game opens a chest: its gold and the Scale Mail to the party, and spent.
  w.world.travel('saltings_c6', crate!.x, crate!.y);
  ok(crate?.kind === 'chest' && !w.world.used(crate.id), 'the crews\' crate is there to open');
  if (crate?.kind === 'chest') { w.world.markUsed(crate.id); w.party.gold += crate.gold; w.party.bag.push(...crate.items); }
  ok(w.party.bag.includes('scale+1'), 'and in it the Scale Mail +1');
  ok(goal().includes('Report to the Keel'), `opened, the log sends it back to the Keel (${goal()})`);
  ok(report('compact', w.world.state, w.party).length > 0 && questLog(w.world.state, w.party).find((v) => v.def.id === 'compact_crate')?.done === true, 'and the Keel pays for it');

  // The secret way down: the sawdust trodden out along the Keel's end wall, the search, and the
  // cellar's passage out under C6's sea wall, by the rope, the stair's own secret still to find.
  w.world.travel('saltmouth', 14, 5, NORTH);
  ok(w.world.eventsHere().some((t) => t.includes('Sawdust')), 'by the Keel\'s end wall, the sawdust trodden out along its foot');
  let cellar = false;
  for (let i = 0; i < 20 && !cellar; i++) cellar = w.world.search();
  const through = cellar ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(cellar && through.every((r) => r.kind === 'moved') && w.world.zone?.id === 'saltings_c6' && w.world.state.x - w.world.zone.x === 28 && w.world.state.y - w.world.zone.y === 18,
    'searched, the wall opens, and the cellar\'s passage comes out on the sand under C6\'s sea wall, on the rope\'s square');

  // The boat (#164): bought on the quay from Kitto, it sails at eight and lands on Wrackholm's stage
  // at six the next morning; a save made on the isle loads there; and Kitto sells the way back. A
  // member of the Compact pays half each way.
  w.world.travel('saltmouth', 13, 10, WEST);
  w.party.gold = 200;
  const day = Math.floor(w.world.state.minutes / MINUTES_PER_DAY);
  const out = take(boat, w.world, w.party);
  ok(out.taken && w.party.gold === 125 && w.world.zone?.id === 'wrackholm_e6' && w.world.state.x - w.world.zone.x === 16 && w.world.state.y - w.world.zone.y === 15, `the boat from Saltmouth's quay lands the company on Wrackholm's stage for 75 gold, a member's fare (${out.lines.join(' ')})`);
  ok(Math.floor(w.world.state.minutes / MINUTES_PER_DAY) > day && w.world.hour === 6, `and the calendar has moved: it lands at ${w.world.hour}:00 the next day`);
  const saved = deserialize(serialize(w.world.state, w.party, 0));
  const loaded = new World(buildMaps(), saved.party, makeRng(1), saved.world);
  ok(loaded.zone?.id === 'wrackholm_e6' && loaded.state.minutes === w.world.state.minutes, 'a save made on the isle loads there');
  const back = MAP_DEFS.find((d) => d.id === 'wrackholm_e6')!.features!.find((f): f is Person => f.kind === 'npc' && !!f.passage?.length)?.passage?.[0];
  w.party.gold = 75;
  const home = back ? take(back, w.world, w.party) : undefined;
  ok(!!home?.taken && w.world.state.mapId === 'saltmouth' && w.party.gold === 0 && w.world.hour === 6, `and Kitto at the stage sells the way back, onto Saltmouth's quay (${home?.lines.join(' ')})`);

  // South out of Saltmouth's pans into C7's, under the Scarp.
  w.world.travel('saltings_c6', 17, 30, SOUTH);
  for (let i = 0; i < 3 && w.world.zone?.id !== 'saltings_c7'; i++) w.world.move('forward');
  ok(w.world.zone?.id === 'saltings_c7', 'south from Saltmouth\'s box the salt runs on into the pans, C7');
  listen(w);
  const foot = C7.features!.find((f) => f.kind === 'event' && f.id === 'c7_stair');
  ok(foot?.kind === 'event' && C7.rows[foot.y + 1][foot.x] === 'M' && new GameMap(C7).passable(foot.x, foot.y) === 'ok', 'the Scarp stair\'s foot is a notch in the cliff, its lowest flight fallen, walked to and no further');

  // The secret: the one wall trodden, then the search, the crabs' hole and the sealed pan's hoard.
  const hoard = C7.features!.find((f) => f.kind === 'chest' && f.id === 'c7_hoard');
  const shut = new GameMap({ ...C7, rows: C7.rows.map((r) => r.replaceAll('S', '#')) });
  const seen = new Set<string>([`${C7.start.x},${C7.start.y}`]), q = [[C7.start.x, C7.start.y]];
  for (let k = 0; k < q.length; k++) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const x = q[k][0] + dx, y = q[k][1] + dy;
    if (!seen.has(`${x},${y}`) && shut.passable(x, y) === 'ok') { seen.add(`${x},${y}`); q.push([x, y]); }
  }
  ok(hoard?.kind === 'chest' && hoard.items.includes('crabshell_buckler') && !seen.has(`${hoard.x},${hoard.y}`), 'the salter\'s hoard, a Crab-Shell Buckler, lies in a pan no lane or sluice reaches');
  w.world.travel('saltings_c7', 31, 5, WEST);
  w.world.eventsHere();
  let holed = false;
  for (let i = 0; i < 20 && !holed; i++) holed = w.world.search();
  const inside = holed ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(holed && inside.every((r) => r.kind === 'moved'), 'searched by the trodden wall, the crabs\' hole opens under it, and the sealed pan can be walked into');
  listen(w);

  // The box's groups at its floor: the crabs in the pans, the bull toads in the last marsh.
  for (const g of C7.encounters!) fight(w, `saltings_c7:${g.id}`);
};
