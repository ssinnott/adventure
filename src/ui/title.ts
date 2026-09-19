// Title screen: new game or continue.
import type { Game, Screen } from '../game/game.ts';
import type { Action } from '../input.ts';
import { is } from '../input.ts';
import { drawText, drawTextOutlined } from '../lib/engine/text.ts';
import { menu, paragraph } from './draw.ts';
import { freshSeed } from '../lib/engine/rng.ts';
import { INK, BRASS, TEXT_DIM, TEXT } from './palette.ts';

export class TitleScreen implements Screen {
  private sel = 0;
  private items: string[];
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
      else g.newGame(freshSeed());
    }
  }
  render(g: Game, ctx: CanvasRenderingContext2D, frame: number): void {
    ctx.fillStyle = INK; ctx.fillRect(0, 0, 640, 360);
    // The Hearth: a column of light on the horizon that flickers.
    const flick = 0.75 + 0.25 * Math.sin(frame / 7) * Math.sin(frame / 3);
    const grad = ctx.createLinearGradient(0, 60, 0, 240);
    grad.addColorStop(0, `rgba(255,220,140,${0.05 * flick})`); grad.addColorStop(1, `rgba(255,200,120,${0.5 * flick})`);
    ctx.fillStyle = grad; ctx.fillRect(312, 60, 16, 180);
    ctx.fillStyle = '#1a2436'; ctx.fillRect(0, 240, 640, 120);
    ctx.fillStyle = `rgba(255,210,140,${0.2 * flick})`; ctx.fillRect(296, 240, 48, 120);
    drawTextOutlined(ctx, 'THE HEARTH OF CALDERA', 320, 90, { size: 3, color: BRASS, align: 'center', outline: INK, thickness: 1 });
    drawText(ctx, 'A CHARTER COMPANY, ONE SQUARE AT A TIME', 320, 124, { size: 1, color: TEXT_DIM, align: 'center' });
    menu(ctx, this.items, 280, 200, this.sel, { size: 2 });
    if (this.note) paragraph(ctx, this.note, 120, 300, 400, { color: TEXT });
    drawText(ctx, 'ARROWS / WASD MOVE  SPACE ACT  ESC BACK', 320, 340, { size: 1, color: TEXT_DIM, align: 'center' });
  }
}
