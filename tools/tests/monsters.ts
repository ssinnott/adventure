// Monster groups on the map: stepping toward the party, encounters, respawn, the truce after
// fleeing, and the Cut Stone's tear closing on the Warden's death.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { World } from '../../src/game/world.ts';
import { defaultParty } from '../../src/game/party.ts';
import { ok } from './lib.ts';

export function monsters(): void {
  const rng = makeRng(3);
  const party = defaultParty(rng);
  const world = new World(buildMaps(), party, rng);
  world.travel('shelf', 16, 4, 2);
  const shelf = world.zone!;
  const rats = world.liveGroups().find((g) => g.def.id === 'road_rats')!;
  ok(rats.state.x === shelf.x + 16 && rats.state.y === shelf.y + 7, 'the road rats start where the Shelf puts them, on the outdoors');
  const r = world.move('forward');
  ok(rats.state.y === shelf.y + 6, `an aware group steps toward the party (${rats.state.x - shelf.x},${rats.state.y - shelf.y} on the Shelf)`);
  ok(r.kind === 'moved' && !!r.encounter && r.encounter.includes('road_rats'), 'a group that reaches the party triggers an encounter');
  world.killGroups(['road_rats']);
  ok(!world.liveGroups().some((g) => g.def.id === 'road_rats'), 'a killed group is gone');
  world.advance(1440);
  ok(world.liveGroups().some((g) => g.def.id === 'road_rats'), 'and returns after its respawn time');
  // Truce after fleeing.
  const back = world.state.y;
  world.flee(['road_rats']);
  ok(world.state.truce === 4 && world.state.y === back - 1, 'fleeing steps the party back and grants a truce');
  ok(world.adjacentGroups().length === 0, 'the fled group does not re-engage during the truce');
  // The Cut Stone: the tear closes when the Warden of the Cut dies, not as the party walks up to it.
  const cut = new World(buildMaps(), defaultParty(makeRng(6)), makeRng(6));
  cut.travel('grove2', 7, 8, 1); cut.killGroups(['g2_hand']);
  const up = cut.move('forward');
  ok(up.kind === 'moved' && !!up.encounter?.includes('g2_warden') && !up.messages.some((m) => /tear closes/.test(m)), 'stepping up to the Warden of the Cut starts the fight, and nothing yet says the tear has closed');
  ok(cut.killGroups(['g2_warden']).some((m) => /tear closes/.test(m)) && cut.killGroups(['g2_hand']).length === 0, 'beating the Warden is what closes the tear, and a group with nothing to say says nothing');
}
