// The secondary skills (#538; DESIGN §5, §8): a list on each member, Linguist the first built. Each
// built skill is one of DESIGN §5's twelve and taught by the guild DESIGN §8's table gives it; every
// hall of that guild teaches it, to the guild's members, and a person who teaches it too; a stranger
// to the guild is told so; a member learns it once, for its price; a dwarf is born to Linguist; the
// sheet lists what a member has. A save keeps a member's skills, and one from before them has none.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { defaultParty } from '../../src/game/party.ts';
import type { Party } from '../../src/game/party.ts';
import { World } from '../../src/game/world.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { serialize, deserialize } from '../../src/game/save.ts';
import { rankFlag } from '../../src/content/guilds.ts';
import type { GuildId } from '../../src/content/guilds.ts';
import { MAP_DEFS } from '../../src/content/index.ts';
import { SKILLS, SKILL_PRICE, skillsOf, hasSkill, skillNames, taughtBy, mayLearn, skillOffers, skillLine, skillBar, learn } from '../../src/game/skills.ts';
import { ok } from './lib.ts';

/** DESIGN §8's table: the skills each guild teaches, three to a guild, twelve in all (DESIGN §5). */
const TAUGHT: Record<GuildId, readonly string[]> = {
  wardens: ['Arms Master', 'Danger Sense', 'Mountaineer'],
  lanterns: ['Spirit Sense', 'Linguist', 'Perception'],
  cartographers: ['Cartographer', 'Pathfinder', 'Swimmer'],
  compact: ['Lockpick', 'Merchant', 'Navigator'],
};

const company = (setup?: (p: Party) => void): Party => { const p = defaultParty(makeRng(11)); setup?.(p); return p; };

export function skills(): void {
  // The table: each skill one of the twelve, taught by the guild DESIGN §8 gives it; Linguist the first.
  const built = Object.values(SKILLS);
  const astray = built.filter((s) => !TAUGHT[s.guild].includes(s.name));
  ok(built.length >= 1 && !astray.length && SKILLS.linguist.guild === 'lanterns' && SKILLS.linguist.price === SKILL_PRICE && SKILLS.linguist.race === 'dwarf',
    `each skill built is one of the twelve, its guild's: ${built.map((s) => `${s.name} (${s.guild}, ${s.price} gold)`).join(', ')}; the dwarves are born to Linguist${astray.length ? ' -> astray: ' + astray.map((s) => s.name).join(', ') : ''}`);
  ok(Object.values(TAUGHT).flat().length === 12 && new Set(Object.values(TAUGHT).flat()).size === 12, 'the twelve, three to a guild');

  // Every hall teaches its guild's skills: each of the Lanterns' halls Linguist, and no other hall a skill yet.
  const halls = MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => ('hall' in f && f.hall ? [{ name: f.name, hall: f.hall, taught: taughtBy(f.hall) }] : [])));
  const lanterns = halls.filter((h) => h.hall === 'lanterns');
  ok(lanterns.length >= 3 && lanterns.every((h) => h.taught.join() === 'linguist') && halls.filter((h) => h.hall !== 'lanterns').every((h) => !h.taught.length),
    `every hall of the Lanterns teaches Linguist (${lanterns.map((h) => h.name).join(', ')}), and the other guilds' halls no skill yet (${halls.filter((h) => h.hall !== 'lanterns').map((h) => h.name).join(', ')})`);
  ok(['Lantern Guildhall', 'Thornhold Lantern Hall', 'The Watch\'s Lantern Hall'].every((n) => lanterns.some((h) => h.name === n)), 'Helmstow\'s, Thornhold\'s and the Watch\'s among them');
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
  // A save keeps a member's skills; a member saved before them has none.
  {
    const rng = makeRng(13), party = defaultParty(rng), world = new World(buildMaps(), party, rng);
    party.members[2].skills = ['linguist'];
    const back = deserialize(serialize(world.state, party, 0)).party;
    ok(skillsOf(back.members[2]).join() === 'linguist' && back.members.filter((_, i) => i !== 2).every((m) => !skillsOf(m).length), 'a save keeps a member\'s skills');
    const old = JSON.parse(serialize(world.state, party, 0)) as { party: Party };
    for (const m of old.party.members) delete m.skills;
    const loaded = deserialize(JSON.stringify(old)).party;
    ok(loaded.members.every((m) => !skillsOf(m).length && !hasSkill(m, 'linguist')), 'and a save from before the skills loads with none');
  }
}
