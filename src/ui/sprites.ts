// Vector sprites for the viewport and the combat screen: monsters, trees, rocks, mountains. Each
// draws centred on (x, y) where y is the ground line, at height h in px, and takes a `tone` for
// distance darkening. All are front-facing, which is why they are not the engine's side-on rig.
import type { MonsterSprite } from '../game/monsters.ts';
import { shade, mix } from '../lib/art/palettes.ts';
import { pathEllipse, pathPoly, pathRrect } from '../lib/art/shapes.ts';

const OUTLINE = 'rgba(10,8,12,0.9)';

function fillStroke(ctx: CanvasRenderingContext2D, fill: string, lw = 1): void {
  ctx.fillStyle = fill; ctx.fill();
  ctx.strokeStyle = OUTLINE; ctx.lineWidth = lw; ctx.lineJoin = 'round'; ctx.stroke();
}

export function drawTreeSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, variant: number): void {
  const h = u * 2.2, trunkW = u * 0.22;
  const leaf = shade(['#3f7a3a', '#4a8a3a', '#356a34', '#5a8a42', '#3a7a4a'][variant], tone), bark = shade('#5a3f2a', tone);
  pathRrect(ctx, x - trunkW / 2, y - h * 0.45, trunkW, h * 0.45, 1); fillStroke(ctx, bark);
  const r = u * 0.75;
  pathEllipse(ctx, x, y - h * 0.62, r, r * 0.9); fillStroke(ctx, leaf);
  pathEllipse(ctx, x - r * 0.5, y - h * 0.5, r * 0.7, r * 0.6); fillStroke(ctx, shade(leaf, 0.9));
  pathEllipse(ctx, x + r * 0.5, y - h * 0.52, r * 0.7, r * 0.6); fillStroke(ctx, shade(leaf, 1.08));
}

export function drawRockSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number): void {
  const w = u * 1.3, h = u * 0.8;
  pathPoly(ctx, [x - w / 2, y, x - w * 0.35, y - h * 0.8, x + w * 0.1, y - h, x + w / 2, y - h * 0.5, x + w * 0.4, y]);
  fillStroke(ctx, shade('#7a7468', tone));
  pathPoly(ctx, [x - w * 0.35, y - h * 0.8, x + w * 0.1, y - h, x + w * 0.05, y - h * 0.55]);
  ctx.fillStyle = shade('#9a9488', tone); ctx.fill();
}

export function drawMountainSprite(ctx: CanvasRenderingContext2D, x: number, y: number, u: number, tone: number, variant: number): void {
  const w = u * 2.4, h = u * (1.6 + variant * 0.2);
  pathPoly(ctx, [x - w / 2, y, x - w * 0.1, y - h, x + w * 0.15, y - h * 0.75, x + w / 2, y]);
  fillStroke(ctx, shade('#6a6670', tone));
  pathPoly(ctx, [x - w * 0.1, y - h, x - w * 0.22, y - h * 0.7, x + w * 0.02, y - h * 0.72]);
  ctx.fillStyle = shade('#e8ecf0', tone); ctx.fill();
}

export function drawPillarSprite(ctx: CanvasRenderingContext2D, x: number, horizon: number, u: number, tone: number): void {
  const w = u * 0.5;
  pathRrect(ctx, x - w / 2, horizon - u, w, u * 2, 2); fillStroke(ctx, shade('#8a8690', tone));
}

/**
 * Draw a monster of the given sprite type. `h` is the intended height; `frame` animates a bob.
 */
export function drawMonsterSprite(ctx: CanvasRenderingContext2D, kind: MonsterSprite, x: number, y: number, h: number, tint: string, tone: number, frame: number, flash = false): void {
  const bob = Math.sin(frame / 12) * h * 0.02;
  y += bob;
  const base = flash ? '#ffffff' : shade(tint, tone);
  const dark = flash ? '#ffffff' : shade(tint, tone * 0.6);
  const eye = flash ? '#ffffff' : '#ffd070';
  switch (kind) {
    case 'rat': {
      const w = h * 1.6;
      pathEllipse(ctx, x, y - h * 0.4, w * 0.45, h * 0.35); fillStroke(ctx, base);
      pathEllipse(ctx, x + w * 0.38, y - h * 0.5, h * 0.28, h * 0.25); fillStroke(ctx, base);
      ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, h * 0.06);
      ctx.beginPath(); ctx.moveTo(x - w * 0.42, y - h * 0.35); ctx.quadraticCurveTo(x - w * 0.75, y - h * 0.5, x - w * 0.8, y - h * 0.1); ctx.stroke();
      dot(ctx, x + w * 0.45, y - h * 0.55, h * 0.05, eye);
      break;
    }
    case 'wolf': {
      const w = h * 1.7;
      pathEllipse(ctx, x, y - h * 0.5, w * 0.42, h * 0.28); fillStroke(ctx, base);
      pathPoly(ctx, [x + w * 0.25, y - h * 0.75, x + w * 0.55, y - h * 0.62, x + w * 0.42, y - h * 0.38]); fillStroke(ctx, base);
      pathPoly(ctx, [x + w * 0.25, y - h * 0.75, x + w * 0.2, y - h * 0.95, x + w * 0.33, y - h * 0.78]); fillStroke(ctx, dark);
      for (const lx of [-0.3, -0.15, 0.15, 0.3]) { pathRrect(ctx, x + w * lx - h * 0.05, y - h * 0.4, h * 0.1, h * 0.4, 1); fillStroke(ctx, dark); }
      dot(ctx, x + w * 0.42, y - h * 0.68, h * 0.05, eye);
      break;
    }
    case 'boar': {
      const w = h * 1.6;
      pathEllipse(ctx, x, y - h * 0.5, w * 0.45, h * 0.35); fillStroke(ctx, base);
      pathEllipse(ctx, x + w * 0.4, y - h * 0.45, h * 0.3, h * 0.28); fillStroke(ctx, dark);
      pathPoly(ctx, [x + w * 0.5, y - h * 0.35, x + w * 0.62, y - h * 0.5, x + w * 0.56, y - h * 0.32]); fillStroke(ctx, '#e8e0d0');
      for (const lx of [-0.3, -0.12, 0.12, 0.3]) { pathRrect(ctx, x + w * lx - h * 0.06, y - h * 0.3, h * 0.12, h * 0.3, 1); fillStroke(ctx, dark); }
      dot(ctx, x + w * 0.48, y - h * 0.55, h * 0.05, eye);
      break;
    }
    case 'spider': {
      const w = h * 1.8;
      ctx.strokeStyle = dark; ctx.lineWidth = Math.max(1, h * 0.07);
      for (let i = 0; i < 4; i++) {
        const a = -0.9 + i * 0.6;
        for (const s of [-1, 1]) { ctx.beginPath(); ctx.moveTo(x, y - h * 0.45); ctx.lineTo(x + s * Math.cos(a) * w * 0.45, y - h * 0.7); ctx.lineTo(x + s * Math.cos(a) * w * 0.55, y); ctx.stroke(); }
      }
      pathEllipse(ctx, x, y - h * 0.45, w * 0.22, h * 0.32); fillStroke(ctx, base);
      pathEllipse(ctx, x, y - h * 0.75, w * 0.12, h * 0.15); fillStroke(ctx, dark);
      dot(ctx, x - h * 0.08, y - h * 0.78, h * 0.04, '#ff5040'); dot(ctx, x + h * 0.08, y - h * 0.78, h * 0.04, '#ff5040');
      break;
    }
    case 'slime': {
      const w = h * 1.4;
      pathEllipse(ctx, x, y - h * 0.4, w * 0.5, h * 0.42); fillStroke(ctx, base);
      pathEllipse(ctx, x - w * 0.15, y - h * 0.6, w * 0.12, h * 0.1); ctx.fillStyle = 'rgba(255,255,255,0.35)'; ctx.fill();
      dot(ctx, x - h * 0.15, y - h * 0.45, h * 0.06, dark); dot(ctx, x + h * 0.15, y - h * 0.45, h * 0.06, dark);
      break;
    }
    case 'riftling': {
      const w = h * 0.9;
      // A jagged, glowing thing: a torso of triangles with ember eyes.
      pathPoly(ctx, [x - w * 0.4, y, x - w * 0.5, y - h * 0.6, x, y - h, x + w * 0.5, y - h * 0.6, x + w * 0.4, y, x + w * 0.15, y - h * 0.25, x - w * 0.15, y - h * 0.25]);
      fillStroke(ctx, base);
      pathPoly(ctx, [x - w * 0.25, y - h * 0.55, x, y - h * 0.85, x + w * 0.25, y - h * 0.55, x, y - h * 0.4]);
      ctx.fillStyle = flash ? '#fff' : mix(tint, '#ffd080', 0.5); ctx.fill();
      dot(ctx, x - w * 0.12, y - h * 0.7, h * 0.05, '#fff0a0'); dot(ctx, x + w * 0.12, y - h * 0.7, h * 0.05, '#fff0a0');
      break;
    }
    case 'skeleton': humanoid(ctx, x, y, h, flash ? '#fff' : shade('#d8d0c0', tone), flash ? '#fff' : shade('#a8a090', tone), '#000', true); break;
    case 'bandit': humanoid(ctx, x, y, h, base, dark, flash ? '#fff' : shade('#c8a080', tone), false); break;
    case 'cultist': humanoid(ctx, x, y, h, base, dark, flash ? '#fff' : shade('#c8a080', tone), false, true); break;
  }
}

function dot(ctx: CanvasRenderingContext2D, x: number, y: number, r: number, color: string): void {
  ctx.beginPath(); ctx.arc(x, y, Math.max(0.5, r), 0, Math.PI * 2); ctx.fillStyle = color; ctx.fill();
}

function humanoid(ctx: CanvasRenderingContext2D, x: number, y: number, h: number, body: string, legs: string, skin: string, skull: boolean, hood = false): void {
  const w = h * 0.45;
  // Legs
  pathRrect(ctx, x - w * 0.3, y - h * 0.45, w * 0.25, h * 0.45, 1); fillStroke(ctx, legs);
  pathRrect(ctx, x + w * 0.05, y - h * 0.45, w * 0.25, h * 0.45, 1); fillStroke(ctx, legs);
  // Torso
  if (hood) { pathPoly(ctx, [x - w * 0.5, y - h * 0.1, x - w * 0.35, y - h * 0.8, x + w * 0.35, y - h * 0.8, x + w * 0.5, y - h * 0.1]); fillStroke(ctx, body); }
  else { pathRrect(ctx, x - w * 0.4, y - h * 0.78, w * 0.8, h * 0.36, 2); fillStroke(ctx, body); }
  // Arms
  pathRrect(ctx, x - w * 0.62, y - h * 0.75, w * 0.2, h * 0.34, 1); fillStroke(ctx, body);
  pathRrect(ctx, x + w * 0.42, y - h * 0.75, w * 0.2, h * 0.34, 1); fillStroke(ctx, body);
  // Weapon in the right hand
  ctx.strokeStyle = '#c0c0c8'; ctx.lineWidth = Math.max(1, h * 0.04);
  ctx.beginPath(); ctx.moveTo(x + w * 0.52, y - h * 0.42); ctx.lineTo(x + w * 0.62, y - h * 0.95); ctx.stroke();
  // Head
  const hr = h * 0.12;
  if (hood) { pathPoly(ctx, [x - hr * 1.2, y - h * 0.78, x, y - h * 1.02, x + hr * 1.2, y - h * 0.78]); fillStroke(ctx, body); dot(ctx, x - hr * 0.4, y - h * 0.85, hr * 0.2, '#ffd070'); dot(ctx, x + hr * 0.4, y - h * 0.85, hr * 0.2, '#ffd070'); }
  else {
    ctx.beginPath(); ctx.arc(x, y - h * 0.88, hr, 0, Math.PI * 2); fillStroke(ctx, skin);
    if (skull) { dot(ctx, x - hr * 0.4, y - h * 0.9, hr * 0.25, '#000'); dot(ctx, x + hr * 0.4, y - h * 0.9, hr * 0.25, '#000'); }
    else { dot(ctx, x - hr * 0.35, y - h * 0.9, hr * 0.15, '#000'); dot(ctx, x + hr * 0.35, y - h * 0.9, hr * 0.15, '#000'); }
  }
}
