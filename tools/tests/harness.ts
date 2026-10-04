// The combat harness and its test monster (docs/MONSTERS.md §4.4), and Act III's abilities on it (#537).
import { makeRng } from '../../src/lib/engine/rng.ts';
import { defaultParty, xpForLevel, levelUp, armorClass, weaponOf, MAX_LEVEL, addCondition, className, rankMult, hasCondition } from '../../src/game/party.ts';
import type { Party } from '../../src/game/party.ts';
import { startCombat, currentTurn, partyAct, monsterAct, describeGroups, blowsOf, MAX_MONSTERS, MAX_GROUPS } from '../../src/game/combat.ts';
import type { CombatState, Fighters } from '../../src/game/combat.ts';
import { spell, spellDice, SPELLS_GROW_TO } from '../../src/game/spells.ts';
import type { MonsterDef } from '../../src/game/monsters.ts';
import { MONSTERS } from '../../src/content/index.ts';
import { gateCompany } from '../gate.ts';
import { testMonster, standardEncounter, line, scaleAt, groupsPerLevel, xpFor, HP, DAMAGE, ROLES, ROLE_IDS, TROLL, testTroll, trollEncounter, wightEncounter, callerEncounter, lightEncounter } from '../testmonster.ts';
import type { Role } from '../testmonster.ts';
import { measure, days, fight, play, outcomeOf, companyAt, edgeOf, spent, mustRest, bossFloor, longest, slowest, fightsPerRest, ROUND_CAP, REST_AT, WORST, CAP, RULES, GEAR_TOP } from '../harness.ts';
import { ok } from './lib.ts';

export function harness(): void {
  // The resolver fights defs that no map places, which is what the combat harness hands it.
  const soldier = testMonster('soldier', 3), rng = makeRng(31);
  const s = startCombat(defaultParty(rng), [{ id: 'test', monsters: [soldier, soldier] }], rng);
  ok(s.monsters.length === 2 && s.monsters.every((m) => m.def === soldier && m.hp === soldier.hp) && describeGroups(s) === '2 Test Soldiers', `a fight takes a def as well as an id, and names it (${describeGroups(s)})`);
  // Spells that grow with their caster stop growing at 10 in play (DESIGN.md §7); a tool may try another ceiling.
  const meteor = spell('meteor'), smite = spell('smite');
  ok(SPELLS_GROW_TO === 10 && spellDice(meteor, 8) === 8 && spellDice(meteor, 10) === 10 && spellDice(meteor, 20) === 10 && spellDice(meteor, 20, 32) === 20 && spellDice(smite, 20) === 3, 'Meteor Swarm rolls 2d10 for every two levels to 10 and no more, unless a tool tries another ceiling');
  ok(startCombat(defaultParty(makeRng(35)), [{ id: 'a', monsters: ['rat'] }], makeRng(35)).spellsGrowTo === undefined && startCombat(defaultParty(makeRng(35)), [{ id: 'a', monsters: ['rat'] }], makeRng(35), { spellsGrowTo: 32 }).spellsGrowTo === 32, "a fight keeps play's ceiling on spells unless it is given another");
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
  // The prestiges are play's: every company takes them at 11, 19 and 27, with their blows, and with
  // them its spell ranks: a caster's spells 15% a rank, a hybrid's half that, a fighter's none.
  const taken = [10, 11, 19, 27].map((l) => companyAt(l, 37).members[0]), blowsAt = taken.map(blowsOf);
  const at12 = companyAt(12, 37), at28 = companyAt(28, 37);
  const ranks = [at12.members[5], at28.members[5], at28.members[1], at28.members[0], companyAt(10, 37).members[5]].map((c) => rankMult(c).toFixed(3));
  ok(taken.map((c) => c.prestige ?? 0).join() === '0,1,2,3' && blowsAt.join() === '1,2,2,3' && className(taken[3]) === 'Knight Paramount' && ranks.join() === '1.150,1.450,1.225,1.000,1.000',
    `the company takes its prestiges at 11, 19 and 27 (the knight a ${className(taken[3])} at 27, striking ${blowsAt.join(', ')} times at 10, 11, 19 and 27), and with them the sorcerer's spells gain 15% at the first and 45% by the third, the paladin's half that and the knight's none (${ranks.join(', ')})`);
  // The curve's gear, as a what-if: past the ladder's top weapons and armour keep growing; play has none of it.
  const knight = (p: ReturnType<typeof companyAt>): [number, number] => [weaponOf(p.members[0]).bonus ?? 0, armorClass(p.members[0])];
  const flat = [knight(companyAt(GEAR_TOP, 37)), knight(companyAt(24, 37))];
  RULES.gearGrows = true;
  const grown = [knight(companyAt(GEAR_TOP, 37)), knight(companyAt(24, 37))];
  RULES.gearGrows = undefined;
  ok(grown[0].join() === flat[0].join() && grown[1][0] > flat[1][0] && grown[1][1] === flat[1][1] + (24 - GEAR_TOP) / 2, `gear grows past the ladder's top, ${GEAR_TOP}, only where a what-if asks: at 24 the knight's weapon gains ${grown[1][0] - flat[1][0]} and the knight's armour ${grown[1][1] - flat[1][1]}`);
  // Fights may run longer as both sides grow, and never to the cap; a fight that would is broken off.
  const allowed = Array.from({ length: CAP }, (_, k) => [longest(k + 1), slowest(k + 1)]);
  ok(longest(1) === 4 && slowest(1) === 6 && allowed.every(([a, b], k) => a <= b && b < ROUND_CAP && (k === 0 || a >= allowed[k - 1][0])), `a fight's rounds run from ${longest(1)} (${slowest(1)} at most) at level 1 to ${longest(CAP).toFixed(1)} (${slowest(CAP).toFixed(1)}) at ${CAP}`);
  const wall = fight(companyAt(1, 36), [testMonster('soldier', 1, 2000, 0.01)], 36);
  ok(ROUND_CAP === 15 && wall.broken && !wall.won && wall.rounds === ROUND_CAP, `a fight nobody can finish is broken off after ${ROUND_CAP} rounds (${wall.rounds})`);
  // Six or seven fights between rests to level 10, a fight more every four levels after, and never fifteen.
  const perRest = Array.from({ length: CAP }, (_, k) => fightsPerRest(k + 1));
  ok(perRest[0] === 6.5 && perRest[9] === 6.5 && perRest[CAP - 1] === 12 && perRest.every((f, k) => f < 15 && (k === 0 || f >= perRest[k - 1])), `fights between rests run from ${perRest[0]} at level 1 and ${perRest[9]} at 10 to ${perRest[CAP - 1]} at ${CAP}`);
  // The harness trains as play does, to the road's cap.
  const c = defaultParty(makeRng(32)).members[0];
  c.xp = xpForLevel(40); levelUp(c, makeRng(32));
  ok(CAP === MAX_LEVEL && c.level === MAX_LEVEL && companyAt(20, 32).members.every((m) => m.level === 20), `levelUp trains to the cap, ${MAX_LEVEL}, and the harness's company to its level (${c.level})`);
  // The gate's company at Act II's floors: trained to 10, 12, 14 and 16, and dressed past the one two
  // under it by the ladder past Thornmark's Armoury (#399), as the gate's two-under check asks.
  const gear = (l: number): string => gateCompany(l, 32).members.map((m) => `${m.equipment.weapon}/${m.equipment.armor}/${m.equipment.shield}`).join();
  ok([10, 12, 14, 16].every((l) => gateCompany(l, 32).members.every((m) => m.level === l)) && gear(12) !== gear(10) && gear(14) !== gear(12) && gear(16) !== gear(14),
    `the gate's company trains to 10, 12, 14 and 16, and dresses past the one two under it (${gear(16)})`);
  // And at Act III's, by its steps at Anvilhall and Rime Lodge and the finds after each (#535).
  ok([18, 20, 22].every((l) => gateCompany(l, 32).members.every((m) => m.level === l)) && gear(18) !== gear(16) && gear(20) !== gear(18) && gear(22) !== gear(20),
    `the gate's company trains to 18, 20 and 22, and dresses past the one two under it (${gear(22)})`);
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
  // Past 10 the target grows: a company of 24 fights about ten between rests, in Act III's gear to the
  // ladder's top at 22 (#535), the line past 16 made again with it (#541).
  const late = days(24, [standardEncounter('soldier', 24)], 40, 5001);
  ok(Math.abs(late.fights - fightsPerRest(24)) <= 1.5, `a company of level 24 fights ${late.fights.toFixed(1)} encounters of 4 Test Soldiers between rests (${fightsPerRest(24)} asked)`);
  // And through Act III, 16 to 22, about its fights at every level, a fight more every four levels.
  const act = [16, 17, 18, 19, 20, 21, 22].map((l) => ({ l, d: days(l, [standardEncounter('soldier', l)], 40, 5001) }));
  ok(act.every(({ l, d }) => Math.abs(d.fights - fightsPerRest(l)) <= 1.5), `through Act III a company fights about its own of 4 Test Soldiers between rests: ${act.map(({ l, d }) => `${d.fights.toFixed(1)} at ${l} (${fightsPerRest(l)})`).join(', ')}`);
  // A test monster's encounter pays what the curve gives a group at the built areas' pinned pace (docs/MONSTERS.md §4.4).
  const pays = [1, 10, 32].map((l) => Math.round((6 * (xpForLevel(l + 1) - xpForLevel(l))) / (0.75 * groupsPerLevel(l))));
  ok(pays.join() === '99,1573,5093' && xpFor('boss', 10) === 6293, `an encounter pays ${pays.join(', ')} at 1, 10 and 32, as MONSTERS §4.4 says, and a boss four`);
  const boss = measure(bossFloor(8), standardEncounter('boss', 8), 80, 5001);
  ok(boss.won >= 0.3 && boss.won <= 0.7, `a company two levels under the test boss wins ${(boss.won * 100).toFixed(0)}% of the time (half asked)`);
  onTheLine();
  abilities();
}

/**
 * The monsters past Act I set off the line on purpose (MONSTERS §4.4), each with why. Every other
 * monster of level 11 or more stands on the line at its level: some role's test monster's hit points
 * and blow, the test troll's (#537), or a role's come down whole by a share named in WHOLE. So when
 * the line is made again a monster left on the old one fails until it is re-derived. One a box's gate
 * tunes off the line goes here with the issue that tuned it.
 */
export const OFF_LINE: Record<string, string> = {
  choirmaster: "the Drowned Temples' boss, set by their gate (#175)",
  great_devilfish: "Kelp Hole's boss, set by its gate (#188)",
  tide_warden: "the Tide Ship's boss, set by its gate (#190)",
  sunder_warden: "the Sunder's boss, on the boss line's hit points with its blow set by its gate (#199)",
};
/** The monsters past 10 on a role's line come down whole, hit points and blow together (MONSTERS §4.4): the role, the share and why. */
export const WHOLE: Record<string, { role: Role; share: number; why: string }> = {
  bog_light: { role: 'controller', share: 0.575, why: "four on the line end a company's day in four fights (#597)" },
};

/** Every monster past 10 on the line at its level, or set off it with a reason (OFF_LINE). */
function onTheLine(): void {
  const blow = (m: Pick<MonsterDef, 'dice' | 'sides' | 'bonus'>): number => (m.dice * (m.sides + 1)) / 2 + m.bonus;
  /** The shapes a monster of its level may stand on: each role's line, the test troll's, and its share in WHOLE. */
  const shapes = (m: MonsterDef): MonsterDef[] => {
    const w = WHOLE[m.id], l = m.level;
    return [...ROLE_IDS.map((r) => testMonster(r, l)), testTroll(l), ...(w ? [testMonster(w.role, l, scaleAt(HP, w.role, l) * w.share, scaleAt(DAMAGE, w.role, l) * w.share)] : [])];
  };
  const on = (m: MonsterDef): boolean => shapes(m).some((t) => t.hp === m.hp && Math.abs(blow(t) - blow(m)) <= 0.5 && (t.regen ?? 0) === (m.regen ?? 0));
  const past = Object.values(MONSTERS).filter((m) => m.level > 10), set = past.filter((m) => OFF_LINE[m.id]);
  const off = past.filter((m) => !OFF_LINE[m.id] && !on(m)).map((m) => {
    const near = shapes(m).sort((a, b) => Math.abs(a.hp - m.hp) - Math.abs(b.hp - m.hp))[0];
    return `${m.id} at ${m.level}, ${m.hp} / ${blow(m)}, where the nearest is ${near.name} ${near.hp} / ${blow(near)}`;
  });
  ok(!off.length, `every monster past 10 stands on the line at its level, its hit points and its blow, or is set off it with a reason: ${past.length - set.length} on it, ${set.length} set off it${off.length ? ` (off it: ${off.join('; ')})` : ''}`);
  const stale = [...Object.keys(OFF_LINE), ...Object.keys(WHOLE)].filter((id) => !MONSTERS[id] || MONSTERS[id].level <= 10 || (OFF_LINE[id] && on(MONSTERS[id])));
  ok(!stale.length, `and every monster set off it or come down whole is a monster past 10, and one set off it is off it${stale.length ? ` (not: ${stale.join(', ')})` : ''}`);
  // It can fail: a soldier a few hit points off the line, a troll left mending what it did, and a light
  // still the size it was, each fail; on the line they pass.
  const soldier = testMonster('soldier', 19), troll = testTroll(19), share = WHOLE.bog_light, light = MONSTERS.bog_light;
  const lit = testMonster(share.role, light.level, scaleAt(HP, share.role, light.level) * share.share, scaleAt(DAMAGE, share.role, light.level) * share.share);
  const probes = [{ ...soldier, hp: soldier.hp - 5 }, { ...troll, regen: (troll.regen ?? 0) - 4 }, { ...light, hp: lit.hp + 7 }];
  ok(probes.every((m) => !on(m)) && [soldier, troll, { ...light, hp: lit.hp, dice: lit.dice, sides: lit.sides, bonus: lit.bonus }].every(on), 'and a monster left off it is caught: a soldier five hit points short, a troll mending four too few and a light seven too many');
}

/** The company with no fire: its members' fire spells forgotten. */
const fireless = (p: Party): Party => { for (const c of p.members) c.spells = c.spells.filter((id) => spell(id).element !== 'fire'); return p; };

/**
 * One fight a seed from `from`, a company of `level` dressed by `dress`, as `measure` fights them:
 * the share won, its rounds and its cost on average, and each fight's end and company, to read.
 */
function bout(level: number, enc: Fighters, seeds: number, from: number, dress: (p: Party) => Party = (p) => p): { won: number; rounds: number; cost: number; fights: { s: CombatState; p: Party }[] } {
  let won = 0, rounds = 0, cost = 0;
  const fights: { s: CombatState; p: Party }[] = [];
  for (let k = from; k < from + seeds; k++) {
    const p = dress(companyAt(level, k)), s = play(p, enc, k * 7919 + 13), o = outcomeOf(s, p);
    won += o.won ? 1 : 0; rounds += o.rounds; cost += o.cost; fights.push({ s, p });
  }
  return { won: won / seeds, rounds: rounds / seeds, cost: cost / seeds, fights };
}

/**
 * Act III's abilities on the test monsters (MONSTERS §3.3, #537, #541), where the road first meets
 * them: two trolls at 19, burnt or not; four wights at 19; a caller beside six fodder at 20, its fight
 * growing; three lights and a hound at 19, the lights felled first.
 */
function abilities(): void {
  const pc = (x: number): string => `${Math.round(x * 100)}%`;
  // With fire the company burns the trolls and fights as many of them to a rest as of plain brutes;
  // with none it grinds, its fights half as long again and dearer, and still won.
  const troll = testTroll(19), brute = testMonster('brute', 19);
  ok(troll.hp === Math.round(brute.hp * TROLL.hp) && troll.regen === Math.round(troll.hp * TROLL.regen), `the test troll at 19 is the test brute on ${TROLL.hp} of its hit points, ${troll.hp}, mending ${troll.regen} a round`);
  const fire = bout(19, trollEncounter(19), 40, 5001), none = bout(19, trollEncounter(19), 40, 5001, fireless);
  const burnt = fire.fights.filter(({ s }) => s.log.some((l) => / smoulders? and /.test(l))).length;
  ok(fire.won >= 0.95 && burnt >= 30, `a company of 19 with fire wins ${pc(fire.won)} of two trolls' fights, burning them in ${burnt} of 40`);
  ok(none.won >= 0.9 && none.rounds >= fire.rounds * 1.25 && none.cost > fire.cost, `with none it grinds: ${none.rounds.toFixed(1)} rounds and ${(none.cost * 100).toFixed(1)}% of itself a fight, against ${fire.rounds.toFixed(1)} and ${(fire.cost * 100).toFixed(1)}%, and wins ${pc(none.won)}`);
  const day = days(19, [trollEncounter(19)], 40, 5001), brutes = days(19, [standardEncounter('brute', 19)], 40, 5001);
  ok(Math.abs(day.fights - brutes.fights) <= 1.5, `with fire it fights ${day.fights.toFixed(1)} of their encounters to a rest, about as many as of plain brutes (${brutes.fights.toFixed(1)}; ${fightsPerRest(19)} asked)`);
  // The wights' curses land and outlast the fight, and end no day.
  const wights = bout(19, wightEncounter(19), 20, 5001), cursed = wights.fights.filter(({ p }) => p.members.some((m) => hasCondition(m, 'cursed'))).length;
  const marked = companyAt(19, 1);
  addCondition(marked.members[0], 'cursed');
  ok(wights.won >= 0.9 && cursed >= 4 && mustRest(marked) === null, `a company of 19 wins ${pc(wights.won)} of four wights' fights and leaves ${cursed} of 20 with someone cursed, and a curse alone sends no company to rest`);
  // The caller's fight grows by its call and never past the cap; the company's day holds.
  const called = bout(20, callerEncounter(20), 40, 5001), grew = called.fights.filter(({ s }) => s.groupIds.length > 1).length;
  const most = Math.max(...called.fights.map(({ s }) => s.monsters.length)), groups = Math.max(...called.fights.map(({ s }) => s.groupIds.length));
  ok(called.won >= 0.95 && grew >= 8 && most <= MAX_MONSTERS && groups <= MAX_GROUPS, `a company of 20 wins ${pc(called.won)} of a caller's fights beside six fodder; it called in ${grew} of 40, and no fight held more than ${most} in ${groups} groups`);
  const cday = days(20, [callerEncounter(20)], 40, 5001), mute = days(20, [callerEncounter(20).map((m) => (m.calls ? { ...m, calls: undefined } : m))], 40, 5001);
  ok(cday.fights < mute.fights && cday.fights > mute.fights - 2.5, `and it fights ${cday.fights.toFixed(1)} of them to a rest, where with no call it fights ${mute.fights.toFixed(1)}: the call costs it a fight or two (${fightsPerRest(20)} asked)`);
  // The lights take spell points (#161), and the bots aim at them after a leader and a caller (#541):
  // three lights and a hound cost a company of 19 more of its spell points than lights that took hit
  // points would, and felling the lights first keeps it on its feet longer than felling the hound.
  const lights = lightEncounter(19), dull = lights.map((m) => (m.drain ? { ...m, drain: undefined } : m)), hound = { monsters: lights, leader: lights[lights.length - 1].id };
  const lit = bout(19, lights, 40, 5001), flat = bout(19, dull, 40, 5001), sp = (b: typeof lit): number => b.fights.reduce((t, { p }) => t + spent(p).sp, 0) / b.fights.length;
  ok(lit.won >= 0.95 && sp(lit) > sp(flat), `a company of 19 wins ${pc(lit.won)} of three lights' and a hound's fights, ${pc(sp(lit))} of its spell points spent or taken, against ${pc(sp(flat))} where the lights take hit points`);
  const lday = days(19, [lights], 40, 5001), hday = days(19, [hound], 40, 5001);
  ok(lday.fights > hday.fights, `and felling the lights first it fights ${lday.fights.toFixed(1)} of them to a rest, where felling the hound first it fights ${hday.fights.toFixed(1)} (${fightsPerRest(19)} asked)`);
}
