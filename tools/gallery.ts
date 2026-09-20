// Monster gallery for art passes: renders every monster (or a chosen few) as it looks in the game,
// with no frame or scene around it, and saves a PNG to eyeball.
//   node tools/gallery.ts out.png [--only kind,kind,...] [--family wolf] [--scale 2] [--frames 6] [--flash] [--tone 0.6]
// Each cell shows the name, the combat-screen size scaled by --scale, and at the bottom-left the
// viewport sizes at four, three and two cells away, which is how small the drawing has to read.
// --frames n lays each monster out as a strip of n idle frames instead (the last one the hit flash
// when --flash is given). --family imports only that module in src/ui/monsters/, so one family can
// be checked while another is mid-edit and does not parse; it draws that module's KINDS.
import fs from 'node:fs';
import { createRequire } from 'node:module';
import { createServer } from './server.ts';

const require = createRequire(import.meta.url);
const args = process.argv.slice(2);
const out = args.find((a) => !a.startsWith('--')) ?? 'gallery.png';
const opt = (name: string): string | undefined => { const i = args.indexOf('--' + name); return i >= 0 ? args[i + 1] : undefined; };
const only = opt('only')?.split(',').filter(Boolean) ?? [];
const family = opt('family');
const scale = Number(opt('scale') ?? 2);
const frames = Number(opt('frames') ?? 0);
const flash = args.includes('--flash');
const tone = Number(opt('tone') ?? 1);

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

const size = await page.evaluate(async (o: { only: string[]; family?: string; scale: number; frames: number; flash: boolean; tone: number }) => {
  // Served by the dev server, resolved by the browser: opaque to the typechecker on purpose.
  const load = (p: string): Promise<any> => import(p);
  const M = await load('/src/game/monsters.ts');
  const T = await load('/src/lib/engine/text.ts');
  // Through the dispatcher normally; straight into one family module when asked.
  let draw: (ctx: CanvasRenderingContext2D, kind: string, x: number, y: number, h: number, tint: string, tone: number, frame: number, flash: boolean) => void;
  let kinds: string[] | null = null;
  if (o.family) {
    const F = await load(`/src/ui/monsters/${o.family}.ts`);
    const C = await load('/src/ui/monsters/common.ts');
    kinds = F.KINDS;
    draw = (ctx, kind, x, y, h, tint, tone, frame, flash) => { C.B.flash(flash); F.draw(ctx, kind, x, y, h, C.paintFor(tint, tone, frame)); C.B.flash(false); };
  } else {
    const S = await load('/src/ui/sprites.ts');
    draw = S.drawMonsterSprite;
  }
  const defs = (Object.values(M.MONSTERS) as any[]).filter((d) => (o.only.length ? o.only.includes(d.sprite) : true) && (kinds ? kinds.includes(d.sprite) : true));
  const s = o.scale;
  // Combat size is 30 + size * 70; the viewport draws u * 2 * size with u = 134 * 0.9 / (d + 0.5).
  const combat = (d: any) => 30 + d.size * 70;
  const view = (d: any, depth: number) => (134 * 0.9 / (depth + 0.5)) * 2 * d.size;
  const strip = o.frames > 0;
  const cols = strip ? 1 : Math.min(7, Math.max(1, defs.length));
  // A cell: caption, the combat-size drawing scaled, then an unscaled strip of the viewport sizes.
  const mainH = Math.round(150 * s), stripH = strip ? 0 : 104;
  const cellW = strip ? Math.round(160 * s) * o.frames + 20 : Math.round(170 * s), cellH = 24 + mainH + stripH + 16;
  const rows = Math.ceil(defs.length / cols);
  const c = document.createElement('canvas'); c.id = 'gallery';
  c.width = cols * cellW; c.height = rows * cellH;
  document.body.innerHTML = ''; document.body.appendChild(c);
  const ctx = c.getContext('2d')!;
  ctx.imageSmoothingEnabled = false;
  defs.forEach((d, i) => {
    const col = i % cols, row = Math.floor(i / cols);
    const x0 = col * cellW, y0 = row * cellH;
    // Alternate a lit outdoor ground and a dim dungeon floor, so silhouettes are judged on both.
    const lit = i % 2 === 0;
    const sky = lit ? '#7a8a5a' : '#3a3640', floor = lit ? '#5a6a3a' : '#2a2630';
    const ground = y0 + 20 + mainH * 0.88;
    ctx.fillStyle = sky; ctx.fillRect(x0, y0, cellW, cellH);
    ctx.fillStyle = floor; ctx.fillRect(x0, ground, cellW, y0 + 20 + mainH - ground);
    ctx.save(); ctx.beginPath(); ctx.rect(x0, y0, cellW, cellH); ctx.clip();
    if (strip) {
      for (let f = 0; f < o.frames; f++) {
        const fx = x0 + 10 + Math.round(160 * s) * (f + 0.5);
        ctx.save(); ctx.translate(fx, ground); ctx.scale(s, s);
        draw(ctx, d.sprite, 0, 0, combat(d), d.tint, o.tone, f * 6, o.flash && f === o.frames - 1);
        ctx.restore();
      }
    } else {
      ctx.save(); ctx.translate(x0 + cellW / 2, ground); ctx.scale(s, s);
      draw(ctx, d.sprite, 0, 0, combat(d), d.tint, o.tone, i * 11, o.flash);
      ctx.restore();
      // The viewport sizes, unscaled, on their own ground: how few pixels the drawing gets far away.
      const g2 = y0 + 24 + mainH + stripH - 8;
      ctx.fillStyle = sky; ctx.fillRect(x0, y0 + 20 + mainH, cellW, stripH + 4);
      ctx.fillStyle = floor; ctx.fillRect(x0, g2, cellW, y0 + cellH - g2);
      let sx = x0 + 8;
      for (const depth of [4, 3, 2]) {
        const hh = view(d, depth), ww = hh * (d.sprite.includes('spider') ? 2 : 1.9);
        if (sx + ww > x0 + cellW - 4) break;
        draw(ctx, d.sprite, sx + ww / 2, g2, hh, d.tint, Math.max(0.55, 1 - depth * 0.12) * o.tone, i * 11, false);
        sx += ww + 6;
      }
    }
    ctx.restore();
    ctx.strokeStyle = '#120c14'; ctx.strokeRect(x0 + 0.5, y0 + 0.5, cellW - 1, cellH - 1);
    T.drawText(ctx, d.name.toUpperCase(), x0 + cellW / 2, y0 + 6, { size: 1, color: '#e8dcc0', align: 'center' });
    T.drawText(ctx, `${d.sprite}  size ${d.size}  ${d.tint}`, x0 + cellW / 2, y0 + cellH - 12, { size: 1, color: '#e8dcc0', align: 'center' });
  });
  return { w: c.width, h: c.height, n: defs.length };
}, { only, family, scale, frames, flash, tone });

await page.setViewportSize({ width: Math.max(100, size.w), height: Math.max(100, size.h) });
await page.waitForTimeout(80);
const el = await page.$('#gallery');
await el.screenshot({ path: out });
await browser.close(); server.close();
if (errors.length) { console.error(errors.join('\n')); process.exit(1); }
console.log(`wrote ${out} (${size.n} monsters, ${size.w}x${size.h})`);
