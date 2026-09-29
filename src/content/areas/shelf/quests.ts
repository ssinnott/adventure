// The Foreland's side quests, in the journal's words: The Cargo Ledger (Hale), The Bell That Rang
// Twice (Osmund), The Rest of the Survey (Ebba and Ailith) and The Clerk's Seal (Maud). Its chapter of the
// one quest is in ./chapter.ts. How the words are keyed is in src/content/area.ts (`quests`);
// tools/tests/quests.ts checks every key.
import type { QuestDef } from '../../../game/quests.ts';

export const QUESTS: readonly QuestDef[] = [
  {
    id: 'greywater',
    title: 'The Cargo Ledger',
    start: { flag: 'q_greywater' },
    done: { flag: 'q_greywater_done' },
    entries: [
      { id: 'hale', when: { flag: 'q_greywater' },
        text: 'Captain Hale wants the smugglers in the caves at Brandy Hole cleared out, and their ledger. His pass east to Thornmark is open, and he warns every company through it.' },
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
  {
    // #56's first: who rang the Queen's death bell at midnight. The name goes to Osmund's book, or
    // does not; the Wardens take Ebba, or she keeps the Chapel's lamps.
    id: 'bell',
    title: 'The Bell That Rang Twice',
    start: { flag: 'q_bell' },
    done: [{ flag: 'q_bell_named' }, { flag: 'q_bell_kept' }],
    entries: [
      { id: 'osmund', when: { flag: 'q_bell' },
        text: 'Osmund, sexton of the Chapel, wants a name for his book: whoever rang the Queen\'s death bell at midnight, hours before anyone knew she was dead.' },
      { id: 'boats', when: { flag: 'q_bell_boats' },
        text: 'A fisherman at the Gilded Eel heard the bell at midnight, hauling his net.' },
      { id: 'wall', when: { flag: 'q_bell_wall' },
        text: 'A Warden on the wall saw someone in grey leave the tower after the bell and go down towards the Eel.' },
      { id: 'ebba', when: { flag: 'q_bell_ebba' },
        text: 'Ebba, a Lantern adjunct at the Eel, rang it. The Hearth burns for the Crown, the catechism says; she watched it go out, and knew.' },
      { id: 'named', when: { flag: 'q_bell_named' },
        text: 'We gave Osmund her name for his book. The Wardens will want her at the keep.' },
      { id: 'kept', when: { flag: 'q_bell_kept' },
        text: 'We told Osmund we could not find out. He wrote RANG ITSELF, and shut the book.' },
    ],
    goals: [
      { when: { flag: 'q_bell_ebba' }, text: 'Tell Osmund at the Chapel whose hand was on the rope, or that we could not find out.' },
      { when: { flag: ['q_bell_boats', 'q_bell_wall'] }, text: 'Someone in grey went down towards the Gilded Eel that night. Ask there.' },
      { when: { flag: 'q_bell' }, text: 'Ask in Helmstow who rang the bell: at the Gilded Eel, and on the wall by the Chapel.' },
    ],
  },
  {
    // #56's eighth: Ailith of the survey team, hiding in the woods. Ebba asks after her, or the woods
    // show where she is; she goes to the Chapel, or to Thornhold.
    id: 'survey',
    title: 'The Rest of the Survey',
    start: [{ seen: 'shelf:survey_ring' }, { flag: 'q_survey' }, { flag: 'q_ailith' }],
    done: [{ flag: 'q_survey_chapel' }, { flag: 'q_survey_thornhold' }],
    entries: [
      { id: 'ebba', when: { flag: 'q_survey' },
        text: 'Ebba, a Lantern adjunct, says four of the survey team went south before the Queen died, and one lies dead under Ashcombe. She wants word of Ailith, who would hide in a wood.' },
      { id: 'ring', when: { seen: 'shelf:survey_ring' },
        text: 'In the woods south-west of Helmstow: a scrap of Lantern grey on a thorn, and a fire-ring hidden from its own smoke.' },
      { id: 'ailith', when: { flag: 'q_ailith' },
        text: 'Ailith, adjunct of the survey, is alive and hiding from the Wardens. The Regent sent the survey to Ashcombe under his seal, before the Queen died.' },
      { id: 'chapel', when: { flag: 'q_survey_chapel' },
        text: 'We sent Ailith home to the Chapel in Helmstow.' },
      { id: 'thornhold', when: { flag: 'q_survey_thornhold' },
        text: 'We sent Ailith over the Scarth to Thornhold, where nobody is looking for her.' },
    ],
    goals: [
      { when: { flag: 'q_ailith' }, text: 'Tell Ailith where to go: the Chapel in Helmstow, or Thornhold over the Scarth.' },
      { when: { flag: 'q_survey' }, text: 'Look for Ailith in the woods south-west of Helmstow, off the road.' },
      { when: { seen: 'shelf:survey_ring' }, text: 'Find whoever lit the fire-ring in the woods south-west of Helmstow, and hid from its smoke.' },
    ],
  },
  {
    // #56's seventh: Edwin the clerk, drowned in Brandy Hole, and his seal in the captain's
    // strongbox. It goes to his wife, who sells it back, or to Hale, who sends it to the Regent.
    id: 'seal',
    title: 'The Clerk\'s Seal',
    start: { flag: 'q_seal' },
    done: [{ flag: 'q_seal_maud' }, { flag: 'q_seal_hale' }],
    entries: [
      { id: 'maud', when: { flag: 'q_seal' },
        text: 'Maud, at the Gilded Eel, wants word of her husband Edwin, a customs clerk who went down to Brandy Hole nine days ago; and his seal, if it comes to that.' },
      { id: 'coat', when: { seen: 'greywater1:gw1_coat' },
        text: 'Among the drowned in Brandy Hole, a clerk\'s black coat with the customs badge at its collar. The thong where a seal would hang is cut.' },
      { id: 'seal', when: [{ item: 'clerks_seal' }, { flag: 'q_seal_maud' }, { flag: 'q_seal_hale' }],
        text: 'In the smuggler captain\'s strongbox, a customs seal, brass on boxwood, worn bright.' },
      { id: 'sold', when: { flag: 'q_seal_maud' },
        text: 'We gave Maud the seal. The customs house will pay to have it back and ask nothing, and Edwin\'s name stays a clerk\'s name.' },
      { id: 'hale', when: { flag: 'q_seal_hale' },
        text: 'We gave the seal to Captain Hale. It goes to the Regent beside the smugglers\' ledger.' },
    ],
    goals: [
      { when: { item: 'clerks_seal' }, text: 'Take the seal to Maud at the Gilded Eel, or to Captain Hale at the pass.' },
      { when: { flag: 'q_seal', seen: 'greywater1:gw1_coat' }, text: 'Edwin drowned in Brandy Hole. Find what he had on him.' },
      { when: { flag: 'q_seal' }, text: 'Find Edwin, or find out what became of him, in the caves at Brandy Hole, west along the beach.' },
    ],
  },
];
