// Screenshot helper for eyeballing screens during development:
//   node tools/shot.ts out.png [map x y facing] [keys...]
// Starts a new game, optionally teleports, presses the keys given, and saves a PNG.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { createServer } from './server.ts';
const require = createRequire(import.meta.url);
const [out, map, x, y, f, ...keys] = process.argv.slice(2);
function loadPlaywright(): any { for (const c of ['/opt/node22/lib/node_modules/playwright', 'playwright', 'playwright-core']) { try { return require(c); } catch { /* next */ } } throw new Error('no playwright'); }
const server = createServer();
await new Promise<void>((r) => server.listen(0, () => r()));
const port = (server.address() as { port: number }).port;
const { chromium } = loadPlaywright();
const browser = await (async () => { try { return await chromium.launch(); } catch { return chromium.launch({ executablePath: '/opt/pw-browsers/chromium' }); } })();
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
const errors: string[] = [];
page.on('pageerror', (e: Error) => errors.push(e.message));
await page.goto(`http://localhost:${port}/`, { waitUntil: 'load' });
await page.waitForFunction(() => (window as any).__game?.ready === true, null, { timeout: 15000 });
await page.keyboard.press('Space'); await page.waitForTimeout(80);
if (process.env.STAY_ON_CREATE !== '1') { await page.keyboard.press('Space'); await page.waitForTimeout(100); }
if (map) await page.evaluate(([m, xx, yy, ff]: string[]) => { const g = (window as any).__game.game; g.world.travel(m, Number(xx), Number(yy), Number(ff)); g.enterCell(); }, [map, x, y, f]);
// Pseudo-keys: fight:<groupId> starts a fight, time:<hour> sets the clock, walk:<n> steps forward n times,
// day:<n> moves to game day n at the same hour, seed:<n> sets the weather seed, and sky:<kind>[:night]
// moves the clock on to the first hour of daylight (or of night) with that sky here: sky:rain, sky:fog,
// sky:blizzard (the names are game/weather.ts's Sky).
for (const k of keys) {
  if (k.startsWith('fight:')) await page.evaluate((id: string) => { (window as any).__game.game.fight([id]); }, k.slice(6));
  else if (k.startsWith('time:')) await page.evaluate((hr: number) => { const g = (window as any).__game.game; g.world.state.minutes = Math.floor(g.world.state.minutes / 1440) * 1440 + hr * 60; }, Number(k.slice(5)));
  else if (k.startsWith('day:')) await page.evaluate((d: number) => { const g = (window as any).__game.game; g.world.state.minutes = (d - 1) * 1440 + g.world.state.minutes % 1440; }, Number(k.slice(4)));
  else if (k.startsWith('seed:')) await page.evaluate((s: number) => { (window as any).__game.game.world.state.weatherSeed = s; }, Number(k.slice(5)));
  else if (k.startsWith('sky:')) {
    const err = await page.evaluate(async (spec: string) => {
      const [kind, when] = spec.split(':');
      const load = (p: string): Promise<any> => import(p);
      const W = await load('/src/game/weather.ts'), C = await load('/src/game/calendar.ts');
      const w = (window as any).__game.game.world;
      const m = W.findWeather(w.state.weatherSeed, w.state.minutes, w.climate, (wx: any, min: number) => W.classify(wx).sky === kind && (when === 'night' ? C.daylightAt(min) === 0 : C.daylightAt(min) >= 0.8), 24 * 480);
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
await el.screenshot({ path: out });
await browser.close(); server.close();
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('wrote ' + out + ' (' + fs.statSync(out).size + ' bytes)');
