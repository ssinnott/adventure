// What the first-person view keeps between frames (#1073): the scenes `drawViewport` paints
// (compositor.ts), `Scenes`, which holds the one drawn last and the other facings of the square the
// party stands on, each under its place (`placeKey`: everything its paint reads that the world says at
// once, but the facing) and drawn again for a facing other than the last only while all else its paint
// read holds (`readsOf`, `sameReads`). It takes no canvas of its own, the compositor handing in how one
// is made, so the Node suite drives it (tools/tests/kept.ts).
//
// What a kept scene holds and when it goes: at most `KEPT_MAX` scenes, each two canvases the rect's
// size (857,600 bytes at the view's 400 by 268), so 3.4 MB at most; a place that changes (a step, a
// minute, a door, a flag, a light, the weather's seed, the map, the rect's size, the Stones or the
// ending) drops every scene but keeps their canvases to paint the next into, and the facing alone picks
// one of the square's four.
import type { World } from '../../game/world.ts';
import type { GameMap } from '../../game/map.ts';
import type { Cell, Feature, Landmark } from '../../game/mapdef.ts';
import type { Facing } from '../../game/types.ts';
import type { Weather } from '../../game/weather.ts';
import type { Tables } from '../../game/tables.ts';
import { VIEW_DEPTH } from '../../game/world.ts';
import type { Flame, ViewRect } from './common.ts';

/** The most scenes kept: one to each facing of the square the party stands on. */
export const KEPT_MAX = 4;
/** How far about the party, in squares each way, a kept scene's cells and features are read back: past the deepest a paint reads. */
export const READ_REACH = VIEW_DEPTH + 4;

/**
 * Everything a scene's paint reads that the world says at once, but the facing: the map and the
 * square, how far the party sees, the minute and the weather's seed (the sky, the light, the season,
 * the tide and the weather), whether a light is up, how many doors are opened and flags set (each
 * only ever added to), the landmarks lit, the Stones restored, the ending taken and the rect's size.
 * It is the key the view kept its one scene under before #1073, the facing aside.
 */
export function placeKey(world: World, r: ViewRect): string {
  const { state, party, map } = world;
  return [state.mapId, state.x, state.y, world.sight, state.minutes, state.weatherSeed, state.light > 0 ? 1 : 0, Object.keys(world.mapState.doors).length, Object.keys(party.flags).length, map.landmarks.map((l) => (l.lit && party.flags[l.lit] ? 1 : 0)).join(''), world.stones, world.hearth.ending ?? '', r.w, r.h].join('|');
}

/**
 * What else a scene's paint reads, read back to tell whether it would paint the same again: the map
 * and its landmarks, the weather read, the tables, the cells within `READ_REACH` of the party (a cell
 * laid anew is another cell) and each feature among them, with whether it is there now (a feature
 * comes and goes by its hours, its flags, the items carried, what is seen and slain).
 */
export interface Reads {
  map: GameMap; landmarks: readonly Landmark[]; weather: Weather | null; tables: Tables;
  cells: readonly (Cell | null)[]; features: readonly Feature[]; there: readonly boolean[];
}

export function readsOf(world: World): Reads {
  const map = world.map, { x: px, y: py } = world.state, cells: (Cell | null)[] = [];
  for (let y = py - READ_REACH; y <= py + READ_REACH; y++) for (let x = px - READ_REACH; x <= px + READ_REACH; x++) cells.push(map.inBounds(x, y) ? map.at(x, y) : null);
  const features = map.features.filter((f) => Math.abs(f.x - px) <= READ_REACH && Math.abs(f.y - py) <= READ_REACH);
  return { map, landmarks: map.landmarks, weather: world.underSky ? world.weather : null, tables: world.tables, cells, features, there: features.map((f) => world.present(f)) };
}

export function sameReads(a: Reads, b: Reads): boolean {
  if (a.map !== b.map || a.landmarks !== b.landmarks || a.weather !== b.weather || a.tables !== b.tables) return false;
  if (a.cells.length !== b.cells.length || a.features.length !== b.features.length) return false;
  for (let i = 0; i < a.cells.length; i++) if (a.cells[i] !== b.cells[i]) return false;
  for (let i = 0; i < a.features.length; i++) if (a.features[i] !== b.features[i] || a.there[i] !== b.there[i]) return false;
  return true;
}

/** A canvas as the store needs it: the compositor's are the page's, the suite's are stand-ins. */
export interface Sized { width: number; height: number }

/** One scene: its facing, everything but the sky and the sky behind it, the flames it left alight and what else its paint read. */
export interface Scene<C extends Sized> { facing: Facing; canvas: C; sky: C; flames: Flame[]; reads: Reads }

/** How a scene was had: the one drawn last, another facing of the square kept, or painted now. */
export type Had = 'last' | 'kept' | 'painted';

/** The scenes the view keeps (see the header): one to each facing of the place, the place's alone. */
export class Scenes<C extends Sized> {
  private place = '';
  private kept: Scene<C>[] = [];
  private last: Scene<C> | null = null;
  /** The canvases of the scenes a change of place dropped, to paint the next into. */
  private spare: { canvas: C; sky: C }[] = [];
  constructor(private readonly make: () => C) {}

  /**
   * The scene for the world at `r`: the last drawn while its place and facing hold (as the one kept
   * scene always was), the facing's own of the square while what else it read holds, or else one
   * `paint` paints now into the canvases sized to the rect, returning the flames it left alight.
   */
  scene(world: World, r: ViewRect, paint: (canvas: C, sky: C) => Flame[]): { scene: Scene<C>; had: Had } {
    const place = placeKey(world, r), facing = world.state.facing;
    if (place !== this.place) { this.place = place; this.spare.push(...this.kept); this.kept = []; this.last = null; }
    let s = this.kept.find((k) => k.facing === facing);
    if (s && s === this.last) return { scene: s, had: 'last' };
    if (s && sameReads(s.reads, readsOf(world))) { this.last = s; return { scene: s, had: 'kept' }; }
    if (!s) {
      const { canvas, sky } = this.spare.pop() ?? { canvas: this.make(), sky: this.make() };
      s = { facing, canvas, sky, flames: [], reads: readsOf(world) };
      this.kept.push(s);
    }
    s.canvas.width = s.sky.width = r.w; s.canvas.height = s.sky.height = r.h;
    s.flames = paint(s.canvas, s.sky);
    s.reads = readsOf(world);
    this.last = s;
    return { scene: s, had: 'painted' };
  }

  /** How many scenes are kept, how many canvases there are in all (the spares too) and their bytes. */
  held(): { scenes: number; canvases: number; bytes: number } {
    const all = [...this.kept, ...this.spare];
    return { scenes: this.kept.length, canvases: all.length * 2, bytes: all.reduce((n, s) => n + 4 * (s.canvas.width * s.canvas.height + s.sky.width * s.sky.height), 0) };
  }

  /** Every scene dropped, the canvases with them: the next frame paints afresh. */
  drop(): void { this.place = ''; this.kept = []; this.last = null; this.spare = []; }
}
