// Party creation, starting kits, spells by tier and levelling to the cap.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { ITEMS, SPELLS } from '../../src/content/index.ts';
import { defaultParty, createCharacter, CLASSES, xpForLevel, levelUp, equip, armorClass, canTrain, spellTierAt, MAX_LEVEL } from '../../src/game/party.ts';
import { spellsFor } from '../../src/game/spells.ts';
import { ok } from './lib.ts';

export function party(): void {
  const rng = makeRng(5);
  const p = defaultParty(rng);
  ok(p.members.length === 6, 'six members');
  ok(p.members.every((m) => m.hp === m.maxHp && m.hp > 0), 'everyone starts at full health');
  ok(p.members[0].equipment.weapon === 'longsword' && p.members[0].equipment.armor === 'scale', 'the knight starts in scale with a long sword');
  ok(p.members[5].spells.includes('spark') && p.members[5].spells.includes('light'), 'the sorcerer knows the tier-1 spells');
  ok(p.members[5].equipment.weapon === 'sling' && p.members[5].pack.includes('dagger'), 'the sorcerer starts with a sling in hand and the dagger packed');
  ok(!p.members[5].spells.includes('sleep'), 'but not tier 2');
  ok(xpForLevel(2) > 0 && xpForLevel(3) > xpForLevel(2), 'xp thresholds rise');
  const s = p.members[5];
  s.xp = xpForLevel(2);
  const before = s.maxHp;
  ok(levelUp(s, rng) === 1 && s.level === 2 && s.maxHp > before && s.spells.includes('sleep'), 'levelling to 2 raises hp and teaches tier 2');
  ok(!equip(p.members[5], 'chain'), 'a sorcerer cannot wear chain');
  ok(armorClass(p.members[0]) > armorClass(p.members[5]), 'the knight has the better AC');
  ok(Object.values(SPELLS).every((sp) => sp.sp > 0), 'every spell costs something');
  // The road to level 10: tiers land at 1, 2, 4, 6, 8; levelling stops at the cap; nothing is left to train.
  ok([1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(spellTierAt).join() === '1,2,2,3,3,4,4,5,5,5', `spell tiers by level are ${[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map(spellTierAt).join()}`);
  for (const list of ['cleric', 'sorcerer', 'druid'] as const) for (let t = 1; t <= 5; t++) ok(spellsFor(list, t).some((sp) => sp.level === t), `the ${list} list has a tier ${t} spell`);
  const c = p.members[4];
  c.xp = 1_000_000;
  const gained = levelUp(c, rng);
  ok(c.level === MAX_LEVEL && gained === MAX_LEVEL - 1, `a cleric with endless xp levels to exactly ${MAX_LEVEL} (${c.level})`);
  ok(!canTrain(c), 'and cannot train further');
  ok(spellsFor('cleric', 5).every((sp) => c.spells.includes(sp.id)), 'at the cap every cleric spell is known, including tier 5');
  ok(c.maxHp >= 9 * 1 + 8 && c.maxSp > 20, `hp and sp grew with the levels (hp ${c.maxHp}, sp ${c.maxSp})`);
  const k = p.members[0]; k.xp = xpForLevel(8);
  ok(levelUp(k, rng) === 7 && k.level === 8 && k.spells.length === 0, 'a knight levels to 8 on level-8 xp and learns no spells');
  // Every class can wear its own starting kit, and every caster's list has spells to give.
  for (const cd of Object.values(CLASSES)) {
    const m = createCharacter('Test', 'human', cd.id, {}, makeRng(9));
    ok(cd.kit.every((id) => !ITEMS[id].classes || ITEMS[id].classes!.includes(cd.id)) && !!m.equipment.weapon && !!m.equipment.armor, `a ${cd.name} may use its whole starting kit`);
    ok(!cd.spells || m.spells.length > 0, `a ${cd.name} starts with ${cd.spells ? 'spells' : 'no spells'}`);
  }
  const r = p.members[2]; r.xp = xpForLevel(4); levelUp(r, rng);
  ok(r.spells.includes('thorn') && r.spells.includes('barkskin') && !r.spells.includes('spark'), 'the ranger learns the druid list');
  ok(xpForLevel(MAX_LEVEL) === 13050, `level ${MAX_LEVEL} costs ${xpForLevel(MAX_LEVEL)} xp`);
}
