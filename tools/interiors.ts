// Interior gallery for art passes: renders every business's interior (or a chosen few) exactly as
// the viewport shows it while the party is inside, and saves a PNG to eyeball.
//   node tools/interiors.ts out.png [--only hearthlight_inn,gilded_eel] [--scale 2] [--hour 21] [--frame 40]
// Each cell is one interior at the viewport's size times --scale, captioned with its id, at the
// given hour (the windows and the yards follow the clock; the room's light follows the hour).
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { createServer } from './server.ts';

const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const out = args.find((a) => !a.startsWith('--') && !/^\d/.test(a)) ?? 'interiors.png';
const opt = (name: string): string | undefined => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : undefined; };
const only = opt('only')?.split(',').filter(Boolean) ?? [];
const scale = Number(opt('scale') ?? 1);
const hour = Number(opt('hour') ?? 12);
const frame = Number(opt('frame') ?? 40);

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

const size = await page.evaluate(async (o: { only: string[]; scale: number; hour: number; frame: number }) => {
  // Served by the dev server, resolved by the browser: opaque to the typechecker on purpose.
  const load = (p: string): Promise<any> => import(p);
  const I = await load('/src/ui/interior.ts');
  const T = await load('/src/lib/engine/text.ts');
  // The daylight curve the world uses: dark 20-05, full 08-17, dawn and dusk between.
  const h = o.hour, daylight = h < 5 || h >= 20 ? 0 : h < 8 ? (h - 5) / 3 : h < 17 ? 1 : 1 - (h - 17) / 3;
  const kinds = Object.keys(I.SCENES).filter((k) => !o.only.length || o.only.includes(k));
  const w = 400 * o.scale, hh = 268 * o.scale, cap = 16, cols = Math.min(kinds.length, o.scale > 1 ? 2 : 3);
  const c = document.createElement('canvas'); c.id = 'gallery';
  c.width = cols * (w + 8) + 8; c.height = Math.ceil(kinds.length / cols) * (hh + cap + 8) + 8;
  document.body.innerHTML = ''; document.body.appendChild(c);
  const ctx = c.getContext('2d')!;
  ctx.fillStyle = '#1c1720'; ctx.fillRect(0, 0, c.width, c.height);
  kinds.forEach((k, i) => {
    const x = 8 + (i % cols) * (w + 8), y = 8 + Math.floor(i / cols) * (hh + cap + 8);
    T.drawText(ctx, `${k}  ${String(o.hour).padStart(2, '0')}:00`, x, y + 2, { size: 1, color: '#e8dcc0' });
    I.drawInterior(ctx, k, { x, y: y + cap, w, h: hh }, daylight, o.frame);
  });
  return { w: c.width, h: c.height, n: kinds.length };
}, { only, scale, hour, frame });

await page.setViewportSize({ width: Math.max(100, size.w), height: Math.max(100, size.h) });
await page.waitForTimeout(80);
const el = await page.$('#gallery');
await el.screenshot({ path: out });
await browser.close(); server.close();
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`wrote ${out} (${size.n} interiors, ${size.w}x${size.h})`);
