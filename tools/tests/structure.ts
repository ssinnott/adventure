// The maps' structure, the rules any content has to keep: no iron key behind its own lock, however
// the party spends its keys; no guardian that comes back (a group that drops a quest item or says
// something when it dies, beside the quests suite's check for groups a quest names); every respawn
// within 720 to 2,880 minutes; a group's `until` and `after` naming something real, and no sky
// underground; Thornmark's Rift stopping with the tear. Each is first run on the content as it is,
// then on a map broken on purpose, to show it can fail.
import { AREAS, MAP_DEFS, MONSTERS, QUESTS } from '../../src/content/index.ts';
import { TEAR_CLOSED } from '../../src/content/areas/thornmark/maps/grove2.ts';
import { condFaults } from './quests.ts';
import { GameMap } from '../../src/game/map.ts';
import type { EncounterDef, MapDef } from '../../src/game/map.ts';
import type { QuestCond } from '../../src/game/quests.ts';
import { SOUTH } from '../../src/game/types.ts';
import { giftOf } from '../../src/game/wilds.ts';
import { ok } from './lib.ts';

/** Respawns in the range in use, in minutes, both ends included. */
export const RESPAWN = [720, 2880] as const;

/**
 * The locks some order of spending keys leaves shut. The party floods from the start with no swimmer
 * or climber and no keys of its own, picks up the iron keys in the chests it reaches (and the ones a
 * group it reaches always drops) and opens a lock beside it with one, which the lock takes. Every
 * choice of which lock to open next is tried, a search over the sets of locks opened.
 */
export function strandedLocks(def: MapDef): string[] {
  const m = new GameMap(def);
  const key = (x: number, y: number): string => `${x},${y}`;
  const keysAt = new Map<string, number>();
  const add = (x: number, y: number, n: number): void => { if (n) keysAt.set(key(x, y), (keysAt.get(key(x, y)) ?? 0) + n); };
  for (const f of m.features) add(f.x, f.y, (giftOf(f)?.items ?? []).filter((i) => i === 'key_iron').length);
  for (const e of m.encounters) add(e.x, e.y, e.monsters.filter((id) => MONSTERS[id]?.drops?.some((d) => d.item === 'key_iron' && d.chance >= 1)).length);
  const locks: string[] = [];
  for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) if (m.at(x, y).door === 'locked') locks.push(key(x, y));
  if (!locks.length) return [];
  const stranded = new Set<string>(); const tried = new Set<string>();
  const visit = (opened: ReadonlySet<string>): void => {
    const id = [...opened].sort().join(' ');
    if (tried.has(id)) return; tried.add(id);
    const seen = new Set<string>(); const shut = new Set<string>(); const stack = [[def.start.x, def.start.y]];
    let keys = 0;
    while (stack.length) {
      const [x, y] = stack.pop()!; const k = key(x, y);
      if (seen.has(k) || shut.has(k)) continue;
      const p = m.passable(x, y);
      if (p === 'locked' && !opened.has(k)) { shut.add(k); continue; }
      if (p !== 'ok' && p !== 'locked') continue;
      seen.add(k); keys += keysAt.get(k) ?? 0;
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) if (m.inBounds(x + dx, y + dy)) stack.push([x + dx, y + dy]);
    }
    const left = keys - opened.size;
    if (left <= 0 || !shut.size) { for (const l of locks) if (!opened.has(l)) stranded.add(l); return; }
    for (const l of shut) visit(new Set([...opened, l]));
  };
  visit(new Set());
  return locks.filter((l) => stranded.has(l));
}

/** The items a quest turns on: the ones an NPC takes in, and the ones a quest's condition names. */
export function questItems(): Set<string> {
  const conds = (w: QuestCond | readonly QuestCond[]): QuestCond[] => [w].flat();
  return new Set([
    ...MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => f.kind === 'npc' && f.quest ? [f.quest.item] : [])),
    ...QUESTS.flatMap((q) => [q.start, ...(q.done ? [q.done] : []), ...q.entries.map((e) => e.when), ...q.goals.map((g) => g.when)].flatMap(conds).flatMap((c) => c.item ? [c.item] : [])),
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
  return (def.encounters ?? []).flatMap((e) => (e.respawn && (e.respawn < RESPAWN[0] || e.respawn > RESPAWN[1]) ? [`${e.id} (${e.respawn})`] : []));
}

/**
 * What is wrong with a map's groups' times to walk: an `until` or an `after` that names nothing real
 * (or a group that respawns, which would flicker as it dies and returns), an `until` on a group that
 * never comes back anyway, and a sky asked of a group underground.
 */
export function presenceFaults(def: MapDef, maps: readonly MapDef[] = MAP_DEFS): string[] {
  return (def.encounters ?? []).flatMap((e) => [
    ...(e.until ? condFaults(e.until, maps).map((f) => `${e.id} until: ${f}`) : []),
    ...(e.after ? condFaults(e.after, maps).map((f) => `${e.id} after: ${f}`) : []),
    ...(e.until && !e.respawn ? [`${e.id}: until, but it never comes back`] : []),
    ...(def.kind === 'dungeon' && [e.when ?? []].flat().some((h) => h.sky) ? [`${e.id}: a sky underground`] : []),
  ]);
}

/** The respawning groups of a map with a Rift monster in them that do not stop coming back when the tear closes. */
export function riftStillComing(def: MapDef): string[] {
  return (def.encounters ?? []).filter((e) => e.respawn && e.monsters.some((id) => MONSTERS[id]?.kind === 'rift') && JSON.stringify(e.until) !== JSON.stringify(TEAR_CLOSED)).map((e) => e.id);
}

export function structure(): void {
  const items = questItems();
  const list = (xs: string[]): string => (xs.length ? ' -> ' + xs.join(', ') : '');
  for (const def of MAP_DEFS) {
    const stranded = strandedLocks(def);
    ok(!stranded.length, `${def.id}: every locked door opens with a key found before it, in every order the keys are spent${list(stranded)}`);
    const back = returningGuardians(def, items);
    ok(!back.length, `${def.id}: no guardian respawns (a group that drops a quest item or has a slainText)${list(back)}`);
    const out = respawnsOutOfRange(def);
    ok(!out.length, `${def.id}: every respawn is ${RESPAWN[0]} to ${RESPAWN[1]} minutes${list(out)}`);
    const when = presenceFaults(def);
    ok(!when.length, `${def.id}: every group's until and after names something real, and none asks for a sky underground${list(when)}`);
  }
  const thornmark = AREAS.find((a) => a.id === 'thornmark')!.maps;
  for (const def of thornmark) {
    const rift = riftStillComing(def);
    ok(!rift.length, `${def.id}: every Rift group that comes back stops once the Warden of the Cut is dead${list(rift)}`);
  }

  // Broken on purpose, each a copy of a real map, kept out of MAP_DEFS.
  const map = (id: string): MapDef => MAP_DEFS.find((d) => d.id === id)!;
  const moveChest = (d: MapDef, id: string, x: number, y: number): MapDef => ({ ...d, features: (d.features ?? []).map((f) => (f.kind === 'chest' && f.id === id ? { ...f, x, y } : f)) });
  const group = (d: MapDef, id: string, change: Partial<EncounterDef>): MapDef => ({ ...d, encounters: (d.encounters ?? []).map((e) => (e.id === id ? { ...e, ...change } : e)) });
  { // The key behind its own lock, which a flood with a key in hand walks straight past.
    const behind = moveChest(map('grove2'), 'g2_key', 8, 8);
    ok(strandedLocks(behind).join() === '7,9', 'grove2 with its key moved behind its lock at 7,9: the lock is left shut');
    const gw1 = moveChest(map('greywater1'), 'gw1_key', 13, 13);
    ok(strandedLocks(gw1).join() === '13,8', 'greywater1 with its key moved behind its lock at 13,8: the lock is left shut');
  }
  { // Two locks and one key before them, the second key behind the first lock: the right door first
    // opens both, the wrong one strands the other.
    const d: MapDef = {
      id: 'orders', name: 'Orders', kind: 'dungeon', start: { x: 1, y: 1, facing: SOUTH },
      rows: ['#######', '#....L#', '#.#####', '#L#...#', '#.#.###', '#.....#', '#######'],
      features: [{ kind: 'chest', x: 1, y: 1, id: 'k1', gold: 0, items: ['key_iron'] }, { kind: 'chest', x: 3, y: 3, id: 'k2', gold: 0, items: ['key_iron'] }],
    };
    ok(strandedLocks(d).join() === '1,3', 'two locks, one key before them and one behind the first: spending the key on the second strands the first');
    const both: MapDef = { ...d, features: [...d.features!, { kind: 'chest', x: 2, y: 1, id: 'k3', gold: 0, items: ['key_iron'] }] };
    ok(!strandedLocks(both).length, 'the same with a second key before them: no order strands a lock');
  }
  { // A guardian brought back: by its drop, and by its slainText alone.
    const hand = returningGuardians(group(map('grove2'), 'g2_hand', { respawn: 1440 }), items);
    ok(hand.join() === 'g2_hand (drops ashen_chisel)', `grove2's Hand of Ash given a respawn: it drops a quest item, and no quest names it${list(hand)}`);
    const cult = returningGuardians(group(map('mill'), 'm_cult1', { respawn: 1440, slainText: 'The chanting stops.' }), items);
    ok(cult.join() === 'm_cult1 (has a slainText)', `the mill's cultists given a slainText and a respawn${list(cult)}`);
  }
  { // Times to walk that name nothing, or that cannot mean anything.
    const faults = (d: MapDef): string => presenceFaults(d).join();
    ok(faults(group(map('mill'), 'm_rats', { respawn: 1440, until: { slain: 'shelf:road_rats' } })) === 'm_rats until: slain shelf:road_rats', 'an until naming a group that respawns is refused');
    ok(faults(group(map('mill'), 'm_rats', { respawn: 1440, after: { flag: 'no_such_flag' }, until: { slain: 'grove2:no_such_group' } })) === 'm_rats until: slain grove2:no_such_group,m_rats after: flag no_such_flag', 'and one naming nothing real, and an after');
    ok(faults(group(map('mill'), 'm_rats', { respawn: undefined, until: TEAR_CLOSED })) === 'm_rats: until, but it never comes back', 'an until on a group that never comes back is refused');
    ok(faults(group(map('mill'), 'm_rats', { when: [{ hours: 'night' }, { sky: 'fog' }] })) === 'm_rats: a sky underground', 'and fog asked of a group underground; night is not');
    const tm = map('thornmark');
    ok(riftStillComing(group(tm, 'tm_hounds', { until: undefined })).join() === 'tm_hounds', 'thornmark with tm_hounds coming back past the tear is refused');
    ok(!riftStillComing(group(tm, 'tm_wolves1', { until: undefined })).length, 'and its wolves, no Rift, need no until');
  }
  { // Respawns at the edges of the range and just past them.
    const at = (respawn: number | undefined): string[] => respawnsOutOfRange(group(map('mill'), 'm_rats', { respawn }));
    ok([719, 2881].every((r) => at(r).length === 1), 'a respawn of 719 or 2,881 minutes is out of range');
    ok([0, undefined, 720, 2880].every((r) => !at(r).length), 'none, 720 and 2,880 minutes are in range');
  }
}
