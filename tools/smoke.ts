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
// The ogre's band as the view draws it before the fight: each of its kinds, to three (world.ts, groupDrawn).
const ogreView = await page.evaluate(() => { const g = (window as any).__game.game, band = g.world.liveGroups().find((q: any) => q.def.id === 'tm_ogre'); return band ? (g.monstersAt(band.state.x, band.state.y) ?? []).map((m: any) => m.id).join(',') : 'no tm_ogre'; });
await page.evaluate(() => { const g = (window as any).__game.game; g.fight(['tm_ogre', 'tm_wraiths']); });
await page.waitForTimeout(150);
const thornFight = await page.evaluate(() => { const g = (window as any).__game.game; return { screen: g.top.constructor.name, monsters: g.top.state.monsters.map((m: any) => m.def.sprite).join(','), labels: g.top.labels.map((l: any) => l.text).join(' | ') }; });
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
// A person in a business (game/people.ts, World.peopleAt): a Hob put in the Hearthlight at run time,
// with the real Hob (#77) taken out for the run, makes its first menu list him; his answer sends him
// away, and the menu no longer lists him. Then the real Hob is put back, and the menu lists him.
const inn = await (async () => {
  const state = (): Promise<{ screen: string; options: string[]; text: string }> => page.evaluate(() => { const t = (window as any).__game.game.top; return { screen: t.constructor.name, options: t.options ?? [], text: t.words ?? t.text ?? '' }; });
  await page.evaluate(() => {
    const g = (window as any).__game.game, m = g.world.map;
    (window as any).__hob = m.features.splice(m.features.findIndex((f: any) => f.kind === 'npc' && f.name.startsWith('Hob')), 1)[0];
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
    m.features.push((window as any).__hob);
    delete g.party.flags.fx_hob_gone; delete g.party.flags.fx_hob_stays;
    return top;
  });
  const hob = await page.evaluate(() => {
    const g = (window as any).__game.game;
    g.interact(g.world.map.features.find((f: any) => f.kind === 'inn'));
    const menu = g.screens.find((s: any) => s.constructor.name === 'ChoiceScreen')?.options ?? [];
    while (g.screens.length > 1) g.pop();
    return menu;
  });
  // The Gilded Eel is its keeper: with Ebba and Maud in it from a new game (#77), the room says
  // itself over a menu that lists them.
  const eel = await page.evaluate(() => {
    const g = (window as any).__game.game, m = g.world.map, eel = m.features.find((f: any) => f.kind === 'npc' && f.interior === 'gilded_eel');
    g.interact(eel);
    const out = g.screens.map((s: any) => s.constructor.name).join(','), under = g.screens[g.screens.length - 2]?.options ?? [];
    while (g.screens.length > 1) g.pop();
    return { screens: out, options: under };
  });
  return { menu, words, question, said, back, backColours, traded, left, hob, eel };
})();
// A crossing (#164, game/passage.ts): a coachman put in Helmstow's street at run time sells a coach
// to Thornhold. Faced and asked, his words close onto the menu of crossings, then the terms; paying
// takes the fare, runs the clock to the landing and leaves the company in Thornhold, exploring.
const coach = await (async () => {
  const top = (): Promise<{ screen: string; options: string[]; text: string }> => page.evaluate(() => { const t = (window as any).__game.game.top; return { screen: t.constructor.name, options: t.options ?? [], text: t.words ?? t.text ?? '' }; });
  const before = await page.evaluate(() => {
    const g = (window as any).__game.game;
    while (g.screens.length > 1) g.pop();
    g.world.travel('harrow', 7, 14, 0);
    g.world.map.features.push({ kind: 'npc', x: 7, y: 13, name: 'A coachman', lines: ['"Thornhold, at dawn."'], passage: [{ to: 'thornhold', x: 7, y: 14, name: 'Thornhold', by: 'coach', fare: 100, departs: 6, days: 1, arrives: 18 }] });
    g.party.gold = 500;
    return { minutes: g.world.state.minutes, day: g.world.day };
  });
  await page.keyboard.press('Space'); await page.waitForTimeout(80);
  const words = await top();
  await page.keyboard.press('Space'); await page.waitForTimeout(80);
  const menu = await top();
  await page.keyboard.press('Space'); await page.waitForTimeout(80);
  const terms = await top();
  await page.keyboard.press('Space'); await page.waitForTimeout(150);
  const after = await page.evaluate(() => {
    const g = (window as any).__game.game, m = g.maps.harrow;
    m.features.splice(m.features.findIndex((f: any) => f.name === 'A coachman'), 1);
    return { screens: g.screens.map((s: any) => s.constructor.name).join(','), map: g.world.state.mapId, gold: g.party.gold, day: g.world.day, hour: g.world.hour, minutes: g.world.state.minutes, log: g.log.slice(-3) };
  });
  return { before, words, menu, terms, after };
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
/** The most of the strip straight ahead over the horizon the woods may fill: the way through stays open. */
const PATH_MAX = 15;
/** The least of the band over the horizon the dead wood's bare trees fill: about 1.7% as drawn, 0% with none. */
const DEAD_MIN = 1;
const terrains = await page.evaluate(async () => {
  const load = (p: string): Promise<any> => import(p);
  const V = await load('/src/ui/viewport.ts');
  const w = (window as any).__game.game.world;
  const W = 400, H = 268, thin: string[] = [], mean: Record<string, number[]> = {}, form: Record<string, { tones: number; edges: number }> = {}, upper: Record<string, Uint8ClampedArray> = {};
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
  if (!fits()) return { missing: `no square in 200 east of the Foreland's 16,16 faces a field of grain with two crops in view`, trees: 0, path: 0, overWall: 0, dead: { trees: 0, path: 0, overWall: 0 }, thin: [], form: {}, hedge: { off: 0, apart: 0 }, patchwork: 0, turns: 0, whiten: [] as number[], flats: null as any };
  const m = w.map, kept = m.cells.slice(), sx = w.state.x, sy = w.state.y;
  let hedge = { off: 999, apart: 0 }, patchwork = 0;
  // The square ahead spans y 194..254 on the view and x 140..260 at its far edge: sample well inside.
  const x0 = W / 2 - 40, y0 = 202, sw = 80, sh = 44;
  const days: [string, number][] = [['spring', 20], ['summer', 50], ['autumn', 65], ['winter', 100], ['snow', 100]];
  for (const terrain of ['grass', 'hills', 'farm', 'woods', 'deadwood', 'salt', 'heather', 'tidal']) {
    for (let y = sy - 6; y <= sy + 6; y++) for (let x = sx - 6; x <= sx + 6; x++) m.cells[y * m.width + x] = { terrain, solid: 'none', door: 'none', ch: '.' };
    for (const [name, doy] of days) for (const hour of [12, 0]) {
      if (terrain === 'grass' && (name !== 'summer' || hour !== 12)) continue;
      w.state.minutes = ((doy - 75 + 120) % 120) * 1440 + hour * 60;
      const snow = name === 'snow';
      w.cached = { seed: w.state.weatherSeed, minutes: w.state.minutes, region: w.region, weather: { cloud: 0.1, precip: 0, snow: 0, fog: 0, wind: 0, windDir: 0, storm: 0, temp: snow ? -4 : 12, cover: snow ? 1 : 0, wet: 0 } };
      ctx.clearRect(0, 0, W, H); V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H });
      const d = ctx.getImageData(0, 0, W, H).data, seen = new Set<number>();
      for (let i = 0; i < d.length; i += 4) seen.add((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]);
      if (seen.size < 20) thin.push(`${terrain} ${name}@${hour} (${seen.size})`);
      if (hour !== 12) continue;
      const g = ctx.getImageData(x0, y0, sw, sh).data, sum = [0, 0, 0];
      for (let i = 0; i < g.length; i += 4) { sum[0] += g[i]; sum[1] += g[i + 1]; sum[2] += g[i + 2]; }
      mean[`${terrain} ${name}`] = sum.map((v) => v / (g.length / 4));
      // Tidal ground at noon is low water; at five it is high, and the sea is over it.
      if (terrain === 'tidal' && name === 'summer') {
        w.state.minutes += 5 * 60; w.cached = { ...w.cached, minutes: w.state.minutes };
        ctx.clearRect(0, 0, W, H); V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H });
        const q = ctx.getImageData(x0, y0, sw, sh).data, t = [0, 0, 0];
        for (let i = 0; i < q.length; i += 4) { t[0] += q[i]; t[1] += q[i + 1]; t[2] += q[i + 2]; }
        mean['tidal high'] = t.map((v) => v / (q.length / 4));
        w.state.minutes -= 5 * 60; w.cached = { ...w.cached, minutes: w.state.minutes };
        ctx.clearRect(0, 0, W, H); V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H });
      }
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
      // What stands above the horizon: grass has only the sky there, woods their trees.
      upper[terrain] = ctx.getImageData(0, H / 2 - 60, W, 55).data;
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
  // Woods beside a wall: the woods run up the party's column and the ones west of it, a wall runs
  // up the column east. What the woods paint otherwise than grass, where the wall's faces stand, is
  // a tree in front of a wall it stands beside.
  const woodsBy = (t: string) => { for (let y = sy - 6; y <= sy + 6; y++) for (let x = sx - 6; x <= sx + 6; x++) m.cells[y * m.width + x] = x === sx + 1 && y < sy ? { terrain: 'floor', solid: 'wall', door: 'none', ch: '#' } : { terrain: x <= sx ? t : 'grass', solid: 'none', door: 'none', ch: '.' }; };
  w.state.minutes = ((50 - 75 + 120) % 120) * 1440 + 12 * 60;
  w.cached = { seed: w.state.weatherSeed, minutes: w.state.minutes, region: w.region, weather: { cloud: 0.1, precip: 0, snow: 0, fog: 0, wind: 0, windDir: 0, storm: 0, temp: 12, cover: 0, wet: 0 } };
  const shot = (backdrop?: string) => { ctx.clearRect(0, 0, W, H); V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H }, backdrop); return ctx.getImageData(0, 0, W, H / 2).data; };
  woodsBy('woods'); const withTrees = shot();
  woodsBy('deadwood'); const withDead = shot();
  woodsBy('grass'); const bare = shot(), mask = shot('#ff00ff');
  // Dead wood stands its trees as the woods do, so it is held to the same.
  let overWall = 0, deadOverWall = 0;
  const off = (a: Uint8ClampedArray, i: number): boolean => Math.abs(a[i] - bare[i]) + Math.abs(a[i + 1] - bare[i + 1]) + Math.abs(a[i + 2] - bare[i + 2]) > 30;
  for (let i = 0; i < mask.length; i += 4) {
    // The backdrop shows through where nothing stands, a little dimmed by the day's veil.
    const wall = !(mask[i] > 200 && mask[i + 1] < 40 && mask[i + 2] > 200);
    if (wall && off(withTrees, i)) overWall++;
    if (wall && off(withDead, i)) deadOverWall++;
  }
  for (let i = 0; i < kept.length; i++) m.cells[i] = kept[i];
  w.state.minutes = minutes; w.cached = undefined;
  const dist = (a: number[], b: number[]): number => Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]);
  const light = (a: number[]): number => (a[0] + a[1] + a[2]) / 3;
  // The share of the band above the horizon the woods paint otherwise than open grass: their trees.
  // And the way straight ahead, a strip 24 wide up the middle of that band: woods leave it open, as a
  // forest's wall of trees would not.
  // The same for dead wood, whose bare trees fill less of the band.
  const stand = (t: string): { trees: number; path: number } => {
    let risen = 0, blocked = 0, strip = 0;
    for (let i = 0; i < upper[t].length; i += 4) {
      const differs = Math.abs(upper[t][i] - upper.grass[i]) + Math.abs(upper[t][i + 1] - upper.grass[i + 1]) + Math.abs(upper[t][i + 2] - upper.grass[i + 2]) > 30;
      if (differs) risen++;
      if (Math.abs((i / 4) % W - W / 2) < 12) { strip++; if (differs) blocked++; }
    }
    return { trees: Math.round(1000 * risen / (upper[t].length / 4)) / 10, path: Math.round(1000 * blocked / strip) / 10 };
  };
  const { trees, path } = stand('woods'), dead = { ...stand('deadwood'), overWall: deadOverWall };
  return {
    trees, path, overWall, dead,
    missing: '', thin, form, hedge, patchwork, turns: Math.round(dist(mean['farm spring'], mean['farm summer'])),
    whiten: ['hills', 'farm', 'woods', 'deadwood', 'heather'].map((t) => Math.round(light(mean[`${t} snow`]) - light(mean[`${t} winter`]))),
    // The salt by day against the grass; the heather in flower against Sowing's; tidal ground at low and high water.
    flats: { salt: Math.round(light(mean['salt summer'])), grass: Math.round(light(mean['grass summer'])), bloom: mean['heather summer'], sowing: mean['heather spring'], low: mean['tidal summer'], high: mean['tidal high'] },
  };
});
// A torch behind a tree and behind a monster: a sconced wall three squares ahead on the Foreland at
// noon, the ground before it cleared, with a tree or an ogre on the square before it. A flame the
// tree covers goes out; one the ogre stands before is drawn behind it.
const torches = await page.evaluate(async () => {
  const V = await import('/src/ui/viewport.ts' as string);
  const w = (window as any).__game.game.world;
  const W = 400, H = 268, c = document.createElement('canvas'), sky = document.createElement('canvas');
  c.width = sky.width = W; c.height = sky.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true })!, skyCtx = sky.getContext('2d')!;
  const minutes = w.state.minutes;
  w.travel('shelf', 16, 16, 0);
  w.state.minutes = 50 * 1440 + 12 * 60;
  w.cached = { seed: w.state.weatherSeed, minutes: w.state.minutes, region: w.region, weather: { cloud: 0.1, precip: 0, snow: 0, fog: 0, wind: 0, windDir: 0, storm: 0, temp: 12, cover: 0, wet: 0 } };
  const m = w.map, kept = m.cells.slice();
  const lay = (sx: number, sy: number, ahead: string): void => {
    for (let y = sy - 6; y <= sy + 6; y++) for (let x = sx - 6; x <= sx + 6; x++) {
      m.cells[y * m.width + x] = y === sy - 3 ? { terrain: 'floor', solid: 'wall', door: 'none', ch: '#' }
        : x === sx && y === sy - 2 && ahead === 'tree' ? { terrain: 'floor', solid: 'tree', door: 'none', ch: 'T' }
        : { terrain: 'floor', solid: 'none', door: 'none', ch: '.' };
    }
  };
  const paint = (sx: number, sy: number, ahead: string): { flames: { x: number; y: number }[]; px: Uint8ClampedArray } => {
    lay(sx, sy, ahead);
    ctx.clearRect(0, 0, W, H); V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H });
    return { flames: V.paintedFlames().map((f: any) => ({ x: f.x, y: f.y })), px: ctx.getImageData(0, 0, W, H).data };
  };
  const differs = (a: Uint8ClampedArray, b: Uint8ClampedArray, x: number, y: number): boolean => { const i = (Math.floor(y) * W + Math.floor(x)) * 4; return Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 0; };
  // The first square, of a bounded search, whose wall ahead hangs a sconce the tree stands before:
  // with the tree there, that torch's point is painted otherwise than without it.
  let found: { at: [number, number]; bare: ReturnType<typeof paint>; tree: ReturnType<typeof paint> } | null = null;
  for (let y = 16, tries = 0; !found && y < m.height - 7 && tries < 400; y += 13) for (let x = 7; !found && x < m.width - 7 && tries < 400; x++) {
    lay(x, y, 'none');
    if (V.wallDressing(m, x, y - 3) === 'sconce') {
      tries++;
      w.state.x = x; w.state.y = y; w.state.facing = 0;
      const bare = paint(x, y, 'none'), tree = paint(x, y, 'tree');
      if (bare.flames.some((f) => f.x >= 0 && f.x < W && differs(tree.px, bare.px, f.x, f.y))) found = { at: [x, y], bare, tree };
    }
    for (let i = 0; i < kept.length; i++) m.cells[i] = kept[i];
  }
  const done = (): void => { for (let i = 0; i < kept.length; i++) m.cells[i] = kept[i]; w.state.minutes = minutes; w.cached = undefined; };
  if (!found) { done(); return { missing: 'no square of the Foreland faces a sconced wall a tree before it hides', lit: 0, out: 0, over: 0, behind: false, shown: false, covers: false }; }
  const { at, bare, tree } = found;
  w.state.x = at[0]; w.state.y = at[1];
  // A flame over the tree: its point painted otherwise with the tree there than without.
  const over = tree.flames.filter((f) => differs(tree.px, bare.px, f.x, f.y)).length;
  const hidden = bare.flames.filter((f) => f.x >= 0 && f.x < W && differs(tree.px, bare.px, f.x, f.y)), out = hidden.length;
  // The ogre, on the square before the wall, drawn a frame with its flames and the same frame without.
  lay(at[0], at[1], 'none');
  const ogre = [{ id: 'ogre', sprite: 'ogre', tint: '#7a8a5a', size: 1.25 }];
  const frame = (who: any, lit: boolean): Uint8ClampedArray => {
    const flames = V.paintedFlames() as any[], was = flames.slice();
    if (!lit) flames.length = 0;
    ctx.clearRect(0, 0, W, H); V.drawViewport(ctx, w, { x: 0, y: 0, w: W, h: H }, (x: number, y: number) => (x === at![0] && y === at![1] - 2 ? who : null), 40, false);
    if (!lit) flames.push(...was);
    return ctx.getImageData(0, 0, W, H).data;
  };
  const flameAt = [hidden[0].x, hidden[0].y - 1] as const;
  const withOgre = frame(ogre, true), ogreOnly = frame(ogre, false), shown = frame(null, true), dark = frame(null, false);
  done();
  return {
    missing: '', lit: bare.flames.length, out, over,
    shown: differs(shown, dark, ...flameAt), covers: differs(ogreOnly, dark, ...flameAt), behind: !differs(withOgre, ogreOnly, ...flameAt),
  };
});
// The Sunder: on the Foreland at noon, the ground cleared, a chasm two squares deep across the view
// one ahead, and a glass tree either side of the way beyond it. Straight ahead, the chasm paints
// darker than grass, its far wall under the rim lighter than the drop; the glass trees stand over
// the horizon, bluer than they are red.
const sunder = await page.evaluate(async () => {
  const V = await import('/src/ui/viewport.ts' as string), M = await import('/src/game/map.ts' as string);
  const w = (window as any).__game.game.world;
  const W = 400, H = 268, c = document.createElement('canvas'), sky = document.createElement('canvas');
  c.width = sky.width = W; c.height = sky.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true })!, skyCtx = sky.getContext('2d')!;
  const minutes = w.state.minutes;
  w.travel('shelf', 16, 16, 0);
  w.state.minutes = 50 * 1440 + 12 * 60;
  w.cached = { seed: w.state.weatherSeed, minutes: w.state.minutes, region: w.region, weather: { cloud: 0.1, precip: 0, snow: 0, fog: 0, wind: 0, windDir: 0, storm: 0, temp: 12, cover: 0, wet: 0 } };
  const m = w.map, kept = m.cells.slice(), px = w.state.x, py = w.state.y;
  const lay = (sunder: boolean): Uint8ClampedArray => {
    for (let y = py - 7; y <= py + 2; y++) for (let x = px - 7; x <= px + 7; x++) {
      const ch = !sunder ? ',' : y === py - 2 || y === py - 3 ? 'v' : y === py - 4 && Math.abs(x - px) === 1 ? 'c' : ',';
      m.cells[y * m.width + x] = { ...M.LEGEND[ch], ch };
    }
    ctx.clearRect(0, 0, W, H); V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H });
    return ctx.getImageData(0, 0, W, H).data;
  };
  const grass = lay(false), gorge = lay(true);
  for (let i = 0; i < kept.length; i++) m.cells[i] = kept[i];
  w.state.minutes = minutes; w.cached = undefined;
  const at = (a: Uint8ClampedArray, x: number, y: number): number[] => { const i = (y * W + x) * 4; return [a[i], a[i + 1], a[i + 2]]; };
  const lum = (p: number[]): number => (p[0] + p[1] + p[2]) / 3;
  const differs = (x: number, y: number): boolean => { const a = at(grass, x, y), b = at(gorge, x, y); return Math.abs(a[0] - b[0]) + Math.abs(a[1] - b[1]) + Math.abs(a[2] - b[2]) > 30; };
  // The chasm straight ahead: the run of rows under the horizon, down the middle, painted otherwise than grass.
  const rows: number[] = [];
  for (let y = H / 2; y < H; y++) if (differs(W / 2, y)) rows.push(y);
  const mean = (ys: number[], a: Uint8ClampedArray): number => ys.reduce((n, y) => n + lum(at(a, W / 2, y)), 0) / Math.max(1, ys.length);
  const fifth = Math.max(1, Math.floor(rows.length / 5));
  // Over the horizon: what the glass trees paint otherwise than open grass.
  let glass = 0, red = 0, blue = 0;
  for (let y = 40; y < H / 2; y++) for (let x = 0; x < W; x++) if (differs(x, y)) { glass++; const p = at(gorge, x, y); red += p[0]; blue += p[2]; }
  return {
    rows: rows.length, drop: Math.round(mean(rows.slice(rows.length >> 1), grass) - mean(rows.slice(rows.length >> 1), gorge)),
    wall: Math.round(mean(rows.slice(0, fifth), gorge) - mean(rows.slice(-fifth), gorge)),
    glass, bluer: glass > 0 && blue > red,
  };
});
// Crowness Light (#312), from E3's road eleven squares north of it and from Gullwick's beach in F3,
// far past the squares drawn: by noon the tower stands over the land, painted otherwise than with no
// landmark there, its lamp unlit; by night the lamp is dark until the oil is in and lit after, and a
// frame drawn after the oil goes in repaints the scene with it. Then a fixture lighthouse on the
// Foreland with a wall beside its beam: the beam never shows over the wall.
const lighthouse = await page.evaluate(async () => {
  const V = await import('/src/ui/viewport.ts' as string);
  const w = (window as any).__game.game.world;
  const W = 400, H = 268, c = document.createElement('canvas'), sky = document.createElement('canvas');
  c.width = sky.width = W; c.height = sky.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true })!, skyCtx = sky.getContext('2d')!;
  const minutes = w.state.minutes, flags = { ...w.party.flags };
  const clear = (hour: number, sky: Record<string, number> = {}): void => {
    w.state.minutes = Math.floor(minutes / 1440) * 1440 + hour * 60;
    w.cached = { seed: w.state.weatherSeed, minutes: w.state.minutes, region: w.region, weather: { cloud: 0.1, precip: 0, snow: 0, fog: 0, wind: 0, windDir: 0, storm: 0, temp: 12, cover: 0, wet: 0, ...sky } };
  };
  // Cleared first: the sky shows through what the scene leaves unpainted, and a paint before would show in it.
  const paint = (): Uint8ClampedArray => { ctx.clearRect(0, 0, W, H); V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H }); return ctx.getImageData(0, 0, W, H / 2).data; };
  const lamps = (): number => V.paintedFlames().filter((f: any) => f.lamp).length;
  const out: Record<string, { tower: number; day: number; dark: number; lit: number; drawn: number }> = {};
  const view = (): void => V.drawViewport(ctx, w, { x: 0, y: 0, w: W, h: H }, () => null, 71, false);
  for (const [name, zone, x, y, f] of [['road', 'downs_e3', 20, 17, 2], ['Gullwick', 'downs_f3', 6, 14, 3]] as const) {
    w.travel(zone, x, y, f);
    clear(12);
    const m = w.map, kept = m.landmarks, withIt = paint(), day = lamps();
    m.landmarks = []; const without = paint(); m.landmarks = kept;
    let tower = 0;
    for (let i = 0; i < withIt.length; i += 4) if (Math.abs(withIt[i] - without[i]) + Math.abs(withIt[i + 1] - without[i + 1]) + Math.abs(withIt[i + 2] - without[i + 2]) > 30) tower++;
    clear(23); delete w.party.flags.q_oil_lit; paint(); const dark = lamps();
    w.party.flags.q_oil_lit = true; paint(); const lit = lamps();
    // As played: a frame before the oil goes in, then one after, on the same square.
    delete w.party.flags.q_oil_lit; view(); w.party.flags.q_oil_lit = true; view(); const drawn = lamps();
    out[name] = { tower, day, dark, lit, drawn };
  }
  // The weather that takes the fourth square takes the tower too, its lamp with it: from E3's road,
  // fog just short of it leaves the tower; fog at it, or a downpour, leaves nothing of it, by day or
  // by night lit.
  w.travel('downs_e3', 20, 17, 2);
  const towerIn = (sky: Record<string, number>): number => {
    clear(12, sky); const a = paint(); const m = w.map, kept = m.landmarks; m.landmarks = []; const b = paint(); m.landmarks = kept;
    let n = 0; for (let i = 0; i < a.length; i += 4) if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 30) n++;
    return n;
  };
  w.party.flags.q_oil_lit = true;
  const weather = { thin: towerIn({ fog: 0.3 }), fog: towerIn({ fog: 0.35 }), rain: towerIn({ precip: 0.65 }), lamp: 0 };
  clear(23, { fog: 0.35 }); paint(); weather.lamp = lamps();
  (out as any).weather = weather;
  // The fixture: the Foreland at 23:00, a lit lighthouse six squares north, and a wall one north and
  // one east, which stands over the beam's right-hand reach. Drawn at the frame the beam is longest
  // to the right, with its light and without: nothing changes over the wall, and something does
  // over the open sky between.
  w.travel('shelf', 16, 16, 0); clear(23);
  const m = w.map, px = w.state.x, py = w.state.y, cells = m.cells.slice(), kept = m.landmarks;
  for (let yy = py - 8; yy <= py + 1; yy++) for (let xx = px - 4; xx <= px + 4; xx++) m.cells[yy * m.width + xx] = { terrain: 'grass', solid: 'none', door: 'none', ch: ',' };
  m.cells[(py - 6) * m.width + px] = { terrain: 'floor', solid: 'building', door: 'none', ch: 'B' };
  m.cells[(py - 1) * m.width + px + 1] = { terrain: 'floor', solid: 'wall', door: 'none', ch: '#' };
  m.landmarks = [{ x: px, y: py - 6, kind: 'lighthouse' }];
  ctx.clearRect(0, 0, W, H); view();
  const lamp = V.paintedFlames().find((f: any) => f.lamp), lit = ctx.getImageData(0, 0, W, H).data;
  const flames = V.paintedFlames() as any[], was = flames.slice(); flames.length = 0;
  ctx.clearRect(0, 0, W, H); view(); const unlit = ctx.getImageData(0, 0, W, H).data; flames.push(...was);
  for (let i = 0; i < cells.length; i++) m.cells[i] = cells[i];
  m.landmarks = kept;
  // Over the wall: the columns from 300 right, where the wall's side face and front stand over the
  // lamp's row (its side's top edge crosses that row at about 284); the open sky: the columns
  // between the lamp and 250.
  let overWall = 0, overSky = 0;
  if (lamp) for (let y = Math.round(lamp.y) - 2; y <= Math.round(lamp.y) + 2; y++) for (let x = 0; x < W; x++) {
    const i = (y * W + x) * 4, differs = Math.abs(lit[i] - unlit[i]) + Math.abs(lit[i + 1] - unlit[i + 1]) + Math.abs(lit[i + 2] - unlit[i + 2]) > 6;
    if (!differs) continue;
    if (x >= 300) overWall++; else if (x > lamp.x + 10 && x < 250) overSky++;
  }
  (out as any).beam = { lamp: !!lamp, overWall, overSky };
  w.party.flags = flags; w.state.minutes = minutes; w.cached = undefined;
  return out;
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
  const paint = (backdrop: string) => { ctx.clearRect(0, 0, W, H); V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H }, backdrop); return ctx.getImageData(0, H / 2 - band, W, band * 2).data; };
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
// Each is drawn where a fight seats a first group, its foot as far below the view's top as there
// (`seatFoot`: a tall boss on the third rank), on a canvas three heights wide, a height or the seat more above the view's top
// (whichever is more) and 0.3 under the foot: ink above the view's top reaches over the frame, and ink on a border runs off the canvas.
interface Silhouette { id: string; sprite: string; pieces: number; share: number; at: string; clipped: '' | 'top' | 'edge'; room: number; reach: number; size: number }
const { silhouettes, raised, seat, tall }: { silhouettes: Silhouette[]; raised: Silhouette[]; seat: number; tall: { size: number; reach: number } } = await page.evaluate(async () => {
  const load = (p: string): Promise<any> => import(p);
  const S = await load('/src/ui/sprites.ts'), C = await load('/src/content/index.ts');
  const F = await load('/src/ui/frame.ts'), G = await load('/src/ui/grouplabels.ts');
  const seat = Math.round(G.seatFoot(0, F.LAYOUT.view.h)), seatOf = (def: any): number => Math.round(G.seatFoot(0, F.LAYOUT.view.h, def.size));
  const padOf = (h: number, foot = seat): number => Math.max(Math.ceil(h), foot);
  const c = document.createElement('canvas');
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  type Draw = (ctx: CanvasRenderingContext2D, x: number, y: number, h: number, frame: number) => void;
  const scan = (def: any, draw: Draw): Silhouette => {
    const foot = seatOf(def), worst: Silhouette = { id: def.id, sprite: def.sprite, pieces: 0, share: 0, at: '', clipped: '', room: foot, reach: 0, size: def.size };
    for (const n of [1, 3, 6]) {
      const h = S.combatHeight(def.size, n), pad = padOf(h, foot), cw = Math.ceil(h * 3), ch = pad + foot + Math.ceil(h * 0.3);
      c.width = cw; c.height = ch;
      const seen = new Int32Array(cw * ch), stack = new Int32Array(cw * ch);
      for (let frame = 0; frame <= 176; frame += 4) {
        ctx.clearRect(0, 0, cw, ch);
        draw(ctx, cw / 2, pad + foot, h, frame);
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
            if (py - pad < worst.room) worst.room = py - pad;
            if ((pad + foot - py) / h > worst.reach) worst.reach = (pad + foot - py) / h;
            if (px === 0 || py === 0 || px === cw - 1 || py === ch - 1) worst.clipped = 'edge';
            else if (py < pad && worst.clipped !== 'edge') worst.clipped = 'top';
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
    return worst;
  };
  const defs = Object.values(C.MONSTERS) as any[];
  const silhouettes = defs.map((def) => scan(def, (g, x, y, h, frame) => S.drawMonsterSprite(g, def.sprite, x, y, h, def.tint, 1, frame)));
  // The fixtures: a def with the top fifth of its ink moved up, as a crest or a raised wing might
  // be. Each has to fail for reaching above the view: the tallest def's moved a third of its height,
  // and the smallest's moved clear of the view by more than its own height.
  const o = document.createElement('canvas');
  const lifted = (def: any, id: string, lift: (h: number, top: number) => number): Silhouette => scan({ ...def, id }, (g, x, y, h, frame) => {
    o.width = g.canvas.width; o.height = g.canvas.height;
    const oc = o.getContext('2d', { willReadFrequently: true })!;
    S.drawMonsterSprite(oc, def.sprite, x, y, h, def.tint, 1, frame);
    g.drawImage(o, 0, 0);
    const d = oc.getImageData(0, 0, o.width, o.height).data;
    let top = 0;
    while (top < o.height && ![...Array(o.width).keys()].some((i) => d[(top * o.width + i) * 4 + 3] >= 128)) top++;
    const band = Math.round(h * 0.2), up = Math.round(lift(h, top));
    g.drawImage(o, 0, top, o.width, band, 0, top - up, o.width, band);
  });
  const tall = defs.reduce((a, b) => (b.size > a.size ? b : a)), small = defs.reduce((a, b) => (b.size < a.size ? b : a));
  const raised = [
    lifted(tall, `${tall.id}, its top fifth raised a third`, (h) => h / 3),
    // Its band's foot a height and 8 px above the view's top, which is row `padOf(h)` of the canvas.
    lifted(small, `${small.id}, its top fifth raised a height clear of the view`, (h, top) => top + Math.round(h * 0.2) - (padOf(h) - h - 8)),
  ];
  return { silhouettes, raised, seat, tall: { size: G.TALL, reach: G.TALL_REACH } };
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
ok(ogreView === 'ogre,brigand_archer,brigand', `before the fight the view draws the ogre's band as each of its kinds (${ogreView})`);
// The ogre's band is mixed: its label names each kind with its count, as painted (ui/grouplabels.ts).
ok(thornFight.labels.startsWith('1 Ogre, 1 Brigand Archer, 3 Brigands'), `a mixed band's label names each kind with its count (${thornFight.labels})`);
ok(townColours > 20, `Thornhold paints (${townColours} colours)`);
ok(inside === 'ExploreScreen,InteriorScreen,ChoiceScreen' && innColours > 400, `walking into the inn opens its interior under its menu (${inside}, ${innColours} colours)`);
ok(inn.menu.screen === 'ChoiceScreen' && inn.menu.options.join() === 'A room and rations,Talk to Hob,Leave', `a person in the inn joins its first menu, by name to the first comma (${inn.menu.options.join(', ')})`);
ok(inn.words.text === '"A stranger, and armed."' && inn.question.text === '"Should I go to Gullwick?"' && inn.said.text === '"Then I go."', `talking to him says his words and puts his question in the side panel (${inn.words.screen}, ${inn.question.screen}, ${inn.said.screen})`);
ok(inn.back.screen === 'ChoiceScreen' && inn.back.options.join() === 'A room and rations,Leave' && inn.backColours > 20, `his answer sends him away: back on the first menu, which no longer lists him (${inn.back.options.join(', ')})`);
ok(inn.traded === 'ExploreScreen,InteriorScreen,ChoiceScreen' && inn.left === 'ExploreScreen', `with him gone, the trade opens once, and Esc leaves (${inn.traded}, then ${inn.left})`);
ok(inn.hob.join() === 'A room and rations,Talk to Hob,Leave', `the real Hob, by the Hearthlight's fire from a new game, is on its first menu (${inn.hob.join(', ')})`);
ok(inn.eel.screens === 'ExploreScreen,InteriorScreen,ChoiceScreen,MessageScreen' && inn.eel.options.join() === 'The talk of the room,Talk to Ebba,Talk to Maud,Leave', `the Gilded Eel, with Ebba and Maud in it from a new game, says its room over a menu that lists its keeper and them (${inn.eel.screens}; ${inn.eel.options.join(', ')})`);
ok(roomLog.includes('An empty chair by the fire.'), `an event on the doorway, said by the step in, shows in the room's log (${JSON.stringify(roomLog)})`);
ok(outside.screens === 'ExploreScreen' && outside.x === 4 && outside.y === 5 && outside.facing === 0, `leaving the inn puts the party back in the street, facing the door (${JSON.stringify(outside)})`);
ok(coach.words.text === '"Thornhold, at dawn."' && coach.menu.options.join('|') === 'Thornhold\t100g\t1 day|Not now' && /leaves at 06:00 (tomorrow )?and lands the next day at 18:00/.test(coach.terms.text) && coach.terms.options[0] === 'Pay the fare (100 gold)',
  `a coachman's words close onto his crossings, then their terms (${coach.menu.options.join(', ').replace(/\t/g, ' ')}; "${coach.terms.text}")`);
ok(coach.after.screens === 'ExploreScreen' && coach.after.map === 'thornhold' && coach.after.gold === 400 && coach.after.day === coach.before.day + (coach.before.minutes % 1440 <= 360 ? 1 : 2) && coach.after.hour === 18,
  `paying takes the fare and lands the company in Thornhold, its calendar moved to the landing (day ${coach.before.day} to ${coach.after.day}, ${coach.after.hour}:00, ${coach.after.gold} gold; ${coach.after.log.join(' / ')})`);
ok(hallBefore === 'You have no rank with the Wardens yet.' && hallAfter.screens === 'ExploreScreen,InteriorScreen,ChoiceScreen' && hallAfter.words === 'Your rank with the Wardens: Recruit.' && hallLeft === 'ExploreScreen',
  `a hall's first menu reads the rank the guild's work has just raised, and Leave ends the visit (${hallBefore} -> ${hallAfter.words}; ${hallAfter.screens}; ${hallLeft})`);
ok(interiors.kinds >= 12 && interiors.missing.length === 0 && interiors.n === interiors.kinds * 2 && interiors.thin.length === 0, `all ${interiors.kinds} interiors paint by day and by night (${interiors.n} painted${interiors.thin.length ? ', too flat: ' + interiors.thin.join(', ') : ''})`);
ok(!torches.missing && torches.lit > 0 && torches.out > 0 && torches.over === 0, `a tree before a sconced wall puts out the torches it covers (${torches.missing || `${torches.lit} alight, ${torches.out} under the tree, ${torches.over} still drawn over it`})`);
ok(torches.shown && torches.covers && torches.behind, `an ogre before a sconced wall stands in front of its torch's flame (flame shown ${torches.shown}, ogre over it ${torches.covers}, flame behind the ogre ${torches.behind})`);
ok(sunder.rows > 20 && sunder.drop > 40 && sunder.wall > 20, `a chasm paints darker than grass, its far wall under the rim lighter than the drop (${sunder.rows} rows straight ahead, ${sunder.drop} darker than grass in the lower half; the wall ${sunder.wall} lighter than the foot)`);
ok(sunder.glass > 200 && sunder.bluer, `glass trees stand over the horizon beyond the chasm, bluer than red (${sunder.glass} pixels, ${sunder.bluer ? 'bluer' : 'not bluer'})`);
{
  const { beam, weather, ...views } = lighthouse as Record<string, any>;
  ok(weather.thin > 100 && weather.fog === 0 && weather.rain === 0 && weather.lamp === 0, `the weather that takes the fourth square takes Crowness Light, its lamp with it (fog 0.3: ${weather.thin} pixels of tower; fog 0.35: ${weather.fog}; a downpour: ${weather.rain}; a lit lamp in fog by night: ${weather.lamp})`);
  for (const [name, v] of Object.entries(views)) ok(v.tower > 100 && v.day === 0 && v.dark === 0 && v.lit === 1 && v.drawn === 1, `Crowness Light stands over the land from ${name === 'road' ? "E3's road" : "Gullwick's beach"}, its lamp unlit by day, dark by night before the oil and lit after, and the frame after the oil goes in shows it (${v.tower} pixels of tower at noon; lamps ${v.day} by day, ${v.dark} then ${v.lit} by night, ${v.drawn} drawn)`);
  ok(beam.lamp && beam.overWall === 0 && beam.overSky > 0, `a lighthouse's beam shows over the open sky but never over a wall nearer than it (${beam.overSky} pixels of beam over the sky, ${beam.overWall} over the wall${beam.lamp ? '' : '; no lamp lit'})`);
}
ok(!terrains.missing, `a view over the fields is found for the hills and farmland checks${terrains.missing ? ' -> ' + terrains.missing : ''}`);
if (!terrains.missing) {
  ok(terrains.thin.length === 0, `hills, farmland, woods, dead wood, salt, heather and tidal ground paint by day and by night in each season and under snow${terrains.thin.length ? ' -> too flat: ' + terrains.thin.join(', ') : ''}`);
  {
    const { grass, hills, farm, woods } = terrains.form;
    ok(terrains.trees >= 10 && terrains.path <= PATH_MAX && woods.edges > grass.edges, `trees stand about the woods where grass lies open, and the way ahead stays open (${terrains.trees}% of the band over the horizon is trees, ${terrains.path}% of the strip straight ahead, at most ${PATH_MAX}; edges across the square ahead: grass ${grass.edges}, woods ${woods.edges})`);
    ok(terrains.overWall === 0, `no tree of the woods stands in front of a wall beside its square (${terrains.overWall} pixels over the wall's faces)`);
    const dead = terrains.dead;
    ok(dead.trees >= DEAD_MIN && dead.path <= PATH_MAX && dead.overWall === 0, `dead trees stand about the dead wood, the way ahead open and none in front of a wall beside its square (${dead.trees}% of the band over the horizon is trees, at least ${DEAD_MIN}; ${dead.path}% of the strip ahead, at most ${PATH_MAX}; ${dead.overWall} pixels over the wall's faces)`);
    ok(terrains.hedge.off < 50 && terrains.hedge.apart > 40 && terrains.patchwork > 60, `the fields lie in patchwork with hedges between them (the hedge ${terrains.hedge.off} off its colour and ${terrains.hedge.apart} from the crop beside it; ${terrains.patchwork} between the most different squares in view)`);
    ok(hills.tones >= 12 && hills.tones >= 3 * grass.tones && farm.edges >= 2 && farm.edges > grass.edges, `a hill rises where grass lies flat, and a field has rows (tones down the square: grass ${grass.tones}, hills ${hills.tones}; edges across it: grass ${grass.edges}, farm ${farm.edges})`);
  }
  ok(terrains.turns > 20 && terrains.whiten.every((v: number) => v > 60), `the fields turn from Sowing to Harvest, and snow lies white on the hills, the fields, the woods, the dead wood and the heather (${terrains.turns} apart; ${terrains.whiten.join(' and ')} lighter under snow)`);
  {
    const { salt, grass, bloom, sowing, low, high } = terrains.flats;
    const purple = (c: number[]): number => (c[0] + c[2]) / 2 - c[1];
    ok(salt > grass + 60, `the salt flats lie white where the grass lies green (${salt} and ${grass} light)`);
    ok(purple(bloom) > purple(sowing) + 8, `the heather flowers purple at Harvest (${Math.round(purple(bloom))} purple, ${Math.round(purple(sowing))} in Sowing)`);
    ok(high[2] > high[0] + 20 && low[0] >= low[2], `tidal ground is wet sand at low water and the sea at high (${low.map(Math.round).join(',')} at noon, ${high.map(Math.round).join(',')} at five)`);
  }
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
ok(loose.length === 0 && unused.length === 0, `every monster is one silhouette at combat size, but for the parts it declares apart (${silhouettes.length} drawn; ${Object.entries(DETACHED).map(([k, v]) => `${k}'s ${v!.what}`).join(', ')})${loose.map((s) => ` -> ${s.id} (${s.sprite}): ${s.clipped === 'top' ? 'reaches above the view' : s.clipped ? 'runs off the canvas' : `${s.pieces} pieces apart, ${(100 * s.share).toFixed(1)}% of its ink, worst at ${s.at}`}`).join('')}${unused.length ? ' -> declared but never apart: ' + unused.join(', ') : ''}`);
const closest = silhouettes.reduce((a, b) => (b.room < a.room ? b : a));
ok(closest.room >= 0, `every monster stands inside the view, its foot where a fight seats it, a first group's ${seat} px below the top (the closest, ${closest.id}, ${closest.room} px under the top)`);
// A tall boss's markers are painted over its crown at TALL_REACH of its height (ui/grouplabels.ts),
// which tools/tests/labels.ts trusts: its ink must stand no higher.
const towering = silhouettes.filter((s) => s.size > tall.size), over = towering.filter((s) => s.reach > tall.reach);
ok(towering.length > 0 && over.length === 0, `every tall boss's crown stands within ${tall.reach} of its height, under its markers (${towering.map((s) => `${s.id} ${s.reach.toFixed(3)}`).join(', ')})${over.length ? ' -> ' + over.map((s) => `${s.id} reaches ${s.reach.toFixed(3)}`).join(', ') : ''}`);
ok(raised.every((r) => r.clipped === 'top'), `a monster with a part raised a third of its height, or clear of the view, reaches above it, and fails (${raised.map((r) => `${r.id}: ${r.clipped === 'top' ? 'reaches above the view' : `${r.room} px under the top`}`).join('; ')})`);
if (bad) console.log(`\nSMOKE_SEED=${SEED} (weather seed ${weatherSeed}) replays this run.`);
console.log(bad ? '\nSMOKE FAILED' : '\nSMOKE OK: the game renders in a browser, served as TypeScript with no build step.');
process.exit(bad ? 1 : 0);
