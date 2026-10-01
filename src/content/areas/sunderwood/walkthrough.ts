// Sunderwood's walkthrough. Its chapter, The Wall, is #204's, which plays it here; until then, the
// Eaves' way in (I2, #195) walked: the east road out of Thornmark over the Hoarhills, the secret
// under the milestone found from its hints, the box's groups won at its floor, and the crest along
// its south shut against the Deepthorn, so the road is the only way between the two areas. Then the
// Eaves (J2, #196): the road on through the pines, the rim of the Sunder seen, the secret in the
// bear's cave found from the dog and the cutter's word, and the box's groups won at its floor. Then
// Sunderfall (K2, #197): the rope bridge crossed, the ledge behind the quiet fall found from its
// rocks, and the box's groups won at its floor. Then Lanternwood (L2, #200): the road on through the
// wood to the tower's gate and in at it to Lantern Watch (#201), where a company rests, buys, studies
// and trains and the Reader reads the Tide Ship's papers and its log, the pit under the signal fire's ash found from the ash and the young sister's word, and
// the box's groups won at its floor.
import type { Walkthrough } from '../../area.ts';
import { newWalk, walkThrough, see, fight, listen } from '../../../../tools/walk.ts';
import { EAST, NORTH, SOUTH, WEST } from '../../../game/types.ts';
import { MAP_DEFS } from '../../index.ts';
import { buildMaps } from '../../maps.ts';
import type { Feature } from '../../../game/map.ts';
import { buy, item } from '../../../game/items.ts';
import { canTrainAt, xpForLevel, CLASSES, countItem } from '../../../game/party.ts';
import { spellsFor } from '../../../game/spells.ts';
import { ACT_II } from '../../../../tools/tests/ladder.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { meet, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';

const I2 = MAP_DEFS.find((d) => d.id === 'eaves_i2')!;
const WOODCUTTER = I2.features!.find((f) => f.kind === 'npc' && f.name === 'A woodcutter') as Person;
const J2 = MAP_DEFS.find((d) => d.id === 'eaves_j2')!;
const CUTTER = J2.features!.find((f) => f.kind === 'npc' && f.name === 'Garret, a pine-cutter') as Person;
const K2 = MAP_DEFS.find((d) => d.id === 'eaves_k2')!;
const L2 = MAP_DEFS.find((d) => d.id === 'lanternwood_l2')!;
const WATCH = MAP_DEFS.find((d) => d.id === 'lantern_watch')!;
const READER = WATCH.features!.find((f) => f.kind === 'npc' && f.name.startsWith('Hester Dunmore')) as Person;
const PRIOR = WATCH.features!.find((f) => f.kind === 'npc' && f.name === 'Prior Osric') as Person;
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

  // The tower's gate is the way into Lantern Watch (#201): in at it and out again onto the spur.
  const gate = L2.features!.find((f) => f.kind === 'event' && f.id === 'l2_gate');
  ok(gate?.kind === 'event' && gate.text.includes('open now') && !!L2.exits?.some((e) => e.x === gate.x && e.y === gate.y - 1 && e.to === 'lantern_watch'), 'the spur ends at the tower\'s gate, and the gate is the way in');
  walkThrough(w, 'lanternwood_l2', 12, 17, NORTH, 'lantern_watch');
  ok(w.world.state.mapId === 'lantern_watch' && w.world.state.x === WATCH.start.x && w.world.state.y === WATCH.start.y, 'the gate lets the company into the Watch\'s yard');
  walkThrough(w, 'lantern_watch', 7, 14, SOUTH, 'lanternwood_l2');
  ok(w.world.zone?.id === 'lanternwood_l2' && w.world.state.x - w.world.zone.x === 12 && w.world.state.y - w.world.zone.y === 17, 'and out again onto the spur before the gate');

  // A company of 14 rests, buys the band's gear, studies to the sixth tier and trains to 17. No temple:
  // Sunderfall's shrine cures.
  const business = <K extends Feature['kind']>(kind: K): Extract<Feature, { kind: K }>[] => WATCH.features!.filter((f): f is Extract<Feature, { kind: K }> => f.kind === kind);
  ok(business('inn').length === 1 && !business('temple').length, 'the Watch has a refectory to rest in, and no temple');
  const stores = business('shop').find((f) => f.interior === 'watch_stores')!;
  const rung = ACT_II.find((r) => r.level === 14)!;
  w.party.gold = 20000;
  for (const m of w.party.members) for (const id of rung.classes[m.cls]) ok(!!buy(w.party, stores, id), `${m.name} buys a ${item(id).name} from the stores`);
  ok(stores.stock.includes('lantern_oil'), 'and the stores sell lamp oil');
  const hall = business('guild')[0];
  ok(business('guild').length === 1 && hall.hall === 'lanterns' && hall.interior === 'watch_hall' && hall.maxTier === 6, `the Lantern hall is the Lanterns' hall and teaches to the sixth tier (${hall.name})`);
  const caster = w.party.members.find((m) => CLASSES[m.cls].spells)!;
  const sixth = spellsFor(CLASSES[caster.cls].spells!, hall.maxTier!).filter((sp) => sp.level === 6);
  ok(sixth.length > 0 && hall.classes.includes(caster.cls), `${caster.name} may study the sixth tier there (${sixth.map((sp) => sp.name).join(', ')})`);
  const gallery = business('trainer')[0];
  const trainee = w.party.members[0], was = { level: trainee.level, xp: trainee.xp };
  trainee.level = 16; trainee.xp = xpForLevel(17);
  ok(gallery.maxLevel === 17 && gallery.interior === 'watch_gallery' && canTrainAt(trainee, gallery.maxLevel) && (trainee.level = 17, !canTrainAt(trainee, gallery.maxLevel)), 'the Lamp Gallery trains a member of 16 to 17, and no further');
  Object.assign(trainee, was);

  // The papers read (#201): the Reader in the prior's room reads the Tide Ship's papers and its log to
  // a company that carries them, at any hour and with nothing else done, sets the midpoint's flag and
  // gives both back. The prior asks for them, and takes nothing.
  w.party.bag.push('ships_papers', 'ships_log');
  const asked = meet(PRIOR, w.party, heard(w.world, PRIOR)).text;
  ok(asked.includes('next oil cart') && countItem(w.party, 'ships_papers') === 1, `the prior asks for the papers, and takes nothing (${asked.split('\n\n').at(-1)})`);
  const reading = meet(READER, w.party, heard(w.world, READER)).text;
  ok(!!w.party.flags.papers_read && /customs seal/.test(reading) && /Regent/.test(reading) && /Vask/.test(reading) && !/knoll/.test(reading), `the Reader reads the seal, the Regent's hand and the name in the log (${reading.split('\n\n').slice(-2).join(' ')})`);
  ok(!/cage|sky|Hearth|Hand/.test(reading), 'and says nothing past what is written');
  ok(countItem(w.party, 'ships_papers') === 1 && countItem(w.party, 'ships_log') === 1, 'and puts both back in the company\'s hands');
  ok(meet(PRIOR, w.party, heard(w.world, PRIOR)).text.includes('The chair was warm'), 'the prior knows his room has been sat in');
  ok(meet(READER, w.party, heard(w.world, READER)).text.includes('Keep them close'), 'and the Reader, read, says only to keep them');

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
  // A company that found the letter first is read to all the same; only her first words know it.
  delete w.party.flags.papers_read;
  const knoll = meet(READER, w.party, heard(w.world, READER)).text;
  ok(!!w.party.flags.papers_read && knoll.includes('on the knoll') && /Vask/.test(knoll), `with the letter found, the Reader knows where the company has been (${knoll.split('\n\n').at(-3)})`);

  // The box's groups, each won at its floor: the moths at the lit lamp and the tower by night, the hounds on the knoll's path and the glass bears on the road on.
  for (const g of L2.encounters!) fight(w, `lanternwood_l2:${g.id}`);
};
