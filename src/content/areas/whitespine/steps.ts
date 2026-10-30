// The Whitespine's chain (#1033): the steps of its chapter of the one quest, The Bells, in order (`STEPS`:
// over the pass to Highcell, Highcell walked, the Point, the night, the Stair's head, the toll paid and
// onto the Stair), and with the Point reached first (`POINT_FIRST`), Highcell walked after the night
// (`HIGHCELL_LATE`) and the toll refused (`TOLL_REFUSED`), with the pass, the toll and the king who asks it
// that they call (`overThePass`, `parley`, `KING`). The Whitespine's walkthrough plays them, and a later
// chapter's walkthrough or steps.ts replays them by this file, never by the walkthrough; nothing in the
// game imports it.
import { walkThrough, see, fight, listen, written, atLevel, mapOf } from '../../../../tools/kit/walk.ts';
import type { Step, Walk } from '../../../../tools/kit/walk.ts';
import { SOUTH, EAST, WEST } from '../../../game/types.ts';
import { answer } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { restAndWake } from '../../../game/wilds.ts';
import { TABLES } from '../../index.ts';
import { GATE } from './maps/monksvale_j11.ts';
import { WENNA_TAKEN } from './maps/sheerpoint_i8.ts';
import { STAIR_TOP } from './public.ts';
import { CHAPTER } from './chapter.ts';

/** The king on the Stair's head, whose toll is put before his fight. */
export const KING = mapOf('highspine_i10').encounters!.find((g) => g.id === 'i10_king')!;

/**
 * Over the pass from K10 onto J10's road, and down it across J10's corner onto J11's road at its foot,
 * where the bells are heard (the road walked square to square in the walkthrough's opening).
 */
export function overThePass(w: Walk): void {
  w.world.travel('coldmere_k10', 0, 19, WEST);
  w.world.move('forward');
  w.world.travel('monksvale_j10', 20, 31, SOUTH);
  w.world.move('forward');
  listen(w);
  see(w, 'monksvale_j11:j11_bells');
}

/** Over the pass, the bells, and down the road to Highcell's gate and in. */
const TO_THE_GATE: Step = { name: 'over the pass to Highcell', play: (w) => {
  overThePass(w);
  walkThrough(w, 'monksvale_j11', GATE.x, GATE.y - 1, SOUTH, 'monastery', 1);
} };

/**
 * Highcell, in at the gate: the cells, the board of the hours read the old way by a reader, the night
 * stair down to the chapter house and its brothers and bells and the Abbot on its seat won.
 */
const HIGHCELL: Step = { name: 'Highcell', play: (w) => {
  walkThrough(w, 'monksvale_j11', GATE.x, GATE.y - 1, SOUTH, 'monastery', 1);
  see(w, 'monastery:hc1_cells');
  const board = mapOf('monastery').features!.find((f) => f.kind === 'sign' && f.id === 'hc1_board')!;
  const reader = w.party.members[4], skills = reader.skills;
  reader.skills = ['linguist'];
  w.world.travel('monastery', board.x, board.y);
  w.world.eventsHere();
  reader.skills = skills;
  listen(w);
  walkThrough(w, 'monastery', 12, 13, EAST, 'monastery2', 1);
  see(w, 'monastery2:hc2_chapter');
  fight(w, 'monastery2:hc2_chapter');
  fight(w, 'monastery2:hc2_abbot');
} };

/** Over the crest past the Peak Stone, north along the ridge trail to Sheer Point, and the causeway's first stone. */
const POINT: Step = { name: 'the Point', play: (w) => {
  see(w, 'highspine_i11:i11_stone');
  see(w, 'sheerpoint_i9:i9_causeway');
  see(w, 'sheerpoint_i8:i8_causeway');
} };

/** The night (#730): rested at her fire on the shingle, she is gone, and on the first stone her knot. */
const NIGHT: Step = { name: 'the night', play: (w) => {
  const her = mapOf('sheerpoint_i8').features!.find((f) => f.kind === 'npc' && f.name === 'The girl out of the hole') as Person;
  w.world.travel('sheerpoint_i8', her.x + 1, her.y, WEST);
  const there = w.world.present(her);
  const woke = restAndWake(w.world, w.party) ?? '';
  listen(w);
  see(w, 'sheerpoint_i8:i8_knot');
  w.ok(there && woke.includes('Her blanket by the fire is cold.') && !!w.party.flags[WENNA_TAKEN] && w.level === 24 && ['night', 'knot', 'heart', 'far'].every((e) => written(w, CHAPTER).includes(e)),
    `at ${w.level} she is met at her fire and rested by, and taken: the night, her knot and the line read again are written (${written(w, CHAPTER).join(', ')})`);
} };

/** South along the ridge to the Stair's head, where the king holds out his hand. */
const HEAD: Step = { name: 'the Stair\'s head', play: (w) => see(w, 'highspine_i10:i10_head') };

/** Beside the king's group on the head the toll is put before the fight: answered, the answer's words. */
export function parley(w: Walk, label: string): string {
  w.world.travel('highspine_i10', KING.x + 2, KING.y, WEST);
  const r = w.world.move('forward'), a = w.world.question(KING.id)?.answers.find((x) => x.label === label);
  w.ok(r.kind === 'moved' && r.asks === KING.id && !!a, `beside the king the toll is put before the fight, and '${label}' answers it`);
  const said = a ? answer(TABLES.items, a, w.party) : '';
  listen(w);
  return said;
}

const PAY: Step = { name: 'the toll paid', play: (w) => {
  const purse = w.party.gold, said = parley(w, 'Pay the toll.');
  w.ok(purse - w.party.gold === 1500 && !!w.party.flags.toll_paid && said.includes('stand aside'), `the toll paid, 1,500 gold, and the giants stand aside (${said})`);
} };

const REFUSE: Step = { name: 'the toll refused', play: (w) => {
  const said = parley(w, 'Refuse.');
  fight(w, 'highspine_i10:i10_king');
  w.ok(said.startsWith('He sighs') && !w.party.flags.toll_paid, `the toll refused, the king fights and falls (${said})`);
} };

/** Past the king's square onto the Stair below it, looking down into the ash. */
const DOWN: Step = { name: 'onto the Stair', play: (w) => {
  w.world.travel('highspine_i10', KING.x + 1, KING.y, WEST);
  const steps = [w.world.move('forward'), w.world.move('forward')];
  const said = [...steps.flatMap((r) => (r.kind === 'moved' ? r.messages : [])), ...w.world.eventsHere()];
  listen(w);
  w.ok(steps.every((r) => r.kind === 'moved' && !r.encounter && !r.asks) && said.some((t) => t.startsWith('Below the head the Stair goes down')) && !!w.party.flags[STAIR_TOP],
    `past the king's square onto the Stair, the way down into the ash, and ${STAIR_TOP} is set`);
} };

/** The chapter in order: over the pass at 22, Highcell and the Point at 23, and the night, the head, the toll paid and the Stair at 24. */
export const STEPS: readonly Step[] = [atLevel(22, TO_THE_GATE), atLevel(23, HIGHCELL), atLevel(23, POINT), atLevel(24, NIGHT), atLevel(24, HEAD), atLevel(24, PAY), atLevel(24, DOWN)];
/** The Point reached first, and the night. */
export const POINT_FIRST: readonly Step[] = [atLevel(23, POINT), atLevel(24, NIGHT)];
/** Highcell walked after the night, at 24. */
export const HIGHCELL_LATE: Step = atLevel(24, HIGHCELL);
/** The head, the toll refused and the king fought, and the Stair, at 24. */
export const TOLL_REFUSED: readonly Step[] = [atLevel(24, HEAD), atLevel(24, REFUSE), atLevel(24, DOWN)];
