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
// seal in the grave; a detour to the hollow in the rock's east face (#861), found and never told, from the groove
// in the turf that stops at the rock: the door found by a search, the Runner's Coat in the sea chest, and Corposant
// in the iron-bound one, which the company's thief picks; and every group of F6 won at its floor. The finds
// themselves (off the ladder, in no shop, inside the window) and the lock's refusals are held on their own
// (`hollowFinds`, `hollowLocked`). Then out to the Tide Ship by night in
// Dando's boat: the devilfish over the side; the rats and the Hand's post on the lower deck, and the
// papers, the log and the cutlass in the cabin; the hold's crew, strangers in the last row while Hale
// holds the Scarth and Hale once he is taken from it, freed and gone; the straw that is fresh on one
// side, and the shard-cut behind it found by a search and not told; the tear, the Warden at 14 and
// the Stone; and down the hatch to the stair's foot, and back up. The Compact's rungs are played on the
// way (#635): the Fence's at the stair's foot and, with the counting house's orders in the pack, the
// Factor's and Ruan's choice at the Keel, both ways.
//
// Last, the side quests (#192), each played both ways and in more than one order: Kitto asks and
// the truth is told, so the cove's landing crew comes no more, or Colan is met first and his letter
// carried; Merryn's letter after a Not yet to the Keel, or at once to Tallis; Hale at the rail asks
// for the clerk's book and the thirty go to Saltmouth, or the book is found first and they go home
// by the road, where Wat has words with the board in the loft and without; and Tam left feeding the
// beast and his mother told, or the beast slain before she is met and Tam home on the steps.
//
// And the bounds (#835), the three strands round the isle, in a walk of their own (`theBounds`), last.
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen, walkThrough, meetWho, playChapter, ending, everyGoalWalked, goalFromBegun, quest } from '../../../../tools/walk.ts';
import type { Step, Walk } from '../../../../tools/walk.ts';
import { CHAPTER } from './chapter.ts';
import { CHAPTER as TIDE } from '../saltreach/chapter.ts';
import { SLEEPERS_SEEN } from '../rimewater/chapter.ts';
import { COMPACT_WARDENS, COMPACT_OVER } from '../saltreach/maps/saltmouth.ts';
import { inOrder, saltmouthFirst } from '../saltreach/walkthrough.ts';
import { stonesRestored } from '../../../game/stones.ts';
import { meet, heard, answer } from '../../../game/people.ts';
import { questLog } from '../../../game/quests.ts';
import type { PageView } from '../../../game/quests.ts';
import type { Person, Meeting } from '../../../game/people.ts';
import { take } from '../../../game/passage.ts';
import { NORTH, EAST, SOUTH, WEST } from '../../../game/types.ts';
import { MAP_DEFS, GUILD_QUESTS, AREAS, ATLAS, MONSTERS } from '../../index.ts';
import { CURVE } from '../../progression.ts';
import { rankFlag, takenFlag, doneFlag } from '../../guilds.ts';
import { take as takeWork, report, offered, rankOf } from '../../../game/guilds.ts';
import { defaultParty, equip, statOf } from '../../../game/party.ts';
import type { Party } from '../../../game/party.ts';
import { makeRng } from '../../../lib/engine/rng.ts';
import { elementMult } from '../../../game/monsters.ts';
import { headlessGame } from '../../../../tools/tests/lib.ts';
import { GEAR } from '../../../../tools/harness.ts';
import { WRACKHOLM_E6 } from './maps/wrackholm_e6.ts';
import { WRACKHOLM_F6 } from './maps/wrackholm_f6.ts';
import { SMUGGLERS_COVE } from './maps/smugglers_cove.ts';
import { SMUGGLERS_COVE2 } from './maps/smugglers_cove2.ts';
import { TIDE_SHIP } from './maps/tide_ship.ts';
import { TIDE_SHIP2 } from './maps/tide_ship2.ts';
import { TIDE_SHIP3, TIDE_RIFT } from './maps/tide_ship3.ts';
import { DEAD_DROP_STAIR } from './maps/dead_drop_stair.ts';
import { DEAD_DROP, VAULT_STAIR } from './maps/dead_drop.ts';
import { DEAD_DROP2, WRITER_STAIR, HOIST } from './maps/dead_drop2.ts';
import { DEAD_DROP3 } from './maps/dead_drop3.ts';
import { WRACKHOLM_E5 } from './maps/wrackholm_e5.ts';
import { WRACKHOLM_F5 } from './maps/wrackholm_f5.ts';
import { WRACKHOLM_F7 } from './maps/wrackholm_f7.ts';
import { BROKENBACK } from './maps/brokenback.ts';
import { GameMap } from '../../../game/map.ts';
import type { Can, Feature, MapDef, MapZone } from '../../../game/map.ts';
import type { Facing } from '../../../game/types.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { answerRiddle } from '../../../game/wilds.ts';
import { item, hits, sellPrice } from '../../../game/items.ts';
import { HARDER_IN, WARNING_IN } from '../../../game/world.ts';

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

/**
 * The causeway seen (#449): once the company has stood on its first stone at Sheer Point (the
 * Whitespine's step, `sheerpoint_i8:i8_causeway`), the Saltings' shore by Saltmouth's road and the
 * Tide Ship's starboard rail look east on a line on the sea under the Hearth's light, each said once;
 * before it, neither shows anything.
 */
function causewaySeen(ok: (cond: boolean, msg: string) => void): void {
  const said = (w: Walk, map: string, id: string): string[] => {
    const f = MAP_DEFS.find((d) => d.id === map)!.features!.find((x) => x.kind === 'event' && x.id === id)!;
    w.world.travel(map, f.x, f.y);
    return w.world.eventsHere();
  };
  const both = (w: Walk): string[][] => [said(w, 'saltings_c6', 'c6_causeway'), said(w, 'tide_ship', 'ts_causeway')];
  ok(both(newWalk(ok)).every((s) => !s.length), 'before the causeway at Sheer Point is stood on, the Saltings\' shore and the Tide Ship\'s deck show nothing');
  const w = newWalk(ok);
  see(w, 'sheerpoint_i8:i8_causeway');
  const [shore, deck] = both(w), again = both(w);
  ok([shore, deck].every((s) => s.length === 1 && s[0].includes('straight as a rule')) && again.every((s) => !s.length),
    `once it is, a line on the sea under the Hearth's light from the shore and from the deck, each said once (${shore.join(' / ')}; ${deck.join(' / ')})`);
}

// ---- the hollow in the east rocks (#861) ----

type Chest = Extract<Feature, { kind: 'chest' }>;
type Happening = Extract<Feature, { kind: 'event' }>;
/** F6's chest, or its event, by id. */
const chestOf = (id: string): Chest => WRACKHOLM_F6.features!.find((f): f is Chest => f.kind === 'chest' && f.id === id)!;
const eventOf = (id: string): Happening => WRACKHOLM_F6.features!.find((f): f is Happening => f.kind === 'event' && f.id === id)!;

/**
 * How far `q` lies from the squares on a shortest walk from `a` to `b` (every way a company can take between them,
 * not one), by the way a company walks (a secret door as the floor it is) and as the crow flies (the larger of the
 * two differences).
 */
function apartFrom(def: MapDef, a: readonly [number, number], b: readonly [number, number], q: readonly [number, number]): { steps: number; walking: number; crow: number } {
  const map = new GameMap(def), { width, height } = map;
  const floor = (x: number, y: number): boolean => x >= 0 && y >= 0 && x < width && y < height && map.passable(x, y) === 'ok';
  const flood = (from: readonly (readonly [number, number])[]): Int32Array => {
    const d = new Int32Array(width * height).fill(-1), todo: number[] = [];
    for (const [x, y] of from) { d[y * width + x] = 0; todo.push(y * width + x); }
    for (let i = 0; i < todo.length; i++) {
      const x = todo[i] % width, y = Math.floor(todo[i] / width);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
        const nx = x + dx, ny = y + dy;
        if (floor(nx, ny) && d[ny * width + nx] < 0) { d[ny * width + nx] = d[y * width + x] + 1; todo.push(ny * width + nx); }
      }
    }
    return d;
  };
  const fromA = flood([a]), fromB = flood([b]), steps = fromA[b[1] * width + b[0]], road: [number, number][] = [];
  for (let y = 0; y < height; y++) for (let x = 0; x < width; x++) if (fromA[y * width + x] >= 0 && fromA[y * width + x] + fromB[y * width + x] === steps) road.push([x, y]);
  return { steps, walking: flood(road)[q[1] * width + q[0]], crow: Math.min(...road.map(([x, y]) => Math.max(Math.abs(x - q[0]), Math.abs(y - q[1])))) };
}

/**
 * The detour (#861), on from the founder's grave: the groove in the turf that ends at the rock's east face is
 * seen, a search where it ends finds the door, and the company goes in. The sea chest gives the Runner's Coat; the
 * iron-bound one is locked, and the company's thief picks it (the premade six's Ottilie is born to Lockpick, #857; what
 * the lock refuses is played on a game of its own, `hollowLocked`). Corposant comes out of it.
 */
function theHollow(w: Walk): void {
  const f6 = WRACKHOLM_F6, door = f6.secrets![1], drag = eventOf('f6_drag'), inside = eventOf('f6_hollow');
  const sea = chestOf('f6_hollow_chest'), iron = chestOf('f6_hollow_locked');
  const at = (c: { x: number; y: number }): boolean => { const o = w.world.locate(f6.id, c.x, c.y); return !!o && w.world.state.x === o.x && w.world.state.y === o.y; };
  w.ok(door.hint === drag.id && drag.x === door.x + 1 && drag.y === door.y && f6.rows[door.y][door.x] === 'S' && f6.rows[door.y - 1][door.x] === 'r' && f6.rows[door.y + 1][door.x] === 'r',
    'the hollow\'s door is the box\'s second secret, in the rock\'s east face between rock above and below, and the groove ends on its near side');
  see(w, `${f6.id}:${drag.id}`);
  w.ok(w.world.used(drag.id), 'the groove in the turf is seen where it ends at the rock');
  w.world.travel(f6.id, drag.x, drag.y, WEST);
  let found = false;
  for (let i = 0; i < 20 && !found; i++) found = w.world.search();
  w.ok(found, 'a search where the groove ends finds the door in the rock');
  const in3 = [w.world.move('forward'), w.world.move('forward'), w.world.move('forward')];
  w.ok(in3.every((r) => r.kind === 'moved') && w.world.used(inside.id) && at(sea), 'through the door the hollow runs on west: its first square, and the sea chest on the second');
  w.world.markUsed(sea.id); w.party.gold += sea.gold; w.party.bag.push(...sea.items);
  const coat = w.party.bag.includes('runners_coat');
  w.world.move('forward');
  w.ok(coat && at(iron), 'the sea chest gives the Runner\'s Coat, and the iron-bound chest stands at the back');
  const gold = w.party.gold, keys = (): number => w.party.bag.filter((i) => i === 'key_iron').length, before = keys();
  const said = w.world.unlock();
  w.ok(iron.locked === true && said === 'Ottilie picks the lock.' && keys() === before, `the company's thief picks the iron-bound lock, born to Lockpick (${said || 'nothing'}), and no key is spent`);
  w.world.markUsed(iron.id); w.party.gold += iron.gold; w.party.bag.push(...iron.items);
  w.ok(w.party.bag.includes('corposant') && w.party.gold === gold && !iron.items.includes('key_iron'), 'and in it Corposant, no gold and no key');
  listen(w);
}

/**
 * The iron-bound chest on the real map (#861), pressed on in a game of its own with the company dressed each way: a
 * company with neither a Lockpick nor an iron key is refused ("Locked.", twice) and the chest stays shut and full; a
 * thief standing, born to Lockpick, opens it and keeps its key; a key opens it and is spent. The sea chest beside it
 * has no lock and opens to the company that cannot open the other.
 */
function hollowLocked(ok: (cond: boolean, msg: string) => void): void {
  const iron = chestOf('f6_hollow_locked'), sea = chestOf('f6_hollow_chest');
  /** A new game, the company dressed by `dress`, stood on the chest and Space pressed twice: what the log said, and what became of the chest, the prize and the keys. */
  const press = (c: Chest, dress: (p: Party) => void): string => {
    const g = headlessGame(4), p = g.party;
    dress(p);
    g.world.travel(WRACKHOLM_F6.id, c.x, c.y, WEST);
    const there = g.world.featureHere(), from = g.log.length;
    g.enterCell();
    if (there) { g.interact(there); g.interact(there); }
    return `${g.log.slice(from).join(' ')} | ${g.world.used(c.id) ? 'spent' : 'shut'} | ${c.items.every((i) => p.bag.includes(i)) ? 'taken' : 'left'} | ${p.bag.filter((i) => i === 'key_iron').length} keys`;
  };
  const thiefDown = (p: Party): void => { p.members.find((m) => m.cls === 'thief')!.conditions.push('dead'); };
  const key = (p: Party): void => { p.bag.push('key_iron'); };
  const prize = 'You open the chest: Corposant, Morning Star. The chest is empty.';
  const cases: [string, Chest, (p: Party) => void, string][] = [
    ['no Lockpick standing and no key', iron, thiefDown, 'A locked chest. Locked. Locked. | shut | left | 0 keys'],
    ['the thief standing, born to Lockpick, no key', iron, () => undefined, `A locked chest. Ottilie picks the lock. ${prize} | spent | taken | 0 keys`],
    ['the thief standing and a key carried, which is kept', iron, key, `A locked chest. Ottilie picks the lock. ${prize} | spent | taken | 1 keys`],
    ['no Lockpick standing and an iron key, which is spent', iron, (p) => { thiefDown(p); key(p); }, `A locked chest. The lock turns. The key crumbles. ${prize} | spent | taken | 0 keys`],
    ['no Lockpick and no key, at the sea chest beside it', sea, thiefDown, 'A chest. Space opens it. You open the chest: Runner\'s Coat. The chest is empty. | spent | taken | 0 keys'],
  ];
  const wrong = cases.flatMap(([who, c, dress, want]) => { const said = press(c, dress); return said === want ? [] : [`${who}: "${said}", wanted "${want}"`]; });
  ok(iron.locked === true && !sea.locked && !wrong.length,
    `the iron-bound chest refuses a company with neither a Lockpick nor an iron key and opens to either, the sea chest beside it opening to any (${cases.map(([who]) => who).join('; ')})${wrong.length ? ' -> ' + wrong.join('; ') : ''}`);
}

/**
 * The two finds (#861), off the ladder: Corposant is the ladder's Morning Star with lightning on its head, a rung under the
 * Morning Star +1 it wears from 13 and the Flail from 14, so the die is the gain; the Runner's Coat is the Sharkskin Coat a
 * point lighter, with +3 speed while worn. Each is priced above nothing and inside Wrackholm's window, sold by no shop and
 * dropped by no monster, on no row of the ladder, sold back at half, and lies in the hollow's chests and nowhere else, the
 * area's one locked chest holding the blade. Lightning is held against what the isle places. And the hollow is found and
 * never told: the hint explains nothing, no person, quest or world-map mark names it, and it lies off the road, where the
 * measure is named.
 */
function hollowFinds(ok: (cond: boolean, msg: string) => void): void {
  const [blade, coat] = [item('corposant'), item('runners_coat')];
  const [star, plus, flail, shark] = [item('morning_star'), item('morning_star+1'), item('flail'), item('sharkskin')];
  const same = (a: unknown, b: unknown): boolean => JSON.stringify(a) === JSON.stringify(b);
  ok(blade.slot === 'weapon' && blade.element === 'lightning' && !blade.stat && !blade.plus && blade.dice === star.dice && blade.sides === star.sides && blade.bonus === star.bonus && same(blade.classes, star.classes) && blade.name.length <= 26,
    `Corposant is the Morning Star's steel with lightning on it, for the Morning Star's classes, its name ${blade.name.length} characters of the sheet's 26`);
  ok(hits(blade) - hits(star) === 3.5 && hits(star) < hits(plus) && hits(blade) > hits(plus) && hits(blade) > hits(flail),
    `a rung under the ladder's, so the die is the gain: hits ${hits(blade)} against the Morning Star +1 of 13 at ${hits(plus)} and the Flail of 14 at ${hits(flail)} (the plain Morning Star ${hits(star)})`);
  ok(coat.slot === 'armor' && same(coat.stat, { speed: 3 }) && !coat.element && coat.ac === (shark.ac ?? 0) - 1 && same(coat.classes, shark.classes),
    `the Runner's Coat is a point under the Sharkskin Coat's armour (${coat.ac} of ${shark.ac}), for its classes, raising speed by 3 and nothing else`);
  // Priced, in the window, never sold, off the ladder, sold back at half.
  const stocked = new Set(MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => (f.kind === 'shop' ? f.stock : []))));
  const ladder = new Set(GEAR.flatMap(([, ids]) => ids)), dropped = new Set(Object.values(MONSTERS).flatMap((m) => (m.drops ?? []).map((x) => x.item)));
  const limit = CURVE.wrackholm.price, six = defaultParty(makeRng(1));
  for (const d of [blade, coat]) {
    ok(d.price > 0 && d.price <= limit && !stocked.has(d.id) && !ladder.has(d.id) && !dropped.has(d.id) && sellPrice(six, d.price) === d.price / 2,
      `${d.name} costs ${d.price} of Wrackholm's window of ${limit}, is sold by no shop, worn by no rung of the ladder and dropped by no monster, and sells back at ${sellPrice(six, d.price)}`);
  }
  // Where they lie: the hollow's two chests, the iron-bound one the area's only locked chest.
  const chests = MAP_DEFS.flatMap((d) => (d.features ?? []).filter((f): f is Chest => f.kind === 'chest').map((f) => ({ map: d.id, f })));
  const holding = (id: string): string => chests.filter(({ f }) => f.items.includes(id)).map(({ map, f }) => `${map}:${f.id}`).join();
  // The isle's own maps: another area's locked chest (the epic's items are one an area, #18) is no concern of its count.
  const locked = chests.filter(({ map, f }) => f.locked && AREAS.find((a) => a.id === 'wrackholm')!.maps.some((m) => m.id === map)).map(({ map, f }) => `${map}:${f.id}`);
  ok(holding('corposant') === 'wrackholm_f6:f6_hollow_locked' && holding('runners_coat') === 'wrackholm_f6:f6_hollow_chest' && locked.join() === 'wrackholm_f6:f6_hollow_locked'
    && chestOf('f6_hollow_locked').gold === 0 && chestOf('f6_hollow_chest').gold === 0,
    `Corposant lies in the iron-bound chest and the coat in the sea chest beside it, no gold with either, and the iron-bound chest is the only locked one the isle places (${locked.join() || 'none'})`);
  // The raise and the blow, on the real items: worn, the coat adds 3 to speed and not to the bare stat, carried it adds nothing, and the classes that cannot wear it or wield the blade are refused.
  const crew = defaultParty(makeRng(1)), thief = crew.members.find((m) => m.cls === 'thief')!, knight = crew.members.find((m) => m.cls === 'knight')!;
  const bare = statOf(thief, 'speed');
  thief.pack.push(coat.id);
  const carried = statOf(thief, 'speed');
  thief.pack.pop();
  ok(equip(thief, coat.id) && carried === bare && statOf(thief, 'speed') === bare + 3 && thief.stats.speed === bare
    && equip(knight, blade.id) && knight.equipment.weapon === blade.id && !equip(crew.members.find((m) => m.cls === 'sorcerer')!, blade.id) && !equip(crew.members.find((m) => m.cls === 'cleric')!, coat.id),
    `worn, the coat raises the thief's speed ${bare} to ${statOf(thief, 'speed')} (carried, nothing) and the knight wields the blade; the sorcerer cannot wield it nor the cleric wear the coat`);
  // Lightning against what the isle places: none of its monsters is immune or resists it; the weak are named.
  const wrack = AREAS.find((a) => a.id === 'wrackholm')!;
  const placed = [...new Set(wrack.maps.flatMap((m) => (m.encounters ?? []).flatMap((e) => e.monsters)))].map((id) => MONSTERS[id]).filter((m) => m.level > 10);
  const weak = placed.filter((m) => elementMult(m, 'lightning') > 1), shut = placed.filter((m) => elementMult(m, 'lightning') < 1);
  ok(placed.length >= 10 && !shut.length, `lightning is never nothing here: of the ${placed.length} monsters the isle places past 10, ${weak.length} are weak to it (${weak.map((m) => m.id).join(', ')}) and ${shut.length} immune or resistant`);
  // Found and never told.
  const drag = eventOf('f6_drag');
  ok(!/door|secret|hollow|hide|chest|lock|key|search|store/i.test(drag.text), 'the groove in the turf is a thing seen, and its text explains nothing');
  const quests = AREAS.flatMap((a) => [...(a.quests ?? []), ...(a.chapter ? [a.chapter] : [])]);
  const told = [
    ...quests.flatMap((q) => [q.title, ...q.entries.map((e) => e.text), ...q.goals.map((x) => x.text)]),
    ...MAP_DEFS.flatMap((d) => (d.features ?? []).filter((f) => f.kind === 'npc').map((f) => JSON.stringify(f))),
    ...ATLAS.sites.map((s) => s.name), ...ATLAS.places.flatMap((p) => [p.name ?? '', p.note ?? '']),
  ].filter((t) => /Corposant|Runner's Coat|groove|iron-bound|hollow in the rock/i.test(t));
  ok(!told.length, `found and never told: no person, quest, chapter or atlas place or site names the hollow, the blade or the coat (${told.length} do)`);
  // Off the road: the squares on a shortest walk from the way into F6 (0,12) to the shingle where Dando rows out (14,30).
  const way: [[number, number], [number, number]] = [[WRACKHOLM_F6.start.x, WRACKHOLM_F6.start.y], [14, 30]];
  const far = apartFrom(WRACKHOLM_F6, way[0], way[1], [drag.x, drag.y]), on = apartFrom(WRACKHOLM_F6, way[0], way[1], [way[0][0] + 6, way[0][1]]);
  ok(far.walking > 10 && on.walking === 0 && on.crow === 0,
    `the hollow is off the road: where the groove ends is ${far.walking} squares from the nearest square on a shortest walk across F6 (${far.steps} steps from the way in to the shingle) by the way a company walks, and ${far.crow} as the crow flies; a square of the way itself is ${on.walking}`);
}

export const walkthrough: Walkthrough = (ok) => {
  theStoneCarriedHome(ok);
  sideQuests(ok);
  causewaySeen(ok);
  hollowFinds(ok);
  hollowLocked(ok);

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

  // A detour off the road (#861): the hollow in the rock's east face, found from the groove in the turf.
  theHollow(w);

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
  drop(w);
  factor(w);
  walkThrough(w, foot.id, 4, 6, SOUTH, hold.id, 1);

  // The bounds (#835): the strands round the isle.
  theBounds(ok);
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

/**
 * The Compact's Factor's rung (#635), "In the Founder's Hand", and Ruan's choice at the Keel, on fresh companies
 * made Factors, with the orders in the pack as the counting house's out-tray gave them (taken above): not offered
 * before Act IV opens, the Sleepers seen, and then offered alone at any hall of the Compact and taking nothing;
 * taken with no orders in the pack, the hall pays nothing; with them, the Keel pays 800 gold and 4,800 xp, once, the
 * orders stay in the pack (the Thief's third prestige, #448, asks for them too) and the company are Partners. A
 * company that carried them before it took the rung is paid at the taking, with the early words. Ruan has her
 * Runner's words until the rung is paid; then she puts one question, again if it is not answered, and no rank waits
 * on it; each of its two answers, the orders to the Wardens or the Compact taken over, sets its own flag, pays
 * nothing and changes her words to its own. Both are played.
 */
function factor(w: Walk): void {
  const q = GUILD_QUESTS.find((g) => g.id === 'compact_factor')!, ruan = RUAN(), done = doneFlag(q.id);
  w.ok(w.party.bag.includes('compact_orders'), 'the orders from the counting house\'s out-tray are in the pack, for the Factor\'s rung to find');
  const xpOf = (p: Party): number => p.members.reduce((t, m) => t + m.xp, 0);
  /** A fresh company that has done the Compact's ranks below the Factor's, with the orders in the pack or not. */
  const factors = (orders: boolean): Walk => {
    const v = newWalk(w.ok);
    for (const g of GUILD_QUESTS) if (g.guild === 'compact' && g.rank < q.rank) v.party.flags[takenFlag(g.id)] = v.party.flags[doneFlag(g.id)] = 1;
    v.party.flags[rankFlag('compact')] = q.rank;
    if (orders) v.party.bag.push('compact_orders');
    return v;
  };
  /** What Ruan says to a company, and the question she puts. */
  const ruanSays = (v: Walk): Meeting => { v.world.travel('saltmouth', ruan.x, ruan.y); return meet(ruan, v.party, heard(v.world, ruan)); };

  const a = factors(false);
  w.ok(q.rank === 3 && !offered('compact', a.party).some((o) => o.id === q.id), `${q.title} waits for Act IV: a Factor is not offered it before the Sleepers are seen`);
  a.party.flags[SLEEPERS_SEEN] = 1;
  w.ok(offered('compact', a.party).map((o) => o.id).join() === q.id && !q.item && ['Keel', 'factor\'s house'].every((h) => q.goals[0].text.includes(h)),
    'then it is offered alone at any hall of the Compact, the Keel in Saltmouth or the factor\'s house at Cinderport, and takes nothing');
  const fence = factors(false);
  fence.party.flags[rankFlag('compact')] = 2;
  delete fence.party.flags[takenFlag('compact_fence')]; delete fence.party.flags[doneFlag('compact_fence')];
  fence.party.flags[SLEEPERS_SEEN] = 1;
  w.ok(offered('compact', fence.party).map((o) => o.id).join() === 'compact_fence', 'a Fence, the Sleepers seen, is offered the Fence\'s rung and not this one');
  const runner = ruanSays(a);
  w.ok(!takeWork(q, a.world.state, a.party).length && !report('compact', a.world.state, a.party).length && rankOf('compact', a.party) === 3 && !runner.choice && runner.text.startsWith('"Runner."'),
    'taken with no orders in the pack, the hall pays nothing, and Ruan has her Runner\'s words and no question');

  // The orders carried up: paid at the Keel, once, and the orders stay in the pack.
  a.party.bag.push('compact_orders');
  const purse = a.party.gold, xp = xpOf(a.party), pack = a.party.bag.join();
  a.world.travel('saltmouth', ruan.x, ruan.y);
  const paid = report('compact', a.world.state, a.party);
  w.ok(paid.length === 2 && paid[0].startsWith(q.paid[0]) && paid[1] === 'Your rank with the Salt Compact is now Partner.' && a.party.gold === purse + 800 && xpOf(a.party) >= xp + 4800 - a.party.members.length
    && rankOf('compact', a.party) === 4 && !!a.party.flags[done] && a.party.bag.join() === pack,
    `the orders in the pack, the Keel pays 800 gold and 4,800 xp, leaves them in the pack and makes the company Partners (${paid.join(' ').replace(/\n+/g, ' ')})`);
  w.ok(!report('compact', a.world.state, a.party).length && !offered('compact', a.party).length && a.party.gold === purse + 800, 'and it is paid the once: a second report pays nothing, and nothing is offered');
  const late = factors(true);
  late.party.flags[SLEEPERS_SEEN] = 1;
  const lateGold = late.party.gold, hasty = takeWork(q, late.world.state, late.party);
  w.ok(hasty.length === 2 && hasty[0].startsWith(q.early![0]) && late.party.gold === lateGold + 800 && rankOf('compact', late.party) === 4 && late.party.bag.includes('compact_orders'),
    `a company that carried the orders before it took the rung is paid at the taking, with the early words (${hasty.join(' ').replace(/\n+/g, ' ')})`);

  // Ruan's choice, put once the rung is paid: no rank waits on it, an unanswered question is put again, and the answers pay nothing.
  const reveal = (ruan.says ?? []).find((x) => [x.after ?? []].flat().some((c) => [c.flag ?? []].flat().includes(done)));
  w.ok(reveal?.choice?.answers.length === 2 && reveal.choice.answers.map((x) => x.sets).join() === `${COMPACT_WARDENS},${COMPACT_OVER}`
    && reveal.choice.answers.every((x) => !x.pay && !x.gives && !x.price && !x.takes) && !reveal.sets,
    'Ruan has one question with two answers, the orders to the Wardens or the Compact taken over, each setting its own flag and paying, giving and taking nothing');
  const put = ruanSays(a), again = ruanSays(a);
  w.ok(rankOf('compact', a.party) === 4 && !!reveal && put.text === reveal.lines.join('\n\n') && put.choice === reveal.choice && again.choice === reveal.choice && !a.party.flags[COMPACT_WARDENS] && !a.party.flags[COMPACT_OVER],
    'the rung paid, Ruan puts it at the Keel with the company already Partners, and puts it again if it is not answered');
  for (const [how, sets, other] of [['the orders to the Wardens', COMPACT_WARDENS, COMPACT_OVER], ['the Compact taken over', COMPACT_OVER, COMPACT_WARDENS]] as const) {
    const v = sets === COMPACT_OVER ? factors(true) : a;
    if (v !== a) { v.party.flags[SLEEPERS_SEEN] = 1; takeWork(q, v.world.state, v.party); }
    const gold = v.party.gold, xpNow = xpOf(v.party);
    const said = answerTo(v, 'saltmouth', ruan, sets), next = ruanSays(v);
    w.ok(!!v.party.flags[sets] && !v.party.flags[other] && v.party.gold === gold && xpOf(v.party) === xpNow && rankOf('compact', v.party) === 4 && next.text === words(ruan, sets) && !next.choice,
      `${how}: its flag is set and the other's is not, nothing is paid, Ruan says her words for it and the question is not put again (${said.replace(/\n+/g, ' ')})`);
  }
}

/**
 * The Dead-Drop's drop (#22), at 26, its floor, as Meridian Camp's levels are walked at theirs: down the stair's
 * foot's far end onto its first square, facing in, and back up in front of it; no machine in sight of the way
 * in or the drop, even by a light, the first group round the corner; the cargo left at the drop, the rails, a
 * post, the shards stacked by size and the counting floor; every group won at 26, the hold keeper at 27 the
 * farthest; a loader's parts and the Compact's coin; and the rails' way down to the vaults (VAULT_STAIR), its
 * line said at its head the once, and the vaults below it.
 */
function drop(w: Walk): void {
  const D = DEAD_DROP, foot = DEAD_DROP_STAIR, level = w.level, way = foot.exits!.find((e) => e.to === D.id)!;
  const here = (): string => `${w.world.state.mapId} ${w.world.state.x},${w.world.state.y}`;
  w.world.travel(foot.id, way.x, way.y + 1, NORTH);
  const down = w.world.move('forward');
  w.ok(down.kind === 'moved' && w.world.state.mapId === D.id && w.world.state.x === D.start.x && w.world.state.y === D.start.y && w.world.state.facing === D.start.facing
    && way.tx === D.start.x && way.ty === D.start.y && down.messages.includes(way.label!),
    `the stair's foot's far end goes on down into the drop, facing in (${here()}: ${down.kind === 'moved' ? down.messages.join(' / ') : down.kind})`);
  const up = [w.world.move('forward'), w.world.move('back')];
  w.ok(up.every((r) => r.kind === 'moved') && w.world.state.mapId === foot.id && w.world.state.x === way.x && w.world.state.y === way.y + 1 && w.world.state.facing === SOUTH,
    `and back up onto the stair's foot in front of it, facing away from it (${here()})`);

  // Whichever way a company looks from the way in or the drop, by a light, no machine is in sight: the
  // first stands round the corner, so the band's sign is met before any of them.
  const map = new GameMap(D), seen: string[] = [];
  for (let y = 1; y <= 11; y++) for (let x = 2; x <= 6; x++) {
    if (map.passable(x, y) !== 'ok') continue;
    for (const f of [NORTH, EAST, SOUTH, WEST]) {
      w.world.travel(D.id, x, y, f);
      w.world.state.light = 9;
      if (w.world.groupsInSight().length) seen.push(`${x},${y}`);
    }
  }
  w.world.state.light = 0;
  w.ok(!seen.length, `no machine is in sight of the way in or the drop, the first round the corner${seen.length ? ` (seen from ${[...new Set(seen)].join(' ')})` : ''}`);

  w.level = 26;
  for (const id of ['dd_in', 'dd_drop', 'dd_rails', 'dd_buffer', 'dd_post', 'dd_small', 'dd_middling', 'dd_large', 'dd_floor', 'dd_coin', 'dd_water']) see(w, `${D.id}:${id}`);
  const groups = D.encounters!, keeper = groups.find((g) => g.id === 'dd_keeper');
  w.ok(groups.every((g) => g.monsters.every((m) => m === 'loader' || m === 'tally_clerk') || g === keeper) && keeper?.monsters.join() === 'hold_keeper'
    && groups.every((g) => !!g.respawn && !g.after),
    `loaders and tally clerks, ${groups.length - 1} groups, and at the far end a hold keeper come up from the vaults`);
  for (const g of groups) fight(w, `${D.id}:${g.id}`);
  w.ok(open(w, D.id, 'dd_heap').every((i) => item(i).slot === 'none' && !item(i).price), 'where the rails end, a loader\'s parts, which no shop buys');
  const gold = w.party.gold;
  open(w, D.id, 'dd_strongbox');
  w.ok(w.party.gold - gold >= 1000, `under the counting floor's posts, the Compact's drop coin, heavy (${w.party.gold - gold} gold)`);

  const head = D.features!.find((f) => f.kind === 'event' && f.id === 'dd_down');
  w.ok(VAULT_STAIR.to === DEAD_DROP2.id && (D.exits ?? []).includes(VAULT_STAIR) && map.passable(VAULT_STAIR.x, VAULT_STAIR.y) === 'ok'
    && head?.kind === 'event' && !!head.once && head.x === VAULT_STAIR.x && head.y === VAULT_STAIR.y - 1,
    'the rails go on down to the vaults (VAULT_STAIR), and the line at their head is said the once');
  see(w, `${D.id}:dd_down`);
  vaults(w);
  w.level = level;
}

/**
 * The Dead-Drop's vaults (#22), at 27, their floor: down the drop's rails' slope onto their first square, facing
 * in, and back up onto the slope's head; the shards' vault, and at its far end the rails' door, a wall drawn as a
 * door, the knockers at it and crates beside it under the Hand's seal, in Sheer Point's words; the people's vault,
 * its pens, the rest in an empty pen and the count on the wall, two columns, a mark by Wenna's name alone and no
 * word of what it is; every group won at 27, loaders, keepers and the knockers at 28 the hardest; a keeper's parts,
 * the named piece and the Compact's coin; the hoist's chains, a search where they go into the wall and the cage up
 * to the drop's crates; and the steps down to the writer's room (WRITER_STAIR), their line said at their head the
 * once, and the counting house below them.
 */
function vaults(w: Walk): void {
  const V = DEAD_DROP2, D = DEAD_DROP, level = w.level, map = new GameMap(V);
  const here = (): string => `${w.world.state.mapId} ${w.world.state.x},${w.world.state.y}`;
  const ev = (id: string): Extract<Feature, { kind: 'event' }> | undefined => V.features!.find((f): f is Extract<Feature, { kind: 'event' }> => f.kind === 'event' && f.id === id);
  w.world.travel(D.id, VAULT_STAIR.x, VAULT_STAIR.y - 1, SOUTH);
  const down = w.world.move('forward');
  w.ok(down.kind === 'moved' && w.world.state.mapId === V.id && w.world.state.x === V.start.x && w.world.state.y === V.start.y && w.world.state.facing === V.start.facing
    && VAULT_STAIR.tx === V.start.x && VAULT_STAIR.ty === V.start.y && down.messages.includes(VAULT_STAIR.label!),
    `the drop's rails go on down into the vaults, facing in (${here()}: ${down.kind === 'moved' ? down.messages.join(' / ') : down.kind})`);
  const up = [w.world.move('forward'), w.world.move('back')];
  w.ok(up.every((r) => r.kind === 'moved') && w.world.state.mapId === D.id && w.world.state.x === VAULT_STAIR.x && w.world.state.y === VAULT_STAIR.y - 1 && w.world.state.facing === NORTH,
    `and back up onto the slope's head, facing away from it (${here()})`);

  w.level = 27;
  for (const id of ['dd2_in', 'dd2_vault', 'dd2_bare', 'dd2_rails', 'dd2_coin', 'dd2_door', 'dd2_seal', 'dd2_pens', 'dd2_count', 'dd2_left', 'dd2_right']) see(w, `${V.id}:${id}`);
  // The rails' door opens for nobody the company has; beside it the Hand's seal, as on Sheer Point's crates.
  const door = ev('dd2_door')!, cave = MAP_DEFS.find((d) => d.id === 'sheerpoint_i8')?.features?.find((f) => f.kind === 'event' && f.id === 'i8_crates');
  const sealed = [[-1, 0], [1, 0], [0, -1], [0, 1]].map(([dx, dy]) => ({ x: door.x + dx, y: door.y + dy })).filter((c) => map.at(c.x, c.y).door === 'door' && map.passable(c.x, c.y) !== 'ok');
  w.ok(sealed.length === 1 && !(V.exits ?? []).some((e) => e.x === sealed[0].x && e.y === sealed[0].y),
    `at the vault's far end the rails run under a door that opens for nobody, a wall drawn as a door (${sealed.map((c) => `${c.x},${c.y}`).join(' ')})`);
  w.ok(cave?.kind === 'event' && ['under the Hand\'s seal, packed in straw', 'shards of every colour, not yet cut'].every((t) => ev('dd2_seal')!.text.includes(t) && cave.text.includes(t)),
    'the crates beside it are under the Hand\'s seal, in the words of Sheer Point\'s crates, and nothing says what that means');
  // The count: two columns, the knot at the head, Wenna's name alone marked, and no word of what the mark is.
  const right = ev('dd2_right')!.text, said = (V.features ?? []).flatMap((f) => 'text' in f && typeof f.text === 'string' ? [f.text] : []).join(' ');
  w.ok(/two columns/.test(ev('dd2_count')!.text) && right.includes('Wenna, of Gullwick') && right.includes('a loop inside a loop') && !/captain|the line\b|queen/i.test(said),
    'on the wall the count in two columns, and by Wenna\'s name alone a loop inside a loop, never said to be anything');
  const groups = V.encounters!, kinds = (id: string): string => groups.find((g) => g.id === id)?.monsters.join() ?? '';
  w.ok(groups.length === 5 && groups.every((g) => !!g.respawn && !g.after && !g.when)
    && groups.filter((g) => g.y <= 11).every((g) => g.monsters.every((m) => m === 'loader') || g.id === 'dd2_knockers')
    && groups.filter((g) => g.y >= 15).every((g) => g.monsters.every((m) => m === 'hold_keeper'))
    && kinds('dd2_knockers') === 'deep_knocker,deep_knocker,deep_knocker,deep_knocker' && Math.abs(groups.find((g) => g.id === 'dd2_knockers')!.x - sealed[0]?.x) <= 2,
    'loaders in the shards\' vault, hold keepers in the people\'s and four deep knockers at the rails\' door');
  for (const g of groups) fight(w, `${V.id}:${g.id}`);
  const rest = V.features!.find((f) => f.kind === 'camp');
  w.ok(rest?.kind === 'camp' && rest.y >= 15 && (rest.x < 15 || rest.x > 17), `an empty pen off the aisle is the vaults' rest (${rest?.kind === 'camp' ? `${rest.name}, ${rest.x},${rest.y}` : 'none'})`);
  const gold = w.party.gold;
  open(w, V.id, 'dd2_box1');
  open(w, V.id, 'dd2_box2');
  w.ok(w.party.gold - gold >= 1000, `by the rails, the Compact's drop coin, heavy (${w.party.gold - gold} gold)`);
  w.ok(open(w, V.id, 'dd2_heap').every((i) => item(i).slot === 'none' && !item(i).price), 'in a pen, a keeper\'s parts, which no shop buys');
  const piece = open(w, V.id, 'dd2_straw');
  w.ok(piece.length === 1 && !!item(piece[0]).plus && item(piece[0]).price <= 6000, `in another pen's straw, a named piece inside the band's window (${piece.map((i) => `${item(i).name}, ${item(i).price}`).join()})`);

  // The hoist: its chains go into the wall by the count; a search there, and the cage takes the company up
  // beside the drop's crates. Nothing on the drop leads down it.
  const [secret] = V.secrets!, chains = ev(secret.hint)!;
  w.ok(V.secrets!.length === 1 && secret.hint === 'dd2_chains' && !chains.once && HOIST.x === secret.x - 1 && HOIST.y === secret.y && (V.exits ?? []).includes(HOIST)
    && !(D.exits ?? []).some((e) => e.to === V.id && e !== VAULT_STAIR),
    'the hoist is behind the wall where the chains go in, its one secret, and the drop has no way down it');
  w.world.travel(V.id, chains.x, chains.y, WEST);
  w.world.eventsHere();
  let found = false;
  for (let i = 0; i < 20 && !found; i++) found = w.world.search();
  const ride = found ? [w.world.move('forward'), w.world.move('forward')] : [];
  w.ok(found && ride.every((r) => r.kind === 'moved') && w.world.state.mapId === D.id && w.world.state.x === HOIST.tx && w.world.state.y === HOIST.ty && w.world.state.facing === EAST
    && ride[1]?.kind === 'moved' && ride[1].messages.includes(HOIST.label!)
    && D.features!.some((f) => f.kind === 'event' && f.id === 'dd_cage' && f.x === HOIST.tx && f.y === HOIST.ty),
    `searched where the chains go into the wall, a door, and the cage up to the drop beside its crates, where it is seen from above too (${here()})`);
  listen(w);
  see(w, `${D.id}:dd_cage`);

  // The steps down to the writer's room, the counting house (WRITER_STAIR): its line at its head, the once.
  const head = ev('dd2_down');
  w.ok(WRITER_STAIR.to === DEAD_DROP3.id && (V.exits ?? []).includes(WRITER_STAIR) && map.passable(WRITER_STAIR.x, WRITER_STAIR.y) === 'ok'
    && head?.kind === 'event' && !!head.once && head.x === WRITER_STAIR.x && head.y === WRITER_STAIR.y - 1,
    'the steps go on down to the writer\'s room (WRITER_STAIR), and the line at their head is said the once');
  see(w, `${V.id}:dd2_down`);
  countingHouse(w);
  w.level = level;
}

/**
 * The Dead-Drop's counting house (#22), at 27, its floor: down the vaults' steps onto its first square, facing in,
 * and back up onto the steps' head; over its door the vessel's word for the room, to a reader of Kiln-script, and
 * no word of what the vessel is; the room of desks, and a tally clerk with a loader by the rail; through the gate
 * in the rail the Tallymaster in sight at its desk, writing, the once, which sets the flag that the company has
 * learned who writes the orders; beside the desk the in-tray, letters in the hand that countersigned the customs
 * seal, never named, and the out-tray, the orders, reached from the door without coming beside any group; the
 * Compact's coin and a clerk's parts; the Tallymaster, open only before its desk, never moving, never coming back
 * once broken, won at 27; and no way on down.
 */
function countingHouse(w: Walk): void {
  const C = DEAD_DROP3, V = DEAD_DROP2, level = w.level, map = new GameMap(C);
  const here = (): string => `${w.world.state.mapId} ${w.world.state.x},${w.world.state.y}`;
  const ev = (id: string): Extract<Feature, { kind: 'event' }> | undefined => C.features!.find((f): f is Extract<Feature, { kind: 'event' }> => f.kind === 'event' && f.id === id);
  w.world.travel(V.id, WRITER_STAIR.x, WRITER_STAIR.y - 1, SOUTH);
  const down = w.world.move('forward');
  w.ok(down.kind === 'moved' && w.world.state.mapId === C.id && w.world.state.x === C.start.x && w.world.state.y === C.start.y && w.world.state.facing === C.start.facing
    && WRITER_STAIR.tx === C.start.x && WRITER_STAIR.ty === C.start.y && down.messages.includes(WRITER_STAIR.label!),
    `the vaults' steps go on down into the counting house, facing in (${here()}: ${down.kind === 'moved' ? down.messages.join(' / ') : down.kind})`);
  const up = [w.world.move('forward'), w.world.move('back')];
  w.ok(up.every((r) => r.kind === 'moved') && w.world.state.mapId === V.id && w.world.state.x === WRITER_STAIR.x && w.world.state.y === WRITER_STAIR.y - 1 && w.world.state.facing === NORTH,
    `and back up onto the steps' head, facing away from them (${here()})`);

  // Over the door at the steps' foot, marks like the Kilns': the room's word, read by a reader, and nothing of a vessel.
  const marks = C.features!.find((f) => f.kind === 'sign' && f.id === 'dd3_marks');
  const door = { x: C.start.x, y: C.start.y + 2 };
  w.ok(marks?.kind === 'sign' && !!marks.read && marks.x === C.start.x && marks.y === C.start.y + 1 && map.at(door.x, door.y).door === 'door' && map.passable(door.x, door.y) === 'ok'
    && !/\b(hull|ship|orbit|voyage|custodian|core)\b/i.test(`${marks.text} ${marks.read}`),
    `over the door at the steps' foot, marks a reader of Kiln-script reads, the vessel's word for the room and no word of a vessel (${marks?.kind === 'sign' ? marks.read : 'none'})`);

  w.level = 27;
  for (const id of ['dd3_in', 'dd3_ledgers', 'dd3_shelves', 'dd3_stools']) see(w, `${C.id}:${id}`);
  const groups = C.encounters!, desk = groups.find((g) => g.id === 'dd3_tallymaster'), clerk = groups.find((g) => g.id === 'dd3_clerk');
  w.ok(groups.length === 2 && clerk?.monsters.join() === 'tally_clerk,loader' && !!clerk.respawn && clerk.roams === false && clerk.y < 16
    && desk?.monsters.join() === 'tallymaster' && desk.roams === false && !desk.respawn && !!desk.slainText && !desk.after && !desk.when,
    'a tally clerk with a loader by the rail, and at the room\'s head the Tallymaster alone at its desk, which never moves and once broken stays so');
  if (!desk) return;
  const beside = [[-1, 0], [1, 0], [0, -1], [0, 1]].map(([dx, dy]) => ({ x: desk.x + dx, y: desk.y + dy })).filter((c) => map.passable(c.x, c.y) === 'ok');
  w.ok(beside.length === 1 && beside[0].x === desk.x && beside[0].y === desk.y - 1,
    `it fights only a company that steps to its desk: the one square beside it is before the desk (${beside.map((c) => `${c.x},${c.y}`).join(' ')})`);

  // Through the gate in the rail it is in sight, writing, out of its reach: the once, and the flag.
  const writes = ev('dd3_writes')!;
  w.world.travel(C.id, writes.x, writes.y, SOUTH);
  w.world.state.light = 9;
  const sighted = w.world.groupsInSight().map((g) => g.def.id);
  w.world.state.light = 0;
  w.ok(!!writes.once && writes.sets === 'q_writer_seen' && sighted.includes(desk.id) && !w.world.adjacentGroups().length,
    `through the gate in the rail the Tallymaster is in sight at its desk, writing, out of its reach (${here()}: ${sighted.join(', ') || 'nothing in sight'})`);
  see(w, `${C.id}:dd3_writes`);
  w.ok(!!w.party.flags.q_writer_seen, 'seen writing, it sets the flag that the company has learned who writes the orders (q_writer_seen)');

  // The trays: the letters and the orders, reached from the door without coming beside any group.
  const clear = (x: number, y: number): boolean => map.passable(x, y) === 'ok' && groups.every((g) => Math.abs(g.x - x) + Math.abs(g.y - y) > 1);
  const reach = new Set([`${C.start.x},${C.start.y}`]), todo: [number, number][] = [[C.start.x, C.start.y]];
  for (let i = 0; i < todo.length; i++) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const x = todo[i][0] + dx, y = todo[i][1] + dy;
    if (!reach.has(`${x},${y}`) && clear(x, y)) { reach.add(`${x},${y}`); todo.push([x, y]); }
  }
  const orders = C.features!.find((f) => f.kind === 'chest' && f.id === 'dd3_orders'), letters = ev('dd3_intray')!;
  w.ok(orders?.kind === 'chest' && orders.items.join() === 'compact_orders' && reach.has(`${orders.x},${orders.y}`) && reach.has(`${letters.x},${letters.y}`),
    'the in-tray and the out-tray, the orders in it, are reached from the door without coming beside any group: taken without a fight');
  const said = (C.features ?? []).flatMap((f) => 'text' in f && typeof f.text === 'string' ? [f.text] : []).join(' ');
  w.ok(/countersigned/.test(letters.text) && /Helmstow seal/.test(letters.text) && !/Regent/i.test(said),
    'in the in-tray letters in the hand that countersigned the customs seal, its owner never named');
  for (const id of ['dd3_intray', 'dd3_outtray', 'dd3_coin', 'dd3_nibs']) see(w, `${C.id}:${id}`);
  const taken = open(w, C.id, 'dd3_orders'), read = item('compact_orders');
  w.ok(taken.join() === 'compact_orders' && read.slot === 'none' && !read.price && !!read.text?.length && w.party.bag.includes('compact_orders'),
    `from the out-tray the Compact's orders, read from the pack (${read.name})`);
  const gold = w.party.gold;
  open(w, C.id, 'dd3_strongbox');
  w.ok(w.party.gold - gold >= 1000, `by the desk, the Compact's drop coin, heavy (${w.party.gold - gold} gold)`);
  w.ok(open(w, C.id, 'dd3_heap').every((i) => item(i).slot === 'none' && !item(i).price), 'in a bin of spent nibs, a clerk\'s frame and a nib, which no shop buys');

  for (const g of groups) fight(w, `${C.id}:${g.id}`);
  w.ok((C.exits ?? []).length === 1 && C.exits![0].to === V.id && !C.secrets?.length, 'and no way on down: the counting house\'s one way out is back up the steps');
  w.level = level;
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

/**
 * The bounds (#835, docs/areas/wrackholm.md §12): the scraps of shore round the isle, three strands
 * that hold no group. North from E6's grass onto E5's strand, walked, the land not named again, and on
 * east into F5's; the figurehead's riddle; the soot on the stack's face and the hollow behind it, shut
 * but through its door. North from F6's grass onto F5's strand; the cairn; the fish scales at the
 * stack's foot and the bait store behind it; the reef at F5's 16,30 left bare for the lair's door.
 * South from F6's shingle onto F7's strand; the spring under the cliff; the cut chain and the hollow
 * behind the rock. Each box's edges as built. Last, the Brokenback, the enclave (#845): in at the break
 * in the wreck's side at E5's 18,28, its door saying its band and how it feels at 11, 12 and 14 and its
 * sign its band; its two groups won at 14 and met in order by a company on foot, which passes neither;
 * Keelhaul in the master's strongbox, the hollow under the cabin's deck found from the worn plank and
 * shut to the four ways but through its wall; and out onto E5's 18,29 again.
 */
function theBounds(ok: (cond: boolean, msg: string) => void): void {
  const w = newWalk(ok);
  w.level = 12;
  const out = buildMaps()[OUTDOORS], zone = (id: string): MapZone => out.zones.find((z) => z.id === id)!;
  const E5 = WRACKHOLM_E5, F5 = WRACKHOLM_F5, F7 = WRACKHOLM_F7;
  const e5 = zone(E5.id), f5 = zone(F5.id), f7 = zone(F7.id), e6 = zone(E6.id), f6 = zone(F6.id), e7 = zone('wold_e7');
  const ALL: Can = { swim: true, climb: true, float: true };
  const said = (r: ReturnType<typeof w.world.move>): string => (r.kind === 'moved' ? r.messages.join(' / ') || 'nothing said' : r.kind);
  const at = (z: MapZone, x: number, y: number): number => (z.y + y) * out.width + z.x + x;
  /** The squares of a box reached from one of its own, inside the box: on foot, or every way with its secret door shut. */
  const reach = (z: MapZone, from: readonly [number, number], can: Can, door?: readonly [number, number]): Set<number> => {
    const seen = new Set<number>(), todo = [[z.x + from[0], z.y + from[1]]];
    while (todo.length) {
      const [x, y] = todo.pop()!, k = y * out.width + x;
      if (seen.has(k) || (door && x === z.x + door[0] && y === z.y + door[1]) || x < z.x || x >= z.x + z.w || y < z.y || y >= z.y + z.h || out.passable(x, y, can) !== 'ok') continue;
      seen.add(k);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
    }
    return seen;
  };
  /** Searched from a square facing the face, the wall gives and the room behind it is walked into. */
  const search = (map: string, x: number, y: number, facing: Facing, room: string): boolean => {
    w.world.travel(map, x, y, facing);
    let found = false;
    for (let i = 0; i < 20 && !found; i++) found = w.world.search();
    const into = found ? [w.world.move('forward'), w.world.move('forward')] : [];
    listen(w);
    return found && into.every((r) => r.kind === 'moved') && w.world.used(room);
  };
  const chest = (d: MapDef, id: string): string => { const c = d.features!.find((f) => f.kind === 'chest' && f.id === id); return c?.kind === 'chest' ? `${c.gold} ${c.items.join()}` : 'none'; };
  /** A door left bare: rock, rock either side along the face, its way walked to, nothing within four squares. */
  const bare = (d: MapDef, walked: Set<number>, z: MapZone, [x, y]: readonly [number, number], [dx, dy]: readonly [number, number]): string[] => {
    const near = [...(d.features ?? []), ...(d.encounters ?? []), ...(d.secrets ?? [])].filter((f) => Math.abs(f.x - x) + Math.abs(f.y - y) <= 4);
    return [d.rows[y][x] === 'r' && d.rows[y - dx]?.[x - dy] === 'r' && d.rows[y + dx]?.[x + dy] === 'r' ? '' : 'not rock in a face',
      walked.has(at(z, x + dx, y + dy)) ? '' : 'its way not walked to', ...near.map((f) => `${f.x},${f.y} within four`)].filter(Boolean);
  };
  const open = (n: number, f: (i: number) => boolean): string => Array.from({ length: n }, (_, i) => f(i)).join();
  ok([E5, F5, F7].every((d) => !(d.encounters ?? []).length) && (E5.exits ?? []).map((e) => e.to).join() === BROKENBACK.id && ![F5, F7].some((d) => (d.exits ?? []).length),
    'the strands hold no group, and nothing is taken out of them but E5\'s one way, in at the break into the Brokenback');

  // E5: north from E6's grass at 24,0 onto the strand's 24,31, walked, in Wrackholm still.
  w.world.travel(e6.id, 24, 0, NORTH);
  const north = w.world.move('forward');
  ok(north.kind === 'moved' && w.world.zone?.id === E5.id && w.world.state.x === e5.x + 24 && w.world.state.y === e5.y + 31 && e5.y + e5.h === e6.y && !said(north).includes('Wrackholm'),
    `north from E6's 24,0 onto E5's 24,31, walked, and the land not named again (${said(north)})`);
  listen(w);
  ok(E5.start.x === 24 && E5.start.y === 31 && E5.start.facing === NORTH, 'E5 starts at its south edge, in from the moor');
  const strand5 = reach(e5, [E5.start.x, E5.start.y], {});
  ok(strand5.size > 60 && [[15, 31], [18, 29], [24, 30], [25, 28], [28, 27], [31, 26]].every(([x, y]) => strand5.has(at(e5, x, y))),
    `E5's strand (${strand5.size} squares): its west end, the way to the black rocks, the figurehead and the stack's face are walked to from the way in`);
  see(w, `${E5.id}:e5_strand`);
  const figure = E5.features!.find((f): f is Extract<Feature, { kind: 'statue' }> => f.kind === 'statue' && f.id === 'e5_figurehead')!;
  w.world.travel(E5.id, figure.x, figure.y);
  ok(!answerRiddle(w.world, w.party, figure, 'tide').right && answerRiddle(w.world, w.party, figure, 'Anchor').right, 'the figurehead\'s riddle is answered anchor, let go for the ship to stay and hauled home for her to sail, and not tide');
  // The secret: the soot on the stack's face, the search there and the hollow behind it.
  const lamp = reach(e5, [E5.start.x, E5.start.y], ALL, [28, 26]);
  ok(lamp.size > 60 && !lamp.has(at(e5, 28, 25)), `the hollow is shut but for its door in the stack: none of E5's ${lamp.size} squares walked, waded, climbed or floated reaches it`);
  see(w, `${E5.id}:e5_soot`);
  ok(search(E5.id, 28, 27, NORTH, 'e5_lamp'), 'searched where the soot is, the rock gives, and the hollow behind it can be walked into');
  ok(chest(E5, 'e5_chest') === '150 elixir', `in the hollow, a sea chest with 150 gold and an Elixir (${chest(E5, 'e5_chest')})`);
  // The enclave's door (docs §12.5) is the break in the wreck's side, 18,28 in the black rocks at the strand's west end: walked into last.
  // And on east along the strand into F5, walked.
  w.world.travel(E5.id, 31, 28, EAST);
  const east = w.world.move('forward');
  ok(east.kind === 'moved' && w.world.zone?.id === F5.id && w.world.state.x === f5.x && w.world.state.y === f5.y + 28 && !said(east).includes('Wrackholm'), `east along the strand from E5's 31,28 onto F5's 0,28, walked (${said(east)})`);
  listen(w);

  // F5: north from F6's grass at 8,0 onto the strand's 8,31, walked.
  w.level = 13;
  w.world.travel(f6.id, 8, 0, NORTH);
  const onto5 = w.world.move('forward');
  ok(onto5.kind === 'moved' && w.world.zone?.id === F5.id && w.world.state.x === f5.x + 8 && w.world.state.y === f5.y + 31 && !said(onto5).includes('Wrackholm'),
    `north from F6's 8,0 onto F5's 8,31, walked (${said(onto5)})`);
  listen(w);
  const strand6 = reach(f5, [F5.start.x, F5.start.y], {});
  ok(strand6.size > 60 && [[0, 26], [2, 27], [8, 30], [9, 28], [16, 31], [18, 31]].every(([x, y]) => strand6.has(at(f5, x, y))),
    `F5's strand (${strand6.size} squares): the cairn, the stack's foot, the way to the reef and the strand's east end are walked to from the way in`);
  see(w, `${F5.id}:f5_strand`);
  const cairn = F5.features!.find((f) => f.kind === 'cairn' && f.id === 'f5_cairn');
  ok(cairn?.kind === 'cairn' && cairn.gold === 80 && cairn.items?.join() === 'potion_sp_great', 'above the weed, a cairn with 80 gold and a Sapphire Vial');
  const bait = reach(f5, [F5.start.x, F5.start.y], ALL, [9, 27]);
  ok(bait.size > 60 && !bait.has(at(f5, 9, 26)), `the bait store is shut but for its door in the stack: none of F5's ${bait.size} squares walked, waded, climbed or floated reaches it`);
  see(w, `${F5.id}:f5_scales`);
  ok(search(F5.id, 9, 28, NORTH, 'f5_store'), 'searched where the scales are dried on the rock\'s foot, the rock gives, and the store behind it can be walked into');
  ok(chest(F5, 'f5_box') === '120 elixir', `under the casks, a box with 120 gold and an Elixir (${chest(F5, 'f5_box')})`);
  // The lair's door (docs §12.6) is left bare: the reef at the strand's east end, 16,30.
  const reef = bare(F5, strand6, f5, [16, 30], [0, 1]);
  ok(!reef.length, `the reef at F5's 16,30 is left bare for the lair's door, walked to from 16,31, nothing within four squares${reef.length ? ` (not: ${reef.join(', ')})` : ''}`);

  // F7: south from F6's shingle at 14,31 onto the strand's 14,0, walked.
  w.world.travel(f6.id, 14, 31, SOUTH);
  const south = w.world.move('forward');
  ok(south.kind === 'moved' && w.world.zone?.id === F7.id && w.world.state.x === f7.x + 14 && w.world.state.y === f7.y && f6.y + f6.h === f7.y && !said(south).includes('Wrackholm'),
    `south from F6's shingle at 14,31 onto F7's 14,0, walked (${said(south)})`);
  listen(w);
  ok(F7.start.x === 14 && F7.start.y === 0 && F7.start.facing === SOUTH, 'F7 starts at its north edge, in from the shingle');
  const strand7 = reach(f7, [F7.start.x, F7.start.y], {});
  const spring = F7.features!.find((f) => f.kind === 'fountain')!;
  ok(strand7.size > 40 && [[1, 0], [5, 1], [10, 3], [12, 4], [15, 3], [19, 0]].every(([x, y]) => strand7.has(at(f7, x, y))) && spring.x === 5 && spring.y === 1,
    `F7's strand (${strand7.size} squares): the spring under the cliff, the rock's foot and both ends are walked to from the way in`);
  see(w, `${F7.id}:f7_strand`);
  const irons = reach(f7, [F7.start.x, F7.start.y], ALL, [10, 4]);
  ok(irons.size > 40 && !irons.has(at(f7, 10, 5)), `the hollow is shut but for its door in the rock: none of F7's ${irons.size} squares walked, waded, climbed or floated reaches it`);
  see(w, `${F7.id}:f7_links`);
  ok(search(F7.id, 10, 3, SOUTH, 'f7_hole'), 'searched where the cut chain lies, the rock gives, and the hollow behind it can be walked into');
  ok(chest(F7, 'f7_purse') === '100 potion_sp_great', `in the weed, a purse with 100 gold and a Sapphire Vial (${chest(F7, 'f7_purse')})`);

  // The edges: E5's south meets E6's north, open at 15 to 31; E5's east meets F5's west, open at 26 to
  // 31; F5's south meets F6's north, open at 0 to 18; F7's north meets F6's south, open at 1 to 10, 13 to
  // 15 and 17 to 19, its rock and shingle as F6's. The rest is the sea, shut to every company, but
  // F7's 0,0, shallows a swimmer wades, against the Wold's deep water at E7's 31,0.
  const row = (z: MapZone, y: number, can: Can = {}): string => open(32, (i) => out.passable(z.x + i, z.y + y, can) === 'ok');
  const col = (z: MapZone, x: number, can: Can = {}): string => open(32, (i) => out.passable(z.x + x, z.y + i, can) === 'ok');
  ok(row(e5, 31) === open(32, (i) => i >= 15) && row(e5, 31) === row(e6, 0) && col(e5, 31) === open(32, (i) => i >= 26) && col(e5, 31) === col(f5, 0)
    && row(f5, 31) === open(32, (i) => i <= 18) && row(f5, 31) === row(f6, 0)
    && row(f7, 0) === open(32, (i) => (i >= 1 && i <= 10) || (i >= 13 && i <= 15) || (i >= 17 && i <= 19)) && row(f7, 0) === row(f6, 31),
    'E5 meets E6 at 15 to 31 and F5 at 26 to 31, F5 meets F6 at 0 to 18 and F7 meets F6 at 1 to 10, 13 to 15 and 17 to 19, square for square');
  const none = open(32, () => false);
  ok([row(e5, 0, ALL), col(e5, 0, ALL), row(f5, 0, ALL), col(f5, 31, ALL), row(f7, 31, ALL), col(f7, 31, ALL)].every((s) => s === none)
    && col(f7, 0, ALL) === open(32, (i) => i === 0) && col(f7, 0) === none && out.passable(e7.x + 31, e7.y, ALL) !== 'ok',
    'past the strands the sea, shut to every company, but F7\'s 0,0, shallows a swimmer wades and the Wold\'s deep water shuts');

  // The Brokenback, the enclave (#845): in at the break in the wreck's side, E5's 18,28, one stone among the black
  // rocks with rock either side, walked onto from the strand at 18,29, and nothing within four squares of it. Its
  // door says its band and how it feels, as a border's line: the warning at 11, harder at 12 and its band alone at
  // 14; inside, its sign gives its band.
  {
    const WB = BROKENBACK, mouth = E5.exits!.find((e) => e.to === WB.id)!, levels = w.party.members.map((m) => m.level);
    type Group = NonNullable<MapDef['encounters']>[number];
    const near4 = [...E5.features!, ...(E5.encounters ?? []), ...E5.secrets!].filter((f) => Math.abs(f.x - 18) + Math.abs(f.y - 28) <= 4);
    ok(mouth.x === 18 && mouth.y === 28 && mouth.tx === WB.start.x && mouth.ty === WB.start.y && E5.rows[28].slice(17, 20) === 'r"r' && strand5.has(at(e5, 18, 29)) && !near4.length,
      `the break into the Brokenback is the one stone in the black rocks at E5's 18,28, rock either side, walked to from the strand at 18,29, and nothing stands within four squares of it${near4.length ? ` (${near4.map((f) => `${f.x},${f.y}`).join(' ')})` : ''}`);
    const door = (level: number): string => {
      for (const m of w.party.members) m.level = level;
      w.world.travel(E5.id, 18, 29, NORTH);
      const r = w.world.move('forward');
      return r.kind === 'moved' && w.world.state.mapId === WB.id && w.world.state.x === WB.start.x && w.world.state.y === WB.start.y ? r.messages.join(' | ') : r.kind;
    };
    const band = 'The Brokenback: levels 14-15.', far = door(11), near = door(12), at14 = door(14);
    ok(far === `${mouth.label} | ${band} ${WARNING_IN}` && near === `${mouth.label} | ${band} ${HARDER_IN}` && at14 === `${mouth.label} | ${band}`,
      `in at the break from E5's 18,29, the way's own line and then its band, with the warning at 11, harder at 12 and nothing more at 14 (${far}; ${near}; ${at14})`);
    ok(!!WB.enclave && w.world.here.name === 'The Brokenback' && w.world.here.band?.join('-') === '14-15', `inside, its sign gives its own band, over E5's 12-13 (${w.world.here.name}, ${w.world.here.band?.join('-')})`);
    listen(w);
    // Its two groups, won at its floor, the nearer the gentler (13.5 and 15): three overseers with a gleaner at the hold's mouth and
    // four gleaners at the cabin's door. A company on foot, swimming or climbing meets them in that order and passes neither: the
    // way aft runs through the doorway the first stands behind, and the cabin and the plank lie past the second.
    w.level = 14;
    const [first, last] = [WB.encounters!.find((g) => g.id === 'wb_strippers')!, WB.encounters!.find((g) => g.id === 'wb_gleaners')!];
    ok(WB.encounters!.length === 2 && first.monsters.join() === 'ashen_overseer,ashen_overseer,ashen_overseer,ashen_gleaner' && last.monsters.join() === 'ashen_gleaner,ashen_gleaner,ashen_gleaner,ashen_gleaner'
      && WB.encounters!.every((g) => g.respawn === 2880 && !g.slainText && g.roams === false), 'three overseers with a gleaner at the hold\'s mouth and four gleaners at the cabin\'s door, and no guardian');
    for (const g of WB.encounters!) fight(w, `${WB.id}:${g.id}`);
    for (const id of ['wb_break', 'wb_tide', 'wb_hold', 'wb_bulkhead', 'wb_cabin', 'wb_stern']) see(w, `${WB.id}:${id}`);
    const hold = new GameMap(WB), key = (x: number, y: number): string => `${x},${y}`, [wall] = WB.secrets!;
    /** What a company reaches from the way in, the secret wall shut and the squares within a step of a live group not entered (a fight takes them), and the live groups it comes up to. */
    const walk = (live: readonly Group[], can: Can): { seen: Set<string>; met: string[] } => {
      const seen = new Set<string>(), met = new Set<string>(), todo: [number, number][] = [[WB.start.x, WB.start.y]];
      while (todo.length) {
        const [x, y] = todo.pop()!;
        if (seen.has(key(x, y)) || (x === wall.x && y === wall.y) || hold.passable(x, y, can) !== 'ok') continue;
        const next = live.filter((g) => Math.abs(g.x - x) + Math.abs(g.y - y) <= 1);
        next.forEach((g) => met.add(g.id));
        if (next.length) continue;
        seen.add(key(x, y));
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
      }
      return { seen, met: [...met] };
    };
    const both = walk([first, last], {}), swum = walk([first, last], ALL), second = walk([last], {}), waded = walk([last], ALL), done = walk([], ALL);
    ok(both.met.join() === first.id && swum.met.join() === first.id && !both.seen.has(key(7, 8)) && !swum.seen.has(key(7, 8))
      && second.met.join() === last.id && waded.met.join() === last.id && second.seen.has(key(4, 10)) && !second.seen.has(key(11, 13)) && !waded.seen.has(key(11, 13)) && done.seen.has(key(11, 13)),
      'a company on foot or any way else meets the overseers first and cannot pass them to the hold; with them down it comes up to the gleaners and cannot pass them, the cargo behind it and the cabin and the plank beyond them');
    const feat = (id: string): Feature => WB.features!.find((f) => 'id' in f && f.id === id)!;
    ok(chest(WB, 'wb_cargo') === '250 elixir', `in the hold, the cargo's chest: 250 gold and an Elixir (${chest(WB, 'wb_cargo')})`);
    // The secret: the one plank of the cabin's deck worn bright, the search there and the hollow under the deck behind the
    // wall. Walked, waded, climbed or floated, it is never reached but through the wall.
    ok(wall.hint === 'wb_plank' && feat('wb_plank').x === wall.x - 1 && feat('wb_plank').y === wall.y && done.seen.size > 80 && !done.seen.has(key(wall.x + 1, wall.y)) && !done.seen.has(key(wall.x + 2, wall.y)),
      `the master's strongbox is shut but for the wall by the plank: none of the Brokenback's ${done.seen.size} squares walked, waded, climbed or floated reaches it`);
    see(w, `${WB.id}:wb_plank`);
    ok(search(WB.id, wall.x - 1, wall.y, EAST, 'wb_under'), 'searched where the plank is worn bright, the wall gives, and the hollow under the deck can be walked into');
    const axe = item('keelhaul'), great = item('great_axe'), plus = item('great_axe+1');
    ok(chest(WB, 'wb_strongbox') === '300 keelhaul'
      && !MAP_DEFS.some((d) => (d.features ?? []).some((f) => (f.kind === 'shop' && f.stock.includes('keelhaul')) || ((f.kind === 'chest' || f.kind === 'cairn') && f.id !== 'wb_strongbox' && f.items?.includes('keelhaul'))))
      && !Object.values(MONSTERS).some((m) => m.drops?.some((d) => d.item === 'keelhaul')),
      'in the master\'s strongbox, 300 gold and Keelhaul; no shop sells it, no other chest or cairn holds it and no monster drops it');
    ok(axe.element === 'cold' && !axe.artifact && axe.price <= CURVE.sunderwood.price && hits(axe) > hits(plus) && hits(plus) > hits(great)
      && GEAR.some(([level, ids]) => level === 14 && ids.includes(great.id)) && GEAR.some(([level, ids]) => level === 16 && ids.includes(plus.id)) && !GEAR.some(([, ids]) => ids.includes(axe.id)),
      `Keelhaul, the long axe with a die of cold and on no rung of the ladder, hits ${hits(axe)} against the Great Axe's ${hits(great)}, the ladder's from 14, and its plus's ${hits(plus)}, from 16, at ${axe.price} inside the Sunderwood's ${CURVE.sunderwood.price}`);
    // And out: through the break onto E5's 18,29, with the way's own line and no other.
    w.world.travel(WB.id, WB.start.x, WB.start.y + 1, NORTH);
    const back = w.world.move('forward');
    ok(back.kind === 'moved' && w.world.zone?.id === E5.id && w.world.state.x === e5.x + 18 && w.world.state.y === e5.y + 29 && back.messages.join(' | ') === WB.exits![0].label,
      `out through the break onto E5's 18,29, the way's own line alone (${said(back)})`);
    listen(w);
    w.party.members.forEach((m, i) => { m.level = levels[i]; });
    w.level = 13;
  }
}
