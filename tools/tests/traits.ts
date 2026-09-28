// The class traits.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { ITEMS, MONSTERS } from '../../src/content/index.ts';
import { defaultParty, createCharacter, CLASSES, TRAITS, hasTrait, damage, STALWART_AC, HOLY_STRIKE_DMG, DIE_HARD_AT, INSPIRE_HIT, armorClass, addCondition, hasCondition } from '../../src/game/party.ts';
import { startCombat, castOnAlly, buffHit, traitDamage } from '../../src/game/combat.ts';
import { spell } from '../../src/game/spells.ts';
import { ok } from './lib.ts';

export function traits(): void {
  const mk = (cls: Parameters<typeof createCharacter>[2]) => createCharacter('T', 'human', cls, {}, makeRng(3));
  for (const cd of Object.values(CLASSES)) ok(cd.traits.length >= 1 && cd.traits.length <= 2 && cd.traits.every((t) => t in TRAITS), `a ${cd.name} has one or two traits (${cd.traits.join(', ')})`);
  // Stalwart: the knight's AC carries the bonus.
  const k = mk('knight'); const ac = armorClass(k);
  ok(ac === 10 + 5 + 1 + STALWART_AC, `a knight in scale and buckler is AC ${ac}`);
  // Unarmoured Defence grows with level and goes away under real armour.
  const monk = mk('monk'); const a1 = armorClass(monk); monk.level = 10;
  ok(armorClass(monk) === a1 + 5, `a level-10 monk in a robe gains AC (${a1} -> ${armorClass(monk)})`);
  const leatherMonk = mk('monk'); leatherMonk.equipment.armor = 'leather';
  ok(armorClass(leatherMonk) === 10 + 3, 'a monk in leather loses unarmoured defence');
  // Immunities come through addCondition.
  const cases: [Parameters<typeof createCharacter>[2], 'diseased' | 'cursed' | 'asleep' | 'paralysed' | 'poisoned'][] = [['paladin', 'diseased'], ['cleric', 'cursed'], ['sorcerer', 'asleep'], ['monk', 'paralysed'], ['druid', 'poisoned']];
  for (const [cls, cond] of cases) { const c = mk(cls); addCondition(c, cond); ok(!hasCondition(c, cond), `a ${cls} is immune to ${cond}`); }
  const kn = mk('knight'); addCondition(kn, 'poisoned'); ok(hasCondition(kn, 'poisoned'), 'a knight is not');
  // Die Hard: a barbarian at -15 is unconscious, not dead; a knight is dead.
  const b = mk('barbarian'); damage(b, b.hp + 15);
  ok(!hasCondition(b, 'dead') && hasCondition(b, 'unconscious'), 'a barbarian at -15 hp still lives');
  const b2 = mk('barbarian'); damage(b2, b2.hp + 25); ok(hasCondition(b2, 'dead') && b2.hp === DIE_HARD_AT, `but a blow past ${DIE_HARD_AT} kills`);
  const k2 = mk('knight'); damage(k2, k2.hp + 15); ok(hasCondition(k2, 'dead'), 'a knight at -15 hp is dead');
  // Healing Hands: the cleric heals more than a paladin with the same Personality.
  const cl = mk('cleric'), pa = mk('paladin'), hurtA = mk('knight'), hurtB = mk('knight');
  hurtA.maxHp = hurtB.maxHp = 100; hurtA.hp = hurtB.hp = 1;
  castOnAlly(cl, spell('heal'), hurtA); castOnAlly(pa, spell('heal'), hurtB);
  ok(hurtA.hp > hurtB.hp, `a cleric's Mend heals more (${hurtA.hp - 1} vs ${hurtB.hp - 1})`);
  // Damage traits, and the bard's song.
  const party = defaultParty(makeRng(4));
  const s = startCombat(party, [{ id: 'a', monsters: ['rat'] }], makeRng(4));
  const rat = s.monsters[0];
  const bow = ITEMS.shortbow, sword = ITEMS.longsword;
  ok(traitDamage(s, mk('ranger'), bow, rat) > 0 && traitDamage(s, mk('ranger'), sword, rat) === 0, 'Marksman adds only to ranged attacks');
  ok(traitDamage(s, mk('thief'), sword, rat) > 0, 'Sneak Attack adds in the first round');
  s.round = 2; ok(traitDamage(s, mk('thief'), sword, rat) === 0, 'and not after');
  const bb = mk('barbarian'); ok(traitDamage(s, bb, sword, rat) === 0, 'a healthy barbarian does not rage');
  bb.hp = 1; ok(traitDamage(s, bb, sword, rat) > 0, 'a wounded one does');
  // Holy Strike: the dead and nothing else, whatever else shrugs off sleep.
  s.round = 2;
  const pal = mk('paladin'), holy = (d: typeof MONSTERS[string]): number => traitDamage(s, pal, sword, { ...rat, def: d });
  const struck = Object.values(MONSTERS).filter((d) => holy(d) === HOLY_STRIKE_DMG).map((d) => d.id).sort();
  ok(struck.join() === 'bone_knight,drowned,ghoul,skeleton,wraith', `Holy Strike lands on the five dead (${struck.join(', ')})`);
  ok(Object.values(MONSTERS).every((d) => d.kind === 'dead' || holy(d) === 0), 'and on nothing else: not the slime, the crab or the wardens');
  ok(holy({ ...MONSTERS.slime, kind: 'dead' }) === HOLY_STRIKE_DMG && holy({ ...MONSTERS.skeleton, kind: 'beast' }) === 0, 'it follows the kind: a dead slime takes it, a skeleton made a beast does not');
  s.round = 1;
  const noBard = buffHit(s, party);
  party.members[3] = mk('bard');
  ok(buffHit(s, party) === noBard + INSPIRE_HIT, 'a standing bard inspires the party');
  addCondition(party.members[3], 'unconscious'); ok(buffHit(s, party) === noBard, 'a fallen one does not');
  ok(hasTrait(mk('thief'), 'keen_eyes') && hasTrait(mk('ranger'), 'keen_eyes'), 'thieves and rangers have Keen Eyes');
}
