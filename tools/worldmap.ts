// The whole world map in one PNG, for judging the art and the zone layout without scrolling it:
// node tools/worldmap.ts out.png [--zones] [--scale 1] [--at map,x,y,facing] Paints the cloth
// exactly as the M screen does, then the zone overlay over it with --zones. A new game is started
// so the overlay has a party to mark; --at moves it first (default: the Foreland road south of
// Helmstow).
import { createServer } from './server.ts';
import { open, type Load } from './kit/browser.ts';
import { read, WORLDMAP } from './kit/args.ts';
import type { Facing } from '../src/game/types.ts';

const { out = 'worldmap.png', opts, switches } = read(WORLDMAP);
const zones = switches.has('zones');
const scale = Number(opts.scale ?? 1);
const at = (opts.at ?? 'shelf,16,9,2').split(',');

const server = createServer();
await new Promise<void>((r) => server.listen(0, () => r()));
const port = (server.address() as { port: number }).port;
const { browser, page, errors } = await open(port);
await page.keyboard.press('Space'); await page.waitForTimeout(80);
await page.keyboard.press('Space'); await page.waitForTimeout(120);

const size = await page.evaluate(async (o: { zones: boolean; scale: number; at: string[] }) => {
  // Served by the dev server, resolved by the browser: opaque to the typechecker on purpose.
  const load: Load = (p) => import(p);
  const WM = await load<typeof import('../src/ui/worldmap.ts')>('/src/ui/worldmap.ts');
  const g = window.__game!.game!;
  g.world.travel(o.at[0], Number(o.at[1]), Number(o.at[2]), Number(o.at[3] ?? 0) as Facing);
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
await el!.screenshot({ path: out });
await browser.close(); server.close();
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`wrote ${out} (${zones ? 'zones' : 'art'}, ${size.w}x${size.h})`);
