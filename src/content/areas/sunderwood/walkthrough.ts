// Sunderwood's walkthrough. First its chapter, The Wall (#204), the last of Act II, played three
// ways, each a step at a time (tools/kit/walk.ts). In order, at 15: the Foreland, the Grove, the Tide
// Stone and the Stone Carried Home played from a new game, the papers carried from the Tide Ship
// and the Stone home beginning the Wall (#191), then over the bridge, down the Sunder to the wall,
// the papers read at the Watch and Vask at its gate the next morning, answered no. The Watch first,
// a company at 16: read before the wall, so Vask waits on it, then answered no. The Sunder first,
// at 14, before the Tide Ship: the wall found with no chapter of its own begun, then the ship and
// the Stone home, which begin it with the rim, the crossing and the wall written at once. The
// Foreland's and the Grove's ends are seeded in the last two, and Saltreach and Wrackholm played.
// No is the one answer offered (#452), as STORY has it; it ends the act, and Vask is gone.
//
// Then the area as built: the Eaves' way in (I2, #195) walked: the east road out of Thornmark over
// the Hoarhills, the secret under the milestone found from its hints, the box's groups won at its
// floor, and the crest along its south shut against the Deepthorn, so the road is the only way
// between the two areas. Then the Eaves (J2, #196): the road on through the pines, the rim of the
// Sunder seen, the secret in the bear's cave found from the dog and the cutter's word, and the
// box's groups won at its floor. Then Sunderfall (K2, #197): the rope bridge crossed, the ledge
// behind the quiet fall found from its rocks, and the box's groups won at its floor. Then
// Lanternwood (L2, #200): the road on through the wood to the tower's gate and in at it to Lantern
// Watch (#201), where a company rests, buys, studies and trains and the Reader reads the Tide
// Ship's papers and its log, the pit under the signal fire's ash found from the ash and the young
// sister's word, and the box's groups won at its floor. Then the Sunder's mouth (K3, #198): the
// ledges walked down past the gleaners to the door and the camp below it, the river's old bed found
// from its stones and the stack across it, the box's bears won at its floor, and its Rift walked
// into and won, its groups still coming back. Then the Sunder (#199): in at the door on the first
// landing, down the ledges and over the thread, the gleaners' cache, down to the floor, its groups
// and the Warden won, the wall found and the seam behind the rock fall at the chalk's last mark;
// the Warden stays dead and the rest come back. Then the Fells Road (M2, #202): the road off L2 by
// its ford and out by M2's south edge into the Iron Fells' M3 (#457), the Warden's
// grave found from the milestone's back, and the box's groups won at its floor. Then the Bears'
// Wood (J3, #202): the cutters' track down out of J2, the hermit's word, the den's keepers and
// brood won and the den burnt, the cache behind it found from the moths at its mouth, and the way
// on east into K3's west lip.
// Then Lanternwood's depths (#203): the Moth Wood (L3) down the Lanterns' bank path out of L2, the
// sister at the moth shrine and its blessing, the box's groups won and the lamp-house found from the
// hooks in the oaks; the Bay Wood (L4) over the gravel bar, its groups won, the sow's den burnt, the
// stone Lantern's riddle answered and the Hand's store found from the prints; and the Sunder's Foot
// (K4) along the shingle, its west lip walked to round the gorge's foot, its west edge rock against
// the Deepthorn, its groups won, the boathouse found from the steps, and the way north to K3's lip.
//
// Then its side quests (#205), each choice played both ways and the log read after either: Under the
// Glass Trees, the lamp taken to the cabin or the family brought over the bridge; The Dammed Fall, the
// dam broken or the tally kept; The Watch's Lamp, the prior told on or let be; The Length of the
// Wall, the measure sold or the Watch told. Last, the Paladin's second prestige, taught by the hermit in J3's
// clearing (#19): heard after his hint, and taught at 19; and the Cleric's second, taught by the sister
// at L3's moth shrine (#203): her lesson after her own words, and taught at 19.
import type { Walkthrough } from '../../area.ts';
import { newWalk, walkThrough, see, fight, gone, listen, meetWho, playChapter, ending, everyGoalWalked, goalFromBegun, quest, hear, answerTo, page, written, reads, there, clock, hired, who, shows, live, ofKind } from '../../../../tools/kit/walk.ts';
import { inBox } from '../../../../tools/kit/grid.ts';
import type { Step, Walk } from '../../../../tools/kit/walk.ts';
import { CHAPTER } from './chapter.ts';
import { STEPS as FORELAND_STEPS } from '../shelf/walkthrough.ts';
import { STEPS as GROVE_STEPS } from '../thornmark/walkthrough.ts';
import { STEPS as TIDE_STEPS } from '../saltreach/walkthrough.ts';
import { STEPS as WRACK_STEPS } from '../wrackholm/walkthrough.ts';
import { EAST, NORTH, SOUTH, WEST } from '../../../game/types.ts';
import { MAP_DEFS, THE_QUEST, TABLES } from '../../index.ts';
import { buildMaps } from '../../maps.ts';
import { GameMap } from '../../../game/map.ts';
import type { Feature, EncounterDef } from '../../../game/mapdef.ts';
import { buy, item } from '../../../game/items.ts';
import { canTrainAt, xpForLevel, CLASSES, countItem, prestigeOf, takePrestige, PRESTIGES } from '../../../game/party.ts';
import { nightCost, stay, payFee, hallOffers, learnSpell, train } from '../../../game/services.ts';
import { teach } from '../../../game/prestige.ts';
import { sought, seekId } from '../../../game/seeking.ts';
import { questLog } from '../../../game/quests.ts';
import { makeRng } from '../../../lib/engine/rng.ts';
import { spellsFor } from '../../../game/spells.ts';
import { ACT_II } from '../../../../tools/kit/rules/ladder.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { meet, heard, answer, readText } from '../../../game/people.ts';
import { approach, burn, burnt } from '../../../game/dens.ts';
import { answerRiddle, useShrine } from '../../../game/wilds.ts';
import type { Den } from '../../../game/dens.ts';
import type { Person } from '../../../game/people.ts';
import { CRACK_SEALED, CRACK_WIDE } from '../hearth/public.ts';
import { ENDINGS } from '../../endings.ts';

// Other areas' chapters, taken from the quest by their ids and not from their files (#992).
const FORELAND = THE_QUEST.chapters.find((c) => c.id === 'ashcombe')!;
const GROVE = THE_QUEST.chapters.find((c) => c.id === 'grove')!;
const TIDE = THE_QUEST.chapters.find((c) => c.id === 'tide')!;
const WRACK = THE_QUEST.chapters.find((c) => c.id === 'wrack')!;

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
const HERMIT = J3.features!.find((f) => f.kind === 'npc' && f.name.startsWith('Aylmer')) as Person;
const DEN = J3.features!.find((f): f is Den => f.kind === 'den')!;
const L3 = MAP_DEFS.find((d) => d.id === 'lanternwood_l3')!;
const KEEPER = L3.features!.find((f) => f.kind === 'npc' && f.name.startsWith('Sister Leofrun')) as Person;
const L4 = MAP_DEFS.find((d) => d.id === 'lanternwood_l4')!;
const SOW_DEN = L4.features!.find((f): f is Den => f.kind === 'den')!;
const K4 = MAP_DEFS.find((d) => d.id === 'lanternwood_k4')!;
const WATCH = MAP_DEFS.find((d) => d.id === 'lantern_watch')!;
const READER = WATCH.features!.find((f) => f.kind === 'npc' && f.name.startsWith('Hester Dunmore')) as Person;
const PRIOR = WATCH.features!.find((f) => f.kind === 'npc' && f.name === 'Prior Osric' && f.x === 8 && f.y === 9) as Person;
const LEDGES = MAP_DEFS.find((d) => d.id === 'the_sunder')!;
const FLOOR = MAP_DEFS.find((d) => d.id === 'the_sunder2')!;
const SISTER = L2.features!.find((f) => f.kind === 'npc' && f.name === 'Averil, a sister of the Watch') as Person;
const VASK = WATCH.features!.find((f) => f.kind === 'npc' && f.name.startsWith('Lord Aumery Vask')) as Person;

// ---- the chapter (#204) ----


/** East out of Thornmark, through the Eaves to the rim, and over the rope bridge, plank by plank. */
function eastToTheBridge(w: Walk): void {
  walkThrough(w, 'thornmark', 28, 10, EAST, 'eaves_i2');
  walkThrough(w, 'eaves_i2', 29, 11, EAST, 'eaves_j2');
  see(w, 'eaves_j2:j2_rim');
  walkThrough(w, 'eaves_j2', 31, 24, EAST, 'eaves_k2');
  const over = Array.from({ length: 8 }, () => w.world.move('forward'));
  w.ok(over.every((r) => r.kind === 'moved') && w.world.used('k2_bridge'), 'the rope bridge is crossed to the east lip');
  listen(w);
}

/** Down the Sunder from K3's first landing to the floor, the Warden in the narrows, and the wall. */
function downToTheWall(w: Walk): void {
  walkThrough(w, 'eaves_k2', 12, 29, SOUTH, 'eaves_k3', 4);
  walkThrough(w, 'eaves_k3', 9, 8, EAST, 'the_sunder', 1);
  walkThrough(w, 'the_sunder', 5, 29, SOUTH, 'the_sunder2', 1);
  fight(w, 'the_sunder2:su2_warden');
  see(w, 'the_sunder2:su2_wall');
}

/** In at the Watch's gate, and up to the Reader: met, then read to. */
function toTheReader(w: Walk): void {
  walkThrough(w, 'lanternwood_l2', 12, 17, NORTH, 'lantern_watch');
  meetWho(w, 'watch_reader_met');
  meetWho(w, 'watch_reader_met');
  w.ok(!!w.party.flags.papers_read, 'the Reader reads what the company carries');
}

/**
 * Vask at the gate: not there by night, there the next morning, and his question answered with the
 * company's one answer, no (#452). It ends the act, sets its own flag and gives nothing, and he is gone.
 */
function vaskRefused(): (w: Walk) => void {
  return (w) => {
    clock(w, 23);
    w.ok(!w.world.present(VASK), 'by night, nobody waits at the Watch\'s gate');
    clock(w, 8);
    see(w, 'lantern_watch:lw_vask');
    w.world.travel('lantern_watch', 8, 13);
    w.ok(w.world.used('lw_vask') && !w.world.eventsHere().length, 'the next morning, riders at the gate, said once across the road\'s width');
    const gold = w.party.gold, bag = [...w.party.bag].sort().join();
    meetWho(w, 'q_vask_rain');
    w.world.travel('lantern_watch', VASK.x, VASK.y);
    const m = meet(VASK, w.party, heard(w.world, VASK)), labels = m.choice?.answers.map((x) => x.label) ?? [];
    w.ok(JSON.stringify(labels) === JSON.stringify(['No.']), `Vask asks, and no is the one answer: no yes is offered (${labels.join(', ') || 'no question'})`);
    const a = m.choice?.answers[0];
    const said = a ? answer(TABLES.items, a, w.party) : '';
    listen(w);
    w.ok(/girl/.test(said), `he has the girl (${said})`);
    w.ok(w.party.gold === gold && [...w.party.bag].sort().join() === bag, 'the answer gives nothing and takes nothing');
    w.ok(!w.world.present(VASK) && !meet(VASK, w.party, () => false).choice, 'and Vask is gone, his question closed');
  };
}

const BRIDGE: Step = { name: 'over the bridge', play: eastToTheBridge };
const DOWN: Step = { name: 'down to the wall', play: downToTheWall };
const READ: Step = { name: 'the papers read', play: toTheReader };

/** A company the Foreland's and the Grove's chapters are done for, by their own events and flags, at the Thornmark road's end. */
function seeded(ok: (cond: boolean, msg: string) => void): Walk {
  const w = newWalk(ok);
  for (const f of ['q_ashcombe', 'q_wenna', 'q_keeper', 'q_ashcombe_done', 'q_grove', 'q_treaty', 'q_grove_done']) w.party.flags[f] = 1;
  w.world.travel('downs_e3', 16, 28);
  w.world.markUsed('e3_log');
  see(w, 'deepthorn_i4:i4_treaty');
  ok(quest(w)?.pages.filter((p) => p.done).length === 2 && !!quest(w)?.pages.some((p) => p.def === TIDE && !p.done) && !quest(w)?.pages.some((p) => p.def === CHAPTER), 'seeded, the farm and the Grove are done, the Tide Stone begun and the Wall not');
  return w;
}

/** Saltreach's chapter to the boat, and Wrackholm's from the landing to the Stone home, played: the Wall begins there. */
function act(w: Walk, how: string): void {
  playChapter(w, TIDE, TIDE_STEPS, how);
  playChapter(w, WRACK, WRACK_STEPS, how);
}


function theWall(ok: (cond: boolean, msg: string) => void): void {
  // In order, at 15: the Foreland and the Grove played, then the Tide Stone and Wrackholm's chapter,
  // the papers and the log carried from the Tide Ship and the Stone home beginning the Wall.
  const chain = newWalk(ok);
  hired(chain);
  playChapter(chain, FORELAND, FORELAND_STEPS, 'in order');
  playChapter(chain, GROVE, GROVE_STEPS, 'in order');
  act(chain, 'in order');
  ok(chain.news.at(-1) === 'New chapter: The Wall.' && chain.party.bag.includes('ships_papers') && chain.party.bag.includes('ships_log'), `in order, the Stone home begins the Wall, the papers carried from the ship (${chain.news.at(-1)})`);
  playChapter(chain, CHAPTER, [BRIDGE, DOWN, READ, { name: 'Vask, no', play: vaskRefused() }], 'in order');
  ok(written(chain, CHAPTER).includes('seal') && written(chain, CHAPTER).includes('name') && !!chain.party.flags.q_vask_no && !chain.party.flags.q_vask_yes, 'in order, the seal and the name are read, and the answer is no');
  ok(chain.news.at(-1) === 'Chapter complete: The Wall.' && !chain.news.includes('Quest complete: The Dimming.'), `in order, the answer ends the Wall, and the quest goes on into Act III (${chain.news.slice(-2).join(' ')})`);
  const pages = quest(chain)?.pages.map((p) => p.def.title) ?? [];
  ok(JSON.stringify(pages.slice(-3)) === JSON.stringify([TIDE.title, WRACK.title, CHAPTER.title]), `in order, the log shows Act II in three chapters (${pages.join(', ')})`);
  const want = ending(chain, 'in order', CHAPTER);

  // The Watch first, at 16: read before the wall, so the goal sends the company down and Vask waits
  // on it; then answered no, as every company answers.
  const watch = seeded(ok);
  act(watch, 'the Watch first');
  ok(watch.news.at(-1) === 'New chapter: The Wall.', `the Watch first, the Stone home begins the Wall (${watch.news.at(-1)})`);
  const at16 = (s: Step): Step => ({ name: s.name, play: (w) => { w.level = 16; s.play(w); } });
  playChapter(watch, CHAPTER, [at16(BRIDGE), at16(READ), at16({ name: 'the wall unseen, so Vask is not come', play: (w) => {
    clock(w, 10);
    w.ok(!w.world.present(VASK), 'read, but the wall not touched: nobody waits at the gate by day');
    downToTheWall(w);
  } }), at16({ name: 'Vask, no', play: vaskRefused() })], 'the Watch first');
  ok(!!watch.party.flags.q_vask_no && !watch.party.flags.q_vask_yes, 'the Watch first, the answer is no');
  const wall = want.filter((e) => e.startsWith('wall.')).sort();
  ok(JSON.stringify(written(watch, CHAPTER).map((e) => `wall.${e}`).sort()) === JSON.stringify(wall), `the Watch first, the Wall reads as in order (${written(watch, CHAPTER).join(', ')})`);

  // The Sunder first, at 14, before the Tide Ship: the wall is found, and nothing of the Wall's is
  // begun while Wrackholm's goal stands. The Stone home begins it, with the rim, the crossing and
  // the wall written at once.
  const sunder = seeded(ok);
  playChapter(sunder, TIDE, TIDE_STEPS, 'the Sunder first');
  sunder.level = 14;
  const before = quest(sunder)?.goal;
  ok(WRACK.goals.some((g) => g.text === before), `the Sunder first, on the isle, the goal is Wrackholm's (${before})`);
  eastToTheBridge(sunder);
  downToTheWall(sunder);
  ok(!quest(sunder)?.pages.some((p) => p.def === CHAPTER) && !sunder.news.includes('New chapter: The Wall.') && quest(sunder)?.goal === before, `the Sunder first, the wall begins nothing and the goal stands (${before})`);
  goalFromBegun(sunder, 'the Sunder first');
  playChapter(sunder, WRACK, WRACK_STEPS, 'the Sunder first');
  ok(sunder.news.at(-1) === 'New chapter: The Wall.' && ['rim', 'crossing', 'wall'].every((e) => written(sunder, CHAPTER).includes(e)), `the Stone home begins the Wall, with the rim, the crossing and the wall written at once (${written(sunder, CHAPTER).join(', ')})`);
  playChapter(sunder, CHAPTER, [READ, { name: 'Vask, no', play: vaskRefused() }], 'the Sunder first');
  ok(JSON.stringify(ending(sunder, 'the Sunder first', CHAPTER).filter((e) => e.startsWith('wall.'))) === JSON.stringify(wall), `the Sunder first, the Wall reads as in order (${written(sunder, CHAPTER).join(', ')})`);

  // The Reader's single readings, seeded: the table gives both papers, so no run carries one alone,
  // but she reads either alone, and the Wall begins on it with only that one written.
  for (const [one, read, not, flag, other] of [['ships_papers', 'seal', 'name', 'seal_read', 'log_read'], ['ships_log', 'name', 'seal', 'log_read', 'seal_read']] as const) {
    const alone = seeded(ok);
    alone.level = 16;
    alone.party.bag.push(one);
    toTheReader(alone);
    ok(!!alone.party.flags[flag] && !alone.party.flags[other] && written(alone, CHAPTER).includes(read) && !written(alone, CHAPTER).includes(not),
      `${one} alone, the Reader reads the ${read} and not the ${not}, and the Wall begins on it (${written(alone, CHAPTER).join(', ')})`);
  }

  // Its runs walk the Wall whole, and each walkthrough checks the chapters its own runs walk (#946):
  // the Foreland's and the Grove's Thornmark's, the Tide Stone's Saltreach's and Wrackholm's its own.
  everyGoalWalked(ok, [CHAPTER]);
}

export const walkthrough: Walkthrough = (ok) => {
  theWall(ok);
  sideQuests(ok);

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
  const seen = new Set<number>(), stack = [[i2.x + 12, i2.y + 9]];
  let crossed = false;
  while (stack.length) {
    const [x, y] = stack.pop()!, k = y * out.width + x;
    if (seen.has(k) || !(inBox(i2, x, y) || inBox(i3, x, y)) || out.passable(x, y, { swim: true }) !== 'ok') continue;
    seen.add(k);
    if (inBox(i3, x, y)) crossed = true;
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

  // A company of 14 rests, buys the band's gear, studies to the sixth tier and trains to 17, each by
  // the rule its business's screen serves (src/game/services.ts). No temple: Sunderfall's shrine cures.
  ok(ofKind(WATCH, 'inn').length === 1 && !ofKind(WATCH, 'temple').length, 'the Watch has a refectory to rest in, and no temple');
  w.party.gold = 20000;
  const refectory = ofKind(WATCH, 'inn')[0], night = nightCost(refectory, w.party);
  for (const m of w.party.members) { m.hp = 1; m.sp = 0; }
  stay(w.party, w.world, refectory);
  ok(w.party.members.every((m) => m.hp === m.maxHp && m.sp === m.maxSp) && w.world.hour >= 6 && w.world.hour <= 9 && w.party.gold === 20000 - night, `a night in the refectory for ${night} gold, and the company wakes whole in the morning`);
  const stores = ofKind(WATCH, 'shop').find((f) => f.interior === 'watch_stores')!;
  const rung = ACT_II.find((r) => r.level === 14)!;
  for (const m of w.party.members) for (const id of rung.classes[m.cls]) ok(!!buy(TABLES.items, w.party, stores, id), `${m.name} buys a ${item(TABLES.items, id).name} from the stores`);
  ok(stores.stock.includes('lantern_oil'), 'and the stores sell lamp oil');
  const hall = ofKind(WATCH, 'guild')[0];
  ok(ofKind(WATCH, 'guild').length === 1 && hall.hall === 'lanterns' && hall.interior === 'watch_hall' && hall.maxTier === 6, `the Lantern hall is the Lanterns' hall and teaches to the sixth tier (${hall.name})`);
  const caster = w.party.members.find((m) => CLASSES[m.cls].spells && hall.classes.includes(m.cls))!;
  const sixth = spellsFor(CLASSES[caster.cls].spells!, hall.maxTier!).find((sp) => sp.level === 6 && !caster.spells.includes(sp.id))!;
  // The fee to study, once, then the spell as the hall offers it, at its price for the tier (spellPrice).
  const before = w.party.gold;
  payFee(w.party, hall);
  const { paid: price } = learnSpell(w.party, hallOffers(w.party, hall).find((o) => w.party.members[o.who] === caster && o.id === sixth.id)!);
  ok(!!sixth && w.party.gold === before - hall.fee - price && caster.spells.includes(sixth.id), `${caster.name} pays the hall's fee of ${hall.fee} and learns ${sixth.name} for ${price}`);
  const gallery = ofKind(WATCH, 'trainer')[0];
  // Trained on a copy, so the company walks on as it was; the company pays.
  const trainee = structuredClone(w.party.members[0]);
  trainee.level = 16; trainee.xp = xpForLevel(17);
  ok(gallery.maxLevel === 17 && gallery.interior === 'watch_gallery' && canTrainAt(trainee, gallery.maxLevel), 'the Lamp Gallery will train a member of 16');
  const { paid: fee } = train(w.party, trainee, makeRng(1), gallery.maxLevel);
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
  // lane, and its groups won at its floor. Nothing on the road closes it: its groups keep coming back
  // until the crack is sealed far below (#765), and its tear has no quiet word.
  fight(w, 'eaves_k3:k3_bears');
  w.level = 14;
  walkThrough(w, 'eaves_k3', 15, 26, EAST, 'k3_rift', 2);
  for (const g of K3_RIFT.encounters!) fight(w, `k3_rift:${g.id}`);
  ok(K3_RIFT.encounters!.every((e) => !!e.respawn && !!e.leaves && JSON.stringify(e.until) === JSON.stringify({ flag: CRACK_SEALED })) && !K3_RIFT.features!.some((f) => 'after' in f && f.after),
    'the Rift stays open: its groups come back until the crack below is sealed, and its tear never goes quiet');

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
  const floor = new GameMap(FLOOR), walledOff = (x: number, y: number, from: [number, number], past: [number, number]): boolean => {
    const seen = new Set<number>(), stack = [from];
    while (stack.length) {
      const [cx, cy] = stack.pop()!, k = cy * floor.width + cx;
      if (seen.has(k) || (cx === x && cy === y) || floor.passable(cx, cy, { swim: true, climb: true, float: true }) !== 'ok') continue;
      seen.add(k);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (floor.inBounds(cx + dx, cy + dy)) stack.push([cx + dx, cy + dy]);
    }
    return seen.size > 50 && !seen.has(past[1] * floor.width + past[0]);
  };
  ok(walledOff(15, 16, [8, 2], [15, 25]), 'the wall is reached only through the narrows, where the Warden stands');
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
  ok(walledOff(2, 24, [8, 2], [1, 25]), 'the hollow is shut but through the fall by the chalk\'s last mark');
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

  // Shut but for a square: of a box's squares walked, waded, climbed or floated from `from`, none is
  // `prize` unless through `door`.
  const shutBox = (box: { x: number; y: number; w: number; h: number }, from: [number, number], door: [number, number], prize: [number, number]): { size: number; reached: boolean } => {
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
  // south for the pass. Past M2's south edge the road runs on into M3, the Kilns' first box (#457).
  w.level = 15;
  walkThrough(w, 'lanternwood_l2', 29, 29, EAST, 'lanternwood_m2', 3);
  const m2 = out.zones.find((z) => z.id === 'lanternwood_m2')!;
  ok(['=', '='].join() === [out.at(m2.x + 1, m2.y + 31).ch, out.at(m2.x + 2, m2.y + 31).ch].join() && out.passable(m2.x + 1, m2.y + 32) === 'ok' && out.at(m2.x + 1, m2.y + 32).ch === '=', 'the road leaves M2 by its south edge, and runs on into the Iron Fells');
  // The secret: the milestone's back, then the search there and the grave through the tree line.
  // Walked, waded, climbed or floated, the grave is never reached but through the trees by the stone.
  const grave = shutBox(m2, [1, 29], [5, 30], [6, 30]);
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
  const cache = shutBox(j3, [14, 0], [21, 20], [23, 20]);
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

  // Lanternwood's depths (#203). The Moth Wood: down the Lanterns' bank path out of L2's corner.
  walkThrough(w, 'lanternwood_l2', 28, 29, SOUTH, 'lanternwood_l3', 3);
  see(w, 'lanternwood_l3:l3_way');
  w.world.travel('lanternwood_l3', KEEPER.x, KEEPER.y);
  ok(meet(KEEPER, w.party, heard(w.world, KEEPER)).text.includes('I stayed'), 'Sister Leofrun says she stayed when the depths were called up');
  const shrine = L3.features!.find((f): f is Extract<Feature, { kind: 'shrine' }> => f.kind === 'shrine' && f.id === 'l3_shrine')!;
  w.world.travel('lanternwood_l3', shrine.x, shrine.y);
  const here = w.world.featureHere();
  ok(here?.kind === 'shrine' && useShrine(w.world, w.party, here)[0] === shrine.text, 'the sister\'s shrine is knelt at');
  ok(w.party.members.every((c) => c.blessed.some((b) => b.element === 'fire' && b.until === 'rest')), 'the moth shrine keeps fire off the company until the next rest');
  for (const g of L3.encounters!) fight(w, `lanternwood_l3:${g.id}`);
  // The secret: the hooks in a line north off the old path, then the search there and the lamp-house
  // up the thicket. Walked, waded, climbed or floated, it is never reached but through the hooks' tree.
  const [l3, l4, k4] = ['lanternwood_l3', 'lanternwood_l4', 'lanternwood_k4'].map((id) => out.zones.find((z) => z.id === id)!);
  const house = shutBox(l3, [29, 0], [17, 15], [17, 7]);
  ok(house.size > 100 && !house.reached, `the lamp-house is shut but for the hooks' tree: none of L3's ${house.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'lanternwood_l3:l3_hooks');
  w.world.travel('lanternwood_l3', 17, 16, NORTH);
  let hooks = false;
  for (let i = 0; i < 20 && !hooks; i++) hooks = w.world.search();
  const upThicket = hooks ? Array.from({ length: 8 }, () => w.world.move('forward')) : [];
  ok(hooks && upThicket.every((r) => r.kind === 'moved') && w.world.used('l3_lamphouse'), 'searched under the hooks, the thicket opens, and the lamp-house up it can be walked to');
  listen(w);
  const longsword = L3.features!.find((f) => f.kind === 'chest' && f.id === 'l3_lamphouse_chest');
  ok(longsword?.kind === 'chest' && longsword.items.includes('longsword+2'), 'in the lamp-house, a Long Sword +2');

  // The Bay Wood: on down the bank over the river's gravel bar, to the den, the statue and the landing.
  walkThrough(w, 'lanternwood_l3', 22, 30, SOUTH, 'lanternwood_l4', 3);
  see(w, 'lanternwood_l4:l4_way');
  for (const g of L4.encounters!) fight(w, `lanternwood_l4:${g.id}`);
  ok(approach(w.world, SOW_DEN).ask && burn(w.world, w.party, SOW_DEN).length > 0 && burnt(w.world, SOW_DEN), 'its keepers dead, the sow\'s den is fired, and its hoard is the company\'s');
  const statue = L4.features!.find((f) => f.kind === 'statue' && f.id === 'l4_statue') as Extract<Feature, { kind: 'statue' }>;
  const purse = w.party.gold;
  w.world.travel('lanternwood_l4', statue.x, statue.y);
  ok(!answerRiddle(w.world, w.party, statue, 'lamps').right && answerRiddle(w.world, w.party, statue, 'Moths').right && w.party.gold === purse + 300, 'the stone Lantern\'s riddle is answered moths, the word in Averil\'s line, for 300 gold');
  ok(SISTER.lines.some((l) => l.includes('The moths agree with any light')), 'Averil, on L2\'s road, says what comes to any light');
  // The secret: the prints up from the landing, then the search on the hills and the store.
  const store = shutBox(l4, [21, 0], [22, 26], [23, 27]);
  ok(store.size > 100 && !store.reached, `the store is shut but for the hills' foot: none of L4's ${store.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'lanternwood_l4:l4_prints');
  w.world.travel('lanternwood_l4', 21, 26, EAST);
  let cut = false;
  for (let i = 0; i < 20 && !cut; i++) cut = w.world.search();
  const inStore = cut ? [w.world.move('forward'), w.world.move('forward'), (w.world.turn('right'), w.world.move('forward'))] : [];
  ok(cut && inStore.every((r) => r.kind === 'moved') && w.world.used('l4_store'), 'searched at the hills\' foot, the mountain opens, and the store behind it can be walked into');
  listen(w);
  const box = L4.features!.find((f) => f.kind === 'chest' && f.id === 'l4_store_chest');
  ok(box?.kind === 'chest' && box.items.includes('wardens_dirk+2'), 'in the store, a Warden\'s Dirk +2');

  // The Sunder's Foot: west along the shingle into K4. Its west lip is reached on foot only round the
  // gorge's foot, and its west edge is rock against the Deepthorn.
  walkThrough(w, 'lanternwood_l4', 2, 29, WEST, 'lanternwood_k4', 3);
  const foot = new GameMap(K4), onFoot = new Set([`${K4.start.x},${K4.start.y}`]), todo = [[K4.start.x, K4.start.y]];
  while (todo.length) {
    const [x, y] = todo.pop()!;
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      if (!foot.inBounds(nx, ny) || onFoot.has(`${nx},${ny}`) || foot.at(nx, ny).door === 'secret' || foot.passable(nx, ny) !== 'ok') continue;
      onFoot.add(`${nx},${ny}`); todo.push([nx, ny]);
    }
  }
  ok(onFoot.has('4,12') && onFoot.has('4,3') && onFoot.has('31,29'), 'K4\'s west lip is walked to from the east lip round the gorge\'s foot, and the shingle on to L4');
  ok(K4.rows.every((r) => r[0] === 'r'), 'K4\'s west edge is rock from the dead wood to the sea');
  for (const g of K4.encounters!) fight(w, `lanternwood_k4:${g.id}`);
  see(w, 'lanternwood_k4:k4_foot');
  // The secret: the steps that end at a blank face, then the search there and the boathouse.
  const boats = shutBox(k4, [23, 0], [2, 17], [1, 15]);
  ok(boats.size > 100 && !boats.reached, `the boathouse is shut but for the blank face: none of K4's ${boats.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'lanternwood_k4:k4_steps');
  w.world.travel('lanternwood_k4', 3, 17, WEST);
  let face = false;
  for (let i = 0; i < 20 && !face; i++) face = w.world.search();
  const inBoats = face ? [w.world.move('forward'), (w.world.turn('right'), w.world.move('forward'))] : [];
  ok(face && inBoats.every((r) => r.kind === 'moved') && w.world.used('k4_boathouse'), 'searched at the foot of the steps, the rock opens, and the boathouse behind it can be stood in');
  listen(w);
  const roll = K4.features!.find((f) => f.kind === 'chest' && f.id === 'k4_boathouse_chest');
  ok(roll?.kind === 'chest' && roll.items.includes('flail+2') && roll.items.includes('lanterns_roll') && item(TABLES.items, 'lanterns_roll').text?.some((t) => t.includes('LEOFRUN')) === true, 'in the boathouse, a Flail +2 and the Lanterns\' Roll, one name not struck');
  // And north out of the foot onto K3's east lip.
  walkThrough(w, 'lanternwood_k4', 23, 1, NORTH, 'eaves_k3', 3);
  trainers(ok);
  keeper(ok);
  stilled(ok);
};

/**
 * The Cleric's second prestige (#19): Sister Leofrun at the moth shrine in L3's clearing, a Lantern who
 * stayed when the depths were called up. She is there from a new game, off the fights and reached on
 * foot; her own words come first, then her lesson, once, to a Curate of 19; and at 19 the cleric is
 * sent to her and taught.
 */
function keeper(ok: (cond: boolean, msg: string) => void): void {
  const taught = (L3.features ?? []).flatMap((f) => (f.kind === 'npc' && f.teaches ? [f.teaches] : []));
  ok(taught.length === 1 && taught[0].cls === 'cleric' && taught[0].prestige === 2, 'the Moth Wood teaches the Cleric\'s second');
  ok(L3.rows[KEEPER.y][KEEPER.x] === 't' && L3.features!.every((f) => f === KEEPER || f.x !== KEEPER.x || f.y !== KEEPER.y), 'the sister stands in her clearing, with nothing else on her square');
  ok(there(newWalk(ok), 'lanternwood_l3', KEEPER), 'she is there from a new game');
  ok(!!KEEPER.teaches?.seek?.includes('Leofrun') && KEEPER.teaches.seek.includes(PRESTIGES.cleric.titles[1]), 'her seeking names her and the title she gives');
  const road = L3.rows.flatMap((r, y) => [...r].flatMap((ch, x) => (ch === '=' ? [{ x, y }] : [])));
  ok(road.every((r) => Math.abs(r.x - KEEPER.x) + Math.abs(r.y - KEEPER.y) > 10), 'she is more than ten squares off any road');
  ok(L3.encounters!.every((g) => Math.abs(g.x - KEEPER.x) + Math.abs(g.y - KEEPER.y) > 10), 'and more than ten squares from any group, so no trainer\'s door is a fight\'s doorstep');
  const map = new GameMap(L3), seen = new Set([`${L3.start.x},${L3.start.y}`]), q = [[L3.start.x, L3.start.y]];
  let reached = false;
  while (q.length && !reached) {
    const [x, y] = q.shift()!;
    reached = x === KEEPER.x && y === KEEPER.y;
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      if (!map.inBounds(nx, ny) || seen.has(`${nx},${ny}`) || map.at(nx, ny).door === 'secret') continue;
      if (map.passable(nx, ny) === 'ok') { seen.add(`${nx},${ny}`); q.push([nx, ny]); }
    }
  }
  ok(reached, 'she is reached on foot down the bank path and the old path, by no secret door');

  // Her words first, then her lesson once to a Curate of 19, and to a company under it never.
  const at = (level: number): Walk => {
    const w = newWalk(ok);
    for (const c of w.party.members) { c.xp = xpForLevel(level); c.level = level; }
    return w;
  };
  const talk = (w: Walk): string => { w.world.travel('lanternwood_l3', KEEPER.x, KEEPER.y); return meet(KEEPER, w.party, heard(w.world, KEEPER)).text; };
  const w = at(19), cleric = w.party.members.findIndex((c) => c.cls === 'cleric');
  takePrestige(w.party.members[cleric]);
  const said = [talk(w), talk(w), talk(w)];
  ok(said[0].includes('I stayed') && !said[0].includes('Kneel at the shard') && said[1].includes('Leofrun') && said[1].includes('Kneel at the shard') && said[2].includes('I stayed'),
    'her own words come first, then her lesson to a Curate of 19, once');
  const young = at(15);
  ok(![talk(young), talk(young)].some((t) => t.includes('Kneel at the shard')), 'to a company of 15 she says no lesson');

  // At 19 the cleric is sent to the Moth Wood, and taught.
  ok(sought(questLog(w.world.state, w.party)).find((p) => p.at === 'lanternwood_l3')?.who.includes(w.party.members[cleric].name) === true, 'at 19 the cleric is sent to the Moth Wood');
  w.party.gold = 4000;
  ok(teach(KEEPER.teaches!, w.party, w.world.state, cleric).taught && prestigeOf(w.party.members[cleric]) === 2 && w.party.gold === 0
    && questLog(w.world.state, w.party).find((v) => v.def.id === seekId(cleric, 2))?.done === true, `she makes a ${PRESTIGES.cleric.titles[1]} for 4,000 gold, and the seeking is done`);
}

/**
 * The Paladin's second prestige (#19): the hermit in J3's clearing, a knight of the Crown that was.
 * He is there from a new game, off the fights and reached on foot; his hint comes first, then his
 * lesson, once, to a Lightbearer of 19; and at 19 the paladin is sent to him and taught.
 */
function trainers(ok: (cond: boolean, msg: string) => void): void {
  const taught = (J3.features ?? []).flatMap((f) => (f.kind === 'npc' && f.teaches ? [f.teaches] : []));
  ok(taught.length === 1 && taught[0].cls === 'paladin' && taught[0].prestige === 2, 'the Bears\' Wood teaches the Paladin\'s second');
  ok(J3.rows[HERMIT.y][HERMIT.x] === 't' && J3.features!.every((f) => f === HERMIT || f.x !== HERMIT.x || f.y !== HERMIT.y), 'the hermit stands in his clearing, with nothing else on his square');
  ok(there(newWalk(ok), 'eaves_j3', HERMIT), 'he is there from a new game, before the den is fought');
  ok(!!HERMIT.teaches?.seek?.includes(HERMIT.name.split(',')[0]) && HERMIT.teaches.seek.includes(PRESTIGES.paladin.titles[1]), 'his seeking names him and the title he gives');
  // The box has no road; the rule is kept as Rietum's is, for when one is drawn.
  const road = J3.rows.flatMap((r, y) => [...r].flatMap((ch, x) => (ch === '=' ? [{ x, y }] : [])));
  ok(road.every((r) => Math.abs(r.x - HERMIT.x) + Math.abs(r.y - HERMIT.y) > 10), 'he is more than ten squares off any road');
  ok(J3.encounters!.every((g) => Math.abs(g.x - HERMIT.x) + Math.abs(g.y - HERMIT.y) > 10), 'and more than ten squares from any group, so no trainer\'s door is a fight\'s doorstep');
  const map = new GameMap(J3), seen = new Set([`${J3.start.x},${J3.start.y}`]), q = [[J3.start.x, J3.start.y]];
  let reached = false;
  while (q.length && !reached) {
    const [x, y] = q.shift()!;
    reached = x === HERMIT.x && y === HERMIT.y;
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      if (!map.inBounds(nx, ny) || seen.has(`${nx},${ny}`) || map.at(nx, ny).door === 'secret') continue;
      const p = map.passable(nx, ny, { tide: 'low' });
      if (p === 'ok' || p === 'unlock') { seen.add(`${nx},${ny}`); q.push([nx, ny]); }
    }
  }
  ok(reached, 'he is reached on foot down the cutters\' track, by no secret door');

  // His hint first, then his lesson once to a Lightbearer of 19, and to a company under it never.
  const at = (level: number): Walk => {
    const w = newWalk(ok);
    for (const c of w.party.members) { c.xp = xpForLevel(level); c.level = level; }
    return w;
  };
  const talk = (w: Walk): string => { w.world.travel('eaves_j3', HERMIT.x, HERMIT.y); return meet(HERMIT, w.party, heard(w.world, HERMIT)).text; };
  const w = at(19), paladin = w.party.members.findIndex((c) => c.cls === 'paladin');
  takePrestige(w.party.members[paladin]);
  const said = [talk(w), talk(w), talk(w)];
  ok(said[0].includes('something on two legs') && !said[0].includes('Kneel') && said[1].includes('Aylmer') && said[1].includes('Kneel') && said[2].includes('something on two legs'),
    'his hint comes first, then his lesson to a Lightbearer of 19, once');
  const young = at(15);
  ok(![talk(young), talk(young)].some((t) => t.includes('Kneel')), 'to a company of 15 he says no lesson');

  // At 19 the paladin is sent to the clearing, and taught.
  ok(sought(questLog(w.world.state, w.party)).find((p) => p.at === 'eaves_j3')?.who.includes(w.party.members[paladin].name) === true, 'at 19 the paladin is sent to the Bears\' Wood');
  w.party.gold = 4000;
  ok(teach(HERMIT.teaches!, w.party, w.world.state, paladin).taught && prestigeOf(w.party.members[paladin]) === 2 && w.party.gold === 0
    && questLog(w.world.state, w.party).find((v) => v.def.id === seekId(paladin, 2))?.done === true, `he makes a ${PRESTIGES.paladin.titles[1]} for 4,000 gold, and the seeking is done`);
}

// ---- the side quests (#205) ----


const GARRET = (): Person => who('eaves_j2', 22, 8, 'Garret'), NELL = (): Person => who('eaves_j2', 23, 8, 'Nell');
const GARRET_IN = (): Person => who('lantern_watch', 10, 7, 'Garret'), NELL_IN = (): Person => who('lantern_watch', 10, 7, 'Nell');
const AVERIL_ROAD = (): Person => who('lanternwood_l2', 17, 22, 'Averil'), AVERIL_HALL = (): Person => who('lantern_watch', 7, 8, 'Averil');
const ORM = (): Person => who('eaves_k2', 14, 27, 'Orm'), HEW = (): Person => who('eaves_k2', 20, 10, 'Hew');
const OSRIC = (): Person => who('lantern_watch', 8, 9, 'Prior Osric'), OSRIC_IN = (): Person => who('lantern_watch', 5, 5, 'Prior Osric');
const ROOM = (): Person => who('lantern_watch', 5, 5, "The Prior's Room"), CUTHWIN = (): Person => who('lantern_watch', 10, 5, 'Brother Cuthwin');
const BRINK = (): Person => who('lantern_watch', 2, 4, 'Wouter Brink');






/** Each member's xp now, to see what an answer paid. */
const xps = (w: Walk): number[] => w.party.members.map((m) => m.xp);
const paid = (w: Walk, before: readonly number[], each: number): boolean => w.party.members.every((m, i) => m.xp === before[i] + each);

const FAMILY = 'Under the Glass Trees', DAM = 'The Dammed Fall', LAMP = 'The Watch\'s Lamp', LENGTH = 'The Length of the Wall';

function sideQuests(ok: (cond: boolean, msg: string) => void): void {
  { // Under the Glass Trees: the warding lamp, the papers unread, so Averil is on the road.
    const w = newWalk(ok);
    w.ok(hear(w, 'eaves_j2', GARRET()).includes('Never minded the bear') && w.news.at(-1) === `New quest: ${FAMILY}.` && /Averil/.test(page(w, 'family')?.goal ?? ''),
      `Garret's first meeting keeps the dog and begins ${FAMILY}, its goal Averil (${page(w, 'family')?.goal})`);
    see(w, 'eaves_j2:j2_graves');
    w.ok(hear(w, 'lanternwood_l2', AVERIL_ROAD()).includes('I burnt it on the knoll'), 'Averil met first on the road says her own lines, the knoll\'s hint');
    const before = xps(w);
    answerTo(w, 'lanternwood_l2', AVERIL_ROAD(), { label: 'Give us the lamp.' });
    w.ok(w.party.bag.includes('warding_lamp') && paid(w, before, 110) && /warding lamp to Garret/.test(page(w, 'family')?.goal ?? ''), `the lamp given, it is in the pack, each member is paid 110 and the goal is Garret (${page(w, 'family')?.goal})`);
    w.ok(hear(w, 'eaves_j2', GARRET()).startsWith('Garret turns the lamp') && !w.party.bag.includes('warding_lamp'), 'Garret takes the lamp at the meeting');
    reads(w, 'family', ['garret', 'graves', 'lamp', 'lit'], ['promise', 'gone'], 'the lamp lit');
    w.ok(hear(w, 'eaves_j2', GARRET()).includes('Dog still won\'t go up the north path') && there(w, 'eaves_j2', GARRET()) && !there(w, 'lantern_watch', GARRET_IN()), "Garret's after-lines end on the dog, and he stays at his cabin");
    w.ok(hear(w, 'lanternwood_l2', AVERIL_ROAD()).includes('I burnt it on the knoll'), 'on the road Averil comes back to her own lines');
  }
  { // The family brought over: the papers read, Averil in the hall, Nell met first.
    const w = newWalk(ok);
    w.party.flags.papers_read = 1;
    w.ok(!there(w, 'lanternwood_l2', AVERIL_ROAD()) && there(w, 'lantern_watch', AVERIL_HALL()), 'the papers read, Averil has gone from the road to the hall');
    hear(w, 'eaves_j2', NELL());
    w.ok(w.news.at(-1) === `New quest: ${FAMILY}.`, `Nell's first meeting begins ${FAMILY}`);
    w.ok(hear(w, 'lantern_watch', AVERIL_HALL()).includes('It went out the night the papers were read') && page(w, 'watch_lamp')?.begun === true, 'met first in the hall, Averil speaks of the lamp, and The Watch\'s Lamp begins');
    const before = xps(w);
    answerTo(w, 'lantern_watch', AVERIL_HALL(), { label: 'We\'ll bring them to you.' });
    w.ok(paid(w, before, 110) && /promise/.test(page(w, 'family')?.goal ?? '') && !w.party.bag.includes('warding_lamp'), `the promise carried, each member is paid 110, no lamp, and the goal is Garret (${page(w, 'family')?.goal})`);
    w.ok(hear(w, 'eaves_j2', GARRET()).startsWith('Garret listens'), 'Garret hears the promise');
    reads(w, 'family', ['garret', 'promise', 'gone'], ['lamp', 'lit'], 'the family brought over');
    w.ok(!there(w, 'eaves_j2', GARRET()) && !there(w, 'eaves_j2', NELL()) && !shows(w, 'eaves_j2', 'j2_steading') && shows(w, 'eaves_j2', 'j2_cabin_shut'), 'Garret and Nell are gone from the cabin, which stands shut');
    w.ok(there(w, 'lantern_watch', GARRET_IN()) && there(w, 'lantern_watch', NELL_IN()) && hear(w, 'lantern_watch', NELL_IN()).includes('Mam\'s not in the trees'), 'they are in the refectory');
    w.ok(hear(w, 'lantern_watch', AVERIL_HALL()).startsWith('"They\'re in the refectory'), 'Averil\'s after-lines are the family\'s');
  }
  { // The Dammed Fall: Orm's ask, the dam's gleaners won, the dam broken.
    const w = newWalk(ok);
    w.level = 15;
    w.ok(hear(w, 'eaves_k2', ORM()).includes('The shrine\'s owed a fall') && w.news.at(-1) === `New quest: ${DAM}.` && /dam/.test(page(w, 'dam')?.goal ?? ''), `Orm's first meeting begins ${DAM}, its goal the dam (${page(w, 'dam')?.goal})`);
    see(w, 'eaves_k2:k2_dam');
    w.ok(!there(w, 'eaves_k2', HEW()), 'before the gleaners are dead, Hew is not on the dam');
    fight(w, 'eaves_k2:k2_dam');
    w.ok(there(w, 'eaves_k2', HEW()) && /Hew/.test(page(w, 'dam')?.goal ?? ''), `the gleaners dead, Hew sits on the dam's end, and the goal is his question (${page(w, 'dam')?.goal})`);
    const before = xps(w);
    answerTo(w, 'eaves_k2', HEW(), { label: 'Break it.' });
    w.ok(paid(w, before, 110) && !there(w, 'eaves_k2', HEW()), 'the dam broken, each member is paid 110 and Hew is gone');
    reads(w, 'dam', ['orm', 'dam', 'hew', 'broken'], ['kept'], 'the dam broken');
    w.ok(shows(w, 'eaves_k2', 'k2_fall_running') && !shows(w, 'eaves_k2', 'k2_fall') && shows(w, 'lanternwood_l2', 'l2_lookout_fall') && !shows(w, 'lanternwood_l2', 'l2_lookout'), 'Sunderfall runs, and L2\'s lookout hears it');
    w.ok(!shows(w, 'eaves_k3', 'k3_door') && !shows(w, 'eaves_k2', 'k2_dam'), 'the gleaners on K3\'s first landing come no more, and the dam is gone');
    walkThrough(w, 'eaves_k3', 10, 7, SOUTH, 'the_sunder', 2);
    w.ok(hear(w, 'eaves_k2', ORM()).startsWith('Orm on his stone'), 'Orm\'s after-lines are the running fall\'s, and the way down the ledges still opens');
  }
  { // The Dammed Fall: the gleaners won before Orm is met, and the tally kept.
    const w = newWalk(ok);
    w.level = 15;
    fight(w, 'eaves_k2:k2_dam');
    w.ok(w.news.at(-1) === `New quest: ${DAM}.` && /Hew/.test(page(w, 'dam')?.goal ?? ''), `the gleaners killed first, ${DAM} begins, its goal Hew (${page(w, 'dam')?.goal})`);
    const before = xps(w);
    answerTo(w, 'eaves_k2', HEW(), { label: 'We\'ll take the tally.' });
    w.ok(paid(w, before, 110) && w.party.bag.includes('foremans_tally') && (readText(TABLES.items, 'foremans_tally') ?? []).join(' ').includes('SHEER POINT'), 'the tally kept, each member is paid 110, and the letter names Sheer Point');
    reads(w, 'dam', ['hew', 'kept'], ['broken'], 'the tally kept, Orm never met');
    w.ok(shows(w, 'eaves_k2', 'k2_fall') && !shows(w, 'eaves_k2', 'k2_fall_running') && shows(w, 'eaves_k3', 'k3_door'), 'the fall stays quiet and K3\'s gleaners still come');
    w.ok(hear(w, 'eaves_k2', ORM()).startsWith('"Still dry.'), 'Orm, met after, says the dam kept');
  }
  { // The Watch's Lamp: dark from the papers, Averil's ask, the casks, the wick, and the prior told on.
    const w = newWalk(ok);
    clock(w, 12);
    w.ok(shows(w, 'lanternwood_l2', 'l2_gate') && !shows(w, 'lanternwood_l2', 'l2_gate_dark') && !page(w, 'watch_lamp'), 'before the papers are read the lamp burns, and there is no quest');
    w.party.flags.papers_read = 1;
    w.ok(!shows(w, 'lanternwood_l2', 'l2_gate') && shows(w, 'lanternwood_l2', 'l2_gate_dark') && !shows(w, 'lanternwood_l2', 'l2_gate_lit'), 'the papers read, the gate says the lamp is dark');
    clock(w, 0);
    w.ok(shows(w, 'lantern_watch', 'lw_lamp_night_dark') && !shows(w, 'lantern_watch', 'lw_lamp_night'), 'and by night the yard has no moths');
    hear(w, 'lantern_watch', AVERIL_HALL());
    w.ok(w.news.at(-1) === `New quest: ${LAMP}.` && /casks/.test(page(w, 'watch_lamp')?.goal ?? ''), `Averil begins ${LAMP}, its goal the casks and the lamp (${page(w, 'watch_lamp')?.goal})`);
    w.ok(hear(w, 'lantern_watch', OSRIC()).includes('it is out'), 'the prior, met after the papers, says his lamp is out');
    w.ok(hear(w, 'lantern_watch', OSRIC()).includes('The oil was sold'), 'then that the oil was sold');
    w.ok(there(w, 'lantern_watch', CUTHWIN()) && hear(w, 'lantern_watch', CUTHWIN()).includes('Eleven') && page(w, 'watch_lamp')?.entries.some((e) => e.id === 'casks') === true, 'Cuthwin in the stores counts eleven casks');
    see(w, 'lantern_watch:lw_wick');
    w.ok(w.world.used('lw_wick') && /wick/.test(page(w, 'watch_lamp')?.goal ?? ''), `up at the Lamp Gallery the wick is seen cut, and the goal is the prior (${page(w, 'watch_lamp')?.goal})`);
    const before = xps(w);
    answerTo(w, 'lantern_watch', OSRIC(), { label: 'We\'ll tell her.' });
    w.ok(paid(w, before, 140) && !!w.party.flags.lanterns_split, 'the prior told on, each member is paid 140, and the split at the Watch opens');
    reads(w, 'watch_lamp', ['dark', 'casks', 'wick', 'exposed'], ['kept'], 'the prior told on');
    w.ok(!there(w, 'lantern_watch', OSRIC()) && there(w, 'lantern_watch', OSRIC_IN()) && hear(w, 'lantern_watch', ROOM()).includes('the prior at the desk'), 'the prior has left the yard for his room, and the room says so');
    w.ok(hear(w, 'lantern_watch', AVERIL_HALL()).startsWith('The great lamp turns overhead'), 'Averil\'s after-lines are the lamp lit');
    w.ok(shows(w, 'lantern_watch', 'lw_lamp_lit') && !shows(w, 'lantern_watch', 'lw_wick') && shows(w, 'lantern_watch', 'lw_lamp_night_lit'), 'the gallery and the yard have the lamp lit again');
    clock(w, 12);
    w.ok(shows(w, 'lanternwood_l2', 'l2_gate_lit') && !shows(w, 'lanternwood_l2', 'l2_gate_dark'), 'and so has the gate');
  }
  { // The Watch's Lamp: the wick found before Averil asks, and let be for the Watch's map.
    const w = newWalk(ok);
    w.party.flags.papers_read = 1;
    see(w, 'lantern_watch:lw_wick');
    w.ok(w.news.at(-1) === `New quest: ${LAMP}.` && /wick/.test(page(w, 'watch_lamp')?.goal ?? ''), `the wick found first begins ${LAMP}, its goal the prior (${page(w, 'watch_lamp')?.goal})`);
    w.ok(hear(w, 'lantern_watch', OSRIC()).includes('it is out'), 'the prior meets the company first');
    const before = xps(w);
    answerTo(w, 'lantern_watch', OSRIC(), { label: 'We\'ll let it be.' });
    w.ok(paid(w, before, 140) && w.party.bag.includes('watch_map') && (readText(TABLES.items, 'watch_map') ?? []).join(' ').includes('ruled edge to edge') && !w.party.flags.lanterns_split, 'let be, each member is paid 140, the Watch\'s map is in the pack, and nothing splits');
    reads(w, 'watch_lamp', ['wick', 'kept'], ['dark', 'exposed'], 'the prior let be');
    w.ok(there(w, 'lantern_watch', OSRIC()) && !there(w, 'lantern_watch', OSRIC_IN()) && hear(w, 'lantern_watch', OSRIC()).startsWith('"It burns.'), 'the prior stays in the yard, and his after-lines are the price');
    w.ok(hear(w, 'lantern_watch', AVERIL_HALL()).includes('It went out the night') && hear(w, 'lantern_watch', AVERIL_HALL()).startsWith('"The oil came.'), 'Averil, met after, speaks of the lamp once, then says the oil came');
  }
  { // The Length of the Wall: asked once the wall is touched, both ends walked, the measure sold.
    const w = newWalk(ok);
    w.ok(hear(w, 'lantern_watch', BRINK()).includes('My line ran out') && !page(w, 'length'), 'Brink met before the wall says his own lines, and asks nothing');
    see(w, 'the_sunder2:su2_wall');
    hear(w, 'lantern_watch', BRINK());
    w.ok(w.news.at(-1) === `New quest: ${LENGTH}.` && /west till it ends/.test(page(w, 'length')?.goal ?? ''), `the wall touched, Brink asks its length (${page(w, 'length')?.goal})`);
    see(w, 'the_sunder2:su2_east_end');
    w.ok(!!w.party.flags.q_wall_east && /Walk/.test(page(w, 'length')?.goal ?? ''), 'the east end walked, the west is still to walk');
    see(w, 'the_sunder2:su2_fall');
    w.ok(/Answer Brink/.test(page(w, 'length')?.goal ?? ''), `both ends walked, the goal is Brink (${page(w, 'length')?.goal})`);
    const before = xps(w), gold = w.party.gold;
    answerTo(w, 'lantern_watch', BRINK(), { label: 'Sell the measure.' });
    w.ok(paid(w, before, 140) && w.party.gold === gold + 500, 'the measure sold, each member is paid 140 and the company 500 gold');
    reads(w, 'length', ['brink', 'east', 'both', 'sold'], ['told'], 'the measure sold');
    w.ok(hear(w, 'lantern_watch', BRINK()).startsWith('"It\'s in the post'), 'Brink\'s after-lines are the sale\'s');
  }
  { // The Length of the Wall: the ends walked before he asks, and the Watch told; Averil and the Reader say so once.
    const w = newWalk(ok);
    see(w, 'the_sunder2:su2_wall');
    see(w, 'the_sunder2:su2_fall');
    see(w, 'the_sunder2:su2_east_end');
    hear(w, 'lantern_watch', BRINK());
    w.ok(!page(w, 'length') && hear(w, 'lantern_watch', BRINK()).startsWith('"You\'ve been down') && /Answer Brink/.test(page(w, 'length')?.goal ?? ''), 'the ends walked first, Brink introduces himself, then asks, and his question is next');
    const before = xps(w), gold = w.party.gold;
    answerTo(w, 'lantern_watch', BRINK(), { label: 'We\'ll tell the Watch too.' });
    w.ok(paid(w, before, 140) && w.party.gold === gold, 'the Watch told, each member is paid 140 and no gold');
    reads(w, 'length', ['brink', 'east', 'both', 'told'], ['sold'], 'the Watch told');
    const road = [hear(w, 'lanternwood_l2', AVERIL_ROAD()), hear(w, 'lanternwood_l2', AVERIL_ROAD()), hear(w, 'lanternwood_l2', AVERIL_ROAD())];
    w.ok(road[0].includes('I burnt it on the knoll') && road[1].startsWith('"The surveyor\'s wall.') && road[2].includes('I burnt it on the knoll'), 'Averil on the road says the wall once, after her own lines, and goes back to them');
    w.party.flags.watch_reader_met = 1;
    w.ok(hear(w, 'lantern_watch', READER).startsWith('"The surveyor\'s six words') && !hear(w, 'lantern_watch', READER).startsWith('"The surveyor\'s six words'), 'the Reader says the wall once');
  }
}

/** The Sunder's own kinds: its Rift's sunderlings, Warden and hounds, and the glass beasts. */
const SUNDER_KINDS = ['sunderling', 'sunder_warden', 'sunder_hound', 'glass_spider', 'glass_bear'];
/** The Sunder's groups (#765): those the most of whose monsters are its own, the K3 Rift's two with them, but a den's keepers and brood and its Warden. */
const STILLED = ['eaves_j2:j2_hounds', 'eaves_k2:k2_hounds', 'eaves_k2:k2_bears', 'eaves_k3:k3_bears', 'lanternwood_l2:l2_hounds', 'lanternwood_l2:l2_bears', 'lanternwood_l3:l3_bank',
  'lanternwood_l4:l4_night', 'lanternwood_m2:m2_hounds', 'lanternwood_m2:m2_bears', 'the_sunder:su1_spiders', 'the_sunder2:su2_wood', 'the_sunder2:su2_bears',
  'k3_rift:k3_rift_g1', 'k3_rift:k3_rift_g2'];

/**
 * The road behind (#765): once the crack is sealed below (#56's 61, the Ways), the Sunder's groups stand
 * down by the leave rule, standing or killed, and none comes back; widened, or never found, they stand as
 * they did. The Watch's Reader says the beasts have stopped, and each ending's word is hers first of all.
 * The flags are set by hand.
 */
function stilled(ok: (cond: boolean, msg: string) => void): void {
  const group = (at: string): EncounterDef => { const [map, id] = at.split(':'); return MAP_DEFS.find((d) => d.id === map)!.encounters!.find((g) => g.id === id)!; };
  const HESTER = MAP_DEFS.find((d) => d.id === 'lantern_watch')!.features!.find((f): f is Person => f.kind === 'npc' && f.name.startsWith('Hester Dunmore'))!;
  const ready = (...flags: string[]): Walk => { const v = newWalk(ok); for (const f of ['watch_reader_met', 'papers_read', ...flags]) v.party.flags[f] = 1; return v; };
  const says = (v: Walk): string => { v.world.travel('lantern_watch', HESTER.x, HESTER.y); const t = meet(HESTER, v.party, heard(v.world, HESTER)).text; listen(v); return t; };
  const others = MAP_DEFS.flatMap((d) => (d.encounters ?? []).filter((g) => g.monsters.some((m) => SUNDER_KINDS.includes(m))).map((g) => `${d.id}:${g.id}`)).filter((at) => !STILLED.includes(at));
  ok(STILLED.every((at) => { const g = group(at); return !!g.leaves && JSON.stringify(g.until) === JSON.stringify({ flag: CRACK_SEALED }) && g.monsters.filter((m) => SUNDER_KINDS.includes(m)).length * 2 > g.monsters.length; }),
    `the Sunder's ${STILLED.length} groups leave once the crack is sealed; the rest with its kinds in them stay (${others.join(', ')})`);
  for (const wide of [false, true]) {
    const v = ready(...(wide ? [CRACK_WIDE] : []));
    ok(STILLED.every((at) => !v.world.ended(group(at))) && says(v).startsWith('She has the wick in its dish lit now'),
      `the crack ${wide ? 'widened' : 'not sealed'}: the Sunder's groups stand as they did, and the Reader says what she did`);
  }
  const v = ready();
  for (const at of STILLED.slice(0, 3)) { const g = group(at); v.world.travel(at.split(':')[0], g.x, g.y); v.world.killGroups([g.id]); }
  v.party.flags[CRACK_SEALED] = 1;
  for (const at of STILLED) gone(v, at);
  v.world.advance(2 * 1440 + 1);
  const back = STILLED.filter((at) => live(v, at)), word = says(v);
  ok(!back.length && word === '"The Sunder\'s beasts have stopped. The wall at the bottom is warm in one place, the surveyor says, and nothing comes out of it now."',
    `the crack sealed, standing or killed none comes back two days on${back.length ? ' -> ' + back.join(', ') : ''}, and the Reader says the beasts have stopped`);
  ok(says(v).startsWith('She has the wick in its dish lit now') && !!v.party.flags.q_reader_crack, 'the crack is said once: at the next meeting she is on to the papers');
  // The crack's word is said once, at the next meeting whichever came first, an ending or the seal (#795); the
  // ending's word is hers at every meeting, and comes before every other of her words but the once-said ones.
  const WORDS: Record<string, string> = { reignite: '"Every lamp in the house burns steadier', arrive: '"The prior says we were the jailers.', finish: '"The Hearth burns harder' };
  const CRACK = '"The Sunder\'s beasts have stopped.';
  for (const [id, e] of Object.entries(ENDINGS)) {
    const sealed = ready(CRACK_SEALED, e.flag), told = [says(sealed), says(sealed), says(sealed)];
    ok(told[0].startsWith(CRACK) && told[1].startsWith(WORDS[id]) && told[2].startsWith(WORDS[id]),
      `the crack sealed and then ${e.flag}: the Reader says the beasts have stopped once, and the ending's word after it at every meeting (${told.map((t) => t.slice(0, 22)).join(' / ')})`);
    const later = ready(e.flag), first = [says(later), says(later)];
    later.party.flags[CRACK_SEALED] = 1;
    const then = [says(later), says(later), says(later)];
    ok(first.every((t) => t.startsWith(WORDS[id])) && then[0].startsWith(CRACK) && then[1].startsWith(WORDS[id]) && then[2].startsWith(WORDS[id]) && !!later.party.flags.q_reader_crack,
      `${e.flag} and then the crack sealed: the ending's word at every meeting, the crack's once at the next after the seal, and not twice (${then.map((t) => t.slice(0, 22)).join(' / ')})`);
  }
  { // An ending before the papers are read, or before she has met the company: the reading and the introduction wait for no ending's word (#795).
    const read = newWalk(ok);
    for (const f of ['watch_reader_met', ENDINGS.finish.flag]) read.party.flags[f] = 1;
    read.party.bag.push('ships_papers');
    const t = [says(read), says(read)];
    ok(t[0].startsWith('She sees the papers before she sees you') && !!read.party.flags.papers_read && !!read.party.flags.seal_read && t[1].startsWith(WORDS.finish),
      `after an ending, the papers carried to her are read first, once, and then the ending's word (${t.map((x) => x.slice(0, 22)).join(' / ')})`);
    const met = newWalk(ok);
    met.party.flags[ENDINGS.reignite.flag] = 1;
    const u = [says(met), says(met)];
    ok(u[0].startsWith('A woman at the desk') && !!met.party.flags.watch_reader_met && u[1].startsWith(WORDS.reignite),
      `after an ending, a company she has not met hears her introduction first, which the reading needs, and then the ending's word (${u.map((x) => x.slice(0, 22)).join(' / ')})`);
  }
}
