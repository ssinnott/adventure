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
// of 27 to the teaching (`fanesMap`); the Sorcerer's third (#807), What the Walkers Carried, the same, the
// glasses brought first and the ask first, and to a company with no sorcerer (`walkersCarried`); #56's four
// side quests (#532), each at its level and every way it goes (`woldQuests`). The Master of arms (#858),
// found and never told: the rumour at Akordu's trader's tent, the door in the small mesa's face that the
// arrows point at, the hollow and Mergen in it, the bow in the herders' store on E9 and the lesson (`masterOfArms`).
// Last the chapter, three ways in (`theWarning`).
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen, walkThrough, meetWho, playChapter, everyGoalWalked, goalFromBegun, quest, said, hear, answerTo, goal, goalOf, written, began, reads, there, search, xpOf, walkAt, atLevel, npc, ev, chest } from '../../../../tools/kit/walk.ts';
import { zone, square, ALL, reach, spread, cell, inBox } from '../../../../tools/kit/grid.ts';
import { headlessGame } from '../../../../tools/kit/headless.ts';
import type { Walk, Step } from '../../../../tools/kit/walk.ts';
import { NORTH, EAST, SOUTH, WEST } from '../../../game/types.ts';
import type { Facing } from '../../../game/types.ts';
import { addCondition, hasCondition, lift, templePrice, xpForLevel, takePrestige, className, createCharacter } from '../../../game/party.ts';
import { offers, teach, barOf, noneHere } from '../../../game/prestige.ts';
import { seekId, sought } from '../../../game/seeking.ts';
import { makeRng } from '../../../lib/engine/rng.ts';
import { questLog, questMarks, TRAINERS } from '../../../game/quests.ts';
import type { QuestCond, When } from '../../../game/quests.ts';
import { VENTS, STAIR, STAIR2, ROPE, CURES, LIT, ROAD_WEST } from '../ashfall/public.ts';
import { SCOUT_ASKED, MAP_GIVEN, LION_HUNT, LION_LEFT, LION_BLOW, LION_TOLD, LION_TAKEN, LION_DOWN } from './maps/wold_b8.ts';
import { HORSE_CARRIED, GARDEN_CARRIED } from './maps/wold_d8.ts';
import { HORSE_ASKED, HORSE_BROKEN, HORSE_WHOLE, GARDEN_BROUGHT, GARDEN_LIFTED, GARDEN_DRAUGHT, ORDERS_SEALED, ORDERS_TOLD, ORDERS_BURNED, ROAD_EAST } from './public.ts';
import { ORDERS_CARRIED } from './maps/wold_c8.ts';
import { QUESTS } from './quests.ts';
import { AREAS, ATLAS, MAP_DEFS, MONSTERS, THE_QUEST, TABLES } from '../../index.ts';
import { CURVE } from '../../progression.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { restRefused, useShrine } from '../../../game/wilds.ts';
import { meet, heard, answer, personFlags, handIns } from '../../../game/people.ts';
import { masterOffers, teachTier, favourDone, linesOf, TIER_PRICES } from '../../../game/mastery.ts';
import type { Person } from '../../../game/people.ts';
import { buy, item } from '../../../game/items.ts';
import type { Feature, MapDef, Answer } from '../../../game/mapdef.ts';
import { GameMap } from '../../../game/map.ts';
import { HARDER_IN, WARNING_IN } from '../../../game/world.ts';
import { take as ride } from '../../../game/passage.ts';
import { MINUTES_PER_DAY } from '../../../game/calendar.ts';
import { RIDERS_RIDE } from '../../crossings.ts';
import { wrap } from '../../../ui/draw.ts';
import { SAY_W, SAY_LINES } from '../../../ui/frame.ts';
import { STORY } from './maps/wold_d8.ts';
import { CHAPTER } from './chapter.ts';
import { WATCH, SCHOLAR_ASKED, ETCHING_GIVEN, ETCHING_READ } from './maps/wold_b9.ts';
import { MASTER_MET, MASTER_FAVOUR } from './maps/wold_d10.ts';
import { RESPAWN } from '../../../game/keys.ts';

// Another area's chapter, taken from the quest by its id and not from its file (#992).
const WINDOW = THE_QUEST.chapters.find((c) => c.id === 'window')!;

export const walkthrough: Walkthrough = (ok) => {
  const w = newWalk(ok);
  const out = buildMaps()[OUTDOORS];
  w.level = 26;
  for (const m of w.party.members) m.level = 26;
  const D9 = MAP_DEFS.find((d) => d.id === 'wold_d9')!, d9 = out.zones.find((z) => z.id === 'wold_d9')!;
  const WOLD = ATLAS.zones.find((z) => z.id === 'wold')!;
  const beside = (x: number, y: number, set: Set<number>): boolean => [[1, 0], [-1, 0], [0, 1], [0, -1]].some(([dx, dy]) => set.has(cell(out, d9.x + x + dx, d9.y + y + dy)));
  const ch = (x: number, y: number): string => out.at(d9.x + x, d9.y + y).ch;
  const feature = (id: string) => D9.features!.find((f) => 'id' in f && f.id === id)!;
  const person = (name: string): Person => D9.features!.find((f) => f.kind === 'npc' && f.name === name) as Person;

  // The Wold listed by its first map, as Ashfall was by G10 (#511): an area of its own, out of AHEAD and
  // PLANNED, D9 on its zone's row at 104,254, core, at 26-27 under the Wold's own sky; the mesas, D10,
  // under it at 104,286, the zone's way in and first on its row (#527).
  const D10 = MAP_DEFS.find((d) => d.id === 'wold_d10')!, d10 = out.zones.find((z) => z.id === 'wold_d10')!;
  ok(AREAS.some((a) => a.id === 'glasswold')
    && WOLD.maps?.slice(0, 2).map((m) => `${m.map} ${m.at.join(',')}`).join() === 'wold_d10 104,286,wold_d9 104,254' && d9.x === 104 && d9.y === 254 && d10.x === 104 && d10.y === 286
    && [D9, D10].every((d) => d.density === 'core' && d.band?.join('-') === '26-27' && d.region === 'glasswold'),
    'the Glasswold listed by its first map, the steppe, D9, laid at 104,254 on the Wold, and the mesas, D10, under it at 104,286, the zone\'s way in: core, band 26-27, under its own sky');

  // The mesas (D10, #527): over E10's west edge from its road at 0,6 onto D10's at 31,6, the box's way in,
  // where a company first comes onto the Wold's grass. At the floor its name and nothing more, one or two
  // under the Wold's harder words, three or more under its warning; straight back, nothing.
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
  const road10 = spread(out, d10.x + 31, d10.y + 6, (x, y) => in10(x, y) && out.at(x, y).ch === '=');
  const laid10 = D10.rows.join('').split('').filter((c) => c === '=').length;
  ok(road10.size === laid10 && road10.has(square(out, d10, 22, 0)) && road10.has(square(out, d10, 23, 0)) && ch(22, 31) === '=' && ch(23, 31) === '='
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
  const top = spread(out, d10.x + notch.x, d10.y, (x, y) => !(x === d10.x + notch.x && y === d10.y + notch.y) && in10(x, y) && out.passable(x, y, { swim: true, climb: true, float: true }) === 'ok');
  ok(top.size > 900 && !top.has(square(out, d10, notch.x, notch.y + 1)) && !top.has(square(out, d10, 28, 3)),
    `the great mesa's top is shut but for the notch: none of D10's ${top.size} squares walked, waded, climbed or floated reaches it`);
  w.world.travel('wold_d10', notch.x, 0, SOUTH);
  let up = false;
  for (let i = 0; i < 20 && !up; i++) up = w.world.search();
  const onto = up ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(up && onto.every((r) => r.kind === 'moved') && w.world.used('d10_nest'), 'searched in the scree where the arrow points, a notch, and up it the nest among the glassed bones');
  listen(w);
  const hoard = feature10('d10_hoard');
  ok(hoard.kind === 'chest' && hoard.gold > 0 && hoard.items.join() === 'basalt_shield+2,quickening' && item(TABLES.items, 'basalt_shield+2').slot === 'shield' && item(TABLES.items, 'basalt_shield+2').plus === 2
    && item(TABLES.items, 'basalt_shield+2').price < 6000 && item(TABLES.items, 'quickening').use?.cure?.includes('stoned') === true,
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
  addCondition(TABLES.items, glassed, 'stoned');
  const price = templePrice(glassed);
  ok(lift(TABLES.items, glassed, item(TABLES.items, 'quickening').use!.cure!) && !hasCondition(glassed, 'stoned') && price === 80 * 26,
    `the draught lifts a member's stone, and a temple asks ${price} gold for one of 26`);

  // The steppe (D9, #525), walked onto up the road from the mesas: the way in on its south edge, where D10's
  // road comes on. The road runs square to square from there north-west over the dunes' edge to the west
  // edge at 0,21, toward the Riders' gap; past C9, for now, the world ends.
  const onward = cross(26, 'wold_d10', 22, 0, NORTH);
  ok(w.world.zone?.id === 'wold_d9' && w.world.state.x === d9.x + 22 && w.world.state.y === d9.y + 31 && !onward.length, 'up the road from D10\'s 22,0 onto D9\'s 22,31, one land, nothing said');
  w.world.travel('wold_d9', D9.start.x, D9.start.y, NORTH);
  ok(w.world.zone?.id === 'wold_d9' && D9.start.x === 22 && D9.start.y === 31 && ch(22, 31) === '=' && ch(23, 31) === '=',
    'put down on the road at the south edge, 22,31, the box\'s way in');
  const road = spread(out, d9.x + 22, d9.y + 31, (x, y) => inBox(d9, x, y) && out.at(x, y).ch === '=');
  const laid = D9.rows.join('').split('').filter((c) => c === '=').length;
  ok(road.size === laid && road.has(cell(out, d9.x, d9.y + 21)) && out.passable(d9.x - 1, d9.y + 21) !== 'ok' && out.at(d9.x + 22, d9.y + 32).ch === '=',
    `the road runs square to square, all ${laid} of its squares, from the south edge at 22 and 23, where D10's road comes on, to the west edge at 0,21, past which, for now, the world ends`);
  const glass = feature('d9_glass');
  ok(road.has(cell(out, d9.x + glass.x, d9.y + glass.y)), 'on the road in, the glass in the grass');
  see(w, 'wold_d9:d9_glass');
  ok(w.world.used('d9_glass'), 'the glass in the grass seen, the chapter\'s to key on (#531)');

  // The Riders' well where their track leaves the road, their camp beside it; the track north past the
  // tents seen from the middle and the cairn on the watch-mound, to the north edge at 16,0, toward Akordu.
  const track = spread(out, d9.x + 16, d9.y, (x, y) => inBox(d9, x, y) && out.at(x, y).ch === ':');
  const well = feature('d9_well'), camps = D9.features!.filter((f) => f.kind === 'camp');
  ok(track.has(cell(out, d9.x + 15, d9.y + 26)) && beside(15, 26, road) && beside(well.x, well.y, track) && well.kind === 'fountain'
    && camps.length === 1 && Math.abs(camps[0].x - well.x) + Math.abs(camps[0].y - well.y) === 2,
    `the Riders' track, ${track.size} squares, runs from the road north to the north edge at 16,0, their well beside it and their camp by the well`);
  w.world.travel('wold_d9', well.x, well.y);
  const here = w.world.featureHere();
  ok(here?.kind === 'fountain' && well.kind === 'fountain' && useShrine(w.world, w.party, here)[0] === well.text, 'the company drinks at the Riders\' well');
  w.world.travel('wold_d9', camps[0].x, camps[0].y);
  ok(restRefused(w.world) === '', 'and a company may rest at the camp');
  const tents = feature('d9_tents');
  ok(track.has(cell(out, d9.x + tents.x, d9.y + tents.y)) && Math.abs(tents.x - 16) <= 2 && Math.abs(tents.y - 16) <= 2 && tents.kind === 'event' && tents.text.includes('north'),
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
  const dunes = new Set(D9.rows.flatMap((r, y) => [...r].flatMap((c, x) => (c === 'u' ? [cell(out, d9.x + x, d9.y + y)] : []))));
  const edge = feature('d9_edge_cairn'), seen = feature('d9_glass_seen'), tracks = feature('d9_tracks'), horse = feature('d9_horse');
  ok(edge.kind === 'cairn' && edge.gold > 0 && beside(edge.x, edge.y, dunes) && dunes.has(cell(out, d9.x + seen.x, d9.y + seen.y)) && beside(tracks.x, tracks.y, dunes)
    && horse.kind === 'event' && beside(horse.x, horse.y, dunes) && !horse.sets && !D9.features!.some((f) => f.kind === 'npc' && (f.quest || f.flag)),
    'at the dunes\' edge the horse that came back, seen and no more, a cairn where the grass gives out, the Glass seen from the dunes, and tracks across their edge');

  // The groups, each won at 26: the near pride at its kill with the vultures down on it, the glass
  // scorpions at the dunes' edge, the glass walker alone at the far south-west, the box's hardest at 27,
  // and the north pride by the track with its vultures.
  const group = (id: string) => D9.encounters!.find((g) => g.id === id)!;
  const [near, scorpions, walker, north] = ['d9_pride', 'd9_scorpions', 'd9_walker', 'd9_pride_north'].map(group);
  const pride = (g: typeof near): boolean => g.monsters.filter((m) => m === 'wold_lion').length >= 3 && g.monsters.filter((m) => m === 'wold_lion').length <= 4 && g.monsters.includes('vulture');
  ok(D9.encounters!.length === 4 && pride(near) && pride(north) && scorpions.monsters.every((m) => m === 'glass_scorpion') && beside(scorpions.x, scorpions.y, dunes)
    && walker.monsters.join() === 'glass_walker' && dunes.has(cell(out, d9.x + walker.x, d9.y + walker.y)) && walker.x <= 2 && walker.y >= 29 && MONSTERS.glass_walker.level === 27
    && D9.encounters!.every((g) => !!g.respawn),
    'two prides of lions with the vultures down on their kills, the glass scorpions at the dunes\' edge and a glass walker alone at the far south-west, at 27');
  for (const g of D9.encounters!) fight(w, `wold_d9:${g.id}`);

  // The secret: the long mound where the herd will not graze and the lions will not cross, searched where
  // the grass stands long; under the turf a walker fallen long ago, its chest a hollow. Walked, waded,
  // climbed or floated, the hollow is never reached but through its mouth.
  const [mound] = D9.secrets!;
  ok(mound.hint === 'd9_ungrazed' && feature('d9_ungrazed').x === mound.x + 1 && feature('d9_ungrazed').y === mound.y, 'the grass that stands long lies at the long mound\'s mouth');
  const shut = spread(out, d9.x + mound.x + 1, d9.y + mound.y, (x, y) => !(x === d9.x + mound.x && y === d9.y + mound.y) && inBox(d9, x, y) && out.passable(x, y, { swim: true, climb: true, float: true }) === 'ok');
  ok(shut.size > 900 && !shut.has(cell(out, d9.x + mound.x - 1, d9.y + mound.y)) && !shut.has(cell(out, d9.x + mound.x - 2, d9.y + mound.y)),
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
    && item(TABLES.items, 'etched_glass').slot === 'none' && !item(TABLES.items, 'etched_glass').price,
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
  const wares = trader.stock.map((id) => item(TABLES.items, id));
  ok(D8.features!.filter((f) => 'interior' in f && f.interior).length === 1 && trader.interior === 'akordu_trader' && ch8(trader.x, trader.y) === 'D' && !trader.prices
    && CURES.every((id) => trader.stock.includes(id)) && wares.every((d) => d.slot === 'none' || d.id === 'leather_coat') && trader.stock.includes('leather_coat'),
    `the trader's tent sells the band's consumables, the stone's cure and the Riders' leather at list price, and nothing of steel (${wares.map((d) => d.name).join(', ')})`);
  ok(!D8.features!.some((f) => ['inn', 'temple', 'guild', 'trainer'].includes(f.kind) || (f.kind === 'npc' && (f.teaches || f.skill || f.hall || f.quest || f.interior))),
    'the camp sells and teaches nothing else, and takes nothing in by hand; its questions are the side quests\' (#532, `woldQuests`)');
  w.party.gold += 5000;
  const purse = w.party.gold;
  ok(!!buy(TABLES.items, w.party, trader, 'quickening') && !!buy(TABLES.items, w.party, trader, 'leather_coat') && purse - w.party.gold === item(TABLES.items, 'quickening').price + item(TABLES.items, 'leather_coat').price,
    `the Quickening Draught bought for ${item(TABLES.items, 'quickening').price} gold and a Leather Coat for ${item(TABLES.items, 'leather_coat').price}`);

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
  const walled = spread(out, d8.x + dry.x, d8.y + dry.y + 1, (x, y) => !(x === d8.x + dry.x && y === d8.y + dry.y) && inBox8(x, y) && out.passable(x, y, { swim: true, climb: true, float: true }) === 'ok');
  ok(walled.size > 800 && !walled.has(cell(out, d8.x + dry.x, d8.y + dry.y - 1)) && !walled.has(cell(out, d8.x + dry.x - 1, d8.y + dry.y - 1)),
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
    && item(TABLES.items, 'leather_coat+2').ac === (item(TABLES.items, 'leather_coat').ac ?? 0) + 2 && item(TABLES.items, 'leather_coat+2').price <= CURVE.glasswold.price - 400,
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
  const shutC8 = spread(out, c8.x + cleft.x, c8.y + cleft.y + 1, (x, y) => !(x === c8.x + cleft.x && y === c8.y + cleft.y) && inBoxC8(x, y) && out.passable(x, y, { swim: true, climb: true, float: true }) === 'ok');
  ok(shutC8.size > 900 && !shutC8.has(cell(out, c8.x + cleft.x, c8.y + cleft.y - 1)) && !shutC8.has(cell(out, c8.x + cleft.x + 1, c8.y + cleft.y - 1)) && chC8(cleft.x, cleft.y - 2) === 'r',
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
    && item(TABLES.items, 'cipher_letter').slot === 'none' && !item(TABLES.items, 'cipher_letter').price,
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
  const atB8 = (x: number, y: number): number => cell(out, b8.x + x, b8.y + y);
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
  const below = spread(out, b8.x + steps.x - 1, b8.y + steps.y, (x, y) => !(x === b8.x + steps.x && y === b8.y + steps.y) && inB8(x, y) && out.passable(x, y, { swim: true, climb: true, float: true }) === 'ok');
  ok(below.size > 700 && !below.has(atB8(steps.x + 1, steps.y)) && !below.has(atB8(scout.x, scout.y)),
    `Kushtash's top is shut but for the steps: none of B8's ${below.size} squares walked, waded, climbed or floated reaches it`);
  see(w, 'wold_b8:b8_scree');
  w.world.travel('wold_b8', steps.x - 1, steps.y, EAST);
  let setStones = false;
  for (let i = 0; i < 20 && !setStones; i++) setStones = w.world.search();
  const upSteps = setStones ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(setStones && upSteps.every((m) => m.kind === 'moved') && w.world.used('b8_steps'), 'searched where the scree is bare, the stones are set and not fallen: steps, going up the face');
  listen(w);
  const topB8 = spread(out, b8.x + steps.x + 1, b8.y + steps.y, (x, y) => !(x === b8.x + steps.x && y === b8.y + steps.y) && inB8(x, y) && out.passable(x, y) === 'ok');
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
  const atB9 = (x: number, y: number): number => cell(out, b9.x + x, b9.y + y);
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
    && !B9.features!.some((f) => f.kind === 'npc' && f.name !== 'Eadmer, the scholar' && (f.quest || f.choice || f.says || f.teaches || f.skill || f.hall || f.interior || f.passage)),
    'three Riders at the fire keep the gap and say what walks out of it, words only, and their words set the watch\'s flag (#531); nobody on the box but the scholar in the gap (#807) asks, takes or teaches');

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
  const unseen = spread(out, b9.x + fireB9.x, b9.y + fireB9.y, (x, y) => inB9(x, y) && out.passable(x, y) === 'ok' && Math.abs(x - b9.x - pair.x) + Math.abs(y - b9.y - pair.y) > (pair.aware ?? 0));
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
  // with a light in it, which the scholar in the gap reads by (#807). Walked, waded, climbed or floated, the cache is never
  // reached but through the dune's side.
  const [dune] = B9.secrets!;
  ok(dune.hint === 'b9_still' && featureB9('b9_still').x === dune.x + 1 && featureB9('b9_still').y === dune.y, 'the dune the wind does not shift lies at the walker\'s side');
  const crust = spread(out, b9.x + dune.x + 1, b9.y + dune.y, (x, y) => !(x === b9.x + dune.x && y === b9.y + dune.y) && inB9(x, y) && out.passable(x, y, { swim: true, climb: true, float: true }) === 'ok');
  ok(crust.size > 600 && !crust.has(atB9(dune.x - 1, dune.y)) && !crust.has(atB9(dune.x - 2, dune.y)),
    `the dune is shut but for its side: none of B9's ${crust.size} squares walked, waded, climbed or floated reaches the walker's chest`);
  see(w, 'wold_b9:b9_still');
  w.world.travel('wold_b9', dune.x + 1, dune.y, WEST);
  let dugB9 = false;
  for (let i = 0; i < 20 && !dugB9; i++) dugB9 = w.world.search();
  const inDune = dugB9 ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(dugB9 && inDune.every((m) => m.kind === 'moved') && w.world.used('b9_walker'), 'searched where the sand slides off, the crust gives, and under it a walker where it stopped, its chest open to the sand');
  listen(w);
  const cache = featureB9('b9_cache'), light = item(TABLES.items, 'glass_light');
  ok(cache.kind === 'chest' && cache.gold > 0 && cache.items.join() === 'glass_light' && cache.x === dune.x - 2 && cache.y === dune.y
    && light.slot === 'none' && !light.price && light.text?.length === 2 && !light.use && !light.skill && !light.resist,
    `in the walker's chest ${cache.kind === 'chest' ? cache.gold : 0} gold and a piece of glass with a light in it, which no shop buys and which does nothing in the hand: the scholar in the gap asks for it (#807)`);
  // Everything a person here says: their words, a hand-in's, their words by flag and their answers'.
  const saidB9 = (f: Feature): readonly string[] => (f.kind === 'npc' ? [...f.lines, ...[f.quest ?? []].flat().flatMap((q) => [...q.done, ...(q.early ?? []), ...(q.after ?? [])]),
    ...(f.says ?? []).flatMap((v) => [...v.lines, ...(v.choice?.answers.flatMap((a) => a.says) ?? [])])] : []);
  const toldB9 = [...B9.features!.flatMap((f) => [...('text' in f && f.text ? [f.text] : []), ...saidB9(f)]), ...light.text!].join(' ');
  ok(!/hull|ship|orbit|voyage|custodian|tower/i.test(toldB9), 'nothing in the box\'s words, the scholar\'s reading among them, or the glass\'s, of what the crown is');

  woldBehind(w, ok);
  fanesMap(ok);
  walkersCarried(ok);
  woldQuests(ok);
  masterOfArms(ok);
  theWarning(ok);
  theBounds(ok);
};

/**
 * The country behind the road (#534), at the boxes' floor, 26. The hills behind the road (E9): north from
 * E10's 4,0 onto its 4,31, walked, the Wold named and no more at 26 and its harder words at 25, and east
 * from D9's 31,20 onto its 0,20, one land and nothing said; the hills' sights, the skull on its pole and
 * a Riders' cairn; the summer camp on the sea grass, a rest, and the herder's and the boy's words; the
 * vultures on the crest, the pride at the pasture's south end and the basilisks on the hills' north end,
 * each won; and the herders' store in the hill where their path stops. The shore (E8): east from Akordu's
 * box at D8's 31,26 onto its 0,26, and north from E9's 10,0 onto its 10,31, one land; the strand's sights
 * and a fire-ring, a rest; the Rider who swims the mares to the island, which a swimmer reaches and
 * nobody on foot; the pride on the strand, the vultures on the boat's ribs and the basilisks at the
 * strand's north end; and the sea-chest in the cleft behind the rope's end. Walked, waded, climbed or
 * floated, neither prize is reached but through its door.
 */
function woldBehind(w: Walk, ok: (cond: boolean, msg: string) => void): void {
  const out = buildMaps()[OUTDOORS];
  const [E9, E8] = ['wold_e9', 'wold_e8'].map((id) => MAP_DEFS.find((d) => d.id === id)!);
  const [e9, e8, d9, d8, e10] = [E9.id, E8.id, 'wold_d9', 'wold_d8', 'emberwaste_e10'].map((id) => out.zones.find((z) => z.id === id)!);
  const WOLD = ATLAS.zones.find((z) => z.id === 'wold')!;
  const feature = (d: MapDef, id: string) => d.features!.find((f) => 'id' in f && f.id === id)!;
  const words = (d: MapDef, name: string): string => {
    const p = d.features!.find((f): f is Person => f.kind === 'npc' && f.name === name)!;
    w.world.travel(d.id, p.x, p.y);
    const text = meet(p, w.party, heard(w.world, p)).text;
    listen(w);
    return text;
  };
  const count = (g: { monsters: readonly string[] }, m: string): number => g.monsters.filter((n) => n === m).length;
  const pride = (g: { monsters: readonly string[] }): boolean => g.monsters.length === 7 && count(g, 'wold_lion') === 4 && count(g, 'vulture') === 3;
  const flock = (g: { monsters: readonly string[] }): boolean => g.monsters.length === 3 && count(g, 'vulture') === 3;
  w.level = 26;
  ok(!!WOLD.maps?.some((m) => `${m.map} ${m.at.join(',')}` === 'wold_e9 136,254') && !!WOLD.maps?.some((m) => `${m.map} ${m.at.join(',')}` === 'wold_e8 136,222')
    && e9.x === e10.x && e9.y + 32 === e10.y && e9.x === d9.x + 32 && e9.y === d9.y && e8.x === e9.x && e8.y + 32 === e9.y && e8.x === d8.x + 32 && e8.y === d8.y
    && [E9, E8].every((d) => d.density === 'country' && d.band?.join('-') === '26-27' && d.region === 'glasswold' && !(d.exits ?? []).length),
    'the hills behind the road, E9, laid at 136,254 over E10 and east of the steppe, and the shore, E8, north of it at 136,222 east of Akordu\'s box: country, band 26-27, nothing taken out of either');

  // The hills behind the road: north from E10's 4,0 onto E9's 4,31, walked, the box's way in, where at 26
  // the Wold is named and no more and at 25 its harder words are said, true off the road over the hills
  // too; and east from D9's 31,20 onto its 0,20, one land and nothing said.
  const cross = (level: number): { r: ReturnType<typeof w.world.move>; on: Walk } => {
    const from = newWalk(ok);
    for (const m of from.party.members) m.level = level;
    from.world.travel(e10.id, E9.start.x, 0, NORTH);
    return { r: from.world.move('forward'), on: from };
  };
  const due = cross(26), one = cross(25);
  ok(due.r.kind === 'moved' && due.on.world.zone?.id === E9.id && due.on.world.state.x === e9.x + 4 && due.on.world.state.y === e9.y + 31
    && E9.start.x === 4 && E9.start.y === 31 && E9.start.facing === NORTH && due.r.messages.join(' / ') === 'The Wold.',
    `north from E10's 4,0 onto E9's 4,31, walked, the box's way in: at 26 the Wold named, no more (${said(due.r)})`);
  ok(one.r.kind === 'moved' && one.r.messages.join(' / ') === `The Wold. ${WOLD.crossing?.harder}`, `at 25 the Wold's harder words, true off the road over the hills too (${said(one.r)})`);
  w.world.travel(d9.id, 31, 20, EAST);
  const east = w.world.move('forward');
  ok(east.kind === 'moved' && w.world.zone?.id === E9.id && w.world.state.x === e9.x && w.world.state.y === e9.y + 20 && !east.messages.some((m) => m.startsWith('The Wold')),
    `east from D9's 31,20 onto E9's 0,20, walked, one land and nothing said (${said(east)})`);
  listen(w);

  // Up onto the hills: the pale sky over them, the Waste's ash at their foot, the folds and a horse the
  // vultures had; the steppe down the west; the brow over the sea and a ewe gone to stone; the herds on
  // the sea grass, the sea and the coast toward the Waste; the skull on its pole and a Riders' cairn.
  for (const id of ['e9_hills', 'e9_ash', 'e9_folds', 'e9_bones', 'e9_steppe', 'e9_brow', 'e9_ewe', 'e9_cropped', 'e9_herd', 'e9_sea', 'e9_coast']) see(w, `${E9.id}:${id}`);
  const skull = feature(E9, 'e9_shrine');
  w.world.travel(E9.id, skull.x, skull.y);
  const kneltAt = w.world.featureHere();
  ok(kneltAt?.kind === 'shrine' && skull.kind === 'shrine' && E9.rows[skull.y][skull.x] === '^' && useShrine(w.world, w.party, kneltAt)[0] === skull.text, 'the company kneels at the skull on its pole on the rise');
  listen(w);
  const cairn9 = feature(E9, 'e9_cairn');
  const ground = (ch: string): number => E9.rows.join('').split('').filter((c) => c === ch).length;
  ok(cairn9.kind === 'cairn' && cairn9.gold === 400 && cairn9.items.join() === 'elixir' && E9.rows[cairn9.y][cairn9.x] === '^'
    && ground('^') > ground('s') && ground('^') > ground(',') && !E9.rows.some((r) => r.includes('=')),
    `a Riders' cairn on a hilltop with gold and an Elixir; the hills the most of the box, ${ground('^')} squares to the steppe's ${ground('s')} and the sea grass's ${ground(',')}, and no road through them`);

  // The Riders' summer camp on the sea grass: a rest, and the herder and the boy, words only.
  const camp9 = E9.features!.find((f) => f.kind === 'camp')!;
  w.world.travel(E9.id, camp9.x, camp9.y);
  ok(restRefused(w.world) === '' && E9.rows[camp9.y][camp9.x] === ',', 'the Riders\' summer camp on the sea grass, where a company may rest');
  const herder = words(E9, 'A herder at the yurts'), boy = words(E9, 'A boy with a foal');
  ok(herder.includes('lions come after them') && herder.includes('north end') && boy.includes('Mares swim')
    && ![E9, E8].some((d) => d.features!.some((f) => f.kind === 'npc' && (f.quest || f.choice || f.says || f.teaches || f.skill || f.hall || f.interior || f.passage || f.flag))),
    'the herder: the lions follow the herds, and on the hills\' north end the ewes stand still for ever; the boy: mares swim and lions will not; words only in both boxes');

  // The groups, each won at 26: the vultures on the crest, the pride at the pasture's south end after the
  // herd, its vultures with it, and the two basilisks on the hills' north end, the hardest. Nothing of the
  // Glass in either box.
  const g9 = (id: string) => E9.encounters!.find((g) => g.id === id)!;
  ok(E9.encounters!.length === 3 && flock(g9('e9_vultures')) && pride(g9('e9_pride')) && g9('e9_basilisks').monsters.join() === 'basilisk,basilisk' && E9.rows[g9('e9_basilisks').y][g9('e9_basilisks').x] === '^'
    && [E9, E8].every((d) => d.encounters!.every((g) => g.respawn === RESPAWN.twoDays && !g.slainText && g.monsters.every((m) => ['wold_lion', 'vulture', 'basilisk'].includes(m)))),
    'three vultures on the crest, a pride of four lions and three vultures on the pasture and two basilisks on the hills\' north end; nothing of the Glass in either box');
  for (const g of E9.encounters!) fight(w, `${E9.id}:${g.id}`);

  // The secret: the herders' path up the hillside to the slab it stops at, searched; their store dug into
  // the hill behind it, with a strongbox.
  const [slab] = E9.secrets!;
  ok(slab.hint === 'e9_path' && feature(E9, 'e9_path').x === slab.x + 1 && feature(E9, 'e9_path').y === slab.y, 'the herders\' path stops at the slab\'s side');
  const store = reach(out, e9, [slab.x + 1, slab.y], { swim: true, climb: true, float: true }, [slab.x, slab.y]);
  ok(store.size > 800 && !store.has(square(out, e9, slab.x - 1, slab.y)) && !store.has(square(out, e9, slab.x - 2, slab.y)),
    `the store is shut but for the slab: none of E9's ${store.size} squares walked, waded, climbed or floated reaches it`);
  see(w, `${E9.id}:e9_path`);
  ok(search(w, E9.id, slab.x + 1, slab.y, WEST, 'e9_store'), 'searched where the path stops, the slab gives, and the herders\' store behind it can be walked into');
  const box9 = feature(E9, 'e9_strongbox');
  ok(box9.kind === 'chest' && box9.gold === 1200 && box9.items.join() === 'potion_sp_great' && box9.x === slab.x - 2 && box9.y === slab.y, 'in the store, the herders\' strongbox: 1,200 gold and a Sapphire Vial');

  // The shore: east from Akordu's box at D8's 31,26 onto E8's 0,26, walked, the box's way in, and north
  // from E9's 10,0 onto its 10,31, one land and nothing said either way.
  w.world.travel(d8.id, 31, 26, EAST);
  const shore = w.world.move('forward');
  ok(shore.kind === 'moved' && w.world.zone?.id === E8.id && w.world.state.x === e8.x && w.world.state.y === e8.y + 26 && E8.start.x === 0 && E8.start.y === 26 && E8.start.facing === EAST
    && !shore.messages.some((m) => m.startsWith('The Wold')), `east from D8's 31,26 onto E8's 0,26, walked, the box's way in, one land and nothing said (${said(shore)})`);
  listen(w);
  w.world.travel(E9.id, 10, 0, NORTH);
  const up = w.world.move('forward');
  ok(up.kind === 'moved' && w.world.zone?.id === E8.id && w.world.state.x === e8.x + 10 && w.world.state.y === e8.y + 31 && !up.messages.some((m) => m.startsWith('The Wold')),
    `north from E9's 10,0 onto E8's 10,31, walked, one land and nothing said (${said(up)})`);
  listen(w);

  // Down the strand: the sea, a mare the lions had, a boat nobody on the Wold built, Akordu's smoke, a gull
  // gone to stone and the strand narrowing north to nothing; a fire-ring above the tide-line, a rest.
  for (const id of ['e8_strand', 'e8_mare', 'e8_boat', 'e8_smoke', 'e8_gull', 'e8_narrows']) see(w, `${E8.id}:${id}`);
  const camp8 = E8.features!.find((f) => f.kind === 'camp')!;
  w.world.travel(E8.id, camp8.x, camp8.y);
  ok(restRefused(w.world) === '', 'a fire-ring above the tide-line, where a company may rest');

  // The Rider who swims the mares to the island, words only; the island and its cairn, and another island's
  // south end, reached over the bars of shallows by a swimmer and by nobody on foot.
  const rider = words(E8, 'A Rider at the water\'s edge');
  const cairn8 = feature(E8, 'e8_cairn');
  const afoot = reach(out, e8, [E8.start.x, E8.start.y], {}), swum = reach(out, e8, [E8.start.x, E8.start.y], { swim: true });
  ok(rider.includes('swim the mares') && rider.includes('never had a lion') && cairn8.kind === 'cairn' && cairn8.gold === 300 && cairn8.items.join() === 'elixir'
    && [cairn8, feature(E8, 'e8_island'), feature(E8, 'e8_tip')].every((f) => swum.has(square(out, e8, f.x, f.y)) && !afoot.has(square(out, e8, f.x, f.y))),
    'the Rider at the water\'s edge swims the mares to the island, where no lion has been; its cairn, gold and an Elixir, and another island\'s south end are reached by a swimmer over the shallows, and not on foot');

  // The groups, each won at 26: the pride on the strand after the mares, its vultures with it, the vultures
  // on the boat's ribs and the two basilisks at the strand's north end, the hardest.
  const g8 = (id: string) => E8.encounters!.find((g) => g.id === id)!;
  ok(E8.encounters!.length === 3 && pride(g8('e8_pride')) && flock(g8('e8_vultures')) && g8('e8_basilisks').monsters.join() === 'basilisk,basilisk',
    'a pride of four lions and three vultures on the strand, three vultures on the boat\'s ribs and two basilisks at the strand\'s north end');
  for (const g of E8.encounters!) fight(w, `${E8.id}:${g.id}`);

  // The secret: the rope's end out of the black rocks, searched; the cleft behind them, with a sea-chest.
  const [crack] = E8.secrets!;
  ok(crack.hint === 'e8_rope' && feature(E8, 'e8_rope').x === crack.x - 1 && feature(E8, 'e8_rope').y === crack.y, 'the rope\'s end hangs out of the rocks at the crack\'s side');
  const cleft = reach(out, e8, [crack.x - 1, crack.y], { swim: true, climb: true, float: true }, [crack.x, crack.y]);
  ok(cleft.size > 400 && !cleft.has(square(out, e8, crack.x + 1, crack.y)) && !cleft.has(square(out, e8, crack.x + 2, crack.y)),
    `the cleft is shut but for the crack: none of E8's ${cleft.size} squares walked, waded, climbed or floated reaches it`);
  see(w, `${E8.id}:e8_rope`);
  ok(search(w, E8.id, crack.x - 1, crack.y, EAST, 'e8_cleft'), 'searched where the rope\'s end hangs, the rock gives, and the cleft behind it can be walked into');
  const chest8 = feature(E8, 'e8_sea_chest');
  ok(chest8.kind === 'chest' && chest8.gold === 1200 && chest8.items.join() === 'potion_sp_great' && chest8.x === crack.x + 2 && chest8.y === crack.y, 'in the cleft, the sea-chest: 1,200 gold and a Sapphire Vial');
  const told = [E9, E8].flatMap((d) => d.features!.flatMap((f) => [...('text' in f && f.text ? [f.text] : []), ...(f.kind === 'npc' ? f.lines : [])])).join(' ');
  ok(!/glass|hull|ship|orbit|voyage|custodian|tower/i.test(told), 'nothing in either box\'s words of the Glass, or of what the crown is');
}

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
  const log = (id: string, bag = w.party.bag) => questLog(TABLES, w.world.state, { ...w.party, bag }).find((v) => v.def.id === id);
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
  const held = meet(fane, w.party, heard(w.world, fane)).choice?.answers[0], given = held ? answer(TABLES.items, held, w.party) : '';
  listen(w);
  ok(!!w.party.flags.meridian_map && w.party.bag.includes('fane_map') && given.includes('Fane\'s Map') && log('scout_map')?.goal === 'Take Fane\'s map up Kushtash to Aysu.'
    && !!log('scout_map')?.pages[0].entries.some((e) => e.id === 'fane'),
    `at his fire Fane gives his map, sewn shut, and the log sends the company back up to Aysu (${log('scout_map')?.goal})`);
  walkThrough(w, 'meridian_camp3', ROPE.x, ROPE.y + 1, NORTH, 'firemount_g11', 1);

  // On Kushtash: the map in the pack, her question; given, she takes it and the third is taught for it.
  const gold = w.party.gold, asked = talk(), give = asked.choice?.answers.find((a) => a.takes === 'fane_map');
  const handed = give ? answer(TABLES.items, give, w.party) : '';
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
 * The Sorcerer's third (#807), What the Walkers Carried, played by companies of 27 at the Glass's edge. The
 * glasses first: Cassian, a Thaumaturge, is sent to Eadmer and the world map marks the gap's box; the etched
 * glass from the fallen walker's hollow on the steppe and the light from the half-buried walker's cache in
 * the dunes carried to him, at his first meeting he takes the etching, which begins the quest and ends the
 * seeking, the third waiting; at the next he asks for the light and reads the one by it, the deed; his menu
 * teaches the Magus for it and no gold, which ends the quest, and after, his own words. The ask first: his own
 * words, then his ask, once, which begins it; the light brought before the etching is not asked for. With
 * no sorcerer: his own words and never the ask, the glasses taken and the etching read all the same, no
 * quest begun and nobody to teach. The glasses at 26, the sorcerer short of the level: the etching taken,
 * "Not yet" answered and the question put again, the light given and the etching read, and no quest; at 27
 * the quest opens on the way back to him, the seeking done and the map marking nothing, and he teaches.
 */
function walkersCarried(ok: (cond: boolean, msg: string) => void): void {
  const [B9, D9] = ['wold_b9', 'wold_d9'].map((id) => MAP_DEFS.find((d) => d.id === id)!);
  const scholar = B9.features!.find((f): f is Person => f.kind === 'npc' && f.name === 'Eadmer, the scholar')!;
  const teaching = scholar.teaches!, [hand] = [scholar.quest!].flat(), own = scholar.lines.join('\n\n');
  const hollow = chest(D9, 'd9_hollow'), cache = chest(B9, 'b9_cache');
  ok(scholar.x === 30 && scholar.y === 27 && teaching.cls === 'sorcerer' && teaching.prestige === 3 && teaching.asks === 'walkers_carried' && JSON.stringify(teaching.done) === JSON.stringify({ flag: ETCHING_READ })
    && hand.item === 'etched_glass' && hand.reward === 0 && hand.setFlag === ETCHING_GIVEN && hollow.items.includes('etched_glass') && cache.items.join() === 'glass_light',
    'Eadmer sits on the gap\'s last sand, a square short of the glass: he takes the fallen walker\'s etched glass for nothing, and his teaching waits on the etching read by the half-buried walker\'s light');

  /** A company of 27, or `LEVEL`, whose sorcerer has the second, or, `none`, with a druid in the sorcerer's place. */
  const company = (none = false, LEVEL = 27): { w: Walk; log: (id: string) => ReturnType<typeof questLog>[number] | undefined } => {
    const w = newWalk(ok);
    if (none) w.party.members[5] = createCharacter(TABLES, 'Cassian', 'human', 'druid', {}, makeRng(807));
    w.level = LEVEL;
    for (const m of w.party.members) { m.level = LEVEL; m.xp = xpForLevel(LEVEL); }
    if (!none) { takePrestige(w.party.members[5]); takePrestige(w.party.members[5]); }
    listen(w);
    return { w, log: (id) => questLog(TABLES, w.world.state, w.party).find((v) => v.def.id === id) };
  };
  const talk = (w: Walk): ReturnType<typeof meet> => { w.world.travel('wold_b9', scholar.x, scholar.y); const m = meet(scholar, w.party, heard(w.world, scholar)); listen(w); return m; };
  /** A walker's chest opened where it lies, as the box's walk reaches it. */
  const loot = (w: Walk, map: string, c: typeof hollow): void => {
    w.world.travel(map, c.x, c.y);
    ok(!w.world.used(c.id), `${map}'s ${c.id} is there to open`);
    w.world.markUsed(c.id); w.party.gold += c.gold; w.party.bag.push(...c.items);
    listen(w);
  };
  /** His question with the light in the pack, and the light given. */
  const giveLight = (w: Walk): { ask?: string; said: string; give?: Answer } => {
    const m = talk(w), give = m.choice?.answers.find((a) => a.takes === 'glass_light'), said = give ? answer(TABLES.items, give, w.party) : '';
    listen(w);
    return { ask: m.choice?.ask, said, give };
  };

  { // The glasses first.
    const { w, log } = company(), cassian = w.party.members[5];
    const sent = log(seekId(5, 3)), marked = sought(questLog(TABLES, w.world.state, w.party)).find((s) => s.at === 'wold_b9');
    ok(cassian.cls === 'sorcerer' && className(cassian) === 'Thaumaturge' && sent?.goal === 'Find Eadmer, the scholar in The Wold.' && sent.pages[0].entries[0]?.text === teaching.seek
      && marked?.who.includes(cassian.name) === true && !log('walkers_carried'),
      `the glasses first: at 27 with the second, Cassian is sent to Eadmer (${sent?.goal}), the world map marks the gap's box for him, and the quest is not in the log`);
    loot(w, 'wold_d9', hollow);
    loot(w, 'wold_b9', cache);
    const gold = w.party.gold, first = talk(w);
    ok(first.text === hand.done.join('\n\n') && !first.choice && !w.party.bag.includes('etched_glass') && w.party.bag.includes('glass_light') && !!w.party.flags[ETCHING_GIVEN] && w.party.gold === gold
      && log(seekId(5, 3))?.done === true && log('walkers_carried')?.done === false && log('walkers_carried')?.goal === 'Bring Eadmer what the walker in the dunes at the Glass\'s edge carried.'
      && barOf(teaching, cassian, w.party, w.world.state) === 'the quest first' && !teach(teaching, w.party, w.world.state, 5).taught,
      `the glasses first: at his first meeting he takes the etched glass for nothing (${hand.done[1]}), which begins ${log('walkers_carried')?.def.title} and ends the seeking; the light stays in the pack, and the third waits`);
    const { ask, said, give } = giveLight(w);
    ok(!!give && said.startsWith(give.says.join('\n\n')) && !w.party.bag.includes('glass_light') && !!w.party.flags[ETCHING_READ] && log('walkers_carried')?.done === false
      && log('walkers_carried')?.goal === 'Go back to Eadmer at the Glass\'s edge, and learn how a Magus reads.' && log('walkers_carried')?.pages[0].entries.map((e) => e.id).join() === 'etching,read',
      `the glasses first: at the next, the light in the pack, his question (${ask}); given, he reads the one by the other's light (${give?.says[1]}), the deed his teaching waits on`);
    const [offer] = offers(teaching, w.party, w.world.state), r = teach(teaching, w.party, w.world.state, 5);
    listen(w);
    ok(offer?.who === 5 && offer.bar === '' && offer.price === 0 && r.taught && className(cassian) === 'Magus' && w.party.gold === gold && log('walkers_carried')?.done === true && log('walkers_carried')?.goal === null,
      `the glasses first: his menu teaches the third, earned, for no gold (${r.line}), and that ends the quest`);
    const after = [talk(w), talk(w)];
    ok(after.every((m) => m.text === own && !m.choice) && !w.party.flags[SCHOLAR_ASKED], 'after, his own words, and never the ask');
  }

  { // The ask first; the light found before the etching.
    const { w, log } = company(), cassian = w.party.members[5];
    const [first, asked, again] = [talk(w), talk(w), talk(w)].map((m) => m.text);
    ok(first === own && !!w.party.flags['b9_scholar_met'] && asked.includes('Bring me both') && again === own && !!w.party.flags[SCHOLAR_ASKED] && log(seekId(5, 3))?.done === true
      && log('walkers_carried')?.goal === 'Find what the walker fallen on the steppe carried.' && barOf(teaching, cassian, w.party, w.world.state) === 'the quest first',
      `the ask first: his own words, then his ask, once (${asked.split('\n\n')[1]}), which begins the quest and ends the seeking; the log sends the company to the steppe`);
    loot(w, 'wold_b9', cache);
    const early = talk(w);
    ok(early.text === own && !early.choice && w.party.bag.includes('glass_light') && log('walkers_carried')?.goal === 'Find what the walker fallen on the steppe carried.',
      'the ask first: the light brought before the etching is not asked for, and the log still sends the company to the steppe');
    loot(w, 'wold_d9', hollow);
    ok(log('walkers_carried')?.goal === 'Take the etched glass to Eadmer at the Glass\'s edge.', `the ask first: the etching in the pack, the log sends it to him (${log('walkers_carried')?.goal})`);
    const took = talk(w), { give } = giveLight(w);
    const r = teach(teaching, w.party, w.world.state, 5);
    ok(took.text === hand.done.join('\n\n') && !!give && !!w.party.flags[ETCHING_READ] && log('walkers_carried')?.done === true && log('walkers_carried')?.pages[0].entries.map((e) => e.id).join() === 'asked,etching,read'
      && r.taught && className(cassian) === 'Magus',
      'the ask first: the etching taken, then the light at his question, the quest done in three entries and the Magus taught');
  }

  { // No sorcerer.
    const { w, log } = company(true);
    const first = talk(w), asked = talk(w);
    ok(first.text === own && asked.text === own && !w.party.flags[SCHOLAR_ASKED] && !w.party.members.some((m) => m.cls === 'sorcerer') && !offers(teaching, w.party, w.world.state).length
      && noneHere(teaching) === '"I teach sorcerers. I see none here."',
      'no sorcerer: his own words, never the ask, and nobody for his menu to teach');
    loot(w, 'wold_d9', hollow);
    loot(w, 'wold_b9', cache);
    const took = talk(w), { give, said } = giveLight(w);
    ok(took.text === hand.done.join('\n\n') && !!give && said.startsWith(give.says.join('\n\n')) && !w.party.bag.includes('etched_glass') && !w.party.bag.includes('glass_light') && !!w.party.flags[ETCHING_READ]
      && !log('walkers_carried') && !questLog(TABLES, w.world.state, w.party).some((v) => v.def.id.startsWith('seek:') && v.def.id.endsWith(':3')),
      'no sorcerer: the glasses taken and the etching read all the same, and no quest begun for it');
  }

  { // The glasses at 26, before the sorcerer is 27: what the quest's end on the Magus is for.
    const { w, log } = company(false, 26), cassian = w.party.members[5];
    loot(w, 'wold_d9', hollow);
    loot(w, 'wold_b9', cache);
    const took = talk(w), wait = talk(w), no = wait.choice?.answers.find((a) => !a.takes), kept = no ? answer(TABLES.items, no, w.party) : '';
    const { give } = giveLight(w);
    ok(took.text === hand.done.join('\n\n') && wait.choice?.ask === 'Give him the glass with a light?' && !!no && kept === no.says.join('\n\n') && !!give && !!w.party.flags[ETCHING_READ]
      && !log('walkers_carried') && !log(seekId(5, 3)) && !!barOf(teaching, cassian, w.party, w.world.state),
      'the glasses at 26: he takes the etching, "Not yet" keeps the question, and given the light he reads; no quest opens, no seeking, and the third waits on the level');
    cassian.level = 27; cassian.xp = xpForLevel(27);
    const news = listen(w), marked = sought(questLog(TABLES, w.world.state, w.party)).some((s) => s.at === 'wold_b9');
    ok(news.includes('New quest: What the Walkers Carried.') && log('walkers_carried')?.done === false && log('walkers_carried')?.goal === 'Go back to Eadmer at the Glass\'s edge, and learn how a Magus reads.'
      && log(seekId(5, 3))?.done === true && !marked,
      `the glasses at 26: at 27 the quest opens on the way back to him (${log('walkers_carried')?.goal}), the seeking done and the map marking nothing, as for the other thirds`);
    const gold = w.party.gold, r = teach(teaching, w.party, w.world.state, 5);
    listen(w);
    ok(r.taught && className(cassian) === 'Magus' && w.party.gold === gold && log('walkers_carried')?.done === true,
      `the glasses at 26: back at the gap the Magus is taught for no gold (${r.line}), which ends the quest`);
  }
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
  const told = QUESTS.filter((q) => q.id !== 'scout_map').flatMap((q) => [...q.entries.map((e) => e.text), ...q.goals.map((g) => g.text)]).join(' ');
  ok(!/hull|ship|orbit|voyage|custodian/i.test(told), 'nothing in the side quests\' log of a hull, a ship, an orbit, a voyage or a Custodian');

  // The Horse That Came Back (#56's 51), at 26: 1,200 xp either way, 200 a member.
  const CADOR = npc('cinderport', 'Cador Lusk, of the Cartographers\' Guild'), HAMMER = npc('wold_d8', 'A Rider with a hammer'), HORSE = ev('wold_d8', 'd8_horse');
  for (const how of ['whole', 'unasked', 'broken'] as const) {
    const w = walkAt(ok, 26);
    if (how !== 'unasked') {
      ok(hear(w, 'cinderport', CADOR).includes('I want it whole') && began(w, 'The Horse That Came Back') && /tethered at Akordu/.test(goal(w, 'horse_back')),
        `${how}: Cador Lusk at the Chart House wants what sits the horse that came back, whole (${goal(w, 'horse_back')})`);
      see(w, 'wold_d9:d9_horse');
      see(w, 'wold_b9:b9_horse');
    }
    ok(there(w, 'wold_d8', HORSE), `${how}: at Akordu the horse that came back stands tethered apart, the thing in its saddle still`);
    const xp = xpOf(w.party);
    if (how === 'broken') {
      const said = answerTo(w, 'wold_d8', HAMMER, HORSE_BROKEN);
      ok(xpOf(w.party) - xp === 1200 && said.includes('south-west') && !there(w, 'wold_d8', HORSE) && hear(w, 'wold_d8', HAMMER).includes('never moved') && hear(w, 'cinderport', CADOR).includes('no glass'),
        `broken: the Rider breaks it, 1,200 xp between the six, and says what it did on the way home (${said.split('\n\n')[1]})`);
      reads(w, 'horse_back', ['cador', 'dunes', 'prints', 'broken'], ['carried', 'whole'], how);
      continue;
    }
    const said = answerTo(w, 'wold_d8', HAMMER, HORSE_CARRIED);
    ok(xpOf(w.party) - xp === 1200 && w.party.bag.includes('saddle_walker') && !there(w, 'wold_d8', HORSE) && began(w, 'The Horse That Came Back')
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
    const w = walkAt(ok, 27);
    ok(there(w, 'wold_d8', BOY) && !there(w, 'wold_b8', BOY_B8) && hear(w, 'wold_d8', BOY).includes('let him die') && began(w, 'The Lion\'s Share') && /hunt the Grey Lion with him/.test(goal(w, 'lions_share')),
      `${how}: the young Rider at Akordu, and not at the hunters' fire, wants the last blow (${goal(w, 'lions_share')})`);
    if (how === 'taken') {
      const xp = xpOf(w.party);
      fight(w, LION_DOWN);
      ok(hear(w, 'wold_d8', BOY).includes('was not mine') && !!w.party.flags[LION_TAKEN] && xpOf(w.party) === xp, 'taken: the Grey Lion killed before the boy is answered, his blow never struck, and nothing paid');
      reads(w, 'lions_share', ['boy', 'taken'], ['hunt', 'blow', 'left', 'rest'], how);
      continue;
    }
    if (how === 'blow') {
      const xp = xpOf(w.party), said = answerTo(w, 'wold_d8', BOY, LION_HUNT);
      ok(xpOf(w.party) === xp && !there(w, 'wold_d8', BOY) && there(w, 'wold_b8', BOY_B8) && /Bring the Grey Lion down/.test(goal(w, 'lions_share')) && hear(w, 'wold_b8', BOY_B8).includes('leave the last blow to me'),
        `blow: the company will hunt with him, and he is at the hunters' fire and gone from Akordu (${said.split('\n\n')[1]})`);
      fight(w, LION_DOWN);
      ok(/young Rider at the hunters' fire/.test(goal(w, 'lions_share')), `blow: the Grey Lion down on his ground, the log sends the company back to the boy (${goal(w, 'lions_share')})`);
      const before = xpOf(w.party), blow = answerTo(w, 'wold_b8', BOY_B8, LION_BLOW);
      ok(xpOf(w.party) - before === 1500 && blow.includes('He is a Rider') && hear(w, 'wold_b8', BOY_B8).includes('somebody else'),
        `blow: the last blow the boy's, 1,500 xp between the six (${blow.split('\n\n')[0]})`);
      reads(w, 'lions_share', ['boy', 'hunt', 'blow'], ['left', 'rest', 'taken'], how);
      continue;
    }
    const story = hear(w, 'wold_d8', ELDEST), xp = xpOf(w.party), said = answerTo(w, 'wold_d8', BOY, LION_LEFT);
    ok(story.includes('the sky opened') && xpOf(w.party) - xp === 1500 && there(w, 'wold_d8', BOY) && hear(w, 'wold_d8', BOY).includes('ask again') && /rest of the eldest's story/.test(goal(w, 'lions_share')),
      `rest: the old lion let die, 1,500 xp between the six, and the boy stays at Akordu (${said.split('\n\n')[1]})`);
    const rest = hear(w, 'wold_d8', ELDEST), after = hear(w, 'wold_d8', ELDEST);
    ok(rest.includes('on its end') && rest.includes('crown') && !!w.party.flags[LION_TOLD] && after.includes('all of it now') && !/hull|ship|orbit|voyage|custodian/i.test(rest),
      `rest: the eldest tells the rest, once, and no word of what the crown is (${rest.split('\n\n')[1]})`);
    reads(w, 'lions_share', ['boy', 'left', 'rest'], ['hunt', 'blow', 'taken'], how);
    fight(w, LION_DOWN);
    ok(hear(w, 'wold_d8', BOY).includes('Then you killed him'), 'rest: the Grey Lion still stands to be fought, no lock, and killed after all the boy says so');
  }

  // Orders on the Scarp Stair (#56's 54), at 27: 1,500 xp whichever of the three, 250 a member.
  const HENDRA = npc('cinderport', 'Hendra, the Compact\'s factor'), RUNNER = npc('wold_c8', 'A Compact runner'), orders = item(TABLES.items, 'riders_orders');
  for (const [how, sets] of [['sealed', ORDERS_SEALED], ['told', ORDERS_TOLD], ['burned', ORDERS_BURNED]] as const) {
    const w = walkAt(ok, 27);
    ok(hear(w, 'cinderport', HENDRA).includes('Carry them the rest of the way') && began(w, 'Orders on the Scarp Stair') && /runner on the Scarp stair/.test(goal(w, 'scarp_orders')),
      `${how}: Hendra, the Compact's factor, sends the company up the Scarp stair after her runner (${goal(w, 'scarp_orders')})`);
    const given = answerTo(w, 'wold_c8', RUNNER, ORDERS_CARRIED);
    ok(w.party.bag.includes('riders_orders') && orders.slot === 'none' && !orders.price && !!orders.text?.join(' ').includes('silver') && hear(w, 'wold_c8', RUNNER).includes('Down is worse')
      && /eldest at Akordu/.test(goal(w, 'scarp_orders')),
      `${how}: on the top flight the runner gives up her orders, which read from the pack (${given.split('\n\n')[1]})`);
    hear(w, 'wold_d8', ELDEST);
    const xp = xpOf(w.party), said = answerTo(w, 'wold_d8', ELDEST, sets);
    ok(xpOf(w.party) - xp === 1500 && !w.party.bag.includes('riders_orders') && hear(w, 'cinderport', HENDRA).includes('Ruan will read')
      && hear(w, 'wold_c8', RUNNER).includes('look at faces') === (how === 'burned'),
      `${how}: the eldest has the orders, 1,500 xp between the six${how === 'burned' ? ', and the runner climbs again' : ''} (${said.split('\n\n')[1]})`);
    reads(w, 'scarp_orders', ['factor', 'runner', how], ['sealed', 'told', 'burned'].filter((e) => e !== how), how);
  }

  // The Garden of Glass (#56's 55), at 28: 1,800 xp lifted at the temple or by a draught, 300 a member.
  const MOTHER = npc('wold_d8', 'A woman among the figures'), PRIEST = npc('cinderport', 'A priest of the Harbour Temple'), FIGURE = ev('wold_d8', 'd8_figure');
  for (const [how, sets] of [['lifted', GARDEN_LIFTED], ['draught', GARDEN_DRAUGHT]] as const) {
    const w = walkAt(ok, 28);
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
    addCondition(TABLES.items, stoned, 'stoned');
    const price = PRIEST.says?.flatMap((s) => s.choice?.answers ?? []).find((a) => a.sets === GARDEN_LIFTED)?.price ?? 0;
    const gold = w.party.gold, xp = xpOf(w.party), woke = answerTo(w, 'cinderport', PRIEST, sets);
    ok(price === templePrice(stoned) && xpOf(w.party) - xp === 1800 && woke.includes('a crown standing up in the Glass') && !!item(TABLES.items, 'quickening').use?.cure?.includes('stoned')
      && (how === 'lifted' ? w.party.gold === gold - price : w.party.gold === gold && !w.party.bag.includes('quickening')),
      `${how}: ${how === 'lifted' ? `the stone lifted at the temple's price, ${price} gold, 80 a level at 28` : 'a Quickening Draught lifts the stone'}, 1,800 xp between the six, and he wakes (${woke.split('\n\n')[1]})`);
    ok(hear(w, 'cinderport', PRIEST).includes('went home') && hear(w, 'wold_d8', MOTHER).includes('her son beside her') && !/hull|ship|orbit|voyage|custodian/i.test(woke),
      `${how}: he went home on the Riders' ride, and sits by his mother among the figures`);
    reads(w, 'glass_garden', ['mother', 'mesas', 'carried', 'temple', 'woke'], [], how);
  }
}

/**
 * The Master of arms (#858), found and never told, played by a company at the Wold's floor, 26, whose fighters
 * are given Expert at arms and the gold directly: Expert is bought at a town trainer elsewhere on the road
 * (#852), and what is played here is the Master. The rumour at Akordu's trader's tent, in the Riders' words, of the mesas; the
 * small mesa's door, found from the arrows in its foot, shut to every walker, wader, climber and floater but
 * through it, and the hollow behind it with Mergen in it; his words, which hint at the bow the herders keep,
 * and his menu, which refuses every member before the favour; the herders' store on E9, found from the path
 * that stops at the slab, and the bow at the back of it; the bow handed in, which sets the flag his
 * teaching waits on; and the Master taught to the member Expert at arms of 25, the level he asks, for 5,000,
 * where the one of 24 is refused. He is off the road and off the chapter's path by more than ten squares, and so
 * is the bow, and no quest, seeking or mark names him.
 */
function masterOfArms(ok: (cond: boolean, msg: string) => void): void {
  const g = headlessGame(4), p = g.party, LEVEL = 26;
  const w: Walk = { world: g.world, party: p, news: [], level: LEVEL, ok, marks: questMarks(questLog(TABLES, g.world.state, p)) };
  for (const m of p.members) { m.level = LEVEL; m.xp = xpForLevel(LEVEL); }
  const out = buildMaps()[OUTDOORS];
  const [D8, D10, E9] = ['wold_d8', 'wold_d10', 'wold_e9'].map((id) => MAP_DEFS.find((d) => d.id === id)!);
  const [d10, e9] = [zone(out, D10.id), zone(out, E9.id)];
  const feature = (d: MapDef, id: string) => d.features!.find((f) => 'id' in f && f.id === id)!;
  const who = (d: MapDef, name: string): Person => d.features!.find((f): f is Person => f.kind === 'npc' && f.name === name)!;
  const rider = who(D8, 'A Rider by the trader\'s tent'), mergen = who(D10, 'Mergen, the drillmaster'), herder = who(E9, 'A herder at the yurts');
  const shop = D8.features!.find((f) => f.kind === 'shop')!, mastery = mergen.mastery!;
  const [, door] = D10.secrets!, [slab] = E9.secrets!, chest = feature(E9, 'e9_drill_bow'), hint = feature(D10, door.hint), path9 = feature(E9, slab.hint);
  const chebyshev = (a: readonly [number, number], b: readonly [number, number]): number => Math.max(Math.abs(a[0] - b[0]), Math.abs(a[1] - b[1]));

  // What he is: a Master of arms for 5,000 at 25 who waits on the hand-in of the bow and on nothing else, a
  // person whose words close onto his menu; the flag his teaching tests is set by that hand-in alone.
  const setters = MAP_DEFS.flatMap((d) => (d.features ?? []).filter((f): f is Person => f.kind === 'npc' && personFlags(f).includes(MASTER_FAVOUR)).map((f) => `${d.id}:${f.name}`));
  const [hand] = handIns(mergen);
  ok(mastery.line === 'arms' && mastery.tier === 'master' && mastery.price === TIER_PRICES.master && mastery.price === 5000 && JSON.stringify(mastery.done) === JSON.stringify({ flag: MASTER_FAVOUR })
    && handIns(mergen).length === 1 && hand.item === 'drill_bow' && hand.setFlag === MASTER_FAVOUR && hand.reward === 0 && setters.join() === `wold_d10:${mergen.name}`
    && !mergen.choice && !mergen.passage && !mergen.teaches && !mergen.skill && !mergen.interior && !mergen.hall,
    `Mergen teaches Master at arms for ${mastery.price} gold, once the bow is handed in (${hand.setFlag}), and nothing else: his words close onto his menu`);

  // Found, never told: no seeking quest or mark, no atlas place, and nothing the journal says names him or his
  // door; the world map marks nothing on D10.
  const quests = AREAS.flatMap((a) => [...(a.quests ?? []), ...(a.chapter ? [a.chapter] : [])]);
  const told = quests.flatMap((q) => [q.title, ...q.entries.map((e) => e.text), ...q.goals.map((x) => x.text)]).filter((t) => /Mergen|drillmaster|Drill Bow|small mesa/i.test(t));
  const marked = quests.filter((q) => q.mark && q.goals.some((x) => x.at === D10.id));
  ok(!told.length && !marked.length && !TRAINERS(TABLES.maps).some((t) => t.name === mergen.name) && !sought(questLog(TABLES, g.world.state, p)).some((s) => s.at === D10.id)
    && !ATLAS.sites.some((s) => /Mergen|drillmaster/i.test(s.name)) && !ATLAS.places.some((s) => /Mergen|drillmaster/i.test(s.name ?? '')),
    'found and never told: no quest, seeking, goal or world-map mark names Mergen or his door, and he is no site of the atlas');

  // The rumour at Akordu's trader's tent: a Rider by it, words only, two paragraphs in the Riders' voice that
  // say the kind of place, the mesas, and neither his name nor a square.
  w.world.travel(D8.id, rider.x, rider.y);
  const rumour = meet(rider, p, heard(w.world, rider)).text;
  ok(Math.abs(rider.x - shop.x) + Math.abs(rider.y - shop.y) <= 2 && rider.lines.length === 2 && rumour.includes('mesas') && rumour.includes('nobody has seen him eat')
    && !/Mergen|\d/.test(rumour) && !rider.flag && !rider.quest && !rider.choice && !rider.says && !rider.teaches && !rider.mastery && !rider.interior && !rider.passage,
    'at the trader\'s tent in Akordu a Rider says a man who drilled the Riders went into the mesas and has not been seen to eat, words only and two paragraphs, and never a name or a square');

  // The hide: off the road and off the chapter's path by more than ten squares, on the world's grid. The path is
  // the squares the chapter keys on, in its story order (its start, each entry, its end; any one of a condition's
  // alternatives will do), and the walks between one step and the next, each the rectangle every shortest walk
  // from a step to the next lies in: a hide set between two steps fails it as one set beside a step does.
  const road = (X: number, Y: number): number => {
    let best = Infinity;
    for (let y = Y - 40; y <= Y + 40; y++) for (let x = X - 40; x <= X + 40; x++) if (out.inBounds(x, y) && out.at(x, y).ch === '=') best = Math.min(best, chebyshev([x, y], [X, Y]));
    return best;
  };
  const stageOf = (when: When): { what: string; at: [number, number][] } => {
    const at: [number, number][] = [], what: string[] = [];
    const step = (name: string, map: string, x: number, y: number): void => { const z = out.zones.find((q) => q.id === map); if (z) { what.push(name); at.push([z.x + x, z.y + y]); } };
    for (const c of [when].flat() as QuestCond[]) {
      if (c.seen) { const [map, id] = c.seen.split(':'), f = MAP_DEFS.find((d) => d.id === map)?.features?.find((q) => 'id' in q && q.id === id); if (f) step(c.seen, map, f.x, f.y); }
      if (c.visited) { const d = MAP_DEFS.find((q) => q.id === c.visited); if (d) step(`${d.id} entered`, d.id, d.start.x, d.start.y); }
      for (const flag of [c.flag ?? []].flat()) for (const d of MAP_DEFS) for (const f of d.features ?? []) {
        if ((f.kind === 'npc' && personFlags(f).includes(flag)) || (f.kind === 'event' && [f.sets ?? []].flat().includes(flag))) step(flag, d.id, f.x, f.y);
      }
    }
    return { what: [...new Set(what)].join(' or '), at };
  };
  const stages = [CHAPTER.start, ...CHAPTER.entries.map((e) => e.when), CHAPTER.done].map(stageOf).filter((s) => s.at.length);
  const onPath = stages.flatMap((s) => s.at.map((at) => ({ what: s.what, at })));
  const walks: { from: string; to: string; box: [number, number, number, number] }[] = [];
  for (let i = 0; i + 1 < stages.length; i++) for (const a of stages[i].at) for (const b of stages[i + 1].at) {
    walks.push({ from: stages[i].what, to: stages[i + 1].what, box: [Math.min(a[0], b[0]), Math.min(a[1], b[1]), Math.max(a[0], b[0]), Math.max(a[1], b[1])] });
  }
  const apart = (at: [number, number]): { road: number; path: number; walk: number; what: string; between: string } => {
    const near = onPath.map((q) => ({ what: q.what, d: chebyshev(q.at, at) })).sort((a, b) => a.d - b.d)[0];
    const walk = walks.map((q) => ({ q, d: Math.max(q.box[0] - at[0], at[0] - q.box[2], q.box[1] - at[1], at[1] - q.box[3], 0) })).sort((a, b) => a.d - b.d)[0];
    return { road: road(at[0], at[1]), path: near.d, walk: walk.d, what: near.what, between: `${walk.q.from} to ${walk.q.to}` };
  };
  const hideAt = apart([d10.x + mergen.x, d10.y + mergen.y]), bowAt = apart([e9.x + chest.x, e9.y + chest.y]);
  ok(onPath.length >= 8 && walks.length >= 8 && [hideAt, bowAt].every((a) => a.road > 10 && a.path > 10 && a.walk > 10),
    `the hide is ${hideAt.road} squares from the nearest road square, ${hideAt.path} from the chapter's nearest step (${hideAt.what}) and ${hideAt.walk} from the nearest walk between two steps (${hideAt.between}), and the bow's chest ${bowAt.road}, ${bowAt.path} and ${bowAt.walk} (${bowAt.between}), of ${onPath.length} squares the chapter keys on and ${walks.length} walks between them`);

  // The door: shut to every walker, wader, climber and floater but through it, with the hint on the near side.
  const sealed = reach(out, d10, [hint.x, hint.y], ALL, [door.x, door.y]);
  ok(door.x === 3 && door.y === 20 && hint.kind === 'event' && hint.x === door.x + 1 && hint.y === door.y && sealed.size > 600 && !sealed.has(square(out, d10, 2, 20)) && !sealed.has(square(out, d10, 1, 20))
    && mergen.x === door.x - 2 && mergen.y === door.y && D10.rows[door.y][door.x] === 'S' && D10.rows[door.y - 1][door.x] === 'r' && D10.rows[door.y + 1][door.x] === 'r',
    `the hollow is shut but for the door in the small mesa's face: none of D10's ${sealed.size} squares walked, waded, climbed or floated reaches it, and the arrows stand at its side`);
  see(w, `${D10.id}:${door.hint}`);
  ok(w.world.used('d10_butts') && hint.kind === 'event' && hint.text.includes('Arrows') && !/door|Mergen|hide|secret/i.test(hint.text), 'the arrows in the small mesa\'s foot are seen, and the text explains nothing');

  // Search where the arrows stand, and go in: the lone basilisk that holds the mesa's foot is dead (its group
  // is won in the box's own walk above), and the hollow is walked into.
  w.world.travel(D10.id, hint.x, hint.y, WEST);
  w.world.killGroups(['d10_basilisk']);
  let found = false;
  for (let i = 0; i < 20 && !found; i++) found = w.world.search();
  const into = found ? [w.world.move('forward'), w.world.move('forward')] : [];
  ok(found && into.every((r) => r.kind === 'moved') && w.world.used('d10_hollow') && w.world.state.x === d10.x + 2 && w.world.state.y === d10.y + 20,
    'searched where the arrows stand, the rock gives, and the hollow behind it can be walked into');
  listen(w);

  // His words, the first time: the bow the herders keep, where their path ends, which
  // hints at E9's store and tells nobody the door. The fighters are given Expert and the gold; every member of
  // the line is refused before the favour, each for its own reason.
  const fighters = p.members.flatMap((c, i) => (linesOf(c.cls).includes('arms') ? [i] : []));
  const [first, second, third, fourth] = fighters;
  // Expert at arms as a town trainer's menu teaches it (`teachTier`, 2,000 gold each), and the gold for the lesson.
  p.gold = 20000;
  for (const i of [first, second]) ok(teachTier('arms', 'expert', TIER_PRICES.expert, p, i).taught, `${p.members[i].name} is given Expert at arms, as the towns' trainers teach it`);
  p.members[first].level = 25; p.members[first].xp = xpForLevel(25);
  p.members[second].level = 24;
  p.gold = 6000;
  const opening = meet(mergen, p, heard(w.world, mergen)).text;
  const bars = (): string[] => masterOffers(mastery, p, w.world.state).map((o) => `${o.who}:${o.bar || `${o.price}g`}`);
  const before = bars();
  ok(opening === mergen.lines.join('\n\n') && mergen.lines.length === 3 && opening.includes('herders') && opening.includes('bow') && opening.includes('where their path ends')
    && !/slab|store|[0-9]/i.test(opening) && !!p.flags[MASTER_MET] && !p.flags[MASTER_FAVOUR],
    'Mergen\'s own words first: his bow is with the herders, where their path ends, and he will teach for it; no square, and nothing of the store or its door');
  ok(fighters.length === 4 && before.join() === [`${first}:favour first`, `${second}:level 25`, `${third}:Expert first`, `${fourth}:Expert first`].join()
    && !teachTier('arms', 'master', mastery.price, p, first, favourDone(mastery, w.world.state, p)).taught && p.gold === 6000,
    `before the favour his menu refuses every member of the line, each for its reason (${before.join(' ')}), and nothing is taught or paid`);
  ok(meet(mergen, p, heard(w.world, mergen)).text === mergen.says![1].lines.join('\n\n'), 'and at the next meeting he holds out his empty hands, and says only where the bow is');

  // The favour: the herders' hills, E9's west edge from D9's east, the path that stops at the slab, searched; the
  // store behind it, a square dug further than the strongbox's, and the bow in the chest at the back.
  ok(herder.lines.join(' ').includes('hills') && path9.kind === 'event' && path9.text.includes('path') && path9.text.includes('slab') && chest.kind === 'chest' && chest.gold === 0 && chest.items.join() === 'drill_bow'
    && chest.x === slab.x - 3 && chest.y === slab.y && E9.rows[chest.y][chest.x] === ':' && E9.rows[chest.y][chest.x - 1] === 'r' && E9.rows[chest.y - 1][chest.x] === 'r' && E9.rows[chest.y + 1][chest.x] === 'r',
    'the herders live on the hills, and the path that stops at the slab leads to a store dug in the hill with a chest at the back of it holding the bow');
  const store = reach(out, e9, [path9.x, path9.y], ALL, [slab.x, slab.y]);
  ok(store.size > 800 && [0, 1, 2, 3].every((i) => !store.has(square(out, e9, slab.x - i, slab.y))), `the bow is shut but for the slab: none of E9's ${store.size} squares walked, waded, climbed or floated reaches it`);
  see(w, `${E9.id}:${slab.hint}`);
  w.world.travel(E9.id, slab.x + 1, slab.y, WEST);
  let dug = false;
  for (let i = 0; i < 20 && !dug; i++) dug = w.world.search();
  const deep = dug ? [1, 2, 3, 4].map(() => w.world.move('forward')) : [];
  ok(dug && deep.every((r) => r.kind === 'moved') && w.world.state.x === e9.x + chest.x && w.world.state.y === e9.y + chest.y && w.world.used('e9_store'),
    'searched where the path stops, the slab gives, and the store can be walked through to the chest at the back');
  listen(w);
  const there = w.world.featureHere();
  const gold = p.gold;
  if (there?.kind === 'chest') g.interact(there);
  ok(there?.kind === 'chest' && there.id === 'e9_drill_bow' && p.bag.includes('drill_bow') && p.gold === gold && w.world.used('e9_drill_bow') && item(TABLES.items, 'drill_bow').slot === 'none' && !item(TABLES.items, 'drill_bow').price
    && !MAP_DEFS.some((d) => (d.features ?? []).some((f) => (f.kind === 'shop' && f.stock.includes('drill_bow')) || ((f.kind === 'chest' || f.kind === 'cairn') && f.id !== 'e9_drill_bow' && f.items.includes('drill_bow'))))
    && !Object.values(MONSTERS).some((m) => m.drops?.some((d) => d.item === 'drill_bow')),
    'the chest gives the bow and no gold; no shop sells it, no other chest holds it and no monster drops it');

  // The hand-in: back at the hollow, Mergen takes the bow at the meeting, and the menu opens to the member who is
  // Expert at 25 and over, for 5,000; the one of 24 is told the level, the ones without Expert are told so.
  w.world.travel(D10.id, mergen.x + 1, mergen.y, WEST);
  const handed = meet(mergen, p, heard(w.world, mergen)).text;
  const after = bars();
  ok(handed === hand.done.join('\n\n') && !p.bag.includes('drill_bow') && !!p.flags[MASTER_FAVOUR] && favourDone(mastery, w.world.state, p)
    && after.join() === [`${first}:5000g`, `${second}:level 25`, `${third}:Expert first`, `${fourth}:Expert first`].join(),
    `the bow handed in at the meeting (${handed.split('\n\n')[0].slice(0, 40)}..), his menu opens: ${after.join(' ')}`);
  const purse = p.gold, lesson = teachTier('arms', 'master', mastery.price, p, first, favourDone(mastery, w.world.state, p));
  ok(lesson.taught && p.gold === purse - 5000 && lesson.said === `${p.members[first].name} is Master at arms now.` && bars()[0] === `${first}:taken`
    && !teachTier('arms', 'master', mastery.price, p, second, true).taught && p.gold === purse - 5000,
    `the member Expert at 25 is taught for 5,000 gold ("${lesson.said}"), and the one of 24 and the ones without Expert are still refused`);
  ok(meet(mergen, p, heard(w.world, mergen)).text === mergen.says![0].lines.join('\n\n'), 'after, he sits with the bow across his knees, and asks who comes to him');

  // A company that finds the bow first and never met him: he takes it at the first meeting, in the words for a
  // stranger, and the favour is done though he was never met.
  const early = newWalk(ok);
  early.party.bag.push('drill_bow');
  early.world.travel(D10.id, mergen.x, mergen.y);
  const stranger = meet(mergen, early.party, heard(early.world, mergen)).text;
  ok(stranger === hand.early!.join('\n\n') && !!early.party.flags[MASTER_FAVOUR] && !early.party.flags[MASTER_MET] && !early.party.bag.includes('drill_bow')
    && meet(mergen, early.party, heard(early.world, mergen)).text === mergen.says![0].lines.join('\n\n'),
    'a company that finds the bow first takes it to him unmet, and he takes it in the words for a stranger, and then is as he is to any who have done the favour');
}

// ---- the chapter (#531) ----

const npcOn = (map: string, name: string): Person => MAP_DEFS.find((d) => d.id === map)!.features!.find((f): f is Person => f.kind === 'npc' && f.name === name)!;



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
      ok(!!w.party.flags[ROAD_WEST] && quest(w)?.goal === goalOf(CHAPTER, 'West up the Riders\' road') && !written(w, CHAPTER).length,
        `${how}, The Window done on the Hills' last shoulder, the chapter begins, its goal west onto the steppe (${quest(w)?.goal})`);
      playChapter(w, CHAPTER, [atLevel(26, GRASS), atLevel(26, TENTS), atLevel(26, ELDEST), atLevel(27, WATCHED), atLevel(28, GAP), atLevel(28, LINES)], how);
    } else if (how.startsWith('by the Rider\'s ride')) {
      const west = rideFrom(w, 'cinderport', 'A Rider by the gate');
      ok(west.taken && w.world.zone?.id === 'wold_d8' && !!w.party.flags[ROAD_WEST] && quest(w)?.goal === goalOf(CHAPTER, 'In Akordu') && written(w, CHAPTER).join() === 'akordu',
        `${how}, set down at Akordu's horse-lines, The Window done and the chapter begun, its goal the eldest's fire (${quest(w)?.goal})`);
      atLevel(27, WATCHED).play(w);
      atLevel(28, GAP).play(w);
      w.world.travel('wold_d8', 8, 27, WEST);
      const unsaid = w.world.eventsHere();
      listen(w);
      ok(!unsaid.length && !w.party.flags[ROAD_EAST] && quest(w)?.goal === goalOf(CHAPTER, 'In Akordu') && written(w, CHAPTER).join(', ') === 'akordu, watch, glass',
        `${how}, the watch heard and the Glass seen first, the goal is the eldest still, and the lines say nothing yet (${written(w, CHAPTER).join(', ')}: ${quest(w)?.goal})`);
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
        && quest(w)?.goal === goalOf(CHAPTER, 'Over the grass of the Wold') && written(w, CHAPTER).join() === 'stair',
        `${how}, the Stone lit, the stair's head ends The Window without its road west and begins the chapter, its goal over the grass to Akordu (${quest(w)?.goal})`);
      atLevel(27, WATCHED).play(w);
      atLevel(28, GAP).play(w);
      ok(quest(w)?.goal === goalOf(CHAPTER, 'Over the grass of the Wold') && written(w, CHAPTER).join(', ') === 'stair, watch, glass',
        `${how}, the watch heard and the Glass seen before Akordu, the goal is Akordu still (${written(w, CHAPTER).join(', ')}: ${quest(w)?.goal})`);
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
    read.push(written(w, CHAPTER).join(', '));
  }
  const whole = 'grass, akordu, eldest, watch, glass, east';
  ok(read[0] === whole && read[1] === whole.replace('grass, ', '') && read[2] === whole.replace('grass, ', 'stair, '),
    `the journal reads the same in every order and by every way in, but for the glass in the grass seen only on the road and the warning at the stair's head only up the stair (${read.join(' / ')})`);
  everyGoalWalked(ok, [CHAPTER]);
}

/**
 * The bounds (#833), at the boxes' floor, 26. The Scarp's east end (D7): north from Akordu's box at D8's
 * 20,0 onto its 20,31, one land and nothing said; east from the Saltings' C7 at 31,10 onto the strip under
 * the Scarp at a company of 12, the Wold named and its warning said, the strip and the lip not joined on
 * foot and nothing on the strip that fights or pays; the west edge on top shut against C7's ring, and D8's
 * 0,0 and C8's 31,0 with it; the lip's sights, the salt-raker's words and the watch's fire, a rest; the
 * vultures, the lions and the walkers, each won; the keepers' store found from the smell of tar; and the
 * two doors in its faces. Karaordu, the enclave (#845): south from the grass at D7's 8,29 down the
 * diggers' cut, its door saying its band and how it feels at 25, 26 and 28 and its sign its band; its two
 * groups won at 28, the khans' gold, the eldest khan's cell found from the horses' skulls turned to its
 * wall and the Khan's Sabre in it, and up the cut onto D7 again. The other island (E7): north from E8's
 * 16,0 onto its 16,31, and east from D7's 31,31 onto the spit; its sights, no group, and the castaway's
 * hollow found from the wind in the crack; its north edge shut to every company against Wrackholm's E6.
 * Walked, waded, climbed or floated, no prize is reached but through its door. Last, Kushdag, the lair
 * (#847): east from the lip at D7's 18,24 onto the shelf in the Scarp's east face, its door saying its
 * band and how it feels at 26, 28 and 30; the Foal-taker alone on the shelf where it narrows, with the
 * nest, the chest and the cleft unreached while it stands, won at 30; Akkush in the Rider's chest, held
 * by no other place; the cleft found from the buckle in the rock; the way out onto the lip with its line
 * alone; and the eldest's two lines of the bow, said at no meeting before the story, at every one after
 * while the bird lives and at none once it has fallen.
 */
function theBounds(ok: (cond: boolean, msg: string) => void): void {
  const w = newWalk(ok), out = buildMaps()[OUTDOORS];
  const [D7, E7] = ['wold_d7', 'wold_e7'].map((id) => MAP_DEFS.find((d) => d.id === id)!);
  const [d7, e7, d8, e8, c7, c8, e6] = [D7.id, E7.id, 'wold_d8', 'wold_e8', 'saltings_c7', 'wold_c8', 'wrackholm_e6'].map((id) => out.zones.find((z) => z.id === id)!);
  const WOLD = ATLAS.zones.find((z) => z.id === 'wold')!;
  const feature = (d: MapDef, id: string) => d.features!.find((f) => 'id' in f && f.id === id)!;
  const step = (map: string, x: number, y: number, facing: Facing) => { w.world.travel(map, x, y, facing); const r = w.world.move('forward'); listen(w); return r; };
  w.level = 26;
  ok(!!WOLD.maps?.some((m) => `${m.map} ${m.at.join(',')}` === 'wold_d7 104,190') && !!WOLD.maps?.some((m) => `${m.map} ${m.at.join(',')}` === 'wold_e7 136,190')
    && d7.x === d8.x && d7.y + 32 === d8.y && e7.x === d7.x + 32 && e7.y === d7.y && e7.x === e8.x && e7.y + 32 === e8.y
    && [D7, E7].every((d) => d.density === 'country' && d.band?.join('-') === '26-27' && d.region === 'glasswold')
    && (D7.exits ?? []).map((e) => e.to).join() === 'karaordu,kushdag' && !(E7.exits ?? []).length,
    'the Scarp\'s east end, D7, laid at 104,190 over Akordu\'s box, and the other island\'s north, E7, east of it at 136,190 over the shore: country, band 26-27, D7\'s two ways out into Karaordu and Kushdag and none out of E7');

  // The way in: north from D8's 20,0 onto D7's 20,31, walked, one land and nothing said.
  const north = step(d8.id, 20, 0, NORTH);
  ok(north.kind === 'moved' && w.world.zone?.id === D7.id && w.world.state.x === d7.x + 20 && w.world.state.y === d7.y + 31 && D7.start.x === 20 && D7.start.y === 31
    && !north.messages.some((m) => m.startsWith('The Wold')), `north from D8's 20,0 onto D7's 20,31, walked, the box's way in, one land and nothing said (${said(north)})`);
  // The strip under the Scarp: east from C7's 31,10 at 12, the Wold named and warned of; it and the lip are
  // not joined on foot, and nothing on it fights or pays.
  const low = newWalk(ok);
  for (const m of low.party.members) m.level = 12;
  low.world.travel(c7.id, 31, 10, EAST);
  const east = low.world.move('forward');
  ok(east.kind === 'moved' && low.world.zone?.id === D7.id && low.world.state.x === d7.x && east.messages.join(' / ') === `The Wold. ${WOLD.crossing?.warning}`,
    `east from the Saltings' C7 at 31,10 onto the strip under the Scarp, D7's 0,10, at 12 the Wold named and warned of (${east.kind === 'moved' ? east.messages.join(' / ') : east.kind})`);
  const strip = reach(out, d7, [0, 10], {}), lip = reach(out, d7, [D7.start.x, D7.start.y], {});
  ok(strip.size > 100 && lip.size > 200 && ![...strip].some((k) => lip.has(k))
    && !D7.encounters!.some((g) => strip.has(square(out, d7, g.x, g.y))) && !D7.features!.some((f) => (f.kind === 'cairn' || f.kind === 'chest') && strip.has(square(out, d7, f.x, f.y))),
    `the strip under the Scarp (${strip.size} squares) and the lip over it (${lip.size}) are not joined on foot, and nothing on the strip fights or pays`);
  // And south from the Saltings' D6 at 0,31, the salt at the foot of its shore, onto the strip's 0,0 (#923).
  low.world.travel('saltings_d6', 0, 31, SOUTH);
  const south = low.world.move('forward');
  ok(south.kind === 'moved' && low.world.zone?.id === D7.id && low.world.state.x === d7.x && low.world.state.y === d7.y && strip.has(square(out, d7, 0, 0)),
    `south from the Saltings' D6 at 0,31 onto the strip, D7's 0,0, at 12 (${south.kind === 'moved' ? south.messages.join(' / ') || 'nothing said' : south.kind})`);
  for (const id of ['d7_pans', 'd7_tide', 'd7_foot']) see(w, `${D7.id}:${id}`);
  const raker = D7.features!.find((f): f is Person => f.kind === 'npc' && f.name === 'a salt-raker at the last pan')!;
  w.world.travel(D7.id, raker.x, raker.y);
  const told = meet(raker, w.party, heard(w.world, raker)).text;
  listen(w);
  ok(told.includes('end of the Scarp') && !raker.quest && !raker.says && !raker.flag, 'the salt-raker at the last pan: something came to the end of the Scarp in the spring and stands there yet; words only');
  // The west edge on top is shut against C7's ring, and the corner with it: D8's 0,0 and C8's 31,0.
  ok(Array.from({ length: 13 }, (_, i) => out.passable(d7.x, d7.y + 19 + i) !== 'ok').every(Boolean) && out.passable(d8.x, d8.y) !== 'ok' && out.passable(c8.x + 31, c8.y) !== 'ok'
    && out.passable(c7.x + 31, c7.y + 31) !== 'ok', 'D7\'s west edge on top is shut against C7\'s ring, rows 19 to 31, and D8\'s 0,0 and C8\'s 31,0 with its corner');

  // The lip: the long grass, the foal's bones, the walkers' tracks, the Scarp's end and the lip over the
  // pans; a cairn of sea-stones; the watch's fire, a rest.
  for (const id of ['d7_grass', 'd7_bones', 'd7_tracks', 'd7_end', 'd7_lip']) see(w, `${D7.id}:${id}`);
  const cairn = feature(D7, 'd7_cairn');
  ok(cairn.kind === 'cairn' && cairn.gold === 350 && cairn.items.join() === 'elixir' && lip.has(square(out, d7, cairn.x, cairn.y)), 'a cairn of sea-stones above the shore, a long feather in its top: gold and an Elixir');
  const camp = D7.features!.find((f) => f.kind === 'camp')!;
  w.world.travel(D7.id, camp.x, camp.y);
  ok(restRefused(w.world) === '' && D7.encounters!.every((g) => Math.abs(g.x - camp.x) + Math.abs(g.y - camp.y) > 8), 'the Riders\' old watch-fire on the lip, clear of every group, where a company may rest');
  // The groups, each won at 26: the vultures over the bones, the lions in the grass, the walkers at the end.
  const g7 = (id: string) => D7.encounters!.find((g) => g.id === id)!;
  ok(D7.encounters!.length === 3 && g7('d7_vultures').monsters.join() === 'vulture,vulture,vulture,vulture' && g7('d7_lions').monsters.join() === 'wold_lion,wold_lion,wold_lion'
    && g7('d7_walker').monsters.join() === 'glass_walker,glass_walker' && D7.encounters!.every((g) => g.respawn === RESPAWN.twoDays && !g.slainText && lip.has(square(out, d7, g.x, g.y))),
    'four vultures over the bones, three lions in the long grass and two glass walkers at the Scarp\'s end, all on the lip');
  for (const g of D7.encounters!) fight(w, `${D7.id}:${g.id}`);
  // The secret: the beacon's cold hearth and the smell of tar, searched; the keepers' store behind it.
  const [rock] = D7.secrets!;
  ok(rock.hint === 'd7_tar' && feature(D7, 'd7_tar').x === rock.x + 1 && feature(D7, 'd7_tar').y === rock.y, 'the smell of tar comes off the rock at the store\'s door');
  const store = reach(out, d7, [rock.x + 1, rock.y], ALL, [rock.x, rock.y]);
  ok(store.size > 300 && !store.has(square(out, d7, rock.x - 1, rock.y)) && !store.has(square(out, d7, rock.x - 2, rock.y)),
    `the store is shut but for its door: none of D7's ${store.size} squares walked, waded, climbed or floated reaches it`);
  see(w, `${D7.id}:d7_tar`);
  ok(search(w, D7.id, rock.x + 1, rock.y, WEST, 'd7_store'), 'searched where the tar smells, the rock gives, and the beacon-keepers\' store can be walked into');
  const chest7 = feature(D7, 'd7_chest');
  ok(chest7.kind === 'chest' && chest7.gold === 1100 && chest7.items.join() === 'potion_sp_great' && chest7.x === rock.x - 2, 'in the store, the keepers\' chest: 1,100 gold and a Sapphire Vial');
  // The doors, the lair's shelf in the Scarp's east face over the gulf and the enclave's cut in the hills
  // over D8: each square is stone, the square before it open on the lip, and nothing stands on either.
  const bare = (x: number, y: number): boolean => !D7.features!.some((f) => f.x === x && f.y === y) && !D7.encounters!.some((g) => g.x === x && g.y === y);
  ok(D7.rows[24][19] === '"' && lip.has(square(out, d7, 18, 24)) && lip.has(square(out, d7, 19, 24)) && bare(19, 24) && bare(18, 24) && D7.rows[30][8] === '"' && lip.has(square(out, d7, 8, 29)) && lip.has(square(out, d7, 8, 30)) && bare(8, 30) && bare(8, 29),
    'the lair\'s door is the shelf in the Scarp\'s east face, 19,24, and the enclave\'s is the cut in the hills over Akordu\'s box, 8,30, each stone, bare and its way clear');

  // Karaordu, the enclave (#845): the diggers' cut at D7's 8,30, walked into from the grass at 8,29, no
  // feature or group within four squares of it. Its door says its band and how it feels, as a border's
  // line: the warning at 25, harder at 26 and its band alone at 28; inside, its sign gives its band.
  const KO = MAP_DEFS.find((d) => d.id === 'karaordu')!, cut = D7.exits!.find((e) => e.to === KO.id)!;
  ok(cut.x === 8 && cut.y === 30 && cut.tx === KO.start.x && cut.ty === KO.start.y && ![...D7.features!, ...D7.encounters!].some((f) => Math.abs(f.x - 8) + Math.abs(f.y - 30) <= 4),
    'the cut into Karaordu is the hills\' face at D7\'s 8,30, walked into from the grass at 8,29, and no feature or group stands within four squares of it');
  const levels = w.party.members.map((m) => m.level);
  const door = (level: number): string => {
    for (const m of w.party.members) m.level = level;
    w.world.travel(D7.id, 8, 29, SOUTH);
    const r = w.world.move('forward');
    return r.kind === 'moved' && w.world.state.mapId === KO.id && w.world.state.x === KO.start.x && w.world.state.y === KO.start.y ? r.messages.join(' | ') : r.kind;
  };
  const band = 'Karaordu: levels 28-29.', far = door(25), near = door(26), at28 = door(28);
  ok(far === `${cut.label} | ${band} ${WARNING_IN}` && near === `${cut.label} | ${band} ${HARDER_IN}` && at28 === `${cut.label} | ${band}`,
    `south from D7's 8,29 into Karaordu, the way's own line and then its band, with the warning at 25, harder at 26 and nothing more at 28 (${far}; ${near}; ${at28})`);
  ok(!!KO.enclave && w.world.here.name === 'Karaordu' && w.world.here.band?.join('-') === '28-29', `inside, its sign gives its own band, over D7's 26-27 (${w.world.here.name}, ${w.world.here.band?.join('-')})`);
  listen(w);
  // Its two groups won at its floor, rising from the basilisks at the passage's head to the rats among the
  // khans' bones; its sights, and the khans' gold among the biers.
  w.level = 28;
  const gk = (id: string) => KO.encounters!.find((g) => g.id === id)!;
  ok(KO.encounters!.length === 2 && gk('kr_basilisks').monsters.join() === 'basilisk,basilisk,basilisk,basilisk'
    && gk('kr_rats').monsters.length === 8 && gk('kr_rats').monsters.every((m) => m === 'deep_rat')
    && KO.encounters!.every((g) => g.respawn === RESPAWN.twoDays && !g.slainText && g.roams === false), 'four basilisks at the passage\'s head and eight deep rats among the khans\' bones, and no guardian');
  for (const g of KO.encounters!) fight(w, `${KO.id}:${g.id}`);
  for (const id of ['kr_cut', 'kr_diggers', 'kr_slabs', 'kr_khans', 'kr_horses', 'kr_gnawed']) see(w, `${KO.id}:${id}`);
  const grave = feature(KO, 'kr_grave');
  ok(grave.kind === 'chest' && grave.gold === 1400 && grave.items.join() === 'elixir', 'among the biers, the khans\' gold: 1,400 and an Elixir');
  // The secret: the horses' skulls turned to the end wall, the search there and the eldest khan's cell.
  const [wall] = KO.secrets!, hold = new GameMap(KO), inside = new Set<string>(), todo: [number, number][] = [[KO.start.x, KO.start.y]];
  while (todo.length) {
    const [x, y] = todo.pop()!;
    if (inside.has(`${x},${y}`) || (x === wall.x && y === wall.y) || hold.passable(x, y, ALL) !== 'ok') continue;
    inside.add(`${x},${y}`);
    for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
  }
  ok(wall.hint === 'kr_skulls' && feature(KO, 'kr_skulls').x === wall.x && feature(KO, 'kr_skulls').y === wall.y - 1 && inside.size > 60 && !inside.has(`${wall.x},${wall.y + 1}`),
    `the eldest khan's cell is shut but for the end wall: none of Karaordu's ${inside.size} squares walked, waded, climbed or floated reaches it`);
  see(w, `${KO.id}:kr_skulls`);
  ok(search(w, KO.id, wall.x, wall.y - 1, SOUTH, 'kr_eldest'), 'searched where the skulls look, the end wall gives, and the eldest khan\'s cell can be walked into');
  const sabre = feature(KO, 'kr_sabre');
  ok(sabre.kind === 'chest' && sabre.gold === 300 && sabre.items.join() === 'khans_sabre'
    && !MAP_DEFS.some((d) => (d.features ?? []).some((f) => (f.kind === 'shop' && f.stock.includes('khans_sabre')) || ((f.kind === 'chest' || f.kind === 'cairn') && f !== sabre && f.items.includes('khans_sabre'))))
    && !Object.values(MONSTERS).some((m) => m.drops?.some((d) => d.item === 'khans_sabre')),
    'in the cell, the eldest khan\'s chest: 300 gold and the Khan\'s Sabre; no shop sells it, no other chest or cairn holds it and no monster drops it');
  // And out: up the cut onto D7's 8,29, with the way's own line and no other.
  w.world.travel(KO.id, KO.start.x, KO.start.y + 1, NORTH);
  const up = w.world.move('forward');
  ok(up.kind === 'moved' && w.world.zone?.id === D7.id && w.world.state.x === d7.x + 8 && w.world.state.y === d7.y + 29 && up.messages.join(' | ') === KO.exits![0].label,
    `up the cut out of Karaordu onto D7's 8,29, the way's own line alone (${said(up)})`);
  listen(w);
  w.party.members.forEach((m, i) => { m.level = levels[i]; });
  w.level = 26;

  // The other island: north from E8's 16,0 onto E7's 16,31, walked, and east from D7's 31,31 onto the spit.
  const isle = step(e8.id, 16, 0, NORTH);
  ok(isle.kind === 'moved' && w.world.zone?.id === E7.id && w.world.state.x === e7.x + 16 && w.world.state.y === e7.y + 31 && E7.start.x === 16 && E7.start.y === 31
    && !isle.messages.some((m) => m.startsWith('The Wold')), `north from E8's 16,0 onto E7's 16,31, walked, the box's way in, one land and nothing said (${said(isle)})`);
  const spit = step(d7.id, 31, 31, EAST);
  ok(spit.kind === 'moved' && w.world.zone?.id === E7.id && w.world.state.x === e7.x && w.world.state.y === e7.y + 31, `east from D7's 31,31 onto the spit at E7's 0,31, walked (${said(spit)})`);
  for (const id of ['e7_spit', 'e7_island', 'e7_bar', 'e7_gulls']) see(w, `${E7.id}:${id}`);
  // Its north edge: the isle's last rocks stand off across deep water, and no company crosses from E6.
  ok(Array.from({ length: 32 }, (_, i) => out.passable(e7.x + i, e7.y, ALL) !== 'ok').every(Boolean) && Array.from({ length: 14 }, (_, i) => out.at(e6.x + 13 + i, e6.y + 31).ch === '~').every(Boolean)
    && !(E7.encounters ?? []).length, 'E7\'s north edge is deep water that no company crosses, E6\'s south shore at 13 to 26 shallows against it, and no group on the island');
  // The secret: the wind moaning in the crack, searched; the castaway's hollow behind it.
  const [crack] = E7.secrets!;
  ok(crack.hint === 'e7_moan' && feature(E7, 'e7_moan').x === crack.x - 1 && feature(E7, 'e7_moan').y === crack.y, 'the wind moans at the crack, beside the hollow\'s door');
  const hollow = reach(out, e7, [crack.x - 1, crack.y], ALL, [crack.x, crack.y]);
  ok(hollow.size > 50 && !hollow.has(square(out, e7, crack.x + 1, crack.y)) && !hollow.has(square(out, e7, crack.x + 1, crack.y + 1)),
    `the hollow is shut but for its door: none of the island's ${hollow.size} squares walked, waded, climbed or floated reaches it`);
  see(w, `${E7.id}:e7_moan`);
  ok(search(w, E7.id, crack.x - 1, crack.y, EAST, 'e7_hole'), 'searched where the wind moans, the rock gives, and the castaway\'s hollow can be walked into');
  const chestE = feature(E7, 'e7_chest');
  ok(chestE.kind === 'chest' && chestE.gold === 700 && chestE.items.join() === 'elixir' && chestE.x === crack.x + 1 && chestE.y === crack.y + 1, 'in the hollow, what the castaway left: 700 gold and an Elixir');
  const words = [D7, E7].flatMap((d) => d.features!.flatMap((f) => [...('text' in f && f.text ? [f.text] : []), ...(f.kind === 'npc' ? f.lines : [])])).join(' ');
  ok(!/glass|hull|ship|orbit|voyage|custodian|tower|bow/i.test(words), 'nothing in either box\'s words of the Glass, of what the crown is, or of the bow');

  // Kushdag, the lair (#845, #847): the shelf cut in the Scarp's east face at D7's 19,24, walked onto from
  // the lip at 18,24, nothing within four squares of it. Its door says its band and how it feels: the
  // warning at 26, the box's floor, harder at 28 and its band alone at 30.
  {
    const KD = MAP_DEFS.find((d) => d.id === 'kushdag')!, shelf = D7.exits!.find((e) => e.to === KD.id)!, g = KD.encounters![0];
    const near4 = [...D7.features!, ...D7.encounters!].filter((f) => Math.abs(f.x - 19) + Math.abs(f.y - 24) <= 4).map((f) => ('id' in f ? f.id : f.kind));
    ok(D7.exits!.length === 2 && shelf.x === 19 && shelf.y === 24 && shelf.tx === KD.start.x && shelf.ty === KD.start.y && D7.rows[24][19] === '"' && lip.has(square(out, d7, 18, 24)) && !near4.length,
      `the shelf into Kushdag is dressed stone in the Scarp's east face at D7's 19,24, walked to from the lip at 18,24, with nothing within four squares of it (${near4.join(', ') || 'nothing'})`);
    // Its two ways say nothing of the bird, so they read true after it falls: they are said every time.
    ok(![shelf.label, KD.exits![0].label].some((l) => /foal|bird|feather|cry|wing/i.test(l ?? '')), 'the way in and the way out say nothing of the Foal-taker, so they read true whether it stands or has fallen');
    const levels = w.party.members.map((m) => m.level);
    const door = (level: number): string => {
      for (const m of w.party.members) m.level = level;
      w.world.travel(D7.id, 18, 24, EAST);
      const r = w.world.move('forward');
      return r.kind === 'moved' && w.world.state.mapId === KD.id && w.world.state.x === KD.start.x && w.world.state.y === KD.start.y ? r.messages.join(' | ') : r.kind;
    };
    const band = 'Kushdag: levels 30-32.', far = door(26), near = door(28), at30 = door(30);
    ok(far === `${shelf.label} | ${band} ${WARNING_IN}` && near === `${shelf.label} | ${band} ${HARDER_IN}` && at30 === `${shelf.label} | ${band}`,
      `east from D7's lip onto the shelf and into Kushdag, the way's own line and then its band, with the warning at 26, the box's floor, harder at 28 and nothing more at 30 (${far}; ${near}; ${at30})`);
    ok(!!KD.enclave && w.world.here.name === 'Kushdag' && w.world.here.band?.join('-') === '30-32', `inside, its sign gives the cap's band, over D7's 26-27 (${w.world.here.name}, ${w.world.here.band?.join('-')})`);
    listen(w);
    w.level = 30;
    for (const id of ['kd_shelf', 'kd_foals', 'kd_feather']) see(w, `${KD.id}:${id}`);
    // The guardian: the Foal-taker, a boss that never comes back, on the shelf where it comes down the face,
    // the one way to the nest. With it standing and the squares a step from it shut (a fight starts next to
    // a group), or with its square alone shut, no company walks, wades, climbs or floats past it: the nest,
    // the chest, the buckle and the cleft are all behind the fight.
    const flood = (shut: readonly (readonly [number, number])[]): Set<string> => {
      const hold = new GameMap(KD), inside = new Set<string>(), closed = new Set(shut.map(([x, y]) => `${x},${y}`)), todo: [number, number][] = [[KD.start.x, KD.start.y]];
      while (todo.length) {
        const [x, y] = todo.pop()!;
        if (inside.has(`${x},${y}`) || closed.has(`${x},${y}`) || hold.passable(x, y, ALL) !== 'ok') continue;
        inside.add(`${x},${y}`);
        for (const [dx, dy] of [[1, 0], [-1, 0], [0, 1], [0, -1]]) todo.push([x + dx, y + dy]);
      }
      return inside;
    };
    const stepped = flood([[g.x, g.y], [g.x + 1, g.y], [g.x - 1, g.y], [g.x, g.y + 1], [g.x, g.y - 1]]), choke = flood([[g.x, g.y]]);
    const behind = (s: Set<string>): boolean => [...s].some((k) => Number(k.split(',')[1]) >= 7);
    ok(KD.encounters!.length === 1 && g.id === 'kd_foal_taker' && g.monsters.join() === 'foal_taker' && !!g.boss && !g.respawn && g.roams === false && !!g.slainText
      && stepped.has('9,4') && choke.has('9,5') && !behind(stepped) && !behind(choke),
      `the Foal-taker, the one group of the lair, stands on the shelf where it comes down the face: with it standing, none of Kushdag's ${choke.size} squares walked, waded, climbed or floated past it reaches the nest, the chest, the buckle or the cleft`);
    fight(w, `${KD.id}:${g.id}`);
    for (const id of ['kd_tracks', 'kd_nest', 'kd_rider']) see(w, `${KD.id}:${id}`);
    // Akkush in the Rider's chest at the nest's edge, one in the world: no other chest, cairn or statue holds
    // it, no shop sells it and no monster drops it.
    const bow = feature(KD, 'kd_chest');
    const holds = (f: Feature): boolean => (f.kind === 'shop' && f.stock.includes('akkush')) || ((f.kind === 'chest' || f.kind === 'cairn') && f !== bow && f.items.includes('akkush')) || (f.kind === 'statue' && !!f.gift?.items?.includes('akkush'));
    ok(bow.kind === 'chest' && bow.gold === 0 && bow.items.join() === 'akkush' && !!item(TABLES.items, 'akkush').artifact && flood([]).has(`${bow.x},${bow.y}`)
      && !MAP_DEFS.some((d) => (d.features ?? []).some(holds)) && !Object.values(MONSTERS).some((m) => m.drops?.some((x) => x.item === 'akkush')),
      'at the nest\'s edge, the Rider\'s chest with Akkush in it; no other chest, cairn or statue holds it, no shop sells it and no monster drops it');
    // The secret: the buckle wedged in the rock behind the nest, the search there and the cleft behind it,
    // where the bird keeps what shines. Walked, waded, climbed or floated, it is never reached but through the wall.
    const [crack] = KD.secrets!, sealed = flood([[crack.x, crack.y]]);
    ok(crack.hint === 'kd_buckle' && feature(KD, 'kd_buckle').x === crack.x && feature(KD, 'kd_buckle').y === crack.y - 1 && sealed.size > 50 && sealed.has(`${bow.x},${bow.y}`)
      && !['6,13', '7,13', '8,13'].some((k) => sealed.has(k)), `the cleft is shut but for the wall behind the buckle: none of Kushdag's ${sealed.size} squares walked, waded, climbed or floated reaches it`);
    see(w, `${KD.id}:kd_buckle`);
    ok(search(w, KD.id, crack.x, crack.y - 1, SOUTH, 'kd_cache'), 'searched where the buckle is wedged, the rock gives, and the cleft behind the nest can be walked into');
    const cache = feature(KD, 'kd_cache_chest');
    ok(cache.kind === 'chest' && cache.gold === 800 && cache.items.join() === 'elixir,potion_sp_great', 'in the cleft, the bird\'s cache: 800 gold, an Elixir and a Sapphire Vial');
    // And out: back along the shelf onto the lip at D7's 18,24, the way's own line and no other.
    w.world.travel(KD.id, KD.start.x + 1, KD.start.y, WEST);
    const back = w.world.move('forward');
    ok(back.kind === 'moved' && w.world.zone?.id === D7.id && w.world.state.x === d7.x + 18 && w.world.state.y === d7.y + 24 && back.messages.join(' | ') === KD.exits![0].label,
      `out along the shelf onto D7's 18,24, the way's own line alone (${said(back)})`);
    listen(w);
    // The rumour (#846): the eldest at Akordu says nothing of the bow at the meeting that tells the oldest
    // story and, at every meeting after it while the bird lives, two lines more, DESIGN §9's words: no flag
    // or question comes with them, no quest names the bow and the journal says nothing of it. Once the bird
    // has fallen she says them no more: it comes for foals no more.
    const eldest = npcOn('wold_d8', 'The eldest');
    const lines = ['"My grandmother\'s brother made a bow of white horn that never missed. He loosed it once, at the bird that takes our foals."', '"The bird took him, and the bow. It still comes for foals."'];
    const bowWords = eldest.says!.filter((s) => s.lines.some((l) => l === lines[0]));
    const bird = w.world.state.maps[KD.id]!.groups[g.id]!, fell = bird.dead;
    bird.dead = -1;
    w.world.travel('wold_d8', eldest.x, eldest.y);
    const first = meet(eldest, w.party, heard(w.world, eldest)).text;
    const after = meet(eldest, w.party, heard(w.world, eldest)).text;
    w.party.flags[LION_TOLD] = 1;
    const rest = meet(eldest, w.party, heard(w.world, eldest)).text;
    bird.dead = fell;
    const gone = meet(eldest, w.party, heard(w.world, eldest)).text;
    ok(!first.includes('grandmother') && lines.every((l) => after.includes(l) && rest.includes(l)) && fell >= 0 && gone.includes('Keep it as we keep it.') && !gone.includes('grandmother') && bowWords.length === 2 && bowWords.every((s) => !s.sets && !s.choice && s.lines.slice(-2).join() === lines.join())
      && !/Akkush|grandmother|white horn/.test(JSON.stringify(questLog(TABLES, w.world.state, w.party))) && bowWords.every((s) => wrap(s.lines.join('\n\n'), SAY_W).length <= SAY_LINES),
      'the eldest says nothing of the bow at the meeting that tells the story, and at every meeting after it while the bird lives, the lion\'s rest told or not, speaks of her grandmother\'s brother and the bird: words only, in no quest, and in the box\'s lines; once it has fallen, nothing of it');
    listen(w);
    delete w.party.flags[STORY]; delete w.party.flags[LION_TOLD];
    w.party.members.forEach((m, i) => { m.level = levels[i]; });
    w.level = 26;
  }
}
