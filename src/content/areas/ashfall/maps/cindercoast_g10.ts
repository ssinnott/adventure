// Ashfall, box G10: Cinderport's box. Core, band 24-25: the town's wall along the north edge with its
// gate at 6,2, and outside it the trading ground on the grass, where the Riders come down to trade:
// their horse-lines and fires, their shrine and their eldest; the chandler's racks under the wall; the
// road from the gate's front up the wall's west side to the harbour and out south-west through the vines
// for Old Cinder and the Wold; the stream down to the harbour, forded on stones by the ground and on the ash; the knoll over it, and the
// vines thick along the shore east of the town, with the factor's hide in them; under the west vines the
// hermit and the potter's clay pit; and south of the ground the ash, to Fire Mountain's foot.
// No box beside it is built: its way in is Cinderport's gate (GATE), the town's way out landing on the
// gate's front, 6,3, and the Compact's ship and the Rider's ride come in through the town (#547). The
// east, south and west edges end the world against H10, G11 and F10, and the north edge, beside the
// wall, against G9's shore.
// Cut from the atlas by tools/scaffold.ts; docs/areas/ashfall.md §4.3 is its brief.
import type { Exit, MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

/**
 * The way into Cinderport (#512): a door in the town's south wall at 6,2, onto the town's first square
 * inside its own gate, 8,14, facing north, saying the town's gate line as the company goes in; the
 * town's way back out lands on 6,3, facing south, the gate's front and this box's way in.
 */
export const GATE: Exit = { x: 6, y: 2, to: 'cinderport', tx: 8, ty: 14, tf: NORTH,
  label: 'Cinderport: black stone limed pale, ash along every wall, and the sea behind it.' };

export const CINDERCOAST_G10: MapDef = {
  id: 'cindercoast_g10',
  name: 'Cindercoast',
  kind: 'outdoor',
  density: 'core',
  band: [24, 25],
  region: 'ashfall',
  start: { x: GATE.x, y: GATE.y + 1, facing: SOUTH },
  rows: [
    '&&&=BBBBBBBBBB~~~,,,,^^,,,,,&&&&',
    '&&&=BBBBBBBBBB,,~~,,^^^&,,&TTTT&',
    '&&&=BBDBBBBBBB,,,~~,^^^&&&&S&&T&',
    '&&=====,,,,,,,,,,,""^^^&&&&TTTT&',
    '&&=&,,,,,,,,,,,,,,,~~^^&&&&&&&&&',
    '&&=&&,,,,,,,,,,,,,,~~~^^&&&&&&&&',
    '&==&&&&&&&&,aaaaaaaa~~~a&&&&T&&&',
    '==&&&&&&&&&aaaaaaaaaa~~a&&&&&&&&',
    '=&&T&&&&&&&&aaaaaaaaaa~~a&&&&&T&',
    '&&&&&&&&&&&&aaaaaaaaaaa~~&&&&&&&',
    '&&&&&&&&T&&&aaaaaaaaaaaa~~&T&&&&',
    '&&&&&&&&&&&&aaaaaaaaaaaa~~a&&&&&',
    '&&&&&T&&&&&aaaaaaaaaaaaaa~~a&&T&',
    '&&&&&&&&&&&aaaaaaaaaaaaaa~~aa&&&',
    'aa&&&&&&aaaaaaaaaaaaaaaaaa"aaaaa',
    'aaaaaaaaaaaaaaaaaaaaaaaaaa~~aaaa',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaa~aaaa',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaa~~aaa',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaa~~aa',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaa~~a',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaa~~a',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa~a',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa~~',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa~',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
    'aaaaaaaaMMMMMMMaaaaaaaaaaaaaaaaa',
    'aaaaaaaMMMMMMMMMMMMaaaaaaaaaaaaa',
    'aaaaaaMMMMMMMMMMMMMMMaaaaaaaaaaa',
  ],
  exits: [GATE],
  features: [
    // The milestone where the road leaves the ground. The gate's own words are its label, said going in (GATE).
    { kind: 'event', x: 3, y: 4, id: 'g10_milestone', once: true, text: 'A milestone where the road leaves the ground: OLD CINDER 4, THE WOLD 6. Ash lies in the letters.' },
    // The trading ground: the Riders' horses and fires, their shrine, and their eldest, the step (§5).
    { kind: 'event', x: 8, y: 4, id: 'g10_ground', once: true, text: 'Horses on the grass outside the gate, and fires. The Riders come down to trade, the gate-ward says, and their eldest talks.' },
    { kind: 'shrine', x: 10, y: 3, id: 'g10_shrine', text: 'A shrine of the Riders\' on the ground: a horse\'s skull on a post, its brow painted red.', stat: 'speed', done: 'The Riders\' shrine, the red on the skull worn to the bone.' },
    { kind: 'npc', x: 11, y: 5, name: 'The eldest', lines: [
      'The Riders\' eldest sits by the fire in a horse-blanket, her braid white to the waist.',
      '"A door opened in the sky. Something went up to it on a pillar of fire, and fell."',
      '"Where it fell the land burned to glass. Remember what that cost, if anyone ever offers to open it for you."',
    ] },
    { kind: 'camp', x: 13, y: 4, name: 'The Riders\' fires', text: 'A fire of dung and driftwood by the horse-lines. The Riders shift along to make room.' },
    { kind: 'event', x: 16, y: 5, id: 'g10_horses', once: true, text: 'Horses on a line between stakes, short and shaggy, ash in their manes. Not one of them is shod.' },
    // Under the town's east wall, the chandler's racks.
    { kind: 'event', x: 14, y: 1, id: 'g10_racks', once: true, text: 'Racks under the wall, hung with candles drying in pairs by their wicks. The chandler counts them twice.' },
    // Over the stream on its stones, the knoll: the harbour over the wall, and the causeway on the sea.
    { kind: 'event', x: 21, y: 2, id: 'g10_knoll', once: true, text: 'From the knoll, masts over the wall, and east on the sea a line of stones running out to Sheer Point.' },
    // In the vines east of the gate, the factor's hide: cut back at its mouth, behind the trees.
    { kind: 'event', x: 26, y: 2, id: 'g10_cut', once: true, text: 'The vines here are cut back to the stem, and the cut ends are fresh.' },
    { kind: 'event', x: 28, y: 2, id: 'g10_crates', once: true, text: 'Crates under the Helmstow customs seal, stacked for a boat. In the straw, shards of every colour.' },
    { kind: 'chest', x: 29, y: 2, id: 'g10_hide', gold: 600, items: ['longsword+2'] },
    // The stream, warm on the ash between the vines, and past its ford the steam to the east.
    { kind: 'event', x: 24, y: 13, id: 'g10_stream', once: true, text: 'The stream runs warm here, and nothing grows along its banks.' },
    { kind: 'event', x: 30, y: 18, id: 'g10_steam', once: true, text: 'Steam stands over the ash to the east, where something hot comes up out of the ground.' },
    // Under the west vines, the hermit who came down off the mountain, and the potter's clay pit.
    { kind: 'npc', x: 4, y: 10, name: 'A hermit', lines: [
      'A hermit under the vines, in a hut of woven stems. His feet are black with ash to the ankle.',
      '"I came down off the mountain. So did the first who built here, they say."',
      '"Up there the ground is warm all the year round. That is no kindness."',
    ] },
    { kind: 'event', x: 9, y: 12, id: 'g10_clay', once: true, text: 'A clay pit under the vines, the potter\'s, its sides cut in steps. Grey water stands in the bottom.' },
    // Where the ash begins, the cairn; out on it, the Riders' fire-ring and their tracks west, a drake
    // over the ash by day, a stone the mountain threw and the ash warming toward the mountain's foot.
    { kind: 'cairn', x: 13, y: 7, id: 'g10_cairn', text: 'A cairn where the grass gives out and the ash begins. Every stone in it is black.', gold: 300, items: ['potion_sp_great'] },
    { kind: 'event', x: 8, y: 18, id: 'g10_ring', once: true, text: 'A ring of blackened stones on the ash, where the Riders camp on the way down. The fire in it is cold.' },
    { kind: 'event', x: 3, y: 22, id: 'g10_tracks', once: true, text: 'Hoofprints in the ash, a great many, all going west. The wind has not had them yet.' },
    { kind: 'event', x: 18, y: 17, id: 'g10_overhead', once: true, when: { hours: 'day' }, text: 'High over the ash a drake turns, slow, and goes back up the mountain.' },
    { kind: 'event', x: 28, y: 25, id: 'g10_boulder', once: true, text: 'A boulder the size of a cart, black and pitted, sunk to its middle in the ash. The mountain threw it.' },
    { kind: 'event', x: 14, y: 26, id: 'g10_warm', once: true, text: 'The ash is warm here, and warmer toward the mountain. Here and there it smokes.' },
  ],
  secrets: [{ x: 27, y: 2, hint: 'g10_cut' }],
  encounters: [
    // Cinder beetles on the ash south of the ground, the box's gentlest, nearest the gate; strangler
    // vines in the shore's trees east of it, which never roam; and at the far end, where the ash warms
    // toward the mountain, ember salamanders and a cinder drake with them, the box's group at 25.
    { id: 'g10_beetles', x: 15, y: 9, monsters: ['cinder_beetle', 'cinder_beetle', 'cinder_beetle', 'cinder_beetle'], aware: 3, respawn: 1440 },
    { id: 'g10_vines', x: 26, y: 8, monsters: ['strangler_vine', 'strangler_vine', 'strangler_vine', 'strangler_vine'], aware: 2, respawn: 1440, roams: false },
    { id: 'g10_salamanders', x: 21, y: 24, monsters: ['ember_salamander', 'ember_salamander', 'ember_salamander', 'ember_salamander'], aware: 4, respawn: 1440 },
    { id: 'g10_drake', x: 26, y: 27, monsters: ['cinder_drake'], aware: 5, respawn: 2880 },
  ],
};
