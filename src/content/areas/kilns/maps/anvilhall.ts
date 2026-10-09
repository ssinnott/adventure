// Anvilhall, the dwarves' hold: the Kilns' first town, band 16-18, behind N3's gate. A court cut down
// into the hill and open to the sky, three terraces stepping up from the iron-bound gate to the great
// hall's doors, every door in its rock cut round with the old script. The great hall, the thane's,
// where the Lantern reader reads the verse over the kings' forge and the thane sells the Anvil Stone
// back or loses it; the smiths' forge, the act's first step on the ladder, shut for good to a company
// that takes the Stone; the old working, which trains to 19; the inn, the mine-surgeon's and the
// stores. No spell hall and no guild hall (#434's 8 and 9). docs/areas/kilns.md §4.4 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';
import { FORGE, ANVIL_STONE_PRICE } from '../items.ts';
import { NOVICE_TOLD, NOVICE_KEPT } from '../../whitespine/maps/monastery.ts';

/** The verse read the old way, by the Lantern reader or after the company's own reader: the chapter's step (#470). */
export const VERSE_READ = 'anvil_verse_read';
/** The thane's question answered, one way or the other (#434's 1): the Hearth reads neither (#540). */
export const BOUGHT = 'anvil_bought', TAKEN = 'anvil_taken';
/** The miners' hymn heard whole, its last verse sung by the oldest miner: a verse for the Bard's third (#56's 36, #448). */
export const HYMN_SUNG = 'q_hymn_sung';

/** The reader's greeting, whichever words he greets a company with. */
const CRANE = 'A man in Lantern grey at a lectern under the verse, chalk to the wrists. "Crane. Reader. The thane lodges me, and I read his walls."';
/** The thane's last word, whichever way he was answered (§4.4). */
const MOUNTAIN = '"The mountain has to eat. Remember that, when you are somewhere it does not."';

export const ANVILHALL: MapDef = {
  id: 'anvilhall',
  name: 'Anvilhall',
  kind: 'town',
  band: [16, 18],
  region: 'kilns',
  start: { x: 7, y: 14, facing: NORTH },
  // Rock dressed square, soot-dark, the doors iron-bound, and the hold's banners red as hot iron.
  palette: { wall: '#6f675f', wallDark: '#45403b', floor: '#5e5852', door: '#3a302a', banner: '#8c2f1c' },
  rows: [
    '################',
    '#######D########',
    '#####""=""######',
    '####D""=""D#####',
    '#####"o=o"######',
    '#######=########',
    '####"""="""#####',
    '####"""="""D####',
    '####"""="""#####',
    '####"""="""#####',
    '#######=########',
    '###""""=""""####',
    '##D""o"="o""D###',
    '###""""=""""####',
    '###""""=""""####',
    '#######=########',
  ],
  // Either side of the great hall's doors, and either side of the gate as you come in.
  banners: [{ x: 6, y: 1 }, { x: 8, y: 1 }, { x: 6, y: 15 }, { x: 8, y: 15 }],
  exits: [
    { x: 7, y: 15, to: 'ironfells_n3', tx: 28, ty: 9, tf: SOUTH, label: 'You go out at the iron door, and the hammering shuts behind you.' },
  ],
  features: [
    // The great hall at the court's head: the room, the thane and his question, and the Lantern
    // reader, who reads the verse over the kings' forge the old way and teaches Linguist (#538).
    { kind: 'npc', x: 7, y: 1, name: 'The Great Hall', interior: 'anvilhall_great_hall', lines: [
      'A nave cut into the hill between square pillars, the hammer and pick hung on each, and at its head the thane\'s seat of stone.',
      'Behind the seat the kings\' forge, its coals heaped high, and over it the verse, cut red.',
    ] },
    // The thane puts the choice as a business puts its menu (#434's 1): the Stone at its price, or
    // taken. Either way he never forgives, and his words change; nothing else does but the forge's door
    // and the Anvil Guard at the Stone (#464).
    { kind: 'npc', x: 7, y: 1, name: 'Thane Wolfram, of Anvilhall', flag: 'thane_met', lines: [
      'The thane on his seat, broad as the seat, the kings\' forge red behind him and his hands on his knees.',
      '"Wolfram. You have come about the Stone. Yes, we cut it: a piece a season, for years, and the Compact pays by weight."',
      '"It is mine, and I will sell it to you, what is left of it. The saws come off it the day you pay."',
    ], choice: { ask: '"Six thousand gold. Or take it, if you think you can, and learn what that costs."', answers: [
      { label: 'Buy it back', sets: BOUGHT, price: ANVIL_STONE_PRICE, says: [
        'He counts it himself, every coin, and does not look at you while he does it.',
        '"The saws come off tonight. What came up out of the ground beside it was never mine to sell. That is yours as well."',
      ] },
      { label: 'Take it', sets: TAKEN, says: [
        'He does not get up.',
        '"Then my iron goes to the Stone ahead of you, and my forge is shut to you for good. Go on."',
      ] },
    ] }, says: [
      { after: { flag: BOUGHT }, lines: ['He does not look away from the forge.', MOUNTAIN] },
      { after: { flag: TAKEN }, lines: ['He looks at you a long while, and then at the door.', MOUNTAIN] },
    ] },
    { kind: 'npc', x: 7, y: 1, name: 'Wystan Crane, Reader of the Lanterns', flag: VERSE_READ, skill: 'linguist', lines: [
      CRANE,
      '"That one they sing at every forge. Read the old way, a word at a time, it says: DANGER. KEEP FIRE BELOW THIS LINE." He is quiet a while.',
      '"It\'s a warning. The kind you paint on a boiler."',
    ], says: [
      // A company whose own reader read the verse at the doors: he reads it after them.
      { after: { seen: 'anvilhall:ah_verse' }, until: { flag: VERSE_READ }, sets: VERSE_READ, lines: [
        CRANE,
        '"You read that one at the doors. I watched you do it." He looks up at it, not at you. "Then you know what it is."',
        '"A warning. The kind you paint on a boiler."',
      ] },
      { after: { flag: VERSE_READ }, lines: [
        '"Every holy word in this hall is a sign on a door. I have read forty, and not one of them is a prayer."',
      ] },
    ] },
    { kind: 'sign', x: 7, y: 2, id: 'ah_verse', text: 'Over the great hall\'s doors, the holiest verse in the hold, cut red: THE FIRE IS KEPT BELOW AND NOT ABOVE.', read: 'DANGER. KEEP FIRE BELOW THIS LINE.' },
    { kind: 'event', x: 6, y: 2, id: 'ah_crowns', once: true, text: 'In a niche beside the great hall\'s doors, the old kings\' crowns: rings of plain iron, each black from the forge that made it.' },
    { kind: 'event', x: 8, y: 2, id: 'ah_red', when: { hours: 'night' }, text: 'Red light lies under the great hall\'s doors all night. The kings\' forge behind them is never let go out.' },

    // The upper terrace: the old working, which trains to 19, and the smiths' forge, the act's first
    // step (#535), gone for good once the Stone is taken, its smiths with it, and its door barred.
    { kind: 'trainer', x: 4, y: 3, name: 'The Old Working', maxLevel: 19, interior: 'anvilhall_training_hall' },
    { kind: 'sign', x: 5, y: 3, id: 'ah_muster', text: 'Over the old working\'s door, what the dwarves shout lifting stone.', read: 'MUSTER STATION. ALL HANDS.' },
    { kind: 'shop', x: 10, y: 3, name: 'The Smiths\' Forge', stock: [...FORGE], interior: 'anvilhall_forge', until: { flag: TAKEN } },
    { kind: 'npc', x: 10, y: 3, name: 'Gerda, master of the forge', until: { flag: TAKEN }, lines: [
      'A dwarf woman at the anvil with her striker across it from her. Neither stops for you.',
      '"Gerda. What is on the rack is for sale. What is on the anvil is not."',
      '"The verse? We sing it at the first heat every morning. Fire below, not above. It keeps a smith honest."',
    ], says: [
      { after: { flag: BOUGHT }, lines: ['"You paid the thane for the Stone. He will not thank you for it, so I will." She does not stop.'] },
    ] },
    { kind: 'event', x: 10, y: 3, id: 'ah_forge_shut', after: { flag: TAKEN }, text: 'The forge door is barred. Behind it the hammering goes on, and nobody comes to it.' },
    { kind: 'event', x: 9, y: 3, id: 'ah_hammer', once: true, when: { hours: 'day' }, text: 'The hammering comes from here: a hammer on the anvil and a sledge answering it, the same three strokes all day.' },

    // The middle terrace: the mine-surgeon's, whose lintel is being cut fresh, and the cistern.
    { kind: 'temple', x: 11, y: 7, name: 'The Mine-Surgeon\'s', interior: 'anvilhall_surgeon' },
    { kind: 'sign', x: 10, y: 7, id: 'ah_sickbay', text: 'Over the mine-surgeon\'s door, the dwarves\' blessing on the broken.', read: 'SICKBAY.' },
    { kind: 'npc', x: 10, y: 6, name: 'Ilse, who cuts the old script', lines: [
      'An old dwarf on a ladder at the mine-surgeon\'s lintel, cutting the old script fresh into the rock.',
      '"Ilse. Every spring I cut them fresh, stroke for stroke as they were. Change a stroke and you change the blessing."',
    ], says: [
      // The Older Mark's kept rubbing (Thornmark's, #56's 16 and its promise in 34; #637): she reads it as
      // a cutter does, by its strokes and no more, to a company carrying it; every other company hears her
      // own words. The flag is the journal's: Thornmark's `mark` adds her finding.
      { after: { item: 'stone_rubbing' }, sets: 'q_mark_read', lines: [
        'The old dwarf comes down her ladder for the rubbing and follows its strokes with her thumb, as along a lintel.',
        '"Every stroke is one I cut. But mine waver, as my master\'s did, and these do not." She holds it to the light. "Whoever cut this was not copying."',
      ] },
    ] },
    { kind: 'well', x: 5, y: 7, text: 'A cistern cut in the rock. The water comes up warm from below, and tastes of iron.' },
    { kind: 'event', x: 4, y: 9, id: 'ah_chalk', once: true, text: 'Chalk on the terrace wall at a child\'s height: three marks of the old script, over and over, copied off a lintel.' },
    // The Novice (#56's 45, the Whitespine's #506): his mother on the terrace step, who takes his letter
    // from Highcell's last cell; and once he is told, the boy himself beside her, home.
    { kind: 'npc', x: 5, y: 9, name: 'A woman knitting', lines: [
      'A woman on a step of the middle terrace, knitting something grey and very long.',
      '"My boy went up to the bells with the pilgrims, two springs gone. Not a word since."',
    ], quest: { item: 'novice_letter', reward: 0, setFlag: 'q_novice_home', done: [
      'She holds the letter at arm\'s length and reads it twice, her lips moving.',
      '"Hungry, he says, and all of them fasting. Tell him his mother says come home."',
    ], after: ['"Tell him to come home. That is all."'] }, says: [
      { after: { flag: NOVICE_TOLD }, lines: ['The woman knitting on the terrace step, her boy on the step below.', '"He eats as if he had forgotten how. Up there, he says, nobody ever did."'] },
      { after: { flag: NOVICE_KEPT }, lines: ['The woman knitting on the terrace step, the grey thing longer.', '"Well, is he? Then he will write again."'] },
    ] },
    { kind: 'npc', x: 6, y: 9, name: 'The boy from Highcell', after: { flag: NOVICE_TOLD }, lines: [
      'A thin boy on the step below his mother, a bowl in both hands, still in the novice\'s robe.',
      '"I wake for the hours still. Nobody rings them here."',
    ] },

    // The lower terrace, inside the gate: the stores and the inn, the warder and his book.
    { kind: 'shop', x: 2, y: 12, name: 'The Hold Stores', stock: ['rations', 'torch', 'lantern_oil', 'potion_heal', 'antidote', 'elixir', 'potion_sp', 'potion_sp_great'], interior: 'anvilhall_stores' },
    { kind: 'event', x: 3, y: 12, id: 'ah_tub', once: true, text: 'A mine tub on rails at the stores\' loading door, heaped with potatoes. The rails run a tub\'s length and stop.' },
    { kind: 'inn', x: 12, y: 12, name: 'The Candle Arch', price: 35, interior: 'anvilhall_inn' },
    { kind: 'sign', x: 11, y: 12, id: 'ah_berths', text: 'Over the inn\'s door, the dwarves\' blessing on the weary.', read: 'BERTHS.' },
    { kind: 'event', x: 11, y: 13, id: 'ah_caps', once: true, text: 'Pegs by the inn\'s door, and on them the miners\' leather caps, a lamp-hook on each brim.' },
    { kind: 'npc', x: 6, y: 14, name: 'Konrad, warder of the gate', lines: [
      'A dwarf on a stool inside the gate, an axe across his knees and a ledger open on the axe.',
      '"Konrad. I keep the gate and the book. The thane sees anyone with business, and the forge sells to anyone with gold."',
    ], says: [
      { after: { flag: BOUGHT }, lines: ['"Your names are in the book. Beside them, in the thane\'s hand: paid." He turns the page.'] },
      { after: { flag: TAKEN }, lines: ['"Your names are in the book, in red now." He does not look up. "The gate lets you by. I would not."'] },
    ] },
    { kind: 'event', x: 7, y: 13, id: 'ah_court', once: true, text: 'Anvilhall: a court cut down into the hill and open to the sky, its terraces climbing to the great hall\'s doors.' },

    // The side quests' people (#471; docs/areas/kilns.md §6). The Crust-Bearer (#56's 33): the son, up
    // from the bottom of the Tiefzeche once he has his mother's ring, on the inn's step.
    { kind: 'npc', x: 11, y: 11, name: 'The crust-bearer', after: { flag: 'q_crust_up' }, lines: [
      'The young dwarf from the bottom of the Tiefzeche on the inn\'s step, scrubbed pink, a bowl in his lap.',
      '"Up here it is all hammering. Down there it was only knocking, and they let me be."',
    ] },
    // The Primer (#56's 34): the scholar from Erzkamm's wall, once he is taken to the thane, kept.
    { kind: 'npc', x: 9, y: 4, name: 'The scholar from the wall', after: { flag: 'q_primer_kept' }, lines: [
      'The man of Helmstow on the great hall\'s steps between two of the thane\'s guard, his hands empty.',
      '"They feed me well. Nobody will say for how long."',
    ] },
    // The Miners' Hymn (#56's 36): the oldest miner, who sang the doors fifty years; told how they are
    // sung now, the third door heard going down (`deep_mines`), he sings the last, the bottom door's.
    { kind: 'npc', x: 10, y: 13, name: 'The oldest miner', flag: 'q_hymn', lines: [
      'An old miner on the bench by the inn\'s door, his hands folded on a stick.',
      '"Fifty years I sang the doors going down. Go and hear how they sing them now, and come and tell me."',
    ], says: [
      { after: { flag: HYMN_SUNG }, lines: [
        'The oldest miner on his bench, humming the count.',
        '"Nobody sings the last going down. Nobody goes down that far."',
      ] },
      { after: { seen: 'deep_mines:dm1_door3' }, sets: HYMN_SUNG, lines: [
        'He listens with his eyes shut, his lips moving with the count.',
        'Then he sings the one they leave out: "Last door, the captain\'s door. Shut, and all hands counted."',
      ] },
    ] },
    { kind: 'sign', x: 8, y: 14, id: 'ah_lintel', text: 'The words over the gate: the hold\'s name, the Seventh House of the Mountain.', read: 'SECTION 7.' },
  ],
};
