// A shop's own prices: a shop may price an item it stocks, and charges that; anything it does not
// price sells at its own; and selling back is half the item's own price whatever the shop, or two
// thirds to a company with a Merchant standing (#857), which no price of a shop's may be under.
import { MAP_DEFS, ITEMS, TABLES } from '../../src/content/index.ts';
import type { Feature } from '../../src/game/map.ts';
import { priceIn, buy, sellPrice } from '../../src/game/items.ts';
import { defaultParty } from '../../src/game/party.ts';
import type { Party } from '../../src/game/party.ts';
import type { ItemDef } from '../../src/game/items.ts';
import { skilled } from '../../src/game/skills.ts';
import { businessEntries } from '../../src/ui/screens.ts';
import { makeRng } from '../../src/lib/engine/rng.ts';
import { ok, withDefs } from './lib.ts';
import { headlessGame, drive } from '../kit/headless.ts';
import { tablesWith } from '../kit/headless.ts';
import type { Items } from '../../src/game/tables.ts';

type Shop = Extract<Feature, { kind: 'shop' }>;
/** A company of the road's, with a Merchant standing if asked: Cassian, the sixth, learnt it. */
const road = (merchant: boolean): Party => { const p = defaultParty(TABLES, makeRng(1)); if (merchant) p.members[5].skills = ['merchant']; return p; };
/** Selling back, as the sell screen pays it (`sellPrice`), to a company with a Merchant standing: the most a shop pays. */
const company = road(true);
const sellBack = (id: string): number => sellPrice(TABLES.items, company, ITEMS[id].price);

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
  ok(priceIn(TABLES.items, farm, 'rations') === 3 && priceIn(TABLES.items, farm, 'torch') === ITEMS.torch.price, `the farm store asks 3 for rations and ${ITEMS.torch.price} for a torch`);
  const party = defaultParty(TABLES, makeRng(1)), gold = party.gold, food = party.food;
  const d = buy(TABLES.items, party, farm, 'rations');
  ok(d?.id === 'rations' && party.gold === gold - 3 && party.food === food + ITEMS.rations.use!.food!, `buying rations there charges 3 (${gold} -> ${party.gold} gold, ${food} -> ${party.food} food)`);
  const bag = party.bag.length; buy(TABLES.items, party, farm, 'torch');
  ok(party.gold === gold - 3 - ITEMS.torch.price && party.bag.length === bag + 1 && party.bag.at(-1) === 'torch', 'a torch there costs its own price, into the bag');
  party.gold = 2;
  ok(buy(TABLES.items, party, farm, 'rations') === null && party.gold === 2 && party.bag.length === bag + 1, 'short of gold, nothing is bought');

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
  // A price over half the item's own and under two thirds of it: a Merchant would buy it and sell it back dearer.
  const own = ITEMS.longsword.price, half = Math.floor(own / 2), merchant = Math.floor((own * 2) / 3);
  const shopWith = (stock: string[], prices: Record<string, number>): Shop => ({ kind: 'shop', x: 0, y: 0, name: 'Smithy', stock, prices, interior: 'harrow_provisioner' });
  const between = fault(shopWith(['longsword'], { longsword: half + 1 }));
  ok(half + 1 < merchant && between === `'longsword' at ${half + 1} is under its sell-back of ${merchant}`, `a price over half a sword's ${own} and under two thirds of it is caught, as a Merchant's buy and sell back (${between || 'nothing'})`);

  // A Merchant standing is paid two thirds of an item's price, rounded down; nobody with it, or the
  // Merchant down or dead, half; and the sell screen pays just that (#857).
  const fallen = road(true); fallen.members[5].conditions.push('unconscious');
  const pays = (p: Party, items: Items = TABLES.items): string => [40, 25, 3, 1, 0].map((n) => sellPrice(items, p, n)).join(' ');
  ok(pays(road(true)) === '26 16 2 0 0' && pays(road(false)) === '20 12 1 0 0' && pays(fallen) === '20 12 1 0 0',
    `a shop pays a Merchant standing two thirds, rounded down, and anyone else half, for 40, 25, 3, 1 and 0 (Merchant ${pays(road(true))}; none ${pays(road(false))}; the Merchant down ${pays(fallen)})`);
  // A set of scales carried, a fixture item that does a Merchant's work (`ItemDef.skill`), is paid as a
  // Merchant is: sellPrice asks `skilled`, as the world does.
  const scales: ItemDef = { id: 'fx_scales', name: 'Scales', slot: 'none', price: 100, skill: 'merchant' };
  {
    const lent = tablesWith([scales]);
    const carried = road(false);
    carried.members[2].pack.push(scales.id);
    const held = [road(true), road(false), fallen, carried].every((p) => (sellPrice(lent.items, p, 30) === 20) === !!skilled(lent.items, p, 'merchant'));
    ok(pays(carried, lent.items) === '26 16 2 0 0' && skilled(lent.items, carried, 'merchant')?.name === 'Wren' && held,
      `a set of scales carried is paid two thirds, as a Merchant is (${pays(carried, lent.items)}), and sellPrice reads the Merchant as skilled() does, standing, down or carried`);
  }
  const g = headlessGame(4), harrow = MAP_DEFS.find((m) => m.id === 'harrow')!.features!.find((f): f is Shop => f.kind === 'shop')!;
  const sold = (merchantToo: boolean): number => {
    while (g.screens.length > 1) g.pop();
    if (merchantToo) g.party.members[5].skills = ['merchant']; else delete g.party.members[5].skills;
    g.party.bag = ['longsword'];
    g.push(businessEntries(g, harrow)[0].open());
    drive(g, ['down', 'interact']);
    const gold = g.party.gold;
    drive(g, ['interact']);
    return g.party.gold - gold;
  };
  const byMerchant = sold(true), byNone = sold(false);
  ok(byMerchant === merchant && byNone === half && !g.party.bag.includes('longsword'), `${harrow.name} pays a Merchant ${byMerchant} for a sword of ${own}, and a company without one ${byNone}`);

  // Every built shop: its prices sound, and each item it does not price at the item's own.
  let n = 0;
  for (const def of MAP_DEFS) for (const f of def.features ?? []) {
    if (f.kind !== 'shop') continue; n++;
    const bad = faults(f);
    ok(!bad.length, `${def.id}, ${f.name}: its prices are sound${bad.length ? ' -> ' + bad.join('; ') : ''}`);
    const off = f.stock.filter((id) => !(id in (f.prices ?? {})) && priceIn(TABLES.items, f, id) !== ITEMS[id].price);
    ok(!off.length, `${def.id}, ${f.name}: it charges each item it does not price as today${off.length ? ' -> ' + off.join(', ') : ''}`);
  }
  ok(n >= 2, `${n} built shops`);
  const mottram = MAP_DEFS.find((m) => m.id === 'harrow')?.features?.find((f): f is Shop => f.kind === 'shop');
  ok(!!mottram && priceIn(TABLES.items, mottram, 'rations') === ITEMS.rations.price && ITEMS.rations.price === 4, "Mottram's still asks 4 for rations");
}
