// The Kilns' walkthrough. Its chapter, The Anvil Stone, is #470's, which plays it here; until then,
// the Iron Fells walked. The way in (M3, #457): the east road out of Lanternwood's M2 over the ridge,
// the crossing line read by a company two under the Fells' floor and by one at it, the secret behind
// the walled adit found from its hints, the box's groups won at its floor, and Lanternwood's trees
// shut against L3, so the road is the only way between the two areas. Anvilhall's box (N3, #458): the
// trail on over the line from M3 with nothing said, the spur up to the gate, barred until the town is
// built, five on from M3's milestone; the box's groups won at its floor; the mother at the terrace
// well; and the tithe-cellar found from the ruts, the niche over its wall read by a reader alone. The
// Tiefzeche's box (N4, #461), the heart's first: the trail on over the line from N3 into new land,
// named, and harder to a company under its floor; the spur to the shaft, its cage chained until the
// mine is built; the drove road out south; the box's groups won at its floor; the miner at the camp;
// and the wagon yard found from the tally board and the fresh mortar, the blessing over the shaft read
// by a reader alone.
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen } from '../../../../tools/walk.ts';
import { EAST, NORTH, SOUTH } from '../../../game/types.ts';
import { MAP_DEFS } from '../../index.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import type { MapZone } from '../../../game/map.ts';
import { meet, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { GATE } from './maps/ironfells_n3.ts';
import { MOUTH } from './maps/kilnsheart_n4.ts';

const M3 = MAP_DEFS.find((d) => d.id === 'ironfells_m3')!, N3 = MAP_DEFS.find((d) => d.id === 'ironfells_n3')!, N4 = MAP_DEFS.find((d) => d.id === 'kilnsheart_n4')!;
const WOODCUTTER = M3.features!.find((f) => f.kind === 'npc' && f.name === 'A woodcutter') as Person;
const MOTHER = N3.features!.find((f) => f.kind === 'npc' && f.name === 'A dwarf woman at the well') as Person;
const MINER = N4.features!.find((f) => f.kind === 'npc' && f.name === 'A miner') as Person;
const CROSSING = 'The Iron Fells. Pine, and the ground going up. Somewhere ahead something is being hammered, and has been all day.';

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

  // The spur: road from the trail all the way to the forecourt under the crag, where the gate stands
  // barred until the town is built (#459), GATE written for it on the gate's square. From M3's
  // milestone the walk to it is about five at 13 squares to the unit, as the stone says.
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
  ok(spur === 46 && out.at(n3.x + GATE.x, n3.y + GATE.y).ch === '#' && out.passable(n3.x + GATE.x, n3.y + GATE.y) !== 'ok' && GATE.to === 'anvilhall',
    `the spur runs ${spur} squares of road from the trail to the forecourt, and the gate before it is barred until Anvilhall is built`);
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

  // The spur off the trail to the headworks, and the shaft at its end, the way into the Tiefzeche
  // (#462): its cage chained until the mine is built, MOUTH written for it on the shaft's square.
  const inN4 = (x: number, y: number): boolean => x >= n4.x && x < n4.x + n4.w && y >= n4.y && y < n4.y + n4.h;
  const toShaft = steps(n4.x + 6, n4.y + 2, (x, y) => out.at(x, y).ch === '=' && inN4(x, y)).get((n4.y + MOUTH.y) * out.width + n4.x + MOUTH.x - 1);
  ok(toShaft === 9 && out.passable(n4.x + MOUTH.x, n4.y + MOUTH.y) !== 'ok' && MOUTH.to === 'deep_mines',
    `the spur runs ${toShaft} squares of road from the trail to the shaft, and the shaft is shut until the Tiefzeche is built`);
  see(w, 'kilnsheart_n4:n4_mouth');
  w.world.travel('kilnsheart_n4', MOUTH.x - 1, MOUTH.y, EAST);
  ok(w.world.eventsHere().some((t) => t.includes('chained')), 'at the spur\'s end the cage stands chained at the top of the shaft');

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
};
