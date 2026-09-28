// Helmstow, capital of the Foreland. The party's home town for the slice: inn, temple, shop, guild,
// trainer and tavern, with the gate south onto the Foreland road and the gatehouse north into the
// keep's ward (keep.ts), where the Regent-Warden holds court.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';

export const HARROW: MapDef = {
  id: 'harrow',
  name: 'Helmstow',
  kind: 'town',
  band: [1, 4],
  start: { x: 7, y: 14, facing: NORTH },
  rows: [
    '#######==#######',
    '#,,,,,,==,,,,,,#',
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
    { x: 7, y: 0, to: 'keep', tx: 7, ty: 8, tf: NORTH, label: 'You pass under the gatehouse into the keep\'s ward.' },
    { x: 8, y: 0, to: 'keep', tx: 8, ty: 8, tf: NORTH, label: 'You pass under the gatehouse into the keep\'s ward.' },
  ],
  features: [
    { kind: 'inn', x: 4, y: 4, name: 'The Hearthlight Inn', price: 12, interior: 'hearthlight_inn' },
    { kind: 'temple', x: 11, y: 4, name: 'Chapel of the Lanterns', interior: 'lantern_chapel' },
    { kind: 'shop', x: 4, y: 10, name: "Mottram's Stores", stock: ['club', 'dagger', 'staff', 'shortsword', 'mace', 'longsword', 'axe', 'spear', 'sling', 'shortbow', 'longbow', 'robe', 'leather', 'scale', 'chain', 'buckler', 'shield', 'potion_heal', 'antidote', 'rations', 'torch'], interior: 'harrow_provisioner' },
    { kind: 'guild', x: 11, y: 10, name: 'Lantern Guildhall', classes: ['cleric', 'sorcerer', 'paladin', 'ranger', 'bard', 'druid'], fee: 50, interior: 'lantern_guildhall' },
    { kind: 'trainer', x: 3, y: 13, name: 'Warden Drillyard', maxLevel: 6, interior: 'warden_drillyard' },
    { kind: 'npc', x: 12, y: 13, name: 'The Gilded Eel', interior: 'gilded_eel', lines: [
      'The tavern is loud and smells of eel.',
      'A fisherman says: "The Hearth stuttered the night the Queen died. I saw it from the boats."',
      'A Warden mutters: "Something came up out of the Ashcombe farm. Rats first, then worse. Nobody has gone to look."',
      'A Lantern adjunct, drunk: "The survey team went south a week ago. They should have been back."',
      'A dockhand, quietly: "Cheap brandy comes out of the caves at Brandy Hole, west end of the beach. Folk who go to buy it lately don\'t all come back. Captain Hale at the pass wants them cleared."',
    ] },
    { kind: 'well', x: 7, y: 6, text: 'The town well. The water tastes faintly of iron.' },
    { kind: 'sign', x: 8, y: 14, text: 'Helmstow. North gate: the keep. South gate: the Foreland road, the Ashcombe farms.' },
    { kind: 'event', x: 7, y: 14, id: 'harrow_intro', once: true, text: 'Helmstow. The Hearth flickered last night and the Queen is dead. The Regent-Warden is hiring.' },
  ],
};
