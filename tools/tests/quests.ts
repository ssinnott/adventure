// The quest log: every key names something real, every goal is placed, every journal is shown
// whole, nothing vanishes when an item leaves, the one quest is paged by chapter and reads true out
// of order, and the quests walk through end to end, each change announced once.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { AREAS, MAP_DEFS, ITEMS, QUESTS, THE_QUEST } from '../../src/content/index.ts';
import { World } from '../../src/game/world.ts';
import { defaultParty, takeItem } from '../../src/game/party.ts';
import type { Party } from '../../src/game/party.ts';
import { serialize, deserialize } from '../../src/game/save.ts';
import { questLog, questMarks, questNews } from '../../src/game/quests.ts';
import type { Chapter, LogQuest, PageView, QuestCond, QuestDef, QuestView, When } from '../../src/game/quests.ts';
import { questSheets, chapterHeading, PAGE, LIST } from '../../src/ui/quests.ts';
import { wrap } from '../../src/ui/draw.ts';
import { FONT_CHARS, measureText } from '../../src/lib/engine/text.ts';
import { NORTH } from '../../src/game/types.ts';
import type { MapDef } from '../../src/game/map.ts';
import { spentId } from '../../src/game/wilds.ts';
import type { MapState } from '../../src/game/world.ts';
import { ok } from './lib.ts';

/**
 * What in a condition names nothing real: a flag no NPC sets, an item, something spent once and kept
 * by its id (a once-only event, a chest, a cairn, a shrine, a fountain or a statue), a guardian that
 * never respawns (one that does comes back to life, and what turns on its death with it), a map. The
 * maps are the game's unless given.
 */
export function condFaults(w: When, maps: readonly MapDef[] = MAP_DEFS): string[] {
  const npcFlags = new Set(maps.flatMap((d) => (d.features ?? []).flatMap((f) => f.kind === 'npc' ? [f.flag, f.quest?.setFlag] : [])));
  const onMap = (ref: string): { map: MapDef | undefined; id: string } => { const [m, id] = ref.split(':'); return { map: maps.find((d) => d.id === m), id }; };
  const bad: string[] = [];
  for (const c of [w].flat() as QuestCond[]) {
    for (const f of [c.flag ?? []].flat()) if (!npcFlags.has(f)) bad.push(`flag ${f}`);
    if (c.item !== undefined && !(c.item in ITEMS)) bad.push(`item ${c.item}`);
    if (c.seen !== undefined) { const { map, id } = onMap(c.seen); if (!map?.features?.some((f) => id !== undefined && spentId(f) === id)) bad.push(`seen ${c.seen}`); }
    if (c.slain !== undefined) { const { map, id } = onMap(c.slain); const e = map?.encounters?.find((x) => x.id === id); if (!e || e.respawn) bad.push(`slain ${c.slain}`); }
    if (c.visited !== undefined && !maps.some((d) => d.id === c.visited)) bad.push(`visited ${c.visited}`);
  }
  return bad;
}

export function quests(): void {
  const conds = (w: When): QuestCond[] => [w].flat();
  // Every quest's steps: its own, or its chapters'. Each check reads these, so none passes the one
  // quest without reading a chapter.
  const steps = (q: LogQuest): readonly QuestDef[] => q.chapters ?? [q];
  const whole = (v: QuestView): boolean => {
    const sheets = questSheets(v, PAGE.w, PAGE.h);
    const text = sheets.flatMap((s) => s.rows.map((r) => r.text)).join(' ');
    return sheets.every((s) => s.rows.every((r) => r.y + 7 <= PAGE.h)) && v.pages.every((p) => p.entries.every((e) => text.includes(wrap(e.text, PAGE.w)[0])));
  };
  // Every condition names something real.
  ok(new Set(QUESTS.map((q) => q.id)).size === QUESTS.length, `the ${QUESTS.length} quests have distinct ids`);
  ok(QUESTS.filter((q) => q.chapters).length === 1 && THE_QUEST.chapters.length === AREAS.filter((a) => a.chapter).length && THE_QUEST.chapters.length >= 2,
    `the log holds one quest in chapters, ${THE_QUEST.title}, one from each area that has one (${THE_QUEST.chapters.map((c) => c.title).join(', ')})`);
  ok(THE_QUEST.chapters.every((c, i) => c === AREAS.filter((a) => a.chapter)[i].chapter), 'the chapters are joined in road order');
  ok(measureText('▶ ' + THE_QUEST.title) <= LIST.w, `${THE_QUEST.id}: the title fits the list (${measureText('▶ ' + THE_QUEST.title)} of ${LIST.w}px)`);
  for (const q of QUESTS) for (const c of steps(q)) {
    const id = q.chapters ? `${q.id}/${c.id}` : q.id;
    const bad = [c.start, ...(c.done ? [c.done] : []), ...c.entries.map((e) => e.when), ...c.goals.map((g) => g.when)].flatMap((w) => condFaults(w));
    ok(!bad.length, `${id}: every condition names a real flag, item, event, guardian or map${bad.length ? ' -> ' + bad.join(', ') : ''}`);
    ok(new Set(c.entries.map((e) => e.id)).size === c.entries.length, `${id}: entry ids are distinct`);
    const unplaced = c.goals.filter((g) => (q.chapters || g.at !== undefined) && !MAP_DEFS.some((d) => d.id === g.at));
    ok(!unplaced.length, `${id}: every goal${q.chapters ? '' : ' placed'} is at a real map${unplaced.length ? ' -> ' + unplaced.map((g) => g.at).join(', ') : ''}`);
    const missing = [...new Set([q.title, c.title, ...c.entries.map((e) => e.text), ...c.goals.map((g) => g.text)].join('').toUpperCase())].filter((ch) => !FONT_CHARS.includes(ch));
    ok(!missing.length, `${id}: every character has a glyph in the pixel font${missing.length ? ' -> ' + missing.join(' ') : ''}`);
    if (!q.chapters) ok(measureText('▶ ' + q.title) <= LIST.w, `${id}: the title fits the list (${measureText('▶ ' + q.title)} of ${LIST.w}px)`);
    const all = (goal: string | null): QuestView => ({ def: q, done: goal === null, goal, focus: 0, pages: [{ def: c, done: goal === null, begun: true, entries: c.entries, goal }] });
    const head = chapterHeading(all(null), all(null).pages[0]);
    if (q.chapters) ok(head !== null && measureText(head) <= PAGE.w, `${id}: the chapter's heading fits its page (${head})`);
    ok([...c.goals.map((g) => g.text), null].every((goal) => whole(all(goal))), `${id}: the whole journal is shown on its pages under any goal`);
    ok([...c.goals.map((g) => g.text), null].every((goal) => questSheets(all(goal), PAGE.w, PAGE.h).length === 1), `${id}: and on one page, today`);
  }
  { // A chapter too long for one page goes on over the next, and keeps every entry.
    const c = THE_QUEST.chapters[0];
    const long: Chapter = { ...c, entries: Array.from({ length: 14 }, (_, i) => ({ id: `e${i}`, when: c.start, text: `${i}: ${c.entries[0].text}` })) };
    const v: QuestView = { def: { ...THE_QUEST, chapters: [long] }, done: false, goal: c.goals[0].text, focus: 0, pages: [{ def: long, done: false, begun: true, entries: long.entries, goal: c.goals[0].text }] };
    const sheets = questSheets(v, PAGE.w, PAGE.h);
    ok(sheets.length > 1 && whole(v) && sheets.every((s) => s.rows[0].text === THE_QUEST.title && s.rows.some((r) => r.text === c.goals[0].text)),
      `a chapter of fourteen entries goes on over ${sheets.length} pages, each headed and with its goal, and keeps all fourteen`);
  }
  // Each way in starts the quest with a goal; each entry can be written; each goal can be the one
  // shown (not hidden behind an earlier one); and an entry keyed to an item outlasts the hand-in.
  const fresh = (): { party: Party; world: World } => { const rng = makeRng(8); const party = defaultParty(rng); return { party, world: new World(buildMaps(), party, rng) }; };
  // A zone map's ids are kept in the outdoors' state, and the party has to have walked into it.
  const stateFor = (w: World, map: string): MapState => {
    const on = w.locate(map, 0, 0).mapId;
    if (on !== map && !w.state.zones!.includes(map)) w.state.zones!.push(map);
    return w.ensureMapState(on);
  };
  const satisfy = (s: { party: Party; world: World }, c: QuestCond): void => {
    for (const f of [c.flag ?? []].flat()) s.party.flags[f] = 1;
    if (c.item) s.party.bag.push(c.item);
    if (c.seen) { const [m, id] = c.seen.split(':'); stateFor(s.world, m).used[id] = 1; }
    if (c.slain) { const [m, id] = c.slain.split(':'); stateFor(s.world, m).groups[id].dead = s.world.state.minutes; }
    if (c.visited) stateFor(s.world, c.visited);
  };
  const view = (s: { party: Party; world: World }, id: string): QuestView | undefined => questLog(s.world.state, s.party).find((v) => v.def.id === id);
  const page = (s: { party: Party; world: World }, q: LogQuest, c: QuestDef): PageView | undefined => view(s, q.id)?.pages.find((p) => p.def === c);
  const handedIn = new Set(MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => f.kind === 'npc' && f.quest ? [f.quest.item] : [])));
  for (const q of QUESTS) steps(q).forEach((c, ci) => {
    const id = q.chapters ? `${q.id}/${c.id}` : q.id;
    const bad: string[] = [];
    for (const k of conds(c.start)) { const s = fresh(); satisfy(s, k); const v = view(s, q.id), p = page(s, q, c); if (!v || v.done || !v.goal || !p?.begun || p.done || !p.goal) bad.push(`start ${JSON.stringify(k)}`); }
    const start = conds(c.start)[0];
    for (const e of c.entries) for (const k of conds(e.when)) { const s = fresh(); satisfy(s, start); satisfy(s, k); if (!page(s, q, c)?.entries.includes(e)) bad.push(`entry ${e.id}`); }
    // A chapter's goal may come up with it begun, or with a later one begun or done and it not.
    const ways = [start, ...steps(q).slice(ci + 1).flatMap((x) => [...conds(x.start), ...(x.done ? conds(x.done) : [])])];
    c.goals.forEach((g, i) => { if (!ways.some((w) => { const s = fresh(); satisfy(s, w); satisfy(s, conds(g.when)[0]); return view(s, q.id)?.goal === g.text; })) bad.push(`goal ${i + 1}`); });
    ok(!bad.length, `${id}: starts with a goal, and every entry and goal can come up${bad.length ? ' -> ' + bad.join(', ') : ''}`);
    // An entry keyed to an item has to outlast losing it: at the hand-in that ends the quest, or,
    // for a quest with no end yet, never, so no hand-in may want the item and no shop buy it.
    const lost = new Set<string>();
    if (c.done) {
      for (const e of c.entries) if (conds(e.when).some((k) => k.item)) { const s = fresh(); satisfy(s, start); satisfy(s, conds(c.done)[0]); if (!page(s, q, c)?.entries.includes(e)) lost.add(`entry ${e.id}, at the hand-in`); }
    } else {
      for (const k of [c.start, ...c.entries.map((e) => e.when)].flatMap(conds)) if (k.item && (handedIn.has(k.item) || Math.floor(ITEMS[k.item].price / 2) > 0)) lost.add(`${k.item}, which can be taken`);
    }
    ok(!lost.size, `${id}: nothing in the log vanishes when an item leaves the party${lost.size ? ' -> ' + [...lost].join(', ') : ''}`);
  });
  { // The one quest in two chapters, with the side quests beside it as quests of their own.
    const s = fresh();
    for (const f of ['q_ashcombe_done', 'q_grove', 'q_greywater']) s.party.flags[f] = 1;
    s.party.bag.push('meridian_journal');
    const log = questLog(s.world.state, s.party);
    const one = log.find((v) => v.def === THE_QUEST);
    ok(log.map((v) => v.def.title).join(', ') === 'The Dimming, The Cargo Ledger, The Lost Expedition', `the log lists the one quest and the two side quests (${log.map((v) => v.def.title).join(', ')})`);
    ok(one !== undefined && !one.done && one.pages.map((p) => `${p.def.title}${p.done ? ' (done)' : ''}`).join(', ') === 'The Quiet Farm (done), The Grove Stone' && one.focus === 1 && /under the Grove/.test(one.goal ?? ''),
      `the one quest holds two chapters, the farm done and the Grove open, and opens on the Grove's goal (${one?.goal})`);
    const sheets = questSheets(one!, PAGE.w, PAGE.h);
    ok(sheets.length === 2 && sheets[0].rows.some((r) => r.text === 'I. The Quiet Farm') && sheets[0].rows.some((r) => r.text === 'Done.') && sheets[1].rows.some((r) => r.text === 'II. The Grove Stone'),
      'the log pages it by chapter, each headed with its number, the farm\'s page done');
  }
  { // Out of order: the goal comes only from a chapter begun, or one before it.
    const s = fresh();
    satisfy(s, { visited: 'thornmark' });
    ok(!view(s, THE_QUEST.id), 'a company that walks into Thornmark unsent has no quest yet');
    s.party.flags.q_ashcombe = 1;
    ok(/Ashcombe/.test(view(s, THE_QUEST.id)?.goal ?? ''), `hired, and in Thornmark before the wand, it is still sent to Ashcombe, not the Grove Stone (${view(s, THE_QUEST.id)?.goal})`);
    const t = fresh();
    t.party.flags.q_grove = 1;
    const v = view(t, THE_QUEST.id)!;
    ok(/under the Grove/.test(v.goal ?? '') && v.pages.length === 1 && v.pages[0].def.id === 'grove', `Sylvane first begins the quest at the Grove Stone, with no page for a farm no one has spoken of (${v.goal})`);
    t.party.flags.q_grove_done = 1;
    const w = view(t, THE_QUEST.id)!;
    ok(!w.done && w.goal === 'The Regent-Warden is hiring in Helmstow.' && w.pages.map((p) => p.def.id).join() === 'ashcombe,grove' && w.focus === 0 && !w.pages[0].begun,
      `the Grove done first, the quest goes on to the Regent-Warden (${w.goal})`);
  }
  { // The slice's quests end to end, from the real flags and triggers: the log fills in, the goal
    // moves on, and each change is announced once and in story order.
    const rng = makeRng(4);
    const party = defaultParty(rng);
    const world = new World(buildMaps(), party, rng);
    const log = (): QuestView[] => questLog(world.state, party);
    const quest = (id: string): QuestView => log().find((v) => v.def.id === id)!;
    const chapter = (id: string): PageView => quest(THE_QUEST.id).pages.find((p) => p.def.id === id)!;
    const goal = (): string => quest(THE_QUEST.id).goal ?? '';
    let marks = questMarks(log());
    const news = (): string => { const l = log(); const n = questNews(marks, l).map((x) => x.text).join(' '); marks = questMarks(l); return n; };
    ok(log().length === 0 && news() === '', 'a new game starts with an empty quest log');
    party.flags.q_ashcombe = 1;
    ok(news() === 'New quest: The Dimming.' && /Ashcombe/.test(goal()), `Vask's contract begins the one quest at its first chapter, and says where to go (${goal()})`);
    world.travel('mill', 1, 1, 2);
    ok(/cellar/.test(goal()) && news() === '', 'in the cellar the goal moves on, which is not news');
    world.travel('mill', 10, 4, NORTH); world.move('forward');
    ok(chapter('ashcombe').entries.some((e) => e.id === 'lantern') && news() === 'Quest log updated: The Dimming.', "stepping on the dead Lantern writes her note into the log");
    party.bag.push('survey_wand');
    ok(/Vask/.test(goal()) && news() === 'Quest log updated: The Dimming.', 'with the wand in hand, the goal is Vask');
    takeItem(party, 'survey_wand'); party.flags.q_ashcombe_done = 1; // what Vask's hand-in does
    ok(news() === 'Chapter complete: The Quiet Farm. New chapter: The Grove Stone.', 'the hand-in finishes the farm and, after it, begins the Grove Stone');
    const farm = chapter('ashcombe');
    ok(farm.done && farm.goal === null && ['wand', 'lead'].every((id) => farm.entries.some((e) => e.id === id)), 'a finished chapter has no goal, keeps the wand it handed over and Vask\'s lead');
    ok(/pass/.test(goal()) && !/Brandy Hole/.test(goal()), `with the farm done the quest sends the company through the pass, Brandy Hole or no (${goal()})`);
    party.flags.q_greywater = 1; party.bag.push('greywater_ledger');
    ok(news() === 'New quest: The Cargo Ledger.' && /Hale/.test(quest('greywater').goal ?? ''), 'Hale\'s contract and his ledger arrive together as one line');
    takeItem(party, 'greywater_ledger'); party.flags.q_greywater_done = 1;
    ok(news() === 'Quest complete: The Cargo Ledger.' && /pass/.test(goal()), 'the second hand-in finishes the ledger and leaves the one quest as it was');
    const data = deserialize(serialize(world.state, party, 1));
    const reloaded = questLog(data.world, data.party);
    ok(JSON.stringify(reloaded) === JSON.stringify(log()) && questNews(marks, reloaded).length === 0, 'a save carries the quest log without storing it, and a reload is not news');
    world.travel('thornmark', 1, 9, 1);
    party.flags.q_grove = 1;
    ok(news() === 'Quest log updated: The Dimming.' && /under the Grove/.test(goal()), 'Sylvane sends the party under the Grove');
    party.bag.push('ashen_chisel');
    world.travel('grove2', 8, 8, 0); world.killGroups(['g2_warden']); party.bag.push('meridian_journal'); // the Warden dies and drops its journal
    ok(/Sylvane/.test(goal()) && ['chisel', 'tear'].every((id) => chapter('grove').entries.some((e) => e.id === id)), 'the chisel goes to Sylvane, and the Warden\'s death is written');
    ok(news() === 'Quest log updated: The Dimming. New quest: The Lost Expedition.', 'the journal the Warden drops begins the Lost Expedition');
    takeItem(party, 'ashen_chisel'); party.flags.q_grove_done = 1;
    ok(news() === 'Chapter complete: The Grove Stone. Quest complete: The Dimming.' && quest(THE_QUEST.id).done && log().filter((v) => v.done).length === 2,
      'the last chapter\'s end finishes the one quest; it and the Cargo Ledger are done');
    const expedition = quest('meridian');
    ok(!expedition.done && /Meridian/.test(expedition.goal ?? '') && expedition.pages[0].entries.length === 1, `and the Lost Expedition stays open with a goal, its trail not built yet (${expedition.goal})`);
  }
}
