// Each region's hills (#1105): an area's look names its hills' kind, and with none named a hill is main's, call for call,
// painted into a context that writes down what it is told, its paths with it, so no canvas. The view takes the kind of
// each hill's own region, and each kind's mark stands on a share of its hills at most. How the kinds look is the twelve
// views' (#1094); that each body stays inside its outline is the smoke's (tools/smoke/art.ts).
import { createHash } from 'node:crypto';
import { makeRng } from '../../src/lib/engine/rng.ts';
import { TABLES } from '../../src/content/index.ts';
import { buildMaps } from '../../src/content/maps.ts';
import type { AreaLook } from '../../src/content/area.ts';
import { paintOn, CLEAR } from '../../src/ui/view/common.ts';
import type { Env } from '../../src/ui/view/common.ts';
import { hills as HILLS, HILL_MARKS, hillMarks } from '../../src/ui/view/ground/hills.ts';
import { paintScene } from '../../src/ui/view/compositor.ts';
import { World } from '../../src/game/world.ts';
import { defaultParty } from '../../src/game/party.ts';
import type { GameMap } from '../../src/game/map.ts';
import type { Tables } from '../../src/game/tables.ts';
import { ok } from './lib.ts';

type Kind = NonNullable<AreaLook['hills']>;

/** What main's hills gave over `HILLS_PAINTED` in `LIGHTS` at 910066af, before the kinds. */
const MAIN = '9dcf122bf7d4';

/** A 2D context that paints nothing and writes down each call and each setting, a gradient or a path by its number. */
function recorder(log: string[]): CanvasRenderingContext2D {
  let n = 0;
  const gradient = (kind: string, a: unknown[]) => {
    const id = `${kind}#${n++}`; log.push(`${id}(${a.join(',')})`);
    return { id, addColorStop: (at: number, c: string) => { log.push(`${id}.stop(${at},${c})`); } };
  };
  const named = (a: unknown[]): string => a.map((v) => (v && typeof v === 'object' && 'id' in v ? (v as { id: string }).id : String(v))).join(',');
  return new Proxy({}, {
    get: (_, k) => k === 'createLinearGradient' || k === 'createRadialGradient' ? (...a: unknown[]) => gradient(String(k), a) : (...a: unknown[]) => { log.push(`${String(k)}(${named(a)})`); },
    set: (_, k, v) => { log.push(`${String(k)}=${v && typeof v === 'object' ? (v as { id: string }).id : String(v)}`); return true; },
  }) as unknown as CanvasRenderingContext2D;
}

/** A Path2D that writes down what is drawn into it, by its number, in the same log. */
function paths(log: string[]): unknown {
  let n = 0;
  return function Path2D() {
    const id = `path#${n++}`; log.push(`${id}()`);
    return new Proxy({ id }, { get: (t, k) => (k === 'id' ? t.id : (...a: unknown[]) => { log.push(`${id}.${String(k)}(${a.join(',')})`); }) });
  };
}

/** Four weathers (clear, wet, snow lying deep enough to bury the tufts, murk) by day and by night: eight lights. */
const LIGHTS = [{}, { wet: 0.8 }, { cover: 0.7 }, { murk: 0.6 }].flatMap((w) => [false, true].map((dark) => ({ env: { ...CLEAR, day: 91, ...w } as Env, dark })));
/** Near and far, left, ahead and right, three seeds, alone and running on into a hill each side: 144 hills in each light. */
const HILLS_PAINTED = [1, 2, 3, 4].flatMap((d) => [-1, 0, 1].flatMap((l) => [3, 71, 409].flatMap((seed) => [[false, false], [true, false], [false, true], [true, true]].map(([hl, hr]) => ({ d, l, seed, hl, hr })))));

/** Every hill of `HILLS_PAINTED` in every light, of a kind or of none, as written down. */
function painted(kind?: AreaLook['hills']): string {
  const log: string[] = [], ctx = recorder(log), g = globalThis as { Path2D?: unknown }, was = g.Path2D;
  g.Path2D = paths(log);
  try {
    for (const { env, dark } of LIGHTS) {
      const p = paintOn(ctx, { x: 0, y: 0, w: 400, h: 268 }, {} as GameMap, { dark, haze: dark ? '#1a1428' : '#c9d6e6', daylight: dark ? 0 : 1, gloom: dark ? 0 : 1, env, present: () => true });
      for (const { d, l, seed, hl, hr } of HILLS_PAINTED) HILLS.mound!(p, '#6a8a4a', d, l, seed, hl, hr, kind);
    }
  } finally { g.Path2D = was; }
  return log.join('\n');
}

/** The most of its hills a kind may mark, and the most marks one hill may carry: a range of hills is not a clutter. */
const SHARE_CAP = 0.6, MOST_CAP = 2;

export function hills(): void {
  const none = painted(), digest = createHash('sha256').update(none).digest('hex').slice(0, 12);
  ok(digest === MAIN, `with no kind named a hill is main's, call for call (${HILLS_PAINTED.length * LIGHTS.length} hills, ${none.split('\n').length} calls, ${digest})`);

  const kinds = Object.keys(HILL_MARKS) as Kind[], logs = kinds.map((k) => painted(k));
  const alike = kinds.filter((_, i) => logs[i] === none || logs.some((o, j) => j !== i && o === logs[i]));
  const named = [...new Set(Object.values(TABLES.looks).map((look) => look.hills).filter((k) => k !== undefined))];
  ok(!alike.length && named.length === kinds.length, `each of the ${kinds.length} kinds paints its own hill, none today's nor another's, and an area's look names each (${named.join(', ')})${alike.length ? '; alike: ' + alike.join(', ') : ''}`);

  // The view takes each hill's own region's kind: the Kilns' O5 is painted otherwise with the Kilns' hills unnamed, and as it is
  // with every other region's unnamed. Path2D is the page's; here it writes nothing down.
  const g = globalThis as { Path2D?: unknown }, was = g.Path2D;
  g.Path2D = function Path2D() { return new Proxy({}, { get: () => () => {} }); };
  const maps = buildMaps();
  const scene = (looks: Tables['looks']): string => {
    const w = new World({ ...TABLES, looks }, maps, defaultParty(TABLES, makeRng(1)), makeRng(1)), log: string[] = [];
    w.state.weatherSeed = 1; w.travel('kilnsheart_o5', 22, 19, 0); w.state.minutes = 90 * 1440 + 11 * 60;
    paintScene(recorder(log), recorder(log), w, { x: 0, y: 0, w: 400, h: 268 });
    return log.join('\n');
  };
  const unnamed = (keep: (r: string) => boolean): Tables['looks'] => Object.fromEntries(Object.entries(TABLES.looks).map(([r, look]) => [r, keep(r) ? look : { ...look, hills: undefined }])) as Tables['looks'];
  let takes = false, own = false;
  try { const as = scene(TABLES.looks); takes = as !== scene(unnamed((r) => r !== 'kilns')); own = as === scene(unnamed((r) => r === 'kilns')); } finally { g.Path2D = was; }
  ok(takes && own, `the view takes each hill's own region's kind: the Kilns' O5 is painted otherwise with the Kilns' hills unnamed (${takes ? 'it is' : 'it is not'}) and as it is with every other region's unnamed (${own ? 'it is' : 'it is not'})`);

  // Each kind's marks over its hills in every map, a hill's region as the view finds it, against the caps.
  const world = new World(TABLES, maps, defaultParty(TABLES, makeRng(1)), makeRng(1)), tally = new Map<Kind, { hills: number; marked: number; most: number }>();
  for (const m of Object.values(world.maps) as GameMap[]) for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) {
    const c = m.at(x, y), region = m.zoneAt(x, y)?.region ?? m.def.region, kind = region && TABLES.looks[region].hills;
    if ((c.look ?? c).terrain !== 'hills' || !kind) continue;
    const t = tally.get(kind) ?? { hills: 0, marked: 0, most: 0 }, n = hillMarks(kind, x * 131 + y * 17);
    tally.set(kind, { hills: t.hills + 1, marked: t.marked + (n ? 1 : 0), most: Math.max(t.most, n) });
  }
  const over = kinds.filter((k) => { const t = tally.get(k); return !t || !(HILL_MARKS[k].share > 0 && HILL_MARKS[k].share <= SHARE_CAP && HILL_MARKS[k].most <= MOST_CAP) || t.marked > t.hills * SHARE_CAP || t.most > HILL_MARKS[k].most; });
  ok(!over.length, `each kind marks ${SHARE_CAP * 100}% of its hills at most, ${MOST_CAP} marks to a hill at most (${kinds.map((k) => { const t = tally.get(k); return t ? `${k} ${t.marked} of ${t.hills}` : `${k} none`; }).join(', ')})${over.length ? '; over: ' + over.join(', ') : ''}`);
}
