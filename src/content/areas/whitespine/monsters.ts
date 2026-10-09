// The Whitespine's monsters, band 22-24: Monks' Vale and Highcell, the High Spine, Sheer Point and
// the Giants' Stair. `sprite` names the drawing (src/ui/sprites.ts); the numbers are the combat
// model's. A group on a map is a list of these ids, and any area's maps may place them. Drawn ahead
// of the area's first map, so src/content/index.ts lists them in AHEAD until then.
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings the Whitespine's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'stair_giant', 'stair_king',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the Giants' Stair (#502), a brute on MONSTERS §4.4's line at 23, size 2 and drawn inside TALL_REACH: people, so they
  // break when their king falls; sweep (#545) and the toll (#544) are their builders' to give them
  { id: 'stair_giant', name: 'Stair Giant', plural: 'Stair Giants', sprite: 'stair_giant', kind: 'person', look: 'A man as tall as a house, holding out his hand.', level: 23, hp: 632, ac: 21, attack: 14, dice: 5, sides: 7, bonus: 8, speed: 8, xp: 1827, gold: [70, 160], tint: '#6c6152', size: 2 },
  // the Stair's head (#502), its boss at 24 on MONSTERS §4.4's boss line, for #502's gate to tune; the toll's coin in his purse
  { id: 'stair_king', name: 'The Stair-king', plural: 'Stair-kings', sprite: 'stair_king', kind: 'person', look: 'He has taken the toll here since before Helmstow.', level: 24, hp: 1381, ac: 25, attack: 16, dice: 24, sides: 8, bonus: 24, speed: 13, xp: 15253, gold: [250, 500], tint: '#4f5560', size: 2 },
];
