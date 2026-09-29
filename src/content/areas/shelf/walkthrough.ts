// The Foreland's walkthrough: its chapter of the one quest, The Quiet Farm, played from a new game by
// the game's own moves and checked a step at a time (tools/walk.ts); Thornmark's plays the chain.
// Then a new company walks out of Helmstow to the Lodestone, and Gytha gives it the lesson, and
// her later words as Thornhold's news reaches her. Then its side quests, each choice both ways: the
// log reads true and the people stand where it says.
import type { Walkthrough } from '../../area.ts';
import { CHAPTER } from './chapter.ts';
import { newWalk, meetWho, walkThrough, see, fight, playChapter, quest, listen } from '../../../../tools/walk.ts';
import type { Step, Walk } from '../../../../tools/walk.ts';
import { EAST, SOUTH } from '../../../game/types.ts';
import { wrap } from '../../../ui/draw.ts';
import { SAY_W, SAY_LINES, logLines } from '../../../ui/frame.ts';
import { MAP_DEFS } from '../../index.ts';
import { meet, answer, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { questLog } from '../../../game/quests.ts';
import type { PageView } from '../../../game/quests.ts';

/** Vask hires the company: before the chapter, or its last step for a company that came early. */
export const HIRE: Step = { name: 'the hire', play: (w) => meetWho(w, 'q_ashcombe') };

/** The chapter once hired: the farm, the cellar and the wand taken back. */
export const STEPS: readonly Step[] = [
  { name: 'to Ashcombe', play: (w) => walkThrough(w, 'shelf', 23, 20, EAST, 'mill') },
  { name: 'the cellar', play: (w) => { see(w, 'mill:mill_lantern'); fight(w, 'mill:m_warden'); see(w, 'mill:mill_core'); } },
  { name: 'the wand', play: (w) => meetWho(w, 'survey_wand') },
];

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

  lodestone(newWalk(ok), 'a new company');
  // A company Sylvane has spoken to before it comes by still gets the lesson first.
  const late = newWalk(ok);
  meetWho(late, 'q_grove');
  const g = gytha();
  ok(g !== undefined && meet(g, late.party, heard(late.world, g)).text.includes("That's a Stone, whole.") && /Cut\. With tools\./.test(meet(g, late.party, heard(late.world, g)).text),
    'Sylvane met first: Gytha gives the lesson, and then the cut\'s words');

  sideQuests(ok);
};

/** Gytha, found by the flag she sets. */
function gytha(): Person | undefined {
  return MAP_DEFS.flatMap((d) => d.features ?? []).find((f): f is Person => f.kind === 'npc' && [f.flag ?? []].flat().includes('q_lodestone'));
}

/**
 * Out of Helmstow's south gate, east along the track to the Lodestone: the stone said once, in two
 * lines of the log at most, and Gytha at its foot. Her lesson first, then every later visit's
 * words, the cut's once Sylvane has spoken and the chisel's once she has it.
 */
function lodestone(w: Walk, how: string): void {
  const ok = w.ok;
  walkThrough(w, 'harrow', 7, 14, SOUTH, 'shelf');
  w.world.turn('left');
  const said: string[] = [];
  for (let i = 0; i < 4; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') said.push(...r.messages); }
  const stone = said.find((m) => m.startsWith('The Lodestone.'));
  ok(!!stone && logLines(stone).length <= 2, `${how}: four steps east of the south gate the Lodestone is said, in ${stone ? logLines(stone).length : 0} lines of the log`);
  w.world.move('forward');
  // Stepping onto her square is meeting her, as it is in the game.
  const g = gytha(), here = w.world.map.featuresAt(w.world.state.x, w.world.state.y).find((f) => f.kind === 'npc');
  ok(!!g && here?.kind === 'npc' && here.name === g.name, `${how}: at the track's end, at the stone's foot, is Gytha (${here && 'name' in here ? here.name : 'nobody'})`);
  if (!g) return;
  const talk = (): string => meet(g, w.party, heard(w.world, g)).text;
  const lines = (t: string): number => wrap(t, SAY_W).length;
  const first = talk();
  ok(first.includes("That's a Stone, whole.") && !!w.party.flags.q_lodestone && lines(first) <= SAY_LINES, `${how}: Gytha gives the lesson, in ${lines(first)} of the box's ${SAY_LINES} lines, and a company that has heard it is known`);
  const again = talk();
  ok(again.includes('Still whole.'), `${how}: met again, she says it is still whole (${lines(again)} lines)`);
  meetWho(w, 'q_grove');
  const cut = talk();
  ok(cut.includes('Cut. With tools.'), `${how}: once Sylvane has spoken, Gytha has heard the Stone is cut (${lines(cut)} lines)`);
  w.party.bag.push('ashen_chisel');
  meetWho(w, 'ashen_chisel');
  const mended = talk();
  ok(mended.includes('second stool') && !mended.includes('Cut. With tools.'), `${how}: once Sylvane has the chisel, its words take the cut's place (${lines(mended)} lines)`);
}

// ---- the side quests (#77) ----

/** A side quest's page as the log shows it now. */
const page = (w: Walk, id: string): PageView | undefined => questLog(w.world.state, w.party).find((v) => v.def.id === id)?.pages[0];

/** The person on `map` whose name starts so and who stands on `x,y`: one of a person's places. */
function who(map: string, x: number, y: number, name: string): Person {
  const p = MAP_DEFS.find((d) => d.id === map)?.features?.find((f): f is Person => f.kind === 'npc' && f.x === x && f.y === y && f.name.startsWith(name));
  if (!p) throw new Error(`no ${name} at ${map} ${x},${y}`);
  return p;
}
const MAUD = (): Person => who('harrow', 12, 13, 'Maud');
const EBBA_EEL = (): Person => who('harrow', 12, 13, 'Ebba'), EBBA_CHAPEL = (): Person => who('harrow', 11, 4, 'Ebba');
const FISHERMAN = (): Person => who('harrow', 12, 13, 'the fisherman'), WALL = (): Person => who('harrow', 14, 3, 'a Warden on the wall');
const MOTTRAM = (): Person => who('harrow', 4, 10, 'Mottram'), ALWIN = (): Person => who('harrow', 9, 1, 'Alwin');
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

/** Open a chest, 'map:id', as the game does: its gold and items to the party, and spent. */
function open(w: Walk, at: string): void {
  const [map, id] = at.split(':');
  const c = MAP_DEFS.find((d) => d.id === map)?.features?.find((f) => f.kind === 'chest' && f.id === id);
  if (!c || c.kind !== 'chest') { w.ok(false, `there is a chest ${at}`); return; }
  w.world.travel(map, c.x, c.y);
  w.ok(!w.world.used(id), `the chest ${at} is there to open`);
  w.world.markUsed(id);
  w.party.gold += c.gold;
  w.party.bag.push(...c.items);
  listen(w);
}

/** The Clerk's Seal to the seal in hand: the coat among the drowned, the strongbox and its chest. */
function sealFound(w: Walk): void {
  see(w, 'greywater1:gw1_coat');
  see(w, 'greywater1:gw1_strongbox');
  w.ok(w.world.used('gw1_strongbox'), 'the strongbox is opened and its words said');
  open(w, 'greywater1:gw1_seal');
  w.ok(w.party.bag.includes('clerks_seal'), "the strongbox holds the clerk's seal");
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

/** The clock to the next midnight, or the next noon. */
const at = (w: Walk, hour: number): void => { const m = w.world.state.minutes; w.world.state.minutes = m - (m % 1440) + 1440 + hour * 60; };

/** Whether an event of Helmstow's is there to be seen now. */
const shows = (w: Walk, id: string): boolean => { const e = MAP_DEFS.find((d) => d.id === 'harrow')!.features!.find((f) => f.kind === 'event' && f.id === id)!; return w.world.present(e); };

/** The Well Tastes of Iron to its question: Mottram hires, and by night the cart and Alwin at the gatehouse. */
function wellAsked(w: Walk, alwinFirst: boolean): void {
  at(w, 12);
  w.ok(!there(w, ALWIN(), 'harrow') && !shows(w, 'well_cart'), 'by day neither Alwin nor the cart is at the gatehouse');
  const hire = (): void => {
    w.ok(hear(w, 'harrow', MOTTRAM()).startsWith('Mottram sets a bucket') && w.news.at(-1) === 'New quest: The Well Tastes of Iron.' && !!page(w, 'well')?.goal,
      `Mottram's first meeting begins The Well Tastes of Iron, with a goal (${w.news.at(-1)})`);
  };
  if (!alwinFirst) hire();
  at(w, 0);
  see(w, 'harrow:well_cart');
  w.ok(w.world.used('well_cart'), 'by night the cart leaves the gatehouse');
  w.ok(there(w, ALWIN(), 'harrow') && hear(w, 'harrow', ALWIN()).startsWith('A big man in Warden grey') && !!w.party.flags.q_well_alwin, 'by night Alwin stands by the cart, and says what is under the keep');
  if (alwinFirst) hire();
  w.ok(page(w, 'well')?.goal === 'Take what the mason said back to Mottram\'s Stores.', `the mason heard, the goal is Mottram (${page(w, 'well')?.goal})`);
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
  { // The seal to Maud: she pays, says her last words once, and is gone.
    const w = newWalk(ok);
    meetWho(w, 'q_seal');
    w.ok(w.news.at(-1) === 'New quest: The Clerk\'s Seal.' && !!page(w, 'seal')?.goal, `Maud's first meeting begins The Clerk's Seal, with a goal (${w.news.at(-1)})`);
    sealFound(w);
    const gold = w.party.gold;
    meetWho(w, 'q_seal_maud');
    w.ok(w.party.gold === gold + 150 && !w.party.bag.includes('clerks_seal'), 'Maud takes the seal and pays 150');
    reads(w, 'seal', 'The Clerk\'s Seal', ['maud', 'coat', 'seal', 'sold'], ['hale'], 'the seal to Maud');
    w.ok(there(w, MAUD(), 'harrow') && hear(w, 'harrow', MAUD()).startsWith('"Sold.') && !there(w, MAUD(), 'harrow'), 'Maud says her last words once, and is gone from the Eel');
  }
  { // The seal to Hale: he takes it as his second hand-in and pays; Maud's last words are the Warden's.
    const w = newWalk(ok);
    meetWho(w, 'q_seal');
    sealFound(w);
    const gold = w.party.gold;
    meetWho(w, 'q_seal_hale');
    w.ok(w.party.gold === gold + 150 && !w.party.bag.includes('clerks_seal') && !w.party.flags.q_greywater_done, 'Hale takes the seal, without the ledger, and pays 150');
    reads(w, 'seal', 'The Clerk\'s Seal', ['maud', 'coat', 'seal', 'hale'], ['sold'], 'the seal to Hale');
    w.ok(hear(w, 'harrow', MAUD()).startsWith('"You gave it to the Warden."') && !there(w, MAUD(), 'harrow'), 'Maud says her last words once, and is gone from the Eel');
  }
  { // The seal found with no word from Maud, taken to Hale: the quest shows done, and Maud, met
    // after, asks after Edwin once and then says her last words.
    const w = newWalk(ok);
    sealFound(w);
    meetWho(w, 'q_seal_hale');
    reads(w, 'seal', 'The Clerk\'s Seal', ['coat', 'seal', 'hale'], ['maud', 'sold'], 'the seal to Hale, Maud never met');
    const first = hear(w, 'harrow', MAUD()), last = hear(w, 'harrow', MAUD());
    w.ok(first.startsWith('A woman in a good plain dress') && last.startsWith('"You gave it to the Warden."') && !there(w, MAUD(), 'harrow'), 'Maud met after asks after Edwin first, then says her last words, and is gone');
  }
  { // The well: the Wardens told. Alwin and the cart are gone, and the gatehouse is swept.
    const w = newWalk(ok);
    wellAsked(w, false);
    const said = answerWho(w, 'q_well', 'The Wardens.');
    w.ok(said.startsWith('"The Wardens. Good. Yes."'), 'the Wardens told, Mottram breathes out');
    reads(w, 'well', 'The Well Tastes of Iron', ['mottram', 'alwin', 'wardens'], ['lanterns'], 'the Wardens told');
    at(w, 0);
    w.ok(!there(w, ALWIN(), 'harrow') && !shows(w, 'well_cart'), 'the Wardens told, by night Alwin and the cart are gone');
    see(w, 'harrow:well_swept');
    w.ok(w.world.used('well_swept'), 'and the gatehouse is swept');
    w.ok(hear(w, 'harrow', MOTTRAM()).startsWith('"Still iron." He does not offer'), "Mottram's after-lines are the Wardens'");
    w.ok(hear(w, 'harrow', OSMUND()).startsWith('A thin man in a leather apron') && !w.party.flags.q_osmund_well, 'and Osmund has nothing written');
  }
  { // The well: Alwin met before Mottram, the Lanterns told. Mottram hires first; Osmund writes it down.
    const w = newWalk(ok);
    wellAsked(w, true);
    answerWho(w, 'q_well', 'The Lanterns.');
    reads(w, 'well', 'The Well Tastes of Iron', ['mottram', 'alwin', 'lanterns'], ['wardens'], 'the Lanterns told');
    at(w, 0);
    w.ok(there(w, ALWIN(), 'harrow') && shows(w, 'well_cart') && !shows(w, 'well_swept'), 'the Lanterns told, by night Alwin and the cart are still there, and nothing is swept');
    w.ok(hear(w, 'harrow', MOTTRAM()).startsWith('"Still iron. It\'s in a book now'), "Mottram's after-lines are the Lanterns'");
    const first = hear(w, 'harrow', OSMUND()), record = hear(w, 'harrow', OSMUND()), then = hear(w, 'harrow', OSMUND());
    w.ok(first.startsWith('A thin man in a leather apron') && record.startsWith('"Written. Stone dust') && then.startsWith('A thin man in a leather apron'), "Osmund's first meeting comes first, then his record, once");
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
