# Building out Caldera: more content, the same bar

How the rest of the world gets built: what v1 is, how the work is split so that many sessions can
build at once without colliding, and the checks that hold every map, monster and quest to the
standard of the slice. Read DESIGN.md for the why and SLICE.md for what exists. The figures of §1
are measured on main at `b92a412` (25 September 2026); §10 holds where main stands on 17 October.

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
opened. Every pull request now runs the typecheck, the tests and the smoke test (#27); main
requires them once the owner turns branch protection on.

**Where parallel work collides.** The most-edited files are `docs/SLICE.md` (17 commits),
`tools/test.ts` (14), `README.md` (14), `tools/smoke.ts` (11), `src/game/monsters.ts` (10) and
`src/ui/sprites.ts` (10). Adding an area edits `MAP_DEFS`, `MONSTERS`, `ITEMS`, the `MonsterSprite`,
`Interior` and `RegionId` unions, `SCENES`, `FAMILY`, `CLIMATES`, the atlas, the quest list, the
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
  has no `respawn` (DESIGN.md §6). Only the last is checked today.
- **Encounter shape.** Respawns in the range in use, 720 to 2880 minutes. At most 12 monsters to a
  group is held already: a map with more does not load.

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
- chest and drop items sit in the band's price window, so a band 1–4 cellar holds no plate.

A map whose floor is over its area's band is a later area's country reached from it, as the
Dead-Drop's stair under the Tide Ship is, and pays nothing there. The deepest levels, which the road
never needs, may pay outside any area's budget instead: the area lists them in `outside`
(`content/area.ts`), and only maps past its band may be listed. Each is held to its own band and to
the window of the last area on the road whose floor is at or under its own; no area's clear counts
its xp or gold, which the curve prints as a figure; and the gate judges it at its own floor, out of
the area's pools. Meridian Camp's third level and the Dead-Drop's three are planned so.

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
next floor. Two built areas pass that line and are named in `OVER_ROAD` (`tools/tests/curve.ts`),
each held at the level it leaves as built so that neither grows unnoticed: the Kilns at 19.3, their
bosses paying the line's, and Ashfall at 27.4, for the Stone, the rungs, the quests, the sentries
and the country behind the road. Decided by the owner's delegate, 16 October 2026 (#738): accepted
as built, the Wold taking the lead back and leaving a company at 27.9, a tenth under the Hearth's
floor. Walked in road order, Act III ends 0.8 over the road at three quarters cleared and 1.4 at a
full clear; Act IV ends 0.6 and 1.3 over, Act II's own areas 0.5 to 0.8 and 1.2 to 1.6.

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

The gear ladder (`GEAR`, `tools/harness.ts`) is what a company has in hand by a level, and the
harness and the gate dress their companies by it. Act I's: Mottram's by 3, the Downs' finds by 5,
Thornmark's Armoury by 8, its chests' plus by 9 and the Deepthorn's +2s by 10. Act II's (#399):
Saltmouth's armourer by 11, Saltreach's and Wrackholm's boxes' plus by 13, Lantern Watch's stores
by 14 and the Sunder's plus by 16. Act III's (#535): Anvilhall's forge by 17, the Kilns' and
Cairnmoor's boxes' plus by 19, Rime Lodge's furrier by 21 and Rimewater's plus by 22. Act IV's, one
step (#542): Cinderport's armourer by 25. Act V's, the last (#746): the Hand's steel by 28, found on
Hearth Isle and never sold. Each rung betters the last for every class, each find and ware inside its
area's window; past the top, gear grows only in the harness's what-if.

Nor does the gate's company learn a secondary skill (DESIGN.md §5): Arms Master's first round and
the two senses go unmeasured, so a company that buys one is stronger than the gate measured it, the
safe side. Decided by the owner's delegate for #18 (#856), the owner's to overturn. It is born to
three that touch no fight: its elf and gnome to Perception, its ranger to Pathfinder and its thief
to Lockpick (#857).

The gate, checked with the bot of `tools/gate.ts`. Each figure below is its **aim**, and each has a
**limit** beyond it (#273): inside its aim a figure passes; between its aim and its limit it passes,
and the check lists it as off its aim; past its limit it fails, and only then is it owed. The
limits, weighed by the pilot on every box of the Downs and left as they were until the owner's own
play says otherwise (#47, docs/areas/shelf.md §8): 80% won at the floor, 90% two under, the road
walked 65% of the time, a boss 20% to 80% at its floor and 75% two above or at the cap, 4 to 10
fights to a rest and the warning's nearest groups ten points under the median.

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
  (`OFF_LINE`, `tools/tests/harness.ts`).
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
   before #865. `ANSWER` stays.
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
weighed the tiers and the bots' three and kept them off (J2, above). Under `RULES.tiers`
(`--tiers`) `companyAt` takes its tiers after its
prestiges: Expert at 13 and Master at 25 on each line its class takes, a fighter's arms, a caster's
magic and a hybrid's both. `RULES.bot` (`--bot bless,sleep,drink`) hands the bots their options,
the thrifty one's in the harness's fights and the gate's in its own. Beside the premade six stands
a company of the four newer classes, `newerCompany`: a barbarian, a monk and a paladin in front, a
bard, a druid and a sorcerer behind, trained, dressed, prestiged and tiered as the six are. The
harness suite holds it to the line at 12, 20, 28 and 32 against each role's standard encounter, on
100 seeds: its fights to a rest inside `GATE.perRest`'s limit and its fights from fresh won at the
floor's limit, 80%; `--company newer` plays it by hand. The gate judges one company, the premade
six: a second would double its fights in the slowest of CI's jobs. On 17 October 2026 the newer
company stands inside every limit and wins every fight from fresh, off its aim on five lines: the
archer at 12 (9.5 to a rest, 7 asked), the controller at 28 (12.1 of 11) and the controller, the
armoured and the elite at 32 (13.6, 13.2 and 13.4 of 12).

Decided by the owner's delegate for #18, each the owner's to overturn:

1. **The company's tiers behind `RULES.tiers`** (`--tiers`): `companyAt` dresses them after
   `prestige(p)`, Expert from 13 and Master from 25 by class line; the cache key counts them.
2. **The bots' option plumbed:** `--bot bless,sleep,drink` sets `RULES.bot`, handed to `botTurn`
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
4. **`--company` is a what-if too** (`RULES.company`), so `--calibrate --write` refuses under it as
   under the rest; the refusal names what is set (`whatIfs`).
5. **The gate's bot takes `RULES.bot` in tools/gate.ts's own `gateTurn`,** which every gate fight
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
3. **The defaults stay off:** `RULES.tiers` and `RULES.bot` are off in the gate and the harness;
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
   set off the line (`OFF_LINE`), stand, and the eight bounds areas (#830 to #837) meet the gate as it is.
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

- `content/shipped.json` lists every id a save can hold: maps, feature and group ids, flags, items,
  door squares, zone placements. A test fails when something in it has gone or moved, unless the
  change bumps `SAVE_VERSION` with an upgrade, the way version 1 saves were brought to 2.
- New content only adds.

### 5.6 Art

- **One silhouette.** Each sprite kind, drawn at combat size, is one connected piece of ink (above
  an alpha threshold, ignoring specks), apart from parts it declares detached: glows, sparks,
  something thrown. This is #7 as a check, in `tools/smoke.ts`, which declares the parts.
- **No cracks.** The per-square crack sweep runs all four ways on every map a pull request changes,
  and one way on the cellar, Helmstow, its keep and the ground's samples (`tools/grounds.ts`); the
  rest are swept on release, a run of the checks started by hand (`tools/smoke.ts`,
  `tools/changed.ts`).
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
2. **Scaffold.** Every outdoor map is one box of the grid the Foreland and Thornmark sit on: 32
   squares a side, its corner at x = 8 + 32i and y = −2 + 32j, cut to the world at its edges, and
   named as the old maps were, by its column's letter and its row's number (the Foreland is G2). A
   map's place is its box, so what is not built is always whole boxes, and no area leaves another a
   strip no map fits. `tools/scaffold.ts <zone> <x> <y>`, built in Phase 0, cuts the atlas's
   terrain for a box into a draft map, so the land walked matches the land painted. A prototype,
   tried on the Downs west of the Foreland, gave in a second a wood, the hills and the road, and 14
   of its 32 rows nothing but grass: the part to be authored.
3. **Author**: landmarks, features, groups, the secret, the ways in and out; dress the terrain.
4. **Check**: `npm run check`, then the contact sheet.
5. **Review**: a pull request, CI green, the owner's look at the sheet, merge.

A monster or an interior goes the same way: a brief, the drawing, the gallery or interiors render,
the checks, the sheet.

An area's dungeons may exit only to its own region's maps, or to the outdoors once its zone is laid,
so its zone map lands with or before its first dungeon (`tools/tests/weather.ts:125` holds it).

### 8.3 Pull requests

- A `pull_request` workflow runs the typecheck, the tests and the smoke test. The smoke test needs
  Playwright and Chromium on the runner; Playwright is a pinned dev dependency, and the workflow is
  `.github/workflows/checks.yml` (#27). Branch protection requires the workflow, and requires a branch to
  be up to date with main (or a merge queue): that is what catches two green branches that are red
  together.
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

1. The pull request workflow and branch protection, on checks that cannot pass by chance: the smoke
   test pins its seed, and its clear noon asks for no fog (#23).
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
#731, #732). The six touches are built on main.

**The bounds** (#828) run from 17 October 2026, at the owner's word: no company meets the pink.
First the world's end drawn as the atlas paints it, shut as before (#829); then the systems the
bounds' content waits on, an enclave held to its own band beside the road (#845) and the artifacts'
powers (#847), with the eight artifacts designed alongside (#846); then the land the maps lie open
to, built as country off the quest, area by area, two in flight (#830 to #837). Each area takes an
enclave or two a band or two over its zone's and an artifact in a lair at the cap. E7 is built after
all (#833), the owner's call over #737's. The reach stays closed for 1.6.

---

## 10. What to watch

| | Now (18 October 2026) | Aim |
|---|---|---|
| Defects the owner finds by hand | 4 over the slice, not recounted since; the owner's own playthrough of M3 is what remains (README.md) | fewer each area; each one a check |
| Checks that pass or fail by chance | none known: the smoke test plays one seeded world (#23) | none |
| Pull requests that needed main merged in | 4 of the last 6 in September, not recounted since | rare |
| `npm run check` | about 12 to 14 minutes on a four-core container, ending `ALL OK` with nothing owed (#865); in CI on a docs-only change the tests take 5 min 8 s, the smoke 2 min 20 s and the typecheck 19 s (#866); the tests job took 5 min 8 s to 9 min 12 s on the heads of #876 to #885 and #866 (twelve runs on 18 October), and its cap is fifteen for the runner's spread of about two minutes (#873); a change to the viewport or the smoke sweeps every map, the smoke job then taking 12 to 21 minutes (#876, #878, #879); the runner prints each suite's seconds (#895), and on 18 October, on that container shared with other runs, they were the gate 335.5 s, `labels` 104.5, `row` 84.5, the Foreland's walkthrough 33.1, `quests` 27.7, `harness` 27.1, `scaffold` 12.3, `pilot` 8.5 and every other suite under 6, 698.9 s in all, and the full run 33.1 in its own step | under 3 minutes: full sweeps of what a pull request touches, the rest sampled or on release; the cure is parallel suites (#848) |
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
   parked, #845 to #848 not yet approved. The paragraph may want "parked" in it.
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

Decided by the builder for #895, each the owner's to overturn:

1. **What a suite prints itself waits for `--list` too**, not only its `ok` lines: the gate's `n/a`
   lines, the quests' `info`, the pillars' counts and the art's notes are 278 lines of a green run,
   which would then not be under 300. The runner holds them back while the suite runs, so no suite's
   file changes; a line that starts `FAIL:` or `owed:` still prints.
2. **A suite's name prints above its first failure or owed line**, not before it starts: the line of
   its seconds names it, so a green run is a line a suite. Under `--list` it prints first, as before.
3. **The seconds run from a suite's load to its end, in one process:** each counts the modules no
   suite before it loaded, and none counts the runner's start. The issue's figures, each suite
   alone, each paid its own.
4. **The full run's job in CI lists every line** (`--list`), as its summary is built from the run's
   `ok` and `note` lines. The issue says CI needs nothing, which holds for the three jobs that gate.
5. **`package.json` does not change:** quiet is the runner's default, and `TEST_LIST=1` reaches each
   of `npm test`'s three steps, where `npm test -- --list` would reach only the last.
6. **The runner's own check reads a listed run where it read `ok` lines**, and gains six checks of
   the new output, with a fixture suite, `slow`, that takes 0.3 s and prints a line of its own.
7. **docs/PILOT.md says the survival sweep's and the full run's lines print under `--list`**: the
   issue names SLICE and §10 only, and PILOT would otherwise say what main no longer does.

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
