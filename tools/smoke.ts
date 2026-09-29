// Headless proof that the game RENDERS IN A BROWSER through the dev server with nothing compiled to
// disk: load index.html, start a new game through the title screen, walk a few steps, open a fight,
// walk into a business and out again, and assert that every frame painted and no page error fired.
import path from 'node:path';
import fs from 'node:fs';
import { fileURLToPath } from 'node:url';
import { createRequire } from 'node:module';
import { randomInt } from 'node:crypto';
import { createServer } from './server.ts';
import { changedFiles, changedMaps } from './changed.ts';
import { MAP_DEFS } from '../src/content/index.ts';
import type { MonsterSprite } from '../src/content/index.ts';

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

// Every run plays the same world: the page's Math.random is pinned, so the new game's seed is SMOKE_SEED
// (the first draw floors to it in freshSeed) and every draw after it follows from it. SMOKE_SEED=random
// picks one and prints it; SMOKE_SEED=<n> replays that world.
const DEFAULT_SEED = 1;
const SEED = process.env.SMOKE_SEED === 'random' ? randomInt(1, 0x7fffffff) : Number(process.env.SMOKE_SEED || DEFAULT_SEED);
if (!Number.isInteger(SEED) || SEED < 1 || SEED >= 0x7fffffff) throw new Error(`SMOKE_SEED must be random or a whole number from 1 to ${0x7fffffff - 1}`);
if (process.env.SMOKE_SEED === 'random') console.log(`SMOKE_SEED=${SEED}`);

// The crack sweep looks one way from every square of the cellar, Helmstow and its keep on every
// run, and all four ways from every square of the maps a pull request changes. SMOKE_BASE=<ref>
// sweeps what changed since that ref (CI passes the pull request's base); SMOKE_SWEEP=all or
// <id>,<id> names the maps instead.
const FLOOR = ['mill', 'harrow', 'keep'];
const sweepAsked: string = process.env.SMOKE_SWEEP || (process.env.SMOKE_BASE ? await changedMaps(changedFiles(process.env.SMOKE_BASE)).then((c) => (c.all ? 'all' : c.maps.join(','))) : '');
const SWEEP = sweepAsked === 'all' ? MAP_DEFS.map((d) => d.id) : sweepAsked.split(',').filter(Boolean);
for (const id of SWEEP) if (!MAP_DEFS.some((d) => d.id === id)) throw new Error(`SMOKE_SWEEP names no map '${id}'`);

// The parts of a drawing that stand apart from its body by design, each with the most pieces it
// comes to and the largest share of the drawing's ink they take between them. Anything else apart
// is a part that has come loose, as the archer's head once did (#7).
const DETACHED: Partial<Record<MonsterSprite, { what: string; pieces: number; share: number }>> = {
  warden: { what: 'shard', pieces: 1, share: 0.01 },
  cut_warden: { what: 'shards', pieces: 2, share: 0.01 },
  acolyte: { what: 'censer', pieces: 1, share: 0.05 },
  lampman: { what: 'lantern', pieces: 1, share: 0.07 },
  adept: { what: 'hand flame', pieces: 1, share: 0.03 },
  rift_hound: { what: 'embers', pieces: 3, share: 0.01 },
  ashen_hand: { what: 'embers', pieces: 5, share: 0.01 },
  wraith: { what: 'fading tongue of cloth', pieces: 1, share: 0.01 },
};

const server = createServer();
await new Promise<void>((r) => server.listen(0, () => r()));
const port = (server.address() as { port: number }).port;

const { chromium } = loadPlaywright();
const browser = await launch(chromium);
const page = await browser.newPage();
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
}, SEED);
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

// Title -> new game -> premade company -> walk out of the gate and into the Foreland -> force a
// fight.
await page.keyboard.press('Space'); await page.waitForTimeout(100);
const screen0 = await page.evaluate(() => (window as any).__game.game.top.constructor.name);
const gameSeed = await page.evaluate(() => (window as any).__game.game.top.seed);
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
// An event on its doorway, put there at run time, is said by the step in and shows in the room's log.
await page.evaluate(() => { const g = (window as any).__game.game; g.world.travel('harrow', 4, 5, 0); g.world.map.features.push({ kind: 'event', x: 4, y: 4, id: 'fx_chair', text: 'An empty chair by the fire.' }); });
await page.keyboard.press('ArrowUp'); await page.waitForTimeout(150);
const inside = await page.evaluate(() => (window as any).__game.game.screens.map((s: any) => s.constructor.name).join(','));
const roomLog = await page.evaluate(() => { const g = (window as any).__game.game, v = g.screens.find((s: any) => s.constructor.name === 'InteriorScreen'); return v ? v.roomLog(g) : []; });
const innColours = await colours();
await page.keyboard.press('Escape'); await page.waitForTimeout(100);
await page.evaluate(() => { const m = (window as any).__game.game.world.map; m.features.splice(m.features.findIndex((f: any) => f.id === 'fx_chair'), 1); });
const outside = await page.evaluate(() => { const g = (window as any).__game.game; return { screens: g.screens.map((s: any) => s.constructor.name).join(','), x: g.world.state.x, y: g.world.state.y, facing: g.world.state.facing }; });
// A person in a business (game/people.ts, World.peopleAt): Hob, put in the Hearthlight at run time,
// makes its first menu list him; his answer sends him away, and the menu no longer lists him.
const inn = await (async () => {
  const state = (): Promise<{ screen: string; options: string[]; text: string }> => page.evaluate(() => { const t = (window as any).__game.game.top; return { screen: t.constructor.name, options: t.options ?? [], text: t.words ?? t.text ?? '' }; });
  await page.evaluate(() => {
    const g = (window as any).__game.game;
    g.world.travel('harrow', 4, 5, 0);
    g.world.map.features.push({ kind: 'npc', x: 4, y: 4, name: 'Hob, once tenant of Ashcombe', lines: ['"A stranger, and armed."'], until: { flag: 'fx_hob_gone' },
      choice: { ask: '"Should I go to Gullwick?"', answers: [{ label: 'Go', sets: 'fx_hob_gone', says: ['"Then I go."'] }, { label: 'Stay', sets: 'fx_hob_stays', says: ['"Then I stay."'] }] } });
  });
  await page.keyboard.press('ArrowUp'); await page.waitForTimeout(150);
  const menu = await state();
  await page.keyboard.press('ArrowDown'); await page.keyboard.press('Space'); await page.waitForTimeout(80);
  const words = await state();
  await page.keyboard.press('Space'); await page.waitForTimeout(80);
  const question = await state();
  await page.keyboard.press('Space'); await page.waitForTimeout(80);
  const said = await state();
  await page.keyboard.press('Space'); await page.waitForTimeout(80);
  const back = await state();
  const backColours = await colours();
  // With him gone the trade is all the menu offers: choosing it opens it once, with nothing under it to come back to.
  await page.keyboard.press('Space'); await page.waitForTimeout(80);
  const traded = await page.evaluate(() => (window as any).__game.game.screens.map((s: any) => s.constructor.name).join(','));
  await page.keyboard.press('Escape'); await page.waitForTimeout(100);
  const left = await page.evaluate(() => {
    const g = (window as any).__game.game, top = g.top.constructor.name, m = g.world.map;
    while (g.screens.length > 1) g.pop();
    const i = m.features.findIndex((f: any) => f.kind === 'npc' && f.name.startsWith('Hob'));
    if (i >= 0) m.features.splice(i, 1);
    delete g.party.flags.fx_hob_gone; delete g.party.flags.fx_hob_stays;
    return top;
  });
  // The Gilded Eel is its keeper: with Ebba in it from a new game (#77), the room says itself over a
  // menu that lists them both.
  const eel = await page.evaluate(() => {
    const g = (window as any).__game.game, m = g.world.map, eel = m.features.find((f: any) => f.kind === 'npc' && f.interior === 'gilded_eel');
    g.interact(eel);
    const out = g.screens.map((s: any) => s.constructor.name).join(','), under = g.screens[g.screens.length - 2]?.options ?? [];
    while (g.screens.length > 1) g.pop();
    return { screens: out, options: under };
  });
  return { menu, words, question, said, back, backColours, traded, left, eel };
})();
// The Wardens' hall, the Drillyard, with First Watch's walk already made, so taking it pays at once.
// Back on the hall's first menu, the rank it reads is the new one: its words are made when drawn, not
// when the menu was first opened.
await page.evaluate(() => {
  const g = (window as any).__game.game;
  g.world.ensureMapState(g.world.locate('shelf', 0, 0).mapId).used.scarth_watch = 1;
  g.world.travel('harrow', 3, 13, 0); g.enterCell();
});
await page.waitForTimeout(100);
const hallBefore = await page.evaluate(() => (window as any).__game.game.top.words);
// Down to the guild's work, First Watch, its offer, Take it and the pay; then back from the rank 1 offers to the menu.
for (const k of ['ArrowDown', 'Space', 'Space', 'Space', 'Space', 'Space', 'Escape']) { await page.keyboard.press(k); await page.waitForTimeout(60); }
const hallAfter = await page.evaluate(() => { const g = (window as any).__game.game; return { screens: g.screens.map((s: any) => s.constructor.name).join(','), words: g.top.words }; });
await page.keyboard.press('Escape'); await page.waitForTimeout(100);
const hallLeft = await page.evaluate(() => {
  const g = (window as any).__game.game;
  delete g.world.ensureMapState(g.world.locate('shelf', 0, 0).mapId).used.scarth_watch;
  for (const k of ['q_wardens_watch', 'q_wardens_watch_done', 'rank_wardens']) delete g.party.flags[k];
  return g.screens.map((s: any) => s.constructor.name).join(',');
});
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
  // Held to the content's own list of rooms, so a scene missing from SCENES is caught here too.
  const C = await load('/src/content/index.ts');
  return { n, thin, kinds: C.INTERIORS.length as number, missing: (C.INTERIORS as string[]).filter((k) => !(k in I.SCENES)) };
});
// Hills and farmland: a patch of each laid on the Foreland, painted at noon and at midnight on a day of
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
  // Face north with a field of grain ahead, which greens in Sowing and goes gold by Harvest. The
  // square ahead is its band's first row, so a hedge runs along its far edge into the next field;
  // and the squares in view hold more than one crop.
  w.travel('shelf', 16, 16, 0);
  if ((w.state.y - 1) % 2) w.state.y--;
  const crops = (x: number, y: number): Set<number> => new Set([[-1, 1], [0, 1], [1, 1], [-2, 2], [-1, 2], [0, 2], [1, 2], [2, 2]].map(([l, d]) => V.cropColor(V.fieldAt(x + l, y - d).crop, 50)));
  // The search is bounded: a view it cannot find fails the check plainly rather than hanging.
  const fits = (): boolean => V.fieldAt(w.state.x, w.state.y - 1).crop <= 1 && crops(w.state.x, w.state.y).size >= 2;
  for (let tries = 0; tries < 200 && !fits(); tries++) w.state.x++;
  if (!fits()) return { missing: `no square in 200 east of the Foreland's 16,16 faces a field of grain with two crops in view`, thin: [], form: {}, hedge: { off: 0, apart: 0 }, patchwork: 0, turns: 0, whiten: [] as number[] };
  const m = w.map, kept = m.cells.slice(), sx = w.state.x, sy = w.state.y;
  let hedge = { off: 999, apart: 0 }, patchwork = 0;
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
      if (terrain !== 'farm') continue;
      // The hedge along the far edge of the square ahead (rows 193 to 196 down the middle) is near
      // the hedge's colour, and far from the crop just inside it.
      const avg = (x: number, y: number, bw: number, bh: number): number[] => {
        const q = ctx.getImageData(x, y, bw, bh).data, t = [0, 0, 0];
        for (let i = 0; i < q.length; i += 4) { t[0] += q[i]; t[1] += q[i + 1]; t[2] += q[i + 2]; }
        return t.map((v) => v / (q.length / 4));
      };
      const rgb = (hex: string): number[] => [1, 3, 5].map((i) => parseInt(hex.slice(i, i + 2), 16) * 0.93);
      const far = (a: number[], b: number[]): number => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
      const strip = avg(W / 2 - 30, 194, 60, 2);
      hedge = { off: Math.round(far(strip, rgb(V.hedgeColor(doy)))), apart: Math.round(far(strip, avg(W / 2 - 30, 204, 60, 4))) };
      // Patchwork: the middles of the squares in view (the square ahead and those beside it, and
      // five across the next row) are not all one crop.
      const middles = [[-1, 1], [0, 1], [1, 1], [-2, 2], [-1, 2], [0, 2], [1, 2], [2, 2]].map(([l, dd]) => {
        const u = 120.6 / (dd + 0.5);
        return avg(Math.round(W / 2 + l * 2 * u) - 3, Math.round(H / 2 + u) - 3, 6, 6);
      }).filter((p) => p.every((v) => !Number.isNaN(v)));
      for (const a of middles) for (const b of middles) patchwork = Math.max(patchwork, Math.round(far(a, b)));
    }
  }
  for (let i = 0; i < kept.length; i++) m.cells[i] = kept[i];
  w.state.minutes = minutes; w.cached = undefined;
  const dist = (a: number[], b: number[]): number => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const light = (a: number[]): number => (a[0] + a[1] + a[2]) / 3;
  return {
    missing: '', thin, form, hedge, patchwork, turns: Math.round(dist(mean['farm spring'], mean['farm summer'])),
    whiten: ['hills', 'farm'].map((t) => Math.round(light(mean[`${t} snow`]) - light(mean[`${t} winter`]))),
  };
});
// The quest log: Vask's contract is announced as his dialogue closes, and J opens the log on it. He
// holds court on the keep's door, in the throne room.
await page.evaluate(() => { const g = (window as any).__game.game; g.world.travel('keep', 7, 4, 0); g.interact(g.world.featureHere()); });
await page.waitForTimeout(100);
await page.keyboard.press('Space'); await page.waitForTimeout(100);
const questLine = await page.evaluate(() => (window as any).__game.game.log.at(-1));
await page.keyboard.press('KeyJ'); await page.waitForTimeout(150);
const questScreen = await page.evaluate(() => (window as any).__game.game.top.constructor.name);
const questColours = await colours();
await page.keyboard.press('Escape'); await page.waitForTimeout(100);
const questClosed = await page.evaluate(() => (window as any).__game.game.top.constructor.name);
// A person's question (game/people.ts): a fixture captain, put in the street at run time, asks; the
// first answer hands over a letter, which is read from the pack. Nothing of it stays.
const asked = await (async () => {
  const top = (): Promise<{ screen: string; text: string; title: string }> => page.evaluate(() => { const t = (window as any).__game.game.top; return { screen: t.constructor.name, text: t.text ?? '', title: t.title ?? '' }; });
  await page.evaluate(async () => {
    const C = await import('/src/content/index.ts' as string);
    C.ITEMS.fx_letter = { id: 'fx_letter', name: 'A Sealed Letter', slot: 'none', price: 0, text: ['To Captain Hale, at the pass.', '"The riders cross the ford by night."'] };
    const g = (window as any).__game.game;
    g.world.travel('harrow', 9, 6, 0);
    // Words after a flag nobody has set are not said: the first lines are.
    g.talk({ kind: 'npc', x: 9, y: 5, name: 'Captain Fixture', lines: ['"Riders, by night."'], says: [{ after: { flag: 'fx_never' }, lines: ['"Not yet."'] }],
      choice: { ask: 'Shall I write to Hale?', answers: [{ label: 'Write to him', sets: 'fx_write', gives: 'fx_letter', says: ['He writes, and seals it.'] }, { label: 'Keep it quiet', sets: 'fx_keep', says: ['He shrugs.'] }] } });
  });
  await page.waitForTimeout(80);
  const words = await top();
  await page.keyboard.press('Space'); await page.waitForTimeout(80);
  const question = await top();
  const choiceColours = await colours();
  await page.keyboard.press('Space'); await page.waitForTimeout(80);
  const said = await top();
  await page.keyboard.press('Space'); await page.waitForTimeout(80);
  const after = await page.evaluate(() => { const g = (window as any).__game.game; return { screen: g.top.constructor.name, flag: !!g.party.flags.fx_write, bag: g.party.bag.includes('fx_letter') }; });
  await page.keyboard.press('KeyI'); await page.waitForTimeout(80);
  const has = await page.evaluate(() => { const g = (window as any).__game.game, t = g.top, c = g.party.members[g.selected], i = g.party.bag.indexOf('fx_letter'); if (i >= 0 && t.constructor.name === 'SheetScreen') t.sel = c.pack.length + i; return i >= 0; });
  if (has) { await page.keyboard.press('Space'); await page.waitForTimeout(80); }
  const letter = has ? await top() : { screen: 'no letter', text: '', title: '' };
  await page.keyboard.press('Escape'); await page.waitForTimeout(60);
  await page.keyboard.press('Escape'); await page.waitForTimeout(60);
  const closed = await page.evaluate(async () => {
    const g = (window as any).__game.game, C = await import('/src/content/index.ts' as string);
    const top = g.top.constructor.name;
    // Whatever went wrong above, the rest of the run starts in the street.
    while (g.screens.length > 1) g.pop();
    if (g.party.bag.includes('fx_letter')) g.party.bag.splice(g.party.bag.indexOf('fx_letter'), 1);
    delete g.party.flags.fx_write; delete C.ITEMS.fx_letter;
    return top;
  });
  return { words, question, choiceColours, said, after, letter, closed };
})();
// The weather: the Foreland in a downpour, a fight in it, and Thornmark under falling snow with
// snow lying deep. Each moves the clock to the first such hour of daylight for this game's seed.
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
const weatherSeed = await page.evaluate(() => (window as any).__game.game.world.state.weatherSeed);
// The end of the world: nothing is built north of the Foreland, the rim cut for good. On a clear noon, with nothing the
// view would wash over it, facing it from the last square before it, the view is pink empty space and
// the automap marks it pink; a step into it is refused and the log says why. No such noon fails the check.
const edgeAt: number = await page.evaluate(async () => {
  const load = (p: string): Promise<any> => import(p);
  const W = await load('/src/game/weather.ts'), C = await load('/src/game/calendar.ts'), V = await load('/src/ui/viewport.ts');
  const g = (window as any).__game.game, w = g.world;
  g.screens = [g.screens[0]]; w.travel('shelf', 8, 1, 0); w.sky = null;
  const at = W.findWeather(w.state.weatherSeed, w.state.minutes, w.climate, (wx: any, min: number) => wx.precip < 0.02 && !V.washes(wx) && wx.cover === 0 && C.daylightAt(min) === 1, 24 * 480);
  if (at >= 0) w.state.minutes = at;
  return at;
});
await page.waitForTimeout(150);
const pinkIn = async (r: { x: number; y: number; w: number; h: number }): Promise<number> => page.evaluate((b: { x: number; y: number; w: number; h: number }) => {
  const c = document.getElementById('stage') as HTMLCanvasElement;
  const d = c.getContext('2d')!.getImageData(b.x, b.y, b.w, b.h).data;
  let n = 0;
  for (let i = 0; i < d.length; i += 4) if (Math.abs(d[i] - 0xff) < 5 && Math.abs(d[i + 1] - 0x5f) < 5 && Math.abs(d[i + 2] - 0xbf) < 5) n++;
  return n;
}, r);
const edgeView = edgeAt >= 0 ? await pinkIn({ x: 8, y: 8, w: 400, h: 200 }) : 0, edgeMap = edgeAt >= 0 ? await pinkIn({ x: 416, y: 42, w: 216, h: 214 }) : 0;
await page.keyboard.press('ArrowUp'); await page.waitForTimeout(100);
const edgeBump = await page.evaluate(() => { const g = (window as any).__game.game, z = g.world.zone; return { log: g.log.at(-1), y: g.world.state.y - z.y, zone: z.id }; });
// The pass is open, a road walked straight through into Thornmark past the checkpoint's warning,
// no transition between.
await page.evaluate(() => {
  const g = (window as any).__game.game;
  g.world.travel('shelf', 29, 9, 1); g.world.killGroups(['tm_wolves1']);
});
// Everything said on the walk, however the sky changes on the way.
const said0: number = await page.evaluate(() => (window as any).__game.game.said);
for (let i = 0; i < 4; i++) { await page.keyboard.press('ArrowUp'); await page.waitForTimeout(60); }
const pass = await page.evaluate((s0: number) => { const g = (window as any).__game.game, z = g.world.zone; return { map: g.world.state.mapId, zone: z?.id, x: g.world.state.x - z?.x, y: g.world.state.y - z?.y, screen: g.top.constructor.name, said: g.log.slice(Math.max(0, g.log.length - (g.said - s0))).join(' / ') }; }, said0);
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

// The walls meet without a crack. Paint a view from every open cell of a map twice, over two flat
// backdrops, and wherever the two differ the backdrop shows through. Along the horizon only walls
// and hills can be (the floor starts 24px below it at the far end of the view, and the billboards
// stay out over a backdrop), so there backdrop with solid wall either side of it is a crack between
// two faces. The sky between two hills' crests narrows to a point where they cross, a notch and not
// a crack, so a crack is kept only if the view painted with its hills laid flat shows it too: a
// crack between two faces does not depend on the hills. That passes anything drawn as part of a
// hill, so the check after the sweep holds a hill's body to its outline. And where walls stand on
// both hands of the party the edges of the view are wall: those once went undrawn. A zone of the
// outdoors is walked over its own squares.
const sweeps = [...FLOOR.filter((id) => !SWEEP.includes(id)).map((id) => ({ id, all: false })), ...SWEEP.map((id) => ({ id, all: true }))];
const cracks = await page.evaluate(async (maps: { id: string; all: boolean }[]) => {
  const load = (p: string): Promise<any> => import(p);
  const V = await load('/src/ui/viewport.ts'), T = await load('/src/game/types.ts');
  const w = (window as any).__game.game.world;
  const W = 400, H = 268, band = 16, bad: string[] = [];
  let views = 0;
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  // The sky goes to a canvas of its own and is never composited, so only the backdrop is behind the walls.
  const sky = document.createElement('canvas'); sky.width = W; sky.height = H;
  const skyCtx = sky.getContext('2d')!;
  const paint = (backdrop: string) => { V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H }, backdrop); return ctx.getImageData(0, H / 2 - band, W, band * 2).data; };
  // The same view with the hills laid flat: each hill square read as grass while it is painted.
  const flat = (m: any, backdrop: string) => {
    const at = m.at;
    m.at = (x: number, y: number) => { const c = at.call(m, x, y); return c.terrain === 'hills' ? { ...c, terrain: 'grass' } : c; };
    try { return paint(backdrop); } finally { delete m.at; }
  };
  const crackAt = (shows: (px: number, py: number) => boolean, px: number, py: number) => shows(px, py) && [2, 3].some((s) => px >= s && px < W - s && !shows(px - s, py) && !shows(px + s, py));
  for (const { id, all } of maps) {
    const at = w.locate(id, 0, 0), m = w.maps[at.mapId], z = m.zones.find((q: any) => q.id === id);
    const mw = z ? z.w : m.width, mh = z ? z.h : m.height;
    for (let y = 0; y < mh; y++) for (let x = 0; x < mw; x++) {
      const ax = at.x + x, ay = at.y + y;
      if (m.at(ax, ay).solid !== 'none' || m.at(ax, ay).door !== 'none') continue;
      for (const f of all ? [0, 1, 2, 3] : [(x + y) % 4]) {
        const rf = (f + 1) % 4;
        w.travel(id, x, y, f); w.state.light = 1;
        const a = paint('#ff00ff'), b = paint('#00ff00');
        views++;
        const shows = (px: number, py: number) => { const i = (py * W + px) * 4; return Math.abs(a[i] - b[i]) > 8 || Math.abs(a[i + 1] - b[i + 1]) > 8; };
        // Beside the party a wall, as it is drawn: a secret door among the peaks is a peak, not a wall.
        const walled = (s: number) => V.isSolidWall(V.drawnCell(m, ax + s * T.FACING_DX[rf], ay + s * T.FACING_DY[rf]));
        let spot = '', level: ((px: number, py: number) => boolean) | undefined;
        for (let py = 0; py < band * 2 && !spot; py++) for (let px = 0; px < W && !spot; px++) {
          if (!shows(px, py)) continue;
          let crack = crackAt(shows, px, py);
          if (crack) {
            if (!level) { const fa = flat(m, '#ff00ff'), fb = flat(m, '#00ff00'); level = (qx, qy) => { const i = (qy * W + qx) * 4; return Math.abs(fa[i] - fb[i]) > 8 || Math.abs(fa[i + 1] - fb[i + 1]) > 8; }; }
            crack = crackAt(level, px, py);
          }
          if (crack || (px < 6 && walled(-1)) || (px >= W - 6 && walled(1))) spot = `${px},${H / 2 - band + py}`;
        }
        if (spot) bad.push(`${id} ${x},${y} facing ${f} at ${spot}`);
      }
    }
  }
  return { bad, views };
}, sweeps);
// A hill's body stays inside its outline. The sweep lays hills flat, so it cannot see a crest
// light drawn off its hill, floating clear of it with sky beneath; this can. Each hill is painted alone, near and far, left, ahead and right, and every inked
// pixel lies within a pixel of its outline.
const hillSpill: string[] = await page.evaluate(async () => {
  const load = (p: string): Promise<any> => import(p);
  const V = await load('/src/ui/viewport.ts');
  const W = 400, H = 268, out: string[] = [];
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  for (const d of [1, 2, 3, 5]) for (const l of [-1, 0, 1]) for (const seed of [3, 71, 409]) {
    ctx.clearRect(0, 0, W, H);
    const { outline } = V.hillBody(ctx, '#6a8a4a', W / 2, H / 2, H, d, l, seed, false, null, false, false);
    const px = ctx.getImageData(0, 0, W, H).data;
    const inside = (x: number, y: number): boolean => ctx.isPointInPath(outline, x + 0.5, y + 0.5);
    let n = 0;
    for (let y = 0; y < H; y++) for (let x = 0; x < W; x++) {
      if (px[(y * W + x) * 4 + 3] < 128 || inside(x, y)) continue;
      if (![[-1, -1], [0, -1], [1, -1], [-1, 0], [1, 0], [-1, 1], [0, 1], [1, 1]].some(([dx, dy]) => inside(x + dx, y + dy))) n++;
    }
    if (n) out.push(`d ${d} l ${l} seed ${seed}: ${n}px`);
  }
  return out;
});

// One silhouette: every monster drawn at combat size, alone, three abreast and six abreast, through
// its idle motion, is one piece of ink. Ink is alpha 128 and up (a ground shadow is under it), a
// piece is 8-connected, and specks under 6 px are left out. What stands apart must be declared.
interface Silhouette { id: string; sprite: string; pieces: number; share: number; at: string; clipped: boolean }
const silhouettes: Silhouette[] = await page.evaluate(async () => {
  const load = (p: string): Promise<any> => import(p);
  const S = await load('/src/ui/sprites.ts'), C = await load('/src/content/index.ts');
  const out: Silhouette[] = [];
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  for (const def of Object.values(C.MONSTERS) as any[]) {
    const worst = { id: def.id, sprite: def.sprite, pieces: 0, share: 0, at: '', clipped: false };
    for (const n of [1, 3, 6]) {
      const h = S.combatHeight(def.size, n), cw = Math.ceil(h * 3), ch = Math.ceil(h * 1.6);
      c.width = cw; c.height = ch;
      const seen = new Int32Array(cw * ch), stack = new Int32Array(cw * ch);
      for (let frame = 0; frame <= 176; frame += 4) {
        ctx.clearRect(0, 0, cw, ch);
        S.drawMonsterSprite(ctx, def.sprite, cw / 2, Math.round(h * 1.3), h, def.tint, 1, frame);
        const d = ctx.getImageData(0, 0, cw, ch).data;
        seen.fill(0);
        const sizes: number[] = [];
        for (let i = 0; i < cw * ch; i++) {
          if (seen[i] || d[i * 4 + 3] < 128) continue;
          let top = 0, size = 0;
          stack[top++] = i; seen[i] = 1;
          while (top) {
            const p = stack[--top], px = p % cw, py = (p - px) / cw;
            size++;
            if (px === 0 || py === 0 || px === cw - 1 || py === ch - 1) worst.clipped = true;
            for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
              const qx = px + dx, qy = py + dy, q = qy * cw + qx;
              if (qx < 0 || qy < 0 || qx >= cw || qy >= ch || seen[q] || d[q * 4 + 3] < 128) continue;
              seen[q] = 1; stack[top++] = q;
            }
          }
          if (size >= 6) sizes.push(size);
        }
        sizes.sort((a, b) => b - a);
        const ink = sizes.reduce((a, b) => a + b, 0), apart = ink - (sizes[0] ?? 0);
        if (sizes.length - 1 > worst.pieces) { worst.pieces = sizes.length - 1; worst.at = `${n} abreast, frame ${frame}: ${sizes.slice(1).join('+')} px apart of ${ink}`; }
        if (ink && apart / ink > worst.share) worst.share = apart / ink;
      }
    }
    out.push(worst);
  }
  return out;
});
const loose = silhouettes.filter((s) => { const k = DETACHED[s.sprite as MonsterSprite]; return s.clipped || s.pieces > (k?.pieces ?? 0) || s.share > (k?.share ?? 0); });
const unused = Object.keys(DETACHED).filter((k) => !silhouettes.some((s) => s.sprite === k && s.pieces > 0));

await browser.close();
server.close();

let bad = 0;
const ok = (cond: boolean, msg: string) => { console.log((cond ? '  ok:   ' : '  FAIL: ') + msg); if (!cond) bad++; };
ok(errors.length === 0, `no page errors${errors.length ? ' -> ' + errors.join(' | ') : ''}`);
ok(titleColours > 6, `the title painted (${titleColours} colours)`);
ok(screen0 === 'CreateScreen' && screen1 === 'ExploreScreen', `Space on the title opens creation, Space again takes the premade company (${screen0}, ${screen1})`);
ok(gameSeed === SEED, `the new game starts from the pinned seed (${gameSeed}, weather seed ${weatherSeed})`);
ok(state.map === 'caldera' && state.zone === 'shelf' && state.steps === 3, `three steps back through the gate reach the Foreland, outdoors (${JSON.stringify(state)})`);
ok(exploreColours > 20, `the viewport, automap and party cards painted (${exploreColours} colours)`);
ok(screen2 === 'CombatScreen' && combatColours > 20, `a fight opens and paints (${screen2}, ${combatColours} colours)`);
ok(thornColours > 20, `Thornmark's forest paints (${thornColours} colours)`);
ok(thornFight.screen === 'CombatScreen' && /ogre/.test(thornFight.monsters) && /wraith/.test(thornFight.monsters) && thornFightColours > 20, `the ogre and wraith sprites paint in a fight (${thornFight.monsters}, ${thornFightColours} colours)`);
ok(townColours > 20, `Thornhold paints (${townColours} colours)`);
ok(inside === 'ExploreScreen,InteriorScreen,ChoiceScreen' && innColours > 400, `walking into the inn opens its interior under its menu (${inside}, ${innColours} colours)`);
ok(inn.menu.screen === 'ChoiceScreen' && inn.menu.options.join() === 'A room and rations,Talk to Hob,Leave', `a person in the inn joins its first menu, by name to the first comma (${inn.menu.options.join(', ')})`);
ok(inn.words.text === '"A stranger, and armed."' && inn.question.text === '"Should I go to Gullwick?"' && inn.said.text === '"Then I go."', `talking to him says his words and puts his question in the side panel (${inn.words.screen}, ${inn.question.screen}, ${inn.said.screen})`);
ok(inn.back.screen === 'ChoiceScreen' && inn.back.options.join() === 'A room and rations,Leave' && inn.backColours > 20, `his answer sends him away: back on the first menu, which no longer lists him (${inn.back.options.join(', ')})`);
ok(inn.traded === 'ExploreScreen,InteriorScreen,ChoiceScreen' && inn.left === 'ExploreScreen', `with him gone, the trade opens once, and Esc leaves (${inn.traded}, then ${inn.left})`);
ok(inn.eel.screens === 'ExploreScreen,InteriorScreen,ChoiceScreen,MessageScreen' && inn.eel.options.join() === 'The talk of the room,Talk to Ebba,Leave', `the Gilded Eel, with Ebba in it from a new game, says its room over a menu that lists its keeper and her (${inn.eel.screens}; ${inn.eel.options.join(', ')})`);
ok(roomLog.includes('An empty chair by the fire.'), `an event on the doorway, said by the step in, shows in the room's log (${JSON.stringify(roomLog)})`);
ok(outside.screens === 'ExploreScreen' && outside.x === 4 && outside.y === 5 && outside.facing === 0, `leaving the inn puts the party back in the street, facing the door (${JSON.stringify(outside)})`);
ok(hallBefore === 'You have no rank with the Wardens yet.' && hallAfter.screens === 'ExploreScreen,InteriorScreen,ChoiceScreen' && hallAfter.words === 'Your rank with the Wardens: Recruit.' && hallLeft === 'ExploreScreen',
  `a hall's first menu reads the rank the guild's work has just raised, and Leave ends the visit (${hallBefore} -> ${hallAfter.words}; ${hallAfter.screens}; ${hallLeft})`);
ok(interiors.kinds >= 12 && interiors.missing.length === 0 && interiors.n === interiors.kinds * 2 && interiors.thin.length === 0, `all ${interiors.kinds} interiors paint by day and by night (${interiors.n} painted${interiors.thin.length ? ', too flat: ' + interiors.thin.join(', ') : ''})`);
ok(!terrains.missing, `a view over the fields is found for the hills and farmland checks${terrains.missing ? ' -> ' + terrains.missing : ''}`);
if (!terrains.missing) {
  ok(terrains.thin.length === 0, `hills and farmland paint by day and by night in each season and under snow${terrains.thin.length ? ' -> too flat: ' + terrains.thin.join(', ') : ''}`);
  {
    const { grass, hills, farm } = terrains.form;
    ok(terrains.hedge.off < 50 && terrains.hedge.apart > 40 && terrains.patchwork > 60, `the fields lie in patchwork with hedges between them (the hedge ${terrains.hedge.off} off its colour and ${terrains.hedge.apart} from the crop beside it; ${terrains.patchwork} between the most different squares in view)`);
    ok(hills.tones >= 12 && hills.tones >= 3 * grass.tones && farm.edges >= 2 && farm.edges > grass.edges, `a hill rises where grass lies flat, and a field has rows (tones down the square: grass ${grass.tones}, hills ${hills.tones}; edges across it: grass ${grass.edges}, farm ${farm.edges})`);
  }
  ok(terrains.turns > 20 && terrains.whiten.every((v: number) => v > 60), `the fields turn from Sowing to Harvest, and snow lies white on the hills and the fields (${terrains.turns} apart; ${terrains.whiten.join(' and ')} lighter under snow)`);
}
ok(questLine === 'New quest: The Dimming.', `closing Vask's dialogue announces his quest (${questLine})`);
ok(asked.words.screen === 'MessageScreen' && asked.words.text === '"Riders, by night."' && asked.question.screen === 'ChoiceScreen' && asked.question.text === 'Shall I write to Hale?' && asked.choiceColours > 20,
  `a person's first words (not words whose flag is unset) close onto their question, which paints (${asked.words.screen}, then ${asked.question.screen}, ${asked.choiceColours} colours)`);
ok(asked.said.text === 'He writes, and seals it.\n\n(A Sealed Letter.)' && asked.said.title === 'Captain Fixture' && asked.after.flag && asked.after.bag && asked.after.screen === 'ExploreScreen',
  `the answer is said, sets its flag and hands over the letter (${JSON.stringify(asked.said.text)})`);
ok(asked.letter.screen === 'MessageScreen' && asked.letter.title === 'A Sealed Letter' && asked.letter.text.startsWith('To Captain Hale') && asked.closed === 'ExploreScreen', `the letter is read from the pack, in a box titled with its name, and Esc closes it (${asked.letter.screen} '${asked.letter.title}', then ${asked.closed})`);
ok(questScreen === 'QuestScreen' && questColours > 20 && questClosed === 'ExploreScreen', `J opens the quest log, it paints, and Esc closes it (${questScreen}, ${questColours} colours, then ${questClosed})`);
ok(rain.found && /downpour|storm/.test(rain.sky) && /pour|heavens|sheets|thunder/i.test(rain.log) && rainColours > 20, `the Foreland paints in a downpour and the log says so (${rain.sky}: "${rain.log}", ${rainColours} colours)`);
ok(rainFight.screen === 'CombatScreen' && rainFight.rangedPenalty > 0 && rainFightColours > 20, `a fight in the downpour paints, with the archers' penalty (${rainFightColours} colours)`);
ok(snow.found && /snow|blizzard|flurries/.test(snow.sky) && /snow|blizzard/i.test(snow.log) && snowColours > 20, `Thornmark paints under falling snow with snow lying (${snow.sky}: "${snow.log}", ${snowColours} colours)`);
ok(mapScreen === 'WorldMapScreen' && mapColours > 200, `M opens the world map and it paints (${mapScreen}, ${mapColours} colours)`);
ok(zonesColours > 200 && wholeColours > 200, `Tab lays the zones over it and Z shows it whole (${zonesColours}, ${wholeColours} colours)`);
ok(almanacScreen === 'MessageScreen' && almanacClosed === 'WorldMapScreen', `Space opens the almanac over the map and Esc goes back to it (${almanacScreen}, then ${almanacClosed})`);
ok(afterMap === 'ExploreScreen', `M closes it again (${afterMap})`);
ok(edgeAt >= 0, `the weather has a clear noon with no wash within 480 days, to face the end of the world in (${edgeAt >= 0 ? `minute ${edgeAt}` : `none for weather seed ${weatherSeed}`})`);
ok(edgeAt >= 0 && edgeView > 400 * 200 * 0.6 && edgeMap > 20, `facing the end of the world north of the Foreland, the view is pink empty space and the automap marks it (${edgeAt >= 0 ? `${edgeView} pink pixels in the view, ${edgeMap} on the automap` : 'not looked at: no clear noon'})`);
ok(edgeBump.log === 'The world ends here.' && edgeBump.zone === 'shelf' && edgeBump.y === 1, `a step into it is refused, and the log says why (${JSON.stringify(edgeBump)})`);
ok(pass.map === 'caldera' && pass.zone === 'thornmark' && pass.x === 1 && pass.y === 9 && pass.screen === 'ExploreScreen' && /Warden checkpoint.*The pass opens onto old forest/.test(pass.said) && passColours > 20,
  `the open pass is walked straight through into Thornmark, warned at the checkpoint, and Thornmark says so (${JSON.stringify(pass)})`);
ok(windingHoles.length === 0, `every pair of sprite part kinds unions without a hole${windingHoles.length ? ' -> ' + windingHoles.join(', ') : ''}`);
ok(!hillSpill.length, `a hill's body, its crest light with it, is drawn inside its outline, near and far${hillSpill.length ? ` -> ${hillSpill.slice(0, 4).join(', ')}` : ''}`);
ok(cracks.bad.length === 0, `the walls meet without a crack, and the walls beside the party are drawn, in ${cracks.views} views (${sweeps.map((m) => m.id + (m.all ? ' four ways' : '')).join(', ')})${cracks.bad.length ? ` -> ${cracks.bad.length} views, ` + cracks.bad.slice(0, 4).join(', ') : ''}`);
ok(loose.length === 0 && unused.length === 0, `every monster is one silhouette at combat size, but for the parts it declares apart (${silhouettes.length} drawn; ${Object.entries(DETACHED).map(([k, v]) => `${k}'s ${v!.what}`).join(', ')})${loose.map((s) => ` -> ${s.id} (${s.sprite}): ${s.clipped ? 'runs off the canvas' : `${s.pieces} pieces apart, ${(100 * s.share).toFixed(1)}% of its ink, worst at ${s.at}`}`).join('')}${unused.length ? ' -> declared but never apart: ' + unused.join(', ') : ''}`);
if (bad) console.log(`\nSMOKE_SEED=${SEED} (weather seed ${weatherSeed}) replays this run.`);
console.log(bad ? '\nSMOKE FAILED' : '\nSMOKE OK: the game renders in a browser, served as TypeScript with no build step.');
process.exit(bad ? 1 : 0);
