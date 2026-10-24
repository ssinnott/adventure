// The town's services (#971, part of #848): an inn's night and its rations, a temple's cure and the
// donation, selling back, a spell hall's fee, its offers and a purchase, and a trainer's visit. Each is
// a function of what it changes, with the sums, the order of the effects and the words the screens had;
// each returns whether it was done, the gold that changed hands and the line the screen says, as `learn`
// (game/skills.ts) returns its line. The screens (ui/screens.ts) draw the menus and say the line, and
// the walkthroughs call the same rules instead of writing them out again. Each changes only what it is
// handed, so a test serves as the game does, without a Game; it still reads the item and spell tables
// through `sellPrice`, `spell`, `spellsFor` and `levelUp` until #973 and #974 pass them in.
import type { Feature } from './map.ts';
import type { World } from './world.ts';
import type { Character, Party } from './party.ts';
import type { ItemDef } from './items.ts';
import type { RngInstance } from '../lib/engine/rng.ts';
import { CLASSES, canTrainAt, isDown, levelUp, rest, stayNight, templePrice, trainPrice, xpForLevel } from './party.ts';
import { REFUSED, sellPrice } from './items.ts';
import { spell, spellsFor } from './spells.ts';
import { guildFlag } from './keys.ts';

type Inn = Extract<Feature, { kind: 'inn' }>;
type Hall = Extract<Feature, { kind: 'guild' }>;

/** What a service did: whether it was done, the gold that changed hands and what the screen says (empty where it says nothing). */
export interface Served { done: boolean; paid: number; line: string }

const SHORT = 'Not enough gold.';
/** A service refused: nothing changes, and this is said. */
const refused = (line: string): Served => ({ done: false, paid: 0, line });

// ---- the inn ----

/** What ten rations cost at an inn. */
export const RATIONS_PRICE = 20;
/** The rations an inn's kitchen packs for them: ten days' food. */
export const RATIONS = 10;

/** A night at an inn for the company: the inn's price a member. */
export const nightCost = (inn: Inn, party: Pick<Party, 'members'>): number => inn.price * party.members.length;

/**
 * A night at the inn: the company pays `nightCost`, every member rests, the world sleeps to morning and
 * an inn that counts its nights counts this one (`stayNight`; `set` is the flag it sets). Short of gold,
 * nothing changes.
 */
export function stay(party: Party, world: Pick<World, 'sleepUntilMorning'>, inn: Inn): Served & { set?: string } {
  const cost = nightCost(inn, party);
  if (party.gold < cost) return refused('You cannot afford a room.');
  party.gold -= cost;
  for (const m of party.members) rest(m);
  // Sleep until 07:00, or first light in the depth of winter: a night, which an inn may count.
  world.sleepUntilMorning();
  const set = stayNight(party, inn.nights);
  return { done: true, paid: cost, line: 'You sleep well. Morning.', set };
}

/** Ten rations from the inn's kitchen, `RATIONS` food for `RATIONS_PRICE`. */
export function buyRations(party: Pick<Party, 'gold' | 'food'>): Served {
  if (party.gold < RATIONS_PRICE) return refused(SHORT);
  party.gold -= RATIONS_PRICE; party.food += RATIONS;
  return { done: true, paid: RATIONS_PRICE, line: 'The kitchen packs you ten days of rations.' };
}

// ---- the temple ----

/** What a donation to the Lanterns is; each is counted (`flags.donations`). */
export const DONATION = 10;

/** A member restored at a temple for `templePrice` (game/party.ts): every condition lifted, a fallen one on 1 hit point. */
export function cure(party: Pick<Party, 'gold'>, c: Character): Served {
  const p = templePrice(c);
  if (!p) return refused(`${c.name} is well.`);
  if (party.gold < p) return refused('You cannot afford it.');
  party.gold -= p;
  c.conditions = [];
  if (c.hp <= 0) c.hp = 1;
  return { done: true, paid: p, line: `${c.name} is restored.` };
}

/** A donation of `DONATION`, counted; short of it, the chapel says nothing. */
export function donate(party: Pick<Party, 'gold' | 'flags'>): Served {
  if (party.gold < DONATION) return refused('');
  party.gold -= DONATION;
  party.flags.donations = (party.flags.donations ?? 0) + 1;
  return { done: true, paid: DONATION, line: 'The Lanterns thank you.' };
}

// ---- selling back ----

/**
 * An item sold to a shop out of its owner's list (the bag or a member's pack), for `sellPrice`
 * (game/items.ts): an artifact is refused (`REFUSED`) and a thing worth nothing is not bought. `items`,
 * first as #973 passes every table, is the table the item is read from.
 */
export function sell(items: Readonly<Record<string, ItemDef>>, party: Party, owner: string[], id: string): Served {
  const d = items[id], paid = sellPrice(items, party, d.price);
  if (d.artifact) return refused(REFUSED);
  if (paid === 0) return refused('"I will not buy that."');
  owner.splice(owner.indexOf(id), 1);
  party.gold += paid;
  return { done: true, paid, line: `Sold ${d.name} for ${paid} gold.` };
}

// ---- a spell hall ----

/** What a hall charges for a spell of the given tier: 40, 80, 160, 320. */
export function spellPrice(tier: number): number { return 40 * Math.pow(2, tier - 1); }

/** Whether the company has paid the hall's fee, kept as its flag (`guildFlag`). */
export const joined = (party: Pick<Party, 'flags'>, hall: Hall): boolean => !!party.flags[guildFlag(hall.name)];

/** The hall's fee, paid once and kept as its flag. */
export function payFee(party: Pick<Party, 'gold' | 'flags'>, hall: Hall): Served {
  if (party.gold < hall.fee) return refused(SHORT);
  party.gold -= hall.fee; party.flags[guildFlag(hall.name)] = 1;
  return { done: true, paid: hall.fee, line: 'You may study here.' };
}

/** A spell a hall offers: to whom (their place in the company), which and for how much. */
export interface Offer { who: number; id: string; price: number }

/** What a hall offers, member by member: each of its classes' spells to its tier (the second unless it says) that the member lacks, at `spellPrice`. */
export function hallOffers(party: Pick<Party, 'members'>, hall: Hall): Offer[] {
  const offers: Offer[] = [];
  party.members.forEach((m, i) => {
    const list = CLASSES[m.cls].spells;
    if (!hall.classes.includes(m.cls) || !list) return;
    for (const sp of spellsFor(list, hall.maxTier ?? 2)) if (!m.spells.includes(sp.id)) offers.push({ who: i, id: sp.id, price: spellPrice(sp.level) });
  });
  return offers;
}

/** An offer bought: the gold taken and the spell given. */
export function learnSpell(party: Pick<Party, 'gold' | 'members'>, o: Offer): Served {
  if (party.gold < o.price) return refused(SHORT);
  const c = party.members[o.who];
  party.gold -= o.price; c.spells.push(o.id);
  return { done: true, paid: o.price, line: `${c.name} learns ${spell(o.id).name}.` };
}

// ---- a trainer ----

/** Whether a trainer to `maxLevel` takes a member: ready by their xp, under its level and standing. */
export const mayTrain = (c: Character, maxLevel: number): boolean => canTrainAt(c, maxLevel) && !isDown(c);

/**
 * A visit to a trainer: one level for `trainPrice` (game/party.ts), however much xp the member has,
 * its hit points drawn on `rng`. One the trainer does not take (`mayTrain`) is refused with nothing
 * said, as the screen bars the row.
 */
export function train(party: Pick<Party, 'gold'>, c: Character, rng: RngInstance, maxLevel: number): Served {
  if (!mayTrain(c, maxLevel)) return refused('');
  const price = trainPrice(c);
  if (party.gold < price) return refused(SHORT);
  party.gold -= price;
  const before = c.level, xp = c.xp;
  // levelUp grants every level the xp allows; the trainer charges for one, so cap it.
  c.xp = Math.min(c.xp, xpForLevel(c.level + 2) - 1); levelUp(c, rng); c.xp = xp;
  return { done: true, paid: price, line: `${c.name} trains to level ${c.level}.` + (c.level === before ? '' : ` HP ${c.maxHp}, SP ${c.maxSp}.`) };
}
