// Wrackholm's walkthrough. First its chapter, The Stone Carried Home (#191), played a step at a
// time (tools/walk.ts) on from Saltreach's runs, which leave the company on the landing. In order:
// the Foreland, the Grove and the Tide Stone played from a new game; Kelp Hole's crates, east over
// the moor at 13 and out to the ship by night; the decks at 12, the captain's table, Hale freed and
// the Warden at 14 for the Stone; and home by the boat and the fen to the plinth, which ends the Tide
// Stone and this chapter, begins the Wall, lights the Hearth, quiets the fen's Rifts and sets the
// temples singing. Saltmouth first, the temples not seen: the ship boarded with the table left
// shut, the Stone home, then back aboard for the papers; and the temples sing though the count goes
// on below. Hale waits on #156, set by hand where it will be.
//
// Then the built maps as a company the boat has put ashore at 12: the landing, the gulls'
// roof and the cache under it, found by a search and not told, and every group of E6 won at the
// floor; then up into Kelp Hole, its crews and overseers, the strongbox and the brother by the
// rows; down to the sea cave, the boy at the black pool and the beast at 14; and out by the flooded
// passage, found by the tide-mark and not told, onto F6's east shore. Last, east over the moor into
// F6 at 13: the hermit's tally, the door in the cairn on the point found by a search, the founder's
// seal in the grave, and every group of F6 won at its floor. Then out to the Tide Ship by night in
// Dando's boat: the devilfish over the side; the rats and the Hand's post on the lower deck, and the
// papers, the log and the cutlass in the cabin; the hold's crew, strangers in the last row while Hale
// holds the Scarth and Hale once he is taken from it, freed and gone; the straw that is fresh on one
// side, and the shard-cut behind it found by a search and not told; the tear, the Warden at 14 and
// the Stone; and down the hatch to the stair's foot, and back up.
//
// Last, the side quests (#192), each played both ways and in more than one order: Kitto asks and
// the truth is told, so the cove's landing crew comes no more, or Colan is met first and his letter
// carried; Merryn's letter after a Not yet to the Keel, or at once to Tallis; Hale at the rail asks
// for the clerk's book and the thirty go to Saltmouth, or the book is found first and they go home
// by the road, where Wat has words with the board in the loft and without; and Tam left feeding the
// beast and his mother told, or the beast slain before she is met and Tam home on the steps.
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen, walkThrough, meetWho, playChapter, ending, everyGoalWalked, goalFromBegun, quest } from '../../../../tools/walk.ts';
import type { Step, Walk } from '../../../../tools/walk.ts';
import { CHAPTER } from './chapter.ts';
import { CHAPTER as TIDE } from '../saltreach/chapter.ts';
import { inOrder, saltmouthFirst } from '../saltreach/walkthrough.ts';
import { stonesRestored } from '../../../game/stones.ts';
import { meet, heard, answer } from '../../../game/people.ts';
import { questLog } from '../../../game/quests.ts';
import type { PageView } from '../../../game/quests.ts';
import type { Person } from '../../../game/people.ts';
import { take } from '../../../game/passage.ts';
import { NORTH, EAST, SOUTH, WEST } from '../../../game/types.ts';
import { MAP_DEFS, GUILD_QUESTS } from '../../index.ts';
import { rankFlag, takenFlag, doneFlag } from '../../guilds.ts';
import { take as takeWork, report, offered, rankOf } from '../../../game/guilds.ts';
import type { Party } from '../../../game/party.ts';
import { WRACKHOLM_E6 } from './maps/wrackholm_e6.ts';
import { WRACKHOLM_F6 } from './maps/wrackholm_f6.ts';
import { SMUGGLERS_COVE } from './maps/smugglers_cove.ts';
import { SMUGGLERS_COVE2 } from './maps/smugglers_cove2.ts';
import { TIDE_SHIP } from './maps/tide_ship.ts';
import { TIDE_SHIP2 } from './maps/tide_ship2.ts';
import { TIDE_SHIP3, TIDE_RIFT } from './maps/tide_ship3.ts';
import { DEAD_DROP_STAIR } from './maps/dead_drop_stair.ts';

/** The clock on to the next hour given. */
const clock = (w: Walk, hour: number): void => { const m = w.world.state.minutes; w.world.state.minutes = m - (m % 1440) + 1440 + hour * 60; };
/** A chest opened: its gold and its items into the purse and the bag. */
function open(w: Walk, map: string, id: string): readonly string[] {
  const c = MAP_DEFS.find((d) => d.id === map)!.features!.find((f) => f.kind === 'chest' && f.id === id);
  if (c?.kind !== 'chest') { w.ok(false, `there is a chest ${map}:${id}`); return []; }
  w.world.travel(map, c.x, c.y);
  w.world.markUsed(c.id); w.party.gold += c.gold; w.party.bag.push(...c.items);
  return c.items;
}

// ---- the chapter (#191) ----

const E6 = WRACKHOLM_E6, F6 = WRACKHOLM_F6;
const KITTO = E6.features!.find((f): f is Person => f.kind === 'npc' && !!f.passage?.length)!;
const DANDO = F6.features!.find((f): f is Person => f.kind === 'npc' && !!f.passage?.length)!;
const B5 = MAP_DEFS.find((d) => d.id === 'delta_b5')!;
const COUNTER = B5.features!.find((f): f is Person => f.kind === 'npc' && f.name.startsWith('a hermit'))!;

/** East over the moor into F6 at 13, and out to the ship in Dando's boat by night. */
function outToTheShip(w: Walk): void {
  w.level = 13;
  walkThrough(w, E6.id, 30, 12, EAST, F6.id, 4);
  fight(w, `${F6.id}:f6_crew`);
  clock(w, 23);
  see(w, `${F6.id}:f6_boats`);
  w.world.travel(F6.id, DANDO.x, DANDO.y);
  meet(DANDO, w.party, heard(w.world, DANDO));
  w.party.gold += DANDO.passage![0].fare;
  const rowed = take(DANDO.passage![0], w.world, w.party);
  w.ok(rowed.taken && w.world.state.mapId === TIDE_SHIP.id, 'Dando rows the company out to the ship by night');
  see(w, `${TIDE_SHIP.id}:ts_aboard`);
}

/**
 * The decks at 12, the captain's table opened or left shut, the hold's crew and Hale freed if he is
 * there, past the elder at the bulkhead door, and the Warden at 14 for the Stone.
 */
function theStone(table: boolean): (w: Walk) => void {
  return (w) => {
    const ship = TIDE_SHIP, lower = TIDE_SHIP2, hold = TIDE_SHIP3;
    w.level = 12;
    for (const g of ship.encounters ?? []) fight(w, `${ship.id}:${g.id}`);
    walkThrough(w, ship.id, 8, 5, NORTH, lower.id, 2);
    for (const g of lower.encounters ?? []) fight(w, `${lower.id}:${g.id}`);
    if (table) { see(w, `${lower.id}:ts2_cabin`); open(w, lower.id, 'ts2_table'); listen(w); }
    walkThrough(w, lower.id, 4, 9, SOUTH, hold.id, 2);
    see(w, `${hold.id}:ts3_beam`);
    fight(w, `${hold.id}:ts3_crew`);
    if (w.party.flags.q_hale_taken) meetWho(w, 'q_hale_freed');
    else see(w, `${hold.id}:ts3_last_row`);
    fight(w, `${hold.id}:ts3_elder`);
    see(w, `${hold.id}:ts3_forward`);
    const tear = hold.features!.find((f) => f.kind === 'rift')!;
    walkThrough(w, hold.id, tear.x, tear.y + 1, NORTH, TIDE_RIFT.map.id, 1);
    for (const g of (TIDE_RIFT.map.encounters ?? []).filter((e) => !e.id.endsWith('_warden'))) fight(w, `${TIDE_RIFT.map.id}:${g.id}`);
    w.level = 14;
    fight(w, `${TIDE_RIFT.map.id}:tide_ship_rift_warden`);
    open(w, TIDE_RIFT.map.id, 'tide_ship_rift_hoard');
    listen(w);
    w.ok(w.party.bag.includes('tide_stone'), 'beside the fallen Warden, the Tide Stone, carried');
  };
}

/** Over the side to the shingle, Kitto's boat back to Saltmouth, out by the land gate, and west over the fen to the plinth. */
function home(w: Walk): void {
  w.level = 12;
  walkThrough(w, TIDE_SHIP.id, 5, 9, WEST, F6.id, 1);
  w.world.travel(E6.id, KITTO.x, KITTO.y);
  w.party.gold += KITTO.passage![0].fare;
  const back = take(KITTO.passage![0], w.world, w.party);
  w.ok(back.taken && w.world.state.mapId === 'saltmouth', 'Kitto takes the company back to Saltmouth\'s quay');
  walkThrough(w, 'saltmouth', 7, 1, NORTH, 'saltings_c6', 2);
  walkThrough(w, 'saltings_c6', 26, 1, NORTH, 'delta_c5', 3);
  walkThrough(w, 'delta_c5', 0, 13, WEST, 'delta_b5', 2);
  meetWho(w, 'q_tide_home');
  w.ok(!!w.party.flags.q_tide_home && !w.party.bag.includes('tide_stone'), 'the plinth takes the Stone, and the Stone is home');
}

/** Back out to the ship for the papers left on the captain's table. */
function thePapers(w: Walk): void {
  w.level = 12;
  w.world.travel('saltmouth', 14, 10);
  const kitto = MAP_DEFS.find((d) => d.id === 'saltmouth')!.features!.find((f): f is Person => f.kind === 'npc' && !!f.passage?.length)!;
  w.party.gold += kitto.passage![0].fare;
  take(kitto.passage![0], w.world, w.party);
  listen(w);
  w.level = 13;
  walkThrough(w, E6.id, 30, 12, EAST, F6.id, 4);
  clock(w, 23);
  w.world.travel(F6.id, DANDO.x, DANDO.y);
  w.party.gold += DANDO.passage![0].fare;
  take(DANDO.passage![0], w.world, w.party);
  w.level = 12;
  walkThrough(w, TIDE_SHIP.id, 8, 5, NORTH, TIDE_SHIP2.id, 2);
  open(w, TIDE_SHIP2.id, 'ts2_table');
  listen(w);
  w.ok(w.party.bag.includes('ships_papers') && w.party.bag.includes('ships_log'), 'the papers and the log, off the captain\'s table');
}

/** The chapter in order: by Kelp Hole's crates out to the ship, the Stone and the table, and home. */
export const STEPS: readonly Step[] = [
  { name: 'out to the ship', play: (w) => { walkThrough(w, E6.id, 18, 13, NORTH, SMUGGLERS_COVE.id, 2); see(w, `${SMUGGLERS_COVE.id}:kh1_crates`); walkThrough(w, SMUGGLERS_COVE.id, 12, 13, SOUTH, E6.id, 2); outToTheShip(w); } },
  { name: 'the Stone', play: theStone(true) },
  { name: 'home', play: home },
];

/** The entries written on the chapter's page. */
const written = (w: Walk): string[] => (quest(w)?.pages.find((p) => p.def === CHAPTER)?.entries ?? []).map((e) => e.id);

/** What the Stone home changes outside the log: the Hearth, the fen's Rifts, the hermit, the porch. */
function stoneHomeShows(w: Walk, how: string): void {
  w.ok(stonesRestored(w.world.state, w.party) === 1, `${how}: the Tide Stone home is the Hearth's first step`);
  const rifts = ['b5_rift_n', 'b5_rift_s', 'c5_rift'].map((id) => MAP_DEFS.find((d) => d.id === id)!);
  const tears = rifts.map((r) => r.features!.find((f) => f.kind === 'event' && f.id === `${r.id}_tear`)!);
  w.ok(tears.every((t) => t.kind === 'event' && w.world.ended(t)), `${how}: the fen's Rifts go quiet with the Stone home, their wardens standing`);
  w.world.travel(B5.id, COUNTER.x, COUNTER.y);
  w.ok(meet(COUNTER, w.party, heard(w.world, COUNTER)).text.startsWith('"None tonight'), `${how}: the hermit on the hummock counts no lights`);
  see(w, 'delta_b6:b6_stair_sing');
  w.ok(w.world.used('b6_stair_sing') && !w.world.used('b6_stair'), `${how}: at the far roof's porch, something sings below`);
}

/** In order, and with the ship boarded before the temples are seen. */
function theStoneCarriedHome(ok: (cond: boolean, msg: string) => void): void {
  const chain = inOrder(ok);
  goalFromBegun(chain, 'in order, on the isle');
  playChapter(chain, CHAPTER, STEPS, 'in order');
  ok(['cove', 'ship', 'hold', 'hale', 'papers', 'stone', 'home'].every((e) => written(chain).includes(e)), `in order, the whole chapter is written (${written(chain).join(', ')})`);
  const said = chain.news.slice(chain.news.lastIndexOf('Chapter complete: The Tide Stone.'));
  ok(said.join(' ') === 'Chapter complete: The Tide Stone. Chapter complete: The Stone Carried Home. New chapter: The Wall.', `in order, the plinth ends the Tide Stone and the Stone Carried Home, and begins the Wall (${said.join(' ')})`);
  const wall = quest(chain)?.goal ?? '';
  ok(/^Go east through the Eaves/.test(wall), `in order, the Wall's goal is the way east (${wall})`);
  stoneHomeShows(chain, 'in order');
  const want = ending(chain, 'in order', CHAPTER);

  // Saltmouth first, the temples not seen: the table left shut, the Stone home, then the papers.
  const first = saltmouthFirst(ok);
  playChapter(first, CHAPTER, [
    { name: 'out to the ship', play: outToTheShip },
    { name: 'the Stone, the table shut', play: theStone(false) },
    { name: 'home', play: home },
    { name: 'the papers', play: thePapers },
  ], 'Saltmouth first');
  ok(first.news.includes('Chapter complete: The Tide Stone.') && first.news.at(-1) === 'New chapter: The Wall.', `Saltmouth first, the papers taken end the chapter and begin the Wall (${first.news.slice(-2).join(' ')})`);
  goalFromBegun(first, 'Saltmouth first, the papers taken');
  stoneHomeShows(first, 'Saltmouth first');
  // The temples first seen with the Stone home: the god sings at the apse's stair, though the count
  // goes on below while the Choirmaster stands.
  walkThrough(first, 'delta_b6', 16, 12, NORTH, 'drowned_temples', 2);
  // Up the nave's east side, wide of the stair's own square: the song is heard all the same, and once.
  first.world.travel('drowned_temples', 9, 3);
  const heard9 = first.world.eventsHere();
  first.world.travel('drowned_temples', 8, 3);
  const heard8 = first.world.eventsHere();
  first.world.travel('drowned_temples', 8, 2);
  const atStair = first.world.eventsHere();
  listen(first);
  ok(heard9.length === 1 && first.world.used('dt1_sing_9') && !heard8.length && !atStair.length && !first.world.used('dt1_stair') && !first.world.used('dt1_stair_quiet'),
    'Saltmouth first, the song comes up the apse\'s stair to whichever side of the nave the company walks, once, and no count comes up it');
  const tide = (w: Walk): string[] => (quest(w)?.pages.find((p) => p.def === TIDE)?.entries ?? []).map((e) => e.id);
  ok(JSON.stringify(tide(first)) === JSON.stringify(['plinth', 'ship']), `Saltmouth first, the Tide Stone holds only what was seen and said (${tide(first).join(', ')})`);
  const read = written(first).map((e) => `wrack.${e}`).sort();
  ok(JSON.stringify(read) === JSON.stringify(want.filter((e) => e.startsWith('wrack.') && e !== 'wrack.cove' && e !== 'wrack.hale')), `Saltmouth first, the chapter reads as in order, without the crates and Hale (${read.join(', ')})`);

  everyGoalWalked(ok, [CHAPTER]);
}

export const walkthrough: Walkthrough = (ok) => {
  theStoneCarriedHome(ok);
  sideQuests(ok);

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
  ok(w.world.peopleAt(13, 12).map((p) => p.flag).join() === 'q_feed_home', 'with the beast dead, the boy at the pool has done with feeding it');

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

  // Out to the Tide Ship. By day the shingle is empty; by night Dando rows whoever pays.
  const ship = TIDE_SHIP, lower = TIDE_SHIP2, hold = TIDE_SHIP3, foot = DEAD_DROP_STAIR;
  const pender = f6.features!.find((f): f is Person => f.kind === 'npc' && !!f.passage?.length)!;
  clock(w, 12);
  w.world.travel(f6.id, pender.x, pender.y);
  ok(!w.world.present(pender), 'by day nobody on the shingle rows out to the ship');
  clock(w, 23);
  w.world.travel(f6.id, pender.x, pender.y);
  ok(w.world.present(pender) && meet(pender, w.party, heard(w.world, pender)).text.startsWith('An old man sits on a thwart'), 'by night Dando sits in his boat on the shingle');
  w.party.gold += 20;
  const rowed = take(pender.passage![0], w.world, w.party);
  ok(rowed.taken && w.world.state.mapId === ship.id && w.world.hour < 6, 'he rows the company out, and it comes aboard by night');
  see(w, `${ship.id}:ts_aboard`);
  w.level = 12;
  for (const g of ship.encounters ?? []) fight(w, `${ship.id}:${g.id}`);
  ok(open(w, ship.id, 'ts_locker').includes('potion_heal'), 'the deck locker holds the crews\' draughts');

  // The lower deck: the rats and the Hand's post, and the captain's cabin.
  walkThrough(w, ship.id, 8, 5, NORTH, lower.id, 2);
  for (const g of lower.encounters ?? []) fight(w, `${lower.id}:${g.id}`);
  see(w, `${lower.id}:ts2_cabin`);
  const table = open(w, lower.id, 'ts2_table'), sea = open(w, lower.id, 'ts2_sea_chest');
  ok(table.includes('ships_papers') && table.includes('ships_log') && sea.includes('tide_cutlass'), 'on the captain\'s table the papers and the log, and in his sea chest the cutlass');

  // The hold: the crew among the rows, and in the last row strangers, while Hale holds the Scarth.
  walkThrough(w, lower.id, 4, 9, SOUTH, hold.id, 2);
  see(w, `${hold.id}:ts3_beam`);
  const hale = hold.features!.find((f): f is Person => f.kind === 'npc' && f.flag === 'q_hale_freed')!;
  fight(w, `${hold.id}:ts3_crew`);
  w.world.travel(hold.id, hale.x, hale.y - 1, SOUTH);
  ok(!w.world.present(hale) && w.world.peopleAt(hale.x, hale.y).length === 0, 'while Hale holds the Scarth, he is not in the last row');
  see(w, `${hold.id}:ts3_last_row`);
  ok(w.world.used('ts3_last_row'), 'strangers sit in the last row');
  // Taken from the Scarth: #156 sets the flag when it puts strangers at the pass.
  w.party.flags.q_hale_taken = 1;
  w.world.travel(hold.id, hale.x, hale.y - 1, SOUTH);
  ok(w.world.present(hale), 'once he is taken from the Scarth and the crew is down, Hale is in the last row');
  ok(meet(hale, w.party, heard(w.world, hale)).text.includes('The Regent got his copy') && !!w.party.flags.q_hale_freed, 'he knows the company, says who came for him, and is freed');
  ok(!w.world.present(hale), 'freed, he is gone over the side with the rest');
  listen(w);

  // The straw is fresh on one side, and a search there finds the shard-cut past the elder's door.
  const straw = hold.features!.find((f) => f.kind === 'event' && f.id === 'ts3_straw')!, cut = hold.secrets![0];
  ok(cut.hint === 'ts3_straw' && straw.x === cut.x && straw.y === cut.y + 1, 'the straw is seen from the square aft of the shard-cut');
  see(w, `${hold.id}:ts3_straw`);
  w.world.travel(hold.id, straw.x, straw.y, NORTH);
  let cutFound = false;
  for (let i = 0; i < 20 && !cutFound; i++) cutFound = w.world.search();
  ok(cutFound, 'a search at the fresh straw finds the shard-cut in the bulkhead');
  w.world.move('forward'); w.world.move('forward');
  ok(w.world.state.mapId === hold.id && w.world.state.y === cut.y - 1, 'through it, the forward hold, past the elder at the door');
  ok(open(w, hold.id, 'ts3_strongbox').includes('long_axe+1'), 'the Hand\'s strongbox stands in the forward hold, the Long Axe +1 in it');
  see(w, `${hold.id}:ts3_forward`);
  fight(w, `${hold.id}:ts3_elder`);

  // The tear: the Rift's rooms at its floor, the Warden at 14, and the Stone beside it.
  const tear = hold.features!.find((f) => f.kind === 'rift')!;
  walkThrough(w, hold.id, tear.x, tear.y + 1, NORTH, TIDE_RIFT.map.id, 1);
  for (const g of (TIDE_RIFT.map.encounters ?? []).filter((e) => !e.id.endsWith('_warden'))) fight(w, `${TIDE_RIFT.map.id}:${g.id}`);
  w.level = 14;
  fight(w, `${TIDE_RIFT.map.id}:tide_ship_rift_warden`);
  ok(open(w, TIDE_RIFT.map.id, 'tide_ship_rift_hoard').includes('tide_stone') && w.party.bag.includes('tide_stone'), 'beside the fallen Warden, the Tide Stone');

  // The hatch aft: the stair's foot, at the Dead-Drop's band, and the way back up.
  see(w, `${hold.id}:ts3_hatch`);
  walkThrough(w, hold.id, 7, 13, SOUTH, foot.id, 1);
  ok(w.world.map.def.band?.[0] === 26, 'the stair\'s foot is the Dead-Drop\'s country, 26 and over, as its sign says');
  fence(w);
  see(w, `${foot.id}:dd_door`);
  walkThrough(w, foot.id, 4, 6, SOUTH, hold.id, 1);
};

/**
 * The Compact's Fence's rung at the stair's foot (DESIGN §8, #635), on copies of the walk's company
 * made Fences who have done the first rank. A Runner is not offered it and a Fence is. Taken with the
 * foot unseen, the hall pays nothing; the foot seen, the report pays 200 gold, says not yet and makes
 * the company a Factor. A company that had seen the foot before it took the quest is paid at the
 * taking, with the words for one that came early.
 */
function fence(w: Walk): void {
  const q = GUILD_QUESTS.find((g) => g.id === 'compact_fence')!;
  const fenced = (): Party => {
    const p: Party = structuredClone(w.party);
    for (const id of ['compact_run', 'compact_crate', 'compact_lookout']) p.flags[takenFlag(id)] = p.flags[doneFlag(id)] = 1;
    p.flags[rankFlag('compact')] = 2;
    return p;
  };
  const runner: Party = structuredClone(w.party), p = fenced();
  runner.flags[rankFlag('compact')] = 1;
  w.ok(!offered('compact', runner).some((o) => o.id === q.id) && offered('compact', p).map((o) => o.id).join() === q.id,
    `${q.title}: a Runner is not offered it, and a Fence is, alone`);
  const gold = p.gold;
  w.ok(!takeWork(q, w.world.state, p).length && !report('compact', w.world.state, p).length && rankOf('compact', p) === 2,
    'taken with the stair\'s foot unseen, the hall pays nothing');
  see(w, `${DEAD_DROP_STAIR.id}:dd_foot`);
  const said = report('compact', w.world.state, p);
  w.ok(said.length === 2 && said[0].startsWith(q.paid[0]) && /not yet/i.test(said[0]) && said[1] === 'Your rank with the Salt Compact is now Factor.' && p.gold === gold + 200 && rankOf('compact', p) === 3,
    `the foot seen, the hall pays 200 gold, says not yet and makes the company a Factor (${said.join(' ').replace(/\n+/g, ' ')})`);
  const late = fenced(), early = takeWork(q, w.world.state, late);
  w.ok(early.length === 2 && early[0].startsWith(q.early![0]) && /not yet/i.test(early[0]) && late.gold === gold + 200 && rankOf('compact', late) === 3,
    `a company that had seen the foot is paid at the taking, with the early words (${early.join(' ').replace(/\n+/g, ' ')})`);
}

// ---- the side quests (#192) ----

/** A side quest's page as the log shows it now. */
const page = (w: Walk, id: string): PageView | undefined => questLog(w.world.state, w.party).find((v) => v.def.id === id)?.pages[0];

/** The person on `map` whose name starts so and who stands on `x,y`, and is keyed by `flag` if given: one of a person's places. */
function who(map: string, x: number, y: number, name: string, flag?: string): Person {
  const p = MAP_DEFS.find((d) => d.id === map)?.features?.find((f): f is Person => f.kind === 'npc' && f.x === x && f.y === y && f.name.startsWith(name) && (flag === undefined || f.flag === flag));
  if (!p) throw new Error(`no ${name} at ${map} ${x},${y}`);
  return p;
}
const KITTO_E6 = (): Person => who('wrackholm_e6', 15, 14, 'Kitto'), COLAN = (): Person => who('smugglers_cove', 12, 5, 'Colan');
const MERRYN = (): Person => who('wrackholm_f6', 26, 13, 'Merryn');
const RUAN = (): Person => who('saltmouth', 12, 4, 'Ruan'), TALLIS = (): Person => who('saltmouth', 8, 11, 'Jory Tallis');
const HALE_IRONS = (): Person => who('tide_ship3', 10, 12, 'Captain Hale, in irons'), HALE_DECK = (): Person => who('tide_ship', 5, 10, 'Captain Hale');
const BOY_DECK = (): Person => who('tide_ship', 6, 11, 'Wat\'s elder boy'), BOY_QUAY = (): Person => who('saltmouth', 10, 10, 'Wat\'s elder boy');
const BOY_HOME = (): Person => who('downs_f3', 10, 14, 'Wat\'s elder boy'), WAT = (): Person => who('downs_f3', 11, 14, 'Wat,');
const LOVEDAY = (): Person => who('saltmouth', 8, 13, 'Loveday');
const TAM = (): Person => who('smugglers_cove2', 13, 12, 'Tam', 'q_feed_tam'), TAM_FREE = (): Person => who('smugglers_cove2', 13, 12, 'Tam', 'q_feed_home');
const TAM_HOME = (): Person => who('saltmouth', 9, 13, 'Tam');

/** Whether a person stands where they are listed now. */
const there = (w: Walk, p: Person, map: string): boolean => { w.world.travel(map, p.x, p.y); return w.world.present(p); };

/** What a person says at the next meeting, as the game would have it. */
function hear(w: Walk, map: string, p: Person): string {
  w.world.travel(map, p.x, p.y);
  const said = meet(p, w.party, heard(w.world, p)).text;
  listen(w);
  return said;
}

/** The words of a person's that hold `flag` in their `after` (the first such), as said. */
const words = (p: Person, flag: string): string => (p.says ?? []).find((x) => [x.after ?? []].flat().some((c) => [c.flag ?? []].flat().includes(flag)))?.lines.join('\n\n') ?? `(no words of ${p.name} after ${flag})`;

/** Meet a person and answer the question they put with the answer setting `sets` (or the one setting nothing); what it says. */
function answerTo(w: Walk, map: string, p: Person, sets: string | null): string {
  w.world.travel(map, p.x, p.y);
  const m = meet(p, w.party, heard(w.world, p)), a = m.choice?.answers.find((x) => (x.sets ?? null) === sets);
  w.ok(!!a, `${p.name.split(',')[0]} asks, and an answer sets ${sets ?? 'nothing'} (${m.choice?.ask ?? 'no question'})`);
  const said = a ? answer(a, w.party) : '';
  listen(w);
  return said;
}

/** A group of `map` by its id, alive now. */
function alive(w: Walk, map: string, id: string): boolean {
  const g = MAP_DEFS.find((d) => d.id === map)!.encounters!.find((e) => e.id === id)!;
  w.world.travel(map, g.x, g.y);
  return w.world.liveGroups().some((l) => l.def.id === id);
}

/** An event of `map` by its id, there now. */
function shows(w: Walk, map: string, id: string): boolean {
  const f = MAP_DEFS.find((d) => d.id === map)!.features!.find((x) => x.kind === 'event' && x.id === id)!;
  w.world.travel(map, f.x, f.y);
  return w.world.present(f);
}

/** A quest done with no goal, its entries those `want` names and none of `not`, finished once. */
function reads(w: Walk, id: string, title: string, want: readonly string[], not: readonly string[], how: string): void {
  const pg = page(w, id), ids = pg?.entries.map((e) => e.id) ?? [];
  const done = w.news.filter((n) => n === `Quest complete: ${title}.`).length;
  w.ok(!!pg?.done && pg.goal === null && want.every((e) => ids.includes(e)) && !not.some((e) => ids.includes(e)) && done === 1,
    `${how}: ${title} is done with no goal, its entries ${ids.join(', ')}, and said complete once (${done})`);
}

/** The goal a side quest's page shows now. */
const goal = (w: Walk, id: string): string => page(w, id)?.goal ?? '(no goal)';

/** The days on, a whole number of them. */
const days = (w: Walk, n: number): void => { w.world.state.minutes += n * 1440; };

/** Up into Kelp Hole and its rows' keepers put down, at 13: Colan comes to his crate. */
function toTheRows(w: Walk): void {
  w.level = 13;
  fight(w, 'smugglers_cove:kh1_overseers');
}

/** Hale taken from the Scarth, the hold's crew down and Hale freed: up at the rail with the thirty. */
function haleFreed(w: Walk): void {
  w.party.flags.q_hale_taken = 1;
  w.level = 12;
  w.ok(!shows(w, 'tide_ship3', 'ts3_chained'), 'before the hold\'s crew is down, the rows say nothing to the company');
  fight(w, 'tide_ship3:ts3_crew');
  w.ok(shows(w, 'tide_ship3', 'ts3_chained'), 'the crew down, the chained rows ask whose the company is');
  w.ok(!there(w, HALE_DECK(), 'tide_ship') && !there(w, BOY_DECK(), 'tide_ship'), 'before Hale is freed, nobody waits at the rail');
  hear(w, 'tide_ship3', HALE_IRONS());
  w.ok(!!w.party.flags.q_hale_freed && !shows(w, 'tide_ship3', 'ts3_chained'), 'Hale freed, the rows are empty');
  w.ok(there(w, HALE_DECK(), 'tide_ship') && there(w, BOY_DECK(), 'tide_ship') && shows(w, 'tide_ship', 'ts_freed'), 'freed, Hale waits at the rail over the boats with the thirty, Wat\'s boy among them');
}

function sideQuests(ok: (cond: boolean, msg: string) => void): void {
  { // The Captain's Brother: Kitto asks, Colan answers, and the truth is told. The cove's landing
    // crew comes no more once it is next put down.
    const w = newWalk(ok);
    w.ok(hear(w, 'wrackholm_e6', KITTO_E6()) === KITTO_E6().lines.join('\n\n') && w.news.at(-1) === 'New quest: The Captain\'s Brother.' && /Kelp Hole/.test(goal(w, 'brother')),
      `Kitto's first lines ashore begin The Captain's Brother, its goal Kelp Hole (${goal(w, 'brother')})`);
    w.ok(hear(w, 'wrackholm_e6', KITTO_E6()) === words(KITTO_E6(), 'q_brother'), 'asked again, Kitto says it short');
    w.ok(!there(w, COLAN(), 'smugglers_cove'), 'Colan is not at his crate while the overseers stand');
    toTheRows(w);
    w.ok(there(w, COLAN(), 'smugglers_cove'), 'the overseers down, Colan sits by the rows');
    answerTo(w, 'smugglers_cove', COLAN(), 'q_brother_truth');
    w.ok(!there(w, COLAN(), 'smugglers_cove') && shows(w, 'smugglers_cove', 'kh1_colan_gone') && !w.party.bag.includes('colans_letter'), 'the truth to carry, Colan goes below, his crate empty, and no letter');
    w.ok(/Kitto/.test(goal(w, 'brother')), `the goal is Kitto at the landing (${goal(w, 'brother')})`);
    fight(w, 'smugglers_cove:kh1_crew_landing');
    days(w, 3);
    w.ok(alive(w, 'smugglers_cove', 'kh1_crew_landing'), 'until Kitto is told, the cove\'s landing crew comes back');
    w.ok(hear(w, 'wrackholm_e6', KITTO_E6()) === words(KITTO_E6(), 'q_brother_truth') && !!w.party.flags.q_brother_told, 'Kitto hears what his brother is');
    reads(w, 'brother', 'The Captain\'s Brother', ['kitto', 'found', 'truth', 'told'], ['letter', 'delivered'], 'the truth told');
    w.ok(hear(w, 'wrackholm_e6', KITTO_E6()) === words(KITTO_E6(), 'q_brother_told'), 'Kitto\'s after-lines are the truth\'s');
    fight(w, 'smugglers_cove:kh1_crew_landing');
    days(w, 3);
    w.ok(!alive(w, 'smugglers_cove', 'kh1_crew_landing') && alive(w, 'smugglers_cove', 'kh1_crew_fires'), 'told, Kitto carries for the cove no more: its landing crew, put down, does not come back, and the fires\' crew does');
  }
  { // The Captain's Brother: Colan found before Kitto has asked, and his letter carried sealed.
    const w = newWalk(ok);
    toTheRows(w);
    answerTo(w, 'smugglers_cove', COLAN(), 'q_brother_letter');
    w.ok(w.news.includes('New quest: The Captain\'s Brother.') && w.party.bag.includes('colans_letter') && !there(w, COLAN(), 'smugglers_cove'), 'Colan met first begins the quest; his letter in the pack, he goes below');
    w.ok(/Kitto/.test(goal(w, 'brother')), `the goal is Kitto at the landing (${goal(w, 'brother')})`);
    const gold = w.party.gold;
    w.ok(hear(w, 'wrackholm_e6', KITTO_E6()).startsWith((KITTO_E6().quest as { done: string[] }).done.join('\n\n')) && w.party.gold === gold + 200 && !w.party.bag.includes('colans_letter'), 'Kitto, never having asked, takes the letter at the first meeting and pays 200');
    reads(w, 'brother', 'The Captain\'s Brother', ['found', 'letter', 'delivered'], ['kitto', 'truth', 'told'], 'the letter carried');
    w.ok(hear(w, 'wrackholm_e6', KITTO_E6()) === (KITTO_E6().quest as { after: string[] }).after.join('\n\n') && !w.party.flags.q_brother, 'Kitto\'s after-lines are the letter\'s, and he never hires');
    fight(w, 'smugglers_cove:kh1_crew_landing');
    days(w, 3);
    w.ok(alive(w, 'smugglers_cove', 'kh1_crew_landing'), 'the letter carried, the cove\'s landing crew comes back');
  }
  { // The Hermit of the Point: not yet, then carried, and to the Keel.
    const w = newWalk(ok);
    w.level = 13;
    answerTo(w, 'wrackholm_f6', MERRYN(), null);
    w.ok(w.news.at(-1) === 'New quest: The Hermit of the Point.' && !w.party.bag.includes('founders_letter') && /point/.test(goal(w, 'hermit')), `Not yet: the quest begins, no letter, and its goal is her answer (${goal(w, 'hermit')})`);
    answerTo(w, 'wrackholm_f6', MERRYN(), 'q_hermit_carried');
    w.ok(w.party.bag.includes('founders_letter') && /Keel/.test(goal(w, 'hermit')) && hear(w, 'wrackholm_f6', MERRYN()) === words(MERRYN(), 'q_hermit_carried'), `asked again she gives the letter, sends the company on, and the goal is the Keel or Tallis (${goal(w, 'hermit')})`);
    const gold = w.party.gold;
    hear(w, 'saltmouth', RUAN());
    w.ok(w.party.gold === gold + 300 && !w.party.bag.includes('founders_letter'), 'Ruan takes the letter at the Keel and pays 300');
    reads(w, 'hermit', 'The Hermit of the Point', ['asked', 'carried', 'hall'], ['tallis'], 'to the hall');
    w.ok(hear(w, 'wrackholm_f6', MERRYN()) === words(MERRYN(), 'q_hermit_hall'), 'Merryn\'s after-lines are the hall\'s');
  }
  { // The Hermit of the Point: carried at once, and sold to Tallis.
    const w = newWalk(ok);
    w.level = 13;
    answerTo(w, 'wrackholm_f6', MERRYN(), 'q_hermit_carried');
    const gold = w.party.gold;
    hear(w, 'saltmouth', TALLIS());
    w.ok(w.party.gold === gold + 500 && !w.party.bag.includes('founders_letter'), 'Tallis takes the letter and pays 500');
    reads(w, 'hermit', 'The Hermit of the Point', ['asked', 'carried', 'tallis'], ['hall'], 'to Tallis');
    w.ok(hear(w, 'wrackholm_f6', MERRYN()) === words(MERRYN(), 'q_hermit_tallis'), 'Merryn\'s after-lines are Tallis\'s');
  }
  { // Every Name in the Column: Hale at the rail asks for the book, it is fetched, and the thirty go
    // to Saltmouth by the boat.
    const w = newWalk(ok);
    haleFreed(w);
    w.ok(hear(w, 'tide_ship', HALE_DECK()) === HALE_DECK().lines.join('\n\n') && w.news.at(-1) === 'New quest: Every Name in the Column.' && /lower deck/.test(goal(w, 'column')),
      `at the rail Hale asks for the clerk's book, and the goal is the cabin below (${goal(w, 'column')})`);
    w.ok(hear(w, 'tide_ship', HALE_DECK()) === words(HALE_DECK(), 'q_column'), 'asked again, Hale says it short');
    w.ok(hear(w, 'tide_ship', BOY_DECK()) === BOY_DECK().lines.join('\n\n'), 'Wat\'s elder boy is among the freed');
    see(w, 'tide_ship2:ts2_clerk_desk');
    open(w, 'tide_ship2', 'ts2_clerk');
    listen(w);
    w.ok(w.party.bag.includes('clerks_book') && /rail/.test(goal(w, 'column')), `the book in the pack, the goal is Hale at the rail (${goal(w, 'column')})`);
    answerTo(w, 'tide_ship', HALE_DECK(), 'q_column_saltmouth');
    reads(w, 'column', 'Every Name in the Column', ['hale', 'book', 'saltmouth'], ['road'], 'to Saltmouth');
    w.ok(!there(w, HALE_DECK(), 'tide_ship') && !there(w, BOY_DECK(), 'tide_ship') && !shows(w, 'tide_ship', 'ts_freed') && w.party.bag.includes('clerks_book'), 'answered, Hale and the thirty are gone from the rail, and the book stays in the pack');
    w.ok(there(w, BOY_QUAY(), 'saltmouth') && !there(w, BOY_HOME(), 'downs_f3'), 'Wat\'s boy is on Saltmouth\'s quay, not at Gullwick');
    w.ok(hear(w, 'downs_f3', WAT()) === WAT().lines.join('\n\n'), 'Wat, his boy not home, says what he said');
  }
  { // Every Name in the Column: the book found first, and the thirty home by the coast road; Wat,
    // with his boat's board home in the loft and without it.
    const w = newWalk(ok);
    open(w, 'tide_ship2', 'ts2_clerk');
    haleFreed(w);
    const first = hear(w, 'tide_ship', HALE_DECK());
    w.ok(first === HALE_DECK().says![0].lines.join('\n\n') && w.news.includes('New quest: Every Name in the Column.'), 'the book carried, Hale goes straight to it and the quest begins');
    answerTo(w, 'tide_ship', HALE_DECK(), 'q_column_road');
    reads(w, 'column', 'Every Name in the Column', ['hale', 'book', 'road'], ['saltmouth'], 'home by the road');
    w.ok(!there(w, BOY_QUAY(), 'saltmouth') && there(w, BOY_HOME(), 'downs_f3') && hear(w, 'downs_f3', BOY_HOME()) === BOY_HOME().lines.join('\n\n'), 'Wat\'s boy is on Gullwick\'s shingle, not the quay');
    w.ok(hear(w, 'downs_f3', WAT()) === WAT().says![1].lines.join('\n\n'), 'with no board in the loft, Wat\'s words are his boy\'s and no board\'s');
    w.party.flags.q_board_home = 1;
    w.ok(hear(w, 'downs_f3', WAT()) === WAT().says![0].lines.join('\n\n'), 'with the board in the loft, Wat\'s words are his boy\'s and the board\'s');
  }
  { // What the Smugglers Feed: Tam met and the beast left alone; his mother told why he stays.
    const w = newWalk(ok);
    hear(w, 'saltmouth', LOVEDAY());
    w.ok(w.news.at(-1) === 'New quest: What the Smugglers Feed.' && /sea cave/.test(goal(w, 'feed')), `Loveday on the steps begins What the Smugglers Feed, its goal the sea cave (${goal(w, 'feed')})`);
    w.ok(hear(w, 'saltmouth', LOVEDAY()) === words(LOVEDAY(), 'q_feed'), 'asked again, Loveday says it short');
    w.ok(!there(w, TAM_FREE(), 'smugglers_cove2') && hear(w, 'smugglers_cove2', TAM()) === TAM().lines.join('\n\n'), 'Tam feeds the beast at the pool');
    w.ok(/steps/.test(goal(w, 'feed')), `Tam met, the goal is his mother on the steps (${goal(w, 'feed')})`);
    w.ok(hear(w, 'saltmouth', LOVEDAY()) === words(LOVEDAY(), 'q_feed_tam'), 'Loveday is told he stays');
    reads(w, 'feed', 'What the Smugglers Feed', ['loveday', 'tam', 'told'], ['home'], 'the beast left alone');
    w.ok(!there(w, TAM_HOME(), 'saltmouth') && there(w, TAM(), 'smugglers_cove2'), 'Tam stays at the pool, and is not on the steps');
  }
  { // What the Smugglers Feed: the beast slain before Loveday is met; Tam goes home to the steps.
    const w = newWalk(ok);
    hear(w, 'smugglers_cove2', TAM());
    w.ok(w.news.at(-1) === 'New quest: What the Smugglers Feed.', 'Tam met first begins the quest');
    w.level = 14;
    fight(w, 'smugglers_cove2:kh2_great_devilfish');
    w.ok(!there(w, TAM(), 'smugglers_cove2') && there(w, TAM_FREE(), 'smugglers_cove2') && /black pool/.test(goal(w, 'feed')), `the beast dead, Tam stands over his bucket, and the goal is him (${goal(w, 'feed')})`);
    w.ok(hear(w, 'smugglers_cove2', TAM_FREE()) === TAM_FREE().lines.join('\n\n') && !there(w, TAM_FREE(), 'smugglers_cove2'), 'Tam has done with the arrangement, and goes');
    reads(w, 'feed', 'What the Smugglers Feed', ['tam', 'home'], ['loveday', 'told'], 'the beast slain');
    w.ok(there(w, TAM_HOME(), 'saltmouth') && hear(w, 'saltmouth', TAM_HOME()) === TAM_HOME().lines.join('\n\n'), 'Tam is on the harbour steps');
    w.ok(hear(w, 'saltmouth', LOVEDAY()) === words(LOVEDAY(), 'q_feed_home') && !w.party.flags.q_feed, 'Loveday, beside him, has her son home, and never hires');
  }
}
