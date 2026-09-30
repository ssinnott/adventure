// Beneath the Grove, level two: the Cut Stone. Three square rings of Underdeep corridor around
// the Grove Stone itself. A secret door opens the second ring, a door the third, and an iron key
// the chamber. The Hand of Ash waits at the Stone, and what its cut let through waits beside it.
import type { MapDef } from '../../../../game/map.ts';
import type { When } from '../../../../game/quests.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

/** The tear closing, the Warden of the Cut's death: past it the Rift that came through stops coming back. */
export const TEAR_CLOSED: When = { slain: 'grove2:g2_warden' };

export const GROVE2: MapDef = {
  id: 'grove2',
  name: 'The Cut Stone',
  kind: 'dungeon',
  band: [8, 10],
  region: 'thornmark',
  start: { x: 1, y: 1, facing: SOUTH },
  palette: { wall: '#7a8290', wallDark: '#4e5460', floor: '#3a3e48', ceiling: '#2a2c34', door: '#5a5a66', wallStyle: 'brick', ceilingStyle: 'vault', banner: '#8a2a22' },
  rows: [
    '################',
    '#..............#',
    '#.############.#',
    '#.#..........#.#',
    '#.#.########.#.#',
    '#.#.#......#.#.#',
    '#.#.#.####.#.#.#',
    '#.#.#.#..#.#.#.#',
    '#.#.#.#..#.#.#.#',
    '#.#.#.#L##.#.#.#',
    '#.#.#......D.#.#',
    '#.#.########.#.#',
    '#.#..........#.#',
    '#.####S#######.#',
    '#..............#',
    '################',
  ],
  exits: [
    { x: 1, y: 1, to: 'grove1', tx: 11, ty: 11, tf: NORTH, label: 'Up the stairs into the roots.' },
  ],
  features: [
    { kind: 'event', x: 1, y: 2, id: 'g2_in', once: true, text: 'The corridors here are square, smooth, and older than the trees above. Underdeep work, the Lanterns would say, if any were here.' },
    { kind: 'event', x: 6, y: 14, id: 'g2_hint', once: true, text: 'Fresh chisel marks score the north wall here, and there is grit on the floor. Something was opened.' },
    { kind: 'event', x: 12, y: 12, id: 'g2_ring2', once: true, text: 'Inside the second wall the floor is warm. Glyph panels along the corridor flicker, one in three still lit.' },
    { kind: 'chest', x: 12, y: 3, id: 'g2_key', gold: 200, items: ['key_iron', 'potion_sp_great'] },
    { kind: 'chest', x: 3, y: 12, id: 'g2_c1', gold: 300, items: ['greatsword+1', 'elixir', 'elixir'] },
    { kind: 'event', x: 10, y: 10, id: 'g2_inner', once: true, text: 'Beyond the door the hum is a pressure in the teeth. Ember-light leaks under the innermost wall.' },
    { kind: 'sign', x: 7, y: 10, text: 'Cut into the lintel of the iron door, in a hand you recognise from Ashcombe: THE HEARTH IS A CAGE. THIS IS A BAR OF IT.' },
    { kind: 'event', x: 7, y: 8, id: 'g2_stone', once: true, text: 'The Grove Stone: a standing stone the height of two men, and a hand-span of it cut clean away. Where the cut is, the air is torn. In the tear, something turns to look at you.' },
    { kind: 'chest', x: 8, y: 8, id: 'g2_hoard', gold: 600, items: ['brigandine+2', 'potion_sp_great', 'elixir'] },
    // The Mender (#219): Edith by the Stone once the tear is shut and her kit is back, until she is
    // answered, and the Stone mended after. She waits in the Grove's hollow till then.
    { kind: 'npc', x: 7, y: 7, name: 'Edith, Reader of the Guildhall', lines: [
      'Edith kneels at the Stone\'s foot with the wire laid into the cut and the wand across it, and the silver in the cut is already dull, as if it had always been stone.',
      '"It\'s done. Don\'t touch it for a year." She sits back on her heels. "A cut this clean and this deep, mended in a night. The book says a winter. Either I\'m better than the book, or the Stone wanted mending. I know which I think."',
      '"Something for you, since you did the getting back. The Lanterns are split about Vask. Not openly; Lanterns do nothing openly. But the Guildhall reads his orders one way and the Watch in Sunderwood reads them another, and I was sent by the Guildhall, and I begin to think the Watch has the right of it."',
    ], flag: 'q_mender_done', after: { flag: 'q_mender_kit', slain: 'grove2:g2_warden' }, until: [{ flag: 'q_mender_sliver' }, { flag: 'q_mender_left' }], choice: {
      ask: '"A sliver came off the cut when I dressed it. It hums. It\'s the Stone\'s, and by the book it stays near the Stone. Or you carry it, and see what it does near the other one. Which?"',
      answers: [
        { label: 'We\'ll carry it.', sets: 'q_mender_sliver', gives: 'grove_sliver', says: [
          '"Then carry it near the skin, and don\'t sell it, and if it ever stops humming, run." She puts it in your hand, warm as a coal that has gone out. "The book says nothing about this. That\'s how I know it\'s worth doing."',
        ] },
        { label: 'Leave it with the Stone.', sets: 'q_mender_left', says: [
          '"By the book." She lays it in the cut\'s shadow, where the silver is. "Good. One of us ought to do something by the book, and it was never going to be me."',
        ] },
      ],
    } },
    { kind: 'event', x: 8, y: 7, id: 'g2_mended', once: true, after: { flag: 'q_mender_done' }, text: 'The Grove Stone, whole: a seam of dull silver, and the hum one steady note. The air beside it is only air.' },
  ],
  secrets: [{ x: 6, y: 13, hint: 'g2_hint' }],
  encounters: [
    { id: 'g2_ring1', x: 8, y: 1, monsters: ['wraith', 'wraith', 'bone_knight', 'bone_knight', 'bone_knight', 'bone_knight'], aware: 5, respawn: 2880 },
    { id: 'g2_ring1b', x: 14, y: 8, monsters: ['rift_hound', 'rift_hound', 'rift_hound', 'rift_hound', 'rift_hound', 'rift_hound', 'rift_hound'], aware: 6, respawn: 1440, until: TEAR_CLOSED },
    { id: 'g2_ring1c', x: 5, y: 14, monsters: ['zealot', 'zealot', 'zealot', 'zealot', 'zealot', 'zealot', 'ashen_adept', 'ashen_adept'], aware: 5, respawn: 2880 },
    { id: 'g2_ring2', x: 8, y: 3, monsters: ['bone_knight', 'bone_knight', 'bone_knight', 'bone_knight', 'bone_knight', 'bone_knight'], aware: 4, respawn: 2880 },
    { id: 'g2_keyguard', x: 12, y: 4, monsters: ['ashen_adept', 'ashen_adept', 'ashen_adept', 'ashen_adept', 'ashen_adept', 'ashen_adept', 'ashen_adept'], aware: 3, roams: false },
    { id: 'g2_ring2b', x: 3, y: 8, monsters: ['riftling_elder', 'riftling_elder', 'rift_hound', 'rift_hound', 'rift_hound', 'rift_hound'], aware: 5, respawn: 2880, until: TEAR_CLOSED },
    { id: 'g2_ring2c', x: 8, y: 12, monsters: ['ogre', 'ogre', 'ogre', 'ogre'], aware: 4, respawn: 2880 },
    { id: 'g2_ring3', x: 5, y: 7, monsters: ['wraith', 'wraith', 'wraith', 'wraith', 'wraith'], aware: 5, respawn: 2880 },
    { id: 'g2_ring3b', x: 10, y: 6, monsters: ['riftling_elder', 'riftling_elder', 'riftling_elder', 'riftling_elder'], aware: 5, respawn: 2880, until: TEAR_CLOSED },
    { id: 'g2_hand', x: 7, y: 7, monsters: ['ashen_hand', 'ashen_adept', 'ashen_adept'], aware: 2, roams: false },
    // Said when it dies, not on a cell: whichever side of it the party fights from, this comes after.
    { id: 'g2_warden', x: 8, y: 7, monsters: ['cut_warden', 'riftling_elder', 'riftling_elder'], aware: 1, roams: false,
      slainText: 'With the Warden gone the tear closes like a mouth. The cut in the Stone stays; it will need a Lantern to mend. But nothing more comes through tonight.' },
  ],
};
