// The prestiges (#19; DESIGN §5): the titles, which become the class's name; the hit points and spell
// points each adds to every level from its own on, whenever it is taken; the trainer, who teaches
// one class one prestige, in order, from its level, for its price or its quest; and the perks the
// resolver plays. A save from before them loads with none taken.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { defaultParty, createCharacter, xpForLevel, levelUp, takePrestige, prestigePools, className, spellRank, prestigeOf, deathAt, damage, rest, isDown, hasCondition, PRESTIGES, PRESTIGE_LEVELS, CLASSES, DIE_HARD_AT, IRONHIDE_AT } from '../../src/game/party.ts';
import type { Character, Party, ClassId } from '../../src/game/party.ts';
import { startCombat, partyAct, currentTurn, monsterAct, blowsOf, buffHit, traitDamage, songDamage, songWards, vanished, canAttackFromRow, sneakDamage, rageBelow, VANISH_ROUND, BANNER_HIT, HOLY_STRIKE_RISEN, MARKSMAN_MORE } from '../../src/game/combat.ts';
import type { MonsterDef } from '../../src/game/monsters.ts';
import { HOLY_STRIKE_DMG, MARKSMAN_DMG, SNEAK_ATTACK_DMG, INSPIRE_HIT } from '../../src/game/party.ts';
import { offers, teach, barOf } from '../../src/game/prestige.ts';
import type { Teaching } from '../../src/game/prestige.ts';
import { World } from '../../src/game/world.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { serialize, deserialize } from '../../src/game/save.ts';
import { item } from '../../src/game/items.ts';
import { ok } from './lib.ts';

/** A member of a class trained to a level, its prestiges taken as far as the level allows, or `took`. */
function member(cls: ClassId, level: number, took = PRESTIGE_LEVELS.filter((l) => level >= l).length, seed = 19): Character {
  const rng = makeRng(seed), c = createCharacter(cls, 'human', cls, { might: 14, endurance: 14, personality: 14, intellect: 14 }, rng);
  c.xp = xpForLevel(level); levelUp(c, rng);
  for (let n = 0; n < took; n++) takePrestige(c);
  c.hp = c.maxHp; c.sp = c.maxSp;
  return c;
}
const company = (...members: Character[]): Party => ({ members, gold: 10000, food: 30, bag: [], flags: {} });
const foe = (kind: MonsterDef['kind'], extra: Partial<MonsterDef> = {}): MonsterDef =>
  ({ id: `fx_${kind}`, name: 'Straw Man', plural: 'Straw Men', sprite: 'rat', kind, level: 1, hp: 1000, ac: 0, attack: -20, dice: 1, sides: 2, bonus: 0, speed: 1, xp: 1, gold: [0, 0], tint: '#888', size: 0.5, ...extra });

export function prestige(): void {
  // The titles: three a class, none repeated, and the last taken is the class's name.
  const titles = Object.values(PRESTIGES).flatMap((p) => p.titles);
  ok(titles.length === 30 && new Set(titles).size === 30 && !titles.some((t) => Object.values(CLASSES).some((c) => c.name === t)), `thirty titles, each its own (${titles.length}, ${new Set(titles).size} distinct)`);
  const knight = member('knight', 10);
  ok(className(knight) === 'Knight' && prestigeOf(knight) === 0, 'a knight is a Knight until it takes a prestige');
  const errant = member('knight', 11);
  ok(className(errant) === 'Knight-Errant' && className(member('knight', 27)) === 'Knight Paramount' && spellRank(errant) === 0 && spellRank(member('cleric', 19)) === 2 && spellRank(member('bard', 11)) === 1,
    'the title becomes its name; a caster and a hybrid rank with each prestige, a knight not');

  // The pools: counted from each prestige's level, whenever it is taken, and every level after.
  const late = member('knight', 13, 0), plain = { hp: late.maxHp, sp: late.maxSp };
  takePrestige(late);
  ok(late.maxHp === plain.hp + 2 * 3 && prestigePools(late).hp === 6, `a knight who takes the first at 13 gains 2 hit points for each of 11, 12 and 13 (${late.maxHp - plain.hp})`);
  const cleric = member('cleric', 19, 0), before = { hp: cleric.maxHp, sp: cleric.maxSp };
  takePrestige(cleric); takePrestige(cleric);
  ok(cleric.maxHp - before.hp === 9 + 1 && cleric.maxSp - before.sp === 2 * (9 + 1), `a cleric at 19 with both gains 10 hit points and 20 spell points (${cleric.maxHp - before.hp}, ${cleric.maxSp - before.sp})`);
  const grown = member('cleric', 19), sp0 = grown.maxSp, hp0 = grown.maxHp, rng = makeRng(5);
  grown.xp = xpForLevel(20); levelUp(grown, rng);
  ok(grown.maxSp - sp0 >= 1 + 4 && grown.maxHp - hp0 >= 1 + 2, `and each level after adds what both add, 2 hit points and 4 spell points over the roll (${grown.maxHp - hp0}, ${grown.maxSp - sp0})`);

  // The trainer: its class only, in order, from its level, for its price, the third for its quest.
  const rng2 = makeRng(19), party = defaultParty(rng2), world = new World(buildMaps(), party, rng2);
  const errantry: Teaching = { cls: 'knight', prestige: 1 }, paramount: Teaching = { cls: 'knight', prestige: 3, done: { flag: 'fx_stair_held' } };
  const bram = party.members[0];
  party.gold = 5000;
  ok(offers(errantry, party, world.state).length === 1 && barOf(errantry, bram, party, world.state) === 'from level 11', `a knight at 1 is told the level (${barOf(errantry, bram, party, world.state)})`);
  bram.xp = xpForLevel(11); levelUp(bram, rng2);
  party.gold = 999;
  ok(barOf(errantry, bram, party, world.state) === 'not enough gold' && !teach(errantry, party, world.state, 0).taught && party.gold === 999, 'at 11 and short of the price, nothing changes');
  party.gold = 5000;
  const taught = teach(errantry, party, world.state, 0);
  ok(taught.taught && party.gold === 4000 && prestigeOf(bram) === 1 && className(bram) === 'Knight-Errant' && taught.line === 'Bram is a Knight-Errant now.', `and with it, Bram takes the first for 1000 ("${taught.line}")`);
  ok(barOf(errantry, bram, party, world.state) === 'Knight-Errant already' && !teach({ cls: 'knight', prestige: 1 }, party, world.state, 1).taught, 'taken once, it is not taught again, and never to a paladin');
  bram.xp = xpForLevel(27); levelUp(bram, rng2);
  ok(barOf(paramount, bram, party, world.state) === 'Knight Banneret first', 'the third waits on the second');
  takePrestige(bram);
  ok(barOf(paramount, bram, party, world.state) === 'the quest first', 'and on its quest');
  party.flags.fx_stair_held = 1;
  const third = teach(paramount, party, world.state, 0);
  ok(third.taught && party.gold === 4000 && className(bram) === 'Knight Paramount', 'its quest done, the third costs no gold');
  ok(offers({ cls: 'monk', prestige: 1 }, party, world.state).length === 0, 'a trainer of a class the company lacks has no one to teach');

  // A save with prestiges taken keeps them: the count, the hit points they added and a spent rite.
  {
    const r = makeRng(29), p = defaultParty(r), w = new World(buildMaps(), p, r), maren = p.members[4];
    maren.xp = xpForLevel(27); levelUp(maren, r);
    for (let n = 0; n < 3; n++) takePrestige(maren);
    maren.riteSpent = true;
    const back = deserialize(serialize(w.state, p, 0)).party.members[4];
    ok(back.prestige === 3 && back.maxHp === maren.maxHp && back.maxSp === maren.maxSp && back.riteSpent === true && className(back) === 'Exarch',
      `a save with prestiges taken keeps them: ${className(back)}, ${back.maxHp} hit points, the rite spent`);
  }

  // A save from before the prestiges, a member with neither field, loads with none taken.
  const old = deserialize(serialize(world.state, defaultParty(makeRng(1)), 0));
  ok(old.party.members.every((m) => prestigeOf(m) === 0 && className(m) === CLASSES[m.cls].name && !m.riteSpent), 'a save from before them loads with none taken');

  // The perks the resolver plays (DESIGN §5).
  const staffMonk = member('monk', 27), steelMonk = member('monk', 27);
  steelMonk.equipment.weapon = 'shortsword';
  const lightThief = member('thief', 11), heavyThief = member('thief', 11);
  heavyThief.equipment.weapon = 'axe';
  const bowRanger = member('ranger', 27), bladeRanger = member('ranger', 27);
  bowRanger.equipment.weapon = 'longbow'; bladeRanger.equipment.weapon = 'longsword';
  ok([member('knight', 10), member('knight', 11), member('knight', 19), member('knight', 27)].map(blowsOf).join() === '1,2,2,3' && blowsOf(member('barbarian', 27)) === 3 && blowsOf(member('paladin', 11)) === 2,
    'a knight strikes 1, 2, 2 and 3 times at 10, 11, 19 and 27; a barbarian and a paladin as it does');
  ok(blowsOf(staffMonk) === 3 && blowsOf(steelMonk) === 1 && blowsOf(lightThief) === 2 && blowsOf(heavyThief) === 1 && blowsOf(bowRanger) === 3 && blowsOf(bladeRanger) === 1 && blowsOf(member('cleric', 27)) === 1 && item('staff').kind === 'staff',
    'a monk with a staff or bare hands, a thief with a light weapon and a ranger with a bow; with anything else one blow, and a cleric always one');
  // The knight's banner: +2 to-hit for the front row while a knight of the second stands.
  const banner = company(member('knight', 19), member('paladin', 19), member('thief', 19), member('cleric', 19), member('sorcerer', 19), member('druid', 19));
  const s = startCombat(banner, [{ id: 'g', monsters: [foe('person')] }], makeRng(3));
  const front = buffHit(s, banner, 1), back = buffHit(s, banner, 4);
  banner.members[0].conditions = ['unconscious'];
  ok(front - back === BANNER_HIT && buffHit(s, banner, 1) === back, `the banner lifts the front row ${front - back} while the knight stands, and not once it is down`);
  // Damage: Marksman risen, Holy Strike risen, Rage at three quarters, the sneak attack growing.
  const s2 = startCombat(company(bowRanger), [{ id: 'g', monsters: [foe('dead')] }], makeRng(4)), dead = s2.monsters[0];
  const pal = member('paladin', 19), barb = member('barbarian', 19), thief24 = member('thief', 24);
  barb.hp = Math.floor(barb.maxHp * 0.7);
  ok(traitDamage(s2, bowRanger, item('longbow'), dead) === MARKSMAN_DMG + MARKSMAN_MORE && traitDamage(s2, pal, item('mace'), dead) === HOLY_STRIKE_RISEN && traitDamage(s2, member('paladin', 11), item('mace'), dead) === HOLY_STRIKE_DMG,
    `a ranger of the second shoots +${MARKSMAN_DMG + MARKSMAN_MORE}, a paladin of the second strikes the dead +${HOLY_STRIKE_RISEN}, one of the first +${HOLY_STRIKE_DMG}`);
  ok(rageBelow(barb) === 0.75 && traitDamage(s2, barb, item('axe'), dead) > 0 && rageBelow(member('barbarian', 11)) === 0.5 && sneakDamage(thief24) === SNEAK_ATTACK_DMG + 14 && sneakDamage(member('thief', 10)) === SNEAK_ATTACK_DMG,
    `an Ironhide rages below three quarters, and a thief's sneak attack at 24 is ${sneakDamage(thief24)}`);
  // The barbarian of the second dies only at -30.
  const ironhide = member('barbarian', 19);
  damage(ironhide, ironhide.hp + 25);
  ok(deathAt(ironhide) === IRONHIDE_AT && !hasCondition(ironhide, 'dead') && deathAt(member('barbarian', 11)) === DIE_HARD_AT, `an Ironhide at -25 lives (${ironhide.hp}), and dies only at ${IRONHIDE_AT}`);
  // The thief of the second drops from sight in its round: no foe singles it out, and it sneak-attacks.
  const shadow = member('thief', 19), sx = startCombat(company(shadow), [{ id: 'g', monsters: [foe('person')] }], makeRng(5));
  sx.round = VANISH_ROUND;
  ok(vanished(sx, shadow) && traitDamage(sx, shadow, item('dagger'), sx.monsters[0]) === sneakDamage(shadow) && !vanished(sx, member('thief', 11)), 'a Nightjar is out of sight in its round, its blows sneak attacks');
  {
    // Over many rounds, a monster facing a vanished thief and one other strikes only the other in that round.
    const pair = company(member('knight', 19), member('thief', 19)), sv = startCombat(pair, [{ id: 'g', monsters: [foe('person', { attack: 40, dice: 1, sides: 1, speed: 100 })] }], makeRng(6));
    let hitThief = 0;
    for (let k = 0; k < 40 && sv.outcome === 'ongoing'; k++) {
      const t = currentTurn(sv, pair, makeRng(6 + k));
      if (!t) break;
      if (t.side === 'monster') { const hp = pair.members[1].hp; monsterAct(sv, pair, makeRng(7 + k)); if (sv.round === VANISH_ROUND && pair.members[1].hp < hp) hitThief++; }
      else partyAct(sv, pair, makeRng(8 + k), { type: 'defend' });
    }
    ok(hitThief === 0, 'and no foe strikes it then');
  }
  // The monk of the second acts first and strikes from the back row.
  const fast = member('monk', 19), mx = startCombat(company(member('knight', 19), member('cleric', 19), member('sorcerer', 19), fast), [{ id: 'g', monsters: [foe('person', { speed: 99 })] }], makeRng(9));
  ok(mx.order[0].side === 'party' && mx.order[0].i === 3 && canAttackFromRow(fast, 3) && !canAttackFromRow(member('monk', 11), 3), 'a Windwalker acts first in a round, and strikes from the back row');
  // The bard: +1 damage from its first, wards sleep and paralysis from its second, +2 and +2 from its third.
  const songs = [10, 11, 19, 27].map((l) => company(member('bard', l), member('knight', l)));
  const sb = startCombat(songs[3], [{ id: 'g', monsters: [foe('person')] }], makeRng(10));
  ok(songs.map(songDamage).join() === '0,1,1,2' && buffHit(sb, songs[3]) === 2 && buffHit(sb, songs[0]) === INSPIRE_HIT && songWards(songs[2], 'asleep') && songWards(songs[2], 'paralysed') && !songWards(songs[2], 'poisoned') && !songWards(songs[1], 'asleep'),
    `the song adds ${songs.map(songDamage).join(', ')} damage at 10, 11, 19 and 27, and from the second keeps sleep and paralysis off`);
  // The cleric of the third: once between rests, the first who would die is left at 1 hit point.
  {
    const exarch = member('cleric', 27), tank = member('knight', 27), pair = company(tank, exarch);
    const brute = foe('person', { attack: 60, dice: 1, sides: 1, bonus: 400, speed: 100 });
    const sr = startCombat(pair, [{ id: 'g', monsters: [brute] }], makeRng(11));
    const first = currentTurn(sr, pair, makeRng(11));
    if (first?.side === 'monster') monsterAct(sr, pair, makeRng(12));
    const struck = pair.members.find((m) => m.hp === 1);
    ok(!!struck && exarch.riteSpent === true && !isDown(struck) && sr.log.some((l) => /rite holds/.test(l)), `a blow that would kill leaves the struck at 1 ("${sr.log.find((l) => /rite holds/.test(l)) ?? 'no rite'}")`);
    rest(exarch);
    ok(!exarch.riteSpent, 'and a rest makes it ready again');
  }
}
