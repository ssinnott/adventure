// The Glasswold, box B9: the Glass's edge. Country, band 26-28: the dunes between the Wold and the Glass,
// walked into over the north edge from the Wold's heart (B8). The last of the grass under the rim, a
// Riders' cairn at the dunes' head, then the dunes, the box's half, shifting with the wind down to the
// rim's foot; glass scorpions in them, vultures at the hills' foot and a glass walker alone at their
// middle. In the south-east the mesa at the dunes' end and the gap between it and the rim's foot, where
// the sand gives way to glass: the Riders' watch on the last grass at its mouth, three of them at a fire
// before a yurt, two walkers under the mesa's face, and past the gap's last square the Glass, the reach,
// and the Tower's crown standing out of it. On the gap's last sand Eadmer, a scholar the Riders let sit
// there and no further, who teaches the Sorcerer's third for the glasses two walkers carried (#807). A
// walker that stopped long ago lies half-buried in the one dune that does not shift. The rim down the west
// and along the south; C9, east, is not built.
// The atlas's glass inside the box is the mesa and the rim's foot: the Glass is past the box's edge.
// Cut from the atlas by hand (tools/scaffold.ts refuses its glass); docs/areas/glasswold.md §4.8 is its brief (#530).
import type { MapDef } from '../../../../game/mapdef.ts';
import { SOUTH } from '../../../../game/types.ts';
import { RESPAWN } from '../../../../game/keys.ts';

/** The flag the watch's words set, said once: The Warning's last step on the Wold keys on it, or on `b9_glass` (#531). */
export const WATCH = 'gap_watch';

/**
 * The Sorcerer's third (#807), What the Walkers Carried: Eadmer has asked a sorcerer of 27 with the second
 * for the glasses two walkers carried (`SCHOLAR_ASKED`); been given the etched one, from the fallen walker's
 * hollow on D9, which he takes at the first meeting that holds it (`ETCHING_GIVEN`); and been given the one
 * with a light, from the half-buried walker's cache here, at his question once he has the etching, and read
 * the one by the other's light (`ETCHING_READ`), which his teaching waits on.
 */
export const SCHOLAR_ASKED = 'q_scholar_asked', ETCHING_GIVEN = 'q_etching_given', ETCHING_READ = 'q_etching_read';

export const WOLD_B9: MapDef<'wold_b9'> = {
  id: 'wold_b9',
  name: 'The Wold',
  kind: 'outdoor',
  density: 'country',
  band: [26, 28],
  region: 'glasswold',
  start: { x: 16, y: 0, facing: SOUTH },
  rows: [
    'M^^^^^^^s^ssssssssssssssssssssss',
    'M^^^^^^^sssssssssssuuuuuuuussuuu',
    'M^^^^^^ssssssssssuuuuuuuuuuuuuuu',
    'M^^^^^ssssssssssuuuuuuuuuuuuuuuu',
    'M^^^^^ssssssssuuuuuuuuuuuuuuuuuu',
    'M^^^^^sssssuuuuuuuuuuuuuuuuuuuuu',
    'M^^^^ssssssuuuuuuuuuuuuuuuuuuuuu',
    'M^^^^sssssuuuuuuuuuuuuuuuuuuuuuu',
    'M^^^^ssssuuuuuuuuuuuuuuuuuuuuuuu',
    'M^^^^ssssuuuuuuuuuuuuuuuuuuuuuuu',
    'M^^^^^sssuuuuuuuuuuuuuuuuuuuuuuu',
    'M^^^^^^^uuuuuuuuuuuuuuuuuuuuuuuu',
    'M^^^^^^uuuuuuuuuuuuuuuuuuuuuuuuu',
    'MM^^^^uuuuuuuuuuuuuuuuuuuuuuuuuu',
    'MMM^^uuuuuuuuuuuuuuuuuuuuuuuuurr',
    'MMMMMuuuuuuuuuuuuuuuuuuuuuuuurrr',
    'MMMMMuuuuuuuuuuuuuuuuuuuuuuuurrr',
    'MMMMMMuuuuuuurrrruuuuuuuuuuurrrr',
    'MMMMMMMuuuuuuruuSuuuuuuuuuuurrrr',
    'MMMMMMMMuuuuurrrruuuuuuuuuurrrrr',
    'MMMMMMMMuuuuuuuuuuuuuuuuuuurrrrr',
    'MMMMMMMMMMMuuuuuuuuuuuuuuuurrrrr',
    'MMMMMMMMMMMMuuuuuuuussssuuurrrrr',
    'MMMMMMMMMMMMMuuuuuussssssuurrrrr',
    'MMMMMMMMMMMMMMuuuusss:sssuurrrrr',
    'MMMMMMMMMMMMMMuuuuss:::sssurrrrr',
    'MMMMMMMMMMMMMMMuuuuss:sssssrrrrr',
    'MMMMMMMMMMMMMMMMuuuusssssssuuuuu',
    'MMMMMMMMMMMMMMMMMMuuuuuuuuMMMMMM',
    'MMMMMMMMMMMMMMMMMMMuuuuMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
    'MMMMMMMMMMMMMMMMMMMMMMMMMMMMMMMM',
  ],
  features: [
    // In over the north edge from the Wold's heart: the dunes seen, the Riders' cairn at their head, the
    // rim, and a horse's prints come up out of the dunes alone (#56's 51, the horse that came back, #532's).
    { kind: 'event', x: 16, y: 2, id: 'b9_dunes', once: true, text: 'South the grass gives out to dunes, ridge on ridge to the rim\'s foot, the wind smoking off their crests.' },
    { kind: 'cairn', x: 13, y: 4, id: 'b9_cairn', text: 'A Riders\' cairn at the dunes\' head, half drifted over. A horse\'s skull on top of it looks south.', gold: 400, items: ['elixir'] },
    { kind: 'event', x: 3, y: 5, id: 'b9_rim', once: true, text: 'West the rim goes up sheer from the hills. Nothing grows past their foot, and the dunes run along it south.' },
    { kind: 'event', x: 26, y: 4, id: 'b9_horse', once: true, text: 'A horse\'s prints come up out of the dunes, one horse alone and deep, as if it carried something heavy. They go north.' },
    // The dunes: their glare to the south-east and something standing in it, the wind that shifts them, a
    // lion the scorpions met and the mesa at their east end.
    { kind: 'event', x: 28, y: 9, id: 'b9_glare', once: true, text: 'From the crest of a dune the glare to the south-east is too bright to look at. Something dark stands up out of it.' },
    { kind: 'event', x: 12, y: 10, id: 'b9_shifting', once: true, text: 'The wind takes the crests off the dunes and lays them down further on. Behind you your tracks are filling.' },
    { kind: 'event', x: 7, y: 16, id: 'b9_stung', once: true, text: 'A lion lies dead in a hollow of the dunes, swollen, three small wounds in its flank glittering.' },
    { kind: 'event', x: 24, y: 17, id: 'b9_mesa', once: true, text: 'A mesa stands at the dunes\' east end, sheer on the windward side. Past its foot the light is white.' },
    // The secret: the one dune that does not shift, and in it a walker that stopped long ago, its chest open
    // to the sand and a cache in it: gold, and a piece of glass with a light in it (the scholar in the gap reads by it, #807).
    { kind: 'event', x: 17, y: 18, id: 'b9_still', once: true, text: 'Every dune round about smokes in the wind and creeps. This one does not, and the sand that lands on it slides off.' },
    { kind: 'event', x: 15, y: 18, id: 'b9_walker', once: true, text: 'Under the crust a walker lies where it stopped, half in the sand, its lamp dark. Its chest stands open to the sand.' },
    { kind: 'chest', x: 14, y: 18, id: 'b9_cache', gold: 1600, items: ['glass_light'] },
    // The gap's mouth: the rim's foot shutting the south, the watch's horses, their fire and yurt on the last
    // grass, and the three Riders who keep the gap, words only (the chapter's step, #531's).
    { kind: 'event', x: 18, y: 28, id: 'b9_rim_foot', once: true, text: 'The rim comes round under the dunes and shuts the south. Over its foot the sky is white with the glare.' },
    { kind: 'event', x: 23, y: 22, id: 'b9_horses', once: true, text: 'The watch\'s horses stand saddled on the last grass, hobbled, their heads all turned toward the gap.' },
    { kind: 'camp', x: 21, y: 25, text: 'The watch\'s fire on the last grass, banked with dung, before a yurt of white felt. Its door faces the gap.' },
    { kind: 'npc', x: 20, y: 24, name: 'An old Rider at the fire', flag: WATCH, lines: [
      'An old Rider sits at the fire with her back to the Wold and a lance across her knees, watching the gap.',
      '"We keep the gap. Nobody goes in by it, and what walks out of it we turn, if it will turn."',
      '"My mother kept it, and hers. Something is always walking out."',
    ] },
    { kind: 'npc', x: 22, y: 24, name: 'A Rider with a strung bow', flag: WATCH, lines: [
      'A Rider stands by the yurt with an arrow on the string. He has not looked away from the gap.',
      '"They come out one or two, slow, and never stop for us. They are going somewhere."',
      '"The dark thing standing out there was there before the Riders. Do not ask me what it is."',
    ] },
    { kind: 'npc', x: 20, y: 26, name: 'The youngest of the watch', flag: WATCH, lines: [
      'A girl of the Riders sits apart, whetting a spearhead, her horse\'s reins round her wrist.',
      '"Some nights there is a light out there, far in, on the dark thing. One light. Then none."',
    ] },
    // The gap: the Riders' stones and their word, the walker's tracks where the sand gives way to glass, and
    // from its last square the Glass, the reach, past the box's edge.
    { kind: 'event', x: 27, y: 27, id: 'b9_line', once: true, text: 'Two stones stand either side of the way, taller than a horse. A Rider calls from the fire: "That is the Glass. What walks there would not spare you."' },
    { kind: 'event', x: 29, y: 27, id: 'b9_tracks', once: true, text: 'One set of prints comes up off the glass onto the sand, a long stride apart, going out. On the glass there is no mark.' },
    { kind: 'event', x: 31, y: 27, id: 'b9_glass', once: true, text: 'The sand ends, and underfoot is glass. The Glass runs white to the sky, and far off a dark crown stands up out of it.' },
    // On the gap's last sand, a square short of the glass: Eadmer, the scholar, the Sorcerer's third (#807).
    // His own words first; to a sorcerer of 27 with the second, once, his ask for the glasses two walkers
    // carried. The etched one he takes at the first meeting that holds it, from any company; with the etching
    // his and the light in the pack, his question, and given, he reads the one by the other's light and his
    // menu teaches the Magus for it and no gold. After, his own words again.
    { kind: 'npc', x: 30, y: 27, name: 'Eadmer, the scholar', lines: [
      'A man sits on the last of the sand with a board across his knees and his back to the Riders, looking out over the Glass.',
      '"Eadmer. They let me sit here, and no further. Nine years now."',
      '"What is written out there, I cannot walk to. So I read what walks out."',
    ], flag: 'b9_scholar_met', quest: { item: 'etched_glass', reward: 0, setFlag: ETCHING_GIVEN, done: [
      'He has the etched glass out of your hand before you offer it, and turns it to the glare, close to his eye.',
      '"Cut, and finer than hair. Not by daylight, nor by any lamp I own."',
    ] }, says: [
      { after: { flag: ETCHING_GIVEN, item: 'glass_light' }, until: { flag: ETCHING_READ }, lines: [
        'A green-white light shows through your pack. He is on his feet before you have it out.',
      ], choice: { ask: 'Give him the glass with a light?', answers: [
        { label: 'Give it', takes: 'glass_light', sets: ETCHING_READ, says: [
          'He holds the light behind the etching, and its lines fall on his board a hand high: the land and the sea, a wall at either end and a line across the top of it all.',
          '"Every map I ever saw stops at the rim," he says, copying it. "This one has a lid."',
        ] },
        { label: 'Not yet', says: ['He sits down again, and turns the etching to the glare.'] },
      ] } },
      { after: { flag: 'b9_scholar_met', member: { cls: 'sorcerer', level: 27, prestige: 2 } }, until: [{ flag: SCHOLAR_ASKED }, { flag: ETCHING_GIVEN }], sets: SCHOLAR_ASKED, lines: [
        'He looks round at your sorcerer at last, and sets the board down.',
        '"Two walkers lie where they stopped, one on the steppe and one in the dunes behind you. Each carried a glass. Bring me both, and I will show you how a Magus reads."',
      ] },
    ], teaches: { cls: 'sorcerer', prestige: 3, asks: 'walkers_carried', done: { flag: ETCHING_READ }, seek: 'Eadmer, the scholar camped at the Glass\'s edge where the Riders turn everyone back, can make a Magus of a Thaumaturge.' } },
  ],
  secrets: [{ x: 16, y: 18, hint: 'b9_still' }],
  encounters: [
    // From the way in: the scorpions in the dunes by the grass, the vultures at the hills' foot, the walker
    // alone at the dunes' middle, the scorpions under the rim, and the two walkers at the gap, standing under
    // the mesa's face off the way to the gap's last square, the hardest, which a company need not fight to
    // see the Glass.
    { id: 'b9_scorpions', x: 22, y: 8, monsters: ['glass_scorpion', 'glass_scorpion', 'glass_scorpion', 'glass_scorpion'], aware: 3, respawn: RESPAWN.twoDays },
    { id: 'b9_vultures', x: 4, y: 11, monsters: ['vulture', 'vulture', 'vulture', 'vulture', 'vulture', 'vulture'], aware: 3, respawn: RESPAWN.twoDays },
    { id: 'b9_walker', x: 18, y: 14, monsters: ['glass_walker'], aware: 4, respawn: RESPAWN.twoDays },
    { id: 'b9_scorpions_rim', x: 14, y: 23, monsters: ['glass_scorpion', 'glass_scorpion', 'glass_scorpion', 'glass_scorpion'], aware: 3, respawn: RESPAWN.twoDays },
    { id: 'b9_walkers', x: 25, y: 23, monsters: ['glass_walker', 'glass_walker'], aware: 2, roams: false, respawn: RESPAWN.twoDays },
  ],
};
