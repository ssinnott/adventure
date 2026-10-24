# Building out Caldera: the history

> History, not kept up to date: §1, §2, §6, §7, §8.4, §9, §10 and §11 of `docs/EXPANSION.md` as
> they stood when #1024 cut it, whole and in order under their own numbers and headings, with their
> "Decided by" lists; §8's heading stands again above §8.4. Their links are still written from
> `docs/`. The working rules, §3 to §5 and §8.1 to §8.3, are [EXPANSION.md](../EXPANSION.md), their
> decisions [decisions.md](../decisions.md); the epics hold the order of work.

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

**Where parallel work collides.** The most-edited files are the slice's doc (17 commits; since
#1023 `docs/archive/SLICE-history.md`), `tools/test.ts` (14), `README.md` (14), `tools/smoke.ts`
(11), `src/game/monsters.ts` (10) and `src/ui/sprites.ts` (10). Adding an area edits `MAP_DEFS`,
`MONSTERS`, `ITEMS`, the `MonsterSprite`, `Interior` and `RegionId` unions, `SCENES`, `CLIMATES`,
the atlas, the quest list, the tests, the slice's doc and the README. Three of the last six pull
requests needed main merged into them before they could land.

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
(docs/areas/hearth.md, #739, call 1): the road's second of four.

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
- SYSTEMS.md (#1023) keeps the systems and points to the area docs. Its Checks row, one table
  cell every pull request rewrites, gives way to the test output, which already reads as the list.
  The README lists folders, not maps.

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
(`docs/archive/SLICE-history.md`); and the bot is settled (§5.2, J2): the game's blesses, sleeps and
drinks from level 11, and the gate's plays plainer than a player.

Rifts are where DESIGN.md itself asks for generated content: eight 12×12 templates, seeded, a pure
function of state and seed. Build the generator early, in the systems lane, and let generation scale
there, where repetition is the design, rather than on the map.

---

## 8. How the work is split

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

**1.5, Act V and the subplots** (#742; M3; docs/areas/hearth.md, #739). First its systems
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
