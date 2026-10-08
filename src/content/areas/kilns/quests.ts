// The Kilns' side quests, in the journal's words: #56's four, 33 to 36, each built on its box (#471;
// §6 of docs/areas/kilns.md). The Crust-Bearer (the mother at N3's well, and her son at the bottom of
// the Tiefzeche), The Primer (the scholar at Erzkamm's wall, and Anvilhall's thane), A Crown to Order
// (the smith at Gluthutte, and Tallis's man at Kilnhaven) and The Miners' Hymn (the Tiefzeche's doors,
// and the oldest miner at Anvilhall). How the words are keyed is in src/content/area.ts (`quests`);
// tools/tests/quests.ts checks every key.
import type { QuestDef } from '../../../game/quests.ts';
import { HYMN_SUNG } from './maps/anvilhall.ts';
import { TALLIS_OWES } from './maps/kilnhaven.ts';

export const QUESTS: readonly QuestDef[] = [
  {
    // #56's 33: the mother at the terrace well gives it, and her ring; her son at the bottom knows the
    // ring, pays, and goes up to Anvilhall's inn. The scraps he sends up are read at the well.
    id: 'crust',
    title: 'The Crust-Bearer',
    start: { flag: 'q_crust' },
    done: { flag: 'q_crust_up' },
    entries: [
      { id: 'well', when: { flag: 'q_crust' }, text: 'A dwarf woman at the terrace well under Anvilhall: her son carries the crust down for the knockers, and will not come up.' },
      { id: 'scraps', when: { seen: 'ironfells_n3:n3_scraps' }, text: 'Knotted in her well\'s rope, the scraps he sends up with the empty cloth, in the old script: ALL HANDS COUNTED.' },
      { id: 'ring', when: { flag: 'q_crust_ring' }, text: 'She gave us the iron ring off her braid, so that he will know who sent us.' },
      { id: 'up', when: { flag: 'q_crust_up' }, text: 'At the bottom of the Tiefzeche, by crusts nobody eats, he knew her ring. He has gone up to the hall.' },
    ],
    goals: [
      { when: { flag: 'q_crust_ring' }, text: 'Show her ring to her son, at the bottom of the Tiefzeche.', at: 'deep_mines3' },
      { when: { flag: 'q_crust' }, text: 'Answer the dwarf woman at the terrace well under Anvilhall.', at: 'ironfells_n3' },
    ],
  },
  {
    // #56's 34: the scholar at Erzkamm's wall gives it, and asks: taken to the thane he is kept at
    // Anvilhall, or his copybook is the company's, which reads as a Linguist does while carried (#538).
    id: 'primer',
    title: 'The Primer',
    start: { flag: 'q_primer' },
    done: [{ flag: 'q_primer_kept' }, { flag: 'q_primer_book' }],
    entries: [
      { id: 'scholar', when: { flag: 'q_primer' }, text: 'At Erzkamm a man of Helmstow copies the dwarves\' first blessing into a book, learning the old script from children\'s primers. Who for? Himself, he says.' },
      { id: 'kept', when: { flag: 'q_primer_kept' }, text: 'We took him down to the thane. He is kept at Anvilhall, and his book went into the forge.' },
      { id: 'book', when: { flag: 'q_primer_book' }, text: 'We took his copybook, the old script\'s marks with the Crown\'s letters by each, and he went down the fell.' },
    ],
    goals: [
      { when: { flag: 'q_primer' }, text: 'Answer the scholar at the wall in Erzkamm: the thane, or his copybook.', at: 'ironfells_n2' },
    ],
  },
  {
    // #56's 35: the smith at Gluthutte's smelter gives it, or Tallis's man waiting at Kilnhaven does.
    // Carried down, the crown sails and Tallis owes the company, which the Council reads later; told,
    // the thane's men take it and the stones it was paid in.
    id: 'crown',
    title: 'A Crown to Order',
    start: [{ flag: 'q_crown_wiebe' }, { flag: 'q_crown' }],
    done: [{ flag: 'q_crown_told' }, { flag: TALLIS_OWES }],
    entries: [
      { id: 'crown', when: { flag: 'q_crown' }, text: 'At Gluthutte\'s smelter the master smith is making a crown to order, under the verse, paid for in the Compact\'s stones.' },
      { id: 'man', when: { flag: 'q_crown_wiebe' }, text: 'Wiebe, Jory Tallis\'s man, waits at Kilnhaven on a parcel up from the smelter, late. He has not been told what is in it.' },
      { id: 'carried', when: { flag: 'q_crown_carried' }, text: 'The crown was done, and no carter came for it. We carry it down to Kilnhaven, sewn up in sacking.' },
      { id: 'told', when: { flag: 'q_crown_told' }, text: 'We told the thane. His men took the crown off the smelter\'s anvil, and the Compact\'s stones with it.' },
      { id: 'sailed', when: { flag: TALLIS_OWES }, text: 'Into Wiebe\'s hands at Kilnhaven, and out on the next boat. Jory Tallis will hear whose hands brought it.' },
    ],
    goals: [
      { when: { flag: 'q_crown_carried' }, text: 'Put the parcel into Wiebe\'s hands, on the street in Kilnhaven.', at: 'kilnhaven' },
      { when: { flag: 'q_crown' }, text: 'Answer the master smith at Gluthutte: carry the crown down, or tell the thane.', at: 'kilnsheart_n5' },
      { when: { flag: 'q_crown_wiebe' }, text: 'Ask after the parcel for Tallis\'s man at the smelter, at Gluthutte.', at: 'kilnsheart_n5' },
    ],
  },
  {
    // #56's 36: the verses at the Tiefzeche's three doors going down, or the oldest miner at Anvilhall,
    // give it; the three heard, he sings the last, the verse for the door at the bottom, which the
    // Bard's third reads (#448).
    id: 'hymn',
    title: 'The Miners\' Hymn',
    start: [{ flag: 'q_hymn_1' }, { flag: 'q_hymn_2' }, { flag: 'q_hymn_3' }, { flag: 'q_hymn' }],
    done: { flag: HYMN_SUNG },
    entries: [
      { id: 'oldest', when: { flag: 'q_hymn' }, text: 'The oldest miner at Anvilhall sang the doors going down for fifty years. He would hear how they sing them now.' },
      { id: 'doors', when: [{ flag: 'q_hymn_1' }, { flag: 'q_hymn_2' }, { flag: 'q_hymn_3' }], text: 'In the Tiefzeche an old miner works each air door, and sings as we pass: one door shut, and all hands counted.' },
      { id: 'three', when: { flag: ['q_hymn_1', 'q_hymn_2', 'q_hymn_3'] }, text: 'Three doors going down, a verse at each, counting. Below the third nobody sings.' },
      { id: 'last', when: { flag: HYMN_SUNG }, text: 'He sang us the verse they leave out, the bottom door\'s: "Last door, the captain\'s door. Shut, and all hands counted."' },
    ],
    goals: [
      { when: { flag: ['q_hymn_1', 'q_hymn_2', 'q_hymn_3'] }, text: 'Tell the oldest miner at Anvilhall how the doors are sung now.', at: 'anvilhall' },
      { when: [{ flag: 'q_hymn_1' }, { flag: 'q_hymn_2' }, { flag: 'q_hymn_3' }, { flag: 'q_hymn' }], text: 'Hear the verses at the Tiefzeche\'s air doors, going down.', at: 'deep_mines' },
    ],
  },
];
