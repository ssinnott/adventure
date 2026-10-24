// The structure's rules the suites share (#984): locks stranded, the quests' items, guardians that
// return, respawns out of range and presences at fault. The structure suite holds every map to them;
// the others take them from here.
import { MAP_DEFS, MONSTERS, QUESTS } from '../../../src/content/index.ts';
import { condFaults } from './quests.ts';
import { GameMap } from '../../../src/game/map.ts';
import type { EncounterDef, MapDef, Presence } from '../../../src/game/mapdef.ts';
import type { QuestCond, QuestDef } from '../../../src/game/quests.ts';
import { giftOf } from '../../../src/game/wilds.ts';
import { handIns } from '../../../src/game/people.ts';
import { RESPAWN } from '../../../src/game/keys.ts';

/**
 * The locks some order of spending keys leaves shut. The party floods from the start with no swimmer
 * or climber and no keys of its own, picks up the iron keys in the chests it reaches (and the ones a
 * group it reaches always drops) and opens a lock beside it with one, which the lock takes. Every
 * choice of which lock to open next is tried, a search over the sets of locks opened. A locked chest
 * (#857) is a lock the party may open and need not, with no Lockpick: a key spent on one it reaches is
 * among the choices tried, a key inside one counts only once it is opened, and a chest is never
 * itself stranded, since nothing the road needs is in one (`lockedFaults`).
 */
export function strandedLocks(def: MapDef): string[] {
  const m = new GameMap(def);
  const key = (x: number, y: number): string => `${x},${y}`;
  const keysAt = new Map<string, number>(), coffers = new Map<string, number>();
  const add = (at: Map<string, number>, x: number, y: number, n: number): void => { at.set(key(x, y), (at.get(key(x, y)) ?? 0) + n); };
  for (const f of m.features) {
    const n = (giftOf(f)?.items ?? []).filter((i) => i === 'key_iron').length;
    if (f.kind === 'chest' && f.locked) add(coffers, f.x, f.y, n);
    else if (n) add(keysAt, f.x, f.y, n);
  }
  for (const e of m.encounters) { const n = e.monsters.filter((id) => MONSTERS[id]?.drops?.some((d) => d.item === 'key_iron' && d.chance >= 1)).length; if (n) add(keysAt, e.x, e.y, n); }
  const locks: string[] = [];
  for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) if (m.at(x, y).door === 'locked') locks.push(key(x, y));
  if (!locks.length) return [];
  const stranded = new Set<string>(); const tried = new Set<string>();
  const visit = (opened: ReadonlySet<string>): void => {
    const id = [...opened].sort().join(' ');
    if (tried.has(id)) return; tried.add(id);
    const seen = new Set<string>(); const shut = new Set<string>(); const stack = [[def.start.x, def.start.y]];
    const chests: string[] = [];
    let keys = 0;
    while (stack.length) {
      const [x, y] = stack.pop()!; const k = key(x, y);
      if (seen.has(k) || shut.has(k)) continue;
      const p = m.passable(x, y);
      if (p === 'locked' && !opened.has(k)) { shut.add(k); continue; }
      if (p !== 'ok' && p !== 'locked') continue;
      seen.add(k); keys += keysAt.get(k) ?? 0;
      // A locked chest reached: its keys once opened, else a lock the party may spend a key on.
      if (coffers.has(k)) { if (opened.has(k)) keys += coffers.get(k)!; else chests.push(k); }
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (m.inBounds(x + dx, y + dy)) stack.push([x + dx, y + dy]);
    }
    const left = keys - opened.size;
    if (left <= 0 || !shut.size) { for (const l of locks) if (!opened.has(l)) stranded.add(l); return; }
    for (const l of [...shut, ...chests]) visit(new Set([...opened, l]));
  };
  visit(new Set());
  return locks.filter((l) => stranded.has(l));
}

/** The items a quest turns on: the ones an NPC takes in, and the ones a quest's condition names. */
export function questItems(): Set<string> {
  const conds = (w: QuestCond | readonly QuestCond[]): QuestCond[] => [w].flat();
  return new Set([
    ...MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => f.kind === 'npc' ? handIns(f).map((q) => q.item) : [])),
    ...QUESTS.flatMap((q): readonly QuestDef[] => q.chapters ?? [q]).flatMap((q) => [q.start, ...(q.done ? [q.done] : []), ...q.entries.map((e) => e.when), ...q.goals.map((g) => g.when)].flatMap(conds).flatMap((c) => c.item ? [c.item] : [])),
  ]);
}

/** Why a group is a guardian, if it is one: it drops a quest item (at any chance, as a respawn rolls it again) or has a `slainText`. */
export function guardian(e: EncounterDef, items: ReadonlySet<string>): string | undefined {
  const drop = e.monsters.flatMap((id) => (MONSTERS[id]?.drops ?? []).map((d) => d.item)).find((i) => items.has(i));
  return drop ? `drops ${drop}` : e.slainText ? 'has a slainText' : undefined;
}

/** The guardians on a map that come back, and the respawns out of range. */
export function returningGuardians(def: MapDef, items: ReadonlySet<string>): string[] {
  return (def.encounters ?? []).flatMap((e) => { const why = guardian(e, items); return e.respawn && why ? [`${e.id} (${why})`] : []; });
}
export function respawnsOutOfRange(def: MapDef): string[] {
  return (def.encounters ?? []).flatMap((e) => (e.respawn && (e.respawn < RESPAWN.half || e.respawn > RESPAWN.twoDays) ? [`${e.id} (${e.respawn})`] : []));
}

/**
 * What is wrong with a map's groups' times to walk: an `until` or an `after` that names nothing real
 * (or a group that respawns, which would flicker as it dies and returns), an `until` on a group that
 * never comes back anyway (save one that `leaves`, which its until takes off standing, #747), and a sky
 * asked of a group underground.
 */
export function presenceFaults(def: MapDef, maps: readonly MapDef[] = MAP_DEFS): string[] {
  const worn = (id: string, p: Presence): string[] => [
    ...(p.until ? condFaults(p.until, maps).map((f) => `${id} until: ${f}`) : []),
    ...(p.after ? condFaults(p.after, maps).map((f) => `${id} after: ${f}`) : []),
    ...(def.kind === 'dungeon' && [p.when ?? []].flat().some((h) => h.sky) ? [`${id}: a sky underground`] : []),
  ];
  return [
    ...(def.encounters ?? []).flatMap((e) => [...worn(e.id, e), ...(e.until && !e.respawn && !e.leaves ? [`${e.id}: until, but it never comes back`] : [])]),
    // A person, an event, a shrine or a fountain wears the same: gone once its until holds, there once its after does.
    ...(def.features ?? []).flatMap((f) => (f.kind === 'npc' ? worn(`${f.name.split(',')[0]} at ${f.x},${f.y}`, f) : f.kind === 'event' || f.kind === 'shrine' || f.kind === 'fountain' ? worn(f.id, f) : [])),
    // A camp's night waits on its after as they do: a rest there counts it once it holds (#730).
    ...(def.features ?? []).flatMap((f) => (f.kind === 'camp' ? (f.nights ?? []).flatMap((n) => (n.after ? condFaults(n.after, maps).map((c) => `camp at ${f.x},${f.y} night ${n.sets} after: ${c}`) : [])) : [])),
  ];
}
