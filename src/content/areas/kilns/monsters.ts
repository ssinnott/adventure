// The Kilns' monsters, band 16-18: the Iron Fells, the Kilns' heart and Kilnmouth. `sprite` names
// the drawing (src/ui/sprites.ts); the numbers are the combat model's. A group on a map is a list of
// these ids, and any area's maps may place them.
// Drawn ahead of the area's first map, so src/content/index.ts lists them in AHEAD until then.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings the Kilns' monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'knocker', 'mender', 'foreman',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the Tiefzeche's lowest level (#462), fodder on MONSTERS §4.4's line at 16, six to a mender: the first machine on the road
  { id: 'knocker', name: 'Knocker', plural: 'Knockers', sprite: 'knocker', kind: 'machine', look: 'Something small and grey, knocking on the rock as it comes.', level: 16, hp: 127, ac: 18, attack: 9, dice: 3, sides: 5, bonus: 2, speed: 12, xp: 317, gold: [0, 0], tint: '#84878e', size: 0.45 },
  // with the knockers (#462), a healer on a soldier's numbers at 17 (MONSTERS §4.2): Mending Light on its group, one turn in
  // two that one of it is hurt (at every turn a bot that never singles it out broke off half its days at fifteen rounds)
  { id: 'mender', name: 'Mender', plural: 'Menders', sprite: 'mender', kind: 'machine', look: 'It stops to mend the others, and they let it.', level: 17, hp: 196, ac: 20, attack: 10, dice: 3, sides: 7, bonus: 5, speed: 11, xp: 673, gold: [0, 0], cast: { spells: ['mend_all'], chance: 0.5 }, tint: '#9a9c96', size: 0.55 },
  // before the door marked CREW ONLY (#462), the lowest level's boss at 18 on MONSTERS §4.4's boss line, for #462's gate to
  // tune; it never comes back, and the door stays shut when it falls
  { id: 'foreman', name: 'The Foreman', plural: 'Foremen', sprite: 'foreman', kind: 'machine', look: 'It checks you the way a clerk checks a list, and finds nobody on it.', level: 18, hp: 961, ac: 22, attack: 13, dice: 17, sides: 8, bonus: 20, speed: 13, xp: 11413, gold: [0, 0], tint: '#5c6068', size: 1.3 },
];
