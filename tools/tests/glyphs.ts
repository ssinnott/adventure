// The symbols the screens draw, held to the pixel font (FONT_CHARS, src/lib/engine/text.ts): a
// character the font has no glyph for is painted as nothing, as the target marker's '▼' was. The
// content's words are the pillars' and the quests' to check; this reads every string literal in
// src/ui/ and holds each character past plain ASCII (the arrows, the stars, the hearts) to the font.
import { readdirSync, readFileSync, statSync } from 'node:fs';
import { join, relative } from 'node:path';
import { fileURLToPath } from 'node:url';
import { FONT_CHARS } from '../../src/lib/engine/text.ts';
import { ok } from './lib.ts';

const ROOT = fileURLToPath(new URL('../../', import.meta.url));
const UI = join(ROOT, 'src', 'ui');

/** Every .ts file under a folder. */
const files = (dir: string): string[] => readdirSync(dir).flatMap((f) => { const p = join(dir, f); return statSync(p).isDirectory() ? files(p) : p.endsWith('.ts') ? [p] : []; });

/**
 * The characters past ASCII in a source's string literals that the font cannot draw, with their
 * lines. Comments are left out: they are never drawn. The font draws upper case, so a letter is
 * looked up as it is drawn.
 */
export function unfontable(source: string): { ch: string; line: number }[] {
  const out: { ch: string; line: number }[] = [];
  const has = new Set(FONT_CHARS);
  // Strings, template literals and comments, in the order they come, so a quote in a comment and a
  // comment marker in a string are each taken for what they are.
  const token = /\/\/[^\n]*|\/\*[\s\S]*?\*\/|'(?:[^'\\\n]|\\.)*'|"(?:[^"\\\n]|\\.)*"|`(?:[^`\\]|\\.)*`/g;
  for (const m of source.matchAll(token)) {
    if (m[0].startsWith('//') || m[0].startsWith('/*')) continue;
    for (const ch of m[0]) {
      if (ch.charCodeAt(0) < 128 || has.has(ch.toUpperCase())) continue;
      out.push({ ch, line: source.slice(0, m.index).split('\n').length });
    }
  }
  return out;
}

export function glyphs(): void {
  const bad = files(UI).flatMap((f) => unfontable(readFileSync(f, 'utf8')).map(({ ch, line }) => `'${ch}' at ${relative(ROOT, f)}:${line}`));
  ok(bad.length === 0, `every symbol src/ui/ draws is in the font${bad.length ? ' -> not: ' + bad.join(', ') : ''}`);
  // Broken on purpose: the old marker is caught, the arrow that replaced it is not, and nothing in a
  // comment counts.
  ok(unfontable("drawText(ctx, '▼', x, y);").map((b) => b.ch).join() === '▼', "a '▼' drawn is caught");
  ok(unfontable("drawText(ctx, '↓', x, y); // was '▼'").length === 0, "a '↓' is in the font, and a '▼' in a comment is never drawn");
}
