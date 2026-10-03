// Sunderwood's side quests, in the journal's words: #56's four (#205), built on the boxes and the
// Watch. Under the Glass Trees, #56's The Family at the Glass Trees (Garret, J2; Averil): the warding lamp taken to the cabin, or
// the family brought over the bridge. The Dammed Fall (Orm and Hew, K2): the dam broken, or the
// foreman's tally kept. The Watch's Lamp (Averil, Osric): the cut wick told, or let be for the
// Watch's map. The Length of the Wall (Brink): the measure sold, or the Watch told.
// How the words are keyed is in src/content/area.ts (`quests`); tools/tests/quests.ts checks every
// key.
import type { QuestDef } from '../../../game/quests.ts';

/** The great lamp lit again: either answer to the prior. */
export const LAMP_LIT = [{ flag: 'q_lamp_exposed' }, { flag: 'q_lamp_kept' }] as const;
/** Both ends of the wall walked: the east by its flag, the west by the fall at the chalk's end. */
export const WALL_WALKED = { flag: ['q_wall', 'q_wall_east'], seen: 'the_sunder2:su2_fall' } as const;

export const QUESTS: readonly QuestDef[] = [
  {
    id: 'family',
    title: 'Under the Glass Trees',
    start: { flag: 'q_family' },
    done: [{ flag: 'q_family_lit' }, { flag: 'q_family_gone' }],
    entries: [
      { id: 'garret', when: { flag: 'q_family' },
        text: 'Garret, a pine-cutter at the Eaves, will not leave two graves under the glass trees. His daughter Nell\'s wrist has gone clear. The Watch says leave.' },
      { id: 'graves', when: { seen: 'eaves_j2:j2_graves' },
        text: 'Two graves under the glass trees, a woman\'s and a small one, the markers gone to glass.' },
      { id: 'lamp', when: { flag: 'q_family_lamp' },
        text: 'Averil, a sister of the Watch, gave us the great lamp\'s spare, a warding lamp, without the prior\'s leave. The tower has none now.' },
      { id: 'lit', when: { flag: 'q_family_lit' },
        text: 'The warding lamp hangs over Nell\'s bed, and her wrist has stopped. Garret keeps his graves.' },
      { id: 'promise', when: { flag: 'q_family_come' },
        text: 'Averil will ward the ground when the Watch can, and say the words over the graves herself. We carry that to Garret.' },
      { id: 'gone', when: { flag: 'q_family_gone' },
        text: 'Garret and Nell came over the bridge to the Watch. The cabin is shut, and a Lantern\'s grey is tied on the two stones.' },
    ],
    goals: [
      { when: { flag: 'q_family_come' }, at: 'eaves_j2', text: 'Tell Garret, at his cabin in the Eaves, the sister\'s promise.' },
      { when: { item: 'warding_lamp' }, at: 'eaves_j2', text: 'Take the warding lamp to Garret at his cabin in the Eaves.' },
      { when: { flag: 'q_family' }, text: 'Ask at the Watch about the glass: Averil, a sister, on the Lanternwood road by the dark lamp, or in the Lantern Hall.' },
    ],
  },
  {
    // Begun by Orm, or by the dam found or its gleaners killed first.
    id: 'dam',
    title: 'The Dammed Fall',
    start: [{ flag: 'q_dam' }, { seen: 'eaves_k2:k2_dam' }, { slain: 'eaves_k2:k2_dam' }],
    done: [{ flag: 'q_dam_broken' }, { flag: 'q_dam_kept' }],
    entries: [
      { id: 'orm', when: { flag: 'q_dam' },
        text: 'Orm, keeper of the shrine at Sunderfall, says the fall stopped in an hour, eleven days ago. Half a mile up the river, gleaners have dammed it to dry the ledges.' },
      { id: 'dam', when: { seen: 'eaves_k2:k2_dam' },
        text: 'A dam of new pine trunks and turf across the river where it leaves the pines, and gleaners on it.' },
      { id: 'hew', when: { slain: 'eaves_k2:k2_dam' },
        text: 'Hew, the gleaners\' foreman, sits on the dam\'s end with a tally of where every sack has gone. Break the dam, or leave it a season for the tally.' },
      { id: 'broken', when: { flag: 'q_dam_broken' },
        text: 'We pulled the pin. Sunderfall runs, and the gleaners are off the ledges below it.' },
      { id: 'kept', when: { flag: 'q_dam_kept' },
        text: 'We took the foreman\'s tally. Since the autumn the sacks go to the Point: Sheer Point wants all they can send.' },
    ],
    goals: [
      { when: { slain: 'eaves_k2:k2_dam' }, at: 'eaves_k2', text: 'Answer Hew on the dam\'s end: break it, or take the tally.' },
      { when: [{ flag: 'q_dam' }, { seen: 'eaves_k2:k2_dam' }], at: 'eaves_k2', text: 'Find the dam half a mile up the river from Sunderfall, where it leaves the pines.' },
    ],
  },
  {
    // Given once the papers are read, when the great lamp went out: by Averil, or by the wick found.
    id: 'watch_lamp',
    title: 'The Watch\'s Lamp',
    start: [{ flag: 'q_lamp' }, { seen: 'lantern_watch:lw_wick' }],
    done: LAMP_LIT,
    entries: [
      { id: 'dark', when: { flag: 'q_lamp' },
        text: 'The great lamp at the Watch\'s top went out the night the papers were read. Averil says the papers; the prior says the oil. She wants a stranger to count the casks and look at the lamp.' },
      { id: 'casks', when: { flag: 'q_lamp_casks' },
        text: 'Cuthwin counts eleven casks in the stores, the count since spring. Nothing has gone out but what is on the book.' },
      { id: 'wick', when: { seen: 'lantern_watch:lw_wick' },
        text: 'The great lamp\'s wick is cut clean across. Not burnt down. Cut.' },
      { id: 'exposed', when: { flag: 'q_lamp_exposed' },
        text: 'The prior cut the wick himself, to send the young away before the Regent came. We told Averil. She lit the lamp, and the hall is divided over him.' },
      { id: 'kept', when: { flag: 'q_lamp_kept' },
        text: 'We let it be. The prior spliced the wick and told Averil the oil came. He paid us with the Watch\'s map of the ledges.' },
    ],
    goals: [
      { when: { seen: 'lantern_watch:lw_wick' }, at: 'lantern_watch', text: 'Take what the wick shows to Prior Osric in the Watch\'s yard.' },
      { when: { flag: 'q_lamp' }, at: 'lantern_watch', text: 'Count the casks in the Watch\'s stores, and climb to the Lamp Gallery to look at the lamp.' },
    ],
  },
  {
    id: 'length',
    title: 'The Length of the Wall',
    start: { flag: 'q_wall' },
    done: [{ flag: 'q_wall_sold' }, { flag: 'q_wall_told' }],
    entries: [
      { id: 'brink', when: { flag: 'q_wall' },
        text: 'Wouter Brink, the Guild\'s surveyor on the Watch\'s west wall, came for a rubbing of the wall on the Sunder\'s floor, and there is nothing to rub. He wants its length instead.' },
      { id: 'east', when: { flag: 'q_wall_east' },
        text: 'East along the wall, the strip ends under fallen rock. The wall goes on behind it, warm.' },
      { id: 'both', when: WALL_WALKED,
        text: 'West and east the wall runs under the rock and does not end. There is no measure to give but that.' },
      { id: 'sold', when: { flag: 'q_wall_sold' },
        text: 'Brink wrote it as the Guild\'s: length unknown, continues both ways under rock, warm. He paid us for a quiet measure.' },
      { id: 'told', when: { flag: 'q_wall_told' },
        text: 'We told the Watch. The surveyor\'s six words are in the hall\'s book, and the hall argued them until the small hours.' },
    ],
    goals: [
      { when: WALL_WALKED, at: 'lantern_watch', text: 'Answer Brink on the Watch\'s west wall: sell the measure, or tell the Watch too.' },
      { when: { flag: 'q_wall' }, at: 'the_sunder2', text: 'Walk the wall on the Sunder\'s floor, west till it ends and east till it ends.' },
    ],
  },
];
