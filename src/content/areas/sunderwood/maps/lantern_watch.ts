// Lantern Watch, the Lanterns' tower over the gorge: Act II's second town, band 14-16, entered from
// L2's gate at 12,16. One tower in a walled yard: the Lantern hall at its foot (spells to tier 6 and
// the Lanterns' quests), the refectory (rest), the stores (the band's step on the ladder, #399), the
// prior's room, where the papers are read, and the Lamp Gallery at the top, which trains to 17. No
// temple: the shrine at Sunderfall cures. Prior Osric keeps the lamp in the yard; Hester Dunmore, the
// Watch's Reader, sits in his room; Wouter Brink of the Cartographers sights the gorge from the west
// wall. By day, once the papers are read and the wall touched, Vask waits at the gate (#204).
// docs/areas/sunderwood.md §4.8 is its brief.
import type { MapDef, Words } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

/**
 * The Reader's words, read to what the company carries: the papers, the log or both, each opened
 * plainly or, to a company that found the letter under L2's ash, knowing it has been on the knoll.
 * Each holds only once she has met the company (`MET`), so her introduction always comes first; the
 * papers only and the log only stand before both, so whichever is carried alone finds its own.
 * Each sets what it read beside the midpoint's flag, `seal_read` or `log_read`, for the chapter.
 */
const MET = 'watch_reader_met', PRIOR_MET = 'watch_prior_met';
const SEAL = '"The Helmstow customs seal on every cargo, the same as on the crates in the caves. Under it on every page a countersign. The Regent\'s."';
const READINGS = [
  { has: 'ships_papers', not: 'ships_log', sets: ['papers_read', 'seal_read'], plain: 'She sees the papers before she sees you, and gets up, and shuts the door herself. "Sit." She lays them open under the window.',
    knoll: '"You have been on the knoll, then." She gets up and shuts the door herself, and lays the papers open under the window.',
    read: [`${SEAL} She puts them back in your hands.`] },
  { has: 'ships_log', not: 'ships_papers', sets: ['papers_read', 'log_read'], plain: 'She sees the log before she sees you, and gets up, and shuts the door herself. "Sit." She opens it under the window.',
    knoll: '"You have been on the knoll, then." She gets up and shuts the door herself, and opens the log under the window.',
    read: ['"The log is a clerk\'s cipher. I know it." At the foot of each entry, in another ink, one name: Vask. She puts it back in your hands.'] },
  { has: 'ships_papers', sets: ['papers_read', 'seal_read', 'log_read'], plain: 'She sees what you carry before she sees you, and gets up, and shuts the door herself. "Sit." Papers and log go open under the window.',
    knoll: '"You have been on the knoll, then." She gets up and shuts the door herself, and lays papers and log open under the window.',
    read: [SEAL, '"The log is a clerk\'s cipher. I know it." At the foot of each entry, the other ink, one name: Vask. She puts both back in your hands.'] },
];
const reading = (knoll: boolean): Words[] => READINGS.map((r) => ({
  after: { flag: MET, item: r.has, ...(knoll ? { seen: 'lanternwood_l2:l2_letter' } : {}) },
  ...(r.not ? { until: { item: r.not } } : {}),
  sets: r.sets, lines: [knoll ? r.knoll : r.plain, ...r.read],
}));

/** Where Vask is: the papers read and the wall touched, by day, until he has his answer. */
const VASK_HERE = { after: { flag: 'papers_read', seen: 'the_sunder2:su2_wall' }, until: { flag: 'q_salt_done' }, when: { hours: 'day' } } as const;

export const LANTERN_WATCH: MapDef = {
  id: 'lantern_watch',
  name: 'Lantern Watch',
  kind: 'town',
  band: [14, 16],
  region: 'sunderwood',
  start: { x: 7, y: 14, facing: NORTH },
  palette: { wall: '#7e7a70', wallDark: '#4e4a44', floor: '#6a665c', banner: '#c9a34a' },
  rows: [
    '################',
    '#T,,,,,,,,,,,,T#',
    '#,,,"""""""",,,#',
    '#,,,"BBBDBB",,,#',
    '#,,,"BBBBBB",,,#',
    '#,,,"DBBBBD",,,#',
    '#,,,"BBBBBB",,,#',
    '#,,,"BBBBBD",,,#',
    '#,,,"BBDBBB",,,#',
    '#,,,"""""""",,,#',
    '#,,,,,,==,,,,,,#',
    '#,,,,,,==,,,,,,#',
    '#,T,,,,==,,,,T,#',
    '#,,,,,,==,,,,,,#',
    '#T,,,,,==,,,,,T#',
    '#######==#######',
  ],
  exits: [
    { x: 7, y: 15, to: 'lanternwood_l2', tx: 12, ty: 17, tf: SOUTH, label: 'You go out under the gate onto the road, the lamp at your back.' },
    { x: 8, y: 15, to: 'lanternwood_l2', tx: 12, ty: 17, tf: SOUTH, label: 'You go out under the gate onto the road, the lamp at your back.' },
  ],
  features: [
    // The tower's five doors: the gallery at the top, the prior's room, the stores, the refectory
    // and the Lanterns' hall at its foot.
    { kind: 'trainer', x: 8, y: 3, name: 'The Lamp Gallery', maxLevel: 17, interior: 'watch_gallery' },
    { kind: 'npc', x: 5, y: 5, name: "The Prior's Room", interior: 'priors_room', lines: [
      'The prior\'s room, high in the tower. A desk under the window on the gorge, and the rain on the glass.',
      'On the wall a survey of the ledges, pinned at the corners. A cold hearth, two chairs. The prior is not in it.',
    ] },
    // The Watch's Reader, in the prior's room at every hour (#201). She reads the Tide Ship's papers
    // and its log to whoever carries them, whenever they come, once she has met them, and gives
    // them back: the midpoint (DESIGN §9), its flag `papers_read` for #204's chapter to read. The
    // letter under L2's ash changes only how she begins.
    { kind: 'npc', x: 5, y: 5, name: 'Hester Dunmore, Reader of the Watch', flag: MET, lines: [
      'A woman at the desk with a cut wick in a dish beside her, a book shut under her hand. She does not stand.',
      '"Hester Dunmore, Reader of the Watch. Helmstow sends oil and orders, and once a season somebody to count the jars."',
      '"Sometimes papers come instead, and those come to me." She looks past you at the door. "Shut it, if you would."',
    ], says: [
      { after: { flag: 'papers_read' }, lines: [
        'She has the wick in its dish lit now, the door still shut. "They came to me. They are yours. Keep them close, and keep them dry."',
        '"Nothing I read leaves this room by me." She looks at the door. "What goes down the stair is yours to carry."',
      ] },
      ...reading(true),
      ...reading(false),
    ] },
    { kind: 'shop', x: 10, y: 5, name: 'The Watch Stores', stock: ['flail', 'wardens_dirk', 'ironwood_bow', 'great_axe', 'watch_staff', 'lamellar', 'watch_habit', 'watch_shield', 'lantern_oil', 'elixir', 'potion_sp_great', 'rations'], interior: 'watch_stores' },
    { kind: 'inn', x: 10, y: 7, name: 'The Refectory', price: 30, interior: 'watch_refectory' },
    { kind: 'guild', x: 7, y: 8, name: "The Watch's Lantern Hall", classes: ['cleric', 'sorcerer', 'paladin', 'ranger', 'bard', 'druid'], fee: 400, maxTier: 6, interior: 'watch_hall', hall: 'lanterns' },
    // The prior, in the yard under the lamp at every hour.
    { kind: 'npc', x: 8, y: 9, name: 'Prior Osric', flag: PRIOR_MET, lines: [
      'A tall man in the yard under the lamp, grey as the stone, his face turned up to it. He has heard you and not looked down.',
      '"Osric. Prior of the Watch. I keep the one lamp. The oil comes from Helmstow when Helmstow sends it, and the lamp burns while it lasts."',
      '"The Watch keeps no secrets from Helmstow, and asks none of its guests." He looks down at last. "You are welcome to the yard."',
    ], says: [
      { after: { flag: [PRIOR_MET, 'papers_read'] }, lines: ['"You have been up in my room." He looks at the lamp, not at you. "The chair was warm."'] },
      { after: [{ flag: PRIOR_MET, item: 'ships_papers' }, { flag: PRIOR_MET, item: 'ships_log' }], lines: ['"Papers from the coast, I hear. Leave them with me. They go to Helmstow by the next oil cart." He holds out his hand, and lets it fall.'] },
    ] },
    // The Cartographers' surveyor on the west wall, sighting across the gorge.
    { kind: 'npc', x: 2, y: 4, name: 'Wouter Brink, surveyor of the Guild', lines: [
      'A man on the west wall with a chain over one shoulder and a sighting rod to his eye, held across the gorge and the rain.',
      '"Brink. Wouter. The Guild\'s. The bridge is four hundred and twelve feet, near enough. The gorge has no near enough. My line ran out before the bottom did."',
      '"The ledges are mine, on the prior\'s wall. Below the last I ruled a line. I had nothing else to put there." He goes back to the rod.',
    ] },
    // Vask at the gate (#204): once the papers are read and the wall touched, by day, the nearest the
    // clock gives to the next morning. His question is the act's turn: either answer ends it, and
    // sets its own flag and nothing else. He is gone once answered.
    { kind: 'npc', x: 6, y: 14, name: 'Lord Aumery Vask, Regent-Warden', flag: 'q_vask_rain', ...VASK_HERE, lines: [
      'Lord Vask stands on the grass by the gate, bareheaded, the rain running off him unregarded. Behind him two Wardens hold three horses, and look at nothing.',
      '"You\'ve read the papers. Good. Then you know half of what I know."',
      '"The rest is this. The world is a cage, and the Hearth is its lock. Beyond the sky there is somewhere else, somewhere real, and I mean to open the door."',
    ], choice: { ask: '"Help me. You\'ve touched that wall. You know I\'m right."', answers: [
      { label: 'We\'ll help you.', sets: ['q_vask_yes', 'q_salt_done'], says: [
        'He hears it, and looks at you a moment longer than the words needed. "Good. Go home, then, and wait to be sent for."',
        '"I don\'t need you for this part. I have the girl." He takes the reins from the Warden, and the three of them ride out of the gate, and the rain closes behind them.',
      ] },
      { label: 'No.', sets: ['q_vask_no', 'q_salt_done'], says: [
        'He does not seem surprised. "Then stay out of my way. I don\'t need you. I have the girl."',
        'He takes the reins from the Warden without looking for them, mounts, and is gone through the gate; the two go after.',
      ] },
    ] } },
    { kind: 'event', x: 7, y: 13, id: 'lw_vask', once: true, ...VASK_HERE, text: 'Rain. Three horses at the gate, two Wardens holding them, and a man standing in the wet as if it were not raining.' },
    { kind: 'event', x: 7, y: 14, id: 'lw_gate', once: true, text: 'Lantern Watch: one tower in a walled yard over the gorge, and a lamp at the top lit in daylight. Moth dust lies on the step like flour.' },
    { kind: 'sign', x: 8, y: 14, text: 'Lantern Watch. The hall, the refectory, the stores. Lamp oil, bread and a bed.' },
    { kind: 'event', x: 9, y: 9, id: 'lw_lamp_night', when: { hours: 'night' }, text: 'The yard by night. Under the lamp the moths go up in one grey column, close enough to touch, and none comes down.' },
    { kind: 'well', x: 3, y: 10, text: 'A well in the yard, its rope grey with moth dust. The water comes up cold and tastes of stone.' },
    { kind: 'event', x: 1, y: 6, id: 'lw_lookout', once: true, text: 'The west wall, and the gorge under it. The bridge a thread across the gap, the glass trees on the far lip, and rain going down past all of it.' },
    { kind: 'event', x: 13, y: 4, id: 'lw_oil', once: true, text: 'Oil jars stacked against the tower\'s east side, three deep, every stopper out. The lamp above burns on all the same.' },
    { kind: 'event', x: 12, y: 11, id: 'lw_graves', once: true, text: 'The brothers\' graves along the yard\'s wall, a lamp cut on each stone. The newest cut is still white; the rest have gone grey.' },
    { kind: 'event', x: 3, y: 13, id: 'lw_bell', once: true, text: 'The signal bell on its post by the gate. The rope is tied up round the crossbar, a man\'s reach above the tallest of you.' },
  ],
};
