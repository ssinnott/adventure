// The smoke's scenes (#1006): the parts that lay a scene on the Foreland (or a dungeon) and measure it by its
// pixels. Each page function takes up what it laid before it returns, and the frame (boot.ts) takes it up
// where one throws.
import type { Load } from '../kit/browser.ts';
import type { Cell, Landmark, MapPalette, Terrain } from '../../src/game/mapdef.ts';
import type { Flame } from '../../src/ui/viewport.ts';
import type { Run } from './boot.ts';

/** What a square of the view holds for the painter: the monsters drawn there. */
type Who = ReturnType<Parameters<typeof import('../../src/ui/viewport.ts').drawViewport>[3]>;

// Hills and farmland: a patch of each laid on the Foreland, painted at noon and at midnight on a day of
// each season and under deep snow. Every view is a picture; a hill rises and a field has rows or
// hedges where grass is flat; the fields turn from Sowing to Harvest, and snow lies white on both.
// Samples are taken inside the square ahead, clear of its edges. The patch is taken up again after.
/** The most of the strip straight ahead over the horizon the woods may fill: the way through stays open. */
const PATH_MAX = 15;
/** The least of the band over the horizon the dead wood's bare trees fill: about 1.7% as drawn, 0% with none. */
const DEAD_MIN = 1;
/** The least of the band over the horizon the pinewoods' pines fill: about 43% as drawn, closer than the woods' 22%. */
const PINE_MIN = 20;
export async function terrains({ page, ok }: Run): Promise<void> {
  const terrains = await page.evaluate(async () => {
    const load: Load = (p) => import(p);
    const V = await load<typeof import('../../src/ui/viewport.ts')>('/src/ui/viewport.ts');
    const w = window.__game!.game!.world;
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
    const crops = (x: number, y: number): Set<string> => new Set([[-1, 1], [0, 1], [1, 1], [-2, 2], [-1, 2], [0, 2], [1, 2], [2, 2]].map(([l, d]) => V.cropColor(V.fieldAt(x + l, y - d).crop, 50)));
    // The search is bounded: a view it cannot find fails the check plainly rather than hanging.
    const fits = (): boolean => V.fieldAt(w.state.x, w.state.y - 1).crop <= 1 && crops(w.state.x, w.state.y).size >= 2;
    for (let tries = 0; tries < 200 && !fits(); tries++) w.state.x++;
    if (!fits()) return { missing: `no square in 200 east of the Foreland's 16,16 faces a field of grain with two crops in view` };
    const m = w.map, kept = m.cells.slice(), sx = w.state.x, sy = w.state.y;
    let hedge = { off: 999, apart: 0 }, patchwork = 0;
    // The ash's embers glowing by night: the floor's pixels that are a hot orange, by season.
    const embers: Record<string, number> = {};
    // The square ahead spans y 194..254 on the view and x 140..260 at its far edge: sample well inside.
    const x0 = W / 2 - 40, y0 = 202, sw = 80, sh = 44;
    const days: [string, number][] = [['spring', 20], ['summer', 50], ['autumn', 65], ['winter', 100], ['snow', 100]];
    for (const terrain of ['grass', 'hills', 'farm', 'woods', 'deadwood', 'salt', 'heather', 'tidal', 'ash', 'pine', 'ice',
      'steppe', 'dunes', 'vines'] as const) {
      for (let y = sy - 6; y <= sy + 6; y++) for (let x = sx - 6; x <= sx + 6; x++) m.cells[y * m.width + x] = { terrain, solid: 'none', door: 'none', ch: '.' };
      for (const [name, doy] of days) for (const hour of [12, 0]) {
        if (terrain === 'grass' && (name !== 'summer' || hour !== 12)) continue;
        w.state.minutes = ((doy - 75 + 120) % 120) * 1440 + hour * 60;
        const snow = name === 'snow';
        w['cached'] = { seed: w.state.weatherSeed!, minutes: w.state.minutes, region: w.region, weather: { cloud: 0.1, precip: 0, snow: 0, fog: 0, wind: 0, windDir: 0, storm: 0, temp: snow ? -4 : 12, cover: snow ? 1 : 0, wet: 0 } };
        ctx.clearRect(0, 0, W, H); V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H });
        const d = ctx.getImageData(0, 0, W, H).data, seen = new Set<number>();
        for (let i = 0; i < d.length; i += 4) seen.add((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]);
        if (seen.size < 20) thin.push(`${terrain} ${name}@${hour} (${seen.size})`);
        if (terrain === 'ash') { let hot = 0; for (let i = (H / 2) * W * 4; i < d.length; i += 4) if (d[i] > 180 && d[i + 1] < 140 && d[i + 2] < 90) hot++; embers[`${name}@${hour}`] = hot; }
        if (hour !== 12) continue;
        const g = ctx.getImageData(x0, y0, sw, sh).data, sum = [0, 0, 0];
        for (let i = 0; i < g.length; i += 4) { sum[0] += g[i]; sum[1] += g[i + 1]; sum[2] += g[i + 2]; }
        mean[`${terrain} ${name}`] = sum.map((v) => v / (g.length / 4));
        // Tidal ground at noon is low water; at five it is high, and the sea is over it.
        if (terrain === 'tidal' && name === 'summer') {
          w.state.minutes += 5 * 60; w['cached'] = { ...w['cached']!, minutes: w.state.minutes };
          ctx.clearRect(0, 0, W, H); V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H });
          const q = ctx.getImageData(x0, y0, sw, sh).data, t = [0, 0, 0];
          for (let i = 0; i < q.length; i += 4) { t[0] += q[i]; t[1] += q[i + 1]; t[2] += q[i + 2]; }
          mean['tidal high'] = t.map((v) => v / (q.length / 4));
          w.state.minutes -= 5 * 60; w['cached'] = { ...w['cached']!, minutes: w.state.minutes };
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
    const woodsBy = (t: Terrain) => { for (let y = sy - 6; y <= sy + 6; y++) for (let x = sx - 6; x <= sx + 6; x++) m.cells[y * m.width + x] = x === sx + 1 && y < sy ? { terrain: 'floor', solid: 'wall', door: 'none', ch: '#' } : { terrain: x <= sx ? t : 'grass', solid: 'none', door: 'none', ch: '.' }; };
    w.state.minutes = ((50 - 75 + 120) % 120) * 1440 + 12 * 60;
    w['cached'] = { seed: w.state.weatherSeed!, minutes: w.state.minutes, region: w.region, weather: { cloud: 0.1, precip: 0, snow: 0, fog: 0, wind: 0, windDir: 0, storm: 0, temp: 12, cover: 0, wet: 0 } };
    const shot = (backdrop?: string) => { ctx.clearRect(0, 0, W, H); V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H }, backdrop); return ctx.getImageData(0, 0, W, H / 2).data; };
    woodsBy('woods'); const withTrees = shot();
    woodsBy('deadwood'); const withDead = shot();
    woodsBy('pine'); const withPines = shot();
    woodsBy('vines'); const withVines = shot();
    woodsBy('grass'); const bare = shot(), mask = shot('#ff00ff');
    // Dead wood and the pinewoods stand their trees as the woods do, so they are held to the same.
    let overWall = 0, deadOverWall = 0, pineOverWall = 0, vinesOverWall = 0;
    const off = (a: Uint8ClampedArray, i: number): boolean => Math.abs(a[i] - bare[i]) + Math.abs(a[i + 1] - bare[i + 1]) + Math.abs(a[i + 2] - bare[i + 2]) > 30;
    for (let i = 0; i < mask.length; i += 4) {
      // The backdrop shows through where nothing stands, a little dimmed by the day's veil.
      const wall = !(mask[i] > 200 && mask[i + 1] < 40 && mask[i + 2] > 200);
      if (wall && off(withTrees, i)) overWall++;
      if (wall && off(withDead, i)) deadOverWall++;
      if (wall && off(withPines, i)) pineOverWall++;
      if (wall && off(withVines, i)) vinesOverWall++;
    }
    // Scatter (#1103): each ground that scatters props laid as the woods were, its rates raised so a prop
    // stands on every square that can stand one, against the same ground with none and with no wall. What
    // the props paint from the horizon down in the strip straight ahead closes the way; where the wall
    // changes the picture, they stand in front of it.
    const M = await load<typeof import('../../src/ui/view/model.ts')>('/src/ui/view/model.ts');
    const rates = { ...M.SCATTER_RATES }, strewn: { t: string; props: number; path: number; overWall: number }[] = [];
    const low = (): Uint8ClampedArray => { ctx.clearRect(0, 0, W, H); V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H }); return ctx.getImageData(0, H / 2, W, H / 2).data; };
    const apart = (a: Uint8ClampedArray, b: Uint8ClampedArray, i: number): boolean => Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 30;
    for (const t of Object.keys(V.GROUND) as Terrain[]) {
      const look = V.GROUND[t], props = look.scatter;
      if (!props) continue;
      for (const k of props) M.SCATTER_RATES[k] = 1 / props.length;
      woodsBy(t); const lit = low();
      look.scatter = undefined; const plain = low();
      for (let y = sy - 6; y < sy; y++) m.cells[y * m.width + sx + 1] = { terrain: t, solid: 'none', door: 'none', ch: '.' };
      const open = low();
      look.scatter = props; Object.assign(M.SCATTER_RATES, rates);
      let stood = 0, blocked = 0, strip = 0, over = 0;
      for (let i = 0; i < lit.length; i += 4) {
        const prop = apart(lit, plain, i);
        if (prop) stood++;
        if (Math.abs((i / 4) % W - W / 2) < 12) { strip++; if (prop) blocked++; }
        if (prop && apart(plain, open, i)) over++;
      }
      strewn.push({ t, props: Math.round(1000 * stood / (lit.length / 4)) / 10, path: Math.round(1000 * blocked / strip) / 10, overWall: over });
    }
    for (let i = 0; i < kept.length; i++) m.cells[i] = kept[i];
    w.state.minutes = minutes; w['cached'] = null;
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
    const { trees, path } = stand('woods'), dead = { ...stand('deadwood'), overWall: deadOverWall }, pine = { ...stand('pine'), overWall: pineOverWall };
    const vines = { ...stand('vines'), overWall: vinesOverWall };
    return {
      trees, path, overWall, dead, pine, vines, strewn,
      // The steppe at Harvest and in Sowing, the dunes and the grass by day (#543).
      wold: { steppe: mean['steppe summer'], sowing: mean['steppe spring'], dunes: mean['dunes summer'], grass: mean['grass summer'] },
      missing: '', thin, form, hedge, patchwork, turns: Math.round(dist(mean['farm spring'], mean['farm summer'])),
      whiten: ['hills', 'farm', 'woods', 'deadwood', 'heather', 'ash', 'pine'].map((t) => Math.round(light(mean[`${t} snow`]) - light(mean[`${t} winter`]))),
      // The salt by day against the grass; the heather in flower against Sowing's; tidal ground at low and high water.
      flats: { salt: Math.round(light(mean['salt summer'])), grass: Math.round(light(mean['grass summer'])), bloom: mean['heather summer'], sowing: mean['heather spring'], low: mean['tidal summer'], high: mean['tidal high'] },
      // The ash by day against the grass, and its embers by night; the ice at Harvest, in Frost and under snow.
      ground: { ash: Math.round(light(mean['ash summer'])), grass: Math.round(light(mean['grass summer'])), embers, ice: mean['ice summer'], frost: Math.round(light(mean['ice winter'])), snowed: Math.round(light(mean['ice snow'])) },
    };
  });
  ok(!terrains.missing, `a view over the fields is found for the hills and farmland checks${terrains.missing ? ' -> ' + terrains.missing : ''}`);
  if (terrains.thin === undefined) return;
  ok(terrains.thin.length === 0, `hills, farmland, woods, dead wood, salt, heather, tidal ground, ash, pine, ice, steppe, dunes and vines paint by day and by night in each season and under snow${terrains.thin.length ? ' -> too flat: ' + terrains.thin.join(', ') : ''}`);
  {
    const { grass, hills, farm, woods } = terrains.form;
    ok(terrains.trees >= 10 && terrains.path <= PATH_MAX && woods.edges > grass.edges, `trees stand about the woods where grass lies open, and the way ahead stays open (${terrains.trees}% of the band over the horizon is trees, ${terrains.path}% of the strip straight ahead, at most ${PATH_MAX}; edges across the square ahead: grass ${grass.edges}, woods ${woods.edges})`);
    ok(terrains.overWall === 0, `no tree of the woods stands in front of a wall beside its square (${terrains.overWall} pixels over the wall's faces)`);
    const dead = terrains.dead;
    ok(dead.trees >= DEAD_MIN && dead.path <= PATH_MAX && dead.overWall === 0, `dead trees stand about the dead wood, the way ahead open and none in front of a wall beside its square (${dead.trees}% of the band over the horizon is trees, at least ${DEAD_MIN}; ${dead.path}% of the strip ahead, at most ${PATH_MAX}; ${dead.overWall} pixels over the wall's faces)`);
    const pine = terrains.pine;
    ok(pine.trees >= PINE_MIN && pine.path <= PATH_MAX && pine.overWall === 0, `pines stand about the pinewoods, the way ahead open and none in front of a wall beside its square (${pine.trees}% of the band over the horizon is trees, at least ${PINE_MIN}; ${pine.path}% of the strip ahead, at most ${PATH_MAX}; ${pine.overWall} pixels over the wall's faces)`);
    const vines = terrains.vines;
    ok(vines.trees >= 10 && vines.path <= PATH_MAX && vines.overWall === 0, `trees hung with creepers stand about the vines, the way ahead open and none in front of a wall beside its square (${vines.trees}% of the band over the horizon, at least 10; ${vines.path}% of the strip ahead, at most ${PATH_MAX}; ${vines.overWall} pixels over the wall's faces)`);
    const strewn = terrains.strewn;
    ok(strewn.length > 0 && strewn.every((s) => s.props > 0 && s.path <= PATH_MAX && s.overWall === 0), `props scattered on open ground stand off the way ahead and in front of no wall beside their square, with one on every square that can stand one (of the view under the horizon, the strip straight ahead and pixels over the wall: ${strewn.map((s) => `${s.t} ${s.props}%, ${s.path}%, ${s.overWall}`).join('; ')}; the strip at most ${PATH_MAX}%)`);
    ok(terrains.hedge.off < 50 && terrains.hedge.apart > 40 && terrains.patchwork > 60, `the fields lie in patchwork with hedges between them (the hedge ${terrains.hedge.off} off its colour and ${terrains.hedge.apart} from the crop beside it; ${terrains.patchwork} between the most different squares in view)`);
    ok(hills.tones >= 12 && hills.tones >= 3 * grass.tones && farm.edges >= 2 && farm.edges > grass.edges, `a hill rises where grass lies flat, and a field has rows (tones down the square: grass ${grass.tones}, hills ${hills.tones}; edges across it: grass ${grass.edges}, farm ${farm.edges})`);
  }
  ok(terrains.turns > 20 && terrains.whiten.every((v: number) => v > 60), `the fields turn from Sowing to Harvest, and snow lies white on the hills, the fields, the woods, the dead wood, the heather, the ash and the pinewoods (${terrains.turns} apart; ${terrains.whiten.join(' and ')} lighter under snow)`);
  {
    const { salt, grass, bloom, sowing, low, high } = terrains.flats;
    const purple = (c: number[]): number => (c[0] + c[2]) / 2 - c[1];
    ok(salt > grass + 60, `the salt flats lie white where the grass lies green (${salt} and ${grass} light)`);
    ok(purple(bloom) > purple(sowing) + 8, `the heather flowers purple at Harvest (${Math.round(purple(bloom))} purple, ${Math.round(purple(sowing))} in Sowing)`);
    ok(high[2] > high[0] + 20 && low[0] >= low[2], `tidal ground is wet sand at low water and the sea at high (${low.map(Math.round).join(',')} at noon, ${high.map(Math.round).join(',')} at five)`);
  }
  {
    const { ash, grass, embers, ice, frost, snowed } = terrains.ground;
    ok(ash < grass - 25, `the ash lies dark where the grass lies green (${ash} and ${grass} light)`);
    ok(embers['summer@0'] > 0 && embers['winter@0'] > 0 && embers['summer@12'] === 0 && embers['snow@0'] === 0, `by night an ember glows in the ash here and there and by day none does; a deep snow puts them out (${embers['summer@0']} and ${embers['winter@0']} pixels by night, ${embers['summer@12']} at noon, ${embers['snow@0']} under snow)`);
    const iceLight = Math.round((ice[0] + ice[1] + ice[2]) / 3);
    ok(ice[2] > ice[0] + 10 && iceLight > grass + 40 && frost > iceLight + 10 && snowed >= frost, `the ice lies pale and blue, whiter in Frost than at Harvest and white under snow (${ice.map(Math.round).join(',')} at Harvest, ${frost} light in Frost, ${snowed} under snow)`);
    // The steppe (#543): tawny at Harvest where the grass is green, and greener in Sowing; the dunes
    // lie lighter than it and warm.
    const { steppe, sowing, dunes } = terrains.wold, green = (c: number[]): number => c[1] - c[0], light = (c: number[]): number => Math.round((c[0] + c[1] + c[2]) / 3);
    ok(steppe[0] > terrains.wold.grass[0] + 40 && green(sowing) > green(steppe) + 15, `the steppe lies tawny at Harvest where the grass lies green, and greener in Sowing (${steppe.map(Math.round).join(',')} at Harvest, ${sowing.map(Math.round).join(',')} in Sowing)`);
    ok(light(dunes) > light(steppe) + 5 && dunes[0] > dunes[2] + 60, `the dunes lie lighter than the steppe, and warm (${dunes.map(Math.round).join(',')} against ${light(steppe)} light)`);
  }
  // Each region's trees (#1104): the woods and the pinewoods laid in the middle of the first of its zones on the
  // outdoors, at noon in summer, against its grass there, and held to the Foreland's lines. The party is set down
  // there and taken back without treading or seeing anything.
  const regions = await page.evaluate(async () => {
    const load: Load = (p) => import(p);
    const V = await load<typeof import('../../src/ui/viewport.ts')>('/src/ui/viewport.ts');
    const w = window.__game!.game!.world, W = 400, H = 268, { mapId, x: hx, y: hy, facing } = w.state, minutes = w.state.minutes;
    const c = document.createElement('canvas'), sky = document.createElement('canvas');
    c.width = sky.width = W; c.height = sky.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true })!, skyCtx = sky.getContext('2d')!;
    const out = Object.values(w.maps).find((m) => m.zones.length)!, rows: { region: string; woods: number[]; pine: number[] }[] = [];
    for (const region of Object.keys(w.tables.looks)) {
      const z = out.zones.find((q) => q.region === region && q.w >= 16 && q.h >= 16);
      if (!z) { rows.push({ region, woods: [], pine: [] }); continue; }
      const sx = z.x + (z.w >> 1), sy = z.y + (z.h >> 1), kept = new Map<number, Cell>();
      Object.assign(w.state, { mapId: out.id, x: sx, y: sy, facing: 0, minutes: ((50 - 75 + 120) % 120) * 1440 + 12 * 60 });
      w['cached'] = { seed: w.state.weatherSeed!, minutes: w.state.minutes, region: w.region, weather: { cloud: 0.1, precip: 0, snow: 0, fog: 0, wind: 0, windDir: 0, storm: 0, temp: 12, cover: 0, wet: 0 } };
      const band = (terrain: Terrain): Uint8ClampedArray => {
        for (let y = sy - 6; y <= sy + 6; y++) for (let x = sx - 6; x <= sx + 6; x++) {
          const i = y * out.width + x;
          if (!kept.has(i)) kept.set(i, out.cells[i]);
          out.cells[i] = { terrain, solid: 'none', door: 'none', ch: '.' };
        }
        ctx.clearRect(0, 0, W, H); V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H });
        return ctx.getImageData(0, H / 2 - 60, W, 55).data;
      };
      // The share of the band the trees paint otherwise than the grass, and of the strip 24 wide up its middle.
      const grass = band('grass'), stand = (t: Uint8ClampedArray): number[] => {
        let risen = 0, blocked = 0, strip = 0;
        for (let i = 0; i < t.length; i += 4) {
          const differs = Math.abs(t[i] - grass[i]) + Math.abs(t[i + 1] - grass[i + 1]) + Math.abs(t[i + 2] - grass[i + 2]) > 30;
          if (differs) risen++;
          if (Math.abs((i / 4) % W - W / 2) < 12) { strip++; if (differs) blocked++; }
        }
        return [Math.round(1000 * risen / (t.length / 4)) / 10, Math.round(1000 * blocked / strip) / 10];
      };
      rows.push({ region, woods: stand(band('woods')), pine: stand(band('pine')) });
      for (const [i, cell] of kept) out.cells[i] = cell;
    }
    Object.assign(w.state, { mapId, x: hx, y: hy, facing, minutes }); w['cached'] = null;
    return rows;
  });
  const fell = (k: 'woods' | 'pine', least: number) => regions.filter((r) => !(r[k][0] >= least && r[k][1] <= PATH_MAX)).map((r) => r.region);
  const each = (k: 'woods' | 'pine') => regions.map((r) => `${r.region} ${r[k].join('%/')}%`).join(', ');
  ok(regions.length > 0 && fell('woods', 10).length === 0, `trees stand about the woods in each region, its own, and the way ahead stays open (of the band over the horizon and the strip ahead: ${each('woods')}; at least 10% and at most ${PATH_MAX}%${fell('woods', 10).length ? '; not: ' + fell('woods', 10).join(', ') : ''})`);
  ok(regions.length > 0 && fell('pine', PINE_MIN).length === 0, `pines stand about the pinewoods in each region, its own, and the way ahead stays open (${each('pine')}; at least ${PINE_MIN}% and at most ${PATH_MAX}%${fell('pine', PINE_MIN).length ? '; not: ' + fell('pine', PINE_MIN).join(', ') : ''})`);
  // The country past the zones: the squares of the outdoors no zone holds look as the atlas paints them, forests,
  // pinewoods and dead wood among them, and name no region (so no look): a company at a zone's edge looking out on
  // each paints them, the trees today's mix, and does not throw (#1104).
  const beyond = await page.evaluate(async () => {
    const load: Load = (p) => import(p);
    const V = await load<typeof import('../../src/ui/viewport.ts')>('/src/ui/viewport.ts');
    const w = window.__game!.game!.world, { mapId, x: hx, y: hy, facing, minutes } = w.state;
    const out = Object.values(w.maps).find((m) => m.zones.length)!, W = 400, H = 268, seen = new Set<string>();
    const c = document.createElement('canvas'), sky = document.createElement('canvas');
    c.width = sky.width = W; c.height = sky.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true })!, skyCtx = sky.getContext('2d')!;
    const dirs: [number, number, number][] = [[0, -1, 0], [1, 0, 1], [0, 1, 2], [-1, 0, 3]];
    for (let y = 0; y < out.height && seen.size < 4; y++) for (let x = 0; x < out.width && seen.size < 4; x++) {
      if (out.zoneAt(x, y)) continue;
      const cell = out.at(x, y), look = cell.look ?? cell, kind = look.solid === 'tree' ? 'tree' : look.terrain;
      if (!['tree', 'woods', 'pine', 'deadwood'].includes(kind) || seen.has(kind)) continue;
      // Two squares off, on open ground of a zone, facing it.
      for (const [dx, dy, f] of dirs) {
        const px = x - dx * 2, py = y - dy * 2;
        if (!out.inBounds(px, py) || !out.zoneAt(px, py) || out.at(px, py).solid !== 'none') continue;
        Object.assign(w.state, { mapId: out.id, x: px, y: py, facing: f, minutes: 12 * 60 }); w['cached'] = null;
        ctx.clearRect(0, 0, W, H); V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H });
        seen.add(kind); break;
      }
    }
    Object.assign(w.state, { mapId, x: hx, y: hy, facing, minutes }); w['cached'] = null;
    return [...seen];
  });
  ok(beyond.length === 4, `a company at a zone's edge looking out on the country past the zones paints its trees, which name no region (${beyond.join(', ')})`);
}

// A torch behind a tree and behind a monster: a sconced wall three squares ahead on the Foreland at
// noon, the ground before it cleared, with a tree or an ogre on the square before it. A flame the
// tree covers goes out; one the ogre stands before is drawn behind it.
export async function torches({ page, ok }: Run): Promise<void> {
  const torches = await page.evaluate(async () => {
    const load: Load = (p) => import(p);
    const V = await load<typeof import('../../src/ui/viewport.ts')>('/src/ui/viewport.ts');
    const w = window.__game!.game!.world;
    const W = 400, H = 268, c = document.createElement('canvas'), sky = document.createElement('canvas');
    c.width = sky.width = W; c.height = sky.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true })!, skyCtx = sky.getContext('2d')!;
    const minutes = w.state.minutes;
    w.travel('shelf', 16, 16, 0);
    w.state.minutes = 50 * 1440 + 12 * 60;
    w['cached'] = { seed: w.state.weatherSeed!, minutes: w.state.minutes, region: w.region, weather: { cloud: 0.1, precip: 0, snow: 0, fog: 0, wind: 0, windDir: 0, storm: 0, temp: 12, cover: 0, wet: 0 } };
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
      return { flames: V.paintedFlames().map((f) => ({ x: f.x, y: f.y })), px: ctx.getImageData(0, 0, W, H).data };
    };
    const differs = (a: Uint8ClampedArray, b: Uint8ClampedArray, x: number, y: number): boolean => { const i = (Math.floor(y) * W + Math.floor(x)) * 4; return Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 0; };
    // The first square, of a bounded search, whose wall ahead hangs a sconce the tree stands before:
    // with the tree there, that torch's point is painted otherwise than without it.
    let found: { at: [number, number]; bare: ReturnType<typeof paint>; tree: ReturnType<typeof paint> } | null = null;
    for (let y = 16, tries = 0; !found && y < m.height - 7 && tries < 400; y += 13) for (let x = 7; !found && x < m.width - 7 && tries < 400; x++) {
      // A square of the Foreland, whose sky is the one fixed above: a square no zone holds has no sky to paint (#945).
      if (m.zoneAt(x, y)?.region !== 'shelf') continue;
      lay(x, y, 'none');
      if (V.wallDressing(m, x, y - 3) === 'sconce') {
        tries++;
        w.state.x = x; w.state.y = y; w.state.facing = 0;
        const bare = paint(x, y, 'none'), tree = paint(x, y, 'tree');
        if (bare.flames.some((f) => f.x >= 0 && f.x < W && differs(tree.px, bare.px, f.x, f.y))) found = { at: [x, y], bare, tree };
      }
      for (let i = 0; i < kept.length; i++) m.cells[i] = kept[i];
    }
    const done = (): void => { for (let i = 0; i < kept.length; i++) m.cells[i] = kept[i]; w.state.minutes = minutes; w['cached'] = null; };
    if (!found) { done(); return { missing: 'no square of the Foreland faces a sconced wall a tree before it hides', lit: 0, out: 0, over: 0, behind: false, shown: false, covers: false }; }
    const { at, bare, tree } = found;
    w.state.x = at[0]; w.state.y = at[1];
    // A flame over the tree: its point painted otherwise with the tree there than without.
    const over = tree.flames.filter((f) => differs(tree.px, bare.px, f.x, f.y)).length;
    const hidden = bare.flames.filter((f) => f.x >= 0 && f.x < W && differs(tree.px, bare.px, f.x, f.y)), out = hidden.length;
    // The ogre, on the square before the wall, drawn a frame with its flames and the same frame without.
    lay(at[0], at[1], 'none');
    const ogre: Who = [{ id: 'ogre', sprite: 'ogre', tint: '#7a8a5a', size: 1.25 }];
    const frame = (who: Who, lit: boolean): Uint8ClampedArray => {
      const flames = V.paintedFlames() as Flame[], was = flames.slice();
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
  ok(!torches.missing && torches.lit > 0 && torches.out > 0 && torches.over === 0, `a tree before a sconced wall puts out the torches it covers (${torches.missing || `${torches.lit} alight, ${torches.out} under the tree, ${torches.over} still drawn over it`})`);
  ok(torches.shown && torches.covers && torches.behind, `an ogre before a sconced wall stands in front of its torch's flame (flame shown ${torches.shown}, ogre over it ${torches.covers}, flame behind the ogre ${torches.behind})`);
}

// The Sunder: on the Foreland at noon, the ground cleared, a chasm two squares deep across the view
// one ahead, and a glass tree either side of the way beyond it. Straight ahead, the chasm paints
// darker than grass, its far wall under the rim lighter than the drop; the glass trees stand over
// the horizon, bluer than they are red.
export async function sunder({ page, ok }: Run): Promise<void> {
  const sunder = await page.evaluate(async () => {
    const load: Load = (p) => import(p);
    const V = await load<typeof import('../../src/ui/viewport.ts')>('/src/ui/viewport.ts'), M = await load<typeof import('../../src/game/map.ts')>('/src/game/map.ts');
    const w = window.__game!.game!.world;
    const W = 400, H = 268, c = document.createElement('canvas'), sky = document.createElement('canvas');
    c.width = sky.width = W; c.height = sky.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true })!, skyCtx = sky.getContext('2d')!;
    const minutes = w.state.minutes;
    w.travel('shelf', 16, 16, 0);
    w.state.minutes = 50 * 1440 + 12 * 60;
    w['cached'] = { seed: w.state.weatherSeed!, minutes: w.state.minutes, region: w.region, weather: { cloud: 0.1, precip: 0, snow: 0, fog: 0, wind: 0, windDir: 0, storm: 0, temp: 12, cover: 0, wet: 0 } };
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
    w.state.minutes = minutes; w['cached'] = null;
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
  ok(sunder.rows > 20 && sunder.drop > 40 && sunder.wall > 20, `a chasm paints darker than grass, its far wall under the rim lighter than the drop (${sunder.rows} rows straight ahead, ${sunder.drop} darker than grass in the lower half; the wall ${sunder.wall} lighter than the foot)`);
  ok(sunder.glass > 200 && sunder.bluer, `glass trees stand over the horizon beyond the chasm, bluer than red (${sunder.glass} pixels, ${sunder.bluer ? 'bluer' : 'not bluer'})`);
}

// A smooth wall (#199): a dungeon corridor two squares long, lit, its sides and its end wall laid
// around the party. Drawn in the dungeon's stone, its end face and a side face show courses; drawn
// smooth, each is one colour down its height, with no joint in it, and a door in it is its seam.
export async function smooth({ page, ok }: Run): Promise<void> {
  const smooth = await page.evaluate(async () => {
    const load: Load = (p) => import(p);
    const V = await load<typeof import('../../src/ui/viewport.ts')>('/src/ui/viewport.ts'), M = await load<typeof import('../../src/game/map.ts')>('/src/game/map.ts');
    const w = window.__game!.game!.world;
    const W = 400, H = 268, c = document.createElement('canvas'), sky = document.createElement('canvas');
    c.width = sky.width = W; c.height = sky.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true })!, skyCtx = sky.getContext('2d')!;
    const from = { id: w.state.mapId, x: w.state.x, y: w.state.y, f: w.state.facing, light: w.state.light };
    w.travel('grove1', 6, 6, 0);
    w.state.light = 50;
    const m = w.map, kept = m.cells.slice(), style = m.palette.wallStyle, px = w.state.x, py = w.state.y;
    for (let y = py - 4; y <= py + 1; y++) for (let x = px - 3; x <= px + 3; x++) {
      const ch = x === px && y >= py - 2 ? '.' : '#';
      if (m.inBounds(x, y)) m.cells[y * m.width + x] = { ...M.LEGEND[ch], ch };
    }
    /** Distinct colours down a column of the view, from y0 to y1. */
    const column = (x: number, y0: number, y1: number): number => {
      const d = ctx.getImageData(x, y0, 1, y1 - y0).data, seen = new Set<number>();
      for (let i = 0; i < d.length; i += 4) seen.add((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]);
      return seen.size;
    };
    /** Distinct colours in a box of the view. */
    const box = (x0: number, y0: number, x1: number, y1: number): number => {
      const d = ctx.getImageData(x0, y0, x1 - x0, y1 - y0).data, seen = new Set<number>();
      for (let i = 0; i < d.length; i += 4) seen.add((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]);
      return seen.size;
    };
    const paint = (wallStyle: MapPalette['wallStyle']): { end: number; side: number; middle: number } => {
      m.palette.wallStyle = wallStyle;
      ctx.clearRect(0, 0, W, H); V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H });
      return { end: column(W / 2, H / 2 - 12, H / 2 + 12), side: column(Math.round(W * 0.08), H / 2 - 30, H / 2 + 30), middle: box(W / 2 - 8, H / 2, W / 2 + 8, H / 2 + 12) };
    };
    const stone = paint('stone'), flat = paint('smooth');
    // A door in the end wall: in stone its planks and bands, smooth only its seam, across its head.
    m.cells[(py - 3) * m.width + px] = { ...M.LEGEND.D, ch: 'D' };
    const door = paint('stone').middle, seam = paint('smooth').middle;
    m.palette.wallStyle = style;
    for (let i = 0; i < kept.length; i++) m.cells[i] = kept[i];
    w.travel(from.id, from.x, from.y, from.f); w.state.light = from.light;
    return { stone, flat, door, seam };
  });
  ok(smooth.stone.end > 2 && smooth.stone.side > 2 && smooth.flat.end === 1 && smooth.flat.side === 1, `a smooth wall is one colour down its face, end and side, where stone shows its courses (stone ${smooth.stone.end} and ${smooth.stone.side} colours, smooth ${smooth.flat.end} and ${smooth.flat.side})`);
  ok(smooth.door > 2 && smooth.seam === 1, `a door in a smooth wall is its seam alone, where in stone it is planks and bands (smooth, ${smooth.seam} colour in its middle; in stone, ${smooth.door})`);
}

// Crowness Light (#312), from E3's road eleven squares north of it and from Gullwick's beach in F3,
// far past the squares drawn: by noon the tower stands over the land, painted otherwise than with no
// landmark there, its lamp unlit; by night the lamp is dark until the oil is in and lit after, and a
// frame drawn after the oil goes in repaints the scene with it. Then a fixture lighthouse on the
// Foreland with a wall beside its beam: the beam never shows over the wall.
export async function lighthouse({ page, ok }: Run): Promise<void> {
  const lighthouse = await page.evaluate(async () => {
    const load: Load = (p) => import(p);
    const V = await load<typeof import('../../src/ui/viewport.ts')>('/src/ui/viewport.ts');
    const w = window.__game!.game!.world;
    const W = 400, H = 268, c = document.createElement('canvas'), sky = document.createElement('canvas');
    c.width = sky.width = W; c.height = sky.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true })!, skyCtx = sky.getContext('2d')!;
    const minutes = w.state.minutes, flags = { ...w.party.flags };
    const clear = (hour: number, sky: Record<string, number> = {}): void => {
      w.state.minutes = Math.floor(minutes / 1440) * 1440 + hour * 60;
      w['cached'] = { seed: w.state.weatherSeed!, minutes: w.state.minutes, region: w.region, weather: { cloud: 0.1, precip: 0, snow: 0, fog: 0, wind: 0, windDir: 0, storm: 0, temp: 12, cover: 0, wet: 0, ...sky } };
    };
    // Cleared first: the sky shows through what the scene leaves unpainted, and a paint before would show in it.
    const paint = (): Uint8ClampedArray => { ctx.clearRect(0, 0, W, H); V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H }); return ctx.getImageData(0, 0, W, H / 2).data; };
    const lamps = (): number => V.paintedFlames().filter((f) => f.lamp).length;
    const out: Record<string, { tower: number; day: number; dark: number; lit: number; drawn: number }> = {};
    const view = (): void => V.drawViewport(ctx, w, { x: 0, y: 0, w: W, h: H }, () => null, 71, false);
    for (const [name, zone, x, y, f] of [['road', 'downs_e3', 20, 17, 2], ['Gullwick', 'downs_f3', 6, 14, 3]] as const) {
      w.travel(zone, x, y, f);
      clear(12);
      const m = w.map, kept = m.landmarks, withIt = paint(), day = lamps();
      (m as { landmarks: readonly Landmark[] }).landmarks = []; const without = paint(); (m as { landmarks: readonly Landmark[] }).landmarks = kept;
      let tower = 0;
      for (let i = 0; i < withIt.length; i += 4) if (Math.abs(withIt[i] - without[i]) + Math.abs(withIt[i + 1] - without[i + 1]) + Math.abs(withIt[i + 2] - without[i + 2]) > 30) tower++;
      clear(23); delete w.party.flags.q_oil_lit; paint(); const dark = lamps();
      w.party.flags.q_oil_lit = 1; paint(); const lit = lamps();
      // As played: a frame before the oil goes in, then one after, on the same square.
      delete w.party.flags.q_oil_lit; view(); w.party.flags.q_oil_lit = 1; view(); const drawn = lamps();
      out[name] = { tower, day, dark, lit, drawn };
    }
    // The weather that takes the fourth square takes the tower too, its lamp with it: from E3's road,
    // fog just short of it leaves the tower; fog at it, or a downpour, leaves nothing of it, by day or
    // by night lit.
    w.travel('downs_e3', 20, 17, 2);
    const towerIn = (sky: Record<string, number>): number => {
      clear(12, sky); const a = paint(); const m = w.map, kept = m.landmarks; (m as { landmarks: readonly Landmark[] }).landmarks = []; const b = paint(); (m as { landmarks: readonly Landmark[] }).landmarks = kept;
      let n = 0; for (let i = 0; i < a.length; i += 4) if (Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 30) n++;
      return n;
    };
    w.party.flags.q_oil_lit = 1;
    const weather = { thin: towerIn({ fog: 0.3 }), fog: towerIn({ fog: 0.35 }), rain: towerIn({ precip: 0.65 }), lamp: 0 };
    clear(23, { fog: 0.35 }); paint(); weather.lamp = lamps();
    // The fixture: the Foreland at 23:00, a lit lighthouse six squares north, and a wall one north and
    // one east, which stands over the beam's right-hand reach. Drawn at the frame the beam is longest
    // to the right, with its light and without: nothing changes over the wall, and something does
    // over the open sky between.
    w.travel('shelf', 16, 16, 0); clear(23);
    const m = w.map, px = w.state.x, py = w.state.y, cells = m.cells.slice(), kept = m.landmarks;
    for (let yy = py - 8; yy <= py + 1; yy++) for (let xx = px - 4; xx <= px + 4; xx++) m.cells[yy * m.width + xx] = { terrain: 'grass', solid: 'none', door: 'none', ch: ',' };
    m.cells[(py - 6) * m.width + px] = { terrain: 'floor', solid: 'building', door: 'none', ch: 'B' };
    m.cells[(py - 1) * m.width + px + 1] = { terrain: 'floor', solid: 'wall', door: 'none', ch: '#' };
    (m as { landmarks: readonly Landmark[] }).landmarks = [{ x: px, y: py - 6, kind: 'lighthouse' }];
    ctx.clearRect(0, 0, W, H); view();
    const lamp = V.paintedFlames().find((f) => f.lamp), lit = ctx.getImageData(0, 0, W, H).data;
    const flames = V.paintedFlames() as Flame[], was = flames.slice(); flames.length = 0;
    ctx.clearRect(0, 0, W, H); view(); const unlit = ctx.getImageData(0, 0, W, H).data; flames.push(...was);
    for (let i = 0; i < cells.length; i++) m.cells[i] = cells[i];
    (m as { landmarks: readonly Landmark[] }).landmarks = kept;
    // Over the wall: the columns from 300 right, where the wall's side face and front stand over the
    // lamp's row (its side's top edge crosses that row at about 284); the open sky: the columns
    // between the lamp and 250.
    let overWall = 0, overSky = 0;
    if (lamp) for (let y = Math.round(lamp.y) - 2; y <= Math.round(lamp.y) + 2; y++) for (let x = 0; x < W; x++) {
      const i = (y * W + x) * 4, differs = Math.abs(lit[i] - unlit[i]) + Math.abs(lit[i + 1] - unlit[i + 1]) + Math.abs(lit[i + 2] - unlit[i + 2]) > 6;
      if (!differs) continue;
      if (x >= 300) overWall++; else if (x > lamp.x + 10 && x < 250) overSky++;
    }
    const beam = { lamp: !!lamp, overWall, overSky };
    w.party.flags = flags; w.state.minutes = minutes; w['cached'] = null;
    return { views: out, weather, beam };
  });
  const { beam, weather, views } = lighthouse;
  ok(weather.thin > 100 && weather.fog === 0 && weather.rain === 0 && weather.lamp === 0, `the weather that takes the fourth square takes Crowness Light, its lamp with it (fog 0.3: ${weather.thin} pixels of tower; fog 0.35: ${weather.fog}; a downpour: ${weather.rain}; a lit lamp in fog by night: ${weather.lamp})`);
  for (const [name, v] of Object.entries(views)) ok(v.tower > 100 && v.day === 0 && v.dark === 0 && v.lit === 1 && v.drawn === 1, `Crowness Light stands over the land from ${name === 'road' ? "E3's road" : "Gullwick's beach"}, its lamp unlit by day, dark by night before the oil and lit after, and the frame after the oil goes in shows it (${v.tower} pixels of tower at noon; lamps ${v.day} by day, ${v.dark} then ${v.lit} by night, ${v.drawn} drawn)`);
  ok(beam.lamp && beam.overWall === 0 && beam.overSky > 0, `a lighthouse's beam shows over the open sky but never over a wall nearer than it (${beam.overSky} pixels of beam over the sky, ${beam.overWall} over the wall${beam.lamp ? '' : '; no lamp lit'})`);
}

// The second landmark kind and the tent (#736). On the Foreland, the land about cleared to grass, a
// building square six ahead (past the squares drawn) and then three ahead (among them) taken for a
// monastery, for a lighthouse and for no landmark: by noon the monastery stands over the land and is
// painted otherwise than the lighthouse; by night it lights no lamp where the lighthouse lights one.
// Then the square three ahead under felt ('tent') and under smooth: where the smooth wall's block
// stands, the tent's corners over its low wall show what is behind, and its crown stands over the
// block's top in the middle; a door in it is a flap, the doorway's dark showing under its turned-back
// corner, where in smooth it is its seam and in stone its planks.
export async function landmarks({ page, ok }: Run): Promise<void> {
  const drawn736 = await page.evaluate(async () => {
    const load: Load = (p) => import(p);
    const V = await load<typeof import('../../src/ui/viewport.ts')>('/src/ui/viewport.ts');
    const w = window.__game!.game!.world;
    const W = 400, H = 268, c = document.createElement('canvas'), sky = document.createElement('canvas');
    c.width = sky.width = W; c.height = sky.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true })!, skyCtx = sky.getContext('2d')!;
    const from = { id: w.state.mapId, x: w.state.x, y: w.state.y, f: w.state.facing }, minutes = w.state.minutes, flags = { ...w.party.flags };
    const clear = (hour: number): void => {
      w.state.minutes = Math.floor(minutes / 1440) * 1440 + hour * 60;
      w['cached'] = { seed: w.state.weatherSeed!, minutes: w.state.minutes, region: w.region, weather: { cloud: 0.1, precip: 0, snow: 0, fog: 0, wind: 0, windDir: 0, storm: 0, temp: 12, cover: 0, wet: 0 } };
    };
    // Painted afresh each time: the view's own cache keys on neither a landmark's kind, the cells nor the palette.
    const view = (): Uint8ClampedArray => { ctx.clearRect(0, 0, W, H); V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H }); return ctx.getImageData(0, 0, W, H).data; };
    const lamps = (): number => V.paintedFlames().filter((f) => f.lamp).length;
    const differ = (a: Uint8ClampedArray, b: Uint8ClampedArray, x: number, y: number): boolean => { const i = (y * W + x) * 4; return Math.abs(a[i] - b[i]) + Math.abs(a[i + 1] - b[i + 1]) + Math.abs(a[i + 2] - b[i + 2]) > 30; };
    const count = (a: Uint8ClampedArray, b: Uint8ClampedArray, y1: number): number => { let n = 0; for (let y = 0; y < y1; y++) for (let x = 0; x < W; x++) if (differ(a, b, x, y)) n++; return n; };
    w.travel('shelf', 16, 16, 0);
    const m = w.map, px = w.state.x, py = w.state.y, cells = m.cells.slice(), kept = m.landmarks;
    const grass: Cell = { terrain: 'grass', solid: 'none', door: 'none', ch: ',' }, building: Cell = { terrain: 'floor', solid: 'building', door: 'none', ch: 'B' };
    for (let yy = py - 8; yy <= py + 1; yy++) for (let xx = px - 4; xx <= px + 4; xx++) m.cells[yy * m.width + xx] = grass;
    const out: Record<string, { stands: number; unlike: number; dark: number; lit: number }> = {};
    for (const [name, ahead] of [['far', 6], ['near', 3]] as const) {
      m.cells[(py - ahead) * m.width + px] = building;
      const as = (kind: Landmark['kind'] | null): Uint8ClampedArray => { (m as { landmarks: readonly Landmark[] }).landmarks = kind ? [{ x: px, y: py - ahead, kind }] : []; return view(); };
      clear(12);
      const monastery = as('monastery'), lighthouse = as('lighthouse'), none = as(null);
      clear(23);
      as('monastery'); const dark = lamps(); as('lighthouse'); const lit = lamps();
      out[name] = { stands: count(monastery, none, H / 2), unlike: count(monastery, lighthouse, H), dark, lit };
      m.cells[(py - ahead) * m.width + px] = grass;
    }
    (m as { landmarks: readonly Landmark[] }).landmarks = [];
    // The tent three ahead, against the smooth wall's block and against open grass.
    clear(12);
    const at = (py - 3) * m.width + px, pal = m.paletteAt(px, py - 3), style = pal.wallStyle;
    const as = (wallStyle: MapPalette['wallStyle']): Uint8ClampedArray => { pal.wallStyle = wallStyle; return view(); };
    const none = view();
    m.cells[at] = building;
    const smooth = as('smooth'), tent = as('tent');
    // The block's top, up the middle column from the horizon, and its sides along the row under it.
    let top = H / 2, left = W / 2, right = W / 2;
    while (top > 0 && differ(smooth, none, W / 2, top - 1)) top--;
    while (left > 0 && differ(smooth, none, left - 1, top + 3)) left--;
    while (right < W - 1 && differ(smooth, none, right + 1, top + 3)) right++;
    const corners = [left + 3, right - 3].filter((x) => !differ(tent, none, x, top + 3)).length;
    let crown = 0;
    for (let y = 0; y < top; y++) for (let x = W / 2 - 2; x <= W / 2 + 2; x++) if (differ(tent, none, x, y)) crown++;
    // A door, with the building beside it whose door it is: the near-black pixels low on the doorway's
    // right, where a flap's corner is turned back.
    m.cells[at] = { terrain: 'floor', solid: 'none', door: 'door', ch: 'D' }; m.cells[at + 1] = building;
    const corner = (a: Uint8ClampedArray): number => { let n = 0; for (let y = H / 2 + 30; y < H / 2 + 38; y++) for (let x = W / 2 + 5; x < W / 2 + 15; x++) { const i = (y * W + x) * 4; if (a[i] + a[i + 1] + a[i + 2] < 60) n++; } return n; };
    const door = { tent: corner(as('tent')), smooth: corner(as('smooth')), stone: corner(as('stone')) };
    const tentOut = { block: right - left, top, corners, crown, door };
    pal.wallStyle = style;
    for (let i = 0; i < cells.length; i++) m.cells[i] = cells[i];
    (m as { landmarks: readonly Landmark[] }).landmarks = kept;
    w.travel(from.id, from.x, from.y, from.f);
    w.party.flags = flags; w.state.minutes = minutes; w['cached'] = null;
    return { far: out.far, near: out.near, tent: tentOut };
  });
  const { far, near, tent } = drawn736;
  for (const [name, v] of [['past the squares drawn', far], ['among them', near]] as const) ok(v.stands > 100 && v.unlike > 100 && v.dark === 0 && v.lit === 1, `a monastery stands over the land ${name}, painted otherwise than a lighthouse, and by night lights no lamp where a lighthouse lights one (${v.stands} pixels of it at noon, ${v.unlike} unlike the lighthouse; by night ${v.dark} lamps, the lighthouse ${v.lit})`);
  ok(tent.corners === 2 && tent.crown > 10, `a tent is no block: where the smooth wall's block stands (${tent.block} pixels across, its top at ${tent.top}), the corners over the tent's low wall are open (${tent.corners} of 2) and its crown stands over the block's top (${tent.crown} pixels)`);
  ok(tent.door.tent >= 20 && tent.door.smooth === 0 && tent.door.stone === 0, `a door in a tent is a flap, the doorway's dark showing under its turned-back corner, where a smooth wall's door is its seam and a stone wall's its planks (${tent.door.tent} dark pixels in the corner; smooth ${tent.door.smooth}, stone ${tent.door.stone})`);
}

// A group placed on ice (#536): on the Foreland at noon, ice laid all about, two fen eels two squares
// ahead drawn as the view draws a group. Under the ice they paint its floor and nothing over the
// horizon; the same pair not under it stands up over it.
export async function ice({ page, ok }: Run): Promise<void> {
  const iced = await page.evaluate(async () => {
    const load: Load = (p) => import(p);
    const V = await load<typeof import('../../src/ui/viewport.ts')>('/src/ui/viewport.ts'), M = await load<typeof import('../../src/game/map.ts')>('/src/game/map.ts');
    const w = window.__game!.game!.world;
    const W = 400, H = 268, c = document.createElement('canvas');
    c.width = W; c.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true })!;
    const minutes = w.state.minutes;
    w.travel('shelf', 16, 16, 0);
    // A minute no other check paints at, so the view's cached scene is painted afresh over the ice.
    w.state.minutes = 50 * 1440 + 12 * 60 + 7;
    w['cached'] = { seed: w.state.weatherSeed!, minutes: w.state.minutes, region: w.region, weather: { cloud: 0.1, precip: 0, snow: 0, fog: 0, wind: 0, windDir: 0, storm: 0, temp: 12, cover: 0, wet: 0 } };
    const m = w.map, kept = m.cells.slice(), px = w.state.x, py = w.state.y;
    for (let y = py - 7; y <= py + 2; y++) for (let x = px - 7; x <= px + 7; x++) m.cells[y * m.width + x] = { ...M.LEGEND.i, ch: 'i' };
    const pair = (under: boolean): NonNullable<Who> => [0, 1].map(() => ({ id: 'fen_eel', sprite: 'fen_eel', tint: '#3c4228', size: 0.75, ...(under ? { under: 'ice' } : {}) }));
    const frame = (who: Who): Uint8ClampedArray => {
      ctx.clearRect(0, 0, W, H); V.drawViewport(ctx, w, { x: 0, y: 0, w: W, h: H }, (x: number, y: number) => (x === px && y === py - 2 ? who : null), 40, false);
      return ctx.getImageData(0, 0, W, H).data;
    };
    const none = frame(null), under = frame(pair(true)), over = frame(pair(false));
    for (let i = 0; i < kept.length; i++) m.cells[i] = kept[i];
    w.state.minutes = minutes; w['cached'] = null;
    const differs = (a: Uint8ClampedArray, i: number): boolean => Math.abs(a[i] - none[i]) + Math.abs(a[i + 1] - none[i + 1]) + Math.abs(a[i + 2] - none[i + 2]) > 24;
    let below = 0, above = 0, standing = 0;
    for (let i = 0; i < none.length; i += 4) {
      const top = Math.floor(i / 4 / W) <= H / 2;
      if (differs(under, i)) { if (top) above++; else below++; }
      if (differs(over, i) && top) standing++;
    }
    return { below, above, standing };
  });
  ok(iced.below > 100 && iced.above === 0 && iced.standing > 100, `a group placed on ice is drawn under it, in the ice and nothing of it over the horizon, where the same group on the ice stands up over it (${iced.below} pixels in the ice, ${iced.above} over the horizon; standing, ${iced.standing} over it)`);
}

// Cliffs and peaks (#543): on the Foreland, grass laid all about, a mountain, a peak and a cliff each
// put two squares ahead in turn, as near as the night lets the view see, by day and by night in each season and under snow, and what each
// paints over the horizon read off against the grass alone. Each paints in every light; the peak
// stands taller and whiter than the mountain, the cliff is a sheer face, about as wide at its top as
// at its foot where the mountain and the peak narrow, the three are each their own colours, and a
// deep snow whitens the peak and the cliff.
export async function range({ page, ok }: Run): Promise<void> {
  const range = await page.evaluate(async () => {
    const load: Load = (p) => import(p);
    const V = await load<typeof import('../../src/ui/viewport.ts')>('/src/ui/viewport.ts'), M = await load<typeof import('../../src/game/map.ts')>('/src/game/map.ts');
    const w = window.__game!.game!.world;
    const W = 400, H = 268, c = document.createElement('canvas'), sky = document.createElement('canvas');
    c.width = sky.width = W; c.height = sky.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true })!, skyCtx = sky.getContext('2d')!;
    const minutes = w.state.minutes;
    w.travel('shelf', 16, 16, 0);
    const m = w.map, kept = m.cells.slice(), px = w.state.x, py = w.state.y, ahead = (py - 2) * m.width + px;
    for (let y = py - 6; y <= py + 1; y++) for (let x = px - 4; x <= px + 4; x++) m.cells[y * m.width + x] = { ...M.LEGEND[','], ch: ',' };
    const paint = (ch: string | null, doy: number, hour: number, snow: boolean): Uint8ClampedArray => {
      m.cells[ahead] = { ...M.LEGEND[ch ?? ','], ch: ch ?? ',' };
      w.state.minutes = ((doy - 75 + 120) % 120) * 1440 + hour * 60;
      w['cached'] = { seed: w.state.weatherSeed!, minutes: w.state.minutes, region: w.region, weather: { cloud: 0.1, precip: 0, snow: 0, fog: 0, wind: 0, windDir: 0, storm: 0, temp: snow ? -4 : 12, cover: snow ? 1 : 0, wet: 0 } };
      ctx.clearRect(0, 0, W, H); V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H });
      return ctx.getImageData(0, 0, W, H).data;
    };
    // Over the horizon only, down to above the floor of the square beyond, which the solid hides.
    const below = H / 2 + 20;
    const read = (a: Uint8ClampedArray, bare: Uint8ClampedArray) => {
      const rows = new Map<number, number[]>(), seen = new Set<number>(), sum = [0, 0, 0];
      let n = 0, hot = 0;
      for (let y = 0; y < below; y++) for (let x = 0; x < W; x++) {
        const i = (y * W + x) * 4;
        if (Math.abs(a[i] - bare[i]) + Math.abs(a[i + 1] - bare[i + 1]) + Math.abs(a[i + 2] - bare[i + 2]) <= 24) continue;
        n++; seen.add((a[i] << 16) | (a[i + 1] << 8) | a[i + 2]); sum[0] += a[i]; sum[1] += a[i + 1]; sum[2] += a[i + 2];
        // A fire's own light: a bright red-orange, which no rock and no sky is.
        if (a[i] > 200 && a[i] - a[i + 2] > 120) hot++;
        const r = rows.get(y) ?? [x, x]; r[0] = Math.min(r[0], x); r[1] = Math.max(r[1], x); rows.set(y, r);
      }
      const ys = [...rows.keys()].sort((p, q) => p - q), top = ys[0] ?? below, span = below - top;
      const width = (y: number): number => { const r = rows.get(Math.round(y)); return r ? r[1] - r[0] + 1 : 0; };
      const mean = sum.map((v) => (n ? v / n : 0));
      return { n, hot, colours: seen.size, top, mean, light: (mean[0] + mean[1] + mean[2]) / 3, sheer: width(top + span * 0.15) / Math.max(1, width(below - 1)) };
    };
    const kinds: [string, string][] = [['mountain', 'M'], ['peak', 'A'], ['cliff', '|'],
      ['volcano', 'V'], ['vent', '@']];
    // The fire's pixels by night, for the volcano and a vent (#543).
    const glow: Record<string, number> = {};
    const days: [string, number][] = [['spring', 20], ['summer', 50], ['autumn', 65], ['winter', 100], ['snow', 100]];
    const thin: string[] = [], at: Record<string, ReturnType<typeof read>> = {};
    for (const [name, doy] of days) for (const hour of [12, 0]) {
      const bare = paint(null, doy, hour, name === 'snow');
      for (const [kind, ch] of kinds) {
        const r = read(paint(ch, doy, hour, name === 'snow'), bare);
        if (r.n < 300 || r.colours < 4) thin.push(`${kind} ${name}@${hour} (${r.n} pixels, ${r.colours} colours)`);
        if (hour === 12) at[`${kind} ${name}`] = r;
        else glow[`${kind} ${name}`] = r.hot;
      }
    }
    for (let i = 0; i < kept.length; i++) m.cells[i] = kept[i];
    w.state.minutes = minutes; w['cached'] = null;
    const day = (kind: string) => { const r = at[`${kind} summer`]; return { top: r.top, light: Math.round(r.light), sheer: Math.round(r.sheer * 100) / 100, mean: r.mean.map(Math.round), winter: Math.round(at[`${kind} winter`].light), snowed: Math.round(at[`${kind} snow`].light) }; };
    return { thin, mountain: day('mountain'), peak: day('peak'), cliff: day('cliff'),
      volcano: { ...day('volcano'), fire: at['volcano summer'].hot, night: glow['volcano summer'] }, vent: { ...day('vent'), fire: at['vent summer'].hot, night: glow['vent summer'], snowedNight: glow['vent snow'] } };
  });
  const { mountain, peak, cliff } = range;
  ok(range.thin.length === 0, `a mountain, a peak, a cliff, the volcano and a vent paint by day and by night in each season and under snow${range.thin.length ? ' -> too faint: ' + range.thin.join(', ') : ''}`);
  ok(peak.top < mountain.top - 10 && peak.light > mountain.light + 20, `a peak stands taller and whiter than a mountain (its top at ${peak.top} against ${mountain.top}; ${peak.light} light against ${mountain.light})`);
  ok(cliff.sheer > 0.85 && mountain.sheer < 0.6 && peak.sheer < 0.6, `a cliff is a sheer face, as wide near its top as at its foot, where a mountain and a peak narrow (${cliff.sheer}, against ${mountain.sheer} and ${peak.sheer})`);
  const apart = (a: number[], b: number[]): number => Math.round(Math.hypot(a[0] - b[0], a[1] - b[1], a[2] - b[2]));
  const gaps = [apart(mountain.mean, peak.mean), apart(mountain.mean, cliff.mean), apart(peak.mean, cliff.mean)];
  ok(gaps.every((g) => g >= 20), `a mountain, a peak and a cliff are each their own colours (${gaps.join(', ')} apart: mountain and peak, mountain and cliff, peak and cliff)`);
  ok(peak.snowed > peak.winter + 10 && cliff.snowed > cliff.winter + 5, `a deep snow whitens the peak and the cliff (${peak.winter} to ${peak.snowed} light, and ${cliff.winter} to ${cliff.snowed})`);
  // The volcano and a vent in it (#543): a cone darker than the mountain; a vent's fire dull by day
  // and bright by night, in snow too, and its smoke standing up over the cone.
  const { volcano, vent } = range;
  ok(volcano.light < mountain.light - 10 && volcano.mean[0] > volcano.mean[2] + 5, `the volcano stands black-red where the mountain stands grey (${volcano.light} light against ${mountain.light}; ${volcano.mean.join(',')})`);
  ok(vent.night > 20 && vent.snowedNight > 20 && vent.fire === 0 && volcano.night === 0, `a vent's fire shows by night, under snow too, and not by day, and the cone about it has none (${vent.night} and ${vent.snowedNight} pixels by night, ${vent.fire} at noon; the cone ${volcano.night})`);
  ok(vent.top < volcano.top - 8, `a vent's smoke stands up over the cone (its top at ${vent.top} against ${volcano.top})`);
}

// The wilderness features (#1110): on the Foreland, grass laid about and the features near taken up, each
// kind put two squares ahead in turn, painted by noon and midnight in summer and in winter with and without
// snow, and what each paints read off against the grass alone. Each kind paints in every light and is its
// own drawing; the night darkens all but a rift's light and a camp's fire, which is lit and leaves its flame;
// snow whitens what lies open. A spent chest, cairn, shrine, fountain or statue, an event, a person and a
// shrine not there yet paint nothing, as the automap marks none of them; a burnt den paints its ruin; a sign
// on a shrine's square stands beside it; over the smoke's backdrop they all stay out.
export async function features({ page, ok }: Run): Promise<void> {
  const r = await page.evaluate(async () => {
    const load: Load = (p) => import(p);
    const V = await load<typeof import('../../src/ui/viewport.ts')>('/src/ui/viewport.ts'), M = await load<typeof import('../../src/game/map.ts')>('/src/game/map.ts');
    const w = window.__game!.game!.world;
    const W = 400, H = 268, c = document.createElement('canvas'), sky = document.createElement('canvas');
    c.width = sky.width = W; c.height = sky.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true })!, skyCtx = sky.getContext('2d')!;
    const minutes = w.state.minutes;
    w.travel('shelf', 16, 16, 0);
    type F = (typeof w.map.features)[number];
    const m = w.map, kept = m.cells.slice(), had = m.features.slice(), list = m.features as F[], px = w.state.x, py = w.state.y, mapId = w.state.mapId;
    for (let y = py - 6; y <= py + 1; y++) for (let x = px - 4; x <= px + 4; x++) m.cells[y * m.width + x] = { ...M.LEGEND[','], ch: ',' };
    const near = (f: F): boolean => Math.abs(f.x - px) <= 4 && f.y >= py - 9 && f.y <= py + 1;
    list.splice(0, list.length, ...had.filter((f) => !near(f)));
    const base = list.length;
    const fixture = (kind: string, more: object = {}): F => ({ kind, x: px, y: py - 2, id: `fx_feature_${kind}`, name: 'Fixture', text: 'A fixture.', done: 'Done.', gold: 0, items: [], lines: [], ...more }) as unknown as F;
    const paint = (fs: F[], doy: number, hour: number, snow: boolean, backdrop?: string): Uint8ClampedArray => {
      list.length = base; list.push(...fs);
      w.state.minutes = ((doy - 75 + 120) % 120) * 1440 + hour * 60;
      w['cached'] = { seed: w.state.weatherSeed!, minutes: w.state.minutes, region: w.region, weather: { cloud: 0.1, precip: 0, snow: 0, fog: 0, wind: 0, windDir: 0, storm: 0, temp: snow ? -4 : 12, cover: snow ? 1 : 0, wet: 0 } };
      ctx.clearRect(0, 0, W, H); V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H }, backdrop);
      return ctx.getImageData(0, 0, W, H).data;
    };
    // What a paint shows that the grass alone does not: how many pixels, their colours and light, and which
    // pixels they are. Pale is the white of lying snow, which no feature's own colours are.
    const pale = (a: Uint8ClampedArray, i: number): boolean => Math.min(a[i], a[i + 1], a[i + 2]) > 160 && Math.max(a[i], a[i + 1], a[i + 2]) - Math.min(a[i], a[i + 1], a[i + 2]) < 12;
    const read = (a: Uint8ClampedArray, bare: Uint8ClampedArray) => {
      const seen = new Set<number>(), at = new Set<number>();
      let n = 0, light = 0;
      for (let i = 0; i < a.length; i += 4) {
        if (Math.abs(a[i] - bare[i]) + Math.abs(a[i + 1] - bare[i + 1]) + Math.abs(a[i + 2] - bare[i + 2]) <= 24) continue;
        n++; at.add(i); seen.add((a[i] << 16) | (a[i + 1] << 8) | a[i + 2]); light += (a[i] + a[i + 1] + a[i + 2]) / 3;
      }
      return { n, colours: seen.size, light: n ? Math.round(light / n) : 0, at, a };
    };
    const kinds = ['cairn', 'chest', 'camp', 'shrine', 'well', 'statue', 'fountain', 'den', 'sign', 'rift'];
    const lights: [string, number, number, boolean][] = [['noon', 50, 12, false], ['midnight', 50, 0, false], ['winter', 100, 12, false], ['snow', 100, 12, true], ['snowy midnight', 100, 0, true]];
    const thin: string[] = [], got: Record<string, ReturnType<typeof read>> = {}, flames: Record<string, number> = {};
    for (const [name, doy, hour, snow] of lights) {
      const bare = paint([], doy, hour, snow), bareFlames = V.paintedFlames().length;
      for (const kind of kinds) {
        const q = read(paint([fixture(kind)], doy, hour, snow), bare);
        flames[`${kind} ${name}`] = V.paintedFlames().length - bareFlames;
        if (q.n < 150 || q.colours < 4) thin.push(`${kind} ${name} (${q.n} pixels, ${q.colours} colours)`);
        got[`${kind} ${name}`] = q;
      }
    }
    // Snow on each: the pale pixels among those the feature paints on a winter's noon, without snow and
    // with it lying (a cap of snow on the ground behind it is no other than the ground).
    const whitened: Record<string, [number, number]> = {};
    for (const kind of kinds) {
      const mask = got[`${kind} winter`].at, count = (a: Uint8ClampedArray): number => { let p = 0; for (const i of mask) if (pale(a, i)) p++; return p; };
      whitened[kind] = [count(got[`${kind} winter`].a), count(got[`${kind} snow`].a)];
    }
    // Each kind its own drawing: the pixels any two paint otherwise, by noon.
    const apart: string[] = [];
    for (const a of kinds) for (const b of kinds) if (a < b) {
      const A = got[`${a} noon`].at, B = got[`${b} noon`].at;
      let only = 0; for (const i of A) if (!B.has(i)) only++; for (const i of B) if (!A.has(i)) only++;
      apart.push(`${a}/${b} ${only}`);
    }
    // Gone and never drawn, as the automap marks them: each spent kind spent, an event, a person and a shrine
    // not there until a used id holds; and a den burnt, its ruin.
    const bare = paint([], 50, 12, false), none: Record<string, number> = {};
    for (const kind of ['chest', 'cairn', 'shrine', 'fountain', 'statue']) {
      w.mapState.used[`fx_feature_${kind}`] = 1;
      none[`a spent ${kind}`] = read(paint([fixture(kind)], 50, 12, false), bare).n;
      delete w.mapState.used[`fx_feature_${kind}`];
    }
    none['an event'] = read(paint([fixture('event')], 50, 12, false), bare).n;
    none['a person'] = read(paint([fixture('npc')], 50, 12, false), bare).n;
    const later = fixture('shrine', { after: { seen: `${mapId}:fx_feature_later` } });
    none['a shrine not there yet'] = read(paint([later], 50, 12, false), bare).n;
    w.mapState.used.fx_feature_later = 1;
    const come = read(paint([later], 50, 12, false), bare).n;
    delete w.mapState.used.fx_feature_later;
    const standing = paint([fixture('den')], 50, 12, false);
    w.mapState.used.fx_feature_den = 1;
    const ruin = read(paint([fixture('den')], 50, 12, false), bare), ruinApart = read(paint([fixture('den')], 50, 12, false), standing).n;
    delete w.mapState.used.fx_feature_den;
    const shrine = got['shrine noon'].n, beside = read(paint([fixture('shrine'), fixture('sign')], 50, 12, false), bare).n;
    const backBare = paint([], 50, 0, false, '#ff00ff'), backdrop = read(paint(kinds.map((k) => ({ ...fixture(k), x: px + (k.length % 3) - 1 })), 50, 0, false, '#ff00ff'), backBare).n;
    list.splice(0, list.length, ...had);
    for (let i = 0; i < kept.length; i++) m.cells[i] = kept[i];
    w.state.minutes = minutes; w['cached'] = null;
    const brief = (k: string) => { const q = got[k]; return { n: q.n, light: q.light }; };
    return { thin, apart, none, come, ruin: ruin.n, ruinApart, shrine, beside, backdrop, flames, whitened, at: Object.fromEntries(Object.keys(got).map((k) => [k, brief(k)])) };
  });
  const kinds = ['cairn', 'chest', 'camp', 'shrine', 'well', 'statue', 'fountain', 'den', 'sign', 'rift'];
  ok(r.thin.length === 0, `each kind of feature paints by noon and midnight, in summer and in winter, with and without snow${r.thin.length ? ' -> too faint: ' + r.thin.join(', ') : ''}`);
  const close = r.apart.filter((s) => Number(s.split(' ')[1]) < 150);
  ok(close.length === 0, `each kind of feature is its own drawing: any two paint 150 pixels or more otherwise (the least ${r.apart.map((s) => Number(s.split(' ')[1])).sort((a, b) => a - b)[0]})${close.length ? ' -> too alike: ' + close.join(', ') : ''}`);
  const day = (k: string, light: string) => r.at[`${k} ${light}`];
  const dimmed = kinds.filter((k) => k !== 'camp' && k !== 'rift').filter((k) => day(k, 'midnight').light > day(k, 'noon').light * 0.6);
  ok(dimmed.length === 0 && day('rift', 'midnight').light > day('rift', 'noon').light * 0.8, `the night darkens each feature but a rift's light, which it barely dims (${kinds.map((k) => `${k} ${day(k, 'noon').light} to ${day(k, 'midnight').light}`).join(', ')})${dimmed.length ? ' -> not darker: ' + dimmed.join(', ') : ''}`);
  const fires = kinds.filter((k) => r.flames[`${k} noon`] || r.flames[`${k} winter`] || r.flames[`${k} snow`] || (k !== 'camp' && (r.flames[`${k} midnight`] || r.flames[`${k} snowy midnight`])));
  ok(r.flames['camp midnight'] === 1 && r.flames['camp snowy midnight'] === 1 && fires.length === 0, `a camp's fire is lit by night, in snow too, and leaves its flame; by day it is out, and nothing else leaves one (${r.flames['camp midnight']} and ${r.flames['camp snowy midnight']} by night, ${r.flames['camp noon']} by noon)${fires.length ? ' -> a flame from: ' + fires.join(', ') : ''}`);
  const unwhite = kinds.filter((k) => k !== 'rift').filter((k) => r.whitened[k][1] < 8 || r.whitened[k][0] > 0);
  ok(unwhite.length === 0, `snow whitens what lies open on each feature but a rift, which shows nothing so pale without it (${kinds.filter((k) => k !== 'rift').map((k) => `${k} ${r.whitened[k][0]} to ${r.whitened[k][1]}`).join(', ')} pale pixels)${unwhite.length ? ' -> not so: ' + unwhite.join(', ') : ''}`);
  const drawn = Object.entries(r.none).filter(([, n]) => n > 0);
  ok(drawn.length === 0 && r.come >= 150, `${Object.keys(r.none).join(', ')} paint nothing, as the automap marks none of them, and the shrine paints once there (${r.come} pixels)${drawn.length ? ' -> drawn: ' + drawn.map(([k, n]) => `${k} ${n}`).join(', ') : ''}`);
  ok(r.ruin >= 150 && r.ruinApart >= 100, `a den burnt paints its ruin, otherwise than the den standing (${r.ruin} pixels, ${r.ruinApart} of them otherwise)`);
  ok(r.beside > r.shrine + 100, `a sign on a shrine's square stands beside it and both paint (${r.beside} pixels against the shrine's ${r.shrine})`);
  ok(r.backdrop === 0, `over the smoke's backdrop every kind stays out, as the billboards do (${r.backdrop} pixels)`);
}
