// The smoke's crack sweep (#953, #1006): the sweep that paints the plan (tools/kit/sweep.ts) in the page, and
// its two parts: `cracks`, the ground's samples, the cellar, Helmstow and its keep one way on every run and
// the maps asked all four ways unless the sweep job sweeps them (SMOKE_PART=rest); and `sweep`, the four-way
// sweep alone that SMOKE_PART=sweep runs, a shard of it in each of the sweep job's jobs.
import type { Load, Page } from '../kit/browser.ts';
import type { View } from '../kit/sweep.ts';
import { GROUND_SAMPLES } from '../grounds.ts';
import type { MapDef } from '../../src/game/map.ts';
import type { Run, Sweep } from './boot.ts';

const FLOOR = ['mill', 'harrow', 'keep'];

// The walls meet without a crack. A view is painted twice, over two flat backdrops, and wherever the
// two differ the backdrop shows through. Along the horizon only walls and hills can be (the floor starts
// 24px below it at the far end of the view, and the billboards stay out over a backdrop), so there
// backdrop with solid wall either side of it is a crack between two faces. The sky between two hills'
// crests narrows to a point where they cross, a notch and not a crack, so a crack is kept only if the
// view painted with its hills laid flat shows it too: a crack between two faces does not depend on the
// hills. That passes anything drawn as part of a hill, so the check after the sweep holds a hill's body
// to its outline. And where walls stand on both hands of the party the edges of the view are wall:
// those once went undrawn. A cell is read as the view draws it (`drawnCell`, and the void as its look,
// #829): a void drawn as a hill is laid flat with the hills, and the ring's mountain beside the party is
// a billboard and no wall, which the check of the world's end looks at instead. A zone of the outdoors
// is walked over its own squares.
// The views are the plan's (tools/kit/sweep.ts, planned here in the page), the shard of it SMOKE_SHARD
// names. A view whose flat window holds nothing to paint is skipped; each window is painted flat once,
// from its first view; the view with its hills is painted where that flat band shows a gap between two
// faces or a wall stands beside the party, which is where the verdict reads it. The sweep sets its own
// scene, whatever the flows left: the light of a spell, and in each region the first clear noon with
// nothing the view would wash over it from the hour it starts, as the end of the world is faced in
// the edge part, so that every square of the window is in sight; it puts the hour back after, and leaves
// the party where the old sweep did. SMOKE_SWEEP_AUDIT=1 paints every view the old way as well, its view
// and its flat view, and counts the views the two judge differently, the skipped views whose flat band
// paints over the backdrop and the windows whose views differ in it.
type Swept = { views: number; maps: number; skipped: number; windows: number; painted: number; short: number; bad: string[]; audit?: { differ: string[]; overSkip: number; split: number } };
const crackSweep = (page: Page, s: Sweep, maps: { id: string; all: boolean }[]): Promise<Swept> => page.evaluate(async ({ maps, i, n, audit }: { maps: { id: string; all: boolean }[]; i: number; n: number; audit: boolean }) => {
  const load: Load = (p) => import(p);
  const V = await load<typeof import('../../src/ui/viewport.ts')>('/src/ui/viewport.ts'), S = await load<typeof import('../kit/sweep.ts')>('/tools/kit/sweep.ts'), Wx = await load<typeof import('../../src/game/weather.ts')>('/src/game/weather.ts'), C = await load<typeof import('../../src/game/calendar.ts')>('/src/game/calendar.ts');
  const w = window.__game!.game!.world;
  const plan = S.plan(w, maps), views = S.shard(plan, i, n);
  const W = 400, H = 268, band = 16, rows = band * 2, bad: string[] = [], differ: string[] = [], split = new Set<number>();
  const c = document.createElement('canvas'); c.width = W; c.height = H;
  const ctx = c.getContext('2d', { willReadFrequently: true })!;
  // The sky goes to a canvas of its own and is never composited, so only the backdrop is behind the walls.
  const sky = document.createElement('canvas'); sky.width = W; sky.height = H;
  const skyCtx = sky.getContext('2d')!;
  const paint = (backdrop: string) => { ctx.clearRect(0, 0, W, H); V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H }, backdrop); return ctx.getImageData(0, H / 2 - band, W, rows).data; };
  // Where the backdrop shows in the band of a view: there its two paints differ.
  const pair = (): Uint8Array => {
    const a = paint('#ff00ff'), b = paint('#00ff00'), shows = new Uint8Array(W * rows);
    for (let j = 0; j < shows.length; j++) shows[j] = Math.abs(a[j * 4] - b[j * 4]) > 8 || Math.abs(a[j * 4 + 1] - b[j * 4 + 1]) > 8 ? 1 : 0;
    return shows;
  };
  // The same with the hills laid flat.
  const flat = (): Uint8Array => { const undo = S.layFlat(w.map); try { return pair(); } finally { undo(); } };
  const crackAt = (shows: Uint8Array, px: number, py: number) => shows[py * W + px] === 1 && [2, 3].some((s) => px >= s && px < W - s && !shows[py * W + px - s] && !shows[py * W + px + s]);
  const gapIn = (level: Uint8Array): boolean => { for (let py = 0; py < rows; py++) for (let px = 0; px < W; px++) if (crackAt(level, px, py)) return true; return false; };
  // The verdict on a view, the old sweep's: the first pixel where the backdrop shows between two faces
  // in the view and in it laid flat, or at the view's edge beside a wall (`standsAt`: a secret door among
  // the peaks is a peak, not a wall, and the void is its look, the ring's mountain no wall, #829).
  const judge = (shows: Uint8Array, level: Uint8Array | null, walled: (s: number) => boolean): string => {
    for (let py = 0; py < rows; py++) for (let px = 0; px < W; px++) {
      if (!shows[py * W + px]) continue;
      if ((level && crackAt(shows, px, py) && crackAt(level, px, py)) || (px < 6 && walled(-1)) || (px >= W - 6 && walled(1))) return `${px},${H / 2 - band + py}`;
    }
    return '';
  };
  const hour = w.state.minutes, noons = new Map<string, number>();
  let short = 0;
  const go = (v: View): void => {
    w.travel(v.id, v.x, v.y, v.f); w.state.light = 1;
    let at = noons.get(w.region);
    if (at === undefined) noons.set(w.region, (at = Wx.findWeather(w.state.weatherSeed!, hour, w.climate, (wx, min) => wx.precip < 0.02 && !V.washes(wx) && wx.cover === 0 && C.daylightAt(min) === 1, 24 * 480)));
    w.state.minutes = at! >= 0 ? at : hour;
    if (w.sight < 4) short++;
  };
  // A window's views one after another, its first view first: one flat band at a time.
  const order = views.map((_, j) => j).sort((a, b) => views[a].win - views[b].win || a - b);
  let windows = 0, painted = 0, overSkip = 0, cur = -1, level: Uint8Array = new Uint8Array(0), gap = false;
  for (const j of order) {
    const v = views[j], where = `${v.id} ${v.x},${v.y} facing ${v.f}`;
    if (v.win >= 0 && v.win !== cur) { cur = v.win; windows++; painted++; go(plan.views[plan.refs[cur]]); level = flat(); gap = gapIn(level); }
    const reads = v.win >= 0 && (gap || v.beside);
    if (!reads && !audit) continue;
    go(v);
    const stands = V.standsAt(w.map, w.state.x, w.state.y, v.f), walled = (s: number) => stands.solidAt(0, s), shows = pair();
    if (reads) painted++;
    const verdict = reads ? judge(shows, gap ? level : null, walled) : '';
    if (verdict) bad.push(`${where} at ${verdict}`);
    if (!audit) continue;
    const own = flat(), old = judge(shows, own, walled);
    if (old !== verdict) differ.push(`${where}: ${old || 'none'} against ${verdict || 'none'}`);
    if (v.win < 0) { if (own.includes(0)) overSkip++; }
    else if (own.some((x, k) => x !== level[k])) split.add(v.win);
  }
  const last = plan.views[plan.views.length - 1];
  if (last) { w.travel(last.id, last.x, last.y, last.f); w.state.light = 1; }
  w.state.minutes = hour;
  return { views: views.length, maps: plan.maps, skipped: views.filter((v) => v.win < 0).length, windows, painted, short, bad, audit: audit ? { differ, overSkip, split: split.size } : undefined };
}, { maps, i: s.shard.i, n: s.shard.n, audit: s.audit });
const sweepLine = (ok: Run['ok'], s: Sweep, r: Swept): void => {
  const { i, n } = s.shard;
  ok(r.bad.length === 0 && r.short === 0, `the walls meet without a crack, and the walls beside the party are drawn: ${n > 1 ? `shard ${i}/${n}, ` : ''}${r.views} views of ${r.maps} maps: ${r.skipped} skipped, ${r.windows} windows, ${r.painted} painted${r.short ? ` -> ${r.short} views seen short of four squares` : ''}${r.bad.length ? ` -> ${r.bad.length} views, ` + r.bad.slice(0, 4).join(', ') : ''}`);
  if (r.audit) ok(r.audit.differ.length + r.audit.overSkip + r.audit.split === 0, `the audit: the old sweep and the new judge all ${r.views} views alike, no skipped view's flat band paints over the backdrop and no window's views differ in it (${r.audit.differ.length} judged otherwise, ${r.audit.overSkip} skipped views painting, ${r.audit.split} windows differing)${r.audit.differ.length ? ' -> ' + r.audit.differ.slice(0, 4).join(', ') : ''}`);
};

// The ground's samples (tools/grounds.ts) are swept one way on every run, first, put into the game's maps
// for it and taken out after, so a ground no built map holds yet is swept too and the party ends where it
// did; then the cellar, Helmstow and its keep one way, and all four ways the maps asked for, unless the
// sweep job sweeps them (SMOKE_PART=rest).
export async function cracks({ page, ok, sweep: s }: Run): Promise<void> {
  await page.evaluate(async (defs: readonly MapDef[]) => {
    const load: Load = (p) => import(p);
    const M = await load<typeof import('../../src/game/map.ts')>('/src/game/map.ts'), w = window.__game!.game!.world;
    for (const d of defs) w.maps[d.id] = new M.GameMap(d);
  }, GROUND_SAMPLES);
  const four = s.four;
  const r = await crackSweep(page, s, [...GROUND_SAMPLES.map((d) => ({ id: d.id, all: false })), ...FLOOR.filter((id) => !four.includes(id)).map((id) => ({ id, all: false })), ...four.map((id) => ({ id, all: true }))]);
  await page.evaluate((ids: string[]) => { const w = window.__game!.game!.world; for (const id of ids) { delete w.maps[id]; delete w.state.maps[id]; } }, GROUND_SAMPLES.map((d) => d.id));
  sweepLine(ok, s, r);
}

// SMOKE_PART=sweep: the four-way sweep alone, on the new game just begun, and nothing else.
export async function sweep({ page, ok, sweep: s }: Run): Promise<void> {
  sweepLine(ok, s, await crackSweep(page, s, s.maps.map((id) => ({ id, all: true }))));
}
