// The Glasswold, box D10: the mesas. Core, band 26-27: the Wold's way in, the road over the east edge from
// E10 along the great mesa's south foot and north up its west side to the north edge, into the steppe
// (D9). The basilisks' country: the great mesa in the north-east, where the Eyrie stood, its top empty
// but for a cold fire-ring, and the small mesa on the west edge, the hills under them, the glassed
// figures round each all facing one way, and the dunes' edge in the north-west with the Glass's glare
// beyond. The mesa fight in the scree under the great mesa's north face, a basilisk behind a pride;
// two prides in the grass by the way in, glass scorpions at the dunes' edge and a basilisk alone under
// the small mesa. The way up is a notch over the scree, and every figure round the mesa faces it.
// Joins E10 to D9 (#527). Cut from the atlas by tools/scaffold.ts; docs/areas/glasswold.md §4.5 is its brief.
// In the small mesa's rock, behind a door in its east face that the arrows in the foot of it point at, an old
// Rider hides who drilled the Riders: the Wold's Master of arms (#858, docs/areas/glasswold.md §6).
import type { MapDef } from '../../../../game/map.ts';
import { WEST } from '../../../../game/types.ts';
import { RESPAWN } from '../../../../game/keys.ts';

/**
 * The Master of arms (#858), found and never told: Mergen has met the company (`MASTER_MET`), and his bow
 * brought from the herders' store on E9 (`drill_bow`), he takes it and sets `MASTER_FAVOUR`, which his
 * teaching waits on.
 */
export const MASTER_MET = 'master_arms_met', MASTER_FAVOUR = 'master_arms_favour';

export const WOLD_D10: MapDef<'wold_d10'> = {
  id: 'wold_d10',
  name: 'The Wold',
  kind: 'outdoor',
  density: 'core',
  band: [26, 27],
  region: 'glasswold',
  start: { x: 31, y: 6, facing: WEST },
  rows: [
    'uuuuu^^sssssssssssssss==^^^rrrrr',
    'uuuu^^^^^sssssssssssss==rrSrrrrr',
    'uuuu^^^^^^ssssssssssss==rssssssr',
    'uuuu^^^^^^ssssssssssss==rssssssr',
    'uuu^^^^^^sssssssssssss==rssssssr',
    'uu^^^^^^ssssssssssssss==rrrrrrrr',
    'us^^^^^^ssssssssssssss==========',
    'sss^^^^^^sssssssssssssss^^^^^^^^',
    'ssss^^^^ssssssssssssssssss^^^^ss',
    'ss^^^^^sssssssssssssssssssssssss',
    'ss^^^sssssssssssssssssssssssssss',
    'sss^ssssssssssssssssssssssssssss',
    'ssssssssssssssssssssssssssssssss',
    'ssssssssssssssssssssssssssssssss',
    'ssssssssssssssssssssssssssssssss',
    'rrssssssssssssssssssssssssssssss',
    'rrr^ssssssssssssssssssssssssssss',
    'rrr^ssssssssssssssssssssssssssss',
    'rrrr^sssssssssssssssssssssssssss',
    'rrrr^sssssssssssssssssssssssssss',
    'r::S^sssssssssssssssssssssssssss',
    'rrrr^sssssssssssssssssssssssssss',
    'rrr^ssssssssssssssssssssssssssss',
    'sssssssssssssssss^^sssssssssssss',
    'sssssssssssssssss^^sssssssssssss',
    'sssssssssssssssss^^sssssssssssss',
    'sssssssssssssssss^^sssssssssssss',
    'sssssssss^^^ssssssssssssssssssss',
    'ssssssss^^^^^^^^^^^^ssssssssssss',
    'ssssss^^^^^^^^^^^^^^^^^sssssssss',
    'sssss^^^^^^^^^^^^^^^^^^^ssssssss',
    '^s^^^^^^^^^^^^^^^^^^^^^^ssssssss',
  ],
  features: [
    // The way in over the east edge: the great mesa over the road, the things round its foot.
    { kind: 'event', x: 29, y: 7, id: 'd10_mesa_seen', once: true, text: 'The mesa stands over the road, sheer and flat-topped. Round its foot things stand in the grass, very still.' },
    // The glassed round the great mesa, in a line out from the scree under its north face, each facing it:
    // the last, nearest, a Rider with his bow still drawn.
    { kind: 'event', x: 15, y: 10, id: 'd10_glassed', once: true, text: 'A man of green glass stands in the grass, his head tipped back, looking up and away to the north-east.' },
    { kind: 'event', x: 17, y: 8, id: 'd10_glassed_woman', once: true, text: 'A woman in glass, a hand raised against the sun, her face turned up to the north-east.' },
    { kind: 'event', x: 19, y: 6, id: 'd10_glassed_horse', once: true, text: 'A horse of glass, rearing, the saddle empty. Its head is thrown back toward the north-east.' },
    { kind: 'event', x: 21, y: 4, id: 'd10_glassed_rider', once: true, text: 'A Rider of glass, his bow still drawn, the arrow aimed up at the mesa\'s face above the scree.' },
    // On the top, through the notch: the nest among the glassed bones, the hoard they carried, the Eyrie's
    // cold fire-ring (132,289) and the view west over the Glass.
    { kind: 'event', x: 26, y: 2, id: 'd10_nest', once: true, text: 'Glass bones under the lip, men and horses and lions, every head up. Among them a nest of scraped stone.' },
    { kind: 'chest', x: 25, y: 2, id: 'd10_hoard', gold: 1100, items: ['basalt_shield+2', 'quickening'] },
    { kind: 'event', x: 28, y: 3, id: 'd10_ring', once: true, text: 'A ring of fire-blackened stones, the ash in it cold and long rained on, a tether-peg driven in the rock.' },
    { kind: 'event', x: 25, y: 4, id: 'd10_view', once: true, text: 'From the top the Glass lies whole to the west, white to the sky. Far out in it a dark crown stands up out of the glare.' },
    // The north: the Riders' cairn, and the Rider who watches the mesas from the hill and goes no nearer.
    { kind: 'cairn', x: 12, y: 2, id: 'd10_cairn', text: 'A Riders\' cairn, a horse\'s skull on top of it, its eyes to the ground.', gold: 400, items: ['elixir'] },
    { kind: 'npc', x: 8, y: 7, name: 'A Rider on the hill', lines: [
      'A Rider sits her horse on the hill, a bow across her knees, her eyes on the mesas and never higher.',
      '"I go no nearer. Whoever looks up there stays, and stands in the grass for good."',
      '"Some we carried home. They stand in the garden at Akordu, and their mothers sit with them."',
    ] },
    // The dunes' edge at the west seam, and the Glass's glare beyond (C10).
    { kind: 'event', x: 1, y: 4, id: 'd10_glare', once: true, text: 'Past the dunes the ground goes white and blinding to the sky, and the heat comes up off it like a hand.' },
    // The grass by the way in: the near pride's kill, the vultures on it; the lions' lie in the middle.
    { kind: 'event', x: 28, y: 13, id: 'd10_kill', once: true, text: 'A horse pulled down in the grass and half eaten. The vultures hop off it a little way, and wait.' },
    { kind: 'event', x: 14, y: 16, id: 'd10_lie', once: true, text: 'The grass is pressed flat in a hollow, tawny hairs caught in it, and a smell of cat.' },
    // The glassed round the small mesa on the west edge, all facing it.
    { kind: 'event', x: 6, y: 16, id: 'd10_glassed_boy', once: true, text: 'A boy of glass in the grass, a sling hanging from his hand, his face turned up to the mesa in the west.' },
    { kind: 'event', x: 6, y: 19, id: 'd10_glassed_dogs', once: true, text: 'Two dogs of glass, one with its forefeet off the ground, both looking up at the mesa to the west.' },
    { kind: 'event', x: 6, y: 22, id: 'd10_glassed_crone', once: true, text: 'An old woman of glass leaning on a staff, her chin up, looking west at the mesa.' },
    // The Master of arms (#858), found and never told: in the small mesa's rock behind a door in its east face,
    // where the arrows stand, an old Rider who drilled the Riders. The rumour at Akordu's trader's tent says
    // the kind of place; his words hint at the bow the herders keep for him (E9's store), the favour his teaching
    // waits on (`MASTER_FAVOUR`, the hand-in), and the menu does the rest: Expert at arms, 25 and 5,000 gold.
    { kind: 'event', x: 4, y: 20, id: 'd10_butts', once: true, text: 'Arrows stand in the small mesa\'s foot, hundreds of them, thick about one patch of rock. The oldest are grey, the newest white.' },
    { kind: 'event', x: 2, y: 20, id: 'd10_hollow', once: true, text: 'A hollow in the rock, swept clean and dry. Bundles of fletched arrows lie along one wall, a lifetime\'s worth.' },
    { kind: 'npc', x: 1, y: 20, name: 'Mergen, the drillmaster', flag: MASTER_MET, lines: [
      'An old man sits on a pallet in the hollow, his hands in his lap like two roots. The bow-rack by his head is empty.',
      '"Mergen. I taught the Riders to loose at the gallop, and their fathers before them. The last of them rode into the Glass, and I came up here."',
      '"My bow is with the herders, since my hands went. They keep it where their path ends. Bring it, and I will teach you what I have left."',
    ], quest: { item: 'drill_bow', reward: 0, setFlag: MASTER_FAVOUR, early: [
      'The old man looks at the bow in your hands a long while, and then at you.',
      '"Give it here." His hands close on it as they have not closed in years.',
    ], done: [
      'The old man takes the bow in both hands, and his hands close on it, as they have not closed in years.',
      '"The herders kept it dry. Sit down."',
    ] }, says: [
      { after: { flag: MASTER_FAVOUR }, lines: ['Mergen sits with the bow across his knees, his hands closed on it.', '"Steel answers steel. Who comes to me?"'] },
      { after: { flag: MASTER_MET }, lines: ['Mergen holds out his empty hands.', '"My bow. The herders keep it where their path ends."'] },
    ], mastery: { line: 'arms', tier: 'master', done: { flag: MASTER_FAVOUR }, price: 5000 } },
    // The hills in the south: the Riders' camp out of sight of the mesas, their sky-stone, and the grass's dead.
    { kind: 'camp', x: 10, y: 29, text: 'A Riders\' camp in the lee of the hills, a stone-lined fire-pit, out of sight of the mesas.' },
    { kind: 'shrine', x: 18, y: 24, id: 'd10_shrine', text: 'A stone on the rise worn flat on top, a ring cut in it and a hole through the middle for the sky.', stat: 'luck', done: 'The sky-stone, the dust standing in its ring.' },
    { kind: 'event', x: 2, y: 27, id: 'd10_bones', once: true, text: 'The bones of a horse in the grass, picked clean, its skull lying looking at the sky.' },
    { kind: 'event', x: 27, y: 27, id: 'd10_hare', once: true, text: 'A hare of glass in the grass, sat up on its haunches, its ears up and its eyes on the sky.' },
  ],
  secrets: [{ x: 26, y: 1, hint: 'd10_glassed_rider' }, { x: 3, y: 20, hint: 'd10_butts' }],
  encounters: [
    // From the way in: the near pride at its kill with the vultures down on it, the south pride in the grass,
    // the mesa fight in the scree under the great mesa's north face, the basilisk on the lip behind its pride;
    // the glass scorpions at the dunes' edge, and a basilisk alone in the small mesa's shade, the hardest at 27.
    { id: 'd10_pride', x: 27, y: 11, monsters: ['wold_lion', 'wold_lion', 'wold_lion', 'wold_lion', 'vulture', 'vulture', 'vulture'], aware: 4, respawn: RESPAWN.twoDays },
    { id: 'd10_pride_south', x: 28, y: 17, monsters: ['wold_lion', 'wold_lion', 'wold_lion', 'wold_lion'], aware: 4, respawn: RESPAWN.twoDays },
    { id: 'd10_mesa', x: 24, y: 0, monsters: ['wold_lion', 'wold_lion', 'wold_lion', 'basilisk'], aware: 3, respawn: RESPAWN.twoDays },
    { id: 'd10_scorpions', x: 4, y: 3, monsters: ['glass_scorpion', 'glass_scorpion', 'glass_scorpion', 'glass_scorpion'], aware: 3, respawn: RESPAWN.twoDays },
    { id: 'd10_basilisk', x: 4, y: 19, monsters: ['basilisk'], aware: 3, respawn: RESPAWN.twoDays },
  ],
};
