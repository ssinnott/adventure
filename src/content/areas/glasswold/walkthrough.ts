// The Glasswold's walkthrough. Its chapter, The Warning (#531), is played last (theWarning); first, the
// boxes in road order. The mesas (D10, #527), the Wold's way in: over E10's west edge at 0,6 onto the road,
// the Wold's own words said by level and nothing straight back; the road square to square along the great
// mesa's foot and up its west side to the north edge, where D9's road carries it on; the glassed round the
// great mesa in a line, all facing the scree under its north face, the last a Rider with his bow drawn, and
// round the small mesa all facing it; the Riders' cairn, the Rider on the hill who goes no nearer and her
// word of the garden, the Glass's glare past the dunes, the kill and the lions' lie, the camp in the hills
// and the sky-stone, the bones and the glass hare in the grass; the box's groups won at 26, the mesa fight
// among them; and the way up, the notch over the scree, found from the Rider's arrow: on top the nest, the
// hoard with Cinderport's shield and the stone's cure, the Eyrie's cold fire-ring and the Glass whole with
// the crown in it; the draught lifts a member's stone, and a temple asks 80 gold a level. Then the steppe
// (D9, #525), the area listed by its first map, out of AHEAD and PLANNED: walked onto up the road from the
// mesas and put down at its end on the south edge, the box's way in; the road square to square from the
// south edge at columns 22 and 23 north-west over the dunes' edge to the west edge at row 21, past which, for now, the
// world ends; the glass in the grass; the Riders' well where their track leaves the road, and their camp
// beside it; the track north past the tents seen from the middle and the cairn on the watch-mound to the
// north edge, toward Akordu; the herd and its herder, the old Rider and the first words of the day the
// sky opened; the kills, the lions' lie, the dunes' cairn, the Glass seen from the dunes and the walker's
// tracks across their edge; the box's groups won at 26; and the fallen walker in the long mound, found
// from the grass the herd will not graze. Akordu, the Riders' camp (D8, #526): up the Riders' track over
// the seam into the ring of tents under the mesa; a rest at the camp's fires; the eldest's story, told
// once; the trader's tent, its consumables, the stone's cure and the Riders' leather bought at list; the
// ride from the horse-lines to Cinderport's gate and back; the shrine, the wells, the horse that came
// back, the garden of glass and the camp's people, who put the side quests' questions (#532); the
// box's groups won at 26; and the
// Riders' hoard behind the dry well with no rope. The Scarp's edge (C8, #528): up the Scarp stair from
// the Saltings' notch, past the fall by the rope ladder and up the flights onto the lip, at 12, 25 and 26,
// the Wold's line said at the stair's head as each would hear it, and down again; the Rider's warning at
// the head, the runner on the last flight, who gives her orders to a company sent for them (#532), and
// the two Riders at the watch, words only; the watch's cairn,
// yurt and fire; the view down over the Saltings and the rest of the box seen; its groups won at 26;
// the Compact's last three drops in the cleft under the lip, found from a horse's prints; and over the
// east edge into Akordu's box, one land. The Wold's heart (B8, #529): over C8's west edge under the rim,
// nothing said; the hunters' fire, a rest, the eldest's word, words only, and the young Rider, there once
// a company will hunt with him (#532); Kushtash
// seen, the rim, the cairn and its draught, the well, the running horse and the hermit under the rim; the
// pride and the mesa fight won at 27 and the Grey Lion alone on his ground at 28, the hunter's saddlebags
// on the kill-ground; and the way up Kushtash, the stepped scree on its rim side found from the smoke off
// its top, the fire by night, the ledge, Aysu the scout at her fire, who says nothing of what she wants,
// and the view. The Glass's edge (B9, #530): over B8's south edge into the dunes, nothing said; the cairn
// at their head, the rim and the horse's prints; the watch's fire on the last grass, a rest, and the three
// Riders who keep the gap, words only; its groups won at 27, the two walkers at the gap last, after the
// gap is walked to without them: the stones and the Riders' word, the walker's tracks and the Glass seen
// from the last square, no exit; and the walker half-buried in the dune that does not shift, its cache
// and the glass with a light in it. Then the Ranger's third (#448), Oriel Fane's Map, played by a company
// of 27 to the teaching (`fanesMap`); #56's four side quests (#532), each at its level and every way
// it goes (`woldQuests`). Last the chapter, three ways in (`theWarning`).
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen, walkThrough, meetWho, playChapter, everyGoalWalked, goalFromBegun, quest } from '../../../../tools/walk.ts';
import type { Walk, Step } from '../../../../tools/walk.ts';
import { NORTH, EAST, SOUTH, WEST } from '../../../game/types.ts';
import { addCondition, hasCondition, lift, templePrice, xpForLevel, takePrestige, className } from '../../../game/party.ts';
import { offers, teach, barOf } from '../../../game/prestige.ts';
import { seekId } from '../../../game/seeking.ts';
import { questLog } from '../../../game/quests.ts';
import { VENTS } from '../ashfall/maps/firemount_g11.ts';
import { STAIR } from '../ashfall/maps/meridian_camp.ts';
import { STAIR2 } from '../ashfall/maps/meridian_camp2.ts';
import { ROPE } from '../ashfall/maps/meridian_camp3.ts';
import { SCOUT_ASKED, MAP_GIVEN, LION_HUNT, LION_LEFT, LION_BLOW, LION_TOLD, LION_TAKEN, LION_DOWN } from './maps/wold_b8.ts';
import { HORSE_ASKED, HORSE_BROKEN, HORSE_CARRIED, HORSE_WHOLE, GARDEN_CARRIED, GARDEN_BROUGHT, GARDEN_LIFTED, GARDEN_DRAUGHT } from './maps/wold_d8.ts';
import { ORDERS_CARRIED, ORDERS_SEALED, ORDERS_TOLD, ORDERS_BURNED } from './maps/wold_c8.ts';
import { QUESTS } from './quests.ts';
import { AREAS, AHEAD, ATLAS, MAP_DEFS, MONSTERS } from '../../index.ts';
import { PLANNED, CURVE } from '../../progression.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { restRefused, useShrine } from '../../../game/wilds.ts';
import { meet, heard, answer } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { buy, item } from '../../../game/items.ts';
import type { Feature } from '../../../game/map.ts';
import { take as ride } from '../../../game/passage.ts';
import { MINUTES_PER_DAY } from '../../../game/calendar.ts';
import { RIDERS_RIDE } from '../../crossings.ts';
import { CURES } from '../ashfall/items.ts';
import { STORY, ROAD_EAST } from './maps/wold_d8.ts';
import { CHAPTER } from './chapter.ts';
import { CHAPTER as WINDOW } from '../ashfall/chapter.ts';
import { LIT } from '../ashfall/maps/ember_stone.ts';
import { ROAD_WEST } from '../ashfall/maps/emberwaste_e10.ts';
import { WATCH } from './maps/wold_b9.ts';

export const walkthrough: Walkthrough = (ok) => {
  const w = newWalk(ok);
  const out = buildMaps()[OUTDOORS];
  w.level = 26;
  for (const m of w.party.members) m.level = 26;
  const D9 = MAP_DEFS.find((d) => d.id === 'wold_d9')!, d9 = out.zones.find((z) => z.id === 'wold_d9')!;
  const WOLD = ATLAS.zones.find((z) => z.id === 'wold')!;
  const key = (x: number, y: number): number => y * out.width + x;
  const inBox = (x: number, y: number): boolean => x >= d9.x && x < d9.x + d9.w && y >= d9.y && y < d9.y + d9.h;
  const spread = (x0: number, y0: number, along: (x: number, y: number) => boolean): Set<number> => {
    const seen = new Set([key(x0, y0)]), q = [[x0, y0]];
    for (let i = 0; i < q.length; i++) {
      const [x, y] = q[i];
      for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) { const k = key(x + dx, y + dy); if (!seen.has(k) && along(x + dx, y + dy)) { seen.add(k); q.push([x + dx, y + dy]); } }
    }
    return seen;
  };
  const beside = (x: number, y: number, set: Set<number>): boolean => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => set.has(key(d9.x + x + dx, d9.y + y + dy)));
  const ch = (x: number, y: number): string => out.at(d9.x + x, d9.y + y).ch;
  const feature = (id: string) => D9.features!.find((f) => 'id' in f && f.id === id)!;
  const person = (name: string): Person => D9.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;

  // The Wold listed by its first map, as Ashfall was by G10 (#511): an area of its own, out of AHEAD and
  // PLANNED, D9 on its zone's row at 104,254, core, at 26-27 under the Wold's own sky; the mesas, D10,
  // under it at 104,286, the zone's way in and first on its row (#527).
  const D10 = MAP_DEFS.find((d) => d.id === 'wold_d10')!, d10 = out.zones.find((z) => z.id === 'wold_d10')!;
  ok(AREAS.some((a) => a.id === 'glasswold') && !AHEAD.length && !(PLANNED as readonly string[]).includes('glasswold')
    && WOLD.maps?.slice(0, 2).map((m) => `${m.map} ${m.at.join(',')}`).join() === 'wold_d10 104,286,wold_d9 104,254' && d9.x === 104 && d9.y === 254 && d10.x === 104 && d10.y === 286
    && [D9, D10].every((d) => d.density === 'core' && d.band?.join('-') === '26-27' && d.region === 'glasswold'),
    'the Glasswold listed by its first map, the steppe, D9, laid at 104,254 on the Wold, and the mesas, D10, under it at 104,286, the zone\'s way in: core, band 26-27, under its own sky');

  // The mesas (D10, #527): over E10's west edge from its road at 0,6 onto D10's at 31,6, the box's way in,
  // where a company first comes onto the Wold's grass. At the floor its name and nothing more, one or two
  // under the Wold's harder words, three or more under its warning; straight back, nothing.
  const at10 = (x: number, y: number): number => key(d10.x + x, d10.y + y);
  const in10 = (x: number, y: number): boolean => x >= d10.x && x < d10.x + d10.w && y >= d10.y && y < d10.y + d10.h;
  const ch10 = (x: number, y: number): string => out.at(d10.x + x, d10.y + y).ch;
  const feature10 = (id: string) => D10.features!.find((f) => 'id' in f && f.id === id)!;
  const cross = (level: number, from: string, x: number, y: number, facing: 0 | 1 | 2 | 3): string[] => {
    for (const m of w.party.members) m.level = level;
    w.world.travel(from, x, y, facing);
    const r = w.world.move('forward');
    return r.kind === 'moved' ? r.messages : [r.kind];
  };
  const low = cross(23, 'emberwaste_e10', 0, 6, WEST), two = cross(24, 'emberwaste_e10', 0, 6, WEST), one = cross(25, 'emberwaste_e10', 0, 6, WEST), due = cross(26, 'emberwaste_e10', 0, 6, WEST);
  ok(w.world.zone?.id === 'wold_d10' && w.world.state.x === d10.x + 31 && w.world.state.y === d10.y + 6 && D10.start.x === 31 && D10.start.y === 6 && D10.start.facing === WEST,
    'over E10\'s west edge from its road at 0,6 onto D10\'s at 31,6, walked, the box\'s way in and the Wold\'s');
  ok(due.join(' / ') === 'The Wold.', `at 26, the Wold named, no more (${due.join(' / ')})`);
  ok(one.join(' / ') === `The Wold. ${WOLD.crossing?.harder}` && two.join(' / ') === one.join(' / '), `at 25 and 24, the Wold's harder words (${one.join(' / ')})`);
  ok(low.join(' / ') === `The Wold. ${WOLD.crossing?.warning}`, `at 23, its warning, and the way back open (${low.join(' / ')})`);
  const back = cross(26, 'wold_d10', 31, 6, EAST);
  ok(!back.length && w.world.zone?.id === 'emberwaste_e10', `straight back onto E10, nothing more (${back.join(' / ') || 'nothing'})`);
  for (const m of w.party.members) m.level = 26;

  // The road square to square from the east edge along the great mesa's foot and north up its west side to
  // the north edge at 22 and 23, where D9's road carries it on; past the west and south edges, C10 and D11,
  // the Glass's, the world ends.
  const road10 = spread(d10.x + 31, d10.y + 6, (x, y) => in10(x, y) && out.at(x, y).ch === '=');
  const laid10 = D10.rows.join('').split('').filter((c) => c === '=').length;
  ok(road10.size === laid10 && road10.has(at10(22, 0)) && road10.has(at10(23, 0)) && ch(22, 31) === '=' && ch(23, 31) === '='
    && [...Array(32).keys()].every((i) => out.passable(d10.x - 1, d10.y + i) !== 'ok' && out.passable(d10.x + i, d10.y + 32) !== 'ok'),
    `the road runs square to square, all ${laid10} of its squares, from the east edge at 31,6 to the north edge at 22 and 23, where D9's road goes on; past C10 and D11 the world ends`);
  see(w, 'wold_d10:d10_mesa_seen');

  // The glassed round the great mesa: four in a line out from the scree under its north face, each facing
  // it, north-east, the last and nearest a Rider with his bow still drawn; round the small mesa on the west
  // edge three more, all facing it, west.
  const greatIds = ['d10_glassed', 'd10_glassed_woman', 'd10_glassed_horse', 'd10_glassed_rider'], smallIds = ['d10_glassed_boy', 'd10_glassed_dogs', 'd10_glassed_crone'];
  const great = greatIds.map(feature10), small = smallIds.map(feature10);
  const scree = [24, 25, 26].every((x) => ch10(x, 0) === '^' && out.at(d10.x + x, d10.y - 1).ch === 'r') && ch10(26, 1) === 'S';
  ok(scree && great.every((f, i) => f.kind === 'event' && f.x + f.y === 25 && f.x === 15 + 2 * i) && great.slice(0, 3).every((f) => f.kind === 'event' && f.text.includes('north-east'))
    && great[3].kind === 'event' && great[3].text.includes('bow still drawn') && great[3].text.includes('scree'),
    'round the great mesa the glassed stand in a line out from the scree under its north face, all facing north-east, the last a Rider with his bow still drawn');
  ok(small.every((f) => f.kind === 'event' && f.x === 6 && D10.rows[f.y].slice(0, f.x).includes('r') && f.text.includes('west')), 'round the small mesa on the west edge three more, all facing it, west');
  for (const id of [...greatIds, ...smallIds]) see(w, `wold_d10:${id}`);

  // The Riders' cairn, its skull's eyes on the ground; the Rider on the hill who watches the mesas and goes
  // no nearer, with her word of the garden at Akordu (#56's 55, #526); the Glass's glare past the dunes.
  const cairn10 = feature10('d10_cairn');
  ok(cairn10.kind === 'cairn' && cairn10.gold > 0 && cairn10.items.includes('elixir'), 'a Riders\' cairn in the north, gold and an elixir in it');
  const watcher = D10.features!.find((f) => f.kind === 'npc' && f.name === 'A Rider on the hill') as Person;
  ok(ch10(watcher.x, watcher.y) === '^' && !watcher.flag && !watcher.quest, 'a Rider on a hill over the mesas, words only');
  w.world.travel('wold_d10', watcher.x, watcher.y);
  const word = meet(watcher, w.party, heard(w.world, watcher)).text;
  ok(word.includes('no nearer') && word.includes('garden at Akordu'), 'she goes no nearer, and the ones they carried home stand in the garden at Akordu');
  const glare = feature10('d10_glare');
  ok(glare.x === 1 && ch10(glare.x, glare.y) === 'u' && out.passable(d10.x - 1, d10.y + glare.y) !== 'ok', 'at the dunes\' edge on the west seam the Glass\'s glare beyond, and past it nothing built');
  for (const id of ['d10_glare', 'd10_kill', 'd10_lie', 'd10_bones', 'd10_hare']) see(w, `wold_d10:${id}`);

  // The hills in the south: the Riders' camp out of sight of the mesas, and their sky-stone on the rise.
  const camp10 = D10.features!.filter((f) => f.kind === 'camp');
  ok(camp10.length === 1 && ch10(camp10[0].x, camp10[0].y) === '^', 'a Riders\' camp in the hills');
  w.world.travel('wold_d10', camp10[0].x, camp10[0].y);
  ok(restRefused(w.world) === '', 'and a company may rest at it');
  const stone10 = feature10('d10_shrine');
  w.world.travel('wold_d10', stone10.x, stone10.y);
  const kneelAt = w.world.featureHere();
  ok(kneelAt?.kind === 'shrine' && stone10.kind === 'shrine' && ch10(stone10.x, stone10.y) === '^' && useShrine(w.world, w.party, kneelAt)[0] === stone10.text, 'the company kneels at the Riders\' sky-stone on the rise');

  // The groups, each won at 26: the near pride at its kill with the vultures down on it and the south pride
  // in the grass, nearest the way in; the mesa fight in the scree under the great mesa's north face, three
  // lions and the basilisk on the lip behind them; the glass scorpions at the dunes' edge; and a basilisk
  // alone in the small mesa's shade, at 27.
  const group10 = (id: string) => D10.encounters!.find((g) => g.id === id)!;
  const [pride10, south10, mesa10, scorp10, lone10] = ['d10_pride', 'd10_pride_south', 'd10_mesa', 'd10_scorpions', 'd10_basilisk'].map(group10);
  const lions = (g: typeof mesa10): number => g.monsters.filter((m) => m === 'wold_lion').length;
  ok(D10.encounters!.length === 5 && lions(pride10) === 4 && pride10.monsters.includes('vulture') && lions(south10) === 4 && south10.monsters.length === 4
    && lions(mesa10) === 3 && mesa10.monsters.filter((m) => m === 'basilisk').length === 1 && mesa10.monsters.length === 4 && ch10(mesa10.x, mesa10.y) === '^' && mesa10.y === 0
    && scorp10.monsters.every((m) => m === 'glass_scorpion') && ch10(scorp10.x - 1, scorp10.y) === 'u'
    && lone10.monsters.join() === 'basilisk' && ch10(lone10.x - 1, lone10.y) === 'r' && MONSTERS.basilisk.level === 27 && MONSTERS.basilisk.inflict?.cond === 'stoned'
    && D10.encounters!.every((g) => !!g.respawn),
    'two prides in the grass by the way in, the mesa fight in the scree, three lions with a basilisk behind them, glass scorpions at the dunes\' edge and a basilisk alone under the small mesa, at 27');
  for (const g of D10.encounters!) fight(w, `wold_d10:${g.id}`);

  // The secret: the way up the great mesa, a notch in its north face over the scree, where every glassed
  // figure round it looks and the Rider's arrow points. Walked, waded, climbed or floated, the top is never
  // reached but through the notch.
  const [notch] = D10.secrets!;
  ok(notch.hint === 'd10_glassed_rider' && notch.x === 26 && notch.y === 1, 'the Rider\'s arrow is the notch\'s hint');
  const top = spread(d10.x + notch.x, d10.y, (x, y) => !(x === d10.x + notch.x && y === d10.y + notch.y) && in10(x, y) && out.passable(x, y, { swim: true, climb: true, float: true }) === 'ok');
  ok(top.size > 900 && !top.has(at10(notch.x, notch.y + 1)) && !top.has(at10(28, 3)),
    `the great mesa's top is shut but for the notch: none of D10's ${top.size} squares walked, waded, climbed or floated reaches it`);
  w.world.travel('wold_d10', notch.x, 0, SOUTH);
  let up = false;
  for (let i = 0; i < 20 && !up; i++) up = w.world.search();
  const onto = up ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(up && onto.every((r) => r.kind === 'moved') && w.world.used('d10_nest'), 'searched in the scree where the arrow points, a notch, and up it the nest among the glassed bones');
  listen(w);
  const hoard = feature10('d10_hoard');
  ok(hoard.kind === 'chest' && hoard.gold > 0 && hoard.items.join() === 'basalt_shield+2,quickening' && item('basalt_shield+2').slot === 'shield' && item('basalt_shield+2').plus === 2
    && item('basalt_shield+2').price < 6000 && item('quickening').use?.cure?.includes('stoned') === true,
    'beside it the hoard the glassed carried: gold, Cinderport\'s Basalt Shield with a plus of 2, and a Quickening Draught');
  const ring = feature10('d10_ring'), view = feature10('d10_view');
  ok(ring.kind === 'event' && d10.x + ring.x === 132 && d10.y + ring.y === 289 && top.size > 0 && view.kind === 'event' && view.text.includes('Glass') && view.text.includes('crown')
    && !/hull|ship|orbit|voyage/i.test(view.text),
    'on the top the Eyrie\'s cold fire-ring at 132,289, and the Glass whole with a dark crown standing up in it');
  see(w, 'wold_d10:d10_ring');
  see(w, 'wold_d10:d10_view');

  // Stone, first spent here (#546): the draught from the hoard lifts it where a member stands glassed, and
  // any temple, Cinderport's the nearest, lifts it for 80 gold a level.
  const glassed = structuredClone(w.party.members[0]);
  addCondition(glassed, 'stoned');
  const price = templePrice(glassed);
  ok(lift(glassed, item('quickening').use!.cure!) && !hasCondition(glassed, 'stoned') && price === 80 * 26,
    `the draught lifts a member's stone, and a temple asks ${price} gold for one of 26`);

  // The steppe (D9, #525), walked onto up the road from the mesas: the way in on its south edge, where D10's
  // road comes on. The road runs square to square from there north-west over the dunes' edge to the west
  // edge at 0,21, toward the Riders' gap; past C9, for now, the world ends.
  const onward = cross(26, 'wold_d10', 22, 0, NORTH);
  ok(w.world.zone?.id === 'wold_d9' && w.world.state.x === d9.x + 22 && w.world.state.y === d9.y + 31 && !onward.length, 'up the road from D10\'s 22,0 onto D9\'s 22,31, one land, nothing said');
  w.world.travel('wold_d9', D9.start.x, D9.start.y, NORTH);
  ok(w.world.zone?.id === 'wold_d9' && D9.start.x === 22 && D9.start.y === 31 && ch(22, 31) === '=' && ch(23, 31) === '=',
    'put down on the road at the south edge, 22,31, the box\'s way in');
  const road = spread(d9.x + 22, d9.y + 31, (x, y) => inBox(x, y) && out.at(x, y).ch === '=');
  const laid = D9.rows.join('').split('').filter((c) => c === '=').length;
  ok(road.size === laid && road.has(key(d9.x, d9.y + 21)) && out.passable(d9.x - 1, d9.y + 21) !== 'ok' && out.at(d9.x + 22, d9.y + 32).ch === '=',
    `the road runs square to square, all ${laid} of its squares, from the south edge at 22 and 23, where D10's road comes on, to the west edge at 0,21, past which, for now, the world ends`);
  const glass = feature('d9_glass');
  ok(road.has(key(d9.x + glass.x, d9.y + glass.y)), 'on the road in, the glass in the grass');
  see(w, 'wold_d9:d9_glass');
  ok(w.world.used('d9_glass'), 'the glass in the grass seen, the chapter\'s to key on (#531)');

  // The Riders' well where their track leaves the road, their camp beside it; the track north past the
  // tents seen from the middle and the cairn on the watch-mound, to the north edge at 16,0, toward Akordu.
  const track = spread(d9.x + 16, d9.y, (x, y) => inBox(x, y) && out.at(x, y).ch === ':');
  const well = feature('d9_well'), camps = D9.features!.filter((f) => f.kind === 'camp');
  ok(track.has(key(d9.x + 15, d9.y + 26)) && beside(15, 26, road) && beside(well.x, well.y, track) && well.kind === 'fountain'
    && camps.length === 1 && Math.abs(camps[0].x - well.x) + Math.abs(camps[0].y - well.y) === 2,
    `the Riders' track, ${track.size} squares, runs from the road north to the north edge at 16,0, their well beside it and their camp by the well`);
  w.world.travel('wold_d9', well.x, well.y);
  const here = w.world.featureHere();
  ok(here?.kind === 'fountain' && well.kind === 'fountain' && useShrine(w.world, w.party, here)[0] === well.text, 'the company drinks at the Riders\' well');
  w.world.travel('wold_d9', camps[0].x, camps[0].y);
  ok(restRefused(w.world) === '', 'and a company may rest at the camp');
  const tents = feature('d9_tents');
  ok(track.has(key(d9.x + tents.x, d9.y + tents.y)) && Math.abs(tents.x - 16) <= 2 && Math.abs(tents.y - 16) <= 2 && tents.kind === 'event' && tents.text.includes('north'),
    'from the box\'s middle, on the track, the white tents seen to the north');
  see(w, 'wold_d9:d9_tents');
  const cairn = feature('d9_cairn');
  ok(cairn.kind === 'cairn' && ch(cairn.x, cairn.y) === '^' && beside(cairn.x, cairn.y, track) && cairn.gold > 0, 'a Riders\' cairn on the watch-mound by the track');

  // The herd under a Rider, and his word of the one patch they will not graze; the old Rider, too old to
  // ride, with the first words of the day the sky opened, and the rest left to the eldest at Akordu.
  see(w, 'wold_d9:d9_herd');
  const herder = person('A herder'), old = person('An old Rider');
  w.world.travel('wold_d9', herder.x, herder.y);
  const rumour = meet(herder, w.party, heard(w.world, herder)).text;
  ok(rumour.includes('one patch') && rumour.includes('lions go round'), 'the herder: the herd grazes all but one patch, by the long mound, and the lions go round it');
  w.world.travel('wold_d9', old.x, old.y);
  const first = meet(old, w.party, heard(w.world, old)).text;
  ok(first.includes('the sky opened') && first.includes('Akordu'), 'the old Rider has the first words of the day the sky opened, and leaves the rest to the eldest at Akordu');

  // The prides' kills and the lions' lie; the dunes' edge: the horse that came back, seen only (#532 gives
  // its quest), the cairn where the grass gives out, the Glass seen from the dunes, and the glass walker's
  // tracks across their edge.
  for (const id of ['d9_kill', 'd9_bones', 'd9_lie', 'd9_horse', 'd9_glass_seen', 'd9_tracks']) see(w, `wold_d9:${id}`);
  const dunes = new Set(D9.rows.flatMap((r, y) => [...r].flatMap((c, x) => (c === 'u' ? [key(d9.x + x, d9.y + y)] : []))));
  const edge = feature('d9_edge_cairn'), seen = feature('d9_glass_seen'), tracks = feature('d9_tracks'), horse = feature('d9_horse');
  ok(edge.kind === 'cairn' && edge.gold > 0 && beside(edge.x, edge.y, dunes) && dunes.has(key(d9.x + seen.x, d9.y + seen.y)) && beside(tracks.x, tracks.y, dunes)
    && horse.kind === 'event' && beside(horse.x, horse.y, dunes) && !horse.sets && !D9.features!.some((f) => f.kind === 'npc' && (f.quest || f.flag)),
    'at the dunes\' edge the horse that came back, seen and no more, a cairn where the grass gives out, the Glass seen from the dunes, and tracks across their edge');

  // The groups, each won at 26: the near pride at its kill with the vultures down on it, the glass
  // scorpions at the dunes' edge, the glass walker alone at the far south-west, the box's hardest at 27,
  // and the north pride by the track with its vultures.
  const group = (id: string) => D9.encounters!.find((g) => g.id === id)!;
  const [near, scorpions, walker, north] = ['d9_pride', 'd9_scorpions', 'd9_walker', 'd9_pride_north'].map(group);
  const pride = (g: typeof near): boolean => g.monsters.filter((m) => m === 'wold_lion').length >= 3 && g.monsters.filter((m) => m === 'wold_lion').length <= 4 && g.monsters.includes('vulture');
  ok(D9.encounters!.length === 4 && pride(near) && pride(north) && scorpions.monsters.every((m) => m === 'glass_scorpion') && beside(scorpions.x, scorpions.y, dunes)
    && walker.monsters.join() === 'glass_walker' && dunes.has(key(d9.x + walker.x, d9.y + walker.y)) && walker.x <= 2 && walker.y >= 29 && MONSTERS.glass_walker.level === 27
    && D9.encounters!.every((g) => !!g.respawn),
    'two prides of lions with the vultures down on their kills, the glass scorpions at the dunes\' edge and a glass walker alone at the far south-west, at 27');
  for (const g of D9.encounters!) fight(w, `wold_d9:${g.id}`);

  // The secret: the long mound where the herd will not graze and the lions will not cross, searched where
  // the grass stands long; under the turf a walker fallen long ago, its chest a hollow. Walked, waded,
  // climbed or floated, the hollow is never reached but through its mouth.
  const [mound] = D9.secrets!;
  ok(mound.hint === 'd9_ungrazed' && feature('d9_ungrazed').x === mound.x + 1 && feature('d9_ungrazed').y === mound.y, 'the grass that stands long lies at the long mound\'s mouth');
  const shut = spread(d9.x + mound.x + 1, d9.y + mound.y, (x, y) => !(x === d9.x + mound.x && y === d9.y + mound.y) && inBox(x, y) && out.passable(x, y, { swim: true, climb: true, float: true }) === 'ok');
  ok(shut.size > 900 && !shut.has(key(d9.x + mound.x - 1, d9.y + mound.y)) && !shut.has(key(d9.x + mound.x - 2, d9.y + mound.y)),
    `the long mound is shut but for its mouth: none of D9's ${shut.size} squares walked, waded, climbed or floated reaches its hollow`);
  see(w, 'wold_d9:d9_ungrazed');
  w.world.travel('wold_d9', mound.x + 1, mound.y, WEST);
  let found = false;
  for (let i = 0; i < 20 && !found; i++) found = w.world.search();
  const into = found ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(found && into.every((r) => r.kind === 'moved') && w.world.used('d9_fallen'), 'searched where the grass stands long, the turf comes away, and under it a man of green bronze, his chest open');
  listen(w);
  const hollow = feature('d9_hollow');
  ok(hollow.kind === 'chest' && hollow.gold > 0 && hollow.items.includes('elixir') && hollow.items.includes('etched_glass') && hollow.x === mound.x - 2 && hollow.y === mound.y
    && item('etched_glass').slot === 'none' && !item('etched_glass').price,
    'in the hollow of his chest gold, an elixir and a piece of etched glass, which no shop buys');

  // Akordu, the Riders' camp (D8, #526): on the Wold's row at 104,222, north of the steppe, core, at
  // 26-27, the camp on the world map no longer planned.
  const D8 = MAP_DEFS.find((d) => d.id === 'wold_d8')!, d8 = out.zones.find((z) => z.id === 'wold_d8')!;
  const ch8 = (x: number, y: number): string => out.at(d8.x + x, d8.y + y).ch;
  const feature8 = (id: string) => D8.features!.find((f) => 'id' in f && f.id === id)!;
  const person8 = (name: string): Person => D8.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
  const says8 = (name: string): string => { const p = person8(name); w.world.travel('wold_d8', p.x, p.y); return meet(p, w.party, heard(w.world, p)).text; };
  ok(!!WOLD.maps?.some((m) => `${m.map} ${m.at.join(',')}` === 'wold_d8 104,222') && d8.x === 104 && d8.y === 222
    && D8.density === 'core' && D8.band?.join('-') === '26-27' && D8.region === 'glasswold' && ATLAS.sites.some((x) => x.name === 'Akordu' && !x.planned && x.at.join() === '120,250'),
    'Akordu\'s box, D8, laid at 104,222 north of the steppe on the Wold: core, band 26-27, and the camp on the world map built');

  // Up the Riders' track from D9's 16,0 over the seam onto D8's 16,31, the box's way in, and on into the
  // ring of tents under the mesa.
  w.world.travel('wold_d9', 16, 0, NORTH);
  const up8 = w.world.move('forward');
  ok(up8.kind === 'moved' && w.world.zone?.id === 'wold_d8' && w.world.state.x === d8.x + 16 && w.world.state.y === d8.y + 31 && ch8(16, 31) === ':' && D8.start.x === 16 && D8.start.y === 31,
    'up the Riders\' track from D9\'s 16,0 over the seam onto D8\'s 16,31, the box\'s way in, the track going on into the camp');
  listen(w);
  see(w, 'wold_d8:d8_akordu');
  const camp = D8.features!.find((f) => f.kind === 'camp')!;
  const felt = D8.rows.join('').split('').filter((c) => c === 'B' || c === 'D').length;
  ok(w.world.used('d8_akordu') && camp.name === 'Akordu' && Math.abs(camp.x - 16) + Math.abs(camp.y - 28) <= 2 && felt >= 8 && ch8(camp.x, camp.y) === ':',
    `the white tents of Akordu in their ring under the mesa, ${felt} squares of felt, the camp's fires in the middle on trodden ground`);
  w.world.travel('wold_d8', camp.x, camp.y);
  ok(restRefused(w.world) === '', 'and a company may rest at the fires, the Wold\'s rest');

  // The eldest at her fire tells the oldest story on that side of the sea, once (the chapter's step,
  // #531); after it she says there is more, for those who have earned it (#56's 53, #532's).
  const eldest = person8('The eldest');
  w.world.travel('wold_d8', eldest.x, eldest.y);
  const story = meet(eldest, w.party, heard(w.world, eldest)).text, after = meet(eldest, w.party, heard(w.world, eldest)).text;
  ok(story.includes('the sky opened') && story.includes('pillar of fire') && story.includes('Remember what that cost') && !!w.party.flags[STORY],
    'at her fire the eldest tells the oldest story: the day the sky opened, the pillar of fire, the fall and the glass, and what it cost');
  ok(!after.includes('pillar of fire') && after.includes('earned') && !/hull|ship|orbit|voyage|custodian/i.test(story + after), 'she tells it once, names nothing of what it was, and says the rest is for those who have earned it');

  // The trader's tent, the camp's one business, a door into its room: the band's consumables, the stone's
  // cure (#546) and the Riders' own leather, at list price, nothing of steel; and nothing else is sold or
  // taught at Akordu (#443, call 7).
  const trader = D8.features!.find((f): f is Extract<Feature, { kind: 'shop' }> => f.kind === 'shop')!;
  const wares = trader.stock.map(item);
  ok(D8.features!.filter((f) => 'interior' in f && f.interior).length === 1 && trader.interior === 'akordu_trader' && ch8(trader.x, trader.y) === 'D' && !trader.prices
    && CURES.every((id) => trader.stock.includes(id)) && wares.every((d) => d.slot === 'none' || d.id === 'leather_coat') && trader.stock.includes('leather_coat'),
    `the trader's tent sells the band's consumables, the stone's cure and the Riders' leather at list price, and nothing of steel (${wares.map((d) => d.name).join(', ')})`);
  ok(!D8.features!.some((f) => ['inn', 'temple', 'guild', 'trainer'].includes(f.kind) || (f.kind === 'npc' && (f.teaches || f.skill || f.hall || f.quest || f.interior))),
    'the camp sells and teaches nothing else, and takes nothing in by hand; its questions are the side quests\' (#532, `woldQuests`)');
  w.party.gold += 5000;
  const purse = w.party.gold;
  ok(!!buy(w.party, trader, 'quickening') && !!buy(w.party, trader, 'leather_coat') && purse - w.party.gold === item('quickening').price + item('leather_coat').price,
    `the Quickening Draught bought for ${item('quickening').price} gold and a Leather Coat for ${item('leather_coat').price}`);

  // The Rider at the horse-lines sells the ride to Cinderport's gate, a fare and a day, open from the
  // start; the Rider by Cinderport's gate sells it back, and it sets a company down beside him here.
  const rider = person8('A Rider at the lines'), [east, ...more] = rider.passage ?? [];
  const lines = RIDERS_RIDE.ends.find((e) => e.at === 'wold')!, gate = RIDERS_RIDE.ends.find((e) => e.at === 'cinderport')!.landing!;
  ok(!!east && !more.length && east.to === 'cinderport' && east.x === gate.x && east.y === gate.y && east.fare === RIDERS_RIDE.fare && east.days === RIDERS_RIDE.days && east.by === 'horse'
    && lines.landing?.map === 'wold_d8' && Math.abs(lines.landing.x - rider.x) + Math.abs(lines.landing.y - rider.y) === 1 && !lines.owed,
    `at the horse-lines a Rider sells the ride to Cinderport's gate, ${east?.fare} gold and ${east?.days} day, and the ride from there sets a company down beside him`);
  const r = newWalk(ok);
  for (const m of r.party.members) m.level = 26;
  r.world.travel('wold_d8', rider.x, rider.y);
  r.world.state.minutes = Math.floor(r.world.state.minutes / MINUTES_PER_DAY) * MINUTES_PER_DAY + 9 * 60;
  r.party.gold = RIDERS_RIDE.fare;
  const day = r.world.day, gone = ride(east, r.world, r.party);
  ok(gone.taken && r.party.gold === 0 && r.world.state.mapId === 'cinderport' && r.world.state.x === gate.x && r.world.state.y === gate.y && r.world.day === day + 1 && r.world.hour === RIDERS_RIDE.arrives,
    `the ride leaves at 14:00 and sets the company down inside Cinderport's gate the next morning (${gone.lines.join(' ')})`);
  const port = MAP_DEFS.find((d) => d.id === 'cinderport')!.features!.find((f): f is Person => f.kind === 'npc' && f.name === 'A Rider by the gate')!;
  const [west] = port.passage ?? [];
  ok(!!west && west.to === 'wold_d8' && west.x === lines.landing?.x && west.y === lines.landing.y && west.fare === RIDERS_RIDE.fare, 'the Rider by Cinderport\'s gate sells it back to Akordu\'s horse-lines');
  r.world.travel('cinderport', port.x, port.y);
  r.party.gold = RIDERS_RIDE.fare;
  const back8 = ride(west, r.world, r.party);
  ok(back8.taken && r.party.gold === 0 && r.world.zone?.id === 'wold_d8' && r.world.state.x === d8.x + lines.landing!.x && r.world.state.y === d8.y + lines.landing!.y && back8.lines.join() === lines.label,
    `and back, down among the white tents at the horse-lines (${back8.lines.join(' ')})`);

  // Under the mesa its watch-fire seen, a well and the Riders' shrine; the horse-lines and their well; the
  // horse that came back tethered apart, seen and no more (#56's 51, #532's), and the Rider who would break
  // what sits it; the young Rider who wants the last blow (#56's 53); the garden of glass at the camp's
  // east edge, its figures facing south-west, the vultures over it and the mother among them (#56's 55).
  const shrine = feature8('d8_shrine');
  w.world.travel('wold_d8', shrine.x, shrine.y);
  const knelt = w.world.featureHere();
  ok(knelt?.kind === 'shrine' && shrine.kind === 'shrine' && useShrine(w.world, w.party, knelt)[0] === shrine.text && ch8(shrine.x - 1, shrine.y) === 'r', 'the company kneels at the Riders\' post of tails under the mesa');
  for (const id of ['d8_watch', 'd8_lines', 'd8_horse', 'd8_garden', 'd8_vultures', 'd8_figure', 'd8_spoor', 'd8_graves', 'd8_shade', 'd8_broken', 'd8_herd', 'd8_poles', 'd8_hill', 'd8_foal', 'd8_skyline']) see(w, `wold_d8:${id}`);
  const wells = D8.features!.filter((f) => f.kind === 'well'), tethered = feature8('d8_horse'), figures = D8.rows.join('').split('').filter((c) => c === 'c').length;
  ok(wells.length === 2 && tethered.kind === 'event' && !tethered.sets && figures >= 5 && D8.rows.every((row) => [...row].every((c, x) => c !== 'c' || x > camp.x + 6)),
    `the wells, the horse that came back tethered apart, and ${figures} figures of glass at the camp's east edge`);
  const boy = says8('A young Rider'), hammer = says8('A Rider with a hammer'), mother = says8('A woman among the figures');
  ok(boy.includes('Grey Lion') && boy.includes('last blow') && hammer.includes('break') && mother.includes('basilisk')
    && ['A young Rider', 'A Rider with a hammer', 'A woman among the figures'].every((n) => !!person8(n).choice),
    'the young Rider wants the last blow at the Grey Lion, a Rider waits to break what sits the horse, and the mother\'s son went to look at the basilisk: each puts a side quest\'s question (#532)');

  // The groups, none inside the camp, each won at 26: the pride that comes at the horses by night, the
  // glass scorpions in the broken ground under the mesa's east face, and the basilisk alone in its shade
  // on the north side, the box's hardest at 27.
  const g8 = (id: string) => D8.encounters!.find((g) => g.id === id)!;
  const [lions8, scorpions8, basilisk8] = ['d8_pride', 'd8_scorpions', 'd8_basilisk'].map(g8);
  ok(D8.encounters!.length === 3 && lions8.monsters.every((m) => m === 'wold_lion') && lions8.monsters.length <= 4 && JSON.stringify(lions8.when) === '{"hours":"night"}'
    && scorpions8.monsters.every((m) => m === 'glass_scorpion') && basilisk8.monsters.join() === 'basilisk' && MONSTERS.basilisk.level === 27 && ch8(basilisk8.x, basilisk8.y + 1) === 'r'
    && D8.encounters!.every((g) => !!g.respawn && Math.abs(g.x - camp.x) + Math.abs(g.y - camp.y) >= 12),
    'none inside the camp: the lions by night, the scorpions under the mesa and the basilisk alone in its shade, at 27');
  for (const g of D8.encounters!) fight(w, `wold_d8:${g.id}`);

  // The secret: the dry well with no rope against the mesa's foot, searched where its windlass stands
  // bare; down it the shaft is walled across, and behind the wall the Riders' hoard in a hollow of the
  // rock. Walked, waded, climbed or floated, the hollow is never reached but down the well.
  const [dry] = D8.secrets!;
  ok(dry.hint === 'd8_ropeless' && feature8('d8_ropeless').x === dry.x && feature8('d8_ropeless').y === dry.y + 1, 'the well with no rope stands at the dry well\'s mouth');
  const inBox8 = (x: number, y: number): boolean => x >= d8.x && x < d8.x + d8.w && y >= d8.y && y < d8.y + d8.h;
  const walled = spread(d8.x + dry.x, d8.y + dry.y + 1, (x, y) => !(x === d8.x + dry.x && y === d8.y + dry.y) && inBox8(x, y) && out.passable(x, y, { swim: true, climb: true, float: true }) === 'ok');
  ok(walled.size > 800 && !walled.has(key(d8.x + dry.x, d8.y + dry.y - 1)) && !walled.has(key(d8.x + dry.x - 1, d8.y + dry.y - 1)),
    `the hollow is shut but for the dry well: none of D8's ${walled.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'wold_d8:d8_ropeless');
  w.world.travel('wold_d8', dry.x, dry.y + 1, NORTH);
  let dug = false;
  for (let i = 0; i < 20 && !dug; i++) dug = w.world.search();
  const down = dug ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(dug && down.every((m) => m.kind === 'moved') && w.world.used('d8_hollow'), 'searched where the windlass stands bare, the dry well goes down to a walled shaft, and behind the wall a hollow in the rock, its things laid in rows');
  listen(w);
  const hoard8 = feature8('d8_hoard');
  ok(hoard8.kind === 'chest' && hoard8.gold > 0 && hoard8.items.join() === 'leather_coat+2' && hoard8.x === dry.x - 1 && hoard8.y === dry.y - 1
    && item('leather_coat+2').ac === (item('leather_coat').ac ?? 0) + 2 && item('leather_coat+2').price <= CURVE.glasswold.price - 400,
    `in the hoard ${hoard8.kind === 'chest' ? hoard8.gold : 0} gold and a Leather Coat +2, the Riders' own make, inside the band's window`);

  // The Scarp's edge (C8, #528): on the Wold's row at 72,222, west of Akordu's box, country, at 26-27.
  const C8 = MAP_DEFS.find((d) => d.id === 'wold_c8')!, c8 = out.zones.find((z) => z.id === 'wold_c8')!;
  const C7 = MAP_DEFS.find((d) => d.id === 'saltings_c7')!, c7 = out.zones.find((z) => z.id === 'saltings_c7')!;
  const chC8 = (x: number, y: number): string => out.at(c8.x + x, c8.y + y).ch;
  const featureC8 = (id: string) => C8.features!.find((f) => 'id' in f && f.id === id)!;
  const personC8 = (name: string): Person => C8.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
  ok(!!WOLD.maps?.some((m) => `${m.map} ${m.at.join(',')}` === 'wold_c8 72,222') && c8.x === 72 && c8.y === 222 && c8.x + c8.w === d8.x && c7.x === c8.x && c7.y + c7.h === c8.y
    && C8.density === 'country' && C8.band?.join('-') === '26-27' && C8.region === 'glasswold',
    'the Scarp\'s edge, C8, laid at 72,222 on the Wold, west of Akordu\'s box and under the Saltings\' C7: country, band 26-27');

  // Up the Scarp stair as a company from the Saltings climbs it: from the notch at C7's 8,22, past the
  // fall by the rope ladder and up the flights at column 8, onto C8's lip at 8,0, the stair's last flight,
  // where the Wold's line is said as the company's level has it (#166), never a wall; on to the head at
  // 8,1, the box's way in, where a Rider says what hunts here; and down again the same way.
  const climb = (level: number) => {
    const c = newWalk(ok);
    for (const m of c.party.members) m.level = level;
    c.world.travel('saltings_c7', 8, 22, SOUTH);
    const flights = Array.from({ length: 9 }, () => c.world.move('forward')), top = c.world.move('forward');
    return { c, flights, said: top.kind === 'moved' ? top.messages : [] };
  };
  const twelve = climb(12), lip = twelve.said.find((m) => m.startsWith('The Wold'));
  ok(twelve.flights.every((m) => m.kind === 'moved') && twelve.c.world.zone?.id === 'wold_c8' && twelve.c.world.state.x === c8.x + 8 && twelve.c.world.state.y === c8.y
    && chC8(8, 0) === '"' && C7.rows.slice(23).every((row) => row[8] === '"') && (C7.features!.find((f) => 'id' in f && f.id === 'c7_stair') as { text: string }).text.includes('rope ladder'),
    'from the notch at C7\'s 8,22 the company climbs past the fall by the rope ladder and up the flights at column 8, onto C8\'s lip at 8,0, the stair\'s last flight');
  const [lineAt25, lineAt26] = [25, 26].map((l) => climb(l).said.find((m) => m.startsWith('The Wold')));
  ok(lip === `The Wold. ${WOLD.crossing!.warning}` && lineAt25 === `The Wold. ${WOLD.crossing!.harder}` && lineAt26 === 'The Wold.',
    `the Wold's line at the stair's head: at 12, two acts early, "${lip}"; at 25, "${lineAt25}"; at 26, "${lineAt26}"`);
  const head = twelve.c.world.move('forward'), warned = featureC8('c8_line');
  ok(head.kind === 'moved' && twelve.c.world.state.y === c8.y + 1 && warned.kind === 'event' && head.messages.includes(warned.text) && warned.x === C8.start.x && warned.y === C8.start.y && C8.start.x === 8 && C8.start.y === 1,
    `at the stair's head, the box's way in, a Rider at the watch says what hunts here, a warning and not a wall (${warned.kind === 'event' ? warned.text : ''})`);
  twelve.c.world.travel('wold_c8', 8, 1, NORTH);
  const downStair = Array.from({ length: 11 }, () => twelve.c.world.move('forward'));
  ok(downStair.every((m) => m.kind === 'moved') && twelve.c.world.zone?.id === 'saltings_c7' && twelve.c.world.state.x === c7.x + 8 && twelve.c.world.state.y === c7.y + 22,
    'and down again the same way to the notch: the stair is open both ways');

  // The runner on the top flight and the two Riders at the watch, words only (#56's 54 is #532's); the
  // watch's cairn, yurt and fire at the head, where a company may rest.
  const runner = personC8('A Compact runner'), watch = personC8('The Riders at the watch');
  w.world.travel('wold_c8', runner.x, runner.y);
  const ran = meet(runner, w.party, heard(w.world, runner)).text;
  w.world.travel('wold_c8', watch.x, watch.y);
  const asked = meet(watch, w.party, heard(w.world, watch)).text;
  ok(runner.x === 8 && runner.y === 0 && ran.includes('Dead-Drop') && asked.includes('business') && asked.includes('Akordu')
    && !C8.features!.some((f) => f.kind === 'npc' && (f.flag || f.quest || f.choice || f.teaches || f.skill || f.hall || f.interior || f.passage)),
    'on the last flight a Compact runner getting her wind, and at the head two Riders who ask the company\'s business and send it on to Akordu: words only');
  const campC8 = C8.features!.find((f) => f.kind === 'camp')!, cairnC8 = featureC8('c8_cairn');
  w.world.travel('wold_c8', campC8.x, campC8.y);
  ok(restRefused(w.world) === '' && cairnC8.kind === 'cairn' && cairnC8.gold > 0 && C8.rows.join('').split('').filter((c) => c === 'B').length === 1
    && [campC8, cairnC8, watch].every((f) => Math.abs(f.x - 8) + Math.abs(f.y - 1) <= 3),
    'the watch\'s cairn, its yurt and its fire at the stair\'s head, where a company may rest');

  // The lip, the view down over the Saltings and the updraught; the grass running south and east to
  // Akordu, the runner's satchel, the pride's lie, the old skull, the herd's grazing and the glare of the
  // Glass to the south; and the lion of glass in the basilisks' hills.
  const lipSeen = ['c8_view', 'c8_lip', 'c8_updraught'], grass = ['c8_smoke', 'c8_post', 'c8_satchel', 'c8_lie', 'c8_skull', 'c8_grazed', 'c8_glare', 'c8_glassed'];
  for (const id of [...lipSeen, ...grass]) see(w, `wold_c8:${id}`);
  ok([...lipSeen, ...grass].every((id) => w.world.used(id)) && lipSeen.every((id) => featureC8(id).y <= 2) && chC8(featureC8('c8_glassed').x + 1, featureC8('c8_glassed').y + 1) === '^',
    'from the lip the Scarp sheer to the pans below, and the grass seen running south and east to Akordu');

  // The groups, each won at 26 and none within twelve steps of the head: the vultures on the lip's
  // updraught, the pride at its lie in the grass with vultures over it, and the two basilisks in the
  // hills at the box's east, the hardest at 27.
  const gC8 = (id: string) => C8.encounters!.find((g) => g.id === id)!;
  const [vulturesC8, prideC8, basilisksC8] = ['c8_vultures', 'c8_pride', 'c8_basilisk'].map(gC8);
  ok(C8.encounters!.length === 3 && vulturesC8.monsters.every((m) => m === 'vulture') && vulturesC8.y <= 4
    && prideC8.monsters.filter((m) => m === 'wold_lion').length === 4 && basilisksC8.monsters.every((m) => m === 'basilisk') && chC8(basilisksC8.x, basilisksC8.y) === '^' && basilisksC8.x >= 24
    && C8.encounters!.every((g) => !!g.respawn && Math.abs(g.x - C8.start.x) + Math.abs(g.y - C8.start.y) >= 12),
    'the vultures on the lip\'s updraught, the pride in the grass and the basilisks in the hills at the box\'s east, at 27; none within twelve steps of the stair\'s head');
  for (const g of C8.encounters!) fight(w, `wold_c8:${g.id}`);

  // The secret: a horse's prints along the lip, shod, where no Rider rides, to a rock east of the stair's
  // head, searched where they turn back; behind it a dry cleft under the lip and the Compact's last three
  // drops, gold and a letter nobody on the Wold can read. Walked, waded, climbed or floated, the cleft is
  // never reached but through its mouth.
  const [cleft] = C8.secrets!, prints = featureC8('c8_prints');
  ok(cleft.hint === 'c8_prints' && prints.x === cleft.x && prints.y === cleft.y + 1 && cleft.x > C8.start.x && cleft.y <= 2,
    'the horse\'s prints along the lip come to a rock east of the stair\'s head');
  const inBoxC8 = (x: number, y: number): boolean => x >= c8.x && x < c8.x + c8.w && y >= c8.y && y < c8.y + c8.h;
  const shutC8 = spread(c8.x + cleft.x, c8.y + cleft.y + 1, (x, y) => !(x === c8.x + cleft.x && y === c8.y + cleft.y) && inBoxC8(x, y) && out.passable(x, y, { swim: true, climb: true, float: true }) === 'ok');
  ok(shutC8.size > 900 && !shutC8.has(key(c8.x + cleft.x, c8.y + cleft.y - 1)) && !shutC8.has(key(c8.x + cleft.x + 1, c8.y + cleft.y - 1)) && chC8(cleft.x, cleft.y - 2) === 'r',
    `the cleft is shut but for its mouth, its rock between it and the Scarp: none of C8's ${shutC8.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'wold_c8:c8_prints');
  w.world.travel('wold_c8', cleft.x, cleft.y + 1, NORTH);
  let foundC8 = false;
  for (let i = 0; i < 20 && !foundC8; i++) foundC8 = w.world.search();
  const intoCleft = foundC8 ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(foundC8 && intoCleft.every((m) => m.kind === 'moved') && w.world.used('c8_cleft'), 'searched where the prints turn back, the rock gives on a dry cleft under the lip, three bundles on a ledge sealed in black wax');
  listen(w);
  const drops = featureC8('c8_drops');
  ok(drops.kind === 'chest' && drops.gold > 0 && drops.items.join() === 'cipher_letter' && drops.y === cleft.y - 1 && Math.abs(drops.x - cleft.x) === 1
    && item('cipher_letter').slot === 'none' && !item('cipher_letter').price,
    `the Compact's last three drops: ${drops.kind === 'chest' ? drops.gold : 0} gold and a Letter in Cipher, which nobody on the Wold reads and no shop buys`);

  // Over the east edge the grass runs on into Akordu's box, one land, and nothing is said.
  const across = newWalk(ok);
  for (const m of across.party.members) m.level = 26;
  across.world.travel('wold_c8', 31, 5, EAST);
  const over = across.world.move('forward');
  ok(over.kind === 'moved' && across.world.zone?.id === 'wold_d8' && !over.messages.some((m) => m.startsWith('The Wold')),
    'over C8\'s east edge the grass runs on into Akordu\'s box, one land, and nothing is said');

  // The Wold's heart (B8, #529): on the Wold's row at 40,222, west of the Scarp's edge, core, at 27-28, the
  // band's top; Kushtash on the world map no longer planned.
  const B8 = MAP_DEFS.find((d) => d.id === 'wold_b8')!, b8 = out.zones.find((z) => z.id === 'wold_b8')!;
  const atB8 = (x: number, y: number): number => key(b8.x + x, b8.y + y);
  const inB8 = (x: number, y: number): boolean => x >= b8.x && x < b8.x + b8.w && y >= b8.y && y < b8.y + b8.h;
  const chB8 = (x: number, y: number): string => out.at(b8.x + x, b8.y + y).ch;
  const featureB8 = (id: string) => B8.features!.find((f) => 'id' in f && f.id === id)!;
  const saysB8 = (name: string): { p: Person; text: string } => {
    const p = B8.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
    w.world.travel('wold_b8', p.x, p.y);
    return { p, text: meet(p, w.party, heard(w.world, p)).text };
  };
  ok(!!WOLD.maps?.some((m) => `${m.map} ${m.at.join(',')}` === 'wold_b8 40,222') && b8.x === 40 && b8.y === 222 && b8.x + b8.w === c8.x && b8.y === c8.y
    && B8.density === 'core' && B8.band?.join('-') === '27-28' && B8.region === 'glasswold' && ATLAS.sites.some((x) => x.name === 'Kushtash' && !x.planned && x.at.join() === '46,242'),
    'the Wold\'s heart, B8, laid at 40,222 west of the Scarp\'s edge: core, band 27-28, and Kushtash on the world map built');

  // Over C8's west edge onto B8's east edge at 31,4, the box's way in, one land and nothing said.
  const fromC8 = newWalk(ok);
  for (const m of fromC8.party.members) m.level = 27;
  fromC8.world.travel('wold_c8', 0, 4, WEST);
  const intoB8 = fromC8.world.move('forward');
  ok(intoB8.kind === 'moved' && fromC8.world.zone?.id === 'wold_b8' && fromC8.world.state.x === b8.x + 31 && fromC8.world.state.y === b8.y + 4 && !intoB8.messages.some((m) => m.startsWith('The Wold'))
    && B8.start.x === 31 && B8.start.y === 4 && B8.start.facing === WEST,
    'over C8\'s west edge onto B8\'s 31,4, the box\'s way in: the grass runs on under the rim, one land, and nothing is said');
  for (const m of w.party.members) m.level = 27;
  w.level = 27;

  // The hunters' camp by the way in, a rest, the Riders' own; the young Rider who has asked for the last
  // blow, and a Rider out from Akordu with the eldest's word (#56's 53, #532's): words only.
  const hunt = B8.features!.find((f) => f.kind === 'camp')!;
  w.world.travel('wold_b8', hunt.x, hunt.y);
  ok(restRefused(w.world) === '' && chB8(hunt.x, hunt.y) === ':' && Math.abs(hunt.x - B8.start.x) + Math.abs(hunt.y - B8.start.y) <= 8,
    'the hunters\' fire in its ring of saddles by the way in, where a company may rest');
  const boyB8 = saysB8('The young Rider'), eldestWord = saysB8('A Rider from Akordu');
  ok(boyB8.text.includes('Grey Lion') && boyB8.text.includes('last blow') && eldestWord.text.includes('eldest') && eldestWord.text.includes('Let him die')
    && !B8.features!.some((f) => f.kind === 'npc' && !['Aysu, the scout', 'The young Rider'].includes(f.name) && (f.flag || f.quest || f.choice || f.says || f.teaches || f.skill || f.hall || f.interior || f.passage)),
    'the young Rider wants the last blow, and a Rider from Akordu brings the eldest\'s word, let him die: words only, as is everyone on B8 but Aysu, the Ranger\'s third\'s, and the boy, the Lion\'s Share\'s (#532)');

  // Kushtash seen from the way in; the rim; the Riders' cairn and its draught, their well, the hunters'
  // horses; the pride's kill, the lesser mesa and the glassed hunter at its foot; the vultures over the
  // kill-ground; the walker's prints up out of the dunes, a lie in the grass, a horse's bones under the rim.
  for (const id of ['b8_kushtash', 'b8_rim', 'b8_horses', 'b8_kill', 'b8_mesa_seen', 'b8_glassed', 'b8_vultures', 'b8_kill_ground', 'b8_tracks', 'b8_lie', 'b8_bones']) see(w, `wold_b8:${id}`);
  const cairnB8 = featureB8('b8_cairn'), wellB8 = B8.features!.find((f) => f.kind === 'well')!;
  ok(cairnB8.kind === 'cairn' && cairnB8.gold > 0 && cairnB8.items.join() === 'quickening' && chB8(cairnB8.x, cairnB8.y) === '^' && !!wellB8
    && featureB8('b8_rim').x <= 3 && [...Array(32).keys()].every((i) => B8.rows[i][0] === 'M' && out.passable(b8.x, b8.y + i) !== 'ok'),
    'a Riders\' cairn on the hill with gold and a Quickening Draught, a well, and the rim down the west, the world\'s end');

  // The Riders' running horse in white stones on the rise: a stat no other shrine on the Wold gives.
  const horseB8 = featureB8('b8_shrine');
  w.world.travel('wold_b8', horseB8.x, horseB8.y);
  const knelt8 = w.world.featureHere();
  const blessed = MAP_DEFS.filter((d) => d.region === 'glasswold' && d.id !== 'wold_b8').flatMap((d) => (d.features ?? []).flatMap((f) => (f.kind === 'shrine' || f.kind === 'fountain' ? [f.stat] : [])));
  ok(knelt8?.kind === 'shrine' && horseB8.kind === 'shrine' && horseB8.stat === 'speed' && !blessed.includes('speed') && useShrine(w.world, w.party, knelt8)[0] === horseB8.text,
    `the company kneels at the running horse, and it gives speed, which no other shrine on the Wold gives (${blessed.join(', ')})`);

  // The hermit under the rim, who went into the Glass once and saw one of its walkers: words only.
  const hermit = saysB8('A hermit under the rim');
  ok(hermit.text.includes('the Glass') && hermit.text.includes('lamp for a face') && hermit.p.x <= 3 && chB8(hermit.p.x, hermit.p.y) === ':',
    'in a hollow under the rim a hermit who went into the Glass once, and what walked there had a lamp for a face');

  // The groups: the pride at its kill by the way in with the vultures down on it, and the mesa fight in the
  // scree under the lesser mesa's south face, a basilisk behind four lions, each won at 27; the Grey Lion
  // alone on open ground between the mesas, the box's boss, at 28.
  const gB8 = (id: string) => B8.encounters!.find((g) => g.id === id)!;
  const [prideB8, mesaB8, lion] = ['b8_pride', 'b8_mesa', 'b8_grey_lion'].map(gB8);
  ok(B8.encounters!.length === 3 && prideB8.monsters.filter((m) => m === 'wold_lion').length === 4 && prideB8.monsters.filter((m) => m === 'vulture').length === 3
    && mesaB8.monsters.filter((m) => m === 'wold_lion').length === 4 && mesaB8.monsters.filter((m) => m === 'basilisk').length === 1 && chB8(mesaB8.x, mesaB8.y) === '^' && chB8(mesaB8.x, mesaB8.y - 1) === 'r'
    && lion.monsters.join() === 'grey_lion' && chB8(lion.x, lion.y) === 's' && !lion.respawn && !!lion.slainText && MONSTERS.grey_lion.level === 28
    && [prideB8, mesaB8].every((g) => !!g.respawn),
    'the pride at its kill with three vultures, a basilisk behind four lions in the lesser mesa\'s scree, and the Grey Lion alone on open ground, the boss at 28');
  fight(w, 'wold_b8:b8_pride');
  fight(w, 'wold_b8:b8_mesa');
  w.level = 28;
  for (const m of w.party.members) m.level = 28;
  fight(w, 'wold_b8:b8_grey_lion');
  w.level = 27;
  for (const m of w.party.members) m.level = 27;
  const bags = featureB8('b8_saddlebags');
  ok(bags.kind === 'chest' && bags.gold > 0 && bags.items.join() === 'elixir' && Math.abs(bags.x - lion.x) + Math.abs(bags.y - lion.y) <= 4,
    `on the kill-ground a hunter's saddlebags: ${bags.kind === 'chest' ? bags.gold : 0} gold and an Elixir`);

  // The secret: the way up Kushtash, the scree on its rim side stepped by hand, and a ledge from the steps'
  // head to the top; hinted by the smoke off the top and the vultures that never wheel over it, by day,
  // and the fire on it by night. Walked, waded, climbed or floated, the top is never reached but up the steps.
  const [steps] = B8.secrets!, smoke = featureB8('b8_smoke');
  ok(steps.hint === 'b8_smoke' && smoke.kind === 'event' && !smoke.when && steps.x === 2 && steps.y === 17 && chB8(steps.x - 1, steps.y) === 's' && out.passable(b8.x + steps.x - 2, b8.y + steps.y) !== 'ok',
    'the smoke off Kushtash\'s top is the steps\' hint, and the steps are on the mesa\'s rim side, under the rim');
  see(w, 'wold_b8:b8_smoke');
  w.world.state.minutes = Math.floor(w.world.state.minutes / MINUTES_PER_DAY) * MINUTES_PER_DAY + MINUTES_PER_DAY + 60;
  see(w, 'wold_b8:b8_fire');
  ok(w.world.used('b8_smoke') && w.world.used('b8_fire'), 'by day the smoke off the top, by night a fire on it');
  w.world.state.minutes = Math.floor(w.world.state.minutes / MINUTES_PER_DAY) * MINUTES_PER_DAY + 9 * 60;
  const scout = B8.features!.find((f) => f.kind === 'npc' && f.name === 'Aysu, the scout') as Person;
  const below = spread(b8.x + steps.x - 1, b8.y + steps.y, (x, y) => !(x === b8.x + steps.x && y === b8.y + steps.y) && inB8(x, y) && out.passable(x, y, { swim: true, climb: true, float: true }) === 'ok');
  ok(below.size > 700 && !below.has(atB8(steps.x + 1, steps.y)) && !below.has(atB8(scout.x, scout.y)),
    `Kushtash's top is shut but for the steps: none of B8's ${below.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'wold_b8:b8_scree');
  w.world.travel('wold_b8', steps.x - 1, steps.y, EAST);
  let setStones = false;
  for (let i = 0; i < 20 && !setStones; i++) setStones = w.world.search();
  const upSteps = setStones ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(setStones && upSteps.every((m) => m.kind === 'moved') && w.world.used('b8_steps'), 'searched where the scree is bare, the stones are set and not fallen: steps, going up the face');
  listen(w);
  const topB8 = spread(b8.x + steps.x + 1, b8.y + steps.y, (x, y) => !(x === b8.x + steps.x && y === b8.y + steps.y) && inB8(x, y) && out.passable(x, y) === 'ok');
  const ledge = featureB8('b8_ledge'), viewB8 = featureB8('b8_view');
  ok(topB8.has(atB8(scout.x, scout.y)) && topB8.has(atB8(ledge.x, ledge.y)) && topB8.has(atB8(viewB8.x, viewB8.y)) && topB8.size === 30 && chB8(ledge.x, ledge.y) === ':',
    `up the steps and along the ledge to the top, ${topB8.size} squares from the steps' foot, the scout's fire among them`);
  for (const id of ['b8_ledge', 'b8_lookout', 'b8_view']) see(w, `wold_b8:${id}`);
  const scoutSays = saysB8('Aysu, the scout');
  const told = B8.features!.flatMap((f) => [...('text' in f && f.text ? [f.text] : []), ...(f.kind === 'npc' ? f.lines : []), ...(f.kind === 'shrine' ? [f.done] : [])]).join(' ');
  ok(scoutSays.text.includes('Meridian Company') && !/journal|map|teach|ranger/i.test(scoutSays.text) && scout.teaches?.cls === 'ranger' && scout.teaches.prestige === 3,
    'at her fire on the top Aysu, the scout who guided the Meridian Company, who says nothing of what she wants to a company with no ranger of 27 to ask: the Ranger\'s third is hers (#448)');
  ok(viewB8.kind === 'event' && viewB8.text.includes('Glass') && viewB8.text.includes('crown') && !/hull|ship|orbit|voyage|custodian/i.test(told),
    'from the top the Wold open to Akordu and the Glass with its dark crown, and nothing in the box\'s words of what the crown is');

  // The Glass's edge (B9, #530): on the Wold's row at 40,254, south of the Wold's heart, country, at 26-28.
  const B9 = MAP_DEFS.find((d) => d.id === 'wold_b9')!, b9 = out.zones.find((z) => z.id === 'wold_b9')!;
  const atB9 = (x: number, y: number): number => key(b9.x + x, b9.y + y);
  const inB9 = (x: number, y: number): boolean => x >= b9.x && x < b9.x + b9.w && y >= b9.y && y < b9.y + b9.h;
  const chB9 = (x: number, y: number): string => out.at(b9.x + x, b9.y + y).ch;
  const openB9 = (x: number, y: number): boolean => out.passable(b9.x + x, b9.y + y) === 'ok';
  const featureB9 = (id: string) => B9.features!.find((f) => 'id' in f && f.id === id)!;
  const saysB9 = (name: string): { p: Person; text: string } => {
    const p = B9.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
    w.world.travel('wold_b9', p.x, p.y);
    return { p, text: meet(p, w.party, heard(w.world, p)).text };
  };
  ok(!!WOLD.maps?.some((m) => `${m.map} ${m.at.join(',')}` === 'wold_b9 40,254') && b9.x === 40 && b9.y === 254 && b9.x === b8.x && b9.y === b8.y + b8.h
    && B9.density === 'country' && B9.band?.join('-') === '26-28' && B9.region === 'glasswold',
    'the Glass\'s edge, B9, laid at 40,254 south of the Wold\'s heart: country, band 26-28');

  // Over B8's south edge onto B9's north edge at 16,0, the box's way in, one land and nothing said.
  const fromB8 = newWalk(ok);
  for (const m of fromB8.party.members) m.level = 27;
  fromB8.world.travel('wold_b8', B9.start.x, 31, SOUTH);
  const intoB9 = fromB8.world.move('forward');
  ok(intoB9.kind === 'moved' && fromB8.world.zone?.id === 'wold_b9' && fromB8.world.state.x === b9.x + B9.start.x && fromB8.world.state.y === b9.y && !intoB9.messages.some((m) => m.startsWith('The Wold'))
    && B9.start.x === 16 && B9.start.y === 0 && B9.start.facing === SOUTH,
    'over B8\'s south edge onto B9\'s 16,0, the box\'s way in: the grass runs on south under the rim, one land, and nothing is said');

  // The dunes seen from the way in, the Riders' cairn at their head, the rim; a horse's prints up out of
  // the dunes alone (#56's 51, the horse that came back, #532's); the glare and something standing in it,
  // the wind that shifts the dunes, a lion the scorpions met, the mesa at the dunes' end, the rim's foot
  // shutting the south and the watch's horses on the last grass. The dunes are the box's half, roadless.
  for (const id of ['b9_dunes', 'b9_rim', 'b9_horse', 'b9_glare', 'b9_shifting', 'b9_stung', 'b9_mesa', 'b9_rim_foot', 'b9_horses']) see(w, `wold_b9:${id}`);
  const cairnB9 = featureB9('b9_cairn');
  ok(cairnB9.kind === 'cairn' && cairnB9.gold > 0 && cairnB9.items.join() === 'elixir' && chB9(cairnB9.x, cairnB9.y) === 's' && chB9(cairnB9.x + 1, cairnB9.y) === 'u'
    && [...Array(32).keys()].every((i) => B9.rows[i][0] === 'M' && !openB9(0, i) && !openB9(i, 31)),
    'a Riders\' cairn at the dunes\' head with gold and an Elixir; the rim down the west and its foot along the south, the world\'s end');
  const squaresB9 = [...Array(32 * 32).keys()].filter((i) => openB9(i % 32, Math.floor(i / 32)));
  const dunesB9 = squaresB9.filter((i) => chB9(i % 32, Math.floor(i / 32)) === 'u').length;
  ok(dunesB9 * 2 >= squaresB9.length && !B9.rows.some((r) => r.includes('=')),
    `the dunes are the box's half and more, ${dunesB9} of its ${squaresB9.length} open squares, and no road runs through them`);

  // The watch on the last grass at the gap's mouth: their fire before the yurt, a rest; three Riders who
  // keep the gap and say what walks out of it, words only, each setting the flag the chapter's last step
  // on the Wold keys on (#531).
  const fireB9 = B9.features!.find((f) => f.kind === 'camp')!;
  w.world.travel('wold_b9', fireB9.x, fireB9.y);
  ok(restRefused(w.world) === '' && chB9(fireB9.x, fireB9.y) === ':', 'the watch\'s fire on the last grass at the gap\'s mouth, where a company may rest');
  const unheard = !w.party.flags[WATCH];
  const ridersB9 = ['An old Rider at the fire', 'A Rider with a strung bow', 'The youngest of the watch'].map(saysB9);
  ok(unheard && !!w.party.flags[WATCH] && ridersB9.every((r) => r.p.flag === WATCH && chB9(r.p.x, r.p.y) === 's' && Math.abs(r.p.x - fireB9.x) + Math.abs(r.p.y - fireB9.y) <= 2)
    && ridersB9[0].text.includes('keep the gap') && ridersB9[1].text.includes('going somewhere') && ridersB9[2].text.includes('light')
    && !B9.features!.some((f) => f.kind === 'npc' && (f.quest || f.choice || f.says || f.teaches || f.skill || f.hall || f.interior || f.passage)),
    'three Riders at the fire keep the gap and say what walks out of it, words only, and their words set the watch\'s flag (#531)');

  // The groups: glass scorpions in the dunes by the grass and under the rim, the vultures at the hills'
  // foot and a walker alone at the dunes' middle, each won at 27; the two walkers at the gap after.
  const gB9 = (id: string) => B9.encounters!.find((g) => g.id === id)!;
  const pair = gB9('b9_walkers');
  ok(B9.encounters!.length === 5 && B9.encounters!.filter((g) => g.monsters.length === 4 && g.monsters.every((m) => m === 'glass_scorpion')).length === 2
    && gB9('b9_vultures').monsters.every((m) => m === 'vulture') && gB9('b9_walker').monsters.join() === 'glass_walker'
    && pair.monsters.join() === 'glass_walker,glass_walker' && pair.roams === false && B9.encounters!.every((g) => !!g.respawn && !g.slainText),
    'two groups of glass scorpions, the vultures, a walker alone and two walkers standing at the gap');
  for (const g of B9.encounters!) if (g !== pair) fight(w, `wold_b9:${g.id}`);

  // The gap, between the mesa and the rim's foot, the box's one open square on the Glass's side: the
  // Riders' stones and their word, the walker's tracks where the sand gives way to glass, and from the
  // last square the Glass and the crown in it, past the box's edge, the world's end for now (the reach,
  // Phase 1.6), with no exit. The two walkers under the mesa's face stand off the way to it, so the Glass
  // is seen with them unfought; then they are fought, the hardest.
  const glassB9 = featureB9('b9_glass'), lineB9 = featureB9('b9_line'), tracksB9 = featureB9('b9_tracks');
  const unseen = spread(b9.x + fireB9.x, b9.y + fireB9.y, (x, y) => inB9(x, y) && out.passable(x, y) === 'ok' && Math.abs(x - b9.x - pair.x) + Math.abs(y - b9.y - pair.y) > (pair.aware ?? 0));
  ok(glassB9.x === 31 && [glassB9, lineB9, tracksB9].every((f) => unseen.has(atB9(f.x, f.y)) && f.y === glassB9.y) && !out.exitAt(b9.x + 31, b9.y + glassB9.y)
    && out.at(b9.x + 32, b9.y + glassB9.y).ch === '%' && chB9(31, glassB9.y - 1) === 'r' && !openB9(31, glassB9.y + 1)
    && [...Array(18).keys()].filter((i) => openB9(31, 14 + i)).join() === String(glassB9.y - 14),
    `the gap's last square, ${glassB9.x},${glassB9.y}, the one open square on the box's east edge from the mesa down, walked to from the fire without coming in sight of the walkers, no exit and the world's end past it`);
  for (const id of ['b9_line', 'b9_tracks', 'b9_glass']) see(w, `wold_b9:${id}`);
  ok(w.world.used('b9_glass') && lineB9.kind === 'event' && lineB9.text.includes('the Glass') && tracksB9.kind === 'event' && tracksB9.text.includes('glass')
    && glassB9.kind === 'event' && glassB9.text.includes('crown'),
    'at the stones the Riders\' word on the Glass, the walker\'s tracks up off the glass, and from the last square the Glass and its crown: the chapter\'s to key on (#531)');
  fight(w, 'wold_b9:b9_walkers');

  // The secret: the one dune that does not shift, searched where the sand slides off it; under its crust a
  // walker that stopped long ago, its chest open to the sand and a cache in it: gold, and a piece of glass
  // with a light in it, plain until the reach. Walked, waded, climbed or floated, the cache is never
  // reached but through the dune's side.
  const [dune] = B9.secrets!;
  ok(dune.hint === 'b9_still' && featureB9('b9_still').x === dune.x + 1 && featureB9('b9_still').y === dune.y, 'the dune the wind does not shift lies at the walker\'s side');
  const crust = spread(b9.x + dune.x + 1, b9.y + dune.y, (x, y) => !(x === b9.x + dune.x && y === b9.y + dune.y) && inB9(x, y) && out.passable(x, y, { swim: true, climb: true, float: true }) === 'ok');
  ok(crust.size > 600 && !crust.has(atB9(dune.x - 1, dune.y)) && !crust.has(atB9(dune.x - 2, dune.y)),
    `the dune is shut but for its side: none of B9's ${crust.size} squares walked, waded, climbed or floated reaches the walker's chest`);
  see(w, 'wold_b9:b9_still');
  w.world.travel('wold_b9', dune.x + 1, dune.y, WEST);
  let dugB9 = false;
  for (let i = 0; i < 20 && !dugB9; i++) dugB9 = w.world.search();
  const inDune = dugB9 ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(dugB9 && inDune.every((m) => m.kind === 'moved') && w.world.used('b9_walker'), 'searched where the sand slides off, the crust gives, and under it a walker where it stopped, its chest open to the sand');
  listen(w);
  const cache = featureB9('b9_cache'), light = item('glass_light');
  ok(cache.kind === 'chest' && cache.gold > 0 && cache.items.join() === 'glass_light' && cache.x === dune.x - 2 && cache.y === dune.y
    && light.slot === 'none' && !light.price && light.text?.length === 2 && !light.use && !light.skill && !light.resist,
    `in the walker's chest ${cache.kind === 'chest' ? cache.gold : 0} gold and a piece of glass with a light in it, which no shop buys and which does nothing yet`);
  const toldB9 = [...B9.features!.flatMap((f) => [...('text' in f && f.text ? [f.text] : []), ...(f.kind === 'npc' ? f.lines : [])]), ...light.text!].join(' ');
  ok(!/hull|ship|orbit|voyage|custodian|tower/i.test(toldB9), 'nothing in the box\'s words, or the glass\'s, of what the crown is');

  fanesMap(ok);
  woldQuests(ok);
  theWarning(ok);
};

/**
 * The Ranger's third (#448), Oriel Fane's Map, played by a company of 27 whose ranger has the second: sent
 * to Aysu on Kushtash by its seeking quest; her own words first, then her ask, once, which begins the quest
 * and ends the seeking, and the third waits on the map. Down Fire Mountain's vents from Grimsforge, the
 * camps' groups that stand won at 27, as built; Fane's map taken at his fire, and out by his rope. Up on
 * Kushtash the map given from the pack at her question, the Lost Expedition still done on `meridian_map`;
 * and her menu teaches the third for it and no gold. After, her own words again, and nothing asked.
 */
function fanesMap(ok: (cond: boolean, msg: string) => void): void {
  const w = newWalk(ok), LEVEL = 27;
  w.level = LEVEL;
  for (const m of w.party.members) { m.level = LEVEL; m.xp = xpForLevel(LEVEL); }
  const wren = w.party.members[2];
  takePrestige(wren); takePrestige(wren);
  const [B8, MC3] = ['wold_b8', 'meridian_camp3'].map((id) => MAP_DEFS.find((d) => d.id === id)!);
  const aysu = B8.features!.find((f): f is Person => f.kind === 'npc' && f.name === 'Aysu, the scout')!;
  const fane = MC3.features!.find((f): f is Person => f.kind === 'npc' && f.name === 'Oriel Fane')!;
  const log = (id: string, bag = w.party.bag) => questLog(w.world.state, { ...w.party, bag }).find((v) => v.def.id === id);
  const talk = (): ReturnType<typeof meet> => { w.world.travel('wold_b8', aysu.x, aysu.y); const m = meet(aysu, w.party, heard(w.world, aysu)); listen(w); return m; };
  const won = (id: string): void => { for (const g of MAP_DEFS.find((d) => d.id === id)!.encounters ?? []) if (w.world.walks(g, g.x, g.y) && !w.world.ended(g)) fight(w, `${id}:${g.id}`); };
  const sent = log(seekId(2, 3))?.goal;
  ok(sent === 'Find Aysu, the scout in The Wold.' && wren.cls === 'ranger' && !!aysu.teaches?.seek?.includes('Unerring'), `at ${LEVEL} with the second, Wren is sent to Aysu (${sent})`);
  const said = [talk(), talk(), talk()].map((m) => m.text);
  ok(said[0] === aysu.lines.join('\n\n') && said[1].includes('bring me his map') && said[2] === said[0] && !!w.party.flags[SCOUT_ASKED] && log(seekId(2, 3))?.done === true && log('scout_map')?.done === false
    && barOf(aysu.teaches!, wren, w.party, w.world.state) === 'the quest first' && !teach(aysu.teaches!, w.party, w.world.state, 2).taught,
    `Aysu: her own words first, then her ask, once (${said[1].split('\n\n')[1]}), which begins ${log('scout_map')?.def.title} and ends the seeking; the third waits on it`);
  ok(log('scout_map')?.goal === 'Follow the Meridian journals down Fire Mountain\'s vents to Meridian Camp, and find Fane\'s map.', `the log sends the company down the vents (${log('scout_map')?.goal})`);

  // Down the vents' middle mouth from Grimsforge and down the stairs, the camps' groups won at 27.
  walkThrough(w, 'firemount_g11', VENTS.x + 1, VENTS.y, WEST, 'meridian_camp', 1);
  won('meridian_camp');
  walkThrough(w, 'meridian_camp', STAIR.x, STAIR.y - 1, SOUTH, 'meridian_camp2', 1);
  won('meridian_camp2');
  walkThrough(w, 'meridian_camp2', STAIR2.x, STAIR2.y - 1, SOUTH, 'meridian_camp3', 1);
  won('meridian_camp3');
  w.world.travel('meridian_camp3', fane.x, fane.y);
  const held = meet(fane, w.party, heard(w.world, fane)).choice?.answers[0], given = held ? answer(held, w.party) : '';
  listen(w);
  ok(!!w.party.flags.meridian_map && w.party.bag.includes('fane_map') && given.includes('Fane\'s Map') && log('scout_map')?.goal === 'Take Fane\'s map up Kushtash to Aysu.'
    && !!log('scout_map')?.pages[0].entries.some((e) => e.id === 'fane'),
    `at his fire Fane gives his map, sewn shut, and the log sends the company back up to Aysu (${log('scout_map')?.goal})`);
  walkThrough(w, 'meridian_camp3', ROPE.x, ROPE.y + 1, NORTH, 'firemount_g11', 1);

  // On Kushtash: the map in the pack, her question; given, she takes it and the third is taught for it.
  const gold = w.party.gold, asked = talk(), give = asked.choice?.answers.find((a) => a.takes === 'fane_map');
  const handed = give ? answer(give, w.party) : '';
  listen(w);
  const lost = log('meridian', [...w.party.bag, 'meridian_journal']);
  ok(!!give && !w.party.bag.includes('fane_map') && !!w.party.flags[MAP_GIVEN] && !!w.party.flags.meridian_map && lost?.done === true && log('scout_map')?.done === true && log('scout_map')?.goal === null,
    `Aysu asks for the map in the pack (${asked.choice?.ask}) and takes it (${handed.split('\n\n')[1]}); ${log('scout_map')?.def.title} is done, and the Lost Expedition stays done on meridian_map`);
  const [offer] = offers(aysu.teaches!, w.party, w.world.state), r = teach(aysu.teaches!, w.party, w.world.state, 2);
  ok(offer?.who === 2 && offer.bar === '' && offer.price === 0 && r.taught && className(wren) === 'Unerring' && w.party.gold === gold,
    `and her menu teaches the third, earned, for no gold (${r.line})`);
  const after = talk();
  ok(after.text === aysu.lines.join('\n\n') && !after.choice, 'after, her own words again, and nothing asked');
}

/**
 * #56's four side quests (#532), each at its level and answered every way, each paying its xp whichever
 * way it goes, shared by six. The Horse That Came Back, at 26: asked by Cador Lusk at the Chart House,
 * the horse seen in off the dunes and its prints at the Glass's edge, and what sits it taken whole from
 * the Rider with a hammer at Akordu and handed in, or broken there; or taken by a company Cador never met
 * and handed in at his first meeting. The Lion's Share, at 27: the young Rider asks at Akordu, and the
 * Grey Lion is hunted with him, the boy at the hunters' fire on B8 and gone from Akordu, his the last
 * blow; or the old lion let die, the eldest telling the rest, and the lion killed after all remembered;
 * or the lion killed first, nobody's blow, which pays nothing. Orders on the Scarp Stair, at 27: Hendra
 * asks, her runner gives up the orders, read from the pack, and the eldest has them sealed, hears what
 * they say or watches them burn, when the runner climbs again. The Garden of Glass, at 28: the mother
 * gives her son, the figure gone from the garden, and the priest at the Harbour Temple takes him in and
 * lifts the stone at the temple's price, or a draught does; he wakes, and is home beside her.
 */
function woldQuests(ok: (cond: boolean, msg: string) => void): void {
  const at = (level: number): Walk => {
    const w = newWalk(ok);
    w.level = level;
    for (const m of w.party.members) { m.level = level; m.xp = xpForLevel(level); }
    return w;
  };
  const mapOf = (id: string) => MAP_DEFS.find((d) => d.id === id)!;
  const npc = (map: string, name: string): Person => mapOf(map).features!.find((f) => f.kind === 'npc' && f.name === name) as Person;
  const ev = (map: string, id: string): Feature => mapOf(map).features!.find((f) => f.kind === 'event' && f.id === id)!;
  const page = (w: Walk, id: string) => questLog(w.world.state, w.party).find((v) => v.def.id === id)?.pages[0];
  const goal = (w: Walk, id: string): string => page(w, id)?.goal ?? '(no goal)';
  const began = (w: Walk, title: string): boolean => w.news.includes(`New quest: ${title}.`);
  const there = (w: Walk, map: string, f: Feature): boolean => { w.world.travel(map, f.x, f.y); return w.world.present(f); };
  const hear = (w: Walk, map: string, p: Person): string => { w.world.travel(map, p.x, p.y); const said = meet(p, w.party, heard(w.world, p)).text; listen(w); return said; };
  const answerTo = (w: Walk, map: string, p: Person, sets: string): string => {
    w.world.travel(map, p.x, p.y);
    const m = meet(p, w.party, heard(w.world, p)), a = m.choice?.answers.find((x) => x.sets === sets);
    ok(!!a, `${p.name.split(',')[0]} asks, and an answer sets ${sets} (${m.choice?.ask ?? 'no question'})`);
    const said = a ? answer(a, w.party) : '';
    listen(w);
    return said;
  };
  const reads = (w: Walk, id: string, want: readonly string[], not: readonly string[], how: string): void => {
    const pg = page(w, id), ids = pg?.entries.map((e) => e.id) ?? [], title = pg?.def.title ?? id;
    const done = w.news.filter((n) => n === `Quest complete: ${title}.`).length;
    ok(!!pg?.done && pg.goal === null && want.every((e) => ids.includes(e)) && !not.some((e) => ids.includes(e)) && done === 1,
      `${how}: ${title} is done with no goal, its entries ${ids.join(', ')}, and said complete once (${done})`);
  };
  const xpOf = (w: Walk): number => w.party.members.reduce((t, m) => t + m.xp, 0);
  const told = QUESTS.filter((q) => q.id !== 'scout_map').flatMap((q) => [...q.entries.map((e) => e.text), ...q.goals.map((g) => g.text)]).join(' ');
  ok(!/hull|ship|orbit|voyage|custodian/i.test(told), 'nothing in the side quests\' log of a hull, a ship, an orbit, a voyage or a Custodian');

  // The Horse That Came Back (#56's 51), at 26: 1,200 xp either way, 200 a member.
  const CADOR = npc('cinderport', 'Cador Lusk, of the Cartographers\' Guild'), HAMMER = npc('wold_d8', 'A Rider with a hammer'), HORSE = ev('wold_d8', 'd8_horse');
  for (const how of ['whole', 'unasked', 'broken'] as const) {
    const w = at(26);
    if (how !== 'unasked') {
      ok(hear(w, 'cinderport', CADOR).includes('I want it whole') && began(w, 'The Horse That Came Back') && /tethered at Akordu/.test(goal(w, 'horse_back')),
        `${how}: Cador Lusk at the Chart House wants what sits the horse that came back, whole (${goal(w, 'horse_back')})`);
      see(w, 'wold_d9:d9_horse');
      see(w, 'wold_b9:b9_horse');
    }
    ok(there(w, 'wold_d8', HORSE), `${how}: at Akordu the horse that came back stands tethered apart, the thing in its saddle still`);
    const xp = xpOf(w);
    if (how === 'broken') {
      const said = answerTo(w, 'wold_d8', HAMMER, HORSE_BROKEN);
      ok(xpOf(w) - xp === 1200 && said.includes('south-west') && !there(w, 'wold_d8', HORSE) && hear(w, 'wold_d8', HAMMER).includes('never moved') && hear(w, 'cinderport', CADOR).includes('no glass'),
        `broken: the Rider breaks it, 1,200 xp between the six, and says what it did on the way home (${said.split('\n\n')[1]})`);
      reads(w, 'horse_back', ['cador', 'dunes', 'prints', 'broken'], ['carried', 'whole'], how);
      continue;
    }
    const said = answerTo(w, 'wold_d8', HAMMER, HORSE_CARRIED);
    ok(xpOf(w) - xp === 1200 && w.party.bag.includes('saddle_walker') && !there(w, 'wold_d8', HORSE) && began(w, 'The Horse That Came Back')
      && /Chart House/.test(goal(w, 'horse_back')) && hear(w, 'wold_d8', HAMMER).includes('lie awake'),
      `${how}: taken whole off the saddle, 1,200 xp between the six, and the log sends it to the Chart House (${said.split('\n\n')[0]})`);
    const handed = hear(w, 'cinderport', CADOR);
    ok(!w.party.bag.includes('saddle_walker') && !!w.party.flags[HORSE_WHOLE] && !!w.party.flags[HORSE_ASKED] === (how === 'whole') && handed.includes('inks the Glass\'s edge')
      && handed.includes(how === 'whole' ? 'walks round it' : 'Set it there'),
      `${how}: Cador takes it ${how === 'whole' ? 'as he asked' : 'at the first meeting'} (${handed.split('\n\n')[0]})`);
    reads(w, 'horse_back', how === 'whole' ? ['cador', 'dunes', 'prints', 'carried', 'whole'] : ['carried', 'whole'], how === 'whole' ? ['broken'] : ['cador', 'broken'], how);
  }

  // The Lion's Share (#56's 53), at 27: 1,500 xp hunted or let die, 250 a member; nothing for a lion
  // killed before the boy is answered.
  const BOY = npc('wold_d8', 'A young Rider'), BOY_B8 = npc('wold_b8', 'The young Rider'), ELDEST = npc('wold_d8', 'The eldest');
  for (const how of ['blow', 'rest', 'taken'] as const) {
    const w = at(27);
    ok(there(w, 'wold_d8', BOY) && !there(w, 'wold_b8', BOY_B8) && hear(w, 'wold_d8', BOY).includes('let him die') && began(w, 'The Lion\'s Share') && /hunt the Grey Lion with him/.test(goal(w, 'lions_share')),
      `${how}: the young Rider at Akordu, and not at the hunters' fire, wants the last blow (${goal(w, 'lions_share')})`);
    if (how === 'taken') {
      const xp = xpOf(w);
      fight(w, LION_DOWN);
      ok(hear(w, 'wold_d8', BOY).includes('was not mine') && !!w.party.flags[LION_TAKEN] && xpOf(w) === xp, 'taken: the Grey Lion killed before the boy is answered, his blow never struck, and nothing paid');
      reads(w, 'lions_share', ['boy', 'taken'], ['hunt', 'blow', 'left', 'rest'], how);
      continue;
    }
    if (how === 'blow') {
      const xp = xpOf(w), said = answerTo(w, 'wold_d8', BOY, LION_HUNT);
      ok(xpOf(w) === xp && !there(w, 'wold_d8', BOY) && there(w, 'wold_b8', BOY_B8) && /Bring the Grey Lion down/.test(goal(w, 'lions_share')) && hear(w, 'wold_b8', BOY_B8).includes('leave the last blow to me'),
        `blow: the company will hunt with him, and he is at the hunters' fire and gone from Akordu (${said.split('\n\n')[1]})`);
      fight(w, LION_DOWN);
      ok(/young Rider at the hunters' fire/.test(goal(w, 'lions_share')), `blow: the Grey Lion down on his ground, the log sends the company back to the boy (${goal(w, 'lions_share')})`);
      const before = xpOf(w), blow = answerTo(w, 'wold_b8', BOY_B8, LION_BLOW);
      ok(xpOf(w) - before === 1500 && blow.includes('He is a Rider') && hear(w, 'wold_b8', BOY_B8).includes('somebody else'),
        `blow: the last blow the boy's, 1,500 xp between the six (${blow.split('\n\n')[0]})`);
      reads(w, 'lions_share', ['boy', 'hunt', 'blow'], ['left', 'rest', 'taken'], how);
      continue;
    }
    const story = hear(w, 'wold_d8', ELDEST), xp = xpOf(w), said = answerTo(w, 'wold_d8', BOY, LION_LEFT);
    ok(story.includes('the sky opened') && xpOf(w) - xp === 1500 && there(w, 'wold_d8', BOY) && hear(w, 'wold_d8', BOY).includes('ask again') && /rest of the eldest's story/.test(goal(w, 'lions_share')),
      `rest: the old lion let die, 1,500 xp between the six, and the boy stays at Akordu (${said.split('\n\n')[1]})`);
    const rest = hear(w, 'wold_d8', ELDEST), after = hear(w, 'wold_d8', ELDEST);
    ok(rest.includes('on its end') && rest.includes('crown') && !!w.party.flags[LION_TOLD] && after.includes('all of it now') && !/hull|ship|orbit|voyage|custodian/i.test(rest),
      `rest: the eldest tells the rest, once, and no word of what the crown is (${rest.split('\n\n')[1]})`);
    reads(w, 'lions_share', ['boy', 'left', 'rest'], ['hunt', 'blow', 'taken'], how);
    fight(w, LION_DOWN);
    ok(hear(w, 'wold_d8', BOY).includes('Then you killed him'), 'rest: the Grey Lion still stands to be fought, no lock, and killed after all the boy says so');
  }

  // Orders on the Scarp Stair (#56's 54), at 27: 1,500 xp whichever of the three, 250 a member.
  const HENDRA = npc('cinderport', 'Hendra, the Compact\'s factor'), RUNNER = npc('wold_c8', 'A Compact runner'), orders = item('riders_orders');
  for (const [how, sets] of [['sealed', ORDERS_SEALED], ['told', ORDERS_TOLD], ['burned', ORDERS_BURNED]] as const) {
    const w = at(27);
    ok(hear(w, 'cinderport', HENDRA).includes('Carry them the rest of the way') && began(w, 'Orders on the Scarp Stair') && /runner on the Scarp stair/.test(goal(w, 'scarp_orders')),
      `${how}: Hendra, the Compact's factor, sends the company up the Scarp stair after her runner (${goal(w, 'scarp_orders')})`);
    const given = answerTo(w, 'wold_c8', RUNNER, ORDERS_CARRIED);
    ok(w.party.bag.includes('riders_orders') && orders.slot === 'none' && !orders.price && !!orders.text?.join(' ').includes('silver') && hear(w, 'wold_c8', RUNNER).includes('Down is worse')
      && /eldest at Akordu/.test(goal(w, 'scarp_orders')),
      `${how}: on the top flight the runner gives up her orders, which read from the pack (${given.split('\n\n')[1]})`);
    hear(w, 'wold_d8', ELDEST);
    const xp = xpOf(w), said = answerTo(w, 'wold_d8', ELDEST, sets);
    ok(xpOf(w) - xp === 1500 && !w.party.bag.includes('riders_orders') && hear(w, 'cinderport', HENDRA).includes('Ruan will read')
      && hear(w, 'wold_c8', RUNNER).includes('look at faces') === (how === 'burned'),
      `${how}: the eldest has the orders, 1,500 xp between the six${how === 'burned' ? ', and the runner climbs again' : ''} (${said.split('\n\n')[1]})`);
    reads(w, 'scarp_orders', ['factor', 'runner', how], ['sealed', 'told', 'burned'].filter((e) => e !== how), how);
  }

  // The Garden of Glass (#56's 55), at 28: 1,800 xp lifted at the temple or by a draught, 300 a member.
  const MOTHER = npc('wold_d8', 'A woman among the figures'), PRIEST = npc('cinderport', 'A priest of the Harbour Temple'), FIGURE = ev('wold_d8', 'd8_figure');
  for (const [how, sets] of [['lifted', GARDEN_LIFTED], ['draught', GARDEN_DRAUGHT]] as const) {
    const w = at(28);
    w.party.gold = 5000;
    if (how === 'draught') w.party.bag.push('quickening');
    ok(!there(w, 'cinderport', PRIEST) && there(w, 'wold_d8', FIGURE) && hear(w, 'wold_d8', MOTHER).includes('looking still') && began(w, 'The Garden of Glass'),
      `${how}: the mother among the figures at Akordu, her son a boy of glass by her, and nobody at the temple door yet`);
    see(w, 'wold_d10:d10_glassed');
    const given = answerTo(w, 'wold_d8', MOTHER, GARDEN_CARRIED);
    ok(w.party.bag.includes('glass_boy') && !there(w, 'wold_d8', FIGURE) && hear(w, 'wold_d8', MOTHER).includes('waited this long') && /Harbour Temple/.test(goal(w, 'glass_garden')),
      `${how}: she gives him to be carried, and the garden has a space where he stood (${given.split('\n\n')[1]})`);
    const took = hear(w, 'cinderport', PRIEST);
    ok(there(w, 'cinderport', PRIEST) && !w.party.bag.includes('glass_boy') && !!w.party.flags[GARDEN_BROUGHT] && took.includes('eighty a level'),
      `${how}: at the Harbour Temple a priest takes him in (${took.split('\n\n')[0]})`);
    const stoned = structuredClone(w.party.members[0]);
    addCondition(stoned, 'stoned');
    const price = PRIEST.says?.flatMap((s) => s.choice?.answers ?? []).find((a) => a.sets === GARDEN_LIFTED)?.price ?? 0;
    const gold = w.party.gold, xp = xpOf(w), woke = answerTo(w, 'cinderport', PRIEST, sets);
    ok(price === templePrice(stoned) && xpOf(w) - xp === 1800 && woke.includes('a crown standing up in the Glass') && !!item('quickening').use?.cure?.includes('stoned')
      && (how === 'lifted' ? w.party.gold === gold - price : w.party.gold === gold && !w.party.bag.includes('quickening')),
      `${how}: ${how === 'lifted' ? `the stone lifted at the temple's price, ${price} gold, 80 a level at 28` : 'a Quickening Draught lifts the stone'}, 1,800 xp between the six, and he wakes (${woke.split('\n\n')[1]})`);
    ok(hear(w, 'cinderport', PRIEST).includes('went home') && hear(w, 'wold_d8', MOTHER).includes('her son beside her') && !/hull|ship|orbit|voyage|custodian/i.test(woke),
      `${how}: he went home on the Riders' ride, and sits by his mother among the figures`);
    reads(w, 'glass_garden', ['mother', 'mesas', 'carried', 'temple', 'woke'], [], how);
  }
}

// ---- the chapter (#531) ----

const npcOn = (map: string, name: string): Person => MAP_DEFS.find((d) => d.id === map)!.features!.find((f): f is Person => f.kind === 'npc' && f.name === name)!;
const goalOf = (start: string): string => CHAPTER.goals.find((g) => g.text.startsWith(start))!.text;

/** A step played at a level, the company levelled to it. */
const atLevel = (level: number, s: Step): Step => ({ name: `${s.name} at ${level}`, play: (w) => {
  for (const m of w.party.members) { m.level = level; m.xp = xpForLevel(level); }
  w.level = level;
  s.play(w);
} });

/** The entries written on a chapter's page. */
const written = (w: Walk, c = CHAPTER): string[] => (quest(w)?.pages.find((p) => p.def === c)?.entries ?? []).map((e) => e.id);

/** Take the Rider's ride from the Rider who sells it, at nine in the morning with the fare in hand. */
function rideFrom(w: Walk, map: string, name: string): { taken: boolean; said: string[] } {
  const rider = npcOn(map, name);
  w.world.travel(map, rider.x, rider.y);
  w.world.state.minutes = Math.floor(w.world.state.minutes / MINUTES_PER_DAY) * MINUTES_PER_DAY + 9 * 60;
  w.party.gold = RIDERS_RIDE.fare;
  const rode = ride(rider.passage![0], w.world, w.party), said = rode.taken ? w.world.eventsHere() : [];
  listen(w);
  return { taken: rode.taken, said };
}

/** Up the Riders' road from E10 through the mesas onto the steppe: the glass in the grass on D9's road in. */
const GRASS: Step = { name: 'the glass in the grass', play: (w) => see(w, 'wold_d9:d9_glass') };

/** Up the Riders' track over D9's north edge, the seam at 16, into Akordu's ring of tents. */
const TENTS: Step = { name: 'up the track into Akordu', play: (w) => { walkThrough(w, 'wold_d9', 16, 0, NORTH, 'wold_d8', 1); see(w, 'wold_d8:d8_akordu'); } };

/** East over the Scarp's edge, C8's 31,5, into Akordu's box, one land. */
const ACROSS: Step = { name: 'over the Scarp\'s edge into Akordu', play: (w) => walkThrough(w, 'wold_c8', 31, 5, EAST, 'wold_d8', 1) };

/** The eldest at her own fire before her tent, her story told once. */
const ELDEST: Step = { name: 'the eldest', play: (w) => meetWho(w, STORY) };

/** West over C8's edge under the rim and south over B8's into the dunes, to the old Rider at the watch's fire. */
const WATCHED: Step = { name: 'the watch at the gap', play: (w) => {
  walkThrough(w, 'wold_c8', 0, 4, WEST, 'wold_b8', 1);
  walkThrough(w, 'wold_b8', 16, 31, SOUTH, 'wold_b9', 1);
  const old = npcOn('wold_b9', 'An old Rider at the fire');
  w.world.travel('wold_b9', old.x, old.y);
  meet(old, w.party, heard(w.world, old));
  listen(w);
} };

/** On past the stones to the gap's last square, the Glass and its crown seen; then the two walkers at the gap won. */
const GAP: Step = { name: 'the gap', play: (w) => {
  for (const id of ['b9_line', 'b9_tracks', 'b9_glass']) see(w, `wold_b9:${id}`);
  fight(w, 'wold_b9:b9_walkers');
} };

/** Back north and east over the seams to Akordu's horse-lines, turned east for the port. */
const LINES: Step = { name: 'back to Akordu\'s horse-lines', play: (w) => {
  walkThrough(w, 'wold_b9', 16, 0, NORTH, 'wold_b8', 1);
  walkThrough(w, 'wold_b8', 31, 4, EAST, 'wold_c8', 1);
  walkThrough(w, 'wold_c8', 31, 5, EAST, 'wold_d8', 1);
  see(w, 'wold_d8:d8_turned');
} };

/**
 * The Warning (#531), begun where The Window ends and played at 26, 27 and 28 three ways in: by the road
 * over the Cinder Hills, its parts in the goals' order; set down at Akordu's horse-lines by the Rider's ride
 * from Cinderport, the watch and the gap before the eldest, and back east to the port on the ride; and up
 * the Scarp stair from the Saltings, which ends The Window without its road west, the gap first. Nothing
 * on the Wold shuts, and the journal reads true by every way in.
 */
function theWarning(ok: (cond: boolean, msg: string) => void): void {
  const texts = [...CHAPTER.entries.map((e) => e.text), ...CHAPTER.goals.map((g) => g.text)];
  ok(texts.every((t) => !/hull|ship|orbit|voyage|custodian|tower/i.test(t)), 'nothing in the chapter names a hull, a ship, an orbit, a voyage, a Custodian or a tower');
  const early = newWalk(ok);
  for (const f of [LIT, ROAD_WEST, STORY, WATCH]) early.party.flags[f] = 1;
  early.world.travel('wold_d8', 8, 27, WEST);
  ok(!early.world.eventsHere().length && !early.party.flags[ROAD_EAST], 'at Akordu\'s horse-lines with the eldest and the watch heard and the Glass unseen, nothing is said or set: the gap is no lock, and the chapter waits on it');
  const read: string[] = [];
  for (const how of ['by the road, in the goals\' order', 'by the Rider\'s ride, the gap before the eldest', 'up the Scarp stair, the gap first']) {
    const w = newWalk(ok);
    for (const m of w.party.members) { m.level = 26; m.xp = xpForLevel(26); }
    w.level = 26;
    w.party.flags[LIT] = 1;
    listen(w);
    if (how.startsWith('by the road')) {
      // Where The Window ends: up the road onto the Cinder Hills' last shoulder, the grass below.
      w.world.travel('emberwaste_e10', 1, 8, NORTH);
      w.world.move('forward');
      w.world.move('forward');
      w.world.eventsHere();
      listen(w);
      ok(!!w.party.flags[ROAD_WEST] && quest(w)?.goal === goalOf('West up the Riders\' road') && !written(w).length,
        `${how}, The Window done on the Hills' last shoulder, the chapter begins, its goal west onto the steppe (${quest(w)?.goal})`);
      playChapter(w, CHAPTER, [atLevel(26, GRASS), atLevel(26, TENTS), atLevel(26, ELDEST), atLevel(27, WATCHED), atLevel(28, GAP), atLevel(28, LINES)], how);
    } else if (how.startsWith('by the Rider\'s ride')) {
      const west = rideFrom(w, 'cinderport', 'A Rider by the gate');
      ok(west.taken && w.world.zone?.id === 'wold_d8' && !!w.party.flags[ROAD_WEST] && quest(w)?.goal === goalOf('In Akordu') && written(w).join() === 'akordu',
        `${how}, set down at Akordu's horse-lines, The Window done and the chapter begun, its goal the eldest's fire (${quest(w)?.goal})`);
      atLevel(27, WATCHED).play(w);
      atLevel(28, GAP).play(w);
      w.world.travel('wold_d8', 8, 27, WEST);
      const unsaid = w.world.eventsHere();
      listen(w);
      ok(!unsaid.length && !w.party.flags[ROAD_EAST] && quest(w)?.goal === goalOf('In Akordu') && written(w).join(', ') === 'akordu, watch, glass',
        `${how}, the watch heard and the Glass seen first, the goal is the eldest still, and the lines say nothing yet (${written(w).join(', ')}: ${quest(w)?.goal})`);
      playChapter(w, CHAPTER, [atLevel(28, ELDEST), atLevel(28, LINES)], how);
      const east = rideFrom(w, 'wold_d8', 'A Rider at the lines');
      ok(east.taken && w.world.state.mapId === 'cinderport' && !!w.party.flags[ROAD_EAST], `${how}, and east on the ride to Cinderport's gate, for the last crossing`);
    } else {
      // Up from the Saltings' notch at C7's 8,22, the flights and the lip, onto the stair's head at C8's 8,1.
      w.world.travel('saltings_c7', 8, 22, SOUTH);
      const climbed = Array.from({ length: 11 }, () => w.world.move('forward'));
      listen(w);
      const window = quest(w)?.pages.find((p) => p.def === WINDOW);
      ok(climbed.every((m) => m.kind === 'moved') && w.world.zone?.id === 'wold_c8' && !!window?.done && !written(w, WINDOW).includes('west') && !w.party.flags[ROAD_WEST]
        && quest(w)?.goal === goalOf('Over the grass of the Wold') && written(w).join() === 'stair',
        `${how}, the Stone lit, the stair's head ends The Window without its road west and begins the chapter, its goal over the grass to Akordu (${quest(w)?.goal})`);
      atLevel(27, WATCHED).play(w);
      atLevel(28, GAP).play(w);
      ok(quest(w)?.goal === goalOf('Over the grass of the Wold') && written(w).join(', ') === 'stair, watch, glass',
        `${how}, the watch heard and the Glass seen before Akordu, the goal is Akordu still (${written(w).join(', ')}: ${quest(w)?.goal})`);
      playChapter(w, CHAPTER, [atLevel(28, ACROSS), atLevel(28, ELDEST), atLevel(28, LINES)], how);
      w.world.travel('wold_d8', 9, 27, EAST);
      const landing = w.world.eventsHere();
      listen(w);
      ok(!landing.length && !w.party.flags[ROAD_WEST] && !written(w, WINDOW).includes('west'), `${how}, the ride's landing at the lines says nothing of the road west to a company that came up the stair`);
    }
    goalFromBegun(w, how);
    const ends = w.news.filter((n) => n === `Chapter complete: ${CHAPTER.title}.`).length;
    ok(!!quest(w)?.pages.find((p) => p.def === CHAPTER)?.done && ends === 1 && w.level === 28 && !!w.party.flags[ROAD_EAST],
      `${how}, turned east at Akordu's horse-lines, the chapter is done at 28, and said so once (${ends})`);
    read.push(written(w).join(', '));
  }
  const whole = 'grass, akordu, eldest, watch, glass, east';
  ok(read[0] === whole && read[1] === whole.replace('grass, ', '') && read[2] === whole.replace('grass, ', 'stair, '),
    `the journal reads the same in every order and by every way in, but for the glass in the grass seen only on the road and the warning at the stair's head only up the stair (${read.join(' / ')})`);
  everyGoalWalked(ok, [CHAPTER]);
}
