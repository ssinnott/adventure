// Carn Fada, Cairnmoor's enclave (#845): the drowned cairn under L8's mound, a chambered cairn of the
// oldest dead, built when the sea stood further out, its own passage gone under the tide since. Entered
// by a gap in the mound's face at L8's 22,27, where the facing stones have fallen: down onto the old
// passage at the tide's head, where bog bodies come up out of the water; the passage under its lintels
// to the chamber, where cairn wights keep the mouth; spirals cut in its stones, one turning against the
// rest where a cell is still closed; and the end cell, where ice bears off the loch's foot have made a
// den over the oldest dead's cist and the Sunwise Mace in it. Band 20-21, a band over L8's, out of
// Cairnmoor's figures; docs/areas/cairnmoor.md §12.5 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST, SOUTH } from '../../../../game/types.ts';
import { RESPAWN } from '../../../../game/keys.ts';

export const CARN_FADA: MapDef = {
  id: 'carn_fada',
  name: 'Carn Fada',
  kind: 'dungeon',
  band: [20, 21],
  enclave: true,
  region: 'cairnmoor',
  start: { x: 7, y: 1, facing: SOUTH },
  // Laid slabs, Carn Dubh's stone, grey-green with the sea's damp, the floor wet sand trodden hard.
  palette: { wall: '#6b6f68', wallDark: '#444842', floor: '#3a3a32', ceiling: '#161816', door: '#6b6f68', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#4a5848' },
  bare: true,
  rows: [
    '################',
    '#######.########',
    '#######.########',
    '##WWWW.......###',
    '############.###',
    '############.###',
    '######..####.###',
    '######..####.###',
    '#######S####.###',
    '#...#......#.###',
    '#............###',
    '#...#......#####',
    '#####......#####',
    '#######.########',
    '######...#######',
    '################',
  ],
  exits: [
    { x: 7, y: 1, to: 'cairnfield_l8', tx: 23, ty: 27, tf: EAST, label: 'Out through the gap in the facing stones onto the hill, the tide loud at the mound\'s foot.' },
  ],
  features: [
    // The gap and the old passage at the tide's head, the sea standing in its seaward end.
    { kind: 'event', x: 7, y: 2, id: 'cf_gap', once: true, text: 'A passage of laid slabs runs down from the gap into the dark. Close by, water slaps against stone.' },
    { kind: 'event', x: 6, y: 3, id: 'cf_tide', once: true, text: 'West, the passage runs on down under the sea. The tide stands in it, black, and breathes in and out.' },
    // The passage up under its lintels to the chamber.
    { kind: 'event', x: 12, y: 6, id: 'cf_lintels', once: true, text: 'The passage climbs under lintels so long and low that you go bent, every one of them a single stone.' },
    { kind: 'event', x: 10, y: 10, id: 'cf_chamber', once: true, text: 'The chamber rises in courses of stone, each laid out over the one below, to a roof lost in the dark.' },
    // The secret: the one spiral turned against the rest, and the cell behind it that was never opened.
    { kind: 'event', x: 7, y: 9, id: 'cf_spirals', once: true, text: 'Spirals are cut in the chamber\'s stones, all turning sunwise but one, here, that turns the other way.' },
    { kind: 'event', x: 7, y: 7, id: 'cf_sealed', once: true, text: 'A cell still closed: its dead lie as they were laid, their pots about them and gold among the pots.' },
    { kind: 'chest', x: 6, y: 6, id: 'cf_sealed_chest', gold: 300, items: ['elixir', 'potion_sp_great'] },
    // The cell south of the chamber, opened long ago.
    { kind: 'event', x: 7, y: 13, id: 'cf_robbed', once: true, text: 'A cell opens off the chamber, its blocking stone lying on the floor. Whatever was laid in it is gone.' },
    // The end cell, the bears' den, and the oldest dead's cist under it.
    { kind: 'event', x: 3, y: 10, id: 'cf_den', once: true, text: 'The end cell stinks of bear. The bones on its floor are gnawed and dragged into heaps.' },
    { kind: 'event', x: 2, y: 10, id: 'cf_cist', once: true, text: 'Under the heaps, a cist of slabs with its lid still on: the oldest dead, and what he was laid with.' },
    { kind: 'chest', x: 1, y: 10, id: 'cf_cist_chest', gold: 400, items: ['sunwise_mace'] },
  ],
  secrets: [{ x: 7, y: 8, hint: 'cf_spirals' }],
  encounters: [
    // Bog bodies come up out of the tide at the passage's head, the nearest and the gentlest, at 18.
    { id: 'cf_bodies', x: 9, y: 3, monsters: ['bog_body', 'bog_body', 'bog_body', 'bog_body', 'bog_body', 'bog_body'], aware: 2, roams: false, respawn: RESPAWN.twoDays },
    // Cairn wights keep the chamber's mouth, at 19.
    { id: 'cf_wights', x: 11, y: 10, monsters: ['cairn_wight', 'cairn_wight', 'cairn_wight', 'cairn_wight'], aware: 3, roams: false, respawn: RESPAWN.twoDays },
    // Ice bears off the loch's foot have made a den of the end cell: the farthest and the hardest, at 21.
    { id: 'cf_bears', x: 4, y: 10, monsters: ['ice_bear', 'ice_bear'], aware: 2, roams: false, respawn: RESPAWN.twoDays },
  ],
};
