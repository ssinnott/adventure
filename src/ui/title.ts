// The title screen: new game or continue, why a save will not load in the note's two lines (#945),
// the Hearth over the saved company and attract mode: untouched for 45 seconds, the pilot plays a
// new game.
import type { Host, Screen } from './screen.ts';
import type { Action } from './actions.ts';
import { ListMenu } from './menu.ts';
import { drawText, drawTextOutlined } from '../lib/engine/text.ts';
import { menu, paragraph } from './draw.ts';
import { freshSeed } from '../lib/engine/rng.ts';
import { INK, BRASS, TEXT } from './palette.ts';
import { CreateScreen } from './create.ts';
import { drawDusk } from './viewport.ts';
import { drawFrameBackground } from './frame.ts';
import { panel } from './draw.ts';
import { savedHearth, hearthLook } from '../game/stones.ts';
import type { Hearth } from '../game/stones.ts';

/** Ticks of nothing on the title before the pilot plays a game for watching (attract mode, #722): forty-five seconds at 60 a second. */
export const IDLE_TICKS = 60 * 45;
/** The note under the menu (why the save would not load): two lines of the font across its panel, 400 by 34. */
export const NOTE_W = 380, NOTE_LINES = 2;

export class TitleScreen implements Screen {
  /** Its cursor. */
  private readonly menu = new ListMenu();
  private get sel(): number { return this.menu.sel; }
  private set sel(row: number) { this.menu.sel = row; }
  private items: string[];
  private canContinue: boolean;
  private note: string;
  /** Ticks of nothing since the title was last touched: any key takes it back to 0. */
  private idle = 0;
  /** The Hearth as the saved company left it, read once from storage. */
  private saved: Hearth | null = null;
  private hearth(g: Host): Hearth { return (this.saved ??= this.canContinue ? savedHearth(g.tables, g.store) : { stones: 0 }); }
  constructor(canContinue: boolean, note = '') {
    this.canContinue = canContinue;
    this.note = note;
    this.items = canContinue ? ['Continue', 'New Game'] : ['New Game'];
  }
  update(g: Host, a: Action | null): void {
    if (!a) {
      // Untouched for IDLE_TICKS, the pilot plays a new game (Game.attract); a Game with no pilot never does.
      if (++this.idle >= IDLE_TICKS) { this.idle = 0; g.attract(); }
      return;
    }
    this.idle = 0;
    if (this.menu.press(a, { n: this.items.length }) === 'chosen') {
      const it = this.items[this.sel];
      if (it === 'Continue') { const loaded = g.loadGame(); if (loaded !== true) this.note = loaded; }
      else g.push(new CreateScreen(freshSeed()));
    }
  }
  render(g: Host, ctx: CanvasRenderingContext2D, frame: number): void {
    drawFrameBackground(ctx);
    drawDusk(ctx, frame, hearthLook(this.hearth(g)));
    panel(ctx, 150, 40, 340, 80, 'rgba(14,12,16,0.75)');
    drawTextOutlined(ctx, 'THE HEARTH OF CALDERA', 320, 58, { size: 3, color: BRASS, align: 'center', outline: INK, thickness: 1 });
    drawText(ctx, 'A CHARTERED COMPANY, ONE SQUARE AT A TIME', 320, 94, { size: 1, color: TEXT, align: 'center' });
    panel(ctx, 230, 212, 180, 24 + this.items.length * 20, 'rgba(14,12,16,0.8)');
    menu(ctx, this.items, 250, 224, this.sel, { size: 2 });
    // The note's two lines: a longer reason is cut to them, not wrapped past the panel (#945).
    if (this.note) { panel(ctx, 120, 300, 400, 34, 'rgba(14,12,16,0.8)'); paragraph(ctx, this.note, 130, 308, NOTE_W, { color: TEXT, maxLines: NOTE_LINES }); }
    drawText(ctx, 'ARROWS / WASD MOVE  SPACE ACT  ESC BACK', 320, 342, { size: 1, color: TEXT, align: 'center' });
  }
}
