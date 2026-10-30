// Sunderwood's chain (#1033): the steps of its chapter of the one quest, The Wall, the last of Act II, played
// on from the Stone home: in order (`STEPS`: east over the rope bridge, down the Sunder to the wall, the papers
// read at the Watch and Vask answered no at its gate the next morning), the Watch first, at 16 (`WATCH_FIRST`:
// read before the wall, so Vask waits on it) and the Sunder first (`SUNDER_FIRST`: the wall found before the
// chapter began, so the reading and Vask); with the walks they take, which the walkthrough takes as well
// (`eastToTheBridge`, `downToTheWall`, `toTheReader`). Sunderwood's walkthrough plays them, and a later
// chapter's walkthrough or steps.ts replays them by this file, never by the walkthrough; nothing in the game
// imports it.
import { walkThrough, see, fight, listen, meetWho, clock, mapDef } from '../../../../tools/kit/walk.ts';
import type { Step, Walk } from '../../../../tools/kit/walk.ts';
import { EAST, NORTH, SOUTH } from '../../../game/types.ts';
import { TABLES } from '../../index.ts';
import { meet, heard, answer } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';

const VASK = mapDef('lantern_watch').features!.find((f) => f.kind === 'npc' && f.name.startsWith('Lord Aumery Vask')) as Person;

/** East out of Thornmark, through the Eaves to the rim, and over the rope bridge, plank by plank. */
export function eastToTheBridge(w: Walk): void {
  walkThrough(w, 'thornmark', 28, 10, EAST, 'eaves_i2');
  walkThrough(w, 'eaves_i2', 29, 11, EAST, 'eaves_j2');
  see(w, 'eaves_j2:j2_rim');
  walkThrough(w, 'eaves_j2', 31, 24, EAST, 'eaves_k2');
  const over = Array.from({ length: 8 }, () => w.world.move('forward'));
  w.ok(over.every((r) => r.kind === 'moved') && w.world.used('k2_bridge'), 'the rope bridge is crossed to the east lip');
  listen(w);
}

/** Down the Sunder from K3's first landing to the floor, the Warden in the narrows, and the wall. */
export function downToTheWall(w: Walk): void {
  walkThrough(w, 'eaves_k2', 12, 29, SOUTH, 'eaves_k3', 4);
  walkThrough(w, 'eaves_k3', 9, 8, EAST, 'the_sunder', 1);
  walkThrough(w, 'the_sunder', 5, 29, SOUTH, 'the_sunder2', 1);
  fight(w, 'the_sunder2:su2_warden');
  see(w, 'the_sunder2:su2_wall');
}

/** In at the Watch's gate, and up to the Reader: met, then read to. */
export function toTheReader(w: Walk): void {
  walkThrough(w, 'lanternwood_l2', 12, 17, NORTH, 'lantern_watch');
  meetWho(w, 'watch_reader_met');
  meetWho(w, 'watch_reader_met');
  w.ok(!!w.party.flags.papers_read, 'the Reader reads what the company carries');
}

/**
 * Vask at the gate: not there by night, there the next morning, and his question answered with the
 * company's one answer, no (#452). It ends the act, sets its own flag and gives nothing, and he is gone.
 */
function vaskRefused(): (w: Walk) => void {
  return (w) => {
    clock(w, 23);
    w.ok(!w.world.present(VASK), 'by night, nobody waits at the Watch\'s gate');
    clock(w, 8);
    see(w, 'lantern_watch:lw_vask');
    w.world.travel('lantern_watch', 8, 13);
    w.ok(w.world.used('lw_vask') && !w.world.eventsHere().length, 'the next morning, riders at the gate, said once across the road\'s width');
    const gold = w.party.gold, bag = [...w.party.bag].sort().join();
    meetWho(w, 'q_vask_rain');
    w.world.travel('lantern_watch', VASK.x, VASK.y);
    const m = meet(VASK, w.party, heard(w.world, VASK)), labels = m.choice?.answers.map((x) => x.label) ?? [];
    w.ok(JSON.stringify(labels) === JSON.stringify(['No.']), `Vask asks, and no is the one answer: no yes is offered (${labels.join(', ') || 'no question'})`);
    const a = m.choice?.answers[0];
    const said = a ? answer(TABLES.items, a, w.party) : '';
    listen(w);
    w.ok(/girl/.test(said), `he has the girl (${said})`);
    w.ok(w.party.gold === gold && [...w.party.bag].sort().join() === bag, 'the answer gives nothing and takes nothing');
    w.ok(!w.world.present(VASK) && !meet(VASK, w.party, () => false).choice, 'and Vask is gone, his question closed');
  };
}

const BRIDGE: Step = { name: 'over the bridge', play: eastToTheBridge };
const DOWN: Step = { name: 'down to the wall', play: downToTheWall };
const READ: Step = { name: 'the papers read', play: toTheReader };

/**
 * In order: over the bridge, down to the wall, the papers read and, the next morning, Vask
 * answered no.
 */
export const STEPS: readonly Step[] = [BRIDGE, DOWN, READ, { name: 'Vask, no', play: vaskRefused() }];

/** A step at 16, the walk's level the Watch first is played at. */
const at16 = (s: Step): Step => ({ name: s.name, play: (w) => { w.level = 16; s.play(w); } });

/** The Watch first, at 16: read before the wall, so Vask is not come until it is touched; then answered no. */
export const WATCH_FIRST: readonly Step[] = [at16(BRIDGE), at16(READ), at16({ name: 'the wall unseen, so Vask is not come', play: (w) => {
  clock(w, 10);
  w.ok(!w.world.present(VASK), 'read, but the wall not touched: nobody waits at the gate by day');
  downToTheWall(w);
} }), at16({ name: 'Vask, no', play: vaskRefused() })];

/** The Sunder first: the wall found before the chapter began, so the papers read and Vask. */
export const SUNDER_FIRST: readonly Step[] = [READ, { name: 'Vask, no', play: vaskRefused() }];
