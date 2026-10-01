// The gear ladder (#99, EXPANSION §5.2): every class betters its kit by level 3 and again by level 5,
// from what Mottram's sells and what the Downs hold; each find is an item within the Foreland's
// window, owed to the box that places it until a chest, cairn, statue or drop gives it; Mottram's
// sells the ladder's plain step; and the gate check's company wears what harness's does. Past them,
// Thornmark (#101): every class finds a plus it can use there, and nothing there gives the Armoury's
// gear. At the top, the Deepthorn (#212): every class betters its Thornmark find by 10, each find
// inside Thornmark's window and owed to its box until placed. Past it, Act II (#399): Saltmouth's
// armourer's step at 11, its plus finds by 13, Lantern Watch's stores' at 14 and theirs by 16, each
// rung bettered by every class, each ware and find inside its area's window and owed to its shop or
// box until it is sold or placed.
import { AREAS, MAP_DEFS, MONSTERS, ITEMS } from '../../src/content/index.ts';
import { CURVE } from '../../src/content/progression.ts';
import { CLASSES, robeLike } from '../../src/game/party.ts';
import type { ClassId } from '../../src/game/party.ts';
import type { ItemDef } from '../../src/game/items.ts';
import { GEAR, companyAt } from '../harness.ts';
import { gateCompany } from '../gate.ts';
import { giftOf, spentId } from '../../src/game/wilds.ts';
import { ok, owed } from './lib.ts';

/** The issue's table: what each class betters its kit with, by level 3 and by level 5. */
export const LADDER: Record<ClassId, { 3: readonly string[]; 5: readonly string[] }> = {
  knight: { 3: ['chain', 'shield'], 5: ['captains_sword', 'shield+1'] },
  paladin: { 3: ['longsword', 'chain'], 5: ['queens_sword', 'shield+1'] },
  ranger: { 3: ['longbow', 'chain'], 5: ['longbow+1'] },
  barbarian: { 3: ['longsword'], 5: ['halberd+1', 'leather+1'] },
  cleric: { 3: ['mace+1'], 5: ['robe+1', 'buckler+1'] },
  sorcerer: { 3: ['dagger+1'], 5: ['robe+1'] },
  thief: { 3: ['shortsword+1'], 5: ['leather+1'] },
  bard: { 3: ['shortsword+1'], 5: ['leather+1'] },
  monk: { 3: ['staff+1'], 5: ['robe+1', 'spear+1'] },
  druid: { 3: ['staff+1'], 5: ['leather+1', 'spear+1'] },
};

/**
 * The Downs' finds and the box that places each: F2 and F3 (#47), E3 (#67), E2 (#68), D2 (#69), the
 * Berth (#70), D3 (#71), D4 (#72); '' once placed, when it must be found.
 */
export const FINDS: Record<string, string> = {
  'shortsword+1': '', 'dagger+1': '', 'mace+1': '', 'staff+1': '',
  'buckler+1': '',
  'robe+1': '', 'leather+1': '', silver_locket: '',
  'halberd+1': '', ring_of_office: '', 'spear+1': '',
  captains_sword: '', captains_mail: '', queens_sword: '',
  'longbow+1': '',
  'shield+1': '',
};

/**
 * Thornmark's step (#101): the plus each class finds there, in its chests or on the Hand of Ash, and
 * in the ladder by 9.
 */
export const THORNMARK: Record<ClassId, readonly string[]> = {
  knight: ['warhammer+1'],
  paladin: ['warhammer+1'],
  ranger: ['elfbow+1'],
  barbarian: ['greatsword+1', 'brigandine+1', 'brigandine+2'],
  cleric: ['warhammer+1', 'runed_robe+1'],
  sorcerer: ['rune_dagger+1', 'runed_robe+1'],
  thief: ['rune_dagger+1', 'brigandine+1', 'brigandine+2'],
  bard: ['rune_dagger+1', 'brigandine+1', 'brigandine+2'],
  monk: ['grove_staff+1'],
  druid: ['grove_staff+1', 'brigandine+1', 'brigandine+2'],
};

/** The Deepthorn's step (#212, docs/areas/thornmark.md §8): what each class betters its Thornmark find with by 10. */
export const DEEPTHORN: Record<ClassId, readonly string[]> = {
  knight: ['warhammer+2', 'tower_shield+1'],
  paladin: ['warhammer+2', 'tower_shield+1'],
  ranger: ['elfbow+2'],
  barbarian: ['greatsword+2', 'brigandine+3'],
  cleric: ['warhammer+2', 'runed_robe+2'],
  sorcerer: ['rune_dagger+2', 'runed_robe+2'],
  thief: ['rune_dagger+2', 'brigandine+3'],
  bard: ['rune_dagger+2', 'brigandine+3'],
  monk: ['eldests_bough'],
  druid: ['eldests_bough', 'brigandine+3'],
};

/** The Deepthorn's finds and the box that places each: H3 (#214), I3 (#215), I4 (#49), J4 (#216), I5 (#217), J5 (#218); '' once placed. */
export const DEEP_FINDS: Record<string, string> = {
  'tower_shield+1': '', 'rune_dagger+2': '',
  'runed_robe+2': '',
  'elfbow+2': '', 'brigandine+3': '',
  'warhammer+2': '',
  silver_torc: '',
  eldests_bough: '', 'greatsword+2': '',
};

/**
 * Act II's rungs (#399, docs/areas/saltreach.md §4.1, docs/areas/sunderwood.md §8): what each class
 * betters the rung before with, and where each comes from: a ware's area and the shop's issue that
 * sells it, a find's area and the box's issue that places it; '' once sold or placed.
 */
export const ACT_II: readonly { level: number; name: string; from: Record<string, readonly [area: 'saltreach' | 'wrackholm' | 'sunderwood', whose: string]>; classes: Record<ClassId, readonly string[]> }[] = [
  {
    level: 11, name: "Saltmouth's armourer",
    from: Object.fromEntries(['morning_star', 'stiletto', 'horn_bow', 'long_axe', 'ironshod_staff', 'sharkskin', 'tidefolk_robe'].map((id) => [id, ['saltreach', '#177']])),
    classes: {
      knight: ['morning_star'], paladin: ['morning_star'], ranger: ['horn_bow', 'sharkskin'], barbarian: ['long_axe', 'sharkskin'],
      cleric: ['morning_star', 'tidefolk_robe'], sorcerer: ['stiletto', 'tidefolk_robe'], thief: ['stiletto', 'sharkskin'], bard: ['stiletto', 'sharkskin'],
      monk: ['ironshod_staff'], druid: ['ironshod_staff', 'sharkskin'],
    },
  },
  {
    level: 13, name: "Saltreach's and Wrackholm's finds",
    from: {
      'stiletto+1': ['saltreach', '#172'], 'ironshod_staff+1': ['saltreach', '#173'], 'morning_star+1': ['saltreach', '#175'],
      'tidefolk_robe+1': ['saltreach', '#176'], 'horn_bow+1': ['saltreach', '#178'], 'plate+1': ['wrackholm', ''], 'long_axe+1': ['wrackholm', '#190'],
    },
    classes: {
      knight: ['morning_star+1', 'plate+1'], paladin: ['morning_star+1', 'plate+1'], ranger: ['horn_bow+1'], barbarian: ['long_axe+1'],
      cleric: ['morning_star+1', 'tidefolk_robe+1'], sorcerer: ['stiletto+1', 'tidefolk_robe+1'], thief: ['stiletto+1'], bard: ['stiletto+1'],
      monk: ['ironshod_staff+1'], druid: ['ironshod_staff+1'],
    },
  },
  {
    level: 14, name: "Lantern Watch's stores",
    from: Object.fromEntries(['flail', 'wardens_dirk', 'ironwood_bow', 'great_axe', 'lantern_staff', 'lamellar', 'watch_habit', 'watch_shield'].map((id) => [id, ['sunderwood', '#201']])),
    classes: {
      knight: ['flail', 'watch_shield'], paladin: ['flail', 'watch_shield'], ranger: ['ironwood_bow', 'lamellar'], barbarian: ['great_axe', 'lamellar'],
      cleric: ['flail', 'watch_habit'], sorcerer: ['wardens_dirk', 'watch_habit'], thief: ['wardens_dirk', 'lamellar'], bard: ['wardens_dirk', 'lamellar'],
      monk: ['lantern_staff'], druid: ['lantern_staff', 'lamellar'],
    },
  },
  {
    level: 16, name: "the Sunder's finds",
    from: {
      'great_axe+1': ['sunderwood', ''], 'wardens_dirk+1': ['sunderwood', '#198'], 'flail+1': ['sunderwood', '#199'],
      'ironwood_bow+1': ['sunderwood', '#199'], 'plate+2': ['sunderwood', '#199'], lanterns_staff: ['sunderwood', '#200'],
    },
    classes: {
      knight: ['flail+1', 'plate+2'], paladin: ['flail+1', 'plate+2'], ranger: ['ironwood_bow+1'], barbarian: ['great_axe+1'],
      cleric: ['flail+1'], sorcerer: ['wardens_dirk+1'], thief: ['wardens_dirk+1'], bard: ['wardens_dirk+1'],
      monk: ['lanterns_staff'], druid: ['lanterns_staff'],
    },
  },
];

/** An item's kind: a hand weapon, a bow, armour or a shield. Only the same kind is bettered. */
const kind = (d: ItemDef): string => (d.slot === 'weapon' ? (d.ranged ? 'bow' : 'hand') : d.slot);
/** How good an item is of its kind: a weapon's mean blow with its plus, armour's and a shield's AC. */
const worth = (d: ItemDef): number => (d.slot === 'weapon' ? ((d.dice ?? 1) * ((d.sides ?? 4) + 1)) / 2 + (d.bonus ?? 0) : d.ac ?? 0);
const usable = (d: ItemDef, cls: ClassId): boolean => !d.classes || d.classes.includes(cls);
/** The ladder's ids by `level`. */
const by = (level: number): string[] => GEAR.filter(([at]) => at <= level).flatMap(([, ids]) => ids);

export function ladder(): void {
  // Class by class: each item the table names is in the ladder by its level, the class can use it,
  // and it betters the best of its kind the class had: at 3 its kit, at 5 its kit and the ladder by 3.
  for (const [cls, steps] of Object.entries(LADDER) as [ClassId, (typeof LADDER)[ClassId]][]) {
    for (const level of [3, 5] as const) {
      const had = [...CLASSES[cls].kit, ...(level === 5 ? by(3) : [])].map((id) => ITEMS[id]).filter((d) => usable(d, cls));
      const faults = steps[level].flatMap((id) => {
        const d = ITEMS[id];
        if (!d) return [`${id} is no item`];
        if (!by(level).includes(id)) return [`${id} is not in the ladder by ${level}`];
        if (!usable(d, cls)) return [`${id} is not for a ${cls}`];
        const best = Math.max(0, ...had.filter((h) => kind(h) === kind(d)).map(worth));
        return worth(d) > best ? [] : [`${id} (${worth(d)}) is no better than the ${kind(d)} it had (${best})`];
      });
      ok(steps[level].length > 0 && !faults.length, `the ${CLASSES[cls].name} betters its kit by ${level}: ${steps[level].join(', ')}${faults.length ? ` (${faults.join('; ')})` : ''}`);
    }
  }
  ok(Object.keys(LADDER).length === Object.keys(CLASSES).length, `every class is on the ladder (${Object.keys(LADDER).length} of ${Object.keys(CLASSES).length})`);

  // The Deepthorn, class by class: each find is in the ladder by 10 and no sooner, the class can use
  // it and it betters the best of its kind the class had by 9, its kit and the ladder's gear. A class
  // that bears a shield takes no two-handed weapon, and one with Unarmoured Defence no armour past a
  // robe's (`robeLike`).
  for (const [cls, finds] of Object.entries(DEEPTHORN) as [ClassId, readonly string[]][]) {
    const had = [...CLASSES[cls].kit, ...by(9)].map((id) => ITEMS[id]).filter((d) => usable(d, cls));
    const shielded = [...CLASSES[cls].kit, ...finds].some((id) => ITEMS[id]?.slot === 'shield');
    const faults = finds.flatMap((id) => {
      const d = ITEMS[id];
      if (!d) return [`${id} is no item`];
      if (!by(10).includes(id) || by(9).includes(id)) return [`${id} is not in the ladder at 10`];
      if (!usable(d, cls)) return [`${id} is not for a ${cls}`];
      if (shielded && d.twoHanded) return [`${id} is two-handed, and a ${cls} bears a shield`];
      if (CLASSES[cls].traits.includes('unarmoured') && d.slot === 'armor' && !robeLike(d)) return [`${id} is past a robe's armour, and a ${cls} fights unarmoured`];
      const best = Math.max(0, ...had.filter((h) => kind(h) === kind(d)).map(worth));
      return worth(d) > best ? [] : [`${id} (${worth(d)}) is no better than the ${kind(d)} it had by 9 (${best})`];
    });
    ok(finds.length > 0 && !faults.length, `the ${CLASSES[cls].name} betters its Thornmark find by 10: ${finds.join(', ')}${faults.length ? ` (${faults.join('; ')})` : ''}`);
  }
  ok(Object.keys(DEEPTHORN).length === Object.keys(CLASSES).length, `every class has a Deepthorn find (${Object.keys(DEEPTHORN).length} of ${Object.keys(CLASSES).length})`);
  const unlisted = by(10).filter((id) => !by(9).includes(id) && !(id in DEEP_FINDS));
  ok(!unlisted.length, `every rung at 10 is a Deepthorn find with its box${unlisted.length ? ` (not: ${unlisted.join(', ')})` : ''}`);

  // Act II, rung by rung, as the Deepthorn's: each item is in the ladder at its rung and no sooner, the
  // class can use it, and it betters the best of its kind the class had on the rung before.
  ACT_II.forEach((rung, k) => {
    const before = k ? ACT_II[k - 1].level : 10;
    for (const [cls, ids] of Object.entries(rung.classes) as [ClassId, readonly string[]][]) {
      // A class that bears a shield had no two-hander to better.
      const shielded = [...CLASSES[cls].kit, ...ids].some((id) => ITEMS[id]?.slot === 'shield');
      const had = [...CLASSES[cls].kit, ...by(before)].map((id) => ITEMS[id]).filter((d) => usable(d, cls) && !(shielded && d.twoHanded));
      const faults = ids.flatMap((id) => {
        const d = ITEMS[id];
        if (!d) return [`${id} is no item`];
        if (!by(rung.level).includes(id) || by(rung.level - 1).includes(id)) return [`${id} is not in the ladder at ${rung.level}`];
        if (!(id in rung.from)) return [`${id} is not one of ${rung.name}`];
        if (!usable(d, cls)) return [`${id} is not for a ${cls}`];
        if (shielded && d.twoHanded) return [`${id} is two-handed, and a ${cls} bears a shield`];
        if (CLASSES[cls].traits.includes('unarmoured') && d.slot === 'armor' && !robeLike(d)) return [`${id} is past a robe's armour, and a ${cls} fights unarmoured`];
        const best = Math.max(0, ...had.filter((h) => kind(h) === kind(d)).map(worth));
        return worth(d) > best ? [] : [`${id} (${worth(d)}) is no better than the ${kind(d)} it had by ${before} (${best})`];
      });
      ok(ids.length > 0 && !faults.length, `the ${CLASSES[cls].name} betters its gear by ${rung.level} from ${rung.name}: ${ids.join(', ')}${faults.length ? ` (${faults.join('; ')})` : ''}`);
    }
    ok(Object.keys(rung.classes).length === Object.keys(CLASSES).length, `every class has a step from ${rung.name} (${Object.keys(rung.classes).length} of ${Object.keys(CLASSES).length})`);
    const rungIds = by(rung.level).filter((id) => !by(rung.level - 1).includes(id));
    const stray = [...rungIds.filter((id) => !(id in rung.from)), ...Object.keys(rung.from).filter((id) => !rungIds.includes(id))];
    ok(!stray.length, `the ladder at ${rung.level} is ${rung.name}, every one of them${stray.length ? ` (not: ${stray.join(', ')})` : ''}`);
  });

  // Every id in the ladder is an item, and every find is one within the Foreland's window.
  const missing = GEAR.flatMap(([, ids]) => ids).filter((id) => !ITEMS[id]);
  ok(!missing.length, `every rung of the ladder is an item${missing.length ? ` (not: ${missing.join(', ')})` : ''}`);
  const found = new Set([
    ...MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => giftOf(f)?.items ?? [])),
    ...Object.values(MONSTERS).flatMap((m) => (m.drops ?? []).map((x) => x.item)),
  ]);
  for (const [id, whose] of Object.entries(FINDS)) {
    const d = ITEMS[id];
    ok(!!d && d.price > 0 && d.price <= CURVE.shelf.price, `find ${id} is an item within the Foreland's window (${d?.price} of ${CURVE.shelf.price} gold)`);
    const msg = `find ${id} lies in a chest, a cairn, a statue's gift or a hoard`;
    if (whose) owed(found.has(id), msg, whose); else ok(found.has(id), msg);
  }
  for (const [id, whose] of Object.entries(DEEP_FINDS)) {
    const d = ITEMS[id];
    ok(!!d && d.price > 0 && d.price <= CURVE.thornmark.price, `find ${id} is an item within Thornmark's window (${d?.price} of ${CURVE.thornmark.price} gold)`);
    const msg = `find ${id} lies in a chest, a cairn, a statue's gift or a hoard`;
    if (whose) owed(found.has(id), msg, whose); else ok(found.has(id), msg);
  }

  // Act II's wares are sold in their area and its finds placed there, each inside the area's window;
  // each owed to its shop or box until it is.
  const areaOf = (id: string) => AREAS.find((a) => a.id === id)!;
  for (const rung of ACT_II) for (const [id, [area, whose]] of Object.entries(rung.from)) {
    const d = ITEMS[id], a = areaOf(area), plus = !!d?.plus;
    ok(!!d && d.price > 0 && d.price <= CURVE[area].price, `${plus ? 'find' : 'ware'} ${id} is an item within ${area}'s window (${d?.price} of ${CURVE[area].price} gold)`);
    const there = plus
      ? a.maps.some((m) => (m.features ?? []).some((f) => giftOf(f)?.items?.includes(id))) || a.monsters.some((m) => (m.drops ?? []).some((x) => x.item === id))
      : a.maps.some((m) => (m.features ?? []).some((f) => f.kind === 'shop' && f.stock.includes(id)));
    const msg = plus ? `find ${id} lies in a chest, a cairn, a statue's gift or a hoard in ${area}` : `ware ${id} is sold in ${area}`;
    if (whose) owed(there, msg, whose); else ok(there, msg);
  }

  // Mottram's sells the ladder's plain step: the band's gear.
  const shop = MAP_DEFS.find((d) => d.id === 'harrow')?.features?.find((f) => f.kind === 'shop');
  const plain = GEAR.find(([at]) => at === 3)![1].filter((id) => !ITEMS[id].plus);
  const unsold = plain.filter((id) => !(shop?.kind === 'shop' && shop.stock.includes(id)));
  ok(!!shop && plain.length > 0 && !unsold.length, `${shop?.name} sells the band's gear, ${plain.join(', ')}${unsold.length ? ` (not: ${unsold.join(', ')})` : ''}`);

  // Thornmark: every class finds a plus it can use in what its chests, cairns and statues give or its
  // monsters drop, and none of them gives gear the Armoury sells; its potions, oil and rations are no
  // gear, as in the curve's window.
  const tm = AREAS.find((a) => a.id === 'thornmark')!;
  const chests = tm.maps.flatMap((d) => (d.features ?? []).flatMap((f) => {
    const items = giftOf(f)?.items ?? [];
    return items.length ? [{ map: d.id, id: `${f.kind} ${spentId(f) ?? ''}`.trim(), items }] : [];
  }));
  const inTm = new Set([...chests.flatMap((c) => c.items), ...tm.monsters.flatMap((m) => (m.drops ?? []).map((x) => x.item))]);
  for (const [cls, pluses] of Object.entries(THORNMARK) as [ClassId, readonly string[]][]) {
    const faults = pluses.flatMap((id) => {
      const d = ITEMS[id];
      if (!d?.plus) return [`${id} is no item with a plus`];
      if (!inTm.has(id)) return [`${id} is given or dropped nowhere there`];
      if (!by(9).includes(id)) return [`${id} is not in the ladder by 9`];
      return usable(d, cls) ? [] : [`${id} is not for a ${cls}`];
    });
    ok(pluses.length > 0 && !faults.length, `the ${CLASSES[cls].name} finds a plus in Thornmark: ${pluses.join(', ')}${faults.length ? ` (${faults.join('; ')})` : ''}`);
  }
  const armoury = tm.maps.flatMap((d) => (d.features ?? []).flatMap((f) => (f.kind === 'shop' ? f.stock : [])));
  const sold = chests.flatMap((c) => c.items.filter((id) => ITEMS[id].slot !== 'none' && armoury.includes(id)).map((id) => `${c.map}'s ${c.id} holds ${id}`));
  ok(armoury.length > 0 && !sold.length, `nothing in Thornmark gives gear its Armoury sells${sold.length ? ` (${sold.join('; ')})` : ''}`);

  // The gate check's company wears what harness's does, level by level.
  const worn = (p: ReturnType<typeof companyAt>): string => JSON.stringify(p.members.map((m) => m.equipment));
  const differ = Array.from({ length: 10 }, (_, k) => k + 1).filter((l) => worn(gateCompany(l, 11)) !== worn(companyAt(l, 11)));
  ok(!differ.length, `the gate check's company is dressed as harness's at 1 to 10${differ.length ? ` (not at ${differ.join(', ')})` : ''}`);
}
