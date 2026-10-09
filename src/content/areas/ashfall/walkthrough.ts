// Ashfall's walkthrough. Its chapter, The Window, is #518's, which plays it here; until then,
// Cinderport's box (G10, #511) walked: put down at the gate's front, its way in until Cinderport is
// built (#512), since nothing beside it is; the gate barred and the gate-ward in it each time; the road
// square to square from the gate's front up the wall to the north edge and out south-west to the west
// edge, past which, for now, the world ends; the trading ground: the ground's line, the eldest's story,
// the Riders' fires and horses and their shrine; the milestone; the chandler's racks under the wall; the
// stream forded on its stones and the knoll over it; the hermit and the clay pit under the vines; the
// box's groups won at its floor, the vines never roaming; and the factor's hide, found from the cut vines
// at its mouth. Then Fire Mountain's flank (G11, #513), walked onto over G10's south edge: the crossing
// line both ways; the track past the shrine at its head to Grimsforge, the warlord's heir at the anvil,
// the camp in its lee and the scavenger by the fire; the vents, barred until Meridian Camp is built, and
// the furnace-draught that is no way in; the cone's mouth and the lookout on its shoulder; the box's
// groups won at its floor, the sentry only after the Stone; and the scavenger's hole, found from the rope
// at its mouth, its far end barred as the vents are.
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen } from '../../../../tools/walk.ts';
import { EAST, NORTH, SOUTH } from '../../../game/types.ts';
import type { Facing } from '../../../game/types.ts';
import { ATLAS, MAP_DEFS, MONSTERS } from '../../index.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { meet, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { GATE } from './maps/cindercoast_g10.ts';
import { VENTS, HOLE } from './maps/firemount_g11.ts';

const G10 = MAP_DEFS.find((d) => d.id === 'cindercoast_g10')!, G11 = MAP_DEFS.find((d) => d.id === 'firemount_g11')!;
const person = (name: string, d = G10): Person => d.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
const COAST = ATLAS.zones.find((z) => z.id === 'cindercoast')!;

export const walkthrough: Walkthrough = (ok) => {
  const w = newWalk(ok);
  const out = buildMaps()[OUTDOORS];
  const g10 = out.zones.find((z) => z.id === 'cindercoast_g10')!;
  w.level = 24;
  for (const m of w.party.members) m.level = 24;
  const at = (x: number, y: number): number => (g10.y + y) * out.width + g10.x + x;
  const onG10 = (x: number, y: number): boolean => x >= g10.x && x < g10.x + g10.w && y >= g10.y && y < g10.y + g10.h;
  const reach = (fx: number, fy: number, along: (x: number, y: number) => boolean, z = g10): Set<number> => {
    const seen = new Set([(z.y + fy) * out.width + z.x + fx]), q = [[z.x + fx, z.y + fy]];
    for (let i = 0; i < q.length; i++) {
      const [x, y] = q[i];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = (y + dy) * out.width + x + dx; if (!seen.has(k) && along(x + dx, y + dy)) { seen.add(k); q.push([x + dx, y + dy]); } }
    }
    return seen;
  };
  const walk = (x: number, y: number): boolean => onG10(x, y) && out.passable(x, y) === 'ok';

  // The way in: nothing beside the box is built, so the company is put down at the gate's front, where
  // Cinderport's way out will land (#512) and the ship and the ride come in through the town (#547).
  ok(G10.start.x === GATE.x && G10.start.y === GATE.y + 1 && G10.start.facing === SOUTH && !(G10.exits ?? []).length,
    'the box\'s way in is the gate\'s front, 6,3, facing south, and it has no way out but its edges');
  ok(COAST.maps?.length === 1 && COAST.maps[0].map === 'cindercoast_g10' && !!COAST.crossing?.harder && !!COAST.crossing?.warning,
    'Cindercoast holds G10 and has its crossing words, said when a box beside it is built and walked over (#166)');
  w.world.travel('cindercoast_g10', G10.start.x, G10.start.y, SOUTH);
  ok(w.world.zone?.id === 'cindercoast_g10' && w.world.state.x === g10.x + GATE.x && w.world.state.y === g10.y + GATE.y + 1, 'put down at the gate\'s front on G10');

  // The gate, barred until Cinderport is built: the gate-ward in it, said at its front each time.
  const gate = G10.features!.find((f) => f.kind === 'event' && f.id === 'g10_gate');
  ok(gate?.kind === 'event' && !gate.once && gate.x === GATE.x && gate.y === GATE.y + 1 && out.passable(g10.x + GATE.x, g10.y + GATE.y) !== 'ok' && GATE.to === 'cinderport',
    'the gate at 6,2 is barred until Cinderport is built (GATE), and the gate-ward in it is met at its front each time');
  const plate = ATLAS.places.find((p) => p.id === 'cinderport')!.at;
  ok(Math.floor(plate[0]) === g10.x + GATE.x && Math.floor(plate[1]) === g10.y + GATE.y, `the gate at 6,2 is Cinderport's plate on the atlas (${plate.join(',')})`);

  // The road square to square from the gate's front, up the wall's west side to the north edge and out
  // south-west through the vines to the west edge; past both, for now, the world ends.
  const road = reach(GATE.x, GATE.y + 1, (x, y) => onG10(x, y) && out.at(x, y).ch === '=');
  ok(road.has(at(3, 0)) && road.has(at(0, 7)) && road.has(at(0, 8)) && out.passable(g10.x + 3, g10.y - 1) !== 'ok' && out.passable(g10.x - 1, g10.y + 7) !== 'ok',
    'the road runs square to square from the gate\'s front to the north edge at 3,0 and to the west edge at 0,7 and 0,8, and past both, for now, the world ends');
  const stone = G10.features!.find((f) => f.kind === 'event' && f.id === 'g10_milestone');
  ok(stone?.kind === 'event' && stone.text.includes('OLD CINDER 4, THE WOLD 6') && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => road.has(at(stone.x + dx, stone.y + dy))),
    'the milestone stands by the road where it leaves the ground: OLD CINDER 4, THE WOLD 6');
  see(w, 'cindercoast_g10:g10_milestone');

  // The trading ground: the ground's line, the eldest's story at the Riders' fire, their horses and shrine.
  see(w, 'cindercoast_g10:g10_ground');
  ok(w.world.used('g10_ground'), 'on the ground outside the gate, the horses and the fires: the Riders come down to trade');
  const eldest = person('The eldest');
  w.world.travel('cindercoast_g10', eldest.x, eldest.y);
  const story = meet(eldest, w.party, heard(w.world, eldest)).text;
  ok(story.includes('pillar of fire') && story.includes('Remember what that cost'), 'the Riders\' eldest tells the oldest story on this side of the sea');
  const fires = G10.features!.find((f) => f.kind === 'camp' && f.name === 'The Riders\' fires');
  ok(!!fires && Math.abs(fires.x - eldest.x) + Math.abs(fires.y - eldest.y) <= 3, 'the Riders\' fires are a camp beside the horse-lines, by the eldest');
  see(w, 'cindercoast_g10:g10_horses');
  const shrine = G10.features!.find((f): f is Extract<typeof f, { kind: 'shrine' }> => f.kind === 'shrine' && f.id === 'g10_shrine');
  ok(!!shrine && out.at(g10.x + shrine.x, g10.y + shrine.y).ch === ',' && shrine.text.includes('horse'), 'the Riders\' shrine stands on the ground, a horse\'s skull on a post');
  const racks = G10.features!.find((f) => f.kind === 'event' && f.id === 'g10_racks');
  ok(!!racks && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => out.at(g10.x + racks.x + dx, g10.y + racks.y + dy).solid === 'building'), 'the chandler\'s racks stand under the town\'s wall');
  see(w, 'cindercoast_g10:g10_racks');

  // Over the stream on its stones to the knoll, and the vines along the shore east of the town.
  const dry = reach(GATE.x, GATE.y + 1, walk);
  ok(dry.has(at(21, 2)) && dry.has(at(26, 8)) && !reach(GATE.x, GATE.y + 1, (x, y) => walk(x, y) && out.at(x, y).ch !== '"').has(at(21, 2)),
    'the stream is crossed only on its stones, to the knoll and the vines east of it');
  see(w, 'cindercoast_g10:g10_knoll');

  // Under the west vines, the hermit who came down off the mountain, and the potter's clay pit.
  const hermit = person('A hermit');
  w.world.travel('cindercoast_g10', hermit.x, hermit.y);
  ok(meet(hermit, w.party, heard(w.world, hermit)).text.includes('came down off the mountain'), 'the hermit under the vines came down off the mountain, as the first did');
  see(w, 'cindercoast_g10:g10_clay');

  // The box's groups, each won at its floor: the beetles south of the ground, the vines in the shore's
  // trees, which never roam, and at the far end the salamanders and the drake, the box's group at 25.
  ok(G10.encounters!.filter((g) => g.monsters.includes('strangler_vine')).every((g) => g.roams === false), 'the strangler vines never roam');
  for (const g of G10.encounters!) fight(w, `cindercoast_g10:${g.id}`);
  const overhead = G10.features!.find((f) => f.kind === 'event' && f.id === 'g10_overhead');
  ok(overhead?.kind === 'event' && JSON.stringify(overhead.when) === JSON.stringify({ hours: 'day' }), 'by day a drake turns over the ash, a warning of the slopes');

  // The secret: the cut vines at the hide's mouth, the search there and the crates behind the trees.
  // Walked, waded, climbed or floated, the hide is never reached but through its mouth.
  const [door] = G10.secrets!;
  const shut = reach(door.x - 1, door.y, (x, y) => !(x === g10.x + door.x && y === g10.y + door.y) && onG10(x, y) && out.passable(x, y, { swim: true, climb: true, float: true }) === 'ok');
  ok(shut.size > 300 && !shut.has(at(door.x + 1, door.y)) && !shut.has(at(door.x + 2, door.y)), `the hide is shut but for its mouth: none of G10's ${shut.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'cindercoast_g10:g10_cut');
  w.world.travel('cindercoast_g10', door.x - 1, door.y, EAST);
  let opens = false;
  for (let i = 0; i < 20 && !opens; i++) opens = w.world.search();
  const inside = opens ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(opens && inside.every((r) => r.kind === 'moved') && w.world.used('g10_crates'), 'searched where the vines are cut, the trees open, and the crates behind them can be walked to');
  listen(w);
  const hide = G10.features!.find((f) => f.kind === 'chest' && f.id === 'g10_hide');
  ok(hide?.kind === 'chest' && hide.items.includes('longsword+2') && hide.x === door.x + 2 && hide.y === door.y, 'in the hide, among the crates, a Long Sword +2');

  // Fire Mountain's flank (G11, #513): over G10's south edge onto G11's, where the track comes down off
  // the coast, the box's way in. Three or more under the mountain's floor the plainer warning, one or two
  // under the harder words, at the floor its name and nothing more; straight back, nothing. Back over the
  // line under Cindercoast's floor, the coast's own words, as true coming down off the mountain as down
  // the Stair.
  const g11 = out.zones.find((z) => z.id === 'firemount_g11')!;
  const on11 = (x: number, y: number): boolean => x >= g11.x && x < g11.x + g11.w && y >= g11.y && y < g11.y + g11.h;
  const at11 = (x: number, y: number): number => (g11.y + y) * out.width + g11.x + x;
  const cross = (level: number, from: string, x: number, y: number, facing: Facing): string[] => {
    for (const m of w.party.members) m.level = level;
    w.world.travel(from, x, y, facing);
    const r = w.world.move('forward');
    return r.kind === 'moved' ? r.messages : [r.kind];
  };
  const down = (level: number): string[] => cross(level, 'cindercoast_g10', G11.start.x, 31, SOUTH);
  const low = down(22), two = down(23), due = down(25);
  ok(w.world.zone?.id === 'firemount_g11' && w.world.state.x === g11.x + G11.start.x && w.world.state.y === g11.y && g11.x === g10.x && g11.y === g10.y + 32 && G11.start.y === 0 && G11.start.facing === SOUTH && !(G11.exits ?? []).length,
    'over G10\'s south edge from its 28,31 onto G11\'s 28,0, walked, the box\'s way in, and it has no way out but its edges');
  ok(due.join(' / ') === 'Fire Mountain.', `at 25, Fire Mountain named, no more (${due.join(' / ')})`);
  ok(two.join(' / ') === 'Fire Mountain. The land here is harder than the road behind.', `at 23, the land harder than the road behind (${two.join(' / ')})`);
  ok(low.join(' / ') === 'Fire Mountain. Nothing here would spare you. The road behind is still open.', `at 22, the plainer warning, and the road behind open (${low.join(' / ')})`);
  const straight = cross(25, 'firemount_g11', G11.start.x, 0, NORTH);
  ok(w.world.zone?.id === 'cindercoast_g10' && straight.length === 0, `straight back over the line onto G10, nothing said (${straight.join(' / ')})`);
  const upTwo = cross(22, 'firemount_g11', G11.start.x, 0, NORTH), upLow = cross(21, 'firemount_g11', G11.start.x, 0, NORTH);
  ok(upTwo.join(' / ') === `Cindercoast. ${COAST.crossing?.harder}`, `at 22, off the mountain onto the shore, the coast's harder words (${upTwo.join(' / ')})`);
  ok(upLow.join(' / ') === `Cindercoast. ${COAST.crossing?.warning}`, `at 21, the coast's warning (${upLow.join(' / ')})`);
  w.level = 25;
  for (const m of w.party.members) m.level = 25;

  // Down the track past the shrine at its head, where the stokers' tracks begin, to Grimsforge and the vents.
  const walk11 = (x: number, y: number): boolean => on11(x, y) && out.passable(x, y) === 'ok';
  const track = reach(G11.start.x, G11.start.y, walk11, g11);
  ok(track.has(at11(28, 12)) && track.has(at11(VENTS.x + 1, VENTS.y)) && track.has(at11(14, 10)) && track.has(at11(2, 15)), 'from the way in the track runs down between the mountain and the edge to Grimsforge and the vents, and out over the ash');
  const head = G11.features!.find((f): f is Extract<typeof f, { kind: 'shrine' }> => f.kind === 'shrine' && f.id === 'g11_shrine');
  ok(!!head && track.has(at11(head.x, head.y)) && head.y <= 3 && head.text.includes('head of the track'), 'the shrine stands at the track\'s head, where the stokers\' tracks begin');

  // Grimsforge at the atlas's mark, the warlord's heir at the anvil, a rack by the forge; in its lee a
  // camp, and the scavenger by the fire, who says nothing of where he goes.
  const forge = ATLAS.sites.find((q) => q.name === 'Grimsforge')!;
  ok(!forge.planned && Math.floor(forge.at[0]) === g11.x + 30 && Math.floor(forge.at[1]) === g11.y + 12 && out.at(g11.x + 30, g11.y + 12).solid === 'building',
    `Grimsforge stands at the atlas's mark, G11's 30,12, built (${forge.at.join(',')})`);
  see(w, 'firemount_g11:g11_forge');
  const heir = person('The warlord\'s heir', G11);
  w.world.travel('firemount_g11', heir.x, heir.y);
  ok(meet(heir, w.party, heard(w.world, heir)).text.includes('went down beside the forge'), 'the warlord\'s heir at the anvil: a man went down beside the forge with a rope');
  const rack = G11.features!.find((f) => f.kind === 'chest' && f.id === 'g11_rack');
  ok(rack?.kind === 'chest' && rack.items.includes('warhammer+1') && out.at(g11.x + rack.x, g11.y + rack.y - 1).solid === 'building', 'under the forge\'s wall, a War Hammer +1');
  const lee = G11.features!.find((f) => f.kind === 'camp');
  ok(!!lee && out.at(g11.x + lee.x, g11.y + lee.y - 1).solid === 'building', 'a camp in the lee of the forge');
  const scavenger = person('A scavenger', G11);
  w.world.travel('firemount_g11', scavenger.x, scavenger.y);
  const sold = meet(scavenger, w.party, heard(w.world, scavenger)).text;
  ok(sold.includes('smith in Cinderport') && !['rope', 'hole', 'down'].some((word) => sold.includes(word)), 'the scavenger sells to a smith in Cinderport, and says nothing of where he goes');

  // The vents: three mouths, the middle one the way down to Meridian Camp, barred until it is built
  // (VENTS), and the step's line at their front each time; the furnace-draught, a vent and no way in.
  const vents = G11.features!.find((f) => f.kind === 'event' && f.id === 'g11_vents');
  ok(vents?.kind === 'event' && !vents.once && vents.x === VENTS.x + 1 && vents.y === VENTS.y && VENTS.to === 'meridian_camp' && out.passable(g11.x + VENTS.x, g11.y + VENTS.y) !== 'ok'
    && [-1, 0, 1].every((dy) => out.at(g11.x + VENTS.x, g11.y + VENTS.y + dy).terrain === 'vent'),
    'the vents are three mouths at 26,15 to 17, the middle one barred until Meridian Camp is built (VENTS), and their line is said at its front each time');
  const mark = ATLAS.sites.find((q) => q.name === 'Meridian Camp')!;
  ok(Math.floor(mark.at[0]) === g11.x + VENTS.x && Math.floor(mark.at[1]) === g11.y + VENTS.y, `the middle mouth is Meridian Camp's mark on the atlas (${mark.at.join(',')})`);
  see(w, 'firemount_g11:g11_vents');
  ok(out.at(g11.x + 22, g11.y + 11).terrain === 'vent' && out.passable(g11.x + 22, g11.y + 11) !== 'ok', 'the furnace-draught is a vent in the rock, and no way in');
  see(w, 'firemount_g11:g11_draught');

  // The cone: its mouth at the atlas's mark, a vent in the volcano; the lookout on its shoulder, the
  // cairn on its ash foot, the Hills' line on the west, and the flows coming down off it.
  const cone = ATLAS.sites.find((q) => q.name === 'Fire Mountain')!;
  const [cx, cy] = [Math.floor(cone.at[0]) - g11.x, Math.floor(cone.at[1]) - g11.y];
  ok(!cone.planned && cx === 15 && cy === 8 && out.at(g11.x + cx, g11.y + cy).terrain === 'vent' && [[1, 0], [-1, 0], [0, 1], [0, -1]].every(([dx, dy]) => out.at(g11.x + cx + dx, g11.y + cy + dy).terrain === 'volcano'),
    `the cone's mouth is Fire Mountain's mark on the atlas, G11's 15,8, a vent in the volcano (${cone.at.join(',')})`);
  for (const id of ['g11_lookout', 'g11_hills', 'g11_bed', 'g11_crust', 'g11_heaps', 'g11_tracks', 'g11_bombs', 'g11_bones', 'g11_glass', 'g11_ember']) see(w, `firemount_g11:${id}`);
  const cairn = G11.features!.find((f) => f.kind === 'cairn' && f.id === 'g11_cairn');
  ok(cairn?.kind === 'cairn' && cairn.gold > 0 && cairn.x <= 4 && cairn.y <= 3, 'a cairn on the mountain\'s ash foot in the north-west, walked to from G10');

  // The box's groups, each won at its floor: the salamanders on the slopes, the vents' fight, two
  // stokers with ember salamanders where fire is useless, a drake alone on a flow, and the sentry that
  // walks in only once the Ember Stone is lit, the box's top.
  const vented = G11.encounters!.find((g) => g.id === 'g11_stokers');
  ok(vented?.monsters.filter((m) => m === 'stoker').length === 2 && vented.monsters.includes('ember_salamander') && !!MONSTERS.stoker.immune?.includes('fire'),
    'at the vents two stokers with ember salamanders, and fire does not touch a stoker');
  ok(JSON.stringify(G11.encounters!.find((g) => g.id === 'g11_sentry')?.after) === JSON.stringify({ flag: 'q_ember_lit' }), 'the sentry walks in only once the Ember Stone is lit');
  for (const g of G11.encounters!) fight(w, `firemount_g11:${g.id}`);

  // The secret: the rope on the rock where no vine grows and the smith's word; the search there, the
  // ledge behind the rocks with his finds, and the hole going on down, barred until Meridian Camp is
  // built (HOLE). Walked, waded, climbed or floated, the hole is never reached but through its mouth.
  const [mouth] = G11.secrets!;
  const shut11 = reach(mouth.x - 1, mouth.y, (x, y) => !(x === g11.x + mouth.x && y === g11.y + mouth.y) && on11(x, y) && out.passable(x, y, { swim: true, climb: true, float: true }) === 'ok', g11);
  ok(shut11.size > 300 && !shut11.has(at11(mouth.x + 1, mouth.y)) && !shut11.has(at11(mouth.x + 2, mouth.y)), `the hole is shut but for its mouth: none of G11's ${shut11.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'firemount_g11:g11_rope');
  w.world.travel('firemount_g11', mouth.x - 1, mouth.y, EAST);
  let found = false;
  for (let i = 0; i < 20 && !found; i++) found = w.world.search();
  const into = found ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(found && into.every((r) => r.kind === 'moved') && w.world.used('g11_finds'), 'searched at the rope, the rocks open, and the ledge behind them can be walked to');
  listen(w);
  const finds = G11.features!.find((f) => f.kind === 'chest' && f.id === 'g11_hole');
  ok(finds?.kind === 'chest' && finds.items.includes('great_axe+2') && finds.x === mouth.x + 2 && finds.y === mouth.y, 'in the hole, with his finds, a Great Axe +2');
  ok(HOLE.to === 'meridian_camp' && HOLE.x === mouth.x + 2 && HOLE.y === mouth.y + 1 && out.passable(g11.x + HOLE.x, g11.y + HOLE.y) !== 'ok',
    'the hole goes on down at 31,17, barred until Meridian Camp is built (HOLE)');
};
