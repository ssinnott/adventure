// The secondary skills (#538, #805, #856, #857; DESIGN §5, §8): a list on each member, all twelve
// built. Each is one of DESIGN §5's twelve and taught by the guild DESIGN §8's table gives it; every
// hall of that guild teaches its guild's three, to the guild's members, and a person who teaches one
// teaches it too; a stranger to the guild is told so; a member learns a skill once, for its price; a
// people or a class may be born to one (the dwarves to Linguist, the elves and the gnomes to
// Perception, the Rangers to Pathfinder, the Thieves to Lockpick), and the hall will not sell it them;
// the sheet lists what a member has. Each hall's own menu, two levels deep, is walked through a Game
// as a player meets it, and every row of it fits the panel. Each skill does its work with it and not
// without, for a company of each people: Mountaineer and Swimmer climb and swim; Perception finds
// surely, and a square further; Spirit Sense marks the dead through a wall and Danger Sense an aware
// group behind a hill; with an Arms Master standing the company's first round comes before the
// monsters'; a Cartographer, or a chart, maps a square further; a Lockpick, or a set of picks, opens a
// locked chest, which a key opens too and nothing else. Pathfinder's pace and Lockpick's doors are
// tools/tests/movement.ts's, Merchant's price tools/tests/shops.ts's and Navigator's fare
// tools/tests/passage.ts's. A save keeps a member's skills, and one from before them has none.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { FONT_CHARS, measureText } from '../../src/lib/engine/text.ts';
import { defaultParty, partyCan, isDown, takePrestige, RACES, CLASSES, NAME_MAX } from '../../src/game/party.ts';
import type { Party, RaceId, ClassId } from '../../src/game/party.ts';
import { World } from '../../src/game/world.ts';
import { GameMap } from '../../src/game/map.ts';
import type { MapDef, Feature } from '../../src/game/map.ts';
import type { ItemDef } from '../../src/game/items.ts';
import type { Person } from '../../src/game/people.ts';
import { startCombat, currentTurn } from '../../src/game/combat.ts';
import type { TurnRef } from '../../src/game/combat.ts';
import type { Screen } from '../../src/game/game.ts';
import { ChoiceScreen, skillMenu, skillsLines, SHEET_COL_W } from '../../src/ui/screens.ts';
import { talk } from '../../src/game/pilot/talk.ts';
import { Pilot } from '../../src/game/pilot/pilot.ts';
import type { Action } from '../../src/input.ts';
import { NORTH, EAST, SOUTH, WEST } from '../../src/game/types.ts';
import type { Facing } from '../../src/game/types.ts';
import { logLines, markedGroups, SIDE_W } from '../../src/ui/frame.ts';
import { optionParts, columnLabelWidth } from '../../src/ui/draw.ts';
import { daylightAt } from '../../src/game/calendar.ts';
import { findWeather, weatherSight } from '../../src/game/weather.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { serialize, deserialize } from '../../src/game/save.ts';
import { rankFlag } from '../../src/content/guilds.ts';
import type { GuildId } from '../../src/content/guilds.ts';
import { MAP_DEFS, CLIMATES, ITEMS } from '../../src/content/index.ts';
import { SKILLS, SKILL_PRICE, SPIRIT_REACH, STRANGER, LEAVE_SKILLS, skillsOf, hasSkill, bornTo, skillNames, taughtBy, mayLearn, skillOffers, skillLine, skillRow, skillBar, learn, askSkill, askWhich, skilled } from '../../src/game/skills.ts';
import type { SkillId } from '../../src/game/skills.ts';
import { ok, headlessGame, drive } from './lib.ts';

/** DESIGN §8's table: the skills each guild teaches, three to a guild, twelve in all (DESIGN §5). */
const TAUGHT: Record<GuildId, readonly string[]> = {
  wardens: ['Arms Master', 'Danger Sense', 'Mountaineer'],
  lanterns: ['Spirit Sense', 'Linguist', 'Perception'],
  cartographers: ['Cartographer', 'Pathfinder', 'Swimmer'],
  compact: ['Lockpick', 'Merchant', 'Navigator'],
};

/**
 * What is built of that table, in `SKILLS`' order: the Lanterns' Linguist (#538), Perception and
 * Spirit Sense (#856), the Wardens' Mountaineer (#805), Danger Sense and Arms Master (#856), the
 * Cartographers' Swimmer (#805), Cartographer and Pathfinder, and the Compact's Lockpick, Merchant and
 * Navigator (#857). Written out, not read from `SKILLS`, so a skill built or a hall that stops teaching
 * one is a change this test is told of.
 */
const BUILT: Record<GuildId, readonly SkillId[]> = {
  wardens: ['mountaineer', 'danger_sense', 'arms_master'],
  lanterns: ['linguist', 'perception', 'spirit_sense'],
  cartographers: ['swimmer', 'cartographer', 'pathfinder'],
  compact: ['lockpick', 'merchant', 'navigator'],
};

/**
 * Who is born to each, by people or class: the dwarves to Linguist, the elves and the gnomes to
 * Perception (#856), the Rangers to Pathfinder and the Thieves to Lockpick (#857); nobody to the rest.
 */
const BORN: Partial<Record<SkillId, readonly string[]>> = { linguist: ['dwarf'], perception: ['elf', 'gnome'], pathfinder: ['ranger'], lockpick: ['thief'] };

/** The texts of #856's four, as the halls' rows note them. */
const TEXTS: Partial<Record<SkillId, string>> = {
  perception: 'Finds hidden doors, even a square off.', spirit_sense: 'Senses the dead through walls.',
  danger_sense: 'Senses what hunts the company.', arms_master: 'The company strikes first.',
};

/** The texts of #857's five. */
const FIVE: Partial<Record<SkillId, string>> = {
  cartographer: 'Maps a square further.', pathfinder: 'Walks rough ground at the road\'s pace.', lockpick: 'Picks locks, and keeps the key.',
  merchant: 'Sells at two thirds, not half.', navigator: 'Pays half fare on every crossing.',
};

/** A hall of the content: where it stands and what its guild's halls teach. */
interface Hall { map: string; x: number; y: number; name: string; hall: GuildId; taught: SkillId[] }

const company = (setup?: (p: Party) => void): Party => { const p = defaultParty(makeRng(11)); setup?.(p); return p; };

/** Every people there is, and every class. */
const PEOPLES = Object.keys(RACES) as RaceId[];
const KINDS_OF = Object.keys(CLASSES) as ClassId[];

export function skills(): void {
  // The table: each skill one of the twelve, taught by the guild DESIGN §8 gives it, at the skill price.
  const built = Object.values(SKILLS);
  const astray = built.filter((s) => !TAUGHT[s.guild].includes(s.name) || s.price !== SKILL_PRICE || !BUILT[s.guild].includes(s.id));
  ok(built.length === Object.values(BUILT).flat().length && !astray.length,
    `each skill built is one of the twelve, its guild's, at ${SKILL_PRICE} gold: ${built.map((s) => `${s.name} (${s.guild})`).join(', ')}${astray.length ? ' -> astray: ' + astray.map((s) => s.name).join(', ') : ''}`);
  const born = built.map((s) => `${s.name} ${[...(s.races ?? []), ...(s.classes ?? [])].join('+') || 'none'}`);
  const misborn = built.filter((s) => [...(s.races ?? []), ...(s.classes ?? [])].join() !== (BORN[s.id] ?? []).join());
  ok(!misborn.length, `the dwarves are born to Linguist, the elves and the gnomes to Perception, the Rangers to Pathfinder and the Thieves to Lockpick, and nobody to the others (${born.join(', ')})`);
  ok(Object.values(BUILT).every((ids) => ids.length === 3), 'every guild teaches its three: all twelve are built');
  ok(Object.values(TAUGHT).flat().length === 12 && new Set(Object.values(TAUGHT).flat()).size === 12, 'the twelve, three to a guild');
  // The rows of #805: the Wardens' Mountaineer and the Cartographers' Swimmer (the Tidefolk swim by their people).
  ok(SKILLS.mountaineer.guild === 'wardens' && SKILLS.mountaineer.text === 'Climbs mountain and cliff.' && SKILLS.swimmer.guild === 'cartographers' && SKILLS.swimmer.text === 'Swims deep water.',
    `Mountaineer is the Wardens' and Swimmer the Cartographers' ("${SKILLS.mountaineer.text}" / "${SKILLS.swimmer.text}")`);
  // The rows of #856: the Lanterns' Perception and Spirit Sense, the Wardens' Danger Sense and Arms Master.
  const four = (Object.keys(TEXTS) as SkillId[]).filter((id) => SKILLS[id].text === TEXTS[id]);
  ok(four.length === 4 && SKILLS.perception.guild === 'lanterns' && SKILLS.spirit_sense.guild === 'lanterns' && SKILLS.danger_sense.guild === 'wardens' && SKILLS.arms_master.guild === 'wardens',
    `Perception and Spirit Sense are the Lanterns' and Danger Sense and Arms Master the Wardens' (${four.map((id) => `"${SKILLS[id].text}"`).join(' / ')})`);
  // The rows of #857: the Cartographers' Cartographer and Pathfinder, the Compact's Lockpick, Merchant and Navigator.
  const five = (Object.keys(FIVE) as SkillId[]).filter((id) => SKILLS[id].text === FIVE[id] && SKILLS[id].guild === (id === 'cartographer' || id === 'pathfinder' ? 'cartographers' : 'compact'));
  ok(five.length === 5, `Cartographer and Pathfinder are the Cartographers' and Lockpick, Merchant and Navigator the Compact's (${five.map((id) => `"${SKILLS[id].text}"`).join(' / ')})`);
  const wide = built.map((s) => { const p = company((q) => { q.gold = SKILL_PRICE; q.flags[rankFlag(s.guild)] = 1; q.members[0].name = 'M'.repeat(NAME_MAX); }); return { skill: s.name, lines: logLines(learn(s.id, p, 0).line).length }; });
  ok(wide.every((w) => w.lines >= 1 && w.lines <= 2), `a member with the longest name learns any skill in two lines of the log at most (${wide.map((w) => `${w.skill} ${w.lines}`).join(', ')})`);

  // Every hall teaches all its guild has built: each guild's three.
  const halls: Hall[] = MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => ('hall' in f && f.hall ? [{ map: d.id, x: f.x, y: f.y, name: f.name, hall: f.hall, taught: taughtBy(f.hall) }] : [])));
  const lanterns = halls.filter((h) => h.hall === 'lanterns'), of = (g: GuildId): string => halls.filter((h) => h.hall === g).map((h) => h.name).join(', ');
  const names = (g: GuildId): string => BUILT[g].map((id) => SKILLS[id].name).join(', ') || 'nothing yet';
  const astrayHalls = halls.filter((h) => h.taught.join() !== BUILT[h.hall].join());
  ok(lanterns.length >= 3 && !astrayHalls.length,
    `every hall teaches all its guild has built: ${(Object.keys(BUILT) as GuildId[]).map((g) => `${names(g)} at the ${g}' (${of(g)})`).join('; ')}${astrayHalls.length ? ' -> astray: ' + astrayHalls.map((h) => `${h.name} (${h.taught.join() || 'none'})`).join(', ') : ''}`);
  ok(['Lantern Guildhall', 'Thornhold Lantern Hall', 'The Watch\'s Lantern Hall'].every((n) => lanterns.some((h) => h.name === n)), 'Helmstow\'s, Thornhold\'s and the Watch\'s among them');
  const named = (g: GuildId, n: string): boolean => halls.some((h) => h.hall === g && h.name === n);
  ok(named('wardens', 'Warden Drillyard') && named('cartographers', 'The Map Room') && named('cartographers', 'The Chart House') && named('compact', 'The Keel') && named('compact', 'The Factor\'s House'),
    'and the Drillyard, Saltmouth\'s Map Room and Cinderport\'s Chart House, Saltmouth\'s Keel and Cinderport\'s Factor\'s House among the Wardens\', the Cartographers\' and the Compact\'s');
  const teachers = MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => (f.kind === 'npc' && f.skill ? [`${f.name} (${f.skill})`] : [])));
  ok(teachers.some((t) => t.startsWith('Wystan Crane') && t.endsWith('(linguist)')), `the people who teach a skill, Anvilhall's Lantern reader among them (#459): ${teachers.join(', ')}`);

  // A stranger to the guild learns nothing; a member, for the price, once.
  {
    const party = company(), maren = party.members[4];
    party.gold = 5000;
    ok(!mayLearn('linguist', party) && !learn('linguist', party, 4).taught && party.gold === 5000 && !skillsOf(maren).length, 'a company not of the Lanterns is taught nothing');
    party.flags[rankFlag('lanterns')] = 1;
    const offers = skillOffers('linguist', party);
    ok(offers.length === 6 && offers.every((o, i) => o.who === i && o.skill === 'linguist' && !o.bar && o.price === SKILL_PRICE) && skillLine(offers[4], party) === `Maren\t${SKILL_PRICE}g` && skillRow('linguist') === `Linguist\t${SKILL_PRICE}g\tReads Kiln-script.`,
      `a Taper is offered it for each of the six: the hall's row with its price and text, then each member's with the price (${skillRow('linguist').replace(/\t/g, ' | ')} / ${skillLine(offers[4], party).replace(/\t/g, ' | ')})`);
    const taught = learn('linguist', party, 4);
    ok(taught.taught && taught.line === 'Maren learns Linguist.' && party.gold === 5000 - SKILL_PRICE && hasSkill(maren, 'linguist') && skillNames(maren).join() === 'Linguist',
      `and Maren learns it for ${SKILL_PRICE} ("${taught.line}"), and the sheet lists it`);
    ok(skillBar('linguist', maren, party) === 'known' && !learn('linguist', party, 4).taught && party.gold === 5000 - SKILL_PRICE && skillsOf(maren).length === 1, 'learnt, it is not taught again');
    party.gold = SKILL_PRICE - 1;
    ok(skillBar('linguist', party.members[0], party) === 'not enough gold' && !learn('linguist', party, 0).taught, 'short of the price, nothing changes');
  }
  // A dwarf is born to Linguist: it has it without learning, the sheet says so, and the hall says why it need not.
  {
    const party = company((p) => { p.members[1].race = 'dwarf'; p.flags[rankFlag('lanterns')] = 1; p.gold = 5000; });
    const idris = party.members[1];
    ok(hasSkill(idris, 'linguist') && !skillsOf(idris).length && skillNames(idris).join() === 'Linguist' && skillBar('linguist', idris, party) === 'born to it' && !learn('linguist', party, 1).taught,
      'a dwarf has Linguist unlearnt, the sheet lists it, and the hall will not sell it');
    const others = party.members.filter((m) => m !== idris).map((m) => `${m.name} ${skillNames(m).join('+') || 'none'}`).join(', ');
    ok(others === 'Bram none, Wren Perception+Pathfinder, Ottilie Perception+Lockpick, Maren none, Cassian none',
      `and of the others only the elf ranger and the gnome thief have skills, born to them (${others})`);
  }
  // The elves and the gnomes are born to Perception: a member has it unlearnt, the sheet lists it and
  // the hall will not sell it; a member of the other four peoples has it only learnt.
  {
    const answers = PEOPLES.map((race) => {
      const party = company((p) => { for (const m of p.members) m.race = race; p.flags[rankFlag('lanterns')] = 1; p.gold = 5000; }), c = party.members[0];
      const isBorn = race === 'elf' || race === 'gnome', had = hasSkill(c, 'perception'), listed = skillNames(c).includes('Perception'), bar = skillBar('perception', c, party), taught = learn('perception', party, 0).taught;
      const fine = had === isBorn && listed === isBorn && bar === (isBorn ? 'born to it' : '') && taught === !isBorn && hasSkill(c, 'perception') && party.gold === (isBorn ? 5000 : 5000 - SKILL_PRICE);
      return { fine, said: `${race}: ${bar || 'sold'}${fine ? '' : ' WRONG'}` };
    });
    ok(answers.every((a) => a.fine), `an elf and a gnome are born to Perception, the sheet lists it and the hall will not sell it; the other peoples buy it (${answers.map((a) => a.said).join(', ')})`);
  }
  // The Rangers are born to Pathfinder and the Thieves to Lockpick (#857): a member of the class has it
  // unlearnt, the sheet lists it and the hall will not sell it; a member of every other class buys it.
  for (const [id, cls] of [['pathfinder', 'ranger'], ['lockpick', 'thief']] as const) {
    const answers = KINDS_OF.map((k) => {
      const party = company((p) => { for (const m of p.members) { m.cls = k; m.race = 'human'; } p.flags[rankFlag(SKILLS[id].guild)] = 1; p.gold = 5000; }), c = party.members[0];
      const isBorn = k === cls, had = hasSkill(c, id), listed = skillNames(c).includes(SKILLS[id].name), bar = skillBar(id, c, party), taught = learn(id, party, 0).taught;
      const fine = had === isBorn && listed === isBorn && bar === (isBorn ? 'born to it' : '') && taught === !isBorn && hasSkill(c, id) && party.gold === (isBorn ? 5000 : 5000 - SKILL_PRICE);
      return { fine, said: `${k}: ${bar || 'sold'}${fine ? '' : ' WRONG'}` };
    });
    ok(answers.every((a) => a.fine), `the ${cls === 'thief' ? 'Thieves' : 'Rangers'} are born to ${SKILLS[id].name}, the sheet lists it and the hall will not sell it; every other class buys it (${answers.map((a) => a.said).join(', ')})`);
  }
  // The others, as Linguist: a company of another guild is taught nothing; a company of the guild is
  // offered the skill for each of the six but one born to it, and a member learns it for the price, once.
  for (const [id, who] of [['mountaineer', 0], ['swimmer', 3], ['perception', 0], ['spirit_sense', 4], ['danger_sense', 1], ['arms_master', 5], ['cartographer', 1], ['pathfinder', 0], ['lockpick', 4], ['merchant', 5], ['navigator', 2]] as const) {
    const s = SKILLS[id], other = (Object.keys(BUILT) as GuildId[]).find((g) => g !== s.guild && BUILT[g].length)!;
    const party = company((p) => { p.gold = 5000; p.flags[rankFlag(other)] = 1; }), m = party.members[who], next = who ? 0 : 1;
    ok(!mayLearn(id, party) && !learn(id, party, who).taught && party.gold === 5000 && party.members.every((c) => !skillsOf(c).length), `${s.name}: a company of the ${other} and not of the ${s.guild} is taught nothing`);
    party.flags[rankFlag(s.guild)] = 1;
    const offers = skillOffers(id, party);
    ok(offers.length === 6 && offers.every((o, i) => o.who === i && o.skill === id && o.price === SKILL_PRICE && o.bar === (bornTo(party.members[i], id) ? 'born to it' : '')) && skillLine(offers[who], party) === `${m.name}\t${SKILL_PRICE}g`,
      `${s.name}: a company of the ${s.guild} is offered it for each of the six but one born to it (${offers.map((o) => skillLine(o, party).replace('\t', ' ')).join(', ')})`);
    const taught = learn(id, party, who);
    ok(taught.taught && taught.line === `${m.name} learns ${s.name}.` && party.gold === 5000 - SKILL_PRICE && hasSkill(m, id) && skillNames(m).includes(s.name) && party.members.filter((c) => c !== m).every((c) => hasSkill(c, id) === bornTo(c, id)),
      `${s.name}: ${m.name} learns it for ${SKILL_PRICE} ("${taught.line}"), and the sheet lists it, and none of the others has it but by birth`);
    ok(skillBar(id, m, party) === 'known' && !learn(id, party, who).taught && party.gold === 5000 - SKILL_PRICE && skillsOf(m).length === 1, `${s.name}: learnt, it is not taught again`);
    party.gold = SKILL_PRICE - 1;
    ok(skillBar(id, party.members[next], party) === 'not enough gold' && !learn(id, party, next).taught && !skillsOf(party.members[next]).length, `${s.name}: short of the price, nothing changes`);
  }
  // partyCan reads a member's list itself (game/party.ts cannot import skills.ts: a cycle), so it is
  // held to `hasSkill`'s answer for every people, each skill learnt or not, its learner standing or down.
  {
    const answers = (PEOPLES).flatMap((race) => ([[], ['mountaineer'], ['swimmer'], ['mountaineer', 'swimmer']] as SkillId[][]).flatMap((learnt) => [false, true].map((down) => {
      const p = company((q) => { for (const m of q.members) m.race = race; q.members[0].skills = [...learnt]; if (down) q.members[0].conditions.push('dead'); });
      const up = p.members.filter((m) => !isDown(m)), can = partyCan(p);
      return can.climb === up.some((m) => hasSkill(m, 'mountaineer')) && can.swim === up.some((m) => RACES[m.race].swim || hasSkill(m, 'swimmer')) ? '' : `${race} with ${learnt.join('+') || 'none'}${down ? ' down' : ''}`;
    })));
    ok(answers.every((a) => !a), `partyCan answers as hasSkill does for every people (${PEOPLES.length}), with Mountaineer, Swimmer, both or neither learnt, the learner standing or down${answers.some((a) => a) ? ' -> astray: ' + answers.filter((a) => a).join(', ') : ''}`);
  }
  // newRound reads Arms Master off the list as partyCan reads its two, and is held to `hasSkill` likewise.
  armsMaster();
  // The halls' own menus, through a Game, and a person who teaches; every row of them fits the panel.
  menus(halls);
  fits();
  // Perception's search, and the senses on the automap; the Cartographer's map, and the locked chest.
  perception();
  senses();
  cartographer();
  lockedChest();
  // The pilot learns none.
  piloted();
  // A save keeps a member's skills; a member saved before them has none.
  {
    const rng = makeRng(13), party = defaultParty(rng), world = new World(buildMaps(), party, rng);
    party.members[2].skills = ['linguist'];
    const back = deserialize(serialize(world.state, party, 0)).party;
    ok(skillsOf(back.members[2]).join() === 'linguist' && back.members.filter((_, i) => i !== 2).every((m) => !skillsOf(m).length), 'a save keeps a member\'s skills');
    party.members[3].skills = ['mountaineer', 'swimmer'];
    const both = deserialize(serialize(world.state, party, 0)).party;
    ok(skillsOf(both.members[3]).join() === 'mountaineer,swimmer' && skillsOf(both.members[2]).join() === 'linguist' && partyCan(both).climb && partyCan(both).swim, 'and Mountaineer\'s and Swimmer\'s, which climb and swim the company on loading');
    party.members[5].skills = ['perception', 'spirit_sense', 'danger_sense', 'arms_master'];
    const four2 = deserialize(serialize(world.state, party, 0)).party;
    ok(skillsOf(four2.members[5]).join() === 'perception,spirit_sense,danger_sense,arms_master', 'and the four of #856');
    party.members[0].skills = ['cartographer', 'pathfinder', 'lockpick', 'merchant', 'navigator'];
    const five2 = deserialize(serialize(world.state, party, 0)).party;
    ok(skillsOf(five2.members[0]).join() === 'cartographer,pathfinder,lockpick,merchant,navigator', 'and the five of #857');
    const old = JSON.parse(serialize(world.state, party, 0)) as { party: Party };
    for (const m of old.party.members) delete m.skills;
    const loaded = deserialize(JSON.stringify(old)).party;
    ok(loaded.members.every((m) => !skillsOf(m).length && !hasSkill(m, 'linguist') && !hasSkill(m, 'mountaineer') && !hasSkill(m, 'swimmer') && !hasSkill(m, 'arms_master')), 'and a save from before the skills loads with none learnt');
    ok(!partyCan(loaded).climb, 'and such a company climbs nothing');
  }
}

/**
 * Arms Master (#856): in the first round every standing member acts before any monster while an Arms
 * Master stands, and from the second the round goes by speed again. A company of each people and of
 * each class, every member slowed to a speed of -100 against three wolves, so that without the skill
 * every wolf acts first: with it learnt by a member standing the six come first; unlearnt, or with its
 * learner down, the wolves do. `newRound` reads the list itself, so this holds it to `hasSkill`.
 */
function armsMaster(): void {
  const sides = (order: readonly TurnRef[]): string => order.map((r) => (r.side === 'party' ? 'p' : 'm')).join('');
  const seen = new Set<string>();
  const answers = PEOPLES.flatMap((race) => KINDS_OF.flatMap((cls) => (['none', 'learnt', 'down'] as const).map((how) => {
    const rng = makeRng(23), p = defaultParty(rng);
    for (const m of p.members) { m.race = race; m.cls = cls; m.stats.speed = -100; }
    if (how !== 'none') p.members[0].skills = ['arms_master'];
    if (how === 'down') p.members[0].conditions.push('dead');
    const s = startCombat(p, [{ id: 'g', monsters: ['wolf', 'wolf', 'wolf'] }], rng), one = sides(s.order);
    const strikes = p.members.some((m) => !isDown(m) && hasSkill(m, 'arms_master'));
    // The next round: past every turn of the first, who acts first.
    s.turn = s.order.length;
    const next = currentTurn(s, p, rng)?.side;
    seen.add(`${how} ${one}, then ${next}`);
    const want = strikes ? 'ppppppmmm' : how === 'down' ? 'mmmppppp' : 'mmmpppppp';
    return one === want && next === 'monster' && strikes === (how === 'learnt') ? '' : `${race} ${cls} ${how}: ${one}, then ${next}`;
  })));
  ok(answers.every((a) => !a), `with an Arms Master standing the company's first round comes before the wolves', and the second goes by speed; unlearnt or down, the wolves come first; for every people and class (${[...seen].join('; ')})${answers.some((a) => a) ? ' -> astray: ' + answers.filter((a) => a).slice(0, 6).join(', ') : ''}`);
  // A monk of the second prestige acts first of all (#856's builder's 5): before an Arms Master's
  // company, and before the wolves without one. He is the slowest of the six, so only that rule puts him first.
  const monk = (master: boolean): string => {
    const rng = makeRng(23), p = defaultParty(rng);
    for (const m of p.members) { m.race = 'human'; m.cls = 'knight'; m.stats.speed = -100; }
    const mk = p.members[3];
    mk.cls = 'monk'; mk.stats.speed = -110; takePrestige(mk); takePrestige(mk);
    if (master) p.members[0].skills = ['arms_master'];
    return startCombat(p, [{ id: 'g', monsters: ['wolf', 'wolf', 'wolf'] }], rng).order.map((r) => (r.side === 'party' ? String(r.i) : 'm')).join('');
  };
  const led = monk(true), alone = monk(false);
  ok(/^3[0-5]{5}mmm$/.test(led) && /^3mmm[0-5]{5}$/.test(alone), `a monk of the second prestige acts first of all: before the rest of a company with an Arms Master, then the wolves; before the wolves without one (${led} / ${alone})`);
}

/** The Foreland's ridge, a step east of 30,2, and its water, a step south of 12,28 (tools/tests/movement.ts): what a company can cross, as the world answers a step. */
const OPENS: Partial<Record<SkillId, { x: number; y: number; facing: Facing }>> = { mountaineer: { x: 30, y: 2, facing: EAST }, swimmer: { x: 12, y: 28, facing: SOUTH } };

/**
 * The halls' own menus, walked through a Game as a player meets them: stepped in on the door, the
 * keeper heard out, down to "Learn a skill", Space. Every guild has its three built (#857), so every
 * hall has the row, after the guild's work. The row opens the hall's skills,
 * each with its price (#856); a skill chosen opens who would learn it, the six with the price or why
 * not, and a member is taught for the price there, and the menu comes again with the member known;
 * Leave goes back a level, to the skills and then the first menu. A member born to a skill is not sold
 * it (the elf and the gnome Perception, the ranger Pathfinder, the thief Lockpick): their rows say they
 * are born to it, and choosing one does nothing. A company of no guild,
 * and one of another, hears STRANGER and is taught nothing. What Mountaineer and Swimmer teach, the
 * company then does: the ridge is climbed and the water swum (#805). A person who teaches a skill opens
 * on who would learn it.
 */
function menus(halls: readonly Hall[]): void {
  const g = headlessGame(4), p = g.party, WHO = 0;
  const kind = (s: Screen = g.top): string => s.constructor.name;
  const options = (): string[] => (kind() === 'ChoiceScreen' ? (g.top as ChoiceScreen).options : []);
  const words = (): string => (kind() === 'ChoiceScreen' ? (g.top as ChoiceScreen).words : kind() === 'MessageScreen' ? (g.top as unknown as { text: string }).text : kind());
  const downTo = (row: number): Action[] => Array.from({ length: Math.max(0, row) }, (): Action => 'down');
  /** A new company of `setup`'s making: 5000 gold, no rank, no skill, Maren a Tidefolk unless made otherwise. */
  const raise = (setup: (q: Party) => void): void => {
    p.gold = 5000;
    for (const k of Object.keys(p.flags)) if (k.startsWith('rank_')) delete p.flags[k];
    for (const m of p.members) delete m.skills;
    p.members[4].race = 'tidefolk';
    setup(p);
  };
  /** Stepped in on a hall's door and the keeper heard out: its first menu's options. */
  const enter = (h: Hall): string[] => {
    while (g.screens.length > 1) g.pop();
    g.world.travel(h.map, h.x, h.y, 0);
    g.enterCell();
    for (let i = 0; i < 4 && kind() === 'MessageScreen'; i++) drive(g, ['interact']);
    return options();
  };
  const leave = (): string => { for (let i = 0; i < 6 && g.screens.length > 1; i++) drive(g, ['cancel']); return kind(); };
  /** What a step ahead from the Foreland's ridge or its water says now: 'moved' or 'blocked'. */
  const crosses = (id: SkillId): string => {
    const at = OPENS[id];
    if (!at) return '';
    g.world.travel('shelf', at.x, at.y, at.facing);
    return g.world.move('forward').kind;
  };
  /** The second level's row for each of the six, as a fresh company of the guild sees it. */
  const rowsFor = (id: SkillId): string[] => p.members.map((m) => `${m.name}\t${bornTo(m, id) ? 'born to it' : `${SKILL_PRICE}g`}`);
  const guilds = Object.keys(BUILT) as GuildId[];
  for (const h of halls) {
    const ids = BUILT[h.hall], guild = h.hall, here = `${h.name} (${h.map})`;
    // A company of the guild buys each skill there for one member, and what they open opens.
    raise((q) => { q.flags[rankFlag(guild)] = 1; q.members[4].race = 'human'; });
    const was = ids.map(crosses), first = enter(h), row = first.indexOf('Learn a skill');
    const after = row > 0 && first[row - 1].startsWith('Work for ');
    drive(g, [...downTo(row), 'interact']);
    const which = words(), list = options();
    const bought = ids.map((id, k) => {
      const s = SKILLS[id], gold = p.gold;
      drive(g, [`n${k + 1}` as Action]);
      const ask = words(), menu = options(), want = rowsFor(id);
      // A member born to it (the elf and the gnome to Perception, the ranger to Pathfinder, the thief to Lockpick): chosen, nothing happens.
      const born = p.members.flatMap((m, i) => (bornTo(m, id) ? [i] : []));
      drive(g, born.map((i) => `n${i + 1}` as Action));
      const refused = p.gold === gold && born.every((i) => !skillsOf(p.members[i]).length) && words() === ask && (id !== 'pathfinder' && id !== 'lockpick' || born.length === 1);
      drive(g, [`n${WHO + 1}` as Action]);
      const known = options()[WHO], has = hasSkill(p.members[WHO], id), told = g.log[g.log.length - 1];
      drive(g, ['cancel']);
      const backWords = words(), backList = options();
      const fine = ask === `"Who would learn?" (${gold} gold.)` && menu.length === 7 && menu.slice(0, 6).join('|') === want.join('|') && menu[6] === 'Leave' && refused
        && known === `${p.members[WHO].name}\tknown` && p.gold === gold - SKILL_PRICE && has && told === `${p.members[WHO].name} learns ${s.name}.`
        && backWords === `"Which skill?" (${p.gold} gold.)` && backList.join('|') === list.join('|');
      return { fine, said: `${s.name}: ${menu.map((r) => r.replace('\t', ' ')).join(', ')}; ${told}` };
    });
    drive(g, ['cancel']);
    const home = options(), out = leave(), now = ids.map(crosses);
    ok(after && which === '"Which skill?" (5000 gold.)' && list.join('|') === [...ids.map(skillRow), 'Leave'].join('|') && bought.every((b) => b.fine) && home.join() === first.join() && out === 'ExploreScreen',
      `${here}: a company of the ${guild} finds "Learn a skill" after the ${guild}' work, is asked which skill (${list.map((r) => optionParts(r).label).join(', ')}), buys each for ${p.members[WHO].name} at ${SKILL_PRICE} from who would learn it, sees them known, and comes back a level each time and out (${bought.map((b) => b.said + (b.fine ? '' : ' WRONG')).join(' / ')} / ${out})`);
    ids.forEach((id, k) => { if (OPENS[id]) ok(was[k] === 'blocked' && now[k] === 'moved' && skillsOf(p.members[WHO]).includes(id), `${here}: and ${SKILLS[id].name} bought there ${id === 'swimmer' ? 'swims the water' : 'climbs the ridge'} (a step: ${was[k]} before, ${now[k]} after)`); });
    // A company of no guild, and one of another that teaches a skill, hears STRANGER and is taught nothing.
    const other = guilds.find((o) => o !== guild && BUILT[o].length)!;
    const strangers: { who: string; setup: (q: Party) => void }[] = [{ who: 'neither', setup: () => undefined }, { who: `the ${other}`, setup: (q) => { q.flags[rankFlag(other)] = 1; } }];
    const heard = strangers.map(({ who, setup }) => {
      raise(setup);
      const menu1 = enter(h), r = menu1.indexOf('Learn a skill');
      drive(g, [...downTo(r), 'interact']);
      const said = words();
      drive(g, ['interact']);
      const again = options();
      leave();
      return { who, fine: r > 0 && said === STRANGER && p.gold === 5000 && p.members.every((m) => !skillsOf(m).length) && again.join() === menu1.join(), said };
    });
    ok(heard.every((x) => x.fine),`${here}: a company of ${heard.map((x) => x.who).join(' and one of ')} hears ${heard.every((x) => x.said === STRANGER) ? 'STRANGER' : heard.map((x) => `"${x.said}"`).join(' / ')} at "Learn a skill", and is taught nothing`);
  }
  // A person who teaches a skill (Anvilhall's Lantern reader) opens on who would learn it, after their words.
  {
    const d = MAP_DEFS.find((m) => (m.features ?? []).some((f) => f.kind === 'npc' && f.skill === 'linguist'))!;
    const reader = (d.features ?? []).find((f): f is Person => f.kind === 'npc' && f.skill === 'linguist')!;
    raise((q) => { q.flags[rankFlag('lanterns')] = 1; });
    while (g.screens.length > 1) g.pop();
    g.push(g.talkScreen(reader));
    for (let i = 0; i < 4 && kind() === 'MessageScreen'; i++) drive(g, ['interact']);
    const ask = words(), menu = options();
    drive(g, [`n${WHO + 1}` as Action]);
    const told = g.log[g.log.length - 1], out = leave();
    ok(ask === '"Who would learn?" (5000 gold.)' && menu.slice(0, 6).join('|') === rowsFor('linguist').join('|') && menu[6] === 'Leave' && told === `${p.members[WHO].name} learns Linguist.` && p.gold === 5000 - SKILL_PRICE && out === 'ExploreScreen',
      `${reader.name} opens on who would learn Linguist, one level, and teaches it for ${SKILL_PRICE} ("${told}")`);
  }
  // With nobody who has the skill, and no Tidefolk, the ridge and the water hold.
  raise((q) => { q.members[4].race = 'human'; });
  ok(crosses('mountaineer') === 'blocked' && crosses('swimmer') === 'blocked' && !partyCan(p).climb && !partyCan(p).swim, 'a company with no Mountaineer, no Swimmer and no Tidefolk climbs and swims nothing');
}

/**
 * Every row of the skill menus fits the side panel as the menu draws it (`columnMenu`, ui/draw.ts):
 * the first level's, each skill's name beside its price, and the second's, a name of the widest letters
 * at the longest a name may be beside each price and reason a bar can give, found by asking `skillBar`
 * in every state. Every word the skills say is drawn by the font. A member with every skill has them
 * all on the sheet, in lines that keep to its left column; a member with none has no line.
 */
function fits(): void {
  const ids = Object.keys(SKILLS) as SkillId[], p = company((q) => { for (const id of ids) q.flags[rankFlag(SKILLS[id].guild)] = 1; }), c = p.members[0], values = new Set<string>();
  const widest = [...'ABCDEFGHIJKLMNOPQRSTUVWXYZ'].sort((a, b) => measureText(b) - measureText(a))[0], name = widest.repeat(NAME_MAX);
  // The second level's rows as the menu makes them, for a member of the longest name in every state.
  const offered: string[] = [];
  c.name = name;
  for (const id of ids) for (const race of PEOPLES) for (const learnt of [false, true]) for (const gold of [0, 99999]) {
    c.race = race; p.gold = gold;
    if (learnt) c.skills = [id]; else delete c.skills;
    const offer = skillOffers(id, p)[0];
    values.add(offer.bar || `${offer.price}g`);
    offered.push(skillLine(offer, p));
  }
  c.race = 'human'; delete c.skills; p.gold = 99999;
  const rows = [...ids.map(skillRow), LEAVE_SKILLS, ...offered];
  const cut = rows.filter((r) => { const { label, value } = optionParts(r); return measureText(label) > columnLabelWidth(SIDE_W, value, true); });
  ok(values.size === 4 && !cut.length, `every row of the skill menus fits the ${SIDE_W} px panel: each skill's name beside its price, and a name of ${NAME_MAX} ${widest}s beside each of ${[...values].join(', ')}${cut.length ? ' -> cut: ' + cut.map((r) => r.replace(/\t/g, ' ')).join('; ') : ''}`);
  const taught = ids.map((id) => learn(id, company((q) => { q.flags[rankFlag(SKILLS[id].guild)] = 1; q.gold = SKILL_PRICE; }), 0).line);
  const all = p.members[1];
  all.skills = [...ids];
  const lines = skillsLines(all), over = lines.filter((l) => measureText(l) > SHEET_COL_W);
  const said = [...Object.values(SKILLS).flatMap((s) => [s.name, s.text]), askWhich(p), askSkill(p), STRANGER, LEAVE_SKILLS, 'Learn a skill', ...values, ...taught, ...lines];
  const has = new Set(FONT_CHARS), bad = [...new Set(said.join('').split('').filter((ch) => ch !== ' ' && ch !== '\t' && !has.has(ch.toUpperCase())))];
  ok(!bad.length && taught.every((t) => t.length > 0), `every word the skills say is in the font${bad.length ? ' -> not: ' + bad.join(' ') : ''}`);
  ok(lines.length >= 2 && !over.length && lines.join(' ') === `SKILLS ${Object.values(SKILLS).map((s) => s.name).join(', ')}` && !skillsLines(p.members[0]).length,
    `a member with every skill has them all on the sheet, in ${lines.length} lines inside its ${SHEET_COL_W} px column, and one with none has no line (${lines.join(' / ')})`);
}

/**
 * Perception (#856): a search finds a secret door surely, in the wall ahead or in the wall past an open
 * square ahead, and never through a wall or a door; Keen Eyes is the sure find in the wall ahead alone; anyone
 * else finds it there one time in two, and never further. A company of each people, all knights (no
 * Keen Eyes): the elves and the gnomes born to it, the others without it, with it learnt by one, and
 * with that one down; and a company of thieves, keen-eyed. Each search on a fresh map, a seed each.
 */
function perception(): void {
  // From 1,1 facing east the door is two squares off, past an open square; from 2,1 the wall ahead;
  // from 1,2 two squares off, past a wall; from 1,3 two squares off, past a closed door.
  const def: MapDef = { id: 'fx_search', name: 'Search', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['#####', '#..S#', '#.#S#', '#.DS#', '#####'] };
  const TRIES = 24;
  /** Of TRIES searches from x,y facing east, each on a fresh map with its own seed: how many find the door. */
  const finds = (setup: (q: Party) => void, x: number, y: number): number => {
    let n = 0;
    for (let seed = 1; seed <= TRIES; seed++) {
      const rng = makeRng(seed), q = defaultParty(rng);
      for (const m of q.members) m.cls = 'knight';
      setup(q);
      const w = new World({ fx_search: new GameMap(def) }, q, rng);
      w.travel('fx_search', x, y, EAST);
      if (w.search() && w.map.at(3, y).door === 'door' && w.mapState.doors[`3,${y}`] === 'door') n++;
    }
    return n;
  };
  /** Searches ahead, two squares off, past a wall and past a door, as `a/b/c/d` of TRIES. */
  const three = (setup: (q: Party) => void): string => `${finds(setup, 2, 1)}/${finds(setup, 1, 1)}/${finds(setup, 1, 2)}/${finds(setup, 1, 3)}`;
  const sure = `${TRIES}/${TRIES}/0/0`;
  const seen: string[] = [];
  const wrong = PEOPLES.flatMap((race) => {
    const isBorn = race === 'elf' || race === 'gnome';
    const as = (how: 'none' | 'learnt' | 'down') => (q: Party): void => { for (const m of q.members) m.race = race; if (how !== 'none') q.members[0].skills = ['perception']; if (how === 'down') q.members[0].conditions.push('dead'); };
    const none = three(as('none')), learnt = three(as('learnt')), down = isBorn ? none : three(as('down'));
    seen.push(`${race} ${none}, learnt ${learnt}${isBorn ? '' : `, down ${down}`}`);
    const chance = (r: string): boolean => { const [a, b, c, d] = r.split('/').map(Number); return a > 0 && a < TRIES && b === 0 && c === 0 && d === 0; };
    return (isBorn ? none === sure : chance(none)) && learnt === sure && (isBorn || chance(down)) ? [] : [race];
  });
  const keen = three((q) => { for (const m of q.members) { m.race = 'human'; m.cls = 'thief'; } });
  ok(!wrong.length && keen === `${TRIES}/0/0/0`,
    `a search with Perception standing finds surely ahead and two squares off, never past a wall or a door; Keen Eyes surely ahead alone; anyone else one time in two ahead and never further: found of ${TRIES} ahead / two off / past a wall / past a door (${seen.join('; ')}; human thieves ${keen})${wrong.length ? ' -> astray: ' + wrong.join(', ') : ''}`);
}

/** A clear day: the sight at its farthest, so what is not marked is not marked for the hill or the wall. */
const DAY = (wx: Parameters<typeof weatherSight>[0], m: number): boolean => weatherSight(wx) === 4 && daylightAt(m) >= 0.6;

/**
 * Spirit Sense and Danger Sense (#856), on the automap (`markedGroups`). In a hall, facing its west
 * wall with nothing seen to the east and nothing there explored: a group of the dead five steps off,
 * the dead and the living six off, the dead eight off and the dead nine off. With Spirit Sense standing
 * the automap marks the first and the third, through the wall and the dark; without it, or with its
 * learner down, none. At the foot of a ridge on a clear day, a roaming group behind its brow two steps
 * off, its square seen before: with Danger Sense standing it is marked, and not without it nor with its
 * learner down; a group that stands is not, nor one that roams past its `aware`. A company of each people.
 */
function senses(): void {
  const hall: MapDef = { id: 'fx_spirit', name: 'Spirit', kind: 'dungeon', start: { x: 1, y: 1, facing: WEST }, rows: ['############', '#....#.....#', '############'],
    encounters: [
      { id: 'dead5', x: 6, y: 1, monsters: ['skeleton'], roams: false }, { id: 'mixed6', x: 7, y: 1, monsters: ['skeleton', 'rat'], roams: false },
      { id: 'dead8', x: 9, y: 1, monsters: ['ghoul'], roams: false }, { id: 'dead9', x: 10, y: 1, monsters: ['skeleton'], roams: false },
    ] };
  const valley: MapDef = { id: 'fx_brow', name: 'Brow', kind: 'outdoor', start: { x: 4, y: 4, facing: NORTH },
    rows: ['MMMMMMMMM', 'M,,,,,,,M', 'M,,,,,,,M', 'M^^^^^^^M', 'M,,,,,,,M', 'M,,,,,,,M', 'MMMMMMMMM'],
    encounters: [
      { id: 'roamer', x: 4, y: 2, monsters: ['wolf'] }, { id: 'stander', x: 2, y: 2, monsters: ['wolf'], roams: false },
      { id: 'far', x: 6, y: 1, monsters: ['wolf'], aware: 2 },
    ] };
  /** A company of `race` on the map's start, `id` learnt by its first member, standing or down, on a clear day: what the automap marks. */
  const marked = (def: MapDef, race: RaceId, id: SkillId, how: 'none' | 'learnt' | 'down'): string => {
    const rng = makeRng(29), q = defaultParty(rng);
    for (const m of q.members) m.race = race;
    if (how !== 'none') q.members[0].skills = [id];
    if (how === 'down') q.members[0].conditions.push('dead');
    const w = new World({ [def.id]: new GameMap(def) }, q, rng);
    w.state.minutes = findWeather(w.state.weatherSeed!, w.state.minutes, CLIMATES.shelf, DAY);
    w.mapState.explored.fill(0);
    w.travel(def.id, def.start.x, def.start.y, def.start.facing);
    // As though the square behind the brow had been seen before: the near rule still leaves it out.
    if (def === valley) w.mapState.explored[(2 * 9 + 4) >> 5] |= 1 << ((2 * 9 + 4) & 31);
    return markedGroups(w).map((gr) => gr.def.id).join('+') || '-';
  };
  const spirit = PEOPLES.map((race) => `${race} ${marked(hall, race, 'spirit_sense', 'none')} / ${marked(hall, race, 'spirit_sense', 'learnt')} / ${marked(hall, race, 'spirit_sense', 'down')}`);
  ok(SPIRIT_REACH === 8 && spirit.every((r) => r.endsWith(' - / dead5+dead8 / -')),
    `with Spirit Sense standing the automap marks the dead within ${SPIRIT_REACH} steps through a wall and the dark, not a group of the dead and the living nor the dead past it; without it or down, nothing (none / learnt / down: ${spirit.join('; ')})`);
  const danger = PEOPLES.map((race) => `${race} ${marked(valley, race, 'danger_sense', 'none')} / ${marked(valley, race, 'danger_sense', 'learnt')} / ${marked(valley, race, 'danger_sense', 'down')}`);
  ok(danger.every((r) => r.endsWith(' - / roamer / -')),
    `with Danger Sense standing the automap marks a roaming group aware of the company behind a hill, not one that stands nor one past its aware; without it or down, nothing (none / learnt / down: ${danger.join('; ')})`);
}

/**
 * Cartographer (#857): the automap fills a square further than the company sees, `reveal`'s radius one
 * more. A company on open ground facing north, the squares west of it (off the corridor ahead)
 * watched: on a clear day the automap takes two without the skill and three with it; at night, and in
 * a dungeon, one without and two with. With it learnt by a member standing, or a chart carried (a
 * fixture item that does its work, `ItemDef.skill`); without it, or with its learner down. The extra
 * square follows sight: underground, two squares off past open floor it is mapped, and past a closed
 * door or an unfound secret door it is not.
 */
function cartographer(): void {
  const open: MapDef = { id: 'fx_chart', name: 'Chart', kind: 'outdoor', start: { x: 5, y: 5, facing: NORTH }, rows: Array<string>(11).fill(',,,,,,,,,,,') };
  const hall: MapDef = { id: 'fx_chart_hall', name: 'Chart hall', kind: 'dungeon', start: { x: 5, y: 5, facing: NORTH }, rows: Array<string>(11).fill('...........') };
  const chart: ItemDef = { id: 'fx_chart', name: 'A Chart', slot: 'none', price: 400, skill: 'cartographer' };
  const NIGHT = (_: unknown, m: number): boolean => daylightAt(m) < 0.1;
  /** How many squares west of the company the automap takes, for a company `how` on `def` at a time `when` finds. */
  const reach = (def: MapDef, when: (wx: Parameters<typeof weatherSight>[0], m: number) => boolean, how: 'none' | 'learnt' | 'down' | 'chart'): number => {
    const rng = makeRng(41), q = defaultParty(rng);
    if (how === 'learnt' || how === 'down') q.members[0].skills = ['cartographer'];
    if (how === 'down') q.members[0].conditions.push('dead');
    if (how === 'chart') q.members[3].pack.push(chart.id);
    const w = new World({ [def.id]: new GameMap(def) }, q, rng);
    w.state.minutes = findWeather(w.state.weatherSeed!, w.state.minutes, CLIMATES.shelf, when);
    w.mapState.explored.fill(0);
    w.travel(def.id, 5, 5, NORTH);
    let d = 0;
    while (d < 4 && w.explored(4 - d, 5)) d++;
    return d;
  };
  ITEMS[chart.id] = chart;
  try {
    const hows = ['none', 'learnt', 'down', 'chart'] as const;
    const row = (def: MapDef, when: Parameters<typeof reach>[1]): string => hows.map((h) => reach(def, when, h)).join('/');
    const day = row(open, DAY), night = row(open, NIGHT), under = row(hall, DAY);
    ok(day === '2/3/2/3' && night === '1/2/1/2' && under === '1/2/1/2',
      `a Cartographer standing, or a chart carried, maps a square further: on open ground by day ${day}, by night ${night}, in a dungeon ${under} (none / learnt / down / a chart)`);
    // West of 3,3 open floor, east a closed door, north an unfound secret door; facing the wall south.
    const doors: MapDef = { id: 'fx_chart_doors', name: 'Chart doors', kind: 'dungeon', start: { x: 3, y: 3, facing: SOUTH }, rows: ['#######', '###.###', '###S###', '#...D.#', '#######'] };
    const past = (learnt: boolean): string => {
      const rng = makeRng(43), q = defaultParty(rng);
      if (learnt) q.members[0].skills = ['cartographer'];
      const w = new World({ fx_chart_doors: new GameMap(doors) }, q, rng);
      w.mapState.explored.fill(0);
      w.travel('fx_chart_doors', 3, 3, SOUTH);
      return [[1, 3], [5, 3], [3, 1]].map(([x, y]) => (w.explored(x, y) ? 'mapped' : '-')).join('/');
    };
    const sighted = past(true), blind = past(false);
    ok(sighted === 'mapped/-/-' && blind === '-/-/-',
      `the extra square follows sight: two squares off past open floor it is mapped, past a closed door and past an unfound secret door it is not (floor / door / secret door: ${sighted}; without the skill ${blind})`);
  } finally {
    delete ITEMS[chart.id];
  }
}

/**
 * A locked chest (#857): stood on, it says it is locked; Space opens it to a Lockpick standing, or a
 * set of picks carried, and the key is kept; else to an iron key, which it spends; else it says
 * "Locked." and nothing changes, and it stays to be opened. Opened, it is empty after. A chest with no
 * lock opens as before. A fixture chest under the premade six, whose thief is born to Lockpick.
 */
function lockedChest(): void {
  const picks: ItemDef = { id: 'fx_picks', name: 'A Set of Picks', slot: 'none', price: 750, skill: 'lockpick' };
  const chest = { kind: 'chest', x: 2, y: 1, id: 'fx_locked', gold: 40, items: ['torch'], locked: true } as const satisfies Feature;
  const plain = { kind: 'chest', x: 2, y: 1, id: 'fx_plain', gold: 40, items: ['torch'] } as const satisfies Feature;
  /** For the company `setup` makes, stood on the chest and Space pressed twice: what is said, the gold gained, the keys left, and whether it is spent. */
  const opens = (setup: (p: Party) => void, f: Extract<Feature, { kind: 'chest' }> = chest): string => {
    const g = headlessGame(4), p = g.party;
    g.maps.fx_coffer = new GameMap({ id: 'fx_coffer', name: 'Coffer', kind: 'dungeon', start: { x: 1, y: 1, facing: EAST }, rows: ['####', '#..#', '####'], features: [{ ...f, items: [...f.items] }] });
    setup(p);
    g.world.travel('fx_coffer', 2, 1, EAST);
    const here = g.world.featureHere()!, from = g.log.length, gold = p.gold;
    g.enterCell();
    g.interact(here);
    g.interact(here);
    return `${g.log.slice(from).join(' ')} | ${p.gold - gold} | ${p.bag.filter((i) => i === 'key_iron').length} | ${g.world.used(f.id) ? 'spent' : 'shut'}`;
  };
  const thiefDown = (p: Party): void => { p.members[3].conditions.push('dead'); };
  const got = `You open the chest: 40 gold, ${ITEMS.torch.name}. The chest is empty. | 40`;
  ITEMS[picks.id] = picks;
  try {
    const cases: [string, (p: Party) => void, string][] = [
      ['the thief standing, born to Lockpick, no key', () => undefined, `A locked chest. Ottilie picks the lock. ${got} | 0 | spent`],
      ['the thief standing, a key carried', (p) => { p.bag.push('key_iron'); }, `A locked chest. Ottilie picks the lock. ${got} | 1 | spent`],
      ['the thief down, a key carried', (p) => { thiefDown(p); p.bag.push('key_iron'); }, `A locked chest. The lock turns. The key crumbles. ${got} | 0 | spent`],
      ['the thief down, no key', thiefDown, 'A locked chest. Locked. Locked. | 0 | 0 | shut'],
      ['the thief down, Lockpick learnt by the knight', (p) => { thiefDown(p); p.members[0].skills = ['lockpick']; }, `A locked chest. Bram picks the lock. ${got} | 0 | spent`],
      ['the thief down, a set of picks in the cleric\'s pack and a key', (p) => { thiefDown(p); p.members[4].pack.push(picks.id); p.bag.push('key_iron'); }, `A locked chest. Maren picks the lock. ${got} | 1 | spent`],
    ];
    const wrong = cases.flatMap(([who, setup, want]) => { const said = opens(setup); return said === want ? [] : [`${who}: "${said}", wanted "${want}"`]; });
    ok(!wrong.length, `a locked chest opens to a Lockpick standing or a set of picks carried, keeping the key, or to a key, spent, and to nothing else: "Locked." (${cases.map(([who]) => who).join('; ')})${wrong.length ? ' -> ' + wrong.join('; ') : ''}`);
  } finally {
    delete ITEMS[picks.id];
  }
  const unlocked = opens((p) => { p.members[3].conditions.push('dead'); p.bag.push('key_iron'); }, plain);
  ok(unlocked === `A chest. Space opens it. ${got} | 1 | spent`, `a chest with no lock opens as before, the key untouched ("${unlocked}")`);
  // Skilled, as the world asks it: the thief standing, born to it; a set of picks, carried by one standing.
  const p = company();
  ok(skilled(p, 'lockpick')?.name === 'Ottilie' && skilled(p, 'pathfinder')?.name === 'Wren' && !skilled(p, 'cartographer') && !skilled(p, 'merchant') && !skilled(p, 'navigator'),
    'the premade six\'s thief picks its locks and its ranger finds its path, and nobody maps, sells or navigates for it');
}

/**
 * The pilot's talk (src/game/pilot/talk.ts) learns no skill (#719, decision 12): put before a Lantern
 * hall's skills, the company of the Lanterns with the gold, it leaves the hall's level and, a skill
 * chosen for it, the level of who would learn it, and before a person who teaches, theirs; nobody is
 * taught and no gold is spent.
 */
function piloted(): void {
  const g = headlessGame(4), p = g.party, st = g.world.state;
  for (const id of Object.keys(g.maps)) g.world.ensureMapState(id).explored.fill(-1);
  p.gold = 50000; p.flags[rankFlag('lanterns')] = 1;
  g.pilot = new Pilot({ instant: true });
  g.pilot.toggle(g);
  g.pilot.brains = [talk];
  const askedOf = (): string => (g.top instanceof ChoiceScreen ? g.top.words : '');
  const run = (): void => { for (let t = 0; t < 20 && g.top instanceof ChoiceScreen; t++) drive(g, [null]); };
  g.push(skillMenu(g, taughtBy('lanterns'), 'Lantern Guildhall'));
  const first = askedOf();
  run();
  g.push(skillMenu(g, taughtBy('lanterns'), 'Lantern Guildhall'));
  drive(g, ['n2']);
  const second = askedOf();
  run();
  const person: Person = { kind: 'npc', x: st.x, y: st.y, name: 'A Lantern reader', lines: ['"The old way, word by word."'], skill: 'linguist' };
  const here = g.maps[st.mapId].features as Feature[];
  here.push(person);
  g.push(g.talkScreen(person));
  drive(g, ['interact']);
  const third = askedOf();
  run();
  here.splice(here.indexOf(person), 1);
  ok(first === askWhich(p) && second === askSkill(p) && third === askSkill(p) && p.gold === 50000 && p.members.every((m) => !skillsOf(m).length) && !(g.top instanceof ChoiceScreen),
    `the pilot's talk leaves a hall's skills, who would learn one and a person's, and learns nothing (${[first, second, third].join(' / ')}; ${p.gold} gold)`);
}
