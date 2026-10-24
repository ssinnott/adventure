// The Whitespine, box J8: the pines over the water by Sheer Point. Country, band 22-23, the bounds'
// second (#832): the hills and pines of I8's east edge running on round the bay's head to J9's strand,
// a strip of hills along the west and a wedge of pines widening south, the sea over the rest. The
// eel-fisher at his fire on the strand and a cairn on the hills; spine eagles over the shallows at the
// neck of a point of pines and, behind them on the point, two snow trolls; and at the hill's foot the
// eel-traps stacked, and in the hill the smoke-house they were fished for.
// In from I8 (#504) over its east edge, walked, the same land at the same floor; from J9 (#497) over its
// south edge, where the pass's road joins the two areas, square for square. J9's 0,0 is shut to the
// mountain and this map's 0,31 is rock, for I8's 31,31 is rock and J9's 0,0 was pines; J8's west column
// is hills at 11 to 14 where the atlas has shallows, and its row 31 ice at 10 to 12 to meet J9's. North
// and east the sea, and the world ends. Laid whole in Sheer Point, its larger zone; docs/areas/
// whitespine.md §12.1 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { EAST } from '../../../../game/types.ts';
import { RESPAWN } from '../../../../game/keys.ts';

export const SHEERPOINT_J8: MapDef<'sheerpoint_j8'> = {
  id: 'sheerpoint_j8',
  name: 'Sheer Point',
  kind: 'outdoor',
  density: 'country',
  band: [22, 23],
  region: 'whitespine',
  start: { x: 0, y: 19, facing: EAST },
  rows: [
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '~WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '~WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '~WWWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '^~WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '^~WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '^~WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '^~WWWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '^rrrWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '^r.rWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '^r.rWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    '^rSrWWWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'ppp~~WWWWWWWWWWWWWWWWWWWWWWWWWWW',
    'pppp~~WWWWWWWWWWWWWWWWWWWWWWWWWW',
    'pppp~~WWWWWWWWWWWWWWWWWWWWWWWWWW',
    'pppp~~WWWWWWWWWWWWWWWWWWWWWWWWWW',
    'pppppppWWWWWWWWWWWWWWWWWWWWWWWWW',
    'ppppp~~WWWWWWWWWWWWWWWWWWWWWWWWW',
    'ppppp~~~WWWWWWWWWWWWWWWWWWWWWWWW',
    'ppppppp~~WWWWWWWWWWWWWWWWWWWWWWW',
    'pppppp~~WWWWWWWWWWWWWWWWWWWWWWWW',
    'ppppppp~~WWWWWWWWWWWWWWWWWWWWWWW',
    'pppppppp~~WWWWWWWWWWWWWWWWWWWWWW',
    ':pppppppp~~WWWWWWWWWWWWWWWWWWWWW',
    'rpppppppppiiiWWWWWWWWWWWWWWWWWWW',
  ],
  features: [
    // The hills along the west: the sea seen north and east from the strip's head, and a cairn.
    { kind: 'event', x: 0, y: 12, id: 'j8_sea', once: true, text: 'North and east the sea goes out to the edge of the world, grey and flat, with nothing on it.' },
    { kind: 'cairn', x: 0, y: 14, id: 'j8_cairn', text: 'A cairn of beach stones on the hill, a spent line wound round its top and frozen there.', gold: 120, items: ['potion_sp_great'] },
    // The secret: the eel-traps of woven withy stacked at the hill's foot, no hut in sight; the search
    // there, and the smoke-house cut into the hill, a room of two with its door at the south end.
    { kind: 'event', x: 2, y: 19, id: 'j8_traps', once: true, text: 'Eel-traps of woven withy stacked at the hill\'s foot, grey and dry, and no hut anywhere in sight.' },
    { kind: 'event', x: 2, y: 17, id: 'j8_house', once: true, text: 'A smoke-house cut into the hill, the racks still hung with eels gone to leather, and a strongbox under them.' },
    { kind: 'chest', x: 2, y: 16, id: 'j8_strongbox', gold: 250, items: ['elixir'] },
    // The strand: the shallows along it, and the eel-fisher at his fire with his word on the point.
    { kind: 'event', x: 3, y: 21, id: 'j8_shallows', once: true, text: 'The shallows run grey along the strand, and the wakes of eels cross them in long lines.' },
    { kind: 'camp', x: 8, y: 30, name: 'The eel-fisher\'s fire', text: 'A ring of shore stones on the strand, a drying-frame of driftwood over it and the ash still warm.' },
    { kind: 'npc', x: 7, y: 30, name: 'An eel-fisher', lines: [
      'An eel-fisher at his fire on the strand, a line round his wrist, his eyes on the shallows.',
      '"The eagles come down to the shallows for my eels. I let them have the small ones."',
      '"Keep out of the pines on the point. Two white trolls lie up there, and they do not share."',
    ] },
  ],
  secrets: [{ x: 2, y: 18, hint: 'j8_traps' }],
  encounters: [
    // Four spine eagles over the shallows at the neck of the point, nearer the way in, the gentler, at
    // 22; two snow trolls on the point behind them, the hardest, at 23: the neck is the only way on to
    // them, so a company on foot meets the eagles first from every square the box is entered by.
    { id: 'j8_eagles', x: 5, y: 23, monsters: ['spine_eagle', 'spine_eagle', 'spine_eagle', 'spine_eagle'], aware: 3, respawn: RESPAWN.day, roams: false },
    { id: 'j8_trolls', x: 6, y: 23, monsters: ['snow_troll', 'snow_troll'], aware: 3, respawn: RESPAWN.twoDays, roams: false },
  ],
};
