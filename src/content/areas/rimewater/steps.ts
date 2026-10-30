// Rimewater's chain (#1033): the steps of its chapter of the one quest, The Sleepers, in order (`STEPS`:
// the four nights stood at the inn, the hole's fight and the girl out of it, down through the door under
// Loch Fuar's ice, the beds below it, and back up and on to the pass's mouth), and with the pass's mouth
// reached before the beds (`PASS_FIRST`), with the way back up past her at the door that they call
// (`backUp`). Rimewater's walkthrough plays them, and a later chapter's walkthrough or steps.ts replays
// them by this file, never by the walkthrough; nothing in the game imports it.
import { walkThrough, see, fight, listen, meetWho, written, atLevel, ofKind, mapDef } from '../../../../tools/kit/walk.ts';
import type { Step, Walk } from '../../../../tools/kit/walk.ts';
import { NORTH, SOUTH } from '../../../game/types.ts';
import { meet, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { nightCost, stay } from '../../../game/services.ts';
import { NIGHTS, WENNA_UP } from './maps/rime_lodge.ts';
import { DOOR } from './maps/coldmere_k9.ts';
import { WENNA_LODGE } from './public.ts';
import { CHAPTER } from './chapter.ts';

const K9 = mapDef('coldmere_k9'), TOWN = mapDef('rime_lodge');
/** A person of a map, by name. */
const person = (def: typeof K9, name: string): Person => def.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;

/**
 * The four nights: a stay at the inn each, paid from the purse by the rule its screen serves, and
 * the morning in the yard. Each night's entry is written as its flag is set, and no more.
 */
const NIGHTS_STOOD: Step = { name: 'the four nights', play: (w) => {
  const inn = ofKind(TOWN, 'inn')[0], night = nightCost(inn, w.party);
  for (const [i, flag] of NIGHTS.entries()) {
    const purse = w.party.gold;
    const { set } = stay(w.party, w.world, inn);
    w.world.travel('rime_lodge', inn.x + 1, inn.y);
    w.world.eventsHere();
    listen(w);
    w.ok(set === flag && purse - w.party.gold === night && written(w, CHAPTER).includes(flag) && !written(w, CHAPTER).includes(NIGHTS[i + 1] ?? 'up'),
      `a night at ${inn.name} for ${night} gold sets ${flag}, and its entry and no later one is written`);
  }
} };

/** The hole's fight on the fourth night, and the last one out, met. */
const HOLE: Step = { name: 'the hole', play: (w) => { fight(w, 'longmere_m9:m9_night_4'); meetWho(w, WENNA_UP); } };

/** Down the crack in Loch Fuar's ice and through the door under her palm, and its inside. */
const DOWN: Step = { name: 'the door', play: (w) => {
  walkThrough(w, K9.id, DOOR.x, DOOR.y - 1, SOUTH, 'sleepers_bay', 1);
  see(w, 'sleepers_bay:sb1_door');
} };

/** Down the stair to its foot and the last flight into the bay, and the beds. */
const BEDS: Step = { name: 'the beds', play: (w) => {
  see(w, 'sleepers_bay:sb1_foot');
  walkThrough(w, 'sleepers_bay', 6, 13, SOUTH, 'sleepers_bay2', 1);
  see(w, 'sleepers_bay2:sb2_beds');
} };

/** Back up through the door from the landing: she speaks at it, and then she is at the lodge. */
export function backUp(w: Walk, how: string): void {
  const [door, lodge] = [person(K9, 'The girl out of the hole'), person(TOWN, 'The girl out of the hole')];
  walkThrough(w, 'sleepers_bay', 8, 1, NORTH, K9.id, 1);
  const before = w.world.present(door) && !w.world.present(lodge);
  w.world.travel(K9.id, door.x, door.y);
  const words = meet(door, w.party, heard(w.world, door)).text;
  listen(w);
  w.ok(before && words.includes('marched them on south, under the world') && !!w.party.flags[WENNA_LODGE] && !w.world.present(door) && w.world.present(lodge),
    `${how}, back up from the beds she speaks at the door, and then is at the lodge and not at the door (${words.replace(/\s+/g, ' ')})`);
}

/** Back up, and south over the pass to its mouth. */
const SOUTH_OVER: Step = { name: 'back up, and the pass\'s mouth', play: (w) => { backUp(w, 'in order'); see(w, 'coldmere_k10:k10_mouth'); } };

/** The chapter in order: the four nights and the hole at 20, the door at 21, and the beds and the pass's mouth at 22. */
export const STEPS: readonly Step[] = [atLevel(20, NIGHTS_STOOD), atLevel(20, HOLE), atLevel(21, DOWN), atLevel(22, BEDS), atLevel(22, SOUTH_OVER)];
/** The chapter with the pass's mouth reached first: it ends with the beds. */
export const PASS_FIRST: readonly Step[] = [atLevel(20, NIGHTS_STOOD), atLevel(20, HOLE), atLevel(21, DOWN), atLevel(22, BEDS)];
