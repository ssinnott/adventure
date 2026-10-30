// The Foreland's chain (#1033): the steps of its chapter of the one quest, The Quiet Farm, from Vask's
// hire to the wand handed back, in order (`STEPS`) and with the farm first (`FARM_FIRST`), with what
// they call (the hire, `HIRE` and `hired`; the keeper's log at Crowness; the wand to Vask, `toVask`),
// and Hale's first hand-in, the ledger from Brandy Hole (`ledgerGiven`). The Foreland's walkthrough
// plays them, and a later chapter's walkthrough or steps.ts replays them by this file, never by the
// walkthrough; nothing in the game imports it.
import { meetWho, walkThrough, see, fight, open, listen, quest, mapDef } from '../../../../tools/kit/walk.ts';
import type { Step, Walk } from '../../../../tools/kit/walk.ts';
import { EAST } from '../../../game/types.ts';
import { TABLES } from '../../index.ts';
import { meet, heard, readText } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';

/** Vask hires the company: before the chapter, or its last step for a company that came early. */
export const HIRE: Step = { name: 'the hire', play: (w) => meetWho(w, 'q_ashcombe') };

/** A new game hired by Vask, the way the chapter begins in order. */
export function hired(w: Walk): void {
  listen(w);
  w.ok(!quest(w), 'a new game has no quest yet');
  HIRE.play(w);
  w.ok(w.news.at(-1) === 'New quest: The Dimming.', `Vask's hire begins the one quest (${w.news.at(-1)})`);
}

/** At Crowness Light: the keeper met, and his log opened and read from the pack. */
function crowness(w: Walk): void {
  meetWho(w, 'q_keeper');
  open(w, 'downs_e3:e3_log');
  w.ok(w.party.bag.includes('keepers_log') && (readText(TABLES.items, 'keepers_log') ?? []).length === 5, "the keeper's log is on the cottage table, and reads from the pack");
}

/**
 * The wand taken to Vask at his door: found by his hire and never by the wand, which his steward and
 * Wiglaf at the door take as well, once he is gone (#795; the walkthrough's `keepHandIns` plays them).
 */
export function toVask(w: Walk): void {
  const vask = mapDef('keep').features?.find((f): f is Person => f.kind === 'npc' && [f.flag ?? []].flat().includes('q_ashcombe'));
  w.ok(!!vask, 'Vask keeps the door of the keep');
  if (!vask) return;
  w.world.travel('keep', vask.x, vask.y);
  w.ok(w.world.present(vask), 'Vask is there to meet');
  const bag = w.party.bag.length;
  meet(vask, w.party, heard(w.world, vask));
  if (w.party.bag.length < bag) w.handedIn = 'keep';
  listen(w);
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
  { name: 'the wand', play: toVask },
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
    const vask = mapDef('keep').features?.find((f): f is Person => f.kind === 'npc' && [f.flag ?? []].flat().includes('q_ashcombe'));
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

/** The Cargo Ledger found in Brandy Hole and given to Hale, as his first hand-in. */
export function ledgerGiven(w: Walk): void {
  open(w, 'greywater2:gw2_ledger');
  meetWho(w, 'q_greywater_done');
  w.ok(!!w.party.flags.q_greywater_done && !w.party.bag.includes('greywater_ledger'), 'Hale takes the ledger');
}
