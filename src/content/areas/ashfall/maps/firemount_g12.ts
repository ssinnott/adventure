// Ashfall, box G12: Fire Mountain's south foot, behind the road. Country, band 25-26: the ash running down
// south off the cone in long folds to the rim, the world's end; a cairn under the cone, the drakes'
// scrapes along the slope, the flow's smoke going west into the haze, pumice rolling in the wind, and over
// Meridian Camp (#22), plated at 26,2, the ash warm and humming; and the drakelings on the slope, the
// box's one fight. The secret: claw-marks scored back and forth across one rock at the rim's foot, and
// behind it the drakes' hollow, where they bring bright things.
// In from G11 (#513) walked, over the ash: G11's south edge meets this map's north edge square for square,
// the ash. The east edge meets H12's west square for square, the ash and the rim; the west edge ends the
// world against F12, cut (§11), and the south edge is the rim, past which the world ends.
// Cut from the atlas by tools/scaffold.ts, the world's end cut by hand; docs/areas/ashfall.md §4.10 is its
// brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const FIREMOUNT_G12: MapDef = {
  id: 'firemount_g12',
  name: 'Fire Mountain',
  kind: 'outdoor',
  density: 'country',
  band: [25, 26],
  region: 'ashfall',
  start: { x: 16, y: 0, facing: SOUTH },
  rows: [
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaaaaaaaaaaMaaaaaaaa',
    'aaaaaaaaaaaaaaaaaaaaaaMMMaaaaaaa',
    'MMMaaaaaaaarSraaaaaaMMMMMMMaaaaa',
    'MMMMMMMMMaar:raaMMMMMMMMMMMMMMMa',
    'MMMMMMMMMMar:raMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMrrrMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    '%%%MMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    '%%%%MMMMMMMMMMMMMMMMMM%%MMMMMMMM',
    '%%%%%MMMMMMMMMMMMMMMM%%%MMMMMMMM',
    '%%%%%%%%%MMMMMMMMMM%%%%%%%MMMMMM',
    '%%%%%%%%%%%%%%%%M%%%%%%%%%%%%%MM',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
    '%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%%',
  ],
  features: [
    // Down off the cone: the ash in folds, the cairn under it, the drakes' scrapes and the flow's smoke
    // going west into the haze.
    { kind: 'event', x: 16, y: 2, id: 'g12_folds', once: true, text: 'Below the cone the ash runs south in long folds, smooth as a sheet laid over a sleeper.' },
    { kind: 'cairn', x: 4, y: 4, id: 'g12_cairn', text: 'A cairn under the cone, each stone set with care, and ash packed into every joint.', gold: 100, items: ['potion_sp_great'] },
    { kind: 'event', x: 8, y: 6, id: 'g12_scrapes', once: true, text: 'Hollows scraped in the warm ash in a row along the slope, each a stride across.' },
    { kind: 'event', x: 2, y: 7, id: 'g12_west', once: true, text: 'West, below, the flow\'s smoke lies along the ground and goes on into the haze.' },
    // Over Meridian Camp (#22), the ash warm and humming; pumice in the wind; the rim across the south.
    { kind: 'event', x: 26, y: 3, id: 'g12_hum', once: true, text: 'The ash is warm here, and up through the boots comes a hum, very faint, that does not stop.' },
    { kind: 'event', x: 28, y: 9, id: 'g12_pumice', once: true, text: 'Grey stones on the ash so light they roll in the wind, full of holes like bread.' },
    { kind: 'event', x: 18, y: 10, id: 'g12_rim', once: true, text: 'The rim stands across the south, black rock in teeth, and the wind comes over it cold.' },
    // The secret: claw-marks scored back and forth across one rock at the rim's foot; behind it the
    // drakes' hollow, warm, and the bright things they bring in.
    { kind: 'event', x: 12, y: 10, id: 'g12_claws', once: true, text: 'Claw-marks scored deep in the rock at the rim\'s foot, back and forth across the one face.' },
    { kind: 'event', x: 12, y: 12, id: 'g12_hollow', once: true, text: 'A hollow under the rim, warm as a bread oven, its floor scraped clean. At the back, bright things.' },
    { kind: 'chest', x: 12, y: 13, id: 'g12_hoard', gold: 50, items: ['elixir'] },
  ],
  secrets: [{ x: 12, y: 11, hint: 'g12_claws' }],
  encounters: [
    // The box's one fight: the drakelings on the slope by their scrapes, the band's top.
    { id: 'g12_drakelings', x: 21, y: 5, monsters: ['drakeling', 'drakeling', 'drakeling', 'drakeling', 'drakeling', 'drakeling'], aware: 3, respawn: 2880 },
  ],
};
