// Wrackholm's walkthrough. Its chapter, The Stone Carried Home, is #191's, so for now it walks the
// built maps as a company the boat has put ashore at 12 (tools/walk.ts): the landing, the gulls'
// roof and the cache under it, found by a search and not told, and every group of E6 won at the
// floor; then up into Kelp Hole, its crews and overseers, the strongbox and the brother by the
// rows; down to the sea cave, the boy at the black pool and the beast at 14; and out by the flooded
// passage, found by the tide-mark and not told, onto F6's east shore. Last, east over the moor into
// F6 at 13: the hermit's tally, the door in the cairn on the point found by a search, the founder's
// seal in the grave, and every group of F6 won at its floor.
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen, walkThrough } from '../../../../tools/walk.ts';
import { NORTH, EAST, SOUTH, WEST } from '../../../game/types.ts';
import { MAP_DEFS } from '../../index.ts';
import { WRACKHOLM_E6 } from './maps/wrackholm_e6.ts';
import { WRACKHOLM_F6 } from './maps/wrackholm_f6.ts';
import { SMUGGLERS_COVE } from './maps/smugglers_cove.ts';
import { SMUGGLERS_COVE2 } from './maps/smugglers_cove2.ts';

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

  // Kelp Hole: up the wet path from the stage and into the cliff.
  const up = SMUGGLERS_COVE, down = SMUGGLERS_COVE2;
  walkThrough(w, e6.id, 18, 13, NORTH, up.id, 2);
  see(w, `${up.id}:kh1_crates`);
  ok(!w.world.peopleAt(12, 5).length, 'the brother is not among the rows while the overseers stand');
  for (const g of up.encounters ?? []) fight(w, `${up.id}:${g.id}`);
  w.world.travel(up.id, 12, 6, NORTH);
  ok(w.world.peopleAt(12, 5).some((p) => p.name.startsWith('Colan')), 'with the overseers down, the brother sits by the rows');
  const box = up.features!.find((f) => f.kind === 'chest' && f.id === 'kh1_strongbox');
  ok(box?.kind === 'chest' && box.items.includes('plate+1'), 'the crews\' strongbox holds the Plate Mail +1');

  // The sea cave: the boy at the black pool while the beast lives, and the beast at the band's top.
  walkThrough(w, up.id, 4, 3, NORTH, down.id, 2);
  ok(w.world.peopleAt(13, 12).some((p) => p.name.startsWith('Tam')), 'the boy feeds the beast at the pool\'s edge');
  for (const g of (down.encounters ?? []).filter((e) => e.id !== 'kh2_great_devilfish')) fight(w, `${down.id}:${g.id}`);
  w.level = 14;
  fight(w, `${down.id}:kh2_great_devilfish`);
  w.world.travel(down.id, 13, 11, NORTH);
  ok(!w.world.peopleAt(13, 12).length, 'with the beast dead, the boy is gone from the pool');

  // The tide-mark stops short, and a search west of it finds the flooded passage: out, onto E6's shore.
  const mark = down.features!.find((f) => f.kind === 'event' && f.id === 'kh2_tidemark')!, gap = down.secrets![0];
  see(w, `${down.id}:kh2_tidemark`);
  ok(mark.x === gap.x + 1 && mark.y === gap.y, 'the tide-mark is seen from the square east of the passage\'s door');
  w.world.travel(down.id, mark.x, mark.y, WEST);
  found = false;
  for (let i = 0; i < 20 && !found; i++) found = w.world.search();
  ok(found, 'a search west from the tide-mark finds the way into the flooded passage');
  w.world.travel(down.id, mark.x, mark.y, WEST);
  for (let i = 0; i < 3; i++) w.world.move('forward');
  ok(w.world.state.mapId === down.id && w.world.state.x === gap.x - 2 && w.world.state.y === gap.y, 'through the door the passage runs on west, under the wall');
  walkThrough(w, down.id, w.world.state.x, w.world.state.y, SOUTH, WRACKHOLM_F6.id, 4);
  ok(w.world.map.at(w.world.state.x, w.world.state.y).terrain === 'sand', 'the flooded passage lets out on F6\'s sand, the isle\'s east shore');

  // East over the moor into F6, at its floor.
  w.level = 13;
  const f6 = WRACKHOLM_F6;
  walkThrough(w, e6.id, 30, 12, EAST, f6.id, 4);

  // The hermit's tally starts at a date; the cairn on the point keeps the rest, behind a door a
  // search finds.
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
  const dug = f6.features!.find((f) => f.kind === 'chest' && f.id === 'f6_grave');
  const under = dug && w.world.locate(f6.id, dug.x, dug.y);
  ok(!!under && w.world.state.x === under.x && w.world.state.y === under.y, 'through it, the grave under the cairn');
  if (dug?.kind === 'chest') {
    w.world.markUsed(dug.id); w.party.gold += dug.gold; w.party.bag.push(...dug.items);
    ok(w.party.bag.includes('founders_seal'), 'and in it the founder\'s seal');
  }
  see(w, 'wrackholm_f6:f6_grave_seen');
  listen(w);

  for (const g of MAP_DEFS.find((d) => d.id === f6.id)!.encounters ?? []) fight(w, `${f6.id}:${g.id}`);
};
