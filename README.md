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
- [docs/ISSUES.md](docs/ISSUES.md) — how that work is filed: issue types, labels, epics, the
  Dependencies section every issue carries, and the sections of an issue.
- [docs/areas/](docs/areas/) — each area's own doc: where the atlas puts it, what is built, what
  is still to build and what is left to decide. The Foreland's is the first; Thornmark's,
  Saltreach's, Wrackholm's, Sunderwood's, the Kilns', Cairnmoor's, Rimewater's, the Whitespine's,
  Ashfall's, the Glasswold's, Meridian Camp's, the Dead-Drop's and Hearth Isle's follow, and each
  is built.
- [docs/NAMES.md](docs/NAMES.md) — how places are named: each people's tongue, the few old names
  the first crew left, and the rules a rename follows.
- [docs/PILOT.md](docs/PILOT.md) — the pilot that plays the game for watching: P and T, the why
  line, the fair view it plays by (`Known`), how far it gets, its files and the calls made building
  it.

## Where it stands

On 17 October 2026 M3 is content-complete on main: Act V merged on 15 October, so the one quest runs
from the Foreland to the Heart. v1 holds:

- Acts I to V on the road of twelve areas, the Council of Helmstow and the three endings;
- the quests: sixty-two side quests (#56's count: its sixty-four, less the reach's two), the Cargo
  Ledger, the three subplots, the Walk Home and twenty-two guild quests;
- thirty prestiges, three to each of the ten classes, each with its trainer in the world (the ten
  thirds each ask a quest);
- three of the twelve secondary skills, taught: Linguist, Mountaineer and Swimmer;
- the finishing touches (#54), line of sight among them: from lower ground a hill hides what lies
  behind it, a group included; woods hide nothing (docs/SLICE.md);
- the pilot (docs/PILOT.md), which plays for watching. It finishes The Quiet Farm, the Foreland's
  chapter, from a new game on most seeds and companies. It goes on into Thornmark's, where the fair
  pilot does not finish and the omniscient one fails too; the ten chapters after are not reached.
  `npm test` runs the Foreland's full run (`node tools/test.ts fullrun`); a CI job, `fullrun`,
  started by hand, reports the rest.

Post-v1, by decision on 16 October 2026: the reach (the Glass and the Buried Tower, Glacier Foot
with the Ice Caves and the Vault, #56's 62 and 63 and the artifacts they hold), the skill tiers with
the Master trainers, nine of the twelve secondary skills and the Stretch tier (docs/DESIGN.md §12).
None is filed, and v1 ships without them.

The gate reports 86 figures owed to #18: in each, a company two levels under a floor wins more of
its fights than the aim allows. They are reported, not failed (docs/EXPANSION.md §5.2).

The world's end is drawn as the atlas paints it, the sea running on and the rim standing (#829,
built in #849). The owner has filed the land the maps lie open to as an epic, #828, with eight area
issues (#830 to #837), approved and labelled parked: nothing in them is built. The owner has also
filed #845 to #847 (the bounds' enclave and artifacts) and #848 (the code's reorganisation); none is
yet approved.

The owner's own playthrough of M3 is what remains before v1 is called done; the tracker holds no
issue for it.

## Running

```
npm install
npx playwright install chromium   # once, for the smoke test (the session containers have it already)
npm run dev        # http://localhost:8080/ — .ts served through esbuild per request, no build step
npm run build      # dist/index.html, a single self-contained file
npm run check      # typecheck + Node tests + headless Chromium smoke test
```

Keys: arrows or WASD move and turn, Q/E strafe, Space acts, F searches the wall ahead, R rests,
C casts, I opens the character sheet (1–6 jump to a member), J the quest log, M the world map (arrows
scroll it, Tab shows the areas and zones, Z the whole map at once, Space the almanac: date, season and
weather), F5/F9 save and load. P hands the game to the pilot and takes it back; T sets its tempo
(docs/PILOT.md). Left alone on the title for 45 seconds, the game plays a new one by itself, saving
nothing; any key, or a tap, brings the title back.

The outdoors is one map, laid out square for square as the world map charts it: the Foreland and
Thornmark are zones of it, walked between without a seam. Where nothing is built yet the world ends:
it is drawn as the world map paints it, the sea running on and the rim's mountains standing, and no
company crosses it (see docs/SLICE.md, "The outdoors as one map").

## Deploying

Every push to `main` runs [.github/workflows/pages.yml](.github/workflows/pages.yml): typecheck,
tests, `npm run build`, then publish `dist/` to GitHub Pages at
<https://ssinnott.github.io/adventure/>. Pages must be set to deploy from **GitHub Actions**
(Settings → Pages → Source); the workflow enables that on its first run if it can.

Every pull request runs [.github/workflows/checks.yml](.github/workflows/checks.yml): the typecheck,
the tests and the smoke test, as three checks. Once the owner protects main, it takes a pull request
only when all three pass and it is up to date with main.

## Layout

```
src/main.ts        boot: canvas, input, loop
src/input.ts       keyboard -> queued actions (plus a text mode for names)
src/game/          the model: map, outdoors, world, calendar, weather, party, people, guilds, items, spells, monsters, combat, quests, save, game
src/content/       the content, in TypeScript: index.ts lists the areas in road order and merges their tables; guilds.ts the guilds
src/content/areas/ one folder per area: its maps, monsters, items, chapter of the one quest, side quests, guild quests and climate (docs/areas/ has each one's doc)
src/ui/            viewport, frame, sprites, screens, combat screen, quest log, title, party creation
src/ui/monsters/   the enemy drawings, one module per family, dispatched by sprites.ts
src/ui/interiors/  the businesses' interiors, a folder per area and a scene to a file, dispatched by interior.ts
src/lib/           game-engine, vendored with git subtree (do not edit here; fix upstream)
tools/             dev server, bundler, tests (tools/tests/, a file per suite), smoke test, screenshot, monster and interior galleries, world map export, the zone-map scaffold, the contact sheet, the level gates' fight simulation (and the gate check, tools/tests/gate.ts), the combat harness and its test monster
```

## The engine

`src/lib/` is [game-engine](https://github.com/ssinnott/game-engine) `src/`, added with
`git subtree add --prefix=src/lib ... --squash`. Used here: the fixed-step loop, the render canvas,
the deterministic rng, the pixel font, and the colour and shape helpers. The rig, audio and net
modules are vendored but not yet imported. Pull updates with
`git subtree pull --prefix=src/lib https://github.com/ssinnott/game-engine split --squash`
once the `split` branch has been re-published from main (it currently predates `src/audio/`).
