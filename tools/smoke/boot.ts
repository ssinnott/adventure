// The smoke's frame (#1006): what every part of tools/smoke/ is given, the waits on the page's state a part
// takes after a key or a change, and the frame each part runs in. A part is a named function of the page,
// the pinned seed and the `ok` it is given: it makes its own state, measures and asserts together, and its
// ok: lines print with it. The runner (tools/smoke.ts) serves the tree, opens the page through the kit and
// runs the parts one after another, each in `frame`.
import type { Load, Page } from '../kit/browser.ts';
import type { Game, Screen } from '../../src/game/game.ts';
import type { CombatState } from '../../src/game/combat.ts';
import type { Cell, Feature, Landmark } from '../../src/game/mapdef.ts';
import type { World } from '../../src/game/world.ts';
import type { Input } from '../../src/input.ts';
import type { Flame } from '../../src/ui/viewport.ts';

// The page is read as the game it is (window.__game.game is a Game, types/globals.d.ts); these name the
// little more the smoke reaches into, all erased before the page sees it.
/** A screen on the stack as the smoke reads it: the fields of the screens it looks at, which Screen does not name. */
export type Shown = Screen & { seed?: number; options?: string[]; words?: string; text?: string; title?: string; ready?: boolean; ending?: { title: string };
  page: number; sel: number; sub: number; mode: string; state: CombatState; labels: { text: string }[]; roomLog(g: Game): string[] };
/** A person, as a business keeps one. */
export type Npc = Extract<Feature, { kind: 'npc' }>;
/** What the page keeps between two of its evaluates. */
export type Kept = { __hob?: Feature; __bram?: { level: number; maxHp: number; hp: number; gold: number }; __purse?: number };

/** The crack sweep the run asks for: the maps SMOKE_SWEEP or SMOKE_BASE names, those this run sweeps all four ways, the shard and the audit. */
export interface Sweep { maps: string[]; four: string[]; shard: { i: number; n: number }; audit: boolean }

/** What a part is given: the page, the pinned seed, `ok`, the page's errors so far and the sweep asked. */
export interface Run { page: Page; seed: number; ok: (cond: boolean, msg: string) => void; errors: string[]; sweep: Sweep }

/** A part, named by its function's name: `title` is the one that starts on the title screen and not in a game. */
export type Part = (r: Run) => Promise<void>;

/** The canvas's count of colours. */
export const colours = (page: Page): Promise<number> => page.evaluate(() => {
  const c = document.getElementById('stage') as HTMLCanvasElement;
  const d = c.getContext('2d')!.getImageData(0, 0, c.width, c.height).data;
  const seen = new Set<number>();
  for (let i = 0; i < d.length; i += 4) seen.add((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]);
  return seen.size;
});

/**
 * The page settled: a tick of the game run since now, the input's queue empty and a frame drawn after it.
 * The game takes one press a tick from its queue (src/input.ts, src/main.ts) and says the sky's news on a
 * tick, so a screen, a log line or the canvas is read once these hold, not after a fixed wait that a
 * starved browser outruns.
 */
export async function settle(page: Page): Promise<void> {
  const from = await page.evaluate(() => window.__game!.game!.frame);
  await page.waitForFunction((f: number) => { const g = window.__game!.game!; return g.frame > f && (g.input as Input)['queue'].length === 0; }, from);
  await page.evaluate(() => new Promise((r) => requestAnimationFrame(() => r(null))));
}

/** A key pressed, and the page settled after it. */
export async function press(page: Page, key: string): Promise<void> {
  await page.keyboard.press(key);
  await settle(page);
}

/** The top screen: its name, its options and its words. */
export const top = (page: Page): Promise<{ screen: string; options: string[]; text: string }> => page.evaluate(() => { const t = window.__game!.game!.top as Shown; return { screen: t.constructor.name, options: t.options ?? [], text: t.words ?? t.text ?? '' }; });

/** The names of the screens on the stack, the first first. */
export const stack = (page: Page): Promise<string> => page.evaluate(() => window.__game!.game!.screens.map((s) => s.constructor.name).join(','));

/** A new game on the pinned seed, the premade company at the gate, as the title makes it (ui/create.ts). */
export const company = (page: Page, seed: number): Promise<void> => page.evaluate(async (s: number) => {
  const load: Load = (p) => import(p);
  const g = window.__game!.game!, P = await load<typeof import('../../src/game/party.ts')>('/src/game/party.ts');
  g.rng.seed(s); g.newGame(s, P.defaultParty(g.rng));
}, seed);

/** What the frame keeps of the page before a part. */
type Held = { __held?: {
  world: World; maps: { id: string; cells: Cell[]; features: Feature[]; landmarks: readonly Landmark[] }[]; items: string[]; flames: Flame[]; painted: readonly Flame[];
  place: { id: string; x: number; y: number; f: World['state']['facing'] }; minutes: number; light: number; flags: World['party']['flags']; gold: number;
} };

/**
 * One part in its frame; its seconds. Before it, the input's queue is emptied, a game is begun where none
 * runs (the premade company at the gate on the pinned seed, as the title makes it: every part but the
 * title's needs one) and the screens are popped to the first; then the frame keeps what a part may lay
 * something on or empty: each map's cells, features and landmarks, the maps and the items there are, the
 * painted flames, and the world's clock, place, flags and purse. After it, in a `finally`, however it
 * ended: what it laid is taken up (a cell, a feature, a landmark, a map or an item it added), the flames
 * it emptied are put back and the screens popped to the first. A part that threw has the clock, the
 * place, the flags and the purse put back as well, which one that passes puts back itself or moves on
 * purpose (the coach's crossing). A part that throws is `FAIL: <part> threw` with its stack, one that
 * raised a page error `FAIL` with the error, and the run goes on.
 */
export async function frame(part: Part, r: Run): Promise<number> {
  const { page, ok, errors } = r, from = errors.length, t0 = Date.now(), title = part.name === 'title';
  let threw: unknown = null;
  try {
    const playing = await page.evaluate(() => { const g = window.__game!.game!; (g.input as Input).clear(); return g.screens[0].constructor.name === 'ExploreScreen'; });
    if (!title && !playing) await company(page, r.seed);
    if (!title) await page.evaluate(async () => {
      const load: Load = (p) => import(p);
      const g = window.__game!.game!;
      while (g.screens.length > 1) g.pop();
      const V = await load<typeof import('../../src/ui/viewport.ts')>('/src/ui/viewport.ts'), C = await load<typeof import('../../src/content/index.ts')>('/src/content/index.ts');
      const w = g.world;
      (window as Window & Held).__held = {
        world: w, maps: Object.entries(w.maps).map(([id, m]) => ({ id, cells: m.cells.slice(), features: m.features.slice(), landmarks: m.landmarks })),
        items: Object.keys(C.ITEMS), flames: V.paintedFlames().slice(), painted: V.paintedFlames(),
        place: { id: w.state.mapId, x: w.state.x, y: w.state.y, f: w.state.facing }, minutes: w.state.minutes, light: w.state.light, flags: { ...w.party.flags }, gold: w.party.gold,
      };
    });
    await part(r);
  } catch (e) {
    threw = e;
  } finally {
    try {
      await page.evaluate(async (thrown: boolean) => {
        const load: Load = (p) => import(p);
        const g = window.__game!.game!, held = (window as Window & Held).__held;
        delete (window as Window & Held).__held;
        (g.input as Input).clear();
        while (g.screens.length > 1) g.pop();
        // A part that began a new game leaves it: nothing it laid is in the old world.
        if (!held || g.world !== held.world) return;
        const V = await load<typeof import('../../src/ui/viewport.ts')>('/src/ui/viewport.ts'), C = await load<typeof import('../../src/content/index.ts')>('/src/content/index.ts');
        const w = g.world;
        for (const k of held.maps) {
          const m = w.maps[k.id];
          if (!m) continue;
          if (m.cells.length !== k.cells.length || m.cells.some((c, i) => c !== k.cells[i])) { m.cells.length = k.cells.length; for (let i = 0; i < k.cells.length; i++) m.cells[i] = k.cells[i]; }
          if (m.features.length !== k.features.length || m.features.some((f, i) => f !== k.features[i])) (m.features as Feature[]).splice(0, m.features.length, ...k.features);
          if (m.landmarks !== k.landmarks) (m as { landmarks: readonly Landmark[] }).landmarks = k.landmarks;
        }
        for (const id of Object.keys(w.maps)) if (!held.maps.some((k) => k.id === id)) { delete w.maps[id]; delete w.state.maps[id]; }
        for (const id of Object.keys(C.ITEMS)) if (!held.items.includes(id)) delete (C.ITEMS as Record<string, unknown>)[id];
        // Only the list the part found and emptied: one a later paint began is that scene's own, which
        // the view keeps with the scene and draws every frame (src/ui/viewport.ts, drawViewport).
        const flames = V.paintedFlames() as Flame[];
        if (flames === held.painted && !flames.length && held.flames.length) flames.push(...held.flames);
        if (!thrown) return;
        w.travel(held.place.id, held.place.x, held.place.y, held.place.f);
        w.state.minutes = held.minutes; w.state.light = held.light; w.party.flags = held.flags; w.party.gold = held.gold; w['cached'] = null;
      }, threw !== null);
    } catch (e) {
      threw ??= e;
    }
  }
  if (threw !== null) {
    ok(false, `${part.name} threw`);
    console.log(String((threw as Error).stack ?? threw).split('\n').map((l) => `        ${l}`).join('\n'));
  }
  if (errors.length > from) ok(false, `${part.name} raised a page error -> ${errors.slice(from).join(' | ')}`);
  return (Date.now() - t0) / 1000;
}
