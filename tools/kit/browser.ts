// The one place a tool starts Chromium (#986): Playwright imported by name, the pinned dependency it is
// (package.json), launched headless, and the game opened on a page as every tool wants it: 1,280 by 720
// at a device scale of 1, its errors gathered, loaded and ready. The tool serves the tree itself
// (tools/server.ts) and hands the port in, as the kit takes src only (tools/tests/layers.ts).
import fs from 'node:fs';
import { chromium, type Browser, type Page } from 'playwright';

export type { Browser, Page };

/**
 * A module imported in the page, its type the module's own: `load<typeof import('../src/ui/viewport.ts')>(
 * '/src/ui/viewport.ts')`, the path as the dev server serves it and still a literal at the call. A page
 * function cannot close over the tool's, so each binds it there: `const load: Load = (p) => import(p);`.
 */
export type Load = <M>(path: string) => Promise<M>;

/**
 * Chromium, headless: Playwright's own, or where that will not start, the one PLAYWRIGHT_CHROMIUM names
 * or /opt/pw-browsers/chromium, if it is there.
 */
export async function launch(): Promise<Browser> {
  const start = (executablePath?: string): Promise<Browser> => chromium.launch(executablePath ? { executablePath } : {});
  try { return await start(); }
  catch (e) {
    const exe = process.env.PLAYWRIGHT_CHROMIUM || '/opt/pw-browsers/chromium';
    if (fs.existsSync(exe)) return start(exe);
    throw e;
  }
}

/** The game on a page: the browser, the page and its errors, each `pageerror: ` or `console: ` and its words. */
export interface Opened { browser: Browser; page: Page; errors: string[] }

/**
 * Chromium launched and the game served at `port` opened on a page `viewport` big (1,280 by 720 unless
 * said), loaded and ready (window.__game.ready). With `seed` the page's Math.random is pinned before the
 * game loads, so a new game's seed is `seed` (the first draw floors to it in freshSeed) and every draw
 * after it follows from it.
 */
export async function open(port: number, o: { viewport?: { width: number; height: number }; seed?: number } = {}): Promise<Opened> {
  const browser = await launch();
  const page = await browser.newPage({ viewport: o.viewport ?? { width: 1280, height: 720 }, deviceScaleFactor: 1 });
  if (o.seed !== undefined) {
    await page.addInitScript((seed: number) => {
      let s = seed >>> 0, first = true;
      Math.random = () => {
        if (first) { first = false; return (seed + 0.5) / 0x7fffffff; }
        s = (s + 0x6d2b79f5) >>> 0;
        let t = s;
        t = Math.imul(t ^ (t >>> 15), t | 1);
        t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
        return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
      };
    }, o.seed);
  }
  // The fallback's full Chromium asks for /favicon.ico, which the tree lacks, and its 404 is a console
  // error: it is answered here with nothing, so a tool fails on the game's own errors alone.
  await page.route('**/favicon.ico', (r) => r.fulfill({ status: 204 }));
  const errors: string[] = [];
  page.on('pageerror', (e) => errors.push('pageerror: ' + e.message));
  page.on('console', (m) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });
  // A page that never loads or never gets ready closes its browser before the error goes on, so a
  // caller that catches it leaves no Chromium behind.
  try {
    await page.goto(`http://localhost:${port}/`, { waitUntil: 'load' });
    await page.waitForFunction(() => window.__game?.ready === true, null, { timeout: 15000 });
  } catch (e) { await browser.close(); throw e; }
  return { browser, page, errors };
}
