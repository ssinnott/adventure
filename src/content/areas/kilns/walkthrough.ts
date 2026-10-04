// The Kilns' walkthrough. Its chapter, The Anvil Stone, is #470's, which plays it here; until then,
// the Iron Fells' way in (M3, #457) walked: the east road out of Lanternwood's M2 over the ridge, the
// crossing line read by a company two under the Fells' floor and by one at it, the secret behind the
// walled adit found from its hints, the box's groups won at its floor, and Lanternwood's trees shut
// against L3, so the road is the only way between the two areas. Then Anvilhall (#459), where a
// company rests, buys the act's first step at the forge and trains to 19; hears the Lantern reader
// read the verse the old way, or reads it first with a reader of its own and hears him read it
// after; learns Linguist of him as a Lantern; and puts the thane's choice both ways, the Stone
// barred to a company short of its price and each way setting its flag and changing the words after;
// taken, the forge shuts for good.
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen } from '../../../../tools/walk.ts';
import type { Walk } from '../../../../tools/walk.ts';
import { NORTH, SOUTH } from '../../../game/types.ts';
import { MAP_DEFS } from '../../index.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { meet, heard, answer, barred, SHORT } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import type { Feature } from '../../../game/map.ts';
import { buy, item } from '../../../game/items.ts';
import { canTrainAt, xpForLevel, rest, trainPrice, levelUp } from '../../../game/party.ts';
import { makeRng } from '../../../lib/engine/rng.ts';
import { mayLearn, learn, hasSkill } from '../../../game/skills.ts';
import { rankFlag } from '../../guilds.ts';
import { readLine } from '../../../game/inscriptions.ts';
import { ACT_III } from '../../../../tools/tests/ladder.ts';
import { FORGE, ANVIL_STONE_PRICE } from './items.ts';
import { VERSE_READ, BOUGHT, TAKEN } from './maps/anvilhall.ts';

const M3 = MAP_DEFS.find((d) => d.id === 'ironfells_m3')!;
const WOODCUTTER = M3.features!.find((f) => f.kind === 'npc' && f.name === 'A woodcutter') as Person;
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

  // The trail runs on out of the east edge for N3, and past it, for now, the world ends.
  ok(out.at(m3.x + 31, m3.y + 27).ch === '=' && out.at(m3.x + 31, m3.y + 28).ch === '=' && out.passable(m3.x + 32, m3.y + 27) !== 'ok',
    'the trail leaves M3 by its east edge, and past it, for now, the world ends');

  // The woodcutter at the camp, with his word on what the dwarves sell.
  w.world.travel('ironfells_m3', WOODCUTTER.x, WOODCUTTER.y);
  const said = meet(WOODCUTTER, w.party, heard(w.world, WOODCUTTER)).text;
  ok(said.includes('down the road by night'), 'the woodcutter says the dwarves sell something in little boxes, and it goes down the road by night');

  // The box's groups, each won at its floor: the beetles on the spoil and the worm in the adit's cut.
  for (const g of M3.encounters!) fight(w, `ironfells_m3:${g.id}`);

  // The secret: the ruts off the road and the swept foot of the wall, then the search there and the
  // Hand's stage behind it. Walked, waded, climbed or floated, the stage is never reached but
  // through the wall.
  const shut = (from: [number, number], door: [number, number], prize: [number, number]): { size: number; reached: boolean } => {
    const seen = new Set<number>(), todo = [[m3.x + from[0], m3.y + from[1]]];
    while (todo.length) {
      const [x, y] = todo.pop()!, k = y * out.width + x;
      if (seen.has(k) || (x === m3.x + door[0] && y === m3.y + door[1]) || !(x >= m3.x && x < m3.x + m3.w && y >= m3.y && y < m3.y + m3.h) || out.passable(x, y, { swim: true, climb: true, float: true }) !== 'ok') continue;
      seen.add(k);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
    }
    return { size: seen.size, reached: seen.has((m3.y + prize[1]) * out.width + m3.x + prize[0]) };
  };
  const stage = shut([23, 28], [23, 29], [23, 30]);
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

  anvilhall(w, ok);
};

/**
 * Anvilhall (#459): the gate's line; a night at the inn, the forge's step bought, training to 19; the
 * verse read the old way by the Lantern reader, or by the company's own reader first; Linguist taught
 * to a Lantern; and the thane's choice both ways.
 */
function anvilhall(w: Walk, ok: (cond: boolean, msg: string) => void): void {
  // In at the gate, by the door in the hill. The gate lets the company out again onto N3, before the
  // gate, whatever the thane was told: nothing shuts it.
  w.world.travel('anvilhall', TOWN.start.x, TOWN.start.y, NORTH);
  const inside = w.world.eventsHere();
  ok(inside.length === 1 && inside[0].startsWith('A door in the hill, iron-bound, and the hammering behind it.'), `inside the gate, the door in the hill and the words cut over it (${inside.join(' / ')})`);
  ok(TOWN.exits!.length === 1 && TOWN.exits!.every((e) => e.to === 'ironfells_n3' && !e.shut && !e.needFlag), 'its gate leads out onto N3, and nothing shuts it');
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
