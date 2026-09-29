// A sketch of the walk the Boat lacks, in shelf/walkthrough.ts's sideQuests pattern: each end, and the hoard first.
import { newWalk, see, listen } from './tools/walk.ts';
import type { Walk } from './tools/walk.ts';
import { MAP_DEFS } from './src/content/index.ts';
import { meet, heard, readText } from './src/game/people.ts';
import type { Person } from './src/game/people.ts';
import { questLog } from './src/game/quests.ts';
import { GameMap } from './src/game/map.ts';
import { ok, failureCount } from './tools/tests/lib.ts';
const f3 = MAP_DEFS.find((d) => d.id === 'downs_f3')!;
const who = (name: string): Person => f3.features!.find((f): f is Person => f.kind === 'npc' && f.name.startsWith(name))!;
const hear = (w: Walk, name: string): string => { const p = who(name); w.world.travel('downs_f3', p.x, p.y); const t = meet(p, w.party, heard(w.world, p)).text; listen(w); return t; };
const chest = (w: Walk): void => { w.world.travel('downs_f3', 1, 14); w.world.markUsed('f3_hoard_chest'); w.party.bag.push('name_boards', 'customs_chit'); listen(w); };
const page = (w: Walk) => questLog(w.world.state, w.party).find((v) => v.def.id === 'board')?.pages[0];
const reads = (w: Walk, want: string[], not: string[], how: string): void => {
  const p = page(w), ids = p?.entries.map((e) => e.id) ?? [], n = w.news.filter((x) => x === 'Quest complete: A Boat With No Name-Board.').length;
  ok(!!p?.done && p.goal === null && want.every((e) => ids.includes(e)) && !not.some((e) => ids.includes(e)) && n === 1, `${how}: done with no goal, entries ${ids.join(', ')}, said complete once (${n})`);
};
// Nobody who buys the boards stands where every way home from the hoard must pass.
const around = (shut: Person, from: [number, number], to: Person): boolean => {
  const m = new GameMap(f3), seen = new Set([from.join()]), q = [from];
  while (q.length) { const [x, y] = q.shift()!; if (x === to.x && y === to.y) return true;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = `${x + dx},${y + dy}`; if (seen.has(k) || (x + dx === shut.x && y + dy === shut.y) || m.passable(x + dx, y + dy) !== 'ok') continue; seen.add(k); q.push([x + dx, y + dy]); } }
  return false;
};
ok(around(who('Hamo'), [1, 14], who('Wat')), 'the boards go home from the hoard to Wat by a way that never steps on Hamo');
{ const w = newWalk(ok);
  ok(hear(w, 'Wat').startsWith('An old man sits') && w.news.at(-1) === 'New quest: A Boat With No Name-Board.', 'Wat begins the Boat');
  see(w, 'downs_f3:f3_hoard'); chest(w);
  ok((readText('customs_chit') ?? []).length === 2, 'the chit reads from the pack');
  const gold = w.party.gold;
  ok(hear(w, 'Wat').startsWith('Wat turns the board over') && w.party.gold === gold + 60, 'home: Wat takes the boards and pays 60');
  reads(w, ['wat', 'hoard', 'chit', 'home'], ['sold'], 'home');
  ok(hear(w, 'Hamo').startsWith('"I heard the boards went up') && hear(w, 'Wat').startsWith('"Up in the loft'), "home: Hamo has heard, and Wat's after-lines are home's"); }
{ const w = newWalk(ok);
  hear(w, 'Wat'); see(w, 'downs_f3:f3_hoard'); chest(w);
  const gold = w.party.gold;
  ok(hear(w, 'Hamo').startsWith('Hamo counts the coin') && w.party.gold === gold + 140, 'sold: Hamo takes the boards and pays 140');
  reads(w, ['wat', 'hoard', 'chit', 'sold'], ['home'], 'sold');
  ok(hear(w, 'Wat').startsWith('"You sold them."') && hear(w, 'Hamo').startsWith('"Still here.'), "sold: Wat knows, and Hamo's after-lines are the sale's"); }
{ const w = newWalk(ok);
  chest(w);
  ok(w.news.at(-1) === 'New quest: A Boat With No Name-Board.', 'the hoard first begins the Boat');
  ok(hear(w, 'Wat').startsWith('Wat turns the board over'), 'the hoard first: Wat takes the boards at the first meeting');
  reads(w, ['hoard', 'chit', 'home'], ['wat', 'sold'], 'the hoard first'); }
console.log(failureCount() ? `${failureCount()} FAILURE(S)` : 'ALL OK');
