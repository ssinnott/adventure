# adventure — The Hearth of Caldera

A first-person, grid-based, six-character party RPG in the tradition of Might and Magic I–V, with
Oblivion-style faction questlines and spreading Rifts. Strict TypeScript, canvas, no runtime
dependencies, and nothing compiled to disk during development.

- [docs/DESIGN.md](docs/DESIGN.md) — the high-level design: pillars, world, party, combat, the main
  plot and three subplots, scope tiers and technical notes.
- [docs/SLICE.md](docs/SLICE.md) — what the vertical slice (M0) contains, the Thornmark extension
  that takes the party to level 10, and how the code is laid out.
- [docs/STORY.md](docs/STORY.md) — the main quest told as a story, the company's own chronicle of
  it: how the five acts of DESIGN.md §9 should feel.
- [docs/MONSTERS.md](docs/MONSTERS.md) — what the company fights down the road, area by area: the
  five kinds of monster, what each area's monsters carry of the story, the numbers they start from,
  and what the combat resolver has yet to learn.
- [docs/EXPANSION.md](docs/EXPANSION.md) — how the rest of Caldera gets built: the decisions v1
  waits on, the checks every map, monster and quest must pass, how the work splits so sessions do
  not collide, and the order of work.

## Running

```
npm install
npm run dev        # http://localhost:8080/ — .ts served through esbuild per request, no build step
npm run build      # dist/index.html, a single self-contained file
npm run check      # typecheck + Node tests + headless Chromium smoke test
```

Keys: arrows or WASD move and turn, Q/E strafe, Space acts, F searches the wall ahead, R rests,
C casts, I opens the character sheet (1–6 jump to a member), J the quest log, M the world map (arrows
scroll it, Tab shows the areas and zones, Z the whole map at once, Space the almanac: date, season and
weather), F5/F9 save and load.

The outdoors is one map, laid out square for square as the world map charts it: the Shelf and
Thornmark are zones of it, walked between without a seam. Where nothing is built yet the world ends,
and it looks it: pink empty space (see docs/SLICE.md, "The outdoors as one map").

## Deploying

Every push to `main` runs [.github/workflows/pages.yml](.github/workflows/pages.yml): typecheck,
tests, `npm run build`, then publish `dist/` to GitHub Pages at
<https://ssinnott.github.io/adventure/>. Pages must be set to deploy from **GitHub Actions**
(Settings → Pages → Source); the workflow enables that on its first run if it can.

## Layout

```
src/main.ts        boot: canvas, input, loop
src/input.ts       keyboard -> queued actions (plus a text mode for names)
src/game/          the model: map, outdoors, world, calendar, weather, party, items, spells, monsters, combat, quests, save, game
src/content/       the authored content; quests.ts is the quest log's words
src/content/maps/  the authored maps: Harrow, the Shelf, the cellar, Greywater, Thornmark, Thornhold, the Grove
src/ui/            viewport, frame, sprites, screens, combat screen, quest log, title, party creation
src/ui/monsters/   the enemy drawings, one module per family, dispatched by sprites.ts
src/ui/interiors/  the businesses' interiors, one module per trade, dispatched by interior.ts
src/lib/           game-engine, vendored with git subtree (do not edit here; fix upstream)
tools/             dev server, bundler, tests, smoke test, screenshot, monster and interior galleries, world map export, the level gates' fight simulation
```

## The engine

`src/lib/` is [game-engine](https://github.com/ssinnott/game-engine) `src/`, added with
`git subtree add --prefix=src/lib ... --squash`. Used here: the fixed-step loop, the render canvas,
the deterministic rng, the pixel font, and the colour and shape helpers. The rig, audio and net
modules are vendored but not yet imported. Pull updates with
`git subtree pull --prefix=src/lib https://github.com/ssinnott/game-engine split --squash`
once the `split` branch has been re-published from main (it currently predates `src/audio/`).
