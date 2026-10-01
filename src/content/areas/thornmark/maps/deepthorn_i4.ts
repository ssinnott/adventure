// The Deepthorn, box I4: Henlys. Core, band 8-10: the oldest elf-hold, its halls grown into oaks
// and its gate shut against its own wood, where the treaty sealed with the chisel's mark is kept;
// the old groves round it, where the rootwalkers stand in rings, and behind their holly the hold's
// first grove; the long glade down the box's east side, the road on to the head; the Wyke's shore
// on the west. Cut from the atlas by tools/scaffold.ts; docs/areas/thornmark.md §4.4 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';
import { TEAR_CLOSED } from './grove2.ts';

export const DEEPTHORN_I4: MapDef = {
  id: 'deepthorn_i4',
  name: 'The Deepthorn',
  kind: 'outdoor',
  density: 'core',
  band: [8, 10],
  region: 'thornmark',
  // Henlys's halls are oaks grown into walls: bark, not stone.
  palette: { floor: '#3f8a34', wall: '#6e5a3e', wallDark: '#4a3c28', banner: '#2a6a3a' },
  start: { x: 12, y: 0, facing: SOUTH },
  rows: [
    'TTTTTTTTTTTT:TTTTTTTTTTTTTTTTTTT',
    'TTTTTTTTTTTT:TTTTTTTTTTTTTTTTTTT',
    'TTTTTTTTTTTT:TTTTTTTTTTTTTTTTTTT',
    'TTTTTTTTTTTT:TTTTTTTTTTT,TTTTTTT',
    'TTTTTTTTTTTT:TTTTTTTTTTT,,,,,TTT',
    'TTTTTBBBBBBB,BBBBTTTTTTT,,,,,TTT',
    'TTTTTBBBBBBB,BBBBTTTTTTTT,,,,,,T',
    'TTTTTBBBBBBB,BBBBTTTTTTTTT,,,,,T',
    'TTTTTBBBBBBB,BBBBTTTTTTTTT,,,,,,',
    'TTTTTBBBB,,,,,BBBTTTTTTTTT,,,,,,',
    'TTTTTBBBB,,,,,,,,::::::::::,,,,,',
    'TTTTTBBBB,,,,,BBBTTTTTTTTT,,,,,,',
    'TTTTTBBBB,,,,,BBBTTTTTTTTT,,,,,,',
    '~TTTTBBBBB,BBBBBBTTTTTTTTT,,,,,,',
    '~TTTTBBBBB,BBBBBBTTTTTTTTTTT,,,,',
    '~~~TTBBBBB,BBBBBBTTTTTTTTTTT,,,,',
    'W~~~~TTTTT:TTTTTTTTTTTTTTTTT,,,,',
    'WWW~~TTTTT:TTTTTTTTTTTTTTTTT:,,,',
    'WWWW~~~,,,,,,,,,,,,,,TTTTTTT:TTT',
    'WWWW~~,,,,,,,,,,,,,,,TTTTTTT:TTT',
    'WWWW~~TTT,,,TTT,,,,,,T,,,,TT:TTT',
    'WWWW~~TTT,,,TTT,,,,,,T,,,,TT:TTT',
    'WWWW~~TTT,,,TTT,,TTT,S,,,,TT:TTT',
    'WWWW~~,,,,,,,,,,,TTT,T,,,,TT:TTT',
    'WWWW~~TTT,,,TTT,,TTT,T,,,,TT:TTT',
    'WWWWW~~TT,,,TTT,,,,,,TTTTTTT:TTT',
    'WWWWWW~~T,,,TTT,,,,,,TTTTTTT:TTT',
    'WWWWWWW~~,,,,,,,,,,,,TTTTTTT:TTT',
    'WWWWWWWW~~~TTTTTTTTT:::::::::TTT',
    'WWWWWWWWW~~~~~TTTTTTTTTT:TTTTTTT',
    'WWWWWWWWWWW~~~~~~TTTTTTT:TTTTTTT',
    'WWWWWWWWWWWWWW~~~~TTTTTT:TTTTTTT',
  ],
  features: [
    { kind: 'event', x: 12, y: 3, id: 'i4_gate', once: true, text: 'Henlys. Halls grown into oaks wider than houses, and brambles standing in the shut gate like a guard.' },
    { kind: 'event', x: 12, y: 9, id: 'i4_inside', once: true, text: 'Inside, the hold is quiet the way a held breath is quiet. Elves watch you from the galleries, and nobody comes down.' },
    { kind: 'camp', x: 11, y: 10, name: 'The gate-yard hearth', text: 'A hearth in the gate-yard, kept lit for travellers by a custom older than the gate.' },
    { kind: 'well', x: 13, y: 12, heal: true, text: 'The hold\'s spring, cold from under the oaks.' },
    { kind: 'event', x: 9, y: 9, id: 'i4_treaty', once: true, text: 'The hall, a hollow oak. Under horn at its end, a treaty with two seals: the Crown\'s, and the hold\'s oldest mark.' },
    // The treaty's seal, the Deepthorn's step: Senara stands before the treaty in the hall, her
    // first words by what the company knows, furthest along first; then The Older Mark's ask
    // (#56's 16), which is her hire, so that a rubbing brought unasked hears her early words. She
    // takes the rubbing from Penspern (J5) at the first meeting and puts its question at the next,
    // before her first words if the company brought it before it saw the treaty. Her lines are the
    // ask's reminder, heard only once she has asked. Mawgan, the elder, keeps the elves' claim and
    // does not speak of it.
    { kind: 'npc', x: 10, y: 9, name: 'Senara, lorekeeper of Henlys', lines: [
      '"The stone on Penspern\'s crown, charcoal on the paper, the whole face." She does not look up from the treaty. "I will be here. So will it."',
    ], flag: 'q_mark', quest: {
      item: 'stone_rubbing', reward: 150, setFlag: 'q_mark_shown',
      done: [
        'Senara lays the rubbing on the treaty, mark over mark, and holds a lamp behind the paper so that the two show through each other.',
        '"The same. Line for line, as the chisel was." She moves the lamp. "But look at the strokes. Ours were drawn with a brush, by someone copying. The stone\'s were cut, straight and even, by someone who had cut ten thousand of them and never once thought about it. We were copied from the stone. And the stone was here before the elves."',
        '"I said I would rather be shown. Now I have been." She folds it. "Burn this. I will tell you why if you ask. I would rather you did not."',
      ],
      early: [
        'Senara sees what you carry, and takes it, and lays it on the treaty, mark over mark, without a word about why you have it.',
        '"You took a rubbing of the head\'s stone. Nobody has, that I know of; the lore says our mark was copied from it, and here it is." She holds a lamp behind the two. "The same, line for line. But ours was drawn by a copyist, and the stone\'s was cut by someone who had cut ten thousand. We are the copy. And the stone was here before us."',
        '"That is Lantern money, since it was their question first. Burn the paper. I will tell you why if you ask. I would rather you did not."',
      ],
    }, says: [
      // The Older Mark's question, put at the meeting after the hand-in, before anything else.
      { after: { flag: 'q_mark_shown' }, until: [{ flag: 'q_mark_burnt' }, { flag: 'q_mark_kept' }], lines: [
        'Senara has the lamp lit though it is day, and the treaty\'s cover down.',
        '"You did not ask. I will say it once anyway, so that you know what you are burning, and I need not say it twice."',
      ], choice: { ask: '"The hold\'s claim to a throne rests on that seal. If ours copies a stone that stood here before us, it claims something that was never ours. Burn the rubbing, or carry the question where it can be answered."', answers: [
        { label: 'Burn it.', sets: 'q_mark_burnt', says: [
          'She holds the paper to the lamp until it is gone, and the ash to the lamp after it.',
          '"Thank you. The seal is ours again, for as long as nobody else takes a rubbing." She puts the lamp out. "I will not tell the elder. He has enough to keep."',
        ] },
        { label: 'We\'ll keep it.', sets: 'q_mark_kept', gives: 'stone_rubbing', says: [
          '"Then carry it far, and carry it to someone who reads cut marks better than I do. The dwarves cut stone. I have heard they read it too." She gives it back folded small, like a thing already hidden. "If it says what I think it says, do not bring it back here. I will have said so once, and once will have been enough."',
        ] },
      ] } },
      { after: { flag: 'q_grove_done' }, until: { flag: 'q_treaty' }, sets: 'q_treaty', lines: [
        'An elf woman with ink on her fingers stands between you and the treaty, and does not move until you have said Sylvane\'s name.',
        '"Sylvane sent you. Then she has told you what the chisel carried, and you have come to see whether she is right." She lifts the horn cover. "Look at the second seal. Not the Crown\'s; ours. It is the oldest mark the hold has, older than the hold. We put it on this treaty two hundred years ago because it was the most sacred thing we owned."',
        '"It is the mark on the tool that cut the Grove Stone. Line for line. I have had two months to look for a difference and I have not found one." She lets the cover down. "This paper says the elves\' line and Helmstow\'s were once one line. I have begun to wonder what else it says."',
      ] },
      { after: { item: 'ashen_chisel' }, until: { flag: 'q_treaty' }, sets: ['q_treaty', 'q_seal_matched'], lines: [
        'An elf woman with ink on her fingers stands between you and the treaty. Her eyes go to your pack before they go to your face.',
        '"You are carrying something that hums. Set it beside the second seal. Not the Crown\'s; ours." You do, and she looks from the tool\'s runes to the wax for a long time, and then puts the horn cover back very gently, as if the paper were asleep.',
        '"That mark is the oldest thing the hold owns. It is on this treaty because it was the most sacred thing we had to put there. It is on your chisel because a smith put it there to say what the chisel is for." She wipes her fingers. "Take that to Sylvane. Then come back. I will have something to ask you."',
      ] },
      { until: { flag: 'q_treaty' }, sets: ['q_treaty', 'q_seal_unknown'], lines: [
        'An elf woman with ink on her fingers stands between you and the treaty, and looks at you the way the keeper of a thing looks at someone who has walked a long way to see it.',
        '"No word from Sylvane, so you came for the treaty, or by chance. Either is allowed. Look, then. Two seals: the Crown\'s, and the hold\'s own mark, older than the hold and older than the paper. It says the elves\' line and Helmstow\'s were once one line."',
        '"Nobody comes to read it. They come to look at the seal. It means nothing to them, and they look anyway, as you are looking now." She lets the horn down. "If you ever see that mark somewhere else, come back and tell me where."',
      ] },
      { after: { flag: ['q_treaty', 'q_grove_done'] }, until: [{ flag: 'q_mark' }, { flag: 'q_mark_shown' }], sets: 'q_mark', lines: [
        '"There is one more place that mark is, and I have not seen it with my own eyes: a standing stone on the crown of Penspern, at the end of the glade, that was there when the first of us came. Our fathers copied their mark from it. That is all the lore says, and the lore is two hundred years old and no more."',
        '"The head is the Eldest\'s now, but the stone stands short of its roots. Take a rubbing of the stone\'s face, charcoal on this, and bring it to me. I want to lay it beside the seal, and beside what you told me of the chisel, and see which of the three is oldest. I think I know. I would rather be shown."',
      ] },
      { after: { flag: 'q_treaty' }, until: [{ flag: 'q_mark' }, { flag: 'q_mark_shown' }], sets: 'q_mark', lines: [
        '"You looked at the seal longer than most. So I will ask you what I ask nobody. There is a standing stone on the crown of Penspern, at the end of the glade, older than the hold, and the lore says our mark was copied from it. I have never seen it. The head is the Eldest\'s now."',
        '"The stone stands short of its roots. Take a rubbing of its face, charcoal on this, and bring it here. I want the two side by side, the stone\'s and ours, and I want to know which is the copy."',
      ] },
      { after: { flag: 'q_mark_burnt' }, lines: [
        '"Burnt. I sleep no better for it." The treaty\'s cover is down. "But I sleep."',
      ] },
      { after: { flag: 'q_mark_kept' }, lines: [
        '"You still have it. I can tell; you look at the seal the way I do now." She turns back to her ink. "Go south, or east, or wherever it takes you. Not here."',
      ] },
    ] },
    { kind: 'npc', x: 9, y: 12, name: 'Mawgan, elder of Henlys', lines: [
      'The hold\'s elder sits under the oak the hall is grown from, older than Sylvane and thinner, with a bow across his knees that he has not strung in years.',
      '"Strangers. Sylvane\'s, or the road\'s; it comes to the same, and you are welcome to the hearth and the spring. You are not welcome to questions. The lorekeeper will show you the treaty, because that is what she is for. I keep what the treaty means, and I keep it."',
      '"Go and see the paper. Then go home, and tell whoever sent you that the hold keeps it still."',
    ], says: [
      { after: { flag: 'q_treaty' }, lines: [
        '"You have seen it. Good. Now you know what everybody knows: that two lines were once one, and that a seal says so." He does not look up. "What a seal is worth is a question for a Council, and there is no Council, and there is no Queen. So the hold keeps it, and I keep the hold. Go carefully in the groves."',
      ] },
    ] },
    { kind: 'shrine', x: 29, y: 14, id: 'i4_shrine', text: 'A shrine in the glade: a ring of white stones, the moss kept off them by someone.', stat: 'intellect', done: 'The white stones are clean still.' },
    { kind: 'sign', x: 26, y: 10, text: 'West: Henlys. South, down the glade: Penspern. Past the glade Henlys keeps no peace, and asks none.' },
    { kind: 'statue', x: 24, y: 3, id: 'i4_statue', name: 'The first elder', text: 'A statue of the hold\'s first elder, its face gone to lichen, one hand raised as if towards a gate.',
      riddle: 'I was here before the hold, and I will be here when its gate is grass. Thornhold\'s gate says what to leave me.', answer: 'standing',
      gift: { items: ['brigandine+3'] }, done: 'The stone hand is down, and what it held is yours. The lichen is taking the face again.' },
    { kind: 'event', x: 10, y: 19, id: 'i4_groves', once: true, text: 'The old groves: oaks in rings, and rootwalkers among them like stumps. Every one faces the same way.' },
    { kind: 'event', x: 20, y: 22, id: 'i4_holly', once: true, text: 'Every rootwalker in the groves is turned the same way: towards a wall of holly on the east side.' },
    { kind: 'event', x: 23, y: 22, id: 'i4_first_grove', once: true, text: 'One oak behind the holly, older than the rings, and at its roots, in rows, the dead hunters\' bows, unstrung.' },
    { kind: 'chest', x: 24, y: 21, id: 'i4_bows', gold: 275, items: ['elfbow+2'] },
  ],
  secrets: [{ x: 21, y: 22, hint: 'i4_holly' }],
  // The old wood woke when the Stone was cut, and sleeps once the tear is closed: its groups stop
  // coming back then, and one still standing stays until it is killed (MONSTERS §5.4).
  encounters: [
    { id: 'i4_gate_brambles', x: 12, y: 5, monsters: ['bramble', 'bramble', 'bramble'], aware: 1, roams: false, until: TEAR_CLOSED, respawn: 2880 },
    { id: 'i4_east_brambles', x: 21, y: 10, monsters: ['bramble', 'bramble', 'bramble'], aware: 1, roams: false, until: TEAR_CLOSED, respawn: 2880 },
    { id: 'i4_south_brambles', x: 10, y: 17, monsters: ['bramble', 'bramble', 'bramble'], aware: 1, roams: false, until: TEAR_CLOSED, respawn: 2880 },
    { id: 'i4_oak', x: 17, y: 27, monsters: ['heartwood', 'bramble', 'bramble', 'bramble'], aware: 2, roams: false, until: TEAR_CLOSED, respawn: 2880 },
    { id: 'i4_walkers_west', x: 6, y: 23, monsters: ['rootwalker', 'rootwalker', 'rootwalker'], aware: 3, until: TEAR_CLOSED, respawn: 2880 },
    { id: 'i4_walkers_east', x: 16, y: 23, monsters: ['rootwalker', 'rootwalker', 'rootwalker'], aware: 3, until: TEAR_CLOSED, respawn: 2880 },
    { id: 'i4_night', x: 28, y: 23, when: { hours: 'night' }, monsters: ['great_owl', 'great_owl', 'bramble', 'bramble'], aware: 3, roams: false, until: TEAR_CLOSED, respawn: 1440 },
    { id: 'i4_wolves', x: 29, y: 8, monsters: ['dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf'], aware: 5, respawn: 1440 },
    { id: 'i4_spiders', x: 9, y: 27, monsters: ['thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider'], aware: 4, respawn: 1440 },
  ],
};
