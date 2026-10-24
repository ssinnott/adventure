// Wytgat, Saltreach's enclave (#845): the salters' old rock-salt working in the Scarp's foot, entered
// from B7's 22,22 and held by the Hand. The cutting inside the mouth, where four of the Hand's men keep
// a brazier; west of it the gallery of the chained rows, empty, its two overseers and their men; at its
// foot the strongroom, where three gleaners and an overseer keep the strongbox and the Brine Needle in
// it; east of the cutting the store of brine glass, and behind its back wall, found from the soot the
// rock breathes in, the salters' last gallery, walled up when the Hand came. Band 13-14, a band over the
// Saltings', out of Saltreach's figures; docs/areas/saltreach/plan.md §12.12 is its brief.
import type { MapDef } from '../../../../game/mapdef.ts';
import { anchored } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';
import { RESPAWN } from '../../../../game/keys.ts';

export const WYTGAT: MapDef<'wytgat'> = {
  id: 'wytgat',
  name: 'Wytgat',
  kind: 'dungeon',
  band: [13, 14],
  enclave: true,
  region: 'saltreach',
  start: { x: 7, y: 1, facing: SOUTH },
  palette: { wall: '#b4aea0', wallDark: '#7a7468', floor: '#5e5a52', ceiling: '#22201c', door: '#4e3a26', wallStyle: 'smooth', ceilingStyle: 'beams', banner: '#5a2a24' },
  rows: [
    '################',
    '#######.########',
    '#######.########',
    '####.......#...#',
    '####...........#',
    '#..........#...#',
    '#..#.......#...#',
    '#..#########...#',
    '#..##########S##',
    '#..#########...#',
    '#..#########...#',
    '#..##......#####',
    '#..##......#####',
    '#..........#####',
    '#####......#####',
    '################',
  ],
  exits: [
    anchored({ x: 7, y: 1, to: 'saltings_b7', at: 'from_wytgat', label: 'Up the cut and out under the Scarp, into the wind off the pans.' }),
  ],
  features: [
    // The cutting inside the mouth, and the Hand's watch at the brazier.
    { kind: 'event', x: 7, y: 3, id: 'wy_cutting', once: true, text: 'The salters\' cutting, its walls rock salt, white under the soot and scarred by old picks. A brazier burns in the middle.' },
    // The gallery of the chained rows, west.
    { kind: 'event', x: 2, y: 6, id: 'wy_rows', once: true, text: 'A gallery runs south, rings in its walls at knee height, a chain through each and nobody at the end of any.' },
    { kind: 'event', x: 1, y: 12, id: 'wy_names', once: true, text: 'Names are scratched in the salt low on the wall, where a man in a chain could reach. The last is half done.' },
    // The strongroom at the gallery's foot, and the strongbox the gleaners keep.
    { kind: 'event', x: 6, y: 12, id: 'wy_strongroom', once: true, text: 'The Hand\'s strongroom, swept and dry. A strongbox is chained to the rock behind a bench, and on the bench a lamp, still warm.' },
    { kind: 'chest', x: 9, y: 14, id: 'wy_strongbox', gold: 300, items: ['brine_needle'] },
    // The store of brine glass, east; the soot its back wall breathes in, the hint; and the salters' last
    // gallery behind it, walled up when the Hand came.
    { kind: 'event', x: 12, y: 4, id: 'wy_store', once: true, text: 'Sacks stacked to the roof, green light seeping through the weave: brine glass from the fen\'s Rifts, waiting on a boat.' },
    { kind: 'event', x: 13, y: 7, id: 'wy_draught', text: 'On the back wall the lamp soot is drawn into one crack in long grey tongues, as if the rock breathes in there.' },
    { kind: 'event', x: 13, y: 8, id: 'wy_seam', once: true, text: 'The salters\' last gallery, walled up when the Hand came: picks on a rack, a lamp gone dry and a strongbox under a salt block.' },
    { kind: 'chest', x: 13, y: 10, id: 'wy_seam_chest', gold: 200, items: ['elixir'] },
  ],
  secrets: [{ x: 13, y: 8, hint: 'wy_draught' }],
  encounters: [
    // The watch at the brazier, the nearest, where every way on passes.
    { id: 'wy_watch', x: 7, y: 4, monsters: ['wrack_smuggler', 'wrack_smuggler', 'wrack_smuggler', 'wrack_bowman'], aware: 3, roams: false, respawn: RESPAWN.twoDays },
    // The overseers of the chained rows and their men, across the gallery.
    { id: 'wy_chains', x: 2, y: 10, monsters: ['ashen_overseer', 'ashen_overseer', 'wrack_smuggler', 'wrack_smuggler', 'wrack_smuggler'], aware: 3, roams: false, respawn: RESPAWN.twoDays },
    // The strongroom's keepers in its door, the farthest and the hardest.
    { id: 'wy_keepers', x: 5, y: 13, monsters: ['ashen_gleaner', 'ashen_gleaner', 'ashen_gleaner', 'ashen_overseer'], aware: 2, roams: false, respawn: RESPAWN.twoDays },
  ],
};
