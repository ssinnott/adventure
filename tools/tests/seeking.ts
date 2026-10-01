// The seeking quests (#19; DESIGN §5): a member's class, level and prestiges as a quest condition,
// at least and never exactly; one quest a member and a prestige, made from the trainers the content
// places, begun at the level with the prestige before and done once taken, or once the third's
// trainer's quest begins; the world map's marks; one trainer a class and prestige; nothing saved.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { MAP_DEFS } from '../../src/content/index.ts';
import { World } from '../../src/game/world.ts';
import { defaultParty, createCharacter, takePrestige } from '../../src/game/party.ts';
import { holds, questLog, questMarks, questNews, TRAINERS } from '../../src/game/quests.ts';
import type { QuestDef } from '../../src/game/quests.ts';
import { seekingQuests, trainersIn, sought, seekId } from '../../src/game/seeking.ts';
import type { Trainer } from '../../src/game/seeking.ts';
import { serialize, deserialize } from '../../src/game/save.ts';
import { ok } from './lib.ts';

export function seeking(): void {
  const rng = makeRng(191), party = defaultParty(rng), world = new World(buildMaps(), party, rng);
  const wren = party.members[2];
  // The condition: a member (or the one in a slot) of a class, at a level or over, with prestiges or more.
  ok(holds({ member: { cls: 'ranger' } }, world.state, party) && !holds({ member: { cls: 'monk' } }, world.state, party) && !holds({ member: { who: 2, level: 11 } }, world.state, party), 'a member condition reads the class and the level');
  wren.level = 12;
  ok(holds({ member: { who: 2, level: 11 } }, world.state, party) && !holds({ member: { who: 0, level: 11 } }, world.state, party) && holds({ member: { cls: 'ranger', level: 11, prestige: 0 } }, world.state, party), 'at the level or over it, by slot or by class');
  takePrestige(wren); takePrestige(wren);
  ok(holds({ member: { who: 2, prestige: 1 } }, world.state, party) && holds({ member: { who: 2, prestige: 2 } }, world.state, party) && !holds({ member: { who: 2, prestige: 3 } }, world.state, party), 'with the prestiges or more: what holds stays held once the next is taken');

  // One quest a member and a prestige, from the trainers placed: none placed, none made.
  ok(TRAINERS.length === trainersIn(MAP_DEFS).length, `the content places ${TRAINERS.length} trainers`);
  const perClass = new Map<string, number>();
  for (const t of TRAINERS) perClass.set(`${t.teaches.cls}:${t.teaches.prestige}`, (perClass.get(`${t.teaches.cls}:${t.teaches.prestige}`) ?? 0) + 1);
  const twice = [...perClass].filter(([, n]) => n > 1).map(([k]) => k);
  ok(!twice.length, `no class's prestige is taught by two trainers${twice.length ? ` (${twice.join(', ')})` : ''}`);

  const fletcher: Trainer = { map: 'thornhold', place: 'Thornhold', name: 'Aldric the fletcher', teaches: { cls: 'ranger', prestige: 1 } };
  const eyrie: Trainer = { map: 'fx_eyrie', place: 'the Wold', name: 'the scout', teaches: { cls: 'ranger', prestige: 3, asks: 'fx_fane_map', done: { flag: 'fx_map_home' } } };
  const fane: QuestDef = { id: 'fx_fane_map', title: "Oriel Fane's Map", start: { flag: 'fx_asked' }, entries: [], goals: [] };
  const trainers = [fletcher, eyrie];
  const r2 = makeRng(192), p2 = defaultParty(r2), w2 = new World(buildMaps(), p2, r2);
  p2.members[3] = createCharacter('Brin', 'human', 'ranger', {}, r2);
  const made = seekingQuests(p2, trainers, [fane]);
  ok(made.map((q) => q.id).join() === [seekId(2, 1), seekId(2, 3), seekId(3, 1), seekId(3, 3)].join() && made[0].title === 'Wren: Outrider' && made[1].title === 'Wren: Unerring' && made.every((q) => q.mark),
    `two rangers each have a quest for each trainer of their class, by slot (${made.map((q) => q.title).join(', ')})`);
  const log = (): ReturnType<typeof questLog> => questLog(w2.state, p2, [fane], trainers);
  ok(!log().some((v) => v.def.id.startsWith('seek:')), 'under the level, no seeking quest is begun');
  const before = questMarks(log());
  p2.members[2].level = 11;
  const begun = log().find((v) => v.def.id === seekId(2, 1));
  const news = questNews(before, log());
  ok(!!begun && !begun.done && begun.goal === 'Find Aldric the fletcher in Thornhold.' && begun.pages[0].entries[0]?.text === 'Aldric the fletcher in Thornhold can make an Outrider of Wren.' && news.some((n) => n.text === 'New quest: Wren: Outrider.') && !log().some((v) => v.def.id === seekId(3, 1)),
    `at 11 Wren's quest begins and the log says so ("${begun?.pages[0].entries[0]?.text}" / "${begun?.goal}"), and Brin's does not`);
  ok(sought(log()).length === 1 && sought(log())[0].at === 'thornhold' && sought(log())[0].who.join() === 'Wren', 'the world map marks Thornhold for Wren');
  // A save carries nothing of it: the log is made again from what the save holds.
  const back = deserialize(serialize(w2.state, p2, 0));
  ok(JSON.stringify(questLog(back.world, back.party, [fane], trainers).map((v) => [v.def.id, v.done, v.goal])) === JSON.stringify(log().map((v) => [v.def.id, v.done, v.goal])), 'a save loads with the same seeking quests, and saves none of them');
  takePrestige(p2.members[2]);
  ok(log().find((v) => v.def.id === seekId(2, 1))?.done === true && !sought(log()).length, 'taken, the quest is done and the mark is gone');
  // The third: begun at 27, and done once its trainer's own quest begins.
  p2.members[2].level = 27; takePrestige(p2.members[2]);
  ok(log().find((v) => v.def.id === seekId(2, 3))?.goal === 'Find the scout in the Wold.', 'at 27 with the second, the third sends Wren to the scout');
  p2.flags.fx_asked = 1;
  ok(log().find((v) => v.def.id === seekId(2, 3))?.done === true, 'and once the scout asks the map, seeking is done');
  ok(!log().some((v) => v.def.id === seekId(3, 3) || v.def.id === seekId(3, 1)), 'while Brin, a ranger still at 1, has no quest begun or done by it');
  const named = seekingQuests({ ...p2, members: p2.members.map((m, i) => (i === 2 ? { ...m, name: 'Wren: the Younger' } : m)) }, trainers, [fane]);
  p2.members[2].level = 11; p2.members[2].prestige = 0;
  ok(sought(questLog(w2.state, { ...p2, members: p2.members.map((m, i) => (i === 2 ? { ...m, name: 'Wren: the Younger' } : m)) }, [fane], trainers))[0]?.who.join() === 'Wren: the Younger' && named[0].seeker === 'Wren: the Younger', 'the mark names the member the quest carries, a colon in the name or not');
  // Content's own words, in place of the system's.
  const worded = seekingQuests(p2, [{ ...fletcher, teaches: { ...fletcher.teaches, seek: 'The fletcher by the oak gate has a bow for Wren.' } }]);
  ok(worded[0].entries[0].text === 'The fletcher by the oak gate has a bow for Wren.', 'a trainer\'s own words stand in for the journal\'s');
}
