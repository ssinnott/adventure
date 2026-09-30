// Thornmark: old forest east of the Foreland, reached through the mountain pass.
// Thornhold in the north-east, a ruined Warden watchtower in the north-west, a barrow on the
// eastern hills, a river with one bridge, and the Grove in the deep woods to the south-west.
// Difficulty band 5-10.
import type { MapDef } from '../../../../game/map.ts';
import { EAST, NORTH, SOUTH, WEST } from '../../../../game/types.ts';
import type { When } from '../../../../game/quests.ts';
import { TEAR_CLOSED } from './grove2.ts';

/** Thornhold takes Thora's people in (#219): past it the road's brigands stop coming. */
const TERMS_TAKEN: When = { flag: 'q_terms_taken' };

export const THORNMARK: MapDef = {
  id: 'thornmark',
  name: 'Thornmark',
  kind: 'outdoor',
  density: 'core',
  band: [5, 10],
  region: 'thornmark',
  start: { x: 1, y: 9, facing: EAST },
  palette: { floor: '#3f8a34', banner: '#2a6a3a' },
  rows: [
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'M,,T,,,,,,,,,,,,,,,,,,,,,,,,,,,M',
    'M,,,,,TT,,,,,,,,,,,,,BBBBB,,,T,M',
    'M,T,,,TTT,,,,,,,,,,,,BBBBB,,,,,M',
    'M,,,BB,T,,,,,,,,,,,,,BB=BB,,T,,M',
    'M,,,BB,,,,,,,,,,,,,,,,,=,,,,,,,M',
    'M,r,,,,,,,,,,,,,,,,,,,,=,,,,,,,M',
    'M,rr,,,,,,,,,,,,,,,,,,,=,,,rr,,M',
    'M,,r,,,,,,,,,,==========,,,rrr,M',
    '==============,,,,,,,,,,,,,,r,,M',
    'M,,,,,,,,,,,,==================M',
    'M,TT,,,,,,,,,=,,,,,,,,,,,,,,,,,M',
    'M,TTT,,,,,,,,=,,,,,T,,,,,,,,,,,M',
    'M,,TT,,,,,,,,=,,,,TTT,,,,,,,,,,M',
    'M,,,,,,,,,,,,=,,,,,T,,,,,,,,,,,M',
    'M,,,,,,,,,,,,=,,,,,,,,,,,,,,,,,M',
    'M,,,,,,,,,,,,=,,,,,,,,,,,,,,,,,M',
    'M,,,,,,,,,,,,=,,,,,,,,,,,,,,,,,M',
    'M~~~~~~~~~~~~=~~~~~~~~~~~~~~~~~M',
    'M,,,,,,,,,,,,=,,,,,,,,,,,,,,,,,M',
    'M,,,,,,,,,,,,=,,,,,,,,,,,,,,,~~M',
    'M,,,,,,,,,,,,=,,,,,,,,,,,,,,~~~M',
    'M,,T,,,,,,,,,=,,,,,,,,,,,,,~~~~M',
    'M,TTT,,,,,,,,=,,,,,,,,,,,,,,~~~M',
    'M,TTTT,,======,,,,,,,,,,,,,,,,,M',
    'M,TT,,,=,,,,,,,,,,,,,,,,,,,,,,,M',
    'M,T,,,,=,,,,,,,,,,,rr,,,,,,,,,,M',
    'M,,,,,,=,,,,,,,,,,,r,,,,,,,,,,,M',
    'M,,TTT,=,TTT,,,,,,,,,,,,,,,,,,,M',
    'M,TTTTT==TTTT,,,,,,,,,,,,,,,,,,M',
    'M,TTTTTT=TTTT,,,,,,,,,,,,,,,,,,M',
    'MMMMMMMM=MMMMMMMMMMMMMMMMMMMMMMM',
  ],
  exits: [
    { x: 0, y: 9, to: 'shelf', tx: 30, ty: 9, tf: WEST, label: 'Back through the pass to the Foreland.' },
    { x: 23, y: 4, to: 'thornhold', tx: 7, ty: 14, tf: NORTH, label: 'You pass under the oak gate of Thornhold.' },
    { x: 7, y: 29, to: 'grove1', tx: 1, ty: 1, tf: SOUTH, label: 'Steps cut into the roots lead down beneath the Grove.' },
    // The elves' road south out of the hollow, into the Deepthorn (#214).
    { x: 8, y: 31, to: 'deepthorn_h3', tx: 8, ty: 1, tf: SOUTH, label: 'The Deepthorn. Past the Grove the road is the elves\', and the oaks are older than the elves.' },
  ],
  features: [
    { kind: 'event', x: 1, y: 9, id: 'thornmark_in', once: true, text: 'Thornmark. The trees here are older than Helmstow, and the Warden road under them has not been swept in weeks.' },
    { kind: 'sign', x: 13, y: 9, text: 'North-east: Thornhold. South, over the bridge: the Grove. Wardens turn back here.' },
    { kind: 'sign', x: 13, y: 19, text: 'The Grove. By order of the Elder, none but Lanterns past this bridge.' },
    { kind: 'sign', x: 23, y: 5, text: 'Thornhold. Elves and honest folk welcome. Leave the trees standing.' },
    { kind: 'event', x: 5, y: 6, id: 'tower', once: true, text: 'The old Warden watchtower, roofless. Something large has made a den in its base; the bones outside are not all animal.' },
    { kind: 'chest', x: 6, y: 5, id: 'tm_tower', gold: 180, items: ['warhammer+1', 'elixir', 'lantern_oil'] },
    { kind: 'event', x: 26, y: 8, id: 'barrow', once: true, text: 'A barrow, its door-stone rolled aside from within. The grass around it is dead in a ring.' },
    { kind: 'chest', x: 23, y: 1, id: 'tm_strongbox', gold: 120, items: ['potion_heal', 'potion_heal'] },
    { kind: 'chest', x: 30, y: 9, id: 'tm_barrow', gold: 260, items: ['rune_dagger+1', 'potion_sp_great'] },
    { kind: 'event', x: 13, y: 24, id: 'grove_road', once: true, text: 'The road narrows and the oaks lean in over it. Every trunk on this stretch carries a chisel mark at shoulder height.' },
    { kind: 'event', x: 7, y: 25, id: 'grove_edge', once: true, text: 'The trees close in. Ahead the road ends in a hollow ringed with oaks: the Grove. The air hums, faintly, the way the cellar under Ashcombe did.' },
    { kind: 'event', x: 21, y: 27, id: 'second_marker', once: true, text: 'A Lantern survey marker, half-sunk in the grass among the rocks. Its glass is lit, and warm to the touch.' },
    { kind: 'event', x: 26, y: 22, id: 'lake', once: true, text: 'A still lake. On the far shore, half-sunk, a Lantern survey marker with its glass gone dark.' },
    // The side quests (#219); their givers are in Thornhold.
    // A Coin Not From Caldera: Leofwin's camp in the trees north of the bridge, and him there once
    // Tegen has sent the company; his answer sends him off, or brings his band.
    { kind: 'event', x: 16, y: 15, id: 'tm_camp', once: true, until: [{ flag: 'q_coin_walk' }, { flag: 'q_coin_fight', slain: 'thornmark:tm_deserters' }], text: 'A camp in the trees: a fire, a lean-to, and a Warden cloak with the badge cut off, hung up to dry.' },
    { kind: 'npc', x: 17, y: 15, name: 'Leofwin, once of Hale\'s post', lines: [
      'A man in a brigand\'s coat over Warden breeches looks up from the fire, sees six of you, and does not reach for anything; he has been a soldier, and he can count.',
      '"The coin. Tegen\'s sent you; she said she would." He turns his own on his knuckles, grey and faceless. "Leofwin. I had the Scarth under Hale till the pay stopped coming and the orders got strange, and then I had the road. A man\'s got to eat, and the road eats better than the post."',
      '"The coin\'s my pay for carrying tools up the Grove road. Chisels, mostly, in oiled cloth, from a man at the pass who never shows his face to a man at the stack who never shows his. I don\'t ask. I\'ll say this for it: it doesn\'t tarnish."',
    ], after: { flag: 'q_coin' }, until: [{ flag: 'q_coin_walk' }, { flag: 'q_coin_fight' }], choice: {
      ask: '"I\'ve a band in the trees behind you, and you\'d win, and I\'d be dead, and you\'d know nothing. Or I walk, out of Thornmark for good, and I tell you where the coins come from first. Your call."',
      answers: [
        { label: 'Walk. Where do they come from?', sets: 'q_coin_walk', says: [
          '"The charcoal stack on the Grove road, where the marked oaks are. A man in Lantern grey pays there, out of a bag that never gets lighter, and what he pays for is the marked trees coming down and the tools going up. I never saw his face and I never wanted to." He stands, and kicks the fire out. "That\'s all of it. I\'m for the coast. Tell Hale he was right about the orders."',
        ] },
        { label: 'You\'ll answer at the Scarth.', sets: 'q_coin_fight', says: [
          '"Thought so." He puts two fingers in his mouth and whistles, and the trees behind you fill with men. "Sorry about this. You\'d have done the same."',
        ] },
      ],
    } },
    // Leave the Trees Standing: the burner's stack where the marked oaks begin, felling while he is
    // there and cold after; sent home, he waits at the pass.
    { kind: 'event', x: 14, y: 22, id: 'tm_stack', once: true, until: [{ flag: 'q_trees_sylvane' }, { flag: 'q_trees_home' }], text: 'A charcoal stack smoking on the Grove road, and beside it three oaks felled, each with the chisel\'s mark on its stump.' },
    { kind: 'event', x: 14, y: 22, id: 'tm_stack_cold', once: true, after: [{ flag: 'q_trees_sylvane' }, { flag: 'q_trees_home' }], text: 'The stack stands cold. The three stumps have been cut level and marked over with the woodward\'s axe.' },
    { kind: 'npc', x: 15, y: 22, name: 'Ulf, a charcoal-burner', lines: [
      'A big man black to the elbows leans on an axe beside his stack, and does not take the trouble to look afraid.',
      '"Burner. From the Foreland, before you ask, and yes, they\'re marked, and yes, I was told to take the marked ones only. By a Lantern. Travel-grey, hood up, paid in advance, which no Lantern in my life has ever done. Said the marked ones were sick and had to come down before it spread. That\'s what a mark\'s for, isn\'t it?"',
      '"Paid in these." He shows a handful of grey coins with no face. "Wouldn\'t tarnish if you buried them. I\'ve buried three. Look, I\'ve a wife in Gullwick and a stack half burnt. Say what you\'ve come to say."',
    ], flag: 'q_trees_ulf', until: [{ flag: 'q_trees_sylvane' }, { flag: 'q_trees_home' }], choice: {
      ask: '"Well? Do I go before the Elder, or do I go home?"',
      answers: [
        { label: 'To the Elder.', sets: 'q_trees_sylvane', says: [
          '"The Elder." He wipes his hands on his breeches, which makes them no cleaner. "All right. I\'ve heard she doesn\'t stand up for anyone. I\'ll stand for the both of us." He shoulders the axe and goes ahead of you up the road, and does not look at the stumps.',
        ] },
        { label: 'Go home, and don\'t come back.', sets: 'q_trees_home', says: [
          '"Home." He looks at the stack, and the three stumps, and the cart. "Half a stack\'s worth of coin I can\'t spend, and a wife who\'ll ask. Fair enough. I\'ve been driven off worse ground by worse people." He starts to harness the cart. "The Lantern\'s due again at the new moon, if anyone wants him. I\'ll not be here to say so."',
        ] },
      ],
    } },
    { kind: 'npc', x: 2, y: 10, name: 'Ulf, a charcoal-burner', lines: [
      'Ulf sits on his cart at the pass\'s mouth, waiting for the Wardens to wave him through, which they have not done since morning.',
      '"You again." He holds out a grey, faceless coin, and takes it back. "No good to me, and no good to you, and I\'ll keep it anyway. A man ought to have something to show for a stack of charcoal." He looks up the pass. "They\'ll let me through when it suits them. Everything does, lately."',
    ], after: { flag: 'q_trees_home' } },
    // The Dark Glass: the marker's crown on the lake's far shore, and its glass.
    { kind: 'event', x: 29, y: 24, id: 'tm_far_shore', once: true, until: [{ flag: 'q_glass_told' }, { flag: 'q_glass_kept' }], text: 'The marker\'s crown: a brass cage round a disc of glass, not dark but black, the way a full inkwell is black.' },
    { kind: 'chest', x: 30, y: 24, id: 'tm_glass', gold: 0, items: ['marker_glass'] },
    // Terms From the Brigands: Thora's camp in the trees north-east of the sign, and her there once
    // Sylvane has told the company of her terms, until it answers her.
    { kind: 'event', x: 18, y: 5, id: 'tm_thora_camp', once: true, until: [{ flag: 'q_terms_taken' }, { flag: 'q_terms_refuse' }], text: 'Lean-tos of Foreland thatch, a plough without an ox, and children who stop playing, and do not run.' },
    { kind: 'npc', x: 18, y: 4, name: 'Thora, who leads the camp', lines: [
      'A broad woman with a Foreland farmer\'s hands and a Warden\'s sword stands up from the fire, and the camp stands up behind her.',
      '"You\'ve come from the Elder. She sent me back with my branch, so she\'s sent you with your swords; I know how it goes. Look at them before you draw. That\'s Aldwick, Stanton and Hurst, or was. The Regent\'s men came for the winter corn, and then the seed corn, and then the roof-beams. We came east because east was the only way the Wardens weren\'t."',
      '"We rob the road because it feeds us. I don\'t say it\'s right. I say forty people don\'t starve quiet. Carry my terms back and argue them, and the road\'s safe from the day she says yes. Or don\'t, and when the snow comes, we come with it."',
    ], after: { flag: 'q_terms' }, until: [{ flag: 'q_terms_carry' }, { flag: 'q_terms_refuse' }], choice: {
      ask: '"So which is it? Do you carry our terms to Thornhold and speak for them, or do you tell me no to my face, here, where the children can hear it?"',
      answers: [
        { label: 'We\'ll carry them, and speak.', sets: 'q_terms_carry', says: [
          '"Then speak well." She sits back down at the fire, and the camp sits with her. "Tell her the terms: the road\'s hers from the day she says yes, and we cut her wood and mend her wall for the winter, and go home in spring, if there\'s a home. Tell her the villages\' names. Aldwick, Stanton, Hurst. She\'s old enough to know what a name costs."',
        ] },
        { label: 'No. Leave the road.', sets: 'q_terms_refuse', says: [
          '"No." She looks at the children, and then at you, for a long time. "Then that\'s the answer, and I\'ll not ask you twice. Go back up the road. When the snow\'s on it, we\'ll be on it too, and the elves can count us then."',
        ] },
      ],
    } },
    // The Mender: her camp turned over on the Grove road once Sylvane has sent for her, Edith in the
    // Grove's hollow until the tear is shut with her kit in hand (then she is by the Stone), and
    // the kit at the zealots' camp in the hollow's lee.
    { kind: 'event', x: 13, y: 20, id: 'tm_mender_camp', once: true, after: { flag: 'q_grove_done' }, text: 'A Lantern\'s camp, turned over: the tent slashed, and straps cut where something heavy was carried off.' },
    { kind: 'npc', x: 5, y: 27, name: 'Edith, Reader of the Guildhall', lines: [
      'A Lantern in a Reader\'s grey sits in the roots at the hollow\'s edge, where the oaks lean in, with a stone in her hand that she has been ready to throw for a day and a night.',
      '"Company. Chartered. Sylvane\'s?" She puts the stone down. "Edith, Reader, of the Guildhall, sent for to mend a Stone, which nobody alive has done, and which I have read of in a book older than the Chapel roof. I got as far as the road. Then men in grey took my kit and left me my life, and I\'ve sat in these roots wondering which of the two they wanted."',
      '"The kit\'s the thing. Copper wire, a wand, and a jar of the Guildhall\'s silver, which nobody alive knows how to make more of. It\'ll be at their camp in the lee of the hollow; they\'ll not know what it\'s for. Get it back, and I\'ll go under and mend the cut. Without it I\'m a woman in a wet coat."',
    ], flag: 'q_mender', after: { seen: 'thornmark:tm_mender_camp' }, until: { flag: 'q_mender_kit', slain: 'grove2:g2_warden' }, quest: {
      item: 'mending_kit', reward: 400, setFlag: 'q_mender_kit',
      done: [
        'Edith opens the case on her knees and counts: the wire, the wand, the jar with its seal unbroken.',
        '"They didn\'t even open it. They took a Lantern\'s case because it was a Lantern\'s, and threw it down because it was heavy." She closes it. "That\'s the Hand for you. Nobody has told them what they want."',
        '"Now the cut. I go under when the tear\'s shut and not before; I mend Stones, I don\'t fight what comes out of them. That\'s the Guildhall\'s money, and a Reader\'s thanks, which is worth less and lasts longer."',
      ],
      early: [
        'A Lantern in a Reader\'s grey stands up out of the roots at the hollow\'s edge, and looks at the case in your hands the way a mother looks at a child brought home.',
        '"That\'s mine. Edith, Reader, sent for to mend the Stone; men in grey took it on the road and left me. You\'ve had it off them." She opens it and counts. "Wire, wand, the jar sealed. They didn\'t even open it."',
        '"I go under when the tear\'s shut and not before. That\'s the Guildhall\'s money, and a Reader\'s thanks."',
      ],
    }, says: [
      { after: { flag: 'q_mender_kit' }, lines: [
        '"Still open, down there. I can feel it through my boots." She has the case between her feet. "I\'ll wait. A mend wants a still Stone, and a Stone with a hole in the air beside it is not still."',
      ] },
    ] },
    { kind: 'event', x: 9, y: 27, id: 'tm_zealot_camp', once: true, text: 'The zealots\' camp: a fire, a scatter of grey, and a Lantern\'s case, its straps cut, thrown down unopened.' },
    { kind: 'chest', x: 10, y: 27, id: 'tm_kit', gold: 0, items: ['mending_kit'] },
  ],
  encounters: [
    { id: 'tm_wolves1', x: 5, y: 9, monsters: ['dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf'], aware: 5, respawn: 1440 },
    { id: 'tm_ogre', x: 5, y: 7, monsters: ['ogre', 'brigand_archer', 'brigand', 'brigand', 'brigand'], aware: 3, roams: false },
    { id: 'tm_brigands1', x: 23, y: 7, monsters: ['brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand_archer'], aware: 5, respawn: 2880, until: TERMS_TAKEN },
    { id: 'tm_barrow', x: 26, y: 8, monsters: ['bone_knight', 'bone_knight', 'skeleton', 'skeleton', 'skeleton', 'skeleton', 'skeleton', 'skeleton', 'skeleton', 'skeleton', 'skeleton', 'skeleton'], aware: 3, roams: false },
    { id: 'tm_wraiths', x: 30, y: 7, monsters: ['wraith', 'wraith', 'wraith', 'wraith', 'wraith', 'wraith'], aware: 3, roams: false },
    { id: 'tm_spiders1', x: 17, y: 13, monsters: ['thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider'], aware: 5, respawn: 1440 },
    { id: 'tm_brigands2', x: 13, y: 15, monsters: ['brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand_archer'], aware: 5, respawn: 2880, until: TERMS_TAKEN },
    { id: 'tm_wolves2', x: 20, y: 16, monsters: ['thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'dire_wolf'], aware: 5, respawn: 1440 },
    { id: 'tm_wolves3', x: 26, y: 14, monsters: ['thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'dire_wolf', 'dire_wolf'], aware: 5, respawn: 1440 },
    { id: 'tm_hounds', x: 13, y: 21, monsters: ['rift_hound', 'rift_hound', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider'], aware: 6, respawn: 2880, until: TEAR_CLOSED },
    { id: 'tm_spiders2', x: 10, y: 22, monsters: ['thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider'], aware: 5, respawn: 1440 },
    { id: 'tm_zealots', x: 7, y: 26, monsters: ['zealot', 'ashen_adept', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand'], aware: 5, respawn: 2880 },
    { id: 'tm_elders', x: 12, y: 27, monsters: ['riftling_elder', 'riftling', 'riftling', 'riftling', 'riftling', 'riftling', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider'], aware: 5, respawn: 2880, until: TEAR_CLOSED },
    // The side quests' (#219): Leofwin's band, once he whistles for it; Thora's, in the snow, once
    // the company has told her no.
    { id: 'tm_deserters', x: 16, y: 16, monsters: ['brigand_archer', 'brigand_archer', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand'], aware: 3, roams: false, after: { flag: 'q_coin_fight' } },
    { id: 'tm_thora', x: 18, y: 6, monsters: ['brigand_archer', 'brigand_archer', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand', 'brigand'], aware: 3, roams: false, when: { season: 'winter' }, after: { flag: 'q_terms_refuse' } },
    { id: 'tm_lake', x: 24, y: 21, monsters: ['thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'rift_hound', 'rift_hound'], aware: 5, respawn: 1440, until: TEAR_CLOSED },
  ],
};
