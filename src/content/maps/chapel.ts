// The Drowned Chapel: a Lantern waystation the marsh took back, and where the survey team the
// Gilded Eel gossips about actually went. A cross plan — a flooded nave running north to an apse,
// two crypt rooms off the south, one behind a lock and one behind a wall that is not a wall — and
// a font at the altar that only a swimmer reaches.
import type { MapDef } from '../../game/map.ts';
import { NORTH } from '../../game/types.ts';

export const CHAPEL: MapDef = {
  id: 'chapel',
  name: 'The Drowned Chapel',
  kind: 'dungeon',
  band: [2, 5],
  start: { x: 14, y: 14, facing: NORTH },
  palette: { wall: '#6f7a72', wallDark: '#454e4a', floor: '#3c4a46', ceiling: '#2a3432', wallStyle: 'stone', ceilingStyle: 'vault', banner: '#2a6a7a' },
  rows: [
    '################',
    '#....#....#....#',
    '#....#.~~.#....#',
    '#.oo.D.~~.D.oo.#',
    '#.oo.#....#.oo.#',
    '#....######....#',
    '#..............#',
    '####.######.####',
    '#......ww......#',
    '#.####.ww.####.#',
    '#.#..S.ww.L..#.#',
    '#.#..#.ww.#..#.#',
    '#.####.ww.####.#',
    '#......ww......#',
    '#..............#',
    '################',
  ],
  exits: [
    { x: 14, y: 14, to: 'shelf', tx: 7, ty: 25, tf: NORTH, label: 'You wade back up the steps into the reeds.' },
  ],
  features: [
    { kind: 'event', x: 14, y: 14, id: 'chapel_in', once: true, text: 'The steps go down into a hand’s depth of standing water. Somewhere ahead it is dripping in a rhythm that is almost a bell.' },
    { kind: 'chest', x: 1, y: 13, id: 'ch_key', gold: 45, items: ['key_iron', 'rations', 'potion_heal'] },
    { kind: 'event', x: 11, y: 13, id: 'ch_camp', once: true, text: 'A survey camp, struck in a hurry: six bedrolls, six packs, six sets of Lantern grey. No bodies. The ash of the fire is still dry.' },
    { kind: 'sign', x: 4, y: 6, text: 'A Lantern notice board, the ink run: "...stone reads CUT, not failed. Do not send word to Harrow. We go down to the font."' },
    { kind: 'event', x: 6, y: 12, id: 'ch_crypt', once: true, text: 'The crypt. The name-plates have been chiselled off, every one, and the chisel marks are new.' },
    { kind: 'chest', x: 3, y: 11, id: 'ch_secret', gold: 120, items: ['longbow', 'potion_sp', 'potion_heal'] },
    { kind: 'chest', x: 12, y: 11, id: 'ch_locked', gold: 90, items: ['axe', 'shield'] },
    { kind: 'event', x: 7, y: 8, id: 'ch_nave', once: true, text: 'The nave. The water comes to your knees here and it is moving, though there is no current and no wind.' },
    { kind: 'event', x: 6, y: 4, id: 'ch_altar', once: true, text: 'The altar has been pulled down and something else set in its place: a ring of worked stone around a font, and the water in the font is lit from underneath.' },
    { kind: 'chest', x: 7, y: 2, id: 'ch_font', gold: 160, items: ['chain', 'potion_sp'] },
  ],
  encounters: [
    { id: 'c_lurk1', x: 3, y: 8, monsters: ['bog_lurker', 'bog_lurker'], aware: 4, respawn: 4320 },
    { id: 'c_drown1', x: 12, y: 8, monsters: ['drowned', 'drowned'], aware: 4, respawn: 5760 },
    { id: 'c_lurk3', x: 14, y: 8, monsters: ['bog_lurker', 'bog_lurker'], aware: 3, respawn: 4320 },
    { id: 'c_spider', x: 1, y: 10, monsters: ['spider', 'spider', 'spider'], aware: 4, respawn: 4320 },
    { id: 'c_nave', x: 7, y: 11, monsters: ['bog_lurker', 'bog_lurker', 'bog_lurker'], aware: 4, respawn: 5760 },
    { id: 'c_rats', x: 9, y: 13, monsters: ['rat', 'rat', 'rat', 'rat'], aware: 4, respawn: 4320 },
    { id: 'c_drown3', x: 4, y: 10, monsters: ['drowned', 'drowned'], aware: 3, roams: false },
    { id: 'c_skel', x: 11, y: 11, monsters: ['skeleton', 'skeleton', 'skeleton'], aware: 3, roams: false },
    { id: 'c_adept1', x: 3, y: 6, monsters: ['ashen_adept', 'ashen_adept'], aware: 5 },
    { id: 'c_adept2', x: 11, y: 6, monsters: ['ashen_adept', 'cultist', 'cultist'], aware: 5 },
    { id: 'c_drown2', x: 14, y: 10, monsters: ['drowned', 'drowned', 'drowned'], aware: 4, respawn: 5760 },
    { id: 'c_prior', x: 8, y: 4, monsters: ['hollow_prior', 'ashen_adept', 'ashen_adept'], aware: 2, roams: false },
  ],
};
