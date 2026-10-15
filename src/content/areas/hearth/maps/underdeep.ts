// The Ways, the Underdeep's first level: the hull's service ways under the crypt. From the grey door's
// foot, 16,30, a main way runs north up the middle to the Stair's head, a door at 16,2 (#758). Off it
// every four rows side ways east and west, each ending in a door with her knot on its frame (59); behind
// the eighth (20,14) a room with the hatch in its north wall (24,14), onto a crawl
// way north to the Stair below its fights, and the way on east and north to the crack the Sunder made
// (29,6, 61). West along the row-10 way, the CREW ONLY door from the inside (2,10, 60). Band 30;
// docs/areas/hearth_isle.md §4.6 is its brief.
import type { Exit, MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH, WEST } from '../../../../game/types.ts';

/** The CREW ONLY door opened from the inside and left open (60), by its answer. */
export const CREW_OPEN = 'q_crew_open';
/** The CREW ONLY door opened, gone through and shut behind (60), by its answer. */
export const CREW_SHUT = 'q_crew_shut';
/** The crack the Sunder made, sealed with the knocker's hammer (61). */
export const CRACK_SEALED = 'q_crack_sealed';
/** The crack widened onto the Lanterns' hall the Sunder swallowed (61). */
export const CRACK_WIDE = 'q_crack_wide';

/** The Stair's head (#758), through the door at 16,2. */
export const STAIR_DOOR: Exit = { x: 16, y: 1, to: 'underdeep2', tx: 16, ty: 30, tf: NORTH, label: 'Through the door at the ways\' end, onto a stair that goes down further than your lamp.' };
/** The crawl way's door onto the Stair's fourth landing, below its fights (59, #758). */
export const CRAWL_DOOR: Exit = { x: 24, y: 1, to: 'underdeep2', tx: 24, ty: 18, tf: SOUTH, label: 'Out of the crawl way onto the stair, well below its head. Nothing up here saw you.' };

const many = (n: number, id: string): string[] => Array.from({ length: n }, () => id);
const knot = (n: number, x: number, y: number, text: string) => ({ kind: 'event' as const, x, y, id: `ud_knot${n}`, once: true, text });
const AGAIN = 'Her knot again, at the same height.';

export const UNDERDEEP: MapDef = {
  id: 'underdeep',
  name: 'The Ways',
  kind: 'dungeon',
  band: [30, 30],
  region: 'hearth',
  // At the grey door's foot, facing up the main way.
  start: { x: 16, y: 30, facing: NORTH },
  // The Dead-Drop's grey, smooth and cold, lit from nowhere, and nothing hung on it.
  palette: { wall: '#8a8c90', wallDark: '#5e6064', floor: '#6a6c70', ceiling: '#4a4c50', door: '#5a5c60', wallStyle: 'smooth', ceilingStyle: 'vault', banner: '#3a3c40' },
  bare: true,
  rows: [
    '################################',
    '################.#######D#######',
    '################D#######.#######',
    '################.#######.#######',
    '################.#######.#######',
    '################.#######.#######',
    '################.#######.#....##',
    '################.#######.#.#####',
    '################.#######.#.#####',
    '################.#######.#.#####',
    '##D..............#######.#.#####',
    '################.#######.#.#####',
    '################.#######.#.#####',
    '#######.....####.#######.#.#####',
    '#######.....D.......D..#S#.#####',
    '#######.....####.####......#####',
    '################.###############',
    '########....####.####....#######',
    '########....D.......D....#######',
    '########....####.####....#######',
    '################.###############',
    '#######.....####.####....#######',
    '#######.....D.......D....#######',
    '#######.....####.####....#######',
    '################.###############',
    '########....####.####....#######',
    '########....D.......D....#######',
    '########....####.####....#######',
    '################.###############',
    '################.###############',
    '################.###############',
    '################.###############',
  ],
  exits: [
    // Back up through the grey door onto the knot's square in the crypt, facing away from the door.
    { x: 16, y: 31, to: 'hearthfane2', tx: 8, ty: 2, tf: SOUTH, label: 'Back through the grey door, up into the cold of the crypt.' },
    // The CREW ONLY door, there once it is answered either way (60): onto the Clean Corridor's floor before
    // the mines' side of it, which stays a door drawn in a wall (deep_mines3 13,3).
    { x: 2, y: 10, to: 'deep_mines3', tx: 13, ty: 3, tf: WEST, after: [{ flag: CREW_OPEN }, { flag: CREW_SHUT }], label: 'Through the door marked CREW ONLY, from the inside, into the Tiefzeche\'s lowest level.' },
    // Down onto the Stair (#758): through the last door at the ways' end onto its head, and out of the crawl
    // way onto its fourth landing, below its fights.
    STAIR_DOOR,
    CRAWL_DOOR,
  ],
  features: [
    { kind: 'event', x: 16, y: 29, id: 'ud_in', once: true, text: 'Corridors, clean and humming and lit from nowhere. The walls are one face with no join, and they are warm.' },
    { kind: 'event', x: 16, y: 24, id: 'ud_voice', once: true, text: 'Something in the wall speaks, very soft, like someone talking in their sleep in the next room. "Captain." Not asking.' },
    // Her knot on every frame (59), in the order she came down: west then east, row by row north.
    knot(1, 12, 26, 'A frame, and on it at a girl\'s shoulder a loop inside a loop, scratched with a nail.'),
    knot(2, 20, 26, AGAIN), knot(3, 12, 22, AGAIN), knot(4, 20, 22, AGAIN), knot(5, 12, 18, AGAIN), knot(6, 20, 18, AGAIN),
    knot(7, 12, 14, 'Her knot, and a smear of blood on the frame beside it. Not hers: the grey comes off a hand that bled.'),
    // The eighth is the hatch's hint.
    knot(8, 20, 14, 'Her knot, cut deeper than the others, as if she pressed harder here. Behind this frame the wall is thinner: you can hear the stair.'),
    // A keeper's store behind the first west frame.
    { kind: 'chest', x: 11, y: 27, id: 'ud_store', gold: 1800, items: ['grey_shield'] },
    // The crew's stores behind the third west frame, and the rats in them (#794).
    { kind: 'event', x: 8, y: 22, id: 'ud_rats', once: true, text: 'Rats. Even here. Nobody brought them; they came aboard the way rats do.' },
    { kind: 'chest', x: 7, y: 21, id: 'ud_crew_store', gold: 2000, items: [] },
    // A second keeper's store, behind the third east frame (#794).
    { kind: 'chest', x: 24, y: 17, id: 'ud_store2', gold: 2200, items: [] },
    // The crawl way behind the frames, through the hatch: the unwatched way onto the Stair (59).
    { kind: 'event', x: 24, y: 13, id: 'ud_hatch', once: true, text: 'A crawl way a knocker\'s height, running north behind the frames. The dust in it is undisturbed.' },
    { kind: 'chest', x: 24, y: 4, id: 'ud_crawl_chest', gold: 2200, items: ['potion_sp_great', 'potion_sp_great', 'potion_sp_great'] },
    // The CREW ONLY door from the inside (60): its marks on the way, the feet on the square before it, and the
    // door, a person with no face. The feet are an event, which the interactable skips, so a company on 3,10
    // facing west talks to the door ahead and steps forward through; a sign there would be the interactable on
    // its own square, and the door could be spoken to only from its own square, its way a wall after.
    { kind: 'sign', x: 4, y: 10, id: 'ud_crew_sign', text: 'A door in the ways\' west wall, shut, and over it marks like the Kilns\'.', read: 'CREW ONLY. THE MINES BEYOND.' },
    { kind: 'event', x: 3, y: 10, id: 'ud_feet', once: true, text: 'Hundreds of footprints in the dust before the door, walking in. On the door\'s inner face, a bar, and a handle. It opens from this side.' },
    {
      kind: 'npc', x: 2, y: 10, name: 'The door marked CREW ONLY', until: [{ flag: CREW_OPEN }, { flag: CREW_SHUT }],
      lines: ['The door\'s inner face: a bar across it, and a handle, and the dust of hundreds of feet before it. From this side it is only a door.'],
      choice: { ask: 'Open it?', answers: [
        { label: 'Open it, and leave it open.', sets: CREW_OPEN, pay: { xp: 2000 }, says: ['The bar comes up and the door swings out onto the Tiefzeche\'s lowest level, where the footprints began. The hum goes out through it into the mine.', 'You leave it standing open. Behind you, something knocks, and comes to look.'] },
        { label: 'Go through and shut it.', sets: CREW_SHUT, pay: { xp: 2000 }, says: ['The bar comes up and the door swings out onto the Tiefzeche\'s lowest level, where the footprints began.', 'You go through, and pull it to behind you, and it is a wall with a door drawn on it again. The hum stops at it.'] },
      ] },
    },
    // The crack the Sunder made (61), and the knocker that found it, a person.
    { kind: 'event', x: 28, y: 6, id: 'ud_crack', once: true, text: 'A deep knocker standing still at the wall, its hammer raised and not falling. Before it, a crack the width of a hand, and through it daylight the colour of glass.' },
    {
      kind: 'npc', x: 29, y: 6, name: 'The knocker at the crack', until: [{ flag: CRACK_SEALED }, { flag: CRACK_WIDE }],
      lines: ['The knocker stands with its hammer raised over the crack, and has stood so, by the dust on it, for a long time. It has found the thing it was made to find, and it does not know what to do.', 'Its light goes over the crack, and over you, and back to the crack.'],
      choice: { ask: 'Its hammer waits. Seal the crack with it, or widen it?', answers: [
        { label: 'Seal it.', sets: CRACK_SEALED, pay: { xp: 4000 }, says: ['You hold the plate to the crack and the hammer comes down, and down, and the daylight the colour of glass goes out of it a blow at a time.', 'The knocker lowers its hammer, and its light goes dim, and it stands there. It is finished. Far above you, in a split wood, something stops coming.'] },
        { label: 'Widen it.', sets: CRACK_WIDE, gives: 'old_lanterns_staff', pay: { xp: 4000 }, says: ['Blade and hammer together, and the wall comes away in a sheet.', 'Behind it, a Lanterns\' hall the Sunder swallowed, and on its lectern a staff with a lamp in its head, still lit. You take it.'] },
      ] },
    },
    { kind: 'event', x: 16, y: 3, id: 'ud_end', once: true, text: 'The ways end at a door, and the hum beyond it has a floor to it: a stair, going down.' },
  ],
  secrets: [{ x: 24, y: 14, hint: 'ud_knot8' }],
  encounters: [
    // The machine at work and the rats, rising from the grey door: the knockers in the first bays (28),
    // the keepers and rats on (30), the crawlers last at the Stair's head (31). The table's twelfth row
    // stands on the Deep Mines' side (60) and is the road behind's.
    { id: 'ud_rats1', x: 16, y: 27, monsters: many(12, 'deep_rat'), aware: 3, respawn: 1440 },
    { id: 'ud_knockers1', x: 9, y: 26, monsters: ['deep_knocker', 'deep_knocker', 'keeper'], aware: 2, respawn: 2880 },
    { id: 'ud_knockers2', x: 22, y: 26, monsters: many(3, 'deep_knocker'), aware: 2, roams: false, respawn: 2880 },
    { id: 'ud_keepers2', x: 21, y: 21, monsters: many(4, 'keeper'), aware: 2, respawn: 2880 },
    // The rats in the crew's stores behind the third west frame (#794): the box's pay.
    { id: 'ud_rats3', x: 10, y: 22, monsters: many(12, 'deep_rat'), aware: 3, respawn: 1440 },
    { id: 'ud_keepers1', x: 11, y: 17, monsters: many(3, 'keeper'), aware: 2, respawn: 2880 },
    { id: 'ud_rats2', x: 8, y: 13, monsters: many(12, 'deep_rat'), aware: 3, respawn: 1440 },
    { id: 'ud_keepers3', x: 16, y: 12, monsters: many(4, 'keeper'), aware: 2, respawn: 2880 },
    { id: 'ud_crew_guard', x: 12, y: 10, monsters: ['keeper', 'keeper', 'deep_knocker'], aware: 2, respawn: 2880 },
    { id: 'ud_keepers4', x: 16, y: 8, monsters: many(4, 'keeper'), aware: 2, respawn: 2880 },
    // The first crawlers, down off the ceiling at the Stair's head: the level's hardest.
    { id: 'ud_crawlers', x: 16, y: 5, monsters: many(2, 'deep_crawler'), aware: 3, respawn: 2880 },
    // By the crack, never roaming; once it is sealed they go to it and are gone, standing or not (#747).
    { id: 'ud_knockers3', x: 26, y: 6, monsters: many(2, 'deep_knocker'), aware: 2, roams: false, respawn: 2880, until: { flag: CRACK_SEALED }, leaves: true },
  ],
};
