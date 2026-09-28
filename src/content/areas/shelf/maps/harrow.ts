// Helmstow, capital of the Foreland. The party's home town for the slice: inn, temple, shop, guild,
// trainer and tavern, with the gate south onto the Foreland road.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

export const HARROW: MapDef = {
  id: 'harrow',
  name: 'Helmstow',
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
    { x: 7, y: 15, to: 'shelf', tx: 16, ty: 4, tf: SOUTH, label: 'You leave Helmstow by the south gate.' },
    { x: 8, y: 15, to: 'shelf', tx: 16, ty: 4, tf: SOUTH, label: 'You leave Helmstow by the south gate.' },
  ],
  features: [
    { kind: 'inn', x: 4, y: 4, name: 'The Hearthlight Inn', price: 12, interior: 'hearthlight_inn' },
    { kind: 'temple', x: 11, y: 4, name: 'Chapel of the Lanterns', interior: 'lantern_chapel' },
    { kind: 'shop', x: 4, y: 10, name: "Mottram's Stores", stock: ['club', 'dagger', 'staff', 'shortsword', 'mace', 'longsword', 'axe', 'spear', 'sling', 'shortbow', 'longbow', 'robe', 'leather', 'scale', 'chain', 'buckler', 'shield', 'potion_heal', 'antidote', 'rations', 'torch'], interior: 'harrow_provisioner' },
    { kind: 'guild', x: 11, y: 10, name: 'Lantern Guildhall', classes: ['cleric', 'sorcerer', 'paladin', 'ranger', 'bard', 'druid'], fee: 50, interior: 'lantern_guildhall', hall: 'lanterns' },
    { kind: 'trainer', x: 3, y: 13, name: 'Warden Drillyard', maxLevel: 6, interior: 'warden_drillyard', hall: 'wardens' },
    { kind: 'npc', x: 12, y: 13, name: 'The Gilded Eel', interior: 'gilded_eel', lines: [
      'The tavern is loud and smells of eel.',
      'A fisherman, to nobody: "The Hearth stuttered the night the Queen died. I saw it from the boats. Out, and back, and out, like a man blowing on a wick that won\'t take."',
      'A Warden, into his cup: "Something came up out of the Ashcombe farm. Rats first, then worse. Nobody has gone to look, and nobody\'s been told to."',
      'A Lantern adjunct, drunk: "The survey team went south a week ago. A week. They should have been back by now. They should have been back."',
      'A dockhand: "Cheap brandy comes out of the caves at Brandy Hole, west end of the beach. Folk who buy it lately don\'t all come back. Captain Hale at the pass wants them cleared."',
    ] },
    { kind: 'well', x: 7, y: 6, text: 'The town well. The water tastes faintly of iron.' },
    { kind: 'sign', x: 8, y: 14, text: 'Helmstow. South gate: the Foreland road, the Ashcombe farms.' },
    { kind: 'npc', x: 9, y: 5, name: 'Lord Aumery Vask, Regent-Warden', lines: [
      'A tall man in Warden grey, his guards a step behind him. He does not wait for you to bow, and does not appear to notice that you did not.',
      '"The Crown has need of a chartered company; the Wardens are stretched thin. A farm south of here, Ashcombe, on the Foreland road, has gone quiet. Find out why. Clear whatever is there."',
      '"Bring me anything you find that is not a rat. Especially anything that glows."',
    ], flag: 'q_ashcombe', quest: {
      item: 'survey_wand', reward: 300, setFlag: 'q_ashcombe_done',
      early: [
        'A tall man in Warden grey, flanked by guards. His eyes go to the cracked survey wand before they go to you.',
        '"Ashcombe. I meant to hire a company for that." He turns the wand over for a long moment. If he recognises it, nothing in his face says so.',
        '"A Lantern tool. So the Lanterns were there before us. Interesting." He drops it into a pocket. "The Crown pays for work it did not have to ask for."',
        '"There will be more work. The Grove Stone in Thornmark has gone quiet too. Rest, train, and come back to me."',
      ],
      done: [
        'Vask turns the cracked survey wand over in his long fingers, once, and then again. If he knows what he is holding, nothing in his face admits it.',
        '"A Lantern tool. So the Lanterns were at Ashcombe before the Crown was. Interesting." The wand goes into a pocket as if it had always lived there. "You have done what I asked. The Crown pays its debts; you\'ll find it does little else so reliably."',
        '"There will be more work. The Grove Stone in Thornmark has gone quiet too. Rest, train, and come back to me."',
      ],
      after: ['"Thornmark, and the Grove Stone. Go and see why it has gone quiet, and bring me what you find. The road east runs through the Scarth; Captain Hale holds it, and will tell you the forest is dangerous, which it is. Thornhold will train you further than my drillyard can."'],
    } },
    { kind: 'event', x: 7, y: 14, id: 'harrow_intro', once: true, text: 'Helmstow. The Hearth flickered last night and the Queen is dead. The Regent-Warden is hiring.' },
  ],
};
