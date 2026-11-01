// The class traits.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { ITEMS, MONSTERS, TABLES } from '../../src/content/index.ts';
import { defaultParty, createCharacter, CLASSES, TRAITS, hasTrait, damage, STALWART_AC, HOLY_STRIKE_DMG, DIE_HARD_AT, INSPIRE_HIT, SNEAK_ATTACK_DMG, armorClass, addCondition, hasCondition } from '../../src/game/party.ts';
import { startCombat, castOnAlly, buffHit, traitDamage, partyAct, currentTurn, monsterAct, SNEAK_GROWTH } from '../../src/game/combat.ts';
import { sneaks } from '../../src/game/combat/perks.ts';
import { SNEAK_LINE } from '../../src/game/combat/lines.ts';
import { spell } from '../../src/game/spells.ts';
import { ok } from './lib.ts';

export function traits(): void {
  const mk = (cls: Parameters<typeof createCharacter>[3]) => createCharacter(TABLES, 'T', 'human', cls, {}, makeRng(3));
  for (const cd of Object.values(CLASSES)) ok(cd.traits.length >= 1 && cd.traits.length <= 2 && cd.traits.every((t) => t in TRAITS), `a ${cd.name} has one or two traits (${cd.traits.join(', ')})`);
  // Stalwart: the knight's AC carries the bonus.
  const k = mk('knight'); const ac = armorClass(TABLES.items, k);
  ok(ac === 10 + 5 + 1 + STALWART_AC, `a knight in scale and buckler is AC ${ac}`);
  // Unarmoured Defence grows with level and goes away under real armour.
  const monk = mk('monk'); const a1 = armorClass(TABLES.items, monk); monk.level = 10;
  ok(armorClass(TABLES.items, monk) === a1 + 5, `a level-10 monk in a robe gains AC (${a1} -> ${armorClass(TABLES.items, monk)})`);
  const leatherMonk = mk('monk'); leatherMonk.equipment.armor = 'leather';
  ok(armorClass(TABLES.items, leatherMonk) === 10 + 3, 'a monk in leather loses unarmoured defence');
  // Immunities come through addCondition.
  const cases: [Parameters<typeof createCharacter>[3], 'diseased' | 'cursed' | 'asleep' | 'paralysed' | 'poisoned'][] = [['paladin', 'diseased'], ['cleric', 'cursed'], ['sorcerer', 'asleep'], ['monk', 'paralysed'], ['druid', 'poisoned']];
  for (const [cls, cond] of cases) { const c = mk(cls); addCondition(TABLES.items, c, cond); ok(!hasCondition(c, cond), `a ${cls} is immune to ${cond}`); }
  const kn = mk('knight'); addCondition(TABLES.items, kn, 'poisoned'); ok(hasCondition(kn, 'poisoned'), 'a knight is not');
  // Die Hard: a barbarian at -15 is unconscious, not dead; a knight is dead.
  const b = mk('barbarian'); damage(TABLES.items, b, b.hp + 15);
  ok(!hasCondition(b, 'dead') && hasCondition(b, 'unconscious'), 'a barbarian at -15 hp still lives');
  const b2 = mk('barbarian'); damage(TABLES.items, b2, b2.hp + 25); ok(hasCondition(b2, 'dead') && b2.hp === DIE_HARD_AT, `but a blow past ${DIE_HARD_AT} kills`);
  const k2 = mk('knight'); damage(TABLES.items, k2, k2.hp + 15); ok(hasCondition(k2, 'dead'), 'a knight at -15 hp is dead');
  // Healing Hands: the cleric heals more than a paladin with the same Personality.
  const cl = mk('cleric'), pa = mk('paladin'), hurtA = mk('knight'), hurtB = mk('knight');
  hurtA.maxHp = hurtB.maxHp = 100; hurtA.hp = hurtB.hp = 1;
  castOnAlly(TABLES.items, cl, spell(TABLES.spells, 'heal'), hurtA); castOnAlly(TABLES.items, pa, spell(TABLES.spells, 'heal'), hurtB);
  ok(hurtA.hp > hurtB.hp, `a cleric's Mend heals more (${hurtA.hp - 1} vs ${hurtB.hp - 1})`);
  // Damage traits, and the bard's song.
  const party = defaultParty(TABLES, makeRng(4));
  const s = startCombat(TABLES, party, [{ id: 'a', monsters: ['rat'] }], makeRng(4));
  const rat = s.monsters[0];
  const bow = ITEMS.shortbow, sword = ITEMS.longsword;
  ok(traitDamage(s, mk('ranger'), bow, rat) > 0 && traitDamage(s, mk('ranger'), sword, rat) === 0, 'Marksman adds only to ranged attacks');
  // Sneak Attack (#1070): a blow on a foe in its first round, before its turn: the fight's first, its
  // place in the order not yet come, or the round it is called in, with no place in the order.
  const thief = mk('thief'), ratAt = s.order.findIndex((r) => r.side === 'monster' && r.i === 0), sneak = (): number => traitDamage(s, thief, sword, rat);
  s.turn = ratAt;
  ok(sneak() === SNEAK_ATTACK_DMG && sneaks(s, thief, rat) && !sneaks(s, mk('cleric'), rat), `Sneak Attack adds ${SNEAK_ATTACK_DMG} to a blow in the first round on a foe whose turn has not yet come, and a class without the trait does not sneak`);
  s.turn = ratAt + 1;
  ok(sneak() === 0 && !sneaks(s, thief, rat), 'and nothing to one on a foe that has acted');
  s.round = 2; s.turn = ratAt;
  ok(sneak() === 0 && !sneaks(s, thief, rat), 'nor in the second round, its first past, though its turn there has not yet come');
  const called = { ...rat };
  s.monsters.push(called);
  ok(traitDamage(s, thief, sword, called) === SNEAK_ATTACK_DMG && sneaks(s, thief, called), 'but a foe called in the second round, with no place in its order, takes it');
  s.monsters.pop();
  ok(TRAITS.sneak_attack.text.startsWith(`+${SNEAK_ATTACK_DMG} damage to a foe in its first round, before its turn;`) && TRAITS.sneak_attack.text.includes(` adds ${SNEAK_GROWTH} more every two levels past 10.`),
    `the trait says what the resolver plays ("${TRAITS.sneak_attack.text}")`);
  {
    // In play the log marks it, a sentence after the hit's own and before a death: a thief at speed 50
    // against a harmless rat of speed 0 strikes before its turn, against one of speed 100 after it.
    const blows = (speed: number, hp: number): string[] => [1, 2, 3, 4, 5, 6].flatMap((seed) => {
      const p = defaultParty(TABLES, makeRng(seed));
      p.members = p.members.filter((c) => c.cls === 'thief');
      p.members[0].stats.speed = 50;
      const f = startCombat(TABLES, p, [{ id: 'r', monsters: [{ ...MONSTERS.rat, id: 'test_rat', hp, ac: 0, attack: -50, dice: 1, sides: 1, speed }] }], makeRng(seed), { crits: false, feats: false });
      if (currentTurn(f, p, makeRng(seed))?.side === 'monster') monsterAct(f, p, makeRng(seed));
      partyAct(f, p, makeRng(seed + 10), { type: 'attack', target: 0 });
      return f.log.filter((l) => l.startsWith(`${p.members[0].name} hits `));
    });
    const before = blows(0, 999), after = blows(100, 999), fell = blows(0, 1);
    // The hit's head as the log's readers take it (tools/tests/mastery.ts, gear.ts and combat.ts).
    const name = MONSTERS.rat.name, head = (l: string): string => (/^\w+ hits .+? for \d+\./.exec(l) ?? [''])[0];
    ok(before.length > 0 && before.every((l) => l === `${head(l)} ${SNEAK_LINE}`) && after.length > 0 && after.every((l) => l === head(l)) && fell.length > 0 && fell.every((l) => l === `${head(l)} ${SNEAK_LINE} ${name} dies.`),
      `a thief's hit on a foe before its turn is marked after the hit's own sentence, before a death, and one after its turn is not ("${before[0]}" / "${fell[0]}" / "${after[0]}")`);
    ok([...before, ...fell].every((l) => / hits .* for (\d+)\./.exec(l)?.[1] === /for (\d+)\.$/.exec(head(l))?.[1] && new RegExp(` hits ${name} for (\\d+)`).test(l) && / (hits|misses|casts) /.test(l)),
      'and a marked line reads as the log\'s readers read a hit: its head and its damage stand');
  }
  const bb = mk('barbarian'); ok(traitDamage(s, bb, sword, rat) === 0, 'a healthy barbarian does not rage');
  bb.hp = 1; ok(traitDamage(s, bb, sword, rat) > 0, 'a wounded one does');
  // Holy Strike: the dead and nothing else, whatever else shrugs off sleep.
  s.round = 2;
  const pal = mk('paladin'), holy = (d: typeof MONSTERS[string]): number => traitDamage(s, pal, sword, { ...rat, def: d });
  const struck = Object.values(MONSTERS).filter((d) => holy(d) === HOLY_STRIKE_DMG).map((d) => d.id).sort();
  ok(struck.join() === 'ash_husk,barrow_captain,barrow_guard,bog_body,bone_knight,cairn_king,cairn_wight,choirmaster,drowned,drowned_chanter,ghoul,old_chanter,skeleton,temple_drowned,wraith', `Holy Strike lands on the fifteen dead (${struck.join(', ')})`);
  ok(Object.values(MONSTERS).every((d) => d.kind === 'dead' || holy(d) === 0), 'and on nothing else: not the slime, the crab or the wardens');
  ok(holy({ ...MONSTERS.slime, kind: 'dead' }) === HOLY_STRIKE_DMG && holy({ ...MONSTERS.skeleton, kind: 'beast' }) === 0, 'it follows the kind: a dead slime takes it, a skeleton made a beast does not');
  s.round = 1;
  const noBard = buffHit(s, party);
  party.members[3] = mk('bard');
  ok(buffHit(s, party) === noBard + INSPIRE_HIT, 'a standing bard inspires the party');
  addCondition(TABLES.items, party.members[3], 'unconscious'); ok(buffHit(s, party) === noBard, 'a fallen one does not');
  ok(hasTrait(mk('thief'), 'keen_eyes') && hasTrait(mk('ranger'), 'keen_eyes'), 'thieves and rangers have Keen Eyes');
}
