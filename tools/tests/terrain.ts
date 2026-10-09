// Hills, farmland, woods, dead wood, crystal, the chasm, salt, heather, tidal ground, ash, pine, ice,
// peaks and cliffs, steppe, dunes, vines and the volcano: their legend characters, snow and the crops through the year, the fields'
// patchwork, the tide, the ice through the year and every terrain's own colour on the automap.
import { GameMap } from '../../src/game/map.ts';
import { NORTH } from '../../src/game/types.ts';
import { SNOW_HOLD, cropColor, fieldAt, hedgeColor, heatherBloom, iceColor, viewCells } from '../../src/ui/viewport.ts';
import { tideAt, TIDE_PERIOD, HIGH_WATER, MINUTES_PER_DAY } from '../../src/game/calendar.ts';
import { hoursHold, VIEW_DEPTH } from '../../src/game/world.ts';
import { MAP_TERRAIN } from '../../src/game/atlas.ts';
import { TERRAIN_COLORS, PARCHMENT, AUTOMAP_WASH } from '../../src/ui/palette.ts';
import { MAP_DEFS } from '../../src/content/index.ts';
import { GROUND_SAMPLES } from '../grounds.ts';
import { mix, hexToRgb } from '../../src/lib/art/palettes.ts';
import { ok } from './lib.ts';

export function terrain(): void {
  // Hills and farmland: their legend characters, open ground both.
  const m = new GameMap({ id: 'fixture_fields', name: 'Fields fixture', kind: 'outdoor', start: { x: 1, y: 1, facing: NORTH }, rows: ['MMMM', 'M^fM', 'MMMM'] });
  ok(m.at(1, 1).terrain === 'hills' && m.at(2, 1).terrain === 'farm', `'^' is hills and 'f' farmland (${m.at(1, 1).terrain}, ${m.at(2, 1).terrain})`);
  ok(m.passable(1, 1) === 'ok' && m.passable(2, 1) === 'ok' && !m.blocksView(1, 1) && !m.blocksView(2, 1), 'both can be walked, and neither hides what lies behind it');
  // Woods: light woodland, walked through and seen past, unlike the forest's wall of trees ('T').
  const w = new GameMap({ id: 'fixture_woods', name: 'Woods fixture', kind: 'outdoor', start: { x: 1, y: 1, facing: NORTH }, rows: ['MMMM', 'MtTM', 'MMMM'] });
  ok(w.at(1, 1).terrain === 'woods' && w.passable(1, 1) === 'ok' && !w.blocksView(1, 1) && w.passable(2, 1) !== 'ok', `'t' is woods, walked through and seen past, where 'T' is a tree that blocks (${w.at(1, 1).terrain}, ${w.passable(2, 1)})`);
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
}
