// The weapon and magic tiers (game/mastery.ts; DESIGN §5, #852): what each does, through the blow and
// the cast themselves, for a fighter, a caster and a hybrid; the bars; the town trainers that teach
// Expert by their ceiling and the two that do not; Saltmouth's Sail Loft walked as a player meets it;
// a Master's person (a fixture built here, as the two the content places are, #858 and #859); the sheet's
// lines; what no tier touches (a spell's cost, a buff's rounds, a cure, a sleep); saves; the words in
// the font; and the pilot's keep at the Sail Loft, which trains there and never opens the tier menu.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { makeRng } from '../../src/lib/engine/rng.ts';
import { FONT_CHARS, measureText } from '../../src/lib/engine/text.ts';
import { defaultParty, attackBonus, armsBonus, tierSteps, rankMult, spellHeal, levelUp, xpForLevel, trainPrice, CLASSES, RANK_STEP, NAME_MAX } from '../../src/game/party.ts';
import type { Party, ClassId } from '../../src/game/party.ts';
import { World } from '../../src/game/world.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { serialize, deserialize, SAVE_VERSION } from '../../src/game/save.ts';
import { startCombat, currentTurn, partyAct, monsterAct } from '../../src/game/combat.ts';
import type { PartyAction, CombatState } from '../../src/game/combat.ts';
import { elementMult } from '../../src/game/monsters.ts';
import type { MonsterDef } from '../../src/game/monsters.ts';
import { SPELLS } from '../../src/content/spells.ts';
import { MAP_DEFS, AREAS, TABLES } from '../../src/content/index.ts';
import type { Feature } from '../../src/game/mapdef.ts';
import type { Game } from '../../src/app/game.ts';
import { ChoiceScreen, InteriorScreen, TRADE, businessEntries, weaponLine, spellsLine } from '../../src/ui/screens.ts';
import { optionParts, columnLabelWidth } from '../../src/ui/draw.ts';
import { SIDE_W } from '../../src/ui/frame.ts';
import { talk } from '../../src/app/pilot/talk.ts';
import { Pilot } from '../../src/app/pilot/pilot.ts';
import { keep } from '../../src/app/pilot/keep.ts';
import { trainsTo } from '../../src/app/pilot/known.ts';
import { NORTH } from '../../src/game/types.ts';
import type { Action } from '../../src/app/input.ts';
import {
  TIERS, LINES, TIER_LEVELS, TIER_PRICES, EXPERT_FROM, EXPERT_ENTRY, LINE_ROWS, TIER_NAMES, LINE_NAMES, linesOf, tierOf, tierBar, expertOffers, masterOffers,
  tierLine, teachTier, teachesExpert, askLine, askTier, noneHere, favourDone, LEAVE_TIERS,
} from '../../src/game/mastery.ts';
import type { Tiers, Line, Mastery } from '../../src/game/mastery.ts';
import { ok, fxFlag } from './lib.ts';
import { headlessGame, drive } from '../kit/headless.ts';

/** The town trainers that teach Expert (ceiling 13 or over) and those that do not, written out and not read from the rule. */
const TEACH = ['The Sail Loft', 'The Lamp Gallery', 'The Old Working', 'The Ore Shed', "The Trainers' Yard", 'The Ash Yard', "The Sergeant's Tent"];
const NOT = ['Warden Drillyard', "The Elder's Yard"];
type Trainer = Extract<Feature, { kind: 'trainer' }>;
type Person = Extract<Feature, { kind: 'npc' }>;

/** A company of the premade six, the first made `cls` at `level` with `tiers`, rich and whole. */
function company(cls: ClassId, level: number, tiers?: Tiers, seed = 7): Party {
  const rng = makeRng(seed), p = defaultParty(TABLES, rng), c = p.members[0];
  c.cls = cls; c.xp = xpForLevel(level); levelUp(TABLES.spells, c, rng);
  if (tiers) c.tiers = tiers;
  for (const m of p.members) { m.hp = m.maxHp; m.sp = m.maxSp; }
  p.gold = 20000;
  return p;
}

/** A monster nothing misses and nothing kills in a turn, slow so the company moves first. */
const DUMMY: MonsterDef = { ...AREAS.flatMap((a) => a.monsters).find((m) => m.level === 1)!, ac: -40, hp: 5000, speed: 0 };

/** One fight on one seed: the company's turns pass until the first member's comes, which does `act`; the state after. */
function turn(p: Party, act: PartyAction, seed: number): CombatState {
  const rng = makeRng(seed), s = startCombat(TABLES, p, [{ id: 'test', monsters: [DUMMY] }], rng, { crits: false, feats: false });
  for (let n = 0; n < 40; n++) {
    const t = currentTurn(s, p, rng);
    if (!t) break;
    if (t.side === 'monster') { monsterAct(s, p, rng); continue; }
    if (t.i === 0) { partyAct(s, p, rng, act); break; }
    partyAct(s, p, rng, { type: 'defend' });
  }
  return s;
}

/** What the first member's first blow deals the dummy on a seed, as the log says it. */
const firstBlow = (p: Party, seed: number): number => Number(turn(p, { type: 'attack', target: 0 }, seed).log.map((l) => / hits .* for (\d+)\./.exec(l)).find(Boolean)?.[1] ?? NaN);

export function mastery(): void {
  effects();
  bars();
  trainers();
  loft();
  master();
  sheet();
  untouched();
  saves();
  words();
  fits();
  pilot();
  talked();
}

/** Arms: +1 and +1, +2 and +2 in all, through the blow; magic: a rank's step and two in the ranks the cast reads, a hybrid's half. */
function effects(): void {
  const none: Tiers = {}, expert = (line: Line): Tiers => ({ [line]: 'expert' }), master = (line: Line): Tiers => ({ [line]: 'master' });
  // A fighter's and a hybrid's to-hit and blow, on ten seeds each: the same rolls, the tier's term on top.
  for (const cls of ['knight', 'paladin'] as const) {
    const at = (t: Tiers): Party => company(cls, 20, t);
    const hit = [none, expert('arms'), master('arms')].map((t) => attackBonus(TABLES.items, at(t).members[0]));
    const blows = [none, expert('arms'), master('arms')].map((t) => Array.from({ length: 10 }, (_, k) => firstBlow(at(t), 100 + k)));
    // A seed whose blow misses at the cap misses in all three: the same roll on the same chance.
    const steps = blows[0].every((d, k) => (Number.isNaN(d) ? Number.isNaN(blows[1][k]) && Number.isNaN(blows[2][k]) : d > 0 && blows[1][k] === d + 1 && blows[2][k] === d + 2)) && blows[0].filter((d) => d > 0).length >= 6;
    ok(hit[1] === hit[0] + 1 && hit[2] === hit[0] + 2 && steps && armsBonus(at(none).members[0]) === 0,
      `a ${cls}'s Expert at arms hits at +1 and deals +1 a blow, its Master +2 and +2, not +3 (to-hit ${hit.join(', ')}; first blows ${blows.map((b) => b.slice(0, 4).join('/')).join(' | ')})`);
    const magic = at(master('magic')), blow = firstBlow(magic, 100);
    ok(attackBonus(TABLES.items, magic.members[0]) === hit[0] && armsBonus(magic.members[0]) === 0 && blow === blows[0][0], `a ${cls}'s tier in magic adds nothing at arms (to-hit ${attackBonus(TABLES.items, magic.members[0])}, a blow ${blow})`);
  }
  // A caster's and a hybrid's ranks, and a damage spell cast at the dummy on twenty seeds: each roll lifted by the ranks' multiplier.
  for (const cls of ['druid', 'ranger'] as const) {
    const half = cls === 'ranger' ? 0.5 : 1, at = (t: Tiers): Party => company(cls, 24, t);
    const mult = [none, expert('magic'), master('magic')].map((t) => rankMult(at(t).members[0]));
    const want = [0, 1, 2].map((n) => 1 + RANK_STEP * half * n);
    const heal = [none, master('magic')].map((t) => spellHeal(TABLES.items, at(t).members[0], 20));
    const sp = SPELLS.find((s) => s.list === CLASSES[cls].spells && s.dice && s.context !== 'explore' && !s.glass && elementMult(DUMMY, s.element) === 1)!;
    const cast = (t: Tiers, seed: number): { lost: number; spent: number } => {
      const p = at(t), c = p.members[0];
      c.spells = [sp.id]; c.sp = c.maxSp = 999;
      const s = turn(p, { type: 'cast', spellId: sp.id, target: 0 }, seed);
      return { lost: DUMMY.hp - s.monsters[0].hp, spent: 999 - c.sp };
    };
    const runs = Array.from({ length: 20 }, (_, k) => [none, expert('magic'), master('magic')].map((t) => cast(t, 300 + k)));
    const lifted = runs.every(([a, b, c]) => a.lost > 0 && b.lost === Math.round(a.lost * mult[1]) && c.lost === Math.round(a.lost * mult[2]) && a.spent === sp.sp && b.spent === sp.sp && c.spent === sp.sp);
    ok(mult.every((m, i) => Math.abs(m - want[i]) < 1e-9) && tierSteps(at(master('magic')).members[0]) === 2 && heal[1] === Math.round(20 * mult[2]) - Math.round(20 * mult[0]) + heal[0] && lifted,
      `a ${cls}'s Expert in magic casts at ${want[1]} and its Master at ${want[2]}: ${sp.name}'s rolls lifted so at the same cost, mending likewise (${runs.slice(0, 3).map((r) => r.map((x) => x.lost).join('/')).join(' | ')})`);
    if (cls === 'ranger') {
      const arms = at(master('arms')).members[0];
      ok(attackBonus(TABLES.items, arms) === attackBonus(TABLES.items, at(none).members[0]) + 2 && rankMult(arms) === mult[0], 'a hybrid takes both lines: its Master at arms is the fighter\'s +2, and lifts no spell');
    }
  }
}

/** Why not, in each case, at a trainer's Expert and at a Master's. */
function bars(): void {
  const p = company('knight', 13), c = p.members[0], bar = (line: Line, tier: 'expert' | 'master', favour = true): string => tierBar(line, tier, TIER_PRICES[tier], c, p, favour);
  const cases: [string, string, string][] = [];
  const note = (what: string, got: string, want: string): void => { cases.push([what, got, want]); };
  note('a knight in magic', bar('magic', 'expert'), 'not theirs');
  note('a knight of 13 at arms', bar('arms', 'expert'), '');
  c.level = 12; note('at 12', bar('arms', 'expert'), 'level 13'); c.level = 13;
  p.gold = 1999; note('with 1999 gold', bar('arms', 'expert'), 'no gold'); p.gold = 20000;
  note('a Master with no Expert', bar('arms', 'master'), 'Expert first');
  c.tiers = { arms: 'expert' };
  note('Expert again', bar('arms', 'expert'), 'taken');
  note('a Master at 13', bar('arms', 'master'), 'level 25');
  c.level = 25;
  note('a Master at 25, the favour not done', bar('arms', 'master', false), 'favour first');
  note('a Master at 25, the favour done', bar('arms', 'master'), '');
  c.tiers = { arms: 'master' };
  note('Expert to a Master', bar('arms', 'expert'), 'taken');
  note('Master again', bar('arms', 'master'), 'taken');
  const wrong = cases.filter(([, got, want]) => got !== want);
  ok(!wrong.length, `the bars: ${cases.map(([w, g]) => `${w}: ${g || 'taught'}`).join('; ')}${wrong.length ? ' -> wrong: ' + wrong.map(([w, g, x]) => `${w} said "${g}", not "${x}"`).join('; ') : ''}`);
  ok(linesOf('knight').join() === 'arms' && linesOf('monk').join() === 'arms' && linesOf('sorcerer').join() === 'magic' && linesOf('cleric').join() === 'magic' && linesOf('bard').join() === 'arms,magic' && linesOf('paladin').join() === 'arms,magic',
    'fighters take arms, casters magic and hybrids both');
  const was = p.gold, refused = teachTier('magic', 'expert', TIER_PRICES.expert, p, 0);
  ok(!refused.taught && p.gold === was && tierOf(c, 'magic') === undefined, 'nothing is taught, and nothing paid, where a bar stands');
}

/** Every town trainer of the content: the Expert entry where it trains to 13 or past, and none at the two under it. */
function trainers(): void {
  const g = headlessGame(4), all = MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => (f.kind === 'trainer' ? [{ map: d.id, f }] : [])));
  const got = all.map(({ map, f }) => ({ map, name: f.name, max: f.maxLevel, has: businessEntries(g, f).some((e) => e.label === EXPERT_ENTRY) }));
  const unnamed = got.filter((t) => !TEACH.includes(t.name) && !NOT.includes(t.name));
  ok(!unnamed.length, `every town trainer is written out here as one that teaches Expert or one that does not${unnamed.length ? ' -> not: ' + unnamed.map((t) => `${t.name} (${t.map})`).join(', ') : ''}`);
  const wrong = got.filter((t) => t.has !== TEACH.includes(t.name) || t.has !== teachesExpert(t.max));
  ok(!wrong.length && TEACH.every((n) => got.some((t) => t.name === n && t.has)) && NOT.every((n) => got.some((t) => t.name === n && !t.has)) && EXPERT_FROM === 13,
    `the seven trainers of 13 and over teach Expert (${got.filter((t) => t.has).map((t) => `${t.name} ${t.max}`).join(', ')}) and Harrow's Drillyard and Thornhold's Elder's Yard do not (${got.filter((t) => !t.has).map((t) => `${t.name} ${t.max}`).join(', ')})`);
}

type Kind = 'ChoiceScreen' | 'MessageScreen' | string;
const kindOf = (g: Game): Kind => g.top.constructor.name;
const options = (g: Game): string[] => (g.top instanceof ChoiceScreen ? g.top.options : []);
const wordsOf = (g: Game): string => (g.top instanceof ChoiceScreen ? g.top.words : kindOf(g) === 'MessageScreen' ? (g.top as unknown as { text: string }).text : kindOf(g));
const downTo = (row: number): Action[] => Array.from({ length: Math.max(0, row) }, (): Action => 'down');
/** Stepped in on a business's door and the keeper heard out: the screen that greets the company. */
function enter(g: Game, map: string, f: Trainer): void {
  while (g.screens.length > 1) g.pop();
  g.world.travel(map, f.x, f.y, 0);
  g.enterCell();
  for (let i = 0; i < 4 && kindOf(g) === 'MessageScreen'; i++) drive(g, ['interact']);
}
const leave = (g: Game): Kind => { for (let i = 0; i < 8 && g.screens.length > 1; i++) drive(g, ['cancel']); return kindOf(g); };
const trainerAt = (map: string): Trainer => MAP_DEFS.find((d) => d.id === map)!.features!.find((f): f is Trainer => f.kind === 'trainer')!;

/**
 * Saltmouth's Sail Loft as a player meets it: the first menu, "Expert at arms and in magic", the line,
 * then the members; a knight of 13 buys Expert at arms and a druid of 13 Expert in magic, 2,000 each,
 * and each hits or casts as decided after. Harrow's Drillyard has no such entry.
 */
function loft(): void {
  const g = headlessGame(4), p = g.party, rng = makeRng(5);
  const knight = p.members.findIndex((m) => linesOf(m.cls).join() === 'arms'), caster = p.members.findIndex((m) => linesOf(m.cls).join() === 'magic');
  for (const i of [knight, caster]) { p.members[i].xp = xpForLevel(13); levelUp(TABLES.spells, p.members[i], rng); }
  p.gold = 5000;
  const k = p.members[knight], d = p.members[caster], hitWas = attackBonus(TABLES.items, k), multWas = rankMult(d);
  const loftF = trainerAt('saltmouth');
  enter(g, 'saltmouth', loftF);
  const first = options(g), row = first.indexOf(EXPERT_ENTRY);
  drive(g, [...downTo(row), 'interact']);
  const ask = wordsOf(g), lines = options(g);
  drive(g, ['interact']);
  const who = wordsOf(g), arms = options(g);
  drive(g, [...downTo(knight), 'interact']);
  const after = options(g), told = g.log[g.log.length - 1], gold1 = p.gold;
  drive(g, ['cancel']);
  const purse = wordsOf(g);
  drive(g, ['down', 'interact']);
  const magic = options(g);
  drive(g, [...downTo(caster), 'interact']);
  const told2 = g.log[g.log.length - 1], gold2 = p.gold;
  drive(g, ['cancel', 'cancel']);
  const back = options(g), out = leave(g);
  ok(first[0] === TRADE.trainer && row === 1 && first.at(-1) === 'Leave' && ask === '"Arms, or magic?" (5000 gold.)' && lines.join() === 'At arms,In magic,Leave',
    `at the Sail Loft the first menu has "${EXPERT_ENTRY}" after the trade, which asks the line first (${first.join(' / ')}; ${ask} ${lines.join(' / ')})`);
  ok(who === '"Who would be Expert?" (5000 gold.)' && arms.length === 7 && arms[knight] === `${k.name}\t2000g` && arms[caster] === `${d.name}\tnot theirs`
      && arms.slice(0, 6).filter((_r, i) => i !== knight && i !== caster).every((r) => r.endsWith('\tlevel 13') || r.endsWith('\tnot theirs')) && arms[6] === 'Leave',
    `then each member with the price or why not (${arms.slice(0, 6).map((r) => r.replace('\t', ' ')).join('; ')})`);
  ok(gold1 === 3000 && tierOf(k, 'arms') === 'expert' && told === `${k.name} is Expert at arms now.` && after[knight] === `${k.name}\ttaken` && purse === '"Arms, or magic?" (3000 gold.)'
      && magic[caster] === `${d.name}\t2000g` && gold2 === 1000 && tierOf(d, 'magic') === 'expert' && told2 === `${d.name} is Expert in magic now.`
      && back.join() === first.join() && out === 'ExploreScreen',
    `a knight of 13 buys Expert at arms there for 2000 and a druid of 13 Expert in magic, the menu again after each, the line's question with the purse as it is after (${purse}), and back to the first menu and out ("${told}" / "${told2}"; ${gold2} gold left)`);
  ok(attackBonus(TABLES.items, k) === hitWas + 1 && armsBonus(k) === 1 && rankMult(d) === multWas + RANK_STEP, `and the knight hits at +1 (${attackBonus(TABLES.items, k)}) and the druid casts a rank's step higher (${rankMult(d).toFixed(2)})`);
  // Harrow's Drillyard (to 6), the Wardens' hall: its first menu has no such entry.
  enter(g, 'harrow', trainerAt('harrow'));
  const drill = options(g);
  leave(g);
  ok(drill[0] === TRADE.trainer && drill.length > 1 && !drill.includes(EXPERT_ENTRY), `Harrow's Drillyard has no "${EXPERT_ENTRY}" (${drill.join(' / ')})`);
}

/**
 * A Master's person, built here as the content's two are: their words, then the members of their
 * line; refused before the favour holds, and a member Expert at 25 taught for 5,000 once it does.
 */
function master(): void {
  const g = headlessGame(4), p = g.party, rng = makeRng(6), FAVOUR = fxFlag('test_master_favour');
  const m: Mastery = { line: 'arms', tier: 'master', done: { flag: FAVOUR }, price: TIER_PRICES.master };
  const person: Person = { kind: 'npc', x: 1, y: 1, name: 'Old Hand', lines: ['"Steel answers steel."'], mastery: m };
  const fighters = p.members.map((c, i) => (linesOf(c.cls).includes('arms') ? i : -1)).filter((i) => i >= 0), casters = p.members.filter((c) => !linesOf(c.cls).includes('arms'));
  const [a, b] = fighters;
  for (const i of [a, b]) { p.members[i].xp = xpForLevel(25); levelUp(TABLES.spells, p.members[i], rng); }
  p.members[a].tiers = { arms: 'expert' };
  p.gold = 6000;
  const talk = (): void => { while (g.screens.length > 1) g.pop(); g.push(g.talkScreen(person)); drive(g, ['interact']); };
  talk();
  const ask = wordsOf(g), before = options(g);
  drive(g, [...downTo(fighters.indexOf(a)), 'interact']);
  const still = tierOf(p.members[a], 'arms'), gold0 = p.gold;
  leave(g);
  p.flags[FAVOUR] = 1;
  talk();
  const open = options(g);
  drive(g, [...downTo(fighters.indexOf(a)), 'interact']);
  const told = g.log[g.log.length - 1], again = options(g);
  leave(g);
  const row = (i: number, bar: string): string => `${p.members[i].name}\t${bar}`;
  ok(ask === '"Who would be Master?" (6000 gold.)' && before.length === fighters.length + 1 && before[fighters.indexOf(a)] === row(a, 'favour first') && before[fighters.indexOf(b)] === row(b, 'Expert first')
      && casters.every((c) => !before.some((r) => r.startsWith(`${c.name}\t`))) && still === 'expert' && gold0 === 6000,
    `a Master's person lists the members of their line and refuses before the favour holds (${before.map((r) => r.replace('\t', ' ')).join('; ')})`);
  ok(open[fighters.indexOf(a)] === row(a, '5000g') && tierOf(p.members[a], 'arms') === 'master' && p.gold === 1000 && told === `${p.members[a].name} is Master at arms now.` && again[fighters.indexOf(a)] === row(a, 'taken'),
    `and once it holds teaches a member Expert at 25 for 5000 ("${told}")`);
  // A company with nobody of the line hears so; the person's offers hold to the same bars.
  const casterOnly = company('sorcerer', 25);
  casterOnly.members = casterOnly.members.filter((c) => !linesOf(c.cls).includes('arms'));
  const w = new World(TABLES, buildMaps(), casterOnly, makeRng(3));
  ok(!masterOffers(m, casterOnly, w.state).length && noneHere('arms') === '"I teach arms. Nobody here bears them."', 'a company with nobody of the line is offered nothing, and told so');
  // A Master with no favour written does not teach: a missing `done` reads as not yet, as a prestige's third does.
  const unwritten: Mastery = { line: 'arms', tier: 'master', price: TIER_PRICES.master };
  p.members[b].tiers = { arms: 'expert' }; p.gold = 9000;
  const o = masterOffers(unwritten, p, g.world.state).find((x) => x.who === b)!;
  ok(o.bar === 'favour first' && !favourDone(unwritten, g.world.state, p) && !teachTier('arms', 'master', o.price, p, b, favourDone(unwritten, g.world.state, p)).taught && p.gold === 9000,
    `a Master with no favour written does not teach: a missing done reads as not yet (${p.members[b].name}: ${o.bar})`);
}

/** The sheet says the tier on the WEAPON line and before SPELLS, and nothing more without one. */
function sheet(): void {
  const p = company('bard', 25), c = p.members[0];
  const weapon = c.equipment.weapon ? 'WEAPON ' : '', w0 = weaponLine(TABLES, c), s0 = spellsLine(TABLES.spells, c);
  c.tiers = { arms: 'expert', magic: 'master' };
  const w1 = weaponLine(TABLES, c), s1 = spellsLine(TABLES.spells, c);
  ok(!!weapon && !w0.includes(',') && !s0.includes('(') && w1 === `${w0}, EXPERT` && s1 === s0.replace(/^SPELLS /, 'SPELLS (MASTER) '),
    `the sheet: "${w1}" and "${s1.slice(0, 40)}...", and without a tier "${w0}"`);
}

/**
 * What no tier touches, through the cast itself: every spell a member can cast in a fight costs what it
 * did, and a buff's rounds, a cure, a sleep or a raising leave the fight as they did without the tier.
 * The map spells are not cast in a fight; nothing under src/ but the party, the blow, the menus and
 * the sheet reads a tier, so Walk on Water, Levitate and the rest read none.
 */
function untouched(): void {
  const classOf = (list: string): ClassId => (Object.keys(CLASSES) as ClassId[]).find((k) => CLASSES[k].spells === list && linesOf(k).join() === 'magic')!;
  const changed: string[] = [];
  let cast = 0;
  for (const sp of SPELLS) {
    if (sp.context === 'explore' || sp.glass) continue;
    const run = (t?: Tiers): { spent: number; state: string } => {
      const p = company(classOf(sp.list), 32, t), c = p.members[0];
      c.spells = [sp.id]; c.sp = c.maxSp = 999;
      p.members[1].conditions = ['dead'];
      const s = turn(p, { type: 'cast', spellId: sp.id, target: sp.target === 'ally' ? 1 : 0 }, 77);
      const plain = Object.entries(s).filter(([, v]) => typeof v === 'number' || typeof v === 'boolean');
      const quiet = !sp.dice && !sp.heal;
      return { spent: 999 - c.sp, state: JSON.stringify([quiet ? plain : [], quiet ? s.monsters.map((m) => m.conditions) : [], p.members.map((m) => m.conditions)]) };
    };
    const a = run(), b = run({ magic: 'master' });
    cast++;
    if (a.spent !== sp.sp || b.spent !== sp.sp || a.state !== b.state) changed.push(`${sp.name} (${a.spent}/${b.spent} sp)`);
  }
  ok(cast > 20 && !changed.length, `${cast} spells cast in a fight with Master and without: each costs what it did, and no buff's rounds, cure, sleep or raising moves${changed.length ? ' -> moved: ' + changed.join(', ') : ''}`);
  const root = fileURLToPath(new URL('../../src/', import.meta.url));
  const files = (dir: string): string[] => readdirSync(dir).flatMap((f) => { const q = join(dir, f); return statSync(q).isDirectory() ? files(q) : q.endsWith('.ts') ? [q] : []; });
  const READERS = ['game/party.ts', 'game/party/tables.ts', 'game/party/levels.ts', 'game/combat.ts', 'game/mastery.ts', 'ui/screens.ts'];
  const reads = files(root).map((f) => relative(root, f).split('\\').join('/')).filter((f) => !READERS.includes(f) && /\btierSteps\(|\barmsBonus\(|\btierOf\(|\.tiers\b|\bTIER_(?:ARMS|STEPS)\b/.test(readFileSync(join(root, f), 'utf8')));
  ok(!reads.length, `nothing under src/ reads a tier but ${READERS.join(', ')}: no map spell, cost or rounds can${reads.length ? ' -> also: ' + reads.join(', ') : ''}`);
}

/**
 * A save keeps the tiers; one from before them loads with none. The tiers came with SAVE_VERSION 5 and
 * asked no upgrade of their own, nor does any version after it (6 is #941's, the hermit's flag).
 */
function saves(): void {
  const rng = makeRng(13), party = defaultParty(TABLES, rng), world = new World(TABLES, buildMaps(), party, rng);
  party.members[0].tiers = { arms: 'master' };
  party.members[5].tiers = { magic: 'expert' };
  const back = deserialize(serialize(world.state, party, 0)).party;
  ok(tierOf(back.members[0], 'arms') === 'master' && tierOf(back.members[5], 'magic') === 'expert' && back.members.slice(1, 5).every((m) => !m.tiers), 'a save keeps the tiers');
  const old = JSON.parse(serialize(world.state, party, 0)) as { party: Party };
  for (const m of old.party.members) delete m.tiers;
  const loaded = deserialize(JSON.stringify(old)).party;
  ok(SAVE_VERSION >= 5 && loaded.members.every((m) => LINES.every((l) => tierOf(m, l) === undefined) && armsBonus(m) === 0 && tierSteps(m) === 0), `and a save from before them loads with none, at SAVE_VERSION 5 and after (${SAVE_VERSION})`);
}

/** Every word the tiers say, and the sheet's, is drawn by the font. */
function words(): void {
  const p = company('bard', 25);
  const said = [EXPERT_ENTRY, askLine(p), ...TIERS.map((t) => askTier(t, p)), ...LINES.map((l) => LINE_ROWS[l]), ...LINES.map(noneHere), 'Leave',
    ...TIERS.flatMap((t) => LINES.map((l) => `${TIER_NAMES[t]} ${LINE_NAMES[l]}`)), ...expertOffers('arms', p).map((o) => tierLine(o, p)), ...expertOffers('magic', p).map((o) => tierLine(o, p)),
    'not theirs', 'taken', 'Expert first', 'level 25', 'favour first', 'no gold', `${p.members[0].name} is Master in magic now.`, 'WEAPON Mace, EXPERT', 'SPELLS (MASTER) '];
  const has = new Set(FONT_CHARS), bad = [...new Set(said.join('').split('').filter((ch) => ch !== ' ' && ch !== '\t' && !has.has(ch.toUpperCase())))];
  ok(!bad.length && TIER_LEVELS.expert === 13 && TIER_LEVELS.master === 25 && TIER_PRICES.expert === 2000 && TIER_PRICES.master === 5000,
    `every word the tiers say is in the font${bad.length ? ' -> not: ' + bad.join(' ') : ''}; Expert from 13 for 2000, Master from 25 for 5000`);
}

/**
 * Every row of the tier menus fits the side panel as the menu draws it (`columnMenu`, ui/draw.ts): each
 * reason and price a bar can give, found by asking `tierBar` in every state, beside a name of the
 * widest letters at the longest a name may be.
 */
function fits(): void {
  const q = company('knight', 1), c = q.members[0], values = new Set<string>();
  for (const cls of ['knight', 'sorcerer', 'bard'] as const) for (const line of LINES) for (const tier of TIERS) for (const has of [undefined, ...TIERS]) for (const level of [1, 13, 25]) for (const gold of [0, 99999]) for (const favour of [false, true]) {
    c.cls = cls; c.level = level; q.gold = gold;
    if (has) c.tiers = { [line]: has }; else delete c.tiers;
    values.add(tierBar(line, tier, TIER_PRICES[tier], c, q, favour) || `${TIER_PRICES[tier]}g`);
  }
  const widest = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].sort((a, b) => measureText(b) - measureText(a))[0], name = widest.repeat(NAME_MAX);
  const p = company('bard', 25), w = new World(TABLES, buildMaps(), p, makeRng(4)), m: Mastery = { line: 'magic', tier: 'master', done: { flag: fxFlag('x') }, price: TIER_PRICES.master };
  const rows = [...LINES.map((l) => LINE_ROWS[l]), LEAVE_TIERS, ...LINES.flatMap((l) => expertOffers(l, p).map((o) => tierLine(o, p))), ...masterOffers(m, p, w.state).map((o) => tierLine(o, p)), ...[...values].map((v) => `${name}\t${v}`)];
  const cut = rows.filter((r) => { const { label, value } = optionParts(r); return measureText(label) > columnLabelWidth(SIDE_W, value, true); });
  ok(values.size >= 8 && !cut.length, `every row of the tier menus fits the ${SIDE_W} px panel, a name of ${NAME_MAX} ${widest}s beside each of ${[...values].join(', ')}${cut.length ? ' -> cut: ' + cut.map((r) => r.replace('\t', ' ')).join('; ') : ''}`);
}

/**
 * The pilot's talk at a Master's person (src/app/pilot/talk.ts), the favour done, a member Expert at 25
 * and the gold: it answers a person's question by its cheapest open priced row, but leaves a tier's
 * menu as it leaves a skill's, and nobody is taught.
 */
function talked(): void {
  const g = headlessGame(4), p = g.party, rng = makeRng(9), FAVOUR = fxFlag('test_talk_favour'), st = g.world.state;
  for (const id of Object.keys(g.maps)) g.world.ensureMapState(id).explored.fill(-1);
  const who = p.members.findIndex((m) => linesOf(m.cls).join() === 'arms');
  p.members[who].xp = xpForLevel(25); levelUp(TABLES.spells, p.members[who], rng); p.members[who].tiers = { arms: 'expert' };
  p.gold = 50000; p.flags[FAVOUR] = 1;
  const person: Person = { kind: 'npc', x: st.x, y: st.y, name: 'Old Hand', lines: ['"Steel answers steel."'], mastery: { line: 'arms', tier: 'master', done: { flag: FAVOUR }, price: TIER_PRICES.master } };
  const here = g.maps[st.mapId].features as Feature[];
  here.push(person);
  g.pilot = new Pilot({ instant: true });
  g.pilot.toggle(g);
  g.pilot.brains = [talk];
  g.push(g.talkScreen(person));
  drive(g, ['interact']);
  const open = g.top instanceof ChoiceScreen ? g.top.words : '', row = options(g)[0];
  for (let t = 0; t < 20 && g.top instanceof ChoiceScreen; t++) drive(g, [null]);
  here.splice(here.indexOf(person), 1);
  ok(open === askTier('master', p) && row === `${p.members[who].name}\t5000g` && tierOf(p.members[who], 'arms') === 'expert' && p.gold === 50000 && !(g.top instanceof ChoiceScreen),
    `the pilot's talk, at a Master's person with ${row.replace('\t', ' ')} open, leaves the menu and takes no tier (${tierOf(p.members[who], 'arms')}; ${p.gold} gold)`);
}

/**
 * The pilot's keep at the Sail Loft (src/app/pilot/keep.ts): it presses the first menu's trade and a
 * `train Ng` row, and nothing of the tiers. A member of 12 ready for 13, a knight of 13 who could buy
 * Expert and gold for it: the keep trains the one and leaves, and the tier menu never opens.
 */
function pilot(): void {
  const g = headlessGame(4), p = g.party, rng = makeRng(8);
  for (const id of Object.keys(g.maps)) g.world.ensureMapState(id).explored.fill(-1);
  const knight = p.members.findIndex((m) => linesOf(m.cls).join() === 'arms'), ready = p.members.findIndex((_m, i) => i !== knight);
  p.members[knight].xp = xpForLevel(13); levelUp(TABLES.spells, p.members[knight], rng);
  p.members[ready].xp = xpForLevel(12); levelUp(TABLES.spells, p.members[ready], rng); p.members[ready].xp = xpForLevel(13);
  for (const m of p.members) { m.hp = m.maxHp; m.sp = m.maxSp; }
  p.gold = 50000; p.food = 60;
  const cost = trainPrice(p.members[ready]);
  g.pilot = new Pilot({ instant: true });
  g.pilot.toggle(g);
  g.pilot.brains = [keep];
  const loftF = trainerAt('saltmouth');
  g.world.travel('saltmouth', loftF.x, loftF.y, NORTH);
  const menus: { words: string; rows: string[] }[] = [];
  for (let t = 0; t < 400; t++) {
    drive(g, [null]);
    if (g.top instanceof ChoiceScreen) { const top = g.top; if (!menus.some((m) => m.words === top.words && m.rows.join() === top.options.join())) menus.push({ words: top.words, rows: [...top.options] }); }
    if (p.members[ready].level === 13 && !g.screens.some((s) => s instanceof InteriorScreen)) break;
  }
  const firstMenu = menus.some((m) => m.rows.includes(EXPERT_ENTRY) && m.rows[0] === TRADE.trainer), tierMenus = menus.filter((m) => m.words.startsWith('"Arms, or magic?"') || m.words.startsWith('"Who would be'));
  ok(p.members[ready].level === 13 && firstMenu && !tierMenus.length && p.members.every((m) => !m.tiers) && p.gold === 50000 - cost,
    `the pilot's keep, at the Sail Loft with the entry before it, trains ${p.members[ready].name} to 13 for ${cost} and never opens the tier menu (${menus.length} menus seen; ${tierMenus.length} of the tiers; ${p.members.filter((m) => m.tiers).length} tiers taken)`);
  // And by the keep's own rules: its trade is not the entry, no tier row is a `train Ng` row, and no tier menu says a trainer's top level.
  const q = company('paladin', 25), rows = LINES.flatMap((l) => expertOffers(l, q).map((o) => tierLine(o, q)));
  const fixture: Mastery = { line: 'magic', tier: 'master', price: TIER_PRICES.master };
  const w = new World(TABLES, buildMaps(), q, makeRng(2)), all = [...rows, ...masterOffers(fixture, q, w.state).map((o) => tierLine(o, q))];
  const menuWords = [askLine(q), askTier('expert', q), askTier('master', q)].map((s) => new ChoiceScreen(s, ['Leave'], () => undefined));
  ok(EXPERT_ENTRY !== TRADE.trainer && all.every((r) => !/^train (\d+)g$/.test(optionParts(r).value)) && menuWords.every((c) => trainsTo(c) === undefined),
    `the keep's own rules pass the tiers by: the entry is not "${TRADE.trainer}", no tier row reads "train Ng" (${all[0].replace('\t', ' ')}), and no tier menu says "I train to level"`);
}
