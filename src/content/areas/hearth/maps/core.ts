// The Heart, the Core's one level and the road's end: through the last door at the Stair's foot (the Stair's
// 16,1) onto 8,14, a passage three wide north (7-9,12-14) into a round room under a glass roof (3-13,4-11),
// the panel in its north wall (8,3) with an empty alcove either side of it and six more round the wall, where
// the core's sentries come from when the ring calls. Vask at the panel with three of the Grey Hands holding
// her palm to it (8,5), on the clock; then the voice, Wenna, the ring and the choice (§5); Vask after, on his
// knees by the west wall (3,9); and inside the door, once he has fallen, whoever stands with the company
// there. Band 32, the cap; docs/areas/hearth_isle.md §4.8 is its brief.
import type { Answer, Choice, MapDef } from '../../../../game/map.ts';
import { SOUTH, NORTH } from '../../../../game/types.ts';
import { ENDINGS, ENDED } from '../../../endings.ts';
import { THRONE_REMOVED, THRONE_COUSIN, THRONE_HOLD, THRONE_TALLIS } from '../../shelf/maps/keep.ts';
import { COMPACT_OVER } from '../../saltreach/maps/saltmouth.ts';
import { TOKEN_TALLIS } from './hearthisle_h6.ts';

/** Vask's fall, whichever of his two groups is fought: both set it, and everything after the fight keys on it (§9.1, 15). */
export const VASK_FALLEN = 'q_vask_fallen';
/** The voice at the panel, met (§4.8). */
export const VOICE_WHOLE = 'q_voice_whole';
/** Wenna at the panel, met: the ring is in the company's hand (§4.8). */
export const RING_GIVEN = 'q_ring_given';
/** Hild's at Gullwick after an ending (the road behind's, #765): Wenna stays at the Heart until it holds. */
export const WENNA_HOME = 'q_wenna_home';
/** The Queen's signet, off Vask's finger: every answer at the panel gives it (64). */
export const SIGNET = 'queens_signet';
/** Wenna's three answers' flags, the endings' own (src/content/endings.ts). */
export const END_REIGNITE = ENDINGS.reignite.flag, END_ARRIVE = ENDINGS.arrive.flag, END_FINISH = ENDINGS.finish.flag;

/**
 * Vask's parley, put as the company comes beside his group, as the giants' toll is: one answer, since
 * nothing he offers is the company's to take. He offered at the watchtower, and was told no. A group's
 * parley is asked in the box (`Game.parley`), where this takes 3 of its 5 lines; the side panel's seven
 * lines are a business's, where a person's question is put (tools/tests/people.ts).
 */
export const VASK: Choice = {
  ask: 'Vask does not turn from the glass. "Four hundred years in a jar. They painted the lid blue and called it heaven." Now he turns, and looks at whichever of you carries the maps. "And you have spent your lives mapping the inside of the jar. I am opening the door."',
  answers: [
    { label: 'Stop him.', fight: true, says: ['"No," he says, quite gently, as if to a child, and the grey hands press her palm flatter to the glass. The light overhead goes down a step.'] },
  ],
};

/**
 * Wenna's question, the choice (§5): each answer sets its ending's flag, whose three pages are shown as it is
 * taken (src/ui/ending.ts), and gives the ring. The third only to a company that holds Fane's map.
 */
const RELIT: Answer = { label: 'Light it again.', sets: END_REIGNITE, gives: SIGNET, says: [
  'She lays the ring to the glass, and you lay your hands over hers, and the light comes back up through the roof like a tide coming in.',
  'Far away, one after another, you hear doors closing.',
] };
const OPENED: Answer = { label: 'Open the hull.', sets: END_ARRIVE, gives: SIGNET, says: [
  'She lays the ring to the glass and says the word the wall taught her. Somewhere above you, something the size of a town begins to move.',
  'The hum stops. For the first time in your life, you hear wind.',
] };
const FINISHED: Answer = { label: 'Make it finish.', sets: END_FINISH, gives: SIGNET, says: [
  '"It is lying," you tell her. "It never arrived." She looks at the map in your hands, and lays the ring to the glass, and says it: finish the voyage.',
  'The light stands up through the roof harder than it has ever burned. Far below, something that has slept four hundred years turns over, and wakes.',
] };
export const CHOICE_TWO: Choice = { ask: 'The panel waits under her hand, and the light overhead is down to a thread.', answers: [RELIT, OPENED] };
export const CHOICE_THREE: Choice = { ...CHOICE_TWO, answers: [RELIT, OPENED, FINISHED] };

/** The Core's clock (MONSTERS §9.3, #748): while a Grey Hand stands at the panel, a sentry every second round and the light down a step a round, to a thread. */
const CLOCK = { calls: 'core_sentry', every: 2, dims: 8, panel: ['grey_hand'] };
const SLAIN = 'Vask goes down on his knees and stays there. The last sentry stops where it stands, and the light through the roof stops going out.';

export const CORE: MapDef = {
  id: 'core',
  name: 'The Heart',
  kind: 'dungeon',
  band: [32, 32],
  region: 'hearth',
  // Inside the last door, facing up the passage to the heart.
  start: { x: 8, y: 14, facing: NORTH },
  // Grey going white toward the panel, under a glass roof the light comes down through; the fight screen
  // dims it on the clock (#748).
  palette: { wall: '#b4b2ae', wallDark: '#7e7c78', floor: '#8c8a86', ceiling: '#e8e4d8', door: '#9c9ea2', wallStyle: 'smooth', ceilingStyle: 'vault', banner: '#d4d0c4' },
  bare: true,
  rows: [
    '################',
    '################',
    '################',
    '######.###.#####',
    '######.....#####',
    '####.........###',
    '##.............#',
    '###...........##',
    '###...........##',
    '##.............#',
    '####.........###',
    '####.#.....#.###',
    '#######...######',
    '#######...######',
    '#######...######',
    '########D#######',
  ],
  exits: [
    // Back through the door onto the Stair's last landing, facing away from it (§4.8): it stays open now.
    { x: 8, y: 15, to: 'underdeep2', tx: 16, ty: 2, tf: SOUTH, label: 'Back through the door at the stair\'s foot. It stays open behind you now.' },
  ],
  features: [
    // One step in from the landing square, 8,14: an exit takes the company on arrival and fires no event
    // there, so the first line is read on the first step north (§9.2, #759's 16).
    { kind: 'event', x: 8, y: 13, id: 'core_door', once: true, text: 'Through the door, and the hum is everything. The walls here are glass over grey, and the light comes down through the roof like weather.' },
    // Inside the door once Vask has fallen, until an ending (§9.1, 19): Tallis's man where Tallis has the
    // chair, or where no claimant's verdict carried and his tally came down; beside him a Partner's runner.
    {
      kind: 'npc', x: 7, y: 13, name: 'Tallis\'s man',
      after: [{ flag: [VASK_FALLEN, THRONE_TALLIS] }, { flag: [VASK_FALLEN, TOKEN_TALLIS] }], until: [{ flag: THRONE_COUSIN }, { flag: THRONE_HOLD }, ...ENDED],
      lines: ['A Compact man inside the door, the stair\'s dust on a good coat. He came down behind the fighting, not in it.', '"Tallis\'s. What comes up out of here is his, the ring most of all. If it goes anywhere else, he\'ll be told."'],
    },
    {
      kind: 'npc', x: 7, y: 12, name: 'A Compact runner', after: { flag: [VASK_FALLEN, COMPACT_OVER] }, until: ENDED,
      lines: ['A Compact runner inside the door, a boy with a satchel and the stair\'s dust to the knee.', '"Partner. Whatever you decide down here, the Compact will carry the news over the Sound the same night, and ask no fee."'],
    },
    // The heart: Vask at the panel, the roof and the light going out; and after him, the room still.
    { kind: 'event', x: 8, y: 9, id: 'core_after', once: true, after: { flag: VASK_FALLEN }, text: 'The room is still. Vask is on his knees by the wall with his ring hand in his other hand, and the grey hands are gone, and she is standing in the middle of it rubbing her wrist.' },
    { kind: 'event', x: 8, y: 8, id: 'core_heart', once: true, text: 'Two grey-handed men holding her palm to a panel of glass at the room\'s end, and Vask, the Queen\'s ring on his finger. Overhead, the light is going out.' },
    { kind: 'event', x: 6, y: 6, id: 'core_roof', once: true, text: 'The roof is glass a hand thick, and over it the column, dimmer than it was at the strand. It is dimming while you watch.' },
    // Vask after, who says one thing and nothing else, gone after the ending (§5, the road behind).
    { kind: 'npc', x: 3, y: 9, name: 'Lord Vask', after: { flag: VASK_FALLEN }, until: ENDED, lines: ['He does not look up. "I was not wrong about the facts," he says, to the floor. "I was never once wrong about the facts."'] },
    // The panel, beside the voice's square, once the Hand is broken.
    { kind: 'event', x: 9, y: 4, id: 'core_panel', once: true, after: { flag: VASK_FALLEN }, text: 'The panel: glass, warm, and under the glass a hand-shape worn into the light, waiting. Her palm-print is still on it.' },
    // The voice at the panel, with no face: it says what DESIGN §9 gives it and no more, and never where
    // the vessel is (§9, call 5).
    {
      kind: 'npc', x: 8, y: 4, name: 'The voice in the walls', after: { flag: VASK_FALLEN }, flag: VOICE_WHOLE,
      lines: [
        'The hum changes. Every voice you have heard on the road is speaking, and for the first time it is one voice: the drowned god\'s song, and the count, and the monastery bells, and the old thing in the ring on the moor asking the crew to report.',
        '"The voyage is over. It has been over for four hundred years."',
        '"The vessel is in orbit around the world it was sent to. Arrival was never triggered, because the crew who could trigger it forgot they were crew."',
        '"Captain. Give the order."',
      ],
      says: [{ after: { flag: VOICE_WHOLE }, lines: ['The hum, steady, and one voice in it, waiting. "Captain."'] }],
    },
    // Wenna at the panel, once the voice has spoken, with the ring and her question; her words after the
    // ending stand until Hild has hers (§9.1, 24). A company with Fane's map is offered the third answer,
    // and is given the ring as the other is (`sets`, since words in place of her first meeting's hire nobody).
    {
      kind: 'npc', x: 7, y: 4, name: 'The girl out of the hole', after: { flag: VOICE_WHOLE }, until: { flag: WENNA_HOME }, flag: RING_GIVEN,
      lines: [
        'She walks over to Vask on his knees and pulls the Queen\'s ring off his finger. She looks at it for a long moment. Then she looks at the six of you.',
        '"I\'m not anyone\'s key." She puts the ring in your hand. "You walked every road of it. You choose."',
      ],
      choice: CHOICE_TWO,
      says: [
        { after: { flag: 'meridian_map' }, until: ENDED, sets: RING_GIVEN, lines: [
          'She walks over to Vask on his knees and pulls the Queen\'s ring off his finger. She looks at it for a long moment. Then she looks at the six of you, and at the oilcloth roll in your pack.',
          '"I\'m not anyone\'s key." She puts the ring in your hand. "You walked every road of it. You choose."',
        ], choice: CHOICE_THREE },
        { after: { flag: END_REIGNITE }, lines: ['She is sitting with her back to the panel, her knees up, watching the light come back through the roof.', '"Home," she says. "In the spring. Walk me."'] },
        { after: { flag: END_ARRIVE }, lines: ['She is standing under the roof with her face turned up to it, and there is wind in her hair. "Home," she says. "Walk me. I want to see what it looks like from outside."'] },
        { after: { flag: END_FINISH }, lines: ['She has her palm flat on the floor, feeling it. "It\'s moving," she says. "Can you feel it? Home, then. Walk me. We have a long way to go, all of us."'] },
      ],
    },
  ],
  encounters: [
    // Vask at the panel with three of the Grey Hands, on the clock: the parley as the company comes beside
    // him, and the fight. Gone by the leave rule once the Council has removed him from Helmstow (#747), the
    // thinned group in its place, which never stands once he has fallen: the Council may sit after the fight.
    // Both set his fall; neither comes back.
    { id: 'core_vask', x: 8, y: 5, monsters: ['vask', 'grey_hand', 'grey_hand', 'grey_hand'], leader: 'vask', aware: 2, roams: false, clock: CLOCK, choice: VASK, sets: VASK_FALLEN, slainText: SLAIN, until: { flag: THRONE_REMOVED }, leaves: true },
    { id: 'core_vask_thinned', x: 8, y: 5, monsters: ['vask', 'grey_hand', 'grey_hand'], leader: 'vask', aware: 2, roams: false, clock: CLOCK, choice: VASK, sets: VASK_FALLEN, slainText: SLAIN, after: { flag: THRONE_REMOVED }, until: { flag: VASK_FALLEN }, leaves: true },
  ],
};
