// The Foreland's walkthrough: its chapter of the one quest, The Quiet Farm, played from a new game by
// the game's own moves and checked a step at a time (tools/walk.ts). Thornmark's plays the chain.
// Then its side quests, each choice both ways: the log reads true and the people stand where it says.
import type { Walkthrough } from '../../area.ts';
import { CHAPTER } from './chapter.ts';
import { newWalk, meetWho, walkThrough, see, fight, playChapter, quest, listen } from '../../../../tools/walk.ts';
import type { Step, Walk } from '../../../../tools/walk.ts';
import { EAST } from '../../../game/types.ts';
import { MAP_DEFS } from '../../index.ts';
import { meet, answer, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { questLog } from '../../../game/quests.ts';
import type { PageView } from '../../../game/quests.ts';

/** Vask hires the company: before the chapter, or its last step for a company that came early. */
export const HIRE: Step = { name: 'the hire', play: (w) => meetWho(w, 'q_ashcombe') };

/** The chapter once hired: Gullwick, the farm, the cellar and the wand taken back. */
export const STEPS: readonly Step[] = [
  { name: 'to Gullwick', play: (w) => meetWho(w, 'q_wenna') },
  { name: 'to Ashcombe', play: (w) => walkThrough(w, 'shelf', 23, 20, EAST, 'mill') },
  { name: 'the cellar', play: (w) => { see(w, 'mill:mill_lantern'); fight(w, 'mill:m_warden'); see(w, 'mill:mill_core'); } },
  { name: 'the wand', play: (w) => meetWho(w, 'survey_wand') },
];

/** The farm first and Gullwick last: the chapter's goal sends a company that did it so to Hild. */
export const FARM_FIRST: readonly Step[] = [...STEPS.slice(1), STEPS[0]];

/** A new game hired by Vask, the way the chapter begins in order. */
export function hired(w: Walk): void {
  listen(w);
  w.ok(!quest(w), 'a new game has no quest yet');
  HIRE.play(w);
  w.ok(w.news.at(-1) === 'New quest: The Dimming.', `Vask's hire begins the one quest (${w.news.at(-1)})`);
}

export const walkthrough: Walkthrough = (ok) => {
  const w = newWalk(ok);
  hired(w);
  playChapter(w, CHAPTER, STEPS, 'in order');
  ok(quest(w)?.pages.find((p) => p.def === CHAPTER)?.done === true && w.news.includes('Chapter complete: The Quiet Farm.'), 'in order, the wand back to Vask finishes The Quiet Farm');
  sideQuests(ok);
};

// ---- the side quests (#77) ----

/** A side quest's page as the log shows it now. */
const page = (w: Walk, id: string): PageView | undefined => questLog(w.world.state, w.party).find((v) => v.def.id === id)?.pages[0];

/** The person on `map` whose name starts so and who stands on `x,y`: one of a person's places. */
function who(map: string, x: number, y: number, name: string): Person {
  const p = MAP_DEFS.find((d) => d.id === map)?.features?.find((f): f is Person => f.kind === 'npc' && f.x === x && f.y === y && f.name.startsWith(name));
  if (!p) throw new Error(`no ${name} at ${map} ${x},${y}`);
  return p;
}
const EBBA_EEL = (): Person => who('harrow', 12, 13, 'Ebba'), EBBA_CHAPEL = (): Person => who('harrow', 11, 4, 'Ebba');
const FISHERMAN = (): Person => who('harrow', 12, 13, 'the fisherman'), WALL = (): Person => who('harrow', 14, 3, 'a Warden on the wall');
const OSMUND = (): Person => who('harrow', 11, 4, 'Osmund'), AILITH_WOOD = (): Person => who('shelf', 2, 14, 'Ailith'), AILITH_HOLD = (): Person => who('thornhold', 11, 4, 'Ailith');

/** Whether a person stands where they are listed now. */
const there = (w: Walk, p: Person, map: string): boolean => { w.world.travel(map, p.x, p.y); return w.world.present(p); };

/** Meet the person `meetWho` finds by `what`, and answer the question they put with `label`. */
function answerWho(w: Walk, what: string, label: string): string {
  const d = MAP_DEFS.find((m) => m.features?.some((f) => f.kind === 'npc' && [f.flag ?? []].flat().includes(what)))!;
  const p = d.features!.find((f): f is Person => f.kind === 'npc' && [f.flag ?? []].flat().includes(what))!;
  w.world.travel(d.id, p.x, p.y);
  const m = meet(p, w.party, heard(w.world, p)), a = m.choice?.answers.find((x) => x.label === label);
  w.ok(!!a, `${p.name.split(',')[0]} asks, and '${label}' is an answer (${m.choice?.ask ?? 'no question'})`);
  const said = a ? answer(a, w.party) : '';
  listen(w);
  return said;
}

/** What a person says at the next meeting, as the game would have it. */
function hear(w: Walk, map: string, p: Person): string {
  w.world.travel(map, p.x, p.y);
  const said = meet(p, w.party, heard(w.world, p)).text;
  listen(w);
  return said;
}

/** A quest done with no goal, its entries those `want` names and none of `not`, finished once. */
function reads(w: Walk, id: string, title: string, want: readonly string[], not: readonly string[], how: string): void {
  const pg = page(w, id), ids = pg?.entries.map((e) => e.id) ?? [];
  const done = w.news.filter((n) => n === `Quest complete: ${title}.`).length;
  w.ok(!!pg?.done && pg.goal === null && want.every((e) => ids.includes(e)) && !not.some((e) => ids.includes(e)) && done === 1,
    `${how}: ${title} is done with no goal, its entries ${ids.join(', ')}, and said complete once (${done})`);
}

/** The Bell That Rang Twice to its choice: Osmund hires, the boats and the wall, Ebba confesses. */
function bellAsked(w: Walk): void {
  w.ok(!there(w, FISHERMAN(), 'harrow') && !there(w, WALL(), 'harrow'), 'before the bell is asked after, neither the fisherman nor the Warden on the wall is there');
  meetWho(w, 'q_bell');
  w.ok(w.news.at(-1) === 'New quest: The Bell That Rang Twice.' && !!page(w, 'bell')?.goal, `Osmund's first meeting begins The Bell That Rang Twice, with a goal (${w.news.at(-1)})`);
  meetWho(w, 'q_bell_boats');
  meetWho(w, 'q_bell_wall');
  const confession = hear(w, 'harrow', EBBA_EEL());
  w.ok(confession.startsWith('The Lantern adjunct at the corner table') && !!w.party.flags.q_bell_ebba && !w.party.flags.q_survey, 'with the boats and the wall heard, Ebba at the Eel confesses, and does not ask after the survey');
}

function sideQuests(ok: (cond: boolean, msg: string) => void): void {
  { // The bell: the name given. Ebba is gone from the Eel and never in the Chapel.
    const w = newWalk(ok);
    bellAsked(w);
    const said = answerWho(w, 'q_bell', 'The adjunct, Ebba.');
    w.ok(said.startsWith('"A Lantern. Under my own roof."'), 'the name given, Osmund writes it');
    reads(w, 'bell', 'The Bell That Rang Twice', ['osmund', 'boats', 'wall', 'ebba', 'named'], ['kept'], 'the name given');
    w.ok(!there(w, EBBA_EEL(), 'harrow') && !there(w, EBBA_CHAPEL(), 'harrow'), 'the name given, Ebba is gone from the Eel and is not in the Chapel');
    w.ok(!there(w, FISHERMAN(), 'harrow') && !there(w, WALL(), 'harrow'), 'the name given, the fisherman and the Warden on the wall are gone');
    w.ok(hear(w, 'harrow', OSMUND()).startsWith('"They took her to the keep'), "and Osmund's after-lines are the name given's");
  }
  { // The bell: the name kept. Ebba moves to the Chapel, says what she saw of Vask, then asks after the survey.
    const w = newWalk(ok);
    bellAsked(w);
    answerWho(w, 'q_bell', "We couldn't find out.");
    reads(w, 'bell', 'The Bell That Rang Twice', ['osmund', 'boats', 'wall', 'ebba', 'kept'], ['named'], 'the name kept');
    w.ok(!there(w, EBBA_EEL(), 'harrow') && there(w, EBBA_CHAPEL(), 'harrow'), 'the name kept, Ebba is gone from the Eel and in the Chapel');
    w.ok(!there(w, FISHERMAN(), 'harrow') && !there(w, WALL(), 'harrow'), 'the name kept, the fisherman and the Warden on the wall are gone');
    w.ok(hear(w, 'harrow', OSMUND()).startsWith('"Rang itself. It\'s in the book'), "Osmund's after-lines are the name kept's");
    w.ok(hear(w, 'harrow', EBBA_CHAPEL()).startsWith('Ebba is in the Chapel, sober') && !!w.party.flags.q_ebba_chapel, 'in the Chapel Ebba first says what she saw of Vask');
    const survey = hear(w, 'harrow', EBBA_CHAPEL());
    w.ok(survey.startsWith('"The survey team.') && w.news.at(-1) === 'New quest: The Rest of the Survey.' && !!page(w, 'survey')?.goal, `then asks after the survey, and The Rest of the Survey begins with a goal (${w.news.at(-1)})`);
    // The survey from the Chapel: Ailith to Thornhold.
    see(w, 'shelf:survey_ring');
    w.ok(there(w, AILITH_WOOD(), 'shelf') && !there(w, AILITH_HOLD(), 'thornhold'), 'Ailith is in the woods, not at Thornhold');
    answerWho(w, 'q_ailith', 'Thornhold, over the Scarth.');
    reads(w, 'survey', 'The Rest of the Survey', ['ebba', 'ring', 'ailith', 'thornhold'], ['chapel'], 'Ailith sent to Thornhold, from the Chapel');
    w.ok(!there(w, AILITH_WOOD(), 'shelf') && there(w, AILITH_HOLD(), 'thornhold'), 'then Ailith is gone from the woods and in the Chapterhouse at Thornhold');
    w.ok(hear(w, 'thornhold', AILITH_HOLD()).startsWith('Ailith is in the Chapterhouse') && hear(w, 'harrow', EBBA_CHAPEL()).startsWith('"Thornhold. Good.'), 'Ailith speaks at Thornhold, and Ebba in the Chapel has heard');
  }
  { // The survey from Ebba at the Eel, before any bell: Ailith to the Chapel.
    const w = newWalk(ok);
    const survey = hear(w, 'harrow', EBBA_EEL());
    w.ok(survey.startsWith('"The survey team.') && w.news.at(-1) === 'New quest: The Rest of the Survey.', `Ebba at the Eel, at a first meeting, asks after the survey and begins The Rest of the Survey (${w.news.at(-1)})`);
    answerWho(w, 'q_ailith', 'The Chapel, in Helmstow.');
    // The fire-ring stepped on after she is sent writes nothing into a finished journal.
    see(w, 'shelf:survey_ring');
    reads(w, 'survey', 'The Rest of the Survey', ['ebba', 'ailith', 'chapel'], ['thornhold', 'ring'], 'Ailith sent to the Chapel, from the Eel, the fire-ring seen after');
    w.ok(!there(w, AILITH_WOOD(), 'shelf') && !there(w, AILITH_HOLD(), 'thornhold'), 'then Ailith is not seen again');
    w.ok(hear(w, 'harrow', EBBA_EEL()).startsWith('"She came home, and then the Wardens came."'), 'and Ebba at the Eel has heard');
    // Osmund, never met, hires for the bell first, then says his line about her, once.
    const first = hear(w, 'harrow', OSMUND()), second = hear(w, 'harrow', OSMUND()), third = hear(w, 'harrow', OSMUND());
    w.ok(first.startsWith('A thin man in a leather apron') && second.startsWith('"The survey adjunct?') && third.startsWith('A thin man in a leather apron'), "Osmund's first meeting comes first, then his line about Ailith, once");
  }
  { // The survey from the woods alone, after the bell's name was given: Ebba is gone, and the woods begin it.
    const w = newWalk(ok);
    bellAsked(w);
    answerWho(w, 'q_bell', 'The adjunct, Ebba.');
    see(w, 'shelf:survey_ring');
    const goal = page(w, 'survey')?.goal ?? '';
    w.ok(w.news.at(-1) === 'New quest: The Rest of the Survey.' && goal.startsWith('Find whoever lit the fire-ring') && !goal.includes('Ailith'), `with Ebba gone, the woods alone begin The Rest of the Survey, with a goal that does not name her (${goal})`);
    answerWho(w, 'q_ailith', 'Thornhold, over the Scarth.');
    reads(w, 'survey', 'The Rest of the Survey', ['ring', 'ailith', 'thornhold'], ['ebba', 'chapel'], 'Ailith sent to Thornhold, from the woods');
  }
  { // Ailith sent to Thornhold before the bell is answered, then the name kept: in the Chapel, Ebba
    // still says what she saw of Vask first, then what she has heard of Ailith.
    const w = newWalk(ok);
    answerWho(w, 'q_ailith', 'Thornhold, over the Scarth.');
    bellAsked(w);
    answerWho(w, 'q_bell', "We couldn't find out.");
    const first = hear(w, 'harrow', EBBA_CHAPEL()), then = hear(w, 'harrow', EBBA_CHAPEL());
    w.ok(first.startsWith('Ebba is in the Chapel, sober') && then.startsWith('"Thornhold. Good.'), 'Ailith sent first, Ebba in the Chapel says what she saw of Vask first, then what she has heard');
  }
  { // Ailith met first, with no word from anyone: her meeting begins the quest; Esc puts her question again.
    const w = newWalk(ok);
    const ailith = AILITH_WOOD();
    w.world.travel('shelf', ailith.x, ailith.y);
    const m = meet(ailith, w.party, heard(w.world, ailith));
    listen(w);
    w.ok(!!m.choice && w.news.at(-1) === 'New quest: The Rest of the Survey.' && page(w, 'survey')?.goal === 'Tell Ailith where to go: the Chapel in Helmstow, or Thornhold over the Scarth.', `Ailith met first begins The Rest of the Survey, with her question as its goal (${w.news.at(-1)})`);
    w.ok(!!meet(ailith, w.party, heard(w.world, ailith)).choice, 'unanswered, her question is put again');
  }
}
