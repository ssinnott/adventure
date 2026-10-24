// Ashfall's own rows of the suites (`AreaChecks`, src/content/area.ts): out of the game's build, found by
// tools/checks.ts as the runner finds a walkthrough (#897). Ashfall owes nothing: the Grave Drake, the last
// row, left it once Grim's Howe, its lair, placed it (#836).
import type { AreaChecks } from '../../area.ts';

export const CHECKS = {
  // Its rungs of the ladder (tools/harness.ts): Cinderport's armourer from 25, with the Quickening Draught its chandler sells for the bag (KIT).
  gear: {
    25: ['slag_mace', 'marlinspike', 'ashwood_bow', 'flamberge', 'battle_staff', 'drakeskin', 'cinder_robe', 'basalt_shield', 'quickening'],
  },
  // How far over the next floor its clear leaves a company, held as built (tools/tests/curve.ts).
  overRoad: { level: 27.4, why: 'the Stone, the rungs, the quests and the sentries, and the country behind the road adds to it (#522); accepted as built (#738)' },
  // Its seams as built (tools/tests/outdoors.ts): each whose first box is its own.
  seamsAsBuilt: [
    { seam: 'cindercoast_g10|cindercoast_h10', road: '11', why: 'H10\'s shore track comes out onto G10\'s vines' },
    { seam: 'cindercoast_g10/firemount_g11', walk: '5 21-22', why: 'Fire Mountain\'s foot is wider on G11\'s side, each as the atlas cuts it' },
    { seam: 'firemount_g11|firemount_h11', walk: '12-13 16-17', why: 'Grimsforge\'s wall stands against H11\'s ash, and H11\'s rocks against G11\'s ash, so the hole is shut to H11' },
    { seam: 'emberwaste_e10|emberwaste_f10', walk: '31', why: 'F10\'s rock at its corner meets E10\'s ash' },
    { seam: 'emberwaste_e10/emberwaste_e11', walk: '31', why: 'E11\'s rock at its corner meets E10\'s ash' },
    { seam: 'cindercoast_f9|cindercoast_g9', walk: '19', water: '19', why: 'the shore steps a square at the line' },
    { seam: 'cindercoast_g9/cindercoast_g10', walk: '4', water: '6-12', why: 'G9\'s grass meets Cinderport\'s wall at 4, and the wall stands against the sea wall\'s moles and the harbour' },
    { seam: 'cindercoast_h9|sheerpoint_i9', walk: '6-16', water: '5', why: 'the Sheer stands down H9\'s east against I9\'s shallows, sand and pines, so the Stair stays the only way over by land' },
    { seam: 'cindercoast_h9/cindercoast_h10', walk: '30', why: 'the Sheer is a square wider on H10\'s side' },
    { seam: 'emberwaste_e11|emberwaste_f11', walk: '16-18 21-25', why: 'F11\'s rock, the Waste\'s and the builders\', stands against E11\'s ash either side of the way at 19 and 20' },
  ],
  // Its edges open on nothing (tools/tests/outdoors.ts).
  openOnNothing: [
    { edge: 'emberwaste_e11 south', open: '12-13', why: 'E12 is the world\'s end, the void and a mountain, where #828 plans no box' },
    { edge: 'emberwaste_e11 west', open: '0-10', why: 'D11 is the Glass, the reach, shut until Phase 1.6' },
  ],
} satisfies AreaChecks;
