// The Kilns' walkthrough: the Iron Fells walked, and last its chapter, The Anvil Stone (#470), played
// through. The way in (M3, #457): the east road out of Lanternwood's M2 over the ridge,
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
// box (O5, #464): the cutters' track on from N5 with nothing said, up past the tear, the way into the
// Rift, to the Stone; the box's groups won at its floor, no Guard among them; the plinth's words read
// by a reader alone; the foreman at his shed and his hammer in it; the hollow under the anvil-rock's
// lip found from the cut that stops half way; and the thane's choice seen at the Stone, the saws off
// it once it is bought and his iron on the approach once it is taken, and the tear open either way.
// Feuerstollen's box (O6, #466): the open hills down from O5 with nothing said, and the grass in from
// N6, harder to a company under its floor of 17; the box's groups won at its floor; the hermit in his
// dead vent; the adit in the ridge's foot and the words over it, read by a reader alone, whose reading
// marks the tubes and the machine's other mouths on the world map; the first dwarves' shelter found
// from the cold vent's bare lip; and the grass on south over the line into Cairnmoor's O7, the moor
// named, and harder to a company of 17.
// Then the Anvil Stone's Rift (#465), in through the tear and out again: the lanes and the slag run
// down them from the back, the groups won at its floor, the hollow found from the lane whose slag set
// running up and the first cutter's tools in it, the Warden won and its heart taken, and the tear
// closed by the first step after it falls, which the Hearth counts and the strays outside read;
// outside, the torn ground closed over, and a company gone by Town Portal closing it on its first
// step back in or on the track beside the tear. The roads
// south and west (N6 and M6, #467): the drove road on from N5 with nothing said, and out for
// Cairnmoor past the moor's border; the milestone at the fork, counted along the roads; the drover
// at the camp; the boxes' groups won at their floor; the coach's old halt found from the worn
// verge; the branch over the line into Kilnmouth, named, and harder to a company under its floor,
// out to the west edge before Kilnhaven's gate; the farmer at his gate; and the drover's cache
// found from the stopped kiln. Kilnhaven's box (L6, #468): the branch on from M6 with nothing said,
// to the gate in the town's wall; the milestone before it, counted along the roads; the coach yard;
// the store's clerk; the box's groups won at its floor; and the bonded store found from the sealed
// row. Then Kilnhaven (#469), in at L6's gate and out again: a company rests, buys the act's first
// step at the smith at a quarter more, open to it still when the Stone was taken, and trains to 19;
// hears the harbourmaster read the manifests and the dwarf on the quay say where the corridors run,
// and meets Tallis's man on the street; takes the ferry over to Saltmouth's quay and back, a save
// made there loading there, and the coach to Rime Lodge's coach house and back; and finds the ship's
// master selling nothing toward a town not built. Erzkamm (N2,
// #460): up the open fell out of N3 with nothing said, the box's groups won at its floor, the scholar
// at the wall, and the doors behind the blank face found from the worn floor, the wall beside it read
// by a reader alone; the Barbarian's second prestige, taught by Hartmut at the cave's mouth (#19):
// his lesson after his own words, and taught at 19. Then Feuerstollen (#466), down O6's adit and up
// again: the fire adit, its tube's floor showing the fire, the cutters' strongbox and the groups won;
// the deep tubes, the groups won, the square tube found from the heat that drops where the walls go
// square and the plate at its end, which nothing opens, and the Great Salamander won, its hide left.
// Last, The Anvil Stone (#470): in from Lanternwood and with Kilnhaven reached by ferry first, at 16,
// 17 and 18, the Stone bought and taken; each reads the same but for the road up from Lanternwood,
// ends once on the moor where the Ring takes it on, and the Hearth counts the Stone either way.
import type { Walkthrough } from '../../area.ts';
import { newWalk, walkThrough, see, fight, listen, meetWho, playChapter, everyGoalWalked, goalFromBegun, quest } from '../../../../tools/walk.ts';
import type { Walk, Step } from '../../../../tools/walk.ts';
import { EAST, NORTH, SOUTH, WEST } from '../../../game/types.ts';
import { AREAS, MAP_DEFS, MONSTERS, GUILD_QUESTS } from '../../index.ts';
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
import type { GuildId } from '../../guilds.ts';
import { offered, take, rankOf } from '../../../game/guilds.ts';
import type { Party } from '../../../game/party.ts';
import { FOURTH_RANKS_OPEN } from './guilds.ts';
import { readLine, markLine, readMarks } from '../../../game/inscriptions.ts';
import { ACT_III } from '../../../../tools/tests/ladder.ts';
import { FORGE, ANVIL_STONE_PRICE, SMITH_PRICES, quarterMore } from './items.ts';
import { GATE } from './maps/ironfells_n3.ts';
import { VERSE_READ, BOUGHT, TAKEN, HYMN_SUNG } from './maps/anvilhall.ts';
import { MOUTH } from './maps/kilnsheart_n4.ts';
import { TEAR } from './maps/kilnsheart_o5.ts';
import { ADIT } from './maps/kilnsheart_o6.ts';
import { CLOSED, WARDEN_SLAIN } from './maps/anvil_stone.ts';
import { SLAG } from '../../rifts/materials.ts';
import { GATE as HAVEN_GATE } from './maps/kilnmouth_l6.ts';
import { MANIFESTS_READ, DWARF_MET, TALLIS_OWES } from './maps/kilnhaven.ts';
import { FERRY, COMPACT_SHIP, DROVE_COACH, sells } from '../../crossings.ts';
import { take as sail, terms } from '../../../game/passage.ts';
import { MINUTES_PER_DAY } from '../../../game/calendar.ts';
import { serialize, deserialize } from '../../../game/save.ts';
import { World } from '../../../game/world.ts';
import { CHAPTER } from './chapter.ts';
import { CHAPTER as RING } from '../cairnmoor/chapter.ts';

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
const O6 = MAP_DEFS.find((d) => d.id === 'kilnsheart_o6')!;
const HERMIT = O6.features!.find((f) => f.kind === 'npc' && f.name.startsWith('Einhart')) as Person;
const SCHOLAR = N2.features!.find((f) => f.kind === 'npc' && f.name === 'A scholar at the wall') as Person;
const HARTMUT = N2.features!.find((f) => f.kind === 'npc' && f.name.startsWith('Hartmut')) as Person;
const N6 = MAP_DEFS.find((d) => d.id === 'kilnsheart_n6')!, M6 = MAP_DEFS.find((d) => d.id === 'kilnmouth_m6')!;
const DROVER = N6.features!.find((f) => f.kind === 'npc' && f.name === 'A drover') as Person;
const FARMER = M6.features!.find((f) => f.kind === 'npc' && f.name.startsWith('A farmer')) as Person;
const L6 = MAP_DEFS.find((d) => d.id === 'kilnmouth_l6')!;
const CLERK = L6.features!.find((f) => f.kind === 'npc' && f.name.startsWith('The store')) as Person;
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

  // The tear below the cut, beside the track: open ground, the way into the Anvil Stone's Rift (#465),
  // walked in `anvilRift` below, and the torn ground's line said from the track beside it.
  ok(TEAR.x === 12 && TEAR.y === 16 && TEAR.to === 'anvil_stone' && out.passable(o5.x + TEAR.x, o5.y + TEAR.y) === 'ok' && O5.features!.filter((f) => f.kind === 'rift').length === 1 && O5.features!.includes(TEAR) && out.exitAt(o5.x + TEAR.x, o5.y + TEAR.y)?.to === 'anvil_stone',
    'the tear below the cut is open ground, and TEAR on it is the way into the Anvil Stone\'s Rift');
  see(w, 'kilnsheart_o5:o5_tear');

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
    // Either way the tear lets the company down into the Rift (#465).
    t.world.travel('kilnsheart_o5', TEAR.x - 1, TEAR.y, EAST);
    const into = t.world.move('forward');
    ok(into.kind === 'moved' && t.world.state.mapId === 'anvil_stone', `${way}: the tear lets the company down into the Rift all the same`);
  }

  // Feuerstollen's box (O6, #466). Down off the Stone's hills over the line from O5: the same land at
  // the same floor, so the log names nothing and warns of nothing. In from N6's grass, where the floor
  // rises from 16 to 17, a company of 16 hears the land is harder and one of 17 hears nothing.
  const o6 = out.zones.find((z) => z.id === 'kilnsheart_o6')!;
  for (const m of w.party.members) m.level = 17;
  w.world.travel('kilnsheart_o5', 2, 29, SOUTH);
  const offHills: string[] = [];
  for (let i = 0; i < 4 && w.world.zone?.id !== 'kilnsheart_o6'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') offHills.push(...r.messages); }
  ok(w.world.zone?.id === 'kilnsheart_o6' && !offHills.some((m) => /Kilns|harder|spare you/.test(m)), `the open hills run down from O5 into O6 with nothing said of the land (${offHills.join(' / ') || 'nothing'})`);
  const eastward = (level: number): string[] => {
    for (const m of w.party.members) m.level = level;
    w.world.travel('kilnsheart_n6', 29, 18, EAST);
    const said: string[] = [];
    for (let i = 0; i < 4 && w.world.zone?.id !== 'kilnsheart_o6'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') said.push(...r.messages); }
    ok(w.world.zone?.id === 'kilnsheart_o6', `the grass runs on east from N6 into O6 at ${level}`);
    return said;
  };
  const at16o6 = eastward(16), at17o6 = eastward(17);
  ok(at16o6.includes('The land here is harder than the road behind.') && !at16o6.some((m) => m.includes('The Kilns')), `a company of 16 coming from N6 hears the land is harder, and no name (${at16o6.join(' / ')})`);
  ok(!at17o6.some((m) => /harder|spare you|Kilns/.test(m)), `a company of 17 hears nothing of the land (${at17o6.join(' / ') || 'nothing'})`);
  w.level = 17;

  // The box's groups, each won at its floor: the salamanders on the ash, the beetles at the ridge's foot
  // and under the crag the slag elder strayed from the Stone, back until its tear is closed.
  for (const g of O6.encounters!) fight(w, `kilnsheart_o6:${g.id}`);
  const strays = O6.encounters!.find((g) => g.id === 'o6_elder')!;
  ok(strays.monsters.join() === 'slag_elder' && !!strays.respawn && JSON.stringify(strays.until) === JSON.stringify({ flag: 'q_anvil_closed' }), 'under the crag a slag elder strayed from the Stone, back until the tear is closed');
  ok(O6.encounters!.every((g) => g.monsters.every((m) => !['troll', 'wight', 'light', 'hound', 'raven', 'bog'].some((k) => m.includes(k)))), 'none of Cairnmoor\'s monsters comes onto the box, the moor\'s heather and all');

  // The hermit in his dead vent at the ridge's end, who counts the vents by their breath.
  w.world.travel('kilnsheart_o6', HERMIT.x, HERMIT.y);
  const breaths = says(w, HERMIT);
  ok(breaths.includes('by their breath') && breaths.includes('keep time'), 'the hermit in the dead vent counts the vents by their breath, and says a mountain should not keep time');

  // The adit cut into the ridge's foot, rock on three sides of it, the way down into the tubes (ADIT),
  // and the dwarves' words over it: to a company with no reader their words for the mountain's
  // breath; to one with, VENT. STAND CLEAR., and the first reading marks the tubes on the world map and
  // the machine's other mouths, the ice-hole by Rime Lodge, the bay under Coldmere and Fire Mountain's vents.
  ok(ADIT.to === 'lava_tubes' && !!O6.exits?.includes(ADIT) && out.passable(o6.x + ADIT.x, o6.y + ADIT.y) === 'ok' && [[0, -1], [0, 1], [1, 0]].every(([dx, dy]) => out.at(o6.x + ADIT.x + dx, o6.y + ADIT.y + dy).solid === 'rock'),
    'the adit is cut into the ridge\'s foot, rock on three sides, the way down into the tubes');
  see(w, 'kilnsheart_o6:o6_adit');
  w.world.travel('kilnsheart_o6', ADIT.x - 1, ADIT.y, EAST);
  const breath = w.world.eventsHere();
  ok(breath.some((t) => t.includes('the mountain\'s breath')) && !breath.some((t) => t.includes('VENT')) && !w.world.used('o6_mouth') && !readMarks(w.world).length, `with no reader the words over the adit are the dwarves' and no more, and nothing is marked (${breath.join(' / ')})`);
  w.party.members[4].skills = ['linguist'];
  const vent = w.world.eventsHere();
  ok(vent.includes(readLine('Maren', 'VENT. STAND CLEAR.')) && vent.includes(markLine('Maren')) && w.world.used('o6_mouth'), `Maren, taught Linguist, reads them the old way and marks the world map (${vent.join(' / ')})`);
  const marked = readMarks(w.world);
  ok(marked.join() === 'lava_tubes,rime_lodge,sleepers_bay,meridian_camp', `the world map marks the tubes and the machine's other mouths: ${marked.join(', ')}`);
  ok(!w.world.eventsHere().includes(markLine('Maren')), 'read again, the words mark nothing more');
  w.party.members[4].skills = [];

  // The secret: every hot vent along the ridge with ash on its lip, and near its end one bare, its air
  // going in; the search there and the first dwarves' shelter behind it, with the ladder's Steel Bow +1.
  // Walked, waded, climbed or floated, it is never reached but through the vent.
  const shelter = shut(o6, [24, 25], [25, 25], [27, 25]);
  ok(shelter.size > 600 && !shelter.reached, `the shelter is shut but for the cold vent: none of O6's ${shelter.size} squares walked, waded, climbed or floated reaches it`);
  const vents = O6.features!.filter((f): f is Extract<Feature, { kind: 'event' }> => f.kind === 'event' && /^o6_vent\d$/.test(f.id));
  ok(vents.length === 4 && vents.every((f) => /\bash\b/i.test(f.text) && f.text.includes('lip') && new GameMap(O6).at(f.x, f.y).terrain === 'lava'), 'four vents along the ridge show their fire, and each has ash on its lip');
  for (const f of vents) see(w, `kilnsheart_o6:${f.id}`);
  see(w, 'kilnsheart_o6:o6_cold');
  w.world.travel('kilnsheart_o6', 24, 25, EAST);
  let cold = false;
  for (let i = 0; i < 20 && !cold; i++) cold = w.world.search();
  const inShelter = cold ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(cold && inShelter.every((r) => r.kind === 'moved') && w.world.used('o6_shelter'), 'searched at the cold vent, its back gives, and the first dwarves\' shelter behind it can be walked into');
  listen(w);
  const bow = O6.features!.find((f) => f.kind === 'chest' && f.id === 'o6_shelter_chest');
  ok(bow?.kind === 'chest' && bow.items.includes('steel_bow+1') && bow.x === 27 && bow.y === 25, 'in the shelter, what the first dwarves left: a Steel Bow +1');

  // Out by the south edge over the line into Cairnmoor's O7 (#477): the grass runs on square for square,
  // no road between, and the moor is named; a company of 17 hears the land is harder, one of 18 no more.
  const southward = (level: number): string[] => {
    for (const m of w.party.members) m.level = level;
    w.world.travel('kilnsheart_o6', 15, 30, SOUTH);
    const said: string[] = [];
    for (let i = 0; i < 4 && w.world.zone?.id !== 'highmoor_o7'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') said.push(...r.messages); }
    ok(w.world.zone?.id === 'highmoor_o7', `the grass runs on south from O6 into Cairnmoor's O7 at ${level}`);
    return said;
  };
  const at17o7 = southward(17), at18o7 = southward(18);
  ok(out.at(o6.x + 15, o6.y + 31).ch === ',' && out.at(o6.x + 15, o6.y + 32).ch === ',' && at17o7.some((m) => /^High Moor\./.test(m) && m.includes('harder')) && at18o7.some((m) => /^High Moor\./.test(m)) && !at18o7.some((m) => /harder|spare you/.test(m)),
    `over the line the moor is named and said harder to a company of 17 (${at17o7.join(' / ')}), and only named to one of 18 (${at18o7.join(' / ')})`);
  w.level = 17;

  anvilRift(w, ok);

  // The roads south and west (N6 and M6, #467). On down the drove road over the line from N5: the
  // same land, its floor 16 under N5's 17, so nothing is said of it at any level.
  const n6 = out.zones.find((z) => z.id === 'kilnsheart_n6')!, m6 = out.zones.find((z) => z.id === 'kilnmouth_m6')!, l6 = out.zones.find((z) => z.id === 'kilnmouth_l6')!;
  for (const m of w.party.members) m.level = 14;
  w.world.travel('kilnsheart_n5', 12, 29, SOUTH);
  const intoN6: string[] = [];
  for (let i = 0; i < 4 && w.world.zone?.id !== 'kilnsheart_n6'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') intoN6.push(...r.messages); }
  ok(w.world.zone?.id === 'kilnsheart_n6' && !intoN6.some((m) => /Kilns|harder|spare you/.test(m)), `the drove road crosses from N5 into N6 with nothing said of the land, even at 14 (${intoN6.join(' / ') || 'nothing'})`);
  w.level = 16;

  // Out by the south edge into Cairnmoor's N7 (#476), the moor's border said on the road.
  ok(out.at(n6.x + 3, n6.y + 31).ch === '=' && out.zoneAt(n6.x + 3, n6.y + 32)?.id === 'highmoor_n7' && out.at(n6.x + 3, n6.y + 32).ch === '=', 'the drove road leaves N6 by its south edge and runs on into Cairnmoor\'s N7');
  see(w, 'kilnsheart_n6:n6_border');

  // The fork's milestone, counted along the roads at 13 squares to the unit, a corner walked where the
  // road turns on a diagonal: to the front of Anvilhall's gate, and to Kilnhaven's gate on L6 (#468),
  // a square past the road's end before it.
  const roadish = (x: number, y: number): boolean => out.at(x, y).ch === '=' || (out.passable(x, y) === 'ok' && [-1, 1].some((d) => out.at(x + d, y).ch === '=') && [-1, 1].some((d) => out.at(x, y + d).ch === '='));
  const byRoad = steps(n6.x + 4, n6.y + 18, roadish);
  const toHall = byRoad.get((n3.y + GATE.y + 1) * out.width + n3.x + GATE.x) ?? Infinity, toPort = (byRoad.get((l6.y + HAVEN_GATE.y) * out.width + l6.x + HAVEN_GATE.x + 1) ?? Infinity) + 1;
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

  // The branch runs on west along the river's bank to M6's west edge and over it into L6, road all the
  // way since L6 is laid (#468).
  ok(out.at(m6.x + 1, m6.y + 4).ch === '=' && out.at(m6.x, m6.y + 4).ch === '=' && out.zoneAt(m6.x - 1, m6.y + 4)?.id === 'kilnmouth_l6' && out.at(m6.x - 1, m6.y + 4).ch === '=', 'the branch leaves M6 by its west edge and runs on into L6');
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

  // Kilnhaven's box (L6, #468). On along the branch over the line from M6: the same land at the same
  // floor, so nothing is said of it.
  w.world.travel('kilnmouth_m6', 2, 4, WEST);
  const intoL6: string[] = [];
  for (let i = 0; i < 4 && w.world.zone?.id !== 'kilnmouth_l6'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') intoL6.push(...r.messages); }
  ok(w.world.zone?.id === 'kilnmouth_l6' && !intoL6.some((m) => /Kilnmouth|harder|spare you/.test(m)), `the branch crosses from M6 into L6 with nothing said of the land (${intoL6.join(' / ') || 'nothing'})`);

  // The gate in the town's wall, the way into Kilnhaven (#469); and the milestone before it, counted
  // along the roads as the stones are.
  ok(!!L6.exits?.includes(HAVEN_GATE) && out.at(l6.x + HAVEN_GATE.x, l6.y + HAVEN_GATE.y).door === 'door' && HAVEN_GATE.to === 'kilnhaven' && HAVEN_GATE.x === 28 && HAVEN_GATE.y === 4 && out.at(l6.x + 29, l6.y + 4).ch === '=',
    'the road runs from the east edge to Kilnhaven\'s gate in the wall at 28,4, and the gate is a door, the way into the town');
  const fromStone = steps(l6.x + 30, l6.y + 4, roadish), toHall6 = fromStone.get((n3.y + GATE.y + 1) * out.width + n3.x + GATE.x) ?? Infinity;
  const stone6 = L6.features!.find((f) => f.kind === 'event' && f.id === 'l6_milestone')!;
  ok(stone6.kind === 'event' && stone6.x === 30 && stone6.y === 4 && stone6.text.includes(`ANVILHALL ${Math.round(toHall6 / 13)} `), `the milestone before Kilnhaven's gate says ANVILHALL ${Math.round(toHall6 / 13)}: ${toHall6} squares along the roads to Anvilhall's gate`);
  see(w, 'kilnmouth_l6:l6_yard');

  // Past its west edge, the cut heath of K6, and past its south edge Cairnmoor's L7, the world ends.
  ok(out.passable(l6.x - 1, l6.y + 25) !== 'ok' && out.passable(l6.x + 20, l6.y + 32) !== 'ok', 'past L6\'s west and south edges, for now, the world ends');

  // The store's clerk on the quay; and the box's groups, each won at its floor: the beetles in the ore
  // heaps, the Hand's crew on the pier by night and the worm pair under the heath.
  w.world.travel('kilnmouth_l6', CLERK.x, CLERK.y);
  const sealedRow = meet(CLERK, w.party, heard(w.world, CLERK)).text;
  ok(sealedRow.includes('Compact') && sealedRow.includes('nobody opens it'), 'the store\'s clerk says the sealed row is the Compact\'s, and nobody opens it');
  for (const g of L6.encounters!) fight(w, `kilnmouth_l6:${g.id}`);

  // The secret: every crate on the quay open but the sealed row against the store's wall, the search
  // there and the bonded store behind its stopped door. Walked, waded, climbed or floated, never
  // reached but through the door.
  const bonded = shut(l6, [21, 10], [21, 11], [22, 12]);
  ok(bonded.size > 400 && !bonded.reached, `the bonded store is shut but for its stopped door: none of L6's ${bonded.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'kilnmouth_l6:l6_quay');
  see(w, 'kilnmouth_l6:l6_store');
  w.world.travel('kilnmouth_l6', 21, 10, SOUTH);
  let unsealed = false;
  for (let i = 0; i < 20 && !unsealed; i++) unsealed = w.world.search();
  const inBonded = unsealed ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(unsealed && inBonded.every((r) => r.kind === 'moved') && w.world.used('l6_bonded'), 'searched at the store\'s wall behind the sealed row, its stopped door gives, and the bonded store behind it can be walked into');
  listen(w);
  const robe = L6.features!.find((f) => f.kind === 'chest' && f.id === 'l6_store_chest');
  ok(robe?.kind === 'chest' && robe.items.includes('kiln_robe+1') && robe.x === 22 && robe.y === 12, 'among the crates for Cinderport and Sheer Point, a Kiln Robe +1');

  kilnhaven(ok);
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
  feuerstollen(w, ok);
  sideQuests(ok);
  theAnvilStone(ok);
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
 * Kilnhaven (#469): in at L6's gate with the town's gate line, a step inside to the inn yard, and out
 * again; a night at the inn, the act's first step bought at the smith at a quarter more, open to a
 * company the thane has shut out, and training to 19 at the ore shed; the manifests read by the
 * harbourmaster, and the dwarf's word on the corridors; the ferry over to Saltmouth's quay and back
 * from its master there, halved for nobody; the coach to Rime Lodge's coach house and back from its
 * coachman there; the ship, whose far end is not built, sold by nobody yet, its master only talking;
 * and Tallis's man on the street, whose words name nothing in his parcel (A Crown to Order is walked
 * in `sideQuests`).
 */
function kilnhaven(ok: (cond: boolean, msg: string) => void): void {
  const HAVEN = MAP_DEFS.find((d) => d.id === 'kilnhaven')!;
  const here = <K extends Feature['kind']>(kind: K): Extract<Feature, { kind: K }>[] => HAVEN.features!.filter((f): f is Extract<Feature, { kind: K }> => f.kind === kind);
  const who = (name: string): Person => here('npc').find((f) => f.name.startsWith(name)) as Person;
  const IRMGARD = who('Irmgard'), DUNSTAN = who('Dunstan'), JAGO = who('Jago'), MURDO = who('Murdo'), DIETMAR = who('Dietmar'), DWARF = who('A dwarf on a bollard'), WIEBE = who('Wiebe');
  const SMITHY = here('shop').find((f) => f.interior === 'kilnhaven_smith')!;
  const w = newWalk(ok);
  w.level = 16;
  for (const m of w.party.members) m.level = 16;

  // In at L6's gate, saying the town's gate line, onto the first square inside the east gate; a step
  // in, the inn yard; and out by the gate onto the road's end before it, facing down the road.
  w.world.travel('kilnmouth_l6', HAVEN_GATE.x + 1, HAVEN_GATE.y, WEST);
  const step = w.world.move('forward'), inside = step.kind === 'moved' ? step.messages : [];
  ok(w.world.state.mapId === 'kilnhaven' && w.world.state.x === HAVEN.start.x && w.world.state.y === HAVEN.start.y && w.world.state.facing === WEST && HAVEN_GATE.tx === HAVEN.start.x && HAVEN_GATE.ty === HAVEN.start.y,
    'L6\'s gate lets the company in just inside Kilnhaven\'s east gate, facing down the street');
  ok(inside.join() === 'Kilnhaven: ore on the quay, iron in the air, and the sea. Three ways out, and all of them cost.', `going in, the town's gate line (${inside.join(' / ')})`);
  const yard = w.world.move('forward');
  ok(yard.kind === 'moved' && yard.messages.some((t) => t.startsWith('The inn yard')), `a step inside, the inn yard and the coach for Rime Lodge (${yard.kind === 'moved' ? yard.messages.join(' / ') : yard.kind})`);
  listen(w);
  w.world.travel('kilnhaven', HAVEN.start.x, HAVEN.start.y, EAST);
  const leave = w.world.move('forward');
  ok(leave.kind === 'moved' && w.world.zone?.id === 'kilnmouth_l6' && w.world.state.x - w.world.zone.x === HAVEN_GATE.x + 1 && w.world.state.y - w.world.zone.y === HAVEN_GATE.y && w.world.state.facing === EAST,
    'and out by the east gate onto L6\'s 29,4, the road\'s end before it, facing down the road');
  ok(HAVEN.exits!.length === 1 && HAVEN.exits!.every((e) => !e.shut && !e.needFlag), 'nothing shuts the gate');
  listen(w);

  // A night at the inn, as the business's screen does it (src/ui/screens.ts).
  ok(here('inn').length === 1 && here('temple').length === 1 && here('trainer').length === 1, 'Kilnhaven has an inn to rest at, a chapel that cures and a shed that trains');
  w.party.gold = 30000;
  const inn = here('inn')[0], night = inn.price * w.party.members.length;
  for (const m of w.party.members) { m.hp = 1; m.sp = 0; }
  w.party.gold -= night;
  for (const m of w.party.members) rest(m);
  w.world.sleepUntilMorning();
  ok(w.party.members.every((m) => m.hp === m.maxHp && m.sp === m.maxSp) && w.world.hour >= 6 && w.world.hour <= 9 && w.party.gold === 30000 - night, `a night at ${inn.name} for ${night} gold, and the company wakes whole in the morning`);

  // The smith sells the act's first step at a quarter more than Anvilhall's forge (#535), each class
  // its rung; the chandler's sells the provisions at list price, and no steel.
  ok(SMITHY.stock.length === FORGE.length && FORGE.every((id) => SMITHY.stock.includes(id) && SMITHY.prices?.[id] === SMITH_PRICES[id] && SMITH_PRICES[id] === quarterMore(item(id).price)),
    `the smith sells the forge's ${FORGE.length} wares and nothing else, each at a quarter more (${FORGE.map((id) => `${item(id).name} ${SMITH_PRICES[id]}`).join(', ')})`);
  const rung = ACT_III.find((r) => r.level === 17)!;
  for (const m of w.party.members) for (const id of rung.classes[m.cls]) {
    const before = w.party.gold;
    ok(!!buy(w.party, SMITHY, id) && before - w.party.gold === SMITH_PRICES[id], `${m.name} buys a ${item(id).name} at the smith for ${SMITH_PRICES[id]} gold`);
  }
  const chandler = here('shop').find((f) => f.interior === 'kilnhaven_chandlery')!;
  ok(['rations', 'lantern_oil', 'potion_heal', 'antidote'].every((id) => chandler.stock.includes(id)) && !chandler.stock.some((id) => FORGE.includes(id)) && !chandler.prices, 'the chandler\'s sells the provisions and lamp oil at list price, and no steel');

  // The Stone taken, Anvilhall's forge is shut to the company for good, and the smith is open still.
  const taker = newWalk(ok);
  taker.party.flags[TAKEN] = 1;
  taker.world.travel('kilnhaven', SMITHY.x, SMITHY.y);
  ok(taker.world.present(SMITHY) && taker.world.present(DIETMAR) && !taker.world.present(FORGE_SHOP) && says(taker, DIETMAR).includes('Mine is open'), 'the Stone taken, Anvilhall\'s forge is shut, and the smith is open still and says so');

  // Training to 19 at the ore shed, on a copy, so the company walks on as it was.
  const shed = here('trainer')[0];
  const trainee = structuredClone(w.party.members[0]);
  trainee.level = 18; trainee.xp = xpForLevel(19);
  ok(shed.maxLevel === 19 && shed.interior === 'kilnhaven_training_hall' && canTrainAt(trainee, shed.maxLevel), `${shed.name} will train a member of 18`);
  const fee = trainPrice(trainee);
  levelUp(trainee, makeRng(1), 19);
  ok(trainee.level === 19 && !canTrainAt(trainee, shed.maxLevel), `who trains to 19 for ${fee} gold, and no further`);

  // The manifests, read by the harbourmaster in her office: iron to Cinderport, and the Compact's
  // sealed crates for Cinderport and Sheer Point, the chapter's step (#470); after, her words change.
  ok(here('npc').some((f) => f.interior === 'kilnhaven_harbourmaster' && f.x === IRMGARD.x && f.y === IRMGARD.y), 'the harbourmaster is in her office, a room of its own');
  w.world.travel('kilnhaven', IRMGARD.x, IRMGARD.y);
  const book = says(w, IRMGARD);
  ok(book.includes('Iron to Cinderport, by the ton. Then a page in another hand: crates, sealed, for Cinderport and Sheer Point. No weight given.') && !!w.party.flags[MANIFESTS_READ],
    'she reads the manifests: iron to Cinderport by the ton, and sealed crates for Cinderport and Sheer Point, no weight given');
  ok(says(w, IRMGARD).includes('nobody\'s weight'), 'and after, she writes down what she is told');

  // The dwarf on the quay, who will go no further down.
  w.world.travel('kilnhaven', DWARF.x, DWARF.y);
  const south = says(w, DWARF);
  ok(south.includes('the corridors run south') && south.includes('Toward the lakes') && !!w.party.flags[DWARF_MET], 'a dwarf on the quay says the corridors under the Tiefzeche run south under the world, toward the lakes');

  // The ferry (#539): bought from its master on Kilnhaven's quay for its whole fare, it sails at eight
  // and puts in on Saltmouth's quay two days on at 16:00; a save made there loads there; and its
  // master on Saltmouth's quay sells the way back, warning a company under the Kilns' floor and
  // landing it at the ferry's steps on Kilnhaven's quay.
  const [over, ...more] = DUNSTAN.passage ?? [];
  ok(!!over && !more.length && over.to === 'saltmouth' && over.x === 13 && over.y === 10 && over.fare === FERRY.fare && over.days === FERRY.days, `the ferry's master sells the ferry to Saltmouth's quay, ${over?.fare} gold and ${over?.days} days`);
  const sold = here('npc').flatMap((f) => f.passage ?? []);
  ok(sold.every((p) => !p.half && !p.free), 'and nobody in Kilnhaven halves a fare for any guild');
  w.world.travel('kilnhaven', DUNSTAN.x, DUNSTAN.y);
  w.world.state.minutes = Math.floor(w.world.state.minutes / MINUTES_PER_DAY) * MINUTES_PER_DAY + 9 * 60;
  w.party.gold = FERRY.fare;
  const day = w.world.day, sailed = sail(over, w.world, w.party);
  ok(sailed.taken && w.party.gold === 0 && w.world.state.mapId === 'saltmouth' && w.world.state.x === 13 && w.world.state.y === 10 && w.world.state.facing === WEST, `the ferry lands the company on Saltmouth's quay (${sailed.lines.join(' ')})`);
  ok(w.world.day === day + 3 && w.world.hour === 16, `bought at 09:00, after it sailed, it leaves the next morning and lands two days on at 16:00 (day ${day} to day ${w.world.day})`);
  const kept = deserialize(serialize(w.world.state, w.party, 0)), loaded = new World(buildMaps(), kept.party, makeRng(1), kept.world);
  ok(loaded.state.mapId === 'saltmouth' && loaded.state.x === 13 && loaded.state.minutes === w.world.state.minutes, 'a save made on Saltmouth\'s quay loads there');
  const master = MAP_DEFS.find((d) => d.id === 'saltmouth')!.features!.find((f): f is Person => f.kind === 'npc' && f.name.startsWith('Dunstan'));
  const back = master?.passage?.[0];
  ok(!!back && master!.passage!.length === 1 && back.to === 'kilnhaven' && back.fare === FERRY.fare && back.days === FERRY.days, `on Saltmouth's quay ${master?.name.split(',')[0] ?? 'nobody'}, the same master, sells the ferry back to Kilnhaven`);
  for (const m of w.party.members) m.level = 12;
  const warned = back ? terms(back, w.world) : '';
  ok(warned.endsWith('Dunstan looks you over. "Over there they sell you iron, and the hills take it back off you."'), `to a company of 12 he gives his warning, never a refusal (${warned})`);
  for (const m of w.party.members) m.level = 16;
  w.party.gold = FERRY.fare;
  const home = back ? sail(back, w.world, w.party) : undefined, ashore = home?.taken ? w.world.eventsHere() : [];
  ok(!!home?.taken && w.world.state.mapId === 'kilnhaven' && w.world.state.x === 4 && w.world.state.y === 7 && w.world.state.facing === EAST && w.party.gold === 0,
    `and the ferry back puts the company on Kilnhaven's quay at the ferry's steps, facing up the street (${home?.lines.join(' ')})`);
  ok(home?.lines.join() === FERRY.ends[0].label && ashore.some((t) => t.startsWith('The quay:')), `with Kilnhaven's own landing line, and the quay said as it steps ashore (${ashore.join(' / ')})`);

  // The coach (#539): Rime Lodge is built, so the coachman sells the drove road's coach to the lodge's
  // coach house, a day and its fare; bought after it left it goes the next morning and puts the company
  // down at noon behind the lodge's gate, rested; and the coachman there sells the way back, to the inn
  // yard inside Kilnhaven's east gate, with the town's own landing line.
  const lodge = DROVE_COACH.ends.find((e) => e.at === 'rime_lodge')!.landing!, [run, ...runs] = MURDO.passage ?? [];
  ok(!!run && !runs.length && run.by === 'coach' && run.to === 'rime_lodge' && run.x === lodge.x && run.y === lodge.y && run.fare === DROVE_COACH.fare && run.days === DROVE_COACH.days,
    `Murdo sells the drove road's coach to Rime Lodge's coach house, ${run?.fare} gold and ${run?.days} day`);
  w.world.travel('kilnhaven', MURDO.x, MURDO.y);
  const caution = run ? terms(run, w.world) : '';
  ok(caution.endsWith('Murdo looks you over. "I drive the coach. What comes off the moor at it, you see to."'), `to a company of 16, under the lodge's floor of 20, he gives his warning, never a refusal (${caution})`);
  w.world.state.minutes = Math.floor(w.world.state.minutes / MINUTES_PER_DAY) * MINUTES_PER_DAY + 7 * 60;
  w.party.gold = DROVE_COACH.fare;
  const leaves = w.world.day, rode = sail(run, w.world, w.party);
  ok(rode.taken && w.party.gold === 0 && w.world.state.mapId === 'rime_lodge' && w.world.state.x === lodge.x && w.world.state.y === lodge.y && w.world.state.facing === WEST,
    `the coach sets the company down in Rime Lodge's coach house (${rode.lines.join(' ')})`);
  ok(w.world.day === leaves + 2 && w.world.hour === 12, `bought at 07:00, after it left, it goes the next morning and lands a day on at noon (day ${leaves} to day ${w.world.day})`);
  const coachman = MAP_DEFS.find((d) => d.id === 'rime_lodge')!.features!.find((f): f is Person => f.kind === 'npc' && f.name === 'The coachman');
  const returns = coachman?.passage ?? [], landing = DROVE_COACH.ends.find((e) => e.at === 'kilnhaven')!.landing!;
  ok(returns.length === 1 && returns[0].to === 'kilnhaven' && returns[0].x === landing.x && returns[0].y === landing.y && returns[0].fare === DROVE_COACH.fare && returns[0].days === DROVE_COACH.days,
    'and at the lodge the coachman sells the run back, to Kilnhaven\'s inn yard');
  w.party.gold = DROVE_COACH.fare;
  const landed = returns[0] ? sail(returns[0], w.world, w.party) : undefined, stood = landed?.taken ? w.world.eventsHere() : [];
  ok(!!landed?.taken && w.world.state.mapId === 'kilnhaven' && w.world.state.x === landing.x && w.world.state.y === landing.y && w.world.state.facing === WEST && w.party.gold === 0
    && landed.lines.join() === DROVE_COACH.ends.find((e) => e.at === 'kilnhaven')!.label && HAVEN.rows[landing.y][landing.x] === ':' && Math.abs(landing.x - HAVEN.start.x) + Math.abs(landing.y - HAVEN.start.y) <= 3,
    `the coach back puts the company down in the inn yard just inside the east gate, with the town's own line (${landed?.lines.join(' ')}${stood.length ? ` / ${stood.join(' / ')}` : ''})`);

  // The ship (#539's 2): sold by nobody while its far end, Cinderport, is not built, its master only
  // talking and naming no fare; Kilnhaven has written where the ship's boat puts a company down, on the
  // Compact's steps down the quay, and its far end's seller comes with Cinderport (#512).
  const cinderport = MAP_DEFS.some((d) => d.id === 'cinderport'), cruise = JAGO.passage ?? [];
  ok(cinderport ? cruise.length === 1 && cruise[0].to === 'cinderport' && cruise[0].fare === COMPACT_SHIP.fare : !cruise.length && !sells('kilnhaven', COMPACT_SHIP).length,
    cinderport ? 'Jago sells the Compact ship to Cinderport' : 'Jago sells nothing yet: Cinderport is not built');
  const ship = COMPACT_SHIP.ends.find((e) => e.at === 'kilnhaven')?.landing;
  ok(ship?.x === 4 && ship.y === 12 && HAVEN.rows[ship.y][ship.x] === '"', 'and the ship puts a company down on the Compact\'s steps down the quay');
  // A seller with nothing to sell only talks, and names no fare in his words.
  w.world.travel('kilnhaven', JAGO.x, JAGO.y);
  const shipTalk = says(w, JAGO);
  ok(cinderport || !/gold|fare|hundred/i.test(shipTalk), `Jago's words name no fare, while he sells none (${shipTalk.split('\n\n').at(-1)})`);

  // Tallis's man on the street, come for the parcel from the smelter (#56's 35): the crown never named,
  // and no question put. What is carried down to him is walked in `sideQuests` (#471).
  w.world.travel('kilnhaven', WIEBE.x, WIEBE.y);
  const parcel = says(w, WIEBE);
  ok(HAVEN.rows[WIEBE.y][WIEBE.x] === '"' && !WIEBE.choice && parcel.includes('Jory Tallis') && parcel.includes('a parcel up from the smelter') && !/crown|throne|king/i.test(parcel),
    `Tallis's man waits on the street for a parcel up from the smelter, and names nothing in it (${parcel.split('\n\n').at(-1)})`);
}

/**
 * The Anvil Stone's Rift (#465): in through O5's tear and out again; the lanes, the iron run, the
 * ridge and the slag run down from the back; the groups won at the Rift's floor, 17; the hollow found
 * from the lane whose slag set running up, and the first cutter's tools in it; the Warden won at 17
 * and its heart taken; the tear closed by the first step after it falls, whichever way, which sets
 * the flag the Hearth counts and stops the Rift's groups and the strays outside coming back; the torn
 * ground closed over on O5; and a company gone by Town Portal over the Warden closing it on its first
 * step back in.
 */
function anvilRift(w: Walk, ok: (cond: boolean, msg: string) => void): void {
  const RIFT = MAP_DEFS.find((d) => d.id === 'anvil_stone')!, rift = new GameMap(RIFT);
  const at = (walk: Walk): string => `${walk.world.state.mapId} ${walk.world.state.x},${walk.world.state.y}`;
  w.level = 17;

  // In through the tear from the track beside it, saying the brief's line, at the Rift's start facing
  // up the lanes; stepped back onto, its way out lands beside the tear on O5, facing away from it.
  w.world.travel('kilnsheart_o5', TEAR.x - 1, TEAR.y, EAST);
  const down = w.world.move('forward');
  ok(down.kind === 'moved' && w.world.state.mapId === 'anvil_stone' && w.world.state.x === RIFT.start.x && w.world.state.y === RIFT.start.y && w.world.state.facing === NORTH && down.messages.includes(TEAR.label!),
    `the tear takes the company down into the Rift at its start, facing up the lanes (${at(w)}: ${down.kind === 'moved' ? down.messages.join(' / ') : down.kind})`);
  const off = w.world.move('forward'), back = w.world.move('back'), o5 = w.world.zone;
  ok(off.kind === 'moved' && back.kind === 'moved' && o5?.id === 'kilnsheart_o5' && w.world.state.x - o5.x === TEAR.x && w.world.state.y - o5.y === TEAR.y - 1 && w.world.state.facing === NORTH && back.messages.includes(SLAG.leave),
    `and its way out lands beside the tear on O5, facing away from it (${at(w)}: ${back.kind === 'moved' ? back.messages.join(' / ') : back.kind})`);
  ok(RIFT.exits!.length === 1 && RIFT.exits!.every((e) => !e.shut && !e.needFlag), 'nothing shuts the way out, and nothing the thane said shuts the way in');

  // The lanes: the hum under the ridges, the iron run across the middle lane and the ridge at its
  // head, and the slag run down the west and east lanes from the back.
  for (const id of ['as_lanes', 'as_iron', 'as_ridge', 'as_west', 'as_east']) see(w, `anvil_stone:${id}`);

  // The groups, won at the Rift's floor: four slaglings down the middle lane and four in the west, and
  // two slag elders at the head of each of the west and east lanes. Cold bites them all and fire does
  // half; they come back until the tear is closed, and the Warden never comes back.
  const warden = RIFT.encounters!.find((g) => g.id === 'as_warden')!, rest = RIFT.encounters!.filter((g) => g !== warden);
  const only = (id: string, n: number): number => rest.filter((g) => g.monsters.length === n && g.monsters.every((m) => m === id)).length;
  ok(only('slagling', 4) === 2 && only('slag_elder', 2) === 2 && rest.length === 4 && warden.monsters.join() === 'anvil_warden', 'two groups of slaglings, two of slag elders and the Warden of the Anvil');
  ok([...rest, warden].every((g) => g.monsters.every((m) => !!MONSTERS[m].weak?.includes('cold') && !!MONSTERS[m].resist?.includes('fire'))) && !!MONSTERS.anvil_warden.immune?.includes('asleep'),
    'cold bites everything in the Rift and fire does it half, and the Warden shrugs off sleep');
  ok(rest.every((g) => !!g.respawn && JSON.stringify(g.until) === JSON.stringify(CLOSED)) && !warden.respawn && !warden.until && warden.roams === false,
    'the slaglings and the elders come back until the tear is closed, and the Warden never comes back');
  for (const g of rest) fight(w, `anvil_stone:${g.id}`);

  // The secret: the fourth lane's slag set running up toward the back; searched at its head, the slag
  // gives on a hollow against the Stone's cut face, and the first cutter's tools. Walked, it is never
  // reached but through the slag.
  const reached = (to: readonly [number, number]): boolean => {
    const seen = new Set<number>(), todo = [[RIFT.start.x, RIFT.start.y]];
    while (todo.length) {
      const [x, y] = todo.pop()!, k = y * rift.width + x;
      if (seen.has(k) || !rift.inBounds(x, y) || rift.at(x, y).door === 'secret' || rift.passable(x, y, { swim: true, climb: true, float: true }) !== 'ok') continue;
      seen.add(k);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
    }
    return seen.has(to[1] * rift.width + to[0]);
  };
  ok(!reached([13, 1]) && reached([14, 3]), 'the hollow is reached only through the slag at the head of its lane');
  see(w, 'anvil_stone:as_ripples');
  w.world.travel('anvil_stone', 14, 3, NORTH);
  let gave = false;
  for (let i = 0; i < 20 && !gave; i++) gave = w.world.search();
  const inHollow = gave ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(gave && inHollow.every((r) => r.kind === 'moved') && w.world.used('as_hollow'), 'searched at the lane\'s head, the slag gives, and the hollow behind it can be walked into');
  listen(w);
  const tools = RIFT.features!.find((f) => f.kind === 'chest' && f.id === 'as_hollow_chest');
  ok(tools?.kind === 'chest' && tools.items.join() === 'cutters_pick,cutters_chisel' && tools.gold === 1910 && tools.x === 13 && tools.y === 1, 'against the Stone, the first cutter\'s tools: a pick and a chisel with a plus, and 1,910 gold');

  // The Warden, standing up out of the cut at the back: fought only from the square before the cut,
  // and from there every step goes into the cut or back out of it, each a square that closes the tear.
  const open = (x: number, y: number): [number, number][] => ([[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]] as [number, number][]).filter(([a, b]) => rift.passable(a, b) === 'ok');
  const quiet = (x: number, y: number): boolean => RIFT.features!.some((f) => f.kind === 'event' && f.x === x && f.y === y && f.sets === 'q_anvil_closed' && JSON.stringify(f.after) === JSON.stringify(WARDEN_SLAIN));
  const before = open(warden.x, warden.y);
  ok(before.length === 1 && open(...before[0]).every(([x, y]) => quiet(x, y)), `the Warden is fought only from ${before.join(' ')}, and every step from there closes the tear`);
  see(w, 'anvil_stone:as_back');
  const lit = w.world.stones;
  fight(w, 'anvil_stone:as_warden');
  ok(w.party.bag.includes('anvil_heart') && warden.slainText === 'The red goes out of the slag. The ground stops humming. Up at the cut, the Stone is only a stone.' && !w.party.flags.q_anvil_closed,
    'the Warden falls at 17: the red goes out of the slag, and its heart, the Heart of the Anvil, is taken');

  // The first step after it falls, into the cut or back out of it, says the tear has gone quiet and
  // sets the flag; the other square says nothing more. The Hearth counts the Stone, and the Rift's
  // groups, O5's slaglings and the strays on N3, N5 and O6 come back no more.
  for (const [dx, dy] of [[0, -1], [0, 1]]) {
    const t = dy < 0 ? w : newWalk(ok);
    t.level = 17;
    if (t !== w) { t.world.travel('anvil_stone', warden.x, warden.y + 1, NORTH); t.world.killGroups([warden.id]); }
    t.world.travel('anvil_stone', warden.x, warden.y + 1, NORTH);
    const step = t.world.move(dy < 0 ? 'forward' : 'back');
    ok(step.kind === 'moved' && t.world.state.x === warden.x && t.world.state.y === warden.y + 1 + dy && step.messages.includes(SLAG.quiet) && !!t.party.flags.q_anvil_closed,
      `a step ${dy < 0 ? 'into the cut' : 'back out of it'} after the Warden falls: the tear goes quiet, and its flag is set (${step.kind === 'moved' ? step.messages.join(' / ') : step.kind})`);
    t.world.travel('anvil_stone', warden.x, warden.y + 1 - dy, NORTH);
    ok(!t.world.eventsHere().includes(SLAG.quiet), 'and the other square says nothing more');
  }
  ok(w.world.stones === lit + 1, `the Hearth counts the Anvil Stone (${lit} Stones to ${w.world.stones})`);
  const strays = [...rest, ...O5.encounters!.filter((g) => g.monsters.includes('slagling')), N3.encounters!.find((g) => g.id === 'n3_slaglings')!, N5.encounters!.find((g) => g.id === 'n5_elder')!, O6.encounters!.find((g) => g.id === 'o6_elder')!];
  ok(strays.every((g) => w.world.ended(g)), `the Rift's groups, O5's slaglings and the strays on N3, N5 and O6 come back no more (${strays.map((g) => g.id).join(', ')})`);
  listen(w);

  // Outside, the torn ground has closed over: the tear's line and the Stone's are not said, and the
  // track beside the tear says so.
  w.world.travel('kilnsheart_o5', TEAR.x - 1, TEAR.y);
  const closed = w.world.eventsHere(), shut = O5.features!.find((f) => f.kind === 'event' && f.id === 'o5_closed')!;
  ok(shut.kind === 'event' && closed.join() === shut.text && !w.world.present(O5.features!.find((f) => f.kind === 'event' && f.id === 'o5_stone')!), `beside the track the torn ground has closed over (${closed.join(' / ')})`);

  // A company gone from the Rift another way over the Warden, by Town Portal, has not closed the tear:
  // its first step back in closes it, and so does the track beside the tear, walked up again.
  const away = newWalk(ok);
  away.level = 17;
  away.world.travel('anvil_stone', warden.x, warden.y + 1, NORTH);
  away.world.killGroups([warden.id]);
  away.world.townPortal();
  const open5 = !away.party.flags.q_anvil_closed;
  away.world.travel('kilnsheart_o5', TEAR.x - 1, TEAR.y, EAST);
  const inAgain = [away.world.move('forward'), away.world.move('forward')];
  ok(open5 && inAgain.every((r) => r.kind === 'moved') && away.world.state.mapId === 'anvil_stone' && inAgain[1].kind === 'moved' && inAgain[1].messages.includes(SLAG.quiet) && !!away.party.flags.q_anvil_closed,
    `a company gone by Town Portal over the Warden closes the tear on its first step back into the Rift (${at(away)})`);
  const track = newWalk(ok);
  track.level = 17;
  track.world.travel('anvil_stone', warden.x, warden.y + 1, NORTH);
  track.world.killGroups([warden.id]);
  track.world.townPortal();
  const unlit = track.world.stones, open6 = !track.party.flags.q_anvil_closed;
  track.world.travel('kilnsheart_o5', TEAR.x - 1, TEAR.y);
  const walked = track.world.eventsHere();
  ok(open6 && shut.kind === 'event' && walked.join() === shut.text && !!track.party.flags.q_anvil_closed && track.world.stones === unlit + 1,
    `or walks back up the track beside the tear, which has closed over and closes it, and the Hearth counts the Stone (${walked.join(' / ')})`);
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
  fourthRanks(w);
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
  // Past the Kilns they come up into the world (Rimewater's ice-hole, #487), so the road is read to here.
  const later = new Set(AREAS.slice(AREAS.findIndex((a) => a.id === 'kilns') + 1).flatMap((a) => a.maps.map((d) => d.id)));
  const machines = MAP_DEFS.filter((d) => !later.has(d.id) && (d.encounters ?? []).some((g) => g.monsters.some((m) => MONSTERS[m].kind === 'machine'))).map((d) => d.id);
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

/**
 * Feuerstollen (#466): down O6's adit into the tubes and up again; the fire adit at 16, where the
 * picks broke into a tube, the fire through its floor, the cutters' strongbox in the cooled side tube,
 * the chamber, the bore no fire made and the groups won; down the steep floor to the deep tubes at 17
 * and up again, the groups won, the square tube found from the heat that drops where the walls go
 * square and the plate at its end, which nothing opens; and the Great Salamander won in the deepest
 * chamber, its hide left, never to come back.
 */
function feuerstollen(w: Walk, ok: (cond: boolean, msg: string) => void): void {
  const [L1, L2] = ['lava_tubes', 'lava_tubes2'].map((id) => MAP_DEFS.find((d) => d.id === id)!);
  const at = (): string => `${w.world.state.mapId} ${w.world.state.x},${w.world.state.y}`;
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
  w.level = 16;

  // Down the adit: from under the words it takes the company into the tubes at the adit's foot, facing
  // in; stepped back onto, the adit's foot takes it up and out under the words, facing away.
  w.world.travel('kilnsheart_o6', ADIT.x - 1, ADIT.y, EAST);
  const down = w.world.move('forward');
  ok(down.kind === 'moved' && w.world.state.mapId === 'lava_tubes' && w.world.state.x === L1.start.x && w.world.state.y === L1.start.y && w.world.state.facing === NORTH && down.messages.length === 1 && down.messages[0] === ADIT.label,
    `the adit takes the company down into the tubes at its foot, facing in, and says the way's line and no more (${at()}: ${down.kind === 'moved' ? down.messages.join(' / ') : down.kind})`);
  const off = w.world.move('forward'), back = w.world.move('back');
  const o6 = w.world.zone;
  ok(off.kind === 'moved' && back.kind === 'moved' && o6?.id === 'kilnsheart_o6' && w.world.state.x - o6.x === ADIT.x - 1 && w.world.state.y - o6.y === ADIT.y && w.world.state.facing === WEST && back.messages.length === 1 && back.messages[0] === L1.exits![0].label,
    `and the adit's foot takes it back up, out under the words, facing away from the ridge, with no crossing line said over a way that lands where it left (${at()})`);
  ok([L1, L2].every((d) => (d.exits ?? []).every((e) => !e.shut && !e.needFlag)), 'nothing shuts a way in Feuerstollen: no flag, no reading');

  // The fire adit: the dwarves' cut, timbered, breaking into a tube of black glassy rock, its floor
  // showing the fire through it in places and walked over; nothing hangs on its walls.
  const first = new GameMap(L1);
  ok(L1.bare === true && first.at(4, 11).terrain === 'lava' && first.passable(4, 11) === 'ok' && first.at(7, 13).terrain === 'dirt' && first.at(7, 11).terrain === 'stone',
    'the adit\'s floor is earth, the tube\'s is rock with the fire showing through it in places, walked over, and nothing hangs on its walls');
  for (const id of ['lt1_adit', 'lt1_break', 'lt1_floor', 'lt1_cooled', 'lt1_tracks', 'lt1_chamber', 'lt1_north', 'lt1_slope', 'lt1_climb', 'lt1_bore', 'lt1_rubble', 'lt1_bend']) see(w, `lava_tubes:${id}`);
  // Its groups, each won at its floor: the beetles in the cooled side tube, the salamanders on the
  // chamber's fire and in the north tube, and the rock worm at the bore's end.
  for (const g of L1.encounters!) fight(w, `lava_tubes:${g.id}`);
  see(w, 'lava_tubes:lt1_pack');
  const pack = L1.features!.find((f) => f.kind === 'chest' && f.id === 'lt1_pack_chest');
  ok(pack?.kind === 'chest' && pack.gold === 300 && pack.x === 2 && pack.y === 13, 'in the cooled side tube, under a cutter\'s pack, the strongbox nobody came back for');

  // Down the steep floor to the deep tubes, facing in, and up it again, facing away from the drop.
  walkThrough(w, 'lava_tubes', 7, 2, NORTH, 'lava_tubes2', 1);
  ok(w.world.state.x === L2.start.x && w.world.state.y === L2.start.y && w.world.state.facing === SOUTH, `the steep floor goes down to the deep tubes, facing in (${at()})`);
  w.world.travel('lava_tubes2', L2.start.x, L2.start.y, NORTH);
  const up = w.world.move('forward');
  ok(up.kind === 'moved' && w.world.state.mapId === 'lava_tubes' && w.world.state.x === 7 && w.world.state.y === 2 && w.world.state.facing === SOUTH, `and up again to the first level, facing away from the drop (${at()})`);
  listen(w);

  // The deep tubes (17): the fire under a crust of floor, the choked middle tube, and the groups won.
  walkThrough(w, 'lava_tubes', 7, 2, NORTH, 'lava_tubes2', 1);
  w.level = 17;
  for (const id of ['lt2_in', 'lt2_cross', 'lt2_crust', 'lt2_choked', 'lt2_narrow', 'lt2_east', 'lt2_chamber']) see(w, `lava_tubes2:${id}`);
  for (const g of L2.encounters!.filter((e) => e.id !== 'lt2_great_salamander')) fight(w, `lava_tubes2:${g.id}`);

  // The secret: the heat drops where the tube's walls go square; searched there, it gives on a tube
  // running on square and straight, its floor laid even, and at its end a plate that nothing opens.
  ok(!reached(L2, [L2.start.x, L2.start.y], [2, 12]), 'the square tube is reached only through the opening where the walls go square');
  see(w, 'lava_tubes2:lt2_square');
  w.world.travel('lava_tubes2', 2, 10, SOUTH);
  let opening = false;
  for (let i = 0; i < 20 && !opening; i++) opening = w.world.search();
  const along = opening ? [w.world.move('forward'), w.world.move('forward'), w.world.move('forward')] : [];
  ok(opening && along.every((r) => r.kind === 'moved') && w.world.used('lt2_cut') && w.world.used('lt2_plate'), 'searched where the walls go square, it gives, and the square tube behind can be walked to its end');
  const deep = new GameMap(L2);
  const plate = L2.features!.find((f) => f.kind === 'chest' && f.id === 'lt2_plate_chest');
  ok(plate?.kind === 'chest' && plate.gold === 600 && deep.at(2, 12).terrain === 'floor' && deep.at(2, 9).terrain === 'stone', 'its floor laid even where the tubes\' is rock, and before the plate the picks worn to stubs and 600 gold');
  const ahead = w.world.move('forward');
  ok(ahead.kind === 'blocked' && deep.at(2, 14).door === 'door' && deep.at(2, 14).solid === 'wall' && !deep.exitAt(2, 14) && !LOCKS.some((l) => l.map.startsWith('lava_tubes')),
    `the plate does not open: a wall with a seam drawn in it, and no lock (${ahead.kind === 'blocked' ? ahead.reason : ahead.kind})`);
  listen(w);

  // The Great Salamander in the deepest chamber, won at the deep tubes' floor: it leaves its hide,
  // carried against fire, and never comes back.
  fight(w, 'lava_tubes2:lt2_great_salamander');
  const boss = L2.encounters!.find((e) => e.id === 'lt2_great_salamander')!;
  ok(w.party.bag.includes('salamander_hide') && !!item('salamander_hide').resist?.includes('fire') && !boss.respawn && !!boss.slainText?.includes('hide'),
    'the Great Salamander sinks into its fire and leaves its hide, carried against fire; it never comes back');
}

/**
 * The fourth ranks' asks in the Tiefzeche (DESIGN §8, #439), on a copy of the walk's company made a
 * Reader of the Lanterns and a Sergeant of the Wardens: no hall offers them before Act III, and both
 * once Act II is done; the words read and the cages seen, each is paid at the taking with the words
 * for a company that came early, and the rank waits for the rest of the act's asks.
 */
function fourthRanks(w: Walk): void {
  const p: Party = structuredClone(w.party);
  p.flags[rankFlag('lanterns')] = 3; p.flags[rankFlag('wardens')] = 3;
  const fourth = (g: GuildId): string => offered(g, p).filter((q) => q.rank === 3).map((q) => q.id).join(',');
  w.ok(!fourth('lanterns') && !fourth('wardens'), 'before Act III a Reader and a Sergeant are offered no fourth rank\'s ask');
  p.flags[FOURTH_RANKS_OPEN] = 1;
  w.ok(fourth('lanterns') === 'lanterns_niche,lanterns_ring' && fourth('wardens') === 'wardens_cages,wardens_hole', `with Act II done, the halls offer the fourth ranks' asks (${fourth('lanterns')}; ${fourth('wardens')})`);
  for (const id of ['lanterns_niche', 'wardens_cages']) {
    const q = GUILD_QUESTS.find((g) => g.id === id)!, gold = p.gold;
    const said = take(q, w.world.state, p);
    w.ok(said.length === 1 && said[0].startsWith(q.early![0]) && p.gold === gold + 300 && rankOf(q.guild, p) === 3,
      `${q.title}: done in the walk, paid at the taking, and the rank waits for the rest (${said.join(' ').replace(/\n+/g, ' ')})`);
  }
}

/**
 * The side quests (#471), each at its level and answered every way: the mother's ring carried down to
 * her son at the bottom, who pays and goes up to the inn, and the scraps at her well read by a reader
 * alone; the scholar at Erzkamm's wall taken to the thane and kept at Anvilhall, or his copybook taken,
 * which reads as a Linguist does while it is carried; the crown off Gluthutte's anvil carried down to
 * Tallis's man, who pays and sails, or the thane told, who takes it and the stones; and the three
 * doors' verses heard going down, then the last sung by the oldest miner at Anvilhall.
 */
function sideQuests(ok: (cond: boolean, msg: string) => void): void {
  const at = (level: number): Walk => {
    const w = newWalk(ok);
    w.level = level;
    for (const m of w.party.members) { m.level = level; m.xp = xpForLevel(level); }
    return w;
  };
  const npc = (map: string, name: string): Person => MAP_DEFS.find((d) => d.id === map)!.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
  const page = (w: Walk, id: string) => questLog(w.world.state, w.party).find((v) => v.def.id === id)?.pages[0];
  const goal = (w: Walk, id: string): string => page(w, id)?.goal ?? '(no goal)';
  const began = (w: Walk, title: string): boolean => w.news.includes(`New quest: ${title}.`);
  const there = (w: Walk, map: string, p: Person): boolean => { w.world.travel(map, p.x, p.y); return w.world.present(p); };
  const hear = (w: Walk, map: string, p: Person): string => { w.world.travel(map, p.x, p.y); const said = meet(p, w.party, heard(w.world, p)).text; listen(w); return said; };
  const answerTo = (w: Walk, map: string, p: Person, sets: string): string => {
    w.world.travel(map, p.x, p.y);
    const m = meet(p, w.party, heard(w.world, p)), a = m.choice?.answers.find((x) => x.sets === sets);
    ok(!!a, `${p.name} asks, and an answer sets ${sets} (${m.choice?.ask ?? 'no question'})`);
    const said = a ? answer(a, w.party) : '';
    listen(w);
    return said;
  };
  const reads = (w: Walk, id: string, want: readonly string[], not: readonly string[], how: string): void => {
    const pg = page(w, id), ids = pg?.entries.map((e) => e.id) ?? [], title = pg?.def.title ?? id;
    const done = w.news.filter((n) => n === `Quest complete: ${title}.`).length;
    ok(!!pg?.done && pg.goal === null && want.every((e) => ids.includes(e)) && !not.some((e) => ids.includes(e)) && done === 1,
      `${how}: ${title} is done with no goal, its entries ${ids.join(', ')}, and said complete once (${done})`);
  };
  const xpOf = (w: Walk): number => w.party.members.reduce((t, m) => t + m.xp, 0);
  const signAt = (def: MapDef, id: string): Feature => def.features!.find((f) => f.kind === 'sign' && f.id === id)!;

  // The Crust-Bearer (#56's 33), at 17: the mother at the well asks, and a company that says not now is
  // asked again; her ring taken down to her son at the bottom, he knows it, pays and goes up to the
  // inn, and her words change. The scraps in her well's rope are words to a company with no reader,
  // and read ALL HANDS COUNTED to one with, which the journal keeps.
  {
    const w = at(17);
    const SON = npc('deep_mines3', 'A young dwarf by the ledge'), UP = npc('anvilhall', 'The crust-bearer');
    ok(there(w, 'deep_mines3', SON) && !there(w, 'anvilhall', UP) && hear(w, 'deep_mines3', SON).includes('I bring the crust') && !page(w, 'crust'),
      'her son sits by the crusts at the bottom, nobody is on the inn\'s step, and met first he begins nothing');
    w.world.travel('ironfells_n3', MOTHER.x, MOTHER.y);
    const first = meet(MOTHER, w.party, heard(w.world, MOTHER));
    const not = first.choice?.answers.find((a) => !a.sets);
    ok(!!not && answer(not, w.party).includes('Another day') && !w.party.bag.includes('braid_ring'), 'not now, and she keeps her ring');
    listen(w);
    ok(began(w, 'The Crust-Bearer') && /terrace well/.test(goal(w, 'crust')), `she begins it, and the goal is her answer (${goal(w, 'crust')})`);
    const ring = answerTo(w, 'ironfells_n3', MOTHER, 'q_crust_ring');
    ok(ring.includes('off her braid') && w.party.bag.includes('braid_ring') && /bottom of the Tiefzeche/.test(goal(w, 'crust')), `asked again, she gives her ring for him (${goal(w, 'crust')})`);
    const scraps = signAt(N3, 'n3_scraps');
    w.world.travel('ironfells_n3', scraps.x, scraps.y);
    const plain = w.world.eventsHere();
    listen(w);
    ok(plain.some((t) => t.includes('scraps of cloth')) && !plain.some((t) => t.includes('ALL HANDS COUNTED')) && !page(w, 'crust')?.entries.some((e) => e.id === 'scraps'),
      'the scraps in the well\'s rope are words to a company with no reader, and the journal keeps nothing');
    w.party.members[4].skills = ['linguist'];
    w.world.travel('ironfells_n3', scraps.x, scraps.y);
    ok(w.world.eventsHere().includes(readLine('Maren', 'ALL HANDS COUNTED.')), 'a reader reads them: ALL HANDS COUNTED');
    w.party.members[4].skills = [];
    listen(w);
    const gold = w.party.gold, took = hear(w, 'deep_mines3', SON);
    ok(took.startsWith('He knows the ring') && took.endsWith('(300 gold.)') && w.party.gold === gold + 300 && !w.party.bag.includes('braid_ring'), `her son knows the ring, pays and goes up (${took.split('\n')[0]})`);
    reads(w, 'crust', ['well', 'scraps', 'ring', 'up'], [], 'up');
    ok(!there(w, 'deep_mines3', SON) && there(w, 'anvilhall', UP) && hear(w, 'anvilhall', UP).includes('only knocking') && hear(w, 'ironfells_n3', MOTHER).includes('He is up'),
      'gone from the bottom, he is on the inn\'s step at Anvilhall, and his mother says he is up');
  }

  // The Primer (#56's 34), at 17: the scholar asks whether the thane is told. Taken to the thane, he is
  // kept on the great hall's steps, and the thane pays; or his copybook is taken, and with it in the
  // bag the company reads the wall at Erzkamm as a Linguist does, and put down, it reads nothing.
  const KEPT = npc('anvilhall', 'The scholar from the wall');
  const wall = signAt(N2, 'n2_wall');
  {
    const w = at(17);
    ok(!there(w, 'anvilhall', KEPT), 'nobody is kept on the great hall\'s steps');
    hear(w, 'ironfells_n2', SCHOLAR);
    ok(began(w, 'The Primer') && /scholar at the wall/.test(goal(w, 'primer')), `the scholar begins it (${goal(w, 'primer')})`);
    const gold = w.party.gold, xp = xpOf(w);
    answerTo(w, 'ironfells_n2', SCHOLAR, 'q_primer_kept');
    reads(w, 'primer', ['scholar', 'kept'], ['book'], 'the thane');
    ok(w.party.gold === gold + 500 && xpOf(w) === xp + 900 && !there(w, 'ironfells_n2', SCHOLAR) && there(w, 'anvilhall', KEPT) && hear(w, 'anvilhall', KEPT).includes('for how long') && !w.party.bag.includes('copybook'),
      'the thane: 500 gold and 900 xp, the wall bare of him and he kept on the great hall\'s steps, and no copybook');
  }
  {
    const w = at(17);
    hear(w, 'ironfells_n2', SCHOLAR);
    w.world.travel('ironfells_n2', wall.x, wall.y);
    ok(!w.world.eventsHere().some((t) => t.includes('KEEP CLEAR')), 'without the copybook the company reads nothing on the wall');
    const xp = xpOf(w), took = answerTo(w, 'ironfells_n2', SCHOLAR, 'q_primer_book');
    reads(w, 'primer', ['scholar', 'book'], ['kept'], 'the copybook');
    ok(took.includes('Copied fair') && xpOf(w) === xp + 900 && w.party.bag.includes('copybook') && !there(w, 'ironfells_n2', SCHOLAR) && !there(w, 'anvilhall', KEPT),
      'the copybook: 900 xp, the book in the bag, and he is gone from the wall and kept nowhere');
    w.world.travel('ironfells_n2', wall.x, wall.y);
    ok(w.world.eventsHere().includes(readLine('Bram', 'KEEP CLEAR OF THE DOORS.')), 'with the copybook in the bag, the first standing member reads the wall: KEEP CLEAR OF THE DOORS');
  }

  // A Crown to Order (#56's 35), at 18: begun at Tallis's man in Kilnhaven or at the smith's anvil.
  // Carried down, the parcel goes into Wiebe's hands, who pays and sails, and Tallis owes the company,
  // the flag the Council reads; told, the thane's men take the crown and the stones, and Wiebe waits.
  const WIEBE = npc('kilnhaven', 'Wiebe, Jory Tallis\'s man');
  {
    const w = at(18);
    hear(w, 'kilnhaven', WIEBE);
    ok(began(w, 'A Crown to Order') && /smelter/.test(goal(w, 'crown')), `Tallis's man begins it, and the goal is the smelter (${goal(w, 'crown')})`);
    hear(w, 'kilnsheart_n5', SMITH);
    const xp = xpOf(w), sewn = answerTo(w, 'kilnsheart_n5', SMITH, 'q_crown_carried');
    ok(sewn.includes('sews it shut') && !/\b(Tallis|throne|king)\b/i.test(sewn) && w.party.bag.includes('crown_parcel') && xpOf(w) === xp + 900 && /Wiebe/.test(goal(w, 'crown')),
      `carried: the crown sewn in sacking, 900 xp, and the goal is Wiebe (${goal(w, 'crown')})`);
    const gold = w.party.gold, took = hear(w, 'kilnhaven', WIEBE);
    ok(took.startsWith('He weighs the parcel') && took.endsWith('(800 gold.)') && w.party.gold === gold + 800 && !w.party.bag.includes('crown_parcel') && !!w.party.flags[TALLIS_OWES],
      `Wiebe takes it, pays 800, and Tallis owes the company (${took.split('\n')[0]})`);
    reads(w, 'crown', ['crown', 'man', 'carried', 'sailed'], ['told'], 'sailed');
    ok(!there(w, 'kilnhaven', WIEBE) && hear(w, 'kilnsheart_n5', SMITH).includes('Gone down to the coast') && !hear(w, 'kilnsheart_n5', FACTOR).includes('took the stones'),
      'he is gone on the next boat, the smith has a plain blade on his anvil, and the factor keeps her stones');
  }
  {
    const w = at(18);
    hear(w, 'kilnsheart_n5', SMITH);
    ok(began(w, 'A Crown to Order') && /master smith/.test(goal(w, 'crown')), `the smith begins it (${goal(w, 'crown')})`);
    const xp = xpOf(w);
    answerTo(w, 'kilnsheart_n5', SMITH, 'q_crown_told');
    reads(w, 'crown', ['crown', 'told'], ['carried', 'sailed'], 'told');
    ok(xpOf(w) === xp + 900 && !w.party.flags[TALLIS_OWES] && !w.party.bag.includes('crown_parcel') && hear(w, 'kilnsheart_n5', SMITH).includes('A month\'s work') && hear(w, 'kilnsheart_n5', FACTOR).includes('took the stones') && there(w, 'kilnhaven', WIEBE) && hear(w, 'kilnhaven', WIEBE).includes('Still nothing'),
      'told: 900 xp, Tallis owes nothing, the anvil bare and the stones gone, and Wiebe still waits');
  }

  // The Miners' Hymn (#56's 36), at 18: the oldest miner asks how the doors are sung now; heard going
  // down, the three verses count the doors, and told, he sings the last, the bottom door's. Heard
  // going down first, the doors begin it.
  const OLDEST = npc('anvilhall', 'The oldest miner');
  {
    const w = at(18);
    ok(hear(w, 'anvilhall', OLDEST).includes('Fifty years') && began(w, 'The Miners\' Hymn') && /air doors/.test(goal(w, 'hymn')), `the oldest miner begins it (${goal(w, 'hymn')})`);
    see(w, 'deep_mines:dm1_door1');
    see(w, 'deep_mines:dm1_door2');
    ok(hear(w, 'anvilhall', OLDEST).includes('Fifty years') && !w.party.flags[HYMN_SUNG], 'two doors heard, he has not sung the last');
    see(w, 'deep_mines:dm1_door3');
    listen(w);
    ok(/oldest miner/.test(goal(w, 'hymn')), `the three heard, the goal is the oldest miner (${goal(w, 'hymn')})`);
    const last = hear(w, 'anvilhall', OLDEST);
    ok(last.includes('"Last door, the captain\'s door. Shut, and all hands counted."') && !!w.party.flags[HYMN_SUNG], 'he sings the one they leave out, the bottom door\'s');
    reads(w, 'hymn', ['oldest', 'doors', 'three', 'last'], [], 'sung');
    ok(hear(w, 'anvilhall', OLDEST).includes('Nobody goes down that far'), 'after, he hums the count');
  }
  {
    const w = at(18);
    for (const i of [1, 2, 3]) see(w, `deep_mines:dm1_door${i}`);
    listen(w);
    ok(began(w, 'The Miners\' Hymn') && /oldest miner/.test(goal(w, 'hymn')), `heard going down first, the doors begin it (${goal(w, 'hymn')})`);
    hear(w, 'anvilhall', OLDEST);
    reads(w, 'hymn', ['doors', 'three', 'last'], ['oldest'], 'the doors first');
  }
}

// ---- the chapter (#470) ----

const RIFT = MAP_DEFS.find((d) => d.id === 'anvil_stone')!;
const WARDEN = RIFT.encounters!.find((g) => g.id === 'as_warden')!;

/** A step played at a level, the company levelled to it. */
const atLevel = (level: number, s: Step): Step => ({ name: `${s.name} at ${level}`, play: (w) => {
  for (const m of w.party.members) { m.level = level; m.xp = xpForLevel(level); }
  w.level = level;
  s.play(w);
} });

/** The entries written on the chapter's page. */
const written = (w: Walk): string[] => (quest(w)?.pages.find((p) => p.def === CHAPTER)?.entries ?? []).map((e) => e.id);

/** The way the thane was answered, as the journal names it. */
const named = (way: string): string => (way === BOUGHT ? 'bought' : 'taken');

/** The verse over the kings' forge, read the old way by the Lantern reader in the great hall. */
const VERSE: Step = { name: 'the verse', play: (w) => {
  meetWho(w, VERSE_READ);
  w.ok(written(w).includes('verse'), 'the verse over the kings\' forge, read the old way, is written');
} };

/** The thane's question, answered one way: the Stone bought at its price, or taken. */
const thane = (way: string): Step => ({ name: `the Stone ${named(way)}`, play: (w) => {
  w.world.travel('anvilhall', THANE.x, THANE.y);
  const [buyIt, takeIt] = meet(THANE, w.party, heard(w.world, THANE)).choice?.answers ?? [];
  w.party.gold = way === BOUGHT ? ANVIL_STONE_PRICE : 0;
  answer(way === BOUGHT ? buyIt : takeIt, w.party);
  listen(w);
  w.ok(!!w.party.flags[way] && written(w).includes(named(way)) && !written(w).includes(named(way === BOUGHT ? TAKEN : BOUGHT)), `the Stone ${named(way)}, and that way alone is written`);
} });

/** The Foreman won at the bottom of the Tiefzeche, and the door marked CREW ONLY seen past it. */
const DOOR: Step = { name: 'the door', play: (w) => {
  fight(w, 'deep_mines3:dm3_foreman');
  see(w, 'deep_mines3:dm3_door');
  w.ok(written(w).includes('door'), 'the door marked CREW ONLY is written, with the footprints and the knot');
} };

/**
 * In at the tear under the Stone, past the thane's iron if it was taken; the Warden won, and the first
 * step after it closes the tear, which the Hearth counts.
 */
const stone = (way: string): Step => ({ name: 'the tear closed', play: (w) => {
  if (way === TAKEN) fight(w, 'kilnsheart_o5:o5_guard');
  walkThrough(w, 'kilnsheart_o5', TEAR.x - 1, TEAR.y, EAST, 'anvil_stone', 2);
  const lit = w.world.stones;
  fight(w, 'anvil_stone:as_warden');
  w.world.travel('anvil_stone', WARDEN.x, WARDEN.y + 1, NORTH);
  w.world.move('forward');
  listen(w);
  w.ok(!!w.party.flags.q_anvil_closed && w.world.stones === lit + 1 && written(w).includes('stone'),
    `the Stone ${named(way)}, the tear closes, the Hearth counts it (${lit} Stones to ${w.world.stones}) and it is written`);
} });

/** At Kilnhaven, the harbourmaster's manifests read and the old dwarf heard on the quay. */
const HAVEN: Step = { name: 'the manifests', play: (w) => {
  meetWho(w, MANIFESTS_READ);
  meetWho(w, DWARF_MET);
  w.ok(written(w).includes('manifests') && written(w).includes('corridors'), 'the manifests are written, and the corridors that run south');
} };

/** Down the drove road out of N6 onto Cairnmoor's moor. */
const MOOR: Step = { name: 'onto the moor', play: (w) => walkThrough(w, 'kilnsheart_n6', 3, 29, SOUTH, 'highmoor_n7', 4) };

/**
 * The Anvil Stone (#470), both ways at the thane: in from Lanternwood and played in order, the verse,
 * the thane, the door, the Stone, Kilnhaven and the moor; and with Kilnhaven reached by ferry from
 * Saltmouth first, its manifests before the verse. Played at 16, 17 and 18, each reads the same but for
 * the way in from Lanternwood, never walked by the ferry's company; each ends once, on the moor, where
 * the Ring begins on the drove road out of the Kilns' hills.
 */
function theAnvilStone(ok: (cond: boolean, msg: string) => void): void {
  const master = MAP_DEFS.find((d) => d.id === 'saltmouth')!.features!.find((f): f is Person => f.kind === 'npc' && f.name.startsWith('Dunstan'))!;
  const read: string[] = [];
  for (const first of [false, true]) for (const way of [BOUGHT, TAKEN]) {
    const how = `${first ? 'Kilnhaven first' : 'in order'}, ${named(way)}`;
    const w = newWalk(ok);
    for (const m of w.party.members) { m.level = 16; m.xp = xpForLevel(16); }
    if (first) {
      w.world.travel('saltmouth', master.x, master.y);
      w.party.gold = FERRY.fare;
      const landed = sail(master.passage![0], w.world, w.party);
      listen(w);
      ok(landed.taken && w.world.state.mapId === 'kilnhaven' && quest(w)?.goal === CHAPTER.goals.at(-1)!.text, `${how}, landed at Kilnhaven by ferry the chapter begins, its goal the manifests (${quest(w)?.goal})`);
    } else {
      walkThrough(w, 'lanternwood_m2', 1, 29, SOUTH, 'ironfells_m3', 3);
      ok(quest(w)?.goal === CHAPTER.goals.at(-2)!.text, `${how}, in the Fells from Lanternwood the chapter begins, its goal up the trail to Anvilhall (${quest(w)?.goal})`);
    }
    const steps = first
      ? [atLevel(16, HAVEN), atLevel(16, VERSE), atLevel(16, thane(way)), atLevel(17, DOOR), atLevel(18, stone(way)), atLevel(18, MOOR)]
      : [atLevel(16, VERSE), atLevel(16, thane(way)), atLevel(17, DOOR), atLevel(17, stone(way)), atLevel(18, HAVEN), atLevel(18, MOOR)];
    playChapter(w, CHAPTER, steps, how);
    goalFromBegun(w, how);
    const v = quest(w), ring = v?.pages.find((p) => p.def === RING), ends = w.news.filter((n) => n === `Chapter complete: ${CHAPTER.title}.`).length;
    ok(!!v?.pages.find((p) => p.def === CHAPTER)?.done && ends === 1 && w.world.zone?.id === 'highmoor_n7', `${how}, down the drove road onto the moor the chapter is done, and said so once (${ends})`);
    ok(!!ring?.begun && ring.entries.map((e) => e.id).join() === 'road' && v?.goal === RING.goals.at(-1)!.text && w.news.includes(`New chapter: ${RING.title}.`),
      `${how}, on the moor the Ring takes it on from the drove road out of the Kilns' hills (${v?.goal})`);
    read.push(written(w).join(', '));
  }
  const all = 'road, verse, bought, door, stone, manifests, corridors', taken = all.replace('bought', 'taken');
  ok(JSON.stringify(read) === JSON.stringify([all, taken, all.replace('road, ', ''), taken.replace('road, ', '')]),
    `the chapter reads the same in order and with Kilnhaven first, but for the way in from Lanternwood the ferry's company never walked (${read.join(' / ')})`);
  everyGoalWalked(ok, [CHAPTER]);
}
