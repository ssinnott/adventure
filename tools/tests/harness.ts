// The combat harness and its test monster (docs/MONSTERS.md §4.4).
import { makeRng } from '../../src/lib/engine/rng.ts';
import { defaultParty, xpForLevel, levelUp, armorClass, weaponOf, MAX_LEVEL, addCondition } from '../../src/game/party.ts';
import { startCombat, currentTurn, partyAct, monsterAct, describeGroups } from '../../src/game/combat.ts';
import { spell, spellDice } from '../../src/game/spells.ts';
import { testMonster, standardEncounter, line, scaleAt, HP, DAMAGE, ROLES, ROLE_IDS } from '../testmonster.ts';
import { measure, days, fight, companyAt, edgeOf, spent, mustRest, bossFloor, longest, slowest, fightsPerRest, ROUND_CAP, REST_AT, WORST, CAP, RULES } from '../harness.ts';
import { ok } from './lib.ts';

export function harness(): void {
  // The resolver fights defs that no map places, which is what the combat harness hands it.
  const soldier = testMonster('soldier', 3), rng = makeRng(31);
  const s = startCombat(defaultParty(rng), [{ id: 'test', monsters: [soldier, soldier] }], rng);
  ok(s.monsters.length === 2 && s.monsters.every((m) => m.def === soldier && m.hp === soldier.hp) && describeGroups(s) === '2 Test Soldiers', `a fight takes a def as well as an id, and names it (${describeGroups(s)})`);
  // Spells that grow with their caster grow without end in play; a tool may try a ceiling.
  const meteor = spell('meteor'), smite = spell('smite');
  ok(spellDice(meteor, 10) === 10 && spellDice(meteor, 20) === 20 && spellDice(meteor, 20, 10) === 10 && spellDice(smite, 20, 10) === 3, 'Meteor Swarm rolls 2d10 for every two levels, and stops growing only where a tool says');
  ok(startCombat(defaultParty(makeRng(35)), [{ id: 'a', monsters: ['rat'] }], makeRng(35)).spellsGrowTo === undefined && startCombat(defaultParty(makeRng(35)), [{ id: 'a', monsters: ['rat'] }], makeRng(35), { spellsGrowTo: 10 }).spellsGrowTo === 10, 'a fight has no ceiling on spells unless it is given one');
  // New powers, as a what-if: a member the resolver is told strikes twice does, and play gives none.
  const twice = defaultParty(makeRng(38)), duel = startCombat(twice, [{ id: 'a', monsters: [testMonster('soldier', 1, 60, 1)] }], makeRng(38), { edge: () => ({ blows: 2, damage: 0, ac: 0 }) });
  let turn: string[] = [];
  for (let k = 0; k < 20 && !turn.length; k++) {
    const t = currentTurn(duel, twice, makeRng(38 + k));
    if (!t) break;
    if (t.side === 'monster') { monsterAct(duel, twice, makeRng(38 + k)); continue; }
    const before = duel.log.length;
    partyAct(duel, twice, makeRng(38 + k), { type: 'attack', target: 0 });
    turn = duel.log.slice(before);
  }
  ok(turn.length === 2 && startCombat(defaultParty(makeRng(39)), [{ id: 'a', monsters: ['rat'] }], makeRng(39)).edge === undefined, `a member told to strike twice strikes twice (${turn.join(' ')}), and a fight gives no such power unless told`);
  RULES.levelTraits = true;
  const blows = [10, 11, 28, 29].map((l) => edgeOf(companyAt(l, 37).members[0], 1).blows), traits = companyAt(24, 37).members.map((m) => edgeOf(m, 1));
  const later = edgeOf(companyAt(24, 37).members[3], 2).damage;
  RULES.levelTraits = undefined; RULES.levelBonus = true;
  const perks = companyAt(24, 37).members.map((m) => edgeOf(m, 1));
  RULES.levelBonus = undefined;
  ok(blows.join() === '1,2,2,3' && traits[5].blows === 1 && traits[3].damage === 14 && later === 0 && perks.every((e) => e.damage === 7 && e.ac === 7) && edgeOf(companyAt(24, 37).members[0], 1).blows === 1, `with --level-traits the knight strikes once more a turn with each promotion (${blows.join(', ')} blows at 10, 11, 28 and 29) and at 24 a sneak attack adds 14 in the first round only; with --level-bonus every member gains 7 at 24; without, none`);
  // The curve's gear, as a what-if: past level 10 weapons and armour keep growing; play has none of it.
  const knight = (p: ReturnType<typeof companyAt>): [number, number] => [weaponOf(p.members[0]).bonus ?? 0, armorClass(p.members[0])];
  const flat = [knight(companyAt(10, 37)), knight(companyAt(20, 37))];
  RULES.gearGrows = true;
  const grown = [knight(companyAt(10, 37)), knight(companyAt(20, 37))];
  RULES.gearGrows = undefined;
  ok(grown[0].join() === flat[0].join() && grown[1][0] > flat[1][0] && grown[1][1] === flat[1][1] + 5, `gear grows past 10 only where a what-if asks: at 20 the knight's war hammer gains ${grown[1][0] - flat[1][0]} and the knight's armour 5`);
  // Fights may run longer as both sides grow, and never to the cap; a fight that would is broken off.
  const allowed = Array.from({ length: CAP }, (_, k) => [longest(k + 1), slowest(k + 1)]);
  ok(longest(1) === 4 && slowest(1) === 6 && allowed.every(([a, b], k) => a <= b && b < ROUND_CAP && (k === 0 || a >= allowed[k - 1][0])), `a fight's rounds run from ${longest(1)} (${slowest(1)} at most) at level 1 to ${longest(CAP).toFixed(1)} (${slowest(CAP).toFixed(1)}) at ${CAP}`);
  const wall = fight(companyAt(1, 36), [testMonster('soldier', 1, 2000, 0.01)], 36);
  ok(ROUND_CAP === 15 && wall.broken && !wall.won && wall.rounds === ROUND_CAP, `a fight nobody can finish is broken off after ${ROUND_CAP} rounds (${wall.rounds})`);
  // Six or seven fights between rests to level 10, a fight more every four levels after, and never fifteen.
  const perRest = Array.from({ length: CAP }, (_, k) => fightsPerRest(k + 1));
  ok(perRest[0] === 6.5 && perRest[9] === 6.5 && perRest[CAP - 1] === 12 && perRest.every((f, k) => f < 15 && (k === 0 || f >= perRest[k - 1])), `fights between rests run from ${perRest[0]} at level 1 and ${perRest[9]} at 10 to ${perRest[CAP - 1]} at ${CAP}`);
  // Training past today's cap is for tools only.
  const c = defaultParty(makeRng(32)).members[0];
  c.xp = xpForLevel(20); levelUp(c, makeRng(32));
  ok(c.level === MAX_LEVEL, `levelUp stops at MAX_LEVEL in play (${c.level})`);
  levelUp(c, makeRng(32), 20);
  ok(c.level === 20, `and trains on when a tool asks it to (${c.level})`);
  // What a fight costs: all of a fallen member's hit points, and every spell point cast.
  const p = defaultParty(makeRng(33)), fallen = p.members[5];
  const pool = p.members.reduce((a, m) => a + m.maxHp + m.maxSp, 0);
  fallen.hp = -1; addCondition(fallen, 'unconscious'); p.members[4].sp -= 3;
  const cost = spent(p).cost;
  ok(Math.abs(cost - (fallen.maxHp + 3) / pool) < 1e-9, `a fallen member costs all of their hit points, a spell its points (${(cost * 100).toFixed(1)}% of the company)`);
  // A company rests once anyone is under a quarter of their hit points, or it is under a quarter of its spell points.
  const whole = defaultParty(makeRng(34)), hurt = structuredClone(whole), dry = structuredClone(whole);
  hurt.members[0].hp = Math.ceil(hurt.members[0].maxHp * REST_AT) - 1;
  for (const m of dry.members) m.sp = Math.floor(m.maxSp * (REST_AT - 0.05));
  ok(mustRest(whole) === null && mustRest(hurt) === 'hp' && mustRest(dry) === 'sp', `a whole company fights on, and rests for one member's wounds or for its spell points (${mustRest(whole)}, ${mustRest(hurt)}, ${mustRest(dry)})`);
  // From 1 to the road's cap, a test monster's hit points never fall with level, and it hits under
  // its role's share of the line only where its hit points came down with it (docs/MONSTERS.md §4.4).
  for (const r of ROLE_IDS) {
    const levels = Array.from({ length: CAP }, (_, k) => k + 1), m = levels.map((l) => testMonster(r, l));
    const falls = levels.filter((l) => l > 1 && m[l - 1].hp < m[l - 2].hp);
    const under = levels.filter((l) => scaleAt(DAMAGE, r, l) < 1 - 1e-9 && scaleAt(HP, r, l) > scaleAt(DAMAGE, r, l) + 1e-9);
    const off = levels.filter((l) => Math.abs((m[l - 1].dice * (m[l - 1].sides + 1)) / 2 + m[l - 1].bonus - Math.max(1, line(l).dmg * ROLES[r].dmg * scaleAt(DAMAGE, r, l))) > 0.5);
    ok(!falls.length && !under.length && !off.length, `the test ${r} gains hit points with every level, hits under the line only where it comes down whole, and its dice roll what it should${falls.length || under.length || off.length ? ` (falls at ${falls.join(', ')}; under at ${under.join(', ')}; dice off at ${off.join(', ')})` : ''}`);
  }
  // The calibration holds on seeds it was not made on: six or seven fights between rests at a company's
  // own level, few of its days ending in a death or a lost fight, and the boss a coin flip from two
  // under. Two brutes at 4 are the worst of it: six rounds a fight is as safe as they get (docs/MONSTERS.md §4.4).
  for (const [r, l, worst] of [['fodder', 2, 2 * WORST], ['brute', 4, 3.5 * WORST], ['soldier', 6, 2 * WORST], ['caster', 10, 2 * WORST]] as const) {
    const d = days(l, [standardEncounter(r, l)], 60, 5001), bad = d.why.dead + d.why.lost + d.why.long;
    ok(Math.abs(d.fights - fightsPerRest(l)) <= 1 && bad <= worst, `a company of level ${l} fights ${d.fights.toFixed(1)} encounters of ${ROLES[r].group} ${ROLES[r].plural} between rests (${fightsPerRest(l)} asked), and ${(bad * 100).toFixed(0)}% of its days end badly (${(worst * 100).toFixed(0)}% at most)`);
  }
  // Past 10 the target grows: a company of 24 fights about ten between rests.
  const late = days(24, [standardEncounter('soldier', 24)], 40, 5001);
  ok(Math.abs(late.fights - fightsPerRest(24)) <= 1.5, `a company of level 24 fights ${late.fights.toFixed(1)} encounters of 4 Test Soldiers between rests (${fightsPerRest(24)} asked)`);
  const boss = measure(bossFloor(8), standardEncounter('boss', 8), 80, 5001);
  ok(boss.won >= 0.3 && boss.won <= 0.7, `a company two levels under the test boss wins ${(boss.won * 100).toFixed(0)}% of the time (half asked)`);
}
