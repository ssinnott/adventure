// The guilds (DESIGN §8; game/guilds.ts): a stranger is offered the first task alone; taking it puts
// it in the log; with its deed done the hall pays gold, xp to the living and items, and the company
// is a member; each rank opens the next; an item is taken at the first meeting whatever the rank;
// a deed done early is paid when its quest is taken; a save keeps the flags. Walked on a fixture
// guild, then every real guild quest held to the same rules.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { MAP_DEFS, ITEMS, GUILD_QUESTS, MONSTERS } from '../../src/content/index.ts';
import { GUILDS, takenFlag, doneFlag, rankFlag, guildQuestDef } from '../../src/content/guilds.ts';
import type { GuildId } from '../../src/content/guilds.ts';
import { World } from '../../src/game/world.ts';
import { defaultParty, countItem } from '../../src/game/party.ts';
import type { Party } from '../../src/game/party.ts';
import type { MapState } from '../../src/game/world.ts';
import { questLog } from '../../src/game/quests.ts';
import { rankOf, rankName, offered, inHand, report, take } from '../../src/game/guilds.ts';
import type { GuildQuest } from '../../src/game/guilds.ts';
import { giftOf } from '../../src/game/wilds.ts';
import { personFlags, personGives } from '../../src/game/people.ts';
import { CONTENT, collect } from '../shipped.ts';
import { condFaults } from './quests.ts';
import { ok } from './lib.ts';

const quest = (id: string, rank: number, deed: Partial<GuildQuest>, guild: GuildId = 'wardens'): GuildQuest => ({
  id, guild, rank, offer: [`Offer ${id}.`], paid: [`Paid ${id}.`], early: [`Early ${id}.`],
  pay: { gold: 10 * (rank + 1), xp: 60, items: rank === 0 ? ['antidote'] : [] },
  title: `Fixture ${id}`, entries: [], goals: [{ when: { flag: takenFlag(id) }, text: 'Do it.' }], ...deed,
});

/** A guild of four quests over three ranks, and one of another guild's. */
const FIXTURE: readonly GuildQuest[] = [
  quest('fx_first', 0, { goal: { seen: 'shelf:coast' } }),
  quest('fx_cult', 1, { goal: { slain: 'mill:m_cult1' } }),
  quest('fx_oil', 1, { item: 'lantern_oil' }),
  quest('fx_pass', 2, { goal: { visited: 'thornmark' } }),
  quest('fx_other', 0, { goal: { seen: 'shelf:coast' } }, 'lanterns'),
];

export function guilds(): void {
  const fresh = (): { party: Party; world: World } => { const rng = makeRng(8); const party = defaultParty(rng); return { party, world: new World(buildMaps(), party, rng) }; };
  // A zone map's ids are kept in the outdoors' state, and the party has to have walked into it.
  const stateFor = (w: World, map: string): MapState => {
    const on = w.locate(map, 0, 0).mapId;
    if (on !== map && !w.state.zones!.includes(map)) w.state.zones!.push(map);
    return w.ensureMapState(on);
  };
  const ids = (qs: readonly GuildQuest[]): string => qs.map((q) => q.id).join(',');
  const defs = FIXTURE.map(guildQuestDef);

  { // A stranger, then a member.
    const { party, world } = fresh();
    ok(rankOf('wardens', party, FIXTURE) === 0 && rankName('wardens', 0) === null, 'a new company has no rank');
    ok(ids(offered('wardens', party, FIXTURE)) === 'fx_first', `a stranger is offered the first task alone (${ids(offered('wardens', party, FIXTURE))})`);
    ok(report('wardens', world.state, party, FIXTURE).length === 0, 'a report with nothing done pays nothing');
    ok(take(FIXTURE[0], world.state, party, FIXTURE).length === 0 && !!party.flags[takenFlag('fx_first')], 'taking the first task sets its flag and pays nothing yet');
    const log = questLog(world.state, party, defs);
    ok(log.length === 1 && log[0].def.id === 'fx_first' && !log[0].done, 'the log shows the task taken');
    ok(ids(inHand('wardens', party, FIXTURE)) === 'fx_first' && !offered('wardens', party, FIXTURE).length, 'a task taken is in hand and no longer offered');
    ok(ids(offered('lanterns', party, FIXTURE)) === 'fx_other', "another guild's ladder is its own");

    stateFor(world, 'shelf').used.coast = 1;
    const dead = party.members[5]; dead.conditions = ['dead'];
    const xp = party.members.map((c) => c.xp), gold = party.gold;
    const said = report('wardens', world.state, party, FIXTURE);
    ok(said.length === 2 && said[0].startsWith('Paid fx_first.') && /10 gold, 60 experience, Antidote/.test(said[0]), `with the deed done the hall pays and says so (${said.join(' | ').replace(/\n+/g, ' ')})`);
    ok(party.gold === gold + 10 && countItem(party, 'antidote') > 0 && !!party.flags[doneFlag('fx_first')], 'the pay is gold, an item and the done flag');
    ok(party.members.every((c, i) => c.xp === xp[i] + (c === dead ? 0 : 12)), 'the xp is split among the living, as a fight\'s is: 60 among five');
    ok(rankOf('wardens', party, FIXTURE) === 1 && said[1] === 'Your rank with the Wardens is now Recruit.', `the first task done, the company is a member: ${said[1]}`);
    ok(questLog(world.state, party, defs)[0].done, 'the log shows the first task finished');
    ok(report('wardens', world.state, party, FIXTURE).length === 0, 'a quest is paid once');

    // Rank 1 opens rank 1's quests, and not rank 2's.
    ok(ids(offered('wardens', party, FIXTURE)) === 'fx_cult,fx_oil', `rank 1 is offered rank 1's quests and not rank 2's (${ids(offered('wardens', party, FIXTURE))})`);
    // A deed done before its quest was taken is paid at the taking, with the early words.
    stateFor(world, 'mill').groups.m_cult1.dead = world.state.minutes;
    const early = take(FIXTURE[1], world.state, party, FIXTURE);
    ok(early.length === 1 && early[0].startsWith('Early fx_cult.') && !!party.flags[doneFlag('fx_cult')], 'a deed done before the taking is paid then, with the words for a company that came early');
    // All of rank 1 done raises the company to rank 2; the item quest is paid as the item is carried.
    take(FIXTURE[2], world.state, party, FIXTURE);
    party.bag.push('lantern_oil');
    const r2 = report('wardens', world.state, party, FIXTURE);
    ok(!countItem(party, 'lantern_oil') && rankOf('wardens', party, FIXTURE) === 2 && r2.at(-1) === 'Your rank with the Wardens is now Corporal.', 'the hall takes the item, and all of rank 1 done makes the company Corporals');
    ok(ids(offered('wardens', party, FIXTURE)) === 'fx_pass', 'rank 2 opens rank 2\'s quest');
    take(FIXTURE[3], world.state, party, FIXTURE); stateFor(world, 'thornmark');
    report('wardens', world.state, party, FIXTURE);
    ok(rankOf('wardens', party, FIXTURE) === 3 && !offered('wardens', party, FIXTURE).length, 'the last rank built done, the rank stops there, with nothing more offered');
    // Content grows: a quest added later at a rank the company holds is offered, and the rank holds.
    const grown = [...FIXTURE, quest('fx_later', 1, { goal: { visited: 'thornmark' } })];
    ok(party.flags[rankFlag('wardens')] === 3 && rankOf('wardens', party, grown) === 3 && ids(offered('wardens', party, grown)) === 'fx_later',
      `a quest added later at a rank held is offered, and never lowers the rank (${rankOf('wardens', party, grown)}, offered ${ids(offered('wardens', party, grown))})`);
  }

  { // An item is taken at the first meeting, whatever the rank, and pays with the early words.
    const { party, world } = fresh();
    party.bag.push('lantern_oil');
    const said = report('wardens', world.state, party, FIXTURE);
    ok(said.length === 1 && said[0].startsWith('Early fx_oil.') && !countItem(party, 'lantern_oil') && !!party.flags[doneFlag('fx_oil')] && !party.flags[takenFlag('fx_oil')],
      'a stranger carrying a rank 1 quest\'s item is paid for it at the first meeting, and never took the quest');
    ok(rankOf('wardens', party, FIXTURE) === 0 && ids(offered('wardens', party, FIXTURE)) === 'fx_first', 'and is still a stranger, offered the first task');
    const log = questLog(world.state, party, defs);
    ok(log.length === 1 && log[0].def.id === 'fx_oil' && log[0].done, 'the log shows the item quest finished');
  }

  { // A deed of several guardians is done once every one of them is dead.
    const { party, world } = fresh();
    const q = quest('fx_both', 0, { goal: { slain: ['mill:m_cult1', 'mill:m_cult2'] } });
    take(q, world.state, party, [q]);
    stateFor(world, 'mill').groups.m_cult1.dead = world.state.minutes;
    const one = report('wardens', world.state, party, [q]).length;
    stateFor(world, 'mill').groups.m_cult2.dead = world.state.minutes;
    const both = report('wardens', world.state, party, [q]).length;
    ok(one === 0 && both > 0, `a deed naming two guardians waits for both (${one} paid with one dead, ${both} with both)`);
  }

  { // xp that makes a member ready to train says so, as a fight's does.
    const { party, world } = fresh();
    const q = quest('fx_ready', 0, { goal: { flag: 'fx_ready_deed' }, pay: { xp: 6 * 1000 } });
    party.flags.fx_ready_deed = 1;
    const said = take(q, world.state, party, [q]).join(' ');
    ok(/Ready to train: Bram, Idris, Wren, Ottilie, Maren, Cassian\./.test(said), `pay that makes the living ready to train names them (${said.replace(/\n+/g, ' ')})`);
  }

  { // A save holds a guild quest's flags.
    const got = collect({ ...CONTENT, guildQuests: ['fx_first'] });
    ok(got.flags.includes('q_fx_first') && got.flags.includes('q_fx_first_done'), 'the saves list records a guild quest\'s taken and done flags');
  }

  // The real guild quests, as C and D add them: each belongs to a guild with a hall on the maps,
  // names real things, has a deed and flags its own; a guild has one first task and no gap in its ranks.
  const halls = new Set(MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => ('hall' in f && f.hall ? [f.hall] : []))));
  for (const h of halls) ok(h in GUILDS, `a hall's guild, ${h}, is a guild`);
  // A tavern may be a hall, as a business may: a person with a room, never one in the street.
  const roomless = MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => (f.kind === 'npc' && f.hall && !f.interior ? [`${d.id}'s ${f.name}`] : [])));
  ok(!roomless.length, `every hall is a room${roomless.length ? ': not ' + roomless.join(', ') : ''}`);
  // Each hall DESIGN §8 names is its guild's, by name: the Drillyard the Wardens', and both Lantern
  // halls the Lanterns' ("The Lanterns' halls are both").
  const HALLS: Readonly<Record<string, GuildId>> = { 'Warden Drillyard': 'wardens', 'Lantern Guildhall': 'lanterns', 'Thornhold Lantern Hall': 'lanterns' };
  for (const [name, g] of Object.entries(HALLS)) {
    const f = MAP_DEFS.flatMap((d) => d.features ?? []).find((x) => 'name' in x && x.name === name);
    ok(!!f && 'hall' in f && f.hall === g, `${name} is a hall of ${GUILDS[g].name.replace(/^The /, 'the ')}`);
  }
  const npcFlags = new Set(MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => (f.kind === 'npc' ? personFlags(f) : []))));
  const findable = new Set([
    ...MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => [...(giftOf(f)?.items ?? []), ...(f.kind === 'shop' ? f.stock : []), ...(f.kind === 'npc' ? personGives(f) : [])])),
    ...Object.values(MONSTERS).flatMap((m) => (m.drops ?? []).map((x) => x.item)),
  ]);
  const saved = collect(CONTENT).flags;
  ok((Object.keys(GUILDS) as GuildId[]).every((g) => saved.includes(rankFlag(g))), 'the saves list records every guild\'s rank flag');
  for (const q of GUILD_QUESTS) {
    ok(saved.includes(takenFlag(q.id)) && saved.includes(doneFlag(q.id)), `${q.id}: the saves list records its flags`);
    const bad = [...(q.goal ? condFaults(q.goal) : []), ...(q.item && !(q.item in ITEMS) ? [`item ${q.item}`] : []), ...(q.pay.items ?? []).filter((i) => !(i in ITEMS)).map((i) => `pay ${i}`)];
    ok(!bad.length, `${q.id}: its deed and pay name real things${bad.length ? ' -> ' + bad.join(', ') : ''}`);
    ok(halls.has(q.guild), `${q.id}: ${q.guild} has a hall on the maps`);
    ok(!!q.goal || !!q.item, `${q.id}: has a deed`);
    if (q.item) ok(findable.has(q.item), `${q.id}: its item ${q.item} is found, bought, dropped or given somewhere`);
    ok(Number.isInteger(q.rank) && q.rank >= 0 && q.rank < GUILDS[q.guild].ranks.length, `${q.id}: its rank, ${q.rank}, is one of the guild's`);
    ok(![takenFlag(q.id), doneFlag(q.id)].some((f) => npcFlags.has(f)), `${q.id}: its flags are its own, set by no person`);
  }
  // Act I takes a guild with quests to its third rank (DESIGN §8): its quests, done in the order a
  // hall offers them, raise a new company that far.
  const ACT_I_RANK = 3;
  for (const g of new Set(GUILD_QUESTS.map((q) => q.guild))) {
    const { party } = fresh();
    for (let offers = offered(g, party); offers.length; offers = offered(g, party)) for (const q of offers) party.flags[takenFlag(q.id)] = party.flags[doneFlag(q.id)] = 1;
    const r = rankOf(g, party);
    ok(r === ACT_I_RANK, `${g}: its quests, done as the hall offers them, raise a company to rank ${ACT_I_RANK}, ${rankName(g, ACT_I_RANK)} (${rankName(g, r) ?? 'none'})`);
  }
  for (const g of new Set(GUILD_QUESTS.map((q) => q.guild))) {
    const ranks = GUILD_QUESTS.filter((q) => q.guild === g).map((q) => q.rank);
    ok(ranks.filter((r) => r === 0).length === 1, `${g}: one first task`);
    ok([...new Set(ranks)].sort().every((r, i) => r === i), `${g}: its ranks have no gap`);
  }
}
