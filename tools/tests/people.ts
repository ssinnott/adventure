// The people: every hand-in takes its item at the first meeting, and Vask's, Hale's and Sylvane's
// words and the log read true whether the company was hired first or came early with the item. A
// fixture town holds the rest: questions and their answers, words by flag, several hand-ins, letters.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { MAP_DEFS, ITEMS } from '../../src/content/index.ts';
import { World } from '../../src/game/world.ts';
import { defaultParty, countItem } from '../../src/game/party.ts';
import type { Party } from '../../src/game/party.ts';
import { meet, answer, handIns, personFlags, personGives, readText, choices } from '../../src/game/people.ts';
import type { Person } from '../../src/game/people.ts';
import { questLog } from '../../src/game/quests.ts';
import type { PageView, QuestCond, QuestDef } from '../../src/game/quests.ts';
import type { MapDef, Words } from '../../src/game/map.ts';
import { NORTH } from '../../src/game/types.ts';
import { CONTENT, collect } from '../shipped.ts';
import { condFaults } from './quests.ts';
import { wrap, columnLabelWidth } from '../../src/ui/draw.ts';
import { measureText as measure } from '../../src/lib/engine/text.ts';
import { SAY_W, SAY_LINES, ASK_LINES, SIDE_W } from '../../src/ui/frame.ts';
import { ok } from './lib.ts';

/** The three hand-ins of Act I, by the item each takes. */
const THREE = ['survey_wand', 'greywater_ledger', 'ashen_chisel'];

export function people(): void {
  const all: { map: string; p: Person }[] = MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => f.kind === 'npc' ? [{ map: d.id, p: f }] : []));
  const givers = all.filter((x) => handIns(x.p).length);
  const fresh = (): { party: Party; world: World } => { const rng = makeRng(8); const party = defaultParty(rng); return { party, world: new World(buildMaps(), party, rng) }; };
  // The log's pages begun, a side quest or a chapter of the one quest each, keyed by their ids.
  const pages = (s: { party: Party; world: World }): { id: string; page: PageView }[] =>
    questLog(s.world.state, s.party).flatMap((v) => v.pages.filter((p) => p.begun).map((page) => ({ id: v.def.chapters ? `${v.def.id}/${page.def.id}` : v.def.id, page })));
  const logKeys = (s: { party: Party; world: World }): string[] => pages(s).flatMap(({ id, page }) => [`${id}${page.done ? ' done' : ''}`, ...page.entries.map((e) => `${id}:${e.id}`)]);

  // Every hand-in, carried at the first meeting, is taken there.
  for (const { map, p } of givers) for (const q of handIns(p)) {
    const s = fresh();
    s.party.bag.push(q.item);
    const gold = s.party.gold;
    meet(p, s.party);
    ok(!countItem(s.party, q.item) && !!s.party.flags[q.setFlag] && s.party.gold === gold + q.reward, `${map} ${p.x},${p.y}: takes ${q.item} at the first meeting and pays ${q.reward}`);
  }
  // Everything a person says fits the box.
  for (const { map, p } of all) { const bad = boxFaults(p); ok(!bad.length, `${map} ${p.x},${p.y}: every text fits the box, and every question its answers${bad.length ? ' -> ' + bad.join('; ') : ''}`); }
  for (const i of Object.values(ITEMS)) if (i.text) ok(wrap(i.text.join('\n\n'), SAY_W).length <= SAY_LINES, `${i.id}: the letter fits the box's ${SAY_LINES} lines`);
  // Every answer that hands over an item sets a flag, so the question is put once and the item given once.
  for (const { map, p } of all) for (const c of choices(p)) for (const a of c.answers) if (a.gives) ok([a.sets ?? []].flat().length > 0, `${map} ${p.x},${p.y}: '${a.label}' gives ${a.gives} and sets a flag`);

  ok(THREE.every((item) => givers.filter((x) => handIns(x.p).some((q) => q.item === item)).length === 1), `the three hand-ins are found: ${THREE.join(', ')}`);
  for (const item of THREE) {
    const found = givers.find((x) => handIns(x.p).some((q) => q.item === item));
    if (!found) continue;
    const { p } = found, q = handIns(p).find((x) => x.item === item)!, hire = p.flag as string;
    const who = p.name.split(',')[0];
    ok(!!hire && !!q.early?.length, `${who}: hires, and has words for a company that came early`);

    // Hired first: the lines, the hire flag, nothing taken; then the item, the done words.
    const hired = fresh();
    const lines = meet(p, hired.party).text;
    ok(lines === p.lines.join('\n\n') && !!hired.party.flags[hire] && !hired.party.flags[q.setFlag], `${who}, hired first: the first meeting hires, and takes nothing`);
    hired.party.bag.push(item);
    const gold = hired.party.gold;
    const done = meet(p, hired.party).text;
    ok(done.startsWith(q.done.join('\n\n')) && done.endsWith(`(${q.reward} gold.)`) && !countItem(hired.party, item) && hired.party.gold === gold + q.reward && !!hired.party.flags[q.setFlag],
      `${who}, hired first: the item brought back is taken, with the done words and ${q.reward} gold`);

    // Early: the item carried at the first meeting.
    const early = fresh();
    early.party.bag.push(item);
    const before = early.party.gold;
    const said = meet(p, early.party).text;
    ok(!!q.early && said.startsWith(q.early.join('\n\n')) && said.endsWith(`(${q.reward} gold.)`) && !countItem(early.party, item) && early.party.gold === before + q.reward && !!early.party.flags[q.setFlag] && !early.party.flags[hire],
      `${who}, early: takes it at the first meeting, with the early words and ${q.reward} gold, and does not hire`);
    ok(meet(p, early.party).text === q.after?.join('\n\n') && meet(p, hired.party).text === q.after?.join('\n\n'), `${who}: the next meeting says the after words, either way round`);

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
  fixtures(fresh);
}

/**
 * What a person says that would not fit: a text past the box's lines (a hand-in's with its gold
 * line, an answer's with its item's), a question past its lines in the box or the side panel, an
 * answer longer than a line of the side panel's column.
 */
export function boxFaults(p: Person): string[] {
  const gold = (q: { reward: number }): string[] => (q.reward ? [`(${q.reward} gold.)`] : []);
  const texts = [p.lines, ...handIns(p).flatMap((q) => [[...q.done, ...gold(q)], ...(q.early ? [[...q.early, ...gold(q)]] : []), q.after ?? []]), ...(p.says ?? []).map((w) => w.lines),
    ...choices(p).flatMap((c) => c.answers.map((a) => [...a.says, ...(a.gives ? [`(${ITEMS[a.gives]?.name}.)`] : [])]))];
  const out = texts.flatMap((t) => { const n = wrap(t.join('\n\n'), SAY_W).length; return n > SAY_LINES ? [`'${t[0].slice(0, 24)}..' takes ${n} lines of ${SAY_LINES}`] : []; });
  for (const c of choices(p)) {
    const box = wrap(c.ask, SAY_W).length, side = wrap(c.ask, SIDE_W).length;
    if (box > ASK_LINES || side > 7) out.push(`'${c.ask.slice(0, 24)}..' takes ${box} lines of ${ASK_LINES} in the box and ${side} of 7 in the side panel`);
    for (const a of c.answers) if (measure(a.label) > columnLabelWidth(SIDE_W, '', false)) out.push(`the answer '${a.label}' is past a line of the side panel`);
  }
  return out;
}

/** The fixture town's letter, put among the items while the fixtures run. */
const LETTER = { id: 'fx_letter', name: 'A Sealed Letter', slot: 'none' as const, price: 0, text: ['To Captain Hale, at the pass.', '"The riders cross the ford by night. Send men."'] };

/** What #76 lets a person do, on people nobody places: each case as a consumer will write it. */
function fixtures(fresh: () => { party: Party; world: World }): void {
  ITEMS[LETTER.id] = LETTER;
  try {
    const at = { x: 1, y: 1 };
    // Whether words hold, as the game asks it: the same `walks` and `ended` a group's presence reads.
    const heard = (s: { world: World }) => (x: Words): boolean => s.world.walks(x, at.x, at.y) && !s.world.ended(x);

    // A question whose answer sets a flag and hands over a letter; words that change with the answer.
    const captain: Person = {
      kind: 'npc', ...at, name: 'Captain Fixture, of the ford', lines: ['"Riders, by night."'], flag: 'fx_met',
      choice: { ask: 'Shall I write to Hale?', answers: [
        { label: 'Write to him', sets: 'fx_write', gives: LETTER.id, says: ['He writes, and seals it.'] },
        { label: 'Keep it quiet', sets: 'fx_keep', says: ['He shrugs.'] },
      ] },
      says: [
        { after: { flag: 'fx_write' }, lines: ['"Hale will have it by now."'] },
        { after: { flag: 'fx_keep' }, lines: ['"Not a word to Hale."'] },
      ],
    };
    const s = fresh(), first = meet(captain, s.party, heard(s));
    ok(first.text === captain.lines.join('\n\n') && first.choice === captain.choice && !!s.party.flags.fx_met, 'a first meeting ends in its question, and hires');
    ok(meet(captain, s.party, heard(s)).choice === captain.choice, 'a question not answered (Esc) is put again');
    const wrote = answer(captain.choice!.answers[0], s.party);
    ok(wrote === 'He writes, and seals it.\n\n(A Sealed Letter.)' && !!s.party.flags.fx_write && countItem(s.party, LETTER.id) === 1, 'an answer sets its flag, hands over its item and says so');
    const next = meet(captain, s.party, heard(s));
    ok(next.text === '"Hale will have it by now."' && !next.choice, 'after the answer, its words, and the question is not put again');
    const bare = { ...captain, says: undefined }, once = fresh();
    meet(bare, once.party, heard(once));
    answer(captain.choice!.answers[1], once.party);
    const again = meet(bare, once.party, heard(once));
    ok(again.text === captain.lines.join('\n\n') && !again.choice, 'with no words for it, the first lines again, and the question answered is not put again');
    const kept = fresh();
    meet(captain, kept.party, heard(kept));
    answer(captain.choice!.answers[1], kept.party);
    ok(meet(captain, kept.party, heard(kept)).text === '"Not a word to Hale."' && !countItem(kept.party, LETTER.id), 'the other answer, its own words, and no letter');

    // The log reads the answer's flag: a quest done either way, and the entry of the road taken.
    const quest: QuestDef = {
      id: 'fx_ford', title: 'The Fixture Ford', start: { flag: 'fx_met' }, done: [{ flag: 'fx_write' }, { flag: 'fx_keep' }],
      entries: [{ id: 'wrote', when: { flag: 'fx_write' }, text: 'The captain wrote to Hale.' }, { id: 'kept', when: { flag: 'fx_keep' }, text: 'The captain kept it quiet.' }],
      goals: [{ when: { flag: 'fx_met' }, text: 'Answer the captain.' }],
    };
    const log = (x: { world: World; party: Party }) => questLog(x.world.state, x.party, [quest])[0];
    ok(log(s)?.done && log(s).pages[0].entries.map((e) => e.id).join() === 'wrote' && log(kept)?.done && log(kept).pages[0].entries.map((e) => e.id).join() === 'kept', 'the quest log reads the answer: done either way, with the entry of the road taken');
    const town: MapDef = { id: 'fx_town', name: 'Fixture', kind: 'town', start: { ...at, facing: NORTH }, rows: ['###', '#.#', '###'], features: [captain] };
    ok(!condFaults(quest.done!, [town]).length && !!condFaults(quest.done!, [{ ...town, features: [{ ...captain, choice: undefined, says: undefined }] }]).length, "the answers' flags are flags a person sets (and are not without them)");
    ok(personGives(captain).join() === LETTER.id, "the letter is an item a person hands over");
    const shipped = collect({ ...CONTENT, defs: CONTENT.defs.map((d) => (d.id === 'harrow' ? { ...d, features: [...(d.features ?? []), { ...captain, x: 9, y: 6 }] } : d)) });
    ok(['fx_met', 'fx_write', 'fx_keep'].every((f) => shipped.flags.includes(f)), 'the save list records every flag a person can set, answers included');

    ok(!boxFaults(captain).length, 'the captain fits the box');
    const wordy = { ...captain, choice: { ask: Array(12).fill('Shall I write to Hale about the riders?').join(' '), answers: [{ label: 'Write to him at once, and seal it with the ford', sets: 'fx_write', says: Array(8).fill(captain.lines[0]) }] } };
    const wordyBad = boxFaults(wordy);
    ok(wordyBad.length === 3, `a long question, a long answer and long words fail (${wordyBad.length} of 3)`);

    // A letter read from the pack.
    ok(readText(LETTER.id) === LETTER.text && readText('rations') === undefined, 'a letter has words to read, and rations none');

    // Words by flag, furthest along first; words that set a flag.
    const hild: Person = {
      kind: 'npc', ...at, name: 'Hild', lines: ['"Who are you?"'], flag: ['fx_hild', 'fx_hild2'],
      says: [
        { after: { flag: 'fx_b' }, lines: ['"And the second."'] },
        { after: { flag: 'fx_a' }, lines: ['"You did the first."'], sets: 'fx_wenna' },
      ],
    };
    const h = fresh(), say = (): string => meet(hild, h.party, heard(h)).text;
    ok(say() === '"Who are you?"' && !!h.party.flags.fx_hild && !!h.party.flags.fx_hild2, 'a first meeting sets every flag it lists');
    h.party.flags.fx_a = 1;
    ok(say() === '"You did the first."' && !!h.party.flags.fx_wenna, 'once a flag holds, the words for it, which set their own');
    h.party.flags.fx_b = 1;
    ok(say() === '"And the second."', 'furthest along first: with both flags, the later words');
    const cold = fresh();
    cold.party.flags.fx_a = 1;
    ok(meet(hild, cold.party, heard(cold)).text === '"You did the first."' && !cold.party.flags.fx_hild, 'a first meeting that knows what the company has done says so, and does not hire');

    // Words by the hours and until a flag, read as a group's presence is.
    const alwin: Person = { kind: 'npc', ...at, name: 'Alwin', lines: ['"Good day."'], says: [{ when: { hours: 'night' }, until: { flag: 'fx_gone' }, lines: ['"Not by day, I said."'] }] };
    const n = fresh(), day = Math.floor(n.world.state.minutes / 1440) * 1440;
    n.world.state.minutes = day + 12 * 60;
    const noon = meet(alwin, n.party, heard(n)).text;
    n.world.state.minutes = day + 24 * 60;
    const midnight = meet(alwin, n.party, heard(n)).text;
    n.party.flags.fx_gone = 1;
    ok(noon === '"Good day."' && midnight === '"Not by day, I said."' && meet(alwin, n.party, heard(n)).text === '"Good day."', 'words by night are said by night, and not once their `until` holds');

    // Several hand-ins: one a meeting, in order; one that pays nothing says no gold line; then the after-lines.
    const hale: Person = {
      kind: 'npc', ...at, name: 'Captain Fixture', lines: ['"Well?"'],
      quest: [
        { item: 'fx_ledger', reward: 400, setFlag: 'fx_q_ledger', done: ['"The ledger."'], after: ['"The pass is yours."'] },
        { item: LETTER.id, reward: 0, setFlag: 'fx_q_letter', done: ['"A letter from the ford."'] },
      ],
    };
    const g = fresh();
    g.party.bag.push('fx_ledger', LETTER.id);
    const gold = g.party.gold;
    const one = meet(hale, g.party).text, two = meet(hale, g.party).text, three = meet(hale, g.party).text;
    ok(one === '"The ledger."\n\n(400 gold.)' && two === '"A letter from the ford."' && g.party.gold === gold + 400 && !g.party.bag.includes('fx_ledger') && !g.party.bag.includes(LETTER.id), 'two hand-ins carried: one a meeting, in order, the second paying nothing and saying no gold line');
    ok(three === '"The pass is yours."', 'then the after-lines of the last done that has any');
    ok(personFlags(hale).join() === 'fx_q_ledger,fx_q_letter', "a person's flags are every hand-in's");
  } finally {
    delete ITEMS[LETTER.id];
  }
}
