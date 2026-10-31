// The fight's words for the log (#1007, cut from game/combat.ts): what it says when people break or
// beasts run, a call is answered, a monster mends or smoulders, the light dims, a row is swept, a
// member turns to glass or a rite holds, the glove's line once a game, the company's first strike, a
// sneak attack's mark, a follow-through's and a won fight's, with the least and the most share it
// paid. Words alone: nothing here takes the state, the party or the rng.
import type { Element } from '../spells.ts';
import type { Character } from '../party.ts';
import type { Loot } from './state.ts';

/** The log's line when people break at their leader's fall, and when beasts run; given who goes, and whether one. */
export const BREAK_LINE = (names: string, one: boolean): string => one ? `${names} breaks and runs.` : `${names} break and run.`;
export const ROUT_LINE = (names: string, one: boolean): string => one ? `${names} bolts.` : `${names} bolt.`;
/**
 * The log's line the first time Smite or Wrath of the Hearth passes through a machine and does nothing
 * (MONSTERS §2), given whether through one; said once a game, and kept by its flag in the party's flags.
 */
export const GLOVE_LINE = (one: boolean): string => `The light goes into ${one ? 'it' : 'them'} like a hand into a glove.`;
/** The log's word when a hit turns a member to glass (#546), in place of the condition's name and a fall. */
export const STONE_LINE = (who: string): string => `${who} turns to glass!`;

/** What Lampglass's line calls each element: the wood for nature, the light for holy. */
export const GLASS_WORD: Record<Element, string> = { fire: 'fire', cold: 'cold', lightning: 'lightning', nature: 'wood', holy: 'light' };

/** Names as a line gives them: "Bram", "Bram and Idris", "Bram, Idris and Wren". */
export const names = (cs: readonly Character[]): string => cs.length < 2 ? cs.map((c) => c.name).join('') : `${cs.slice(0, -1).map((c) => c.name).join(', ')} and ${cs[cs.length - 1].name}`;

/** The log's words when a cleric's last rite holds someone back from death. */
export const RITE_LINE = (cleric: string, who: string): string => (cleric === who ? `${cleric}'s own rite holds. ${cleric} does not fall.` : `${cleric}'s rite holds. ${who} does not fall.`);

/** The log's lines: a round's mending, one kept from it by fire (`regenerate`) and a call answered (`call`). */
export const MEND_LINE = (names: string, one: boolean, n: number): string => `${names} ${one ? 'mends' : 'mend'} ${n}.`;
export const SMOULDER_LINE = (names: string, one: boolean): string => one ? `${names} smoulders and does not mend.` : `${names} smoulder and do not mend.`;
export const CALL_LINE = (caller: string, names: string, one: boolean): string => `${caller} calls, and ${names} ${one ? 'answers' : 'answer'}.`;
/** The log's lines under the clock (`dim`): every third step of the light, and its last. */
export const DIM_LINE = 'Through the roof, the light goes out a little.', THREAD_LINE = 'The light holds at a thread.';
/**
 * The log's line at a fight's start while an Arms Master stands (`strikesFirst`, #1070), said once; and
 * the mark a sneak attack's hit takes (`sneaks`), a sentence after the hit's own and before a death.
 */
export const FIRST_LINE = 'The company strikes first.', SNEAK_LINE = 'Sneak attack.';
/** The mark a critical hit takes (`critChance`, #1114): after the hit's own sentence and a sneak attack's, before a death. */
export const CRIT_LINE = 'A true blow.';
/** The mark a Windwalker's felling hit takes when its blow carries on to the next foe (`followsThrough`, #1070), after the death. */
export const FOLLOW_LINE = 'The blow carries on.';
/**
 * The knight's feats (#1113, combat/feats/knight.ts): a Challenge and the foes it holds, Mighty Blow's
 * mark (after a crit's place, before a death), a Rally and those it frees, and the line before a
 * Champion's Strike's blows.
 */
export const CHALLENGE_LINE = (who: string, foes: string): string => `${who} challenges ${foes}.`;
export const MIGHTY_LINE = 'A mighty blow.';
export const RALLY_LINE = (who: string, freed: readonly Character[]): string =>
  `${who} rallies the front row.` + (freed.length ? ` ${names(freed)} ${freed.length === 1 ? 'shakes' : 'shake'} it off.` : '');
export const CHAMPION_LINE = (who: string): string => `${who} strikes as a champion.`;
/** The log's line when those that obey stand down at the last leader's fall (`morale`). */
export const STAND_LINE = (names: string, one: boolean): string => `${names} ${one ? 'stands' : 'stand'} down.`;
/** The log's line for a sweep (`sweep`): an arm across a row or a breath of its element on one, and what it dealt, or its miss. */
export const SWEEP_LINE = (who: string, el: Element | undefined, row: string, dealt?: number): string =>
  `${who} ${el ? `breathes ${GLASS_WORD[el]} on` : 'sweeps'} ${row}${dealt === undefined ? ' and misses.' : `: ${dealt} damage.`}`;

/** The least and the most share a fight paid, the same where all took one. */
export function shareRange(loot: Loot): [number, number] {
  return loot.shares.length ? [Math.min(...loot.shares), Math.max(...loot.shares)] : [0, 0];
}

/** The log's line for a won fight: what it was worth, or the least and most share where levels made them differ. */
export function victoryLine(loot: Loot): string {
  const [least, most] = shareRange(loot);
  return least === most ? `Victory! ${loot.xp} experience, ${loot.gold} gold.` : `Victory! ${least} to ${most} experience by level, ${loot.gold} gold.`;
}

/**
 * The barbarian's feats (#1113, combat/feats/barbarian.ts): a Frenzy, the line before a Cleave's blows,
 * a War Cry at a group and a Deathless; one under it who fights on, the mark after the blow's or the
 * poison's line that fells it, and one who falls as it ends.
 */
export const FRENZY_LINE = (who: string): string => `${who} flies into a frenzy.`;
export const CLEAVE_LINE = (who: string, foes: string): string => `${who} cleaves into ${foes}.`;
export const WAR_CRY_LINE = (who: string, foes: string): string => `${who} roars at ${foes}.`;
export const DEATHLESS_LINE = (who: string): string => `${who} will not fall.`;
export const FIGHTS_ON_LINE = (who: string): string => `${who} fights on.`;
export const FALLS_LINE = (who: string): string => `${who} falls!`;

/**
 * The monk's feats (#1113, combat/feats/monk.ts): the line before a Flurry's strikes, a Leap's and a
 * Wind Step's, and the words after a Quiet Palm's hit on a foe left standing, asleep or proof against it.
 */
export const FLURRY_LINE = (who: string): string => `${who} strikes in a flurry.`;
export const PALM_LINE = (foe: string, sleeps: boolean): string => (sleeps ? `${foe} falls asleep.` : `${foe} does not sleep.`);
export const LEAP_LINE = (who: string): string => `${who} leaps past the front.`;
export const WIND_LINE = (who: string): string => `${who} steps on the wind.`;
