// Hearthfane, the temple built round the column's foot, in at its door in the mound on H6 (18,14) and
// held by the Hand's best. The nave runs north from the door, three wide, a lamp in each of its corners
// that the Hand lit and the moths came in to; the vestry off its west, where the sacristan hides under
// the table (56); the treasury off its east, behind a door his key opens and nothing else; the court at
// its head, open to the column, where the preachers stand; and the altar, the stair down behind it to
// the crypt (#756). Band 28-29; docs/areas/hearth_isle.md §4.4 is its brief, §6 56's.
import type { Exit, Feature, MapDef } from '../../../../game/mapdef.ts';
import { anchored } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';
import { THRONE_REMOVED } from '../../shelf/public.ts';
import { RESPAWN } from '../../../../game/keys.ts';
import type { Flag } from '../../../index.ts';

/** Met the sacristan under the vestry's table (56). */
export const LAMPS = 'q_lamps';
/** The last lamp out in the pillar's order: the moths go to the light, and the swarm with them (§4.1). */
export const LAMPS_OUT = 'q_lamps_out';
/** A lamp put out before its turn: the swarm comes, and stays until the lamps are out (§4.1). */
export const LAMPS_WRONG = 'q_lamps_wrong';
/** The sacristan's key taken, 56 done. */
export const LAMPS_KEY = 'q_lamps_key';
/** His key, the treasury's: it opens that door and nothing else, and nothing else opens it. */
export const FANE_KEY = 'fane_key';
/** The carving on the nave's pillar, kept read by a company with a reader (game/inscriptions.ts). */
export const PILLARS = 'hearthfane:hf_pillars';
/** Each lamp's own flag, set as it goes out in its turn: the Sea, the Shore, the House, the Hearth. */
export const LAMP_FLAGS = ['lamp_sea', 'lamp_shore', 'lamp_house', 'lamp_hearth'] as const;

/**
 * The stair down behind the altar into the crypt, `hearthfane2` (#756), onto its foot facing up the
 * passage; the crypt's way back up lands on the altar's square, 8,2, facing south.
 */
export const STAIR: Exit = anchored({ x: 8, y: 1, to: 'hearthfane2', at: 'start', label: 'Down the stair behind the altar, into the crypt. The hum is louder below.' });

const many = (n: number, id: string): string[] => Array.from({ length: n }, () => id);

const WRONG = ['You pinch the wick, and the rest flare. The nave fills with wings.'];
const BURNING = 'A lamp on a stand, burning high.';

/**
 * A lamp in a corner of the nave, a person in the engine's terms with no face, as the Ember Stone's
 * sockets are. Out of its turn its answer is wrong and brings the swarm; in its turn, once the lamp
 * before it is out, it goes out, and stays out. The Sea lamp's turn is first, so it is never wrong.
 */
function lamp(i: 0 | 1 | 2 | 3, x: number, y: number, name: string, right: readonly string[], sets: Flag | readonly Flag[]): Feature {
  const ask = 'Put it out?';
  const out = { ask, answers: [{ label: 'Put it out.', sets, says: right }] };
  if (i === 0) return { kind: 'npc', x, y, name, until: { flag: LAMP_FLAGS[0] }, lines: ['A lamp on a stand of the rim\'s rock, burning high. The moths are thick on it.'], choice: out };
  return {
    kind: 'npc', x, y, name, until: { flag: LAMP_FLAGS[i] },
    lines: [BURNING],
    choice: { ask, answers: [{ label: 'Put it out.', sets: LAMPS_WRONG, says: WRONG }] },
    says: [{ after: { flag: LAMP_FLAGS[i - 1] }, lines: [`${BURNING} The moths have left the ${['Sea', 'Shore', 'House'][i - 1]} lamp for it.`], choice: out }],
  };
}

export const HEARTHFANE: MapDef<'hearthfane'> = {
  id: 'hearthfane',
  name: 'Hearthfane',
  kind: 'dungeon',
  band: [28, 29],
  region: 'hearth',
  // In at the door from the Bowl, at the nave's foot, facing up it.
  start: { x: 8, y: 14, facing: NORTH },
  anchors: { from_hearthfane2: { x: 8, y: 2, facing: SOUTH } },
  // The rim's rock, pale and warm, and the Hand's grey hung in the pilgrims' temple.
  palette: { wall: '#b8a890', wallDark: '#7a6c58', floor: '#8a7c64', ceiling: '#2a2420', door: '#5a4030', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#6a6866' },
  rows: [
    '################',
    '########.#######',
    '#####.......####',
    '#####.......####',
    '#####.......####',
    '#####.......####',
    '#######...######',
    '######.....#####',
    '#######...######',
    '##...##...##...#',
    '##...D.....D...#',
    '##...##...##...#',
    '##...##...##...#',
    '######.....#####',
    '#######...######',
    '########D#######',
  ],
  // The Hand's grey either side of the court's arch.
  banners: [{ x: 12, y: 2 }, { x: 12, y: 4 }],
  exits: [
    // Out by the door onto the Bowl before the mound, facing away from it.
    anchored({ x: 8, y: 15, to: 'hearthisle_h6', at: 'from_hearthfane', label: 'Out of the temple into the Bowl. The light is at your back.' }),
    // Down the stair behind the altar into the crypt (#756).
    STAIR,
  ],
  // The treasury's door opens to the sacristan's key and to nothing else: no iron key fits it.
  gates: [{ x: 11, y: 10, after: { item: FANE_KEY }, blockedText: 'Locked, and the lock is old. Nothing you carry fits it.' }],
  features: [
    // The nave, its lamps and the pillar that gives their order.
    { kind: 'event', x: 8, y: 13, id: 'hf_nave', once: true, text: 'The nave, and the pilgrims\' lamps lit in its four corners. The air is full of wings.' },
    { kind: 'sign', x: 8, y: 10, id: 'hf_pillars', text: 'Carved up the pillar in the oldest hand on the isle.', read: 'FIRST THE SEA. THEN THE SHORE. THEN THE HOUSE. LAST OF ALL THE HEARTH.' },
    lamp(0, 6, 13, 'The Sea lamp', ['You pinch the wick. The moths lift off it and go looking.'], LAMP_FLAGS[0]),
    lamp(1, 10, 13, 'The Shore lamp', ['You pinch the wick. Two lamps left, and the moths go to the nearer.'], LAMP_FLAGS[1]),
    lamp(2, 6, 7, 'The House lamp', ['You pinch the wick. One lamp left, and every moth in the nave is on it.'], LAMP_FLAGS[2]),
    lamp(3, 10, 7, 'The Hearth lamp', ['You pinch the last wick. For a breath the nave is black with wings, and then they go, all together, out through the court toward the light.'], [LAMP_FLAGS[3], LAMPS_OUT]),
    { kind: 'event', x: 7, y: 6, id: 'hf_dead', once: true, text: 'A champion of the Hand dead in the nave, his grey hands over his face. The moths have found him.' },
    // The vestry, and the sacristan under its table, 56's giver.
    { kind: 'event', x: 3, y: 10, id: 'hf_vestry', once: true, text: 'The vestry: vestments on their pegs, and the lamp-trimmer\'s tools laid out. Someone is breathing under the table.' },
    {
      kind: 'npc', x: 3, y: 11, name: 'The sacristan', flag: LAMPS,
      lines: [
        'A small man under the vestry table with his knees drawn up and a lamp-trimmer\'s hook in both hands. He does not come out.',
        '"I kept them dark. Forty years I kept them dark, because of the moths. The light outside is lamp enough for anybody." A breath. "Then the grey men lit them, all four, and the sky came in."',
        '"Put them out. Not any way: the pillar says the way, if you can read a pillar. Do it wrong and you will see why I kept them dark."',
      ],
      // A matching entry is said without his `flag` being set (meet(), game/people.ts), and the Sea and Shore
      // lamps stand in the first room, so a company may put one out before it has met him: the entry that holds
      // only once he is met waits on `LAMPS`, and the one a company can reach first sets it.
      says: [
        { after: { flag: LAMPS_OUT }, until: { flag: LAMPS_KEY }, sets: LAMPS, lines: [
          'He is out from under the table, standing with his face turned up to the empty air.',
          '"Gone. Every one of them, to the big lamp outside, where they belong." He takes a key off his belt. "The treasury. The pilgrims\' offerings are the Hearth\'s, but the grey men left their gear in there, and that is nobody\'s. Take it."',
        ], choice: { ask: 'He holds out the key.', answers: [{ label: 'Take the key.', sets: LAMPS_KEY, gives: FANE_KEY, pay: { xp: 3000 }, says: ['An iron key, warm from his belt. He is already looking at the wicks.'] }] } },
        { after: { flag: LAMPS_KEY }, lines: ['The sacristan is trimming wicks in the vestry, and not lighting them.', '"Dark again. I can hear myself think."'] },
        { after: { flag: [LAMPS, LAMPS_WRONG] }, until: { flag: LAMPS_OUT }, lines: ['From under the table: "I told you. The pillar. Read the pillar."'] },
      ],
    },
    // The treasury, behind its door: the pilgrims' offerings, and the Hand's steel left among them.
    { kind: 'event', x: 13, y: 10, id: 'hf_treasury', once: true, text: 'The pilgrims\' offerings of four hundred years, in heaps. Among them, the Hand\'s own gear, laid down here and not taken up again: steel from below.' },
    { kind: 'chest', x: 13, y: 11, id: 'hf_offerings', gold: 3000, items: ['grey_blade', 'grey_bow'] },
    // The court at the nave's head, open to the column; its arch, and the altar with the stair behind it.
    { kind: 'event', x: 8, y: 4, id: 'hf_court', once: true, text: 'The court, open to the sky, and the column coming down into it through the east arch. It is too bright to look at and too close to look away from.' },
    { kind: 'sign', x: 11, y: 3, text: 'The arch gives on the column\'s foot. The stone of the arch is glassed where the light has touched it, four hundred years of mornings.' },
    // Under the arch, where the light comes in, the Hand's own offering to it, left with a guard on it (#794).
    { kind: 'chest', x: 11, y: 2, id: 'hf_tithe', gold: 1100, items: [] },
    { kind: 'event', x: 8, y: 3, id: 'hf_altar', once: true, text: 'An altar of the rim\'s rock, worn hollow where hands have lain on it. Behind it, a stair goes down, and the Hand\'s boot-marks go down it.' },
  ],
  encounters: [
    // The moths at the nave's foot while the lamps burn, and the swarm a wrong lamp brings: both go to the
    // light once the last is out, standing or not (the leave rule, #747). The Hand's best up the nave and
    // in the court, its hardest, never roaming; the court's second group goes once Vask is gone from
    // Helmstow by the Council's verdict. The garrison's rest (#794): two on the nave's treasury side, below
    // the crossing, and three more threes in the court, one beside the Hand's tithe under the arch.
    { id: 'hf_moths', x: 8, y: 12, monsters: many(12, 'hearth_moth'), aware: 3, respawn: RESPAWN.half, until: { flag: LAMPS_OUT }, leaves: true },
    { id: 'hf_champions', x: 8, y: 8, monsters: many(4, 'ashen_champion'), aware: 2, roams: false, respawn: RESPAWN.twoDays },
    { id: 'hf_sermon', x: 8, y: 5, monsters: [...many(3, 'ashen_champion'), 'ashen_preacher'], back: 1, aware: 3, roams: false, respawn: RESPAWN.twoDays },
    { id: 'hf_second', x: 6, y: 4, monsters: [...many(2, 'ashen_champion'), 'ashen_preacher'], back: 1, aware: 2, roams: false, respawn: RESPAWN.twoDays, until: { flag: THRONE_REMOVED }, leaves: true },
    { id: 'hf_nave2', x: 9, y: 11, monsters: many(2, 'ashen_champion'), aware: 2, roams: false, respawn: RESPAWN.twoDays },
    { id: 'hf_court1', x: 5, y: 2, monsters: many(3, 'ashen_champion'), aware: 2, roams: false, respawn: RESPAWN.twoDays },
    { id: 'hf_court2', x: 10, y: 2, monsters: many(3, 'ashen_champion'), aware: 2, roams: false, respawn: RESPAWN.twoDays },
    { id: 'hf_court3', x: 11, y: 5, monsters: many(3, 'ashen_champion'), aware: 2, roams: false, respawn: RESPAWN.twoDays },
    { id: 'hf_swarm', x: 8, y: 9, monsters: many(12, 'hearth_moth'), aware: 3, respawn: RESPAWN.half, after: { flag: LAMPS_WRONG }, until: { flag: LAMPS_OUT }, leaves: true },
  ],
};
