// Hills, farmland, woods, dead wood, crystal, the chasm, salt, heather and tidal ground: their legend
// characters, snow and the crops through the year, the fields' patchwork, the tide, and every
// terrain's own colour on the automap.
import { GameMap } from '../../src/game/map.ts';
import { NORTH } from '../../src/game/types.ts';
import { SNOW_HOLD, cropColor, fieldAt, hedgeColor, heatherBloom } from '../../src/ui/viewport.ts';
import { tideAt, TIDE_PERIOD, HIGH_WATER, MINUTES_PER_DAY } from '../../src/game/calendar.ts';
import { hoursHold } from '../../src/game/world.ts';
import { TERRAIN_COLORS, PARCHMENT, AUTOMAP_WASH } from '../../src/ui/palette.ts';
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
