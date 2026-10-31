// The thief's four feats (DESIGN §5, #1113), on the frame of combat/feats.ts, with the bots' policy
// for them. Ambush is an Attack whose every blow is a sneak attack (`Strike.sneak`): a blow that is one
// by the thief's own Sneak Attack as well takes its damage once, and only its own (`sneaks`, its trait's
// and its vanishing's) builds the thief's 1 more stamina (`landed`), so that no feat pays for itself.
// Blind is one blow; landing on a foe it leaves standing, the foe hits BLIND_HIT less
// (`MonsterInst.blind`, read in `monsterHit`) for BLIND_ROUNDS, every monster alike. Hamstring is one
// blow; landing, it holds its foe fast with the game's hold (`paralysed`, as Grasping Roots holds)
// until its next turn has passed: to this round's end where that turn is still to come, else to the
// next's (`MonsterInst.hamstrung`); it does not tear free before, and one immune to holds is not held.
// Deathblow is one blow at a foe asleep or held that its weapon reaches, a sneak attack for triple, the
// whole blow, never a crit, so no chance is drawn. The rounds count as Bless's do: the round a feat is
// used in is its first.
import { BLIND_HIT, standing, describe, aliveMonsters } from '../state.ts';
import type { CombatState, MonsterInst } from '../state.ts';
import type { Character } from '../../party.ts';
import { monsterImmune } from '../../monsters.ts';
import { canReach } from '../foes.ts';
import { sneaks } from '../perks.ts';
import { AMBUSH_LINE, BLIND_LINE, HAMSTRING_LINE, UNHELD_LINE, LOOSE_LINE, DEATHBLOW_LINE } from '../lines.ts';
import type { FeatClass, FeatDef } from '../feats.ts';

/** The rounds a Blind lasts, and the most a Hamstring holds: the round it lands in and the next. */
export const BLIND_ROUNDS = 3, HAMSTRING_ROUNDS = 2;

/** A foe asleep or held: what a Deathblow may be aimed at. */
const lies = (m: MonsterInst): boolean => m.conditions.includes('asleep') || m.conditions.includes('paralysed');

const ambush: FeatDef = {
  id: 'ambush', cls: 'thief', level: 1, cost: 2, name: 'Ambush', text: 'Its blows this turn are sneak attacks.', target: 'blow',
  use: ({ s, c, strike }) => { s.log.push(AMBUSH_LINE(c.name)); strike({ sneak: true }); },
};
const blind: FeatDef = {
  id: 'blind', cls: 'thief', level: 8, cost: 3, name: 'Blind', text: `A foe it hits has -${BLIND_HIT} to hit for three rounds.`, target: 'blow',
  use: ({ strike }) => strike({ blows: 1, onLand: (m) => { m.blind = BLIND_ROUNDS; return BLIND_LINE(m.def.name); } }),
};
const hamstring: FeatDef = {
  id: 'hamstring', cls: 'thief', level: 15, cost: 3, name: 'Hamstring', text: 'A blow that, landing, holds its foe fast for a round.', target: 'blow',
  use: ({ s, strike }) => strike({
    blows: 1,
    onLand: (m) => {
      if (monsterImmune(m.def, 'paralysed')) return UNHELD_LINE(m.def.name);
      // Its next turn still to come this round is the one it loses; else the next round's.
      const at = s.order.findIndex((r) => r.side === 'monster' && r.i === s.monsters.indexOf(m));
      m.conditions = ['paralysed'];
      m.hamstrung = at > s.turn ? 1 : HAMSTRING_ROUNDS;
      return HAMSTRING_LINE(m.def.name);
    },
  }),
};
const deathblow: FeatDef = {
  id: 'deathblow', cls: 'thief', level: 23, cost: 5, name: 'Deathblow', text: 'A sneak attack on a foe asleep or held, for triple.', target: 'blow',
  aims: (s, c, t) => canReach(s, c, t) && lies(s.monsters[t]),
  use: ({ strike }) => strike({ blows: 1, sneak: true, times: 3, crits: false, mark: DEATHBLOW_LINE }),
};

/** What a foe's blow does on the mean, its dice and its bonus, as the harness weighs it. */
const hits = (m: MonsterInst): number => (m.def.dice * (m.def.sides + 1)) / 2 + m.def.bonus;
/** Of the foes member `c` reaches that `take` takes, the one that hits hardest, the first on a tie; none where none is. */
function hardest(s: CombatState, c: Character, take: (m: MonsterInst) => boolean): number | undefined {
  return aliveMonsters(s).filter((t) => canReach(s, c, t) && take(s.monsters[t])).reduce<number | undefined>((a, t) => (a === undefined || hits(s.monsters[t]) > hits(s.monsters[a]) ? t : a), undefined);
}

export const THIEF: FeatClass = {
  feats: [ambush, blind, hamstring, deathblow],
  // A Blind's rounds and a Hamstring's counted down at a round's end; the held let go once theirs are out.
  round: (s) => {
    const loose: MonsterInst[] = [];
    for (const m of s.monsters) {
      if (m.blind && --m.blind <= 0) delete m.blind;
      if (m.hamstrung && --m.hamstrung <= 0) {
        delete m.hamstrung;
        if (standing(m) && m.conditions.includes('paralysed')) { m.conditions = m.conditions.filter((k) => k !== 'paralysed'); loose.push(m); }
      }
    }
    if (loose.length) s.log.push(LOOSE_LINE(describe(loose)));
  },
  // The bots' policy: the first of these that pays, in this order, or none and the thief strikes.
  bot: ({ s, c, i, foe, has }) => {
    // Deathblow whenever it can: a sneak attack for triple on the foe the bot would strike where it
    // lies asleep or held, else on the one lying so with the most hit points.
    const lying = aliveMonsters(s).filter((t) => deathblow.aims!(s, c, t));
    if (has(deathblow.id)) return { featId: deathblow.id, target: lying.includes(foe) ? foe : lying.reduce((a, t) => (s.monsters[t].hp > s.monsters[a].hp ? t : a)) };
    // From Deathblow's level, while a foe it reaches lies so, nothing else: it builds for the Deathblow.
    if (c.level >= deathblow.level && lying.length) return undefined;
    // Hamstring while no foe lies asleep or held: the hardest hitter it reaches loses its next turn.
    const held = has(hamstring.id) && !s.monsters.some((m) => standing(m) && lies(m)) ? hardest(s, c, () => true) : undefined;
    if (held !== undefined) return { featId: hamstring.id, target: held };
    // Blind the hardest hitter it reaches that is awake, free and not blind already: it hits the less for three rounds.
    const dark = has(blind.id) ? hardest(s, c, (m) => !m.blind && !lies(m)) : undefined;
    if (dark !== undefined) return { featId: blind.id, target: dark };
    // Ambush at the foe the bot would strike, where it reaches it awake and its blows on it are no sneak
    // attacks already, each that lands then taking a sneak attack's damage, and where what it leaves
    // still pays for the thief's dearest other feat.
    const m = s.monsters[foe], dearer = Math.max(0, ...[blind, hamstring, deathblow].filter((f) => c.level >= f.level).map((f) => f.cost));
    return has(ambush.id) && (s.stamina?.[i] ?? 0) - ambush.cost >= dearer && canReach(s, c, foe) && !m.conditions.includes('asleep') && !sneaks(s, c, m) ? { featId: ambush.id, target: foe } : undefined;
  },
};
