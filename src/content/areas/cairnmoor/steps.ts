// Cairnmoor's chain (#1033): the steps of its chapter of the one quest, The Ring, played in order
// (`STEPS`: the ring by night, the road's head and down the notch, at 18, 19 and 20) and with the road's
// head taken first (`HEAD_FIRST`), with the voice they listen for (`crew`). Cairnmoor's walkthrough
// plays them, and a later chapter's walkthrough or steps.ts replays them by this file, never by the
// walkthrough; nothing in the game imports it.
import { walkThrough, see, listen, hour, atLevel } from '../../../../tools/kit/walk.ts';
import type { Step, Walk } from '../../../../tools/kit/walk.ts';
import { WEST } from '../../../game/types.ts';
import { TABLES, GUILD_QUESTS } from '../../index.ts';
import { FOURTH_RANKS_OPEN } from '../kilns/public.ts';
import { NOTCH } from './public.ts';
import { rankFlag, takenFlag, doneFlag } from '../../guilds.ts';
import { take, rankOf } from '../../../game/guilds.ts';
import type { Party } from '../../../game/party.ts';

/**
 * The Lanterns' fourth rank's ask on High Moor (DESIGN §8, #439), on a copy of the walk's company made
 * a Reader who has copied the Tiefzeche's words, Act II done: the ring heard, the ask is paid at the
 * taking, with the words for a company that came early, and the company is a Luminary.
 */
function luminary(w: Walk): void {
  const p: Party = structuredClone(w.party);
  p.flags[rankFlag('lanterns')] = 3; p.flags[FOURTH_RANKS_OPEN] = 1;
  p.flags[takenFlag('lanterns_niche')] = p.flags[doneFlag('lanterns_niche')] = 1;
  const q = GUILD_QUESTS.find((g) => g.id === 'lanterns_ring')!;
  const said = take(TABLES, q, w.world.state, p);
  w.ok(said.length === 2 && said[0].startsWith(q.early![0]) && said[1] === 'Your rank with the Lanterns is now Luminary.' && rankOf(TABLES, 'lanterns', p) === 4,
    `the ring heard, the Lanterns' ask is paid at the taking, and a company that copied the Tiefzeche's words is made a Luminary (${said.join(' ').replace(/\n+/g, ' ')})`);
}

/** Whether the voice is among what was said. */
export const crew = (said: readonly string[]): boolean => said.some((m) => m.includes('"Crew. Report."'));

/** Into the ring by night, to its camp: the voice speaks, and the company sleeps there till morning. */
const RING: Step = { name: 'the ring by night', play: (w) => {
  hour(w, 23);
  w.world.travel('highmoor_o7', 6, 24);
  const said = w.world.eventsHere();
  w.ok(crew(said) && !!w.party.flags.q_ring_spoke, `inside Fionnlios by night the voice speaks, and the chapter's flag is set (${said.join(' / ')})`);
  luminary(w);
  w.world.sleepUntilMorning();
  listen(w);
} };

/** Down the drove road to its head above the lakes, by day. */
const HEAD: Step = { name: 'the road\'s head', play: (w) => { hour(w, 12); see(w, 'cairnfield_n8:n8_head'); } };

/** Down through the notch at the road's head onto M9's road (NOTCH). */
const NOTCHED: Step = { name: 'down the notch', play: (w) => walkThrough(w, 'cairnfield_n8', NOTCH.x + 1, NOTCH.y, WEST, NOTCH.to, 2) };

/** The chapter in order: the ring by night, the road's head and down the notch, at 18, 19 and 20. */
export const STEPS: readonly Step[] = [atLevel(18, RING), atLevel(19, HEAD), atLevel(20, NOTCHED)];
/** The chapter with the road's head taken first, the goal turning back to the ring. */
export const HEAD_FIRST: readonly Step[] = [atLevel(18, HEAD), atLevel(19, RING), atLevel(20, NOTCHED)];
