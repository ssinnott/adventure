// The guilds (DESIGN §8): who they are, where their halls are and the names of their ranks. A
// company may join any or all of them; a hall is a business with `hall` set to the guild's id. Each
// guild's quests are an area's, in src/content/areas/<area>/guilds.ts; the rules are game/guilds.ts.
// Membership and rank are worked out from the quests' done flags; a rank once reached is kept by
// its own flag, so that content added later never lowers it.
import type { GuildQuest } from '../game/guilds.ts';
import type { QuestDef } from '../game/quests.ts';

export type GuildId = 'wardens' | 'lanterns' | 'cartographers' | 'compact';

export interface GuildDef {
  id: GuildId;
  name: string;
  /** The four ranks' names: the first task done makes a company the first. */
  ranks: readonly [string, string, string, string];
}

export const GUILDS: Readonly<Record<GuildId, GuildDef>> = {
  wardens: { id: 'wardens', name: 'The Wardens', ranks: ['Recruit', 'Corporal', 'Sergeant', 'Captain'] },
  lanterns: { id: 'lanterns', name: 'The Lanterns', ranks: ['Taper', 'Adjunct', 'Reader', 'Luminary'] },
  cartographers: { id: 'cartographers', name: "The Cartographers' Guild", ranks: ['Chainman', 'Surveyor', 'Mapmaker', 'Geographer'] },
  compact: { id: 'compact', name: 'The Salt Compact', ranks: ['Runner', 'Fence', 'Factor', 'Partner'] },
};

/** The flag set when a company takes a guild quest, as a person's quests are: `q_<id>`. */
export const takenFlag = (quest: string): string => `q_${quest}`;
/** The flag set when a guild quest is paid: `q_<id>_done`. */
export const doneFlag = (quest: string): string => `q_${quest}_done`;
/** The flag that keeps the rank a company has reached in a guild, as its number: `rank_<guild>`. */
export const rankFlag = (guild: GuildId): string => `rank_${guild}`;

/** A guild quest's side of the quest log: in it from the taking, finished at the pay. */
export const guildQuestDef = (q: GuildQuest): QuestDef => ({
  id: q.id, title: q.title, start: { flag: takenFlag(q.id) }, done: { flag: doneFlag(q.id) }, entries: q.entries, goals: q.goals,
});
