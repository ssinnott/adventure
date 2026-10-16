// The secondary skills (#538, #805; DESIGN §5, §8): a list on each member, Linguist, Mountaineer and
// Swimmer built. Each built skill is one of DESIGN §5's twelve and taught by the guild DESIGN §8's
// table gives it; every hall of that guild teaches it, to the guild's members, and a person who
// teaches it too; a stranger to the guild is told so; a member learns it once, for its price; a dwarf
// is born to Linguist; the sheet lists what a member has. Each hall's own menu is walked through a
// Game as a player meets it, and Mountaineer and Swimmer, bought there, climb and swim. A save keeps
// a member's skills, and one from before them has none.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { defaultParty, partyCan, isDown, RACES, NAME_MAX } from '../../src/game/party.ts';
import type { Party, RaceId } from '../../src/game/party.ts';
import { World } from '../../src/game/world.ts';
import type { Screen } from '../../src/game/game.ts';
import type { ChoiceScreen } from '../../src/ui/screens.ts';
import type { Action } from '../../src/input.ts';
import { EAST, SOUTH } from '../../src/game/types.ts';
import type { Facing } from '../../src/game/types.ts';
import { logLines } from '../../src/ui/frame.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { serialize, deserialize } from '../../src/game/save.ts';
import { rankFlag } from '../../src/content/guilds.ts';
import type { GuildId } from '../../src/content/guilds.ts';
import { MAP_DEFS } from '../../src/content/index.ts';
import { SKILLS, SKILL_PRICE, STRANGER, skillsOf, hasSkill, skillNames, taughtBy, mayLearn, skillOffers, skillLine, skillBar, learn } from '../../src/game/skills.ts';
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
 * What is built of that table, a skill to a guild so far: the Lanterns' Linguist (#538), the Wardens'
 * Mountaineer and the Cartographers' Swimmer (#805), the Compact's none. Written out, not read from
 * `SKILLS`, so a skill built or a hall that stops teaching one is a change this test is told of.
 */
const BUILT: Record<GuildId, SkillId | ''> = { wardens: 'mountaineer', lanterns: 'linguist', cartographers: 'swimmer', compact: '' };

/** A hall of the content: where it stands and what its guild's halls teach. */
interface Hall { map: string; x: number; y: number; name: string; hall: GuildId; taught: SkillId[] }

const company = (setup?: (p: Party) => void): Party => { const p = defaultParty(makeRng(11)); setup?.(p); return p; };

/** Every people there is. */
const PEOPLES = Object.keys(RACES) as RaceId[];

export function skills(): void {
  // The table: each skill one of the twelve, taught by the guild DESIGN §8 gives it; Linguist the first.
  const built = Object.values(SKILLS);
  const astray = built.filter((s) => !TAUGHT[s.guild].includes(s.name));
  ok(built.length >= 1 && !astray.length && SKILLS.linguist.guild === 'lanterns' && SKILLS.linguist.price === SKILL_PRICE && SKILLS.linguist.race === 'dwarf',
    `each skill built is one of the twelve, its guild's: ${built.map((s) => `${s.name} (${s.guild}, ${s.price} gold)`).join(', ')}; the dwarves are born to Linguist${astray.length ? ' -> astray: ' + astray.map((s) => s.name).join(', ') : ''}`);
  ok(Object.values(TAUGHT).flat().length === 12 && new Set(Object.values(TAUGHT).flat()).size === 12, 'the twelve, three to a guild');
  // The rows of #805: the Wardens' Mountaineer and the Cartographers' Swimmer, at the skill price, born to no people (the Tidefolk swim by theirs).
  ok(SKILLS.mountaineer.guild === 'wardens' && SKILLS.mountaineer.text === 'Climbs mountain and cliff.' && SKILLS.swimmer.guild === 'cartographers' && SKILLS.swimmer.text === 'Swims deep water.'
    && [SKILLS.mountaineer, SKILLS.swimmer].every((s) => s.price === SKILL_PRICE && s.race === undefined),
    `Mountaineer is the Wardens' and Swimmer the Cartographers', each ${SKILL_PRICE} gold and born to no people ("${SKILLS.mountaineer.text}" / "${SKILLS.swimmer.text}")`);
  const wide = built.map((s) => { const p = company((q) => { q.gold = SKILL_PRICE; q.flags[rankFlag(s.guild)] = 1; q.members[3].name = 'M'.repeat(NAME_MAX); }); return { skill: s.name, lines: logLines(learn(s.id, p, 3).line).length }; });
  ok(wide.every((w) => w.lines >= 1 && w.lines <= 2), `a member with the longest name learns any skill in two lines of the log at most (${wide.map((w) => `${w.skill} ${w.lines}`).join(', ')})`);

  // Every hall teaches its guild's skills: the Lanterns' halls Linguist, the Wardens' Mountaineer, the Cartographers' Swimmer, the Compact's none yet.
  const halls: Hall[] = MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => ('hall' in f && f.hall ? [{ map: d.id, x: f.x, y: f.y, name: f.name, hall: f.hall, taught: taughtBy(f.hall) }] : [])));
  const lanterns = halls.filter((h) => h.hall === 'lanterns'), of = (g: GuildId): string => halls.filter((h) => h.hall === g).map((h) => h.name).join(', ');
  const astrayHalls = halls.filter((h) => h.taught.join() !== BUILT[h.hall]);
  ok(lanterns.length >= 3 && !astrayHalls.length,
    `every hall teaches what its guild has built: Linguist at the Lanterns' (${of('lanterns')}), Mountaineer at the Wardens' (${of('wardens')}), Swimmer at the Cartographers' (${of('cartographers')}), nothing yet at the Compact's (${of('compact')})${astrayHalls.length ? ' -> astray: ' + astrayHalls.map((h) => `${h.name} (${h.taught.join() || 'none'})`).join(', ') : ''}`);
  ok(['Lantern Guildhall', 'Thornhold Lantern Hall', 'The Watch\'s Lantern Hall'].every((n) => lanterns.some((h) => h.name === n)), 'Helmstow\'s, Thornhold\'s and the Watch\'s among them');
  const named = (g: GuildId, n: string): boolean => halls.some((h) => h.hall === g && h.name === n);
  ok(named('wardens', 'Warden Drillyard') && named('cartographers', 'The Map Room') && named('cartographers', 'The Chart House'), 'and the Drillyard, Saltmouth\'s Map Room and Cinderport\'s Chart House among the Wardens\' and the Cartographers\'');
  const teachers = MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => (f.kind === 'npc' && f.skill ? [`${f.name} (${f.skill})`] : [])));
  ok(teachers.some((t) => t.startsWith('Wystan Crane') && t.endsWith('(linguist)')), `the people who teach a skill, Anvilhall's Lantern reader among them (#459): ${teachers.join(', ')}`);

  // A stranger to the guild learns nothing; a member, for the price, once.
  {
    const party = company(), maren = party.members[4];
    party.gold = 5000;
    ok(!mayLearn('linguist', party) && !learn('linguist', party, 4).taught && party.gold === 5000 && !skillsOf(maren).length, 'a company not of the Lanterns is taught nothing');
    party.flags[rankFlag('lanterns')] = 1;
    const offers = skillOffers(taughtBy('lanterns'), party);
    ok(offers.length === 6 && offers.every((o) => !o.bar && o.price === SKILL_PRICE) && skillLine(offers[4], party) === `Maren: Linguist\t${SKILL_PRICE}g\tReads Kiln-script.`,
      `a Taper is offered it for each of the six (${skillLine(offers[4], party).replace(/\t/g, ' | ')})`);
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
    ok(party.members.filter((m) => m !== idris).every((m) => !skillNames(m).length), 'and nobody else of the six has a skill');
  }
  // Mountaineer and Swimmer, as Linguist: a company of another guild is taught nothing; a company of
  // the guild is offered the skill for each of the six, and a member learns it for the price, once.
  for (const [id, who] of [['mountaineer', 0], ['swimmer', 3]] as const) {
    const s = SKILLS[id], other = (Object.keys(BUILT) as GuildId[]).find((g) => g !== s.guild && BUILT[g])!;
    const party = company((p) => { p.gold = 5000; p.flags[rankFlag(other)] = 1; }), m = party.members[who], next = who ? 0 : 1;
    ok(!mayLearn(id, party) && !learn(id, party, who).taught && party.gold === 5000 && party.members.every((c) => !skillsOf(c).length), `${s.name}: a company of the ${other} and not of the ${s.guild} is taught nothing`);
    party.flags[rankFlag(s.guild)] = 1;
    const offers = skillOffers(taughtBy(s.guild), party);
    ok(offers.length === 6 && offers.every((o) => !o.bar && o.price === SKILL_PRICE) && skillLine(offers[who], party) === `${m.name}: ${s.name}\t${SKILL_PRICE}g\t${s.text}`,
      `${s.name}: a company of the ${s.guild} is offered it for each of the six (${skillLine(offers[who], party).replace(/\t/g, ' | ')})`);
    const taught = learn(id, party, who);
    ok(taught.taught && taught.line === `${m.name} learns ${s.name}.` && party.gold === 5000 - SKILL_PRICE && hasSkill(m, id) && skillNames(m).join() === s.name && party.members.filter((c) => c !== m).every((c) => !hasSkill(c, id)),
      `${s.name}: ${m.name} learns it for ${SKILL_PRICE} ("${taught.line}"), and the sheet lists it, and none of the others has it`);
    ok(skillBar(id, m, party) === 'known' && !learn(id, party, who).taught && party.gold === 5000 - SKILL_PRICE && skillsOf(m).length === 1, `${s.name}: learnt, it is not taught again`);
    party.gold = SKILL_PRICE - 1;
    ok(skillBar(id, party.members[next], party) === 'not enough gold' && !learn(id, party, next).taught && !hasSkill(party.members[next], id), `${s.name}: short of the price, nothing changes`);
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
  // The halls' own menus, through a Game.
  menus(halls);
  // A save keeps a member's skills; a member saved before them has none.
  {
    const rng = makeRng(13), party = defaultParty(rng), world = new World(buildMaps(), party, rng);
    party.members[2].skills = ['linguist'];
    const back = deserialize(serialize(world.state, party, 0)).party;
    ok(skillsOf(back.members[2]).join() === 'linguist' && back.members.filter((_, i) => i !== 2).every((m) => !skillsOf(m).length), 'a save keeps a member\'s skills');
    party.members[3].skills = ['mountaineer', 'swimmer'];
    const both = deserialize(serialize(world.state, party, 0)).party;
    ok(skillsOf(both.members[3]).join() === 'mountaineer,swimmer' && skillsOf(both.members[2]).join() === 'linguist' && partyCan(both).climb && partyCan(both).swim, 'and Mountaineer\'s and Swimmer\'s, which climb and swim the company on loading');
    const old = JSON.parse(serialize(world.state, party, 0)) as { party: Party };
    for (const m of old.party.members) delete m.skills;
    const loaded = deserialize(JSON.stringify(old)).party;
    ok(loaded.members.every((m) => !skillsOf(m).length && !hasSkill(m, 'linguist') && !hasSkill(m, 'mountaineer') && !hasSkill(m, 'swimmer')), 'and a save from before the skills loads with none');
    ok(!partyCan(loaded).climb, 'and such a company climbs nothing');
  }
}

/** The Foreland's ridge, a step east of 30,2, and its water, a step south of 12,28 (tools/tests/movement.ts): what a company can cross, as the world answers a step. */
const OPENS: Partial<Record<SkillId, { x: number; y: number; facing: Facing }>> = { mountaineer: { x: 30, y: 2, facing: EAST }, swimmer: { x: 12, y: 28, facing: SOUTH } };

/**
 * The halls' own first menus, walked through a Game as a player meets them: stepped in on the door,
 * the keeper heard out, down to "Learn a skill", Space. A hall of a guild that has a skill built has
 * the row after the guild's work, and one of a guild with none has no row. A company of the guild
 * buys the skill there, member by member, for the price, and the menu comes again with the member
 * known; a company of no guild, and one of another, hears STRANGER and is taught nothing. What
 * Mountaineer and Swimmer teach, the company then does: the ridge is climbed and the water swum (#805).
 */
function menus(halls: readonly Hall[]): void {
  const g = headlessGame(4), p = g.party, WHO = 3;
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
  const guilds = Object.keys(BUILT) as GuildId[];
  for (const h of halls) {
    const id = BUILT[h.hall], guild = h.hall, here = `${h.name} (${h.map})`;
    if (!id) {
      raise((q) => { q.flags[rankFlag(guild)] = 1; });
      const first = enter(h), out = leave();
      ok(first.length > 1 && !first.includes('Learn a skill') && out === 'ExploreScreen', `${here}: a hall of the ${guild}, who teach no skill yet, has no "Learn a skill" (${first.join(' / ')})`);
      continue;
    }
    const s = SKILLS[id];
    // A company of the guild buys the skill, and what it opens opens.
    raise((q) => { q.flags[rankFlag(guild)] = 1; q.members[4].race = 'human'; });
    const was = crosses(id), first = enter(h), row = first.indexOf('Learn a skill');
    const after = row > 0 && first[row - 1].startsWith('Work for ');
    drive(g, [...downTo(row), 'interact']);
    const ask = words(), menu = options(), offer = `${p.members[WHO].name}: ${s.name}\t${SKILL_PRICE}g\t${s.text}`;
    drive(g, [`n${WHO + 1}` as Action]);
    const known = options()[WHO], gold = p.gold, has = hasSkill(p.members[WHO], id), told = g.log[g.log.length - 1];
    drive(g, ['cancel']);
    const back = options(), out = leave(), now = crosses(id);
    ok(after && ask === '"Who would learn?" (5000 gold.)' && menu.length === 7 && menu[WHO] === offer && menu[6] === 'Leave'
        && known === `${p.members[WHO].name}: ${s.name}\tknown\t${s.text}` && gold === 5000 - SKILL_PRICE && has && told === `${p.members[WHO].name} learns ${s.name}.`
        && back.join() === first.join() && out === 'ExploreScreen',
      `${here}: a company of the ${guild} finds "Learn a skill" after the ${guild}' work, is asked who would learn, buys ${s.name} for ${p.members[WHO].name} at ${SKILL_PRICE}, sees them known, and comes back to the first menu and out (${ask} / ${menu[WHO]} / ${known} / ${told} / ${gold} gold / ${out})`);
    if (OPENS[id]) ok(was === 'blocked' && now === 'moved' && skillsOf(p.members[WHO]).join() === id, `${here}: and ${s.name} bought there ${id === 'swimmer' ? 'swims the water' : 'climbs the ridge'} (a step: ${was} before, ${now} after)`);
    // A company of no guild, and one of another that teaches a skill, hears STRANGER and is taught nothing.
    const other = guilds.find((o) => o !== guild && BUILT[o])!;
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
  // With nobody who has the skill, and no Tidefolk, the ridge and the water hold.
  raise((q) => { q.members[4].race = 'human'; });
  ok(crosses('mountaineer') === 'blocked' && crosses('swimmer') === 'blocked' && !partyCan(p).climb && !partyCan(p).swim, 'a company with no Mountaineer, no Swimmer and no Tidefolk climbs and swims nothing');
}
