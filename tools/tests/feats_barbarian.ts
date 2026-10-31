// The barbarian's four feats (#1113; DESIGN §5, game/combat/feats/barbarian.ts), on the frame the feats
// suite holds. Frenzy has it rage for three rounds whatever its wounds, its blows the harder and its
// stamina the faster; Cleave is a blow at each foe of the front rank, one each and no more; War Cry has a
// group that breaks break with half of it down, and the fled pay nothing; Deathless keeps it on its feet
// under 0 hit points for three rounds, to its death line, and then it falls. Off, each is refused with
// nothing drawn; on and none spent, a company with a barbarian plays as off; and the bots spend on each
// where the barbarian's policy finds it pays, never on one barred.
import { makeRng } from '../../src/lib/engine/rng.ts';
import type { RngInstance } from '../../src/lib/engine/rng.ts';
import { createCharacter, createParty, CLASSES, RAGE_DMG, deathAt, isDown, hasCondition } from '../../src/game/party.ts';
import type { Character, ClassId, Party } from '../../src/game/party.ts';
import { startCombat, partyAct, currentTurn, monsterAct, traitDamage, canReach, aliveMonsters } from '../../src/game/combat.ts';
import type { CombatState, CombatOpts, PartyAction } from '../../src/game/combat.ts';
import { rages } from '../../src/game/combat/perks.ts';
import { fightsOn } from '../../src/game/combat/foes.ts';
import { FEATS, featsOf, featFor } from '../../src/game/combat/feats.ts';
import { FRENZY_ROUNDS, DEATHLESS_ROUNDS } from '../../src/game/combat/feats/barbarian.ts';
import { FRENZY_LINE, CLEAVE_LINE, WAR_CRY_LINE, DEATHLESS_LINE, FIGHTS_ON_LINE, FALLS_LINE } from '../../src/game/combat/lines.ts';
import { botTurn, asSeen, asWritten, PLAYED } from '../../src/game/bot.ts';
import type { BotOpts } from '../../src/game/bot.ts';
import type { ItemDef } from '../../src/game/items.ts';
import type { MonsterDef } from '../../src/game/monsters.ts';
import type { Tables } from '../../src/game/tables.ts';
import { featRows } from '../../src/ui/combat.ts';
import { MONSTERS, TABLES } from '../../src/content/index.ts';
import { newerCompany } from '../kit/company.ts';
import { gateTurn } from '../kit/fight.ts';
import { ok } from './lib.ts';

/** A blade that always does 1, +4 and the barbarian's Might, so a blow's damage is the same on every draw. */
const BLADE: ItemDef = { id: 'fx_blade', name: 'Blade', slot: 'weapon', price: 0, dice: 1, sides: 1, bonus: 4 };
const T: Tables = { ...TABLES, items: { ...TABLES.items, fx_blade: BLADE } };
/** Foes from the rat, slow so the barbarian acts first: one never hit back by and hit at the most, a kind and a name given. */
const foe = (id: string, d: Partial<MonsterDef>): MonsterDef => ({ ...MONSTERS.rat, inflict: undefined, id, hp: 5000, dice: 1, sides: 1, bonus: 0, ac: -100, attack: -50, speed: 1, ...d });
const named = (id: string, name: string, d: Partial<MonsterDef> = {}): MonsterDef => foe(`test_${id}`, { name, plural: `${name}s`, ...d });
const STRAW = foe('test_straw', {}), WALL = foe('test_wall', { ac: 1000 }), FRAIL = named('frail', 'Frail', { hp: 1 });
const MAN = named('man', 'Man', { kind: 'person', plural: 'Men' }), BONES = named('bones', 'Bones', { kind: 'dead', plural: 'Bones' }), HAND = named('hand', 'Hand', { kind: 'person', steady: true });
/** A foe that strikes after the barbarian and always hits, for 1 + `bonus`. */
const hammer = (bonus: number, d: Partial<MonsterDef> = {}): MonsterDef => named(`hammer${bonus}`, 'Hammer', { attack: 50, bonus, ...d });

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
/** A fight of `p` against one band of foes (its last `back` in the back rank) or several, the feats on unless `opts` says. */
function fight(p: Party, groups: readonly (readonly MonsterDef[])[], seed: number, opts: CombatOpts = { feats: true }, back = 0): { f: CombatState; rng: ReturnType<typeof counted> } {
  const rng = counted(seed);
  return { f: startCombat(T, p, groups.map((monsters, k) => ({ id: `g${k}`, monsters, back })), rng, opts), rng };
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
const BARB = FEATS.filter((x) => x.cls === 'barbarian');
const B = 'barbarian';

export function feats_barbarian(): void {
  off();
  frenzy();
  cleave();
  warCry();
  deathless();
  bots();
}

function off(): void {
  // Off in play: each feat refused with nothing drawn, said or marked, and the bots try none.
  const p = createParty([member(B, 23, true)]), { f, rng } = fight(p, [[STRAW]], 1, {});
  until(f, p, rng, 0);
  const was = f.log.length, drawn = rng.draws(), refused = BARB.every((x) => !partyAct(f, p, rng, feat(x.id)));
  ok(refused && f.log.length === was && rng.draws() === drawn && f.frenzy === undefined && f.deathless === undefined && f.cried === undefined && featFor(f, p, 0, 0) === undefined,
    "off, each of the barbarian's feats is refused with nothing drawn, said or marked, and the bots try none");

  // On and none spent, the newer company (its barbarian in front) plays as off, line for line and draw
  // for draw: Rage, the monsters' blows, spells and sweeps on it and the groups' morale as before.
  const groups: MonsterDef[][] = [['smuggler', 'smuggler', 'smuggler_bowman', 'smuggler_captain'], ['boar', 'boar', 'boar', 'boar'], ['skeleton', 'drowned_chanter', 'stair_giant']].map((g) => g.map((id) => MONSTERS[id]));
  let same = 0, cases = 0, fled = 0;
  for (const level of [4, 12, 23]) for (const g of groups) for (let seed = 1; seed <= 3; seed++) {
    const play = (opts: CombatOpts): { log: string; draws: number } => {
      const q = newerCompany(level, seed), { f: x, rng: r } = fight(q, [g], seed, opts);
      for (let n = 0; n < 400 && x.outcome === 'ongoing'; n++) { const t = currentTurn(x, q, r); if (!t) break; if (t.side === 'monster') monsterAct(x, q, r); else botTurn(x, q, r, t.i); }
      return { log: x.log.join('\n'), draws: r.draws() };
    };
    const a = play({}), b = play({ feats: true });
    cases++;
    if (a.log === b.log && a.draws === b.draws) same++;
    if (/ (breaks? and runs?|bolts?)\./.test(a.log)) fled++;
  }
  ok(same === cases && fled > 0, `the feats on and none spent, ${same} of ${cases} fights of the newer company play as off, line and draw alike (${fled} with a group breaking)`);

  // The registry: the barbarian's four as DESIGN §5 has them, each at its level and as it affords it.
  ok(BARB.map((x) => `${x.name} ${x.cost} ${x.level}`).join(', ') === 'Frenzy 2 1, Cleave 3 8, War Cry 3 15, Deathless 5 23',
    "the barbarian's four as DESIGN §5 has them: Frenzy (2) at 1, Cleave (3) at 8, War Cry (3) at 15, Deathless (5) at 23");
  const has = (level: number, st: number, slot = 0): string => {
    const c = member(B, level, true), r = createParty(slot ? [member('cleric'), member('cleric'), member('cleric'), c] : [c]), { f: x } = fight(r, [[STRAW]], 1);
    x.stamina![slot] = st;
    return featsOf(x, r, slot).map((d) => d.id).join();
  };
  const by = [has(1, 6), has(8, 2), has(8, 3), has(15, 3), has(23, 4), has(23, 5), has(23, 6, 3)];
  ok(by.join(' ') === 'frenzy frenzy frenzy,cleave frenzy,cleave,war_cry frenzy,cleave,war_cry frenzy,cleave,war_cry,deathless frenzy,war_cry,deathless',
    `a barbarian has its feats by its level and may use those it affords, Cleave not from the back row with a blade (${by.join(' ')})`);
  const rows = (() => { const r = createParty([member(B, 23, true)]), { f: x } = fight(r, [[STRAW]], 1); x.stamina![0] = 3; return featRows(T, r, x, 0).map((d) => `${d.label}${d.disabled ? '-' : ''}`).join(); })();
  ok(rows === 'Frenzy (2),Cleave (3),War Cry (3),Deathless (5)-', `the Feat list on 3 stamina: ${rows}`);
}

function frenzy(): void {
  // Frenzy: a barbarian at full health rages for the round it is used in and the two after, as Bless
  // counts, its blows +RAGE_DMG and each that lands building 2; then as before, building 1.
  const c = member(B, 1, true), q = createParty([c, member('cleric')]), { f, rng } = fight(q, [[STRAW]], 2);
  until(f, q, rng, 0);
  const calm = traitDamage(f, c, BLADE, f.monsters[0], false, 0), before = rages(f, c, 0);
  const said = act(f, q, rng, 0, feat('frenzy'), 2), spent = f.stamina![0];
  const raging = traitDamage(f, c, BLADE, f.monsters[0], false, 0), harness = traitDamage(f, c, BLADE, f.monsters[0], false);
  const rounds: boolean[] = [rages(f, c, 0)], built: string[] = [];
  while (f.outcome === 'ongoing') {
    const t = currentTurn(f, q, rng);
    if (!t || f.round > 4) break;
    if (f.round > rounds.length) rounds.push(rages(f, c, 0));
    if (t.side === 'party' && t.i === 0) {
      const st = f.stamina![0], at = f.log.length;
      partyAct(f, q, rng, { type: 'attack', target: 0 });
      const hits = f.log.slice(at).filter((l) => l.startsWith(`${B} hits `));
      built.push(`${hits.length}:${f.stamina![0] - st}:${hits.map((l) => / for (\d+)\./.exec(l)?.[1]).join('')}`);
    } else if (t.side === 'monster') monsterAct(f, q, rng); else partyAct(f, q, rng, { type: 'defend' });
  }
  ok(!before && said?.join() === FRENZY_LINE(B) && said?.[0] === 'barbarian flies into a frenzy.' && spent === 0 && raging === calm + RAGE_DMG && harness === calm && FRENZY_ROUNDS === 3 && rounds.join() === 'true,true,true,false',
    `a frenzy has a barbarian at full health rage, its blows +${RAGE_DMG} (${calm} to ${raging}), the round it is used in and the two after (rounds 1 to 4: ${rounds.join(', ')}): "${said?.[0]}"`);
  const blade = 1 + 4 + 1;
  ok(built.join() === `1:2:${blade + RAGE_DMG},1:2:${blade + RAGE_DMG},1:1:${blade}`,
    `while it rages each blow of its own that lands is ${RAGE_DMG} the harder and builds 2, after it as before and 1 (hits:built:damage in rounds 2 to 4: ${built.join(', ')})`);

  // A second sets three again; with 1 stamina it is refused, nothing spent.
  const r = createParty([member(B, 1, true)]), x = fight(r, [[STRAW]], 3);
  act(x.f, r, x.rng, 0, feat('frenzy'), 2);
  until(x.f, r, x.rng, 0);
  const left = x.f.frenzy![0], again = act(x.f, r, x.rng, 0, feat('frenzy'), 2) !== null, reset = x.f.frenzy![0];
  const refusedAt1 = act(x.f, r, x.rng, 0, feat('frenzy'), 1) === null && x.f.stamina![0] === 1;
  ok(left === 2 && again && reset === FRENZY_ROUNDS && refusedAt1,
    `a second frenzy sets its three rounds again (${left} left before it, ${reset} after); with 1 stamina it is refused and nothing spent`);
}

function cleave(): void {
  // Cleave: one blow at each foe of the front rank, the one aimed at first, whatever its blows a turn,
  // none at the back rank; each landing builds stamina; the log says it, then each blow its own.
  const ASH = named('ash', 'Ash'), BIRCH = named('birch', 'Birch'), CEDAR = named('cedar', 'Cedar'), ELM = named('elm', 'Elm'), FIR = named('fir', 'Fir');
  const c = member(B, 11, true);
  c.prestige = 1;
  const q = createParty([c]), { f, rng } = fight(q, [[ASH, BIRCH, CEDAR, ELM, FIR]], 1, { feats: true }, 2);
  const said = act(f, q, rng, 0, feat('cleave', 1), 3) ?? [], hits = said.filter((l) => l.startsWith(`${B} hits `)).length;
  ok(said[0] === CLEAVE_LINE(B, 'Ash, Birch, Cedar') && said.slice(1).map((l) => / (Ash|Birch|Cedar|Elm|Fir)\b/.exec(l)?.[1]).join() === 'Birch,Ash,Cedar'
    && f.monsters[3].hp === 5000 && f.monsters[4].hp === 5000 && hits > 0 && f.stamina![0] === hits,
    `a cleave is a blow at each of the front rank, the one aimed at first, one each where the barbarian strikes twice, none behind, each landing building 1 (${hits}, ${f.stamina![0]}): "${said.join(' | ')}"`);

  // Each blow its own to-hit: at three foes hit one time in twenty it draws a chance for each and a die for each that lands.
  const w = createParty([member(B, 8, true)]), wf = fight(w, [[WALL, WALL, WALL]], 4);
  until(wf.f, w, wf.rng, 0);
  const was = wf.rng.draws(), walls = act(wf.f, w, wf.rng, 0, feat('cleave'), 3) ?? [], landed = walls.filter((l) => l.includes(' hits ')).length;
  ok(walls.length === 4 && walls.slice(1).filter((l) => l.includes(' misses ')).length > 0 && wf.rng.draws() - was === 3 + landed,
    `each blow rolls its own to-hit: at three foes hit one time in twenty, ${3 - landed} missed, ${wf.rng.draws() - was} drawn`);

  // A foe it fells is not struck again nor its blow passed on, though the back rank is then in reach;
  // the front down, the back rank is the one it cleaves.
  const t = createParty([member(B, 8, true)]), tf = fight(t, [[FRAIL, FRAIL, ELM, FIR]], 5, { feats: true }, 2);
  const felled = act(tf.f, t, tf.rng, 0, feat('cleave'), 3) ?? [], behind = tf.f.monsters[2].hp === 5000 && tf.f.monsters[3].hp === 5000;
  const nextCleave = act(tf.f, t, tf.rng, 0, feat('cleave', 2), 3) ?? [];
  ok(felled.length === 3 && felled.slice(1).every((l) => l.endsWith(' Frail dies.')) && behind && nextCleave[0] === CLEAVE_LINE(B, 'Elm, Fir') && nextCleave.length === 3,
    `a foe a cleave fells is not struck again and no blow passes to the back rank ("${felled.join(' | ')}"); the front down, it cleaves the back ("${nextCleave[0]}")`);

  // From the back row: a blade may not, nothing spent; a bow looses one at each of the front rank and
  // may not be aimed at the back.
  const back = createParty([member('cleric'), member('cleric'), member('cleric'), member(B, 8, true)]), bk = fight(back, [[ASH, BIRCH, ELM]], 1, { feats: true }, 1);
  const bladed = act(bk.f, back, bk.rng, 3, feat('cleave'), 3) === null && bk.f.stamina![3] === 3;
  back.members[3].equipment.weapon = 'longbow';
  const atBack = act(bk.f, back, bk.rng, 3, feat('cleave', 2), 3) === null && bk.f.stamina![3] === 3, shot = act(bk.f, back, bk.rng, 3, feat('cleave', 0), 3) ?? [];
  ok(bladed && atBack && shot[0] === CLEAVE_LINE(B, 'Ash, Birch') && shot.length === 3 && bk.f.monsters[2].hp === 5000,
    `from the back row a blade may not cleave and a bow not at the back rank, nothing spent; a bow looses one at each of the front ("${shot.join(' | ')}")`);
}

function warCry(): void {
  // War Cry: a group that breaks breaks with half of it down, not waiting for a leader or three in four.
  // `kill` the first `n` of it, then play on to the barbarian's next turn: who has fled, and the lines.
  const cry = (foes: MonsterDef[], n: number, cried = true, back = 0, at = 0): { fled: string; lines: string[]; f: CombatState; said: string[] | null } => {
    const q = createParty([member(B, 15, true), member('cleric')]), { f, rng } = fight(q, [foes], 6, { feats: true }, back);
    const said = cried ? act(f, q, rng, 0, feat('war_cry', at), 3) : (until(f, q, rng, 0), []);
    for (let k = 0; k < n; k++) f.monsters[k].hp = 0;
    const from = f.log.length, t = currentTurn(f, q, rng);
    // A turn played, whoever's, so that the fight looks at its morale; then on to the barbarian's.
    if (t?.side === 'monster') monsterAct(f, q, rng); else if (t) partyAct(f, q, rng, { type: 'defend' });
    until(f, q, rng, 0);
    return { fled: f.monsters.map((m) => (m.fled ? 'F' : m.hp > 0 ? '-' : 'x')).join(''), lines: f.log.slice(from), f, said };
  };
  const men = cry([MAN, MAN, MAN, MAN], 2), rats = cry([STRAW, STRAW, STRAW, STRAW], 2), calmMen = cry([MAN, MAN, MAN, MAN], 2, false), calmRats = cry([STRAW, STRAW, STRAW, STRAW], 2, false);
  ok(men.said?.join() === WAR_CRY_LINE(B, '4 Men') && men.fled === 'xxFF' && men.lines.includes('2 Men break and run.') && rats.fled === 'xxFF' && calmMen.fled === 'xx--' && calmRats.fled === 'xx--',
    `cried at, four men and four rats break with two down (${men.fled}, ${rats.fled}) where uncried they stand (${calmMen.fled}, ${calmRats.fled}): "${men.said?.[0]}" "${men.lines.find((l) => l.includes('break'))}"`);
  const odd1 = cry([MAN, MAN, MAN], 1), odd2 = cry([MAN, MAN, MAN], 2), bones = cry([BONES, BONES, BONES, BONES], 2), steady = cry([MAN, MAN, MAN, HAND], 2);
  ok(odd1.fled === 'x--' && odd2.fled === 'xxF' && bones.fled === 'xx--' && steady.fled === 'xxF-',
    `half is rounded up: three break at two down, not one (${odd1.fled}, ${odd2.fled}); the dead never break (${bones.fled}) nor the steady (${steady.fled})`);
  const rank = cry([MAN, MAN, MAN, MAN], 1, true, 2);
  ok(rank.fled === 'xF--', `it marks the rank aimed at, a band's front, not its back rank (${rank.fled})`);

  // The fled pay nothing: two slain and two fled pay half what four slain do.
  const paid = cry([MAN, MAN, MAN, MAN], 2), all = cry([MAN, MAN, MAN, MAN], 4, false);
  ok(paid.f.outcome === 'victory' && all.f.outcome === 'victory' && paid.f.loot!.xp > 0 && 2 * paid.f.loot!.xp === all.f.loot!.xp,
    `a group broken by the cry pays nothing for its fled: ${paid.f.loot!.xp} experience where four slain pay ${all.f.loot!.xp}`);

  // A second at a group cried at is refused, nothing spent; one at another group stands too.
  const q = createParty([member(B, 15, true)]), { f, rng } = fight(q, [[MAN, MAN], [STRAW, STRAW]], 7);
  act(f, q, rng, 0, feat('war_cry', 0), 3);
  const again = act(f, q, rng, 0, feat('war_cry', 1), 3) === null && f.stamina![0] === 3, other = act(f, q, rng, 0, feat('war_cry', 2), 3) !== null;
  ok(again && other && f.cried!.join() === '0,1', `a second cry at a group cried at is refused and nothing spent; at another it marks that one too (${f.cried!.join(', ')})`);
}

function deathless(): void {
  // Deathless: struck under 0 the barbarian fights on, has its turns and is struck as one standing; its
  // three rounds out, it falls, out cold above its death line. Without it, the same blow fells it.
  const run = (hp: number, foes: MonsterDef[], d = true, seed = 2, rounds = 4, set?: (c: Character) => void): { c: Character; f: CombatState; said: string[] | null; turns: string[]; log: string[] } => {
    const c = member(B, 23, true), q = createParty([c]), { f, rng } = fight(q, [foes], seed);
    c.hp = hp;
    set?.(c);
    const said = d ? act(f, q, rng, 0, feat('deathless'), 5) : (until(f, q, rng, 0), partyAct(f, q, rng, { type: 'attack', target: 0 }), []);
    const turns: string[] = [];
    while (f.outcome === 'ongoing' && f.round <= rounds) {
      const t = currentTurn(f, q, rng);
      if (!t) break;
      if (t.side === 'party') { turns.push(`${f.round}:${c.hp}`); partyAct(f, q, rng, { type: 'attack', target: 0 }); } else monsterAct(f, q, rng);
    }
    return { c, f, said, turns, log: f.log };
  };
  const held = run(5, [hammer(7)]), on = held.log.filter((l) => l.endsWith(`Hammer hits ${B} for 8. ${FIGHTS_ON_LINE(B)}`)).length;
  ok(held.said?.join() === DEATHLESS_LINE(B) && DEATHLESS_ROUNDS === 3 && on === 3 && held.turns.join() === '2:-3,3:-11' && held.c.hp === -19 && hasCondition(held.c, 'unconscious') && !hasCondition(held.c, 'dead')
    && held.log.indexOf(FALLS_LINE(B)) === held.log.length - 2 && held.f.outcome === 'defeat',
    `under its deathless a barbarian struck under 0 fights on (${on} times) and has its turns (round:hp ${held.turns.join(', ')}), the round it is used in and the two after; then it falls, out cold at ${held.c.hp}: "${held.said?.[0]}" "${held.log.find((l) => l.includes(FIGHTS_ON_LINE(B)))}" "${FALLS_LINE(B)}"`);
  const bare = run(5, [hammer(7)], false);
  ok(bare.log.some((l) => l === `Hammer hits ${B} for 8. ${B} falls!`) && hasCondition(bare.c, 'unconscious') && bare.turns.length === 0, 'without it, the same blow fells the barbarian and it has no turn after');

  // To its death line: at −8 struck for 15 it dies at the line, as any member, and the log says it falls.
  const dies = run(7, [hammer(14)]);
  ok(deathAt(dies.c) === -20 && dies.c.hp === -20 && hasCondition(dies.c, 'dead') && dies.turns.join() === '2:-8' && dies.log.includes(`Hammer hits ${B} for 15. ${B} falls!`),
    `struck past its death line it dies there (${dies.c.hp}), as any member: "Hammer hits ${B} for 15. ${B} falls!"`);

  // A sweep and a poison under it as a blow; the fight won while it runs, it falls at the end.
  const swept = run(5, [hammer(7, { sweep: { chance: 1 } })], true, 2, 1), poisoned = run(1, [STRAW], true, 2, 1, (c) => { c.conditions.push('poisoned'); });
  const won = run(5, [hammer(7, { hp: 1 })], true, 2, 2);
  ok(swept.log.some((l) => l.includes(' sweeps the front row: 8 damage.') && l.endsWith(FIGHTS_ON_LINE(B))) && !isDown(swept.c)
    && poisoned.log.includes(`${B} suffers from poison. ${FIGHTS_ON_LINE(B)}`) && poisoned.c.hp === 0 && !isDown(poisoned.c)
    && won.f.outcome === 'victory' && hasCondition(won.c, 'unconscious') && won.c.hp === -3 && won.log[won.log.length - 2] === FALLS_LINE(B),
    `a sweep and a poison that fell it leave it fighting on as a blow does; a fight won while it runs leaves it out cold at ${won.c.hp}: "${won.log.slice(-3).join(' | ')}"`);

  // A second sets three again; with 4 stamina, or below 23, it is refused.
  const q = createParty([member(B, 23, true)]), { f, rng } = fight(q, [[STRAW]], 2);
  act(f, q, rng, 0, feat('deathless'), 5);
  until(f, q, rng, 0);
  const left = f.deathless![0], again = act(f, q, rng, 0, feat('deathless'), 5) !== null, poor = act(f, q, rng, 0, feat('deathless'), 4) === null;
  const young = createParty([member(B, 22, true)]), y = fight(young, [[STRAW]], 2);
  ok(left === 2 && again && poor && act(y.f, young, y.rng, 0, feat('deathless'), 6) === null, `a second deathless sets its three rounds again (${left} left before it); with 4 stamina, or at 22, it is refused`);

  // From the second slot, a Frenzy and a Deathless are the slot's that used them.
  const c = member(B, 23, true), two = createParty([member('cleric'), c]), z = fight(two, [[STRAW]], 2);
  act(z.f, two, z.rng, 1, feat('frenzy'), 2);
  const raged = rages(z.f, c, 1) && !z.f.frenzy![0];
  act(z.f, two, z.rng, 1, feat('deathless'), 5);
  c.hp = -3; c.conditions.push('unconscious');
  ok(raged && fightsOn(z.f, two, c) === ` ${FIGHTS_ON_LINE(B)}` && !isDown(c) && !z.f.deathless![0], 'from the second slot, a frenzy and a deathless are that slot\'s');
}

function bots(): void {
  // The bots' policy, by construction: the first that pays, or a blow.
  const choose = (level: number, st: number, groups: MonsterDef[][] = [[STRAW]], set?: (c: Character, f: CombatState) => void, opts: BotOpts = { feats: true }): string => {
    const c = member(B, level, true), q = createParty([c, member('cleric')]), x = fight(q, groups, 9);
    until(x.f, q, x.rng, 0);
    x.f.stamina![0] = st;
    set?.(c, x.f);
    const a = botTurn(x.f, q, x.rng, 0, asWritten, opts);
    return a.type === 'feat' ? `${a.featId}@${a.target}` : a.type;
  };
  const wounded = (c: Character): void => { c.hp = 1; }, bare = (c: Character): void => { c.equipment.weapon = null; };
  const picks = [
    choose(1, 2, undefined, bare), choose(1, 2), choose(1, 2, undefined, (c) => { c.equipment.weapon = 'shortbow'; }), choose(1, 2, undefined, (c) => { bare(c); wounded(c); }),
    choose(1, 2, undefined, (c, f) => { bare(c); f.frenzy = [1, 0]; }), choose(8, 3, [[STRAW, STRAW]]), choose(8, 3, undefined, bare),
    choose(15, 3, [[STRAW, STRAW, STRAW, STRAW]]), choose(15, 3, [[BONES, BONES, BONES, BONES]]), choose(15, 3, [[MAN, MAN, MAN]]),
    choose(23, 5), choose(23, 5, undefined, wounded), choose(23, 5, undefined, (c, f) => { wounded(c); f.deathless = [2, 0]; }), choose(23, 5, undefined, (c, f) => { wounded(c); f.deathless = [1, 0]; }), choose(23, 5, undefined, wounded, {}),
  ];
  ok(picks.join(' ') === 'frenzy@0 attack attack attack attack cleave@0 frenzy@0 war_cry@0 cleave@0 cleave@0 attack deathless@0 attack deathless@0 attack',
    `the bots frenzy where two rounds of rage outweigh a turn's blows (bare hands, not a blade of 6 a blow nor a bow) and it rages not yet, cleave where the front outnumbers its blows, cry at four of a kind that breaks, hold off death under half and renew it in its last round, and spend nothing unasked (${picks.join(' ')})`);

  // Fights the policy plays, each feat where it pays, and never one the frame refuses; both bots.
  const played: Record<string, number> = {};
  let illegal = 0, turns = 0;
  const setups: [number, MonsterDef[][], number][] = [[1, [[STRAW]], 0], [8, [[STRAW, STRAW, STRAW]], 0], [15, [[MAN, MAN, MAN, MAN, MAN]], 0], [23, [[hammer(2, { hp: 40 })], [MAN, MAN, MAN, MAN]], 0], [27, [[WALL, MAN, MAN], [hammer(4)]], 1]];
  for (const [level, groups, back] of setups) for (let seed = 1; seed <= 4; seed++) {
    // Bare-handed at 1, where a Frenzy pays; the blade from 8.
    const c = member(B, level, level > 1);
    if (level === 1) c.equipment.weapon = null;
    if (level >= 11) c.prestige = level >= 27 ? 3 : level >= 19 ? 2 : 1;
    const q = createParty([c, member('cleric')]), { f, rng } = fight(q, groups, seed, { feats: true }, back);
    for (let n = 0; n < 120 && f.outcome === 'ongoing'; n++) {
      const t = currentTurn(f, q, rng);
      if (!t) break;
      if (t.side === 'monster') { monsterAct(f, q, rng); continue; }
      if (t.i !== 0) { partyAct(f, q, rng, { type: 'defend' }); continue; }
      turns++;
      const up = aliveMonsters(f), pick = featFor(f, q, 0, up.find((m) => canReach(f, c, m)) ?? up[0]);
      if (pick && pick.type === 'feat' && partyAct(f, q, rng, pick)) played[pick.featId] = (played[pick.featId] ?? 0) + 1;
      else { if (pick) illegal++; botTurn(f, q, rng, 0, asWritten, { feats: true }); }
    }
  }
  const each = BARB.map((x) => `${x.id} ${played[x.id] ?? 0}`).join(', ');
  ok(BARB.every((x) => (played[x.id] ?? 0) > 0) && illegal === 0, `in fights built for each, the policy plays all four (${each}, in ${turns} turns) and never one the frame refuses (${illegal})`);

  const play = (bot: (x: CombatState, q: Party, rng: RngInstance) => void): string => {
    const q = createParty([member(B, 1), member('cleric')]), { f, rng } = fight(q, [[STRAW]], 1);
    q.members[0].equipment.weapon = null;
    until(f, q, rng, 0);
    f.stamina![0] = 2;
    const at = f.log.length;
    bot(f, q, rng);
    return f.log[at] ?? '';
  };
  const gate = play((x, q, rng) => gateTurn(x, q, rng, 0)), auto = play((x, q, rng) => { botTurn(x, q, rng, 0, asSeen, PLAYED); });
  ok(gate === FRENZY_LINE(B) && auto === gate, `both bots play the barbarian's feats once a fight has them, the gate's and the game's auto-fight ("${gate}")`);
}
