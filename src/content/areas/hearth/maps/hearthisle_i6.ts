// Hearth Isle, box I6: the east rim. Core, band 28-29: the rim's rock in the box's first columns, the
// Bowl's grass coming through from H6 into a pocket on its west edge, and the rim's path carved out of
// the rock from that pocket into Anchorhold's yard, under the cell built into the rim with its door
// bricked up and one window, and on out to the grass of the rim's east foot over the sea. The foot runs
// north under the rim to the hills over the Wyke and south to the Hand's camp at the stair's head, its
// tally-house, crates and boats, the grey door in the rock at its back that opened for Wenna, and below
// it the Hand's Steps, where the causeway from Sheer Point comes up out of the sea. The Hand's takings
// in a pocket carved into the rim behind the tally-house, found from the smell at its foot. The Hand's
// champions where the rim's path begins, the moths over the yard by night, the camp's guard with its
// preacher, gone once Vask is gone from Helmstow, and two more at the stair's head. Hereswith, the
// anchoress, at the cell's window, who teaches the Cleric's third (#763).
// Cut from the atlas by tools/scaffold.ts; docs/areas/hearth_isle.md §4.3 is its brief (#754).
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';
import { THRONE_REMOVED } from '../../shelf/maps/keep.ts';
import { ELEVEN_KEPT, LOG_GIVEN } from './hearthfane2.ts';

/**
 * The Cleric's third (#763), The Eleven Kept: Hereswith asks a cleric of 27 with the second for the Crowness
 * keeper's log, and the ask begins the quest. The log given (`LOG_GIVEN`) and the eleven lit in the crypt
 * (`ELEVEN_KEPT`) are the crypt's to export, which this map reads: one each way would be an import cycle.
 */
export const KEPT_ASKED = 'q_eleven_asked';

const many = (n: number, id: string): string[] => Array.from({ length: n }, () => id);

export const HEARTHISLE_I6: MapDef = {
  id: 'hearthisle_i6',
  name: 'Hearth Isle',
  kind: 'outdoor',
  density: 'core',
  band: [28, 29],
  region: 'hearth',
  // Where the rim's path comes out of the rock over the sea.
  start: { x: 8, y: 19, facing: SOUTH },
  rows: [
    ',,^~~~WWWWWWWWWWWWWWWWWWWWWWWWWW',
    ',,,_~~~WWWWWWWWWWWWWWWWWWWWWWWWW',
    'rr,,_^~~WWWWWWWWWWWWWWWWWWWWWWWW',
    'rr,r,,^~~WWWWWWWWWWWWWWWWWWWWWWW',
    'rrrrr,,_~~WWWWWWWWWWWWWWWWWWWWWW',
    'rrrrr,,_~~WWWWWWWWWWWWWWWWWWWWWW',
    'rrrrrr,,_~~WWWWWWWWWWWWWWWWWWWWW',
    'rrrrrr,,,_~~WWWWWWWWWWWWWWWWWWWW',
    'rrrrrrr,,_~~WWWWWWWWWWWWWWWWWWWW',
    'rrrrrrrr,,_~~WWWWWWWWWWWWWWWWWWW',
    'rrrrrrrr,,_~~WWWWWWWWWWWWWWWWWWW',
    'rrrrrrrr,,,_~~WWWWWWWWWWWWWWWWWW',
    ',rrrrrrrr,,_~~WWWWWWWWWWWWWWWWWW',
    ',rrrrrrrr,,_~~WWWWWWWWWWWWWWWWWW',
    ',,rrrrrrr,,_~~WWWWWWWWWWWWWWWWWW',
    ',,rrrrrrr,,_~~WWWWWWWWWWWWWWWWWW',
    ',rrrrrrrr,,_~~WWWWWWWWWWWWWWWWWW',
    ',rrrrrrrr,,,_~~WWWWWWWWWWWWWWWWW',
    ',::rBrrrr,,_~~WWWWWWWWWWWWWWWWWW',
    'rr::::::,,,_~~WWWWWWWWWWWWWWWWWW',
    'rr::::rr,,__~~WWWWWWWWWWWWWWWWWW',
    'rrrrrrrr,_~~~WWWWWWWWWWWWWWWWWWW',
    'rrrrrrr,_~~~WWWWWWWWWWWWWWWWWWWW',
    'rrrrr,,_,_~~WWWWWWWWWWWWWWWWWWWW',
    '::S,,,_~_~~WWWWWWWWWWWWWWWWWWWWW',
    'rr,,,,_~~~WWWWWWWWWWWWWWWWWWWWWW',
    'rr,,__~~~WWWWWWWWWWWWWWWWWWWWWWW',
    ',,,_~~~WWWWWWWWWWWWWWWWWWWWWWWWW',
    ',,_~~~WWWWWWWWWWWWWWWWWWWWWWWWWW',
    ',___~~WWWWWWWWWWWWWWWWWWWWWWWWWW',
    '_~~~~WWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '~~~~WWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  ],
  features: [
    // Anchorhold, the cell built into the rim's rock at 4,18 (a building, not walked into), and its yard
    // carved below it, 2-5,19-20, where the pilgrims stood at the window. Hereswith, the anchoress, at the
    // window at 4,19, teaches the Cleric's third (#763): she takes the Crowness keeper's log whenever it is
    // first brought, asks it of a cleric of 27 with the second until it is given, and sends the company
    // down to the crypt's eleven lamps (hf2_eleven), which her teaching waits on.
    { kind: 'npc', x: 4, y: 19, name: 'Hereswith, the anchoress', lines: [
      'A voice from the window in the bricked-up door, and a face behind it, old, and lit from the side by the column. She says the hour before she says anything else.',
      '"Hereswith. I was walled in here at thirty to keep the hour against the light, and I have kept it fifty years, and the light has kept it with me, mostly." A pause. "Not the night the Queen died. That night it kept its own."',
      '"Eleven. I counted from here. I should like to know whether anyone else did."',
    ], flag: 'i6_anchoress_met', quest: { item: 'keepers_log', reward: 0, setFlag: LOG_GIVEN, early: [
      'She reads it at the window, holding it to the light, and reads it again.',
      '"Crowness. A grace between each, the pairs even. Yes. He counted what I counted." She keeps it. "Now I know."',
      '"You came a long way for an old woman\'s hour. Go down into the fane\'s crypt: eleven lamps stand there, cold since that night. Light them as he wrote them, and I will keep the top."',
    ], done: [
      'She reads it at the window, holding it to the light, and reads it again.',
      '"Crowness. A grace between each, the pairs even. Yes. He counted what I counted." She keeps it. "Now there are two of us, and the gaps are written down."',
      '"Go down into the fane\'s crypt. Eleven lamps stand there for the eleven, cold since that night. Light them as he wrote them, the gaps and all, and I will keep the hour up here while you do. Not with you: I keep the top. That is what an anchorhold is for."',
    ] }, says: [
      { after: { flag: ELEVEN_KEPT }, lines: [
        'The hour, from the window, and then: "The hum changed key an hour ago, and held. That was you."',
        '"Fifty years I thought the hour was mine to keep. It was the light\'s. Come to the window, Prelate, and I will show you what an Exarch keeps."',
      ] },
      { after: { flag: LOG_GIVEN }, lines: ['The hour, from the window. "Eleven lamps, in the crypt under the fane. The gaps are in the book. Go on down; I have the top."'] },
      { after: { flag: 'i6_anchoress_met', member: { cls: 'cleric', level: 27, prestige: 2 } }, until: { flag: LOG_GIVEN }, sets: KEPT_ASKED, lines: [
        'She looks a long while at your cleric through the window.',
        '"You have the Prelate\'s look. There is a keeper at Crowness Light, on the far shore of everything, who counted the eleven the night the Queen died and wrote the gaps down. Bring me his log, and we will see whether we counted the same."',
      ] },
    ], teaches: { cls: 'cleric', prestige: 3, asks: 'eleven_kept', done: { flag: ELEVEN_KEPT }, seek: 'Hereswith, the anchoress walled into Anchorhold on Hearth Isle\'s east rim, keeps the hour against the light, and can make an Exarch of a Prelate.' } },
    { kind: 'event', x: 5, y: 19, id: 'i6_cell', once: true, text: 'A cell built into the rim, its door bricked up with its own stone. One window, with a cup on its sill, and a voice behind it saying the hour.' },
    { kind: 'event', x: 3, y: 19, id: 'i6_wall', once: true, text: 'Scratched on the cell\'s outside, in years of different hands: the hours, as pilgrims kept them for her. Eleven, always eleven.' },
    // The rim's path out of the yard onto the east foot, the causeway seen; north under the rim, a boat
    // broken up, and the rim's north end over the Wyke.
    { kind: 'event', x: 8, y: 19, id: 'i6_path', once: true, text: 'The rim\'s path, and over the sea to the south-east the causeway, stone by stone, all the way to Sheer Point.' },
    { kind: 'event', x: 8, y: 10, id: 'i6_keel', once: true, text: 'A boat\'s keel on the grass under the rim, stripped to the ribs. Its planks went to the Hand\'s fires.' },
    { kind: 'event', x: 5, y: 2, id: 'i6_wyke', once: true, text: 'The rim\'s north end. Across the Wyke, Thornmark\'s shore, near enough to count the oaks and too far to reach.' },
    // The Hand's Steps, the causeway's end, and its camp at the stair's head (2-6,23-26).
    { kind: 'event', x: 3, y: 27, id: 'i6_steps', once: true, text: 'A stair of cut stone comes up out of the sea onto the sand. Every step glows the way the shards do. The road from Sheer Point ends here.' },
    { kind: 'event', x: 4, y: 25, id: 'i6_camp', once: true, text: 'The Hand\'s camp at the stair\'s head: grey tents, grey boats drawn up and the ashes of a fire nobody has tended for days.' },
    { kind: 'event', x: 6, y: 24, id: 'i6_crates', once: true, text: 'Crates under the Hand\'s seal, every one open and empty. The straw is grey with the dust of the stones.' },
    { kind: 'event', x: 3, y: 24, id: 'i6_tally', once: true, text: 'A tally-house of planks, and on its slate the count, finished: the last row crossed through, and under it, ELEVEN. DONE.' },
    { kind: 'chest', x: 6, y: 25, id: 'i6_camp_chest', gold: 500, items: ['grey_staff'] },
    // The grey door in the rock at 5,22, at the camp's back: an event and no exit, no lock (§9, call 3).
    { kind: 'event', x: 5, y: 23, id: 'i6_door', once: true, text: 'A door of grey in the rock, no handle, no seam, at the camp\'s back. The ground before it is trodden flat by two hundred feet going in. It does not open for you, and it never will.' },
    { kind: 'event', x: 6, y: 23, id: 'i6_knot', once: true, text: 'On the frame, at the height of a girl\'s shoulder, a loop inside a loop, and under it a second mark, newer, scratched in a hurry.' },
    // The secret: the smell at the rim's foot behind the tally-house, the rock at 2,24 that opens on a
    // search, and the Hand's takings in the pocket behind it, carved: the heaps seen, the hoard taken.
    { kind: 'event', x: 2, y: 25, id: 'i6_smell', once: true, text: 'Lamp oil, and under it the smell of the sea cave under Rook\'s Nest.' },
    { kind: 'event', x: 1, y: 24, id: 'i6_takings', once: true, text: 'The Hand\'s takings, cut into the rock: coin from every town on the road, and grey parts sorted into heaps by size.' },
    { kind: 'chest', x: 0, y: 24, id: 'i6_hoard', gold: 1200, items: ['grey_mail'] },
  ],
  secrets: [{ x: 2, y: 24, hint: 'i6_smell' }],
  encounters: [
    // The Hand's champions in the Bowl's pocket where the rim's path begins, so Anchorhold is reached with
    // a fight; the moths over the yard by night; the camp's guard, the box's hardest, never roaming and
    // gone by the leave rule once Vask is gone from Helmstow (#747); and two at the stair's head.
    { id: 'i6_rim', x: 0, y: 17, monsters: many(3, 'ashen_champion'), aware: 3, respawn: 2880 },
    { id: 'i6_moths', x: 5, y: 20, monsters: many(12, 'hearth_moth'), aware: 3, respawn: 1440, when: { hours: 'night' } },
    { id: 'i6_guard', x: 4, y: 24, monsters: [...many(3, 'ashen_champion'), 'ashen_preacher'], back: 1, aware: 3, roams: false, respawn: 2880, until: { flag: THRONE_REMOVED }, leaves: true },
    { id: 'i6_guard2', x: 3, y: 26, monsters: many(2, 'ashen_champion'), aware: 2, roams: false, respawn: 2880 },
  ],
};
