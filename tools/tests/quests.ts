// The quest log: every key names something real, every page fits, nothing vanishes when an item
// leaves, and the quests walk through end to end, each change announced once.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { MAP_DEFS, ITEMS, QUESTS } from '../../src/content/index.ts';
import { World } from '../../src/game/world.ts';
import { defaultParty, takeItem } from '../../src/game/party.ts';
import type { Party } from '../../src/game/party.ts';
import { serialize, deserialize } from '../../src/game/save.ts';
import { questLog, questMarks, questNews } from '../../src/game/quests.ts';
import type { QuestCond, QuestView, When } from '../../src/game/quests.ts';
import { questPage, PAGE, LIST } from '../../src/ui/quests.ts';
import { FONT_CHARS, measureText } from '../../src/lib/engine/text.ts';
import { NORTH } from '../../src/game/types.ts';
import type { MapDef } from '../../src/game/map.ts';
import type { MapState } from '../../src/game/world.ts';
import { ok } from './lib.ts';

/**
 * What in a condition names nothing real: a flag no NPC sets, an item, a once-only event or a chest,
 * a guardian that never respawns (one that does comes back to life, and what turns on its death
 * with it), a map. The maps are the game's unless given.
 */
export function condFaults(w: When, maps: readonly MapDef[] = MAP_DEFS): string[] {
  const npcFlags = new Set(maps.flatMap((d) => (d.features ?? []).flatMap((f) => f.kind === 'npc' ? [f.flag, f.quest?.setFlag] : [])));
  const onMap = (ref: string): { map: MapDef | undefined; id: string } => { const [m, id] = ref.split(':'); return { map: maps.find((d) => d.id === m), id }; };
  const bad: string[] = [];
  for (const c of [w].flat() as QuestCond[]) {
    for (const f of [c.flag ?? []].flat()) if (!npcFlags.has(f)) bad.push(`flag ${f}`);
    if (c.item !== undefined && !(c.item in ITEMS)) bad.push(`item ${c.item}`);
    if (c.seen !== undefined) { const { map, id } = onMap(c.seen); if (!map?.features?.some((f) => ((f.kind === 'event' && f.once) || f.kind === 'chest') && f.id === id)) bad.push(`seen ${c.seen}`); }
    if (c.slain !== undefined) { const { map, id } = onMap(c.slain); const e = map?.encounters?.find((x) => x.id === id); if (!e || e.respawn) bad.push(`slain ${c.slain}`); }
    if (c.visited !== undefined && !maps.some((d) => d.id === c.visited)) bad.push(`visited ${c.visited}`);
  }
  return bad;
}

export function quests(): void {
  const conds = (w: When): QuestCond[] => [w].flat();
  // Every condition names something real.
  ok(new Set(QUESTS.map((q) => q.id)).size === QUESTS.length, `the ${QUESTS.length} quests have distinct ids`);
  for (const q of QUESTS) {
    const bad = [q.start, ...(q.done ? [q.done] : []), ...q.entries.map((e) => e.when), ...q.goals.map((g) => g.when)].flatMap((w) => condFaults(w));
    ok(!bad.length, `${q.id}: every condition names a real flag, item, event, guardian or map${bad.length ? ' -> ' + bad.join(', ') : ''}`);
    ok(new Set(q.entries.map((e) => e.id)).size === q.entries.length, `${q.id}: entry ids are distinct`);
    const missing = [...new Set([q.title, ...q.entries.map((e) => e.text), ...q.goals.map((g) => g.text)].join('').toUpperCase())].filter((ch) => !FONT_CHARS.includes(ch));
    ok(!missing.length, `${q.id}: every character has a glyph in the pixel font${missing.length ? ' -> ' + missing.join(' ') : ''}`);
    ok(measureText('▶ ' + q.title) <= LIST.w, `${q.id}: the title fits the list (${measureText('▶ ' + q.title)} of ${LIST.w}px)`);
    const all = (goal: string | null): QuestView => ({ def: q, done: goal === null, entries: q.entries, goal });
    ok([...q.goals.map((g) => g.text), null].every((goal) => questPage(all(goal), PAGE.w, PAGE.h).dropped === 0), `${q.id}: the whole journal fits its page under any goal`);
  }
  { // A page too long for the box gives up its oldest entries and keeps the newest.
    const q = QUESTS[0];
    const long = { ...q, entries: Array.from({ length: 14 }, (_, i) => ({ id: `e${i}`, when: q.start, text: `${i}: ${q.entries[0].text}` })) };
    const p = questPage({ def: long, done: false, entries: long.entries, goal: q.goals[0].text }, PAGE.w, PAGE.h);
    ok(p.dropped > 0 && p.rows.every((r) => r.y + 7 <= PAGE.h) && p.rows.some((r) => r.text.startsWith('13: ')) && !p.rows.some((r) => r.text.startsWith('0: ')),
      `a journal too long for its page drops the oldest ${p.dropped} entries and keeps the newest`);
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
  const handedIn = new Set(MAP_DEFS.flatMap((d) => (d.features ?? []).flatMap((f) => f.kind === 'npc' && f.quest ? [f.quest.item] : [])));
  for (const q of QUESTS) {
    const bad: string[] = [];
    for (const c of conds(q.start)) { const s = fresh(); satisfy(s, c); const v = view(s, q.id); if (!v || v.done || !v.goal) bad.push(`start ${JSON.stringify(c)}`); }
    const start = conds(q.start)[0];
    for (const e of q.entries) for (const c of conds(e.when)) { const s = fresh(); satisfy(s, start); satisfy(s, c); if (!view(s, q.id)?.entries.includes(e)) bad.push(`entry ${e.id}`); }
    q.goals.forEach((g, i) => { const s = fresh(); satisfy(s, start); satisfy(s, conds(g.when)[0]); if (view(s, q.id)?.goal !== g.text) bad.push(`goal ${i + 1}`); });
    ok(!bad.length, `${q.id}: starts with a goal, and every entry and goal can come up${bad.length ? ' -> ' + bad.join(', ') : ''}`);
    // An entry keyed to an item has to outlast losing it: at the hand-in that ends the quest, or,
    // for a quest with no end yet, never, so no hand-in may want the item and no shop buy it.
    const lost = new Set<string>();
    if (q.done) {
      for (const e of q.entries) if (conds(e.when).some((c) => c.item)) { const s = fresh(); satisfy(s, start); satisfy(s, conds(q.done)[0]); if (!view(s, q.id)?.entries.includes(e)) lost.add(`entry ${e.id}, at the hand-in`); }
    } else {
      for (const c of [q.start, ...q.entries.map((e) => e.when)].flatMap(conds)) if (c.item && (handedIn.has(c.item) || Math.floor(ITEMS[c.item].price / 2) > 0)) lost.add(`${c.item}, which can be taken`);
    }
    ok(!lost.size, `${q.id}: nothing in the log vanishes when an item leaves the party${lost.size ? ' -> ' + [...lost].join(', ') : ''}`);
  }
  { // The slice's quests end to end, from the real flags and triggers: the log fills in, the goal
    // moves on, and each change is announced once and in story order.
    const rng = makeRng(4);
    const party = defaultParty(rng);
    const world = new World(buildMaps(), party, rng);
    const log = (): QuestView[] => questLog(world.state, party);
    const quest = (id: string): QuestView => log().find((v) => v.def.id === id)!;
    let marks = questMarks(log());
    const news = (): string => { const l = log(); const n = questNews(marks, l).map((x) => x.text).join(' '); marks = questMarks(l); return n; };
    ok(log().length === 0 && news() === '', 'a new game starts with an empty quest log');
    party.flags.q_ashcombe = 1;
    ok(news() === 'New quest: The Quiet Farm.' && /Ashcombe/.test(quest('ashcombe').goal ?? ''), `Vask's contract begins The Quiet Farm, and says where to go (${quest('ashcombe').goal})`);
    world.travel('mill', 1, 1, 2);
    ok(/cellar/.test(quest('ashcombe').goal ?? '') && news() === '', 'in the cellar the goal moves on, which is not news');
    world.travel('mill', 10, 4, NORTH); world.move('forward');
    ok(quest('ashcombe').entries.some((e) => e.id === 'lantern') && news() === 'Quest log updated: The Quiet Farm.', "stepping on the dead Lantern writes her note into the log");
    party.bag.push('survey_wand');
    ok(/Vask/.test(quest('ashcombe').goal ?? '') && news() === 'Quest log updated: The Quiet Farm.', 'with the wand in hand, the goal is Vask');
    takeItem(party, 'survey_wand'); party.flags.q_ashcombe_done = 1; // what Vask's hand-in does
    ok(news() === 'Quest complete: The Quiet Farm. New quest: The Grove Stone.', 'the hand-in finishes the farm and, after it, begins the Grove Stone');
    const farm = quest('ashcombe');
    ok(farm.done && farm.goal === null && farm.entries.some((e) => e.id === 'wand'), 'a finished quest has no goal and keeps the wand it handed over');
    ok(/pass/.test(quest('grove').goal ?? '') && !/Brandy Hole/.test(quest('grove').goal ?? ''), `with the farm done the Grove Stone sends the company through the pass, Brandy Hole or no (${quest('grove').goal})`);
    party.flags.q_greywater = 1; party.bag.push('greywater_ledger');
    ok(news() === 'New quest: The Cargo Ledger.' && /Hale/.test(quest('greywater').goal ?? ''), 'Hale\'s contract and his ledger arrive together as one line');
    takeItem(party, 'greywater_ledger'); party.flags.q_greywater_done = 1;
    ok(news() === 'Quest complete: The Cargo Ledger.' && /pass/.test(quest('grove').goal ?? ''), 'the second hand-in finishes the ledger and leaves the Grove Stone as it was');
    const data = deserialize(serialize(world.state, party, 1));
    const reloaded = questLog(data.world, data.party);
    ok(JSON.stringify(reloaded) === JSON.stringify(log()) && questNews(marks, reloaded).length === 0, 'a save carries the quest log without storing it, and a reload is not news');
    world.travel('thornmark', 1, 9, 1);
    party.flags.q_grove = 1;
    ok(news() === 'Quest log updated: The Grove Stone.' && /under the Grove/.test(quest('grove').goal ?? ''), 'Sylvane sends the party under the Grove');
    party.bag.push('ashen_chisel');
    world.travel('grove2', 8, 8, 0); world.killGroups(['g2_warden']); party.bag.push('meridian_journal'); // the Warden dies and drops its journal
    ok(/Sylvane/.test(quest('grove').goal ?? '') && ['chisel', 'tear'].every((id) => quest('grove').entries.some((e) => e.id === id)), 'the chisel goes to Sylvane, and the Warden\'s death is written');
    ok(news() === 'Quest log updated: The Grove Stone. New quest: The Lost Expedition.', 'the journal the Warden drops begins the Lost Expedition');
    takeItem(party, 'ashen_chisel'); party.flags.q_grove_done = 1;
    ok(news() === 'Quest complete: The Grove Stone.' && log().filter((v) => v.done).length === 3, 'the three quests of the slice can all be finished');
    const expedition = quest('meridian');
    ok(!expedition.done && /Meridian/.test(expedition.goal ?? '') && expedition.entries.length === 1, `and the Lost Expedition stays open with a goal, its trail not built yet (${expedition.goal})`);
  }
}
