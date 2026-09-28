// The gear ladder (#99, EXPANSION §5.2): every class betters its kit by level 3 and again by level 5,
// from what Mottram's sells and what the Downs hold; each find is an item within the Foreland's
// window, owed to the box that places it until a chest, cairn, statue or drop gives it; Mottram's
// sells the ladder's plain step; and the gate check's company wears what harness's does.
import { MAP_DEFS, MONSTERS, ITEMS } from '../../src/content/index.ts';
import { CURVE } from '../../src/content/progression.ts';
import { CLASSES } from '../../src/game/party.ts';
import type { ClassId } from '../../src/game/party.ts';
import type { ItemDef } from '../../src/game/items.ts';
import { GEAR, companyAt } from '../harness.ts';
import { gateCompany } from '../gate.ts';
import { giftOf } from '../../src/game/wilds.ts';
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

/** The Downs' finds and the box that places each: F2 and F3 (#47), E3 (#67), E2 (#68), D2 (#69), the Berth (#70), D3 (#71), D4 (#72). */
export const FINDS: Record<string, string> = {
  'shortsword+1': '#47', 'dagger+1': '#47', 'mace+1': '#47', 'staff+1': '#47',
  'buckler+1': '#67',
  'robe+1': '#68', 'leather+1': '#68', silver_locket: '#68',
  'halberd+1': '#69', ring_of_office: '#69', 'spear+1': '#69',
  captains_sword: '#70', captains_mail: '#70', queens_sword: '#70',
  'longbow+1': '#71',
  'shield+1': '#72',
};

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
    owed(found.has(id), `find ${id} lies in a chest, a cairn, a statue's gift or a hoard`, whose);
  }

  // Mottram's sells the ladder's plain step: the band's gear.
  const shop = MAP_DEFS.find((d) => d.id === 'harrow')?.features?.find((f) => f.kind === 'shop');
  const plain = GEAR.find(([at]) => at === 3)![1].filter((id) => !ITEMS[id].plus);
  const unsold = plain.filter((id) => !(shop?.kind === 'shop' && shop.stock.includes(id)));
  ok(!!shop && plain.length > 0 && !unsold.length, `${shop?.name} sells the band's gear, ${plain.join(', ')}${unsold.length ? ` (not: ${unsold.join(', ')})` : ''}`);

  // The gate check's company wears what harness's does, level by level.
  const worn = (p: ReturnType<typeof companyAt>): string => JSON.stringify(p.members.map((m) => m.equipment));
  const differ = Array.from({ length: 10 }, (_, k) => k + 1).filter((l) => worn(gateCompany(l, 11)) !== worn(companyAt(l, 11)));
  ok(!differ.length, `the gate check's company is dressed as harness's at 1 to 10${differ.length ? ` (not at ${differ.join(', ')})` : ''}`);
}
