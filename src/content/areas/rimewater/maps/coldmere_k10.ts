// Rimewater, box K10: the high pass. Core, band 20-22: the road in from L9 over the river out of the
// lake on split logs, and west through the pines under the cold loch's foot to the pass's mouth, where
// it climbs into the range between two walls of rock and over for the Whitespine's J11 (#499);
// the lake in the box's east, its shore iced; a Lantern's wayside lamp by the road, dark, its jar full;
// the milestone at the pass's foot; the pilgrims from Anvilhall camped in the snow below the mouth; and
// the pass's first shoulder, from which the first peak of the range is seen.
// In from L9 (#488) by the road across L10's corner, walked (#497): the road's last square at the east
// edge, 31,3, meets L10's at 0,3 (until L10 was laid, L9's pass was taken onto the bridge at 30,3 and
// 31,3 led back). Out over the pass, taken, not walked, parked J10 lying between: the road's square at
// the west edge, 0,19, is taken onto J11's road (SADDLE). The north edge meets K9 (#489) square for
// square, walked anywhere; the west and south edges end the world against J10 and parked K11.
// Cut from the atlas by tools/scaffold.ts; docs/areas/rimewater.md §4.7 is its brief.
import type { Exit, MapDef } from '../../../../game/map.ts';
import type { When } from '../../../../game/quests.ts';
import { SOUTH, WEST } from '../../../../game/types.ts';

/** The pilgrims gone from below the pass, up with the brother or back to the lodge (#56's 44, #494). */
const GONE: When = [{ flag: 'q_pilgrims_up' }, { flag: 'q_pilgrims_back' }];

/**
 * Over the pass into the Whitespine (#499): from the road's square at the west edge, 0,19, across
 * parked J10's corner onto J11's 20,1, facing south, the road's square there below its own way back.
 * The label leaves the vale's name to the crossing line said after it (#166, #616).
 */
export const SADDLE: Exit = { x: 0, y: 19, to: 'monksvale_j11', tx: 20, ty: 1, tf: SOUTH, label: 'Over the saddle of the pass and down the far side.' };

export const COLDMERE_K10: MapDef = {
  id: 'coldmere_k10',
  name: 'Loch Fuar',
  kind: 'outdoor',
  density: 'core',
  band: [20, 22],
  region: 'rimewater',
  start: { x: 30, y: 3, facing: WEST },
  exits: [SADDLE],
  rows: [
    'ppppppppppppp^,,,,,,,iiiiiiii~pp',
    'pp^^^pppppppp^,,,,,ppppiiiiii~~p',
    'pp^^^^ppppppppppppppppppppiii~~p',
    'ppp^^pppppppppppppppppppppppp===',
    'ppppppppppppppppppppppppppppp=~p',
    'pppppppppppppppppppppppppp====~p',
    'pppppppppppppppppppppppp===ppp~p',
    'ppppppppppppppppppppp====ppppp~~',
    'p^^^^ppppppppppppp====pppppp~~~~',
    '^^^^^^pppppppppp===ppppppppiiiWW',
    '^^***^^pppppp====pppppppppiiWWWW',
    '^^***^^pppp===prSrppppppppiiWWWW',
    '^^^^^^ppp===pppr:rpppppppiiWWWWW',
    'MMMM^^^===ppppprrrpppppppiiWWWWW',
    'MMMM^^==pppppppppppppppppiiWWWWW',
    'MMM^===ppppppppppppppppiiiWWWWWW',
    'MM^==pp****pppppppppppppiiWWWWWW',
    'M^==pp******ppppppppppppiiWWWWWW',
    '^==ppp******ppppppppppppiiWWWWWW',
    '==MMMMM^***pppppppppppppiiWWWWWW',
    'MMMMMMM^**ppppppppppppppiiWWWWWW',
    'MMMMMM^^ppppppppppppppppiiWWWWWW',
    'MMMM^^^pppppppppppppppppiiWWWWWW',
    '^^^^ppppppppppppppppppppiiWWWWWW',
    '^^ppppppppppppppppppppppiiWWWWWW',
    'ppppppppppppppppppppppppiiWWWWWW',
    'ppppppppppppppppppppppppiiWWWWWW',
    'pppppppppppppppppppppppppiiWWWWW',
    'pppppppppppppppppppppppppiiWWWWW',
    'ppppppppppppppppppppppppppiiWWWW',
    'ppppppppppppppppppppppppppiiWWWW',
    'pppppppppppppppppppppppppppiiWWW',
  ],
  features: [
    // In from L9 by its pass: the bridge over the river out of the lake, and the cold loch's foot north
    // of it, its ice running out into the pines.
    { kind: 'event', x: 29, y: 3, id: 'k10_in', once: true, text: 'The road crosses the river out of the lake on split logs, and climbs west through the pines to the range.' },
    { kind: 'event', x: 24, y: 1, id: 'k10_foot', once: true, text: 'The cold loch\'s ice runs out into the pines in a tongue, and the river from the lake goes in under it.' },
    { kind: 'event', x: 16, y: 1, id: 'k10_clearing', once: true, text: 'A clearing under the snow, scraped to the grass in patches. The deer that scraped it have all gone north.' },
    { kind: 'cairn', x: 3, y: 2, id: 'k10_cairn', text: 'A cairn on a knoll in the pines, raised by many hands, every stone of it white with frost.', gold: 300, items: ['potion_sp_great'] },
    { kind: 'camp', x: 9, y: 5, name: 'A trappers\' camp', text: 'A lean-to of pine boughs, a fire-ring, and lynx skins stretched on frames, stiff with frost.' },
    // The road west under the pines: the new graves by it, and the Lantern's wayside lamp, dark, its jar
    // full. Under its jar-shelf, the Lanterns' cache with the lamp's silver.
    { kind: 'event', x: 13, y: 8, id: 'k10_graves', once: true, text: 'Three mounds of stones by the road, new, and on each a stick with a strip of red cloth tied to it.' },
    { kind: 'event', x: 16, y: 10, id: 'k10_lamp', once: true, text: 'A Lantern\'s wayside lamp, dark. Its jar is full to the stopper. Nobody ran out of oil here.' },
    { kind: 'event', x: 16, y: 12, id: 'k10_cache', once: true, text: 'Under the jar-shelf, a Lantern\'s cache: the lamp\'s silver, a staff, and a tally on slate. Many up the pass; fewer down.' },
    { kind: 'chest', x: 16, y: 12, id: 'k10_silver', gold: 900, items: ['guides_staff+1'] },
    // The pass's foot: the milestone, the mouth and the step (§5), the pilgrims camped in the snow below
    // it (#494's 44 is theirs), and up on the first shoulder the first peak of the range.
    { kind: 'event', x: 9, y: 13, id: 'k10_milestone', once: true, text: 'A milestone at the foot of the pass: RIME LODGE 9, MONKS\' VALE 6.' },
    { kind: 'event', x: 5, y: 15, id: 'k10_mouth', once: true, text: 'The road climbs into the range between two walls of rock, and the snow on it is trodden. South.' },
    // The Pilgrims in the Pass (#56's 44, #494): met, a brother comes down the pass to them, the
    // Whitespine's Brother (MONSTERS §8.1), a person here and no fight. They go up with him
    // (`q_pilgrims_up`, which #445's monastery reads) or back to the lodge (`q_pilgrims_back`).
    { kind: 'event', x: 9, y: 18, id: 'k10_pilgrims', once: true, until: GONE, text: 'Pilgrims from Anvilhall, camped in the snow below the pass, a dozen under one sheet of sailcloth. One of them is dying.' },
    { kind: 'event', x: 9, y: 18, id: 'k10_camp', once: true, after: GONE, text: 'Trodden snow below the pass round a fire-ring gone cold, and the tracks going away from it.' },
    { kind: 'npc', x: 8, y: 17, name: 'A pilgrim', flag: 'q_pilgrims', until: GONE, lines: [
      'An old woman of Anvilhall at the edge of the sailcloth, her boots bound in sacking.',
      '"We are for the bells in Monks\' Vale. The snow shut the pass on us six days since."',
      '"The boy is the worst. We have nothing left to burn."',
    ], says: [
      { after: { flag: 'q_pilgrims' }, lines: [
        'She looks from the boy to the brother kneeling over him.',
        '"The brother says the monks will take us in, the boy and all. Or there is the lodge, back down the road."',
      ], choice: { ask: '"Up with him, or back down?"', answers: [
        { label: 'Up with the brother.', sets: 'q_pilgrims_up', pay: { xp: 2100 }, says: [
          'The brother lifts the boy as if he weighed nothing and walks up the road into the pass.',
          'The pilgrims take up their bundles and follow him, singing.',
        ] },
        { label: 'Back to the lodge.', sets: 'q_pilgrims_back', pay: { xp: 2100 }, says: [
          'The old woman wraps the boy again, and they carry him down the road between them.',
          'The brother stands in the snow and watches them go. Then he goes back up alone.',
        ] },
      ] } },
    ] },
    { kind: 'npc', x: 10, y: 18, name: 'A dying pilgrim', until: GONE, lines: [
      'A boy under every blanket the pilgrims have, grey in the face, his breath rattling.',
      '"Are we there? Is that the bells?"',
    ] },
    { kind: 'npc', x: 10, y: 17, name: 'A brother', after: { flag: 'q_pilgrims' }, until: GONE, lines: [
      'A brother in a grey robe, come down the pass in the snow with no cloak, kneeling by the boy.',
      'He has the blankets off him and is rubbing snow into his chest. "He burns. He must be cooled."',
      'The back of his hand is split to the white on the ice, and it does not bleed.',
    ] },
    { kind: 'event', x: 3, y: 10, id: 'k10_shoulder', once: true, text: 'From the pass\'s first shoulder, the first peak of the range: white to its top, and snow smoking off its edge.' },
    // The lake's shore, iced, and the pines south of the road: a fishing hole, a shrine and a bear's lie.
    { kind: 'event', x: 24, y: 16, id: 'k10_hole', once: true, text: 'A hole cut in the shore ice and frozen over again, a line still in it. Nobody came back for the line.' },
    { kind: 'shrine', x: 17, y: 22, id: 'k10_shrine', text: 'A shrine in the pines: a stone with a lamp cut in it, and a pilgrim\'s prayer-string hung over it.', stat: 'accuracy', done: 'The shrine with the lamp cut in it, its prayer-string stirring.' },
    { kind: 'event', x: 22, y: 29, id: 'k10_shore', once: true, text: 'From the south shore the lake lies white to the far pines, but for a lane of black water down its middle.' },
    { kind: 'event', x: 10, y: 29, id: 'k10_lie', once: true, text: 'A pine down in the snow, its roots in the air, and under them a hollow scraped out and lined with moss.' },
  ],
  secrets: [{ x: 16, y: 11, hint: 'k10_lamp' }],
  encounters: [
    // Snow lynxes in the pines by the bridge, by the lamp and south of the pass's foot; ice pike under
    // the lake's shore ice, by the river's mouth and down the shore; and the ice bears in pairs, the
    // box's hardest, on the pass's shoulder, under its south wall and in the south pines.
    { id: 'k10_lynx_bridge', x: 25, y: 4, monsters: ['snow_lynx', 'snow_lynx', 'snow_lynx', 'snow_lynx'], aware: 4, respawn: 1440 },
    { id: 'k10_pike_head', x: 26, y: 10, monsters: ['ice_pike', 'ice_pike', 'ice_pike', 'ice_pike'], aware: 3, respawn: 1440, under: 'ice' },
    { id: 'k10_lynx_lamp', x: 20, y: 13, monsters: ['snow_lynx', 'snow_lynx', 'snow_lynx', 'snow_lynx'], aware: 4, respawn: 1440 },
    { id: 'k10_pike_shore', x: 24, y: 22, monsters: ['ice_pike', 'ice_pike', 'ice_pike', 'ice_pike'], aware: 3, respawn: 1440, under: 'ice' },
    { id: 'k10_lynx_south', x: 10, y: 24, monsters: ['snow_lynx', 'snow_lynx', 'snow_lynx', 'snow_lynx'], aware: 4, respawn: 1440 },
    { id: 'k10_bears_shoulder', x: 5, y: 10, monsters: ['ice_bear', 'ice_bear'], aware: 3, respawn: 2880 },
    { id: 'k10_bears_south', x: 16, y: 27, monsters: ['ice_bear', 'ice_bear'], aware: 3, respawn: 2880 },
    { id: 'k10_bears_wall', x: 3, y: 26, monsters: ['ice_bear', 'ice_bear'], aware: 3, respawn: 2880 },
  ],
};
