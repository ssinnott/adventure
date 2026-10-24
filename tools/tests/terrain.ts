// Hills, farmland, woods, dead wood, crystal, the chasm, salt, heather, tidal ground, ash, pine, ice,
// peaks and cliffs, steppe, dunes, vines and the volcano: their legend characters, snow and the crops through the year, the fields'
// patchwork, the tide, the ice through the year and every terrain's own colour on the automap; and
// what a hill hides from lower ground (#53) and a wall from the squares round the company (#889).
import { GameMap } from '../../src/game/map.ts';
import type { MapDef } from '../../src/game/map.ts';
import { NORTH, EAST, SOUTH, WEST } from '../../src/game/types.ts';
import type { Facing } from '../../src/game/types.ts';
import { SNOW_HOLD, cropColor, fieldAt, hedgeColor, heatherBloom, iceColor, viewCells, standsAt } from '../../src/ui/viewport.ts';
import { markedGroups } from '../../src/ui/frame.ts';
import { tideAt, TIDE_PERIOD, HIGH_WATER, MINUTES_PER_DAY, daylightAt } from '../../src/game/calendar.ts';
import { hoursHold, VIEW_DEPTH, World, seen } from '../../src/game/world.ts';
import { findWeather, weatherSight } from '../../src/game/weather.ts';
import type { Weather } from '../../src/game/weather.ts';
import { defaultParty } from '../../src/game/party.ts';
import { serialize, deserialize, SAVE_VERSION } from '../../src/game/save.ts';
import { makeRng } from '../../src/lib/engine/rng.ts';
import { MAP_TERRAIN } from '../../src/game/atlas.ts';
import { TERRAIN_COLORS, PARCHMENT, AUTOMAP_WASH } from '../../src/ui/palette.ts';
import { MAP_DEFS, CLIMATES } from '../../src/content/index.ts';
import { GROUND_SAMPLES } from '../grounds.ts';
import { mix, hexToRgb } from '../../src/lib/art/palettes.ts';
import { ok } from './lib.ts';

export function terrain(): void {
  // Hills and farmland: their legend characters, open ground both.
  const m = new GameMap({ id: 'fixture_fields', name: 'Fields fixture', kind: 'outdoor', start: { x: 1, y: 1, facing: NORTH }, rows: ['MMMM', 'M^fM', 'MMMM'] });
  ok(m.at(1, 1).terrain === 'hills' && m.at(2, 1).terrain === 'farm', `'^' is hills and 'f' farmland (${m.at(1, 1).terrain}, ${m.at(2, 1).terrain})`);
  // A hill hides what lies behind it from lower ground, and not from another hill or a mountain's top (#53).
  const from = (x: number): { x: number; y: number } => ({ x, y: 1 });
  ok(m.passable(1, 1) === 'ok' && m.passable(2, 1) === 'ok' && !m.blocksView(2, 1) && !m.blocksView(2, 1, from(1)) && !m.blocksView(1, 1), 'both can be walked; farmland hides nothing, and nothing hides from nowhere in particular');
  ok(m.blocksView(1, 1, from(2)) && !m.blocksView(1, 1, from(1)) && !m.blocksView(1, 1, from(0)), 'a hill stops the view from the farmland below it, and not from a hill or the mountain');
  // Woods: light woodland, walked through and seen past, unlike the forest's wall of trees ('T').
  const w = new GameMap({ id: 'fixture_woods', name: 'Woods fixture', kind: 'outdoor', start: { x: 1, y: 1, facing: NORTH }, rows: ['MMMM', 'MtTM', 'MMMM'] });
  ok(w.at(1, 1).terrain === 'woods' && w.passable(1, 1) === 'ok' && !w.blocksView(1, 1) && !w.blocksView(1, 1, from(2)) && w.passable(2, 1) !== 'ok', `'t' is woods, walked through and seen past, where 'T' is a tree that blocks (${w.at(1, 1).terrain}, ${w.passable(2, 1)})`);
  ok(SNOW_HOLD.woods > 0.5 && SNOW_HOLD.woods < SNOW_HOLD.grass, `snow lies on the woods' floor, thinner under the trees than on open grass (${SNOW_HOLD.woods})`);
  // Dead wood: walked through and seen past as the woods are, and grey, with no green in it.
  const dw = new GameMap({ id: 'fixture_dead', name: 'Dead wood fixture', kind: 'outdoor', start: { x: 1, y: 1, facing: NORTH }, rows: ['MMMM', 'MdtM', 'MMMM'] });
  ok(dw.at(1, 1).terrain === 'deadwood' && dw.passable(1, 1) === 'ok' && !dw.blocksView(1, 1), `'d' is dead wood, walked through and seen past (${dw.at(1, 1).terrain}, ${dw.passable(1, 1)})`);
  const [dr, dg, db] = hexToRgb(TERRAIN_COLORS.deadwood);
  ok(dg <= Math.max(dr, db) + 4, `the dead wood's ground is grey, with no green in it (${TERRAIN_COLORS.deadwood})`);
  // Crystal: a glass tree that blocks as the forest's trunks do, and is seen past. The chasm: no wall
  // and seen across, but never walked, a swimmer and a mountaineer notwithstanding.
  const sd = new GameMap({ id: 'fixture_sunder', name: 'Sunder fixture', kind: 'outdoor', start: { x: 1, y: 1, facing: NORTH }, rows: ['MMMM', 'McvM', 'MMMM'] });
  ok(sd.at(1, 1).terrain === 'crystal' && sd.at(1, 1).solid === 'tree' && sd.passable(1, 1) === 'blocked' && !sd.blocksView(1, 1), `'c' is a glass tree on crystal, blocking the way but not the view (${sd.at(1, 1).terrain}, ${sd.passable(1, 1)})`);
  ok(sd.at(2, 1).terrain === 'chasm' && sd.at(2, 1).solid === 'none' && sd.passable(2, 1, { swim: true, climb: true }) === 'chasm' && !sd.blocksView(2, 1) && SNOW_HOLD.chasm === 0, `'v' is the chasm: seen across, no wall, never walked and never snowed on (${sd.at(2, 1).terrain}, ${sd.passable(2, 1, { swim: true, climb: true })})`);
  // Salt, walked as sand and white; heather, walked as grass and purple-brown, purple in flower.
  const sm = new GameMap({ id: 'fixture_salt', name: 'Saltings fixture', kind: 'outdoor', start: { x: 1, y: 1, facing: NORTH }, rows: ['MMMMM', 'M-h;M', 'MMMMM'] });
  ok(sm.at(1, 1).terrain === 'salt' && sm.at(2, 1).terrain === 'heather' && sm.at(3, 1).terrain === 'tidal', `'-' is salt, 'h' heather and ';' tidal ground (${[1, 2, 3].map((x) => sm.at(x, 1).terrain).join(', ')})`);
  ok([1, 2].every((x) => sm.passable(x, 1, { tide: 'high' }) === 'ok' && !sm.blocksView(x, 1)), 'salt and heather are walked at any tide, and seen past');
  ok(Math.min(...hexToRgb(TERRAIN_COLORS.salt)) >= 200, `salt lies white (${TERRAIN_COLORS.salt})`);
  const [hr, hg, hb] = hexToRgb(TERRAIN_COLORS.heather);
  ok(hr > hg && hb > hg && heatherBloom(50) === 1 && heatherBloom(100) === 0, `heather is purple-brown, and flowers at Harvest, not in Frost (${TERRAIN_COLORS.heather})`);
  ok(SNOW_HOLD.salt > 0 && SNOW_HOLD.heather > 0.5 && SNOW_HOLD.tidal === 0, `snow lies on salt and heather, and the sea washes it off the tidal ground (${SNOW_HOLD.salt}, ${SNOW_HOLD.heather}, ${SNOW_HOLD.tidal})`);
  // Tidal ground: sand at low water, water at high, which only a swimmer wades; with no tide said, low.
  ok(sm.passable(3, 1, { tide: 'low' }) === 'ok' && sm.passable(3, 1, { tide: 'high' }) === 'tide' && sm.passable(3, 1, { tide: 'high', swim: true }) === 'ok' && sm.passable(3, 1) === 'ok' && !sm.blocksView(3, 1),
    `tidal ground is walked at low water, waded at high only by a swimmer, and read at low with no tide said (${sm.passable(3, 1, { tide: 'high' })})`);
  // The tide turns twice a day: high water 04:00 to 08:00 and 16:00 to 20:00, from the clock alone.
  const hours = Array.from({ length: 24 }, (_, h) => tideAt(3 * MINUTES_PER_DAY + h * 60));
  ok(TIDE_PERIOD * 2 === MINUTES_PER_DAY && hours.filter((t) => t === 'high').length === 8 && hours[4] === 'high' && hours[7] === 'high' && hours[8] === 'low' && hours[16] === 'high' && hours[20] === 'low' && hours[3] === 'low',
    `the tide is high twice a day, from ${HIGH_WATER[0] / 60}:00 to ${HIGH_WATER[1] / 60}:00 and twelve hours on (${hours.map((t) => (t === 'high' ? 'H' : '.')).join('')})`);
  ok(hoursHold({ tide: 'low' }, 11 * 60, null) && !hoursHold({ tide: 'low' }, 5 * 60, null) && hoursHold({ tide: 'high' }, 17 * 60, null), 'a time to walk can name the tide');
  // Ash, pine and ice (#536): open ground all three, walked at any tide and seen past. The ash is
  // dark grey; the pinewoods' floor olive-brown, needles and not the woods' green; the ice pale and
  // blue, whitest in the winter and greyer with meltwater in the summer, frozen all the year.
  const fells = new GameMap({ id: 'fixture_fells', name: 'Fells fixture', kind: 'outdoor', start: { x: 1, y: 1, facing: NORTH }, rows: ['MMMMM', 'MapiM', 'MMMMM'] });
  ok(fells.at(1, 1).terrain === 'ash' && fells.at(2, 1).terrain === 'pine' && fells.at(3, 1).terrain === 'ice', `'a' is ash, 'p' pine and 'i' ice (${[1, 2, 3].map((x) => fells.at(x, 1).terrain).join(', ')})`);
  ok([1, 2, 3].every((x) => fells.at(x, 1).solid === 'none' && fells.passable(x, 1, { tide: 'high' }) === 'ok' && !fells.blocksView(x, 1)), 'ash, pine and ice are open ground, walked at any tide and seen past');
  const [ar, ag, ab] = hexToRgb(TERRAIN_COLORS.ash), [pr, pg, pb] = hexToRgb(TERRAIN_COLORS.pine), [ir, ig, ib] = hexToRgb(TERRAIN_COLORS.ice);
  ok(ag <= Math.max(ar, ab) + 4 && Math.max(ar, ag, ab) < 80, `ash lies dark grey, with no green in it (${TERRAIN_COLORS.ash})`);
  ok(pr > pb && pg > pb && Math.abs(pr - pg) < 12, `the pinewoods' floor is olive-brown, needles and not grass (${TERRAIN_COLORS.pine})`);
  const light = (c: string): number => hexToRgb(c).reduce((a, b) => a + b, 0) / 3;
  ok(ib > ir && Math.min(ir, ig, ib) >= 160 && light(iceColor(100)) > light(iceColor(50)) + 20 && Math.min(...hexToRgb(iceColor(50))) >= 140,
    `the ice is pale and blue, whitest in Frost and greyer at Harvest, but ice still (${TERRAIN_COLORS.ice}; ${iceColor(100)} and ${iceColor(50)})`);
  ok(SNOW_HOLD.ash > 0.5 && SNOW_HOLD.ash < SNOW_HOLD.grass && SNOW_HOLD.pine > 0.5 && SNOW_HOLD.pine < SNOW_HOLD.grass && SNOW_HOLD.ice > 0.5,
    `snow lies on all three: greyer on the warm ash, thinner under the pines and over all the ice (${SNOW_HOLD.ash}, ${SNOW_HOLD.pine}, ${SNOW_HOLD.ice})`);
  // Peaks and cliffs (#543): the range's rock, the mountain's to walk into, climb and see past, with
  // the road between them open to anyone; on the world map, the atlas's peak and cliff. The peak is
  // inked pale, snow on stone, and the cliff dark slate; snow lies on the scree under a peak as on the
  // hills, and less at a cliff's foot.
  const range = new GameMap({ id: 'fixture_range', name: 'Range fixture', kind: 'outdoor', start: { x: 2, y: 1, facing: NORTH }, rows: ['MMMMM', 'MA=|M', 'MMMMM'] });
  ok(range.at(1, 1).terrain === 'peak' && range.at(3, 1).terrain === 'cliff' && [1, 3].every((x) => range.at(x, 1).solid === 'mountain') && MAP_TERRAIN.A === 'peak' && MAP_TERRAIN['|'] === 'cliff',
    `'A' is a peak and '|' a cliff, both the mountain's rock, and so on the world map (${[1, 3].map((x) => `${range.at(x, 1).terrain} ${range.at(x, 1).solid}`).join(', ')})`);
  ok([1, 3].every((x) => range.passable(x, 1) === 'mountain' && range.passable(x, 1, { climb: true }) === 'ok' && range.blocksView(x, 1)) && range.passable(2, 1) === 'ok',
    'a peak and a cliff stop a company as the mountain does, a Mountaineer climbs them and neither is seen past; the road between them is open');
  const [kr, kg, kb] = hexToRgb(TERRAIN_COLORS.peak), [cr, , cb] = hexToRgb(TERRAIN_COLORS.cliff);
  ok(Math.min(kr, kg, kb) >= 170 && Math.max(kr, kg, kb) - Math.min(kr, kg, kb) < 16 && cb > cr + 20 && cb < 140, `a peak is inked pale grey and a cliff dark slate (${TERRAIN_COLORS.peak}, ${TERRAIN_COLORS.cliff})`);
  ok(SNOW_HOLD.peak >= SNOW_HOLD.hills - 0.05 && SNOW_HOLD.cliff > 0.4 && SNOW_HOLD.cliff < SNOW_HOLD.peak, `snow lies on the scree under a peak as on the hills, and less at a cliff's foot (${SNOW_HOLD.peak}, ${SNOW_HOLD.cliff})`);
  // Steppe, dunes and vines (#543): the Wold's open grass, its sand in ridges and the shore's creepers,
  // all walked; the volcano's cone and a vent in it, the mountain's rock to walk into, climb and see
  // past. On the world map each is the atlas's own, and a vent its volcano.
  const far = new GameMap({ id: 'fixture_far', name: 'Far side fixture', kind: 'outdoor', start: { x: 1, y: 1, facing: NORTH }, rows: ['MMMMMMM', 'Msu&V@M', 'MMMMMMM'] });
  const laid = (['steppe', 'dunes', 'vines', 'volcano', 'vent'] as const).map((t, i) => far.at(i + 1, 1).terrain === t && MAP_TERRAIN['su&V@'[i]] === (t === 'vent' ? 'volcano' : t));
  ok(laid.every(Boolean) && [1, 2, 3].every((x) => far.passable(x, 1) === 'ok' && !far.blocksView(x, 1)),
    `'s' is steppe, 'u' dunes and '&' vines, each walked and seen across, and so on the world map (${[1, 2, 3].map((x) => `${far.at(x, 1).terrain} ${far.passable(x, 1)}`).join(', ')})`);
  ok([4, 5].every((x) => far.at(x, 1).solid === 'mountain' && far.passable(x, 1) === 'mountain' && far.passable(x, 1, { climb: true }) === 'ok' && far.blocksView(x, 1)),
    `'V' is the volcano and '@' a vent, both the mountain's rock: they stop a company, a Mountaineer climbs them and neither is seen past (${[4, 5].map((x) => `${far.at(x, 1).terrain} ${far.at(x, 1).solid}`).join(', ')})`);
  const [vr, vg, vb] = hexToRgb(TERRAIN_COLORS.volcano), [er] = hexToRgb(TERRAIN_COLORS.vent);
  ok(vr + vg + vb < 3 * 90 && vr > vb + 30 && er > vr + 30, `the volcano is inked black-red and a vent redder (${TERRAIN_COLORS.volcano}, ${TERRAIN_COLORS.vent})`);
  ok(SNOW_HOLD.steppe >= SNOW_HOLD.grass - 0.05 && SNOW_HOLD.dunes === SNOW_HOLD.sand && SNOW_HOLD.vines < SNOW_HOLD.steppe && SNOW_HOLD.volcano < 0.5 && SNOW_HOLD.vent === 0,
    `snow lies on the steppe as on grass and on the dunes as on sand, the creepers keep some off, the cone's warmth thins it and a vent takes none (${['steppe', 'dunes', 'vines', 'volcano', 'vent'].map((t) => SNOW_HOLD[t as 'steppe']).join(', ')})`);
  // The samples the smoke test sweeps and the contact sheet shows (tools/grounds.ts): one to each
  // ground, its own ground in view from the start, a wall in it, square and placed by no area.
  const sampled = GROUND_SAMPLES.map((d) => {
    const g = new GameMap(d), t = d.id.replace('ground_', '');
    const seen = viewCells(g, d.start.x, d.start.y, d.start.facing, VIEW_DEPTH).some((c) => g.at(c.x, c.y).terrain === t);
    const walls = g.cells.some((c) => c.solid === 'wall'), square = d.rows.every((r) => r.length === d.rows[0].length);
    return { t, fine: seen && walls && square && !MAP_DEFS.some((m) => m.id === d.id) };
  });
  const grounds = ['ash', 'pine', 'ice', 'cliff', 'peak',
    'steppe', 'dunes', 'vines', 'volcano'];
  ok(sampled.map((s) => s.t).join() === grounds.join() && sampled.every((s) => s.fine), `a sample of each ground, its ground in view from its start, a wall in it and no area's (${sampled.map((s) => `${s.t} ${s.fine ? 'fine' : 'wrong'}`).join(', ')})`);
  // Snow lies on both; the grain greens in Sowing and goes gold by Harvest, and fields span squares.
  ok(SNOW_HOLD.hills >= 0.85 && SNOW_HOLD.farm >= 0.85, `snow lies white on hills and fields (${SNOW_HOLD.hills}, ${SNOW_HOLD.farm})`);
  ok([0, 1].every((crop) => cropColor(crop, 20) !== cropColor(crop, 50) && cropColor(crop, 50) !== cropColor(crop, 100)), 'the grain turns from Sowing to Harvest to Frost');
  let spans = 0, crops = new Set<number>();
  for (let y = 0; y < 12; y++) for (let x = 0; x < 12; x++) { if (fieldAt(x, y).id === fieldAt(x + 1, y).id) spans++; crops.add(fieldAt(x, y).crop); }
  ok(hedgeColor(45) === '#3e5e2a' && hedgeColor(100) === '#5a4a38' && hedgeColor(5) !== hedgeColor(45), `the hedges are in leaf at Harvest and bare in Frost (${hedgeColor(45)}, ${hedgeColor(100)})`);
  // On the automap each open ground is its own colour after the parchment wash: farmland is not road.
  const washed = Object.entries(TERRAIN_COLORS).map(([t, c]) => [t, hexToRgb(mix(c, PARCHMENT, AUTOMAP_WASH))] as const);
  let closest = { d: Infinity, pair: '' };
  for (const [a, ca] of washed) for (const [b, cb] of washed) {
    const d = Math.hypot(ca[0] - cb[0], ca[1] - cb[1], ca[2] - cb[2]);
    if (a < b && d < closest.d) closest = { d, pair: `${a} and ${b}` };
  }
  ok(closest.d >= 15, `every terrain's automap colour stands apart from every other (closest ${closest.pair}, ${closest.d.toFixed(1)})`);
  ok(spans >= 60 && crops.size >= 3, `the fields lie in patchwork, each over several squares (${spans} of 144 run on east, ${crops.size} crops)`);
  sight();
}

/** A valley behind a ridge, the ridge across the row y = 3, with room to stand four squares off it. */
const VALLEY = ['MMMMMMMMM', 'M,,,,,,,M', 'M,,,,,,,M', 'M^^^^^^^M', 'M,,,,,,,M', 'M,,,,,,,M', 'M,,,,,,,M', 'M,,,,,,,M', 'M,,,,,,,M', 'MMMMMMMMM'];
/** One hill on open ground, at 3,3. */
const LONE = ['MMMMMMM', 'M,,,,,M', 'M,,,,,M', 'M,,^,,M', 'M,,,,,M', 'M,,,,,M', 'MMMMMMM'];
type When = (wx: Weather, minutes: number) => boolean;
const DAY: When = (wx, m) => weatherSight(wx) === 4 && daylightAt(m) >= 0.6;
const NIGHT: When = (wx, m) => weatherSight(wx) === 4 && daylightAt(m) < 0.1;
const FOG: When = (wx, m) => weatherSight(wx) === 2 && daylightAt(m) >= 0.6;

/**
 * Line of sight over the hills (#53, the delegate's calls): a hill hides what lies behind it from
 * lower ground, from the viewport and the automap, and not from another hill, so a ridge hides the
 * valley until it is climbed and a run of hills is not a wall each square; a company beside a hill
 * sees past it; a wood hides nothing; what stands taller than a hill is seen over it; a group behind
 * the brow is neither drawn nor marked until the company climbs; night, light and fog cut how far and
 * the nearer stop wins; a wall, a door or the mountain hides what lies past it from the squares round
 * the company as well, a secret door among them (#889); and a save made before shows what it showed.
 */
function sight(): void {
  const def = (rows: readonly string[], x: number, y: number, f: Facing, more: Partial<MapDef> = {}): MapDef => ({ id: 'fx_sight', name: 'Sight', kind: 'outdoor', start: { x, y, facing: f }, rows: [...rows], ...more });
  /** A company on (x, y) facing f, at the first hour `when` holds, with nothing marked but what it sees there. */
  const look = (rows: readonly string[], x: number, y: number, f: Facing, when: When = DAY, more: Partial<MapDef> = {}): World => {
    const rng = makeRng(29), w = new World({ fx_sight: new GameMap(def(rows, x, y, f, more)) }, defaultParty(rng), rng);
    w.state.minutes = findWeather(w.state.weatherSeed!, w.state.minutes, CLIMATES.shelf, when);
    w.mapState.explored.fill(0);
    w.travel('fx_sight', x, y, f);
    return w;
  };
  // Each square: m where the automap marks it, s where the viewport draws it.
  const marks = (w: World, sq: [number, number][]): string => sq.map(([x, y]) => `${w.explored(x, y) ? 'm' : '-'}${w.sees(x, y) ? 's' : '-'}`).join(' ');
  const low = look(VALLEY, 4, 5, NORTH), ridge = look(VALLEY, 4, 3, NORTH);
  const below = marks(low, [[4, 3], [4, 2], [4, 1], [3, 2], [5, 2]]), above = marks(ridge, [[4, 2], [4, 1], [3, 1], [5, 1]]);
  ok(below === 'ms -- -- -- --' && above === 'ms ms ms ms', `from the low ground the ridge is seen and the valley past it neither drawn nor marked; from the ridge it is both (${below}; ${above})`);
  const seam = marks(look(VALLEY, 4, 4, NORTH), [[3, 2], [5, 2]]);
  ok(seam === '-- --', `at the ridge's foot the line on the seam of two of its hills is hidden, where one hill's edge hides nothing (below) (${seam})`);
  const run = marks(look(VALLEY, 1, 3, EAST), [[2, 3], [3, 3], [4, 3], [5, 3]]);
  ok(run === 'ms ms ms ms', `on the ridge the hills along it are seen to the day's four squares: a run of hills is no wall each square (${run})`);
  const woods = marks(look(VALLEY.map((r) => r.replace(/\^/g, 't')), 4, 5, NORTH), [[4, 2], [4, 1], [3, 2], [5, 2]]);
  ok(woods === 'ms ms ms ms', `a wood in the ridge's place hides nothing: the view passes between its trees (${woods})`);
  const peaks = marks(look(VALLEY.map((r, y) => (y === 1 ? 'MMMMMMMMM' : r)), 4, 5, NORTH), [[4, 1], [4, 2]]);
  ok(peaks === 'ms --', `the mountain past the ridge stands taller and is seen over it, the ground between not (${peaks})`);
  const tall = look(VALLEY.map((r, y) => (y === 1 ? 'M,,%,B,,M' : r)), 4, 5, NORTH, DAY, { landmarks: [{ x: 5, y: 1, kind: 'lighthouse' }] }), view = standsAt(tall.map, 4, 5, NORTH);
  const ends = [tall.explored(3, 1), tall.explored(5, 1), tall.explored(4, 1), !!view.behind(4, -1), !!view.behind(4, 1), !!view.behind(4, 0)];
  ok(ends.join() === 'true,true,false,false,false,true', `so are the end of the world and a landmark past it, marked and drawn, the ground between them not (${ends.join()})`);
  // The world's end drawn as the atlas paints it (#829): past the ridge a void drawn as the sea or as a hill lies
  // as low as they do and is hidden, one drawn as a mountain is seen over it; and for sight a void is the void,
  // whatever it is drawn as, so one drawn as a hill stops the view from the ridge where a hill would not.
  const sea = VALLEY.map((r, y) => (y === 1 ? 'M,,%%%,,M' : r)), brink = VALLEY.map((r, y) => (y === 2 ? 'M,,,%,,,M' : r));
  const rim = look(sea, 4, 5, NORTH, DAY, { looks: sea.map((r, y) => (y === 1 ? 'M,,~M^,,M' : r)) }), rimView = standsAt(rim.map, 4, 5, NORTH);
  const rimTop = look(sea, 4, 3, NORTH, DAY, { looks: sea.map((r, y) => (y === 1 ? 'M,,~M^,,M' : r)) }), edge = look(brink, 4, 3, NORTH, DAY, { looks: brink.map((r, y) => (y === 2 ? 'M,,,^,,,M' : r)) });
  const worlds = [rim.explored(3, 1), rim.explored(4, 1), rim.explored(5, 1), !!rimView.behind(4, -1), !!rimView.behind(4, 0), !!rimView.behind(4, 1), [3, 4, 5].every((x) => rimTop.explored(x, 1)), edge.explored(4, 2), edge.sees(4, 1)];
  ok(worlds.join() === 'false,true,false,true,false,true,true,true,false', `past the ridge the world's end drawn as the sea or a hill is hidden and as a mountain seen, all three from the ridge; drawn as a hill it still stops the view (${worlds.join()})`);
  // A house past the hill is no wall, house or tent to the scene from below, so nothing beside it is drawn to meet it.
  const HOUSE = ['MMMMMMM', 'M,BBB,M', 'M,,,,,M', 'M,,^,,M', 'M,,,,,M', 'M,,,,,M', 'MMMMMMM'], felt: Partial<MapDef> = { palette: { wallStyle: 'tent' } };
  const under = standsAt(new GameMap(def(HOUSE, 3, 5, NORTH, felt)), 3, 5, NORTH), onto = standsAt(new GameMap(def(HOUSE, 3, 3, NORTH, felt)), 3, 3, NORTH);
  const stand = [under.solidAt(4, 0), under.houseAt(4, 0), under.tentAt(4, 0), under.houseAt(4, 1), under.tentAt(4, 1), onto.solidAt(2, 0), onto.houseAt(2, 0), onto.tentAt(2, 0)];
  ok(stand.join() === 'false,false,false,true,true,true,true,true', `a felt house past a hill is no wall, house or tent to the scene from below, the one beside it is, and from the hill it is all three (${stand.join()})`);
  // One hill: hidden behind from below, seen past from beside it, in the view and in the squares round the company.
  const lone = [marks(look(LONE, 3, 5, NORTH), [[3, 3], [3, 2], [3, 1]]), marks(look(LONE, 4, 4, NORTH), [[3, 2]]), marks(look(LONE, 4, 3, NORTH), [[3, 2], [3, 1]]), marks(look(LONE, 3, 3, NORTH), [[3, 2], [3, 1]])];
  ok(lone.join(' / ') === 'ms -- -- / ms / ms ms / ms ms', `a lone hill hides what is behind it from below, and from beside it or on it that is seen (${lone.join(' / ')})`);
  const round = [look(LONE, 3, 4, SOUTH).explored(3, 2), look(LONE.map((r) => r.replace('^', ',')), 3, 4, SOUTH).explored(3, 2)];
  ok(round.join() === 'false,true', `the squares round the company are marked as before, but not the one behind a hill at its back (${round.join()})`);
  const beside = [look(LONE, 2, 3, NORTH).explored(4, 3), look(LONE, 4, 3, NORTH).explored(2, 3), look(LONE, 3, 2, NORTH).explored(3, 4)];
  ok(beside.join() === 'false,false,false', `nor the one past a hill beside it, on its right or its left, or at its back facing away (${beside.join()})`);
  // A wall hides what lies past it as a hill does (#889). On a clear day the company sees two squares and a
  // Cartographer three; either is marked only where nothing between stops the view. West of the company on
  // open ground (5,3), a stopper one off at 4,3 or two off at 3,3: the three squares from there on, marked or not.
  const field = (stop: string, at: number): string[] => ['MMMMMMMMMMM', 'M,,,,,,,,,M', 'M,,,,,,,,,M', `${'M,,,,,,,,,M'.slice(0, at)}${stop}${'M,,,,,,,,,M'.slice(at + 1)}`, 'M,,,,,,,,,M', 'M,,,,,,,,,M', 'MMMMMMMMMMM'];
  const west = (w: World): string => [4, 3, 2].map((x) => (w.explored(x, 3) ? 'm' : '-')).join('');
  const mapped = (stop: string, at: number, cartographer: boolean, f: Facing = NORTH): string => {
    const w = look(field(stop, at), 5, 3, f);
    if (cartographer) { w.party.members[0].skills = ['cartographer']; w.mapState.explored.fill(0); w.reveal(); }
    return west(w);
  };
  const stoppers = [['a wall', '#'], ['a building', 'B'], ['the mountain', 'M'], ['a door', 'D'], ['a secret door', 'S']];
  const hides = stoppers.map(([, c]) => `${mapped(c, 4, false)} ${mapped(c, 4, true)} ${mapped(c, 4, false, WEST)}`), stands = stoppers.map(([, c]) => `${mapped(c, 3, false)} ${mapped(c, 3, true)}`);
  const clear = `${mapped(',', 4, false)} ${mapped(',', 4, true)}`;
  ok(hides.every((h) => h === 'm-- m-- m--') && stands.every((h) => h === 'mm- mm-') && clear === 'mm- mmm',
    `a wall, a building, the mountain, a door and a secret door one off hide the squares two and three off from a company and from a Cartographer, facing it or not; two off each is marked and hides the third; open ground hides neither (one off ${hides[0]}, two off ${stands[0]}, open ${clear})`);
  // A secret door found is a door, and a door shuts the view: the square behind it is marked once the company stands in the doorway.
  const door = look(field('S', 4), 5, 3, WEST);
  door.party.members[0].skills = ['perception'];
  const unfound = west(door), found = door.search();
  door.mapState.explored.fill(0); door.reveal();
  const shut = west(door);
  door.travel('fx_sight', 4, 3, WEST);
  const through = west(door);
  ok(unfound === 'm--' && found && shut === 'm--' && through === 'mmm', `a secret door hides the square two off while unfound, and found, a closed door still does; it is marked from the doorway (${unfound}; ${shut}; ${through})`);
  // Nor round a corner: no step slips between two squares that stop the view. On open ground at 5,3, a wall west (4,3)
  // and one south (5,4): the square between them (4,4), the one past it (3,5) and one beside the south wall alone (6,4).
  const corner = (wall: boolean, f: Facing): string => {
    const w = look(['MMMMMMMMMMM', 'M,,,,,,,,,M', 'M,,,,,,,,,M', 'M,,,#,,,,,M', `M,,,${wall ? '#' : ','}#,,,,M`, 'M,,,,,,,,,M', 'MMMMMMMMMMM'], 5, 3, f);
    return [[4, 4], [3, 5], [6, 4]].map(([x, y]) => (w.explored(x, y) ? 'm' : '-')).join('');
  };
  const cornered = [WEST, SOUTH, NORTH].map((f) => corner(false, f)), walled = corner(true, NORTH);
  ok(cornered.every((c) => c === '--m') && walled === 'm-m', `the square between two walls one off is not marked, nor the one past it, facing either wall or away; one beside a single wall is; a wall between the two is, so the walls close round the company (${cornered.join(' ')}; ${walled})`);
  // A group behind the brow: not drawn, not marked, not met; from the ridge, all three.
  const brow: Partial<MapDef> = { encounters: [{ id: 'fx_brow', x: 4, y: 2, monsters: ['fen_eel'], roams: false }] };
  const foot = look(VALLEY, 4, 4, NORTH, DAY, brow), top = look(VALLEY, 4, 3, NORTH, DAY, brow);
  // As though it had been seen there before: the automap's near rule still leaves it out behind the hill.
  foot.mapState.explored[(2 * 9 + 4) >> 5] |= 1 << ((2 * 9 + 4) & 31);
  foot.sightings(); top.sightings();
  const hid = [foot.groupsInSight().length, markedGroups(foot).length, foot.state.met?.length ?? 0], shown = [top.groupsInSight().length, markedGroups(top).length, top.state.met?.length ?? 0];
  ok(hid.join() === '0,0,0' && shown.join() === '1,1,1', `a group behind the brow is neither drawn, marked nor met from the ridge's foot, and is from the ridge (${hid.join()}; ${shown.join()})`);
  // Night, light and fog cut how far; the hill cuts the line; the nearer stop wins. Four squares off the ridge:
  const lit = look(VALLEY, 4, 6, NORTH, NIGHT);
  lit.state.light = 20; lit.mapState.explored.fill(0); lit.reveal();
  const cut = [look(VALLEY, 4, 6, NORTH, DAY), look(VALLEY, 4, 6, NORTH, NIGHT), lit, look(VALLEY, 4, 6, NORTH, FOG)].map((w) => `${w.sight}: ${marks(w, [[4, 4], [4, 3], [4, 2]])}`);
  ok(cut.join(' / ') === '4: ms ms -- / 2: ms -- -- / 4: ms ms -- / 2: ms -- --', `by day and by a light the hill stops the view at its brow, and the night and the fog short of it (${cut.join(' / ')})`);
  // A save made before #53 holds what the company marked then, the valley past the ridge among it: it loads and shows it.
  // The mark asked no upgrade of its own at SAVE_VERSION 5, nor at any version after it (6 is #941's, the hermit's flag).
  const old = look(VALLEY, 4, 5, NORTH);
  old.mapState.explored[(2 * 9 + 4) >> 5] |= 1 << ((2 * 9 + 4) & 31);
  const data = deserialize(serialize(old.state, old.party, 1));
  const back = new World({ fx_sight: new GameMap(def(VALLEY, 4, 5, NORTH)) }, data.party, makeRng(1), data.world);
  ok(SAVE_VERSION >= 5 && back.explored(4, 2) && !back.sees(4, 2) && seen(data.world.maps.fx_sight.explored, 2 * 9 + 4), `a save made before loads with what it marked, the valley past the ridge among it, though from there it is not seen now (version ${SAVE_VERSION})`);
}
