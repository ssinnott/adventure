// The Glasswold, box D8: Akordu, the Riders' camp. Core, band 27: the white tents in a ring on trodden
// ground under the mesa's south face, the eldest's against the rock, the camp's fires in the middle, the
// trader's tent on its east side and the wells under the mesa, one of them dry and with no rope; the
// horse-lines to the west, where the Rider's ride from Cinderport comes in and goes back, and the horse
// that came back tethered apart; the garden of glass at the camp's east edge, its figures facing
// south-west. The Riders' track comes in over the south edge from D9. Round the camp the lions come
// at the horses by night, vultures wait over the garden, glass scorpions hole up in the broken ground
// under the mesa's east face and a basilisk lies in its shade on the north side, the box's hardest at
// 27. North, the grazing and the hills.
// Cut from the atlas by tools/scaffold.ts; docs/areas/glasswold.md §4.4 is its brief (#526).
import type { MapDef } from '../../../../game/map.ts';
import { EAST, NORTH } from '../../../../game/types.ts';
import { RIDERS_RIDE, sells } from '../../../crossings.ts';
import { CURES } from '../../ashfall/items.ts';
import { LIT } from '../../ashfall/maps/ember_stone.ts';
import { ROAD_WEST } from '../../ashfall/maps/emberwaste_e10.ts';
import { LION_ASKED, LION_HUNT, LION_LEFT, LION_TOLD, LION_TAKEN, LION_DOWN } from './wold_b8.ts';
import { ORDERS_SEALED, ORDERS_TOLD, ORDERS_BURNED } from './wold_c8.ts';

/** The flag the eldest's telling sets, said once: The Warning's step at Akordu keys on it (#531). */
export const STORY = 'akordu_story';

/**
 * The Horse That Came Back (#56's 51, #532): asked at the Chart House in Cinderport (`HORSE_ASKED`), the
 * Rider with a hammer breaks what sits the horse (`HORSE_BROKEN`), or the company takes it whole
 * (`HORSE_CARRIED`) to Cador Lusk (`HORSE_WHOLE`). The Garden of Glass (#56's 55): the mother among the
 * figures asks (`GARDEN_ASKED`) and gives her son to be carried (`GARDEN_CARRIED`) to the Harbour Temple,
 * whose priest takes him in (`GARDEN_BROUGHT`) and lifts the stone (`GARDEN_LIFTED`), or a draught does
 * (`GARDEN_DRAUGHT`).
 */
export const HORSE_ASKED = 'q_horse', HORSE_BROKEN = 'q_horse_broken', HORSE_CARRIED = 'q_horse_carried', HORSE_WHOLE = 'q_horse_whole';
export const GARDEN_ASKED = 'q_garden', GARDEN_CARRIED = 'q_garden_carried', GARDEN_BROUGHT = 'q_garden_brought';
export const GARDEN_LIFTED = 'q_garden_lifted', GARDEN_DRAUGHT = 'q_garden_draught';

export const WOLD_D8: MapDef = {
  id: 'wold_d8',
  name: 'The Wold',
  kind: 'outdoor',
  density: 'core',
  band: [26, 27],
  region: 'glasswold',
  start: { x: 16, y: 31, facing: NORTH },
  // The tents are white felt.
  palette: { wall: '#e4dac8', wallDark: '#a89c86', door: '#5a3a24', wallStyle: 'smooth' },
  rows: [
    'sssssss^^sssssssssssssssssssssss',
    'ssssssssssssssssssssssssssssssss',
    'ssssssssssssssssssssssssssssssss',
    'sssssssssssssssssss^^sssssssssss',
    'ssssssssssssssssss^^^sssssssssss',
    'sssssssssssssssss^^^^^ssssssssss',
    'sssssssssssssss^^^^^^^ssssssssss',
    'ssssssssssssss^^^^^^^^^sssssssss',
    'ssssssssssssss^^^^^^^^^^^^ssssss',
    'ssssssssssssss^^^^^^^^^^^^ssssss',
    'ssssssssssssss^^^^^^^^^^^^ssssss',
    'sssssssssssssss^^^^^^^s^^^ssssss',
    'ssssssssssssssssssssssssssssssss',
    'ssssssssssssrrrrrrssssssssssssss',
    'sssssssssssrrrrrrrrssrssssssssss',
    'ssssssssssrrrrrrrrrrsssrssssssss',
    'ssssssssssrrrrrrrrrrrsssssssssss',
    'ssssssssssrrrrrrrrrrssssssssssss',
    '^sssssssssrrrrrrrrrrssssrsssssss',
    '^sssssssssrrrrrrrrrrsrssssssssss',
    'ssssssssssrrrrrrrrrssssrssssssss',
    'sssssssssssrssrrrrrsssssssssssss',
    'ssssssssssssrSrrrrssssssssssssss',
    'ssssssssssssss::B::sssssssssssss',
    'ssssssssssss:B:::::B:sssscscssss',
    '^ssssssssss:::::::::::ssssssssss',
    '^^sssssssss::::::::::BBssscscsss',
    '^^^ssssssssB:::::::::DBsssssssss',
    '^^^^sssssss:::::::::::ssscsc^sss',
    '^^^^ssssssss:::::::::sssssssssss',
    '^^sssssssssssB:::::Bssssssssssss',
    'ssssssssssssssss:sssssssssssssss',
  ],
  features: [
    // In over the south edge on the Riders' track from D9: the tents seen, and the camp's fires in the ring.
    { kind: 'event', x: 16, y: 30, id: 'd8_akordu', once: true, text: 'White tents in a ring under the mesa, smoke going up from the fires inside. Akordu.' },
    { kind: 'camp', x: 16, y: 27, name: 'Akordu', text: 'The fires of Akordu in the ring of tents, dung burning low. The Riders make room for you and ask nothing.' },
    // The eldest at her own fire before her tent, against the mesa: the oldest story, told once (the
    // chapter's step, #531); the Compact's orders put in her hand, or not (#56's 54, #532); and the rest
    // of the story, for a company that let the old lion die (#56's 53, #532).
    { kind: 'npc', x: 16, y: 24, name: 'The eldest', flag: STORY, lines: [
      'The eldest sits at her fire before her tent, a horse-blanket round her and her braid white to the waist.',
      '"On the day the sky opened, the grass stood still and the birds came down out of the air."',
      '"A door stood open in the sky to the south-west. Something went up to it on a pillar of fire, slow, as a heavy thing climbs."',
      '"Halfway, the fire failed. It fell, and where it fell the land burned three days, and cooled to glass."',
      '"What lies in the glass tried to leave. The sky opened for it. Remember what that cost, if anyone ever offers to open it for you."',
    ], says: [
      { after: { flag: STORY, item: 'riders_orders' }, until: [{ flag: ORDERS_SEALED }, { flag: ORDERS_TOLD }, { flag: ORDERS_BURNED }], lines: ['The eldest sees the black wax in your hands, and holds out her own.'], choice: { ask: '"The Compact writes to us again. Well?"', answers: [
        { label: 'Give them to her sealed.', takes: 'riders_orders', sets: ORDERS_SEALED, pay: { xp: 1500 }, says: ['She cuts the purse free and weighs it, and puts the orders unread in her fire.', '"Silver for silence. We are silent anyway."'] },
        { label: 'Tell her what they say.', takes: 'riders_orders', sets: ORDERS_TOLD, pay: { xp: 1500 }, says: ['She hears it to the end, and puts orders and purse in her fire together.', '"Then the Hand buys nothing on the grass, and nothing of theirs goes past the gap."'] },
        { label: 'Burn them.', takes: 'riders_orders', sets: ORDERS_BURNED, pay: { xp: 1500 }, says: ['The wax runs and the purse blackens in her fire. She does not ask what they said.', '"They will send another. They always do."'] },
      ] } },
      { after: { flag: [STORY, LION_LEFT] }, until: { flag: LION_TOLD }, sets: LION_TOLD, lines: [
        'The eldest feeds her fire, and waits until it catches.',
        '"What fell did not lie down. It stands in the glass on its end, as it stood to climb, and the glass came up round it to the crown."',
        '"That is the crown the watch sees from the gap. What tried to leave once may try again, and the sky would open for it."',
      ] },
      { after: { flag: LION_TOLD }, lines: ['The eldest looks into her fire.', '"You have all of it now. Keep it as we keep it."'] },
      { after: { flag: STORY }, lines: ['The eldest looks into her fire.', '"That is the story as the young hear it. The rest is for those who have earned it."'] },
    ] },
    // The trader's tent on the ring's east side: the band's consumables and the Riders' leather at list,
    // the stone's cure among them (#546), and nothing of steel (#443, calls 5 and 7).
    { kind: 'shop', x: 21, y: 27, name: 'The Trader\'s Tent', stock: ['rations', 'torch', 'lantern_oil', 'potion_heal', 'antidote', 'elixir', 'potion_sp', 'potion_sp_great', ...CURES, 'leather_coat'], interior: 'akordu_trader' },
    // Under the mesa: its watch-fire seen from below, a well and the Riders' shrine; and the dry well
    // with no rope, its shaft walled off at the bottom, and behind it the hoard in a hollow of the rock.
    { kind: 'event', x: 15, y: 23, id: 'd8_watch', once: true, when: { hours: 'day' }, text: 'Smoke goes up thin and straight from the mesa\'s top. Someone sits by it, looking south-west.' },
    { kind: 'event', x: 15, y: 23, id: 'd8_watch_night', once: true, when: { hours: 'night' }, text: 'A fire burns on the mesa\'s top, small against the stars. Someone stands by it, looking south-west.' },
    { kind: 'well', x: 18, y: 22, text: 'A well under the mesa, its rope wet and the bucket down. Children carry the water away in skins.' },
    { kind: 'shrine', x: 19, y: 21, id: 'd8_shrine', text: 'A post at the mesa\'s foot hung with horses\' tails, one for each Rider who rode into the Glass.', stat: 'might', done: 'The post of tails, the wind going through them.' },
    { kind: 'event', x: 13, y: 23, id: 'd8_ropeless', once: true, text: 'A well against the mesa\'s foot, its windlass bare: no rope, no bucket. The horses are watered at the others.' },
    { kind: 'event', x: 13, y: 21, id: 'd8_hollow', once: true, text: 'Behind the walled shaft, a hollow in the rock: plates of green bronze, a lamp of glass and a hand of metal, laid in rows.' },
    { kind: 'chest', x: 12, y: 21, id: 'd8_hoard', gold: 1500, items: ['leather_coat+2'] },
    // The horse-lines to the west, where the ride comes in: the Rider who rides to the port and back,
    // the young Rider who wants the last blow (#56's 53, #532), here until the company will hunt with
    // him and then at the hunters' fire (B8), a well, and the horse that came back (#56's 51, #532),
    // tethered apart, what sits it still until it is broken or taken, with the Rider who would break it.
    { kind: 'event', x: 7, y: 27, id: 'd8_lines', once: true, text: 'The horse-lines: a rope between stakes and sixty horses on it, heads down, a boy walking the line with water.' },
    // Where the ride sets a company down, once the Ember Stone is lit: Ashfall's chapter is done for a
    // company that came west by the ride and never walked the road over the Cinder Hills (#518).
    { kind: 'event', x: 9, y: 27, id: 'd8_east', once: true, after: { flag: LIT }, sets: ROAD_WEST, text: 'The Riders at the lines are looking east, over the hills, and none of them is talking.' },
    { kind: 'npc', x: 9, y: 26, name: 'A Rider at the lines', lines: [
      'A Rider checks a horse\'s feet at the end of the lines, a second horse saddled beside it.',
      '"East to the port, a day over the grass and the ash. We go at two, and we do not wait."',
    ], passage: sells('wold', RIDERS_RIDE) },
    { kind: 'npc', x: 8, y: 29, name: 'A young Rider', flag: LION_ASKED, until: { flag: LION_HUNT }, lines: [
      'A boy in a man\'s coat rubs down a grey with a twist of grass, talking while he works.',
      '"They hunt the Grey Lion at the turn of the year, and the last blow is the youngest\'s. I have asked for it. The eldest says let him die."',
    ], choice: { ask: '"Will you hunt him with me?"', answers: [
      { label: 'Hunt the Grey Lion with him.', sets: LION_HUNT, says: ['He drops the twist of grass and goes for his saddle.', '"The hunters\' fire, under the rim. I ride tonight."'] },
      { label: 'Let the old lion die.', sets: LION_LEFT, pay: { xp: 1500 }, says: ['He spits in the dust, and goes back to the grey.', '"Then you are the eldest\'s. Go and hear the rest of her story."'] },
    ] }, says: [
      { after: { flag: LION_LEFT, slain: LION_DOWN }, lines: ['The boy does not look up from the grey.', '"Let him die, you told me. Then you killed him."'] },
      { after: { flag: LION_LEFT }, lines: ['The boy rubs down the grey, and does not look up.', '"Next year I ask again."'] },
      { after: { slain: LION_DOWN }, sets: LION_TAKEN, lines: ['The boy rubs down the grey, and does not look up.', '"The Grey Lion is dead, and the last blow was not mine."'] },
    ] },
    { kind: 'well', x: 6, y: 29, text: 'A well by the horse-lines, its trough full. A boy hauls on the rope and the horses crowd him.' },
    { kind: 'event', x: 4, y: 24, id: 'd8_horse', once: true, until: [{ flag: HORSE_BROKEN }, { flag: HORSE_CARRIED }], text: 'A horse tethered short, apart from the lines, glass in its hooves. The thing in its saddle has not moved since it came in.' },
    { kind: 'npc', x: 5, y: 25, name: 'A Rider with a hammer', lines: [
      'A Rider sits on his heels a rope\'s length from the tethered horse, a stone hammer across his knees.',
      '"The horse is ours. What sits on it is not. When it moves, I break it."',
    ], choice: { ask: '"Break it now, or take it off our grass?"', answers: [
      { label: 'Break it.', sets: HORSE_BROKEN, pay: { xp: 1200 }, says: ['He walks up to the horse and swings once. The glass goes everywhere, and the horse does not shy.', '"All the way home it sat as still as that. Only at night it turned its head, and looked back south-west."'] },
      { label: 'Take it whole.', gives: 'saddle_walker', sets: HORSE_CARRIED, pay: { xp: 1200 }, says: ['He cuts the girth, and you lift it down between you. It is cold, and it does not move.', '"Take it far off. The horse will eat once it is gone."'] },
    ] }, says: [
      { after: { flag: HORSE_BROKEN }, lines: ['The Rider sits by the lines, the stone hammer through his belt.', '"It never moved. Not even when I swung."'] },
      { after: { flag: HORSE_CARRIED }, lines: ['The Rider sits by the lines, the stone hammer across his knees.', '"Gone to the port with you, is it? Let the port lie awake, then."'] },
    ] },
    // The garden of glass at the camp's east edge, its figures facing south-west, and the mother among
    // them, whose son is carried to the Harbour Temple at Cinderport (#56's 55, #532).
    { kind: 'event', x: 23, y: 25, id: 'd8_garden', once: true, text: 'Figures of glass stand in rows at the camp\'s edge, men and women and a horse, all facing south-west.' },
    { kind: 'event', x: 29, y: 25, id: 'd8_vultures', once: true, text: 'Vultures turn over the garden of glass, low and slow. None of them comes down.' },
    { kind: 'event', x: 25, y: 26, id: 'd8_figure', once: true, until: { flag: GARDEN_CARRIED }, text: 'One of them is a boy, his hand up to his eyes and his mouth open.' },
    { kind: 'npc', x: 26, y: 27, name: 'A woman among the figures', flag: GARDEN_ASKED, lines: [
      'A woman sits in the dust among the figures, one hand on the foot of the smallest.',
      '"My son went to look at the basilisk under the mesa. He is looking still."',
    ], choice: { ask: '"At the port, they say, the priests lift stone. Will you carry him there?"', answers: [
      { label: 'Carry him to the port.', gives: 'glass_boy', sets: GARDEN_CARRIED, says: ['She helps you wrap him in a horse-blanket, and ties it with her own belt.', '"The Riders\' ride goes at two. They will not wait."'] },
    ] }, says: [
      { after: [{ flag: GARDEN_LIFTED }, { flag: GARDEN_DRAUGHT }], lines: ['The woman sits among the figures, her son beside her, his hand up against the light.', '"He looks at nothing now but the grass."'] },
      { after: { flag: GARDEN_CARRIED }, lines: ['The woman sits in the dust where the smallest stood.', '"Go on. I have waited this long."'] },
    ] },
    // Round the mesa: the lions' tracks and the Riders' graves to the west, the basilisk's shade to the
    // north, the broken ground under the east face.
    { kind: 'event', x: 7, y: 17, id: 'd8_spoor', once: true, text: 'Lion tracks in the dust, a big pride\'s, going toward the horse-lines and coming away again.' },
    { kind: 'event', x: 4, y: 12, id: 'd8_graves', once: true, text: 'Low mounds in the grass, each with a flat stone at its head and a bridle laid on the stone.' },
    { kind: 'event', x: 17, y: 12, id: 'd8_shade', once: true, text: 'In the mesa\'s shadow a horse of grey glass stands in the grass, its head turned to look behind it.' },
    { kind: 'event', x: 22, y: 21, id: 'd8_broken', once: true, text: 'Rock fallen from the mesa lies broken in the grass, sharp as flint. Holes run in under it, each as wide as a fist.' },
    // North: the grazing and its marks, the hills over the camp, a kill, and Riders on the skyline.
    { kind: 'event', x: 4, y: 4, id: 'd8_herd', once: true, text: 'Horses graze the grass north of the camp, hobbled, a boy asleep on the back of one of them.' },
    { kind: 'event', x: 9, y: 1, id: 'd8_poles', once: true, text: 'Horses\' skulls on poles in a line across the grass, facing north. Past them the grass is not grazed.' },
    { kind: 'event', x: 20, y: 5, id: 'd8_hill', once: true, text: 'From the hill\'s crown the tents lie white under the mesa. South-west, the land shines.' },
    { kind: 'event', x: 28, y: 4, id: 'd8_foal', once: true, text: 'A foal dead in the grass, its throat torn and the rest of it untouched.' },
    { kind: 'event', x: 28, y: 14, id: 'd8_skyline', once: true, text: 'Riders go along the skyline to the east in a line, too far off to hail. None of them looks round.' },
  ],
  secrets: [{ x: 13, y: 22, hint: 'd8_ropeless' }],
  encounters: [
    // None inside the camp. The lions come at the horse-lines by night out of the grass to the west; the
    // glass scorpions hole up in the broken ground under the mesa's east face; and in its shade on the
    // north side the basilisk alone, the box's hardest at 27. The vultures over the garden are seen, not
    // fought: they wait for what does not die.
    { id: 'd8_pride', x: 4, y: 21, monsters: ['wold_lion', 'wold_lion', 'wold_lion', 'wold_lion'], aware: 4, respawn: 2880, when: { hours: 'night' } },
    { id: 'd8_scorpions', x: 22, y: 17, monsters: ['glass_scorpion', 'glass_scorpion', 'glass_scorpion', 'glass_scorpion', 'glass_scorpion', 'glass_scorpion'], aware: 3, respawn: 2880 },
    { id: 'd8_basilisk', x: 13, y: 12, monsters: ['basilisk'], aware: 3, respawn: 2880 },
  ],
};
