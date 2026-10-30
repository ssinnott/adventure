# Building out Caldera: more content, the same bar

How the rest of the world gets built: what v1 is, how the work is split so that many sessions can
build at once without colliding, and the checks that hold every map, monster and quest to the
standard of the slice. Read DESIGN.md for the why and SYSTEMS.md for what exists. The figures of §1
are measured on main at `b92a412` (25 September 2026); §10 holds where main stands on 18 October.
§1, §2, §6, §7, §8.4, §9, §10 and §11 are in archive/EXPANSION-history.md, under their numbers.

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
  either stands in `src/content/areas/<area>/checks.ts` (§8.2).

Its decisions: decisions.md.

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
  artifact, which no window holds, is excepted by its mark alone (#847's list).

A map whose floor is over its area's band is a later area's country reached from it, as the
Dead-Drop's stair under the Tide Ship is, and pays nothing there. The deepest levels, which the road
never needs, may pay outside any area's budget instead: the area lists them in `outside`
(`content/area.ts`), and only maps past its band may be listed. Each is held to its own band and to
the window of the last area on the road whose floor is at or under its own; no area's clear counts
its xp or gold, which the curve prints as a figure; and the gate judges it at its own floor, out of
the area's pools. Meridian Camp's third level and the Dead-Drop's three are planned so.

An enclave is a place of its own beside the road (#845): a dungeon entered from a box (a hollow, a
cave, a ruin), declared on its map (`enclave` in `game/mapdef.ts`), held to its own band, over its
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

A kill pays each member by the monster's level against theirs, its xp times `KILL_PAY`'s multiple
for the gap (`src/game/party/tables.ts`). Simulated from Saltreach on, that kept companies that
clear anything from 65% of each area to all of it within about a level of the road, where fixed xp
left a full clear nearly four levels over by the Glasswold. Each town's trainers teach to its band's
top plus one, and never past the cap (Hearth Isle's camp teaches to 32, #739, call 4). Gold and loot
stay fixed, so a full clear still pays, in gear, gold and secrets.

So an area may give more than its ask (#634): paid by level, a lead does not build up, for the next
area takes it back. What the curve holds is the lead itself: a company of six entering an area at
its floor and clearing three quarters of it, paid by level, leaves it no more than a level over the
next floor. Two built areas pass that line and each holds its lead in
`src/content/areas/<area>/checks.ts` (`overRoad`, `tools/tests/curve.ts`), at the level it leaves as
built so that neither grows unnoticed: the Kilns at 19.5, their bosses paying the line's, and
Ashfall at 27.4, for the Stone, the rungs, the quests, the sentries and the country behind the road.
Decided by the owner's delegate, 16 October 2026 (#738): accepted as built, the Wold taking the lead
back and leaving a company at 27.9, a tenth under the Hearth's floor. Walked in road order, Act III
ends 0.8 over the road at three quarters cleared and 1.4 at a full clear; Act IV ends 0.6 and 1.3
over, Act II's own areas 0.5 to 0.8 and 1.2 to 1.6.

Its first rows are the slice's own figures from its doc (`docs/archive/SLICE-history.md`): level 2
from the Foreland and the cellar, level 4 with Brandy Hole, level 9 from one clear of everything
and about 8,400 gold for six members from 5 to 10. Act I falls short of the budget:
three quarters of it should reach 10, where a clear of everything reaches 9. The maps have grown
since: summed at ×1, one clear of Act I is worth 19,957 xp a member, level 12; paid by level in road
order (#159), 15,292, level 10 and three quarters of the way to 11, and no box cleared whole is
swept again: it stays empty (DESIGN §6). Act II's three rows came
before their maps, each owed to the issue that builds its area (#159), and Act III's and Act IV's
three the same way (#535, #542); each row's band and price window are in `CURVE` alone.

The gear ladder (`GEAR`, `tools/kit/company.ts`, made from each area's rungs in
`src/content/areas/<area>/checks.ts`) is what a company has in hand by a level, and the harness and
the gate dress their companies by it. Act I's: Mottram's by 3, the Downs' finds by 5, Thornmark's
Armoury by 8, its chests' plus by 9 and the Deepthorn's +2s by 10. Act II's (#399): Saltmouth's
armourer by 11, Saltreach's and Wrackholm's boxes' plus by 13, Lantern Watch's stores by 14 and the
Sunder's plus by 16. Act III's (#535): Anvilhall's forge by 17, the Kilns' and Cairnmoor's boxes'
plus by 19, Rime Lodge's furrier by 21 and Rimewater's plus by 22. Act IV's, one step (#542):
Cinderport's armourer by 25. Act V's, the last (#746): the Hand's steel by 28, found on Hearth Isle
and never sold. Each rung betters the last for every class, each find and ware inside its area's
window; past the top, gear grows only in the harness's what-ifs, the bounds' artifacts among them
(`--artifacts`, #847).

Nor does the gate's company learn a secondary skill (DESIGN.md §5): Arms Master's rounds and
the two senses go unmeasured, so a company that buys one is stronger than the gate measured it, the
safe side. Decided by the owner's delegate for #18 (#856), the owner's to overturn. It is born to
three that touch no fight: its elf and gnome to Perception, its ranger to Pathfinder and its thief
to Lockpick (#857).

The gate, checked with the bot of `tools/kit/fight.ts` (`gateTurn`). Each figure
below is its **aim**, and each has a **limit** beyond it (#273): inside its aim a
figure passes; between its aim and its limit it passes, and the check lists it as off
its aim (under `--list`, #895); past its limit it fails, and only then is it owed.
Each figure's aim and limit are `GATE`'s (`tools/kit/rules/gate.ts`), the limits weighed by the
pilot on every box of the Downs and left as they were until the owner's own play says otherwise
(#47, docs/areas/shelf.md §8).

- **At the floor, through.** A company at each map's own floor wins `GATE.through`'s share of
  that map's fights, and of the area's, each fought at its map's floor; each zone's road is walked
  at the zone's floor, resting where the road lets it (an inn, a camp), as often as `GATE.road`
  asks.
- **Well under, back.** Two levels under the floor, it wins no more than `GATE.back` lets it: over
  each map whose floor is the area's, and over the area, where a zone map's groups count two under
  its own floor and a town's or dungeon's two under the area's (the owner, on #40 and #209). That is
  Act I's figure: from Saltreach's floor, 10, two under is judged by the day (below, #851).
- **The boss asks.** The area's boss is won about half the time at the floor, and nearly always two
  levels above it, or at the cap where that is as high as it goes. Two exceptions came with the
  Heart (#759, kept by #752): a boss whose floor is the cap is judged at its floor alone, since no
  company stands above it; and a map of nothing but its boss is judged on the boss's odds, with no
  floor of fights to pool and no day. Where the rise from the floor to two above is too short for
  both odds, the floor binds and the second stands inside its limit, short of its aim: the Stair's
  Catcher, 57% at 30 and 80% at 32 on the gate's seeds (#752, #796; docs/areas/hearth.md §8).
  A boss set off the line is sized on these odds against the gate's bot, by its box's gate
  (`offLine` on its def in `src/content/areas/<area>/monsters.ts`, which `tools/tests/harness.ts`
  reads).
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

The checks' company keeps up with the party behind what-ifs (#854), off in every default: #865
weighed the tiers and the bots' three and kept them off (J2, above). Under `Rules.tiers` (`--tiers`)
`companyAt` takes its tiers after its prestiges: Expert at 13 and Master at 25 on each line its
class takes, a fighter's arms, a caster's magic and a hybrid's both. `Rules.bot`
(`--bot bless,sleep,drink`) hands the bots their options, the thrifty one's in the harness's fights
and the gate's in its own. Beside the premade six stands a company of the four newer classes,
`newerCompany`: a barbarian, a monk and a paladin in front, a bard, a druid and a sorcerer behind,
trained, dressed, prestiged and tiered as the six are. The harness suite holds it to the line at 12,
20, 28 and 32 against each role's standard encounter, on 100 seeds: its fights to a rest inside
`GATE.perRest`'s limit and its fights from fresh won at the floor's limit, `GATE.through`'s;
`--company newer` plays it by hand. The gate judges one company, the premade six: a second would
double its fights in the slowest of CI's jobs. On 17 October 2026 the newer company stands inside
every limit and wins every fight from fresh, off its aim on five lines: the archer at 12 (9.5 to a
rest, 7 asked), the controller at 28 (12.1 of 11) and the controller, the armoured and the elite at
32 (13.6, 13.2 and 13.4 of 12). Since #946 the what-ifs are a value, `Rules`, passed to each call
that reads one, down to the fight, the bots' answers among them (`Rules.answer`); `RULES`, play's,
is frozen and sets none, so no suite leaves one set for the next.

From 10 two under is judged by the day, not the fight. From 10 the damage spells roll their full
dice and every group is sized for the day (docs/MONSTERS.md §4.4), so a fight from full health
measures nothing there: on main at `dbb9d247` the gate's company won every fight two under every
sampled floor from 10, and nearly every fight eight under from 18, while Thornmark's cliff stood
(100% at 5, 24% at 3). The day still slopes: two under, a company got 43% to 87% of the fights to a
rest it got at the floor, about 62% the median. So a company two under a floor rests after fewer
fights than the floor's aim gives, its share held by `GATE.backDay`'s aim and limit
(`tools/kit/rules/gate.ts`). It is judged over each map two under is asked of alone, at its own
floor less two, and over the area, its groups pooled at the area's floor less two: 100 seeds, dealt,
a boss left out as from the floor's day. On 17 October 2026 the gate judges 81 maps' days and 10
areas', at 29% to 109% of their floors' aims (the median 62%). It lists 29 maps and three areas off
their aim, the soft ones: seven each of Ashfall's and the Glasswold's, six of Cairnmoor's. One map
was past its limit, owed to #865: `cairnfield_m8`, whose two groups were fought 9.29 to a rest two
under against the floor's 8.5. The 86 two-under figures owed to #18 went (#851). On 18 October #865
re-sized its crag group, two ravens and two tor trolls where eight ravens stood: two under it fights
5.52 to a rest (64.9%), and 7.60 at its floor (8.5 asked). No row is owed.

Its decisions: decisions.md.

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
- **The road** needs no skill, tier or item: skills and boats open shortcuts off it (§2.2).
- **Story locks.** Every flag that closes something (an exit, a gate, a door, a service) is in
  `LOCKS` (`content/locks.ts`) with its reason, inside the counts beside it, and no lock stands
  between areas. Every hand-in takes its item at the first meeting.

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

Its decisions: decisions.md.

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
  A pull request that changes the painters of a face, a floor or a ceiling (`src/ui/view/`)
  or how a cell is drawn (`src/game/ink.ts`) starts the Checks workflow by hand on its branch
  before it merges, so that the audit's shards judge the rule the skip stands on.
- **Restraint.** The share of wall faces dressed, per kind of map and per map, stays near its level
  after #9, under caps set above it so an honest new map seldom fails by chance; a new kind of
  dressing comes with its rate (`DRESSING_RATES` in `src/ui/view/model.ts`, checked in
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

- **Joined from chapters.** Each area writes its chapter of the quest
  (`src/content/areas/<area>/chapter.ts`: its entries and its goals), and `content/index.ts` joins
  them in road order into one quest, with the goals furthest along first, as the log tries them. No
  area edits another's chapter, so one quest is not one file that everyone edits.
- **The road's own test.** The walkthrough plays the chapters in order, each step at the curve's
  level, checking that the goal names a built place, the level sits in its band and the step is
  finished. An area's walkthrough is its chapter in scenes, each its own walk, run alone
  (`node tools/test.ts walkthrough:kilns:n4`); the whole is the chain.
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

## 8. How the work is split

### 8.1 Lanes

| Lane | Touches | At once |
|---|---|---|
| Systems | `src/game`, `src/ui` outside the art modules, the three kits, the save format, the registries | one |
| Area | an area's maps, monsters, items and quests, and its doc | one per area in flight |
| Creatures | the monster drawings: `src/ui/monsters` outside its kit/ | one per family |
| Interiors | the businesses' rooms: `src/ui/interiors` outside its kit/ | one per area |
| Quality | `tools/`, CI and the content contract (EXPANSION §5) | one |

A content session that needs a change to a system stops and asks for one, or opens a systems pull
request first; it never edits shared files on the side.

Each lane's first read is CLAUDE.md's: `FIRST_READ` in `tools/kit/docs.ts`, which the `docs` suite
holds under 25,000 tokens.

The imports keep layers as the files keep lanes: `src/lib` under `src/game` under `src/content`
under `src/ui` under `src/app` (and its entry, `src/main.ts`), the tools taking anything and
`tools/kit/` only `src`, the walkthroughs and the suites `src` and `tools/kit/` and not each other
or the tools (but a walkthrough or an area's steps.ts, the chain it plays, takes any area's
steps.ts, which nothing in `src` takes), no area another's files but its
`src/content/areas/<area>/public.ts` and no cycle among `src`'s runtime imports;
`tools/tests/layers.ts` holds it, today's crossings the rows of its `KNOWN`, which only ever go
(#900): none is left since H8 (#1033). An export is imported or an entry point
`tools/tests/unused.ts` lists (#972).

The lanes are read as code, not by eye (#899): `node tools/lanes.ts <base>` lists the lanes the
files changed since `<base>` fall in, each with its files, by the table of docs/ISSUES.md §2 (which
adds a design lane, `docs/`, to the rows above), and the checks' `lanes` job writes the same into a
pull request's summary beside the lane labels its event carries: a line for each lane a file falls
in that the labels lack, one for each label no file falls under and one where no lane label is on
yet. It tells, never gates. A file no lane holds (the vendored `src/lib/` or a kind of file the
table lacks) is listed outside every lane. The table, the report and the reading of the diff are
`tools/kit/lanes.ts`, the kit's first file, which `tools/tests/lanes.ts` holds.

The kit holds what the walkthroughs and the suites take (#984): the fight once
(`tools/kit/fight.ts`: `playOut`, `ROUND_CAP`, the gate's bot, its fight, its win rate and their
memo), the premade company and its ladder (`tools/kit/company.ts`), the test monster's line
(`tools/kit/line.ts`, its two tables in `tools/kit/line.json`, which
`node tools/harness.ts --calibrate --write` writes), the harness's library (`tools/kit/harness.ts`),
the headless game (`tools/kit/headless.ts`), the rules the suites share (`tools/kit/rules/`, a
module a suite) and the libraries of `checks`, `grounds`, `ways`, `shipped`, `changed` and
`scaffold`. `tools/gate.ts` and `tools/harness.ts` are command lines over it and import nothing of
each other; `roadPlace` is `src/game/atlas.ts`'s, beside `areaBand`.

#985 put the walk in it: `tools/kit/walk.ts`, the walk the walkthroughs and three suites take and,
once, the helpers each walkthrough wrote for itself, and `tools/kit/grid.ts`, the
floods and tests over a map's squares and `ALL`. The chain a later chapter replays (`STEPS`,
`FARM_FIRST`, Saltreach's `inOrder` and `saltmouthFirst`) is in its area's steps.ts since H8
(#1033): the kit takes no walkthrough, and no walkthrough another's.

The paint kit, `src/ui/paint/`, is what every drawing in `src/ui` paints with; it, the monsters' kit
(`src/ui/monsters/kit/`) and the rooms' (`src/ui/interiors/kit/`) are the systems lane's, as
`tools/kit/` is quality's (#983). A family or a scene takes a kit's helper when it is next edited,
not in a sweep, and a helper a third family or a third scene wants goes into the kit by a small pull
request of its own, not a copy in a third file: the rule of three.

The tools that open the game in Chromium (the smoke, the sheet, the gallery, the interiors, the
world map and `tools/shot.ts`) start it in `tools/kit/browser.ts` alone (#986), which imports
Playwright by name as the pinned dependency it is (§8.3), launches it once with its fallback and
opens the game on a page, its errors gathered and, for the smoke and the sheet, its `Math.random`
pinned. The sheet, the gallery, the interiors and the world map read their command lines strictly by
`tools/kit/args.ts`, which `tools/tests/args.ts` holds. `types/globals.d.ts` types the page's game,
so the tools read it as the `Game` it is.

Its decisions: decisions.md.

### 8.2 The recipe for a zone map

1. **Brief**, in the area's plan, `docs/areas/<area>/plan.md` (the area's doc, below): purpose,
   band, landmarks, the secret and its hint, the encounters, what is new; its "As built" once built.
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
4. **Check**: a box declares the flags it sets in `src/content/areas/<area>/flags.ts`, each with a
   few words on what holding it means, and records them with its other ids: `node tools/shipped.ts`
   records the box's ids in `src/content/areas/<area>/shipped.json` and no other file, and on a new
   area's first map makes that file (§5.5); the typecheck refuses a flag no area declares and one
   two declare, and the shipped suite a flag declared and not recorded or recorded and not declared
   (#995); then `npm run check`, then the contact sheet.
5. **Review**: a pull request, CI green, the owner's look at the sheet, merge.

A monster or an interior goes the same way: a brief, the drawing, the gallery or interiors render,
the checks, the sheet. A new kind of an existing family touches its family's file (its entry in the
family's `SPRITES`: the drawer, the span the smoke test prints and any part drawn apart) and its
area's monsters and index, and its sheet draws that family alone (#915).

An area's dungeons may exit only to its own region's maps, or to the outdoors once its zone is laid,
so its zone map lands with or before its first dungeon (`tools/tests/weather.ts` holds it by the
maps' regions).

**A new area starts in `AREAS`** (`src/content/index.ts`), from its first commit: its folder, its
line there and its `MAPS` in `AreaMaps` beside it (each map declared with its id,
`MapDef<'cairns'>`, so that `MapId` names it, #994), its `src/content/areas/<area>/flags.ts`
declaring `FLAGS = {}`, its `flags: FLAGS` and its line in `Declared` (so that `Flag` names what it
sets, #995), its row in the atlas's `areas` charted as the plan charts an area
(`src/content/atlas.ts`: made of zones, reached from the start, its step and its band rising on the
road of levels, which the atlas suite and the curve read) and its row in `CURVE`, with `MAPS` empty
and `chapter: undefined` until its first map (the typecheck reads `chapter` on every area) and what
its clear falls short of owed in `src/content/areas/<area>/checks.ts` (`owes.curve`) until it pays.
Its monsters, rooms and items are merged from the start, so nothing waits in a list of its own ahead
of its area (the `AHEAD` lists and `PLANNED` are gone, #897), and the suites take what is built: an
area with no map is asked for no chapter, walkthrough, claim of what is new or step of the one
quest, and once it has a map each zone it charts holds a step; a monster or a room no map places yet
is owed in `owes.unplaced`. What the suites hold of an area is the area's: what describes one zone,
group, monster or exit is a field of it (`AtlasZone.road`, `reach` and `maxGroup`,
`EncounterDef.boss`, `MonsterDef.offLine`, `Exit.crosses`), and what is the area's own and no part
of the game, what it owes, its rungs of the ladder, its lead over the road, its seams as built and
its edges open on nothing, is a row in `src/content/areas/<area>/checks.ts` (`AreaChecks`), which
nothing in the game imports and the suites find as the runner finds a walkthrough; a field
`AreaChecks` has not stops the run with its name. A seam is the area's of the first box its key
names (`a|b` or `a/b`), an edge the area's whose box it is. Each suite reads those alone. Every
area's have moved, the Foreland's first (#897), the rest by one script in a window with no area pull
request open (#968) and the last two tables' by the same script (#969), which dropped the emptied
tables and the second reads beside them; so a box adds its rows to its own folder only.

**An area's `src/content/areas/<area>/public.ts` is the one file of it another area imports**
(#992), which the layers suite holds (§8.1). It declares the flags and exits the others take,
imported back by the files they stood in, and re-exports `src/content/areas/<area>/items.ts`, where
every item is a const of its own by the name of its id (`export const plate = A('plate', …)`,
`halberd+1` as `halberdPlus1`): another area takes an item by its name, never by its id from a
table. It re-exports nothing else but the area's flags as declared (`FLAGS`, from
`src/content/areas/<area>/flags.ts`, which imports nothing, #995). What it re-exports, everyone who
takes anything of the area loads, and the areas take one another both ways (Ashfall and the
Glasswold, Hearth Isle and the Foreland, the Kilns and the Whitespine): with every
`src/content/areas/<area>/items.ts` re-exported, a map re-exported for its flags closes a loop of
six files, every `src/content/areas/<area>/chapter.ts` one of eleven and every
`src/content/areas/<area>/guilds.ts` one of six, and the layers suite refuses a loop. So a
walkthrough takes another area's chapter from `THE_QUEST.chapters` by its id. Every area has one; a
new area has one once another takes something from it, and a flag another area needs that
`src/content/areas/<area>/public.ts` lacks is one line there, added by the box that needs it and
said in its pull request.

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
moved first, to `docs/areas/shelf/plan.md` and `docs/areas/shelf/decisions.md`; D3 moved the other
thirteen in five parts (#1027), and every doc of `docs/areas/` is in the shape, none owed.

Every decision but an area's goes in decisions.md, a list under its issue and the rule's section.

### 8.3 Pull requests

- A `pull_request` workflow runs the typecheck, the tests, the smoke test and the smoke's crack
  sweep in jobs of their own, each ending inside three minutes (#848; SYSTEMS names them); all gate,
  the sweep skipped only where the plan sweeps no map. The smoke test and the sweep need Playwright
  (a pinned dev dependency) and Chromium on the runner; the workflow is
  `.github/workflows/checks.yml` (#27).
- A pull request's tests run the gate only for the areas its diff reaches and every other suite
  whole; the walkthroughs run for those areas and, where more than a comment changed, for all
  (#955). Everything runs on main: `.github/workflows/pages.yml`'s `npm test` on every push, a CI
  cycle after the merge and before the deploy; the Checks workflow every day at 03:17 UTC
  (`schedule:`); and a run started by hand, a release's. A flag spelt in two areas, or a crossing
  that lands on another area's map, the gate's narrowing cannot see until A7 and A9: those runs
  catch it.
- Main has no branch protection, by the owner's word of 18 October 2026: "We are not doing branch
  protection." Nothing in the plan needs a GitHub setting. Two green branches that are red together
  are kept from merging by a procedure, now the only safeguard: the orchestrating session merges one
  pull request at a time, brings each branch up to date with main first and waits for CI to be green
  on that new head. A branch whose checks ran on an older base is not merged on them. As a pull
  request's tests run only what its diff reaches (#955), the session reads the latest run of
  `.github/workflows/pages.yml` on main and the latest nightly before it merges
  (`gh run list --workflow pages.yml -L 1`,
  `gh run list --workflow checks.yml --event schedule -L 1`); a red one stops the merges until it is
  mended.
- Small pull requests: a zone map, a dungeon level, a monster family, a town's interiors; not an
  area at once.
- Deploy from a tag once an area has been played, rather than on every push, so players never get
  half an area. (Or keep deploying on every push, and accept that.)
