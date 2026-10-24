// The Stair, the Underdeep's second level: the long stair down from the Ways to the heart. From its head,
// 16,30, under the Ways' last door, a stair two wide goes down the shaft northward, flight under flight,
// turning on a landing every fourth row (30, 26, 22, 18, 14, 10, 6, 2): the claimant's people or the Hand's
// rearguard on the first (57), the Hand's dead on the flights below where the crawlers caught them (58), the
// crawl way's door from the Ways' hatch onto the fourth (24,18, 59), her name on the last frame (16,6), and
// the Catcher on the last landing before the last door (16,1), with the Hand's own door beside it, shut
// (13,1). Band 30-31; docs/areas/hearth_isle.md §4.7 is its brief.
import type { Exit, MapDef } from '../../../../game/mapdef.ts';
import { anchored } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';
import { THRONE_COUSIN, THRONE_HOLD, THRONE_TALLIS } from '../../shelf/public.ts';
import { HELD, TOKEN_COUSIN, TOKEN_HOLD, TOKEN_TALLIS } from './hearthisle_h6.ts';
import { RESPAWN } from '../../../../game/keys.ts';
import type { Flag } from '../../../index.ts';

/** The last frame's word (59), the end of her knots: `ud2_word`, once. */
export const KNOT_LAST = 'underdeep2:ud2_word';
/** The road's five, set at the Stones: what the last door listens for (§9, call 1). The Grove's mending opens nothing. */
export const FIVE = ['q_tide_home', 'q_grove_done', 'q_anvil_closed', 'q_peak_stood', 'q_ember_lit'] as const;
/**
 * The last door, into the Heart (#759): the act's one lock, the road's second, signed in
 * src/content/locks.ts on `q_ember_lit` at underdeep2 16,1, its reason: "the heart opens for whoever makes
 * it whole." Until the road's five hold, `ud2_shut` says so on the square before it.
 */
export const LAST_DOOR: Exit = anchored({
  x: 16, y: 1, to: 'core', at: 'start', needFlag: FIVE,
  blockedText: 'A door of grey, no handle, the Hand\'s last words cut across it. Something in it listens, and does not open.',
  label: 'The door does not wait for anyone\'s palm. It opens as you come near, the way a door opens for someone it knows.',
});

const many = (n: number, id: string): string[] => Array.from({ length: n }, () => id);

/** The claimant's captain's words (57), each under the flag that holds the landing: the three verdicts first, then the three tokens, so a verdict that carried outranks a token (HELD's order). */
const CAPTAIN: readonly (readonly [Flag, readonly string[]])[] = [
  [THRONE_COUSIN, ['A Warden captain on the landing with six of the Drillyard\'s behind her, the Hand\'s rearguard dead at their feet.', '"The Council\'s word came over with us: the cousin\'s people hold the stair for the company. We came in by the door that opened, and we\'ll hold it till you\'re back up."']],
  [THRONE_HOLD, ['Elves of Henlys on the landing, their bows strung, and the Hand\'s rearguard dead at their feet.', '"The hold sent us when the Council read the treaty. We hold this landing, and we do not go down: what is at the bottom was never ours."']],
  [THRONE_TALLIS, ['Compact hands on the landing, a dozen, the Hand\'s rearguard dead at their feet and their packs already open.', '"Tallis has the chair, and we\'ve been paid to hold this for you. What comes up out of that door with you is his, mind: the ring most of all."']],
  [TOKEN_COUSIN, ['A Warden captain on the landing with six of the Drillyard\'s behind her, the Hand\'s rearguard dead at their feet.', '"Sergeant Aelfric\'s badge. Then you\'re the ones. We came in by the door that opened and held this landing for you; we\'ll hold it till you\'re back up. The captains will want it said in Helmstow that the Wardens were here."']],
  [TOKEN_HOLD, ['Elves of Henlys on the landing, their bows strung, and the Hand\'s rearguard dead at their feet. Their leader looks at the seal on your chest.', '"Talwyn\'s. Then say it at the bottom for all of us. We hold this landing, and we do not go down: what is at the bottom was never ours."']],
  [TOKEN_TALLIS, ['Compact hands on the landing, a dozen, the Hand\'s rearguard dead at their feet and their packs already open. Their master looks at the tally-stick.', '"Tallis\'s. Then we\'ve been paid to hold this for you, and we have. What comes up out of that door with you is his, mind: the ring most of all. He said so. He said you\'d know what he meant."']],
];

export const UNDERDEEP2: MapDef<'underdeep2'> = {
  id: 'underdeep2',
  name: 'The Stair',
  kind: 'dungeon',
  band: [30, 31],
  region: 'hearth',
  // At the stair's head under the Ways' last door, facing down the stair.
  start: { x: 16, y: 30, facing: NORTH },
  anchors: { from_underdeep: { x: 24, y: 18, facing: SOUTH }, from_core: { x: 16, y: 2, facing: SOUTH } },
  // The Ways' grey, darker the further down.
  palette: { wall: '#8a8c90', wallDark: '#5e6064', floor: '#505258', ceiling: '#303236', door: '#5a5c60', wallStyle: 'smooth', ceilingStyle: 'vault', banner: '#3a3c40' },
  bare: true,
  // Z: a door drawn in the wall that does not open (the Hand's own door).
  legend: { Z: { solid: 'wall', door: 'door' } },
  rows: [
    '################################',
    '#############Z##D###############',
    '############.........###########',
    '############.........###########',
    '############.........###########',
    '###############..###############',
    '#############.......############',
    '#############.......############',
    '################..##############',
    '################..##############',
    '#############.......############',
    '#############.......############',
    '###############..###############',
    '###############..###############',
    '#############.......############',
    '#############.......############',
    '################..##############',
    '################..######Z#######',
    '#############............#######',
    '#############............#######',
    '###############..###############',
    '###############..###############',
    '#############.......############',
    '#############.......############',
    '################..##############',
    '################..##############',
    '#############.......############',
    '#############.......############',
    '###############..###############',
    '###############..###############',
    '##############.....#############',
    '################.###############',
  ],
  exits: [
    // Back up off the head into the Ways, before its last door, facing away from it (§9.1, 17).
    anchored({ x: 16, y: 31, to: 'underdeep', at: 'from_underdeep2', label: 'Back up off the stair\'s head into the ways.' }),
    // The last door, into the Heart, on the road's five (§9, call 1; #759).
    LAST_DOOR,
  ],
  features: [
    { kind: 'event', x: 16, y: 29, id: 'ud2_head', once: true, text: 'The stair\'s head. Below, flight under flight, the steps go down out of the lamp\'s reach, and the hum comes up them like heat.' },
    // The first landing (57): the claimant's people, once a verdict or a token holds it, and their captain.
    { kind: 'event', x: 16, y: 27, id: 'ud2_held', once: true, after: HELD, text: 'The claimant\'s people hold the first landing, their backs to the wall and the Hand\'s rearguard dead at their feet. They came in behind the Hand by the doors she opened.' },
    {
      kind: 'npc', x: 15, y: 27, name: 'The captain on the landing', after: HELD,
      lines: ['The claimant\'s people on the landing, the Hand\'s rearguard dead at their feet.'],
      says: CAPTAIN.map(([flag, lines]) => ({ after: { flag }, lines })),
    },
    { kind: 'chest', x: 17, y: 26, id: 'ud2_rearguard_chest', gold: 2000, items: ['grey_axe'] },
    // The Hand's dead on the flights, where the crawlers caught them (58).
    { kind: 'event', x: 16, y: 22, id: 'ud2_dead', once: true, text: 'The Hand\'s dead on the stairs, a dozen on this flight alone, where what lives below caught up with them. They were running up.' },
    // Their packs at the landing's end, where the rats are at them (#794).
    { kind: 'chest', x: 13, y: 22, id: 'ud2_packs2', gold: 1800, items: [] },
    { kind: 'event', x: 15, y: 21, id: 'ud2_letter', once: true, text: 'A champion dead against the wall with his grey hands folded over a letter, sealed with a knot of rope. The seal is Gullwick\'s.' },
    { kind: 'chest', x: 15, y: 21, id: 'ud2_letter_chest', gold: 0, items: ['gullwick_letter'] },
    { kind: 'event', x: 16, y: 18, id: 'ud2_marks', once: true, text: 'Claw-marks on the ceiling, deep, and running down the walls to the steps. Whatever made them walks where you cannot.' },
    { kind: 'event', x: 16, y: 14, id: 'ud2_more', once: true, text: 'More of the Hand\'s dead, and these did not run. They stood here and were taken from above.' },
    { kind: 'chest', x: 15, y: 13, id: 'ud2_packs', gold: 1800, items: many(4, 'potion_heal') },
    { kind: 'sign', x: 16, y: 10, id: 'ud2_creed', text: 'Chalked on the wall by a hand that was shaking: THE DOOR IS CLOSE. KEEP GOING.' },
    // Her name on the last frame before the foot (59).
    { kind: 'event', x: 16, y: 6, id: 'ud2_word', once: true, text: 'On the last frame before the foot, not the knot. A word, scratched hard and deep, letter by letter: WENNA.' },
    // The last landing: the last door and its lock (§9, call 1), and the Hand's own door beside it (§9.1, 20).
    { kind: 'event', x: 16, y: 3, id: 'ud2_foot', once: true, text: 'The foot of the stair, and the last door. Across it, cut deep, the Hand\'s last words: PUT OUT THE LIGHT, AND THE DOOR WILL OPEN.' },
    { kind: 'event', x: 13, y: 2, id: 'ud2_hand', once: true, text: 'Beside the last door, a second, grey, shut behind whoever went in. On its frame at a girl\'s shoulder, a loop inside a loop.' },
    { kind: 'event', x: 16, y: 2, id: 'ud2_shut', until: { flag: FIVE }, text: 'The door does not open. Something in it listens for five voices, and hears fewer.' },
    // The Hand's takings, carried to the last door and left there when she went in (#794).
    { kind: 'chest', x: 20, y: 2, id: 'ud2_takings', gold: 2600, items: [] },
  ],
  encounters: [
    // Knockers at the head's wall, standing: the first group past the way in, the gentlest (#794).
    { id: 'ud2_knockers2', x: 18, y: 30, monsters: many(3, 'deep_knocker'), aware: 2, roams: false, respawn: RESPAWN.twoDays },
    // The Hand's rearguard on the first landing, where the claimant's people are not: gone once a verdict or
    // a token holds it, standing or not (#747). 57 is done on it slain, so it never comes back.
    { id: 'ud2_rearguard', x: 16, y: 26, monsters: many(3, 'hand_rearguard'), aware: 2, roams: false, until: HELD, leaves: true },
    { id: 'ud2_rats', x: 14, y: 23, monsters: many(12, 'deep_rat'), aware: 3, respawn: RESPAWN.day },
    // And at the second landing's east wall, standing (#794).
    { id: 'ud2_knockers3', x: 19, y: 22, monsters: [...many(3, 'deep_knocker'), 'keeper'], aware: 2, roams: false, respawn: RESPAWN.twoDays },
    // The crawlers from the third flight down, off the ceiling.
    { id: 'ud2_crawlers1', x: 16, y: 20, monsters: many(2, 'deep_crawler'), aware: 3, respawn: RESPAWN.twoDays },
    { id: 'ud2_keepers', x: 16, y: 16, monsters: many(4, 'keeper'), aware: 2, respawn: RESPAWN.twoDays },
    // The sixth flight's, two crawlers where the brief has three: with three a day here broke off at 7.85
    // fights, past the gate's limit of 9 (#758).
    { id: 'ud2_crawlers2', x: 16, y: 12, monsters: many(2, 'deep_crawler'), aware: 3, respawn: RESPAWN.twoDays },
    { id: 'ud2_knockers', x: 16, y: 8, monsters: [...many(3, 'deep_knocker'), 'keeper'], aware: 2, roams: false, respawn: RESPAWN.twoDays },
    // The Catcher at the foot, among the ones it caught: it drops nothing and never comes back.
    { id: 'ud2_catcher', x: 16, y: 4, monsters: ['catcher', ...many(2, 'deep_crawler')], leader: 'catcher', aware: 3, roams: false, boss: true, slainText: 'It comes off the ceiling all at once, and lies on the steps among the ones it caught. Nothing is moving above you now.' },
  ],
};
