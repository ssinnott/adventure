// Sunderwood's walkthrough. Its chapter, The Wall, is #204's, which plays it here; until then, the
// Eaves' way in (I2, #195) walked: the east road out of Thornmark over the Hoarhills, the secret
// under the milestone found from its hints, the box's groups won at its floor, and the crest along
// its south shut against the Deepthorn, so the road is the only way between the two areas. Then the
// Eaves (J2, #196): the road on through the pines, the rim of the Sunder seen, the secret in the
// bear's cave found from the dog and the cutter's word, and the box's groups won at its floor. Then
// Sunderfall (K2, #197): the rope bridge crossed, the ledge behind the quiet fall found from its
// rocks, and the box's groups won at its floor. Then Lanternwood (L2, #200): the road on through the
// wood to the tower's gate and in at it to Lantern Watch (#201), where a company rests, buys, studies
// and trains and the Reader reads the Tide Ship's papers and its log, the pit under the signal
// fire's ash found from the ash and the young sister's word, and the box's groups won at its floor.
// Then the Sunder's mouth (K3, #198): the ledges walked down past the gleaners to the door and the
// camp below it, the river's old bed found from its stones and the stack across it, the box's bears
// won at its floor, and its Rift walked into and won, its groups still coming back. Then the Sunder
// (#199): in at the door on the first landing, down the ledges and over the thread, the gleaners'
// cache, down to the floor, its groups and the Warden won, the wall found and the seam behind the
// rock fall at the chalk's last mark; the Warden stays dead and the rest come back.
import type { Walkthrough } from '../../area.ts';
import { newWalk, walkThrough, see, fight, listen } from '../../../../tools/walk.ts';
import { EAST, NORTH, SOUTH, WEST } from '../../../game/types.ts';
import { MAP_DEFS } from '../../index.ts';
import { buildMaps } from '../../maps.ts';
import { GameMap } from '../../../game/map.ts';
import type { Feature } from '../../../game/map.ts';
import { buy, item } from '../../../game/items.ts';
import { canTrainAt, xpForLevel, CLASSES, rest, guildFlag, trainPrice, levelUp, countItem } from '../../../game/party.ts';
import { makeRng } from '../../../lib/engine/rng.ts';
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
const K3 = MAP_DEFS.find((d) => d.id === 'eaves_k3')!;
const K3_RIFT = MAP_DEFS.find((d) => d.id === 'k3_rift')!;
const L2 = MAP_DEFS.find((d) => d.id === 'lanternwood_l2')!;
const WATCH = MAP_DEFS.find((d) => d.id === 'lantern_watch')!;
const READER = WATCH.features!.find((f) => f.kind === 'npc' && f.name.startsWith('Hester Dunmore')) as Person;
const PRIOR = WATCH.features!.find((f) => f.kind === 'npc' && f.name === 'Prior Osric') as Person;
const LEDGES = MAP_DEFS.find((d) => d.id === 'the_sunder')!;
const FLOOR = MAP_DEFS.find((d) => d.id === 'the_sunder2')!;
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
  ok(gate?.kind === 'event' && gate.text.includes('open') && !!L2.exits?.some((e) => e.x === gate.x && e.y === gate.y - 1 && e.to === 'lantern_watch'), 'the spur ends at the tower\'s gate, and the gate is the way in');
  walkThrough(w, 'lanternwood_l2', 12, 17, NORTH, 'lantern_watch');
  ok(w.world.state.mapId === 'lantern_watch' && w.world.state.x === WATCH.start.x && w.world.state.y === WATCH.start.y, 'the gate lets the company into the Watch\'s yard');
  walkThrough(w, 'lantern_watch', 7, 14, SOUTH, 'lanternwood_l2');
  ok(w.world.zone?.id === 'lanternwood_l2' && w.world.state.x - w.world.zone.x === 12 && w.world.state.y - w.world.zone.y === 17, 'and out again onto the spur before the gate');

  // A company of 14 rests, buys the band's gear, studies to the sixth tier and trains to 17, each as
  // the business's screen does it (src/ui/screens.ts). No temple: Sunderfall's shrine cures.
  const business = <K extends Feature['kind']>(kind: K): Extract<Feature, { kind: K }>[] => WATCH.features!.filter((f): f is Extract<Feature, { kind: K }> => f.kind === kind);
  ok(business('inn').length === 1 && !business('temple').length, 'the Watch has a refectory to rest in, and no temple');
  w.party.gold = 20000;
  const refectory = business('inn')[0], night = refectory.price * w.party.members.length;
  for (const m of w.party.members) { m.hp = 1; m.sp = 0; }
  w.party.gold -= night;
  for (const m of w.party.members) rest(m);
  w.world.sleepUntilMorning();
  ok(w.party.members.every((m) => m.hp === m.maxHp && m.sp === m.maxSp) && w.world.hour >= 6 && w.world.hour <= 9 && w.party.gold === 20000 - night, `a night in the refectory for ${night} gold, and the company wakes whole in the morning`);
  const stores = business('shop').find((f) => f.interior === 'watch_stores')!;
  const rung = ACT_II.find((r) => r.level === 14)!;
  for (const m of w.party.members) for (const id of rung.classes[m.cls]) ok(!!buy(w.party, stores, id), `${m.name} buys a ${item(id).name} from the stores`);
  ok(stores.stock.includes('lantern_oil'), 'and the stores sell lamp oil');
  const hall = business('guild')[0];
  ok(business('guild').length === 1 && hall.hall === 'lanterns' && hall.interior === 'watch_hall' && hall.maxTier === 6, `the Lantern hall is the Lanterns' hall and teaches to the sixth tier (${hall.name})`);
  const caster = w.party.members.find((m) => CLASSES[m.cls].spells && hall.classes.includes(m.cls))!;
  const sixth = spellsFor(CLASSES[caster.cls].spells!, hall.maxTier!).find((sp) => sp.level === 6 && !caster.spells.includes(sp.id))!;
  // The fee to study, once, then the spell at the hall's price for its tier (spellPrice: 40 doubling a tier).
  const before = w.party.gold, price = 40 * 2 ** (sixth.level - 1);
  w.party.gold -= hall.fee; w.party.flags[guildFlag(hall.name)] = 1;
  w.party.gold -= price; caster.spells.push(sixth.id);
  ok(!!sixth && w.party.gold === before - hall.fee - price && caster.spells.includes(sixth.id), `${caster.name} pays the hall's fee of ${hall.fee} and learns ${sixth.name} for ${price}`);
  const gallery = business('trainer')[0];
  // Trained on a copy, so the company walks on as it was.
  const trainee = structuredClone(w.party.members[0]);
  trainee.level = 16; trainee.xp = xpForLevel(17);
  ok(gallery.maxLevel === 17 && gallery.interior === 'watch_gallery' && canTrainAt(trainee, gallery.maxLevel), 'the Lamp Gallery will train a member of 16');
  const fee = trainPrice(trainee);
  w.party.gold -= fee; levelUp(trainee, makeRng(1), 17);
  ok(trainee.level === 17 && !canTrainAt(trainee, gallery.maxLevel), `who trains to 17 for ${fee} gold, and no further`);

  // The papers read (#201): the Reader in the prior's room, once she has met the company, reads it
  // what it carries of the Tide Ship's, the papers, the log or both, at any hour and with nothing
  // else done, sets the midpoint's flag and gives them back. The prior, met, asks for them and takes
  // nothing.
  const talk = (p: Person): string => meet(p, w.party, heard(w.world, p)).text;
  w.party.bag.push('ships_papers', 'ships_log');
  ok(talk(PRIOR).includes('I keep the one lamp'), 'the prior meets the company first, the papers or no');
  const asked = talk(PRIOR);
  ok(asked.includes('next oil cart') && countItem(w.party, 'ships_papers') === 1, `then asks for the papers, and takes nothing (${asked})`);
  const intro = talk(READER);
  ok(intro.includes('Shut it, if you would') && !w.party.flags.papers_read, 'the Reader meets the company first, the papers or no, and reads nothing yet');
  const without = (id: string, then: () => string): string => { const i = w.party.bag.indexOf(id); w.party.bag.splice(i, 1); const t = then(); w.party.bag.push(id); return t; };
  const logOnly = without('ships_papers', () => talk(READER));
  ok(!!w.party.flags.papers_read && /Vask/.test(logOnly) && /puts it back/.test(logOnly) && !/customs seal/.test(logOnly), `to a company with the log alone, she reads the log and the name in it (${logOnly.split('\n\n').at(-1)})`);
  delete w.party.flags.papers_read;
  const papersOnly = without('ships_log', () => talk(READER));
  ok(!!w.party.flags.papers_read && /customs seal/.test(papersOnly) && /Regent/.test(papersOnly) && /puts them back/.test(papersOnly) && !/Vask/.test(papersOnly), `to a company with the papers alone, the seal and the Regent's hand (${papersOnly.split('\n\n').at(-1)})`);
  delete w.party.flags.papers_read;
  const reading = talk(READER);
  ok(!!w.party.flags.papers_read && /customs seal/.test(reading) && /Regent/.test(reading) && /Vask/.test(reading) && /puts both back/.test(reading) && !/knoll/.test(reading), `and to a company with both, the seal, the Regent's hand and the name in the log (${reading.split('\n\n').slice(-2).join(' ')})`);
  ok([logOnly, papersOnly, reading].every((t) => !/cage|sky|Hearth|Hand/.test(t)), 'and says nothing past what is written');
  ok(countItem(w.party, 'ships_papers') === 1 && countItem(w.party, 'ships_log') === 1, 'she puts what she read back in the company\'s hands');
  ok(talk(PRIOR).includes('The chair was warm'), 'the prior knows his room has been sat in');
  ok(talk(READER).includes('Keep them close'), 'and the Reader, read, says only to keep them');

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
  const knoll = talk(READER);
  ok(!!w.party.flags.papers_read && knoll.includes('on the knoll') && /Vask/.test(knoll), `with the letter found, the Reader knows where the company has been (${knoll.split('\n\n').at(-3)})`);

  // The box's groups, each won at its floor: the moths at the lit lamp and the tower by night, the hounds on the knoll's path and the glass bears on the road on.
  for (const g of L2.encounters!) fight(w, `lanternwood_l2:${g.id}`);

  // The Sunder's mouth: south out of K2 along the east lip, to the ledges' head.
  walkThrough(w, 'eaves_k2', 12, 29, SOUTH, 'eaves_k3', 4);
  see(w, 'eaves_k3:k3_ledges');
  // Down the ledges, a square wide: the gleaners at the door, then on down past it to their camp,
  // where the ledges stop. The door in the face is the Sunder's way in (#199), walked past here.
  fight(w, 'eaves_k3:k3_door');
  const k3 = out.zones.find((z) => z.id === 'eaves_k3')!;
  ok(out.passable(k3.x + 10, k3.y + 8) === 'ok' && !!K3.exits?.some((e) => e.x === 10 && e.y === 8 && e.to === 'the_sunder'), 'the door on the first landing opens into the rock, the Sunder\'s way in');
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

  // The Sunder: in at the door on K3's first landing, from the ledge, and down the stair in the rock.
  walkThrough(w, 'eaves_k3', 9, 8, EAST, 'the_sunder', 1);
  see(w, 'the_sunder:su1_in');
  see(w, 'the_sunder:su1_face');
  see(w, 'the_sunder:su1_glass');
  see(w, 'the_sunder:su1_threads');
  // The spiders on the thread, and the thread walked across the drop, a square at a time.
  fight(w, 'the_sunder:su1_spiders');
  w.world.travel('the_sunder', 20, 20, WEST);
  const onThread = Array.from({ length: 8 }, () => w.world.move('forward'));
  ok(onThread.every((r) => r.kind === 'moved') && w.world.state.x === 12 && w.world.state.y === 20, 'the thread is walked across the drop, from the east face\'s ledge to the west\'s');
  see(w, 'the_sunder:su1_cleft');
  const plate = LEDGES.features!.find((f) => f.kind === 'chest' && f.id === 'su1_cache');
  ok(plate?.kind === 'chest' && plate.items.includes('plate+2'), 'in the gleaners\' cache on the ledges, the Plate Mail +2');
  see(w, 'the_sunder:su1_landing');
  walkThrough(w, 'the_sunder', 5, 29, SOUTH, 'the_sunder2', 1);

  // The floor: its groups won at its floor, then the Warden in the narrows, at 14, which drops its heart.
  see(w, 'the_sunder2:su2_in');
  see(w, 'the_sunder2:su2_river');
  for (const g of FLOOR.encounters!.filter((e) => e.id !== 'su2_warden')) fight(w, `the_sunder2:${g.id}`);
  // The narrows are the only way to the wall: walked, waded, climbed or floated, nothing past the Warden's square is reached but through it.
  const floor = new GameMap(FLOOR), shut = (x: number, y: number, from: [number, number], past: [number, number]): boolean => {
    const seen = new Set<number>(), stack = [from];
    while (stack.length) {
      const [cx, cy] = stack.pop()!, k = cy * floor.width + cx;
      if (seen.has(k) || (cx === x && cy === y) || floor.passable(cx, cy, { swim: true, climb: true, float: true }) !== 'ok') continue;
      seen.add(k);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (floor.inBounds(cx + dx, cy + dy)) stack.push([cx + dx, cy + dy]);
    }
    return seen.size > 50 && !seen.has(past[1] * floor.width + past[0]);
  };
  ok(shut(15, 16, [8, 2], [15, 25]), 'the wall is reached only through the narrows, where the Warden stands');
  see(w, 'the_sunder2:su2_narrows');
  fight(w, 'the_sunder2:su2_warden');
  ok(w.party.bag.includes('sunder_heart'), 'the Warden of the Sunder falls, and its heart is taken');
  ok(!FLOOR.encounters!.find((e) => e.id === 'su2_warden')!.respawn, 'the Warden never comes back');
  const fallen = FLOOR.features!.find((f) => f.kind === 'chest' && f.id === 'su2_fallen_chest');
  ok(fallen?.kind === 'chest' && fallen.items.includes('flail+1') && fallen.items.includes('ironwood_bow+1'), 'at the narrows, past the Warden, the Flail +1 and the Ironwood Bow +1');

  // No group within four squares of the wall: the silence at the bottom (MONSTERS §6.3).
  const wall: [number, number][] = [];
  for (let y = 0; y < floor.height; y++) for (let x = 0; x < floor.width; x++) if (floor.at(x, y).solid === 'wall') wall.push([x, y]);
  const near = FLOOR.encounters!.filter((e) => wall.some(([x, y]) => Math.abs(x - e.x) + Math.abs(y - e.y) <= 4));
  ok(wall.length > 30 && !near.length, `no group stands within four squares of the wall${near.length ? ` (not: ${near.map((e) => e.id).join(', ')})` : ''}`);

  // The step: the wall, at 14 with the Sunder taken first. Its chapter's entry is #204's.
  see(w, 'the_sunder2:su2_silence');
  see(w, 'the_sunder2:su2_wall');

  // The secret: the surveyor's chalk runs out at the rock fall that closes the strip; searched there,
  // a gap in the fall opens on a hollow beside the wall, the seam on the wall's face at its back. The
  // hollow is reached only so, and nothing passes into the wall.
  ok(shut(2, 24, [8, 2], [1, 25]), 'the hollow is shut but through the fall by the chalk\'s last mark');
  see(w, 'the_sunder2:su2_fall');
  see(w, 'the_sunder2:su2_chalk');
  w.world.travel('the_sunder2', 3, 24, WEST);
  let seam = false;
  for (let i = 0; i < 20 && !seam; i++) seam = w.world.search();
  const inSeam = seam ? [w.world.move('forward'), w.world.move('forward'), (w.world.turn('left'), w.world.move('forward'))] : [];
  ok(seam && inSeam.every((r) => r.kind === 'moved') && w.world.used('su2_seam'), 'searched at the fall by the chalk\'s last mark, it gives, and the hollow behind it can be stood in');
  ok(w.world.move('forward').kind === 'blocked' && floor.at(1, 26).solid === 'wall' && floor.at(1, 26).door === 'door', 'the seam is on the wall\'s face at the hollow\'s back, and nothing passes it');
  listen(w);

  // The Warden is dead and nothing closes: two days on, the floor's groups are back, and it is not.
  w.world.advance(2881);
  const live = w.world.liveGroups().map((g) => g.def.id);
  ok(live.includes('su2_wood') && live.includes('su2_bears') && !live.includes('su2_warden'), `the Sunder's groups keep coming after its Warden falls (${live.join(', ')})`);
  walkThrough(w, 'the_sunder2', 7, 3, NORTH, 'the_sunder', 1);
  walkThrough(w, 'the_sunder', 28, 2, NORTH, 'eaves_k3', 1);
};
