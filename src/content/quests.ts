// The quest log's words: what the company's journal says about each quest as it moves, and what to
// do next. Each entry is keyed to something the save already records (a flag an NPC sets, an item
// carried, a once-only event, a guardian killed, a map set foot on), so the log needs no state of
// its own. tools/test.ts checks every key points at something real and every page fits the screen.
import type { QuestDef } from '../game/quests.ts';

export const QUESTS: readonly QuestDef[] = [
  {
    id: 'ashcombe',
    title: 'The Quiet Farm',
    start: { flag: 'q_ashcombe' },
    done: { flag: 'q_ashcombe_done' },
    entries: [
      { id: 'hired', when: { flag: 'q_ashcombe' },
        text: 'Lord Vask, the Regent-Warden, has hired us: the Ashcombe farm south of Harrow has gone quiet. He wants anything we find there that is not a rat.' },
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
      { when: { item: 'survey_wand' }, text: 'Take the survey wand to Lord Vask in Harrow.' },
      { when: { visited: 'mill' }, text: 'Search the cellar under the Ashcombe farmhouse.' },
      { when: { flag: 'q_ashcombe' }, text: 'Find out why Ashcombe has gone quiet: south of Harrow, then east along the Shelf road.' },
    ],
  },
  {
    id: 'greywater',
    title: 'The Greywater Ledger',
    start: { flag: 'q_greywater' },
    done: { flag: 'q_greywater_done' },
    entries: [
      { id: 'hale', when: { flag: 'q_greywater' },
        text: 'Captain Hale wants the smugglers in the Greywater caves cleared out, and their ledger. Until Greywater and Ashcombe are both dealt with, his pass east stays shut.' },
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
      { when: { item: 'greywater_ledger' }, text: 'Take the ledger to Captain Hale at the pass, east along the Shelf road.' },
      { when: { visited: 'greywater1' }, text: 'Clear out the smugglers and find their ledger.' },
      { when: { flag: 'q_greywater' }, text: 'Find the Greywater caves, west along the beach, and take the smugglers\' ledger.' },
    ],
  },
  {
    // Vask sets the party on the Stone when he takes the wand; Sylvane, in Thornhold, is the one who
    // takes the chisel. One quest, two voices, and the journal says which is which.
    id: 'grove',
    title: 'The Grove Stone',
    start: [{ flag: 'q_ashcombe_done' }, { flag: 'q_grove' }],
    done: { flag: 'q_grove_done' },
    entries: [
      { id: 'lead', when: { flag: 'q_ashcombe_done' },
        text: 'Vask has more work: the Grove Stone in Thornmark has gone quiet too. He wants to know why, and to see what we find.' },
      { id: 'pass', when: { flag: ['q_ashcombe_done', 'q_greywater_done'] },
        text: 'With Ashcombe and Greywater dealt with, the Wardens have opened the pass to Thornmark.' },
      { id: 'sylvane', when: { flag: 'q_grove' },
        text: 'Elder Sylvane of Thornhold says the Stone did not fail. It was cut, by hands, with tools, and she wants the tool that cut it.' },
      { id: 'stone', when: { seen: 'grove2:g2_stone' },
        text: 'Under the roots stands the Grove Stone, a hand-span of it cut clean away, and the air torn where the cut is.' },
      { id: 'chisel', when: [{ item: 'ashen_chisel' }, { flag: 'q_grove_done' }],
        text: 'The Hand of Ash lies dead at the foot of the Stone, and we have the chisel that cut it.' },
      { id: 'tear', when: { slain: 'grove2:g2_warden' },
        text: 'The Warden of the Cut is dead and the tear has closed. The cut stays; it will need a Lantern to mend.' },
      { id: 'paid', when: { flag: 'q_grove_done' },
        text: 'Sylvane read the chisel\'s runes: Underdeep, and a maintenance mark, not a prayer. Whoever arms the Ashen Hand can reach the Underdeep. She paid 1500 gold, and warned us to keep it from Vask.' },
    ],
    goals: [
      { when: { item: 'ashen_chisel', flag: 'q_grove' }, text: 'Take the chisel to Elder Sylvane in Thornhold.' },
      { when: { item: 'ashen_chisel' }, text: 'Find someone in Thornhold who knows the Grove Stone.' },
      { when: { flag: 'q_grove' }, text: 'Go down under the Grove, south over the bridge, and find the tool that cut the Stone.' },
      { when: { visited: 'thornmark' }, text: 'Find the Grove Stone. The Grove is south over the bridge; Thornhold is north-east.' },
      { when: { flag: ['q_ashcombe_done', 'q_greywater_done'] }, text: 'Take the pass at the east end of the Shelf road into Thornmark.' },
      { when: { flag: 'q_ashcombe_done' }, text: 'Deal with Greywater, so that Captain Hale opens the pass east to Thornmark.' },
    ],
  },
  {
    // The Lost Expedition (DESIGN.md 10.3) begins with the first of the Meridian Company's journals.
    // The rest of its trail is not built yet, so it has no `done` and stays open. Nothing takes the
    // journal (no hand-in asks for it and no shop buys it; tools/test.ts holds to that), so the item
    // alone keeps the entry written.
    id: 'meridian',
    title: 'The Lost Expedition',
    start: { item: 'meridian_journal' },
    entries: [
      { id: 'journal', when: { item: 'meridian_journal' },
        text: 'Where the Warden of the Cut fell lay the first volume of the Meridian Company\'s journal. The Company went down to map the Underdeep thirty years ago, and never came back.' },
    ],
    goals: [
      { when: { item: 'meridian_journal' }, text: 'Find the other volumes of the Meridian journal.' },
    ],
  },
];
