// A full playthrough. tools/test.ts proves the model's parts; this proves the whole game: the slice's
// quest played from the title screen to Vask's hand-in, driven only by the actions the keyboard
// produces. The Game, the screen stack, the menus, the town services and the combat screen all run
// headless in Node, so anything that breaks the critical path breaks here.
//   node tools/play.ts             the whole journey
//   node tools/play.ts quest town  selected chapters
import { Game, ExploreScreen } from '../src/game/game.ts';
import type { Screen } from '../src/game/game.ts';
import { CombatScreen } from '../src/ui/combat.ts';
import { MessageScreen, ChoiceScreen } from '../src/ui/screens.ts';
import type { Action } from '../src/input.ts';
import { startCombat, currentTurn, partyAct, monsterAct, aliveMonsters, canAttackFromRow } from '../src/game/combat.ts';
import { countItem, isDown, allDown, hasCondition, partyCan, defaultParty, levelUp, xpForLevel, CLASSES } from '../src/game/party.ts';
import { spell } from '../src/game/spells.ts';
import { makeRng } from '../src/lib/engine/rng.ts';
import { buildMaps, MAP_DEFS } from '../src/content/maps/index.ts';
import { MONSTERS } from '../src/game/monsters.ts';
import { item } from '../src/game/items.ts';
import type { Store } from '../src/game/save.ts';
import type { Facing } from '../src/game/types.ts';

let failures = 0;
const ok = (cond: boolean, msg: string): void => { console.log((cond ? '  ok:   ' : '  FAIL: ') + msg); if (!cond) failures++; };

// ---- driving the game the way a player does ----

/** A store that lives in memory, so save/load can be played without a browser. */
function memoryStore(): Store {
  const m = new Map<string, string>();
  return { getItem: (k) => m.get(k) ?? null, setItem: (k, v) => { m.set(k, v); }, removeItem: (k) => { m.delete(k); } };
}

/** The name-entry side of `Input`, which party creation reads. */
function typist(name: string): { textMode: boolean; drainText(c: string, max?: number): string } {
  return { textMode: false, drainText: (_c, max = 12) => name.slice(0, max) };
}

const name = (s: Screen): string => s.constructor.name;
/** `PLAY_TRACE=1 node tools/play.ts quest` narrates the fights and camps, for when a chapter fails. */
const trace = (line: string): void => { if (process.env.PLAY_TRACE) console.log('    ' + line); };
const press = (g: Game, ...keys: Action[]): void => { for (const k of keys) g.update(k); };

/** Play out whatever the game put in front of us until the exploration screen is back. Returns the
 * number of fights that had to be won on the way. */
function settle(g: Game, budget = 600): number {
  let fights = 0;
  for (let i = 0; i < budget; i++) {
    const top = g.top;
    if (top instanceof CombatScreen) { playFight(g); fights++; continue; }
    if (top instanceof MessageScreen) { press(g, 'interact'); continue; }
    if (top instanceof ChoiceScreen) { press(g, 'cancel'); continue; }
    return fights;
  }
  throw new Error(`stuck on ${name(g.top)} after ${budget} presses`);
}

/** The combat menu a character can actually open this turn (the screen greys out the rest). */
function canCast(c: { spells: string[] }): boolean { return c.spells.some((s) => spell(s).context !== 'explore'); }
function usables(g: Game, who: number): string[] {
  const c = g.party.members[who];
  return [...new Set([...c.pack, ...g.party.bag].filter((id) => item(id).use && !item(id).use!.food))];
}

/** Fight the fight on top of the stack the way a player would: put the crowd to sleep, mend the
 * badly hurt, finish what is nearly dead, and swing with everyone who cannot do better. */
function playFight(g: Game, budget = 1200): 'victory' | 'defeat' | 'fled' {
  const s = (g.top as CombatScreen).state;
  trace(`[fight] ${s.log[0]} | ${g.party.members.map((m) => `${m.name} ${m.hp}/${m.maxHp} sp${m.sp}`).join(' ')} | food ${g.party.food}`);
  let slept = false;
  /** Step the target cursor from the first living monster to the k-th, then commit. */
  const strike = (k: number): void => { for (let j = 0; j < k; j++) press(g, 'down'); press(g, 'interact'); };
  for (let i = 0; i < budget && s.outcome === 'ongoing'; i++) {
    const t = currentTurn(s, g.party, g.rng);
    if (!t) break;
    if (t.side === 'monster') { press(g, 'interact'); continue; }
    const who = t.i, c = g.party.members[who];
    const hurt = g.party.members.findIndex((m) => !isDown(m) && m.hp <= m.maxHp * 0.4);
    const alive = aliveMonsters(s);

    // Losing? Run. A wipe ends the run; a retreat costs four steps and a truce.
    const down = g.party.members.filter(isDown).length;
    const left = g.party.members.reduce((a, m) => a + Math.max(0, m.hp), 0);
    const full = g.party.members.reduce((a, m) => a + m.maxHp, 0);
    if (down >= 3 || (down >= 1 && alive.length >= 5) || left < full * 0.35) { press(g, 'cancel'); press(g, 'n5'); continue; }
    // Finish the nearly dead first: one fewer thing swinging back.
    const weakest = alive.reduce((best, mi, k) => (s.monsters[mi].hp < s.monsters[alive[best]].hp ? k : best), 0);
    const spells = c.spells.filter((x) => spell(x).context !== 'explore');

    // Slumber, once, while there is still a crowd to catch.
    const dream = spells.findIndex((x) => { const sp = spell(x); return !!sp.inflict && c.sp >= sp.sp; });
    if (!slept && dream >= 0 && alive.length >= 3) {
      press(g, 'n2');
      for (let k = 0; k < dream; k++) press(g, 'down');
      press(g, 'interact');
      strike(alive.length - 1);                                   // the back of the line is the escort
      slept = true;
      continue;
    }
    // Mend, if this one can and somebody needs it.
    const mend = spells.indexOf('heal');
    if (hurt >= 0 && mend >= 0 && c.sp >= spell('heal').sp) {
      press(g, 'n2');
      for (let k = 0; k < mend; k++) press(g, 'down');
      press(g, 'interact');                                       // Mend targets an ally
      press(g, `n${hurt + 1}` as Action, 'interact');
      continue;
    }
    // Otherwise a draught, if one is carried.
    const items = usables(g, who);
    const potion = items.indexOf('potion_heal');
    if (hurt >= 0 && potion >= 0) {
      press(g, 'n3');                                             // Use
      for (let k = 0; k < potion; k++) press(g, 'down');
      press(g, 'interact');
      press(g, `n${hurt + 1}` as Action, 'interact');
      continue;
    }
    // A caster's bolt is worth more than a dagger, and it reaches from the back row.
    const bolt = spells.findIndex((x) => { const sp = spell(x); return (sp.target === 'enemy' || sp.target === 'group') && !sp.inflict && c.sp >= sp.sp; });
    const casterFirst = bolt >= 0 && (!canAttackFromRow(c, who) || CLASSES[c.cls].attack <= 1);
    if (casterFirst) {
      press(g, 'n2');
      for (let k = 0; k < bolt; k++) press(g, 'down');
      press(g, 'interact');
      strike(weakest);
      continue;
    }
    if (canAttackFromRow(c, who)) { press(g, 'n1'); strike(weakest); }
    else if (bolt >= 0) { press(g, 'n2'); for (let k = 0; k < bolt; k++) press(g, 'down'); press(g, 'interact'); strike(weakest); }
    else press(g, 'n4');                                          // Defend from the back row
  }
  const outcome = s.outcome;
  trace(`[fight] -> ${s.outcome} in ${s.round} rounds, ${g.party.members.filter((m) => !isDown(m)).length}/6 standing` + (s.outcome === 'defeat' ? '\n      ' + s.log.slice(-10).join('\n      ') : ''));
  if (outcome === 'ongoing') throw new Error('a fight never resolved');
  press(g, 'interact');                                           // dismiss the result card
  return outcome;
}

/** A quick breather after a fight: eight hours only when somebody is genuinely worn down, because
 * every camp moves the clock eight hours and the map repopulates on a timer. */
function recover(g: Game): void {
  if (!(g.top instanceof ExploreScreen)) return;
  const need = g.party.members.some((m) => hasCondition(m, 'unconscious')
    || (!isDown(m) && (m.hp < m.maxHp * 0.95 || (m.maxSp > 0 && m.sp < m.maxSp * 0.6))));
  if (!need) return;
  press(g, 'rest');
  const rested = g.top instanceof ChoiceScreen && choose(g, 'Rest');
  if (!rested && g.top instanceof ChoiceScreen) press(g, 'cancel');
  trace(`[camp] ${rested ? 'rested' : 'no rest: ' + g.log[g.log.length - 1]} (food ${g.party.food})`);
  settle(g);
}

/** Camp until everyone is back to full, the way anyone would before opening the last door. Eight
 * hours a time, so it is not free: the clock moves and the map repopulates around you, and it is
 * refused outright when something is close enough to be hunting. */
function camp(g: Game, tries = 4): boolean {
  const rested = (): boolean => g.party.members.every((m) => isDown(m) || (m.hp === m.maxHp && m.sp === m.maxSp));
  for (let i = 0; i < tries && !rested(); i++) {
    press(g, 'rest');
    if (!(g.top instanceof ChoiceScreen)) { settle(g); return false; }   // too dangerous to sleep here
    choose(g, 'Rest');
    settle(g);
  }
  return rested();
}

/** Stock up before going underground, as anyone would: food and draughts, and a sling for each
 * caster so the back row is not reduced to bracing once the spell points run out. */
function provision(g: Game): void {
  const RESERVE = Math.min(220, Math.floor(g.party.gold * 0.25));  // keep back what a level and a raise cost, if the purse can spare it
  // In order of what the party most regrets not having: something for the back row to do, food to
  // camp on, then draughts, then food enough for a whole dungeon.
  const list: string[] = [];
  for (const who of [4, 5]) if (!item(g.party.members[who].equipment.weapon ?? 'club').ranged) list.push('Sling');
  for (let f = g.party.food; f < 60; f += 5) list.push('Rations');
  for (let n = countItem(g.party, 'potion_heal'); n < 5; n++) list.push('Healing Draught');
  for (let f = Math.max(g.party.food, 60); f < 150; f += 5) list.push('Rations');
  visit(g, 4, 10, 'the shop');
  if (choose(g, 'Buy')) for (const what of list) { if (g.party.gold <= RESERVE) break; choose(g, what); }
  settle(g);
  for (const who of [4, 5]) equipFromBag(g, who, 'Sling');
  trace(`[shop] ${g.party.gold} gold, ${g.party.food} food, ${countItem(g.party, 'potion_heal')} draughts, weapons ${g.party.members.map((m) => m.equipment.weapon).join('/')}`);
}

/** Open a character's sheet and equip the named item out of the shared bag. */
function equipFromBag(g: Game, who: number, label: string): boolean {
  press(g, `n${who + 1}` as Action);                              // 1-6 opens that character's sheet
  const sheet = g.top;
  if (name(sheet) !== 'SheetScreen') { settle(g); return false; }
  const items = (sheet as unknown as { items(g: Game): { id: string }[] }).items(g);
  const i = items.findIndex((it) => item(it.id).name.toLowerCase().includes(label.toLowerCase()));
  if (i < 0) { press(g, 'cancel'); return false; }
  for (let k = 0; k < items.length && (sheet as unknown as { sel: number }).sel !== i; k++) press(g, 'down');
  press(g, 'interact', 'cancel');
  settle(g);
  return true;
}

/** Shortest route on the current map, obeying the real passability rules. */
function route(g: Game, tx: number, ty: number): [number, number][] | null {
  const m = g.world.map, w = g.world.state;
  const can = partyCan(g.party);
  const key = (x: number, y: number): number => y * m.width + x;
  const prev = new Map<number, [number, number]>();
  const seen = new Set([key(w.x, w.y)]);
  const q: [number, number][] = [[w.x, w.y]];
  while (q.length) {
    const [x, y] = q.shift()!;
    if (x === tx && y === ty) {
      const path: [number, number][] = [];
      for (let c: [number, number] = [x, y]; prev.has(key(c[0], c[1])); c = prev.get(key(c[0], c[1]))!) path.unshift(c);
      return path;
    }
    for (const [dx, dy] of [[0, -1], [1, 0], [0, 1], [-1, 0]]) {
      const nx = x + dx, ny = y + dy;
      if (!m.inBounds(nx, ny) || seen.has(key(nx, ny))) continue;
      const p = m.passable(nx, ny, can);
      if (p !== 'ok' && p !== 'unlock') continue;
      if (m.exitAt(nx, ny) && !(nx === tx && ny === ty)) continue;   // an exit is a destination, not a corridor
      seen.add(key(nx, ny)); prev.set(key(nx, ny), [x, y]); q.push([nx, ny]);
    }
  }
  return null;
}

const FACING_OF: Record<string, Facing> = { '0,-1': 0, '1,0': 1, '0,1': 2, '-1,0': 3 };

/** Walk to a cell on the current map, fighting and reading whatever is met on the way. */
function walkTo(g: Game, tx: number, ty: number, why: string): boolean {
  for (let leg = 0; leg < 400; leg++) {
    if (g.top instanceof CombatScreen) { playFight(g); recover(g); continue; }
    if (allDown(g.party)) { console.log(`  FAIL: the party fell on the way to ${why}`); return false; }
    // Arriving is the end of the walk: whatever the last step opened is left for the caller to use.
    if (g.world.state.x === tx && g.world.state.y === ty) return true;
    if (settle(g) > 0) recover(g);
    const ox = g.world.state.x, oy = g.world.state.y, wasMap = g.world.state.mapId;
    if (ox === tx && oy === ty) return true;
    const path = route(g, tx, ty);
    if (!path || !path.length) { console.log(`  FAIL: no route to ${why} (${tx},${ty}) on ${wasMap} from ${ox},${oy}`); return false; }
    const [nx, ny] = path[0];
    const want = FACING_OF[`${nx - ox},${ny - oy}`];
    for (let t = 0; t < 4 && g.world.state.facing !== want; t++) press(g, 'turnRight');
    press(g, 'forward');
    if (g.world.state.mapId !== wasMap) return true;             // an exit took us somewhere else
    if (g.world.state.x === ox && g.world.state.y === oy && !(g.top instanceof CombatScreen)) {
      console.log(`  FAIL: blocked walking to ${why} at ${ox},${oy}: ${g.log[g.log.length - 1]}`);
      return false;
    }
  }
  console.log(`  FAIL: gave up walking to ${why}`);
  return false;
}

/** Walk to a feature and open it. Stepping onto one opens it; standing on one, Space re-opens it. */
function visit(g: Game, x: number, y: number, why: string): boolean {
  if (!walkTo(g, x, y, why)) return false;
  if (!(g.top instanceof ChoiceScreen) && !(g.top instanceof MessageScreen)) press(g, 'interact');
  return true;
}

/** How much of the party's health is left, as a fraction: the signal for when to go home. */
function vigour(g: Game): number {
  const full = g.party.members.reduce((a, m) => a + m.maxHp, 0);
  return g.party.members.reduce((a, m) => a + Math.max(0, m.hp), 0) / Math.max(1, full);
}

/** The chapel raises whoever did not walk out, and cures what a fight left behind. */
function tendAtTemple(g: Game): number {
  let treated = 0;
  for (let i = 0; i < 8; i++) {
    const c = g.party.members.find((m) => m.conditions.length > 0);
    if (!c) break;
    if (!visit(g, 11, 4, 'the Chapel of the Lanterns')) break;
    if (!choose(g, c.name)) { settle(g); break; }
    treated++;
    settle(g);
  }
  return treated;
}

/** Hunt down every group still alive on this map, the way a player clearing a region does. Each id
 * is taken once, so a respawn on the long timer does not turn this into an endless farm. */
function sweep(g: Game, why: string, most = 40): number {
  const done = new Set<string>();
  for (let i = 0; i < most; i++) {
    // Never start the next fight on an empty tank. If it is not safe to camp, the trip is over.
    if (!camp(g) && vigour(g) < 0.7) return done.size;
    const live = g.world.liveGroups().filter((x) => !done.has(x.def.id));
    if (!live.length) break;
    const p = g.world.state;
    live.sort((a, b) => (Math.abs(a.state.x - p.x) + Math.abs(a.state.y - p.y)) - (Math.abs(b.state.x - p.x) + Math.abs(b.state.y - p.y)));
    const target = live[0];
    done.add(target.def.id);
    if (!walkTo(g, target.state.x, target.state.y, `${target.def.id} on ${why}`)) return done.size;
  }
  return done.size;
}

/** Train everyone the drillyard will take, one bought level at a time. */
function trainAll(g: Game): number {
  let trained = 0;
  if (!visit(g, 3, 13, 'the Warden Drillyard')) return 0;
  for (let i = 0; i < 12; i++) {
    if (!(g.top instanceof ChoiceScreen)) break;
    const m = g.party.members.find((c) => c.xp >= xpForLevel(c.level + 1) && g.party.gold >= c.level * 25);
    if (!m || !choose(g, `${m.name}  L${m.level}`)) break;
    trained++;
  }
  settle(g);
  return trained;
}

/** Everything town is for, in the order it is worth doing: raise the fallen, sleep it off (camping
 * inside the walls is free of anything that would interrupt it), buy the levels the experience has
 * paid for, restock. */
function townPhase(g: Game): void {
  tendAtTemple(g);
  camp(g);
  for (let i = 0; i < 8 && trainAll(g) > 0; i++) { /* a level at a time, while the purse holds */ }
  provision(g);
}

/** Get back to a cell when the way there is contested: rest what can be rested, then push again. */
function retreatTo(g: Game, x: number, y: number, why: string, tries = 4): boolean {
  for (let i = 0; i < tries; i++) {
    if (walkTo(g, x, y, why)) return true;
    if (allDown(g.party) || !camp(g)) return false;
  }
  return false;
}

/** Play the region until the goal holds: out to clear what is nearest while the party is fit, back
 * to town to be raised, rested, trained and restocked when it is not. This is the actual loop the
 * slice is built around, so the test plays it rather than fabricating its way past it. */
function campaign(g: Game, goal: () => boolean, trips = 14): boolean {
  for (let i = 0; i < trips && !goal(); i++) {
    if (g.world.map.id !== 'harrow' && !walkTo(g, 16, 3, 'the Harrow gate')) return goal();
    townPhase(g);
    if (goal()) return true;
    if (!leaveBy(g, 7, 15, 'the south gate')) return goal();
    sweep(g, 'the Shelf', 4);
  }
  return goal();
}

/** Walk up to a feature and stop on the next cell, facing it, so nothing else happens before the
 * caller presses Space. Stepping onto a feature triggers it, which is no good when the point of the
 * test is what changes at that exact moment. */
function approach(g: Game, x: number, y: number, why: string): boolean {
  const can = partyCan(g.party);
  for (const [dx, dy] of [[0, 1], [0, -1], [1, 0], [-1, 0]]) {
    const ax = x + dx, ay = y + dy;
    if (g.world.map.passable(ax, ay, can) !== 'ok') continue;
    if (!walkTo(g, ax, ay, why)) return false;
    settle(g);
    const want = FACING_OF[`${x - ax},${y - ay}`];
    for (let k = 0; k < 4 && g.world.state.facing !== want; k++) press(g, 'turnRight');
    return true;
  }
  return false;
}

/** Take a map exit that sits on the cell we are standing next to. */
function leaveBy(g: Game, x: number, y: number, why: string): boolean {
  return walkTo(g, x, y, why);
}

/** In the choice screen on top, pick the first option whose label contains `text`. */
function choose(g: Game, text: string): boolean {
  const s = g.top;
  if (!(s instanceof ChoiceScreen)) return false;
  const opts = (s as unknown as { options: string[] }).options;
  const i = opts.findIndex((o) => o.toLowerCase().includes(text.toLowerCase()));
  if (i < 0) return false;
  const disabled = (s as unknown as { disabled: boolean[] }).disabled;
  if (disabled[i]) return false;
  for (let k = 0; k < opts.length && (s as unknown as { sel: number }).sel !== i; k++) press(g, 'down');
  press(g, 'interact');
  return true;
}

/** A new game on a fixed seed, sitting on the exploration screen with the premade company. */
function newRun(seed: number, store: Store | null = null): Game {
  const g = new Game(store);
  g.input = typist('Wren');
  ok(name(g.top) === 'TitleScreen', `seed ${seed}: the game opens on the title screen`);
  press(g, 'interact');                      // New Game
  ok(name(g.top) === 'CreateScreen', 'the title opens party creation');
  press(g, 'interact');                      // take the premade company
  g.rng.seed(seed);                          // pin the run so the journey replays
  settle(g);
  return g;
}

// ---- the chapters ----

const suites: Record<string, () => void> = {
  /** The title screen, both ways into a party, and the game-over road back. */
  opening() {
    const g = newRun(101);
    ok(name(g.top) === 'ExploreScreen', 'taking the premade company starts the game');
    ok(g.party.members.length === 6 && g.party.gold === 200, `six characters and ${g.party.gold} gold`);
    ok(g.world.map.id === 'harrow' && g.world.state.x === 7 && g.world.state.y === 14, 'standing at the Harrow gate');
    ok(g.log.some((l) => /Arrows move/.test(l)), 'the help line is in the log');

    // The long way: build a company by hand, one screen at a time.
    const h = new Game(null);
    h.input = typist('Tamsin');
    press(h, 'interact');                                        // title -> creation
    press(h, 'down', 'interact');                                // "muster your own"
    for (let slot = 0; slot < 6; slot++) {
      press(h, 'interact');                                      // name -> race
      press(h, 'interact');                                      // race -> class
      press(h, 'interact');                                      // class -> stats
      press(h, 'interact');                                      // stats -> next slot (or review)
    }
    for (let i = 0; i < 20 && name(h.top) !== 'ExploreScreen'; i++) press(h, 'interact');
    ok(name(h.top) === 'ExploreScreen', `a hand-built party reaches the game (${name(h.top)})`);
    ok(h.party.members.length === 6, 'with six characters');
    ok(h.party.members.every((m) => m.name.length > 0 && m.maxHp > 0), 'each named, rolled and alive');

    // A wipe ends the run and offers the title again.
    const d = newRun(102);
    for (const m of d.party.members) { m.hp = -10; m.conditions = ['dead']; }
    ok(allDown(d.party), 'the party is dead');
    press(d, 'forward');
    ok(name(d.top) === 'TitleScreen', 'a dead party is sent back to the title screen');
  },

  /** Every service in Harrow, bought and used through its own menus. */
  town() {
    const g = newRun(201);

    ok(visit(g, 12, 13, 'the Gilded Eel'), 'the party can reach the tavern');
    ok(g.top instanceof MessageScreen, 'the tavern has something to say');
    settle(g);

    // The shop: buy a sling, then sell it back at half price.
    let gold = g.party.gold;
    ok(visit(g, 4, 10, 'the Harrow Provisioner'), 'the party can reach the shop');
    ok(g.top instanceof ChoiceScreen, `the shop opens its menu (${name(g.top)})`);
    ok(choose(g, 'Buy'), 'the shop offers to sell');
    const bag = g.party.bag.length;
    ok(choose(g, 'Sling'), 'a sling is on the shelf');
    ok(g.party.bag.length === bag + 1 && g.party.gold === gold - 15, `the sling is bought (bag ${bag} -> ${g.party.bag.length}, ${g.party.gold} gold)`);
    settle(g);
    gold = g.party.gold;
    ok(visit(g, 4, 10, 'the shop'), 'back into the shop');
    ok(choose(g, 'Sell'), 'the shop offers to buy');
    ok(choose(g, 'Sling'), 'and takes the sling back');
    ok(g.party.gold === gold + 7 && g.party.bag.length === bag, `sold for half price (${g.party.gold} gold)`);
    settle(g);

    // A price of zero means "I will not buy that": the hand-in cannot be traded away by accident.
    g.party.bag.push('survey_wand');
    ok(visit(g, 4, 10, 'the shop'), 'back into the shop once more');
    ok(choose(g, 'Sell'), 'selling again');
    choose(g, 'Survey Wand');
    ok(countItem(g.party, 'survey_wand') === 1, 'the shop refuses the survey wand, so the quest cannot be sold away');
    settle(g);
    g.party.bag.splice(g.party.bag.indexOf('survey_wand'), 1);

    // The inn: rations, and a bed that heals and puts the clock to morning.
    const food = g.party.food;
    ok(visit(g, 4, 4, 'the Hearthlight Inn'), 'the party can reach the inn');
    ok(choose(g, 'rations'), 'the inn sells rations');
    ok(g.party.food === food + 10, `ten days of food (${food} -> ${g.party.food})`);
    settle(g);
    g.party.members[0].hp = 1; g.party.members[5].sp = 0;
    ok(visit(g, 4, 4, 'the inn'), 'back to the inn');
    ok(choose(g, 'Stay the night'), 'the inn rents a room');
    ok(g.party.members[0].hp === g.party.members[0].maxHp, 'a night at the inn heals the party');
    ok(g.party.members[5].sp === g.party.members[5].maxSp, 'and restores its spell points');
    ok(g.world.hour === 7, `and the clock reads morning (${g.world.hour}:00)`);
    settle(g);

    // The temple: cure what a fight leaves behind, and raise the dead.
    gold = g.party.gold;
    g.party.members[1].conditions = ['poisoned'];
    ok(visit(g, 11, 4, 'the Chapel of the Lanterns'), 'the party can reach the temple');
    ok(choose(g, g.party.members[1].name), 'the temple will treat the poisoned paladin');
    ok(g.party.members[1].conditions.length === 0 && g.party.gold === gold - 25, `cured for 25 gold (${g.party.gold})`);
    settle(g);
    // From here the purse is topped up on purpose: joining the guild (50), one spell (80), a raise
    // (100/level) and a training fee (25) come to more than the whole slice pays out, so testing the
    // services on their own terms means not making them compete for the slice's 200 starting gold.
    g.party.gold += 500;
    gold = g.party.gold;
    const dead = g.party.members[2];
    dead.conditions = ['dead']; dead.hp = -10;
    ok(visit(g, 11, 4, 'the temple'), 'back to the temple with a body');
    ok(choose(g, dead.name), 'the temple will raise the dead');
    ok(!isDown(dead) && dead.hp > 0, `${dead.name} walks again at ${dead.hp} hp`);
    ok(g.party.gold === gold - 100 * dead.level, `raising costs by level (${gold} -> ${g.party.gold})`);
    settle(g);

    // The guild: a fee to join, then spells the party has not levelled into yet.
    const sorcerer = g.party.members[5];
    const knew = sorcerer.spells.length;
    ok(visit(g, 11, 10, 'the Lantern Guildhall'), 'the party can reach the guild');
    ok(choose(g, 'Join'), 'the guild takes a membership fee');
    ok(g.party.flags['guild_Lantern Guildhall'] === 1, 'the party are members');
    ok(g.top instanceof ChoiceScreen, 'and the spell list opens');
    ok(choose(g, `${sorcerer.name}: Slumber`), 'Slumber is for sale to the sorcerer');
    ok(sorcerer.spells.length === knew + 1 && sorcerer.spells.includes('sleep'), `and he learns it (${sorcerer.spells.join(', ')})`);
    settle(g);

    // The trainer: refuses a character who has not earned it, charges for one level at a time.
    const knight = g.party.members[0];
    ok(visit(g, 3, 13, 'the Warden Drillyard'), 'the party can reach the trainer');
    ok(!choose(g, `${knight.name}  L1`), 'a character short of the experience cannot be trained');
    settle(g);
    knight.xp = 99999;
    gold = g.party.gold;
    ok(visit(g, 3, 13, 'the trainer'), 'back to the trainer with the experience earned');
    ok(choose(g, knight.name), 'and now the trainer takes the fee');
    ok(knight.level === 2, `the knight is level ${knight.level}`);
    ok(g.party.gold === gold - 25, `one level charged, not every level the xp allows (${g.party.gold})`);
    settle(g);

    // Camping in the field: a ration a head, and nothing without them.
    g.party.members[0].hp = 1; g.party.members[5].sp = 0;
    const rations = g.party.food;
    press(g, 'rest');
    ok(g.top instanceof ChoiceScreen && choose(g, 'Rest'), 'the party can camp where nothing is hunting it');
    settle(g);
    ok(g.party.food === rations - 6, `eight hours costs one ration each (${rations} -> ${g.party.food})`);
    ok(g.party.members[0].hp === g.party.members[0].maxHp && g.party.members[5].sp === g.party.members[5].maxSp, 'and restores health and spell points');
    g.party.food = 0;
    g.party.members[0].hp = 1;
    press(g, 'rest'); choose(g, 'Rest'); settle(g);
    ok(g.party.members[0].hp === 1, 'a party with no food cannot camp');
    ok(g.log[g.log.length - 1] === 'There is not enough food to rest.', `and is told why (${g.log[g.log.length - 1]})`);
    g.party.food = 30;

    // The well speaks, and the one behind Ashcombe heals.
    ok(visit(g, 7, 6, 'the town well'), 'the party can reach the well');
    ok(g.log.some((l) => /iron/.test(l)), 'the well says its line');
  },

  /** The contract, the road, the cellar and the hand-in: the whole slice, in order. */
  quest() {
    const g = newRun(301);

    // 1. The Regent-Warden hands out the contract.
    ok(walkTo(g, 9, 5, 'Lord Vask'), 'the party can reach Lord Vask');
    ok(g.party.flags.q_ashcombe === 1, 'talking to Vask opens the Ashcombe contract');
    settle(g);

    // 1b. Supplies, the way anyone would before going underground.
    provision(g);
    ok(g.party.food >= 60, `the shop sells rations by the sackful (${g.party.food} days of food)`);
    ok(g.party.members[5].equipment.weapon === 'sling', `the sorcerer buys and equips a sling (${g.party.members[5].equipment.weapon})`);
    ok(countItem(g.party, 'potion_heal') >= 2, `and the shop sells draughts (${countItem(g.party, 'potion_heal')} carried)`);

    // 2. Out of the south gate onto the Shelf.
    ok(leaveBy(g, 7, 15, 'the south gate'), 'the party can leave by the south gate');
    ok(g.world.map.id === 'shelf' && g.world.state.y === 4, `the gate opens onto the Shelf (${g.world.map.id} ${g.world.state.x},${g.world.state.y})`);
    ok(g.log.some((l) => /leave Harrow/.test(l)), 'and the log says so');

    // 3. The road south-east to Ashcombe, fighting whatever is on it.
    ok(walkTo(g, 23, 20, 'the Ashcombe gate'), 'the party can walk the road to Ashcombe');
    ok(g.log.some((l) => /Ashcombe/.test(l)), 'the farm announces itself');
    ok(leaveBy(g, 24, 20, 'the farmhouse door'), 'the party can go through the farmhouse door');
    ok(g.world.map.id === 'mill' && g.world.state.x === 1 && g.world.state.y === 1, `and down into the cellar (${g.world.map.id} ${g.world.state.x},${g.world.state.y})`);

    // 4. The cellar: the key, the locked door, the wand, the Lantern's note.
    ok(walkTo(g, 3, 3, 'the first chest'), 'the party can reach the first chest');
    press(g, 'interact'); settle(g);
    ok(countItem(g.party, 'key_iron') === 1, 'the chest holds the iron key');
    ok(walkTo(g, 10, 3, 'the dead Lantern'), 'the party can reach the dead Lantern');
    ok(g.log.some((l) => /CUT/.test(l)) || g.world.used('mill_lantern'), 'her note is read');
    ok(walkTo(g, 12, 4, 'the survey wand'), 'the party can reach the wand chest');
    press(g, 'interact'); settle(g);
    ok(countItem(g.party, 'survey_wand') === 1, 'and it holds the cracked survey wand');

    // 5. The locked door opens with the key, once.
    ok(walkTo(g, 6, 11, 'the locked door'), 'the party can reach the locked door');
    for (let t = 0; t < 4 && g.world.state.facing !== 1; t++) press(g, 'turnRight');
    press(g, 'forward'); settle(g);
    ok(g.world.state.x === 7 && g.world.state.y === 11, 'the iron key opens the locked door');
    ok(countItem(g.party, 'key_iron') === 0, 'and the key is used up');
    ok(g.world.mapState.doors['7,11'] === 'door', 'the opened door is remembered for the save');

    // 6. The Rift Warden guards the Rift, and drops what Vask wants.
    ok(camp(g), 'the party camps to full before the Rift room');
    ok(walkTo(g, 4, 11, 'the Rift Warden'), 'the party can reach the Rift room');
    const wasDead = !g.world.liveGroups().some((x) => x.def.id === 'm_warden');
    ok(wasDead, 'the Rift Warden has been put down');
    ok(walkTo(g, 3, 10, 'the Rift'), 'the party can stand at the Rift');
    ok(g.world.used('mill_core'), 'and the Rift describes itself');

    // 7. Out, home, and paid.
    ok(leaveBy(g, 1, 1, 'the cellar stairs'), 'the party can climb back out');
    ok(g.world.map.id === 'shelf', `the stairs come out in the farmyard (${g.world.map.id} ${g.world.state.x},${g.world.state.y})`);
    ok(walkTo(g, 16, 3, 'the Harrow gate'), 'the party can walk the road home');
    ok(g.world.map.id === 'harrow', `and re-enter Harrow (${g.world.map.id} ${g.world.state.x},${g.world.state.y})`);
    ok(approach(g, 9, 5, 'Lord Vask'), 'the party can reach Vask again');
    const goldBefore = g.party.gold, wandsBefore = countItem(g.party, 'survey_wand');
    press(g, 'interact');
    ok(g.party.flags.q_ashcombe_done === 1, 'Vask takes the wand and closes the contract');
    ok(g.party.gold === goldBefore + 300, `and pays 300 gold (${goldBefore} -> ${g.party.gold})`);
    ok(countItem(g.party, 'survey_wand') === wandsBefore - 1, `the hand-in takes exactly one wand (${wandsBefore} -> ${countItem(g.party, 'survey_wand')})`);
    if (countItem(g.party, 'survey_wand') > 0) console.log('  note:  the party still carries a survey wand: the cellar has two (the chest at 12,4 and the Rift Warden\'s guaranteed drop).');
    settle(g);
    ok(walkTo(g, 9, 5, 'Vask once more'), 'the party can talk to Vask again');
    settle(g);
    ok(g.party.flags.q_ashcombe_done === 1, 'and the quest stays closed, not paid twice');
    ok(g.party.gold === goldBefore + 300, `the reward is paid once (${g.party.gold})`);

    console.log(`  note:  finished on day ${g.world.day} at ${String(g.world.hour).padStart(2, '0')}:${String(g.world.minute).padStart(2, '0')} after ${g.world.state.steps} steps, ${g.party.gold} gold, xp ${g.party.members[0].xp}`);
  },

  /** The Lanterns' contract: the shard out of Ashcombe, then the Drowned Chapel it buys you. */
  chapel() {
    const g = newRun(501);

    // Perrin wants the stone before the Regent sees it.
    ok(visit(g, 12, 5, 'Adjunct Perrin'), 'the party can reach Adjunct Perrin');
    ok(g.party.flags.q_shard === 1, 'talking to Perrin opens the Lanterns\' contract');
    settle(g);
    provision(g);

    // The shard is past the Rift Warden, so Ashcombe has to be cleared first.
    ok(leaveBy(g, 7, 15, 'the south gate'), 'the party leaves town');
    ok(walkTo(g, 24, 20, 'the Ashcombe farmhouse'), 'and reaches Ashcombe');
    ok(walkTo(g, 3, 3, 'the key chest'), 'and the cellar key');
    press(g, 'interact'); settle(g);
    ok(walkTo(g, 4, 10, 'the Wardstone shard'), 'and fights through to the Rift');
    press(g, 'interact'); settle(g);
    ok(countItem(g.party, 'wardstone_shard') === 1, 'the chest beside the Rift holds a Wardstone shard');
    ok(walkTo(g, 3, 10, 'the Rift itself'), 'the party can stand at the Rift');
    ok(g.world.used('mill_core'), 'which describes itself');

    // Home, paid, and pointed south.
    ok(leaveBy(g, 1, 1, 'the cellar stairs'), 'the party climbs out');
    ok(walkTo(g, 16, 3, 'the Harrow gate'), 'and walks home');
    ok(approach(g, 12, 5, 'Perrin'), 'and reaches Perrin');
    const gold = g.party.gold;
    press(g, 'interact');
    ok(g.party.flags.q_shard_done === 1, 'Perrin takes the shard');
    ok(g.party.gold === gold + 150, `and pays 150 gold (${gold} -> ${g.party.gold})`);
    ok(countItem(g.party, 'wardstone_shard') === 0, 'the shard changes hands');
    settle(g);
    provision(g);

    // Earn the level. This is the loop the whole slice is built around: out to the Shelf, back to
    // Harrow to be patched up and to buy what the experience has paid for, and out again.
    const levelled = campaign(g, () => g.party.members.every((m) => m.level >= 2));
    townPhase(g);
    ok(g.party.members.every((m) => m.xp >= xpForLevel(2)), `the Shelf pays for a level (${g.party.members.map((m) => m.xp).join('/')} xp against ${xpForLevel(2)})`);
    ok(g.party.members.every((m) => m.level >= 2), `and the Warden Drillyard sells it to all six (levels ${g.party.members.map((m) => m.level).join('')})`);
    void levelled;
    ok(g.party.members[5].spells.includes('sleep'), 'the sorcerer levels into Slumber');

    // Whole again before going under: the temple raises, a night in town restores.
    townPhase(g);
    ok(g.party.members.every((m) => m.hp === m.maxHp), `the town puts the company back on its feet (${g.party.members.map((m) => `${m.hp}/${m.maxHp}`).join(' ')})`);

    // South past the marsh, into the chapel.
    ok(leaveBy(g, 7, 15, 'the south gate'), 'the party sets out for the marsh');
    ok(walkTo(g, 7, 24, 'the marsh steps'), 'and finds the steps under the reeds');
    ok(g.log.some((l) => /reeds/.test(l)), 'the reeds give the place away');
    ok(leaveBy(g, 7, 25, 'the chapel stair'), 'and goes down');
    ok(g.world.map.id === 'chapel' && g.world.state.x === 14 && g.world.state.y === 14, `into the Drowned Chapel (${g.world.map.id} ${g.world.state.x},${g.world.state.y})`);
    ok(g.log.some((l) => /standing water/.test(l)), 'and the arrival cell speaks for itself');

    // A torch is worth carrying: it doubles what the party can see underground.
    ok(g.world.sight === 2, `a dungeon without light shows two cells (${g.world.sight})`);
    ok(equipFromBag(g, 0, 'Torch'), 'the knight lights a torch');
    ok(g.world.state.light > 0 && g.world.sight === 4, `and now sees four (${g.world.sight}, ${g.world.state.light} steps of light)`);
    ok(countItem(g.party, 'torch') === 0, 'the torch is spent');

    // The locked crypt.
    ok(walkTo(g, 1, 13, 'the first chest'), 'the party can reach the first chest');
    press(g, 'interact'); settle(g);
    ok(countItem(g.party, 'key_iron') === 1, 'it holds an iron key');
    ok(walkTo(g, 12, 11, 'the east crypt'), 'the key opens the east crypt');
    press(g, 'interact'); settle(g);
    ok(countItem(g.party, 'axe') === 1 && countItem(g.party, 'shield') === 1, 'and the crypt holds the hand axe and the kite shield');

    // The west crypt is behind a wall that is not one.
    ok(walkTo(g, 6, 10, 'the west crypt wall'), 'the party can reach the west wall');
    for (let k = 0; k < 4 && g.world.state.facing !== 3; k++) press(g, 'turnRight');
    press(g, 'forward'); settle(g);
    ok(g.world.state.x === 6, 'the wall at 5,10 will not let the party through');
    ok(g.log.some((l) => /wall blocks/.test(l)), 'and says so like any other wall');
    press(g, 'search');
    ok(g.world.map.at(5, 10).door === 'door', 'F finds the door behind it');
    press(g, 'forward'); settle(g);
    ok(walkTo(g, 3, 11, 'the west crypt chest'), 'and the west crypt opens');
    press(g, 'interact'); settle(g);
    ok(countItem(g.party, 'longbow') === 1, 'which is where the long bow was');

    // The apse, the Prior, and a font only a swimmer reaches.
    camp(g);
    ok(vigour(g) >= 0.5, `the party is in shape for the altar (${g.party.members.map((m) => `${m.hp}/${m.maxHp}`).join(' ')})`);
    ok(walkTo(g, 6, 4, 'the altar'), 'the party can reach the altar');
    ok(g.world.used('ch_altar'), 'the altar describes itself');
    // A set piece is allowed to send you back down the nave to think about it. Rest and go again.
    let attempts = 0;
    for (; attempts < 4 && g.world.liveGroups().some((x) => x.def.id === 'c_prior'); attempts++) {
      camp(g);
      if (!walkTo(g, 7, 4, 'the Hollow Prior')) break;
    }
    ok(!g.world.liveGroups().some((x) => x.def.id === 'c_prior'), `the Hollow Prior is put down (${attempts} attempt${attempts === 1 ? '' : 's'})`);
    ok(partyCan(g.party).swim, 'the party has a Tidefolk, so the font is not out of reach');
    ok(walkTo(g, 7, 2, 'the font'), 'and can swim out to the font');
    press(g, 'interact'); settle(g);
    ok(countItem(g.party, 'chain') === 1, 'the font holds the chain mail');

    // Out, the long way, through whatever has crept back in behind them.
    camp(g);
    ok(retreatTo(g, 14, 14, 'the chapel stair'), 'the party climbs back out');
    ok(g.world.map.id === 'shelf', `into the marsh (${g.world.map.id} ${g.world.state.x},${g.world.state.y})`);
    ok(retreatTo(g, 16, 3, 'the Harrow gate'), 'and walks home');
    const best = g.party.members.reduce((a, m) => (m.xp > a.xp ? m : a));
    console.log(`  note:  finished on day ${g.world.day} after ${g.world.state.steps} steps, ${g.party.gold} gold, ${best.xp} xp (level 3 is ${xpForLevel(3)}).`);
  },

  /** The same journey again on other seeds: finishing must not depend on lucky dice. */
  seeds() {
    for (const seed of [11, 22, 33, 44, 55]) {
      const g = newRun(seed);
      walkTo(g, 9, 5, 'Vask'); settle(g); provision(g);
      const done = walkTo(g, 9, 5, 'Vask') && settleQuiet(g)
        && leaveBy(g, 7, 15, 'the gate')
        && walkTo(g, 23, 20, 'Ashcombe') && leaveBy(g, 24, 20, 'the farmhouse')
        && walkTo(g, 3, 3, 'the key') && grab(g)
        && walkTo(g, 12, 4, 'the wand') && grab(g)
        && leaveBy(g, 1, 1, 'the stairs')
        && walkTo(g, 16, 3, 'the gate home')
        && walkTo(g, 9, 5, 'Vask');
      ok(done && g.party.flags.q_ashcombe_done === 1,
        `seed ${seed}: the quest can be finished (day ${g.world.day}, ${g.world.state.steps} steps, ${g.party.members.filter((m) => !isDown(m)).length}/6 standing)`);
    }
    console.log('  note:  this route collects the wand from the chest and leaves; the Rift Warden is measured in `balance`.');
  },

  /** Is every fight winnable by a party of the level its map is tuned for, and can you reach level 2? */
  balance() {
    const maps = buildMaps();
    for (const def of MAP_DEFS) {
      const level = def.band ? def.band[0] : 1;
      for (const e of maps[def.id].encounters) {
        const win = winRate([...e.monsters], 120, level);
        const label = `${def.id}/${e.id}`.padEnd(22) + e.monsters.join(', ');
        if (isBoss([...e.monsters])) ok(win >= 0.5 && win <= 0.97, `${label} - a set piece: winnable at L${level} but not a certainty (${Math.round(win * 100)}%)`);
        else ok(win >= 0.9, `${label} - winnable at L${level} (${Math.round(win * 100)}%)`);
      }
    }

    // What the slice is worth, against what a level costs. Levels are the trainer's whole reason to
    // exist, so the content has to pay for at least one.
    let xp = 0;
    for (const def of MAP_DEFS) for (const e of maps[def.id].encounters) for (const id of e.monsters) xp += MONSTERS[id].xp;
    const each = Math.floor(xp / 6);
    ok(each >= xpForLevel(2), `clearing the slice is ${xp} xp, ${each} each: enough for level 2 (${xpForLevel(2)})`);
    ok(each < xpForLevel(3), `and not enough for level 3 (${xpForLevel(3)}), which is M1's job`);
    console.log(`  note:  level 2 costs ${Math.round(xpForLevel(2) * 6 / xp * 100)}% of a clean sweep. The Warden Drillyard trains to level 10 (${xpForLevel(10)} xp each).`);

    // And the purse has to cover the services the town advertises.
    let gold = 0;
    for (const def of MAP_DEFS) for (const f of maps[def.id].features) if (f.kind === 'chest') gold += f.gold;
    for (const def of MAP_DEFS) for (const e of maps[def.id].encounters) for (const id of e.monsters) gold += MONSTERS[id].gold[1];
    const purse = 200 + gold + 150 + 300;   // start, loot, and the two hand-ins
    const services = 50 + 80 + 100 + 25;    // guild membership, one spell, one raise, one training
    ok(purse > services * 2, `a full sweep can pay for the town twice over (${purse} gold against ${services})`);
  },

  /** Saving and loading in the middle of the journey keeps everything that was earned. */
  persistence() {
    const store = memoryStore();
    const g = newRun(401, store);
    ok(walkTo(g, 9, 5, 'Vask'), 'the party takes the contract');
    settle(g);
    ok(leaveBy(g, 7, 15, 'the gate'), 'and leaves town');
    ok(walkTo(g, 23, 20, 'Ashcombe'), 'and reaches Ashcombe');
    ok(leaveBy(g, 24, 20, 'the farmhouse'), 'and goes down');
    ok(walkTo(g, 3, 3, 'the key chest'), 'and opens the key chest');
    press(g, 'interact'); settle(g);

    const snapshot = {
      map: g.world.state.mapId, x: g.world.state.x, y: g.world.state.y, minutes: g.world.state.minutes,
      gold: g.party.gold, flags: { ...g.party.flags }, keys: countItem(g.party, 'key_iron'),
      explored: g.world.state.maps.mill.explored.reduce((a: number, b: number) => a + b, 0),
      used: Object.keys(g.world.state.maps.mill.used).sort().join(','),
      groups: JSON.stringify(g.world.state.maps.shelf.groups),
    };
    press(g, 'save');
    ok(g.log[g.log.length - 1] === 'Saved.', 'F5 writes a save');

    // Wander off and ruin things, then load it back.
    g.party.gold = 0; g.party.flags = {}; press(g, 'forward', 'forward');
    press(g, 'load');
    ok(g.log[g.log.length - 1] === 'Loaded.', 'F9 reads it back');
    ok(g.world.state.mapId === snapshot.map && g.world.state.x === snapshot.x && g.world.state.y === snapshot.y, 'the party is back where it saved');
    ok(g.world.state.minutes === snapshot.minutes, 'the clock is restored');
    ok(g.party.gold === snapshot.gold, `the purse is restored (${g.party.gold})`);
    ok(g.party.flags.q_ashcombe === snapshot.flags.q_ashcombe, 'the contract is still taken');
    ok(countItem(g.party, 'key_iron') === snapshot.keys, 'the iron key is still carried');
    ok(g.world.state.maps.mill.explored.reduce((a: number, b: number) => a + b, 0) === snapshot.explored, 'the automap is restored');
    ok(Object.keys(g.world.state.maps.mill.used).sort().join(',') === snapshot.used, 'the opened chest stays opened');
    ok(JSON.stringify(g.world.state.maps.shelf.groups) === snapshot.groups, 'the monsters killed on the road stay killed');

    // And the journey can be finished from the loaded game.
    ok(walkTo(g, 12, 4, 'the wand'), 'the loaded game can carry on');
    press(g, 'interact'); settle(g);
    ok(countItem(g.party, 'survey_wand') === 1, 'and still collect the wand');

    // A fresh Game offers Continue, and it lands in the same place.
    const g2 = new Game(store);
    ok((g2.top as unknown as { items: string[] }).items[0] === 'Continue', 'a new session offers Continue');
    press(g2, 'interact');
    ok(g2.world.state.mapId === snapshot.map && g2.party.flags.q_ashcombe === 1, 'and Continue resumes the run');
  },

  /** The same seed and the same keys must play out identically: the determinism the design promises. */
  determinism() {
    const play = (seed: number): string => {
      const g = newRun(seed);
      walkTo(g, 9, 5, 'Vask'); settle(g);
      leaveBy(g, 7, 15, 'the gate');
      walkTo(g, 23, 20, 'Ashcombe');
      return JSON.stringify({
        log: g.log, steps: g.world.state.steps, minutes: g.world.state.minutes, gold: g.party.gold,
        party: g.party.members.map((m) => [m.name, m.hp, m.sp, m.xp, m.conditions.join('/')]),
        groups: g.world.state.maps.shelf.groups,
      });
    };
    const a = play(777), b = play(777), c = play(778);
    ok(a === b, 'the same seed and the same keys replay the same journey');
    ok(a !== c, 'a different seed is a different journey');
  },
};

/** A premade party levelled the honest way, for measuring a fight against the band it is tuned for. */
function partyAtLevel(level: number, rng: ReturnType<typeof makeRng>): ReturnType<typeof defaultParty> {
  const p = defaultParty(rng);
  if (level > 1) for (const m of p.members) { m.xp = xpForLevel(level); levelUp(m, rng); }
  return p;
}

/** How often a full-health party of the given level wins a fight, played as well as the policy knows. */
function winRate(monsters: string[], tries: number, level: number): number {
  let won = 0;
  for (let seed = 1; seed <= tries; seed++) {
    const r = makeRng(seed);
    const p = partyAtLevel(level, r);
    const s = startCombat(p, [{ id: 'g', monsters }], r);
    for (let i = 0; i < 2000 && s.outcome === 'ongoing'; i++) {
      const t = currentTurn(s, p, r);
      if (!t) break;
      if (t.side === 'monster') { monsterAct(s, p, r); continue; }
      const c = p.members[t.i];
      const hurt = p.members.findIndex((m) => !isDown(m) && m.hp <= m.maxHp * 0.4);
      const target = aliveMonsters(s)[0];
      if (hurt >= 0 && c.spells.includes('heal') && c.sp >= spell('heal').sp) { partyAct(s, p, r, { type: 'cast', spellId: 'heal', target: hurt }); continue; }
      if (hurt >= 0 && [...c.pack, ...p.bag].includes('potion_heal')) { partyAct(s, p, r, { type: 'use', itemId: 'potion_heal', target: hurt }); continue; }
      if (c.spells.includes('spark') && c.sp >= spell('spark').sp) { partyAct(s, p, r, { type: 'cast', spellId: 'spark', target }); continue; }
      if (canAttackFromRow(c, t.i)) partyAct(s, p, r, { type: 'attack', target });
      else partyAct(s, p, r, { type: 'defend' });
    }
    if (s.outcome === 'victory') won++;
  }
  return won / tries;
}

/** A fight built around something worth 100xp or more is a set piece, and is allowed to be lost. */
const isBoss = (monsters: string[]): boolean => monsters.some((id) => MONSTERS[id].xp >= 100);

/** settle(), as an expression, so chapters can chain steps with &&. */
function settleQuiet(g: Game): boolean { settle(g); return true; }
/** Open the chest under the party's feet. */
function grab(g: Game): boolean { press(g, 'interact'); settle(g); return true; }

const wanted = process.argv.slice(2);
for (const [chapter, fn] of Object.entries(suites)) {
  if (wanted.length && !wanted.includes(chapter)) continue;
  console.log(`\n${chapter}`);
  try { fn(); } catch (e) { failures++; console.log('  FAIL: threw ' + (e instanceof Error ? e.stack : String(e))); }
}
console.log(failures ? `\n${failures} FAILURE(S)` : '\nPLAYTHROUGH OK: the slice can be played from the title screen to the hand-in.');
process.exit(failures ? 1 : 0);
