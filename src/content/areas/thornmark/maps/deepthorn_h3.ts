// The Deepthorn, box H3: its edge, the way in. Country, band 8-10: the elves' road south out of the
// Grove's hollow under the light woods along the Wyke, the Dowrdu in at the east edge and out at the
// south, its old ford where the road crosses, and east of it the first of the deep's oaks. The
// survey team's camp is past the sign, short of the first group. Cut from the atlas by
// tools/scaffold.ts; docs/areas/thornmark.md §4.2 is its brief.
import type { MapDef } from '../../../../game/map.ts';
import { NORTH, SOUTH } from '../../../../game/types.ts';
import { denBurnt } from '../../../../game/dens.ts';
import { TEAR_CLOSED } from './grove2.ts';

/** The spiders' nest burnt: its brood stops coming. */
const NEST_BURNT = denBurnt('deepthorn_h3', 'h3_nest');

export const DEEPTHORN_H3: MapDef = {
  id: 'deepthorn_h3',
  name: 'The Deepthorn',
  kind: 'outdoor',
  density: 'country',
  band: [8, 10],
  region: 'thornmark',
  start: { x: 8, y: 1, facing: SOUTH },
  rows: [
    'W~~_tttt=ttttttTTTTTTTTTTTTTTTTT',
    'W~~_tttt=ttttttttTTTTTTTTTTTTTTT',
    'W~~_tttt=ttttttttTTTTTTTTTTTTTTT',
    'W~~_tttt=tttttttttTTTTTTTTTTTTTT',
    'W~~_tttt=tttttttttTTTTTTTTTTTTTT',
    'W~~_tttt=tttttttttTTTTTTTTTTTTTT',
    'W~~_tttt=ttttttttTTTTTTTTTTTTTTT',
    'W~~_tttt=tttttttttTTTTTTTTTTTTTT',
    'WW~~_ttt=tttttttttTTTTTTTTTTTTTT',
    'WW~~_ttt=tttttttttTTTTTTTTTTTTTT',
    'WW~~_ttt====ttttttTTTTTTTTTTTTTT',
    'WWW~~_ttttt=ttttttTTTTTTTTTTTTTT',
    'WWWW~~_tttt=ttttttTTTTTTTTTTTTTT',
    'WWWWW~~__tt=tttttTTTTTTTTTTTTTTT',
    'WWWWWW~~~_t=tttttTTTTTTTTTTTTTT~',
    'WWWWWWW~~_t=tttttTTTTTTTTTTTTTT~',
    'WWWWWWWW~~_=tttttTTTTTTTTTTTTT~~',
    'WWWWWWWW~~_=tttttTTTTTTTTTTTT~~T',
    'WWWWWWWW~~t=tttttTTTTTTTTTTT~~~T',
    'WWWWWWW~~tt=tttttTTTTTTTTTT~~~TT',
    'WWWWWWWW~~t=tttTTTTTTTTTTT~~~TTT',
    'WWWWWWW~~tt=tttTTTTTTTTTTT~~TTTT',
    'WWWWWW~~ttt=tttTTTTTTTT,T~~TTTTT',
    'WWWWWWW~~tt=====================',
    'WWWWWWW~~t,ttTTTTTTTTTT~~~TTSTTT',
    'WWWWWWW~~,,,TTTTTTTTTT~~~TTT,TTT',
    'WWWWWWWW~~,,,TTTTTTTTT~~~TTT,TTT',
    'WWWWWWWW~~,,,,ttttttt~~~TTT,,,TT',
    'WWWWWWWWW~~,,,Tttttt~~~TTTTTTTTT',
    'WWWWWWWWWW~~,,,TTTTT~~~TTTTTTTTT',
    'WWWWWWWWWWW~~,,,TTTT~~TTTTTTTTTT',
    'WWWWWWWWWWWW~~,,,TT~~TTTTTTTTTTT',
  ],
  exits: [
    { x: 8, y: 0, to: 'thornmark', tx: 8, ty: 30, tf: NORTH },
  ],
  features: [
    // The way in, in the order the road meets it.
    { kind: 'sign', x: 8, y: 1, text: 'A sign reads: "The Deepthorn. The Elder\'s peace ends here. Keep to the path, and keep walking."' },
    { kind: 'shrine', x: 9, y: 1, id: 'h3_shrine', text: 'A shrine of piled stones where the elves\' road leaves the hollow, a green branch laid across it.', stat: 'personality', done: 'The branch on the shrine is green still.' },
    { kind: 'event', x: 5, y: 9, id: 'h3_wyke', once: true, text: 'Light woods, and the Wyke through the trunks. Across the water, low and grey, the Foreland\'s shore.' },
    { kind: 'camp', x: 7, y: 13, name: 'A camp on the shingle', text: 'A camp on the shingle, its fire-ring stacked ready. By night the Foreland\'s lights show across the water.' },
    { kind: 'event', x: 25, y: 23, id: 'h3_ford', once: true, text: 'An old ford, the road\'s stones worn to saucers under brown water. On the far bank a keeper\'s post, empty.' },
    { kind: 'event', x: 27, y: 23, id: 'h3_post', once: true, text: 'A toll-post with a bench and a hook for a lantern. The lantern is gone, and the ledger nailed to the post stops a month ago.' },
    { kind: 'event', x: 28, y: 23, id: 'h3_thorns', once: true, text: 'Young thorns close an old path off the road: one summer\'s growth, in a wood where nothing else is young.' },
    { kind: 'event', x: 29, y: 23, id: 'h3_deep', once: true, text: 'East of the river the woods end and the deep begins: oaks you could not put your arms halfway round, and no birdsong.' },
    { kind: 'cairn', x: 23, y: 22, id: 'h3_cairn', text: 'A cairn on the bank above the ford, one stone for each crossing the keeper saw safe.', gold: 60, items: ['potion_sp_great'] },
    // The secret: the ford-keeper's house, behind the thorns.
    { kind: 'event', x: 28, y: 27, id: 'h3_house', once: true, text: 'Roofless, and the hearth cold. Her strongbox is where she left it, under the bench, with a summer\'s tolls in it.' },
    { kind: 'chest', x: 29, y: 27, id: 'h3_strongbox', gold: 160, items: ['tower_shield+1'] },
    // The thorn spiders' nest in the brakes by the river (#88).
    { kind: 'den', x: 19, y: 27, id: 'h3_nest', name: 'A spiders\' nest', text: 'Webs like sailcloth between the alders, and things wrapped in them that were not all a spider\'s size.',
      breeds: ['thorn_spider'], keepers: 'h3_keepers', brood: ['h3_brood1', 'h3_brood2'],
      ask: 'The keepers are dead, and the webs are dry as paper. Burn the nest?', burn: 'Burn it.', leave: 'Leave it.',
      burnt: 'The webs go up in one breath, and the alders with them. In the ash, a traveller\'s pack, and what he carried.',
      ruin: 'Burnt alders, and the river running clear past them.', gold: 90, items: ['rune_dagger+2'] },
    // How Did He Know (#56's 14): the survey team's camp, and its orders in the fire-pit. Idony, who
    // asks for them, is at the Split Oak in Thornhold.
    { kind: 'event', x: 9, y: 3, id: 'h3_survey', once: true, text: 'Two tents cut open, and a fire-pit heaped with burnt paper. Nailed boot prints all round it: Wardens\'.' },
    { kind: 'event', x: 10, y: 4, id: 'h3_firepit', once: true, text: 'Under the ash, folded twice and burnt once: a paper with the Regent\'s seal, half of it gone to the flame.' },
    { kind: 'chest', x: 11, y: 4, id: 'h3_orders', gold: 0, items: ['survey_orders'] },
  ],
  secrets: [{ x: 28, y: 24, hint: 'h3_thorns' }],
  encounters: [
    // The gentlest first: dire wolves in the light woods, the nest's brood about it, rift hounds
    // strayed from the Grove on the shore, brambles across the road short of the ford, and east of
    // it, where the deep begins, the rootwalkers.
    { id: 'h3_wolves', x: 7, y: 11, monsters: ['dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf', 'dire_wolf'], aware: 5, respawn: 1440 },
    { id: 'h3_brood1', x: 15, y: 9, monsters: ['thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider'], aware: 5, respawn: 1440, until: NEST_BURNT },
    { id: 'h3_brood2', x: 14, y: 18, monsters: ['thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider'], aware: 5, respawn: 1440, until: NEST_BURNT },
    { id: 'h3_keepers', x: 18, y: 27, monsters: ['thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider', 'thorn_spider'], aware: 3, roams: false },
    { id: 'h3_hounds', x: 12, y: 27, monsters: ['rift_hound', 'rift_hound', 'rift_hound', 'rift_hound', 'rift_hound', 'rift_hound', 'rift_hound', 'rift_hound', 'rift_hound', 'rift_hound', 'rift_hound', 'rift_hound'], aware: 6, respawn: 2880, until: TEAR_CLOSED },
    { id: 'h3_brambles', x: 19, y: 23, monsters: ['bramble', 'bramble', 'bramble', 'bramble', 'bramble', 'bramble'], aware: 2, respawn: 2880 },
    { id: 'h3_rootwalkers', x: 30, y: 23, monsters: ['rootwalker', 'rootwalker', 'rootwalker', 'rootwalker'], aware: 3, respawn: 2880 },
  ],
};
