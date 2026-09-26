// Caldera as the Cartographers' Guild charts it: one land, a ring of country round the inland sea
// inside the rim, with two islands in the sea and the Underdeep beneath. It is drawn in strokes (see
// game/atlas.ts): the rim, the coast, the ranges, the rivers from the rim to the sea, woods, fens and
// fields; the Shelf and Thornmark are their own maps, stamped in 1:1, so the art and the zone
// overlay agree with what is playable. Everything else is planned, and is the design's to change.
//
// Scale: 512 by 384 squares, the border lettered A-P by 1-12 in squares of 32 (one outdoor map's
// worth). About 113,000 squares are land, a sixth of them mountain: nine times the whole outdoors of
// Darkside of Xeen (48 maps of 16 by 16), six times both sides of Xeen together. An area is some 8
// to 15 of today's 32 by 32 outdoor maps.
//
// There is one road of levels, numbered I to XIV, and it winds. The coast road west from the Shelf
// down the Ledge opens only after Thornmark; the east road out of Thornmark only once the Tide
// Stone is back from Wrackholm; the far side of the sea is reached by ship from Kilnhaven after
// the Whitespine, and the Hearth from Cinderport after the Glasswold. Three port cities, Saltmouth,
// Kilnhaven and Cinderport, carry the crossings. Areas are made of zones, the named country inside
// them; their borders follow the ridges, rivers and cliffs between them.
import type { Atlas } from '../game/atlas.ts';

export const ATLAS: Atlas = {
  width: 512,
  height: 384,
  square: 32,
  seed: 1187,
  rim: {
    width: 9,
    rough: 4,
    pts: [
      // North, over the Shelf; the Sunderwood lobe; a notch where the Iron Fells leave the rim.
      [232, 19], [258, 16], [286, 11], [316, 6], [346, 5], [374, 8], [398, 14], [416, 22], [428, 34],
      // The Kilns bulge east; a notch; Cairnmoor.
      [446, 38], [466, 50], [482, 68], [494, 92], [502, 120], [506, 148], [504, 176], [496, 194],
      [502, 214], [500, 240], [492, 264],
      // Rimewater's lobe, a notch, the long southern lobe of the Whitespine.
      [482, 288], [470, 310], [452, 330], [430, 346], [404, 350], [380, 360], [354, 368], [330, 376],
      [304, 380], [278, 380], [254, 376],
      // Ashfall, a notch, the Glasswold's lobe, a notch at the Scarp.
      [228, 372], [200, 368], [174, 360], [150, 350], [132, 338], [110, 330], [86, 318], [62, 300],
      [42, 278], [28, 254], [18, 226], [24, 204],
      // The delta's shore of the rim, the Upper Water's lobe, a notch, the Downs.
      [16, 182], [12, 156], [14, 128], [18, 100], [26, 74], [40, 52], [58, 36], [82, 30], [104, 22],
      [130, 17], [158, 15], [184, 17], [208, 20],
    ],
  },
  seas: [
    {
      rough: 5,
      pts: [
        // Harrow Bay, from the Shelf's beach; its east shore, then round Thorn Head.
        [199, 61], [216, 59.5], [232, 61], [236, 70], [240, 82], [248, 92], [258, 100], [266, 112], [276, 126],
        [286, 140], [294, 150], [302, 146], [304, 132], [308, 118],
        // Sunder Bay under Sunderwood and the Iron Fells' cliffs; Kiln Bight; round the Anvil.
        [322, 114], [340, 116], [356, 120], [368, 126], [378, 136], [386, 148], [390, 160], [384, 168],
        [370, 172], [352, 174], [336, 176], [326, 182], [330, 190], [346, 192], [364, 192], [382, 194],
        [396, 202],
        // Cairnmoor's shore and Rime Bay.
        [402, 218], [396, 234], [384, 246], [372, 254], [356, 260], [340, 264], [322, 262], [308, 256],
        // The Sheer: up its east side, round the point, down its west side.
        [300, 246], [294, 234], [286, 226], [278, 228], [272, 238], [268, 252], [262, 264],
        // The Ember Sound along Ashfall; the Glasswold's cliffs.
        [250, 272], [234, 278], [218, 280], [204, 278], [190, 272], [176, 266], [164, 258], [152, 248],
        [142, 236], [134, 224], [126, 214],
        // The Saltings, the delta's front, the Salt Gulf, the Downs' cliffs back to the bay.
        [116, 204], [108, 196], [102, 186], [106, 176], [98, 164], [100, 150], [106, 138], [116, 124],
        [128, 110], [140, 98], [154, 90], [168, 80], [182, 70], [192, 64],
      ],
    },
  ],
  isles: [
    // Hearth Isle, Wrackholm, Gull Isle in the mouth of Harrow Bay.
    { pts: [[242, 160], [256, 155], [270, 160], [277, 172], [270, 185], [256, 189], [242, 185], [236, 172]] },
    { pts: [[146, 170], [152, 158], [164, 152], [178, 154], [190, 160], [198, 170], [196, 182], [188, 190], [176, 194], [166, 188], [158, 194], [148, 188]] },
    { rough: 1, pts: [[213, 96], [221, 93], [226, 99], [219, 104], [212, 101]] },
    // The Teeth, off the Glasswold; the Drowned Isles off the delta.
    { rough: 1, pts: [[140, 208], [145, 206], [147, 211], [142, 213]] },
    { rough: 1, pts: [[149, 220], [154, 218], [156, 223], [151, 225]] },
    { rough: 1, pts: [[158, 232], [162, 230], [164, 235], [160, 236]] },
    { rough: 1, pts: [[112, 158], [117, 156], [118, 162], [113, 163]] },
    { rough: 1, pts: [[118, 146], [122, 144], [124, 149], [119, 150]] },
  ],
  lakes: [
    // Thornmere, Reedmere, Longmere, Coldmere, Stillmere, a tarn on the moor.
    { pts: [[258, 47], [266, 45], [274, 48], [278, 55], [272, 60], [262, 58], [258, 54]] },
    { pts: [[58, 104], [68, 100], [76, 106], [72, 116], [60, 114]] },
    { pts: [[398, 270], [404, 268], [408, 284], [406, 302], [400, 310], [396, 296], [394, 282]] },
    { pts: [[354, 298], [362, 294], [368, 304], [366, 322], [358, 326], [352, 312]] },
    { pts: [[426, 300], [434, 298], [438, 310], [432, 318], [424, 312]] },
    { pts: [[456, 230], [462, 228], [464, 234], [458, 236]] },
  ],
  ridges: [
    // Between the Shelf and Thornmark, the Warden Pass through it.
    { pts: [[231.5, 20], [231.5, 40], [231.5, 61]], width: 3, foot: 0 },
    // The Hoarhills, between Thornmark and Sunderwood.
    { pts: [[266, 14], [268, 40], [276, 64], [292, 86], [308, 110]], width: 5, foot: 2 },
    // The Ledge: the Downs end in cliffs above the Upper Water and the gulf. A cliff's face is on the
    // right of the way its line runs.
    { pts: [[86, 28], [96, 50], [104, 74], [114, 96], [122, 112]], kind: 'cliff', width: 2 },
    // The Scarp between Saltreach and the Glasswold.
    { pts: [[128, 216], [114, 210], [94, 212], [70, 214], [46, 210], [22, 206]], kind: 'cliff', width: 2.5 },
    // The Sunder.
    { pts: [[334, 8], [338, 30], [332, 52], [340, 74], [336, 96], [342, 116]], kind: 'chasm', width: 2.5, foot: 3, footT: 'deadwood' },
    // The Iron Fells, a spur of the rim between Sunderwood and the Kilns.
    { pts: [[430, 32], [420, 52], [408, 74], [398, 96], [388, 118], [378, 132]], width: 8, foot: 3 },
    // A vent over the lava tubes.
    { pts: [[479, 171], [483, 175], [481, 180], [484, 184]], kind: 'lava', width: 1.4 },
    // The Anvils, inside the Kilns.
    { pts: [[500, 112], [480, 124], [460, 134], [446, 146]], width: 6 },
    // Low hills between the Kilns and Cairnmoor.
    { pts: [[500, 194], [478, 196], [452, 200], [426, 204], [404, 208]], kind: 'hills', width: 5 },
    // The Rimefells between Cairnmoor and Rimewater.
    { pts: [[494, 262], [472, 264], [448, 260], [424, 258], [400, 256]], width: 7, foot: 2 },
    // Ridges between Rimewater's lakes.
    { pts: [[378, 262], [372, 276], [376, 292], [372, 306], [380, 320], [386, 336], [390, 348]], width: 4, foot: 2 },
    { pts: [[420, 268], [414, 282], [416, 298], [412, 312], [420, 326], [430, 342]], width: 5, foot: 2 },
    // The Whitespine: the great spine, its eastern ridge, and the Sheer down its western side.
    { pts: [[300, 378], [304, 356], [298, 334], [300, 310], [292, 288], [286, 266], [282, 244]], width: 22, snow: true, foot: 5 },
    { pts: [[352, 368], [346, 350], [336, 334], [322, 318]], width: 8, snow: true, foot: 3 },
    { pts: [[264, 272], [264, 296], [268, 320], [272, 346], [270, 372]], kind: 'cliff', width: 2 },
    // The Cinder Hills between Ashfall and the Glasswold.
    { pts: [[146, 354], [152, 332], [150, 308], [146, 286], [152, 266]], kind: 'hills', width: 6 },
    // Fire Mountain, and the lava that runs from it.
    { pts: [[204, 326], [214, 322], [226, 326]], width: 12, foot: 7, footT: 'ash' },
    { pts: [[212, 326], [206, 334], [198, 344], [194, 354], [188, 366]], kind: 'lava', width: 2.2 },
    { pts: [[218, 327], [226, 336], [232, 348], [240, 358]], kind: 'lava', width: 1.8 },
    { pts: [[209, 325], [198, 330], [186, 332], [174, 330]], kind: 'lava', width: 1.6 },
  ],
  rivers: [
    { name: 'The Long Water', pts: [[30, 44], [40, 64], [50, 84], [58, 98], [66, 110], [70, 128], [80, 146], [92, 160], [100, 170]], width: [1, 3] },
    { pts: [[70, 128], [58, 146], [62, 168], [80, 186], [100, 190]], width: [2, 2] },
    { pts: [[80, 146], [84, 164], [98, 178]], width: [1.5, 1.5] },
    { pts: [[150, 20], [154, 40], [164, 60], [172, 72]], width: [1, 1.5] },
    { name: 'The Thornwater', pts: [[268, 58], [266, 72], [258, 86], [252, 94]], width: [1.5, 2.5] },
    { pts: [[360, 10], [354, 28], [346, 46], [338, 58]], width: [1, 2] },
    { pts: [[398, 24], [394, 52], [384, 84], [372, 110], [364, 122]], width: [1, 2] },
    { name: 'The Kilnwater', pts: [[494, 96], [474, 112], [452, 130], [430, 148], [408, 162], [390, 164]], width: [1, 2.5] },
    { pts: [[494, 222], [470, 220], [446, 226], [422, 230], [400, 226]], width: [1, 2] },
    { name: 'The Rime', pts: [[462, 332], [448, 320], [436, 310], [424, 306], [410, 304]], width: [1, 2] },
    { pts: [[400, 268], [392, 258], [380, 250]], width: [2, 2.5] },
    { pts: [[362, 298], [356, 280], [346, 264]], width: [1.5, 2] },
    { pts: [[250, 352], [242, 328], [230, 304], [214, 284]], width: [1, 2] },
  ],
  patches: [
    // I. The Downs west of the Shelf: chalk hills, fields round Gullwick, a copse.
    { t: 'hills', pts: [[104, 34], [132, 26], [150, 36], [140, 56], [120, 70], [108, 56]] },
    { t: 'farm', pts: [[140, 40], [170, 34], [190, 44], [186, 62], [164, 72], [146, 62]] },
    { t: 'forest', pts: [[176, 24], [192, 26], [196, 40], [184, 44], [174, 36]] },
    // II. The Deepthorn south of Thornmark, down to Thorn Head.
    { t: 'forest', pts: [[236, 62], [262, 60], [276, 70], [286, 90], [296, 118], [300, 142], [290, 146], [276, 128], [262, 106], [250, 92], [238, 78]] },
    { t: 'woods', rough: 4, pts: [[234, 62], [246, 62], [250, 74], [244, 86], [236, 76]] },
    // V. Sunderwood: pines under the rim, dead wood and crystal along the rift.
    { t: 'forest', pts: [[268, 20], [300, 14], [330, 8], [372, 10], [404, 20], [416, 40], [408, 70], [394, 104], [372, 122], [340, 116], [310, 108], [292, 100], [274, 70]] },
    { t: 'pine', pts: [[326, 10], [372, 10], [398, 18], [384, 32], [352, 30]] },
    { t: 'deadwood', rough: 6, pts: [[322, 18], [348, 18], [352, 46], [346, 64], [352, 88], [356, 116], [334, 118], [326, 96], [330, 70], [324, 44]] },
    { t: 'crystal', pts: [[330, 40], [344, 38], [346, 52], [334, 56]] },
    { t: 'crystal', pts: [[332, 84], [346, 82], [348, 98], [334, 100]] },
    { t: 'woods', rough: 4, pts: [[266, 20], [290, 18], [296, 40], [290, 64], [276, 70], [268, 50]] },
    // VI. The Kilns: hill country, quarries, spoil, the ash round the lava tubes, fields at the port.
    { t: 'hills', pts: [[440, 44], [470, 52], [492, 88], [500, 140], [494, 176], [470, 182], [458, 150], [452, 110], [444, 80]] },
    { t: 'pine', pts: [[400, 70], [418, 62], [426, 86], [414, 104], [400, 96]] },
    { t: 'woods', pts: [[424, 132], [444, 128], [452, 150], [438, 162], [424, 154]] },
    { t: 'farm', pts: [[410, 122], [428, 116], [434, 132], [418, 140]] },
    { t: 'rock', pts: [[440, 96], [456, 92], [462, 104], [448, 110]] },
    { t: 'rock', pts: [[468, 150], [482, 146], [486, 160], [472, 164]] },
    { t: 'dirt', pts: [[420, 120], [434, 116], [438, 128], [424, 132]] },
    { t: 'pine', pts: [[462, 58], [484, 70], [488, 96], [470, 90]] },
    { t: 'ash', pts: [[470, 170], [488, 166], [494, 182], [478, 188]] },
    { t: 'farm', pts: [[394, 146], [412, 142], [420, 158], [408, 172], [392, 170]] },
    { t: 'heather', pts: [[330, 182], [352, 178], [376, 180], [386, 188], [360, 190], [338, 190]] },
    // VII. Cairnmoor: heather, peat bogs, tors, grass by the shore.
    { t: 'heather', rough: 5, pts: [[402, 206], [426, 200], [452, 204], [476, 198], [498, 206], [500, 228], [494, 248], [478, 258], [452, 254], [430, 256], [410, 250], [400, 232]] },
    { t: 'marsh', rough: 3, pts: [[430, 216], [436, 213], [441, 216], [438, 222], [432, 222]] },
    { t: 'marsh', rough: 3, pts: [[466, 240], [472, 236], [478, 239], [475, 245], [468, 245]] },
    { t: 'marsh', rough: 3, pts: [[448, 244], [453, 241], [457, 245], [452, 249]] },
    { t: 'rock', rough: 1.5, pts: [[460, 206], [466, 204], [468, 210], [462, 212]] },
    { t: 'rock', rough: 1.5, pts: [[420, 236], [426, 234], [428, 240], [422, 242]] },
    { t: 'rock', rough: 1.5, pts: [[478, 218], [484, 216], [486, 222], [480, 224]] },
    { t: 'grass', rough: 4, pts: [[398, 206], [408, 210], [412, 222], [406, 236], [398, 240]] },
    // VIII. Rimewater: pinewoods, meadows by the lakes, the glacier's snow and ice.
    { t: 'pine', rough: 4, pts: [[330, 262], [380, 254], [440, 256], [480, 270], [466, 300], [446, 322], [420, 340], [380, 356], [340, 360], [320, 340], [316, 300]] },
    { t: 'grass', pts: [[386, 262], [412, 262], [414, 300], [392, 312], [386, 290]] },
    { t: 'grass', rough: 4, pts: [[336, 268], [352, 264], [358, 280], [344, 290], [332, 282]] },
    { t: 'woods', rough: 4, pts: [[424, 272], [440, 268], [452, 280], [440, 292], [428, 286]] },
    { t: 'marsh', rough: 4, pts: [[374, 330], [386, 324], [392, 336], [384, 346], [376, 342]] },
    { t: 'hills', rough: 4, pts: [[448, 270], [466, 276], [462, 292], [448, 288]] },
    { t: 'snow', pts: [[436, 312], [460, 300], [474, 318], [450, 338], [430, 334]] },
    { t: 'ice', pts: [[446, 316], [458, 310], [464, 322], [454, 330]] },
    { t: 'farm', pts: [[392, 260], [404, 256], [408, 266], [396, 270]] },
    // IX. The Whitespine: pines on the lower slopes, Monks' Vale, snow on the heights.
    { t: 'pine', pts: [[270, 246], [300, 240], [318, 270], [344, 300], [352, 340], [340, 372], [296, 376], [272, 370], [266, 330], [262, 280]] },
    { t: 'grass', pts: [[306, 324], [322, 318], [332, 340], [326, 364], [308, 360]] },
    // X. Ashfall: ash plains, a green shore of vines, lava from Fire Mountain, obsidian.
    { t: 'ash', rough: 4, pts: [[160, 280], [200, 280], [250, 284], [262, 300], [266, 340], [256, 370], [210, 370], [170, 360], [156, 330], [152, 300]] },
    { t: 'grass', pts: [[176, 268], [240, 274], [250, 288], [220, 294], [190, 292], [174, 282]] },
    { t: 'vines', rough: 3, pts: [[180, 286], [192, 283], [204, 288], [212, 296], [204, 300], [192, 296], [182, 294]] },
    { t: 'vines', rough: 3, pts: [[222, 290], [234, 286], [246, 290], [250, 298], [240, 300], [228, 298]] },
    { t: 'rock', pts: [[166, 320], [182, 316], [186, 332], [170, 338]] },
    { t: 'volcano', rough: 1, pts: [[209, 318], [220, 317], [222, 327], [211, 328]] },
    // XI. The Glasswold: steppe, dunes, the glass, mesas.
    { t: 'steppe', rough: 4, pts: [[22, 214], [70, 218], [126, 218], [150, 246], [152, 280], [140, 324], [110, 326], [70, 302], [40, 270], [26, 240]] },
    { t: 'dunes', pts: [[50, 262], [90, 254], [112, 268], [104, 292], [70, 296], [48, 284]] },
    { t: 'glass', pts: [[68, 268], [92, 264], [102, 278], [90, 292], [70, 290]] },
    { t: 'rock', rough: 2, pts: [[114, 236], [122, 234], [124, 242], [116, 244]] },
    { t: 'rock', rough: 2, pts: [[42, 236], [50, 233], [53, 241], [44, 243]] },
    { t: 'rock', rough: 2, pts: [[128, 286], [134, 284], [136, 292], [129, 293]] },
    { t: 'rock', rough: 2, pts: [[60, 240], [66, 238], [68, 245], [61, 246]] },
    { t: 'rock', rough: 2, pts: [[100, 304], [106, 302], [108, 309], [101, 310]] },
    // III. Saltreach: willow along the Upper Water, fields at Reedholm, the delta's fen, salt pans.
    { t: 'forest', pts: [[36, 56], [54, 50], [60, 76], [52, 96], [40, 92], [32, 74]] },
    { t: 'farm', pts: [[68, 66], [90, 60], [98, 82], [84, 94], [68, 88]] },
    { t: 'marsh', rough: 4, pts: [[40, 118], [70, 116], [96, 128], [104, 150], [98, 176], [108, 196], [84, 204], [56, 200], [34, 186], [28, 150]] },
    { t: 'salt', pts: [[86, 188], [104, 186], [112, 198], [98, 204], [84, 200]] },
    { t: 'sand', pts: [[98, 160], [104, 158], [106, 176], [100, 178]] },
    // IV. Wrackholm: a heather moor with a rocky east end.
    { t: 'heather', pts: [[154, 172], [174, 162], [186, 174], [172, 186], [158, 184]] },
    { t: 'rock', pts: [[182, 164], [190, 170], [190, 178], [184, 176]] },
    // XII. Hearth Isle: a rocky rim round a green bowl.
    { t: 'rock', pts: [[240, 164], [256, 158], [272, 164], [272, 180], [256, 186], [240, 180]] },
    { t: 'grass', pts: [[248, 168], [262, 166], [266, 176], [254, 180], [246, 176]] },
  ],
  trails: [
    // The coast road west from the Shelf, along the Downs and down the Ledge to Saltmouth.
    { pts: [[200, 58], [186, 62], [172, 70], [150, 84], [132, 96], [120, 108], [108, 120], [100, 140], [98, 156], [102, 176]] },
    // Upriver to Reedholm.
    { pts: [[98, 156], [84, 136], [74, 104], [80, 80]] },
    // The east road out of Thornmark, over the Sunder by the rope bridge, and on to the Kilns.
    { pts: [[264, 39], [290, 40], [316, 48], [336, 56], [360, 52], [384, 56], [410, 76], [430, 96], [446, 118]] },
    // The drove road south: the Kilns, Cairnmoor, Rimewater.
    { pts: [[446, 118], [440, 150], [428, 180], [430, 210], [432, 240], [420, 256], [408, 266]] },
    { pts: [[428, 180], [412, 162], [398, 164]] },
    // Over the Whitespine by the high pass.
    { pts: [[408, 266], [384, 278], [360, 290], [336, 300], [316, 318], [320, 340]] },
    // Ashfall and the Glasswold.
    { pts: [[206, 280], [196, 300], [180, 318], [160, 312], [140, 296], [116, 280], [92, 272]] },
  ],
  areas: [
    { id: 'shelf', name: 'The Shelf', order: 1, stone: 'Harrow Stone', label: [152, 44], note: 'The starting coast: Harrow, farms, the Downs' },
    { id: 'thornmark', name: 'Thornmark', order: 2, stone: 'Grove Stone', label: [272, 84], tint: '#94ac62', note: 'Old forest, the elf hold, the Grove' },
    { id: 'saltreach', name: 'Saltreach', order: 3, band: [10, 12], stone: 'Tide Stone', label: [62, 150], tint: '#b0b874', note: 'The Long Water\'s delta and the free port' },
    { id: 'wrackholm', name: 'Wrackholm', order: 4, band: [12, 14], label: [166, 204], note: 'The smugglers\' isle, where the stolen Tide Stone lies' },
    { id: 'sunderwood', name: 'Sunderwood', order: 5, band: [14, 16], label: [378, 96], tint: '#8aa466', note: 'The old wood the rift split' },
    { id: 'kilns', name: 'The Kilns', order: 6, band: [16, 18], stone: 'Anvil Stone', label: [452, 150], tint: '#b8b276', note: 'Dwarf country: mines, forges, the ore port' },
    { id: 'cairnmoor', name: 'Cairnmoor', order: 7, band: [18, 20], label: [464, 246], note: 'Heather moor, cairns and a ring of stones' },
    { id: 'rimewater', name: 'Rimewater', order: 8, band: [20, 22], label: [400, 330], tint: '#a2b884', note: 'Long lakes under the glacier' },
    { id: 'whitespine', name: 'The Whitespine', order: 9, band: [22, 24], stone: 'Peak Stone', label: [300, 368], note: 'The great southern range and its monks. Mountaineer' },
    { id: 'ashfall', name: 'Ashfall', order: 10, band: [24, 26], stone: 'Ember Stone', label: [210, 350], tint: '#a8a874', note: 'Fire Mountain, black sand and vines. By ship' },
    { id: 'glasswold', name: 'The Glasswold', order: 11, band: [26, 28], label: [84, 250], tint: '#c8bc7c', note: 'Steppe round a desert of fused glass' },
    { id: 'hearth', name: 'Hearth Isle', order: 12, band: [28, 30], label: [256, 196], note: 'The temple over the core' },
  ],
  zones: [
    { id: 'shelf', name: 'The Shelf', area: 'shelf', map: 'shelf', at: [200, 30] },
    { id: 'downs', name: 'Harrow Downs', area: 'shelf', band: [2, 5], seeds: [[160, 48], [128, 66], [180, 30]], label: [132, 60] },
    { id: 'thornmark', name: 'Thornmark', area: 'thornmark', map: 'thornmark', at: [232, 30] },
    { id: 'deepthorn', name: 'The Deepthorn', area: 'thornmark', band: [8, 10], seeds: [[262, 80], [250, 70], [284, 128]], label: [270, 98] },
    { id: 'upperwater', name: 'The Upper Water', area: 'saltreach', seeds: [[56, 76], [80, 56], [36, 110]] },
    { id: 'delta', name: 'The Delta', area: 'saltreach', seeds: [[62, 150], [84, 136]], label: [76, 128] },
    { id: 'saltings', name: 'The Saltings', area: 'saltreach', seeds: [[98, 194], [70, 194]] },
    { id: 'wrackholm', name: 'Wrackholm', area: 'wrackholm', seeds: [[168, 176]] },
    { id: 'eaves', name: 'The Eaves', area: 'sunderwood', seeds: [[292, 40], [300, 86]] },
    { id: 'lanternwood', name: 'Lanternwood', area: 'sunderwood', seeds: [[372, 50], [370, 96]], label: [378, 84] },
    { id: 'ironfells', name: 'The Iron Fells', area: 'kilns', seeds: [[432, 50], [414, 66]] },
    { id: 'kilnsheart', name: 'The Kilns', area: 'kilns', seeds: [[452, 120], [470, 160]] },
    { id: 'kilnmouth', name: 'Kilnmouth', area: 'kilns', seeds: [[408, 160], [404, 140]] },
    { id: 'highmoor', name: 'High Moor', area: 'cairnmoor', seeds: [[462, 212], [488, 230]] },
    { id: 'cairnfield', name: 'The Cairnfield', area: 'cairnmoor', seeds: [[426, 236], [412, 220]], label: [418, 214] },
    { id: 'longmere', name: 'Longmere', area: 'rimewater', seeds: [[392, 284], [410, 272]] },
    { id: 'coldmere', name: 'Coldmere', area: 'rimewater', seeds: [[344, 300], [340, 280]] },
    { id: 'glacierfoot', name: 'Glacier Foot', area: 'rimewater', seeds: [[440, 330], [462, 300]], label: [458, 298] },
    { id: 'sheerpoint', name: 'Sheer Point', area: 'whitespine', seeds: [[282, 244], [276, 262]] },
    { id: 'highspine', name: 'The High Spine', area: 'whitespine', seeds: [[292, 310], [290, 350]] },
    { id: 'monksvale', name: 'Monks\' Vale', area: 'whitespine', seeds: [[322, 344], [318, 318]], label: [318, 326] },
    { id: 'cindercoast', name: 'Cindercoast', area: 'ashfall', seeds: [[200, 284], [236, 286]], label: [238, 292] },
    { id: 'firemount', name: 'Fire Mountain', area: 'ashfall', seeds: [[214, 330], [240, 340]] },
    { id: 'emberwaste', name: 'The Ember Waste', area: 'ashfall', seeds: [[172, 336], [180, 300]] },
    { id: 'wold', name: 'The Wold', area: 'glasswold', seeds: [[100, 232], [132, 262], [50, 230]] },
    { id: 'theglass', name: 'The Glass', area: 'glasswold', seeds: [[80, 280], [110, 300]], label: [96, 304] },
    { id: 'hearthisle', name: 'Hearth Isle', area: 'hearth', seeds: [[256, 172]] },
  ],
  places: [
    { id: 'harrow', kind: 'town', at: [216, 22] },
    { id: 'mill', kind: 'dungeon', at: [224, 84] },
    { id: 'greywater1', kind: 'dungeon', at: [196, 68] },
    { id: 'greywater2', kind: 'dungeon', at: [196, 74] },
    { id: 'thornhold', kind: 'town', at: [256, 22] },
    { id: 'grove1', kind: 'dungeon', at: [254, 72] },
    { id: 'grove2', kind: 'dungeon', at: [254, 78] },
    { id: 'saltmouth', name: 'Saltmouth', kind: 'town', planned: true, band: [10, 12], at: [118, 172] },
    { id: 'drowned_temples', name: 'Drowned Temples', kind: 'dungeon', planned: true, band: [10, 12], at: [56, 160] },
    { id: 'smugglers_cove', name: 'Smugglers\' Cove', kind: 'dungeon', planned: true, band: [12, 14], at: [150, 158] },
    { id: 'tide_ship', name: 'The Tide Ship', kind: 'dungeon', planned: true, band: [12, 14], at: [208, 192] },
    { id: 'dead_drop', name: 'The Dead-Drop', kind: 'dungeon', planned: true, band: [26, 28], at: [208, 204] }, // below the Tide Ship's hold
    { id: 'lantern_watch', name: 'Lantern Watch', kind: 'town', planned: true, band: [14, 16], at: [372, 36] },
    { id: 'the_sunder', name: 'The Sunder', kind: 'dungeon', planned: true, band: [14, 16], at: [320, 62] },
    { id: 'anvilhall', name: 'Anvilhall', kind: 'town', planned: true, band: [16, 18], at: [452, 70] },
    { id: 'kilnhaven', name: 'Kilnhaven', kind: 'town', planned: true, band: [16, 18], at: [378, 158] },
    { id: 'deep_mines', name: 'The Deep Mines', kind: 'dungeon', planned: true, band: [16, 18], at: [440, 104] },
    { id: 'anvil_stone', name: 'The Anvil Stone', kind: 'dungeon', planned: true, band: [16, 18], at: [468, 136] },
    { id: 'lava_tubes', name: 'Lava Tubes', kind: 'dungeon', planned: true, band: [17, 18], at: [470, 194] },
    { id: 'cairns', name: 'The Cairns', kind: 'dungeon', planned: true, band: [18, 20], at: [430, 246] },
    { id: 'rime_lodge', name: 'Rime Lodge', kind: 'town', planned: true, band: [20, 22], at: [412, 256] },
    { id: 'ice_caves', name: 'Ice Caves', kind: 'dungeon', planned: true, band: [20, 22], at: [446, 340] },
    { id: 'monastery', name: 'The Monastery', kind: 'dungeon', planned: true, band: [22, 24], at: [330, 356] },
    { id: 'cinderport', name: 'Cinderport', kind: 'town', planned: true, band: [24, 26], at: [206, 288] },
    { id: 'old_cinder', name: 'Old Cinder', kind: 'dungeon', planned: true, band: [24, 26], at: [190, 324] },
    { id: 'ember_stone', name: 'The Ember Stone', kind: 'dungeon', planned: true, band: [24, 26], at: [176, 348] },
    { id: 'meridian_camp', name: 'Meridian Camp', kind: 'dungeon', planned: true, band: [26, 28], at: [226, 340] }, // down Fire Mountain's vents
    { id: 'buried_tower', name: 'Buried Tower', kind: 'dungeon', planned: true, band: [26, 28], at: [84, 286] },
    { id: 'underdeep', name: 'The Underdeep', kind: 'deep', planned: true, order: 13, band: [30, 31], at: [216, 168] },
    { id: 'core', name: 'The Core', kind: 'deep', planned: true, order: 14, band: [32, 32], at: [216, 176] },
  ],
  sites: [
    // I. The Shelf, from its map: Harrow's walls at 14-18,1-3, the Ashcombe farm, the Greywater cliffs.
    { name: 'Harrow', icon: 'city', map: 'shelf', at: [16.5, 2.4], label: 'right' },
    { name: 'Harrow Stone', icon: 'stone', map: 'shelf', at: [21.5, 4], label: 'none', planned: true },
    { name: 'Ashcombe', icon: 'farm', map: 'shelf', at: [26.5, 20.2], label: 'below' },
    { name: 'Greywater', icon: 'cave', map: 'shelf', at: [2.5, 27.4], label: 'below' },
    { name: 'Warden Pass', icon: 'gate', map: 'shelf', at: [31.5, 8.6], label: 'none' },
    { name: 'Gullwick', icon: 'village', at: [172, 70], label: 'below', planned: true },
    { name: 'Harrow Light', icon: 'lighthouse', at: [140, 88], label: 'below', planned: true },
    { name: 'Captain\'s Farm', icon: 'farm', at: [176, 42], label: 'right', planned: true }, // the Knight's second prestige
    // II. Thornmark, from its map, and the Deepthorn.
    { name: 'Thornhold', icon: 'hold', map: 'thornmark', at: [23, 3.2], label: 'below' },
    { name: 'Old Tower', icon: 'tower', map: 'thornmark', at: [4.8, 5], label: 'below' },
    { name: 'Barrow', icon: 'barrow', map: 'thornmark', at: [27.8, 8.4], label: 'below' },
    { name: 'The Grove', icon: 'grove', map: 'thornmark', at: [7.5, 28.6], label: 'right' },
    { name: 'Deepthorn Lodge', icon: 'lodge', at: [278, 112], label: 'below', planned: true }, // the Ranger's second prestige
    // III. Saltreach.
    { name: 'Reedholm', icon: 'village', at: [80, 80], label: 'right', planned: true },
    { name: 'Saltmouth', icon: 'port', at: [102, 178], label: 'left', planned: true },
    { name: 'Tide Stone', icon: 'stone', at: [48, 140], label: 'below', planned: true },
    { name: 'Drowned Temples', icon: 'sunken', at: [56, 170], label: 'below', planned: true },
    { name: 'Wind Cave', icon: 'cave', at: [104, 76], label: 'right', planned: true }, // in the Ledge's cliffs: the Monk's second prestige
    // IV. Wrackholm.
    { name: 'Smugglers\' Cove', icon: 'cave', at: [154, 170], label: 'left', planned: true },
    { name: 'Tide Ship', icon: 'wreck', at: [182, 188], label: 'right', planned: true },
    // V. Sunderwood.
    { name: 'Lantern Watch', icon: 'tower', at: [372, 46], label: 'below', planned: true },
    { name: 'The Sunder', icon: 'rift', at: [338, 70], label: 'right', planned: true },
    { name: 'Sunderfall', icon: 'falls', at: [340, 60], label: 'none', planned: true },
    // VI. The Kilns.
    { name: 'Anvilhall', icon: 'fortress', at: [452, 80], label: 'below', planned: true },
    { name: 'Deep Mines', icon: 'mine', at: [440, 96], label: 'below', planned: true },
    { name: 'Forges', icon: 'forge', at: [436, 126], label: 'below', planned: true },
    { name: 'Anvil Stone', icon: 'stone', at: [468, 142], label: 'below', planned: true },
    { name: 'Lava Tubes', icon: 'cave', at: [478, 178], label: 'below', planned: true },
    { name: 'Kilnhaven', icon: 'port', at: [391, 162], label: 'right', planned: true },
    { name: 'Iron Crag', icon: 'cave', at: [432, 44], label: 'below', planned: true }, // the Barbarian's second prestige
    // VII. Cairnmoor.
    { name: 'Stone Ring', icon: 'ring', at: [462, 214], label: 'below', planned: true },
    { name: 'The Cairns', icon: 'barrow', at: [430, 240], label: 'below', planned: true },
    { name: 'Watcher\'s Hut', icon: 'lodge', at: [466, 208], label: 'right', planned: true }, // the Sorcerer's second prestige
    // VIII. Rimewater.
    { name: 'Rime Lodge', icon: 'lodge', at: [410, 262], label: 'right', planned: true },
    { name: 'Ice Caves', icon: 'cave', at: [452, 326], label: 'below', planned: true },
    // IX. The Whitespine.
    { name: 'Monastery', icon: 'monastery', at: [322, 342], label: 'right', planned: true },
    { name: 'Peak Stone', icon: 'stone', at: [292, 318], label: 'below', planned: true },
    { name: 'Giants', icon: 'label', at: [300, 296], planned: true },
    { name: 'Stairwatch', icon: 'tower', at: [270, 312], label: 'right', planned: true }, // over the Giants' Stair: the Knight's third prestige
    { name: 'Spine Summit', icon: 'camp', at: [300, 328], label: 'right', planned: true }, // the Monk's third prestige
    { name: 'Rook\'s Nest', icon: 'cave', at: [286, 230], label: 'right', planned: true }, // on Sheer Point, over the Hand's causeway: the Thief's third prestige
    // X. Ashfall.
    { name: 'Cinderport', icon: 'port', at: [206, 277], label: 'right', planned: true },
    { name: 'Fire Mountain', icon: 'volcano', at: [215, 326], label: 'none', planned: true },
    { name: 'Old Cinder', icon: 'ruin', at: [190, 318], label: 'below', planned: true },
    { name: 'Ember Stone', icon: 'stone', at: [176, 342], label: 'below', planned: true },
    { name: 'Hot Springs', icon: 'springs', at: [240, 300], label: 'below', planned: true },
    { name: 'Meridian Camp', icon: 'cave', at: [226, 334], label: 'below', planned: true }, // the vents' mouth: the Lost Expedition's last camp lies below
    { name: 'Warlord\'s Forge', icon: 'forge', at: [230, 330], label: 'right', planned: true }, // by the vents' mouth: the Barbarian's third prestige
    // XI. The Glasswold.
    { name: 'Buried Tower', icon: 'obelisk', at: [84, 280], label: 'below', planned: true },
    { name: 'Wold Riders', icon: 'camp', at: [120, 250], label: 'below', planned: true },
    { name: 'The Eyrie', icon: 'camp', at: [132, 289], label: 'below', planned: true }, // a scout's lookout on a mesa: the Ranger's third prestige
    // XII. The middle of the world, and the names of waters and walls.
    { name: 'The Hearth', icon: 'hearth', at: [256, 174], label: 'none', planned: true },
    { name: 'Anchorhold', icon: 'tower', at: [268, 176], label: 'right', planned: true }, // on Hearth Isle: the Cleric's third prestige
    { name: 'The Inland Sea', icon: 'water', at: [214, 230], size: 2 },
    { name: 'Harrow Bay', icon: 'water', at: [216, 84] },
    { name: 'Salt Gulf', icon: 'water', at: [124, 150] },
    { name: 'The Scarp', icon: 'label', at: [70, 208] },
    { name: 'The Sheer', icon: 'label', at: [262, 300] },
    { name: 'The Iron Fells', icon: 'label', at: [420, 70] },
  ],
  links: [
    { from: 'shelf', to: 'downs', kind: 'road', a: [201.5, 57.5], b: [192, 60] },
    { from: 'downs', to: 'delta', kind: 'road', opens: 2, a: [126, 100], b: [114, 116], note: 'down the Ledge' },
    { from: 'saltings', to: 'saltmouth', kind: 'enter', a: [102, 178] },
    { from: 'delta', to: 'drowned_temples', kind: 'enter', a: [56, 170] },
    { from: 'saltmouth', to: 'wrackholm', kind: 'sea', b: [152, 172], note: 'smuggler boat' },
    { from: 'wrackholm', to: 'smugglers_cove', kind: 'enter', a: [154, 170] },
    { from: 'wrackholm', to: 'tide_ship', kind: 'enter', a: [182, 188] },
    { from: 'tide_ship', to: 'dead_drop', kind: 'stairs' },
    { from: 'thornmark', to: 'deepthorn', kind: 'road', a: [240, 60.5], b: [242, 66] },
    { from: 'thornmark', to: 'eaves', kind: 'road', opens: 4, a: [263.5, 39.5], b: [272, 39.5], note: 'the east road', noteAt: [290, 30] },
    { from: 'eaves', to: 'lanternwood', kind: 'road', a: [330, 56], b: [346, 56], note: 'rope bridge' },
    { from: 'eaves', to: 'the_sunder', kind: 'enter', a: [338, 70] },
    { from: 'lanternwood', to: 'lantern_watch', kind: 'enter', a: [372, 46] },
    { from: 'lanternwood', to: 'ironfells', kind: 'road', a: [404, 70], b: [416, 84] },
    { from: 'ironfells', to: 'anvilhall', kind: 'enter', a: [452, 80] },
    { from: 'ironfells', to: 'deep_mines', kind: 'enter', a: [440, 96] },
    { from: 'kilnsheart', to: 'anvil_stone', kind: 'enter', a: [468, 142] },
    { from: 'kilnsheart', to: 'lava_tubes', kind: 'enter', a: [478, 178] },
    { from: 'kilnmouth', to: 'kilnhaven', kind: 'enter', a: [391, 162] },
    { from: 'kilnsheart', to: 'highmoor', kind: 'road', a: [430, 196], b: [432, 212] },
    { from: 'cairnfield', to: 'cairns', kind: 'enter', a: [430, 240] },
    { from: 'cairnfield', to: 'longmere', kind: 'road', a: [424, 250], b: [414, 262] },
    { from: 'longmere', to: 'rime_lodge', kind: 'enter', a: [410, 262] },
    { from: 'glacierfoot', to: 'ice_caves', kind: 'enter', a: [452, 326] },
    { from: 'coldmere', to: 'monksvale', kind: 'road', a: [334, 302], b: [318, 318], note: 'Mountaineer' },
    { from: 'monksvale', to: 'monastery', kind: 'enter', a: [322, 342] },
    { from: 'kilnhaven', to: 'saltmouth', kind: 'sea', opens: 6, via: [[340, 150], [296, 160], [230, 146], [160, 150]], note: 'the ferry', noteAt: [230, 140] },
    { from: 'kilnhaven', to: 'cinderport', kind: 'sea', opens: 9, via: [[352, 162], [316, 168], [298, 198], [264, 220], [240, 254]], note: 'Compact ship', noteAt: [300, 210] },
    { from: 'cindercoast', to: 'cinderport', kind: 'enter', a: [206, 277] },
    { from: 'firemount', to: 'old_cinder', kind: 'enter', a: [190, 318] },
    { from: 'firemount', to: 'meridian_camp', kind: 'enter', a: [226, 334] },
    { from: 'emberwaste', to: 'ember_stone', kind: 'enter', a: [176, 342] },
    { from: 'emberwaste', to: 'wold', kind: 'road', a: [156, 312], b: [144, 300] },
    { from: 'theglass', to: 'buried_tower', kind: 'enter', a: [84, 280] },
    { from: 'wold', to: 'saltings', kind: 'road', opens: 11, a: [80, 216], b: [80, 206], note: 'the Scarp stair' },
    { from: 'firemount', to: 'highspine', kind: 'road', opens: 10, a: [258, 306], b: [272, 306], note: 'the Giants\' Stair' },
    { from: 'cinderport', to: 'hearthisle', kind: 'sea', opens: 11, via: [[228, 236]], b: [252, 188], note: 'the last crossing' },
    { from: 'hearthisle', to: 'underdeep', kind: 'deep', a: [250, 172] },
    { from: 'underdeep', to: 'core', kind: 'deep' },
  ],
};
