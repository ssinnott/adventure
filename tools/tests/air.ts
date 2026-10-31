// Each region's air (#1097): every area has a look, merged by region, and each colour of it is a colour,
// an air casting the sky a fifth of the way at most. With no air the sky and the haze are main's, call for
// call, painted into a context that writes down what it is told, so no canvas. An air casts by day and is
// gone by night, and an ending's cast wins over every region's air. How the airs look is the twelve views' (#1094).
import { createHash } from 'node:crypto';
import { makeRng } from '../../src/lib/engine/rng.ts';
import { AREAS, TABLES } from '../../src/content/index.ts';
import { buildMaps } from '../../src/content/maps.ts';
import type { Air } from '../../src/content/area.ts';
import { drawSkyBand, hazeOf, airOf } from '../../src/ui/view/sky.ts';
import { paintScene } from '../../src/ui/view/compositor.ts';
import { hearthLook } from '../../src/game/stones.ts';
import { World } from '../../src/game/world.ts';
import { defaultParty } from '../../src/game/party.ts';
import type { Tables } from '../../src/game/tables.ts';
import { ok } from './lib.ts';

/** What main's sky and haze gave over `SKIES`, at 1a7107a0, before the airs: the band's back part, the hills being #1095's and #1105's to redraw. */
const MAIN = 'c0513de2e115';

/** A 2D context that paints nothing and writes down each call and each setting, a gradient by its number and its stops. */
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

const ENDING = hearthLook({ stones: 5, ending: 'arrive' }).cast;
/** Five weathers (clear, overcast, rain, fog, snow lying), noon, dusk and night, facing north and west, with and without an ending's cast: 60 skies. */
const SKIES = [[0, 0, 0, 0], [0.8, 0, 0, 0], [0.9, 0.5, 0.8, 0], [0.3, 1, 0, 0], [0.9, 0.4, 0.6, 1]].flatMap(([cloud, murk, heavy, cover]) =>
  [[12, 1], [18.6, 0.45], [23, 0]].flatMap(([hour, daylight]) => [0, 3].flatMap((facing) => [undefined, ENDING].map((cast) => ({ cloud, murk, heavy, cover, hour, daylight, facing, cast })))));

/** Each sky of `SKIES` under `air`, its band but the hills (which take the air only through the band's foot) and its haze, as written down. */
function paint(air?: Air): string[] {
  const r = { x: 0, y: 0, w: 400, h: 268 };
  return SKIES.map(({ cloud, murk, heavy, cover, hour, daylight, facing, cast }) => {
    const log: string[] = [];
    drawSkyBand(recorder(log), r, { facing, hour, daylight, dark: daylight < 0.25, dawn: 5.5, dusk: 20.5, cloud, murk, heavy, drift: 140, cover, day: 91, hearth: { bearing: 250, step: 2 }, cast, air, part: 'back' });
    log.push(`haze=${hazeOf(daylight, cloud, murk, cast, air)}`);
    return log.join('\n');
  });
}

export function air(): void {
  const colour = /^#[0-9a-f]{6}$/, airs = AREAS.flatMap((a) => (a.look.air ? [[a.id, a.look.air] as const] : []));
  const wrong = airs.filter(([, air]) => {
    const colours = [air.top, air.foot, air.haze, air.sun].filter((c) => c !== undefined);
    return !colours.length || !colours.every((c) => colour.test(c)) || !(air.strength > 0 && air.strength <= 0.2);
  });
  ok(AREAS.every((a) => TABLES.looks[a.id] === a.look) && wrong.length === 0,
    `every area has a look, merged by region, and each colour of it is a colour, an air casting the sky a fifth of the way at most (${airs.length} airs among ${AREAS.length} areas${wrong.length ? '; wrong: ' + wrong.map(([id]) => id).join(', ') : ''})`);

  const none = paint(), digest = createHash('sha256').update(none.join('\n')).digest('hex').slice(0, 12);
  ok(digest === MAIN, `with no air the sky and the haze are main's, call for call (${SKIES.length} skies, ${none.join('\n').split('\n').length} calls, ${digest})`);

  // By day an air casts the sky, by night it is gone: night's skies are main's under every air.
  const night = SKIES.flatMap((s, i) => (s.daylight === 0 ? [i] : []));
  const dull = airs.filter(([, air]) => { const aired = paint(air); return aired.every((s, i) => s === none[i]) || night.some((i) => aired[i] !== none[i]); });
  ok(dull.length === 0, `each air casts its sky by day and is gone by night, its ${night.length} night skies main's${dull.length ? '; not: ' + dull.map(([id]) => id).join(', ') : ''}`);

  // The view takes no air under an ending's cast, so the sky, its sun and the haze are the cast's as main paints them.
  const at = (region: World['region'], ending?: 'arrive') => ({ underSky: true, region, tables: TABLES, hearth: { stones: 5, ending } }) as unknown as World;
  const lost = AREAS.filter((a) => airOf(at(a.id, 'arrive')) !== undefined || airOf(at(a.id)) !== a.look.air);
  ok(lost.length === 0, `an ending's cast wins over every region's air: under it the view takes none, in all ${AREAS.length} regions${lost.length ? '; not: ' + lost.map((a) => a.id).join(', ') : ''}`);

  // The view takes its region's air: where there is one, the scene painted is not the scene with that region's air taken off,
  // and over the Foreland, which has none, it is the same, so the first is no accident of the painting. Path2D is the page's.
  (globalThis as { Path2D?: unknown }).Path2D ??= function Path2D() { return new Proxy({}, { get: () => () => {} }); };
  const maps = buildMaps();
  const scene = (looks: Tables['looks'], map: string, x: number, y: number): string => {
    const w = new World({ ...TABLES, looks }, maps, defaultParty(TABLES, makeRng(1)), makeRng(1)), log: string[] = [];
    w.state.weatherSeed = 1; w.travel(map, x, y, 0); w.state.minutes = 90 * 1440 + 12 * 60;
    paintScene(recorder(log), recorder(log), w, { x: 0, y: 0, w: 400, h: 268 });
    return log.join('\n');
  };
  const takes = scene(TABLES.looks, 'emberwaste_f11', 22, 19) !== scene({ ...TABLES.looks, ashfall: { ...TABLES.looks.ashfall, air: undefined } }, 'emberwaste_f11', 22, 19);
  const same = scene(TABLES.looks, 'downs_e2', 14, 26) === scene({ ...TABLES.looks, shelf: { ...TABLES.looks.shelf, air: undefined } }, 'downs_e2', 14, 26);
  ok(takes && same, `the view takes its region's air: Ashfall's noon scene is not the one painted with its air taken off, the Foreland's is${takes && same ? '' : ` (Ashfall ${takes ? 'differs' : 'the same'}, the Foreland ${same ? 'the same' : 'differs'})`}`);
}
