// Ashfall's chapter of the one quest, in the journal's words: The Window (a working title), the second
// of Act IV. Down the Giants' Stair onto black sand, or ashore at Cinderport from Kilnhaven; the Riders'
// eldest at their fire outside its gate and her door in the sky; the last Stone half-built on its field
// of cinders and its three parts below, in the vents, the iron corridors and Old Cinder's undercroft;
// the camp under the corridors, the old man at its fire and, for a company that looks, the window; the
// parts carried up and set, the Stone lit and the Hearth steadier; and the road west over the Cinder
// Hills onto the grass, where the Wold's chapter (#531) takes it on. content/index.ts joins it with
// the other areas' in road order; how the words are keyed is in src/content/area.ts (`chapter`), and
// tools/tests/quests.ts checks every key. docs/areas/ashfall.md §5 and §9 (#518) are its design.
import type { Chapter, When } from '../../../game/quests.ts';
import { STAIR_TOP } from '../whitespine/maps/highspine_i10.ts';
import { ELDEST_HEARD } from './maps/cindercoast_g10.ts';
import { LIT, SOCKETS } from './maps/ember_stone.ts';
import { ROAD_WEST } from './maps/emberwaste_e10.ts';

/** The sockets' flags, each set as its part goes in: the vents' part, Old Cinder's and the corridors'. */
const [VENTS_SET, CINDER_SET, CORRIDORS_SET] = SOCKETS;

/** A part of the three carried and not yet set: the Stone takes each as it comes (#516). */
const CARRIED: When = [{ item: 'ember_part1' }, { item: 'ember_part2' }, { item: 'ember_part3' }];

export const CHAPTER: Chapter = {
  id: 'window',
  title: 'The Window',
  // Down the Stair from the Whitespine's end, or ashore at Cinderport with the Compact from Kilnhaven.
  start: [{ flag: STAIR_TOP }, { visited: 'cinderport' }],
  // The road west taken once the Stone is lit: `e10_west` sets it on the road over the Cinder Hills,
  // and `d8_east` at Akordu's horse-lines for a company that rides west instead; or, the Stone lit, the
  // Scarp stair's head for one that comes up onto the Wold from the Saltings, where the Wold's chapter
  // starts too (#531). Nothing is a lock: the parts are found in any order and set as they come, and the
  // journal reads true every way west.
  done: [{ flag: ROAD_WEST }, { flag: LIT, seen: 'wold_c8:c8_line' }],
  entries: [
    { id: 'sand', when: { seen: 'cindercoast_h10:h10_foot' },
      text: 'At the foot of the Giants\' Stair, black sand and hanging vines, and a mountain that smokes over everything.' },
    { id: 'eldest', when: { flag: ELDEST_HEARD },
      text: 'Outside Cinderport\'s gate the Riders\' eldest told of a door that opened in the sky, and of what it cost.' },
    { id: 'stone', when: { seen: 'ember_stone:es_heart' },
      text: 'The last Stone stands half-built on a field of cinders, three sockets empty in its heart. What it lacks lies below.' },
    { id: 'vents', when: { seen: 'meridian_camp:mc1_part' },
      text: 'Down Fire Mountain\'s vents, stokers feed a furnace the size of a house with nothing. In its mouth, the first part.' },
    { id: 'cinder', when: { seen: 'old_cinder2:oc2_part' },
      text: 'Under Old Cinder, where its people stand as the ash took them, the second part lay set in the floor by a dark lamp.' },
    { id: 'corridors', when: { seen: 'meridian_camp2:mc2_part' },
      text: 'Below the vents run iron corridors, dead straight and hot enough to blister. At their end lay the third part.' },
    { id: 'camp', when: { flag: 'meridian_map' },
      text: 'Under the corridors, a camp, and at its fire an old man in a Guild coat. You took your time, he said.' },
    // Written only for a company that goes through the door beside the hall and looks (DESIGN §7).
    { id: 'window', when: { seen: 'meridian_camp3:mc3_window' },
      text: 'By the camp, a window. Far down in the night past it a world turns, blue at its edges. The edge of ours is a wall.' },
    { id: 'lit', when: { flag: LIT },
      text: 'We carried the parts up and set them, and the Stone lit. Every door below opened at once.' },
    { id: 'hearth', when: { flag: LIT },
      text: 'That night the Hearth burned steadier than it had in all our lives.' },
    { id: 'west', when: { flag: ROAD_WEST },
      text: 'With the Stone lit we went west over the Cinder Hills, down onto the grass of the steppe.' },
  ],
  goals: [
    { when: { flag: LIT }, at: 'emberwaste_e10', text: 'West along the Riders\' road over the Ember Waste and the Cinder Hills, onto the steppe.' },
    { when: CARRIED, at: 'ember_stone', text: 'Up to the Ember Stone with what we carry, and set it in the Stone\'s heart.' },
    { when: { flag: [VENTS_SET, CORRIDORS_SET] }, at: 'old_cinder', text: 'Into Old Cinder\'s crater and down through the buried town to its undercroft, for the last part.' },
    { when: { flag: VENTS_SET }, at: 'meridian_camp2', text: 'Down Fire Mountain\'s vents again and on into the iron corridors below them, to their end.' },
    { when: { flag: CINDER_SET }, at: 'meridian_camp', text: 'Down Fire Mountain\'s vents into Meridian Camp and the iron corridors below, for what the Stone still lacks.' },
    { when: { seen: 'ember_stone:es_heart' }, at: 'meridian_camp', text: 'For the Stone\'s parts: down Fire Mountain\'s vents into Meridian Camp and the iron corridors below, and under Old Cinder.' },
    { when: { flag: ELDEST_HEARD }, at: 'ember_stone', text: 'South-west over the Ember Waste to the Ember Stone, half-built on its field of cinders, and down inside it.' },
    { when: { visited: 'cinderport' }, at: 'cindercoast_g10', text: 'Out of Cinderport\'s gate onto Cindercoast\'s trading ground, to the Riders\' fires and their eldest.' },
    { when: { seen: 'cindercoast_h10:h10_foot' }, at: 'cindercoast_g10', text: 'West along the black sand of Cindercoast to Cinderport, and the Riders\' fires outside its gate.' },
    { when: { flag: STAIR_TOP }, at: 'cindercoast_h10', text: 'Down the Giants\' Stair, step under step, to its foot on the black sand of Cindercoast.' },
  ],
};
