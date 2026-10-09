// Moving about: steps and the clock, doors, keys and secrets, water and mountains, the end of the
// world, the open pass walked into Thornmark and back, Town Portal, the stairs, Helmstow's two
// gates, a group under the ice, the road cut through cliffs and peaks and the far side's ground.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { World, WALK_STEPS, WALK_ENDS, FLOAT_ENDS, FLOAT_FAILS } from '../../src/game/world.ts';
import { OUTDOORS } from '../../src/game/outdoors.ts';
import { GameMap, LEGEND } from '../../src/game/map.ts';
import type { EncounterDef, MapDef } from '../../src/game/map.ts';
import { NORTH, EAST, WEST } from '../../src/game/types.ts';
import type { Facing } from '../../src/game/types.ts';
import { MINUTES_PER_DAY } from '../../src/game/calendar.ts';
import { logLines } from '../../src/ui/frame.ts';
import { defaultParty, partyCan } from '../../src/game/party.ts';
import { ok, local } from './lib.ts';

export function movement(): void {
  const rng = makeRng(7);
  const party = defaultParty(rng);
  const world = new World(buildMaps(), party, rng);
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
  // Locked door needs a key; the key opens it and is consumed.
  world.travel('mill', 6, 11, 1);
  const locked = world.move('forward');
  ok(locked.kind === 'blocked' && /Locked/.test(locked.reason), 'a locked door blocks without a key');
  party.bag.push('key_iron');
  const unlocked = world.move('forward');
  ok(unlocked.kind === 'moved' && world.map.at(7, 11).door === 'door' && !party.bag.includes('key_iron'), 'an iron key unlocks the door and is used up');
  ok(world.mapState.doors['7,11'] === 'door', 'the unlocked door is recorded for the save');
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
  // north of the Foreland, above the rim that is cut for good.
  world.travel('downs_f2', 8, 1, 0);
  const edge = world.move('forward');
  ok(edge.kind === 'blocked' && edge.reason === 'The world ends here.' && local(world).y === 1, `north of the Downs the world ends, and the party cannot step into it (${edge.kind === 'blocked' ? edge.reason : edge.kind})`);
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
}

/**
 * Cliffs and peaks (#543), with a road cut between them: a step into a peak or a cliff is refused as
 * one into the mountain is, a Mountaineer climbs onto either, and anyone walks the road.
 */
function range(): void {
  const cut: MapDef = { id: 'fx_cut', name: 'Cut', kind: 'outdoor', start: { x: 2, y: 2, facing: NORTH }, rows: ['MMMMM', 'MA=|M', 'MA=|M', 'MMMMM'] };
  const rng = makeRng(13), party = defaultParty(rng), w = new World({ fx_cut: new GameMap(cut) }, party, rng);
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
    id: 'fx_lake', name: 'Lake', kind: 'outdoor', start: { x: 1, y: 3, facing: NORTH },
    rows: ['MMMMMMMM', 'M,iiii,M', 'M,iiii,M', 'M,,,,,,M', 'MMMMMMMM'],
    encounters: [{ id: 'pike', x: 3, y: 2, monsters: ['fen_eel', 'fen_eel'], roams: false, under: 'ice', ...pike }],
  });
  const rng = makeRng(11);
  const at = (def: MapDef, x: number, y: number, f: Facing): World => { const w = new World({ fx_lake: new GameMap(def) }, defaultParty(rng), rng); w.travel('fx_lake', x, y, f); return w; };
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
  const def: MapDef = { id: 'fx_far', name: 'Far', kind: 'outdoor', start: { x: 2, y: 2, facing: NORTH }, rows: ['MMMMM', 'MVs@M', 'Mu&uM', 'MMMMM'] };
  const rng = makeRng(17), party = defaultParty(rng), w = new World({ fx_far: new GameMap(def) }, party, rng);
  const step = (x: number, y: number, f: Facing): string => { w.travel('fx_far', x, y, f); const r = w.move('forward'); return r.kind === 'blocked' ? r.reason : `${r.kind} ${w.state.x},${w.state.y}`; };
  const walked = [step(2, 2, NORTH), step(2, 2, WEST), step(1, 2, EAST)], refused = [step(2, 1, WEST), step(2, 1, EAST)];
  party.flags.skill_mountaineer = 1;
  const climbed = [step(2, 1, WEST), step(2, 1, EAST)];
  delete party.flags.skill_mountaineer;
  ok(walked.join(' / ') === 'moved 2,1 / moved 1,2 / moved 2,2', `the steppe, the dunes and the vines are walked (${walked.join(' / ')})`);
  ok(refused.every((r) => r === 'Too steep to climb without a Mountaineer.') && climbed.join(' / ') === 'moved 1,1 / moved 3,1', `a step into the volcano or a vent is refused as one into the mountain is, and a Mountaineer climbs onto either (${refused.join(' / ')}; ${climbed.join(' / ')})`);
}
