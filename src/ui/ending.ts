// The ending's pages (#750; DESIGN §9, and §11's long-form exception): shown as the answer at the
// Heart is taken, the ending's name over the title's dusk with the Hearth as the ending leaves it,
// and its pages one at a time. The last closes onto the Heart, where the company stands, and the
// game goes on.
import type { Game, Screen } from '../game/game.ts';
import type { Action } from '../app/input.ts';
import { is } from '../app/input.ts';
import { drawText, drawTextOutlined } from '../lib/engine/text.ts';
import { panel, paragraph, wrap } from './draw.ts';
import { INK, BRASS, TEXT, TEXT_DIM } from './palette.ts';
import { drawFrameBackground } from './frame.ts';
import { drawDusk } from './viewport.ts';
import { hearthLook } from '../game/stones.ts';
import type { Ending } from '../content/endings.ts';

/** Where a page is written, at what size and width, and the most lines it may take: tools/tests/pillars.ts holds every page to them. */
export const PAGE = { x: 24, y: 200, w: 592, h: 144, size: 2, width: 560, lines: 6 };

/** A page as the screen writes it, in lines. */
export const pageLines = (text: string): string[] => wrap(text, PAGE.width, PAGE.size);

export class EndingScreen implements Screen {
  readonly ending: Ending;
  /** The page in view. */
  page = 0;
  constructor(ending: Ending) { this.ending = ending; }
  /** Space or Esc turns the page; past the last, the company is where it stood. */
  update(g: Game, a: Action | null): void {
    if (!is(a, 'interact', 'cancel')) return;
    if (this.page < this.ending.pages.length - 1) this.page++;
    else g.pop();
  }
  render(g: Game, ctx: CanvasRenderingContext2D, frame: number): void {
    const n = this.ending.pages.length, hint = PAGE.y + PAGE.h - 14;
    drawFrameBackground(ctx);
    drawDusk(ctx, frame, hearthLook(g.world.hearth));
    panel(ctx, 120, 28, 400, 36, 'rgba(14,12,16,0.75)');
    drawTextOutlined(ctx, this.ending.title, 320, 39, { size: 2, color: BRASS, align: 'center', outline: INK, thickness: 1 });
    panel(ctx, PAGE.x, PAGE.y, PAGE.w, PAGE.h, 'rgba(14,12,16,0.85)');
    paragraph(ctx, this.ending.pages[this.page] ?? '', PAGE.x + 16, PAGE.y + 12, PAGE.width, { size: PAGE.size, color: TEXT, maxLines: PAGE.lines });
    drawText(ctx, `${this.page + 1}/${n}`, PAGE.x + 16, hint, { size: 1, color: TEXT_DIM });
    drawText(ctx, this.page < n - 1 ? 'SPACE: MORE' : 'SPACE', PAGE.x + PAGE.w - 16, hint, { size: 1, color: TEXT_DIM, align: 'right' });
  }
}
