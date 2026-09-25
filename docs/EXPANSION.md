# Building out Caldera: more content, the same bar

How the rest of the world gets built: what v1 is, how the work is split so that many sessions can
build at once without colliding, and the checks that hold every map, monster and quest to the
standard of the slice. Read DESIGN.md for the why and SLICE.md for what exists. Figures are measured
on main at `b92a412` (25 September 2026).

---

## 1. Where we stand

| | Built | Planned |
|---|---|---|
| Outdoor land | 1,701 of 111,315 land squares (1.5%): the Shelf and Thornmark | the atlas: about 107 zone maps' worth in 12 areas. DESIGN.md §4 still says 6 regions of 32×32 |
| Towns | 2 | 9 in DESIGN.md; the atlas places 6 more |
| Dungeons | 3, five levels in all | 22 in DESIGN.md; the atlas places 13 more, the Underdeep and the Core |
| Levels | 1–10 (`MAX_LEVEL`) | bands to 32 on the atlas |
| Monsters | 33, each its own drawing, in 11 families | about ten new per area at the rate so far |
| Interiors | 12, one per business | about six per town |

Land still to build in each area, in 32×32 zone maps' worth (from `worldGrid`): the Shelf 8.3 (one
built), Thornmark 4.6 (one built), Saltreach 13.8, Wrackholm 1.7, Sunderwood 13.1, the Kilns
14.6, Cairnmoor 7.5, Rimewater 12.9, the Whitespine 7.7, Ashfall 10.5, the Glasswold 12.9, Hearth
Isle 1.1.

**What holds the bar today.** `npm run check`: a strict typecheck, 1,262 assertions from
`tools/test.ts` and the browser smoke test, 22 seconds, all green. And the owner playing the build:
all four issues filed so far were found that way, three of them visual (a floating head, #7; too
much on the walls, #9; cracks and roof seams, #10). Two of the four became checks afterwards (#8's
sling and #10's cracks); the floating head and the wall dressing did not.

**A check that passes by chance.** The smoke test starts each new game from `Math.random()`, so
every run checks a different world. Its end-of-the-world check wants a clear noon but asks for no
snow lying (`cover`) where it means no cloud (`cloud`); on a cloudy noon the cloud light moves the
pink out of the check's tolerance, and it fails. It failed for two of eight seeds tried, and once in
seven ordinary runs. As a required check, that is a pull request blocked for nothing, or a habit of
running it again until it passes.

**What is missing.** Nothing stands between a branch and main. CI runs only on a push to main, and
without the smoke test. Seven of the twelve pull requests were merged within half a minute of being
opened.

**Where parallel work collides.** The most-edited files are `docs/SLICE.md` (17 commits),
`tools/test.ts` (14), `README.md` (14), `tools/smoke.ts` (11), `src/game/monsters.ts` (10) and
`src/ui/sprites.ts` (10). Adding an area edits `MAP_DEFS`, `MONSTERS`, `ITEMS`, the `MonsterSprite`,
`Interior` and `RegionId` unions, `SCENES`, `CLIMATES`, the atlas, the quest list, the tests,
SLICE.md and the README. Four of the last six pull requests needed main merged into them before they
could land.

**Tests that pin today's content.** Beside checks that hold for any content (every square
reachable, every reference real), the suite pins facts about this content: `interiors.length ===
12`, "one clear of every map is worth level 7", squares on the Shelf. Two branches that each add a
business both change the 12 to 13, both pass, and main is wrong once the second is merged.

**Rules that live only in the content.** Measured on what the owner has approved:

- Outdoors, 90% of open squares are within 8 steps of something to find (a feature, a group, a way
  in or out), and none is further than 15. In towns, 6–7 and 10; in dungeons, 3–7 and 10.
- Three of the five secret doors have a written hint on the near side. The two on the Shelf do not:
  the Ashcombe cellar's (mill 4,7) has none, and the text beside Greywater's (greywater1 10,11) is
  the stash behind it.
- 42 of the 49 event and sign texts wrap to two lines of the log or fewer, as DESIGN.md §11 asks;
  seven run to three.

Nothing checks any of these, so the next session that does not know them will break them.

**Where the build and the design have parted.** DESIGN.md §13 says content is data under
`content/` and code never holds a monster's hit points; the monster, item and spell tables are in
`src/game/`. Pillar 1 says every region is open from the first hour and difficulty is geographic,
not gated by quest flags, and Act 2's five stones go in any order; the atlas has one road of levels
whose roads open on quest flags, and the pass to Thornmark already works that way.

---

## 2. Two decisions for the owner

### 2.1 How much of the atlas is v1

At the density the owner has approved outdoors (about 1.2 features and 1.5 groups per 100 open
squares), the rest of the atlas is about 1,000 more features and 1,300 more monster groups before
any town or dungeon: some fifty times what exists outdoors. The anti-pillar "no dead engine reuse"
rules out filling it with generated land.

| | What v1 is | Build | Gives up |
|---|---|---|---|
| (a) Everything by hand | every square at the slice's density | about 107 zone maps at full density | nothing, if the throughput holds; this is where the quality line is most at risk |
| **(b) Cores and country** (recommended) | per area, a core of hand-built zone maps at full density (its towns, its Stone, its dungeons' approaches); the rest built as country, to a looser floor (§5.3), from the atlas's terrain, a library of wilderness features and per-zone encounter tables | about three core zone maps per area; the country, the bulk of the land, at a fraction of the effort each | uniform density; the country has to be made good, not merely present |
| (c) Cores only | the cores, joined by travel from town to town (a coach, a boat) that costs gold and days; unbuilt land turned to real mountain, cliff or sea | about three zone maps per area | one continuous land, walked |

Under (b) the order is the cores, then the country along the roads between them, then the rest.
Land not built yet stays void, so the game is playable and honest at every step. Coaches and boats
are worth building under (b) as well: they let an area's core be played before the country between
it and the last area is built, they are Might and Magic VI's stables, and they spend the clock
(pillar 4).

Whichever is chosen, DESIGN.md §4's scale table and §12's tiers are rewritten to say so.

### 2.2 The road or the open world

If the atlas's road holds, each area is balanced against the one before it, and areas are built in
order. If pillar 1 holds, each area stands alone at its band and can be built alongside its
neighbours, and the ways between areas close only for geography (a ship, a mountaineer), never for
a flag. The plan below works either way; the curve (§5.2), and how many areas can be in flight at
once, depend on the answer.

---

## 3. Principles

1. **An area at a time, whole.** An area ships to its definition of done (§4). No more than two in
   flight: one being built, one being played.
2. **Systems before content.** An area waits for the systems it needs (§7). Content never works
   round a missing system.
3. **One new thing is one new file.** A new area, monster family, business or quest touches its own
   files and one registry line. Shared files change only in systems pull requests.
4. **Rules are executable.** Any rule a reviewer checks by eye that a machine could check is a test,
   calibrated on content the owner has approved.
5. **People judge what machines cannot.** The owner's time goes on whether it looks right, plays
   well and reads true, from pictures and a playtest; never on finding a crack or a floating head.
6. **A defect found by hand becomes a check.** The pull request that fixes it adds the check that
   would have caught it, or says why none can.

---

## 4. When an area is done

- Its zone maps, towns and dungeons pass the contract (§5).
- Its towns sell and teach what its band needs (rest, cures, the band's gear, the band's spell
  tier, training to the top of the band), each business with an interior of its own.
- Its step on the road, its Stone where it has one, is walked end to end in a test, and its quests
  are in the log with every key real.
- Its monsters are drawn, each def a drawing of its own, each through the silhouette checks, each
  placed.
- Its xp and gold sit on the curve (§5.2).
- Its climate, terrain and palette exist.
- It says what is new in it (§5.4), and that checks out.
- `docs/areas/<area>.md` says what is there, where the secrets and their hints are, and what was
  cut.
- Old saves load, and nothing they refer to has moved (§5.5).
- The owner has played it.

---

## 5. The content contract

The checks every content pull request runs, once Phase 0 (§9) has built the ones that are new. Each
iterates over all the content, so a new area is checked without writing new tests; the only test an
area adds is its own walkthrough.

### 5.1 Structure

Kept, and made to iterate over the areas instead of naming maps: rectangular rows, passable starts
and exits, every open square reachable, every reference real, every monster placed, every quest
item findable, every business its own interior, quest keys real and pages that fit.

Added:

- **No key behind its own lock.** Flood from the start, opening a locked door only with an iron key
  already reached and spending it; every locked door opens. The reachability check today floods
  with a key in hand, so it cannot see this.
- **Guardians stay dead.** A group that drops a quest item, has a `slainText` or is named by a quest
  has no `respawn` (DESIGN.md §6).
- **Encounter shape.** At most 12 monsters to a group; respawns in the range in use, 720 to 2880
  minutes.

### 5.2 The curve

The pinned "level 2, level 4, level 7" checks give way to one curve in `content/progression.ts`:
for each area, its band, and the xp and gold a clear should give. Checked for each area:

- a clear, and at most two sweeps of what respawns, reaches the next area's band floor;
- a clear's gold pays for training the party through the band;
- every monster's level (a new field on `MonsterDef`) sits in its map's band, give or take two;
- chest and drop items sit in the band's price window, so a band 1–4 cellar holds no plate.

Its first rows are the slice's own figures from SLICE.md: level 2 from the Shelf and the cellar,
level 4 with Greywater, a little over level 7 from one clear of everything, two more sweeps of the
Grove to 10, and about 8,400 gold for six members from 5 to 10.

### 5.3 Density: the map is the reward

Walking steps from an open square to the nearest point of interest:

| | 90% within | None past |
|---|---|---|
| Outdoors, core | 8 | 15 |
| Outdoors, country (§2.1 (b); a first guess, tuned in the pilot) | 12 | 20 |
| Town | 7 | 10 |
| Dungeon | 7 | 10 |

Points of interest are counted by kind, so a row of bare signs does not pass. Country meets its
looser floor with wilderness features in the Might and Magic manner, each a feature kind rather than
new art: a shrine or a fountain that gives a stat or a resistance once, a cairn with a cache, a
statue with a riddle whose hint lies elsewhere, a camp where the party can rest safely, a hermit
with a rumour. Each is cheap to place and worth the walk.

### 5.4 The pillars, where they can be checked

- **Hints.** If every secret door is to have a hint (the later dungeons all give one; the Shelf's
  two do not), each names its hint (`hint: '<event id>'`), and the check proves the hint can be
  reached from the start without passing through that door. A check by distance alone would count
  Greywater's stash, which lies behind its door.
- **Text.** No event or sign wraps past three lines of the log, measured with the log's own `wrap`
  (four fill it; two is the aim). Every glyph is in the font, for all text and not only the quest
  log's. British spelling, as the game has it (colour, armour).
- **Novelty.** An area declares what is new in it: monster families (not only variants), terrain,
  mechanics, landmarks. The check proves each exists, is used in the area and appears nowhere
  earlier on the road. Whether it is interesting is the owner's call; the check keeps the claim
  from being empty.
- **The land agrees with the map.** Where a zone map's edge meets unbuilt atlas land, its rivers,
  roads and coast carry on across the edge.

### 5.5 Saves

Content is never saved, so a content edit reaches every old save. Rename a chest and it fills
again; rename a guardian and it lives again; move a door and the saved door lands on the wrong
square, since doors are saved by coordinate; move a zone and the outdoors' seen squares and doors
are all off. Every push to main is deployed, so these are players' saves.

- `content/shipped.json` lists every id a save can hold: maps, feature and group ids, flags, items,
  door squares, zone placements. A test fails when something in it has gone or moved, unless the
  change bumps `SAVE_VERSION` with an upgrade, the way version 1 saves were brought to 2.
- New content only adds.

### 5.6 Art

- **One silhouette.** Each sprite kind, drawn at combat size, is one connected piece of ink (above
  an alpha threshold, ignoring specks), apart from parts it declares detached: glows, sparks,
  something thrown. This is #7 as a check.
- **No cracks.** The per-square crack sweep runs on every map a pull request changes, not only the
  cellar and Harrow; the rest are swept on release.
- **Restraint.** The share of wall faces dressed, per kind of map, stays at or under its level after
  #9; a new kind of dressing comes with its rate.
- **Distinct.** Every business its own interior and every monster def its own sprite kind; both are
  checked today.

### 5.7 What people look at

Each content pull request carries a contact sheet, made by one tool built from `tools/shot.ts`,
`tools/gallery.ts` and `tools/interiors.ts`:

- each new map from its arrival and from each landmark, by day and by night, with its automap and
  its crop of the world map;
- each new monster as a gallery strip ending on the hit flash;
- each new interior at noon and at nine at night.

The owner reviews the sheet on the pull request, and plays the area once it is whole. A reviewing
bot, reading a `REVIEW.md` that holds the parts of this contract that need judgment (the voice, the
secret found and never told, restraint), reads the text and the code.

---

## 6. Layout

Where the content moves to, in one refactor, in a single pull request while nothing else is open:

```
src/content/
  index.ts                  the areas in road order, and the merged tables the systems read
  progression.ts            the curve (§5.2)
  shipped.json              what saves may refer to (§5.5)
  areas/<area>/
    index.ts                the area: maps, monsters, items, quests, climate, palette, what is new
    maps/*.ts               its zone maps, towns and dungeons
    monsters.ts, items.ts, quests.ts
    walkthrough.ts          its end-to-end test
src/ui/monsters/<family>.ts             each exports its sprite kinds
src/ui/interiors/<area>/<business>.ts   a scene to a file; the trade helpers shared
docs/areas/<area>.md                    the area's brief, and what was built
```

- The `MonsterSprite`, `Interior` and `RegionId` unions are derived from the registries
  (`keyof typeof …`), so they stay exhaustive and nobody edits them by hand.
- The monster, item and spell tables move from `src/game/` into content, as DESIGN.md §13 asks, and
  stay TypeScript: the type checker is the best content check there is, and §13 is changed to say
  so.
- `tools/test.ts` becomes one file per suite under `tools/tests/`; the content suites iterate over
  the areas, and the runner finds each area's walkthrough.
- SLICE.md keeps the systems and points to the area docs. Its Checks row, one table cell every pull
  request rewrites, gives way to the test output, which already reads as the list. The README lists
  folders, not maps.

---

## 7. What each area waits on

| Area | Band | Systems first |
|---|---|---|
| The Shelf, Thornmark (the rest) | 1–10 | hills and farmland as terrain (the scaffold of the Downs asks for both); the wilderness features; for M1, the Wardens' and Lanterns' lines to rank 3, Standing, hirelings |
| Saltreach | 10–12 | the level cap past 10, and promotion I (the next spell tier lands on it); salt flats and tidal ground; the Salt Compact; Swimmer |
| Wrackholm | 12–14 | boats |
| Sunderwood | 14–16 | chasm, crystal and dead wood as terrain; the Rift generator |
| The Kilns | 16–18 | ash; Kiln-script and Linguist |
| Cairnmoor, Rimewater | 18–22 | heather, ice and lying snow as terrain; the rest of what they are, which DESIGN.md has yet to say |
| The Whitespine | 22–24 | Mountaineer as a skill; cliffs and peaks |
| Ashfall, the Glasswold | 24–28 | the ship; volcano, lava fields, glass and dunes |
| Hearth Isle, the Underdeep | 28–32 | promotion II; the Underdeep's look; the endings |

Rifts are where DESIGN.md itself asks for generated content: eight 12×12 templates, seeded, a pure
function of state and seed. Build the generator early, in the systems lane, and let generation scale
there, where repetition is the design, rather than on the map.

---

## 8. How the work is split

### 8.1 Lanes

| Lane | Touches | At once |
|---|---|---|
| Systems | `src/game/`, `src/ui/` outside the art modules, the save format, the shape of the registries | one |
| Area | `src/content/areas/<area>/`, `docs/areas/<area>.md` | one per area in flight |
| Creatures | `src/ui/monsters/<family>.ts` | one per family |
| Interiors | `src/ui/interiors/<area>/` | one per area |
| Quality | `tools/`, CI, this contract | one |

A content session that needs a change to a system stops and asks for one, or opens a systems pull
request first; it never edits shared files on the side.

### 8.2 The recipe for a zone map

1. **Brief**, in `docs/areas/<area>.md`: purpose, band, landmarks, the secret and its hint, the
   encounters, what is new.
2. **Scaffold.** `tools/scaffold.ts <zone> <x> <y>`, built in Phase 0, cuts the atlas's terrain
   for those squares into a draft map, so the land walked matches the land painted. A prototype,
   tried on the Downs west of the Shelf, gave in a second a wood, the hills and the road, and 14 of
   its 32 rows nothing but grass: the part to be authored.
3. **Author**: landmarks, features, groups, the secret, the ways in and out; dress the terrain.
4. **Check**: `npm run check`, then the contact sheet.
5. **Review**: a pull request, CI green, the owner's look at the sheet, merge.

A monster or an interior goes the same way: a brief, the drawing, the gallery or interiors render,
the checks, the sheet.

### 8.3 Pull requests

- A `pull_request` workflow runs the typecheck, the tests and the smoke test. The smoke test needs
  Playwright and Chromium on the runner; today it is not a dependency, and finds Playwright only on
  a machine that already has it. Branch protection requires the workflow, and requires a branch to
  be up to date with main (or a merge queue): that is what catches two green branches that are red
  together.
- Small pull requests: a zone map, a dungeon level, a monster family, a town's interiors; not an
  area at once.
- Deploy from a tag once an area has been played, rather than on every push, so players never get
  half an area. (Or keep deploying on every push, and accept that.)

### 8.4 CLAUDE.md

There is none, and it is the first thing every session reads. It says: read DESIGN.md, then this,
then the area's doc; the lanes; the recipe; run `npm run check` before pushing; the voice (terse,
two lines to an event, British spelling, the secret found and never told); commit subjects as the
history writes them ("Give the ogre a stoop, a face and a club that is a tree limb"); `src/lib/` is
vendored, and fixed upstream.

---

## 9. Order of work

**Phase 0: foundations.** Nothing new goes into the world until these are in; they are what lets
the rest run in parallel.

1. The pull request workflow and branch protection, on checks that cannot pass by chance: the smoke
   test pins its seed, and its clear noon asks for no cloud.
2. CLAUDE.md.
3. The layout refactor (§6), alone.
4. The contract's checks (§5), each run first against today's content; what they find is fixed, or
   waived by the owner (the Shelf's two unhinted secrets; the seven three-line texts, if the limit
   is set at DESIGN.md's two).
5. The scaffold and contact-sheet tools.
6. DESIGN.md §4, §12 and §13 brought into line with the decisions in §2.

**Phase 1: the pilot, finishing M1.** Build the rest of the Shelf and Thornmark through the new
pipeline: first one zone map of the Downs west of the Shelf (band 2–5, where the land runs on and
the world now ends), then the Deepthorn. Meanwhile, in the systems lane, what M1
still lacks: the Wardens' and Lanterns' lines to rank 3, Standing, hirelings, and the terrain the
pilot asks for. Measure how long a zone map takes and what the owner still finds by hand, and tune
the thresholds.

**Phase 2: the systems for Act 2**, one at a time: the level cap and promotion I, the skills that
open the map, the Rift generator, the next regions' climates, boats.

**Phase 3: Act 2, area by area** (Saltreach, Wrackholm, Sunderwood, the Kilns, …), no more than two
in flight, each to its definition of done, with the lanes running in parallel inside each.

**Phase 4: Act 3 and the subplots** (M3).

---

## 10. What to watch

| | Now | Aim |
|---|---|---|
| Defects the owner finds by hand | 4 over the slice | fewer each area; each one a check |
| Checks that pass or fail by chance | 1 (the end of the world) | none |
| Pull requests that needed main merged in | 4 of the last 6 | rare |
| `npm run check` | 22 seconds | under 3 minutes: full sweeps of what a pull request touches, the rest sampled or on release |
| Maps inside the density floor (§5.3) | unchecked | all |
| Areas on the curve (§5.2) | the slice, pinned | all |

---

## 11. Risks

- **The refactor collides with everything.** Do it first, alone and quickly.
- **Checks get gamed**, with a sign every eight squares. Count by kind, and keep the sheet and the
  playtest.
- **The scaffold becomes the content.** It is a draft. Density, novelty and the owner stand between
  it and main.
- **Art is the bottleneck.** Monster families are the costliest content: 150 to 1,264 lines each,
  and the art pass took about forty commits. Each area's brief budgets it: two or three new
  families, and variants on the frames that exist.
- **Scale creep.** Once §2.1 is decided it is the target; land past it waits in the void.
