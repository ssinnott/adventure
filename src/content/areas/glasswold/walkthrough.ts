// The Glasswold's walkthrough. Its chapter, The Warning, is #531's, which plays it here; until then, the
// boxes in road order. The steppe (D9, #525): the area listed by its first map, out of AHEAD and PLANNED;
// put down at the road's end on the south edge, where the atlas's road crosses from D10's corner, the
// box's way in until the mesas (#527) join it to E10; the road square to square from the south edge at
// columns 22 and 23 north-west over the dunes' edge to the west edge at row 21, past which, for now, the
// world ends; the glass in the grass; the Riders' well where their track leaves the road, and their camp
// beside it; the track north past the tents seen from the middle and the cairn on the watch-mound to the
// north edge, toward Akordu; the herd and its herder, the old Rider and the first words of the day the
// sky opened; the kills, the lions' lie, the dunes' cairn, the Glass seen from the dunes and the walker's
// tracks across their edge; the box's groups won at 26; and the fallen walker in the long mound, found
// from the grass the herd will not graze.
import type { Walkthrough } from '../../area.ts';
import { newWalk, see, fight, listen } from '../../../../tools/walk.ts';
import { NORTH, WEST } from '../../../game/types.ts';
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
  // PLANNED, D9 on its zone's row at 104,254, core, at 26-27 under the Wold's own sky.
  ok(AREAS.some((a) => a.id === 'glasswold') && !AHEAD.length && !(PLANNED as readonly string[]).includes('glasswold')
    && WOLD.maps?.map((m) => `${m.map} ${m.at.join(',')}`).join() === 'wold_d9 104,254' && d9.x === 104 && d9.y === 254
    && D9.density === 'core' && D9.band?.join('-') === '26-27' && D9.region === 'glasswold',
    'the Glasswold listed by its first map, the steppe, D9, laid at 104,254 on the Wold: core, band 26-27, under its own sky');
  ok(!!WOLD.crossing?.harder && !!WOLD.crossing?.warning,
    'the Wold\'s crossing words on its row, said where a company first comes onto its grass (walked once the mesas join it, #527)');

  // Put down at the way in: the road on the south edge, where the atlas's road crosses from D10's corner.
  // The road runs square to square from there north-west over the dunes' edge to the west edge at 0,21,
  // toward the Riders' gap; past D10 and C9, for now, the world ends.
  w.world.travel('wold_d9', D9.start.x, D9.start.y, NORTH);
  ok(w.world.zone?.id === 'wold_d9' && D9.start.x === 22 && D9.start.y === 31 && ch(22, 31) === '=' && ch(23, 31) === '=',
    'put down on the road at the south edge, 22,31, the box\'s way in');
  const road = spread(d9.x + 22, d9.y + 31, (x, y) => inBox(x, y) && out.at(x, y).ch === '=');
  const laid = D9.rows.join('').split('').filter((c) => c === '=').length;
  ok(road.size === laid && road.has(key(d9.x, d9.y + 21)) && out.passable(d9.x - 1, d9.y + 21) !== 'ok' && out.passable(d9.x + 22, d9.y + 32) !== 'ok',
    `the road runs square to square, all ${laid} of its squares, from the south edge at 22 and 23 to the west edge at 0,21, and past both, for now, the world ends`);
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
