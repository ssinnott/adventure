// The quest log (J): the quests the party knows of, active ones first, and for the one selected,
// what to do next and what the journal says so far, the one quest paged by chapter. It only reads
// game/quests.ts. The log is worked out when it opens and the selected quest's sheets when the
// choice moves, and the log is painted into a canvas of its own when the choice or the page changes,
// which each frame draws. The page layout is a pure function so the Node tests can check that every
// quest's journal is shown whole.
import type { Host, Screen } from './screen.ts';
import type { Action } from './actions.ts';
import { is } from './actions.ts';
import { ListMenu } from './menu.ts';
import { drawText, lineHeight } from '../lib/engine/text.ts';
import { panel, wrap } from './draw.ts';
import { LAYOUT } from './frame.ts';
import { BRASS, BRASS_DARK, TEXT, TEXT_DIM, YELLOW, GREEN, SELECTED } from './palette.ts';
import { questLog } from '../game/quests.ts';
import type { QuestView, PageView } from '../game/quests.ts';

/** The list of quests down the left; a title has to fit its width. */
export const LIST = { x: 20, y: 36, w: 172, h: 220 };
/** The selected quest's page, right of the list. */
export const PAGE = { x: 212, y: 36, w: 408, h: 220 };
const ENTRY_GAP = 4;

/** Active quests first, then finished ones, each in story order. */
export function questOrder(log: readonly QuestView[]): QuestView[] {
  return [...log.filter((v) => !v.done), ...log.filter((v) => v.done)];
}

interface PageRow { text: string; color: string; y: number; }

/** One sheet of the log: its rows, the rule under the goal at `rule`, and the page of the quest it shows. */
interface Sheet { rows: PageRow[]; rule: number; page: number; }

const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII', 'VIII', 'IX', 'X', 'XI', 'XII'];

/** A chapter's heading ("I. The Quiet Farm"), numbered by its place in the quest; none for a side quest. */
export function chapterHeading(v: QuestView, p: PageView): string | null {
  const i = v.def.chapters?.findIndex((c) => c === p.def) ?? -1;
  return i < 0 ? null : `${ROMAN[i] ?? i + 1}. ${p.def.title}`;
}

/**
 * A quest's sheets in a `w` x `h` box, one page after another: each headed by the title, the
 * chapter and the goal (or that it is done), a rule at `rule`, then the journal. A page too long
 * for one sheet goes on over the next, so no entry is ever left out.
 */
export function questSheets(v: QuestView, w: number, h: number): Sheet[] {
  const lh = lineHeight(1);
  const out: Sheet[] = [];
  v.pages.forEach((p, page) => {
    const head = (): Sheet => {
      const rows: PageRow[] = [{ text: v.def.title, color: BRASS, y: 0 }];
      let y = lh + 3;
      const heading = chapterHeading(v, p);
      if (heading) { rows.push({ text: heading, color: BRASS_DARK, y }); y += lh + 2; }
      for (const line of p.goal ? wrap(p.goal, w) : ['Done.']) { rows.push({ text: line, color: p.goal ? YELLOW : GREEN, y }); y += lh; }
      return { rows, rule: y + 2, page };
    };
    let sheet = head(), y = sheet.rule + 5, first = true;
    for (const e of p.entries) {
      const lines = wrap(e.text, w);
      if (!first && y + lines.length * lh > h) { out.push(sheet); sheet = head(); y = sheet.rule + 5; first = true; }
      for (const line of lines) { sheet.rows.push({ text: line, color: TEXT, y }); y += lh; }
      y += ENTRY_GAP; first = false;
    }
    out.push(sheet);
  });
  return out;
}

/** The sheet the log opens a quest on: the last of the page the goal is from, its newest entries. */
export function openingSheet(v: QuestView, sheets: readonly Sheet[]): number {
  for (let i = sheets.length - 1; i > 0; i--) if (sheets[i].page === v.focus) return i;
  return 0;
}

export class QuestScreen implements Screen {
  readonly overlay = true;
  /** The quests' cursor. */
  private readonly menu = new ListMenu();
  private get sel(): number { return this.menu.sel; }
  private set sel(row: number) { this.menu.sel = row; }
  private sheet = 0;
  /**
   * The log, active quests first, worked out when it opens, and the selected quest's sheets, when the
   * choice moves: nothing the log reads changes while it is open, since the game under it does not
   * tick (Game.update), and a load or a new game puts a stack of its own in place of it.
   */
  private readonly list: QuestView[];
  private sheets: Sheet[] = [];
  /** The log as drawn, painted when it opens and again when the choice or the page changes. */
  private paper: HTMLCanvasElement | null = null;
  /** The choice and the page the paper shows. */
  private painted = '';
  constructor(g: Host) {
    this.list = questOrder(questLog(g.tables, g.world.state, g.party));
    // Open on the quest that last changed, or the one last looked at, at its goal's chapter.
    this.sel = Math.max(0, this.list.findIndex((v) => v.def.id === g.questFocus));
    this.choose();
  }
  /** The selected quest's sheets, and the one the log opens it on. */
  private choose(): void {
    const v = this.list[this.sel];
    this.sheets = v ? questSheets(v, PAGE.w, PAGE.h) : [];
    this.sheet = v ? openingSheet(v, this.sheets) : 0;
  }
  update(g: Host, a: Action | null): void {
    if (!a) return;
    if (is(a, 'cancel', 'journal')) { g.pop(); return; }
    const list = this.list;
    if (!list.length) return;
    const n = this.sheets.length;
    if (is(a, 'left')) { this.sheet = Math.max(0, this.sheet - 1); return; }
    if (is(a, 'right')) { this.sheet = Math.min(n - 1, this.sheet + 1); return; }
    if (this.menu.press(a, { n: list.length }) !== 'moved') return;
    g.questFocus = list[this.sel].def.id;
    this.choose();
  }
  render(_g: Host, ctx: CanvasRenderingContext2D): void {
    const r = LAYOUT.sheet, at = Math.min(this.sheet, Math.max(0, this.sheets.length - 1)), shown = `${this.sel} ${at}`;
    if (!this.paper || this.painted !== shown) {
      this.paper ??= Object.assign(document.createElement('canvas'), { width: r.w, height: r.h });
      const pc = this.paper.getContext('2d')!;
      pc.setTransform(1, 0, 0, 1, -r.x, -r.y);
      this.paint(pc, at);
      this.painted = shown;
    }
    ctx.drawImage(this.paper, r.x, r.y);
  }
  /** The log at page `at`, in the canvas's coordinates: the panel, the list, the page and the keys. */
  private paint(ctx: CanvasRenderingContext2D, at: number): void {
    const list = this.list, sheets = this.sheets, r = LAYOUT.sheet, hint = LAYOUT.hint;
    panel(ctx, r.x, r.y, r.w, r.h);
    drawText(ctx, 'QUEST LOG', 20, 18, { size: 1, color: BRASS });
    const keys = (sheets.length > 1 ? `←→ PAGE ${at + 1}/${sheets.length}   ` : '') + (list.length > 1 ? '↑↓ CHOOSE   ' : '');
    drawText(ctx, keys + 'J OR ESC CLOSE', hint.x, hint.y, { size: 1, color: TEXT_DIM, align: 'right' });
    if (!list.length) { drawText(ctx, 'No quests yet. The Regent-Warden is hiring.', LIST.x, LIST.y, { size: 1, color: TEXT_DIM }); return; }
    const active = list.filter((v) => !v.done).length, done = list.length - active;
    drawText(ctx, [active ? `${active} ACTIVE` : '', done ? `${done} DONE` : ''].filter(Boolean).join('  '), 620, 18, { size: 1, color: TEXT_DIM, align: 'right' });
    // The list: headed ACTIVE and DONE, scrolled to keep the selection in sight.
    const rows: { text: string; color: string }[] = [];
    let row = 0;
    list.forEach((v, i) => {
      if (i === 0 && !v.done) rows.push({ text: 'ACTIVE', color: BRASS_DARK });
      if (v.done && (i === 0 || !list[i - 1].done)) rows.push({ text: 'DONE', color: BRASS_DARK });
      if (i === this.sel) row = rows.length;
      rows.push({ text: (i === this.sel ? '▶ ' : '  ') + v.def.title, color: i === this.sel ? SELECTED : v.done ? TEXT_DIM : TEXT });
    });
    const lh = lineHeight(1) + 1, fit = Math.floor(LIST.h / lh);
    rows.slice(Math.max(0, row - fit + 1)).slice(0, fit).forEach((r, i) => drawText(ctx, r.text, LIST.x, LIST.y + i * lh, { size: 1, color: r.color }));
    ctx.fillStyle = BRASS_DARK; ctx.fillRect(PAGE.x - 12, LIST.y - 2, 1, LIST.h);
    // The page.
    const sheet = sheets[at];
    for (const r of sheet.rows) drawText(ctx, r.text, PAGE.x, PAGE.y + r.y, { size: 1, color: r.color });
    ctx.fillStyle = BRASS_DARK; ctx.fillRect(PAGE.x, PAGE.y + sheet.rule, PAGE.w, 1);
  }
}
