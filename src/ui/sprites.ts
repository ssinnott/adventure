// Vector sprites for the viewport and the combat screen, cel-shaded with the engine's helpers
// through a Brush. The scenery lives here; the monsters live in ./monsters/, one module per family,
// and `drawMonsterSprite` dispatches to them by sprite kind. Every sprite draws front-facing,
// centred on (x, y) with y the ground line and `h` the intended height. `tone` darkens with
// distance; `flash` paints the hit frame white.
import type { MonsterSprite } from '../game/monsters.ts';
import { shade } from '../lib/art/palettes.ts';
import { celBall, celCapsule, celPoly, celTaper, band } from '../lib/art/shading.ts';
import { B, paintFor, stroke } from './monsters/common.ts';
import type { MonsterDrawer } from './monsters/common.ts';
import * as rat from './monsters/rat.ts';
import * as slime from './monsters/slime.ts';
import * as wolf from './monsters/wolf.ts';
import * as boar from './monsters/boar.ts';
import * as spider from './monsters/spider.ts';
import * as bandit from './monsters/bandit.ts';
import * as cultist from './monsters/cultist.ts';
import * as skeleton from './monsters/skeleton.ts';
import * as riftling from './monsters/riftling.ts';
import * as ogre from './monsters/ogre.ts';
import * as wraith from './monsters/wraith.ts';

export { groundShadow } from './monsters/common.ts';

// ---------------------------------------------------------------- scenery ----

export function drawTreeSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, variant: number): void {
  const conifer = variant >= 3;
  const trunk = shade('#5a3f2a', tone), leaf = shade(['#3f7a3a', '#4a8a3a', '#356a34', '#2f6a3a', '#3a7a4a'][variant], tone);
  if (conifer) {
    const h = u * 2.6, w = u * 1.2;
    celCapsule(ctx, B, x, y, x, y - h * 0.3, u * 0.12, trunk, 0);
    for (let i = 0; i < 3; i++) {
      const ty = y - h * (0.25 + i * 0.25), tw = w * (1 - i * 0.22), th = h * 0.36;
      celPoly(ctx, B, [x - tw / 2, ty, x, ty - th, x + tw / 2, ty], shade(leaf, 1 - i * 0.06), 0.4, 0.25);
    }
  } else if (variant === 2) {
    // A birch: pale trunk with dark marks, a taller, lighter crown.
    const h = u * 2.6, r = u * 0.6, bark = shade('#e8e4d8', tone);
    celTaper(ctx, B, x, y, x, y - h * 0.62, u * 0.11, u * 0.07, bark, 0.2);
    ctx.fillStyle = shade('#3a3630', tone);
    for (let i = 0; i < 5; i++) ctx.fillRect(Math.round(x - u * 0.08 + (i % 2) * u * 0.06), Math.round(y - h * (0.1 + i * 0.11)), Math.max(1, Math.round(u * 0.09)), Math.max(1, Math.round(u * 0.03)));
    const light = shade('#7ab848', tone);
    celBall(ctx, B, x - r * 0.5, y - h * 0.62, r * 0.55, shade(light, 0.9));
    celBall(ctx, B, x + r * 0.5, y - h * 0.66, r * 0.55, shade(light, 1.05));
    celBall(ctx, B, x, y - h * 0.82, r * 0.62, light);
  } else {
    const h = u * 2.3, r = u * 0.8;
    celTaper(ctx, B, x, y, x, y - h * 0.5, u * 0.16, u * 0.11, trunk, 0.2);
    // Branch hints.
    stroke(ctx, [x, y - h * 0.4, x - u * 0.35, y - h * 0.55], trunk, Math.max(1, u * 0.08));
    stroke(ctx, [x, y - h * 0.45, x + u * 0.3, y - h * 0.6], trunk, Math.max(1, u * 0.08));
    celBall(ctx, B, x - r * 0.55, y - h * 0.55, r * 0.62, shade(leaf, 0.92));
    celBall(ctx, B, x + r * 0.55, y - h * 0.58, r * 0.62, shade(leaf, 1.05));
    celBall(ctx, B, x, y - h * 0.72, r * 0.75, leaf);
    celBall(ctx, B, x - r * 0.2, y - h * 0.5, r * 0.5, shade(leaf, 0.85), false);
  }
}

export function drawRockSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number): void {
  const w = u * 1.3, h = u * 0.8;
  const c = shade('#7a7468', tone);
  celPoly(ctx, B, [x - w / 2, y, x - w * 0.4, y - h * 0.7, x - w * 0.1, y - h, x + w * 0.25, y - h * 0.85, x + w / 2, y - h * 0.4, x + w * 0.42, y], c, 0.4, 0.3);
  celPoly(ctx, B, [x - w * 0.4, y - h * 0.7, x - w * 0.1, y - h, x + w * 0.25, y - h * 0.85, x + w * 0.02, y - h * 0.62], shade(c, 1.15), 0.2, 0.2);
  celBall(ctx, B, x + w * 0.42, y - u * 0.12, u * 0.18, shade(c, 0.9), false);
}

export function drawMountainSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, variant: number): void {
  const w = u * 2.6, h = u * (1.7 + variant * 0.25);
  const c = shade('#6a6670', tone);
  celPoly(ctx, B, [x - w / 2, y, x - w * 0.22, y - h * 0.6, x - w * 0.08, y - h, x + w * 0.12, y - h * 0.8, x + w * 0.3, y - h * 0.55, x + w / 2, y], c, 0.45, 0.25);
  // Snow cap and a ridge line.
  celPoly(ctx, B, [x - w * 0.15, y - h * 0.78, x - w * 0.08, y - h, x + w * 0.12, y - h * 0.8, x + w * 0.05, y - h * 0.7, x - w * 0.02, y - h * 0.76], shade('#e8ecf0', tone), 0.3, 0.2);
  stroke(ctx, [x - w * 0.08, y - h, x - w * 0.02, y - h * 0.6, x + w * 0.06, y - h * 0.3], shade(c, 0.7), 1);
}

export function drawPillarSprite(ctx: CanvasRenderingContext2D, x: number, horizon: number, u: number, tone: number): void {
  const w = u * 0.5, c = shade('#8a8690', tone);
  celPoly(ctx, B, [x - w / 2, horizon + u, x - w * 0.4, horizon - u * 0.9, x + w * 0.4, horizon - u * 0.9, x + w / 2, horizon + u], c, 0.4, 0.3);
  band(ctx, B, x - w * 0.6, horizon - u, w * 1.2, u * 0.14, shade(c, 1.1));
  band(ctx, B, x - w * 0.6, horizon + u - u * 0.12, w * 1.2, u * 0.12, shade(c, 0.9));
}

// ---------------------------------------------------------------- monsters ----

/** Which family module draws each sprite kind. */
const FAMILY: Record<MonsterSprite, MonsterDrawer> = {
  rat: rat.draw,
  slime: slime.draw,
  wolf: wolf.draw, dire_wolf: wolf.draw, rift_hound: wolf.draw,
  boar: boar.draw,
  spider: spider.draw, thorn_spider: spider.draw, crab: spider.draw, rift_crawler: spider.draw,
  bandit: bandit.draw, archer: bandit.draw, brigand: bandit.draw, brigand_archer: bandit.draw,
  smuggler: bandit.draw, smuggler_bow: bandit.draw, smuggler_captain: bandit.draw,
  cultist: cultist.draw, zealot: cultist.draw, adept: cultist.draw, ashen_hand: cultist.draw,
  skeleton: skeleton.draw, bone_knight: skeleton.draw,
  riftling: riftling.draw, riftling_elder: riftling.draw, warden: riftling.draw, cut_warden: riftling.draw,
  ogre: ogre.draw,
  wraith: wraith.draw,
};

/**
 * How tall a monster draws on the combat screen. Xeen fills most of the window with the thing you
 * are fighting, so a lone enemy is drawn a quarter taller than the old flat size and a pair nearly
 * so. The row is always spaced the same, though, so every extra monster is width the neighbours do
 * not have: the height comes back down as the row fills, reaching the old size at five and going
 * under it at six, where the old flat size used to overlap badly.
 * @param size the def's size (1 = a full cell)
 * @param count how many monsters are in the row
 */
export function combatHeight(size: number, count: number): number {
  return (34 + size * 92) * Math.min(1, 1.25 - 0.09 * count);
}

/**
 * Draw a monster. `h` is the intended height in px; `frame` drives a small idle motion.
 */
export function drawMonsterSprite(ctx: CanvasRenderingContext2D, kind: MonsterSprite, x: number, y: number, h: number, tint: string, tone: number, frame: number, flash = false): void {
  B.flash(flash);
  FAMILY[kind](ctx, kind, x, y, h, paintFor(tint, tone, frame));
  B.flash(false);
}
