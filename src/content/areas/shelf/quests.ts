// The Foreland's quests, in the journal's words: The Quiet Farm (Vask) and The Cargo Ledger (Hale).
// How the words are keyed is in src/content/index.ts; tools/tests/quests.ts checks every key.
import type { QuestDef } from '../../../game/quests.ts';

export const QUESTS: readonly QuestDef[] = [
  {
    id: 'ashcombe',
    title: 'The Quiet Farm',
    start: { flag: 'q_ashcombe' },
    done: { flag: 'q_ashcombe_done' },
    entries: [
      { id: 'hired', when: { flag: 'q_ashcombe' },
        text: 'Lord Vask, the Regent-Warden, has hired us: the Ashcombe farm south of Helmstow has gone quiet. He wants anything we find there that is not a rat.' },
      { id: 'lantern', when: { seen: 'mill:mill_lantern' },
        text: 'A dead Lantern in the cellar under Ashcombe, a note in her hand: "Not failing. CUT. The Grove Stone is next. Tell Vask nothing."' },
      { id: 'wand', when: [{ item: 'survey_wand' }, { flag: 'q_ashcombe_done' }],
        text: 'We have a cracked survey wand, Lantern work.' },
      { id: 'rift', when: { seen: 'mill:mill_core' },
        text: 'Deep in the cellar, a Rift: a tear in the floor, breathing heat, and beside it a shard of worked Wardstone.' },
      { id: 'warden', when: { slain: 'mill:m_warden' },
        text: 'We killed the Rift Warden that kept the tear.' },
      { id: 'paid', when: { flag: 'q_ashcombe_done' },
        text: 'Vask turned the wand over for a long moment and pocketed it. If he knew it, his face did not say. He paid 300 gold.' },
    ],
    goals: [
      { when: { item: 'survey_wand' }, text: 'Take the survey wand to Lord Vask in Helmstow.' },
      { when: { visited: 'mill' }, text: 'Search the cellar under the Ashcombe farmhouse.' },
      { when: { flag: 'q_ashcombe' }, text: 'Find out why Ashcombe has gone quiet: south of Helmstow, then east along the Foreland road.' },
    ],
  },
  {
    id: 'greywater',
    title: 'The Cargo Ledger',
    start: { flag: 'q_greywater' },
    done: { flag: 'q_greywater_done' },
    entries: [
      { id: 'hale', when: { flag: 'q_greywater' },
        text: 'Captain Hale wants the smugglers in the caves at Brandy Hole cleared out, and their ledger. Until Brandy Hole and Ashcombe are both dealt with, his pass east stays shut.' },
      { id: 'den', when: { seen: 'greywater1:gw1_den' },
        text: 'In the captain\'s den, a letter on grey Ashen paper: "The Deacon wants the cargo below by the dark of the moon."' },
      { id: 'cells', when: { seen: 'greywater2:gw2_east' },
        text: 'Beneath the caves, a passage of cells with the bars rusted through. The cargo the smugglers brought down was people.' },
      { id: 'deacon', when: { slain: 'greywater2:gw2_deacon' },
        text: 'The Ashen Deacon is dead in the shrine, where someone had been prising the iron staples out of a glowing seam in the floor.' },
      { id: 'ledger', when: [{ item: 'greywater_ledger' }, { flag: 'q_greywater_done' }],
        text: 'We have the smugglers\' ledger.' },
      { id: 'paid', when: { flag: 'q_greywater_done' },
        text: 'Hale read the ledger and went grey: names, dates, and a column headed CARGO BELOW. He paid 400 gold, and will send the Regent-Warden a copy.' },
    ],
    goals: [
      { when: { item: 'greywater_ledger' }, text: 'Take the ledger to Captain Hale at the pass, east along the Foreland road.' },
      { when: { visited: 'greywater1' }, text: 'Clear out the smugglers and find their ledger.' },
      { when: { flag: 'q_greywater' }, text: 'Find the caves at Brandy Hole, west along the beach, and take the smugglers\' ledger.' },
    ],
  },
];
