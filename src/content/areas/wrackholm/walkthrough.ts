// Wrackholm's walkthrough. Its chapter, The Stone Carried Home, is #191's, so for now it walks E6 as
// a company the boat has put ashore at 12 (tools/walk.ts): the landing, the gulls' roof and the
// cache under it, found by a search and not told, and every group of the box won at the floor.
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen } from '../../../../tools/walk.ts';
import { NORTH } from '../../../game/types.ts';
import { MAP_DEFS } from '../../index.ts';
import { WRACKHOLM_E6 } from './maps/wrackholm_e6.ts';

export const walkthrough: Walkthrough = (ok) => {
  const w = newWalk(ok);
  w.level = 12;
  const e6 = WRACKHOLM_E6, { x, y, facing } = e6.start;

  // Put ashore at the stage, as the boat will (#177).
  w.world.travel(e6.id, x, y, facing);
  ok(w.world.zone?.id === e6.id && w.world.map.passable(w.world.state.x, w.world.state.y) === 'ok', `the landing at ${x},${y} is open ground in E6`);
  see(w, 'wrackholm_e6:e6_stage');

  // The gulls on one roof, and the door in its wall found by searching from where they are seen.
  const hint = e6.features!.find((f) => f.kind === 'event' && f.id === 'e6_gulls_roof')!, door = e6.secrets![0];
  see(w, 'wrackholm_e6:e6_gulls_roof');
  ok(hint.x === door.x && hint.y === door.y + 1, 'the gulls are seen from the square below the hut\'s secret door');
  w.world.travel(e6.id, hint.x, hint.y, NORTH);
  let found = false;
  for (let i = 0; i < 20 && !found; i++) found = w.world.search();
  ok(found, 'a search from below the gulls finds the door in the hut\'s wall');
  w.world.move('forward'); w.world.move('forward');
  const chest = e6.features!.find((f) => f.kind === 'chest' && f.id === 'e6_cache_box');
  const at = chest && w.world.locate(e6.id, chest.x, chest.y);
  ok(!!at && w.world.state.x === at.x && w.world.state.y === at.y, 'through it, the cache under the floor');
  if (chest?.kind === 'chest') {
    w.world.markUsed(chest.id); w.party.gold += chest.gold; w.party.bag.push(...chest.items);
    ok(w.party.bag.includes('longbow+1'), 'and in it the Long Bow +1');
  }
  see(w, 'wrackholm_e6:e6_cache');
  listen(w);

  // Every group of the box, at the floor.
  for (const g of MAP_DEFS.find((d) => d.id === e6.id)!.encounters ?? []) fight(w, `${e6.id}:${g.id}`);
};
