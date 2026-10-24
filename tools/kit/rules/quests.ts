// The quests' rules the suites share (#984): the flags a feature sets and the faults of a quest's
// condition. The quests suite holds every map to them; the others take them from here.
import { MAP_DEFS, ITEMS, GUILD_QUESTS } from '../../../src/content/index.ts';
import { takenFlag, doneFlag } from '../../../src/content/guilds.ts';
import { personFlags, groupFlags } from '../../../src/game/people.ts';
import type { QuestCond, When } from '../../../src/game/quests.ts';
import type { Feature, MapDef } from '../../../src/game/map.ts';
import { spentId } from '../../../src/game/wilds.ts';
import { readId } from '../../../src/game/inscriptions.ts';
import { areaRows, gather } from '../checks.ts';

/**
 * Flags a condition may read before anything sets them, each owed by its area to the issue that will
 * set it (`Owes.unset`): reported as that issue's while nothing does, and failed once something does,
 * so its row is dropped; a flag owed twice is refused.
 */
export const unset = gather(areaRows((c) => c.owes?.unset));

/** The flags a feature sets: a person's, met, an event's, said (#156), an inn's, stayed at and a camp's, rested at (#730). */
export const featureFlags = (f: Feature): readonly string[] => f.kind === 'npc' ? personFlags(f) : f.kind === 'event' ? [f.sets ?? []].flat() : f.kind === 'inn' ? f.nights ?? [] : f.kind === 'camp' ? (f.nights ?? []).map((n) => n.sets) : [];

/**
 * What in a condition names nothing real: a flag no NPC, event or guild quest sets (nor one an area owes), an item, something spent once and kept
 * by its id (a once-only event, a chest, a cairn, a shrine, a fountain or a statue, or an inscription read, #538), a guardian that
 * never respawns (one that does comes back to life, and what turns on its death with it), a map. The
 * maps are the game's unless given.
 */
export function condFaults(w: When, maps: readonly MapDef[] = MAP_DEFS): string[] {
  // The flags people, groups (by their falls and questions) and events set, and the guild quests' own (a hall sets them: game/guilds.ts).
  const npcFlags = new Set([
    ...maps.flatMap((d) => (d.features ?? []).flatMap(featureFlags)),
    ...maps.flatMap((d) => (d.encounters ?? []).flatMap(groupFlags)),
    ...GUILD_QUESTS.flatMap((q) => [takenFlag(q.id), doneFlag(q.id)]),
  ]);
  const onMap = (ref: string): { map: MapDef | undefined; id: string } => { const [m, id] = ref.split(':'); return { map: maps.find((d) => d.id === m), id }; };
  const bad: string[] = [];
  for (const c of [w].flat() as QuestCond[]) {
    for (const f of [c.flag ?? []].flat()) if (!npcFlags.has(f) && !Object.hasOwn(unset.all, f)) bad.push(`flag ${f}`);
    if (c.item !== undefined && !(c.item in ITEMS)) bad.push(`item ${c.item}`);
    if (c.seen !== undefined) { const { map, id } = onMap(c.seen); if (!map?.features?.some((f) => id !== undefined && (spentId(f) === id || readId(f) === id))) bad.push(`seen ${c.seen}`); }
    for (const ref of [c.slain ?? []].flat()) { const { map, id } = onMap(ref); const e = map?.encounters?.find((x) => x.id === id); if (!e || e.respawn) bad.push(`slain ${ref}`); }
    if (c.visited !== undefined && !maps.some((d) => d.id === c.visited)) bad.push(`visited ${c.visited}`);
  }
  return bad;
}
