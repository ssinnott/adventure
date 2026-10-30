// Wrackholm's chain (#1033): the steps of its chapter of the one quest, The Stone Carried Home, played on
// from the landing where Saltreach's runs leave the company: in order (`STEPS`: by Kelp Hole's crates out
// to the ship by night, the Stone and the captain's table, and home by the boat and the fen to the plinth),
// and Saltmouth first, the temples not seen (`PAPERS_LAST`: the table left shut, the Stone home, then back
// aboard for the papers). Wrackholm's walkthrough plays them, and a later chapter's walkthrough or
// steps.ts replays them by this file, never by the walkthrough; nothing in the game imports it.
import { walkThrough, see, fight, listen, meetWho, open, clock, mapDef } from '../../../../tools/kit/walk.ts';
import type { Step, Walk } from '../../../../tools/kit/walk.ts';
import { take } from '../../../game/passage.ts';
import { meet, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { NORTH, EAST, SOUTH, WEST } from '../../../game/types.ts';
import { WRACKHOLM_E6 } from './maps/wrackholm_e6.ts';
import { WRACKHOLM_F6 } from './maps/wrackholm_f6.ts';
import { SMUGGLERS_COVE } from './maps/smugglers_cove.ts';
import { TIDE_SHIP } from './maps/tide_ship.ts';
import { TIDE_SHIP2 } from './maps/tide_ship2.ts';
import { TIDE_SHIP3, TIDE_RIFT } from './maps/tide_ship3.ts';

const E6 = WRACKHOLM_E6, F6 = WRACKHOLM_F6;
const KITTO = E6.features!.find((f): f is Person => f.kind === 'npc' && !!f.passage?.length)!;
const DANDO = F6.features!.find((f): f is Person => f.kind === 'npc' && !!f.passage?.length)!;

/** East over the moor into F6 at 13, and out to the ship in Dando's boat by night. */
function outToTheShip(w: Walk): void {
  w.level = 13;
  walkThrough(w, E6.id, 30, 12, EAST, F6.id, 4);
  fight(w, `${F6.id}:f6_crew`);
  clock(w, 23);
  see(w, `${F6.id}:f6_boats`);
  w.world.travel(F6.id, DANDO.x, DANDO.y);
  meet(DANDO, w.party, heard(w.world, DANDO));
  w.party.gold += DANDO.passage![0].fare;
  const rowed = take(DANDO.passage![0], w.world, w.party);
  w.ok(rowed.taken && w.world.state.mapId === TIDE_SHIP.id, 'Dando rows the company out to the ship by night');
  see(w, `${TIDE_SHIP.id}:ts_aboard`);
}

/**
 * The decks at 12, the captain's table opened or left shut, the hold's crew and Hale freed if he is
 * there, past the elder at the bulkhead door, and the Warden at 14 for the Stone.
 */
function theStone(table: boolean): (w: Walk) => void {
  return (w) => {
    const ship = TIDE_SHIP, lower = TIDE_SHIP2, hold = TIDE_SHIP3;
    w.level = 12;
    for (const g of ship.encounters ?? []) fight(w, `${ship.id}:${g.id}`);
    walkThrough(w, ship.id, 8, 5, NORTH, lower.id, 2);
    for (const g of lower.encounters ?? []) fight(w, `${lower.id}:${g.id}`);
    if (table) { see(w, `${lower.id}:ts2_cabin`); open(w, `${lower.id}:ts2_table`, 'any', false); listen(w); }
    walkThrough(w, lower.id, 4, 9, SOUTH, hold.id, 2);
    see(w, `${hold.id}:ts3_beam`);
    fight(w, `${hold.id}:ts3_crew`);
    if (w.party.flags.q_hale_taken) meetWho(w, 'q_hale_freed');
    else see(w, `${hold.id}:ts3_last_row`);
    fight(w, `${hold.id}:ts3_elder`);
    see(w, `${hold.id}:ts3_forward`);
    const tear = hold.features!.find((f) => f.kind === 'rift')!;
    walkThrough(w, hold.id, tear.x, tear.y + 1, NORTH, TIDE_RIFT.map.id, 1);
    for (const g of (TIDE_RIFT.map.encounters ?? []).filter((e) => !e.id.endsWith('_warden'))) fight(w, `${TIDE_RIFT.map.id}:${g.id}`);
    w.level = 14;
    fight(w, `${TIDE_RIFT.map.id}:tide_ship_rift_warden`);
    open(w, `${TIDE_RIFT.map.id}:tide_ship_rift_hoard`, 'any', false);
    listen(w);
    w.ok(w.party.bag.includes('tide_stone'), 'beside the fallen Warden, the Tide Stone, carried');
  };
}

/** Over the side to the shingle, Kitto's boat back to Saltmouth, out by the land gate, and west over the fen to the plinth. */
function home(w: Walk): void {
  w.level = 12;
  walkThrough(w, TIDE_SHIP.id, 5, 9, WEST, F6.id, 1);
  w.world.travel(E6.id, KITTO.x, KITTO.y);
  w.party.gold += KITTO.passage![0].fare;
  const back = take(KITTO.passage![0], w.world, w.party);
  w.ok(back.taken && w.world.state.mapId === 'saltmouth', 'Kitto takes the company back to Saltmouth\'s quay');
  walkThrough(w, 'saltmouth', 7, 1, NORTH, 'saltings_c6', 2);
  walkThrough(w, 'saltings_c6', 26, 1, NORTH, 'delta_c5', 3);
  walkThrough(w, 'delta_c5', 0, 13, WEST, 'delta_b5', 2);
  meetWho(w, 'q_tide_home');
  w.ok(!!w.party.flags.q_tide_home && !w.party.bag.includes('tide_stone'), 'the plinth takes the Stone, and the Stone is home');
}

/** Back out to the ship for the papers left on the captain's table. */
function thePapers(w: Walk): void {
  w.level = 12;
  w.world.travel('saltmouth', 14, 10);
  const kitto = mapDef('saltmouth').features!.find((f): f is Person => f.kind === 'npc' && !!f.passage?.length)!;
  w.party.gold += kitto.passage![0].fare;
  take(kitto.passage![0], w.world, w.party);
  listen(w);
  w.level = 13;
  walkThrough(w, E6.id, 30, 12, EAST, F6.id, 4);
  clock(w, 23);
  w.world.travel(F6.id, DANDO.x, DANDO.y);
  w.party.gold += DANDO.passage![0].fare;
  take(DANDO.passage![0], w.world, w.party);
  w.level = 12;
  walkThrough(w, TIDE_SHIP.id, 8, 5, NORTH, TIDE_SHIP2.id, 2);
  open(w, `${TIDE_SHIP2.id}:ts2_table`, 'any', false);
  listen(w);
  w.ok(w.party.bag.includes('ships_papers') && w.party.bag.includes('ships_log'), 'the papers and the log, off the captain\'s table');
}

/** The chapter in order: by Kelp Hole's crates out to the ship, the Stone and the table, and home. */
export const STEPS: readonly Step[] = [
  { name: 'out to the ship', play: (w) => { walkThrough(w, E6.id, 18, 13, NORTH, SMUGGLERS_COVE.id, 2); see(w, `${SMUGGLERS_COVE.id}:kh1_crates`); walkThrough(w, SMUGGLERS_COVE.id, 12, 13, SOUTH, E6.id, 2); outToTheShip(w); } },
  { name: 'the Stone', play: theStone(true) },
  { name: 'home', play: home },
];

/** Saltmouth first, the temples not seen: out to the ship with the captain's table left shut, the Stone home, then back aboard for the papers. */
export const PAPERS_LAST: readonly Step[] = [
  { name: 'out to the ship', play: outToTheShip },
  { name: 'the Stone, the table shut', play: theStone(false) },
  { name: 'home', play: home },
  { name: 'the papers', play: thePapers },
];
