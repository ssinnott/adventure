// The plain views (#1108): how much of an outdoor map a company sees as one ground with nothing drawn
// on it, measured on the map as written, as the density rule measures steps (#984). The plain suite
// holds every outdoor map to the cap; the work that breaks a map up (#1106) and the scaffold's texture
// (#1107) take the measure from here. No canvas and no world: what the view would draw is asked of the
// view's own pure functions.
//
// A view is a square a company can stand on (as density's) and a facing, with the window ahead of it,
// `VIEW_LATERAL` each way and `VIEW_DEPTH` deep from the company's own row (game/world/sight.ts), 7 by 5,
// wholly inside its map. It is plain when every square of the window shows one ground in one look and
// nothing is drawn standing in it: no solid or door; no ground whose look stands trees at its sides; no
// water, deep water or chasm, which no company stands on, so that one is a second ground; no scatter
// (`scatterAt`, #1103) and no feature the view draws (`featuresOn`, #1110), every feature taken as the
// map holds it, unspent and present. A ground's look at a square is its variant (`variantAt`, #1101), a
// ground of its own as the owner has it, and what its plot lays (a field's crop, rows and hedges; a
// road's verge), so farmland, three squares by two to a field, is never plain. Not counted: line of
// sight; groups and people, who move and are not the map's; the colour's drift and the region's tints,
// colour alone; a hill's marks (#1105), its look's as a variant's marks are, so a range of slag heaps
// with a plume or two is still one ground; where two grounds meet (#1100), already two. Scatter and
// variants fall by the map's own squares and id: laid into the outdoors they fall by the outdoors', so
// a share as played differs a little.
//
// Without the pieces of #1094 (variants, scatter, features and fields), this is the survey's measure
// of `b4651c2`: 36,714 of 205,840 views plain.
import { GameMap } from '../../../src/game/map.ts';
import type { MapDef } from '../../../src/game/mapdef.ts';
import { VIEW_DEPTH, VIEW_LATERAL, viewCell } from '../../../src/game/world.ts';
import { NORTH } from '../../../src/game/types.ts';
import type { Facing } from '../../../src/game/types.ts';
import { GROUND, variantAt } from '../../../src/ui/view/ground/index.ts';
import { scatterAt } from '../../../src/ui/view/scatter.ts';
import { featuresOn } from '../../../src/ui/view/features.ts';

/**
 * The most of an outdoor map's views that may be plain, one cap for every map. The issue's first guess was
 * 25%, when 18% of the outdoors was plain; with #1094's pieces 1.4% is, no map reaches 25% and the three
 * plainest (19.5 to 23.7%) stand apart from the rest (10.3% and under): 15% lies between.
 */
export const PLAIN_CAP = 0.15;

/** A view: the square a company stands on, the way it faces and whether what it sees is plain. */
interface View { x: number; y: number; f: Facing; plain: boolean }

/**
 * What a square shows as ground, the same string for two squares that look alike, or null where something
 * stands on it or it is no ground: its terrain, its variant and what its plot lays, its plot read facing
 * north so that a square has one look from every side.
 */
function lookOf(m: GameMap, x: number, y: number): string | null {
  const c = m.at(x, y), look = GROUND[c.terrain];
  if (c.solid !== 'none' || c.door !== 'none' || look.sides) return null;
  // Every feature as the map holds it: none spent, all present.
  if (scatterAt(m, x, y) || featuresOn({ map: m, present: () => true, used: () => false }, x, y).length) return null;
  const plot = look.plot?.(m, x, y, NORTH);
  return `${c.terrain}/${variantAt(c.terrain, x, y, m)?.name ?? ''}/${plot ? `${plot.crop} ${plot.away} ${plot.hedge.join()}` : ''}`;
}

/** Every view of a map: each square a company can stand on, each way it faces, its window wholly inside the map. */
export function viewsOf(m: GameMap): View[] {
  const looks = m.cells.map((_, i) => lookOf(m, i % m.width, Math.floor(i / m.width)));
  const lookAt = (q: { x: number; y: number }): string | null => looks[q.y * m.width + q.x];
  const out: View[] = [];
  for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) {
    const p = m.passable(x, y, { keys: 1 });
    if (p !== 'ok' && p !== 'unlock') continue;
    for (const f of [0, 1, 2, 3] as Facing[]) {
      // The window is a rectangle: inside the map where its far corners are.
      if (![-VIEW_LATERAL, VIEW_LATERAL].every((l) => { const q = viewCell(x, y, f, VIEW_DEPTH, l), n = viewCell(x, y, f, 0, l); return m.inBounds(q.x, q.y) && m.inBounds(n.x, n.y); })) continue;
      const here = lookAt({ x, y });
      let plain = here !== null;
      for (let d = 0; plain && d <= VIEW_DEPTH; d++) for (let l = -VIEW_LATERAL; plain && l <= VIEW_LATERAL; l++) plain = lookAt(viewCell(x, y, f, d, l)) === here;
      out.push({ x, y, f, plain });
    }
  }
  return out;
}

/** A map's views, how many are plain and their share, 0 where it has none. */
export function plainShare(def: MapDef): { views: number; plain: number; share: number } {
  const all = viewsOf(new GameMap(def)), plain = all.filter((v) => v.plain).length;
  return { views: all.length, plain, share: all.length ? plain / all.length : 0 };
}

/** Why an outdoor map is over the cap, or '' if it is within it; and the line it is reported with. */
export function judge(def: MapDef): { why: string; line: string } {
  const r = plainShare(def), pct = (100 * r.share).toFixed(1);
  return { why: r.share > PLAIN_CAP ? `over ${100 * PLAIN_CAP}%` : '', line: `${def.id}: ${pct}% of ${r.views} views plain (${r.plain})` };
}
