// Wrackholm's walkthrough. Its chapter, The Stone Carried Home, is #191's, so for now it walks the
// boxes as a company the boat has put ashore at 12 (tools/walk.ts): the landing, the gulls' roof and
// the cache under it, found by a search and not told, and every group of E6 won at its floor; then
// east over the moor into F6 at 13, the hermit's tally, the door in the cairn on the point found by
// a search, the founder's seal in the grave, and every group of F6 won at its floor.
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen, walkThrough } from '../../../../tools/walk.ts';
import { NORTH, EAST } from '../../../game/types.ts';
import { MAP_DEFS } from '../../index.ts';
import { WRACKHOLM_E6 } from './maps/wrackholm_e6.ts';
import { WRACKHOLM_F6 } from './maps/wrackholm_f6.ts';

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

  // East over the moor into F6, at its floor.
  w.level = 13;
  const f6 = WRACKHOLM_F6;
  walkThrough(w, e6.id, 30, 12, EAST, f6.id, 4);

  // The hermit's tally starts at a date; the cairn on the point keeps the rest, behind a door a search finds.
  const tally = f6.features!.find((f) => f.kind === 'event' && f.id === 'f6_tally')!, grave = f6.secrets![0];
  ok(grave.hint === 'f6_tally', 'the door in the cairn names the hermit\'s tally as its hint');
  ok(Math.abs(tally.x - grave.x) + Math.abs(tally.y - grave.y) > 1, 'the tally is not beside the door it hints at');
  see(w, 'wrackholm_f6:f6_tally');
  see(w, 'wrackholm_f6:f6_cairn');
  w.world.travel(f6.id, grave.x - 1, grave.y, EAST);
  let opened = false;
  for (let i = 0; i < 20 && !opened; i++) opened = w.world.search();
  ok(opened, 'a search at the cairn finds the door in it');
  w.world.move('forward'); w.world.move('forward');
  const box = f6.features!.find((f) => f.kind === 'chest' && f.id === 'f6_grave');
  const under = box && w.world.locate(f6.id, box.x, box.y);
  ok(!!under && w.world.state.x === under.x && w.world.state.y === under.y, 'through it, the grave under the cairn');
  if (box?.kind === 'chest') {
    w.world.markUsed(box.id); w.party.gold += box.gold; w.party.bag.push(...box.items);
    ok(w.party.bag.includes('founders_seal'), 'and in it the founder\'s seal');
  }
  see(w, 'wrackholm_f6:f6_grave_seen');
  listen(w);

  for (const g of MAP_DEFS.find((d) => d.id === f6.id)!.encounters ?? []) fight(w, `${f6.id}:${g.id}`);
};
