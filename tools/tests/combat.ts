// The combat resolver: a seeded fight replays byte for byte, the cap, the rows, fleeing, the spells
// that hit every foe, Ward and Revive.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { ITEMS, MONSTERS } from '../../src/content/index.ts';
import { defaultParty, equip, addCondition, hasCondition } from '../../src/game/party.ts';
import { startCombat, currentTurn, partyAct, monsterAct, aliveMonsters, canAttackFromRow, castOnAlly, WARD_AC } from '../../src/game/combat.ts';
import type { CombatState } from '../../src/game/combat.ts';
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
  const xp = MONSTERS.rat.xp * 3 + MONSTERS.wolf.xp;
  ok(a.state.loot !== null && a.state.loot.xp === xp, `xp is the sum of the monsters' (${a.state.loot?.xp})`);
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
}
