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
import { canTrainAt, xpForLevel, rest, trainPrice, levelUp } from '../../../game/party.ts';
import { makeRng } from '../../../lib/engine/rng.ts';
import { mayLearn, learn, hasSkill } from '../../../game/skills.ts';
import { rankFlag } from '../../guilds.ts';
import { readLine } from '../../../game/inscriptions.ts';
import { ACT_III } from '../../../../tools/tests/ladder.ts';
import { FORGE, ANVIL_STONE_PRICE } from './items.ts';
import { GATE } from './maps/ironfells_n3.ts';
import { VERSE_READ, BOUGHT, TAKEN } from './maps/anvilhall.ts';
import { MOUTH } from './maps/kilnsheart_n4.ts';

const M3 = MAP_DEFS.find((d) => d.id === 'ironfells_m3')!, N3 = MAP_DEFS.find((d) => d.id === 'ironfells_n3')!, N4 = MAP_DEFS.find((d) => d.id === 'kilnsheart_n4')!;
const WOODCUTTER = M3.features!.find((f) => f.kind === 'npc' && f.name === 'A woodcutter') as Person;
const MOTHER = N3.features!.find((f) => f.kind === 'npc' && f.name === 'A dwarf woman at the well') as Person;
const MINER = N4.features!.find((f) => f.kind === 'npc' && f.name === 'A miner') as Person;
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
  ok(out.at(n4.x + 20, n4.y + 31).ch === '=' && out.passable(n4.x + 20, n4.y + 32) !== 'ok', 'the drove road leaves N4 by its south edge, and past it, for now, the world ends');

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

  anvilhall(w, ok);
  tiefzeche(w, ok);
};

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
