// The combat resolver: a seeded fight replays byte for byte, the cap, the rows, fleeing, the spells
// that hit every foe, Ward and Revive; the ranks and morale (#160); elements, monsters that cast and
// drain, and a hit that wakes a sleeper (#161); regeneration, curse and calls (#537); the light
// that goes into a machine like a hand into a glove; sweep (#545); and the Core's clock and those that obey (#748).
import { createHash } from 'node:crypto';
import { makeRng } from '../../src/lib/engine/rng.ts';
import { ITEMS, MONSTERS, SPELLS, TABLES } from '../../src/content/index.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { World } from '../../src/game/world.ts';
import { serialize, deserialize } from '../../src/game/save.ts';
import { defaultParty, equip, addCondition, hasCondition, killPay, spellHeal, rankMult, resists, rest, attackBonus, armorClass, canAct, spellTierAt, isDown, useItem, templePrice } from '../../src/game/party.ts';
import { startCombat, currentTurn, partyAct, monsterAct, aliveMonsters, canAttackFromRow, canReach, castOnAlly, castOnParty, frontStands, monsterAc, monsterHit, canCall, WARD_AC, BLESS_HIT, BREAK_LINE, ROUT_LINE, MEND_LINE, SMOULDER_LINE, CALL_LINE, panelStands, DIM_LINE, THREAD_LINE, STAND_LINE, GLOVE_LINE, GLOVE_FLAG, MAX_MONSTERS, MAX_GROUPS, SWEEP_LINE, STONE_LINE } from '../../src/game/combat.ts';
import type { CombatState, CombatGroup, PartyAction } from '../../src/game/combat.ts';
import type { MonsterDef } from '../../src/game/monsters.ts';
import { elementMult, monsterSpells, monsterCanCast, KINDS } from '../../src/game/monsters.ts';
import { gateBlast, gateBurn } from '../../src/game/bot.ts';
import { gateTurn } from '../kit/fight.ts';
import { thrifty } from '../kit/harness.ts';
import { wakeWith, markOf, mendLines, ANSWER, REST_AT } from '../../src/game/bot.ts';
import { companyAt } from '../kit/company.ts';
import { ROUND_CAP, playOut } from '../kit/fight.ts';
import { botTurn, asSeen, asWritten, breathGuard, PLAYED } from '../../src/game/bot.ts';
import type { BotOpts, Sees } from '../../src/game/bot.ts';
import { CombatScreen } from '../../src/ui/combat.ts';
import type { Game } from '../../src/game/game.ts';
import { logLines } from '../../src/ui/frame.ts';
import type { Party } from '../../src/game/party.ts';
import { spell } from '../../src/game/spells.ts';
import { RANGED_PENALTY } from '../../src/game/weather.ts';
import { ok, withDefs } from './lib.ts';
import { headlessGame, drive } from '../kit/headless.ts';
import { tablesWith } from '../kit/headless.ts';
import type { Tables } from '../../src/game/tables.ts';

export function combat(): void {
  // A scripted policy: everyone attacks the first living monster, casters cast when they can.
  const run = (seed: number): { log: string[]; rounds: number; party: Party; state: CombatState } => {
    const rng = makeRng(seed);
    const party = defaultParty(TABLES, rng);
    const state = startCombat(TABLES, party, [{ id: 'g', monsters: ['rat', 'rat', 'rat', 'wolf'] }], rng);
    let guard = 0;
    while (state.outcome === 'ongoing' && guard++ < 500) {
      const t = currentTurn(state, party, rng);
      if (!t) break;
      if (t.side === 'monster') { monsterAct(state, party, rng); continue; }
      const c = party.members[t.i];
      const target = aliveMonsters(state)[0];
      if (c.cls === 'sorcerer' && c.sp >= 2) partyAct(state, party, rng, { type: 'cast', spellId: 'spark', target });
      else if (canAttackFromRow(TABLES.items, c, t.i)) partyAct(state, party, rng, { type: 'attack', target });
      else partyAct(state, party, rng, { type: 'defend' });
    }
    return { log: state.log, rounds: state.round, party, state };
  };
  const a = run(11), b = run(11), c = run(12);
  ok(a.log.join('|') === b.log.join('|'), 'the same seed replays the same fight');
  ok(a.log.join('|') !== c.log.join('|'), 'a different seed is a different fight');
  ok(a.state.outcome === 'victory', `the default party beats three rats and a wolf (${a.rounds} rounds, ${a.state.outcome})`);
  // Three in four down, the last of the pack bolts and pays nothing; the slain pay by their level
  // against the party's, so the wolf, one over it, pays more (killPay).
  const xp = a.state.monsters.filter((m) => !m.fled).reduce((n, m) => n + m.def.xp * killPay(m.def.level, 1), 0);
  ok(a.state.monsters.filter((m) => m.fled).length === 1, `the last of three rats and a wolf bolts (${a.state.monsters.filter((m) => m.fled).map((m) => m.def.name).join(', ')})`);
  ok(MONSTERS.rat.level === 1 && MONSTERS.wolf.level === 2 && a.state.loot !== null && a.state.loot.xp === Math.round(xp), `xp is the sum of the slain's, each by its level against the party's (${a.state.loot?.xp})`);
  ok(a.party.members.every((m) => m.xp === Math.floor(xp / 6)) && a.state.loot!.shares.every((x) => x === Math.floor(xp / 6)), 'xp is split evenly among the living');
  ok(a.party.gold >= 200, 'gold is added to the party');
  // The cap.
  const rng = makeRng(1);
  const big = startCombat(TABLES, defaultParty(TABLES, rng), [{ id: 'a', monsters: new Array(8).fill('rat') }, { id: 'b', monsters: new Array(8).fill('rat') }], rng);
  ok(big.monsters.length === 12, `a fight never has more than 12 monsters (${big.monsters.length})`);
  // Back row cannot attack in melee; the ranger with a bow can.
  const p = defaultParty(TABLES, makeRng(2));
  ok(!canAttackFromRow(TABLES.items, p.members[3], 3) === !ITEMS[p.members[3].equipment.weapon!].ranged, 'back row melee is refused, back row ranged allowed');
  equip(TABLES.items, p.members[3], 'sling');
  ok(canAttackFromRow(TABLES.items, p.members[3], 3), 'a sling lets the thief attack from the back row');
  ok(canAttackFromRow(TABLES.items, p.members[5], 5), 'the sorcerer starts with a sling, so it has a shot from the back row');
  // Fleeing eventually works and ends the fight.
  let fled = false;
  for (let seed = 1; seed < 20 && !fled; seed++) {
    const r = makeRng(seed); const pp = defaultParty(TABLES, r);
    const s = startCombat(TABLES, pp, [{ id: 'g', monsters: ['slime'] }], r);
    for (let i = 0; i < 20 && s.outcome === 'ongoing'; i++) { const t = currentTurn(s, pp, r); if (!t) break; if (t.side === 'party') partyAct(s, pp, r, { type: 'flee' }); else monsterAct(s, pp, r); }
    fled = s.outcome === 'fled';
  }
  ok(fled, 'fleeing from a slime succeeds within a few tries');
  // Tier 4-5 spells: an all-target spell hits every foe; Ward and Haste set their timers; Revive raises the dead.
  {
    const r = makeRng(21); const pp = defaultParty(TABLES, r);
    const sorc = pp.members[5], cler = pp.members[4];
    sorc.level = 8; sorc.spells.push('lightning', 'meteor'); sorc.sp = 60; cler.spells.push('ward', 'revive', 'wrath'); cler.sp = 60;
    const s = startCombat(TABLES, pp, [{ id: 'a', monsters: ['ogre', 'ogre'] }, { id: 'b', monsters: ['wraith', 'wraith', 'wraith'] }], r);
    let cast = 0, warded = false;
    for (let i = 0; i < 60 && s.outcome === 'ongoing' && cast < 2; i++) {
      const t = currentTurn(s, pp, r); if (!t) break;
      if (t.side === 'monster') { monsterAct(s, pp, r); continue; }
      const c = pp.members[t.i];
      if (c === sorc) { const before = s.monsters.map((m) => m.hp); partyAct(s, pp, r, { type: 'cast', spellId: 'meteor', target: 0 }); ok(s.monsters.every((m, k) => m.hp < before[k]), 'Meteor Swarm damages every monster'); cast++; }
      else if (c === cler && !warded) { partyAct(s, pp, r, { type: 'cast', spellId: 'ward', target: 0 }); warded = s.shield === 5; cast++; }
      else partyAct(s, pp, r, { type: 'defend' });
    }
    ok(warded, 'Ward sets the party shield for five rounds');
    ok(WARD_AC > 0 && s.log.some((l) => /ward settles/.test(l)), 'the ward is logged');
    const dead = pp.members[0]; addCondition(TABLES.items, dead, 'dead'); dead.hp = -10;
    const line = castOnAlly(TABLES.items, cler, spell('revive'), dead);
    ok(!hasCondition(dead, 'dead') && dead.hp === 10 && /draws breath/.test(line), `Revive brings a dead member back at 10 hp (${line})`);
    ok(/not dead/.test(castOnAlly(TABLES.items, cler, spell('revive'), dead)), 'Revive on the living does nothing');
    ok(spell('haste').buff === 'haste' && spell('town_portal').explore === 'town_portal', 'Haste and Town Portal exist at tier 4 and 5');
  }
  // Slumber: the dead never sleep, nor what shrugs it off of its own nature (the slime, the crab, the
  // wardens); beasts and people do.
  {
    const slept = (d: typeof MONSTERS[string]): number => {
      let n = 0;
      for (let seed = 1; seed <= 8; seed++) {
        const r = makeRng(seed), pp = defaultParty(TABLES, r), sorc = pp.members.find((m) => m.cls === 'sorcerer')!;
        sorc.spells = [...sorc.spells, 'sleep']; sorc.sp = sorc.maxSp = 99;
        const s = startCombat(TABLES, pp, [{ id: 'a', monsters: new Array(6).fill(d) }], r);
        for (let i = 0; i < 40 && s.outcome === 'ongoing'; i++) {
          const t = currentTurn(s, pp, r); if (!t) break;
          if (t.side === 'monster') monsterAct(s, pp, r);
          else if (pp.members[t.i] === sorc) { partyAct(s, pp, r, { type: 'cast', spellId: 'sleep', target: 0 }); break; }
          else partyAct(s, pp, r, { type: 'defend' });
        }
        n += s.monsters.filter((m) => m.conditions.includes('asleep')).length;
      }
      return n;
    };
    const never = ['skeleton', 'drowned', 'ghoul', 'bone_knight', 'wraith', 'slime', 'shore_crab', 'rift_warden', 'cut_warden', 'tide_warden', 'sunder_warden', 'anvil_warden'];
    const woke = never.filter((id) => slept(MONSTERS[id]) > 0);
    ok(!woke.length, `Slumber takes none of the dead, the slime, the crab or the wardens (${woke.join(', ') || 'none slept'})`);
    ok(slept(MONSTERS.rat) > 0 && slept(MONSTERS.bandit) > 0 && slept(MONSTERS.riftling) > 0, 'but rats, bandits and riftlings it does');
    ok(slept({ ...MONSTERS.rat, immune: ['asleep'] }) === 0, 'a beast that shrugs off sleep of its own stays awake');
    ok(slept({ ...MONSTERS.rat, kind: 'dead' }) === 0 && slept({ ...MONSTERS.rat, kind: 'machine' }) === 0, 'and a rat made dead or a machine, with no flag of its own, never sleeps');
  }
  // Weather: bows lose to-hit on both sides; the Ashen casters, ranged but not archers, do not.
  ok(!!MONSTERS.bandit_archer.missile && !!MONSTERS.smuggler_bowman.missile && !!MONSTERS.brigand_archer.missile && !!MONSTERS.ashen_adept.ranged && !MONSTERS.ashen_adept.missile, 'archers shoot; Ashen adepts cast');
  {
    const rate = (penalty: number): number => {
      let hit = 0, miss = 0;
      for (let seed = 1; seed <= 60; seed++) {
        const r = makeRng(seed), pp = defaultParty(TABLES, r);
        const s = startCombat(TABLES, pp, [{ id: 'a', monsters: new Array(6).fill('bandit_archer') }], r, { rangedPenalty: penalty });
        for (let i = 0; i < 60 && s.outcome === 'ongoing'; i++) { const t = currentTurn(s, pp, r); if (!t) break; if (t.side === 'monster') monsterAct(s, pp, r); else partyAct(s, pp, r, { type: 'defend' }); }
        hit += s.log.filter((l) => l.startsWith('Bandit Archer hits')).length; miss += s.log.filter((l) => l.startsWith('Bandit Archer misses')).length;
      }
      return hit / (hit + miss);
    };
    const dry = rate(0), wet = rate(RANGED_PENALTY);
    ok(wet < dry - 0.05, `archers hit less often in a downpour (${(wet * 100).toFixed(0)}% against ${(dry * 100).toFixed(0)}%)`);
  }
  const noted = startCombat(TABLES, defaultParty(TABLES, makeRng(4)), [{ id: 'a', monsters: ['rat'] }], makeRng(4), { rangedPenalty: RANGED_PENALTY, note: 'The downpour spoils every archer\'s aim.' });
  ok(noted.rangedPenalty === RANGED_PENALTY && noted.log[1] === 'The downpour spoils every archer\'s aim.', 'a fight in the weather carries the penalty and says why');
  ok(startCombat(TABLES, defaultParty(TABLES, makeRng(4)), [{ id: 'a', monsters: ['rat'] }], makeRng(4)).rangedPenalty === 0, 'and a fight with no word of the weather has none');
  // A group fought from under the ice (#536) reaches one square: the front row over it and never the
  // back, bows or none; with the front row down, nobody. Bowmen on dry ground reach anyone.
  {
    const struck = (under: 'ice' | undefined, frontDown: boolean): { back: number; all: number } => {
      let back = 0, all = 0;
      for (let seed = 1; seed <= 20; seed++) {
        const r = makeRng(seed), pp = defaultParty(TABLES, r), rear = pp.members.slice(3).map((c) => ` ${c.name}`);
        for (const c of pp.members) c.hp = c.maxHp = 999;
        if (frontDown) for (const c of pp.members.slice(0, 3)) addCondition(TABLES.items, c, 'unconscious');
        const s = startCombat(TABLES, pp, [{ id: 'pike', monsters: new Array(6).fill('smuggler_bowman'), under }], r);
        for (let i = 0; i < 40 && s.outcome === 'ongoing'; i++) { const t = currentTurn(s, pp, r); if (!t) break; if (t.side === 'monster') monsterAct(s, pp, r); else partyAct(s, pp, r, { type: 'defend' }); }
        for (const l of s.log) if (/^Smuggler Bowman (hits|misses) /.test(l)) { all++; if (rear.some((n) => l.includes(n))) back++; }
      }
      return { back, all };
    };
    const dry = struck(undefined, false), iced = struck('ice', false), downed = struck('ice', true);
    ok(dry.back > 0 && iced.all > 0 && iced.back === 0, `bowmen under the ice strike only the front row, where on dry ground they reach the back (${iced.all} shots, ${iced.back} at the back; dry ${dry.back} of ${dry.all})`);
    ok(downed.all === 0, `and with the front row down they reach nobody (${downed.all} shots)`);
  }
  ranks();
  morale();
  elements();
  casting();
  drain();
  pastTen();
  regeneration();
  curse();
  stone();
  calls();
  clock();
  glove();
  sweep();
  bot();
  botOpts();
  autoFight();
  fightTicks();
}

/** A fight played out: each member strikes `aim`'s pick where it can and braces where it cannot. */
function play(s: CombatState, party: Party, seed: number, aim: (s: CombatState, i: number) => number | undefined, each?: () => void): void {
  const rng = makeRng(seed);
  for (let guard = 0; s.outcome === 'ongoing' && guard < 2000; guard++) {
    each?.();
    const t = currentTurn(s, party, rng);
    if (!t) break;
    if (t.side === 'monster') { monsterAct(s, party, rng); continue; }
    const target = aim(s, t.i);
    if (target === undefined || !canAttackFromRow(s.tables.items, party.members[t.i], t.i) || !partyAct(s, party, rng, { type: 'attack', target })) partyAct(s, party, rng, { type: 'defend' });
  }
}

/** Ranks (MONSTERS.md §3.3): the issue's choir, four chanters behind two drowned men. */
function ranks(): void {
  const drowned: MonsterDef = { ...MONSTERS.skeleton, id: 'test_drowned', name: 'Drowned Man', plural: 'Drowned Men', hp: 12, attack: 0, dice: 1, sides: 3, bonus: 0 };
  const chanter: MonsterDef = { ...MONSTERS.skeleton, id: 'test_chanter', name: 'Chanter', plural: 'Chanters', hp: 6, attack: 0, dice: 1, sides: 3, bonus: 0 };
  const choir: CombatGroup = { id: 'choir', monsters: [drowned, drowned, chanter, chanter, chanter, chanter], back: 4 };
  const fresh = (): { s: CombatState; p: Party } => { const p = defaultParty(TABLES, makeRng(5)); return { s: startCombat(TABLES, p, [choir], makeRng(5)), p }; };
  {
    const { s, p } = fresh(), knight = p.members[0], back = s.monsters.map((m, i) => ({ m, i })).filter(({ m }) => m.back).map(({ i }) => i);
    ok(back.length === 4 && s.monsters.filter((m) => m.back).every((m) => m.def === chanter) && new Set(s.monsters.map((m) => m.group)).size === 2, 'the choir stands in two ranks, its four chanters behind');
    ok(!ITEMS[knight.equipment.weapon!].ranged && back.every((i) => !canReach(s, knight, i)) && s.monsters.every((m, i) => m.back || canReach(s, knight, i)), 'a blade in the front row reaches the drowned men and not the chanters');
    const bow = p.members[3]; equip(TABLES.items, bow, 'sling');
    ok(back.every((i) => canReach(s, bow, i)), 'a sling reaches the chanters');
    // A blade aimed past the front does nothing; Spark reaches the back.
    const rng = makeRng(6);
    let blade = false, spark = false;
    for (let guard = 0; guard < 200 && !(blade && spark) && s.outcome === 'ongoing'; guard++) {
      const t = currentTurn(s, p, rng);
      if (!t) break;
      if (t.side === 'monster') { monsterAct(s, p, rng); continue; }
      const c = p.members[t.i];
      if (!blade && t.i < 3 && !ITEMS[c.equipment.weapon!].ranged) { const before = s.monsters.map((m) => m.hp).join(); blade = !partyAct(s, p, rng, { type: 'attack', target: back[0] }) && before === s.monsters.map((m) => m.hp).join(); if (!blade) break; }
      else if (!spark && c.spells.includes('spark') && c.sp >= 2) { const hp = s.monsters[back[0]].hp; partyAct(s, p, rng, { type: 'cast', spellId: 'spark', target: back[0] }); spark = s.monsters[back[0]].hp < hp; }
      else partyAct(s, p, rng, { type: 'defend' });
    }
    ok(blade, 'a front-row blade cannot strike a chanter while a drowned man stands');
    ok(spark, 'Spark strikes a chanter over the drowned men');
  }
  {
    // No chanter is struck by a blade, nor strikes with its own, until the front is down; then both.
    const { s, p } = fresh();
    let early = false, read = 0, front = true;
    play(s, p, 7, (cs, i) => aliveMonsters(cs).filter((f) => canReach(cs, p.members[i], f)).pop(), () => {
      const blade = (l: string): boolean => p.members.some((c) => !ITEMS[c.equipment.weapon!].ranged && l.startsWith(`${c.name} `));
      if (front && s.log.slice(read).some((l) => /^Chanter (hits|misses)/.test(l) || (/(hits|misses) Chanter/.test(l) && blade(l)))) early = true;
      read = s.log.length; front = frontStands(s);
    });
    ok(!early && s.outcome === 'victory', `the chanters neither strike nor are struck by a blade while the drowned men stand, and fall after them (${s.outcome})`);
  }
}

/** Morale (MONSTERS.md §2, §3.3): the barge's crew at its master's fall, the pack at three in four, and who never breaks. */
function morale(): void {
  const master: MonsterDef = { ...MONSTERS.bandit, id: 'test_master', name: 'Barge Master', plural: 'Barge Masters', hp: 1, ac: 0, xp: 300 };
  const bargeman: MonsterDef = { ...MONSTERS.bandit, id: 'test_bargeman', name: 'Bargeman', plural: 'Bargemen', hp: 500, xp: 50, gold: [10, 10] };
  const atMaster = (s: CombatState): number | undefined => { const up = aliveMonsters(s); return up.find((f) => s.monsters[f].def === master) ?? up[0]; };
  {
    const p = defaultParty(TABLES, makeRng(8)), s = startCombat(TABLES, p, [{ id: 'barge', monsters: [master, bargeman, bargeman, bargeman, bargeman, bargeman], leader: master.id }], makeRng(8));
    play(s, p, 8, atMaster);
    const died = s.log.findIndex((l) => l.includes('Barge Master dies.'));
    ok(s.outcome === 'victory' && s.monsters.filter((m) => m.fled).length === 5 && s.log[died + 1] === BREAK_LINE('5 Bargemen', false), `a barge crew leaves when its master dies, and the log says so (${s.log[died + 1]})`);
    const paid = master.xp * killPay(master.level, 1);
    ok(s.loot?.xp === Math.round(paid) && s.loot.shares.every((x) => x === Math.floor(paid / 6)) && s.loot.gold <= master.gold[1], `the fled pay no xp under the kill pay, the slain master paying by its level against the party's (${master.level} against 1), and take their gold (${s.loot?.xp} xp, ${s.loot?.gold} gold)`);
  }
  {
    // A crew in a group of its own breaks at the master's fall in the next.
    const p = defaultParty(TABLES, makeRng(9)), s = startCombat(TABLES, p, [{ id: 'master', monsters: [master], leader: master.id }, { id: 'crew', monsters: [bargeman, bargeman] }], makeRng(9));
    play(s, p, 9, atMaster);
    ok(s.monsters.filter((m) => m.fled).length === 2, 'a crew in another group breaks at its master\'s fall too');
  }
  {
    // The Hand stands; so do people with no leader, the dead and the Rift.
    const hand = startCombat(TABLES, defaultParty(TABLES, makeRng(10)), [{ id: 'h', monsters: [master, MONSTERS.cultist, MONSTERS.cultist, bargeman], leader: master.id }], makeRng(10));
    hand.monsters[0].hp = 0;
    partyAct(hand, defaultParty(TABLES, makeRng(10)), makeRng(10), { type: 'defend' });
    ok(hand.monsters.filter((m) => m.fled).map((m) => m.def.id).join() === bargeman.id && MONSTERS.cultist.steady === true, 'at the master\'s fall the bargeman breaks and the Hand\'s cultists stand');
    const leaderless = startCombat(TABLES, defaultParty(TABLES, makeRng(11)), [{ id: 'b', monsters: ['bandit', 'bandit', 'bandit', 'bandit'] }], makeRng(11));
    leaderless.monsters.slice(0, 3).forEach((m) => { m.hp = 0; });
    const dead = startCombat(TABLES, defaultParty(TABLES, makeRng(11)), [{ id: 'd', monsters: ['skeleton', 'skeleton', 'skeleton', 'skeleton'], leader: 'skeleton' }], makeRng(11));
    dead.monsters.slice(0, 3).forEach((m) => { m.hp = 0; });
    for (const s of [leaderless, dead]) { const p = defaultParty(TABLES, makeRng(11)); for (let k = 0; k < 3 && s.outcome === 'ongoing'; k++) { const t = currentTurn(s, p, makeRng(k)); if (t?.side === 'monster') monsterAct(s, p, makeRng(k)); else partyAct(s, p, makeRng(k), { type: 'defend' }); } }
    ok(!leaderless.monsters.some((m) => m.fled) && !dead.monsters.some((m) => m.fled), 'people with no leader, and the dead, never break');
  }
  {
    // A pack runs at three in four down; three rats are too few to.
    const rout = (n: number): CombatState => {
      const p = defaultParty(TABLES, makeRng(12)), s = startCombat(TABLES, p, [{ id: 'r', monsters: new Array(n).fill('rat') }], makeRng(12));
      play(s, p, 12, (cs) => aliveMonsters(cs)[0]);
      return s;
    };
    const four = rout(4), three = rout(3);
    ok(four.monsters.filter((m) => m.fled).length === 1 && four.log.includes(ROUT_LINE(MONSTERS.rat.name, true)), `the last of four rats bolts, and the log says so`);
    ok(!three.monsters.some((m) => m.fled), 'three rats fight to the last');
  }
}

/** Until the monster whose index is `who` has taken its turn, the party braces; then it stops. */
function untilActs(s: CombatState, p: Party, seed: number, who: number): boolean {
  const rng = makeRng(seed);
  for (let guard = 0; guard < 200 && s.outcome === 'ongoing'; guard++) {
    const t = currentTurn(s, p, rng);
    if (!t) return false;
    if (t.side === 'monster') { monsterAct(s, p, rng); if (t.i === who) return true; } else partyAct(s, p, rng, { type: 'defend' });
  }
  return false;
}

/** Elements (DESIGN §7, MONSTERS §3.3): every damage spell has one, and a brineling is bitten by lightning and not by cold. */
function elements(): void {
  const spells = Object.values(SPELLS).filter((x) => x.level <= 5);
  ok(spells.every((x) => !!x.element === !!x.dice), `every damage spell has an element and no other spell has one (${spells.filter((x) => !!x.element !== !!x.dice).map((x) => x.id).join(', ') || 'all'})`);
  const of = (el: string): string => spells.filter((x) => x.element === el).map((x) => x.name).join(', ');
  ok(of('fire') === 'Fire Bolt, Meteor Swarm' && of('cold') === 'Hailstorm' && of('lightning') === 'Spark, Chain Lightning, Tempest' && of('nature') === 'Thorn Lash, Stinging Swarm' && of('holy') === 'Smite, Wrath of the Hearth', 'the elements are DESIGN §7\'s');
  const brine = MONSTERS.brineling;
  ok(elementMult(brine, 'lightning') === 1.5 && elementMult(brine, 'cold') === 0 && elementMult(brine, 'fire') === 1, 'a brineling takes half again from lightning, nothing from cold and the rest whole');
  ok(elementMult(MONSTERS.skeleton, 'holy') === 1.5 && elementMult(MONSTERS.skeleton, 'nature') === 0 && elementMult(MONSTERS.bandit, 'holy') === 1, 'holy light bites the dead and the swarm does nothing to them, as their kind says; a bandit takes both whole');
  ok(KINDS.machine.weak?.includes('lightning') === true && KINDS.machine.immune.includes('holy'), 'lightning bites a machine, and the Hearth\'s light passes through it');
  ok(elementMult({ ...MONSTERS.rat, resist: ['fire'] }, 'fire') === 0.5, 'a monster that resists an element takes half');
  // The same fight, the same rolls: Chain Lightning on brinelings and on the same glass with no weakness; Hailstorm on brinelings.
  const cast = (def: MonsterDef, spellId: string): { took: number[]; s: CombatState } => {
    const r = makeRng(31), p = defaultParty(TABLES, r), sorc = p.members[5];
    sorc.level = 10; sorc.spells.push(spellId); sorc.sp = 99;
    const s = startCombat(TABLES, p, [{ id: 'b', monsters: [def, def, def, def] }], r);
    for (let guard = 0; guard < 100 && s.outcome === 'ongoing'; guard++) {
      const t = currentTurn(s, p, r); if (!t) break;
      if (t.side === 'monster') { monsterAct(s, p, r); continue; }
      if (t.i === 5) { const before = s.monsters.map((m) => m.hp); partyAct(s, p, r, { type: 'cast', spellId, target: 0 }); return { took: s.monsters.map((m, k) => before[k] - m.hp), s }; }
      partyAct(s, p, r, { type: 'defend' });
    }
    return { took: [], s };
  };
  const plain: MonsterDef = { ...brine, weak: undefined, immune: undefined };
  const bitten = cast(brine, 'lightning'), whole = cast(plain, 'lightning'), hail = cast(brine, 'hailstorm');
  ok(bitten.took.length === 4 && bitten.took.every((d, k) => d === whole.took[k] + Math.floor(whole.took[k] / 2)), `a brineling takes half again from Chain Lightning (${bitten.took.join(', ')} against ${whole.took.join(', ')})`);
  ok(hail.took.length === 4 && hail.took.every((d) => d === 0) && hail.s.log.some((l) => /Hailstorm: 0 damage/.test(l)), 'and nothing from Hailstorm');
  ok(hail.s.seen.brineling?.cold === 0 && bitten.s.seen.brineling?.lightning === 1.5, 'and the company has seen both');
  // The gate bot casts the widest, strongest spell until it has seen what the elements do; then the one the foe is weakest to.
  const r = makeRng(32), p = defaultParty(TABLES, r), sorc = p.members[5];
  sorc.level = 10; sorc.spells.push('lightning', 'meteor'); sorc.sp = 99;
  const s = startCombat(TABLES, p, [{ id: 'b', monsters: [brine, brine, brine] }], r);
  const first = gateBlast(s, sorc)?.id;
  s.seen.brineling = { lightning: 1.5 };
  const then = gateBlast(s, sorc)?.id;
  s.seen.brineling = { lightning: 0, fire: 0 };
  const never = gateBlast(s, sorc)?.id;
  ok(first === 'meteor' && then === 'lightning' && never === undefined, `the gate bot casts Meteor Swarm unseen, Chain Lightning once it has seen lightning bite, and no fire or lightning once it has seen both do nothing (${first}, ${then}, ${never})`);
}

/** Casting (MONSTERS §3.3): a chanter sings a row to sleep, a caster mends and blesses its group, and a caster in the back rank does not wait. */
function casting(): void {
  ok(Object.values(MONSTERS).every((d) => { try { monsterSpells(d); return true; } catch { return false; } }), 'every monster that casts names spells it can cast');
  ok(MONSTERS.drowned_chanter.cast?.spells.includes('sleep') === true, 'the drowned chanter sings Slumber');
  const sure: MonsterDef = { ...MONSTERS.drowned_chanter, cast: { spells: ['sleep'], chance: 1 } };
  {
    const p = defaultParty(TABLES, makeRng(40)), s = startCombat(TABLES, p, [{ id: 'c', monsters: [sure] }], makeRng(40));
    untilActs(s, p, 40, 0);
    const line = s.log.find((l) => l.startsWith('Drowned Chanter casts Slumber')) ?? '';
    const asleep = p.members.filter((c) => hasCondition(c, 'asleep'));
    ok(asleep.length > 0 && asleep.every((c) => p.members.indexOf(c) < 3) && line.includes('asleep'), `a chanter puts the front row to sleep (${line})`);
  }
  {
    // Over a few fights the chanter as the table has it sings someone to sleep.
    let slept = 0;
    for (let seed = 41; seed < 51; seed++) {
      const p = defaultParty(TABLES, makeRng(seed)), s = startCombat(TABLES, p, [{ id: 'c', monsters: ['drowned_chanter', 'drowned_chanter', 'drowned_chanter'] }], makeRng(seed));
      for (let k = 0; k < 6; k++) untilActs(s, p, seed * 10 + k, k % 3);
      if (s.log.some((l) => /^Drowned Chanter casts Slumber: .* asleep\.$/.test(l))) slept++;
    }
    ok(slept >= 5, `the table's chanter sings a row asleep in most short fights (${slept} of 10)`);
  }
  {
    // A hit wakes a sleeper; a sleeper it fells stays down.
    const p = defaultParty(TABLES, makeRng(42)), s = startCombat(TABLES, p, [{ id: 'w', monsters: [{ ...MONSTERS.wolf, attack: 99, dice: 1, sides: 1, bonus: 0 }] }], makeRng(42));
    for (const c of p.members) addCondition(TABLES.items, c, 'asleep');
    untilActs(s, p, 42, 0);
    const line = s.log.find((l) => l.startsWith('Wolf hits')) ?? '';
    const struck = p.members.find((c) => line.startsWith(`Wolf hits ${c.name} `));
    ok(!!struck && !hasCondition(struck, 'asleep') && line === `Wolf hits ${struck.name} for 1. ${struck.name} wakes.`, `a hit wakes the sleeper it falls on (${line})`);
  }
  {
    // Sleep is the fight's: its sleepers wake once it is won. The bots wake a sleeper of the front row first.
    const p = defaultParty(TABLES, makeRng(53)), s = startCombat(TABLES, p, [{ id: 'r', monsters: ['rat'] }], makeRng(53));
    const maren = p.members[4];
    maren.spells.push('cure'); maren.sp = 20;
    addCondition(TABLES.items, p.members[3], 'asleep'); addCondition(TABLES.items, p.members[1], 'asleep');
    const pick = wakeWith(p, maren);
    ok(pick?.spellId === 'cure' && pick.target === 1, `the bots wake Idris, of the front row, before Ottilie, of the back, with Cleanse (${JSON.stringify(pick)})`);
    s.monsters[0].hp = 0;
    partyAct(s, p, makeRng(53), { type: 'defend' });
    ok(s.outcome === 'victory' && !p.members.some((c) => hasCondition(c, 'asleep')), 'and the sleepers wake once the fight is won');
    // Or fled.
    let fled = false;
    for (let seed = 1; seed < 30 && !fled; seed++) {
      const r = makeRng(seed), q = defaultParty(TABLES, r), f = startCombat(TABLES, q, [{ id: 's', monsters: ['slime'] }], r);
      addCondition(TABLES.items, q.members[0], 'asleep');
      for (let i = 0; i < 20 && f.outcome === 'ongoing'; i++) { const t = currentTurn(f, q, r); if (!t) break; if (t.side === 'party') partyAct(f, q, r, { type: 'flee' }); else monsterAct(f, q, r); }
      fled = f.outcome === 'fled' && !hasCondition(q.members[0], 'asleep');
    }
    ok(fled, 'and once it is fled');
  }
  {
    // A hit that fells a sleeper leaves them down, and says no waking.
    const p = defaultParty(TABLES, makeRng(55)), s = startCombat(TABLES, p, [{ id: 'w', monsters: [{ ...MONSTERS.wolf, attack: 99, dice: 1, sides: 1, bonus: 200 }] }], makeRng(55));
    for (const c of p.members) addCondition(TABLES.items, c, 'asleep');
    for (let k = 55; k < 70 && !s.log.some((l) => l.startsWith('Wolf hits')); k++) untilActs(s, p, k, 0);
    const line = s.log.find((l) => l.startsWith('Wolf hits')) ?? '';
    const felled = p.members.find((c) => line.startsWith(`Wolf hits ${c.name} `));
    ok(!!felled && hasCondition(felled, 'dead') && !line.includes('wakes') && line.endsWith('falls!'), `a hit that fells a sleeper wakes no one (${line})`);
  }
  {
    // A mender mends the most hurt of its group; a priest blesses and wards it, and not again while it lasts.
    const mender: MonsterDef = { ...MONSTERS.bandit, id: 'test_mender', name: 'Mender', plural: 'Menders', level: 12, cast: { spells: ['heal'], chance: 1 } };
    const fellow: MonsterDef = { ...MONSTERS.bandit, hp: 100 };
    const p = defaultParty(TABLES, makeRng(43)), s = startCombat(TABLES, p, [{ id: 'm', monsters: [mender, fellow] }], makeRng(43));
    s.monsters[1].hp = 2;
    untilActs(s, p, 43, 0);
    ok(s.monsters[1].hp === 2 + 8 + 10 && s.log.some((l) => l === `Mender casts Mend: Bandit recovers ${8 + 10}.`), `a mender mends its hurt fellow by the spell and its level held to 10 (${s.monsters[1].hp})`);
    const whole = startCombat(TABLES, defaultParty(TABLES, makeRng(44)), [{ id: 'm', monsters: [mender, MONSTERS.bandit] }], makeRng(44));
    untilActs(whole, defaultParty(TABLES, makeRng(44)), 44, 0);
    ok(!whole.log.some((l) => l.includes('casts Mend')), 'and with nobody hurt it strikes instead');
    const priest: MonsterDef = { ...MONSTERS.bandit, id: 'test_priest', name: 'Priest', plural: 'Priests', cast: { spells: ['bless', 'ward'], chance: 1 } };
    const pp = defaultParty(TABLES, makeRng(45)), b = startCombat(TABLES, pp, [{ id: 'p', monsters: [priest, MONSTERS.bandit] }, { id: 'q', monsters: [MONSTERS.bandit] }], makeRng(45));
    untilActs(b, pp, 45, 0);
    ok(b.foeBless[0] === 5 && b.foeBless[1] === 0 && monsterHit(b, b.monsters[1]) === MONSTERS.bandit.attack + BLESS_HIT && monsterHit(b, b.monsters[2]) === MONSTERS.bandit.attack, 'a priest blesses its own group and not the next');
    const round = b.round;
    untilActs(b, pp, 46, 0);
    ok(b.foeShield[0] > 0 && monsterAc(b, b.monsters[1]) === MONSTERS.bandit.ac + WARD_AC && b.log.includes('Priest casts Ward. A ward settles over its group.') && b.log.includes('Priest casts Bless. Its group is blessed.'), 'and wards it while the blessing lasts, rather than bless again');
    ok(b.foeBless[0] === 5 - (b.round - round), `the blessing runs down a round at a time (${b.foeBless[0]} left after ${b.round - round} rounds)`);
  }
  {
    // A caster in the back rank casts while the front stands; one without a bow that fails its chance holds.
    const singer: MonsterDef = { ...sure, id: 'test_singer', ranged: false };
    const choir: CombatGroup = { id: 'choir', monsters: [MONSTERS.skeleton, MONSTERS.skeleton, singer], back: 1 };
    const p = defaultParty(TABLES, makeRng(47)), s = startCombat(TABLES, p, [choir], makeRng(47));
    ok(untilActs(s, p, 47, 2) && frontStands(s) && s.log.some((l) => l.startsWith('Drowned Chanter casts Slumber')), 'a chanter in the back rank sings while the drowned men stand');
    const quiet: MonsterDef = { ...singer, cast: { spells: ['sleep'], chance: 0 } };
    const q = defaultParty(TABLES, makeRng(48)), t = startCombat(TABLES, q, [{ ...choir, monsters: [MONSTERS.skeleton, MONSTERS.skeleton, quiet] }], makeRng(48));
    untilActs(t, q, 48, 2);
    ok(!t.log.some((l) => l.startsWith('Drowned Chanter')), 'and one that does not sing holds its place, and strikes no one');
  }
  {
    // Fire Bolt falls on a row; Meteor Swarm on the whole party.
    const bolt: MonsterDef = { ...MONSTERS.bandit, id: 'test_bolt', name: 'Adept', plural: 'Adepts', level: 14, cast: { spells: ['firebolt'], chance: 1 } };
    const p = defaultParty(TABLES, makeRng(49)), s = startCombat(TABLES, p, [{ id: 'a', monsters: [bolt] }], makeRng(49));
    const before = p.members.map((c) => c.hp);
    untilActs(s, p, 49, 0);
    const hurt = p.members.map((c, k) => before[k] - c.hp);
    ok(hurt.slice(0, 3).every((d) => d >= 5 && d <= 20) && hurt.slice(3).every((d) => d === 0) && s.log.some((l) => /^Adept casts Fire Bolt: \d+ damage to the front row\./.test(l)), `an adept's Fire Bolt falls on the front row, five dice at its level held to 10 (${hurt.join(', ')})`);
  }
}

/** Drain (MONSTERS §3.3): a leech that hits is healed by it; a bog light takes spell points before hit points. */
function drain(): void {
  // The leech is #174's; this is its shape, a controller on the line at 10.
  const leech: MonsterDef = { ...MONSTERS.fen_eel, id: 'test_leech', name: 'Leech', plural: 'Leeches', attack: 99, drain: 'hp' };
  const p = defaultParty(TABLES, makeRng(50)), s = startCombat(TABLES, p, [{ id: 'l', monsters: [leech] }], makeRng(50));
  s.monsters[0].hp = 40;
  untilActs(s, p, 50, 0);
  const line = s.log.find((l) => l.startsWith('Leech hits')) ?? '', took = Number(/for (\d+)/.exec(line)?.[1]);
  ok(took > 0 && s.monsters[0].hp === 40 + took && line.includes('and drinks'), `a leech that hits is healed by it (${line}; ${s.monsters[0].hp} hp)`);
  s.monsters[0].hp = leech.hp - 1;
  untilActs(s, p, 51, 0);
  ok(s.monsters[0].hp === leech.hp, 'and never past its own hit points');
  {
    // On a member near death it drinks only what the member had to lose.
    const deep: MonsterDef = { ...leech, dice: 1, sides: 1, bonus: 49 };
    const q = defaultParty(TABLES, makeRng(54)), t = startCombat(TABLES, q, [{ id: 'l', monsters: [deep] }], makeRng(54));
    for (const c of q.members) c.hp = 3;
    t.monsters[0].hp = 10;
    for (let k = 54; k < 60 && t.monsters[0].hp === 10; k++) untilActs(t, q, k, 0);
    const bitten = q.members.find((c) => c.hp < 3)!;
    ok(!!bitten && t.monsters[0].hp === 10 + 3 - bitten.hp, `a leech's blow of 50 on a member with 3 drinks ${3 - (bitten?.hp ?? 3)}, what they lost (${t.monsters[0].hp} hp)`);
  }
  const light: MonsterDef = { ...leech, id: 'test_light', name: 'Bog Light', plural: 'Bog Lights', ranged: true, drain: 'sp', dice: 1, sides: 1, bonus: 9 };
  const q = defaultParty(TABLES, makeRng(52)), cassian = q.members[5];
  for (const c of q.members) if (c !== cassian) addCondition(TABLES.items, c, 'unconscious');
  cassian.sp = 15; cassian.hp = 30; cassian.maxHp = 30;
  const t = startCombat(TABLES, q, [{ id: 'b', monsters: [light] }], makeRng(52));
  untilActs(t, q, 52, 0);
  ok(cassian.sp === 5 && cassian.hp === 30 && t.log.includes('Bog Light hits Cassian for 10 spell points.'), `a bog light takes spell points before hit points (${cassian.sp} sp, ${cassian.hp} hp)`);
  for (let k = 53; k < 60 && cassian.sp > 0; k++) untilActs(t, q, k, 0);
  ok(cassian.sp === 0 && cassian.hp === 25 && t.log.includes('Bog Light hits Cassian for 5 spell points and 5.'), `and the rest from hit points once they run dry (${cassian.sp} sp, ${cassian.hp} hp)`);
}

/** Tiers 6 and 7 and the ranks (DESIGN §7, #20). */
function pastTen(): void {
  const late = Object.values(SPELLS).filter((x) => x.level >= 6);
  const named = (list: string, tier: number): string => late.filter((x) => x.list === list && x.level === tier).map((x) => x.name).join(', ');
  ok(late.length === 13 && named('sorcerer', 6) === 'Hoarfrost, Walk on Water, Waymark' && named('sorcerer', 7) === 'Killing Frost, Levitate' && named('cleric', 6) === 'Hearthfire, Cleansing Light'
    && named('cleric', 7) === 'Lampglass, Absolve' && named('druid', 6) === 'Wildfire, Grasping Roots' && named('druid', 7) === 'Wrath of the Wood, Greening', 'thirteen spells in tiers 6 and 7, as DESIGN §7 tables them');
  const fixed = late.filter((x) => x.dice).map((x) => `${x.id} ${x.dice}d${x.sides} ${x.element} ${x.target}${x.perLevel ? ' grows' : ''}`).join('; ');
  ok(fixed === 'hearthfire 6d8 fire group; hoarfrost 8d8 cold group; killing_frost 10d12 cold all; wildfire 6d8 fire group; wrath_wood 8d10 nature all', `their damage spells roll fixed dice (${fixed})`);
  const monsters = late.filter((x) => monsterCanCast(x)).map((x) => x.id).sort().join();
  ok(monsters === 'hearthfire,hoarfrost,killing_frost,wildfire,wrath_wood', `a monster may cast their damage spells and none of the rest (${monsters})`);
  // A rank lifts a damage spell's dice and a mend's heal, a hybrid's half as much, and nothing else.
  const tough: MonsterDef = { ...MONSTERS.bandit, id: 'test_wall', hp: 9999 };
  const blast = (prestige: number): number => {
    const r = makeRng(60), p = defaultParty(TABLES, r), sorc = p.members[5];
    sorc.level = 16; sorc.spells.push('hoarfrost'); sorc.sp = 99; sorc.prestige = prestige;
    const s = startCombat(TABLES, p, [{ id: 'w', monsters: [tough] }], r);
    for (let guard = 0; guard < 60; guard++) {
      const t = currentTurn(s, p, r); if (!t) break;
      if (t.side === 'monster') monsterAct(s, p, r);
      else if (t.i === 5) { partyAct(s, p, r, { type: 'cast', spellId: 'hoarfrost', target: 0 }); return 9999 - s.monsters[0].hp; }
      else partyAct(s, p, r, { type: 'defend' });
    }
    return 0;
  };
  const bare = blast(0) - 2, third = blast(3) - 2;
  ok(bare > 0 && third === Math.round(bare * 1.45), `the third rank lifts Hoarfrost's roll by 45%, Spellfire on top (${bare} and ${third}, each and 2)`);
  const p = defaultParty(TABLES, makeRng(61)), maren = p.members[4], idris = p.members[1], bram = p.members[0];
  const mend = (c: typeof maren, n: number): number => { c.prestige = n; const h = spellHeal(TABLES.items, c, 30); c.prestige = 0; return h; };
  ok(mend(maren, 2) === mend(maren, 0) + Math.round(30 * 1.3) - 30 && mend(idris, 2) === mend(idris, 0) + Math.round(30 * 1.15) - 30, `a cleric's second rank lifts a mend of 30 by 30%, a paladin's by 15% (${mend(maren, 2)}, ${mend(idris, 2)})`);
  bram.prestige = 3;
  ok(rankMult(bram) === 1, 'and a knight\'s prestiges are no ranks');
  // The sorcerer's third rank passes a resistance to its element, never an immunity.
  {
    const glass: MonsterDef = { ...tough, id: 'test_glass', resist: ['cold'], immune: ['lightning'] };
    const hit = (prestige: number, spellId: string): number => {
      const r = makeRng(67), q = defaultParty(TABLES, r), sorc = q.members[5];
      sorc.level = 16; sorc.spells.push(spellId); sorc.sp = 99; sorc.prestige = prestige;
      const s = startCombat(TABLES, q, [{ id: 'g', monsters: [glass] }], r);
      for (let guard = 0; guard < 60; guard++) {
        const t = currentTurn(s, q, r); if (!t) break;
        if (t.side === 'monster') monsterAct(s, q, r);
        else if (t.i === 5) { partyAct(s, q, r, { type: 'cast', spellId, target: 0 }); return 9999 - s.monsters[0].hp; }
        else partyAct(s, q, r, { type: 'defend' });
      }
      return -1;
    };
    const second = hit(2, 'hoarfrost'), third = hit(3, 'hoarfrost'), whole = Math.round((third - 2) / 1.45) + 2;
    ok(second === Math.ceil((Math.round((whole - 2) * 1.3) + 2) / 2) && third > second * 1.5 && hit(3, 'lightning') === 0, `a Magus's Hoarfrost passes a resistance to cold (${second} at the second rank, ${third} at the third), and its Chain Lightning still does nothing to what lightning cannot touch`);
  }
  // Grasping Roots holds a group, a hit does not free it, and each held monster tears free in time.
  {
    const r = makeRng(62), q = defaultParty(TABLES, r), druid = q.members[2];
    druid.spells.push('roots'); druid.sp = 99;
    const s = startCombat(TABLES, q, [{ id: 'b', monsters: [tough, tough, tough, tough] }], r);
    for (let guard = 0; guard < 60 && !s.log.some((l) => l.includes('Grasping Roots')); guard++) {
      const t = currentTurn(s, q, r); if (!t) break;
      if (t.side === 'monster') monsterAct(s, q, r); else if (t.i === 2) partyAct(s, q, r, { type: 'cast', spellId: 'roots', target: 0 }); else partyAct(s, q, r, { type: 'defend' });
    }
    const held = s.monsters.filter((m) => m.conditions.includes('paralysed'));
    const line = s.log.find((l) => l.includes('Grasping Roots')) ?? '';
    ok(held.length > 0 && line === `Wren casts Grasping Roots: ${held.length} of the Bandits ${held.length === 1 ? 'is' : 'are'} held fast.`, `Grasping Roots holds some of a group fast (${line})`);
    held[0].hp -= 1;
    const bandit = s.monsters.indexOf(held[0]);
    partyAct(s, q, r, { type: 'attack', target: bandit });
    ok(held[0].conditions.includes('paralysed'), 'a blow does not free a held monster');
    for (let guard = 0; guard < 400 && s.monsters.some((m) => m.conditions.includes('paralysed')); guard++) {
      const t = currentTurn(s, q, r); if (!t) break;
      if (t.side === 'monster') monsterAct(s, q, r); else partyAct(s, q, r, { type: 'defend' });
    }
    ok(!s.monsters.some((m) => m.conditions.includes('paralysed')) && s.log.some((l) => /Bandits? tears? free\.$/.test(l)), 'and the held tear free in a few rounds, and the log says so');
  }
  // Lampglass halves the chosen harm for five rounds; it will not be cast without a choice.
  {
    const adept: MonsterDef = { ...MONSTERS.bandit, id: 'test_adept', name: 'Adept', plural: 'Adepts', level: 10, cast: { spells: ['firebolt'], chance: 1 } };
    const burn = (glass: boolean): number => {
      const r = makeRng(63), q = defaultParty(TABLES, r), maren = q.members[4];
      maren.spells.push('lampglass'); maren.sp = 99;
      const s = startCombat(TABLES, q, [{ id: 'a', monsters: [adept] }], r);
      if (glass) s.glass = { element: 'fire', rounds: 5 };
      const before = q.members.reduce((t, c) => t + c.hp, 0);
      untilActs(s, q, 64, 0);
      return before - q.members.reduce((t, c) => t + c.hp, 0);
    };
    const bare = burn(false), dimmed = burn(true);
    ok(dimmed > 0 && dimmed < bare, `under Lampglass against fire an adept's Fire Bolt does less (${dimmed} against ${bare})`);
    const r = makeRng(65), q = defaultParty(TABLES, r), maren = q.members[4];
    maren.spells.push('lampglass'); maren.sp = 99;
    const s = startCombat(TABLES, q, [{ id: 'a', monsters: ['rat'] }], r);
    let refused = false, cast = false;
    for (let guard = 0; guard < 40 && !cast; guard++) {
      const t = currentTurn(s, q, r); if (!t) break;
      if (t.side === 'monster') { monsterAct(s, q, r); continue; }
      if (t.i === 4) { refused = !partyAct(s, q, r, { type: 'cast', spellId: 'lampglass', target: 0 }); cast = partyAct(s, q, r, { type: 'cast', spellId: 'lampglass', target: 0, element: 'cold' }); }
      else partyAct(s, q, r, { type: 'defend' });
    }
    ok(refused && cast && s.glass?.element === 'cold' && s.log.includes('Maren casts Lampglass. The glass dims the cold.'), 'Lampglass asks against what, and dims it');
  }
  // A member's own resistance (#555): an item worn, or a slotless one in their pack, halves its
  // element as Lampglass does, and the two together still halve it once.
  {
    const charm = { id: 'test_frost_charm', name: 'Frost Charm', slot: 'none' as const, price: 0, resist: ['cold' as const] };
    const coat = { id: 'test_frost_coat', name: 'Frost Coat', slot: 'armor' as const, price: 0, ac: 1, resist: ['cold' as const] };
    {
      const lent = tablesWith([charm, coat]);
      const frost: MonsterDef = { ...MONSTERS.bandit, id: 'test_frost', name: 'Frost Adept', plural: 'Frost Adepts', level: 10, cast: { spells: ['killing_frost'], chance: 1 } };
      const chill = (dress: (q: Party) => void, glass = false): number[] => {
        const r = makeRng(71), q = defaultParty(lent, r);
        for (const c of q.members) c.hp = c.maxHp = 999;
        dress(q);
        const s = startCombat(lent, q, [{ id: 'a', monsters: [frost] }], r);
        if (glass) s.glass = { element: 'cold', rounds: 5 };
        untilActs(s, q, 72, 0);
        return q.members.map((c) => 999 - c.hp);
      };
      const bare = chill(() => {}), half = (d: number[]): number[] => d.map((x) => Math.ceil(x / 2));
      const carried = chill((q) => { q.members[0].pack.push(charm.id); });
      const worn = chill((q) => { equip(lent.items, q.members[1], coat.id); });
      const unworn = chill((q) => { q.members[1].pack.push(coat.id); });
      const bagged = chill((q) => { q.bag.push(charm.id); });
      const blessed = chill((q) => { q.members[2].blessed.push({ element: 'cold', until: 'rest' }); });
      const glass = chill(() => {}, true), both = chill((q) => { q.members[0].pack.push(charm.id); }, true);
      ok(bare[0] > 1 && carried[0] === half(bare)[0] && carried.slice(1).join() === bare.slice(1).join(), `a member carrying a charm against cold takes half from a cold spell, the rest whole (${carried[0]} against ${bare[0]})`);
      ok(worn[1] === half(bare)[1] && (() => { const c = defaultParty(lent, makeRng(73)).members[1]; equip(lent.items, c, coat.id); c.pack.push(charm.id); return resists(lent.items, c).join() === 'cold'; })(), `armour against cold halves it worn (${worn[1]} against ${bare[1]})`);
      ok(unworn.join() === bare.join() && bagged.join() === bare.join(), 'armour in the pack and a charm in the bag resist nothing');
      ok(blessed[2] === half(bare)[2] && blessed.filter((_, i) => i !== 2).join() === bare.filter((_, i) => i !== 2).join(), `a member a blessing keeps the cold off takes half from a cold spell (${blessed[2]} against ${bare[2]})`);
      ok(glass.join() === half(bare).join() && both.join() === glass.join(), `under Lampglass a member with a resistance to the same element still takes half, not a quarter (${both[0]} against ${glass[0]})`);
    }
  }
  // Cleansing Light and Greening on everyone; Absolve on stone and curse.
  {
    const q = defaultParty(TABLES, makeRng(66)), maren = q.members[4];
    for (const c of q.members) { addCondition(TABLES.items, c, 'poisoned'); addCondition(TABLES.items, c, 'diseased'); c.hp = 5; }
    addCondition(TABLES.items, q.members[0], 'paralysed');
    const clean = castOnParty(TABLES.items, maren, SPELLS.cleansing_light, q);
    ok(q.members.every((c) => !hasCondition(c, 'poisoned') && !hasCondition(c, 'paralysed') && c.hp === 5) && clean === 'Maren casts Cleansing Light. The party is cleansed.', `Cleansing Light lifts every affliction from everyone and heals nothing (${clean})`);
    for (const c of q.members) addCondition(TABLES.items, c, 'poisoned');
    const green = castOnParty(TABLES.items, maren, SPELLS.greening, q);
    ok(q.members.every((c) => !hasCondition(c, 'poisoned') && c.hp > 5) && green === 'Maren casts Greening. The party is healed and cleansed.', `Greening heals everyone and draws out poison (${green})`);
    const bram = q.members[0];
    addCondition(TABLES.items, bram, 'stoned'); addCondition(TABLES.items, bram, 'cursed');
    const both = castOnAlly(TABLES.items, maren, SPELLS.absolve, bram), none = castOnAlly(TABLES.items, maren, SPELLS.absolve, bram);
    ok(!hasCondition(bram, 'stoned') && !hasCondition(bram, 'cursed') && both === 'Maren casts Absolve: Bram is flesh again, and the curse lifts.' && none === 'Maren casts Absolve, but Bram needs no absolving.', `Absolve lifts stone and curse (${both})`);
  }
}

/** The party braces, or does what `act` gives a member where it gives anything, until the round in hand is over. */
function throughRound(s: CombatState, p: Party, seed: number, act?: (i: number) => PartyAction | undefined): void {
  const rng = makeRng(seed), round = s.round;
  for (let guard = 0; guard < 200 && s.outcome === 'ongoing'; guard++) {
    const t = currentTurn(s, p, rng);
    if (!t || s.round !== round) return;
    if (t.side === 'monster') { monsterAct(s, p, rng); continue; }
    const a = act?.(t.i);
    if (!a || !partyAct(s, p, rng, a)) partyAct(s, p, rng, { type: 'defend' });
  }
}

/** Regeneration (MONSTERS §3.3, #537): a troll mends each round but a round fire burnt it, one felled stays down, and the bots burn what they have seen mend. */
function regeneration(): void {
  const troll: MonsterDef = { ...MONSTERS.ogre, id: 'test_troll', name: 'Troll', plural: 'Trolls', hp: 200, regen: 20, attack: 0, dice: 1, sides: 2, bonus: 0 };
  const fresh = (seed: number, defs: readonly MonsterDef[] = [troll]): { s: CombatState; p: Party } => {
    const p = defaultParty(TABLES, makeRng(seed)), mage = p.members[5];
    mage.spells.push('firebolt'); mage.sp = mage.maxSp = 99;
    return { s: startCombat(TABLES, p, [{ id: 't', monsters: defs }], makeRng(seed)), p };
  };
  const cassian = (spellId: string) => (i: number): PartyAction | undefined => (i === 5 ? { type: 'cast', spellId, target: 0 } : undefined);
  {
    const { s, p } = fresh(80);
    s.monsters[0].hp = 150;
    throughRound(s, p, 80);
    ok(s.monsters[0].hp === 170 && s.log.includes(MEND_LINE('Troll', true, 20)) && s.mends?.test_troll === 20, `a hurt troll mends 20 at the round's end, and the company has seen it mend (${s.monsters[0].hp} hp)`);
    s.monsters[0].hp = 195;
    throughRound(s, p, 81);
    ok(s.monsters[0].hp === 200 && s.log.includes(MEND_LINE('Troll', true, 5)), 'and never past its own hit points');
    throughRound(s, p, 82);
    ok(s.monsters[0].hp === 200 && s.log.filter((l) => l.startsWith('Troll mends')).length === 2, 'and a whole one says nothing');
  }
  {
    // Fire that lands keeps it from mending that round, and the next round it mends again; lightning does not.
    const { s, p } = fresh(83);
    s.monsters[0].hp = 150;
    throughRound(s, p, 83, cassian('firebolt'));
    const burnt = s.monsters[0].hp;
    ok(burnt < 150 && s.log.includes(SMOULDER_LINE('Troll', true)) && !s.log.some((l) => l.startsWith('Troll mends')) && !s.monsters[0].burnt, `a troll Fire Bolt struck smoulders and does not mend at the round's end (${burnt} hp; ${s.log.find((l) => l.startsWith('Cassian casts'))})`);
    throughRound(s, p, 84);
    ok(s.monsters[0].hp === burnt + 20, `and mends again the round after, unburnt (${s.monsters[0].hp} hp)`);
    const sparked = fresh(85);
    sparked.s.monsters[0].hp = 150;
    throughRound(sparked.s, sparked.p, 85, cassian('spark'));
    const struck = sparked.s.log.find((l) => l.startsWith('Cassian casts Spark')) ?? '';
    ok(!!struck && sparked.s.log.includes(MEND_LINE('Troll', true, 20)), `Spark's lightning does not keep it from mending (${struck})`);
    const proof = fresh(86, [{ ...troll, immune: ['fire'] }]);
    proof.s.monsters[0].hp = 150;
    throughRound(proof.s, proof.p, 86, cassian('firebolt'));
    ok(proof.s.monsters[0].hp === 170 && proof.s.log.some((l) => /Fire Bolt: 0 damage/.test(l)), 'and fire that does nothing to it keeps nothing from mending');
  }
  {
    // Mending is for the living: one felled stays down while the rest mend, and two mend in one line.
    const { s, p } = fresh(87, [troll, troll, troll]);
    s.monsters[0].hp = -5; s.monsters[1].hp = 150; s.monsters[2].hp = 120;
    throughRound(s, p, 87);
    ok(s.monsters[0].hp === -5 && s.monsters[1].hp === 170 && s.monsters[2].hp === 140 && s.log.includes(MEND_LINE('2 Trolls', false, 40)), `a felled troll stays down while two mend 40 between them (${s.log.find((l) => l.includes('Trolls mend'))})`);
    s.monsters[1].hp = 0; s.monsters[2].hp = 0;
    partyAct(s, p, makeRng(88), { type: 'defend' });
    ok(s.outcome === 'victory', 'and the fight is won once every one is down');
  }
  {
    // The gate bot burns what it has seen mend, with the widest fire it has, until fire has struck it this round.
    const { s, p } = fresh(89), mage = p.members[5];
    ok(gateBurn(s, mage) === undefined, 'the gate bot burns nothing it has not seen mend');
    s.mends = { test_troll: 20 };
    const burn = gateBurn(s, mage);
    ok(burn?.spellId === 'firebolt' && burn.target === 0, `and once it has, it burns it with Fire Bolt (${JSON.stringify(burn)})`);
    mage.spells.push('meteor');
    ok(gateBurn(s, mage)?.spellId === 'meteor', 'or Meteor Swarm, which reaches further');
    s.monsters[0].burnt = true;
    ok(gateBurn(s, mage) === undefined, 'and nothing fire has struck already this round');
    s.monsters[0].burnt = false; s.seen.test_troll = { fire: 0 };
    ok(gateBurn(s, mage) === undefined, 'nor what it has seen fire do nothing to');
    s.seen = {};
    ok(gateBurn(s, p.members[0]) === undefined, 'and a member with no fire burns nothing');
  }
}

/** Curse (MONSTERS §3.3, #537): a wight's hit curses, and the curse outlasts the fight, a rest and a raising until a cure lifts it; it takes nothing in a fight. */
function curse(): void {
  const wight: MonsterDef = { ...MONSTERS.wraith, id: 'test_wight', name: 'Wight', plural: 'Wights', attack: 99, dice: 1, sides: 1, bonus: 0, inflict: { cond: 'cursed', chance: 1 } };
  const p = defaultParty(TABLES, makeRng(90)), s = startCombat(TABLES, p, [{ id: 'w', monsters: [wight] }], makeRng(90));
  untilActs(s, p, 90, 0);
  const line = s.log.find((l) => l.startsWith('Wight hits')) ?? '', hit = p.members.find((c) => line.startsWith(`Wight hits ${c.name} `));
  ok(!!hit && hasCondition(hit, 'cursed') && line === `Wight hits ${hit.name} for 1. ${hit.name} is cursed!`, `a wight's hit curses (${line})`);
  if (!hit) return;
  {
    // Faith keeps it off a cleric, and the line claims none; a curse already taken is not said again.
    const q = defaultParty(TABLES, makeRng(91)), maren = q.members[4];
    for (const c of q.members) if (c !== maren) addCondition(TABLES.items, c, 'unconscious');
    const t = startCombat(TABLES, q, [{ id: 'w', monsters: [wight] }], makeRng(91));
    untilActs(t, q, 91, 0);
    const l = t.log.find((x) => x.startsWith('Wight hits Maren')) ?? '';
    ok(l === 'Wight hits Maren for 1.' && !hasCondition(maren, 'cursed'), `Faith keeps a curse off a cleric, and the log claims none (${l})`);
    const bram = q.members[0];
    bram.conditions = ['cursed'];
    for (const c of q.members) if (c !== bram) c.conditions = ['unconscious'];
    const u = startCombat(TABLES, q, [{ id: 'w', monsters: [wight] }], makeRng(92));
    untilActs(u, q, 92, 0);
    const again = u.log.find((x) => x.startsWith('Wight hits Bram')) ?? '';
    ok(again === 'Wight hits Bram for 1.', `and a curse already taken is not said again (${again})`);
  }
  // Not the fight's, as sleep is: it outlasts the fight's end, a rest and a raising.
  s.monsters[0].hp = 0;
  partyAct(s, p, makeRng(93), { type: 'defend' });
  ok(s.outcome === 'victory' && hasCondition(hit, 'cursed'), 'the curse outlasts the fight');
  rest(hit);
  ok(hasCondition(hit, 'cursed'), 'and a rest');
  const maren = p.members[4];
  addCondition(TABLES.items, hit, 'dead');
  castOnAlly(TABLES.items, maren, spell('revive'), hit);
  ok(!hasCondition(hit, 'dead') && hasCondition(hit, 'cursed'), 'and a raising');
  // Restore lifts it at tier 4 and Absolve at tier 7, which a cleric learns at 23 (DESIGN §7).
  const lifted = castOnAlly(TABLES.items, maren, spell('restore'), hit);
  ok(!hasCondition(hit, 'cursed') && spell('restore').level === 4, `Restore lifts it (${lifted})`);
  addCondition(TABLES.items, hit, 'cursed');
  const absolved = castOnAlly(TABLES.items, maren, spell('absolve'), hit);
  ok(!hasCondition(hit, 'cursed') && absolved === `Maren casts Absolve: the curse lifts from ${hit.name}.` && spell('absolve').level === 7 && spellTierAt(22) === 6 && spellTierAt(23) === 7, `and Absolve, of tier 7, which comes at 23 (${absolved})`);
  // It takes nothing in a fight: a cursed member strikes, wears its armour and acts as it did.
  const plain = defaultParty(TABLES, makeRng(94)).members[0], cursed = structuredClone(plain);
  addCondition(TABLES.items, cursed, 'cursed');
  ok(attackBonus(TABLES.items, cursed) === attackBonus(TABLES.items, plain) && armorClass(TABLES.items, cursed) === armorClass(TABLES.items, plain) && canAct(cursed), 'and a curse takes nothing in a fight: what it costs is the cure');
}

/**
 * Stone (MONSTERS §3.3, #546): a basilisk's hit turns a member to glass, out of the fight and passed
 * over, through the fight's end and a rest, till a draught, Absolve or a temple lifts it.
 */
function stone(): void {
  const basilisk: MonsterDef = { ...MONSTERS.wraith, id: 'test_basilisk', name: 'Basilisk', plural: 'Basilisks', attack: 99, dice: 1, sides: 1, bonus: 0, inflict: { cond: 'stoned', chance: 1 } };
  const p = defaultParty(TABLES, makeRng(95)), s = startCombat(TABLES, p, [{ id: 'b', monsters: [basilisk] }], makeRng(95));
  untilActs(s, p, 95, 0);
  const line = s.log.find((l) => l.startsWith('Basilisk hits')) ?? '', hit = p.members.find((c) => line.startsWith(`Basilisk hits ${c.name} `));
  ok(!!hit && hasCondition(hit, 'stoned') && line === `Basilisk hits ${hit.name} for 1. ${STONE_LINE(hit.name)}` && logLines(line).length <= 2, `a basilisk's hit turns a member to glass, and the log says so and not a fall (${line})`);
  if (!hit) return;
  untilActs(s, p, 96, 0);
  const next = s.log.filter((l) => l.startsWith('Basilisk hits'))[1] ?? '';
  ok(isDown(hit) && !canAct(hit) && !!next && !next.startsWith(`Basilisk hits ${hit.name} `), `the glassed is out of the fight, and passed over (${next})`);
  // Not the fight's, as sleep is: it outlasts the fight's end and a rest, which mends nothing in it.
  const hp = hit.hp;
  s.monsters[0].hp = 0;
  partyAct(s, p, makeRng(97), { type: 'defend' });
  rest(hit);
  ok(s.outcome === 'victory' && hasCondition(hit, 'stoned') && hit.hp === hp, 'it outlasts the fight and a rest, which mends nothing in it');
  // The draught lifts it, in a fight from the bag as on the walk; one glassed at no hit points comes back out cold.
  const draught = ITEMS.quickening, q = defaultParty(TABLES, makeRng(98)), glassed = q.members[0];
  addCondition(TABLES.items, glassed, 'stoned'); q.bag.push(draught.id);
  const t = startCombat(TABLES, q, [{ id: 'b', monsters: [{ ...basilisk, inflict: undefined }] }], makeRng(98)), rng = makeRng(98);
  for (let guard = 0; guard < 50 && currentTurn(t, q, rng)?.side === 'monster'; guard++) monsterAct(t, q, rng);
  partyAct(t, q, rng, { type: 'use', itemId: draught.id, target: 0 });
  // On the walk the sheet uses it by the same rule (`useItem`), from a bag of its own.
  const out = structuredClone(glassed), walk = { bag: [draught.id], food: 0 };
  out.hp = 0; out.conditions = ['stoned'];
  ok(draught.slot === 'none' && draught.use?.cure?.join() === 'stoned' && !hasCondition(glassed, 'stoned') && t.log.includes(`${glassed.name} is flesh again.`) && !q.bag.includes(draught.id)
    && useItem(ITEMS, walk, null, draught.id, out)?.join() === `${out.name} is flesh again.` && !walk.bag.length && hasCondition(out, 'unconscious') && !hasCondition(out, 'stoned'), `a Quickening Draught lifts it, in a fight and on the walk, one at no hit points coming back out cold (${t.log.at(-1)})`);
  // Absolve lifts it at tier 7, and any temple for a company with neither: 80 gold a level, a member
  // of 27 dearer there than the draught, which is the temple's price for one of 25.
  addCondition(TABLES.items, glassed, 'stoned');
  const absolved = castOnAlly(TABLES.items, q.members[4], SPELLS.absolve, glassed), at = (level: number): number => templePrice({ ...glassed, level, conditions: ['stoned'] });
  ok(!hasCondition(glassed, 'stoned') && absolved === `Maren casts Absolve: ${glassed.name} is flesh again.` && SPELLS.absolve.level === 7, `Absolve lifts it (${absolved})`);
  ok(at(27) === 2160 && at(25) === draught.price && templePrice({ ...glassed, conditions: [] }) === 0, `and a temple, for ${at(27)} gold at 27, where the draught is ${draught.price} anywhere it is sold`);
}

/** Calls (MONSTERS §3.3, #537): a caller's turn brings its group in whole, as a group of its own, inside the cap of 12 in three groups, those down counted. */
function calls(): void {
  ok(Object.values(MONSTERS).every((d) => !d.calls || (d.calls.monsters.length > 0 && d.calls.monsters.length < MAX_MONSTERS && d.calls.monsters.every((q) => typeof q === 'string' && q in MONSTERS))), 'every monster that calls names a group of monsters that exist, by id, smaller than a fight');
  const knocker: MonsterDef = { ...MONSTERS.rat, id: 'test_knocker', name: 'Knocker', plural: 'Knockers', kind: 'machine', hp: 50, xp: 40 };
  const tallyman: MonsterDef = { ...MONSTERS.bandit, id: 'test_tallyman', name: 'Tallyman', plural: 'Tallymen', kind: 'machine', hp: 80, xp: 100, calls: { monsters: [knocker, knocker, knocker], chance: 1 } };
  const six = [knocker, knocker, knocker, knocker, knocker, knocker];
  {
    const p = defaultParty(TABLES, makeRng(100)), s = startCombat(TABLES, p, [{ id: 'hole', monsters: [tallyman, ...six] }], makeRng(100));
    ok(canCall(s, s.monsters[0]) && markOf(s, aliveMonsters(s)) === 0, 'a tallyman beside six knockers may call, and the bots aim at it first');
    untilActs(s, p, 100, 0);
    const come = s.monsters.filter((m) => m.band === 1);
    ok(s.groupIds.length === 2 && s.leaders.length === 2 && come.length === 3 && come.every((m) => m.def === knocker && !m.back && m.group === 1 && m.hp === knocker.hp) && s.log.includes(CALL_LINE('Tallyman', '3 Knockers', false)),
      `its turn brings three knockers in, a group of their own (${s.log.find((l) => l.startsWith('Tallyman calls'))})`);
    ok(s.order.every((t) => t.side === 'party' || t.i < 7), 'and they wait for the next round to act');
    throughRound(s, p, 101);
    ok(s.order.some((t) => t.side === 'monster' && t.i >= 7), 'and act in it');
    ok(!canCall(s, s.monsters[0]) && markOf(s, aliveMonsters(s)) === undefined, 'with ten in the fight it may not call three more: a group comes whole or not at all, and the bots aim at it no longer');
    untilActs(s, p, 102, 0);
    ok(s.monsters.length === 10 && s.log.filter((l) => l.startsWith('Tallyman calls')).length === 1, 'so it strikes instead, and the fight stays at ten');
  }
  {
    // Those down count: nine with three of them fallen leave room for a call of three, not four.
    const four: MonsterDef = { ...tallyman, calls: { monsters: [knocker, knocker, knocker, knocker], chance: 1 } };
    const p = defaultParty(TABLES, makeRng(103)), s = startCombat(TABLES, p, [{ id: 'hole', monsters: [tallyman, ...six, knocker, knocker] }], makeRng(103)), t = startCombat(TABLES, p, [{ id: 'hole', monsters: [four, ...six, knocker, knocker] }], makeRng(103));
    for (const f of [s, t]) f.monsters.slice(1, 4).forEach((m) => { m.hp = 0; });
    ok(canCall(s, s.monsters[0]) && !canCall(t, t.monsters[0]), `a fight of nine with three fallen has room for a call of three and none for four (${MAX_MONSTERS} at most, the fallen counted)`);
    // Three groups are the most: a fight that starts with three never grows.
    const three = startCombat(TABLES, p, [{ id: 'a', monsters: [tallyman] }, { id: 'b', monsters: [knocker] }, { id: 'c', monsters: [knocker] }], makeRng(104));
    ok(MAX_GROUPS === 3 && !canCall(three, three.monsters[0]), 'and a fight of three groups has room for none');
  }
  {
    // Called in by one called in: a tally clerk the Tallymaster calls may call its loaders, until the fight holds three groups.
    const loader: MonsterDef = { ...knocker, id: 'test_loader', name: 'Loader', plural: 'Loaders' };
    const clerk: MonsterDef = { ...knocker, id: 'test_clerk', name: 'Tally Clerk', plural: 'Tally Clerks', calls: { monsters: [loader, loader], chance: 1 } };
    const master: MonsterDef = { ...tallyman, id: 'test_master', name: 'The Tallymaster', plural: 'Tallymasters', calls: { monsters: [clerk, clerk], chance: 1 } };
    const p = defaultParty(TABLES, makeRng(105)), s = startCombat(TABLES, p, [{ id: 'desk', monsters: [master] }], makeRng(105));
    for (let k = 0; k < 4 && s.outcome === 'ongoing'; k++) throughRound(s, p, 105 + k);
    ok(s.groupIds.length === MAX_GROUPS && s.log.includes(CALL_LINE('The Tallymaster', '2 Tally Clerks', false)) && s.log.includes(CALL_LINE('Tally Clerk', '2 Loaders', false)) && s.log.filter((l) => / calls, /.test(l)).length === 2,
      `the Tallymaster calls its clerks, a clerk its loaders, and then the fight is full (${s.monsters.length} monsters in ${s.groupIds.length} groups)`);
  }
  {
    // A caller in the back rank calls while the front stands, rather than wait.
    const p = defaultParty(TABLES, makeRng(106)), s = startCombat(TABLES, p, [{ id: 'hole', monsters: [knocker, knocker, tallyman], back: 1 }], makeRng(106));
    ok(untilActs(s, p, 106, 2) && frontStands(s) && s.groupIds.length === 2, 'a tallyman in the back rank calls while its knockers stand before it');
  }
  {
    // The called are fought as the rest are: slain, they pay.
    const p = defaultParty(TABLES, makeRng(107)), s = startCombat(TABLES, p, [{ id: 'hole', monsters: [tallyman] }], makeRng(107));
    untilActs(s, p, 107, 0);
    for (const m of s.monsters) m.hp = 0;
    partyAct(s, p, makeRng(108), { type: 'defend' });
    const paid = Math.round(tallyman.xp * killPay(tallyman.level, 1) + 3 * knocker.xp * killPay(knocker.level, 1));
    ok(s.outcome === 'victory' && s.loot?.xp === paid, `the knockers it called pay when they fall, as the rest do (${s.loot?.xp} xp, ${paid} asked)`);
  }
}

/**
 * The Core's clock (MONSTERS §9.3, #748): its leader calls on the beat while its panel stands and not
 * after, never on its own chance, into one group past the cap of three and up to twelve; the light
 * dims a step a round to a thread and ends nothing; and those that obey stand down at the lord's fall.
 */
function clock(): void {
  const meek = { attack: -40, dice: 1, sides: 1, bonus: 0, gold: [0, 0] as [number, number] };
  const sentry: MonsterDef = { ...MONSTERS.bandit, ...meek, id: 'test_sentry', name: 'Sentry', plural: 'Sentries', kind: 'machine', hp: 500, xp: 40, obeys: true };
  const hand: MonsterDef = { ...MONSTERS.bandit, ...meek, id: 'test_hand', name: 'Hand', plural: 'Hands', hp: 500, steady: true };
  const lord: MonsterDef = { ...MONSTERS.bandit, ...meek, id: 'test_lord', name: 'Lord', plural: 'Lords', hp: 500, steady: true, calls: { monsters: [sentry], chance: 0 } };
  const heart = (more: Partial<CombatGroup> = {}): CombatGroup => ({ id: 'heart', monsters: [lord, hand, hand], leader: lord.id, clock: { calls: sentry, every: 2, dims: 8, panel: [hand.id] }, ...more });
  /** Rounds played, the company bracing: the rounds that ended in a call. */
  const rounds = (s: CombatState, p: Party, n: number, seed: number): number[] => {
    const at: number[] = [];
    for (let k = 0; k < n && s.outcome === 'ongoing'; k++) { const was = s.monsters.length; throughRound(s, p, seed + k); if (s.monsters.length > was) at.push(s.round - 1); }
    return at;
  };
  {
    const p = defaultParty(TABLES, makeRng(120)), s = startCombat(TABLES, p, [heart()], makeRng(120));
    ok(markOf(s, aliveMonsters(s)) === 1, 'the bots aim at the panel first');
    const at = rounds(s, p, 6, 120), come = s.monsters.slice(3);
    ok(at.join() === '2,4,6' && come.every((m) => m.def === sentry && m.band === 1 && m.group === come[0].group && !m.back) && s.groupIds.length === 2 && s.log.filter((l) => l === CALL_LINE('Lord', 'Sentry', true)).length === 3,
      `a lord whose own call has no chance calls a sentry every second round while his Hands stand, into one group (rounds ${at.join(', ')})`);
    const called = markOf(s, aliveMonsters(s), asWritten, { ...ANSWER, clock: 'called' });
    const led = markOf(s, aliveMonsters(s), asWritten, { ...ANSWER, clock: 'leader' });
    ok(called === 3 && led === 0, 'a tool may turn the bots to the sentries as they come, or to the lord');
    for (const m of s.monsters) if (m.def === hand) m.hp = 0;
    const dim = s.clock!.dim, after = rounds(s, p, 4, 126);
    ok(dim === 6 && !after.length && s.clock!.dim === dim && !panelStands(s), `with the Hands down the calling stops and the light holds at ${dim} steps`);
  }
  {
    const eager: MonsterDef = { ...lord, calls: { monsters: [sentry, sentry], chance: 1 } };
    const p = defaultParty(TABLES, makeRng(130)), s = startCombat(TABLES, p, [heart({ monsters: [eager, hand, hand] })], makeRng(130));
    ok(!rounds(s, p, 1, 130).length && s.monsters.length === 3, 'one whose own call is sure never calls on its own chance under the clock');
  }
  {
    const p = defaultParty(TABLES, makeRng(131)), s = startCombat(TABLES, p, [heart(), { id: 'b', monsters: [hand] }, { id: 'c', monsters: [hand] }], makeRng(131));
    rounds(s, p, 4, 131);
    ok(s.groupIds.length === MAX_GROUPS + 1 && s.monsters.slice(5).length === 2 && s.monsters.slice(5).every((m) => m.band === MAX_GROUPS), `a fight of three groups still grows by the clock, its calls in one fourth group (${s.groupIds.length} groups)`);
  }
  {
    const p = defaultParty(TABLES, makeRng(132)), s = startCombat(TABLES, p, [heart({ clock: { calls: sentry, every: 1, dims: 8, panel: [hand.id] } })], makeRng(132));
    const at = rounds(s, p, 11, 132);
    ok(s.monsters.length === MAX_MONSTERS && at.length === MAX_MONSTERS - 3, `a call every round stops at ${MAX_MONSTERS} monsters (${at.length} calls)`);
    s.monsters[5].hp = 0;
    ok(!rounds(s, p, 2, 143).length && s.monsters.length === MAX_MONSTERS, 'and a sentry down makes no room: the fallen count');
  }
  {
    const p = defaultParty(TABLES, makeRng(134)), s = startCombat(TABLES, p, [heart()], makeRng(134)), steps: number[] = [];
    for (let k = 0; k < 14 && s.outcome === 'ongoing'; k++) { throughRound(s, p, 134 + k); steps.push(s.clock!.dim); }
    ok(steps.join() === '1,2,3,4,5,6,7,8,8,8,8,8,8,8' && s.outcome === 'ongoing', `the light dims a step a round to eight and holds there, and ends nothing (${steps.join(', ')}; ${s.outcome})`);
    ok(s.log.filter((l) => l === DIM_LINE).length === 2 && s.log.filter((l) => l === THREAD_LINE).length === 1 && s.log.indexOf(THREAD_LINE) > s.log.lastIndexOf(DIM_LINE), 'and the log says it at the third step and the sixth, and holds at a thread at the last');
  }
  {
    const engine: MonsterDef = { ...sentry, id: 'test_engine', name: 'Engine', plural: 'Engines', obeys: undefined };
    const p = defaultParty(TABLES, makeRng(136)), s = startCombat(TABLES, p, [heart({ monsters: [lord, hand, sentry, sentry, engine], clock: undefined })], makeRng(136));
    s.monsters[0].hp = 0;
    throughRound(s, p, 136);
    const fled = s.monsters.filter((m) => m.fled);
    ok(fled.length === 2 && fled.every((m) => m.def === sentry) && s.log.includes(STAND_LINE('2 Sentries', false)), `at the lord's fall the sentries that obey stand down (${s.log.find((l) => l.endsWith('down.'))})`);
    ok(KINDS.machine.breaks === 'never' && !s.monsters[4].fled && !s.monsters[1].fled && s.outcome === 'ongoing', 'and a machine that does not obey stands, as do his steady Hands');
  }
}

/** The glove (MONSTERS §2): the first time the Hearth's light passes through a machine the log says so, once a game, and a save keeps it said. */
function glove(): void {
  // Maren casts the spell at the first monster standing, in the round's first turn she has.
  const cast = (p: Party, monsters: readonly string[], spellId: string, seed: number): CombatState => {
    const maren = p.members[4];
    if (!maren.spells.includes(spellId)) maren.spells.push(spellId);
    maren.sp = maren.maxSp = 99;
    for (const c of p.members) c.hp = c.maxHp = 999;
    const s = startCombat(TABLES, p, [{ id: 'g', monsters }], makeRng(seed));
    throughRound(s, p, seed, (i) => (i === 4 ? { type: 'cast', spellId, target: aliveMonsters(s)[0] } : undefined));
    return s;
  };
  const said = (s: CombatState): string[] => s.log.filter((l) => l.startsWith('The light goes into'));
  const p = defaultParty(TABLES, makeRng(110));
  const first = cast(p, ['knocker', 'knocker'], 'smite', 110), at = first.log.findIndex((l) => l.startsWith('Maren casts Smite'));
  ok(MONSTERS.knocker.kind === 'machine' && first.log[at] === 'Maren casts Smite: Knocker takes 0.' && first.log[at + 1] === GLOVE_LINE(true) && p.flags[GLOVE_FLAG] === 1,
    `the first Smite to pass through a machine says so after its line, and the flag keeps it said (${first.log.slice(at, at + 2).join(' / ')})`);
  const again = cast(p, ['knocker'], 'smite', 111), wrath = cast(p, ['knocker', 'mender'], 'wrath', 112);
  ok(said(again).length === 0 && said(wrath).length === 0 && again.log.includes('Maren casts Smite: Knocker takes 0.') && wrath.log.includes('Maren casts Wrath of the Hearth: 0 damage to every foe.'), 'the second does not, Smite or Wrath of the Hearth');
  // Through several at once it says them; nothing says it but the Hearth's light through a machine.
  const q = defaultParty(TABLES, makeRng(113)), several = cast(q, ['knocker', 'knocker', 'mender'], 'wrath', 113);
  ok(said(several).join() === GLOVE_LINE(false) && GLOVE_LINE(false) === 'The light goes into them like a hand into a glove.', `Wrath of the Hearth through three machines says them (${said(several).join()})`);
  const r = defaultParty(TABLES, makeRng(114)), bandit = cast(r, ['bandit'], 'smite', 114), skeleton = cast(r, ['skeleton'], 'wrath', 115), spark = cast(r, ['knocker'], 'spark', 116);
  const struck = [bandit.log.some((l) => /^Maren casts Smite: Bandit takes [1-9]/.test(l)), skeleton.log.some((l) => /^Maren casts Wrath of the Hearth: [1-9]/.test(l)), spark.log.some((l) => /^Maren casts Spark: Knocker takes [1-9]/.test(l))];
  ok([bandit, skeleton, spark].every((s) => said(s).length === 0) && !r.flags[GLOVE_FLAG] && struck.every(Boolean),
    'a bandit or a skeleton the light strikes never says it, nor Spark through a machine, which bites');
  // The flag goes into the save with the party, and the company that loads it is not told again.
  const loaded = deserialize(serialize(new World(TABLES, buildMaps(), p, makeRng(117)).state, p, 0)).party;
  ok(loaded.flags[GLOVE_FLAG] === 1 && said(cast(loaded, ['knocker'], 'smite', 118)).length === 0, 'the flag survives a save and a load, and the light goes through again unsaid');
}

/**
 * Sweep (MONSTERS §3.3, #545): an arm takes the front row, the back once the front is down, and holds
 * in the back rank; a breath takes the fuller row, from either rank, halved once by Lampglass or a
 * member's own resistance; the fallen are passed over; and the bots mend the row a sweep would take
 * before one sweep could fell anyone in it.
 */
function sweep(): void {
  const giant: MonsterDef = { ...MONSTERS.ogre, id: 'test_giant', name: 'Giant', plural: 'Giants', hp: 999, attack: 99, dice: 1, sides: 1, bonus: 39, speed: 99, sweep: { chance: 1 } };
  const drake: MonsterDef = { ...giant, id: 'test_drake', name: 'Drake', plural: 'Drakes', sweep: { chance: 1, element: 'fire' } };
  const charm = { id: 'test_ember_charm', name: 'Ember Charm', slot: 'none' as const, price: 0, resist: ['fire' as const] };
  const down = (q: Party, ...at: number[]): void => { for (const i of at) { q.members[i].hp = 0; addCondition(TABLES.items, q.members[i], 'unconscious'); } };
  /** What each member took from the first turn of `m`, at the head of the round, on a company of 200 apiece dressed by `dress`. */
  const swept = (m: MonsterDef, dress: (q: Party, s: CombatState) => void = () => {}, seed = 120, t: Tables = TABLES): { took: number[]; s: CombatState } => {
    const q = defaultParty(t, makeRng(seed));
    for (const c of q.members) c.hp = c.maxHp = 200;
    const s = startCombat(t, q, [{ id: 'g', monsters: [m] }], makeRng(seed));
    dress(q, s);
    const before = q.members.map((c) => c.hp);
    untilActs(s, q, seed, 0);
    return { took: q.members.map((c, i) => before[i] - c.hp), s };
  };
  /** Each of the row at `from` took nothing or `each`, one of them at least, and nobody else anything; and the line says it. */
  const fell = ({ took, s }: { took: number[]; s: CombatState }, from: number, each: number, who: string, el?: 'fire', skip: number[] = []): boolean => {
    const row = [from, from + 1, from + 2].filter((i) => !skip.includes(i)), sum = took.reduce((a, b) => a + b, 0);
    return took.every((x, i) => (row.includes(i) ? x === 0 || x === each : x === 0)) && sum > 0 && s.log.includes(SWEEP_LINE(who, el, from ? 'the back row' : 'the front row', sum));
  };
  const arm = swept(giant);
  ok(fell(arm, 0, 40, 'Giant'), `a giant's arm takes the front row, a to-hit and its blow for each, and the back row nothing (${arm.took.join(', ')}; ${arm.s.log.at(-1)})`);
  ok(fell(swept(giant, (q) => down(q, 0)), 0, 40, 'Giant', undefined, [0]) && fell(swept(giant, (q) => down(q, 0, 1, 2)), 3, 40, 'Giant'), 'it passes over a member who is down, and once the front row is down it takes the back');
  ok(fell(swept(giant, (_q, s) => { s.glass = { element: 'fire', rounds: 5 }; }), 0, 40, 'Giant'), 'Lampglass on fire does nothing to a bare arm');
  const breath = swept(drake);
  ok(fell(breath, 0, 40, 'Drake', 'fire') && fell(swept(drake, (q) => down(q, 0)), 3, 40, 'Drake', 'fire'), `a drake's breath burns the fuller row, the front on a tie and the back once the front is thinner (${breath.s.log.at(-1)})`);
  const glass = swept(drake, (_q, s) => { s.glass = { element: 'fire', rounds: 5 }; });
  const lent = tablesWith([charm]), [worn, both] = [swept(drake, (q) => { q.members[0].pack.push(charm.id); }, 120, lent), swept(drake, (q, s) => { q.members[0].pack.push(charm.id); s.glass = { element: 'fire', rounds: 5 }; }, 120, lent)] as const;
  ok(fell(glass, 0, 20, 'Drake', 'fire') && [0, 20].includes(worn.took[0]) && [0, 40].includes(worn.took[1]) && fell(both, 0, 20, 'Drake', 'fire'),
    `Lampglass on fire halves the breath on the whole row, a charm against fire on its bearer alone, and the two together halve it once, never to a quarter (${glass.took.slice(0, 3).join(', ')}; ${worn.took.slice(0, 3).join(', ')}; ${both.took.slice(0, 3).join(', ')})`);
  ok(SWEEP_LINE('Giant', undefined, 'the front row') === 'Giant sweeps the front row and misses.' && logLines(`${SWEEP_LINE('Cinder Drake', 'fire', 'the back row', 999)} Ottilie wakes. Ottilie, Maren and Cassian fall!`).length <= 2,
    'a sweep that hits nobody misses, and the longest line a breath can say fits two lines of the log');
  // A giant in the back rank holds while the front stands, as a blow would; a drake there breathes, as a spell is cast.
  const rearguard = (m: MonsterDef, seed: number): { acted: boolean; s: CombatState } => {
    const q = defaultParty(TABLES, makeRng(seed));
    for (const c of q.members) c.hp = c.maxHp = 999;
    const s = startCombat(TABLES, q, [{ id: 'g', monsters: [{ ...MONSTERS.ogre, hp: 999, attack: -99 }, m], back: 1 }], makeRng(seed));
    return { acted: untilActs(s, q, seed, 1), s };
  };
  const held = rearguard(giant, 121), loosed = rearguard(drake, 122);
  ok(!held.acted && !held.s.log.some((l) => l.includes(' sweeps ')) && loosed.acted && loosed.s.log.some((l) => l.startsWith('Drake breathes fire on the front row')), 'a giant in the back rank waits for the front to fall; a drake there breathes over it');
  // The bots' answer: a member of the row a sweep would take is mended once one sweep could fell them.
  const heavy: MonsterDef = { ...giant, bonus: 99, speed: 0 }, lines = (m: MonsterDef, dress: (q: Party) => void = () => {}, answer = ANSWER): number[] => {
    const q = defaultParty(TABLES, makeRng(123));
    for (const c of q.members) c.hp = c.maxHp = 200;
    dress(q);
    return mendLines(startCombat(TABLES, q, [{ id: 'g', monsters: [m] }], makeRng(123)), q, asWritten, answer);
  };
  const unanswered = lines(heavy, undefined, { ...ANSWER, sweep: false });
  ok(lines(heavy).join() === '100,100,100,80,80,80' && lines({ ...heavy, sweep: undefined }).join() === '80,80,80,80,80,80' && unanswered.join() === '80,80,80,80,80,80' && lines({ ...heavy, sweep: { chance: 1, element: 'fire' } }, (q) => down(q, 0)).join() === '80,80,80,100,100,100',
    'the bots mend the row a sweeper would take under what one sweep could deal them, the rest at 40%, and the back row once a breath would turn on it');
  const mended = (sweep: boolean): number => {
    const q = defaultParty(TABLES, makeRng(124)), rng = makeRng(124);
    for (const c of q.members) c.hp = c.maxHp = 200;
    q.members[1].hp = 90;
    const s = startCombat(TABLES, q, [{ id: 'g', monsters: [heavy] }], rng);
    for (let n = 0; n < 20; n++) { const t = currentTurn(s, q, rng); if (!t || t.side === 'monster') break; if (t.i === 4) { gateTurn(s, q, rng, 4, { answer: { ...ANSWER, sweep } }); break; } partyAct(s, q, rng, { type: 'defend' }); }
    return q.members[1].hp;
  };
  ok(mended(true) > 90 && mended(false) === 90, `so the gate's cleric mends Idris at 90 of 200 before a giant's sweep of 100 (${mended(true)}), and with no answer leaves him (${mended(false)})`);
}

/**
 * The bot's turn as the game takes it (#714): `botTurn` gives the action the resolver took. And its
 * two readings: the gate's knows every monster as written; the game's auto-fight knows a sweep, a
 * breath, a call or a drain only once the fight's log has shown it, and a leader never before its fall.
 */
function bot(): void {
  const dummy: MonsterDef = { ...MONSTERS.rat, id: 'test_dummy', name: 'Dummy', plural: 'Dummies', hp: 999, attack: -99 };
  /** The party braces against a dummy until each member in `who` has had a turn from botTurn: what it gave each. */
  const turnOf = (q: Party, seed: number, who: number[]): Map<number, PartyAction> => {
    const rng = makeRng(seed), s = startCombat(TABLES, q, [{ id: 'g', monsters: [dummy] }], rng), took = new Map<number, PartyAction>();
    for (let n = 0; n < 40 && took.size < who.length; n++) {
      const t = currentTurn(s, q, rng);
      if (!t) break;
      if (t.side === 'monster') monsterAct(s, q, rng);
      else if (who.includes(t.i) && !took.has(t.i)) took.set(t.i, botTurn(s, q, rng, t.i));
      else partyAct(s, q, rng, { type: 'defend' });
    }
    return took;
  };
  {
    const q = defaultParty(TABLES, makeRng(130));
    for (const c of q.members) c.hp = c.maxHp = 200;
    q.members[1].hp = 70;
    const a = turnOf(q, 130, [4]).get(4);
    ok(a?.type === 'cast' && a.target === 1 && !!spell(a.spellId).heal && q.members[1].hp > 70, `botTurn gives the cleric's mend on Idris at 70 of 200, under 40%, and the resolver took it (${JSON.stringify(a)}; ${q.members[1].hp} hp)`);
  }
  {
    // Bram the knight to the back row, with his sword and no spell; Ottilie to the front.
    const q = defaultParty(TABLES, makeRng(131));
    [q.members[0], q.members[3]] = [q.members[3], q.members[0]];
    const bram = q.members[3], took = turnOf(q, 131, [0, 3]);
    ok(bram.name === 'Bram' && !bram.spells.length && !canAttackFromRow(TABLES.items, bram, 3) && JSON.stringify(took.get(3)) === '{"type":"defend"}' && took.get(0)?.type === 'attack',
      `botTurn gives a back-row fighter with no spell and no bow a brace (${JSON.stringify(took.get(3))}), and the front row a blow (${JSON.stringify(took.get(0))})`);
  }
  // A sweep and a breath: the mend lines and the breath's guard.
  const giant: MonsterDef = { ...MONSTERS.ogre, id: 'test_giant', name: 'Giant', plural: 'Giants', hp: 999, attack: 99, dice: 1, sides: 1, bonus: 99, speed: 99, sweep: { chance: 1 } };
  const drake: MonsterDef = { ...giant, id: 'test_drake', name: 'Drake', plural: 'Drakes', sweep: { chance: 1, element: 'fire' } };
  const facing = (m: MonsterDef, seed: number, dress: (q: Party) => void = () => {}): { q: Party; s: CombatState } => {
    const q = defaultParty(TABLES, makeRng(seed));
    for (const c of q.members) { c.hp = c.maxHp = 200; c.sp = c.maxSp = 50; }
    dress(q);
    return { q, s: startCombat(TABLES, q, [{ id: 'g', monsters: [m] }], makeRng(seed)) };
  };
  {
    const { q, s } = facing(giant, 132), written = mendLines(s, q).join(), unseen = mendLines(s, q, asSeen).join();
    untilActs(s, q, 132, 0);
    const seen = mendLines(s, q, asSeen).join();
    ok(written === '100,100,100,80,80,80' && unseen === '80,80,80,80,80,80' && s.log.some((l) => l.startsWith('Giant sweeps the front row')) && seen === written,
      `the gate's bot mends against a giant's sweep before it sweeps; the game's at 40% until the log shows the sweep, then as the gate's (${unseen} to ${seen})`);
  }
  {
    const { q, s } = facing(drake, 133, (r) => { r.members[0].hp = 0; addCondition(TABLES.items, r.members[0], 'unconscious'); });
    const written = breathGuard(s, q), unseen = breathGuard(s, q, asSeen);
    untilActs(s, q, 133, 0);
    ok(written === 0 && unseen === undefined && s.log.some((l) => l.startsWith('Drake breathes fire on the back row')) && breathGuard(s, q, asSeen) === 0,
      `the gate's bot raises Bram first while a drake could breathe on the back; the game's once it has breathed (${unseen} to ${breathGuard(s, q, asSeen)})`);
  }
  // A caller, a light that takes spell points, a leech that drinks and a leader: what the bots aim at.
  {
    const knocker: MonsterDef = { ...MONSTERS.rat, id: 'test_knocker', name: 'Knocker', plural: 'Knockers', kind: 'machine', hp: 50 };
    const tallyman: MonsterDef = { ...MONSTERS.bandit, id: 'test_tallyman', name: 'Tallyman', plural: 'Tallymen', kind: 'machine', hp: 80, speed: 99, calls: { monsters: [knocker, knocker, knocker], chance: 1 } };
    const { q, s } = facing(tallyman, 134);
    const unseen = markOf(s, aliveMonsters(s), asSeen);
    untilActs(s, q, 134, 0);
    ok(markOf(s, aliveMonsters(s)) === 0 && unseen === undefined && s.log.some((l) => l.startsWith('Tallyman calls, and')) && canCall(s, s.monsters[0]) && markOf(s, aliveMonsters(s), asSeen) === 0,
      `the gate's bot aims at a caller first; the game's once it has called (${unseen} to ${markOf(s, aliveMonsters(s), asSeen)})`);
  }
  {
    const light: MonsterDef = { ...MONSTERS.rat, id: 'test_light', name: 'Pale Light', plural: 'Pale Lights', hp: 999, attack: 99, speed: 99, drain: 'sp' };
    const { q, s } = facing(light, 135), written = markOf(s, aliveMonsters(s)), unseen = markOf(s, aliveMonsters(s), asSeen);
    untilActs(s, q, 135, 0);
    ok(written === 0 && unseen === undefined && s.log.some((l) => /^Pale Light hits \w+ for \d+ spell points/.test(l)) && markOf(s, aliveMonsters(s), asSeen) === 0,
      `the gate's bot aims at a light whose touch takes spell points; the game's once a touch has taken some (${s.log.find((l) => l.startsWith('Pale Light hits'))})`);
    const leech: MonsterDef = { ...light, id: 'test_leech', name: 'Leech', plural: 'Leeches', drain: 'hp' }, l = facing(leech, 136);
    l.s.monsters[0].hp = 40;
    const before = asSeen(l.s, l.s.monsters[0], 'drain');
    untilActs(l.s, l.q, 136, 0);
    ok(!before && l.s.log.some((x) => x.startsWith('Leech hits') && x.includes('and drinks')) && asSeen(l.s, l.s.monsters[0], 'drain'), "and the game's knows a leech drains once one has drunk");
  }
  {
    const master: MonsterDef = { ...MONSTERS.bandit, id: 'test_master', name: 'Barge Master', plural: 'Barge Masters' };
    const q = defaultParty(TABLES, makeRng(137)), s = startCombat(TABLES, q, [{ id: 'barge', monsters: [MONSTERS.bandit, master, MONSTERS.bandit], leader: master.id }], makeRng(137));
    ok(markOf(s, aliveMonsters(s)) === 1 && markOf(s, aliveMonsters(s), asSeen) === undefined, "the gate's bot aims at a leader first; the game's never, since a leader shows only in its fall");
  }
}

/**
 * The bots' bless, sleep and drink (#853), each behind `BotOpts` and off unless set, and from level 11
 * (#865). On: a cleric
 * blesses in the first round against three foes and not two, one Bless at a time; a sorcerer sleeps
 * the larger group, the gate's knowing what Slumber cannot take as written and the game's once seen,
 * and no group that holds a foe it cannot take; a member drinks for the lowest when no mender can and
 * not otherwise, and frees one held by a draught when no one can by a spell; the thrifty bot weighs
 * them. Off: a seeded fight is the same turn for turn with the options absent and present but false,
 * and under level 11 on as well. And a caster alone does not stall behind its own Slumber.
 */
function botOpts(): void {
  const ON: BotOpts = { bless: true, sleep: true, drink: true }, OFF: BotOpts = { bless: false, sleep: false, drink: false };
  const dummy: MonsterDef = { ...MONSTERS.rat, id: 'test_dummy', name: 'Dummy', plural: 'Dummies', hp: 999, attack: -99 };
  const bones: MonsterDef = { ...dummy, id: 'test_bones', name: 'Bone', plural: 'Bones', kind: 'dead' };
  const brute: MonsterDef = { ...dummy, id: 'test_brute', name: 'Brute', plural: 'Brutes', ac: 24, attack: 16, dice: 6, sides: 10, bonus: 40 };
  /** Ogres a company of 12 meets as its match, so three rounds pass with them standing and their blows make a sleep pay. */
  const great: MonsterDef = { ...MONSTERS.ogre, id: 'test_great_ogre', level: 12, hp: 600, attack: 14, dice: 3, sides: 8, bonus: 10 };
  const one = (...monsters: MonsterDef[]): CombatGroup[] => [{ id: 'g', monsters }];
  /** The level-12 company, past Act I where the options play (#865), dressed, against `groups`: each of `who` plays `turns` turns by the bot, the rest brace. */
  const botFight = (groups: CombatGroup[], who: readonly number[], opts?: BotOpts, dress: (q: Party) => void = () => {}, sees: Sees = asWritten, turns = 1, bot = 'gate'): { q: Party; s: CombatState; took: PartyAction[] } => {
    const q = companyAt(12, 853), rng = makeRng(853);
    dress(q);
    const s = startCombat(TABLES, q, groups, rng), took: PartyAction[] = [];
    for (let n = 0; n < 400 && s.outcome === 'ongoing' && took.length < who.length * turns; n++) {
      const t = currentTurn(s, q, rng);
      if (!t) break;
      if (t.side === 'monster') monsterAct(s, q, rng);
      else if (!who.includes(t.i)) partyAct(s, q, rng, { type: 'defend' });
      else if (bot === 'thrifty') { thrifty(s, q, rng, t.i, opts); took.push({ type: 'defend' }); }
      else took.push(botTurn(s, q, rng, t.i, sees, opts));
    }
    return { q, s, took };
  };
  const cast = (a: PartyAction | undefined, id: string): boolean => a?.type === 'cast' && a.spellId === id;
  {
    const three = botFight(one(dummy, dummy, dummy), [4], ON).took[0], two = botFight(one(dummy, dummy), [4], ON).took[0], off = botFight(one(dummy, dummy, dummy), [4]).took[0];
    ok(cast(three, 'bless') && !cast(two, 'bless') && !cast(off, 'bless'),
      `with the option on, Maren blesses in the first round against three foes (${JSON.stringify(three)}) and not against two (${JSON.stringify(two)}); off, not at all (${JSON.stringify(off)})`);
    const both = botFight(one(dummy, dummy, dummy), [1, 4], ON), poor = botFight(one(dummy, dummy, dummy), [4], ON, (q) => { q.members[4].sp = Math.floor(q.members[4].maxSp * REST_AT) + 2; }).took[0];
    ok(both.took.filter((a) => cast(a, 'bless')).length === 1 && both.s.round === 1 && both.s.log.some((l) => l.startsWith('Maren casts Bless')) && !cast(poor, 'bless'),
      `and one Bless at a time: of Idris and Maren in the first round, Maren blesses, whose turn is no blow, though Idris acts first (${both.took.map((a) => JSON.stringify(a)).join(', ')}); and none that would fall under its share of the rest line (${JSON.stringify(poor)})`);
  }
  {
    const r = botFight([{ id: 'a', monsters: [dummy, dummy] }, { id: 'b', monsters: [dummy, dummy, dummy] }], [5], ON), a = r.took[0];
    const lone = botFight([{ id: 'a', monsters: [dummy] }, { id: 'b', monsters: [dummy] }], [5], ON).took[0];
    const group = a?.type === 'cast' ? r.s.monsters[a.target].group : -1;
    ok(cast(a, 'sleep') && r.s.monsters.filter((m) => m.group === group).length === 3 && r.s.monsters.some((m) => m.conditions.includes('asleep')) && !cast(lone, 'sleep'),
      `with the option on, Cassian sleeps the larger group, the three and not the two (${r.s.log.find((l) => l.startsWith('Cassian casts'))}), and no lone foe (${JSON.stringify(lone)})`);
    // Slumber cannot take the dead: the gate's knows it as written, the game's once a Slumber has taken none of them.
    const groups = [{ id: 'a', monsters: [dummy, dummy] }, { id: 'b', monsters: [bones, bones, bones] }];
    const written = botFight(groups, [5], ON), seen = botFight(groups, [5], ON, () => {}, asSeen, 2);
    const at = (x: { s: CombatState; took: PartyAction[] }, n: number): string => { const t = x.took[n]; return t?.type === 'cast' ? `${t.spellId} at ${x.s.monsters[t.target].def.plural}` : JSON.stringify(t); };
    ok(at(written, 0) === 'sleep at Dummies' && at(seen, 0) === 'sleep at Bones' && seen.s.log.includes('Cassian casts Slumber: 0 of the Bones fall asleep.') && at(seen, 1) === 'sleep at Dummies',
      `the gate's sorcerer sleeps two dummies past three bones it knows the dead do not sleep (${at(written, 0)}); the game's tries the bones first and the dummies once it has seen (${at(seen, 0)}, then ${at(seen, 1)})`);
    // Awake is held by nothing: the group Slumber has taken is not slept again; his next turn sleeps the other.
    const twice = botFight([{ id: 'a', monsters: [dummy, dummy] }, { id: 'b', monsters: [dummy, dummy, dummy] }], [5], ON, () => {}, asWritten, 2);
    const groupOf = (t: PartyAction | undefined): number => (t?.type === 'cast' ? twice.s.monsters[t.target].group : -1);
    ok(cast(twice.took[0], 'sleep') && cast(twice.took[1], 'sleep') && groupOf(twice.took[0]) !== groupOf(twice.took[1]),
      `and his next turn sleeps the other group, not the one Slumber has taken (${twice.s.log.filter((l) => l.startsWith('Cassian casts')).join(' ')})`);
    // Slumber's line counts the kind it names: in a mixed group the bones it cannot take show, and the game's reading learns them.
    const mixed = botFight([{ id: 'g', monsters: [bones, dummy, dummy, dummy] }], [], undefined), q = mixed.q, s = mixed.s, rng = makeRng(85);
    for (let n = 0; n < 40; n++) { const t = currentTurn(s, q, rng); if (!t) break; if (t.side === 'monster') monsterAct(s, q, rng); else if (t.i !== 5) partyAct(s, q, rng, { type: 'defend' }); else { partyAct(s, q, rng, { type: 'cast', spellId: 'sleep', target: 0 }); break; } }
    ok(s.log.includes('Cassian casts Slumber: 0 of the Bones fall asleep.') && s.monsters.some((m) => m.conditions.includes('asleep')) && asSeen(s, s.monsters[0], 'sleepless'),
      `Slumber's line counts the kind it names: at a bone among dummies, "0 of the Bones" while ${s.monsters.filter((m) => m.conditions.includes('asleep')).length} dummies sleep, and the game's reading learns the bones (${s.log.find((l) => l.startsWith('Cassian casts'))})`);
    // Never a group that holds a foe Slumber cannot take (#865): the Eldest, proof against sleep, among
    // two heartwoods, and two heartwoods beside them. Cassian sleeps the two alone and not the Eldest's,
    // whose sleepers would bar every spell at its group while it was struck alone.
    const wood = botFight([{ id: 'a', monsters: [MONSTERS.eldest, MONSTERS.heartwood, MONSTERS.heartwood] }, { id: 'b', monsters: [MONSTERS.heartwood, MONSTERS.heartwood] }], [5], ON), w0 = wood.took[0];
    const slept = w0?.type === 'cast' ? wood.s.monsters.filter((m) => m.group === wood.s.monsters[w0.target].group) : [];
    ok(cast(w0, 'sleep') && slept.length === 2 && slept.every((m) => m.def.id === 'heartwood') && !wood.s.monsters.some((m) => m.group !== slept[0].group && m.conditions.includes('asleep')),
      `Cassian sleeps no group that holds a foe Slumber cannot take: beside the Eldest and its two heartwoods he sleeps the other two (${wood.s.log.find((l) => l.startsWith('Cassian casts'))})`);
  }
  {
    // Wren at a tenth of her hit points, a draught in the bag: Bram gives it her when no one standing can mend her, and strikes while Maren can.
    const hurt = (spent: boolean) => (q: Party): void => { q.members[2].hp = Math.floor(q.members[2].maxHp / 10); q.bag.push('potion_heal'); for (const m of q.members) if (spent || m.cls !== 'cleric') m.sp = 0; };
    const dry = botFight(one(dummy), [0], ON, hurt(true)), wet = botFight(one(dummy), [0], ON, hurt(false)), off = botFight(one(dummy), [0], undefined, hurt(true));
    const draughts = (q: Party): number => q.bag.filter((id) => id === 'potion_heal').length, whole = draughts(companyAt(12, 853)) + 1;
    ok(JSON.stringify(dry.took[0]) === '{"type":"use","itemId":"potion_heal","target":2}' && draughts(dry.q) === whole - 1 && dry.s.log.some((l) => l.startsWith('Wren recovers'))
      && wet.took[0]?.type === 'attack' && draughts(wet.q) === whole && off.took[0]?.type === 'attack',
      `with the option on, Bram gives Wren, under her mend line, the bag's draught when no one standing can mend her (${JSON.stringify(dry.took[0])}), not while Maren can (${JSON.stringify(wet.took[0])}); off, he strikes (${JSON.stringify(off.took[0])})`);
    // Bram held fast, smelling salts in Idris's pack: Idris frees him when no one can by a spell, and not while Maren can.
    const held = (spent: boolean) => (q: Party): void => { addCondition(TABLES.items, q.members[0], 'paralysed'); q.members[1].pack.push('smelling_salts'); for (const m of q.members) if (spent || m.cls !== 'cleric') m.sp = 0; };
    const salts = botFight(one(dummy), [1], ON, held(true)), cleric = botFight(one(dummy), [1], ON, held(false));
    ok(JSON.stringify(salts.took[0]) === '{"type":"use","itemId":"smelling_salts","target":0}' && canAct(salts.q.members[0]) && cleric.took[0]?.type !== 'use' && hasCondition(cleric.q.members[0], 'paralysed'),
      `and Idris frees Bram, held fast, with his salts when no one can by a spell (${JSON.stringify(salts.took[0])}), not while Maren can (${JSON.stringify(cleric.took[0])})`);
    // An Elixir beside the Healing Draughts: Ottilie gives the least that lifts the lowest to her line, a draught ten short, the Elixir twenty.
    const short = (j: number, by: number) => (q: Party): void => { q.members[j].hp = Math.floor(q.members[j].maxHp * 0.4) - by; q.bag.push('elixir'); for (const m of q.members) m.sp = 0; };
    const ten = botFight(one(dummy), [3], ON, short(2, 10)).took[0], twenty = botFight(one(dummy), [3], ON, short(0, 20)).took[0];
    ok(JSON.stringify(ten) === '{"type":"use","itemId":"potion_heal","target":2}' && JSON.stringify(twenty) === '{"type":"use","itemId":"elixir","target":0}',
      `and the least draught that lifts the lowest to her line: a Healing Draught for Wren ten short (${JSON.stringify(ten)}), the Elixir for Bram twenty short (${JSON.stringify(twenty)})`);
  }
  {
    // The thrifty bot weighs them: Bless and sleep where the brutes' blows make them pay, not against dummies that cannot hurt.
    const only = (j: number, id: string) => (q: Party): void => { q.members[j].spells = [id]; };
    const blessing = (m: MonsterDef): boolean => botFight(one(m, m, m), [4], ON, only(4, 'bless'), asWritten, 1, 'thrifty').s.bless > 0;
    const sleeping = (m: MonsterDef): number => botFight(one(m, m, m), [5], ON, only(5, 'sleep'), asWritten, 1, 'thrifty').s.monsters.filter((x) => x.conditions.includes('asleep')).length;
    const offBless = botFight(one(brute, brute, brute), [4], undefined, only(4, 'bless'), asWritten, 1, 'thrifty').s.bless;
    ok(blessing(brute) && !blessing(dummy) && offBless === 0 && sleeping(brute) > 0 && sleeping(dummy) === 0,
      `the thrifty bot blesses against three brutes and not three dummies, and sleeps the brutes (${sleeping(brute)} asleep) and not the dummies; off, it blesses nothing`);
    const gives = botFight(one(dummy), [0], ON, (q) => { q.members[2].hp = 5; q.bag.push('potion_heal'); for (const m of q.members) m.sp = 0; }, asWritten, 1, 'thrifty');
    ok(gives.s.log.some((l) => l.startsWith('Wren recovers')), `and gives a draught where no spell pays and no one can mend (${gives.s.log.at(-1)})`);
  }
  {
    // Off, nothing moves: a seeded fight is the same turn for turn, the gate's, the game's and the thrifty
    // bot's, with the options absent and present but false; and on under level 11 (#865), at 4 and at 10,
    // against great ogres there whose blows make the three pay. At 11, on, it is another.
    const turns = (bot: 'written' | 'seen' | 'thrifty', opts?: BotOpts, level = 4): string => {
      const q = companyAt(level, 853), rng = makeRng(853), out: string[] = [];
      q.members[0].pack.push('potion_heal');
      q.bag.push('smelling_salts');
      const s = startCombat(TABLES, q, [{ id: 'a', monsters: level < 10 ? ['ogre', 'ogre', 'ogre'] : [great, great, great] }, { id: 'b', monsters: ['skeleton', 'skeleton', 'wolf', 'wolf'] }], rng);
      for (let n = 0; n < 2000 && s.outcome === 'ongoing'; n++) {
        const t = currentTurn(s, q, rng);
        if (!t) break;
        if (t.side === 'monster') { monsterAct(s, q, rng); continue; }
        const at = s.log.length, sees = bot === 'seen' ? asSeen : asWritten;
        let a: PartyAction | null = null;
        if (bot !== 'thrifty') a = opts ? botTurn(s, q, rng, t.i, sees, opts) : botTurn(s, q, rng, t.i, sees);
        else if (opts) thrifty(s, q, rng, t.i, opts);
        else thrifty(s, q, rng, t.i);
        out.push(`${s.round}.${t.i} ${JSON.stringify(a)} ${s.log.slice(at).join(' ')}`);
      }
      return [...out, s.outcome].join('\n');
    };
    // Main's fight, pinned: each bot's turns, outcome and digest with the options absent, as main played
    // it at e74bffb0 before the options came.
    const MAIN = {
      written: [46, '3e52eed053fa132689b29bb5288762395a2a481ff145edfea3baf3f580c08120'],
      seen: [46, '3e52eed053fa132689b29bb5288762395a2a481ff145edfea3baf3f580c08120'],
      thrifty: [52, '06399b5beb1712ab1609de73231bb8172a74473ff4188343203af1de8a927709'],
    } as const;
    for (const bot of ['written', 'seen', 'thrifty'] as const) {
      const absent = turns(bot), off = turns(bot, OFF), on = turns(bot, ON), lines = absent.split('\n'), digest = createHash('sha256').update(absent).digest('hex');
      const ten = turns(bot, OFF, 10), eleven = turns(bot, OFF, 11);
      ok(absent === off && absent === on && lines.length - 1 === MAIN[bot][0] && lines.at(-1) === 'victory' && digest === MAIN[bot][1] && turns(bot, ON, 10) === ten && turns(bot, ON, 11) !== eleven,
        `off, the ${bot === 'thrifty' ? "thrifty bot's" : bot === 'seen' ? "game's bot's" : "gate's bot's"} seeded fight is main's turn for turn, absent and present but false (${lines.length - 1} turns, ${lines.at(-1)}, ${digest.slice(0, 12)}), and on too under level 11, at 4 and at 10; at 11, on, it is another`);
    }
  }
  {
    // On, past Act I, the sleepers are let lie: three great ogres slept are not woken by a spell over
    // many while one sleeps, by the gate's bot or the thrifty one, in three rounds; and Maren, whose
    // turn is no blow, blesses, not Idris.
    const many = Object.values(SPELLS).filter((x) => x.dice && (x.target === 'group' || x.target === 'all')).map((x) => ` casts ${x.name}`);
    const three = (bot: 'gate' | 'thrifty'): { s: CombatState; woke: string[] } => {
      const q = companyAt(12, 870), rng = makeRng(870), s = startCombat(TABLES, q, [{ id: 'g', monsters: [great, great, great] }], rng), woke: string[] = [];
      for (let n = 0; n < 400 && s.outcome === 'ongoing'; n++) {
        const t = currentTurn(s, q, rng);
        if (!t || s.round > 3) break;
        if (t.side === 'monster') { monsterAct(s, q, rng); continue; }
        const lying = s.monsters.some((m) => m.conditions.includes('asleep')), at = s.log.length;
        if (bot === 'thrifty') thrifty(s, q, rng, t.i, ON); else botTurn(s, q, rng, t.i, asWritten, ON);
        if (lying) woke.push(...s.log.slice(at).filter((l) => many.some((x) => l.includes(x))));
      }
      return { s, woke };
    };
    const gate = three('gate'), thrift = three('thrifty'), slumbers = (s: CombatState): number => s.log.filter((l) => l.startsWith('Cassian casts Slumber')).length;
    ok(slumbers(gate.s) >= 1 && slumbers(thrift.s) >= 1 && !gate.woke.length && !thrift.woke.length && gate.s.log.some((l) => l.startsWith('Maren casts Bless')) && !gate.s.log.some((l) => l.startsWith('Idris casts Bless')),
      `on, the sleepers are let lie: three great ogres slept (${slumbers(gate.s)} and ${slumbers(thrift.s)} Slumbers in three rounds) are woken by no spell over many while one sleeps, by the gate's bot or the thrifty one (${[...gate.woke, ...thrift.woke].join(' ') || 'none'}), and Maren blesses, not Idris`);
  }
  {
    // A caster alone does not stall behind its own Slumber (#865): Cassian, the rest fallen, knowing
    // Slumber and Fire Bolt alone, a dagger he cannot strike with from the back, against two groups of
    // ogres that barely hit, on half their hit points. The sleepers lie only while another can strike, so
    // he sleeps neither group and burns both down as he does with sleep off, turn for turn; with Bram
    // standing he sleeps. He stands what a natural 20 deals.
    const ogre: MonsterDef = { ...MONSTERS.ogre, id: 'test_ogre', hp: 30, attack: -99 };
    const alone = (opts: BotOpts, bram = false): { s: CombatState; turns: string } => {
      const q = companyAt(12, 865), rng = makeRng(865), turns: string[] = [];
      q.members.forEach((m, j) => { if (j < 5 && !(bram && j === 0)) { addCondition(TABLES.items, m, 'dead'); m.hp = 0; } });
      Object.assign(q.members[5], { spells: ['sleep', 'firebolt'], hp: 999, maxHp: 999 });
      q.members[5].equipment.weapon = 'dagger';
      const s = startCombat(TABLES, q, [{ id: 'a', monsters: [ogre, ogre] }, { id: 'b', monsters: [ogre, ogre, ogre] }], rng);
      playOut(s, q, rng, (s, q, rng, i) => { turns.push(JSON.stringify(botTurn(s, q, rng, i, asWritten, opts))); }, {}, ROUND_CAP);
      return { s, turns: turns.join(' ') };
    };
    const on = alone(ON), off = alone(OFF), beside = alone(ON, true), slept = (x: { s: CombatState }): number => x.s.log.filter((l) => l.startsWith('Cassian casts Slumber')).length;
    ok(on.s.outcome === 'victory' && on.turns === off.turns && !slept(on) && slept(beside) > 0,
      `a caster alone does not stall behind his Slumber: Cassian, the rest fallen, with Slumber and Fire Bolt against two groups, sleeps neither and wins in ${on.s.round} rounds turn for turn as with sleep off (${slept(on)} Slumbers, ${on.s.outcome}); with Bram standing he sleeps (${slept(beside)})`);
  }
  {
    // A company that straddles Act I lets the sleepers lie as one (#865, `letsLie`): the level-8 six with
    // Cassian at 12, the game's bot as play has it, against two groups of great ogres. He sleeps a group,
    // and no one, Idris at 8 among them, wakes a sleeper with a spell over many, in three rounds.
    const many = Object.values(SPELLS).filter((x) => x.dice && (x.target === 'group' || x.target === 'all')).map((x) => ` casts ${x.name}`);
    const q = companyAt(8, 865), rng = makeRng(865), woke: string[] = [];
    q.members[5] = companyAt(12, 865).members[5];
    const s = startCombat(TABLES, q, [{ id: 'a', monsters: [great, great] }, { id: 'b', monsters: [great, great] }], rng);
    const asleep = (): number[] => s.monsters.flatMap((m, k) => (m.conditions.includes('asleep') ? [k] : []));
    for (let n = 0; n < 400 && s.outcome === 'ongoing'; n++) {
      const t = currentTurn(s, q, rng);
      if (!t || s.round > 3) break;
      if (t.side === 'monster') { monsterAct(s, q, rng); continue; }
      const lying = asleep(), at = s.log.length;
      botTurn(s, q, rng, t.i, asSeen, PLAYED);
      const cast = s.log.slice(at).filter((l) => many.some((x) => l.includes(x)));
      if (cast.length && lying.some((k) => s.monsters[k].hp > 0 && !s.monsters[k].conditions.includes('asleep'))) woke.push(...cast);
    }
    const slept = s.log.filter((l) => l.startsWith('Cassian casts Slumber')).length;
    ok(slept >= 1 && !woke.length,
      `a company that straddles Act I lets the sleepers lie as one: the level-8 six with Cassian at 12 against two groups of great ogres, he sleeps (${slept} Slumbers) and no one wakes them with a spell over many in three rounds (${woke.join(' ') || 'none'})`);
  }
}

/**
 * Auto-fight (#714): with `auto` on, the combat screen's bot plays the company's turns and leaves the
 * fight by its own Space, so it never waits on the finished screen; any key takes the fight back.
 */
function autoFight(): void {
  /** A game at the road rats with the level-3 company, the combat screen on top. */
  const atRats = (seed: number, auto: boolean): { g: Game; screen: CombatScreen } => {
    const g = headlessGame(seed);
    Object.assign(g.party, companyAt(3, seed));
    g.world.travel('shelf', 16, 4);
    g.fight(['road_rats']);
    const screen = g.top as CombatScreen;
    screen.auto = auto;
    return { g, screen };
  };
  CombatScreen.instant = true;
  {
    const { g, screen } = atRats(4, true);
    let ticks = 0;
    for (; screen.state.outcome === 'ongoing' && ticks < 4000; ticks++) g.update(null);
    const finished = g.top === screen && screen.auto;
    g.update(null);
    ok(screen.state.outcome === 'victory' && g.party.members.every((c) => c.level === 3), `auto plays the level-3 company through the road rats with no key pressed, in ${ticks} ticks (${screen.state.outcome}, ${screen.state.round} rounds)`);
    ok(finished && g.top.constructor.name === 'ExploreScreen', `auto stays on to the end and leaves the finished fight by its own Space the next tick, the explore screen on top (${g.top.constructor.name})`);
    g.fight(['road_rats']);
    ok(g.top !== screen && !(g.top as CombatScreen).auto, 'a new fight starts with auto off');
  }
  {
    const { g, screen } = atRats(5, true), s = screen.state;
    g.update('forward');
    drive(g, [], 50);
    const stood = s.log.length, t = currentTurn(s, g.party, g.rng);
    drive(g, [], 200);
    ok(!screen.auto && t?.side === 'party' && s.log.length === stood && s.outcome === 'ongoing', `a press of forward takes the fight back: the company's turn then waits on a key, 200 ticks on (${s.log.length - stood} lines)`);
  }
  {
    // Auto off, the monsters act at once and the company's turn waits; then auto, at the game's pace.
    const { g, screen } = atRats(6, false), s = screen.state;
    drive(g, [], 50);
    const t = currentTurn(s, g.party, g.rng), start = s.log.length;
    CombatScreen.instant = false;
    screen.auto = true;
    drive(g, [], 21);
    const waited = s.log.length === start;
    drive(g, [null]);
    ok(t?.side === 'party' && waited && s.log.length > start, `without instant the bot waits 22 frames on the company's turn, as a monster does, and acts on the 22nd (${s.log.at(-1)})`);
  }
  {
    // A key mid-count takes the count back with the fight: turned on again, the bot waits the whole 22.
    CombatScreen.instant = true;
    const { g, screen } = atRats(7, false), s = screen.state;
    drive(g, [], 50);
    const t = currentTurn(s, g.party, g.rng), start = s.log.length;
    CombatScreen.instant = false;
    screen.auto = true;
    drive(g, [], 15);
    g.update('down');
    screen.auto = true;
    drive(g, [], 21);
    const waited = s.log.length === start;
    drive(g, [null]);
    ok(t?.side === 'party' && waited && s.log.length > start, `a key 15 frames into the bot's count takes the count back too: turned on again, it waits the whole 22 (${s.log.at(-1)})`);
  }
  {
    // The screen plays the game's reading: a leader second in its group, in reach, it cannot know leads.
    CombatScreen.instant = true;
    const g = headlessGame(8);
    Object.assign(g.party, companyAt(3, 8));
    const master: MonsterDef = { ...MONSTERS.bandit, id: 'test_master', name: 'Barge Master', plural: 'Barge Masters' };
    const s = startCombat(TABLES, g.party, [{ id: 'barge', monsters: [MONSTERS.bandit, master, MONSTERS.bandit], leader: master.id }], g.rng), screen = new CombatScreen(s, ['barge']);
    g.push(screen);
    screen.auto = true;
    const names = g.party.members.map((c) => c.name);
    const first = (): string | undefined => s.log.find((l) => names.some((n) => l.startsWith(`${n} `)) && / (hits|misses|casts) /.test(l));
    for (let n = 0; n < 200 && !first() && s.outcome === 'ongoing'; n++) g.update(null);
    ok(!!first() && first()!.includes('Bandit') && !first()!.includes('Barge Master'), `the screen's bot plays the game's reading: its first blow or spell is at a bandit, not at the Barge Master it cannot know leads (${first()})`);
  }
  CombatScreen.instant = false;
}

/**
 * A tick leaves its fight settled (#943): the combat screen walks the turn on in `update`, once the act is done, so
 * that drawing the fight reads the turn it kept and moves nothing of it; and the hit flash counts the screen's ticks,
 * not its frames. The smoke draws a fight ten times (the drawing part, tools/smoke/flows.ts); no suite has a canvas.
 */
function fightTicks(): void {
  CombatScreen.instant = true;
  /** The premade company at three rats, the combat screen on top. */
  const atRats = (seed: number): { g: Game; screen: CombatScreen } => {
    const g = headlessGame(seed), s = startCombat(TABLES, g.party, [{ id: 'rats', monsters: ['rat', 'rat', 'rat'] }], g.rng), screen = new CombatScreen(s, ['rats']);
    g.push(screen);
    return { g, screen };
  };
  /** The fight and the game's generator as they stand: a call that moves neither leaves this as it was. */
  const mark = (g: Game, s: CombatState): string => `${JSON.stringify(s)} ${g.rng.state}`;
  {
    // Everyone braces ('n4'), so the fight runs round on round. After each tick there is nothing left to walk, and the
    // tick of a round's last act has begun the next round, with the next order's speeds rolled.
    const { g, screen } = atRats(9), s = screen.state;
    let rounds = 0, late = 0, undone = 0, ticks = 0;
    for (; ticks < 200 && rounds < 3 && s.outcome === 'ongoing'; ticks++) {
      const last = s.turn === s.order.length - 1, round = s.round;
      g.update('n4');
      if (last && s.outcome === 'ongoing') { rounds++; if (s.round !== round + 1 || s.turn >= s.order.length) late++; }
      const was = mark(g, s);
      currentTurn(s, g.party, g.rng);
      if (mark(g, s) !== was) undone++;
    }
    ok(rounds === 3 && late === 0 && undone === 0,
      `one update after the last act of a round leaves the next round begun, and after every update the turn is found where it stands: ${rounds} rounds ended in ${ticks} ticks (${late} left unbegun, ${undone} ticks left a walk to make)`);
  }
  {
    // The next in the order sleeps: the tick that plays the one before it passes it and rolls its waking on the game's
    // generator then, a brace drawing nothing itself, and not in a frame drawn after.
    const { g, screen } = atRats(10), s = screen.state;
    for (let n = 0; n < 50 && !(s.order[s.turn]?.side === 'party' && s.order[s.turn + 1]?.side === 'monster'); n++) g.update('n4');
    const up = s.order[s.turn], sleeper = s.order[s.turn + 1];
    const found = up?.side === 'party' && sleeper?.side === 'monster';
    ok(found, `a company member is up with a rat after them in the order (turn ${s.turn} of ${s.order.length}, round ${s.round})`);
    if (found) {
      s.monsters[sleeper.i].conditions = ['asleep'];
      const at = s.turn, round = s.round, drawn = g.rng.state;
      g.update('n4');
      const rolled = g.rng.state !== drawn, passed = s.round > round || s.turn > at + 1, was = mark(g, s);
      currentTurn(s, g.party, g.rng);
      ok(rolled && passed && mark(g, s) === was,
        `the tick that plays the one before a sleeper rolls its waking and walks on past it, so that a frame drawn after has nothing to roll (turn ${at} to ${s.turn}, round ${round} to ${s.round}, the generator ${rolled ? 'drawn on' : 'not drawn on'})`);
    }
  }
  {
    // The bot plays: a blow leaves its monster's flash at 1 after its tick and at 0 after the next, one tick of white.
    const { g, screen } = atRats(11), s = screen.state;
    screen.auto = true;
    let blows = 0, ticks = 0;
    const wrong: string[] = [];
    for (; ticks < 300 && s.outcome === 'ongoing'; ticks++) {
      const hp = s.monsters.map((m) => m.hp);
      g.update(null);
      s.monsters.forEach((m, i) => {
        const hurt = m.hp < hp[i];
        if (hurt) blows++;
        if (m.flash !== (hurt ? 1 : 0)) wrong.push(`${m.def.name} ${i} at tick ${ticks}: flash ${m.flash}, ${hurt ? 'struck' : 'not struck'}`);
      });
    }
    ok(blows >= 3 && !wrong.length, `a blow leaves flash at 1 after its tick and at 0 after the next: ${blows} blows in ${ticks} ticks (${wrong.join('; ') || 'none wrong'})`);
  }
  CombatScreen.instant = false;
}
