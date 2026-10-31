// The feats on stamina (#1113; DESIGN §5, game/combat/feats.ts): the frame and the knight's four.
// Stamina is built in a fight by blows that land, the member's own and those on it, each of the four
// classes one way faster, to six, and is gone with the fight; a feat costs it and takes the turn.
// Built off (`FEATS_ON`): in play no stamina is built, no feat is legal or offered, the bots try none
// and a fight draws as before, which a fight with the feats on and none spent holds to the draw; a
// fight's `feats` turns them on for a tool, as here. The knight's Challenge, Mighty Blow, Rally and
// Champion's Strike each do what DESIGN says, and the bots spend on them by the knight's policy. The
// Feat list says what the feat under its cursor does and, on Space, why a barred one is barred. A
// class's feats to come add their lines in a block of their own beside the knight's.
import { makeRng } from '../../src/lib/engine/rng.ts';
import type { RngInstance } from '../../src/lib/engine/rng.ts';
import { measureText } from '../../src/lib/engine/text.ts';
import { createCharacter, createParty, CLASSES, FEATS_ON, TRAITS } from '../../src/game/party.ts';
import type { Character, ClassId, Party } from '../../src/game/party.ts';
import { startCombat, partyAct, currentTurn, monsterAct, buffHit } from '../../src/game/combat.ts';
import { RALLY_HIT } from '../../src/game/combat/state.ts';
import type { CombatState, CombatOpts, PartyAction } from '../../src/game/combat.ts';
import { FEATS, STAMINA_MAX, featsOf, featsKnown, featFor, staminaOf } from '../../src/game/combat/feats.ts';
import { CHALLENGE_ROUNDS, RALLY_ROUNDS } from '../../src/game/combat/feats/knight.ts';
import { aimable } from '../../src/game/combat/feats.ts';
import { FLURRY_MORE } from '../../src/game/combat/feats/monk.ts';
import { FLURRY_LINE, PALM_LINE, LEAP_LINE, WIND_LINE, FOLLOW_LINE } from '../../src/game/combat/lines.ts';
import { aliveMonsters } from '../../src/game/combat.ts';
import { newerCompany } from '../kit/company.ts';
import { CRIT_LINE, SNEAK_LINE, MIGHTY_LINE } from '../../src/game/combat/lines.ts';
import { botTurn, asSeen, asWritten, PLAYED } from '../../src/game/bot.ts';
import type { BotOpts } from '../../src/game/bot.ts';
import { SKILLS } from '../../src/game/skills.ts';
import type { ItemDef } from '../../src/game/items.ts';
import type { MonsterDef } from '../../src/game/monsters.ts';
import type { Tables } from '../../src/game/tables.ts';
import type { Action } from '../../src/ui/actions.ts';
import { LAYOUT } from '../../src/ui/frame.ts';
import { CombatScreen, commandRows, featRows, featHint, featBar } from '../../src/ui/combat.ts';
import { MONSTERS, SPELLS, TABLES } from '../../src/content/index.ts';
import { gateCompany } from '../kit/company.ts';
import { gateTurn } from '../kit/fight.ts';
import { headlessGame, drive } from '../kit/headless.ts';
import { ok } from './lib.ts';

/** A blade that always does 1, so a blow's damage is the same on every draw: 1, +4, and the knight's Might and Weapon Master. */
const BLADE: ItemDef = { id: 'fx_blade', name: 'Blade', slot: 'weapon', price: 0, dice: 1, sides: 1, bonus: 4 };
const T: Tables = { ...TABLES, items: { ...TABLES.items, fx_blade: BLADE } };
/** Foes from the rat: one that never hits back and is hit at the most, one that always hits for 1, one never hit but by a sure blow. */
const foe = (id: string, d: Partial<MonsterDef>): MonsterDef => ({ ...MONSTERS.rat, inflict: undefined, id, hp: 5000, dice: 1, sides: 1, bonus: 0, ...d });
const STRAW = foe('test_straw', { ac: -100, attack: -50, speed: 1 }), BITER = foe('test_biter', { attack: 50, speed: 99 }), WALL = foe('test_wall', { ac: 1000, attack: -50, speed: 1 });

/** A member of a class at a level, on its class's stats, with the blade where `blade`. */
function member(cls: ClassId, level = 1, blade = false): Character {
  const c = createCharacter(TABLES, cls, 'human', cls, CLASSES[cls].stats, makeRng(1));
  c.level = level;
  if (blade) c.equipment.weapon = 'fx_blade';
  return c;
}
/** A generator that counts its draws, drawing as makeRng's does. */
function counted(seed: number): RngInstance & { draws: () => number } {
  const r = makeRng(seed);
  let n = 0;
  const next = (): number => { n++; return r.next(); };
  return {
    next, seed: r.seed, range: (a, b) => a + (b - a) * next(), int: (a, b) => a + Math.floor(next() * (b - a + 1)),
    pick: (arr) => (arr.length ? arr[Math.floor(next() * arr.length)] : undefined), chance: (p) => next() < p, draws: () => n,
  };
}
/** A fight of `p` against groups of foes, the feats on unless `opts` says, on seed `seed`. */
function fight(p: Party, groups: readonly (readonly MonsterDef[])[], seed: number, opts: CombatOpts = { feats: true }): { f: CombatState; rng: ReturnType<typeof counted> } {
  const rng = counted(seed);
  return { f: startCombat(T, p, groups.map((monsters, k) => ({ id: `g${k}`, monsters })), rng, opts), rng };
}
/** The fight played on to member `i`'s turn, the monsters by `monsterAct` and the rest bracing: false if it ends first. */
function until(f: CombatState, p: Party, rng: RngInstance, i: number): boolean {
  for (let n = 0; n < 200 && f.outcome === 'ongoing'; n++) {
    const t = currentTurn(f, p, rng);
    if (!t) return false;
    if (t.side === 'party' && t.i === i) return true;
    if (t.side === 'monster') monsterAct(f, p, rng); else partyAct(f, p, rng, { type: 'defend' });
  }
  return false;
}
/** Member `i`'s action on its turn, from a stamina of `st`: the log lines it added, or null where it was refused. */
function act(f: CombatState, p: Party, rng: RngInstance, i: number, a: PartyAction, st?: number): string[] | null {
  if (!until(f, p, rng, i)) return null;
  if (st !== undefined) f.stamina![i] = st;
  const at = f.log.length;
  return partyAct(f, p, rng, a) ? f.log.slice(at) : null;
}
const feat = (featId: string, target = 0): PartyAction => ({ type: 'feat', featId, target });
const KNIGHT = FEATS.filter((x) => x.cls === 'knight');

export function feats(): void {
  frame();
  knight();
  monk();
}

function frame(): void {
  // Off in play: no stamina, no feat legal or offered, the bots spend nothing, whatever the member has.
  const k = member('knight', 23, true), p = createParty([k]), off = fight(p, [[STRAW]], 1, {});
  ok(!FEATS_ON && off.f.stamina === undefined && off.f.feats === undefined && featsOf(off.f, p, 0).length === 0 && staminaOf(off.f, k, 0) === undefined,
    'the feats are built off: in play a fight builds no stamina and a knight of 23 has no feat it may use');
  until(off.f, p, off.rng, 0);
  const was = off.f.log.length, drawn = off.rng.draws(), refused = KNIGHT.every((x) => !partyAct(off.f, p, off.rng, feat(x.id)));
  ok(refused && off.f.log.length === was && off.rng.draws() === drawn && commandRows(T, p, off.f, 0)[1].label === 'Cast',
    'off, each of the knight\'s feats is refused with nothing drawn or said, and its menu reads Cast as ever');
  ok(featFor(off.f, p, 0, 0) === undefined && botTurn(off.f, p, off.rng, 0, asWritten, PLAYED).type === 'attack', 'off, the bots with the feats asked for still strike: none is tried');

  // Stamina builds without a draw: the same fights with the feats on and none spent play as with them
  // off, line for line and draw for draw (the premade six of 4 and of 12 on three groups, five seeds).
  const groups: MonsterDef[][] = [['boar', 'boar', 'boar'], ['skeleton', 'skeleton', 'drowned'], ['smuggler', 'smuggler_bowman', 'smuggler_captain']].map((g) => g.map((id) => MONSTERS[id]));
  let same = 0, built = 0, cases = 0;
  for (const level of [4, 12]) for (const g of groups) for (let seed = 1; seed <= 5; seed++) {
    const play = (opts: CombatOpts): { log: string; draws: number; st: number } => {
      const q = gateCompany(level, seed), { f, rng } = fight(q, [g], seed, opts);
      for (let n = 0; n < 400 && f.outcome === 'ongoing'; n++) { const t = currentTurn(f, q, rng); if (!t) break; if (t.side === 'monster') monsterAct(f, q, rng); else botTurn(f, q, rng, t.i); }
      return { log: f.log.join('\n'), draws: rng.draws(), st: (f.stamina ?? []).reduce((a, b) => a + b, 0) };
    };
    const a = play({}), b = play({ feats: true });
    cases++;
    if (a.log === b.log && a.draws === b.draws) same++;
    if (b.st > 0) built++;
  }
  ok(same === cases && built > 0, `the feats on and none spent, ${same} of ${cases} fights play as with them off, line and draw alike (stamina built in ${built})`);

  // Each blow of its own that lands builds 1, each foe's that lands on it 1, and each class 1 more its way.
  const hitsBy = (log: readonly string[], who: string): number => log.filter((l) => l.startsWith(`${who} hits `)).length;
  const hitsOn = (log: readonly string[], who: string): number => log.filter((l) => / hits /.test(l) && !l.startsWith(`${who} `) && l.includes(` hits ${who} `)).length;
  const after = (cls: ClassId, foes: MonsterDef[], turns: number, set?: (c: Character) => void): { st: number; mine: number; on: number; log: string[] } => {
    const c = member(cls, 1, cls !== 'monk'), q = createParty([c]), { f, rng } = fight(q, [foes], 3);
    set?.(c);
    for (let n = 0; n < turns; n++) act(f, q, rng, 0, { type: 'attack', target: f.monsters.findIndex((m) => m.hp > 0) });
    return { st: f.stamina![0], mine: hitsBy(f.log, c.name), on: hitsOn(f.log, c.name), log: f.log };
  };
  const cleric = after('cleric', [STRAW], 3), knightOwn = after('knight', [STRAW], 3);
  ok(knightOwn.mine > 0 && knightOwn.st === knightOwn.mine && cleric.mine > 0 && cleric.st === 0,
    `a knight's own blows that land build 1 each (${knightOwn.mine} hits, ${knightOwn.st}); a cleric's build none`);
  const struckKnight = after('knight', [BITER], 1), struckThief = after('thief', [BITER], 1);
  ok(struckKnight.on > 0 && struckKnight.st === Math.min(STAMINA_MAX, 2 * struckKnight.on + struckKnight.mine) && struckThief.on > 0 && struckThief.st === Math.min(STAMINA_MAX, struckThief.on + struckThief.mine),
    `a foe's blow that lands on a member builds 1, on the knight 2 (the knight struck ${struckKnight.on}, ${struckKnight.st}; the thief ${struckThief.on}, ${struckThief.st})`);
  const capped = after('knight', [BITER, BITER, BITER], 6);
  ok(capped.st === STAMINA_MAX && STAMINA_MAX === 6, `stamina holds ${STAMINA_MAX} at most (the knight struck ${capped.on} times and hit ${capped.mine})`);
  const raging = after('barbarian', [STRAW], 3, (c) => { c.hp = 1; }), calm = after('barbarian', [STRAW], 3);
  ok(raging.mine > 0 && raging.st === Math.min(STAMINA_MAX, 2 * raging.mine) && calm.mine > 0 && calm.st === calm.mine,
    `the barbarian's blows that land while it rages build 2 (${raging.mine} hits, ${raging.st}), and 1 while it does not (${calm.mine}, ${calm.st})`);
  const sneaky = after('thief', [STRAW], 3), sneaks = sneaky.log.filter((l) => l.includes(SNEAK_LINE)).length;
  ok(sneaks > 0 && sneaks < sneaky.mine && sneaky.st === sneaky.mine + sneaks, `the thief's sneak attacks that land build 2 and its other blows 1 (${sneaks} of ${sneaky.mine} hits, ${sneaky.st})`);
  const felling = after('monk', [foe('test_frail', { hp: 1, ac: -100, attack: -50, speed: 1 }), STRAW], 3), fell = felling.log.filter((l) => l.includes(' dies.')).length;
  ok(fell === 1 && felling.mine > fell && felling.st === felling.mine + fell, `the monk's blow that fells its foe builds 2 and its others 1 (${felling.mine} hits, ${fell} felling, ${felling.st})`);
  const swept = after('knight', [foe('test_sweeper', { attack: 50, speed: 99, sweep: { chance: 1 } })], 2);
  ok(swept.log.some((l) => l.includes(' sweeps the front row: ')) && swept.on === 0 && swept.st === swept.mine, `a sweep that lands builds nothing: a blow is what the log says hits (${swept.st})`);

  // A blow of its own that misses builds none, and a foe's blow that fells the member builds as any.
  const missing = after('knight', [WALL], 3), felled = after('thief', [BITER], 1, (c) => { c.hp = 1; });
  ok(missing.mine < 3 && missing.st === Math.min(STAMINA_MAX, missing.mine + 2 * missing.on) && felled.on === 1 && felled.log.some((l) => l.endsWith(' falls!')) && felled.st === felled.on + felled.mine,
    `a blow of its own that misses builds none (${3 - missing.mine} of 3 missed, ${missing.st} built), and a foe's that fells it builds as any (${felled.st})`);

  // The fight's, not the member's: none at its start, none kept after it, never saved.
  const kept = member('knight', 1, true), q = createParty([kept]), first = fight(q, [[BITER]], 5);
  act(first.f, q, first.rng, 0, { type: 'defend' });
  const second = fight(q, [[STRAW]], 6);
  ok(first.f.stamina![0] > 0 && second.f.stamina!.every((n) => n === 0) && !JSON.stringify(q).includes('stamina'),
    `a fight starts at none and the next starts at none again (${first.f.stamina![0]} built in the first); nothing of it is the member's`);

  // The registry: each feat as DESIGN §5 has it, the costs 2 to 5 at 1, 8, 15 and 23, no name a
  // skill's, a trait's or a spell's; what a member has by its level and its stamina.
  const taken = new Set([...Object.values(SKILLS), ...Object.values(TRAITS), ...Object.values(SPELLS)].map((x) => x.name));
  ok(new Set(FEATS.map((x) => x.id)).size === FEATS.length && FEATS.every((x) => x.cost >= 2 && x.cost <= 5 && [1, 8, 15, 23].includes(x.level) && !taken.has(x.name) && !!x.text),
    `${FEATS.length} feats, each its own id, costing 2 to 5 at 1, 8, 15 or 23, no name a skill's, trait's or spell's`);
  const has = (level: number, st: number, slot = 0): string => {
    const c = member('knight', level, true), r = createParty(slot ? [member('cleric'), member('cleric'), member('cleric'), c] : [c]), { f } = fight(r, [[STRAW]], 1);
    f.stamina![slot] = st;
    return featsOf(f, r, slot).map((x) => x.id).join() + '/' + featsKnown(c).length;
  };
  const by = [has(1, 6), has(8, 2), has(8, 3), has(23, 4), has(23, 6), has(23, 1), has(23, 6, 3)];
  ok(by.join(' ') === 'challenge/1 challenge/2 challenge,mighty_blow/2 challenge,mighty_blow,rally/4 challenge,mighty_blow,rally,champions_strike/4 /4 challenge,rally/4',
    `a knight has its feats by its level and may use those it affords, a blow's not from the back row with a blade (${by.join(' ')})`);
  // A feat takes the turn, and one who cannot act never spends.
  const r = createParty([member('knight', 8, true), member('cleric')]), { f, rng } = fight(r, [[STRAW]], 2), turn = (until(f, r, rng, 0), f.turn);
  f.stamina![0] = 3;
  ok(partyAct(f, r, rng, feat('mighty_blow')) && f.turn === turn + 1 && f.stamina![0] < 3, 'a feat takes the turn and its cost');
  const fallen = createParty([member('knight', 8, true), member('cleric')]), z = fight(fallen, [[STRAW]], 2);
  fallen.members[0].hp = -1; fallen.members[0].conditions.push('unconscious'); z.f.stamina![0] = 5;
  ok(!until(z.f, fallen, z.rng, 0) && z.f.round > 3 && z.f.stamina![0] === 5, `a knight fallen never has the turn, so never spends, and keeps what it built to the fight's end (${z.f.round} rounds)`);
}

function knight(): void {
  ok(KNIGHT.map((x) => `${x.name} ${x.cost} ${x.level}`).join(', ') === "Challenge 2 1, Mighty Blow 3 8, Rally 4 15, Champion's Strike 5 23",
    "the knight's four as DESIGN §5 has them: Challenge (2) at 1, Mighty Blow (3) at 8, Rally (4) at 15, Champion's Strike (5) at 23");

  // Challenge: a group strikes only the knight while it holds, the round it is made in and the next,
  // and another group strikes as it would.
  let held = 0, free = 0, after = 0, seeds = 0;
  const onKnight = (l: string): boolean => / knight\b/.test(l), GNAWER = foe('test_gnawer', { attack: 50, speed: 98, name: 'Gnawer', plural: 'Gnawers' });
  for (let seed = 1; seed <= 6; seed++) {
    const p = createParty([member('knight', 1, true), member('cleric'), member('monk')]), { f, rng } = fight(p, [[BITER, BITER, BITER], [GNAWER, GNAWER, GNAWER]], seed);
    const said = act(f, p, rng, 0, feat('challenge'), 2), lines: { round: number; line: string }[] = [];
    while (f.outcome === 'ongoing' && f.round <= 3) {
      const t = currentTurn(f, p, rng);
      if (!t) break;
      const round = f.round, at = f.log.length;
      if (t.side === 'monster') monsterAct(f, p, rng); else partyAct(f, p, rng, { type: 'defend' });
      if (t.side === 'monster') lines.push(...f.log.slice(at).map((line) => ({ round, line })));
    }
    const rats = (round: number): string[] => lines.filter((x) => x.round === round && x.line.startsWith(`${MONSTERS.rat.name} `)).map((x) => x.line);
    const gnawers = lines.filter((x) => x.round === 2 && x.line.startsWith('Gnawer ')).map((x) => x.line);
    if (said?.[0] === `knight challenges 3 ${MONSTERS.rat.plural}.`) seeds++;
    if (rats(2).length === 3 && rats(2).every(onKnight)) held++;
    if (gnawers.length === 3 && !gnawers.every(onKnight)) free++;
    if (rats(3).length === 3 && !rats(3).every(onKnight)) after++;
  }
  ok(CHALLENGE_ROUNDS === 2 && held === 6 && free > 0 && after > 0,
    `challenged, a group's every blow of the next round falls on the knight (${held} of 6 seeds) while another group's do not (${free}), and once it ends some fall elsewhere (${after})`);
  ok(seeds === 6, `the log says it: "knight challenges 3 ${MONSTERS.rat.plural}."`);

  // Mighty Blow: one blow, sure to land on a foe it would hit one time in twenty, for double; it
  // draws its die and nothing else, no crit with crits on and a whole chance; one blow at any level.
  const blow = (level: number, crits: boolean, seed: number, luck = 10): { lines: string[]; draws: number } => {
    const c = member('knight', level, true);
    c.stats.luck = luck;
    if (level >= 11) c.prestige = 1;
    const p = createParty([c]), { f, rng } = fight(p, [[WALL]], seed, { feats: true, crits });
    until(f, p, rng, 0);
    f.stamina![0] = 3;
    const was = rng.draws(), lines = act(f, p, rng, 0, feat('mighty_blow')) ?? [];
    return { lines, draws: rng.draws() - was };
  };
  // A plain blow of the blade, from the first seed it lands on.
  const plain = (seed = 1): number => { const p = createParty([member('knight', 8, true)]), { f, rng } = fight(p, [[STRAW]], seed), hit = act(f, p, rng, 0, { type: 'attack', target: 0 })?.find((l) => l.includes(' hits ')); return hit ? Number(/ for (\d+)\./.exec(hit)?.[1]) : plain(seed + 1); };
  const mighty = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((seed) => blow(8, false, seed)), lucky = blow(8, true, 3, 60), two = blow(11, false, 4);
  ok(mighty.every((m) => m.lines.length === 1 && m.lines[0].endsWith(`for ${2 * plain()}. ${MIGHTY_LINE}`) && m.draws === 1),
    `a mighty blow lands on ten seeds of ten where a blow lands one in twenty, for double a blow's ${plain()}, drawing its die alone ("${mighty[0].lines[0]}")`);
  ok(lucky.lines.length === 1 && !lucky.lines[0].includes(CRIT_LINE) && lucky.lines[0].includes(`for ${2 * plain()}.`) && lucky.draws === 1 && two.lines.length === 1,
    'it is no crit and draws no chance, crits on and the knight\'s chance whole; and it is one blow where the knight has two');
  const back = createParty([member('cleric'), member('cleric'), member('cleric'), member('knight', 8, true)]), bk = fight(back, [[STRAW]], 1);
  ok(act(bk.f, back, bk.rng, 3, feat('mighty_blow'), 3) === null && bk.f.stamina![3] === 3, 'from the back row with a blade it is refused, and nothing spent');

  // Rally: the front row hits +2 for three rounds and shakes off sleep and paralysis; the back row not.
  const p = createParty([member('knight', 15, true), member('monk'), member('barbarian'), member('cleric')]), { f, rng } = fight(p, [[STRAW]], 1);
  until(f, p, rng, 0);
  p.members[1].conditions.push('asleep'); p.members[2].conditions.push('paralysed'); p.members[3].conditions.push('asleep');
  const before = buffHit(f, p, 0), said = act(f, p, rng, 0, feat('rally'), 4);
  const lifted = buffHit(f, p, 0) - before, behind = buffHit(f, p, 3) - before, freed = p.members.map((m) => m.conditions.join('') || '-').join(' ');
  ok(RALLY_ROUNDS === 3 && lifted === RALLY_HIT && RALLY_HIT === 2 && behind === 0 && freed === '- - - asleep' && said?.[0] === `${p.members[0].name} rallies the front row. ${p.members[1].name} and ${p.members[2].name} shake it off.`,
    `a rally lifts the front row's to-hit by ${lifted} and not the back row's, and frees its sleeper and its held (${freed}): "${said?.[0]}"`);
  const rounds: number[] = [buffHit(f, p, 0) - before];
  while (f.outcome === 'ongoing' && rounds.length < 4) {
    const t = currentTurn(f, p, rng);
    if (!t) break;
    if (f.round > rounds.length) rounds.push(buffHit(f, p, 0) - before);
    if (t.side === 'monster') monsterAct(f, p, rng); else partyAct(f, p, rng, { type: 'defend' });
  }
  ok(rounds.join() === '2,2,2,0', `it lasts the round it is made in and the two after, as Bless counts (rounds 1 to 4: ${rounds.join(', ')})`);

  // Champion's Strike: every blow of the turn that lands crits, crits off as on, and draws no chance.
  const champion = (crits: boolean, seed: number, cs = true): { lines: string[]; draws: number } => {
    const c = member('knight', 27, true);
    c.prestige = 3;
    c.stats.luck = 60;
    const q = createParty([c]), x = fight(q, [[STRAW]], seed, { feats: true, crits });
    until(x.f, q, x.rng, 0);
    const was = x.rng.draws(), lines = act(x.f, q, x.rng, 0, cs ? feat('champions_strike') : { type: 'attack', target: 0 }, 5) ?? [];
    return { lines, draws: x.rng.draws() - was };
  };
  const offCs = champion(false, 2), onCs = champion(true, 2), onAttack = champion(true, 2, false), offAttack = champion(false, 2, false);
  const landed = offCs.lines.filter((l) => l.includes(' hits '));
  ok(offCs.lines[0] === 'knight strikes as a champion.' && offCs.lines.length === 4 && landed.length >= 2 && landed.every((l) => l.endsWith(`for ${2 * plain()}. ${CRIT_LINE}`)),
    `crits off, each of a champion's strike's three blows that lands crits for double (${landed.length} landed: "${landed[0]}")`);
  ok(onCs.draws === offCs.draws && onCs.lines.join() === offCs.lines.join() && onAttack.draws > offAttack.draws,
    `crits on, it draws what it draws with them off (${onCs.draws}), where an Attack draws a chance for each blow that lands (${offAttack.draws} to ${onAttack.draws})`);

  // The bots' policy, by construction: the dearest that pays, or a blow.
  const choose = (level: number, st: number, set?: (q: Party, f: CombatState) => void, opts: BotOpts = { feats: true }, groups: MonsterDef[][] = [[STRAW]]): string => {
    const q = createParty([member('knight', level, true), member('cleric'), member('monk')]), x = fight(q, groups, 9);
    until(x.f, q, x.rng, 0);
    x.f.stamina![0] = st;
    set?.(q, x.f);
    const a = botTurn(x.f, q, x.rng, 0, asWritten, opts);
    return a.type === 'feat' ? `${a.featId}@${a.target}` : a.type;
  };
  const wounded = (q: Party): void => { q.members[1].hp = 1; };
  const picks = [
    choose(23, 6), choose(23, 4), choose(8, 3), choose(15, 4, (q) => q.members[1].conditions.push('asleep')), choose(15, 3),
    choose(1, 2, wounded, undefined, [[STRAW], [STRAW, STRAW]]), choose(1, 2), choose(23, 6, undefined, {}),
  ];
  ok(picks.join(' ') === 'champions_strike@0 attack mighty_blow@0 rally@0 mighty_blow@0 challenge@1 attack attack',
    `the bots strike as a champion with 5, save for it under, deal a mighty blow without it, rally a sleeper of the front row, challenge the biggest group while another is under half, else strike, and spend nothing unasked (${picks.join(' ')})`);

  // The menu: Feat in Cast's place for the four with the feats on, a caster's Cast as ever; the list
  // each feat with its cost, barred where it may not be used.
  const m = createParty([member('knight', 23, true), member('cleric'), member('barbarian')]), mf = fight(m, [[STRAW]], 1);
  mf.f.stamina![0] = 3;
  const labels = [0, 1, 2].map((i) => commandRows(T, m, mf.f, i)[1]), rows = featRows(T, m, mf.f, 0);
  ok(labels.map((x) => `${x.label}${x.disabled ? '-' : ''}`).join() === 'Feat,Cast,Feat' && rows.map((x) => `${x.label}${x.disabled ? '-' : ''}`).join() === "Challenge (2),Mighty Blow (3),Rally (4)-,Champion's Strike (5)-",
    `with the feats on, the knight's and the barbarian's menu read Feat and the cleric's Cast; the knight's list on 3: ${rows.map((x) => x.label + (x.disabled ? ' barred' : '')).join(', ')}`);

  // Under the list, what the feat the cursor is on does: its words, DESIGN's, whole and wrapped to the
  // panel in three lines at most (Rally's the longest), each class's; nothing under an artifact's spell.
  {
    const axe = member('knight', 23, true), lone = createParty([axe]);
    axe.equipment.weapon = 'grims_axe';
    const list = featRows(T, lone, fight(lone, [[STRAW]], 1).f, 0), at = (c: Character, i: number): string[] => featHint(c, i);
    const whole = [...new Set(FEATS.map((x) => x.cls))].map((cls) => member(cls, 23))
      .every((c) => featsKnown(c).every((x, i) => at(c, i).join(' ') === x.text && at(c, i).every((l) => measureText(l) <= LAYOUT.map.w - 16)));
    ok(whole && at(axe, 0).length === 2 && at(axe, 2).length === 3 && list.length === 5 && list[4].label.endsWith(' LEFT)') && at(axe, 4).length === 0,
      `under the Feat list the feat the cursor is on says what it does, whole and in the panel's width (Challenge's in ${at(axe, 0).length} lines, Rally's in ${at(axe, 2).length}); none under an artifact's spell (${list[4]?.label})`);
  }

  // A feat barred says why: too little stamina, or for a blow the back row in the words of the command
  // menu's hint, that before the stamina (a row no stamina cures); nothing where it may be used.
  {
    const bar = (id: string, st: number, back = false): string => {
      const c = member('knight', 23, true), slot = back ? 3 : 0, q = createParty(back ? [member('cleric'), member('cleric'), member('cleric'), c] : [c]), { f: x } = fight(q, [[STRAW]], 1);
      x.stamina![slot] = st;
      return featBar(T, q, x, slot, FEATS.find((d) => d.id === id)!);
    };
    const why = [bar('mighty_blow', 2), bar('mighty_blow', 6, true), bar('mighty_blow', 1, true), bar('challenge', 1, true), bar('mighty_blow', 6)];
    ok(why[0] === 'Not enough stamina.' && why[3] === why[0] && why[1] === why[2] && why[1].toUpperCase() === 'BACK ROW: NEEDS A RANGED WEAPON.' && why[4] === '',
      `a feat barred says why: too little stamina, or for a blow the back row's hint, that first; a group's feat never the row's; nothing where it may be used (${why.join(' | ')})`);
  }

  // And Space on it, on the screen: the host says it, as for the spell list's "Not enough spell points.",
  // Space alone and not the cursor passing over, and the feat is not chosen; one that may be used is
  // chosen, and nothing said.
  {
    const space = (members: Character[], slot: number, st: number, down: number): { moved: string[]; said: string[]; mode: string; st: number } => {
      const g = headlessGame(4, createParty(members), T), x = startCombat(T, g.party, [{ id: 'g', monsters: [STRAW] }], g.rng, { feats: true });
      const screen = new CombatScreen(x, ['g']), read = screen as unknown as { mode: string };
      g.push(screen);
      until(x, g.party, g.rng, slot);
      x.stamina![slot] = st;
      const since = (from: number): string[] => g.log.slice(g.log.length - (g.said - from)), was = g.said;
      drive(g, ['n2', ...Array<Action>(down).fill('down')]);
      const moved = since(was), then = g.said;
      drive(g, ['interact']);
      return { moved, said: since(then), mode: read.mode, st: x.stamina![slot] };
    };
    const short = space([member('knight', 8, true), member('cleric')], 0, 2, 1), back = space([member('cleric'), member('cleric'), member('cleric'), member('knight', 8, true)], 3, 6, 1);
    const free = space([member('knight', 8, true), member('cleric')], 0, 6, 0);
    ok(short.said.join() === 'Not enough stamina.' && back.said.join() === 'Back row: needs a ranged weapon.' && short.mode === 'feat' && back.mode === 'feat' && short.st === 2 && back.st === 6
      && short.moved.length === 0 && back.moved.length === 0 && free.moved.length === 0 && free.said.length === 0 && free.mode === 'featTarget',
      `Space on Mighty Blow with 2 stamina says "${short.said}" and on it from the back row "${back.said}", the cursor passing over says nothing and the list stays (${short.mode}, ${back.mode}); on Challenge with 6 it says nothing and asks the target (${free.mode})`);
  }

  // The edges: a challenge holds the rank aimed at, not the rest of its band, on the knight who made it
  // from whatever slot; a group's feat is never aimed at a fallen foe; a rally frees none who is down;
  // and both bots play the feats once a fight has them, the gate's and the game's auto-fight.
  {
    const ARCHER = foe('test_archer', { attack: 50, speed: 97, ranged: true, name: 'Archer', plural: 'Archers' });
    let ranks = 0, loose = 0;
    for (let seed = 1; seed <= 6; seed++) {
      const q = createParty([member('cleric'), member('knight', 1, true), member('monk')]), rng = counted(seed);
      const x = startCombat(T, q, [{ id: 'band', monsters: [BITER, BITER, ARCHER, ARCHER], back: 2 }], rng, { feats: true });
      act(x, q, rng, 1, feat('challenge'), 2);
      const lines: string[] = [];
      while (x.outcome === 'ongoing' && x.round <= 2) {
        const t = currentTurn(x, q, rng);
        if (!t) break;
        const round = x.round, at = x.log.length;
        if (t.side === 'monster') monsterAct(x, q, rng); else partyAct(x, q, rng, { type: 'defend' });
        if (round === 2) lines.push(...x.log.slice(at));
      }
      const bites = lines.filter((l) => l.startsWith(`${MONSTERS.rat.name} `)), shots = lines.filter((l) => l.startsWith('Archer '));
      if (bites.length === 2 && bites.every(onKnight)) ranks++;
      if (shots.length === 2 && !shots.every(onKnight)) loose++;
    }
    ok(ranks === 6 && loose > 0, `a challenge holds the rank aimed at, on the knight who made it from the second slot (${ranks} of 6 seeds), and not its band's back rank (${loose})`);
  }
  {
    const q = createParty([member('knight', 1, true)]), { f: x, rng } = fight(q, [[STRAW, STRAW]], 1);
    until(x, q, rng, 0);
    x.monsters[1].hp = 0;
    ok(act(x, q, rng, 0, feat('challenge', 1), 2) === null && x.stamina![0] === 2 && act(x, q, rng, 0, feat('challenge', 0), 2) !== null,
      'a challenge at a fallen foe is refused and nothing spent; at one standing it is made');
  }
  {
    const q = createParty([member('knight', 15, true), member('monk'), member('barbarian')]), { f: x, rng } = fight(q, [[STRAW]], 1);
    until(x, q, rng, 0);
    q.members[1].hp = -1; q.members[1].conditions.push('unconscious', 'paralysed'); q.members[2].conditions.push('asleep');
    const rallied = act(x, q, rng, 0, feat('rally'), 4);
    ok(q.members[1].conditions.includes('paralysed') && !q.members[2].conditions.includes('asleep') && rallied?.[0] === 'knight rallies the front row. barbarian shakes it off.',
      `a rally frees none who is down: "${rallied?.[0]}"`);
  }
  {
    const play = (bot: (x: CombatState, q: Party, rng: RngInstance) => void): string => {
      const q = createParty([member('knight', 23, true), member('cleric')]), { f: x, rng } = fight(q, [[STRAW]], 1);
      until(x, q, rng, 0);
      x.stamina![0] = 5;
      const at = x.log.length;
      bot(x, q, rng);
      return x.log[at] ?? '';
    };
    const gate = play((x, q, rng) => gateTurn(x, q, rng, 0)), auto = play((x, q, rng) => { botTurn(x, q, rng, 0, asSeen, PLAYED); });
    ok(PLAYED.feats === true && gate === 'knight strikes as a champion.' && auto === gate, `both bots play the feats once a fight has them, the gate's and the game's auto-fight ("${gate}")`);
  }
}

// The monk's four (#1113, game/combat/feats/monk.ts): Flurry, Quiet Palm, Leap and Wind Step as DESIGN §5
// has them, each with its edges, off as the knight's are, and the bots' policy.
const MONKS = FEATS.filter((x) => x.cls === 'monk');
/** A monk of a level with the prestiges it brings (at 11, 19 and 27) unless given, with its staff, as it starts. */
function monkAt(level: number, prestige = [11, 19, 27].filter((l) => level >= l).length): Character {
  const c = member('monk', level);
  c.prestige = prestige;
  return c;
}
/** One that any blow that lands fells, a bowman of the back rank and one that falls to a blow: none hits back. */
const FRAIL = foe('test_frail', { hp: 1, ac: -100, attack: -50, speed: 1, name: 'Frail', plural: 'Frail' });
const BOW = foe('test_bow', { ac: -100, attack: -50, speed: 1, ranged: true, name: 'Bowman', plural: 'Bowmen' }), FRAIL_BOW = { ...BOW, id: 'test_frail_bow', hp: 1 };
/** A fight of `p` against one band, its last `back` in the back rank, the feats on unless `opts` says. */
function band(p: Party, monsters: readonly MonsterDef[], back: number, seed: number, opts: CombatOpts = { feats: true }): { f: CombatState; rng: ReturnType<typeof counted> } {
  const rng = counted(seed);
  return { f: startCombat(T, p, [{ id: 'band', monsters, back }], rng, opts), rng };
}
/** The strikes a log's lines hold, and those of them that land. */
const struck = (lines: readonly string[]): number => lines.filter((l) => / (hits|misses) /.test(l)).length;
const landing = (lines: readonly string[]): number => lines.filter((l) => / hits /.test(l)).length;

function monk(): void {
  ok(MONKS.map((x) => `${x.name} ${x.cost} ${x.level}`).join(', ') === 'Flurry 2 1, Quiet Palm 3 8, Leap 3 15, Wind Step 5 23' && MONKS.every((x) => x.target === 'blow'),
    "the monk's four as DESIGN §5 has them: Flurry (2) at 1, Quiet Palm (3) at 8, Leap (3) at 15, Wind Step (5) at 23, each struck at a foe");

  // By its level and its stamina, a blow's from a row it strikes from (the back only from its second
  // prestige), Leap only while a foe of a back rank stands.
  const has = (level: number, st: number, back = true, slot = 0): string => {
    const c = monkAt(level), q = createParty(slot ? [member('cleric'), member('cleric'), member('cleric'), c] : [c]), { f } = band(q, back ? [STRAW, BOW] : [STRAW, STRAW], back ? 1 : 0, 1);
    f.stamina![slot] = st;
    return featsOf(f, q, slot).map((x) => x.id).join() || '-';
  };
  const by = [has(1, 6), has(8, 2), has(8, 3), has(15, 6, false), has(15, 3), has(23, 5), has(23, 6, false, 3), has(15, 6, true, 3), has(1, 1)];
  ok(by.join(' ') === 'flurry flurry flurry,quiet_palm flurry,quiet_palm flurry,quiet_palm,leap flurry,quiet_palm,leap,wind_step flurry,quiet_palm,wind_step - -',
    `a monk has its feats by its level and its stamina, from the back row only from its second prestige, and Leap only while a back rank stands (${by.join(' ')})`);

  // Off in play, as the knight's: none built, each feat refused with nothing drawn or said, the menu's Cast, the bots strike.
  {
    const q = createParty([monkAt(23)]), { f, rng } = band(q, [STRAW, BOW], 1, 1, {});
    until(f, q, rng, 0);
    const label = commandRows(T, q, f, 0)[1].label, was = f.log.length, drawn = rng.draws(), refused = MONKS.every((x) => !partyAct(f, q, rng, feat(x.id, x.id === 'leap' ? 1 : 0)));
    ok(f.stamina === undefined && featsOf(f, q, 0).length === 0 && refused && f.log.length === was && rng.draws() === drawn && featFor(f, q, 0, 0) === undefined && label === 'Cast'
      && botTurn(f, q, rng, 0, asWritten, PLAYED).type === 'attack', 'off, a monk of 23 builds no stamina, each of its feats is refused with nothing drawn or said, its menu reads Cast and the bots strike');
  }

  // Flurry: the monk's blows a turn and two more, each a strike of its own: three at 1, four from the
  // first prestige, five from the third and three with a weapon not a staff; each lands by its own
  // to-hit, none sure, and builds by it.
  const turn = (c: Character, a: PartyAction, foes: MonsterDef[] = [STRAW], seed = 1, st = 2): { lines: string[]; st: number } => {
    const q = createParty([c]), { f, rng } = fight(q, [foes], seed), lines = act(f, q, rng, 0, a, st) ?? [];
    return { lines, st: f.stamina![0] };
  };
  const bladed = monkAt(11);
  bladed.equipment.weapon = 'fx_blade';
  const sets = [monkAt(1), monkAt(11), monkAt(27), bladed].map((c) => ({ fl: turn(structuredClone(c), feat('flurry')), at: turn(structuredClone(c), { type: 'attack', target: 0 }) }));
  const counts = sets.map(({ fl, at }) => `${struck(fl.lines)}/${struck(at.lines)}`).join(' '), walled = turn(monkAt(27), feat('flurry'), [WALL]);
  ok(counts === '3/1 4/2 5/3 3/1' && FLURRY_MORE === 2 && sets.every(({ fl }) => fl.lines[0] === 'monk strikes in a flurry.' && fl.st === Math.min(STAMINA_MAX, landing(fl.lines)))
    && struck(walled.lines) === 5 && landing(walled.lines) < 5,
    `a flurry is the monk's strikes a turn and two more (flurry/attack at 1, 11 and 27 and at 11 with a blade: ${counts}), each landing by its own to-hit (${landing(walled.lines)} of 5 on a wall) and building by it`);
  // A Windwalker's follow-through takes the flurry's strikes as the turn's own: it carries on to twice them.
  const most = (a: PartyAction): number => Math.max(...[1, 2, 3, 4, 5, 6].map((seed) => struck(turn(monkAt(19), a, Array<MonsterDef>(12).fill(FRAIL), seed).lines)));
  const fl = most(feat('flurry')), at = most({ type: 'attack', target: 0 });
  ok(fl === 2 * (2 + FLURRY_MORE) && at === 4, `a Windwalker's flurry that fells carries on to twice its strikes, ${fl}, as its Attack does to twice its two, ${at}`);
  // A tool's edge (`CombatOpts.edge`, the harness's what-ifs) that adds a blow to an Attack adds it to a flurry too.
  {
    const edged = (a: PartyAction): number => { const q = createParty([monkAt(11)]), { f, rng } = fight(q, [[STRAW]], 1, { feats: true, edge: () => ({ blows: 2, damage: 0, ac: 0 }) }); return struck(act(f, q, rng, 0, a, 2) ?? []); };
    const fe = edged(feat('flurry')), ae = edged({ type: 'attack', target: 0 });
    ok(ae === 3 && fe === ae + FLURRY_MORE, `a tool's edge that adds a blow to an Attack adds it to a flurry (flurry ${fe}, Attack ${ae})`);
  }

  // Quiet Palm: one strike that, landing on a foe it leaves standing, puts it to sleep; one proof against
  // sleep, by its own nature or its kind's, does not, and the line says so; one it fells or misses, nothing.
  const palm = (c: Character, target: MonsterDef, seed = 1): { lines: string[]; f: CombatState; st: number } => {
    const q = createParty([c]), { f, rng } = fight(q, [[target]], seed), lines = act(f, q, rng, 0, feat('quiet_palm'), 3) ?? [];
    return { lines, f, st: f.stamina![0] };
  };
  const PROOF = foe('test_proof', { ac: -100, attack: -50, speed: 1, immune: ['asleep'], name: 'Proof', plural: 'Proofs' }), BONES = foe('test_bones', { ac: -100, attack: -50, speed: 1, kind: 'dead', name: 'Bones', plural: 'Bones' });
  const slept = palm(monkAt(11), STRAW), proof = palm(monkAt(8), PROOF), bones = palm(monkAt(8), BONES), felled = palm(monkAt(8), FRAIL), missed = palm(monkAt(8), WALL);
  ok(slept.lines.length === 1 && slept.lines[0].endsWith(' Giant Rat falls asleep.') && slept.f.monsters[0].conditions.join() === 'asleep' && slept.st === 1,
    `a quiet palm is one strike where the monk has two, and landing puts its foe to sleep for 3 ("${slept.lines[0]}")`);
  ok([proof, bones].every((x) => x.lines.length === 1 && x.lines[0].endsWith(` ${x.f.monsters[0].def.name} does not sleep.`) && x.f.monsters[0].conditions.length === 0)
    && felled.lines[0]?.endsWith(' Frail dies.') && !missed.lines[0]?.includes(' hits ') && [felled, missed].every((x) => !x.lines.join().includes('sleep') && x.f.monsters[0].conditions.length === 0),
    `a foe proof against sleep, its own or its kind's, is not put to sleep and the line says so ("${proof.lines[0]}", "${bones.lines[0]}"); one felled or missed hears nothing of it`);
  // As Slumber's: a palm that lands on a foe held fast leaves it asleep in place of the hold.
  {
    const q = createParty([monkAt(8)]), { f, rng } = fight(q, [[STRAW]], 1);
    until(f, q, rng, 0);
    f.monsters[0].conditions = ['paralysed'];
    const lines = act(f, q, rng, 0, feat('quiet_palm'), 3) ?? [];
    ok(lines.length === 1 && lines[0].endsWith(` ${PALM_LINE(STRAW.name, true)}`) && f.monsters[0].conditions.join() === 'asleep',
      `a palm on a foe held fast leaves it asleep in place of the hold, as Slumber does (${f.monsters[0].conditions.join()}: "${lines[0]}")`);
  }
  // Asleep, it is a sleeper as Slumber's are: it loses its turns, and a blow that lands wakes it.
  {
    const HITTER = foe('test_hitter', { ac: -100, attack: 50, speed: 99, name: 'Hitter', plural: 'Hitters' });
    let palmed = 0, quiet = 0, woken = 0;
    for (let seed = 1; seed <= 6; seed++) {
      const q = createParty([monkAt(8), member('cleric')]), { f, rng } = fight(q, [[HITTER]], seed);
      if (!act(f, q, rng, 0, feat('quiet_palm'), 3)?.[0].endsWith(PALM_LINE('Hitter', true))) continue;
      palmed++;
      const round = f.round + 1, lines: string[] = [];
      while (f.outcome === 'ongoing' && f.round <= round) {
        const t = currentTurn(f, q, rng);
        if (!t) break;
        const at = f.log.length;
        if (t.side === 'monster') monsterAct(f, q, rng); else partyAct(f, q, rng, { type: 'defend' });
        if (f.round === round) lines.push(...f.log.slice(at));
      }
      if (!lines.some((l) => l.startsWith('Hitter '))) quiet++;
      const r = createParty([monkAt(8), member('knight', 8, true)]), x = fight(r, [[STRAW, STRAW]], seed);
      act(x.f, r, x.rng, 0, feat('quiet_palm'), 3);
      until(x.f, r, x.rng, 1);
      const asleep = x.f.monsters[0].conditions.join(), hit = act(x.f, r, x.rng, 1, { type: 'attack', target: 0 })?.some((l) => l.startsWith('knight hits '));
      if (asleep === 'asleep' && hit && x.f.monsters[0].conditions.length === 0) woken++;
    }
    ok(palmed >= 5 && quiet === palmed && woken >= 5, `a foe palmed to sleep strikes no blow the round after (${quiet} of ${palmed} seeds), and a blow that lands on it wakes it (${woken} of 6)`);
  }

  // Leap: one strike at a foe of the back rank, past a front that stands, where its Attack does not
  // reach; refused at the front and with no back rank standing; from the back row only from the second
  // prestige; one that fells its foe carries on to the front, as a Windwalker's strikes do.
  const leap = (c: Character, target: number, monsters: MonsterDef[] = [STRAW, BOW], slot = 0, a: PartyAction = feat('leap', target), seed = 1): { lines: string[] | null; st: number } => {
    const q = createParty(slot ? [member('cleric'), member('cleric'), member('cleric'), c] : [c]), { f, rng } = band(q, monsters, monsters.length > 1 && monsters[1].ranged ? 1 : 0, seed);
    const lines = act(f, q, rng, slot, a, 3);
    return { lines, st: f.stamina![slot] };
  };
  const leaps = [1, 2, 3, 4, 5, 6].map((seed) => leap(monkAt(15), 1, undefined, 0, undefined, seed)), reached = leap(monkAt(15), 1, undefined, 0, { type: 'attack', target: 1 });
  const front = leap(monkAt(15), 0), none = leap(monkAt(15), 1, [STRAW, STRAW]), shown = leaps.find((x) => landing(x.lines ?? []) > 0)?.lines;
  ok(leaps.every((x) => x.lines?.length === 2 && x.lines[0] === 'monk leaps past the front.' && /^monk (hits|misses) Bowman\b/.test(x.lines[1]) && x.st === landing(x.lines)) && !!shown && reached.lines === null
    && front.lines === null && front.st === 3 && none.lines === null && none.st === 3,
    `a leap is one strike at the back rank's bowman, past the front its Attack does not pass, on six seeds ("${shown?.join(' ')}"); at the front, or with no back rank, it is refused and nothing spent`);
  const behind = leap(monkAt(15), 1, undefined, 3), windwalker = leap(monkAt(19), 1, undefined, 3);
  const through = [1, 2, 3, 4, 5, 6].map((seed) => leap(monkAt(19), 1, [STRAW, FRAIL_BOW], 0, undefined, seed).lines ?? []).find((l) => l[1]?.includes(' hits ') && l[2]?.includes(' hits '));
  ok(behind.lines === null && behind.st === 3 && windwalker.lines !== null && through?.length === 3 && through[1].endsWith(`Bowman dies. ${FOLLOW_LINE}`) && through[2].startsWith(`monk hits ${STRAW.name} for `),
    `from the back row a leap waits for the second prestige, and a Windwalker's that fells its foe carries on to the front ("${through?.slice(1).join(' ')}")`);
  // Never at a foe of the back rank that has fallen, while another stands there: refused, nothing spent.
  {
    const q = createParty([monkAt(15)]), { f, rng } = band(q, [STRAW, BOW, BOW], 2, 1);
    until(f, q, rng, 0);
    f.monsters[1].hp = 0;
    const fallen = act(f, q, rng, 0, feat('leap', 1), 3), kept = f.stamina![0], up = act(f, q, rng, 0, feat('leap', 2), 3);
    ok(fallen === null && kept === 3 && up?.[0] === LEAP_LINE('monk'), `a leap at a foe of the back rank fallen is refused and nothing spent, at one standing taken ("${up?.join(' ')}")`);
  }

  // Wind Step: the monk's blows, as an Attack's, and another turn at once; the turn, the round and the
  // order stand. A second at once costs 5 again, which a step's blows that fell nothing never build back;
  // the next action ends the turn.
  {
    const q = createParty([monkAt(23), member('cleric')]), { f, rng } = fight(q, [[STRAW, STRAW]], 1);
    until(f, q, rng, 0);
    f.stamina![0] = 6;
    const order = JSON.stringify(f.order), turn = f.turn, round = f.round, at = f.log.length;
    const took = partyAct(f, q, rng, feat('wind_step')), lines = f.log.slice(at), next = currentTurn(f, q, rng), left = f.stamina![0], drawn = rng.draws();
    const again = partyAct(f, q, rng, feat('wind_step')), still = f.turn === turn && rng.draws() === drawn, ends = partyAct(f, q, rng, { type: 'attack', target: 0 }) && f.turn === turn + 1;
    ok(took && lines[0] === 'monk steps on the wind.' && struck(lines) === 2 && next?.side === 'party' && next.i === 0 && f.round === round && JSON.stringify(f.order) === order && left === 1 + landing(lines) && !again && still && ends,
      `a wind step strikes as an Attack and leaves the turn with the monk, in the same round and order ("${lines.join(' ')}"); a second at once on ${left} is refused, nothing drawn, and its next action ends the turn`);
    const r = createParty([monkAt(23), member('cleric')]), x = fight(r, [[STRAW]], 3);
    until(x.f, r, x.rng, 0);
    x.f.stamina![0] = 6;
    partyAct(x.f, r, x.rng, feat('wind_step'));
    x.f.stamina![0] = 5;
    const at2 = x.f.log.length, second = partyAct(x.f, r, x.rng, feat('wind_step')), more = x.f.log.slice(at2);
    ok(second && x.f.stamina![0] === landing(more) && currentTurn(x.f, r, x.rng)?.side === 'party', `a second wind step at once costs 5 again (left with ${x.f.stamina![0]}, what its blows built) and gives another turn as the first`);
  }
  // Played on: each round the order as it began, the monk acting twice in its place, the rounds one by one.
  {
    const q = createParty([monkAt(23), member('cleric')]), { f, rng } = fight(q, [[STRAW, STRAW]], 2), orders: string[] = [], seen: string[] = [];
    let stepped = 0;
    while (f.outcome === 'ongoing' && f.round <= 4) {
      const t = currentTurn(f, q, rng);
      if (!t || f.round > 4) break;
      if (orders.length < f.round) orders.push(f.order.map((o) => `${o.side[0]}${o.i}`).join(' '));
      seen[f.round - 1] = `${seen[f.round - 1] ?? ''} ${t.side[0]}${t.i}`.trim();
      if (t.side === 'monster') monsterAct(f, q, rng);
      else if (t.i === 0 && stepped < f.round) { stepped = f.round; f.stamina![0] = 6; partyAct(f, q, rng, feat('wind_step')); }
      else partyAct(f, q, rng, t.i === 0 ? { type: 'attack', target: 0 } : { type: 'defend' });
    }
    ok(orders.length === 4 && seen.every((x, k) => x === orders[k].replace('p0', 'p0 p0')), `played on, each round keeps its order with the monk twice in its place, and the rounds pass one by one (${seen.join(' / ')})`);
  }

  // The bots' policy, by construction: Wind Step whenever it can; Leap at the back rank's caster or
  // bowman past the front; Quiet Palm at the hardest hitter it reaches, free and able to sleep, but the
  // foe it strikes; Flurry whenever it can; else a blow, and nothing unasked.
  {
    const choose = (level: number, st: number, monsters: MonsterDef[] = [STRAW], back = 0, set?: (x: CombatState) => void, opts: BotOpts = { feats: true }): string => {
      const q = createParty([monkAt(level), member('cleric')]), { f, rng } = band(q, monsters, back, 9);
      until(f, q, rng, 0);
      f.stamina![0] = st;
      set?.(f);
      const a = botTurn(f, q, rng, 0, asWritten, opts);
      return a.type === 'feat' ? `${a.featId}@${a.target}` : a.type;
    };
    const HARD = foe('test_hard', { ac: -100, attack: -50, speed: 1, dice: 4, sides: 10, bonus: 5 }), MID = foe('test_mid', { ac: -100, attack: -50, speed: 1, dice: 2, sides: 6 });
    const picks = [
      choose(23, 6, [STRAW, BOW], 1), choose(23, 4, [STRAW, BOW], 1), choose(23, 4, [STRAW, STRAW], 1), choose(15, 3, [STRAW, HARD]), choose(15, 3, [HARD, STRAW, MID]),
      choose(8, 3, [STRAW, PROOF]), choose(8, 3, [STRAW, STRAW], 0, (x) => { x.monsters[1].conditions = ['asleep']; }), choose(8, 3), choose(23, 4, [STRAW, BOW], 1, (x) => { x.monsters[0].hp = 0; }), choose(1, 2), choose(1, 1), choose(23, 6, undefined, 0, undefined, {}),
    ];
    ok(picks.join(' ') === 'wind_step@0 leap@1 flurry@0 quiet_palm@1 quiet_palm@2 flurry@0 flurry@0 flurry@0 flurry@1 flurry@0 attack attack',
      `the bots step on the wind with 5, leap at a bowman behind the front, palm the hardest hitter but the one they strike, leave the proof and the sleeping, leap at none their blows reach, else flurry, else strike, and spend nothing unasked (${picks.join(' ')})`);
  }

  // Both bots, the gate's and the game's auto-fight, play each of the monk's four in fights that hold
  // a use for each (a monk of 23 among the newer six against a front of three, with a slinger behind
  // and without, all hitting often and lightly), and the policy never picks a feat the frame would
  // refuse, whatever foe it is handed.
  {
    const BRUTE = foe('test_brute', { ac: 12, attack: 30, speed: 6, name: 'Brute', plural: 'Brutes' }), SLINGER = foe('test_slinger', { ac: 12, attack: 30, speed: 6, ranged: true, name: 'Slinger', plural: 'Slingers' });
    const bots: [string, (x: CombatState, q: Party, rng: RngInstance, i: number) => void][] = [['gate', (x, q, rng, i) => gateTurn(x, q, rng, i)], ['auto', (x, q, rng, i) => { botTurn(x, q, rng, i, asSeen, PLAYED); }]];
    const kinds = (who: string): [string, (l: string) => boolean][] => [
      ['flurry', (l) => l === FLURRY_LINE(who)], ['palm', (l) => l.startsWith(`${who} hits `) && (l.includes(' falls asleep.') || l.includes(' does not sleep.'))], ['leap', (l) => l === LEAP_LINE(who)], ['step', (l) => l === WIND_LINE(who)],
    ];
    let picks = 0, bad = 0;
    const played = bots.map(([name, bot]) => {
      const n: Record<string, number> = {};
      for (let seed = 1; seed <= 8; seed++) {
        const q = newerCompany(23, seed), m = q.members.findIndex((c) => c.cls === 'monk'), who = q.members[m].name, { f, rng } = band(q, seed % 2 ? [BRUTE, BRUTE, BRUTE, SLINGER] : [BRUTE, BRUTE, BRUTE], seed % 2, seed);
        for (let k = 0; k < 800 && f.outcome === 'ongoing' && f.round <= 12; k++) {
          const t = currentTurn(f, q, rng);
          if (!t) break;
          if (t.side === 'monster') { monsterAct(f, q, rng); continue; }
          if (t.i === m) for (const foeAt of aliveMonsters(f)) {
            const a = featFor(f, q, m, foeAt), d = a?.type === 'feat' ? FEATS.find((x) => x.id === a.featId) : undefined;
            if (a) { picks++; if (!d || a.type !== 'feat' || !featsOf(f, q, m).includes(d) || !aimable(f, q.members[m], d, a.target)) bad++; }
          }
          const from = f.log.length;
          bot(f, q, rng, t.i);
          for (const l of f.log.slice(from)) for (const [kind, is] of kinds(who)) if (is(l)) n[kind] = (n[kind] ?? 0) + 1;
        }
      }
      return `${name} ${['flurry', 'palm', 'leap', 'step'].map((k) => n[k] ?? 0).join('/')}`;
    });
    ok(played.every((x) => x.split(' ')[1].split('/').every((k) => Number(k) > 0)) && picks > 0 && bad === 0,
      `both bots play each of the monk's four (flurry/palm/leap/step: ${played.join(', ')}), and of ${picks} picks the frame would refuse ${bad}`);
  }
}
