// Ashfall's walkthrough. Its chapter, The Window, is #518's, which plays it here; until then,
// Cinderport's box (G10, #511) walked: put down at the gate's front, where Cinderport's way out lands,
// since only the Waste's road west of it and Fire Mountain's flank south of it are built beside it; the
// gate a door into the town (#512); the road square to square from the gate's front up the wall to the
// north edge, past which, for now, the world ends, and out south-west to the west edge, where F10's road
// meets it; the trading ground: the ground's line, the eldest's story, the Riders' fires and horses and
// their shrine; the milestone; the chandler's racks under the wall; the stream forded on its stones and
// the knoll over it; the hermit and the clay pit under the vines; the box's groups won at its floor, the
// vines never roaming; and the factor's hide, found from the cut vines at its mouth. Then Cinderport
// (#512), in at the gate and out again, its businesses, its two halls and its crossings. Then Fire
// Mountain's flank (G11, #513), walked onto over G10's south edge: the crossing line both ways; the track
// past the shrine at its head to Grimsforge, the warlord's heir at the anvil, the camp in its lee and the
// scavenger by the fire; the vents, the middle mouth the way down into Meridian Camp, and the
// furnace-draught that is no way in; the cone's mouth and the lookout on its shoulder; the box's groups
// won at its floor, the sentry only after the Stone; and the scavenger's hole, found from the rope at
// its mouth, its far end going down. Then Meridian Camp's first level, the vents (#22): down the middle
// mouth and up again, down the scavenger's rope and up again; the flue hall, the drift and the stokers'
// path; the Company's trail, the Guild's chain pin and the chalked arrows down past their cold camp to
// the stair, barred until the iron corridors are built; the grates and the rounds; the groups won at
// 25, the sentry only after the Stone; and the furnace room, with the Ember Stone's first part in the
// furnace's mouth and the stokers' parts beside it. Then the Ember Waste's road (F10 and E10, #517): over G10's west edge, walked,
// the Waste's crossing words and back the coast's; the road square to square over F10 and E10 to the
// Wold's edge; the milestone, the vines' end, the Archdruid at his outcrop, the shrine, the cairn and the
// camp; over onto E10 with nothing said; the notch and its waymark, the hermit, the flow's head; E10 laid
// whole and bare of the Wold's; the groups won at the floor; and the grave, found from the cairn that
// looks back.
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen } from '../../../../tools/walk.ts';
import type { Walk } from '../../../../tools/walk.ts';
import { EAST, NORTH, SOUTH, WEST } from '../../../game/types.ts';
import type { Facing } from '../../../game/types.ts';
import { ATLAS, MAP_DEFS, MONSTERS, GUILD_QUESTS } from '../../index.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { GameMap } from '../../../game/map.ts';
import type { Feature } from '../../../game/map.ts';
import { restRefused } from '../../../game/wilds.ts';
import { meet, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { buy, item } from '../../../game/items.ts';
import { canTrainAt, xpForLevel, rest, trainPrice, levelUp, templePrice, addCondition } from '../../../game/party.ts';
import { makeRng } from '../../../lib/engine/rng.ts';
import { offered, take, inHand, report, rankOf } from '../../../game/guilds.ts';
import { rankFlag } from '../../guilds.ts';
import { take as sail, fareOf } from '../../../game/passage.ts';
import { MINUTES_PER_DAY } from '../../../game/calendar.ts';
import { serialize, deserialize } from '../../../game/save.ts';
import { World } from '../../../game/world.ts';
import { COMPACT_SHIP, RIDERS_RIDE, LAST_CROSSING } from '../../crossings.ts';
import { ACT_IV } from '../../../../tools/tests/ladder.ts';
import { ARMOURER, CURES } from './items.ts';
import { INTERIORS } from './interiors.ts';
import { GATE } from './maps/cindercoast_g10.ts';
import { VENTS, HOLE } from './maps/firemount_g11.ts';
import { STAIR } from './maps/meridian_camp.ts';

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
  // Cinderport's way out lands (#512) and the ship and the ride come in through the town (#547).
  ok(G10.start.x === GATE.x && G10.start.y === GATE.y + 1 && G10.start.facing === SOUTH && G10.exits?.length === 1 && G10.exits[0] === GATE,
    'the box\'s way in is the gate\'s front, 6,3, facing south, and its one way out but its edges is Cinderport\'s gate');
  ok(COAST.maps?.length === 1 && COAST.maps[0].map === 'cindercoast_g10' && !!COAST.crossing?.harder && !!COAST.crossing?.warning,
    'Cindercoast holds G10 and has its crossing words, said when a box beside it is built and walked over (#166)');
  w.world.travel('cindercoast_g10', G10.start.x, G10.start.y, SOUTH);
  ok(w.world.zone?.id === 'cindercoast_g10' && w.world.state.x === g10.x + GATE.x && w.world.state.y === g10.y + GATE.y + 1, 'put down at the gate\'s front on G10');

  // The gate open (#512): a door in the town's wall into Cinderport, nobody barring its front.
  ok(out.at(g10.x + GATE.x, g10.y + GATE.y).door === 'door' && GATE.to === 'cinderport' && !G10.features!.some((f) => f.x === GATE.x && f.y === GATE.y + 1),
    'the gate at 6,2 is a door into Cinderport (GATE), and nobody bars its front');
  const plate = ATLAS.places.find((p) => p.id === 'cinderport')!.at;
  ok(Math.floor(plate[0]) === g10.x + GATE.x && Math.floor(plate[1]) === g10.y + GATE.y, `the gate at 6,2 is Cinderport's plate on the atlas (${plate.join(',')})`);

  // The road square to square from the gate's front, up the wall's west side to the north edge and out
  // south-west through the vines to the west edge; past both, for now, the world ends.
  const road = reach(GATE.x, GATE.y + 1, (x, y) => onG10(x, y) && out.at(x, y).ch === '=');
  ok(road.has(at(3, 0)) && road.has(at(0, 7)) && road.has(at(0, 8)) && out.passable(g10.x + 3, g10.y - 1) !== 'ok' && [7, 8].every((y) => out.at(g10.x - 1, g10.y + y).ch === '='),
    'the road runs square to square from the gate\'s front to the north edge at 3,0, past which, for now, the world ends, and to the west edge at 0,7 and 0,8, where F10\'s road meets it (#517)');
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

  cinderport(ok);

  const cross = (level: number, from: string, x: number, y: number, facing: Facing): string[] => {
    for (const m of w.party.members) m.level = level;
    w.world.travel(from, x, y, facing);
    const r = w.world.move('forward');
    return r.kind === 'moved' ? r.messages : [r.kind];
  };

  // Fire Mountain's flank (G11, #513): over G10's south edge onto G11's, where the track comes down off
  // the coast, the box's way in. Three or more under the mountain's floor the plainer warning, one or two
  // under the harder words, at the floor its name and nothing more; straight back, nothing. Back over the
  // line under Cindercoast's floor, the coast's own words, as true coming down off the mountain as down
  // the Stair.
  const g11 = out.zones.find((z) => z.id === 'firemount_g11')!;
  const on11 = (x: number, y: number): boolean => x >= g11.x && x < g11.x + g11.w && y >= g11.y && y < g11.y + g11.h;
  const at11 = (x: number, y: number): number => (g11.y + y) * out.width + g11.x + x;
  const down = (level: number): string[] => cross(level, 'cindercoast_g10', G11.start.x, 31, SOUTH);
  const low = down(22), two = down(23), due = down(25);
  ok(w.world.zone?.id === 'firemount_g11' && w.world.state.x === g11.x + G11.start.x && w.world.state.y === g11.y && g11.x === g10.x && g11.y === g10.y + 32 && G11.start.y === 0 && G11.start.facing === SOUTH && G11.exits?.length === 2 && G11.exits.includes(VENTS) && G11.exits.includes(HOLE),
    'over G10\'s south edge from its 28,31 onto G11\'s 28,0, walked, the box\'s way in, and no way out but its edges and the two down into Meridian Camp');
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

  // The vents: three mouths, the middle one open, the way down into Meridian Camp (VENTS), and the step's
  // line at their front each time; the furnace-draught, a vent and no way in.
  const vents = G11.features!.find((f) => f.kind === 'event' && f.id === 'g11_vents');
  ok(vents?.kind === 'event' && !vents.once && vents.x === VENTS.x + 1 && vents.y === VENTS.y && VENTS.to === 'meridian_camp' && out.passable(g11.x + VENTS.x, g11.y + VENTS.y) === 'ok'
    && [-1, 1].every((dy) => out.at(g11.x + VENTS.x, g11.y + VENTS.y + dy).terrain === 'vent' && out.passable(g11.x + VENTS.x, g11.y + VENTS.y + dy) !== 'ok'),
    'the vents are three mouths at 26,15 to 17, the middle one open, the way down into Meridian Camp (VENTS), and their line is said at its front each time');
  const vmark = ATLAS.sites.find((q) => q.name === 'Meridian Camp')!;
  ok(Math.floor(vmark.at[0]) === g11.x + VENTS.x && Math.floor(vmark.at[1]) === g11.y + VENTS.y, `the middle mouth is Meridian Camp's mark on the atlas (${vmark.at.join(',')})`);
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
  let foundHole = false;
  for (let i = 0; i < 20 && !foundHole; i++) foundHole = w.world.search();
  const intoHole = foundHole ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(foundHole && intoHole.every((r) => r.kind === 'moved') && w.world.used('g11_finds'), 'searched at the rope, the rocks open, and the ledge behind them can be walked to');
  listen(w);
  const finds = G11.features!.find((f) => f.kind === 'chest' && f.id === 'g11_hole');
  ok(finds?.kind === 'chest' && finds.items.includes('great_axe+2') && finds.x === mouth.x + 2 && finds.y === mouth.y, 'in the hole, with his finds, a Great Axe +2');
  ok(HOLE.to === 'meridian_camp' && HOLE.x === mouth.x + 2 && HOLE.y === mouth.y + 1 && out.passable(g11.x + HOLE.x, g11.y + HOLE.y) === 'ok'
    && [[0, 1], [-1, 0]].every(([dx, dy]) => out.passable(g11.x + HOLE.x + dx, g11.y + HOLE.y + dy, { swim: true, climb: true, float: true }) !== 'ok'),
    'the hole goes on down at 31,17, into Meridian Camp behind the furnace room (HOLE), reached only from the hole');

  // Meridian Camp's first level, the vents (#22), at 25. Down the middle mouth onto the flue hall, facing
  // in; stepped back into, the mouth lets the company up onto the vents' front, facing away from them.
  // Down the scavenger's rope the same, behind the furnace room, and up it onto his ledge.
  const MC = MAP_DEFS.find((d) => d.id === 'meridian_camp')!;
  const here = (): string => `${w.world.state.mapId} ${w.world.state.x},${w.world.state.y}`;
  w.world.travel('firemount_g11', VENTS.x + 1, VENTS.y, WEST);
  const dropped = w.world.move('forward');
  ok(dropped.kind === 'moved' && w.world.state.mapId === 'meridian_camp' && w.world.state.x === MC.start.x && w.world.state.y === MC.start.y && w.world.state.facing === SOUTH && dropped.messages.includes(VENTS.label!),
    `the middle mouth takes the company down onto the flue hall, facing in (${here()}: ${dropped.kind === 'moved' ? dropped.messages.join(' / ') : dropped.kind})`);
  const upMouth = [w.world.move('forward'), w.world.move('back')];
  ok(upMouth.every((r) => r.kind === 'moved') && w.world.zone?.id === 'firemount_g11' && w.world.state.x - g11.x === VENTS.x + 1 && w.world.state.y - g11.y === VENTS.y && w.world.state.facing === EAST,
    `and back up the rungs onto the vents' front, facing away from them (${here()})`);
  w.world.travel('firemount_g11', HOLE.x, HOLE.y - 1, SOUTH);
  const roped = w.world.move('forward');
  ok(roped.kind === 'moved' && w.world.state.mapId === 'meridian_camp' && w.world.state.x === HOLE.tx && w.world.state.y === HOLE.ty && w.world.state.facing === NORTH && roped.messages.includes(HOLE.label!),
    `the scavenger's rope goes down behind the furnace room, facing in (${here()}: ${roped.kind === 'moved' ? roped.messages.join(' / ') : roped.kind})`);
  const upRope = [w.world.move('forward'), w.world.move('back')];
  ok(upRope.every((r) => r.kind === 'moved') && w.world.zone?.id === 'firemount_g11' && w.world.state.x - g11.x === HOLE.x && w.world.state.y - g11.y === HOLE.y - 1 && w.world.state.facing === WEST,
    `and up it onto his ledge (${here()})`);

  // The flue hall under the mouths, the drift under the west one and the stokers' path under the east; the
  // Company's trail west, the Guild's chain pin at the flue's head (as at the Ember Stone, §4.8) and chalked
  // arrows down past their first camp, cold, the level's one rest, to the stair; the grates and the rounds.
  for (const id of ['mc1_in', 'mc1_path', 'mc1_pin', 'mc1_arrow', 'mc1_arrow2', 'mc1_arrow3', 'mc1_slag', 'mc1_grates', 'mc1_glow', 'mc1_tracks', 'mc1_scrape', 'mc1_boots', 'mc1_hole']) see(w, `meridian_camp:${id}`);
  const drift = MC.features!.find((f) => f.kind === 'cairn' && f.id === 'mc1_drift');
  ok(drift?.kind === 'cairn' && drift.gold > 0 && drift.x === 11 && drift.y === 1, 'under the west mouth the drift of what fell down it, coins in it');
  const pin = MC.features!.find((f) => f.kind === 'event' && f.id === 'mc1_pin');
  ok(pin?.kind === 'event' && pin.text.includes('chain pin') && pin.text.includes('Guild'), 'at the west flue\'s head a chain pin with the Guild\'s mark on it');
  const camps = MC.features!.filter((f) => f.kind === 'camp');
  ok(camps.length === 1 && camps[0].text.includes('long cold'), 'the first of the Company\'s camps, cold, the level\'s one rest');
  w.world.travel('meridian_camp', camps[0].x, camps[0].y);
  ok(restRefused(w.world) === '', 'and a company may rest at it');

  // The stair at the far end, down to the iron corridors, barred until they are built (STAIR): its square
  // solid and its line said at its head each time.
  const stair = MC.features!.find((f) => f.kind === 'event' && f.id === 'mc1_stair');
  ok(STAIR.to === 'meridian_camp2' && !(MC.exits ?? []).some((e) => e.to === STAIR.to) && new GameMap(MC).passable(STAIR.x, STAIR.y) !== 'ok'
    && stair?.kind === 'event' && !stair.once && stair.x === STAIR.x && stair.y === STAIR.y - 1,
    'the stair at the far end goes down to the iron corridors, barred until they are built (STAIR), and its line is said at its head each time');
  see(w, 'meridian_camp:mc1_stair');

  // The groups, each won at 25: the stokers' rounds, a stoker and a salamander by the grates and a stoker
  // alone on the east flue; the furnace room's two stokers with their salamanders, the level's hardest,
  // at the furnace; and the sentry that comes up the stair only once the Ember Stone is lit.
  const [round, flue, furnace, sentry] = ['mc1_round', 'mc1_flue', 'mc1_stokers', 'mc1_sentry'].map((id) => MC.encounters!.find((g) => g.id === id)!);
  ok(MC.encounters!.length === 4 && round.roams !== false && flue.roams !== false && furnace.roams === false
    && furnace.monsters.filter((m) => m === 'stoker').length === 2 && furnace.monsters.filter((m) => m === 'ember_salamander').length === 2
    && JSON.stringify(sentry.after) === JSON.stringify({ flag: 'q_ember_lit' }) && MC.encounters!.every((g) => !!g.respawn),
    'stokers on their rounds, two stokers with their salamanders at the furnace, and a sentry only once the Ember Stone is lit');
  for (const g of MC.encounters!) fight(w, `meridian_camp:${g.id}`);

  // The furnace room: the stokers shovel nothing into nothing, and in the furnace's mouth the Ember
  // Stone's first part, a quest item, taken for the Stone (#516); beside it the stokers' parts, which no
  // shop buys.
  see(w, 'meridian_camp:mc1_furnace');
  const part = MC.features!.find((f) => f.kind === 'chest' && f.id === 'mc1_part'), heap = MC.features!.find((f) => f.kind === 'chest' && f.id === 'mc1_heap');
  ok(part?.kind === 'chest' && part.items.join() === 'ember_part1' && item('ember_part1').slot === 'none' && !item('ember_part1').price, 'in the furnace\'s mouth the Ember Stone\'s first part, a quest item');
  if (part?.kind === 'chest') { w.world.travel('meridian_camp', part.x, part.y); w.world.markUsed(part.id); w.party.bag.push(...part.items); }
  ok(heap?.kind === 'chest' && heap.items.length === 2 && heap.items.every((i) => item(i).slot === 'none' && !item(i).price), 'beside it a heap of the stokers\' parts, which no shop buys');
  listen(w);

  // The Ember Waste's road (#517). Over G10's west edge from 0,7 onto F10's 31,7, walked: three under the
  // Waste's floor its harsher words, two under its own, at the floor its name and nothing more; straight
  // back, nothing; and back over two and three under Cindercoast's floor, the coast's own words.
  const F10 = MAP_DEFS.find((d) => d.id === 'emberwaste_f10')!, f10 = out.zones.find((z) => z.id === 'emberwaste_f10')!;
  const E10 = MAP_DEFS.find((d) => d.id === 'emberwaste_e10')!, e10 = out.zones.find((z) => z.id === 'emberwaste_e10')!;
  const WASTE = ATLAS.zones.find((z) => z.id === 'emberwaste')!;
  const wasteLow = cross(21, 'cindercoast_g10', 0, 7, WEST), wasteTwo = cross(22, 'cindercoast_g10', 0, 7, WEST), wasteDue = cross(24, 'cindercoast_g10', 0, 7, WEST);
  ok(w.world.zone?.id === 'emberwaste_f10' && w.world.state.x === f10.x + 31 && w.world.state.y === f10.y + 7 && f10.x + f10.w === g10.x && F10.start.x === 31 && F10.start.y === 7,
    'over G10\'s west edge from 0,7 onto F10\'s 31,7, walked, the box\'s way in');
  ok(WASTE.maps?.map((m) => m.map).join() === 'emberwaste_f10,emberwaste_e10' && wasteDue.join(' / ') === 'The Ember Waste.', `at 24, the Ember Waste named, no more (${wasteDue.join(' / ')})`);
  ok(wasteTwo.join(' / ') === `The Ember Waste. ${WASTE.crossing?.harder}`, `at 22, the rest in the Waste's own words (${wasteTwo.join(' / ')})`);
  ok(wasteLow.join(' / ') === `The Ember Waste. ${WASTE.crossing?.warning}`, `at 21, the harsher words, and the coast behind (${wasteLow.join(' / ')})`);
  const back = cross(24, 'emberwaste_f10', 31, 7, EAST);
  ok(!back.length && w.world.zone?.id === 'cindercoast_g10', `straight back onto G10, nothing more (${back.join(' / ') || 'nothing'})`);
  const coastTwo = cross(22, 'emberwaste_f10', 31, 7, EAST), coastLow = cross(21, 'emberwaste_f10', 31, 7, EAST);
  ok(coastTwo.join(' / ') === `Cindercoast. ${COAST.crossing?.harder}` && coastLow.join(' / ') === `Cindercoast. ${COAST.crossing?.warning}`,
    `back over onto the coast two and three under its floor, Cindercoast's own words (${coastTwo.join(' / ')}; ${coastLow.join(' / ')})`);
  for (const m of w.party.members) m.level = 24;

  // The road square to square from G10's edge at rows 7 and 8, out of the vines and south-west over
  // F10's ash, west along its south rows past F11's corner at columns 5 to 11, over onto E10 at rows 29
  // and 30, through the Hills' notch and down to the west edge at 0,6; past F11 and D10, for now, the
  // world ends.
  const key = (x: number, y: number): number => y * out.width + x;
  const inBox = (z: typeof f10, x: number, y: number): boolean => x >= z.x && x < z.x + z.w && y >= z.y && y < z.y + z.h;
  const spread = (x0: number, y0: number, along: (x: number, y: number) => boolean): Set<number> => {
    const seen = new Set([key(x0, y0)]), q = [[x0, y0]];
    for (let i = 0; i < q.length; i++) {
      const [x, y] = q[i];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = key(x + dx, y + dy); if (!seen.has(k) && along(x + dx, y + dy)) { seen.add(k); q.push([x + dx, y + dy]); } }
    }
    return seen;
  };
  const beside = (z: typeof f10, x: number, y: number, set: Set<number>): boolean => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => set.has(key(z.x + x + dx, z.y + y + dy)));
  const wasteRoad = spread(f10.x + 31, f10.y + 7, (x, y) => (inBox(f10, x, y) || inBox(e10, x, y)) && out.at(x, y).ch === '=');
  ok([7, 8].every((y) => wasteRoad.has(key(f10.x + 31, f10.y + y))) && [5, 6, 7, 8, 9, 10, 11].every((x) => wasteRoad.has(key(f10.x + x, f10.y + 31)))
    && [29, 30].every((y) => wasteRoad.has(key(f10.x, f10.y + y)) && wasteRoad.has(key(e10.x + 31, e10.y + y))) && wasteRoad.has(key(e10.x, e10.y + 6))
    && out.passable(f10.x + 8, f10.y + 32) !== 'ok' && out.passable(e10.x - 1, e10.y + 6) !== 'ok',
    'the road runs square to square from G10\'s edge over F10, along its south rows past F11\'s corner and over E10 to its west edge at 0,6, and past F11 and D10, for now, the world ends');
  const mile = F10.features!.find((f) => f.kind === 'event' && f.id === 'f10_milestone');
  ok(mile?.kind === 'event' && mile.text.includes('THE WOLD 2, CINDERPORT 4') && beside(f10, mile.x, mile.y, wasteRoad),
    'the milestone stands by the road where it turns west along the rocks: THE WOLD 2, CINDERPORT 4, as G10\'s THE WOLD 6 has it');
  see(w, 'emberwaste_f10:f10_milestone');

  // F10: the vines' end where the road leaves them and their edge in the north, Cindercoast's; the
  // Archdruid in the lee of the outcrop in the north-west, far from the road (#448 his trainer and
  // quest); the shrine and the cairn on the ash, and the Riders' ring a camp by the road.
  see(w, 'emberwaste_f10:f10_vines');
  see(w, 'emberwaste_f10:f10_edge');
  const druid = F10.features!.find((f) => f.kind === 'npc' && f.name === 'The Archdruid') as Person;
  const far = Math.min(...[...wasteRoad].filter((k) => inBox(f10, k % out.width, Math.floor(k / out.width))).map((k) => Math.abs(k % out.width - f10.x - druid.x) + Math.abs(Math.floor(k / out.width) - f10.y - druid.y)));
  ok(druid.x < 16 && druid.y < 16 && far >= 15 && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => out.at(f10.x + druid.x + dx, f10.y + druid.y + dy).solid === 'rock'),
    `the Archdruid sits in the lee of the outcrop in the north-west, ${far} squares from the road`);
  w.world.travel('emberwaste_f10', druid.x, druid.y);
  ok(meet(druid, w.party, heard(w.world, druid)).text.includes('out of the Grove'), 'the Archdruid came out of the Grove, and stayed');
  const ring = F10.features!.find((f) => f.kind === 'camp');
  ok(['f10_shrine', 'f10_cairn'].every((id) => F10.features!.some((f) => (f.kind === 'shrine' || f.kind === 'cairn') && f.id === id)) && !!ring && beside(f10, ring.x, ring.y, wasteRoad),
    'on the ash a shrine and a cairn, and the Riders\' ring a camp beside the road');
  see(w, 'emberwaste_f10:f10_flow');
  for (const g of F10.encounters!) fight(w, `emberwaste_f10:${g.id}`);

  // Over F10's west edge onto E10, walked: the same land and the same floor, so nothing is said.
  const onto = cross(24, 'emberwaste_f10', 0, 30, WEST);
  ok(w.world.zone?.id === 'emberwaste_e10' && w.world.state.x === e10.x + 31 && w.world.state.y === e10.y + 30 && e10.x + e10.w === f10.x && !onto.length,
    `over F10's west edge at 0,30 onto E10's 31,30, walked, and nothing said: the same land, the same floor (${onto.join(' / ') || 'nothing'})`);

  // E10: the notch the road takes through the Cinder Hills at about 150,306, a Rider's waymark in it;
  // the hermit on the crest; the flow's head at the south edge; the box laid whole, the Wold's steppe
  // and grass with it, and bare of the Wold's monsters, outriders and quests (#524's).
  const mark = E10.features!.find((f) => f.kind === 'event' && f.id === 'e10_waymark')!;
  ok(Math.abs(e10.x + mark.x - 150) <= 2 && Math.abs(e10.y + mark.y - 306) <= 2 && beside(e10, mark.x, mark.y, wasteRoad) && out.at(e10.x + mark.x, e10.y + mark.y).ch === '^',
    `the road takes the Hills by their notch at ${e10.x + mark.x},${e10.y + mark.y}, a Rider's waymark beside it`);
  see(w, 'emberwaste_e10:e10_waymark');
  const hermitE = E10.features!.find((f) => f.kind === 'npc' && f.name === 'A hermit') as Person;
  w.world.travel('emberwaste_e10', hermitE.x, hermitE.y);
  const life = meet(hermitE, w.party, heard(w.world, hermitE)).text;
  ok(life.includes('Stone\'s field') && life.includes('dark') && out.at(e10.x + hermitE.x, e10.y + hermitE.y).ch === '^', 'the hermit on the crest has looked down on the Stone\'s field all his life, and seen it dark');
  const flow = E10.features!.find((f) => f.kind === 'event' && f.id === 'e10_flow')!;
  ok(flow.y === 30 && out.at(e10.x + flow.x, e10.y + 31).ch === '!', 'the lava flow\'s head lies at E10\'s south edge, and is seen from the ash over it');
  see(w, 'emberwaste_e10:e10_flow');
  const ground = E10.rows.join('');
  ok([...ground].filter((c) => c === 's').length > 200 && ground.includes(',') && E10.encounters!.every((g) => g.monsters.every((m) => m === 'cinder_drake'))
    && E10.features!.filter((f) => f.kind === 'npc').length === 1 && !E10.features!.some((f) => f.kind === 'npc' && (f.quest || f.flag)),
    'E10 is laid whole, the Wold\'s steppe and grass with it, and holds nothing of the Wold\'s: its monsters, outriders and crossing line are #524\'s');
  for (const g of E10.encounters!) fight(w, `emberwaste_e10:${g.id}`);

  // The secret: the Hills' cairns all face the steppe but the one that looks back at the Stone, searched
  // where it looks; behind its stones the first Rider who came down to trade, on her saddle. Walked,
  // waded, climbed or floated, the grave is never reached but through its mouth.
  const [grave] = E10.secrets!;
  ok(['e10_cairn', 'e10_cairns'].every((id) => E10.features!.some((f) => (f.kind === 'cairn' || f.kind === 'event') && f.id === id && !!f.text?.includes('west face'))), 'the Hills\' cairns face west, toward the steppe');
  const shutE = spread(e10.x + grave.x + 1, e10.y + grave.y, (x, y) => !(x === e10.x + grave.x && y === e10.y + grave.y) && inBox(e10, x, y) && out.passable(x, y, { swim: true, climb: true, float: true }) === 'ok');
  ok(shutE.size > 300 && !shutE.has(key(e10.x + grave.x - 1, e10.y + grave.y)) && !shutE.has(key(e10.x + grave.x - 2, e10.y + grave.y)),
    `the grave is shut but for its mouth: none of E10's ${shutE.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'emberwaste_e10:e10_back');
  w.world.travel('emberwaste_e10', grave.x + 1, grave.y, WEST);
  let found = false;
  for (let i = 0; i < 20 && !found; i++) found = w.world.search();
  const into = found ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(found && into.every((r) => r.kind === 'moved') && w.world.used('e10_rider'), 'searched where the cairn looks back, its stones come away, and under them a woman laid out on her saddle');
  listen(w);
  const bow = E10.features!.find((f) => f.kind === 'chest' && f.id === 'e10_grave');
  ok(bow?.kind === 'chest' && bow.items.includes('horn_bow+2') && bow.gold > 0 && bow.x === grave.x - 2 && bow.y === grave.y, 'in the grave, her saddle\'s silver and a Horn Bow +2');
};

/**
 * Cinderport (#512): in at G10's gate with the town's gate line, a step inside to the gate-ward, and
 * out again; a night at the inn, the act's step bought at the armourer's, the provisions, lamp oil and
 * the stone cure at the chandler's, the stone lifted at the temple at the cure's price for a member of
 * 25, and training to 27 at the yard; either hall's ladder joined, the Cartographers' at the Chart
 * House and the Compact's at the factor's house, which pays the Fence's rung; the Compact's ship from
 * Kilnhaven's steps to the Compact's steps here and back, halved here for a member of the Compact; and
 * the ride and the last crossing, whose far ends are not built, sold by nobody yet, their sellers only
 * talking and their landings written; the smith, the potter, the guildsman and the factor with words
 * only, their quests others' (#519, #635, #448).
 */
function cinderport(ok: (cond: boolean, msg: string) => void): void {
  const PORT = MAP_DEFS.find((d) => d.id === 'cinderport')!;
  const here = <K extends Feature['kind']>(kind: K): Extract<Feature, { kind: K }>[] => PORT.features!.filter((f): f is Extract<Feature, { kind: K }> => f.kind === kind);
  const who = (name: string): Person => here('npc').find((f) => f.name.startsWith(name)) as Person;
  const says = (w: Walk, p: Person): string => { w.world.travel('cinderport', p.x, p.y); return meet(p, w.party, heard(w.world, p)).text; };
  const RIDER = who('A Rider'), MORWENNA = who('Morwenna'), JAGO = who('Jago'), GORRAN = who('Gorran'), JENIFER = who('Jenifer'), CADOR = who('Cador'), HENDRA = who('Hendra');
  const w = newWalk(ok);
  w.level = 24;
  for (const m of w.party.members) m.level = 24;

  // In at G10's gate, saying the town's gate line, onto the first square inside the south gate; a step
  // in, the gate-ward; and out by the gate onto the gate's front on G10, facing the trading ground.
  w.world.travel('cindercoast_g10', GATE.x, GATE.y + 1, NORTH);
  const step = w.world.move('forward'), inside = step.kind === 'moved' ? step.messages : [];
  ok(w.world.state.mapId === 'cinderport' && w.world.state.x === PORT.start.x && w.world.state.y === PORT.start.y && w.world.state.facing === NORTH && GATE.tx === PORT.start.x && GATE.ty === PORT.start.y,
    'G10\'s gate lets the company in just inside Cinderport\'s south gate, facing up the street');
  ok(inside.join() === GATE.label, `going in, the town's gate line (${inside.join(' / ')})`);
  const ward = w.world.move('forward');
  ok(ward.kind === 'moved' && ward.messages.some((t) => t.startsWith('The gate-ward')), `a step inside, the gate-ward (${ward.kind === 'moved' ? ward.messages.join(' / ') : ward.kind})`);
  listen(w);
  w.world.travel('cinderport', PORT.start.x, PORT.start.y, SOUTH);
  const leave = w.world.move('forward');
  ok(leave.kind === 'moved' && w.world.zone?.id === 'cindercoast_g10' && w.world.state.x - w.world.zone.x === GATE.x && w.world.state.y - w.world.zone.y === GATE.y + 1 && w.world.state.facing === SOUTH,
    'and out by the gate onto G10\'s 6,3, the gate\'s front, facing the trading ground');
  ok(PORT.exits!.length === 1 && PORT.exits!.every((e) => !e.shut && !e.needFlag), 'nothing shuts the gate');
  listen(w);

  // A night at the inn, as the business's screen does it (src/ui/screens.ts).
  ok(here('inn').length === 1 && here('temple').length === 1 && here('trainer').length === 1 && here('shop').length === 2 && !here('guild').length
    && INTERIORS.every((id) => PORT.features!.some((f) => 'interior' in f && f.interior === id)),
    'Cinderport has its eight businesses, each opening into its room: the inn, the temple, the armourer\'s, the chandler\'s, the yard, the two halls and the potter\'s; and no spell hall');
  w.party.gold = 60000;
  const inn = here('inn')[0], night = inn.price * w.party.members.length;
  for (const m of w.party.members) { m.hp = 1; m.sp = 0; }
  w.party.gold -= night;
  for (const m of w.party.members) rest(m);
  w.world.sleepUntilMorning();
  ok(w.party.members.every((m) => m.hp === m.maxHp && m.sp === m.maxSp) && w.world.hour >= 6 && w.world.hour <= 9 && w.party.gold === 60000 - night, `a night at ${inn.name} for ${night} gold, and the company wakes whole in the morning`);

  // The armourer's sells the act's one step (#542), each class its rung at 25, at list price; the
  // chandler's the provisions, lamp oil and the stone cure (#546), and no steel.
  const armourer = here('shop').find((f) => f.interior === 'cinderport_armourer')!, chandler = here('shop').find((f) => f.interior === 'cinderport_chandlery')!;
  ok(armourer.stock.length === ARMOURER.length && ARMOURER.every((id) => armourer.stock.includes(id)) && !armourer.prices, `${armourer.name} sells the act's step, all ${ARMOURER.length} wares and nothing else, at list price`);
  for (const m of w.party.members) for (const id of ACT_IV[0].classes[m.cls]) {
    const before = w.party.gold;
    ok(!!buy(w.party, armourer, id) && before - w.party.gold === item(id).price, `${m.name} buys a ${item(id).name} at the armourer's for ${item(id).price} gold`);
  }
  ok(['rations', 'lantern_oil', 'potion_heal', 'antidote', ...CURES].every((id) => chandler.stock.includes(id)) && !chandler.stock.some((id) => ARMOURER.includes(id)) && !chandler.prices,
    'the chandler\'s sells the provisions, lamp oil and the Quickening Draught at list price, and no steel');
  const cure = item(CURES[0]), gold = w.party.gold;
  ok(!!buy(w.party, chandler, cure.id) && gold - w.party.gold === cure.price && w.party.bag.includes(cure.id), `a ${cure.name} bought at the chandler's for ${cure.price} gold`);

  // The temple lifts the stone at 80 gold a level: for a member of 25, the cure's own price (#546).
  const glassed = structuredClone(w.party.members[0]);
  glassed.level = 25; addCondition(glassed, 'stoned');
  ok(templePrice(glassed) === cure.price && here('temple')[0].interior === 'cinderport_temple', `${here('temple')[0].name} lifts the stone from a member of 25 for ${templePrice(glassed)} gold, the cure's price`);

  // Training to 27 at the yard, on a copy, so the company walks on as it was.
  const yard = here('trainer')[0], trainee = structuredClone(w.party.members[0]);
  trainee.level = 26; trainee.xp = xpForLevel(27);
  ok(yard.maxLevel === 27 && yard.interior === 'cinderport_yard' && canTrainAt(trainee, yard.maxLevel), `${yard.name} will train a member of 26`);
  const fee = trainPrice(trainee);
  levelUp(trainee, makeRng(1), 27);
  ok(trainee.level === 27 && !canTrainAt(trainee, yard.maxLevel), `who trains to 27 for ${fee} gold, and no further`);

  // The two halls (#443, call 7), each a room: the Chart House the Cartographers' second, and the
  // factor's house the Compact's. A new company joins either ladder here, its first task offered and taken.
  const chart = here('npc').find((f) => f.interior === 'cinderport_cartographers')!, house = here('npc').find((f) => f.interior === 'cinderport_factor')!;
  ok(chart.hall === 'cartographers' && house.hall === 'compact', `${chart.name} is the Cartographers' hall and ${house.name} the Compact's`);
  for (const g of ['cartographers', 'compact'] as const) {
    const p = structuredClone(w.party), [first] = offered(g, p);
    ok(!!first && first.rank === 0 && !take(first, w.world.state, p).length && inHand(g, p).some((q) => q.id === first.id), `a new company joins the ${g} ladder here: ${first?.title} offered and taken`);
  }
  // The Fence's rung (#635), offered to the Compact's rank 2 and paid at the factor's house once the
  // Dead-Drop's stair is gone down, as at the Keel.
  const fence = GUILD_QUESTS.find((q) => q.id === 'compact_fence')!, f = newWalk(ok);
  f.party.flags[rankFlag('compact')] = 2;
  ok(offered('compact', f.party).some((q) => q.id === fence.id) && !take(fence, f.world.state, f.party).length, `${fence.title} offered to a company of the Compact's rank 2, and taken`);
  see(f, 'dead_drop_stair:dd_foot');
  f.world.travel('cinderport', house.x, house.y);
  const purse = f.party.gold, paid = report('compact', f.world.state, f.party);
  ok(paid.length >= 1 && f.party.gold === purse + (fence.pay.gold ?? 0) && rankOf('compact', f.party) === 3, `and paid at ${house.name} (${paid.join(' ').replace(/\n+/g, ' ')})`);

  // The Compact's ship (#547): sold on Kilnhaven's quay to the Compact's steps here for its whole fare,
  // it sails at 20:00 and ties up two days on at 16:00, the steps said as the company comes ashore, and
  // a save made there loads there; her master on the steps here sells the way back to Kilnhaven's steps,
  // halved for a member of the Compact as Kitto's boat is, and Kilnhaven halves none.
  const kilnhaven = MAP_DEFS.find((d) => d.id === 'kilnhaven')!.features!.find((x): x is Person => x.kind === 'npc' && x.name.startsWith('Jago'))!;
  const steps = COMPACT_SHIP.ends.find((e) => e.at === 'cinderport')!, home = COMPACT_SHIP.ends.find((e) => e.at === 'kilnhaven')!.landing!;
  const [over, ...more] = kilnhaven.passage ?? [];
  ok(!!over && !more.length && over.to === 'cinderport' && over.x === steps.landing?.x && over.y === steps.landing.y && over.fare === COMPACT_SHIP.fare && over.days === COMPACT_SHIP.days && !over.half,
    `on Kilnhaven's quay Jago sells the Compact ship to Cinderport's steps, ${over?.fare} gold and ${over?.days} days, halved for nobody`);
  const s = newWalk(ok);
  for (const m of s.party.members) m.level = 24;
  s.world.travel('kilnhaven', kilnhaven.x, kilnhaven.y);
  s.world.state.minutes = Math.floor(s.world.state.minutes / MINUTES_PER_DAY) * MINUTES_PER_DAY + 9 * 60;
  s.party.gold = COMPACT_SHIP.fare;
  const day = s.world.day, sailed = sail(over, s.world, s.party), ashore = sailed.taken ? s.world.eventsHere() : [];
  ok(sailed.taken && s.party.gold === 0 && s.world.state.mapId === 'cinderport' && s.world.state.x === 13 && s.world.state.y === 2 && s.world.state.facing === SOUTH && PORT.rows[2][13] === '"',
    `the ship ties up at Cinderport and puts the company on the Compact's steps under the factor's house (${sailed.lines.join(' ')})`);
  ok(sailed.lines.join() === steps.label && ashore.some((t) => t.startsWith('The Compact\'s steps')) && s.world.day === day + 2 && s.world.hour === 16,
    `with Cinderport's own line and the steps said, two days on at 16:00 (${ashore.join(' / ')}; day ${day} to day ${s.world.day})`);
  const kept = deserialize(serialize(s.world.state, s.party, 0)), loaded = new World(buildMaps(), kept.party, makeRng(1), kept.world);
  ok(loaded.state.mapId === 'cinderport' && loaded.state.x === 13 && loaded.state.y === 2, 'a save made on the steps loads there');
  const [back, ...others] = JAGO.passage ?? [];
  ok(!!back && !others.length && back.to === 'kilnhaven' && back.x === home.x && back.y === home.y && back.fare === COMPACT_SHIP.fare && back.days === COMPACT_SHIP.days,
    `on the steps here ${JAGO.name.split(',')[0]}, the same master, sells the ship back to Kilnhaven's steps`);
  s.world.travel('cinderport', JAGO.x, JAGO.y);
  const full = fareOf(back, s.world);
  s.party.flags.q_compact_run_done = 1;
  const half = fareOf(back, s.world);
  ok(full === COMPACT_SHIP.fare && half === COMPACT_SHIP.fare / 2, `a stranger pays ${full} gold and a member of the Compact ${half}`);
  s.party.gold = half;
  const went = sail(back, s.world, s.party);
  ok(went.taken && s.party.gold === 0 && s.world.state.mapId === 'kilnhaven' && s.world.state.x === home.x && s.world.state.y === home.y, `and the ship puts the member back on Kilnhaven's steps for ${half} (${went.lines.join(' ')})`);

  // The quay's line where the street comes down to it: the ship, and the light beyond the Sound.
  see(w, 'cinderport:cp_quay');
  const quay = here('event').find((e) => e.id === 'cp_quay')!;
  ok(w.world.used('cp_quay') && quay.text === 'The Compact\'s ship rides at the quay with Kilnhaven\'s mark on her. Beyond the Sound, a column of light.', 'on the quay, the ship with Kilnhaven\'s mark and a column of light beyond the Sound');

  // The ride and the last crossing (#547): Cinderport writes where each puts a company down, just inside
  // the gate by the Riders' rail and on the Compact's steps; each is sold once its far end lands (Akordu,
  // #526; Hearth Isle, Phase 1.5) and not before, its seller only talking and naming no fare.
  for (const [c, seller] of [[RIDERS_RIDE, RIDER], [LAST_CROSSING, MORWENNA]] as const) {
    const ours = c.ends.find((e) => e.at === 'cinderport')!, far = c.ends.find((e) => e.at !== 'cinderport')!, words = says(w, seller);
    ok(!!ours.landing && !ours.owed && (seller.passage ?? []).length === (far.landing ? 1 : 0) && (!!far.landing || !/gold|fare|hundred/i.test(words)),
      `${c.name} lands at ${ours.landing?.x},${ours.landing?.y}, and ${seller.name.split(',')[0]} sells it once ${far.name} lands (${far.owed ?? 'landed'}), naming no fare till then`);
  }
  const ride = RIDERS_RIDE.ends.find((e) => e.at === 'cinderport')!.landing!, last = LAST_CROSSING.ends.find((e) => e.at === 'cinderport')!.landing!;
  ok(Math.abs(ride.x - PORT.start.x) + Math.abs(ride.y - PORT.start.y) === 1 && Math.abs(ride.x - RIDER.x) + Math.abs(ride.y - RIDER.y) === 1 && JSON.stringify(last) === JSON.stringify(steps.landing),
    'the ride sets a company down just inside the gate by the Rider, and the last crossing on the Compact\'s steps, as the ship does');
  ok(says(w, MORWENNA).includes('Hearth Isle'), 'the harbourmaster says where the last crossing goes, and no more');

  // The smith with the shovel that does not blunt, the potter, the guildsman and the factor speak, and
  // ask nothing yet: their quests are #519's, #635's and #448's.
  const shovel = says(w, GORRAN), cups = says(w, JENIFER), shelf = says(w, CADOR);
  ok([GORRAN, JENIFER, CADOR, HENDRA].every((p) => !p.choice && !p.quest && !p.flag && !p.interior) && shovel.includes('will not take a burr') && cups.includes('came down off the mountain') && shelf.includes('they stopped at the Stone'),
    'the smith\'s shovel-head will not take a burr, the potter\'s cups are the first folk\'s shape, and the guildsman says Fane wrote at the Stone; none asks anything yet');
}
