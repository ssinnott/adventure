// A company's rank in a guild (DESIGN §8), worked out from the guild's quests' done flags and kept by
// its own flag. It stands apart from game/guilds.ts, whose rules use it, so that game/skills.ts may ask
// it (`mayLearn`) without pulling the quests' rules in under the content index before its maps
// are made (#857). It reads the party and the tables handed in alone: the guilds and their
// quests (#975).
import type { GuildId } from '../content/guilds.ts';
import { doneFlag, rankFlag } from './keys.ts';
import type { GuildQuest } from './guilds.ts';
import type { Party } from './party.ts';
import type { Tables } from './tables.ts';

/** A guild's own quests. */
export const ofGuild = (guild: GuildId, quests: readonly GuildQuest[]): GuildQuest[] => quests.filter((q) => q.guild === guild);
/** Whether the company has been paid for a guild quest. */
export const isDone = (q: GuildQuest, party: Party): boolean => !!party.flags[doneFlag(q.id)];

/**
 * The company's rank in a guild: 0 a stranger, 1 once the first task is done and one more for each
 * rank all of whose quests are done. It stops at the first rank with no quests built yet. A rank
 * once reached is kept (its flag, `rankFlag`), so a quest added later at a rank the company holds is
 * offered to it and never lowers it: a save loads as it did (EXPANSION §5.5).
 */
export function rankOf(tables: Tables, guild: GuildId, party: Party): number {
  const mine = ofGuild(guild, tables.guildQuests);
  let r = party.flags[rankFlag(guild)] ?? 0;
  while (r < tables.guilds[guild].ranks.length) {
    const at = mine.filter((q) => q.rank === r);
    if (!at.length || !at.every((q) => isDone(q, party))) break;
    r++;
  }
  return r;
}
