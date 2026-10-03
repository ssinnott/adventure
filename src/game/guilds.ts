// The guilds' rules (DESIGN §8): a guild's quests, what its hall offers a company, taking a quest
// and the report that pays it. A company joins by its first task and rises a rank when all of a
// rank's quests are done, so membership and rank are worked out from the quests' done flags; a rank
// once reached is kept by its own flag, so that quests added later never lower it. Every hall of a
// guild keeps the one ladder. A rank decides only which of the guild's own quests a hall offers, so
// it is no story lock. It depends on the world state and the party alone, so the tests can walk a
// ladder without a Game; the hall's menu is ui/screens.ts.
import type { GuildId } from '../content/guilds.ts';
import { GUILDS, takenFlag, doneFlag, rankFlag } from '../content/guilds.ts';
import { GUILD_QUESTS, ITEMS } from '../content/index.ts';
import type { WorldState } from './world.ts';
import type { Party } from './party.ts';
import { countItem, takeItem, payXp } from './party.ts';
import type { QuestDef, When } from './quests.ts';
import { holds } from './quests.ts';

/** A guild quest, given out and paid at the guild's halls; each area's are in its guilds.ts. */
export interface GuildQuest {
  /** Its flags are `q_<id>` once taken and `q_<id>_done` once paid, as a person's quests are. */
  id: string;
  guild: GuildId;
  /** The rank a company must hold to be offered it: 0, the first task, is offered to strangers. */
  rank: number;
  /** What the hall says offering it. */
  offer: readonly string[];
  /** The deed: once it holds, the next report pays. */
  goal?: When;
  /** An item the hall takes at the report. It is taken at the first meeting, whatever the rank, as a person's hand-in is. */
  item?: string;
  /** Said on paying; `early` instead to a company that did the deed before it took the quest. */
  paid: readonly string[];
  early?: readonly string[];
  /** The xp is split among the living, as a fight's is. */
  pay: { gold?: number; xp?: number; items?: readonly string[] };
  /** The log's words. It is in the log from the taking, or the paying, on. */
  title: string;
  entries: QuestDef['entries'];
  goals: QuestDef['goals'];
}

const ofGuild = (guild: GuildId, quests: readonly GuildQuest[]): GuildQuest[] => quests.filter((q) => q.guild === guild);
const isDone = (q: GuildQuest, party: Party): boolean => !!party.flags[doneFlag(q.id)];
const isTaken = (q: GuildQuest, party: Party): boolean => !!party.flags[takenFlag(q.id)];

/**
 * The company's rank in a guild: 0 a stranger, 1 once the first task is done and one more for each
 * rank all of whose quests are done. It stops at the first rank with no quests built yet. A rank
 * once reached is kept (its flag, `rankFlag`), so a quest added later at a rank the company holds is
 * offered to it and never lowers it: a save loads as it did (EXPANSION §5.5).
 */
export function rankOf(guild: GuildId, party: Party, quests: readonly GuildQuest[] = GUILD_QUESTS): number {
  const mine = ofGuild(guild, quests);
  let r = party.flags[rankFlag(guild)] ?? 0;
  while (r < GUILDS[guild].ranks.length) {
    const at = mine.filter((q) => q.rank === r);
    if (!at.length || !at.every((q) => isDone(q, party))) break;
    r++;
  }
  return r;
}

/** A guild's name as said mid-sentence: "the Wardens". */
export const guildName = (guild: GuildId): string => GUILDS[guild].name.replace(/^The /, 'the ');

/** The name of a rank, or null for a stranger. */
export const rankName = (guild: GuildId, rank: number): string | null => (rank > 0 ? GUILDS[guild].ranks[rank - 1] : null);

/** The quests a hall of the guild offers: those at or under the company's rank, not yet taken. */
export function offered(guild: GuildId, party: Party, quests: readonly GuildQuest[] = GUILD_QUESTS): GuildQuest[] {
  const rank = rankOf(guild, party, quests);
  return ofGuild(guild, quests).filter((q) => q.rank <= rank && !isTaken(q, party) && !isDone(q, party));
}

/** The quests taken and not yet paid. */
export function inHand(guild: GuildId, party: Party, quests: readonly GuildQuest[] = GUILD_QUESTS): GuildQuest[] {
  return ofGuild(guild, quests).filter((q) => isTaken(q, party) && !isDone(q, party));
}

/** Whether the deed is done: the goal holds and the item, if any, is carried. */
function met(q: GuildQuest, world: WorldState, party: Party): boolean {
  if (!q.goal && !q.item) return false;
  return (!q.goal || holds(q.goal, world, party)) && (!q.item || countItem(party, q.item) > 0);
}

function payOut(q: GuildQuest, party: Party, early: boolean): string {
  if (q.item) takeItem(party, q.item);
  const { gold = 0, xp = 0, items = [] } = q.pay;
  party.gold += gold;
  const ready = payXp(party, xp);
  party.bag.push(...items);
  party.flags[doneFlag(q.id)] = 1;
  const what = [gold ? `${gold} gold` : '', xp ? `${xp} experience` : '', ...items.map((id) => ITEMS[id].name)].filter(Boolean);
  return (early && q.early ? q.early : q.paid).join('\n\n') + (what.length ? `\n\n(${what.join(', ')}.)` : '')
    + (ready.length ? `\n\nReady to train: ${ready.join(', ')}.` : '');
}

/** Keep a rise in rank, and say it, if the rank rose. */
function rose(guild: GuildId, before: number, party: Party, quests: readonly GuildQuest[]): string[] {
  const now = rankOf(guild, party, quests);
  if (now <= before) return [];
  party.flags[rankFlag(guild)] = now;
  return [`Your rank with ${guildName(guild)} is now ${rankName(guild, now)}.`];
}

/**
 * A report at a hall: pay every quest taken whose deed is done, and every item quest whose item the
 * company carries, taken or not, whatever its rank. Returns what the hall says, empty if nothing.
 */
export function report(guild: GuildId, world: WorldState, party: Party, quests: readonly GuildQuest[] = GUILD_QUESTS): string[] {
  const before = rankOf(guild, party, quests), out: string[] = [];
  for (const q of ofGuild(guild, quests)) {
    if (isDone(q, party) || !met(q, world, party)) continue;
    if (isTaken(q, party)) out.push(payOut(q, party, false));
    else if (q.item) out.push(payOut(q, party, true));
  }
  return out.length ? [...out, ...rose(guild, before, party, quests)] : [];
}

/** Take a quest. A deed done before it was taken is paid at once, with the words for a company that came early. */
export function take(q: GuildQuest, world: WorldState, party: Party, quests: readonly GuildQuest[] = GUILD_QUESTS): string[] {
  const before = rankOf(q.guild, party, quests);
  party.flags[takenFlag(q.id)] = 1;
  if (!met(q, world, party)) return [];
  return [payOut(q, party, true), ...rose(q.guild, before, party, quests)];
}
