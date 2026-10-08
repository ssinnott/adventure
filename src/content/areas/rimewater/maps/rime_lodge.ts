// Rime Lodge, the act's last town: band 20-22, behind M9's gate, on the shore of the long loch's head.
// A stockade of logs round a yard of trodden snow, a lantern over every door: the Lanterns' fourth hall
// at its head, which sells to the seventh tier; the healer's house and the furrier's either side of it;
// the provisioner's and the coach house off the square; and down the lane to the lake wall the inn,
// whose stays count the nights, the trainers' yard to 23 and the inn's yard with its door onto the ice,
// where the ice-hole is kept open (M9). docs/areas/rimewater.md §4.3 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST, SOUTH, WEST } from '../../../../game/types.ts';
import { sells, DROVE_COACH } from '../../../crossings.ts';
import { FURRIER } from '../items.ts';

/**
 * The four nights (call 5): a flag a night, set in order by a stay at the inn. Each night's arrivals
 * are a once-event in the inn's yard; the fourth's come up on M9's ice, where the hole's fight is
 * (`m9_night_4`) and Wenna after it, who sets `WENNA_UP`. The chapter (#492) reads them.
 */
export const NIGHTS = ['night_1', 'night_2', 'night_3', 'night_4'] as const;
/** Wenna met at the hole, the last one out on the fourth night: the bay's door reads it (§5, #440). */
export const WENNA_UP = 'q_wenna_up';
/** Her words at the door once the company is back up from the beds: she goes to the lodge (§5, #492). */
export const WENNA_LODGE = 'q_wenna_lodge';

export const RIME_LODGE: MapDef = {
  id: 'rime_lodge',
  name: 'Rime Lodge',
  kind: 'town',
  band: [20, 22],
  region: 'rimewater',
  start: { x: 14, y: 8, facing: WEST },
  // Logs gone silver with frost, the doors tarred black, and the yard's snow trodden grey.
  palette: { wall: '#6d5a46', wallDark: '#3f3328', floor: '#8e959b', door: '#2b2420' },
  rows: [
    '################',
    '#BB#BBBBBBB#BBB#',
    '#BB#BBBBBBB#BBB#',
    '#DB#BBBDBBB#BDB#',
    '#::::::=:::::::#',
    '#BBB:::=:::::BB#',
    '#BBD:::=:::::BB#',
    '#BBB:::=:::::::#',
    '#:::============',
    '#::::::=:::::::#',
    '#BBBBB:=:::DBBB#',
    '#BBBBB:=:::BBBB#',
    '#BBBBD:=:::BBBB#',
    '#BBBBB:=:::BBBB#',
    '#BBBBB:=:::BBBB#',
    '#######D########',
  ],
  exits: [
    { x: 15, y: 8, to: 'longmere_m9', tx: 19, ty: 8, tf: EAST, label: 'Out at the gate onto the drove road. Behind you the dog starts again.' },
    { x: 7, y: 15, to: 'longmere_m9', tx: 13, ty: 11, tf: SOUTH, label: 'Out by the lake wall\'s door onto the ice. The hole\'s fire burns a stone\'s throw out.' },
  ],
  features: [
    // The head of the yard: the Lanterns' fourth hall, which sells to the seventh tier and teaches
    // their skills (call 5, #538), the healer's house and the furrier's, the act's last step (#535).
    { kind: 'temple', x: 1, y: 3, name: 'The Healer\'s House', interior: 'rime_temple' },
    { kind: 'guild', x: 7, y: 3, name: 'The Lodge\'s Lantern Hall', classes: ['cleric', 'sorcerer', 'paladin', 'ranger', 'bard', 'druid'], fee: 500, maxTier: 7, interior: 'rime_hall', hall: 'lanterns' },
    { kind: 'shop', x: 13, y: 3, name: 'The Furrier\'s', stock: [...FURRIER], interior: 'rime_furrier' },
    { kind: 'event', x: 7, y: 4, id: 'rl_lamps', when: { hours: 'night' }, text: 'A lantern in every window of the hall all night, and keepers going out to the ice with more.' },
    { kind: 'event', x: 13, y: 4, id: 'rl_pelts', once: true, text: 'Pelts on frames outside the furrier\'s: lynx, bear, and a long pale hide with no fur on it at all.' },

    // The square: the provisioner's, the well, the coach house and its coachman (#539). The Coach That
    // Did Not Come (#56's 40, #494): the coachman sends the company up the drove road after the coach
    // for here, and the note from it brought down, before he asks or after (#43), he sends the sledge.
    { kind: 'shop', x: 3, y: 6, name: 'The Provisioner\'s', stock: ['rations', 'torch', 'lantern_oil', 'potion_heal', 'antidote', 'elixir', 'potion_sp', 'potion_sp_great'], interior: 'rime_provisioner' },
    { kind: 'well', x: 10, y: 6, text: 'A well with a fire kept under its hood, so the bucket comes up through water and not ice.' },
    { kind: 'event', x: 12, y: 6, id: 'rl_coach_house', once: true, text: 'A coach on runners in the coach house, its paint flaked by frost. One stall stands empty.' },
    { kind: 'npc', x: 14, y: 7, name: 'The coachman', flag: 'q_coach', passage: sells('rime_lodge', DROVE_COACH), lines: [
      'A coachman in a bearskin by the coach house, stamping, his breath frozen in his beard.',
      '"Kilnhaven, over the moor: a day on the road. The coach for here is two days late, and the drove road white."',
      '"If you go up that road, look for it."',
    ], quest: { item: 'healers_note', reward: 200, setFlag: 'q_coach_sledge',
      done: ['He reads the note twice and shouts for the sledge.', '"Dead on his box. Twenty years he drove that road."'],
      early: ['He reads the note twice. "The coach for here, stopped on the moor." He shouts for the sledge.', '"Dead on his box. Twenty years he drove that road."'],
      after: ['The coachman by the empty stall, his hand on its door.', '"Twenty years on that road, and it froze him on his box."'] } },
    // The two from the coach, down on the sledge: the sleeper, and the man in the healer's coat, who
    // asks where she goes. In the hall the bell under Fuar's ice wakes her (42); in the healer's house
    // she is out of sight, since a person on its one square of yard would shut its door.
    { kind: 'npc', x: 12, y: 7, name: 'A man in a healer\'s coat', after: { flag: 'q_coach_sledge' }, until: [{ flag: 'q_coach_hall' }, { flag: 'q_coach_temple' }], lines: [
      'The man in the healer\'s coat, by the sledge, the salt still white on his hem.',
      '"She has not woken since Kilnhaven. She needs a bed, and somebody to watch her."',
    ], choice: { ask: '"Where do they take her?"', answers: [
      { label: 'The Lanterns\' hall.', sets: 'q_coach_hall', pay: { xp: 1800 }, says: [
        'Two keepers carry her up the yard to the hall, under the lamps.',
        'He watches the door shut on her. Then he goes out at the gate and up the road, alone.',
      ] },
      { label: 'The healer\'s house.', sets: 'q_coach_temple', pay: { xp: 1800 }, says: [
        'The healer comes out in her shawl and has her carried in to the stone.',
        'He watches the door shut on her. Then he goes out at the gate and up the road, alone.',
      ] },
    ] } },
    { kind: 'npc', x: 11, y: 7, name: 'A sleeper', after: { flag: 'q_coach_sledge' }, until: [{ flag: 'q_coach_hall' }, { flag: 'q_coach_temple' }], lines: [
      'A woman on the sledge under the coach\'s rugs, her lips grey, breathing slow. She does not wake.',
    ] },
    { kind: 'npc', x: 8, y: 4, name: 'A sleeper', after: { flag: 'q_coach_hall' }, lines: [
      'The woman from the coach on a cot at the hall\'s door, under the lamps. She does not wake.',
    ], says: [
      { after: { flag: 'q_bell_rung' }, lines: [
        'The woman from the coach is sitting up on her cot under the lamps, a keeper\'s bowl in her hands.',
        '"A bell. I heard a bell, and I was so cold. Then I was here."',
      ] },
    ] },
    { kind: 'npc', x: 9, y: 5, name: 'A lodge-keeper', lines: [
      'A lodge-keeper in from the ice, a lantern at her belt and frost in her eyebrows.',
      '"Whoever comes up, we take in. A blanket, the fire, soup. Most of them cannot say from where."',
    ] },
    // The One Who Went Back Down (#56's 41, #494): kept as a witness, the man from the hole tells it
    // at the lodge-keeper's side.
    { kind: 'npc', x: 10, y: 5, name: 'A man from the hole', after: { flag: 'q_wentback_witness' }, lines: [
      'The man from the hole in a lodge blanket, telling it again to a keeper with a slate.',
      '"A wall with a door in it, and no handle. It opened for a girl. Write that down."',
    ] },
    // The Faces on the Tors (#56's 39): sent home from the tors (docs/areas/cairnmoor.md §6), the
    // stonecutter is here, and nowhere until then.
    { kind: 'npc', x: 2, y: 8, name: 'A stonecutter', after: { flag: 'q_faces_home' }, lines: [
      'The stonecutter from the tors, his chisels rolled in their cloth, stone dust still in his cracked hands.',
      '"Home, as they wanted. The last tor looks at the sky with one eye."',
      '"There is no stone here to cut, only ice."',
    ] },
    // Where the Sky Meets the Ice (#56's 43, #494): the guide by the gate until she goes up the glacier
    // (`q_sky`); carried in from its foot (`q_sky_in`), she draws the way by the yard's fire.
    { kind: 'npc', x: 14, y: 9, name: 'A guide', flag: 'q_sky', until: { flag: 'q_sky' }, lines: [
      'A guide by the gate, roping a pack, an ice axe through its straps.',
      '"A party wants taking up the glacier, to where they say the sky comes down to the ice."',
      '"We go up in the morning. I will see it before they do."',
    ] },
    { kind: 'event', x: 13, y: 8, id: 'rl_stockade', once: true, text: 'Inside the stockade, log houses roofed in turf and snow, a lantern over every door. The smoke goes straight up.' },

    // Down the lane: the inn, whose stays count the nights, the trainers' yard, and the inn's yard by
    // the lake wall's door, where those who came up in the night sit by the fire in the morning.
    { kind: 'inn', x: 5, y: 12, name: 'The Thaw', price: 45, interior: 'rime_inn', nights: NIGHTS },
    { kind: 'trainer', x: 11, y: 10, name: 'The Trainers\' Yard', maxLevel: 23, interior: 'rime_yard' },
    // The Bell Under the Ice (#56's 42, #494): once the coach's sleeper has a bed (40), she asks for the
    // bell rung; rung, she goes out to her people's hearth on K9 or stays by the fire.
    { kind: 'npc', x: 9, y: 12, name: 'A lodge woman', until: { flag: 'q_bell_out' }, lines: [
      'A lodge woman mending a net by the yard\'s fire, her eyes on the door to the ice.',
      '"My people were at Fuar when the loch came up over it. The tower still stands, under the ice."',
    ], says: [
      { after: { flag: 'q_bell_stay' }, lines: [
        'The lodge woman at her net by the fire, humming under her breath.',
        '"The ice is quiet again. I listen all the same."',
      ] },
      { after: { flag: 'q_bell_rung' }, until: [{ flag: 'q_bell_out' }, { flag: 'q_bell_stay' }], lines: [
        'The lodge woman is on her feet by the door to the ice, the net fallen at her feet.',
        '"I heard it from here, under the ice, the whole length of the night."',
      ], choice: { ask: '"Do I go out to them, or stay?"', answers: [
        { label: 'Go out to Fuar.', sets: 'q_bell_out', pay: { xp: 1800 }, says: [
          'She rolls the net and ties it.',
          '"Somebody should sweep the hearth. It may as well be me."',
        ] },
        { label: 'Stay by the fire.', sets: 'q_bell_stay', pay: { xp: 1800 }, says: [
          'She takes up the net again.',
          '"They have had their bell. I have the door to watch."',
        ] },
      ] } },
      { after: [{ flag: 'q_coach_hall' }, { flag: 'q_coach_temple' }], sets: 'q_bell', lines: [
        'She puts the net down. "Nobody rang the bell for them. It hangs in the tower still, under the ice."',
        '"On a still night it can be reached from the cap, they say, if the pike let you."',
      ] },
    ] },
    // The guide, carried in off the glacier (43), and the pilgrims turned back from the pass (44).
    { kind: 'npc', x: 8, y: 13, name: 'A guide', after: { flag: 'q_sky_in' }, lines: [
      'The guide by the yard\'s fire, her hands in the healer\'s bandages, a stick of charcoal between two of them.',
      '"Give me your map. I will put the way on it, while I can remember it."',
    ], choice: { ask: '"Your map?"', answers: [
      { label: 'Hand her the map.', sets: 'q_sky_marked', pay: { xp: 2100 }, says: [
        'She draws with the charcoal: the loch, the lodge, the glacier\'s edge, and on off the edge of the map, east, into nothing.',
        '"There. Where the sky comes down. Do not go yet."',
      ] },
    ] }, says: [
      { after: { flag: 'q_sky_marked' }, lines: [
        'The guide by the fire, her bandaged hands in her lap, looking east.',
        '"They will want the way down. Somebody has to finish the cairn."',
      ] },
    ] },
    { kind: 'npc', x: 10, y: 14, name: 'The pilgrims', after: { flag: 'q_pilgrims_back' }, lines: [
      'Pilgrims from Anvilhall round the yard\'s fire, and the boy among them in a lodge blanket, eating.',
      '"He was cold, not hot. Anybody could see it."',
    ] },
    { kind: 'event', x: 7, y: 13, id: 'rl_yard', once: true, text: 'The inn\'s yard: a woodpile to the eaves, blankets steaming on a line, and a fire that is never let go out.' },
    { kind: 'event', x: 6, y: 12, id: 'rl_night_1', once: true, after: { flag: 'night_1' }, until: { flag: 'night_2' }, text: 'Morning. A man by the fire in a lodge blanket, blue to the lips, who came up out of the loch in the night.' },
    { kind: 'event', x: 6, y: 12, id: 'rl_night_2', once: true, after: { flag: 'night_2' }, until: { flag: 'night_3' }, text: 'Morning. Three by the fire who came up together in the night, and will not let go of each other\'s hands.' },
    { kind: 'event', x: 6, y: 12, id: 'rl_night_3', once: true, after: { flag: 'night_3' }, until: { flag: 'night_4' }, text: 'Morning. A family by the fire, the children asleep. "A girl led us to the stair. She went back down."' },
    { kind: 'event', x: 6, y: 12, id: 'rl_night_4', once: true, after: { flag: 'night_4' }, text: 'Morning, and nobody by the fire. Out on the ice the keepers stand back from the hole, and it is clicking.' },
    // The girl out of the hole, by the yard's fire once she has spoken at the door after the bay (§5,
    // #492): K9's girl goes on the same flag, so she is never in two places.
    { kind: 'npc', x: 10, y: 13, name: 'The girl out of the hole', after: { flag: WENNA_LODGE }, lines: [
      'The girl out of the hole, by the yard\'s fire at last in a lodge blanket, the nail still in her fist.',
      '"Bring them up, and I\'ll go home to my mother. Not before."',
    ] },
  ],
};
