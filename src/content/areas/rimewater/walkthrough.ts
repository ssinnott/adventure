// Rimewater's walkthrough. Its chapter, The Sleepers, is #492's, which plays it here; until then, Rime
// Lodge's box (M9, #486) walked: down from the Cairnfield's notch onto the road's foot under the fells,
// the loch's crossing line said at each level, and back up; the road square to square to the lodge's gate, shut until the town is built, and on
// over the causeway to the west edge for L9, where for now the world ends; the milestone, counted
// along the roads; the coach yard, with nobody on the box selling the coach; the lodge-keeper at the
// hole's fire, the man at its foot and the guide at the glacier's edge; the box's groups won at its
// floor, the pike under the ice; and the guide's hollow behind the glacier's one bare face.
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen } from '../../../../tools/walk.ts';
import { EAST, SOUTH, WEST } from '../../../game/types.ts';
import { ATLAS, MAP_DEFS } from '../../index.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { worldGrid } from '../../../game/atlas.ts';
import { meet, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { NOTCH } from '../cairnmoor/maps/cairnfield_n8.ts';
import { UP, GATE, LAKE_DOOR } from './maps/longmere_m9.ts';

const M9 = MAP_DEFS.find((d) => d.id === 'longmere_m9')!;
const LOCH = ATLAS.zones.find((z) => z.id === 'longmere')!;
const person = (name: string): Person => M9.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;

export const walkthrough: Walkthrough = (ok) => {
  const w = newWalk(ok);
  const out = buildMaps()[OUTDOORS];
  const m9 = out.zones.find((z) => z.id === 'longmere_m9')!, n8 = out.zones.find((z) => z.id === 'cairnfield_n8')!;
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
  // lodge, over the loch's head on the causeway and out by the west edge at 0,20 for L9, where for
  // now the world ends.
  const road = (x: number, y: number): boolean => out.at(x, y).ch === '=';
  const reach = (fx: number, fy: number, along: (x: number, y: number) => boolean): Map<number, number> => {
    const d = new Map([[fy * out.width + fx, 0]]), q = [[fx, fy]];
    for (let i = 0; i < q.length; i++) {
      const [x, y] = q[i], n = d.get(y * out.width + x)!;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = (y + dy) * out.width + x + dx; if (!d.has(k) && along(x + dx, y + dy)) { d.set(k, n + 1); q.push([x + dx, y + dy]); } }
    }
    return d;
  };
  const onM9 = (x: number, y: number): boolean => x >= m9.x && x < m9.x + m9.w && y >= m9.y && y < m9.y + m9.h;
  const byRoad = reach(m9.x + NOTCH.tx, m9.y + NOTCH.ty, (x, y) => road(x, y) && onM9(x, y));
  ok(byRoad.has((m9.y + GATE.y) * out.width + m9.x + GATE.x + 1) && byRoad.has((m9.y + 20) * out.width + m9.x),
    'the road runs square to square over M9 from the landing to the gate\'s front at 19,8, and on over the causeway to the west edge at 0,20');
  ok(road(m9.x, m9.y + 20) && out.passable(m9.x - 1, m9.y + 20) !== 'ok' && ATLAS.zones.find((z) => z.id === 'longmere')?.maps?.length === 1,
    'the road leaves M9 by its west edge for L9, and past it, for now, the world ends');

  // The gate in the lodge's east wall, and the door in its lake wall, shut until Rime Lodge is built
  // (#487), their ways in written beside the map.
  ok(!M9.exits!.includes(GATE) && !M9.exits!.includes(LAKE_DOOR) && GATE.to === 'rime_lodge' && LAKE_DOOR.to === 'rime_lodge'
    && out.passable(m9.x + GATE.x, m9.y + GATE.y) !== 'ok' && out.passable(m9.x + LAKE_DOOR.x, m9.y + LAKE_DOOR.y) !== 'ok' && out.at(m9.x + LAKE_DOOR.x, m9.y + LAKE_DOOR.y + 1).terrain === 'ice',
    'the gate at 18,8 and the lake wall\'s door at 13,10, onto the ice, are shut until the town is built');
  w.world.travel('longmere_m9', GATE.x + 1, GATE.y, WEST);
  ok(w.world.eventsHere().some((t) => t.includes('barred')), 'before the gate, it is shut and barred from inside');
  w.world.travel('longmere_m9', LAKE_DOOR.x, LAKE_DOOR.y + 1);
  ok(w.world.eventsHere().some((t) => t.includes('barred')), 'and the lake wall\'s door, onto the ice, is barred too');

  // The milestone where the road comes off the fells, counted along the roads at 13 squares to the
  // unit, a stone saying 1 for anything under it: to the lodge's gate, and on along the drove road,
  // the atlas's beyond the boxes built, to the high pass out of Loch Fuar.
  const grid = worldGrid(ATLAS, MAP_DEFS);
  const drove = (x: number, y: number): boolean => road(x, y) || (!out.zoneAt(x, y) && !!grid.road[y * out.width + x]);
  const corner = (along: (x: number, y: number) => boolean) => (x: number, y: number): boolean => along(x, y) || ((out.passable(x, y) === 'ok' || !out.zoneAt(x, y)) && [-1, 1].some((d) => along(x + d, y)) && [-1, 1].some((d) => along(x, y + d)));
  const stone = M9.features!.find((f) => f.kind === 'event' && f.id === 'm9_milestone')!;
  const [sx, sy] = [m9.x + stone.x, m9.y + stone.y];
  const fromStone = reach(sx, sy, corner(drove));
  const toLodge = (fromStone.get((m9.y + GATE.y) * out.width + m9.x + GATE.x + 1) ?? Infinity) + 1;
  const [px, py] = ATLAS.links.find((l) => l.from === 'coldmere' && l.to === 'monksvale')!.a!;
  const end = [...fromStone].map(([k, n]) => ({ n, left: Math.abs(k % out.width - px) + Math.abs(Math.floor(k / out.width) - py) }))
    .reduce((a, b) => (b.left < a.left || (b.left === a.left && b.n < a.n) ? b : a));
  const toPass = end.n + end.left, units = (n: number): number => Math.max(1, Math.round(n / 13));
  ok(road(sx, sy) && stone.kind === 'event' && stone.text.includes(`RIME LODGE ${units(toLodge)},`) && stone.text.includes(`THE PASS ${units(toPass)}.`),
    `the milestone says RIME LODGE ${units(toLodge)} and THE PASS ${units(toPass)}: ${toLodge} squares along the road to the lodge's gate and ${toPass} to the high pass`);

  // The coach yard outside the gate; the coach and its coachman are the town's (#487, #539), so nobody
  // on the box sells its passage.
  see(w, 'longmere_m9:m9_yard');
  ok(!M9.features!.some((f) => f.kind === 'npc' && f.passage), 'nobody on the box sells the coach: its coachman is the town\'s');

  // The hole's fire and its keeper, a Lantern, with the lodge-keepers' word of the glacier; the man on
  // the shelf of ice at its foot; and the guide at the glacier's edge, building her cairn.
  see(w, 'longmere_m9:m9_hole');
  const said = (name: string): string => { const p = person(name); w.world.travel('longmere_m9', p.x, p.y); return meet(p, w.party, heard(w.world, p)).text; };
  ok(said('A lodge-keeper').includes('glacier gives nothing back'), 'the lodge-keeper at the hole\'s fire says the glacier gives nothing back');
  ok(said('A man at the hole').includes('went back down'), 'the man on the shelf of ice under the hole\'s lip says she went back down');
  ok(said('A guide').includes('where the sky meets the ice'), 'the guide at the glacier\'s foot took a party up to where the sky meets the ice');
  see(w, 'longmere_m9:m9_guide_cairn');
  listen(w);

  // The box's groups, each won at its floor: the lynxes in the pines, the pike under the loch's ice,
  // on it, and the bears at the glacier's edge, the hardest.
  for (const g of M9.encounters!.filter((e) => e.under)) ok(g.under === 'ice' && out.at(m9.x + g.x, m9.y + g.y).terrain === 'ice', `${g.id} lives under the loch's ice`);
  for (const g of M9.encounters!) fight(w, `longmere_m9:${g.id}`);

  // The secret: the glacier's foot, snow on every face but one, the search there and the hollow behind
  // the bare face. Walked, waded, climbed or floated, it is never reached but through the face.
  const shut = (from: [number, number], door: [number, number], prize: [number, number]): { size: number; reached: boolean } => {
    const seen = new Set<number>(), todo = [[m9.x + from[0], m9.y + from[1]]];
    while (todo.length) {
      const [x, y] = todo.pop()!, k = y * out.width + x;
      if (seen.has(k) || (x === m9.x + door[0] && y === m9.y + door[1]) || !onM9(x, y) || out.passable(x, y, { swim: true, climb: true, float: true }) !== 'ok') continue;
      seen.add(k);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
    }
    return { size: seen.size, reached: seen.has((m9.y + prize[1]) * out.width + m9.x + prize[0]) };
  };
  const hollow = shut([28, 24], [29, 24], [30, 24]);
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
};
