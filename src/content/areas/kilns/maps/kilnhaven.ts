// Kilnhaven, the ore port: the Kilns' second town, band 16-18, behind L6's gate. A walled port of grey
// rubble and tarred timber, red with the ore's dust: in at the east gate to the inn yard, where the
// coach for Rime Lodge stands, and down the street to the quay along the harbour, where the ferry for
// Saltmouth and the Compact ship's boat put in. The inn, the smith (Anvilhall's step at a quarter
// more, and never shut), the ore shed that trains to 19, the harbourmaster's office where the
// manifests are read, the Lanterns' chapel and the chandlery; and on the street Tallis's man, waiting
// on a parcel from the smelter (#56's 35). No spell hall and no guild hall (#434's 8 and 9), and no
// fare halved for any guild. docs/areas/kilns.md §4.14 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST, WEST } from '../../../../game/types.ts';
import { FORGE, SMITH_PRICES } from '../items.ts';
import { TAKEN } from './anvilhall.ts';
import { FERRY, COMPACT_SHIP, DROVE_COACH, sells } from '../../../crossings.ts';

/** The manifests read by the harbourmaster, the Compact ship's cargo named: the chapter's step at Kilnhaven (#470). */
export const MANIFESTS_READ = 'manifests_read';
/** The dwarf on the quay heard, who says the corridors under the Tiefzeche run south toward the lakes (§5); the chapter may read it. */
export const DWARF_MET = 'kh_dwarf_met';

export const KILNHAVEN: MapDef = {
  id: 'kilnhaven',
  name: 'Kilnhaven',
  kind: 'town',
  band: [16, 18],
  region: 'kilns',
  start: { x: 14, y: 7, facing: WEST },
  // Grey rubble limed at the joints, doors tarred black, and the port's banners the ore's red.
  palette: { wall: '#7c7c78', wallDark: '#4c4c4a', floor: '#7a6e66', door: '#2c2624', banner: '#8a4630' },
  rows: [
    '################',
    '#WWW"BBBB""BBBB#',
    '#WWW"BBBB""BBBB#',
    '#WWW"BDBB""BBBB#',
    '#WWW"""""""BDBB#',
    '#WWW"DBB"""::::#',
    '#WWW"BBB"""::::#',
    '#WWW"===========',
    '#WWW"""""""::::#',
    '#WWW"BBB"BDB:::#',
    '#WWW"DBB"BBBBBB#',
    '#WWW"BBB""""BBB#',
    '#WWW""""""""BBB#',
    '#WWW"DBBB"""BBB#',
    '#WWW"BBBB"""BBB#',
    '################',
  ],
  // Either side of the east gate, as a company comes in and as it goes out.
  banners: [{ x: 15, y: 6 }, { x: 15, y: 8 }],
  exits: [
    { x: 15, y: 7, to: 'kilnmouth_l6', tx: 29, ty: 4, tf: EAST, label: 'You go out by the east gate, and the gulls stay behind the wall.' },
  ],
  features: [
    // The inn yard inside the gate, where the coach for Rime Lodge stands and its coachman waits, and
    // the inn on it. The coach sets a company down here (DROVE_COACH), on the town's own map.
    { kind: 'event', x: 13, y: 7, id: 'kh_yard', once: true, text: 'The inn yard: straw, a trough and the coach for Rime Lodge, its pole down. Down the street, masts.' },
    { kind: 'inn', x: 12, y: 4, name: 'The Guard\'s Horn', price: 35, interior: 'kilnhaven_inn' },
    { kind: 'npc', x: 13, y: 5, name: 'Murdo, the coachman', lines: [
      'A man in a long coat greasing a wheel of the coach, the horses not put to.',
      '"Murdo. The coach for Rime Lodge, by the drove road over the moor. Two hundred and fifty the run, and she goes at six."',
      '"A day of it, and no stop on the moor."',
    ], passage: sells('kilnhaven', DROVE_COACH) },
    { kind: 'sign', x: 14, y: 5, text: 'A board on the yard wall, lettered by a careful hand: RIME LODGE.' },
    { kind: 'event', x: 14, y: 9, id: 'kh_trough', once: true, text: 'A trough by the yard wall, red at the bottom with the ore\'s dust. The horses drink it anyway.' },

    // The street down to the quay: the chandlery on it, the pump in the square and the ore's dust.
    { kind: 'event', x: 8, y: 7, id: 'kh_dust', once: true, text: 'Red dust in the gutters and on every sill, off the ore carts. It gets into the bread.' },
    // Jory Tallis's man, come for the crown the smiths at the smelter are making (#56's 35): his words
    // and nothing more, as Eckhart's and Kerensa's are; the choice put to a company and its flag are
    // #471's. The crown is never named, and nobody says whose head it is for.
    { kind: 'npc', x: 7, y: 8, name: 'Wiebe, Jory Tallis\'s man', lines: [
      'A man in a good dark coat on a crate at the street\'s edge, his eyes on the east gate. His boots are clean of the red dust.',
      '"Wiebe. I am Jory Tallis\'s man, from Saltmouth. I wait on a parcel up from the smelter, and it is late."',
      '"What is in it? Tallis has not said. I am paid to wait, not to ask."',
    ] },
    { kind: 'shop', x: 10, y: 9, name: 'The Chandler\'s', stock: ['rations', 'torch', 'lantern_oil', 'potion_heal', 'antidote', 'elixir', 'potion_sp', 'potion_sp_great'], interior: 'kilnhaven_chandlery' },
    { kind: 'well', x: 9, y: 6, text: 'A pump in the square. The water is sweet, and the bucket under it red with dust.' },

    // The quay along the harbour, north to south: its end under the sea wall, the dwarf who will go no
    // further down, the board of sailings, the harbourmaster's office, the ferry's steps, the smith's,
    // the Compact's steps where the ship's boat comes in, and the ore shed.
    { kind: 'event', x: 4, y: 1, id: 'kh_mouth', once: true, text: 'The quay\'s end under the sea wall. Past the harbour mouth the sea goes out grey to the far side.' },
    { kind: 'npc', x: 4, y: 2, name: 'A dwarf on a bollard', lines: [
      'An old dwarf sits on a bollard with a pick across his knees, looking at the sea and not the town.',
      '"Forty years I cut the Tiefzeche. Under the bottom the corridors run south. Under the moor, under the world. Toward the lakes."',
      '"I go no further down. I came to look at the sea."',
    ], flag: DWARF_MET },
    { kind: 'sign', x: 4, y: 4, text: 'The board of sailings, two names chalked on it: SALTMOUTH. CINDERPORT.' },
    // The harbourmaster's office, a room with her in it (as Anvilhall's great hall holds its thane):
    // she reads the manifests for a company that asks, and the Compact's cargo is named (§5).
    { kind: 'npc', x: 5, y: 5, name: 'The Harbourmaster\'s Office', interior: 'kilnhaven_harbourmaster', lines: [
      'A bay of small panes over the harbour, the sea\'s light on every desk. Dockets on their spike, and the board of sailings.',
      'On the high desk, under the seal, the manifests.',
    ] },
    { kind: 'npc', x: 5, y: 5, name: 'Irmgard, harbourmaster of Kilnhaven', flag: MANIFESTS_READ, lines: [
      'A dwarf at the high desk, a pen behind her ear. "Irmgard. Harbourmaster. What leaves Kilnhaven, I write down."',
      'She turns the manifests round for you. Iron to Cinderport, by the ton. Then a page in another hand: crates, sealed, for Cinderport and Sheer Point. No weight given.',
      '"The Compact writes its own page. Cinderport I know. Nothing puts in at Sheer Point."',
    ], says: [
      { after: { flag: MANIFESTS_READ }, lines: ['"Iron by the ton, and the Compact\'s crates by nobody\'s weight. I write down what I am told."'] },
    ] },
    // The ferry to Saltmouth (FERRY): its master at the steps, the same man on Saltmouth's quay.
    { kind: 'npc', x: 4, y: 6, name: 'Dunstan, master of the ferry', lines: [
      'A man at the ferry\'s steps with a boat-hook, the ferry warped in below him, red dust in her seams.',
      '"Dunstan. The ferry, over to Saltmouth and back. Four hundred the boat, two days, and she sails at eight."',
      '"Saltmouth folk come over for iron. The dwarves never come over at all. They don\'t trust the water."',
    ], passage: sells('kilnhaven', FERRY) },
    { kind: 'event', x: 4, y: 7, id: 'kh_quay', once: true, text: 'The quay: bollards red with ore dust, the ferry\'s steps going down green and the harbour grey under the wall.' },
    { kind: 'event', x: 4, y: 8, id: 'kh_lantern', once: true, when: { hours: 'night' }, text: 'Off the port the Compact ship shows one lantern. A boat goes out to her without one.' },
    { kind: 'event', x: 4, y: 9, id: 'kh_tar', once: true, text: 'A tar pot on a fire by the quay, and a boat on her side for tarring.' },
    // The smith: the forge's step at a quarter more (#535), the company's only forge once Anvilhall's
    // is shut to it, and never shut itself.
    { kind: 'shop', x: 5, y: 10, name: 'The Anchor Smithy', stock: [...FORGE], prices: SMITH_PRICES, interior: 'kilnhaven_smith' },
    { kind: 'npc', x: 5, y: 10, name: 'Dietmar, the port\'s smith', lines: [
      'A dwarf at the brick forge, an anchor in on the floor for mending.',
      '"Dietmar. Hold steel, carted down from Anvilhall, and the cart costs. A quarter on the hold\'s price, to anyone."',
    ], says: [
      { after: { flag: TAKEN }, lines: ['"The thane shut his forge to you, I hear. Mine is open. A quarter on, to anyone."'] },
    ] },
    // The Compact ship (COMPACT_SHIP): its master on the steps where the ship's boat comes in.
    { kind: 'npc', x: 4, y: 11, name: 'Jago, master of the Compact ship', lines: [
      'A broad man in a Compact coat on the steps where the ship\'s boat comes in, watching his crew more than you.',
      '"Jago. She lies off the port, and she goes over to Cinderport and back."',
      '"What she carries is the Compact\'s business, and the harbourmaster\'s book."',
    ], passage: sells('kilnhaven', COMPACT_SHIP) },
    { kind: 'event', x: 4, y: 12, id: 'kh_steps', once: true, text: 'The Compact\'s steps, the ship\'s boat at the ring-bolts and two of her crew in it, not talking.' },
    { kind: 'trainer', x: 5, y: 13, name: 'The Ore Shed', maxLevel: 19, interior: 'kilnhaven_training_hall' },

    // North of the street: the Lanterns' chapel, its bell, and the lane to the sea wall.
    { kind: 'temple', x: 6, y: 3, name: 'The Sailors\' Chapel', interior: 'kilnhaven_chapel' },
    { kind: 'event', x: 6, y: 4, id: 'kh_bell', once: true, text: 'A ship\'s bell hung by the chapel door, green with salt. Its rope is worn bright.' },
    { kind: 'event', x: 10, y: 1, id: 'kh_nets', once: true, text: 'The lane ends at the sea wall, where a woman mends a net and does not look up.' },

    // South of the street: the warehouse and the court behind the smith's.
    { kind: 'event', x: 10, y: 11, id: 'kh_tubs', once: true, text: 'Ore tubs stacked empty by the warehouse, and a crane\'s boom laid by for mending.' },
    { kind: 'event', x: 11, y: 14, id: 'kh_rope', once: true, text: 'Rope coiled on pegs along the warehouse wall, tarred black, and the smell of it.' },
  ],
};
