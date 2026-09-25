// Headless proof that the game RENDERS IN A BROWSER through the dev server with nothing compiled to
// disk: load index.html, start a new game through the title screen, walk a few steps, open a fight,
// and assert that every frame painted and no page error fired.
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { createServer } from './server.ts';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const require = createRequire(import.meta.url);
void ROOT;

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
const page = await browser.newPage();
const errors: string[] = [];
page.on('pageerror', (e: Error) => errors.push('pageerror: ' + e.message));
page.on('console', (m: any) => { if (m.type() === 'error') errors.push('console: ' + m.text()); });

await page.goto(`http://localhost:${port}/`, { waitUntil: 'load' });
await page.waitForFunction(() => (window as any).__game?.ready === true, null, { timeout: 15000 });
await page.waitForTimeout(200);

const colours = async (): Promise<number> => page.evaluate(() => {
  const c = document.getElementById('stage') as HTMLCanvasElement;
  const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
  const seen = new Set<number>();
  for (let i = 0; i < d.length; i += 4) seen.add((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]);
  return seen.size;
});
const titleColours = await colours();

// Title -> new game -> premade company -> walk out of the gate and into the Shelf -> force a fight.
await page.keyboard.press('Space'); await page.waitForTimeout(100);
const screen0 = await page.evaluate(() => (window as any).__game.game.top.constructor.name);
await page.keyboard.press('Space'); await page.waitForTimeout(150);
const screen1 = await page.evaluate(() => (window as any).__game.game.screens.map((s: any) => s.constructor.name).join(','));
for (const k of ['ArrowDown', 'ArrowDown', 'ArrowDown']) { await page.keyboard.press(k); await page.waitForTimeout(40); }
await page.waitForTimeout(100);
const state = await page.evaluate(() => { const g = (window as any).__game.game; return { map: g.world.state.mapId, x: g.world.state.x, y: g.world.state.y, steps: g.world.state.steps }; });
const exploreColours = await colours();
await page.evaluate(() => { const g = (window as any).__game.game; g.fight(['road_rats']); });
await page.waitForTimeout(150);
const screen2 = await page.evaluate(() => (window as any).__game.game.top.constructor.name);
const combatColours = await colours();
// Thornmark: the second region's sprites (ogre, wraith, the big wolves) and a town paint too.
await page.evaluate(() => { const g = (window as any).__game.game; g.screens.pop(); g.world.travel('thornmark', 6, 8, 3); g.enterCell(); });
await page.waitForTimeout(150);
const thornColours = await colours();
await page.evaluate(() => { const g = (window as any).__game.game; g.fight(['tm_ogre', 'tm_wraiths']); });
await page.waitForTimeout(150);
const thornFight = await page.evaluate(() => { const g = (window as any).__game.game; return { screen: g.top.constructor.name, monsters: g.top.state.monsters.map((m: any) => m.def.sprite).join(',') }; });
const thornFightColours = await colours();
await page.evaluate(() => { const g = (window as any).__game.game; g.screens.pop(); g.world.travel('thornhold', 7, 14, 0); g.enterCell(); });
await page.waitForTimeout(150);
const townColours = await colours();
// The quest log: Vask's contract is announced as his dialogue closes, and J opens the log on it.
await page.evaluate(() => { const g = (window as any).__game.game; g.world.travel('harrow', 9, 6, 0); g.interact(g.world.featureHere()); });
await page.waitForTimeout(100);
await page.keyboard.press('Space'); await page.waitForTimeout(100);
const questLine = await page.evaluate(() => (window as any).__game.game.log.at(-1));
await page.keyboard.press('KeyJ'); await page.waitForTimeout(150);
const questScreen = await page.evaluate(() => (window as any).__game.game.top.constructor.name);
const questColours = await colours();
await page.keyboard.press('Escape'); await page.waitForTimeout(100);
const questClosed = await page.evaluate(() => (window as any).__game.game.top.constructor.name);
// The weather: the Shelf in a downpour, a fight in it, and Thornmark under falling snow with snow
// lying deep. Each moves the clock to the first such hour of daylight for this game's seed.
const weatherAt = async (map: string, x: number, y: number, f: number, want: string): Promise<{ found: boolean; sky: string; log: string }> => {
  const r = await page.evaluate(async ([m, xx, yy, ff, kind]: [string, number, number, number, string]) => {
    const load = (p: string): Promise<any> => import(p);
    const W = await load('/src/game/weather.ts'), C = await load('/src/game/calendar.ts');
    const g = (window as any).__game.game, w = g.world;
    g.screens = [g.screens[0]]; w.travel(m, xx, yy, ff); w.sky = null;
    const at = W.findWeather(w.state.weatherSeed, w.state.minutes, w.climate, (wx: any, min: number) => (kind === 'downpour' ? wx.precip >= 0.7 && wx.snow === 0 : wx.snow >= 0.7 && wx.precip >= 0.3 && wx.cover >= 0.5) && C.daylightAt(min) >= 0.8, 24 * 480);
    if (at >= 0) w.state.minutes = at;
    return at >= 0;
  }, [map, x, y, f, want] as [string, number, number, number, string]);
  await page.waitForTimeout(150);
  return page.evaluate((found: boolean) => { const g = (window as any).__game.game; return { found, sky: g.world.sky?.sky ?? '', log: g.log[g.log.length - 1] ?? '' }; }, r);
};
const rain = await weatherAt('shelf', 16, 8, 2, 'downpour');
const rainColours = await colours();
await page.evaluate(() => { const g = (window as any).__game.game; g.fight(['road_rats']); });
await page.waitForTimeout(150);
const rainFight = await page.evaluate(() => { const g = (window as any).__game.game; return { screen: g.top.constructor.name, rangedPenalty: g.top.state.rangedPenalty }; });
const rainFightColours = await colours();
const snow = await weatherAt('thornmark', 7, 26, 2, 'snow');
const snowColours = await colours();
// The monster art unions many parts into one painted mass with the nonzero fill rule, so every
// part kind has to wind the same way. One that winds the other way punches a hole wherever it
// overlaps another, which is how the tube ends once cut a wedge out of every limb. Overlap each
// pair of part kinds and look for background left showing in the middle.
const windingHoles = await page.evaluate(async () => {
  const load = (p: string): Promise<any> => import(p);
  const G = await load('/src/ui/monsters/gloss.ts');
  const C = await load('/src/ui/monsters/common.ts');
  const mk = (kind: string, cx: number): any => {
    if (kind === 'ball') return { k: 'ball', x: cx, y: 60, r: 34 };
    if (kind === 'ell') return { k: 'ell', x: cx, y: 60, rx: 34, ry: 28, rot: 0.3 };
    if (kind === 'cap') return { k: 'cap', x0: cx - 22, y0: 48, x1: cx + 22, y1: 72, r0: 24, r1: 18 };
    if (kind === 'poly') return { k: 'poly', pts: [cx - 32, 30, cx + 32, 36, cx + 26, 88, cx - 30, 84] };
    if (kind === 'curve') return { k: 'curve', pts: [cx - 30, 34, cx + 30, 30, cx + 28, 86, cx - 32, 84], wobble: 0.04, seed: 5, sub: 2 };
    return { k: 'tube', pts: [cx - 30, 40, cx, 62, cx + 30, 46], r0: 22, r1: 16 };
  };
  const kinds = ['ball', 'ell', 'cap', 'poly', 'curve', 'tube'];
  const c = document.createElement('canvas'); c.width = 170; c.height = 120;
  const ctx = c.getContext('2d')!;
  const bad: string[] = [];
  for (const a of kinds) for (const b of kinds) {
    ctx.fillStyle = '#ff00ff'; ctx.fillRect(0, 0, 170, 120);
    G.blob(ctx, C.B, '#8a8a90', [mk(a, 62), mk(b, 104)], { h: 120, form: false });
    const d = ctx.getImageData(74, 50, 18, 22).data;
    let hole = 0;
    for (let i = 0; i < d.length; i += 4) if (d[i] > 200 && d[i + 1] < 80 && d[i + 2] > 200) hole++;
    if (hole > 0) bad.push(`${a}+${b} (${hole}px)`);
  }
  return bad;
});

if (process.env.SMOKE_SHOT) {
  await page.screenshot({ path: process.env.SMOKE_SHOT });
}

await browser.close();
server.close();

let bad = 0;
const ok = (cond: boolean, msg: string) => { console.log((cond ? '  ok:   ' : '  FAIL: ') + msg); if (!cond) bad++; };
ok(errors.length === 0, `no page errors${errors.length ? ' -> ' + errors.join(' | ') : ''}`);
ok(titleColours > 6, `the title painted (${titleColours} colours)`);
ok(screen0 === 'CreateScreen' && screen1 === 'ExploreScreen', `Space on the title opens creation, Space again takes the premade company (${screen0}, ${screen1})`);
ok(state.map === 'shelf' && state.steps === 3, `three steps back through the gate reach the Shelf (${JSON.stringify(state)})`);
ok(exploreColours > 20, `the viewport, automap and party cards painted (${exploreColours} colours)`);
ok(screen2 === 'CombatScreen' && combatColours > 20, `a fight opens and paints (${screen2}, ${combatColours} colours)`);
ok(thornColours > 20, `Thornmark's forest paints (${thornColours} colours)`);
ok(thornFight.screen === 'CombatScreen' && /ogre/.test(thornFight.monsters) && /wraith/.test(thornFight.monsters) && thornFightColours > 20, `the ogre and wraith sprites paint in a fight (${thornFight.monsters}, ${thornFightColours} colours)`);
ok(townColours > 20, `Thornhold paints (${townColours} colours)`);
ok(questLine === 'New quest: The Quiet Farm.', `closing Vask's dialogue announces his quest (${questLine})`);
ok(questScreen === 'QuestScreen' && questColours > 20 && questClosed === 'ExploreScreen', `J opens the quest log, it paints, and Esc closes it (${questScreen}, ${questColours} colours, then ${questClosed})`);
ok(rain.found && /downpour|storm/.test(rain.sky) && /pour|heavens|sheets|thunder/i.test(rain.log) && rainColours > 20, `the Shelf paints in a downpour and the log says so (${rain.sky}: "${rain.log}", ${rainColours} colours)`);
ok(rainFight.screen === 'CombatScreen' && rainFight.rangedPenalty > 0 && rainFightColours > 20, `a fight in the downpour paints, with the archers' penalty (${rainFightColours} colours)`);
ok(snow.found && /snow|blizzard|flurries/.test(snow.sky) && /snow|blizzard/i.test(snow.log) && snowColours > 20, `Thornmark paints under falling snow with snow lying (${snow.sky}: "${snow.log}", ${snowColours} colours)`);
ok(windingHoles.length === 0, `every pair of sprite part kinds unions without a hole${windingHoles.length ? ' -> ' + windingHoles.join(', ') : ''}`);
console.log(bad ? '\nSMOKE FAILED' : '\nSMOKE OK: the game renders in a browser, served as TypeScript with no build step.');
process.exit(bad ? 1 : 0);
