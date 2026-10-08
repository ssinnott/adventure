// Rimewater's walkthrough. Its chapter, The Sleepers, is #492's, which plays it here; until then, Rime
// Lodge's box (M9, #486) walked: down from the Cairnfield's notch onto the road's foot under the fells,
// the loch's crossing line said at each level, and back up; the road square to square to the lodge's
// gate and on over the causeway to the west edge for L9; the milestone, counted along the roads; the
// coach yard, with nobody on the box selling the coach; the lodge-keeper at the hole's fire, the man at
// its foot and the guide at the glacier's edge; the box's groups won at its floor, the pike under the
// ice; and the guide's hollow behind the glacier's one bare face. Then Rime Lodge (#487), in at the gate
// and the lake wall's door and out by each: a company of 20 rests, buys the act's last step at the
// furrier's, studies to the seventh tier at the Lanterns' hall and trains to 23; the coach's landing in
// the coach house; and the four nights, a stay at the inn each and the arrivals in the yard every
// morning, the hole's fight on the fourth only, and the girl out of the hole after it, who sets the
// lock's flag. Then the long loch's shore (L9, #488): in from M9 by the road, walked; the road over the
// ridge and out by the south edge, where the pass for K10 is taken, shut until K10 is built; the
// milestone on the ridge; the drover by the road and his bell; the lookout over both lochs; the box's
// groups, the pike under the loch's ice and the bear alone the hardest; and the drovers' summer shieling
// under the drift at the end of the posts.
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen } from '../../../../tools/walk.ts';
import { EAST, NORTH, SOUTH, WEST } from '../../../game/types.ts';
import type { Feature } from '../../../game/map.ts';
import { ATLAS, MAP_DEFS, MONSTERS } from '../../index.ts';
import { DROVE_COACH } from '../../crossings.ts';
import { buy, item } from '../../../game/items.ts';
import { CLASSES, canTrainAt, xpForLevel, rest, stayNight, trainPrice, levelUp, guildFlag } from '../../../game/party.ts';
import { spellsFor } from '../../../game/spells.ts';
import { makeRng } from '../../../lib/engine/rng.ts';
import { ACT_III } from '../../../../tools/tests/ladder.ts';
import { FURRIER } from './items.ts';
import { INTERIORS } from './interiors.ts';
import { NIGHTS, WENNA_UP } from './maps/rime_lodge.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { worldGrid } from '../../../game/atlas.ts';
import { meet, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { NOTCH } from '../cairnmoor/maps/cairnfield_n8.ts';
import { UP, GATE, LAKE_DOOR } from './maps/longmere_m9.ts';
import { PASS } from './maps/longmere_l9.ts';
import type { Walk } from '../../../../tools/walk.ts';
import { GUILD_QUESTS } from '../../index.ts';
import { rankFlag, takenFlag, doneFlag } from '../../guilds.ts';
import { take, rankOf } from '../../../game/guilds.ts';
import type { Party } from '../../../game/party.ts';
import { FOURTH_RANKS_OPEN } from '../kilns/guilds.ts';

/**
 * The Wardens' fourth rank's ask at the ice-hole (DESIGN §8, #439), on a copy of the walk's company made
 * a Sergeant who has found the Tiefzeche's cages, Act II done: the fourth night fought, the ask is paid
 * at the taking, with the words for a company that came early, and the company is a Captain.
 */
function captain(w: Walk): void {
  const p: Party = structuredClone(w.party);
  p.flags[rankFlag('wardens')] = 3; p.flags[FOURTH_RANKS_OPEN] = 1;
  p.flags[takenFlag('wardens_cages')] = p.flags[doneFlag('wardens_cages')] = 1;
  const q = GUILD_QUESTS.find((g) => g.id === 'wardens_hole')!;
  const said = take(q, w.world.state, p);
  w.ok(said.length === 2 && said[0].startsWith(q.early![0]) && said[1] === 'Your rank with the Wardens is now Captain.' && rankOf('wardens', p) === 4,
    `the fourth night fought, the Wardens' ask is paid at the taking, and a company that found the cages is made a Captain (${said.join(' ').replace(/\n+/g, ' ')})`);
}

const M9 = MAP_DEFS.find((d) => d.id === 'longmere_m9')!;
const L9 = MAP_DEFS.find((d) => d.id === 'longmere_l9')!;
const LOCH = ATLAS.zones.find((z) => z.id === 'longmere')!;
const person = (def: typeof M9, name: string): Person => def.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
const TOWN = MAP_DEFS.find((d) => d.id === 'rime_lodge')!;
const business = <K extends Feature['kind']>(kind: K): Extract<Feature, { kind: K }>[] => TOWN.features!.filter((f): f is Extract<Feature, { kind: K }> => f.kind === kind);

export const walkthrough: Walkthrough = (ok) => {
  const w = newWalk(ok);
  const out = buildMaps()[OUTDOORS];
  const m9 = out.zones.find((z) => z.id === 'longmere_m9')!, n8 = out.zones.find((z) => z.id === 'cairnfield_n8')!;
  const l9 = out.zones.find((z) => z.id === 'longmere_l9')!;
  w.level = 20;
  for (const m of w.party.members) m.level = 20;

  // Down: from the Cairnfield's road's last square through the notch onto the road's foot under the
  // fells' cleft, facing the lodge. After the notch's own line the loch's, as at a border walked
  // (#166): at its floor the name alone, two under the rest in its own words, three under the harsher
  // and the road back over the fells still open.
  const notch = (level: number): string[] => {
    for (const m of w.party.members) m.level = level;
    w.world.travel('cairnfield_n8', NOTCH.x + 1, NOTCH.y, WEST);
    const r = w.world.move('forward');
    return r.kind === 'moved' ? r.messages : [r.kind];
  };
  const low = notch(17), two = notch(18), down = notch(20);
  ok(w.world.zone?.id === 'longmere_m9' && w.world.state.x === m9.x + NOTCH.tx && w.world.state.y === m9.y + NOTCH.ty && w.world.state.facing === WEST,
    'through the notch at N8\'s 0,28 onto M9\'s 22,8, facing west');
  ok(down.join(' / ') === `${NOTCH.label} / Loch Fada.`, `at 20, the notch's line and then the loch named, no more (${down.join(' / ')})`);
  ok(two.join(' / ') === `${NOTCH.label} / Loch Fada. ${LOCH.crossing?.harder}`, `at 18, the rest in the loch's own words (${two.join(' / ')})`);
  ok(low.join(' / ') === `${NOTCH.label} / Loch Fada. ${LOCH.crossing?.warning}` && /road back over the fells is still open/.test(low[1] ?? ''),
    `at 17, the harsher words, and the road back still open (${low.join(' / ')})`);
  ok(M9.start.x === NOTCH.tx && M9.start.y === NOTCH.ty && !M9.exits!.some((e) => e.x === NOTCH.tx && e.y === NOTCH.ty) && UP.x === NOTCH.tx + 1 && UP.y === NOTCH.ty,
    'the landing is the box\'s way in and no way out, and the way back up is the square beside it');
  // Back up from the square beside the landing: straight back within the hour, the way's own line
  // alone; come to it from elsewhere, the Cairnfield's line as the border walked from High Moor says it.
  w.world.travel('longmere_m9', NOTCH.tx, NOTCH.ty, EAST);
  const up = w.world.move('forward');
  ok(up.kind === 'moved' && w.world.zone?.id === 'cairnfield_n8' && w.world.state.x === n8.x + UP.tx && w.world.state.y === n8.y + UP.ty && w.world.state.facing === EAST && UP.tx === NOTCH.x + 1 && UP.ty === NOTCH.y
    && up.messages.join(' / ') === UP.label, `up from M9's 23,8 onto N8's 1,28, facing east, beside the notch; straight back, its own line alone (${up.kind === 'moved' ? up.messages.join(' / ') : up.kind})`);
  for (const m of w.party.members) m.level = 17;
  w.world.travel('highmoor_n7', 7, 30, SOUTH);
  const walked: string[] = [];
  for (let i = 0; i < 3 && w.world.zone?.id !== 'cairnfield_n8'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') walked.push(...r.messages); }
  w.world.travel('longmere_m9', NOTCH.tx, NOTCH.ty, EAST);
  const again = w.world.move('forward'), line = walked.find((m) => m.startsWith('The Cairnfield.'));
  ok(again.kind === 'moved' && !!line && line !== 'The Cairnfield.' && again.messages.join(' / ') === `${UP.label} / ${line}`,
    `at 17, up through the notch the Cairnfield's line, as walked over from High Moor (${again.kind === 'moved' ? again.messages.join(' / ') : again.kind}; walked: ${line})`);
  for (const m of w.party.members) m.level = 20;

  // The road square to square from the landing to the gate's front, and from there down beside the
  // lodge, over the loch's head on the causeway and out by the west edge at 0,20 onto L9's road.
  const road = (x: number, y: number): boolean => out.at(x, y).ch === '=';
  const reach = (fx: number, fy: number, along: (x: number, y: number) => boolean): Map<number, number> => {
    const d = new Map([[fy * out.width + fx, 0]]), q = [[fx, fy]];
    for (let i = 0; i < q.length; i++) {
      const [x, y] = q[i], n = d.get(y * out.width + x)!;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = (y + dy) * out.width + x + dx; if (!d.has(k) && along(x + dx, y + dy)) { d.set(k, n + 1); q.push([x + dx, y + dy]); } }
    }
    return d;
  };
  const on = (z: typeof m9) => (x: number, y: number): boolean => x >= z.x && x < z.x + z.w && y >= z.y && y < z.y + z.h;
  const onM9 = on(m9), onL9 = on(l9);
  const byRoad = reach(m9.x + NOTCH.tx, m9.y + NOTCH.ty, (x, y) => road(x, y) && onM9(x, y));
  ok(byRoad.has((m9.y + GATE.y) * out.width + m9.x + GATE.x + 1) && byRoad.has((m9.y + 20) * out.width + m9.x),
    'the road runs square to square over M9 from the landing to the gate\'s front at 19,8, and on over the causeway to the west edge at 0,20');
  ok(road(m9.x, m9.y + 20) && road(m9.x - 1, m9.y + 20) && l9.x + l9.w === m9.x, 'the road leaves M9 by its west edge at 0,20 onto L9\'s at 31,20');

  // The gate in the lodge's east wall, and the door in its lake wall onto the ice: doors, the ways
  // into Rime Lodge (#487), walked below.
  ok(M9.exits!.includes(GATE) && M9.exits!.includes(LAKE_DOOR) && GATE.to === 'rime_lodge' && LAKE_DOOR.to === 'rime_lodge'
    && out.at(m9.x + GATE.x, m9.y + GATE.y).door === 'door' && out.at(m9.x + LAKE_DOOR.x, m9.y + LAKE_DOOR.y).door === 'door' && out.at(m9.x + LAKE_DOOR.x, m9.y + LAKE_DOOR.y + 1).terrain === 'ice',
    'the gate at 18,8 and the lake wall\'s door at 13,10, onto the ice, are doors, the ways into Rime Lodge');

  // The milestones, counted along the roads at 13 squares to the unit, a stone saying 1 for anything
  // under it: to the lodge's gate, and on along the drove road, the atlas's beyond the boxes built, to
  // the high pass out of Loch Fuar.
  const grid = worldGrid(ATLAS, MAP_DEFS);
  const drove = (x: number, y: number): boolean => road(x, y) || (!out.zoneAt(x, y) && !!grid.road[y * out.width + x]);
  const corner = (along: (x: number, y: number) => boolean) => (x: number, y: number): boolean => along(x, y) || ((out.passable(x, y) === 'ok' || !out.zoneAt(x, y)) && [-1, 1].some((d) => along(x + d, y)) && [-1, 1].some((d) => along(x, y + d)));
  const [px, py] = ATLAS.links.find((l) => l.from === 'coldmere' && l.to === 'monksvale')!.a!;
  const units = (n: number): number => Math.max(1, Math.round(n / 13));
  const counted = (z: typeof m9, def: typeof M9, id: string): { says: boolean; toLodge: number; toPass: number } => {
    const stone = def.features!.find((f) => f.kind === 'event' && f.id === id)!;
    const [sx, sy] = [z.x + stone.x, z.y + stone.y];
    const fromStone = reach(sx, sy, corner(drove));
    const toLodge = (fromStone.get((m9.y + GATE.y) * out.width + m9.x + GATE.x + 1) ?? Infinity) + 1;
    const end = [...fromStone].map(([k, n]) => ({ n, left: Math.abs(k % out.width - px) + Math.abs(Math.floor(k / out.width) - py) }))
      .reduce((a, b) => (b.left < a.left || (b.left === a.left && b.n < a.n) ? b : a));
    const toPass = end.n + end.left;
    const says = road(sx, sy) && stone.kind === 'event' && stone.text.includes(`RIME LODGE ${units(toLodge)},`) && stone.text.includes(`THE PASS ${units(toPass)}.`);
    return { says, toLodge, toPass };
  };
  const m9Stone = counted(m9, M9, 'm9_milestone');
  ok(m9Stone.says, `the milestone says RIME LODGE ${units(m9Stone.toLodge)} and THE PASS ${units(m9Stone.toPass)}: ${m9Stone.toLodge} squares along the road to the lodge's gate and ${m9Stone.toPass} to the high pass`);

  // The coach yard outside the gate; the coach and its coachman are the town's (#487, #539), so nobody
  // on the box sells its passage.
  see(w, 'longmere_m9:m9_yard');
  ok(!M9.features!.some((f) => f.kind === 'npc' && f.passage), 'nobody on the box sells the coach: its coachman is the town\'s');

  // The hole's fire and its keeper, a Lantern, with the lodge-keepers' word of the glacier; the man on
  // the shelf of ice at its foot; and the guide at the glacier's edge, building her cairn.
  see(w, 'longmere_m9:m9_hole');
  const said = (def: typeof M9, name: string): string => { const p = person(def, name); w.world.travel(def.id, p.x, p.y); return meet(p, w.party, heard(w.world, p)).text; };
  ok(said(M9, 'A lodge-keeper').includes('glacier gives nothing back'), 'the lodge-keeper at the hole\'s fire says the glacier gives nothing back');
  ok(said(M9, 'A man at the hole').includes('went back down'), 'the man on the shelf of ice under the hole\'s lip says she went back down');
  ok(said(M9, 'A guide').includes('where the sky meets the ice'), 'the guide at the glacier\'s foot took a party up to where the sky meets the ice');
  see(w, 'longmere_m9:m9_guide_cairn');
  listen(w);

  // The box's groups, each won at its floor: the lynxes in the pines, the pike under the loch's ice,
  // on it, and the bears at the glacier's edge, the hardest.
  for (const g of M9.encounters!.filter((e) => e.under)) ok(g.under === 'ice' && out.at(m9.x + g.x, m9.y + g.y).terrain === 'ice', `${g.id} lives under the loch's ice`);
  for (const g of M9.encounters!.filter((e) => !e.after)) fight(w, `longmere_m9:${g.id}`);

  // The secret: the glacier's foot, snow on every face but one, the search there and the hollow behind
  // the bare face. Walked, waded, climbed or floated, it is never reached but through the face.
  const shut = (z: typeof m9, from: [number, number], door: [number, number], prize: [number, number]): { size: number; reached: boolean } => {
    const seen = new Set<number>(), todo = [[z.x + from[0], z.y + from[1]]], inside = on(z);
    while (todo.length) {
      const [x, y] = todo.pop()!, k = y * out.width + x;
      if (seen.has(k) || (x === z.x + door[0] && y === z.y + door[1]) || !inside(x, y) || out.passable(x, y, { swim: true, climb: true, float: true }) !== 'ok') continue;
      seen.add(k);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
    }
    return { size: seen.size, reached: seen.has((z.y + prize[1]) * out.width + z.x + prize[0]) };
  };
  const hollow = shut(m9, [28, 24], [29, 24], [30, 24]);
  ok(hollow.size > 600 && !hollow.reached, `the hollow is shut but for the bare face: none of M9's ${hollow.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'longmere_m9:m9_glacier');
  w.world.travel('longmere_m9', 28, 24, EAST);
  let opens = false;
  for (let i = 0; i < 20 && !opens; i++) opens = w.world.search();
  const into = opens ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(opens && into.every((r) => r.kind === 'moved') && w.world.used('m9_hollow'), 'searched at the bare face, a way opens, and the hollow behind it can be walked into');
  listen(w);
  const kit = M9.features!.find((f) => f.kind === 'chest' && f.id === 'm9_hollow_kit');
  ok(kit?.kind === 'chest' && kit.items.includes('ice_axe+1') && kit.x === 30 && kit.y === 24, 'in the hollow, the lost guide\'s kit and her Ice Axe +1');

  // Rime Lodge (#487). In at M9's gate onto the town's start inside its own, saying the town's gate
  // line, and a step in the stockade; out again onto the road's end before the gate. In off the ice by
  // the lake wall's door onto the inn's yard, and out again onto the ice. Neither way back lands on a
  // way in, and nothing shuts either.
  w.world.travel('longmere_m9', GATE.x + 1, GATE.y, WEST);
  const gate = w.world.move('forward'), inside = gate.kind === 'moved' ? gate.messages : [];
  ok(w.world.state.mapId === 'rime_lodge' && w.world.state.x === TOWN.start.x && w.world.state.y === TOWN.start.y && w.world.state.facing === WEST && GATE.tx === TOWN.start.x && GATE.ty === TOWN.start.y,
    'M9\'s gate lets the company in at the town\'s start inside its own gate, facing west');
  ok(inside.join() === GATE.label, `going in, the gate line (${inside.join(' / ')})`);
  const first = w.world.move('forward');
  ok(first.kind === 'moved' && first.messages.some((t) => t.startsWith('Inside the stockade')), `a step inside, the stockade (${first.kind === 'moved' ? first.messages.join(' / ') : first.kind})`);
  listen(w);
  const landed = (x: number, y: number, facing: number): boolean => w.world.zone?.id === 'longmere_m9' && w.world.state.x - w.world.zone.x === x && w.world.state.y - w.world.zone.y === y && w.world.state.facing === facing;
  w.world.travel('rime_lodge', TOWN.start.x, TOWN.start.y, EAST);
  ok(w.world.move('forward').kind === 'moved' && landed(GATE.x + 1, GATE.y, EAST), 'and out at the gate onto the road\'s end before it, 19,8, facing east');
  w.world.travel('longmere_m9', LAKE_DOOR.x, LAKE_DOOR.y + 1, NORTH);
  const yard = w.world.move('forward');
  ok(yard.kind === 'moved' && w.world.state.mapId === 'rime_lodge' && w.world.state.x === LAKE_DOOR.tx && w.world.state.y === LAKE_DOOR.ty && w.world.state.facing === NORTH && yard.messages.join() === LAKE_DOOR.label,
    `in off the ice by the lake wall's door onto the inn's yard at ${LAKE_DOOR.tx},${LAKE_DOOR.ty}, facing north (${yard.kind === 'moved' ? yard.messages.join(' / ') : yard.kind})`);
  w.world.travel('rime_lodge', LAKE_DOOR.tx, LAKE_DOOR.ty, SOUTH);
  ok(w.world.move('forward').kind === 'moved' && landed(LAKE_DOOR.x, LAKE_DOOR.y + 1, SOUTH) && out.at(w.world.state.x, w.world.state.y).terrain === 'ice', 'and out by it onto the ice at 13,11, facing the hole');
  ok(TOWN.exits!.length === 2 && TOWN.exits!.every((e) => e.to === 'longmere_m9' && !e.shut && !e.needFlag && !M9.exits!.some((x) => x.x === e.tx && x.y === e.ty)),
    'nothing shuts either way, and neither way back lands on a way in');
  listen(w);

  // A company of 20 rests, buys the act's last step at the furrier's, studies to the seventh tier at
  // the Lanterns' fourth hall and trains to 23, each as the business's screen does it (src/ui/screens.ts).
  ok(business('inn').length === 1 && business('temple').length === 1 && business('guild').length === 1 && business('trainer').length === 1 && business('shop').length === 2
    && INTERIORS.every((id) => TOWN.features!.some((f) => 'interior' in f && f.interior === id)), 'Rime Lodge has its six businesses, each opening into its room: the inn, the hall, the temple, the furrier\'s, the provisioner\'s and the yard');
  w.party.gold = 40000;
  const furrier = business('shop').find((f) => f.interior === 'rime_furrier')!, rung = ACT_III.find((r) => r.level === 21)!;
  ok(furrier.stock.length === FURRIER.length && FURRIER.every((id) => furrier.stock.includes(id)), `the furrier's sells the act's last step, all ${FURRIER.length} wares and nothing else`);
  for (const m of w.party.members) for (const id of rung.classes[m.cls]) ok(!!buy(w.party, furrier, id), `${m.name} buys a ${item(id).name} at the furrier's`);
  const stores = business('shop').find((f) => f.interior === 'rime_provisioner')!;
  ok(['rations', 'lantern_oil', 'potion_heal', 'antidote'].every((id) => stores.stock.includes(id)) && !stores.stock.some((id) => FURRIER.includes(id)), 'the provisioner\'s sells provisions and lamp oil, and no gear');
  const hall = business('guild')[0];
  ok(hall.hall === 'lanterns' && hall.interior === 'rime_hall' && hall.maxTier === 7, `the Lanterns' fourth hall teaches to the seventh tier (${hall.name})`);
  const caster = w.party.members.find((m) => CLASSES[m.cls].spells && hall.classes.includes(m.cls))!;
  const seventh = spellsFor(CLASSES[caster.cls].spells!, hall.maxTier!).find((sp) => sp.level === 7 && !caster.spells.includes(sp.id))!;
  // The fee to study, once, then the spell at the hall's price for its tier (spellPrice: 40 doubling a tier).
  const before = w.party.gold, price = 40 * 2 ** (seventh.level - 1);
  w.party.gold -= hall.fee; w.party.flags[guildFlag(hall.name)] = 1;
  w.party.gold -= price; caster.spells.push(seventh.id);
  ok(w.party.gold === before - hall.fee - price && caster.spells.includes(seventh.id), `${caster.name} pays the hall's fee of ${hall.fee} and learns ${seventh.name} for ${price}`);
  const drill = business('trainer')[0];
  // Trained on a copy, so the company walks on as it was.
  const trainee = structuredClone(w.party.members[0]);
  trainee.level = 22; trainee.xp = xpForLevel(23);
  ok(drill.maxLevel === 23 && drill.interior === 'rime_yard' && canTrainAt(trainee, drill.maxLevel), `${drill.name} will train a member of 22`);
  const fee = trainPrice(trainee);
  levelUp(trainee, makeRng(1), 23);
  ok(trainee.level === 23 && !canTrainAt(trainee, drill.maxLevel), `who trains to 23 for ${fee} gold, and no further`);

  // The coach (#539): Rime Lodge's end lands in the coach house, and its coachman there sells the run
  // once Kilnhaven's end lands too (#469), and not before.
  const ours = DROVE_COACH.ends.find((e) => e.at === 'rime_lodge')!, far = DROVE_COACH.ends.find((e) => e.at !== 'rime_lodge')!;
  const coachman = TOWN.features!.find((f) => f.kind === 'npc' && f.name === 'The coachman') as Person;
  ok(!!ours.landing && !ours.owed && TOWN.rows[ours.landing.y][ours.landing.x] === ':' && (coachman.passage ?? []).length === (far.landing ? 1 : 0),
    `the coach lands in the coach house at ${ours.landing?.x},${ours.landing?.y}, and its coachman sells the run once Kilnhaven lands (${far.owed ?? 'landed'})`);

  // The four nights: a stay at the inn each, as its screen does it, and the morning after the night's
  // arrivals in the yard outside its door; the hole's fight, up on M9's ice, comes on the fourth only.
  const inn = business('inn')[0], night = inn.price * w.party.members.length;
  const hole = M9.encounters!.find((e) => e.id === 'm9_night_4')!, girl = person(M9, 'A girl out of the hole');
  const risen = (): boolean => { w.world.travel('longmere_m9', hole.x, hole.y - 1); return w.world.walks(hole, m9.x + hole.x, m9.y + hole.y); };
  ok(inn.interior === 'rime_inn' && JSON.stringify(inn.nights) === JSON.stringify(NIGHTS), `${inn.name} counts the nights, ${NIGHTS.join(', ')}`);
  for (const [i, flag] of NIGHTS.entries()) {
    ok(!risen(), `before the ${['first', 'second', 'third', 'fourth'][i]} night, nothing on the ice at the hole but its fire`);
    w.party.gold -= night;
    for (const m of w.party.members) rest(m);
    w.world.sleepUntilMorning();
    const set = stayNight(w.party, inn.nights);
    ok(set === flag && NIGHTS.every((n, j) => !!w.party.flags[n] === j <= i), `a night at ${inn.name} for ${night} gold sets ${set}, and only the nights so far`);
    w.world.travel('rime_lodge', inn.x + 1, inn.y);
    const morning = w.world.eventsHere();
    ok(morning.length === 1 && morning[0].startsWith('Morning'), `the morning after, outside the inn's door: ${morning.join(' / ')}`);
    listen(w);
  }
  ok(risen() && out.at(m9.x + hole.x, m9.y + hole.y).terrain === 'ice' && hole.roams === false && !hole.respawn, 'after the fourth, up through the hole onto the ice, a group that waits there and comes the once');
  ok(hole.monsters[0] === 'tallyman' && hole.monsters.filter((m) => m === 'knocker').length === 6 && hole.monsters.length === 7 && (MONSTERS.tallyman.calls?.monsters ?? []).every((m) => m === 'knocker'),
    'a tallyman and six knockers, and the tallyman calls more');
  w.world.travel('longmere_m9', girl.x, girl.y);
  ok(!w.world.present(girl), 'before the fight, nobody else is out of the hole');
  fight(w, 'longmere_m9:m9_night_4');
  captain(w);
  w.world.travel('longmere_m9', girl.x, girl.y);
  const words = meet(girl, w.party, heard(w.world, girl)).text;
  ok(w.world.present(girl) && words.includes('"Are you the ones my mother sent?"') && words.includes('The doors know me.') && !!w.party.flags[WENNA_UP],
    `after it the last one out, a girl with a nail in her fist, who will not go home: ${WENNA_UP} is set`);
  listen(w);

  // L9 (#488), the long loch's shore: west from M9's 0,20 onto L9's 31,20, walked, in Loch Fada still,
  // so the land is not named again; the road square to square under the pines, over the ridge by its
  // saddle and out by the south edge at 6,31 and 7,31, as the atlas's road runs on across parked L10's
  // corner for K10 (#491), where for now the world ends.
  w.world.travel('longmere_m9', 0, 20, WEST);
  const over = w.world.move('forward');
  ok(over.kind === 'moved' && w.world.zone?.id === 'longmere_l9' && w.world.state.x === l9.x + 31 && w.world.state.y === l9.y + 20 && !over.messages.some((m) => m.includes('Loch Fada.')),
    `west from M9's 0,20 onto L9's 31,20, walked, and the land not named again (${over.kind === 'moved' ? over.messages.join(' / ') || 'nothing said' : over.kind})`);
  ok(L9.start.x === 31 && L9.start.y === 20 && !(L9.exits ?? []).length, 'the box starts on the road at its east edge, and has no way out but its edges');
  const l9Road = reach(l9.x + 31, l9.y + 20, (x, y) => road(x, y) && onL9(x, y));
  ok([6, 7].every((x) => l9Road.has((l9.y + 31) * out.width + l9.x + x)) && [6, 7].every((x) => out.passable(l9.x + x, l9.y + 32) !== 'ok'),
    'the road runs square to square over L9 from 31,20 over the ridge to the south edge at 6,31 and 7,31, and past it, for now, the world ends');
  ok(PASS.x === 6 && PASS.y === 31 && PASS.to === 'coldmere_k10' && !(L9.exits ?? []).includes(PASS) && !MAP_DEFS.some((d) => d.id === PASS.to) && l9Road.has((l9.y + PASS.y) * out.width + l9.x + PASS.x + 1),
    'the road is taken, not walked, from its last square at 6,31 onto K10\'s east edge, shut until K10 is built and lists it; the square beside it stays plain road');
  const l9Stone = counted(l9, L9, 'l9_milestone');
  ok(l9Stone.says, `on the ridge the milestone says RIME LODGE ${units(l9Stone.toLodge)} and THE PASS ${units(l9Stone.toPass)}: ${l9Stone.toLodge} squares along the road to the lodge's gate and ${l9Stone.toPass} to the high pass`);

  // The drover wintering in his bothy by the road, and the bell he hears under the cold loch (#56's
  // 42); the drovers' stance; and up the crest from the saddle, the lookout over both lochs.
  ok(said(L9, 'A drover').includes('a bell from under'), 'the drover by the road hears a bell from under the cold loch\'s ice');
  see(w, 'longmere_l9:l9_stance');
  see(w, 'longmere_l9:l9_ridge');
  listen(w);

  // The box's groups, each won at its floor: the lynxes in the pines by the road and by the meadow,
  // the pike under the loch's ice off the woodcutters' camp, and on the ridge's far side the bear
  // alone, the hardest.
  for (const g of L9.encounters!.filter((e) => e.under)) ok(g.under === 'ice' && out.at(l9.x + g.x, l9.y + g.y).terrain === 'ice', `${g.id} lives under the loch's ice`);
  for (const g of L9.encounters!) fight(w, `longmere_l9:${g.id}`);

  // The secret: the posts out into the snow of the high meadow, fencing nothing, and the drift at
  // their end; the search there, and the drovers' summer shieling under it with the drove's
  // strongbox. Walked, waded, climbed or floated, it is never reached but through the door.
  const shieling = shut(l9, [25, 8], [24, 8], [23, 8]);
  ok(shieling.size > 600 && !shieling.reached, `the shieling is shut but for its door under the drift: none of L9's ${shieling.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'longmere_l9:l9_posts');
  w.world.travel('longmere_l9', 25, 8, WEST);
  let found = false;
  for (let i = 0; i < 20 && !found; i++) found = w.world.search();
  const behind = found ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(found && behind.every((r) => r.kind === 'moved') && w.world.used('l9_shieling'), 'searched at the drift, a door opens, and the shieling behind it can be walked into');
  listen(w);
  const box = L9.features!.find((f) => f.kind === 'chest' && f.id === 'l9_strongbox');
  ok(box?.kind === 'chest' && box.items.includes('skinning_knife+1') && box.x === 23 && box.y === 8, 'in the shieling, the drove\'s strongbox and a drover\'s Skinning Knife +1');
};
