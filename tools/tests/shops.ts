// A shop's own prices: a shop may price an item it stocks, and charges that; anything it does not
// price sells at its own, and selling back stays half the item's own price whatever the shop.
import { MAP_DEFS, ITEMS } from '../../src/content/index.ts';
import type { Feature } from '../../src/game/map.ts';
import { priceIn, buy } from '../../src/game/items.ts';
import { defaultParty } from '../../src/game/party.ts';
import { makeRng } from '../../src/lib/engine/rng.ts';
import { ok } from './lib.ts';

type Shop = Extract<Feature, { kind: 'shop' }>;
/** Selling back, as the sell screen pays it (src/ui/screens.ts). */
const sellBack = (id: string): number => Math.floor(ITEMS[id].price / 2);

/** What is wrong with a shop's prices: one it does not stock, one not a whole number of gold, one under the sell-back. */
function faults(shop: Shop): string[] {
  const out: string[] = [];
  for (const [id, p] of Object.entries(shop.prices ?? {})) {
    if (!shop.stock.includes(id)) out.push(`'${id}' is not stocked`);
    else if (!Number.isInteger(p) || p < 1) out.push(`'${id}' at ${p} is not a whole number of gold`);
    else if (p < sellBack(id)) out.push(`'${id}' at ${p} is under its sell-back of ${sellBack(id)}`);
  }
  return out;
}
/** The one fault a shop's prices raise, or what they raise instead. */
const fault = (shop: Shop): string => faults(shop).join('; ');

export function shops(): void {
  const fixture = (prices: Record<string, number>): Shop =>
    ({ kind: 'shop', x: 0, y: 0, name: 'Farm Store', stock: ['rations', 'torch'], prices, interior: 'harrow_provisioner' });

  // A shop with a price of its own shows and charges it; what it does not price is the item's own.
  const farm = fixture({ rations: 3 });
  ok(priceIn(farm, 'rations') === 3 && priceIn(farm, 'torch') === ITEMS.torch.price, `the farm store asks 3 for rations and ${ITEMS.torch.price} for a torch`);
  const party = defaultParty(makeRng(1)), gold = party.gold, food = party.food;
  const d = buy(party, farm, 'rations');
  ok(d?.id === 'rations' && party.gold === gold - 3 && party.food === food + ITEMS.rations.use!.food!, `buying rations there charges 3 (${gold} -> ${party.gold} gold, ${food} -> ${party.food} food)`);
  const bag = party.bag.length; buy(party, farm, 'torch');
  ok(party.gold === gold - 3 - ITEMS.torch.price && party.bag.length === bag + 1 && party.bag.at(-1) === 'torch', 'a torch there costs its own price, into the bag');
  party.gold = 2;
  ok(buy(party, farm, 'rations') === null && party.gold === 2 && party.bag.length === bag + 1, 'short of gold, nothing is bought');

  // The checks, each caught on a fixture.
  ok(faults(farm).length === 0, 'the farm store\'s prices are sound');
  const caught = (prices: Record<string, number>, want: string, what: string): void => {
    const got = fault(fixture(prices));
    ok(got === want, `${what} is caught (${got || 'nothing'})`);
  };
  caught({ lantern: 5 }, "'lantern' is not stocked", 'a price for an item not stocked');
  caught({ rations: 0 }, "'rations' at 0 is not a whole number of gold", 'a price of 0');
  caught({ torch: 1.5 }, "'torch' at 1.5 is not a whole number of gold", 'a price of 1.5 gold, over the sell-back');
  caught({ rations: 1 }, "'rations' at 1 is under its sell-back of 2", 'a price under the sell-back');

  // Every built shop: its prices sound, and each item it does not price at the item's own.
  let n = 0;
  for (const def of MAP_DEFS) for (const f of def.features ?? []) {
    if (f.kind !== 'shop') continue; n++;
    const bad = faults(f);
    ok(!bad.length, `${def.id}, ${f.name}: its prices are sound${bad.length ? ' -> ' + bad.join('; ') : ''}`);
    const off = f.stock.filter((id) => !(id in (f.prices ?? {})) && priceIn(f, id) !== ITEMS[id].price);
    ok(!off.length, `${def.id}, ${f.name}: it charges each item it does not price as today${off.length ? ' -> ' + off.join(', ') : ''}`);
  }
  ok(n >= 2, `${n} built shops`);
  const mottram = MAP_DEFS.find((m) => m.id === 'harrow')?.features?.find((f): f is Shop => f.kind === 'shop');
  ok(!!mottram && priceIn(mottram, 'rations') === ITEMS.rations.price && ITEMS.rations.price === 4, "Mottram's still asks 4 for rations");
}
