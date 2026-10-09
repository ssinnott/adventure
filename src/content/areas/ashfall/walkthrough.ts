// Ashfall's walkthrough. Its chapter, The Window, is #518's, which plays it here; until then, the boxes
// in road order. The Stair's foot (H10, #510): down the Giants' Stair from I10 onto H10, Cindercoast's
// crossing words walked; the Stair's last flights to the landing and the step; the road across the sand,
// past Scaldwell and through the vines to the west edge, onto G10's vines; the seams; the pools, the
// bathhouse keeper, the shrine and the stoker at its rock; the groups won at the floor; and the vent
// under the rock, found from the path trodden to it. Then Cinderport's box (G10, #511) walked: put down
// at the gate's front, where Cinderport's way out lands and the ship comes in; the gate a door into the
// town (#512); the road square to square from the gate's front up the wall to the north edge, past which,
// for now, the world ends, and out south-west to the west edge, where F10's road meets it; the trading
// ground: the ground's line, the eldest's story, the Riders' fires and horses and their shrine; the
// milestone; the chandler's racks under the wall; the stream forded on its stones and the knoll over it;
// the hermit and the clay pit under the vines; the box's groups won at its floor, the vines never
// roaming; and the factor's hide, found from the cut vines at its mouth. Then Cinderport (#512), in at
// the gate and out again, its businesses, its two halls and its crossings. Then Fire Mountain's flank
// (G11, #513), walked onto over G10's south edge: the crossing line both ways; the track past the shrine
// at its head to Grimsforge, the warlord's heir at the anvil, the camp in its lee and the scavenger by
// the fire; the vents, the middle mouth the way down into Meridian Camp, and the furnace-draught that is
// no way in; the cone's mouth and the lookout on its shoulder; the box's groups won at its floor, the
// sentry only after the Stone; and the scavenger's hole, found from the rope at its mouth, its far end
// going down. Then Meridian Camp's first level, the vents (#22): down the middle mouth and up again,
// down the scavenger's rope and up again; the flue hall, the drift and the stokers' path; the Company's
// trail, the Guild's chain pin and the chalked arrows down past their cold camp to the stair, barred
// until the iron corridors are built; the grates and the rounds; the groups won at 25, the sentry only
// after the Stone; and the furnace room, with the Ember Stone's first part in the furnace's mouth and
// the stokers' parts beside it. Then the Ember Waste's road (F10 and E10, #517): over G10's west edge,
// walked, the Waste's
// crossing words and back the coast's; the road square to square over F10 and E10 to the Wold's edge; the
// milestone, the vines' end, the Archdruid at his outcrop, the shrine, the cairn and the camp; over onto
// E10 with nothing said; the notch and its waymark, the hermit, the flow's head; E10 laid whole and bare
// of the Wold's; the groups won at the floor; and the grave, found from the cairn that looks back.
// Then Old Cinder's and the Ember Stone's box (F11, #514), walked onto over F10's south edge and over
// G11's west: the crater, its roofs standing out of the pit, the way down at its lip, the old
// Lightbearer by it and the cairn on its rim; the hermit and the camp in the rock; the causeway over the
// flow and its milestone; the Stone half-built on its field of cinders in its iron scaffold, the way in
// down inside it, and the shrine at the field's edge; the groups won at the floor, the husks only by
// night and the sentries only after the Stone; and the builders' hollow, found from the rock's scored
// face. Then Old Cinder (#515), down off the crater's lip: the buried town's street and its people in
// their doorways, the well, the kilns, the husks and the Old Drake asleep on the square; down the hall's
// stair to the cellars, the founding stone, the lamp at the bottom and the Ember Stone's second part
// beside it; and the lamp-keeper's cellar behind the fallen stair. Then the Ember Stone (#516), down
// inside the Stone: the gallery, the benches, the lookout and the seedling's bed; the three parts set in
// their sockets in any order, the Stone lit, the Sentinel won in its door and the sentries after it;
// the lower gallery behind the housing's foot and the fourth journal in it; and the Cartographers'
// Surveyor's rung paid for it at a hall of the Guild, the Chart House's shelf full (#635).
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen, walkThrough } from '../../../../tools/walk.ts';
import type { Walk } from '../../../../tools/walk.ts';
import { EAST, NORTH, SOUTH, WEST } from '../../../game/types.ts';
import type { Facing } from '../../../game/types.ts';
import { ATLAS, MAP_DEFS, MONSTERS, GUILD_QUESTS } from '../../index.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { GameMap } from '../../../game/map.ts';
import type { Feature, MapDef } from '../../../game/map.ts';
import { restRefused } from '../../../game/wilds.ts';
import { meet, heard, answer, barred } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { buy, item } from '../../../game/items.ts';
import { canTrainAt, xpForLevel, rest, trainPrice, levelUp, templePrice, addCondition } from '../../../game/party.ts';
import { makeRng } from '../../../lib/engine/rng.ts';
import { offered, take, inHand, report, rankOf } from '../../../game/guilds.ts';
import { rankFlag, takenFlag, doneFlag } from '../../guilds.ts';
import type { Party } from '../../../game/party.ts';
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
import { STAIR2 } from './maps/meridian_camp2.ts';
import { CRATER, STONE } from './maps/emberwaste_f11.ts';
import { LIT, LIGHTS, SOCKETS } from './maps/ember_stone.ts';
import { SLEEPERS_SEEN } from '../rimewater/chapter.ts';

const G10 = MAP_DEFS.find((d) => d.id === 'cindercoast_g10')!, G11 = MAP_DEFS.find((d) => d.id === 'firemount_g11')!;
const person = (name: string, d = G10): Person => d.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
const COAST = ATLAS.zones.find((z) => z.id === 'cindercoast')!;

export const walkthrough: Walkthrough = (ok) => {
  stairFoot(ok);
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
  ok(COAST.maps?.map((m) => m.map).join() === 'cindercoast_h10,cindercoast_g10' && !!COAST.crossing?.harder && !!COAST.crossing?.warning,
    'Cindercoast holds H10 and G10 and has its crossing words, said coming down the Stair onto H10 (#166, #510)');
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
  // ledge behind the rocks with his finds, and the hole going on down into Meridian Camp (HOLE). Walked,
  // waded, climbed or floated, the hole is never reached but through its mouth.
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

  // The stair at the far end, down to the iron corridors (STAIR): its square open and among the exits, and
  // its line said at its head the once.
  const stair = MC.features!.find((f) => f.kind === 'event' && f.id === 'mc1_stair');
  ok(STAIR.to === 'meridian_camp2' && (MC.exits ?? []).includes(STAIR) && new GameMap(MC).passable(STAIR.x, STAIR.y) === 'ok'
    && stair?.kind === 'event' && !!stair.once && stair.x === STAIR.x && stair.y === STAIR.y - 1,
    'the stair at the far end goes down to the iron corridors (STAIR), and its line is said at its head the once');
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

  // Meridian Camp's second level, the iron corridors (#22), at 26, its floor. Down the vents' stair onto the
  // corridors' first square, facing in; stepped back into, the stair's foot lets the company up onto its
  // head, facing away from it.
  w.level = 26;
  const MC2 = MAP_DEFS.find((d) => d.id === 'meridian_camp2')!;
  w.world.travel('meridian_camp', STAIR.x, STAIR.y - 1, SOUTH);
  const downStair = w.world.move('forward');
  ok(downStair.kind === 'moved' && w.world.state.mapId === 'meridian_camp2' && w.world.state.x === MC2.start.x && w.world.state.y === MC2.start.y && w.world.state.facing === SOUTH
    && STAIR.tx === MC2.start.x && STAIR.ty === MC2.start.y && downStair.messages.includes(STAIR.label!),
    `the vents' stair takes the company down into the iron corridors, facing in (${here()}: ${downStair.kind === 'moved' ? downStair.messages.join(' / ') : downStair.kind})`);
  const upStair = [w.world.move('forward'), w.world.move('back')];
  ok(upStair.every((r) => r.kind === 'moved') && w.world.state.mapId === 'meridian_camp' && w.world.state.x === STAIR.x && w.world.state.y === STAIR.y - 1 && w.world.state.facing === NORTH,
    `and back up onto the stair's head, facing away from it (${here()})`);

  // The corridors, iron hot enough to blister and dead straight, doubling back down the level; the Company's
  // arrows, their second camp, cold, the level's one rest, with their kit left in it; the grave with a note.
  for (const id of ['mc2_in', 'mc2_glove', 'mc2_true', 'mc2_arrow', 'mc2_walk', 'mc2_tracks', 'mc2_arrow2', 'mc2_skin', 'mc2_grave', 'mc2_grate', 'mc2_heat', 'mc2_crust', 'mc2_end']) see(w, `meridian_camp2:${id}`);
  const camps2 = MC2.features!.filter((f) => f.kind === 'camp');
  ok(camps2.length === 1 && camps2[0].text.includes('fire'), 'the second of the Company\'s camps, cold, the level\'s one rest');
  w.world.travel('meridian_camp2', camps2[0].x, camps2[0].y);
  ok(restRefused(w.world) === '', 'and a company may rest at it');
  const kit = MC2.features!.find((f) => f.kind === 'chest' && f.id === 'mc2_kit');
  ok(kit?.kind === 'chest' && kit.items.join() === 'meridian_mail' && item('meridian_mail').slot === 'armor' && item('meridian_mail').price <= 5500,
    'in it the Company\'s kit, a named coat of mail inside the window');
  const grave2 = MC2.features!.find((f) => f.kind === 'event' && f.id === 'mc2_grave');
  ok(grave2?.kind === 'event' && grave2.text.includes('chain pin') && grave2.text.includes('note'), 'a grave with a Guild chain pin at its head and a note tied to it');

  // The groups, each won at 26: the flue walker on its round with a stoker and a cinder drake; in the nest,
  // a side gallery off the last corridor, two drakelings and the Brood Drake on its eggs, still, the boss and
  // the Barbarian's quarry (#448), won about half the time at the floor; and the sentry that comes up the
  // stair only once the Ember Stone is lit.
  const [walker, kin, brood, sentry2] = ['mc2_walker', 'mc2_drakelings', 'mc2_brood', 'mc2_sentry'].map((id) => MC2.encounters!.find((g) => g.id === id)!);
  ok(MC2.encounters!.length === 4 && walker.roams !== false && walker.monsters.join() === 'flue_walker,stoker,cinder_drake'
    && kin.roams === false && kin.monsters.every((m) => m === 'drakeling') && brood.roams === false && brood.monsters.join() === 'brood_drake' && !brood.respawn && !!brood.slainText
    && JSON.stringify(sentry2.after) === JSON.stringify({ flag: 'q_ember_lit' }) && [walker, kin, sentry2].every((g) => !!g.respawn),
    'the flue walker on its round, drakelings and the Brood Drake in the nest, and a sentry only once the Ember Stone is lit');
  for (const g of MC2.encounters!) fight(w, `meridian_camp2:${g.id}`);
  const hoard = MC2.features!.find((f) => f.kind === 'chest' && f.id === 'mc2_hoard');
  ok(hoard?.kind === 'chest' && hoard.gold > 0 && hoard.x > brood.x - 5 && Math.abs(hoard.y - brood.y) <= 2, 'behind the drake its hoard');

  // The corridors' end: the Ember Stone's third part, a quest item, taken for the Stone (#516); beside it the
  // walker's parts, which no shop buys; and the stair down to the camp, barred until it is built (STAIR2), its
  // square solid and its line said at its head each time.
  const part3 = MC2.features!.find((f) => f.kind === 'chest' && f.id === 'mc2_part'), heap2 = MC2.features!.find((f) => f.kind === 'chest' && f.id === 'mc2_heap');
  ok(part3?.kind === 'chest' && part3.items.join() === 'ember_part3' && item('ember_part3').slot === 'none' && !item('ember_part3').price, 'at the corridors\' end the Ember Stone\'s third part, a quest item');
  if (part3?.kind === 'chest') { w.world.travel('meridian_camp2', part3.x, part3.y); w.world.markUsed(part3.id); w.party.bag.push(...part3.items); }
  ok(heap2?.kind === 'chest' && heap2.items.length === 2 && heap2.items.every((i) => item(i).slot === 'none' && !item(i).price), 'beside it a heap of the walker\'s parts, which no shop buys');
  const stair2 = MC2.features!.find((f) => f.kind === 'event' && f.id === 'mc2_stair');
  ok(STAIR2.to === 'meridian_camp3' && !(MC2.exits ?? []).some((e) => e.to === STAIR2.to) && new GameMap(MC2).passable(STAIR2.x, STAIR2.y) !== 'ok'
    && stair2?.kind === 'event' && !stair2.once && stair2.x === STAIR2.x && stair2.y === STAIR2.y - 1,
    'the stair at the corridors\' end goes down to the camp, barred until it is built (STAIR2), and its line is said at its head each time');
  see(w, 'meridian_camp2:mc2_stair');
  listen(w);
  w.level = 25;

  // The Ember Waste's road (#517). Over G10's west edge from 0,7 onto F10's 31,7, walked: three under the
  // Waste's floor its harsher words, two under its own, at the floor its name and nothing more; straight
  // back, nothing; and back over two and three under Cindercoast's floor, the coast's own words.
  const F10 = MAP_DEFS.find((d) => d.id === 'emberwaste_f10')!, f10 = out.zones.find((z) => z.id === 'emberwaste_f10')!;
  const E10 = MAP_DEFS.find((d) => d.id === 'emberwaste_e10')!, e10 = out.zones.find((z) => z.id === 'emberwaste_e10')!;
  const WASTE = ATLAS.zones.find((z) => z.id === 'emberwaste')!;
  const wasteLow = cross(21, 'cindercoast_g10', 0, 7, WEST), wasteTwo = cross(22, 'cindercoast_g10', 0, 7, WEST), wasteDue = cross(24, 'cindercoast_g10', 0, 7, WEST);
  ok(w.world.zone?.id === 'emberwaste_f10' && w.world.state.x === f10.x + 31 && w.world.state.y === f10.y + 7 && f10.x + f10.w === g10.x && F10.start.x === 31 && F10.start.y === 7,
    'over G10\'s west edge from 0,7 onto F10\'s 31,7, walked, the box\'s way in');
  ok(WASTE.maps?.map((m) => m.map).join() === 'emberwaste_f10,emberwaste_e10,emberwaste_f11' && wasteDue.join(' / ') === 'The Ember Waste.', `at 24, the Ember Waste named, no more (${wasteDue.join(' / ')})`);
  ok(wasteTwo.join(' / ') === `The Ember Waste. ${WASTE.crossing?.harder}`, `at 22, the rest in the Waste's own words (${wasteTwo.join(' / ')})`);
  ok(wasteLow.join(' / ') === `The Ember Waste. ${WASTE.crossing?.warning}`, `at 21, the harsher words, and the coast behind (${wasteLow.join(' / ')})`);
  const back = cross(24, 'emberwaste_f10', 31, 7, EAST);
  ok(!back.length && w.world.zone?.id === 'cindercoast_g10', `straight back onto G10, nothing more (${back.join(' / ') || 'nothing'})`);
  const coastTwo = cross(22, 'emberwaste_f10', 31, 7, EAST), coastLow = cross(21, 'emberwaste_f10', 31, 7, EAST);
  ok(coastTwo.join(' / ') === `Cindercoast. ${COAST.crossing?.harder}` && coastLow.join(' / ') === `Cindercoast. ${COAST.crossing?.warning}`,
    `back over onto the coast two and three under its floor, Cindercoast's own words (${coastTwo.join(' / ')}; ${coastLow.join(' / ')})`);
  for (const m of w.party.members) m.level = 24;

  // The road square to square from G10's edge at rows 7 and 8, out of the vines and south-west over
  // F10's ash, west along its south rows past F11's corner at columns 5 to 11, where F11's north row
  // carries it too (#514), over onto E10 at rows 29 and 30, through the Hills' notch and down to the west
  // edge at 0,6; past D10, for now, the world ends.
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
    && [5, 6, 7, 8, 9, 10, 11].every((x) => out.at(f10.x + x, f10.y + 32).ch === '=') && out.passable(e10.x - 1, e10.y + 6) !== 'ok',
    'the road runs square to square from G10\'s edge over F10, along its south rows past F11\'s corner, where F11\'s north row carries it too, and over E10 to its west edge at 0,6, and past D10, for now, the world ends');
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

  // Over F10's west edge onto E10, walked: the same land, so not named, and its floor a level over F10's
  // since the Wold's half came (#524), so at 25 nothing, at 24 the Waste's harder words, at 22 its warning.
  const ontoLow = cross(22, 'emberwaste_f10', 0, 30, WEST), ontoTwo = cross(24, 'emberwaste_f10', 0, 30, WEST), onto = cross(25, 'emberwaste_f10', 0, 30, WEST);
  ok(w.world.zone?.id === 'emberwaste_e10' && w.world.state.x === e10.x + 31 && w.world.state.y === e10.y + 30 && e10.x + e10.w === f10.x && !onto.length
    && E10.band?.join('-') === '25-26' && ontoTwo.join(' / ') === WASTE.crossing?.harder && ontoLow.join(' / ') === WASTE.crossing?.warning,
    `over F10's west edge at 0,30 onto E10's 31,30, walked: the same land, so not named; at 25 nothing, at 24 the Waste's harder words, at 22 its warning (${onto.join(' / ') || 'nothing'}; ${ontoTwo.join(' / ')}; ${ontoLow.join(' / ')})`);

  // E10: the notch the road takes through the Cinder Hills at about 150,306, a Rider's waymark in it;
  // the hermit on the crest; the flow's head at the south edge; the box laid whole, the Wold's steppe
  // and grass with it (#517), and the Wold's half on it (#524).
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
  ok([...ground].filter((c) => c === 's').length > 200 && ground.includes(','), 'E10 is laid whole, the Wold\'s steppe and grass with it');

  // The Wold's half (#524). Its groups: the beetles come over from the Waste on the ash, nearest the
  // way in; the vultures at the hills' foot, the Wold's nearest; the pride of three in the first grass
  // west of the Hills; and the drakes on the crest (#517). All won at the box's floor.
  const group = (id: string) => E10.encounters!.find((g) => g.id === id)!;
  const [beetles, vultures, lions] = ['e10_beetles', 'e10_vultures', 'e10_lions'].map(group);
  const from = (g: { x: number; y: number }): number => Math.abs(g.x - E10.start.x) + Math.abs(g.y - E10.start.y);
  ok(beetles.monsters.every((m) => m === 'cinder_beetle') && out.at(e10.x + beetles.x, e10.y + beetles.y).ch === 'a'
    && vultures.monsters.every((m) => m === 'vulture') && lions.monsters.join() === 'wold_lion,wold_lion,wold_lion' && out.at(e10.x + lions.x, e10.y + lions.y).ch === 's'
    && from(beetles) < from(vultures) && from(vultures) < from(lions) && lions.x < 11,
    'the beetles over from the Waste on the ash nearest the way in, the vultures at the hills\' foot after them, and a pride of three in the first grass west of the Hills');
  for (const g of E10.encounters!) fight(w, `emberwaste_e10:${g.id}`);
  // From the road on the ash, the vultures turning over the grave's hills; under the hills by the
  // road, the Riders' camp; over the crest, the glare off the Glass; where the grass begins, the
  // Riders' cairn.
  const nearRoad = (id: string, ch: string): boolean => { const f = E10.features!.find((x) => 'id' in x && x.id === id)!; return beside(e10, f.x, f.y, wasteRoad) && out.at(e10.x + f.x, e10.y + f.y).ch === ch; };
  const fire = E10.features!.find((f) => f.kind === 'camp')!;
  ok(nearRoad('e10_circle', 'a') && nearRoad('e10_glare', '^') && nearRoad('e10_mark', 's') && beside(e10, fire.x, fire.y, wasteRoad) && out.at(e10.x + fire.x - 1, e10.y + fire.y).ch === '^',
    'by the road the vultures seen turning over the hills, a camp under them, the glare from the crest and the Riders\' cairn where the grass begins');
  for (const id of ['e10_circle', 'e10_glare', 'e10_mark']) see(w, `emberwaste_e10:${id}`);
  // A Rider coming up the road, with word of the tents and of the vultures; two outriders on the last
  // rise, who watch and stop nobody. Words only: no quest, no flag.
  const people = E10.features!.filter((f) => f.kind === 'npc') as Person[];
  const rider = people.find((p) => p.name === 'A Rider')!, outriders = people.find((p) => p.name === 'Two outriders')!;
  ok(people.length === 3 && people.every((p) => !p.quest && !p.flag), 'E10\'s people, the hermit, the Rider and the outriders, have words only');
  w.world.travel('emberwaste_e10', rider.x, rider.y);
  const word = meet(rider, w.party, heard(w.world, rider)).text;
  ok(word.includes('Akordu') && word.includes('vultures') && beside(e10, rider.x, rider.y, wasteRoad), 'the Rider on the road tells of the tents at Akordu and of what the vultures mean');
  w.world.travel('emberwaste_e10', outriders.x, outriders.y);
  ok(meet(outriders, w.party, heard(w.world, outriders)).text.includes('We watch'), 'the outriders on the last rise watch, and stop nobody');
  // The Wold's line is its own row's, said where a Wold map is first entered (D10 over E10's west edge,
  // #527): E10 is the Waste's land, so it says the Waste's.
  const WOLD = ATLAS.zones.find((z) => z.id === 'wold');
  ok(!!WOLD?.crossing?.harder && !!WOLD.crossing.warning, 'the Wold\'s own words are on its row, for the first Wold map to say');

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

  // Old Cinder's and the Ember Stone's box (F11, #514). Over F10's south edge from its 16,31 onto F11's
  // 16,0, walked, the box's way in: the same land, so not named, and its floor a level over F10's, so
  // one or two under it the Waste's harder words and three under its warning; at the floor, nothing.
  // Over G11's west edge onto F11's 31,16, the land named and its words; straight back, nothing.
  const F11 = MAP_DEFS.find((d) => d.id === 'emberwaste_f11')!, f11 = out.zones.find((z) => z.id === 'emberwaste_f11')!;
  const on11f = (x: number, y: number): boolean => inBox(f11, x, y);
  const at11f = (x: number, y: number): number => key(f11.x + x, f11.y + y);
  const inLow = cross(22, 'emberwaste_f10', F11.start.x, 31, SOUTH), inTwo = cross(24, 'emberwaste_f10', F11.start.x, 31, SOUTH), inDue = cross(25, 'emberwaste_f10', F11.start.x, 31, SOUTH);
  ok(w.world.zone?.id === 'emberwaste_f11' && w.world.state.x === f11.x + F11.start.x && w.world.state.y === f11.y && f11.x === f10.x && f11.y === f10.y + 32 && F11.start.y === 0 && F11.start.facing === SOUTH && (F11.exits ?? []).length === 2 && F11.exits![0] === CRATER && F11.exits![1] === STONE,
    'over F10\'s south edge from its 16,31 onto F11\'s 16,0, walked, the box\'s way in, and it has no way out but its edges, the crater\'s, down into Old Cinder, and the Stone\'s, down into the Ember Stone');
  ok(!inDue.length && inTwo.join(' / ') === WASTE.crossing?.harder && inLow.join(' / ') === WASTE.crossing?.warning,
    `the same land, so not named: at 25 nothing, at 24 the Waste's harder words, at 22 its warning (${inDue.join(' / ') || 'nothing'}; ${inTwo.join(' / ')}; ${inLow.join(' / ')})`);
  const westLow = cross(22, 'firemount_g11', 0, 16, WEST), westTwo = cross(23, 'firemount_g11', 0, 16, WEST), westDue = cross(25, 'firemount_g11', 0, 16, WEST);
  ok(w.world.zone?.id === 'emberwaste_f11' && w.world.state.x === f11.x + 31 && w.world.state.y === f11.y + 16 && westDue.join(' / ') === 'The Ember Waste.'
    && westTwo.join(' / ') === `The Ember Waste. ${WASTE.crossing?.harder}` && westLow.join(' / ') === `The Ember Waste. ${WASTE.crossing?.warning}`,
    `over G11's west edge onto F11's 31,16, the Ember Waste named, and under its floor its own words (${westDue.join(' / ')}; ${westTwo.join(' / ')}; ${westLow.join(' / ')})`);
  const backG11 = cross(25, 'emberwaste_f11', 31, 16, EAST);
  ok(!backG11.length && w.world.zone?.id === 'firemount_g11', `straight back onto G11, nothing more (${backG11.join(' / ') || 'nothing'})`);
  w.level = 25;
  for (const m of w.party.members) m.level = 25;

  // Old Cinder's crater: its rim at the atlas's mark, the pit below it with the town's roof-ridges
  // standing out of it, and the way down at its west lip (CRATER), open since Old Cinder was built
  // (#515), nothing at its front; the old Lightbearer sitting by it (#448 his trainer and quest), and
  // the cairn on the rim.
  const walkF = (x: number, y: number): boolean => on11f(x, y) && out.passable(x, y) === 'ok';
  const ash = reach(F11.start.x, F11.start.y, walkF, f11);
  const ruin = ATLAS.sites.find((q) => q.name === 'Old Cinder')!;
  const [rx, ry] = [Math.floor(ruin.at[0]) - f11.x, Math.floor(ruin.at[1]) - f11.y];
  const pit = [...F11.rows.join('')].filter((c) => c === 'v').length, roofs = [...F11.rows.slice(1, 8).join('')].filter((c) => c === 'B').length;
  ok(rx === 22 && ry === 0 && !ruin.planned && ash.has(at11f(rx, ry)) && out.at(f11.x + rx, f11.y + ry + 1).terrain === 'chasm' && pit >= 25 && roofs >= 6,
    `the crater's rim is Old Cinder's mark on the atlas, F11's 22,0, the pit below it (${pit} squares) and the town's roofs standing out of it (${roofs})`);
  const lip = { x: CRATER.x - 1, y: CRATER.y };
  ok(CRATER.to === 'old_cinder' && out.at(f11.x + CRATER.x, f11.y + CRATER.y).terrain === 'ash' && out.at(f11.x + CRATER.x, f11.y + CRATER.y).solid === 'none'
    && out.at(f11.x + CRATER.x + 1, f11.y + CRATER.y).terrain === 'chasm' && ash.has(at11f(lip.x, lip.y)) && !F11.features!.some((f) => f.x === lip.x && f.y === lip.y),
    'the way down into Old Cinder is the crater\'s west lip, 19,4, its ash open now the town is built (CRATER), and nothing stands at its front');
  const old = person('An old Lightbearer', F11);
  w.world.travel('emberwaste_f11', old.x, old.y);
  ok(meet(old, w.party, heard(w.world, old)).text.includes('lamp at the bottom') && Math.abs(old.x - lip.x) + Math.abs(old.y - lip.y) === 1 && out.at(f11.x + old.x + 1, f11.y + old.y).terrain === 'chasm',
    'an old Lightbearer sits on the lip beside the way down: a lamp at the bottom of that town went out');
  const rimCairn = F11.features!.find((f) => f.kind === 'cairn' && f.id === 'f11_cairn');
  ok(rimCairn?.kind === 'cairn' && rimCairn.gold > 0 && [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => out.at(f11.x + rimCairn.x + dx, f11.y + rimCairn.y + dy).terrain === 'chasm'), 'a cairn on the crater\'s rim');

  // The Waste's rock: the hermit in a cleft of it, who has counted the stokers walking out for forty
  // years, and a camp in another cleft.
  const hermitF = person('A hermit', F11);
  w.world.travel('emberwaste_f11', hermitF.x, hermitF.y);
  const count = meet(hermitF, w.party, heard(w.world, hermitF)).text;
  ok(count.includes('stokers') && count.includes('Forty years') && [[0, -1], [0, 1], [-1, 0]].every(([dx, dy]) => out.at(f11.x + hermitF.x + dx, f11.y + hermitF.y + dy).solid === 'rock'),
    'the hermit in a cleft of the rock counts the stokers that walk out, and in forty years the count has not changed');
  const cleft = F11.features!.find((f) => f.kind === 'camp');
  ok(!!cleft && ash.has(at11f(cleft.x, cleft.y)) && [[0, -1], [-1, 0]].every(([dx, dy]) => out.at(f11.x + cleft.x + dx, f11.y + cleft.y + dy).solid === 'rock'), 'a camp in a cleft of the rock');

  // The west flow, from the east edge where G11's leaves its west edge at rows 10 and 11, west into the
  // rock to its end at 6,12; the causeway of slag over it, the Stone seen from it, and the milestone at
  // its end, as F10's stone counts.
  ok([10, 11].every((y) => out.at(f11.x + 31, f11.y + y).terrain === 'lava' && out.at(g11.x, g11.y + y).terrain === 'lava') && out.at(f11.x + 6, f11.y + 12).terrain === 'lava' && ash.has(at11f(6, 12)),
    'the west flow comes in off the mountain where G11\'s leaves its west edge and runs west into the rock to its end at 6,12');
  ok([12, 13].every((y) => F11.rows[y][18] === '"' && F11.rows[y][17] === '!' && F11.rows[y][19] === '!') && ash.has(at11f(18, 11)) && ash.has(at11f(18, 14)),
    'a causeway of slag crosses the flow at column 18, the lava either side of it');
  const stoneMile = F11.features!.find((f) => f.kind === 'event' && f.id === 'f11_milestone');
  ok(stoneMile?.kind === 'event' && stoneMile.x === 18 && stoneMile.y === 14 && stoneMile.text.includes('THE WOLD 4, CINDERPORT 4'),
    'the milestone at the causeway\'s end: THE WOLD 4, CINDERPORT 4, as F10\'s THE WOLD 2, CINDERPORT 4 counts');
  for (const id of ['f11_road', 'f11_rim', 'f11_roofs', 'f11_foot', 'f11_causeway', 'f11_milestone', 'f11_seal', 'f11_ruts', 'f11_floor', 'f11_tyre', 'f11_flow', 'f11_dusk', 'f11_crust', 'f11_hooves']) see(w, `emberwaste_f11:${id}`);

  // The Ember Stone half-built at the atlas's mark on its field of cinders, in its iron scaffold: the way
  // in down inside it (STONE, #516), and the step's line at its front each time until it is lit; the
  // shrine of the first Cinderport folk at the field's edge.
  const stoneMark = ATLAS.sites.find((q) => q.name === 'Ember Stone')!;
  const field = [...Array(81).keys()].map((i) => [STONE.x - 4 + (i % 9), STONE.y - 4 + Math.floor(i / 9)]).filter(([x, y]) => Math.abs(x - STONE.x) + Math.abs(y - STONE.y) <= 4 && F11.rows[y]?.[x] === ':');
  ok(Math.floor(stoneMark.at[0]) === f11.x + STONE.x && Math.floor(stoneMark.at[1]) === f11.y + STONE.y && STONE.to === 'ember_stone' && F11.exits!.includes(STONE) && out.passable(f11.x + STONE.x, f11.y + STONE.y) === 'ok'
    && [[-1, -1], [1, -1], [-1, 1], [1, 1]].every(([dx, dy]) => out.at(f11.x + STONE.x + dx, f11.y + STONE.y + dy).solid === 'pillar') && field.length >= 35,
    `the Stone stands at the Ember Stone's mark on the atlas, F11's 8,24, in an iron scaffold of four uprights, on a field of cinders (${field.length} squares with the Stone's own), the way down inside it`);
  const step = F11.features!.find((f) => f.kind === 'event' && f.id === 'f11_stone'), lit = F11.features!.find((f) => f.kind === 'event' && f.id === 'f11_lit');
  ok(step?.kind === 'event' && !step.once && step.x === STONE.x && step.y === STONE.y - 1 && step.text === 'On a field of cinders, a Stone half-built. The scaffold round it is iron and has not rusted.' && ash.has(at11f(step.x, step.y))
    && JSON.stringify(step.until) === JSON.stringify({ flag: 'q_ember_lit' }) && lit?.kind === 'event' && lit.x === step.x && lit.y === step.y && JSON.stringify(lit.after) === JSON.stringify(step.until),
    'the way into the Ember Stone is the Stone itself (STONE), and the step\'s line is said at its front each time until it is lit, the Stone lit after');
  see(w, 'emberwaste_f11:f11_stone');
  const firstFolk = F11.features!.find((f) => f.kind === 'shrine' && f.id === 'f11_shrine');
  ok(firstFolk?.kind === 'shrine' && ash.has(at11f(firstFolk.x, firstFolk.y)) && Math.abs(firstFolk.x - STONE.x) + Math.abs(firstFolk.y - STONE.y) === 5 && firstFolk.text.includes('first Cinderport folk'),
    'the first Cinderport folk\'s shrine stands at the field\'s edge');

  // The box's groups, each won at its floor: beetles below the crater, nearest the way in; husks out of
  // the crater only by night; a cinder drake on the flow, the hardest before the Stone; and sentries on
  // the way back from the Stone only once it is lit, the box's top.
  const husks = F11.encounters!.find((g) => g.id === 'f11_husks'), sentries = F11.encounters!.find((g) => g.id === 'f11_sentries');
  ok(JSON.stringify(husks?.when) === JSON.stringify({ hours: 'night' }) && !!husks?.monsters.every((m) => m === 'ash_husk') && !husks?.after,
    'the ash husks come out of the crater only by night');
  ok(JSON.stringify(sentries?.after) === JSON.stringify({ flag: 'q_ember_lit' }) && !!sentries?.monsters.every((m) => m === 'sentry') && F11.encounters!.filter((g) => g.after).length === 1,
    'the sentries walk the ash only once the Ember Stone is lit');
  for (const g of F11.encounters!) fight(w, `emberwaste_f11:${g.id}`);

  // The secret: the rock's face west of the field scored in straight lines, searched where it is scored;
  // behind it the hollow where the Stone's builders left their tools, and a Chain Mail +2 with them.
  // Walked, waded, climbed or floated, the hollow is never reached but through its mouth.
  const [face] = F11.secrets!;
  const shutF = reach(face.x + 1, face.y, (x, y) => !(x === f11.x + face.x && y === f11.y + face.y) && on11f(x, y) && out.passable(x, y, { swim: true, climb: true, float: true }) === 'ok', f11);
  ok(shutF.size > 300 && !shutF.has(at11f(face.x - 1, face.y)) && !shutF.has(at11f(face.x - 2, face.y)), `the hollow is shut but for its mouth: none of F11's ${shutF.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'emberwaste_f11:f11_scored');
  w.world.travel('emberwaste_f11', face.x + 1, face.y, WEST);
  let foundHollow = false;
  for (let i = 0; i < 20 && !foundHollow; i++) foundHollow = w.world.search();
  const intoHollow = foundHollow ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(foundHollow && intoHollow.every((r) => r.kind === 'moved') && w.world.used('f11_tools'), 'searched where the rock is scored, it opens, and in the hollow behind it the builders\' tools in rows');
  listen(w);
  const mail = F11.features!.find((f) => f.kind === 'chest' && f.id === 'f11_hollow');
  ok(mail?.kind === 'chest' && mail.items.includes('chain+2') && mail.gold > 0 && mail.x === face.x - 2 && mail.y === face.y, 'with the tools, a Chain Mail +2');

  oldCinder(w, ok);
  emberStone(w, ok);
};

/**
 * Old Cinder (#515): down off F11's crater lip into the buried town, its line said, and back up onto the
 * lip's front facing away from the pit; the street the ash has left and its people in the doorways, the
 * houses either side with their people as they were, every one with a cup; the well at the crossing full
 * of ash; the potters' kilns and the broken one beside them to rest in; the man in his doorway at the
 * lane's end; the husks in the street won; the square, the Old Drake asleep on it off the way across,
 * which wakes only beside it, won at the town's floor, never back and its death closing nothing, and the
 * stall it lies beside with the ladder's Flamberge +1; the hall's door and its stair down; the cellars,
 * the founding stone in its niche, the dry cellar to rest in and the husks won; the lamp-keeper's walk to
 * the lamp at the bottom, cold each time, and the Ember Stone's second part set in the floor beside it,
 * reached with nothing searched for; the lamp-keeper's cellar, found where the oil channel runs on under
 * a fallen stair; and back up the stair to the square.
 */
function oldCinder(w: Walk, ok: (cond: boolean, msg: string) => void): void {
  const [L1, L2] = ['old_cinder', 'old_cinder2'].map((id) => MAP_DEFS.find((d) => d.id === id)!);
  const at = (): string => `${w.world.state.mapId} ${w.world.state.x},${w.world.state.y}`;
  const feature = (d: MapDef, id: string): Feature | undefined => d.features!.find((f) => 'id' in f && f.id === id);
  const beside = (a: { x: number; y: number }, x: number, y: number): boolean => Math.abs(a.x - x) + Math.abs(a.y - y) === 1;
  /** Whether a level's square is reached from its start without passing its secret doors, or swimming, climbing or floating. */
  const reached = (d: MapDef, x: number, y: number): boolean => {
    const m = new GameMap(d), seen = new Set<number>(), todo = [[d.start.x, d.start.y]];
    while (todo.length) {
      const [cx, cy] = todo.pop()!, k = cy * m.width + cx;
      if (seen.has(k) || !m.inBounds(cx, cy) || m.at(cx, cy).door === 'secret' || m.passable(cx, cy, { swim: true, climb: true, float: true }) !== 'ok') continue;
      seen.add(k);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([cx + dx, cy + dy]);
    }
    return seen.has(y * m.width + x);
  };
  w.level = 25;

  // Down off the lip on F11 into the street, facing in, the way's line said, and the street's said at the
  // first step; stepped back onto, the way lets the company out onto the lip's front, facing away from
  // the pit.
  w.world.travel('emberwaste_f11', CRATER.x - 1, CRATER.y, EAST);
  const down = w.world.move('forward');
  ok(down.kind === 'moved' && w.world.state.mapId === 'old_cinder' && w.world.state.x === L1.start.x && w.world.state.y === L1.start.y && w.world.state.facing === SOUTH && down.messages.includes(CRATER.label!),
    `off the crater's lip the company climbs down into the buried town, facing in (${at()}: ${down.kind === 'moved' ? down.messages.join(' / ') : down.kind})`);
  const street = feature(L1, 'oc1_street'), first = w.world.move('forward');
  ok(street?.kind === 'event' && first.kind === 'moved' && first.messages.includes(street.text) && street.text.includes('the people stand as they stood'),
    `and its first step into the street says it (${first.kind === 'moved' ? first.messages.join(' / ') : first.kind})`);
  const up = w.world.move('back'), waste = w.world.zone;
  ok(up.kind === 'moved' && waste?.id === 'emberwaste_f11' && w.world.state.x - waste.x === CRATER.x - 1 && w.world.state.y - waste.y === CRATER.y && w.world.state.facing === WEST,
    `and back up over the lip onto its front on F11, facing away from the pit (${at()})`);
  ok([L1, L2].every((d) => (d.exits ?? []).every((e) => !e.shut && !e.needFlag) && !d.features!.some((f) => ['inn', 'temple', 'shop', 'guild', 'trainer'].includes(f.kind)) && d.features!.filter((f) => f.kind === 'camp').length === 1),
    'nothing shuts a way in Old Cinder, nothing in it sells or teaches, and each level has one place to rest');

  // The town (25): the houses either side of the street, their people as they were, every one with a
  // cup; the well at the crossing; the potters' kilns and the broken one beside them; the man in his
  // doorway at the lane's end.
  const houses = ['oc1_table', 'oc1_sill', 'oc1_shop', 'oc1_board'].map((id) => feature(L1, id));
  for (const h of houses) if (h?.kind === 'event') see(w, `old_cinder:${h.id}`);
  ok(houses.every((h) => h?.kind === 'event' && h.once && h.text.includes('cup') && w.world.used(h.id)), 'in the houses either side of the street, its people as they were, every one with a cup');
  const well = L1.features!.find((f) => f.kind === 'well');
  ok(well?.kind === 'well' && !well.heal && well.text.includes('full of ash'), 'the well at the crossing is full of ash, and mends nobody');
  see(w, 'old_cinder:oc1_kilns');
  const kiln = L1.features!.find((f) => f.kind === 'camp');
  ok(kiln?.kind === 'camp' && L1.rows[kiln.y][kiln.x - 1] === 'o' && w.world.used('oc1_kilns'), 'the potters\' kilns in a row, and one broken open beside them, dry inside, to rest in');
  see(w, 'old_cinder:oc1_door');

  // The husks in the street, between the well and the square.
  const [husks, drake] = L1.encounters!;
  ok(L1.encounters!.length === 2 && husks.monsters.join() === 'ash_husk,ash_husk,ash_husk,ash_husk' && !!husks.respawn && husks.roams === false,
    'four husks stand in the street between the well and the square');
  fight(w, `old_cinder:${husks.id}`);

  // The square: the Old Drake asleep on it, off the way across to the hall's door, waking only when the
  // company comes beside it; won at the town's floor, it never comes back and its death closes nothing.
  // Beside it the stall, and on it the ladder's Flamberge +1.
  see(w, 'old_cinder:oc1_square');
  const hall = feature(L1, 'oc1_hall');
  ok(drake.monsters.join() === 'old_drake' && drake.roams === false && !drake.respawn && hall?.kind === 'event' && !beside(drake, hall.x, hall.y) && !beside(drake, 8, 10)
    && MONSTERS.old_drake.level === 26 && MONSTERS.old_drake.sweep?.element === 'fire' && !!drake.slainText?.includes('Nothing else in the town has moved'),
    'the Old Drake lies asleep on the square, off the way across it, and wakes only beside it; it breathes fire on a row, and its death closes nothing');
  fight(w, `old_cinder:${drake.id}`);
  const stall = feature(L1, 'oc1_stall');
  ok(stall?.kind === 'chest' && stall.items.join() === 'flamberge+1' && stall.gold > 0 && beside(drake, stall.x, stall.y), 'on the stall it lay beside, coin and a Flamberge +1');

  // The hall's door under the square, and its stair down to the cellars.
  see(w, 'old_cinder:oc1_hall');
  walkThrough(w, 'old_cinder', hall!.x, hall!.y, SOUTH, 'old_cinder2', 2);
  ok(w.world.state.x === L2.start.x && w.world.state.y === L2.start.y && w.world.state.facing === SOUTH, `the hall's stair comes down into its cellars (${at()})`);

  // The undercroft (24): the cellars, the founding stone in its niche off them (#56's 50; its quest is
  // #519's), the dry cellar to rest in, and the husks before the walk.
  see(w, 'old_cinder2:oc2_cellars');
  see(w, 'old_cinder2:oc2_niche');
  const stone = feature(L2, 'oc2_stone');
  ok(stone?.kind === 'chest' && stone.items.join() === 'founding_stone' && item('founding_stone').slot === 'none' && reached(L2, stone.x, stone.y) && w.world.used('oc2_niche'),
    'in a niche off the west cellar, the town\'s founding stone, a cup cut in its face');
  const [cellar] = L2.encounters!;
  ok(L2.encounters!.length === 1 && cellar.monsters.join() === 'ash_husk,ash_husk,ash_husk,ash_husk' && !!cellar.respawn && cellar.roams === false, 'four husks stand in the cellars');
  fight(w, `old_cinder2:${cellar.id}`);

  // The lamp-keeper's walk down to the lamp at the bottom, cold and said so each time (the Paladin's
  // third relights it, #448), and beside it the Ember Stone's second part set in the floor (§5).
  see(w, 'old_cinder2:oc2_walk');
  const lamp = feature(L2, 'oc2_lamp');
  w.world.travel('old_cinder2', lamp!.x, lamp!.y);
  const lit = [w.world.eventsHere(), w.world.eventsHere()];
  ok(lamp?.kind === 'event' && !lamp.once && lit.every((said) => said.includes(lamp.text)) && L2.rows[lamp.y + 1][lamp.x] === 'o', 'at the bottom of the walk the lamp, cold, and so each time');
  see(w, 'old_cinder2:oc2_set');
  const part = feature(L2, 'oc2_part');
  ok(part?.kind === 'chest' && part.items.join() === 'ember_part2' && item('ember_part2').name === 'Ember Stone\'s Second Part' && beside(part, lamp!.x, lamp!.y + 1) && reached(L2, part.x, part.y),
    'set in the floor beside the lamp, the Ember Stone\'s second part, reached with nothing searched for');

  // The secret: a stair fallen against the walk's wall, the oil channel running on under it; searched
  // there, it gives on the lamp-keeper's own cellar, his symbol and his plate. Walked, it is never reached
  // but through the fallen stair.
  const [fallen] = L2.secrets!;
  ok(!reached(L2, fallen.x - 1, fallen.y) && reached(L2, fallen.x + 1, fallen.y) && fallen.hint === 'oc2_fallen', 'the lamp-keeper\'s cellar is reached only through the fallen stair');
  see(w, 'old_cinder2:oc2_fallen');
  w.world.travel('old_cinder2', fallen.x + 1, fallen.y, WEST);
  let found = false;
  for (let i = 0; i < 20 && !found; i++) found = w.world.search();
  const into = found ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(found && into.every((r) => r.kind === 'moved') && w.world.used('oc2_keeper'), 'searched where the channel runs under the fallen stair, it gives on the lamp-keeper\'s cellar');
  const keepers = feature(L2, 'oc2_keepers');
  ok(keepers?.kind === 'chest' && keepers.items.join() === 'hearth_symbol,plate+2' && keepers.gold > 0 && !!item('hearth_symbol').resist?.includes('fire'),
    'in it his Holy Symbol of the Hearth, which its bearer carries against fire, and a Plate Mail +2');

  // Back up the stair, out at the hall's door onto the square.
  walkThrough(w, 'old_cinder2', L2.start.x, L2.start.y + 1, NORTH, 'old_cinder', 1);
  ok(w.world.state.x === hall!.x && w.world.state.y === hall!.y && w.world.state.facing === NORTH, `the stair climbs back out at the hall's door, onto the square (${at()})`);
  listen(w);
}

/**
 * The Ember Stone (#516): down inside the Stone on F11 by the builders' stair, its line said, and back up
 * onto the Stone's front facing away from it; the gallery round the housing, its iron unrusted; the
 * builders' benches, the ladder's Battle Staff +1 and Drakeskin Coat +1 on them; the lookout over the
 * Waste and under it the seedling's bed, bare (#448's); the heart, its line the brief's, and the door in
 * its floor shut each time; the three parts carried up out of their chests and set in any order, each
 * socket barred to a company without its part, the Stone dark and the door empty until the last is in,
 * whichever it is, and then lit, the Sentinel in the door; the Sentinel won at the level's floor, never
 * back, its visor left, and the sentries up through the door after it, won; the door open on its shaft
 * and the Stone lit on F11; the lower gallery, found where the chain pin is driven into the housing's
 * foot and reached only through it, and the fourth journal in it; and the Cartographers' Surveyor's rung
 * for the journal found (#635), offered once Act III is done at any hall of the Guild, paid at the Chart
 * House, whose shelf then holds four.
 */
function emberStone(w: Walk, ok: (cond: boolean, msg: string) => void): void {
  const ES = MAP_DEFS.find((d) => d.id === 'ember_stone')!;
  const at = (): string => `${w.world.state.mapId} ${w.world.state.x},${w.world.state.y}`;
  const feature = (id: string): Feature | undefined => ES.features!.find((f) => 'id' in f && f.id === id);
  /** Whether a square is reached from the way in without passing a secret door, or swimming, climbing or floating. */
  const reached = (x: number, y: number): boolean => {
    const m = new GameMap(ES), seen = new Set<number>(), todo = [[ES.start.x, ES.start.y]];
    while (todo.length) {
      const [cx, cy] = todo.pop()!, k = cy * m.width + cx;
      if (seen.has(k) || !m.inBounds(cx, cy) || m.at(cx, cy).door === 'secret' || m.passable(cx, cy, { swim: true, climb: true, float: true }) !== 'ok') continue;
      seen.add(k);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([cx + dx, cy + dy]);
    }
    return seen.has(y * m.width + x);
  };
  /** Open a chest as the game does: its gold and its items to the company, and spent. */
  const open = (v: Walk, map: string, id: string): void => {
    const c = MAP_DEFS.find((d) => d.id === map)!.features!.find((f) => f.kind === 'chest' && f.id === id);
    if (c?.kind !== 'chest') { ok(false, `there is a chest ${map}:${id}`); return; }
    v.world.travel(map, c.x, c.y);
    if (v.world.used(id)) return;
    v.world.markUsed(id);
    v.party.gold += c.gold;
    v.party.bag.push(...c.items);
  };
  w.level = 25;

  // Down inside the Stone on F11 by the builders' stair into the gallery, facing in, the way's line said,
  // and the gallery's at the first step; stepped back onto, the stair lets the company out on the Stone's
  // front, facing away from it.
  w.world.travel('emberwaste_f11', STONE.x, STONE.y - 1, SOUTH);
  const down = w.world.move('forward');
  ok(down.kind === 'moved' && w.world.state.mapId === ES.id && w.world.state.x === ES.start.x && w.world.state.y === ES.start.y && w.world.state.facing === SOUTH && down.messages.includes(STONE.label!),
    `down inside the Stone on F11, the company goes by the builders' stair into its housing, facing in (${at()}: ${down.kind === 'moved' ? down.messages.join(' / ') : down.kind})`);
  const gallery = feature('es_gallery'), first = w.world.move('forward');
  ok(gallery?.kind === 'event' && first.kind === 'moved' && first.messages.includes(gallery.text) && gallery.text.includes('has not rusted'),
    `and its first step says the gallery round the housing, the iron unrusted (${first.kind === 'moved' ? first.messages.join(' / ') : first.kind})`);
  const up = w.world.move('back'), waste = w.world.zone;
  ok(up.kind === 'moved' && waste?.id === 'emberwaste_f11' && w.world.state.x - waste.x === STONE.x && w.world.state.y - waste.y === STONE.y - 1 && w.world.state.facing === NORTH,
    `and back up the stair onto the Stone's front on F11, facing away from it (${at()})`);
  ok((ES.exits ?? []).length === 1 && (ES.exits ?? []).every((e) => !e.shut && !e.needFlag) && !ES.features!.some((f) => ['inn', 'temple', 'shop', 'guild', 'trainer'].includes(f.kind)),
    'the builders\' stair is the one way in and out of the Stone, nothing shuts it, and nothing in it sells or teaches');

  // The benches off the gallery's west arm, the ladder's staff and coat on them with a plus; the lookout
  // over the Waste off its east arm, and under it the seedling's bed, bare.
  see(w, 'ember_stone:es_benches');
  const bench = feature('es_bench');
  ok(bench?.kind === 'chest' && bench.items.join() === 'battle_staff+1,drakeskin+1' && bench.gold > 0 && reached(bench.x, bench.y) && w.world.used('es_benches'),
    'on the builders\' benches, their tools in rows, coin, a Battle Staff +1 and a Drakeskin Coat +1');
  open(w, ES.id, 'es_bench');
  see(w, 'ember_stone:es_lookout');
  see(w, 'ember_stone:es_bed');
  const bed = feature('es_bed');
  ok(bed?.kind === 'event' && bed.text.includes('Nothing grows') && w.world.used('es_lookout') && w.world.used('es_bed'), 'the lookout over the Waste, and under it a bed of earth where nothing grows yet');

  // The heart: the brief's line, the three sockets round the core and the door in the floor below it,
  // shut, and said so each time.
  see(w, 'ember_stone:es_heart');
  const event = (id: string): Extract<Feature, { kind: 'event' }> => ES.features!.find((f): f is Extract<Feature, { kind: 'event' }> => f.kind === 'event' && f.id === id)!;
  const heart = feature('es_heart'), door = event('es_door'), opened = event('es_open');
  ok(heart?.kind === 'event' && heart.text === 'Three sockets in the Stone\'s heart, each the shape of something, each empty. The builders stopped as if called away.' && w.world.used('es_heart'),
    'in the housing\'s heart, three sockets, each the shape of something and each empty');
  w.world.travel(ES.id, door.x, door.y);
  const shut = [w.world.eventsHere(), w.world.eventsHere()];
  ok(door.kind === 'event' && opened.kind === 'event' && !door.once && shut.every((said) => said.includes(door.text) && !said.includes(opened.text)) && ES.rows[door.y - 1][door.x] === 'o',
    'below the core, the door in the floor, shut, and so each time');

  // The three parts carried up out of their chests, the vents', Old Cinder's and the corridors', and set
  // in any order: here Old Cinder's first, the corridors' next and the vents' last. Each socket takes its
  // own part alone, barred to a company without it, and is gone once it is in; the Stone stays dark and
  // nothing stands in the door until the last is in, whichever it is, and the last lights it.
  for (const [map, id] of [['meridian_camp', 'mc1_part'], ['old_cinder2', 'oc2_part'], ['meridian_camp2', 'mc2_part']]) open(w, map, id);
  const sockets = ES.features!.filter((f): f is Person => f.kind === 'npc'), [loaf, wedge, long] = sockets;
  const sentinel = ES.encounters!.find((g) => g.id === 'es_sentinel')!, sentries = ES.encounters!.find((g) => g.id === 'es_sentries')!;
  const there = (g: typeof sentinel): boolean => w.world.walks(g, g.x, g.y) && !w.world.ended(g);
  const put = (p: Person): string => {
    w.world.travel(ES.id, p.x, p.y);
    const [a] = meet(p, w.party, heard(w.world, p)).choice?.answers ?? [];
    return a ? answer(a, w.party) : '';
  };
  const without = structuredClone(w.party);
  without.bag = without.bag.filter((i) => !i.startsWith('ember_part'));
  ok(sockets.length === 3 && sockets.every((p, i) => p.choice?.answers.length === 1 && p.choice.answers[0].takes === `ember_part${i + 1}` && barred(p.choice.answers[0], without) && w.world.present(p))
    && ['ember_part1', 'ember_part2', 'ember_part3'].every((i) => w.party.bag.includes(i)),
    'three sockets round the core, each taking its own part alone and barred to a company without it; the company carries all three');
  const second = put(wedge), third = put(long);
  ok(!!w.party.flags[SOCKETS[1]] && !!w.party.flags[SOCKETS[2]] && !w.party.flags[SOCKETS[0]] && !w.party.flags[LIT] && !w.world.present(wedge) && !w.world.present(long) && w.world.present(loaf)
    && !there(sentinel) && !there(sentries) && !w.party.bag.includes('ember_part2') && !w.party.bag.includes('ember_part3') && w.party.bag.includes('ember_part1'),
    `Old Cinder's part and the corridors' set first, each in its socket, and the Stone still dark and the door empty (${second.replace(/\n+/g, ' ')} / ${third.replace(/\n+/g, ' ')})`);
  const lit = put(loaf);
  ok(!!w.party.flags[LIT] && SOCKETS.every((f) => w.party.flags[f]) && lit.startsWith(LIGHTS.join('\n\n')) && !w.party.bag.some((i) => i.startsWith('ember_part')) && sockets.every((p) => !w.world.present(p))
    && there(sentinel) && !there(sentries),
    `the vents' part last, and the Stone lights: the door opens and the Sentinel stands in it, the first thing up (${lit.replace(/\n+/g, ' ')})`);

  // The Sentinel, won at the level's floor: at 26, it never comes back, goes down over the door and leaves
  // its visor; then two sentries come up through the door after it, won, and the door stands open.
  ok(sentinel.monsters.join() === 'sentinel' && !sentinel.respawn && MONSTERS.sentinel.level === 26 && !!sentinel.slainText && sentinel.x === door.x && sentinel.y === door.y && JSON.stringify(sentinel.after) === JSON.stringify({ flag: LIT }),
    'the Sentinel stands in the door the moment the Stone lights, a boss at 26 that never comes back');
  fight(w, 'ember_stone:es_sentinel');
  ok(w.party.bag.includes('sentinel_visor') && there(sentries) && sentries.monsters.join() === 'sentry,sentry' && !!sentries.respawn, 'won, it leaves its visor, and two sentries come up through the door after it');
  fight(w, 'ember_stone:es_sentries');
  w.world.travel(ES.id, door.x, door.y);
  const gone = w.world.eventsHere();
  ok(opened.kind === 'event' && gone.includes(opened.text) && !gone.includes(door.text), 'the door in the floor stands open on its shaft');
  w.world.travel('emberwaste_f11', STONE.x, STONE.y - 1);
  const front = w.world.eventsHere();
  ok(front.some((t) => t.includes('burns white')) && !front.some((t) => t.includes('half-built')), `and on F11 the Stone burns at its front (${front.join(' / ')})`);

  // The secret: a chain pin with the Guild's mark driven into the housing's foot; searched there, the foot
  // gives on steps down to the lower gallery where the Meridian Company camped, the fourth journal in it.
  const [foot] = ES.secrets!, journal = feature('es_journal')!;
  ok(foot.hint === 'es_pin' && !reached(foot.x, foot.y - 1) && !reached(journal.x, journal.y) && reached(foot.x, foot.y + 1), 'the lower gallery is reached only through the housing\'s foot');
  see(w, 'ember_stone:es_pin');
  w.world.travel(ES.id, foot.x, foot.y + 1, NORTH);
  let found = false;
  for (let i = 0; i < 20 && !found; i++) found = w.world.search();
  const into = found ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(found && into.every((r) => r.kind === 'moved') && w.world.used('es_lower'), 'searched where the chain pin is driven in, the foot gives on steps down to the lower gallery and the Company\'s bedrolls');
  open(w, ES.id, 'es_journal');
  ok(journal.kind === 'chest' && journal.items.join() === 'meridian_journal4' && w.party.bag.includes('meridian_journal4') && item('meridian_journal4').slot === 'none' && !item('meridian_journal4').price && w.world.used('es_journal'),
    'and in it the fourth Meridian journal, in Fane\'s hand');
  listen(w);

  // The Cartographers' Surveyor's rung (#635), on fresh companies made Surveyors: not offered before Act
  // III is done, then offered alone at any hall of the Guild and taking nothing; taken with the journal
  // unfound, the hall pays nothing; found, the Chart House pays 500 gold and 3,600 xp, the book stays in
  // the pack and the company are Mapmakers, and the shelf holds four. A company that had found the journal
  // first is paid at the taking, with the words for one that came early.
  const q = GUILD_QUESTS.find((g) => g.id === 'carto_journal')!;
  const CP = MAP_DEFS.find((d) => d.id === 'cinderport')!, chart = CP.features!.find((f): f is Person => f.kind === 'npc' && f.interior === 'cinderport_cartographers')!;
  const surveyors = (): Walk => {
    const v = newWalk(ok);
    for (const g of GUILD_QUESTS) if (g.guild === 'cartographers' && g.rank < 2) v.party.flags[takenFlag(g.id)] = v.party.flags[doneFlag(g.id)] = 1;
    v.party.flags[rankFlag('cartographers')] = 2;
    return v;
  };
  const shelf = (v: Walk): string => { v.world.travel('cinderport', chart.x, chart.y); return meet(chart, v.party, heard(v.world, chart)).text; };
  const xpOf = (p: Party): number => p.members.reduce((t, m) => t + m.xp, 0);
  const j = surveyors();
  ok(!offered('cartographers', j.party).some((o) => o.id === q.id), `${q.title} waits for Act IV: a Surveyor is not offered it before the Sleepers are seen`);
  j.party.flags[SLEEPERS_SEEN] = 1;
  ok(offered('cartographers', j.party).map((o) => o.id).join() === q.id && !q.item && ['Map Room', 'Chart House'].every((h) => q.goals[0].text.includes(h)),
    'then it is offered alone at any hall of the Guild, Saltmouth\'s Map Room or the Chart House, and takes nothing');
  const purse = j.party.gold, xp = xpOf(j.party), before = shelf(j);
  ok(!take(q, j.world.state, j.party).length && !report('cartographers', j.world.state, j.party).length && rankOf('cartographers', j.party) === 2, 'taken with the journal unfound, the hall pays nothing');
  open(j, ES.id, 'es_journal');
  j.world.travel('cinderport', chart.x, chart.y);
  const paid = report('cartographers', j.world.state, j.party), after = shelf(j);
  ok(paid.length === 2 && paid[0].startsWith(q.paid[0]) && j.party.gold === purse + 500 && xpOf(j.party) >= xp + 3600 - j.party.members.length && rankOf('cartographers', j.party) === 3
    && !!j.party.flags[doneFlag(q.id)] && j.party.bag.includes('meridian_journal4'),
    `the journal found, the Chart House pays 500 gold and 3,600 xp, the book stays in the pack and the company are Mapmakers (${paid.join(' ').replace(/\n+/g, ' ')})`);
  ok(before.includes('shelf of three journals') && after.includes('shelf of four journals'), 'and the Chart House\'s shelf, three journals and a gap before, holds four after');
  const late = surveyors();
  late.party.flags[SLEEPERS_SEEN] = 1;
  open(late, ES.id, 'es_journal');
  const lateGold = late.party.gold, early = take(q, late.world.state, late.party);
  ok(early.length === 2 && early[0].startsWith(q.early![0]) && late.party.gold === lateGold + 500 && rankOf('cartographers', late.party) === 3,
    `a company that had found the journal is paid at the taking, with the early words (${early.join(' ').replace(/\n+/g, ' ')})`);
}

/**
 * The Stair's foot (H10, #510), the area's first box in road order: down the Giants' Stair from I10's
 * 0,20 onto H10's 31,20, Cindercoast's crossing words said to a company of 21 and 22 and its name alone
 * at 24, nothing straight back; the Stair's last flights to the landing at 26,20, the atlas's link, and
 * the step there; the road square to square from the Stair west across the sand and through the shore's
 * vines to the west edge, out onto G10's vines; the seams with I10 and G10, and past the north and south
 * edges, for now, the world ends; Scaldwell: its pools, the bathhouse keeper, a Rider with words only
 * (#56's 49 is #519's), the Riders' shrine and the stoker seen at its rock; the milestone, the camp and
 * the cairn; the groups won at the floor, the vines and the stoker never roaming; and the vent under
 * the rock, found from the path trodden to it, shut but for its door.
 */
function stairFoot(ok: (cond: boolean, msg: string) => void): void {
  const w = newWalk(ok);
  const out = buildMaps()[OUTDOORS];
  const H10 = MAP_DEFS.find((d) => d.id === 'cindercoast_h10')!;
  const h10 = out.zones.find((z) => z.id === 'cindercoast_h10')!, i10 = out.zones.find((z) => z.id === 'highspine_i10')!;
  const g10 = out.zones.find((z) => z.id === 'cindercoast_g10')!;
  const onH10 = (x: number, y: number): boolean => x >= h10.x && x < h10.x + h10.w && y >= h10.y && y < h10.y + h10.h;
  const at = (x: number, y: number): number => (h10.y + y) * out.width + h10.x + x;
  const reach = (fx: number, fy: number, along: (x: number, y: number) => boolean): Set<number> => {
    const seen = new Set([at(fx, fy)]), q = [[h10.x + fx, h10.y + fy]];
    for (let i = 0; i < q.length; i++) {
      const [x, y] = q[i];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = (y + dy) * out.width + x + dx; if (!seen.has(k) && along(x + dx, y + dy)) { seen.add(k); q.push([x + dx, y + dy]); } }
    }
    return seen;
  };
  const walk = (x: number, y: number): boolean => onH10(x, y) && out.passable(x, y) === 'ok';
  const feature = (id: string): Feature => H10.features!.find((f) => 'id' in f && f.id === id)!;
  const beside = (f: { x: number; y: number }, set: Set<number>): boolean => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => set.has(at(f.x + dx, f.y + dy)));

  // Down the Stair from I10's 0,20 onto H10's 31,20, the box's way in: a company under Cindercoast's floor
  // is told how the far side feels, one at it hears the land's name alone; straight back, nothing.
  ok(h10.x + h10.w === i10.x && h10.y === i10.y && H10.start.x === 31 && H10.start.y === 20 && H10.start.facing === WEST,
    'the box\'s way in is the Stair, from I10\'s 0,20 onto H10\'s 31,20, facing west');
  const down = (level: number): string => {
    for (const m of w.party.members) m.level = level;
    w.world.travel('highspine_i10', 0, 20, WEST);
    const r = w.world.move('forward');
    return r.kind === 'moved' && w.world.zone?.id === 'cindercoast_h10' && w.world.state.x === h10.x + 31 ? r.messages.join(' ') : `(${r.kind})`;
  };
  const said = [down(21), down(22), down(24)];
  ok(said[0] === `Cindercoast. ${COAST.crossing!.warning}` && said[1] === `Cindercoast. ${COAST.crossing!.harder}` && said[2] === 'Cindercoast.',
    `down the Stair onto the far side, Cindercoast's words to a company of 21 and of 22, and its name alone at 24 (${said.join(' / ')})`);
  w.world.travel('cindercoast_h10', 31, 20, EAST);
  const back = w.world.move('forward');
  // Straight back up, the land is not named again; the king's giants, seen up the Stair, are I10's.
  ok(back.kind === 'moved' && !back.messages.some((m) => m.includes('High Spine')) && w.world.zone?.id === 'highspine_i10',
    `straight back up onto I10's 0,20, the land is not named again (${back.kind === 'moved' ? back.messages.join(' / ') : back.kind})`);
  w.level = 24;
  for (const m of w.party.members) m.level = 24;

  // The Stair's last flights along the Sheer's foot to the landing at 26,20, the atlas's link, and the
  // step said there; from it the road west across the sand, past Scaldwell and through the vines to the
  // west edge at 0,11, where it comes out onto G10's vines for Cinderport.
  const road = reach(31, 20, (x, y) => onH10(x, y) && out.at(x, y).ch === '=');
  const link = ATLAS.links.find((l) => l.note === 'the Giants\' Stair')!;
  ok(link.a?.[0] === h10.x + 26 && link.a?.[1] === h10.y + 20 && road.has(at(26, 20)) && [28, 29, 30, 31].every((x) => out.at(h10.x + x, h10.y + 19).solid !== 'none'),
    'the Stair\'s last flights come down under the Sheer to the landing at 26,20, the atlas\'s link, 258,306');
  ok(road.has(at(0, 11)) && out.at(h10.x - 1, h10.y + 11).ch === '&' && out.passable(h10.x - 1, h10.y + 11) === 'ok',
    'the road runs square to square from the Stair across the sand and through the vines to the west edge at 0,11, out onto G10\'s vines');
  see(w, 'cindercoast_h10:h10_foot');
  const foot = feature('h10_foot');
  ok(foot.kind === 'event' && foot.x === 26 && foot.y === 20 && foot.text.includes('ends in black sand') && w.world.used('h10_foot'),
    'at the landing, the step: the last flight ends in black sand, and ahead a mountain smokes over everything');
  const cairn = feature('h10_cairn');
  ok(cairn.kind === 'cairn' && Math.abs(cairn.x - foot.x) + Math.abs(cairn.y - foot.y) <= 2 && cairn.items.includes('potion_sp_great'), 'a cairn at the Stair\'s foot');
  const stone = feature('h10_milestone');
  ok(stone.kind === 'event' && stone.text.includes('CINDERPORT 5') && beside(stone, road) && out.at(h10.x + stone.x, h10.y + stone.y).ch === '&',
    'the milestone stands by the track where it leaves the sand for the vines: CINDERPORT 5');
  see(w, 'cindercoast_h10:h10_milestone');

  // The seams: the east edge meets I10's west square for square, the Sheer against the Sheer, the Stair
  // against the Stair and the ground under it against the ground; the west meets G10's east but at the
  // track, the stream going on at rows 22 and 23, and over it, the same land at the same floor, nothing
  // is said. Past the north and south edges, for now, the world ends.
  const column = (x: number): string => [...Array(32).keys()].map((y) => out.at(x, h10.y + y).ch).join('');
  ok(column(h10.x + 31) === column(i10.x) && g10.x + g10.w === h10.x && g10.y === h10.y, `the east edge meets I10's west edge square for square (${column(h10.x + 31)})`);
  ok([...Array(32).keys()].every((y) => y === 11 || out.at(h10.x, h10.y + y).ch === out.at(h10.x - 1, h10.y + y).ch) && out.at(h10.x, h10.y + 22).ch === '~',
    'the west edge meets G10\'s east edge square for square but at the track, the stream going on at rows 22 and 23');
  w.world.travel('cindercoast_h10', 0, 15, WEST);
  const over = w.world.move('forward');
  ok(over.kind === 'moved' && !over.messages.length && w.world.zone?.id === 'cindercoast_g10', 'over the west edge onto G10, the same land at the same floor, nothing is said');
  ok([...Array(32).keys()].every((i) => out.passable(h10.x + i, h10.y - 1) !== 'ok' && out.passable(h10.x + i, h10.y + 32) !== 'ok'), 'past the north and south edges, for now, the world ends');

  // Scaldwell, the springs on the atlas: its pools in the ash, the bathhouse and its keeper, a Rider with
  // words only, and the Riders' shrine; past them the stoker at the rock, seen from the track first.
  const dry = reach(31, 20, walk);
  const pools = feature('h10_pools');
  const scald = ATLAS.sites.find((s) => s.name === 'Scaldwell')!;
  ok(!scald.planned && scald.at[0] === h10.x + pools.x && scald.at[1] === h10.y + pools.y && out.at(h10.x + pools.x, h10.y + pools.y + 1).ch === '~' && dry.has(at(pools.x, pools.y)),
    'Scaldwell, the springs at 240,300 on the atlas, is the pools in the ash at 8,14');
  see(w, 'cindercoast_h10:h10_pools');
  const keeper = H10.features!.find((f) => f.kind === 'npc' && f.name === 'The bathhouse keeper') as Person;
  ok([[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => out.at(h10.x + keeper.x + dx, h10.y + keeper.y + dy).solid === 'building'), 'the keeper stands by the bathhouse');
  w.world.travel('cindercoast_h10', keeper.x, keeper.y);
  const words = meet(keeper, w.party, heard(w.world, keeper)).text;
  ok(words.includes('Anvil Stone') && words.includes('grey part') && words.includes('not there'),
    'the bathhouse keeper: the springs went cold with the Anvil Stone and warm again, things come up in the water, and the thing at the rock is not always there');
  const shrine = feature('h10_shrine');
  ok(shrine.kind === 'shrine' && dry.has(at(shrine.x, shrine.y)) && Math.abs(shrine.x - pools.x) + Math.abs(shrine.y - pools.y) <= 4 && shrine.text.includes('Riders'),
    'the Riders\' shrine stands by the pools');
  see(w, 'cindercoast_h10:h10_shovel');
  const [door] = H10.secrets!;
  const stoker = H10.encounters!.find((g) => g.id === 'h10_stoker')!;
  ok(stoker.monsters.join() === 'stoker' && stoker.roams === false && Math.abs(stoker.x - door.x) + Math.abs(stoker.y - door.y) <= 3,
    'at the rock where the water comes up, a stoker shovelling, which never roams: the first heavy machine');

  // On the sand: the camp under the Sheer, the dune over the Sound, what has come down the Stair the short
  // way; and over the stream on its stones, the heron in the corner under it.
  const camp = H10.features!.find((f) => f.kind === 'camp');
  ok(!!camp && dry.has(at(camp.x, camp.y)) && out.at(h10.x + camp.x, h10.y + camp.y).ch === 'a' && out.at(h10.x + 30, h10.y + camp.y).ch === '|', 'the camp on the sand under the Sheer');
  ok(dry.has(at(1, 29)) && !reach(31, 20, (x, y) => walk(x, y) && out.at(x, y).ch !== '"').has(at(1, 29)), 'the stream is crossed on its stones to the corner under it');
  for (const id of ['h10_lookout', 'h10_fallen', 'h10_heron']) see(w, `cindercoast_h10:${id}`);

  // The box's groups, each won at its floor: beetles just past the Stair's foot, the area's gentlest, and
  // on the sand toward the dune; the vines in the shore's first trees and the stoker at its rock, which
  // never roam.
  ok(H10.encounters!.filter((g) => g.monsters.some((m) => m === 'strangler_vine' || m === 'stoker')).every((g) => g.roams === false), 'the strangler vines and the stoker never roam');
  for (const g of H10.encounters!) fight(w, `cindercoast_h10:${g.id}`);

  // The secret: the path trodden to the rock, the search there and the vent behind it. Walked, waded,
  // climbed or floated, the vent is never reached but through its door.
  const hoard = feature('h10_vent_hoard');
  const shut = reach(door.x, door.y - 1, (x, y) => !(x === h10.x + door.x && y === h10.y + door.y) && onH10(x, y) && out.passable(x, y, { swim: true, climb: true, float: true }) === 'ok');
  ok(shut.size > 300 && !shut.has(at(door.x, door.y + 1)) && !shut.has(at(hoard.x, hoard.y)), `the vent is shut but for its door: none of H10's ${shut.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'cindercoast_h10:h10_trodden');
  w.world.travel('cindercoast_h10', door.x, door.y - 1, SOUTH);
  let opens = false;
  for (let i = 0; i < 20 && !opens; i++) opens = w.world.search();
  const inside = opens ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(opens && inside.every((r) => r.kind === 'moved') && w.world.used('h10_vent'), 'searched where the trodden path ends, the rock opens, and the vent behind it can be walked down to');
  listen(w);
  ok(hoard.kind === 'chest' && hoard.items.includes('plate+2') && hoard.gold === 750 && hoard.x === door.x && hoard.y === door.y + 2, 'down the vent, coin of every age and a Plate Mail +2');
}

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
