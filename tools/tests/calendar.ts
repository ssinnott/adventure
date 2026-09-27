// The calendar: months, seasons, the new year, ordinals, and days that lengthen and shorten.
import { dateAt, shortDate, longDate, daylightAt, sunTimes, MONTHS, DAYS_PER_YEAR, EPOCH_DAY, MIDSUMMER } from '../../src/game/calendar.ts';
import { START_MINUTES } from '../../src/game/world.ts';
import { ok } from './lib.ts';

export function calendar(): void {
  const d1 = dateAt(START_MINUTES);
  ok(shortDate(d1) === '1 Mistfall 1016' && d1.season === 'autumn' && d1.gameDay === 1, `game day 1 is the 1st of Mistfall, 1016, in the autumn (${shortDate(d1)}, ${d1.season})`);
  ok(MONTHS.length === 8 && DAYS_PER_YEAR === 120, 'the year is eight months of fifteen days');
  ok(shortDate(dateAt(14 * 1440)) === '15 Mistfall 1016' && shortDate(dateAt(15 * 1440)) === '1 Frost 1016' && dateAt(15 * 1440).season === 'winter', 'Mistfall has fifteen days, then Frost begins the winter');
  const newYear = (DAYS_PER_YEAR - EPOCH_DAY) * 1440;
  ok(shortDate(dateAt(newYear - 1)) === '15 Longnight 1016' && shortDate(dateAt(newYear)) === '1 Thaw 1017' && dateAt(newYear).season === 'spring', `the year turns after Longnight (${shortDate(dateAt(newYear))})`);
  ok(dateAt(newYear).gameDay === DAYS_PER_YEAR - EPOCH_DAY + 1, 'and the game-day count carries on through it');
  ok(longDate(dateAt(0)) === 'the 1st of Mistfall, 1016' && longDate(dateAt(1440)) === 'the 2nd of Mistfall, 1016' && longDate(dateAt(10 * 1440)) === 'the 11th of Mistfall, 1016', 'long dates take their ordinals (1st, 2nd, 11th)');
  // The days lengthen and shorten. `at` is the minute of a day of the year and an hour.
  const at = (doy: number, hour: number): number => ((doy - EPOCH_DAY + DAYS_PER_YEAR) % DAYS_PER_YEAR) * 1440 + hour * 60;
  const winter = MIDSUMMER + DAYS_PER_YEAR / 2;
  ok([0, 30, 60, 90].every((doy) => daylightAt(at(doy, 12)) === 1), 'noon is full daylight in every season');
  ok(daylightAt(at(MIDSUMMER, 18.5)) === 1 && daylightAt(at(winter, 18.5)) === 0, 'at half past six in the evening it is day at midsummer and night at midwinter');
  ok(daylightAt(at(winter, 7)) < 0.25 && daylightAt(at(MIDSUMMER, 5)) >= 0.5, 'a midwinter morning is still dark at seven; a midsummer one light at five');
  const { dawn, dusk } = sunTimes(EPOCH_DAY);
  const near = (a: number, b: number): boolean => Math.abs(a - b) < 1e-9;
  // The day length moves through the day, not in a step at midnight, so the old clock holds to within minutes.
  ok(near(dawn, 6.5) && near(dusk, 18.5) && daylightAt(at(EPOCH_DAY, 4.9)) === 0 && daylightAt(at(EPOCH_DAY, 8)) > 0.97 && daylightAt(at(EPOCH_DAY, 20)) < 0.03, '1 Mistfall is an equinox, with the old fixed clock: dark before 05:00, full light by 08:00, dark again by 20:00');
}
