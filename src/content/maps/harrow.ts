// Harrow, capital of the Shelf. The party's home town for the slice: inn, temple, shop, guild,
// trainer and tavern, with the gate south onto the Shelf road.
import type { MapDef } from '../../game/map.ts';
import { NORTH, SOUTH } from '../../game/types.ts';

export const HARROW: MapDef = {
  id: 'harrow',
  name: 'Harrow',
  kind: 'town',
  band: [1, 4],
  start: { x: 7, y: 14, facing: NORTH },
  rows: [
    '################',
    '#,,,,,,,,,,,,,,#',
    '#,BBBB,==,BBBB,#',
    '#,BBBB,==,BBBB,#',
    '#,BBDB,==,BDBB,#',
    '#,,,,,,==,,,,,,#',
    '#==============#',
    '#,,,,,,==,,,,,,#',
    '#,BBBB,==,BBBB,#',
    '#,BBBB,==,BBBB,#',
    '#,BBDB,==,BDBB,#',
    '#,,,,,,==,,,,,,#',
    '#,BBB,,==,,BBB,#',
    '#,BDB,,==,,BDB,#',
    '#,,,,,,==,,,,,,#',
    '#######==#######',
  ],
  exits: [
    { x: 7, y: 15, to: 'shelf', tx: 16, ty: 4, tf: SOUTH, label: 'You leave Harrow by the south gate.' },
    { x: 8, y: 15, to: 'shelf', tx: 16, ty: 4, tf: SOUTH, label: 'You leave Harrow by the south gate.' },
  ],
  features: [
    { kind: 'inn', x: 4, y: 4, name: 'The Hearthlight Inn', price: 12 },
    { kind: 'temple', x: 11, y: 4, name: 'Chapel of the Lanterns' },
    { kind: 'shop', x: 4, y: 10, name: 'Harrow Provisioner', stock: ['club', 'dagger', 'staff', 'shortsword', 'mace', 'spear', 'sling', 'shortbow', 'robe', 'leather', 'buckler', 'potion_heal', 'antidote', 'rations', 'torch'] },
    { kind: 'guild', x: 11, y: 10, name: 'Lantern Guildhall', classes: ['cleric', 'sorcerer', 'paladin', 'ranger'], fee: 50 },
    { kind: 'trainer', x: 3, y: 13, name: 'Warden Drillyard', maxLevel: 6 },
    { kind: 'npc', x: 12, y: 13, name: 'The Gilded Eel', lines: [
      'The tavern is loud and smells of eel.',
      'A fisherman says: "The Hearth stuttered the night the Queen died. I saw it from the boats."',
      'A Warden mutters: "Something came up out of the Ashcombe farm. Rats first, then worse. Nobody has gone to look."',
      'A Lantern adjunct, drunk: "The survey team went south a week ago. They should have been back."',
      'A dockhand, quietly: "Cheap brandy comes out of the Greywater caves, west end of the beach. Folk who go to buy it lately don\'t all come back. Captain Hale at the pass wants them cleared."',
    ] },
    { kind: 'well', x: 7, y: 6, text: 'The town well. The water tastes faintly of iron.' },
    { kind: 'sign', x: 8, y: 14, text: 'Harrow. South gate: the Shelf road, the Ashcombe farms.' },
    { kind: 'npc', x: 9, y: 5, name: 'Lord Aumery Vask, Regent-Warden', lines: [
      'A tall man in Warden grey, flanked by guards. He does not wait for you to bow.',
      '"The Crown has need of a chartered company and the Wardens are stretched thin. There is a farm south of here, Ashcombe, that has gone quiet. Find out why. Clear whatever is there."',
      '"Bring me anything you find that is not a rat. Especially anything that glows."',
    ], flag: 'q_ashcombe', quest: {
      item: 'survey_wand', needFlag: 'q_ashcombe', reward: 300, setFlag: 'q_ashcombe_done',
      done: [
        'Vask turns the cracked survey wand over in his hands for a long moment. If he recognises it, nothing in his face says so.',
        '"A Lantern tool. So the Lanterns were there before us. Interesting." He drops it into a pocket. "You have done what I asked. The Crown pays its debts."',
        '"There will be more work. The Grove Stone in Thornmark has gone quiet too. Rest, train, and come back to me."',
      ],
      after: ['"Thornmark next, and the Grove Stone: go and see why it has gone quiet, and bring me what you find. Captain Hale holds the pass; he opens it once his smugglers at Greywater are dealt with. Thornhold will train you further than my drillyard can."'],
    } },
    { kind: 'event', x: 7, y: 14, id: 'harrow_intro', once: true, text: 'Harrow. The Hearth flickered last night and the Queen is dead. The Regent-Warden is hiring.' },
  ],
};
