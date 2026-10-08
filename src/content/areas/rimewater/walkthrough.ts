// Rimewater's walkthrough. Its chapter, The Sleepers (#492), is played last (theSleepers); first, Rime
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
// ridge and out by the south edge, where the pass for K10 is taken; the milestone on the ridge; the
// drover by the road and his bell; the lookout over both lochs; the box's groups, the pike under the
// loch's ice and the bear alone the hardest; and the drovers' summer shieling under the drift at the end
// of the posts. Then the high pass (K10, #491): on from L9's pass, taken, not walked, the cold loch's
// crossing line said after the pass's own at each level, and back; in from the cold loch (K9) over its
// south edge, walked, the land not named again; the road square to square to the pass's mouth and out by
// the west edge for J11, where the world ends; the milestone at the pass's foot, counted along the
// roads; the step at the mouth, the pilgrims camped below it and the first peak from the shoulder; the
// box's groups, the pike under the lake's shore ice and the bears the hardest; and the Lanterns' cache
// under the dark lamp's jar-shelf, its jar full. Then Loch Fuar (K9, #489): in from L9 over the pines,
// walked, the cold loch's crossing line said at each level; the crack in the ice at the loch's foot and
// the wall of grey with its door, Act III's one story lock, shut with its reason on it to a company that
// has not met the girl out of the hole; the girl gone from M9's ice and waiting at the door; the drowned
// village under the arm's ice and the house-place above the old bank; the box's groups, the pike under
// the ice and over the tower by night and the bears the hardest; and the smith's hole under the bank
// where the stones under the clear ice stop. Then the Sleepers' Bay (#490), through the door: the stair
// under the ice and the bay of beds, the Matron in the last row and the locker behind it.
import type { Walkthrough } from '../../area.ts';
import { newWalk, walkThrough, see, fight, listen, meetWho, playChapter, everyGoalWalked, goalFromBegun, quest } from '../../../../tools/walk.ts';
import { EAST, NORTH, SOUTH, WEST } from '../../../game/types.ts';
import { GameMap } from '../../../game/map.ts';
import type { Feature, MapDef } from '../../../game/map.ts';
import { LOCKS } from '../../locks.ts';
import { ATLAS, MAP_DEFS, MONSTERS } from '../../index.ts';
import { DROVE_COACH } from '../../crossings.ts';
import { buy, item } from '../../../game/items.ts';
import { CLASSES, canTrainAt, xpForLevel, rest, stayNight, trainPrice, levelUp, guildFlag } from '../../../game/party.ts';
import { spellsFor } from '../../../game/spells.ts';
import { makeRng } from '../../../lib/engine/rng.ts';
import { ACT_III } from '../../../../tools/tests/ladder.ts';
import { FURRIER } from './items.ts';
import { INTERIORS } from './interiors.ts';
import { NIGHTS, WENNA_UP, WENNA_LODGE } from './maps/rime_lodge.ts';
import { CHAPTER } from './chapter.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { worldGrid } from '../../../game/atlas.ts';
import { meet, heard, answer } from '../../../game/people.ts';
import { questLog } from '../../../game/quests.ts';
import { readMarks } from '../../../game/inscriptions.ts';
import { MINUTES_PER_DAY } from '../../../game/calendar.ts';
import type { Person } from '../../../game/people.ts';
import { NOTCH } from '../cairnmoor/maps/cairnfield_n8.ts';
import { UP, GATE, LAKE_DOOR } from './maps/longmere_m9.ts';
import { PASS } from './maps/longmere_l9.ts';
import { RIDGE } from './maps/coldmere_k10.ts';
import { DOOR } from './maps/coldmere_k9.ts';
import type { Walk, Step } from '../../../../tools/walk.ts';
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
const K9 = MAP_DEFS.find((d) => d.id === 'coldmere_k9')!;
const FUAR = ATLAS.zones.find((z) => z.id === 'coldmere')!;
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
  // the high pass out of Loch Fuar, or over it to the road's end in Monks' Vale at the monks' gate.
  const grid = worldGrid(ATLAS, MAP_DEFS);
  const drove = (x: number, y: number): boolean => road(x, y) || (!out.zoneAt(x, y) && !!grid.road[y * out.width + x]);
  const corner = (along: (x: number, y: number) => boolean) => (x: number, y: number): boolean => along(x, y) || ((out.passable(x, y) === 'ok' || !out.zoneAt(x, y)) && [-1, 1].some((d) => along(x + d, y)) && [-1, 1].some((d) => along(x, y + d)));
  const [px, py] = ATLAS.links.find((l) => l.from === 'coldmere' && l.to === 'monksvale')!.a!;
  const units = (n: number): number => Math.max(1, Math.round(n / 13));
  const counted = (z: typeof m9, def: typeof M9, id: string, ahead: { name: string; at: readonly [number, number] } = { name: 'THE PASS', at: [px, py] }): { says: boolean; toLodge: number; toPass: number } => {
    const stone = def.features!.find((f) => f.kind === 'event' && f.id === id)!;
    const [sx, sy] = [z.x + stone.x, z.y + stone.y];
    const fromStone = reach(sx, sy, corner(drove));
    const toLodge = (fromStone.get((m9.y + GATE.y) * out.width + m9.x + GATE.x + 1) ?? Infinity) + 1;
    const end = [...fromStone].map(([k, n]) => ({ n, left: Math.abs(k % out.width - ahead.at[0]) + Math.abs(Math.floor(k / out.width) - ahead.at[1]) }))
      .reduce((a, b) => (b.left < a.left || (b.left === a.left && b.n < a.n) ? b : a));
    const toPass = end.n + end.left;
    const says = road(sx, sy) && stone.kind === 'event' && stone.text.includes(`RIME LODGE ${units(toLodge)},`) && stone.text.includes(`${ahead.name} ${units(toPass)}.`);
    return { says, toLodge, toPass };
  };
  const m9Stone = counted(m9, M9, 'm9_milestone');
  ok(m9Stone.says, `the milestone says RIME LODGE ${units(m9Stone.toLodge)} and THE PASS ${units(m9Stone.toPass)}: ${m9Stone.toLodge} squares along the road to the lodge's gate and ${m9Stone.toPass} to the high pass`);

  // The coach yard outside the gate; the coach and its coachman are the town's (#487, #539), so nobody
  // on the box sells its passage.
  see(w, 'longmere_m9:m9_yard');
  ok(!M9.features!.some((f) => f.kind === 'npc' && f.passage), 'nobody on the box sells the coach: its coachman is the town\'s');

  // The hole's fire and its keeper, a Lantern, with the lodge-keepers' word of the glacier; the man on
  // the shelf of ice at its foot; and at the glacier's edge nobody yet, the guide not gone up (#494).
  see(w, 'longmere_m9:m9_hole');
  const said = (def: typeof M9, name: string): string => { const p = person(def, name); w.world.travel(def.id, p.x, p.y); return meet(p, w.party, heard(w.world, p)).text; };
  ok(said(M9, 'A lodge-keeper').includes('glacier gives nothing back'), 'the lodge-keeper at the hole\'s fire says the glacier gives nothing back');
  ok(said(M9, 'A man at the hole').includes('went back down'), 'the man on the shelf of ice under the hole\'s lip went back down for her');
  const guide = person(M9, 'A guide');
  w.world.travel(M9.id, guide.x, guide.y);
  ok(!w.world.present(guide), 'the guide is not at the glacier\'s foot until she has gone up from the lodge (#494)');
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
  ok(words.includes('"Are you the ones my mother sent?"') && words.includes('The doors know me.') && !!w.party.flags[WENNA_UP] && !w.world.present(girl),
    `after it the last one out, a girl with a nail in her fist, who will not go home: ${WENNA_UP} is set, and she is gone back down`);
  listen(w);

  // L9 (#488), the long loch's shore: west from M9's 0,20 onto L9's 31,20, walked, in Loch Fada still,
  // so the land is not named again; the road square to square under the pines, over the ridge by its
  // saddle and out by the south edge at 6,31 and 7,31, as the atlas's road runs on across parked L10's
  // corner for K10 (#491), taken, not walked.
  w.world.travel('longmere_m9', 0, 20, WEST);
  const over = w.world.move('forward');
  ok(over.kind === 'moved' && w.world.zone?.id === 'longmere_l9' && w.world.state.x === l9.x + 31 && w.world.state.y === l9.y + 20 && !over.messages.some((m) => m.includes('Loch Fada.')),
    `west from M9's 0,20 onto L9's 31,20, walked, and the land not named again (${over.kind === 'moved' ? over.messages.join(' / ') || 'nothing said' : over.kind})`);
  ok(L9.start.x === 31 && L9.start.y === 20 && (L9.exits ?? []).length === 1, 'the box starts on the road at its east edge, and has no way out but its edges and the pass');
  const l9Road = reach(l9.x + 31, l9.y + 20, (x, y) => road(x, y) && onL9(x, y));
  ok([6, 7].every((x) => l9Road.has((l9.y + 31) * out.width + l9.x + x)) && [6, 7].every((x) => out.passable(l9.x + x, l9.y + 32) !== 'ok'),
    'the road runs square to square over L9 from 31,20 over the ridge to the south edge at 6,31 and 7,31, and past it, for now, the world ends');
  ok(PASS.x === 6 && PASS.y === 31 && PASS.to === 'coldmere_k10' && (L9.exits ?? []).includes(PASS) && l9Road.has((l9.y + RIDGE.ty) * out.width + l9.x + RIDGE.tx)
    && RIDGE.tx === PASS.x + 1 && RIDGE.ty === PASS.y && !(L9.exits ?? []).some((e) => e.x === RIDGE.tx && e.y === RIDGE.ty),
    'the road is taken, not walked, from its last square at 6,31 onto K10, and the square beside it, where the way back lands, stays plain road');
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

  // K10 (#491), the high pass: on from L9's pass onto the bridge at K10's 30,3, taken, not walked, and
  // the cold loch's crossing line said after the pass's own, as at a border walked (#166): at its floor
  // the name alone, two under the rest in its own words, three under the harsher and the way back east
  // still open.
  const K10 = MAP_DEFS.find((d) => d.id === 'coldmere_k10')!, k10 = out.zones.find((z) => z.id === 'coldmere_k10')!;
  const pass = (level: number): string[] => {
    for (const m of w.party.members) m.level = level;
    w.world.travel('longmere_l9', PASS.x, PASS.y - 1, SOUTH);
    const r = w.world.move('forward');
    return r.kind === 'moved' ? r.messages : [r.kind];
  };
  const passLow = pass(17), passTwo = pass(18), passIn = pass(20);
  ok(w.world.zone?.id === 'coldmere_k10' && w.world.state.x === k10.x + PASS.tx && w.world.state.y === k10.y + PASS.ty && w.world.state.facing === WEST,
    'down the pass at L9\'s 6,31 onto K10\'s bridge at 30,3, facing west');
  ok(passIn.join(' / ') === `${PASS.label} / Loch Fuar.`, `at 20, the pass's line and then the cold loch named, no more (${passIn.join(' / ')})`);
  ok(passTwo.join(' / ') === `${PASS.label} / Loch Fuar. ${FUAR.crossing?.harder}`, `at 18, the rest in the cold loch's own words (${passTwo.join(' / ')})`);
  ok(passLow.join(' / ') === `${PASS.label} / Loch Fuar. ${FUAR.crossing?.warning}`, `at 17, the harsher words, and the way back east open (${passLow.join(' / ')})`);
  ok(K10.start.x === PASS.tx && K10.start.y === PASS.ty && (K10.exits ?? []).length === 1 && K10.exits![0] === RIDGE && RIDGE.x === PASS.tx + 1 && RIDGE.y === PASS.ty,
    'the landing is the box\'s way in and no way out, and the way back is the road\'s last square beside it, its only way out but its edges');
  // Back from the road's last square: straight back within the hour, the way's own line alone; come to
  // it from elsewhere, over K9's south edge, walked, and the land not named again, the long loch named.
  w.world.travel('coldmere_k10', PASS.tx, PASS.ty, EAST);
  const back = w.world.move('forward');
  ok(back.kind === 'moved' && w.world.zone?.id === 'longmere_l9' && w.world.state.x === l9.x + RIDGE.tx && w.world.state.y === l9.y + RIDGE.ty && w.world.state.facing === NORTH
    && back.messages.join(' / ') === RIDGE.label, `back from K10's 31,3 onto L9's 7,31, facing north, beside the pass; straight back, its own line alone (${back.kind === 'moved' ? back.messages.join(' / ') : back.kind})`);
  const kn = out.zones.find((z) => z.id === 'coldmere_k9')!;
  w.world.travel('coldmere_k9', 20, 31, SOUTH);
  const seam = w.world.move('forward'), crossed = w.world.zone?.id === 'coldmere_k10' && w.world.state.y === k10.y;
  w.world.travel('coldmere_k10', PASS.tx, PASS.ty, EAST);
  const round = w.world.move('forward');
  ok(seam.kind === 'moved' && crossed && kn.y + kn.h === k10.y && !seam.messages.some((m) => m.includes('Loch Fuar.')) && round.kind === 'moved' && round.messages.join(' / ') === `${RIDGE.label} / Loch Fada.`,
    `south from K9's 20,31 onto K10's 20,0, walked, and the land not named again (${seam.kind === 'moved' ? seam.messages.join(' / ') || 'nothing said' : seam.kind}); back by the road, the long loch named (${round.kind === 'moved' ? round.messages.join(' / ') : round.kind})`);

  // The road square to square from the bridge to the pass's mouth and out by the west edge at 0,19 for
  // J11 (#499), where for now the world ends; the milestone at the pass's foot, to the lodge's gate and
  // over the pass to the road's end at the monks' gate in Monks' Vale.
  const onK10 = on(k10), k10Road = reach(k10.x + PASS.tx, k10.y + PASS.ty, (x, y) => road(x, y) && onK10(x, y));
  ok(k10Road.has((k10.y + RIDGE.y) * out.width + k10.x + RIDGE.x) && k10Road.has((k10.y + 15) * out.width + k10.x + 5) && k10Road.has((k10.y + 19) * out.width + k10.x) && out.passable(k10.x - 1, k10.y + 19) !== 'ok',
    'the road runs square to square over K10 from the bridge at 30,3 to the pass\'s mouth at 5,15 and out by the west edge at 0,19, and past it, for now, the world ends');
  const vale = ATLAS.links.find((l) => l.from === 'monksvale' && l.to === 'monastery')!.a!;
  const k10Stone = counted(k10, K10, 'k10_milestone', { name: 'MONKS\' VALE', at: vale });
  ok(k10Stone.says, `at the pass's foot the milestone says RIME LODGE ${units(k10Stone.toLodge)} and MONKS' VALE ${units(k10Stone.toPass)}: ${k10Stone.toLodge} squares along the road to the lodge's gate and ${k10Stone.toPass} over the pass to the monks' gate`);

  // The step (§5): at the pass's mouth the road climbs into the range between its two walls, the snow on
  // it trodden; the pilgrims from Anvilhall camped in the snow below it (#494's 44); the new graves by
  // the road; and from the pass's first shoulder, the first peak of the range.
  for (const id of ['k10_mouth', 'k10_pilgrims', 'k10_graves', 'k10_shoulder']) see(w, `coldmere_k10:${id}`);
  ok(w.world.used('k10_mouth'), 'the step at the pass\'s mouth is seen');
  listen(w);

  // The box's groups, each won at its floor: the lynxes in the pines by the bridge, by the lamp and south
  // of the pass's foot, the pike under the lake's shore ice, and the bears in pairs, the hardest.
  for (const g of K10.encounters!.filter((e) => e.under)) ok(g.under === 'ice' && out.at(k10.x + g.x, k10.y + g.y).terrain === 'ice', `${g.id} lives under the lake's shore ice`);
  for (const g of K10.encounters!) fight(w, `coldmere_k10:${g.id}`);

  // The secret: the Lantern's wayside lamp by the road, dark, its jar full to the stopper, and the search
  // there; the Lanterns' cache under its jar-shelf, with the lamp's silver and a Guide's Staff +1.
  // Walked, waded, climbed or floated, it is never reached but through the shelf.
  const lanterns = shut(k10, [16, 10], [16, 11], [16, 12]);
  ok(lanterns.size > 600 && !lanterns.reached, `the cache is shut but for the jar-shelf: none of K10's ${lanterns.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'coldmere_k10:k10_lamp');
  w.world.travel('coldmere_k10', 16, 10, SOUTH);
  let shelf = false;
  for (let i = 0; i < 20 && !shelf; i++) shelf = w.world.search();
  const beneath = shelf ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(shelf && beneath.every((r) => r.kind === 'moved') && w.world.used('k10_cache'), 'searched at the dark lamp, its jar-shelf gives, and the cache under it can be walked into');
  listen(w);
  const silver = K10.features!.find((f) => f.kind === 'chest' && f.id === 'k10_silver');
  ok(silver?.kind === 'chest' && silver.items.includes('guides_staff+1') && silver.x === 16 && silver.y === 12, 'in the cache, the lamp\'s silver and a Lantern\'s Guide\'s Staff +1');

  // K9 (#489), Loch Fuar: west from L9's 0,21 onto K9's 31,21 under the pines, walked, and the cold
  // loch's crossing line said at each level, as at a border walked (#166): at its floor the name alone,
  // two under the rest in its own words, three under the harsher and the way back east still open.
  const k9 = out.zones.find((z) => z.id === 'coldmere_k9')!;
  const fuar = (level: number): string[] => {
    for (const m of w.party.members) m.level = level;
    w.world.travel('longmere_l9', 0, 21, WEST);
    const r = w.world.move('forward');
    return r.kind === 'moved' ? r.messages : [r.kind];
  };
  const fuarLow = fuar(17), fuarTwo = fuar(18), fuarIn = fuar(20);
  ok(w.world.zone?.id === 'coldmere_k9' && w.world.state.x === k9.x + 31 && w.world.state.y === k9.y + 21 && k9.x + k9.w === l9.x, 'west from L9\'s 0,21 onto K9\'s 31,21, walked');
  ok(fuarIn.join(' / ') === 'Loch Fuar.', `at 20, the cold loch named, no more (${fuarIn.join(' / ')})`);
  ok(fuarTwo.join(' / ') === `Loch Fuar. ${FUAR.crossing?.harder}`, `at 18, the rest in the cold loch's own words (${fuarTwo.join(' / ')})`);
  ok(fuarLow.join(' / ') === `Loch Fuar. ${FUAR.crossing?.warning}` && /way back east under the pines is still open/.test(fuarLow[0] ?? ''),
    `at 17, the harsher words, and the way back still open (${fuarLow.join(' / ')})`);
  ok(K9.start.x === 31 && K9.start.y === 21 && (K9.exits ?? []).length === 1 && K9.exits![0] === DOOR, 'the box starts at its east edge under the pines, and has no way out but its edges and the door under the ice');

  // The step (§5): the crack in the ice at the loch's foot, and at its foot the wall of grey with the
  // door in it, Act III's one story lock (#440): shut, its reason on it, to a company that has not met
  // the girl out of the hole, and open to one that has (walked in `sleepersBay`).
  see(w, 'coldmere_k9:k9_crack');
  const had = w.party.flags[WENNA_UP];
  delete w.party.flags[WENNA_UP];
  w.world.travel('coldmere_k9', DOOR.x, DOOR.y - 1, SOUTH);
  const through = w.world.move('forward');
  w.party.flags[WENNA_UP] = had;
  ok(through.kind === 'blocked' && through.reason === DOOR.blockedText && w.world.state.y === k9.y + DOOR.y - 1 && out.at(k9.x + DOOR.x, k9.y + DOOR.y).ch === 'D',
    `at the crack's foot the wall of grey and its door, shut with its reason on it before the girl out of the hole is met (${through.kind === 'blocked' ? through.reason : through.kind})`);
  const lock = LOCKS.find((l) => l.map === K9.id);
  ok((K9.exits ?? []).includes(DOOR) && DOOR.to === 'sleepers_bay' && [DOOR.needFlag].flat().includes(WENNA_UP) && LOCKS.length === 1 && lock?.flag === WENNA_UP && lock.x === DOOR.x && lock.y === DOOR.y,
    'the door leads to the Sleepers\' Bay, and is Act III\'s one story lock, signed in on its square and its flag');
  // The girl out of the hole, gone back down from M9's ice once met, waits at the door with her palm on
  // it, and the voice in the wall says its word (§5). Before her flag nobody waits there.
  const atDoor = person(K9, 'The girl out of the hole'), met = w.party.flags[WENNA_UP];
  w.world.travel('coldmere_k9', atDoor.x, atDoor.y);
  delete w.party.flags[WENNA_UP];
  const early = w.world.present(atDoor);
  w.party.flags[WENNA_UP] = met;
  const voice = meet(atDoor, w.party, heard(w.world, atDoor)).text;
  ok(!early && w.world.present(atDoor) && !w.world.present(girl) && voice.includes('"Captain?"'),
    `after the fourth night she is at the door and not at the hole, and the wall speaks to her hand: ${voice.replace(/\s+/g, ' ')}`);
  listen(w);

  // The drowned village of Fuar under the arm's ice: its bell tower's cap out of the ice (#56's 42),
  // the street under it, and above the old bank the house-place of the lodge woman's people; the knoll
  // over the ice.
  for (const id of ['k9_tower', 'k9_street', 'k9_hearth', 'k9_lookout']) see(w, `coldmere_k9:${id}`);
  listen(w);

  // The box's groups, each won at its floor: the lynxes in the shore's pines, the pike under the arm's
  // ice and over the tower's cap by night, and the bears in pairs on the far shore, the hardest.
  for (const g of K9.encounters!.filter((e) => e.under)) ok(g.under === 'ice' && out.at(k9.x + g.x, k9.y + g.y).terrain === 'ice', `${g.id} lives under the loch's ice`);
  const byNight = K9.encounters!.find((e) => e.id === 'k9_pike_tower')!;
  ok(JSON.stringify(byNight.when) === JSON.stringify({ hours: 'night' }) && out.at(k9.x + byNight.x - 1, k9.y + byNight.y).ch === 'B', 'the pike over the tower\'s cap come by night only');
  for (const g of K9.encounters!) fight(w, `coldmere_k9:${g.id}`);

  // The secret: the strip of clear ice over the stones laid too square, from the tower to the old
  // bank, and the search where they stop; the smith's hole behind the bank's face, dry, with his iron.
  // Walked, waded, climbed or floated, it is never reached but through the face.
  const smiths = shut(k9, [14, 18], [13, 18], [12, 18]);
  ok(smiths.size > 600 && !smiths.reached, `the hole is shut but for the bank's face: none of K9's ${smiths.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'coldmere_k9:k9_strip');
  w.world.travel('coldmere_k9', 14, 18, WEST);
  let gives = false;
  for (let i = 0; i < 20 && !gives; i++) gives = w.world.search();
  const under = gives ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(gives && under.every((r) => r.kind === 'moved') && w.world.used('k9_hole'), 'searched where the stones stop, the bank\'s face gives, and the hole behind it can be walked into');
  listen(w);
  const iron = K9.features!.find((f) => f.kind === 'chest' && f.id === 'k9_iron');
  ok(iron?.kind === 'chest' && iron.items.includes('bear_spear+1') && iron.items.includes('lann_fuar') && iron.x === 12 && iron.y === 18,
    'in the hole, the smith\'s iron: a Bear Spear +1, and his own blade, Lann Fuar');
  sleepersBay(w, ok);
  sideQuests(ok);
  theSleepers(ok);
};

/**
 * The Sleepers' Bay (#490): in at the door under the ice for a company that has met the girl out of
 * the hole, and out again onto the crack's foot; the stair at 20, the door's inside, the ice giving out
 * on the smooth walls, the voice's wall and the way the water runs, the tallymen's crews and the first
 * keeper won; the bay at 21, the beds and the faces in them, the keepers in the rows won, the Matron
 * won in the last row and her cap; the door at the back, read and shut; and the locker behind the last
 * row, found from the path, with the bay's two named pieces.
 */
function sleepersBay(w: Walk, ok: (cond: boolean, msg: string) => void): void {
  const [B1, B2] = ['sleepers_bay', 'sleepers_bay2'].map((id) => MAP_DEFS.find((d) => d.id === id)!);
  const k9 = buildMaps()[OUTDOORS].zones.find((z) => z.id === K9.id)!;
  const at = (): string => `${w.world.state.mapId} ${w.world.state.x},${w.world.state.y}`;
  w.level = 20;

  // In at the door: onto the landing in the ice, facing in; stepped back into, the door lets the
  // company back up onto the crack's foot, facing up the crack. Nothing else in the bay shuts.
  w.world.travel(K9.id, DOOR.x, DOOR.y - 1, SOUTH);
  const inside = w.world.move('forward');
  ok(inside.kind === 'moved' && w.world.state.mapId === B1.id && w.world.state.x === B1.start.x && w.world.state.y === B1.start.y && w.world.state.facing === SOUTH && inside.messages.includes(DOOR.label!),
    `the door opens under her palm and lets the company down onto the landing in the ice (${at()}: ${inside.kind === 'moved' ? inside.messages.join(' / ') : inside.kind})`);
  const back = w.world.move('back');
  ok(back.kind === 'moved' && w.world.zone?.id === K9.id && w.world.state.x - k9.x === DOOR.x && w.world.state.y - k9.y === DOOR.y - 1 && w.world.state.facing === NORTH,
    `and lets it back up onto the crack's foot, facing up the crack (${at()})`);
  ok([B1, B2].every((d) => (d.exits ?? []).every((e) => !e.shut && !e.needFlag)), 'nothing shuts a way inside the bay: the door under the ice is its one lock');

  /** Whether a map's square is reached from its start without passing its secret doors, or swimming, climbing or floating. */
  const reached = (d: MapDef, to: readonly [number, number]): boolean => {
    const m = new GameMap(d), seen = new Set<number>(), todo = [[d.start.x, d.start.y]];
    while (todo.length) {
      const [x, y] = todo.pop()!, k = y * m.width + x;
      if (seen.has(k) || !m.inBounds(x, y) || m.at(x, y).door === 'secret' || m.passable(x, y, { swim: true, climb: true, float: true }) !== 'ok') continue;
      seen.add(k);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
    }
    return seen.has(to[1] * m.width + to[0]);
  };

  // The stair (20): the door's inside, the ice giving out on walls too smooth to be stone, the light
  // with no lamp and the voice's wall; the way the water runs and the tallies on its wall; the crews on
  // both ways down, and the first keeper alone at the stair's foot.
  const stair = new GameMap(B1), bay = new GameMap(B2);
  ok(stair.palette.wallStyle === 'smooth' && bay.palette.wallStyle === 'smooth' && B1.bare === true && B2.bare === true && stair.at(B1.start.x, B1.start.y).terrain === 'ice',
    'the landing is still in the ice, the walls below it are smooth, and nothing hangs on any wall in the bay');
  for (const id of ['sb1_door', 'sb1_ice', 'sb1_light', 'sb1_voice', 'sb1_water', 'sb1_tallies']) see(w, `${B1.id}:${id}`);
  const inner = B1.features!.find((f) => f.kind === 'event' && f.id === 'sb1_door'), voice = B1.features!.find((f) => f.kind === 'event' && f.id === 'sb1_voice');
  ok(inner?.kind === 'event' && inner.text.endsWith('at a girl\'s shoulder: THE BLOOD OPENS THE DOOR.') && voice?.kind === 'event' && voice.text.includes('"Captain?"'),
    'on the door\'s inside, at a girl\'s shoulder, THE BLOOD OPENS THE DOOR, and in the wall a voice asks its one word');
  const crews = B1.encounters!.filter((g) => g.id.startsWith('sb1_knockers')), first = B1.encounters!.find((g) => g.id === 'sb1_keeper')!;
  ok(crews.length === 2 && crews.every((g) => g.monsters.includes('tallyman') && g.monsters.includes('knocker') && !!g.respawn) && first.monsters.join() === 'bay_keeper',
    'the tallymen\'s crews that did not come up, on both ways down, and the first keeper alone at the stair\'s foot');
  for (const g of B1.encounters!) fight(w, `${B1.id}:${g.id}`);
  see(w, `${B1.id}:sb1_foot`);
  ok(reached(B1, [6, 14]) && reached(B1, [11, 11]), 'the stair and the way the water runs both come down to the stair\'s foot, with nothing searched for');

  // The bay (21): down the last of the stair into the long hall, the beds and a face in the first, the
  // rows of every people, the keepers four to a row won, and the Matron in the last row, won, who never
  // comes back, and leaves her cap.
  walkThrough(w, B1.id, 6, 13, SOUTH, B2.id, 1);
  w.level = 21;
  ok(w.world.state.x === B2.start.x && w.world.state.y === B2.start.y && w.world.state.facing === NORTH, `the stair comes out at the bay's foot, facing up the hall (${at()})`);
  for (const id of ['sb2_stair', 'sb2_beds', 'sb2_row1', 'sb2_row2', 'sb2_row3']) see(w, `${B2.id}:${id}`);
  const beds = B2.features!.find((f) => f.kind === 'event' && f.id === 'sb2_beds');
  ok(beds?.kind === 'event' && beds.text.startsWith('Rows of long glass beds') && bay.cells.filter((c) => c.solid === 'pillar').length === 40,
    'rows of long glass beds, forty of them, and in the first a face you have seen before');
  const rows = B2.encounters!.filter((g) => g.id.startsWith('sb2_keepers'));
  ok(rows.length === 3 && rows.every((g) => g.monsters.length === 4 && g.monsters.every((m) => m === 'bay_keeper') && !!g.respawn) && MONSTERS.bay_keeper?.inflict?.cond === 'asleep',
    'keepers between the rows, four to a row, whose touch puts to sleep');
  for (const g of rows) fight(w, `${B2.id}:${g.id}`);
  const bag = w.party.bag.length;
  fight(w, `${B2.id}:sb2_matron`);
  const matron = B2.encounters!.find((g) => g.id === 'sb2_matron')!;
  ok(matron.monsters.join() === 'matron' && !matron.respawn && !!matron.slainText?.endsWith('The sleepers sleep on.') && w.party.bag.slice(bag).includes('matron_cap'),
    'the Matron in the last row falls and never comes back, the sleepers sleep on, and she leaves her cap');

  // The door at the back: Kiln-script over it, and a wall with a door in it that opens for nobody. No
  // flag, no lock, no exit.
  const script = B2.features!.find((f) => f.kind === 'sign' && f.id === 'sb2_back');
  w.world.travel(B2.id, 3, 3, NORTH);
  const shut = w.world.move('forward');
  ok(script?.kind === 'sign' && !!script.read && shut.kind === 'blocked' && w.world.state.y === 3 && bay.at(3, 2).door === 'door' && bay.at(3, 2).solid === 'wall' && !bay.exitAt(3, 2) && !LOCKS.some((l) => l.map.startsWith('sleepers_bay')),
    `the door at the back, Kiln-script over it, does not open: a wall with a door in it, and no lock (${shut.kind === 'blocked' ? shut.reason : shut.kind})`);

  // The secret: the keepers' path worn up the middle runs on past the last row to the wall and stops;
  // searched there, the wall gives on the locker, where the keepers put what the sleepers came with.
  // Walked, it is never reached but through that wall.
  ok(!reached(B2, [7, 1]) && reached(B2, [10, 3]), 'the locker is reached only through the back wall, and the path runs from the stair to the last row');
  see(w, `${B2.id}:sb2_path`);
  w.world.travel(B2.id, 7, 3, NORTH);
  let gives = false;
  for (let i = 0; i < 20 && !gives; i++) gives = w.world.search();
  const into = gives ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(gives && into.every((r) => r.kind === 'moved') && w.world.used('sb2_locker'), 'searched where the path stops, the back wall gives on the locker');
  const locker = B2.features!.find((f) => f.kind === 'chest' && f.id === 'sb2_locker_chest');
  ok(locker?.kind === 'chest' && locker.items.join() === 'hunters_bow+1,plate+4' && locker.gold === 1500 && item('hunters_bow+1').name === 'Bogha Fionn +1' && item('plate+4').name === 'Luireach Dubh +4',
    'in the locker, four hundred years of pockets: 1,500 gold, Bogha Fionn and Luireach Dubh');
  listen(w);
}

/**
 * The side quests (#494), each at its level and answered every way: the coach on the drove road, its
 * note carried down after the coachman asks or before (#43), its sleeper to the Lanterns' hall or the
 * healer's house; the man at the hole, shown Hale's token or read the clerk's book, home on the coach
 * or a witness at the lodge; the bell under Fuar's ice, asked once the sleeper has a bed, rung by night
 * and not by day, read or not, waking the sleeper in the hall, the lodge woman out to Fuar or staying;
 * the guide gone up, found frostbitten, carried in, the way drawn and the glacier's edge reached, and
 * the old marks there read onto the world map; the pilgrims below the pass, up with the brother or back
 * to the lodge; and the stonecutter at the lodge once he is sent home from the tors, and not before.
 */
function sideQuests(ok: (cond: boolean, msg: string) => void): void {
  const at = (level: number): Walk => {
    const w = newWalk(ok);
    w.level = level;
    for (const m of w.party.members) { m.level = level; m.xp = xpForLevel(level); }
    return w;
  };
  const npc = (map: string, name: string, n = 0): Person => MAP_DEFS.find((d) => d.id === map)!.features!.filter((f) => f.kind === 'npc' && f.name === name)[n] as Person;
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
  const shows = (w: Walk, map: string, id: string): boolean => {
    const f = MAP_DEFS.find((d) => d.id === map)!.features!.find((x) => x.kind === 'event' && x.id === id)!;
    w.world.travel(map, f.x, f.y);
    return w.world.present(f);
  };
  const reads = (w: Walk, id: string, want: readonly string[], not: readonly string[], how: string): void => {
    const pg = page(w, id), ids = pg?.entries.map((e) => e.id) ?? [], title = pg?.def.title ?? id;
    const done = w.news.filter((n) => n === `Quest complete: ${title}.`).length;
    ok(!!pg?.done && pg.goal === null && want.every((e) => ids.includes(e)) && !not.some((e) => ids.includes(e)) && done === 1,
      `${how}: ${title} is done with no goal, its entries ${ids.join(', ')}, and said complete once (${done})`);
  };
  const xpOf = (w: Walk): number => w.party.members.reduce((t, m) => t + m.xp, 0);
  const hour = (w: Walk, h: number): void => { w.world.state.minutes = Math.floor(w.world.state.minutes / MINUTES_PER_DAY) * MINUTES_PER_DAY + h * 60; };

  // The Coach That Never Came (#56's 40), at 20: the coachman asks; by the coach on the moor the man in
  // the healer's coat writes his note; carried down, it sends the sledge, and the sleeper goes to the
  // hall. Then the note brought before the coachman ever asks, which he takes all the same (#43), and
  // the healer's house.
  const COACHMAN = npc('rime_lodge', 'The coachman'), BY_COACH = npc('cairnfield_n8', 'A man in a healer\'s coat');
  const IN_YARD = npc('rime_lodge', 'A man in a healer\'s coat'), ON_SLEDGE = npc('rime_lodge', 'A sleeper', 0), IN_HALL = npc('rime_lodge', 'A sleeper', 1);
  const coach = (w: Walk, sets: string): void => {
    hear(w, 'rime_lodge', COACHMAN);
    answerTo(w, 'cairnfield_n8', BY_COACH, 'q_coach_note');
    hear(w, 'rime_lodge', COACHMAN);
    answerTo(w, 'rime_lodge', IN_YARD, sets);
  };
  {
    const w = at(20);
    ok(there(w, 'cairnfield_n8', BY_COACH) && !there(w, 'rime_lodge', IN_YARD) && !there(w, 'rime_lodge', ON_SLEDGE), 'by the coach on the moor a man in a healer\'s coat, and nobody from it in the lodge\'s yard');
    ok(hear(w, 'rime_lodge', COACHMAN).includes('two days late') && began(w, 'The Coach That Never Came') && /Cairnfield/.test(goal(w, 'coach')),
      `the coachman's coach is late, and the quest begins on the drove road (${goal(w, 'coach')})`);
    const note = answerTo(w, 'cairnfield_n8', BY_COACH, 'q_coach_note');
    ok(note.includes('tears the leaf out') && w.party.bag.includes('healers_note') && /coachman at Rime Lodge/.test(goal(w, 'coach')), `by the coach he writes a note for the lodge (${goal(w, 'coach')})`);
    const gold = w.party.gold, took = hear(w, 'rime_lodge', COACHMAN);
    ok(took.startsWith('He reads the note twice and shouts') && took.endsWith('(200 gold.)') && w.party.gold === gold + 200 && !w.party.bag.includes('healers_note'),
      `the coachman takes the note, pays and sends the sledge (${took.split('\n')[0]})`);
    ok(!there(w, 'cairnfield_n8', BY_COACH) && there(w, 'rime_lodge', IN_YARD) && there(w, 'rime_lodge', ON_SLEDGE) && /Lanterns/.test(goal(w, 'coach')),
      `the two from the coach are down in the lodge's yard, and gone from the moor (${goal(w, 'coach')})`);
    const xp = xpOf(w);
    answerTo(w, 'rime_lodge', IN_YARD, 'q_coach_hall');
    reads(w, 'coach', ['late', 'coach', 'sledge', 'hall'], ['temple'], 'the hall');
    ok(xpOf(w) === xp + 1800 && there(w, 'rime_lodge', IN_HALL) && !there(w, 'rime_lodge', IN_YARD) && !there(w, 'rime_lodge', ON_SLEDGE) && hear(w, 'rime_lodge', COACHMAN).includes('froze him on his box'),
      'the hall: 1,800 xp, she sleeps at the hall\'s door under the lamps, the yard is empty and the coachman mourns');
  }
  {
    const w = at(20);
    answerTo(w, 'cairnfield_n8', BY_COACH, 'q_coach_note');
    ok(began(w, 'The Coach That Never Came') && /coachman at Rime Lodge/.test(goal(w, 'coach')), `found first, the coach begins it, and the goal is the coachman (${goal(w, 'coach')})`);
    const first = hear(w, 'rime_lodge', COACHMAN);
    ok(first.includes('The coach for here, stopped on the moor') && !w.party.flags.q_coach && !!w.party.flags.q_coach_sledge,
      'brought before he asks, the coachman takes the note at the first meeting and sends the sledge, and does not hire');
    answerTo(w, 'rime_lodge', IN_YARD, 'q_coach_temple');
    reads(w, 'coach', ['coach', 'sledge', 'temple'], ['late', 'hall'], 'the healer\'s house, the note brought first');
    ok(!there(w, 'rime_lodge', IN_HALL) && !there(w, 'rime_lodge', IN_YARD) && !there(w, 'rime_lodge', ON_SLEDGE), 'the healer\'s house: she is inside, out of sight, and nobody is left in the yard');
  }

  // The One Who Went Back Down (#56's 41), at 21: the man at the hole tells a stranger nothing; shown
  // Hale's token he goes home on the coach, and read the clerk's book he stays at the lodge to tell it.
  const MAN = npc('longmere_m9', 'A man at the hole'), WITNESS = npc('rime_lodge', 'A man from the hole');
  const clerk = MAP_DEFS.find((d) => d.id === 'tide_ship2')!.features!.find((f) => f.kind === 'chest' && f.id === 'ts2_clerk')!;
  for (const [how, sets, entry] of [['Hale\'s token', 'q_wentback_home', 'home'], ['the clerk\'s book', 'q_wentback_witness', 'witness']] as const) {
    const w = at(21);
    const first = hear(w, 'longmere_m9', MAN), again = hear(w, 'longmere_m9', MAN);
    ok(first.includes('went back down for her') && again === first && began(w, 'The One Who Went Back Down') && /Hale's token/.test(goal(w, 'wentback')),
      `${how}: the man at the hole went back down for her, and tells a stranger no more (${goal(w, 'wentback')})`);
    if (entry === 'home') w.party.bag.push('hale_token');
    else { w.world.travel('tide_ship2', clerk.x, clerk.y); w.world.markUsed('ts2_clerk'); w.party.bag.push('clerks_book'); }
    const told = hear(w, 'longmere_m9', MAN);
    ok(told.includes('it opened for her') && /home on the coach/.test(goal(w, 'wentback')), `${how}: he says what he saw, a door that opened for a girl (${told.split('\n')[0]})`);
    const xp = xpOf(w);
    answerTo(w, 'longmere_m9', MAN, sets);
    reads(w, 'wentback', ['man', 'door', entry], [entry === 'home' ? 'witness' : 'home'], `${how}, ${entry}`);
    ok(xpOf(w) === xp + 1800 && !there(w, 'longmere_m9', MAN) && there(w, 'rime_lodge', WITNESS) === (entry === 'witness') && w.party.bag.includes('hale_token') === (entry === 'home'),
      `${how}: 1,800 xp, he is gone from the hole and ${entry === 'witness' ? 'tells it at the lodge-keeper\'s side' : 'is not at the lodge'}, and nothing is taken from the pack`);
  }

  // The Bell Under the Ice (#56's 42), at 21: asked once the coach's sleeper has a bed; rung by night
  // over the pike at the tower's cap and not by day; its words read by a reader; the sleeper in the
  // hall wakes at it, the healer's sleeps on; the lodge woman goes out to Fuar, or stays.
  const WOMAN = npc('rime_lodge', 'A lodge woman'), AT_HEARTH = npc('coldmere_k9', 'A lodge woman');
  const BELL = K9.features!.find((f) => f.kind === 'sign' && f.id === 'k9_bell')!;
  for (const [bed, sets, entry] of [['q_coach_hall', 'q_icebell_out', 'out'], ['q_coach_temple', 'q_icebell_stay', 'stay']] as const) {
    const w = at(21);
    ok(hear(w, 'rime_lodge', WOMAN).includes('The tower still stands') && !w.party.flags.q_icebell && !page(w, 'icebell'), `${entry}: before the coach's sleeper has a bed the lodge woman speaks of the tower, and asks nothing`);
    coach(w, bed);
    ok(hear(w, 'rime_lodge', WOMAN).includes('Nobody rang the bell') && began(w, 'The Bell Under the Ice') && /tower's cap/.test(goal(w, 'icebell')),
      `${entry}: with the sleeper in a bed she asks for the bell rung (${goal(w, 'icebell')})`);
    hour(w, 12);
    see(w, 'coldmere_k9:k9_clapper');
    ok(!w.world.used('k9_clapper') && !w.party.flags.q_icebell_rung, `${entry}: by day there is nothing at the cap but its slates`);
    hour(w, 23);
    fight(w, 'coldmere_k9:k9_pike_tower');
    see(w, 'coldmere_k9:k9_clapper');
    ok(!!w.party.flags.q_icebell_rung && /lodge woman/.test(goal(w, 'icebell')), `${entry}: by night, the pike over the cap put down, the clapper rings the bell under the ice (${goal(w, 'icebell')})`);
    if (entry === 'out') w.party.members[4].skills = ['linguist'];
    w.world.travel(K9.id, BELL.x, BELL.y);
    const words = w.world.eventsHere();
    w.party.members[4].skills = [];
    ok(words.some((t) => t.includes('"KEEP THE COLD."')) === (entry === 'out') && w.world.used('k9_bell') === (entry === 'out'),
      `${entry}: the bell's lip ${entry === 'out' ? 'read, KEEP THE COLD' : 'unread, with no reader'} (${words.join(' / ')})`);
    ok(there(w, 'rime_lodge', IN_HALL) === (bed === 'q_coach_hall') && (bed !== 'q_coach_hall' || hear(w, 'rime_lodge', IN_HALL).includes('I heard a bell')),
      `${entry}: ${bed === 'q_coach_hall' ? 'in the hall the woman from the coach sits up, and heard a bell' : 'in the healer\'s house she sleeps on, out of sight'}`);
    const xp = xpOf(w);
    answerTo(w, 'rime_lodge', WOMAN, sets);
    reads(w, 'icebell', entry === 'out' ? ['woman', 'rung', 'read', 'out'] : ['woman', 'rung', 'stay'], entry === 'out' ? ['stay'] : ['read', 'out'], entry);
    ok(xpOf(w) === xp + 1800 && there(w, 'rime_lodge', WOMAN) === (entry === 'stay') && there(w, 'coldmere_k9', AT_HEARTH) === (entry === 'out')
      && (entry === 'out' || hear(w, 'rime_lodge', WOMAN).includes('The ice is quiet again')),
    `${entry}: 1,800 xp, and she is ${entry === 'out' ? 'at her people\'s hearth above the old bank' : 'by the yard\'s fire still, listening'}`);
  }

  // Where the Sky Meets Ice (#56's 43), at 22: the guide at the lodge's gate goes up; found at the
  // glacier's foot by her cairn, frostbitten, she is carried in and draws the way east into nothing;
  // it ends at the glacier's edge, and the old marks there, read, put the reach on the world map.
  const GOING = npc('rime_lodge', 'A guide', 0), ON_ICE = npc('longmere_m9', 'A guide'), BROUGHT = npc('rime_lodge', 'A guide', 1);
  const MARKS = M9.features!.find((f) => f.kind === 'sign' && f.id === 'm9_marks')!;
  {
    const w = at(22);
    ok(there(w, 'rime_lodge', GOING) && !there(w, 'longmere_m9', ON_ICE) && !there(w, 'rime_lodge', BROUGHT) && !shows(w, 'longmere_m9', 'm9_guide_cairn'),
      'the guide is at the lodge\'s gate before she goes up, and at the glacier\'s foot is neither guide nor cairn');
    ok(hear(w, 'rime_lodge', GOING).includes('the sky comes down to the ice') && began(w, 'Where the Sky Meets Ice') && !there(w, 'rime_lodge', GOING),
      `she goes up the glacier with her party, and the quest begins (${goal(w, 'sky')})`);
    ok(there(w, 'longmere_m9', ON_ICE) && shows(w, 'longmere_m9', 'm9_guide_cairn') && !shows(w, 'longmere_m9', 'm9_sky'), 'gone up, she is at the glacier\'s foot by her half-built cairn');
    const found = hear(w, 'longmere_m9', ON_ICE);
    ok(found.includes('there are stairs in it') && !there(w, 'longmere_m9', ON_ICE) && there(w, 'rime_lodge', BROUGHT) && /yard fire/.test(goal(w, 'sky')),
      `found frostbitten, she is carried in to the yard's fire (${goal(w, 'sky')})`);
    const xp = xpOf(w), drawn = answerTo(w, 'rime_lodge', BROUGHT, 'q_sky_marked');
    ok(xpOf(w) === xp + 2100 && drawn.includes('into nothing') && /glacier's edge/.test(goal(w, 'sky')) && !page(w, 'sky')?.done,
      `she draws the way on the map, east into nothing, for 2,100 xp, and it ends at the glacier's edge (${goal(w, 'sky')})`);
    see(w, 'longmere_m9:m9_sky');
    reads(w, 'sky', ['guide', 'found', 'marked', 'edge'], [], 'the glacier\'s edge');
    w.world.travel(M9.id, MARKS.x, MARKS.y);
    const blind = w.world.eventsHere();
    ok(!readMarks(w.world).includes('ice_caves') && !blind.some((t) => t.includes('CREW ONLY')), 'with no reader the marks at the ice\'s edge are marks, and the world map shows nothing past it');
    w.party.members[4].skills = ['linguist'];
    const read = w.world.eventsHere();
    w.party.members[4].skills = [];
    ok(read.some((t) => t.includes('"SERVICE STAIR. CREW ONLY."')) && read.some((t) => t.endsWith('marks the world map.')) && readMarks(w.world).includes('ice_caves') && ATLAS.places.some((p) => p.id === 'ice_caves' && p.planned),
      `read, the marks put the Ice Caves on the world map, into the void (${read.slice(1).join(' / ')})`);
  }

  // The Pilgrims in the Pass (#56's 44), at 22: met below the pass, a brother comes down to them and
  // tends the boy wrongly, and does not bleed; they go up with him, or back to the lodge.
  const PILGRIM = npc('coldmere_k10', 'A pilgrim'), DYING = npc('coldmere_k10', 'A dying pilgrim'), BROTHER = npc('coldmere_k10', 'A brother'), BACK = npc('rime_lodge', 'The pilgrims');
  for (const [sets, entry] of [['q_pilgrims_up', 'up'], ['q_pilgrims_back', 'back']] as const) {
    const w = at(22);
    ok(there(w, 'coldmere_k10', PILGRIM) && there(w, 'coldmere_k10', DYING) && !there(w, 'coldmere_k10', BROTHER), `${entry}: the pilgrims below the pass, the boy dying, and no brother yet`);
    ok(hear(w, 'coldmere_k10', PILGRIM).includes('bells in Monks\' Vale') && began(w, 'The Pilgrims in the Pass') && there(w, 'coldmere_k10', BROTHER), `${entry}: met, the quest begins, and a brother has come down the pass to them`);
    const tends = hear(w, 'coldmere_k10', BROTHER);
    ok(tends.includes('rubbing snow into his chest') && tends.includes('it does not bleed'), `${entry}: he cools a boy who is freezing, and his split hand does not bleed`);
    const xp = xpOf(w);
    answerTo(w, 'coldmere_k10', PILGRIM, sets);
    reads(w, 'pilgrims', ['camp', 'brother', entry], [entry === 'up' ? 'back' : 'up'], entry);
    ok(xpOf(w) === xp + 2100 && ![PILGRIM, DYING, BROTHER].some((p) => there(w, 'coldmere_k10', p)) && shows(w, 'coldmere_k10', 'k10_camp') && !shows(w, 'coldmere_k10', 'k10_pilgrims') && there(w, 'rime_lodge', BACK) === (entry === 'back'),
      `${entry}: 2,100 xp, below the pass a cold fire-ring, and ${entry === 'back' ? 'the pilgrims by the lodge\'s yard fire, the boy eating' : 'none of them at the lodge: the monastery is #445\'s'}`);
  }

  // The Faces on the Tors' end (#56's 39): the stonecutter is at the lodge once sent home from the
  // tors on Cairnmoor's O8, and not before, so he never stands in both places.
  {
    const w = at(20);
    const MASON = npc('rime_lodge', 'A stonecutter'), TORS = npc('highmoor_o8', 'A stonecutter');
    ok(there(w, 'highmoor_o8', TORS) && !there(w, 'rime_lodge', MASON), 'the stonecutter is under the tors, and not at the lodge');
    hear(w, 'highmoor_o8', TORS);
    answerTo(w, 'highmoor_o8', TORS, 'q_faces_home');
    ok(!there(w, 'highmoor_o8', TORS) && there(w, 'rime_lodge', MASON) && hear(w, 'rime_lodge', MASON).includes('one eye'), 'sent home, he is gone from the tors and at the lodge, the last tor with one eye');
  }
}

// ---- the chapter (#492) ----

/** A step played at a level, the company levelled to it. */
const atLevel = (level: number, s: Step): Step => ({ name: `${s.name} at ${level}`, play: (w) => {
  for (const m of w.party.members) { m.level = level; m.xp = xpForLevel(level); }
  w.level = level;
  s.play(w);
} });

/** The entries written on the chapter's page. */
const written = (w: Walk): string[] => (quest(w)?.pages.find((p) => p.def === CHAPTER)?.entries ?? []).map((e) => e.id);

/**
 * The four nights: a stay at the inn each, paid from the purse at its price as its screen pays it, and
 * the morning in the yard. Each night's entry is written as its flag is set, and no more.
 */
const NIGHTS_STOOD: Step = { name: 'the four nights', play: (w) => {
  const inn = business('inn')[0], night = inn.price * w.party.members.length;
  for (const [i, flag] of NIGHTS.entries()) {
    const purse = w.party.gold;
    w.party.gold -= night;
    for (const m of w.party.members) rest(m);
    w.world.sleepUntilMorning();
    const set = stayNight(w.party, inn.nights);
    w.world.travel('rime_lodge', inn.x + 1, inn.y);
    w.world.eventsHere();
    listen(w);
    w.ok(set === flag && purse - w.party.gold === night && written(w).includes(flag) && !written(w).includes(NIGHTS[i + 1] ?? 'up'),
      `a night at ${inn.name} for ${night} gold sets ${flag}, and its entry and no later one is written`);
  }
} };

/** The hole's fight on the fourth night, and the last one out, met. */
const HOLE: Step = { name: 'the hole', play: (w) => { fight(w, 'longmere_m9:m9_night_4'); meetWho(w, WENNA_UP); } };

/** Down the crack in Loch Fuar's ice and through the door under her palm, and its inside. */
const DOWN: Step = { name: 'the door', play: (w) => {
  walkThrough(w, K9.id, DOOR.x, DOOR.y - 1, SOUTH, 'sleepers_bay', 1);
  see(w, 'sleepers_bay:sb1_door');
} };

/** Down the stair to its foot and the last flight into the bay, and the beds. */
const BEDS: Step = { name: 'the beds', play: (w) => {
  see(w, 'sleepers_bay:sb1_foot');
  walkThrough(w, 'sleepers_bay', 6, 13, SOUTH, 'sleepers_bay2', 1);
  see(w, 'sleepers_bay2:sb2_beds');
} };

/** Back up through the door from the landing: she speaks at it, and then she is at the lodge. */
function backUp(w: Walk, how: string): void {
  const [door, lodge] = [person(K9, 'The girl out of the hole'), person(TOWN, 'The girl out of the hole')];
  walkThrough(w, 'sleepers_bay', 8, 1, NORTH, K9.id, 1);
  const before = w.world.present(door) && !w.world.present(lodge);
  w.world.travel(K9.id, door.x, door.y);
  const words = meet(door, w.party, heard(w.world, door)).text;
  listen(w);
  w.ok(before && words.includes('marched them on south, under the world') && !!w.party.flags[WENNA_LODGE] && !w.world.present(door) && w.world.present(lodge),
    `${how}, back up from the beds she speaks at the door, and then is at the lodge and not at the door (${words.replace(/\s+/g, ' ')})`);
}

/** Back up, and south over the pass to its mouth. */
const SOUTH_OVER: Step = { name: 'back up, and the pass\'s mouth', play: (w) => { backUp(w, 'in order'); see(w, 'coldmere_k10:k10_mouth'); } };

/**
 * The Sleepers (#492), begun on Loch Fada down the notch from the Cairnfield: in order, the four nights
 * at the inn and the hole at 20, the door at 21, and the beds and the pass's mouth at 22; and with the
 * pass's mouth taken first, where the journal writes nothing of it until the beds, which end the
 * chapter there. Each reads the same and ends once, and in each she speaks at the door after the beds.
 */
function theSleepers(ok: (cond: boolean, msg: string) => void): void {
  const runs: [string, boolean, Step[]][] = [
    ['in order', false, [atLevel(20, NIGHTS_STOOD), atLevel(20, HOLE), atLevel(21, DOWN), atLevel(22, BEDS), atLevel(22, SOUTH_OVER)]],
    ['the pass first', true, [atLevel(20, NIGHTS_STOOD), atLevel(20, HOLE), atLevel(21, DOWN), atLevel(22, BEDS)]],
  ];
  const read: string[] = [];
  for (const [how, passFirst, steps] of runs) {
    const w = newWalk(ok);
    for (const m of w.party.members) { m.level = 20; m.xp = xpForLevel(20); }
    w.party.gold = 2000;
    walkThrough(w, 'cairnfield_n8', NOTCH.x + 1, NOTCH.y, WEST, NOTCH.to, 2);
    const lodge = CHAPTER.goals.at(-1)!.text;
    ok(quest(w)?.goal === lodge && written(w).join() === 'lodge', `${how}, down the notch the chapter begins, its goal the lodge's nights (${quest(w)?.goal})`);
    if (passFirst) {
      see(w, 'coldmere_k10:k10_mouth');
      ok(quest(w)?.goal === lodge && written(w).join() === 'lodge', `${how}, the pass's mouth reached first writes nothing, and the goal stays on the lodge (${written(w).join(', ')})`);
    }
    playChapter(w, CHAPTER, steps, how);
    goalFromBegun(w, how);
    const ends = w.news.filter((n) => n === `Chapter complete: ${CHAPTER.title}.`).length;
    ok(!!quest(w)?.pages.find((p) => p.def === CHAPTER)?.done && ends === 1 && w.level === 22,
      `${how}, the beds seen and the pass's mouth reached, the chapter is done at 22, and said so once (${ends})`);
    if (passFirst) backUp(w, how);
    read.push(written(w).join(', '));
  }
  ok(read[0] === 'lodge, night_1, night_2, night_3, night_4, up, door, sleepers, south' && read[1] === read[0],
    `the chapter reads the same in order and with the pass first (${read.join(' / ')})`);
  everyGoalWalked(ok, [CHAPTER]);
}
