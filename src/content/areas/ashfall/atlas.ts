// Ashfall's part of the world map: its three zones, the plates of its town and dungeons, and its
// sites. docs/areas/ashfall.md is its brief (#509). Meridian Camp is #22's, down the vents.
import type { AtlasZone, AtlasPlace, AtlasSite } from '../../../game/atlas.ts';

export const ZONES: readonly AtlasZone[] = [
  {
    id: 'cindercoast', name: 'Cindercoast', area: 'ashfall', band: [24, 25], maps: [{ map: 'cindercoast_h10', at: [232, 286] }, { map: 'cindercoast_g10', at: [200, 286] }, { map: 'cindercoast_f9', at: [168, 254] }, { map: 'cindercoast_g9', at: [200, 254] }, { map: 'cindercoast_h9', at: [232, 254] }], seeds: [[200, 284], [236, 286]], label: [238, 292],
    // The crossing line said coming onto the shore (#166, #511): how the far side feels to a company under its floor,
    // in words as true coming down off the mountain (G11, #513) as down the Stair.
    crossing: { harder: 'The far side, and it is harder than the range over the Sheer.', warning: 'The far side, and nothing on it would spare you. The way back is still open.' },
  },
  { id: 'firemount', name: 'Fire Mountain', area: 'ashfall', band: [25, 26], maps: [{ map: 'firemount_g11', at: [200, 318] }], seeds: [[214, 330], [240, 340]] },
  {
    id: 'emberwaste', name: 'The Ember Waste', area: 'ashfall', band: [25, 26], maps: [{ map: 'emberwaste_f10', at: [168, 286] }, { map: 'emberwaste_e10', at: [136, 286] }, { map: 'emberwaste_f11', at: [168, 318] }, { map: 'emberwaste_e11', at: [136, 318] }], seeds: [[172, 336], [180, 300]],
    // The crossing line said coming off the coast onto the ash (#166, #517).
    crossing: { harder: 'Nothing grows out here, and what lives on the ash is harder.', warning: 'Nothing on the ash would spare you. The coast is behind you still.' },
  },
];

export const PLACES: readonly AtlasPlace[] = [
  { id: 'cinderport', kind: 'town', at: [206, 288] }, // the far side's port, behind G10's gate at 6,2 (#511, #512)
  { id: 'old_cinder', kind: 'dungeon', at: [190, 324] }, // Old Cinder, the buried town: down off F11's crater lip at 19,4 (#514, #515)
  { id: 'old_cinder2', kind: 'dungeon', at: [190, 330] }, // the undercroft, down the hall's stair
  { id: 'ember_stone', kind: 'dungeon', at: [176, 348] }, // the Ember Stone: down inside the Stone on F11's field of cinders at 8,24 (#514, #516)
  { id: 'meridian_camp', kind: 'dungeon', band: [25, 28], at: [226, 340] }, // Meridian Camp: the vents, down the middle of G11's three mouths at 26,16 (#22); three levels in all, the band their union (#443, call 4)
  { id: 'meridian_camp2', kind: 'dungeon', at: [226, 346] }, // the iron corridors, down the vents' stair at 4,30 (#22), the second plate six squares south
  { id: 'meridian_camp3', kind: 'dungeon', at: [226, 352] }, // the camp, down the corridors' stair at 4,30 (#22), the third plate six squares south of the second
];

export const SITES: readonly AtlasSite[] = [
  // X. Ashfall (docs/areas/ashfall.md §10: the coast's English, kept, and two new names).
  { name: 'Cinderport', icon: 'port', at: [206, 277], label: 'right' }, // on G9's shore over G10's gate at 6,2 (#511, #512)
  { name: 'Fire Mountain', icon: 'volcano', at: [215, 326], label: 'none' }, // the cone's mouth on G11, 15,8 (#513)
  { name: 'Old Cinder', icon: 'ruin', at: [190, 318], label: 'below' }, // the crater's rim on F11, 22,0; the way down at its west lip, 19,4 (#514, #515)
  { name: 'Ember Stone', icon: 'stone', at: [176, 342], label: 'below' }, // the Stone on F11, 8,24, the way down inside it (#514, #516)
  { name: 'Scaldwell', icon: 'springs', at: [240, 300], label: 'below' }, // the Hot Springs: H10's pools at 8,14 (#510)
  { name: 'Meridian Camp', icon: 'cave', at: [226, 334], label: 'below' }, // the vents' mouth on G11, 26,16, the way down (#22): the Lost Expedition's last camp lies below
  { name: 'Grimsforge', icon: 'forge', at: [230, 330], label: 'right' }, // Warlord's Forge, by the vents' mouth on G11, 30,12 (#513): the Barbarian's third prestige
];
