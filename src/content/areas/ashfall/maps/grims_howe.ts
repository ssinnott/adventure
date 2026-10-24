// Grim's Howe, Ashfall's lair (#845, #846): the warlord's grave under the rock where the south-west flow
// stopped, entered at F12's 20,14 in the dam's rock. In under the dam and down a tube the flow left as it
// drained, its roof the crust, to a mound of black stones heaped across the way, the grave, where the
// Grave Drake lies asleep, the lair's guardian at 32 (MONSTERS §13), the one way on. Past it the
// warlord's chamber, his bones on a bier and Grim's Axe with them; in the wall behind the bier one stone
// cut with a smoking mountain, and behind it the war-band's offerings walled into a niche. One level,
// band 30-32; docs/areas/ashfall.md §12.4 is its brief.
import type { MapDef } from '../../../../game/mapdef.ts';
import { anchored } from '../../../../game/map.ts';
import { SOUTH } from '../../../../game/types.ts';

export const GRIMS_HOWE: MapDef<'grims_howe'> = {
  id: 'grims_howe',
  name: 'Grim\'s Howe',
  kind: 'dungeon',
  band: [30, 32],
  enclave: true,
  region: 'ashfall',
  start: { x: 7, y: 1, facing: SOUTH },
  // The flow's black crust, the warm dark under it and the rust of the war-band's iron.
  palette: { wall: '#2b2523', wallDark: '#191513', floor: '#3a2b24', ceiling: '#120d0b', door: '#2b2523', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#8a3a1a' },
  rows: [
    '################',
    '#######.########',
    '#######.########',
    '#######...######',
    '#########.######',
    '#####.....######',
    '#####.##########',
    '#####...########',
    '#######.########',
    '#######.########',
    '####.......#####',
    '####.o...o.#####',
    '####.......#####',
    '#######S########',
    '######..########',
    '################',
  ],
  exits: [
    anchored({ x: 7, y: 1, to: 'emberwaste_f12', at: 'from_grims_howe', label: 'Up out from under the crust, onto the flow in its cut and into the wind off the ash.' }),
  ],
  features: [
    // The way in under the crust, and the tube going down.
    { kind: 'event', x: 7, y: 2, id: 'gh_crust', once: true, text: 'A tube the flow left as it drained, going down. Its roof is the crust, hung in black folds like rope.' },
    { kind: 'event', x: 7, y: 5, id: 'gh_warm', once: true, text: 'The rock is warmer the further down it goes. From ahead comes a slow breath, and a smell of hot stone.' },
    // The grave heaped across the way, where the guardian sleeps.
    { kind: 'event', x: 7, y: 7, id: 'gh_mound', once: true, text: 'Below, the tube ends on a mound of black stones heaped across the way, a grave. Something lies on it.' },
    // Past it the warlord's chamber, his bones on the bier and his axe with them.
    { kind: 'event', x: 7, y: 10, id: 'gh_chamber', once: true, text: 'Behind the mound a chamber roofed with the crust, and a bier of stone. On it a big man\'s bones in mail.' },
    { kind: 'chest', x: 7, y: 11, id: 'gh_bier', gold: 0, items: ['grims_axe'] },
    // The secret: one stone of the wall behind the bier cut with a smoking mountain, and behind it the
    // war-band's offerings walled into a niche.
    { kind: 'event', x: 7, y: 12, id: 'gh_mark', once: true, text: 'In the wall behind the bier one stone is cut with a mountain, and smoke going up from its top.' },
    { kind: 'event', x: 7, y: 14, id: 'gh_niche', once: true, text: 'A niche walled up behind the stone, and in it what his war-band gave him: arm-rings, and two flasks.' },
    { kind: 'chest', x: 6, y: 14, id: 'gh_offerings', gold: 500, items: ['elixir', 'potion_sp_great'] },
  ],
  secrets: [{ x: 7, y: 13, hint: 'gh_mark' }],
  encounters: [
    // The guardian: the Grave Drake asleep on the grave across the way, the one way on, a boss at 32 that
    // never comes back.
    { id: 'gh_drake', x: 7, y: 9, monsters: ['grave_drake'], roams: false, boss: true, slainText: 'The Grave Drake settles on the grave, and its breath goes out of it. Under it the stones begin to cool.' },
  ],
};
