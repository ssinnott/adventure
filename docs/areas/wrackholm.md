# Wrackholm: step IV of the road, the smugglers' isle

Wrackholm's doc is three files (EXPANSION §8.2, #1027), and this, its current state, is read first.
Its decisions, the old §9 whole, are `docs/areas/wrackholm/decisions.md`, appended to and never
rewritten. Its plan is `docs/areas/wrackholm/plan.md`: the old §4 (the boxes' briefs, §4.1 to
§4.6), §11 (what was cut) and §12 (the bounds, §12.1 to §12.6) whole, then under "Moved from the
state" the lines of the old header, §1, §3 and §5 to §8 that this file does not keep, each under the
heading it had, among them §1's zone row and the isle's ways, §3's atlas rows and boxes as built,
§5's entries and its As built, §6's table of #56's four, each quest as built, the Compact's two
rungs and Holdfast's brief, §7's roster and novelty and §8's shares box by box. §2 and §10 stand
here whole. The figures are main's at `2ef2d315` (24 October 2026), as the suites print them.

Its ids: the area and its zone `wrackholm`; the boxes `wrackholm_e6` and `wrackholm_f6`; Kelp Hole
`smugglers_cove` (the id stays under the new name, NAMES §3) and its sea cave `smugglers_cove2`;
the Tide Ship's decks `tide_ship`, `tide_ship2` and `tide_ship3` and its Rift `tide_ship_rift`;
the stair's foot `dead_drop_stair` and below it the Dead-Drop's three levels, `dead_drop`,
`dead_drop2` and `dead_drop3` (`docs/areas/dead_drop.md`); the bounds' strands `wrackholm_e5`,
`wrackholm_f5` and `wrackholm_f7`, the enclave `brokenback` and the lair `nicks_locker`.

## 1. Where it is

The fourth step on the road of levels (DESIGN §9), band 12–14, the middle of Act II and the
smallest area on it: one zone of the atlas (`src/content/areas/wrackholm/atlas.ts`), a heather moor
with a rocky east end out in Sylmeer. Two boxes of the grid (EXPANSION §8.2; docs/areas/shelf.md
§1) hold the isle: E6, the moor and the landing, band 12–13, and F6, the east rocks, 13–14. Three
hold the bounds' strands of shore round it (#835): E5, 12–13, and F5 and F7, 13–14. E7's scrap of
shore is laid in the Wold's box (plan, §11). The dungeons stand off the grid, each entered from a
map.

- **Every side: the sea.** Saltreach's Saltings lie west across the water, the Deepthorn's
  Penspern north-east and Hearth Isle east. The Wold's coast comes near at the south-west, where
  E7's tip of the isle stands in the Wold's box as rocks across deep water, and no way runs there.
- **The landing,** at the head of an inlet off E6's west shore, where the smugglers' boat from
  Saltmouth puts in (`src/content/crossings.ts`): open from the start for the fare, the first area
  a company reaches by paying, and the boat is how it leaves.
- **Kelp Hole** opens in E6's cliff over the landing; its sea cave lets out by a flooded passage
  onto F6's east shore, a way out and not in.
- **The Tide Ship** is boarded from F6's shingle by night in Dando's boat, and a company rows
  itself back at any hour. The stair from its hold goes down to the stair's foot, 26–28, and the
  Dead-Drop past it is #22's.
- **The Brokenback,** the enclave, 14–15, is entered at the break in a wreck's side in E5's black
  rocks, and **Nick's Locker,** the lair, 30–32, under F5's reef. Neither is counted in a clear.

No edge of a built map opens on nothing: every edge its boxes turn away from the isle is the sea,
and its checks hold no `openOnNothing` row (§9, #835's 31). `node tools/worldmap.ts out.png
--zones` paints the zone.

## 2. What it is for

The middle of Act II (DESIGN §9): Wrackholm is the cargo. The Tide Ship's hold carries Wardstone
shards packed in straw like eggs and people chained in rows, bound for somewhere below the world;
the Compact's crews work it, the Hand's overseers keep the chains, and the orders come up from
below (MONSTERS §6.2). Hale is in the last row, thin and still giving orders; the ship's papers
say Wenna was delivered below, through the dwarves' deepest mine; and in the forward hold the Tide
Stone glows through its sacking, with its Rift stood up round it. The company carries the Stone
home, and the night it is set back on its plinth the Hearth burns steadier than it has since the
Queen died and the temples begin, very faintly, to sing (STORY, Act Two; #168, #191). Wrackholm is
also where the Compact's line begins to turn: the hermit on the east rocks has counted the ships
since the founder died and keeps his last letter (#56's 26).

The weather is the gulf's: wind, spray on the cliffs, gulls and the moor's heather.

## 3. What is built

Seventeen maps (`src/content/areas/wrackholm/maps/`, the Rift in the Hold's), a row each: its id
and name, kind, size and band; what is there, with its groups (the gate's count); and its secret,
a door at the squares given, with the hint that finds it (the map's `secrets`). Ten maps have one
and F6 two; Kelp Hole's cave, the weather and lower decks, the Rift, the stair's foot, the drop and
the counting house have none.

| Map | Kind, size, band | What is there | Secret, and its hint |
|---|---|---|---|
| `wrackholm_e6`, E6 | outdoor, 32×32, 12–13 | the moor and the landing: the landing stage at the head of an inlet on the isle's west side, the smugglers' huts round it, Kelp Hole's mouth in the cliff above and the heather moor north and east; bilge rats in the huts, wrack gulls on the inlet's cliff and at the lookout, two crews of smugglers and bowmen on the paths and devilfish in the pools under the south hills; six groups | 13,21, the smugglers' cache under a hut's floor: the gulls on one roof and no other at 13,22 (`e6_gulls_roof`) |
| `smugglers_cove`, Kelp Hole | dungeon, 16×16, 12–13 | the crews' cave behind the mouth in E6's cliff: its fires, its landing where the sea comes in under the rock, the crates under the customs seal, the chained rows and the crews' strongbox; the crews at the fires and on the landing, which stands until Kitto is told (`q_brother_told`), and the overseers at the rows; three groups | none |
| `smugglers_cove2`, the Sea Cave | dungeon, 16×16, 12–14 | the sea cave below the ledge: the third crew at the ledge's foot, devilfish in the west and east pools and the Great Devilfish (boss) in the black pool at the back, with Tam a square short of it; four groups | 3,11, the flooded passage out to F6's east shore, a way out and not in: the weed's line on the wall breaking by the west wall at 4,11 (`kh2_tidemark`) |
| `wrackholm_f6`, F6 | outdoor, 32×32, 13–14 | the east rocks: heather rising from the moor to a mass of grey rock, open grass east to the shore, Merryn's cell and the cairn on the point, and the cliff over the anchorage with its path down to the boats' shingle; gulls on the rocks, a crew of smugglers and bowmen on the heather until the watch is seen, the Hand's keepers at the smugglers' watch (`f6_watch`), bilge rats at the landed stores and devilfish in the pools under the cliff by night; five groups | 28,14, the founder's grave under the cairn, with his seal: Merryn's strokes on her cell wall, headed the 11th of Frost, at 25,12 (`f6_tally`); 20,10, the hollow in the rock's east face, its two finds the blade in the area's first locked chest: a groove in the turf that stops at the rock at 21,10 (`f6_drag`) |
| `tide_ship`, the Tide Ship | dungeon, 16×16, 12–13 | the weather deck, boarded by night in Dando's boat from F6's shingle, where Hale, once freed, waits at the rail with the freed until he is answered; the devilfish over the side by night; one group | none |
| `tide_ship2`, the Lower Deck | dungeon, 16×16, 12–13 | the lower deck's rats, the Hand's post and the captain's cabin with the papers, the log and the clerk's book; two groups | none |
| `tide_ship3`, the Hold | dungeon, 16×16, 12–14 | the hold: its crew among the chained rows, Hale in the last row, the Tide Elder at the bulkhead and the stair's hatch down; two groups | 5,5, the shard-cut through the forward hold's bulkhead, a way past its door: the straw against it old on one side and new on the other at 5,6 (`ts3_straw`) |
| `tide_ship_rift`, the Brine Rift | dungeon, 12×12, 12–14 | the Tide Stone's Rift in the forward hold, stood up round the Stone, and the Warden of the Tide (boss) over it; two groups | none |
| `dead_drop_stair`, the Stair's Foot | dungeon, 10×9, 26–28 | one room at the foot of the hold's stair, with the way back up: a warning, not a wall, and the Fence's rung's deed (`dd_foot`); no group | none |
| `dead_drop`, the Drop | dungeon, 32×32, 26–27 | #22's first level, below the stair's foot (its doc, `docs/areas/dead_drop.md`); ten groups | none |
| `dead_drop2`, the Vaults | dungeon, 32×32, 27–28 | #22's second; five groups | 14,28, the hoist up to the drop: its chains at 15,28 (`dd2_chains`) |
| `dead_drop3`, the Counting House | dungeon, 32×32, 27–28 | #22's last, with the Compact's Orders in its out-tray; two groups, the Tallymaster's among them | none |
| `wrackholm_e5`, E5 | outdoor, 32×32, 12–13 | the north strand's west end, the bounds' first: the moor's grass down from E6 to sand and weed, a ship's figurehead with a riddle and, in the black rocks at the west end, the break in a wreck's side into the Brokenback; no group | 28,26, the hollow where a lamp with a red glass was kept, a sea chest in it: soot on the rock's face above head height at 28,27 (`e5_soot`) |
| `wrackholm_f5`, F5 | outdoor, 32×32, 13–14 | the north strand's east end under the east rocks' north face: a cairn of shore stones and, in the reef at the east end, the way in under it to Nick's Locker; no group | 9,27, the store where the smugglers kept the bait they fed Old Nick: fish scales dried to silver on the rock's foot at 9,28 (`f5_scales`) |
| `wrackholm_f7`, F7 | outdoor, 32×32, 13–14 | the strand under the anchorage: the shingle's sand and the cliff path's rock on south below F6's cliff and a spring at the cliff's foot; no group | 10,4, the hollow where one who got away from the hold hid in irons and left his purse: links of chain rusted into the sand, cut through, at 10,3 (`f7_links`) |
| `brokenback`, the Brokenback | dungeon, 16×16, 14–15 | the bounds' enclave, the wreck on E5's black rocks, her back broken and her hold open to the tide, entered at her break: three overseers with a gleaner at the hold's mouth and four gleaners at the master's cabin aft; two groups | 12,13, the master's strongbox under the cabin's deck, Keelhaul in it: one plank worn bright among the grey at 11,13 (`wb_plank`) |
| `nicks_locker`, Nick's Locker | dungeon, 16×16, 30–32 | Holdfast's lair, Old Nick's sea cave under F5's reef: up a passage that floods to the knee, Old Nick in the cave's throat, the one way in, and past it the ship it took, her master against her keel with Holdfast on him; one group, the guardian | 9,2, the master's sea chest in a dry cleft behind her bows: kelp grown green over the rock where no wave comes at 9,3 (`nl_kelp`) |

Its content is `src/content/areas/wrackholm/`: the maps, then a file each for its flags, monsters,
items, chapter, side quests and guild quests, its part of the world (the atlas), its rows of the
suites (the checks) and what other areas take of it (public). It has no town and no business, so
no rooms. Its walkthrough plays the chapter in order on from Saltreach's run and with Saltmouth
first, the temples not seen.

## 5. The one quest here

**The Stone Carried Home** (`src/content/areas/wrackholm/chapter.ts`), joined after Saltreach's The
Tide Stone, whose goal it closes: begun on landing (`visited: 'wrackholm_e6'`); Kelp Hole's crates
under the Helmstow customs seal; the ship at anchor and the hold; Hale freed (`q_hale_freed`, once
he has been taken from the Scarth, `q_hale_taken`); the papers in the captain's cabin, which say
the girl from Gullwick was delivered below through the dwarves' deepest mine; the Stone found under
its Warden; and the Stone home by the boat to the plinth at Stienwierde, whose hand-in sets
`q_tide_home`. It is done with the Stone home and the captain's table opened (`WRACK_DONE`), where
Sunderwood's The Wall begins. Nothing in it is a lock: the boat sails both ways for the fare.

## 6. Side quests

#56's four, in `src/content/areas/wrackholm/quests.ts`, a line each (the plan's §6 has #56's table):

- **The Captain's Brother** (`brother`, 25): Kitto at the landing and Colan by Kelp Hole's rows,
  gone below; the truth told (`q_brother_told`) or his letter carried to Kitto for 200 gold
  (`q_brother_delivered`).
- **The Hermit of the Point** (`hermit`, 26): Merryn's letter from the founder, carried to Ruan at
  the Keel for 300 gold (`q_hermit_hall`) or to Tallis on the quay for 500 (`q_hermit_tallis`).
- **Every Name in the Column** (`column`, 27): the clerk's book brought to Hale at the rail, and the
  freed sent to Saltmouth by the boat (`q_column_saltmouth`) or home by the coast road
  (`q_column_road`).
- **What the Smugglers Feed** (`feed`, 28): Loveday on Saltmouth's steps and Tam at the black
  pool; the beast left alone and Loveday told (`q_feed_told`), or slain and Tam home
  (`q_feed_home`). Her pay is words.

The Compact's rungs (`src/content/areas/wrackholm/guilds.ts`, #635): the Fence's Where the Cargo
Goes (`compact_fence`), the stair's foot seen, 200 gold and 600 xp; and the Factor's In the
Founder's Hand (`compact_factor`), once Act IV opens, the Compact's Orders brought up from the
counting house, 800 gold and 4,800 xp, which opens Ruan's choice at the Keel.

**Holdfast** (#846), the bounds' artifact: in Nick's Locker, behind Old Nick (boss, 32: 1,600 hit
points, attack 20), found and never told. The rumour is Merryn's, at a meeting after her first,
while Old Nick lives. A light weapon, 1d8+15, borne by the thief, the bard and the sorcerer, that
casts Grasping Roots three times a day.

## 7. Encounters, and what is new

MONSTERS §6.2's roster, in its monsters file: the Wrack Gull and the Bilge Rat, the Wrack Smuggler
and the Wrack Bowman, the Ashen Overseer, the Devilfish and the Great Devilfish, the Tide Elder and
the Warden of the Tide. F6 and the Brokenback place Sunderwood's Ashen Gleaner beside the
overseers, so the gleaner is met here first; Nick's Locker holds Old Nick, the devilfish's third
kind, at the cap. The Dead-Drop's are its doc's. New here (`novel`): the devilfish, heather
underfoot and the wreck, the Tide Ship's site.

## 8. The numbers

- **The curve** (`tools/tests/curve.ts`): a clear gives 11,426 xp a member of the 9,867 it asks
  and 7,729 gold of 6,000; a company entering at the floor and clearing three quarters leaves at
  14.3, +0.3 over the next floor 14. The enclave and the lair, counted in no clear, give 4,146 xp a
  member and 1,368 gold.
- **The gate** (`tools/tests/gate.ts`): at its maps' floors the area wins 97.3% of its 25 groups'
  fights (aim 90%); two under, its groups pooled at 10 manage 3.58 fights to a rest, 51.1% of the
  floor's 7 (aim at most 66.7%). The road is walked every time at 12. The bosses at their floors
  and two above: the Great Devilfish 66% and 99%, the Warden of the Tide 66% and 100%; Old Nick 57%
  at 30 and 81% at 32.
- **Fights to a rest** (aim 6 to 8 at 12, 6.25 to 8.25 at 13): E6 7.20, Kelp Hole's two levels
  6.83 and 6.19, F6 8.02, the Tide Ship's three decks 5.72, 7.36 and 6.77 and the Rift 7.24; the
  Brokenback 7.48 at 14 (aim 6.5 to 8.5). Three figures are off their aim, inside the limits: the
  weather deck's 5.72, the Rift's 83% won at 12 and Old Nick's 81% at 32. The gate judges the
  Dead-Drop's levels here too, by their own floors (`docs/areas/dead_drop.md`).
- **Density** (`tools/tests/density.ts`): within 8 squares in the core, E6 100% and F6 95.9%;
  within 12 in the country, E5, F5 and F7 100%; the dungeons 100% within 7, the Rift 97.6%.
- **The ladder:** rung 13 is Wrackholm's (`gear`, in its checks): the same with a plus from
  Saltreach's and Wrackholm's finds. The dearest find, the Plate Mail +1 at 1,350 gold, sits in the
  window, 2,500, and the Brokenback's, Keelhaul at 1,600, in the Sunderwood's, 3,000.

## 10. Names

Wrackholm's names are the sailors' English, the tongue that named Brandy Hole and the Wyke, and
stay: Wrackholm, the isle of wrack (weed and wreckage both); the Tide Ship; and Kelp Hole for
Smugglers' Cove, which NAMES §1 counts a bare description, a sea cave with kelp on its rocks in
Brandy Hole's pattern. The Tidefolk's tongue (docs/areas/saltreach.md §10) names nothing here: the
isle is the Compact's, not theirs. The Dead-Drop keeps its name until #22 says otherwise.

The hollow's two finds (#861) keep the sailors' English, and the kind after the name as the captain's
cutlass does (Slack Water, Cutlass +2). Corposant is the old sailors' word for the cold flame that
stands on a mast and a yardarm in a storm, from the Portuguese *corpo santo*: a morning star with a pale
light on every point of its head. The Runner's Coat is a Compact runner's, the hall's first rank (§6;
DESIGN §10.2), cut to run in. Neither name says what it does: the sheet says LIGHTNING, and the stat
says speed (§9, #861's 8).

The enclave's names keep the sailors' English too. The Brokenback is what the isle's crews call a
ship that has broken her back on the rocks, and here it stands for the wreck on E5's black rocks,
whose board is gone. Keelhaul is the old punishment of hauling a man under a ship's keel, and the
kind follows after the name as the cutlass's does (Slack Water, Cutlass +2). Neither name says what
it does: the sheet says COLD.

The lair's name keeps the sailors' English too. Nick's Locker is the crews' name for the sea cave
under F5's reef, on the pattern of Davy Jones's locker, the sailors' name for the sea's bottom,
where the drowned and their ships stay: Old Nick, the sailors' devil, keeps there what it takes, and
gives nothing back.

## Open and owed

- **Owed to no check:** its checks have no `owes`, Old Nick's row gone once the lair placed it
  (#835); the curve, the gate, density and the ladder hold Wrackholm with nothing owed.
- **Watched, not moved:** the weather deck's 5.72 fights to a rest, the Rift's 83% won and Old
  Nick's 81% at 32 sit between their aims and their limits. What the owner finds by hand goes here;
  none yet.
- **Cut:** E7's scrap of shore, laid in the Wold's box (plan, §11).
- **What is next:** nothing. The plan's briefs are all built, and a new box starts its brief there.
