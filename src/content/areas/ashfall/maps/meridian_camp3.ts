// Meridian Camp, level three: the camp, the Lost Expedition's end. Down the corridors' stair (STAIR2) out of
// the heat into cold iron, and the Company's last chalk arrow; then firelight, and in an iron hall the
// tents, laced shut but one, and Oriel Fane at his fire, the third of their camps and the only warm one, who
// gives his map at the first meeting; a second grave; the plotting table; beside the hall, through a door
// with no name, a room with a window. Up a cold flue off the hall the foot of Fane's rope, a way out to the
// lookout on Fire Mountain's shoulder (ROPE) and never in. Down steps off the hall the deep knockers'
// gallery, knocking on iron that never cracked, which come up the steps by night and leave Fane be, and at
// its end the inspector before the door to the service ways, which opens for nobody. Once the Stone is lit a
// sentry is on the stair, going up. Band 26, the area's top, its gallery at 28; docs/areas/meridian_camp.md
// §4.3 is its brief.
import type { Choice, Exit, MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

/**
 * Fane's rope (#22; meridian_camp.md §8, 3): from its foot up the cold flue off the hall, 19,2, onto Fire
 * Mountain's shoulder at G11's 13,10, beside the lookout, facing south. A way out and never in, as Kelp
 * Hole's flooded passage is: nothing on G11 leads back down it.
 */
export const ROPE: Exit = { x: 19, y: 2, to: 'firemount_g11', tx: 13, ty: 10, tf: SOUTH,
  label: 'Up the rope, a long cold climb in the dark, and out through a crack into wind on the mountain\'s shoulder.' };

/** Fane's map, held out at the first meeting whatever was read (EXPANSION §2.3): its giving is the Lost Expedition done. */
const MAP: Choice = {
  ask: 'He holds out a roll of oilcloth, sewn shut along its seam.',
  answers: [
    { label: 'Take it.', sets: 'meridian_map', gives: 'fane_map', says: [
      'It is heavier than it looks. "Every span of it walked," he says, and turns back to the fire.',
    ] },
  ],
};

export const MERIDIAN_CAMP3: MapDef = {
  id: 'meridian_camp3',
  name: 'The Camp',
  kind: 'dungeon',
  band: [27, 28],
  region: 'ashfall',
  start: { x: 4, y: 1, facing: SOUTH },
  // Iron gone cold, grey as a winter sea, smooth and seamless, and nothing hung on it.
  palette: { wall: '#4c5257', wallDark: '#2e3236', floor: '#383c40', ceiling: '#0e1012', door: '#5a5248', wallStyle: 'smooth', ceilingStyle: 'vault', banner: '#7a4a2a' },
  bare: true,
  // The door to the service ways: a wall with a door drawn in it, as the Deep Mines' CREW ONLY is.
  legend: { Z: { solid: 'wall', door: 'door' } },
  rows: [
    '################################',
    '####.###########################',
    '###...#############.############',
    '####.##############.############',
    '####.##############.############',
    '####.##############.############',
    '####.#####............##########',
    '####.#####............##########',
    '####..................##########',
    '##########..#......#..##....####',
    '##########.............D....####',
    '##########............##....####',
    '##########..#......#..##########',
    '##########............##########',
    '##########............##########',
    '###############.################',
    '###############.################',
    '###############.################',
    '###############.################',
    '###############.################',
    '###############.################',
    '###############.################',
    '###############.################',
    '###############.################',
    '###############.################',
    '###############.################',
    '###..........................###',
    '###..........................Z##',
    '###..........................###',
    '################################',
    '################################',
    '################################',
  ],
  exits: [
    // The stair's foot, up onto the corridors' end at the stair's head (STAIR2), facing away from it.
    { x: 4, y: 1, to: 'meridian_camp2', tx: 4, ty: 29, tf: NORTH, label: 'Up the steps into the heat again, onto the corridors\' end.' },
    // The foot of Fane's rope, up the cold flue to G11's lookout: out, and never in (ROPE).
    ROPE,
  ],
  features: [
    // The stair's foot, cold after the corridors; the Company's last arrow; firelight.
    { kind: 'event', x: 4, y: 2, id: 'mc3_in', once: true, text: 'At the stair\'s foot the heat is gone. The iron is cold to the hand, and your breath smokes.' },
    { kind: 'event', x: 4, y: 7, id: 'mc3_arrow', once: true, text: 'A last chalk arrow, and beside it in the same chalk, small, a ring with strokes rising out of it.' },
    // Coming to the fire, the once: the Mapmaker's rung reads it (#635, Fane's Fire).
    { kind: 'event', x: 9, y: 8, id: 'mc3_fire', once: true, text: 'Light on the iron ahead that no lamp gives: firelight, moving. And the smell of smoke.' },
    // The camp: the tents, the kit in one, Fane at his fire, the level's one rest, and by night the knockers.
    { kind: 'event', x: 13, y: 7, id: 'mc3_tents', once: true, text: 'Tents in a row, their guy-lines tied off to rivets in the iron. The flaps of all but one are laced shut.' },
    { kind: 'chest', x: 11, y: 6, id: 'mc3_kit', gold: 1200, items: ['meridian_staff'] },
    { kind: 'camp', x: 15, y: 10, name: 'Fane\'s fire', text: 'A small fire in a ring of stones, banked with care, and the warmth of it on your hands. Nobody has let it go out.' },
    { kind: 'npc', x: 16, y: 10, name: 'Oriel Fane', lines: [
      'An old man at the fire in what is left of a Guild coat, feeding it a lump at a time. He does not get up.',
      '"You took your time." He looks at each of you in turn, as if counting. "Warm yourselves."',
    ], choice: MAP, says: [
      // Once the map is given: his words after, each time.
      { after: { flag: 'meridian_map' }, lines: [
        '"Still here?" He feeds the fire a lump. "Go on up. I have the fire to keep."',
      ] },
      // A company that had the first journal read (Ysolde, Saltmouth): his words know it, and count nothing.
      { after: { flag: 'meridian_read' }, choice: MAP, lines: [
        'An old man at the fire in what is left of a Guild coat. His eyes go to the journal in your pack, and stay there.',
        '"You took your time." He nods, slowly. "So somebody read me. Warm yourselves."',
      ] },
    ] },
    { kind: 'event', x: 15, y: 13, id: 'mc3_lamps', once: true, when: { hours: 'night' }, text: 'Lamps come up the steps in the night and go over everything, tent by tent, pot by pot. Over the old man they do not stop.' },
    { kind: 'event', x: 20, y: 13, id: 'mc3_table', once: true, text: 'A plotting table of iron, and on it a lamp, a rule and a pen, laid square, as if put down a moment ago.' },
    // The second grave, the Company's marks: a chain pin and a note, as the first's on the corridors.
    { kind: 'event', x: 11, y: 13, id: 'mc3_grave', once: true, text: 'Another heap of slag the length of a man, a chain pin at its head. On its note, in a shaking hand: ONE MORE DAY.' },
    // Beside the hall, through a door with no name, the room with the window: what the eyes see, the once.
    { kind: 'event', x: 27, y: 10, id: 'mc3_window', once: true, text: 'A window, its glass a hand thick. Past it the night goes all the way down, full of stars, and not one twinkles.' },
    // Up the cold flue, the foot of Fane's rope.
    { kind: 'event', x: 19, y: 4, id: 'mc3_rope', once: true, text: 'A rope hangs down the flue out of the dark, knotted every arm\'s length. The air coming down it is clean, and cold.' },
    // Down the steps, the deep knockers' gallery, and the door at its end.
    { kind: 'event', x: 15, y: 15, id: 'mc3_steps', once: true, text: 'Steps go down out of the firelight. From below comes knocking, slow and patient, and it never stops.' },
    { kind: 'event', x: 12, y: 27, id: 'mc3_knocks', once: true, text: 'The gallery\'s iron is knocked bright in spots a fist across, in rows, end to end. Not one has a crack.' },
    { kind: 'event', x: 3, y: 27, id: 'mc3_pick', once: true, text: 'A pick at the gallery\'s end, its point turned back on itself like a nail driven into stone.' },
    { kind: 'event', x: 28, y: 27, id: 'mc3_door', once: true, text: 'A door at the gallery\'s end, flush in the iron, with no handle and no hinge. A chain pin is jammed in its seam, bent double.' },
  ],
  encounters: [
    // The deep knockers in their gallery, a three, a lone one and a four along it, and the inspector before the door,
    // which calls them; by night two come up the steps to the camp and leave Fane be (MONSTERS §2), never reaching
    // the fire; and, once the Ember Stone is lit, a sentry at the stair's foot, going up. Six groups: at the floor
    // 27 the eight small ones of floor 26 gave 19.56 fights to a rest, and these, the same ten knockers, 10.64.
    { id: 'mc3_sentry', x: 4, y: 5, monsters: ['sentry'], aware: 4, respawn: 2880, after: { flag: 'q_ember_lit' } },
    { id: 'mc3_night', x: 15, y: 17, monsters: ['deep_knocker', 'deep_knocker'], aware: 2, respawn: 1440, roams: false, when: { hours: 'night' } },
    { id: 'mc3_west', x: 6, y: 27, monsters: ['deep_knocker', 'deep_knocker', 'deep_knocker'], aware: 2, respawn: 2880 },
    { id: 'mc3_knocker', x: 10, y: 26, monsters: ['deep_knocker'], aware: 2, respawn: 2880 },
    { id: 'mc3_four', x: 19, y: 28, monsters: ['deep_knocker', 'deep_knocker', 'deep_knocker', 'deep_knocker'], aware: 2, respawn: 2880 },
    { id: 'mc3_inspector', x: 27, y: 27, monsters: ['inspector'], aware: 3, respawn: 2880 },
  ],
};
