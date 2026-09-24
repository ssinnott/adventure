// Thornhold, the elf-hold of Thornmark. The second town: an inn, the Lantern chapterhouse (temple
// and guild, spells to tier 4), an armoury with the Thornmark tier of gear, the Elder's training
// yard (to level 10), the Split Oak tavern, and Elder Sylvane, who wants proof of who cut the Stone.
import type { MapDef } from '../../game/map.ts';
import { NORTH, SOUTH } from '../../game/types.ts';

export const THORNHOLD: MapDef = {
  id: 'thornhold',
  name: 'Thornhold',
  kind: 'town',
  band: [5, 10],
  start: { x: 7, y: 14, facing: NORTH },
  palette: { wall: '#c8b890', wallDark: '#8a7a58', floor: '#7a8a50', banner: '#2a6a3a' },
  rows: [
    '################',
    '#,T,,,,,,,,,,T,#',
    '#,BBBB,==,BBBB,#',
    '#,BBBB,==,BBBB,#',
    '#,BBDB,==,BDBB,#',
    '#,,,,,,==,,,,T,#',
    '#==============#',
    '#,T,,,,==,,,,,,#',
    '#,BBBB,==,BBBB,#',
    '#,BBBB,==,BBBB,#',
    '#,BBDB,==,BDBB,#',
    '#,,,,,,==,,,,,,#',
    '#,BBB,,==,,BBB,#',
    '#,BDB,,==,,BDB,#',
    '#,T,,,,==,,,,T,#',
    '#######==#######',
  ],
  exits: [
    { x: 7, y: 15, to: 'thornmark', tx: 23, ty: 5, tf: SOUTH, label: 'You leave Thornhold by the oak gate.' },
    { x: 8, y: 15, to: 'thornmark', tx: 23, ty: 5, tf: SOUTH, label: 'You leave Thornhold by the oak gate.' },
  ],
  features: [
    { kind: 'inn', x: 4, y: 4, name: 'The Green Man', price: 20 },
    { kind: 'temple', x: 11, y: 4, name: 'Lantern Chapterhouse' },
    { kind: 'shop', x: 4, y: 10, name: 'Thornhold Armoury', stock: ['longsword', 'warhammer', 'battleaxe', 'greatsword', 'crossbow', 'elfbow', 'rune_dagger', 'grove_staff', 'chain', 'runed_robe', 'brigandine', 'plate', 'tower_shield', 'elixir', 'potion_sp_great', 'lantern_oil', 'rations'] },
    { kind: 'guild', x: 11, y: 10, name: 'Thornhold Lantern Hall', classes: ['cleric', 'sorcerer', 'paladin', 'ranger', 'bard', 'druid'], fee: 200, maxTier: 4 },
    { kind: 'trainer', x: 3, y: 13, name: "The Elder's Yard", maxLevel: 10 },
    { kind: 'npc', x: 12, y: 13, name: 'The Split Oak', lines: [
      'A tavern built around a living oak. The elves drink slowly and watch the door.',
      'A forester says: "The Stone went quiet a month back. Then the wolves got big. Then the wolves got strange."',
      'A Lantern in travel-grey, not drunk: "Vask sent a survey team south before the Stone even failed. How did he know?"',
      'A brigand, or a man dressed like one, pays for his ale with a coin that is not from Caldera.',
    ] },
    { kind: 'well', x: 7, y: 6, text: 'A spring in an oak-root basin. The water is cold and sweet.', heal: true },
    { kind: 'sign', x: 8, y: 14, text: 'Thornhold. South gate: the Warden road, the bridge, the Grove.' },
    { kind: 'npc', x: 9, y: 5, name: 'Elder Sylvane of Thornhold', lines: [
      'An elf in a robe the colour of bark, older than any human you have met. She does not rise.',
      '"The Grove Stone has been cut. Not failed: cut, by hands, with tools. My people will not go under the roots; what has come through has already taken four of them."',
      '"Vask will tell you the Stones are failing. Bring me the tool that cut ours, and we will both know better."',
    ], flag: 'q_grove', quest: {
      item: 'ashen_chisel', needFlag: 'q_grove', reward: 1500, setFlag: 'q_grove_done',
      done: [
        'Sylvane takes the chisel in both hands and is silent for a long time.',
        '"This was not forged anywhere in Caldera. The edge does not blunt. The runes are Underdeep, and they are a maintenance mark, not a prayer." She sets it down as if it were hot.',
        '"Whoever arms the Ashen Hand can reach the Underdeep. Keep this from the Regent-Warden until you know which side of it he stands on. The Lanterns will pay for what you have done here, and pay well."',
      ],
      after: ['"The Grove is quiet again. The cut will need a Lantern to mend, and we have sent for one. Rest here as long as you need; Thornhold owes you."'],
    } },
    { kind: 'event', x: 7, y: 14, id: 'thornhold_intro', once: true, text: 'Thornhold. Houses grown around living trees, and a hush that is not peace.' },
  ],
};
