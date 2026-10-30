// Ashfall's chain (#1033): the steps of its chapter of the one quest, The Window, at 24, 25 and 26:
// by the Stair, every goal in its order and the window looked through (`STEPS`); by sea, Old Cinder's
// part first and the window passed (`CINDER_FIRST`); by the Stair, the parts as they come
// (`AS_THEY_COME`); and by sea, west at the end on the Rider's ride (`BY_RIDE`); with `openChest`,
// which the walkthrough's scenes call as well. Ashfall's walkthrough plays them, and a later chapter's
// walkthrough or steps.ts replays them by this file, never by the walkthrough; nothing in the game
// imports it.
import { see, fight, listen, walkThrough, meetWho, written, atLevel, mapOf } from '../../../../tools/kit/walk.ts';
import type { Walk, Step } from '../../../../tools/kit/walk.ts';
import { NORTH } from '../../../game/types.ts';
import { TABLES } from '../../index.ts';
import { meet, heard, answer } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { holds } from '../../../game/quests.ts';
import { take as sail } from '../../../game/passage.ts';
import { MINUTES_PER_DAY } from '../../../game/calendar.ts';
import { RIDERS_RIDE } from '../../crossings.ts';
import { stonesRestored } from '../../../game/stones.ts';
import { GATE, ELDEST_HEARD } from './maps/cindercoast_g10.ts';
import { LIT, ROAD_WEST } from './public.ts';
import { LIGHTS, SOCKETS } from './maps/ember_stone.ts';
import { CHAPTER } from './chapter.ts';

const SOCKETED = mapOf('ember_stone').features!.filter((f): f is Person => f.kind === 'npc' && /socket/i.test(f.name));
const FANE = mapOf('meridian_camp3').features!.find((f): f is Person => f.kind === 'npc' && f.name === 'Oriel Fane')!;

/** Open a chest, 'map:id', as the game does: its gold and its items to the company, and spent. */
export function openChest(w: Walk, at: string): void {
  const [map, id] = at.split(':');
  const c = mapOf(map).features!.find((f) => f.kind === 'chest' && f.id === id);
  if (c?.kind !== 'chest') { w.ok(false, `there is a chest ${at}`); return; }
  w.world.travel(map, c.x, c.y);
  if (!w.world.used(id)) { w.world.markUsed(id); w.party.gold += c.gold; w.party.bag.push(...c.items); }
  listen(w);
}

/** Down the Stair's last flights to its foot on the black sand. */
const FOOT: Step = { name: 'the Stair\'s foot', play: (w) => see(w, 'cindercoast_h10:h10_foot') };

/** In at Cinderport's gate from the trading ground. */
const PORT: Step = { name: 'into Cinderport', play: (w) => walkThrough(w, 'cindercoast_g10', GATE.x, GATE.y + 1, NORTH, 'cinderport', 1) };

/** The eldest at the Riders' fire outside the gate, her three lines heard. */
const ELDEST: Step = { name: 'the eldest', play: (w) => meetWho(w, ELDEST_HEARD) };

/** Down inside the Stone on its field of cinders, to its heart and the three sockets. */
const HEART: Step = { name: 'the Stone\'s heart', play: (w) => see(w, 'ember_stone:es_heart') };

/** Down the vents to the furnace room, and the first part out of the furnace's mouth. */
const FURNACE: Step = { name: 'the vents', play: (w) => {
  see(w, 'meridian_camp:mc1_furnace');
  openChest(w, 'meridian_camp:mc1_part');
} };

/** Down through Old Cinder's buried town to the undercroft's bottom, and the second part by the lamp. */
const CINDER: Step = { name: 'Old Cinder', play: (w) => {
  see(w, 'old_cinder:oc1_street');
  see(w, 'old_cinder2:oc2_set');
  openChest(w, 'old_cinder2:oc2_part');
} };

/**
 * The iron corridors to their end and the third part; and, unless the company turns back there, on down
 * to the camp, the old man at his fire met and his map taken, and the window looked through or passed.
 */
const corridors = (camp: 'none' | 'looked' | 'passed'): Step => ({ name: camp === 'none' ? 'the corridors' : `the corridors and the camp, the window ${camp}`, play: (w) => {
  see(w, 'meridian_camp2:mc2_in');
  see(w, 'meridian_camp2:mc2_end');
  openChest(w, 'meridian_camp2:mc2_part');
  if (camp === 'none') return;
  see(w, 'meridian_camp3:mc3_fire');
  w.world.travel('meridian_camp3', FANE.x, FANE.y);
  const met = meet(FANE, w.party, heard(w.world, FANE)), take = met.choice?.answers.find((a) => a.label === 'Take it.');
  if (take) answer(TABLES.items, take, w.party);
  listen(w);
  if (camp === 'looked') see(w, 'meridian_camp3:mc3_window');
  const looked = written(w, CHAPTER).includes('window');
  w.ok(met.text.includes('You took your time') && !!w.party.flags.meridian_map && written(w, CHAPTER).includes('camp') && looked === (camp === 'looked'),
    `at ${w.level}, down to the camp, the old man met at his fire and his map taken, and the window ${camp}: its entry ${looked ? 'written' : 'not written'}`);
} });

/** Up to the Stone with the parts carried, each set in its own socket at a meeting; the last in lights it. */
const SET: Step = { name: 'the parts set', play: (w) => {
  const before = stonesRestored(TABLES.stones, w.world.state, w.party), lit = !!w.party.flags[LIT], said: string[] = [];
  SOCKETED.forEach((p, i) => {
    if (!w.party.bag.includes(`ember_part${i + 1}`)) return;
    w.world.travel('ember_stone', p.x, p.y);
    const [a] = meet(p, w.party, heard(w.world, p)).choice?.answers ?? [];
    said.push(a ? answer(TABLES.items, a, w.party) : '');
  });
  listen(w);
  const now = stonesRestored(TABLES.stones, w.world.state, w.party);
  if (w.party.flags[LIT]) {
    w.ok(!lit && now === before + 1 && (said.at(-1) ?? '').startsWith(LIGHTS.join('\n\n')) && SOCKETS.every((f) => w.party.flags[f]),
      `at ${w.level}, the last part in lights the Stone, and it counts for the Hearth (${before} restored, then ${now})`);
  } else {
    w.ok(said.length > 0 && now === before, `at ${w.level}, ${said.length} set and the Stone still dark, and the Hearth counts nothing yet (${now})`);
  }
} };

/**
 * West along the road, the Stone lit: the sentries by F10's road and by E10's up into the Hills won at
 * the step's level (#449), and up onto the Hills' last shoulder, the grass below.
 */
const WEST_ROAD: Step = { name: 'the road west', play: (w) => {
  fight(w, 'emberwaste_f10:f10_sentries');
  fight(w, 'emberwaste_e10:e10_sentries');
  w.world.travel('emberwaste_e10', 1, 8, NORTH);
  const steps = [w.world.move('forward'), w.world.move('forward')];
  const said = [...steps.flatMap((r) => (r.kind === 'moved' ? r.messages : [])), ...w.world.eventsHere()];
  listen(w);
  w.ok(steps.every((r) => r.kind === 'moved') && said.some((t) => t.startsWith('At the Hills\' last shoulder')) && !!w.party.flags[ROAD_WEST],
    `up the road onto the Hills' last shoulder, the grass below, and ${ROAD_WEST} is set (${said.join(' / ')})`);
} };

/**
 * West from Cinderport's gate on the Rider's ride, the Stone lit and the road over the Hills never
 * walked: set down at Akordu's horse-lines, the landing's line said as the game says it on arrival.
 */
const RIDE: Step = { name: 'the Rider\'s ride west', play: (w) => {
  const rider = mapOf('cinderport').features!.find((f): f is Person => f.kind === 'npc' && f.name === 'A Rider by the gate')!;
  w.world.travel('cinderport', rider.x, rider.y);
  w.world.state.minutes = Math.floor(w.world.state.minutes / MINUTES_PER_DAY) * MINUTES_PER_DAY + 9 * 60;
  w.party.gold = RIDERS_RIDE.fare;
  const rode = sail(rider.passage![0], w.world, w.party), said = rode.taken ? w.world.eventsHere() : [];
  listen(w);
  w.ok(rode.taken && w.world.zone?.id === 'wold_d8' && said.some((t) => t.startsWith('The Riders at the lines')) && !!w.party.flags[ROAD_WEST]
    && !holds({ seen: 'emberwaste_e10:e10_west' }, w.world.state, w.party),
    `west on the Rider's ride, the road never walked, set down at Akordu's horse-lines, and ${ROAD_WEST} is set (${said.join(' / ')})`);
} };

/** By the Stair, every goal in its order and the window looked through. */
export const STEPS: readonly Step[] = [atLevel(24, FOOT), atLevel(24, PORT), atLevel(24, ELDEST), atLevel(25, HEART), atLevel(25, FURNACE), atLevel(25, SET),
  atLevel(26, corridors('looked')), atLevel(26, SET), atLevel(26, CINDER), atLevel(26, SET), atLevel(26, WEST_ROAD)];

/** By sea, Old Cinder's part first and the window passed: played to the first part set (four steps), then on. */
export const CINDER_FIRST: readonly Step[] = [atLevel(24, ELDEST), atLevel(25, HEART), atLevel(25, CINDER), atLevel(25, SET),
  atLevel(25, FURNACE), atLevel(25, SET), atLevel(26, corridors('passed')), atLevel(26, SET), atLevel(26, WEST_ROAD)];

/** By the Stair, the parts as they come: played to Old Cinder's part set (seven steps), then on. */
export const AS_THEY_COME: readonly Step[] = [atLevel(24, FOOT), atLevel(24, ELDEST), atLevel(25, HEART), atLevel(25, FURNACE), atLevel(25, SET), atLevel(26, CINDER), atLevel(26, SET),
  atLevel(26, corridors('none')), atLevel(26, SET), atLevel(26, WEST_ROAD)];

/** By sea, and west at the end on the Rider's ride, the road over the Hills never walked. */
export const BY_RIDE: readonly Step[] = [atLevel(24, ELDEST), atLevel(25, HEART), atLevel(25, FURNACE), atLevel(25, SET), atLevel(26, corridors('none')), atLevel(26, SET),
  atLevel(26, CINDER), atLevel(26, SET), atLevel(26, RIDE)];
