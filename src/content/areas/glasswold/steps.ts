// The Glasswold's chain (#1033): the steps of its chapter of the one quest, The Warning, by the road in
// the goals' order (`STEPS`: the glass in the grass, up the track into Akordu, the eldest, the watch at the
// gap, the gap and back to Akordu's horse-lines, at 26, 27 and 28); the watch and the gap walked first
// (`GAP_FIRST`), and the chapter on from them by the Rider's ride (`BY_THE_RIDE`) and up the Scarp stair
// (`UP_THE_STAIR`); with the person they find by name (`npcOn`). The Glasswold's walkthrough plays them,
// and a later chapter's walkthrough or steps.ts replays them by this file, never by the walkthrough;
// nothing in the game imports it.
import { see, fight, listen, walkThrough, meetWho, atLevel, mapDef } from '../../../../tools/kit/walk.ts';
import type { Step } from '../../../../tools/kit/walk.ts';
import { NORTH, EAST, SOUTH, WEST } from '../../../game/types.ts';
import { meet, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { STORY } from './maps/wold_d8.ts';

/** A person on `map` found by name, as the steps and the scenes find them. */
export const npcOn = (map: string, name: string): Person => mapDef(map).features!.find((f): f is Person => f.kind === 'npc' && f.name === name)!;

/** Up the Riders' road from E10 through the mesas onto the steppe: the glass in the grass on D9's road in. */
const GRASS: Step = { name: 'the glass in the grass', play: (w) => see(w, 'wold_d9:d9_glass') };

/** Up the Riders' track over D9's north edge, the seam at 16, into Akordu's ring of tents. */
const TENTS: Step = { name: 'up the track into Akordu', play: (w) => { walkThrough(w, 'wold_d9', 16, 0, NORTH, 'wold_d8', 1); see(w, 'wold_d8:d8_akordu'); } };

/** East over the Scarp's edge, C8's 31,5, into Akordu's box, one land. */
const ACROSS: Step = { name: 'over the Scarp\'s edge into Akordu', play: (w) => walkThrough(w, 'wold_c8', 31, 5, EAST, 'wold_d8', 1) };

/** The eldest at her own fire before her tent, her story told once. */
const ELDEST: Step = { name: 'the eldest', play: (w) => meetWho(w, STORY) };

/** West over C8's edge under the rim and south over B8's into the dunes, to the old Rider at the watch's fire. */
const WATCHED: Step = { name: 'the watch at the gap', play: (w) => {
  walkThrough(w, 'wold_c8', 0, 4, WEST, 'wold_b8', 1);
  walkThrough(w, 'wold_b8', 16, 31, SOUTH, 'wold_b9', 1);
  const old = npcOn('wold_b9', 'An old Rider at the fire');
  w.world.travel('wold_b9', old.x, old.y);
  meet(old, w.party, heard(w.world, old));
  listen(w);
} };

/** On past the stones to the gap's last square, the Glass and its crown seen; then the two walkers at the gap won. */
const GAP: Step = { name: 'the gap', play: (w) => {
  for (const id of ['b9_line', 'b9_tracks', 'b9_glass']) see(w, `wold_b9:${id}`);
  fight(w, 'wold_b9:b9_walkers');
} };

/** Back north and east over the seams to Akordu's horse-lines, turned east for the port. */
const LINES: Step = { name: 'back to Akordu\'s horse-lines', play: (w) => {
  walkThrough(w, 'wold_b9', 16, 0, NORTH, 'wold_b8', 1);
  walkThrough(w, 'wold_b8', 31, 4, EAST, 'wold_c8', 1);
  walkThrough(w, 'wold_c8', 31, 5, EAST, 'wold_d8', 1);
  see(w, 'wold_d8:d8_turned');
} };

/** The chapter by the road over the Cinder Hills, in the goals' order, at the levels the curve gives each step. */
export const STEPS: readonly Step[] = [atLevel(26, GRASS), atLevel(26, TENTS), atLevel(26, ELDEST), atLevel(27, WATCHED), atLevel(28, GAP), atLevel(28, LINES)];
/** The watch heard and the gap walked first, as a company set down by the ride or come up the stair walks them. */
export const GAP_FIRST: readonly Step[] = [atLevel(27, WATCHED), atLevel(28, GAP)];
/** The chapter on from the gap for a company set down at Akordu's horse-lines by the Rider's ride: the eldest, then the lines. */
export const BY_THE_RIDE: readonly Step[] = [atLevel(28, ELDEST), atLevel(28, LINES)];
/** The chapter on from the gap for a company come up the Scarp stair: over the Scarp's edge into Akordu, the eldest, then the lines. */
export const UP_THE_STAIR: readonly Step[] = [atLevel(28, ACROSS), atLevel(28, ELDEST), atLevel(28, LINES)];
