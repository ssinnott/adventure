// Bundle each page's entry into a self-contained page in dist/ (open from disk or serve anywhere):
// the game, index.html with src/main.ts, as dist/index.html, and the wiki, wiki.html with
// src/app/wiki/main.ts, as dist/wiki.html, which Pages publishes beside it. Modelled on the two
// games' tools/build.js -- same shape, same single-file output, so the shipped artifact is unchanged
// by the move to TypeScript.
//
// esbuild resolves the './foo.ts' specifiers directly, so the same import graph the dev server
// serves one file at a time is the one bundled here. Nothing rewrites a specifier at any stage.
import { build } from 'esbuild';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), '..');
const OUT_DIR = path.join(ROOT, 'dist');
fs.mkdirSync(OUT_DIR, { recursive: true });

/** The pages built: each page's file and the entry its module script names. */
const PAGES: readonly { html: string; entry: string }[] = [
  { html: 'index.html', entry: 'src/main.ts' },
  { html: 'wiki.html', entry: 'src/app/wiki/main.ts' },
];

for (const { html: page, entry } of PAGES) {
  const result = await build({
    entryPoints: [path.join(ROOT, entry)],
    bundle: true,
    format: 'iife',
    // Matches tsconfig's target, so the checker and the emitter agree on what the output may use.
    target: ['es2022'],
    minify: false,
    legalComments: 'none',
    write: false,
    logLevel: 'error',
  });
  const out = result.outputFiles[0];
  if (!out) throw new Error(`esbuild produced no output file for ${entry}`);
  const js = out.text.replace(/<\/script/gi, '<\\/script');

  let html = fs.readFileSync(path.join(ROOT, page), 'utf8');
  const name = entry.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const tagRe = new RegExp(`<script[^>]*type=["']module["'][^>]*src=["'](\\./)?${name}["'][^>]*>\\s*</script>`, 'i');
  if (!tagRe.test(html)) throw new Error(`${page}: could not find <script type="module" src="${entry}"> to inline`);
  html = html.replace(tagRe, () => `<script>\n${js}\n</script>`);
  if (/src=["'](\.\/)?src\//.test(html)) throw new Error(`dist/${page} still references src/`);
  fs.writeFileSync(path.join(OUT_DIR, page), html);
  console.log(`built dist/${page} (${(html.length / 1024).toFixed(0)} KB)`);
}
