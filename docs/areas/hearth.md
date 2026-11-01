# Hearth Isle: step XII of the road, the temple over the core

Hearth Isle's doc is three files (EXPANSION §8.2, #1027), and this, its current state, is read
first. Its decisions, the old §9 whole (the owner's delegate's calls, §9.1 the changes taken in
review and §9.2 the lists decided while building), are `docs/areas/hearth/decisions.md`, appended to
and never rewritten. Its plan is `docs/areas/hearth/plan.md`: the old §4 (the briefs, §4.1 to
§4.9, with every line each place says), §11 (what was cut and what each box owed as built) and §12
(the road behind: the lines the act changes behind it, built by #765) whole, then under "Moved from
the state" the lines of the old header, §1, §3 and §5 to §8 that this file does not keep, each under
the heading it had, among them §1's squares, §5's chapter in code, the lock, the endings' pages and
the walkthrough, §6's briefs of each quest and the subplots' ends, §7's roster and the bosses'
sizing and §8's row, shares and boxes as built. §2 and §10 stand here whole. The figures are main's
at `5231c94d` (24 October 2026), as the suites print them.

Its ids: the area `hearth`; its zone `hearthisle`; the boxes `hearthisle_h6` and `hearthisle_i6`;
the temple `hearthfane` and its crypt `hearthfane2`; the Underdeep's two levels, the Ways
`underdeep` and the Stair `underdeep2`; and the Heart `core`.

## 1. Where it is

The twelfth and last step on the road of levels (DESIGN §4, §9) and the whole of Act V, to
the cap: a rocky rim round a green bowl in the middle of the inland sea, the column of light
standing up out of the bowl. One zone of the atlas (`src/content/areas/hearth/atlas.ts`), Hearth
Isle, band 28–29, in two boxes of the grid (EXPANSION §8.2; docs/areas/shelf.md §1): the isle's
body in H6 and the east rim in I6. Below the isle, off the grid, each down from the last: the
temple, Hearthfane (28–29), entered from the Bowl, its crypt (29), the Ways (30), the Stair (30–31)
and the Heart (32). The deep places widen the area's band to the cap (`areaBand`,
`src/game/atlas.ts`).

- **South: the Sound.** The last crossing comes over from Cinderport to H6's strand, a boat open
  from the start for the fare (`LAST_CROSSING`, `src/content/crossings.ts`): 350 gold, a day,
  landing rested; nothing else lands on the isle but the Hand.
- **East and south-east: the Hand's causeway** from Sheer Point, which lands at I6's sand under the
  rim, the Hand's Steps: a line on the water, never walked. The grey door at its root opened for
  Wenna's hand and opens for nobody else: an event, not an exit.
- **North: the Wyke and Thornmark's shore,** which no way crosses: H6's north edge is cut to the
  world, the H5 box above it being unlaid, and I6's meets the rock and water of the Deepthorn's I5.
- **West: the Sound,** and Cinderport far off under its mountain.

Its one edge open on nothing is H6's south at 19 to 27, where H7 is the sea (`openOnNothing`,
`src/content/areas/hearth/checks.ts`). `node tools/worldmap.ts out.png --zones` paints the zone.

## 2. What it is for

The last act of the one quest (DESIGN §9): *what do we do?* Every act before it asked a question
and ended on an answer; this one ends on the company's. The isle is the Hearth up close, no fire
but a column of light that hums in the teeth as the shard under Ashcombe did at the very start,
and a temple built round it by people who thought it a god. The Hand holds the temple, its best in
front, and the way down is the Hand's own: Wenna's knot on every frame, all the way down, and the
Hand's dead on the stairs where what lives below caught them. At the bottom are two doors: the
Hand's own, which opened for her palm and is shut behind them, and the Stones', which the Hand
could not open, with its creed cut across it. That one does not wait for anyone's palm. It opens
as the company comes near, because the company made the Stones whole, and the heart opens for
whoever makes it whole. Through it, people: Vask halfway
through putting out the light and the grey-handed men holding Wenna's palm to the glass. Then the
last fight, on a clock. When it is over the Custodian speaks, for the first time with one voice, and
says what DESIGN §9 says and nothing more. Wenna takes the ring off Vask's finger and puts it in
the company's hand: *You walked every road of it. You choose.*

Three endings, a clean three-way choice (DESIGN §9): reignite, arrive or, for a company that holds
Fane's map, make it finish. Nothing else on the road changes what is offered. The throne decides
who stands with the company at the core (DESIGN §10.1): the Council's verdict (§6) puts the winning
claimant's people on the Stair's first landing, and Tallis's man at the Heart's door to hinder when
the claimant is his; where no claimant's verdict carried, the pilgrims' token (57) decides the
same. A Partner of the Compact has its runner at that door too. The throne, the Compact and the
Lost Expedition all change what the world says after. In every ending the company walks Wenna home
to Gullwick in the spring, and her mother cries.

The weather is the light's: warm the year round, the Hearth's heat on the face, little fog and
never snow, thunder far off over the mainland.

## 3. What is built

Seven maps (`src/content/areas/hearth/maps/`), a row each: its id and name, kind, size and band;
what is there, with its groups (the gate's count); and its secret, a door at the squares given, with
the hint on its near side that finds it (the map's `secrets`). Three maps have one, the east rim
two.

| Map | Kind, size, band | What is there | Secret, and its hint |
|---|---|---|---|
| `hearthisle_h6`, H6, the isle | outdoor, 32×32, 28–29 | the strand where the last crossing grounds; the cleft up through the rim with the Hand's pickets; the Bowl and the pilgrims' camp, its three tents (`bowl_store`, `bowl_yard`, `bowl_lantern`) and the three pilgrims of 57; the temple's mound, its door onto Hearthfane; the Hearth, the column's foot; the west shelf to the lookout; seven groups | 26,7, the north rim's cache, a lamp of grey metal four hundred years lit: a warm draught smelling of oil at 26,8 (`h6_draught`) |
| `hearthisle_i6`, I6, the east rim | outdoor, 32×32, 28–29 | the rim's path from the Bowl's east pocket to Anchorhold's yard and Hereswith at the cell's window, the cell standing over the land as a tower (a landmark, 4,18); the Hand's camp at the Steps, where the causeway lands, its crates, its tally-house and its chest; the grey door in the rock, read and never opened; six groups | 2,24, the Hand's takings and hoard behind the tally-house: lamp oil and the smell of the sea cave at 2,25 (`i6_smell`); 8,15, the vigil cell, its two finds in a plain chest and a locked one: a vein of glass stopping at scorched rock at 9,15 (`i6_scorch`) |
| `hearthfane`, Hearthfane | dungeon, 16×16, 28–29 | the temple, in at the mound's door: the nave and its four lamps, the vestry and the sacristan under its table (56), the treasury behind the door his key opens, the court open to the column with the Hand's best, the altar and the stair down behind it; nine groups | none |
| `hearthfane2`, the Crypt | dungeon, 16×16, 29 | down the stair behind the altar: the round chamber and its eleven niches, the lamps the Cleric's third lights, the side vault of the Hand's dead, a keeper and the Hand's last man; the grey door with Wenna's knot, down onto the Ways; six groups | none |
| `underdeep`, the Ways | dungeon, 32×32, 30 | through the crypt's grey door: the main way north to the Stair's head, its side ways each ending at a frame with her knot (59), the keepers' store, the crack and the knocker that found it (61) and the CREW ONLY door from the inside (60); twelve groups | 24,14, the room behind the eighth frame, with the hatch onto the crawl way: her knot cut deeper there at 20,14 (`ud_knot8`) |
| `underdeep2`, the Stair | dungeon, 32×32, 30–31 | eight landings and the seven flights between them down to the last door, which opens on the road's five flags; the first landing held by the claimant's people or fought for with the rearguard (57); the Hand's dead and Jowan's letter (58); the last frame, with her name (59); the crawl way's door; the Catcher on the last landing; nine groups | none |
| `core`, the Heart | dungeon, 16×16, 32 | through the last door: the round room under the glass roof and the panel, Vask with three Grey Hands holding Wenna's palm to the glass, on the clock that calls the core's sentries and dims the roof; then the voice; Wenna with the ring and her three answers; two groups, one of them fought: `core_vask`, or the thinned `core_vask_thinned` the Council swaps in | none |

Its content is `src/content/areas/hearth/`: the maps, then a file each for its monsters, items,
chapter, side quests (the Cleric's third with them), rooms, its part of the world (the atlas), its
rows of the suites (the checks) and what other areas take of it (public). Its walkthrough plays the
chapter to each of its three ends and once early. Its businesses' rooms, the pilgrims' camp's
three, are `src/ui/interiors/hearth/`.

## 5. The one quest here

**The Heart** (`heart`, `src/content/areas/hearth/chapter.ts`), the twelfth and last, joined after
the Glasswold's The Warning: begun on its end (`q_road_east`) or on the isle; the temple, the
crypt's grey door with her knot, the Ways, the Hand's dead on the Stair, her name on the last
frame, the Catcher, the last door and Vask at the panel; then the voice and the ring in the
company's hands. It is done on the choice, any of `q_end_reignite`, `q_end_arrive` and
`q_end_finish`, which Wenna's three answers set. The last door asks the five flags the road sets at
the Stones (`q_tide_home`, `q_grove_done`, `q_anvil_closed`, `q_peak_stood` and `q_ember_lit`), the
act's one lock; a company that comes early reads the door shut and walks back up to rest. The
endings' pages, three each, are `src/content/endings.ts`, and each ending changes the road behind
(plan, §12).

## 6. Side quests

#56's seven for Act V, the walk home and the Cleric's third, in
`src/content/areas/hearth/quests.ts`, a line each (the plan's §6 has each brief):

- **The Sacristan's Lamps** (`lamps`, 56): the sacristan under Hearthfane's vestry table, the lamps
  put out and his key to the treasury (`fane_key`, `q_lamps_key`).
- **The Pilgrims in the Bowl** (`bowl_pilgrims`, 57): three pilgrims at the camp and their tokens
  (`wardens_badge`, `treaty_seal`, `tallis_tally`); a verdict, or the token carried, decides who
  holds the Stair's first landing.
- **A Letter for Gullwick** (`letter`, 58): Jowan's letter (`gullwick_letter`) under a champion's
  hands on the Stair, carried home to his mother (`q_letter_given`).
- **Every Frame She Marked** (`frames`, 59): her knot on the Ways' frames and, on the last, her
  name.
- **Crew Only, From the Inside** (`crew_only`, 60): the Tiefzeche's shut door, from the Ways' side,
  opened or left shut (`q_crew_open`, `q_crew_shut`).
- **The Knocker That Stopped** (`crack`, 61): the deep knocker at the Sunder's crack, sealed or
  widened (`q_crack_sealed`, `q_crack_wide`); widened, its gift is the Old Lantern's Staff.
- **The Signet** (`signet`, 64): the Queen's ring (`queens_signet`), given after to one of the three
  claimants or thrown into the sea off Gullwick.
- **The Walk Home** (`walk_home`): after any ending, Wenna walked home to Gullwick in the spring.
- **The Eleven Kept** (`eleven_kept`), the Cleric's third prestige: Hereswith at Anchorhold's
  window, the keeper's log and the crypt's lamps.

The subplots end here: the Empty Throne's Council of Helmstow (`council`, the Foreland's), whose
verdict puts the winning claimant's people on the Stair's first landing; the Salt Compact, ended at
the Keel, whose Partner has its runner at the Heart's door; and the Lost Expedition, ended at
Fane's fire, whose map (`meridian_map`, Ashfall's) offers the third ending.

## 7. Encounters, and what is new

MONSTERS §9's eleven and the Ashen Rearguard, in its monsters file, with Ashfall's deep knocker
met again: the moths at their most, the Hand at its best and in its inner circle, the keepers, the
rats and the crawlers; the Catcher (boss, 31: 1,300 hit points, off the line) on the Stair's last
landing; and Lord Vask (boss, 32: 1,850 hit points) with the Grey Hands at the Heart, who calls the
core's sentries on the clock's beat and whose fall stands them down. New here (`novel`): the
crawlers, the Core's clock (`encounter:clock`) and the Hearth, its landmark.

## 8. The numbers

- **The curve** (`tools/tests/curve.ts`): a clear gives 47,836 xp a member of the 46,934 it asks and
  28,700 gold of 28,320; a company entering at 28 and clearing three quarters leaves at 31.9, 0.1
  under the next floor, the cap, 32. Its row's window is 7,000, and the dearest find, the Grey Mail
  at 7,000, sits in it.
- **The gate** (`tools/tests/gate.ts`): at its maps' floors the area wins 97.8% of its 51 groups'
  fights (`GATE.through`'s aim); two under, its groups pooled at 26 manage 4.05 fights to a rest,
  36.8% of the floor's 11 (at most: `GATE.backDay`'s aim). Its road is walked every time at 28. The
  Stair is won 95.7% at its floor. The Catcher is won 61% at 30 and 88% at 32; Vask, on a blow of
  35d8+38 and his sentries on 300 hit points since the class changes (#1117), 62% at 32 with the
  Hands first and 41% with the clock let run (held to 20% to 45%); his thinned group 64%.
- **Fights to a rest** (aim 10 to 12 at 28, a quarter more a level): H6 11.32, I6 10.86,
  Hearthfane 10.64, the crypt 9.19 at 29, the Ways 10.45 and the Stair 10.50 at 30; the Heart holds
  its boss alone. Three figures are off their aim, inside the limits: the crypt's 9.19, the Ways'
  10.45 and the Catcher's 88% at 32.
- **Density** (`tools/tests/density.ts`): within 8 squares in the core, H6 99.7% and I6 100%;
  within 7 in the dungeons, the Stair 98.1% (its furthest square 9) and the other four 100%.
- **The ladder:** rung 28 is Hearth Isle's (`gear`, in its checks): the Hand's steel, nine pieces,
  found and never sold. The vigil cell's two finds, the Levin Mace and the Vigil Robe, are off it.
  Its ranged rung (`ranged`, #1115): the Grey Short Bow and the Grey Sling, a step and two behind the
  Grey Bow, found beside it in the treasury's offerings, never sold and on the gate's ladder since
  #1117.

## 10. Names

The Lanterns' English, kept, as the Whitespine's and Sunderwood's were (NAMES.md §2, §4): the isle
is the Hearth's and the pilgrims' from everywhere, and has no people of its own to name it. A few
old names on its oldest places, the crew's worn words, as NAMES.md §1 allows and never says:

| Name | What | Meaning, or what it replaced |
|---|---|---|
| Hearth Isle | the area and the zone | kept |
| The Hearth | the column | kept |
| Anchorhold | the anchoress's cell on the east rim | kept: an anchorite's hold, and the crew's word under it |
| Hearthfane | the temple | fane, a temple, the Crown's old word; the plan's "the temple" |
| The crypt | the temple's first crypt | the docs' plain name |
| The Bowl | the green bowl inside the rim | the plan's words, kept |
| The Strand | the south shore where the boat grounds | Pilgrims' Strand in full; the plan's "the shore" |
| The Hand's Steps | the causeway's end on the south-east rim | new: where the Hand came up |
| The Ways | the Underdeep's first level, the hull's service ways | the docs' plain name, as the Sleepers' Bay is; the Underdeep on the atlas |
| The Stair | its second, the stairs down to the heart | the same |
| The Heart | the Core's one level | the same; the Core on the atlas |

Two people are named here, each grepped against `src/content` and `docs/` first: the elf of
Henlys in 57 is **Talwyn**, of the elves' tongue (docs/areas/thornmark.md §10: *tal* brow and
*gwyn* white, a Cornish name of the tongue's shape that echoes no one on the road), and the
Council's clerk is **Wiglaf**, the Foreland's English, a name used nowhere else and not one more
-ric beside the keep's Wulfric, the lodge's Godric, the old champion Edric and the Watch's prior.
No place's name is new in any people's tongue, so NAMES.md §4
gains one line: *Hearth Isle (step XII): the Lanterns' English, kept, with Hearthfane for the
temple; the deep's levels take the docs' plain names.*

The vigil cell's two finds (#864) keep the Lanterns' English. Levin is the old word for lightning, a
worn one of the kind NAMES §1 allows and never says, and the mace after it is the Slag Mace it was
cut from. A vigil is the night a pilgrim keeps at the light, and the Vigil Robe is what is worn for
it, in a cell cut for the keeping. Neither name says what it does: the sheet says LIGHTNING, and the
stat says personality (§9, #864's 8).

## Open and owed

- **Owed to no check:** its checks have no `owes`; the curve, the gate, density and the ladder hold
  the isle with nothing owed.
- **Watched, not moved:** H6's 12.34 fights to a rest (its aim at most 12) and the Catcher's and
  the thinned group's odds at 32 sit inside their limits (plan, §8). What the owner finds by hand
  goes here; none yet.
- **Cut:** none of the land; the Wardens' siege, a second way into the Ways from the Hand's Steps
  and a fail state at the Core (plan, §11).
- **What is next:** nothing. The plan's briefs are all built, and a new box starts its brief there.
