// The knight's four feats (DESIGN §5, #1113), on the frame of combat/feats.ts, with the bots' policy
// for them. Challenge holds a group's blows on the knight for CHALLENGE_ROUNDS (`CombatState.challenge`,
// read where a monster picks whom its blow falls on, `challenger` in combat/foes.ts): a bow's and a
// blade's where they reach it, not its spells, sweeps or breaths; one challenge stands at a time.
// Mighty Blow is one blow of the knight's weapon, sure to land, for double, and never a crit, so it
// draws no chance. Rally lifts the front row's to-hit by RALLY_HIT for RALLY_ROUNDS (`CombatState.rally`,
// read in `buffHit`) and frees the front row of sleep and paralysis. Champion's Strike is an Attack
// whose every blow that lands crits (#1114), crits on or off, with no chance drawn. The rounds count as
// Bless's do: the round a feat is used in is its first.
import { FRONT_ROW, RALLY_HIT, standing, describe } from '../state.ts';
import { isDown, hasCondition, removeCondition } from '../../party.ts';
import type { Character } from '../../party.ts';
import { CHALLENGE_LINE, MIGHTY_LINE, RALLY_LINE, CHAMPION_LINE } from '../lines.ts';
import type { FeatClass, FeatDef } from '../feats.ts';

/** The rounds a Challenge holds and a Rally lasts. */
export const CHALLENGE_ROUNDS = 2, RALLY_ROUNDS = 3;

/** One of the company not down but asleep or held: what a Rally frees in the front row. */
const bound = (m: Character): boolean => !isDown(m) && (hasCondition(m, 'asleep') || hasCondition(m, 'paralysed'));

const challenge: FeatDef = {
  id: 'challenge', cls: 'knight', level: 1, cost: 2, name: 'Challenge', text: 'A group strikes only the knight for two rounds.', target: 'group',
  use: ({ s, c, i, target }) => {
    const group = s.monsters[target].group;
    s.challenge = { by: i, group, rounds: CHALLENGE_ROUNDS };
    s.log.push(CHALLENGE_LINE(c.name, describe(s.monsters.filter((m) => m.group === group && standing(m)))));
  },
};
const mightyBlow: FeatDef = {
  id: 'mighty_blow', cls: 'knight', level: 8, cost: 3, name: 'Mighty Blow', text: 'One blow, sure to land, for double.', target: 'blow',
  use: ({ strike }) => strike({ blows: 1, sure: true, times: 2, crits: false, mark: MIGHTY_LINE }),
};
const rally: FeatDef = {
  id: 'rally', cls: 'knight', level: 15, cost: 4, name: 'Rally', text: `The front row hits +${RALLY_HIT} for three rounds and shakes off sleep and paralysis.`, target: 'none',
  use: ({ s, party, c }) => {
    const freed = party.members.slice(0, FRONT_ROW).filter(bound);
    for (const m of freed) { removeCondition(m, 'asleep'); removeCondition(m, 'paralysed'); }
    s.rally = RALLY_ROUNDS;
    s.log.push(RALLY_LINE(c.name, freed));
  },
};
const championsStrike: FeatDef = {
  id: 'champions_strike', cls: 'knight', level: 23, cost: 5, name: "Champion's Strike", text: 'Every blow this turn that lands crits.', target: 'blow',
  use: ({ s, c, strike }) => { s.log.push(CHAMPION_LINE(c.name)); strike({ crits: true }); },
};

export const KNIGHT: FeatClass = {
  feats: [challenge, mightyBlow, rally, championsStrike],
  // The rounds a Challenge holds and a Rally lasts, counted down at a round's end.
  round: (s) => { if (s.challenge && --s.challenge.rounds <= 0) delete s.challenge; if (s.rally) s.rally--; },
  // The bots' policy: the first of these that pays, in this order, or none and the knight strikes.
  bot: ({ s, p, c, i, foe, has }) => {
    // Champion's Strike whenever it can: every blow of the turn that lands is doubled.
    if (has(championsStrike.id)) return { featId: championsStrike.id, target: foe };
    // Rally where one of the front row is asleep or held: it frees them, and the row hits the harder.
    if (has(rally.id) && p.members.slice(0, FRONT_ROW).some(bound)) return { featId: rally.id, target: i };
    // Mighty Blow while there is no Champion's Strike to save for: a sure blow for double.
    if (has(mightyBlow.id) && c.level < championsStrike.level) return { featId: mightyBlow.id, target: foe };
    // Challenge from the front row, the knight over half its hit points, no challenge running and
    // another of the company under half its own: the group with the most foes standing strikes the
    // knight in its place.
    if (!has(challenge.id) || i >= FRONT_ROW || s.challenge || c.hp <= c.maxHp / 2 || !p.members.some((m, j) => j !== i && !isDown(m) && m.hp < m.maxHp / 2)) return undefined;
    const up = s.monsters.filter(standing), most = up.reduce((a, m) => (up.filter((q) => q.group === m.group).length > up.filter((q) => q.group === a.group).length ? m : a), up[0]);
    return most && { featId: challenge.id, target: s.monsters.indexOf(most) };
  },
};
