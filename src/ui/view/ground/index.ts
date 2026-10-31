// Every terrain's look in the view (#1030): `GROUND`, a record over the terrains made of their modules
// here, so that a terrain with no module of its own fails the typecheck; what the painters ask through it,
// the ground a square is drawn as (`asDrawn`) and its colour now at its cell (`groundColor`), drifting
// across the land by the cell's noise (`cellNoise`, #1098); and `SNOW_HOLD`, read off the looks for the
// suites. A new ground is a module beside these, its look, and its line below.

import type { Terrain } from '../../../game/mapdef.ts';
import { fbm } from '../../../game/atlas/painter.ts';
import { shade, mix } from '../../../lib/art/palettes.ts';
import { SNOW } from '../common.ts';
import type { Paint } from '../common.ts';
import type { GroundLook } from './look.ts';
import { floor } from './floor.ts';
import { grass } from './grass.ts';
import { dirt } from './dirt.ts';
import { road } from './road.ts';
import { sand } from './sand.ts';
import { water } from './water.ts';
import { deep } from './deep.ts';
import { swamp } from './swamp.ts';
import { lava } from './lava.ts';
import { stone } from './stone.ts';
import { snow } from './snow.ts';
import { hills } from './hills.ts';
import { farm } from './farm.ts';
import { woods } from './woods.ts';
import { deadwood } from './deadwood.ts';
import { crystal } from './crystal.ts';
import { chasm } from './chasm.ts';
import { salt } from './salt.ts';
import { heather } from './heather.ts';
import { tidal } from './tidal.ts';
import { ash } from './ash.ts';
import { pine } from './pine.ts';
import { ice } from './ice.ts';
import { peak } from './peak.ts';
import { cliff } from './cliff.ts';
import { steppe } from './steppe.ts';
import { dunes } from './dunes.ts';
import { vines } from './vines.ts';
import { volcano } from './volcano.ts';
import { vent } from './vent.ts';

/** Each terrain's look; a terrain left out fails the typecheck. */
export const GROUND: Record<Terrain, GroundLook> = {
  floor, grass, dirt, road, sand, water, deep, swamp, lava, stone, snow,
  hills, farm, woods, deadwood, crystal, chasm, salt, heather, tidal,
  ash, pine, ice,
  peak, cliff,
  steppe, dunes, vines, volcano, vent,
};

/** How white each terrain goes under lying snow: its look's `snow`, as the suites read it. */
export const SNOW_HOLD = Object.fromEntries(Object.entries(GROUND).map(([t, g]) => [t, g.snow])) as Record<Terrain, number>;

/** A square's ground as it is drawn: its look's `drawnAs` where it has one (the tidal ground at high water). */
export const asDrawn = (p: Paint, t: Terrain): Terrain => GROUND[t].drawnAs?.(p.env) ?? t;

/** How many squares across the land's swathes run, and how far the noise is stretched to reach a look's bounds. */
const SWATHE = 14, STRETCH = 4.5;

/**
 * The land's noise at a cell, 0 to 1 (#1098): the atlas's `fbm`, smooth over some `scale` squares, its
 * `salt` (the map's id, so no two maps lie alike) parting one land from another; at the default scale,
 * the swathes a ground's colour drifts by. A function of the cell alone, of any map or of the atlas, so
 * a square looks the same from wherever it is seen.
 */
export function cellNoise(x: number, y: number, salt: string, scale = SWATHE): number {
  let h = 0x811c9dc5;
  for (let i = 0; i < salt.length; i++) h = Math.imul(h ^ salt.charCodeAt(i), 0x01000193);
  return fbm(x / scale, y / scale, h, 2);
}

/**
 * A look's colour drifted by the land at a cell: toward one of its two colours, as far as the swathe lies
 * from the middle, eased so that most land lies well toward one or the other and none past its look's `by`.
 */
function drifted(look: GroundLook, c: string, x: number, y: number, salt: string): string {
  if (!look.drift) return c;
  const s = Math.max(-1, Math.min(1, (cellNoise(x, y, salt) - 0.5) * STRETCH)), [low, high] = look.drift.toward;
  return mix(c, s < 0 ? low : high, Math.abs(s) * (2 - Math.abs(s)) * look.drift.by);
}

/**
 * The colour of a ground at a cell, as the floors draw it: its look's, drifted by the land there, darker
 * when wet where rain darkens it, whitened by lying snow. Underground it is the palette's floor.
 */
export function groundColor(p: Paint, t: Terrain, floorPal: string, x: number, y: number, crop = 0): string {
  const { env } = p, kind = p.map.kind;
  if (kind === 'dungeon') return floorPal;
  const look = GROUND[asDrawn(p, t)];
  // In this order: the look's colour today, the land's drift at the cell, then rain and snow over it.
  let c = look.color(env.day, crop);
  c = drifted(look, c, x, y, p.map.id);
  if (env.wet > 0 && look.wets) c = shade(c, 1 - 0.18 * env.wet);
  const s = env.cover * look.snow;
  return s > 0 ? mix(c, SNOW, s) : c;
}
