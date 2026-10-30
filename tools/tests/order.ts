// The company's order (#1066, DESIGN §11): on the sheet X asks with whom the member changes places,
// a digit or the arrows round the company and Space choose, and Esc or X again ask no more. Driven
// by the keys in a Game on Harrow: two members across the rows and two of one row, the same member
// twice, the first and the last by the arrows round, a cancel, a member dead and one unconscious,
// the order after a save and a load, the sheet not offered in a fight and the pilot, which never
// asks. Each swap is held by `faults`, which names what a swap may get wrong; then each mutant of a
// swap fails by the name it earns.
import { Game } from '../../src/app/game.ts';
import { Pilot } from '../../src/app/pilot/pilot.ts';
import { SheetScreen, SHEET_HINT, SWAP_HINT } from '../../src/ui/screens.ts';
import { CombatScreen } from '../../src/ui/combat.ts';
import { LAYOUT } from '../../src/ui/frame.ts';
import type { Action } from '../../src/ui/actions.ts';
import { startCombat, FRONT_ROW } from '../../src/game/combat.ts';
import { changePlaces } from '../../src/game/party.ts';
import { SAVE_KEY, SAVE_VERSION } from '../../src/game/save.ts';
import type { Store } from '../../src/game/save.ts';
import { measureText } from '../../src/lib/engine/text.ts';
import { TABLES } from '../../src/content/index.ts';
import { headlessGame, headlessLoad, drive } from '../kit/headless.ts';
import { ok } from './lib.ts';

/**
 * A game as a swap is held to it: the names in order, each member's whole record (stats, points,
 * conditions, pack and what is worn), the company's own fields (purse, food, bag, flags), the
 * world (its clock, the square and the facing) and the member chosen, whom the sheet opens on.
 */
interface Seen {
  names: string[];
  records: string[];
  company: string;
  world: string;
  selected: number;
}

function seen(g: Game): Seen {
  const { members, ...company } = g.party;
  return { names: members.map((m) => m.name), records: members.map((m) => JSON.stringify(m)),
    company: JSON.stringify(company), world: JSON.stringify(g.world.state), selected: g.selected };
}

/** What a swap of places `i` and `j` got wrong, from `was` to `now`, each by its name. */
function faults(was: Seen, now: Seen, i: number, j: number): string[] {
  const swapped = <T>(xs: readonly T[]): T[] => {
    const ys = [...xs];
    [ys[i], ys[j]] = [ys[j], ys[i]];
    return ys;
  };
  const sorted = (xs: readonly string[]): string => [...xs].sort().join();
  const f: string[] = [];
  if (sorted(now.names) !== sorted(was.names)) f.push('a member lost');
  else if (now.names.join() !== swapped(was.names).join()) f.push('the wrong places');
  else if (now.records.join('\n') !== swapped(was.records).join('\n')) {
    f.push('a stat parted from its member');
  }
  if (now.company !== was.company) f.push('the company changed');
  if (now.world !== was.world) f.push('time passed');
  if (now.names[now.selected] !== was.names[was.selected]) f.push('the chosen member changed');
  return f;
}

const sheet = (g: Game): SheetScreen | null => (g.top instanceof SheetScreen ? g.top : null);
const names = (g: Game): string => g.party.members.map((m) => m.name).join(', ');

/** A swap driven by keys: its faults as a swap of two places, the lines said, the game before. */
interface Swap { f: string[]; said: string; was: Seen }
function swapBy(g: Game, keys: readonly Action[], i: number, j: number): Swap {
  const was = seen(g), from = g.said;
  drive(g, keys);
  const said = g.log.slice(g.log.length - (g.said - from)).join(' / ');
  return { f: faults(was, seen(g), i, j), said, was };
}
/** A swap's faults, or the lines it said where it has none. */
const why = (s: Swap): string => s.f.join(', ') || s.said;

/** The lines a true swap of places `i` and `j` says: across the rows, who stands in which. */
function lines(was: Seen, i: number, j: number): string {
  const n = was.names;
  if (i === j) return `${n[i]} stays put.`;
  const said = `${n[i]} and ${n[j]} change places.`;
  if ((i < FRONT_ROW) === (j < FRONT_ROW)) return said;
  const [front, back] = j < FRONT_ROW ? [n[i], n[j]] : [n[j], n[i]];
  return `${said} / ${front} takes the front row, ${back} the back.`;
}

/** The member chosen follows their member, as the sheet's swap has it. */
function follow(g: Game, i: number, j: number): void {
  if (g.selected === i || g.selected === j) g.selected = i + j - g.selected;
}

/** Each mutant of a swap of places `i` and `j`: what it gets wrong, its fault, the swap. */
type Mutant = readonly [string, string, (g: Game, i: number, j: number) => void];
const MUTANTS: readonly Mutant[] = [
  ['the swap moving a stat with the place, the hit points left where they stood',
    'a stat parted from its member', (g, i, j) => {
      changePlaces(g.party, i, j);
      follow(g, i, j);
      const [a, b] = [g.party.members[i], g.party.members[j]];
      [a.hp, b.hp] = [b.hp, a.hp];
    }],
  ['a lost member, the one at the first place written over', 'a member lost', (g, i, j) => {
    g.party.members[i] = g.party.members[j];
    follow(g, i, j);
  }],
  ['the leader changed, the member chosen left on the place', 'the chosen member changed',
    (g, i, j) => { changePlaces(g.party, i, j); }],
  ['a wrap off by one, the mark round five places, not six', 'the wrong places', (g, i) => {
    const n = g.party.members.length, k = (n - 1 + i - 1) % (n - 1);
    changePlaces(g.party, i, k);
    follow(g, i, k);
  }],
];

export function order(): void {
  const g = headlessGame(4), six = names(g);
  ok(new Set(g.party.members.map((m) => m.name)).size === 6 && g.selected === 0,
    `the premade six have six names, the first chosen (${six})`);
  const { x, y } = LAYOUT.hint, edge = [SHEET_HINT, SWAP_HINT].map((t) => x - measureText(t));
  ok(edge.every((e) => e >= 340), `the sheet's keys, and the swap's in their place, end right of `
    + `the item list's edge at 340 (from ${edge.join(' and ')}, at ${y})`);

  // Two members across the rows: the second's sheet, X, and 5.
  drive(g, ['inventory', 'n2', 'swap']);
  ok(sheet(g)?.swapping === 1 && sheet(g)?.shown === 1,
    `X on the second's sheet asks with whom, the mark on their own card (${sheet(g)?.swapping})`);
  const two = swapBy(g, ['n5'], 1, 4);
  ok(!two.f.length && sheet(g)?.swapping === null && sheet(g)?.shown === 4 && g.selected === 4
    && two.said === lines(two.was, 1, 4), `then 5: the second and the fifth change places, all `
    + `else as it was, the sheet and the choice on its member at the fifth place (${why(two)})`);
  // The same member twice: X and their own digit.
  const same = swapBy(g, ['swap', 'n5'], 4, 4);
  ok(!same.f.length && sheet(g)?.swapping === null && same.said === lines(same.was, 4, 4),
    `X and the member's own digit: nobody moves (${why(same)})`);
  // The first and the last, by the arrows round: from the first, left is the last.
  drive(g, ['n1', 'swap', 'left']);
  ok(sheet(g)?.swapping === 5,
    `on the first's sheet, X and left: the mark goes round to the last (${sheet(g)?.swapping})`);
  const ends = swapBy(g, ['interact'], 0, 5);
  const there = sheet(g)?.shown === 5 && g.selected === 5;
  ok(!ends.f.length && there && ends.said === lines(ends.was, 0, 5),
    `and Space: the first and the last change places (${why(ends)})`);
  // Two of the back row: one line.
  drive(g, ['n4']);
  const back = swapBy(g, ['swap', 'right', 'interact'], 3, 4);
  ok(!back.f.length && back.said === lines(back.was, 3, 4),
    `the fourth's sheet, X, right and Space: two of the back row (${why(back)})`);
  // A cancel: Esc, or X again, asks no more and leaves the sheet open; the next Esc closes it.
  const esc = swapBy(g, ['swap', 'right', 'right', 'cancel'], 4, 4);
  const again = swapBy(g, ['swap', 'left', 'swap'], 4, 4);
  ok(!esc.f.length && !again.f.length && !esc.said && !again.said && sheet(g)?.swapping === null
    && sheet(g)?.shown === 4, `X, the mark moved, then Esc or X again: nobody moves and the sheet `
    + `stays (${[...esc.f, ...again.f].join(', ') || names(g)})`);
  drive(g, ['cancel']);
  const closed = g.top.constructor.name;
  ok(closed === 'ExploreScreen', `and Esc then closes the sheet (${closed})`);

  // A member dead and one unconscious: moved as any.
  const [, , third, , , sixth] = g.party.members;
  third.conditions = ['dead']; third.hp = -10; sixth.conditions = ['unconscious']; sixth.hp = 0;
  drive(g, ['n3']);
  const down = swapBy(g, ['swap', 'n6'], 2, 5);
  ok(!down.f.length && g.party.members[5] === third && g.party.members[2] === sixth,
    `the dead third and the unconscious sixth change places, each as they were (${why(down)})`);
  drive(g, ['cancel']);

  // The order after a save and a load: the members' array, the save's version as it was.
  const kept = new Map<string, string>();
  const store: Store = { getItem: (k) => kept.get(k) ?? null,
    setItem: (k, v) => { kept.set(k, v); }, removeItem: (k) => { kept.delete(k); } };
  const s = new Game(TABLES, store);
  s.newGame(4);
  drive(s, ['inventory', 'swap', 'n4', 'cancel', 'save']);
  const text = kept.get(SAVE_KEY) ?? '', loaded = text ? headlessLoad(text) : null;
  ok(!!loaded && names(loaded) === names(s) && names(s) !== six
    && JSON.stringify(loaded.party.members) === JSON.stringify(s.party.members)
    && JSON.parse(text).version === SAVE_VERSION && SAVE_VERSION === 6, `the first and the fourth `
    + `swapped, saved and loaded: the order is the save's, each member whole, at version `
    + `${SAVE_VERSION} (${loaded ? names(loaded) : 'no save'})`);

  // In a fight the sheet is not offered: I and X there open nothing and move nobody.
  const f = headlessGame(4);
  const rats = startCombat(TABLES, f.party, [{ id: 'g', monsters: ['rat', 'wolf'] }], f.rng);
  f.push(new CombatScreen(rats, ['g']));
  drive(f, ['inventory', 'swap']);
  const sheets = f.screens.filter((t) => t instanceof SheetScreen).length;
  ok(f.top instanceof CombatScreen && !sheets && names(f) === six,
    `in a fight I and X open no sheet and move nobody (${f.top.constructor.name}, ${sheets})`);

  // The pilot never asks: its keys over a new game's first 1,500 ticks hold no X; the order stands.
  const p = headlessGame(4), pilot = new Pilot({ instant: true }), keys: (Action | null)[] = [];
  const next = pilot.next.bind(pilot);
  pilot.next = (h) => {
    const a = next(h);
    keys.push(a);
    return a;
  };
  p.pilot = pilot;
  pilot.toggle(p);
  drive(p, [], 1500);
  const opened = keys.filter((a) => a === 'inventory').length;
  const pressed = keys.filter(Boolean).length;
  ok(!keys.includes('swap') && names(p) === six, `the pilot, handed a new game for 1,500 ticks, `
    + `never presses X and leaves the order (${opened} sheets opened, ${pressed} keys)`);

  // Each mutant of a swap of the first and the last, as the arrows choose them, fails by its name.
  for (const [what, name, swap] of MUTANTS) {
    const m = headlessGame(4), was = seen(m);
    swap(m, 0, 5);
    const got = faults(was, seen(m), 0, 5);
    ok(got.includes(name), `the mutant ${what}: fails as "${name}" (${got.join(', ')})`);
  }
}
