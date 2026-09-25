// The whole world map in one PNG, for judging the art and the zone layout without scrolling it:
//   node tools/worldmap.ts out.png [--zones] [--scale 2] [--at map,x,y,facing]
// Paints the cloth exactly as the M screen does, then the zone overlay over it with --zones. A new
// game is started so the overlay has a party to mark; --at moves it first (default: the Shelf road
// south of Harrow).
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { createServer } from './server.ts';

const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const opt = (name: string): string | undefined => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : undefined; };
const out = args.find((a, i) => !a.startsWith('--') && !(i > 0 && ['--scale', '--at'].includes(args[i - 1]))) ?? 'worldmap.png';
const zones = args.includes('--zones');
const scale = Number(opt('scale') ?? 2);
const at = (opt('at') ?? 'shelf,16,9,2').split(',');

function loadPlaywright(): any {
  for (const c of ['/opt/node22/lib/node_modules/playwright', '/usr/lib/node_modules/playwright', 'playwright', 'playwright-core']) {
    try { return require(c); } catch { /* next */ }
  }
  throw new Error('Playwright not found');
}
async function launch(chromium: any): Promise<any> {
  try { return await chromium.launch(); }
  catch (e) {
    const exe = process.env.PLAYWRIGHT_CHROMIUM || '/opt/pw-browsers/chromium';
    if (fs.existsSync(exe)) return chromium.launch({ executablePath: exe });
    throw e;
  }
}

const server = createServer();
await new Promise<void>((r) => server.listen(0, () => r()));
const port = (server.address() as { port: number }).port;
const { chromium } = loadPlaywright();
const browser = await launch(chromium);
const page = await browser.newPage({ viewport: { width: 1280, height: 720 }, deviceScaleFactor: 1 });
const errors: string[] = [];
page.on('pageerror', (e: Error) => errors.push(e.message));
await page.goto(`http://localhost:${port}/`, { waitUntil: 'load' });
await page.waitForFunction(() => (window as any).__game?.ready === true, null, { timeout: 15000 });
await page.keyboard.press('Space'); await page.waitForTimeout(80);
await page.keyboard.press('Space'); await page.waitForTimeout(120);

const size = await page.evaluate(async (o: { zones: boolean; scale: number; at: string[] }) => {
  // Served by the dev server, resolved by the browser: opaque to the typechecker on purpose.
  const load = (p: string): Promise<any> => import(p);
  const WM = await load('/src/ui/worldmap.ts');
  const g = (window as any).__game.game;
  g.world.travel(o.at[0], Number(o.at[1]), Number(o.at[2]), Number(o.at[3] ?? 0));
  const cloth: HTMLCanvasElement = WM.renderCloth(o.zones ? 'zones' : 'art', g.world, 0);
  const c = document.createElement('canvas'); c.id = 'cloth';
  c.width = cloth.width * o.scale; c.height = cloth.height * o.scale;
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  ctx.drawImage(cloth, 0, 0, c.width, c.height);
  document.body.innerHTML = ''; document.body.style.display = 'block'; document.body.style.overflow = 'visible';
  document.body.appendChild(c);
  return { w: c.width, h: c.height };
}, { zones, scale, at });

await page.setViewportSize({ width: Math.max(100, size.w), height: Math.max(100, size.h) });
await page.waitForTimeout(80);
const el = await page.$('#cloth');
await el.screenshot({ path: out });
await browser.close(); server.close();
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`wrote ${out} (${zones ? 'zones' : 'art'}, ${size.w}x${size.h})`);
