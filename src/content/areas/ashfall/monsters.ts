// Ashfall's monsters, band 24-26: Cindercoast, Fire Mountain and the Ember Waste. `sprite` names the
// drawing (src/ui/sprites.ts); the numbers are the combat model's. A group on a map is a list of these
// ids, and any area's maps may place them. Drawn ahead of the area's first map, so
// src/content/index.ts lists them in AHEAD until then.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings Ashfall's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'strangler_vine', 'cinder_beetle', 'ember_salamander', 'ash_husk',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the green shore's trees (#510, #511), a controller on MONSTERS §4.4's line at 24: it holds as the bramble does (§8.2),
  // and never roams, which its groups say (`roams: false`)
  { id: 'strangler_vine', name: 'Strangler Vine', plural: 'Strangler Vines', sprite: 'strangler_vine', kind: 'beast', look: 'The vines hang lower than they did.', level: 24, hp: 284, ac: 23, attack: 14, dice: 3, sides: 8, bonus: 6, speed: 6, xp: 953, gold: [0, 0], inflict: { cond: 'paralysed', chance: 0.3 }, tint: '#4a5c2c', size: 1.15 },
  // the black sand (#510, #511), armoured on the line at 24: fire does not touch it, as it does not the fire beetle
  { id: 'cinder_beetle', name: 'Cinder Beetle', plural: 'Cinder Beetles', sprite: 'cinder_beetle', kind: 'beast', look: 'Its shell is the colour of the beach.', level: 24, hp: 397, ac: 25, attack: 14, dice: 4, sides: 8, bonus: 5, speed: 8, xp: 1271, gold: [0, 0], immune: ['fire'], tint: '#34343a', size: 0.8 },
  // the vents and the ash toward them (#511, #513), a skirmisher on the line at 24: its kin's fire and its cold, and quicker
  { id: 'ember_salamander', name: 'Ember Salamander', plural: 'Ember Salamanders', sprite: 'ember_salamander', kind: 'beast', look: 'Grown in the mountain\'s own fire.', level: 24, hp: 330, ac: 23, attack: 14, dice: 3, sides: 8, bonus: 4, speed: 16, xp: 953, gold: [0, 0], immune: ['fire'], weak: ['cold'], tint: '#4a1c12', size: 0.62 },
  // Old Cinder (#514, #515), a soldier on the line at 25: the dead, cast in ash
  { id: 'ash_husk', name: 'Ash Husk', plural: 'Ash Husks', sprite: 'ash_husk', kind: 'dead', look: 'A man of ash, still holding his cup.', level: 25, hp: 340, ac: 24, attack: 14, dice: 4, sides: 8, bonus: 3, speed: 10, xp: 993, gold: [0, 0], tint: '#9c978e', size: 1 },
];
