// The keys a save keeps things by (#896): the flags and the `used` ids the game writes, each spelt
// here once, and a den's `until`, which the maps read. It imports nothing that runs, only types, so
// any module may load it first, a map among them, without reaching the content index; each old home
// gives its keys on, so no other import moves (tools/tests/structure.ts loads the modules first).
import type { Feature } from './mapdef.ts';
import type { Den } from './dens.ts';
import type { QuestCond } from './quests.ts';
import type { GuildId } from '../content/guilds.ts';
import type { MapId, Flag } from '../content/index.ts';

/**
 * How soon a group comes back once beaten, in minutes (`EncounterDef.respawn`): half a day, a day
 * (`MINUTES_PER_DAY`) or two. The maps name one; tools/tests/structure.ts holds every respawn to the
 * first and the last (#968).
 */
export const RESPAWN = { half: 720, day: 1440, twoDays: 2880 } as const;

/**
 * A thing on a map, kept in the save by its map's id and its own (`QuestCond.seen` and `slain`): the
 * map's is one the areas list (#994), its own the quests suite holds (tools/tests/quests.ts).
 */
export type MapKey = `${MapId}:${string}`;
/** The key of a thing on a map, for a `seen` or `slain` the content builds. Never ':' in the map's id, which `seen` splits on. */
export const mapKey = (map: MapId, id: string): MapKey => `${map}:${id}`;

/** The brood's `until`: the den burnt, by its map as written and its id. */
export const denBurnt = (map: MapId, id: string): QuestCond => ({ seen: mapKey(map, id) });

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

// The flags the code makes (#995), each declared as a map's are: the glove's and the ranks' by the whole
// (content/flags.ts), the rank's typed from GuildId, so a guild added fails the typecheck until its rank
// is declared. A hall's fee and a guild quest's two flags are made from a string of the content's, a
// hall's name or a quest's id, so they are `Flag` by assertion here, and the shipped suite holds each to
// its area's declaration by name (tools/tests/shipped.ts).

/** The flag a party holds once it has paid a spell hall's fee to study: made from the hall's name, so renaming a hall forgets who paid. */
export const guildFlag = (hall: string): Flag => `guild_${hall}` as Flag;

/** The flag that keeps the glove's line said, once a game (game/combat.ts's `GLOVE_LINE`). */
export const GLOVE_FLAG: Flag = 'glove_seen';

/** The flag set when a company takes a guild quest, as a person's quests are: `q_<id>`. */
export const takenFlag = (quest: string): Flag => `q_${quest}` as Flag;
/** The flag set when a guild quest is paid: `q_<id>_done`. */
export const doneFlag = (quest: string): Flag => `q_${quest}_done` as Flag;
/** The flag that keeps the rank a company has reached in a guild, as its number: `rank_<guild>`. */
export const rankFlag = (guild: GuildId): Flag => `rank_${guild}`;
