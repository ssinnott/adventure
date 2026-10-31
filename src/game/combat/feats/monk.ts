// The monk's four feats (DESIGN §5, #1113), on the frame of combat/feats.ts, with the bots' policy for
// them. Flurry is the monk's blows a turn (`blowsOf`: two from its first prestige with a staff or bare
// hands, three from its third) and FLURRY_MORE more, each a strike of its own with its own to-hit and its
// own stamina; all are the turn's own, so a Windwalker's follow-through carries on to twice them. Quiet
// Palm is one strike that, landing on a foe it leaves standing, puts it to sleep as Slumber does, in
// place of any hold; a foe proof against sleep (`monsterImmune`: the dead, machines and their like) is
// not, and the hit's line says so. It sleeps as any sleeper: a blow or a spell that hurts it wakes it,
// and it wakes 1 in 4 at the top of a turn it then loses (game/combat.ts). Leap is one strike at a foe of
// a back rank, past the front (`FeatDef.aims`, `Strike.past`), the front standing or not, barred while
// none of a back rank stands. Wind Step is a turn's action as every feat is: the monk's blows, as an Attack's, and then
// another turn at once (`FeatDef.again`), a full action, a feat among them while its stamina holds; the
// round's order and its count are left as they were. A feat's strike that fells its foe carries on from
// the second prestige as an Attack's does, with the feat's knobs. Nothing here draws.
import { aliveMonsters, standing } from '../state.ts';
import type { MonsterInst } from '../state.ts';
import { monsterImmune } from '../../monsters.ts';
import { blowsOf } from '../perks.ts';
import { canReach } from '../foes.ts';
import { FLURRY_LINE, PALM_LINE, LEAP_LINE, WIND_LINE } from '../lines.ts';
import type { FeatClass, FeatDef } from '../feats.ts';

/** The strikes a Flurry adds to the monk's own. */
export const FLURRY_MORE = 2;

/** A Quiet Palm landing on a foe it leaves standing: asleep, as Slumber sleeps one, unless proof against it; the words after the hit. */
function palm(m: MonsterInst): string {
  const sleeps = !monsterImmune(m.def, 'asleep');
  if (sleeps) m.conditions = ['asleep'];
  return PALM_LINE(m.def.name, sleeps);
}

const flurry: FeatDef = {
  id: 'flurry', cls: 'monk', level: 1, cost: 2, name: 'Flurry', text: 'Two more strikes this turn.', target: 'blow',
  use: ({ s, c, strike }) => {
    const edge = s.edge?.(c, s);
    s.log.push(FLURRY_LINE(c.name));
    strike({ blows: blowsOf(s.tables.items, c) + (edge ? edge.blows - 1 : 0) + FLURRY_MORE });
  },
};
const quietPalm: FeatDef = {
  id: 'quiet_palm', cls: 'monk', level: 8, cost: 3, name: 'Quiet Palm', text: 'A strike that, landing, puts its foe to sleep.', target: 'blow',
  use: ({ strike }) => strike({ blows: 1, onLand: palm }),
};
const leap: FeatDef = {
  id: 'leap', cls: 'monk', level: 15, cost: 3, name: 'Leap', text: 'Strikes a foe of the back rank, past the front.', target: 'blow',
  aims: (s, _c, t) => !!s.monsters[t]?.back && standing(s.monsters[t]),
  use: ({ s, c, strike }) => { s.log.push(LEAP_LINE(c.name)); strike({ blows: 1, past: true }); },
};
const windStep: FeatDef = {
  id: 'wind_step', cls: 'monk', level: 23, cost: 5, name: 'Wind Step', text: 'Attacks, then takes another turn at once.', target: 'blow', again: true,
  use: ({ s, c, strike }) => { s.log.push(WIND_LINE(c.name)); strike(); },
};

/** A foe's blow as its dice give it on the mean: what the bots' Quiet Palm weighs. */
const hits = (m: MonsterInst): number => (m.def.dice * (m.def.sides + 1)) / 2 + m.def.bonus;

export const MONK: FeatClass = {
  feats: [flurry, quietPalm, leap, windStep],
  // The bots' policy: the first of these that pays, in this order, or none and the monk strikes.
  bot: ({ s, c, foe, has }) => {
    const reach = (t: number): boolean => canReach(s, c, t), up = aliveMonsters(s);
    // Wind Step whenever it can: an Attack and another turn, in which it spends what the blows built.
    if (has(windStep.id) && reach(foe)) return { featId: windStep.id, target: foe };
    // Leap at a caster or a bowman of the back rank that no blow of its reaches past the front.
    const back = up.find((t) => leap.aims!(s, c, t) && !reach(t) && !!(s.monsters[t].def.cast || s.monsters[t].def.ranged));
    if (has(leap.id) && back !== undefined) return { featId: leap.id, target: back };
    // Quiet Palm at the hardest hitter it reaches, free and able to sleep, other than the foe the bot
    // would strike: it lies out of the fight while the rest are fought.
    const calm = up.filter((t) => t !== foe && reach(t) && !s.monsters[t].conditions.length && !monsterImmune(s.monsters[t].def, 'asleep'));
    const hardest = calm.reduce<number | undefined>((a, t) => (a === undefined || hits(s.monsters[t]) > hits(s.monsters[a]) ? t : a), undefined);
    if (has(quietPalm.id) && hardest !== undefined) return { featId: quietPalm.id, target: hardest };
    // Flurry whenever it can: two more strikes for 2, which the strikes that land mostly build back.
    if (has(flurry.id) && reach(foe)) return { featId: flurry.id, target: foe };
    return undefined;
  },
};
