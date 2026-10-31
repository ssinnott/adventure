// What moves over the view outdoors (#1109), with no canvas: what `lifeIn` (src/ui/view/life.ts) says
// moves in view, held to the issue's Done when and to restraint. A clear summer noon on the Glasswold
// shows shimmer and birds; Ashfall's ash drifts across the view the way the wind blows, more of it the
// harder; mist lies over the delta's water at dawn and gulls fly over its shallows; fireflies light
// Lanternwood on a summer night. Nothing moves underground or in fog, nor by night but the fireflies;
// every part keeps to its cap in every view of the outdoors sampled; and what moves is the same for the
// same world and draws nothing from the generator. That a fight draws none, and what the parts look
// like, need a canvas: the smoke's (tools/smoke/flows.ts, `kept`).
import { makeRng } from '../../src/lib/engine/rng.ts';
import { buildMaps } from '../../src/content/maps.ts';
import { TABLES } from '../../src/content/index.ts';
import { World } from '../../src/game/world.ts';
import { defaultParty } from '../../src/game/party.ts';
import type { Facing } from '../../src/game/types.ts';
import type { Weather } from '../../src/game/weather.ts';
import { lifeIn, LIFE_CAPS } from '../../src/ui/view/life.ts';
import type { Life } from '../../src/ui/view/life.ts';
import { ok } from './lib.ts';

/** A fair day: a high thin sky, dry and warm, a light wind. */
const FAIR: Partial<Weather> = { cloud: 0.1, precip: 0, snow: 0, fog: 0, storm: 0, wind: 0.3, windDir: 0.5, temp: 30, cover: 0, wet: 0 };

export function life(): void {
  const a = makeRng(1), b = makeRng(1), w = new World(TABLES, buildMaps(), defaultParty(TABLES, a), a);
  new World(TABLES, buildMaps(), defaultParty(TABLES, b), b);
  /** At a place on game day `day` at `hour`, under the weather of seed 1 there, or that weather with `pin` laid over it. */
  const at = (map: string, x: number, y: number, f: Facing, day: number, hour: number, pin?: Partial<Weather>): Life => {
    w.travel(map, x, y, f); w.state.weatherSeed = 1; w.state.minutes = Math.round((day - 1) * 1440 + hour * 60); w.cached = null;
    if (pin) w.cached = { seed: 1, minutes: w.state.minutes, region: w.region, weather: { ...w.weather, ...pin } };
    return lifeIn(w);
  };
  const say = (l: Life): string => `birds ${l.birds}, gulls ${l.gulls}, ash ${l.ash}, shimmer ${l.shimmer}, fireflies ${l.fireflies}, mist ${l.mist.length}`;
  const none = (l: Life): boolean => !l.birds && !l.gulls && !l.ash && !l.shimmer && !l.fireflies && !l.mist.length;

  // The Done when, at the survey's views (#1094): 11:00 on game day 91, midsummer, the weather's seed 1.
  const wold = at('wold_c8', 14, 26, 0, 91, 11), noon = at('wold_c8', 14, 26, 0, 91, 12, { cloud: 0, precip: 0, fog: 0 });
  ok(wold.birds > 0 && wold.shimmer > 0 && noon.birds > 0 && noon.shimmer > 0, `a clear summer noon on the Glasswold shows shimmer and birds (the survey's view: ${say(wold)}; at noon under a clear sky: ${say(noon)})`);
  const ember = at('emberwaste_f11', 22, 19, 0, 91, 11);
  // A wind toward the east blows across the view to the right facing north and to the left facing south.
  const east = { wind: 0.8, windDir: 0 }, north = at('emberwaste_f11', 22, 19, 0, 91, 11, east), south = at('emberwaste_f11', 22, 19, 2, 91, 11, east);
  const still = at('emberwaste_f11', 22, 19, 0, 91, 11, { wind: 0 });
  ok(ember.ash > 0 && north.across > 0.5 && south.across < -0.5 && north.ash > still.ash && still.ash > 0,
    `Ashfall's ash drifts with the wind: ${ember.ash} flakes in the survey's view; a wind to the east carries them right facing north (${north.across.toFixed(2)}) and left facing south (${south.across.toFixed(2)}), and lifts ${north.ash} where a still day lifts ${still.ash}`);
  const delta = at('delta_b5', 22, 19, 0, 91, 4.5), wood = at('lanternwood_l3', 9, 10, 3, 91, 23);
  ok(delta.mist.length > 0 && delta.gulls > 0 && wood.fireflies > 0 && !wood.birds,
    `at dawn mist lies over the delta's water and gulls fly over its shallows (${say(delta)}); a summer night in Lanternwood has its fireflies (${say(wood)})`);
  // Underground: every other square of every dungeon, all four facings, at dawn, noon and midnight under a fair sky
  // (the dawn's mist would lie on the water of some of them, were it drawn there).
  let below = 0, alive = '';
  for (const id of Object.keys(w.maps)) {
    const m = w.maps[id];
    if (m.kind !== 'dungeon') continue;
    for (let y = 1; y < m.height; y += 2) for (let x = 1; x < m.width; x += 2) {
      if (m.at(x, y).solid !== 'none') continue;
      for (const hour of [4.5, 12, 23]) {
        at(id, x, y, 0, 91, hour, FAIR);
        for (const f of [0, 1, 2, 3] as const) {
          w.state.facing = f; below++;
          const l = lifeIn(w);
          if (!alive && !none(l)) alive = ` -> ${id} ${x},${y} f${f} ${hour}h: ${say(l)}`;
        }
      }
    }
  }
  const fog = at('wold_c8', 14, 26, 0, 91, 11, { ...FAIR, fog: 0.8 });
  ok(below > 1000 && !alive && none(fog), `nothing moves underground (${below} views of the dungeons at dawn, noon and midnight under a fair sky${alive}) or in fog (the Glasswold: ${say(fog)})`);

  // Same world, same life: a turn away and back, and reading it again, draw nothing from the generator.
  const once = JSON.stringify(at('wold_c8', 14, 26, 0, 91, 11)); at('wold_c8', 14, 26, 1, 91, 11);
  ok(JSON.stringify(at('wold_c8', 14, 26, 0, 91, 11)) === once && a.next() === b.next() && a.next() === b.next(), 'what moves is the same for the same world, a turn away and back, and draws nothing from the generator');

  // Restraint: every fourth square of the outdoors each way, all four facings, at dawn, at noon and at midnight on
  // midsummer's day under a fair sky. No part over its cap, the birds and gulls three at most together, and by night
  // nothing but the fireflies.
  w.travel('wold_c8', 14, 26, 0);
  const map = w.map, seen: Record<string, number> = { birds: 0, gulls: 0, ash: 0, shimmer: 0, fireflies: 0, mist: 0 }, over: string[] = [];
  let views = 0;
  for (const hour of [4.5, 11, 23]) {
    w.state.minutes = Math.round(90 * 1440 + hour * 60);
    for (let y = 2; y < map.height; y += 4) for (let x = 2; x < map.width; x += 4) {
      const c = map.at(x, y);
      if (c.solid !== 'none' || !map.zoneAt(x, y)) continue;
      w.state.x = x; w.state.y = y;
      w.cached = { seed: w.state.weatherSeed!, minutes: w.state.minutes, region: w.region, weather: { ...w.weather, ...FAIR } };
      for (const f of [0, 1, 2, 3] as const) {
        w.state.facing = f;
        const l = lifeIn(w), n = { ...l, mist: l.mist.length };
        views++;
        for (const k of Object.keys(seen) as (keyof typeof LIFE_CAPS)[]) {
          if (n[k] > 0) seen[k]++;
          if (n[k] > LIFE_CAPS[k] && over.length < 5) over.push(`${k} ${n[k]} at ${x},${y} f${f} ${hour}h`);
        }
        if (l.birds + l.gulls > 3 && over.length < 5) over.push(`${l.birds} birds and ${l.gulls} gulls at ${x},${y} f${f} ${hour}h`);
        if (hour === 23 && (l.birds || l.gulls || l.ash || l.shimmer || l.mist.length) && over.length < 5) over.push(`by night ${say(l)} at ${x},${y} f${f}`);
      }
    }
  }
  ok(views > 1000 && over.length === 0, `each part keeps to its cap (${Object.entries(LIFE_CAPS).map(([k, n]) => `${k} ${n}`).join(', ')}) in ${views} views of the outdoors at dawn, noon and midnight on a fair midsummer's day, and by night only the fireflies move${over.length ? ' -> ' + over.join('; ') : ''}`);
  console.log(`  (the share of those views each part moves in: ${Object.entries(seen).map(([k, n]) => `${k} ${(100 * n / views).toFixed(0)}%`).join(', ')})`);
}
