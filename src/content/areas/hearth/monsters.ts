// The Hearth's monsters, band 28-32: Hearth Isle, the Underdeep and the Core. `sprite` names the
// drawing (src/ui/sprites.ts); the numbers are the test monster's line at each role and level
// (tools/testmonster.ts), as the plan's section 7 has them. A group on a map is a list of these ids,
// and any area's maps may place them. Drawn ahead of the area's first map (#761), and the area's own
// table since the isle listed it (H6, #753).
import type { MonsterDef } from '../../../game/monsters.ts';

/** The drawings the Hearth's monsters are drawn with, one kind to each. src/ui/sprites.ts must draw every one. */
export const SPRITES = [
  'hearth_moth', 'ashen_champion', 'ashen_preacher', 'deep_rat', 'keeper', 'hand_rearguard', 'grey_hand', 'core_sentry', 'vask',
] as const;

export const MONSTERS: readonly MonsterDef[] = [
  // the isle and the nave by night (#753, #755), fodder on the line at 28, twelve to a group: it flies, and its dust puts to sleep
  { id: 'hearth_moth', name: 'Hearth Moth', plural: 'Hearth Moths', sprite: 'hearth_moth', kind: 'beast', look: 'The sky over the isle is moving.', level: 28, hp: 276, ac: 24, attack: 15, dice: 3, sides: 8, bonus: 2, speed: 12, xp: 557, gold: [0, 0], ranged: true, inflict: { cond: 'asleep', chance: 0.2 }, tint: '#b4552e', size: 0.62 },
  // the isle's pickets, the temple and the crypt (#753, #755, #756), a soldier on the line at 29: the Hand never breaks; its knife at one in ten
  { id: 'ashen_champion', name: 'Ashen Champion', plural: 'Ashen Champions', sprite: 'ashen_champion', kind: 'person', look: 'The Hand\'s best, in steel from below.', steady: true, level: 29, hp: 418, ac: 26, attack: 16, dice: 5, sides: 8, bonus: 5, speed: 11, xp: 1153, gold: [0, 0], drops: [{ item: 'grey_knife', chance: 0.1 }], tint: '#4a2c2c', size: 1 },
  // behind the champions (#753, #755), a caster on the line at 29: Fire Bolt on a row and Ward on its group
  { id: 'ashen_preacher', name: 'Ashen Preacher', plural: 'Ashen Preachers', sprite: 'ashen_preacher', kind: 'person', look: 'Still preaching, and the fire is the sermon.', steady: true, level: 29, hp: 566, ac: 26, attack: 18, dice: 6, sides: 8, bonus: 7, speed: 12, xp: 1538, gold: [0, 0], ranged: true, cast: { spells: ['firebolt', 'ward'], chance: 0.5 }, tint: '#6a2e22', size: 0.98 },
  // everywhere below (#753, #757), fodder on the line at 30, twelve to a group: the first thing killed and the last animal met
  { id: 'deep_rat', name: 'Deep Rat', plural: 'Deep Rats', sprite: 'deep_rat', kind: 'beast', look: 'Rats. Even here.', level: 30, hp: 282, ac: 25, attack: 16, dice: 3, sides: 8, bonus: 2, speed: 12, xp: 597, gold: [0, 0], inflict: { cond: 'diseased', chance: 0.2 }, tint: '#8e8a84', size: 0.42 },
  // the Ways (#757), a soldier on the line at 30: the sleepers' touch, Rimewater's
  { id: 'keeper', name: 'Keeper', plural: 'Keepers', sprite: 'keeper', kind: 'machine', look: 'A keeper with no bay to keep, and no robe.', level: 30, hp: 427, ac: 26, attack: 17, dice: 5, sides: 7, bonus: 7, speed: 11, xp: 1193, gold: [0, 0], inflict: { cond: 'asleep', chance: 0.15 }, tint: '#4a5058', size: 1.15 },
  // the Stair's first landing (#758), armoured on the line at 30, where the claimant's people are not
  { id: 'hand_rearguard', name: 'Ashen Rearguard', plural: 'Ashen Rearguards', sprite: 'hand_rearguard', kind: 'person', look: 'The last of the Hand still standing, and standing in the way.', steady: true, level: 30, hp: 529, ac: 28, attack: 17, dice: 6, sides: 8, bonus: 6, speed: 8, xp: 1591, gold: [0, 0], tint: '#3a3436', size: 1.05 },
  // the Heart, at the panel (#759), an elite on the line at 31: their grip
  { id: 'grey_hand', name: 'Grey Hand', plural: 'Grey Hands', sprite: 'grey_hand', kind: 'person', look: 'Hands the colour of ash, to the shoulder.', steady: true, level: 31, hp: 737, ac: 27, attack: 18, dice: 6, sides: 8, bonus: 9, speed: 15, xp: 2467, gold: [0, 0], inflict: { cond: 'paralysed', chance: 0.15 }, tint: '#262226', size: 1.05 },
  // called by the ring (#759), a soldier on the line at 31: the heavy machines' frame, the core's own; it stands down when Vask falls
  { id: 'core_sentry', name: 'Core Sentry', plural: 'Core Sentries', sprite: 'core_sentry', kind: 'machine', look: 'The core\'s own, and it takes orders from the ring.', level: 31, hp: 436, ac: 27, attack: 17, dice: 5, sides: 8, bonus: 4, speed: 11, xp: 1233, gold: [0, 0], obeys: true, tint: '#c3c7cc', size: 1.45 },
  // the Heart (#759), the boss on the line at 32: he calls the core's sentries with the Queen's ring, and never breaks
  { id: 'vask', name: 'Lord Vask', plural: 'Lord Vasks', sprite: 'vask', kind: 'person', look: 'A tall man with a quiet voice, and the Queen\'s ring on his finger.', steady: true, level: 32, hp: 1922, ac: 29, attack: 20, dice: 32, sides: 8, bonus: 33, speed: 13, xp: 20373, gold: [0, 0], calls: { monsters: ['core_sentry'], chance: 1 }, tint: '#6c7078', size: 1.6 },
];
