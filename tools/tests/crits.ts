// Critical blows (#1114; DESIGN §6): a member's weapon blow that lands crits at a chance from its Luck
// as borne, never under the floor, a knight's, barbarian's, thief's or monk's rising at 15 and 23, for
// double its damage, marked in the log after the hit and before a death; spells and monsters never
// crit. On in play since #1117 (`CRITS_ON`); a fight's `crits: false` turns them off for a tool, as
// here, and off no member's chance is anything, so no blow crits or draws for one, where a fight with
// them on draws as one with them off up to the crit.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { createCharacter, createParty, critChance, CRITS_ON, CRIT_BASE, CRIT_PER_LUCK, CRIT_FLOOR, CRIT_STEP, CLASSES } from '../../src/game/party.ts';
import type { Character, ClassId, RaceId } from '../../src/game/party.ts';
import { startCombat, partyAct, currentTurn, monsterAct } from '../../src/game/combat.ts';
import type { CombatState } from '../../src/game/combat.ts';
import { CRIT_LINE } from '../../src/game/combat/lines.ts';
import type { ItemDef } from '../../src/game/items.ts';
import { MONSTERS, TABLES } from '../../src/content/index.ts';
import { ok } from './lib.ts';

/** A member of a class and people at a level, on its class's stats but for its Luck, as given. */
function member(cls: ClassId, level: number, luck: number, race: RaceId = 'human'): Character {
  const c = createCharacter(TABLES, cls, race, cls, CLASSES[cls].stats, makeRng(1));
  c.level = level; c.stats.luck = luck;
  return c;
}
/** A share as a whole percentage, so that sums of shares compare whole. */
const pct = (p: number): number => Math.round(p * 100);

/** One member's first turn on a straw man that never hits back, crits on or off: the fight after it. */
function strike(c: Character, crits: boolean | undefined, seed: number, act: 'attack' | 'spark' = 'attack'): CombatState {
  const p = createParty([c]);
  const straw = { ...MONSTERS.rat, id: 'test_straw', hp: 5000, ac: -100, attack: -50, dice: 1, sides: 1, speed: 1 };
  const f = startCombat(TABLES, p, [{ id: 'r', monsters: [straw] }], makeRng(seed), crits === undefined ? {} : { crits });
  if (currentTurn(f, p, makeRng(seed))?.side === 'monster') monsterAct(f, p, makeRng(seed));
  partyAct(f, p, makeRng(seed + 10), act === 'attack' ? { type: 'attack', target: 0 } : { type: 'cast', spellId: 'spark', target: 0 });
  return f;
}

export function crits(): void {
  // On in play (#1117): every member of every class has the chance a fight with them on gives it; off, none at all.
  const classes = Object.keys(CLASSES) as ClassId[];
  const played = (c: Character): boolean => critChance(TABLES.items, c) > 0 && critChance(TABLES.items, c) === critChance(TABLES.items, c, true) && critChance(TABLES.items, c, false) === 0;
  ok(CRITS_ON && classes.every((k) => [1, 15, 23, 32].every((l) => played(member(k, l, 20)))),
    'crits are on: in play every member of every class, at any level, has its chance to crit, and off none');

  // On, the chance: 5%, and 2% a point of Luck over 10, never under 1%; the four's 5% more at 15 and 23.
  const on = (c: Character): number => pct(critChance(TABLES.items, c, true));
  const knight = [1, 14, 15, 22, 23, 32].map((l) => on(member('knight', l, 10)));
  ok(pct(CRIT_BASE) === 5 && pct(CRIT_PER_LUCK) === 2 && pct(CRIT_FLOOR) === 1 && pct(CRIT_STEP) === 5 && knight.join() === '5,5,10,10,15,15',
    `a knight of Luck 10 crits ${knight.join(', ')}% at 1, 14, 15, 22, 23 and 32`);
  const thief = createCharacter(TABLES, 'thief', 'gnome', 'thief', CLASSES.thief.stats, makeRng(1));
  thief.level = 23;
  ok(thief.stats.luck === 16 && on(thief) === 27, `a gnome thief, its class's Luck 13 and its people's 3, crits ${on(thief)}% at 23`);
  const FOUR: readonly ClassId[] = ['knight', 'barbarian', 'thief', 'monk'];
  const four = FOUR.map((k) => on(member(k, 23, 10))), rest = classes.filter((k) => !FOUR.includes(k)).map((k) => on(member(k, 23, 10)));
  ok(four.every((x) => x === 15) && rest.every((x) => x === 5), `at 23 the knight, barbarian, thief and monk crit 15% on Luck 10 and every other class 5% (${rest.join(', ')})`);
  ok(on(member('sorcerer', 1, 7)) === 1 && on(member('sorcerer', 1, 12)) === 9, 'Luck under 10 takes its 2% a point to the floor of 1%, and over it adds them');
  // Luck as borne: a charm in the pack that raises it counts, as a raise does everywhere (`statOf`).
  const charm: ItemDef = { id: 'fx_charm', name: 'Charm', slot: 'none', price: 0, stat: { luck: 3 } };
  const items = { ...TABLES.items, fx_charm: charm }, charmed = member('cleric', 1, 10);
  charmed.pack.push('fx_charm');
  ok(pct(critChance(items, charmed, true)) === 11 && on(member('cleric', 1, 10)) === 5, 'a charm of Luck +3 borne makes 5% 11%');

  // In a fight: a member whose chance is whole crits every blow that lands, for double what the same
  // blow does with crits off, the dice drawn alike; the log says so after the hit.
  const lucky = (): Character => member('knight', 1, 60);
  const offFight = strike(lucky(), false, 7), onFight = strike(lucky(), true, 7);
  const hitOf = (f: CombatState): string => f.log.find((l) => l.includes(' hits ')) ?? '', dmgOf = (l: string): number => Number(/ for (\d+)\./.exec(l)?.[1] ?? NaN);
  const offHit = hitOf(offFight), onHit = hitOf(onFight);
  ok(!!offHit && !!onHit && dmgOf(onHit) === 2 * dmgOf(offHit) && onHit.endsWith(`for ${dmgOf(onHit)}. ${CRIT_LINE}`) && !offHit.includes(CRIT_LINE),
    `with crits on, a sure crit doubles the blow and is marked ("${onHit}"); off, the same blow is plain ("${offHit}")`);
  ok(offFight.monsters[0].hp - onFight.monsters[0].hp === dmgOf(offHit), 'and the straw man takes the doubled blow');
  // Spells and monsters never crit, crits on and the caster's chance whole.
  const sorcerer = member('sorcerer', 1, 60), cast = strike(sorcerer, true, 7, 'spark');
  ok(cast.log.some((l) => l.includes('casts Spark')) && !cast.log.some((l) => l.includes(CRIT_LINE)), 'a spell never crits');
  const p = createParty([lucky()]), biter = { ...MONSTERS.rat, id: 'test_biter', hp: 5000, attack: 50, speed: 99 };
  const f = startCombat(TABLES, p, [{ id: 'r', monsters: [biter] }], makeRng(3), { crits: true });
  for (let n = 0; n < 6 && f.outcome === 'ongoing'; n++) {
    if (currentTurn(f, p, makeRng(n))?.side === 'monster') monsterAct(f, p, makeRng(n)); else partyAct(f, p, makeRng(n), { type: 'defend' });
  }
  const bitten = p.members[0].maxHp - p.members[0].hp;
  ok(bitten > 0 && !f.log.some((l) => l.includes(CRIT_LINE)), `a monster's blow never crits, crits on (the rat's blows took ${bitten})`);
}
