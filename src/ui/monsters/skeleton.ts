// The skeleton family: skeleton and bone knight, bone on a rusted blade.
import type { MonsterSprite } from '../../game/monsters.ts';
import type { MonsterDrawer } from './common.ts';
import { B, groundShadow } from './common.ts';
import { shade } from '../../lib/art/palettes.ts';
import { pathEllipse } from '../../lib/art/shapes.ts';
import { celBall, celCapsule, celPoly, band } from '../../lib/art/shading.ts';

/** The kinds this module draws (tools/gallery.ts renders a family by this list). */
export const KINDS: readonly MonsterSprite[] = ['skeleton', 'bone_knight'];

export const draw: MonsterDrawer = (ctx, kind, x, y, h, p) => {
  void kind;
  groundShadow(ctx, x, y + 1, h * 0.7);
  skeleton(ctx, x, y, h, p.tone, p.breathe);
};

function skeleton(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, tone: number, br: number): void {
  const bone = shade('#d8d0c0', tone), old = shade('#a8a090', tone);
  const w = h * 0.4, hip = y - h * 0.46, shoulder = y - h * 0.72 + br * 0.5;
  // Legs.
  for (const s of [-1, 1]) {
    celCapsule(ctx, B, x + s * w * 0.18, hip, x + s * w * 0.22, y - h * 0.24, h * 0.03, bone, 0);
    celCapsule(ctx, B, x + s * w * 0.22, y - h * 0.24, x + s * w * 0.26, y - h * 0.03, h * 0.028, bone, 0);
    celBall(ctx, B, x + s * w * 0.22, y - h * 0.24, h * 0.035, old, false);
    band(ctx, B, x + s * w * 0.26 - h * 0.05, y - h * 0.03, h * 0.1, h * 0.03, old);
  }
  // Pelvis, spine, ribs.
  celPoly(ctx, B, [x - w * 0.32, hip - h * 0.04, x + w * 0.32, hip - h * 0.04, x + w * 0.22, hip + h * 0.05, x - w * 0.22, hip + h * 0.05], old, 0.35, 0.2);
  celCapsule(ctx, B, x, shoulder, x, hip, h * 0.022, bone, 0);
  for (let i = 0; i < 4; i++) {
    const ry = shoulder + h * 0.04 + i * h * 0.05, rw = w * (0.42 - i * 0.05);
    ctx.strokeStyle = B.col(bone); ctx.lineWidth = Math.max(1, h * 0.022); ctx.lineCap = 'round';
    ctx.beginPath(); ctx.moveTo(x - rw, ry + h * 0.02); ctx.quadraticCurveTo(x - rw * 0.5, ry - h * 0.02, x, ry); ctx.quadraticCurveTo(x + rw * 0.5, ry - h * 0.02, x + rw, ry + h * 0.02); ctx.stroke();
  }
  // Shoulders and arms.
  band(ctx, B, x - w * 0.5, shoulder - h * 0.015, w, h * 0.03, old);
  for (const s of [-1, 1]) {
    celCapsule(ctx, B, x + s * w * 0.48, shoulder, x + s * w * 0.66, shoulder + h * 0.18, h * 0.025, bone, 0);
    celCapsule(ctx, B, x + s * w * 0.66, shoulder + h * 0.18, x + s * w * 0.58, shoulder + h * 0.36, h * 0.022, bone, 0);
    celBall(ctx, B, x + s * w * 0.66, shoulder + h * 0.18, h * 0.03, old, false);
  }
  // A rusty blade.
  celPoly(ctx, B, [x + w * 0.56, shoulder + h * 0.36, x + w * 0.62, shoulder + h * 0.36, x + w * 0.95, shoulder - h * 0.2, x + w * 0.85, shoulder - h * 0.22], shade('#8a6a4a', tone), 0.4, 0.2);
  // Skull: cranium, jaw, sockets, teeth.
  const r = h * 0.1, hy = shoulder - r * 1.35;
  celBall(ctx, B, x, hy, r, bone);
  celPoly(ctx, B, [x - r * 0.7, hy + r * 0.5, x + r * 0.7, hy + r * 0.5, x + r * 0.55, hy + r * 1.15, x - r * 0.55, hy + r * 1.15], old, 0.3, 0.1);
  pathEllipse(ctx, x - r * 0.38, hy, r * 0.26, r * 0.3); ctx.fillStyle = B.col('#16121a'); ctx.fill();
  pathEllipse(ctx, x + r * 0.38, hy, r * 0.26, r * 0.3); ctx.fill();
  celPoly(ctx, B, [x - r * 0.12, hy + r * 0.25, x + r * 0.12, hy + r * 0.25, x, hy + r * 0.55], old, 0.2, 0);
  ctx.fillStyle = B.col('#16121a'); for (let i = -2; i <= 2; i++) ctx.fillRect(Math.round(x + i * r * 0.28), Math.round(hy + r * 0.75), 1, Math.max(1, r * 0.2));
}
