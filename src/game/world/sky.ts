// The sky (#1008, cut from game/world.ts): the weather where the party stands and in any region,
// each read once a minute (its two memos, keyed by the world); when a thing with a time to walk
// is in the world (`hoursHold`, `walks`, `ended`); the region whose sky a square is under
// (`regionOf`, #945); what the log says of the sky and the M screen's almanac; what the weather
// does to a fight; and the clock's passing (`advance`, `sleepUntilMorning`). The clock's one-line
// readers stay on World.
//
// Functions of the world, each called by World's member of the same name; World is a type here
// alone, so nothing here loads game/world.ts.
import type { GameMap } from '../map.ts';
import type { Hours, Presence } from '../mapdef.ts';
import { passClock } from '../party.ts';
import { MINUTES_PER_DAY, dateAt, daylightAt, sunTimes, longDate, seasonName, clock, tideAt } from '../calendar.ts';
import { weatherAt, classify, isSnowy, skyNews, weatherSight, snowDrag, rangedPenalty, rangedNote, tempWord, SKY_NAMES } from '../weather.ts';
import type { RegionId, Weather } from '../weather.ts';
import { holds } from '../quests.ts';
import { hearthWord } from '../stones.ts';
import type { World } from '../world.ts';

/** Fog as the almanac reads it, and snow lying as it does. */
export const FOG = 0.35;
const SNOW_LYING = 0.15;

/**
 * Whether a time to walk holds at a minute, under a sky (null underground, where there is none).
 * Of a list any one will do, and an entry's parts all hold.
 */
export function hoursHold(when: Hours | readonly Hours[], minutes: number, weather: Weather | null): boolean {
  return [when].flat().some((h) => {
    if (h.hours && (daylightAt(minutes) < 0.25 ? 'night' : 'day') !== h.hours) return false;
    if (h.season && ![h.season].flat().includes(dateAt(minutes).season)) return false;
    if (h.tide && tideAt(minutes) !== h.tide) return false;
    if (h.sky === 'fog' && !(weather && weather.fog >= FOG)) return false;
    if (h.sky === 'snow' && !(weather && (isSnowy(classify(weather).sky) || weather.cover >= SNOW_LYING))) return false;
    return true;
  });
}

/**
 * The region whose sky a square of a played map is under: its zone's on the outdoors, else the
 * map's own. Throws, naming the map and the square, where neither names one: no sky is lent (#945).
 */
export function regionOf(m: GameMap, x: number, y: number): RegionId {
  const r = m.zoneAt(x, y)?.region ?? m.def.region;
  if (!r) throw new Error(`map '${m.id}' names no region, nor does a zone at ${x},${y}`);
  return r;
}

/** The weather where the party stands, as last read: World opens it to the smoke, to pin a sky. */
export interface Reading { seed: number; minutes: number; region: RegionId; weather: Weather }
export const cached = new WeakMap<World, Reading>();
/** The weather of every region a group has asked after, this minute: liveGroups runs every frame. */
const skies = new WeakMap<World, { seed: number; minutes: number; by: Map<RegionId, Weather> }>();

/** The weather in this map's region now; also the weather over a dungeon, though nobody there sees it. */
export function weather(world: World): Weather {
  const c = cached.get(world), seed = world.state.weatherSeed!, minutes = world.state.minutes, region = world.region;
  if (c && c.seed === seed && c.minutes === minutes && c.region === region) return c.weather;
  const weather = weatherAt(seed, minutes, world.tables.climates[region]);
  cached.set(world, { seed, minutes, region, weather });
  return weather;
}

/** The weather in a region now, whoever stands in it. */
export function weatherIn(world: World, region: RegionId): Weather {
  if (region === world.region) return world.weather;
  const seed = world.state.weatherSeed!, minutes = world.state.minutes;
  let memo = skies.get(world);
  if (!memo || memo.seed !== seed || memo.minutes !== minutes) { memo = { seed, minutes, by: new Map() }; skies.set(world, memo); }
  let w = memo.by.get(region);
  if (!w) { w = weatherAt(seed, minutes, world.tables.climates[region]); memo.by.set(region, w); }
  return w;
}

/**
 * Whether a thing with a time to walk is in the world now, at a square of a map: in its hours
 * (under the sky of that square's region) and past its `after`. `until` is `ended`'s. The map is
 * the one the party is on unless named; a zone map's square is read where the outdoors lays it.
 */
export function walks(world: World, p: Presence, x: number, y: number, on?: string): boolean {
  if (p.after && !holds(p.after, world.state, world.party)) return false;
  if (!p.when) return true;
  const at = on === undefined ? { mapId: world.state.mapId, x, y } : world.locate(on, x, y), m = world.maps[at.mapId];
  if (!m) throw new Error(`unknown map '${on}'`);
  return hoursHold(p.when, world.state.minutes, m.kind === 'dungeon' ? null : world.weatherIn(regionOf(m, at.x, at.y)));
}

/** Whether a thing's `until` holds: a group stops coming back (one that `leaves` is gone), a person or an event is gone. */
export function ended(world: World, p: Presence): boolean {
  return !!p.until && holds(p.until, world.state, world.party);
}

/**
 * A log line when the sky has changed since the party last looked, or on first seeing it (a new
 * game, a load, the way out of a dungeon); null when there is nothing to say. Underground the sky
 * is forgotten, so coming up says what it is doing now rather than what changed.
 */
export function weatherNews(world: World): string | null {
  if (!world.underSky) { world.sky = null; return null; }
  const prev = world.sky;
  world.sky = classify(world.weather, prev);
  return skyNews(prev?.sky ?? null, world.sky.sky, world.climate);
}

/** The M screen's almanac: the date and the season, the hours of light, the sky and what it is doing to the party. */
export function almanac(world: World): string {
  const d = world.date, sun = sunTimes(d.dayOfYear), date = longDate(d);
  const steady = hearthWord(world.hearth);
  const lines = [`${date[0].toUpperCase()}${date.slice(1)}: ${seasonName(d)}. Day ${d.gameDay} since the Hearth flickered.${steady ? ' ' + steady : ''}`, `Dawn ${clock(sun.dawn)}, dusk ${clock(sun.dusk)}.`];
  if (!world.underSky) return [...lines, 'Underground, there is no telling the weather.'].join('\n');
  const wx = world.weather, sky = classify(wx, world.sky).sky, seen = weatherSight(wx);
  const cause = wx.fog >= 0.35 ? 'fog' : wx.snow >= 0.7 ? 'snow' : wx.snow > 0.3 ? 'sleet' : 'rain';
  const effects = [
    seen < 4 ? `The ${cause} hides all but ${seen === 2 ? 'two squares' : 'three squares'} ahead.` : '',
    rangedPenalty(wx) ? 'Bows and slings will shoot poorly.' : '',
    snowDrag(wx) ? 'Snow lies deep, and the going is slow.' : wx.cover >= 0.15 ? 'Snow lies on the ground.' : '',
  ].filter(Boolean);
  return [...lines, `${SKY_NAMES[sky]}, and ${tempWord(wx.temp)}.${effects.length ? ' ' + effects.join(' ') : ''}`].join('\n');
}

/** What the weather does to a fight here: a to-hit loss for bows on both sides, and a line for the log. */
export function combatWeather(world: World): { rangedPenalty: number; note?: string } {
  if (!world.underSky) return { rangedPenalty: 0 };
  return { rangedPenalty: rangedPenalty(world.weather), note: rangedNote(world.weather) };
}

/** The clock moves on: every passage of time goes through here, so what it does to what the company bears happens here (`passClock`). */
export function advance(world: World, minutes: number): void {
  const from = world.state.minutes;
  world.state.minutes += minutes;
  passClock(world.tables.items, world.party, from, world.state.minutes);
}

/** Sleep through to the next morning: 07:00, or first light where the day breaks later, deep in winter. */
export function sleepUntilMorning(world: World): void {
  const now = world.state.minutes;
  let wake = Math.floor(now / MINUTES_PER_DAY) * MINUTES_PER_DAY + 7 * 60;
  if (wake <= now) wake += MINUTES_PER_DAY;
  const dawn = Math.floor(wake / MINUTES_PER_DAY) * MINUTES_PER_DAY + Math.ceil(sunTimes(dateAt(wake).dayOfYear).dawn * 60);
  world.advance(Math.max(wake, dawn) - now);
}
