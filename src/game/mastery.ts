// The weapon and magic tiers (DESIGN §5, #852): a member's Expert and Master on two lines, at arms
// (whatever weapon is in hand) and in magic (its own list). Fighters take arms, casters magic,
// hybrids both. Expert is taught by every town trainer whose ceiling is 13 or over, from level 13, for
// 2,000 gold a line; Master by a person found (`npc.mastery`), to a member Expert in the line, from 25,
// once their favour is done, for their price. What a tier does is party.ts's (`armsBonus`,
// `tierSteps`), beside the ranks it adds to, so the party imports nothing that reaches the quests.
// Pure apart from the party and the world handed in, so the tests teach as the game does, without a Game.
import type { Calling, Character, ClassId, Party } from './party.ts';
import { PRESTIGES } from './party.ts';
import type { WorldState } from './world.ts';
import type { When } from './quests.ts';
import { holds } from './quests.ts';

export type Tier = 'expert' | 'master';
export type Line = 'arms' | 'magic';
/** A member's tier on each line it has one on; absent in a save from before them. */
export interface Tiers { arms?: Tier; magic?: Tier }

/**
 * A Master a person teaches (DESIGN §5): their line, to a member Expert in it from level 25, once the
 * favour `done` holds (none asked where it is absent), for `price`. Once their words are said they
 * offer it to the company's members of the line. Found, never sought: no quest or mark names them.
 */
export interface Mastery { line: Line; tier: 'master'; done?: When; price: number }

export const TIERS: readonly Tier[] = ['expert', 'master'];
export const LINES: readonly Line[] = ['arms', 'magic'];
/** The level each is taught from: Expert two past the first prestige, Master two before the third (DESIGN §5's rhythm). */
export const TIER_LEVELS: Readonly<Record<Tier, number>> = { expert: 13, master: 25 };
/**
 * What each costs a line a member: Expert twice a skill, between the prestiges' 1,000 and 4,000;
 * Master half again the second prestige, the price a Master's person asks. Outside the curve's gold,
 * as SKILL_PRICE and PRESTIGE_PRICES are (DESIGN §5 Prices).
 */
export const TIER_PRICES: Readonly<Record<Tier, number>> = { expert: 2000, master: 5000 };
/** A town's trainer teaches Expert where it trains to this level or past it: from Saltmouth's on. */
export const EXPERT_FROM = 13;

const BY_CALLING: Readonly<Record<Calling, readonly Line[]>> = { fighter: ['arms'], caster: ['magic'], hybrid: ['arms', 'magic'] };
/** The lines a class takes: a fighter's arms, a caster's magic, a hybrid's both. */
export const linesOf = (cls: ClassId): readonly Line[] => BY_CALLING[PRESTIGES[cls].calling];

/** A member's tier on a line: none in a save from before them. */
export const tierOf = (c: Pick<Character, 'tiers'>, line: Line): Tier | undefined => c.tiers?.[line];

/** Whether a town's trainer teaches Expert: one whose ceiling is 13 or over. */
export const teachesExpert = (maxLevel: number): boolean => maxLevel >= EXPERT_FROM;

/** One line of a tier's menu: a member, the line and tier, the price, and why not, if not. */
export interface TierOffer { who: number; line: Line; tier: Tier; price: number; bar: string }

/**
 * Why a member may not take a tier, or '' if it may: not of the line, the tier or a higher one taken,
 * a Master's Expert not taken, short of the level, the favour not done, or short of the gold.
 */
export function tierBar(line: Line, tier: Tier, price: number, c: Character, party: Party, favour = true): string {
  const has = tierOf(c, line);
  if (!linesOf(c.cls).includes(line)) return NOT_OURS;
  if (has && TIERS.indexOf(has) >= TIERS.indexOf(tier)) return ALREADY(has);
  if (tier === 'master' && has !== 'expert') return FIRST;
  if (c.level < TIER_LEVELS[tier]) return AT_LEVEL(TIER_LEVELS[tier]);
  if (!favour) return NOT_YET;
  if (party.gold < price) return SHORT;
  return '';
}

/** A town trainer's Expert on a line: every member, each with the price or why not. */
export function expertOffers(line: Line, party: Party): TierOffer[] {
  const price = TIER_PRICES.expert;
  return party.members.map((c, who) => ({ who, line, tier: 'expert', price, bar: tierBar(line, 'expert', price, c, party) }));
}

/** Whether the favour a Master asks is done: always, where they ask none. */
export const favourDone = (m: Mastery, world: WorldState, party: Party): boolean => !m.done || holds(m.done, world, party);

/** A Master's person: the company's members of the line, each with the price or why not. */
export function masterOffers(m: Mastery, party: Party, world: WorldState): TierOffer[] {
  const done = favourDone(m, world, party);
  return party.members.flatMap((c, who) => (linesOf(c.cls).includes(m.line) ? [{ who, line: m.line, tier: m.tier, price: m.price, bar: tierBar(m.line, m.tier, m.price, c, party, done) }] : []));
}

/** The menu's line for an offer: the member, the tier and line, then the price or why not. */
export const tierLine = (o: TierOffer, party: Party): string => `${party.members[o.who].name}: ${TIER_NAMES[o.tier]} ${LINE_NAMES[o.line]}\t${o.bar || `${o.price}g`}`;

/** Teach a member a tier on a line: the price paid, the tier on its sheet. Nothing changes, and false, where it may not. */
export function teachTier(line: Line, tier: Tier, price: number, party: Party, who: number, favour = true): { taught: boolean; said: string } {
  const c = party.members[who];
  if (!c || tierBar(line, tier, price, c, party, favour)) return { taught: false, said: '' };
  party.gold -= price;
  c.tiers = { ...c.tiers, [line]: tier };
  return { taught: true, said: TAUGHT(c.name, tier, line) };
}

// ---- the words ----

export const TIER_NAMES: Readonly<Record<Tier, string>> = { expert: 'Expert', master: 'Master' };
export const LINE_NAMES: Readonly<Record<Line, string>> = { arms: 'at arms', magic: 'in magic' };
/** A trainer's first menu's entry for its Expert, and the rows of the line it asks first. */
export const EXPERT_ENTRY = 'Expert at arms and in magic';
export const LINE_ROWS: Readonly<Record<Line, string>> = { arms: 'At arms', magic: 'In magic' };
/** Put over the line's question and the members' menu, and their way out. */
export const askLine = (party: Party): string => `"Arms, or magic?" (${party.gold} gold.)`;
export const askTier = (tier: Tier, party: Party): string => `"Who would be ${TIER_NAMES[tier]}?" (${party.gold} gold.)`;
export const LEAVE_TIERS = 'Leave';
/** What a Master's person says to a company with nobody of their line in it. */
export const noneHere = (line: Line): string => (line === 'arms' ? '"I teach arms. Nobody here bears them."' : '"I teach magic. Nobody here casts."');
const NOT_OURS = 'not their line';
const ALREADY = (t: Tier): string => `${TIER_NAMES[t]} already`;
const FIRST = `${TIER_NAMES.expert} first`;
const AT_LEVEL = (level: number): string => `from level ${level}`;
const NOT_YET = 'the favour first';
const SHORT = 'not enough gold';
const TAUGHT = (name: string, tier: Tier, line: Line): string => `${name} is ${TIER_NAMES[tier]} ${LINE_NAMES[line]} now.`;
