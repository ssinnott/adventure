// The keys a save keeps things by (#896): the flags and the `used` ids the game writes, each spelt
// here once, and a den's `until`, which the maps read. It imports nothing that runs, only types, so
// any module may load it first, a map among them, without reaching the content index; each old home
// gives its keys on, so no other import moves (tools/tests/structure.ts loads the modules first).
import type { Feature } from './map.ts';
import type { Den } from './dens.ts';
import type { QuestCond } from './quests.ts';
import type { GuildId } from '../content/guilds.ts';

/** The brood's `until`: the den burnt, by its map as written and its id. */
export const denBurnt = (map: string, id: string): QuestCond => ({ seen: `${map}:${id}` });

/** The key a den's look is kept by in `used` once said. Never ':', which `seen` splits on. */
export const lookKey = (den: Den): string => `${den.id}.seen`;

/** The id a feature is kept by in `used` once spent, or undefined for one that is never spent. */
export function spentId(f: Feature): string | undefined {
  switch (f.kind) {
    case 'chest': case 'cairn': case 'shrine': case 'fountain': case 'statue': case 'den': return f.id;
    case 'event': return f.once ? f.id : undefined;
    default: return undefined;
  }
}

/** The id an inscription (a sign with a reading, game/inscriptions.ts) is kept read by in its map's `used`; none for any other feature. */
export const readId = (f: Feature): string | undefined => (f.kind === 'sign' && f.read !== undefined ? f.id : undefined);

/** The quest a seeking quest is for: its id, by slot and prestige. */
export const seekId = (who: number, prestige: number): string => `seek:${who}:${prestige}`;

/** The flag a party holds once it has paid a spell hall's fee to study: made from the hall's name, so renaming a hall forgets who paid. */
export const guildFlag = (hall: string): string => `guild_${hall}`;

/** The flag that keeps the glove's line said, once a game (game/combat.ts's `GLOVE_LINE`). */
export const GLOVE_FLAG = 'glove_seen';

/** The flag set when a company takes a guild quest, as a person's quests are: `q_<id>`. */
export const takenFlag = (quest: string): string => `q_${quest}`;
/** The flag set when a guild quest is paid: `q_<id>_done`. */
export const doneFlag = (quest: string): string => `q_${quest}_done`;
/** The flag that keeps the rank a company has reached in a guild, as its number: `rank_<guild>`. */
export const rankFlag = (guild: GuildId): string => `rank_${guild}`;
