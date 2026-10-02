// The Drowned Temples, level one: the upper temple behind B6's dry door, half flooded. The narthex
// and the bell's empty frame inside the door; the nave north between its pillars, its west aisle under
// the water and two drowned men in its dry strip; four chapels off it, the north-west sunk deep,
// the south-west flooded to the chin of the drowned standing in it, and two dry ones east with their
// fonts, two bull toads come in with the fen at the north-east's; the apse at the nave's head and
// its stair down to the choir, where the count is heard from the top. Band 11-12;
// docs/areas/saltreach.md §4.7 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';
import type { QuestCond, When } from '../../../../game/quests.ts';

/** The Choirmaster fallen, and the count with it (level two). */
export const COUNT_STOPPED: QuestCond = { slain: 'drowned_temples2:dt2_choirmaster' };

/** The Tide Stone set back on its plinth (#191): the god sings again, and the fen's Rifts go quiet. */
export const STONE_HOME: QuestCond = { flag: 'q_tide_home' };

/** The Tide Bell back on its frame: the priestess's hand-in at B6's dry door (#56's 23). */
export const BELL_HUNG: QuestCond = { flag: 'q_tide_bell_done' };

/** The nave's head, x 5 to 10 of row 3: the squares every way to the apse's stair crosses. */
const SINGS = [5, 6, 7, 8, 9, 10];
const singId = (x: number): string => (x === 8 ? 'dt1_stair_sing' : `dt1_sing_${x}`);
/** The song heard once, on any of them. */
const SUNG: When = SINGS.map((x) => ({ seen: `drowned_temples:${singId(x)}` }));
const SONG = 'The nave\'s head, the apse dark ahead and its stair going down out of the floor. Up it, under the drip of the aisle, one low note, held, and another a little above.';

export const DROWNED_TEMPLES: MapDef = {
  id: 'drowned_temples',
  name: 'The Drowned Temples',
  kind: 'dungeon',
  band: [11, 12],
  region: 'saltreach',
  start: { x: 8, y: 14, facing: NORTH },
  palette: { wall: '#56605a', wallDark: '#363e3a', floor: '#3c4642', ceiling: '#1a2220', door: '#4a4234', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#2e5a5a' },
  rows: [
    '################',
    '######....######',
    '#WWW#~~~...#...#',
    '#WWW~~~~...D...#',
    '#WWW#~~~...#...#',
    '#####o~~..o#####',
    '#####~~....#####',
    '#####o~...o#####',
    '#~~~#~.....#...#',
    '#~~~~......D...#',
    '#~~~#......#...#',
    '#####......#####',
    '###..........###',
    '###..........###',
    '#######..#######',
    '################',
  ],
  exits: [
    { x: 8, y: 14, to: 'delta_b6', tx: 16, ty: 12, tf: SOUTH, label: 'You come out of the dry door onto the causeway.' },
    { x: 8, y: 1, to: 'drowned_temples2', tx: 7, ty: 14, tf: NORTH, label: 'You go down the stair into the choir.' },
  ],
  features: [
    // The narthex, and the bell's frame: empty until the priestess has the bell back and hangs it, and
    // the Tidefolk's blessing on it after (#554).
    { kind: 'event', x: 8, y: 13, id: 'dt1_in', once: true, text: 'The narthex, dry, the door\'s light at your back. Beyond the inner arch the water stands grey between the pillars, and something under the floor keeps time.' },
    { kind: 'event', x: 5, y: 12, id: 'dt1_frame', once: true, until: BELL_HUNG, text: 'The bell\'s frame stands in the narthex, oak, empty. Its hook is worn bright where a rope swung, and the rope is gone, and the bell with it.' },
    { kind: 'event', x: 5, y: 12, id: 'dt1_frame_hung', once: true, after: BELL_HUNG, text: 'The bell hangs on its frame again, on new rope, the knot still dark with wet. Wet footprints go from the door to the frame and back, one pair, bare.' },
    { kind: 'shrine', x: 5, y: 12, id: 'dt1_bell', name: 'The Tide Bell', after: BELL_HUNG, text: 'Kneeling puts the brow to the bell\'s lip. The bronze is cold as a channel at the ebb, and the cold goes through like the tide through a net and does not stay.', stat: 'endurance', done: 'The bronze is only cold now.' },
    // The nave and its chapels.
    { kind: 'event', x: 8, y: 10, id: 'dt1_nave', once: true, text: 'The nave runs north between pillars to a dark apse. The west aisle lies under a hand of water, and the pillars on that side stand in it to the base, weeded green.' },
    { kind: 'event', x: 5, y: 9, id: 'dt1_flooded', once: true, text: 'The south-west chapel, flooded. The drowned stand in it to the chin, facing its altar, lips moving. Where the words would be, bubbles come up, and go on coming.' },
    { kind: 'event', x: 8, y: 4, id: 'dt1_sunk', once: true, text: 'The north-west chapel has gone down. Deep water stands black to the arch, and its altar shows under it a long way down, a pale square, and nothing on it.' },
    { kind: 'event', x: 14, y: 2, id: 'dt1_font_ne', once: true, text: 'The north-east chapel\'s font, a stone bowl cut to fill at the tide\'s top. Weed hangs off its rim, slimed thick, and whatever was left in it is gone.' },
    { kind: 'event', x: 12, y: 9, id: 'dt1_font_se', once: true, text: 'The south-east chapel\'s font, full to the brim and brown. Notches are cut in its rim, ten old and worn smooth, and one more, new, cut deep.' },
    { kind: 'chest', x: 14, y: 10, id: 'dt1_font', gold: 200, items: ['potion_heal', 'potion_heal'] },
    // The apse: the stair head, and the count up it from the choir until the Choirmaster falls.
    { kind: 'event', x: 8, y: 2, id: 'dt1_stair', once: true, until: [COUNT_STOPPED, STONE_HOME], text: 'The apse. A stair goes down out of its floor, dry, and the count comes up it, many voices at once: one to ten, a breath, eleven, and one again.' },
    { kind: 'event', x: 8, y: 2, id: 'dt1_stair_quiet', once: true, after: [COUNT_STOPPED, STONE_HOME], until: STONE_HOME, text: 'The apse\'s stair, dry, going down into the dark. Nothing comes up it now. The water in the aisle lies flat, and you can hear it drip.' },
    // Once the Tide Stone is home the god sings again, very faintly, whether or not the count has
    // stopped (#191): heard once, on whichever square of the nave's head the company crosses, since
    // every way to the apse's stair crosses it.
    ...SINGS.map((x) => ({ kind: 'event' as const, x, y: 3, id: singId(x), once: true, after: STONE_HOME, until: SUNG, text: SONG })),
  ],
  encounters: [
    // Two drowned men in the nave's dry strip; and two bull toads in the north-east chapel, come in with
    // the fen through the sunk north chapels, the level's hardest at 12.
    { id: 'dt1_nave', x: 8, y: 6, monsters: ['temple_drowned', 'temple_drowned'], aware: 2, roams: false, respawn: 2880 },
    { id: 'dt1_chapel', x: 13, y: 3, monsters: ['bull_toad', 'bull_toad'], aware: 4, roams: false, respawn: 2880 },
  ],
};
