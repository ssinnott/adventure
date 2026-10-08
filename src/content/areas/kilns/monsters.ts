// The Kilns' monsters, band 16-18: the Iron Fells, the Kilns' heart and Kilnmouth. `sprite` names
// the drawing (src/ui/sprites.ts); the numbers are the combat model's. A group on a map is a list of
// these ids, and any area's maps may place them.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings the Kilns' monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'knocker', 'mender', 'foreman',
  'fire_beetle',
  'slagling', 'slag_elder', 'anvil_warden',
  'rock_worm',
  'anvil_guard',
  'salamander', 'great_salamander',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the Tiefzeche's lowest level (#462), fodder on MONSTERS §4.4's line at 16, six to a mender: the first machine on the road;
  // it carries no gold, only parts, and about one in seven a plate of its own
  { id: 'knocker', name: 'Knocker', plural: 'Knockers', sprite: 'knocker', kind: 'machine', look: 'Something small and grey, knocking on the rock as it comes.', level: 16, hp: 127, ac: 18, attack: 9, dice: 3, sides: 5, bonus: 2, speed: 12, xp: 317, gold: [0, 0], drops: [{ item: 'knocker_plate', chance: 0.15 }], tint: '#84878e', size: 0.45 },
  // with the knockers (#462), a healer on a soldier's numbers at 17 (MONSTERS §4.2): Mending Light on its group, one turn in
  // two that one of it is hurt (at every turn a bot that never singles it out broke off half its days at fifteen rounds); it
  // carries its spool of wire
  { id: 'mender', name: 'Mender', plural: 'Menders', sprite: 'mender', kind: 'machine', look: 'It stops to mend the others, and they let it.', level: 17, hp: 199, ac: 20, attack: 10, dice: 3, sides: 8, bonus: 4, speed: 11, xp: 673, gold: [0, 0], cast: { spells: ['mend_all'], chance: 0.5 }, drops: [{ item: 'mender_spool', chance: 1 }], tint: '#9a9c96', size: 0.55 },
  // before the door marked CREW ONLY (#462), the lowest level's boss at 18; it never comes back, the door stays shut when it
  // falls and it drops its slate. Off MONSTERS §4.4's boss line (1,001 hp, 18d8+20, won 71% at 17 and 93% at 19), its hit
  // points and its blow are set for #462's gate: about half at its floor, 17, and nearly always at 19
  { id: 'foreman', name: 'The Foreman', plural: 'Foremen', sprite: 'foreman', kind: 'machine', look: 'It checks you the way a clerk checks a list, and finds nobody on it.', level: 18, hp: 1500, ac: 22, attack: 13, dice: 15, sides: 8, bonus: 14, speed: 13, xp: 11413, gold: [0, 0], drops: [{ item: 'foreman_slate', chance: 1 }], tint: '#5c6068', size: 1.3 },
  // the spoil heaps, the forges, the kilns and the Tiefzeche's warm galleries (#457, #458, #461, #462, #463, #467, #468),
  // armoured on MONSTERS §4.4's line at 16; fire does not touch it
  { id: 'fire_beetle', name: 'Fire Beetle', plural: 'Fire Beetles', sprite: 'fire_beetle', kind: 'beast', look: 'A beetle with a coal in its back.', level: 16, hp: 249, ac: 21, attack: 10, dice: 3, sides: 7, bonus: 6, speed: 8, xp: 844, gold: [0, 0], immune: ['fire'], tint: '#2e2622', size: 0.72 },
  // the Anvil Stone's Rift and its tear (#458, #464, #465), a skirmisher on MONSTERS §4.4's line at 16: it paralyses, at 0.1 a hit; cold bites the slag, and fire does half
  { id: 'slagling', name: 'Slagling', plural: 'Slaglings', sprite: 'slagling', kind: 'rift', look: 'Slag, walking, with a red iron heart.', level: 16, hp: 179, ac: 19, attack: 10, dice: 3, sides: 8, bonus: 2, speed: 15, xp: 633, gold: [0, 0], inflict: { cond: 'paralysed', chance: 0.1 }, weak: ['cold'], resist: ['fire'], tint: '#3e3633', size: 0.74 },
  // the Tiefzeche's workings and old workings and the surface's adits and cuts (#457, #460, #461, #462), a brute on
  // MONSTERS §4.4's line at 17
  { id: 'rock_worm', name: 'Rock Worm', plural: 'Rock Worms', sprite: 'rock_worm', kind: 'beast', look: 'This tunnel was not dug by dwarves.', level: 17, hp: 404, ac: 18, attack: 11, dice: 4, sides: 8, bonus: 7, speed: 8, xp: 1347, gold: [0, 0], tint: '#6a6056', size: 1.6 },
  // the Anvil Stone's approach, only after the Stone is taken (#464), armoured on MONSTERS §4.4's line at 17: the dwarves, crossed
  { id: 'anvil_guard', name: 'Anvil Guard', plural: 'Anvil Guards', sprite: 'anvil_guard', kind: 'person', look: 'Short, broad, and in the thane\'s iron.', level: 17, hp: 250, ac: 22, attack: 10, dice: 3, sides: 7, bonus: 6, speed: 8, xp: 898, gold: [30, 70], tint: '#4a4c54', size: 0.8 },
  // the Anvil Stone's Rift (#465), an elite on MONSTERS §4.4's line at 18: it paralyses, at 0.15 a hit; cold bites the slag, and fire does half
  { id: 'slag_elder', name: 'Slag Elder', plural: 'Slag Elders', sprite: 'slag_elder', kind: 'rift', look: 'Iron runs off it like sweat.', level: 18, hp: 365, ac: 21, attack: 12, dice: 4, sides: 8, bonus: 3, speed: 15, xp: 1427, gold: [0, 0], inflict: { cond: 'paralysed', chance: 0.15 }, weak: ['cold'], resist: ['fire'], tint: '#4a3a33', size: 0.95 },
  // the Anvil Stone's Rift, standing up out of the cut (#465), the area's boss at 18; it never comes back, the tear closes
  // when it falls and it drops its heart. Off MONSTERS §4.4's boss line (1,001 hp, 18d8+20, won 32% at 17 and 69% at 19),
  // its hit points and its blow are set for #465's gate: about half at its floor, 17, and nearly always at 19. Cold bites
  // it, and fire does half
  { id: 'anvil_warden', name: 'Warden of the Anvil', plural: 'Wardens of the Anvil', sprite: 'anvil_warden', kind: 'rift', look: 'The Stone\'s heat, standing up out of the cut.', level: 18, hp: 1200, ac: 22, attack: 13, dice: 13, sides: 8, bonus: 12, speed: 13, xp: 11413, gold: [0, 0], immune: ['asleep'], weak: ['cold'], resist: ['fire'], drops: [{ item: 'anvil_heart', chance: 1 }], tint: '#3a2e2a', size: 1.45 },
  // the tubes and the spoil heaps (#458, #463, #466), a skirmisher on MONSTERS §4.4's line at 16: fire does not touch it, and cold bites
  { id: 'salamander', name: 'Salamander', plural: 'Salamanders', sprite: 'salamander', kind: 'beast', look: 'A lizard with the fire showing through its skin.', level: 16, hp: 179, ac: 19, attack: 10, dice: 3, sides: 8, bonus: 2, speed: 15, xp: 633, gold: [0, 0], immune: ['fire'], weak: ['cold'], tint: '#3a2c28', size: 0.68 },
  // the tubes' deepest chamber (#466), the tubes' boss at 18, on MONSTERS §4.4's boss line: fire does not touch it, and
  // cold bites, as its kin's; it shrugs off sleep, as the road's beasts that are bosses do
  { id: 'great_salamander', name: 'Great Salamander', plural: 'Great Salamanders', sprite: 'great_salamander', kind: 'beast', look: 'The fire in the rock, with a head.', level: 18, hp: 1001, ac: 22, attack: 13, dice: 18, sides: 8, bonus: 20, speed: 13, xp: 11413, gold: [0, 0], immune: ['asleep', 'fire'], weak: ['cold'], tint: '#4a423c', size: 1.6 },
];
