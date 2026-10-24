// Interior gallery for art passes: renders every business's interior (or a chosen few) exactly as
// the viewport shows it while the party is inside, and saves a PNG to eyeball.
//   node tools/interiors.ts out.png [--only hearthlight_inn,gilded_eel] [--scale 2] [--hour 21] [--frame 40]
// Each cell is one interior at the viewport's size times --scale, captioned with its id, at the
// given hour (the windows and the yards follow the clock; the room's light follows the hour).
import { createServer } from './server.ts';
import { open, type Load } from './kit/browser.ts';
import { read, INTERIORS } from './kit/args.ts';

const { out = 'interiors.png', opts } = read(INTERIORS);
const only = opts.only?.split(',').filter(Boolean) ?? [];
const scale = Number(opts.scale ?? 1);
const hour = Number(opts.hour ?? 12);
const frame = Number(opts.frame ?? 40);

const server = createServer();
await new Promise<void>((r) => server.listen(0, () => r()));
const port = (server.address() as { port: number }).port;
const { browser, page, errors } = await open(port);

const size = await page.evaluate(async (o: { only: string[]; scale: number; hour: number; frame: number }) => {
  // Served by the dev server, resolved by the browser: opaque to the typechecker on purpose.
  const load: Load = (p) => import(p);
  const I = await load<typeof import('../src/ui/interior.ts')>('/src/ui/interior.ts');
  const T = await load<typeof import('../src/lib/engine/text.ts')>('/src/lib/engine/text.ts');
  // The daylight curve the world uses: dark 20-05, full 08-17, dawn and dusk between.
  const h = o.hour, daylight = h < 5 || h >= 20 ? 0 : h < 8 ? (h - 5) / 3 : h < 17 ? 1 : 1 - (h - 17) / 3;
  const kinds = (Object.keys(I.SCENES) as Parameters<typeof I.drawInterior>[1][]).filter((k) => !o.only.length || o.only.includes(k));
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
await el!.screenshot({ path: out });
await browser.close(); server.close();
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`wrote ${out} (${size.n} interiors, ${size.w}x${size.h})`);
