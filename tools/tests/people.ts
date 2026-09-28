// The people: every hand-in takes its item at the first meeting, and Vask's, Hale's and Sylvane's
// words and the log read true whether the company was hired first or came early with the item.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { MAP_DEFS } from '../../src/content/index.ts';
import { World } from '../../src/game/world.ts';
import { defaultParty, countItem } from '../../src/game/party.ts';
import type { Party } from '../../src/game/party.ts';
import { meet } from '../../src/game/people.ts';
import type { Person } from '../../src/game/people.ts';
import { questLog } from '../../src/game/quests.ts';
import type { PageView, QuestCond } from '../../src/game/quests.ts';
import { ok } from './lib.ts';

/** The three hand-ins of Act I, by the item each takes. */
const THREE = ['survey_wand', 'greywater_ledger', 'ashen_chisel'];

export function people(): void {
  const all: { map: string; p: Person }[] = MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => f.kind === 'npc' ? [{ map: d.id, p: f }] : []));
  const handIns = all.filter((x) => x.p.quest);
  const fresh = (): { party: Party; world: World } => { const rng = makeRng(8); const party = defaultParty(rng); return { party, world: new World(buildMaps(), party, rng) }; };
  // The log's pages begun, a side quest or a chapter of the one quest each, keyed by their ids.
  const pages = (s: { party: Party; world: World }): { id: string; page: PageView }[] =>
    questLog(s.world.state, s.party).flatMap((v) => v.pages.filter((p) => p.begun).map((page) => ({ id: v.def.chapters ? `${v.def.id}/${page.def.id}` : v.def.id, page })));
  const logKeys = (s: { party: Party; world: World }): string[] => pages(s).flatMap(({ id, page }) => [`${id}${page.done ? ' done' : ''}`, ...page.entries.map((e) => `${id}:${e.id}`)]);

  // Every hand-in, carried at the first meeting, is taken there.
  for (const { map, p } of handIns) {
    const q = p.quest!, s = fresh();
    s.party.bag.push(q.item);
    const gold = s.party.gold;
    meet(p, s.party);
    ok(!countItem(s.party, q.item) && !!s.party.flags[q.setFlag] && s.party.gold === gold + q.reward, `${map} ${p.x},${p.y}: takes ${q.item} at the first meeting and pays ${q.reward}`);
  }

  ok(THREE.every((item) => handIns.filter((x) => x.p.quest!.item === item).length === 1), `the three hand-ins are found: ${THREE.join(', ')}`);
  for (const item of THREE) {
    const found = handIns.find((x) => x.p.quest!.item === item);
    if (!found) continue;
    const { p } = found, q = p.quest!, hire = p.flag!;
    const who = p.name.split(',')[0];
    ok(!!hire && !!q.early?.length, `${who}: hires, and has words for a company that came early`);

    // Hired first: the lines, the hire flag, nothing taken; then the item, the done words.
    const hired = fresh();
    const lines = meet(p, hired.party);
    ok(lines === p.lines.join('\n\n') && !!hired.party.flags[hire] && !hired.party.flags[q.setFlag], `${who}, hired first: the first meeting hires, and takes nothing`);
    hired.party.bag.push(item);
    const gold = hired.party.gold;
    const done = meet(p, hired.party);
    ok(done.startsWith(q.done.join('\n\n')) && done.endsWith(`(${q.reward} gold.)`) && !countItem(hired.party, item) && hired.party.gold === gold + q.reward && !!hired.party.flags[q.setFlag],
      `${who}, hired first: the item brought back is taken, with the done words and ${q.reward} gold`);

    // Early: the item carried at the first meeting.
    const early = fresh();
    early.party.bag.push(item);
    const before = early.party.gold;
    const said = meet(p, early.party);
    ok(!!q.early && said.startsWith(q.early.join('\n\n')) && said.endsWith(`(${q.reward} gold.)`) && !countItem(early.party, item) && early.party.gold === before + q.reward && !!early.party.flags[q.setFlag] && !early.party.flags[hire],
      `${who}, early: takes it at the first meeting, with the early words and ${q.reward} gold, and does not hire`);
    ok(meet(p, early.party) === q.after.join('\n\n') && meet(p, hired.party) === q.after.join('\n\n'), `${who}: the next meeting says the after words, either way round`);

    // The log, either way round: the quest or chapter done with no goal; early, nothing keyed to
    // the hiring alone, and nothing the hired order does not write too.
    const ends = (x: { id: string; page: PageView }): boolean => x.page.done && [x.page.def.done ?? []].flat().some((c) => [(c as QuestCond).flag ?? []].flat().includes(q.setFlag));
    const quest = pages(early).find(ends);
    const questH = pages(hired).find((x) => x.id === quest?.id);
    ok(!!quest && quest.page.goal === null && !!questH?.page.done && questH.page.goal === null, `${who}: the log has ${quest?.page.def.title ?? 'the quest'} done, with no goal, either way round`);
    const hiring = pages(early).flatMap(({ id, page }) => page.entries.filter((e) => [e.when].flat().every((c) => [(c as QuestCond).flag ?? []].flat().includes(hire))).map((e) => `${id}:${e.id}`));
    const extra = logKeys(early).filter((k) => !logKeys(hired).includes(k));
    ok(!hiring.length && !extra.length, `${who}, early: the log writes no hiring and nothing the hired order does not${hiring.length || extra.length ? ' -> ' + [...hiring, ...extra].join(', ') : ''}`);
  }
}
