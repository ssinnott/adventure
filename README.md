# adventure — The Hearth of Caldera

A first-person, grid-based, six-character party RPG in the tradition of Might and Magic I–V, with
Oblivion-style faction questlines and spreading Rifts. Strict TypeScript, canvas, no runtime
dependencies, and nothing compiled to disk during development.

- [docs/DESIGN.md](docs/DESIGN.md) — the high-level design: pillars, world, party, combat, the main
  plot and three subplots, scope tiers and technical notes.
- [docs/SLICE.md](docs/SLICE.md) — what the vertical slice (M0) contains, the Thornmark extension
  that takes the party to level 10, and how the code is laid out.

## Running

```
npm install
npm run dev        # http://localhost:8080/ — .ts served through esbuild per request, no build step
npm run build      # dist/index.html, a single self-contained file
npm run check      # typecheck + Node tests + headless Chromium smoke test
```

Keys: arrows or WASD move and turn, Q/E strafe, Space acts, F searches the wall ahead, R rests,
C casts, I opens the character sheet (1–6 jump to a member), M the world map (arrows scroll it, Tab shows the
zones), F5/F9 save and load.

## Deploying

Every push to `main` runs [.github/workflows/pages.yml](.github/workflows/pages.yml): typecheck,
tests, `npm run build`, then publish `dist/` to GitHub Pages at
<https://ssinnott.github.io/adventure/>. Pages must be set to deploy from **GitHub Actions**
(Settings → Pages → Source); the workflow enables that on its first run if it can.

## Layout

```
src/main.ts        boot: canvas, input, loop
src/input.ts       keyboard -> queued actions (plus a text mode for names)
src/game/          the model: map, world, party, items, spells, monsters, combat, save, game
src/content/maps/  the authored maps: Harrow, the Shelf, the cellar, Greywater, Thornmark, Thornhold, the Grove
src/ui/            viewport, frame, sprites, screens, combat screen, title, party creation
src/ui/monsters/   the enemy drawings, one module per family, dispatched by sprites.ts
src/lib/           game-engine, vendored with git subtree (do not edit here; fix upstream)
tools/             dev server, bundler, tests, smoke test, screenshot, monster gallery and world map helpers
```

## The engine

`src/lib/` is [game-engine](https://github.com/ssinnott/game-engine) `src/`, added with
`git subtree add --prefix=src/lib ... --squash`. Used here: the fixed-step loop, the render canvas,
the deterministic rng, the pixel font, and the colour and shape helpers. The rig, audio and net
modules are vendored but not yet imported. Pull updates with
`git subtree pull --prefix=src/lib https://github.com/ssinnott/game-engine split --squash`
once the `split` branch has been re-published from main (it currently predates `src/audio/`).
