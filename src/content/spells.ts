// The spells, which no area owns: seven tiers per spell list (tiers unlock at levels 1, 2, 4, 6 and 8,
// then 15 and 23, a hybrid's two later; see src/game/party.ts spellTierAt). `list` is who can learn it; `sp` the
// cost; the effect fields say what it does, and every damage spell has an element (DESIGN §7). The
// order is the order they are taught in.
import type { SpellDef } from '../game/spells.ts';

export const SPELLS: readonly SpellDef[] = [
  // ---- cleric ----
  { id: 'heal', name: 'Mend', list: 'cleric', level: 1, sp: 2, target: 'ally', context: 'any', heal: 8, text: 'Heals a little.' },
  { id: 'bless', name: 'Bless', list: 'cleric', level: 2, sp: 3, target: 'party', context: 'combat', buff: 'bless', turns: 5, text: 'The party hits more often.' },
  { id: 'ward', name: 'Ward', list: 'cleric', level: 2, sp: 3, target: 'party', context: 'combat', buff: 'shield', turns: 5, text: 'The party is harder to hit.' },
  { id: 'cure', name: 'Cleanse', list: 'cleric', level: 3, sp: 4, target: 'ally', context: 'any', cure: ['poisoned', 'diseased', 'asleep', 'paralysed'], text: 'Removes an affliction.' },
  { id: 'mend_all', name: 'Mending Light', list: 'cleric', level: 3, sp: 6, target: 'party', context: 'any', heal: 10, text: 'Heals everyone a little.' },
  { id: 'smite', name: 'Smite', list: 'cleric', level: 4, sp: 5, target: 'enemy', context: 'combat', dice: 3, sides: 6, element: 'holy', text: 'Holy force strikes one foe.' },
  { id: 'restore', name: 'Restore', list: 'cleric', level: 4, sp: 8, target: 'ally', context: 'any', heal: 30, cure: ['poisoned', 'diseased', 'asleep', 'paralysed', 'cursed'], text: 'Heals much and cures all.' },
  { id: 'revive', name: 'Revive', list: 'cleric', level: 5, sp: 12, target: 'ally', context: 'any', raise: true, heal: 10, text: 'Calls the dead back.' },
  { id: 'wrath', name: 'Wrath of the Hearth', list: 'cleric', level: 5, sp: 12, target: 'all', context: 'combat', dice: 4, sides: 6, element: 'holy', text: 'Light scours every foe.' },
  { id: 'hearthfire', name: 'Hearthfire', list: 'cleric', level: 6, sp: 10, target: 'group', context: 'combat', dice: 6, sides: 8, element: 'fire', text: "The Hearth's fire on a whole group." },
  { id: 'cleansing_light', name: 'Cleansing Light', list: 'cleric', level: 6, sp: 9, target: 'party', context: 'any', cure: ['poisoned', 'diseased', 'asleep', 'paralysed'], text: 'Removes an affliction from everyone.' },
  { id: 'lampglass', name: 'Lampglass', list: 'cleric', level: 7, sp: 10, target: 'party', context: 'combat', glass: true, turns: 5, text: 'Dims one kind of harm for a while.' },
  { id: 'absolve', name: 'Absolve', list: 'cleric', level: 7, sp: 12, target: 'ally', context: 'any', cure: ['stoned', 'cursed'], text: 'Lifts stone and curse.' },
  // ---- sorcerer ----
  { id: 'spark', name: 'Spark', list: 'sorcerer', level: 1, sp: 2, target: 'enemy', context: 'combat', dice: 1, sides: 6, perLevel: true, element: 'lightning', text: 'A bolt of lightning at one foe.' },
  { id: 'light', name: 'Light', list: 'sorcerer', level: 1, sp: 1, target: 'party', context: 'explore', explore: 'light', text: 'Lights the way.' },
  { id: 'sleep', name: 'Slumber', list: 'sorcerer', level: 2, sp: 4, target: 'group', context: 'combat', inflict: 'asleep', text: 'A group may fall asleep.' },
  { id: 'firebolt', name: 'Fire Bolt', list: 'sorcerer', level: 3, sp: 5, target: 'group', context: 'combat', dice: 1, sides: 4, perLevel: true, element: 'fire', text: 'Fire on a whole group.' },
  { id: 'wizard_eye', name: 'Wizard Eye', list: 'sorcerer', level: 3, sp: 3, target: 'party', context: 'explore', explore: 'wizard_eye', text: 'Reveals the map around you.' },
  { id: 'haste', name: 'Haste', list: 'sorcerer', level: 4, sp: 7, target: 'party', context: 'combat', buff: 'haste', turns: 5, text: 'The party moves first and strikes true.' },
  { id: 'lightning', name: 'Chain Lightning', list: 'sorcerer', level: 4, sp: 9, target: 'all', context: 'combat', dice: 1, sides: 8, perLevel: true, element: 'lightning', text: 'Lightning leaps to every foe.' },
  { id: 'town_portal', name: 'Town Portal', list: 'sorcerer', level: 5, sp: 10, target: 'party', context: 'explore', explore: 'town_portal', text: 'Returns the party to the last town.' },
  { id: 'meteor', name: 'Meteor Swarm', list: 'sorcerer', level: 5, sp: 14, target: 'all', context: 'combat', dice: 2, sides: 10, perLevel: true, element: 'fire', text: 'Stones of fire fall on every foe.' },
  { id: 'hoarfrost', name: 'Hoarfrost', list: 'sorcerer', level: 6, sp: 11, target: 'group', context: 'combat', dice: 8, sides: 8, element: 'cold', text: 'Cold grips a whole group.' },
  { id: 'walk_water', name: 'Walk on Water', list: 'sorcerer', level: 6, sp: 8, target: 'party', context: 'explore', explore: 'walk', text: 'Shallow water bears you a short way.' },
  { id: 'waymark', name: 'Waymark', list: 'sorcerer', level: 6, sp: 10, target: 'party', context: 'explore', explore: 'mark', text: 'Marks the ground, or returns to the mark.' },
  { id: 'killing_frost', name: 'Killing Frost', list: 'sorcerer', level: 7, sp: 18, target: 'all', context: 'combat', dice: 10, sides: 12, element: 'cold', text: 'A killing cold on every foe.' },
  { id: 'levitate', name: 'Levitate', list: 'sorcerer', level: 7, sp: 12, target: 'party', context: 'explore', explore: 'float', text: 'The party floats a few steps over a drop.' },
  // ---- druid (and ranger) ----
  { id: 'thorn', name: 'Thorn Lash', list: 'druid', level: 1, sp: 2, target: 'enemy', context: 'combat', dice: 2, sides: 4, element: 'nature', text: 'Thorns whip one foe.' },
  { id: 'foxfire', name: 'Foxfire', list: 'druid', level: 1, sp: 1, target: 'party', context: 'explore', explore: 'light', text: 'Pale fungus-light shows the way.' },
  { id: 'barkskin', name: 'Barkskin', list: 'druid', level: 2, sp: 3, target: 'party', context: 'combat', buff: 'shield', turns: 5, text: 'The party is harder to hit.' },
  { id: 'salve', name: 'Salve', list: 'druid', level: 2, sp: 3, target: 'ally', context: 'any', heal: 10, cure: ['poisoned'], text: 'Heals and draws out poison.' },
  { id: 'hawk_eye', name: "Hawk's Eye", list: 'druid', level: 3, sp: 3, target: 'party', context: 'explore', explore: 'wizard_eye', text: 'Reveals the map around you.' },
  { id: 'swarm', name: 'Stinging Swarm', list: 'druid', level: 3, sp: 5, target: 'group', context: 'combat', dice: 2, sides: 6, element: 'nature', text: 'Insects fall on a whole group.' },
  { id: 'regrowth', name: 'Regrowth', list: 'druid', level: 4, sp: 7, target: 'party', context: 'any', heal: 16, text: 'Heals everyone.' },
  { id: 'hailstorm', name: 'Hailstorm', list: 'druid', level: 4, sp: 9, target: 'all', context: 'combat', dice: 1, sides: 6, perLevel: true, element: 'cold', text: 'Hail batters every foe.' },
  { id: 'stag_heart', name: 'Heart of the Stag', list: 'druid', level: 5, sp: 10, target: 'party', context: 'combat', buff: 'haste', turns: 5, text: 'The party moves first and strikes true.' },
  { id: 'tempest', name: 'Tempest', list: 'druid', level: 5, sp: 13, target: 'all', context: 'combat', dice: 2, sides: 8, perLevel: true, element: 'lightning', text: 'Wind and lightning on every foe.' },
  { id: 'wildfire', name: 'Wildfire', list: 'druid', level: 6, sp: 10, target: 'group', context: 'combat', dice: 6, sides: 8, element: 'fire', text: "The wood's own fire on a whole group." },
  { id: 'roots', name: 'Grasping Roots', list: 'druid', level: 6, sp: 7, target: 'group', context: 'combat', inflict: 'paralysed', text: 'Roots may hold a group fast.' },
  { id: 'wrath_wood', name: 'Wrath of the Wood', list: 'druid', level: 7, sp: 16, target: 'all', context: 'combat', dice: 8, sides: 10, element: 'nature', text: 'The whole wood turns on every foe.' },
  { id: 'greening', name: 'Greening', list: 'druid', level: 7, sp: 14, target: 'party', context: 'any', heal: 30, cure: ['poisoned', 'diseased'], text: 'Heals all well; draws out poison and rot.' },
];
