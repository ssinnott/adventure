// The combat test harness (docs/MONSTERS.md §4.4): a company of a given level fights encounters in a
// row from a fresh start, once per seed, and the harness says how many it managed before it had to
// rest. The yardstick is the design's: six or seven standard encounters at the company's own level
// between rests, more past level 10 as its power grows but never fifteen, where a company must rest
// once it has lost someone, once anyone is still under a quarter of their hit points after mending,
// or once it is under a quarter of its spell points. No fight runs past fifteen rounds.
//
//   node tools/harness.ts                              each role's standard encounter, at every level made
//   node tools/harness.ts --roles soldier,brute --levels 2,6,10 --seeds 400
//   node tools/harness.ts --under 2                    the company two levels under the monsters
//   node tools/harness.ts --map thornmark --level 5    a map's own groups, against a company of 5
//   node tools/harness.ts --stats                      the test monsters' stat lines, as markdown
//   node tools/harness.ts --abilities [--levels 19,20] Act III's trolls, wights, caller and lights on the test monsters (#537, #541),
//                                                      and Act IV's giants and drakes at 23 and 25 (#545), the mesa at 27 (#546),
//                                                      the vines at 24 and its bosses as they stand (#549), and Act V's Heart on its clock at 32 (#748), and as built (#752)
//   node tools/harness.ts --calibrate [--write]        re-derive HP and DAMAGE in tools/kit/line.json
//   node tools/harness.ts --spell-cap 32 [...]         any of the above as if spells stopped growing elsewhere than 10
//   node tools/harness.ts --gear-grows [...]           ... or as if the company's gear kept growing past 28
//   node tools/harness.ts --level-traits [...]         ... or its fighters gained a blow a promotion (--level-bonus: a bonus)
//   node tools/harness.ts --rank-step 0.25 [...]       ... or a spell rank added another share than play's 15%
//   node tools/harness.ts --tiers [...]                ... or the company took Expert at 13 and Master at 25 (#852), and says them
//   node tools/harness.ts --bot bless,sleep,drink [...] ... or the bots, the gate's too, did any of the three (#853), and counts them
//     (from level 11 only, as the game's bot plays them, `optsFor`: what #865 weighed at 13 to 28)
//   node tools/harness.ts --company newer [...]        ... or the company were the four newer classes' (`newerCompany`)
//   node tools/harness.ts --artifacts erzhemd,akkush [...] ... or the company bore the bounds' artifacts named, or all of them (#847), and says who
// The company is the premade six, trained to the level (to the road's cap, 32), with the prestiges
// that level brings (game/party.ts), and dressed in what the item tables give it by then (GEAR). Beside
// it stands a company of the four newer classes, made the same way, which the harness suite holds to
// the line at four levels; the gate judges the premade six alone (EXPANSION §5.2). A thrifty bot plays it (see `thrifty`), where the gate's
// bot (src/game/bot.ts) spends: it mends whoever is in danger, strikes, and casts a damage spell only when the hit points
// the spell saves outweigh its spell points, each weighed by what the company has left of that pool,
// and counts a spell's element for what it has seen it do to each foe, and fire for the mending it
// stops in what it has seen mend. It aims at a leader, else a caller while its call has room, else
// a light that takes spell points, and reads the fight as it stands each turn, called groups and all.
// It wakes a sleeper or frees one held of the front row, or a caster, where it can (#549), raises
// the front row's fallen first while a foe breathes, cures nothing else and never flees. Behind
// `BotOpts` (#853), off unless `--bot` sets them and from level 11 only (`optsFor`), it blesses
// and sleeps where the cast pays, weighed as a damage spell is, lets the sleepers lie while another
// can strike (`striker`, #865), the whole company once one is past Act I (`letsLie`), and drinks
// where no spell pays and no mender can. Between fights it lifts stone and
// mends as a player would. The report and the calibration run on every core.
import { pathToFileURL } from 'node:url';
import fs from 'node:fs';
import { isMainThread } from 'node:worker_threads';
import { CLASSES, className, hasCondition, bonus, RANK_STEP, borne } from '../src/game/party.ts';
import type { Character, Party } from '../src/game/party.ts';
import { LINES, TIER_LEVELS, TIER_NAMES, LINE_NAMES } from '../src/game/mastery.ts';
import type { Tiers } from '../src/game/mastery.ts';
import { FRONT_ROW } from '../src/game/combat.ts';
import type { CombatState } from '../src/game/combat.ts';
import { spell, SPELLS_GROW_TO } from '../src/game/spells.ts';
import type { SpellDef } from '../src/game/spells.ts';
import { item } from '../src/game/items.ts';
import type { MonsterDef } from '../src/game/monsters.ts';
import { MAP_DEFS, MONSTERS } from '../src/content/index.ts';
import { LINE_FILE, lineJson, ROLES, ROLE_IDS, LEVELS, HP, DAMAGE, xpFor, line, standardEncounter, testMonster, TROLL, WIGHT_CURSE, CALL, LIGHT, SWEEP, trollEncounter, wightEncounter, callerEncounter, lightEncounter, testGiant, giantEncounter, drakeEncounter, BASILISK_STONE, basiliskEncounter, CLOCK, clockEncounter } from './kit/line.ts';
import type { Role } from './kit/line.ts';
import { ANSWER, REST_AT, type BotAnswer } from '../src/game/bot.ts';
import { ROUND_CAP, winRate, gateOpts } from './kit/fight.ts';
import { type Rules, writeRefusal, PROMOTIONS, PRESTIGES, GEAR_TOP, artifactIds, NEWER, fielded, ladder, HARNESS } from './kit/company.ts';
import { fightsPerRest, CAP, thrifty, spent, type Encounter, type Outcome, play, outcomeOf, fight, measure, type Why, day, days, bossFloor, longest, WORST, slowest, type Point, calibrate, refit, type Cell, fieldedAt, type Job, onCores, cellsOnCores } from './kit/harness.ts';

// ---- the command line ------------------------------------------------------------------------

async function main(): Promise<void> {
  const args = process.argv.slice(2);
  const opt = (name: string): string | undefined => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : undefined; };
  const seeds = Number(opt('seeds') ?? 200);
  const levels = (opt('levels')?.split(',').map(Number) ?? [...LEVELS]);
  const roles = (opt('roles')?.split(',') ?? ROLE_IDS) as Role[];
  const under = Number(opt('under') ?? 0);
  const pct = (x: number): string => `${Math.round(x * 100)}`;
  // The what-ifs the flags ask, passed to each call that reads one (#946).
  const rules: Rules = {};
  const cap = opt('spell-cap');
  if (cap !== undefined) {
    rules.spellsGrowTo = Number(cap);
    if (!(rules.spellsGrowTo >= 1)) throw new Error('--spell-cap takes the level damage spells stop growing at');
    console.log(`What if: damage spells stop growing at level ${rules.spellsGrowTo}, not ${SPELLS_GROW_TO}.`);
  }
  if (args.includes('--gear-grows')) {
    rules.gearGrows = true;
    console.log(`What if: past level ${GEAR_TOP}, the ladder's top, the company's weapons hit harder as the line's hit points grow, and its armour gains a point every two levels.`);
  }
  if (args.includes('--level-traits')) {
    rules.levelTraits = true;
    console.log(`What if: fighters strike once more a turn with each promotion, at ${PROMOTIONS.join(' and ')}, and past level 10 sneak attacks grow 2 every two levels.`);
  }
  if (args.includes('--level-bonus')) {
    rules.levelBonus = true;
    console.log(`What if: past level 10 every member gains a point of weapon damage and of armour every two levels.`);
  }
  const step = opt('rank-step');
  if (step !== undefined) {
    rules.rankStep = Number(step);
    if (!(rules.rankStep >= 0)) throw new Error('--rank-step takes a share, 0 or more');
    console.log(`What if: each spell rank adds ${pct(rules.rankStep)}% to a spell's damage and mending, not ${pct(RANK_STEP)}%.`);
  }
  const and = (xs: readonly string[]): string => (xs.length > 1 ? `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}` : xs.join(''));
  if (args.includes('--tiers')) {
    rules.tiers = true;
    console.log(`What if: the company takes Expert at ${TIER_LEVELS.expert} and Master at ${TIER_LEVELS.master} (#852), its fighters at arms, its casters in magic and its hybrids both.`);
  }
  const bots = opt('bot');
  if (bots !== undefined) {
    const asked = bots.split(','), known: readonly string[] = ['bless', 'sleep', 'drink'];
    if (asked.some((x) => !known.includes(x))) throw new Error('--bot takes bless, sleep and drink, any of them, with commas between');
    rules.bot = Object.fromEntries(asked.map((x) => [x, true]));
    console.log(`What if: the bots, the gate's too, also ${and(known.filter((x) => asked.includes(x)))} (#853).`);
  }
  const fields = opt('company');
  if (fields !== undefined) {
    if (fields !== 'newer') throw new Error("--company takes newer, the four newer classes' company; the premade six are the default");
    rules.company = fields;
    const who = NEWER.map(([name, , cls]) => `${name} the ${CLASSES[cls].name.toLowerCase()}`);
    console.log(`What if: the company is the four newer classes': ${and(who.slice(0, FRONT_ROW))} in front, ${and(who.slice(FRONT_ROW))} behind.`);
  }
  const bears = opt('artifacts');
  if (bears !== undefined) {
    const all = artifactIds(), asked = bears === 'all' ? all : bears.split(',');
    if (!asked.length || asked.some((x) => !all.includes(x)) || new Set(asked).size < asked.length) throw new Error(`--artifacts takes all, or the artifacts' ids, each once, with commas between: ${all.join(', ')}`);
    rules.artifacts = asked;
    console.log(`What if: the company bears ${and(asked.map((x) => item(HARNESS.items, x).name.replace(/^The /, 'the ')))}, each by the first member who may (#847), found past the ladder's top and on no rung of it.`);
  }
  const row = (label: string, cells: readonly string[]): void => console.log(label.padEnd(14) + cells.map((c) => c.padStart(6)).join(''));
  if (levels.some((l) => !(l >= 1 && l <= CAP)) || roles.some((r) => !ROLES[r])) throw new Error(`levels run from 1 to ${CAP}; roles are ${ROLE_IDS.join(', ')}`);

  const map = opt('map');
  if (map) {
    const level = Number(opt('level') ?? 5);
    const def = MAP_DEFS.find((d) => d.id === map);
    if (!def?.encounters?.length) throw new Error(`no map '${map}' with groups`);
    console.log(`${def.id} (band ${def.band?.join('-') ?? '-'}): its groups against a company of ${level}, ${seeds} seeds.`);
    console.log('Fights: that group again and again from fresh, until the company must rest. One fight: from fresh.');
    console.log('group'.padEnd(20) + 'fights'.padStart(7) + 'cost'.padStart(6) + 'won'.padStart(6) + 'rounds'.padStart(8) + '  monsters');
    for (const g of def.encounters) {
      const d = days(level, [g], seeds, 1, false, rules), t = measure(level, g, seeds, 1, thrifty, rules);
      console.log(g.id.padEnd(20) + d.fights.toFixed(1).padStart(7) + `${pct(t.cost)}%`.padStart(6) + `${pct(t.won)}%`.padStart(6) + t.rounds.toFixed(1).padStart(8) + '  ' + g.monsters.join(' '));
    }
    const all = days(level, def.encounters, seeds, 1, true, rules);
    const why = (Object.entries(all.why) as [Why, number][]).filter(([, n]) => n > 0).sort((a, b) => b[1] - a[1]).map(([w, n]) => `${{ lost: 'a lost fight', long: 'a fight broken off', dead: 'a death', hp: 'hit points', sp: 'spell points', none: 'none' }[w]} ${pct(n)}%`);
    console.log(`\nIts groups in a new order each seed: ${all.fights.toFixed(1)} fights before a rest, against ${fightsPerRest(level)} at the company's own level. What ended the day: ${why.join(', ')}.`);
    return;
  }

  if (args.includes('--stats')) {
    for (const r of roles) {
      const shape = ROLES[r];
      console.log(`\n${shape.name} (${shape.group} to an encounter${shape.ranged ? ', ranged' : ''}${shape.missile ? ', bows' : ''}${shape.inflict ? `, ${shape.inflict.cond} ${shape.inflict.chance}` : ''}; speed ${shape.speed})`);
      console.log('| Level | Hit points | Armour | To-hit | Damage | Experience |\n|---|---|---|---|---|---|');
      for (const l of levels) {
        const m = testMonster(r, l);
        console.log(`| ${l} | ${m.hp} | ${m.ac} | ${m.attack} | ${m.dice}d${m.sides}${m.bonus ? (m.bonus > 0 ? '+' : '') + m.bonus : ''} (${(m.dice * (m.sides + 1) / 2 + m.bonus).toFixed(1)}) | ${m.xp} |`);
      }
    }
    return;
  }

  if (args.includes('--abilities')) {
    // Act III's abilities on the test monsters (docs/MONSTERS.md §3.3, #537, #541): the figures their sizes were decided on.
    const at = opt('levels') ? levels : [19, 20];
    const forget = (keep: (sp: SpellDef) => boolean) => (p: Party): Party => { for (const c of p.members) c.spells = c.spells.filter((id) => keep(spell(HARNESS.spells, id))); return p; };
    const fireless = forget((x) => x.element !== 'fire'), unarmed = forget((x) => !x.dice);
    /** Seeds of one fight from fresh, as `measure` fights them, each fight's end kept to read; `how` the what-ifs, an answer turned among them. */
    const fights = (level: number, enc: Encounter, dress = (p: Party): Party => p, how: Readonly<Rules> = rules): { s: CombatState; p: Party; o: Outcome }[] => Array.from({ length: seeds }, (_, n) => {
      const p = dress(fielded(level, n + 1, how)), s = play(p, enc, (n + 1) * 7919 + 13, thrifty, how);
      return { s, p, o: outcomeOf(s, p) };
    });
    /** The fights before a rest, `days` under the what-ifs, or `how`. */
    const toRest = (level: number, enc: Encounter, how: Readonly<Rules> = rules): number => days(level, [enc], seeds, 1, false, how).fights;
    /** The what-ifs with one of the bots' answers turned (`ANSWER`). */
    const turned = (answer: Partial<BotAnswer>): Rules => ({ ...rules, answer: { ...ANSWER, ...answer } });
    const mean = (fs: { o: Outcome }[], f: (o: Outcome) => number): number => fs.reduce((t, x) => t + f(x.o), 0) / fs.length;
    const one = (fs: { o: Outcome }[]): string => `${mean(fs, (o) => o.rounds).toFixed(1)} rounds, ${pct(mean(fs, (o) => o.cost))}%, won ${pct(mean(fs, (o) => (o.won ? 1 : 0)))}%`;
    const rest = (level: number, enc: Encounter, beside?: [string, Encounter]): string => `${toRest(level, enc).toFixed(1)} to a rest (${beside ? `${beside[0]} ${toRest(level, beside[1]).toFixed(1)}, ` : ''}${fightsPerRest(level)} asked)`;
    console.log(`Act III's abilities on the test monsters, ${seeds} seeds: one fight from fresh (its rounds, its cost, won) and fights before a rest.`);
    console.log(`Two trolls: the test brute on ${TROLL.hp} of its hit points, mending ${TROLL.regen} of them a round but a round fire struck it.`);
    for (const l of at) {
      const brute = testMonster('brute', l), whole: MonsterDef = { ...brute, regen: Math.round(brute.hp * TROLL.regen) }, enc = trollEncounter(l);
      console.log(`  ${l}: with fire ${one(fights(l, enc))}, ${rest(l, enc, ['plain brutes', standardEncounter('brute', l)])}; with none ${one(fights(l, enc, fireless))}; weapons alone ${one(fights(l, enc, unarmed))}; weapons alone on a brute's whole hit points ${one(fights(l, [whole, whole], unarmed))}`);
    }
    console.log(`Four wights: the test controller, its hold a curse at ${WIGHT_CURSE} a hit.`);
    for (const l of at) {
      const fs = fights(l, wightEncounter(l)), cursed = fs.filter(({ p }) => p.members.some((m) => hasCondition(m, 'cursed'))).length;
      console.log(`  ${l}: ${one(fs)}, ${cursed} of ${seeds} leaving someone cursed; ${rest(l, wightEncounter(l))}`);
    }
    console.log(`A caller beside six fodder: the test soldier, calling ${CALL.monsters} of the test fodder at ${CALL.chance} a turn.`);
    for (const l of at) {
      const fs = fights(l, callerEncounter(l)), mute = callerEncounter(l).map((m) => (m.calls ? { ...m, calls: undefined } : m));
      console.log(`  ${l}: ${one(fs)}, the fight holding ${(fs.reduce((t, { s }) => t + s.monsters.length, 0) / seeds).toFixed(1)} monsters; ${rest(l, callerEncounter(l))}, and ${toRest(l, mute).toFixed(1)} with no call`);
    }
    console.log(`Three lights and a hound: the test controller come down whole to ${LIGHT.share} of its line, flying, its touch taking spell points where it held, beside the test skirmisher (#541).`);
    for (const l of at) {
      const enc = lightEncounter(l), fs = fights(l, enc), houndFirst = { monsters: enc, leader: enc[enc.length - 1].id };
      const plain = [...Array.from({ length: 3 }, () => testMonster('controller', l)), testMonster('skirmisher', l)];
      const whole = enc.map((m): MonsterDef => (m.drain ? { ...testMonster('controller', l), id: m.id, kind: m.kind, ranged: true, drain: m.drain, inflict: undefined } : m));
      console.log(`  ${l}: ${one(fs)}, its spell points ${pct(mean(fs, (o) => o.sp))}% spent or taken (${pct(mean(fights(l, houndFirst), (o) => o.sp))}% with the hound marked first); ${rest(l, enc, ['the hound marked first', houndFirst])}; ${toRest(l, plain).toFixed(1)} for three test controllers and the hound, and ${toRest(l, whole).toFixed(1)} for lights on the controller's whole line`);
    }
    // Act IV's sweep (#545), where the road first meets it: the giants at 23, the drakes at 25.
    console.log(`Two giants and two drakes: the test brute come down whole to ${SWEEP.share} of its line, its arm sweeping the front row or its breath burning a row with fire at ${SWEEP.chance} a turn.`);
    const felled = (fs: { s: CombatState }[]): number => fs.filter(({ s }) => s.log.some((l) => / (sweeps|breathes) /.test(l) && /falls?!$/.test(l))).length;
    for (const l of opt('levels') ? levels : [23, 25]) {
      const g = testGiant(l), front = fielded(l, 1, rules).members.slice(0, FRONT_ROW).map((m) => m.maxHp), heavy = [testGiant(l, 2), testGiant(l, 2)];
      const answered = felled(fights(l, heavy)), bare = felled(fights(l, heavy, undefined, turned({ sweep: false })));
      console.log(`  ${l}: giants ${one(fights(l, giantEncounter(l)))}, ${rest(l, giantEncounter(l), ['plain brutes', standardEncounter('brute', l)])}; drakes ${one(fights(l, drakeEncounter(l)))}, ${rest(l, drakeEncounter(l))}; a sweep at its worst ${g.dice * g.sides + g.bonus} to each of a front row of ${front.join(', ')}; giants of twice the blow fell one of a row in ${answered} of ${seeds} fights, ${bare} with no answer`);
    }
    // Act IV's stone (#546), where the road first meets it: the mesas at 27.
    console.log(`The mesa: the test controller, its hold a stone at ${BASILISK_STONE} a hit and its gaze reaching the back row, behind three of the test skirmisher.`);
    const glassed = (fs: { p: Party }[]): number => fs.filter(({ p }) => p.members.some((m) => hasCondition(m, 'stoned'))).length;
    const uncured = (p: Party): Party => { forget((x) => x.id !== 'absolve')(p); p.bag = p.bag.filter((id) => !item(HARNESS.items, id).use?.cure?.includes('stoned')); return p; };
    for (const l of opt('levels') ? levels : [27]) {
      const enc = basiliskEncounter(l), held = enc.map((m): MonsterDef => (m.inflict?.cond === 'stoned' ? { ...m, inflict: { cond: 'paralysed', chance: BASILISK_STONE } } : m));
      const fs = fights(l, enc), cureless = Array.from({ length: seeds }, (_, n) => day(l, [enc], n + 1, 30, uncured, rules)).reduce((t, d) => t + d.fights, 0) / seeds;
      console.log(`  ${l}: ${one(fs)}, ${glassed(fs)} of ${seeds} leaving someone glassed; ${rest(l, enc, ['its hold a paralysis', held])}, and ${cureless.toFixed(1)} with neither Absolve nor a draught`);
    }
    // Act V's clock (#748), where the road meets it: the Heart at 32, the company killing the Hands
    // first, going for the lord, or fighting what the clock calls as it comes.
    console.log(`The Heart: the test boss leading three of the test elite at a clock's panel, calling the test soldier, a machine that obeys, every ${CLOCK.every} rounds while one of them stands.`);
    for (const l of opt('levels') ? levels : [32]) {
      const plays = (['panel', 'leader', 'called'] as const).map((k) => {
        const fs = fights(l, clockEncounter(l), undefined, turned({ clock: k })), come = fs.reduce((t, { s }) => t + s.monsters.length - 4, 0) / seeds, dark = fs.reduce((t, { s }) => t + (s.clock?.dim ?? 0), 0) / seeds;
        return `${{ panel: 'the Hands first', leader: 'the lord first', called: 'the sentries as they come' }[k]} ${one(fs)}, ${come.toFixed(1)} sentries called, the light ${dark.toFixed(1)} of ${CLOCK.dims} steps down`;
      });
      console.log(`  ${l}: ${plays.join('; ')}`);
    }
    // And the Heart as built (#759): Vask, his three Hands at the panel and his sentries, on the gate's bot,
    // which the plan sizes him by (#752); the gate judges the Hands first on its own (tools/tests/gate.ts).
    const heart = MAP_DEFS.find((d) => d.id === 'core')?.encounters?.find((e) => e.id === 'core_vask');
    if (heart) {
      const won = (enc: Encounter, clock: BotAnswer['clock'] = 'panel'): string => `${pct(winRate(32, enc, seeds, ROUND_CAP, gateOpts(heart), turned({ clock })))}%`;
      const plays = (['panel', 'leader', 'called'] as const).map((k) => `${{ panel: 'the Hands first', leader: 'Vask first', called: 'the sentries as they come' }[k]} ${won(heart, k)}`);
      console.log(`  Vask's own group at 32, won: ${plays.join(', ')}, and ${won({ ...heart, clock: undefined })} with no clock`);
    }
    // Act IV's holds (#549): the bells, the vines and the machines' clamps, which the bots free.
    console.log(`Four vines: the test controller, its hold at 0.3 a hit as the Strangler Vine's, the held freed by the bots' cure (#549).`);
    for (const l of opt('levels') ? levels : [24]) {
      const vines = Array.from({ length: 4 }, (): MonsterDef => ({ ...testMonster('controller', l), inflict: { cond: 'paralysed', chance: 0.3 } }));
      const freed = one(fights(l, vines)), plain = toRest(l, standardEncounter('controller', l)), held = turned({ hold: false });
      const left = one(fights(l, vines, undefined, held)), plainLeft = toRest(l, standardEncounter('controller', l), held);
      console.log(`  ${l}: freed ${freed}, ${rest(l, vines)}; left ${left}; four test controllers ${plain.toFixed(1)} to a rest freed, ${plainLeft.toFixed(1)} left`);
    }
    // Act IV's bosses as they stand, the large dungeons' among them (#549): each from two under, beside the test boss of its level.
    console.log(`Act IV's bosses, alone, won from two under (the test boss of its level beside it):`);
    for (const m of Object.values(MONSTERS).filter((x) => x.level >= 23 && x.level <= 28 && x.xp >= xpFor('boss', x.level) * 0.9)) {
      const at2 = bossFloor(m.level);
      console.log(`  ${m.name} at ${m.level}: ${pct(measure(at2, [m], seeds, 1, thrifty, rules).won)}% (the test boss ${pct(measure(at2, standardEncounter('boss', m.level), seeds, 1, thrifty, rules).won)}%), ${pct(measure(m.level, [m], seeds, 1, thrifty, rules).won)}% at its own level`);
    }
    return;
  }

  if (args.includes('--calibrate')) {
    const t0 = Date.now(), secs = (): string => `${((Date.now() - t0) / 1000).toFixed(0)}s`;
    const fmt = (x: number): string => x.toFixed(2).replace(/\.?0+$/, '');
    const at = (l: number): number => { const k = LEVELS.indexOf(l as (typeof LEVELS)[number]); if (k < 0) throw new Error(`level ${l} is not one of LEVELS`); return k; };
    levels.forEach(at);
    const say = (j: Job, [h, d, bad, fights, rounds]: Point): void => console.log(`  ${j.role} ${j.level}: hp ${fmt(h)}, damage ${fmt(d)}; ${j.role === 'boss' ? `won ${pct(fights)}%` : `${fights.toFixed(1)} fights, ${rounds.toFixed(1)} rounds, ${pct(bad)}% of days end badly`} (${secs()})`);
    const refused = writeRefusal(rules);
    if (args.includes('--write') && refused) throw new Error(refused);
    const jobs = roles.flatMap((role) => levels.map((level): Job => ({ kind: 'calibrate', role, level, seeds, under: 0, rules })));
    const made = await onCores<Point>(jobs, say);
    // The tables with the points just made, as they will be written; the rest stay as they were.
    const next = { hp: {} as Record<Role, number[]>, dmg: {} as Record<Role, number[]>, bad: {} as Record<Role, number[]> };
    for (const r of ROLE_IDS) { next.hp[r] = [...HP[r]]; next.dmg[r] = [...DAMAGE[r]]; next.bad[r] = HP[r].map(() => NaN); }
    const put = (j: Job, [h, d, bad]: Point): void => { next.hp[j.role][at(j.level)] = Number(fmt(h)); next.dmg[j.role][at(j.level)] = Number(fmt(d)); next.bad[j.role][at(j.level)] = bad; };
    jobs.forEach((j, k) => put(j, made[k]));
    // A monster never has fewer hit points than the one a level under it, at the levels made or any
    // between: where a point's factor falls so fast from the one before that the hit points drawn
    // between them would dip, it is raised until they would not, and its damage is solved again. A
    // boss's one factor is both, so held it hits a little harder as well, and is not solved again.
    // And where the next level made is one up and is not made now, but stands as it was, the point's
    // hit points never pass that level's: its factor comes down until they would not, and is solved
    // again as a held one is (#793, 29 between 28 and 30). Where the next level made is two or more
    // up, a bound on the point alone would not keep the levels drawn between from dipping, so none is
    // set there.
    const held: Job[] = [], bosses: string[] = [];
    for (const r of roles) {
      LEVELS.forEach((b, k) => {
        if (k === 0 || !levels.includes(b)) return;
        const a = LEVELS[k - 1], grow = line(b).hp - line(b - 1).hp;
        const least = (next.hp[r][k - 1] * line(b).hp) / (line(b).hp + grow * (b - a));
        const c = LEVELS[k + 1];
        const most = c !== b + 1 || levels.includes(c) ? Infinity : (next.hp[r][k + 1] * line(c).hp) / line(b).hp;
        const h = next.hp[r][k] < least - 1e-9 ? Math.ceil(least * 100) / 100 : next.hp[r][k] > most + 1e-9 ? Math.floor(most * 100) / 100 : undefined;
        if (h === undefined) return;
        next.hp[r][k] = h;
        if (r === 'boss') { next.dmg[r][k] = h; bosses.push(`boss ${b}`); }
        else held.push({ kind: 'refit', role: r, level: b, seeds, under: 0, hp: h, rules });
      });
    }
    if (held.length || bosses.length) console.log(`  holding hit points at the level under's, or the level over's where it stands: ${[...held.map((j) => `${j.role} ${j.level}`), ...bosses].join(', ')}`);
    if (held.length) {
      const again = await onCores<Point>(held, say);
      held.forEach((j, k) => put(j, again[k]));
    }
    for (const r of roles) console.log(`  ${`${r}:`.padEnd(12)}hp [${levels.map((l) => fmt(next.hp[r][at(l)])).join(', ')}]  damage [${levels.map((l) => fmt(next.dmg[r][at(l)])).join(', ')}]`);
    console.log(`\nDays that end in a death, a lost fight or one broken off, at the points made (%; the boss: fights lost from two under)`);
    row('', levels.map((l) => `L${l}`));
    for (const r of roles) row(r, levels.map((l) => pct(next.bad[r][at(l)])));
    console.log(`(${jobs.length} points${held.length + bosses.length ? `, ${held.length + bosses.length} held` : ''}, ${seeds} seeds each, ${secs()})`);
    if (args.includes('--write')) {
      const rounded = (t: Record<Role, number[]>): Record<Role, number[]> => Object.fromEntries(ROLE_IDS.map((r) => [r, t[r].map((x) => Number(fmt(x)))])) as Record<Role, number[]>;
      fs.writeFileSync(LINE_FILE, lineJson({ HP: rounded(next.hp), DAMAGE: rounded(next.dmg) }));
      console.log('written to tools/kit/line.json');
    }
    return;
  }

  console.log(`Standard encounters against a company ${under ? `${under} level${under > 1 ? 's' : ''} under them` : 'of their own level'}, ${seeds} seeds.`);
  console.log(`Fights before a rest: encounters in a row from fresh, mending between them, until the company loses one or must rest:`);
  console.log(`someone dead, anyone under ${pct(REST_AT)}% of their hit points after mending, or the company under ${pct(REST_AT)}% of its spell points.`);
  console.log(`A fight still going after ${ROUND_CAP} rounds is broken off, and the company rests.`);
  console.log(`Target: six or seven fights to level 10, a fight more every four levels after (${fightsPerRest(CAP)} at ${CAP}), with no more than ${pct(WORST)}% of days`);
  console.log(`ending in a death, a lost fight or one broken off, in fights of ${longest(1)} rounds at level 1 to ${longest(CAP).toFixed(1)} at ${CAP}`);
  console.log(`(up to ${slowest(1)} and ${slowest(CAP).toFixed(1)} where blows that hard kill too often).`);
  console.log(`The boss is fought alone, from ${under ? 'the same company' : 'two levels under it'}: won (target 50%).`);
  if (rules.tiers || rules.company || rules.artifacts) {
    // The company the what-ifs make, as it stands at each level it fights from: each member's title, tiers and artifacts.
    const tiersOf = (t: Tiers): string => (['master', 'expert'] as const).map((x) => ({ x, on: LINES.filter((l) => t[l] === x) })).filter(({ on }) => on.length).map(({ x, on }) => `${TIER_NAMES[x]} ${on.map((l) => LINE_NAMES[l]).join(' and ')}`).join(', ');
    const arts = (m: Character): string => borne(HARNESS.items, m).filter((id) => item(HARNESS.items, id).artifact).map((id) => item(HARNESS.items, id).name).join(' and ');
    console.log(`\nThe company${rules.tiers ? ' and its tiers' : ''}${rules.artifacts ? ' and who bears the artifacts' : ''}, at each level it fights from:`);
    for (const l of [...new Set(roles.flatMap((r) => levels.map((v) => fieldedAt(r, v, under))))].sort((a, b) => a - b)) {
      console.log(`  L${l}: ${fielded(l, 1, rules).members.map((m) => `${m.name} ${className(m)}${m.tiers ? `, ${tiersOf(m.tiers)}` : ''}${arts(m) ? `, ${arts(m)}` : ''}`).join('; ')}`);
    }
  }
  const cells = await cellsOnCores(roles, levels, seeds, under, Infinity, rules);
  const block = (title: string, show: (c: Cell, r: Role) => string, dayOnly = false): void => {
    console.log(`\n${title}`);
    row('', levels.map((l) => `L${l}`));
    if (title.startsWith('fights')) row('target', levels.map((l) => fightsPerRest(l).toFixed(1)));
    roles.forEach((r, i) => { if (!dayOnly || r !== 'boss') row(`${r} ×${ROLES[r].group}`, levels.map((_, k) => show(cells[i * levels.length + k], r))); });
  };
  block('fights before a rest  (boss: won %)', (c) => (c.day ? c.day.fights.toFixed(1) : pct(c.fresh.won)));
  block('rested for spell points %', (c) => pct(c.day!.why.sp), true);
  block('rested for hit points %', (c) => pct(c.day!.why.hp), true);
  block('ended by a death, a lost fight or one broken off %', (c) => pct(c.day!.why.dead + c.day!.why.lost + c.day!.why.long), true);
  block('rounds a fight, over the day', (c) => c.day!.rounds.toFixed(1), true);
  block('one fight from fresh: cost %', (c) => pct(c.fresh.cost));
  block('one fight from fresh: someone down at the end %', (c) => pct(c.fresh.down));
  const took = { bless: 'blessed', sleep: 'slept a group', drink: 'drank' } as const;
  for (const k of ['bless', 'sleep', 'drink'] as const) if (rules.bot?.[k]) block(`one fight from fresh: the bots ${took[k]} %`, (c) => pct(c.casts?.[k] ?? 0));
  if (Math.max(...levels) > SPELLS_GROW_TO) console.log(`\nPast level ${SPELLS_GROW_TO} the company runs on play's rules: its spells stop growing, it takes its prestiges at ${PRESTIGES.join(', ')} and their spell ranks, and tiers 6 and 7 at 15 and 23, and it wears the ladder's gear to ${GEAR_TOP} and none past it.`);
}

if (isMainThread && process.argv[1] && import.meta.url === pathToFileURL(process.argv[1]).href) main().catch((e: unknown) => { console.error(e); process.exit(1); });
