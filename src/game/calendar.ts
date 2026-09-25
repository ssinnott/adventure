// The calendar: Caldera's year as the Lanterns count it, eight months of fifteen days, two to a
// season, and the length of the day through it. Game day 1 is the first of Mistfall, late in the
// autumn, so the first winter comes on while the party is still finding its feet. Pure: nothing
// here reads the world, it maps a minute on the world clock to a date and a light level.

export const MINUTES_PER_DAY = 1440;
export const DAYS_PER_MONTH = 15;
export const MONTHS = ['Thaw', 'Sowing', 'Longlight', 'Harvest', 'Leafturn', 'Mistfall', 'Frost', 'Longnight'] as const;
export const DAYS_PER_YEAR = DAYS_PER_MONTH * MONTHS.length;

export type Season = 'spring' | 'summer' | 'autumn' | 'winter';
export const SEASONS: readonly Season[] = ['spring', 'summer', 'autumn', 'winter'];

/** Game day 1 is the 1st of Mistfall (day 75 of the year, counting from 0) in the year 1016. */
export const EPOCH_DAY = 5 * DAYS_PER_MONTH, EPOCH_YEAR = 1016;
/** Day of the year of the longest day; the shortest falls half a year on, in Frost. */
export const MIDSUMMER = 45;

export interface CalendarDate {
  year: number;
  /** 0-based index into MONTHS. */
  month: number;
  /** Day of the month, from 1. */
  day: number;
  /** Day of the year, from 0. */
  dayOfYear: number;
  season: Season;
  /** Days since the game began, from 1: the old DAY counter. */
  gameDay: number;
}

const mod = (a: number, n: number): number => ((a % n) + n) % n;

/** The date at a minute on the world clock (minute 0 is the midnight that begins game day 1). */
export function dateAt(minutes: number): CalendarDate {
  const gameDay = Math.floor(minutes / MINUTES_PER_DAY);
  const n = gameDay + EPOCH_DAY;
  const dayOfYear = mod(n, DAYS_PER_YEAR), month = Math.floor(dayOfYear / DAYS_PER_MONTH);
  return { year: EPOCH_YEAR + Math.floor(n / DAYS_PER_YEAR), month, day: dayOfYear % DAYS_PER_MONTH + 1, dayOfYear, season: SEASONS[month >> 1], gameDay: gameDay + 1 };
}

/** The day of the year with the time of day as a fraction, for curves that should not step at midnight. */
export function yearPhase(minutes: number): number {
  return mod(minutes / MINUTES_PER_DAY + EPOCH_DAY, DAYS_PER_YEAR);
}

/** '1 MISTFALL 1016', for the status strip. */
export function shortDate(d: CalendarDate): string { return `${d.day} ${MONTHS[d.month]} ${d.year}`; }

/** 'the 1st of Mistfall, 1016'. */
export function longDate(d: CalendarDate): string {
  const th = d.day % 10 === 1 && d.day !== 11 ? 'st' : d.day % 10 === 2 && d.day !== 12 ? 'nd' : d.day % 10 === 3 && d.day !== 13 ? 'rd' : 'th';
  return `the ${d.day}${th} of ${MONTHS[d.month]}, ${d.year}`;
}

/** 'late autumn': each season's first month is early, its second late. */
export function seasonName(d: CalendarDate): string { return `${d.month % 2 ? 'late' : 'early'} ${d.season}`; }

/**
 * Dawn and dusk on a day of the year, as the hours in the middle of each twilight: twelve hours
 * apart at the equinoxes (6:30 and 18:30, the old fixed clock), fifteen and a half at midsummer
 * and eight and a half at midwinter.
 */
export function sunTimes(dayOfYear: number): { dawn: number; dusk: number } {
  const len = 12 + 3.5 * Math.cos(2 * Math.PI * (dayOfYear - MIDSUMMER) / DAYS_PER_YEAR);
  return { dawn: 12.5 - len / 2, dusk: 12.5 + len / 2 };
}

/** 0 at night, 1 in full day, ramping through a three-hour twilight centred on dawn and on dusk. */
export function daylightAt(minutes: number): number {
  const h = mod(minutes, MINUTES_PER_DAY) / 60;
  const { dawn, dusk } = sunTimes(yearPhase(minutes));
  if (h < dawn - 1.5 || h >= dusk + 1.5) return 0;
  if (h < dawn + 1.5) return (h - dawn + 1.5) / 3;
  if (h < dusk - 1.5) return 1;
  return 1 - (h - dusk + 1.5) / 3;
}

/** 'HH:MM' for an hour of the day given as a fraction. */
export function clock(hour: number): string {
  const m = Math.round(hour * 60);
  return `${String(Math.floor(m / 60) % 24).padStart(2, '0')}:${String(m % 60).padStart(2, '0')}`;
}
