// Moving about: steps and the clock, doors, keys and secrets, water and mountains, the end of the
// world, the open pass walked into Thornmark and back, Town Portal, the stairs, and Helmstow's two
// gates.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { World } from '../../src/game/world.ts';
import { OUTDOORS } from '../../src/game/outdoors.ts';
import { LEGEND } from '../../src/game/map.ts';
import { MINUTES_PER_DAY } from '../../src/game/calendar.ts';
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
  ok(local(world).map === 'downs_f2' && local(world).x === 31 && downs.kind === 'moved' && downs.messages.includes('The Salt Road climbs off the beach. Callow Downs.'), `the Salt Road walks west through the gap onto the Downs, and says so (${downs.kind === 'moved' ? downs.messages.join(' / ') : downs.kind})`);
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
  const warn = said.findIndex((m) => /Warden checkpoint/.test(m) && /Thornmark/.test(m)), cross = said.indexOf('The pass opens onto old forest. Thornmark.');
  ok(warn >= 0 && cross > warn && said.some((m) => /older than Helmstow/.test(m)), `the checkpoint warns the company before it crosses, and crossing into Thornmark says so (${said.join(' / ')})`);
  ok(world.here.name === 'Thornmark' && world.region === 'thornmark' && world.state.zones!.includes('thornmark'), 'the party has set foot in Thornmark, and its weather is Thornmark\'s');
  // Four levels under Thornmark's floor, the arrival line is followed by the plain warning, and the
  // line said already names the place.
  const feel = said.indexOf('Nothing here would spare you. The road behind is still open.');
  ok(feel === cross + 1 && !said.includes('Thornmark.'), `crossing four levels under Thornmark's floor, the company is warned after the way's own line (${said.slice(cross).join(' / ')})`);
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
}
