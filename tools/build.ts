// Bundle the game entry into a self-contained page: dist/index.html (open from disk or serve
// anywhere). Modelled on the two games' tools/build.js -- same shape, same single-file output, so
// the shipped artifact is unchanged by the move to TypeScript.
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

const result = await build({
  entryPoints: [path.join(ROOT, 'src', 'main.ts')],
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
if (!out) throw new Error('esbuild produced no output file');
const js = out.text.replace(/<\/script/gi, '<\\/script');

let html = fs.readFileSync(path.join(ROOT, 'index.html'), 'utf8');
const tagRe = /<script[^>]*type=["']module["'][^>]*src=["'][^"']*main\.ts["'][^>]*>\s*<\/script>/i;
if (!tagRe.test(html)) throw new Error('index.html: could not find <script type="module" src="src/main.ts"> to inline');
html = html.replace(tagRe, () => `<script>\n${js}\n</script>`);
if (/src=["'](\.\/)?src\//.test(html)) throw new Error('dist/index.html still references src/');
fs.writeFileSync(path.join(OUT_DIR, 'index.html'), html);
console.log(`built dist/index.html (${(html.length / 1024).toFixed(0)} KB)`);
