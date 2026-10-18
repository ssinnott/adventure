// The Kilns, box P5: the hills under the rim at the Stone. Country, band 16-18, the bounds' second (#831):
// the strip of hills between O5's crag and the rim, pocked with the cutters' trial pits, the first cuts
// before the Stone was found, each with its spoil fanned down the slope; a dry pit with a fire laid and
// the old cutter who stayed, a waymark turned to the Stone, a hearth-niche in a pit's wall, the deepest
// pit where the Stone's slag strays keep, a warm seep at the hills' foot, and the trial that struck
// nothing, walled up in the rim's foot. O5's crag runs on across the seam in the south, and the hills
// run on north into P4's south pocket, cut. The P column is 24 wide: cut by hand from the atlas, the
// void written '%'; docs/areas/kilns.md §12.3 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST } from '../../../../game/types.ts';

export const KILNSHEART_P5: MapDef = {
  id: 'kilnsheart_p5',
  name: 'The Kilns',
  kind: 'outdoor',
  density: 'country',
  band: [16, 18],
  region: 'kilns',
  start: { x: 0, y: 16, facing: EAST },
  rows: [
    '^^^^^^MMMMMMM%%%%%%%%%%%',
    '^^^^^^^MMMMMMMM%%%%%%%%%',
    '^^^^^^^MMMMMMMM%%%%%%%%%',
    '^^""^^MMMMMMMMM%%%%%%%%%',
    '^^""^^MMMMMMMMM%%%%%%%%%',
    '^^^^^MMMMMMMMM%%%%%%%%%%',
    '^^^^MMMMMMMMMMMM%%%%%%%%',
    '^^^^^MMMMMMMMMMM%%%%%%%%',
    '^^^^^MMMMMMMMMMMM%%%%%%%',
    '^^^^^^MMMMMMMMMMM%%%%%%%',
    '^^^^""^MMMMMMMMMM%%%%%%%',
    '^^^^""^^MMMMMMMMM%%%%%%%',
    '^^^^^^^^^MMMMMMMMM%%%%%%',
    '^^^^^^^^^^MMMMMMMMM%%%%%',
    '^^^^^^^^^^MMMMMMMMMM%%%%',
    '^^^^^^^^^^^rrrrrMMM%%%%%',
    '^^^^^^^^^^^S...rMMM%%%%%',
    '^^^^^^^^^^^rrrrrMMM%%%%%',
    '^^^^^^^^^^^^MMMMMMM%%%%%',
    '^^^^^^^^^^^^MMMMMMM%%%%%',
    '^^^^^^^^""^^MMMMMMM%%%%%',
    '^^^^^^^^""^MMMMMMMM%%%%%',
    'r^^^^^^^^^^MMMMMMM%%%%%%',
    'r^^^^^^^^^^MMMMMMM%%%%%%',
    'rr^^^^^^^^MMMMMMMM%%%%%%',
    'rr^^^^^^^^MMMMMMMM%%%%%%',
    'rr^^"""^^MMMMMMMMM%%%%%%',
    'rr^^"""^^MMMMMMMMM%%%%%%',
    'rr^^^^^^MMMMMMMMMM%%%%%%',
    'rr^^^^^^^MMMMMMMMMM%%%%%',
    'r^^^^^^^^^MMMMMMMMM%%%%%',
    'r^^^^^^^^^^MMMMMMMM%%%%%',
  ],
  features: [
    // In from O5's hills east of the Stone's cut.
    { kind: 'event', x: 1, y: 16, id: 'p5_hills', once: true, text: 'Past the Stone\'s cut the hills run on to the rim, pocked with old pits, each with its spoil fanned down the slope.' },
    // The dry pit in the north: a fire laid in it, and the old cutter who stayed, with his word on the Stone.
    { kind: 'camp', x: 2, y: 3, name: 'The dry pit', text: 'A dry pit out of the wind, its floor swept and a fire laid in a ring of spoil stones.' },
    { kind: 'npc', x: 3, y: 4, name: 'An old cutter', lines: [
      'An old cutter by the fire, grey with stone dust to the eyebrows, a pick across his knees.',
      '"Forty pits we cut on this hill, and the Stone was over the ridge all along. The rest went down. I stayed."',
      '"Since the ground tore by the Stone, slag comes walking down the pits after dark. It keeps to the deep one."',
    ] },
    // The trial pits: the north one over its spoil, the cairn on a fan, and the deepest one in the south.
    { kind: 'event', x: 4, y: 10, id: 'p5_pit', once: true, text: 'A trial pit, cut square and left at a man\'s depth. Its spoil is grey hill-stone, without a fleck of red.' },
    { kind: 'cairn', x: 7, y: 13, id: 'p5_cairn', text: 'A cairn on a fan of spoil, built of the trial\'s own stone, a broken pick-helve stood up in its top.', gold: 120, items: ['potion_sp_great'] },
    { kind: 'statue', x: 2, y: 19, id: 'p5_waymark', name: 'A waymark', text: 'A dwarves\' waymark, a post of dressed stone with a hammer cut in its face, its head turned to the Stone. Words are cut below.', riddle: 'STRUCK ALL DAY AND NEVER BROKEN. WHAT AM I?', answer: 'anvil', gift: { stat: 'might' }, done: 'The waymark, its hammer to the Stone.' },
    { kind: 'shrine', x: 9, y: 20, id: 'p5_niche', text: 'A hearth-niche cut in the pit\'s wall, soot on its roof and a pick-head left on its sill for luck.', stat: 'accuracy', done: 'The hearth-niche in the pit\'s wall.' },
    { kind: 'event', x: 7, y: 24, id: 'p5_deep', once: true, text: 'The deepest of the trials, sunk to black rock. Slag has run down its sides and set, and some of it is still warm.' },
    // The rim's foot and the warm seep under it, at the hills' south end.
    { kind: 'event', x: 8, y: 28, id: 'p5_rim', once: true, text: 'The rim goes up sheer from the hills\' foot, higher than any crag of the Fells. Nothing has come down it.' },
    { kind: 'event', x: 3, y: 30, id: 'p5_seep', once: true, text: 'Water seeps out at the hills\' foot, warm as blood, and steams in the cold. The stones round it are rust-red.' },
    // The secret: a fan of spoil under a bare face of the rim with no pit above it, and the trial behind the face.
    { kind: 'event', x: 10, y: 16, id: 'p5_fan', once: true, text: 'A fan of spoil down the hill from a bare face of the rim. There is no pit above it to have thrown it.' },
    { kind: 'event', x: 12, y: 16, id: 'p5_trial', once: true, text: 'Dry stone laid across a trial\'s mouth, and behind it a cut that went into the rim and found nothing.' },
    { kind: 'chest', x: 14, y: 16, id: 'p5_cache_chest', gold: 230, items: ['elixir', 'potion_sp_great'] },
  ],
  secrets: [{ x: 11, y: 16, hint: 'p5_fan' }],
  encounters: [
    // Three fire beetles on the spoil fans under the north pit, the nearest and the gentlest, at 16; and in
    // the deepest pit a slag elder and a slagling come over from the tear in O5, the hardest, at 17, until
    // the tear is closed.
    { id: 'p5_beetles', x: 2, y: 12, monsters: ['fire_beetle', 'fire_beetle', 'fire_beetle'], aware: 3, respawn: 1440 },
    { id: 'p5_slag', x: 5, y: 26, monsters: ['slag_elder', 'slagling'], aware: 3, respawn: 2880, roams: false, until: { flag: 'q_anvil_closed' } },
  ],
};
