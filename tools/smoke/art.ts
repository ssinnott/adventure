// The smoke's art (#1006): the parts that hold a drawing to a rule, the interiors', the monsters' parts and
// silhouettes, a hill's body, the Hearth and the endings' pages.
import type { Load } from '../kit/browser.ts';
import type { MonsterSprite } from '../../src/content/index.ts';
import type { MonsterDef } from '../../src/game/monsters.ts';
import type { Facing } from '../../src/game/types.ts';
import type { Part } from '../../src/ui/monsters/gloss.ts';
import { SPRITES } from '../../src/ui/monsters/index.ts';
import { SPAN, SPAN_SLACK } from '../../src/ui/sprites.ts';
import { press, type Run, type Shown } from './boot.ts';

// Every interior paints, at noon and at midnight, and each is a picture rather than a flat fill.
export async function interiors({ page, ok }: Run): Promise<void> {
  const interiors = await page.evaluate(async () => {
    const load: Load = (p) => import(p);
    const I = await load<typeof import('../../src/ui/interior.ts')>('/src/ui/interior.ts');
    const c = document.createElement('canvas'); c.width = 400; c.height = 268;
    const ctx = c.getContext('2d')!;
    const thin: string[] = [];
    let n = 0;
    for (const kind of Object.keys(I.SCENES) as Parameters<typeof I.drawInterior>[1][]) for (const daylight of [0, 1]) {
      I.drawInterior(ctx, kind, { x: 0, y: 0, w: 400, h: 268 }, daylight, 30);
      const d = ctx.getImageData(0, 0, 400, 268).data, seen = new Set<number>();
      for (let i = 0; i < d.length; i += 4) seen.add((d[i] << 16) | (d[i + 1] << 8) | d[i + 2]);
      if (seen.size < 400) thin.push(`${kind}@${daylight} (${seen.size})`);
      n++;
    }
    // Held to the content's own list of rooms, so a scene missing from SCENES is caught here too.
    const C = await load<typeof import('../../src/content/index.ts')>('/src/content/index.ts');
    return { n, thin, kinds: C.INTERIORS.length as number, missing: (C.INTERIORS as string[]).filter((k) => !(k in I.SCENES)) };
  });
  ok(interiors.kinds >= 12 && interiors.missing.length === 0 && interiors.n === interiors.kinds * 2 && interiors.thin.length === 0, `all ${interiors.kinds} interiors paint by day and by night (${interiors.n} painted${interiors.thin.length ? ', too flat: ' + interiors.thin.join(', ') : ''})`);
}

// The monster art unions many parts into one painted mass with the nonzero fill rule, so every
// part kind has to wind the same way. One that winds the other way punches a hole wherever it
// overlaps another, which is how the tube ends once cut a wedge out of every limb. Overlap each
// pair of part kinds and look for background left showing in the middle.
export async function winding({ page, ok }: Run): Promise<void> {
  const windingHoles = await page.evaluate(async () => {
    const load: Load = (p) => import(p);
    const G = await load<typeof import('../../src/ui/monsters/gloss.ts')>('/src/ui/monsters/gloss.ts');
    const C = await load<typeof import('../../src/ui/monsters/common.ts')>('/src/ui/monsters/common.ts');
    const mk = (kind: string, cx: number): Part => {
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
  ok(windingHoles.length === 0, `every pair of sprite part kinds unions without a hole${windingHoles.length ? ' -> ' + windingHoles.join(', ') : ''}`);
}

// A hill's body stays inside its outline. The sweep lays hills flat, so it cannot see a crest
// light drawn off its hill, floating clear of it with sky beneath; this can. Each hill is painted alone, near and far, left, ahead and right, and every inked
// pixel lies within a pixel of its outline.
export async function hills({ page, ok }: Run): Promise<void> {
  const hillSpill: string[] = await page.evaluate(async () => {
    const load: Load = (p) => import(p);
    const V = await load<typeof import('../../src/ui/viewport.ts')>('/src/ui/viewport.ts');
    const W = 400, H = 268, out: string[] = [];
    const c = document.createElement('canvas'); c.width = W; c.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true })!;
    for (const d of [1, 2, 3, 5]) for (const l of [-1, 0, 1]) for (const seed of [3, 71, 409]) {
      ctx.clearRect(0, 0, W, H);
      const { outline } = V.hillBody(V.paintOn(ctx, { x: 0, y: 0, w: W, h: H }, window.__game!.game!.world.map), '#6a8a4a', d, l, seed, false, false);
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
  ok(!hillSpill.length, `a hill's body, its crest light with it, is drawn inside its outline, near and far${hillSpill.length ? ` -> ${hillSpill.slice(0, 4).join(', ')}` : ''}`);
}

// The parts of a drawing that stand apart from its body by design, each with the most pieces it
// comes to and the largest share of the drawing's ink they take between them, as its family registers
// them (src/ui/monsters/). Anything else apart is a part that has come loose, as the archer's head
// once did (#7).
const DETACHED: Partial<Record<MonsterSprite, { what: string; pieces: number; share: number }>> = Object.fromEntries(Object.entries(SPRITES).flatMap(([kind, s]) => (s.detached ? [[kind, s.detached]] : [])));

// One silhouette: every monster drawn at combat size, alone, three abreast and six abreast, through
// its idle motion, is one piece of ink. Ink is alpha 128 and up (a ground shadow is under it), a
// piece is 8-connected, and specks under 6 px are left out. What stands apart must be declared.
// Each is drawn where a fight seats a first group, its foot as far below the view's top as there
// (`seatFoot`: a tall boss on the third rank), on a canvas three heights wide, a height or the seat more above the view's top
// (whichever is more) and 0.3 under the foot: ink above the view's top reaches over the frame, and ink on a border runs off the canvas.
// Each is held to its span too (SPAN in ui/sprites.ts), which the fight's row is spaced by: alone, three,
// six and twelve abreast, its ink reaches no more than SPAN_SLACK px past it either side, and its span is
// no more than SPAN_LOOSE of its height wider than the most it reaches alone, three or six abreast.
interface Silhouette {
  id: string; sprite: string; pieces: number; share: number; at: string; clipped: '' | 'top' | 'edge'; room: number; reach: number; size: number;
  /** The most it reaches left and right of its centre, as shares of its height, alone, three and six abreast; the least span that holds it at every size; and its px past its span. */
  wide: [number, number]; need: [number, number]; past: number;
}
const SPAN_LOOSE = 0.05;
export async function silhouettes({ page, ok }: Run): Promise<void> {
  const { silhouettes, raised, seat, tall }: { silhouettes: Silhouette[]; raised: Silhouette[]; seat: number; tall: { size: number; reach: number } } = await page.evaluate(async () => {
    const load: Load = (p) => import(p);
    const S = await load<typeof import('../../src/ui/sprites.ts')>('/src/ui/sprites.ts'), C = await load<typeof import('../../src/content/index.ts')>('/src/content/index.ts');
    const F = await load<typeof import('../../src/ui/frame.ts')>('/src/ui/frame.ts'), G = await load<typeof import('../../src/ui/grouplabels.ts')>('/src/ui/grouplabels.ts');
    const seat = Math.round(G.seatFoot(0, F.LAYOUT.view.h)), seatOf = (def: MonsterDef): number => Math.round(G.seatFoot(0, F.LAYOUT.view.h, def.size));
    const padOf = (h: number, foot = seat): number => Math.max(Math.ceil(h), foot);
    const c = document.createElement('canvas');
    const ctx = c.getContext('2d', { willReadFrequently: true })!;
    type Draw = (ctx: CanvasRenderingContext2D, x: number, y: number, h: number, frame: number) => void;
    const scan = (def: MonsterDef, draw: Draw): Silhouette => {
      const foot = seatOf(def), span: readonly [number, number] = S.SPAN[def.sprite];
      const worst: Silhouette = { id: def.id, sprite: def.sprite, pieces: 0, share: 0, at: '', clipped: '', room: foot, reach: 0, size: def.size, wide: [0, 0], need: [0, 0], past: 0 };
      // Twelve abreast is for the span alone: so small a drawing is not held to one piece.
      for (const n of [1, 3, 6, 12]) {
        const spanOnly = n === 12;
        const h = S.combatHeight(def.size, n), pad = padOf(h, foot), cw = Math.ceil(h * 3) + (spanOnly ? 8 : 0), ch = pad + foot + Math.ceil(h * 0.3);
        c.width = cw; c.height = ch;
        const seen = new Int32Array(cw * ch), stack = new Int32Array(cw * ch);
        for (let frame = 0; frame <= 176; frame += 4) {
          ctx.clearRect(0, 0, cw, ch);
          draw(ctx, cw / 2, pad + foot, h, frame);
          const d = ctx.getImageData(0, 0, cw, ch).data;
          seen.fill(0);
          const sizes: number[] = [];
          let minX = cw, maxX = -1;
          for (let i = 0; i < cw * ch; i++) {
            if (seen[i] || d[i * 4 + 3] < 128) continue;
            let top = 0, size = 0;
            stack[top++] = i; seen[i] = 1;
            while (top) {
              const p = stack[--top], px = p % cw, py = (p - px) / cw;
              size++;
              if (px < minX) minX = px;
              if (px > maxX) maxX = px;
              if (!spanOnly) {
                if (py - pad < worst.room) worst.room = py - pad;
                if ((pad + foot - py) / h > worst.reach) worst.reach = (pad + foot - py) / h;
                if (px === 0 || py === 0 || px === cw - 1 || py === ch - 1) worst.clipped = 'edge';
                else if (py < pad && worst.clipped !== 'edge') worst.clipped = 'top';
              }
              for (let dy = -1; dy <= 1; dy++) for (let dx = -1; dx <= 1; dx++) {
                const qx = px + dx, qy = py + dy, q = qy * cw + qx;
                if (qx < 0 || qy < 0 || qx >= cw || qy >= ch || seen[q] || d[q * 4 + 3] < 128) continue;
                seen[q] = 1; stack[top++] = q;
              }
            }
            if (size >= 6) sizes.push(size);
          }
          // How far its ink reaches either side of its centre, against its span.
          if (maxX >= 0) [cw / 2 - minX, maxX + 1 - cw / 2].forEach((px, k) => {
            if (!spanOnly) worst.wide[k] = Math.max(worst.wide[k], px / h);
            worst.need[k] = Math.max(worst.need[k], (px - S.SPAN_SLACK) / h);
            worst.past = Math.max(worst.past, px - span[k] * h);
          });
          if (spanOnly) continue;
          sizes.sort((a, b) => b - a);
          const ink = sizes.reduce((a, b) => a + b, 0), apart = ink - (sizes[0] ?? 0);
          if (sizes.length - 1 > worst.pieces) { worst.pieces = sizes.length - 1; worst.at = `${n} abreast, frame ${frame}: ${sizes.slice(1).join('+')} px apart of ${ink}`; }
          if (ink && apart / ink > worst.share) worst.share = apart / ink;
        }
      }
      return worst;
    };
    const defs = Object.values(C.MONSTERS);
    const silhouettes = defs.map((def) => scan(def, (g, x, y, h, frame) => S.drawMonsterSprite(g, def.sprite, x, y, h, def.tint, 1, frame)));
    // The fixtures: a def with the top fifth of its ink moved up, as a crest or a raised wing might
    // be. Each has to fail for reaching above the view: the tallest def's moved a third of its height,
    // and the smallest's moved clear of the view by more than its own height.
    const o = document.createElement('canvas');
    const lifted = (def: MonsterDef, id: string, lift: (h: number, top: number) => number): Silhouette => scan({ ...def, id }, (g, x, y, h, frame) => {
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
  // A drawing held to its span, and the span a builder should write where it is not: the least that holds
  // it at every size, and no less than the most it reaches alone, three or six abreast.
  const spanFor = (s: Silhouette): number[] => [0, 1].map((k) => Math.ceil(Math.max(s.wide[k], s.need[k]) * 100 - 1e-6) / 100);
  const misspanned = silhouettes.filter((s) => s.past > SPAN_SLACK || [0, 1].some((k) => SPAN[s.sprite as MonsterSprite][k] - s.wide[k] > SPAN_LOOSE));
  ok(loose.length === 0 && unused.length === 0, `every monster is one silhouette at combat size, but for the parts it declares apart (${silhouettes.length} drawn; ${Object.entries(DETACHED).map(([k, v]) => `${k}'s ${v!.what}`).join(', ')})${loose.map((s) => ` -> ${s.id} (${s.sprite}): ${s.clipped === 'top' ? 'reaches above the view' : s.clipped ? 'runs off the canvas' : `${s.pieces} pieces apart, ${(100 * s.share).toFixed(1)}% of its ink, worst at ${s.at}`}`).join('')}${unused.length ? ' -> declared but never apart: ' + unused.join(', ') : ''}`);
  const closest = silhouettes.reduce((a, b) => (b.room < a.room ? b : a));
  ok(closest.room >= 0, `every monster stands inside the view, its foot where a fight seats it, a first group's ${seat} px below the top (the closest, ${closest.id}, ${closest.room} px under the top)`);
  ok(misspanned.length === 0, `every monster's drawing stands within its span, which the fight's row is spaced by, give or take ${SPAN_SLACK} px alone, three, six and twelve abreast, and no span is more than ${SPAN_LOOSE} of a height wider than the drawing${misspanned.map((s) => ` -> ${s.id} reaches ${s.wide.map((w) => w.toFixed(2)).join(' and ')} of its height${s.past > SPAN_SLACK ? `, ${s.past.toFixed(1)} px past its span` : ''}: SPAN ${s.sprite}: [${spanFor(s).join(', ')}]`).join('')}`);
  // A tall boss's markers are painted over its crown at TALL_REACH of its height (ui/grouplabels.ts),
  // which tools/tests/labels.ts trusts: its ink must stand no higher.
  const towering = silhouettes.filter((s) => s.size > tall.size), over = towering.filter((s) => s.reach > tall.reach);
  ok(towering.length > 0 && over.length === 0, `every tall boss's crown stands within ${tall.reach} of its height, under its markers (${towering.map((s) => `${s.id} ${s.reach.toFixed(3)}`).join(', ')})${over.length ? ' -> ' + over.map((s) => `${s.id} reaches ${s.reach.toFixed(3)}`).join(', ') : ''}`);
  ok(raised.every((r) => r.clipped === 'top'), `a monster with a part raised a third of its height, or clear of the view, reaches above it, and fails (${raised.map((r) => `${r.id}: ${r.clipped === 'top' ? 'reaches above the view' : `${r.room} px under the top`}`).join('; ')})`);
}

// The Hearth's measure (#168): at midnight under a clear sky, looking south from the Foreland by
// Helmstow, the Hearth stands over the hills where it lies, and brighter once the Tide Stone is home;
// looking north there is none. The title, over a save with the Tide Stone home, draws its column
// brighter and flickering less than over one without.
export async function hearth({ page, ok }: Run): Promise<void> {
  const hearth = await page.evaluate(async () => {
    const load: Load = (p) => import(p);
    const V = await load<typeof import('../../src/ui/viewport.ts')>('/src/ui/viewport.ts'), T = await load<typeof import('../../src/ui/title.ts')>('/src/ui/title.ts');
    const g = window.__game!.game!, w = g.world;
    const W = 400, H = 268, c = document.createElement('canvas'), sky = document.createElement('canvas');
    c.width = sky.width = W; c.height = sky.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true })!, skyCtx = sky.getContext('2d', { willReadFrequently: true })!;
    const minutes = w.state.minutes, flags = { ...w.party.flags }, place = { map: w.state.mapId, x: w.state.x, y: w.state.y, f: w.state.facing };
    const glow = (f: number): number => {
      w.travel('shelf', 16, 6, f as Facing);
      w.state.minutes = Math.floor(minutes / 1440) * 1440 + 1440;
      w['cached'] = { seed: w.state.weatherSeed!, minutes: w.state.minutes, region: w.region, weather: { cloud: 0.1, precip: 0, snow: 0, fog: 0, wind: 0, windDir: 0, storm: 0, temp: 12, cover: 0, wet: 0 } };
      skyCtx.clearRect(0, 0, W, H); ctx.clearRect(0, 0, W, H); V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H });
      const d = ctx.getImageData(0, H / 2 - 100, W, 90).data;
      let warm = 0;
      for (let i = 0; i < d.length; i += 4) warm += Math.max(0, d[i] - d[i + 2] - 4);
      return warm;
    };
    delete w.party.flags.q_tide_home;
    const south = glow(2), north = glow(0);
    w.party.flags.q_tide_home = 1;
    const home = glow(2);
    // The title over each save: its column's light summed, and how far it swings over the frames.
    const title = (): { light: number; swing: number } => {
      g.saveGame();
      const t = new T.TitleScreen(true), cv = document.createElement('canvas');
      cv.width = 640; cv.height = 360;
      const tc = cv.getContext('2d', { willReadFrequently: true })!;
      const sums: number[] = [];
      for (let frame = 0; frame < 60; frame++) {
        t.render(g, tc, frame);
        const d = tc.getImageData(310, 130, 20, 48).data;
        let sum = 0; for (let i = 0; i < d.length; i += 4) sum += d[i] + d[i + 1];
        sums.push(sum);
      }
      return { light: sums.reduce((a, b) => a + b, 0) / sums.length, swing: Math.max(...sums) - Math.min(...sums) };
    };
    const steadier = title();
    delete w.party.flags.q_tide_home;
    const plain = title();
    g.store!.removeItem('hearth-of-caldera.save');
    w.party.flags = flags; w.state.minutes = minutes; w['cached'] = null; w.travel(place.map, place.x, place.y, place.f);
    return { south, north, home, steadier, plain };
  });
  ok(hearth.south > 0 && hearth.north < hearth.south / 100 && hearth.home > hearth.south, `by night the Hearth stands over the hills where it lies, south of Helmstow and not north, and brighter with the Tide Stone home (${hearth.south} south, ${hearth.north} north, ${hearth.home} home)`);
  ok(hearth.steadier.light > hearth.plain.light && hearth.steadier.swing < hearth.plain.swing, `the title over a save with the Tide Stone home draws a brighter, steadier Hearth (light ${hearth.steadier.light.toFixed(0)} against ${hearth.plain.light.toFixed(0)}, swing ${hearth.steadier.swing} against ${hearth.plain.swing})`);
}

// The ending's pages (#750): a fixture question whose answer takes the Hull Opened shows its words, then its three pages
// over the title's dusk, a Space to a page, and after the last the company stands where it stood and the game goes on.
export async function endings({ page, ok }: Run): Promise<void> {
  const endingStart = await page.evaluate(() => {
    const g = window.__game!.game!, w = g.world;
    while (g.screens.length > 1) g.pop();
    w.travel('shelf', 16, 6, 2);
    g.ask({ ask: 'Fixture question.', answers: [{ label: 'Open it', says: ['Fixture words.'], sets: 'q_end_arrive' }] }, 'FIXTURE');
    return { under: g.screens[0].constructor.name, at: `${w.state.mapId} ${w.state.x},${w.state.y}` };
  });
  const endingTops: string[] = [];
  for (let i = 0; i <= 5; i++) {
    endingTops.push(await page.evaluate(() => { const t = window.__game!.game!.top as Shown; return t.constructor.name + (t.ending ? ` ${t.ending.title} ${t.page + 1}` : ''); }));
    if (i === 2 && process.env.ENDING_SHOT) await page.screenshot({ path: process.env.ENDING_SHOT });
    if (i < 5) await press(page, 'Space');
  }
  const endingAfter = await page.evaluate(() => { const g = window.__game!.game!, w = g.world; return { held: w.party.flags.q_end_arrive === 1, at: `${w.state.mapId} ${w.state.x},${w.state.y}` }; });
  // The Hearth after each ending: on the title over the saved company (its column's light and swing, a patch of its sky), and
  // from the shelf looking south at it, the night's warm light over the hills and the noon sky's colour.
  const hearthAfter = await page.evaluate(async () => {
    const load: Load = (p) => import(p);
    const T = await load<typeof import('../../src/ui/title.ts')>('/src/ui/title.ts'), V = await load<typeof import('../../src/ui/viewport.ts')>('/src/ui/viewport.ts');
    const g = window.__game!.game!, w = g.world, flags = { ...w.party.flags }, minutes = w.state.minutes;
    const avg = (d: Uint8ClampedArray): number[] => { const t = [0, 0, 0]; for (let i = 0; i < d.length; i += 4) for (let k = 0; k < 3; k++) t[k] += d[i + k]; return t.map((x) => Math.round(x / (d.length / 4))); };
    const title = (): { light: number; swing: number; sky: number[] } => {
      g.saveGame();
      const t = new T.TitleScreen(true), cv = document.createElement('canvas');
      cv.width = 640; cv.height = 360;
      const tc = cv.getContext('2d', { willReadFrequently: true })!, sums: number[] = [];
      for (let frame = 0; frame < 60; frame++) {
        t.render(g, tc, frame);
        const d = tc.getImageData(310, 130, 20, 48).data;
        let sum = 0; for (let i = 0; i < d.length; i += 4) sum += d[i] + d[i + 1];
        sums.push(sum);
      }
      return { light: sums.reduce((a, b) => a + b, 0) / sums.length, swing: Math.max(...sums) - Math.min(...sums), sky: avg(tc.getImageData(20, 20, 60, 40).data) };
    };
    const W = 400, H = 268, c = document.createElement('canvas'), sky = document.createElement('canvas');
    c.width = sky.width = W; c.height = sky.height = H;
    const ctx = c.getContext('2d', { willReadFrequently: true })!, skyCtx = sky.getContext('2d', { willReadFrequently: true })!;
    const view = (minute: number): void => {
      w.travel('shelf', 16, 6, 2);
      w.state.minutes = Math.floor(minutes / 1440) * 1440 + 1440 + minute;
      w['cached'] = { seed: w.state.weatherSeed!, minutes: w.state.minutes, region: w.region, weather: { cloud: 0.1, precip: 0, snow: 0, fog: 0, wind: 0, windDir: 0, storm: 0, temp: 12, cover: 0, wet: 0 } };
      skyCtx.clearRect(0, 0, W, H); ctx.clearRect(0, 0, W, H); V.paintScene(ctx, skyCtx, w, { x: 0, y: 0, w: W, h: H });
    };
    const out: Record<string, { title: { light: number; swing: number; sky: number[] }; warm: number; noon: number[] }> = {};
    for (const [k, f] of [['none', ''], ['relit', 'q_end_reignite'], ['opened', 'q_end_arrive'], ['finished', 'q_end_finish']]) {
      for (const e of ['q_end_reignite', 'q_end_arrive', 'q_end_finish']) delete w.party.flags[e];
      if (f) w.party.flags[f] = 1;
      view(0);
      const d = ctx.getImageData(0, 0, W, H / 2).data;
      let warm = 0; for (let i = 0; i < d.length; i += 4) warm += Math.max(0, d[i] - d[i + 2] - 4);
      view(720);
      out[k] = { title: title(), warm, noon: avg(skyCtx.getImageData(0, 0, W, 40).data) };
    }
    g.store!.removeItem('hearth-of-caldera.save');
    w.party.flags = flags; w.state.minutes = minutes; w['cached'] = null; w.travel('shelf', 16, 6, 2);
    return out;
  });
  const pages = [1, 2, 3].map((n) => `EndingScreen The Hull Opened ${n}`).join(' > ');
  ok(endingTops.join(' > ') === `ChoiceScreen > MessageScreen > ${pages} > ${endingStart.under}` && endingAfter.held && endingAfter.at === endingStart.at,
    `an answer that takes an ending shows its words, then its three pages, and after the last the company stands where it stood (${endingTops.join(' > ')}; ${endingAfter.at})`);
  const h = hearthAfter, far = (a: number[], b: number[]): number => a.reduce((s, x, i) => s + Math.abs(x - b[i]), 0);
  ok(h.relit.title.swing === 0 && h.relit.title.light > h.none.title.light && h.finished.title.swing === 0 && h.finished.title.light > h.relit.title.light && h.opened.title.swing > 0,
    `the title over the saved company: relit at full and still, opened flickering as at five, finished harder (light ${[h.none, h.relit, h.opened, h.finished].map((x) => x.title.light.toFixed(0)).join(', ')}; swing ${[h.none, h.relit, h.opened, h.finished].map((x) => x.title.swing).join(', ')})`);
  ok(far(h.opened.title.sky, h.none.title.sky) > 30 && far(h.opened.noon, h.none.noon) > 60 && far(h.relit.noon, h.none.noon) < 4 && far(h.finished.noon, h.none.noon) < 4 && far(h.relit.title.sky, h.none.title.sky) < 4,
    `the sky is another colour after the Hull Opened, on the title and by day, and only then (noon ${h.none.noon.join('/')} against ${h.opened.noon.join('/')})`);
  ok(h.relit.warm > h.none.warm && Math.abs(h.opened.warm - h.relit.warm) <= h.relit.warm / 100 && h.finished.warm > h.relit.warm,
    `by night the Hearth stands at full once relit or opened, and harder once finished (${[h.none, h.relit, h.opened, h.finished].map((x) => x.warm).join(', ')})`);
}
