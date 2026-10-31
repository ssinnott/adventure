// Each region's tints of the grounds it shares (#1099): every tint is a colour, cast a quarter of the way at
// most. On every square of the outdoors and the towns a ground moves as far toward its own region's tint as
// that tint moves its colour of the day and no farther, so the tint changes at a zone's border; a ground its
// region does not tint is the colour it was, and so is every ground past the zones, which have no region.
// The Foreland's view and Thornmark's, which have none, are the scenes painted with every tint taken off,
// call for call, where Hearth Isle's is not; a view out past a zone's edge paints. How the tints look is the
// twelve views' (#1094).
import { makeRng } from '../../src/lib/engine/rng.ts';
import { mix, hexToRgb } from '../../src/lib/art/palettes.ts';
import { AREAS, TABLES } from '../../src/content/index.ts';
import { buildMaps } from '../../src/content/maps.ts';
import type { Terrain } from '../../src/game/mapdef.ts';
import type { GameMap } from '../../src/game/map.ts';
import type { Tables } from '../../src/game/tables.ts';
import { World, regionAt } from '../../src/game/world.ts';
import { defaultParty } from '../../src/game/party.ts';
import { paintScene } from '../../src/ui/view/compositor.ts';
import { paintOn, CLEAR } from '../../src/ui/view/common.ts';
import type { Paint } from '../../src/ui/view/common.ts';
import { GROUND, groundColor } from '../../src/ui/view/ground/index.ts';
import { ok } from './lib.ts';

/** A 2D context that paints nothing and writes down each call and each setting, a gradient by its number and its stops, as air.ts's. */
function recorder(log: string[]): CanvasRenderingContext2D {
  let n = 0;
  const gradient = (kind: string, a: unknown[]) => {
    const id = `${kind}#${n++}`; log.push(`${id}(${a.join(',')})`);
    return { id, addColorStop: (at: number, c: string) => { log.push(`${id}.stop(${at},${c})`); } };
  };
  return new Proxy({}, {
    get: (_, k) => k === 'createLinearGradient' || k === 'createRadialGradient' ? (...a: unknown[]) => gradient(String(k), a) : (...a: unknown[]) => { log.push(`${String(k)}(${a.join(',')})`); },
    set: (_, k, v) => { log.push(`${String(k)}=${v && typeof v === 'object' ? (v as { id: string }).id : String(v)}`); return true; },
  }) as unknown as CanvasRenderingContext2D;
}

/** Every region's look with its tints taken off. */
const BARE = Object.fromEntries(Object.entries(TABLES.looks).map(([r, l]) => [r, { ...l, tints: undefined }])) as Tables['looks'];

export function tints(): void {
  const colour = /^#[0-9a-f]{6}$/, all = AREAS.flatMap((a) => Object.entries(a.look.tints ?? {}).map(([t, tint]) => ({ area: a.id, t, ...tint })));
  const wrong = all.filter((x) => !(x.t in GROUND) || !colour.test(x.toward) || !(x.by > 0 && x.by <= 0.25));
  ok(all.length > 0 && !wrong.length, `every tint is a colour, on a ground there is, cast a quarter of the way at most (${all.length} tints in ${AREAS.filter((a) => a.look.tints).length} of ${AREAS.length} areas${wrong.length ? '; wrong: ' + wrong.map((x) => `${x.area}'s ${x.t}`).join(', ') : ''})`);

  // Every second square of the zones and the towns, each ground its region tints at Harvest, and every
  // sixth, the country past the zones with it, on two more days and with every ground: painted with the
  // tables' looks, with the tints taken off and with no looks at all, as a painter given none (the smoke's hill) is.
  const maps = buildMaps(), ctx = {} as CanvasRenderingContext2D, tinted = [...new Set(all.map((x) => x.t as Terrain))];
  const paint = (m: GameMap, day: number, looks?: Tables['looks']): Paint => ({ ...paintOn(ctx, { x: 0, y: 0, w: 400, h: 268 }, m), env: { ...CLEAR, day }, looks });
  // A square no zone holds, the country past the built land that the view looks out on, has no region.
  const tintsAt = (m: GameMap, x: number, y: number) => { const r = regionAt(m, x, y); return r && TABLES.looks[r].tints; };
  let squares = 0, past = 0, border = 0, most = 0;
  const off = new Set<string>(), moved = new Set<string>(), took = new Set<string>();
  for (const m of Object.values(maps)) {
    if (m.kind === 'dungeon') continue;
    for (let y = 0; y < m.height; y += 2) for (let x = 0; x < m.width; x += 2) {
      const region = regionAt(m, x, y), sixth = x % 6 === 0 && y % 6 === 0, here = tintsAt(m, x, y);
      if (!region && !sixth) continue;
      if (region) squares++; else past++;
      if ([[1, 0], [0, 1], [-1, 0], [0, -1]].some(([dx, dy]) => tintsAt(m, x + dx, y + dy) !== here)) border++;
      for (const day of sixth ? [10, 45, 91] : [45]) {
        const p = paint(m, day, TABLES.looks), bare = paint(m, day, BARE), none = paint(m, day);
        for (const t of sixth ? (Object.keys(GROUND) as Terrain[]) : tinted) {
          const a = hexToRgb(groundColor(p, t, '#000000', x, y)), b = hexToRgb(groundColor(none, t, '#000000', x, y));
          if (sixth && groundColor(bare, t, '#000000', x, y) !== groundColor(none, t, '#000000', x, y)) moved.add(`${t} with none`);
          const tint = here?.[t];
          if (!region || !tint) { if (a.join() !== b.join()) moved.add(`${region ?? 'no region'}'s ${t}`); continue; }
          // As far as its own tint moves its colour of the day, to the step, where no channel ran to black or white.
          const own = GROUND[t].color(day, 0), from = hexToRgb(own), want = hexToRgb(mix(own, tint.toward, tint.by)), to = hexToRgb(tint.toward);
          if (a.some((v, i) => v > 0 && v < 255 && b[i] > 0 && b[i] < 255 && v - b[i] !== want[i] - from[i])) off.add(`${region}'s ${t}`);
          const i = [0, 1, 2].reduce((k, j) => (Math.abs(to[j] - from[j]) > Math.abs(to[k] - from[k]) ? j : k), 0);
          most = Math.max(most, (Math.abs(a[i] - b[i]) - 0.5) / (Math.abs(to[i] - from[i]) || 1));
          if (a.join() !== b.join()) took.add(region);
        }
      }
    }
  }
  const regions = AREAS.filter((a) => a.look.tints).length;
  ok(!off.size && most <= 0.25 && took.size === regions, `a ground moves toward its own region's tint as far as the tint says and no farther, changing at a zone's border (${squares} squares of the outdoors and the towns, ${border} of them by a border; at most ${Math.round(most * 100)}% of the way, to the step; ${took.size} of ${regions} tinted regions took theirs${off.size ? '; off: ' + [...off].slice(0, 6).join(', ') : ''})`);
  ok(!moved.size && past > 0, `a ground its region does not tint is the colour it was, and so is every ground on a square no zone holds and with the tints taken off (${past} squares past the zones${moved.size ? '; moved: ' + [...moved].slice(0, 6).join(', ') : ''})`);

  // The view: the Foreland's noon scene and Thornmark's, which have no tints, are the scenes painted with every
  // tint taken off, call for call; Hearth Isle's is not, so the first is no accident of the painting. Path2D is the page's.
  (globalThis as { Path2D?: unknown }).Path2D ??= function Path2D() { return new Proxy({}, { get: () => () => {} }); };
  const scene = (looks: Tables['looks'], map: string, x: number, y: number): string => {
    const w = new World({ ...TABLES, looks }, maps, defaultParty(TABLES, makeRng(1)), makeRng(1)), log: string[] = [];
    w.state.weatherSeed = 1; w.travel(map, x, y, 0); w.state.minutes = 90 * 1440 + 11 * 60;
    paintScene(recorder(log), recorder(log), w, { x: 0, y: 0, w: 400, h: 268 });
    return log.join('\n');
  };
  const views: [string, number, number][] = [['downs_e2', 14, 26], ['thornmark', 14, 26]];
  const same = views.filter(([m, x, y]) => scene(TABLES.looks, m, x, y) === scene(BARE, m, x, y));
  const takes = scene(TABLES.looks, 'hearthisle_h6', 22, 19) !== scene(BARE, 'hearthisle_h6', 22, 19);
  ok(same.length === 2 && takes, `with no tints the view is as it was: the Foreland's and Thornmark's noon scenes are the ones painted with every tint taken off, call for call, and Hearth Isle's is not (${same.length} of 2 the same; Hearth Isle's ${takes ? 'differs' : 'the same'})`);

  // A company at a zone's edge facing north, two squares short of the country past the zones where it lies as a
  // ground some region tints: the view paints, those squares naming no region and taking no tint.
  const out = Object.values(maps).find((m) => m.zones.length)!;
  let edge: [number, number] | undefined, threw = '';
  for (let y = 2; y < out.height && !edge; y++) for (let x = 0; x < out.width && !edge; x++) {
    const past = out.at(x, y - 2);
    if (out.zoneAt(x, y) && out.at(x, y).solid === 'none' && !out.zoneAt(x, y - 2) && tinted.includes((past.look ?? past).terrain)) edge = [x, y];
  }
  try { if (edge) scene(TABLES.looks, out.id, ...edge); } catch (e) { threw = String(e); }
  ok(!!edge && !threw, `a view out past a zone's edge, on a ground some region tints, paints${edge ? ` (from ${edge.join(',')} facing north)` : ': no such square'}${threw ? `; it threw ${threw}` : ''}`);
}
