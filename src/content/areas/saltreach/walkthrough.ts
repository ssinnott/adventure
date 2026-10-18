// Saltreach's walkthrough. First its chapter, The Tide Stone (#180), played a step at a time
// (tools/walk.ts). In order, at 10 and 11: the Foreland and the Grove played from a new game, then
// down off the Edge into the Delta, up the spur to Wytske on Rietum's quay, west to the empty
// plinth, south to the priestess at the temples' dry door and in, and down to Saltmouth, where the
// Warden has the news of Hale and Kitto the ship; then the boat out to Wrackholm, where the goal
// passes to Wrackholm's chapter and the Tide Stone stays open until the Stone is home. Saltmouth
// first, at 12, before the Grove: Kitto's word begins the chapter, and the plinth is seen before the
// boat. Wrackholm's walkthrough plays both runs on from the landing (#191). The news of Hale waits
// on #156, set by hand where it will be.
//
// Then the area as built: the Delta road (C5 and D5, #170) walked: down off Kestrel Edge onto the shore, where the land says
// what it is to a company under its band; the hermit on the islet, who points up the spur; the
// barge under the causeway's arch found from its hint; and the box's groups and its Rift's won at
// its floor. Then the spur to Rietum (C4, #171): the eel-trapper's word on the poleman, the crews'
// hide found from the gap in the herons, Passage Paid answered both ways and its people found after
// each, and the box's groups won.
// Then up the track into Rietum (C3, #172): the Upper Water named at the seam; the quay-hand who saw
// the Stone go by, the step, and the priest's word on a pole's mark; the old smuggler's cache found
// from the clean stone in the quay and reached no other way; the two second prestiges taught off the
// road; the box's groups won at 10; and The Night-Light (#183) played every way.
// Then west over the fen to Stienwierde (B5, #173): the duckboards to the plinth, empty, and told two
// ways (#582: the cut seen under the roots, or the socket and no more); the hermit
// who counts the Rifts' lights; the hollow under the landing found from its pole-marks; and the
// box's groups and its two Rifts' won at 11. Then south to the Drowned Temples' approach (B6, #174):
// the priestess at the dry door and her count; the far roof's door found from the count's pause;
// and the box's groups won at 11. Then the Drowned Temples (#175): down the far roof's wet stair into
// the sacristy, its silver had that way alone, and out again; in at the dry door, the nave's drowned
// and the count up the apse's stair; the choir and the Choirmaster won at 11, the Tide Bell taken and
// the count stopped for good; and the bell up to the priestess, who rings it, and the Tidefolk's
// blessing knelt for at its frame, and her words after it with the Stone away and home. Then back to the road
// and down it into Saltmouth's box (C6, #176):
// the Saltings named at the seam, the land gate at the road's end, the smugglers' stair found from
// the rope that hangs over it, and the quay's and the pans' groups won at the box's floor. Then in
// at the gate to Saltmouth (#177) and out again: the band's gear bought, training to 13 and a first
// prestige taken; the Cartographers' first task taken at the Map Room, the road chained stone to
// stone and the first rank's work done (#181), and the first Meridian journal read there; Pender's
// picks and the Map Room's chart bought, carried and sold back (#860); the Salt
// Compact joined at the Keel (#182) by its run of brandy past the customs house, and its first
// rank's crate; the way down through the Keel's cellar to the stair found from its sawdust; and the
// boat to Wrackholm's landing and back, at the half fare a member pays. Then south into the pans
// (C7, #178): the Scarp across the south and its stair's fallen foot, the sealed pan's hoard found
// from the trodden wall, and the crabs and the toads won at 11; and The Star That Moved (#183)
// played every way. Then the bounds (#830), as `theBounds` walks them, box by box.
import type { Walkthrough } from '../../area.ts';
import { newWalk, walkThrough, fight, listen, see, kneel, meetWho, playChapter, everyGoalWalked, goalFromBegun, quest } from '../../../../tools/walk.ts';
import { headlessGame, drive } from '../../../../tools/tests/lib.ts';
import type { Step, Walk } from '../../../../tools/walk.ts';
import { CHAPTER } from './chapter.ts';
import { CHAPTER as FORELAND } from '../shelf/chapter.ts';
import { CHAPTER as GROVE } from '../thornmark/chapter.ts';
import { STEPS as FORELAND_STEPS, hired, ledgerGiven } from '../shelf/walkthrough.ts';
import { STEPS as GROVE_STEPS } from '../thornmark/walkthrough.ts';
import { EAST, NORTH, SOUTH, WEST } from '../../../game/types.ts';
import type { Facing } from '../../../game/types.ts';
import { GameMap } from '../../../game/map.ts';
import type { Can, Feature, MapDef } from '../../../game/map.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { restRefused, answerRiddle } from '../../../game/wilds.ts';
import { buy, item, priceIn } from '../../../game/items.ts';
import { canTrainAt, xpForLevel, prestigeOf, takePrestige, createCharacter, PRESTIGES, resists, rest, isDown, NAME_MAX } from '../../../game/party.ts';
import type { Party } from '../../../game/party.ts';
import { teach } from '../../../game/prestige.ts';
import { questLog, holds } from '../../../game/quests.ts';
import type { QuestView } from '../../../game/quests.ts';
import { sought, seekId } from '../../../game/seeking.ts';
import { take, fareOf } from '../../../game/passage.ts';
import { take as takeWork, report, offered, rankOf, rankName } from '../../../game/guilds.ts';
import { countItem } from '../../../game/party.ts';
import { MINUTES_PER_DAY } from '../../../game/calendar.ts';
import { serialize, deserialize } from '../../../game/save.ts';
import { World } from '../../../game/world.ts';
import { buildMaps } from '../../maps.ts';
import { makeRng } from '../../../lib/engine/rng.ts';
import { ACT_II } from '../../../../tools/tests/ladder.ts';
import { MAP_DEFS, GUILD_QUESTS } from '../../index.ts';
import { CURVE } from '../../progression.ts';
import { businessEntries, ChoiceScreen } from '../../../ui/screens.ts';
import { optionParts, columnLabelWidth } from '../../../ui/draw.ts';
import { SIDE_W } from '../../../ui/frame.ts';
import { measureText } from '../../../lib/engine/text.ts';
import { meet, heard, answer } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';

const D5 = MAP_DEFS.find((d) => d.id === 'delta_d5')!;
const C5 = MAP_DEFS.find((d) => d.id === 'delta_c5')!;
const RIFT = MAP_DEFS.find((d) => d.id === 'c5_rift')!;
const C4 = MAP_DEFS.find((d) => d.id === 'delta_c4')!;
const B5 = MAP_DEFS.find((d) => d.id === 'delta_b5')!;
const B5_COUNTER = B5.features!.find((f) => f.kind === 'npc' && f.name.startsWith('a hermit')) as Person;
const B6 = MAP_DEFS.find((d) => d.id === 'delta_b6')!;
const PRIESTESS = B6.features!.find((f) => f.kind === 'npc') as Person;
const L1 = MAP_DEFS.find((d) => d.id === 'drowned_temples')!;
const L2 = MAP_DEFS.find((d) => d.id === 'drowned_temples2')!;
const C6 = MAP_DEFS.find((d) => d.id === 'saltings_c6')!;
const C7 = MAP_DEFS.find((d) => d.id === 'saltings_c7')!;
const TOWN = MAP_DEFS.find((d) => d.id === 'saltmouth')!;
const HERMIT = D5.features!.find((f) => f.kind === 'npc') as Person;
const person = (name: string): Person => C4.features!.find((f) => f.kind === 'npc' && f.name.startsWith(name)) as Person;
const TRAPPER = person('an eel-trapper'), MASTER = person('the master of the barge');
const CREW = C4.encounters!.find((e) => e.id === 'c4_crew')!;
const C3 = MAP_DEFS.find((d) => d.id === 'upperwater_c3')!;
const c3person = (name: string): Person => C3.features!.find((f) => f.kind === 'npc' && f.name.includes(name)) as Person;
const QUAYHAND = c3person('quay'), PRIEST = c3person('priest'), SMUGGLER = C3.features!.find((f): f is Person => f.kind === 'npc' && f.teaches?.cls === 'thief')!;

// ---- the chapter (#180) ----

const WARDEN = TOWN.features!.find((f): f is Person => f.kind === 'npc' && f.flag === 'sm_hale_word')!;
const KITTO = TOWN.features!.find((f): f is Person => f.kind === 'npc' && !!f.passage?.length)!;

/** Into Saltmouth by the land gate, from the Salt Road out of C5. */
function toSaltmouth(w: Walk): void {
  walkThrough(w, 'delta_c5', 26, 30, SOUTH, 'saltings_c6', 3);
  walkThrough(w, 'saltings_c6', 26, 17, SOUTH, 'saltmouth');
}

/**
 * The boat from the quay's end to Wrackholm's landing, which begins Wrackholm's chapter: its goal
 * takes over, and the Tide Stone stays open until the Stone is home (#191).
 */
function theBoat(w: Walk): void {
  w.world.travel('saltmouth', KITTO.x, KITTO.y);
  w.party.gold = Math.max(w.party.gold, KITTO.passage![0].fare);
  const out = take(KITTO.passage![0], w.world, w.party);
  listen(w);
  const tide = quest(w)?.pages.find((p) => p.def === CHAPTER);
  w.ok(out.taken && w.world.zone?.id === 'wrackholm_e6' && w.news.at(-1) === 'New chapter: The Stone Carried Home.' && !!tide && !tide.done,
    `the boat lands the company on Wrackholm, which begins the Stone Carried Home, and the Tide Stone stays open (${w.news.at(-1)})`);
}

/**
 * The plinth's words (#582), held here as they are told so that a change to either fails a walk: the
 * socket cut clean, and to a company that has stood at the Grove Stone the cut it has seen before.
 */
const PLINTH_SHORT = 'Stienwierde. The plinth, and nothing on it: a socket cut clean, a man\'s width.';
const PLINTH_CUT = `${PLINTH_SHORT} You have seen that cut before, a hand-span of it, under the roots.`;

/** Whether the company has stood at the Grove Stone, which the plinth reads it by. */
const atGroveStone = (w: Walk): boolean => holds({ seen: 'grove2:g2_stone' }, w.world.state, w.party);

/** Whether one of the plinth's two events has been read, wherever the company stands now (`used` reads the map it is on). */
const plinthRead = (w: Walk, id: 'b5_plinth' | 'b5_plinth_first'): boolean => holds({ seen: `delta_b5:${id}` }, w.world.state, w.party);

/** Onto the plinth's square, as `see` does, and what is said there: `see` does not give the words back. */
function atPlinth(w: Walk): string[] {
  const plinth = B5.features!.find((f) => f.kind === 'event' && f.id === 'b5_plinth')!;
  w.world.travel('delta_b5', plinth.x, plinth.y);
  const said = w.world.eventsHere();
  listen(w);
  return said;
}

/** The plinth stepped on, its words held to what this company has seen: the cut to one that has stood at the Grove Stone, the socket and no more to one that has not. */
function readPlinth(w: Walk): string[] {
  const grove = atGroveStone(w), said = atPlinth(w);
  w.ok(said.join(' ') === (grove ? PLINTH_CUT : PLINTH_SHORT), `the plinth tells a company that has ${grove ? '' : 'not '}stood at the Grove Stone ${grove ? 'the cut it has seen' : 'the socket and no more'} (${said.join(' ') || 'nothing'})`);
  return said;
}

/** Shared by the runs that come to the plinth by the Grove and by Saltmouth: each reads it as its own company is told it. */
const PLINTH: Step = { name: 'the plinth', play: (w) => { walkThrough(w, 'delta_c5', 0, 13, WEST, 'delta_b5', 2); readPlinth(w); } };
const BOAT: Step = { name: 'the boat', play: theBoat };

/** The chapter in order: into the Delta, Rietum, the plinth, the temples, Saltmouth and the boat. */
export const STEPS: readonly Step[] = [
  { name: 'into the Delta', play: (w) => {
    walkThrough(w, 'downs_d4', 1, 30, SOUTH, 'delta_d5', 3);
    w.ok(!!w.party.flags.q_hale_taken === !!w.party.flags.q_greywater_done, 'set foot in the Delta, Hale is taken from the Scarth if he has had the ledger (#156)');
  } },
  { name: 'to Rietum', play: (w) => {
    walkThrough(w, 'delta_d5', 0, 2, WEST, 'delta_c5');
    walkThrough(w, 'delta_c5', 7, 1, NORTH, 'delta_c4', 3);
    walkThrough(w, 'delta_c4', 3, 1, NORTH, 'upperwater_c3', 3);
    meetWho(w, 'c3_saw_stone');
  } },
  PLINTH,
  { name: 'the temples', play: (w) => {
    walkThrough(w, 'delta_b5', 16, 31, SOUTH, 'delta_b6', 2);
    meetWho(w, 'q_tide_bell');
    walkThrough(w, 'delta_b6', 16, 12, NORTH, 'drowned_temples', 2);
    see(w, 'drowned_temples:dt1_stair');
  } },
  { name: 'to Saltmouth', play: (w) => {
    toSaltmouth(w);
    w.ok(w.world.present(WARDEN) === !!w.party.flags.q_hale_taken, 'the Warden off the coast road sits by the gate once Hale is gone from the Scarth, and not before');
    if (w.party.flags.q_hale_taken) meetWho(w, 'sm_hale_word');
    meetWho(w, 'sm_ship_word');
  } },
  BOAT,
];

/** The entries written on the Tide Stone's page. */
const written = (w: Walk): string[] => (quest(w)?.pages.find((p) => p.def === CHAPTER)?.entries ?? []).map((e) => e.id);

/**
 * In order, from a new game: the Foreland and the Grove played, and the treaty's seal, the Grove's
 * end, begins the Tide Stone; then its steps to the boat. Left on Wrackholm's landing, where
 * Wrackholm's walkthrough plays on.
 */
export function inOrder(ok: (cond: boolean, msg: string) => void): Walk {
  const chain = newWalk(ok);
  hired(chain);
  playChapter(chain, FORELAND, FORELAND_STEPS, 'in order');
  playChapter(chain, GROVE, GROVE_STEPS, 'in order');
  const sealed = chain.news.slice(chain.news.lastIndexOf('Chapter complete: The Grove Stone.'));
  ok(sealed.slice(0, 2).join(' ') === 'Chapter complete: The Grove Stone. New chapter: The Tide Stone.', `in order, the Grove's end begins the Tide Stone (${sealed.join(' ')})`);
  // Hale has had the ledger, so the Delta takes him from the Scarth (#156) and the Warden brings the news.
  ledgerGiven(chain);
  playChapter(chain, CHAPTER, STEPS, 'in order');
  ok(['saw', 'plinth', 'count', 'stair', 'hale', 'ship'].every((e) => written(chain).includes(e)), `in order, the whole chapter is written to the boat (${written(chain).join(', ')})`);
  // The Grove played first, the company has stood at its Stone, so the plinth told it the cut it had seen (#582).
  ok(plinthRead(chain, 'b5_plinth') && !plinthRead(chain, 'b5_plinth_first'), 'in order, the plinth told the company the cut it had seen under the roots, and the short line was never said to it');
  return chain;
}

/**
 * Saltmouth first, at 12, the farm done and the Grove not begun: Kitto's word begins the chapter,
 * no Warden sits by the gate while Hale holds the Scarth, and the plinth comes before the boat. Left
 * on Wrackholm's landing, the temples not seen.
 */
export function saltmouthFirst(ok: (cond: boolean, msg: string) => void): Walk {
  const first = newWalk(ok);
  hired(first);
  playChapter(first, FORELAND, FORELAND_STEPS, 'Saltmouth first');
  first.level = 12;
  toSaltmouth(first);
  ok(!first.world.present(WARDEN), 'Saltmouth first, while Hale holds the Scarth, no Warden sits by the gate');
  meetWho(first, 'sm_ship_word');
  ok(first.news.at(-1) === 'New chapter: The Tide Stone.', `Saltmouth first, Kitto's word begins the Tide Stone (${first.news.at(-1)})`);
  goalFromBegun(first, 'Saltmouth first');
  const at12 = (s: Step): Step => ({ name: s.name, play: (w) => { w.level = 12; s.play(w); } });
  playChapter(first, CHAPTER, [at12(PLINTH), at12(BOAT)], 'Saltmouth first');
  goalFromBegun(first, 'Saltmouth first, on the isle');
  ok(JSON.stringify(written(first)) === JSON.stringify(['plinth', 'ship']), `Saltmouth first, the Tide Stone holds only what was seen and said (${written(first).join(', ')})`);
  // The Grove not begun, the company has not stood at its Stone, so the plinth told it the socket and no more (#582), and the step is written all the same.
  ok(plinthRead(first, 'b5_plinth_first') && !plinthRead(first, 'b5_plinth') && !atGroveStone(first), 'Saltmouth first, the plinth told the company the socket cut clean and no more');
  return first;
}

function theTideStone(ok: (cond: boolean, msg: string) => void): void {
  inOrder(ok);
  saltmouthFirst(ok);
  everyGoalWalked(ok, [CHAPTER]);
  thePlinth(ok);
}

/**
 * The plinth read both ways (#582), each on a company of its own, the words held to the letter. One
 * that has not stood at the Grove Stone is told the socket cut clean and no more, and told the cut
 * it has seen under the roots on the next step onto the plinth once it has; one that stood there
 * first is told the cut at once, and never the short line. Each reading is said the once.
 */
function thePlinth(ok: (cond: boolean, msg: string) => void): void {
  const late = newWalk(ok);
  walkThrough(late, 'delta_c5', 0, 13, WEST, 'delta_b5', 2);
  const before = atGroveStone(late), short = readPlinth(late).join(' ');
  ok(!before && short === PLINTH_SHORT, 'the plinth, to a company that has not stood at the Grove Stone, is the socket cut clean and no more');
  ok(plinthRead(late, 'b5_plinth_first') && !plinthRead(late, 'b5_plinth') && atPlinth(late).length === 0, 'and the short line is said the once');
  see(late, 'grove2:g2_stone');
  const after = atGroveStone(late), cut = readPlinth(late).join(' ');
  ok(after && cut === PLINTH_CUT, 'once the company has stood at the Grove Stone, the plinth, stepped on again, tells it the cut it has seen under the roots');
  ok(plinthRead(late, 'b5_plinth') && atPlinth(late).length === 0, 'and the cut is said the once');

  const early = newWalk(ok);
  see(early, 'grove2:g2_stone');
  walkThrough(early, 'delta_c5', 0, 13, WEST, 'delta_b5', 2);
  const already = atGroveStone(early), told = readPlinth(early).join(' ');
  ok(already && told === PLINTH_CUT, 'the plinth, to a company that has stood at the Grove Stone, is the cut it has seen under the roots');
  ok(plinthRead(early, 'b5_plinth') && !plinthRead(early, 'b5_plinth_first') && atPlinth(early).length === 0, 'and the short line is never said to it');
}

/**
 * The Night-Light (#56's 21), at Rietum: Nynke's first words the hint and no more; the priest at the
 * sluice asks, and still reads a pole's mark; then each way played from the asking: the light taken
 * and given to the priest, taken and sold to Tobin, and kept, until the Stone home puts it out; and
 * asked and never answered, with the Stone home. The glass people come to her window by night while
 * the light is there, and the log reads true after each.
 */
function theNightLight(w: Walk): void {
  const ok = w.ok;
  const NYNKE = c3person('Nynke'), TOBIN = c3person('Tobin');
  const BRINE = C3.encounters!.find((g) => g.id === 'c3_brine')!;
  const GLOW = C3.features!.find((f) => f.kind === 'event' && f.id === 'c3_glow')!;
  const BERTH = C3.features!.find((f) => f.kind === 'event' && f.id === 'c3_berth')!;
  const FLAGS = ['q_nightlight', 'q_nightlight_taken', 'q_nightlight_kept', 'q_nightlight_temple', 'q_nightlight_sold', 'q_tide_home'];
  const reset = (): void => { for (const f of FLAGS) delete w.party.flags[f]; w.party.bag = w.party.bag.filter((i) => i !== 'night_light'); };
  const hear = (p: Person): ReturnType<typeof meet> => { w.world.travel('upperwater_c3', p.x, p.y); return meet(p, w.party, heard(w.world, p)); };
  const page = (): QuestView | undefined => questLog(w.world.state, w.party).find((v) => v.def.id === 'nightlight');
  const entries = (): string => page()?.pages[0]?.entries.map((e) => e.id).join(', ') ?? '';
  // By night, at the window: the glass people and the light on the water.
  const byNight = (): { brine: boolean; glow: boolean } => {
    const then = w.world.state.minutes;
    w.world.state.minutes = Math.floor(then / MINUTES_PER_DAY) * MINUTES_PER_DAY + 23 * 60;
    w.world.travel('upperwater_c3', NYNKE.x, NYNKE.y);
    const seen = { brine: w.world.walks(BRINE, BRINE.x, BRINE.y) && !w.world.ended(BRINE), glow: w.world.present(GLOW) };
    w.world.state.minutes = then;
    return seen;
  };
  const gold0 = w.party.gold, bag0 = [...w.party.bag];

  reset();
  const first = hear(NYNKE);
  ok(first.text.includes('goes green underneath') && !first.choice && !page(), 'before the priest asks, Nynke at her window gives the hint and no more, and the log has nothing');
  ok(byNight().brine && byNight().glow, 'by night the glass people come to her window, and her light throws green along the diep');
  const asked = hear(PRIEST);
  ok(!!w.party.flags.q_nightlight && asked.text.includes('pole') && asked.text.includes('Nynke') && page()?.goal === 'See Nynke at her window in Rietum about her night-light.', `the priest asks for the child's light, and still reads a pole's mark (${page()?.goal})`);
  ok(hear(TOBIN).text.includes('buyer downriver'), 'Tobin, across the diep, would buy it for a buyer downriver');

  for (const way of ['the priest', 'Tobin', 'kept'] as const) {
    reset();
    w.party.gold = gold0;
    hear(PRIEST);
    const m = hear(NYNKE), a = m.choice?.answers.find((x) => x.label === (way === 'kept' ? 'Keep it, Nynke.' : 'We\'ll take it.'));
    ok(!!a, `asked, Nynke puts the choice, and '${a?.label}' is an answer (${m.choice?.ask ?? 'no question'})`);
    if (!a) continue;
    answer(a, w.party);
    if (way === 'kept') {
      ok(!!w.party.flags.q_nightlight_kept && !w.party.bag.includes('night_light') && !!page()?.done, `kept: the light stays at her window, and The Night-Light is done (${entries()})`);
      ok(byNight().brine && byNight().glow, 'kept: the glass people still come to her window by night');
      ok(hear(NYNKE).text.includes('sweet shop') && hear(PRIEST).text.includes('kindness to a child') && hear(TOBIN).text.includes('I can wait') && w.world.present(TOBIN), 'kept: Nynke, the priest and Tobin each say so, and Tobin waits');
      w.party.flags.q_tide_home = 1;
      const night = byNight();
      ok(!night.brine && !night.glow && hear(NYNKE).text.includes('went out') && entries().includes('home'), `the Stone home, the light goes out: the glass people stop coming and the log says so (${entries()})`);
      continue;
    }
    ok(w.party.bag.includes('night_light') && !byNight().brine && !byNight().glow && page()?.goal?.startsWith('Take the night-light') === true, `taken: the company has the light, the glass people stop coming and the goal is the priest or Tobin (${page()?.goal})`);
    ok(hear(NYNKE).text.includes('stopped coming'), 'taken: Nynke\'s window is dark, and she says so');
    if (way === 'the priest') {
      hear(PRIEST);
      ok(!!w.party.flags.q_nightlight_temple && !w.party.bag.includes('night_light') && w.party.gold === gold0 + 100 && !!page()?.done, `the priest takes it at the first meeting and pays 100, and The Night-Light is done (${entries()})`);
      ok(hear(PRIEST).text.includes('In the bowl') && w.world.present(TOBIN) && hear(TOBIN).text.includes('a man who counts') && !w.world.present(BERTH), 'after, the light lies in the bowl, and Tobin stays at his barge, sour');
    } else {
      hear(TOBIN);
      ok(!!w.party.flags.q_nightlight_sold && !w.party.bag.includes('night_light') && w.party.gold === gold0 + 250 && !!page()?.done, `Tobin takes it at the first meeting and pays 250, and The Night-Light is done (${entries()})`);
      ok(!w.world.present(TOBIN) && w.world.present(BERTH) && hear(PRIEST).text.includes('sold it'), 'after, Tobin is gone down the river, a heron has his berth, and the priest knows it was sold');
    }
    w.party.flags.q_tide_home = 1;
    ok(entries().includes('home') && !byNight().brine, `the Stone home, the log reads true after it too (${entries()})`);
  }

  // Asked and never answered: the Stone home puts the light out, and the quest is over with it.
  reset();
  hear(PRIEST);
  w.party.flags.q_tide_home = 1;
  const dark = hear(NYNKE);
  ok(!dark.choice && dark.text.includes('went out') && !!page()?.done && entries() === 'asked, home', `asked and never answered, the Stone home puts the light out and ends it (${entries()})`);

  reset();
  w.party.gold = gold0;
  w.party.bag = bag0;
}

/**
 * The Star That Moved (#56's 24), at Saltmouth and on the pans: the watch from the pilots' stone, by
 * night and never by day; the slate at its foot found before Hiske asks, and her words for a company
 * that came early; then asked, and the slate to Tallis, whose throne words come first, and to her
 * press. Each one's words after, and the log read true each way.
 */
function theStar(w: Walk): void {
  const ok = w.ok;
  const HISKE = TOWN.features!.find((f): f is Person => f.kind === 'npc' && f.name.startsWith('Hiske'))!;
  const TALLIS = TOWN.features!.find((f): f is Person => f.kind === 'npc' && f.name.startsWith('Jory Tallis'))!;
  const SLATE = C7.features!.find((f) => f.kind === 'chest' && f.id === 'c7_slate')!;
  const FLAGS = ['q_star', 'q_star_press', 'q_star_tallis', 'sm_tallis_word'];
  const reset = (): void => { for (const f of FLAGS) delete w.party.flags[f]; w.party.bag = w.party.bag.filter((i) => i !== 'pilots_slate'); };
  const hear = (p: Person): string => { w.world.travel('saltmouth', p.x, p.y); return meet(p, w.party, heard(w.world, p)).text; };
  const page = (): QuestView | undefined => questLog(w.world.state, w.party).find((v) => v.def.id === 'star');
  const entries = (): string => page()?.pages[0]?.entries.map((e) => e.id).join(', ') ?? '';
  const gold0 = w.party.gold;
  reset();

  // The pilots' stone: by day the stone and the slate, and the watch kept for the night.
  const day = Math.floor(w.world.state.minutes / MINUTES_PER_DAY) * MINUTES_PER_DAY;
  w.world.state.minutes = day + 12 * 60;
  w.world.travel('saltings_c7', 25, 7, SOUTH);
  const noon = w.world.eventsHere();
  ok(noon.some((m) => m.includes('notch')) && !w.world.used('c7_star'), 'by day the pilots\' stone stands where the lanes cross, its notch to the Scarp, and the watch waits for the night');
  w.world.travel('saltings_c7', SLATE.x, SLATE.y);
  w.world.markUsed('c7_slate');
  if (SLATE.kind === 'chest') w.party.bag.push(...SLATE.items);
  ok(w.party.bag.includes('pilots_slate') && page()?.goal === 'Take the pilots\' slate to Hiske in the street or to Tallis at his door on the quay, in Saltmouth.', `at its foot the pilots' slate, found before anyone asked, and the log has it (${page()?.goal})`);
  w.world.state.minutes = day + 23 * 60;
  w.world.travel('saltings_c7', 25, 7, SOUTH);
  ok(w.world.eventsHere().some((m) => m.includes('one star burns too steady')) && w.world.used('c7_star') && entries().includes('watch'), `by night the star walks in the notch, and the log has the watch (${entries()})`);
  w.world.state.minutes = day + 12 * 60;
  // Early: Hiske never asked, and takes it all the same.
  const early = hear(HISKE);
  ok(early.includes('unasked') && !!w.party.flags.q_star_press && w.party.gold === gold0 + 200 && !!page()?.done, `Hiske takes the slate from a company she never asked, pays 200, and The Star That Moved is done (${entries()})`);

  // Asked, both ways: to Tallis, then to her press.
  for (const to of ['Tallis', 'Hiske'] as const) {
    reset();
    w.party.gold = gold0;
    const asks = hear(HISKE);
    ok(!!w.party.flags.q_star && asks.includes('pilots\' stone') && asks.includes('rote') && page()?.goal?.startsWith('Watch the sky') === true, `Hiske asks for a watch from the pilots' stone, and still offers her prestige (${page()?.goal})`);
    ok(hear(HISKE).startsWith('"The pilots\' stone'), 'asked again, she says where the stone is');
    const first = hear(TALLIS), second = hear(TALLIS);
    ok(first.includes('older than the port') && !!w.party.flags.sm_tallis_word && second.includes('nervous animal'), 'Tallis\'s throne words come first, and then his words on the star');
    w.party.bag.push('pilots_slate');
    if (to === 'Tallis') {
      hear(TALLIS);
      ok(!!w.party.flags.q_star_tallis && !w.party.bag.includes('pilots_slate') && w.party.gold === gold0 + 400 && !!page()?.done && entries().includes('tallis'), `Tallis takes the slate at the first meeting, pays 400, and the log says so (${entries()})`);
      ok(hear(TALLIS).includes('the word star') && hear(HISKE).includes('dockmaster'), 'after, Tallis has his calm port, and Hiske knows where it went');
    } else {
      const done = hear(HISKE);
      ok(done.includes('Twelve pilots') && !!w.party.flags.q_star_press && w.party.gold === gold0 + 200 && !!page()?.done && entries().includes('press'), `Hiske takes the slate at the first meeting, pays 200, and the log says so (${entries()})`);
      ok(hear(HISKE).includes('pinned up') && hear(TALLIS).includes('She printed it'), 'after, the chart hangs where the pilots pass, and Tallis counts its cost');
    }
  }
  reset();
  w.party.gold = gold0;
}

type Shop = Extract<Feature, { kind: 'shop' }>;
/** Pender, who teaches the Thief's first prestige, as the shop at his door has him stand after it. */
const PENDER = TOWN.features!.find((f): f is Person => f.kind === 'npc' && f.teaches?.cls === 'thief')!;
/** The two wares #860 sells in Saltmouth, in the order of the shops that sell them. */
const SET_OF_PICKS = 'set_of_picks', GUILD_CHART = 'guild_chart';

/**
 * Pender's picks and the Map Room's chart (#860), bought at their doors as the game sells them, from each
 * first menu's trade, with the gold given directly: the road has paid this company nothing by here, as the
 * armourer's step is bought above on gold set by hand. Each is slotless, inside Saltreach's window and of
 * the skill it does, fits the shop's rows, does that skill's work while carried and is bought back at half.
 * Saltreach holds no locked chest, so the picks open the shape of #857's fixture, a chest locked in a room
 * of its own under a company whose thief is down (the one born to Lockpick), and the chart maps a square
 * further in #857's dungeon. Pender's teaching of the Thief's first is still had, through his person.
 */
function picksAndChart(ok: (cond: boolean, msg: string) => void): void {
  const g = headlessGame(4), p = g.party, thief = p.members.find((m) => m.cls === 'thief')!;
  const pender = TOWN.features!.find((f): f is Shop => f.kind === 'shop' && f.interior === 'saltmouth_locksmith')!;
  const room = TOWN.features!.find((f): f is Shop => f.kind === 'shop' && f.hall === 'cartographers')!;
  const shopOf = (id: string): Shop => (id === SET_OF_PICKS ? pender : room);

  // What stands at the two doors.
  const stands = (s: Shop): string => TOWN.features!.filter((f) => f.x === s.x && f.y === s.y).map((f) => f.kind).join();
  ok(pender.stock.join() === SET_OF_PICKS && stands(pender) === 'shop,npc' && PENDER.x === pender.x && PENDER.y === pender.y && !PENDER.interior && PENDER.teaches?.prestige === 1,
    `Pender's door is a shop selling a set of picks and nothing else, and he stands after it on its square with no room of his own, teaching the Thief's first (${pender.name})`);
  ok(room.stock.join() === `rations,antidote,lantern_oil,potion_heal,${GUILD_CHART}` && room.hall === 'cartographers',
    `the Map Room sells its stores as it did and a chart beside them (${room.stock.join(', ')})`);
  ok(!/don't sell|sell no|sells no/i.test(PENDER.lines.join(' ')), 'and Pender no longer says he sells no picks');

  // Slotless, of the skill each does, inside the window: Saltreach's 2,000 gold.
  const [picks, chart] = [item(SET_OF_PICKS), item(GUILD_CHART)];
  ok([picks, chart].every((d) => d.slot === 'none' && !d.use && d.price > 0 && d.price <= CURVE.saltreach.price) && picks.skill === 'lockpick' && picks.price === 750 && chart.skill === 'cartographer' && chart.price === 400,
    `a set of picks (Lockpick, ${picks.price} gold) and a chart (Cartographer, ${chart.price}), each slotless and inside Saltreach's window of ${CURVE.saltreach.price.toLocaleString('en-GB')} gold`);

  // The Buy list and the Sell list of a shop, as its first menu's trade opens them.
  const list = (game: typeof g, s: Shop, sell: boolean): readonly string[] => {
    while (game.screens.length > 1) game.pop();
    game.world.travel('saltmouth', s.x, s.y, NORTH);
    game.push(businessEntries(game, s)[0].open());
    drive(game, sell ? ['down', 'interact'] : ['interact']);
    return (game.top as ChoiceScreen).options;
  };
  /** The presses that choose row `at` of a list (none where it is not there, so a missing ware is not a wrong one bought). */
  const choose = (at: number): ('down' | 'interact')[] => (at < 0 ? [] : [...Array<'down'>(at).fill('down'), 'interact']);

  // Bought: the price shown and charged, the item in the bag, the gold gone.
  const bought = [SET_OF_PICKS, GUILD_CHART].map((id) => {
    const s = shopOf(id);
    p.gold = priceIn(s, id);
    const rows = list(g, s, false), row = rows[s.stock.indexOf(id)] ?? '';
    drive(g, choose(s.stock.indexOf(id)));
    return { id, rows, row, left: p.gold, held: p.bag.includes(id) };
  });
  ok(bought.every((b) => b.held && b.left === 0 && optionParts(b.row).label === item(b.id).name && optionParts(b.row).value === `${item(b.id).price}g`),
    `each is bought from its shop's Buy list at its price, the gold given directly (${bought.map((b) => b.row.replace(/\t+/g, ' ').trim()).join('; ')})`);

  // The names fit the shops' rows: each Buy list's, and the Sell list's worst case, a member whose name is the longest of the widest letters.
  const widest = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].sort((a, b) => measureText(b) - measureText(a))[0];
  const worst = headlessGame(4);
  worst.party.members[0].name = widest.repeat(NAME_MAX);
  worst.party.members[0].pack.push(SET_OF_PICKS, GUILD_CHART);
  const rows = [...new Set([pender, room].flatMap((s) => [...list(g, s, false), ...list(worst, s, true)]))];
  const cut = rows.filter((r) => { const { label, value } = optionParts(r); return measureText(label) > columnLabelWidth(SIDE_W, value, true); });
  ok(rows.some((r) => r.startsWith(`${picks.name} (${widest.repeat(NAME_MAX)})`)) && rows.some((r) => r.startsWith(`${chart.name} (${widest.repeat(NAME_MAX)})`)) && !cut.length,
    `the names fit the shops' rows: each Buy list's, and the Sell list's with a name of ${NAME_MAX} ${widest}s beside each ware${cut.length ? ' -> cut: ' + cut.map((r) => r.replace(/\t+/g, ' ')).join('; ') : ''}`);

  // Carried: the picks open a locked chest that the same company without them cannot, the chart maps a square further.
  const company = (without = '', down = false): Party => {
    const q = structuredClone(p);
    for (const m of q.members) m.pack = m.pack.filter((i) => i !== without);
    q.bag = q.bag.filter((i) => i !== without);
    if (down) q.members.find((m) => m.cls === 'thief')!.conditions.push('dead');
    return q;
  };
  const coffer = { kind: 'chest', x: 2, y: 1, id: 'fx_locked', gold: 40, items: ['torch'], locked: true } as const satisfies Feature;
  const opens = (q: Party): string => {
    const h = headlessGame(4, q);
    h.maps.fx_coffer = new GameMap({ id: 'fx_coffer', name: 'Coffer', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['####', '#..#', '####'], features: [{ ...coffer, items: [...coffer.items] }] });
    h.world.travel('fx_coffer', 2, 1, EAST);
    const here = h.world.featureHere()!, from = h.log.length, gold = h.party.gold;
    h.enterCell();
    h.interact(here);
    return `${h.log.slice(from).join(' ')} | ${h.party.gold - gold} | ${h.world.used(coffer.id) ? 'spent' : 'shut'}`;
  };
  const picker = company('', true).members.find((m) => !isDown(m))!.name;
  const [withPicks, withoutPicks, thiefStanding] = [opens(company('', true)), opens(company(SET_OF_PICKS, true)), opens(company(SET_OF_PICKS))];
  ok(withPicks === `A locked chest. ${picker} picks the lock. You open the chest: 40 gold, ${item('torch').name}. | 40 | spent` && withoutPicks === 'A locked chest. Locked. | 0 | shut' && thiefStanding.includes(`${thief.name} picks the lock.`),
    `the picks bought open a locked chest that the same company without them, its thief down, cannot ("${withPicks}" against "${withoutPicks}"); its thief standing opens it born to it`);

  const hall: MapDef = { id: 'fx_chart_hall', name: 'Chart hall', kind: 'dungeon', start: { x: 5, y: 5, facing: NORTH }, rows: Array<string>(11).fill('...........') };
  /** How many squares west of the company the automap takes, standing in the middle of an open hall. */
  const reach = (q: Party): number => {
    const rng = makeRng(41), world = new World({ [hall.id]: new GameMap(hall) }, q, rng);
    world.mapState.explored.fill(0);
    world.travel(hall.id, 5, 5, NORTH);
    let d = 0;
    while (d < 4 && world.explored(4 - d, 5)) d++;
    return d;
  };
  const [with1, without1] = [reach(company()), reach(company(GUILD_CHART))];
  ok(with1 === 2 && without1 === 1, `the chart bought maps a square further than the same company without it: ${with1} squares west in a dungeon, against ${without1}`);

  // Bought back at half, by the shop that sold it, through its Sell list.
  const back = [SET_OF_PICKS, GUILD_CHART].map((id) => {
    const s = shopOf(id), sell = list(g, s, true), at = sell.findIndex((r) => optionParts(r).label.startsWith(`${item(id).name} (`)), gold = p.gold;
    drive(g, choose(at));
    return { id, row: sell[at] ?? '', paid: p.gold - gold, gone: !p.bag.includes(id) };
  });
  ok(back.every((b) => b.gone && b.paid === Math.floor(item(b.id).price / 2)) && back[0].paid === 375 && back[1].paid === 200,
    `a shop buys either back at half: ${back.map((b) => `${item(b.id).name} for ${b.paid}`).join(' and ')} (${back.map((b) => b.row.replace(/\t+/g, ' ')).join('; ')})`);

  // Pender's teaching is still his: from the shop's first menu, "Talk to" him, and his words close onto the Thief's offer.
  while (g.screens.length > 1) g.pop();
  g.world.travel('saltmouth', pender.x, pender.y, NORTH);
  const menu = businessEntries(g, pender).map((e) => e.label);
  thief.level = 11; p.gold = 1000;
  g.push(businessEntries(g, pender)[1].open());
  drive(g, ['interact']);
  const asked = g.top instanceof ChoiceScreen ? g.top.options[0] ?? '' : '';
  drive(g, ['interact']);
  ok(menu.join() === 'Buy and sell,Talk to Pender the locksmith' && asked.startsWith(`${thief.name}: `) && prestigeOf(thief) === 1 && p.gold === 0,
    `Pender's first menu offers the trade and "Talk to" him, whose words close onto the Thief's first for 1,000 gold (${menu.join(' / ')}; "${asked.replace(/\t+/g, ' ')}")`);
}

export const walkthrough: Walkthrough = (ok) => {
  theTideStone(ok);

  const w = newWalk(ok);

  // Down off the Edge: the Salt Road leaves D4's foot and the shore under it is the Delta's, which
  // tells a company far under its band so, and is never a wall.
  w.world.travel('downs_d4', 1, 30, SOUTH);
  const said: string[] = [];
  for (let i = 0; i < 3 && w.world.zone?.id !== 'delta_d5'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') said.push(...r.messages); }
  ok(w.world.zone?.id === 'delta_d5', 'the Salt Road out of D4 leads onto the shore under the Edge, D5');
  ok(said.some((m) => m.includes('The Delta.') && m.includes('Nothing here would spare you')), `crossing into the Delta at level 1, the land is named and it warns (${said.join(' | ')})`);
  listen(w);
  const milestone = D5.features!.find((f) => f.kind === 'sign');
  ok(milestone?.kind === 'sign' && milestone.text.includes('SALTMOUTH 4') && milestone.text.includes('RIETUM 9') && D5.rows[milestone.y][milestone.x - 1] === '=', 'the milestone stands by the road: Saltmouth 4, Rietum 9');

  w.level = 10;
  // The hermit on the islet saw the barge go by, and sends the company up the spur.
  w.world.travel('delta_d5', HERMIT.x, HERMIT.y);
  const words = meet(HERMIT, w.party, heard(w.world, HERMIT)).text;
  ok(words.includes('Rietum') && words.includes('sacking'), 'the hermit saw the barge go by with a light in its sacking, and sends the company to Rietum');

  // On down the road into C5.
  walkThrough(w, 'delta_d5', 0, 2, WEST, 'delta_c5');

  // The secret: the mast's stump at the arch, then the search, the hollow and the barge's hold.
  w.world.travel('delta_c5', 26, 22, EAST);
  w.world.eventsHere();
  let found = false;
  for (let i = 0; i < 20 && !found; i++) found = w.world.search();
  const into = found ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(found && into.every((r) => r.kind === 'moved'), 'searched from the arch, the hollow under it opens, and can be walked into');
  ok(w.world.used('c5_barge'), 'in the hollow, the drowned barge is found');
  const hold = C5.features!.find((f) => f.kind === 'chest' && f.id === 'c5_barge_hold');
  ok(hold?.kind === 'chest' && hold.items.includes('brine_shard') && hold.x === 28 && hold.y === 22, 'in its straw, a Brine Shard');
  listen(w);

  // The box's groups, each won at its floor: the pools' leeches and eels, the bull toad at the far end.
  for (const g of C5.encounters!) fight(w, `delta_c5:${g.id}`);

  // The Rift on its islet: walked into from its neck, and its groups and its warden won at 10.
  walkThrough(w, 'delta_c5', 20, 13, NORTH, 'c5_rift', 2);
  for (const g of RIFT.encounters!) fight(w, `c5_rift:${g.id}`);

  // Up the spur from the fork into C4, the Long Water's east bank.
  walkThrough(w, 'delta_c5', 7, 1, NORTH, 'delta_c4', 3);

  // The eel-trapper at the ford heard the Stone's barge go by, and knows the poleman was no river man.
  w.world.travel('delta_c4', TRAPPER.x, TRAPPER.y);
  const told = meet(TRAPPER, w.party, heard(w.world, TRAPPER)).text;
  ok(told.includes('stroke') && told.includes('Hand'), 'the eel-trapper knows the poleman by his stroke: the Hand\'s, not the river\'s');

  // The secret: the one gap in the herons, the hut there, and the crews' hide behind its wall.
  w.world.travel('delta_c4', 4, 14, EAST);
  w.world.eventsHere();
  let hid = false;
  for (let i = 0; i < 20 && !hid; i++) hid = w.world.search();
  const intoHut = hid ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(hid && intoHut.every((r) => r.kind === 'moved'), 'searched from the gap in the herons, the hut\'s wall opens, and can be walked into');
  ok(w.world.used('c4_hide'), 'inside, the bargemen\'s hide is found');
  const hide = C4.features!.find((f) => f.kind === 'chest' && f.id === 'c4_hide_chest');
  ok(hide?.kind === 'chest' && hide.items.includes('brine_shard') && hide.items.includes('longsword+1') && hide.x === 6 && hide.y === 14, 'in the hide, a Brine Shard and a Long Sword +1');
  listen(w);

  // Passage Paid: the master on the shoal puts it. Cut loose, the people go ashore and a crew comes
  // up the bank after them; pushed off, the master's word pays the boat's fare from Saltmouth.
  // The shoal is reached on foot, from the track, by a company with no swimmer in it at either tide.
  const c4 = new GameMap(C4);
  const onFoot = (tide: 'high' | 'low'): boolean => {
    const seen = new Set([`${C4.start.x},${C4.start.y}`]), q = [[C4.start.x, C4.start.y]];
    while (q.length) {
      const [x, y] = q.shift()!;
      if (x === MASTER.x && y === MASTER.y) return true;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        const p = c4.passable(nx, ny, { tide });
        if (!seen.has(`${nx},${ny}`) && (p === 'ok' || p === 'unlock')) { seen.add(`${nx},${ny}`); q.push([nx, ny]); }
      }
    }
    return false;
  };
  ok(onFoot('high') && onFoot('low'), 'the master on the shoal can be walked to from the way in with no swimmer, at either tide');
  const SHOAL = Object.fromEntries((['q_passage_owed', 'q_passage_freed'] as const).map((f) => [f, C4.features!.find((x) => x.kind === 'event' && x.id === `c4_shoal_${f.slice('q_passage_'.length)}`)!]));
  const GEESKE = TOWN.features!.find((f): f is Person => f.kind === 'npc' && f.name.startsWith('Geeske'))!;
  const HESSEL = TOWN.features!.find((f): f is Person => f.kind === 'npc' && f.name.startsWith('Hessel'))!;
  const BOY = C3.features!.find((f): f is Person => f.kind === 'npc' && f.name === 'a boy of Rietum')!;
  ok(!w.world.present(GEESKE) && !w.world.present(HESSEL) && !w.world.present(BOY), 'before Passage Paid is answered, nobody from the barge is in port or at Rietum');
  const page = (): string => questLog(w.world.state, w.party).find((v) => v.def.id === 'passage')?.pages[0]?.entries.map((e) => e.text).join(' ') ?? '';
  for (const [label, flag] of [['Push her off.', 'q_passage_owed'], ['Cut them loose.', 'q_passage_freed']] as const) {
    for (const f of ['q_passage', 'q_passage_owed', 'q_passage_freed']) delete w.party.flags[f];
    ok(!w.world.walks(CREW, CREW.x, CREW.y), `before '${label}', no crew on the bank`);
    w.world.travel('delta_c4', MASTER.x, MASTER.y);
    const m = meet(MASTER, w.party, heard(w.world, MASTER)), a = m.choice?.answers.find((x) => x.label === label);
    ok(!!a && page().includes('Hessel'), `the master on the shoal asks, '${label}' is an answer, and the log has his barge (${m.choice?.ask ?? 'no question'})`);
    if (a) answer(a, w.party);
    ok(!!w.party.flags[flag] && !w.world.present(MASTER), `'${label}' sets ${flag}, and the barge is gone off the shoal`);
    ok(w.world.walks(CREW, CREW.x, CREW.y) === (flag === 'q_passage_freed'), `'${label}': a crew comes up the bank ${flag === 'q_passage_freed' ? 'after it' : 'only if they are freed'}`);
    // After, a way each: the shoal, Geeske on Saltmouth's quay, the boy home at Rietum and Hessel in port.
    const freed = flag === 'q_passage_freed';
    ok(w.world.present(SHOAL[flag]) && !w.world.present(SHOAL[freed ? 'q_passage_owed' : 'q_passage_freed']), `'${label}': the shoal says what became of the barge`);
    const geeske = meet(GEESKE, w.party, heard(w.world, GEESKE)).text;
    ok(w.world.present(GEESKE) && geeske.includes(freed ? 'bank road' : 'tarpaulin'), `'${label}': Geeske, who paid, is on Saltmouth's quay and says how she came there`);
    ok(w.world.present(BOY) === freed && w.world.present(HESSEL) === !freed, `'${label}': the boy is home at Rietum ${freed ? 'mending nets' : 'never'}, and Hessel is on Saltmouth's quay ${freed ? 'never' : 'with his ledger'}`);
  }
  ok(page().includes('waded ashore'), 'the log says the passengers went ashore');
  // Hessel's word waives the boat's fare out of Saltmouth; the passengers cut loose, it does not.
  const kitto = TOWN.features!.find((f): f is Person => f.kind === 'npc' && !!f.passage?.length)!.passage![0];
  w.party.flags.q_passage_owed = 1;
  const owedFare = fareOf(kitto, w.world);
  const kittoP = TOWN.features!.find((f): f is Person => f.kind === 'npc' && !!f.passage?.length)!;
  const kittoSays = meet(kittoP, w.party, heard(w.world, kittoP)).text;
  delete w.party.flags.q_passage_owed;
  ok(owedFare === 0 && kittoSays.includes('Hessel') && fareOf(kitto, w.world) === kitto.fare, `pushed off, Hessel's word pays the boat's fare to Wrackholm; cut loose, it is ${kitto.fare}`);

  // The box's groups, each won at its floor: the barge at the bank, the bull toad in the drain, the crew.
  for (const g of C4.encounters!) fight(w, `delta_c4:${g.id}`);

  // Up the track out of C4 onto Rietum's fields: the Upper Water, named at the seam.
  w.world.travel('delta_c4', 3, 1, NORTH);
  const upper: string[] = [];
  for (let i = 0; i < 3 && w.world.zone?.id !== 'upperwater_c3'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') upper.push(...r.messages); }
  ok(w.world.zone?.id === 'upperwater_c3' && upper.some((m) => m.includes('The Upper Water')), `the track out of C4 leads into the Upper Water, C3, and the land is named (${upper.join(' | ')})`);
  listen(w);

  // The step: the quay-hand saw the Stone go by, and turns the company west to the plinth.
  w.world.travel('upperwater_c3', QUAYHAND.x, QUAYHAND.y);
  const saw = meet(QUAYHAND, w.party, heard(w.world, QUAYHAND)).text;
  ok(saw.includes('sacking') && saw.includes('west') && !!w.party.flags.c3_saw_stone, `on the quay, the Stone went by glowing in its sacking, and the company is sent west; c3_saw_stone is set (${QUAYHAND.name})`);
  listen(w);
  // The priest reads poles' marks, B5's hint, without naming the plinth's landing.
  const marks = meet(PRIEST, w.party, heard(w.world, PRIEST)).text;
  ok(marks.includes('pole') && !marks.includes('Stienwierde'), `the priest at the sluice knows what a pole's mark says (${PRIEST.name})`);

  // The secret: the clean stone in the quay's face, and the smuggler's old cache behind it, which
  // nothing else reaches: not on foot, not a swimmer, at either tide.
  const c3 = new GameMap(C3);
  const reach = (to: { x: number; y: number }, can: { swim?: boolean; tide: 'high' | 'low' }, secrets: boolean): boolean => {
    const seen = new Set([`${C3.start.x},${C3.start.y}`]), q = [[C3.start.x, C3.start.y]];
    while (q.length) {
      const [x, y] = q.shift()!;
      if (x === to.x && y === to.y) return true;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        if (!c3.inBounds(nx, ny) || seen.has(`${nx},${ny}`) || (!secrets && c3.at(nx, ny).door === 'secret')) continue;
        const p = c3.passable(nx, ny, can);
        if (p === 'ok' || p === 'unlock') { seen.add(`${nx},${ny}`); q.push([nx, ny]); }
      }
    }
    return false;
  };
  const quayCache = C3.features!.find((f) => f.kind === 'chest' && f.id === 'c3_cache_chest')!;
  ok((['high', 'low'] as const).every((tide) => !reach(quayCache, { swim: true, tide }, false) && reach(quayCache, { tide }, true)),
    'the cache under the quay is reached through its secret door and no other way, by a swimmer or at either tide');
  const people = C3.features!.filter((f): f is Person => f.kind === 'npc');
  ok(people.length >= 5 && people.every((f) => (['high', 'low'] as const).every((tide) => reach(f, { tide }, false))), `Rietum's ${people.length} people are each walked to on foot from the way in, with no swimmer, at either tide`);
  w.world.travel('upperwater_c3', 8, 13, EAST);
  w.world.eventsHere();
  let faceOpen = false;
  for (let i = 0; i < 20 && !faceOpen; i++) faceOpen = w.world.search();
  const intoCache = faceOpen ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(faceOpen && intoCache.every((r) => r.kind === 'moved') && w.world.used('c3_cache'), 'searched from the clean stone, the quay\'s face opens on the old smuggler\'s cache');
  ok(quayCache.kind === 'chest' && ['chain+1', 'smugglers_sword', 'stiletto+1', 'tidefolk_robe+1'].every((id) => quayCache.items.includes(id)), `in the cache, the smuggler's mail and sword and the ladder's Stiletto +1 and Tidefolk Robe +1 (${quayCache.kind === 'chest' ? quayCache.items.map((id) => item(id).name).join(', ') : ''})`);
  listen(w);

  // The two second prestiges here, off the road: the old smuggler's Nightjar in the north fields
  // and the Windwalker in Sjonghol. A company has neither until 19, and then each is sent to its
  // trainer, the world map marking the box, and takes it for 4,000 gold.
  const trainers = people.filter((f) => f.teaches);
  ok(trainers.length === 2 && trainers.some((f) => f.teaches!.cls === 'thief' && f.teaches!.prestige === 2) && trainers.some((f) => f.teaches!.cls === 'monk' && f.teaches!.prestige === 2), 'Rietum\'s box teaches the Thief\'s and the Monk\'s second prestiges');
  const road = C3.rows.flatMap((r, y) => [...r].flatMap((ch, x) => (ch === '=' ? [{ x, y }] : [])));
  ok(trainers.every((f) => road.every((r) => Math.abs(r.x - f.x) + Math.abs(r.y - f.y) > 10)), 'each is more than ten squares off the road');
  ok(trainers.every((f) => C3.encounters!.every((g) => Math.abs(g.x - f.x) + Math.abs(g.y - f.y) > 10)), 'and more than ten squares from any group, so no trainer\'s door is a fight\'s doorstep');
  const later = newWalk(ok).party;
  // The premade six have no monk; one joins for the look ahead.
  if (!later.members.some((c) => c.cls === 'monk')) later.members[later.members.length - 1] = createCharacter('Sjoerd', 'human', 'monk', {}, makeRng(19));
  for (const c of later.members) { c.xp = xpForLevel(19); c.level = 19; if (c.cls === 'thief' || c.cls === 'monk') takePrestige(c); }
  const marked = sought(questLog(w.world.state, later)).filter((p) => p.at === 'upperwater_c3');
  ok(['thief', 'monk'].every((cls) => marked.some((p) => p.who.includes(later.members.find((c) => c.cls === cls)!.name))), `at 19 the thief and the monk are sent to Rietum's box (${marked.map((p) => p.who).join(', ')})`);
  for (const t of trainers) {
    const who = later.members.findIndex((c) => c.cls === t.teaches!.cls);
    later.gold = 4000;
    ok(who >= 0 && (teach(t.teaches!, later, w.world.state, who).taught && prestigeOf(later.members[who]) === 2 && later.gold === 0), `${t.name} makes a ${PRESTIGES[t.teaches!.cls].titles[1]} for 4,000 gold`);
  }
  // The old smuggler knows his sword, and lets it go.
  const before = meet(SMUGGLER, w.party, heard(w.world, SMUGGLER)).text;
  w.party.bag.push('smugglers_sword');
  const after = meet(SMUGGLER, w.party, heard(w.world, SMUGGLER)).text;
  w.party.bag.splice(w.party.bag.indexOf('smugglers_sword'), 1);
  ok(after !== before, `the old smuggler knows his sword in the company's hands (${after.slice(0, 60)}...)`);

  // The box's groups, each won at its floor: the herons, the quay's crew by day, the brinelings at
  // the child's window by night and the bull toad in the drain at the east fields' end.
  for (const g of C3.encounters!) fight(w, `upperwater_c3:${g.id}`);

  // The Night-Light (#56's 21), played every way.
  theNightLight(w);

  // West off the Delta road over the fen, onto the duckboards of B5.
  w.level = 11;
  walkThrough(w, 'delta_c5', 0, 13, WEST, 'delta_b5', 2);

  // The step: the plinth on Stienwierde, empty, its socket cut clean. This company has not stood at
  // the Grove Stone, so it is told no more (#582).
  const stood = atGroveStone(w), plinthSaid = readPlinth(w).join(' ');
  ok(!stood && plinthSaid === PLINTH_SHORT && w.world.used('b5_plinth_first') && !w.world.used('b5_plinth'), 'on Stienwierde the plinth stands empty, and tells a company that has not stood at the Grove Stone the socket and no more');

  // The hermit on the hummock counts the Rifts' lights.
  w.world.travel('delta_b5', B5_COUNTER.x, B5_COUNTER.y);
  const count = meet(B5_COUNTER, w.party, heard(w.world, B5_COUNTER)).text;
  ok(count.includes('Two') && count.includes('island'), 'the hermit on the hummock counts two lights, and sends the company to the island');

  // The secret: the pole-marks on the landing, then the search, the hollow under it and its cache.
  w.world.travel('delta_b5', 13, 13, SOUTH);
  ok(w.world.eventsHere().some((m) => m.includes('barge-poles')), 'on the plinth\'s landing, the barge-poles\' marks');
  let under = false;
  for (let i = 0; i < 20 && !under; i++) under = w.world.search();
  const down = under ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(under && down.every((r) => r.kind === 'moved'), 'searched from the landing, the hollow under it opens, and can be walked into');
  ok(w.world.used('b5_under'), 'under the landing, what the thieves dropped');
  const cache = B5.features!.find((f) => f.kind === 'chest' && f.id === 'b5_under_cache');
  ok(cache?.kind === 'chest' && cache.items.includes('brine_shard') && cache.items.includes('shield+1'), 'in the hollow, a Brine Shard and a Kite Shield +1');
  listen(w);

  // The box's groups, each won at its floor.
  for (const g of B5.encounters!) fight(w, `delta_b5:${g.id}`);

  // The two Rifts, each walked into from its hummock and won at 11.
  for (const [id, x, y, f] of [['b5_rift_n', 16, 6, NORTH], ['b5_rift_s', 26, 25, SOUTH]] as const) {
    walkThrough(w, 'delta_b5', x, y, f, id, 2);
    for (const g of MAP_DEFS.find((d) => d.id === id)!.encounters!) fight(w, `${id}:${g.id}`);
  }

  // South off Stienwierde over the fen to the temples' roofs.
  walkThrough(w, 'delta_b5', 16, 31, SOUTH, 'delta_b6', 2);

  // The step: the priestess at the dry door, counting.
  w.world.travel('delta_b6', PRIESTESS.x, PRIESTESS.y);
  const number = meet(PRIESTESS, w.party, heard(w.world, PRIESTESS)).text;
  ok(number.toLowerCase().includes('eleven'), 'at the temples\' dry door the priestess says the number');
  see(w, 'delta_b6:b6_door');

  // The secret: the count beside her and its pause, then the far roof's wall searched from its ledge.
  w.world.travel('delta_b6', 17, 12);
  ok(w.world.eventsHere().some((m) => m.includes('ten')), 'beside the priestess, her count of the doors');
  w.world.travel('delta_b6', 8, 22, SOUTH);
  let door = false;
  for (let i = 0; i < 20 && !door; i++) door = w.world.search();
  const porch = door ? [w.world.move('forward')] : [];
  ok(door && porch.every((r) => r.kind === 'moved'), 'searched from the far roof\'s ledge, a door in its wall opens, and can be walked into');
  ok(w.world.used('b6_stair'), 'behind it, the wet stair down');
  porch.push(w.world.move('forward'));
  ok(w.world.state.mapId === 'drowned_temples2' && w.world.state.x === 14 && w.world.state.y === 1, 'and down it, the company comes into the choir\'s back, the sacristy (#175)');
  listen(w);

  // The sacristy: the count through its wall, the god's silver, and the priests' pool, which no one
  // crosses to the chancel. The silver is had through the far roof's door and no other way.
  w.world.move('forward');
  ok(w.world.used('dt2_back'), 'in the sacristy, the count through the wall');
  const choir = new GameMap(L2);
  const reachL2 = (from: { x: number; y: number }, to: { x: number; y: number }): boolean => {
    const seen = new Set([`${from.x},${from.y}`]), q = [[from.x, from.y]];
    while (q.length) {
      const [x, y] = q.shift()!;
      if (x === to.x && y === to.y) return true;
      for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
        if (!choir.inBounds(nx, ny) || seen.has(`${nx},${ny}`)) continue;
        const r = choir.passable(nx, ny, { swim: true, float: true });
        if (r === 'ok' || r === 'unlock') { seen.add(`${nx},${ny}`); q.push([nx, ny]); }
      }
    }
    return false;
  };
  const silver = L2.features!.find((f) => f.kind === 'chest' && f.id === 'dt2_silver')!;
  ok(reachL2({ x: 14, y: 1 }, silver) && !reachL2(L2.start, silver), 'the god\'s silver is reached from the far roof\'s stair, and not from the choir\'s, even by a swimmer');
  ok(silver.kind === 'chest' && ['silver_mace', 'tide_symbol'].every((id) => silver.items.includes(id)), `in the sacristy, the Silver Mace +1 and the Holy Symbol of the Tide (${silver.kind === 'chest' ? silver.items.map((id) => item(id).name).join(', ') : ''})`);
  see(w, 'drowned_temples2:dt2_pool');
  walkThrough(w, 'drowned_temples2', 14, 2, NORTH, 'delta_b6', 2);
  ok(w.world.zone?.id === 'delta_b6' && w.world.state.x - w.world.zone.x === 8 && w.world.state.y - w.world.zone.y === 22, 'and back up the wet stair, the company stands on the far roof\'s ledge');

  // The box's groups, each won at its floor.
  for (const g of B6.encounters!) fight(w, `delta_b6:${g.id}`);

  // In at the dry door to the Drowned Temples (#175): the narthex and the bell's empty frame, the
  // drowned in the nave and the north-east chapel, and the count from the apse's stair.
  walkThrough(w, 'delta_b6', 16, 12, NORTH, 'drowned_temples', 2);
  w.world.move('forward');
  ok(w.world.used('dt1_in'), 'through the dry door, the narthex');
  for (const e of ['dt1_frame', 'dt1_nave', 'dt1_flooded', 'dt1_font_se', 'dt1_font_ne', 'dt1_sunk']) see(w, `drowned_temples:${e}`);
  const blessing = L1.features!.find((f) => f.kind === 'shrine' && f.id === 'dt1_bell')!;
  ok(!w.world.present(blessing), 'by the empty frame there is nothing to kneel at');
  for (const g of L1.encounters!) fight(w, `drowned_temples:${g.id}`);
  see(w, 'drowned_temples:dt1_stair');
  ok(w.world.used('dt1_stair'), 'at the apse\'s stair head, the count comes up from below');
  walkThrough(w, 'drowned_temples', 8, 2, NORTH, 'drowned_temples2', 2);

  // The choir: the drowned man at the stair's foot, the choir and the stalls, then the Choirmaster on
  // the chancel step, and the bell it beat time on. The count stops, and does not come back.
  see(w, 'drowned_temples2:dt2_in');
  ok(w.world.used('dt2_in'), 'at the stair\'s foot, the count loud ahead');
  for (const e of ['dt2_choir', 'dt2_psalters', 'dt2_chancel']) see(w, `drowned_temples2:${e}`);
  for (const g of L2.encounters!) fight(w, `drowned_temples2:${g.id}`);
  ok(w.party.bag.includes('tide_bell'), 'the Choirmaster falls, and the company has the Tide Bell');
  see(w, 'drowned_temples2:dt2_vestry_look');
  const vestry = L2.features!.find((f) => f.kind === 'chest' && f.id === 'dt2_vestry')!;
  ok(vestry.kind === 'chest' && ['morning_star+1', 'ironshod_staff+1'].every((id) => vestry.items.includes(id)), 'behind the chancel, the vestry holds the ladder\'s Morning Star +1 and Ironshod Staff +1');
  see(w, 'drowned_temples2:dt2_quiet');
  ok(w.world.used('dt2_quiet'), 'and the stair\'s foot is quiet');
  see(w, 'drowned_temples2:dt2_chancel_after');
  ok(w.world.used('dt2_chancel_after'), 'the chancel step is bare, and nothing beats');
  w.world.state.minutes += 3 * MINUTES_PER_DAY;
  w.world.travel('drowned_temples2', 7, 13);
  ok(!w.world.liveGroups().some((g) => ['dt2_choir', 'dt2_choirmaster'].includes(g.def.id)), 'three days on, the choir does not come back to count');

  // Up with the bell to the priestess: she takes it, hangs it on its frame and rings it.
  meetWho(w, 'tide_bell');
  const bell = (): QuestView | undefined => questLog(w.world.state, w.party).find((v) => v.def.id === 'tide_bell');
  ok(!!w.party.flags.q_tide_bell_done && !w.party.bag.includes('tide_bell') && !!bell()?.done, `the priestess takes the bell, and The Tide Bell is done (${bell()?.pages[0]?.entries.map((e) => e.id).join(', ')})`);
  see(w, 'delta_b6:b6_rung');
  ok(w.world.used('b6_rung'), 'and she rings it inside the door');
  see(w, 'drowned_temples:dt1_frame_hung');
  ok(w.world.used('dt1_frame_hung'), 'the bell hangs on its frame in the narthex');
  // Her words after: the bell rung and the god still counting, and the Stone home.
  w.world.travel('delta_b6', PRIESTESS.x, PRIESTESS.y);
  const hung = meet(PRIESTESS, w.party, heard(w.world, PRIESTESS)).text;
  w.party.flags.q_tide_home = 1;
  const sung = meet(PRIESTESS, w.party, heard(w.world, PRIESTESS)).text;
  delete w.party.flags.q_tide_home;
  ok(hung.includes('Eleven') && hung.includes('Bring the Stone home') && sung.includes('singing the tide down') && !sung.includes('Eleven'), 'after, the priestess asks for the Stone home; with it home, the god sings and she is done counting');
  const endurance = w.party.members.map((m) => m.stats.endurance);
  kneel(w, 'drowned_temples:dt1_bell');
  ok(w.party.members.every((m, i) => m.stats.endurance === endurance[i] + 1 && resists(m).includes('cold')), 'and kneeling at it, the Tidefolk\'s blessing: a point of Endurance to each of the company, and the cold kept off');
  const rested = structuredClone(w.party.members);
  for (const m of rested) rest(m);
  ok(rested.every((m, i) => m.stats.endurance === endurance[i] + 1 && !m.blessed.length), 'until the next rest; the point stays');

  // On down the road into Saltmouth's box: the fen gives way to the Saltings at the seam.
  w.world.travel('delta_c5', 26, 30, SOUTH);
  const crossed: string[] = [];
  for (let i = 0; i < 3 && w.world.zone?.id !== 'saltings_c6'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') crossed.push(...r.messages); }
  ok(w.world.zone?.id === 'saltings_c6' && crossed.some((m) => m.includes('The Saltings')), `the Salt Road out of C5 leads into the Saltings, C6, and the land is named (${crossed.join(' | ')})`);
  listen(w);
  const stone = C6.features!.find((f) => f.kind === 'sign');
  ok(stone?.kind === 'sign' && stone.text.includes('SALTMOUTH 2') && stone.text.includes('RIETUM 7') && C6.rows[stone.y][stone.x + 1] === '=', 'the milestone stands by the road: Saltmouth 2, Rietum 7');

  // The road's end is Saltmouth's land gate, open, a step past its event.
  const gate = C6.features!.find((f) => f.kind === 'event' && f.id === 'c6_gate');
  ok(gate?.kind === 'event' && new GameMap(C6).passable(gate.x, gate.y + 1) === 'ok' && !!C6.exits?.some((e) => e.x === gate.x && e.y === gate.y + 1 && e.to === 'saltmouth'), 'the road ends at Saltmouth\'s gate, and the gate is the way in');

  // The quay's crate, the crews' cargo: the Scale Mail.
  const crate = C6.features!.find((f) => f.kind === 'chest' && f.id === 'c6_crate');
  ok(crate?.kind === 'chest' && crate.items.includes('scale+1'), 'on the quay, a crate of the crews\' cargo holds a Scale Mail +1');

  // The secret: the rope over the sea wall's dry end, then the search, the stair and its cache.
  w.world.travel('saltings_c6', 28, 18, SOUTH);
  w.world.eventsHere();
  let opened = false;
  for (let i = 0; i < 20 && !opened; i++) opened = w.world.search();
  const up = opened ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(opened && up.every((r) => r.kind === 'moved'), 'searched under the rope, the sea wall opens, and the stair inside can be walked into');
  ok(w.world.used('c6_stair'), 'inside the wall, the stair up to the barred door and down to the shore');
  const stairCache = C6.features!.find((f) => f.kind === 'chest' && f.id === 'c6_stair_cache');
  ok(stairCache?.kind === 'chest' && C6.rows[stairCache.y][stairCache.x] === '.' && C6.rows[stairCache.y][stairCache.x + 1] === '#', 'at the stair\'s foot, by the barred sea door, the smugglers\' cache');
  listen(w);

  // The box's groups at its floor: the bargemen by day, the Hand's smugglers by night, the crabs.
  for (const g of C6.encounters!) fight(w, `saltings_c6:${g.id}`);

  // Into Saltmouth by the land gate (#177), and out by it again onto the road.
  walkThrough(w, 'saltings_c6', 26, 17, SOUTH, 'saltmouth');
  ok(w.world.state.x === TOWN.start.x && w.world.state.y === TOWN.start.y, 'the gate lets the company in at the head of the town\'s street');
  walkThrough(w, 'saltmouth', 7, 1, NORTH, 'saltings_c6');
  ok(w.world.zone?.id === 'saltings_c6' && w.world.state.x - w.world.zone.x === 26 && w.world.state.y - w.world.zone.y === 18, 'and out again onto the road before the gate');

  // A company of 10 rests, is cured, buys the band's gear, trains to 13 and takes a first prestige.
  const business = <K extends Feature['kind']>(kind: K): Extract<Feature, { kind: K }>[] => TOWN.features!.filter((f): f is Extract<Feature, { kind: K }> => f.kind === kind);
  ok(business('inn').length === 1 && business('temple').length === 1, 'Saltmouth has an inn to rest at and a shrine that cures');
  const armourer = business('shop').find((f) => f.interior === 'saltmouth_armourer')!;
  const rung = ACT_II.find((r) => r.level === 11)!;
  ok(w.party.members.every((m) => rung.classes[m.cls].every((id) => armourer.stock.includes(id))), 'the armourer sells each of the company\'s classes its step at 11');
  w.party.gold = 20000;
  for (const m of w.party.members) for (const id of rung.classes[m.cls]) ok(!!buy(w.party, armourer, id), `${m.name} buys a ${item(id).name} from the armourer`);
  const loft = business('trainer')[0];
  const ottilie = w.party.members.find((m) => m.cls === 'thief')!;
  ottilie.level = 12; ottilie.xp = xpForLevel(13);
  ok(loft.maxLevel === 13 && canTrainAt(ottilie, loft.maxLevel) && (ottilie.level = 13, !canTrainAt(ottilie, loft.maxLevel)), 'the loft trains a member of 12 to 13, and no further');

  // The four first prestiges taught here, each by a person at their trade; Ottilie, at 11, seeks
  // and takes the Thief's.
  const taught = TOWN.features!.flatMap((f) => (f.kind === 'npc' && f.teaches ? [f.teaches] : []));
  ok(['sorcerer', 'thief', 'barbarian', 'monk'].every((c) => taught.some((t) => t.cls === c && t.prestige === 1)) && taught.length === 4, 'Saltmouth teaches the first prestige of the sorcerer, the thief, the barbarian and the monk');
  ottilie.level = 11;
  const seeking = (): QuestView | undefined => questLog(w.world.state, w.party).find((v) => v.def.id === seekId(w.party.members.indexOf(ottilie), 1) && !v.done);
  ok(sought(questLog(w.world.state, w.party)).some((p) => p.at === 'saltmouth' && p.who.includes(ottilie.name)), `at 11, ${ottilie.name} is sent to Saltmouth (${seeking()?.goal})`);
  const locksmith = TOWN.features!.find((f): f is Person => f.kind === 'npc' && f.teaches?.cls === 'thief')!;
  w.party.gold = 1000;
  ok(teach(locksmith.teaches!, w.party, w.world.state, w.party.members.indexOf(ottilie)).taught && prestigeOf(ottilie) === 1 && w.party.gold === 0 && !seeking(), `the locksmith makes a ${PRESTIGES.thief.titles[0]} of ${ottilie.name} for 1,000 gold, and the seeking is done`);

  // The Cartographers' Guild (#181): a stranger takes the first task at the Map Room, chains the
  // Salt Road from the stone under the Edge to the one in the Saltings, and reports; a Chainman is
  // offered the first rank's two quests, and done they make the company Surveyors.
  const room = business('shop').find((f) => f.hall === 'cartographers');
  ok(!!room && room.interior === 'cartographers_room', `the map room is the Cartographers' hall (${room?.name})`);
  const first = offered('cartographers', w.party);
  ok(rankOf('cartographers', w.party) === 0 && first.length === 1 && first[0].id === 'carto_chain', `a stranger is offered the first task alone (${first.map((q) => q.title).join(', ')})`);
  ok(!takeWork(first[0], w.world.state, w.party).length, 'the first task is not paid on taking, though the company walked past both stones on the way in');
  const chain = (): QuestView | undefined => questLog(w.world.state, w.party).find((v) => v.def.id === 'carto_chain');
  ok(/Kestrel Edge/.test(chain()?.goal ?? ''), `the log sends the company back up the road (${chain()?.goal})`);
  see(w, 'delta_d5:d5_milestone');
  ok(/Saltings/.test(chain()?.goal ?? ''), `the chain begins at the stone under the Edge (${chain()?.goal})`);
  see(w, 'saltings_c6:c6_milestone');
  ok(/Map Room/.test(chain()?.goal ?? ''), `and holds to the stone in the Saltings (${chain()?.goal})`);
  const paid = report('cartographers', w.world.state, w.party);
  ok(rankOf('cartographers', w.party) === 1 && paid.at(-1) === `Your rank with the Cartographers' Guild is now ${rankName('cartographers', 1)}.` && !!chain()?.done, `the Map Room pays the chain and makes the company Chainmen (${paid.join(' | ').replace(/\n+/g, ' ')})`);
  const rank1 = offered('cartographers', w.party);
  ok(rank1.length === 2 && rank1.every((q) => q.rank === 1), `a Chainman is offered the first rank's two quests (${rank1.map((q) => q.title).join(', ')})`);
  for (const q of rank1) takeWork(q, w.world.state, w.party);
  see(w, 'delta_b5:b5_west');
  see(w, 'saltings_c6:c6_hut');
  report('cartographers', w.world.state, w.party);
  ok(rankOf('cartographers', w.party) === 2 && rank1.every((q) => questLog(w.world.state, w.party).find((v) => v.def.id === q.id)?.done), `the fen's edge and the west arm found and reported make the company ${rankName('cartographers', 2)}s`);
  // Ysolde reads the first Meridian journal to a company that carries it, and gives it back.
  const ysolde = TOWN.features!.find((f): f is Person => f.kind === 'npc' && f.name.startsWith('Ysolde'))!;
  w.party.bag.push('meridian_journal');
  const reading = meet(ysolde, w.party, heard(w.world, ysolde)).text;
  ok(!!w.party.flags.meridian_read && countItem(w.party, 'meridian_journal') === 1 && /Fane/.test(reading), `Ysolde reads the first Meridian journal and gives it back (${reading.split('\n\n')[1]})`);

  // Pender's picks and the Map Room's chart (#860): bought at their doors, carried and sold back at half.
  picksAndChart(ok);

  // The Salt Compact (#182): the Keel is its hall, and a stranger is offered the run alone. The
  // clerk on C6's quay hands over the cask once the run is taken; the customs house door shows
  // itself only to the cask; the hall takes the cask and the company is a Runner.
  const boat = TOWN.features!.find((f): f is Person => f.kind === 'npc' && !!f.passage?.length)!.passage![0];
  const keel = TOWN.features!.find((f): f is Person => f.kind === 'npc' && f.hall === 'compact');
  ok(keel?.name === 'The Keel' && keel.interior === 'harbour_tavern', 'the Keel, the harbour tavern, is the Salt Compact\'s hall');
  ok(TOWN.features!.some((f) => f.kind === 'npc' && f.x === keel!.x && f.y === keel!.y && !f.interior && f.name.startsWith('Ruan')), 'and Ruan keeps it');
  const work = (): string => offered('compact', w.party).map((q) => q.id).join(', ');
  ok(work() === 'compact_run' && fareOf(boat, w.world) === 150, `a stranger is offered the run alone (${work()}), and pays the boat's whole fare`);
  const run = GUILD_QUESTS.find((q) => q.id === 'compact_run')!;
  takeWork(run, w.world.state, w.party);
  const clerk = C6.features!.find((f): f is Person => f.kind === 'npc' && f.name === 'the warehouse clerk')!;
  w.world.travel('saltings_c6', clerk.x, clerk.y + 1, NORTH);
  const sent = meet(clerk, w.party, heard(w.world, clerk));
  ok(!!sent.choice && sent.text.includes('The Keel sent you'), `the warehouse clerk has the cask for the Keel (${sent.text})`);
  answer(sent.choice!.answers[0], w.party);
  ok(w.party.bag.includes('brandy_cask'), 'and hands it over');
  ok(report('compact', w.world.state, w.party).length === 0, 'the cask carried straight in is not the run: the hall pays nothing yet');
  w.world.travel('saltmouth', 4, 13, WEST);
  const passed = w.world.eventsHere();
  ok(passed.some((t) => t.includes('customs house door stays shut')), `carried the long way, past the customs house door (${passed.join(' ')})`);
  const runPaid = report('compact', w.world.state, w.party);
  ok(rankOf('compact', w.party) === 1 && !w.party.bag.includes('brandy_cask') && runPaid.at(-1) === 'Your rank with the Salt Compact is now Runner.', `the hall takes the cask and the company is a Runner (${runPaid.join(' | ').replace(/\n+/g, ' ')})`);
  ok(questLog(w.world.state, w.party).find((v) => v.def.id === 'compact_run')?.done === true, 'and the log has the run finished');
  ok(fareOf(boat, w.world) === 75, 'a member pays half the boat\'s fare, never more');
  ok(work() === 'compact_crate, compact_lookout', `a Runner is offered the first rank's two (${work()})`);
  // The first rank's crate, walked in the log: taken, the crate opened on C6's quay, reported.
  const crateWork = GUILD_QUESTS.find((q) => q.id === 'compact_crate')!;
  takeWork(crateWork, w.world.state, w.party);
  const goal = (): string => questLog(w.world.state, w.party).find((v) => v.def.id === 'compact_crate')?.goal ?? '';
  ok(goal().includes('Open a crate'), `the log sends the company to the crews' crate (${goal()})`);
  // Opened as the game opens a chest: its gold and the Scale Mail to the party, and spent.
  w.world.travel('saltings_c6', crate!.x, crate!.y);
  ok(crate?.kind === 'chest' && !w.world.used(crate.id), 'the crews\' crate is there to open');
  if (crate?.kind === 'chest') { w.world.markUsed(crate.id); w.party.gold += crate.gold; w.party.bag.push(...crate.items); }
  ok(w.party.bag.includes('scale+1'), 'and in it the Scale Mail +1');
  ok(goal().includes('Report to the Keel'), `opened, the log sends it back to the Keel (${goal()})`);
  ok(report('compact', w.world.state, w.party).length > 0 && questLog(w.world.state, w.party).find((v) => v.def.id === 'compact_crate')?.done === true, 'and the Keel pays for it');

  // The secret way down: the sawdust trodden out along the Keel's end wall, the search, and the
  // cellar's passage out under C6's sea wall, by the rope, the stair's own secret still to find.
  w.world.travel('saltmouth', 14, 5, NORTH);
  ok(w.world.eventsHere().some((t) => t.includes('Sawdust')), 'by the Keel\'s end wall, the sawdust trodden out along its foot');
  let cellar = false;
  for (let i = 0; i < 20 && !cellar; i++) cellar = w.world.search();
  const through = cellar ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(cellar && through.every((r) => r.kind === 'moved') && w.world.zone?.id === 'saltings_c6' && w.world.state.x - w.world.zone.x === 28 && w.world.state.y - w.world.zone.y === 18,
    'searched, the wall opens, and the cellar\'s passage comes out on the sand under C6\'s sea wall, on the rope\'s square');

  // The boat (#164): bought on the quay from Kitto, it sails at eight and lands on Wrackholm's stage
  // at six the next morning; a save made on the isle loads there; and Kitto sells the way back. A
  // member of the Compact pays half each way.
  w.world.travel('saltmouth', 13, 10, WEST);
  w.party.gold = 200;
  const day = Math.floor(w.world.state.minutes / MINUTES_PER_DAY);
  const out = take(boat, w.world, w.party);
  ok(out.taken && w.party.gold === 125 && w.world.zone?.id === 'wrackholm_e6' && w.world.state.x - w.world.zone.x === 16 && w.world.state.y - w.world.zone.y === 15, `the boat from Saltmouth's quay lands the company on Wrackholm's stage for 75 gold, a member's fare (${out.lines.join(' ')})`);
  ok(Math.floor(w.world.state.minutes / MINUTES_PER_DAY) > day && w.world.hour === 6, `and the calendar has moved: it lands at ${w.world.hour}:00 the next day`);
  const saved = deserialize(serialize(w.world.state, w.party, 0));
  const loaded = new World(buildMaps(), saved.party, makeRng(1), saved.world);
  ok(loaded.zone?.id === 'wrackholm_e6' && loaded.state.minutes === w.world.state.minutes, 'a save made on the isle loads there');
  const back = MAP_DEFS.find((d) => d.id === 'wrackholm_e6')!.features!.find((f): f is Person => f.kind === 'npc' && !!f.passage?.length)?.passage?.[0];
  w.party.gold = 75;
  const home = back ? take(back, w.world, w.party) : undefined;
  ok(!!home?.taken && w.world.state.mapId === 'saltmouth' && w.party.gold === 0 && w.world.hour === 6, `and Kitto at the stage sells the way back, onto Saltmouth's quay (${home?.lines.join(' ')})`);

  // South out of Saltmouth's pans into C7's, under the Scarp.
  w.world.travel('saltings_c6', 17, 30, SOUTH);
  for (let i = 0; i < 3 && w.world.zone?.id !== 'saltings_c7'; i++) w.world.move('forward');
  ok(w.world.zone?.id === 'saltings_c7', 'south from Saltmouth\'s box the salt runs on into the pans, C7');
  listen(w);
  const foot = C7.features!.find((f) => f.kind === 'event' && f.id === 'c7_stair');
  // Since the Wold's C8 (#528) its flights climb on up column 8 through the Scarp, past the fall by a rope ladder.
  ok(foot?.kind === 'event' && C7.rows.slice(foot.y + 1).every((row) => row[foot.x] === '"' && row[foot.x - 1] === 'M' && row[foot.x + 1] === 'M') && new GameMap(C7).passable(foot.x, foot.y) === 'ok' && foot.text.includes('rope ladder'),
    'the Scarp stair\'s foot is a notch in the cliff, its lowest flight fallen, and a rope ladder past the fall to the flights cut up through the Scarp');

  // The secret: the one wall trodden, then the search, the crabs' hole and the sealed pan's hoard.
  const hoard = C7.features!.find((f) => f.kind === 'chest' && f.id === 'c7_hoard');
  const shut = new GameMap({ ...C7, rows: C7.rows.map((r) => r.replaceAll('S', '#')) });
  const seen = new Set<string>([`${C7.start.x},${C7.start.y}`]), q = [[C7.start.x, C7.start.y]];
  for (let k = 0; k < q.length; k++) for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
    const x = q[k][0] + dx, y = q[k][1] + dy;
    if (!seen.has(`${x},${y}`) && shut.passable(x, y) === 'ok') { seen.add(`${x},${y}`); q.push([x, y]); }
  }
  ok(hoard?.kind === 'chest' && hoard.items.includes('crabshell_buckler') && !seen.has(`${hoard.x},${hoard.y}`), 'the salter\'s hoard, a Crab-Shell Buckler, lies in a pan no lane or sluice reaches');
  w.world.travel('saltings_c7', 31, 5, WEST);
  w.world.eventsHere();
  let holed = false;
  for (let i = 0; i < 20 && !holed; i++) holed = w.world.search();
  const inside = holed ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(holed && inside.every((r) => r.kind === 'moved'), 'searched by the trodden wall, the crabs\' hole opens under it, and the sealed pan can be walked into');
  listen(w);

  // The box's groups at its floor: the crabs in the pans, the bull toads in the last marsh.
  for (const g of C7.encounters!) fight(w, `saltings_c7:${g.id}`);

  // The Star That Moved (#56's 24), played every way.
  theStar(w);

  afterTheHeart(ok);
  theBounds(ok);
};

/**
 * The bounds (#830), off the quest. The upper valley over Rietum (C2): north from Rietum's top field at
 * C3's 8,0 onto its 8,31, walked, the land not named again; Jelle and his word on the watch and the
 * toads; no rest at the watch's fire while the watch stands beside it, and a camp once it falls; the
 * box's groups won at 10, the toads at the tarn the hardest; the cleft in the Edge's foot found from
 * the rubbed walling. The Edge's top, east of the face: walked onto from the Downs' D2 alone,
 * the land named there with its warning to a company under its band, and no way down off it on foot.
 * The valley's head (B2): west from C2's 0,20 and north out of B3's grass at 24,0, both walked; the
 * spring's trough, the toad and the eel in the mire won and the beehive hut found from its wrens.
 * The rim's foot behind the willows (A3): west out of B3's grass at 0,28, walked; the river seen up the
 * line of the willows, the toad and the heron won and the well-house found from the rag willow. The
 * hills over the heronry (A4): west out of B4's grass at 0,16 and south out of A3's corner, both walked,
 * the Delta named only at the line from the Upper Water; the woman of stone's riddle, the shrine at
 * the dry valley's mouth, a rest at the reed-cutters' camp while both groups stand clear of it, the
 * herons and the toad and the leech won, the still found from the reek, and the south edge shut against
 * A5, not built yet. Walked, waded, climbed or floated, no prize is reached but through its door.
 */
function theBounds(ok: (cond: boolean, msg: string) => void): void {
  const w = newWalk(ok), out = buildMaps()[OUTDOORS];
  const [C2, B2, A3, A4] = ['upperwater_c2', 'upperwater_b2', 'upperwater_a3', 'delta_a4'].map((id) => MAP_DEFS.find((d) => d.id === id)!);
  const [c2, b2, a3, a4] = [C2.id, B2.id, A3.id, A4.id].map((id) => out.zones.find((z) => z.id === id)!);
  const said = (r: ReturnType<typeof w.world.move>): string => (r.kind === 'moved' ? r.messages.join(' / ') || 'nothing said' : r.kind);
  // The squares of a box reached from one of its own, inside the box: on foot, or walked, waded, climbed
  // and floated with its secret door shut.
  const reach = (z: typeof c2, from: readonly [number, number], can: Can, door?: readonly [number, number]): Set<number> => {
    const seen = new Set<number>(), todo = [[z.x + from[0], z.y + from[1]]];
    while (todo.length) {
      const [x, y] = todo.pop()!, k = y * out.width + x;
      if (seen.has(k) || (door && x === z.x + door[0] && y === z.y + door[1]) || x < z.x || x >= z.x + z.w || y < z.y || y >= z.y + z.h || out.passable(x, y, can) !== 'ok') continue;
      seen.add(k);
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
    }
    return seen;
  };
  const at = (z: typeof c2, x: number, y: number): number => (z.y + y) * out.width + z.x + x;
  const ALL: Can = { swim: true, climb: true, float: true };
  const search = (map: string, x: number, y: number, facing: Facing, room: string): boolean => {
    w.world.travel(map, x, y, facing);
    let found = false;
    for (let i = 0; i < 20 && !found; i++) found = w.world.search();
    const into = found ? [w.world.move('forward'), w.world.move('forward')] : [];
    listen(w);
    return found && into.every((r) => r.kind === 'moved') && w.world.used(room);
  };
  const chest = (def: MapDef, id: string): string[] => { const f = def.features!.find((x) => x.kind === 'chest' && x.id === id); return f?.kind === 'chest' ? f.items : []; };

  // The Edge's top first, at level 1: west from D2's 0,10 onto C2's 31,10, the land named and the warning.
  w.world.travel('downs_d2', 0, 10, WEST);
  const top = w.world.move('forward');
  ok(top.kind === 'moved' && w.world.zone?.id === C2.id && w.world.state.x === c2.x + 31 && top.messages.some((m) => m.includes('The Upper Water.') && m.includes('Nothing here would spare you')),
    `west from the Downs' D2 onto the Edge's top, C2's 31,10, the Upper Water is named and it warns at level 1 (${said(top)})`);
  listen(w);
  const lip = reach(c2, [31, 10], {}), valley = reach(c2, [C2.start.x, C2.start.y], {});
  ok(lip.size > 150 && valley.size > 400 && !lip.has(at(c2, C2.start.x, C2.start.y)) && ![...lip].some((k) => valley.has(k)) && !C2.encounters!.some((g) => lip.has(at(c2, g.x, g.y))),
    `the Edge's top (${lip.size} squares) and the valley under it (${valley.size}) are not joined on foot, and no group stands on the top`);
  see(w, `${C2.id}:c2_stone`);
  see(w, `${C2.id}:c2_lip`);
  w.level = 10;

  // North from Rietum's top field: C3's 8,0 onto C2's 8,31, walked, in the Upper Water still.
  w.world.travel('upperwater_c3', 8, 0, NORTH);
  const north = w.world.move('forward');
  ok(north.kind === 'moved' && w.world.zone?.id === C2.id && w.world.state.x === c2.x + 8 && w.world.state.y === c2.y + 31 && !north.messages.some((m) => m.includes('The Upper Water.')),
    `north from C3's 8,0 onto C2's 8,31, walked, and the land not named again (${said(north)})`);
  listen(w);
  const jelle = C2.features!.find((f): f is Person => f.kind === 'npc' && f.name.startsWith('Jelle'))!;
  w.world.travel(C2.id, jelle.x, jelle.y);
  const words = meet(jelle, w.party, heard(w.world, jelle)).text;
  ok(words.includes('since midsummer') && words.includes('tarn'), `Jelle, with Rietum's sheep, has seen the watch's fire since midsummer and the toads go up to the tarn (${words.replace(/\n+/g, ' ')})`);
  listen(w);
  // The watch's fire: the watch stands next to it, so no company rests there until the watch has fallen.
  const fire = C2.features!.find((f) => f.kind === 'camp')!, watch = C2.encounters!.find((g) => g.id === 'c2_watch')!;
  w.world.travel(C2.id, fire.x, fire.y);
  ok(Math.abs(watch.x - fire.x) + Math.abs(watch.y - fire.y) === 1 && restRefused(w.world) !== '',
    `at the watch's fire, ${fire.x},${fire.y}, the watch stands next to it at ${watch.x},${watch.y} and no rest is had (${restRefused(w.world) || 'rest allowed'})`);
  for (const g of C2.encounters!) fight(w, `${C2.id}:${g.id}`);
  w.world.travel(C2.id, fire.x, fire.y);
  ok(restRefused(w.world) === '', 'once the watch has fallen, its fire is a camp a company may rest at');
  // The secret: the walling rubbed in a line, the search there and the cleft behind it.
  const cleft = reach(c2, [C2.start.x, C2.start.y], ALL, [17, 12]);
  ok(cleft.size > 600 && !cleft.has(at(c2, 17, 11)), `the cleft is shut but for its walling: none of C2's ${cleft.size} squares walked, waded, climbed or floated reaches it`);
  see(w, `${C2.id}:c2_walling`);
  ok(search(C2.id, 17, 13, NORTH, 'c2_cleft'), 'searched at the rubbed walling, it opens, and the cleft behind it can be walked into');
  ok(chest(C2, 'c2_cleft_chest').includes('long_axe+1'), 'in the cleft, a Long Axe +1');

  // The valley's head: west from C2's 0,20 onto B2's 31,20, and north out of B3's grass at 24,0, walked.
  w.world.travel(C2.id, 0, 20, WEST);
  const west = w.world.move('forward');
  ok(west.kind === 'moved' && w.world.zone?.id === B2.id && w.world.state.x === b2.x + 31 && w.world.state.y === b2.y + 20 && !west.messages.some((m) => m.includes('The Upper Water.')),
    `west from C2's 0,20 onto B2's 31,20, walked, and the land not named again (${said(west)})`);
  walkThrough(w, 'upperwater_b3', 24, 0, NORTH, B2.id, 2);
  see(w, `${B2.id}:b2_head`);
  kneel(w, `${B2.id}:b2_spring`);
  for (const g of B2.encounters!) fight(w, `${B2.id}:${g.id}`);
  // The secret: the wrens at the hut's foot, the search there and the cell under the turf.
  const cell = reach(b2, [B2.start.x, B2.start.y], ALL, [19, 21]);
  ok(cell.size > 200 && !cell.has(at(b2, 19, 20)), `the cell is shut but for the wrens' gap: none of B2's ${cell.size} squares walked, waded, climbed or floated reaches it`);
  see(w, `${B2.id}:b2_hut`);
  ok(search(B2.id, 19, 22, NORTH, 'b2_cell'), 'searched where the wrens go in, the hut opens, and the cell under its turf can be walked into');
  ok(chest(B2, 'b2_cell_chest').includes('sharkskin+1'), 'in the cell, a Sharkskin Coat +1');
  const gold = (def: MapDef, id: string): number => { const f = def.features!.find((x) => x.kind === 'chest' && x.id === id); return f?.kind === 'chest' ? f.gold : 0; };

  // The rim's foot behind the willows: west out of B3's grass at 0,28 onto A3's 31,28, walked.
  w.world.travel('upperwater_b3', 0, 28, WEST);
  const behind = w.world.move('forward');
  ok(behind.kind === 'moved' && w.world.zone?.id === A3.id && w.world.state.x === a3.x + 31 && w.world.state.y === a3.y + 28 && !behind.messages.some((m) => m.includes('The Upper Water.')),
    `west from B3's 0,28 onto A3's 31,28, walked, and the land not named again (${said(behind)})`);
  listen(w);
  see(w, `${A3.id}:a3_shallows`);
  for (const g of A3.encounters!) fight(w, `${A3.id}:${g.id}`);
  // The secret: the rag willow at the walling, the search there and the well-house behind it.
  const well = reach(a3, [A3.start.x, A3.start.y], ALL, [25, 27]);
  ok(well.size > 40 && !well.has(at(a3, 24, 27)), `the well-house is shut but for its walling: none of A3's ${well.size} squares walked, waded, climbed or floated reaches it`);
  see(w, `${A3.id}:a3_willow`);
  ok(search(A3.id, 26, 27, WEST, 'a3_wellhouse'), 'searched by the rag willow, the walling opens, and the well-house behind it can be walked into');
  ok(gold(A3, 'a3_wellhouse_chest') === 120 && chest(A3, 'a3_wellhouse_chest').includes('potion_heal'), 'among the shells, 120 gold and a draught');

  // The hills over the heronry: west out of B4's grass at 0,16 onto A4's 31,16, and south out of A3's
  // corner at 29,31 onto A4's 29,0, both walked, the Delta named only from the Upper Water.
  w.world.travel('delta_b4', 0, 16, WEST);
  const hills = w.world.move('forward');
  ok(hills.kind === 'moved' && w.world.zone?.id === A4.id && w.world.state.x === a4.x + 31 && w.world.state.y === a4.y + 16 && !hills.messages.some((m) => m.includes('The Delta.')),
    `west from B4's 0,16 onto A4's 31,16, walked, and the land not named again (${said(hills)})`);
  listen(w);
  w.world.travel(A3.id, 29, 31, SOUTH);
  const down = w.world.move('forward');
  ok(down.kind === 'moved' && w.world.zone?.id === A4.id && w.world.state.x === a4.x + 29 && w.world.state.y === a4.y && down.messages.some((m) => m.includes('The Delta.')),
    `south from A3's 29,31 onto A4's 29,0, walked, and the Delta named at the line (${said(down)})`);
  listen(w);
  ok(Array.from({ length: a4.w }, (_, x) => out.passable(a4.x + x, a4.y + a4.h - 1, ALL)).every((p) => p !== 'ok'), 'A4\'s south edge is shut against A5, not built yet: no square of it is walked, waded, climbed or floated');
  // The woman of stone on the crest, and her riddle, the dry valley's word.
  const statue = A4.features!.find((f): f is Extract<Feature, { kind: 'statue' }> => f.kind === 'statue')!;
  w.world.travel(A4.id, statue.x, statue.y);
  const purse = w.party.gold;
  ok(!answerRiddle(w.world, w.party, statue, 'stream').right && answerRiddle(w.world, w.party, statue, 'River').right && w.party.gold === purse + 60, 'the woman of stone\'s riddle is answered river, for 60 gold');
  kneel(w, `${A4.id}:a4_shrine`);
  // The reed-cutters' camp stands clear of both groups: a company rests there while they stand.
  const camp = A4.features!.find((f) => f.kind === 'camp')!;
  w.world.travel(A4.id, camp.x, camp.y);
  ok(A4.encounters!.every((g) => Math.abs(g.x - camp.x) + Math.abs(g.y - camp.y) > 2) && restRefused(w.world) === '',
    `the reed-cutters' camp at ${camp.x},${camp.y} stands clear of both groups, and a company rests there while they stand (${restRefused(w.world) || 'rest allowed'})`);
  for (const g of A4.encounters!) fight(w, `${A4.id}:${g.id}`);
  // The secret: the reek where the bed ends at the rock, the search there and the still behind the stones.
  const still = reach(a4, [A4.start.x, A4.start.y], ALL, [12, 18]);
  ok(still.size > 500 && !still.has(at(a4, 11, 18)), `the still is shut but for its walling: none of A4's ${still.size} squares walked, waded, climbed or floated reaches it`);
  see(w, `${A4.id}:a4_reek`);
  ok(search(A4.id, 13, 18, WEST, 'a4_still'), 'searched where the bed ends at the rock, the stones give, and the still behind them can be walked into');
  ok(gold(A4, 'a4_still_chest') === 200 && chest(A4, 'a4_still_chest').includes('elixir'), 'in the still, a crock of 200 gold and an elixir');
}

/**
 * The halls' words after the Heart (#765): the Keel's Ruan, the Map Room's Ysolde Carrow and the priestess
 * at the Drowned Temples' dry door each have a word for the relit, the opened and the finished ending,
 * said before anything else of theirs but a business still open: Ruan's question until it is answered and
 * Ysolde's reading of the journal until it is read. Before an ending, none of it.
 */
function afterTheHeart(ok: (cond: boolean, msg: string) => void): void {
  const at = (map: string, x: number, y: number, name: string): Person => MAP_DEFS.find((d) => d.id === map)!.features!.find((f): f is Person => f.kind === 'npc' && f.x === x && f.y === y && f.name.startsWith(name))!;
  const people: readonly [string, Person][] = [['saltmouth', at('saltmouth', 12, 4, 'Ruan')], ['saltmouth', at('saltmouth', 3, 12, 'Ysolde')], ['delta_b6', at('delta_b6', 15, 12, 'a priestess')]];
  const hear = (w: Walk, map: string, p: Person): string => { w.world.travel(map, p.x, p.y); const said = meet(p, w.party, heard(w.world, p)).text; listen(w); return said; };
  // Each ending's first words from Ruan, Ysolde and the priestess, and the flags of everything they had to say before.
  const WORDS: Record<string, readonly string[]> = {
    q_end_reignite: ['"Steady light, quiet sea', '"The map is finished, then', '"It sings. Not the count'],
    q_end_arrive: ['"Wind. Real wind', '"Beyond. There is a beyond', '"It stopped. The count stopped'],
    q_end_finish: ['"The sea hums.', '"The Guild has a map with nothing past its edge', '"It sings a song I have not heard'],
  };
  const DONE = ['q_compact_over', 'meridian_read', 'q_tide_bell_done', 'q_tide_home'];
  const company = (...flags: string[]): Walk => { const w = newWalk(ok); for (const f of [...DONE, ...flags]) w.party.flags[f] = 1; return w; };
  const before = company(), said = people.map(([map, p]) => hear(before, map, p));
  ok(said.every((s) => !Object.values(WORDS).flat().some((x) => s.startsWith(x))), `before an ending Ruan, Ysolde and the priestess say what they said (${said.map((s) => s.slice(0, 24)).join(' / ')})`);
  for (const flag of Object.keys(WORDS)) {
    const w = company(flag), now = people.map(([map, p]) => hear(w, map, p));
    ok(now.every((s, i) => s.startsWith(WORDS[flag][i])), `after ${flag}, first of all, each has the ending's word (${now.map((s) => s.slice(0, 24)).join(' / ')})`);
  }
  { // A business still open comes first: after an ending the Compact's question is put and answered and the journal read, then the words.
    const w = newWalk(ok), [ruan, ysolde] = [people[0][1], people[1][1]];
    for (const f of ['q_compact_factor_done', 'q_end_arrive']) w.party.flags[f] = 1;
    w.party.bag.push('meridian_journal');
    w.world.travel('saltmouth', ruan.x, ruan.y);
    const over = meet(ruan, w.party, heard(w.world, ruan)).choice?.answers.find((a) => a.label === 'Take the Compact over.');
    if (over) answer(over, w.party);
    const read = hear(w, 'saltmouth', ysolde), now = [hear(w, 'saltmouth', ruan), hear(w, 'saltmouth', ysolde)];
    ok(!!over && !!w.party.flags.q_compact_over && read.includes('Fane\'s hand. Volume one.') && !!w.party.flags.meridian_read && now[0].startsWith(WORDS.q_end_arrive[0]) && now[1].startsWith(WORDS.q_end_arrive[1]),
      `after an ending Ruan still puts the Compact's question and Ysolde still reads the journal, and then each has the ending's word (${now.map((s) => s.slice(0, 24)).join(' / ')})`);
  }
}
