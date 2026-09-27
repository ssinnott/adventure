// The weather: a pure function of its seed, what each region's years bring, the log's wording, and
// what it does to sight, steps and bows.
import { makeRng } from '../../src/lib/engine/rng.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { MAP_DEFS, CLIMATES } from '../../src/content/index.ts';
import { World } from '../../src/game/world.ts';
import { defaultParty } from '../../src/game/party.ts';
import { dateAt, daylightAt, DAYS_PER_YEAR, EPOCH_DAY, MIDSUMMER } from '../../src/game/calendar.ts';
import type { Season } from '../../src/game/calendar.ts';
import { weatherAt, findWeather, classify, skyNews, fairStart, weatherSight, rangedPenalty, snowDrag, RANGED_PENALTY, SNOW_DRAG, isRainy, isSnowy } from '../../src/game/weather.ts';
import type { Climate, Sky, Weather } from '../../src/game/weather.ts';
import { START_MINUTES } from '../../src/game/world.ts';
import { ok } from './lib.ts';

export function weather(): void {
  const shelf = CLIMATES.shelf, thorn = CLIMATES.thornmark;
  ok(JSON.stringify(weatherAt(7, 5000, shelf)) === JSON.stringify(weatherAt(7, 5000, shelf)), 'the weather is a pure function of the seed and the minute');
  let differ = 0; for (let h = 0; h < 240; h++) if (classify(weatherAt(7, h * 60, shelf)).sky !== classify(weatherAt(8, h * 60, shelf)).sky) differ++;
  ok(differ > 40, `another seed brings other weather (${differ} of 240 hours differ)`);
  // Three years of hours in each region, one seed a year.
  const sim = (c: Climate): { sky: Record<Season, Partial<Record<Sky, number>>>; warmestSnow: number; summerCover: number; winterDeep: number; maxCover: number; maxWet: number; spells: number[] } => {
    const out = { sky: { spring: {}, summer: {}, autumn: {}, winter: {} } as Record<Season, Partial<Record<Sky, number>>>, warmestSnow: -99, summerCover: 0, winterDeep: 0, maxCover: 0, maxWet: 0, spells: [] as number[] };
    for (const seed of [11, 777, 4242]) {
      let spell = 0, winterHours = 0, deep = 0;
      for (let h = 0; h < DAYS_PER_YEAR * 24; h++) {
        const m = h * 60, w = weatherAt(seed, m, c), s = dateAt(m).season, k = classify(w).sky;
        out.sky[s][k] = (out.sky[s][k] ?? 0) + 1;
        if (w.precip >= 0.08 && w.snow >= 0.7) out.warmestSnow = Math.max(out.warmestSnow, w.temp);
        if (s === 'summer') out.summerCover = Math.max(out.summerCover, w.cover);
        if (s === 'winter') { winterHours++; if (w.cover >= 0.5) deep++; }
        out.maxCover = Math.max(out.maxCover, w.cover); out.maxWet = Math.max(out.maxWet, w.wet);
        if (w.precip >= 0.08) spell++; else if (spell) { out.spells.push(spell); spell = 0; }
      }
      out.winterDeep += deep / winterHours / 3;
    }
    return out;
  };
  const count = (r: Partial<Record<Sky, number>>, pick: (s: Sky) => boolean): number => Object.entries(r).reduce((n, [k, v]) => n + (pick(k as Sky) ? v! : 0), 0);
  const sh = sim(shelf), tm = sim(thorn);
  for (const s of ['spring', 'summer', 'autumn', 'winter'] as Season[]) ok(count(sh.sky[s], isRainy) > 0, `it rains on the Shelf in the ${s}`);
  const year = (r: typeof sh, k: Sky): number => (['spring', 'summer', 'autumn', 'winter'] as Season[]).reduce((n, s) => n + (r.sky[s][k] ?? 0), 0);
  ok(year(sh, 'drizzle') > 0 && year(sh, 'rain') > 0 && year(sh, 'downpour') > 0 && year(sh, 'storm') > 0, `the rain comes in every strength: drizzle ${year(sh, 'drizzle')}h, rain ${year(sh, 'rain')}h, downpour ${year(sh, 'downpour')}h, thunderstorms ${year(sh, 'storm')}h`);
  ok(year(sh, 'downpour') < year(sh, 'rain') + year(sh, 'drizzle'), 'and downpours are the rarer kind');
  ok((sh.sky.autumn.fog ?? 0) > (sh.sky.summer.fog ?? 0), `the Shelf's fogs come in the autumn (${sh.sky.autumn.fog ?? 0}h against ${sh.sky.summer.fog ?? 0}h in summer)`);
  ok(sh.warmestSnow < 0 && tm.warmestSnow < 0, `snow falls only below freezing (warmest snowfall ${Math.max(sh.warmestSnow, tm.warmestSnow).toFixed(1)} degrees)`);
  ok(count(sh.sky.summer, isSnowy) + count(tm.sky.summer, isSnowy) === 0 && sh.summerCover === 0 && tm.summerCover === 0, 'no snow falls or lies in the summer');
  ok(count(tm.sky.winter, isSnowy) > count(sh.sky.winter, isSnowy) * 2, `Thornmark's winter snows far more than the Shelf's (${count(tm.sky.winter, isSnowy)}h against ${count(sh.sky.winter, isSnowy)}h)`);
  ok(year(tm, 'blizzard') > 0 && (year(tm, 'sleet') + year(sh, 'sleet')) > 0, `blizzards blow in Thornmark (${year(tm, 'blizzard')}h) and sleet falls somewhere (${year(tm, 'sleet') + year(sh, 'sleet')}h)`);
  ok(tm.winterDeep > 0.3 && sh.winterDeep < tm.winterDeep, `snow lies deep over the pass for much of the winter (${(tm.winterDeep * 100).toFixed(0)}% of hours; the Shelf ${(sh.winterDeep * 100).toFixed(0)}%)`);
  ok(tm.maxCover === 1 && sh.maxWet > 0.9, 'the ground can be buried in snow and stand in water');
  const meanSpell = sh.spells.reduce((a, b) => a + b, 0) / sh.spells.length;
  ok(meanSpell >= 3, `a wet spell lasts hours, not minutes (mean ${meanSpell.toFixed(1)} hours)`);
  // The log: hysteresis keeps a shower on a boundary from flickering, and the news reads right.
  const edge: Weather = { ...weatherAt(1, 0, shelf), precip: 0.28, snow: 0, fog: 0, storm: 0 };
  ok(classify(edge).sky === 'drizzle' && classify(edge, { sky: 'rain', band: 2 }).sky === 'rain', 'rain easing just under the threshold stays rain until it clearly eases');
  ok(skyNews(null, 'rain', shelf) === 'It is raining.' && skyNews(null, 'clear', shelf) === null, 'first sight of the sky reports rain and says nothing of a clear day');
  ok(skyNews('clear', 'rain', shelf) === 'Rain begins to fall.' && skyNews('rain', 'overcast', shelf) === 'The rain stops.' && skyNews('rain', 'snow', thorn) === 'The rain turns to snow.', 'changes read as changes');
  ok(skyNews('clear', 'fog', shelf) === shelf.fogText && skyNews('clear', 'fog', thorn) === thorn.fogText && skyNews('cloudy', 'overcast', shelf) === null, 'fog comes in its region\'s own words; cloud is left to the eye');
  // A new world opens on a fair morning and never draws on the gameplay rng again.
  for (const seed of [1, 2, 3, 4, 5]) {
    const r = makeRng(seed), w = new World(buildMaps(), defaultParty(r), r);
    ok(fairStart(w.state.weatherSeed!, START_MINUTES, shelf) && w.weather.precip < 0.05 && w.weather.fog < 0.3, `a new game (seed ${seed}) opens dry and clear of fog`);
  }
  {
    const a = makeRng(3), b = makeRng(3);
    const wa = new World(buildMaps(), defaultParty(a), a), wb = new World(buildMaps(), defaultParty(b), b);
    for (let i = 0; i < 50; i++) { wa.advance(97); void wa.weather; wa.weatherNews(); void wa.sight; }
    ok(a.next() === b.next() && a.next() === b.next(), 'reading the weather draws nothing from the gameplay rng');
  }
  // What it does: fog and downpours close the view outdoors (a Light spell does not cut fog), not underground.
  const r = makeRng(5), world = new World(buildMaps(), defaultParty(r), r), seed = world.state.weatherSeed!;
  const daylit = (m: number): boolean => daylightAt(m) === 1;
  const fogAt = findWeather(seed, START_MINUTES, shelf, (w, m) => w.fog >= 0.6 && daylit(m));
  world.travel('shelf', 16, 8, 2); world.state.minutes = fogAt;
  ok(fogAt > 0 && world.sight === 2, `thick fog by day leaves two squares of sight on the Shelf (${world.sight})`);
  world.state.light = 50;
  ok(world.sight === 2, 'and a Light spell does not cut through it');
  world.travel('mill', 1, 1, 2);
  ok(world.sight === 4 && world.weatherNews() === null && world.combatWeather().rangedPenalty === 0, 'underground the weather neither blinds, nor speaks, nor spoils a shot');
  world.state.light = 0;
  const pourAt = findWeather(seed, START_MINUTES, shelf, (w, m) => w.precip >= 0.7 && w.snow === 0 && w.fog < 0.35 && daylit(m));
  world.travel('shelf', 16, 8, 2); world.state.minutes = pourAt; world.sky = null;
  ok(pourAt > 0 && world.sight === 3 && world.combatWeather().rangedPenalty === RANGED_PENALTY && !!world.combatWeather().note, `a downpour by day leaves three squares of sight and spoils bows (sight ${world.sight})`);
  ok(/pouring|heavens|sheets|thunder/i.test(world.weatherNews() ?? ''), 'and the log says it is pouring when the party looks up');
  ok(/Bows and slings will shoot poorly/.test(world.almanac()) && /three squares/.test(world.almanac()), 'the almanac says so too');
  // Deep snow slows a step outdoors, not in town.
  const snowAt = findWeather(seed, START_MINUTES, thorn, (w) => w.cover >= 0.5);
  world.travel('thornmark', 13, 12, 2); world.state.minutes = snowAt;
  const before = world.state.minutes, stepped = world.move('forward');
  ok(snowAt > 0 && stepped.kind === 'moved' && world.state.minutes - before === 6 + SNOW_DRAG && snowDrag(weatherAt(seed, before, thorn)) === SNOW_DRAG, `a step through deep snow takes ${world.state.minutes - before} minutes`);
  ok(/Snow lies deep/.test(world.almanac()), 'the almanac warns of it');
  const clearAt = findWeather(seed, START_MINUTES, shelf, (w) => w.cover === 0 && w.precip === 0);
  world.travel('shelf', 16, 8, 2); world.state.minutes = clearAt;
  const b2 = world.state.minutes; world.move('forward');
  ok(world.state.minutes - b2 === 6 && weatherSight(world.weather) === 4 && rangedPenalty(world.weather) === 0, 'a dry step on bare ground takes the usual six');
  // The inn wakes the party at 07:00, or at first light in the depth of winter.
  world.state.minutes = 0; world.sleepUntilMorning();
  ok(world.state.minutes === 7 * 60, 'in the autumn the inn wakes the party at 07:00');
  world.state.minutes = (MIDSUMMER + DAYS_PER_YEAR / 2 - EPOCH_DAY) * 1440 + 22 * 60; world.sleepUntilMorning();
  ok(world.hour === 8 && world.daylight >= 0.5, `at midwinter it waits for the light (${world.hour}:${String(world.minute).padStart(2, '0')})`);
  // Towns and dungeons share their region's weather; only the open road crosses from one to the next.
  for (const def of MAP_DEFS) for (const e of def.exits ?? []) {
    const to = MAP_DEFS.find((d) => d.id === e.to)!;
    if (def.kind !== 'outdoor' || to.kind !== 'outdoor') ok((def.region ?? 'shelf') === (to.region ?? 'shelf'), `${def.id} and ${to.id} share a region`);
  }
}
