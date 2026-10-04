// Sunderwood, box M2: the Fells Road. Country, band 15-16: Lanternwood's forest on east of the Watch,
// the river from the rim down its west side and a strip of hills under the range that is the Iron
// Fells' edge. The east road clips its south-west corner off L2 and runs on south into M3, the Iron
// Fells' way in, where the pass into the Fells lies (#202, #457); over the grave the ridge is rock,
// so that no climber off the road comes down on it from M3's side.
// Cut from the atlas by hand, its rim's pine drawn as forest and the void at its corner as mountain;
// docs/areas/sunderwood.md §4.9 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST, SOUTH } from '../../../../game/types.ts';

export const LANTERNWOOD_M2: MapDef = {
  id: 'lanternwood_m2',
  name: 'The Fells Road',
  kind: 'outdoor',
  density: 'country',
  band: [15, 16],
  region: 'sunderwood',
  start: { x: 1, y: 29, facing: EAST },
  rows: [
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'TTTTT~TTTTTTTTTTTTTTTTMMMMMMMMMM',
    'TTTTT~TTTTTTTTTTTTTTTTMMMMMMMMMM',
    'TTTT~tTTTTTTTTTTTTTTTTTMMMMMMMMM',
    'TTTT~tTTTTTTTTTTTTTTTTTMMMMMMMMM',
    'TTTT~tTTTTTTTTTTTTTTTTTMMMMMMMMM',
    'TTTT~tTTTTTTTTTTTTTTTTT^MMMMMMMM',
    'TTTT~tTTTTTTTTTTTTTTTTT^^MMMMMMM',
    'TTTT~tTTTTTTTTTTTTTTTTT^^^MMMMMM',
    'TTTT~ttttTTTTTTTTTTTTTT^^^MMMMMM',
    'TTTT~ttttttttttttttttt^^^^MMMMMM',
    'TTTT~ttttTTTTTTTTTTTTT^^^^MMMMMM',
    'TTTT~tTTTTTTTTTTTTTTTT^^^^MMMMMM',
    'TTTT~tTTTTTTTTTTTTTTTT^^^^MMMMMM',
    'TTT~~tTTTTTTTTTTTTTTT^^^^^MMMMMM',
    'TTT~ttTTTTTTTTTTTTTTT^^^^^MMMMMM',
    'TTT~tTTTTTTTTTTTTTTTT^^^^^MMMMMM',
    'TTT~tTTTTTTTTTTTTTTTT^^^^^MMMMMM',
    'TT~TtTTTTTTTTTTTTTTTT,^,^^MMMMMM',
    'TT~TtTTTTTTTTTTTTTTTT,,^^^MMMMMM',
    'TT~TtTTTTTTTTTTTTTTTT,^^^MMMMMMM',
    'T~~ttTTTTTTTTTTTTTTTT^^^MMMMMMMM',
    'T~tttTTTTTTTTTTTTTTTT^^MMMMMMMMM',
    'T~tttTTTTTTTTTTTTTTTT^^MMMMMMMMM',
    'T~tTTTTTTTTTTTTTTTTTT^MMMMMMMMMM',
    '~~tTTTTTTTTTTTTTTTTTTMMMMMMMMMMM',
    '~TtTTTTTTTTTTTTTTTTTTMMMMMMMMMMM',
    '~TtTTTTTTTTTTTTTTTTTMMMMMMMMMMMM',
    '~TtTTTTTTTTTTTTTTTTTMMMMMMMMMMMM',
    '==tTTTTTTTTTTTTTTTTMMMMMMMMMMMMM',
    '~==ttSttTTTTTTTTTTTMMMMMMMMMMMMM',
    'T==MMMrrMMMMMMMMMMMMMMMMMMMMMMMM',
  ],
  exits: [
    // The east road on south over the border, into the Iron Fells (#457): walked, and said on crossing.
    { x: 1, y: 31, to: 'ironfells_m3', tx: 1, ty: 0, tf: SOUTH, label: 'The Iron Fells. Pine, and the ground going up. Somewhere ahead something is being hammered, and has been all day.' },
  ],
  features: [
    // The road over the corner, and the milestone where it leaves for the pass.
    { kind: 'event', x: 3, y: 30, id: 'm2_milestone', once: true, text: 'A milestone by the road, ANVILHALL 8 on its face. On the back, cut with a knife, the Wardens\' mark and two words: THIS FAR.' },
    // The secret: through the tree line beside the stone, the grave.
    { kind: 'event', x: 6, y: 30, id: 'm2_grave', once: true, text: 'A Warden\'s grave under the pines, its mark cut by the same knife as the stone\'s. On it a patrol badge of the Scarth, set square on the stone. Left, not dropped.' },
    { kind: 'chest', x: 7, y: 30, id: 'm2_grave_chest', gold: 250, items: ['potion_heal', 'potion_heal'] },
    // Up the river: the shrine at its bend, and the camp in the forest's middle.
    { kind: 'shrine', x: 4, y: 22, id: 'm2_shrine', text: 'A wayside shrine at the river\'s bend, its foot in the water when the river is up. A pair of boots stands on it, soled twice and worn through again.', stat: 'endurance', done: 'The boots on the shrine, worn through.' },
    { kind: 'camp', x: 7, y: 10, name: 'The gravel bar', text: 'A gravel bar where the river runs shallow in the forest\'s middle, driftwood stacked above the flood line by a hand. The water talks all night and says nothing.' },
    // The hills under the range: the cairn, and the lookout south over the pass.
    { kind: 'cairn', x: 22, y: 22, id: 'm2_cairn', text: 'A cairn on the hills where the trees give out and the range begins, the stones squared and dry-laid. The top one is slag, black and glassy, from no fire in this wood.', gold: 180, items: ['potion_sp_great'] },
    { kind: 'event', x: 21, y: 24, id: 'm2_lookout', once: true, when: { hours: 'day' }, text: 'South over the pass the road goes on, a grey thread between the peaks, and beyond it smoke standing in columns, too straight for any hearth.' },
    { kind: 'event', x: 21, y: 24, id: 'm2_lookout_night', once: true, when: { hours: 'night' }, text: 'South over the pass, dark, and in it a glow, low and red, that does not flicker as a fire does. Something is kept burning there all night.' },
  ],
  secrets: [{ x: 5, y: 30, hint: 'm2_milestone' }],
  encounters: [
    // Sunder hounds up the river from the road with a moth among them, the gentlest; two deathsheads
    // to the camp's fire by night; and on the hills under the range two glass bears, the box's group at 16.
    { id: 'm2_hounds', x: 2, y: 25, monsters: ['sunder_hound', 'sunder_hound', 'lantern_moth'], aware: 4, respawn: 2880 },
    { id: 'm2_moths', x: 9, y: 10, monsters: ['deathshead', 'deathshead'], aware: 5, respawn: 1440, when: { hours: 'night' } },
    { id: 'm2_bears', x: 24, y: 15, monsters: ['glass_bear', 'glass_bear'], aware: 5, respawn: 2880, roams: false },
  ],
};
