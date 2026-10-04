// The Kilns' walkthrough. Its chapter, The Anvil Stone, is #470's, which plays it here; until then,
// the Iron Fells walked. The way in (M3, #457): the east road out of Lanternwood's M2 over the ridge,
// the crossing line read by a company two under the Fells' floor and by one at it, the secret behind
// the walled adit found from its hints, the box's groups won at its floor, and Lanternwood's trees
// shut against L3, so the road is the only way between the two areas. Anvilhall's box (N3, #458): the
// trail on over the line from M3 with nothing said, the spur up to the gate, barred until the town is
// built, five on from M3's milestone; the box's groups won at its floor; the mother at the terrace
// well; and the tithe-cellar found from the ruts, the niche over its wall read by a reader alone.
// Erzkamm (N2, #460): up the open fell out of N3 with nothing said, the box's groups won at its floor,
// the scholar at the wall, and the doors behind the blank face found from the worn floor, the wall
// beside it read by a reader alone; last, the Barbarian's second prestige, taught by Hartmut at the
// cave's mouth (#19): his lesson after his own words, and taught at 19.
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen } from '../../../../tools/walk.ts';
import type { Walk } from '../../../../tools/walk.ts';
import { EAST, NORTH, SOUTH } from '../../../game/types.ts';
import { MAP_DEFS } from '../../index.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { GameMap } from '../../../game/map.ts';
import type { MapZone } from '../../../game/map.ts';
import { meet, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { createCharacter, className, prestigeOf, takePrestige, xpForLevel, PRESTIGES } from '../../../game/party.ts';
import { teach } from '../../../game/prestige.ts';
import { sought, seekId } from '../../../game/seeking.ts';
import { questLog } from '../../../game/quests.ts';
import { makeRng } from '../../../lib/engine/rng.ts';
import { GATE } from './maps/ironfells_n3.ts';

const M3 = MAP_DEFS.find((d) => d.id === 'ironfells_m3')!, N3 = MAP_DEFS.find((d) => d.id === 'ironfells_n3')!, N2 = MAP_DEFS.find((d) => d.id === 'ironfells_n2')!;
const WOODCUTTER = M3.features!.find((f) => f.kind === 'npc' && f.name === 'A woodcutter') as Person;
const MOTHER = N3.features!.find((f) => f.kind === 'npc' && f.name === 'A dwarf woman at the well') as Person;
const SCHOLAR = N2.features!.find((f) => f.kind === 'npc' && f.name === 'A scholar at the wall') as Person;
const HARTMUT = N2.features!.find((f) => f.kind === 'npc' && f.name.startsWith('Hartmut')) as Person;
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
  const doors = shut(n2, [8, 16], [9, 13], [10, 11]);
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
  const behind = face ? [w.world.move('forward'), w.world.move('forward'), w.world.move('forward')] : [];
  ok(face && behind.every((r) => r.kind === 'moved') && w.world.used('n2_doors') && w.world.used('n2_hoard'), 'searched at the blank face, it gives, and the doors behind it and the hoard before them can be walked to');
  listen(w);
  const hoard = N2.features!.find((f) => f.kind === 'chest' && f.id === 'n2_hoard_chest');
  ok(hoard?.kind === 'chest' && hoard.items.includes('mattock+1') && hoard.x === 10 && hoard.y === 11, 'before the doors, the first ore-finders\' hoard, and a Mattock +1 in it');

  ironhide(ok);
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
