// The maps' structure, the rules any content has to keep: no iron key behind its own lock, however
// the party spends its keys; no guardian that comes back (a group that drops a quest item or says
// something when it dies, beside the quests suite's check for groups a quest names); every respawn
// within 720 to 2,880 minutes; every outdoor map one box of the atlas's grid. Each is first run on the content as it is, then on a map broken on
// purpose, to show it can fail.
import { MAP_DEFS, MONSTERS, QUESTS, ATLAS } from '../../src/content/index.ts';
import { gridFaults } from '../../src/game/atlas.ts';
import type { Atlas, AtlasZone } from '../../src/game/atlas.ts';
import { GameMap } from '../../src/game/map.ts';
import type { EncounterDef, MapDef } from '../../src/game/map.ts';
import type { QuestCond } from '../../src/game/quests.ts';
import { SOUTH } from '../../src/game/types.ts';
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
  for (const f of m.features) if (f.kind === 'chest') add(f.x, f.y, f.items.filter((i) => i === 'key_iron').length);
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
  }

  // Every outdoor map is one box of the grid, laid once: 32 by 32, or a box cut to the world at its edge.
  const grid = gridFaults(ATLAS, MAP_DEFS);
  for (const def of MAP_DEFS.filter((d) => d.kind === 'outdoor')) {
    const mine = grid.filter((f) => f.startsWith(`map ${def.id} `));
    ok(!mine.length, `${def.id}: one box of the atlas's grid, laid once${list(mine)}`);
  }
  { // Off the grid on purpose: the Foreland a square east, a small map at a box's corner, a map laid
    // twice; and a map the height of row 1, which the world's edge cuts, on it.
    const moved = (id: string, at: readonly [number, number], extra: AtlasZone[] = []): Atlas => ({ ...ATLAS, zones: [...ATLAS.zones.map((z) => (z.maps?.some((m) => m.map === id) ? { ...z, maps: z.maps.map((m) => (m.map === id ? { map: id, at } : m)) } : z)), ...extra] });
    const fixture = (w: number, h: number): MapDef => ({ id: 'fixture_box', name: 'Box fixture', kind: 'outdoor', start: { x: 1, y: 1, facing: SOUTH }, rows: Array(h).fill(','.repeat(w)) });
    const laid = (w: number, h: number, at: readonly [number, number]): string[] => gridFaults({ ...ATLAS, zones: [...ATLAS.zones, { id: 'fixture_box', name: 'Box fixture', area: 'shelf', maps: [{ map: 'fixture_box', at }] }] }, [...MAP_DEFS, fixture(w, h)]);
    const east = gridFaults(moved('shelf', [201, 30]), MAP_DEFS);
    ok(east.length === 1 && /shelf/.test(east[0]) && /G2/.test(east[0]), `the Foreland's map laid a square east, at 201,30, fails, naming it and G2${list(east)}`);
    const small = laid(16, 16, [168, 30]);
    ok(small.length === 1 && /F2/.test(small[0]), `a 16 by 16 map at F2's corner fails${list(small)}`);
    const edge = laid(32, 30, [72, 0]);
    ok(!edge.length, `a 32 by 30 map at C1, a box of row 1, passes${list(edge)}`);
    const twice = gridFaults(moved('shelf', [200, 30], [{ id: 'fixture_twice', name: 'Twice', area: 'shelf', maps: [{ map: 'shelf', at: [168, 30] }] }]), MAP_DEFS);
    ok(twice.length === 1 && /laid twice/.test(twice[0]), `a map two zones lay fails${list(twice)}`);
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
  { // Respawns at the edges of the range and just past them.
    const at = (respawn: number | undefined): string[] => respawnsOutOfRange(group(map('mill'), 'm_rats', { respawn }));
    ok([719, 2881].every((r) => at(r).length === 1), 'a respawn of 719 or 2,881 minutes is out of range');
    ok([0, undefined, 720, 2880].every((r) => !at(r).length), 'none, 720 and 2,880 minutes are in range');
  }
}
