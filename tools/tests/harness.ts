// The combat harness and its test monster (docs/MONSTERS.md §4.4), and Act III's abilities on it (#537)
// and Act IV's sweep (#545); the what-ifs #865 weighed and kept off and the four newer
// classes' company (#854).
import { createHash } from 'node:crypto';
import { makeRng } from '../../src/lib/engine/rng.ts';
import { defaultParty, xpForLevel, levelUp, armorClass, weaponOf, MAX_LEVEL, addCondition, className, rankMult, hasCondition, prestigeOf, borne } from '../../src/game/party.ts';
import { linesOf, LINES, TIER_LEVELS } from '../../src/game/mastery.ts';
import type { Tier } from '../../src/game/mastery.ts';
import type { Party } from '../../src/game/party.ts';
import { startCombat, currentTurn, partyAct, monsterAct, describeGroups, blowsOf, sweptRow, MAX_MONSTERS, MAX_GROUPS, FRONT_ROW } from '../../src/game/combat.ts';
import type { CombatState, Fighters } from '../../src/game/combat.ts';
import { spell, spellDice, SPELLS_GROW_TO } from '../../src/game/spells.ts';
import type { MonsterDef } from '../../src/game/monsters.ts';
import { MONSTERS, MAP_DEFS, ITEMS } from '../../src/content/index.ts';
import { gateTurn, gateBot, fightSeed, winRate } from '../kit/fight.ts';
import { gateCompany, HARNESS } from '../kit/company.ts';
import { GATE } from '../kit/rules/gate.ts';
import { testMonster, standardEncounter, line, scaleAt, groupsPerLevel, xpFor, HP, DAMAGE, ROLES, ROLE_IDS, TROLL, SWEEP, testTroll, trollEncounter, wightEncounter, callerEncounter, lightEncounter, testGiant, testDrake, giantEncounter, drakeEncounter, BASILISK_STONE, testBasilisk, basiliskEncounter, clockEncounter } from '../kit/line.ts';
import type { Role } from '../kit/line.ts';
import { measure, days, fight, play, outcomeOf, spent, mendBetween, day as oneDay, bossFloor, longest, slowest, fightsPerRest, WORST, CAP, casting, cellsOnCores } from '../kit/harness.ts';
import { mustRest, REST_AT, ANSWER, wakeWith, breathGuard } from '../../src/game/bot.ts';
import { companyAt, newerCompany, edgeOf, unforge, GEAR, GEAR_TOP, whatIfs, writeRefusal, artifactIds } from '../kit/company.ts';
import { ROUND_CAP, playOut } from '../kit/fight.ts';
import type { BotOpts } from '../../src/game/bot.ts';
import { ok } from './lib.ts';

export async function harness(): Promise<void> {
  // The resolver fights defs that no map places, which is what the combat harness hands it.
  const soldier = testMonster('soldier', 3), rng = makeRng(31);
  const s = startCombat(HARNESS, defaultParty(HARNESS, rng), [{ id: 'test', monsters: [soldier, soldier] }], rng);
  ok(s.monsters.length === 2 && s.monsters.every((m) => m.def === soldier && m.hp === soldier.hp) && describeGroups(s) === '2 Test Soldiers', `a fight takes a def as well as an id, and names it (${describeGroups(s)})`);
  // Spells that grow with their caster stop growing at 10 in play (DESIGN.md §7); a tool may try another ceiling.
  const meteor = spell('meteor'), smite = spell('smite');
  ok(SPELLS_GROW_TO === 10 && spellDice(meteor, 8) === 8 && spellDice(meteor, 10) === 10 && spellDice(meteor, 20) === 10 && spellDice(meteor, 20, 32) === 20 && spellDice(smite, 20) === 3, 'Meteor Swarm rolls 2d10 for every two levels to 10 and no more, unless a tool tries another ceiling');
  ok(startCombat(HARNESS, defaultParty(HARNESS, makeRng(35)), [{ id: 'a', monsters: ['rat'] }], makeRng(35)).spellsGrowTo === undefined && startCombat(HARNESS, defaultParty(HARNESS, makeRng(35)), [{ id: 'a', monsters: ['rat'] }], makeRng(35), { spellsGrowTo: 32 }).spellsGrowTo === 32, "a fight keeps play's ceiling on spells unless it is given another");
  // New powers, as a what-if: a member the resolver is told strikes twice does, and play gives none.
  const twice = defaultParty(HARNESS, makeRng(38)), duel = startCombat(HARNESS, twice, [{ id: 'a', monsters: [testMonster('soldier', 1, 60, 1)] }], makeRng(38), { edge: () => ({ blows: 2, damage: 0, ac: 0 }) });
  let turn: string[] = [];
  for (let k = 0; k < 20 && !turn.length; k++) {
    const t = currentTurn(duel, twice, makeRng(38 + k));
    if (!t) break;
    if (t.side === 'monster') { monsterAct(duel, twice, makeRng(38 + k)); continue; }
    const before = duel.log.length;
    partyAct(duel, twice, makeRng(38 + k), { type: 'attack', target: 0 });
    turn = duel.log.slice(before);
  }
  ok(turn.length === 2 && startCombat(HARNESS, defaultParty(HARNESS, makeRng(39)), [{ id: 'a', monsters: ['rat'] }], makeRng(39)).edge === undefined, `a member told to strike twice strikes twice (${turn.join(' ')}), and a fight gives no such power unless told`);
  const levelTraits = { levelTraits: true }, levelBonus = { levelBonus: true };
  const blows = [10, 11, 28, 29].map((l) => edgeOf(companyAt(l, 37).members[0], 1, levelTraits).blows), traits = companyAt(24, 37).members.map((m) => edgeOf(m, 1, levelTraits));
  const later = edgeOf(companyAt(24, 37).members[3], 2, levelTraits).damage;
  const perks = companyAt(24, 37).members.map((m) => edgeOf(m, 1, levelBonus));
  ok(blows.join() === '1,2,2,3' && traits[5].blows === 1 && traits[3].damage === 14 && later === 0 && perks.every((e) => e.damage === 7 && e.ac === 7) && edgeOf(companyAt(24, 37).members[0], 1).blows === 1, `with --level-traits the knight strikes once more a turn with each promotion (${blows.join(', ')} blows at 10, 11, 28 and 29) and at 24 a sneak attack adds 14 in the first round only; with --level-bonus every member gains 7 at 24; without, none`);
  // The prestiges are play's: every company takes them at 11, 19 and 27, with their blows, and with
  // them its spell ranks: a caster's spells 15% a rank, a hybrid's half that, a fighter's none.
  const taken = [10, 11, 19, 27].map((l) => companyAt(l, 37).members[0]), blowsAt = taken.map((c) => blowsOf(HARNESS.items, c));
  const at12 = companyAt(12, 37), at28 = companyAt(28, 37);
  const ranks = [at12.members[5], at28.members[5], at28.members[1], at28.members[0], companyAt(10, 37).members[5]].map((c) => rankMult(c).toFixed(3));
  ok(taken.map((c) => c.prestige ?? 0).join() === '0,1,2,3' && blowsAt.join() === '1,2,2,3' && className(taken[3]) === 'Knight Paramount' && ranks.join() === '1.150,1.450,1.225,1.000,1.000',
    `the company takes its prestiges at 11, 19 and 27 (the knight a ${className(taken[3])} at 27, striking ${blowsAt.join(', ')} times at 10, 11, 19 and 27), and with them the sorcerer's spells gain 15% at the first and 45% by the third, the paladin's half that and the knight's none (${ranks.join(', ')})`);
  // The curve's gear, as a what-if: past the ladder's top weapons and armour keep growing; play has none of it.
  const knight = (p: ReturnType<typeof companyAt>): [number, number] => [weaponOf(HARNESS.items, p.members[0]).bonus ?? 0, armorClass(HARNESS.items, p.members[0])];
  const past = GEAR_TOP + 2;
  const flat = [knight(companyAt(GEAR_TOP, 37)), knight(companyAt(past, 37))];
  // The forged gear is taken out again (`unforge`), so none is left in the item table for a later suite.
  const grows = { gearGrows: true }, grown = (() => { try { return [knight(companyAt(GEAR_TOP, 37, grows)), knight(companyAt(past, 37, grows))]; } finally { unforge(); } })();
  ok(grown[0].join() === flat[0].join() && grown[1][0] > flat[1][0] && grown[1][1] === flat[1][1] + (past - GEAR_TOP) / 2, `gear grows past the ladder's top, ${GEAR_TOP}, only where a what-if asks: at ${past} the knight's weapon gains ${grown[1][0] - flat[1][0]} and the knight's armour ${grown[1][1] - flat[1][1]}`);
  // Fights may run longer as both sides grow, and never to the cap; a fight that would is broken off.
  const allowed = Array.from({ length: CAP }, (_, k) => [longest(k + 1), slowest(k + 1)]);
  ok(longest(1) === 4 && slowest(1) === 6 && allowed.every(([a, b], k) => a <= b && b < ROUND_CAP && (k === 0 || a >= allowed[k - 1][0])), `a fight's rounds run from ${longest(1)} (${slowest(1)} at most) at level 1 to ${longest(CAP).toFixed(1)} (${slowest(CAP).toFixed(1)}) at ${CAP}`);
  const wall = fight(companyAt(1, 36), [testMonster('soldier', 1, 2000, 0.01)], 36);
  ok(ROUND_CAP === 15 && wall.broken && !wall.won && wall.rounds === ROUND_CAP, `a fight nobody can finish is broken off after ${ROUND_CAP} rounds (${wall.rounds})`);
  // Six or seven fights between rests to level 10, a fight more every four levels after, and never fifteen.
  const perRest = Array.from({ length: CAP }, (_, k) => fightsPerRest(k + 1));
  ok(perRest[0] === 6.5 && perRest[9] === 6.5 && perRest[CAP - 1] === 12 && perRest.every((f, k) => f < 15 && (k === 0 || f >= perRest[k - 1])), `fights between rests run from ${perRest[0]} at level 1 and ${perRest[9]} at 10 to ${perRest[CAP - 1]} at ${CAP}`);
  // The harness trains as play does, to the road's cap.
  const c = defaultParty(HARNESS, makeRng(32)).members[0];
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
  // And at Act IV's, by its one step at Cinderport's armourer: the floor at 26 wears it and the one at
  // 24 does not (#542).
  ok([24, 26, 28].every((l) => gateCompany(l, 32).members.every((m) => m.level === l)) && gear(26) !== gear(24),
    `the gate's company trains to 24, 26 and 28, and dresses past the one two under it at 26 (${gear(26)})`);
  // And at Act V's, by the Hand's steel at 28 (#746): the floor at 28 wears it and the one at 26 does
  // not, and every member at 28 and over wears a piece of it.
  const steel = GEAR.find(([at]) => at === 28)?.[1] ?? [];
  const wears = (l: number): boolean => gateCompany(l, 32).members.every((m) => [m.equipment.weapon, m.equipment.armor, m.equipment.shield].some((id) => !!id && steel.includes(id)));
  ok([26, 28, 30, 32].every((l) => gateCompany(l, 32).members.every((m) => m.level === l)) && gear(28) !== gear(26) && [28, 30, 32].every(wears),
    `the gate's company trains to 26, 28, 30 and 32, dresses past the one two under it at 28 and wears the Hand's steel from 28 (${gear(28)})`);
  // What a fight costs: all of a fallen member's hit points, and every spell point cast.
  const p = defaultParty(HARNESS, makeRng(33)), fallen = p.members[5];
  const pool = p.members.reduce((a, m) => a + m.maxHp + m.maxSp, 0);
  fallen.hp = -1; addCondition(HARNESS.items, fallen, 'unconscious'); p.members[4].sp -= 3;
  const cost = spent(p).cost;
  ok(Math.abs(cost - (fallen.maxHp + 3) / pool) < 1e-9, `a fallen member costs all of their hit points, a spell its points (${(cost * 100).toFixed(1)}% of the company)`);
  // A company rests once anyone is under a quarter of their hit points, or it is under a quarter of its spell points.
  const whole = defaultParty(HARNESS, makeRng(34)), hurt = structuredClone(whole), dry = structuredClone(whole);
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
  // Past 10 the target grows: a company of 24 fights about ten between rests, in Act III's gear to 22
  // (#535), which it wears till Act IV's step at 25 (#542), the line past 16 made again with it (#541).
  const late = days(24, [standardEncounter('soldier', 24)], 40, 5001);
  ok(Math.abs(late.fights - fightsPerRest(24)) <= 1.5, `a company of level 24 fights ${late.fights.toFixed(1)} encounters of 4 Test Soldiers between rests (${fightsPerRest(24)} asked)`);
  // And through Act III, 16 to 22, about its fights at every level, a fight more every four levels.
  const act = [16, 17, 18, 19, 20, 21, 22].map((l) => ({ l, d: days(l, [standardEncounter('soldier', l)], 40, 5001) }));
  ok(act.every(({ l, d }) => Math.abs(d.fights - fightsPerRest(l)) <= 1.5), `through Act III a company fights about its own of 4 Test Soldiers between rests: ${act.map(({ l, d }) => `${d.fights.toFixed(1)} at ${l} (${fightsPerRest(l)})`).join(', ')}`);
  // And through Act IV, 23 to 27, where it steps at 23 (tier 7), 25 (Cinderport's armourer) and 27
  // (the third prestige), the line from 25 made again with them (#549); and through Act V, 28 to 32,
  // where it steps at 28 into the Hand's steel (#746), the line made again with it at 28, 30 and 32
  // (#752) and at 29 and 31 between them (#793): eleven at 28, rising to twelve at 32.
  const fought = (ls: number[]) => ls.map((l) => ({ l, d: days(l, [standardEncounter('soldier', l)], 40, 5001) }));
  const four = fought([23, 24, 25, 26, 27]), five = fought([28, 29, 30, 31, 32]);
  const near = ({ l, d }: (typeof four)[number]): boolean => Math.abs(d.fights - fightsPerRest(l)) <= 1.5;
  const say = (rows: typeof four): string => rows.map(({ l, d }) => `${d.fights.toFixed(1)} at ${l} (${fightsPerRest(l)})`).join(', ');
  ok(four.every(near), `through Act IV a company fights about its own of 4 Test Soldiers between rests: ${say(four)}`);
  ok(five.every(near), `and through Act V, in the Hand's steel, about its own: ${say(five)}`);
  // A test monster's encounter pays what the curve gives a group at the built areas' pinned pace (docs/MONSTERS.md §4.4).
  const pays = [1, 10, 32].map((l) => Math.round((6 * (xpForLevel(l + 1) - xpForLevel(l))) / (0.75 * groupsPerLevel(l))));
  ok(pays.join() === '99,1573,5093' && xpFor('boss', 10) === 6293, `an encounter pays ${pays.join(', ')} at 1, 10 and 32, as MONSTERS §4.4 says, and a boss four`);
  const boss = measure(bossFloor(8), standardEncounter('boss', 8), 80, 5001);
  ok(boss.won >= 0.3 && boss.won <= 0.7, `a company two levels under the test boss wins ${(boss.won * 100).toFixed(0)}% of the time (half asked)`);
  whatIfsOff();
  artifactsWhatIf();
  onTheLine();
  abilities();
  await newerOnTheLine();
}

/**
 * The what-ifs #865 weighed and kept off, modelled and off (#854): the company's tiers (`--tiers`),
 * the bots' options (`--bot`) and the four newer classes' company (`--company newer`). Off, the
 * company is main's.
 */
function whatIfsOff(): void {
  // With every what-if off the company is main's: the premade six at twelve levels, as main made them at
  // 0463be91 before the tiers came to it, as #865 keeps them (J2).
  const MAIN_SIX = '7e6a61134152748ffac828dcc3d47dbaa7a00e5df03c584054338f7720d24677', sixAt = [1, 5, 10, 11, 12, 13, 19, 24, 25, 27, 28, 32];
  const six = createHash('sha256').update(JSON.stringify(sixAt.map((l) => companyAt(l, 3)))).digest('hex');
  ok(!whatIfs().length && six === MAIN_SIX, `with every what-if off the company is main's: the premade six at ${sixAt.join(', ')} (${six.slice(0, 12)})`);
  // Under --tiers it takes Expert at 13 and Master at 25 on its class's lines, after its prestiges, and
  // nothing else moves; without, it holds none (#852). The newer company takes them as it does.
  const at = [12, 13, 24, 25, 32], bare = at.map((l) => companyAt(l, 3)), newBare = at.map((l) => newerCompany(l, 3));
  const tiers = { tiers: true }, tiered = at.map((l) => companyAt(l, 3, tiers)), newTiered = at.map((l) => newerCompany(l, 3, tiers));
  const owed = (l: number): Tier | undefined => (l >= TIER_LEVELS.master ? 'master' : l >= TIER_LEVELS.expert ? 'expert' : undefined);
  const holds = (p: Party, l: number): boolean => p.members.every((m) => LINES.every((line) => m.tiers?.[line] === (linesOf(m.cls).includes(line) ? owed(l) : undefined)));
  const untiered = (p: Party): string => JSON.stringify(p.members.map((m) => { const c = { ...m }; delete c.tiers; return c; }));
  const none = (ps: Party[]): boolean => ps.every((p) => p.members.every((m) => m.tiers === undefined));
  const said = (p: Party): string => p.members.map((m) => `${m.name} ${LINES.filter((l) => m.tiers?.[l]).map((l) => `${m.tiers?.[l]} ${l}`).join(' and ')}`).join(', ');
  ok(none(bare) && none(newBare) && tiered.every((p, k) => holds(p, at[k]) && untiered(p) === untiered(bare[k])) && newTiered.every((p, k) => holds(p, at[k]) && untiered(p) === untiered(newBare[k])),
    `under --tiers the company takes Expert at 13 and Master at 25 on its class's lines and nothing else moves, at 25 ${said(tiered[3])}; the newer company too (${said(newTiered[3])}); without, none at ${at.join(', ')}`);
  // The newer company is made as the premade six are: the four newer classes in their places, trained,
  // dressed by the ladder and prestiged at 11, 19 and 27, its monk on a staff for its prestige blows as
  // the thief keeps a light blade, and in the Hand's steel from 28.
  const ps = [10, 11, 19, 27].map((l) => newerCompany(l, 3)), monk = (p: Party): Party['members'][number] => p.members[1];
  const steel = GEAR.find(([n]) => n === 28)?.[1] ?? [], wears = (p: Party): boolean => p.members.every((m) => [m.equipment.weapon, m.equipment.armor, m.equipment.shield].some((id) => !!id && steel.includes(id)));
  ok(ps.every((p, k) => p.members.map((m) => m.cls).join() === 'barbarian,monk,paladin,bard,druid,sorcerer' && p.members.every((m) => m.level === [10, 11, 19, 27][k] && prestigeOf(m) === k))
    && ps.slice(1).every((p) => weaponOf(HARNESS.items, monk(p)).kind === 'staff' && blowsOf(HARNESS.items, monk(p)) >= 2) && blowsOf(HARNESS.items, monk(ps[3])) === 3 && wears(newerCompany(28, 3)) && !wears(newerCompany(26, 3)),
    `the newer company is made as the premade six are: ${ps[3].members.map((m) => `${m.name} ${className(m)}`).join(', ')} at 27; its monk on a staff from 11 (${ps.slice(1).map((p) => `${weaponOf(HARNESS.items, monk(p)).name} ${blowsOf(HARNESS.items, monk(p))}`).join(', ')}), and the Hand's steel from 28`);
  // The bots' options reach both bots (#853): under --bot the thrifty bot in `play` and the gate's in its
  // fights bless and sleep against four test soldiers at 13; off, neither does.
  const ALL: BotOpts = { bless: true, sleep: true, drink: true }, soldiers = standardEncounter('soldier', 13);
  const gated = (rules = {}): string[] => {
    const p = gateCompany(13, 1, rules), rng = makeRng(fightSeed(1)), s = startCombat(HARNESS, p, [{ id: 'g', monsters: soldiers }], rng);
    return playOut(s, p, rng, gateBot, rules, ROUND_CAP).log;
  };
  const casts = (log: string[]): number => log.filter((l) => / casts (Bless\.|Slumber:)/.test(l)).length;
  const offPlay = casting(13, soldiers, 10), offGate = casts(gated());
  const bot = { bot: ALL }, onPlay = casting(13, soldiers, 10, 1, bot), onGate = casts(gated(bot));
  ok(onPlay.bless + onPlay.sleep > 0 && onGate > 0 && !offPlay.bless && !offPlay.sleep && !offPlay.drink && !offGate,
    `under --bot the thrifty bot blesses in ${Math.round(onPlay.bless * 10)} and sleeps in ${Math.round(onPlay.sleep * 10)} of 10 fights against four test soldiers at 13 and the gate's casts ${onGate} Blesses and Slumbers in one; off, neither (${offGate})`);
  // A what-if is for weighing: the refusal `--calibrate --write` throws (`writeRefusal`) names each of
  // the three new what-ifs while it is set, and there is none with every what-if off.
  const refused = [writeRefusal(tiers), writeRefusal(bot), writeRefusal({ company: 'newer' })];
  ok(writeRefusal() === undefined && refused.every((r, k) => r?.startsWith('a what-if is for weighing') && r.endsWith(`(${['tiers', 'bot', 'company'][k]})`)),
    `the refusal --calibrate --write throws names --tiers, --bot and --company while each is set, as every what-if (${refused.map((r) => r?.slice(r.indexOf('('))).join(', ')}), and there is none with all off`);
}

/**
 * The bounds' artifacts in the harness's what-if (#847, `--artifacts`): each borne by the first member
 * who may, one in the world, all eight in the premade six, and nothing else moves; off, the company bears none, and the gate's
 * company stays the plain one (#891).
 */
function artifactsWhatIf(): void {
  const all = artifactIds(), at = [28, 30, 32];
  const holds = (p: Party): string => p.members.flatMap((m) => borne(HARNESS.items, m).filter((id) => ITEMS[id].artifact).map((id) => `${m.name} ${id}`)).join(', ');
  const bears = { artifacts: all }, plain = at.map((l) => companyAt(l, 3)), dressed = at.map((l) => companyAt(l, 3, bears)), newer = newerCompany(30, 3, bears);
  // A member who takes one differs from the plain company in what they hold alone.
  const rest = (m: Party['members'][number]): string => JSON.stringify({ ...m, equipment: null, pack: null });
  const still = plain.every((p, k) => p.members.every((m, i) => rest(m) === rest(dressed[k].members[i]) && (holds({ ...p, members: [dressed[k].members[i]] }) !== '' || JSON.stringify(m) === JSON.stringify(dressed[k].members[i]))));
  const off = [...at.map((l) => companyAt(l, 3)), ...at.map((l) => gateCompany(l, 1))].every((p) => holds(p) === '');
  ok(plain.every((p) => holds(p) === '') && dressed.every((p) => holds(p) === 'Bram erzhemd, Bram torhide, Bram hagstone, Idris grims_axe, Wren akkush, Ottilie holdfast, Maren telstok, Maren wakerobe') && still
    && holds(newer) === 'Rook grims_axe, Rook erzhemd, Rook hagstone, Hollis telstok, Hollis wakerobe, Idris torhide, Aveline holdfast' && off,
    `under --artifacts the company bears each artifact on the first member who may and nothing else moves, at ${at.join(', ')} ${holds(dressed[1])}; the newer company ${holds(newer)}, with no ranger for Akkush; off, and in the gate's company, none`);
  // Dressed, the company is no weaker than plain in the same seeded fights at 30, and Holdfast's bearer,
  // who strikes nothing from her row, casts its charges: the bot weighs an artifact's hold whatever `--bot` asks.
  const fights = [...['deep_knocker', 'inspector', 'hearth_moth', 'ashen_champion', 'ashen_preacher', 'deep_rat'].map((id) => [id, id, id]), ['tallymaster'], ['grey_lion'], ['vask']];
  const weigh = (arts: readonly string[] | undefined): { won: number; cost: number; roots: number } => {
    const rules = { artifacts: arts };
    let won = 0, cost = 0, roots = 0;
    for (let k = 1; k <= 20; k++) {
      const p = companyAt(30, k, rules), s = play(p, fights[k % fights.length], k * 7919 + 13, undefined, rules), o = outcomeOf(s, p);
      won += o.won ? 1 : 0; cost += o.cost; roots += s.log.filter((l) => l.startsWith(`${p.members[3].name} casts Grasping Roots`)).length;
    }
    return { won, cost, roots };
  };
  const bare = weigh(undefined), knife = weigh(['holdfast']), every = weigh(all);
  ok(knife.won >= bare.won && every.won >= bare.won && knife.cost <= bare.cost && every.cost <= bare.cost && knife.roots > 0 && every.roots > 0,
    `in 20 seeded fights at 30 the dressed company is no weaker than the plain: ${bare.won}, ${knife.won} with Holdfast and ${every.won} with all eight won, at ${bare.cost.toFixed(2)}, ${knife.cost.toFixed(2)} and ${every.cost.toFixed(2)} of its hit points; Ottilie casts Grasping Roots ${knife.roots} and ${every.roots} times`);
  const refused = writeRefusal(bears);
  ok(!!refused?.startsWith('a what-if is for weighing') && refused.endsWith('(artifacts)'), `and the refusal --calibrate --write throws names --artifacts while it is set (${refused?.slice(refused.indexOf('('))})`);
}

/**
 * The four newer classes' company on the line (#854, EXPANSION §5.2): at 12, 20, 28 and 32, each regular
 * role's standard encounter, 100 seeds on every core: its fights to a rest inside GATE.perRest's limit of
 * fightsPerRest, and its fights from fresh at its own level, the floor, won as GATE.through's limit asks.
 * A boss is judged by its odds from two under, not by a day. Off its aim a line passes and is listed;
 * past its limit, a class is broken, which is the owner's to rule on (#18's ruling, J4), not a check's to bend.
 */
async function newerOnTheLine(): Promise<void> {
  const levels = [12, 20, 28, 32], roles = ROLE_IDS.filter((r) => r !== 'boss');
  const cells = await cellsOnCores(roles, levels, 100, 0, 600_000, { company: 'newer' });
  const [under, over] = GATE.perRest.limit, [below, above] = GATE.perRest.aim, pc = (x: number): string => `${Math.round(x * 100)}%`;
  levels.forEach((l, k) => {
    const asked = fightsPerRest(l), rows = roles.map((r, i) => ({ r, d: cells[i * levels.length + k].day!, won: cells[i * levels.length + k].fresh.won }));
    const past = rows.filter(({ d, won }) => d.fights < asked - under || d.fights > asked + over || won < GATE.through.limit);
    const off = rows.filter((x) => !past.includes(x) && (x.d.fights < asked - below || x.d.fights > asked + above || x.won < GATE.through.aim));
    const say = (xs: typeof rows): string => xs.map(({ r, d, won }) => `${r} ${d.fights.toFixed(1)}${won < GATE.through.aim ? ` won ${pc(won)}` : ''}`).join(', ');
    ok(!past.length, `the four newer classes' company at ${l} fights ${say(rows)} to a rest (${asked} asked, ${asked - under} to ${asked + over} its limit), and wins ${pc(Math.min(...rows.map((x) => x.won)))} of each at the floor or more (${pc(GATE.through.limit)} its limit)${off.length ? `; off the aim: ${say(off)}` : ''}${past.length ? `; past the limit: ${say(past)}` : ''}`);
  });
  // A worker that dies, or runs past the limit it is given, fails the lot (`onCores`) and the others
  // stop, so a run fails rather than hangs on one.
  const failed = (p: Promise<unknown>): Promise<string> => p.then(() => 'played', (e: unknown) => (e instanceof Error ? e.message : String(e)));
  const dies = await failed(cellsOnCores(['nobody' as Role], [12], 1)), stalls = await failed(cellsOnCores(['soldier', 'brute'], [32], 100, 0, 1));
  ok(dies !== 'played' && /^a worker ran past 1 ms on cell (soldier|brute) at 32$/.test(stalls), `a worker that dies fails the lot (${dies.slice(0, 50)}), and one past its limit (${stalls})`);
}

/**
 * Why a monster past Act I is set off the line on purpose (MONSTERS §4.4): its own word on its def
 * (`MonsterDef.offLine`), with the issue that tuned it. Every other monster of level 11 or more stands
 * on the line at its level: some role's test monster's hit points and blow, the test troll's (#537),
 * giant's or drake's (#545) or a role's come down whole by a share it names (`wholeOf`). So when the
 * line is made again a monster left on the old one fails until it is re-derived.
 */
export const offLineOf = (id: string): string | undefined => {
  const own = MONSTERS[id]?.offLine;
  return typeof own === 'string' ? own : undefined;
};
/** The role, the share and why a monster past 10 on a role's line comes down whole, hit points and blow together (MONSTERS §4.4): its own (`MonsterDef.offLine`). */
export const wholeOf = (id: string): { role: Role; share: number; why: string } | undefined => {
  const own = MONSTERS[id]?.offLine;
  return typeof own === 'object' ? { ...own, role: own.role as Role } : undefined;
};
/**
 * The monsters drawn on the line before #549 made 25 to 28 again, and placed in no box yet: each is
 * re-derived on the line by the box that places it, since a def is its box's (MONSTERS §4.4), and
 * leaves this list then.
 */
export const RESTATE: Record<string, string> = {};

/** Every monster past 10 on the line at its level, or set off it with a reason (`offLineOf`). */
function onTheLine(): void {
  const blow = (m: Pick<MonsterDef, 'dice' | 'sides' | 'bonus'>): number => (m.dice * (m.sides + 1)) / 2 + m.bonus;
  /** The shapes a monster of its level may stand on: each role's line, the test troll's and the share it comes down whole by (`wholeOf`). */
  const shapes = (m: MonsterDef): MonsterDef[] => {
    const w = wholeOf(m.id), l = m.level;
    return [...ROLE_IDS.map((r) => testMonster(r, l)), testTroll(l), testGiant(l), testDrake(l), ...(w ? [testMonster(w.role, l, scaleAt(HP, w.role, l) * w.share, scaleAt(DAMAGE, w.role, l) * w.share)] : [])];
  };
  const on = (m: MonsterDef): boolean => shapes(m).some((t) => t.hp === m.hp && Math.abs(blow(t) - blow(m)) <= 0.5 && (t.regen ?? 0) === (m.regen ?? 0) && (t.sweep?.chance ?? 0) === (m.sweep?.chance ?? 0) && t.sweep?.element === m.sweep?.element);
  const past = Object.values(MONSTERS).filter((m) => m.level > 10), set = past.filter((m) => offLineOf(m.id) || RESTATE[m.id]);
  const off = past.filter((m) => !offLineOf(m.id) && !RESTATE[m.id] && !on(m)).map((m) => {
    const near = shapes(m).sort((a, b) => Math.abs(a.hp - m.hp) - Math.abs(b.hp - m.hp))[0];
    return `${m.id} at ${m.level}, ${m.hp} / ${blow(m)}, where the nearest is ${near.name} ${near.hp} / ${blow(near)}`;
  });
  ok(!off.length, `every monster past 10 stands on the line at its level, its hit points and its blow, or is set off it with a reason: ${past.length - set.length} on it, ${set.length} set off it${off.length ? ` (off it: ${off.join('; ')})` : ''}`);
  const own = Object.values(MONSTERS).filter((m) => m.offLine).map((m) => m.id);
  const stale = [...own, ...Object.keys(RESTATE)].filter((id) => !MONSTERS[id] || MONSTERS[id].level <= 10 || ((offLineOf(id) || RESTATE[id]) && on(MONSTERS[id])));
  ok(!stale.length, `and every monster set off it, come down whole or owed a restating is a monster past 10, and one set off it or owed is off it${stale.length ? ` (not: ${stale.join(', ')})` : ''}`);
  // One owed a restating is placed in no box: the box that places it restates it (#549).
  const placed = new Set(MAP_DEFS.flatMap((d) => (d.encounters ?? []).flatMap((g) => g.monsters)));
  const owedPlaced = Object.keys(RESTATE).filter((id) => placed.has(id));
  ok(!owedPlaced.length, `and none owed a restating is placed in a box yet (${Object.keys(RESTATE).length} owed${owedPlaced.length ? `; placed: ${owedPlaced.join(', ')}` : ''})`);
  // It can fail: a soldier a few hit points short, a troll mending four too few, a giant sweeping
  // twice as often and a light seven too many are each caught; on the line they pass.
  const soldier = testMonster('soldier', 19), troll = testTroll(19), share = wholeOf('bog_light')!, light = MONSTERS.bog_light;
  const lit = testMonster(share.role, light.level, scaleAt(HP, share.role, light.level) * share.share, scaleAt(DAMAGE, share.role, light.level) * share.share);
  const giant = testGiant(23), probes = [{ ...soldier, hp: soldier.hp - 5 }, { ...troll, regen: (troll.regen ?? 0) - 4 }, { ...light, hp: lit.hp + 7 }, { ...giant, sweep: { chance: 0.5 } }];
  ok(probes.every((m) => !on(m)) && [soldier, troll, giant, { ...light, hp: lit.hp, dice: lit.dice, sides: lit.sides, bonus: lit.bonus }].every(on), 'and a monster left off it is caught: a soldier five hit points short, a troll mending four too few, a giant sweeping twice as often and a light seven too many');
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
 * growing; three lights and a hound at 19, the lights felled first; and Act IV's sweep (#545), two
 * giants at 23 and two drakes at 25, and stone (#546), the mesa at 27.
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
  addCondition(HARNESS.items, marked.members[0], 'cursed');
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
  // The sweep (#545), sized against a row's hit points: the test giant is the brute come down whole,
  // sweeping a turn in four, so one sweep at its worst takes a third of the front row's least; and a
  // company fights about as many pairs of giants at 23, or of drakes at 25, to a rest as of brutes.
  const blow = (m: MonsterDef): number => (m.dice * (m.sides + 1)) / 2 + m.bonus;
  const giant = testGiant(23), whole = testMonster('brute', 23, scaleAt(HP, 'brute', 23) * SWEEP.share, scaleAt(DAMAGE, 'brute', 23) * SWEEP.share);
  const worst = giant.dice * giant.sides + giant.bonus, least = Math.min(...companyAt(23, 1).members.slice(0, 3).map((m) => m.maxHp));
  ok(giant.hp === whole.hp && blow(giant) === blow(whole) && giant.sweep?.chance === SWEEP.chance && !giant.sweep.element && testDrake(25).sweep?.element === 'fire' && worst * 2 < least,
    `the test giant at 23 is the test brute come down whole to ${SWEEP.share}, ${giant.hp} / ${blow(giant)}, sweeping at ${SWEEP.chance} a turn, one sweep at its worst ${worst} to each of a front row whose least has ${least}; the drake breathes fire`);
  for (const [l, enc, what] of [[23, giantEncounter(23), 'giants'], [25, drakeEncounter(25), 'drakes']] as const) {
    const b = bout(l, enc, 40, 5001), day = days(l, [enc], 40, 5001), brutes = days(l, [standardEncounter('brute', l)], 40, 5001);
    ok(b.won >= 0.95 && Math.abs(day.fights - brutes.fights) <= 1.5, `a company of ${l} wins ${pc(b.won)} of two ${what}' fights, ${b.rounds.toFixed(1)} rounds for ${(b.cost * 100).toFixed(1)}% of itself, and fights ${day.fights.toFixed(1)} of them to a rest, about as many as of plain brutes (${brutes.fights.toFixed(1)}; ${fightsPerRest(l)} asked)`);
  }
  // Stone (#546), at the mesas' 27: the test basilisk is the test controller whole, its hold a stone
  // and its gaze reaching the back row. The company wins the mesa, lifts the stone between fights and
  // fights a fight or two fewer to a rest than where the hold paralyses; with no cure it rests at the first.
  const basilisk = testBasilisk(27), controller = testMonster('controller', 27);
  ok(basilisk.hp === controller.hp && blow(basilisk) === blow(controller) && basilisk.inflict?.cond === 'stoned' && basilisk.inflict.chance === BASILISK_STONE && basilisk.ranged === true,
    `the test basilisk at 27 is the test controller, ${basilisk.hp} / ${blow(basilisk)}, its hold a stone at ${BASILISK_STONE} a hit and its gaze reaching the back row`);
  const mesa = basiliskEncounter(27), held = mesa.map((m): MonsterDef => (m.inflict?.cond === 'stoned' ? { ...m, inflict: { cond: 'paralysed', chance: BASILISK_STONE } } : m));
  const mb = bout(27, mesa, 40, 5001), glassed = mb.fights.filter(({ p }) => p.members.some((m) => hasCondition(m, 'stoned'))).length;
  const sday = days(27, [mesa], 40, 5001), pday = days(27, [held], 40, 5001);
  // On the line made again at 27 (#549) the mesa is fought about as many times as asked, no longer more.
  ok(mb.won >= 0.95 && glassed >= 2 && sday.fights < pday.fights && sday.fights > pday.fights - 2.5 && Math.abs(sday.fights - fightsPerRest(27)) <= 1.5,
    `a company of 27 wins ${pc(mb.won)} of the mesa's fights, ${glassed} of 40 leaving someone glassed, and lifting the stone between fights it fights ${sday.fights.toFixed(1)} of them to a rest, where the hold paralysing it fights ${pday.fights.toFixed(1)}: stone costs it up to a fight or two, and leaves about what is asked (${fightsPerRest(27)})`);
  // Between fights it lifts stone (`unstone`) by Absolve while a member standing has it and the
  // points, and keeps its draught; by the draught, carried from 25, when all who know Absolve are
  // glassed, the first lifted then absolving the next; with neither they wait for a temple, and the
  // company must rest.
  const draughts = (p: Party): number => p.bag.filter((id) => id === 'quickening').length, points = (p: Party): number => p.members.reduce((t, m) => t + m.sp, 0);
  const glass = (knowers: boolean): { p: Party; who: Party['members']; sp: number } => {
    const p = companyAt(27, 1), who = knowers ? p.members.filter((m) => m.spells.includes('absolve')) : [p.members[0]];
    for (const m of who) addCondition(HARNESS.items, m, 'stoned');
    return { p, who, sp: points(p) };
  };
  const byAbsolve = glass(false), byDraught = glass(true), stranded = glass(true);
  stranded.p.bag = stranded.p.bag.filter((id) => id !== 'quickening');
  for (const x of [byAbsolve, byDraught, stranded]) mendBetween(x.p);
  const flesh = (x: { who: Party['members'] }): boolean => x.who.every((m) => !hasCondition(m, 'stoned'));
  ok(draughts(companyAt(24, 1)) === 0 && draughts(companyAt(25, 1)) === 1 && byDraught.who.length >= 1
    && flesh(byAbsolve) && points(byAbsolve.p) === byAbsolve.sp - spell('absolve').sp && draughts(byAbsolve.p) === 1
    && flesh(byDraught) && draughts(byDraught.p) === 0 && mustRest(byDraught.p) === null
    && stranded.who.every((m) => hasCondition(m, 'stoned')) && mustRest(stranded.p) === 'dead',
    `between fights the company lifts stone by Absolve, keeping its draught; by the draught it carries from 25 when all ${byDraught.who.length} who know Absolve are glassed; and with neither rests for a temple`);
  const bare = (p: Party): Party => { for (const c of p.members) c.spells = c.spells.filter((id) => id !== 'absolve'); p.bag = p.bag.filter((id) => id !== 'quickening'); return p; };
  const cureless = Array.from({ length: 40 }, (_, n) => oneDay(27, [mesa], 5001 + n, 30, bare)).reduce((t, d) => t + d.fights, 0) / 40;
  ok(cureless < sday.fights - 2, `with neither Absolve nor a draught it fights ${cureless.toFixed(1)} of the mesa's fights to a rest, where with them ${sday.fights.toFixed(1)}`);
  // The bots free the held as they wake a sleeper (#549): one of the front row first, then a caster,
  // by the cheapest cure the member knows; with the answer off a hold is left to break of itself.
  const bells = companyAt(24, 1), cleric = bells.members.find((m) => m.cls === 'cleric')!, back = bells.members.findIndex((m, j) => j >= FRONT_ROW && m.maxSp > 0);
  addCondition(HARNESS.items, bells.members[back], 'paralysed');
  const casterFirst = wakeWith(bells, cleric);
  addCondition(HARNESS.items, bells.members[1], 'paralysed');
  const frontFirst = wakeWith(bells, cleric);
  const unanswered = wakeWith(bells, cleric, { ...ANSWER, hold: false });
  ok(casterFirst?.target === back && frontFirst?.target === 1 && spell(frontFirst.spellId).cure?.includes('paralysed') === true && !unanswered,
    `the bots free the held, one of the front row before a caster, by ${frontFirst ? spell(frontFirst.spellId).name : 'nothing'}, and leave a hold with the answer off`);
  // While a foe breathes they raise one of the front row fallen first (`breathGuard`): with it down
  // the breath takes the back row, which has more standing; an arm's sweep asks nothing of it.
  const ring = (enc: MonsterDef[]): { s: CombatState; p: Party } => {
    const p = companyAt(25, 1), s = startCombat(HARNESS, p, [{ id: 'h', monsters: enc }], makeRng(5));
    p.members[0].hp = -1; addCondition(HARNESS.items, p.members[0], 'unconscious');
    return { s, p };
  };
  const breath = ring(drakeEncounter(25)), arm = ring(giantEncounter(25)), drake = breath.s.monsters[0];
  const turned = sweptRow(breath.p, drake).every(({ i }) => i >= FRONT_ROW), guarded = breathGuard(breath.s, breath.p);
  breath.p.members[0].hp = 1; breath.p.members[0].conditions = breath.p.members[0].conditions.filter((k) => k !== 'unconscious');
  ok(turned && guarded === 0 && breathGuard(arm.s, arm.p) === undefined && sweptRow(breath.p, drake).every(({ i }) => i < FRONT_ROW) && breathGuard(breath.s, breath.p) === undefined,
    `while a drake stands the bots raise the front row's fallen first (slot ${guarded}): the breath it turned on the back row takes the front again, and a giant's arm asks nothing`);
  // The Core's clock (#748): the Heart on the test monsters the plan sizes it by, at 32. Its calls
  // stand in one group and stop at twelve; Vask's odds are the gate's bot's, as the plan judges them.
  const heart = clockEncounter(32), fs = bout(32, heart, 40, 5001), still = { ...heart, clock: undefined };
  const crowd = Math.max(...fs.fights.map(({ s }) => s.monsters.length)), bands = Math.max(...fs.fights.map(({ s }) => s.groupIds.length));
  const odds = (['panel', 'leader', 'called'] as const).map((k) => winRate(32, heart, 100, Infinity, {}, { answer: { ...ANSWER, clock: k } }));
  const unclocked = winRate(32, still, 100);
  ok(crowd <= MAX_MONSTERS && bands === 2 && odds.every((x) => x < unclocked),
    `at the Heart the clock's calls stand in one group, ${crowd} monsters at most; the gate's bot wins ${pc(odds[0])} killing the Hands first, ${pc(odds[1])} going for the lord and ${pc(odds[2])} fighting the sentries as they come, against ${pc(unclocked)} with no clock (the plan asks two in three with the Hands first and a quarter to a third with the clock let run, on the sentries at 890)`);
}
