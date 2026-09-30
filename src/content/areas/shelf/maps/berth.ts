// The Berth: the Queen's barrow under the chalk of D2, opened. A forecourt behind the pulled
// stones, a passage straight into the hill with four side chambers where the old Queens lie, and
// the bier at the end. Her guard stands two by two down the passage, and her captain at the bier;
// none of them comes back. A secret door behind the bier, hinted in the forecourt, opens his niche.
// docs/areas/shelf.md §4.7 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST, WEST } from '../../../../game/types.ts';

const GUARD = ['barrow_guard', 'barrow_guard'];

export const BERTH: MapDef = {
  id: 'berth',
  name: 'The Berth',
  kind: 'dungeon',
  band: [4, 5],
  start: { x: 14, y: 7, facing: WEST },
  palette: { wall: '#c8c2b0', wallDark: '#8e887a', floor: '#6e6a60', ceiling: '#4a4640', door: '#5a5448', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#23306e' },
  rows: [
    '################',
    '################',
    '######...#...###',
    '######...#...###',
    '######...#...###',
    '###..##.###.####',
    '#.#..##.###.#..#',
    '#.S............#',
    '#.#..##.###.#..#',
    '###..##.###.####',
    '######...#...###',
    '######...#...###',
    '######...#...###',
    '################',
    '################',
    '################',
  ],
  exits: [
    { x: 14, y: 7, to: 'downs_d2', tx: 12, ty: 12, tf: EAST, label: 'You climb out past the pulled stones onto the chalk.' },
  ],
  features: [
    { kind: 'event', x: 13, y: 7, id: 'berth_forecourt', once: true, text: 'The forecourt. Rope-scars on the lintel, and the prints of many boots. Whoever opened this came with horses, tools and time.' },
    { kind: 'sign', x: 13, y: 6, id: 'berth_hint', text: 'Cut deep in the forecourt\'s stone, older than the marks around it: HER CAPTAIN LIES BEHIND HER.' },
    { kind: 'event', x: 12, y: 7, id: 'berth_passage', once: true, text: 'Cold, dry, and the smell of chalk. The passage runs straight into the hill, cut, not dug: the walls meet the floor square.' },
    // The old Queens, from the youngest by the door to the oldest by the bier.
    { kind: 'event', x: 11, y: 4, id: 'berth_queen1', once: true, text: 'A Queen in her niche, her name worn past reading. Gold at her throat, a sword at her side, and the dust on all of it unbroken.' },
    { kind: 'chest', x: 11, y: 2, id: 'berth_c1', gold: 70, items: ['queens_sword'] },
    { kind: 'event', x: 11, y: 10, id: 'berth_queen2', once: true, text: 'Older: the name worn smooth as a river stone. A comb, a cup, a chest and a ring of iron keys too many for any house.' },
    { kind: 'chest', x: 11, y: 12, id: 'berth_c2', gold: 90, items: ['potion_heal', 'potion_heal'] },
    { kind: 'event', x: 7, y: 4, id: 'berth_queen3', once: true, text: 'The third. The name is a shadow in the stone. Her hands are folded over a small chest, and her ring is still on her finger.' },
    { kind: 'chest', x: 7, y: 2, id: 'berth_c3', gold: 60, items: ['potion_sp'] },
    { kind: 'event', x: 7, y: 10, id: 'berth_queen4', once: true, text: 'The oldest. No name, no gold: a cup, a knife and, on her right hand, a plain band of grey metal that has not tarnished.' },
    { kind: 'chest', x: 7, y: 12, id: 'berth_c4', gold: 0, items: ['potion_heal', 'antidote'] },
    // The step: the Queen on her bier, and only her signet gone.
    { kind: 'event', x: 4, y: 7, id: 'berth_bier', once: true, text: 'The bier. Queen Isaure under deep blue and gold, hands folded. The right is bare: the wrappings there were cut, not unwound.' },
    { kind: 'event', x: 1, y: 7, id: 'berth_niche', once: true, text: 'Behind the bier, a niche: a captain\'s arms in deep blue and gold, laid out as if he meant to put them on again.' },
    { kind: 'chest', x: 1, y: 6, id: 'berth_arms', gold: 0, items: ['captains_sword', 'captains_mail'] },
  ],
  secrets: [{ x: 2, y: 7, hint: 'berth_hint' }],
  encounters: [
    { id: 'berth_guard1', x: 11, y: 7, monsters: GUARD, aware: 2, roams: false },
    { id: 'berth_guard2', x: 9, y: 7, monsters: GUARD, aware: 2, roams: false },
    { id: 'berth_guard3', x: 7, y: 7, monsters: GUARD, aware: 2, roams: false },
    { id: 'berth_guard4', x: 5, y: 7, monsters: GUARD, aware: 2, roams: false },
    { id: 'berth_captain', x: 3, y: 7, monsters: ['barrow_captain'], aware: 2, roams: false },
  ],
};
