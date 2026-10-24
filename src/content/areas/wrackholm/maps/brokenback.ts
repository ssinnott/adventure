// The Brokenback, Wrackholm's enclave (#845): a ship that came onto the black rocks at the west end
// of E5's strand and broke her back there, her hold open to the tide. Entered at her break, 18,28 in
// E5's rocks. The break where the sea comes in; the hold, where the Hand's overseers and the gleaners
// they brought strip what she carried; the bulkhead's low door, and aft the master's cabin, kept by
// gleaners alone; and under the cabin's deck, behind one plank worn bright, the master's strongbox.
// Band 14-15, a band over E5's 12-13, out of the isle's figures; docs/areas/wrackholm.md §12.5 is its
// brief.
import type { MapDef } from '../../../../game/map.ts';
import { anchored } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';
import { RESPAWN } from '../../../../game/keys.ts';

export const BROKENBACK: MapDef<'brokenback'> = {
  id: 'brokenback',
  name: 'The Brokenback',
  kind: 'dungeon',
  band: [14, 15],
  enclave: true,
  region: 'wrackholm',
  start: { x: 7, y: 1, facing: SOUTH },
  palette: { wall: '#5c5448', wallDark: '#383228', floor: '#3a352c', ceiling: '#1c1812', door: '#3e2e20', wallStyle: 'brick', ceilingStyle: 'beams', banner: '#2a4a52' },
  rows: [
    '################',
    '#######.########',
    '######....######',
    '###~~.......####',
    '###~~.......####',
    '#####......#####',
    '#######.########',
    '###..........###',
    '###..........###',
    '###..o....o..###',
    '###..........###',
    '#######.########',
    '####........####',
    '####........S..#',
    '####........####',
    '################',
  ],
  exits: [
    anchored({ x: 7, y: 1, to: 'wrackholm_e5', at: 'from_brokenback', label: 'Out through the break and over the black rocks, onto the strand and into the wind.' }),
  ],
  features: [
    // The break in her side, where the sea comes in, and the tide's leavings.
    { kind: 'event', x: 7, y: 2, id: 'wb_break', once: true, text: 'In at her break: planks torn outward, the sky through her deck and weed hanging from the beams.' },
    { kind: 'event', x: 6, y: 4, id: 'wb_tide', once: true, text: 'The tide slops in at the break and out again, and leaves weed on the boards, and grit that glows a little.' },
    // The hold, and what she carried: the cargo's chest.
    { kind: 'event', x: 8, y: 8, id: 'wb_hold', once: true, text: 'Her hold, open to the sky. Straw is packed in the ribs like a nest, and the eggs are gone.' },
    { kind: 'chest', x: 4, y: 10, id: 'wb_cargo', gold: 250, items: ['elixir'] },
    { kind: 'event', x: 7, y: 10, id: 'wb_bulkhead', once: true, text: 'The bulkhead door has been forced and propped, the sill scored by crates dragged aft.' },
    // The master's cabin aft, and the stern windows.
    { kind: 'event', x: 5, y: 13, id: 'wb_cabin', once: true, text: 'The master\'s cabin: a table nailed down, a cot, charts gone to pulp. His lamp still hangs from the beam.' },
    { kind: 'event', x: 8, y: 14, id: 'wb_stern', once: true, text: 'The stern windows are stove in. The sea looks through them, slate-grey, and goes away to nothing.' },
    // The secret: one plank of the deck worn bright among the grey, and under the deck the master's strongbox.
    { kind: 'event', x: 11, y: 13, id: 'wb_plank', once: true, text: 'The deck is grey with salt, all but one plank by the wall, worn bright.' },
    { kind: 'event', x: 13, y: 13, id: 'wb_under', once: true, text: 'Under the deck, a hollow the master kept for what was his: a strongbox, wet through, and a smell of lamp oil.' },
    { kind: 'chest', x: 14, y: 13, id: 'wb_strongbox', gold: 300, items: ['keelhaul'] },
  ],
  secrets: [{ x: 12, y: 13, hint: 'wb_plank' }],
  encounters: [
    // Three overseers and the gleaner they brought, stripping the hold at its mouth: the nearer and the
    // gentler, at 13.5.
    { id: 'wb_strippers', x: 7, y: 7, monsters: ['ashen_overseer', 'ashen_overseer', 'ashen_overseer', 'ashen_gleaner'], aware: 3, roams: false, respawn: RESPAWN.twoDays },
    // Four gleaners alone at the master's cabin, just inside the bulkhead's door: the farthest and the
    // hardest, at 15.
    { id: 'wb_gleaners', x: 7, y: 12, monsters: ['ashen_gleaner', 'ashen_gleaner', 'ashen_gleaner', 'ashen_gleaner'], aware: 2, roams: false, respawn: RESPAWN.twoDays },
  ],
};
