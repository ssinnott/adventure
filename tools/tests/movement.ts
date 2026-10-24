// Moving about: steps and the clock, doors, keys and secrets, water and mountains, the end of the
// world, the open pass walked into Thornmark and back, Town Portal, the stairs, Helmstow's two
// gates, a group under the ice, the road cut through cliffs and peaks, the far side's ground, the
// skills that open the map, a Pathfinder's pace and a Lockpick's locks, and the beasts an Archdruid
// is left alone by.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { MONSTERS, ITEMS, CLIMATES, TABLES } from '../../src/content/index.ts';
import type { ItemDef } from '../../src/game/items.ts';
import { findWeather, SNOW_DRAG } from '../../src/game/weather.ts';
import { World, WALK_STEPS, WALK_ENDS, FLOAT_ENDS, FLOAT_FAILS, START_MINUTES } from '../../src/game/world.ts';
import { OUTDOORS } from '../../src/game/outdoors.ts';
import { GameMap, LEGEND } from '../../src/game/map.ts';
import type { EncounterDef, MapDef } from '../../src/game/map.ts';
import { NORTH, EAST, WEST } from '../../src/game/types.ts';
import type { Facing } from '../../src/game/types.ts';
import { MINUTES_PER_DAY } from '../../src/game/calendar.ts';
import { logLines } from '../../src/ui/frame.ts';
import { defaultParty, createCharacter, xpForLevel, levelUp, takePrestige, partyCan } from '../../src/game/party.ts';
import type { Character, Party } from '../../src/game/party.ts';
import type { MonsterDef } from '../../src/game/monsters.ts';
import { ok, local, withDefs } from './lib.ts';
import { tablesWith } from '../kit/headless.ts';
import type { Tables } from '../../src/game/tables.ts';

export function movement(): void {
  const rng = makeRng(7);
  const party = defaultParty(TABLES, rng);
  const world = new World(TABLES, buildMaps(), party, rng);
  ok(world.map.id === 'harrow' && world.state.x === 7 && world.state.y === 14, 'a new world starts in Helmstow at the gate');
  ok(world.hour === 7 && world.day === 1, `the clock starts on day 1 at 07:00 (${world.hour}:${world.minute})`);
  const r1 = world.move('forward');
  ok(r1.kind === 'moved' && world.state.y === 13, 'stepping forward moves north one cell');
  ok(world.state.minutes === 7 * 60 + 2, 'a town step takes two minutes');
  world.turn('left'); world.turn('left');
  ok(world.state.facing === 2, 'two left turns face south');
  const r2 = world.move('forward'); const r3 = world.move('forward');
  const out = local(world);
  ok(r2.kind === 'moved' && r3.kind === 'moved' && world.map.id === OUTDOORS && out.map === 'shelf' && out.x === 16 && out.y === 4 && world.state.facing === 2,
    `walking through the south gate arrives outdoors on the Foreland, facing south (${world.map.id}: ${out.map} ${out.x},${out.y})`);
  ok(world.explored(world.state.x, world.state.y) && world.explored(world.state.x, world.state.y + 2), 'arrival reveals the cells around and ahead');
  ok(world.here.name === 'The Foreland' && world.state.zones!.includes('shelf'), `outdoors the place is the zone (${world.here.name}), and the party has set foot in it`);
  // Leaving a business: back out of the doorway into the street, facing the door, no time passing.
  world.travel('harrow', 4, 4, 0);
  const at = world.state.minutes;
  ok(world.stepOut() && world.state.x === 4 && world.state.y === 5 && world.state.facing === 0 && world.state.minutes === at, 'leaving the inn steps back into the street, facing its door');
  world.travel('harrow', 12, 13, 1);
  ok(world.stepOut() && world.state.x === 12 && world.state.y === 14 && world.state.facing === 0, 'a party that strafed into the tavern leaves by its only open side, turned to the door');
  world.travel('shelf', 16, 4, 2);
  // Walls block.
  world.travel('mill', 1, 1, 0);
  const r4 = world.move('forward');
  ok(r4.kind === 'blocked', 'a wall blocks the way');
  // Locked door needs a key; the key opens it and is consumed: a company with no Lockpick standing,
  // its thief (born to Lockpick, #857) down for the two steps.
  const thief = party.members.find((m) => m.cls === 'thief')!;
  thief.conditions.push('dead');
  world.travel('mill', 6, 11, 1);
  const locked = world.move('forward');
  ok(locked.kind === 'blocked' && /Locked/.test(locked.reason), 'a locked door blocks without a key, with no Lockpick standing');
  party.bag.push('key_iron');
  const unlocked = world.move('forward');
  ok(unlocked.kind === 'moved' && world.map.at(7, 11).door === 'door' && !party.bag.includes('key_iron') && unlocked.messages.includes('The lock turns. The key crumbles.'), 'an iron key unlocks the door and is used up');
  ok(world.mapState.doors['7,11'] === 'door', 'the unlocked door is recorded for the save');
  thief.conditions.splice(thief.conditions.indexOf('dead'), 1);
  // Secret door: the party has an elf and a gnome, so the search always succeeds.
  world.travel('mill', 4, 6, 2);
  ok(world.map.at(4, 7).door === 'secret' && world.search() && world.map.at(4, 7).door === 'door', 'searching finds the secret door');
  // Water and mountains.
  world.travel('shelf', 12, 28, 2);
  ok(world.move('forward').kind === 'blocked' === !partyCan(party).swim, 'water is passable only with a swimmer (Tidefolk in the party)');
  world.travel('shelf', 30, 2, 1);
  const steep = world.move('forward');
  ok(steep.kind === 'blocked' && /steep/.test(steep.reason), 'mountains (the ridge between the Foreland and Thornmark) block without a mountaineer');
  // Where nothing is built yet the world ends, and nothing crosses into it, a mountaineer included:
  // north of the Downs, above the rim that is cut for good, the ring's mountain that closed the box
  // in, drawn as its author drew it and climbed by no one (#829).
  world.travel('downs_f2', 8, 1, 0);
  const edge = world.move('forward');
  ok(edge.kind === 'blocked' && edge.reason === 'Too steep for anyone to climb.' && local(world).y === 1, `north of the Downs the world ends in the ring's mountain, and the party cannot step into it (${edge.kind === 'blocked' ? edge.reason : edge.kind})`);
  // The world's end says what stands there: the sea off Kilnmouth's shore, where L5 is not built, and
  // the steppe past the Wold's road, where C9 is the reach's.
  world.travel(OUTDOORS, 392, 153, 3);
  const sea = world.move('forward');
  world.travel(OUTDOORS, 104, 275, 3);
  const land = world.move('forward');
  ok(sea.kind === 'blocked' && sea.reason === 'The water is far too deep.' && land.kind === 'blocked' && land.reason === 'There is no way on from here.', `the sea past the world's end is too deep and the land has no way on (${[sea, land].map((r) => (r.kind === 'blocked' ? r.reason : r.kind)).join('; ')})`);
  // West of the Foreland, the Downs: the ridge, and the Salt Road through a gap in it.
  world.travel('shelf', 1, 12, 3);
  const ridge = world.move('forward');
  ok(ridge.kind === 'blocked' && /steep/.test(ridge.reason), `west of the Foreland the ridge stands against the Downs (${ridge.kind === 'blocked' ? ridge.reason : ridge.kind})`);
  world.travel('shelf', 1, 29, 3);
  world.move('forward');
  const downs = world.move('forward');
  ok(local(world).map === 'downs_f2' && local(world).x === 31 && downs.kind === 'moved' && downs.messages.includes('The Salt Road climbs off the beach. Callow Downs. The land here is harder than the road behind.'), `the Salt Road walks west through the gap onto the Downs, and says so, a level under their floor (${downs.kind === 'moved' ? downs.messages.join(' / ') : downs.kind})`);
  party.flags.skill_mountaineer = 1;
  world.travel('shelf', 10, 1, 0);
  ok(world.move('forward').kind === 'blocked' && local(world).y === 1, 'not even over the mountains that closed the Foreland in to the north');
  delete party.flags.skill_mountaineer;
  // The pass to Thornmark is open to any company, a level-1 one with no flags among them, and the
  // Warden checkpoint on the road warns it on the way: walked, not jumped, the road runs on through
  // the ridge, the log says where the Foreland ends, then Thornmark greets the party as it always has.
  ok(party.members.every((m) => m.level === 1) && !Object.keys(party.flags).some((f) => f.startsWith('q_')), 'the company at the pass is level 1 and has done nothing for anyone');
  world.travel('shelf', 29, 9, 1);
  const said: string[] = [], steps: string[] = [];
  for (let i = 0; i < 4; i++) { const step = world.move('forward'); steps.push(step.kind); if (step.kind === 'moved') said.push(...step.messages); }
  const there = local(world);
  ok(steps.every((k) => k === 'moved') && world.map.id === OUTDOORS && there.map === 'thornmark' && there.x === 1 && there.y === 9, `four steps on the road reach Thornmark (${steps.join(', ')}; ${there.map} ${there.x},${there.y})`);
  const warn = said.findIndex((m) => /Warden checkpoint/.test(m) && /Thornmark/.test(m)), cross = said.findIndex((m) => m.startsWith('The pass opens onto old forest. Thornmark.'));
  ok(warn >= 0 && cross > warn && said.some((m) => /older than Helmstow/.test(m)), `the checkpoint warns the company before it crosses, and crossing into Thornmark says so (${said.join(' / ')})`);
  ok(world.here.name === 'Thornmark' && world.region === 'thornmark' && world.state.zones!.includes('thornmark'), 'the party has set foot in Thornmark, and its weather is Thornmark\'s');
  // Four levels under Thornmark's floor, the plain warning follows the arrival line in the same
  // entry of the log, which already names the place, and the two fit two lines.
  const arrived = said[cross] ?? '';
  ok(arrived === 'The pass opens onto old forest. Thornmark. Nothing here would spare you. The road behind is still open.' && logLines(arrived).length <= 2 && !said.includes('Thornmark.'),
    `crossing four levels under Thornmark's floor, the company is warned in the way's own line (${arrived}, ${logLines(arrived).length} lines)`);
  world.turn('back');
  const back = [world.move('forward'), world.move('forward')];
  ok(local(world).map === 'shelf' && back[1].kind === 'moved' && back[1].messages.includes('Back through the pass to the Foreland.') && world.region === 'shelf', 'back west through the pass it is the Foreland again');
  // Town Portal returns to the last town stood in.
  ok(world.townPortal() === 'Helmstow' && world.map.id === 'harrow', 'Town Portal goes to Helmstow before any other town is visited');
  world.travel('thornhold', 7, 14, 0); world.travel('grove2', 8, 8, 0);
  ok(world.townPortal() === 'Thornhold' && world.map.id === 'thornhold' && world.state.x === 7 && world.state.y === 14, 'Town Portal returns to the last town visited');
  // Dungeon stairs go down and come back up.
  world.travel('grove1', 11, 11, 0);
  const down = world.move('forward');
  ok(down.kind === 'moved' && world.map.id === 'grove2' && world.state.x === 1 && world.state.y === 1, 'the Grove Roots stairs go down to the Cut Stone');
  world.travel('greywater1', 14, 13, 2);
  const shrine = world.move('forward');
  ok(shrine.kind === 'moved' && world.map.id === 'greywater2' && world.state.x === 1 && world.state.y === 1, 'the Brandy Hole stairs go down to the Seam');
  // Helmstow's north gatehouse into the keep's ward and back, saying so and naming where the party
  // stands; and in from the Foreland road by the south gate.
  world.travel('harrow', 7, 1, 0);
  const into = world.move('forward');
  ok(into.kind === 'moved' && world.map.id === 'keep' && world.state.x === 7 && world.state.y === 8 && world.state.facing === 0 && into.messages.includes('You pass under the gatehouse into the keep\'s ward.') && world.here.name === 'The Keep',
    `the north gatehouse leads into the keep's ward, and says so (${world.map.id} ${world.state.x},${world.state.y}: ${world.here.name})`);
  world.turn('back');
  const outOf = world.move('forward');
  ok(outOf.kind === 'moved' && world.map.id === 'harrow' && world.state.x === 7 && world.state.y === 1 && world.state.facing === 2 && outOf.messages.includes('You pass back under the gatehouse into Helmstow.') && world.here.name === 'Helmstow',
    `and back out into Helmstow, facing south (${world.map.id} ${world.state.x},${world.state.y}: ${world.here.name})`);
  world.travel('shelf', 16, 4, 0);
  const home = world.move('forward');
  ok(home.kind === 'moved' && world.map.id === 'harrow' && world.state.x === 7 && world.state.y === 14 && home.messages.includes('You enter Helmstow.'), `from the Foreland road the south gate leads back into Helmstow (${world.map.id} ${world.state.x},${world.state.y})`);
  // The chasm: a step into it is refused with a line of its own, as the sea is; a glass tree blocks
  // as a tree does. Laid on the Foreland and taken up.
  world.travel('shelf', 16, 16, 0);
  const m = world.map, stood = world.state.y, ahead = m.width * (stood - 1) + world.state.x, kept = m.cells[ahead];
  m.cells[ahead] = { ...LEGEND.v, ch: 'v' };
  const drop = world.move('forward');
  // The glass tree is tried from where the party stood, whatever the chasm's step did.
  world.travel('shelf', 16, 16, 0);
  m.cells[ahead] = { ...LEGEND.c, ch: 'c' };
  const glass = world.move('forward');
  m.cells[ahead] = kept;
  // A group aware of the party across the chasm stays on its side; across open ground it comes on.
  world.travel('shelf', 16, 16, 0);
  const g = world.liveGroups().find((q) => q.def.roams !== false)!, was = { x: g.state.x, y: g.state.y };
  const px = world.state.x, py = world.state.y, gap = [py - 1, py - 2].map((y) => y * m.width + px), under = gap.map((i) => m.cells[i]);
  const approach = (ch: string): number => {
    for (const i of gap) m.cells[i] = { ...LEGEND[ch], ch };
    g.state.x = px; g.state.y = py - 3; world.state.truce = 0;
    world.moveMonsters();
    return g.state.y;
  };
  const acrossChasm = approach('v'), acrossGround = approach(',');
  gap.forEach((i, j) => { m.cells[i] = under[j]; });
  g.state.x = was.x; g.state.y = was.y;
  ok(drop.kind === 'blocked' && drop.reason === 'The ground falls away. There is no way down here.' && world.state.y === stood, `a step into the chasm is refused, and says so (${drop.kind === 'blocked' ? drop.reason : drop.kind})`);
  ok(glass.kind === 'blocked' && glass.reason === 'Something blocks the way.', `a glass tree blocks the way (${glass.kind === 'blocked' ? glass.reason : glass.kind})`);
  ok(acrossChasm === py - 3 && acrossGround === py - 2, `a group aware of the party does not step into the chasm, and across open ground comes on (${py - acrossChasm} and ${py - acrossGround} squares off)`);
  // The map spells (DESIGN §7): Walk on Water bears a company with no swimmer over shallow water for
  // its steps, Levitate floats it over the chasm and never leaves it there, and Waymark returns to a
  // mark set outdoors. Laid on the Foreland and taken up.
  {
    world.travel('shelf', 16, 16, 0);
    const sx = world.state.x, sy = world.state.y, strip = [1, 2, 3].map((d) => m.width * (sy - d) + sx), under = strip.map((i) => m.cells[i]);
    const lay = (ch: string, n: number): void => strip.forEach((i, k) => { m.cells[i] = k < n ? { ...LEGEND[ch], ch } : under[k]; });
    const maren = party.members.find((q) => q.race === 'tidefolk')!;
    maren.race = 'human';
    lay('~', 3);
    world.travel('shelf', 16, 16, 0);
    const wet = world.move('forward').kind;
    world.bear('walk');
    const waded = [1, 2, 3].map(() => world.move('forward').kind).join();
    const left = world.state.walk;
    world.state.walk = 1;
    world.travel('shelf', 16, 16, 0);
    const last = world.move('forward');
    world.bear('walk'); world.endWalk();
    const fought = world.state.walk;
    maren.race = 'tidefolk';
    ok(wet === 'blocked' && waded === 'moved,moved,moved' && left === WALK_STEPS - 3, `with no swimmer the water is refused; Walk on Water bears the company over it, a step at a time (${wet}; ${waded}; ${left} left)`);
    ok(last.kind === 'moved' && last.messages.includes(WALK_ENDS) && fought === undefined, 'it says so when its steps run out, and a fight ends it');
    lay('v', 2);
    world.travel('shelf', 16, 16, 0);
    const fall = world.move('forward');
    world.bear('float');
    const floated = [1, 2, 3].map(() => world.move('forward').kind).join(), landed = world.state.y === sy - 3;
    world.travel('shelf', 16, 16, 0); world.state.float = 2;
    const first = world.move('forward').kind, second = world.move('forward');
    world.state.float = 1;
    const ends = world.move('back');
    ok(fall.kind === 'blocked' && floated === 'moved,moved,moved' && landed, `the chasm is refused, and Levitate floats the company over it (${floated})`);
    ok(first === 'moved' && second.kind === 'blocked' && second.reason === FLOAT_FAILS && ends.kind === 'moved' && ends.messages.includes(FLOAT_ENDS) && world.state.float === 0, `Levitate never leaves the company over the drop when it fails, and says when it ends (${second.kind === 'blocked' ? second.reason : second.kind})`);
    lay(',', 0);
    world.travel('shelf', 16, 16, 0);
    const sand = m.width * sy + sx, ground = m.cells[sand];
    m.cells[sand] = { ...LEGEND[';'], ch: ';' };
    const tidal = world.canMark();
    m.cells[sand] = ground;
    const set = world.setMark(), mark = { ...world.state.mark! };
    world.travel('harrow', 7, 10, 0);
    const indoors = world.canMark() || world.setMark();
    const back = world.toMark();
    ok(!tidal && set && !indoors && back && world.state.mapId === mark.mapId && world.state.x === mark.x && world.state.y === mark.y && world.state.mark?.x === mark.x, 'Waymark sets its mark outdoors, not on tidal ground nor in a town, and returns to it from anywhere');
    delete world.state.mark;
  }
  // Tidal ground: walked at low water; at high water refused with its own line, unless someone
  // swims, and a group keeps off it. Laid on the Foreland and taken up; the clock set to each tide.
  {
    world.travel('shelf', 16, 16, 0);
    const day = Math.floor(world.state.minutes / MINUTES_PER_DAY) * MINUTES_PER_DAY, sx = world.state.x, sy = world.state.y;
    const flat = m.width * (sy - 1) + sx, under = m.cells[flat];
    m.cells[flat] = { ...LEGEND[';'], ch: ';' };
    const maren = party.members.find((q) => q.race === 'tidefolk')!;
    const step = (hour: number, swims: boolean): { kind: string; reason?: string; y: number } => {
      world.travel('shelf', 16, 16, 0);
      world.state.minutes = day + hour * 60;
      maren.race = swims ? 'tidefolk' : 'human';
      const r = world.move('forward');
      maren.race = 'tidefolk';
      return { kind: r.kind, reason: r.kind === 'blocked' ? r.reason : undefined, y: world.state.y };
    };
    const low = step(11, false), high = step(5, false), wade = step(5, true);
    // A group across the flat at high water stays on its side, and at low water comes on.
    world.travel('shelf', 16, 16, 0);
    const g = world.liveGroups().find((q) => q.def.roams !== false)!, was = { x: g.state.x, y: g.state.y };
    const across = (hour: number): number => {
      world.state.minutes = day + hour * 60;
      g.state.x = sx; g.state.y = sy - 2; world.state.truce = 0;
      world.moveMonsters();
      return g.state.y;
    };
    const atHigh = across(5), atLow = across(11);
    g.state.x = was.x; g.state.y = was.y;
    m.cells[flat] = under;
    ok(low.kind === 'moved' && low.y === sy - 1, `at low water a company walks onto tidal ground (${low.kind} at 11:00)`);
    ok(high.kind === 'blocked' && high.reason === 'The tide is in. The sands will show again.' && high.y === sy, `at high water it is refused, and told the sea will go out (${high.reason ?? high.kind} at 05:00)`);
    ok(wade.kind === 'moved' && wade.y === sy - 1, `a company with a swimmer wades it at high water (${wade.kind})`);
    ok(atHigh === sy - 2 && atLow === sy - 1, `a group keeps off tidal ground at high water and crosses it at low (${sy - atHigh} and ${sy - atLow} squares off)`);
  }
  // The tide turning is said where the flats are in sight, and nowhere else.
  {
    world.travel('shelf', 16, 16, 0);
    const day = Math.floor(world.state.minutes / MINUTES_PER_DAY) * MINUTES_PER_DAY, sx = world.state.x, sy = world.state.y;
    const flat = m.width * (sy - 3) + sx + 1, under = m.cells[flat];
    const turning = (laid: boolean, hour: number): string[] => {
      if (laid) m.cells[flat] = { ...LEGEND[';'], ch: ';' };
      world.travel('shelf', 16, 16, 2);
      world.state.minutes = day + hour * 60 - 3;
      const r = world.move('forward');
      m.cells[flat] = under;
      return r.kind === 'moved' ? r.messages : [];
    };
    const comes = turning(true, 4), goes = turning(true, 8), unseen = turning(false, 16);
    ok(comes.includes('The tide has turned. The sea comes in over the sand.') && goes.includes('The tide has turned. The sea draws off the sand.'), `the tide turning is said near the flats, coming in at 04:00 and going out at 08:00 (${comes.concat(goes).join(' / ')})`);
    ok(!unseen.some((t) => t.includes('tide')), 'and not where there are none');
  }
  underIce();
  range();
  farSide();
  opened();
  paced();
  picked();
  archdruid();
}

/**
 * Cliffs and peaks (#543), with a road cut between them: a step into a peak or a cliff is refused as
 * one into the mountain is, a Mountaineer climbs onto either, and anyone walks the road.
 */
function range(): void {
  const cut: MapDef = { id: 'fx_cut', name: 'Cut', kind: 'outdoor', region: 'shelf', start: { x: 2, y: 2, facing: NORTH }, rows: ['MMMMM', 'MA=|M', 'MA=|M', 'MMMMM'] };
  const rng = makeRng(13), party = defaultParty(TABLES, rng), w = new World(TABLES, { fx_cut: new GameMap(cut) }, party, rng);
  const step = (f: Facing): string => { w.travel('fx_cut', 2, 2, f); const r = w.move('forward'); return r.kind === 'blocked' ? r.reason : `${r.kind} ${w.state.x},${w.state.y}`; };
  const peak = step(WEST), cliff = step(EAST), road = step(NORTH);
  party.flags.skill_mountaineer = 1;
  const climbed = [step(WEST), step(EAST)];
  delete party.flags.skill_mountaineer;
  ok(peak === 'Too steep to climb without a Mountaineer.' && cliff === peak && road === 'moved 2,1', `a step into a peak or a cliff is refused as one into the mountain is, and the road between them is walked (${peak} / ${cliff} / ${road})`);
  ok(climbed.join(' / ') === 'moved 1,2 / moved 3,2', `a Mountaineer climbs onto either (${climbed.join(' / ')})`);
}

/**
 * A group placed on ice (#536), on a frozen lake with a shore along its south: the pike under the
 * ice strikes a company on the ice beside it and lets one on the shore beside it walk by. One that
 * roams comes on under the ice and no further, and its fight is told it is under the ice.
 */
function underIce(): void {
  const lake = (pike: Partial<EncounterDef>): MapDef => ({
    id: 'fx_lake', name: 'Lake', kind: 'outdoor', region: 'shelf', start: { x: 1, y: 3, facing: NORTH },
    rows: ['MMMMMMMM', 'M,iiii,M', 'M,iiii,M', 'M,,,,,,M', 'MMMMMMMM'],
    encounters: [{ id: 'pike', x: 3, y: 2, monsters: ['fen_eel', 'fen_eel'], roams: false, under: 'ice', ...pike }],
  });
  const rng = makeRng(11);
  const at = (def: MapDef, x: number, y: number, f: Facing): World => { const w = new World(TABLES, { fx_lake: new GameMap(def) }, defaultParty(TABLES, rng), rng); w.travel('fx_lake', x, y, f); return w; };
  const step = (def: MapDef, x: number, y: number, f: Facing): string[] => { const r = at(def, x, y, f).move('forward'); return r.kind === 'moved' ? r.encounter ?? [] : ['blocked']; };
  const onIce = step(lake({}), 5, 2, WEST), onShore = step(lake({}), 2, 3, EAST), dry = step(lake({ under: undefined }), 2, 3, EAST);
  ok(onIce.join() === 'pike', `a pike under the ice strikes a company that steps onto the ice beside it (${onIce.join() || 'nothing'})`);
  ok(!onShore.length && dry.join() === 'pike', `and lets one on the shore beside it walk by, where a group on the ice that is not under it comes on (${onShore.join() || 'nothing'}; ${dry.join() || 'nothing'})`);
  // One that roams comes on under the ice toward a company on the shore, to the ice's edge and no further.
  const w = at(lake({ x: 2, y: 1, roams: true, aware: 8 }), 6, 3, NORTH), g = w.liveGroups()[0], path: string[] = [];
  for (let k = 0; k < 6; k++) { w.moveMonsters(); path.push(`${g.state.x},${g.state.y}`); }
  ok(path.every((p) => { const [x, y] = p.split(',').map(Number); return w.map.at(x, y).terrain === 'ice'; }) && path.at(-1) === '5,2', `a roaming pike comes on under the ice and stops at its edge (${path.join(' ')})`);
  ok(w.groupDefs(['pike'])[0].under === 'ice', 'and its fight is told it fights from under the ice');
}

/**
 * The far side's ground (#543): the steppe, the dunes and the vines are walked; a step into the
 * volcano or a vent in it is refused as one into the mountain is, and a Mountaineer climbs onto either.
 */
function farSide(): void {
  const def: MapDef = { id: 'fx_far', name: 'Far', kind: 'outdoor', region: 'shelf', start: { x: 2, y: 2, facing: NORTH }, rows: ['MMMMM', 'MVs@M', 'Mu&uM', 'MMMMM'] };
  const rng = makeRng(17), party = defaultParty(TABLES, rng), w = new World(TABLES, { fx_far: new GameMap(def) }, party, rng);
  const step = (x: number, y: number, f: Facing): string => { w.travel('fx_far', x, y, f); const r = w.move('forward'); return r.kind === 'blocked' ? r.reason : `${r.kind} ${w.state.x},${w.state.y}`; };
  const walked = [step(2, 2, NORTH), step(2, 2, WEST), step(1, 2, EAST)], refused = [step(2, 1, WEST), step(2, 1, EAST)];
  party.flags.skill_mountaineer = 1;
  const climbed = [step(2, 1, WEST), step(2, 1, EAST)];
  delete party.flags.skill_mountaineer;
  ok(walked.join(' / ') === 'moved 2,1 / moved 1,2 / moved 2,2', `the steppe, the dunes and the vines are walked (${walked.join(' / ')})`);
  ok(refused.every((r) => r === 'Too steep to climb without a Mountaineer.') && climbed.join(' / ') === 'moved 1,1 / moved 3,1', `a step into the volcano or a vent is refused as one into the mountain is, and a Mountaineer climbs onto either (${refused.join(' / ')}; ${climbed.join(' / ')})`);
}

/**
 * The skills that open the map (#805), on a strip with a mountain to its west, water to its east and
 * the sea to its north: a company with a Mountaineer standing climbs the mountain and one with him
 * down does not; one with a Swimmer standing swims the water and one with her down does not; neither
 * does the other's work and nobody crosses the sea; a Tidefolk swims by their people, with no skill;
 * and the flags that grant each still do.
 */
function opened(): void {
  const def: MapDef = { id: 'fx_skills', name: 'Skills', kind: 'outdoor', region: 'shelf', start: { x: 2, y: 1, facing: NORTH }, rows: ['WWWWW', 'WM.~W', 'WWWWW'] };
  // The company of six without its one Tidefolk (Maren), raised as `setup` has it; then a step west, east and north from the middle.
  const steps = (setup: (p: Party) => void): string => {
    const rng = makeRng(19), party = defaultParty(TABLES, rng), w = new World(TABLES, { fx_skills: new GameMap(def) }, party, rng);
    party.members[4].race = 'human';
    setup(party);
    return [WEST, EAST, NORTH].map((f) => { w.travel('fx_skills', 2, 1, f); return w.move('forward').kind; }).join();
  };
  const cases: [string, (p: Party) => void, string][] = [
    ['no skill and no Tidefolk', () => undefined, 'blocked,blocked,blocked'],
    ['a Mountaineer standing', (p) => { p.members[0].skills = ['mountaineer']; }, 'moved,blocked,blocked'],
    ['the Mountaineer down, the other five standing', (p) => { p.members[0].skills = ['mountaineer']; p.members[0].conditions.push('unconscious'); }, 'blocked,blocked,blocked'],
    ['a Swimmer standing', (p) => { p.members[3].skills = ['swimmer']; }, 'blocked,moved,blocked'],
    ['the Swimmer down, the other five standing', (p) => { p.members[3].skills = ['swimmer']; p.members[3].conditions.push('dead'); }, 'blocked,blocked,blocked'],
    ['a Mountaineer and a Swimmer standing', (p) => { p.members[0].skills = ['mountaineer']; p.members[3].skills = ['swimmer']; }, 'moved,moved,blocked'],
    ['a Tidefolk standing, with no skill', (p) => { p.members[4].race = 'tidefolk'; }, 'blocked,moved,blocked'],
    ['the Tidefolk down, with no skill', (p) => { p.members[4].race = 'tidefolk'; p.members[4].conditions.push('stoned'); }, 'blocked,blocked,blocked'],
    ['the flags set, and nobody with a skill', (p) => { p.flags.skill_mountaineer = 1; p.flags.skill_swim = 1; }, 'moved,moved,blocked'],
  ];
  for (const [who, setup, want] of cases) {
    const got = steps(setup);
    ok(got === want, `${who}: a step west into the mountain, east into the water and north into the sea comes to ${got}${got === want ? '' : ` (wanted ${want})`}`);
  }
}

/**
 * Pathfinder (#857): a step onto hills, ash or dunes, or through deep snow, costs the company with a
 * Pathfinder standing the road's six minutes, and no more; without one, eight, and ten onto hills in
 * deep snow, as before. A strip of open ground in Thornmark's weather, the square ahead made over to
 * each ground in turn, on a dry day and in deep snow; the premade six, whose ranger is born to it,
 * with the ranger standing, with the ranger down, and with the ranger down and Pathfinder learnt.
 */
function paced(): void {
  const def: MapDef = { id: 'fx_pace', name: 'Pace', kind: 'outdoor', region: 'thornmark', start: { x: 1, y: 1, facing: EAST }, rows: ['MMMM', 'M,,M', 'MMMM'] };
  const rng = makeRng(31), seed = new World(TABLES, { fx_pace: new GameMap(def) }, defaultParty(TABLES, rng), rng).state.weatherSeed!;
  const dry = findWeather(seed, START_MINUTES, CLIMATES.thornmark, (w) => w.cover === 0 && w.precip === 0);
  const snow = findWeather(seed, START_MINUTES, CLIMATES.thornmark, (w) => w.cover >= 0.5);
  const GROUND = ['hills', 'ash', 'dunes', 'pine'] as const;
  /** Minutes a step east takes onto each ground, dry and then in deep snow, for the company `setup` makes. */
  const steps = (setup: (p: Party) => void): string => {
    const r = makeRng(31), p = defaultParty(TABLES, r), w = new World(TABLES, { fx_pace: new GameMap(def) }, p, r);
    setup(p);
    return [dry, snow].map((at) => GROUND.map((t) => {
      w.travel('fx_pace', 1, 1, EAST); w.state.minutes = at; w.map.at(2, 1).terrain = t;
      const b = w.state.minutes;
      return w.move('forward').kind === 'moved' ? w.state.minutes - b : -1;
    }).join(' ')).join(' / ');
  };
  const ranger = (p: Party): Character => p.members.find((m) => m.cls === 'ranger')!;
  const slow = `8 8 8 6 / ${8 + SNOW_DRAG} ${8 + SNOW_DRAG} ${8 + SNOW_DRAG} ${6 + SNOW_DRAG}`, road = '6 6 6 6 / 6 6 6 6';
  const cases: [string, (p: Party) => void, string][] = [
    ['the ranger standing, born to Pathfinder', () => undefined, road],
    ['the ranger down, nobody else with it', (p) => { ranger(p).conditions.push('dead'); }, slow],
    ['the ranger down, Pathfinder learnt by the knight', (p) => { ranger(p).conditions.push('dead'); p.members[0].skills = ['pathfinder']; }, road],
    ['the ranger made a knight, nobody with it', (p) => { ranger(p).cls = 'knight'; }, slow],
  ];
  ok(snow > 0 && dry > 0, 'a dry day and a day of deep snow found in Thornmark');
  for (const [who, setup, want] of cases) {
    const got = steps(setup);
    ok(got === want, `${who}: a step onto hills, ash, dunes and pine takes ${got} minutes, dry / in deep snow${got === want ? '' : ` (wanted ${want})`}`);
  }
}

/**
 * Lockpick (#857), at an iron-key door: with a Lockpick standing, or a set of picks carried, the door
 * opens with no key, and a key carried is kept; with neither, a key opens it and is spent, and without
 * one it stays locked. The premade six, whose thief is born to it; a set of picks is a fixture item
 * that does the skill's work carried (`ItemDef.skill`), as a copybook does Linguist's.
 */
function picked(): void {
  const def: MapDef = { id: 'fx_lock', name: 'Lock', kind: 'dungeon', region: 'shelf', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#.L.#', '#####'] };
  const picks: ItemDef = { id: 'fx_picks', name: 'A Set of Picks', slot: 'none', price: 750, skill: 'lockpick' };
  const thief = (p: Party): Character => p.members.find((m) => m.cls === 'thief')!;
  /** A step east into the door for the company `setup` makes: what happens, the line said, the keys left and the door after. */
  const tries = (setup: (p: Party) => void, t: Tables = TABLES): string => {
    const r = makeRng(37), p = defaultParty(t, r), w = new World(t, { fx_lock: new GameMap(def) }, p, r);
    setup(p);
    w.travel('fx_lock', 1, 1, EAST);
    const m = w.move('forward'), keys = p.bag.filter((i) => i === 'key_iron').length;
    return `${m.kind === 'moved' ? m.messages.join(' ') : m.kind === 'blocked' ? m.reason : m.kind} | ${keys} | ${w.map.at(2, 1).door}${w.mapState.doors['2,1'] ? ' kept' : ''}`;
  };
  const down = (p: Party): void => { thief(p).conditions.push('dead'); };
  {
    const lent = tablesWith([picks]);
    const cases: [string, (p: Party) => void, string][] = [
      ['the thief standing, born to Lockpick, no key', () => undefined, 'Ottilie picks the lock. | 0 | door kept'],
      ['the thief standing, a key carried', (p) => { p.bag.push('key_iron'); }, 'Ottilie picks the lock. | 1 | door kept'],
      ['the thief down, a key carried', (p) => { down(p); p.bag.push('key_iron'); }, 'The lock turns. The key crumbles. | 0 | door kept'],
      ['the thief down, no key', down, 'Locked. A key would open it. | 0 | locked'],
      ['the thief down, Lockpick learnt by the knight', (p) => { down(p); p.members[0].skills = ['lockpick']; p.bag.push('key_iron'); }, 'Bram picks the lock. | 1 | door kept'],
      ['the thief down, a set of picks in the cleric\'s pack', (p) => { down(p); p.members[4].pack.push(picks.id); }, 'Maren picks the lock. | 0 | door kept'],
      ['the thief down, a set of picks in the bag and a key', (p) => { down(p); p.bag.push(picks.id, 'key_iron'); }, 'Bram picks the lock. | 1 | door kept'],
    ];
    for (const [who, setup, want] of cases) {
      const got = tries(setup, lent);
      ok(got === want, `${who}: a step into the iron-key door says "${got}"${got === want ? '' : ` (wanted "${want}")`}`);
    }
  }
  const gone = tries((p) => { down(p); p.bag.push('fx_picks'); });
  ok(gone.startsWith('Locked.'), `and with the picks no item of the content, the company's set does nothing ("${gone}")`);
}

/**
 * The Archdruid's perk (#809, DESIGN §5): a group of beasts alone, each of a level under a standing
 * druid of the third prestige in the company, does not step toward it, and is fought as any group
 * is where the company steps up to it. Laid on a strip of open ground with the group five squares
 * off; its beasts, its person and its caller are rats made over to the kind and level asked, so no
 * retune of the content moves this.
 */
function archdruid(): void {
  const rng = makeRng(23);
  const strip = (group: Partial<EncounterDef>): MapDef => ({
    id: 'fx_strip', name: 'Strip', kind: 'outdoor', region: 'shelf', start: { x: 1, y: 1, facing: EAST },
    rows: ['MMMMMMMMM', 'M,,,,,,,M', 'MMMMMMMMM'],
    encounters: [{ id: 'beasts', x: 6, y: 1, monsters: ['fx_beast20', 'fx_beast20'], aware: 8, ...group }],
  });
  /** A member at 27 with the first `took` of its prestiges taken. */
  const raised = (c: Character, took = 3): Character => { c.xp = xpForLevel(27); levelUp(c, rng); for (let n = 0; n < took; n++) takePrestige(c); return c; };
  /** The premade six, a druid of 27 for its sorcerer: an Archdruid with all three prestiges, a Thornspeaker with two. */
  const withDruid = (took = 3): Party => { const p = defaultParty(TABLES, rng); p.members[5] = raised(createCharacter(TABLES, 'Kenver', 'human', 'druid', {}, rng), took); return p; };
  /** The premade six with no druid, its cleric an Exarch of 27: a third prestige, but not the druid's. */
  const withExarch = (): Party => { const p = defaultParty(TABLES, rng); raised(p.members[4]); return p; };
  /** How many squares of three steps the group makes toward the company. */
  const closes = (party: Party, group: Partial<EncounterDef> = {}): number => {
    const w = new World(TABLES, { fx_strip: new GameMap(strip(group)) }, party, rng);
    w.travel('fx_strip', 1, 1, EAST);
    const g = w.liveGroups()[0], from = g.state.x;
    for (let k = 0; k < 3; k++) w.moveMonsters();
    return from - g.state.x;
  };
  const laid: MonsterDef[] = [
    ...[20, 28].map((level) => ({ ...MONSTERS.rat, id: `fx_beast${level}`, level })),
    { ...MONSTERS.rat, id: 'fx_person20', kind: 'person', level: 20 },
    { ...MONSTERS.rat, id: 'fx_caller20', level: 20, calls: { monsters: ['fx_beast20'], chance: 0.5 } },
  ];
  withDefs(MONSTERS, laid, () => {
    // The company walks up to the group that stayed put: nothing beside it for three steps, then the fight.
    const w = new World(TABLES, { fx_strip: new GameMap(strip({})) }, withDruid(), rng);
    w.travel('fx_strip', 1, 1, EAST);
    const walked = [1, 2, 3, 4].map(() => { const r = w.move('forward'); return r.kind === 'moved' ? r.encounter?.join() ?? '' : r.kind; });
    const held = closes(withDruid()), down = withDruid();
    ok(held === 0 && walked.join('|') === '|||beasts' && w.liveGroups()[0].state.x === 6,
      `a group of level 20 beasts does not close in on an Archdruid of 27, and is fought where the company steps up to it (${held} squares of 3; fight on step ${walked.indexOf('beasts') + 1})`);
    const higher = closes(withDruid(), { monsters: ['fx_beast28', 'fx_beast28'] });
    ok(higher === 3, `a group of level 28 beasts comes on (${higher} squares of 3)`);
    down.members[5].conditions = ['unconscious'];
    const fallen = closes(down);
    ok(fallen === 3, `with the druid down the level 20 group comes on (${fallen} squares of 3)`);
    const led = closes(withDruid(), { leader: 'fx_beast20' });
    ok(led === 3, `a group with a leader comes on (${led} squares of 3)`);
    const none = closes(withExarch());
    ok(none === 3, `for a company with no druid, its cleric an Exarch of 27, the level 20 group comes on (${none} squares of 3)`);
    const second = closes(withDruid(2));
    ok(second === 3, `a Thornspeaker of 27, a druid of the second prestige only, does not keep the level 20 group off (${second} squares of 3)`);
    const people = closes(withDruid(), { monsters: ['fx_person20', 'fx_person20'] }), mixed = closes(withDruid(), { monsters: ['fx_beast20', 'fx_person20'] });
    ok(people === 3 && mixed === 3, `a group of people, or of a beast and a person, comes on though the Archdruid stands (${people} and ${mixed} squares of 3)`);
    const called = closes(withDruid(), { monsters: ['fx_caller20'] });
    ok(called === 3, `a beast that calls comes on though the Archdruid stands (${called} squares of 3)`);
  });
}
