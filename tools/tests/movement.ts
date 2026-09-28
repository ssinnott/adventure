// Moving about: steps and the clock, doors, keys and secrets, water and mountains, the end of the
// world, the open pass walked into Thornmark and back, Town Portal and the stairs.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { World } from '../../src/game/world.ts';
import { OUTDOORS } from '../../src/game/outdoors.ts';
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
  const into = world.move('forward');
  ok(local(world).map === 'downs_f2' && local(world).x === 31 && into.kind === 'moved' && into.messages.includes('The Salt Road climbs off the beach onto the Downs.'), `the Salt Road walks west through the gap onto the Downs, and says so (${into.kind === 'moved' ? into.messages.join(' / ') : into.kind})`);
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
}
