// Cinderport, the far side's port: Ashfall's town, band 24-26, behind G10's gate, Act IV's only town and
// the road's last before Hearth Isle. Basalt limed pale above the sills, ash along the foot of every
// wall and vines over the windows: in at the south gate from the trading ground, where a Rider waits by
// the rail, and up the street to the quay on the harbour, where the Compact's ship ties up at the
// steps under the factor's house and the last crossing leaves from the same steps, a column of light
// beyond the Sound. The inn, the temple, the armourer's (the act's step), the chandler's (the stone
// cure), the yard that trains to 27, the Cartographers' second hall, the Compact's house and the
// potter's. No spell hall: tier 7 is Rime Lodge's. docs/areas/ashfall.md §4.4 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';
import { ARMOURER, CURES } from '../items.ts';
import { GATE, FOUNDING_RAISED } from './cindercoast_g10.ts';
import { SHOVEL_STORY } from './firemount_g11.ts';
import { COMPACT_SHIP, RIDERS_RIDE, LAST_CROSSING, sells } from '../../../crossings.ts';
import { MASON_PASSAGE } from '../../whitespine/maps/sheerpoint_i8.ts';
import { HORSE_ASKED, HORSE_BROKEN, HORSE_WHOLE, GARDEN_BROUGHT, GARDEN_LIFTED, GARDEN_DRAUGHT } from '../../glasswold/maps/wold_d8.ts';
import { ORDERS_ASKED, ORDERS_SEALED, ORDERS_TOLD, ORDERS_BURNED } from '../../glasswold/maps/wold_c8.ts';

/**
 * The Founding Stone (#56's 50, #519): the stone carried up from Old Cinder's undercroft and handed to
 * the potter; then raised on the trading ground (FOUNDING_RAISED, G10's), or taken back down to the dead.
 */
export const FOUNDING_UP = 'q_founding_up';
export const FOUNDING_LEFT = 'q_founding_left';
/**
 * The Shovel That Does Not Blunt (#56's 52, #519): the shovel-head, its story found, sold through the
 * smith to the thane's agent or to the Wardens, or kept, hafted.
 */
export const SHOVEL_THANE = 'q_shovel_thane';
export const SHOVEL_WARDENS = 'q_shovel_wardens';
export const SHOVEL_KEPT = 'q_shovel_kept';

export const CINDERPORT: MapDef = {
  id: 'cinderport',
  name: 'Cinderport',
  kind: 'town',
  band: [24, 26],
  region: 'ashfall',
  start: { x: 8, y: 14, facing: NORTH },
  // Basalt in pale lime, the doors tarred, the streets' flags grey with ash and the banners an ember's red.
  palette: { wall: '#58575c', wallDark: '#2f2e33', floor: '#8b8680', door: '#2a2420', banner: '#9c4a2c' },
  rows: [
    '################',
    '#WWWWWWWWWWWW"W#',
    '#WWWWWWWWWWWW"W#',
    '#""""""""""""""#',
    '#BBBB"""=BBBBDB#',
    '#BBBD"""=DBBBBB#',
    '#BBBB"""=BBBBBB#',
    '#"""""""=""""""#',
    '#BBDBBBB=BBBBBB#',
    '#BBBBBBD=DBBBBB#',
    '#BBBBBBB=BBBBBB#',
    '#"""""""=""""""#',
    '#BDBB:::=::BBBB#',
    '#BBBB:::=::DBBB#',
    '#BBBB:::=::BBBB#',
    '########=#######',
  ],
  // Either side of the gate, as a company comes in off the trading ground and as it goes out.
  banners: [{ x: 7, y: 15 }, { x: 9, y: 15 }],
  exits: [
    { x: 8, y: 15, to: 'cindercoast_g10', tx: GATE.x, ty: GATE.y + 1, tf: SOUTH, label: 'You go out by the gate onto the Riders\' grass, and the ash beyond it.' },
  ],
  features: [
    // Inside the gate: the gate-ward, the Riders' rail and the Rider who sells the ride west to Akordu
    // (RIDERS_RIDE), which sets a company down here, just inside the gate (#547's 8); the yard and the
    // chandler's either side.
    { kind: 'event', x: 8, y: 13, id: 'cp_gate', once: true, text: 'The gate-ward grounds his pike and looks you over. Up the street, masts.' },
    { kind: 'npc', x: 9, y: 13, name: 'A Rider by the gate', lines: [
      'A Rider leans on the rail inside the gate, a rein over his arm and the horse behind him dozing.',
      '"West to the camp, a day over the ash and into the grass. We go at two, and we do not wait."',
    ], says: [
      // Once the Stone is lit the sentries walk the roads (#449), and the Riders know it.
      { after: { flag: 'q_ember_lit' }, lines: [
        'The Rider at the rail has his horse saddled and his bow strung.',
        '"West at two, still. But there is iron walking the road since the Stone took light, and yesterday there was none."',
      ] },
    ], passage: sells('cinderport', RIDERS_RIDE) },
    { kind: 'event', x: 10, y: 12, id: 'cp_rail', once: true, text: 'A rail inside the gate where the Riders tie their horses on trading days. A trough, and dung swept into the ash.' },
    { kind: 'event', x: 5, y: 13, id: 'cp_driftwood', once: true, text: 'Driftwood stacked by the yard wall for the fire-baskets, white with salt and grey with ash.' },
    { kind: 'event', x: 6, y: 12, id: 'cp_mountain', once: true, when: { hours: 'day' }, text: 'Over the yard wall Fire Mountain stands to the south, smoking. Nobody in the street looks up.' },
    { kind: 'event', x: 6, y: 12, id: 'cp_mountain_night', once: true, when: { hours: 'night' }, text: 'Over the yard wall the mountain shows red at its mouth, and the yard\'s fire-baskets are lit.' },
    { kind: 'trainer', x: 2, y: 12, name: 'The Ash Yard', maxLevel: 27, interior: 'cinderport_yard' },
    // The chandler's: provisions, lamp oil and the stone cure (#546), and the Riders' trade on trading days.
    { kind: 'shop', x: 11, y: 13, name: 'The Chandler\'s', stock: ['rations', 'torch', 'lantern_oil', 'potion_heal', 'antidote', 'elixir', 'potion_sp', 'potion_sp_great', ...CURES], interior: 'cinderport_chandlery' },

    // The lane under the walls.
    { kind: 'event', x: 1, y: 11, id: 'cp_lime', once: true, text: 'Under the west wall a man limes a doorstep white. Ash settles on it while he works.' },
    { kind: 'event', x: 14, y: 11, id: 'cp_heap', once: true, text: 'Ash swept into a heap at the lane\'s end. By morning the wind off the mountain brings it back.' },

    // Up the street: the armourer's, the smith's, who sells the act's step (#542), and the potter's
    // across from it. The smith gives The Shovel That Does Not Blunt and the potter The Founding Stone
    // (#56's 52 and 50, #519); the scavenger off the mountain is at the smith's once his story is told.
    { kind: 'shop', x: 9, y: 9, name: 'The Hide and Hammer', stock: [...ARMOURER], interior: 'cinderport_armourer' },
    { kind: 'npc', x: 9, y: 9, name: 'Gorran, the smith', flag: 'q_shovel', lines: [
      'A broad man at the forge, a drake\'s hide laced on its frame behind him to cure.',
      '"Gorran. Drake hide for coats, the mountain\'s slag for maces, basalt for a shield. What the coast has, I make into what it kills you with."',
      '"And a shovel-head off a scavenger from the vents. Grey, smooth, and it will not take a burr. I have tried."',
      '"The thane\'s agent wants it, and the Wardens. Find me where he gets them, and it is yours to sell or keep."',
    ], says: [
      { after: { flag: SHOVEL_THANE }, lines: ['Gorran at his anvil, a drake\'s hide curing behind him.', '"The thane\'s forges will have it in pieces by spring, to learn it."'] },
      { after: { flag: SHOVEL_WARDENS }, lines: ['Gorran at his anvil, a drake\'s hide curing behind him.', '"The Wardens put it in a box, and the box in a vault. Nobody learns anything."'] },
      { after: { flag: SHOVEL_KEPT }, lines: ['Gorran looks at the grey shovel on your back.', '"Has it dulled yet? No. Nor will it."'] },
      { after: { flag: SHOVEL_STORY }, lines: ['Gorran turns the grey shovel-head in the forge\'s light.', '"Off one of the walking boilers under the mountain, then. And where there is one, there are more."'], choice: { ask: '"Yours to sell, or I haft it for you."', answers: [
        { label: 'Sell it to the thane\'s agent.', sets: SHOVEL_THANE, pay: { gold: 1000, xp: 1800 }, says: ['"He pays in the thane\'s gold, and asks where it came from. I tell him the vents."'] },
        { label: 'Sell it to the Wardens.', sets: SHOVEL_WARDENS, pay: { gold: 600, xp: 1800 }, says: ['"They pay less, and ask nothing. That is the Wardens."'] },
        { label: 'Haft it.', sets: SHOVEL_KEPT, gives: 'grey_shovel', pay: { xp: 1800 }, says: ['He sets it on a haft of ash and binds it with wire.', '"It will not take a burr. Nor will it lose its edge."'] },
      ] } },
    ] },
    { kind: 'npc', x: 9, y: 9, name: 'A scavenger off the mountain', after: { flag: SHOVEL_STORY }, lines: [
      'A thin man at the counter, grey dust in the creases of his hands, his sack at his feet.',
      '"My ledge is found, so I sell the last of it and go. He pays fair."',
    ] },
    { kind: 'npc', x: 7, y: 9, name: 'The Potter\'s', interior: 'cinderport_potter', lines: [
      'Shelves of cups in the old Cinder style, beakers flared on a short foot, some under an ash glaze and some bare red clay.',
      'At the back the kiln, a beehive of brick, its fire in the mouth.',
    ] },
    { kind: 'npc', x: 7, y: 9, name: 'Jenifer, the potter', flag: 'q_founding', lines: [
      'A woman at the kick wheel, red clay to the elbow, a cup rising under her hands.',
      '"Jenifer. The town drinks from my cups, and the dead under the ash from the old ones. The same shape, and the same clay, out of the pit in the vines."',
      '"The first who came down off the mountain made them so. I make them so."',
      '"The town was founded on a stone, and it lies under the ash in Old Cinder. Somebody should bring it up."',
    ], quest: { item: 'founding_stone', reward: 0, setFlag: FOUNDING_UP, done: [
      'She stops her wheel and takes the stone in both arms.',
      '"Their cup, and their names. I make it so because they did."',
    ], early: [
      'She sees the stone in your arms, and stops her wheel.',
      '"That is the town\'s. Where did you find it? Give it here."',
    ] }, says: [
      { after: { flag: FOUNDING_RAISED }, lines: ['Jenifer at her wheel, a cup rising in the old shape.', '"The Riders spit when they pass it. Their grandmothers did not."'] },
      { after: { flag: FOUNDING_LEFT }, lines: ['Jenifer at her wheel, ash on her boots to the knee.', '"It is back in its niche, and dusted. Nobody asked me where I went."'] },
      { after: { flag: FOUNDING_UP }, lines: ['Jenifer has the stone on her bench, a cloth over it.'], choice: { ask: '"Does it stand on the trading ground, for the town? Or go back to the dead?"', answers: [
        { label: 'The trading ground.', sets: FOUNDING_RAISED, pay: { xp: 1500 }, says: ['"Then the town sees what it stands on. The Riders will not like it."'] },
        { label: 'Back to the dead.', sets: FOUNDING_LEFT, pay: { xp: 1500 }, says: ['"Then I take it down myself at first light, and dust it."'] },
      ] } },
    ] },

    // The Cartographers' second hall (#443, call 7): its map of the far side and the Meridian journals'
    // shelf, three and a gap for the fourth. Its guildsman gives the Wold's The Horse That Came Back and
    // takes what sat the horse, whole, at any meeting (#56's 51, #532); the Guild's last rungs (#635: the
    // Surveyor's with #516, the Mapmaker's with #22) are others'; the hall offers and pays the Guild's
    // one ladder, as every hall of it does.
    { kind: 'npc', x: 3, y: 8, name: 'The Chart House', interior: 'cinderport_cartographers', hall: 'cartographers', lines: [
      'Limewash above the sills, and north light. On the wall the far side as the Guild has it: the coast inked, the land behind it blank where the ink stops.',
      'A shelf of three journals in one green binding against a stone, and before the stone a gap a book wide.',
    ],
    // The fourth journal's fair copy fills the gap once the Surveyor's rung is paid (#516, #635).
    says: [{ after: { flag: 'q_carto_journal_done' }, lines: [
      'Limewash above the sills, and north light. On the wall the far side as the Guild has it: the coast inked, the land behind it blank where the ink stops.',
      'A shelf of four journals in one green binding against a stone, the fourth a fair copy in a clerk\'s hand.',
    ] }] },
    { kind: 'npc', x: 3, y: 8, name: 'Cador Lusk, of the Cartographers\' Guild', flag: HORSE_ASKED, lines: [
      'A thin man at the plotting table, a rule in one hand and a pin in the other, ash in the creases of his coat.',
      '"Cador Lusk. The Guild\'s man on this side of the Sound, and this is its hall, such as it is."',
      '"Three of Fane\'s on the shelf, and a space. Fane wrote wherever they stopped, and they stopped at the Stone."',
      '"And a Rider\'s horse came home out of the Glass with a thing of glass in its saddle. The Riders will break it. I want it whole."',
    ], quest: { item: 'saddle_walker', reward: 0, setFlag: HORSE_WHOLE, done: [
      'He has it set on the plotting table, and walks round it twice without touching it with his pin.',
      '"The first thing out of the Glass anyone has held. The Guild inks the Glass\'s edge tonight."',
    ], early: [
      'He looks up from the plotting table at what you carry, and puts down his rule.',
      '"That came out of the Glass. Set it there. The Guild inks the Glass\'s edge tonight."',
    ], after: ['"The Glass\'s edge on the Guild\'s map, and the first thing out of it on the Guild\'s table."'] },
    // The Mapmaker's rung paid (`q_carto_fane_done`) puts a pin past the vents; it is first, for the first that holds is said (#635).
    says: [
      { after: { flag: 'q_carto_fane_done' }, lines: ['"Four of Fane\'s on the shelf, and a pin in the map past the vents. The Guild has the Company to its end."'] },
      { after: { flag: 'q_carto_journal_done' }, lines: ['"Four of Fane\'s on the shelf now. The Guild has the Company as far as the vents, and no further."'] },
      { after: { flag: [HORSE_ASKED, HORSE_BROKEN] }, lines: ['"Broken, the Riders say. The Guild has a story out of the Glass, and no glass."'] },
    ] },

    // The cross street: the vines over the west wall, and a cup in the old shape on a doorstep.
    { kind: 'event', x: 1, y: 7, id: 'cp_vines', once: true, text: 'Vines hang over the town wall from the shore\'s trees, and over the windows. They are cut back, and they come back.' },
    { kind: 'event', x: 14, y: 7, id: 'cp_cup', once: true, text: 'An old woman on her doorstep drinks from a red clay cup, flared on a short foot.' },

    // The square by the quay, the temple on it (cures and raising at the band's price, the stone lifted
    // at 80 a level), and the inn across the street, where the crews and the Riders sleep between crossings.
    { kind: 'well', x: 6, y: 5, text: 'A cistern under the square, its grating swept. The water tastes of ash.' },
    { kind: 'temple', x: 4, y: 5, name: 'The Harbour Temple', interior: 'cinderport_temple' },
    // The Garden of Glass (#56's 55, #532): a priest at the door for a company carrying the boy of glass
    // from Akordu, who takes him in and lifts the stone at the temple's price, 80 a level at the quest's
    // 28 (`templePrice`), or lets a draught of the company's do it.
    { kind: 'npc', x: 4, y: 5, name: 'A priest of the Harbour Temple', after: [{ item: 'glass_boy' }, { flag: GARDEN_BROUGHT }], lines: [
      'A priest in grey sweeps the temple step.',
      '"Stone we lift, at eighty a level. The Riders bring us none. They keep theirs."',
    ], quest: { item: 'glass_boy', reward: 0, setFlag: GARDEN_BROUGHT, done: [
      'The priest sees what you carry, and has the boy laid on the stone by the altar.',
      '"A Rider\'s boy, glassed a long while. Stone we lift, at eighty a level, or a draught of yours will do it."',
    ], after: ['The priest sweeps the temple step.', '"The Rider\'s boy went home on the Riders\' ride, his eyes on the ground."'] }, says: [
      { after: { flag: GARDEN_BROUGHT }, until: [{ flag: GARDEN_LIFTED }, { flag: GARDEN_DRAUGHT }], lines:['The boy of glass lies on the stone by the altar, his hand up to his eyes.'], choice: { ask: '"At the temple\'s price, or with a draught of yours?"', answers: [
        { label: 'Lift him.', price: 2240, sets: GARDEN_LIFTED, pay: { xp: 1800 }, says: ['The priest says the words over him, and the stone runs off him like water. He is a boy, shaking.', '"From the mesa I saw a crown standing up in the Glass. Something moved on it. Then the basilisk looked at me."'] },
        { label: 'Give him a draught.', takes: 'quickening', sets: GARDEN_DRAUGHT, pay: { xp: 1800 }, says: ['The draught goes between his lips, and the stone runs off him like water. He is a boy, shaking.', '"From the mesa I saw a crown standing up in the Glass. Something moved on it. Then the basilisk looked at me."'] },
      ] } },
    ] },
    { kind: 'inn', x: 9, y: 5, name: 'The Ship and Horse', price: 55, interior: 'cinderport_inn' },
    // The Mason's Tally (the Whitespine's #56's 48, #506): the deserter off Sheer Point, once a company
    // has bought his passage over the water (MASON_PASSAGE), by the inn's fire, a person who moves.
    { kind: 'npc', x: 9, y: 5, name: 'A mason off the Point', after: { flag: MASON_PASSAGE }, lines: [
      'A man by the inn\'s fire with white dust still in the seams of his hands, his back to the wall.',
      '"Nobody here has heard of the Point. I mean to keep it so."',
    ] },

    // The Compact's house, the factor's, over its steps on the quay: the Compact's second hall
    // (#443, call 7), which offers and pays its one ladder, the Fence's rung among it (#635). The
    // factor gives the Wold's Orders on the Scarp Stair, her runner's orders carried to the Riders
    // (#56's 54, #532); the crate in the corner is others' and never said.
    { kind: 'npc', x: 13, y: 4, name: 'The Factor\'s House', interior: 'cinderport_factor', hall: 'compact', lines: [
      'Ledgers in a row on the high shelf, all one binding, and one open by the ink. Scales, a strongbox, manifests on their spike.',
      'In the corner, apart, a crate under the Helmstow customs seal, corded and waxed.',
    ] },
    { kind: 'npc', x: 13, y: 4, name: 'Hendra, the Compact\'s factor', flag: ORDERS_ASKED, lines: [
      'A grey-haired woman at the counting table, her pen moving while she looks at you.',
      '"Hendra. I keep the Compact\'s house on this side. The ship comes in and I write it down. She goes out and I write that down."',
      '"Ruan reads it, in time. Ruan reads everything, in time."',
      '"My runner is on the Scarp stair with orders for the Riders, and slow. Carry them the rest of the way."',
    ], says: [
      { after: [{ flag: ORDERS_SEALED }, { flag: ORDERS_TOLD }, { flag: ORDERS_BURNED }], lines: ['Hendra writes, and does not look up.', '"My runner is down the stair again. What the Riders did with my orders, Ruan will read, in time."'] },
    ] },

    // The quay along the harbour, west to east: the boats under the harbour wall, the doc's line where the
    // street comes down, the harbourmaster, who sells the last crossing to Hearth Isle (LAST_CROSSING),
    // and the Compact's steps and pier, where the ship ties up and her master sells the way back to
    // Kilnhaven, halved for a member of the Compact (COMPACT_SHIP, #547's 7). Both put a company down on
    // the steps (13,2).
    { kind: 'event', x: 1, y: 3, id: 'cp_boats', once: true, text: 'Fishing boats drawn up under the harbour wall, black-hulled, ash in their bilges.' },
    { kind: 'event', x: 8, y: 3, id: 'cp_quay', once: true, text: 'The Compact\'s ship rides at the quay with Kilnhaven\'s mark on her. Beyond the Sound, a column of light.' },
    { kind: 'npc', x: 11, y: 3, name: 'Morwenna, harbourmaster of Cinderport', lines: [
      'A woman in an oilskin on the quay, a slate under her arm and chalk in her fist.',
      '"Morwenna. Harbourmaster. The Compact\'s ship I chalk in and out, and the boat over the Sound."',
      '"The other boat goes over the Sound to Hearth Isle, from the same steps, and comes back. That is all I write."',
    ], passage: sells('cinderport', LAST_CROSSING) },
    { kind: 'npc', x: 14, y: 3, name: 'Jago, master of the Compact ship', lines: [
      'The broad man in the Compact coat by the steps, watching his crew unload more than he watches you.',
      '"Jago. She ties up here and goes back to Kilnhaven, and the Compact\'s folk ride at half."',
      '"What she carries is the Compact\'s business, and the factor\'s book."',
    ], passage: sells('cinderport', COMPACT_SHIP) },
    { kind: 'event', x: 13, y: 2, id: 'cp_steps', once: true, text: 'The Compact\'s steps under the factor\'s house, worn hollow. The ship\'s boat knocks at the ring-bolts.' },
    { kind: 'event', x: 13, y: 1, id: 'cp_pier', once: true, text: 'The pier\'s end: tarred posts, a lantern on a hook, and the ship\'s lines creaking.' },
  ],
};
