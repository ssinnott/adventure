// The Glasswold's walkthrough. Its chapter, The Warning, is #531's, which plays it here; until then, the
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
// from the grass the herd will not graze.
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen } from '../../../../tools/walk.ts';
import { NORTH, EAST, SOUTH, WEST } from '../../../game/types.ts';
import { addCondition, hasCondition, lift, templePrice } from '../../../game/party.ts';
import { AREAS, AHEAD, ATLAS, MAP_DEFS, MONSTERS } from '../../index.ts';
import { PLANNED } from '../../progression.ts';
import { buildMaps } from '../../maps.ts';
import { OUTDOORS } from '../../../game/outdoors.ts';
import { restRefused, useShrine } from '../../../game/wilds.ts';
import { meet, heard } from '../../../game/people.ts';
import type { Person } from '../../../game/people.ts';
import { item } from '../../../game/items.ts';

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
    && WOLD.maps?.map((m) => `${m.map} ${m.at.join(',')}`).join() === 'wold_d10 104,286,wold_d9 104,254' && d9.x === 104 && d9.y === 254 && d10.x === 104 && d10.y === 286
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
};
