// Thornmark's walkthrough: the chain of the one quest, the Foreland's chapter and then its own, The
// Grove Stone, played from a new game by the game's own moves and checked a step at a time
// (tools/walk.ts); then played again with Thornmark taken early, before Vask's hire and after it
// but before the wand, where the log must still read true and end the same; and with the treaty in
// Henlys seen before the Stone, where the chisel, found after, makes the match. Then its side
// quests on the built maps (#219) and in the Deepthorn, each from its giver to its choice and both
// ways: the log reads true and the people stand where it says; Act II's Hale's Sergeant both ways;
// and the Eldest on Penspern. Last, the four prestige trainers here (#19), taught at 11 and 19.
import type { Walkthrough } from '../../area.ts';
import { CHAPTER } from './chapter.ts';
import { CHAPTER as FORELAND } from '../shelf/chapter.ts';
import { HIRE, STEPS as FORELAND_STEPS, FARM_FIRST, hired } from '../shelf/walkthrough.ts';
import { newWalk, meetWho, walkThrough, see, fight, playChapter, goalFromBegun, ending, everyGoalWalked, quest, listen } from '../../../../tools/walk.ts';
import type { Step, Walk } from '../../../../tools/walk.ts';
import { EAST, NORTH, SOUTH } from '../../../game/types.ts';
import { MAP_DEFS } from '../../index.ts';
import { meet, answer, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { questLog } from '../../../game/quests.ts';
import type { PageView } from '../../../game/quests.ts';
import type { EncounterDef, Feature } from '../../../game/map.ts';
import { dateAt } from '../../../game/calendar.ts';
import { GameMap } from '../../../game/map.ts';
import { xpForLevel, prestigeOf, takePrestige, createCharacter, PRESTIGES } from '../../../game/party.ts';
import type { Party } from '../../../game/party.ts';
import { teach } from '../../../game/prestige.ts';
import { sought, seekId } from '../../../game/seeking.ts';
import { makeRng } from '../../../lib/engine/rng.ts';
import { TEAR_CLOSED } from './maps/grove2.ts';

/** Over the pass, walked: the road has to let a company by. */
const pass = (w: Walk): void => walkThrough(w, 'shelf', 30, 9, EAST, 'thornmark');
/** Into Thornhold by its gate, and Sylvane met: she sets the company on the Stone. */
const sylvane = (w: Walk): void => { walkThrough(w, 'thornmark', 23, 5, NORTH, 'thornhold'); meetWho(w, 'q_grove'); };
/** Under the Grove: the Stone seen, the Hand of Ash and the Warden of the Cut fought. */
const stone = (w: Walk): void => { see(w, 'grove2:g2_stone'); fight(w, 'grove2:g2_hand'); fight(w, 'grove2:g2_warden'); };

/** The treaty in Henlys's hall, its seal seen. */
const TREATY: Step = { name: 'the treaty', play: (w) => see(w, 'deepthorn_i4:i4_treaty') };

/** The chapter in order: the pass, to Sylvane, under the Grove, the chisel back and the seal seen. */
export const STEPS: readonly Step[] = [
  { name: 'the pass', play: pass },
  { name: 'to Thornhold', play: sylvane },
  { name: 'the Stone', play: stone },
  { name: 'the chisel', play: (w) => meetWho(w, 'ashen_chisel') },
  TREATY,
];
/** The chapter for a company Sylvane has already hired. */
const FROM_SYLVANE = STEPS.slice(2);
/**
 * The chapter for a company that goes straight to the Stone and never meets Sylvane till it has
 * the chisel: she takes it at the first meeting, and never hires.
 */
const STONE_FIRST: readonly Step[] = [
  STEPS[0],
  { name: 'the Stone, unsent', play: stone },
  { name: 'the chisel, to someone who knows', play: (w) => { walkThrough(w, 'thornmark', 23, 5, NORTH, 'thornhold'); meetWho(w, 'ashen_chisel'); } },
  TREATY,
];

export const walkthrough: Walkthrough = (ok) => {
  // The chain, in order.
  const chain = newWalk(ok);
  hired(chain);
  playChapter(chain, FORELAND, FORELAND_STEPS, 'in order');
  ok(chain.news.slice(-2).join(' ') === 'Chapter complete: The Quiet Farm. New chapter: The Grove Stone.', `in order, the wand ends the farm and opens the Grove (${chain.news.slice(-2).join(' ')})`);
  playChapter(chain, CHAPTER, STEPS, 'in order');
  // The quest's own end is the last chapter's, which ending() checks.
  const sealed = chain.news.slice(chain.news.lastIndexOf('Chapter complete: The Grove Stone.'));
  ok(sealed[0] === 'Chapter complete: The Grove Stone.' && sealed.at(-1) === 'New quest: The Empty Throne.', `in order, the seal seen ends the Grove and opens The Empty Throne (${sealed.join(' ')})`);
  henlys(chain, 'in order');
  const want = ending(chain, 'in order', CHAPTER);

  // Thornmark before Vask's hire: through the pass with no quest, to Sylvane and the Grove done
  // before anyone in Helmstow has spoken of it.
  const early = newWalk(ok);
  listen(early);
  pass(early);
  ok(!quest(early), 'early, before the hire: through the pass at level 1, and still no quest');
  sylvane(early);
  ok(early.news.at(-1) === 'New quest: The Dimming.' && quest(early)?.pages.length === 1, `early, Sylvane begins the quest at her own chapter (${early.news.at(-1)})`);
  goalFromBegun(early, 'early, before the hire');
  playChapter(early, CHAPTER, FROM_SYLVANE, 'early, before the hire');
  goalFromBegun(early, 'early, before the hire, the Grove done');
  // The farm before Gullwick here, so the Foreland's goal for a company that did it first comes up.
  playChapter(early, FORELAND, [HIRE, ...FARM_FIRST], 'early, before the hire');
  ok(JSON.stringify(ending(early, 'early, before the hire', CHAPTER)) === JSON.stringify(want), 'early, before the hire: the log ends with the same entries as in order');

  // Thornmark after the hire, before the wand: the quest never sends the company to the Stone
  // before the farm, and the Grove's own chapter opens when Sylvane speaks.
  const hiredEarly = newWalk(ok);
  hired(hiredEarly);
  pass(hiredEarly);
  goalFromBegun(hiredEarly, 'hired, in Thornmark before the wand');
  const from = FORELAND.goals.some((g) => g.text === quest(hiredEarly)?.goal);
  ok(from, `hired, in Thornmark before the wand, the goal is still the Foreland's (${quest(hiredEarly)?.goal})`);
  sylvane(hiredEarly);
  ok(hiredEarly.news.at(-1) === 'New chapter: The Grove Stone.', `hired, Sylvane opens the Grove's chapter (${hiredEarly.news.at(-1)})`);
  playChapter(hiredEarly, CHAPTER, FROM_SYLVANE, 'hired, early');
  goalFromBegun(hiredEarly, 'hired, early, the Grove done');
  playChapter(hiredEarly, FORELAND, FORELAND_STEPS, 'hired, early');
  ok(JSON.stringify(ending(hiredEarly, 'hired, early', CHAPTER)) === JSON.stringify(want), 'hired, early: the log ends with the same entries as in order');

  // In order, but to the Stone before Thornhold: the chisel goes to Sylvane at the first meeting.
  // She never hires, so her own entry is never written, and the entries are not compared.
  const unsent = newWalk(ok);
  hired(unsent);
  playChapter(unsent, FORELAND, FORELAND_STEPS, 'in order, the Stone first');
  playChapter(unsent, CHAPTER, STONE_FIRST, 'in order, the Stone first');
  ending(unsent, 'in order, the Stone first', CHAPTER);

  // The treaty seen before the Stone: a seal the company does not know, and Senara says so; the
  // chisel, found after and paid for, makes the match and ends the chapter.
  const treatyFirst = newWalk(ok);
  hired(treatyFirst);
  playChapter(treatyFirst, FORELAND, FORELAND_STEPS, 'the treaty first');
  treatyFirst.level = 8;
  see(treatyFirst, 'deepthorn_i4:i4_treaty');
  ok(treatyFirst.news.at(-1) === 'New quest: The Empty Throne.' && !quest(treatyFirst)?.pages.find((p) => p.def === CHAPTER)?.done, `the treaty first, the seal opens The Empty Throne and ends nothing (${treatyFirst.news.at(-1)})`);
  const unknown = hear(treatyFirst, 'deepthorn_i4', SENARA());
  ok(unknown.includes('No word from Sylvane') && !!treatyFirst.party.flags.q_seal_unknown, 'the treaty first, Senara shows a seal that means nothing yet');
  playChapter(treatyFirst, CHAPTER, STEPS.slice(1, 4), 'the treaty first');
  const ids = ending(treatyFirst, 'the treaty first', CHAPTER);
  ok(['grove.seal_early', 'grove.seal', 'grove.lead', 'grove.paid'].every((e) => ids.includes(e)), `the treaty first, the log reads the seal unknown and then matched (${ids.filter((e) => e.startsWith('grove.')).join(', ')})`);

  // The seal shown by Senara, from her square, and the treaty's never stepped on: the chapter ends
  // there as well, and the log ends as in order.
  const shown = newWalk(ok);
  hired(shown);
  playChapter(shown, FORELAND, FORELAND_STEPS, 'shown by Senara');
  playChapter(shown, CHAPTER, [...STEPS.slice(0, 4), { name: 'Senara shows the seal', play: (w) => meetWho(w, 'q_mark') }], 'shown by Senara');
  ok(JSON.stringify(ending(shown, 'shown by Senara', CHAPTER)) === JSON.stringify(want), 'shown by Senara: the log ends with the same entries as in order');

  // The chisel carried to Senara before Sylvane has paid for it: she makes the match, the chapter
  // waits on the pay, and her next words, the match not yet made, ask all the same.
  const carried = newWalk(ok);
  hired(carried);
  playChapter(carried, FORELAND, FORELAND_STEPS, 'the chisel carried');
  playChapter(carried, CHAPTER, STEPS.slice(0, 3), 'the chisel carried');
  carried.level = 8;
  ok(hear(carried, 'deepthorn_i4', SENARA()).includes('something that hums') && !!carried.party.flags.q_seal_matched && !quest(carried)?.pages.find((p) => p.def === CHAPTER)?.done,
    'the chisel carried, Senara makes the match and the chapter waits on the pay');
  ok(hear(carried, 'deepthorn_i4', SENARA()).includes('longer than most') && !!carried.party.flags.q_mark, 'the chisel carried, Senara, the match not yet made, asks for the rubbing');
  playChapter(carried, CHAPTER, [STEPS[3]], 'the chisel carried');
  ok(JSON.stringify(ending(carried, 'the chisel carried', CHAPTER)) === JSON.stringify(want), 'the chisel carried: the log ends with the same entries as in order');

  everyGoalWalked(ok, [FORELAND, CHAPTER]);
  sideQuests(ok);
  trainers(ok);
};

/**
 * Henlys after the seal, in order: Senara knows the match and asks for The Older Mark; Mawgan and
 * Sylvane have seen it too.
 */
function henlys(w: Walk, how: string): void {
  w.ok(hear(w, 'deepthorn_i4', SENARA()).includes('Sylvane sent you') && !!w.party.flags.q_treaty, `${how}, Senara knows what Sylvane sent the company for`);
  w.ok(hear(w, 'deepthorn_i4', SENARA()).includes('one more place that mark is') && !!w.party.flags.q_mark, `${how}, Senara, the match made, asks for a rubbing of the stone on Penspern`);
  w.ok(hear(w, 'deepthorn_i4', MAWGAN()).startsWith('"You have seen it. Good.'), `${how}, Mawgan's words are the treaty's`);
  w.ok(hear(w, 'thornhold', SYLVANE()).startsWith('"You have seen it, then.'), `${how}, and so are Sylvane's`);
}

// ---- the side quests (#219) ----

/** A side quest's page as the log shows it now. */
const page = (w: Walk, id: string): PageView | undefined => questLog(w.world.state, w.party).find((v) => v.def.id === id)?.pages[0];

/** The person on `map` whose name starts so and who stands on `x,y`: one of a person's places. */
function who(map: string, x: number, y: number, name: string): Person {
  const p = MAP_DEFS.find((d) => d.id === map)?.features?.find((f): f is Person => f.kind === 'npc' && f.x === x && f.y === y && f.name.startsWith(name));
  if (!p) throw new Error(`no ${name} at ${map} ${x},${y}`);
  return p;
}
const SYLVANE = (): Person => who('thornhold', 9, 5, 'Elder Sylvane');
const SENARA = (): Person => who('deepthorn_i4', 10, 9, 'Senara'), MAWGAN = (): Person => who('deepthorn_i4', 9, 12, 'Mawgan');
const TEGEN = (): Person => who('thornhold', 12, 13, 'Tegen'), LEOFWIN = (): Person => who('thornmark', 17, 15, 'Leofwin');
const PIRAN = (): Person => who('thornhold', 6, 14, 'Piran'), ULF = (): Person => who('thornmark', 15, 22, 'Ulf'), ULF_PASS = (): Person => who('thornmark', 2, 10, 'Ulf');
const TAMSIN = (): Person => who('thornhold', 11, 4, 'Reader Tamsin');
const KEYNE = (): Person => who('thornhold', 6, 7, 'Keyne'), MEVA = (): Person => who('grove1', 12, 4, 'Meva');
const THORA = (): Person => who('thornmark', 18, 4, 'Thora'), THORA_WALL = (): Person => who('thornhold', 7, 1, 'Thora'), KERROW = (): Person => who('thornhold', 4, 10, 'Kerrow');
const EDITH = (): Person => who('thornmark', 5, 27, 'Edith'), EDITH_STONE = (): Person => who('grove2', 7, 7, 'Edith');
const IDONY = (): Person => who('thornhold', 12, 13, 'Idony');
const KEA = (): Person => who('deepthorn_j5', 6, 18, 'Kea'), CENRIC = (): Person => who('deepthorn_j5', 7, 20, 'a Warden sergeant');
const GODRIC = (): Person => who('deepthorn_i3', 11, 14, 'Godric');
const WYSTAN = (): Person => who('thornhold', 9, 14, 'Wystan'), WYSTAN_DOOR = (): Person => who('thornhold', 12, 13, 'Wystan');
const HALE = (): Person => who('tide_ship3', 10, 12, 'Captain Hale');
const JAGO = (): Person => who('thornhold', 4, 10, 'Jago'), DERWA = (): Person => who('thornhold', 11, 4, 'Derwa'), LOWEN = (): Person => who('thornhold', 14, 1, 'Lowen');
const CUTHRED = (): Person => who('deepthorn_i3', 7, 2, 'Cuthred');

/** Whether a person stands where they are listed now. */
const there = (w: Walk, p: Person, map: string): boolean => { w.world.travel(map, p.x, p.y); return w.world.present(p); };

/** What a person says at the next meeting, as the game would have it. */
function hear(w: Walk, map: string, p: Person): string {
  w.world.travel(map, p.x, p.y);
  const said = meet(p, w.party, heard(w.world, p)).text;
  listen(w);
  return said;
}

/** Meet a person and answer the question they put with `label`; what the answer says. */
function answerTo(w: Walk, map: string, p: Person, label: string): string {
  w.world.travel(map, p.x, p.y);
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

/** A feature or group of `map` by its id, and whether it is there now. */
function shows(w: Walk, map: string, id: string): boolean {
  const d = MAP_DEFS.find((m) => m.id === map)!;
  const f = [...(d.features ?? []), ...(d.encounters ?? [])].find((x) => 'id' in x && x.id === id) as Feature | EncounterDef;
  w.world.travel(map, f.x, f.y);
  return 'monsters' in f ? w.world.walks(f, f.x, f.y) && !w.world.ended(f) : w.world.present(f);
}

/** A quest done with no goal, its entries those `want` names and none of `not`, finished once. */
function reads(w: Walk, id: string, title: string, want: readonly string[], not: readonly string[], how: string): void {
  const pg = page(w, id), ids = pg?.entries.map((e) => e.id) ?? [];
  const done = w.news.filter((n) => n === `Quest complete: ${title}.`).length;
  w.ok(!!pg?.done && pg.goal === null && want.every((e) => ids.includes(e)) && !not.some((e) => ids.includes(e)) && done === 1,
    `${how}: ${title} is done with no goal, its entries ${ids.join(', ')}, and said complete once (${done})`);
}

/** The chisel paid for, and Sylvane's Grove words heard once: what her side quests wait on. */
function groveDone(w: Walk): void {
  w.party.bag.push('ashen_chisel');
  meetWho(w, 'ashen_chisel');
  w.ok(hear(w, 'thornhold', SYLVANE()).startsWith('"The Grove is quiet again.'), 'the chisel paid for, Sylvane says the Grove is quiet at the next meeting');
}

/** The clock to the next midnight, or the next noon. */
const at = (w: Walk, hour: number): void => { const m = w.world.state.minutes; w.world.state.minutes = m - (m % 1440) + 1440 + hour * 60; };

/** The clock to the first day of the next winter, or of the next summer. */
function toSeason(w: Walk, season: 'winter' | 'summer'): void {
  while (dateAt(w.world.state.minutes).season !== season) w.world.state.minutes += 1440;
}

function sideQuests(ok: (cond: boolean, msg: string) => void): void {
  { // A Coin Not From Caldera: Tegen's question put again until the coin is taken; Leofwin walks.
    const w = newWalk(ok);
    w.ok(!there(w, LEOFWIN(), 'thornmark'), 'before Tegen asks, Leofwin is not at his camp');
    answerTo(w, 'thornhold', TEGEN(), 'Not our trade.');
    w.ok(!page(w, 'coin') && !w.party.bag.includes('faceless_coin'), 'Tegen refused, there is no quest and no coin');
    answerTo(w, 'thornhold', TEGEN(), 'We\'ll find him.');
    w.ok(w.news.at(-1) === 'New quest: A Coin Not From Caldera.' && !!page(w, 'coin')?.goal && w.party.bag.includes('faceless_coin'), `the coin taken, A Coin Not From Caldera begins with a goal, and the coin is in the pack (${w.news.at(-1)})`);
    see(w, 'thornmark:tm_camp');
    w.ok(there(w, LEOFWIN(), 'thornmark'), 'Leofwin is at his camp');
    answerTo(w, 'thornmark', LEOFWIN(), 'Walk. Where do they come from?');
    reads(w, 'coin', 'A Coin Not From Caldera', ['tegen', 'camp', 'walk'], ['fight', 'slain'], 'Leofwin let walk');
    w.ok(!there(w, LEOFWIN(), 'thornmark') && !shows(w, 'thornmark', 'tm_deserters') && w.party.bag.includes('faceless_coin'), 'Leofwin let walk, he is gone, no band comes and the coin stays in the pack');
    w.ok(hear(w, 'thornhold', TEGEN()).startsWith('"He walked?'), "Tegen's after-lines are the walk's");
  }
  { // A Coin Not From Caldera: Leofwin whistles up his band, and it is fought.
    const w = newWalk(ok);
    w.level = 5;
    answerTo(w, 'thornhold', TEGEN(), 'We\'ll find him.');
    w.ok(!shows(w, 'thornmark', 'tm_deserters'), 'before the whistle, Leofwin\'s band is not there');
    answerTo(w, 'thornmark', LEOFWIN(), 'You\'ll answer at the Scarth.');
    w.ok(!there(w, LEOFWIN(), 'thornmark') && shows(w, 'thornmark', 'tm_deserters') && !page(w, 'coin')?.done, 'Leofwin whistles: he is gone, his band stands by the camp and the quest is not done');
    w.ok(hear(w, 'thornhold', TEGEN()).startsWith('"Keep the coin.'), 'his band still standing, Tegen has no word of him yet');
    fight(w, 'thornmark:tm_deserters');
    reads(w, 'coin', 'A Coin Not From Caldera', ['tegen', 'fight', 'slain'], ['walk'], 'Leofwin fought');
    w.ok(hear(w, 'thornhold', TEGEN()).startsWith('"Dead in the trees') && w.party.bag.includes('faceless_coin'), "Tegen's after-lines are the fight's, and the coin stays in the pack");
  }
  { // Leave the Trees Standing: Ulf before the Elder, who banishes him. Sylvane met first: her
    // words for the burner wait on it.
    const w = newWalk(ok);
    meetWho(w, 'q_grove');
    meetWho(w, 'q_trees');
    w.ok(w.news.at(-1) === 'New quest: Leave the Trees Standing.' && !!page(w, 'trees')?.goal, `Piran's first meeting begins Leave the Trees Standing, with a goal (${w.news.at(-1)})`);
    w.ok(shows(w, 'thornmark', 'tm_stack') && !shows(w, 'thornmark', 'tm_stack_cold'), 'the stack is smoking, not cold');
    see(w, 'thornmark:tm_stack');
    answerTo(w, 'thornmark', ULF(), 'To the Elder.');
    w.ok(!there(w, ULF(), 'thornmark') && !page(w, 'trees')?.done && page(w, 'trees')?.goal === 'Bring Ulf before Elder Sylvane in Thornhold.', `Ulf goes ahead to the Elder, and the goal is Sylvane (${page(w, 'trees')?.goal})`);
    w.ok(hear(w, 'thornhold', SYLVANE()).startsWith('Sylvane hears the burner out'), 'Sylvane hears the burner out');
    reads(w, 'trees', 'Leave the Trees Standing', ['piran', 'stack', 'ulf', 'banished'], ['home'], 'Ulf banished');
    w.ok(!shows(w, 'thornmark', 'tm_stack') && shows(w, 'thornmark', 'tm_stack_cold') && !there(w, ULF_PASS(), 'thornmark'), 'Ulf banished, the stack is cold and he is not at the pass');
    w.ok(hear(w, 'thornhold', PIRAN()).startsWith('"Over the pass'), "Piran's after-lines are the banishing's");
  }
  { // Leave the Trees Standing: Ulf met before Piran, and sent home; he waits at the pass.
    const w = newWalk(ok);
    answerTo(w, 'thornmark', ULF(), 'Go home, and don\'t come back.');
    reads(w, 'trees', 'Leave the Trees Standing', ['ulf', 'home'], ['piran', 'banished'], 'Ulf sent home, Piran never met');
    w.ok(!there(w, ULF(), 'thornmark') && there(w, ULF_PASS(), 'thornmark') && hear(w, 'thornmark', ULF_PASS()).startsWith('Ulf sits on his cart'), 'Ulf sent home, he waits at the pass');
    w.ok(hear(w, 'thornhold', PIRAN()).startsWith('"Gone home'), "Piran, met after, says he's gone home");
  }
  { // The Dark Glass: asked for, found and read, and Sylvane, met first, told.
    const w = newWalk(ok);
    meetWho(w, 'q_grove');
    w.ok(!there(w, TAMSIN(), 'thornhold'), 'before the lake is seen, Tamsin is not in the Chapterhouse');
    see(w, 'thornmark:lake');
    meetWho(w, 'q_glass');
    w.ok(w.news.at(-1) === 'New quest: The Dark Glass.' && !!page(w, 'glass')?.goal, `Tamsin's first meeting begins The Dark Glass, with a goal (${w.news.at(-1)})`);
    see(w, 'thornmark:tm_far_shore');
    open(w, 'thornmark:tm_glass');
    const gold = w.party.gold;
    w.ok(hear(w, 'thornhold', TAMSIN()).startsWith('Tamsin sets the glass') && w.party.gold === gold + 300 && !w.party.bag.includes('marker_glass'), 'Tamsin takes the glass, reads it and pays 300');
    answerTo(w, 'thornhold', TAMSIN(), 'The truth.');
    w.ok(page(w, 'glass')?.goal === 'Tell Elder Sylvane what the glass held.' && hear(w, 'thornhold', TAMSIN()).startsWith('"Go on.'), 'the truth promised, the goal is Sylvane and Tamsin sends the company on');
    w.ok(hear(w, 'thornhold', SYLVANE()).startsWith('Sylvane does not ask'), 'Sylvane is told');
    reads(w, 'glass', 'The Dark Glass', ['tamsin', 'shore', 'read', 'told'], ['kept'], 'Sylvane told');
    w.ok(hear(w, 'thornhold', TAMSIN()).startsWith('"You told her.'), "Tamsin's after-lines are the truth's");
  }
  { // The Dark Glass: the glass lifted unasked, and the silence kept for a Sapphire Vial.
    const w = newWalk(ok);
    open(w, 'thornmark:tm_glass');
    see(w, 'thornmark:lake');
    w.ok(hear(w, 'thornhold', TAMSIN()).startsWith('The Reader looks at the glass') && !w.party.flags.q_glass, 'Tamsin takes the glass brought unasked, with her early words, and does not hire');
    w.ok(w.news.at(-1) === 'New quest: The Dark Glass.' && page(w, 'glass')?.goal === 'Answer Reader Tamsin at the Chapterhouse: what will Sylvane be told?', `the glass read begins The Dark Glass, with her question as its goal (${page(w, 'glass')?.goal})`);
    const vials = w.party.bag.filter((i) => i === 'potion_sp_great').length;
    answerTo(w, 'thornhold', TAMSIN(), 'Nothing.');
    reads(w, 'glass', 'The Dark Glass', ['read', 'kept'], ['tamsin', 'told'], 'the silence kept, the glass brought unasked');
    w.ok(w.party.bag.filter((i) => i === 'potion_sp_great').length === vials + 1 && hear(w, 'thornhold', TAMSIN()).startsWith('"She asked.'), 'the silence kept, Tamsin pays a Sapphire Vial, and her after-lines are the silence\'s');
  }
  { // The Elder's Four: the three dead found, Meva's truth told.
    const w = newWalk(ok);
    meetWho(w, 'q_four');
    w.ok(w.news.at(-1) === 'New quest: The Elder\'s Four.' && !!page(w, 'four')?.goal, `Keyne's first meeting begins The Elder's Four, with a goal (${w.news.at(-1)})`);
    for (const e of ['g1_stairs', 'g1_ruan', 'g1_mylor']) see(w, `grove1:${e}`);
    w.ok(there(w, MEVA(), 'grove1'), 'Meva is in the roots\' dead end');
    answerTo(w, 'grove1', MEVA(), 'We\'ll tell them the truth.');
    w.ok(!there(w, MEVA(), 'grove1') && !shows(w, 'thornhold', 'th_rite'), 'answered, Meva is alone with it, and there is no rite yet');
    w.ok(hear(w, 'thornhold', KEYNE()).startsWith('Keyne hears where Ruan lies, and where Mylor and Breaca'), 'Keyne hears the truth');
    reads(w, 'four', 'The Elder\'s Four', ['keyne', 'stair', 'ruan', 'mylor', 'meva', 'truth'], ['lie'], 'the truth told');
    see(w, 'thornhold:th_rite');
    w.ok(w.world.used('th_rite') && hear(w, 'thornhold', KEYNE()).startsWith('"It\'s done.'), 'the rite is held under the oaks, and Keyne says it is done');
  }
  { // The Elder's Four: Meva met before Keyne, and the lie told: Keyne asks first, then hears it.
    const w = newWalk(ok);
    answerTo(w, 'grove1', MEVA(), 'We\'ll tell them you died there.');
    w.ok(!page(w, 'four'), 'Meva answered before Keyne asks, there is no quest yet');
    const first = hear(w, 'thornhold', KEYNE()), then = hear(w, 'thornhold', KEYNE());
    w.ok(first.startsWith('A woman fills a jar') && then.startsWith('Keyne hears where Ruan lies, and where Mylor lies'), 'Keyne asks first, then hears the lie');
    reads(w, 'four', 'The Elder\'s Four', ['keyne', 'meva', 'lie'], ['truth'], 'the lie told');
  }
  { // Terms From the Brigands: Sylvane's terms after the chisel, carried; the road's brigands stop.
    const w = newWalk(ok);
    w.ok(hear(w, 'thornhold', SYLVANE()).startsWith('An elf in a robe') && !page(w, 'terms'), 'before the chisel, Sylvane has no terms to tell of');
    groveDone(w);
    w.ok(hear(w, 'thornhold', SYLVANE()).startsWith('"A woman came to my gate') && w.news.at(-1) === 'New quest: Terms From the Brigands.', `then she tells of the brigands' terms, and Terms From the Brigands begins (${w.news.at(-1)})`);
    w.ok(hear(w, 'thornhold', SYLVANE()).startsWith('"A woman came to my gate'), 'the terms are told again until Thora is answered');
    see(w, 'thornmark:tm_thora_camp');
    w.ok(shows(w, 'thornmark', 'tm_brigands1') && shows(w, 'thornmark', 'tm_brigands2'), 'the road\'s brigands are still about');
    answerTo(w, 'thornmark', THORA(), 'We\'ll carry them, and speak.');
    w.ok(!there(w, THORA(), 'thornmark') && !there(w, THORA_WALL(), 'thornhold') && page(w, 'terms')?.goal === 'Carry Thora\'s terms to Elder Sylvane in Thornhold.', 'Thora gone from her camp, not yet at the wall, and the goal is Sylvane');
    w.ok(hear(w, 'thornhold', SYLVANE()).startsWith('Sylvane hears the terms'), 'Sylvane hears the terms, and rises');
    reads(w, 'terms', 'Terms From the Brigands', ['sylvane', 'camp', 'thora', 'taken'], ['refused'], 'the terms carried');
    w.ok(!shows(w, 'thornmark', 'tm_brigands1') && !shows(w, 'thornmark', 'tm_brigands2'), 'the terms taken, the road\'s brigands stop coming');
    w.ok(there(w, THORA_WALL(), 'thornhold') && hear(w, 'thornhold', THORA_WALL()).startsWith('Thora is mending') && there(w, KERROW(), 'thornhold') && hear(w, 'thornhold', KERROW()).startsWith('The Armoury\'s smith'), 'Thora mends the north wall, and the smith hears the quiet road');
    toSeason(w, 'winter');
    w.ok(!shows(w, 'thornmark', 'tm_thora'), 'the terms taken, no band comes in the snow');
  }
  { // Terms From the Brigands: refused; her band comes in winter.
    const w = newWalk(ok);
    groveDone(w);
    hear(w, 'thornhold', SYLVANE());
    answerTo(w, 'thornmark', THORA(), 'No. Leave the road.');
    reads(w, 'terms', 'Terms From the Brigands', ['sylvane', 'thora', 'refused'], ['taken'], 'the terms refused');
    w.ok(!there(w, THORA(), 'thornmark') && !there(w, KERROW(), 'thornhold') && shows(w, 'thornmark', 'tm_brigands1'), 'refused, Thora is gone, the smith has nothing to say and the brigands still come');
    toSeason(w, 'summer');
    const summer = shows(w, 'thornmark', 'tm_thora');
    toSeason(w, 'winter');
    w.ok(!summer && shows(w, 'thornmark', 'tm_thora'), 'refused, her band stands at the camp in winter, and not in summer');
    w.ok(hear(w, 'thornhold', SYLVANE()).startsWith('"You told her no'), "Sylvane's after-lines are the refusal's");
  }
  { // How Did He Know (#214): asked for, the orders found in H3's fire-pit, and carried to the Watch.
    const w = newWalk(ok);
    meetWho(w, 'q_orders');
    w.ok(w.news.at(-1) === 'New quest: How Did He Know.' && !!page(w, 'orders')?.goal, `Idony's first meeting begins How Did He Know, with a goal (${w.news.at(-1)})`);
    walkThrough(w, 'thornmark', 8, 29, SOUTH, 'deepthorn_h3');
    see(w, 'deepthorn_h3:h3_survey');
    see(w, 'deepthorn_h3:h3_firepit');
    open(w, 'deepthorn_h3:h3_orders');
    w.ok(w.party.bag.includes('survey_orders') && page(w, 'orders')?.goal === 'Take the survey\'s orders to Idony at the Split Oak, in Thornhold.', `the orders found, the goal is Idony (${page(w, 'orders')?.goal})`);
    const gold = w.party.gold;
    w.ok(hear(w, 'thornhold', IDONY()).startsWith('Idony reads what the fire left') && w.party.gold === gold + 300 && !w.party.bag.includes('survey_orders'), 'Idony takes the orders, reads them and pays 300');
    answerTo(w, 'thornhold', IDONY(), 'Take them to the Watch.');
    reads(w, 'orders', 'How Did He Know', ['idony', 'camp', 'orders', 'watch'], ['council'], 'the orders to the Watch');
    w.ok(!there(w, IDONY(), 'thornhold'), 'the orders to the Watch, Idony is gone from the Split Oak');
  }
  { // How Did He Know: the orders brought unasked, and handed back for the Council.
    const w = newWalk(ok);
    open(w, 'deepthorn_h3:h3_orders');
    w.ok(hear(w, 'thornhold', IDONY()).startsWith('The Lantern in travel-grey looks at the burnt paper') && !w.party.flags.q_orders, 'Idony takes the orders brought unasked, with her early words, and does not hire');
    w.ok(w.news.at(-1) === 'New quest: How Did He Know.' && page(w, 'orders')?.goal === 'Answer Idony at the Split Oak: the orders to the Watch, or back to us?', `the orders read begin How Did He Know, with her question as its goal (${page(w, 'orders')?.goal})`);
    answerTo(w, 'thornhold', IDONY(), 'Give them back to us.');
    reads(w, 'orders', 'How Did He Know', ['orders', 'council'], ['idony', 'watch'], 'the orders kept for the Council');
    w.ok(w.party.bag.includes('survey_orders') && there(w, IDONY(), 'thornhold') && hear(w, 'thornhold', IDONY()).startsWith('"Still here.'), 'kept, the orders are back in the pack, and Idony stays with her after-line');
  }
  { // The Hunters' Bargain (#215): the yard's brambles cut down, Godric freed, and Sylvane told.
    const w = newWalk(ok);
    meetWho(w, 'q_grove');
    walkThrough(w, 'deepthorn_h3', 29, 23, EAST, 'deepthorn_i3');
    see(w, 'deepthorn_i3:i3_cellar');
    w.ok(!there(w, GODRIC(), 'deepthorn_i3'), 'while the brambles stand in the yard, Godric is behind the cellar door');
    w.level = 8;
    fight(w, 'deepthorn_i3:lodge_brambles');
    w.ok(there(w, GODRIC(), 'deepthorn_i3') && !shows(w, 'deepthorn_i3', 'i3_cellar'), 'the brambles cut down, Godric comes up from the cellar');
    answerTo(w, 'deepthorn_i3', GODRIC(), 'Sylvane will hear it.');
    w.ok(w.news.includes('New quest: The Hunters\' Bargain.') && page(w, 'hunters')?.goal === 'Tell Elder Sylvane in Thornhold what the lodge\'s hunters did.', `told, the goal is Sylvane (${page(w, 'hunters')?.goal})`);
    w.ok(hear(w, 'deepthorn_i3', GODRIC()).startsWith('"Tell her, then.'), 'before Sylvane hears it, Godric sends the company on, and does not meet it again');
    w.ok(hear(w, 'thornhold', SYLVANE()).startsWith('Sylvane hears it through'), 'Sylvane hears the lodge\'s part in it');
    reads(w, 'hunters', 'The Hunters\' Bargain', ['cellar', 'godric', 'told', 'shut'], ['kept'], 'Sylvane told');
    w.ok(hear(w, 'deepthorn_i3', GODRIC()).startsWith('"Word came.'), "Godric's after-lines are the gate shut's");
  }
  { // The Hunters' Bargain: the lodge's secret kept, and the blazed oak shown.
    const w = newWalk(ok);
    w.level = 8;
    fight(w, 'deepthorn_i3:lodge_brambles');
    const said = answerTo(w, 'deepthorn_i3', GODRIC(), 'We\'ll hold it.');
    w.ok(said.includes('blazed with three notches'), 'kept, Godric shows the hunters\' mark');
    reads(w, 'hunters', 'The Hunters\' Bargain', ['godric', 'kept'], ['told', 'shut'], 'the secret kept');
    w.ok(hear(w, 'deepthorn_i3', GODRIC()).startsWith('"Still here.') && !w.party.flags.q_hunters_shut, "Godric's after-lines are the secret kept's, and Sylvane shuts no gate");
  }
  { // The Mender: the camp found, the kit back, the tear shut and the Stone mended; the sliver carried.
    const w = newWalk(ok);
    w.ok(!shows(w, 'thornmark', 'tm_mender_camp') && !there(w, EDITH(), 'thornmark'), 'before the chisel, no camp is turned over and no Edith waits');
    groveDone(w);
    see(w, 'thornmark:tm_mender_camp');
    w.ok(w.news.at(-1) === 'New quest: The Mender.' && !!page(w, 'mender')?.goal, `the camp found begins The Mender, with a goal (${w.news.at(-1)})`);
    w.ok(hear(w, 'thornmark', EDITH()).startsWith('A Lantern in a Reader\'s grey sits') && !!w.party.flags.q_mender, 'Edith in the hollow asks for her kit');
    see(w, 'thornmark:tm_zealot_camp');
    open(w, 'thornmark:tm_kit');
    const gold = w.party.gold;
    w.ok(hear(w, 'thornmark', EDITH()).startsWith('Edith opens the case') && w.party.gold === gold + 400, 'Edith takes her kit and pays 400');
    w.ok(hear(w, 'thornmark', EDITH()).startsWith('"Still open') && !there(w, EDITH_STONE(), 'grove2'), 'the tear open, she waits in the hollow, not by the Stone');
    w.level = 8;
    fight(w, 'grove2:g2_warden');
    w.ok(!there(w, EDITH(), 'thornmark') && there(w, EDITH_STONE(), 'grove2') && !shows(w, 'grove2', 'g2_mended'), 'the tear shut, Edith is by the Stone, and it is not yet mended');
    const said = answerTo(w, 'grove2', EDITH_STONE(), 'We\'ll carry it.');
    w.ok(said.startsWith('"Then carry it near the skin') && w.party.bag.includes('grove_sliver'), 'the Stone mended, Edith hands over the sliver');
    reads(w, 'mender', 'The Mender', ['camp', 'edith', 'kit', 'mended', 'sliver'], ['left'], 'the sliver carried');
    w.ok(!there(w, EDITH_STONE(), 'grove2') && shows(w, 'grove2', 'g2_mended'), 'answered, Edith is gone and the Stone stands mended');
    w.ok(hear(w, 'thornhold', SYLVANE()).startsWith('"The Reader has mended it.'), 'Sylvane has heard the Stone is mended');
  }
  { // The Mender: the kit found first, brought to a Reader who never asked; the sliver left.
    const w = newWalk(ok);
    open(w, 'thornmark:tm_kit');
    groveDone(w);
    see(w, 'thornmark:tm_mender_camp');
    w.ok(hear(w, 'thornmark', EDITH()).startsWith('A Lantern in a Reader\'s grey stands up') && !w.party.flags.q_mender, 'Edith takes the kit brought unasked, with her early words, and does not hire');
    w.level = 8;
    fight(w, 'grove2:g2_warden');
    answerTo(w, 'grove2', EDITH_STONE(), 'Leave it with the Stone.');
    reads(w, 'mender', 'The Mender', ['camp', 'kit', 'mended', 'left'], ['edith', 'sliver'], 'the sliver left, the kit found first');
    w.ok(!w.party.bag.includes('grove_sliver'), 'and no sliver in the pack');
  }
  { // The Older Mark (#218): Sylvane's company asked for it in Henlys, the rubbing made on
    // Penspern's crown, and burnt.
    const w = newWalk(ok);
    groveDone(w);
    w.ok(hear(w, 'deepthorn_i4', SENARA()).includes('Sylvane sent you'), 'sent by Sylvane, Senara shows the seal');
    w.ok(hear(w, 'deepthorn_i4', SENARA()).includes('one more place that mark is') && w.news.at(-1) === 'New quest: The Older Mark.' && !!page(w, 'mark')?.goal, `Senara's ask begins The Older Mark, with a goal (${w.news.at(-1)})`);
    see(w, 'deepthorn_j5:j5_stone');
    see(w, 'deepthorn_j5:j5_rubbed');
    open(w, 'deepthorn_j5:j5_rubbing');
    w.ok(w.party.bag.includes('stone_rubbing') && page(w, 'mark')?.goal === 'Take the stone\'s rubbing to Senara, lorekeeper of Henlys.', `the rubbing made, the goal is Senara (${page(w, 'mark')?.goal})`);
    const gold = w.party.gold;
    w.ok(hear(w, 'deepthorn_i4', SENARA()).startsWith('Senara lays the rubbing on the treaty') && w.party.gold === gold + 150 && !w.party.bag.includes('stone_rubbing'), 'Senara takes the rubbing, lays it on the seal and pays 150');
    answerTo(w, 'deepthorn_i4', SENARA(), 'Burn it.');
    reads(w, 'mark', 'The Older Mark', ['senara', 'stone', 'shown', 'burnt'], ['kept'], 'the rubbing burnt');
    w.ok(hear(w, 'deepthorn_i4', SENARA()).startsWith('"Burnt.') && !w.party.bag.includes('stone_rubbing'), "burnt, Senara's after-lines are the ash's");
  }
  { // The Older Mark: asked again before the rubbing is made, Senara says only where the stone is.
    const w = newWalk(ok);
    hear(w, 'deepthorn_i4', SENARA());
    hear(w, 'deepthorn_i4', SENARA());
    w.ok(hear(w, 'deepthorn_i4', SENARA()).startsWith('"The stone on Penspern') && !!w.party.flags.q_mark, 'asked again before the rubbing, she says only where the stone is');
  }
  { // The Older Mark: the rubbing made before Senara has asked, or the treaty is seen, and kept.
    const w = newWalk(ok);
    open(w, 'deepthorn_j5:j5_rubbing');
    w.ok(hear(w, 'deepthorn_i4', SENARA()).startsWith('Senara sees what you carry') && !w.party.flags.q_mark && !w.party.flags.q_treaty, 'Senara takes the rubbing brought unasked, with her early words, and neither hires nor shows the treaty');
    w.ok(w.news.at(-1) === 'New quest: The Older Mark.' && page(w, 'mark')?.goal === 'Answer Senara in Henlys: burn the rubbing, or keep it?', `the rubbing shown begins The Older Mark, with her question as its goal (${page(w, 'mark')?.goal})`);
    answerTo(w, 'deepthorn_i4', SENARA(), 'We\'ll keep it.');
    reads(w, 'mark', 'The Older Mark', ['shown', 'kept'], ['senara', 'burnt'], 'the rubbing kept, made unasked');
    w.ok(w.party.bag.includes('stone_rubbing') && hear(w, 'deepthorn_i4', SENARA()).includes('No word from Sylvane') && !!w.party.flags.q_seal_unknown, 'kept, the rubbing is back in the pack, and her next words show the treaty');
    w.ok(hear(w, 'deepthorn_i4', SENARA()).startsWith('"You still have it.') && !w.party.flags.q_mark, 'then her after-lines are the kept rubbing\'s, and she never asks for one');
  }
  { // The Light on Penspern (#218): Kea at the fire by night, and the fire put out.
    const w = newWalk(ok);
    at(w, 12);
    w.ok(!there(w, KEA(), 'deepthorn_j5') && shows(w, 'deepthorn_j5', 'j5_stack_day') && !shows(w, 'deepthorn_j5', 'j5_stack_night') && !shows(w, 'deepthorn_j5', 'j5_landing'), 'by day the stack is cold and nobody is at it, and no boat lands');
    at(w, 0);
    w.ok(there(w, KEA(), 'deepthorn_j5') && shows(w, 'deepthorn_j5', 'j5_stack_night') && shows(w, 'deepthorn_j5', 'j5_landing'), 'by night Kea feeds the fire, and the Hand\'s boat lands under it');
    see(w, 'deepthorn_j5:j5_landing');
    answerTo(w, 'deepthorn_j5', KEA(), 'Put it out.');
    reads(w, 'light', 'The Light on Penspern', ['kea', 'landing', 'out'], ['kept'], 'the fire put out');
    w.ok(!shows(w, 'deepthorn_j5', 'j5_stack_night') && shows(w, 'deepthorn_j5', 'j5_stack_cold') && hear(w, 'deepthorn_j5', KEA()).startsWith('Kea sits by the cold stack'), 'put out, by night the stack is cold, and Kea\'s after-lines are the dark\'s');
    w.ok(!there(w, CENRIC(), 'deepthorn_j5') && shows(w, 'deepthorn_j5', 'j5_landing'), 'and no Wardens come, and the boat lands still');
  }
  { // The Light on Penspern: the fire kept, and Helmstow's Wardens come to watch it.
    const w = newWalk(ok);
    at(w, 0);
    w.ok(!there(w, CENRIC(), 'deepthorn_j5'), 'before the word to Helmstow, no Warden stands on the head');
    answerTo(w, 'deepthorn_j5', KEA(), 'Keep it, and warn Helmstow.');
    reads(w, 'light', 'The Light on Penspern', ['kea', 'kept'], ['out'], 'the fire kept');
    w.ok(shows(w, 'deepthorn_j5', 'j5_stack_night') && hear(w, 'deepthorn_j5', KEA()).startsWith('"They came.'), 'kept, the fire burns by night, and Kea\'s after-lines are the Wardens\'');
    w.ok(there(w, CENRIC(), 'deepthorn_j5') && hear(w, 'deepthorn_j5', CENRIC()).startsWith('A Warden sergeant stands on the crown'), 'by night Sergeant Cenric stands on the crown');
    at(w, 12);
    w.ok(there(w, CENRIC(), 'deepthorn_j5') && !there(w, KEA(), 'deepthorn_j5'), 'and by day, when Kea is gone');
  }
  { // Hale's Sergeant (#558): no sergeant while Hale holds the Scarth; once he is taken, Wystan at
    // the gate, the shore on H3's shingle, Wystan talked down to keep the Split Oak's door, and the
    // token known in the hold.
    const w = newWalk(ok);
    w.ok(!there(w, WYSTAN(), 'thornhold') && !shows(w, 'deepthorn_h3', 'h3_boat'), 'while Hale holds the Scarth there is no sergeant at the gate and nothing on the shingle');
    w.party.flags.q_hale_taken = 1;
    w.ok(there(w, WYSTAN(), 'thornhold') && !shows(w, 'deepthorn_h3', 'h3_boat'), 'once Hale is taken, Wystan stands at the gate, and the shingle shows nothing till he asks');
    hear(w, 'thornhold', WYSTAN());
    w.ok(w.news.at(-1) === 'New quest: Hale\'s Sergeant.' && /shingle below the camp/.test(page(w, 'sergeant')?.goal ?? ''), `Wystan's ask begins Hale's Sergeant, its goal the shore (${page(w, 'sergeant')?.goal})`);
    w.ok(hear(w, 'thornhold', WYSTAN()).startsWith('"The shingle below the camp.'), 'asked again before the shore, he says only where it is');
    see(w, 'deepthorn_h3:h3_boat');
    w.ok(/Wystan at Thornhold's gate/.test(page(w, 'sergeant')?.goal ?? ''), `the boat found, the goal is Wystan (${page(w, 'sergeant')?.goal})`);
    answerTo(w, 'thornhold', WYSTAN(), 'Don\'t ride.');
    reads(w, 'sergeant', 'Hale\'s Sergeant', ['wystan', 'shore', 'stays'], ['rides', 'hale'], 'talked down');
    w.ok(w.party.bag.includes('hale_token') && !there(w, WYSTAN(), 'thornhold') && there(w, WYSTAN_DOOR(), 'thornhold') && hear(w, 'thornhold', WYSTAN_DOOR()).includes('A door is a pass'),
      'talked down, he gives Hale\'s token and keeps the Split Oak\'s door');
    // In the Tide Ship's hold (#190), once its crew is down, Hale knows the token and leaves it.
    w.level = 14;
    fight(w, 'tide_ship3:ts3_crew');
    const freed = hear(w, 'tide_ship3', HALE());
    w.ok(freed.includes('The Regent got his copy') && freed.includes('Wystan') && !!w.party.flags.q_hale_freed && w.party.bag.includes('hale_token') && !!page(w, 'sergeant')?.entries.some((e) => e.id === 'hale'),
      'in the hold Hale knows his token, is freed and leaves it in the pack, and the log says so');
  }
  { // Hale's Sergeant: let ride, he gives the token and is gone.
    const w = newWalk(ok);
    w.party.flags.q_hale_taken = 1;
    hear(w, 'thornhold', WYSTAN());
    see(w, 'deepthorn_h3:h3_boat');
    answerTo(w, 'thornhold', WYSTAN(), 'Ride, then.');
    reads(w, 'sergeant', 'Hale\'s Sergeant', ['wystan', 'shore', 'rides'], ['stays', 'hale'], 'let ride');
    w.ok(w.party.bag.includes('hale_token') && !there(w, WYSTAN(), 'thornhold') && !there(w, WYSTAN_DOOR(), 'thornhold'), 'let ride, he gives Hale\'s token and is gone from Thornhold');
  }
  { // Hale's Sergeant: Hale freed with no token, and his words name none.
    const w = newWalk(ok);
    w.party.flags.q_hale_taken = 1;
    w.level = 14;
    fight(w, 'tide_ship3:ts3_crew');
    w.ok(!hear(w, 'tide_ship3', HALE()).includes('Wystan') && !!w.party.flags.q_hale_freed && !w.party.flags.q_sergeant_hale, 'with no token carried, Hale is freed and names none');
  }
  { // The Eldest (#218): awake whichever the company does first, beaten once, and its bough.
    const w = newWalk(ok);
    w.level = 8;
    fight(w, 'grove2:g2_warden');
    w.ok(shows(w, 'deepthorn_j5', 'j5_eldest') && !shows(w, 'deepthorn_j5', 'j5_heartwood'), 'the tear closed, the old wood sleeps but the Eldest stands at the tip');
    fight(w, 'deepthorn_j5:j5_eldest');
    w.ok(w.party.bag.includes('eldests_bough'), 'beaten, the Eldest lets fall its bough');
    w.world.state.minutes += 30 * 1440;
    w.world.travel('deepthorn_j5', 6, 18);
    w.ok(!w.world.liveGroups().some((g) => g.def.id === 'j5_eldest'), 'and a month on it is still asleep');
  }
}

/**
 * The prestiges taught here (#19): three firsts in Thornhold, each at a trade, and the Ranger's
 * second at the lodge's hide, off the road and the fights. Each is there from a new game; at 11 a
 * ranger, a cleric and a druid are sent to Thornhold and taught, and at 19 the ranger to the hide,
 * whether or not the hold's gate is shut to the hunters. The Druid's second (#439) is the elf at the
 * tip of the wood to the head, who comes out of the trees once the Grove Stone is mended.
 */
function trainers(ok: (cond: boolean, msg: string) => void): void {
  const def = (id: string) => MAP_DEFS.find((d) => d.id === id)!;
  const taught = (id: string) => (def(id).features ?? []).flatMap((f) => (f.kind === 'npc' && f.teaches ? [f.teaches] : []));
  const town = taught('thornhold'), lodge = taught('deepthorn_i3');
  ok(town.length === 3 && ['ranger', 'cleric', 'druid'].every((c) => town.some((t) => t.cls === c && t.prestige === 1)), 'Thornhold teaches the first prestige of the ranger, the cleric and the druid');
  ok(lodge.length === 1 && lodge[0].cls === 'ranger' && lodge[0].prestige === 2, 'the lodge\'s box teaches the Ranger\'s second');
  const at = (p: Person) => (def('thornhold').features ?? []).filter((f) => f.x === p.x && f.y === p.y && f.kind !== 'npc');
  const armoury = at(JAGO()).find((f) => f.kind === 'shop');
  ok(armoury?.kind === 'shop' && ['elfbow', 'crossbow'].every((id) => armoury.stock.includes(id)), 'the fletcher stands in the Armoury, which sells his bows');
  ok(at(DERWA()).some((f) => f.kind === 'temple'), 'the bone-setter stands in the Chapterhouse');
  ok(def('thornhold').rows[LOWEN().y][LOWEN().x] === ',' && !at(LOWEN()).length, 'the beekeeper stands in the street, and keeps no shop');
  const w = newWalk(ok);
  ok([JAGO(), DERWA(), LOWEN()].every((p) => there(w, p, 'thornhold')) && there(w, CUTHRED(), 'deepthorn_i3'), 'all four are there from a new game, the bowman before the yard is cut');
  w.world.travel('thornhold', 4, 10);
  ok(w.world.peopleAt(4, 10).includes(JAGO()) && w.world.peopleAt(11, 4).includes(DERWA()), 'the fletcher is met in the Armoury and the bone-setter in the Chapterhouse');
  ok([JAGO(), DERWA(), LOWEN(), CUTHRED()].every((p) => !!p.teaches?.seek?.includes(p.name.split(',')[0]) && p.teaches.seek.includes(PRESTIGES[p.teaches.cls].titles[p.teaches.prestige - 1])), 'each one\'s seeking names them and the title they give');

  // At 11: the premade ranger and cleric, and a druid who joins for the look ahead.
  const at11: Party = newWalk(ok).party;
  at11.members[5] = createCharacter('Tamar', 'elf', 'druid', {}, makeRng(11));
  for (const c of at11.members) { c.xp = xpForLevel(11); c.level = 11; }
  const sent = sought(questLog(w.world.state, at11)).find((p) => p.at === 'thornhold');
  const names = (cls: string[]) => cls.map((k) => at11.members.find((c) => c.cls === k)!.name);
  ok(names(['ranger', 'cleric', 'druid']).every((n) => sent?.who.includes(n)), `at 11 the ranger, the cleric and the druid are sent to Thornhold (${sent?.who.join(', ')})`);
  for (const p of [JAGO(), DERWA(), LOWEN()]) {
    const who = at11.members.findIndex((c) => c.cls === p.teaches!.cls);
    at11.gold = 1000;
    ok(teach(p.teaches!, at11, w.world.state, who).taught && prestigeOf(at11.members[who]) === 1 && at11.gold === 0
      && questLog(w.world.state, at11).find((v) => v.def.id === seekId(who, 1))?.done === true, `${p.name.split(',')[0]} makes ${/^[AEIOU]/.test(PRESTIGES[p.teaches!.cls].titles[0]) ? 'an' : 'a'} ${PRESTIGES[p.teaches!.cls].titles[0]} for 1,000 gold, and the seeking is done`);
  }

  // The second, off the beaten path: off the road and off the fights, and reached on foot.
  const i3 = def('deepthorn_i3'), c = CUTHRED();
  const road = i3.rows.flatMap((r, y) => [...r].flatMap((ch, x) => (ch === '=' ? [{ x, y }] : [])));
  ok(road.every((r) => Math.abs(r.x - c.x) + Math.abs(r.y - c.y) > 10), 'the bowman is more than ten squares off the road');
  ok(i3.encounters!.every((g) => Math.abs(g.x - c.x) + Math.abs(g.y - c.y) > 10), 'and more than ten squares from any group, so no trainer\'s door is a fight\'s doorstep');
  const map = new GameMap(i3), seen = new Set([`${i3.start.x},${i3.start.y}`]), q = [[i3.start.x, i3.start.y]];
  let reached = false;
  while (q.length && !reached) {
    const [x, y] = q.shift()!;
    reached = x === c.x && y === c.y;
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      if (!map.inBounds(nx, ny) || seen.has(`${nx},${ny}`) || map.at(nx, ny).door === 'secret') continue;
      const p = map.passable(nx, ny, { tide: 'low' });
      if (p === 'ok' || p === 'unlock') { seen.add(`${nx},${ny}`); q.push([nx, ny]); }
    }
  }
  ok(reached, 'the bowman is reached on foot from the box\'s way in, by no secret door');

  // At 19, with the hold's gate shut to the hunters: the ranger is sent to the hide all the same.
  const at19: Party = w.party;
  for (const m of at19.members) { m.xp = xpForLevel(19); m.level = 19; }
  const ranger = at19.members.findIndex((m) => m.cls === 'ranger');
  takePrestige(at19.members[ranger]);
  at19.flags.q_hunters_shut = 1;
  ok(!!sought(questLog(w.world.state, at19)).find((p) => p.at === 'deepthorn_i3')?.who.includes(at19.members[ranger].name), 'at 19 the ranger is sent to the lodge\'s box');
  at19.gold = 4000;
  ok(there(w, c, 'deepthorn_i3') && teach(c.teaches!, at19, w.world.state, ranger).taught && prestigeOf(at19.members[ranger]) === 2 && at19.gold === 0,
    `with the gate shut to the hunters, the bowman still makes a ${PRESTIGES.ranger.titles[1]} for 4,000 gold`);

  // The Druid's second, at the tip of the wood to the head (DESIGN §5): the elf comes out of the trees
  // once the Grove Stone is mended, when the rootwalkers beside her sleep, since the mending needs the
  // tear shut; she is reached on foot by no secret door, and at 19 the druid is sent to her and taught.
  const i5 = def('deepthorn_i5'), elf = who('deepthorn_i5', 30, 18, 'Hendar');
  ok(taught('deepthorn_i5').length === 1 && elf.teaches?.cls === 'druid' && elf.teaches.prestige === 2, 'the wood to the head teaches the Druid\'s second');
  ok(!!elf.teaches?.seek?.includes('Hendar') && elf.teaches.seek.includes(PRESTIGES.druid.titles[1]), 'her seeking names her and the title she gives');
  const edith = (def('grove2').features ?? []).find((f) => f.kind === 'npc' && f.flag === 'q_mender_done');
  const roots = i5.encounters!.find((g) => g.id === 'i5_rootwalkers');
  ok(JSON.stringify(roots?.until) === JSON.stringify(TEAR_CLOSED) && edith?.kind === 'npc' && JSON.stringify(edith.after).includes('grove2:g2_warden'),
    'the rootwalkers at the tip sleep once the tear is shut, which the mending needs');
  const mended = newWalk(ok);
  ok(!there(mended, elf, 'deepthorn_i5'), 'she is not there from a new game');
  mended.party.flags.q_mender_done = 1;
  ok(there(mended, elf, 'deepthorn_i5'), 'once the Grove Stone is mended, she has come out of the trees');
  const map5 = new GameMap(i5), seen5 = new Set([`${i5.start.x},${i5.start.y}`]), q5 = [[i5.start.x, i5.start.y]];
  let found = false;
  while (q5.length && !found) {
    const [x, y] = q5.shift()!;
    found = x === elf.x && y === elf.y;
    for (const [nx, ny] of [[x + 1, y], [x - 1, y], [x, y + 1], [x, y - 1]]) {
      if (!map5.inBounds(nx, ny) || seen5.has(`${nx},${ny}`) || map5.at(nx, ny).door === 'secret') continue;
      const p = map5.passable(nx, ny, { tide: 'low' });
      if (p === 'ok' || p === 'unlock') { seen5.add(`${nx},${ny}`); q5.push([nx, ny]); }
    }
  }
  ok(found, 'she is reached on foot from the box\'s way in, by no secret door');
  const druids: Party = mended.party;
  druids.members[5] = createCharacter('Tamar', 'elf', 'druid', {}, makeRng(11));
  for (const m of druids.members) { m.xp = xpForLevel(19); m.level = 19; }
  takePrestige(druids.members[5]);
  ok(!!sought(questLog(mended.world.state, druids)).find((p) => p.at === 'deepthorn_i5')?.who.includes('Tamar'), 'at 19 the druid is sent to the wood to the head');
  druids.gold = 4000;
  ok(teach(elf.teaches!, druids, mended.world.state, 5).taught && prestigeOf(druids.members[5]) === 2 && druids.gold === 0,
    `she makes a ${PRESTIGES.druid.titles[1]} for 4,000 gold`);
}
