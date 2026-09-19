// Small drawing helpers shared by every screen: panels, bars, wrapped text.
import { drawText, measureText, lineHeight } from '../lib/engine/text.ts';
import { PANEL, PANEL_EDGE, PANEL_LIGHT, INK } from './palette.ts';

export function panel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill = PANEL, edge = PANEL_EDGE): void {
  ctx.fillStyle = fill; ctx.fillRect(x, y, w, h);
  ctx.strokeStyle = edge; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  ctx.fillStyle = INK; ctx.fillRect(x, y, 1, 1); ctx.fillRect(x + w - 1, y, 1, 1); ctx.fillRect(x, y + h - 1, 1, 1); ctx.fillRect(x + w - 1, y + h - 1, 1, 1);
}

export function bar(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, frac: number, color: string, back = PANEL_LIGHT): void {
  ctx.fillStyle = back; ctx.fillRect(x, y, w, h);
  const f = Math.max(0, Math.min(1, frac));
  if (f > 0) { ctx.fillStyle = color; ctx.fillRect(x, y, Math.max(1, Math.round(w * f)), h); }
  ctx.strokeStyle = INK; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
}

/** Word-wrap `text` to `width` px at font `size`; returns the lines. */
export function wrap(text: string, width: number, size = 1): string[] {
  const out: string[] = [];
  for (const para of text.split('\n')) {
    let line = '';
    for (const word of para.split(' ')) {
      const next = line ? line + ' ' + word : word;
      if (measureText(next, size) > width && line) { out.push(line); line = word; }
      else line = next;
    }
    out.push(line);
  }
  return out;
}

/** Draw wrapped text; returns the y below the last line. */
export function paragraph(ctx: CanvasRenderingContext2D, text: string, x: number, y: number, width: number, opts: { size?: number; color?: string; maxLines?: number } = {}): number {
  const size = opts.size ?? 1;
  const lines = wrap(text, width, size);
  const shown = opts.maxLines ? lines.slice(0, opts.maxLines) : lines;
  for (const l of shown) { drawText(ctx, l, x, y, { size, color: opts.color }); y += lineHeight(size); }
  return y;
}

/** A menu of options with the selected one highlighted. Returns the y below. */
export function menu(ctx: CanvasRenderingContext2D, items: readonly string[], x: number, y: number, selected: number, opts: { size?: number; color?: string; dim?: string; hi?: string; disabled?: readonly boolean[] } = {}): number {
  const size = opts.size ?? 1;
  items.forEach((it, i) => {
    const dis = opts.disabled?.[i];
    const color = dis ? (opts.dim ?? '#6a6270') : i === selected ? (opts.hi ?? '#ffe08a') : (opts.color ?? '#e8dcc0');
    drawText(ctx, (i === selected ? '▶ ' : '  ') + it, x, y, { size, color });
    y += lineHeight(size) + 1;
  });
  return y;
}
