// The feats on stamina (DESIGN §5, #1113): the frame the four classes that cast nothing share, the
// knight, the barbarian, the thief and the monk, and the registry each class's module gives its feats
// and its bots' policy to. On in play since #1117 (`FEATS_ON`); in a fight a tool sets them off in
// (`CombatOpts.feats`) no stamina is built, no feat is offered and the bots try none, so it draws and
// plays as one before them. Nothing here draws on the rng.
//
// Stamina is the fight's (`CombatState.stamina`, by slot), never a member's: none at a fight's start,
// none after it, never saved. One of the four takes 1 for each blow of its own that lands, a feat's
// and a prestige's extra and a follow-through's alike, and 1 for each foe's blow that lands on it,
// whether or not it then falls; STAMINA_MAX at most. A blow is what the log says hits: a sweep, a
// breath or a spell is none. Each class takes 1 more one way: the knight for a blow that lands on it,
// the barbarian for a blow of its own that lands while it rages (`rages`), the thief for a sneak attack
// that lands and the monk for a blow that fells its foe (`landed`, `bore`).
//
// A feat costs 2 to 5, comes at 1, 8, 15 or 23 and takes the turn: an action beside attack, cast, use,
// defend and flee (`PartyAction` 'feat'). One asleep, held, down or fled never has the turn, so never
// spends. The frame finds a feat legal (the feats on, the member's class's, at its level, affordable,
// and its target: for a blow a foe its weapon reaches from its row, for a group a foe standing), takes
// its cost and plays its rule (`FeatDef.use`), which may strike with the member's weapon (`Strike`),
// the buffs and an elemental die as in an Attack. A class adds its feats in a module of its own under
// combat/feats/: its feats, their rules and its bots' policy, given here by one line (`BY_CLASS`), and
// the hooks its rules need where the fight has the thing.
import type { RngInstance } from '../../lib/engine/rng.ts';
import { FEATS_ON } from '../party.ts';
import type { Character, ClassId, Party } from '../party.ts';
import { standing, aliveMonsters } from './state.ts';
import type { CombatState, PartyAction, Strike } from './state.ts';
import { canAttackFromRow, rages } from './perks.ts';
import { canReach } from './foes.ts';
import { KNIGHT } from './feats/knight.ts';
import { BARBARIAN } from './feats/barbarian.ts';
import { THIEF } from './feats/thief.ts';
import { MONK } from './feats/monk.ts';

/** The most stamina a member holds. */
export const STAMINA_MAX = 6;

/** What a feat is aimed at: a foe its weapon reaches from its row (a blow), a group by any foe of it standing, or nothing. */
type FeatTarget = 'blow' | 'group' | 'none';

/** A feat (DESIGN §5): its class, the level it comes at, its cost in stamina, its words and its rule. */
export interface FeatDef {
  id: string; cls: ClassId; level: number; cost: number; name: string; text: string; target: FeatTarget;
  /** The foes it may be aimed at where a blow's reach or a group's standing foe is not its rule (a foe asleep or held, the back rank). */
  aims?: (s: CombatState, c: Character, target: number) => boolean;
  /** It leaves the turn unspent: the member acts again at once. */
  again?: boolean;
  /** What it does, once the frame has found it legal and taken its cost. */
  use: (f: FeatUse) => void;
}

/** What a feat's rule is handed: the fight, the member and its slot, its target, and its weapon's blows. */
interface FeatUse {
  s: CombatState; party: Party; rng: RngInstance; c: Character; i: number; target: number;
  /** The member's blows at `at` (the feat's target unless given), an Attack's but as `how` says. */
  strike: (how?: Strike, at?: number) => void;
}

/** What a class's bots' policy is handed: the fight, the member and its slot, the foe the bot would strike, and the feats it may use now. */
interface FeatBot { s: CombatState; p: Party; c: Character; i: number; foe: number; has: (id: string) => boolean }

/** A class's feats and its bots' policy: the feat to spend on this turn and its target, or none. */
export interface FeatClass {
  feats: readonly FeatDef[]; bot: (b: FeatBot) => { featId: string; target: number } | undefined;
  /** Its feats' rounds counted down at a round's end, as Bless's are (`featRounds`); nothing drawn. */
  round?: (s: CombatState, party: Party) => void;
}

/** Each class's feats, a line a class. */
const BY_CLASS: Partial<Record<ClassId, FeatClass>> = {
  knight: KNIGHT,
  barbarian: BARBARIAN,
  thief: THIEF,
  monk: MONK,
};

/** Every feat, class by class. */
export const FEATS: readonly FeatDef[] = Object.values(BY_CLASS).flatMap((k) => k.feats);

/** The classes that build stamina: the four that cast nothing (DESIGN §5). */
const BUILDERS: readonly ClassId[] = ['knight', 'barbarian', 'thief', 'monk'];
/** Whether a member builds stamina. */
export const builds = (c: Pick<Character, 'cls'>): boolean => BUILDERS.includes(c.cls);

/** Whether the fight has the feats: FEATS_ON in play, a tool's own where it turns them on. */
export const featsOn = (s: Pick<CombatState, 'feats'>): boolean => s.feats ?? FEATS_ON;

/** A member's stamina as its card shows it: one of the four's while the feats are on; none else. */
export const staminaOf = (s: CombatState, c: Character, i: number): number | undefined => (builds(c) ? s.stamina?.[i] : undefined);

const add = (s: CombatState, i: number, n: number): void => { s.stamina![i] = Math.min(STAMINA_MAX, s.stamina![i] + n); };

/** A blow of member `i`'s own landed (the attack loop): 1, and 1 more for the barbarian raging, the thief's own sneak attack (`sneaks`, not a feat's), the monk's felling blow. */
export function landed(s: CombatState, c: Character, i: number, sneak: boolean, fells: boolean): void {
  if (!s.stamina || !builds(c)) return;
  add(s, i, (c.cls === 'barbarian' && rages(s, c, i)) || (c.cls === 'thief' && sneak) || (c.cls === 'monk' && fells) ? 2 : 1);
}

/** A foe's blow landed on member `i` (the monsters' turn): 1, and the knight 1 more. */
export function bore(s: CombatState, c: Character, i: number): void {
  if (s.stamina && builds(c)) add(s, i, c.cls === 'knight' ? 2 : 1);
}

/** The feats a member has at its level, its class's: none for a class with none. */
export const featsKnown = (c: Character): readonly FeatDef[] => (BY_CLASS[c.cls]?.feats ?? []).filter((f) => c.level >= f.level);

/** The feats member `i` has at its level and may afford now, a blow's only from a row it strikes from, one with a rule of aim only while a foe meets it; none while the feats are off. */
export function featsOf(s: CombatState, party: Party, i: number): readonly FeatDef[] {
  const c = party.members[i], st = s.stamina?.[i];
  return st === undefined ? [] : featsKnown(c).filter((f) => f.cost <= st && (f.target !== 'blow' || canAttackFromRow(s.tables.items, c, i)) && (!f.aims || aliveMonsters(s).some((t) => f.aims!(s, c, t))));
}

/** Whether member `c`'s feat `f` may be aimed at monster `target`: by its own rule (`aims`), else a blow's at a foe its weapon reaches, a group's at one standing. */
export function aimable(s: CombatState, c: Character, f: FeatDef, target: number): boolean {
  const m = s.monsters[target];
  return f.aims ? f.aims(s, c, target) : f.target === 'blow' ? canReach(s, c, target) : f.target === 'group' ? !!m && standing(m) : true;
}

/**
 * Member `i` spends stamina on feat `featId` at `target` (`partyAct`'s 'feat'): its cost taken and its
 * rule played, its blows by `strike`. The feat spent, or none and nothing done where it may not.
 */
export function spend(s: CombatState, party: Party, rng: RngInstance, i: number, featId: string, target: number, strike: (how: Strike, at: number) => void): FeatDef | undefined {
  const c = party.members[i], f = featsOf(s, party, i).find((x) => x.id === featId);
  if (!f || !aimable(s, c, f, target)) return undefined;
  s.stamina![i] -= f.cost;
  f.use({ s, party, rng, c, i, target, strike: (how = {}, at = target) => strike(how, at) });
  return f;
}

/** The feats' round's end (`endRound`): each class's rounds counted down (`FeatClass.round`). */
export function featRounds(s: CombatState, party: Party): void { for (const k of Object.values(BY_CLASS)) k.round?.(s, party); }

/**
 * The feat the bots spend on for member `i` this turn (`BotOpts.feats`, game/bot.ts): its class's
 * policy's, handed `foe`, the foe the bot would strike; none while the feats are off.
 */
export function featFor(s: CombatState, p: Party, i: number, foe: number): PartyAction | undefined {
  const k = BY_CLASS[p.members[i].cls], ready = featsOf(s, p, i);
  const pick = k && ready.length ? k.bot({ s, p, c: p.members[i], i, foe, has: (id) => ready.some((f) => f.id === id) }) : undefined;
  return pick && { type: 'feat', ...pick };
}
