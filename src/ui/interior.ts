// The interiors of the town's businesses, which the viewport shows while the party is inside one
// (the visit is screens.ts's InteriorScreen). Each Interior names a Scene in ./interiors/<area>/: a room
// painted once into an offscreen canvas and multiplied by its light map (see ./interiors/kit.ts),
// with its flames, glows and drifting motes drawn over it every frame.
import type { Interior } from '../game/map.ts';
import type { ViewRect } from './viewport.ts';
import type { Light, Scene, Stage } from './interiors/kit.ts';
import { STAGE_W, STAGE_H, drawLights, lightMap } from './interiors/kit.ts';
import { mix } from '../lib/art/palettes.ts';
import { SCENES as SHELF } from './interiors/shelf/index.ts';
import { SCENES as THORNMARK } from './interiors/thornmark/index.ts';
import { SCENES as SALTREACH } from './interiors/saltreach/index.ts';
import { SCENES as SUNDERWOOD } from './interiors/sunderwood/index.ts';
import { SCENES as KILNS } from './interiors/kilns/index.ts';
import { SCENES as RIMEWATER } from './interiors/rimewater/index.ts';

/** Every business's scene, an area's at a time: an interior with no scene fails the typecheck here. */
export const SCENES: Record<Interior, Scene> = { ...SHELF, ...THORNMARK, ...SALTREACH, ...SUNDERWOOD, ...KILNS, ...RIMEWATER };

/** The last room painted: repainted when the business, the size or the hour (to an eighth of a day's light) changes. */
let painted: { key: string; room: HTMLCanvasElement; lights: Light[] } | null = null;

function canvas(w: number, h: number): HTMLCanvasElement {
  const c = document.createElement('canvas'); c.width = w; c.height = h; return c;
}
/** A context that draws in stage units onto a canvas of the view's size. */
function stageCtx(c: HTMLCanvasElement): CanvasRenderingContext2D {
  const g = c.getContext('2d')!;
  g.setTransform(c.width / STAGE_W, 0, 0, c.height / STAGE_H, 0, 0);
  return g;
}

function paint(scene: Scene, key: string, r: ViewRect, daylight: number): { key: string; room: HTMLCanvasElement; lights: Light[] } {
  const s: Stage = { daylight, lights: [], pools: [] };
  const room = canvas(r.w, r.h), map = canvas(r.w, r.h);
  scene.paint(stageCtx(room), s);
  lightMap(stageCtx(map), mix(scene.ambient[0], scene.ambient[1], daylight), s.pools);
  const g = room.getContext('2d')!;
  g.setTransform(1, 0, 0, 1, 0, 0);
  g.globalCompositeOperation = 'multiply'; g.drawImage(map, 0, 0);
  g.globalCompositeOperation = 'source-over';
  return { key, room, lights: s.lights };
}

/** Draw a business's interior into `r`: `daylight` for the windows and the yards, `frame` for what moves. */
export function drawInterior(ctx: CanvasRenderingContext2D, kind: Interior, r: ViewRect, daylight: number, frame: number): void {
  const key = `${kind}|${Math.round(daylight * 8)}|${r.w}x${r.h}`;
  if (!painted || painted.key !== key) painted = paint(SCENES[kind], key, r, daylight);
  ctx.save();
  ctx.beginPath(); ctx.rect(r.x, r.y, r.w, r.h); ctx.clip();
  ctx.drawImage(painted.room, r.x, r.y);
  ctx.translate(r.x, r.y); ctx.scale(r.w / STAGE_W, r.h / STAGE_H);
  drawLights(ctx, painted.lights, frame);
  ctx.restore();
}
