// The barbarian's four feats (DESIGN §5, #1113), on the frame of combat/feats.ts, with the bots' policy
// for them. Frenzy attacks and has the barbarian rage (`rages`, combat/perks.ts: its blows' damage and its stamina)
// for FRENZY_ROUNDS whatever its wounds (`CombatState.frenzy`). Cleave is one blow of its weapon at each
// foe of the front rank that the weapon reaches, or of the back once the front is down, as the rank
// stands when it swings: the foe aimed at first, each blow its own to-hit, crit and stamina, and a foe
// it fells is not struck again nor its blow passed on. War Cry marks the group aimed at for the rest of
// the fight (`CombatState.cried`; a rank of a band, as Challenge's): it breaks with half of it down,
// rounded up, those of it that break at all, not waiting for its leader or three in four (`morale`,
// combat/foes.ts); a group that flees pays nothing, so the cry trades its experience for the company's
// safety. Deathless keeps the barbarian on its feet under 0 hit points for DEATHLESS_ROUNDS
// (`CombatState.deathless`; `fightsOn`, where a monster's blow, spell, sweep or breath or a poison
// fells it): struck to its death line it dies, as any member; its rounds out or the fight over, under
// 0 it falls (`deathlessEnds`). The rounds count as Bless's: the round a feat is used in is its first,
// and a second Frenzy or Deathless sets its rounds again.
import { standing, aliveMonsters, frontStands, describe } from '../state.ts';
import type { CombatState, MonsterInst } from '../state.ts';
import { rages, blowsOf } from '../perks.ts';
import { canReach, deathlessEnds } from '../foes.ts';
import { KINDS } from '../../monsters.ts';
import { weaponOf } from '../../party.ts';
import type { Character } from '../../party.ts';
import { FRENZY_LINE, CLEAVE_LINE, WAR_CRY_LINE, DEATHLESS_LINE } from '../lines.ts';
import type { FeatClass, FeatDef } from '../feats.ts';

/** The rounds a Frenzy and a Deathless last. */
export const FRENZY_ROUNDS = 3, DEATHLESS_ROUNDS = 3;

/** The foes a Cleave falls on: those of the front rank its weapon reaches, or of the back once the front is down. */
const cleft = (s: CombatState, c: Character): number[] => {
  const front = frontStands(s);
  return aliveMonsters(s).filter((t) => !(front && s.monsters[t].back) && canReach(s, c, t));
};

const frenzy: FeatDef = {
  id: 'frenzy', cls: 'barbarian', level: 1, cost: 2, name: 'Frenzy', text: 'Attacks and rages for three rounds, whatever its wounds.', target: 'blow',
  use: ({ s, party, c, i, strike }) => { (s.frenzy ??= party.members.map(() => 0))[i] = FRENZY_ROUNDS; s.log.push(FRENZY_LINE(c.name)); strike(); },
};
const cleave: FeatDef = {
  id: 'cleave', cls: 'barbarian', level: 8, cost: 3, name: 'Cleave', text: 'A blow at every foe of the front rank.', target: 'blow',
  aims: (s, c, t) => cleft(s, c).includes(t),
  use: ({ s, c, target, strike }) => {
    const rank = cleft(s, c);
    s.log.push(CLEAVE_LINE(c.name, describe(rank.map((t) => s.monsters[t]))));
    for (const t of [target, ...rank.filter((x) => x !== target)]) strike({ blows: 1 }, t);
  },
};
const warCry: FeatDef = {
  id: 'war_cry', cls: 'barbarian', level: 15, cost: 3, name: 'War Cry', text: 'A group that breaks breaks with half of it down, not waiting for its leader or three in four.', target: 'group',
  aims: (s, _c, t) => !!s.monsters[t] && standing(s.monsters[t]) && !s.cried?.includes(s.monsters[t].group),
  use: ({ s, c, target }) => {
    const group = s.monsters[target].group;
    (s.cried ??= []).push(group);
    s.log.push(WAR_CRY_LINE(c.name, describe(s.monsters.filter((m) => m.group === group && standing(m)))));
  },
};
const deathless: FeatDef = {
  id: 'deathless', cls: 'barbarian', level: 23, cost: 5, name: 'Deathless', text: 'For three rounds it fights on under 0 hit points, to its death line.', target: 'none',
  use: ({ s, party, c, i }) => { (s.deathless ??= party.members.map(() => 0))[i] = DEATHLESS_ROUNDS; s.log.push(DEATHLESS_LINE(c.name)); },
};

export const BARBARIAN: FeatClass = {
  feats: [frenzy, cleave, warCry, deathless],
  // The rounds a Frenzy and a Deathless last, counted down at a round's end; a Deathless run out fells one under 0.
  round: (s, party) => {
    s.frenzy?.forEach((n, i) => { if (n > 0) s.frenzy![i] = n - 1; });
    s.deathless?.forEach((n, i) => { if (n > 0 && --s.deathless![i] === 0) deathlessEnds(s, party, i); });
  },
  // The bots' policy: the first of these that pays, in this order, or none and the barbarian strikes.
  bot: ({ s, c, i, foe, has }) => {
    // Deathless under half its hit points, unless one of its own runs past this round: it fights on under 0.
    if (has(deathless.id) && c.hp < c.maxHp / 2 && (s.deathless?.[i] ?? 0) <= 1) return { featId: deathless.id, target: i };
    // War Cry at the biggest group not yet cried at, four or more of it standing that break (of a kind that
    // does, not steady): half of it down, the rest run. No leader is read, as the game's bot never knows one first.
    const loud = has(warCry.id) ? s.monsters.filter((m) => standing(m) && !m.def.steady && KINDS[m.def.kind].breaks !== 'never' && !s.cried?.includes(m.group)) : [];
    const size = (m: MonsterInst): number => loud.filter((q) => q.group === m.group).length;
    const big = loud.reduce<MonsterInst | undefined>((a, m) => (!a || size(m) > size(a) ? m : a), undefined);
    if (big && size(big) >= 4) return { featId: warCry.id, target: s.monsters.indexOf(big) };
    // Cleave where the foes it falls on outnumber an Attack's blows: it strikes more often than an Attack.
    const rank = has(cleave.id) ? cleft(s, c) : [];
    if (rank.length > blowsOf(s.tables.items, c)) return { featId: cleave.id, target: rank.includes(foe) ? foe : rank[0] };
    // Frenzy where it does not rage yet: an Attack at the foe it would strike, raging, and two more rounds
    // of rage. Never with a bow, as rage adds nothing to a shot.
    if (has(frenzy.id) && !rages(s, c, i) && !weaponOf(s.tables.items, c).ranged && canReach(s, c, foe)) return { featId: frenzy.id, target: foe };
    return undefined;
  },
};
