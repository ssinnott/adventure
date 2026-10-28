// The first-person viewport, split into its parts in ui/view/ (#1028). This path re-exports every name it
// exported before the split, so nothing that imports it changes and the smoke's reads of it by path stand;
// it holds no drawing. It also exports `paintOn`, which makes a frame's Paint, for the smoke's hill
// painted alone (#1029).
//
// view/compositor.ts draws the view and paints its scene from the parts: view/sky.ts, view/weather.ts,
// view/floor.ts, view/walls.ts, view/roofs.ts and view/tents.ts, and each ground as its look in view/ground/
// gives it (#1030). view/model.ts is what the Node suites and the sweep's plan take, with no canvas, and
// view/common.ts what every part takes.

export { VIEW_W, VIEW_H, paintOn } from './view/common.ts';
export type { ViewRect, Flame } from './view/common.ts';
export { murkOf, washes, heatherBloom, iceColor, cropColor, fieldAt, standsAt, hedgeColor, isHouse, DRESSINGS, DRESSING_RATES, wallDressing, isTent, tentOf } from './view/model.ts';
export type { Field, Dressing } from './view/model.ts';
export { drawSkyBand, DUSK, drawDusk } from './view/sky.ts';
export type { SkyOpts } from './view/sky.ts';
export { drawWeather } from './view/weather.ts';
export { GROUND, SNOW_HOLD } from './view/ground/index.ts';
export { hillBody } from './view/ground/hills.ts';
export { LANDMARK_REACH, paintedFlames, drawViewport, paintScene } from './view/compositor.ts';
export type { ViewMonster } from './view/compositor.ts';
export { isSolidWall } from '../game/world.ts';
