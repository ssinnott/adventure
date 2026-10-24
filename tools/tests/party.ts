// Party creation, starting kits, spells by tier, levelling to the cap, the trainers' ceilings and what
// a kill pays.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { ITEMS, SPELLS, MAP_DEFS, TABLES } from '../../src/content/index.ts';
import { defaultParty, createCharacter, CLASSES, xpForLevel, levelUp, equip, armorClass, canTrain, canTrainAt, spellTierAt, trainPrice, killPay, MAX_LEVEL, useItem, addCondition, hasCondition, randomParty, STATS } from '../../src/game/party.ts';
import type { ItemDef } from '../../src/game/items.ts';
import { CURVE, trainerCeiling } from '../../src/content/progression.ts';
import { startCombat, currentTurn, partyAct, monsterAct, aliveMonsters, victoryLine } from '../../src/game/combat.ts';
import type { MonsterDef } from '../../src/game/monsters.ts';
import { spellsFor } from '../../src/game/spells.ts';
import { ok } from './lib.ts';

export function party(): void {
  const rng = makeRng(5);
  const p = defaultParty(TABLES, rng);
  ok(p.members.length === 6, 'six members');
  ok(p.members.every((m) => m.hp === m.maxHp && m.hp > 0), 'everyone starts at full health');
  ok(p.members[0].equipment.weapon === 'longsword' && p.members[0].equipment.armor === 'scale', 'the knight starts in scale with a long sword');
  ok(p.members[5].spells.includes('spark') && p.members[5].spells.includes('light'), 'the sorcerer knows the tier-1 spells');
  ok(p.members[5].equipment.weapon === 'sling' && p.members[5].pack.includes('dagger'), 'the sorcerer starts with a sling in hand and the dagger packed');
  ok(!p.members[5].spells.includes('sleep'), 'but not tier 2');
  // The company drawn from a seed alone (#979), pinned as the creation screen's module drew it.
  const drawn = randomParty(TABLES, 77).members.map((m) => `${m.name} ${m.race} ${m.cls} ${m.hp} ${STATS.map((k) => m.stats[k]).join('/')}`).join(', ');
  ok(drawn === 'Sable elf knight 13 11/13/11/14/13/10/10, Aveline human monk 11 15/13/12/13/13/14/11, Bram dwarf paladin 12 14/13/13/17/12/14/12, Wren gnome thief 9 12/12/13/14/15/14/15, Piran gnome druid 8 11/11/11/12/11/13/14, Tamsin tidefolk sorcerer 8 14/12/15/16/13/12/10',
    `a seed draws the company it always drew, its names, peoples, classes, hit points and stats (77: ${drawn})`);
  // The mender rule: 191's first six have no mender and 25901's first twelve none, so each draws again;
  // 5, 11, 20 and 38 each have one mender alone, a paladin, a druid, a cleric and a bard.
  const mended = [191, 25901, 5, 11, 20, 38].map((n) => randomParty(TABLES, n).members.map((m) => m.cls).join(' ')).join(', ');
  ok(mended === 'knight monk ranger paladin cleric thief, knight monk ranger bard thief sorcerer, barbarian knight monk paladin thief sorcerer, barbarian monk ranger thief druid sorcerer, knight monk ranger cleric thief sorcerer, barbarian knight monk ranger bard thief',
    `a company with no mender is drawn again until it has one, and each of the four menders counts (${mended})`);
  ok(xpForLevel(2) > 0 && xpForLevel(3) > xpForLevel(2), 'xp thresholds rise');
  const s = p.members[5];
  s.xp = xpForLevel(2);
  const before = s.maxHp;
  ok(levelUp(TABLES.spells, s, rng) === 1 && s.level === 2 && s.maxHp > before && s.spells.includes('sleep'), 'levelling to 2 raises hp and teaches tier 2');
  ok(!equip(TABLES.items, p.members[5], 'chain'), 'a sorcerer cannot wear chain');
  ok(armorClass(TABLES.items, p.members[0]) > armorClass(TABLES.items, p.members[5]), 'the knight has the better AC');
  ok(Object.values(SPELLS).every((sp) => sp.sp > 0), 'every spell costs something');
  // The road to level 10: tiers land at 1, 2, 4, 6, 8; levelling stops at the cap; nothing is left to train.
  const tiers = (ls: number[], hybrid = false): string => ls.map((l) => spellTierAt(l, hybrid)).join();
  ok(tiers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10]) === '1,2,2,3,3,4,4,5,5,5', `spell tiers by level are ${tiers([1, 2, 3, 4, 5, 6, 7, 8, 9, 10])}`);
  ok(tiers([14, 15, 22, 23, 32]) === '5,6,6,7,7' && tiers([8, 15, 16, 17, 24, 25], true) === '5,5,5,6,6,7', `tiers 6 and 7 come at 15 and 23, a hybrid's at 17 and 25 (${tiers([14, 15, 22, 23, 32])}; ${tiers([8, 15, 16, 17, 24, 25], true)})`);
  for (const list of ['cleric', 'sorcerer', 'druid'] as const) for (let t = 1; t <= 7; t++) ok(spellsFor(TABLES.spells, list, t).some((sp) => sp.level === t), `the ${list} list has a tier ${t} spell`);
  const c = p.members[4];
  c.xp = 1_000_000;
  const gained = levelUp(TABLES.spells, c, rng);
  ok(c.level === MAX_LEVEL && gained === MAX_LEVEL - 1, `a cleric with endless xp levels to exactly ${MAX_LEVEL} (${c.level})`);
  ok(!canTrain(c), 'and cannot train further');
  ok(spellsFor(TABLES.spells, 'cleric', 7).every((sp) => c.spells.includes(sp.id)), 'at the cap every cleric spell is known, including tier 7');
  ok(c.maxHp >= 31 * 1 + 8 && c.maxSp > 60, `hp and sp grew with the levels (hp ${c.maxHp}, sp ${c.maxSp})`);
  ok(MAX_LEVEL === 32 && trainPrice({ level: 10 }) === 400 && trainPrice({ level: 31 }) === 1240, `the road's cap is ${MAX_LEVEL}, and a level past 10 costs 40 gold a level (${trainPrice({ level: 31 })} for the 32nd)`);
  const k = p.members[0]; k.xp = xpForLevel(8);
  ok(levelUp(TABLES.spells, k, rng) === 7 && k.level === 8 && k.spells.length === 0, 'a knight levels to 8 on level-8 xp and learns no spells');
  // Every class can wear its own starting kit, and every caster's list has spells to give.
  for (const cd of Object.values(CLASSES)) {
    const m = createCharacter(TABLES, 'Test', 'human', cd.id, {}, makeRng(9));
    ok(cd.kit.every((id) => !ITEMS[id].classes || ITEMS[id].classes!.includes(cd.id)) && !!m.equipment.weapon && !!m.equipment.armor, `a ${cd.name} may use its whole starting kit`);
    ok(!cd.spells || m.spells.length > 0, `a ${cd.name} starts with ${cd.spells ? 'spells' : 'no spells'}`);
  }
  const r = p.members[2]; r.xp = xpForLevel(4); levelUp(TABLES.spells, r, rng);
  ok(r.spells.includes('thorn') && r.spells.includes('barkskin') && !r.spells.includes('spark'), 'the ranger learns the druid list');
  ok(xpForLevel(10) === 13050 && xpForLevel(MAX_LEVEL) === 147250, `level 10 costs ${xpForLevel(10)} xp, and ${MAX_LEVEL} ${xpForLevel(MAX_LEVEL)}`);

  // A trainer teaches to its town's band's top plus one: a member ready for 11 trains in Thornhold
  // and at Saltmouth's ceiling (13, the Sail Loft's), and not in Helmstow (6).
  const trainers = MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => (f.kind === 'trainer' ? [{ town: d.name, maxLevel: f.maxLevel }] : [])));
  const at = (town: string): number => trainers.find((t) => t.town === town)?.maxLevel ?? NaN;
  const ten = defaultParty(TABLES, makeRng(6)).members[0];
  ten.xp = xpForLevel(10); levelUp(TABLES.spells, ten, makeRng(6)); ten.xp = xpForLevel(11);
  const saltmouth = trainerCeiling(CURVE.saltreach);
  ok(ten.level === 10 && saltmouth === 13 && at('Saltmouth') === saltmouth && canTrainAt(ten, saltmouth) && canTrainAt(ten, at('Thornhold')) && at('Helmstow') === 6 && !canTrainAt(ten, at('Helmstow')),
    `a member of 10 with the xp for 11 trains at Saltmouth's ceiling (${saltmouth}) and in Thornhold (${at('Thornhold')}), and not in Helmstow (${at('Helmstow')})`);
  ten.xp = xpForLevel(14);
  ten.level = 13;
  ok(!canTrainAt(ten, saltmouth) && trainerCeiling(CURVE.sunderwood) === 17 && canTrainAt(ten, trainerCeiling(CURVE.sunderwood)), 'and Saltmouth teaches no 14th, where Lantern Watch, to 17, does');
  // And at the cap (docs/areas/hearth.md §9, call 4): a band topping at 32 gives a ceiling of 32,
  // not its top plus one, and a member of 31 with the xp for 32 trains to it there, and no further.
  const capped = trainerCeiling(CURVE.hearth), last = defaultParty(TABLES, makeRng(7)).members[0];
  last.xp = xpForLevel(31); levelUp(TABLES.spells, last, makeRng(7)); last.xp = xpForLevel(32);
  const ready = last.level === 31 && canTrainAt(last, capped);
  levelUp(TABLES.spells, last, makeRng(7), capped); last.xp = xpForLevel(33);
  ok(CURVE.hearth.band[1] === 32 && capped === 32 && capped === MAX_LEVEL && trainerCeiling({ ...CURVE.hearth, band: [28, 31] }) === 32 && ready && last.level === 32 && !canTrainAt(last, capped),
    `a band topping at the cap, 32, teaches to ${capped}, as one topping at 31 does: a member of 31 with the xp for 32 trains to it, and none past it`);

  // A kill pays each member by the monster's level against theirs (EXPANSION §5.2).
  ok([-4, -3, -2, -1, 0, 1, 2, 3, 5].map((d) => killPay(10 + d, 10)).join() === '0.1,0.1,0.4,0.7,1,1.15,1.3,1.5,1.5', `a kill pays ${[-3, -2, -1, 0, 1, 2, 3].map((d) => killPay(10 + d, 10)).join(', ')} from three under to three over`);
  const won = (party: ReturnType<typeof defaultParty>, foe: MonsterDef, seed: number): ReturnType<typeof startCombat> => {
    const r = makeRng(seed), st = startCombat(TABLES, party, [{ id: 'k', monsters: [foe] }], r);
    for (let g = 0; st.outcome === 'ongoing' && g < 400; g++) {
      const t = currentTurn(st, party, r);
      if (!t) break;
      if (t.side === 'monster') monsterAct(st, party, r); else partyAct(st, party, r, { type: 'attack', target: aliveMonsters(st)[0] });
    }
    return st;
  };
  const meek = (level: number): MonsterDef => ({ id: `k${level}`, name: 'Straw Man', plural: 'Straw Men', sprite: 'rat', kind: 'beast', level, hp: 1, ac: 0, attack: -20, dice: 1, sides: 2, bonus: 0, speed: 1, xp: 600, gold: [0, 0], tint: '#888', size: 0.5 });
  const pays = [13, 7].map((level) => {
    const company = defaultParty(TABLES, makeRng(7));
    for (const m of company.members) { m.xp = xpForLevel(10); levelUp(TABLES.spells, m, makeRng(7)); }
    const st = won(company, meek(level), 7);
    return { st, got: company.members.map((m) => m.xp - xpForLevel(10)) };
  });
  ok(pays[0].st.outcome === 'victory' && pays[0].got.every((g) => g === 150) && pays[1].got.every((g) => g === 10),
    `a level-13 kill worth 600 pays a level-10 member ×1.5 (${pays[0].got[0]} of an even 100) and a level-7 kill ×0.1 (${pays[1].got[0]})`);
  ok(pays[0].st.log.at(-1) === 'Victory! 900 experience, 0 gold.' && pays[1].st.log.at(-1) === 'Victory! 60 experience, 0 gold.', `the log pays the kill by level (${pays[0].st.log.at(-1)} / ${pays[1].st.log.at(-1)})`);
  const mixed = defaultParty(TABLES, makeRng(8));
  for (const [i, m] of mixed.members.entries()) { m.xp = xpForLevel(i < 3 ? 10 : 12); levelUp(TABLES.spells, m, makeRng(8)); }
  const st = won(mixed, meek(11), 8), got = mixed.members.map((m, i) => m.xp - xpForLevel(i < 3 ? 10 : 12));
  ok(got.join() === '115,115,115,70,70,70' && st.log.at(-1) === victoryLine(st.loot!) && st.log.at(-1) === 'Victory! 70 to 115 experience by level, 0 gold.',
    `members of 10 and 12 take ${got.join(', ')} of a level-11 kill, and the log says so (${st.log.at(-1)})`);

  // One use of an item, the fight's and the sheet's (#978): out of the holder's pack, else the bag, each
  // effect in its words. A table of the suite's own lends a tonic that does all four, to show their order.
  const tonic: ItemDef = { id: 'test_tonic', name: 'Tonic', slot: 'none', price: 1, use: { heal: 5, sp: 5, cure: ['poisoned'], food: 2 } };
  const table = { ...ITEMS, [tonic.id]: tonic }, u = defaultParty(TABLES, makeRng(9)), [a, b, cc] = u.members;
  for (const m of u.members) m.pack = [];
  a.pack.push('potion_heal'); u.bag = ['potion_heal', 'potion_sp', 'antidote', 'rations', 'club', tonic.id];
  // Room for the whole draught, then a member 3 short of the most: its 15 and the cap.
  a.maxHp = 40; a.hp = 1;
  const healed = useItem(table, u, a, 'potion_heal', a);
  ok(healed?.join() === `${a.name} recovers 15.` && a.hp === 16 && !a.pack.length && u.bag.includes('potion_heal'), `a Healing Draught comes out of the holder's pack before the bag, 15 hit points (${healed})`);
  a.hp = 37;
  const again = useItem(table, u, a, 'potion_heal', a);
  ok(again?.join() === `${a.name} recovers 3.` && a.hp === 40 && !u.bag.includes('potion_heal'), `and with none in the pack, out of the bag, to the most (${again})`);
  b.maxSp = 20; b.sp = 5;
  const sharp = useItem(table, u, null, 'potion_sp', b);
  ok(sharp?.join() === `${b.name} feels sharper.` && b.sp === 15, `a Blue Vial gives 10 spell points (${sharp} ${b.sp}/20)`);
  addCondition(TABLES.items, cc, 'poisoned');
  const clean = useItem(table, u, null, 'antidote', cc);
  ok(clean?.join() === `${cc.name} is cleansed.` && !hasCondition(cc, 'poisoned'), `an Antidote lifts the poison (${clean})`);
  const food = u.food, fed = useItem(table, u, null, 'rations', a);
  ok(fed?.join() === "The party's food grows by 5." && u.food === food + 5 && !u.bag.includes('rations'), `Rations go to the stores, the sheet's and now the fight's (${fed})`);
  addCondition(TABLES.items, cc, 'poisoned'); cc.hp = cc.maxHp - 5; cc.maxSp = 10; cc.sp = 8;
  const all = useItem(table, u, null, tonic.id, cc);
  ok(all?.join(' ') === `${cc.name} recovers 5. ${cc.name} feels sharper. ${cc.name} is cleansed. The party's food grows by 2.` && cc.sp === 10, `a tonic that does all four says them in that order, its spell points to the most (${all?.join(' ')})`);
  const kept = JSON.stringify(u);
  ok(useItem(table, u, a, 'potion_heal', a) === null && useItem(table, u, a, 'club', a) === null && JSON.stringify(u) === kept, 'a draught nobody holds and a club, which has no use, are refused, and nothing changes');
  // So in a fight: `partyAct` refuses the use, says nothing and keeps the turn.
  const fight = startCombat(TABLES, u, [{ id: 'm', monsters: [meek(1)] }], makeRng(4)), frng = makeRng(4);
  for (let k = 0; k < 20 && currentTurn(fight, u, frng)?.side === 'monster'; k++) monsterAct(fight, u, frng);
  const turn = JSON.stringify(currentTurn(fight, u, frng)), logged = fight.log.length;
  ok(!partyAct(fight, u, frng, { type: 'use', itemId: 'potion_heal', target: 0 }) && !partyAct(fight, u, frng, { type: 'use', itemId: 'club', target: 0 })
    && JSON.stringify(currentTurn(fight, u, frng)) === turn && fight.log.length === logged, 'and in a fight the same two are refused, with the turn kept');
}
