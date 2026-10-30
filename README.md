# adventure — The Hearth of Caldera

A first-person, grid-based, six-character party RPG in the tradition of Might and Magic I–V, with
Oblivion-style faction questlines and spreading Rifts. Strict TypeScript, canvas, no runtime
dependencies, and nothing compiled to disk during development.

- [docs/DESIGN.md](docs/DESIGN.md) — the high-level design: pillars, world, party, combat, the main
  plot and three subplots, scope tiers and technical notes.
- [docs/SYSTEMS.md](docs/SYSTEMS.md) — how the game is put together: the layers and the folders,
  the outdoors as one map, the calendar and the weather, the art kits and what is stubbed.
- [docs/CODEMAP.md](docs/CODEMAP.md) — a row to each file and its header's first paragraph, made
  by `node tools/codemap.ts`: a pull request edits the header of a file it adds or changes.
- [docs/archive/](docs/archive/) — docs cut and kept whole as history: the slice's doc (#1023),
  `docs/archive/SLICE-history.md`, with its Checks, its tools' usage and its hand-written code map;
  EXPANSION's history (#1024), `docs/archive/EXPANSION-history.md`: where it stood, the decisions
  v1 waited on, the order of work, what to watch and the risks; MONSTERS' §5 to §13, its rosters,
  in `docs/archive/MONSTERS-rosters.md` and the harness's runs of its §4.4 in
  `docs/archive/harness-log.md` (#1024).
- [docs/STORY.md](docs/STORY.md) — the main quest told as a story, the company's own chronicle of
  it: how the five acts of DESIGN.md §9 should feel.
- [docs/MONSTERS.md](docs/MONSTERS.md) — what the monsters are for: the five kinds of monster, what
  a monster can do, what the road asks of it and the numbers they are made from (the line, the
  roles, the pay and the test monster).
- [docs/ROSTER.md](docs/ROSTER.md) — the monsters as their defs make them, a row to each by area in
  road order, then the families: made by `node tools/roster.ts`, which a pull request that adds or
  changes a monster runs.
- [docs/EXPANSION.md](docs/EXPANSION.md) — how the rest of Caldera gets built: the principles,
  when an area is done, the checks every map, monster and quest must pass and how the work splits
  so sessions do not collide. The epics hold the order of work.
- [docs/decisions.md](docs/decisions.md) — the "Decided by" lists that settle the docs' rules,
  each under its doc and section and each the owner's to overturn; a builder adds the next there,
  under the doc and section of the rule it settles, an area's decisions aside (EXPANSION §8.2).
- [docs/ISSUES.md](docs/ISSUES.md) — how that work is filed: issue types, labels, epics, the
  Dependencies section every issue carries, and the sections of an issue.
- [docs/areas/](docs/areas/) — each area's own doc: `docs/areas/<area>.md`, its current state in
  250 lines at most, read first (where the atlas puts it, what is built, its secrets, what is open),
  with its decisions and its plan beside it in its folder, `docs/areas/<area>/` (EXPANSION §8.2).
  The Foreland's is the first, and the first in that shape; Thornmark's, Saltreach's, Wrackholm's,
  Sunderwood's, the Kilns', Cairnmoor's, Rimewater's, the Whitespine's, Ashfall's, the Glasswold's,
  Meridian Camp's, the Dead-Drop's and Hearth Isle's follow, each built; D3 moved them to the shape
  in five parts (#1027), and `node tools/test.ts areadocs` holds all fourteen to it.
- [docs/NAMES.md](docs/NAMES.md) — how places are named: each people's tongue, the few old names
  the first crew left, and the rules a rename follows.
- [docs/PILOT.md](docs/PILOT.md) — the pilot that plays the game for watching: P and T, the why
  line, the fair view it plays by (`Known`), how far it gets, its files and the calls made building
  it.

## Where it stands

On 18 October 2026 M3 is content-complete on main: Act V merged on 15 October, so the one quest runs
from the Foreland to the Heart, and what levels 11 to 32 need (#18) is built. v1 holds:

- Acts I to V on the road of twelve areas, the Council of Helmstow and the three endings;
- the quests: sixty-two side quests (#56's count: its sixty-four, less the reach's two), the Cargo
  Ledger, the three subplots, the Walk Home and twenty-two guild quests;
- thirty prestiges, three to each of the ten classes, each with its trainer in the world (the ten
  thirds each ask a quest);
- the weapon and magic tiers: Expert at arms and in magic from level 13, 2,000 gold a line, at the
  towns' trainers from Saltmouth on, and Master from 25 for 5,000 and a favour, taught by two people
  found and never told, the Wold's old Rider at arms and Old Cinder's scholar in magic;
- the twelve secondary skills, each guild's three at its halls: Linguist, Perception and Spirit
  Sense (the Lanterns'), Mountaineer, Danger Sense and Arms Master (the Wardens'), Swimmer,
  Cartographer and Pathfinder (the Cartographers'), Lockpick, Merchant and Navigator (the Compact's);
- eight found items past a plus, off the gear ladder and in no shop, two in each of Wrackholm, the
  Whitespine, Cairnmoor and Hearth Isle, one of each pair in the area's first locked chest: four
  weapons whose blows carry lightning or fire, and four things that raise speed, accuracy, might or
  personality by 3 while borne; and in Saltmouth Pender's set of picks and the Map Room's chart;
- the finishing touches (#54), line of sight among them: from lower ground a hill hides what lies
  behind it, a group included; woods hide nothing (docs/SYSTEMS.md);
- the pilot (docs/PILOT.md), which plays for watching. It finishes The Quiet Farm, the Foreland's
  chapter, from a new game on most seeds and companies. It goes on into Thornmark's, where the fair
  pilot does not finish and the omniscient one fails too; the ten chapters after are not reached.
  `npm test` runs the Foreland's full run (`node tools/test.ts fullrun`); a CI job, `fullrun`,
  started by hand, reports the rest.

Post-v1, by decision on 16 October 2026: the reach (the Glass and the Buried Tower, Glacier Foot
with the Ice Caves and the Vault, #56's 62 and 63 and the artifacts they hold; the bounds' eight are
#846's) and the Stretch tier (docs/DESIGN.md §12). Neither is filed, and v1 ships without them.

The gate judges a company two levels under a floor by its fights in Act I and, from Saltreach on,
where it wins them all, by how far its day goes (#851). Each figure stands on 100 seeds, or on 400
or 1,600 near its limit (#848). Three that 100 seeds passed by chance are past it on 1,600 and owed:
`ember_stone` at its floor and two bosses' odds, `kd_foal_taker`'s and `core_vask_thinned`'s.
`cairnfield_m8`, past its limit before, was re-sized (#865). The gate's company takes what a level
brings on the road and buys nothing optional, no tier, skill or found item, and its bot never
blesses, sleeps, drinks or flees; the game's own bot, the auto-fight and the pilot's fights with it,
blesses, sleeps and drinks from level 11 and flees a fight lost. A line made on the tiers and those
three ended 13 to 47% of its days badly at 16 to 24, against an aim of a tenth, so the gate leaves
them out: a company that buys them has an easier road than measured, and the owner's own play is the
judge (docs/EXPANSION.md §5.2).

The world's end is drawn as the atlas paints it, the sea running on and the rim standing (#829,
built in #849). The owner has filed the land the maps lie open to as an epic, #828, with eight area
issues (#830 to #837); #845 to #847 (the bounds' enclave and artifacts) and #848 (the code's
reorganisation, its sub-issues filed as they are taken up) go with it. All of these, and the
finishing touches #889 to #893, were approved and unparked at the owner's word of 18 October 2026.
The eight areas are built (#830 to #837), Saltreach's lair the last of them, and the reorganisation
goes on beside them (#848). Of the touches, #889, #890 and #893 are merged (#903, #894 and #948)
and #891 and #892 are closed, their rulings standing (#901). The enclave's rules are built (#845),
and seven areas place an enclave: the Kilns, the Glasswold, Cairnmoor, Rimewater, Wrackholm,
Ashfall and Saltreach. The bounds' artifacts are #846's: #847 has built their mark and their five
kinds of power, and all eight lie in the lairs their areas built (#830 to #837). The reach stays
post-v1.

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
C casts, I opens the character sheet (1–6 jump to a member, X swaps two members' places), J the
quest log, M the world map (arrows scroll it, Tab shows the areas and zones, Z the whole map at
once, Space the almanac: date, season and weather), F5/F9 save and load. P hands the game to the
pilot and takes it back; T sets its tempo (docs/PILOT.md). Left alone on the title for 45 seconds,
the game plays a new one by itself, saving nothing; any key, or a tap, brings the title back.

The outdoors is one map, laid out square for square as the world map charts it: the Foreland and
Thornmark are zones of it, walked between without a seam. Where nothing is built yet the world ends:
it is drawn as the world map paints it, the sea running on and the rim's mountains standing, and no
company crosses it (see docs/SYSTEMS.md, "The outdoors as one map").

## Deploying

Every push to `main` runs [.github/workflows/pages.yml](.github/workflows/pages.yml): typecheck,
tests, `npm run build`, then publish `dist/` to GitHub Pages at
<https://ssinnott.github.io/adventure/>. Pages must be set to deploy from **GitHub Actions**
(Settings → Pages → Source); the workflow enables that on its first run if it can.

Every pull request runs [.github/workflows/checks.yml](.github/workflows/checks.yml): the typecheck,
the tests, the smoke test and the smoke's crack sweep, the last in jobs of its own (`plan` and
`sweep`, #953), five checks. Main has no branch protection, by the owner's word of 18 October 2026:
the orchestrating session merges one pull request at a time, on a branch brought up to date with
main and green on all five (docs/EXPANSION.md §8.3), the sweep skipped only where the plan sweeps
no map.

## Layout

```
src/main.ts        boot: canvas, input, loop
src/app/           game.ts, the Game (the screen stack, save and load, attract mode); input.ts, keyboard -> queued actions (plus a text mode for names); pilot/, which plays the game for watching
src/game/          the model: map, outdoors, world, calendar, weather, party, people, guilds, items, spells, monsters, combat, quests, save
src/content/       the content, in TypeScript: index.ts lists the areas in road order and merges their tables; guilds.ts the guilds
src/content/areas/ one folder per area: its maps, monsters, items, chapter of the one quest, side quests, guild quests and climate (docs/areas/ has each one's doc)
src/ui/            viewport, frame, sprites (the monsters' dispatcher), scenery, screens, combat screen, quest log, title, party creation
src/ui/monsters/   the enemy drawings, one module per family, each registering its kinds, merged by the barrel (index.ts) and dispatched by sprites.ts
src/ui/interiors/  the businesses' interiors, a folder per area and a scene to a file, dispatched by interior.ts
src/lib/           game-engine, vendored with git subtree (do not edit here; fix upstream)
tools/             dev server, bundler, tests (tools/tests/, a file per suite), smoke test, screenshot, monster and interior galleries, world map export, the zone-map scaffold, the contact sheet, the level gates' fight simulation (and the gate check, tools/tests/gate.ts), the combat harness and its test monster
```

## The engine

`src/lib/` is [game-engine](https://github.com/ssinnott/game-engine) `src/`, added with
`git subtree add --prefix=src/lib ... --squash`. Used here: the fixed-step loop, the render canvas,
the deterministic rng, the pixel font and the colour and shape helpers. The rig, audio and net
modules are vendored but not yet imported. Pull updates with
`git subtree pull --prefix=src/lib https://github.com/ssinnott/game-engine split --squash`
once the `split` branch has been re-published from main (it currently predates the engine's audio,
vendored here as `src/lib/audio/`).
