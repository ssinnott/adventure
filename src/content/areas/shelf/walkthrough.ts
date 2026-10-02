// The Foreland's walkthrough: its chapter of the one quest, The Quiet Farm, played from a new game by
// the game's own moves and checked a step at a time (tools/walk.ts); Thornmark's plays the chain.
// Then a new company walks out of Helmstow to the Lodestone, and Gytha gives it the lesson, and
// her later words as Thornhold's news reaches her. Then its side quests, each choice both ways: the
// log reads true and the people stand where it says. Last, Helmstow before and after Act II (#157).
import type { Walkthrough } from '../../area.ts';
import { CHAPTER } from './chapter.ts';
import { newWalk, meetWho, walkThrough, see, fight, playChapter, quest, listen } from '../../../../tools/walk.ts';
import type { Step, Walk } from '../../../../tools/walk.ts';
import { EAST, NORTH, SOUTH, WEST } from '../../../game/types.ts';
import { wrap } from '../../../ui/draw.ts';
import { SAY_W, SAY_LINES, logLines } from '../../../ui/frame.ts';
import { MAP_DEFS, MONSTERS } from '../../index.ts';
import { xpForLevel } from '../../../game/party.ts';
import { priceIn } from '../../../game/items.ts';
import { meet, answer, heard, readText } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { questLog } from '../../../game/quests.ts';
import { GameMap } from '../../../game/map.ts';
import type { PageView } from '../../../game/quests.ts';

/** Vask hires the company: before the chapter, or its last step for a company that came early. */
export const HIRE: Step = { name: 'the hire', play: (w) => meetWho(w, 'q_ashcombe') };

/** At Crowness Light: the keeper met, and his log opened and read from the pack. */
function crowness(w: Walk): void {
  meetWho(w, 'q_keeper');
  open(w, 'downs_e3:e3_log');
  w.ok(w.party.bag.includes('keepers_log') && (readText('keepers_log') ?? []).length === 5, "the keeper's log is on the cottage table, and reads from the pack");
}

/** The chapter once hired: Gullwick, the farm and its cellar, Crowness on along the road, and the wand taken back. */
export const STEPS: readonly Step[] = [
  { name: 'to Gullwick', play: (w) => meetWho(w, 'q_wenna') },
  { name: 'to Ashcombe', play: (w) => walkThrough(w, 'downs_e3', 20, 4, EAST, 'mill') },
  { name: 'the cellar', play: (w) => {
    // Walked at its floor, 2, where the gate tunes its Warden to about half (#87), before Crowness at 3.
    w.ok(w.level === 2, `the cellar is walked at level 2, its floor (${w.level})`);
    see(w, 'mill:mill_lantern'); fight(w, 'mill:m_warden'); see(w, 'mill:mill_core');
  } },
  { name: 'to Crowness', play: crowness },
  { name: 'the wand', play: (w) => meetWho(w, 'survey_wand') },
];

/**
 * The farm first and the wand straight back from the cellar, Gullwick and Crowness last: against
 * the goal, which asks for Crowness before Helmstow, so the wand is handed over in the cellar's step
 * and not as a step of its own. Then the chapter's goals send the company to Hild, then the keeper.
 */
export const FARM_FIRST: readonly Step[] = [STEPS[1], {
  name: 'the cellar, and the wand straight back',
  play: (w) => {
    STEPS[2].play(w);
    const vask = MAP_DEFS.find((d) => d.id === 'keep')?.features?.find((f): f is Person => f.kind === 'npc' && [f.flag ?? []].flat().includes('q_ashcombe'));
    if (vask) { w.world.travel('keep', vask.x, vask.y); meet(vask, w.party, heard(w.world, vask)); listen(w); }
    w.ok(!!w.party.flags.q_ashcombe_done, 'the wand taken straight back to Vask, before Crowness');
  },
}, {
  name: 'to Gullwick, the farm done',
  play: (w) => {
    const goal = quest(w)?.goal ?? '';
    w.ok(goal.startsWith('Gullwick'), `the farm done first, the goal is Gullwick (${goal})`);
    meetWho(w, 'q_wenna');
  },
}, {
  name: 'to Crowness, the farm done',
  play: (w) => {
    const goal = quest(w)?.goal ?? '';
    w.ok(goal.startsWith('Crowness Light'), `the farm and Gullwick done first, the goal is Crowness Light (${goal})`);
    crowness(w);
  },
}];

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
  berth(w);

  lodestone(newWalk(ok), 'a new company');
  // A company Sylvane has spoken to before it comes by still gets the lesson first.
  const late = newWalk(ok);
  meetWho(late, 'q_grove');
  const g = gytha();
  ok(g !== undefined && meet(g, late.party, heard(late.world, g)).text.includes("That's a Stone, whole.") && /Cut\. With tools\./.test(meet(g, late.party, heard(late.world, g)).text),
    'Sylvane met first: Gytha gives the lesson, and then the cut\'s words');

  sideQuests(ok);
  haleGone(ok);
  walkWorth(ok);
  homecoming(ok);
};

/**
 * Down into the Berth from the chalk of D2 at its floor, past the guard two by two to the bier: the
 * Queen seen writes the chapter's step (#70), and the captain behind her is won there.
 */
function berth(w: Walk): void {
  walkThrough(w, 'downs_d2', 13, 12, WEST, 'berth');
  w.level = MAP_DEFS.find((d) => d.id === 'berth')!.band![0];
  for (const g of ['berth_guard1', 'berth_guard2', 'berth_guard3', 'berth_guard4']) fight(w, `berth:${g}`);
  see(w, 'berth:berth_bier');
  fight(w, 'berth:berth_captain');
  const ids = quest(w)?.pages.find((p) => p.def === CHAPTER)?.entries.map((e) => e.id) ?? [];
  w.ok(ids.includes('berth'), `the Queen on her bier in the Berth writes the chapter's step (${ids.join(', ')})`);
  // None of them comes back (EXPANSION §5.1): two days on, the captain and his guard are still dead.
  w.world.advance(2 * 1440);
  const back = w.world.liveGroups().map((g) => g.def.id).filter((id) => id.startsWith('berth_'));
  w.ok(back.length === 0, `two days on, the Berth's captain and its four pairs of guards stay dead${back.length ? ' -> ' + back.join(', ') : ''}`);
}

/**
 * The walk to Ashcombe (#87), once, and what it pays a member of six: the Foreland map's groups,
 * F2's and F3's by day and the farm's rats. It is worth level 2 and not 3, where the Foreland map
 * alone was not worth 2: the first job is earned on the road to it.
 */
function walkWorth(ok: (cond: boolean, msg: string) => void): void {
  const xp = (map: string, keep: (e: { id: string; when?: unknown }) => boolean = () => true): number =>
    (MAP_DEFS.find((d) => d.id === map)?.encounters ?? []).filter(keep).flatMap((e) => e.monsters).reduce((t, m) => t + MONSTERS[m].xp, 0);
  const foreland = Math.floor(xp('shelf') / 6);
  const walk = Math.floor((xp('shelf') + xp('downs_f2', (e) => !e.when) + xp('downs_f3', (e) => !e.when) + xp('downs_e3', (e) => e.id === 'farm_rats')) / 6);
  ok(walk >= xpForLevel(2) && walk < xpForLevel(3) && foreland < xpForLevel(2),
    `the walk to Ashcombe is worth level 2: ${walk} xp a member (level 2 at ${xpForLevel(2)}, 3 at ${xpForLevel(3)}), where the Foreland map alone is ${foreland}`);
  // On the way out of the Foreland, the one place outside Helmstow that sells food.
  const shop = (map: string) => MAP_DEFS.find((d) => d.id === map)?.features?.find((f) => f.kind === 'shop');
  const farm = shop('shelf'), mottram = shop('harrow');
  ok(farm?.kind === 'shop' && farm.name === 'Ellerby Farm' && farm.interior === 'farm_kitchen' && priceIn(farm, 'rations') === 3 && mottram?.kind === 'shop' && priceIn(mottram, 'rations') === 4,
    `Ellerby's farm store sells rations at 3 gold, in the farm kitchen, and Mottram's still at 4 (${farm?.kind === 'shop' ? priceIn(farm, 'rations') : 'no store'}, ${mottram?.kind === 'shop' ? priceIn(mottram, 'rations') : 'no shop'})`);
}

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
const HOB = (): Person => who('harrow', 4, 4, 'Hob'), HOB_GULLWICK = (): Person => who('downs_f3', 7, 14, 'Hob');
const MOTTRAM = (): Person => who('harrow', 4, 10, 'Mottram'), ALWIN = (): Person => who('harrow', 9, 1, 'Alwin');
const OSMUND = (): Person => who('harrow', 11, 4, 'Osmund'), AILITH_WOOD = (): Person => who('shelf', 2, 14, 'Ailith'), AILITH_HOLD = (): Person => who('thornhold', 11, 4, 'Ailith');

const WAT = (): Person => who('downs_f3', 11, 14, 'Wat'), HAMO = (): Person => who('downs_f3', 0, 9, 'Hamo');
const ALDRED = (): Person => who('downs_e3', 18, 28, 'Aldred'), VASK = (): Person => who('keep', 7, 4, 'Lord Aumery Vask');

/** Whether a four-way walk from `from` reaches `to` on `map` without stepping on `shut`. */
function around(map: string, shut: Person, from: readonly [number, number], to: Person): boolean {
  const m = new GameMap(MAP_DEFS.find((d) => d.id === map)!), seen = new Set([from.join()]), q: [number, number][] = [[from[0], from[1]]];
  while (q.length) {
    const [x, y] = q.shift()!;
    if (x === to.x && y === to.y) return true;
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) {
      const nx = x + dx, ny = y + dy, k = `${nx},${ny}`;
      if (seen.has(k) || (nx === shut.x && ny === shut.y) || m.passable(nx, ny) !== 'ok') continue;
      seen.add(k); q.push([nx, ny]);
    }
  }
  return false;
}

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

/** Whether the lamp room at Crowness shows its dark words or its lit ones now. */
const lamp = (w: Walk): string => {
  const e = MAP_DEFS.find((d) => d.id === 'downs_e3')!.features!.filter((f) => f.kind === 'event' && f.id.startsWith('e3_lamp_'));
  return e.filter((f) => w.world.present(f)).map((f) => (f as { id: string }).id).join() || 'none';
};

/** Oil for the Lamp to Mottram's question: Aldred first, then Mottram, who hires for the well first. */
function oilAsked(w: Walk): void {
  w.ok(lamp(w) === 'e3_lamp_dark', `before the oil, the lamp room is dark (${lamp(w)})`);
  w.ok(hear(w, 'downs_e3', ALDRED()).startsWith('The lamp room at the top of the tower is dark') && w.news.at(-1) === 'New quest: Oil for the Lamp.' && !!page(w, 'oil')?.goal,
    `Aldred's first meeting begins Oil for the Lamp, with a goal (${w.news.at(-1)})`);
  w.ok(hear(w, 'downs_e3', ALDRED()).startsWith('"Still dark.'), "then, while it is dark, his words of the second light");
  w.ok(hear(w, 'harrow', MOTTRAM()).startsWith('Mottram sets a bucket') && !!w.party.flags.q_well, 'Aldred met first, Mottram still hires for the well at the first meeting');
}

/** Who Lived at Ashcombe to the key in hand: the kitchen at the farmhouse's back and its chest. */
function keyFound(w: Walk): void {
  see(w, 'downs_e3:ash_kitchen');
  w.ok(w.world.used('ash_kitchen'), 'the kitchen is seen and its words said');
  open(w, 'downs_e3:ash_hearth');
  w.ok(w.party.bag.includes('hearth_key'), 'the kitchen chimney holds the hearth-key');
}

/** The paper in hand: the crock beside the kitchen and its chest. */
function paperFound(w: Walk): void {
  see(w, 'downs_e3:ash_crock');
  w.ok(w.world.used('ash_crock'), 'the crock is lifted and its words said');
  open(w, 'downs_e3:ash_crock_c');
  w.ok(w.party.bag.includes('tenant_paper'), "under the crock is the tenant's paper");
}

/** Who Lived at Ashcombe to the paper in hand: Hob hires, takes his key and talks; the paper found. */
function tenantAsked(w: Walk): void {
  meetWho(w, 'q_ashcombe_who');
  w.ok(w.news.at(-1) === 'New quest: Who Lived at Ashcombe.' && !!page(w, 'tenant')?.goal, `Hob's first meeting begins Who Lived at Ashcombe, with a goal (${w.news.at(-1)})`);
  keyFound(w);
  const told = hear(w, 'harrow', HOB());
  w.ok(told.startsWith('Hob looks at the hearth-key') && !w.party.bag.includes('hearth_key') && !!w.party.flags.q_hob_key, 'Hob takes his key and says who took his cellar');
  w.ok(hear(w, 'harrow', HOB()).startsWith('"Still here.'), 'met again, he is still here');
  paperFound(w);
}

function sideQuests(ok: (cond: boolean, msg: string) => void): void {
  { // Oil for the Lamp: bought and carried down. The lamp is lit, and both have heard.
    const w = newWalk(ok);
    oilAsked(w);
    w.ok(answerWho(w, 'q_well', 'We\'ll buy the oil.').startsWith('"Sensible.'), 'bought: Mottram will sell the oil');
    w.ok(page(w, 'oil')?.goal?.startsWith('Buy a flask') === true, `bought: the goal is the flask (${page(w, 'oil')?.goal})`);
    w.party.bag.push('lantern_oil'); // from Mottram's shelf, at 40
    w.ok(page(w, 'oil')?.goal?.startsWith('Carry the Lantern Oil') === true, `with the oil in the pack, the goal is Aldred (${page(w, 'oil')?.goal})`);
    w.ok(hear(w, 'downs_e3', ALDRED()).startsWith('Aldred takes the flask') && !w.party.bag.includes('lantern_oil'), 'bought: Aldred takes the flask and lights the lamp');
    reads(w, 'oil', 'Oil for the Lamp', ['aldred', 'buy', 'lit'], ['vask', 'order'], 'bought');
    w.ok(lamp(w) === 'e3_lamp_lit', `bought: the lamp room is lit (${lamp(w)})`);
    w.ok(hear(w, 'downs_e3', ALDRED()).startsWith('The lamp turns overhead, and Aldred has the look'), "bought: Aldred's after-lines are the company's oil");
    w.ok(hear(w, 'harrow', MOTTRAM()).startsWith('"Lit, is it?') && hear(w, 'harrow', MOTTRAM()).startsWith('Mottram sets a bucket'), 'bought: Mottram has heard, says so once, and then as before');
  }
  { // Oil for the Lamp: put to Vask. His order lights it; Aldred and Mottram say what it cost.
    const w = newWalk(ok);
    oilAsked(w);
    answerWho(w, 'q_well', 'We\'ll put it to Vask.');
    w.ok(page(w, 'oil')?.goal?.startsWith('Put the keeper\'s oil to Lord Vask') === true, `put to Vask: the goal is Vask (${page(w, 'oil')?.goal})`);
    w.ok(hear(w, 'keep', VASK()).startsWith('Vask hears you out') && !!w.party.flags.q_oil_lit, 'put to Vask: he lifts the order, and the lamp is lit');
    w.ok(hear(w, 'keep', VASK()).startsWith('A tall man in Warden grey'), 'put to Vask: his words are said once');
    reads(w, 'oil', 'Oil for the Lamp', ['aldred', 'vask', 'order', 'lit'], ['buy'], 'put to Vask');
    w.ok(lamp(w) === 'e3_lamp_lit', `put to Vask: the lamp room is lit (${lamp(w)})`);
    w.ok(hear(w, 'downs_e3', ALDRED()).startsWith('The lamp turns overhead. Aldred does not look up'), "put to Vask: Aldred's after-lines are the Crown's");
    w.ok(hear(w, 'harrow', MOTTRAM()).startsWith('"The sergeant came back') && hear(w, 'harrow', MOTTRAM()).startsWith('Mottram sets a bucket'), 'put to Vask: Mottram has seen the sergeant back for his paper, says so once, and then as before');
  }
  { // Oil for the Lamp: put to Vask, but the oil carried in first. The company lit it, and the order's words lapse.
    const w = newWalk(ok);
    oilAsked(w);
    answerWho(w, 'q_well', 'We\'ll put it to Vask.');
    w.party.bag.push('lantern_oil');
    hear(w, 'downs_e3', ALDRED());
    w.ok(hear(w, 'keep', VASK()).startsWith('A tall man in Warden grey') && !w.party.flags.q_oil_order, 'put to Vask, then lit with oil carried in: Vask has nothing to lift');
    reads(w, 'oil', 'Oil for the Lamp', ['aldred', 'vask', 'lit'], ['buy', 'order'], 'put to Vask, lit with oil');
    w.ok(hear(w, 'downs_e3', ALDRED()).startsWith('The lamp turns overhead, and Aldred has the look'), "and Aldred's after-lines are the company's oil");
  }
  { // Oil for the Lamp: oil carried in at the first meeting. Aldred takes it, and never asks.
    const w = newWalk(ok);
    w.party.bag.push('lantern_oil'); // found in Thornmark, or bought at Thornhold
    w.ok(hear(w, 'downs_e3', ALDRED()).startsWith('Aldred takes the flask') && !w.party.flags.q_keeper && !w.party.flags.q_oil, 'carried in: Aldred takes the flask at the first meeting, and asks nothing');
    reads(w, 'oil', 'Oil for the Lamp', ['lit'], ['aldred', 'buy', 'vask', 'order'], 'carried in');
    w.ok(lamp(w) === 'e3_lamp_lit' && hear(w, 'downs_e3', ALDRED()).startsWith('The lamp turns overhead, and Aldred has the look'), 'carried in: the lamp room is lit, and his after-lines are the company\'s oil');
  }
  { // The Boat: nobody who buys the boards stands where every way home from the hoard must pass.
    const w = newWalk(ok);
    w.ok(around('downs_f3', HAMO(), [1, 14], WAT()), 'the boards go home from the hoard to Wat by a way that never steps on Hamo');
  }
  { // The Boat: the boards home to Wat. Hamo has heard, and Wat's after-lines are home's.
    const w = newWalk(ok);
    w.ok(hear(w, 'downs_f3', WAT()).startsWith('An old man sits') && w.news.at(-1) === 'New quest: A Boat With No Name-Board.', 'Wat begins the Boat');
    see(w, 'downs_f3:f3_hoard');
    open(w, 'downs_f3:f3_hoard_chest');
    w.ok((readText('customs_chit') ?? []).length === 2 && w.party.bag.includes('name_boards'), 'the hoard holds the boards, and the chit reads from the pack');
    const gold = w.party.gold;
    w.ok(hear(w, 'downs_f3', WAT()).startsWith('Wat turns the board over') && w.party.gold === gold + 60, 'home: Wat takes the boards and pays 60');
    reads(w, 'board', 'A Boat With No Name-Board', ['wat', 'hoard', 'chit', 'home'], ['sold'], 'home');
    w.ok(hear(w, 'downs_f3', HAMO()).startsWith('"I heard the boards went up') && hear(w, 'downs_f3', WAT()).startsWith('"Up in the loft'), "home: Hamo has heard, and Wat's after-lines are home's");
  }
  { // The Boat: the boards sold to Hamo. Wat knows, and Hamo's after-lines are the sale's.
    const w = newWalk(ok);
    hear(w, 'downs_f3', WAT());
    see(w, 'downs_f3:f3_hoard');
    open(w, 'downs_f3:f3_hoard_chest');
    const gold = w.party.gold;
    w.ok(hear(w, 'downs_f3', HAMO()).startsWith('Hamo counts the coin') && w.party.gold === gold + 140, 'sold: Hamo takes the boards and pays 140');
    reads(w, 'board', 'A Boat With No Name-Board', ['wat', 'hoard', 'chit', 'sold'], ['home'], 'sold');
    w.ok(hear(w, 'downs_f3', WAT()).startsWith('"You sold them."') && hear(w, 'downs_f3', HAMO()).startsWith('"Still here.'), "sold: Wat knows, and Hamo's after-lines are the sale's");
  }
  { // The Boat: the hoard first. The chest begins it, and Wat takes the boards at the first meeting.
    const w = newWalk(ok);
    open(w, 'downs_f3:f3_hoard_chest');
    w.ok(w.news.at(-1) === 'New quest: A Boat With No Name-Board.', 'the hoard first begins the Boat');
    w.ok(hear(w, 'downs_f3', WAT()).startsWith('Wat turns the board over'), 'the hoard first: Wat takes the boards at the first meeting');
    reads(w, 'board', 'A Boat With No Name-Board', ['hoard', 'chit', 'home'], ['wat', 'sold'], 'the hoard first');
  }
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
    at(w, 12);
    w.ok(!shows(w, 'well_swept'), 'the Wardens told, by day the gatehouse is not swept');
    at(w, 0);
    w.ok(!there(w, ALWIN(), 'harrow') && !shows(w, 'well_cart'), 'the Wardens told, by night Alwin and the cart are gone');
    see(w, 'harrow:well_swept');
    w.ok(w.world.used('well_swept'), 'and the gatehouse is swept');
    w.ok(hear(w, 'harrow', MOTTRAM()).startsWith('"Still iron." He does not offer'), "Mottram's after-lines are the Wardens'");
    const first = hear(w, 'harrow', OSMUND()), then = hear(w, 'harrow', OSMUND());
    w.ok(first.startsWith('A thin man in a leather apron') && then.startsWith('A thin man in a leather apron') && !w.party.flags.q_osmund_well, 'and Osmund, met twice, has nothing written');
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
  { // The paper to Vask: he pays; Hob is gone from the inn, and his empty chair is said once.
    const w = newWalk(ok);
    w.ok(!there(w, HOB_GULLWICK(), 'downs_f3'), 'before the paper is given, Hob is not at Gullwick');
    tenantAsked(w);
    const gold = w.party.gold;
    meetWho(w, 'q_paper_vask');
    w.ok(w.party.gold === gold + 50 && !w.party.bag.includes('tenant_paper') && !w.party.flags.q_ashcombe_done, 'Vask takes the paper, without the wand, and pays 50');
    reads(w, 'tenant', 'Who Lived at Ashcombe', ['hob', 'kitchen', 'key', 'paper', 'vask'], ['hale'], 'the paper to Vask');
    w.ok(!there(w, HOB(), 'harrow') && !there(w, HOB_GULLWICK(), 'downs_f3'), 'the paper to Vask, Hob is gone from the inn and not at Gullwick');
    see(w, 'harrow:hob_chair');
    const again = (w.world.travel('harrow', 4, 4), w.world.eventsHere());
    w.ok(w.world.used('hob_chair') && again.length === 0, 'and his empty chair is said once');
  }
  { // The paper to Hale: he takes it as his third hand-in and pays; Hob is gone, and no chair is said.
    const w = newWalk(ok);
    tenantAsked(w);
    const gold = w.party.gold;
    meetWho(w, 'q_paper_hale');
    w.ok(w.party.gold === gold + 50 && !w.party.bag.includes('tenant_paper') && !w.party.flags.q_greywater_done, 'Hale takes the paper, without the ledger, and pays 50');
    reads(w, 'tenant', 'Who Lived at Ashcombe', ['hob', 'kitchen', 'key', 'paper', 'hale'], ['vask'], 'the paper to Hale');
    w.ok(!there(w, HOB(), 'harrow') && there(w, HOB_GULLWICK(), 'downs_f3'), 'the paper to Hale, Hob is gone from the inn and on the shingle at Gullwick');
    w.ok(hear(w, 'downs_f3', HOB_GULLWICK()).startsWith('Hob is on the shingle at Gullwick'), 'where he says he stayed');
    see(w, 'harrow:hob_chair');
    w.ok(!w.world.used('hob_chair'), 'and no empty chair is said');
  }
  { // The crock alone, the paper to Vask: nothing on the way names Hob, and the kitchen after writes nothing.
    const w = newWalk(ok);
    paperFound(w);
    meetWho(w, 'q_paper_vask');
    reads(w, 'tenant', 'Who Lived at Ashcombe', ['paper', 'vask'], ['hob', 'kitchen', 'key', 'hale'], 'the crock alone, the paper to Vask');
    w.ok(!page(w, 'tenant')?.entries.some((e) => e.text.includes('Hob')), 'and its journal does not name Hob, whom the company never met');
    see(w, 'downs_e3:ash_kitchen');
    w.ok(!w.world.used('ash_kitchen') && !page(w, 'tenant')?.entries.some((e) => e.id === 'kitchen'), 'the kitchen stepped into after the paper is given is not said, and writes nothing');
  }
  { // The key brought to Hob before he is heard: the hand-in begins the quest, and his after-lines follow.
    const w = newWalk(ok);
    keyFound(w);
    const told = hear(w, 'harrow', HOB());
    w.ok(told.startsWith('Hob looks at the hearth-key') && w.news.at(-1) === 'New quest: Who Lived at Ashcombe.' && !!page(w, 'tenant')?.goal, `Hob given his key unasked takes it and begins Who Lived at Ashcombe, with a goal (${w.news.at(-1)})`);
    w.ok(hear(w, 'harrow', HOB()).startsWith('"Still here.'), 'met again, he is still here');
    paperFound(w);
    meetWho(w, 'q_paper_vask');
    reads(w, 'tenant', 'Who Lived at Ashcombe', ['kitchen', 'key', 'paper', 'vask'], ['hob', 'hale'], 'the paper to Vask, Hob never hired');
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

// ---- Helmstow between acts (#157) ----

/**
 * Helmstow before Act II is done and after (`q_salt_done`, which Vask's answer at Lantern Watch sets):
 * the old city, then the changed one to the default company, whose paladin Idris is orcblood, and
 * to one without him. The flag is set by hand, since Helmstow's band refuses a company of 16 on the
 * road (sunderwood.md §9, 6). Either company gets in, and the shops and trainers stay.
 */
/** The Cargo Ledger found in Brandy Hole and given to Hale, as his first hand-in. */
export function ledgerGiven(w: Walk): void {
  open(w, 'greywater2:gw2_ledger');
  meetWho(w, 'q_greywater_done');
  w.ok(!!w.party.flags.q_greywater_done && !w.party.bag.includes('greywater_ledger'), 'Hale takes the ledger');
}

const HALE = (): Person => who('shelf', 29, 8, 'Captain Hale'), STRANGERS = (): Person => who('shelf', 29, 8, 'two Wardens');

/** Down the Edge into the Delta, by the Salt Road: what the first step there says. */
function intoTheDelta(w: Walk): string[] {
  w.world.travel('downs_d4', 1, 30, SOUTH);
  const said: string[] = [];
  for (let i = 0; i < 3 && w.world.zone?.id !== 'delta_d5'; i++) { const r = w.world.move('forward'); if (r.kind === 'moved') said.push(...r.messages); }
  listen(w);
  return said;
}

/**
 * Hale gone from the Scarth (#156): the ledger given and the Delta set foot in, two strangers in
 * Warden grey hold the pass, warn nothing and take Dunstan's letter; the pass is walked as before.
 * The Delta first, or the ledger kept, and Hale is there.
 */
function haleGone(ok: (cond: boolean, msg: string) => void): void {
  { // The Delta before the ledger: nothing is seen on the Edge, and Hale still holds the Scarth.
    const w = newWalk(ok);
    const said = intoTheDelta(w);
    w.ok(!said.some((m) => m.includes('two riders in Warden grey')) && !w.party.flags.q_hale_taken, 'into the Delta before Hale has the ledger, nothing goes over the Edge');
    w.ok(there(w, HALE(), 'shelf') && !there(w, STRANGERS(), 'shelf'), 'and Hale holds the Scarth');
  }
  const w = newWalk(ok);
  // Dunstan writes to Hale, and the letter is carried no further than the pack.
  meetWho(w, 'q_riders');
  at(w, 0);
  see(w, 'downs_e2:e2_riders');
  answerWho(w, 'q_riders', 'Write to Hale.');
  w.ok(w.party.bag.includes('dunstan_letter'), 'Dunstan writes to Hale, and gives the company the letter');
  meetWho(w, 'q_seal');
  sealFound(w);
  ledgerGiven(w);
  w.ok(there(w, HALE(), 'shelf') && !there(w, STRANGERS(), 'shelf'), 'the ledger given, Hale holds the Scarth until the company is down the Edge');
  const said = intoTheDelta(w);
  w.ok(said.some((m) => m.includes('two riders in Warden grey')) && !!w.party.flags.q_hale_taken, `into the Delta, two riders go over the Edge towards the Scarth, and Hale is taken (${said.join(' | ')})`);
  w.ok(!intoTheDelta(w).some((m) => m.includes('Warden grey')), 'down the Edge again, they are not seen again');
  w.ok(page(w, 'riders')?.goal === 'Take Dunstan\'s letter to the Scarth.' && page(w, 'seal')?.goal === 'Take the seal to Maud at the Gilded Eel.', `Hale gone, the letter goes to the Scarth and the seal to Maud (${page(w, 'riders')?.goal}; ${page(w, 'seal')?.goal})`);
  w.ok(!there(w, HALE(), 'shelf') && there(w, STRANGERS(), 'shelf'), 'Hale is gone from the Scarth, and two strangers in Warden grey hold it');
  const took = hear(w, 'shelf', STRANGERS());
  w.ok(took.includes('"Noted."') && !w.party.bag.includes('dunstan_letter') && !!w.party.flags.q_riders_grey, 'they take Dunstan\'s letter, and it goes into a coat');
  reads(w, 'riders', 'Riders in the Dark', ['dunstan', 'ford', 'letter', 'grey'], ['hale', 'kept'], 'the letter to the strangers');
  const asked = hear(w, 'shelf', STRANGERS());
  w.ok(asked.includes('"Your business?"') && asked.includes('Nobody of that name') && !asked.includes('wolves'), 'they ask the company\'s business, do not know Hale\'s name and warn of nothing');
  w.ok(w.party.bag.includes('clerks_seal') && !w.party.flags.q_seal_hale, 'they take nothing else: the seal stays in the pack');
  walkThrough(w, 'shelf', 30, 9, EAST, 'thornmark');
}

function homecoming(ok: (cond: boolean, msg: string) => void): void {
  const business = (w: Walk, x: number, y: number) => { w.world.travel('harrow', x, y, NORTH); const f = w.world.featureHere(); return f && f.x === x && f.y === y ? f : undefined; };
  const night = (w: Walk, x: number, y: number): string[] => { at(w, 0); w.world.travel('harrow', x, y, NORTH); return w.world.eventsHere(); };
  const day = (w: Walk, x: number, y: number): string[] => { at(w, 12); w.world.travel('harrow', x, y, NORTH); return w.world.eventsHere(); };
  const step = (w: Walk, turn?: 'left' | 'right'): string[] => { if (turn) w.world.turn(turn); const r = w.world.move('forward'); return r.kind === 'moved' ? r.messages : [`blocked: ${'reason' in r ? r.reason : ''}`]; };
  const inn = (w: Walk) => { const f = business(w, 4, 4); return f?.kind === 'inn' ? f.price : 0; };
  const shop = (w: Walk, id: string) => { const f = business(w, 4, 10); return f?.kind === 'shop' ? priceIn(f, id) : 0; };
  const bell = (w: Walk) => questLog(w.world.state, w.party).find((v) => v.def.id === 'bell')?.pages[0];
  const CAPTAIN = (): Person => who('harrow', 3, 13, 'Captain Ordgar');
  { // The old city: the gate lets Idris in, the Chapel cures, the old Eel and prices, no bell or Wardens.
    const w = newWalk(ok);
    w.ok(w.party.members.some((m) => m.race === 'orcblood'), 'the default company has an orcblood member, Idris');
    walkThrough(w, 'shelf', 16, 4, NORTH, 'harrow');
    w.ok(w.world.state.x === 7 && w.world.state.y === 14, 'before Act II is done, the south gate lets a company with an orcblood member into Helmstow');
    const eel = business(w, 12, 13);
    w.ok(business(w, 11, 4)?.kind === 'temple' && there(w, OSMUND(), 'harrow') && eel?.kind === 'npc' && eel.lines[0] === 'The tavern is loud and smells of eel.', 'the old city: the Chapel open with Osmund in it, and the Eel\'s old talk');
    w.ok(inn(w) === 12 && shop(w, 'rations') === 4 && shop(w, 'longsword') === 120, `the old city's prices: the inn at 12, rations at 4 and a long sword at 120 (${inn(w)}, ${shop(w, 'rations')}, ${shop(w, 'longsword')})`);
    w.ok(!night(w, 7, 6).length && !there(w, CAPTAIN(), 'harrow') && !day(w, 7, 13).length, 'the old city: no curfew bell by night, no captain at the Drillyard and no Wardens at the gate');
    walkThrough(w, 'harrow', 13, 14, SOUTH, 'shelf');
    walkThrough(w, 'shelf', 18, 4, NORTH, 'harrow');
    w.ok(w.world.state.x === 13 && w.world.state.y === 14, 'the harbour postern is open both ways in the old city too');
  }
  { // The changed city, to a company with Idris in it: turned back at the gate, in by the postern.
    const w = newWalk(ok);
    meetWho(w, 'q_bell');
    w.party.flags.q_salt_done = 1;
    w.world.travel('shelf', 16, 4, NORTH);
    const gate = step(w);
    w.ok(gate[0] === 'blocked: A sergeant steps into the gate: "No orcblood past the gate. Regent\'s orders."' && w.world.zone?.id === 'shelf', `after Act II the sergeant turns back a company with an orcblood member at the south gate (${gate[0]})`);
    walkThrough(w, 'shelf', 18, 4, NORTH, 'harrow');
    w.ok(w.world.state.x === 13 && w.world.state.y === 14, 'and the harbour postern lets it in, by the Gilded Eel');
    const wardens = step(w, 'left'), again = (w.world.travel('harrow', 14, 14, NORTH), w.world.eventsHere());
    w.ok(wardens.some((m) => m.startsWith('Wardens on the wall above the postern')) && !again.length, 'the Wardens over the postern are said on the first step inside, once');
    w.ok(business(w, 11, 4)?.kind !== 'temple' && !there(w, OSMUND(), 'harrow') && !there(w, EBBA_EEL(), 'harrow'), 'the Chapel is shut: no cure, no Osmund and no Ebba');
    see(w, 'harrow:chapel_shut');
    const rung = bell(w);
    w.ok(w.world.used('chapel_shut') && !!rung?.done && rung.entries.some((e) => e.id === 'shut') && w.news.includes('Quest complete: The Bell That Rang Twice.'), 'its notice read, an unanswered bell ends at the shut door, and says where the sexton went');
    const night6 = night(w, 7, 6), day6 = day(w, 8, 6);
    w.ok(night6.length === 1 && night6[0].startsWith('The curfew bell') && !day6.length && night(w, 7, 6).length === 1, 'the curfew bell rings by night on the middle street, every time, and not by day');
    const yard = business(w, 3, 13);
    w.ok(yard?.kind === 'trainer' && there(w, CAPTAIN(), 'harrow'), 'the Drillyard stays, and the cousin\'s captain is in it');
    const first = hear(w, 'harrow', CAPTAIN()), then = hear(w, 'harrow', CAPTAIN());
    w.ok(first.startsWith('A captain in Warden grey') && then.startsWith('"The board\'s there.') && wrap(first, SAY_W).length <= SAY_LINES, 'the captain says the walls are Vask\'s, then where the work is');
    w.ok(inn(w) === 18 && shop(w, 'rations') === 6 && shop(w, 'longsword') === 180 && shop(w, 'lantern_oil') === 40, `the shops stay, dearer: the inn at 18, rations at 6, a long sword at 180, the oil still 40 (${inn(w)}, ${shop(w, 'rations')}, ${shop(w, 'longsword')}, ${shop(w, 'lantern_oil')})`);
    const eel = business(w, 12, 13);
    w.ok(eel?.kind === 'npc' && eel.lines[0].startsWith('The tavern is half as loud'), 'the Eel\'s talk is the curfew\'s');
    walkThrough(w, 'harrow', 7, 14, SOUTH, 'shelf');
    // The bell's witnesses are gone with Osmund, and Ailith, met now, asks after the Watch, not the Chapel.
    w.ok(!there(w, FISHERMAN(), 'harrow') && !there(w, WALL(), 'harrow'), 'after Act II the bell\'s witnesses are gone too');
    const ailith = who('shelf', 2, 14, 'Ailith'), twin = MAP_DEFS.find((d) => d.id === 'shelf')!.features!.filter((f): f is Person => f.kind === 'npc' && f.name === ailith.name)[1];
    w.ok(!there(w, ailith, 'shelf') && there(w, twin, 'shelf'), 'Ailith in the wood is the one who has heard the Chapel is shut');
    const m = meet(twin, w.party, heard(w.world, twin)), watch = m.choice?.answers.find((a) => a.label === 'Lantern Watch, over the Sunder.');
    listen(w);
    const asked = page(w, 'survey')?.goal ?? '';
    w.ok(!!watch && !m.choice?.answers.some((a) => a.label.includes('Chapel')) && asked.startsWith('Tell Ailith where to go: Lantern Watch'), `she asks between the Watch and Thornhold, and the goal says so (${asked})`);
    if (watch) answer(watch, w.party);
    listen(w);
    reads(w, 'survey', 'The Rest of the Survey', ['ailith', 'watch'], ['chapel', 'thornhold'], 'Ailith sent to the Watch, after Act II');
    w.ok(!there(w, twin, 'shelf'), 'and she is gone from the wood');
  }
  { // The changed city, to a company with no orcblood member: the gate lets it in, under the Wardens.
    const w = newWalk(ok);
    w.party.members.splice(w.party.members.findIndex((m) => m.race === 'orcblood'), 1);
    w.party.flags.q_salt_done = 1;
    walkThrough(w, 'shelf', 16, 4, NORTH, 'harrow');
    w.ok(w.world.state.x === 7 && w.world.state.y === 14, 'after Act II the south gate lets a company with no orcblood member in');
    const wardens = step(w), beside = (w.world.travel('harrow', 8, 13, NORTH), w.world.eventsHere());
    w.ok(wardens.some((m) => m.startsWith('Wardens on the wall-walk')) && !beside.length, 'and the Wardens at the gate look it over on the first step inside, once');
  }
}
