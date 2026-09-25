// The weather. A pure function of a per-save seed, the minute on the world clock and the region's
// climate: smooth noise in time for how wet the air is, how cold, how windy and how foggy, so a
// front takes hours to come in and a shower comes and goes inside it. The time of year sets the
// odds and the temperature, the temperature decides between rain, sleet and snow, and what lies on
// the ground (snow, puddles) is the same function run over the days before. Nothing here draws from
// the gameplay rng, so a seed brings the same fights in any weather.
import { MINUTES_PER_DAY, DAYS_PER_YEAR, yearPhase } from './calendar.ts';

/** The regions with maps so far. Each map names its region; towns and dungeons share their region's sky. */
export type RegionId = 'shelf' | 'thornmark';

export interface Climate {
  /** Mean temperature at the height of summer and in the depth of winter, in degrees. */
  summer: number; winter: number;
  /** How far the warm afternoon and the cold small hours stray from the day's mean under a clear sky. */
  daily: number;
  /** How damp the air runs at the driest and at the wettest time of year: shifts the odds of rain or snow. */
  damp: [number, number];
  /** Day of the year at the wettest. */
  wettest: number;
  /** How readily fog lies, 0 .. 1. */
  fog: number;
  /** Hours a front takes to reach here after crossing the Shelf: the regions share their weather, a little apart. */
  lag: number;
  /** Log lines for fog coming in and thunder starting. */
  fogText: string; thunderText: string;
}

export const CLIMATES: Record<RegionId, Climate> = {
  // The coast: mild, wet in the autumn, fog off the sea. Snow only in a cold snap.
  shelf: { summer: 18, winter: 2, daily: 4, damp: [0.01, 0.07], wettest: 85, fog: 0.8, lag: 0,
    fogText: 'Fog rolls in off the sea.', thunderText: 'Thunder rolls in off the sea.' },
  // Over the pass: colder, with hard winters that keep their snow, and mist under the trees.
  thornmark: { summer: 17, winter: -4, daily: 5, damp: [0, 0.06], wettest: 80, fog: 0.5, lag: 5,
    fogText: 'Mist rises between the trees.', thunderText: 'Thunder rolls over the forest.' },
};

export interface Weather {
  /** Cloud cover: 0 a clear sky .. 1 a lid of grey. */
  cloud: number;
  /** How hard it comes down: 0 dry .. 1 a downpour or a blizzard. */
  precip: number;
  /** How much of what falls is snow: 0 rain, 1 snow, sleet between. */
  snow: number;
  /** Fog lying on the ground, 0 .. 1. */
  fog: number;
  /** Wind strength, 0 .. 1, and the way it blows in radians: 0 toward the east, a quarter turn toward the south. */
  wind: number; windDir: number;
  /** Thunder and lightning in the rain, 0 .. 1. */
  storm: number;
  /** Air temperature, degrees. */
  temp: number;
  /** Snow lying on the ground (0 bare .. 1 deep), and how wet the ground is (0 dry .. 1 standing water). */
  cover: number; wet: number;
}

/**
 * A deterministic hash in [0, 1). Every input is run through murmur3's finalizer, so neighbouring
 * inputs and different channels give unrelated values: noise needs the values at neighbouring
 * hours to be independent, and rain needs a drop's x unrelated to its y. (The art's `hash` in
 * ui/brush.ts is lighter and fine for picking stable detail, but not for either of those.)
 */
export function mixHash(...n: number[]): number {
  let h = 0x811c9dc5;
  for (const v of n) { h = Math.imul(h ^ (v | 0), 0x01000193); h ^= h >>> 16; h = Math.imul(h, 0x85ebca6b); h ^= h >>> 13; h = Math.imul(h, 0xc2b2ae35); h ^= h >>> 16; }
  return (h >>> 0) / 4294967296;
}

/** Smooth value noise in time: a stable random value at each whole `t`, eased between them. */
function noise(seed: number, channel: number, t: number): number {
  const i = Math.floor(t), f = t - i, u = f * f * (3 - 2 * f);
  return mixHash(seed, channel, i) * (1 - u) + mixHash(seed, channel, i + 1) * u;
}

const clamp01 = (v: number): number => v < 0 ? 0 : v > 1 ? 1 : v;
/** A yearly wave: 1 on `peak` (a day of the year), -1 half a year away. */
const yearly = (phase: number, peak: number): number => Math.cos(2 * Math.PI * (phase - peak) / DAYS_PER_YEAR);
/** Day of the year the warmth peaks, a few days after midsummer. */
const WARMEST = 50;

/** The weather in the air at one minute, before the ground is considered (cover and wet are 0). */
function air(seed: number, minutes: number, c: Climate): Weather {
  const t = minutes / 60 - c.lag;                  // hours, shifted by how far fronts have to come
  const phase = yearPhase(minutes);
  const hour = ((minutes % MINUTES_PER_DAY) + MINUTES_PER_DAY) % MINUTES_PER_DAY / 60;
  const summery = Math.max(0, yearly(phase, WARMEST));
  // How wet the air is: fronts over days, showers over hours, bursts inside the showers. Summer
  // afternoons build their own storms.
  const damp = (c.damp[0] + c.damp[1]) / 2 + (c.damp[1] - c.damp[0]) / 2 * yearly(phase, c.wettest);
  const afternoon = Math.max(0, Math.cos(2 * Math.PI * (hour - 15) / 24));
  const wetness = 0.5 * noise(seed, 1, t / 40) + 0.3 * noise(seed, 2, t / 11) + 0.2 * noise(seed, 3, t / 3)
    + damp + 0.05 * summery * afternoon * afternoon;
  const precip = clamp01((wetness - 0.64) / 0.24);
  const cloud = clamp01((wetness - 0.44) / 0.2);
  // Temperature: the season, the hour (flattened under cloud), warm spells and cold snaps over days,
  // and the chill of the rain itself.
  const temp = (c.summer + c.winter) / 2 + (c.summer - c.winter) / 2 * yearly(phase, WARMEST)
    + c.daily * Math.cos(2 * Math.PI * (hour - 15) / 24) * (1 - 0.6 * cloud)
    + (noise(seed, 4, t / 60) - 0.5) * 10 - 2 * precip;
  const snow = clamp01((1.5 - temp) / 2.5);
  const wind = clamp01(noise(seed, 5, t / 9) * 0.9 + precip * 0.35 - 0.15);
  // Mostly westerlies, off the sea, swinging over a couple of days.
  const windDir = (noise(seed, 6, t / 40) - 0.5) * 2.6;
  // Fog: still, damp air, most of all in the small hours and in the late autumn.
  const morning = Math.max(0, Math.cos(2 * Math.PI * (hour - 6) / 24));
  const fogPot = noise(seed, 7, t / 7) + 0.35 * morning + 0.35 * c.fog * (0.5 + 0.5 * yearly(phase, 85)) + 0.2 * Math.max(0, wetness - 0.4);
  const fog = clamp01((fogPot - 1.06) / 0.3) * clamp01((0.75 - wind) / 0.45) * (1 - Math.min(1, precip * 1.5));
  const storm = precip >= 0.45 && temp >= 12 ? clamp01((noise(seed, 8, t / 3) - 0.45) / 0.3) : 0;
  return { cloud, precip, snow, fog, wind, windDir, storm, temp, cover: 0, wet: 0 };
}

/** Minutes between the samples the ground is settled over, and how many days back it looks. */
const GROUND_STEP = 120, GROUND_DAYS = 10;

/**
 * The weather at a minute on the world clock in a climate, including what lies on the ground:
 * snow that has fallen and not melted, and the wet left by rain and thaw, settled over the days
 * before from the same noise.
 */
export function weatherAt(seed: number, minutes: number, c: Climate): Weather {
  let cover = 0, wet = 0;
  const settle = (a: Weather, hours: number): void => {
    const rain = a.precip * (1 - a.snow);
    const melt = Math.min(cover, hours * (Math.max(0, a.temp) * 0.012 + (a.temp > 0 ? rain * 0.08 : 0)));
    cover = Math.min(1.5, cover - melt + a.precip * a.snow * 0.25 * hours);
    wet = clamp01(wet + rain * 0.6 * hours + melt * 0.5 - hours * (0.05 + 0.012 * Math.max(0, a.temp)) * (1 - 0.5 * a.cloud));
  };
  const last = Math.floor(minutes / GROUND_STEP) * GROUND_STEP;
  for (let m = last - GROUND_DAYS * MINUTES_PER_DAY; m < last; m += GROUND_STEP) settle(air(seed, m, c), GROUND_STEP / 60);
  settle(air(seed, last, c), (minutes - last) / 60);
  return { ...air(seed, minutes, c), cover: Math.min(1, cover), wet };
}

// ---- reading the sky ----

export type Sky = 'clear' | 'cloudy' | 'overcast' | 'fog' | 'drizzle' | 'rain' | 'downpour' | 'storm' | 'sleet' | 'flurries' | 'snow' | 'heavy_snow' | 'blizzard';

export const SKY_NAMES: Record<Sky, string> = {
  clear: 'Clear', cloudy: 'Cloudy', overcast: 'Overcast', fog: 'Fog', drizzle: 'Drizzle', rain: 'Rain', downpour: 'Downpour',
  storm: 'Thunderstorm', sleet: 'Sleet', flurries: 'Flurries', snow: 'Snow', heavy_snow: 'Heavy snow', blizzard: 'Blizzard',
};

/** What the sky is doing, and how hard it falls (0 dry, 1 light, 2 steady, 3 heavy). */
export interface SkyState { sky: Sky; band: number; }

/**
 * Precipitation bands: each is entered above its first threshold and left below its second, so a
 * shower hovering on a boundary does not flicker in and out of the log.
 */
const BANDS: readonly [number, number][] = [[0.08, 0.05], [0.3, 0.25], [0.65, 0.58]];

/** Name the weather. `prev` is the last reading, for the bands' hysteresis. */
export function classify(w: Weather, prev?: SkyState | null): SkyState {
  const was = prev?.band ?? 0;
  let band = 0;
  BANDS.forEach(([up, down], i) => { if (w.precip >= (i < was ? down : up)) band = i + 1; });
  const foggy = w.fog >= (prev?.sky === 'fog' ? 0.35 : 0.45);
  // Thick fog hides a drizzle: the fog is what the party notices.
  if (band > 1 || (band === 1 && !foggy)) {
    if (w.snow >= 0.7) return { band, sky: band === 1 ? 'flurries' : band === 2 ? 'snow' : w.wind >= 0.5 ? 'blizzard' : 'heavy_snow' };
    if (w.snow > 0.3) return { band, sky: 'sleet' };
    if (w.storm >= 0.2 && band >= 2) return { band, sky: 'storm' };
    return { band, sky: band === 1 ? 'drizzle' : band === 2 ? 'rain' : 'downpour' };
  }
  if (foggy) return { band, sky: 'fog' };
  return { band, sky: w.cloud >= 0.75 ? 'overcast' : w.cloud >= 0.35 ? 'cloudy' : 'clear' };
}

const RAINY: readonly Sky[] = ['drizzle', 'rain', 'downpour', 'storm'];
const SNOWY: readonly Sky[] = ['flurries', 'snow', 'heavy_snow', 'blizzard'];
export const isRainy = (s: Sky): boolean => RAINY.includes(s);
export const isSnowy = (s: Sky): boolean => SNOWY.includes(s);
const falling = (s: Sky): boolean => isRainy(s) || isSnowy(s) || s === 'sleet';
/** How hard: 1 light, 2 steady, 3 heavy (a storm counts as heavy). */
const rank = (s: Sky): number => s === 'drizzle' || s === 'flurries' ? 1 : s === 'downpour' || s === 'storm' || s === 'heavy_snow' || s === 'blizzard' ? 3 : 2;

/** What the party sees on stepping out under a sky they have not been watching. */
const STANDING: Partial<Record<Sky, string>> = {
  fog: 'Fog lies thick on the ground.', drizzle: 'A fine drizzle is falling.', rain: 'It is raining.', downpour: 'Rain is pouring down.',
  storm: 'A thunderstorm rages overhead.', sleet: 'Sleet is falling.', flurries: 'A few flakes of snow are falling.', snow: 'It is snowing.',
  heavy_snow: 'Snow is falling thick and fast.', blizzard: 'A blizzard howls across the land.',
};

/**
 * A line for the log when the sky changes, or, with no `prev`, when the party first sees it (on a
 * new game, a load, or out of a dungeon). Null when there is nothing worth saying: cloud coming and
 * going is left to the eye.
 */
export function skyNews(prev: Sky | null, next: Sky, c: Climate): string | null {
  if (prev === next) return null;
  if (!prev) return STANDING[next] ?? null;
  if (next === 'fog') return falling(prev) ? `The ${isSnowy(prev) ? 'snow' : prev === 'sleet' ? 'sleet' : 'rain'} stops, and ${c.fogText[0].toLowerCase()}${c.fogText.slice(1)}` : c.fogText;
  if (!falling(next)) {
    if (prev === 'fog') return 'The fog lifts.';
    if (isSnowy(prev)) return 'The snow stops.';
    if (prev === 'sleet') return 'The sleet stops.';
    if (isRainy(prev)) return 'The rain stops.';
    return null;
  }
  if (next === 'storm') return c.thunderText;
  if (next === 'blizzard') return 'The wind rises, and the snow with it. A blizzard.';
  if (next === 'sleet') return isSnowy(prev) ? 'The snow turns to sleet.' : isRainy(prev) ? 'The rain turns to sleet.' : 'Sleet begins to fall.';
  if (isSnowy(next) && isRainy(prev)) return 'The rain turns to snow.';
  if (isRainy(next) && isSnowy(prev)) return 'The snow turns to rain.';
  const kind = isSnowy(next) ? 'snow' : 'rain';
  if (!falling(prev) || prev === 'sleet') {
    if (next === 'drizzle') return 'A fine drizzle begins.';
    if (next === 'flurries') return 'A few flakes of snow drift down.';
    if (rank(next) === 3) return kind === 'snow' ? 'Snow begins to fall, thick and fast.' : 'The heavens open.';
    return kind === 'snow' ? 'Snow begins to fall.' : 'Rain begins to fall.';
  }
  if (prev === 'storm' && next === 'downpour') return 'The thunder moves off. The rain does not.';
  if (rank(next) > rank(prev)) return rank(next) === 3 ? (kind === 'snow' ? 'The snow falls thick and fast.' : 'The rain comes down in sheets.') : `The ${kind} comes on harder.`;
  if (rank(next) < rank(prev)) return next === 'drizzle' ? 'The rain eases to a drizzle.' : `The ${kind} eases.`;
  return null;
}

/** 'bitter' .. 'hot', for the almanac. */
export function tempWord(t: number): string {
  return t < -8 ? 'bitter' : t < -2 ? 'freezing' : t < 4 ? 'cold' : t < 10 ? 'cool' : t < 17 ? 'mild' : t < 24 ? 'warm' : 'hot';
}

// ---- what the weather does ----

/** How far anyone sees under this sky before night and lamps are counted: 4 is the full view. */
export function weatherSight(w: Weather): number {
  if (w.fog >= 0.6 || (w.precip >= 0.65 && w.snow >= 0.7 && w.wind >= 0.5)) return 2;
  if (w.fog >= 0.35 || w.precip >= 0.65) return 3;
  return 4;
}

/** To-hit a bow, sling or crossbow loses in a downpour, heavy snow or thick fog: on both sides of a fight. */
export const RANGED_PENALTY = 2;
export function rangedPenalty(w: Weather): number { return w.precip >= 0.65 || w.fog >= 0.6 ? RANGED_PENALTY : 0; }
/** The combat log's word on it, when it applies. */
export function rangedNote(w: Weather): string | undefined {
  if (!rangedPenalty(w)) return undefined;
  return w.fog >= 0.6 ? 'In the fog, bowmen shoot at shadows.' : w.snow >= 0.7 ? 'The driving snow spoils every archer\'s aim.' : 'The downpour spoils every archer\'s aim.';
}

/** Minutes an outdoor step costs over its usual six when snow lies deep. */
export const SNOW_DRAG = 2;
export function snowDrag(w: Weather): number { return w.cover >= 0.5 ? SNOW_DRAG : 0; }

/** Whether a new game may open under this seed: a dry first morning with no fog, so the start is seen clearly. */
export function fairStart(seed: number, start: number, c: Climate): boolean {
  for (let m = start; m <= start + 180; m += 30) { const w = weatherAt(seed, m, c); if (w.precip >= 0.05 || w.fog >= 0.3) return false; }
  return true;
}

/** The first whole hour from `from`, within `hours`, whose weather satisfies `want`; -1 if none. For tests and tools. */
export function findWeather(seed: number, from: number, c: Climate, want: (w: Weather, minutes: number) => boolean, hours = DAYS_PER_YEAR * 24): number {
  const start = Math.ceil(from / 60) * 60;
  for (let m = start; m < start + hours * 60; m += 60) if (want(weatherAt(seed, m, c), m)) return m;
  return -1;
}
