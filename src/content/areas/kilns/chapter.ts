// The Kilns' chapter of the one quest, in the journal's words: The Anvil Stone, the first of Act III.
// The east road up out of Lanternwood into the Fells; the verse over the kings' forge at Anvilhall,
// read the old way; the thane's choice, the Stone bought back or taken; the door at the bottom of the
// Tiefzeche, the footprints and the knot; the tear under the Stone closed; and at Kilnhaven the
// manifests and the corridors that run south, where the goal points down the drove road onto the moor
// and Cairnmoor's chapter (#481) takes it on. content/index.ts joins it with the other areas' in road
// order; how the words are keyed is in src/content/area.ts (`chapter`), and tools/tests/quests.ts
// checks every key. docs/areas/kilns.md §5 and §9 (#470) are its design.
import type { Chapter } from '../../../game/quests.ts';
import { VERSE_READ, BOUGHT, TAKEN } from './maps/anvilhall.ts';
import { MANIFESTS_READ, DWARF_MET } from './maps/kilnhaven.ts';

/** The tear under the Stone closed, the Warden fallen: the Rift's flag (maps/anvil_stone.ts), which the Hearth counts. */
const CLOSED = 'q_anvil_closed';
/** The door marked CREW ONLY, seen: the Tiefzeche's lowest level, before it. */
const DOOR = 'deep_mines3:dm3_door';

export const CHAPTER: Chapter = {
  // Begun on the Fells' way in from Lanternwood, or at Kilnhaven to a company landed there first by
  // ferry or coach: nothing in it is a lock (#434's 4), and it reads true in either order.
  id: 'anvil',
  title: 'The Anvil Stone',
  start: [{ visited: 'ironfells_m3' }, { visited: 'kilnhaven' }],
  // The Stone bought or taken and its tear closed, Kilnhaven's word heard, and the company down the
  // drove road onto the moor, where Cairnmoor's chapter begins. The verse and the door are steps on
  // the way, and a company that passes them by may still go on.
  done: [
    { flag: [BOUGHT, CLOSED, MANIFESTS_READ, DWARF_MET], visited: 'highmoor_n7' },
    { flag: [TAKEN, CLOSED, MANIFESTS_READ, DWARF_MET], visited: 'highmoor_n7' },
  ],
  entries: [
    { id: 'road', when: { visited: 'ironfells_m3' },
      text: 'From Lanternwood the east road climbed into the Iron Fells, the dwarves\' country: pine, the ground going up, and all day a hammer somewhere ahead.' },
    { id: 'verse', when: { flag: VERSE_READ },
      text: 'In Anvilhall\'s great hall, over the kings\' forge, is the verse the dwarves sing at every forge. Read the old way, a word at a time: DANGER. KEEP FIRE BELOW THIS LINE. A warning, the Lantern reader there says, the kind you paint on a boiler.' },
    // The thane's choice, one way or the other: his words change, and the Stone counts either way.
    { id: 'bought', when: { flag: BOUGHT },
      text: 'The dwarves have cut their own Stone for years, a piece a season, and the Compact pays by weight. We bought back what is left from Thane Wolfram for six thousand gold. He counted every coin, and never looked at us.' },
    { id: 'taken', when: { flag: TAKEN },
      text: 'The dwarves have cut their own Stone for years, a piece a season, and the Compact pays by weight. We told Thane Wolfram we would take it. His iron goes to the Stone ahead of us, and his forge is shut to us for good.' },
    // What is seen, and never what the door is.
    { id: 'door', when: { seen: DOOR },
      text: 'At the bottom of the Tiefzeche the pick marks stop, and a clean corridor nobody dug runs on, humming, to a door marked CREW ONLY that will not open. In the dust before it, hundreds of footprints walking down, in a line. On the frame, at a girl\'s shoulder, a loop inside a loop.' },
    { id: 'stone', when: { flag: CLOSED },
      text: 'Under the Stone the ground was torn open into slag, and the Warden of the Anvil stood up out of the cut. When it fell the red went out of the slag and the tear closed. The Stone is only a stone now, and the Hearth burns the steadier for it.' },
    { id: 'manifests', when: { flag: MANIFESTS_READ },
      text: 'At Kilnhaven the harbourmaster\'s manifests say iron to Cinderport, by the ton; then, in another hand, the Compact\'s crates, sealed, for Cinderport and Sheer Point, no weight given. Nothing puts in at Sheer Point, she says.' },
    { id: 'corridors', when: { flag: DWARF_MET },
      text: 'An old dwarf on Kilnhaven\'s quay cut the Tiefzeche forty years. Under its bottom, he says, the corridors run south: under the moor, under the world, toward the lakes.' },
  ],
  goals: [
    { when: [{ flag: [BOUGHT, CLOSED, MANIFESTS_READ, DWARF_MET] }, { flag: [TAKEN, CLOSED, MANIFESTS_READ, DWARF_MET] }], at: 'kilnsheart_n6',
      text: 'South, where the corridors run: down the drove road out of the Kilns and over the border onto the moor.' },
    { when: [{ flag: [BOUGHT, CLOSED] }, { flag: [TAKEN, CLOSED] }], at: 'kilnhaven',
      text: 'Down the drove road and west by the branch to Kilnhaven, the ore port: ask the harbourmaster for her manifests, and hear the old dwarf on the quay.' },
    { when: [{ flag: BOUGHT, seen: DOOR }, { flag: TAKEN, seen: DOOR }], at: 'anvil_stone',
      text: 'East by the cutters\' track to the Anvil Stone, and down through the tear in the ground below it.' },
    { when: [{ flag: BOUGHT }, { flag: TAKEN }], at: 'deep_mines3',
      text: 'Below, where the cargo went: down the Tiefzeche to the bottom of the deepest mine, where the dwarves\' tunnel ends in a clean corridor.' },
    { when: { flag: VERSE_READ }, at: 'anvilhall',
      text: 'In Anvilhall\'s great hall, hear the thane on his seat before the kings\' forge.' },
    // Kilnhaven first: the way to the hold is up the drove road from the south.
    { when: { flag: [MANIFESTS_READ, DWARF_MET] }, at: 'anvilhall',
      text: 'North up the drove road, and on up the trail to Anvilhall, the dwarves\' hold in the Iron Fells.' },
    { when: { visited: 'ironfells_m3' }, at: 'anvilhall',
      text: 'Up the trail through the Fells to Anvilhall, the dwarves\' hold, where the Tide Ship\'s papers said its cargoes went below.' },
    { when: { visited: 'kilnhaven' }, at: 'kilnhaven',
      text: 'Ask Kilnhaven\'s harbourmaster for her manifests, what the Compact\'s ship loads here, and hear the old dwarf on the quay.' },
  ],
};
