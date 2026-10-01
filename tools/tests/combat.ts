// The combat resolver: a seeded fight replays byte for byte, the cap, the rows, fleeing, the spells
// that hit every foe, Ward and Revive; the ranks and morale (#160).
import { makeRng } from '../../src/lib/engine/rng.ts';
import { ITEMS, MONSTERS } from '../../src/content/index.ts';
import { defaultParty, equip, addCondition, hasCondition } from '../../src/game/party.ts';
import { startCombat, currentTurn, partyAct, monsterAct, aliveMonsters, canAttackFromRow, canReach, castOnAlly, frontStands, WARD_AC, BREAK_LINE, ROUT_LINE } from '../../src/game/combat.ts';
import type { CombatState, CombatGroup } from '../../src/game/combat.ts';
import type { MonsterDef } from '../../src/game/monsters.ts';
import type { Party } from '../../src/game/party.ts';
import { spell } from '../../src/game/spells.ts';
import { RANGED_PENALTY } from '../../src/game/weather.ts';
import { ok } from './lib.ts';

export function combat(): void {
  // A scripted policy: everyone attacks the first living monster, casters cast when they can.
  const run = (seed: number): { log: string[]; rounds: number; party: Party; state: CombatState } => {
    const rng = makeRng(seed);
    const party = defaultParty(rng);
    const state = startCombat(party, [{ id: 'g', monsters: ['rat', 'rat', 'rat', 'wolf'] }], rng);
    let guard = 0;
    while (state.outcome === 'ongoing' && guard++ < 500) {
      const t = currentTurn(state, party, rng);
      if (!t) break;
      if (t.side === 'monster') { monsterAct(state, party, rng); continue; }
      const c = party.members[t.i];
      const target = aliveMonsters(state)[0];
      if (c.cls === 'sorcerer' && c.sp >= 2) partyAct(state, party, rng, { type: 'cast', spellId: 'spark', target });
      else if (canAttackFromRow(c, t.i)) partyAct(state, party, rng, { type: 'attack', target });
      else partyAct(state, party, rng, { type: 'defend' });
    }
    return { log: state.log, rounds: state.round, party, state };
  };
  const a = run(11), b = run(11), c = run(12);
  ok(a.log.join('|') === b.log.join('|'), 'the same seed replays the same fight');
  ok(a.log.join('|') !== c.log.join('|'), 'a different seed is a different fight');
  ok(a.state.outcome === 'victory', `the default party beats three rats and a wolf (${a.rounds} rounds, ${a.state.outcome})`);
  // Three in four down, the last of the pack bolts and pays nothing.
  const xp = a.state.monsters.filter((m) => !m.fled).reduce((n, m) => n + m.def.xp, 0);
  ok(a.state.monsters.filter((m) => m.fled).length === 1, `the last of three rats and a wolf bolts (${a.state.monsters.filter((m) => m.fled).map((m) => m.def.name).join(', ')})`);
  ok(a.state.loot !== null && a.state.loot.xp === xp, `xp is the sum of the slain's (${a.state.loot?.xp})`);
  ok(a.party.members.every((m) => m.xp === Math.floor(xp / 6)), 'xp is split evenly among the living');
  ok(a.party.gold >= 200, 'gold is added to the party');
  // The cap.
  const rng = makeRng(1);
  const big = startCombat(defaultParty(rng), [{ id: 'a', monsters: new Array(8).fill('rat') }, { id: 'b', monsters: new Array(8).fill('rat') }], rng);
  ok(big.monsters.length === 12, `a fight never has more than 12 monsters (${big.monsters.length})`);
  // Back row cannot attack in melee; the ranger with a bow can.
  const p = defaultParty(makeRng(2));
  ok(!canAttackFromRow(p.members[3], 3) === !ITEMS[p.members[3].equipment.weapon!].ranged, 'back row melee is refused, back row ranged allowed');
  equip(p.members[3], 'sling');
  ok(canAttackFromRow(p.members[3], 3), 'a sling lets the thief attack from the back row');
  ok(canAttackFromRow(p.members[5], 5), 'the sorcerer starts with a sling, so it has a shot from the back row');
  // Fleeing eventually works and ends the fight.
  let fled = false;
  for (let seed = 1; seed < 20 && !fled; seed++) {
    const r = makeRng(seed); const pp = defaultParty(r);
    const s = startCombat(pp, [{ id: 'g', monsters: ['slime'] }], r);
    for (let i = 0; i < 20 && s.outcome === 'ongoing'; i++) { const t = currentTurn(s, pp, r); if (!t) break; if (t.side === 'party') partyAct(s, pp, r, { type: 'flee' }); else monsterAct(s, pp, r); }
    fled = s.outcome === 'fled';
  }
  ok(fled, 'fleeing from a slime succeeds within a few tries');
  // Tier 4-5 spells: an all-target spell hits every foe; Ward and Haste set their timers; Revive raises the dead.
  {
    const r = makeRng(21); const pp = defaultParty(r);
    const sorc = pp.members[5], cler = pp.members[4];
    sorc.level = 8; sorc.spells.push('lightning', 'meteor'); sorc.sp = 60; cler.spells.push('ward', 'revive', 'wrath'); cler.sp = 60;
    const s = startCombat(pp, [{ id: 'a', monsters: ['ogre', 'ogre'] }, { id: 'b', monsters: ['wraith', 'wraith', 'wraith'] }], r);
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
    const dead = pp.members[0]; addCondition(dead, 'dead'); dead.hp = -10;
    const line = castOnAlly(cler, spell('revive'), dead);
    ok(!hasCondition(dead, 'dead') && dead.hp === 10 && /draws breath/.test(line), `Revive brings a dead member back at 10 hp (${line})`);
    ok(/not dead/.test(castOnAlly(cler, spell('revive'), dead)), 'Revive on the living does nothing');
    ok(spell('haste').buff === 'haste' && spell('town_portal').explore === 'town_portal', 'Haste and Town Portal exist at tier 4 and 5');
  }
  // Slumber: the dead never sleep, nor what shrugs it off of its own nature (the slime, the crab, the
  // wardens); beasts and people do.
  {
    const slept = (d: typeof MONSTERS[string]): number => {
      let n = 0;
      for (let seed = 1; seed <= 8; seed++) {
        const r = makeRng(seed), pp = defaultParty(r), sorc = pp.members.find((m) => m.cls === 'sorcerer')!;
        sorc.spells = [...sorc.spells, 'sleep']; sorc.sp = sorc.maxSp = 99;
        const s = startCombat(pp, [{ id: 'a', monsters: new Array(6).fill(d) }], r);
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
    const never = ['skeleton', 'drowned', 'ghoul', 'bone_knight', 'wraith', 'slime', 'shore_crab', 'rift_warden', 'cut_warden'];
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
        const r = makeRng(seed), pp = defaultParty(r);
        const s = startCombat(pp, [{ id: 'a', monsters: new Array(6).fill('bandit_archer') }], r, { rangedPenalty: penalty });
        for (let i = 0; i < 60 && s.outcome === 'ongoing'; i++) { const t = currentTurn(s, pp, r); if (!t) break; if (t.side === 'monster') monsterAct(s, pp, r); else partyAct(s, pp, r, { type: 'defend' }); }
        hit += s.log.filter((l) => l.startsWith('Bandit Archer hits')).length; miss += s.log.filter((l) => l.startsWith('Bandit Archer misses')).length;
      }
      return hit / (hit + miss);
    };
    const dry = rate(0), wet = rate(RANGED_PENALTY);
    ok(wet < dry - 0.05, `archers hit less often in a downpour (${(wet * 100).toFixed(0)}% against ${(dry * 100).toFixed(0)}%)`);
  }
  const noted = startCombat(defaultParty(makeRng(4)), [{ id: 'a', monsters: ['rat'] }], makeRng(4), { rangedPenalty: RANGED_PENALTY, note: 'The downpour spoils every archer\'s aim.' });
  ok(noted.rangedPenalty === RANGED_PENALTY && noted.log[1] === 'The downpour spoils every archer\'s aim.', 'a fight in the weather carries the penalty and says why');
  ok(startCombat(defaultParty(makeRng(4)), [{ id: 'a', monsters: ['rat'] }], makeRng(4)).rangedPenalty === 0, 'and a fight with no word of the weather has none');
  ranks();
  morale();
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
    if (target === undefined || !canAttackFromRow(party.members[t.i], t.i) || !partyAct(s, party, rng, { type: 'attack', target })) partyAct(s, party, rng, { type: 'defend' });
  }
}

/** Ranks (MONSTERS.md §3.3): the issue's choir, four chanters behind two drowned men. */
function ranks(): void {
  const drowned: MonsterDef = { ...MONSTERS.skeleton, id: 'test_drowned', name: 'Drowned Man', plural: 'Drowned Men', hp: 12, attack: 0, dice: 1, sides: 3, bonus: 0 };
  const chanter: MonsterDef = { ...MONSTERS.skeleton, id: 'test_chanter', name: 'Chanter', plural: 'Chanters', hp: 6, attack: 0, dice: 1, sides: 3, bonus: 0 };
  const choir: CombatGroup = { id: 'choir', monsters: [drowned, drowned, chanter, chanter, chanter, chanter], back: 4 };
  const fresh = (): { s: CombatState; p: Party } => { const p = defaultParty(makeRng(5)); return { s: startCombat(p, [choir], makeRng(5)), p }; };
  {
    const { s, p } = fresh(), knight = p.members[0], back = s.monsters.map((m, i) => ({ m, i })).filter(({ m }) => m.back).map(({ i }) => i);
    ok(back.length === 4 && s.monsters.filter((m) => m.back).every((m) => m.def === chanter) && new Set(s.monsters.map((m) => m.group)).size === 2, 'the choir stands in two ranks, its four chanters behind');
    ok(!ITEMS[knight.equipment.weapon!].ranged && back.every((i) => !canReach(s, knight, i)) && s.monsters.every((m, i) => m.back || canReach(s, knight, i)), 'a blade in the front row reaches the drowned men and not the chanters');
    const bow = p.members[3]; equip(bow, 'sling');
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
    const p = defaultParty(makeRng(8)), s = startCombat(p, [{ id: 'barge', monsters: [master, bargeman, bargeman, bargeman, bargeman, bargeman], leader: master.id }], makeRng(8));
    play(s, p, 8, atMaster);
    const died = s.log.findIndex((l) => l.includes('Barge Master dies.'));
    ok(s.outcome === 'victory' && s.monsters.filter((m) => m.fled).length === 5 && s.log[died + 1] === BREAK_LINE('5 Bargemen', false), `a barge crew leaves when its master dies, and the log says so (${s.log[died + 1]})`);
    ok(s.loot?.xp === master.xp && s.loot.gold <= master.gold[1], `the fled pay no xp and take their gold (${s.loot?.xp} xp, ${s.loot?.gold} gold)`);
  }
  {
    // A crew in a group of its own breaks at the master's fall in the next.
    const p = defaultParty(makeRng(9)), s = startCombat(p, [{ id: 'master', monsters: [master], leader: master.id }, { id: 'crew', monsters: [bargeman, bargeman] }], makeRng(9));
    play(s, p, 9, atMaster);
    ok(s.monsters.filter((m) => m.fled).length === 2, 'a crew in another group breaks at its master\'s fall too');
  }
  {
    // The Hand stands; so do people with no leader, the dead and the Rift.
    const hand = startCombat(defaultParty(makeRng(10)), [{ id: 'h', monsters: [master, MONSTERS.cultist, MONSTERS.cultist, bargeman], leader: master.id }], makeRng(10));
    hand.monsters[0].hp = 0;
    partyAct(hand, defaultParty(makeRng(10)), makeRng(10), { type: 'defend' });
    ok(hand.monsters.filter((m) => m.fled).map((m) => m.def.id).join() === bargeman.id && MONSTERS.cultist.steady === true, 'at the master\'s fall the bargeman breaks and the Hand\'s cultists stand');
    const leaderless = startCombat(defaultParty(makeRng(11)), [{ id: 'b', monsters: ['bandit', 'bandit', 'bandit', 'bandit'] }], makeRng(11));
    leaderless.monsters.slice(0, 3).forEach((m) => { m.hp = 0; });
    const dead = startCombat(defaultParty(makeRng(11)), [{ id: 'd', monsters: ['skeleton', 'skeleton', 'skeleton', 'skeleton'], leader: 'skeleton' }], makeRng(11));
    dead.monsters.slice(0, 3).forEach((m) => { m.hp = 0; });
    for (const s of [leaderless, dead]) { const p = defaultParty(makeRng(11)); for (let k = 0; k < 3 && s.outcome === 'ongoing'; k++) { const t = currentTurn(s, p, makeRng(k)); if (t?.side === 'monster') monsterAct(s, p, makeRng(k)); else partyAct(s, p, makeRng(k), { type: 'defend' }); } }
    ok(!leaderless.monsters.some((m) => m.fled) && !dead.monsters.some((m) => m.fled), 'people with no leader, and the dead, never break');
  }
  {
    // A pack runs at three in four down; three rats are too few to.
    const rout = (n: number): CombatState => {
      const p = defaultParty(makeRng(12)), s = startCombat(p, [{ id: 'r', monsters: new Array(n).fill('rat') }], makeRng(12));
      play(s, p, 12, (cs) => aliveMonsters(cs)[0]);
      return s;
    };
    const four = rout(4), three = rout(3);
    ok(four.monsters.filter((m) => m.fled).length === 1 && four.log.includes(ROUT_LINE(MONSTERS.rat.name, true)), `the last of four rats bolts, and the log says so`);
    ok(!three.monsters.some((m) => m.fled), 'three rats fight to the last');
  }
}
