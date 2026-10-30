// Saltreach's chain (#1033): the steps of its chapter of the one quest, The Tide Stone, in order (`STEPS`:
// into the Delta, up to Rietum, the plinth, the temples, Saltmouth and the boat to Wrackholm's landing), and
// the two runs that play it from a new game and leave the company on the landing, where Wrackholm's chapter
// goes on: in order, the Foreland and the Grove first (`inOrder`), and Saltmouth first, before the Grove
// (`saltmouthFirst`); with the plinth's words they read (`readPlinth`, `atPlinth`, `atGroveStone`,
// `plinthRead`). Saltreach's walkthrough plays them, and a later chapter's walkthrough or steps.ts replays
// them by this file, never by the walkthrough; nothing in the game imports it.
import { newWalk, walkThrough, see, listen, meetWho, playChapter, goalFromBegun, quest, written, mapDef, featureOn } from '../../../../tools/kit/walk.ts';
import type { Step, Walk } from '../../../../tools/kit/walk.ts';
import { CHAPTER } from './chapter.ts';
import { STEPS as FORELAND_STEPS, hired, ledgerGiven } from '../shelf/steps.ts';
import { STEPS as GROVE_STEPS } from '../thornmark/steps.ts';
import { NORTH, SOUTH, WEST } from '../../../game/types.ts';
import { holds } from '../../../game/quests.ts';
import { take } from '../../../game/passage.ts';
import type { Person } from '../../../game/people.ts';
import { THE_QUEST } from '../../index.ts';

// Other areas' chapters, taken from the quest by their ids and not from their files (#992).
const FORELAND = THE_QUEST.chapters.find((c) => c.id === 'ashcombe')!;
const GROVE = THE_QUEST.chapters.find((c) => c.id === 'grove')!;
const TOWN = mapDef('saltmouth'), B5 = mapDef('delta_b5');

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
export const PLINTH_SHORT = 'Stienwierde. The plinth, and nothing on it: a socket cut clean, a man\'s width.';
export const PLINTH_CUT = `${PLINTH_SHORT} You have seen that cut before, a hand-span of it, under the roots.`;

/** Whether the company has stood at the Grove Stone, which the plinth reads it by. */
export const atGroveStone = (w: Walk): boolean => holds({ seen: 'grove2:g2_stone' }, w.world.state, w.party);

/** Whether one of the plinth's two events has been read, wherever the company stands now (`used` reads the map it is on). */
export const plinthRead = (w: Walk, id: 'b5_plinth' | 'b5_plinth_first'): boolean => holds({ seen: `delta_b5:${id}` }, w.world.state, w.party);

/** Onto the plinth's square, as `see` does, and what is said there: `see` does not give the words back. */
export function atPlinth(w: Walk): string[] {
  const plinth = featureOn(B5, 'b5_plinth', 'event');
  w.world.travel('delta_b5', plinth.x, plinth.y);
  const said = w.world.eventsHere();
  listen(w);
  return said;
}

/** The plinth stepped on, its words held to what this company has seen: the cut to one that has stood at the Grove Stone, the socket and no more to one that has not. */
export function readPlinth(w: Walk): string[] {
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
  ok(['saw', 'plinth', 'count', 'stair', 'hale', 'ship'].every((e) => written(chain, CHAPTER).includes(e)), `in order, the whole chapter is written to the boat (${written(chain, CHAPTER).join(', ')})`);
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
  ok(JSON.stringify(written(first, CHAPTER)) === JSON.stringify(['plinth', 'ship']), `Saltmouth first, the Tide Stone holds only what was seen and said (${written(first, CHAPTER).join(', ')})`);
  // The Grove not begun, the company has not stood at its Stone, so the plinth told it the socket and no more (#582), and the step is written all the same.
  ok(plinthRead(first, 'b5_plinth_first') && !plinthRead(first, 'b5_plinth') && !atGroveStone(first), 'Saltmouth first, the plinth told the company the socket cut clean and no more');
  return first;
}
