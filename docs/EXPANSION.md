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
not gated by quest flags, and DESIGN.md's old Act 2 had its five stones in any order; the atlas has
one road of levels whose roads open on quest flags, and the pass to Thornmark already works that
way. §2.2 settles it, and DESIGN.md §9 now follows the road in five acts.

---

## 2. Decisions

### 2.1 How much of the atlas is v1 (open)

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
With one quest down one road (§2.2), that is the quest's own order: the road it walks comes first.
Land not built yet stays void, so the game is playable and honest at every step. Coaches and boats
are worth building under (b) as well: they let an area's core be played before the country between
it and the last area is built, they are Might and Magic VI's stables, and they spend the clock
(pillar 4).

Whichever is chosen, DESIGN.md §4's scale table and §12's tiers are rewritten to say so. Whatever
v1 is, the reach (DESIGN.md §9) is optional by design, so it is the first thing v1 can leave for
later.

### 2.2 One road, lightly held (decided)

One road, and one quest down it. A single long quest runs from level 1 to the level cap and leads
the company along the road of levels, area by area. Nothing on the road is locked: the ways between
areas are open from the first hour, and what turns a company back is the monsters. An area beyond
the party is too hard, not out of reach. That keeps pillar 1 (every region open, difficulty
geographic, never a quest flag), and takes the atlas's order as the order the quest leads in, not an
order the map enforces.

What changes:

- The pass to Thornmark stops being a flag gate (today it waits on `q_ashcombe_done` and
  `q_greywater_done`). Hale's checkpoint warns; Thornmark's monsters decide.
- The atlas's planned ways that open only after a later step (the coast road after Thornmark, the
  east road after the Tide Stone) are open from the start.
- Skills and boats open shortcuts and secrets off the road, which keeps pillar 2's skills that open
  the map, but never the road itself. Where the road crosses water there is a crossing to pay for.
  The atlas's road from Coldmere into Monks' Vale, marked "Mountaineer", becomes a road through
  the range.
- A few story beats may wait on the quest (§2.3); a way between areas never does.
- A step can be taken early. A company that reaches an area before the quest sends it can do
  everything there, and the journal reads true in either order.

What it asks of the numbers: if the monsters are the gate, a company well under an area's band must
lose its fights, and a company at the band must win them. Measured with `tools/gate.ts` (the premade
company trained to each level in its starting gear, 100 seeded fights for each group, played by a
bot that mends, casts its best damage spell or strikes, and never flees):

| Fights won (%), each from full health | Band | L1 | L2 | L3 | L4 | L5 |
|---|---|---|---|---|---|---|
| The Shelf | 1–5 | 100 | 100 | 100 | 100 | 100 |
| The Drowned Shrine (Greywater's second level) | 3–5 | 66 | 95 | 100 | 100 | 100 |
| Thornmark | 5–10 | 16 | 62 | 92 | 100 | 100 |
| The Grove Roots | 6–9 | 15 | 49 | 79 | 100 | 100 |
| The Cut Stone | 8–10 | 2 | 10 | 37 | 95 | 100 |
| The Warden of the Cut and its two elders | 8–10 | 0 | 0 | 0 | 62 | 97 |

From level 6 up every fight on every map is won. Walked in a row with no rest, Thornmark's road from
the pass to the Grove leaves 13% of level 3 companies standing after the third fight, and 78% of
level 4 companies after the fourth.

So today a company wins nine fights in ten two to four levels under the band on the sign (Thornmark
at level 3, the Grove Roots and the Cut Stone at 4), the gap widens down the road, and past the
floor every fight is won: the difficulty plain the anti-pillars warn of. The flag on the pass is
what holds the road now. The bot is weaker than a player (it never sleeps, blesses or drinks, and
has no gear past the start), and single groups at full health are kinder than play; the picture
holds either way, and the owner's play is the test of it. Taking the flag off the pass therefore
means making Thornmark hard enough to be the gate itself, and the gate check (§5.2) is how each
area is held to that.

### 2.3 Story locks: a few, and in the world (decided)

Some story locks are fine; many break the spell. A lock is anything the quest's progress opens
rather than the company's level or its feet: a door that opens only once the story has reached it, a
service withheld, a way shut.

- **Few, and spent on purpose.** No area has more than one, and the road about one to an act (four,
  to start). Each is declared with its reason, in the area's doc and in `content/locks.ts`, which the
  check reads (§5.4): a lock not in the list, or one over the count, fails until the owner signs it
  in. The first one spent is the core's door, which opens for the company that has restored the
  stones; Hearth Isle itself is reached like anywhere else.
- **In the world.** Each lock is a thing in plain sight with its reason on it: a sealed door, a
  drowned stair, a captain who will not sail into the storm. Never an invisible wall, never "not
  yet".
- **Never between areas** (§2.2).
- **No false "not yet".** Today's three hand-ins (Vask's wand, Hale's ledger, Sylvane's chisel) take
  their item only from a company already hired. A company that arrives early carrying it is first
  sent to go and find it, and must talk again to hand it over. A hand-in takes its item at the first
  meeting, and its words know the company came early.

Today the road has one lock, the flag on the pass, and it goes (§2.2); there are none inside any
place.

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
- Its chapter of the one quest (§5.8) is walked end to end in a test, and its side quests are in the
  log, with every key real.
- Its gate holds (§5.2): a company at its band's floor gets through, and one well under it turns
  back.
- The story lock it spends, if it spends one, is declared with its reason (§2.3).
- For a reach area: it has no chapter, its gate is set at the cap (§5.2), and every riddle in its
  super dungeons has its hint chain (§5.4).
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

### 5.2 The curve, and the gate

The pinned "level 2, level 4, level 7" checks give way to one curve in `content/progression.ts`:
for each area, its band, and the xp and gold a clear should give. Since the monsters are the only
gate on the road (§2.2), the curve says how hard each area is as well as what it pays. Checked for
each area:

- a clear, and at most two sweeps of what respawns, reaches the next area's band floor;
- a clear's gold pays for training the party through the band;
- every monster's level (a new field on `MonsterDef`) sits in its map's band, give or take two;
- chest and drop items sit in the band's price window, so a band 1–4 cellar holds no plate.

Its first rows are the slice's own figures from SLICE.md: level 2 from the Shelf and the cellar,
level 4 with Greywater, a little over level 7 from one clear of everything, two more sweeps of the
Grove to 10, and about 8,400 gold for six members from 5 to 10.

The gate, checked with the bot of `tools/gate.ts` (starting thresholds, set against the owner's own
play in the pilot):

- **At the floor, through.** A company at the band's floor wins nine in ten of the area's fights,
  and walks its road, resting where the road lets it (an inn, a camp), eight times in ten.
- **Well under, back.** Two levels under the floor, it wins no more than one fight in four.
- **The boss asks.** The area's boss is won about half the time at the floor, and nearly always two
  levels above it.
- **A fight at the company's level costs 15%.** A standard encounter at the company's own level
  costs it about 15% of its hit points and spell points together, six or seven fights between rests.
  `tools/harness.ts` measures any encounter or map against it, with a test monster for every role
  and level to build from (docs/MONSTERS.md §4.4).
- **A warning, not a wall.** The first groups past a border are the area's gentlest, and the
  crossing line tells a company under the band how the land feels to it, so the party learns it is
  early from a fight it can survive or run from, not from a wipe.
- **The reach asks the most.** In a reach area, a company at the cap that has walked the road wins
  about half its first fights; what it finds there is what makes the rest winnable.
- **The bot improves with the game.** It learns to sleep, bless, drink and flee as the party can,
  and to wear the gear the curve says a company has at each level, so the check keeps up.

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
- **Story locks.** Every flag that closes something (an exit, a gate, a door, a service) is in
  `content/locks.ts` with its reason; the list keeps to §2.3's count, and no lock stands between
  areas. Every hand-in takes its item at the first meeting.

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

### 5.8 The one quest

- **Joined from chapters.** Each area writes its chapter of the quest (`areas/<area>/chapter.ts`:
  its entries and its goals), and `content/index.ts` joins them in road order into one quest, with
  the goals furthest along first, as the log tries them. No area edits another's chapter, so one
  quest is not one file that everyone edits.
- **The road's own test.** The quest's walkthrough plays the chapters in order with a company at
  the curve's level for each step, and checks at every step that the goal names a place that
  exists, that the company's level sits in that place's band, and that the step can be finished.
  Each area's walkthrough is its chapter; the whole is the chain.
- **Early is fine.** It is played again with an area taken before the quest sends the company
  there, and the log must still read true.
- **Today's quests.** The Quiet Farm and The Grove Stone become its first chapters. The Greywater
  Ledger can stay a quest of its own, on the road but off the spine, now that the pass does not wait
  on it; The Lost Expedition stays a subplot. The log is worked out from the save and never stored
  in it, so re-cutting it is safe for old saves.
- **A long journal reads by chapter.** A quest from level 1 to the cap makes a long journal, so the
  log pages it by chapter (§7).
- **Every zone on the road.** Each zone the road crosses holds at least one step of the quest,
  found from what the quest's steps name; the reach areas (DESIGN.md §9) are declared as such, and
  are the only ones exempt. A first draft of the five acts left nine of the 27 zones without a
  step, 39% of the land; this check is what stops that happening unnoticed.
- **The reach is out of the way.** Each reach area is a dead end with a single way in, no step of
  the quest lies in it, and cutting the reach off the map leaves the road whole. The check reads
  the atlas's zones as the party walks them: borders over walkable land, and the road and sea
  links. On today's atlas the only dead ends are Glacier Foot, Monks' Vale and the Hearth Isle, and
  the Wold borders four zones on the road, so the Glass needs its lava flow before it passes.

---

## 6. Layout

Where the content moves to, in one refactor, in a single pull request while nothing else is open:

```
src/content/
  index.ts                  the areas in road order; the merged tables; the one quest, joined
  progression.ts            the curve (§5.2)
  locks.ts                  the story locks, each with its reason (§2.3)
  shipped.json              what saves may refer to (§5.5)
  areas/<area>/
    index.ts                the area: maps, monsters, items, quests, climate, palette, what is new
    maps/*.ts               its zone maps, towns and dungeons
    monsters.ts, items.ts
    chapter.ts              its chapter of the one quest (§5.8)
    quests.ts               its side quests
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
| The Shelf, Thornmark (the rest) | 1–10 | hills and farmland as terrain (the scaffold of the Downs asks for both); the wilderness features; the flag off the pass, with Thornmark retuned to be the gate (§9); for M1, the Wardens' and Lanterns' lines to rank 3, Standing, hirelings |
| Saltreach | 10–12 | the level cap past 10, and promotion I (the next spell tier lands on it); salt flats and tidal ground; the Salt Compact |
| Wrackholm | 12–14 | a crossing from the mainland, open from the start |
| Sunderwood | 14–16 | chasm, crystal and dead wood as terrain; the Rift generator |
| The Kilns | 16–18 | ash; Kiln-script and Linguist |
| Cairnmoor, Rimewater | 18–22 | heather, ice and lying snow as terrain; the rest of what they are, which DESIGN.md has yet to say |
| The Whitespine | 22–24 | cliffs and peaks, with the road through them |
| Ashfall | 24–28 | the crossing by ship, open from the start; volcano and lava fields |
| Hearth Isle, the Underdeep | 28–32 | promotion II; the Underdeep's look; the endings |
| The reach: the Glass, and Glacier Foot with the Vault (DESIGN.md §9) | the cap | glass and dunes; a lava flow sealing the Glass from the Ember Waste; the Vault's new kind of map, the inside of the sky; the atlas marking reach areas beside the road, not on it (its test holds the bands rising along the road, and a reach area's would not); super dungeons of many levels; artifacts |

The skills that open the map (Swimmer, Mountaineer, Navigator and the rest) come when there are
shortcuts and secrets for them; none is needed to follow the road. Along the whole road the systems
lane also owes the danger made legible (the band said on crossing, and in how a group is
described), the log paging the one quest by chapter, hand-ins that take their item at the first
meeting (§2.3), and a bot that plays as well as the party can (§5.2).

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
   is set at DESIGN.md's two). The gate check is the exception: it fails from Thornmark on (§2.2),
   and that is the pilot's work, not a waiver.
5. The scaffold and contact-sheet tools; the bot of `tools/gate.ts` made into the gate check.
6. DESIGN.md §4, §9, §12 and §13 brought into line with §2: the scale, the one road and its one
   quest, the tiers, content as TypeScript.

**Phase 1: the pilot, finishing M1.** First the road that exists, made to follow §2.2: the flag
comes off the pass and Hale's checkpoint becomes a warning; Thornmark, the Grove Roots and the Cut
Stone are retuned until the gate check holds at their floors; the tests that pin the flag gate (the
movement and outdoors suites, and the smoke test's walk through the pass) follow it; The Quiet Farm
and The Grove Stone become the one quest's first chapters; the three hand-ins take their items at
the first meeting. Then the rest of the Shelf and Thornmark
through the new pipeline: one zone map of the Downs west of the Shelf (band 2–5, where the land runs
on and the world now ends), then the Deepthorn. Meanwhile, in the systems lane, what M1 still lacks:
the Wardens' and Lanterns' lines to rank 3, Standing, hirelings, and the terrain the pilot asks for.
Measure how long a zone map takes and what the owner still finds by hand, and tune the thresholds.

**Phase 2: the systems for Acts II to IV**, one at a time: the level cap and promotion I, the Rift
generator, the next regions' climates, the crossings, and the danger made legible; the skills that
open shortcuts as the areas that have them come up.

**Phase 3: Acts II to IV, area by area** (Saltreach, Wrackholm, Sunderwood, the Kilns, …), no more
than two in flight, each to its definition of done, with the lanes running in parallel inside each.

**Phase 4: Act V and the subplots** (M3).

**Phase 5: the reach** (DESIGN.md §9). Optional by design, so it comes last, and v1 can ship
without it.

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
| Areas whose gate holds (§5.2) | none: fights give way two to four levels under the band | all |
| Story locks (§2.3) | 1, the pass, which goes | within the count, each declared with its reason |

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
- **A gate that is a wall, or a speed bump.** Too hard, and the border kills a company that wandered
  over it; too soft, and it is no gate. The check runs both ways, and the first groups past a
  border are the area's gentlest.
- **The bot flatters or slanders the party.** A bot that plays worse than people sets the gate too
  low. Grow its play with the party's, and let the owner's play overrule it.
- **One quest, one hotspot.** A quest from level 1 to the cap would be a file every area edits; it
  is joined from chapters instead (§5.8).
- **Scale creep.** Once §2.1 is decided it is the target; land past it waits in the void.
