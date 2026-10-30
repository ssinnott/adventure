// The menus' cursor (#1031, DESIGN §11): the one list cursor of src/ui/menu.ts as the screens ask it.
// First its rule alone (the wrap, a barred row, the digits, the cursor kept and held to the rows there
// are now, the scroll); then the menus as a player meets them in a Game on Harrow: a hall's first menu,
// a trainer's, a shop's Buy and Sell lists, a hall's skills and who would learn one, each chosen twice
// and the cursor read after each choice; the other menus a choice opens again (a hall's offers, the
// Expert's line and members, a Master's, a spell hall's spells and the Buy list after "Not enough
// gold"); a barred row and the digit past the last row; the spell picker's casters, whose digit is
// the member's place; and in a fight the commands by a digit and the members' list, where a digit
// moves and Space chooses.
import type { Action } from '../../src/ui/actions.ts';
import type { Game } from '../../src/app/game.ts';
import type { Feature } from '../../src/game/mapdef.ts';
import { ListMenu } from '../../src/ui/menu.ts';
import { ChoiceScreen, SpellScreen, masterMenu, tierMenu } from '../../src/ui/screens.ts';
import { CombatScreen } from '../../src/ui/combat.ts';
import { levelUp, xpForLevel } from '../../src/game/party.ts';
import { TIER_PRICES } from '../../src/game/mastery.ts';
import { MAP_DEFS } from '../../src/content/index.ts';
import { ok, fxFlag } from './lib.ts';
import { headlessGame, drive } from '../kit/headless.ts';

export function menus(): void {
  rule();
  hall();
  trainer();
  shop();
  skills();
  more();
  casters();
  fight();
}

/** A ListMenu's rule alone: what each key does to a list of rows. */
function rule(): void {
  const m = new ListMenu(), seen: number[] = [];
  for (const a of ['up', 'up', 'down', 'down', 'down'] as Action[]) { m.press(a, { n: 4 }); seen.push(m.sel); }
  ok(seen.join() === '3,2,3,0,1', `up from the first of four rows is the last and down from the last the first (row 0, then ${seen.join(', ')})`);
  const b = new ListMenu(), barred = (r: number): boolean => r === 1;
  const pressed = (['down', 'interact', 'n2', 'n3'] as Action[]).map((a) => `${a} ${String(b.press(a, { n: 3, barred, digits: 'act' }))} ${b.sel}`);
  ok(pressed.join(' / ') === 'down moved 1 / interact null 1 / n2 moved 1 / n3 chosen 2',
    `the cursor stands on a barred row, and neither Space nor its digit chooses it; the next row's digit does (${pressed.join(' / ')})`);
  const d = new ListMenu();
  const digits = ([['n3', 'act'], ['n5', 'act'], ['n2', undefined], ['n2', 'move'], ['n0', 'act']] as const).map(([a, how]) => `${a} ${String(d.press(a, { n: 4, digits: how }))} ${d.sel}`);
  ok(digits.join(' / ') === 'n3 chosen 2 / n5 null 2 / n2 null 2 / n2 moved 1 / n0 null 1',
    `a digit names the row numbered so: chosen where the list acts by it, moved to where it moves, nothing past the last row or where digits are not the list's (${digits.join(' / ')})`);
  const c = new ListMenu(), place = (r: number): number => [2, 5, 6][r];
  const numbered = (['n5', 'n1', 'n7'] as Action[]).map((a) => `${a} ${String(c.press(a, { n: 3, digits: 'act', number: place }))} ${c.sel}`);
  ok(numbered.join(' / ') === 'n5 chosen 1 / n1 null 1 / n7 null 1', `a list that numbers its rows by the member's place takes the digit as that place (${numbered.join(' / ')})`);
  const k = new ListMenu(), kept: number[] = [];
  for (const [row, n] of [[5, 3], [1, 3], [0, 1]]) { k.keep(row, n); kept.push(k.sel); }
  ok(kept.join() === '2,1,0', `a menu opened again keeps the row the choice left, held to the rows it has now (row 5 of 3 is the last, 2; then ${kept.slice(1).join(', ')})`);
  const s = new ListMenu(), tops: number[] = [];
  for (const sel of [9, 2, 11]) { s.sel = sel; tops.push(s.scroll(4, 12)); }
  ok(tops.join() === '6,2,8', `four of twelve rows in view scroll as little as brings the cursor in (rows 9, 2 and 11 show from ${tops.join(', ')})`);
  s.sel = 5;
  const cut = s.scroll(4, 6);
  ok(cut === 2, `a list cut to six rows under a scroll from row 8 shows its last four, from row ${cut}`);
  const x = new ListMenu(), y = new ListMenu(), z = new ListMenu();
  const across = (['right', 'right', 'left'] as Action[]).map((a) => `${String(x.press(a, { n: 3, across: true }))} ${x.sel}`).join(' / ');
  const flat = (['right', 'left'] as Action[]).map((a) => `${String(y.press(a, { n: 3 }))} ${y.sel}`).join(' / ');
  const none = (['down', 'interact', 'n1'] as Action[]).map((a) => `${String(z.press(a, { n: 0, digits: 'act' }))} ${z.sel}`).join(' / ');
  ok(across === 'moved 1 / moved 2 / moved 1' && flat === 'null 0 / null 0' && none === 'null 0 / null 0 / null 0',
    `left and right move a list that runs across and no other, and a list of no rows takes no key (${across}; ${flat}; ${none})`);
  // A question's rows read when asked: five, then three with the cursor on the fifth. A key holds
  // it to the last first.
  const g = headlessGame(4), five = ['One', 'Two', 'Three', 'Four', 'Five'];
  let chose = -2;
  const q = new ChoiceScreen('Which?', () => five, (i) => { chose = i; });
  g.push(q); q.sel = 4; five.length = 3;
  drive(g, ['up']);
  const up = q.sel;
  drive(g, ['interact']);
  ok(up === 1 && chose === 1, `a question that loses rows under its cursor holds it to its last row before a key: up from the fifth of three is the second (${up}), and Space chooses it (${chose})`);
}

const harrow = MAP_DEFS.find((d) => d.id === 'harrow')!;
const business = (kind: Feature['kind']): Feature => harrow.features!.find((f) => f.kind === kind)!;
/** The menu on top: the row its cursor is on and its rows' labels; -1 and none where the top is no menu. */
const shown = (g: Game): { sel: number; rows: string[] } => (g.top instanceof ChoiceScreen ? { sel: g.top.sel, rows: g.top.options.map((o) => o.split('\t')[0]) } : { sel: -1, rows: [] });
const rowOf = (g: Game, label: string): number => shown(g).rows.indexOf(label);
/** In at a business's door on Harrow, its keeper heard out: its first menu. */
function enter(g: Game, f: Feature): void {
  while (g.screens.length > 1) g.pop();
  g.world.travel('harrow', f.x, f.y, 0);
  g.enterCell();
  for (let i = 0; i < 4 && g.top.constructor.name === 'MessageScreen'; i++) drive(g, ['interact']);
}
/** From the row the cursor is on, down to row `i` and Space, as a player picks it. */
function choose(g: Game, i: number): void {
  const { sel, rows } = shown(g);
  drive(g, [...Array<Action>((i - sel + rows.length) % rows.length).fill('down'), 'interact']);
}

/** The Warden Drillyard, the Wardens' hall: its first menu, back from their work and from their skills. */
function hall(): void {
  const g = headlessGame(4);
  enter(g, business('trainer'));
  const first = shown(g).rows;
  choose(g, rowOf(g, 'Work for the Wardens'));
  const work = g.top.constructor.name;
  drive(g, ['cancel']);
  const back1 = shown(g).sel;
  choose(g, rowOf(g, 'Learn a skill'));
  const skills = g.top.constructor.name;
  drive(g, ['interact']);
  const back2 = shown(g).sel;
  ok(first.join('|') === 'Train|Work for the Wardens|Learn a skill|Leave' && work === 'ChoiceScreen' && skills === 'MessageScreen' && back1 === 1 && back2 === 2,
    `a hall's first menu opens again on the row chosen: back from the Wardens' work on it (${back1}), back from their skills on theirs (${back2})`);
}

/** The Drillyard's training: two members ready, each trained in turn. */
function trainer(): void {
  const g = headlessGame(4), p = g.party;
  for (const i of [1, 4]) p.members[i].xp = xpForLevel(2);
  p.gold = 5000;
  enter(g, business('trainer'));
  choose(g, rowOf(g, 'Train'));
  choose(g, 4);
  const maren = shown(g).sel;
  choose(g, 1);
  const idris = shown(g).sel;
  ok(maren === 4 && idris === 1 && p.members[4].level === 2 && p.members[1].level === 2,
    `a trainer's menu opens again on the member trained: ${p.members[4].name}'s row (${maren}), then ${p.members[1].name}'s (${idris})`);
}

/** Mottram's Stores: two wares bought, then two sold from the bag. */
function shop(): void {
  const g = headlessGame(4), p = g.party;
  p.gold = 5000;
  enter(g, business('shop'));
  choose(g, rowOf(g, 'Buy and sell'));
  choose(g, rowOf(g, 'Buy'));
  choose(g, 2);
  const buy1 = shown(g).sel;
  choose(g, 5);
  const buy2 = shown(g).sel, bought = p.bag.length;
  drive(g, ['cancel']);
  choose(g, rowOf(g, 'Buy and sell'));
  choose(g, rowOf(g, 'Sell'));
  const wares = shown(g).rows;
  choose(g, 1);
  const sell1 = shown(g), gold = p.gold;
  choose(g, 1);
  const sell2 = shown(g);
  ok(buy1 === 2 && buy2 === 5 && bought === 5, `the Buy list opens again on the ware bought: row 2, then row 5 (${bought} in the bag)`);
  ok(sell1.sel === 1 && sell2.sel === 1 && sell1.rows.join('|') === [wares[0], ...wares.slice(2)].join('|') && sell2.rows[1] === wares[3] && p.gold > gold,
    `the Sell list opens again on the row sold, the ware after it now: ${wares[1]}, then ${wares[2]}, and the cursor on ${sell2.rows[1]}`);
}

/** The Lantern Guildhall's skills and who would learn each: Perception for two, then Spirit Sense. */
function skills(): void {
  const g = headlessGame(4), p = g.party;
  p.gold = 5000; p.flags.rank_lanterns = 1;
  enter(g, business('guild'));
  const learn = rowOf(g, 'Learn a skill');
  choose(g, learn);
  const which = shown(g);
  choose(g, rowOf(g, 'Perception'));
  const who = shown(g);
  choose(g, 4);
  const maren = shown(g).sel;
  choose(g, 5);
  const cassian = shown(g).sel;
  // Wren, an elf, is born to it: her row is barred. Her digit moves the cursor there and teaches nothing,
  // nor does Space; a digit past the last row does nothing.
  const gold = p.gold;
  drive(g, ['n3']);
  const onWren = shown(g).sel;
  drive(g, ['interact', 'n9']);
  const still = shown(g).sel, stayed = g.top instanceof ChoiceScreen && p.gold === gold;
  drive(g, ['cancel']);
  const perception = shown(g).sel;
  choose(g, rowOf(g, 'Spirit Sense'));
  const who2 = shown(g).sel;
  choose(g, 1);
  const idris = shown(g).sel;
  drive(g, ['cancel']);
  const spirit = shown(g).sel;
  drive(g, ['cancel']);
  const home = shown(g).sel;
  ok(which.sel === 0 && who.sel === 0 && who2 === 0 && maren === 4 && cassian === 5 && idris === 1,
    `who would learn a skill opens at its top, and again on the member taught: Maren (${maren}), Cassian (${cassian}); for Spirit Sense, Idris (${idris})`);
  ok(perception === 1 && spirit === 2 && home === learn,
    `the hall's skills open again on the skill chosen (Perception ${perception}, Spirit Sense ${spirit}), and its first menu on "Learn a skill" (${home})`);
  ok(onWren === 2 && still === 2 && stayed, `on a barred row the cursor stands and nothing is taught, by its digit or Space; a digit past the last row does nothing (${onWren}, ${still})`);
}

/**
 * The other menus a choice opens again, each on the row the choice left: the Wardens' offers at
 * rank 2 (one put by, then one taken, the next offer under the cursor), the Expert's line and
 * members and a Master's at the Loft, the Lantern Guildhall's spells after the fee and Mottram's
 * Buy list after "Not enough gold" (the purse emptied under the list).
 */
function more(): void {
  const raise = (g: Game, who: number[], to: number): void => {
    for (const i of who) { g.party.members[i].xp = xpForLevel(to); levelUp(g.tables.spells, g.party.members[i], g.rng); }
  };
  const words = (g: Game): void => { for (let i = 0; i < 3 && g.top.constructor.name === 'MessageScreen'; i++) drive(g, ['interact']); };
  const h = headlessGame(4);
  h.party.flags.rank_wardens = 2;
  enter(h, business('trainer'));
  choose(h, rowOf(h, 'Work for the Wardens'));
  const offers = shown(h).rows;
  choose(h, 1); words(h); choose(h, rowOf(h, 'Not now'));
  const put = shown(h).sel;
  choose(h, 2); words(h); choose(h, rowOf(h, 'Take it')); words(h);
  const took = shown(h);
  ok(put === 1 && took.sel === 2 && took.rows.length === offers.length - 1 && took.rows[2] === offers[3],
    `a hall's offers open again on the offer put by (${put}), and once one is taken on the next (${took.sel}: ${took.rows[2]})`);
  const t = headlessGame(4);
  t.party.gold = 20000;
  raise(t, [1, 4], 13);
  t.push(tierMenu(t, 'Loft'));
  choose(t, 1);
  const fresh = shown(t).sel;
  choose(t, 1);
  const taught = shown(t).sel;
  drive(t, ['cancel']);
  const line = shown(t).sel;
  const m = headlessGame(4);
  m.party.gold = 20000;
  raise(m, [1, 4], 25);
  for (const i of [1, 4]) m.party.members[i].tiers = { arms: 'expert' };
  m.party.flags.fx_master = 1;
  m.push(masterMenu(m, { line: 'arms', tier: 'master', done: { flag: fxFlag('fx_master') }, price: TIER_PRICES.master }, 'Old Hand'));
  choose(m, 1);
  const master = shown(m).sel;
  ok(fresh === 0 && taught === 1 && line === 1 && master === 1,
    `the Expert's members open at their top (${fresh}) and again on the member taught (${taught}), its lines on the line chosen (${line}); a Master's on the member taught (${master})`);
  const s = headlessGame(4);
  s.party.gold = 20000;
  enter(s, business('guild'));
  choose(s, rowOf(s, 'Study spells'));
  choose(s, 0);
  const fee = shown(s).sel;
  choose(s, 3);
  const first = shown(s).sel;
  choose(s, 1);
  const second = shown(s).sel;
  ok(fee === 0 && first === 3 && second === 1, `a spell hall's spells open at their top after the fee (${fee}), and again on the row of the spell learnt: ${first}, then ${second}`);
  const b = headlessGame(4);
  b.party.gold = 5000;
  enter(b, business('shop'));
  choose(b, rowOf(b, 'Buy and sell'));
  choose(b, rowOf(b, 'Buy'));
  choose(b, 5);
  b.party.gold = 0;
  choose(b, 3);
  const poor = shown(b).sel, said = b.log.at(-1);
  ok(said === 'Not enough gold.' && poor === 3, `after "Not enough gold" the Buy list opens again on the ware asked for (${poor}), as after a sale`);
}

/** The spell picker's casters, Idris, Wren, Maren and Cassian: a digit is the member's place in the party. */
function casters(): void {
  const g = headlessGame(4);
  const picked = (['n1', 'n4', 'n7', 'n3', 'n6', 'interact'] as Action[]).map((a) => {
    g.push(new SpellScreen());
    drive(g, [a]);
    const who = (g.top as unknown as { who: number }).who;
    g.pop();
    return `${a} ${who}`;
  });
  ok(picked.join(' / ') === 'n1 -1 / n4 -1 / n7 -1 / n3 2 / n6 5 / interact 1',
    `the casters take a digit as the member's place: 3 is Wren, 6 Cassian; 1 and 4, who cast nothing, and 7 choose nobody; Space the first who can, Idris (${picked.join(' / ')})`);
}

/** A fight with the road rats: a member's turn, Use by its digit, then the draught's member by a digit. */
function fight(): void {
  const g = headlessGame(4), p = g.party, was = CombatScreen.instant;
  CombatScreen.instant = true;
  for (const c of p.members) { c.maxHp = 999; c.hp = 900; c.conditions = []; }
  p.bag = ['potion_heal'];
  g.world.travel('shelf', 16, 4, 2);
  g.fight(['road_rats']);
  const scr = g.top as CombatScreen, s = scr.state, read = scr as unknown as { mode: string; sel: number; sub: number };
  for (let i = 0; i < 300 && s.outcome === 'ongoing' && s.order[s.turn]?.side !== 'party'; i++) g.update(null);
  drive(g, ['n3']);
  const use = `${read.mode} ${read.sel}`;
  drive(g, ['interact', 'n2']);
  const moved = `${read.mode} ${read.sub}`, kept = p.bag.length;
  drive(g, ['interact']);
  const used = p.bag.length;
  CombatScreen.instant = was;
  ok(use === 'item 2' && moved === 'itemTarget 1' && kept === 1 && used === 0,
    `in a fight 3 chooses Use, as Space on it would (${use}); on the members' list 2 moves to the second (${moved}) and Space gives the draught (${kept} in the bag, then ${used})`);
}
