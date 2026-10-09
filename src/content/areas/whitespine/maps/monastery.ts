// Highcell, level one: the upper house. In at the gate in J11's wall, past the brother in it, onto the
// cloister's north walk: the garth inside its arcade with the well no foot goes to, the board of the
// hours by the refectory door in the old script, the refectory with nothing eaten in it, the cells
// along the east walk with a brother standing in each and the Novice in the last; at the south walk's
// west end the bell tower's foot and its stair winding up to the bells, where the ringers ring the
// eleven and the Laureate hides among them; at its east end the night stair down to the lower house.
// Brothers keep the hours by the cells, and ringers come down the tower's stair. Band 22-24, from the
// area's floor as Carn Dubh's cairn is; docs/areas/whitespine.md §4.3 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH, WEST } from '../../../../game/types.ts';
import type { QuestCond } from '../../../../game/quests.ts';
import { NEST_CELL } from './highspine_i11.ts';

/** The Novice told, back from his mother: he walks out at the gate, home to Anvilhall (#56's 45, #506). */
export const NOVICE_TOLD = 'q_novice_told';
/** The Novice told only that his mother is well: he keeps the fasts in his cell. */
export const NOVICE_KEPT = 'q_novice_kept';

/**
 * The Bard's third (#448), The Eleven: Brother Lark asks a company with a Skald of 27 for the verses
 * of the eleven (`ELEVEN_ASKED`), and once it holds all three (`VERSES`) and sings them to him under
 * the bells, his words set `ELEVEN_SUNG`, which his teaching reads.
 */
export const ELEVEN_ASKED = 'q_eleven', ELEVEN_SUNG = 'q_eleven_sung';
/**
 * The three verses, as the save holds them: the Tide Bell back on its frame in the drowned temples'
 * door (#56's 23), the miners' hymn heard whole at Anvilhall (#56's 36) and the keeper's log taken
 * from Crowness Light's table (#67). The flags are spelled out, not imported: Anvilhall's map reads
 * this one's, and the import would go round.
 */
const VERSE_FLAGS = ['q_tide_bell_done', 'q_hymn_sung'], LOG_TAKEN = 'downs_e3:e3_log';
export const VERSES: QuestCond = { flag: VERSE_FLAGS, seen: LOG_TAKEN };
/** Asked, and the three held: they are sung to him the next time he is met. */
export const SING: QuestCond = { flag: [ELEVEN_ASKED, ...VERSE_FLAGS], seen: LOG_TAKEN };

export const MONASTERY: MapDef = {
  id: 'monastery',
  name: 'Highcell',
  kind: 'dungeon',
  band: [22, 24],
  region: 'whitespine',
  start: { x: 7, y: 1, facing: SOUTH },
  // The range's grey stone, limewashed pale and swept, and the floor flags worn in the walks.
  palette: { wall: '#a8a294', wallDark: '#726c60', floor: '#5c564c', ceiling: '#24211d', door: '#5a4430', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#6e5a45' },
  bare: true,
  rows: [
    '################',
    '#######.########',
    '#######.########',
    '#...#.......D..#',
    '#...#.o.o.o.####',
    '#...D.......D..#',
    '#...#.o...o.####',
    '#...#.......D..#',
    '#####.o.o.o.####',
    '#####.......D..#',
    '#####.#####.####',
    '#.....#####...##',
    '#.#########...##',
    '#.#....####...##',
    '#......#########',
    '################',
  ],
  exits: [
    // The gate, back out onto the road's end on J11 (GATE).
    { x: 7, y: 1, to: 'monksvale_j11', tx: 26, ty: 23, tf: NORTH, label: 'Out at the gate, and the brother in it bows you out into the cold.' },
    // The night stair, down to the chapter house.
    { x: 13, y: 13, to: 'monastery2', tx: 7, ty: 1, tf: SOUTH, label: 'You go down the night stair, a long way down, into the lower house.' },
  ],
  features: [
    // The gate's passage and the cloister, the garth and its well.
    { kind: 'event', x: 7, y: 2, id: 'hc1_gate', once: true, text: 'Inside the wall a cloister, swept bare round a garth of snow. Nothing in it is out of its place.' },
    { kind: 'well', x: 8, y: 6, text: 'The well in the garth. Its bucket hangs dry, and no foot has crossed the snow to it.' },
    // The board of the hours, in Kiln-script (#538), and the refectory.
    { kind: 'sign', x: 5, y: 4, id: 'hc1_board', text: 'By the refectory door a board of the hours, chalked fresh in the old script.', read: 'KEEP THE HOURS. KEEP THE HOUSE. OPEN THE GATE.' },
    { kind: 'event', x: 2, y: 5, id: 'hc1_refectory', once: true, text: 'The refectory: long tables laid, a bowl and a spoon at every place. The bowls are dusted, and empty.' },
    // The cells along the east walk, a brother standing in each. The one in the first takes the
    // Lantern's badge from a company that carries it (The Eagles' Nest, #56's 46, #506), as the Reader
    // at Lantern Watch does: either ends it.
    { kind: 'event', x: 11, y: 5, id: 'hc1_cells', once: true, text: 'A brother in each cell, standing. Not one of them is praying.' },
    { kind: 'npc', x: 14, y: 3, name: 'A brother in its cell', lines: [
      'A brother stands in the first cell, its face a hand from the wall, its hands in its sleeves.',
      'Its breath does not show on the cold stone.',
    ], says: [
      { after: { item: 'lantern_badge' }, lines: ['The brother in the first cell turns its hood to the badge in your hand, and holds out its own.'], choice: { ask: 'It holds out its hand.', answers: [
        { label: 'Give it the badge.', takes: 'lantern_badge', sets: NEST_CELL, pay: { xp: 1200 }, says: [
          'Its fingers close on the badge, and it turns back to the wall.',
          'It bows to the stone, the same bow to the inch.',
        ] },
      ] } },
    ] },
    // The Novice in the last (The Novice, #56's 45, #506): his letter to his mother at Anvilhall, and on
    // the company's return, told or not. Told, he walks out at the gate, home to her (anvilhall.ts).
    { kind: 'npc', x: 14, y: 9, name: 'A novice', flag: 'q_novice', until: { flag: NOVICE_TOLD }, lines: [
      'A boy in a novice\'s robe too big for him, sweeping a floor already clean.',
      '"They let me in at the gate. Nobody has said a word to me since."',
      '"I keep the fasts with them. I have never once seen a brother break one."',
    ], choice: { ask: '"Would you take a letter to my mother? She is at Anvilhall."', answers: [
      { label: 'Take his letter.', sets: 'q_novice_letter', gives: 'novice_letter', says: ['He takes it out of his sleeve, sealed with candle wax, and puts it in your hand without letting go of it at once.'] },
      { label: 'Not now.', says: ['"Another day, then." He goes back to his sweeping.'] },
    ] }, says: [
      { after: { flag: NOVICE_KEPT }, lines: ['The novice sweeps a floor already clean.', '"She is well. I keep the fasts."'] },
      { after: { flag: 'q_novice_home' }, lines: ['The novice leans on his broom in the door of the last cell.', '"You found her? Did she read it?"'], choice: { ask: '"What did she say?"', answers: [
        { label: 'Tell him.', sets: NOVICE_TOLD, pay: { xp: 1200 }, says: [
          'He hears you out, looking down the walk at the brothers in their cells. Not one of them looks back.',
          'He leans the broom by the door and walks out at the gate, and the brother in it bows him by.',
        ] },
        { label: 'Say she is well.', sets: NOVICE_KEPT, pay: { xp: 1200 }, says: ['"Good. Tell her I keep the fasts."', 'He goes back to his sweeping.'] },
      ] } },
      { after: { flag: 'q_novice_letter' }, lines: ['The novice sweeps a floor already clean.', '"Anvilhall. Ask on the terraces for the woman who knits."'] },
    ] },
    // The bell tower's foot, the stair winding up, and the bells, where the Laureate hides among the
    // ringers (the Bard's third, #448).
    { kind: 'event', x: 3, y: 11, id: 'hc1_tower', once: true, text: 'The foot of the bell tower. A stair winds up into the dark beside the ropes.' },
    { kind: 'event', x: 1, y: 13, id: 'hc1_stair', once: true, text: 'Up and round the stair goes, the ropes going up beside it, taut.' },
    { kind: 'event', x: 4, y: 13, id: 'hc1_bells', text: 'Under the bells the ringers stand at their ropes. On the hour they ring: eleven, a gap, eleven.' },
    // Brother Lark teaches the Bard's third (#448) for The Eleven: asked by a company with a Skald of
    // 27, he wants the eleven's three verses, and once they are sung to him under the bells it is done.
    { kind: 'npc', x: 6, y: 14, name: 'Brother Lark', lines: [
      'One of the ringers pulls a beat behind the rest, and breathes. A man, thin, in a robe that is not his.',
      '"Keep still and they take you for one of them. Three winters I have kept still."',
      '"Eleven, a gap, eleven. I came to set it to words. There are no words for it."',
    ], says: [
      { after: { flag: ELEVEN_SUNG }, lines: ['Brother Lark pulls his rope a beat behind the rest. Under his breath he is singing.'] },
      { after: SING, sets: ELEVEN_SUNG, lines: ['Under the bells you sing him the count, the doors and the light. On the hour they ring, and every word falls on a stroke.', '"There. Words for it, at last."'] },
      { after: { flag: ELEVEN_ASKED }, lines: ['"A drowned bell\'s count, a miners\' hymn, a lighthouse log. Bring me all three."'] },
      { after: { member: { cls: 'bard', level: 27, prestige: 2 } }, lines: ['The ringer a beat behind looks at your bard, and keeps pulling.', '"Somebody sang the eleven before me, in other places. Find me their verses, and we will sing them here."'], choice: { ask: '"Will you find them?"', answers: [
        { label: 'Find them.', sets: ELEVEN_ASKED, says: ['"A drowned bell\'s count, a miners\' hymn, a lighthouse log. Go quietly."'] },
        { label: 'Not now.', says: ['"I am not going anywhere."'] },
      ] } },
    ], teaches: { cls: 'bard', prestige: 3, asks: 'eleven', done: { flag: ELEVEN_SUNG }, seek: 'Brother Lark, at the ropes in Highcell\'s bell tower a beat behind the rest, can make a Laureate of a Skald.' } },
    // The night stair down.
    { kind: 'event', x: 12, y: 12, id: 'hc1_down', once: true, text: 'A stair goes down out of the cloister, each step worn hollow in the middle.' },
  ],
  encounters: [
    // Brothers at their hours on the east walk, by the cells; and ringers on the tower's stair.
    { id: 'hc1_brothers', x: 11, y: 7, monsters: ['brother', 'brother', 'brother'], aware: 2, respawn: 2880, roams: false },
    { id: 'hc1_ringers', x: 1, y: 12, monsters: ['bell_ringer', 'bell_ringer', 'bell_ringer', 'bell_ringer'], aware: 2, respawn: 2880, roams: false },
  ],
};
