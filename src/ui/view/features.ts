// The wilderness features in the view (#1110): which the view draws on a square, each as the automap
// marks it (`markOf`, game/ink.ts) so the two show one map, and how it stands there. A spent chest,
// cairn, shrine, fountain or statue is gone, a burnt den is its ruin and a camp always shows; an event
// is never drawn, as the secret is found and never told, and a person and a business are not drawn
// here (a business hangs its sign over its door, view/walls.ts). The drawings are ../scenery.ts's.
import type { World } from '../../game/world.ts';
import type { Feature } from '../../game/mapdef.ts';
import { markOf } from '../../game/ink.ts';
import { FEATURE_KINDS, drawFeatureSprite } from '../scenery.ts';
import type { FeatureKind } from '../scenery.ts';
import { hash } from '../paint/brush.ts';
import { unit, pixel, boardTone } from './common.ts';
import type { Paint } from './common.ts';

/** A feature the view draws on its square, and whether as its ruin (a burnt den). */
interface DrawnFeature { f: Feature & { kind: FeatureKind }; ruin: boolean }

const drawsKind = (f: Feature): f is Feature & { kind: FeatureKind } => (FEATURE_KINDS as readonly string[]).includes(f.kind);

/** The features the view draws on a square of the party's map: each one the automap marks, of a kind drawn. */
export function featuresOn(world: Pick<World, 'map' | 'present' | 'used'>, x: number, y: number): DrawnFeature[] {
  const out: DrawnFeature[] = [];
  for (const f of world.map.featuresAt(x, y)) {
    if (!drawsKind(f)) continue;
    const mark = markOf(world, f);
    if (mark) out.push({ f, ruin: mark === 'ruin' });
  }
  return out;
}

/**
 * Draw the features on the square of open ground at d, l (map x, y), after what else stands there and in
 * the tone a tree there would take. A sign sharing its square stands to the left of the other. A camp's
 * fire is lit by night, as a lighthouse's lamp is, and always underground; it leaves a flame, drawn every
 * frame over the scene and out where anything nearer is painted over it, as a torch's.
 */
export function drawFeatures(p: Paint, world: World, x: number, y: number, d: number, l: number): void {
  const here = featuresOn(world, x, y);
  if (!here.length) return;
  const u = unit(d, p.h), tone = boardTone(p, d), light = 1 - p.env.murk * 0.1 * d;
  const lit = world.map.kind === 'dungeon' || p.daylight < 0.35, vary = hash(x, y, 70);
  for (const { f, ruin } of here) {
    const bx = p.cx + (l * 2 + (f.kind === 'sign' && here.length > 1 ? -0.68 : 0)) * u;
    const fire = drawFeatureSprite(p.ctx, f.kind, bx, p.horizon + u, u, { tone, light, snow: p.env.cover, lit, ruin, vary });
    if (fire) p.flames.push({ ...fire, under: pixel(p.ctx, fire.x, fire.y) });
  }
}
