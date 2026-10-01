// Party creation, starting kits, spells by tier, levelling to the cap, the trainers' ceilings and what
// a kill pays.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { ITEMS, SPELLS, MAP_DEFS } from '../../src/content/index.ts';
import { defaultParty, createCharacter, CLASSES, xpForLevel, levelUp, equip, armorClass, canTrain, canTrainAt, spellTierAt, trainPrice, killPay, MAX_LEVEL } from '../../src/game/party.ts';
import { CURVE, trainerCeiling } from '../../src/content/progression.ts';
import { startCombat, currentTurn, partyAct, monsterAct, aliveMonsters, victoryLine } from '../../src/game/combat.ts';
import type { MonsterDef } from '../../src/game/monsters.ts';
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
  const tiers = (ls: number[], hybrid = false): string => ls.map((l) => spellTierAt(l, hybrid)).join();
  ok(tiers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) === '1,2,2,3,3,4,4,5,5,5', `spell tiers by level are ${tiers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])}`);
  ok(tiers([14, 15, 22, 23, 32]) === '5,6,6,7,7' && tiers([8, 15, 16, 17, 24, 25], true) === '5,5,5,6,6,7', `tiers 6 and 7 come at 15 and 23, a hybrid's at 17 and 25 (${tiers([14, 15, 22, 23, 32])}; ${tiers([8, 15, 16, 17, 24, 25], true)})`);
  for (const list of ['cleric', 'sorcerer', 'druid'] as const) for (let t = 1; t <= 7; t++) ok(spellsFor(list, t).some((sp) => sp.level === t), `the ${list} list has a tier ${t} spell`);
  const c = p.members[4];
  c.xp = 1_000_000;
  const gained = levelUp(c, rng);
  ok(c.level === MAX_LEVEL && gained === MAX_LEVEL - 1, `a cleric with endless xp levels to exactly ${MAX_LEVEL} (${c.level})`);
  ok(!canTrain(c), 'and cannot train further');
  ok(spellsFor('cleric', 7).every((sp) => c.spells.includes(sp.id)), 'at the cap every cleric spell is known, including tier 7');
  ok(c.maxHp >= 31 * 1 + 8 && c.maxSp > 60, `hp and sp grew with the levels (hp ${c.maxHp}, sp ${c.maxSp})`);
  ok(MAX_LEVEL === 32 && trainPrice({ level: 10 }) === 400 && trainPrice({ level: 31 }) === 1240, `the road's cap is ${MAX_LEVEL}, and a level past 10 costs 40 gold a level (${trainPrice({ level: 31 })} for the 32nd)`);
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
  ok(xpForLevel(10) === 13050 && xpForLevel(MAX_LEVEL) === 147250, `level 10 costs ${xpForLevel(10)} xp, and ${MAX_LEVEL} ${xpForLevel(MAX_LEVEL)}`);

  // A trainer teaches to its town's band's top plus one: a member ready for 11 trains in Thornhold
  // and at Saltmouth's ceiling (13, the Sail Loft's), and not in Helmstow (6).
  const trainers = MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => (f.kind === 'trainer' ? [{ town: d.name, maxLevel: f.maxLevel }] : [])));
  const at = (town: string): number => trainers.find((t) => t.town === town)?.maxLevel ?? NaN;
  const ten = defaultParty(makeRng(6)).members[0];
  ten.xp = xpForLevel(10); levelUp(ten, makeRng(6)); ten.xp = xpForLevel(11);
  const saltmouth = trainerCeiling(CURVE.saltreach);
  ok(ten.level === 10 && saltmouth === 13 && at('Saltmouth') === saltmouth && canTrainAt(ten, saltmouth) && canTrainAt(ten, at('Thornhold')) && at('Helmstow') === 6 && !canTrainAt(ten, at('Helmstow')),
    `a member of 10 with the xp for 11 trains at Saltmouth's ceiling (${saltmouth}) and in Thornhold (${at('Thornhold')}), and not in Helmstow (${at('Helmstow')})`);
  ten.xp = xpForLevel(14);
  ten.level = 13;
  ok(!canTrainAt(ten, saltmouth) && trainerCeiling(CURVE.sunderwood) === 17 && canTrainAt(ten, trainerCeiling(CURVE.sunderwood)), 'and Saltmouth teaches no 14th, where Lantern Watch, to 17, does');

  // A kill pays each member by the monster's level against theirs (EXPANSION §5.2).
  ok([-4, -3, -2, -1, 0, 1, 2, 3, 5].map((d) => killPay(10 + d, 10)).join() === '0.1,0.1,0.4,0.7,1,1.15,1.3,1.5,1.5', `a kill pays ${[-3, -2, -1, 0, 1, 2, 3].map((d) => killPay(10 + d, 10)).join(', ')} from three under to three over`);
  const won = (party: ReturnType<typeof defaultParty>, foe: MonsterDef, seed: number): ReturnType<typeof startCombat> => {
    const r = makeRng(seed), st = startCombat(party, [{ id: 'k', monsters: [foe] }], r);
    for (let g = 0; st.outcome === 'ongoing' && g < 400; g++) {
      const t = currentTurn(st, party, r);
      if (!t) break;
      if (t.side === 'monster') monsterAct(st, party, r); else partyAct(st, party, r, { type: 'attack', target: aliveMonsters(st)[0] });
    }
    return st;
  };
  const meek = (level: number): MonsterDef => ({ id: `k${level}`, name: 'Straw Man', plural: 'Straw Men', sprite: 'rat', kind: 'beast', level, hp: 1, ac: 0, attack: -20, dice: 1, sides: 2, bonus: 0, speed: 1, xp: 600, gold: [0, 0], tint: '#888', size: 0.5 });
  const pays = [13, 7].map((level) => {
    const company = defaultParty(makeRng(7));
    for (const m of company.members) { m.xp = xpForLevel(10); levelUp(m, makeRng(7)); }
    const st = won(company, meek(level), 7);
    return { st, got: company.members.map((m) => m.xp - xpForLevel(10)) };
  });
  ok(pays[0].st.outcome === 'victory' && pays[0].got.every((g) => g === 150) && pays[1].got.every((g) => g === 10),
    `a level-13 kill worth 600 pays a level-10 member ×1.5 (${pays[0].got[0]} of an even 100) and a level-7 kill ×0.1 (${pays[1].got[0]})`);
  ok(pays[0].st.log.at(-1) === 'Victory! 900 experience, 0 gold.' && pays[1].st.log.at(-1) === 'Victory! 60 experience, 0 gold.', `the log pays the kill by level (${pays[0].st.log.at(-1)} / ${pays[1].st.log.at(-1)})`);
  const mixed = defaultParty(makeRng(8));
  for (const [i, m] of mixed.members.entries()) { m.xp = xpForLevel(i < 3 ? 10 : 12); levelUp(m, makeRng(8)); }
  const st = won(mixed, meek(11), 8), got = mixed.members.map((m, i) => m.xp - xpForLevel(i < 3 ? 10 : 12));
  ok(got.join() === '115,115,115,70,70,70' && st.log.at(-1) === victoryLine(st.loot!) && st.log.at(-1) === 'Victory! 70 to 115 experience by level, 0 gold.',
    `members of 10 and 12 take ${got.join(', ')} of a level-11 kill, and the log says so (${st.log.at(-1)})`);
}
