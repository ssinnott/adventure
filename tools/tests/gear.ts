// Gear with a plus: a +1 weapon hits one better and deals one more, +1 armour or a shield adds one
// to armour class, and a robe with a plus is still a robe. No table has a plus yet, so the items are
// made here with the helper, added only where absent and taken out again: every suite shares the
// one ITEMS.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { ITEMS } from '../../src/content/index.ts';
import { P, PLUS_PRICE, core } from '../../src/content/items.ts';
import type { ItemDef } from '../../src/game/items.ts';
import { defaultParty, createCharacter, attackBonus, armorClass } from '../../src/game/party.ts';
import { startCombat, currentTurn, partyAct, monsterAct, toHit } from '../../src/game/combat.ts';
import { ok } from './lib.ts';

/** The ids this suite put in ITEMS, to take out when it is done. */
const added: string[] = [];
const add = (d: ItemDef): string => { if (!(d.id in ITEMS)) { ITEMS[d.id] = d; added.push(d.id); } return d.id; };
const throws = (f: () => unknown): boolean => { try { f(); return false; } catch { return true; } };

export function gear(): void {
  try { check(); } finally { for (const id of added.splice(0)) delete ITEMS[id]; }
}

function check(): void {
  // The helper.
  const sword = P(ITEMS.longsword, 1);
  ok(sword.id === 'longsword+1' && sword.name === 'Long Sword +1' && sword.plus === 1, `the helper makes ${sword.id}, "${sword.name}"`);
  ok(sword.dice === 1 && sword.sides === 10 && sword.bonus === 2, `a Long Sword +1 rolls ${sword.dice}d${sword.sides}+${sword.bonus}`);
  ok(sword.price === 270 && sword.price === ITEMS.longsword.price + PLUS_PRICE, `a Long Sword +1 costs ${sword.price} gold`);
  ok(sword.classes === ITEMS.longsword.classes && !sword.twoHanded, 'and keeps the rest of its base');
  const brig = P(ITEMS.scale, 2);
  ok(brig.id === 'scale+2' && brig.ac === ITEMS.scale.ac! + 2 && brig.price === ITEMS.scale.price + 300, `a plus of 2 is two points (${brig.name}, ac ${brig.ac}, ${brig.price} gold)`);
  const named = P(ITEMS.longsword, 1, { id: 'queens_sword', name: "Queen's Long Sword +1" });
  ok(named.id === 'queens_sword' && named.bonus === 2 && named.plus === 1, 'a named find keeps the plus under its own id');
  ok(core('scale') === ITEMS.scale && throws(() => core('shield')), 'an area finds a core base by id, and only a core one');
  ok(throws(() => P(ITEMS.torch, 1)) && throws(() => P(sword, 1)) && throws(() => P(ITEMS.dagger, 0)), 'no plus on a torch, on a plus or of 0');

  // To-hit, exactly one better.
  const mk = (cls: Parameters<typeof createCharacter>[2]) => createCharacter('T', 'human', cls, {}, makeRng(3));
  const kn = mk('knight'); kn.equipment.weapon = 'longsword'; const hitBase = attackBonus(kn);
  kn.equipment.weapon = add(sword);
  ok(attackBonus(kn) === hitBase + 1, `a knight's to-hit with a Long Sword +1 (${hitBase} -> ${attackBonus(kn)})`);

  // Damage, exactly one more: the same blow at a wraith on the same seed, the sword the only change.
  // The chance the fight rolls to hit is the one `attackBonus` gives, so the plus counts once.
  let rolled = true;
  const blow = (weapon: string, seed: number): number | null => {
    const rng = makeRng(seed), party = defaultParty(rng);
    party.members = [party.members[0]]; party.members[0].equipment.weapon = weapon;
    const s = startCombat(party, [{ id: 'a', monsters: ['wraith'] }], rng);
    for (let i = 0; i < 20; i++) {
      const t = currentTurn(s, party, rng); if (!t) return null;
      if (t.side !== 'party') { monsterAct(s, party, rng); continue; }
      const c = party.members[0], want = toHit(attackBonus(c), s.monsters[0].def.ac), chance = rng.chance.bind(rng);
      let p: number | null = null;
      rng.chance = (q) => { p ??= q; return chance(q); };
      partyAct(s, party, rng, { type: 'attack', target: 0 });
      if (p !== want) rolled = false;
      const m = / hits Wraith for (\d+)/.exec([...s.log].reverse().find((l) => / (hits|misses) Wraith/.test(l)) ?? '');
      return m ? Number(m[1]) : null;
    }
    return null;
  };
  let hits = 0, better = 0, worse = 0;
  for (let seed = 1; seed <= 200; seed++) {
    const a = blow('longsword', seed), b = blow(sword.id, seed);
    if (a !== null) { hits++; if (b !== a + 1) worse++; } else if (b !== null) better++;
  }
  ok(hits > 40 && worse === 0, `where a Long Sword hits, the +1 hits for exactly one more (${hits} of 200 seeds)`);
  ok(better > 0, `and it hits where the Long Sword misses (${better} more of 200)`);
  ok(rolled, 'the fight rolls to hit at the chance its to-hit gives, with the plus counted once');

  // Armour class, one a point, on armour and a shield alike.
  const k2 = mk('knight'); k2.equipment.armor = 'scale'; k2.equipment.shield = 'buckler'; const ac0 = armorClass(k2);
  k2.equipment.armor = add(P(ITEMS.scale, 1)); const ac1 = armorClass(k2);
  k2.equipment.shield = add(P(ITEMS.buckler, 1)); const ac2 = armorClass(k2);
  ok(ac1 === ac0 + 1 && ac2 === ac0 + 2, `Scale Mail +1 and a Buckler +1 add one each (${ac0} -> ${ac1} -> ${ac2})`);

  // A robe with a plus is still a robe.
  const monk = mk('monk'); monk.equipment.armor = 'robe'; const robe = armorClass(monk);
  monk.equipment.armor = add(P(ITEMS.robe, 1));
  ok(armorClass(monk) === robe + 1, `a monk in a Robe +1 keeps Unarmoured Defence (${robe} -> ${armorClass(monk)})`);
  monk.equipment.armor = 'leather';
  ok(armorClass(monk) === 10 + ITEMS.leather.ac!, 'but not in leather');
}
