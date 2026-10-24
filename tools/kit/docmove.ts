// A doc moved, not rewritten (#1011, part of #848): every line of the old file that is not blank is
// found among the lines of the new files, as many times as it stood in the old, and each of its
// paragraphs stands whole, its lines together and in their order, in one of them. A rule line, `---`,
// is no part of a doc's text and is left out on both sides. The library of tools/docmove.ts, the
// command line, and a file of tools/kit/, which takes src only (the layers check,
// tools/tests/layers.ts): so its suite, tools/tests/docmove.ts, takes it and not the tool.
import { execFileSync } from 'node:child_process';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '../..');

/** A file and its text. */
export interface Doc { path: string; text: string }
/** A line of a file, numbered from 1. */
export interface Line { path: string; n: number; text: string }

/** What a move kept: the old's lines and paragraphs, those not found, and the lines the new files add. */
export interface Move {
  old: string;
  lines: number;
  paragraphs: number;
  /** The old's lines each new file holds, by its path. */
  held: ReadonlyMap<string, number>;
  /** The old's lines not found, as many times as each falls short. */
  missing: Line[];
  /** The first line of each old paragraph that stands whole in no new file. */
  broken: Line[];
  /** The first line of each old paragraph its file holds before one that stood above it in its section. */
  unordered: Line[];
  /** The new files' lines that are no line of the old, or one more time than it stood (again: its first old line). */
  added: (Line & { again?: number })[];
}

/** Whether a line is counted: not blank, and not a rule. */
export const counted = (line: string): boolean => line.trim() !== '' && line.trim() !== '---';

/** A file's counted lines, numbered. */
export const linesOf = (doc: Doc): Line[] =>
  doc.text.split('\n').map((text, i) => ({ path: doc.path, n: i + 1, text })).filter((l) => counted(l.text));

/** A line that starts a paragraph of its own whatever stands above it: a heading, a list item or a table row. */
const STARTS = /^\s*(#{1,6}\s|[-*+]\s|\d+[.)]\s|\|)/;
const FENCE = /^\s*(```|~~~)/;

/**
 * A doc's paragraphs, each its counted lines: a run of lines between blank lines (or rules), broken
 * again at each heading, list item and table row, so that an item, a row or a heading moves whole on
 * its own; a fenced block is one paragraph, fence to fence.
 */
export function paragraphs(doc: Doc): Line[][] {
  const out: Line[][] = [];
  let cur: Line[] = [], fenced = false;
  const close = (): void => { if (cur.length) out.push(cur); cur = []; };
  doc.text.split('\n').forEach((text, i) => {
    const line = { path: doc.path, n: i + 1, text };
    if (fenced) { if (counted(text)) cur.push(line); if (FENCE.test(text)) { fenced = false; close(); } return; }
    if (!counted(text)) { close(); return; }
    if (FENCE.test(text)) { close(); cur.push(line); fenced = true; return; }
    if (STARTS.test(text)) close();
    cur.push(line);
  });
  close();
  return out;
}

/** The old doc's lines and paragraphs looked for in the new docs. */
export function move(old: Doc, news: readonly Doc[]): Move {
  const oldLines = linesOf(old), newLines = news.map(linesOf);
  const want = new Map<string, number>();
  for (const l of oldLines) want.set(l.text, (want.get(l.text) ?? 0) + 1);
  // The old's first line of each text, to mark a line the new files add that is an old line again.
  const again = new Map<string, number>();
  for (const l of oldLines) if (!again.has(l.text)) again.set(l.text, l.n);
  // The new files' lines in order, each taken by the old while the old has that line left over.
  const left = new Map(want), held = new Map<string, number>(), added: Move['added'] = [];
  for (const [i, lines] of newLines.entries()) {
    held.set(news[i].path, 0);
    for (const l of lines) {
      const k = left.get(l.text) ?? 0;
      if (k > 0) { left.set(l.text, k - 1); held.set(l.path, held.get(l.path)! + 1); } else added.push(again.has(l.text) ? { ...l, again: again.get(l.text) } : l);
    }
  }
  // The old's lines past the count the new files hold of each are the missing.
  const seen = new Map<string, number>(), missing: Line[] = [];
  for (const l of oldLines) {
    const k = (seen.get(l.text) ?? 0) + 1;
    seen.set(l.text, k);
    if (k > want.get(l.text)! - (left.get(l.text) ?? 0)) missing.push(l);
  }
  // Each paragraph: its lines together and in order among one new file's counted lines.
  const at = newLines.map((lines) => {
    const m = new Map<string, number[]>();
    lines.forEach((l, j) => { const a = m.get(l.text); if (a) a.push(j); else m.set(l.text, [j]); });
    return m;
  });
  // Where a paragraph stands whole in file f: each place its lines start, with the blank lines among
  // them where they stood (a fenced block's), so a paragraph split by a blank line is not whole.
  const places = (para: Line[], f: number): number[] => (at[f].get(para[0].text) ?? []).filter((j) =>
    para.every((p, k) => newLines[f][j + k]?.text === p.text && newLines[f][j + k].n - newLines[f][j].n === p.n - para[0].n));
  const paras = paragraphs(old);
  const broken = paras.filter((p) => newLines.every((_, f) => !places(p, f).length)).map((p) => p[0]);
  // Each file holds a section's paragraphs (those under one `## ` heading) in their old order: of those
  // whose text stood once in the old and stands once in the file, each comes after every earlier one,
  // or two paragraphs swapped would pass. Where a section's paragraphs go is the move's own choice.
  const key = (p: Line[]): string => p.map((l) => l.text).join('\n');
  const times = new Map<string, number>();
  for (const p of paras) times.set(key(p), (times.get(key(p)) ?? 0) + 1);
  const sectionOf = new Map<Line[], number>();
  let section = 0;
  for (const p of paras) { if (/^##\s/.test(p[0].text)) section = p[0].n; sectionOf.set(p, section); }
  const unordered: Line[] = [];
  for (const f of newLines.keys()) {
    const last = new Map<number, number>();
    for (const p of paras) {
      const js = times.get(key(p)) === 1 ? places(p, f) : [];
      if (js.length !== 1) continue;
      const s = sectionOf.get(p)!;
      if (js[0] < (last.get(s) ?? -1)) unordered.push(p[0]); else last.set(s, js[0]);
    }
  }
  return { old: old.path, lines: oldLines.length, paragraphs: paras.length, held, missing, broken, unordered, added };
}

/** Whether the move lost nothing: no line missing, no paragraph broken and none out of its order. */
export const kept = (m: Move): boolean => !m.missing.length && !m.broken.length && !m.unordered.length;

const num = (n: number): string => n.toLocaleString('en-GB');
/** A list in words, with no comma before the last: `a, b and c`. */
const and = (xs: readonly string[]): string => (xs.length < 2 ? xs.join('') : `${xs.slice(0, -1).join(', ')} and ${xs[xs.length - 1]}`);

/** The report: the counts, each line missing and each paragraph broken with its old line number, then the lines the new files add. */
export function report(m: Move, base: string): string {
  const found = m.lines - m.missing.length, whole = m.paragraphs - m.broken.length;
  const out = [
    `${m.old} at ${base}: ${num(m.lines)} lines not blank (a rule left out), in ${num(m.paragraphs)} paragraphs.`,
    `Found in ${and([...m.held.keys()])}: ${num(found)} of ${num(m.lines)} lines (${and([...m.held].map(([p, k]) => `${num(k)} in ${p}`))}); ${num(whole)} of ${num(m.paragraphs)} paragraphs whole in one file.`,
    m.missing.length ? `Missing, ${num(m.missing.length)}:` : 'Missing: none.',
    ...m.missing.map((l) => `  ${m.old}:${l.n}  ${l.text}`),
    m.broken.length ? `Paragraphs not whole in one file, ${num(m.broken.length)} (each by its first line):` : 'Paragraphs not whole: none.',
    ...m.broken.map((l) => `  ${m.old}:${l.n}  ${l.text}`),
    m.unordered.length ? `Paragraphs out of their order in their section, ${num(m.unordered.length)} (each by its first line):` : 'Paragraphs out of order: none.',
    ...m.unordered.map((l) => `  ${m.old}:${l.n}  ${l.text}`),
    `The new files add ${num(m.added.length)} line${m.added.length === 1 ? '' : 's'}` +
      `${m.added.some((l) => l.again) ? ` (${num(m.added.filter((l) => l.again).length)} of them an old line again)` : ''}:`,
    ...m.added.map((l) => `  ${l.path}:${l.n}  ${l.text}${l.again ? `  (old line ${l.again} again)` : ''}`),
  ];
  return out.join('\n');
}

/** A file's text at a git ref, or git's own words for why it cannot be read. */
export function atRef(ref: string, file: string): string {
  try { return execFileSync('git', ['show', `${ref}:${file}`], { cwd: ROOT, encoding: 'utf8', stdio: ['ignore', 'pipe', 'pipe'], maxBuffer: 64 << 20 }); }
  catch (e) { throw new Error(`git show ${ref}:${file} failed: ${String((e as { stderr?: string }).stderr ?? e).trim()}`); }
}
