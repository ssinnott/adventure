// Headless proof that the game RENDERS IN A BROWSER through the dev server with nothing compiled to
// disk: load index.html, start a new game through the title screen, walk a few steps, open a fight,
// walk into a business and out again, and assert that every frame painted and no page error fired.
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
const state = await page.evaluate(() => { const g = (window as any).__game.game; return { map: g.world.state.mapId, zone: g.world.zone?.id, x: g.world.state.x, y: g.world.state.y, steps: g.world.state.steps }; });
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
// A business: walking into the Hearthlight's doorway opens its interior under the inn's menu, and
// leaving puts the party back in the street, facing the door.
await page.evaluate(() => { const g = (window as any).__game.game; g.world.travel('harrow', 4, 5, 0); });
await page.keyboard.press('ArrowUp'); await page.waitForTimeout(150);
const inside = await page.evaluate(() => (window as any).__game.game.screens.map((s: any) => s.constructor.name).join(','));
const innColours = await colours();
await page.keyboard.press('Escape'); await page.waitForTimeout(100);
const outside = await page.evaluate(() => { const g = (window as any).__game.game; return { screens: g.screens.map((s: any) => s.constructor.name).join(','), x: g.world.state.x, y: g.world.state.y, facing: g.world.state.facing }; });
// Every interior paints, at noon and at midnight, and each is a picture rather than a flat fill.
const interiors = await page.evaluate(async () => {
  const load = (p: string): Promise<any> => import(p);
  const I = await load('/src/ui/interior.ts');
  const c = document.createElement('canvas'); c.width = 400; c.height = 268;
  const ctx = c.getContext('2d')!;
  const thin: string[] = [];
  let n = 0;
  for (const kind of Object.keys(I.SCENES)) for (const daylight of [0, 1]) {
    I.drawInterior(ctx, kind, { x: 0, y: 0, w: 400, h: 268 }, daylight, 30);
    const d = ctx.getImageData(0, 0, 400, 268).data, seen = new Set<number>();
    for (let i = 0; i < d.length; i += 4) seen.add((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]);
    if (seen.size < 400) thin.push(`${kind}@${daylight} (${seen.size})`);
    n++;
  }
  return { n, thin };
});
// Hills and farmland: a patch of each laid on the Shelf, painted at noon and at midnight on a day of
// each season and under deep snow. Every view is a picture; a hill rises and a field has rows or
// hedges where grass is flat; the fields turn from Sowing to Harvest, and snow lies white on both.
// Samples are taken inside the square ahead, clear of its edges. The patch is taken up again after.
const terrains = await page.evaluate(async () => {
  const load = (p: string): Promise<any> => import(p);
  const V = await load('/src/ui/viewport.ts');
  const w = (window as any).__game.game.world;
  const W = 400, H = 268, thin: string[] = [], mean: Record<string, number[]> = {}, form: Record<string, { tones: number; edges: number }> = {};
  const c = document.createElement('canvas'), sky = document.createElement('canvas');
  c.width = sky.width = W; c.height = sky.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true })!, skyCtx = sky.getContext('2d')!;
  const minutes = w.state.minutes;
  // Face north with a field of grain ahead, which greens in Sowing and goes gold by Harvest.
  w.travel('shelf', 16, 16, 0);
  while (V.fieldAt(w.state.x, w.state.y - 1).crop > 1) w.state.x++;
  const m = w.map, kept = m.cells.slice(), sx = w.state.x, sy = w.state.y;
  // The square ahead spans y 194..254 on the view and x 140..260 at its far edge: sample well inside.
  const x0 = W / 2 - 40, y0 = 202, sw = 80, sh = 44;
  const days: [string, number][] = [['spring', 20], ['summer', 50], ['autumn', 65], ['winter', 100], ['snow', 100]];
  for (const terrain of ['grass', 'hills', 'farm']) {
    for (let y = sy - 6; y <= sy + 6; y++) for (let x = sx - 6; x <= sx + 6; x++) m.cells[y * m.width + x] = { terrain, solid: 'none', door: 'none', ch: '.' };
    for (const [name, doy] of days) for (const hour of [12, 0]) {
      if (terrain === 'grass' && (name !== 'summer' || hour !== 12)) continue;
      w.state.minutes = ((doy - 75 + 120) % 120) * 1440 + hour * 60;
      const snow = name === 'snow';
      w.cached = { seed: w.state.weatherSeed, minutes: w.state.minutes, region: w.region, weather: { cloud: 0.1, precip: 0, snow: 0, fog: 0, wind: 0, windDir: 0, storm: 0, temp: snow ? -4 : 12, cover: snow ? 1 : 0, wet: 0 } };
      V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H });
      const d = ctx.getImageData(0, 0, W, H).data, seen = new Set<number>();
      for (let i = 0; i < d.length; i += 4) seen.add((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]);
      if (seen.size < 20) thin.push(`${terrain} ${name}@${hour} (${seen.size})`);
      if (hour !== 12) continue;
      const g = ctx.getImageData(x0, y0, sw, sh).data, sum = [0, 0, 0];
      for (let i = 0; i < g.length; i += 4) { sum[0] += g[i]; sum[1] += g[i + 1]; sum[2] += g[i + 2]; }
      mean[`${terrain} ${name}`] = sum.map((v) => v / (g.length / 4));
      if (name !== 'summer') continue;
      // Form: the tones down the middle of the square (a hill's flank shades), and the hard edges
      // across it and down it (a field's rows and hedges); flat grass has few of either.
      const px = (x: number, y: number): number => (y * W + x) * 4;
      const tones = new Set<number>();
      let across = 0, down = 0;
      for (let y = y0; y < y0 + sh; y++) { const i = px(W / 2, y); tones.add((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]); }
      for (let x = x0; x < x0 + sw; x++) { const a = px(x, y0 + sh / 2), b = px(x + 1, y0 + sh / 2); if (Math.abs(d[a] - d[b]) + Math.abs(d[a + 1] - d[b + 1]) + Math.abs(d[a + 2] - d[b + 2]) > 12) across++; }
      for (let y = y0; y < y0 + sh; y++) { const a = px(W / 2, y), b = px(W / 2, y + 1); if (Math.abs(d[a] - d[b]) + Math.abs(d[a + 1] - d[b + 1]) + Math.abs(d[a + 2] - d[b + 2]) > 12) down++; }
      form[terrain] = { tones: tones.size, edges: Math.max(across, down) };
    }
  }
  for (let i = 0; i < kept.length; i++) m.cells[i] = kept[i];
  w.state.minutes = minutes; w.cached = undefined;
  const dist = (a: number[], b: number[]): number => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const light = (a: number[]): number => (a[0] + a[1] + a[2]) / 3;
  return {
    thin, form, turns: Math.round(dist(mean['farm spring'], mean['farm summer'])),
    whiten: ['hills', 'farm'].map((t) => Math.round(light(mean[`${t} snow`]) - light(mean[`${t} winter`]))),
  };
});
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
// The world map: M paints the cloth behind a progress bar, Tab lays the zones over it, Z shows it
// whole, Space opens the almanac over it, M closes it again.
await page.evaluate(() => { const g = (window as any).__game.game; g.world.travel('shelf', 16, 9, 2); g.enterCell(); });
await page.waitForTimeout(100);
await page.keyboard.press('KeyM');
await page.waitForFunction(() => (window as any).__game.game.top.ready === true, null, { timeout: 60000 });
await page.waitForTimeout(150);
const mapScreen = await page.evaluate(() => (window as any).__game.game.top.constructor.name);
const mapColours = await colours();
await page.keyboard.press('Tab'); await page.waitForTimeout(150);
const zonesColours = await colours();
await page.keyboard.press('KeyZ'); await page.waitForTimeout(150);
const wholeColours = await colours();
await page.keyboard.press('Space'); await page.waitForTimeout(150);
const almanacScreen = await page.evaluate(() => (window as any).__game.game.top.constructor.name);
await page.keyboard.press('Escape'); await page.waitForTimeout(100);
const almanacClosed = await page.evaluate(() => (window as any).__game.game.top.constructor.name);
await page.keyboard.press('KeyM'); await page.waitForTimeout(150);
const afterMap = await page.evaluate(() => (window as any).__game.game.top.constructor.name);
// The end of the world: nothing is built west of the Shelf yet. On a clear noon, facing it from the
// last square before it, the view is pink empty space and the automap marks it pink; a step into it
// is refused and the log says why.
await page.evaluate(async () => {
  const load = (p: string): Promise<any> => import(p);
  const W = await load('/src/game/weather.ts'), C = await load('/src/game/calendar.ts');
  const g = (window as any).__game.game, w = g.world;
  g.screens = [g.screens[0]]; w.travel('shelf', 1, 12, 3); w.sky = null;
  const at = W.findWeather(w.state.weatherSeed, w.state.minutes, w.climate, (wx: any, min: number) => wx.precip < 0.02 && wx.fog < 0.2 && wx.cover === 0 && C.daylightAt(min) === 1, 24 * 480);
  if (at >= 0) w.state.minutes = at;
});
await page.waitForTimeout(150);
const pinkIn = async (r: { x: number; y: number; w: number; h: number }): Promise<number> => page.evaluate((b: { x: number; y: number; w: number; h: number }) => {
  const c = document.getElementById('stage') as HTMLCanvasElement;
  const d = c.getContext('2d')!.getImageData(b.x, b.y, b.w, b.h).data;
  let n = 0;
  for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - 0xff) < 5 && Math.abs(d[i + 1] - 0x5f) < 5 && Math.abs(d[i + 2] - 0xbf) < 5) n++;
  return n;
}, r);
const edgeView = await pinkIn({ x: 8, y: 8, w: 400, h: 200 }), edgeMap = await pinkIn({ x: 416, y: 42, w: 216, h: 214 });
await page.keyboard.press('ArrowUp'); await page.waitForTimeout(100);
const edgeBump = await page.evaluate(() => { const g = (window as any).__game.game, z = g.world.zone; return { log: g.log.at(-1), x: g.world.state.x - z.x, zone: z.id }; });
// The pass, once open, is a road walked straight through into Thornmark, no transition between.
await page.evaluate(() => {
  const g = (window as any).__game.game;
  g.party.flags.q_ashcombe_done = 1; g.party.flags.q_greywater_done = 1;
  g.world.travel('shelf', 29, 9, 1); g.world.killGroups(['tm_wolves1']);
});
for (let i = 0; i < 4; i++) { await page.keyboard.press('ArrowUp'); await page.waitForTimeout(60); }
const pass = await page.evaluate(() => { const g = (window as any).__game.game, z = g.world.zone; return { map: g.world.state.mapId, zone: z?.id, x: g.world.state.x - z?.x, y: g.world.state.y - z?.y, screen: g.top.constructor.name, said: g.log.slice(-3).join(' / ') }; });
const passColours = await colours();
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

// The walls meet without a crack. Paint a view from every open cell of the Ashcombe cellar and of
// Harrow twice, over two flat backdrops, and wherever the two differ the backdrop shows through.
// Along the horizon only walls can be (the floor starts 24px below it at the far end of the view),
// so there backdrop with solid wall either side of it is a crack between two faces. And where
// walls stand on both hands of the party the edges of the view are wall: those once went undrawn.
const cracks = await page.evaluate(async () => {
  const load = (p: string): Promise<any> => import(p);
  const V = await load('/src/ui/viewport.ts'), T = await load('/src/game/types.ts');
  const w = (window as any).__game.game.world;
  const W = 400, H = 268, band = 16, bad: string[] = [];
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  // The sky goes to a canvas of its own and is never composited, so only the backdrop is behind the walls.
  const sky = document.createElement('canvas'); sky.width = W; sky.height = H;
  const skyCtx = sky.getContext('2d')!;
  const paint = (backdrop: string) => { V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H }, backdrop); return ctx.getImageData(0, H / 2 - band, W, band * 2).data; };
  for (const id of ['mill', 'harrow']) {
    w.travel(id, 1, 1, 0);
    const m = w.map;
    for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) {
      if (m.at(x, y).solid !== 'none' || m.at(x, y).door !== 'none') continue;
      const f = (x + y) % 4, rf = (f + 1) % 4;
      w.travel(id, x, y, f); w.state.light = 1;
      const a = paint('#ff00ff'), b = paint('#00ff00');
      const shows = (px: number, py: number) => { const i = (py * W + px) * 4; return Math.abs(a[i] - b[i]) > 8 || Math.abs(a[i + 1] - b[i + 1]) > 8; };
      const walled = (s: number) => m.blocksView(x + s * T.FACING_DX[rf], y + s * T.FACING_DY[rf]);
      let at = '';
      for (let py = 0; py < band * 2 && !at; py++) for (let px = 0; px < W && !at; px++) {
        if (!shows(px, py)) continue;
        const crack = [2, 3].some((s) => px >= s && px < W - s && !shows(px - s, py) && !shows(px + s, py));
        if (crack || (px < 6 && walled(-1)) || (px >= W - 6 && walled(1))) at = `${px},${H / 2 - band + py}`;
      }
      if (at) bad.push(`${id} ${x},${y} facing ${f} at ${at}`);
    }
  }
  return bad;
});

await browser.close();
server.close();

let bad = 0;
const ok = (cond: boolean, msg: string) => { console.log((cond ? '  ok:   ' : '  FAIL: ') + msg); if (!cond) bad++; };
ok(errors.length === 0, `no page errors${errors.length ? ' -> ' + errors.join(' | ') : ''}`);
ok(titleColours > 6, `the title painted (${titleColours} colours)`);
ok(screen0 === 'CreateScreen' && screen1 === 'ExploreScreen', `Space on the title opens creation, Space again takes the premade company (${screen0}, ${screen1})`);
ok(state.map === 'caldera' && state.zone === 'shelf' && state.steps === 3, `three steps back through the gate reach the Shelf, outdoors (${JSON.stringify(state)})`);
ok(exploreColours > 20, `the viewport, automap and party cards painted (${exploreColours} colours)`);
ok(screen2 === 'CombatScreen' && combatColours > 20, `a fight opens and paints (${screen2}, ${combatColours} colours)`);
ok(thornColours > 20, `Thornmark's forest paints (${thornColours} colours)`);
ok(thornFight.screen === 'CombatScreen' && /ogre/.test(thornFight.monsters) && /wraith/.test(thornFight.monsters) && thornFightColours > 20, `the ogre and wraith sprites paint in a fight (${thornFight.monsters}, ${thornFightColours} colours)`);
ok(townColours > 20, `Thornhold paints (${townColours} colours)`);
ok(inside === 'ExploreScreen,InteriorScreen,ChoiceScreen' && innColours > 400, `walking into the inn opens its interior under its menu (${inside}, ${innColours} colours)`);
ok(outside.screens === 'ExploreScreen' && outside.x === 4 && outside.y === 5 && outside.facing === 0, `leaving the inn puts the party back in the street, facing the door (${JSON.stringify(outside)})`);
ok(interiors.n === 24 && interiors.thin.length === 0, `all twelve interiors paint by day and by night (${interiors.n} painted${interiors.thin.length ? ', too flat: ' + interiors.thin.join(', ') : ''})`);
ok(terrains.thin.length === 0, `hills and farmland paint by day and by night in each season and under snow${terrains.thin.length ? ' -> too flat: ' + terrains.thin.join(', ') : ''}`);
{
  const { grass, hills, farm } = terrains.form;
  ok(hills.tones >= 12 && hills.tones >= 3 * grass.tones && farm.edges >= 2 && farm.edges > grass.edges, `a hill rises where grass lies flat, and a field has rows or hedges (tones down the square: grass ${grass.tones}, hills ${hills.tones}; edges across it: grass ${grass.edges}, farm ${farm.edges})`);
}
ok(terrains.turns > 20 && terrains.whiten.every((v: number) => v > 60), `the fields turn from Sowing to Harvest, and snow lies white on the hills and the fields (${terrains.turns} apart; ${terrains.whiten.join(' and ')} lighter under snow)`);
ok(questLine === 'New quest: The Quiet Farm.', `closing Vask's dialogue announces his quest (${questLine})`);
ok(questScreen === 'QuestScreen' && questColours > 20 && questClosed === 'ExploreScreen', `J opens the quest log, it paints, and Esc closes it (${questScreen}, ${questColours} colours, then ${questClosed})`);
ok(rain.found && /downpour|storm/.test(rain.sky) && /pour|heavens|sheets|thunder/i.test(rain.log) && rainColours > 20, `the Shelf paints in a downpour and the log says so (${rain.sky}: "${rain.log}", ${rainColours} colours)`);
ok(rainFight.screen === 'CombatScreen' && rainFight.rangedPenalty > 0 && rainFightColours > 20, `a fight in the downpour paints, with the archers' penalty (${rainFightColours} colours)`);
ok(snow.found && /snow|blizzard|flurries/.test(snow.sky) && /snow|blizzard/i.test(snow.log) && snowColours > 20, `Thornmark paints under falling snow with snow lying (${snow.sky}: "${snow.log}", ${snowColours} colours)`);
ok(mapScreen === 'WorldMapScreen' && mapColours > 200, `M opens the world map and it paints (${mapScreen}, ${mapColours} colours)`);
ok(zonesColours > 200 && wholeColours > 200, `Tab lays the zones over it and Z shows it whole (${zonesColours}, ${wholeColours} colours)`);
ok(almanacScreen === 'MessageScreen' && almanacClosed === 'WorldMapScreen', `Space opens the almanac over the map and Esc goes back to it (${almanacScreen}, then ${almanacClosed})`);
ok(afterMap === 'ExploreScreen', `M closes it again (${afterMap})`);
ok(edgeView > 400 * 200 * 0.6 && edgeMap > 20, `facing the end of the world west of the Shelf, the view is pink empty space and the automap marks it (${edgeView} pink pixels in the view, ${edgeMap} on the automap)`);
ok(edgeBump.log === 'The world ends here.' && edgeBump.zone === 'shelf' && edgeBump.x === 1, `a step into it is refused, and the log says why (${JSON.stringify(edgeBump)})`);
ok(pass.map === 'caldera' && pass.zone === 'thornmark' && pass.x === 1 && pass.y === 9 && pass.screen === 'ExploreScreen' && /The pass opens onto old forest/.test(pass.said) && passColours > 20,
  `the open pass is walked straight through into Thornmark, which says so (${JSON.stringify(pass)})`);
ok(windingHoles.length === 0, `every pair of sprite part kinds unions without a hole${windingHoles.length ? ' -> ' + windingHoles.join(', ') : ''}`);
ok(cracks.length === 0, `the walls meet without a crack in the cellar and in Harrow, and the walls beside the party are drawn${cracks.length ? ` -> ${cracks.length} views, ` + cracks.slice(0, 4).join(', ') : ''}`);
console.log(bad ? '\nSMOKE FAILED' : '\nSMOKE OK: the game renders in a browser, served as TypeScript with no build step.');
process.exit(bad ? 1 : 0);
