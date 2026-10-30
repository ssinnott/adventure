// Hearth Isle's chain (#1033): the steps of its chapter of the one quest, The Heart, from the last crossing
// (`CROSSING`) to the choice: by the boat with every frame read, the rearguard fought and Vask fought with
// the Hands first, to Light it again. (`STEPS`); with the Council sat for Tallis, the thinned temple and
// heart, the hatch's way onto the stair and Tallis's man inside the door, to Open the hull. (`FOR_TALLIS`);
// with Fane's map and the Wardens' badge, the landing held, to Make it finish. (`WITH_THE_MAP`); and from
// the cleft to the Catcher for a company over early (`EARLY`). Hearth Isle's walkthrough plays them, and a
// later chapter's walkthrough or steps.ts replays them by this file, never by the walkthrough; nothing in
// the game imports it.
import { see, fight, listen, walkThrough, gone as left, hour, mapDef, groupOn } from '../../../../tools/kit/walk.ts';
import type { Walk, Step } from '../../../../tools/kit/walk.ts';
import { NORTH } from '../../../game/types.ts';
import { TABLES } from '../../index.ts';
import { meet, heard, answer } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { take as ride } from '../../../game/passage.ts';
import { endingTaken } from '../../../game/stones.ts';
import { ANSWER } from '../../../game/bot.ts';
import { LAST_CROSSING } from '../../crossings.ts';
import { STAIR_DOOR, CRAWL_DOOR } from './maps/underdeep.ts';
import { KNOT_LAST } from './maps/underdeep2.ts';

const WAYS_DEF = mapDef('underdeep');
const STAIR_DEF = mapDef('underdeep2');
const CORE_DEF = mapDef('core');
const inCore = (name: string): Person => CORE_DEF.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;

/** Meet a person in the Heart and go through the meeting as the game does. */
function talk(w: Walk, p: Person): ReturnType<typeof meet> {
  w.world.travel('core', p.x, p.y);
  w.ok(w.world.present(p), `${p.name} stands there to be met`);
  const said = meet(p, w.party, heard(w.world, p));
  listen(w);
  return said;
}

/** The last crossing bought at Cinderport's quay at noon, and one step up off the landing onto the strand. */
export const CROSSING: Step = { name: 'the last crossing', play: (w) => {
  const port = mapDef('cinderport').features!.find((f): f is Person => f.kind === 'npc' && (f.passage ?? []).some((p) => p.to === 'hearthisle_h6'))!;
  w.world.travel('cinderport', port.x, port.y);
  hour(w, 12);
  w.party.gold = LAST_CROSSING.fare;
  const boat = ride(port.passage!.find((p) => p.to === 'hearthisle_h6')!, w.world, w.party);
  listen(w);
  const up = w.world.move('forward');
  w.ok(boat.taken && up.kind === 'moved' && w.world.zone?.id === 'hearthisle_h6' && w.world.used('h6_strand'), 'over the Sound by the last crossing, and one step up off the landing the column close');
  listen(w);
  see(w, 'hearthisle_h6:h6_shard');
} };

/** Up the cleft through the rim into the Bowl, and in at the temple's door onto the nave's foot. */
const CLEFT: Step = { name: 'up the cleft to the temple', play: (w) => {
  for (const id of ['h6_cleft', 'h6_bowl']) see(w, `hearthisle_h6:${id}`);
  walkThrough(w, 'hearthisle_h6', 18, 15, NORTH, 'hearthfane', 1);
} };

/** The nave past the Hand's best and the altar, down the stair behind it, and the crypt's keeper before her knot. */
const NAVE: Step = { name: 'the nave and the crypt', play: (w) => {
  see(w, 'hearthfane:hf_nave');
  fight(w, 'hearthfane:hf_champions');
  see(w, 'hearthfane:hf_altar');
  walkThrough(w, 'hearthfane', 8, 2, NORTH, 'hearthfane2', 1);
  fight(w, 'hearthfane2:hf2_keeper');
  see(w, 'hearthfane2:hf2_knot');
} };

/** Through the grey door onto the ways' foot and one step in: an exit's landing reads nothing. */
const THROUGH_GREY: Step = { name: 'through the grey door', play: (w) => {
  walkThrough(w, 'hearthfane2', 8, 2, NORTH, 'underdeep', 1);
  const step = w.world.move('forward');
  w.ok(step.kind === 'moved' && w.world.used('ud_in'), 'one step in off the grey door\'s landing, the ways\' first line read');
  listen(w);
} };

/** The eighth frame read, and the hatch behind it found, searched at the wall. */
function hatch(w: Walk): void {
  see(w, 'underdeep:ud_knot8');
  const [h] = WAYS_DEF.secrets!;
  w.world.travel('underdeep', h.x, h.y + 1, NORTH);
  let found = false;
  for (let i = 0; i < 20 && !found; i++) found = w.world.search();
  w.ok(found && h.hint === 'ud_knot8', 'from the eighth frame, searched at the wall behind it, the hatch is found');
}

/** Down the flights to the last frame, her name on it, and the Catcher at the foot, at 31. */
const DOWN: Step = { name: 'down the stair to the Catcher at 31', play: (w) => {
  see(w, KNOT_LAST);
  w.level = 31;
  fight(w, 'underdeep2:ud2_catcher');
} };

/** Every frame of the Ways read and the hatch found; the ways' last door, the stair's head, the first landing fought for or held, and the dead. */
const WAYS = (held: boolean): Step => ({ name: `the ways, every frame read, and the first landing ${held ? 'held' : 'fought for'}`, play: (w) => {
  for (let i = 1; i <= 7; i++) see(w, `underdeep:ud_knot${i}`);
  hatch(w);
  walkThrough(w, 'underdeep', STAIR_DOOR.x, STAIR_DOOR.y + 1, NORTH, 'underdeep2', 2);
  see(w, 'underdeep2:ud2_head');
  if (held) { see(w, 'underdeep2:ud2_held'); left(w, 'underdeep2:ud2_rearguard'); } else fight(w, 'underdeep2:ud2_rearguard');
  see(w, 'underdeep2:ud2_dead');
} });

/** The hatch's crawl way to its door, onto the stair's fourth landing below the first landing's fights and the dead; the landing above held; then down. */
const CRAWL: Step = { name: 'the hatch\'s way onto the stair below the fights, and down to the Catcher at 31', play: (w) => {
  hatch(w);
  const [h] = WAYS_DEF.secrets!;
  walkThrough(w, 'underdeep', h.x, h.y + 1, NORTH, 'underdeep2', 16);
  const above = ['ud2_rearguard', 'ud2_rats', 'ud2_crawlers1'].map((id) => groupOn(STAIR_DEF, id));
  w.ok(w.world.state.x === CRAWL_DOOR.tx && w.world.state.y === CRAWL_DOOR.ty && above.every((g) => g.y > CRAWL_DOOR.ty) && !w.world.used('ud2_dead'),
    'out of the crawl way onto the fourth landing, 24,18, below the rearguard, the rats, the first crawlers and the dead');
  const captain = STAIR_DEF.features!.find((f) => f.kind === 'npc') as Person;
  w.ok(w.world.present(captain), 'the claimant\'s people hold the first landing above, by the Council\'s verdict');
  left(w, 'underdeep2:ud2_rearguard');
  DOWN.play(w);
} };

/** The creed at the foot, and on the road's five the last door opens as the company comes near: one step in, the Heart's first line. */
const DOOR: Step = { name: 'the last door, on the road\'s five', play: (w) => {
  see(w, 'underdeep2:ud2_foot');
  walkThrough(w, 'underdeep2', 16, 2, NORTH, 'core', 1);
  const step = w.world.move('forward');
  w.ok(step.kind === 'moved' && w.world.used('core_door'), 'through the last door on the road\'s five, and the first step in reads the Heart\'s first line');
  listen(w);
} };

/** Vask at the panel, fought on the clock with the Grey Hands killed first; for a Council that removed him, his thinned group. */
const PANEL = (thinned: boolean): Step => ({ name: thinned ? 'Vask\'s thinned group at the panel' : 'Vask at the panel, on the clock, the Hands first', play: (w) => {
  see(w, 'core:core_heart');
  w.ok(ANSWER.clock === 'panel', 'the clock ticking, and the Grey Hands at the panel killed first');
  if (thinned) { left(w, 'core:core_vask'); fight(w, 'core:core_vask_thinned'); } else fight(w, 'core:core_vask');
} });

const VOICE: Step = { name: 'the voice in the walls', play: (w) => { talk(w, inCore('The voice in the walls')); } };
const GIRL: Step = { name: 'the girl and the ring', play: (w) => { talk(w, inCore('The girl out of the hole')); } };

/** Her question put again, `put` answers to it, and `label` taken: its flag and its three pages. */
const CHOOSE = (label: string, put: number): Step => ({ name: `the choice, ${label}`, play: (w) => {
  const asked = talk(w, inCore('The girl out of the hole'));
  const a = asked.choice?.answers.find((x) => x.label === label);
  w.ok(!!a && asked.choice!.answers.length === put, `she puts the question again, ${put} answers to it (${asked.choice?.answers.map((x) => x.label).join(' ')})`);
  if (!a) return;
  answer(TABLES.items, a, w.party);
  w.ok(endingTaken(TABLES.endings, a, w.party.flags)?.pages.length === 3, `${label} taken, its three pages shown`);
  listen(w);
} });

/** By the boat, every frame read and the rearguard fought, the Catcher at 31 and Vask fought with the Hands first: Light it again. */
export const STEPS: readonly Step[] = [CROSSING, CLEFT, NAVE, THROUGH_GREY, WAYS(false), DOWN, DOOR, PANEL(false), VOICE, GIRL, CHOOSE('Light it again.', 2)];
/** With the Council sat for Tallis and Vask removed: the thinned temple and heart, the hatch's way onto the stair below the fights and Tallis's man inside the door: Open the hull. */
export const FOR_TALLIS: readonly Step[] = [CROSSING, CLEFT, { name: 'the thinned temple, the nave and the crypt', play: (w: Walk) => { left(w, 'hearthfane:hf_second'); NAVE.play(w); } }, THROUGH_GREY, CRAWL, DOOR,
  { name: 'Vask\'s thinned group, Tallis\'s man inside the door', play: (w: Walk) => {
    const man = inCore('Tallis\'s man');
    PANEL(true).play(w);
    w.ok(w.world.present(man) && talk(w, man).text.includes('the ring most of all'), 'for Tallis\'s chair his man stands inside the Heart\'s door');
  } }, VOICE, GIRL, CHOOSE('Open the hull.', 2)];
/** With Fane's map and the Wardens' badge carried and no verdict: the first landing held, and the three answers put: Make it finish. */
export const WITH_THE_MAP: readonly Step[] = [CROSSING, CLEFT, NAVE, THROUGH_GREY, WAYS(true), DOWN, DOOR, PANEL(false), VOICE, GIRL, CHOOSE('Make it finish.', 3)];
/** For a company over early, on four of the road's five: from the cleft to the Catcher, where the last door stays shut. */
export const EARLY: readonly Step[] = [CLEFT, NAVE, THROUGH_GREY, WAYS(false), DOWN];
