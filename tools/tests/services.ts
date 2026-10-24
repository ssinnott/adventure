// The town's services (#971): each rule of src/game/services.ts on a fixture, as the screens serve it.
// What it charges and what it changes; short of gold, nothing changed and the screen's own line; the
// trainer's cap, one level a visit however much xp, and never past the trainer; the artifact a shop
// will not buy. The checks that drive the menus themselves stay in shops, items and the pilot.
import { ITEMS } from '../../src/content/index.ts';
import type { Feature } from '../../src/game/map.ts';
import type { ItemDef } from '../../src/game/items.ts';
import { REFUSED } from '../../src/game/items.ts';
import { defaultParty, addCondition, xpForLevel, trainPrice, levelUp, CLASSES } from '../../src/game/party.ts';
import type { Party } from '../../src/game/party.ts';
import { spell, spellsFor } from '../../src/game/spells.ts';
import { makeRng } from '../../src/lib/engine/rng.ts';
import { nightCost, stay, buyRations, RATIONS, RATIONS_PRICE, cure, donate, DONATION, sell, spellPrice, joined, payFee, hallOffers, learnSpell, mayTrain, train } from '../../src/game/services.ts';
import { ok } from './lib.ts';

type Inn = Extract<Feature, { kind: 'inn' }>;
type Hall = Extract<Feature, { kind: 'guild' }>;

/** The road's six (Bram, Idris, Wren, Ottilie, Maren and Cassian), with this much gold. */
const company = (gold: number): Party => { const p = defaultParty(makeRng(1)); p.gold = gold; return p; };
/** A refusal changes nothing: the company as its JSON was before. */
const unchanged = (p: Party, before: string): boolean => JSON.stringify(p) === before;

export function services(): void {
  // The inn: a night at its price a member, every member rested, the world slept to morning and the
  // next of its nights counted; short of the price, nothing.
  const inn: Inn = { kind: 'inn', x: 0, y: 0, name: 'The Fixture', price: 7, interior: 'rime_inn', nights: ['fx_night_1', 'fx_night_2'] };
  let slept = 0;
  const world = { sleepUntilMorning: (): void => { slept++; } };
  const guests = company(200);
  for (const m of guests.members) { m.hp = 1; m.sp = 0; }
  const night = stay(guests, world, inn);
  ok(nightCost(inn, guests) === 42 && night.done && night.paid === 42 && guests.gold === 158 && guests.members.every((m) => m.hp === m.maxHp && m.sp === m.maxSp)
    && slept === 1 && night.set === 'fx_night_1' && guests.flags.fx_night_1 === 1 && night.line === 'You sleep well. Morning.',
    `a night at 7 a member costs the six ${night.paid} gold (200 -> ${guests.gold}), rests them, sleeps to morning and counts ${night.set}: "${night.line}"`);
  const second = stay(guests, world, inn), third = stay(guests, world, inn);
  ok(second.set === 'fx_night_2' && third.done && third.set === undefined && guests.gold === 74 && slept === 3,
    `the next night counts ${second.set}, and one past the inn's nights counts none (${guests.gold} gold left)`);
  const poor = company(41), was = JSON.stringify(poor), refused = stay(poor, world, inn);
  ok(!refused.done && refused.paid === 0 && unchanged(poor, was) && slept === 3 && refused.line === 'You cannot afford a room.',
    `with 41 gold of the 42, nothing changes and nobody sleeps: "${refused.line}"`);

  // Ten rations for 20 gold.
  const fed = company(RATIONS_PRICE), packed = buyRations(fed);
  ok(RATIONS_PRICE === 20 && RATIONS === 10 && packed.done && packed.paid === 20 && fed.gold === 0 && fed.food === 40 && packed.line === 'The kitchen packs you ten days of rations.',
    `${RATIONS} rations for ${RATIONS_PRICE} gold: food 30 -> ${fed.food}, "${packed.line}"`);
  const hungry = company(19), wasHungry = JSON.stringify(hungry), none = buyRations(hungry);
  ok(!none.done && unchanged(hungry, wasHungry) && none.line === 'Not enough gold.', `with 19 gold, no rations: "${none.line}"`);

  // The temple: the dead raised at 100 a level and on 1 hit point, any other condition lifted for 25, the
  // well turned away; short of the price, nothing.
  const flock = company(500), [bram, idris, wren] = flock.members;
  addCondition(bram, 'dead'); bram.hp = -10; addCondition(idris, 'poisoned');
  const raised = cure(flock, bram), mended = cure(flock, idris), well = cure(flock, wren);
  ok(raised.paid === 100 && !bram.conditions.length && bram.hp === 1 && raised.line === 'Bram is restored.' && mended.paid === 25 && !idris.conditions.length
    && flock.gold === 375 && !well.done && well.paid === 0 && well.line === 'Wren is well.',
    `the dead raised for ${raised.paid} on 1 hit point, the poisoned for ${mended.paid} (500 -> ${flock.gold} gold), and "${well.line}"`);
  const pauper = company(99);
  addCondition(pauper.members[0], 'dead'); pauper.members[0].hp = -10;
  const wasPauper = JSON.stringify(pauper), unpaid = cure(pauper, pauper.members[0]);
  ok(!unpaid.done && unchanged(pauper, wasPauper) && unpaid.line === 'You cannot afford it.', `the dead at 100 with 99 gold stay dead: "${unpaid.line}"`);

  // A donation: 10 gold, counted; short of it the chapel says nothing.
  const giver = company(DONATION), gave = donate(giver), wasGiver = JSON.stringify(giver), more = donate(giver);
  ok(DONATION === 10 && gave.done && gave.paid === 10 && giver.gold === 0 && giver.flags.donations === 1 && gave.line === 'The Lanterns thank you.' && !more.done && more.line === '' && unchanged(giver, wasGiver),
    `a donation of ${DONATION} gold is counted (${giver.flags.donations}); with nothing left, nothing changes and nothing is said`);

  // Selling back: half the item's price, out of its owner's list; an artifact refused and a thing worth
  // nothing not bought, both kept. The table is handed in.
  const relic: ItemDef = { id: 'fx_relic', name: 'Relic', slot: 'none', price: 900, artifact: true };
  const pebble: ItemDef = { id: 'fx_pebble', name: 'Pebble', slot: 'none', price: 1 };
  const table = { longsword: ITEMS.longsword, fx_relic: relic, fx_pebble: pebble };
  const seller = company(0);
  seller.bag = ['longsword', 'fx_relic', 'fx_pebble'];
  const sold = sell(seller, seller.bag, 'longsword', table);
  ok(sold.done && sold.paid === Math.floor(ITEMS.longsword.price / 2) && seller.gold === sold.paid && seller.bag.join() === 'fx_relic,fx_pebble' && sold.line === `Sold ${ITEMS.longsword.name} for ${sold.paid} gold.`,
    `a sword of ${ITEMS.longsword.price} sells for ${sold.paid}, out of the bag: "${sold.line}"`);
  const wasSeller = JSON.stringify(seller), art = sell(seller, seller.bag, 'fx_relic', table), stone = sell(seller, seller.bag, 'fx_pebble', table);
  ok(!art.done && art.line === REFUSED && !stone.done && stone.line === '"I will not buy that."' && unchanged(seller, wasSeller),
    `an artifact of 900 is refused (${art.line}) and a pebble of 1, worth nothing back, is not bought (${stone.line}); the bag keeps both`);

  // A spell hall: the fee once, kept as its flag; its classes' spells to its tier that each lacks, at
  // 40 doubling a tier; a purchase takes the gold and gives the spell.
  const hall: Hall = { kind: 'guild', x: 0, y: 0, name: 'Fixture Hall', classes: ['cleric', 'sorcerer'], fee: 50, maxTier: 3, interior: 'lantern_guildhall' };
  const students = company(49), wasStudents = JSON.stringify(students), short = payFee(students, hall);
  ok(!short.done && unchanged(students, wasStudents) && !joined(students, hall) && short.line === 'Not enough gold.', `with 49 gold of the fee of 50, no study: "${short.line}"`);
  students.gold = 1000;
  const fee = payFee(students, hall);
  ok(fee.done && fee.paid === 50 && students.gold === 950 && joined(students, hall) && fee.line === 'You may study here.', `the fee of 50 paid once and kept (1000 -> ${students.gold}): "${fee.line}"`);
  const offers = hallOffers(students, hall), lacking = (who: number, tier: number): string[] => spellsFor(CLASSES[students.members[who].cls].spells!, tier).filter((sp) => !students.members[who].spells.includes(sp.id)).map((sp) => sp.id);
  ok([1, 2, 3, 4].map(spellPrice).join() === '40,80,160,320' && offers.length > 0 && offers.every((o) => o.price === spellPrice(spell(o.id).level))
    && offers.map((o) => o.id).join() === [...lacking(4, 3), ...lacking(5, 3)].join() && offers.every((o) => o.who === 4 || o.who === 5)
    && hallOffers(students, { ...hall, maxTier: undefined }).every((o) => spell(o.id).level <= 2),
    `a spell costs 40, 80, 160 and 320 by its tier; the hall offers its two classes, Maren and Cassian, the ${offers.length} spells to the third tier they lack, and to the second where it names no tier`);
  const o = offers.at(-1)!, buyer = students.members[o.who], before = students.gold, learnt = learnSpell(students, o);
  ok(learnt.done && learnt.paid === o.price && students.gold === before - o.price && buyer.spells.includes(o.id) && !hallOffers(students, hall).some((x) => x.who === o.who && x.id === o.id)
    && learnt.line === `${buyer.name} learns ${spell(o.id).name}.`, `${buyer.name} learns ${spell(o.id).name} for ${o.price}, and it is offered no more: "${learnt.line}"`);
  students.gold = offers[0].price - 1;
  const wasBuying = JSON.stringify(students), dear = learnSpell(students, offers[0]);
  ok(!dear.done && unchanged(students, wasBuying) && dear.line === 'Not enough gold.', `a spell of ${offers[0].price} with ${students.gold} gold is not learnt: "${dear.line}"`);

  // A trainer: one level a visit for its price, however much xp, never past its own level, the hit
  // points those of one level on the same seed; one not ready, past it or down is refused unsaid.
  const yard = company(1000), [ready, , , , , down] = yard.members;
  ready.xp = xpForLevel(4);
  const visits = [train(yard, ready, makeRng(1), 3), train(yard, ready, makeRng(1), 3), train(yard, ready, makeRng(1), 3)];
  const one = defaultParty(makeRng(1)).members[0];
  one.xp = xpForLevel(2); levelUp(one, makeRng(1));
  ok(visits[0].done && visits[0].paid === trainPrice({ level: 1 }) && visits[0].line === `Bram trains to level 2. HP ${one.maxHp}, SP ${one.maxSp}.` && visits[1].done && ready.level === 3
    && !visits[2].done && visits[2].line === '' && ready.xp === xpForLevel(4) && yard.gold === 1000 - trainPrice({ level: 1 }) - trainPrice({ level: 2 }),
    `the cap: a member of 1 with the xp for 4 trains one level a visit, to 2 for ${visits[0].paid} and to 3 for ${visits[1].paid}, and a trainer to 3 takes him no further: "${visits[0].line}"`);
  down.xp = xpForLevel(2); addCondition(down, 'unconscious');
  const wasYard = JSON.stringify(yard), fallen = train(yard, down, makeRng(1), 10);
  ok(!mayTrain(down, 10) && !fallen.done && fallen.line === '' && unchanged(yard, wasYard), `${down.name}, ready but down, is not trained and nothing is said, as the screen bars the row`);
  const purse = { gold: 24 }, cheap = structuredClone(yard.members[1]);
  cheap.xp = xpForLevel(2);
  const wasCheap = JSON.stringify(cheap), dearer = train(purse, cheap, makeRng(1), 10);
  ok(!dearer.done && purse.gold === 24 && JSON.stringify(cheap) === wasCheap && dearer.line === 'Not enough gold.', `a member of 1 at 25 with 24 gold is not trained: "${dearer.line}"`);
}
