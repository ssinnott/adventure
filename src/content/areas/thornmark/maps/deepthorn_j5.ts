// The Deepthorn, box J5: Penspern, the Deepthorn's end and its hardest place. Core, band 8-10: the
// glade road down the head's neck from J4, the crown with its standing stone and the fire the
// hold's youths light for the Wyke's boats, the Eldest at the tip, and under the head the beach
// where the Hand's boat lands by night and the sea cave it ships from. The Hearth across the water.
// Cut from the atlas by tools/scaffold.ts; docs/areas/thornmark.md §4.7 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';
import { TEAR_CLOSED } from './grove2.ts';

export const DEEPTHORN_J5: MapDef = {
  id: 'deepthorn_j5',
  name: 'The Deepthorn',
  kind: 'outdoor',
  density: 'core',
  band: [8, 10],
  region: 'thornmark',
  start: { x: 4, y: 1, facing: SOUTH },
  rows: [
    'TT,,:,,,,_~~WWWWWWWWWWWWWWWWWWWW',
    'TTT,:,,,_~~WWWWWWWWWWWWWWWWWWWWW',
    'TTT,:,,_~~WWWWWWWWWWWWWWWWWWWWWW',
    'TT,,:,,_~~WWWWWWWWWWWWWWWWWWWWWW',
    'TT,,:,_~~WWWWWWWWWWWWWWWWWWWWWWW',
    'TT,,:,_~~WWWWWWWWWWWWWWWWWWWWWWW',
    'TT,,:,_~~WWWWWWWWWWWWWWWWWWWWWWW',
    'TT,,:_~~WWWWWWWWWWWWWWWWWWWWWWWW',
    'TT,:__~~WWWWWWWWWWWWWWWWWWWWWWWW',
    'TT:_~~~WWWWWWWWWWWWWWWWWWWWWWWWW',
    'TT,:_~~WWWWWWWWWWWWWWWWWWWWWWWWW',
    'TTT:,_~~WWWWWWWWWWWWWWWWWWWWWWWW',
    'TTT,:,_~~WWWWWWWWWWWWWWWWWWWWWWW',
    'TTTT:,_~~WWWWWWWWWWWWWWWWWWWWWWW',
    'TTTT:,_~~WWWWWWWWWWWWWWWWWWWWWWW',
    'TTTT:,_~~WWWWWWWWWWWWWWWWWWWWWWW',
    'TTTT:,_~~WWWWWWWWWWWWWWWWWWWWWWW',
    'T"MT:,,_~~WWWWWWWWWWWWWWWWWWWWWW',
    'T"Mr,,,,_~~WWWWWWWWWWWWWWWWWWWWW',
    'TSM,,,,,,_~~WWWWWWWWWWWWWWWWWWWW',
    '__,,,,,,,_~~WWWWWWWWWWWWWWWWWWWW',
    '~__,,,,,,_~~WWWWWWWWWWWWWWWWWWWW',
    '~~~___,,__~~WWWWWWWWWWWWWWWWWWWW',
    'W~~~~~__~~~WWWWWWWWWWWWWWWWWWWWW',
    'WWW~~~~~~~WWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWW~~WWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
  ],
  exits: [
    { x: 4, y: 0, to: 'deepthorn_j4', tx: 4, ty: 30, tf: NORTH },
  ],
  features: [
    // The head, from the glade road's end: the crown, the standing stone and the rubbing.
    { kind: 'event', x: 4, y: 17, id: 'j5_head', once: true, text: 'Penspern. The trees stop and the grass runs down to a tip of rock, and at the tip stands one tree alone, and it is not still.' },
    { kind: 'event', x: 4, y: 18, id: 'j5_stone', once: true, text: 'A standing stone on the crown, one mark cut in its face. The Eldest\'s roots lie a spear\'s length short of it.' },
    // The Older Mark (#56's 16): the rubbing, taken once, for Senara in Henlys.
    { kind: 'event', x: 4, y: 19, id: 'j5_rubbed', once: true, text: 'Charcoal on the lorekeeper\'s paper, and the mark coming up white out of the black: cut straight, and even, and deep.' },
    { kind: 'chest', x: 3, y: 19, id: 'j5_rubbing', gold: 0, items: ['stone_rubbing'] },
    // The Light on Penspern (#56's 19): the fire-stack, by day, by night and once put out; Kea at it
    // by night; the Warden sergeant on the crown once Helmstow is warned.
    { kind: 'event', x: 6, y: 19, id: 'j5_stack_day', once: true, when: { hours: 'day' }, text: 'A driftwood stack on the crown, taller than a man, the turf black round it. The wood stinks of oil.' },
    { kind: 'event', x: 6, y: 19, id: 'j5_stack_night', once: true, when: { hours: 'night' }, until: { flag: 'q_light_out' }, text: 'The stack roars, and lights the Wyke for miles. On the shingle under it, something moves that is not a wave.' },
    { kind: 'event', x: 6, y: 19, id: 'j5_stack_cold', once: true, when: { hours: 'night' }, after: { flag: 'q_light_out' }, text: 'The stack stands cold. Out on the Wyke a lantern goes by, slow, looking for a light that is not there.' },
    { kind: 'npc', x: 6, y: 18, name: 'Kea, of the hold\'s youths', when: { hours: 'night' }, lines: [
      'A young elf feeds the fire with an oar-blade, her face black with it, and does not stop when she sees you. Three more sit in the lee of the stone with their bows across their knees.',
      '"Don\'t. We know what Sylvane\'s peace says about fires on the head; we\'re the ones who light it anyway. Since the Hearth began to stutter the Wyke\'s boats have had nothing to steer home by, and men were drowning, so we come out and burn a night\'s wood, and they don\'t."',
      '"That\'s the whole of it, and I\'d tell the Elder the same." She throws on another blade. "Only there\'s a boat comes in under the head some nights, showing no light, and it is not fishing. It waits for our fire. We didn\'t light it for them. We can\'t stop them using it."',
    ], flag: 'q_light', choice: { ask: '"So say it, since you\'ve the face for saying things. Put the fire out, and the boats lose it. Keep it, and we send word to Helmstow of what lands under it. Which?"', answers: [
      { label: 'Put it out.', sets: 'q_light_out', says: [
        'She looks at the fire for a long moment, and then she and the three of them put it out with sand, not water, so that it will not take again.',
        '"There. The boats will steer by the Hearth, when there is one." She sits down in the dark. "If a Gullwick man drowns this month you\'ll not hear of it, and neither will I. That\'s the trouble with the sea. It never sends word."',
      ] },
      { label: 'Keep it, and warn Helmstow.', sets: 'q_light_kept', says: [
        '"Helmstow." She says it like a word from a language she learned once. "All right. The boat goes to Gullwick with the fish tomorrow, and a letter with it, and we\'ll see whether the Crown sends anyone. I\'d not lay money."',
        '"We\'ll light it till they come. And after, I expect. They\'re not likely to be the sort who row."',
      ] },
    ] }, says: [
      { after: { flag: 'q_light_out' }, lines: [
        'Kea sits by the cold stack with her bow strung, watching the water.',
        '"Two boats went onto the Mewstone the night after. Nobody drowned; they walked off at low tide. Don\'t tell me it wasn\'t the fire." A pause. "The grey boat came anyway. Stood off all night, and went away. They\'ll find another light. That\'s what they do."',
      ] },
      { after: { flag: 'q_light_kept' }, lines: [
        '"They came. Four of them and a sergeant, in a hired boat, and they were sick the whole way." She feeds the fire. "They stood on the beach the first night and watched the grey boat unload, and wrote it down, and let it go. Wrote it down. I could have done that."',
      ] },
    ] },
    { kind: 'npc', x: 7, y: 20, name: 'a Warden sergeant, on the head', after: { flag: 'q_light_kept' }, lines: [
      'A Warden sergeant stands on the crown with his cloak over his nose against the oil-smoke, and four men behind him who would rather be anywhere.',
      '"Sergeant Cenric, on the Regent\'s word. We\'re to observe the head and report on boats. Observe, and report." He watches you take that in. "The fire\'s the elves\' business and none of ours. The boat is a matter for the customs house, and I\'ve a paper that says so. We\'re here a month. Then we go home, and someone reads what I wrote."',
      '"You did right to send word. I\'d not do it again."',
    ] },
    // The tip, and the Hearth across the water.
    { kind: 'event', x: 8, y: 22, id: 'j5_hearth', once: true, text: 'The Hearth, across the water, sea to sky. On a still night, one low note, held, that you feel in your teeth.' },
    // The beach under the head: the keel marks, the Hand's boat by night, and the sea cave behind the rock.
    { kind: 'event', x: 1, y: 20, id: 'j5_keels', once: true, text: 'Keel marks on the shingle under the head, many, and every one runs up to the rock and stops, as if the boats went into it.' },
    { kind: 'event', x: 1, y: 21, id: 'j5_landing', once: true, when: { hours: 'night' }, text: 'A boat on the shingle, unlit. Grey shapes carry crates from it into the rock, one by one, without a word.' },
    { kind: 'event', x: 1, y: 18, id: 'j5_cave', once: true, text: 'A dry cave under the head, and crates packed in straw. In the straw, pieces of stone that hum in your teeth.' },
    { kind: 'chest', x: 1, y: 17, id: 'j5_crates', gold: 120, items: ['greatsword+2'] },
    // The wilderness (#45).
    { kind: 'shrine', x: 8, y: 19, id: 'j5_shrine', text: 'A shrine on the crown\'s edge, a ring of sea-pebbles round a whale\'s rib stood upright.', stat: 'endurance', done: 'The pebbles are wet with spray, and the rib stands.' },
    { kind: 'camp', x: 4, y: 21, name: 'The lee of the head', text: 'A camp in the lee of the head, out of the wind off the Wyke, the turf flattened where the youths sleep.' },
    { kind: 'cairn', x: 7, y: 22, id: 'j5_cairn', text: 'A cairn at the tip, its stones white with salt, and a boat\'s iron ring set among them.', gold: 60, items: ['potion_sp_great'] },
  ],
  secrets: [{ x: 1, y: 19, hint: 'j5_keels' }],
  // Great owls over the neck by night, rootwalkers on the glade road down it, a heartwood over
  // brambles across the road where the neck is narrowest, the Hand's landing party on the beach by
  // night and the Eldest at the tip with two heartwoods at its roots: the boss, a guardian, awake
  // until beaten whichever the company does first (MONSTERS §5.4). The rest of the old wood sleeps
  // once the tear is closed.
  encounters: [
    { id: 'j5_owls', x: 3, y: 3, when: { hours: 'night' }, monsters: ['great_owl', 'great_owl', 'great_owl', 'great_owl'], aware: 5, respawn: 1440, until: TEAR_CLOSED },
    { id: 'j5_rootwalkers', x: 3, y: 8, monsters: ['rootwalker', 'rootwalker', 'rootwalker'], aware: 3, respawn: 2880, until: TEAR_CLOSED },
    { id: 'j5_heartwood', x: 4, y: 12, monsters: ['heartwood', 'bramble', 'bramble'], aware: 1, roams: false, respawn: 2880, until: TEAR_CLOSED },
    { id: 'j5_landing', x: 2, y: 21, when: { hours: 'night' }, monsters: ['ashen_adept', 'zealot', 'zealot', 'zealot', 'zealot', 'zealot'], aware: 3, respawn: 1440 },
    { id: 'j5_eldest', x: 6, y: 22, monsters: ['eldest', 'heartwood', 'heartwood'], aware: 2, roams: false,
      slainText: 'The Eldest stops. Its roots go slack, its crown settles, and a bough comes down at your feet. It is not dead. It is asleep, as it was before anything living was born.' },
  ],
};
