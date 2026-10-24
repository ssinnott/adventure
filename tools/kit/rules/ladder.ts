// The acts' rungs the ladder suite holds (#984): what each act's trainers and finds give each class
// by a level. Five walkthroughs take them from here.
import { FORGE } from '../../../src/content/areas/kilns/items.ts';
import { FURRIER } from '../../../src/content/areas/rimewater/items.ts';
import { ARMOURER } from '../../../src/content/areas/ashfall/items.ts';
import type { ClassId } from '../../../src/game/party.ts';

/**
 * Act II's rungs (#399, docs/areas/saltreach.md §4.1, docs/areas/sunderwood.md §8): what each class
 * betters the rung before with, and where each comes from: a ware's area and the shop's issue that
 * sells it, a find's area and the box's issue that places it; '' once sold or placed.
 */
export const ACT_II: readonly { level: number; name: string; from: Record<string, readonly [area: 'saltreach' | 'wrackholm' | 'sunderwood', whose: string]>; classes: Record<ClassId, readonly string[]> }[] = [
  {
    level: 11, name: "Saltmouth's armourer",
    from: Object.fromEntries(['morning_star', 'stiletto', 'horn_bow', 'long_axe', 'ironshod_staff', 'sharkskin', 'tidefolk_robe'].map((id) => [id, ['saltreach', '']])),
    classes: {
      knight: ['morning_star'], paladin: ['morning_star'], ranger: ['horn_bow', 'sharkskin'], barbarian: ['long_axe', 'sharkskin'],
      cleric: ['morning_star', 'tidefolk_robe'], sorcerer: ['stiletto', 'tidefolk_robe'], thief: ['stiletto', 'sharkskin'], bard: ['stiletto', 'sharkskin'],
      monk: ['ironshod_staff'], druid: ['ironshod_staff', 'sharkskin'],
    },
  },
  {
    level: 13, name: "Saltreach's and Wrackholm's finds",
    from: {
      'stiletto+1': ['saltreach', ''], 'ironshod_staff+1': ['saltreach', ''], 'morning_star+1': ['saltreach', ''],
      'tidefolk_robe+1': ['saltreach', ''], 'horn_bow+1': ['saltreach', ''], 'plate+1': ['wrackholm', ''], 'long_axe+1': ['wrackholm', ''],
    },
    classes: {
      knight: ['morning_star+1', 'plate+1'], paladin: ['morning_star+1', 'plate+1'], ranger: ['horn_bow+1'], barbarian: ['long_axe+1'],
      cleric: ['morning_star+1', 'tidefolk_robe+1'], sorcerer: ['stiletto+1', 'tidefolk_robe+1'], thief: ['stiletto+1'], bard: ['stiletto+1'],
      monk: ['ironshod_staff+1'], druid: ['ironshod_staff+1'],
    },
  },
  {
    level: 14, name: "Lantern Watch's stores",
    from: Object.fromEntries(['flail', 'wardens_dirk', 'ironwood_bow', 'great_axe', 'watch_staff', 'lamellar', 'watch_habit', 'watch_shield'].map((id) => [id, ['sunderwood', '']])),
    classes: {
      knight: ['flail', 'watch_shield'], paladin: ['flail', 'watch_shield'], ranger: ['ironwood_bow', 'lamellar'], barbarian: ['great_axe', 'lamellar'],
      cleric: ['flail', 'watch_habit'], sorcerer: ['wardens_dirk', 'watch_habit'], thief: ['wardens_dirk', 'lamellar'], bard: ['wardens_dirk', 'lamellar'],
      monk: ['watch_staff'], druid: ['watch_staff', 'lamellar'],
    },
  },
  {
    level: 16, name: "the Sunder's finds",
    from: {
      'great_axe+1': ['sunderwood', ''], 'wardens_dirk+1': ['sunderwood', ''], 'flail+1': ['sunderwood', ''],
      'ironwood_bow+1': ['sunderwood', ''], 'plate+2': ['sunderwood', ''], lanterns_staff: ['sunderwood', ''],
    },
    classes: {
      knight: ['flail+1', 'plate+2'], paladin: ['flail+1', 'plate+2'], ranger: ['ironwood_bow+1'], barbarian: ['great_axe+1'],
      cleric: ['flail+1'], sorcerer: ['wardens_dirk+1'], thief: ['wardens_dirk+1'], bard: ['wardens_dirk+1'],
      monk: ['lanterns_staff'], druid: ['lanterns_staff'],
    },
  },
];

/**
 * A rung past Act I's: its level and name, where each of its items comes from, and what each class
 * takes. `found`: every piece of it is a find though it carries no plus, and no shop sells it (#746).
 */
export type Rung<Where extends string> = { level: number; name: string; found?: true; from: Record<string, readonly [area: Where, whose: string]>; classes: Record<ClassId, readonly string[]> };

/**
 * Act III's rungs (#535, docs/areas/kilns.md §9), as Act II's: a ware's area and the shop's issue
 * that sells it, a find's area and the box's issue that places it; '' once sold or placed. Its
 * areas are planned, so every one is owed until its area is listed and its shop or box built.
 */
export const ACT_III: readonly Rung<'kilns' | 'cairnmoor' | 'rimewater'>[] = [
  {
    level: 17, name: "Anvilhall's forge",
    from: Object.fromEntries(FORGE.map((id) => [id, ['kilns', '']])),
    classes: {
      knight: ['forge_hammer', 'forge_shield'], paladin: ['forge_hammer', 'forge_shield'], ranger: ['steel_bow', 'dwarf_mail'], barbarian: ['mattock', 'dwarf_mail'],
      cleric: ['forge_hammer', 'kiln_robe'], sorcerer: ['seax', 'kiln_robe'], thief: ['seax', 'dwarf_mail'], bard: ['seax', 'dwarf_mail'],
      monk: ['banded_staff'], druid: ['banded_staff', 'dwarf_mail'],
    },
  },
  {
    level: 19, name: "the Kilns' and Cairnmoor's finds",
    from: {
      'plate+3': ['kilns', ''], 'forge_hammer+1': ['kilns', ''], 'mattock+1': ['kilns', ''], 'steel_bow+1': ['kilns', ''],
      'seax+1': ['kilns', ''], 'kiln_robe+1': ['kilns', ''], 'banded_staff+1': ['cairnmoor', ''],
    },
    classes: {
      knight: ['forge_hammer+1', 'plate+3'], paladin: ['forge_hammer+1', 'plate+3'], ranger: ['steel_bow+1'], barbarian: ['mattock+1'],
      cleric: ['forge_hammer+1', 'kiln_robe+1'], sorcerer: ['seax+1', 'kiln_robe+1'], thief: ['seax+1'], bard: ['seax+1'],
      monk: ['banded_staff+1'], druid: ['banded_staff+1'],
    },
  },
  {
    level: 21, name: "Rime Lodge's furrier",
    from: Object.fromEntries(FURRIER.map((id) => [id, ['rimewater', '']])),
    classes: {
      knight: ['ice_axe'], paladin: ['ice_axe'], ranger: ['hunters_bow', 'bearskin'], barbarian: ['bear_spear', 'bearskin'],
      cleric: ['ice_axe', 'fur_robe'], sorcerer: ['skinning_knife', 'fur_robe'], thief: ['skinning_knife', 'bearskin'], bard: ['skinning_knife', 'bearskin'],
      monk: ['guides_staff'], druid: ['guides_staff', 'bearskin'],
    },
  },
  {
    level: 22, name: "Rimewater's finds",
    from: {
      'ice_axe+1': ['rimewater', ''], 'skinning_knife+1': ['rimewater', ''], 'bear_spear+1': ['rimewater', ''],
      'guides_staff+1': ['rimewater', ''], 'hunters_bow+1': ['rimewater', ''], 'plate+4': ['rimewater', ''],
    },
    classes: {
      knight: ['ice_axe+1', 'plate+4'], paladin: ['ice_axe+1', 'plate+4'], ranger: ['hunters_bow+1'], barbarian: ['bear_spear+1'],
      cleric: ['ice_axe+1'], sorcerer: ['skinning_knife+1'], thief: ['skinning_knife+1'], bard: ['skinning_knife+1'],
      monk: ['guides_staff+1'], druid: ['guides_staff+1'],
    },
  },
];

/**
 * Act IV's rung (#542, docs/areas/ashfall.md §9), as Act III's and with one step: Cinderport's
 * armourer's, at 25. The Whitespine has no town and the Wold none, whose Riders buy here by the ride
 * (#547). Every ware is sold at the armourer (#512); a plus on it is the boxes' to choose, off the
 * ladder.
 */
export const ACT_IV: readonly Rung<'ashfall'>[] = [
  {
    level: 25, name: "Cinderport's armourer",
    from: Object.fromEntries(ARMOURER.map((id) => [id, ['ashfall', '']])),
    classes: {
      knight: ['slag_mace', 'basalt_shield'], paladin: ['slag_mace', 'basalt_shield'], ranger: ['ashwood_bow', 'drakeskin'], barbarian: ['flamberge', 'drakeskin'],
      cleric: ['slag_mace', 'cinder_robe'], sorcerer: ['marlinspike', 'cinder_robe'], thief: ['marlinspike', 'drakeskin'], bard: ['marlinspike', 'drakeskin'],
      monk: ['battle_staff'], druid: ['battle_staff', 'drakeskin'],
    },
  },
];

/**
 * Act V's rung (#746, docs/areas/hearth.md §8), the last: the Hand's steel at 28, found and never
 * sold, each piece a point past Cinderport's armourer's. The isle has no town: each piece lies in a
 * chest, a hoard or a drop of the box named beside it, every one placed. Each class takes the piece
 * that betters the one it took at 25, and plate's wearers the mail, which betters their plate; the
 * two pieces §8 gives across its groups go to every class they better: the Grey Blade to the cleric
 * beside the knight and the paladin, the Old Lantern's Staff to every class but the shield bearers.
 */
export const ACT_V: readonly Rung<'hearth'>[] = [
  {
    level: 28, name: "the Hand's steel", found: true,
    from: {
      grey_knife: ['hearth', ''], // the isle, H6 (#753): the picket's chest and the champions' drop
      grey_staff: ['hearth', ''], grey_mail: ['hearth', ''], // the east rim, I6 (#754): the Hand's camp's chest and its hoard
      grey_blade: ['hearth', ''], grey_bow: ['hearth', ''], // the temple (#755): its treasury
      grey_robe: ['hearth', ''], // the crypt (#756): the dead champion's pack
      grey_shield: ['hearth', ''], old_lanterns_staff: ['hearth', ''], // the Ways (#757): the keepers' store and the hall behind the crack
      grey_axe: ['hearth', ''], // the Stair (#758): the rearguard's chest
    },
    classes: {
      knight: ['grey_blade', 'grey_mail', 'grey_shield'], paladin: ['grey_blade', 'grey_mail', 'grey_shield'], ranger: ['grey_bow', 'grey_mail'],
      barbarian: ['grey_axe', 'grey_mail'], cleric: ['grey_blade', 'old_lanterns_staff', 'grey_robe'], sorcerer: ['grey_knife', 'old_lanterns_staff', 'grey_robe'],
      thief: ['grey_knife', 'old_lanterns_staff', 'grey_mail'], bard: ['grey_knife', 'old_lanterns_staff', 'grey_mail'],
      monk: ['grey_staff', 'old_lanterns_staff'], druid: ['grey_staff', 'old_lanterns_staff', 'grey_mail'],
    },
  },
];
