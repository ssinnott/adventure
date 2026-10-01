// Title screen: new game or continue.
import type { Game, Screen } from '../game/game.ts';
import type { Action } from '../input.ts';
import { is } from '../input.ts';
import { drawText, drawTextOutlined } from '../lib/engine/text.ts';
import { menu, paragraph } from './draw.ts';
import { freshSeed } from '../lib/engine/rng.ts';
import { INK, BRASS, TEXT_DIM, TEXT } from './palette.ts';
import { CreateScreen } from './create.ts';
import { drawSkyBand } from './viewport.ts';
import { drawFrameBackground } from './frame.ts';
import { panel } from './draw.ts';
import { savedStones, flickerOf } from '../game/stones.ts';

export class TitleScreen implements Screen {
  private sel = 0;
  private items: string[];
  /** The Stones the saved company has restored, read once from storage. */
  private restored: number | null = null;
  private stones(g: Game): number { return (this.restored ??= this.canContinue ? savedStones(g.store) : 0); }
  constructor(private canContinue: boolean, private note = '') {
    this.items = canContinue ? ['Continue', 'New Game'] : ['New Game'];
  }
  update(g: Game, a: Action | null): void {
    if (!a) return;
    if (is(a, 'up')) this.sel = (this.sel + this.items.length - 1) % this.items.length;
    else if (is(a, 'down')) this.sel = (this.sel + 1) % this.items.length;
    else if (is(a, 'interact')) {
      const it = this.items[this.sel];
      if (it === 'Continue') { if (!g.loadGame()) this.note = 'The save could not be read.'; }
      else g.push(new CreateScreen(freshSeed()));
    }
  }
  render(g: Game, ctx: CanvasRenderingContext2D, frame: number): void {
    drawFrameBackground(ctx);
    const v = { x: 8, y: 8, w: 624, h: 344 };
    ctx.save(); ctx.beginPath(); ctx.rect(v.x, v.y, v.w, v.h); ctx.clip();
    // Dusk over the inland sea, looking west at the Hearth.
    drawSkyBand(ctx, v, { facing: 3, hour: 18.6, daylight: 0.45, dark: false });
    const horizon = v.y + v.h / 2;
    const sea = ctx.createLinearGradient(0, horizon, 0, v.y + v.h);
    sea.addColorStop(0, '#2a4a7a'); sea.addColorStop(1, '#101a30');
    ctx.fillStyle = sea; ctx.fillRect(v.x, horizon, v.w, v.h / 2);
    // The Hearth: a column of light on the horizon that flickers, and its path on the water. It is
    // the saved company's: steadier, taller and wider by a step for each Stone restored (#168).
    const n = Math.min(this.stones(g), 5), amp = flickerOf(n);
    const flick = 1 - amp + amp * Math.sin(frame / 7) * Math.sin(frame / 3);
    const cx = v.x + v.w / 2, rad = 110 + 12 * n, peak = 0.45 + 0.05 * n, tall = Math.min(70 + 22 * n, horizon - v.y);
    const glow = ctx.createRadialGradient(cx, horizon, 4, cx, horizon, rad);
    glow.addColorStop(0, `rgba(255,220,150,${peak * flick})`); glow.addColorStop(1, 'rgba(255,200,120,0)');
    ctx.fillStyle = glow; ctx.fillRect(cx - rad, horizon - rad, rad * 2, rad * 2);
    const col = ctx.createLinearGradient(0, horizon - tall, 0, horizon);
    col.addColorStop(0, `rgba(255,230,170,${0.05 * flick})`); col.addColorStop(1, `rgba(255,220,150,${0.85 * flick})`);
    ctx.fillStyle = col; ctx.fillRect(cx - 5, horizon - tall, 10, tall);
    ctx.fillStyle = `rgba(255,235,190,${0.9 * flick})`; ctx.fillRect(cx - 2, horizon - tall + 30, 4, tall - 30);
    for (let i = 0; i < 40; i++) {
      const y = horizon + 4 + i * 4, w = 12 + i * 3.5 * (0.7 + 0.3 * Math.sin(frame / 9 + i));
      ctx.fillStyle = `rgba(255,220,150,${(0.35 - i * 0.008) * flick})`; ctx.fillRect(cx - w / 2, y, w, 2);
    }
    // Far shore silhouette with Helmstow's towers.
    ctx.fillStyle = '#0e1224';
    ctx.fillRect(v.x, horizon - 6, v.w, 8);
    for (const [tx, th, tw] of [[60, 26, 10], [110, 18, 8], [500, 30, 12], [560, 20, 8], [600, 14, 6]]) ctx.fillRect(v.x + tx, horizon - th, tw, th);
    ctx.restore();
    panel(ctx, 150, 40, 340, 80, 'rgba(14,12,16,0.75)');
    drawTextOutlined(ctx, 'THE HEARTH OF CALDERA', 320, 58, { size: 3, color: BRASS, align: 'center', outline: INK, thickness: 1 });
    drawText(ctx, 'A CHARTERED COMPANY, ONE SQUARE AT A TIME', 320, 94, { size: 1, color: TEXT, align: 'center' });
    panel(ctx, 230, 212, 180, 24 + this.items.length * 20, 'rgba(14,12,16,0.8)');
    menu(ctx, this.items, 250, 224, this.sel, { size: 2 });
    if (this.note) { panel(ctx, 120, 300, 400, 34, 'rgba(14,12,16,0.8)'); paragraph(ctx, this.note, 130, 308, 380, { color: TEXT }); }
    drawText(ctx, 'ARROWS / WASD MOVE  SPACE ACT  ESC BACK', 320, 342, { size: 1, color: TEXT, align: 'center' });
  }
}
