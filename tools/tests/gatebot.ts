// The gate's bot on fixtures (#1016), apart from the figures the gate holds the areas to
// (tools/tests/gate.ts): the company of tools/kit/company.ts and the fight of tools/kit/fight.ts play a
// member's resistance, Act III's abilities and the prestiges; a fight is broken off at the round cap; a
// toll is refused and paid; a group's time to walk, and the walk over the ground (tools/kit/rules/curve.ts).
import { MONSTERS } from '../../src/content/index.ts';
import type { ItemDef } from '../../src/game/items.ts';
import type { MonsterDef } from '../../src/game/monsters.ts';
import type { EncounterDef, MapDef, Choice } from '../../src/game/mapdef.ts';
import { GameMap } from '../../src/game/map.ts';
import { World } from '../../src/game/world.ts';
import { EAST } from '../../src/game/types.ts';
import { hasCondition, className, addCondition } from '../../src/game/party.ts';
import type { Party } from '../../src/game/party.ts';
import { makeRng } from '../../src/lib/engine/rng.ts';
import { startCombat, asGroup, aliveMonsters } from '../../src/game/combat.ts';
import type { CombatState, Fighters } from '../../src/game/combat.ts';
import { spell } from '../../src/game/spells.ts';
import { markOf, ANSWER } from '../../src/game/bot.ts';
import { gateFight, gateBot, fightSeed, gateAnswer, gatePass, rate, ROUND_CAP, playOut } from '../kit/fight.ts';
import { gateCompany, companyAt, HARNESS } from '../kit/company.ts';
import { mendBetween } from '../kit/harness.ts';
import { testMonster, trollEncounter, wightEncounter, callerEncounter, lightEncounter, testGiant, giantEncounter, drakeEncounter, basiliskEncounter } from '../kit/line.ts';
import { stepsFrom } from '../kit/rules/curve.ts';
import { ok, fxFlag } from './lib.ts';
import { tablesWith } from '../kit/headless.ts';
import type { Tables } from '../../src/game/tables.ts';

/** A share as the gate prints one. */
const pc = (x: number): string => `${(x * 100).toFixed(1).replace(/\.0$/, '')}%`;

/** The gate's bot on fixtures: the checks of the bot, its company and the walk that the gate's fixed part held before #1016. */
export function gatebot(): void {
  // The gate's company plays a member's resistance (#555): the bearer of a charm against cold takes
  // less from a frost-caster's spells, and the rest what they took without it.
  {
    const charm: ItemDef = { id: 'test_gate_charm', name: 'Frost Charm', slot: 'none', price: 0, resist: ['cold'] };
    const frost: MonsterDef = { ...MONSTERS.bandit, id: 'test_gate_frost', name: 'Frost Adept', plural: 'Frost Adepts', hp: 400, level: 10, cast: { spells: ['killing_frost'], chance: 1 } };
    const taken = (carry: boolean, t: Tables): number[] => {
      const p = gateCompany(12, 7);
      for (const c of p.members) c.hp = c.maxHp = 9999;
      if (carry) p.members[0].pack.push(charm.id);
      gateFight(p, [frost], 7, 3, {}, undefined, t);
      return p.members.map((c) => 9999 - c.hp);
    };
    const lent = tablesWith([charm], HARNESS), [bare, held] = [taken(false, lent), taken(true, lent)] as const;
    ok(bare[0] > 0 && held[0] < bare[0] && held[0] >= bare[0] / 2 && held.slice(1).join() === bare.slice(1).join(), `the gate's company plays a resistance: its bearer takes ${held[0]} from a frost-caster's spells, against ${bare[0]} without`);
  }
  // The gate's company plays Act III's abilities (#537), each on its test monsters' standard encounter
  // at the floor the road first meets it: it burns what it has seen mend, so two trolls fall to it in
  // four rounds where a company with no fire grinds on past them; it fights on through curses; and it
  // reads a fight that grows by a call, and wins it.
  {
    const seeds = 40, fireless = (p: Party): Party => { for (const c of p.members) c.spells = c.spells.filter((id) => spell(id).element !== 'fire'); return p; };
    /** Seeds 1 to `seeds` of a gate fight, `cap` rounds at most, played as gateFight plays it, by the bots' `answer`: each fight's end. */
    const fought = (level: number, monsters: Fighters, cap = ROUND_CAP, dress = (p: Party): Party => p, answer = ANSWER): { s: CombatState; p: Party }[] => Array.from({ length: seeds }, (_, n) => {
      const k = n + 1, p = dress(gateCompany(level, k)), rng = makeRng(fightSeed(k)), s = startCombat(HARNESS, p, [asGroup('gate', monsters)], rng);
      return { s: playOut(s, p, rng, gateBot, { answer }, cap), p };
    });
    const won = (fs: { s: CombatState }[]): number => fs.filter(({ s }) => s.outcome === 'victory').length / fs.length;
    const fire = fought(19, trollEncounter(19), 4), none = fought(19, trollEncounter(19), 4, fireless), burnt = fire.filter(({ s }) => s.log.some((l) => / smoulders? and /.test(l))).length;
    ok(won(fire) >= 0.9 && won(fire) - won(none) >= 0.5 && burnt >= seeds * 0.75, `the gate's company burns what mends: it wins ${pc(won(fire))} of two trolls' fights at 19 inside four rounds, burning them in ${burnt} of ${seeds}, where with no fire it wins ${pc(won(none))}`);
    const wights = fought(19, wightEncounter(19)), cursed = wights.filter(({ p }) => p.members.some((m) => hasCondition(m, 'cursed'))).length;
    ok(won(wights) >= 0.9 && cursed > 0, `it fights on through the wights' curses at 19, winning ${pc(won(wights))}, ${cursed} of ${seeds} companies leaving cursed`);
    const called = fought(20, callerEncounter(20)), grew = called.filter(({ s }) => s.groupIds.length > 1).length;
    ok(won(called) >= 0.9 && grew > 0 && gateFight(gateCompany(20, 1), callerEncounter(20), fightSeed(1)), `and a caller's fight at 20 that grows by its call in ${grew} of ${seeds}, winning ${pc(won(called))}`);
    // It keeps its casters' spell points from the lights (#541): it marks one whose touch takes them
    // after a leader and a caller, so its first blade in a fight of three lights and a hound falls on
    // a light, and it wins.
    const lights = lightEncounter(19), first = startCombat(HARNESS, gateCompany(19, 1), [asGroup('gate', lights)], makeRng(1)), mark = markOf(first, aliveMonsters(first));
    const lit = fought(19, lights), blade = /^(?:Bram|Idris|Wren|Ottilie|Maren|Cassian) (?:hits|misses) (Test \w+)/;
    const atLights = lit.filter(({ s }) => s.log.map((l) => blade.exec(l)?.[1]).find((x) => x) === 'Test Light').length;
    ok(mark !== undefined && first.monsters[mark].def.drain === 'sp' && won(lit) >= 0.9 && atLights >= seeds * 0.9,
      `it keeps its casters' spell points from the lights: it marks a light before the hound, so its first blade falls on a light in ${atLights} of ${seeds} fights at 19, and it wins ${pc(won(lit))}`);
    // It plays the sweep (#545): two giants at 23 and two drakes at 25, and wins; and it mends the row
    // a sweep would take before one sweep could fell anyone in it, so against giants of twice the blow
    // fewer of its front row fall to a sweep than with no answer.
    const giants = fought(23, giantEncounter(23)), drakes = fought(25, drakeEncounter(25)), heavy = [testGiant(23, 2), testGiant(23, 2)];
    const felled = (fs: { s: CombatState }[]): number => fs.filter(({ s }) => s.log.some((l) => / (sweeps|breathes) /.test(l) && /falls?!$/.test(l))).length;
    const answered = felled(fought(23, heavy)), bare = felled(fought(23, heavy, ROUND_CAP, undefined, { ...ANSWER, sweep: false }));
    const swept = giants.filter(({ s }) => s.log.some((l) => l.startsWith('Test Giant sweeps the front row'))).length;
    ok(won(giants) >= 0.9 && won(drakes) >= 0.9 && swept >= seeds / 2 && answered < bare,
      `it plays the sweep: it wins ${pc(won(giants))} of two giants' fights at 23, swept in ${swept} of ${seeds}, and ${pc(won(drakes))} of two drakes' at 25; and against giants of twice the blow one of a row falls to a sweep in ${answered} of ${seeds} fights, where with no answer in ${bare}`);
    // It plays stone (#546): it wins the mesa at 27, someone glassed in some fights, and between
    // fights lifts the stone as the road mends, by Absolve or by the draught it carries.
    const mesas = fought(27, basiliskEncounter(27)), glassed = mesas.filter(({ p }) => p.members.some((m) => hasCondition(m, 'stoned')));
    for (const { p } of glassed) mendBetween(p);
    const lifted = glassed.filter(({ p }) => !p.members.some((m) => hasCondition(m, 'stoned'))).length, drunk = glassed.filter(({ p }) => !p.bag.includes('quickening')).length;
    ok(won(mesas) >= 0.9 && glassed.length > 0 && lifted === glassed.length,
      `it plays stone: it wins ${pc(won(mesas))} of the mesa's fights at 27, ${glassed.length} of ${seeds} leaving someone glassed, and lifts it between fights in ${lifted}, by the draught in ${drunk}`);
    // It plays a hold (#549): four controllers at 24 holding at the vines' 0.3, and it frees one held
    // of its front row, or a caster, by the cheapest cure it has before it strikes.
    const vines = Array.from({ length: 4 }, (): MonsterDef => ({ ...testMonster('controller', 24), inflict: { cond: 'paralysed', chance: 0.3 } }));
    const freed = fought(24, vines), bound = fought(24, vines, ROUND_CAP, undefined, { ...ANSWER, hold: false });
    const cleansed = freed.filter(({ s }) => s.log.some((l) => / casts Cleanse/.test(l))).length;
    ok(won(freed) >= 0.9 && cleansed >= seeds / 4 && won(freed) >= won(bound) && !bound.some(({ s }) => s.log.some((l) => / casts Cleanse/.test(l))),
      `it plays a hold: against four controllers holding at 0.3 it frees the held by Cleanse in ${cleansed} of ${seeds} fights at 24 and wins ${pc(won(freed))}, where with no answer it wins ${pc(won(bound))}`);
    // It keeps a breath off its casters where it can (#549): with one of its front row fallen a breath
    // takes the back row, so while a drake stands it raises the fallen first. Two drakes at 25 against
    // a company whose knight lies fallen from the start breathe on the back row in fewer fights than
    // with no answer, since the gate's bot mends only the standing.
    const felledKnight = (p: Party): Party => { p.members[0].hp = -1; addCondition(HARNESS.items, p.members[0], 'unconscious'); return p; };
    const back = (fs: { s: CombatState }[]): number => fs.filter(({ s }) => s.log.some((l) => / breathes fire on the back row/.test(l))).length;
    const guarded = back(fought(25, drakeEncounter(25), ROUND_CAP, felledKnight));
    const open = back(fought(25, drakeEncounter(25), ROUND_CAP, felledKnight, { ...ANSWER, breath: false }));
    ok(guarded < open / 2, `it keeps a breath off its casters: with its knight fallen, two drakes at 25 breathe on the back row in ${guarded} of ${seeds} fights, where with no answer in ${open}`);
  }
  // The gate's company is harness's (#541): it takes its prestiges at 11, 19 and 27, with their perks
  // and ranks, as play gives them, and wears what harness's wears.
  {
    const taken = [10, 11, 19, 27].map((l) => gateCompany(l, 3)), same = taken.every((p, k) => JSON.stringify(p) === JSON.stringify(companyAt([10, 11, 19, 27][k], 3)));
    ok(same && taken.every((p, k) => p.members.every((m) => (m.prestige ?? 0) === k)), `the gate's company takes its prestiges as harness's does: ${taken.map((p) => p.members[0].prestige ?? 0).join(', ')} at 10, 11, 19 and 27, its knight a ${className(taken[3].members[0])} at 27`);
  }
  // A fight nobody finishes in fifteen rounds is broken off, and counted as not won.
  const slow = [testMonster('soldier', 1, 400, 0.01)];
  ok(gateFight(gateCompany(3, 36), slow, 36) && !gateFight(gateCompany(3, 36), slow, 36, ROUND_CAP), `a fight won only past ${ROUND_CAP} rounds is broken off at ${ROUND_CAP}, and not won`);
  // A group that asks before it fights (#544), on a fixture: the bot refuses, so the gate measures the
  // fight, the group's own; the walk past pays the price once, and in the world the group then stands
  // aside for that company, through a save and a load, where one short of the price is fought.
  {
    const toll: Choice = { ask: '"Toll."', answers: [
      { label: 'Pay', price: 300, sets: fxFlag('fx_toll_paid'), says: ['He steps aside.'] },
      { label: 'Refuse', fight: true, says: ['He stands.'] },
    ] };
    const band: EncounterDef = { id: 'fx_toll', x: 2, y: 1, monsters: ['bandit', 'bandit', 'bandit'], aware: 3, roams: false, choice: toll };
    const won = rate(band, 2);
    ok(gateAnswer(band)?.label === 'Refuse' && !gateAnswer({ choice: undefined }) && won === rate({ monsters: band.monsters }, 2),
      `the gate's bot refuses a toll and fights the group, its figure the group's own (${pc(won)} won at 2)`);
    const stair: MapDef = { id: 'fx_stair', name: 'Fixture Stair', kind: 'outdoor', region: 'shelf', density: 'country', start: { x: 0, y: 1, facing: EAST }, rows: [',,,,', ',,,,', ',,,,'], encounters: [band] };
    const walk = (gold: number): { p: Party; w: World; at: ReturnType<World['move']> } => {
      const p = gateCompany(2, 1); p.gold = gold;
      const w = new World(HARNESS, { fx_stair: new GameMap(stair) }, p, makeRng(1));
      return { p, w, at: w.move('forward') };
    };
    const short = walk(299), rich = walk(300);
    ok(short.at.kind === 'moved' && short.at.asks === 'fx_toll' && !short.at.encounter && !gatePass(short.p, band) && short.p.gold === 299 && !!short.w.question('fx_toll'),
      'beside the group its question comes before the fight, and a company short of the price cannot pay it and is fought');
    ok(gatePass(rich.p, band) && rich.p.gold === 0 && !rich.w.question('fx_toll') && rich.w.standsAside(band) && !rich.w.adjacentGroups().length,
      'one with the price pays it, once, and the group stands aside: no question and no fight');
    const past = [rich.w.move('forward'), rich.w.move('forward')];
    const data = JSON.parse(JSON.stringify({ party: rich.p, world: rich.w.state })), loaded = new World(HARNESS, { fx_stair: new GameMap(stair) }, data.party, makeRng(1), data.world);
    ok(past.every((r) => r.kind === 'moved' && !r.asks && !r.encounter) && rich.w.state.x === 3 && loaded.standsAside(band) && !loaded.question('fx_toll'),
      'the company walks past it, through its square, and the toll is remembered through a save and a load');
  }
  // A group's time to walk: fog brings the bows' toll to its fights, and nothing else does; an
  // `until` changes no fight.
  {
    const bows = new Array(6).fill('smuggler_bowman'), dry = rate({ monsters: bows }, 1), fog = rate({ monsters: bows, when: { sky: 'fog' } }, 1);
    ok(fog !== dry && rate({ monsters: bows, when: [{ hours: 'night' }, { season: 'winter' }] }, 1) === dry, `six smuggler bowmen that walk only in fog are fought in it (${pc(fog)} won at 1, against ${pc(dry)} dry), and by night or in winter dry`);
    ok(rate({ monsters: bows, when: [{ sky: 'fog' }, { hours: 'night' }] }, 1) === dry, 'and one that walks in fog or by night is fought dry too');
    // The ground (#536): six bowmen placed on ice are fought from under it, reaching the front row
    // alone, and won more often; the walk from a way in crosses ash, pine and ice as open ground.
    const iced = rate({ monsters: bows, under: 'ice' }, 1);
    ok(iced > dry, `six smuggler bowmen under the ice are fought from under it (${pc(iced)} won at 1, against ${pc(dry)} on dry ground)`);
    const strip: MapDef = { id: 'fx_strip', name: 'Strip', kind: 'outdoor', start: { x: 1, y: 1, facing: 0 }, rows: ['MMMMMMM', 'M,apiaM', 'MMMMMMM'] };
    ok(stepsFrom(strip)(5, 1) === 4, `the walk from a way in crosses ash, pine and ice (${stepsFrom(strip)(5, 1)} steps over four squares)`);
    // A peak and a cliff (#543) are the mountain's rock to the walk, which goes as a company with every
    // skill: climbed as the mountain is, the road through them walked.
    const cut: MapDef = { id: 'fx_cut', name: 'Cut', kind: 'outdoor', start: { x: 1, y: 1, facing: 0 }, rows: ['MMMMMMM', 'M=A=|=M', 'MMMMMMM'] };
    ok(stepsFrom(cut)(5, 1) === 4, `the walk from a way in climbs a peak and a cliff as it does the mountain (${stepsFrom(cut)(5, 1)} steps over four squares)`);
    // The steppe, the dunes and the vines (#543) are open ground to the walk; the volcano and a vent
    // in it are the mountain's rock, climbed as it is.
    const far: MapDef = { id: 'fx_far', name: 'Far', kind: 'outdoor', start: { x: 1, y: 1, facing: 0 }, rows: ['MMMMMMMMM', 'M,su&V@=M', 'MMMMMMMMM'] };
    ok(stepsFrom(far)(7, 1) === 6, `the walk from a way in crosses steppe, dunes and vines and climbs the volcano and a vent (${stepsFrom(far)(7, 1)} steps over six squares)`);
  }
}
