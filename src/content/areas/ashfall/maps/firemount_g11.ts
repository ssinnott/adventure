// Ashfall, box G11: Fire Mountain's flank. Core, band 25: the cone in the box's north-west, lettered
// volcano over the atlas's mountain with its mouth at 15,8, and the three lava flows off it, two
// leaving west and one south-east; the track down from G10 between the mountain and the east edge,
// with a shrine at its head where the stokers' tracks begin, to Grimsforge at 30,12, the forge of black
// stone with its fire lit and the old warlord's heir at the anvil; a camp in its lee, where the
// vent-scavenger sits; the vents at 26,16, three mouths in the ash where the stokers come and go, the
// way down to Meridian Camp (#22); the scavenger's hole in the rocks beside them, his second way down;
// the furnace-draught breathing in the rock; a lookout on the cone's shoulder over the Waste, a cairn
// on its ash foot in the north-west, the Cinder Hills' line on the west, and a drake on a flow.
// Its way in is G10's south edge: the track at columns 23 to 31, and the cairn's corner at 0 to 4.
// The middle mouth and the hole's far end are the ways down into Meridian Camp's vents (VENTS, HOLE;
// #22). The east, south and west edges end the world against H11, G12 and F11.
// Cut from the atlas by tools/scaffold.ts; docs/areas/ashfall.md §4.5 is its brief.
import type { Exit, MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

/**
 * The way down to Meridian Camp (#22): the middle of the vents' three mouths, 26,16, open ash between
 * the two still breathing, onto the vents' flue hall at 16,1, facing south; the way back up lands on
 * 27,16, facing east, the vents' front.
 */
export const VENTS: Exit = { x: 26, y: 16, to: 'meridian_camp', tx: 16, ty: 1, tf: SOUTH,
  label: 'Down into the middle mouth on rungs hot through the glove, and a drop at the end onto iron.' };

/**
 * The scavenger's way down (#56's 52): the far end of his hole, 31,17, onto the vents behind the stokers'
 * furnace room, at 29,30 facing north (#22); the way back up lands in the hole on 31,16, facing west.
 */
export const HOLE: Exit = { x: 31, y: 17, to: 'meridian_camp', tx: 29, ty: 30, tf: NORTH,
  label: 'Down the scavenger\'s rope, hand under hand, a long way through the slag, and out into heat.' };

/**
 * The Shovel That Does Not Blunt (#56's 52, #519): the scavenger's story, told to a company sent by
 * the smith once it has found his ledge; then he is gone from the fire, to Cinderport.
 */
export const SHOVEL_STORY = 'q_shovel_story';

export const FIREMOUNT_G11: MapDef = {
  id: 'firemount_g11',
  name: 'Fire Mountain',
  kind: 'outdoor',
  density: 'core',
  band: [25, 25],
  region: 'ashfall',
  start: { x: 28, y: 0, facing: SOUTH },
  exits: [VENTS, HOLE],
  rows: [
    'aaaaaMMMMMMMMMMMMMMMMMMaaaaaaaaa',
    'aaaMMMMMMMMMMMMMMMMMMMMMaaaaaaaa',
    'aaMMMMMMMMMMMMMMMMMMMMMMMMaaaaaa',
    'aaMMMMMMMMMMMMMMMMMMMMMMMMMMaaaa',
    'MMMMMMMMMMMMMVVVVVMMMMMMMMMMMaaa',
    'MMMMMMMMMMMVVVVVVVVVMMMMMMMMMMaa',
    'MMMMMMMM!!VVVVVVVVVVVMMMMMMMMMaa',
    'MMMMMM!!!!V!!VVVVVVVVMMMMMMMMMaa',
    'MMMM!!!!MM!!!VV@V!VVVMMMMMMMMMaa',
    'MM!!!!MMM!!!VVVVV!!VVMMMMMMMMMaa',
    '!!!!MMMMM!!!Vaaaaa!!VMMMMMMMMMaa',
    '!MMMMMMM!!!Maaaaaaa!!a@MMMMMaaaa',
    'aMMMMMM!!!aaaaaaaaaaa!aaaaaaaBBB',
    'aaaaMM!!!aaaaaaaaaaaa!!aaaaaaBBB',
    'aaaaaa!!!aaaaaaaaaaaaa!!aaaaaaaa',
    'aaaaa!!!aaaaaaaaaaaaaaa!!a@aarrr',
    'aaaa!!!aaaaaaaaaaaaaaaaa!!aaaSaa',
    'aaaa!!aaaaaaaaaaaaaaaaaaa!@aarra',
    'aaa!!aaaaaaaaaaaaaaaaaaaa!!aaaar',
    'aa!!aaaaaaaaaaaaaaaaaaaaaa!!aaaa',
    'a!!!aaaaaaaaaaaaaaaaaaaaaaa!aaaa',
    '!!!aaaaaaaaaaaaaaaaaaaaaaaa!!aaa',
    '!!aaaaaaaaaaaaaaaaaaaaaaaaaa!aaa',
    '!aaaaaaaaaaaaaaaaaaaaaaaaaaa!!aa',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaa!!aa',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaa!aa',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaa!!a',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!!',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!!',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa!',
    'aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa',
  ],
  features: [
    // The track's head, where the stokers' tracks begin, and the shrine there.
    { kind: 'shrine', x: 27, y: 2, id: 'g11_shrine', text: 'A shrine at the head of the track, black stones piled round a slab. Past it the ash is trodden flat.', stat: 'endurance', done: 'The shrine at the track\'s head, its slab warm under the hand.' },
    // Grimsforge, the old warlord's heir at the anvil (the Barbarian's third is #448's); in its lee a
    // rack and a camp, and the vent-scavenger by the fire.
    { kind: 'event', x: 28, y: 12, id: 'g11_forge', once: true, text: 'Grimsforge: a forge of black stone in the mountain\'s foot, its fire lit. The anvil rings.' },
    { kind: 'chest', x: 29, y: 14, id: 'g11_rack', gold: 0, items: ['warhammer+1'] },
    { kind: 'npc', x: 28, y: 13, name: 'The warlord\'s heir', lines: [
      'A big man at the anvil, grey in the beard. An old axe hangs over the fire, its edge long gone.',
      '"Grimsforge. My grandfather kept it, and fought from it. I keep the fire."',
      '"There was a man went down beside the forge with a rope. He comes up when he likes, with things."',
    ] },
    // The scavenger, a person who moves (#519): asked for the smith once his ledge is found, he tells
    // where the shovel-head came from and goes to Cinderport (SHOVEL_STORY).
    { kind: 'camp', x: 30, y: 14, name: 'The forge\'s lee', text: 'A fire in the lee of the forge, out of the mountain\'s breath, and room by it for one more.' },
    { kind: 'npc', x: 31, y: 14, name: 'A scavenger', until: { flag: SHOVEL_STORY }, lines: [
      'A thin man by the fire, grey dust in the creases of his hands, a sack between his feet.',
      '"I find things. The mountain gives them up, if you know where to dig."',
      '"A smith in Cinderport buys what I bring. He never asks where I go."',
    ], says: [
      { after: { flag: 'q_shovel', seen: 'firemount_g11:g11_finds' }, sets: SHOVEL_STORY, lines: ['The scavenger looks at the grey dust on your boots, and spits in the fire.', '"So you found my ledge. Down there they shovel all day, and when one stops, its shovel is anybody\'s."'] },
    ] },
    // The vents, the middle mouth the way down into Meridian Camp (VENTS): the step's line at their front, each time.
    { kind: 'event', x: 27, y: 16, id: 'g11_vents', text: 'Three mouths of iron in the ash, each as wide as a door, breathing heat. The tracks in the ash go in and come out.' },
    // The scavenger's hole in the rocks beside the vents: the rope at its mouth, his finds on the ledge,
    // and the far end going down into Meridian Camp behind the furnace room (HOLE).
    { kind: 'event', x: 28, y: 16, id: 'g11_rope', once: true, text: 'A rope of vine knotted round a rock and let down between the stones. No vine grows within a day of here.' },
    { kind: 'event', x: 30, y: 16, id: 'g11_finds', once: true, text: 'A ledge in the rock, and on it grey parts sorted into heaps. A cold draught comes up from below.' },
    { kind: 'chest', x: 31, y: 16, id: 'g11_hole', gold: 700, items: ['great_axe+2'] },
    // The furnace-draught, a vent in the rock that breathes and is no way in.
    { kind: 'event', x: 22, y: 12, id: 'g11_draught', once: true, text: 'A vent in the rock breathes out, hot as a furnace door, and draws in again. It is no wider than an arm.' },
    // The cone's shoulder over the Waste, and its ash foot in the north-west with the cairn.
    { kind: 'event', x: 14, y: 10, id: 'g11_lookout', once: true, text: 'From the cone\'s shoulder the Waste runs west, grey, to the sky\'s edge. Far out on it a stone stands alone.' },
    { kind: 'cairn', x: 1, y: 2, id: 'g11_cairn', text: 'A cairn on the mountain\'s ash foot, its lowest stones run together by some old heat.', gold: 300, items: ['potion_sp_great'] },
    // The west: the Hills' line over the Waste, and the flows coming down off the cone in beds of their
    // own, the crust on them bearing a company.
    { kind: 'event', x: 2, y: 15, id: 'g11_hills', once: true, text: 'West the Ember Waste begins, cinders to the sky\'s edge, and beyond it the line of the Cinder Hills.' },
    { kind: 'event', x: 5, y: 8, id: 'g11_bed', once: true, text: 'The flow comes down out of the mountain\'s side here, in a bed it has cut for itself.' },
    { kind: 'event', x: 10, y: 9, id: 'g11_crust', once: true, text: 'The flow has a crust on it black as a stove, and it bears your weight. Through the cracks it glows.' },
    // Out on the ash below the cone: the stokers' heaps and tracks, the mountain's bombs, a drake's
    // leavings, black glass where the west flow set, and the south-east flow going on.
    { kind: 'event', x: 13, y: 20, id: 'g11_heaps', once: true, text: 'Heaps of ash shovelled up neat as graves, a line of them, and nothing buried in any of them.' },
    { kind: 'event', x: 22, y: 20, id: 'g11_tracks', once: true, text: 'Tracks in the ash, flat-footed and deep, going out from the vents and back. Whatever made them is heavy.' },
    { kind: 'event', x: 13, y: 28, id: 'g11_bombs', once: true, text: 'Stones the mountain threw, round as loaves, split open on the ash. They are warm inside.' },
    { kind: 'event', x: 22, y: 28, id: 'g11_bones', once: true, text: 'A bullock\'s bones, burned black and cracked for the marrow. Something here eats well.' },
    { kind: 'event', x: 4, y: 28, id: 'g11_glass', once: true, text: 'Black glass where the flow ran out over the ash and set, sharp enough to cut a boot.' },
    { kind: 'event', x: 28, y: 28, id: 'g11_ember', once: true, text: 'The flow goes on south-east under its crust, slow as treacle, and smokes where it meets the air.' },
  ],
  secrets: [{ x: 29, y: 16, hint: 'g11_rope' }],
  encounters: [
    // Ember salamanders on the slope under the track, the box's gentlest, nearest the way in, and three
    // more on the cone's shoulder; the vents' fight at the mouths, two stokers with ember salamanders,
    // where fire is useless; a cinder drake alone on the south-east flow; and, once the Ember Stone is
    // lit, a sentry come up through the doors below, walking in from the Waste: the box's top, at 26.
    { id: 'g11_salamanders', x: 30, y: 6, monsters: ['ember_salamander', 'ember_salamander', 'ember_salamander', 'ember_salamander'], aware: 3, respawn: 1440 },
    { id: 'g11_slope', x: 16, y: 11, monsters: ['ember_salamander', 'ember_salamander', 'ember_salamander'], aware: 3, respawn: 1440 },
    { id: 'g11_stokers', x: 28, y: 19, monsters: ['stoker', 'ember_salamander', 'stoker', 'ember_salamander'], aware: 3, respawn: 1440 },
    { id: 'g11_drake', x: 28, y: 22, monsters: ['cinder_drake'], aware: 5, respawn: 2880 },
    { id: 'g11_sentry', x: 4, y: 24, monsters: ['sentry'], aware: 4, respawn: 2880, after: { flag: 'q_ember_lit' } },
  ],
};
