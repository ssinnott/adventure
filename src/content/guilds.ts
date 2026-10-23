// The guilds (DESIGN §8): who they are, where their halls are and the names of their ranks. A
// company may join any or all of them; a hall is a business, or a tavern, with `hall` set to the
// guild's id. Each guild's quests are an area's, in src/content/areas/<area>/guilds.ts; the rules
// are game/guilds.ts.
// Membership and rank are worked out from the quests' done flags; a rank once reached is kept by
// its own flag, so that content added later never lowers it.
import type { GuildQuest } from '../game/guilds.ts';
import type { QuestDef } from '../game/quests.ts';
import { takenFlag, doneFlag } from '../game/keys.ts';

export type GuildId = 'wardens' | 'lanterns' | 'cartographers' | 'compact';

export interface GuildDef {
  id: GuildId;
  name: string;
  /**
   * What a hall's first menu calls the guild after "Work for", where the whole name would be cut in the
   * side panel (tools/tests/guilds.ts holds every row to the column); the name, when unset.
   */
  short?: string;
  /** The four ranks' names: the first task done makes a company the first. */
  ranks: readonly [string, string, string, string];
}

export const GUILDS: Readonly<Record<GuildId, GuildDef>> = {
  wardens: { id: 'wardens', name: 'The Wardens', ranks: ['Recruit', 'Corporal', 'Sergeant', 'Captain'] },
  lanterns: { id: 'lanterns', name: 'The Lanterns', ranks: ['Taper', 'Adjunct', 'Reader', 'Luminary'] },
  cartographers: { id: 'cartographers', name: "The Cartographers' Guild", short: 'The Cartographers', ranks: ['Chainman', 'Surveyor', 'Mapmaker', 'Geographer'] },
  compact: { id: 'compact', name: 'The Salt Compact', ranks: ['Runner', 'Fence', 'Factor', 'Partner'] },
};

/** A guild quest's taken and done flags and a guild's rank flag: in game/keys.ts with the save's other keys. */
export { takenFlag, doneFlag, rankFlag } from '../game/keys.ts';

/** A guild quest's side of the quest log: in it from the taking, finished at the pay. */
export const guildQuestDef = (q: GuildQuest): QuestDef => ({
  id: q.id, title: q.title, start: { flag: takenFlag(q.id) }, done: { flag: doneFlag(q.id) }, entries: q.entries, goals: q.goals,
});
