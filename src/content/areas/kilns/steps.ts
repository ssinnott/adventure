// The Kilns' chain (#1033): the steps of its chapter of the one quest, The Anvil Stone, played in order
// (`STEPS`: the verse, the thane answered, the door, the tear closed, Kilnhaven's manifests and the
// moor, at 16, 17 and 18) and with Kilnhaven reached by ferry first (`HAVEN_FIRST`), the Stone bought or
// taken either way, with the thane they meet and the way's name (`THANE`, `named`). The Kilns'
// walkthrough plays them, and a later chapter's walkthrough or steps.ts replays them by this file, never
// by the walkthrough; nothing in the game imports it.
import { walkThrough, meetWho, see, fight, listen, written, atLevel, mapDef } from '../../../../tools/kit/walk.ts';
import type { Step } from '../../../../tools/kit/walk.ts';
import { EAST, SOUTH } from '../../../game/types.ts';
import { TABLES } from '../../index.ts';
import { meet, heard, answer } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { ANVIL_STONE_PRICE } from './items.ts';
import { VERSE_READ, BOUGHT, TAKEN } from './maps/anvilhall.ts';
import { TEAR } from './maps/kilnsheart_o5.ts';
import { MANIFESTS_READ, DWARF_MET } from './maps/kilnhaven.ts';
import { CHAPTER } from './chapter.ts';

/** Thane Wolfram in Anvilhall's great hall, who puts the Stone at its price or has it taken. */
export const THANE = mapDef('anvilhall').features!.find((f) => f.kind === 'npc' && f.name.startsWith('Thane Wolfram')) as Person;

/** The way the thane was answered, as the journal names it. */
export const named = (way: string): string => (way === BOUGHT ? 'bought' : 'taken');

/** The verse over the kings' forge, read the old way by the Lantern reader in the great hall. */
const VERSE: Step = { name: 'the verse', play: (w) => {
  meetWho(w, VERSE_READ);
  w.ok(written(w, CHAPTER).includes('verse'), 'the verse over the kings\' forge, read the old way, is written');
} };

/** The thane's question, answered one way: the Stone bought at its price, or taken. */
const thane = (way: string): Step => ({ name: `the Stone ${named(way)}`, play: (w) => {
  w.world.travel('anvilhall', THANE.x, THANE.y);
  const [buyIt, takeIt] = meet(THANE, w.party, heard(w.world, THANE)).choice?.answers ?? [];
  w.party.gold = way === BOUGHT ? ANVIL_STONE_PRICE : 0;
  answer(TABLES.items, way === BOUGHT ? buyIt : takeIt, w.party);
  listen(w);
  w.ok(!!w.party.flags[way] && written(w, CHAPTER).includes(named(way)) && !written(w, CHAPTER).includes(named(way === BOUGHT ? TAKEN : BOUGHT)), `the Stone ${named(way)}, and that way alone is written`);
} });

/** The Foreman won at the bottom of the Tiefzeche, and the door marked CREW ONLY seen past it. */
const DOOR: Step = { name: 'the door', play: (w) => {
  fight(w, 'deep_mines3:dm3_foreman');
  see(w, 'deep_mines3:dm3_door');
  w.ok(written(w, CHAPTER).includes('door'), 'the door marked CREW ONLY is written, with the footprints and the knot');
} };

/**
 * In at the tear under the Stone, past the thane's iron if it was taken; the Warden won, whose fall
 * closes the tear with no step taken, which the Hearth counts.
 */
const stone = (way: string): Step => ({ name: 'the tear closed', play: (w) => {
  if (way === TAKEN) fight(w, 'kilnsheart_o5:o5_guard');
  walkThrough(w, 'kilnsheart_o5', TEAR.x - 1, TEAR.y, EAST, 'anvil_stone', 2);
  const lit = w.world.stones;
  fight(w, 'anvil_stone:as_warden');
  w.ok(!!w.party.flags.q_anvil_closed && w.world.stones === lit + 1 && written(w, CHAPTER).includes('stone'),
    `the Stone ${named(way)}, the Warden's fall closes the tear, the Hearth counts it (${lit} Stones to ${w.world.stones}) and it is written`);
} });

/** At Kilnhaven, the harbourmaster's manifests read and the old dwarf heard on the quay. */
const HAVEN: Step = { name: 'the manifests', play: (w) => {
  meetWho(w, MANIFESTS_READ);
  meetWho(w, DWARF_MET);
  w.ok(written(w, CHAPTER).includes('manifests') && written(w, CHAPTER).includes('corridors'), 'the manifests are written, and the corridors that run south');
} };

/** Down the drove road out of N6 onto Cairnmoor's moor. */
const MOOR: Step = { name: 'onto the moor', play: (w) => walkThrough(w, 'kilnsheart_n6', 3, 29, SOUTH, 'highmoor_n7', 4) };

/** The chapter in order, the Stone `way` (bought or taken): the verse, the thane, the door, the tear closed, the manifests and the moor. */
export const STEPS = (way: string): readonly Step[] => [atLevel(16, VERSE), atLevel(16, thane(way)), atLevel(17, DOOR), atLevel(17, stone(way)), atLevel(18, HAVEN), atLevel(18, MOOR)];
/** The chapter with Kilnhaven reached by ferry from Saltmouth first, its manifests before the verse. */
export const HAVEN_FIRST = (way: string): readonly Step[] => [atLevel(16, HAVEN), atLevel(16, VERSE), atLevel(16, thane(way)), atLevel(17, DOOR), atLevel(18, stone(way)), atLevel(18, MOOR)];
