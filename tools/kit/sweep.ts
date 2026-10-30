// The crack sweep's plan (#953): the views of the maps asked for, each an open square and a facing, and
// of each whether its flat window holds anything to paint, which window it is and whether a wall stands
// beside the party. The sweep that paints it is tools/smoke/cracks.ts's, its command line
// tools/sweep.ts. Of tools/kit/, so that the page and a suite can both load it: it takes src alone
// and no Node module (the layers check, tools/tests/layers.ts).
//
// The sweep paints a view twice over two flat backdrops and reads the 32 rows about the horizon. It
// reports a gap between two faces only where the view with its hills laid flat shows it too, or the
// view's edge where a wall stands beside the party and the backdrop shows there. Over a backdrop nothing
// but a face reaches those rows: the floor starts 24 px below the horizon at the far end of the view and
// a ceiling 24 px above it, and the billboards, the landmarks and the sky stay out. So a view is skipped
// where no square of its window (the 35 of VIEW_DEPTH by VIEW_LATERAL, all in sight in the sweep's scene)
// stands as a wall, a house, a tent, a door or the void on the map laid flat, as the painter has it
// (`standsAt`, which reads the drawn cell and `hillOver`): its flat band can show nothing but the
// backdrop, and a wall beside the party is a square of the window, so none stands there. A kept view's
// window is the key its flat band is painted from, once for every view that shares it: the map's kind;
// on each square of the window what stands there, and of a face its door, whether it is a house, its
// wall's style, its dressing and what hangs on it; and on the squares past the window that a face reads
// to join the next (`own`, viewport.ts: one farther ahead, one farther out), whether one stands. The
// faces are geometry, so alike windows paint alike bands; the audit (SMOKE_SWEEP_AUDIT) holds the key
// to the painter, view by view, as the painter changes.
import type { GameMap } from '../../src/game/map.ts';
import type { Cell } from '../../src/game/mapdef.ts';
import type { Facing } from '../../src/game/types.ts';
import { VIEW_DEPTH, VIEW_LATERAL, isSolidWall, viewCell } from '../../src/game/world.ts';
import { drawnAt, isGateway, looksHouse, standsAt, wallDressing } from '../../src/ui/viewport.ts';

/** A map to sweep: all four ways from every open square, or one way, (x + y) % 4, as the floors are. */
export interface Sweep { readonly id: string; readonly all: boolean }

/** Where the maps are: the world itself in the page, `atlasOf` in Node; `locate` finds a zone of the outdoors. */
export interface Atlas {
  readonly maps: Readonly<Record<string, GameMap>>;
  locate(id: string, x: number, y: number): { mapId: string; x: number; y: number };
}

/**
 * A view, at a square in the map's own squares (a zone's, for a zone of the outdoors): `win` the window
 * its flat band is painted from, -1 where it is skipped; `beside` a wall beside the party, where the
 * view with its hills is painted whatever its window shows.
 */
export interface View { readonly id: string; readonly x: number; readonly y: number; readonly f: Facing; win: number; beside: boolean }

/** The plan: every view in the order the sweep walks them, and of each window its first view (`refs`), whose flat band stands for all of its. */
export interface Plan {
  readonly views: readonly View[];
  readonly maps: number;
  readonly skipped: number;
  readonly windows: number;
  /** Kept views with a wall beside the party. */
  readonly beside: number;
  readonly refs: readonly number[];
}

/** The pairs of paints a shard makes in about four minutes on CI's runner, the view with its hills or the flat window over both backdrops: it sets how many shards a plan calls for. */
export const PAIRS_PER_SHARD = 60_000;

const FOUR: readonly Facing[] = [0, 1, 2, 3];

/** Any backdrop will do: over one, `standsAt` takes a tent for the wall it stands in for, as the sweep's paint does. */
const OVER = '#ff00ff';

/** The maps as a world has them, for Node: `locate` as World's, a zone found on the map that holds it. */
export function atlasOf(maps: Readonly<Record<string, GameMap>>): Atlas {
  return {
    maps,
    locate(id, x, y) {
      if (!maps[id]) for (const m of Object.values(maps)) { const z = m.zones.find((q) => q.id === id); if (z) return { mapId: m.id, x: x + z.x, y: y + z.y }; }
      return { mapId: id, x, y };
    },
  };
}

/**
 * Lay a map's hills flat until the function it returns is called, as the sweep paints them: each square
 * drawn as a hill, the void whose look is one among them, read as grass.
 */
export function layFlat(m: GameMap): () => void {
  const at = m.at;
  m.at = (x: number, y: number): Cell => {
    const c = at.call(m, x, y), drawn = c.look ?? c;
    if (drawn.terrain !== 'hills') return c;
    const grass: Cell = { ...drawn, terrain: 'grass' };
    return c.look ? { ...c, look: grass } : grass;
  };
  return () => { Reflect.deleteProperty(m, 'at'); };
}

/** What stands on a square of the window, as the faces are painted from it: the void, or a face's kind, door, house or gate, style, dressing and what hangs on it. */
function token(m: GameMap, x: number, y: number): string {
  const c = drawnAt(m, x, y);
  if (c.solid === 'void') return 'v';
  const hangs = m.featuresAt(x, y).filter((q) => q.kind !== 'event').map((q) => q.kind).join('+');
  return `${c.solid}:${c.door}:${looksHouse(m, x, y) ? 'h' : isGateway(m, x, y) ? 'g' : ''}:${m.paletteAt(x, y).wallStyle}:${wallDressing(m, x, y) ?? ''}:${hangs}`;
}

/**
 * Of every square of a map laid flat, whether it is drawn as a face (`isSolidWall` of the cell as the
 * scene draws it, `drawnAt`), which `solidAt` asks before it stands a square: so a square that is not is
 * passed over without it.
 */
function facesOf(m: GameMap): Uint8Array {
  const g = new Uint8Array(m.width * m.height);
  for (let y = 0; y < m.height; y++) for (let x = 0; x < m.width; x++) g[y * m.width + x] = isSolidWall(drawnAt(m, x, y)) ? 1 : 0;
  return g;
}

/** The window of a view, on the map laid flat (`faces` its faces): its key, or null where no square of it stands. */
export function windowKey(m: GameMap, px: number, py: number, f: Facing, faces = facesOf(m)): string | null {
  const { solidAt } = standsAt(m, px, py, f, OVER);
  const key: string[] = [m.kind];
  let any = false;
  for (let d = 0; d <= VIEW_DEPTH + 1; d++) for (let l = -VIEW_LATERAL - 1; l <= VIEW_LATERAL + 1; l++) {
    const ahead = d > VIEW_DEPTH, out = Math.abs(l) > VIEW_LATERAL;
    if (ahead && out) continue;
    const c = viewCell(px, py, f, d, l), stands = (!m.inBounds(c.x, c.y) || faces[c.y * m.width + c.x] === 1) && solidAt(d, l);
    if (ahead || out) key.push(stands ? '#' : '.');
    else if (!stands) key.push('.');
    else { any = true; key.push(token(m, c.x, c.y)); }
  }
  return any ? key.join(' ') : null;
}

/** The plan of the maps asked for: their views, the open squares each way asked, in the order the old sweep walked them. */
export function plan(atlas: Atlas, sweeps: readonly Sweep[]): Plan {
  const views: View[] = [], keys = new Map<string, number>(), refs: number[] = [], faces = new Map<GameMap, Uint8Array>();
  let skipped = 0, beside = 0;
  for (const { id, all } of sweeps) {
    const at = atlas.locate(id, 0, 0), m = atlas.maps[at.mapId], z = m.zones.find((q) => q.id === id);
    const mw = z ? z.w : m.width, mh = z ? z.h : m.height, from = views.length;
    for (let y = 0; y < mh; y++) for (let x = 0; x < mw; x++) {
      const c = m.at(at.x + x, at.y + y);
      if (c.solid !== 'none' || c.door !== 'none') continue;
      for (const f of all ? FOUR : [((x + y) % 4) as Facing]) {
        const s = standsAt(m, at.x + x, at.y + y, f);
        views.push({ id, x, y, f, win: -1, beside: s.solidAt(0, -1) || s.solidAt(0, 1) });
      }
    }
    const undo = layFlat(m);
    try {
      const g = faces.get(m) ?? facesOf(m);
      faces.set(m, g);
      for (let i = from; i < views.length; i++) {
        const v = views[i], key = windowKey(m, at.x + v.x, at.y + v.y, v.f, g);
        if (key === null) { skipped++; continue; }
        let k = keys.get(key);
        if (k === undefined) { k = refs.length; keys.set(key, k); refs.push(i); }
        v.win = k;
        if (v.beside) beside++;
      }
    } finally { undo(); }
  }
  return { views, maps: sweeps.length, skipped, windows: refs.length, beside, refs };
}

/**
 * Shard i of n (i from 1): every n-th window of the plan with all its views, and every n-th skipped
 * view, whatever map each is on. A window is painted in one shard alone, and its first view, whose flat
 * band stands for the rest, is in the shard that holds them.
 */
export function shard(p: Plan, i: number, n: number): View[] {
  return p.views.filter((v, j) => (v.win >= 0 ? v.win : j) % n === i - 1);
}

/** The pairs a plan paints: each window flat, and the view with its hills where a wall stands beside the party; in the audit, both for every view. */
export function pairsOf(p: Plan, audit = false): number { return audit ? 2 * p.views.length : p.windows + p.beside; }

/** How many shards a plan calls for: one for each PAIRS_PER_SHARD pairs it paints, and none where no map is swept. */
export function shardsFor(p: Plan, audit = false): number {
  return p.maps === 0 ? 0 : Math.max(1, Math.ceil(pairsOf(p, audit) / PAIRS_PER_SHARD));
}
