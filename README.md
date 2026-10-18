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
  behind it, a group included; woods hide nothing (docs/SLICE.md);
- the pilot (docs/PILOT.md), which plays for watching. It finishes The Quiet Farm, the Foreland's
  chapter, from a new game on most seeds and companies. It goes on into Thornmark's, where the fair
  pilot does not finish and the omniscient one fails too; the ten chapters after are not reached.
  `npm test` runs the Foreland's full run (`node tools/test.ts fullrun`); a CI job, `fullrun`,
  started by hand, reports the rest.

Post-v1, by decision on 16 October 2026: the reach (the Glass and the Buried Tower, Glacier Foot
with the Ice Caves and the Vault, #56's 62 and 63 and the artifacts they hold; the bounds' eight are
#846's) and the Stretch tier (docs/DESIGN.md §12). Neither is filed, and v1 ships without them.

The gate judges a company two levels under a floor by its fights in Act I and, from Saltreach on,
where it wins them all, by how far its day goes (#851). Nothing is owed: `cairnfield_m8`, the one
map past its limit, was re-sized (#865). The gate's company takes what a level brings on the road
and buys nothing optional, no tier, skill or found item, and its bot never blesses, sleeps, drinks or
flees; the game's own bot, the auto-fight and the pilot's fights with it, blesses, sleeps and drinks
from level 11 and flees a fight lost. A line made on the tiers and those three ended 13 to 47% of
its days badly at 16 to 24, against an aim of a tenth, so the gate leaves them out: a company that
buys them has an easier road than measured, and the owner's own play is the judge
(docs/EXPANSION.md §5.2).

The world's end is drawn as the atlas paints it, the sea running on and the rim standing (#829,
built in #849). The owner has filed the land the maps lie open to as an epic, #828, with eight area
issues (#830 to #837); #845 to #847 (the bounds' enclave and artifacts) and #848 (the code's
reorganisation, its sub-issues filed as they are taken up) go with it. All of these, and the finishing touches #889 to #893, are approved and unparked at the owner's
word of 18 October 2026 and are being built in the order of docs/EXPANSION.md §9: the eight areas,
two in flight, Saltreach first and the Foreland last, with the reorganisation beside them, its
moves that touch every area landing in two short windows between area pull requests. Of the
touches, #890 is merged (#894) and #891 and #892 are closed, their rulings standing (#901).
The enclave's rules are built (#845) and do nothing until an area places an enclave.
The bounds' artifacts are #846's; the reach stays post-v1.

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
the tests and the smoke test, as three checks. Main has no branch protection, by the owner's word of
18 October 2026: the orchestrating session merges one pull request at a time, on a branch brought up
to date with main and green on all three (docs/EXPANSION.md §8.3).

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
