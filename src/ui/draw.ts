// Small drawing helpers shared by every screen: panels, bars, wrapped text.
import { drawText, measureText, lineHeight } from '../lib/engine/text.ts';
import { PANEL, PANEL_EDGE, PANEL_LIGHT, INK, BRASS, BRASS_DARK } from './palette.ts';

/** A recessed panel in the carved frame: dark field, brass bevel, a rivet in each corner. */
export function panel(ctx: CanvasRenderingContext2D, x: number, y: number, w: number, h: number, fill = PANEL, edge: string = PANEL_EDGE): void {
  ctx.fillStyle = fill; ctx.fillRect(x, y, w, h);
  const hi = edge === PANEL_EDGE ? BRASS_DARK : edge;
  ctx.strokeStyle = INK; ctx.lineWidth = 1; ctx.strokeRect(x + 0.5, y + 0.5, w - 1, h - 1);
  ctx.strokeStyle = hi; ctx.strokeRect(x + 1.5, y + 1.5, w - 3, h - 3);
  ctx.fillStyle = BRASS;
  for (const [rx, ry] of [[x + 1, y + 1], [x + w - 4, y + 1], [x + 1, y + h - 4], [x + w - 4, y + h - 4]]) { ctx.fillRect(rx, ry, 3, 3); ctx.fillStyle = INK; ctx.fillRect(rx + 2, ry + 2, 1, 1); ctx.fillStyle = BRASS; }
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
    drawText(ctx, (i === selected ? '▶ ' : '  ') + flatOption(it), x, y, { size, color: optionColor(i, selected, opts.disabled, opts) });
    y += lineHeight(size) + 1;
  });
  return y;
}

function optionColor(i: number, selected: number, disabled: readonly boolean[] | undefined, o: { color?: string; dim?: string; hi?: string } = {}): string {
  return disabled?.[i] ? (o.dim ?? '#6a6270') : i === selected ? (o.hi ?? '#ffe08a') : (o.color ?? '#e8dcc0');
}

/**
 * An option can carry columns, tab-separated: 'label\tvalue\tnote'. A narrow panel sets the value
 * flush right and shows the selected option's note under the list; anywhere else they run on in
 * one line, two spaces apart.
 */
export function optionParts(opt: string): { label: string; value: string; note: string } {
  const [label, value = '', note = ''] = opt.split('\t');
  return { label, value, note };
}
export function flatOption(opt: string): string { return opt.split('\t').filter(Boolean).join('  '); }

/** `text` cut to `width` px, ending '..' when it had to be cut. */
export function fit(text: string, width: number, size = 1): string {
  if (measureText(text, size) <= width) return text;
  let t = text;
  while (t.length && measureText(t.trimEnd() + '..', size) > width) t = t.slice(0, -1);
  return t.trimEnd() + '..';
}

/** Room for an option's label in a `columnMenu` row `w` wide: less the marker, the value, and the arrows' margin when it scrolls. */
export function columnLabelWidth(w: number, value: string, scrolls: boolean): number {
  return w - (scrolls ? 8 : 0) - 12 - (value ? measureText(value) + 6 : 0);
}

/**
 * A menu in columns for a narrow panel: `rows` options from `top`, each label cut to fit beside its
 * value, which sits flush with the right edge. Arrows in the right margin say the list runs on.
 */
export function columnMenu(ctx: CanvasRenderingContext2D, items: readonly string[], x: number, y: number, w: number, selected: number, top: number, rows: number, opts: { disabled?: readonly boolean[] } = {}): void {
  const lh = lineHeight(1) + 1;
  const scrolls = items.length > rows, right = x + w - (scrolls ? 8 : 0);
  for (let i = top; i < Math.min(items.length, top + rows); i++) {
    const { label, value } = optionParts(items[i]);
    const color = optionColor(i, selected, opts.disabled);
    const yy = y + (i - top) * lh;
    drawText(ctx, (i === selected ? '▶ ' : '  ') + fit(label, columnLabelWidth(w, value, scrolls)), x, yy, { size: 1, color });
    if (value) drawText(ctx, value, right, yy, { size: 1, color, align: 'right' });
  }
  if (!scrolls) return;
  if (top > 0) drawText(ctx, '↑', x + w - 5, y, { size: 1, color: '#8f8677' });
  if (top + rows < items.length) drawText(ctx, '↓', x + w - 5, y + (rows - 1) * lh, { size: 1, color: '#8f8677' });
}
