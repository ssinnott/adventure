// The gear ladder (#99, EXPANSION §5.2): every class betters its kit by level 3 and again by level 5,
// from what Mottram's sells and what the Downs hold; each find is an item within the Foreland's
// window, owed to the box that places it until a chest, cairn, statue or drop gives it; Mottram's
// sells the ladder's plain step; and the gate check's company wears what harness's does. Past them,
// Thornmark (#101): every class finds a plus it can use there, and nothing there gives the Armoury's
// gear. At the top, the Deepthorn (#212): every class betters its Thornmark find by 10, each find
// inside Thornmark's window and owed to its box until placed. Past it, Act II (#399): Saltmouth's
// armourer's step at 11, its plus finds by 13, Lantern Watch's stores' at 14 and theirs by 16, each
// rung bettered by every class, each ware and find inside its area's window and owed to its shop or
// box until it is sold or placed. Past that, Act III (#535) the same way: Anvilhall's forge at 17,
// the Kilns' and Cairnmoor's plus finds by 19, Rime Lodge's furrier at 21 and Rimewater's by 22,
// each owed to its shop or box while its area is planned; and Kilnhaven's smith's quarter more on
// the forge's wares sits inside the Kilns' window too. Then Act IV (#542), one step: Cinderport's
// armourer at 25, bettering the furrier's and Rimewater's finds for every class, owed to the town's
// box while Ashfall is planned; and the stone cure (#546), a consumable inside the window, which the
// company carries from 25, owed to Cinderport's chandler and the Riders' trader. And Act V (#746), the
// last: the Hand's steel at 28, found on Hearth Isle and sold nowhere, a point past the armourer's for
// every class, each piece inside the isle's window and placed by its box. Beside them the ranged
// rungs (#1115, each area's `ranged`): at each that holds a long bow, a short bow a step behind it
// and a sling two, each a step on the last of its line, so that every class's best ranged weapon
// betters the rung before; each sold where its bow is sold and found where it is found, and off
// the gate's ladder until #1117.
import { AREAS, MAP_DEFS, MONSTERS, ITEMS } from '../../src/content/index.ts';
import type { Area } from '../../src/content/area.ts';
import { CURVE } from '../../src/content/progression.ts';
import { FORGE, SMITH_PRICES, quarterMore } from '../../src/content/areas/kilns/items.ts';
import { CURES } from '../../src/content/areas/ashfall/items.ts';
import { CLASSES, robeLike } from '../../src/game/party.ts';
import type { ClassId } from '../../src/game/party.ts';
import { hits } from '../../src/game/items.ts';
import type { ItemDef } from '../../src/game/items.ts';
import type { Items } from '../../src/game/tables.ts';
import { MARTIAL } from '../../src/content/items.ts';
import { GEAR, KIT, RUNGS_TWICE, companyAt } from '../kit/company.ts';
import { CHECKS, once } from '../kit/checks.ts';
import { gateCompany } from '../kit/company.ts';
import { giftOf, spentId } from '../../src/game/wilds.ts';
import { personGives } from '../../src/game/people.ts';
import { ok, owed } from './lib.ts';
import { ACT_II, ACT_III, ACT_IV, ACT_V, type Rung } from '../kit/rules/ladder.ts';

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

/** Who owes Kilnhaven's smith, selling the forge's step at a quarter more (#434's call 1); '' once sold. */
export const SMITH = '';

/**
 * Who sells the stone cure (#546): Cinderport's chandler (#512) and the Riders' trader at Akordu
 * (#526), the Wold having no temple nearer; each owed it while its area is planned, '' once sold.
 */
export const CURE_SOLD: readonly (readonly ['ashfall' | 'glasswold', string])[] = [['ashfall', ''], ['glasswold', '']];

/** An item's kind: a hand weapon, a bow, armour or a shield. Only the same kind is bettered. */
const kind = (d: ItemDef): string => (d.slot === 'weapon' ? (d.ranged ? 'bow' : 'hand') : d.slot);
/** How good an item is of its kind: a weapon's mean blow with its plus and its element's die (`hits`), armour's and a shield's AC. */
const worth = (d: ItemDef): number => (d.slot === 'weapon' ? hits(d) : d.ac ?? 0);
const usable = (d: ItemDef, cls: ClassId): boolean => !d.classes || d.classes.includes(cls);
/** The ladder's ids by `level`. */
const by = (level: number): string[] => GEAR.filter(([at]) => at <= level).flatMap(([, ids]) => ids);

/** The rungs on an area (its id, the level, the items) that are another's: a rung is whole on the last area on the road whose items it holds (#897). */
export const rungsAstray = (rungs: readonly (readonly [string, number, readonly string[]])[], areas: readonly Pick<Area, 'id' | 'items'>[] = AREAS): string[] =>
  rungs.filter(([id, , ids]) => areas[Math.max(...ids.map((i) => areas.findIndex((a) => a.items.some((x) => x.id === i))))]?.id !== id).map(([id, at]) => `${at} on ${id}`);

/** A ranged rung (#1115, `AreaChecks.ranged`): the area it is on, its level, and its long bow, short bow and sling. */
type Ranged = { area: string; level: number; bows: readonly string[] };
/** The areas' ranged rungs, by level. An act's pull request adds its own to its areas' checks. */
const RANGED: readonly Ranged[] = [...CHECKS].flatMap(([area, c]) => Object.entries(c.ranged ?? {}).map(([at, bows]) => ({ area, level: Number(at), bows }))).sort((a, b) => a.level - b.level);
/**
 * A ranged rung's three lines, each told by the item's `kind` and `short`, with the classes the issue
 * gives it and how many steps by `hits` it stands behind its rung's long bow, a step a point.
 */
const LINES: readonly { line: string; is: (d: ItemDef) => boolean; who: readonly string[]; behind: number }[] = [
  { line: 'long bow', is: (d) => d.kind === 'bow' && !d.short, who: MARTIAL, behind: 0 },
  { line: 'short bow', is: (d) => d.kind === 'bow' && !!d.short, who: [...MARTIAL, 'thief', 'bard'], behind: 1 },
  { line: 'sling', is: (d) => d.kind === 'light', who: Object.keys(CLASSES), behind: 2 },
];
/** The kits' ranged weapons, the plain Short Bow and Sling: what each line betters at its first rung. */
const PLAIN = [...new Set(Object.values(CLASSES).flatMap((c) => c.kit))].filter((id) => ITEMS[id]?.ranged);
/** What is wrong with the ranged rungs on `items`: an item not of its line, or not its line's classes', not its steps behind the long bow, or no step on its line's last. */
function rangedFaults(rungs: readonly Ranged[], items: Items): string[] {
  const out: string[] = [], last = LINES.map((l) => PLAIN.map((id) => items[id]).find((d) => !!d && l.is(d)));
  for (const r of rungs) {
    const long = items[r.bows[0]];
    LINES.forEach((l, k) => {
      const id = r.bows[k], d = items[id], was = last[k];
      if (!d) { out.push(`${r.level}: ${id} is no item`); return; }
      const who = Object.keys(CLASSES).filter((c) => usable(d, c as ClassId)), want = Object.keys(CLASSES).filter((c) => l.who.includes(c));
      if (!d.ranged || !l.is(d)) out.push(`${r.level}: ${id} is no ${l.line}`);
      if (who.join() !== want.join()) out.push(`${r.level}: ${id} is for ${who.join(', ') || 'nobody'}, not ${want.join(', ')}`);
      if (long && hits(long) - hits(d) !== l.behind) out.push(`${r.level}: ${id} (${hits(d)}) is not ${['level with', 'a step behind', 'two steps behind'][l.behind]} ${long.id} (${hits(long)})`);
      if (was && hits(d) < hits(was) + 1) out.push(`${r.level}: ${id} (${hits(d)}) is no step on ${was.id} (${hits(was)})`);
      last[k] = d;
    });
  }
  return out;
}
/** A class's best ranged weapon by `hits`, of the kits' and the ranged rungs' it may hold: before the first rung, then at each. */
const bestRanged = (rungs: readonly Ranged[], items: Items, cls: ClassId): (ItemDef | undefined)[] =>
  [0, ...rungs.map((r) => r.level)].map((at) => [...PLAIN, ...rungs.filter((r) => r.level <= at).flatMap((r) => r.bows)].map((id) => items[id])
    .filter((d): d is ItemDef => !!d?.ranged && usable(d, cls)).sort((a, b) => hits(b) - hits(a))[0]);
/** The rungs at which a class's best ranged weapon betters none it had before. */
const unbettered = (rungs: readonly Ranged[], items: Items, cls: ClassId): number[] => {
  const best = bestRanged(rungs, items, cls);
  return rungs.filter((_, k) => !best[k + 1] || hits(best[k + 1]!) <= (best[k] ? hits(best[k]!) : 0)).map((r) => r.level);
};
/** Where an area places an item: each shop that sells it, box that gives it and monster that drops it. */
const placesIn = (a: Area, id: string): string[] => [
  ...a.maps.flatMap((m) => (m.features ?? []).flatMap((f) => (f.kind === 'shop' ? (f.stock.includes(id) ? [`${f.name} on ${m.id}`] : []) : giftOf(f)?.items?.includes(id) ? [`${f.kind} ${spentId(f) ?? ''} on ${m.id}`] : []))),
  ...a.monsters.filter((m) => (m.drops ?? []).some((x) => x.item === id)).map((m) => `${m.id}'s drops`),
];

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

  // Acts II to V, rung by rung, as the Deepthorn's: each item is in the ladder at its rung and
  // no sooner, the class can use it, and it betters the best of its kind the class had on the rung
  // before.
  const rungs: readonly Rung<keyof typeof CURVE>[] = [...ACT_II, ...ACT_III, ...ACT_IV, ...ACT_V];
  rungs.forEach((rung, k) => {
    const before = k ? rungs[k - 1].level : 10;
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
  // A rung is held on one area (`AreaChecks.gear`), never on two (#897).
  ok(...once('every rung of the ladder is given once, on one area', RUNGS_TWICE));
  // A rung stands whole on one area, the last on the road whose items it holds (#897): 13, Saltreach's and
  // Wrackholm's, is Wrackholm's.
  const onAreas = [...CHECKS].flatMap(([id, c]) => Object.entries(c.gear ?? {}).map(([at, ids]) => [id, Number(at), ids] as const));
  const astray = rungsAstray(onAreas);
  ok(!astray.length, `and each on an area is the last area's on the road whose items it holds${astray.length ? ` (not: ${astray.join(', ')})` : ''}`);
  const r13 = GEAR.find(([at]) => at === 13)?.[1] ?? [], r3 = GEAR.find(([at]) => at === 3)?.[1] ?? [];
  ok(rungsAstray([['saltreach', 13, r13], ['wrackholm', 13, r13], ['shelf', 3, r3], ['thornmark', 3, r3]]).join() === '13 on saltreach,3 on thornmark',
    'a rung on an earlier area than its last item\'s, or a later one, is refused: 13 on Saltreach and 3 on Thornmark, where 13 on Wrackholm and 3 on the Foreland are read');
  // An artifact is past the ladder's top (#847): no rung holds one, by its mark, so the gate's company
  // and the harness's plain one wear none, and only the harness's what-if dresses one (`--artifacts`).
  const arts = Object.values(ITEMS).filter((d) => d.artifact).map((d) => d.id), onRung = GEAR.flatMap(([, ids]) => ids).filter((id) => arts.includes(id));
  ok(arts.length > 0 && !onRung.length, `no rung of the ladder holds an artifact, past its top: none of the ${arts.length}${onRung.length ? ` (but: ${onRung.join(', ')})` : ''}`);
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

  // Acts II's to V's wares are sold in their area and their finds placed there, each inside the
  // area's window; each owed to its shop or box until it is, as all is in an area not yet listed. A
  // found rung's pieces carry no plus and are finds all the same (#746): held to a find's rule, not a
  // ware's, and to one more, that no shop anywhere sells them.
  const areaOf = (id: string): Area | undefined => (AREAS as readonly Area[]).find((a) => a.id === id);
  const stocked = new Set(MAP_DEFS.flatMap((m) => (m.features ?? []).flatMap((f) => (f.kind === 'shop' ? f.stock : []))));
  for (const rung of rungs) for (const [id, [area, whose]] of Object.entries(rung.from)) {
    const d = ITEMS[id], a = areaOf(area), plus = !!rung.found || !!d?.plus;
    ok(!!d && d.price > 0 && d.price <= CURVE[area].price, `${plus ? 'find' : 'ware'} ${id} is an item within ${area}'s window (${d?.price} of ${CURVE[area].price} gold)`);
    if (rung.found) ok(!stocked.has(id), `find ${id}, of ${rung.name}, is sold nowhere`);
    // A found rung's piece may be handed over by a person's answer too, as the Old Lantern's Staff is at
    // the crack (61, #757): a find all the same. The earlier rungs' finds keep to chests and drops.
    const handed = !!rung.found && !!a && a.maps.some((m) => (m.features ?? []).some((f) => f.kind === 'npc' && personGives(f).includes(id)));
    const there = !!a && (plus
      ? a.maps.some((m) => (m.features ?? []).some((f) => giftOf(f)?.items?.includes(id))) || a.monsters.some((m) => (m.drops ?? []).some((x) => x.item === id)) || handed
      : a.maps.some((m) => (m.features ?? []).some((f) => f.kind === 'shop' && f.stock.includes(id))));
    const msg = plus ? `find ${id} lies in a chest, a cairn, a statue's gift or a hoard${rung.found ? ", or a person's answer gives it," : ''} in ${area}` : `ware ${id} is sold in ${area}`;
    if (whose) owed(there, msg, whose); else ok(there, msg);
  }

  // The stone cure is a consumable sold by the chandler and the trader, inside each one's window; and
  // the company's kit (KIT, tools/kit/company.ts) is wares sold by its level, no dearer than that window.
  for (const id of CURES) for (const [area, whose] of CURE_SOLD) {
    const d = ITEMS[id], a = areaOf(area);
    ok(!!d && d.slot === 'none' && !!d.use?.cure?.includes('stoned') && d.price > 0 && d.price <= CURVE[area].price, `ware ${id} is a cure for stone within ${area}'s window (${d?.price} of ${CURVE[area].price} gold)`);
    const sold = !!a && a.maps.some((m) => (m.features ?? []).some((f) => f.kind === 'shop' && f.stock.includes(id)));
    if (whose) owed(sold, `ware ${id} is sold in ${area}`, whose); else ok(sold, `ware ${id} is sold in ${area}`);
  }
  for (const [at, ids] of KIT) {
    const area = CURE_SOLD.map(([x]) => x).find((k) => CURVE[k].band[0] <= at && at <= CURVE[k].band[1]);
    const cost = ids.reduce((t, id) => t + (ITEMS[id]?.price ?? 0), 0);
    ok(!!area && ids.every((id) => CURES.includes(id)) && cost <= CURVE[area].price, `the company's kit from ${at}, ${ids.join(', ')}, is sold there (${area}) and costs ${cost} of its window of ${area ? CURVE[area].price : '?'} gold`);
  }

  // Kilnhaven's smith asks a quarter more for the forge's step (#434's call 1), in whole gold and
  // inside the Kilns' window as the forge's own prices are; owed to the smith till it sells them so.
  const smithFaults = FORGE.flatMap((id) => {
    const p = SMITH_PRICES[id];
    return Number.isInteger(p) && p === quarterMore(ITEMS[id].price) && p <= CURVE.kilns.price ? [] : [`${id} at ${p}`];
  });
  ok(Object.keys(SMITH_PRICES).length === FORGE.length && !smithFaults.length,
    `Kilnhaven's smith asks a quarter more for each of the forge's ${FORGE.length} wares, the dearest ${Math.max(...Object.values(SMITH_PRICES))} gold, inside the Kilns' window (${CURVE.kilns.price})${smithFaults.length ? ` (not: ${smithFaults.join(', ')})` : ''}`);
  const smithSells = !!areaOf('kilns')?.maps.some((m) => (m.features ?? []).some((f) => f.kind === 'shop' && FORGE.every((id) => f.stock.includes(id) && f.prices?.[id] === SMITH_PRICES[id])));
  if (SMITH) owed(smithSells, "Kilnhaven's smith sells the forge's step at a quarter more", SMITH); else ok(smithSells, "Kilnhaven's smith sells the forge's step at a quarter more");

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

  // The ranged rungs (#1115): at each, a long bow, a short bow a step behind it and a sling two, each a
  // step on the last of its line, for the classes its line is for; so each class's best ranged weapon
  // betters the rung before at every one.
  const faults = rangedFaults(RANGED, ITEMS), say = (d?: ItemDef): string => (d ? `${d.id} ${hits(d)}` : 'none');
  ok(RANGED.length > 0 && !faults.length, `at each ranged rung a long bow, a short bow a step behind it and a sling two, each a step on the last of its line; the long bows the martial four's, the short bows theirs, the thief's and the bard's, the slings anyone's (${RANGED.map((r) => `${r.level}: ${r.bows.map((id) => say(ITEMS[id])).join(', ')}`).join('; ')})${faults.length ? ` (but ${faults.join('; ')})` : ''}`);
  for (const cls of Object.keys(CLASSES) as ClassId[]) {
    const best = bestRanged(RANGED, ITEMS, cls), not = unbettered(RANGED, ITEMS, cls);
    ok(!not.length, `the ${CLASSES[cls].name}'s best ranged weapon betters the rung before at each ranged rung: ${best.map(say).join(', ')}${not.length ? ` (not at ${not.join(', ')})` : ''}`);
  }
  // And the rule refuses what it should: a short bow no step on the last (the Thornmark Short Bow on a
  // d6), and one a bard may not hold; the thief, then the bard, then betters nothing at 8.
  const flat = { ...ITEMS, thornmark_shortbow: { ...ITEMS.thornmark_shortbow, sides: 6 } }, barred = { ...ITEMS, thornmark_shortbow: { ...ITEMS.thornmark_shortbow, classes: [...MARTIAL, 'thief'] } };
  const flatFault = rangedFaults(RANGED, flat).find((f) => f.includes('no step on yew_shortbow+1')), barredFault = rangedFaults(RANGED, barred).find((f) => f.includes('thornmark_shortbow is for'));
  ok(!!flatFault && !!barredFault && unbettered(RANGED, flat, 'thief').includes(8) && unbettered(RANGED, barred, 'bard').includes(8),
    `a ranged rung's short bow no step on the last, or one its bard may not hold, is refused, and the thief or the bard betters nothing at 8 (${flatFault}; ${barredFault})`);
  // Each short bow and sling is sold where its rung's long bow is sold and found where it is found, a
  // shop's, a box's or a drop's of the rung's area, cheaper than the one before it in the rung and
  // inside the area's window; the long bow is on its area's rung, and the two are off the gate's
  // ladder until #1117 takes them into `gear`.
  const onLadder = new Set(GEAR.flatMap(([, ids]) => ids));
  const placed = RANGED.flatMap((r) => {
    const a = areaOf(r.area), [long] = r.bows, where = a ? placesIn(a, long) : [];
    const out = CHECKS.get(r.area)?.gear?.[r.level]?.includes(long) ? [] : [`${long} is not on ${r.area}'s rung at ${r.level}`];
    r.bows.slice(1).forEach((id, k) => {
      const d = ITEMS[id], before = ITEMS[r.bows[k]], got = a ? placesIn(a, id) : [], missing = where.filter((p) => !got.includes(p));
      if (!got.length || missing.length) out.push(`${id} is not where ${long} is (${missing.join(', ') || 'anywhere'})`);
      if (!d || !before || d.price >= before.price || d.price > CURVE[r.area as keyof typeof CURVE].price) out.push(`${id} (${d?.price} gold) is not cheaper than ${before?.id} (${before?.price}) inside ${r.area}'s window`);
      if (onLadder.has(id)) out.push(`${id} is on the gate's ladder`);
    });
    return out;
  });
  ok(RANGED.length > 0 && !placed.length, `each ranged rung's short bow and sling is sold where its long bow is sold and found where it is found, cheaper and inside its area's window, and off the gate's ladder till #1117 (${RANGED.map((r) => `${r.level}: ${[...new Set(placesIn(areaOf(r.area)!, r.bows[0]))].join(', ')}`).join('; ')})${placed.length ? ` (but ${placed.join('; ')})` : ''}`);

  // The gate check's company wears what harness's does, level by level.
  const worn = (p: ReturnType<typeof companyAt>): string => JSON.stringify(p.members.map((m) => m.equipment));
  const differ = Array.from({ length: 10 }, (_, k) => k + 1).filter((l) => worn(gateCompany(l, 11)) !== worn(companyAt(l, 11)));
  ok(!differ.length, `the gate check's company is dressed as harness's at 1 to 10${differ.length ? ` (not at ${differ.join(', ')})` : ''}`);
}
