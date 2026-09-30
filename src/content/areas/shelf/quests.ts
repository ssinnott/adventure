// The Foreland's side quests, in the journal's words: The Cargo Ledger (Hale), The Bell That
// Rang Twice (Osmund), The Rest of the Survey (Ebba and Ailith), The Clerk's Seal (Maud), The
// Well Tastes of Iron (Mottram), A Boat With No Name-Board (Wat and Hamo, at Gullwick), Who
// Lived at Ashcombe (Hob) and Oil for the Lamp (Aldred at Crowness Light, Mottram and Vask). Its
// chapter of the one quest is in ./chapter.ts. How the words are keyed is in src/content/area.ts
// (`quests`); tools/tests/quests.ts checks every key.
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
  {
    // #56's third: grit in Helmstow's well, and a Warden mason carting stone dust out of the Regent's
    // works under the keep by night. Mottram asks who the company will tell: the Wardens or the Lanterns.
    id: 'well',
    title: 'The Well Tastes of Iron',
    start: { flag: 'q_well' },
    done: [{ flag: 'q_well_wardens' }, { flag: 'q_well_lanterns' }],
    entries: [
      { id: 'mottram', when: { flag: 'q_well' },
        text: 'Helmstow\'s well has tasted of iron since the week the Queen died. Mottram says the grit in it is stone dust, and none he knows; the cistern behind Ellerby is sweet.' },
      { id: 'alwin', when: { flag: 'q_well_alwin' },
        text: 'Alwin, a Warden mason, carts the dust out of the gatehouse by night. The Regent is opening an old way under the keep, and the old cut runs under the well.' },
      { id: 'wardens', when: { flag: 'q_well_wardens' },
        text: 'We said we would tell the Wardens. Their mason, their works and their well: they will see to it.' },
      { id: 'lanterns', when: { flag: 'q_well_lanterns' },
        text: 'We said we would tell the Lanterns. The Chapel will write it down, with the hours and the bells.' },
    ],
    goals: [
      { when: { flag: ['q_well', 'q_well_alwin'] }, text: 'Take what the mason said back to Mottram\'s Stores.' },
      { when: { flag: 'q_well', seen: 'harrow:well_cart' }, text: 'Find who drives the cart with no lamp that leaves the gatehouse by night.' },
      { when: { flag: 'q_well' }, text: 'Find where the stone dust in Helmstow\'s well comes from.' },
    ],
  },
  {
    id: 'board',
    title: 'A Boat With No Name-Board',
    start: [{ flag: 'q_board' }, { item: 'name_boards' }],
    done: [{ flag: 'q_board_home' }, { flag: 'q_board_sold' }],
    entries: [
      { id: 'wat', when: { flag: 'q_board' },
        text: 'Wat, Gullwick\'s boat-builder, wants the Patience\'s name-board off the wreckers\' beach before it goes on a fire. He says to go by night.' },
      { id: 'hoard', when: [{ item: 'name_boards' }, { flag: 'q_board_home' }, { flag: 'q_board_sold' }],
        text: 'Under sailcloth on the far beach, the wreckers\' hoard: name-boards stacked like slates, the Patience\'s among them.' },
      { id: 'chit', when: [{ item: 'customs_chit' }, { flag: 'q_board_home' }, { flag: 'q_board_sold' }],
        text: 'With them, a chit under the Helmstow customs seal: boards fourteen, passed as salvage, duty paid.' },
      { id: 'home', when: { flag: 'q_board_home' },
        text: 'The boards went home to Gullwick. Wat found a chisel\'s marks on the Patience\'s: she was not wrecked but taken, and his boys with her.' },
      { id: 'sold', when: { flag: 'q_board_sold' },
        text: 'We sold the boards to Hamo, the Compact\'s buyer on the Salt Road, by the plank.' },
    ],
    goals: [
      { when: { item: 'name_boards' }, at: 'downs_f3', text: 'Take the name-boards across the Wend to Gullwick, or sell them.' },
      { when: { flag: 'q_board' }, at: 'downs_f3', text: 'Find the Patience\'s name-board on the wreckers\' beach, across the Wend from Gullwick. Go by night.' },
    ],
  },
  {
    // #56's fifth: Crowness Light dark since the Wardens stopped its oil. Mottram asks whether the
    // company buys the oil and carries it down, or puts it to Vask; oil carried in lights it either way.
    id: 'oil',
    title: 'Oil for the Lamp',
    start: { flag: 'q_oil' },
    done: { flag: 'q_oil_lit' },
    entries: [
      { id: 'aldred', when: { flag: 'q_oil' },
        text: 'Crowness Light has been dark since the week the Queen died. The Lanterns\' cart stopped bringing its oil, with no letter to say why.' },
      { id: 'buy', when: { flag: 'q_oil_buy' },
        text: 'Mottram stopped the oil on a Warden sergeant\'s paper: Regent\'s orders. He will sell us a flask at forty, and his name is not on it.' },
      { id: 'vask', when: { flag: 'q_oil_vask' },
        text: 'Mottram stopped the oil on a Warden sergeant\'s paper: Regent\'s orders. We said we would put it to Vask.' },
      { id: 'order', when: { flag: 'q_oil_order' },
        text: 'Vask called it an order given in the confusion of that week, and lifted it. The cart goes down on the first of the month.' },
      { id: 'lit', when: { flag: 'q_oil_lit' },
        text: 'Crowness Light burns again, and the Lanterns\' cart comes back on the first of the month.' },
    ],
    goals: [
      { when: { item: 'lantern_oil' }, at: 'downs_e3', text: 'Carry the Lantern Oil down to Aldred at Crowness Light.' },
      { when: { flag: 'q_oil_vask' }, at: 'keep', text: 'Put the keeper\'s oil to Lord Vask, in the keep at Helmstow.' },
      { when: { flag: 'q_oil_buy' }, at: 'harrow', text: 'Buy a flask of Lantern Oil at Mottram\'s Stores in Helmstow, and carry it down to Crowness Light.' },
      { when: { flag: 'q_oil' }, at: 'harrow', text: 'Ask at Mottram\'s Stores in Helmstow why the oil stopped coming to Crowness Light.' },
    ],
  },
  {
    // #56's second: Hob, once tenant of Ashcombe, who let his cellar to the Ashen and did not ask. His
    // paper goes to Vask, and he is not seen again, or to Hale, who sends him to Gullwick. A company
    // that brings him his key before it has heard him begins it there.
    id: 'tenant',
    title: 'Who Lived at Ashcombe',
    start: [{ flag: 'q_ashcombe_who' }, { flag: 'q_hob_key' }],
    done: [{ flag: 'q_paper_vask' }, { flag: 'q_paper_hale' }],
    entries: [
      { id: 'hob', when: { flag: 'q_ashcombe_who' },
        text: 'Hob, by the Hearthlight\'s fire, had the tenancy of Ashcombe. His people went away, he says, and the land never paid the rent.' },
      { id: 'kitchen', when: { seen: 'downs_e3:ash_kitchen' },
        text: 'In the Ashcombe kitchen, the hearth-key on its nail and the hearth below it swept. Nobody flees a house and sweeps it first.' },
      { id: 'key', when: { flag: 'q_hob_key' },
        text: 'Hob let the cellar under Ashcombe to three in grey for twenty gold, and sent his family to Gullwick when the singing came up through the floor.' },
      { id: 'paper', when: [{ item: 'tenant_paper' }, { flag: 'q_paper_vask' }, { flag: 'q_paper_hale' }],
        text: 'Under the flour crock, the paper that let the cellar, with a tenant\'s cross at its foot. On the back: THE HEARTH IS A CAGE.' },
      { id: 'vask', when: { flag: 'q_paper_vask' },
        text: 'We gave the paper to Vask. The Crown will see the matter closed, and Ashcombe will have a new tenant by spring.' },
      { id: 'hale', when: { flag: 'q_paper_hale' },
        text: 'We gave the paper to Captain Hale. Hob goes to his wife\'s people at Gullwick, and stays there until Hale says.' },
    ],
    goals: [
      { when: { item: 'tenant_paper' }, text: 'Take the paper to Vask in the keep, or to Captain Hale at the pass.' },
      { when: { flag: 'q_hob_key' }, text: 'Hob let his cellar and sent his family away. Look again around the Ashcombe farmhouse.' },
      { when: { item: 'hearth_key' }, text: 'Take the hearth-key to Hob, by the Hearthlight\'s fire.' },
      { when: { flag: 'q_ashcombe_who' }, text: 'Find out where Hob\'s people went. Ashcombe is past Gullwick, across the Wend.' },
    ],
  },
];
