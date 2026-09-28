// A statue's riddle: the question in a box and the answer typed, in the text mode that names the
// company (ui/create.ts). Enter answers, Esc leaves, and either way out turns the text mode off, or
// the keys that move the party would go on being typed. What the answer does is the Game's, handed
// in, so this screen loads in Node for its test (tools/tests/wilds.ts).
import type { Game, Screen } from '../game/game.ts';
import type { Action } from '../input.ts';
import { is } from '../input.ts';
import { drawText } from '../lib/engine/text.ts';
import { panel, paragraph } from './draw.ts';
import { BRASS, TEXT, TEXT_DIM } from './palette.ts';

/** The longest answer the box takes. */
const MAX = 16;
const BOX = { x: 40, y: 40, w: 560, h: 150 };

export class RiddleScreen implements Screen {
  readonly overlay = true;
  word = '';
  private readonly title: string;
  private readonly riddle: string;
  private readonly answer: (word: string) => void;
  /** Opens with the text mode on; `answer` is called with the word on Enter, after the screen has closed. */
  constructor(g: Game, title: string, riddle: string, answer: (word: string) => void) {
    this.title = title; this.riddle = riddle; this.answer = answer;
    if (g.input) { g.input.drainText(''); g.input.textMode = true; }
  }

  update(g: Game, a: Action | null): void {
    // Text entry runs every step, action or not; only letters and spaces are kept.
    if (g.input) this.word = g.input.drainText(this.word, MAX).replace(/[^A-Za-z ]/g, '');
    if (!a) return;
    if (is(a, 'cancel')) this.close(g);
    else if (is(a, 'interact') && this.word.trim()) { this.close(g); this.answer(this.word); }
  }

  private close(g: Game): void {
    if (g.input) g.input.textMode = false;
    g.pop();
  }

  render(g: Game, ctx: CanvasRenderingContext2D, frame: number): void {
    panel(ctx, BOX.x, BOX.y, BOX.w, BOX.h);
    const x = BOX.x + 12;
    let y = BOX.y + 10;
    drawText(ctx, this.title, x, y, { size: 1, color: BRASS }); y += 14;
    y = paragraph(ctx, this.riddle, x, y, BOX.w - 24, { color: TEXT, maxLines: 6 }) + 10;
    drawText(ctx, 'ANSWER', x, y, { size: 1, color: BRASS }); y += 12;
    drawText(ctx, this.word.toUpperCase() + ((frame >> 4) & 1 ? '_' : ' '), x, y, { size: 2, color: TEXT });
    drawText(ctx, 'TYPE THE WORD   ENTER ANSWER   ESC LEAVE', BOX.x + BOX.w - 12, BOX.y + BOX.h - 12, { size: 1, color: TEXT_DIM, align: 'right' });
  }
}
