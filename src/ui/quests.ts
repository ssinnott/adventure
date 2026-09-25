// The quest log (J): the quests the party knows of, active ones first, and for the one selected,
// what to do next and what the journal says so far. It only reads game/quests.ts. The page layout
// is a pure function so the Node tests can check that every quest's journal fits.
import type { Game, Screen } from '../game/game.ts';
import type { Action } from '../input.ts';
import { is } from '../input.ts';
import { drawText, lineHeight } from '../lib/engine/text.ts';
import { panel, wrap } from './draw.ts';
import { BRASS, BRASS_DARK, TEXT, TEXT_DIM, YELLOW, GREEN } from './palette.ts';
import { questLog } from '../game/quests.ts';
import type { QuestView } from '../game/quests.ts';

const BOX = { x: 8, y: 8, w: 624, h: 268 };
/** The list of quests down the left; a title has to fit its width. */
export const LIST = { x: 20, y: 36, w: 172, h: 220 };
/** The selected quest's page, right of the list. */
export const PAGE = { x: 212, y: 36, w: 408, h: 220 };
const ENTRY_GAP = 4;

/** Active quests first, then finished ones, each in story order. */
export function questOrder(log: readonly QuestView[]): QuestView[] {
  return [...log.filter((v) => !v.done), ...log.filter((v) => v.done)];
}

export interface PageRow { text: string; color: string; y: number; }

/**
 * One quest's page in a `w` x `h` box: the title, the goal (or that it is done), a rule at `rule`,
 * then the journal. When it runs long the oldest entries give way, and `dropped` says how many.
 */
export function questPage(v: QuestView, w: number, h: number): { rows: PageRow[]; rule: number; dropped: number } {
  const lh = lineHeight(1);
  const rows: PageRow[] = [{ text: v.def.title, color: BRASS, y: 0 }];
  let y = lh + 3;
  for (const line of v.goal ? wrap(v.goal, w) : ['Done.']) { rows.push({ text: line, color: v.goal ? YELLOW : GREEN, y }); y += lh; }
  const rule = y + 2;
  y += 7;
  const blocks = v.entries.map((e) => wrap(e.text, w));
  // Height of the entries from `i` on, plus the line that says some were left out.
  const tall = (i: number): number => blocks.slice(i).reduce((t, b) => t + b.length * lh + ENTRY_GAP, -ENTRY_GAP) + (i ? lh : 0);
  let dropped = 0;
  while (dropped < blocks.length - 1 && y + tall(dropped) > h) dropped++;
  if (dropped) { rows.push({ text: `...and ${dropped} earlier ${dropped === 1 ? 'entry' : 'entries'}`, color: TEXT_DIM, y }); y += lh; }
  for (const b of blocks.slice(dropped)) {
    for (const line of b) { rows.push({ text: line, color: TEXT, y }); y += lh; }
    y += ENTRY_GAP;
  }
  return { rows, rule, dropped };
}

export class QuestScreen implements Screen {
  readonly overlay = true;
  private sel = 0;
  constructor(g: Game) {
    // Open on the quest that last changed, or the one last looked at.
    this.sel = Math.max(0, this.list(g).findIndex((v) => v.def.id === g.questFocus));
  }
  private list(g: Game): QuestView[] { return questOrder(questLog(g.world.state, g.party)); }
  update(g: Game, a: Action | null): void {
    if (!a) return;
    if (is(a, 'cancel', 'journal')) { g.pop(); return; }
    const list = this.list(g);
    if (!list.length) return;
    if (is(a, 'up')) this.sel = (this.sel + list.length - 1) % list.length;
    else if (is(a, 'down')) this.sel = (this.sel + 1) % list.length;
    else return;
    g.questFocus = list[this.sel].def.id;
  }
  render(g: Game, ctx: CanvasRenderingContext2D): void {
    const list = this.list(g);
    panel(ctx, BOX.x, BOX.y, BOX.w, BOX.h);
    drawText(ctx, 'QUEST LOG', 20, 18, { size: 1, color: BRASS });
    drawText(ctx, (list.length > 1 ? '↑↓ CHOOSE   ' : '') + 'J OR ESC CLOSE', 620, 264, { size: 1, color: TEXT_DIM, align: 'right' });
    if (!list.length) { drawText(ctx, 'No quests yet. The Regent-Warden is hiring.', LIST.x, LIST.y, { size: 1, color: TEXT_DIM }); return; }
    const active = list.filter((v) => !v.done).length, done = list.length - active;
    drawText(ctx, [active ? `${active} ACTIVE` : '', done ? `${done} DONE` : ''].filter(Boolean).join('  '), 620, 18, { size: 1, color: TEXT_DIM, align: 'right' });
    // The list: headed ACTIVE and DONE, scrolled to keep the selection in sight.
    const rows: { text: string; color: string }[] = [];
    let at = 0;
    list.forEach((v, i) => {
      if (i === 0 && !v.done) rows.push({ text: 'ACTIVE', color: BRASS_DARK });
      if (v.done && (i === 0 || !list[i - 1].done)) rows.push({ text: 'DONE', color: BRASS_DARK });
      if (i === this.sel) at = rows.length;
      rows.push({ text: (i === this.sel ? '▶ ' : '  ') + v.def.title, color: i === this.sel ? '#ffe08a' : v.done ? TEXT_DIM : TEXT });
    });
    const lh = lineHeight(1) + 1, fit = Math.floor(LIST.h / lh);
    rows.slice(Math.max(0, at - fit + 1)).slice(0, fit).forEach((r, i) => drawText(ctx, r.text, LIST.x, LIST.y + i * lh, { size: 1, color: r.color }));
    ctx.fillStyle = BRASS_DARK; ctx.fillRect(PAGE.x - 12, LIST.y - 2, 1, LIST.h);
    // The page.
    const page = questPage(list[this.sel], PAGE.w, PAGE.h);
    for (const r of page.rows) drawText(ctx, r.text, PAGE.x, PAGE.y + r.y, { size: 1, color: r.color });
    ctx.fillStyle = BRASS_DARK; ctx.fillRect(PAGE.x, PAGE.y + page.rule, PAGE.w, 1);
  }
}
