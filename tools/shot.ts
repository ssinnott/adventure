// Screenshot helper for eyeballing screens during development:
//   node tools/shot.ts out.png [map x y facing] [keys...]
// Starts a new game, optionally teleports, presses the keys given, and saves a PNG.
//
// The game draws every screen at its frame (`Game.frame`), which the loop counts on at each step, and
// what moves over the view (the weather, the flames, life.ts) moves with it, so a shot taken at whatever
// frame the loop has reached differs from run to run. frame:<n> holds the frame at n from that key on:
// the same shot is then the same bytes every run (#1094's twelve views take frame:0).
import fs from 'node:fs';
import { createServer } from './server.ts';
import { open, type Load } from './kit/browser.ts';
import type { Facing } from '../src/game/types.ts';
const [out, map, x, y, f, ...keys] = process.argv.slice(2);
const server = createServer();
await new Promise<void>((r) => server.listen(0, () => r()));
const port = (server.address() as { port: number }).port;
const { browser, page, errors } = await open(port);
await page.keyboard.press('Space'); await page.waitForTimeout(80);
if (process.env.STAY_ON_CREATE !== '1') { await page.keyboard.press('Space'); await page.waitForTimeout(100); }
if (map) await page.evaluate(([m, xx, yy, ff]: string[]) => { const g = window.__game!.game!; g.world.travel(m, Number(xx), Number(yy), Number(ff) as Facing); g.enterCell(); }, [map, x, y, f]);
// Pseudo-keys: fight:<groupId> starts a fight, time:<hour> sets the clock, walk:<n> steps forward n times,
// day:<n> moves to game day n at the same hour, seed:<n> sets the weather seed, frame:<n> holds the frame
// at n (above), and sky:<kind>[:night]
// moves the clock on to the first hour of daylight (or of night) with that sky here: sky:rain, sky:fog,
// sky:blizzard (the names are game/weather.ts's Sky).
for (const k of keys) {
  if (k.startsWith('fight:')) await page.evaluate((id: string) => { window.__game!.game!.fight([id]); }, k.slice(6));
  else if (k.startsWith('time:')) await page.evaluate((hr: number) => { const g = window.__game!.game!; g.world.state.minutes = Math.floor(g.world.state.minutes / 1440) * 1440 + hr * 60; }, Number(k.slice(5)));
  else if (k.startsWith('day:')) await page.evaluate((d: number) => { const g = window.__game!.game!; g.world.state.minutes = (d - 1) * 1440 + g.world.state.minutes % 1440; }, Number(k.slice(4)));
  else if (k.startsWith('seed:')) await page.evaluate((s: number) => { window.__game!.game!.world.state.weatherSeed = s; }, Number(k.slice(5)));
  else if (k.startsWith('frame:')) await page.evaluate((n: number) => { Object.defineProperty(window.__game!.game!, 'frame', { get: () => n, set: () => {} }); }, Number(k.slice(6)));
  else if (k.startsWith('sky:')) {
    const err = await page.evaluate(async (spec: string) => {
      const [kind, when] = spec.split(':');
      const load: Load = (p) => import(p);
      const W = await load<typeof import('../src/game/weather.ts')>('/src/game/weather.ts'), C = await load<typeof import('../src/game/calendar.ts')>('/src/game/calendar.ts');
      const w = window.__game!.game!.world;
      const m = W.findWeather(w.state.weatherSeed!, w.state.minutes, w.climate, (wx, min) => W.classify(wx).sky === kind && (when === 'night' ? C.daylightAt(min) === 0 : C.daylightAt(min) >= 0.8), 24 * 480);
      if (m < 0) return `no ${spec} within 480 days`;
      w.state.minutes = m; w.sky = null;
      return '';
    }, k.slice(4));
    if (err) throw new Error(err);
  }
  else if (k.startsWith('walk:')) { for (let i = 0; i < Number(k.slice(5)); i++) { await page.keyboard.press('ArrowUp'); await page.waitForTimeout(40); } }
  else await page.keyboard.press(k);
  await page.waitForTimeout(60);
}
await page.waitForTimeout(150);
const el = await page.$('#stage');
await el!.screenshot({ path: out });
await browser.close(); server.close();
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('wrote ' + out + ' (' + fs.statSync(out).size + ' bytes)');
