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
await page.keyboard.press('Space'); await page.waitForTimeout(100);
if (map) await page.evaluate(([m, xx, yy, ff]: string[]) => { const g = (window as any).__game.game; g.world.travel(m, Number(xx), Number(yy), Number(ff)); g.enterCell(); }, [map, x, y, f]);
for (const k of keys) { await page.keyboard.press(k); await page.waitForTimeout(60); }
await page.waitForTimeout(150);
const el = await page.$('#stage');
await el.screenshot({ path: out });
await browser.close(); server.close();
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log('wrote ' + out + ' (' + fs.statSync(out).size + ' bytes)');
