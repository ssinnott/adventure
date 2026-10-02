// The Tide Ship, the hold: the chained rows under the beam carved EVERY SHARD IS A STEP, the shards
// packed in straw, the Hand's overseers behind a crew among the rows (MONSTERS §6.2) and Hale in the
// last row; forward, behind its bulkhead, the forward hold, where the Tide Stone glows through its
// sacking with its Rift stood up round it and a Tide Elder before the door. The straw against the
// bulkhead is fresh on one side, where a shard-cut in the planking lets a company past the door. A
// hatch in the floor aft opens on the stair down. Band 12-14; docs/areas/wrackholm.md §4.5 is its
// brief.
import type { MapDef } from '../../../../game/map.ts';
import type { When } from '../../../../game/quests.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';
import { rift } from '../../../rifts/index.ts';

/**
 * Hale taken from the Scarth: a flag #156 sets when it puts strangers at the pass, on its own
 * condition (the ledger given him and Saltreach set foot in), so the pass and the hold never both
 * hold him. Until #156 sets it, the last row holds strangers whatever the company has done.
 */
export const HALE_TAKEN = { flag: 'q_hale_taken' } as const;

/** Hale freed: his meeting, once the hold's crew is down. #191 and Act III key on it. */
export const HALE_FREED: When = { flag: 'q_hale_freed' };

/** The forward hold's tear gone quiet: its Warden fallen. */
export const TIDE_RIFT_CLOSED: When = { slain: 'tide_ship_rift:tide_ship_rift_warden' };

/**
 * The Tide Stone's Rift (#165), stood up round it in the forward hold: a Tide Elder and the brinelings
 * of the Stone's own glass in its rooms, the Warden of the Tide alone at its heart and the Stone in the
 * hoard beside it. Floored at 12, as Kelp Hole is, so the gate judges the Warden at 12 and 14.
 */
export const TIDE_RIFT = rift({
  id: 'tide_ship_rift', template: 'hall', material: 'brine', seed: 2, band: [12, 14], region: 'wrackholm',
  out: { to: 'tide_ship3', tx: 8, ty: 3, tf: SOUTH },
  table: { groups: [['tide_elder', 'brineling', 'brineling', 'brineling']], warden: ['tide_warden'] },
  hoard: { gold: 700, items: ['tide_stone'] },
  until: TIDE_RIFT_CLOSED,
});

/** Hale's words in the last row, before the last iron drops: the same with his token carried or not. */
const HALE_WORDS = [
  'In the last row a man sits straight in his irons, thin as a rake and filthy, his beard gone white, telling the boy beside him to keep his feet out of the wet. He knows you before you know him.',
  '"The Scarth. You brought me a ledger." The voice has not changed. "The Regent got his copy. He came for me that same night."',
  '"Never mind me. The rings pin under the floor; the pins knock out from the bilge. Start at the front, children first, and get them up to the boats before the watch counts heads."',
];

export const TIDE_SHIP3: MapDef = {
  id: 'tide_ship3',
  name: 'The Hold',
  kind: 'dungeon',
  band: [12, 14],
  region: 'wrackholm',
  start: { x: 4, y: 10, facing: NORTH },
  palette: { wall: '#4e3e2e', wallDark: '#32261a', floor: '#3a2e22', ceiling: '#221a12', door: '#3e2e20', wallStyle: 'brick', ceilingStyle: 'beams', banner: '#2a5a4a' },
  rows: [
    '################',
    '#######..#######',
    '######....######',
    '#####......#####',
    '#####......#####',
    '#####S##D#######',
    '####........####',
    '####........####',
    '####........####',
    '####........####',
    '####........####',
    '####........####',
    '####........####',
    '#####......#####',
    '######....######',
    '################',
  ],
  exits: [
    { x: 4, y: 10, to: 'tide_ship2', tx: 4, ty: 9, tf: NORTH, label: 'You climb up through the grating to the lower deck.' },
    { x: 7, y: 14, to: 'dead_drop_stair', tx: 4, ty: 7, tf: NORTH, label: 'You lift the hatch and go down the stair into the cold.' },
  ],
  features: [
    { kind: 'event', x: 4, y: 11, id: 'ts3_in', once: true, text: 'The hold. The smell first, straw and people and old iron; then the dark; then rows of eyes turned to the ladder, and not a sound.' },
    { kind: 'event', x: 6, y: 11, id: 'ts3_rows', once: true, text: 'Rows of rings in the floor, an iron to each. Fishermen by the hands, farmers by the boots, children by the size. Nobody asks who you are.' },
    { kind: 'event', x: 8, y: 8, id: 'ts3_beam', once: true, text: 'The beam over the rows is carved deep, the letters fresh and white in the black oak: EVERY SHARD IS A STEP.' },
    { kind: 'event', x: 10, y: 6, id: 'ts3_shards', once: true, text: 'Crates on their sides, straw spilling, and in the straw, laid like eggs, shards of stone, each with a faint light in it. The straw is warm.' },
    { kind: 'event', x: 5, y: 6, id: 'ts3_straw', once: true, text: 'Straw stacked against the bulkhead. One side is grey and matted, old as the ship; the other yellow and new, and brine comes through it.' },
    { kind: 'event', x: 8, y: 7, id: 'ts3_bulkhead', once: true, text: 'The bulkhead, and a door in it, green light at every seam. Before the door stands something tall and wet that was not there before.' },
    // The last row: strangers, until Hale has been taken from the Scarth; then Hale, once the crew
    // is down, who goes over the side with the freed (#43: he is freed, not handed to). To a company
    // carrying his token (Hale's Sergeant, #558) his last words know it, and leave it in the pack.
    { kind: 'event', x: 10, y: 12, id: 'ts3_last_row', once: true, until: HALE_TAKEN, text: 'The last row. A farmer, a boy, an old woman, irons on all three. None of them looks up. They have stopped looking up.' },
    { kind: 'npc', x: 10, y: 12, name: 'Captain Hale, in irons', flag: 'q_hale_freed', lines: [
      ...HALE_WORDS,
      'When the last iron drops he stands, which costs him, and goes to the ladder on the first man\'s shoulder. He does not look back. "Thank me when it\'s done. It isn\'t."',
    ],
      says: [{ after: { item: 'hale_token' }, sets: ['q_hale_freed', 'q_sergeant_hale'], lines: [
        ...HALE_WORDS,
        'When the last iron drops he stands, which costs him, and sees the disc and knows it. "Mine. Then Wystan got as far as you." Up the ladder on the first man\'s shoulder, not looking back. "Keep it. And thank me when it\'s done. It isn\'t."',
      ] }],
      after: { ...HALE_TAKEN, slain: 'tide_ship3:ts3_crew' }, until: HALE_FREED },
    { kind: 'event', x: 7, y: 13, id: 'ts3_hatch', once: true, text: 'A hatch in the floor, and up through it cold clean air with nothing of ship or sea in it. What is below is not for a company that came for a Stone.' },
    // The forward hold, through the door past the elder or the shard-cut behind the straw: the Hand's
    // strongbox, the pay for the cargo, and the Stone in its tear.
    { kind: 'chest', x: 10, y: 3, id: 'ts3_strongbox', gold: 1200, items: ['long_axe+1', 'elixir'] },
    { kind: 'event', x: 7, y: 3, id: 'ts3_forward', once: true, text: 'The forward hold. A thing the size of a cart under sacking, lit green from inside. Round it the air is torn, and the tear stands up like a door.' },
    TIDE_RIFT.way(8, 2),
  ],
  secrets: [{ x: 5, y: 5, hint: 'ts3_straw' }],
  encounters: [
    // Two overseers behind four, among the rows: the chains hold the front row while the bowmen shoot
    // the back, and the crew breaks once the overseers are down (MONSTERS §6.2).
    { id: 'ts3_crew', x: 7, y: 9, monsters: ['wrack_smuggler', 'wrack_smuggler', 'ashen_overseer', 'ashen_overseer', 'wrack_bowman', 'wrack_bowman'], back: 2, leader: 'ashen_overseer', aware: 3, roams: false, slainText: 'The last of them goes down in the straw. Nobody in the rows cheers. They watch the ladder, and then, slowly, they watch you.' },
    { id: 'ts3_elder', x: 8, y: 6, monsters: ['tide_elder', 'ashen_overseer'], aware: 1, roams: false },
  ],
};
