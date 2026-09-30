// Thornmark's side quests, in the journal's words: The Lost Expedition, a subplot, and #56's six on
// the built maps (#219): A Coin Not From Caldera (Tegen), Leave the Trees Standing (Piran), The
// Dark Glass (Tamsin), The Elder's Four (Keyne), Terms From the Brigands and The Mender (Sylvane).
// Its chapter of the one quest is in ./chapter.ts. How the words are keyed is in src/content/area.ts (`quests`);
// tools/tests/quests.ts checks every key.
import type { QuestDef } from '../../../game/quests.ts';

export const QUESTS: readonly QuestDef[] = [
  {
    // The Lost Expedition (DESIGN.md 10.3) begins with the first of the Meridian Company's journals.
    // The rest of its trail is not built yet, so it has no `done` and stays open. Nothing takes the
    // journal (no hand-in asks for it and no shop buys it; tools/tests/quests.ts holds to that), so the item
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
  {
    // #56's ninth: the brigand's faceless coin, and the deserter who is paid in them. He walks and
    // says where they come from, or whistles up his band. The coin stays in the pack either way.
    id: 'coin',
    title: 'A Coin Not From Caldera',
    start: { flag: 'q_coin' },
    done: [{ flag: 'q_coin_walk' }, { flag: 'q_coin_fight', slain: 'thornmark:tm_deserters' }],
    entries: [
      { id: 'tegen', when: { flag: 'q_coin' },
        text: 'Tegen, keeper of the Split Oak, gave us a coin a brigand paid with: grey, faceless, and it will not tarnish. He is a Warden deserter camped north of the bridge.' },
      { id: 'camp', when: { seen: 'thornmark:tm_camp' },
        text: 'A camp in the trees off the Warden road, and a Warden cloak with its badge cut off.' },
      { id: 'walk', when: { flag: 'q_coin_walk' },
        text: 'Leofwin, once of Hale\'s post, carried tools up the Grove road for the coins. A man in Lantern grey pays for them at the charcoal stack. We let him walk.' },
      { id: 'fight', when: { flag: 'q_coin_fight' },
        text: 'Leofwin would not answer, and whistled up his band.' },
      { id: 'slain', when: { flag: 'q_coin_fight', slain: 'thornmark:tm_deserters' },
        text: 'Leofwin and his band are dead in the trees, and what the coin is for died with him.' },
    ],
    goals: [
      { when: { flag: 'q_coin_fight' }, text: 'Deal with Leofwin\'s band, in the trees north of the bridge.' },
      { when: { flag: 'q_coin' }, text: 'Find the deserter camped off the Warden road, north of the bridge, and ask where the coin comes from.' },
    ],
  },
  {
    // #56's fourteenth (#214): the survey team's orders, burnt in their camp over the Deepthorn's
    // edge. Idony carries them east to Lantern Watch, or hands them back for the Council.
    id: 'orders',
    title: 'How Did He Know',
    start: [{ flag: 'q_orders' }, { flag: 'q_orders_read' }],
    done: [{ flag: 'q_orders_watch' }, { flag: 'q_orders_council' }],
    entries: [
      { id: 'idony', when: { flag: 'q_orders' },
        text: 'Idony, a Lantern in travel-grey at the Split Oak, wants the survey team\'s orders. Their camp is south of the Grove, over the edge of the deep.' },
      { id: 'camp', when: { seen: 'deepthorn_h3:h3_survey' },
        text: 'The survey\'s camp: tents cut open, burnt paper in the fire-pit, and Wardens\' boot prints all round it.' },
      { id: 'orders', when: [{ item: 'survey_orders' }, { flag: 'q_orders_read' }, { flag: 'q_orders_watch' }, { flag: 'q_orders_council' }],
        text: 'The survey\'s orders, half burnt: dated three days before the Queen died, under the Regent\'s seal. Report what the seam does, and when.' },
      { id: 'watch', when: { flag: 'q_orders_watch' },
        text: 'Idony carries the orders east to Lantern Watch, where the order will split on them.' },
      { id: 'council', when: { flag: 'q_orders_council' },
        text: 'We kept the orders for the Council that will one day sit on the throne. Idony goes east with what is in her head.' },
    ],
    goals: [
      { when: { flag: 'q_orders_read' }, text: 'Answer Idony at the Split Oak: the orders to the Watch, or back to us?' },
      { when: { item: 'survey_orders' }, text: 'Take the survey\'s orders to Idony at the Split Oak, in Thornhold.' },
      { when: { flag: 'q_orders' }, text: 'Find the survey team\'s camp, south of the Grove over the edge of the deep, and their orders.' },
    ],
  },
  {
    // #56's fifteenth (#215): the lodge's hunters, shut in its cellar, who took the cutters' pay to
    // look away. Sylvane is told, and shuts her gate to them; or the lodge's secret is kept, and
    // Godric shows the hunters' path.
    id: 'hunters',
    title: 'The Hunters\' Bargain',
    start: { flag: 'q_hunters' },
    done: [{ flag: 'q_hunters_shut' }, { flag: 'q_hunters_kept' }],
    entries: [
      { id: 'cellar', when: { seen: 'deepthorn_i3:i3_cellar' },
        text: 'Deepthorn Lodge\'s yard is grown shut with brambles, and someone is behind its barred cellar door.' },
      { id: 'godric', when: { flag: 'q_hunters' },
        text: 'Godric, eldest of the lodge\'s hunters, was shut in its cellar a month. Men in grey with chisels paid the hunters to look away as they crossed the hills.' },
      { id: 'told', when: { flag: 'q_hunters_told' },
        text: 'We said Sylvane would hear it.' },
      { id: 'shut', when: { flag: 'q_hunters_shut' },
        text: 'Sylvane shut Thornhold\'s gate to the lodge until the Stone is whole. She does not thank us for telling her.' },
      { id: 'kept', when: { flag: 'q_hunters_kept' },
        text: 'We kept the lodge\'s secret. Godric showed us the hunters\' mark, three notches on an oak, and a path south the brambles do not cross.' },
    ],
    goals: [
      { when: { flag: 'q_hunters_told' }, text: 'Tell Elder Sylvane in Thornhold what the lodge\'s hunters did.' },
      { when: { flag: 'q_hunters' }, text: 'Answer Godric at the lodge: hold its secret, or tell Sylvane.' },
    ],
  },
  {
    // #56's tenth: a charcoal-burner felling the marked oaks on the Grove road, paid in faceless
    // coin by a Lantern in travel-grey. He goes before Sylvane, who banishes him, or home.
    id: 'trees',
    title: 'Leave the Trees Standing',
    start: [{ flag: 'q_trees' }, { flag: 'q_trees_ulf' }],
    done: [{ flag: 'q_trees_done' }, { flag: 'q_trees_home' }],
    entries: [
      { id: 'piran', when: { flag: 'q_trees' },
        text: 'Piran, woodward of Thornhold, says a charcoal-burner is felling the marked oaks on the Grove road. The Elder\'s peace keeps the elves from a man of the Crown\'s.' },
      { id: 'stack', when: { seen: 'thornmark:tm_stack' },
        text: 'A charcoal stack on the Grove road, and three oaks felled beside it, each with the chisel\'s mark on its stump.' },
      { id: 'ulf', when: { flag: 'q_trees_ulf' },
        text: 'Ulf, the burner, was paid in faceless coin by a Lantern in travel-grey to fell the marked oaks only.' },
      { id: 'banished', when: { flag: 'q_trees_done' },
        text: 'We took Ulf before Sylvane. She banished him over the Scarth, and wants us to remember who paid him.' },
      { id: 'home', when: { flag: 'q_trees_home' },
        text: 'We sent Ulf home to the Foreland. The Lantern who pays him is due again at the new moon.' },
    ],
    goals: [
      { when: { flag: 'q_trees_sylvane' }, text: 'Bring Ulf before Elder Sylvane in Thornhold.' },
      { when: { flag: 'q_trees_ulf' }, text: 'Decide Ulf\'s fate: the Elder in Thornhold, or home.' },
      { when: { flag: 'q_trees' }, text: 'Find the burner felling the marked oaks on the Grove road, south over the bridge.' },
    ],
  },
  {
    // #56's eleventh, after the Lanterns' Dark Marker: the dark marker's glass is full. Read, it
    // holds the cut and an older one, mended. Sylvane is told, or the Reader pays for the silence.
    id: 'glass',
    title: 'The Dark Glass',
    start: [{ flag: 'q_glass' }, { flag: 'q_glass_read' }],
    done: [{ flag: 'q_glass_told' }, { flag: 'q_glass_kept' }],
    entries: [
      { id: 'tamsin', when: { flag: 'q_glass' },
        text: 'Reader Tamsin, at the Chapterhouse, wants the glass from the dark marker on the lake\'s far shore. A marker\'s glass records; dark may mean it is full.' },
      { id: 'shore', when: { seen: 'thornmark:tm_far_shore' },
        text: 'On the far shore the marker\'s glass is not dark but black, the way a full inkwell is black.' },
      { id: 'read', when: { flag: 'q_glass_read' },
        text: 'Read at the Chapterhouse, the glass holds the night the Stone was cut, and under it an older cut, mended over a winter before Sylvane was Elder.' },
      { id: 'told', when: { flag: 'q_glass_told' },
        text: 'We told Sylvane. She remembers the winter, and sends us to the treaty in Henlys, whose seal bears the chisel\'s mark.' },
      { id: 'kept', when: { flag: 'q_glass_kept' },
        text: 'We kept the Reader\'s silence, and she paid for it with a Sapphire Vial.' },
    ],
    goals: [
      { when: { flag: 'q_glass_truth' }, text: 'Tell Elder Sylvane what the glass held.' },
      { when: { flag: 'q_glass_read' }, text: 'Answer Reader Tamsin at the Chapterhouse: what will Sylvane be told?' },
      { when: { flag: 'q_glass' }, text: 'Take the glass from the marker on the lake\'s far shore to Reader Tamsin at the Chapterhouse.' },
    ],
  },
  {
    // #56's twelfth: the four who went under the roots. Three are dead; the fourth, alive in grey,
    // asks to be told dead. Keyne hears the truth or the lie, and the rite is held either way.
    id: 'four',
    title: 'The Elder\'s Four',
    start: { flag: 'q_four' },
    done: { flag: 'q_four_done' },
    entries: [
      { id: 'keyne', when: { flag: 'q_four' },
        text: 'Keyne, whose son Ruan went under the roots, wants the four who went down found, so the hold can fetch them for the rite.' },
      { id: 'stair', when: { seen: 'grove1:g1_stairs' },
        text: 'By the stair in the roots, a dead elf in Thornhold green, her hands burned to the wrist.' },
      { id: 'ruan', when: { seen: 'grove1:g1_ruan' },
        text: 'In the roots\' west half, a dead elf of nineteen, his bow still strung.' },
      { id: 'mylor', when: { seen: 'grove1:g1_mylor' },
        text: 'Past the iron door, a third dead in green, his hands burned.' },
      { id: 'meva', when: [{ flag: 'q_four_truth' }, { flag: 'q_four_lie' }],
        text: 'Meva, the fourth, is alive, in grey. She put her hands up, and asked us to tell her mother she died by the stair.' },
      { id: 'truth', when: { flag: ['q_four_truth', 'q_four_done'] },
        text: 'We told Keyne the truth. The hold will hold the rite for four.' },
      { id: 'lie', when: { flag: ['q_four_lie', 'q_four_done'] },
        text: 'We told Keyne that Meva died by the stair, quick. The hold will fetch its dead at the dark of the moon.' },
    ],
    goals: [
      { when: [{ flag: 'q_four_truth' }, { flag: 'q_four_lie' }], text: 'Tell Keyne, by Thornhold\'s spring, where the four are.' },
      { when: { flag: 'q_four' }, text: 'Find the four who went under the roots, beneath the Grove.' },
    ],
  },
  {
    // #56's seventeenth: the brigands are Foreland farmers driven off by the Regent's requisitions.
    // Their terms are carried, and the road's brigands stop coming; or refused, and they come in
    // the snow.
    id: 'terms',
    title: 'Terms From the Brigands',
    start: { flag: 'q_terms' },
    done: [{ flag: 'q_terms_taken' }, { flag: 'q_terms_refuse' }],
    entries: [
      { id: 'sylvane', when: { flag: 'q_terms' },
        text: 'The brigands on the Warden road offered Sylvane terms: the road left alone, if Thornhold takes them in for the winter. She sent their woman back.' },
      { id: 'camp', when: { seen: 'thornmark:tm_thora_camp' },
        text: 'Their camp is lean-tos of Foreland thatch, a plough without an ox, and children.' },
      { id: 'thora', when: [{ flag: 'q_terms_carry' }, { flag: 'q_terms_refuse' }],
        text: 'Thora leads them: Aldwick, Stanton and Hurst, driven off by the Regent\'s requisitions.' },
      { id: 'taken', when: { flag: 'q_terms_taken' },
        text: 'We carried the terms. Sylvane did not say yes: she said the north wall, until the thaw. The road is quiet.' },
      { id: 'refused', when: { flag: 'q_terms_refuse' },
        text: 'We told Thora no. When the snow is on the road, her people will be on it too.' },
    ],
    goals: [
      { when: { flag: 'q_terms_carry' }, text: 'Carry Thora\'s terms to Elder Sylvane in Thornhold.' },
      { when: { flag: 'q_terms' }, text: 'Find the brigands\' camp off the Warden road, north-east of the sign.' },
    ],
  },
  {
    // #56's eighteenth: the Lantern Sylvane sent for, her kit taken by zealots. With it back she
    // mends the cut once the tear is shut, and the company carries a sliver, or leaves it.
    id: 'mender',
    title: 'The Mender',
    start: [{ seen: 'thornmark:tm_mender_camp' }, { flag: 'q_mender' }],
    done: [{ flag: 'q_mender_sliver' }, { flag: 'q_mender_left' }],
    entries: [
      { id: 'camp', when: { seen: 'thornmark:tm_mender_camp' },
        text: 'On the Grove road, a Lantern\'s camp turned over, and straps cut where something heavy was carried off.' },
      { id: 'edith', when: { flag: 'q_mender' },
        text: 'Edith, Reader of the Guildhall, was sent for to mend the Stone. Men in grey took her kit to their camp in the lee of the Grove\'s hollow.' },
      { id: 'kit', when: { flag: 'q_mender_kit' },
        text: 'Edith has her kit back, unopened. She goes under once the tear is shut, and not before.' },
      { id: 'mended', when: { flag: 'q_mender_done' },
        text: 'Edith mended the Grove Stone in a night. She says the Lanterns are split about Vask.' },
      { id: 'sliver', when: { flag: 'q_mender_sliver' },
        text: 'We carry a sliver of the Stone that hums.' },
      { id: 'left', when: { flag: 'q_mender_left' },
        text: 'We left the sliver with the Stone, by the book.' },
    ],
    goals: [
      { when: { flag: 'q_mender_done' }, text: 'Answer Edith, by the Grove Stone: the sliver, or the book.' },
      { when: { flag: 'q_mender_kit', slain: 'grove2:g2_warden' }, text: 'Edith waits by the Grove Stone, under the roots.' },
      { when: { flag: 'q_mender_kit' }, text: 'Shut the tear under the Grove, so Edith can go under and mend the Stone.' },
      { when: { item: 'mending_kit' }, text: 'Take the kit to Edith, in the Grove\'s hollow.' },
      { when: { flag: 'q_mender' }, text: 'Find Edith\'s kit at the zealots\' camp, in the lee of the Grove\'s hollow.' },
      { when: { seen: 'thornmark:tm_mender_camp' }, text: 'Find the Lantern whose camp was turned over on the Grove road.' },
    ],
  },
];
