// The Kilns' walkthrough. Its chapter, The Anvil Stone, is #470's, which plays it here; until then,
// the Iron Fells walked. The way in (M3, #457): the east road out of Lanternwood's M2 over the ridge,
// the crossing line read by a company two under the Fells' floor and by one at it, the secret behind
// the walled adit found from its hints, the box's groups won at its floor, and Lanternwood's trees
// shut against L3, so the road is the only way between the two areas. Anvilhall's box (N3, #458): the
// trail on over the line from M3 with nothing said, the spur up to the gate, five on from M3's
// milestone; the box's groups won at its floor; the mother at the terrace well; and the tithe-cellar
// found from the ruts, the niche over its wall read by a reader alone. Then Anvilhall (#459), in at
// N3's gate and out again: a company rests, buys the act's first step at the forge and trains to 19;
// hears the Lantern reader read the verse the old way, or reads it first with a reader of its own and
// hears him read it after; learns Linguist of him as a Lantern; and puts the thane's choice both
// ways, the Stone barred to a company short of its price and each way setting its flag and changing
// the words after; taken, the forge shuts for good. The Tiefzeche's box (N4, #461), the heart's
// first: the trail on over the line from N3 into new land, named, and harder to a company under its
// floor; the spur to the shaft and the cage's gate on it; the drove road out south; the box's groups
// won at its floor; the miner at the camp; and the wagon yard found from the tally board and the
// fresh mortar, the blessing over the shaft read by a reader alone. Then the Tiefzeche (#462), down
// the shaft by the cage and up again: the workings, their three doors sung and the crust on its
// ledge, the hewer at the face and the groups won, the niche read by a reader alone and the ladder's
// hatch found from the candles; the old workings, the cages and what the cargo left, the overseers by
// night and the second ladder; the bottom, where the pick marks stop, the knockers won, the side room
// found from their tracks, the Foreman won and the door marked CREW ONLY, which stays shut. The
// stairs join the three levels with no hatch found and no reading, and no machine stands above them.
// Gluthutte's box (N5, #463): the drove road on from N4, harder to a company under its floor of 17;
// the smelter, the verse over its mouth read by a reader alone, the master smith with his crown and
// the Compact's factor; the box's groups won at its floor; the cutters' track east for the Stone; the
// drove road out south; and the shard store found from the slag heap's laid face. The Anvil Stone's
// box (O5, #464): the cutters' track on from N5 with nothing said, up past the tear, shut until the
// Rift is built, to the Stone; the box's groups won at its floor, no Guard among them; the plinth's
// words read by a reader alone; the foreman at his shed and his hammer in it; the hollow under the
// anvil-rock's lip found from the cut that stops half way; and the thane's choice seen at the
// Stone, the saws off it once it is bought and his iron on the approach once it is taken. The roads
// south and west (N6 and M6, #467): the drove road on from N5 with nothing said, and out for
// Cairnmoor past the moor's border; the milestone at the fork, counted along the roads; the drover
// at the camp; the boxes' groups won at their floor; the coach's old halt found from the worn
// verge; the branch over the line into Kilnmouth, named, and harder to a company under its floor,
// out to the west edge before Kilnhaven's gate; the farmer at his gate; and the drover's cache
// found from the stopped kiln. Erzkamm (N2,
// #460): up the open fell out of N3 with nothing said, the box's groups won at its floor, the scholar
// at the wall, and the doors behind the blank face found from the worn floor, the wall beside it read
// by a reader alone; last, the Barbarian's second prestige, taught by Hartmut at the cave's mouth
// (#19): his lesson after his own words, and taught at 19.
import type { Walkthrough } from '../../area.ts';
import { newWalk, walkThrough, see, fight, listen } from '../../../../tools/walk.ts';
import type { Walk } from '../../../../tools/walk.ts';
import { EAST, NORTH, SOUTH, WEST } from '../../../game/types.ts';
import { MAP_DEFS, MONSTERS } from '../../index.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { GameMap } from '../../../game/map.ts';
import type { Feature, MapDef, MapZone } from '../../../game/map.ts';
import { LOCKS } from '../../locks.ts';
import { meet, heard, answer, barred, SHORT } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { buy, item } from '../../../game/items.ts';
import { canTrainAt, xpForLevel, rest, trainPrice, levelUp, createCharacter, className, prestigeOf, takePrestige, PRESTIGES } from '../../../game/party.ts';
import { teach } from '../../../game/prestige.ts';
import { sought, seekId } from '../../../game/seeking.ts';
import { questLog } from '../../../game/quests.ts';
import { makeRng } from '../../../lib/engine/rng.ts';
import { mayLearn, learn, hasSkill } from '../../../game/skills.ts';
import { rankFlag } from '../../guilds.ts';
import { readLine } from '../../../game/inscriptions.ts';
import { ACT_III } from '../../../../tools/tests/ladder.ts';
import { FORGE, ANVIL_STONE_PRICE } from './items.ts';
import { GATE } from './maps/ironfells_n3.ts';
import { VERSE_READ, BOUGHT, TAKEN } from './maps/anvilhall.ts';
import { MOUTH } from './maps/kilnsheart_n4.ts';
import { TEAR } from './maps/kilnsheart_o5.ts';

const M3 = MAP_DEFS.find((d) => d.id === 'ironfells_m3')!, N3 = MAP_DEFS.find((d) => d.id === 'ironfells_n3')!, N4 = MAP_DEFS.find((d) => d.id === 'kilnsheart_n4')!;
const N2 = MAP_DEFS.find((d) => d.id === 'ironfells_n2')!;
const WOODCUTTER = M3.features!.find((f) => f.kind === 'npc' && f.name === 'A woodcutter') as Person;
const MOTHER = N3.features!.find((f) => f.kind === 'npc' && f.name === 'A dwarf woman at the well') as Person;
const MINER = N4.features!.find((f) => f.kind === 'npc' && f.name === 'A miner') as Person;
const N5 = MAP_DEFS.find((d) => d.id === 'kilnsheart_n5')!;
const SMITH = N5.features!.find((f) => f.kind === 'npc' && f.name.startsWith('Eckhart')) as Person;
const FACTOR = N5.features!.find((f) => f.kind === 'npc' && f.name.startsWith('Kerensa')) as Person;
const O5 = MAP_DEFS.find((d) => d.id === 'kilnsheart_o5')!;
const FOREMAN = O5.features!.find((f) => f.kind === 'npc' && f.name.startsWith('Reinhart')) as Person;
const SCHOLAR = N2.features!.find((f) => f.kind === 'npc' && f.name === 'A scholar at the wall') as Person;
const HARTMUT = N2.features!.find((f) => f.kind === 'npc' && f.name.startsWith('Hartmut')) as Person;
const N6 = MAP_DEFS.find((d) => d.id === 'kilnsheart_n6')!, M6 = MAP_DEFS.find((d) => d.id === 'kilnmouth_m6')!;
const DROVER = N6.features!.find((f) => f.kind === 'npc' && f.name === 'A drover') as Person;
const FARMER = M6.features!.find((f) => f.kind === 'npc' && f.name.startsWith('A farmer')) as Person;
const CROSSING = 'The Iron Fells. Pine, and the ground going up. Somewhere ahead something is being hammered, and has been all day.';
const TOWN = MAP_DEFS.find((d) => d.id === 'anvilhall')!;
const person = (name: string): Person => TOWN.features!.find((f) => f.kind === 'npc' && f.name.startsWith(name)) as Person;
const THANE = person('Thane Wolfram'), CRANE = person('Wystan Crane'), GERDA = person('Gerda'), KONRAD = person('Konrad');
const business = <K extends Feature['kind']>(kind: K): Extract<Feature, { kind: K }>[] => TOWN.features!.filter((f): f is Extract<Feature, { kind: K }> => f.kind === kind);
const FORGE_SHOP = business('shop').find((f) => f.interior === 'anvilhall_forge')!;
/** What a person says to a walk's company now, met as the game meets them. */
const says = (w: Walk, p: Person): string => meet(p, w.party, heard(w.world, p)).text;

export const walkthrough: Walkthrough = (ok) => {
  const w = newWalk(ok);
  const out = buildMaps()[OUTDOORS], m3 = out.zones.find((z) => z.id === 'ironfells_m3')!;

  // The crossing: down M2's road over the ridge and into the Fells. Two levels under the floor the
  // land is harder than the road behind; at the floor the line names it and nothing more.
  const cross = (level: number): string[] => {
    for (const m of w.party.members) m.level = level;
    w.world.travel('lanternwood_m2', 1, 29, SOUTH);
    const said: string[] = [];
    for (let i = 0; i < 3; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') said.push(...r.messages); }
    ok(w.world.zone?.id === 'ironfells_m3', `three steps down M2's road cross the ridge into M3 at ${level}`);
    return said;
  };
  const early = cross(14), due = cross(16);
  ok(early.includes(`${CROSSING} The land here is harder than the road behind.`), `a company of 14 is told the Fells are harder than the road behind (${early.join(' / ')})`);
  ok(due.includes(CROSSING) && !due.some((m) => m.includes('harder')), `a company of 16 hears the Fells named, and no warning (${due.join(' / ')})`);
  listen(w);
  w.level = 16;

  // The trail runs on out of the east edge into N3 (#458).
  ok(out.at(m3.x + 31, m3.y + 27).ch === '=' && out.at(m3.x + 31, m3.y + 28).ch === '=' && out.zoneAt(m3.x + 32, m3.y + 27)?.id === 'ironfells_n3' && out.at(m3.x + 32, m3.y + 27).ch === '=',
    'the trail leaves M3 by its east edge and runs on into N3');

  // The woodcutter at the camp, with his word on what the dwarves sell.
  w.world.travel('ironfells_m3', WOODCUTTER.x, WOODCUTTER.y);
  const said = meet(WOODCUTTER, w.party, heard(w.world, WOODCUTTER)).text;
  ok(said.includes('down the road by night'), 'the woodcutter says the dwarves sell something in little boxes, and it goes down the road by night');

  // The box's groups, each won at its floor: the beetles on the spoil and the worm in the adit's cut.
  for (const g of M3.encounters!) fight(w, `ironfells_m3:${g.id}`);

  // The secret: the ruts off the road and the swept foot of the wall, then the search there and the
  // Hand's stage behind it. Walked, waded, climbed or floated, the stage is never reached but
  // through the wall.
  const shut = (z: MapZone, from: [number, number], door: [number, number], prize: [number, number]): { size: number; reached: boolean } => {
    const seen = new Set<number>(), todo = [[z.x + from[0], z.y + from[1]]];
    while (todo.length) {
      const [x, y] = todo.pop()!, k = y * out.width + x;
      if (seen.has(k) || (x === z.x + door[0] && y === z.y + door[1]) || !(x >= z.x && x < z.x + z.w && y >= z.y && y < z.y + z.h) || out.passable(x, y, { swim: true, climb: true, float: true }) !== 'ok') continue;
      seen.add(k);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
    }
    return { size: seen.size, reached: seen.has((z.y + prize[1]) * out.width + z.x + prize[0]) };
  };
  const stage = shut(m3, [23, 28], [23, 29], [23, 30]);
  ok(stage.size > 400 && !stage.reached, `the stage is shut but for the wall: none of M3's ${stage.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'ironfells_m3:m3_ruts');
  see(w, 'ironfells_m3:m3_needles');
  w.world.travel('ironfells_m3', 23, 28, SOUTH);
  let found = false;
  for (let i = 0; i < 20 && !found; i++) found = w.world.search();
  const into = found ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(found && into.every((r) => r.kind === 'moved') && w.world.used('m3_stage'), 'searched at the swept foot of the wall, it gives, and the stage behind it can be walked into');
  listen(w);
  const box = M3.features!.find((f) => f.kind === 'chest' && f.id === 'm3_stage_chest');
  ok(box?.kind === 'chest' && box.items.includes('drovers_goad') && box.x === 22 && box.y === 30, 'beside the cage-wagon, the drover\'s box with his goad in it');

  // Lanternwood's trees: from the road, walking or wading, L3 beside M3 is never reached.
  const l3 = out.zones.find((z) => z.id === 'lanternwood_l3')!;
  const inside = (x: number, y: number, z: typeof m3): boolean => x >= z.x && x < z.x + z.w && y >= z.y && y < z.y + z.h;
  const walked = new Set<number>(), stack = [[m3.x + 18, m3.y + 14]];
  let crossed = false;
  while (stack.length) {
    const [x, y] = stack.pop()!, k = y * out.width + x;
    if (walked.has(k) || !(inside(x, y, m3) || inside(x, y, l3)) || out.passable(x, y, { swim: true }) !== 'ok') continue;
    walked.add(k);
    if (inside(x, y, l3)) crossed = true;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) stack.push([x + dx, y + dy]);
  }
  ok(walked.size > 400 && !crossed, `Lanternwood's trees shut M3 from L3: none of its ${walked.size} squares walked leads into it`);

  // Anvilhall's box (N3, #458). On along the trail over the line from M3: the same land at the same
  // floor, so the log names nothing and warns of nothing.
  const n3 = out.zones.find((z) => z.id === 'ironfells_n3')!;
  w.world.travel('ironfells_m3', 29, 27, EAST);
  const over: string[] = [];
  for (let i = 0; i < 4 && w.world.zone?.id !== 'ironfells_n3'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') over.push(...r.messages); }
  ok(w.world.zone?.id === 'ironfells_n3' && !over.some((m) => /Iron Fells|harder|spare you/.test(m)), `the trail crosses from M3 into N3 with nothing said of the land (${over.join(' / ') || 'nothing'})`);

  // The spur: road from the trail all the way to the forecourt under the crag, where the gate is the
  // way into Anvilhall (#459). From M3's milestone the walk to it is about five at 13 squares to the
  // unit, as the stone says.
  const steps = (fx: number, fy: number, ok2: (x: number, y: number) => boolean): Map<number, number> => {
    const d = new Map([[fy * out.width + fx, 0]]), q = [[fx, fy]];
    for (let i = 0; i < q.length; i++) {
      const [x, y] = q[i], n = d.get(y * out.width + x)!;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = (y + dy) * out.width + x + dx; if (!d.has(k) && ok2(x + dx, y + dy)) { d.set(k, n + 1); q.push([x + dx, y + dy]); } }
    }
    return d;
  };
  const front = (n3.y + GATE.y + 1) * out.width + n3.x + GATE.x;
  const spur = steps(n3.x, n3.y + 27, (x, y) => out.at(x, y).ch === '=' && x >= n3.x && x < n3.x + n3.w && y >= n3.y && y < n3.y + n3.h).get(front);
  ok(spur === 46 && !!N3.exits?.includes(GATE) && GATE.to === 'anvilhall' && out.at(n3.x + GATE.x, n3.y + GATE.y).door === 'door',
    `the spur runs ${spur} squares of road from the trail to the forecourt, and the gate before it is a door, the way into Anvilhall`);
  // Counted along the trails, as the stones are: from the road beside the stone, on the road.
  const stone = M3.features!.find((f) => f.kind === 'event' && f.id === 'm3_milestone')!;
  const [sx, sy] = [m3.x + stone.x, m3.y + stone.y], beside = [...steps(sx, sy, (x, y) => out.passable(x, y) === 'ok')].filter(([k]) => out.at(k % out.width, Math.floor(k / out.width)).ch === '=').sort((a, b) => a[1] - b[1])[0];
  const miles = beside[1] + (steps(beside[0] % out.width, Math.floor(beside[0] / out.width), (x, y) => out.at(x, y).ch === '=').get(front) ?? Infinity);
  ok(Math.round(miles / 13) === 5 && stone.kind === 'event' && /ANVILHALL 5/.test(stone.text), `M3's milestone says ANVILHALL 5, and the gate is ${miles} squares on along the trail and the spur`);

  // The box's groups, each won at its floor: the slaglings on the trail by night, the beetles and
  // salamanders on the two heaps of spoil and the worm in the collapsed working.
  for (const g of N3.encounters!) fight(w, `ironfells_n3:${g.id}`);

  // The mother at the terrace well (#56's 33).
  w.world.travel('ironfells_n3', MOTHER.x, MOTHER.y);
  const told = meet(MOTHER, w.party, heard(w.world, MOTHER)).text;
  ok(told.includes('crust') && told.includes('will not come up'), 'the dwarf woman at the terrace well says her son took the crust down and will not come up');

  // The secret: the ruts along the terrace wall's foot to where no door is, the niche over the wall
  // (the dwarves' words for plenty to a company with no reader; STORE to one with), the search there
  // and the tithe-cellar behind. Walked, waded, climbed or floated, it is never reached but through the wall.
  const cellar = shut(n3, [28, 21], [29, 20], [29, 19]);
  ok(cellar.size > 600 && !cellar.reached, `the tithe-cellar is shut but for the wall: none of N3's ${cellar.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'ironfells_n3:n3_ruts');
  w.world.travel('ironfells_n3', 29, 21, NORTH);
  const plain = w.world.eventsHere();
  ok(plain.some((t) => t.includes('the dwarves\' words for plenty')) && !plain.some((t) => t.includes('STORE')) && !w.world.used('n3_niche'), `with no reader the niche over the wall is the dwarves' words and no more (${plain.join(' / ')})`);
  w.party.members[4].skills = ['linguist'];
  const read = w.world.eventsHere();
  ok(read.includes('Maren reads: "STORE."') && w.world.used('n3_niche'), `Maren, taught Linguist, reads it the old way, and it is kept read (${read.join(' / ')})`);
  w.party.members[4].skills = [];
  let opened = false;
  for (let i = 0; i < 20 && !opened; i++) opened = w.world.search();
  const under = opened ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(opened && under.every((r) => r.kind === 'moved') && w.world.used('n3_cellar'), 'searched under the niche, the terrace wall gives, and the tithe-cellar behind it can be walked into');
  listen(w);
  const crate = N3.features!.find((f) => f.kind === 'chest' && f.id === 'n3_cellar_chest');
  ok(crate?.kind === 'chest' && crate.items.includes('anvil_shard') && crate.items.includes('plate+3') && crate.x === 30 && crate.y === 18, 'in the cellar, a boxed piece of the Stone, the Anvil Shard, and a Plate Mail +3');

  // The Tiefzeche's box (N4, #461), the heart's first. On down the trail over the line from N3 into
  // new land: the log names it, and to a company two under its floor says the land is harder.
  const n4 = out.zones.find((z) => z.id === 'kilnsheart_n4')!;
  const down = (level: number): string[] => {
    for (const m of w.party.members) m.level = level;
    w.world.travel('ironfells_n3', 4, 29, SOUTH);
    const said: string[] = [];
    for (let i = 0; i < 4 && w.world.zone?.id !== 'kilnsheart_n4'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') said.push(...r.messages); }
    ok(w.world.zone?.id === 'kilnsheart_n4', `the trail crosses from N3 into N4 at ${level}`);
    return said;
  };
  const under14 = down(14), at16 = down(16);
  ok(under14.includes('The Kilns. The land here is harder than the road behind.'), `a company of 14 hears the Kilns named, and that the land is harder than the road behind (${under14.join(' / ')})`);
  ok(at16.includes('The Kilns.') && !at16.some((m) => m.includes('harder')), `a company of 16 hears the Kilns named, and no warning (${at16.join(' / ')})`);
  ok(out.at(n4.x + 20, n4.y + 31).ch === '=' && out.zoneAt(n4.x + 20, n4.y + 32)?.id === 'kilnsheart_n5' && out.at(n4.x + 20, n4.y + 32).ch === '=', 'the drove road leaves N4 by its south edge and runs on into N5');

  // The spur off the trail to the headworks, and the shaft at its end: the cage's gate, the way into
  // the Tiefzeche (#462), walked in `tiefzeche` below.
  const inN4 = (x: number, y: number): boolean => x >= n4.x && x < n4.x + n4.w && y >= n4.y && y < n4.y + n4.h;
  const toShaft = steps(n4.x + 6, n4.y + 2, (x, y) => out.at(x, y).ch === '=' && inN4(x, y)).get((n4.y + MOUTH.y) * out.width + n4.x + MOUTH.x - 1);
  ok(toShaft === 9 && out.at(n4.x + MOUTH.x, n4.y + MOUTH.y).door === 'door' && !!N4.exits?.includes(MOUTH) && MOUTH.to === 'deep_mines',
    `the spur runs ${toShaft} squares of road from the trail to the shaft, and the cage's gate on it is a door, the way into the Tiefzeche`);
  see(w, 'kilnsheart_n4:n4_mouth');
  w.world.travel('kilnsheart_n4', MOUTH.x - 1, MOUTH.y, EAST);
  ok(!w.world.eventsHere().length, 'at the spur\'s end, before the cage\'s gate, nothing more is said: the cage is no longer chained');

  // The box's groups, each won at its floor: the beetles and salamanders on the fresh spoil and the
  // worms in the old workings' open cuts.
  for (const g of N4.encounters!) fight(w, `kilnsheart_n4:${g.id}`);

  // The miner at the camp, on the verses sung going down.
  w.world.travel('kilnsheart_n4', MINER.x, MINER.y);
  const sung = meet(MINER, w.party, heard(w.world, MINER)).text;
  ok(sung.includes('A verse at every door') && sung.includes('nobody sings'), 'the miner at the camp says a verse is sung at every door going down, and nobody sings coming up');

  // The secret: the tally board's loads down and none up, the blessing over the shaft (words to a
  // company with no reader; COUNT ALL DOWN. COUNT ALL UP. to one with), the fresh mortar in the yard
  // wall, the search there and the wagon yard behind. Walked, waded, climbed or floated, the yard is
  // never reached but through the wall.
  const yard = shut(n4, [16, 5], [17, 5], [19, 5]);
  ok(yard.size > 600 && !yard.reached, `the wagon yard is shut but for the wall: none of N4's ${yard.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'kilnsheart_n4:n4_tally');
  w.world.travel('kilnsheart_n4', 16, 3, NORTH);
  const bare = w.world.eventsHere();
  ok(bare.some((t) => t.includes('the miners\' blessing')) && !bare.some((t) => t.includes('COUNT')) && !w.world.used('n4_blessing'), `with no reader the blessing over the shaft is words and no more (${bare.join(' / ')})`);
  w.party.members[4].skills = ['linguist'];
  const counted = w.world.eventsHere();
  ok(counted.includes('Maren reads: "COUNT ALL DOWN. COUNT ALL UP."') && w.world.used('n4_blessing'), `Maren, taught Linguist, reads it the old way, and it is kept read (${counted.join(' / ')})`);
  w.party.members[4].skills = [];
  see(w, 'kilnsheart_n4:n4_mortar');
  w.world.travel('kilnsheart_n4', 16, 5, EAST);
  let gave = false;
  for (let i = 0; i < 20 && !gave; i++) gave = w.world.search();
  const inYard = gave ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(gave && inYard.every((r) => r.kind === 'moved') && w.world.used('n4_yard'), 'searched at the fresh mortar, the yard wall gives, and the wagon yard behind it can be walked into');
  listen(w);
  const strongbox = N4.features!.find((f) => f.kind === 'chest' && f.id === 'n4_yard_chest');
  ok(strongbox?.kind === 'chest' && strongbox.items.includes('sharkskin+2') && strongbox.x === 20 && strongbox.y === 5, 'among the cages, a Sharkskin Coat +2 the cargo left');


  // Gluthutte's box (N5, #463). On down the drove road over the line from N4: the same land, but its
  // floor is 17, so a company of 16 hears the land is harder and one of 17 hears nothing.
  const n5 = out.zones.find((z) => z.id === 'kilnsheart_n5')!;
  const onSouth = (level: number): string[] => {
    for (const m of w.party.members) m.level = level;
    w.world.travel('kilnsheart_n4', 20, 29, SOUTH);
    const said: string[] = [];
    for (let i = 0; i < 4 && w.world.zone?.id !== 'kilnsheart_n5'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') said.push(...r.messages); }
    ok(w.world.zone?.id === 'kilnsheart_n5', `the drove road crosses from N4 into N5 at ${level}`);
    return said;
  };
  const at16n5 = onSouth(16), at17 = onSouth(17);
  ok(at16n5.includes('The land here is harder than the road behind.') && !at16n5.some((m) => m.includes('The Kilns')), `a company of 16 hears the land is harder, and no name (${at16n5.join(' / ')})`);
  ok(!at17.some((m) => /harder|spare you|Kilns/.test(m)), `a company of 17 hears nothing of the land (${at17.join(' / ') || 'nothing'})`);
  w.level = 17;
  ok(out.at(n5.x + 12, n5.y + 31).ch === '=' && out.zoneAt(n5.x + 12, n5.y + 32)?.id === 'kilnsheart_n6' && out.at(n5.x + 12, n5.y + 32).ch === '=', 'the drove road leaves N5 by its south edge and runs on into N6');

  // The spur off the road to the smelter's yard, the smelter's line, and the verse over its mouth:
  // the dwarves' words to a company with no reader, the boiler's warning to one with.
  const inN5 = (x: number, y: number): boolean => x >= n5.x && x < n5.x + n5.w && y >= n5.y && y < n5.y + n5.h;
  const spurN5 = steps(n5.x + 20, n5.y + 3, (x, y) => out.at(x, y).ch === '=' && inN5(x, y)).get((n5.y + 3) * out.width + n5.x + 14);
  ok(spurN5 === 6, `a spur of ${spurN5} squares of road runs off the drove road west to the smelter's yard`);
  see(w, 'kilnsheart_n5:n5_smelter');
  w.world.travel('kilnsheart_n5', 11, 2, EAST);
  const verse = w.world.eventsHere();
  ok(verse.some((t) => t.includes('THE FIRE IS KEPT BELOW AND NOT ABOVE')) && !verse.some((t) => t.includes('DANGER')) && !w.world.used('n5_verse'), `with no reader the verse over the smelter's mouth is the dwarves' words and no more (${verse.join(' / ')})`);
  w.party.members[4].skills = ['linguist'];
  const boiler = w.world.eventsHere();
  ok(boiler.includes('Maren reads: "DANGER. KEEP FIRE BELOW THIS LINE."') && w.world.used('n5_verse'), `Maren, taught Linguist, reads it as the boiler's warning, as at Anvilhall (${boiler.join(' / ')})`);
  w.party.members[4].skills = [];

  // The master smith with the crown, and the Compact's factor, who pays in stone.
  w.world.travel('kilnsheart_n5', SMITH.x, SMITH.y);
  const crown = meet(SMITH, w.party, heard(w.world, SMITH)).text;
  ok(crown.includes('A crown to order') && crown.includes('paid for in stone'), 'the master smith at the anvil is making a crown to order, paid for in stone');
  w.world.travel('kilnsheart_n5', FACTOR.x, FACTOR.y);
  const factor = meet(FACTOR, w.party, heard(w.world, FACTOR)).text;
  ok(factor.includes('Salt Compact') && factor.includes('Not coin'), 'the Compact\'s factor pays the smiths, and not in coin');

  // The box's groups, each won at its floor: the beetles at the forges, the salamanders on the slag
  // heap and the slag elder on the cutters' track.
  for (const g of N5.encounters!) fight(w, `kilnsheart_n5:${g.id}`);

  // The cutters' track east for the Stone: dirt off the drove road to the east edge, where O5 takes it.
  ok([...Array(16).keys()].every((i) => out.at(n5.x + 16 + i, n5.y + 24).ch === ':') && out.at(n5.x + 15, n5.y + 24).ch === '=',
    'the cutters\' track leaves the drove road at 440,150 and runs east to the box\'s edge');
  const elder = N5.encounters!.find((g) => g.id === 'n5_elder')!;
  ok(elder.monsters.join() === 'slag_elder' && JSON.stringify(elder.until) === JSON.stringify({ flag: 'q_anvil_closed' }), 'on the track a slag elder strayed from the Stone, until the tear is closed');

  // The secret: the slag heap tipped loose on every face but its laid one, the search there and the
  // shard store behind. Walked, waded, climbed or floated, it is never reached but through the face.
  const store = shut(n5, [5, 5], [5, 4], [6, 2]);
  ok(store.size > 600 && !store.reached, `the shard store is shut but for the laid face: none of N5's ${store.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'kilnsheart_n5:n5_laid');
  w.world.travel('kilnsheart_n5', 5, 5, NORTH);
  let laid = false;
  for (let i = 0; i < 20 && !laid; i++) laid = w.world.search();
  const inStore = laid ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(laid && inStore.every((r) => r.kind === 'moved') && w.world.used('n5_store'), 'searched at the laid face, the heap gives, and the shard store behind it can be walked into');
  listen(w);
  const shards = N5.features!.find((f) => f.kind === 'chest' && f.id === 'n5_store_chest');
  ok(shards?.kind === 'chest' && shards.items.includes('forge_shield+1') && shards.x === 6 && shards.y === 2, 'in the store, among the boxes of stone, a Forge Shield +1');

  // The Anvil Stone's box (O5, #464). On along the cutters' track over the line from N5: the same land
  // at the same floor, so the log names nothing and warns of nothing.
  const o5 = out.zones.find((z) => z.id === 'kilnsheart_o5')!;
  w.world.travel('kilnsheart_n5', 29, 24, EAST);
  const onTrack: string[] = [];
  for (let i = 0; i < 4 && w.world.zone?.id !== 'kilnsheart_o5'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') onTrack.push(...r.messages); }
  ok(w.world.zone?.id === 'kilnsheart_o5' && !onTrack.some((m) => /Kilns|harder|spare you/.test(m)), `the cutters' track crosses from N5 into O5 with nothing said of the land (${onTrack.join(' / ') || 'nothing'})`);

  // The track: dirt from the box's west edge up past the tear to the foot of the Stone's plinth.
  const inO5 = (x: number, y: number): boolean => x >= o5.x && x < o5.x + o5.w && y >= o5.y && y < o5.y + o5.h;
  const toStone = steps(o5.x, o5.y + 24, (x, y) => out.at(x, y).ch === ':' && inO5(x, y)).get((o5.y + 12) * out.width + o5.x + 12);
  ok(toStone === 24, `the cutters' track runs ${toStone} squares of dirt from the box's west edge up to the Stone`);

  // The tear below the cut, beside the track: its square shut until the Rift is built (#465), TEAR
  // written for it there, and the torn ground's line said from the track beside it.
  ok(TEAR.x === 12 && TEAR.y === 16 && TEAR.to === 'anvil_stone' && out.passable(o5.x + TEAR.x, o5.y + TEAR.y) !== 'ok' && !O5.features!.some((f) => f.kind === 'rift'),
    'the tear below the cut is shut until the Anvil Stone\'s Rift is built, TEAR written for its square');
  see(w, 'kilnsheart_o5:o5_tear');
  w.world.travel('kilnsheart_o5', TEAR.x - 1, TEAR.y, EAST);
  const torn = w.world.move('forward');
  ok(torn.kind === 'blocked' && w.world.state.x - o5.x === TEAR.x - 1, `a step into the tear is refused (${torn.kind === 'blocked' ? torn.reason : torn.kind})`);

  // The box's groups, each won at its floor: the slaglings out of the tear on the track and on the
  // slope beside it, and the slag elder at its lip. To a company that has not answered the thane no
  // Anvil Guard stands on the approach.
  const guard = O5.encounters!.find((g) => g.id === 'o5_guard')!;
  ok(!w.world.walks(guard, guard.x, guard.y), 'with the thane not answered, no Anvil Guard stands on the approach');
  for (const g of O5.encounters!.filter((e) => e !== guard)) fight(w, `kilnsheart_o5:${g.id}`);
  ok(O5.encounters!.filter((g) => g.monsters.includes('slagling')).every((g) => !!g.respawn && JSON.stringify(g.until) === JSON.stringify({ flag: 'q_anvil_closed' }))
    && O5.encounters!.filter((g) => !g.monsters.includes('slagling')).every((g) => !g.respawn), 'the slaglings come back until the tear is closed; the elder and the Guard never come back');

  // The Stone on its anvil of rock: its line on the approach, and the words cut in its plinth (the
  // dwarves' words for what holds to a company with no reader; KEEP WHOLE. NO CUTTING. to one with).
  see(w, 'kilnsheart_o5:o5_stone');
  w.world.travel('kilnsheart_o5', 12, 11, NORTH);
  const holds = w.world.eventsHere();
  ok(holds.some((t) => t.includes('what holds')) && !holds.some((t) => t.includes('KEEP WHOLE')) && !w.world.used('o5_plinth'), `with no reader the plinth's words are the dwarves' and no more (${holds.join(' / ')})`);
  w.party.members[4].skills = ['linguist'];
  const whole = w.world.eventsHere();
  ok(whole.includes('Maren reads: "KEEP WHOLE. NO CUTTING."') && w.world.used('o5_plinth'), `Maren, taught Linguist, reads it the old way, and it is kept read (${whole.join(' / ')})`);
  w.party.members[4].skills = [];

  // The foreman at his shed, minding the saws the others left, and in the shed his own hammer.
  w.world.travel('kilnsheart_o5', FOREMAN.x, FOREMAN.y);
  const minds = says(w, FOREMAN);
  ok(minds.includes('the ground opened') && minds.includes('minds the saws'), 'the cutters\' foreman stayed at his shed when the others went, and minds the saws');
  w.world.travel('kilnsheart_o5', FOREMAN.x, FOREMAN.y, EAST);
  const inShed = [w.world.move('forward'), w.world.move('forward')];
  const hammer = O5.features!.find((f) => f.kind === 'chest' && f.id === 'o5_shed_chest');
  ok(inShed.every((r) => r.kind === 'moved') && hammer?.kind === 'chest' && hammer.items.includes('cutters_hammer') && w.world.state.x - o5.x === hammer.x && w.world.state.y - o5.y === hammer.y,
    'through the foreman\'s door, in his shed, a Cutter\'s Hammer +1');

  // The secret: every saw-cut through but one on the Stone's north face; the search at the anvil-rock's
  // lip beside it and the hollow behind, where one cutter hid the piece he would not sell. Walked,
  // waded, climbed or floated, it is never reached but through the lip.
  const hollow = shut(o5, [12, 9], [11, 9], [9, 9]);
  ok(hollow.size > 600 && !hollow.reached, `the hollow is shut but for the lip: none of O5's ${hollow.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'kilnsheart_o5:o5_cut');
  w.world.travel('kilnsheart_o5', 12, 9, WEST);
  let lip = false;
  for (let i = 0; i < 20 && !lip; i++) lip = w.world.search();
  const underLip = lip ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(lip && underLip.every((r) => r.kind === 'moved') && w.world.used('o5_hollow'), 'searched at the anvil-rock\'s lip, it gives, and the hollow behind it can be walked into');
  listen(w);
  const piece = O5.features!.find((f) => f.kind === 'chest' && f.id === 'o5_hollow_chest');
  ok(piece?.kind === 'chest' && piece.items.includes('anvil_shard') && piece.x === 9 && piece.y === 9, 'in the hollow, the cutter\'s piece, a second Anvil Shard');

  // The thane's choice at the Stone, each way on a company of 17 of its own. Bought, the saws are off
  // the Stone, the foreman takes them down and no Guard stands; taken, the thane's iron stands on the
  // approach, won at the box's floor, and the foreman keeps to his door.
  const post = O5.features!.find((f) => f.kind === 'event' && f.id === 'o5_post')!;
  const saw = O5.features!.find((f) => f.kind === 'event' && f.id === 'o5_saw')!, sawOff = O5.features!.find((f) => f.kind === 'event' && f.id === 'o5_saw_off')!;
  for (const way of [BOUGHT, TAKEN]) {
    const t = newWalk(ok);
    t.level = 17;
    t.world.travel('anvilhall', THANE.x, THANE.y);
    const [buyIt, takeIt] = meet(THANE, t.party, heard(t.world, THANE)).choice?.answers ?? [];
    t.party.gold = way === BOUGHT ? ANVIL_STONE_PRICE : 0;
    answer(way === BOUGHT ? buyIt : takeIt, t.party);
    ok(!!t.party.flags[way], `${way}: the thane's answer is given`);
    const stands = t.world.walks(guard, guard.x, guard.y) && t.world.present(post), cut = t.world.present(saw), off = t.world.present(sawOff);
    t.world.travel('kilnsheart_o5', FOREMAN.x, FOREMAN.y);
    const foreman = says(t, FOREMAN);
    ok(way === BOUGHT ? !stands && off && !cut && foreman.includes('The saws come off') : stands && cut && !off && foreman.includes('thane\'s iron'),
      way === BOUGHT ? 'bought, no Guard stands, the saws are off the Stone and the foreman is taking them down' : 'taken, the thane\'s iron stands on the approach, the saw is still in the cut and the foreman keeps to his door');
    if (way === TAKEN) fight(t, 'kilnsheart_o5:o5_guard');
  }

  // The roads south and west (N6 and M6, #467). On down the drove road over the line from N5: the
  // same land, its floor 16 under N5's 17, so nothing is said of it at any level.
  const n6 = out.zones.find((z) => z.id === 'kilnsheart_n6')!, m6 = out.zones.find((z) => z.id === 'kilnmouth_m6')!;
  for (const m of w.party.members) m.level = 14;
  w.world.travel('kilnsheart_n5', 12, 29, SOUTH);
  const intoN6: string[] = [];
  for (let i = 0; i < 4 && w.world.zone?.id !== 'kilnsheart_n6'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') intoN6.push(...r.messages); }
  ok(w.world.zone?.id === 'kilnsheart_n6' && !intoN6.some((m) => /Kilns|harder|spare you/.test(m)), `the drove road crosses from N5 into N6 with nothing said of the land, even at 14 (${intoN6.join(' / ') || 'nothing'})`);
  w.level = 16;

  // Out by the south edge for Cairnmoor's N7, the moor's border said on the road; past it, for now,
  // the world ends.
  ok(out.at(n6.x + 3, n6.y + 31).ch === '=' && out.passable(n6.x + 3, n6.y + 32) !== 'ok', 'the drove road leaves N6 by its south edge for Cairnmoor, and past it, for now, the world ends');
  see(w, 'kilnsheart_n6:n6_border');

  // The fork's milestone, counted along the roads at 13 squares to the unit, a corner walked where the
  // road turns on a diagonal: to the front of Anvilhall's gate, and to Kilnhaven's gate at 391,162,
  // two squares past the branch's last road square on M6.
  const roadish = (x: number, y: number): boolean => out.at(x, y).ch === '=' || (out.passable(x, y) === 'ok' && [-1, 1].some((d) => out.at(x + d, y).ch === '=') && [-1, 1].some((d) => out.at(x, y + d).ch === '='));
  const byRoad = steps(n6.x + 4, n6.y + 18, roadish);
  const toHall = byRoad.get((n3.y + GATE.y + 1) * out.width + n3.x + GATE.x) ?? Infinity, toPort = (byRoad.get((m6.y + 4) * out.width + m6.x + 1) ?? Infinity) + 2;
  const mile = N6.features!.find((f) => f.kind === 'event' && f.id === 'n6_milestone')!;
  ok(mile.kind === 'event' && mile.x === 4 && mile.y === 18 && mile.text.includes(`ANVILHALL ${Math.round(toHall / 13)} `) && mile.text.includes(`KILNHAVEN ${Math.round(toPort / 13)} `),
    `the milestone at the fork says ANVILHALL ${Math.round(toHall / 13)} and KILNHAVEN ${Math.round(toPort / 13)}: ${toHall} squares along the roads to Anvilhall's gate and ${toPort} to Kilnhaven's`);

  // The drover at the camp, with his rumour from Rime Lodge; and the box's groups, each won at its
  // floor: the beetles on the verge and the worm at the far end.
  w.world.travel('kilnsheart_n6', DROVER.x, DROVER.y);
  const rumour = meet(DROVER, w.party, heard(w.world, DROVER)).text;
  ok(rumour.includes('Rime Lodge') && rumour.includes('out of the ice'), 'the drover at the fork has a rumour of what came up out of the ice at Rime Lodge');
  for (const g of N6.encounters!) fight(w, `kilnsheart_n6:${g.id}`);

  // The secret: the verge worn wide where nothing stops, the search there and the coach's old halt
  // behind its stopped door. Walked, waded, climbed or floated, it is never reached but through it.
  const halt = shut(n6, [4, 24], [5, 24], [7, 24]);
  ok(halt.size > 600 && !halt.reached, `the halt is shut but for its stopped door: none of N6's ${halt.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'kilnsheart_n6:n6_verge');
  w.world.travel('kilnsheart_n6', 4, 24, EAST);
  let haltOpen = false;
  for (let i = 0; i < 20 && !haltOpen; i++) haltOpen = w.world.search();
  const inHalt = haltOpen ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(haltOpen && inHalt.every((r) => r.kind === 'moved') && w.world.used('n6_halt'), 'searched at the worn verge, the halt\'s door gives, and the shelter behind it can be walked into');
  listen(w);
  const purse = N6.features!.find((f) => f.kind === 'chest' && f.id === 'n6_halt_chest');
  ok(purse?.kind === 'chest' && purse.gold === 230 && purse.x === 7 && purse.y === 24, 'under the coach bill, a purse left behind');

  // West down the branch over the line into Kilnmouth: named at the floor, and harder two under it.
  const branch = (level: number): string[] => {
    for (const m of w.party.members) m.level = level;
    w.world.travel('kilnsheart_n6', 2, 18, WEST);
    const said: string[] = [];
    for (let i = 0; i < 4 && w.world.zone?.id !== 'kilnmouth_m6'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') said.push(...r.messages); }
    ok(w.world.zone?.id === 'kilnmouth_m6', `the branch crosses from N6 into M6 at ${level}`);
    return said;
  };
  const early6 = branch(14), due6 = branch(16);
  ok(early6.includes('Kilnmouth. The land here is harder than the road behind.'), `a company of 14 hears Kilnmouth named, and harder than the road behind (${early6.join(' / ')})`);
  ok(due6.includes('Kilnmouth.') && !due6.some((m) => m.includes('harder')), `a company of 16 hears Kilnmouth named, and no warning (${due6.join(' / ')})`);
  w.level = 16;

  // The branch reaches the west edge beside Kilnhaven's gate, its last square dirt where the atlas has
  // no road beyond; past it, for now, the world ends.
  ok(out.at(m6.x + 1, m6.y + 4).ch === '=' && out.at(m6.x, m6.y + 4).ch === ':' && out.passable(m6.x - 1, m6.y + 4) !== 'ok', 'the branch runs to M6\'s west edge beside Kilnhaven\'s gate, and past it, for now, the world ends');
  see(w, 'kilnmouth_m6:m6_port');

  // The farmer at his gate, whose son went up to the mine; and the box's groups, each won at its
  // floor: the beetles at either end of the kilns and the worm under the fields.
  w.world.travel('kilnmouth_m6', FARMER.x, FARMER.y);
  const son = meet(FARMER, w.party, heard(w.world, FARMER)).text;
  ok(son.includes('Tiefzeche') && son.includes('nothing else'), 'the farmer at his gate has a son at the Tiefzeche, whose letters say nothing');
  for (const g of M6.encounters!) fight(w, `kilnmouth_m6:${g.id}`);

  // The secret: the kilns open at their draw-holes but the one stopped with a dressed stone, the
  // search there and the drover's cache behind it. Walked, waded, climbed or floated, never reached
  // but through the stone.
  const kiln = shut(m6, [21, 19], [21, 20], [21, 22]);
  ok(kiln.size > 600 && !kiln.reached, `the stopped kiln is shut but for its draw-hole: none of M6's ${kiln.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'kilnmouth_m6:m6_kilns');
  w.world.travel('kilnmouth_m6', 21, 19, SOUTH);
  let unstopped = false;
  for (let i = 0; i < 20 && !unstopped; i++) unstopped = w.world.search();
  const inKiln = unstopped ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(unstopped && inKiln.every((r) => r.kind === 'moved') && w.world.used('m6_cache'), 'searched at the stopped draw-hole, the dressed stone gives, and the drover\'s cache behind it can be walked into');
  listen(w);
  const cache = M6.features!.find((f) => f.kind === 'chest' && f.id === 'm6_cache_chest');
  ok(cache?.kind === 'chest' && cache.items.includes('seax+1') && cache.x === 21 && cache.y === 22, 'in the cache, among the Compact\'s cloth, a Seax +1');

  anvilhall(w, ok);

  // Erzkamm (N2, #460). Up the open fell out of N3 and over the line: the same land at the same
  // floor, so the log names nothing and warns of nothing.
  const n2 = out.zones.find((z) => z.id === 'ironfells_n2')!;
  w.world.travel('ironfells_n3', 6, 2, NORTH);
  const up: string[] = [];
  for (let i = 0; i < 4 && w.world.zone?.id !== 'ironfells_n2'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') up.push(...r.messages); }
  ok(w.world.zone?.id === 'ironfells_n2' && !up.some((m) => /Iron Fells|harder|spare you/.test(m)), `the open fell climbs out of N3 into N2 with nothing said of the land (${up.join(' / ') || 'nothing'})`);

  // The box's groups, each won at its floor: the beetles on the first ore-finders' spoil and the
  // worms in their two adits.
  for (const g of N2.encounters!) fight(w, `ironfells_n2:${g.id}`);

  // The scholar at the wall (#56's 34): his primers in Helmstow paper, and nobody he copies for.
  w.world.travel('ironfells_n2', SCHOLAR.x, SCHOLAR.y);
  const copying = meet(SCHOLAR, w.party, heard(w.world, SCHOLAR)).text;
  ok(copying.includes('Helmstow paper') && copying.includes('Myself'), 'the scholar at the wall copies it into a book, his primers wrapped in Helmstow paper, and copies for himself, he says');

  // The secret: the floor worn to a blank face and the chalk stopping short of it; the wall beside
  // it (the dwarves' first blessing to a company with no reader; KEEP CLEAR OF THE DOORS to one with);
  // the search at the face, and behind it the doors and the hoard before them. Walked, waded,
  // climbed or floated, they are never reached but through the face.
  const doors = shut(n2, [8, 16], [9, 13], [10, 10]);
  ok(doors.size > 600 && !doors.reached, `the doors are shut but for the blank face: none of N2's ${doors.size} squares walked, waded, climbed or floated reaches them`);
  see(w, 'ironfells_n2:n2_floor');
  w.world.travel('ironfells_n2', 8, 14, NORTH);
  const words = w.world.eventsHere();
  ok(words.some((t) => t.includes('the first blessing')) && !words.some((t) => t.includes('KEEP CLEAR')) && !w.world.used('n2_wall'), `with no reader the wall is the dwarves' first blessing and no more (${words.join(' / ')})`);
  w.party.members[4].skills = ['linguist'];
  const warned = w.world.eventsHere();
  ok(warned.includes('Maren reads: "KEEP CLEAR OF THE DOORS."') && w.world.used('n2_wall'), `Maren, taught Linguist, reads it the old way, and it is kept read (${warned.join(' / ')})`);
  w.party.members[4].skills = [];
  w.world.travel('ironfells_n2', 9, 14, NORTH);
  let face = false;
  for (let i = 0; i < 20 && !face; i++) face = w.world.search();
  const behind = face ? Array.from({ length: 4 }, () => w.world.move('forward')) : [];
  ok(face && behind.every((r) => r.kind === 'moved') && w.world.used('n2_doors') && w.world.used('n2_hoard'), 'searched at the blank face, it gives, and the doors behind it and the hoard before them can be walked to');
  listen(w);
  const hoard = N2.features!.find((f) => f.kind === 'chest' && f.id === 'n2_hoard_chest');
  ok(hoard?.kind === 'chest' && hoard.items.includes('mattock+1') && hoard.x === 10 && hoard.y === 10, 'before the doors, the first ore-finders\' hoard, and a Mattock +1 in it');

  ironhide(ok);
  tiefzeche(w, ok);
};

/**
 * The Barbarian's second prestige (#19): Hartmut at the mouth of the cave in N2's crag. He is there
 * from a new game, off every road and fight and reached on foot up the fell; his own words come
 * first, then his lesson, once, to a Berserker of 19; and at 19 the barbarian is sent to him and
 * taught. The premade company has no barbarian, so one stands in for its knight.
 */
function ironhide(ok: (cond: boolean, msg: string) => void): void {
  const taught = (N2.features ?? []).flatMap((f) => (f.kind === 'npc' && f.teaches ? [f.teaches] : []));
  ok(taught.length === 1 && taught[0].cls === 'barbarian' && taught[0].prestige === 2, 'Erzkamm teaches the Barbarian\'s second');
  ok(N2.rows[HARTMUT.y][HARTMUT.x] === '"' && N2.features!.every((f) => f === HARTMUT || f.x !== HARTMUT.x || f.y !== HARTMUT.y), 'Hartmut sits in the cave\'s mouth, with nothing else on his square');
  const there = (w: Walk): boolean => { w.world.travel('ironfells_n2', HARTMUT.x, HARTMUT.y); return w.world.present(HARTMUT); };
  ok(there(newWalk(ok)), 'he is there from a new game');
  ok(!!HARTMUT.teaches?.seek?.includes('Hartmut') && HARTMUT.teaches.seek.includes('Erzkamm') && HARTMUT.teaches.seek.includes(PRESTIGES.barbarian.titles[1]), 'his seeking names him, Erzkamm and the title he gives');
  // Off the beaten path (DESIGN §5): more than ten squares from every road and group on the outdoors.
  const out = buildMaps()[OUTDOORS], n2 = out.zones.find((z) => z.id === 'ironfells_n2')!, [hx, hy] = [n2.x + HARTMUT.x, n2.y + HARTMUT.y];
  const near = (x: number, y: number): boolean => Math.abs(x - hx) + Math.abs(y - hy) <= 10;
  let road = 0;
  for (let y = hy - 10; y <= hy + 10; y++) for (let x = hx - 10; x <= hx + 10; x++) if (near(x, y) && out.inBounds(x, y) && out.at(x, y).ch === '=') road++;
  ok(!road, 'he is more than ten squares off any road');
  ok(out.encounters.every((g) => !near(g.x, g.y)), 'and more than ten squares from any group, so no trainer\'s door is a fight\'s doorstep');
  const map = new GameMap(N2), seen = new Set([`${N2.start.x},${N2.start.y}`]), q = [[N2.start.x, N2.start.y]];
  let reached = false;
  while (q.length && !reached) {
    const [x, y] = q.shift()!;
    reached = x === HARTMUT.x && y === HARTMUT.y;
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      if (!map.inBounds(nx, ny) || seen.has(`${nx},${ny}`) || map.at(nx, ny).door === 'secret') continue;
      if (map.passable(nx, ny) === 'ok') { seen.add(`${nx},${ny}`); q.push([nx, ny]); }
    }
  }
  ok(reached, 'he is reached on foot up the fell from N3, by no secret door');

  // His words first, then his lesson once to a Berserker of 19, and to a company under it never.
  const at = (level: number): Walk => {
    const w = newWalk(ok);
    w.party.members[0] = createCharacter('Ragna', 'human', 'barbarian', { might: 15, endurance: 14, speed: 12 }, makeRng(19));
    for (const c of w.party.members) { c.xp = xpForLevel(level); c.level = level; }
    return w;
  };
  const talk = (w: Walk): string => { w.world.travel('ironfells_n2', HARTMUT.x, HARTMUT.y); return meet(HARTMUT, w.party, heard(w.world, HARTMUT)).text; };
  const w = at(19), ragna = w.party.members[0];
  takePrestige(ragna);
  const said = [talk(w), talk(w), talk(w)];
  ok(said[0].includes('I keep the mouth') && !said[0].includes('Stand in the wind') && said[1].includes('Berserker, once') && said[1].includes('Stand in the wind') && said[2].includes('I keep the mouth'),
    'his own words come first, then his lesson to a Berserker of 19, once');
  const young = at(18);
  ok(![talk(young), talk(young)].some((t) => t.includes('Stand in the wind')), 'to a company of 18 he says no lesson');

  // At 19 the barbarian is sent to Erzkamm, and taught.
  ok(sought(questLog(w.world.state, w.party)).find((p) => p.at === 'ironfells_n2')?.who.includes(ragna.name) === true, 'at 19 the barbarian is sent to Erzkamm');
  w.party.gold = 4000;
  ok(teach(HARTMUT.teaches!, w.party, w.world.state, 0).taught && prestigeOf(ragna) === 2 && className(ragna) === PRESTIGES.barbarian.titles[1] && w.party.gold === 0
    && questLog(w.world.state, w.party).find((v) => v.def.id === seekId(0, 2))?.done === true, `he makes an ${PRESTIGES.barbarian.titles[1]} of a Berserker for 4,000 gold, and the seeking is done`);
}

/**
 * Anvilhall (#459): the gate's line; a night at the inn, the forge's step bought, training to 19; the
 * verse read the old way by the Lantern reader, or by the company's own reader first; Linguist taught
 * to a Lantern; and the thane's choice both ways.
 */
function anvilhall(w: Walk, ok: (cond: boolean, msg: string) => void): void {
  // In at N3's gate, by the door in the hill, and out by it again onto the forecourt before it,
  // whatever the thane was told: nothing shuts it.
  w.world.travel('ironfells_n3', GATE.x, GATE.y + 1, NORTH);
  const step = w.world.move('forward'), inside = step.kind === 'moved' ? step.messages : [];
  ok(w.world.state.mapId === 'anvilhall' && w.world.state.x === TOWN.start.x && w.world.state.y === TOWN.start.y && w.world.state.facing === NORTH, 'N3\'s gate lets the company in at the foot of the court, facing up it');
  ok(inside.join() === 'A door in the hill, iron-bound, and the hammering behind it. Over the lintel, words cut deep and painted red.', `going in, the door in the hill and the words cut over it (${inside.join(' / ')})`);
  const first = w.world.move('forward');
  ok(first.kind === 'moved' && first.messages.some((t) => t.startsWith('Anvilhall: a court cut down into the hill')), `a step inside, the court and its terraces (${first.kind === 'moved' ? first.messages.join(' / ') : first.kind})`);
  listen(w);
  w.world.travel('anvilhall', TOWN.start.x, TOWN.start.y, SOUTH);
  const back = w.world.move('forward');
  ok(back.kind === 'moved' && w.world.zone?.id === 'ironfells_n3' && w.world.state.x - w.world.zone.x === GATE.x && w.world.state.y - w.world.zone.y === GATE.y + 1 && w.world.state.facing === SOUTH,
    'and out again onto the forecourt before the gate, facing down the spur');
  ok(TOWN.exits!.length === 1 && TOWN.exits!.every((e) => !e.shut && !e.needFlag), 'nothing shuts the gate, either way');
  listen(w);

  // A company of 16 rests, buys the act's first step and trains to 19, each as the business's screen
  // does it (src/ui/screens.ts).
  ok(business('inn').length === 1 && business('temple').length === 1, 'Anvilhall has an inn to rest at and a mine-surgeon who cures');
  w.party.gold = 30000;
  const inn = business('inn')[0], night = inn.price * w.party.members.length;
  for (const m of w.party.members) { m.hp = 1; m.sp = 0; }
  w.party.gold -= night;
  for (const m of w.party.members) rest(m);
  w.world.sleepUntilMorning();
  ok(w.party.members.every((m) => m.hp === m.maxHp && m.sp === m.maxSp) && w.world.hour >= 6 && w.world.hour <= 9 && w.party.gold === 30000 - night, `a night at ${inn.name} for ${night} gold, and the company wakes whole in the morning`);
  const rung = ACT_III.find((r) => r.level === 17)!;
  ok(FORGE_SHOP.stock.length === FORGE.length && FORGE.every((id) => FORGE_SHOP.stock.includes(id)), `the smiths' forge sells the act's first step, all ${FORGE.length} wares and nothing else`);
  for (const m of w.party.members) for (const id of rung.classes[m.cls]) ok(!!buy(w.party, FORGE_SHOP, id), `${m.name} buys a ${item(id).name} at the forge`);
  const stores = business('shop').find((f) => f.interior === 'anvilhall_stores')!;
  ok(['rations', 'lantern_oil', 'potion_heal', 'antidote'].every((id) => stores.stock.includes(id)) && !stores.stock.some((id) => FORGE.includes(id)), 'the stores sell provisions and lamp oil, and no steel');
  const yard = business('trainer')[0];
  // Trained on a copy, so the company walks on as it was.
  const trainee = structuredClone(w.party.members[0]);
  trainee.level = 18; trainee.xp = xpForLevel(19);
  ok(business('trainer').length === 1 && yard.maxLevel === 19 && yard.interior === 'anvilhall_training_hall' && canTrainAt(trainee, yard.maxLevel), `${yard.name} will train a member of 18`);
  const fee = trainPrice(trainee);
  levelUp(trainee, makeRng(1), 19);
  ok(trainee.level === 19 && !canTrainAt(trainee, yard.maxLevel), `who trains to 19 for ${fee} gold, and no further`);

  // The verse. With no reader of its own the company sees it at the great hall's doors, and the
  // Lantern reader reads it the old way; after, every holy word is a sign on a door.
  w.world.travel('anvilhall', 7, 2, NORTH);
  const doors = w.world.eventsHere();
  ok(doors.some((t) => t.includes('THE FIRE IS KEPT BELOW AND NOT ABOVE')) && !w.world.used('ah_verse'), 'over the great hall\'s doors the verse is seen, and with no reader nobody reads it');
  w.world.travel('anvilhall', CRANE.x, CRANE.y);
  const aloud = says(w, CRANE);
  ok(aloud.includes('DANGER. KEEP FIRE BELOW THIS LINE.') && aloud.endsWith('"It\'s a warning. The kind you paint on a boiler."') && !!w.party.flags[VERSE_READ], 'the reader reads it aloud, the old way: a warning, the kind you paint on a boiler');
  ok(says(w, CRANE).includes('a sign on a door'), 'and after, every holy word in the hall is a sign on a door');
  listen(w);

  // With a reader of its own (Cassian, taught Linguist), a company reads the verse at the doors, and
  // the reader reads it after them. A stranger to the Lanterns is taught nothing by him; a Lantern
  // learns Linguist of him for its price.
  const own = newWalk(ok);
  const cassian = own.party.members.find((m) => m.name === 'Cassian')!;
  cassian.skills = ['linguist'];
  own.world.travel('anvilhall', 7, 2, NORTH);
  const read = own.world.eventsHere();
  ok(read.includes(readLine('Cassian', 'DANGER. KEEP FIRE BELOW THIS LINE.')) && own.world.used('ah_verse'), `a company with a reader reads the verse at the doors (${read.at(-1)})`);
  own.world.travel('anvilhall', CRANE.x, CRANE.y);
  const after = says(own, CRANE);
  ok(after.includes('You read that one at the doors') && !after.includes('DANGER') && after.endsWith('"A warning. The kind you paint on a boiler."') && !!own.party.flags[VERSE_READ], 'and the reader\'s words change: he reads it after them');
  const maren = own.party.members.findIndex((m) => m.name === 'Maren');
  own.party.gold = 1000;
  ok(CRANE.skill === 'linguist' && !mayLearn('linguist', own.party) && !learn('linguist', own.party, maren).taught, 'the reader teaches Linguist, and to a stranger to the Lanterns, nothing');
  own.party.flags[rankFlag('lanterns')] = 1;
  ok(learn('linguist', own.party, maren).taught && hasSkill(own.party.members[maren], 'linguist') && own.party.gold === 0, 'to a Taper of the Lanterns, Linguist, for 1,000 gold');

  // The thane's choice, both ways, each on a company of 17 of its own. Short of the price the Stone is
  // barred and nothing changes; bought, the forge stays open; taken, it is shut for good, its smiths
  // gone and its door barred. Either way his last word is the same, the question is not put again
  // and the town's words change; the inn and the stores keep their doors open.
  for (const way of [BOUGHT, TAKEN]) {
    const t = newWalk(ok);
    t.level = 17;
    t.world.travel('anvilhall', THANE.x, THANE.y);
    const menu = meet(THANE, t.party, heard(t.world, THANE));
    const [buyIt, takeIt] = menu.choice?.answers ?? [];
    ok(menu.text.includes('we cut it') && buyIt?.price === ANVIL_STONE_PRICE && buyIt.sets === BOUGHT && takeIt?.sets === TAKEN && !takeIt.price, `${way}: the thane puts the Stone at ${ANVIL_STONE_PRICE} gold, or taken`);
    if (way === BOUGHT) {
      t.party.gold = ANVIL_STONE_PRICE - 1;
      ok(barred(buyIt, t.party) && !barred(takeIt, t.party) && answer(buyIt, t.party) === SHORT && !t.party.flags[BOUGHT] && t.party.gold === ANVIL_STONE_PRICE - 1, 'a gold short of six thousand, the Stone is barred, and nothing changes');
      t.party.gold = ANVIL_STONE_PRICE;
    } else t.party.gold = 0;
    const said = answer(way === BOUGHT ? buyIt : takeIt, t.party);
    ok(!!t.party.flags[way] && !t.party.flags[way === BOUGHT ? TAKEN : BOUGHT] && t.party.gold === 0, `${way}: its flag set, and only its own (${said.split('\n\n').at(-1)})`);
    const last = meet(THANE, t.party, heard(t.world, THANE));
    ok(last.text.endsWith('"The mountain has to eat. Remember that, when you are somewhere it does not."') && !last.choice, `${way}: the thane's last word, and the question is not put again`);
    t.world.travel('anvilhall', FORGE_SHOP.x, FORGE_SHOP.y);
    const shut = t.world.eventsHere();
    const open = t.world.present(FORGE_SHOP) && t.world.present(GERDA);
    ok(way === BOUGHT ? open && !shut.length && says(t, GERDA).includes('He will not thank you') : !open && shut.join() === 'The forge door is barred. Behind it the hammering goes on, and nobody comes to it.',
      way === BOUGHT ? 'bought, the forge stays open, and Gerda thanks the company for the thane' : 'taken, the forge is shut for good: its smiths gone, its door barred');
    ok(says(t, KONRAD).includes(way === BOUGHT ? 'paid' : 'in red now') && [...business('inn'), ...business('shop').filter((f) => f !== FORGE_SHOP)].every((f) => t.world.present(f)), `${way}: the warder's book says so, and the inn and the stores keep their doors open`);
  }
}

/**
 * The Tiefzeche (#462): down N4's shaft by the cage and up again; the workings at 16, their three
 * doors sung, the crust on its ledge, the hewer at the face and the groups won, the niche read by a
 * reader alone and the hatch found from the candles, with the coins behind it and the ladder down;
 * the old workings at 16, the cages and what the cargo left, the overseers by night and the second
 * ladder; the bottom at 17, where the pick marks stop at a smooth face, the knockers won, their room
 * found from their tracks, the Foreman won and the door marked CREW ONLY, which stays shut.
 */
function tiefzeche(w: Walk, ok: (cond: boolean, msg: string) => void): void {
  const [L1, L2, L3] = ['deep_mines', 'deep_mines2', 'deep_mines3'].map((id) => MAP_DEFS.find((d) => d.id === id)!);
  const at = (): string => `${w.world.state.mapId} ${w.world.state.x},${w.world.state.y}`;
  w.level = 16;

  // Down the shaft: the cage's gate at the spur's end takes the company to the shaft's foot, facing
  // into the workings; stepped back into, the cage takes it up to the spur's end, facing away.
  w.world.travel('kilnsheart_n4', MOUTH.x - 1, MOUTH.y, EAST);
  const down = w.world.move('forward');
  ok(down.kind === 'moved' && w.world.state.mapId === 'deep_mines' && w.world.state.x === L1.start.x && w.world.state.y === L1.start.y && w.world.state.facing === NORTH && down.messages.includes(MOUTH.label!),
    `the cage's gate takes the company down the shaft to the workings' foot, facing in (${at()}: ${down.kind === 'moved' ? down.messages.join(' / ') : down.kind})`);
  const off = w.world.move('forward'), back = w.world.move('back');
  const n4 = w.world.zone;
  ok(off.kind === 'moved' && back.kind === 'moved' && n4?.id === 'kilnsheart_n4' && w.world.state.x - n4.x === MOUTH.x - 1 && w.world.state.y - n4.y === MOUTH.y && w.world.state.facing === WEST,
    `and the cage at the foot takes it back up to the spur's end, facing down it (${at()})`);
  ok([L1, L2, L3].every((d) => (d.exits ?? []).every((e) => !e.shut && !e.needFlag)), 'nothing shuts a way in the Tiefzeche: no flag, no reading');

  // The workings: the shaft's foot, the three doors and the verse sung at each as the company passes,
  // a count of doors (#56's 36), the crust on its ledge by the stair (#56's 33) and the hewer at the face.
  see(w, 'deep_mines:dm1_in');
  const workings = new GameMap(L1), sung = ['One door', 'Two doors', 'Three doors'];
  sung.forEach((verse, i) => {
    const door = L1.features!.find((f) => f.kind === 'event' && f.id === `dm1_door${i + 1}`);
    ok(door?.kind === 'event' && !!door.once && workings.at(door.x, door.y).door === 'door' && door.text.includes(`"${verse} shut, and all hands counted."`), `the ${['first', 'second', 'third'][i]} door, and its verse sung as the company passes: "${verse} shut"`);
    see(w, `deep_mines:dm1_door${i + 1}`);
  });
  see(w, 'deep_mines:dm1_crust');
  const hewer = L1.features!.find((f) => f.kind === 'npc' && f.name === 'A hewer at the face') as Person;
  w.world.travel('deep_mines', hewer.x, hewer.y);
  const hewn = says(w, hewer);
  ok(hewn.includes('we do not go to the bottom') && hewn.includes('knocking'), 'the hewer at the face says nobody goes to the bottom, and the knocking is heard under the floor');
  for (const g of L1.encounters!) fight(w, `deep_mines:${g.id}`);

  // The service ladder (#434's 2): the candles lean into the wall before the niche; to a company with
  // no reader its prayer is words and no more, and a reader reads LADDER. Searched there the wall
  // gives on the shaft, with the coins pushed through for the dead, and the rungs go on down.
  /** Whether a map's square is reached from another without passing its secret doors, or swimming, climbing or floating. */
  const reached = (d: MapDef, from: readonly [number, number], to: readonly [number, number]): boolean => {
    const m = new GameMap(d), seen = new Set<number>(), todo = [[from[0], from[1]]];
    while (todo.length) {
      const [x, y] = todo.pop()!, k = y * m.width + x;
      if (seen.has(k) || !m.inBounds(x, y) || m.at(x, y).door === 'secret' || m.passable(x, y, { swim: true, climb: true, float: true }) !== 'ok') continue;
      seen.add(k);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
    }
    return seen.has(to[1] * m.width + to[0]);
  };
  ok(!reached(L1, [L1.start.x, L1.start.y], [14, 10]), 'the shaft behind the niche is reached only through its hatch');
  see(w, 'deep_mines:dm1_candles');
  w.world.travel('deep_mines', 12, 10, EAST);
  const prayer = w.world.eventsHere();
  ok(prayer.some((t) => t.includes('prayer for their dead')) && !prayer.some((t) => t.includes('LADDER')) && !w.world.used('dm1_niche'), `with no reader the niche's prayer is words and no more (${prayer.join(' / ')})`);
  w.party.members[4].skills = ['linguist'];
  const ladder = w.world.eventsHere();
  ok(ladder.includes(readLine('Maren', 'LADDER.')) && w.world.used('dm1_niche'), `Maren, taught Linguist, reads it the old way, and it is kept read (${ladder.join(' / ')})`);
  w.party.members[4].skills = [];
  let hatch = false;
  for (let i = 0; i < 20 && !hatch; i++) hatch = w.world.search();
  const into = hatch ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(hatch && into.every((r) => r.kind === 'moved') && w.world.used('dm1_well'), 'searched at the niche, the wall gives on a square shaft with iron rungs');
  const coins = L1.features!.find((f) => f.kind === 'chest' && f.id === 'dm1_well_chest');
  ok(coins?.kind === 'chest' && coins.gold === 400 && coins.x === 14 && coins.y === 10, 'and on its floor the coins pushed through for the dead, 400 gold');
  w.world.travel('deep_mines', 14, 10, SOUTH);
  const rungs = w.world.move('forward');
  ok(rungs.kind === 'moved' && w.world.state.mapId === 'deep_mines2' && w.world.state.x === 5 && w.world.state.y === 11, `down the rungs to the old workings' shaft (${at()})`);
  w.world.travel('deep_mines2', 5, 11, WEST);
  const upRungs = w.world.move('forward');
  ok(upRungs.kind === 'moved' && w.world.state.mapId === 'deep_mines' && w.world.state.x === 14 && w.world.state.y === 10, `and up them again to the workings (${at()})`);
  listen(w);

  // The stair down from the crust's ledge to the old workings: the cargo's footprints down the gallery
  // and the rails bright on top; the beetles in the old stall and the worms in their bore.
  walkThrough(w, 'deep_mines', 2, 1, WEST, 'deep_mines2', 1);
  for (const id of ['dm2_in', 'dm2_prints', 'dm2_rails', 'dm2_bore', 'dm2_stair']) see(w, `deep_mines2:${id}`);
  for (const g of L2.encounters!) fight(w, `deep_mines2:${g.id}`);
  // The Hand's cages on the rails and what the cargo left in them, a bow and a dirk for the classes
  // the Fells' finds miss; by night the overseers walk the cargo on down, seen and never fought.
  see(w, 'deep_mines2:dm2_cages');
  const cage = L2.features!.find((f) => f.kind === 'chest' && f.id === 'dm2_cage_chest');
  ok(cage?.kind === 'chest' && cage.items.includes('ironwood_bow+2') && cage.items.includes('wardens_dirk+2') && cage.gold === 900, 'in the cages, what the cargo left: an Ironwood Bow +2 and a Warden\'s Dirk +2, and 900 gold');
  const lamps = L2.features!.find((f) => f.kind === 'event' && f.id === 'dm2_lamps');
  ok(lamps?.kind === 'event' && JSON.stringify(lamps.when) === JSON.stringify({ hours: 'night' }) && !L2.encounters!.some((g) => g.monsters.some((m) => MONSTERS[m].kind === 'person')), 'by night the overseers\' lamps go away down the bore, and no overseer is fought');
  // The second ladder: the dust blown back from the niche, its prayer read LADDER, its hatch and the
  // rungs on down to the bottom.
  ok(!reached(L2, [L2.start.x, L2.start.y], [5, 11]), 'the old workings\' shaft is reached only through its hatch');
  see(w, 'deep_mines2:dm2_draught');
  w.world.travel('deep_mines2', 5, 9, SOUTH);
  w.party.members[4].skills = ['linguist'];
  const second = w.world.eventsHere();
  ok(second.some((t) => t.includes('cut for their dead')) && second.includes(readLine('Maren', 'LADDER.')), `the second niche's prayer, which a reader reads LADDER (${second.join(' / ')})`);
  w.party.members[4].skills = [];
  let hatch2 = false;
  for (let i = 0; i < 20 && !hatch2; i++) hatch2 = w.world.search();
  const into2 = hatch2 ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(hatch2 && into2.every((r) => r.kind === 'moved') && w.world.used('dm2_well'), 'searched at it, the wall gives on the shaft again');
  w.world.travel('deep_mines2', 5, 11, EAST);
  const deeper = w.world.move('forward');
  ok(deeper.kind === 'moved' && w.world.state.mapId === 'deep_mines3' && w.world.state.x === 14 && w.world.state.y === 10 && w.world.state.facing === SOUTH, `and down the rungs to a square hole in the bottom's ceiling (${at()})`);
  listen(w);

  // The stairs alone join the shaft's foot to the door: no hatch found and nothing read, a company
  // walks every level down to the next.
  ok(reached(L1, [L1.start.x, L1.start.y], [1, 1]) && reached(L2, [L2.start.x, L2.start.y], [14, 14]) && reached(L3, [L3.start.x, L3.start.y], [13, 3]),
    'the stairs join the three levels, shaft to door, with no hatch found: the ladders are a shortcut, never the way');

  // The bottom (17): the steep stair down, where the pick marks stop at a smooth face with a square
  // hole cut through it, the crusts on their ledge beside it and the clean corridor beyond.
  walkThrough(w, 'deep_mines2', 14, 13, SOUTH, 'deep_mines3', 1);
  w.level = 17;
  const bottom = new GameMap(L3);
  ok(bottom.palette.wallStyle === 'smooth' && L3.bare === true && bottom.at(13, 12).solid === 'none' && bottom.at(12, 12).solid === 'wall' && bottom.at(14, 12).solid === 'wall' && bottom.at(13, 13).terrain === 'dirt' && bottom.at(13, 11).terrain === 'floor',
    'the dwarves\' tunnel ends at a smooth face with a square hole cut through it, earth underfoot on their side and the corridor\'s floor on the other');
  for (const id of ['dm3_end', 'dm3_ledge', 'dm3_mouth']) see(w, `deep_mines3:${id}`);
  // No machine stands above the bottom (#158): the knockers, the menders and the Foreman are its own.
  const machines = MAP_DEFS.filter((d) => (d.encounters ?? []).some((g) => g.monsters.some((m) => MONSTERS[m].kind === 'machine'))).map((d) => d.id);
  ok(machines.join() === 'deep_mines3', `the first machines on the road stand at the bottom of the deepest mine, and nowhere else (${machines.join(', ')})`);
  // The clean corridor: six knockers and a mender, twice, won at the bottom's floor; the menders drop their spools.
  for (const g of L3.encounters!.filter((e) => e.id !== 'dm3_foreman')) {
    ok(g.monsters.filter((m) => m === 'knocker').length === 6 && g.monsters.filter((m) => m === 'mender').length === 1 && g.monsters.length === 7, `${g.id}: six knockers and a mender`);
    fight(w, `deep_mines3:${g.id}`);
  }
  ok(w.party.bag.includes('mender_spool'), 'a fallen mender leaves its spool of wire');

  // The secret: the knockers' tracks run to a wall as often as along the corridor and the dust before
  // it is swept in arcs; searched there, it gives on their room, the parts stacked by kind and what
  // the cargo dropped among them, and the ladder's find, a Forge Hammer +1.
  ok(!reached(L3, [L3.start.x, L3.start.y], [5, 9]), 'the knockers\' room is reached only through the swept wall');
  see(w, 'deep_mines3:dm3_tracks');
  w.world.travel('deep_mines3', 5, 11, NORTH);
  let swept = false;
  for (let i = 0; i < 20 && !swept; i++) swept = w.world.search();
  const room = swept ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(swept && room.every((r) => r.kind === 'moved') && w.world.used('dm3_parts'), 'searched at the swept wall, it gives on the knockers\' room');
  const parts = L3.features!.find((f) => f.kind === 'chest' && f.id === 'dm3_parts_chest');
  ok(parts?.kind === 'chest' && parts.items.includes('forge_hammer+1') && parts.items.includes('knocker_plate') && parts.gold === 1250, 'among the parts, a Forge Hammer +1, a knocker\'s plate and 1,250 gold');

  // The Foreman before the door, won at the bottom's floor: it drops its slate and never comes back.
  for (const id of ['dm3_corner', 'dm3_far']) see(w, `deep_mines3:${id}`);
  fight(w, 'deep_mines3:dm3_foreman');
  const foreman = L3.encounters!.find((e) => e.id === 'dm3_foreman')!;
  ok(w.party.bag.includes('foreman_slate') && !foreman.respawn && !!foreman.slainText?.includes('the door stays shut'), 'the Foreman falls over its slate, which is taken; it never comes back, and the door stays shut');

  // The door: CREW ONLY, the footprints and the knot, the chapter's step (#470). It is a wall with a
  // door drawn in it: nothing opens it, no flag and no lock (#434's 4), and nothing in content/locks.ts.
  see(w, 'deep_mines3:dm3_door');
  const door = L3.features!.find((f) => f.kind === 'event' && f.id === 'dm3_door');
  ok(door?.kind === 'event' && door.text.startsWith('CREW ONLY') && door.text.includes('footprints walking down') && door.text.includes('a loop inside a loop'), 'before the door: CREW ONLY, hundreds of footprints walking down and a loop inside a loop on its frame');
  w.world.travel('deep_mines3', 13, 3, EAST);
  const shut = w.world.move('forward');
  ok(shut.kind === 'blocked' && w.world.state.x === 13 && bottom.at(14, 3).door === 'door' && bottom.at(14, 3).solid === 'wall' && !bottom.exitAt(14, 3) && !LOCKS.some((l) => l.map.startsWith('deep_mines')),
    `the door does not open, the Foreman dead or alive: it is a wall with a door drawn in it, and no lock (${shut.kind === 'blocked' ? shut.reason : shut.kind})`);
  listen(w);
}
