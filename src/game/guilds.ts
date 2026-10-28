// The guilds' rules (DESIGN §8): a guild's quests, what its hall offers a company, taking a quest
// and the report that pays it. A company joins by its first task and rises a rank when all of a
// rank's quests are done, so membership and rank are worked out from the quests' done flags; a rank
// once reached is kept by its own flag, so that quests added later never lower it. Every hall of a
// guild keeps the one ladder. A rank decides only which of the guild's own quests a hall offers, so
// it is no story lock. It depends on the world state, the party and the tables handed in (the guilds
// and their quests, #975), so the tests can walk a ladder of their own without a Game; the hall's menu
// is ui/screens.ts.
import type { GuildId } from '../content/guilds.ts';
import { takenFlag, doneFlag, rankFlag } from './keys.ts';
import type { Flag } from '../content/index.ts';
import type { WorldState } from './world.ts';
import type { Party } from './party.ts';
import { countItem, takeItem, payXp } from './party.ts';
import type { QuestDef, When } from './quests.ts';
import { holds } from './quests.ts';
import { rankOf, ofGuild, isDone } from './ranks.ts';
import type { Items, Tables } from './tables.ts';

// The rank is game/ranks.ts's (#857), so that game/skills.ts may ask it apart from the quests' rules.
export { rankOf };

/** A guild quest, given out and paid at the guild's halls; each area's are in its guilds.ts. */
export interface GuildQuest {
  /** Its flags are `q_<id>` once taken and `q_<id>_done` once paid, as a person's quests are. */
  id: string;
  guild: GuildId;
  /** The rank a company must hold to be offered it: 0, the first task, is offered to strangers. */
  rank: number;
  /** A flag the company must hold as well: a later act's ask waits for its act (DESIGN §8), so a rank held early opens nothing ahead of the road. */
  after?: Flag;
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

const isTaken = (q: GuildQuest, party: Party): boolean => !!party.flags[takenFlag(q.id)];

const midSentence = (name: string): string => name.replace(/^The /, 'the ');

/** A guild's name as said mid-sentence: "the Wardens". */
export const guildName = (guilds: Tables['guilds'], guild: GuildId): string => midSentence(guilds[guild].name);

/** A guild's name as a hall's first menu says it after "Work for": its short name where the whole would be cut, "the Cartographers". */
export const guildShortName = (guilds: Tables['guilds'], guild: GuildId): string => midSentence(guilds[guild].short ?? guilds[guild].name);

/** The name of a rank, or null for a stranger. */
export const rankName = (guilds: Tables['guilds'], guild: GuildId, rank: number): string | null => (rank > 0 ? guilds[guild].ranks[rank - 1] : null);

/** The quests a hall of the guild offers: those at or under the company's rank whose act has come, not yet taken. */
export function offered(tables: Tables, guild: GuildId, party: Party): GuildQuest[] {
  const rank = rankOf(tables, guild, party);
  return ofGuild(guild, tables.guildQuests).filter((q) => q.rank <= rank && (!q.after || !!party.flags[q.after]) && !isTaken(q, party) && !isDone(q, party));
}

/** The quests taken and not yet paid. */
export function inHand(tables: Tables, guild: GuildId, party: Party): GuildQuest[] {
  return ofGuild(guild, tables.guildQuests).filter((q) => isTaken(q, party) && !isDone(q, party));
}

/** Whether the deed is done: the goal holds and the item, if any, is carried. */
function met(q: GuildQuest, world: WorldState, party: Party): boolean {
  if (!q.goal && !q.item) return false;
  return (!q.goal || holds(q.goal, world, party)) && (!q.item || countItem(party, q.item) > 0);
}

function payOut(items: Items, q: GuildQuest, party: Party, early: boolean): string {
  if (q.item) takeItem(party, q.item);
  const { gold = 0, xp = 0, items: given = [] } = q.pay;
  party.gold += gold;
  const ready = payXp(party, xp);
  party.bag.push(...given);
  party.flags[doneFlag(q.id)] = 1;
  const what = [gold ? `${gold} gold` : '', xp ? `${xp} experience` : '', ...given.map((id) => items[id].name)].filter(Boolean);
  return (early && q.early ? q.early : q.paid).join('\n\n') + (what.length ? `\n\n(${what.join(', ')}.)` : '')
    + (ready.length ? `\n\nReady to train: ${ready.join(', ')}.` : '');
}

/** Keep a rise in rank, and say it, if the rank rose. */
function rose(tables: Tables, guild: GuildId, before: number, party: Party): string[] {
  const now = rankOf(tables, guild, party);
  if (now <= before) return [];
  party.flags[rankFlag(guild)] = now;
  return [`Your rank with ${guildName(tables.guilds, guild)} is now ${rankName(tables.guilds, guild, now)}.`];
}

/**
 * A report at a hall: pay every quest taken whose deed is done, and every item quest whose item the
 * company carries, taken or not, whatever its rank. Returns what the hall says, empty if nothing.
 */
export function report(tables: Tables, guild: GuildId, world: WorldState, party: Party): string[] {
  const before = rankOf(tables, guild, party), out: string[] = [];
  for (const q of ofGuild(guild, tables.guildQuests)) {
    if (isDone(q, party) || !met(q, world, party)) continue;
    if (isTaken(q, party)) out.push(payOut(tables.items, q, party, false));
    else if (q.item) out.push(payOut(tables.items, q, party, true));
  }
  return out.length ? [...out, ...rose(tables, guild, before, party)] : [];
}

/** Take a quest. A deed done before it was taken is paid at once, with the words for a company that came early. */
export function take(tables: Tables, q: GuildQuest, world: WorldState, party: Party): string[] {
  const before = rankOf(tables, q.guild, party);
  party.flags[takenFlag(q.id)] = 1;
  if (!met(q, world, party)) return [];
  return [payOut(tables.items, q, party, true), ...rose(tables, q.guild, before, party)];
}
