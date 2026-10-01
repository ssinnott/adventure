// Sunderwood's walkthrough. Its chapter, The Wall, is #204's, which plays it here; until then, the
// Eaves' way in (I2, #195) walked: the east road out of Thornmark over the Hoarhills, the secret
// under the milestone found from its hints, the box's groups won at its floor, and the crest along
// its south shut against the Deepthorn, so the road is the only way between the two areas. Then the
// Eaves (J2, #196): the road on through the pines, the rim of the Sunder seen, the secret in the
// bear's cave found from the dog and the cutter's word, and the box's groups won at its floor. Then
// Sunderfall (K2, #197): the rope bridge crossed, the ledge behind the quiet fall found from its
// rocks, and the box's groups won at its floor. Then Lanternwood (L2, #200): the road on through the
// wood to the tower's gate, shut until #201, the pit under the signal fire's ash found from the ash
// and the young sister's word, and the box's groups won at its floor. Then the Sunder's mouth (K3,
// #198): the ledges walked down past the gleaners to the door and the camp below it, the river's old
// bed found from its stones and the stack across it, the box's bears won at its floor, and its Rift
// walked into and won, its groups still coming back. Then the Fells Road (M2, #202): the road off
// L2 by its ford and out by M2's south edge, where the world ends until the pass is built, the
// Warden's grave found from the milestone's back, and the box's groups won at its floor. Then the
// Bears' Wood (J3, #202): the cutters' track down out of J2, the hermit's word, the den's keepers
// and brood won and the den burnt, the cache behind it found from the moths at its mouth, and the
// way on east into K3's west lip.
import type { Walkthrough } from '../../area.ts';
import { newWalk, walkThrough, see, fight, listen } from '../../../../tools/walk.ts';
import { EAST, NORTH, SOUTH, WEST } from '../../../game/types.ts';
import { MAP_DEFS } from '../../index.ts';
import { buildMaps } from '../../maps.ts';
import { GameMap } from '../../../game/map.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { meet, heard } from '../../../game/people.ts';
import { approach, burn, burnt } from '../../../game/dens.ts';
import type { Den } from '../../../game/dens.ts';
import type { Person } from '../../../game/people.ts';

const I2 = MAP_DEFS.find((d) => d.id === 'eaves_i2')!;
const WOODCUTTER = I2.features!.find((f) => f.kind === 'npc' && f.name === 'A woodcutter') as Person;
const J2 = MAP_DEFS.find((d) => d.id === 'eaves_j2')!;
const CUTTER = J2.features!.find((f) => f.kind === 'npc' && f.name === 'Garret, a pine-cutter') as Person;
const K2 = MAP_DEFS.find((d) => d.id === 'eaves_k2')!;
const K3 = MAP_DEFS.find((d) => d.id === 'eaves_k3')!;
const K3_RIFT = MAP_DEFS.find((d) => d.id === 'k3_rift')!;
const L2 = MAP_DEFS.find((d) => d.id === 'lanternwood_l2')!;
const M2 = MAP_DEFS.find((d) => d.id === 'lanternwood_m2')!;
const J3 = MAP_DEFS.find((d) => d.id === 'eaves_j3')!;
const HERMIT = J3.features!.find((f) => f.kind === 'npc' && f.name === 'A hermit') as Person;
const DEN = J3.features!.find((f): f is Den => f.kind === 'den')!;
const SISTER = L2.features!.find((f) => f.kind === 'npc' && f.name === 'A young sister of the Watch') as Person;

export const walkthrough: Walkthrough = (ok) => {
  const w = newWalk(ok);
  w.level = 14;
  // The east road: out of Thornmark's east edge and over the shoulder into the Eaves.
  walkThrough(w, 'thornmark', 28, 10, EAST, 'eaves_i2');

  // The secret: the stone's cut turf and the woodcutter's word, then the search, the hollow and the pack.
  see(w, 'eaves_i2:i2_milestone');
  w.world.travel('eaves_i2', WOODCUTTER.x, WOODCUTTER.y);
  const said = meet(WOODCUTTER, w.party, heard(w.world, WOODCUTTER)).text;
  ok(said.includes('Stood when I came up in spring'), 'the woodcutter says the milestone stood in spring');
  w.world.travel('eaves_i2', 17, 10, SOUTH);
  let found = false;
  for (let i = 0; i < 20 && !found; i++) found = w.world.search();
  const into = found ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(found && into.every((r) => r.kind === 'moved'), 'searched from the milestone, the ground under it opens, and the hollow can be walked into');
  ok(w.world.used('i2_pack'), 'in the hollow, the Warden\'s pack is found');
  listen(w);
  const pack = I2.features!.find((f) => f.kind === 'chest' && f.id === 'i2_pack_chest');
  ok(pack?.kind === 'chest' && pack.items.includes('wardens_halberd') && pack.x === 17 && pack.y === 12, 'beside it, the Warden\'s Halberd');

  // The box's groups, each won at its floor: the bears by the way in, the moths at the camp by night and the bears on the road at the far end.
  for (const g of I2.encounters!) fight(w, `eaves_i2:${g.id}`);

  // The crest: from the road, walking or wading, the Deepthorn's I3 below it is never reached.
  const out = buildMaps()[OUTDOORS], i2 = out.zones.find((z) => z.id === 'eaves_i2')!, i3 = out.zones.find((z) => z.id === 'deepthorn_i3')!;
  const inside = (x: number, y: number, z: typeof i2): boolean => x >= z.x && x < z.x + z.w && y >= z.y && y < z.y + z.h;
  const seen = new Set<number>(), stack = [[i2.x + 12, i2.y + 9]];
  let crossed = false;
  while (stack.length) {
    const [x, y] = stack.pop()!, k = y * out.width + x;
    if (seen.has(k) || !(inside(x, y, i2) || inside(x, y, i3)) || out.passable(x, y, { swim: true }) !== 'ok') continue;
    seen.add(k);
    if (inside(x, y, i3)) crossed = true;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) stack.push([x + dx, y + dy]);
  }
  ok(seen.size > 400 && !crossed, `the crest shuts I2 from the Deepthorn's I3: none of its ${seen.size} squares walked leads down into it`);

  // The Eaves: the road on east out of I2, through the pines to the rim, where the wood stops.
  walkThrough(w, 'eaves_i2', 29, 11, EAST, 'eaves_j2');
  see(w, 'eaves_j2:j2_rim');
  ok(w.world.used('j2_rim'), 'at the rim, the Sunder is seen');

  // The secret: the dog at the north path's foot and the cutter's word, then the search at the rock and the cave behind it.
  see(w, 'eaves_j2:j2_dog');
  w.world.travel('eaves_j2', CUTTER.x, CUTTER.y);
  const cutter = meet(CUTTER, w.party, heard(w.world, CUTTER)).text;
  ok(cutter.includes('Never minded the bear'), 'the cutter says the dog never minded the bear before');
  fight(w, 'eaves_j2:j2_cave_bears');
  w.world.travel('eaves_j2', 16, 3, NORTH);
  let cave = false;
  for (let i = 0; i < 20 && !cave; i++) cave = w.world.search();
  const up = cave ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(cave && up.every((r) => r.kind === 'moved'), 'searched at the rock under the rim, it opens, and the cave behind it can be walked into');
  ok(w.world.used('j2_sack'), 'in the cave, the gleaner\'s sack is found');
  listen(w);
  const sack = J2.features!.find((f) => f.kind === 'chest' && f.id === 'j2_sack_chest');
  ok(sack?.kind === 'chest' && sack.items.includes('great_axe+1') && sack.x === 16 && sack.y === 1, 'beside it, the Great Axe');

  // The box's other groups, each won at its floor: the bears by the way in, the moths at the steading by night and the hounds on the lip.
  for (const g of J2.encounters!.filter((e) => e.id !== 'j2_cave_bears')) fight(w, `eaves_j2:${g.id}`);

  // Sunderfall: the road on out of J2 and over the gorge by the rope bridge, every plank of it walked.
  w.level = 15;
  walkThrough(w, 'eaves_j2', 31, 24, EAST, 'eaves_k2');
  const over = Array.from({ length: 8 }, () => w.world.move('forward'));
  ok(over.every((r) => r.kind === 'moved') && w.world.used('k2_bridge'), 'the rope bridge is crossed, plank by plank, to the east lip');
  listen(w);
  fight(w, 'eaves_k2:k2_hounds');

  // The secret: the rocks under the quiet fall, one bare, then the search there and the ledge behind the water.
  // Wading or walking, the ledge is never reached but through the bare rock.
  const k2 = out.zones.find((z) => z.id === 'eaves_k2')!, door = [k2.x + 10, k2.y + 29], shelf = (k2.y + 29) * out.width + k2.x + 9;
  const waded = new Set<number>(), wade = [[k2.x + 13, k2.y + 24]];
  while (wade.length) {
    const [x, y] = wade.pop()!, k = y * out.width + x;
    if (waded.has(k) || (x === door[0] && y === door[1]) || !(x >= k2.x && x < k2.x + k2.w && y >= k2.y && y < k2.y + k2.h) || out.passable(x, y, { swim: true }) !== 'ok') continue;
    waded.add(k);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) wade.push([x + dx, y + dy]);
  }
  ok(waded.size > 200 && !waded.has(shelf), `the ledge behind the fall is shut but for the bare rock: none of K2's ${waded.size} squares walked or waded reaches it`);
  see(w, 'eaves_k2:k2_fall');
  see(w, 'eaves_k2:k2_rocks');
  w.world.travel('eaves_k2', 11, 29, WEST);
  let ledge = false;
  for (let i = 0; i < 20 && !ledge; i++) ledge = w.world.search();
  const behind = ledge ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(ledge && behind.every((r) => r.kind === 'moved'), 'searched at the bare rock, it opens, and the ledge behind the fall can be walked onto');
  ok(w.world.used('k2_ledge'), 'on the ledge, the first gleaner\'s tally is found');
  listen(w);
  const sword = K2.features!.find((f) => f.kind === 'chest' && f.id === 'k2_ledge_chest');
  ok(sword?.kind === 'chest' && sword.items.includes('longsword+2') && sword.x === 9 && sword.y === 29, 'beside it, the Long Sword +2');

  // The box's other groups, each won at its floor: the gleaners at the dam and the glass bears on the road on east.
  for (const g of K2.encounters!.filter((e) => e.id !== 'k2_hounds')) fight(w, `eaves_k2:${g.id}`);

  // Lanternwood: the road on out of K2 through the wood, and the lit lamp by it.
  w.level = 15;
  walkThrough(w, 'eaves_k2', 29, 22, EAST, 'lanternwood_l2');
  see(w, 'lanternwood_l2:l2_lamp_day');
  listen(w);

  // The tower's gate is shut until #201 builds the Watch behind it, and says so by what is seen.
  const gate = L2.features!.find((f) => f.kind === 'event' && f.id === 'l2_gate');
  ok(gate?.kind === 'event' && gate.text.includes('barred') && new GameMap(L2).passable(gate.x, gate.y - 1) !== 'ok' && !L2.exits?.length, 'the spur ends at the tower\'s gate, barred');

  // The secret: the ash raked flat on the knoll and the sister's word that she burnt it, then the
  // search at the ash and the pit under it. Walking or wading, the pit is never reached but through the ash.
  const l2 = out.zones.find((z) => z.id === 'lanternwood_l2')!, lid = [l2.x + 5, l2.y + 5], pit = (l2.y + 4) * out.width + l2.x + 5;
  const walked = new Set<number>(), walk = [[l2.x + 1, l2.y + 22]];
  while (walk.length) {
    const [x, y] = walk.pop()!, k = y * out.width + x;
    if (walked.has(k) || (x === lid[0] && y === lid[1]) || !(x >= l2.x && x < l2.x + l2.w && y >= l2.y && y < l2.y + l2.h) || out.passable(x, y, { swim: true }) !== 'ok') continue;
    walked.add(k);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) walk.push([x + dx, y + dy]);
  }
  ok(walked.size > 250 && !walked.has(pit), `the pit under the ash is shut but for the ash: none of L2's ${walked.size} squares walked or waded reaches it`);
  see(w, 'lanternwood_l2:l2_knoll');
  see(w, 'lanternwood_l2:l2_ash');
  w.world.travel('lanternwood_l2', SISTER.x, SISTER.y);
  const word = meet(SISTER, w.party, heard(w.world, SISTER)).text;
  ok(word.includes('I burnt it on the knoll'), 'the young sister says she burnt it on the knoll');
  w.world.travel('lanternwood_l2', 5, 6, NORTH);
  let opened = false;
  for (let i = 0; i < 20 && !opened; i++) opened = w.world.search();
  const down = opened ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(opened && down.every((r) => r.kind === 'moved'), 'searched at the ash, it opens, and the pit under it can be walked into');
  ok(w.world.used('l2_letter'), 'in the pit, the Lantern\'s letter is found');
  listen(w);
  const staff = L2.features!.find((f) => f.kind === 'chest' && f.id === 'l2_letter_chest');
  ok(staff?.kind === 'chest' && staff.items.includes('lanterns_staff') && staff.x === 5 && staff.y === 4, 'beside it, the Lantern\'s Staff +1');

  // The box's groups, each won at its floor: the moths at the lit lamp and the tower by night, the hounds on the knoll's path and the glass bears on the road on.
  for (const g of L2.encounters!) fight(w, `lanternwood_l2:${g.id}`);

  // The Sunder's mouth: south out of K2 along the east lip, to the ledges' head.
  walkThrough(w, 'eaves_k2', 12, 29, SOUTH, 'eaves_k3', 4);
  see(w, 'eaves_k3:k3_ledges');
  // Down the ledges, a square wide: the gleaners at the door, then on down past it to their camp,
  // where the ledges stop. The door is drawn shut in the face; the Sunder (#199) opens it.
  fight(w, 'eaves_k3:k3_door');
  const k3 = out.zones.find((z) => z.id === 'eaves_k3')!;
  ok(out.passable(k3.x + 10, k3.y + 8) !== 'ok', 'the door on the first landing stands shut in the rock');
  w.world.travel('eaves_k3', 12, 1, SOUTH);
  const turns = ['forward', 'forward', 'forward', 'forward', 'right', 'forward', 'forward', 'forward', 'left', 'forward', 'forward', 'forward', 'forward', 'forward', 'forward', 'left', 'forward', 'forward', 'right', 'forward'] as const;
  const stepped = turns.map((t) => (t === 'forward' ? w.world.move('forward') : (w.world.turn(t), { kind: 'moved' })));
  ok(stepped.every((r) => r.kind === 'moved') && w.world.used('k3_camp'), 'the ledges are walked down, a square at a time, past the door to the camp where they stop');
  listen(w);
  const dirk = K3.features!.find((f) => f.kind === 'chest' && f.id === 'k3_camp_chest');
  ok(dirk?.kind === 'chest' && dirk.items.includes('wardens_dirk+1'), 'in the gleaners\' camp, a Warden\'s Dirk +1');

  // The secret: the river's old bed, cut off at the lip, and the stack across its mouth; searched there,
  // the bed behind it and the shard. Walked, waded, climbed or floated, the bed is never reached but
  // through the stack.
  const pile = [k3.x + 16, k3.y + 15], bed = (k3.y + 15) * out.width + k3.x + 18;
  const roamed = new Set<number>(), roam = [[k3.x + 13, k3.y]];
  while (roam.length) {
    const [x, y] = roam.pop()!, k = y * out.width + x;
    if (roamed.has(k) || (x === pile[0] && y === pile[1]) || !(x >= k3.x && x < k3.x + k3.w && y >= k3.y && y < k3.y + k3.h) || out.passable(x, y, { swim: true, climb: true, float: true }) !== 'ok') continue;
    roamed.add(k);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) roam.push([x + dx, y + dy]);
  }
  ok(roamed.size > 400 && !roamed.has(bed), `the old bed is shut but for the stack: none of K3's ${roamed.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'eaves_k3:k3_stones');
  see(w, 'eaves_k3:k3_stack');
  w.world.travel('eaves_k3', 15, 15, EAST);
  let searched = false;
  for (let i = 0; i < 20 && !searched; i++) searched = w.world.search();
  const inBed = searched ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(searched && inBed.every((r) => r.kind === 'moved') && w.world.used('k3_bed'), 'searched at the stack, it opens, and the old bed behind it can be walked into');
  listen(w);
  const shard = K3.features!.find((f) => f.kind === 'chest' && f.id === 'k3_bed_chest');
  ok(shard?.kind === 'chest' && shard.items.includes('sunder_shard') && shard.x === 18 && shard.y === 15, 'in the rock at the bed\'s end, the Sunder Shard');

  // The bears at the far end, at 16, the box's top; then the Rift in the crystal, walked into from its
  // lane, and its groups won at its floor. Nothing closes it: its groups keep coming back, and its tear
  // has no quiet word.
  fight(w, 'eaves_k3:k3_bears');
  w.level = 14;
  walkThrough(w, 'eaves_k3', 15, 26, EAST, 'k3_rift', 2);
  for (const g of K3_RIFT.encounters!) fight(w, `k3_rift:${g.id}`);
  ok(K3_RIFT.encounters!.every((e) => !!e.respawn && !e.until) && !K3_RIFT.features!.some((f) => 'after' in f && f.after), 'the Rift stays open: its groups come back, and its tear never goes quiet');

  // Shut but for a square: of a box's squares walked, waded, climbed or floated from `from`, none is
  // `prize` unless through `door`.
  const shut = (box: { x: number; y: number; w: number; h: number }, from: [number, number], door: [number, number], prize: [number, number]): { size: number; reached: boolean } => {
    const seen = new Set<number>(), todo = [[box.x + from[0], box.y + from[1]]];
    while (todo.length) {
      const [x, y] = todo.pop()!, k = y * out.width + x;
      if (seen.has(k) || (x === box.x + door[0] && y === box.y + door[1]) || !(x >= box.x && x < box.x + box.w && y >= box.y && y < box.y + box.h) || out.passable(x, y, { swim: true, climb: true, float: true }) !== 'ok') continue;
      seen.add(k);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
    }
    return { size: seen.size, reached: seen.has((box.y + prize[1]) * out.width + box.x + prize[0]) };
  };

  // The Fells Road: off L2 over the river by its ford, and onto M2's corner, where the road turns
  // south for the pass. Past M2's south edge the world ends, until M3 is built.
  w.level = 15;
  walkThrough(w, 'lanternwood_l2', 29, 29, EAST, 'lanternwood_m2', 3);
  const m2 = out.zones.find((z) => z.id === 'lanternwood_m2')!;
  ok(['=', '='].join() === [out.at(m2.x + 1, m2.y + 31).ch, out.at(m2.x + 2, m2.y + 31).ch].join() && out.passable(m2.x + 1, m2.y + 32) !== 'ok', 'the road leaves M2 by its south edge, and past it, for now, the world ends');
  // The secret: the milestone's back, then the search there and the grave through the tree line.
  // Walked, waded, climbed or floated, the grave is never reached but through the trees by the stone.
  const grave = shut(m2, [1, 29], [5, 30], [6, 30]);
  ok(grave.size > 100 && !grave.reached, `the grave is shut but for the trees by the stone: none of M2's ${grave.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'lanternwood_m2:m2_milestone');
  w.world.travel('lanternwood_m2', 4, 30, EAST);
  let tree = false;
  for (let i = 0; i < 20 && !tree; i++) tree = w.world.search();
  const through = tree ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(tree && through.every((r) => r.kind === 'moved') && w.world.used('m2_grave'), 'searched by the milestone, the tree line opens, and the grave behind it can be walked to');
  listen(w);
  const gravePack = M2.features!.find((f) => f.kind === 'chest' && f.id === 'm2_grave_chest');
  ok(gravePack?.kind === 'chest' && gravePack.x === 7 && gravePack.y === 30 && gravePack.gold > 0, 'beside the grave, the dead Warden\'s pack');
  // The box's groups, each won at its floor: the hounds up the river, the moths at the camp by night and the bears under the range.
  for (const g of M2.encounters!) fight(w, `lanternwood_m2:${g.id}`);

  // The Bears' Wood: down the cutters' track out of J2's pines.
  walkThrough(w, 'eaves_j2', 14, 27, SOUTH, 'eaves_j3', 6);
  see(w, 'eaves_j3:j3_track');
  w.world.travel('eaves_j3', HERMIT.x, HERMIT.y);
  const told = meet(HERMIT, w.party, heard(w.world, HERMIT)).text;
  ok(told.includes('something on two legs'), 'the hermit says something on two legs goes up to the den, and comes down lighter');
  // The den: its brood abroad and its keepers beside it, won at the box's floor; then burnt, once.
  for (const g of J3.encounters!) fight(w, `eaves_j3:${g.id}`);
  ok(approach(w.world, DEN).ask && burn(w.world, w.party, DEN).length > 0 && burnt(w.world, DEN), 'its keepers dead, the den is fired, and its hoard is the company\'s');
  // The secret: the moth dust at the den's mouth, then the search at the den's back and the cache.
  // Walked, waded, climbed or floated, the cache is never reached but through the den's back.
  const j3 = out.zones.find((z) => z.id === 'eaves_j3')!;
  const cache = shut(j3, [14, 0], [21, 20], [23, 20]);
  ok(cache.size > 100 && !cache.reached, `the cache is shut but for the den's back: none of J3's ${cache.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'eaves_j3:j3_mouth');
  w.world.travel('eaves_j3', 20, 20, EAST);
  let back = false;
  for (let i = 0; i < 20 && !back; i++) back = w.world.search();
  const inCache = back ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(back && inCache.every((r) => r.kind === 'moved') && w.world.used('j3_cache'), 'searched at the den\'s back, it opens, and the cache behind it can be walked into');
  listen(w);
  const coat = J3.features!.find((f) => f.kind === 'chest' && f.id === 'j3_cache_chest');
  ok(coat?.kind === 'chest' && coat.items.includes('chain+2'), 'in the cache, a Chain Mail +2');
  // And on east out of the wood onto K3's west lip.
  walkThrough(w, 'eaves_j3', 29, 28, EAST, 'eaves_k3', 4);
};
