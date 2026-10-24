# Building out Caldera: more content, the same bar

How the rest of the world gets built: what v1 is, how the work is split so that many sessions can
build at once without colliding, and the checks that hold every map, monster and quest to the
standard of the slice. Read DESIGN.md for the why and SLICE.md for what exists. The figures of §1
are measured on main at `b92a412` (25 September 2026); §10 holds where main stands on 18 October.

---

## 1. Where we stand

This section is the position on 25 September 2026, kept as the doc's starting point: "today" below
is that day. Where main stands now is read in README.md ("Where it stands"), in each area's doc
(docs/areas/) and in §10's table.

| | Built then | Planned then |
|---|---|---|
| Outdoor land | 1,717 of 111,331 land squares (1.5%): the Foreland and Thornmark | the atlas: about 107 zone maps' worth in 12 areas. DESIGN.md §4 said 6 regions of 32×32 until #39 |
| Towns | 2 | 9 in DESIGN.md until #39; the atlas places 6 more |
| Dungeons | 3, five levels in all | 22 in DESIGN.md until #39; the atlas places 13 more, the Underdeep and the Core |
| Levels | 1–10 (`MAX_LEVEL`) | bands to 32 on the atlas |
| Monsters | 33, each its own drawing, in 11 families | about ten new per area at the rate so far |
| Interiors | 12, one per business | about six per town |

Land still to build in each area, in 32×32 zone maps' worth (from `worldGrid`): the Foreland 8.3
(one built), Thornmark 4.6 (one built), Saltreach 13.8, Wrackholm 1.7, Sunderwood 13.1, the Kilns
14.6, Cairnmoor 7.5, Rimewater 12.9, the Whitespine 7.7, Ashfall 10.5, the Glasswold 12.9, Hearth
Isle 1.1.

**What holds the bar today.** `npm run check`: a strict typecheck, 1,262 assertions from
`tools/test.ts` and the browser smoke test, 22 seconds, all green. And the owner playing the build:
all four issues filed so far were found that way, three of them visual (a floating head, #7; too
much on the walls, #9; cracks and roof seams, #10). Two of the four became checks afterwards (#8's
sling and #10's cracks); the floating head and the wall dressing did not.

**A check that passed by chance.** The smoke test started each new game from `Math.random()`, so
every run checked a different world. Its end-of-the-world check wanted a clear noon but let fog
through, and once fog passed 0.05 the view drew a haze over the pink that took it out of the
check's tolerance. It failed about one run in five: as a required check, a pull request blocked for
nothing, or a habit of running it again until it passed. Every run now plays one seeded world (#23).

**What was missing.** Nothing stood between a branch and main. CI ran only on a push to main, and
without the smoke test. Nine of the fourteen pull requests were merged within half a minute of being
opened. Every pull request now runs the typecheck, the tests and the smoke test (#27); main has no
branch protection, by the owner's word of 18 October 2026, and §8.3 says how merges stay safe.

**Where parallel work collides.** The most-edited files are `docs/SLICE.md` (17 commits),
`tools/test.ts` (14), `README.md` (14), `tools/smoke.ts` (11), `src/game/monsters.ts` (10) and
`src/ui/sprites.ts` (10). Adding an area edits `MAP_DEFS`, `MONSTERS`, `ITEMS`, the `MonsterSprite`,
`Interior` and `RegionId` unions, `SCENES`, `CLIMATES`, the atlas, the quest list, the
tests, SLICE.md and the README. Three of the last six pull requests needed main merged into them
before they could land.

**Tests that pin today's content.** Beside checks that hold for any content (every square reachable,
every reference real), the suite pins facts about this content: "one clear of every map is worth
level 7", squares on the Foreland. It pinned `interiors.length === 12` too, so two branches that
each added a business would both change the 12 to 13, both pass, and leave main wrong once the
second was merged; each business is now held to the rooms its area lists (#29).

**Rules that live only in the content.** Measured on what the owner has approved:

- Outdoors, 90% of open squares are within 8 steps of something to find (a feature, a group, a way
  in or out), and none is further than 15. In towns, 6–7 and 10; in dungeons, 3–7 and 10.
- All five secret doors have a written hint on the near side. The Foreland's two were given
  theirs by #51: a cold draught beside the Ashcombe cellar's (mill 4,7), and drag marks beside
  Brandy Hole's (greywater1 10,11), whose old text was the stash behind it.
- 43 of the 51 event and sign texts wrap to two lines of the log or fewer as it shows them, as
  DESIGN.md §11 asks; eight run to three.

`tools/tests/pillars.ts` now holds the hints and the three-line cap (#33); nothing yet checks the
first, so the next session that does not know it will break it.

**Where the build and the design have parted.** DESIGN.md §13 says content is data under
`content/` and code never holds a monster's hit points; the monster, item and spell tables are in
`src/game/`. Pillar 1 says every region is open from the first hour and difficulty is geographic,
not gated by quest flags, and DESIGN.md's old Act 2 had its five stones in any order; the atlas has
one road of levels whose roads opened on quest flags, and the pass to Thornmark worked that way.
§2.2 settles it, and DESIGN.md §9 now follows the road in five acts.

---

## 2. Decisions

### 2.1 How much of the atlas is v1 (decided)

At the density the owner has approved outdoors (about 1.2 features and 1.5 groups per 100 open
squares), the rest of the atlas is about 1,000 more features and 1,300 more monster groups before
any town or dungeon: some fifty times what exists outdoors. The anti-pillar "no dead engine reuse"
rules out filling it with generated land.

| | What v1 is | Build | Gives up |
|---|---|---|---|
| (a) Everything by hand | every square at the slice's density | about 107 zone maps at full density | nothing, if the throughput holds; this is where the quality line is most at risk |
| **(b) Cores and country** (the owner's choice) | per area, a core of hand-built zone maps at full density (its towns, its Stone, its dungeons' approaches); the rest built as country, to a looser floor (§5.3), from the atlas's terrain, a library of wilderness features and per-zone encounter tables | about three core zone maps per area; the country, the bulk of the land, at a fraction of the effort each | uniform density; the country has to be made good, not merely present |
| (c) Cores only | the cores, joined by travel from town to town (a coach, a boat) that costs gold and days; unbuilt land turned to real mountain, cliff or sea | about three zone maps per area | one continuous land, walked |

Under (b) the order is the cores, then the country along the roads between them, then the rest.
With one quest down one road (§2.2), that is the quest's own order: the road it walks comes first.
Land not built yet stays void, so the game is playable and honest at every step. Coaches and boats
are worth building under (b) as well: they let an area's core be played before the country between
it and the last area is built, they are Might and Magic VI's stables, and they spend the clock
(pillar 4).

**Decided: (b), cores and country**, not (a) or (c). Coaches and boats as well, later: to be filed,
with the owner's agreement, when the second area's core comes up (built, #164).

DESIGN.md §4's scale table was rewritten to say so, and §12 says so under its tiers. The reach (DESIGN.md §9) is
optional by design, so it is the first thing v1 can leave for later.

### 2.2 One road, lightly held (decided)

One road, and one quest down it. A single long quest runs from level 1 to the level cap and leads
the company along the road of levels, area by area. Nothing on the road is locked: the ways between
areas are open from the first hour, and what turns a company back is the monsters. An area beyond
the party is too hard, not out of reach. That keeps pillar 1 (every region open, difficulty
geographic, never a quest flag), and takes the atlas's order as the order the quest leads in, not an
order the map enforces.

What changes:

- The pass to Thornmark stopped being a flag gate (it waited on `q_ashcombe_done` and
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
| The Foreland | 1–5 | 100 | 100 | 100 | 100 | 100 |
| The Seam (Brandy Hole's second level) | 3–5 | 66 | 95 | 100 | 100 | 100 |
| Thornmark | 5–10 | 16 | 62 | 92 | 100 | 100 |
| The Grove Roots | 6–9 | 15 | 49 | 79 | 100 | 100 |
| The Cut Stone | 8–10 | 2 | 10 | 37 | 95 | 100 |
| The Warden of the Cut and its two elders | 8–10 | 0 | 0 | 0 | 62 | 97 |

From level 6 up every fight on every map was won. Walked in a row with no rest, Thornmark's road
from the pass to the Grove left 13% of level 3 companies standing after the third fight, and 78% of
level 4 companies after the fourth.

So a company won nine fights in ten two to four levels under the band on the sign (Thornmark at
level 3, the Grove Roots and the Cut Stone at 4), the gap widened down the road, and past the floor
every fight was won: the difficulty plain the anti-pillars warn of. The flag on the pass was what
held the road. The bot is weaker than a player (it never sleeps, blesses or drinks, and
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
  in. The second one spent is the core's door at the Stair's foot, which opens for the company that
  has set the five Stones right on the road (`q_tide_home`, `q_grove_done`, `q_anvil_closed`,
  `q_peak_stood` and `q_ember_lit`; the Grove's mending is the Hearth's, not the door's); Hearth
  Isle itself is reached like anywhere else.
- **In the world.** Each lock is a thing in plain sight with its reason on it: a sealed door, a
  drowned stair, a captain who will not sail into the storm. Never an invisible wall, never "not
  yet".
- **Never between areas** (§2.2).
- **No false "not yet".** The three hand-ins (Vask's wand, Hale's ledger, Sylvane's chisel) once took
  their item only from a company already hired: one that arrived early carrying it was first sent to
  go and find it, and had to talk again to hand it over. A hand-in takes its item at the first
  meeting, and its words know the company came early.

The road had one lock, the flag on the pass, and it went (§2.2); Acts I and II spend none inside
any place. Act III spends one, the Sleepers' Bay's door under Coldmere, which opens to Wenna's hand
and nothing else (#434, call 4; #440); the Deep Mines' door marked CREW ONLY is not one, since
nothing in the act opens it. Act IV spends none: the Ember Stone is finished by a hand-in of three
parts, which shuts nothing before it (#443, call 2; #450). Act V spends one, the core's door
(docs/areas/hearth_isle.md, #739, call 1): the road's second of four.

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
  tier, training to the top of the band), each business with an interior of its own. Hearth Isle has
  no town: its pilgrims' camp rests, cures, raises and trains to the cap, and its band's gear is
  found, never sold (#739, call 4).
- Its chapter of the one quest (§5.8) is walked end to end in a test, and its side quests are in the
  log, with every key real.
- Its gate holds (§5.2): a company at each map's floor gets through, and one well under it turns
  back.
- The story lock it spends, if it spends one, is declared with its reason (§2.3).
- For a reach area: it has no chapter, its gate is set at the cap (§5.2), and every riddle in its
  super dungeons has its hint chain (§5.4).
- Its monsters are drawn, each def a drawing of its own, each through the silhouette checks, each
  placed.
- Its xp and gold sit on the curve (§5.2).
- Its climate, terrain and palette exist.
- It says what is new in it (§5.4), and that checks out.
- Its doc says what is there and where the secrets and their hints are: `docs/areas/<area>.md`, its
  current state, with a row to each map and its secret and hint, and beside it in its folder,
  `docs/areas/<area>/`, its decisions and its plan, what was cut among it (§8.2).
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
  has no `respawn` (DESIGN.md §6). Only the last is checked today.
- **Encounter shape.** Respawns in the range in use, 720 to 2880 minutes. At most 12 monsters to a
  group is held already: a map with more does not load.
- **One rule for the seams** (#898). Every two built boxes that share an edge agree along it square
  for square on passable ground, water and road, and open a way between two areas only where the
  atlas joins them; a seam that disagrees on purpose is a row of its area's `seamsAsBuilt`
  (`tools/tests/outdoors.ts`) with its reason, and a box built since adds none. Every edge of a built
  box that faces no built box is open to a walker exactly where a row of its area's `openOnNothing`
  says, with the box it faces and why that is unbuilt; the box built there meets the seam rule, and
  its pull request deletes the row. That is the bounds' border check (#828) in embryo. A row of
  either stands in its area's `checks.ts` (§8.2).

Decided by the builder for #898, each the owner's to overturn:

1. **Passable ground is a walker's:** open to a company with no skill. Water is the water and the deep,
   never the void, which stays the void for every rule; road is the road's terrain. Each seam is read
   on the laid outdoors, its corners with it.
2. **A way between two areas** is a square a walker, a climber, a swimmer, a floater or a company that
   does all three crosses, and the atlas joins two areas where a road does, by a map's exits or its
   links (`zoneEdges`), as a whole and not seam by seam: 285 squares on seams between two areas that
   no road crosses are walked open by design, so a wall opened on both sides of a seam between joined
   areas, or of one inside an area, passes. The door marked `crosses` is a dungeon's door and no
   seam. One crossing the atlas does not draw is held as built: the shallows where the Deepthorn's
   I5 meets Hearth Isle's I6, which on I5's side are a pocket of seven squares shut by rock and deep
   water, so no company reaches the isle by them. The way is read on the two squares either side of
   a seam, so it never misses a crossing, and holds one into a closed pocket too.
3. **A row is exact:** it lists, kind by kind, the squares that fail, so a square that comes to agree is
   refused with it. On 18 October: 153 seams, 62 rows, 329 squares.
4. **The edges against unbuilt land are held exactly,** as the seams are: a row of `openOnNothing`
   for each edge with a square open to a walker, so a square opened or shut on such an edge fails; its
   reason names the box it faces and the issue that builds it, or the reach, a crumb or the sea. On 18
   October: 102 edges, 3,264 squares, 899 open in 50 rows, five of them onto the sea or the world's end,
   where #828 plans no box. The void past them refuses every company, and their water and roads are the
   pillars' edge check's.
5. **The count of seams may not fall below 153,** those built on 18 October, as a box once built never
   goes.

### 5.2 The curve, and the gate

The pinned "level 2, level 4, level 7" checks give way to one curve in `content/progression.ts`:
for each area, its band, and the xp and gold a clear should give. Since the monsters are the only
gate on the road (§2.2), the curve says how hard each area is as well as what it pays. Checked for
each area:

- three quarters of an area's xp reaches the next area's band floor, the cap for the road's last
  area: its budget is what the climb from its floor to the next floor costs, divided by 0.75;
- a clear's gold pays for training the party through the band;
- every monster's level (a new field on `MonsterDef`) sits in its map's band, give or take two,
  rising from the floor near the area's way in to the band's top at the far end;
- chest and drop items sit in the band's price window, so a band 1–4 cellar holds no plate; an
  artifact, which no window holds, is excepted by its mark alone (#847, below).

A map whose floor is over its area's band is a later area's country reached from it, as the
Dead-Drop's stair under the Tide Ship is, and pays nothing there. The deepest levels, which the road
never needs, may pay outside any area's budget instead: the area lists them in `outside`
(`content/area.ts`), and only maps past its band may be listed. Each is held to its own band and to
the window of the last area on the road whose floor is at or under its own; no area's clear counts
its xp or gold, which the curve prints as a figure; and the gate judges it at its own floor, out of
the area's pools. Meridian Camp's third level and the Dead-Drop's three are planned so.

An enclave is a place of its own beside the road (#845): a dungeon entered from a box (a hollow, a
cave, a ruin), declared on its map (`enclave` in `game/map.ts`) and held to its own band, over its
box's: a band or two for an enclave, the cap's, 30–32, for an artifact lair (the owner, 17 October
2026). The checks hold it as they hold a map outside the budget, wherever its band stands. The curve
leaves its pay and its finds out of its area: no clear counts its xp or gold, which the curve prints
as a figure; its monsters sit in its own band, rising from its door; and its chests and drops sit in
the window of the last area on the road whose floor is at or under its own, the Hearth's for a lair.
The gate judges it at its own floor and two under it by the day from 10, its guardian's odds at its
floor and two above (its group marked `boss: true` in its map) and leaves it out of its area's pools
and day; no zone's road walks it, for a road walks its zone's own maps. No step of the quest lies in
it (§5.8). Its door says its band and how it feels to the company, as a border does (DESIGN.md §9),
and the pilot keeps out of one whose floor is over its company. A fixture lair at 30–32 beside
Saltreach, a band-10 area, holds these rules beside the areas' own lairs (`tools/tests/enclave.ts`):
on the Stair's ground and groups, it is won 95.2% at 30, its guardian 57% at 30 and 80% at 32; it
fights 10.71 to a rest at 30 and 8.49 at 28, 74% of the floor's day; Saltreach's clear, band, pools
and day are as they were without it; and it holds no step.

Decided by the builder for #845, each the owner's to overturn:

1. **The declaration is a mark on the map, `enclave: true`, and its band is the map's own `band`**:
   the sign already shows a map's band, so one band serves the sign, the door and the checks.
2. **An enclave stands over its box**, the outdoor map its door opens onto: its floor over the box's
   top. One with no band, at its box's band, listed `outside` as well, laid as a zone map or opening
   onto no box fails the curve (`enclaveFaults`); leaving the area's figures is only fair for a place
   past its box.
3. **Its window is the last road area's whose floor is at or under its own**, as a map outside the
   budget has it: the Hearth's 7,000 for a lair at the cap. No window holds an artifact, so #847
   must exempt one from the curve's window by its mark.
4. **Two under is asked of it alone, by the day from 10**, as of a map outside the budget, and its
   guardian is a boss, its group marked `boss: true` in its map, as a dungeon's boss is; the
   fixture's figures off their aim are said with it and kept out of the gate's list, which is the
   content's.
5. **The door's line is the game's**, one entry after the way's own: "<name>: levels 30-32.", then
   harder one or two under its floor and the warning three or more under, in an enclave's words, not a
   zone's. None from a level of an enclave whose floor is at or over its own, for a border speaks
   where the floor rises. Held to the log's three lines at its longest (pillars). An area's own words
   can come when one asks for them.
6. **The pilot learns an enclave's band at its door**, once a way in is seen (`Known.enclave`), and
   keeps out under its floor with no grace, where a zone allows a level: the navigator has no way in,
   the strategist chooses no walk there and a goal inside sends it levelling to the floor. Only the
   way in is shut: the way up from a deeper level stays open, so a pilot handed the helm inside is
   never stranded.
7. **The secret's pace and the novelty check are left as they are**: each places a map by its floor
   (`roadPlace`), so a lair at the cap stands with the Hearth in both.
8. **The fixture is the Stair's ground and groups at 30–32 off C3**, a chest with the Grey Axe in it
   (6,800, over Saltreach's 2,000): its figures are the gate's already, so it needs no new monster.

A kill pays each member by the monster's level against theirs: ×0.1 at three or more under, ×0.4
at two under, ×0.7 at one under, ×1 at their level, ×1.15 at one over, ×1.3 at two over, and ×1.5
at three or more over. Simulated from Saltreach on, that kept companies that clear anything from
65% of each area to all of it within about a level of the road, where fixed xp left a full clear
nearly four levels over by the Glasswold. Each town's trainers teach to its band's top plus one, and
never past the cap (Hearth Isle's camp teaches to 32, #739, call 4). Gold and loot stay fixed, so a
full clear still pays, in gear, gold and secrets.

So an area may give more than its ask (#634): paid by level, a lead does not build up, for the next
area takes it back. What the curve holds is the lead itself: a company of six entering an area at
its floor and clearing three quarters of it, paid by level, leaves it no more than a level over the
next floor. Two built areas pass that line and each holds its lead in its `checks.ts` (`overRoad`,
`tools/tests/curve.ts`), at the level it leaves as built so that neither grows unnoticed: the Kilns
at 19.5, their bosses paying the line's, and Ashfall at 27.4, for the Stone, the rungs, the quests,
the sentries and the country behind the road. Decided by the owner's delegate, 16 October 2026
(#738): accepted as built, the Wold taking the lead back and leaving a company at 27.9, a tenth
under the Hearth's floor. Walked in road order, Act III ends 0.8 over the road at three quarters
cleared and 1.4 at a full clear; Act IV ends 0.6 and 1.3 over, Act II's own areas 0.5 to 0.8 and 1.2
to 1.6.

Its first rows are the slice's own figures from SLICE.md: level 2 from the Foreland and the cellar,
level 4 with Brandy Hole, level 9 from one clear of everything, about two fifths of one more sweep
of the Grove to 10 (a sweep pays 34% less once the Warden of the Cut is dead) and about 8,400 gold
for six members from 5 to 10. Act I falls short of the budget: three quarters of it should reach 10,
where a clear of everything reaches 9. The maps have grown since: summed at ×1, one clear of Act I is
worth 19,957 xp a member, level 12; paid by level in road order (#159), 15,292, level 10 and three
quarters of the way to 11, and a sweep of the Grove at 10 pays about 1,000, so seven tenths of one
more reaches Thornhold's 11. Act II's three rows came before their maps, each owed to the issue that
builds its area (#159), and Act III's three the same way (#535): the Kilns 16–18, Cairnmoor 18–20
and Rimewater 20–22, their windows rising 500 a band to 3,500, 4,000 and 4,500. Act IV's three are
in the same way (#542): the Whitespine 22–24, Ashfall 24–26 and the Glasswold 26–28, their windows
to 5,000, 5,500 and 6,000.

The gear ladder (`GEAR`, `tools/kit/company.ts`, made from each area's rungs in its `checks.ts`) is
what a company has in hand by a level, and the harness and the gate dress their companies by it. Act
I's: Mottram's by 3, the Downs' finds by 5, Thornmark's Armoury by 8, its chests' plus by 9 and the
Deepthorn's +2s by 10. Act II's (#399): Saltmouth's armourer by 11, Saltreach's and Wrackholm's
boxes' plus by 13, Lantern Watch's stores by 14 and the Sunder's plus by 16. Act III's (#535):
Anvilhall's forge by 17, the Kilns' and Cairnmoor's boxes' plus by 19, Rime Lodge's furrier by 21
and Rimewater's plus by 22. Act IV's, one step (#542): Cinderport's armourer by 25. Act V's, the
last (#746): the Hand's steel by 28, found on Hearth Isle and never sold. Each rung betters the last
for every class, each find and ware inside its area's window; past the top, gear grows only in the
harness's what-ifs, the bounds' artifacts among them (`--artifacts`, #847).

Nor does the gate's company learn a secondary skill (DESIGN.md §5): Arms Master's first round and
the two senses go unmeasured, so a company that buys one is stronger than the gate measured it, the
safe side. Decided by the owner's delegate for #18 (#856), the owner's to overturn. It is born to
three that touch no fight: its elf and gnome to Perception, its ranger to Pathfinder and its thief
to Lockpick (#857).

Decided by the builder for #847, each the owner's to overturn:

An artifact is an item marked so (`ItemDef.artifact`, DESIGN §9): one in the world, found in its lair
and never sold. No shop stocks one or takes one, and no rung of the ladder or price window holds
one, by the mark alone and never by its price: the curve's window, which held every find, holds
every find but an artifact (`windowed`, `tools/tests/curve.ts`), and new checks hold that each is
in no shop, on no rung and in no window, and that unmarked the window would catch it.

1. **A mark, `artifact: true`, beside the power's own field:** the stat and the element are read as
   on any item, so an artifact's power is a found item's by the same code, and its twin unmarked does
   the same.
2. **Its price is `ARTIFACT_PRICE`, 7,500, past every window** (the Hearth's 7,000 the widest): nobody
   pays it, and a window that dropped the mark would catch it, so the mark is what exempts.
3. **The shop's words** are "Keep it. There is no price on a thing like that." (`REFUSED`); the sell
   list shows an artifact without a price, and the company keeps it.
4. **The sheet says each artifact's power,** one with a slot on its slot's line ("ARMOUR The
   Erzhemd, SPEED +5"), one carried on a line of its own ("ARTIFACT The Hagstone, NEVER PARALYSED"),
   and hit points and armour share a line, so the fullest member of every class (the stone carried,
   a resistance, twelve skills and every spell) ends above the panel's foot (`SHEET_FOOT`). A line to
   every artifact, as the first half had it, ran the column off the panel.
5. **`--artifacts`** takes ids or `all` and gives each, one in the world, to the first member in the
   company's order who may bear it: a weapon of the reach they hold, or of the other where none who
   may bear it holds that reach (Holdfast to the premade's thief, for her sling: she strikes nothing
   from the back row with it, and casts its charges, decision 10); a two-hander puts a plain shield
   in the pack, never an artifact's. So `all` dresses the premade six with the eight. The gate's
   company stays plain (#891).
6. **The eight not placed are owed** in `UNPLACED` (`tools/tests/items.ts`) to #830 to #837, each
   until it lies anywhere; placed, it must lie once in the world, in a chest, cairn or statue on an
   enclave of its own area at the cap. The table only shrinks.
7. **The castings spent are the company's, by the artifact** (`Party.spent`, an optional field, so
   no save version moves): passed to another member, an artifact keeps what it has spent. They come
   back at the dawn the calendar gives that day (`dawnOf`), the one a night's sleep wakes to.
8. **An artifact's spell is cast in a fight only:** both of the eight's are fight spells, so the
   spell screen offers none and the check holds an artifact's spell to a fight's; the way to cast one
   out of a fight comes with the first that needs it. The fight's menu lists it after the member's
   own spells, with the castings left ("Meteor Swarm (2 LEFT)").
9. **Regeneration and a ward keep nothing in a save:** every passage of time goes through the
   world's clock (`World.advance`), which mends the bearer (`passClock`), and a ward is read from what
   is borne, as a trait's immunity is (`immuneTo`).
10. **The harness's bot casts an artifact's spell** where it pays, weighed as its own spells are and
    at no cost in points, an artifact's hold whatever `--bot` asks and at a group of one too, so a
    lair's guardian is tuned with the artifact's power and not its steel alone. In 20 seeded fights at
    30 the company with Holdfast, or with all eight, wins as many as the plain one and loses fewer hit
    points (`tools/tests/harness.ts`). The game's auto-fight leaves an artifact's spell to the player.
11. **A piece's words are read as it is taken up:** Space on a weapon or armour with words equips it
    and shows them, so DESIGN §9's "read from the pack" holds for every slotted piece, the Old
    Lantern's Staff among them.

The gate, checked with the bot of `tools/kit/fight.ts` (`gateTurn`). Each figure
below is its **aim**, and each has a **limit** beyond it (#273): inside its aim a
figure passes; between its aim and its limit it passes, and the check lists it as off
its aim (under `--list`, #895); past its limit it fails, and only then is it owed.
The limits, weighed by the pilot on every box of the Downs and left as they were
until the owner's own play says otherwise (#47, docs/areas/shelf.md §8): 80% won at the floor, 90%
two under, the road walked 65% of the time, a boss 20% to 80% at its floor and 75% two above or at
the cap, 4 to 10 fights to a rest and the warning's nearest groups ten points under the median.

- **At the floor, through.** A company at each map's own floor wins nine in ten of that map's
  fights, and of the area's, each fought at its map's floor; each zone's road is walked at the
  zone's floor, resting where the road lets it (an inn, a camp), eight times in ten.
- **Well under, back.** Two levels under the floor, it wins no more than one fight in four: over
  each map whose floor is the area's, and over the area, where a zone map's groups count two under
  its own floor and a town's or dungeon's two under the area's (the owner, on #40 and #209). That is
  Act I's figure: from Saltreach's floor, 10, two under is judged by the day (below, #851).
- **The boss asks.** The area's boss is won about half the time at the floor, and nearly always two
  levels above it, or at the cap where that is as high as it goes. Two exceptions came with the
  Heart (#759, kept by #752): a boss whose floor is the cap is judged at its floor alone, since no
  company stands above it; and a map of nothing but its boss is judged on the boss's odds, with no
  floor of fights to pool and no day. Where the rise from the floor to two above is too short for
  both odds, the floor binds and the second stands inside its limit, short of its aim: the Stair's
  Catcher, 57% at 30 and 80% at 32 on the gate's seeds, against an aim of 90% and a limit of 75%
  (#752, #796; docs/areas/hearth_isle.md §8).
  A boss set off the line is sized on these odds against the gate's bot, by its box's gate
  (`offLine` on its def in its area's `monsters.ts`, which `tools/tests/harness.ts` reads).
- **Six or seven fights to a rest.** A company can fight six or seven standard encounters at its own
  level between rests to level 10, and a fight more every four levels after as its power grows
  (twelve at 32, never fifteen). Its spell points count as much as its hit points: it rests once it
  has lost someone, once anyone is still under a quarter of their hit points after mending, or once
  it is under a quarter of its spell points. The harness runs no fight past fifteen rounds
  (`ROUND_CAP`); the game has no round limit (DESIGN.md §6). The share of days that end in a fight
  broken off is printed and not judged.
  Decided by the owner's delegate, 16 October 2026 (#734), the owner's to overturn: it is how a
  thrifty bot's long day ends, not how a box's fights play, and a player rests or casts; the
  fights to a rest are the judged figure. An aim for it could be met only by lightening boxes
  inside every other aim or by remaking the line (docs/MONSTERS.md §4.4). A boss is judged on its
  odds, not in the day (the owner, on #40).
  `tools/harness.ts` measures any encounter or map against it, with a test monster for every role
  and level to build from (docs/MONSTERS.md §4.4).
- **A warning, not a wall.** The first groups past a border are the zone's gentlest, and the
  crossing line tells a company under the band how the land feels to it, so the party learns it is
  early from a fight it can survive or run from, not from a wipe.
- **The reach asks the most.** In a reach area, a company at the cap that has walked the road wins
  about half its first fights; what it finds there is what makes the rest winnable.
- **The gate's company takes what a level brings and buys nothing optional.** It wears the gear the
  curve says a company has at each level and takes the prestiges it brings (#541), so the check keeps
  up; it takes no tier, Master, skill, charm or item, and its bot plays plainer than a player: it never
  blesses, sleeps, drinks or flees, since a flight only turns a win into a loss and the gate measures
  whether a fight is winnable. The game's own bot, the auto-fight and the pilot's fights with it,
  blesses, sleeps and drinks from level 11 (`PLAYED`, `FIRST_PAST_ACT_I`) and flees a fight lost (#723,
  `beaten`); under 11 it plays as it did, so Act I plays as it was made. The three stand behind an
  option each (`BotOpts`, #853), off in the gate and the harness unless a what-if sets them (`--bot`,
  read from 11 as the game's). The bot blesses in a fight's first round against three foes or more,
  sleeps the group with the most it could put down, never one that holds a foe the sleep cannot take,
  lets the sleepers lie while another of the company can strike and gives a draught to the lowest no
  one can mend, or to one asleep or held no one can free (#865). The thrifty bot
  weighs Bless and sleep as it weighs a damage spell, the hit points the cast saves against what its
  points are worth, its blow lost: Bless saves what the company's blows land more in its rounds, sleep
  the blows the foes it puts down would strike, at the spell's chance, while they sleep or are held;
  neither for longer than the fight has left by the company's weapons. It drinks only where no spell
  pays. A company drinks what it carries: the gate's carries the new game's two Healing Draughts.
- **J2: weighed and not made (#865).** A line made again with Expert from 13, Master from 25 and the
  three ended 13 to 47% of its days badly at 16 to 24, nearly all in a death, against an aim of a tenth:
  the calibration keeps the day by raising damage (for seven of the nine roles 1.4 to 1.6 times the
  line became 2.0 to 2.9) and nothing in the tiers raises defence. Made four ways at 19, the old
  company holds 7 of 9 roles at a tenth or under; the tiers alone, the three alone and both go over
  it (MONSTERS §4.4).

Decided by the owner's delegate for #18, each the owner's to overturn:

1. **The bot's three behind `BotOpts { bless, sleep, drink }`** (#853), an option of `botTurn` and of
   `thrifty` as the reading (`sees`) is, off in every default: nothing in play or in a check moves
   before #865. `ANSWER` stays, frozen since #946: a tool passes another answer to the call.
2. **The turn is mend, wake, burn, bless, sleep, blast, drink, strike, brace.**
3. **Bless** in the first round, by a member that knows it and keeps its share of the rest line after
   it, while three foes or more stand; not again while one runs.
4. **Sleep:** a sorcerer's Slumber or a druid's Grasping Roots, at the group with the most foes
   standing, awake and not proof against it, where that is two or more.
5. **Drink:** a healing draught from the member's pack or the bag for the lowest under its mend line
   that no mender can mend; a cure draught for the one the bots free first that no one can free. The
   company's bag stays as it is: a player's potions are not what every company has.
6. **The gate's bot never flees:** a flight only turns a win into a loss, and the gate measures
   whether a fight is winnable. The game's flees a fight lost (#723).

Decided by the builder for #853, each the owner's to overturn:

1. **"No mender can" is read as no member who can act** (not down, asleep or held) knowing a mend it
   can afford, and so for a cure: a cleric asleep mends no one this turn.
2. **The weighing kept simple:** a foe Slumber takes sleeps four rounds, since the bots let it lie and
   it wakes at a quarter of its turns (`SLEEPS_FOR`); one the roots take is held about three (it tears
   free at 35% of round ends, `HOLD_BREAKS`). Bless and sleep are weighed before the damage spells, so
   a tie goes to them.
3. **The game's reading knows a foe Slumber cannot take once a Slumber has put none of its kind to
   sleep** (the log's "0 of the ... fall asleep", which now counts the kind it names, the target's, so
   that a mixed group shows it). The roots' failure names no kind, so it never knows one the roots
   cannot hold; none is so as built. The gate's reads both as written.
4. **Awake is held by nothing:** a foe asleep or rooted is not counted, so none is slept twice.
5. **The draught given is the least that lifts the lowest to its line, else the most,** the
   member's own before the bag's.
6. **Sleep stays with the classes named:** a ranger that knows Grasping Roots (the premade Wren from
   17) keeps to its bow and its few points.
7. **With sleep on, the sleepers are let lie:** a blade falls on an awake foe it reaches where there
   is one, a spell on an awake foe where one stands and no spell over many is cast where it would wake
   a sleeper. Without it a swarm woke three ogres asleep and Slumber was cast again, and the thrifty
   bot's day at 4 fell a tenth; with it, its day against the standard soldier and skirmisher rises at
   4, 12 and 20 (6.25 to 6.55, 6.72 to 7.05, 8.68 to 10.95 for the soldier, 40 seeds).
8. **Bless goes to the knower whose turn is worth least:** one that can strike from its row leaves it
   to one yet to act this round that cannot, so Idris strikes and Maren blesses.

The checks' company keeps up with the party behind what-ifs (#854), off in every default: #865
weighed the tiers and the bots' three and kept them off (J2, above). Under `Rules.tiers`
(`--tiers`) `companyAt` takes its tiers after its
prestiges: Expert at 13 and Master at 25 on each line its class takes, a fighter's arms, a caster's
magic and a hybrid's both. `Rules.bot` (`--bot bless,sleep,drink`) hands the bots their options,
the thrifty one's in the harness's fights and the gate's in its own. Beside the premade six stands
a company of the four newer classes, `newerCompany`: a barbarian, a monk and a paladin in front, a
bard, a druid and a sorcerer behind, trained, dressed, prestiged and tiered as the six are. The
harness suite holds it to the line at 12, 20, 28 and 32 against each role's standard encounter, on
100 seeds: its fights to a rest inside `GATE.perRest`'s limit and its fights from fresh won at the
floor's limit, 80%; `--company newer` plays it by hand. The gate judges one company, the premade
six: a second would double its fights in the slowest of CI's jobs. On 17 October 2026 the newer
company stands inside every limit and wins every fight from fresh, off its aim on five lines: the
archer at 12 (9.5 to a rest, 7 asked), the controller at 28 (12.1 of 11) and the controller, the
armoured and the elite at 32 (13.6, 13.2 and 13.4 of 12). Since #946 the what-ifs are a value,
`Rules`, passed to each call that reads one, down to the fight, the bots' answers among them
(`Rules.answer`); `RULES`, play's, is frozen and sets none, so no suite leaves one set for the next.

Decided by the owner's delegate for #18, each the owner's to overturn:

1. **The company's tiers behind `Rules.tiers`** (`--tiers`): `companyAt` dresses them after
   `prestige(p)`, Expert from 13 and Master from 25 by class line; the cache key counts them.
2. **The bots' option plumbed:** `--bot bless,sleep,drink` sets `Rules.bot`, handed to `botTurn`
   and `thrifty`. Both off until #865, which kept them off (J2).
3. **A second company, `newerCompany(level, seed)`,** held by the harness suite at 12, 20, 28 and
   32: fights to a rest inside −2.5/+3.5 of `fightsPerRest`, fights at the floor won 80% or more,
   100 seeds; `--company newer` plays it by hand.
4. **The gate keeps one judged company,** the premade six. A class that fails the line is reported
   to the owner, not fixed here.
5. **With every option off `companyAt` returns what it returns on main.**

Decided by the builder for #854, each the owner's to overturn:

1. **The monk takes a staff for its prestige blows, as the thief a light blade** (`BLOWS_WANT` in
   `prestige`): its blows past one come only with a staff or bare hands (`blowsOf`), and the
   ladder's best blade by its blow is not a staff. Without it the newer company fought 5.4 soldiers
   and 5.5 armoured to a rest at 20 of 9, four days in five ended by a fight broken off, and the
   monk in the ranger's place cost the premade six as much. The six hold no monk, so their company
   is as it was.
2. **The four stand in for four of the premade**, each with that member's raises on its own
   class's stats and of a people that suits it: Rook a dwarf barbarian for Bram, Hollis a tidefolk
   monk for Wren, Aveline a gnome bard for Ottilie, Sable a human druid for Maren. Idris and Cassian
   are the premade's own; the names are the creation screen's.
3. **The boss is left out of the newer company's line:** a boss is judged by its odds from two
   under, not by a day or the floor's fights.
4. **`--company` is a what-if too** (`Rules.company`), so `--calibrate --write` refuses under it as
   under the rest; the refusal names what is set (`whatIfs`).
5. **The gate's bot takes `Rules.bot` in tools/gate.ts's own `gateTurn`,** which every gate fight
   plays, so #865's default in the harness reaches the gate (off, J2).
6. **The line runs on every core** (`cellsOnCores`, the report's own pool): its 36 cells cost
   about 37 seconds of CPU, about ten of a four-core runner's.
7. **The what-ifs show what they make:** under `--tiers` or `--company` the report gives the
   company at each level it fights from, with its titles and tiers; under `--bot`, the share of
   fights from fresh in which the bots blessed, slept a group and drank.

Decided by the owner's delegate for #18, each the owner's to overturn:

1. **The gate's company models neither the tiers nor the bots' three** (J2, #865; the first call of
   17 October withdrawn). The road needs no tier or skill, so the gate's company takes what a level
   brings on the road and buys nothing optional: the tiers, the Masters, the three, the skills, the
   charms and the items are alike unmeasured and stronger than measured. The limits (#273) and the
   softening cap (#541, decision 3) are the owner's and are not moved.
2. **No calibration is written:** `tools/testmonster.ts` and the 91 monsters past 10 stay as they
   were; the weighing and the calibration's measurement stand as evidence in #865's pull request.
3. **The defaults stay off:** `Rules.tiers` and `Rules.bot` are off in the gate and the harness;
   `--tiers`, `--bot`, `--company newer` and `--under 2` stay what-ifs, and `--calibrate --write`
   refuses under any.
4. **The game's auto-fight bot blesses, sleeps and drinks from level 11 with its guards** and flees as
   #723 built it; the gate's never does any of the four; Act I's figures are main's.
5. **`cairnfield_m8` is re-sized inside its floor's own aims,** a role up and a group thinner, never
   more monsters; two passes, else owed by name to an issue under #54.
6. **`--company newer` stays a check at 12, 20, 28 and 32** on the old company's dressing; a class
   past the limit is reported to the owner, not fixed.

Decided by the owner's delegate for #891, each the owner's to overturn:

1. **J2 stands: the gate's company models neither the tiers nor the bots' three,** and no Master,
   skill, charm or found item. The road needs no tier or skill, and a line made on a stronger
   company raises the monsters' blows where nothing bought raises defence (J2, above): optional
   power is the player's edge, not the road's floor. No lever moves (not the softening cap, `WORST`,
   the limits, a defence-side rule or a second judged company); the 91 monsters past 10, 22 of them
   set off the line (each by its `offLine`, in its area's `monsters.ts`), stand, and the eight
   bounds areas (#830 to #837) meet the gate as it is.
2. **What the optional power buys is written here** (#865, two under, 100 seeds). With Expert,
   Master and the three the company fights 4.6 to 8.4 of a role's standard encounter to a rest at 20
   where it fought 3.0 to 6.7 (9.0 asked at the floor), 9.9 to 13.6 at 25 where 5.9 to 8.8 (10.3
   asked) and 4.0 to 10.0 at 28 where 2.3 to 7.0 (11.0 asked), and wins the boss 58% at 20 where 42%,
   60% at 25 where 55% and 75% at 28 where 53%; its fights run longer, the sleepers let lie (at 20
   from 3.4 to 10.7 rounds to 3.8 to 13.5). `node tools/harness.ts --under 2 --levels 13,20,25,28
   --seeds 100 --tiers --bot bless,sleep,drink` prints it, in under a minute.
3. **The harness's what-ifs are the standing evidence:** `--tiers`, `--bot bless,sleep,drink`,
   `--company newer`, `--under 2` and `--calibrate` under any (it says what share of days end badly
   and writes nothing), with the tables in MONSTERS §4.4 and the raw outputs on #883. No new check:
   one over optional power would be a figure on a company the gate does not judge.
4. **The barbarian for the knight and the bard for the thief at 20 are left,** reported and not
   fixed (6 above). Against the soldier and the armoured (100 seeds; 9.0 asked, the limit 6.5 to
   12.5) the premade six fight 8.7 and 9.1 to a rest, 6.3 and 6.4 with the barbarian and 12.3 and
   13.3 with the bard; the newer six on the staff 8.8 and 9.4, inside every limit at 12, 20, 28 and
   32. Each is the class as designed (the barbarian wears no plate, the bard's song lifts the
   company), in a mixed company the gate does not judge; a class tune for a harness figure would
   move play for everyone who fields it.

Decided by the builder for #865, each the owner's to overturn:

1. **"Another can strike" is a blow from its row at a foe in its reach,** asleep or awake (`striker`):
   a blow wakes only the foe it strikes. Without it a caster alone slept its foes and stood idle.
2. **The guard is in both bots,** the game's and the thrifty one, by one helper.
3. **The three begin at level 11, the first past Act I** (`FIRST_PAST_ACT_I`, `optsFor`): a member
   under it plays as the bots did, so Act I plays as it was made; `--bot` is read so too, as weighed.
4. **No sleep on a group that holds a foe the sleep cannot take** (as the bot knows it): its sleepers
   would bar every spell at the group while the one awake was struck alone. With the three on at
   every level, Deepthorn's j5_eldest, an elder among two heartwoods, was won 3% at 8 in the gate;
   the level-11 threshold now puts it out of the rule's reach.
5. **The bots' tests stand at a company of 12,** past the threshold; at 4 and 10 the three are main's.
6. **`cairnfield_m8`'s crag group is two ravens and two tor trolls** where eight ravens stood: one troll
   left two under past its limit (102.7 to 113.5%), two put it inside its aim; the ravens first, since
   with the trolls first the floor's day fell to 7.48, under its aim. The night troll stands. A
   quarter of the floor's days (23.3%) now end in a fight broken off, the two trolls mending.
7. **The whole company lets the sleepers lie once one member is past Act I** (`letsLie`): a member's
   spell over many wakes another's sleepers (with the six at 8 and Cassian at 12, Wren's Hailstorm
   woke the ogres he had slept). Who blesses, sleeps and drinks stays each member's own, and a
   company with no member at 11 plays as on main.

Decided by the owner's delegate for #892, each the owner's to overturn:

1. **The bots' three begin at 11, and a company with a member at 11 or over lets its sleepers lie
   as a whole: stands** (the builder's 3 and 7). Act I plays as the owner's own play tuned it: with
   the three at every level four of its figures went past their limits, and its monsters are not
   re-sized for a bot.
2. **`cairnfield_m8`'s crag group, two ravens and two tor trolls, stands** (the builder's 6): of the
   fourteen mixes and orders #865 tried it is the only one inside both aims, 7.60 to a rest at the
   floor (7.5 to 9.5 asked) and 64.9% two under (66.7% the aim). The 23.3% of the floor's days ended
   by a fight broken off at fifteen rounds is the harness's figure, printed and not judged (#734):
   the game has no round cap, the company wins every fight there and the trolls mend. Eight ravens
   again would be 109.3% two under, past its limit, with a row owed and no better mix to size to.

Decided by the builder for #946, each the owner's to overturn:

1. **The bots' answer rides in the rules** (`Rules.answer`) through the harness's calls and the
   gate's, so each chain carries one value; the bot's own calls (`botTurn`, `markOf`, `breathGuard`,
   `mendLines`, `wakeWith`, `gateBlast`, `drinkFor`) take the answer itself, as they take `sees`.
2. **Each exported call takes `rules` last, defaulting to `RULES`;** the harness's own helpers
   (`weaponDamage`, `incoming`, `mendRate`, `spellDamage`, `heldDamage`, `train`, `keyOf`) take it
   with no default, so the typecheck finds one a caller forgets.
3. **One helper lends a def to either table, over one already there** (`withDefs`,
   `tools/tests/lib.ts`), and puts back what it covered, so the rat's and the wolf's looks go
   through it too; `gear` lends its four items with a plus up front, each only where absent, as it
   added them on the way. Main gained two writers since the issue (`curve`'s unmarked artifacts,
   `items`' stone twin): 17 go through it.
4. **`unforge` drops the companies dressed in forged gear from the cache** as well, so a later
   `gearGrows` never meets an id the table no longer holds.
5. **The runner's check fails the suite by name, listing each entry added, removed or replaced** (by
   identity); its fixture is a folder of its own (`tools/tests/runner/leaves/`), so the other
   fixtures' counts stand; the clean suite after it is `next`, since a module exporting `then`
   is awaited as a promise and never settles.
6. **The goals walked are kept by the walkthrough's `ok`,** in a `WeakMap` whose entries go with it;
   the runner hands each walkthrough a fresh wrapper of the shared `ok`.

From 10 two under is judged by the day, not the fight. From 10 the damage spells roll their full
dice and every group is sized for the day (docs/MONSTERS.md §4.4), so a fight from full health
measures nothing there: on main at `dbb9d247` the gate's company won every fight two under every
sampled floor from 10, and nearly every fight eight under from 18, while Thornmark's cliff stood
(100% at 5, 24% at 3). The day still slopes: two under, a company got 43% to 87% of the fights to a
rest it got at the floor, about 62% the median. So a company two under a floor rests after at most
two thirds of the fights the floor's aim gives (the aim), and never gets as many as the aim itself
(the limit): `GATE.backDay` in `tools/tests/gate.ts`. It is judged over each map two under is asked
of alone, at its own floor less two, and over the area, its groups pooled at the area's floor less
two: 100 seeds, dealt, a boss left out as from the floor's day. On 17 October 2026 the gate judges
81 maps' days and 10 areas', at 29% to 109% of their floors' aims (the median 62%). It lists 29 maps
and three areas off their aim, the soft ones: seven each of Ashfall's and the Glasswold's, six of
Cairnmoor's. One map was past its limit, owed to #865: `cairnfield_m8`, whose two groups were fought
9.29 to a rest two under against the floor's 8.5. The 86 two-under figures owed to #18 went (#851).
On 18 October #865 re-sized its crag group, two ravens and two tor trolls where eight ravens stood:
two under it fights 5.52 to a rest (64.9%), and 7.60 at its floor (8.5 asked). No row is owed.

Decided by the owner's delegate for #18, each the owner's to overturn:

1. **Past 10, "well under, back" is the day, not the fight** (read as from 10: the builder's 1).
   The aim was written for Act I's slope; past it the gate lives in attrition, and no tier, item or
   counter could bring a fight two under to nine in ten without the cliff DESIGN.md §1 forbids. The
   limits of #273 are not moved: a figure is named anew, with its reason.
2. **Judged per map and per area, on 100 seeds, dealt.** A share wants fewer seeds than the floor's
   day, judged to a tenth of a fight on 300. A boss is left out of the day, as at the floor.
3. **Act I keeps its figure:** two under, a quarter, limit nine in ten. There two levels are a cliff
   by design, and the figure measures it.
4. **The two-under win rate is not judged past Act I.** The warning keeps reading its rates two under.
5. **The 86 owed rows went,** each because the check it held no longer runs. None is re-recorded.
6. **More than five maps past the limit would make the share wrong for the game as built:** the
   builder stops and reports to the owner, and the share is not widened.

Decided by the builder for #851, each the owner's to overturn:

1. **"Past 10" is read as from Saltreach's floor, 10.** The issue's work keeps the fight where the
   floor is 10 or under, but Saltreach's floor is 10 and its seven rows go by the issue's own fifth
   decision; the measurement counted 10 among the plain (`delta_c5` and `c5_rift` won every fight two
   under). Act I's floors run 1 to 8, so Act I is judged as before (`GATE.dayFrom`).
2. **A map's day is asked where its fights two under were:** a map whose floor is its area's, or one
   outside the area's budget; one with a higher floor counts in the area's day. So the 81 maps judged
   two under past Act I, the 76 owed among them, each have a day.
3. **`cairnfield_m8`'s day is owed to #865 by name** at its figure (109.3%, and 106.3% on 300 seeds), not
   re-sized here: a group re-sized is the area lane's, and #865 re-sizes every group past its limit
   past 10 on the company it makes. One map is not the more than five of the delegate's 6. (#865
   re-sized its crag group, above: nothing is owed.)
4. **The key is `<map or area>: under day`,** a new one, since the figure is not the one the rows held.

### 5.3 Density: the map is the reward

Walking steps from an open square to the nearest point of interest:

| | 90% within | None past |
|---|---|---|
| Outdoors, core | 8 | 15 |
| Outdoors, country (§2.1 (b); a first guess, tuned in the pilot) | 12 | 20 |
| Town | 7 | 10 |
| Dungeon | 7 | 10 |

Steps are four-way, walked from every point of interest at once over the squares a party can stand
on, and a point's own square is 0. Every point counts, but no more than one in four on a map may be
a sign, so a row of bare signs does not pass (#32). Country meets its looser floor with wilderness
features in the Might and Magic manner, each a feature kind rather than new art: a shrine or a
fountain that gives a stat or a resistance once, a cairn with a cache, a statue with a riddle whose
hint lies elsewhere, a camp where the party can rest safely, a hermit with a rumour. Each is cheap
to place and worth the walk.

### 5.4 The pillars, where they can be checked

- **Hints.** If every secret door is to have a hint (today all five give one, the Foreland's two
  since #51), each names its hint (`hint: '<event id>'`, an event or a sign, and an inscription's
  reading counts, #538), and the check proves the hint can be reached from the start without
  passing through that door. A check by distance alone would count Brandy Hole's stash, which lies
  behind its door.
- **Text.** No event or sign wraps past three lines of the log, measured with the log's own `wrap`
  (four fill it; two is the aim). Every glyph is in the font, for all text and not only the quest
  log's. British spelling, as the game has it (colour, armour).
- **Novelty.** An area declares what is new in it: monster families (not only variants), terrain,
  mechanics, landmarks. The check proves each exists, is used in the area and appears nowhere
  earlier on the road. A map counts where the pace check places it (MONSTERS §2.2): in its area, or
  where its floor is over that area's band, in the last area whose floor is at or under its own; a
  site stays with its area. Whether it is interesting is the owner's call; the check keeps the claim
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

- The shipped files list every id a save can hold: maps, feature and group ids, flags, items,
  door squares, zone placements. Each area's `content/areas/<area>/shipped.json` holds what it
  owns: its played maps, its zones, the outdoors' ids, groups and door squares that stand in its
  boxes, the flags its maps and guild quests set (a flag two areas set is in both), its items and its
  monsters. `content/shipped.json` holds the version, the outdoors' size and what no area owns: the
  spells, classes, races, conditions, skills and tiers, the core items and the flags the code and the
  guilds' ranks set. `tools/shipped.ts` writes each file and joins them into one record under one
  `SAVE_VERSION`, so two boxes of different areas edit different files. A test fails when something
  in the record has gone or moved, unless the change bumps `SAVE_VERSION` with an upgrade, the way
  version 1 saves were brought to 2; and when an id sits in a file not its owner's, or an area with
  content has no file. A conflict in a shipped file is never merged by hand (keeping both sides'
  lines leaves invalid JSON): take either side whole and run `node tools/shipped.ts`, which writes
  every file from the tree.
- New content only adds.

Decided by the builder for #914, each the owner's to overturn:

1. **An area's part of the outdoors is kept under the outdoors' own id,** `maps.caldera` with its
   `used`, `groups` and `doors` and no `size`, which the central file gives, and an area's file has
   no version: every file has the record's shape, so one join reads them all, a single old file too.
2. **What no area owns is the central file's,** and so is an id of the outdoors that stands in no
   area's box, should one ever (none does today; the suite moves a chest onto the void to show it).
3. **A list a file has nothing in is left out** at its top; a played map keeps its four keys as
   before, and an area's part of the outdoors the lists it has ids in.

### 5.6 Art

- **One silhouette.** Each sprite kind, drawn at combat size, is one connected piece of ink (above
  an alpha threshold, ignoring specks), apart from parts it declares detached: glows, sparks,
  something thrown. This is #7 as a check, in `tools/smoke/art.ts`; each family declares the parts
  in its `SPRITES` (#915).
- **No cracks.** The per-square crack sweep runs all four ways on every map a pull request changes,
  and one way on the cellar, Helmstow, its keep and the ground's samples (`tools/kit/grounds.ts`);
  the rest are swept on release, a run of the checks started by hand (`tools/smoke/cracks.ts`,
  `tools/changed.ts`). A monster's drawing sweeps no map: the sweep paints the scene with
  `paintScene`, which draws no monster, so `EVERY_MAP` names the scenery (`src/ui/scenery.ts`) and
  not the dispatcher (`src/ui/sprites.ts`) or a family; nothing left in either is in the scene the
  sweep paints (#915). The four ways are a job of their own, planned in Node and painted in shards
  (#953, `tools/kit/sweep.ts`): only a face reaches the band the sweep reads, so a view whose
  window, its hills laid flat, holds nothing standing is skipped; each distinct window is painted
  flat once, and the view with its hills only where that band shows a gap between two faces or a
  wall stands beside the party, which is where the verdict reads it. The sweep sets its own scene,
  a clear noon and the light of a spell, so every square of the window is in sight. The audit
  (`SMOKE_SWEEP_AUDIT=1`, on release) judges every view the old way beside the new and fails a view
  the two judge differently, a skipped view whose flat band paints and a window whose views differ.
  A pull request that changes the painters of a face, a floor or a ceiling (`src/ui/viewport.ts`)
  or how a cell is drawn (`src/game/ink.ts`) starts the Checks workflow by hand on its branch
  before it merges, so that the audit's fourteen shards judge the rule the skip stands on.
- **Restraint.** The share of wall faces dressed, per kind of map and per map, stays near its level
  after #9, under caps set above it so an honest new map seldom fails by chance; a new kind of
  dressing comes with its rate (`DRESSING_RATES` in `src/ui/viewport.ts`, checked in
  `tools/tests/art.ts`).
- **Distinct.** Every monster def its own sprite kind (`tools/tests/art.ts`), and every business
  its own interior (`tools/tests/maps.ts`).

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
- **Today's quests.** The Quiet Farm and The Grove Stone become its first chapters. The Cargo
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
- **An enclave holds no step.** An enclave stands beside the road (§5.2, #845), so no goal of the
  quest lies in it, and a goal set in one holds no zone: the every-zone check skips it as it skips
  the reach.

---

## 6. Layout

Where the content moves to, in one refactor, in a single pull request while nothing else is open:

```
src/content/
  index.ts                  the areas in road order; the merged tables; the one quest, joined
  progression.ts            the curve (§5.2)
  locks.ts                  the story locks, each with its reason (§2.3)
  shipped.json              what saves may refer to that no area owns, and the version (§5.5)
  areas/<area>/
    shipped.json            what saves may refer to that it owns (§5.5)
    index.ts                the area: maps, monsters, items, quests, climate, palette, what is new
    maps/*.ts               its zone maps, towns and dungeons
    monsters.ts, items.ts
    chapter.ts              its chapter of the one quest (§5.8)
    quests.ts               its side quests
    walkthrough.ts          its end-to-end test
src/ui/monsters/<family>.ts             each exports its sprite kinds
src/ui/interiors/<area>/<business>.ts   a scene to a file; the trade helpers shared
docs/areas/<area>.md                    the area's current state, 250 lines at most (§8.2)
docs/areas/<area>/decisions.md          its decisions, appended to and never rewritten
docs/areas/<area>/plan.md               its briefs, what was cut and what the state does not keep
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
| The Foreland, Thornmark (the rest) | 1–10 | hills and farmland as terrain (the scaffold of the Downs asks for both); the wilderness features; the flag off the pass, with Thornmark retuned to be the gate (§9); for M1, the first guilds (DESIGN.md §8) |
| Saltreach | 10–12 | the level cap past 10 and the xp budget (§5.2), with the first prestiges (DESIGN.md §5) and the spells past 10 (DESIGN.md §7); salt flats and tidal ground; the Cartographers' Guild's and the Salt Compact's halls (DESIGN.md §8) |
| Wrackholm | 12–14 | a crossing from the mainland, open from the start |
| Sunderwood | 14–16 | chasm, crystal and dead wood as terrain; the Rift generator |
| The Kilns | 16–18 | ash and pine, built (#536); Kiln-script and Linguist; Kilnhaven's ferry and ship (#432) |
| Cairnmoor, Rimewater | 18–22 | ice and lying snow as terrain (heather came with Act II; ice came with #536 and lets a group stand on it; lying snow is the maps' snow); regeneration, curse and calls; the drove road's coach; the one story lock the act spends (#432, #440) |
| The Whitespine | 22–24 | cliffs and peaks, with the road through them, built (#543); a group that talks before it fights; sweep (#442) |
| Ashfall | 24–26 | the crossing by ship, open from the start; volcano and lava fields, built (#543); sweep with fire (#442); the sentries after the Stone, built (#548) |
| The Glasswold | 26–28 | steppe and dunes, built (#543); stone and its cure; the Rider's ride to Cinderport; a lava flow sealing the Glass, drawn by the Wold's doc (#442, #523) |
| Hearth Isle, the Underdeep | 28–32 | the Underdeep's look; eight systems (#739, call 9): the curve's last row, ending at the cap (its next floor, its band and the trainers' ceiling capped at the cap); the gear's last rung at 28, found and never sold; a group that is gone once a flag holds, standing or not; the Core's clock and `obeys`; `Exit.lifts` and `Exit.after`; the endings (their table, their long-form screen and the Hearth's three states on the title, in the night sky and in the almanac); a save upgrade for the Peak Stone; the gate bot and the harness run to 32 with the clock played |
| The reach: the Glass, and Glacier Foot with the Vault (DESIGN.md §9) | the cap | glass and dunes; a lava flow sealing the Glass from the Ember Waste; the Vault's new kind of map, the inside of the sky; the atlas marking reach areas beside the road, not on it (its test holds the bands rising along the road, and a reach area's would not); super dungeons of many levels; artifacts |

The skills that open the map come when there are shortcuts and secrets for them; none is needed to
follow the road. Linguist, the Lanterns', is built (#538); so are Mountaineer and Swimmer (#805),
the Wardens' at their Drillyard and the Cartographers' at their halls in Saltmouth and Cinderport,
and Perception, Spirit Sense, Danger Sense and Arms Master (#856), the Lanterns' and the Wardens',
and Cartographer, Pathfinder, Lockpick, Merchant and Navigator (#857), the Cartographers' and the
Compact's: all twelve. No door needs a pick, and a locked chest is off the quest. Decided by the
owner's delegate, 16 October 2026 (#805). Along the whole road the systems lane also owed the danger
made legible (the band said on crossing, and in how a group is described), the log paging the one
quest by chapter and hand-ins that take their item at the first meeting (§2.3), each built now
(SLICE.md); and the bot is settled (§5.2, J2): the game's blesses, sleeps and drinks from level 11,
and the gate's plays plainer than a player.

Rifts are where DESIGN.md itself asks for generated content: eight 12×12 templates, seeded, a pure
function of state and seed. Build the generator early, in the systems lane, and let generation scale
there, where repetition is the design, rather than on the map.

---

## 8. How the work is split

### 8.1 Lanes

| Lane | Touches | At once |
|---|---|---|
| Systems | `src/game/`, `src/ui/` outside the art modules, the kits (`src/ui/paint/`, `src/ui/monsters/kit/`, `src/ui/interiors/kit/`), the save format, the shape of the registries | one |
| Area | `src/content/areas/<area>/`, `docs/areas/<area>.md` and its folder, `docs/areas/<area>/` | one per area in flight |
| Creatures | `src/ui/monsters/<family>.ts` | one per family |
| Interiors | `src/ui/interiors/<area>/` | one per area |
| Quality | `tools/`, CI, this contract | one |

A content session that needs a change to a system stops and asks for one, or opens a systems pull
request first; it never edits shared files on the side.

The imports keep layers as the files keep lanes: `src/lib` under `src/game` under `src/content`
under `src/ui` under `src/app` (the files directly under `src/` the app's until it is made), the
tools taking anything and `tools/kit/` only `src`, the walkthroughs and the suites `src` and
`tools/kit/` and not each other or the tools, no area another's files but its `public.ts` and no
cycle among `src`'s runtime imports; `tools/tests/layers.ts` holds it, today's crossings the rows of
its `KNOWN`, which only ever go (#900).

Decided by the builder for #900, each the owner's to overturn:

1. **A runtime import is what Node loads:** an `import` or an `export ... from`, `import './x.ts'`
   and `import('./x.ts')`. `import type`, `export type` and an `import()` in a type are left out, so
   the type cycle through content stays as it was kept; `import { type A }` is not, as Node strips
   the name and still loads the file (none is written today). A path made as it runs (`import(p)`)
   is not followed. A lexer reads them in 0.2 s, where the compiler takes three to parse them, and
   agrees with its parse on every file.
2. **The layers are one order,** so content taking the UI or the app would cross too (none does).
   `src/lib/` is vendored: never an importer, always a target. A walkthrough is a test, not
   content: it takes any of `src`, and the area rule holds it.
3. **The suites are what the runner runs as suites:** `tools/tests/*.ts` but `lib.ts`, which a suite
   may take (`ok`, `fail`, `owed`) and a walkthrough, handed `ok`, may not. The runner's fixtures
   under `tools/tests/runner/` are tools.
4. **A row is `importer > imported`,** however often the import is written, under the first rule it
   breaks: the walkthroughs' and the suites', the layers, the areas. A cycle is one row, `cycle: `
   and its files sorted, a strongly connected component of `src`'s graph.
5. **The keys are the plan's:** L2 the items (`items.ts`, `party.ts`, `skills.ts`), L3 the monsters
   and spells, L4 the guilds and ranks, L5 the climates, stones, endings and `quests.ts` (its
   `MAP_DEFS` goes with the atlas, the last table); L6 the pilot's; L7 `game.ts`'s and the screens'
   imports of `src/input.ts`; H8 a walkthrough taking another's chain (`STEPS`, and Saltreach's
   two orders of play), keyed K8 until #985 moved `tools/walk.ts` into the kit. L8 and L9 hold
   none: `src/game` takes a screen only in the pilot and `game.ts`.
6. **One cycle is left, and the plan keys none:** `items.ts` takes `skills.ts` (`skilled`, #879),
   `skills.ts` takes `party.ts` and `party.ts` takes `items.ts`. Its row is keyed `split`, the big
   modules split that takes `party.ts` apart. The `dens.ts` cycle is gone (#918).

The lanes are read as code, not by eye (#899): `node tools/lanes.ts <base>` lists the lanes the
files changed since `<base>` fall in, each with its files, by the table of docs/ISSUES.md §2 (which
adds a design lane, `docs/`, to the rows above), and the checks' `lanes` job writes the same into a
pull request's summary beside the lane labels its event carries: a line for each lane a file falls
in that the labels lack, one for each label no file falls under and one where no lane label is on
yet. It tells and never gates. A file no lane holds (the vendored `src/lib/`, or a kind of file the
table lacks) is listed outside every lane. The command line is `tools/lanes.ts`; the table, the
report and the reading of the diff are `tools/kit/lanes.ts`, the kit's first file, which
`tools/tests/lanes.ts` holds.

Decided by the builder for #899, each the owner's to overturn:

1. **The table is ISSUES §2's, a line to a kind of file, the first line a file matches placing it.**
   The area lane is one label, `lane: area`, with the area named beside it in the report:
   `src/content/areas/<area>/` (its `shipped.json` with it) and `docs/areas/<name>.md`, three of
   which are named for a place and not their area (`hearth_isle` is Hearth's, `dead_drop`
   Wrackholm's and `meridian_camp` Ashfall's). Since #1011 the folder beside a doc,
   `docs/areas/<name>/`, falls where the doc does.
2. **The save format needs no line of its own:** `SAVE_VERSION`, the upgrades and the save keys all
   stand in `src/game/`, which is systems already. The central `src/content/shipped.json`, what a
   save may refer to that no area owns, is quality's, as the issue says.
3. **The files the table leaves out:** `README.md` and `CLAUDE.md` are design, the docs' front
   pages; `package.json`, `package-lock.json`, `tsconfig.json`, `.gitignore` and `types/` are
   quality, for they configure the checks; `index.html` and whatever else stands in `src/` outside
   the folders the table names (`src/main.ts`, `src/input.ts`) are systems, the game's page, entry
   and input; `src/lib/` is no lane, for it is vendored (DESIGN §13).
4. **The labels are the event's, and the tool never fails.** A pull request with no lane label yet
   gets a line saying so, not a failure, and the tool exits 0 in the checks whatever it finds. The
   event is read as the run began, so labels put on after a pull request opens show from the next
   push's run: a re-run of the job reads the same event.
5. **The files are `git diff` against `HEAD^1`,** the merge's first parent, as the sheet job reads
   them: no token and no API. A rename counts at both its ends, since a file moved from one lane to
   another is an edit in each.
6. **The report is a job of its own,** not a step in the sheet job: it needs Node alone and comes in
   seconds, where the sheet waits on `npm ci` and Chromium. Like the sheet it is not one of the
   three required.
7. **A suite of its own,** `tools/tests/lanes.ts`, found by its file, holds the table to a sample
   file under each of its lines, to every file in the tree, to `AREAS` and to `.github/labels.json`,
   and the report to the lines it must write.
8. **The library is the kit's, the command a thin tool:** the layers check (#900) lets a suite take
   `src` and `tools/kit/` and not a tool, so the table, `laneOf`, the report and the reading of the
   diff and the event are `tools/kit/lanes.ts`, the kit's first file (#984, K7, filled the folder,
   and #985 put the walk in it). It imports `node:` modules alone, which the check does not follow,
   and `tools/lanes.ts` is the command line that takes it. The job and the docs still name
   `node tools/lanes.ts`, and no `KNOWN` row is added.

The kit holds what the walkthroughs and the suites take, as #984 filled it: the fight once
(`fight.ts`: `playOut`, `ROUND_CAP`, the gate's bot, its fight, its win rate and their memo), the
premade company and its ladder (`company.ts`), the test monster's line (`line.ts`, its two tables in
`line.json`, which `node tools/harness.ts --calibrate --write` writes), the harness's library
(`harness.ts`), the headless game (`headless.ts`), the rules the suites share (`rules/`, a module a
suite) and the libraries of `checks`, `grounds`, `ways`, `shipped`, `changed` and `scaffold`.
`tools/gate.ts` and `tools/harness.ts` are command lines over it and import nothing of each other;
`roadPlace` is `src/game/atlas.ts`'s, beside `areaBand`.

#985 put the walk in it: `walk.ts`, the walk the walkthroughs and three suites take and, once, the
helpers the walkthroughs wrote each for itself (meeting, answering, searching, opening a chest,
reading a quest's page, setting the clock), and `grid.ts` beside it, the floods and tests over a
map's squares (`reach`, `shut`, `reached`, `spread`, `paces`, `apartFrom`, a box's `row` and `col`)
and `ALL`. The chain a later chapter replays (`STEPS`, `FARM_FIRST`, Saltreach's `inOrder` and
`saltmouthFirst`) stays in its walkthrough, H8's: the kit takes no walkthrough.

Decided by the builder for #984, each the owner's to overturn:

1. **The harness's library is a module of its own,** `tools/kit/harness.ts` (the thrifty bot, a
   fight and a day of fights measured, the calibration and the workers), in #899's form; the
   company, the fight and the line, which the gate takes too, are `company.ts`, `fight.ts` and
   `line.ts`. The gate's library is the fight's, its `gateCompany` the company's.
2. **The loop takes a fight already begun,** `playOut(s, p, rng, bot, rules, cap)`: each caller
   starts its own (its group's name, its weather, its edge), and the bot is the harness's `Bot`,
   handed `rules.bot` and `rules`; the gate's is `gateBot`. The cap is read once the turn is found,
   as four of the five loops read it; the combat suite's, which read it first, ends inside the cap
   either way.
3. **The guard is 4,000 turns:** no fight under the cap comes near it (the harness's 5,000 never
   bit), and an uncapped one, a walkthrough's `fight`, is broken off at it.
4. **The memo takes its seeds with it:** `rate` and `SEEDS` (100) are the fight's, keyed as they
   were, and the gate suite takes both.
5. **The line's tables are `tools/kit/line.json`, a role a line,** each row as `JSON.stringify`
   writes it (`lineJson`), read as `line.ts` loads; `tools/restate.ts` reads the file at a ref, or
   `tools/testmonster.ts` at a ref before #984.
6. **The suites take the headless game from the kit too:** `tools/tests/lib.ts` keeps `ok`, `owed`
   and the rest and re-exports nothing, so a suite that plays no game no longer loads `Game`.
7. **A suite's shared rules are one module named for it,** `tools/kit/rules/<suite>.ts`, the
   fullrun's `play` and the ladder's acts among them; each suite keeps its checks.
8. **Three of the six tools move whole and three split:** `checks`, `grounds` and `ways` into the
   kit; `shipped`, `changed` and `scaffold` keep their command lines over `tools/kit/<name>.ts`.
   `DECIDES` names `tools/kit/changed.ts` beside `tools/changed.ts`, the changed suite's tool the
   gate loads is `tools/kit/harness.ts` and the sheet watches the kit's `ways.ts` and `grounds.ts`.
9. **`tools/walk.ts` takes the gate's win rate and the headless game from the kit,** two import
   lines, so #985 can move it whole; its 15 rows are keyed `K8`.
10. **The import lines were rewritten by a script,** `tools/rehome.ts`, committed first and deleted
    last, as #968's sweep was.

Decided by the builder for #985, each the owner's to overturn:

1. **The helpers are `walk.ts`'s, the floods `grid.ts`'s:** each flood takes the map it floods (a
   walkthrough's `out`) first, and `ALL` is the grid's.
2. **What a copy took from its scope, the kit's takes as an argument:** the walk (`search`, `here`,
   `keys`), the outdoors, the chapter (`written`, `goalOf`) or the box; each call passes it.
3. **Where copies differed, the kit's covers them in the words each check said:** `answerTo` takes
   what the answer sets (null: nothing) or `{ label }`, and `whole` for the four that named a person
   in full; `open` takes 'map:id', what a chest found open does (`'check'`, `'skip'`, `'any'`) and
   whether the log is heard; `reads` goes by the title of the quest's first page (the five handed a
   title were handed that one); `there` and `shows` place a feature on the map it is written on, as
   Thornmark's and Sunderwood's `shows` did, where the rest placed it on the map the company stood
   on: the same at every call.
4. **A `reach` along a predicate is `spread`, one counting steps `paces`:** Ashfall's two and
   Whitespine's are the first, Cairnmoor's, Rimewater's and the Kilns' `steps` the second.
5. **A variant that does another thing stays, under a name of its own** (`afoot`, `loot`, `sight`
   and the rest, each listed in #985's pull request with what it does).
6. **`FARM_FIRST`, `inOrder` and `saltmouthFirst` stay:** they replay the chain, which the kit could
   hold only by taking three walkthroughs. `HIRE`, `hired` and `ledgerGiven` come in; the row
   `wrackholm > saltreach` stays, and H8 holds eight rows, not seven.
7. **Counted again on the head, `here` has three bodies and `keys` and `hour` one:** the position
   and the two move, and so does every other body two walkthroughs wrote alike under one name, and
   those alike but for the map, box or chest they read where the kit holds the general one (`at` as
   `here`, `clock`, `hour`, `walkAt` or `square`; `business` as `ofKind`; `chestOf` as `chest`).
   What two still declare is listed in #985's pull request with why.
8. **The count reads columns 0 and 2, as the issue's did:** the lairs' `flood`s at column 4 stay;
   Hearth's `written` there, a quest's entries by id, is `entered`, as Ashfall's is.
9. **A script made the edits,** `tools/rehome.ts`, committed first and deleted last; its `--prune`
   dropped the imports they left unused (the base's three stand). Five edits are by hand: Hearth's
   deeper `written`, Glasswold's two comments and its local `Can`, Cairnmoor's `road` and
   Whitespine's `keeperLog`.
10. **Six bodies are still written in two walkthroughs, each one but for a type, a `!` or the walk
    it reads:** `group` by 'map:id' (Ashfall's and Sunderwood's), `person` on a map given
    (Cairnmoor's, Rimewater's and Whitespine's `personOn`), `feature` on a map given (Ashfall's and
    Glasswold's three), `cross` (Ashfall's and Glasswold's), a box's square stood on (Ashfall's
    `at`, Cairnmoor's `standsIn`) and a meeting's words with the log not heard (Ashfall's `say`, the
    Kilns' `says`, Sunderwood's and Shelf's `talk`). With the families alike but for the map or box
    they read (the box tests `on` gives, the events `ev` finds, the squares `square` keys) they go
    into the kit with the scenes (#1018, #1033), which rewrite every walkthrough.

The paint kit, `src/ui/paint/`, is what every drawing in `src/ui` paints with; it, the monsters' kit
(`src/ui/monsters/kit/`) and the rooms' (`src/ui/interiors/kit/`) are the systems lane's, as
`tools/kit/` is quality's (#983). A family or a scene takes a kit's helper when it is next edited,
not in a sweep, and a helper a third family or a third scene wants goes into the kit by a small pull
request of its own, not into a copy in a third file: the rule of three.

Decided by the builder for #983, each the owner's to overturn:

1. **Which file holds what.** The paint kit: `brush.ts` and `gloss.ts` moved whole, `ink.ts` (`INK`,
   `rod`), `forms.ts` (`Pt`, the unit frame `F`, `ring`, `tube`) and `flame.ts`; the monsters' kit:
   `common.ts` and `figure.ts` moved whole, and `chisel.ts`; the rooms' kit: `stage.ts`
   (the old `kit.ts`, a name that says nothing in `kit/`), `props.ts` and `trades/`.
   A moved file keeps its name.
2. **The glow goes with the flame:** `smudge`, which `drawFlame` lights with, moves into `flame.ts`,
   as the paint kit takes nothing from the rooms'. The stage imports `INK`, `smudge` and `drawFlame`
   and re-exports none; the old `kit.ts` does, so each name has one home in the kits.
3. **The trades are the props the issue names:** the temple's stained glass, altar, pew and
   Lanterns' ring (eight scenes take one) and the smithy's armour stand, mail and anvil (six).
   `pillar` stays in `props.ts`, as the throne room stands on it beside two temples, and so
   do the weapons and shields.
4. **The unit frame is `F`, as its nine copies name it,** beside `Pt`, so a family taking
   it deletes its own declaration and changes no other line; the four with an `h` and
   the crawlers' `H` need more.
5. **The brush's default and `B` take `INK`,** as the issue asks; the eye's pupil in `common.ts`,
   the file's other `'#120c14'`, is a copy and stays until the file is next edited.
6. **What a kit's file counts (`tools/changed.ts`) goes by folder:** any of `src/ui/paint/` every
   monster and room, and `brush.ts` and `ink.ts` (the viewport's `hash`, `B`'s outline)
   every map too; any of `src/ui/monsters/kit/` every monster, its `common.ts` every map
   too; any of `src/ui/interiors/kit/` every room. A new kit file is counted with no edit;
   `chisel.ts` counts every monster, where `knockers.ts` counted the knockers alone for a
   mark three other families cut.
7. **The rooms' kit is no area's folder:** the changed suite's check that each folder of
   `src/ui/interiors/` is an area's, its registry keying the area's rooms, skips `kit/` by name.

The tools that open the game in Chromium (the smoke, the sheet, the gallery, the interiors, the
world map and `shot.ts`) start it in one place, `tools/kit/browser.ts` (#986), which imports
Playwright by name as the pinned dependency it is (§8.3), launches it once with its fallback and
opens the game on a page, its errors gathered and, for the smoke and the sheet, its `Math.random`
pinned. The sheet, the gallery, the interiors and the world map read their command lines strictly by
`tools/kit/args.ts`, which `tools/tests/args.ts` holds. `types/globals.d.ts` types the page's game,
so the tools read it as the `Game` it is.

Decided by the builder for #986, each the owner's to overturn:

1. **Each tool serves the tree and hands the port in:** the kit takes src only, so `browser.ts`
   cannot take `tools/server.ts`. Each of the six keeps its three lines that start the server on a
   port of its own, and `node tools/server.ts` (`npm run dev`) is as it was; moving the server's
   library into the kit would move the file `npm run dev` names to save three lines a tool.
2. **A page's errors are gathered one way,** a page error or a console error, each named so
   (`pageerror: `, `console: `), as the smoke and the sheet had them; the gallery, the interiors,
   the world map and `shot.ts` took page errors alone, unnamed. The game writes no console error of
   its own (`src/` has none outside `src/lib/`), so their runs print what they did. The full
   Chromium of the fallback asks for `/favicon.ico`, which the tree lacks, and its 404 is a console
   error: the kit answers it with nothing.
3. **The four tools' tables stand in `tools/kit/args.ts` beside the reading,** not in the tools: a
   suite takes no tool and a tool runs as it loads, so the suite reads them there. Each tool keeps
   its defaults (its output path among them) and the meaning of each flag; the sheet's usage line
   and refusals are word for word.
4. **The output path is the one word that is neither a flag nor a flag's value, wherever it
   stands.** The gallery and the interiors took the first word that was not a flag, so a flag's
   value could be the path: `gallery.ts --family wolf` wrote a file named `wolf` and
   `interiors.ts --only green_man out.png` one named `green_man`; the interiors also passed over a
   path starting with a digit (`interiors.ts 2x.png --only green_man` wrote `green_man` too). The
   first now writes the default and the others their path. Every line in the form of the usage lines
   reads as it did, which the suite holds against each tool's old reading.
5. **A page's import is typed by `Load`, a type in `tools/kit/browser.ts`:** a page function cannot
   close over the tool's, so each binds it (`const load: Load = (p) => import(p);`) and each call
   names the module's type, its path a literal as before.
6. **The smoke names what it reaches into, all of it erased before the page sees it:** `Shown`, the
   fields it reads off a screen that `Screen` does not name; casts that write what the game keeps
   read-only (a map's features and landmarks, the item table and the painted flames); the world's
   private cached sky and the input's queue by their names (`w['cached']`, `['queue']`), the sky set
   to `null` where it was `undefined`, as a flag set to `true` is now `1`: the game tests both for
   truth. Its five lines left with `any` (the lighthouse's and the tents' records and an early
   return's `wold`) are H9's.

### 8.2 The recipe for a zone map

1. **Brief**, in the area's plan, `docs/areas/<area>/plan.md` (the area's doc, below; its §4 until
   D3 moves it): purpose, band, landmarks, the secret and its hint, the encounters, what is new;
   its "As built" once built.
2. **Scaffold.** Every outdoor map is one box of the grid the Foreland and Thornmark sit on: 32
   squares a side, its corner at x = 8 + 32i and y = −2 + 32j, cut to the world at its edges, and
   named as the old maps were, by its column's letter and its row's number (the Foreland is G2). A
   map's place is its box, so what is not built is always whole boxes, and no area leaves another a
   strip no map fits; its zone's entry says so, `laid(PLAN, 'highmoor_n7')`, the box its id ends in
   (#993). `tools/scaffold.ts <zone> <x> <y>`, built in Phase 0, cuts the atlas's
   terrain for a box into a draft map, so the land walked matches the land painted. A prototype,
   tried on the Downs west of the Foreland, gave in a second a wood, the hills and the road, and 14
   of its 32 rows nothing but grass: the part to be authored. The draft is declared with its id
   (`MapDef<'highmoor_n7'>`) and listed in its area's `MAPS`, as every map is (#994).
3. **Author**: landmarks, features, groups, the secret, the ways in and out; dress the terrain. An
   exit lands on a named anchor of the map it leads to, `at: 'from_cairns'`, never on its squares:
   that map holds its anchors after its `start`, which is one, each named for the way in (#993).
4. **Check**: a box declares the flags it sets in its area's declaration (`flags.ts`), each with a
   few words on what holding it means, and records them with its other ids: `node tools/shipped.ts`
   records the box's ids in its area's `shipped.json` and no other file, and on a new area's first
   map makes that file (§5.5); the typecheck refuses a flag no area declares and one two declare,
   and the shipped suite a flag declared and not recorded or recorded and not declared (#995); then
   `npm run check`, then the contact sheet.
5. **Review**: a pull request, CI green, the owner's look at the sheet, merge.

A monster or an interior goes the same way: a brief, the drawing, the gallery or interiors render,
the checks, the sheet. A new kind of an existing family touches its family's file (its entry in the
family's `SPRITES`: the drawer, the span the smoke test prints and any part drawn apart) and its
area's monsters and index, and its sheet draws that family alone (#915).

Decided by the builder for #915, each the owner's to overturn:

1. **The barrel reads the areas** (`AREAS`, `src/content/index.ts`) to refuse at load a kind no area
   names, as `byId` refuses a monster defined twice; a family's file refuses one outside
   `MonsterSprite` at the typecheck already.
2. **A change to the barrel counts the families its import lines add against the base's**, read from
   its text since the base's barrel cannot be imported; `tools/tests/changed.ts` holds the reading to
   the families the barrel merges. A file of `src/ui/monsters/` the barrel merges no kinds from counts
   every monster, as a shared brush does.
3. **`SPRITES` stands after the family's `draw`**, which every entry names, where `KINDS` stood before
   it, and keeps `KINDS`' order; the smoke's line of declared parts names them family by family, in the
   barrel's order, where the old table had its own.
4. **`familyModules` keeps a family's `kinds`**, the keys of its `SPRITES`, so `pillars` reads them as
   before.

An area's dungeons may exit only to its own region's maps, or to the outdoors once its zone is laid,
so its zone map lands with or before its first dungeon (`tools/tests/weather.ts:125` holds it).

**A new area starts in `AREAS`** (`src/content/index.ts`), from its first commit: its folder, its line
there and its `MAPS` in `AreaMaps` beside it (each map declared with its id, `MapDef<'cairns'>`, so
that `MapId` names it, #994), its `flags.ts` declaring `FLAGS = {}`, its `flags: FLAGS` and its line
in `Declared` (so that `Flag` names what it sets, #995), its row in the atlas's `areas` charted as
the plan charts an area (`src/content/atlas.ts`: made of zones, reached from the start, its step and
its band rising on the road of levels, which the atlas suite and the curve read) and its row in
`CURVE`, with `MAPS` empty and `chapter: undefined` until its first map (the typecheck reads
`chapter` on every area) and what its clear falls short of owed in its `checks.ts` (`owes.curve`)
until it pays. Its monsters, rooms and items are merged from the start, so nothing waits in a list
of its own ahead of its area (the `AHEAD` lists and `PLANNED` are gone, #897), and the suites take
what is built: an area with no map is asked for no chapter, walkthrough, claim of what is new or
step of the one quest, and once it has a map each zone it charts holds a step; a monster or a room
no map places yet is owed in `owes.unplaced`. What the suites hold of an area is the area's: what
describes one zone, group, monster or exit is a field of it (`AtlasZone.road`, `reach` and
`maxGroup`, `EncounterDef.boss`, `MonsterDef.offLine`, `Exit.crosses`), and what is the area's own
and no part of the game, what it owes, its rungs of the ladder, its lead over the road, its seams as
built and its edges open on nothing, is a row in its `checks.ts` (`AreaChecks`), which nothing in
the game imports and the suites find as the runner finds a walkthrough; a field `AreaChecks` has not
stops the run with its name. A seam is the area's of the first box its key names (`a|b` or `a/b`),
an edge the area's whose box it is. Each suite reads those alone. Every area's have moved, the
Foreland's first (#897), the rest by one script in a window with no area pull request open (#968)
and the last two tables' by the same script (#969), which dropped the emptied tables and the second
reads beside them; so a box adds its rows to its own folder only.

**An area's `public.ts` is the one file of it another area imports** (#992), which the layers suite
holds (§8.1). It declares the flags and exits the others take, imported back by the files they stood
in, and re-exports the area's `items.ts`, where every item is a const of its own by the name of its
id (`export const plate = A('plate', …)`, `halberd+1` as `halberdPlus1`): another area takes an item
by its name, never by its id from a table. It re-exports nothing else but the area's flags as
declared (`FLAGS`, from `flags.ts`, which imports nothing, #995). What it re-exports, everyone
who takes anything of the area loads, and the areas take one another both ways (Ashfall and the
Glasswold, Hearth Isle and the Foreland, the Kilns and the Whitespine): with every `items.ts`
re-exported, a map re-exported for its flags closes a loop of six files, every `chapter.ts` one of
eleven and every `guilds.ts` one of six, and the layers suite refuses a loop. So a walkthrough takes
another area's chapter from `THE_QUEST.chapters` by its id. Every area has one; a new area has one
once another takes something from it, and a flag another area needs that `public.ts` lacks is one
line there, added by the box that needs it and said in its pull request.

**The area's doc is three files** (#1011). `docs/areas/<area>.md` is its current state, 250 lines at
most, which a session reads first: its ids, where it is (§1), what it is for (§2), what is built, a
row to each map with its id, kind and band, what is there and its secret with its hint (§3), the
chapter and the side quests a line each (§5, §6), the numbers that hold (§8), the names (§10) and
what is open and owed. It keeps the old numbers and headings of what it holds, and its first lines
say which file holds each old section it does not. Beside it are its decisions and its plan. The
decisions, `docs/areas/<area>/decisions.md`, hold the old §9 and every "Decided by" list, in order:
a builder adds a list at the end, and a later decision that changes an earlier one says which; an
earlier one is not edited, bar a plain slip the pull request that finds it says it mended. The plan,
`docs/areas/<area>/plan.md`, holds the old §4, §11 and §12 whole, then under "Moved from the state"
the lines of the state sections the state does not keep; a new box's brief goes there first, with
its "As built" once it is built. A doc is moved, never rewritten: `node tools/docmove.ts` finds each
line of the old among the new files as many times as it stood, and each of its paragraphs whole in
one of them, in their old order there; `tools/tests/areadocs.ts` holds the shape. The Foreland's
moved first, to `docs/areas/shelf/plan.md` and `docs/areas/shelf/decisions.md`; the other thirteen
are owed to D3, and the suite lists them on every run.

Decided by the builder for #1011, each the owner's to overturn:

1. **The state holds what a session needs and no history:** the index, then §1 in words (zones,
   bands, edges), §2 and §10 whole, §3's table, §5 to §8 a paragraph or a line each and "Open and
   owed" last, unnumbered so the old numbers keep their meaning. Every figure in it is re-read on
   the head from the suites' lines; the old lines stand in the plan as they were written.
2. **A row says its secret as the door's squares, what it is, then the hint's squares and id**
   (`4,7: a cold draught at 4,6 (mill_draught)`), as `secrets` and the hint's feature hold them, so
   the row is found again in the map's file; a map with none says so.
3. **The header's moved lines open "Moved from the state" with no heading,** as they had none but
   the title; every other part stands under the heading it had, repeated where the state keeps it.
4. **The proof holds paragraphs as well as lines:** a paragraph (a run of lines, broken at each
   heading, list item and table row; a fenced block whole) stands whole and in order in one new
   file, its blank lines where they were, and each file holds a section's paragraphs in their old
   order, since every line found does not show that none was split or reordered. A line is
   compared whole, its spaces and all.
5. **The lanes line takes the doc's folder whole,** any file in it, as an area's content folder is
   taken, through `DOC_AREA` for a place's doc.
6. **The owed docs are named, and their lines read as they stand** each run, so no area's pull
   request leaves the figure stale; the issue's count on `ea34c3ad` is in its pull request.

Decided by the builder for #897, each the owner's to overturn:

1. **What an area owes and its rungs are rows of its `checks.ts`, not fields of the `Area` in its
   `index.ts`**: the game's build carries none of the checks' bookkeeping, as `progression.ts` and
   `tools/harness.ts` keep it out today, and the issue's `checks.ts` holds the area's own rows.
2. **One field name per table**, each keyed as its table was, so the move is a copy: `owes.curve`,
   `unplaced`, `unset`, `cutOff`, `edges` and `locks`; `gear` by level; `road`, `reach: true` and
   `maxGroup` on the zone; `boss: true` on the group; `offLine` on the monster, OFF_LINE's reason or
   WHOLE's role, share and reason; `crosses` on the exit, the two regions it joins.
3. **`gear` holds a rung whole**: what a company wears by the level goes to `GEAR` and what it carries
   to `KIT`, by the item's slot, so one row serves both.
4. **`NAMES` is the atlas's name of the area, and `BEHIND` every group whose `after` names a flag only
   a later area's maps set**: both read the same as the tables did (the twelve names and
   `deep_mines3:ud_mines`), and a new area needs no row for either.
5. **The Deepthorn's eight is a table, `MAX_GROUP`, until it moves**, read beside `maxGroup` as the
   other tables are.
6. **`ONE_CROSSING` is a list, and the exit's mark names the two regions it joins** (`crosses:
   'hearth kilns'`): the table may be emptied and still typecheck, the mark keeps the table's pin on
   the regions, and each fixture gives its own table, so it holds whichever way the door is written.
7. **`seamsAsBuilt` and `openOnNothing` are lists of rows as their tables write them**, so the move is
   a copy of the line, and a row on an area that is not its first box's is refused. The Foreland's
   are five seams and three edges; `upperwater_c2|downs_d2` and `upperwater_c3|downs_d3` name its box
   second and are Saltreach's.
8. **An issue may be owed edges or locks by several areas; a square or a lock is owed once.** `edges`
   and `locks` stay keyed by the issue, as their tables are, and are read by the thing owed.
9. **A rung stands whole on the last area on the road whose items it holds**: 3 on the Foreland (the
   core's and its own), 13 on Wrackholm and 19 on Cairnmoor, the three that hold the items of two
   areas; every other rung is its one area's (14 on the Sunderwood, 28 on Hearth Isle and the
   rest). A rung on another area is refused; 13 and 19, each moved whole by hand, read the same.
10. **An area's lead over the road is its own figure, `overRoad`**, read beside `OVER_ROAD` and refused
    in both. The Foreland has none; the Kilns' 19.4, moved by hand, reads the same.
11. **`BEHIND` takes a group only when every alternative of its `after` waits on a later area's flag**,
    as a list is any one of them. No group has two today.
12. **Two tables are not an area's to carry: `BUILT` and `UNPLACED` in `tools/tests/items.ts`** (#911: the
    three artifacts then owed to #830, #831 and #833; the Telstok alone, owed to #830, since the
    Kilns' and the Glasswold's lairs placed theirs) go when the lairs place them, so they have no
    field.
13. **An `unplaced` id that is no monster and no room fails by its name**, and a field `AreaChecks` has
    not stops the run by its name: the run passed both over before.

Decided by the builder for #968, each the owner's to overturn:

1. **Rungs 13 and 19 stand on Wrackholm and Cairnmoor**, the last area on the road whose items each
   holds (#897's rule, which the ladder suite keeps), and KIT's 25 shares Ashfall's rung 25 with
   GEAR's, worn first: the derived `GEAR` and `KIT` read as the tables did, rung for rung and in
   order.
2. **`Area.atlas.links` may be left out**, as the Foreland's is, having no link of its own.
   `ATLAS.links` is each area's in road order and then the plan's 15 between two areas; the zone
   overlay draws the same PNG from them.
3. **A Rift's table may say its warden is a boss** (`RiftTable.boss`): the Tide Ship's Rift's warden
   is made by `rift()`, so its mark goes on the table, and the group carries `boss: true` as written
   ones do.
4. **A row's comment goes with it** where it names one thing: a road's above its zone (above the
   field in a zone of several lines), a boss row's above its one group. The three rows of several
   groups (Wrackholm's, the Ember Waste's and Hearth Isle's) leave theirs, each group saying in its
   map what it is; `SEAMS_AS_BUILT`'s headers, one an area, go, as each row now stands in its area's
   file.
5. **`offLine` stands before a def's `tint` and `boss: true` after a group's `roams`**, where the
   lairs wrote theirs; a new `checks.ts` (Thornmark's, Saltreach's, the Sunderwood's, the
   Whitespine's and Hearth Isle's) takes the others' form.
6. **Every walkthrough check of a respawn takes its name**: thirteen in six walkthroughs, where the
   issue counted four.
7. **The quests suite reads `reach` alone**, so it imports nothing from the pillars suite, and that
   row of the layers' `KNOWN` goes.
8. **`OPEN_ON_NOTHING` (17 rows) and `OVER_ROAD` (2) stay**: each has had a field since #897
   (`openOnNothing`, `overRoad`), but #968's table names neither, and it kept `OVER_ROAD` only until
   it had one; #969 moves both by the same script, and its body names them.

Decided by the builder for #992, each the owner's to overturn:

1. **`public.ts` re-exports `items.ts` whole** (`export * from './items.ts'`): every item by name
   and the rest of the file (`ITEMS`, `CURES` and the shops' lists; the Kilns' `quarterMore`,
   `SMITH_PRICES` and `ANVIL_STONE_PRICE`), in one line that an item added never touches.
2. **A statement of several flags is split** where the others take only some: those taken move, and
   the rest stay in the map under the comment that names them all. Each group in `public.ts` says
   the file it came from; a flag's own comment moves with it.
3. **The Kilns' `GATE` of `ironfells_n3` is `IRONFELLS_GATE`**, for the Iron Fells, its map's name
   without its square, in the map and the two walkthroughs that read it; `kilnmouth_l6`'s stays
   `GATE`. No other name of a `public.ts` clashes with one of its area's.
4. **An item named for the first time takes its id's name**, declared above the array it stands in
   (`ITEMS`, or Ashfall's `PARTS`), in that array's order and with its comment, an object typed
   `ItemDef`; the array holds the names. The 20 consts that had names keep them and gain `export`.
5. **A walkthrough takes another area's chapter as the Hearth's takes the warning:** `const TIDE =
   THE_QUEST.chapters.find((c) => c.id === 'tide')!`, under one comment after its imports, the names
   the bodies read kept.
6. **One import from each `public.ts` in a file**, where the first of the imports it replaces stood;
   an area's own files and the tools that took a moved name take it from `public.ts` too.
7. **The layers suite's fixtures key their area row `K8`**: `judge` takes a row under any key of the
   plan, and with `A6` gone no key holds a row of the area rule (`K8`'s eight are a walkthrough
   taking another, the `tests` rule's), so the fixtures borrow `K8`; what they test is the rule, not
   the key.

Decided by the builder for #969, each the owner's to overturn:

1. **The script gives the two tables their owners**: an edge open on nothing to the area whose box
   it is, a lead over the road to its area, after its rungs and before its seams as `AreaChecks`
   orders them; `OPEN_ON_NOTHING`'s headers, one an area, go, as `SEAMS_AS_BUILT`'s did.
2. **`MAX_GROUP` goes too**: #968 emptied it and the issue's list leaves it out, but no suite may
   read a row from two places; the maps suite reads the zones' `maxGroup` alone.
3. **A row two areas could both give is still refused twice** (an owed monster, room, flag, map,
   square or lock, and a rung): that is no table's second read but the areas' own check, so `beside`
   becomes `gather` over the areas alone and the line drops "in the table or by its area".
4. **A refusal that only a table could trip goes with it**: a zone holds one road, a group one mark,
   a monster one `offLine` and an area one `overRoad`, and a seam's or an edge's row is held once by
   its own check; so those lines go, and the gate's "every key of `ROADS` and `BOSSES` is a zone".
5. **The one crossing is still one**: a second exit marked `crosses` is refused, as the weather rule
   allows one door; the fixtures that wrote the door in the table mark it on its exit.
6. **The gate's `nameOf` loses its fallback to the id**: an area the atlas does not name throws, as
   the issue asks of whatever fallback `NAMES` left.
7. **The items suite's `UNPLACED`** (the Telstok's lair, owed to #830) is not an area's table, and
   the issue names it neither in its What nor as an exception: it stands, though the issue's grep
   finds it.
8. **A doc's rule says the field; a record keeps the name**: the decisions of #897 and #968 above
   and the area docs' build history name the tables as they stood when each was written.

Decided by the builder for #993, each the owner's to overturn:

1. **An area writes an exit through `anchored`**, which types an exit written by its anchor as the
   exit the join makes of it: `Exit` keeps `tx`, `ty` and `tf` as every reader reads them. Made
   optional, they would have taken a change at 28 places in three files of `src/game` and six of
   `tools/`, the readers the issue keeps as they are.
2. **The join fills each exit in place and keeps its `at`**: whatever holds the exit (its map, a
   `public.ts`, `MAP_DEFS`) reads the same square, so the 33 walkthrough lines read as they did and
   are not touched, and the structure suite holds every exit to an anchor as the game runs.
3. **`anchors` is a record by name**, written after the map's `start`; the typecheck refuses a
   literal that names one twice, as a fixture holds under `@ts-expect-error`, so the join refuses
   the one name it can see twice, `start`.
4. **A name is `from_<the map left>`**, with `_2` for a second square entered from the same map
   (seven, the Foreland's `from_harrow_2` among them), so `from_meridian_camp_2` and
   `from_meridian_camp2` read apart. One is renamed: the Deep Mines' `rungs`, where the way down
   from the first level and the way up from the third both land.
5. **A Rift's way out takes an anchor too** (`out: { to, at }`): each of the five Rifts the areas
   place builds its one exit from it, so they are five of the issue's 175 exits and its grep found
   their `tx:`. The Rift samples' `out` keeps its square, as it keeps the party's facing, which an
   anchor cannot; the Kilns' `TEAR` keeps its own.
6. **A zone map's place is `laid(PLAN, id)`**, from the plan's grid; the Foreland's and Thornmark's
   name their boxes (`laid(PLAN, 'shelf', 'G2')`). A box the grid lacks throws as the area loads.
7. **The fixtures stand in the structure suite**, which holds the grid already, beside its line
   holding every exit of the areas to an anchor: no suite of their own and no snapshot.

Decided by the builder for #994, each the owner's to overturn:

1. **Each map's id is literal where it is declared**, `MapDef<'cairns'>` (191 maps) and
   `Rift<'c5_rift'>` (5), in place of the keyed record: the smaller diff, as the record changes
   every reader of `Area.maps`. The id is `MapDef`'s parameter, not `as const` under
   `satisfies MapDef`: a map's type inferred from its literal would wait on `MapId`, which its exits
   name.
2. **`MapId` is made of each area's `MAPS`**, not of `AREAS`: an area's literal names maps
   (`outside`), so a union made of the areas would wait on itself. `LISTED` fails the typecheck if
   an area's maps are left out of `AreaMaps`, and `NARROW` if the union widens.
3. **A map as played is `PlayedDef`**, whose exits name the outdoors too (`MapDef`'s second
   parameter), and the world's exit as it steps is `Exit<string>`, as it takes a Rift's tear and a
   crossing sold. `MAP_DEFS` is `MapDef<MapId>[]`.
4. **A rift's `to` and `Passage.to` stay strings**: each costs more than a line, as `riftWay` makes
   a tear of any Rift (the samples' too) and `sells` a passage of a crossing's ends, which name
   their places by strings. A Rift's `out.to` takes `MapId`.
5. **A fixture's map goes through `fxMap` or `fxKey`** (`tools/tests/lib.ts`), a string handed on as
   a map's id or key: each map no area has is marked where a suite names it, and so are a map a
   check holds as a string (`denFaults`' map, the outdoors) and a key the game must refuse.
6. **The Rift samples' `until` goes through `wardenFallen`** (`src/game/rifts.ts`), the one
   assertion outside the suites: a sample's id is no map the areas list, and no file of
   `src/content` takes a cast.
7. **A built `seen` or `slain` goes through `mapKey(map, id)`** (`src/game/keys.ts`), which
   `denBurnt` uses; a condition kept in a const takes `satisfies When` (seven).

Decided by the builder for #995, each the owner's to overturn:

1. **Each area declares its flags in a leaf, `flags.ts`**, which `public.ts` gives on and `index.ts`
   puts on `AREA`; the code's six are `src/content/flags.ts`, beside the core items. A leaf, as the
   issue allows: 436 entries would bury `public.ts`'s few, and a file that imports nothing closes no
   loop.
2. **A flag is declared by the area whose `shipped.json` records it**, as the issue rules, where
   another area's `public.ts` spells it too: the six of the Glasswold's quests asked at Cinderport
   are Ashfall's, `q_nest_watch` and `q_salt_done` Sunderwood's, `q_wenna_home` the Foreland's and
   the endings' three Hearth Isle's. `q_road_west`, in two files, is Ashfall's, as the issue gives
   it. No constant moves.
3. **`Flag` is made of each area's `FLAGS` and the core's** (`Declared`), not of `AREAS`, as `MapId`
   is of `MAPS`: an area's literal holds what its fields read. `NARROW` fails if it widens.
4. **A flag two declare is refused twice over**: `ONCE`, `Once<Declared>`, is `true` only while no
   two declarations share a key, else the flag, which the typecheck names; `flagOwners` refuses it
   at load with both areas' names, as `byId` refuses a monster, and there alone a key made at run
   time or an `AREA`'s `flags` beside its `FLAGS`, which the typecheck lets through.
5. **A guild quest's two flags and a hall's fee are `Flag` by assertion** (`src/game/keys.ts`): they
   are made from the content's strings, a quest's id and a hall's name, and the shipped suite holds
   each to its declaration by name. A rank's is typed from `GuildId` and the glove's is a `Flag`.
6. **A fixture's flag goes through `fxFlag`** (`tools/tests/lib.ts`), as a map goes through `fxMap`;
   the smoke's two fixtures, which run in the page and cannot import it, through a helper of their
   own.
7. **`finishedBy` takes a string still** (`src/game/quests.ts`): it looks a flag up, and the world
   map names a gate by the strings it reads off any exit.
8. **The declarations are in the record's order**, as `tools/kit/shipped.ts` sorts each list, so
   each reads against its `shipped.json` line for line; a gloss says what holding the flag means.
9. **`CODE_FLAGS` is the code's declaration** (`tools/kit/shipped.ts`): the central file's six are
   read from `src/content/flags.ts`, where `donations`, `GLOVE_FLAG` and the four ranks were listed.

### 8.3 Pull requests

- A `pull_request` workflow runs the typecheck, the tests, the smoke test and the smoke's crack
  sweep, in jobs of its own (`plan` and `sweep`, #953); all five gate, the sweep skipped only where
  the plan sweeps no map. The smoke test and the sweep need Playwright (a pinned dev dependency)
  and Chromium on the runner; the workflow is `.github/workflows/checks.yml` (#27).
- A pull request's tests job runs the gate only for the areas its diff reaches and every other
  suite whole; the walkthroughs run for those areas and, where more than a comment changed, for all
  (#955). Everything runs on main: `pages.yml`'s `npm test` on every push, a CI cycle after the
  merge and before the deploy; the Checks workflow every day at 03:17 UTC (`schedule:`); and a run
  started by hand, a release's. A flag spelt in two areas, or a crossing that lands on another
  area's map, the gate's narrowing cannot see until `A7` and `A9`: those runs catch it.
- Main has no branch protection, by the owner's word of 18 October 2026: "We are not doing branch
  protection." Nothing in the plan needs a GitHub setting. Two green branches that are red together
  are kept from merging by a procedure, now the only safeguard: the orchestrating session merges one
  pull request at a time, brings each branch up to date with main first and waits for CI to be green
  on that new head. A branch whose checks ran on an older base is not merged on them. As a pull
  request's tests run only what its diff reaches (#955), the session reads the latest run of
  `pages.yml` on main and the latest nightly before it merges (`gh run list --workflow
  pages.yml -L 1`, `gh run list --workflow checks.yml --event schedule -L 1`); a red one stops the
  merges until it is mended.
- Small pull requests: a zone map, a dungeon level, a monster family, a town's interiors; not an
  area at once.
- Deploy from a tag once an area has been played, rather than on every push, so players never get
  half an area. (Or keep deploying on every push, and accept that.)

### 8.4 CLAUDE.md

`CLAUDE.md` at the root (#28) is the first thing every session reads. It says: read DESIGN.md, then
this, then the area's doc; the lanes; the recipe; run `npm run check` before pushing; the voice
(terse, two lines to an event, British spelling, the secret found and never told); commit subjects
as the history writes them ("Give the ogre a stoop, a face and a club that is a tree limb");
`src/lib/` is vendored, and fixed upstream.

---

## 9. Order of work

**Phase 0: foundations.** Nothing new goes into the world until these are in; they are what lets
the rest run in parallel.

1. The pull request workflow and branch protection (not done: the owner's word of 18 October 2026),
   on checks that cannot pass by chance: the smoke test pins its seed, and its clear noon asks for
   no fog (#23).
2. CLAUDE.md.
3. The layout refactor (§6), alone.
4. The contract's checks (§5), each run first against today's content; what they find is fixed, or
   waived by the owner (the Foreland's two unhinted secrets are given hints, #51). The gate check is
   the exception: its starting thresholds fail from Thornmark on (§2.2), which is the pilot's work,
   not a waiver, and on the Foreland too, which the pilot settles by retuning or by moving them
   (#38).
5. The scaffold and contact-sheet tools, and the hills and farmland the scaffold cuts to (#44); the
   bot of `tools/gate.ts` made into the gate check.
6. DESIGN.md §4, §12 and §13 brought into line with §2: the scale, the tiers, content as TypeScript.
   §9 already follows the one road and its one quest.

**Phase 1: the road, act by act.** Numbered 1.x by the owner, an epic to each part (#151, call
11). Each part holds the systems its act waits on, built one at a time in the systems lane before
its areas need them (§7), and then its areas, no more than two in flight, each to its definition
of done (§4).

**1.1, the pilot, finishing M1** (#26). First the road that exists, made to follow §2.2: the flag
comes off the pass and Hale's checkpoint becomes a warning; Thornmark, the Grove Roots and the Cut
Stone are retuned until the gate check holds at their floors; the tests that pin the flag gate (the
movement and outdoors suites, and the smoke test's walk through the pass) follow it; The Quiet Farm
and The Grove Stone become the one quest's first chapters; the three hand-ins take their items at
the first meeting. Then the rest of the Foreland and Thornmark through the new pipeline: the first
two boxes of the Downs, west of the Foreland where the land runs on and the world now ends (F2 and
F3, the road to Gullwick; band 2–5, docs/areas/shelf.md), then the Deepthorn's core; the Foreland
to its edges (#65) and Thornmark to its (#208). Meanwhile, in the systems lane, what M1 still
lacks: the first guilds (DESIGN.md §8). The terrain the pilot asks for comes in Phase 0 (#44).
Measure how long a zone map takes and what the owner still finds by hand, and tune the thresholds.

**1.2, Act II, the Salt Road** (#149). First its systems (#150): the level cap past 10, with the xp
budget (§5.2), the kill multiplier and the first prestiges (#19); what monsters can do, ranks and
morale, casting, drain and elements (MONSTERS.md §3.3); the ground underfoot, salt, tidal ground and
heather, dead wood, crystal and the chasm; coaches and boats, and the crossing to Wrackholm; the
Rift generator, for the small Rifts; the danger made legible, the band said on crossing; the log
paged by chapter; the Hearth brightening with each Stone. Then Saltreach (#153), Wrackholm (#154)
and Sunderwood (#155) in road order, each from its doc in docs/areas/.

**1.3, Act III, the Deep Script** (#431). First its systems (#432): the curve's rows and the gear
steps at Anvilhall and Rime Lodge; ash, ice and pine underfoot; regeneration, curse and calls;
Kiln-script and Linguist, the first secondary skill; Kilnhaven's ferry and ship and the drove road's
coach; the Anvil Stone for the Hearth. Then the Kilns (#436), Cairnmoor (#437) and Rimewater (#438)
in road order, each from its doc in docs/areas/, with the owner's calls written in (#434) and the
areas named (#435). The act spends one story lock, the Sleepers' Bay's door (§2.3).

**1.4, Act IV, Beyond the Sky** (#441). First its systems (#442): the curve's rows and the gear step
at Cinderport; cliffs and peaks with the road through them, steppe, dunes, vines and the volcano; a
group that talks before it fights, for the giants' toll; sweep, with fire for the drakes; stone and
its cure; the ship to Cinderport, the Rider's ride and the last crossing; the Ember Stone for the
Hearth and the sentries after. Then the Whitespine (#445), Ashfall (#446) and the Wold (#447), with
their calls (#443) and names (#444); Meridian Camp and the Dead-Drop (#22) and the eight third
prestiges whose trainers live in the act's country (#448). 1.4 ends M2.

**1.5, Act V and the subplots** (#742; M3; docs/areas/hearth_isle.md, #739). First its systems
(#743), eight issues: the curve's last row, ending at the cap, and the trainers' ceiling with it;
the gear's last rung at 28, found and never sold; a group that is gone once a flag holds, standing
or not; the Core's clock and `obeys`; `Exit.lifts` and `Exit.after`; the endings, their screen and
the Hearth's three states on the title, in the night sky and in the almanac; a save upgrade for the
Peak Stone; the gate bot and the harness run to 32 with the clock played. Then Hearth Isle in road
order (#744), H6 to the Heart, with its chapter, its side quests (#56's 56 to 61 and 64) and the
Cleric's third at Anchorhold (#763), its calls and names written in. Then the Council of Helmstow
(#764), which ends the Empty Throne, and the road behind in one issue (#765), as #449 was Act IV's.
The act spends one story lock, the core's door (§2.3). The skill tiers are built (#852), and the two
Masters on the road are placed by #858 and #859; the Sorcerer's third came into the act, at the
Glass's edge on the Wold (#807). 1.5 ends M3
and is built on main: Act V merged on 15 October 2026. The owner's own playthrough is what remains
before v1 is called done (README.md).

**1.6, the reach** (DESIGN.md §9), with #56's 62 and 63. Post-v1: not filed; v1 ships without it.
Optional by design, so it comes last. Decided by the owner's delegate, 16 October 2026 (#18).

**The finishing touches** (#54) run from 16 October 2026, unparked by the owner's delegate: the
phases are built, and the reach is no part of what they wait on. They hold the touches that make
the built game better and that nothing else waits on: line of sight (#53), the Tide Stone's plinth
(#582), the guilds' and temples' quest pay booked where it is paid (#728), a camp-rest hook (#730),
Act IV's stale and unfinished lines (#735) and the monastery drawn tall and the tents as tents
(#736). The calls that settled the rest are written into the docs: the husks stay (#733), the days
that end in a fight broken off are a figure (#734), E7 is left cut (#737) and Ashfall's 27.4 stands
(#738); an ally in a fight, a vigil held through a night and a withering seedling are cut (#729,
#731, #732). The six touches are built on main. Five more, filed under #54 at #18's close, are
approved at the owner's word of 18 October 2026: #889 (the automap's square two away mapped through
a wall or a secret door outdoors in clear weather; its pull request is #903), #890 (the
Cartographers' work row in the halls' first menu; merged in #894), #891 and #892 (closed by #901,
the rulings standing: the gate's company stays plain and the seven calls of #18 stand) and #893 (why
the pilot's Thornmark run takes a quarter longer).

**The bounds** (#828) run from 17 October 2026, at the owner's word: no company meets the pink.
First the world's end drawn as the atlas paints it, shut as before (#829); then the systems the
bounds' content waits on, an enclave held to its own band beside the road (#845) and the artifacts'
powers (#847), with the eight artifacts designed alongside (#846); and beside them the land the maps
lie open to, built as country off the quest, area by area, two in flight (#830 to #837). Each area takes an
enclave or two a band or two over its zone's and an artifact in a lair at the cap. E7 is built after
all (#833), the owner's call over #737's. The reach stays closed for 1.6. Approved and unparked on
18 October 2026 at the owner's word; the eight areas run two in flight, Saltreach first and the
Foreland last, each a brief, its boxes one or two to a pull request, its enclave, then its lair once
#847 and the guardian's drawing are in; #848 runs beside them from the same day, its moves that
touch every area landing in two short windows between area pull requests.

Decided by the owner's delegate for #848, each the owner's to overturn:

1. **The bounds start at once** (18 October 2026), in the shape that exists; #848 runs beside them.
2. **The moves that touch every area land in two windows,** each a gap of about two hours with no
   area pull request open; a box built before one adds its rows as today and the move carries them.
3. **The layers check lands early as a ratchet:** today's crossings listed, only ever shrinking.
4. **The per-area rows move by one script,** not twelve pull requests.

Decided by the owner's delegate for #828, each the owner's to overturn:

1. **The order of the bounds** (18 October 2026): the fill done (#829, built in #849); the systems
   #845 and #846 at once and #847 in two halves; the areas beside them from the start, Saltreach
   first, each its country, its enclave once #845 is in and its lair once #847 is.
2. **Five power kinds and no sixth:** a stat raised while borne, an element the blows carry, a spell
   cast so many times a day, regeneration, a ward against one condition.
3. **One power to each artifact,** each kind used once or twice across the eight.
4. **A rumour marks nothing on the world map:** each artifact is first heard from a person of its
   own area, who hints and never names where it lies.
5. **A guardian is a new kind in an existing family where one fits,** at most two new families
   across the eight.

---

## 10. What to watch

| | Now (18 October 2026) | Aim |
|---|---|---|
| Defects the owner finds by hand | 4 over the slice, not recounted since; the owner's own playthrough of M3 is what remains (README.md) | fewer each area; each one a check |
| Checks that pass or fail by chance | none known: the smoke test plays one seeded world (#23) | none |
| Pull requests that needed main merged in | 4 of the last 6 in September, not recounted since | rare |
| `npm run check` | about 12 to 14 minutes on a four-core container, ending `ALL OK` with nothing owed (#865); each suite alone on 18 October, by the owner's delegate's measure (#848): the gate 310 s and every other suite under 90 s, about 12 minutes in all; in CI on a docs-only change the tests take 5 min 8 s, the smoke 2 min 20 s and the typecheck 19 s (#866); the tests job took 5 min 8 s to 9 min 12 s on the heads of #876 to #885 and #866 (twelve runs on 18 October), and its cap is fifteen for the runner's spread of about two minutes (#873); on a pull request the tests job runs the gate only for the areas its diff reaches and the walkthroughs for those or, where more than a comment changed, all (`TEST_SINCE`, `node tools/changed.ts <base> areas`, #955): 235 s on one comment changed in a Thornmark map (#966) where a whole run took 658 to 669 s that day; every suite runs whole on the nightly (03:17 UTC), on a run started by hand and, in `pages.yml`, on every push to main; a change to the viewport or the smoke sweeps every map, the smoke job then taking 12 to 21 minutes (#876, #878, #879); the runner prints each suite's seconds, all in one process (#895): loaded, on that container shared with other runs on 18 October, the gate 335.5 s, `labels` 104.5, `row` 84.5, the Foreland's walkthrough 33.1, `quests` 27.7, `harness` 27.1, `scaffold` 12.3, `pilot` 8.5 and every other suite under 6, 698.9 s in all, and the full run 33.1 in its own step; in CI, the tests job on #905 that day (8965ac98), the gate 149.4 s (53%), `labels` 37.9, `row` 30.4, `harness` 15.2, `quests` 13.9, the Foreland's walkthrough 8.7, `scaffold` 4.6, `pilot` 4.3 and every other suite under 1.5, 282.8 s in all, and the full run 7.1; the suites run in parallel (#954; `npm test` runs `node tools/test.ts --jobs`), the dear runs a process each and the rest one, as many at a time as the cores, the gate in thirteen parts: in CI, on two runs of a job that ran every suite in one process and then under `--jobs` on one four-core runner, 627 s and 321 s on the head af383ae4 (run 40063123989; `75 runs in 20 processes, 4 at a time on 4 cores, 44.0 s of starts (the longest 2.5 s): the suites' 1221.8 s in 321.0 s`) and 641 s and 322 s on 34c6f193 (run 40077059244; `76 runs in 20 processes, 4 at a time on 4 cores, 46.3 s of starts (the longest 2.7 s): the suites' 1221.8 s in 322.3 s`), 0.51 and 0.50 of the one-process wall where #954 asked at most half, bound by the cores (the suites took about twice their seconds four at a time: 1,221.8 s of work against 627 s and 641 s one at a time) more than by the largest run (`labels`, 162.4 s) or the starts; the tests job took 266 s (`npm test` 256 s) on the first head and 387 s (`npm test` 378 s) on the second, where whole runs in one process took 356 to 669 s that day; on this container, loaded by other runs on 24 October, 341.7 s where one process took 700.9 s (1,297.5 s of suites and 52.8 s of starts over four; the largest run, `labels`, 174.0 s), and narrowed to two areas 490.5 s against 1,709.4 s at a load of 13; the crack sweep's four ways are the `plan` and `sweep` jobs beside the smoke, which runs the rest (`SMOKE_PART=rest`; #953): every map at the head (83ad41a3) is 397,688 views of 188 maps four ways, 353,571 skipped, 34,099 windows and 48,509 painted (the windows flat and 14,410 views with a wall beside the party), one shard of 60,000 pairs; at cd262d6d, 186 maps, that shard took 255 s on this container where the old sweep took 1,871 s (the smoke with it and without, 2,097 s and 226 s), the plan alone 6 s and the smoke without the sweep 236 s; the audit judged the old sweep and the new alike on all 398,281 views at the head, the 397,688 four ways and the ground's samples' 593 one way, as on the 397,025 of 653c8fad, none cracked; the old sweep had run under fog in five regions, 136,076 of those views seen two or three squares deep, where the new sees four on every view | under 3 minutes: full sweeps of what a pull request touches, the rest sampled or on release; the cure, in this order (#848): the gate for the areas a diff reaches, then parallel suites, then the sweep's shards |
| Cracks in the sweep of every map (§5.6) | none; the sweep reads each square as the view draws it, the void as its look (#869) | none |
| Maps inside the density floor (§5.3) | all (`node tools/test.ts density`) | all |
| Areas on the curve (§5.2) | all twelve (`node tools/test.ts curve`); the Kilns and Ashfall pass the lead line and are held where they are built | all |
| Areas whose gate holds (§5.2) | all twelve at their floors and two under, Act I's by the fight and from Saltreach's floor by the day (#851): 81 maps' days and 10 areas' at 29% to 98% of their floors' aims, 29 maps and three areas off their aim; nothing owed, `cairnfield_m8` re-sized (#865) | all |
| Story locks (§2.3) | two of the four: the Sleepers' Bay's door (#440) and the core's (#759) | within the count, each declared with its reason |

Decided by delegate for #808, each the owner's to overturn:

1. **EXPANSION §1 is kept as the record of 25 September**, headed "then" and dated, with a line
   saying where main stands now: the issue's second option. Its figures (1,717 land squares, 33
   monsters) would each need a new definition to be measured again; the README and §10 say where
   main stands.
2. **"Sixty-two side quests" is #56's count** (its sixty-four, less the reach's two), and the README
   says so. The areas' `quests.ts` hold 77 quests: the 62, the ten thirds' quests and five more (the
   Cargo Ledger, the Council of Helmstow, the Empty Throne, the Lost Expedition and the Walk Home).
   The guilds give 22 more, the Salt Compact's among them. The README's list names them.
3. **The pilot is said to do what main does, in four places.** docs/PILOT.md's opening paragraph
   said it plays the one quest from the title to the ending's choice; it now says what it is built
   to do and what it does today (it finishes The Quiet Farm on most seeds and stops lost in
   Thornmark's chapter; the ten chapters after are not reached), and nothing else in that doc is
   touched. DESIGN §12's pilot row and the README's section say the same, and the README's docs list
   adds "how far it gets". No other sentence in the README, DESIGN or EXPANSION says or implies that
   the pilot plays the whole quest (EXPANSION's "pilot" is Phase 1.1's).
4. **DESIGN §6's flee line is corrected** while the delegate's no-round-limit line is added beside
   it: it said flee "always works if the party is faster", and the code gives a chance from 15% to
   90% by speed. The three lines that said no fight runs past fifteen rounds (EXPANSION §5.2 and
   MONSTERS §4.4, twice) now say it is the harness's (`ROUND_CAP`).
5. **The finishing touches' block in EXPANSION §9 gains one sentence**, "The six touches are built
   on main": #53 (#844) was the last.
6. **The owner's "bounds" paragraph in EXPANSION §9 (#849) is not touched.** It says the bounds
   "run from 17 October 2026", names an order and says E7 is built after all (#833); the epic and
   its area issues are labelled parked. The README says what the labels say: approved and labelled
   parked, #845 to #848 not yet approved. The paragraph may want "parked" in it. (The owner
   approved and unparked them all on 18 October 2026: §9 says so now.)
7. **Three lines the issue did not name were stale and are put right or left on record.**
   EXPANSION §2.1's "Coaches and boats as well, later: to be filed" now says built (#164); DESIGN
   §5's price line no longer says "until #19 adds them to the curve's gold": the prices are 1,000
   and 4,000 (`PRESTIGE_PRICES`, `src/game/party.ts`) and the curve does not count them; DESIGN
   §8's "once the skills are built (#18)" is left as it is.

Decided by the owner's delegate for #869, each the owner's to overturn:

1. **The crack sweep is held to the painter, never the painter to the sweep.** Its walls beside the
   party and its view with the hills laid flat read a square as the view draws it (`look ?? cell`),
   and #849's drawing of the void as its look stands. Drawing the ring's mountain as a wall over the
   backdrop was the fallback, had reading the look let an injected crack pass; it did not.
2. **Two cracks were made by hand and each failed the sweep**: one at a map's edge beside the void
   with a look, one in a dungeon wall. The pull request shows how and the failing lines, and
   neither is in the tree.
3. **The check of the world's end stays as it is**: facing it north of the Foreland, the view draws
   the ring's mountain and nothing pink.

Decided by the builder for #869, each the owner's to overturn:

1. **A void drawn as a hill is laid flat with the hills.** Its look's ground is read as grass and
   the square stays the void, so nothing else the view reads of it changes.
2. **Both cracks were made in the painter**, in a scratch copy, not in a hand-made map: a map
   draws no crack the painter does not make. One left out the face of a wall beside the party where
   the square past it is the void with a look; one drew a face of the cellar's north wall three
   pixels short of the face it joins.

Decided by the builder for #953, each the owner's to overturn:

1. **The plan is `tools/kit/sweep.ts` and its command line `tools/sweep.ts`**, where the issue names
   `tools/sweep.ts` for the plan: the layers check lets a suite take `tools/kit/` and not a tool, as
   `tools/kit/lanes.ts` did for #944.
2. **The window's key**: the map's kind; on each of the 35 squares what stands there on the map laid
   flat, and of a face its door, house, wall style, dressing and the features on it; on the 17
   squares past the window that a face reads to join the next, whether one stands. 34,099 windows of
   the 44,117 views kept at the head, where the issue's shorter keys made 16,955 and 20,026.
3. **Alike is where the backdrop shows, not the colours**: the verdict reads the band's mask, where
   the two backdrops differ, and a face's colours follow its square.
4. **The view with its hills is painted where the flat window shows a gap or a wall stands beside
   the party**: the verdict needs a gap in both views, or the edge beside a wall, and nothing else.
5. **`SMOKE_SHARD` deals the windows, each with all its views, and the skipped views by turn**,
   where the issue says every n-th view: a window is painted in one shard alone, and its first
   view, the audit's reference, is in the shard that holds the rest.
6. **One shard for each 60,000 pairs** (`PAIRS_PER_SHARD`): about four minutes at the old sweep's
   slowest rate in CI, 3.5 ms a pair. Every map is one shard, the audit fourteen.
7. **The scene**: in each region the first clear noon with nothing the view washes, found as the end
   of the world's is, and the light of a spell; a view seen short of four squares fails the line.
8. **The one-way sweeps of the rest go through the plan too, and `tools/sweep.ts` and
   `tools/kit/sweep.ts` join `EVERY_MAP`**: a change to the plan sweeps every map, as one to the
   smoke does.
9. **The smoke job's cap is twenty minutes, and each shard's**: its `npm run smoke` takes 118 to
   167 s and a shard about four minutes, the Chromium install up to 694 s.
10. **A change to the painters starts the audit by hand**: it costs fourteen shards and runs on
    release, and the skip rule stands on the painters putting only faces into the band, which no
    run of the plan can see; a pull request that changes `src/ui/viewport.ts` or
    `src/game/ink.ts` starts the Checks workflow by hand on its branch before it merges.

Decided by the owner's delegate for #18, each the owner's to overturn:

1. **The README says where the game stands with #18 finished** (#866): the tiers with their two
   Masters, the twelve skills and the eight found items in v1's list; post-v1 only the reach (with
   its artifacts) and the Stretch; the owed sentence gone, since nothing is owed.
2. **§10's gate row loses its owed line** and says what the gate prints now (#866).

Decided by the builder for #866, each the owner's to overturn:

1. **The older records that name #865 stay as the record of their day:** §5.2's #853 call 1 ("before
   #865") as it was; #854's delegate call 2 and builder call 5 and #851's builder call 3, which would
   now read false, gain #865's outcome in a few words, and DESIGN §5's call 9 for #855 gains "(#861
   placed the first.)". No record is rewritten.
2. **§5.2's measurement of 17 October stays dated:** it held then. §10 gives the gate's figures on
   18 October, `cairnfield_m8` re-sized: the top of the days two under falls from 109% to 98%.
3. **What #18 did not build is said as main stands, owed to nobody:** the chandler's lanterns and
   the beekeeper's honey and salves are not items, so the beekeeper keeps no shop (DESIGN §5).
4. **§7's "a bot that plays as well as the party can" is settled, not owed** (J2), and the three
   touches the same sentence owed are built and said so; §11's bot risk names the gate's plainer bot
   as the decision it is.
5. **Stale lines outside #18's own are put right where this sweep met them:** DESIGN §8's "once the
   skills are built (#18)", which #808's call 7 left; SLICE's tier-7 hall (the Lodge's sells 7), its
   clears short of the curve (both give it now), its design-only list (the prestiges, the Compact's
   halls, the succession, the Salt Compact and the Lost Expedition are built) and the Meridian
   volumes; §5.6's one-way sweep (the keep and the ground's samples too); PILOT's omniscient fall
   and the fair pilot's count. Two code comments stay as their lanes left them.
6. **The README names the found items by kind;** DESIGN §5 and §6 and SLICE name each.
7. **PILOT's Thornmark row is measured again on main** (`FULLRUN=thornmark`, 18 October), the
   omniscient run with it, and the notes go with the row; the run of all areas stays 4473dac1's.

Decided by the builder for #902, each the owner's to overturn:

1. **§1 says main has no branch protection and does not only lose its clause:** "main requires
   them" alone would claim what main lacks. The README's "Deploying" sentence ("Once the owner
   protects main ...") is the same claim and says §8.3's procedure; the Work does not name it.
2. **#808's call 6 stays as the record of its day** and gains a clause with the outcome, as #866's
   first call keeps the records that named #865: no record is rewritten.
3. **§10's suites' seconds are the ruling's figures** (the gate 310 s, the rest under 90 s) until
   #895 prints them from the runner.
4. **The opening paragraph's "17 October" is put right to "18 October":** §10 has been dated 18
   October since #887.

Decided by the builder for #895, each the owner's to overturn:

1. **What a suite prints itself waits for `--list` too**, not only its `ok` lines: the gate's `n/a`
   lines and its block off their aim (89 lines), the quests' `info`, the pillars' counts and the
   art's notes are 278 lines of a green run, which would then not be under 300. The off-aim block
   alone would bring a green run to 271, too near 300 for the sub-checks to come (`H6`). The runner
   holds the lines back while the suite runs, so no suite's file changes; a line that starts `FAIL:`
   or `owed:` still prints, and at a suite's first failure what it held prints, in order, and the
   rest as it comes. A run that exits inside a suite prints what that suite held.
2. **A suite's name prints as it starts**, as under `--list`, and its line of seconds at its end: a
   run that dies inside a suite (a crash, an await that never settles, the tests job's timeout)
   names it last, with nothing to catch. A green run is two lines a suite, 182 in all; naming it
   from the exit and the signals would keep 123 but name nothing on a kill outright.
3. **The seconds run from a suite's load to its end, in one process:** each counts the modules no
   suite before it loaded, and none counts the runner's start. The issue's figures, each suite
   alone, each paid its own.
4. **The full run's job in CI lists every line** (`--list`), as its summary is built from the run's
   `ok` and `note` lines. The issue says CI needs nothing, which holds for the three jobs that gate.
5. **`package.json` does not change:** quiet is the runner's default, and `TEST_LIST=1` reaches each
   of `npm test`'s three steps, where `npm test -- --list` would reach only the last.
6. **The runner's own check reads a listed run where it read `ok` lines**, and gains seven checks of
   the new output, each suite's line held to its own counts: a fixture suite, `slow`, takes 0.3 s and
   prints a line of its own, `later` one before its failure, and `stuck`, in a folder of its own as
   it ends the run, awaits what never settles. The suites' order is read from their lines of seconds.
7. **docs/PILOT.md says the survival sweep's and the full run's lines print under `--list` or once
   the suite fails**: the issue names SLICE and §10 only, and PILOT would otherwise say what main no
   longer does.

Decided by the builder for #954, each the owner's to overturn:

1. **The gate's parts** are `fixed` and one to each area the run asks for, Saltreach's with the
   enclave's fixture. Each lists its own figures off their aim, a block to an area where one of 99
   closed the gate, and holds the owed entries its names begin, the fixed part those that name no
   area: an owed check to each part, thirteen where there was one.
2. **A suite has parts where its file exports `parts()`**, read from its text before it loads, so
   planning loads no other suite; a suite runs as its parts in one process too, so the lines and the
   table are the same either way.
3. **The small runs are packed:** the starts came to 52.8 s in 20 processes on this container,
   loaded, a sixth of the wall even so, where a process to each of the 75 runs would start 55 more.
   Under `--jobs N` the runs not in `DEAR` share a process in the run's order, started first, as it
   holds the runs that print first and is the third dearest job; `--jobs 1` runs every run alone,
   which is the epic's "each suite passes alone".
4. **The starts print as their sum and the longest** in the line of the wall, not a line each; that
   line prints in one process too, so the two runs can be set side by side, and `--shuffle` prints
   its seed first and there.
5. **What a run writes is caught in its process** and sent with its record, so each run of the
   packed process prints at its own turn; what a process writes outside a run, or as it dies, prints
   with its last run or the run it died in.
6. **A process that dies** fails the run in flight (`died, exit 13`, or `killed by` its signal) and
   marks those after it in that process `never ran`; the run goes on to its summary. One that
   exits with a code its records do not account for fails its last run (`died after its end`).
7. **`DEAR` is CI's table of 23 October and the gate's areas**, the dearest first, the harness third
   as a process of one worker; `TEST_DEAR=a,b` replaces it, as the runner's own check does to put
   fixture suites in processes of their own. That check runs its runs side by side, as many as the
   cores: 22 s here with its eleven new runs.

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
  low. The gate's does so by decision (§5.2, J2): its company buys nothing optional and its bot
  never blesses, sleeps, drinks or flees, so a company that buys the tiers, the skills or the items
  has an easier road than measured. Let the owner's play overrule it.
- **One quest, one hotspot.** A quest from level 1 to the cap would be a file every area edits; it
  is joined from chapters instead (§5.8).
- **Scale creep.** §2.1 is the target; land past it waits in the void.
