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
import { startCombat, partyAct, currentTurn, monsterAct, buffHit, monsterHit, sneakDamage } from '../../src/game/combat.ts';
import { RALLY_HIT, BLIND_HIT } from '../../src/game/combat/state.ts';
import type { CombatState, CombatOpts, PartyAction } from '../../src/game/combat.ts';
import { FEATS, STAMINA_MAX, featsOf, featsKnown, featFor, staminaOf, aimable } from '../../src/game/combat/feats.ts';
import { CHALLENGE_ROUNDS, RALLY_ROUNDS } from '../../src/game/combat/feats/knight.ts';
import { BLIND_ROUNDS, HAMSTRING_ROUNDS } from '../../src/game/combat/feats/thief.ts';
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
  thief();
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
  ok(labels.map((x) => `${x.label}${x.disabled ? '-' : ''}`).join() === 'Feat,Cast,Feat-' && rows.map((x) => `${x.label}${x.disabled ? '-' : ''}`).join() === "Challenge (2),Mighty Blow (3),Rally (4)-,Champion's Strike (5)-",
    `with the feats on, the knight's and the barbarian's menu read Feat (the barbarian's barred: no feats yet) and the cleric's Cast; the knight's list on 3: ${rows.map((x) => x.label + (x.disabled ? ' barred' : '')).join(', ')}`);

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

// The thief's four (#1113, combat/feats/thief.ts): each held to DESIGN §5's words, its cost, its level
// and its edges, and legal from the back row with a sling; a feat's sneak attack builds stamina as a
// plain blow; and the bots spend on them by the thief's policy.
const KNIFE: ItemDef = { ...BLADE, id: 'fx_knife', name: 'Knife', kind: 'light' }, SLING: ItemDef = { ...BLADE, id: 'fx_sling', name: 'Sling', kind: 'light', ranged: true };
const TT: Tables = { ...T, items: { ...T.items, fx_knife: KNIFE, fx_sling: SLING } };
const THIEF = FEATS.filter((x) => x.cls === 'thief');
/** A thief of `level`, its prestiges by it, with the knife (two blows from 11) or the sling. */
function rogue(level: number, weapon = 'fx_knife'): Character {
  const c = member('thief', level);
  c.prestige = [11, 19, 27].filter((l) => level >= l).length;
  c.equipment.weapon = weapon;
  return c;
}
/** A fight on the tables with the knife and the sling, the feats on unless `opts` says. */
function rogueFight(p: Party, groups: readonly (readonly MonsterDef[])[], seed: number, opts: CombatOpts = { feats: true }): { f: CombatState; rng: ReturnType<typeof counted> } {
  const rng = counted(seed);
  return { f: startCombat(TT, p, groups.map((monsters, k) => ({ id: `g${k}`, monsters })), rng, opts), rng };
}
/** The fight played on to member `i`'s turn in round `r` or a later one, the rest bracing: false if it ends first. */
function upTo(f: CombatState, p: Party, rng: RngInstance, i: number, r: number): boolean {
  while (until(f, p, rng, i)) { if (f.round >= r) return true; partyAct(f, p, rng, { type: 'defend' }); }
  return false;
}
type Lie = CombatState['monsters'][number]['conditions'];

function thief(): void {
  const RAT = MONSTERS.rat.name, at = (l: string): number => Number(/ for (\d+)\./.exec(l)?.[1]), hits = (ls: readonly string[]): string[] => ls.filter((l) => l.includes(' hits '));
  ok(THIEF.map((x) => `${x.name} ${x.cost} ${x.level}`).join(', ') === 'Ambush 2 1, Blind 3 8, Hamstring 3 15, Deathblow 5 23',
    "the thief's four as DESIGN §5 has them: Ambush (2) at 1, Blind (3) at 8, Hamstring (3) at 15, Deathblow (5) at 23");

  // By level and stamina; Deathblow only while a foe it reaches lies asleep or held; from the back row
  // with a sling each of the four, with a blade none.
  const has = (level: number, st: number, lie = false, slot = 0, weapon?: string): string => {
    const c = rogue(level, weapon), q = createParty(slot ? [member('cleric'), member('cleric'), member('cleric'), c] : [c]), { f } = rogueFight(q, [[STRAW, STRAW]], 1);
    f.stamina![slot] = st;
    if (lie) f.monsters[1].conditions = ['asleep'];
    return featsOf(f, q, slot).map((x) => x.id).join() + '/' + featsKnown(c).length;
  };
  const by = [has(1, 2), has(8, 2), has(8, 3), has(15, 6), has(23, 6), has(23, 6, true), has(23, 4, true), has(23, 6, true, 3), has(23, 6, true, 3, 'fx_sling')];
  ok(by.join(' ') === 'ambush/1 ambush/2 ambush,blind/2 ambush,blind,hamstring/3 ambush,blind,hamstring/4 ambush,blind,hamstring,deathblow/4 ambush,blind,hamstring/4 /4 ambush,blind,hamstring,deathblow/4',
    `a thief has its feats by its level and may use those it affords, Deathblow while a foe lies asleep, a blow's from the back row with a sling and not a blade (${by.join(' ')})`);
  {
    const q = createParty([rogue(23)]), off = rogueFight(q, [[STRAW]], 1, {});
    until(off.f, q, off.rng, 0);
    off.f.monsters[0].conditions = ['asleep'];
    const was = off.f.log.length, drawn = off.rng.draws();
    ok(THIEF.every((x) => !partyAct(off.f, q, off.rng, feat(x.id))) && off.f.log.length === was && off.rng.draws() === drawn && featFor(off.f, q, 0, 0) === undefined && off.f.monsters[0].blind === undefined,
      "off, each of the thief's feats is refused with nothing drawn or said, a foe asleep before it, and its bots try none");
  }

  // Ambush: the thief's blows this turn, each a sneak attack for its damage where it would be none and
  // the same where it would be one already; they build stamina as plain blows, 1 each and not a sneak
  // attack's 2, so that it never pays for itself.
  {
    const play = (round: number, a: PartyAction): { lines: string[]; st: number } => {
      const q = createParty([rogue(12)]), { f, rng } = rogueFight(q, [[STRAW, STRAW]], 4);
      upTo(f, q, rng, 0, round);
      f.stamina![0] = 2;
      const from = f.log.length;
      partyAct(f, q, rng, a);
      return { lines: f.log.slice(from), st: f.stamina![0] };
    };
    const late = play(2, feat('ambush')), lateBlow = play(2, { type: 'attack', target: 0 }), early = play(1, feat('ambush')), earlyBlow = play(1, { type: 'attack', target: 0 });
    const more = sneakDamage(rogue(12)), plain = at(hits(lateBlow.lines)[0] ?? '');
    ok(late.lines[0] === 'thief strikes from ambush.' && hits(late.lines).length === 2 && hits(late.lines).every((l) => l.endsWith(`for ${plain + more}. ${SNEAK_LINE}`)) && hits(lateBlow.lines).every((l) => !l.includes(SNEAK_LINE)),
      `in round 2 an ambush's two blows are sneak attacks, each ${plain} and ${more} more, where an Attack's are not ("${late.lines.join(' | ')}")`);
    ok(hits(early.lines).length === 2 && hits(early.lines).join() === hits(earlyBlow.lines).join() && hits(early.lines).every((l) => l.endsWith(`for ${plain + more}. ${SNEAK_LINE}`)),
      `on a foe yet to act in the first round, where its blows are sneak attacks already, an ambush's take the sneak damage once (${at(hits(early.lines)[0])})`);
    ok(late.st === 2 - 2 + 2 && lateBlow.st === 2 + 2 && early.st === 2 - 2 + 2 * 2 && earlyBlow.st === STAMINA_MAX,
      `its blows build 1 each as plain blows (2 spent, ${late.st} after), the thief's own sneak attacks 2 (${early.st} after an ambush on a foe yet to act)`);
  }

  // Blind: one blow; landing on a foe it leaves standing, the foe hits BLIND_HIT less the round it is
  // struck in and the two after, as Bless counts; one it fells or misses is not blinded.
  {
    const q = createParty([rogue(12)]), { f, rng } = rogueFight(q, [[STRAW]], 2), m = f.monsters[0];
    upTo(f, q, rng, 0, 2);
    const before = monsterHit(f, m), said = act(f, q, rng, 0, feat('blind'), 3) ?? [], rounds = [before - monsterHit(f, m)];
    while (f.outcome === 'ongoing' && rounds.length < 4) {
      const t = currentTurn(f, q, rng);
      if (!t) break;
      if (f.round > rounds.length + 1) rounds.push(before - monsterHit(f, m));
      if (t.side === 'monster') monsterAct(f, q, rng); else partyAct(f, q, rng, { type: 'defend' });
    }
    ok(BLIND_HIT === 4 && BLIND_ROUNDS === 3 && said.length === 1 && said[0] === `thief hits ${RAT} for ${at(said[0])}. ${RAT} is blinded.` && rounds.join() === '4,4,4,0',
      `a blind foe hits ${BLIND_HIT} less the round it is struck in and the two after (rounds 2 to 5: ${rounds.join(', ')}), one blow where the thief has two: "${said[0]}"`);
    const once = (d: MonsterDef, seed: number): { said: string; blind?: number; st: number } => {
      const r = createParty([rogue(8)]), x = rogueFight(r, [[d]], seed);
      upTo(x.f, r, x.rng, 0, 2);
      const lines = act(x.f, r, x.rng, 0, feat('blind'), 3) ?? [];
      return { said: lines.join(' | '), blind: x.f.monsters[0].blind, st: x.f.stamina![0] };
    };
    const fell = once(foe('test_frail', { hp: 1, ac: -100, attack: -50, speed: 1 }), 1), miss = once(WALL, 1);
    ok(fell.said.includes(`${RAT} dies.`) && !fell.said.includes('blinded') && fell.blind === undefined && miss.said === `thief misses ${RAT}.` && miss.blind === undefined && miss.st === 0,
      `a foe the blow fells is not blinded ("${fell.said}"), nor one it misses, the cost spent ("${miss.said}")`);
  }

  // Hamstring: one blow; landing, its foe is held fast and loses its next turn, this round's where it is
  // still to come and else the next round's, then moves again, on every seed: it does not tear free
  // before. One immune to holds is not held, and one the blow fells is not held.
  {
    const HARE = foe('test_hare', { ac: -100, attack: -50, speed: 99, name: 'Hare', plural: 'Hares' }), IRON = foe('test_iron', { ac: -100, attack: -50, speed: 1, immune: ['paralysed'], name: 'Iron', plural: 'Irons' });
    const turns = (d: MonsterDef, seed: number): { said: string; acts: string; moved: number } => {
      const q = createParty([rogue(15)]), { f, rng } = rogueFight(q, [[d]], seed), acts = [0, 0, 0, 0, 0, 0];
      let said = '';
      while (f.outcome === 'ongoing' && f.round <= 4) {
        const t = currentTurn(f, q, rng);
        if (!t) break;
        const round = f.round, from = f.log.length;
        if (t.side === 'monster') { monsterAct(f, q, rng); acts[round]++; continue; }
        if (round !== 2) { partyAct(f, q, rng, { type: 'defend' }); continue; }
        f.stamina![0] = 3;
        if (!partyAct(f, q, rng, feat('hamstring'))) partyAct(f, q, rng, { type: 'defend' });
        said = f.log.slice(from).join(' | ');
      }
      return { said, acts: acts.slice(1, 5).join(''), moved: f.log.filter((l) => l.endsWith(' can move again.')).length };
    };
    const slow = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((seed) => turns(STRAW, seed)), fast = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((seed) => turns(HARE, seed));
    const landed = (x: { said: string }): boolean => x.said.endsWith(' is held fast.');
    ok(HAMSTRING_ROUNDS === 2 && slow.filter(landed).length >= 8 && slow.every((x) => (landed(x) ? x.acts === '1011' && x.moved === 1 : x.acts === '1111'))
      && fast.filter(landed).length >= 8 && fast.every((x) => (landed(x) ? x.acts === '1101' && x.moved === 1 : x.acts === '1111')),
    `a hamstrung foe loses one turn, rounds 1 to 4: a slower one its turn of the round (${slow.find(landed)?.acts}), a faster one its next round's (${fast.find(landed)?.acts}), on every seed of ten it lands on (${slow.filter(landed).length}, ${fast.filter(landed).length}), and moves again: "${fast.find(landed)?.said}"`);
    const iron = turns(IRON, 1), frail = turns(foe('test_frail', { hp: 1, ac: -100, attack: -50, speed: 1 }), 1);
    ok(iron.said === `thief hits Iron for ${at(iron.said)}. Iron is not held.` && iron.acts === '1111' && frail.said.includes(`${RAT} dies.`) && !frail.said.includes('held'),
      `one immune to holds is not held, and the log says so ("${iron.said}"); one the blow fells is not held ("${frail.said}")`);
    // The thief's next turn finds a faster foe held: its Deathblow may be aimed at it.
    const q = createParty([rogue(23)]), { f, rng } = rogueFight(q, [[HARE]], 1);
    upTo(f, q, rng, 0, 2);
    act(f, q, rng, 0, feat('hamstring'), 3);
    upTo(f, q, rng, 0, 3);
    f.stamina![0] = 5;
    ok(f.round === 3 && f.monsters[0].conditions.includes('paralysed') && featsOf(f, q, 0).some((x) => x.id === 'deathblow') && act(f, q, rng, 0, feat('deathblow'), 5) !== null,
      'and the thief\'s next turn finds it held, so that its Deathblow may take it');
  }

  // Deathblow: one blow, aimed only at a foe asleep or held that it reaches; a sneak attack for triple,
  // the whole blow, its steel and its sneak damage, never a crit and drawing no chance with crits on and
  // the thief's Luck high; a foe asleep and held at once takes the same; one awake and free is refused.
  {
    const strike = (lie: Lie, crits = false, a: PartyAction = feat('deathblow')): { lines: string[] | null; draws: number; st: number } => {
      const c = rogue(23), q = createParty([c]), { f, rng } = rogueFight(q, [[STRAW, STRAW]], 3, { feats: true, crits });
      c.stats.luck = 60;
      upTo(f, q, rng, 0, 3);
      f.monsters[0].conditions = lie;
      const was = rng.draws(), lines = act(f, q, rng, 0, a, 5);
      return { lines, draws: rng.draws() - was, st: f.stamina![0] };
    };
    const awake = strike([]), asleep = strike(['asleep']), held = strike(['paralysed']), both = strike(['asleep', 'paralysed']), lucky = strike(['asleep'], true), blow = strike([], false, { type: 'attack', target: 0 });
    const plain = at(hits(blow.lines ?? [])[0] ?? ''), more = sneakDamage(rogue(23)), line = `thief hits ${RAT} for ${3 * (plain + more)}. ${SNEAK_LINE} A deathblow.`;
    ok(asleep.lines?.join() === line && held.lines?.join() === line && both.lines?.join() === line && asleep.st === 1,
      `a deathblow on a foe asleep, held or both is one blow for three times the whole sneak attack, ${plain} and ${more} (built as a plain blow): "${line}"`);
    ok(awake.lines === null && awake.st === 5 && awake.draws === 0 && lucky.lines?.join() === line && lucky.draws === asleep.draws,
      `at a foe awake and free it is refused, nothing spent or drawn; with crits on it is no crit and draws what it draws with them off (${asleep.draws})`);
    const r = createParty([rogue(23)]), rr = counted(1), x = startCombat(TT, r, [{ id: 'band', monsters: [STRAW, STRAW], back: 1 }], rr, { feats: true });
    until(x, r, rr, 0);
    x.monsters[1].conditions = ['asleep'];
    x.stamina![0] = 5;
    ok(featsOf(x, r, 0).every((d) => d.id !== 'deathblow') && !aimable(x, r.members[0], THIEF[3], 1), 'a sleeper of the back rank, beyond a blade\'s reach while the front stands, is no Deathblow\'s');
  }

  // Each of the four from the back row with a sling, as the premade six's thief strikes.
  {
    const used = THIEF.map((d) => {
      const q = createParty([member('cleric'), member('cleric'), member('cleric'), rogue(23, 'fx_sling')]), { f, rng } = rogueFight(q, [[STRAW, STRAW]], 5);
      upTo(f, q, rng, 3, 3);
      f.monsters[0].conditions = ['asleep'];
      return act(f, q, rng, 3, feat(d.id, 0), 5) !== null;
    });
    ok(used.every(Boolean), `from the back row with a sling each of the four may be used (${used.join(', ')})`);
  }

  // The bots' policy, by construction: Deathblow whenever it can, at the bot's foe where it lies asleep
  // or held, else the one lying so with the most hit points, and from its level nothing else while one
  // lies so; Hamstring at the hardest hitter while none lies so; Blind at the hardest hitter awake, free
  // and not blind; Ambush where its blows are no sneak attacks already and what it leaves pays for its
  // dearest other feat; else a blow; and nothing unasked.
  {
    const HITTER = foe('test_hitter', { ac: -100, attack: -50, speed: 1, dice: 4, sides: 6, name: 'Hitter', plural: 'Hitters' });
    const choose = (level: number, st: number, set?: (f: CombatState) => void, round = 3, opts: BotOpts = { feats: true }): string => {
      const q = createParty([member('cleric'), member('cleric'), member('cleric'), rogue(level, 'fx_sling')]), x = rogueFight(q, [[STRAW, HITTER, STRAW]], 9);
      upTo(x.f, q, x.rng, 3, round);
      x.f.stamina![3] = st;
      set?.(x.f);
      const a = botTurn(x.f, q, x.rng, 3, asWritten, opts);
      return a.type === 'feat' ? `${a.featId}@${a.target}` : a.type;
    };
    const lie = (...ks: [number, Lie][]) => (f: CombatState): void => { for (const [k, c] of ks) f.monsters[k].conditions = c; };
    const dark = (f: CombatState): void => { for (const m of f.monsters) m.blind = 2; };
    const picks = [
      choose(23, 5, lie([2, ['asleep']])), choose(23, 5, lie([0, ['asleep']], [2, ['asleep']])), choose(23, 5, (f) => { lie([1, ['paralysed']], [2, ['asleep']])(f); f.monsters[1].hp = 10; }),
      choose(15, 3), choose(15, 3, lie([0, ['paralysed']])), choose(8, 3), choose(8, 3, (f) => { f.monsters[1].blind = 2; }),
      choose(1, 2), choose(1, 2, undefined, 1), choose(8, 2), choose(12, 5, dark), choose(12, 4, dark), choose(23, 4, lie([2, ['asleep']])), choose(23, 6, dark), choose(23, 6, undefined, 3, {}),
    ];
    ok(picks.join(' ') === 'deathblow@2 deathblow@0 deathblow@2 hamstring@1 blind@1 blind@1 blind@0 ambush@0 attack attack ambush@0 attack attack hamstring@1 attack',
      `the bots deal a deathblow where they can and from 23 build for one while a foe lies asleep or held, hamstring the hardest hitter while none lies so, blind the hardest not blind, ambush where it adds a sneak attack and leaves enough for a dearer feat, else strike, and spend nothing unasked (${picks.join(' ')})`);
    // Handed a foe it cannot strike, one fallen or one of the back rank beyond its blade while the front
    // stands, the policy picks nothing at it.
    const q = createParty([rogue(1)]), rr = counted(2), x = startCombat(TT, q, [{ id: 'band', monsters: [STRAW, STRAW, STRAW], back: 1 }], rr, { feats: true });
    upTo(x, q, rr, 0, 3);
    x.stamina![0] = 2;
    x.monsters[0].hp = 0;
    const at = [0, 1, 2].map((k) => { const a = featFor(x, q, 0, k); return a?.type === 'feat' ? `${a.featId}@${a.target}` : '-'; });
    ok(at.join(' ') === '- ambush@1 -', `handed a fallen foe or one beyond its blade's reach, the policy picks no feat at it, and at one it reaches it ambushes (${at.join(' ')})`);
  }

  // Over fights of the gate's company (its thief behind, with the ladder's weapon) at 1, 8, 15 and 23
  // against three of a kind of the level that sleep, the feats on: neither bot ever picks a feat it may
  // not use, at any foe it might strike, and between them, the gate's and the game's auto-fight, they
  // play each of the four.
  {
    const played = new Map<string, number>();
    let picked = 0, bad = 0;
    const kinds: Record<number, string> = { 1: 'bandit', 8: 'ogre', 15: 'ashen_gleaner', 23: 'ashen_mason' };
    for (const level of [1, 8, 15, 23]) for (let seed = 1; seed <= 6; seed++) for (const auto of [false, true]) {
      const q = gateCompany(level, seed), i = q.members.findIndex((m) => m.cls === 'thief'), { f, rng } = fight(q, [[0, 1, 2].map(() => MONSTERS[kinds[level]])], seed);
      for (let n = 0; n < 400 && f.outcome === 'ongoing'; n++) {
        const t = currentTurn(f, q, rng);
        if (!t) break;
        if (t.side === 'monster') { monsterAct(f, q, rng); continue; }
        if (t.i === i) {
          for (const k of f.monsters.keys()) {
            const a = featFor(f, q, i, k), d = a?.type === 'feat' ? FEATS.find((x) => x.id === a.featId) : undefined;
            if (a?.type !== 'feat') continue;
            picked++;
            if (!d || !featsOf(f, q, i).includes(d) || !aimable(f, q.members[i], d, a.target)) bad++;
          }
        }
        const a = auto ? botTurn(f, q, rng, t.i, asSeen, PLAYED) : botTurn(f, q, rng, t.i, asWritten, { feats: true });
        if (t.i === i && a.type === 'feat') played.set(a.featId, (played.get(a.featId) ?? 0) + 1);
      }
    }
    const count = THIEF.map((d) => `${d.name} ${played.get(d.id) ?? 0}`).join(', ');
    ok(picked > 0 && bad === 0 && THIEF.every((d) => (played.get(d.id) ?? 0) > 0), `in 48 fights neither bot picks a feat the thief may not use (${picked} picks) and they play each of the four (${count})`);
  }
}
