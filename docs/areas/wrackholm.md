# Wrackholm: step IV of the road, the smugglers' isle

The fourth step of the road of levels (DESIGN §9, EXPANSION §2.2), band 12–14, and the smallest
area on it: a heather moor with a rocky east end, out in Sylmeer, reached only by the smugglers'
boat from Saltmouth. Kelp Hole is where the Compact's crews land the Hand's cargo, and the Tide Ship
rides at anchor under the east cliffs with shards and people in its hold, Hale chained in its last
row and the stolen Tide Stone glowing in its forward hold. This is its area doc (EXPANSION §4, §6
and §8.2). Its work is filed under #154 (Phase 1.2, #149): its two boxes (#187, #189), Kelp Hole
(#188), the Tide Ship (#190), its chapter (#191), its side quests (#192) and its drawings (#193).
Figures are measured on main at `2cc52cd` (29 September 2026) with `worldGrid`
(`src/game/atlas.ts`).

E6, the moor and the landing, is built (#187), and with it the area is listed in AREAS; Kelp Hole's
two levels are built under it (#188), F6, the east rocks, beside it (#189), and the Tide Ship's
three decks, its Rift and the stair's foot off F6's shore (#190); and in F6's rock a hollow behind a
second secret door holds two finds off the ladder, a lightning morning star and a coat that raises
speed, the blade in the area's first locked chest (#861, §4.6). Round the isle the bounds' three
strands of shore, E5, F5 and F7, are built as country with no group; in E5's black rocks lies the
wreck of the Brokenback, the enclave, entered at her break, and under F5's reef lies Nick's Locker,
the lair, where Old Nick keeps Holdfast (#835, §12). Its content is `src/content/areas/wrackholm/`
(`index.ts`, its maps, monsters, items and atlas, its walkthrough; its chapter of the one quest, The
Stone Carried Home, in `chapter.ts` and its side quests in `quests.ts`, #192, with the Compact's
Fence's and Factor's rungs in `guilds.ts`, #635); it has no town and no businesses, so no rooms. Its
part of the world map is its folder's (`atlas.ts`, #186), which the Area now carries; the plan no
longer spreads it in. Its ids: the area and its zone `wrackholm`, the cove `smugglers_cove` (the id
stays under the new name, NAMES §3) and its sea cave `smugglers_cove2`, the ship's decks
`tide_ship`, `tide_ship2` and `tide_ship3`, its Rift `tide_ship_rift`, the stair's foot
`dead_drop_stair` and, below it, the drop, the vaults and the counting house, the Dead-Drop's three
levels, `dead_drop`, `dead_drop2` and `dead_drop3` (docs/areas/dead_drop.md). The bounds' (#835) are
the strands `wrackholm_e5`, `wrackholm_f5` and `wrackholm_f7`, the enclave `brokenback` off E5 and
the lair `nicks_locker` under F5's reef.

---

## 1. Where it is

The atlas (`src/content/areas/wrackholm/atlas.ts`, which the Area carries) makes Wrackholm one zone:

| Zone | Band | Squares | Built |
|---|---|---|---|
| Wrackholm | 12–14 | 1,974 | E6, the moor and the landing, laid at 136,158 (#187); F6, the east rocks, at 168,158 (#189); the bounds' strands, E5 at 136,126, F5 at 168,126 and F7 at 168,190 (#835) |

Squares are the ones the atlas gives it, shallows included. Without the shallows the isle is 1,754
squares, about 1.7 zone maps (EXPANSION §1 has 1.7), and every one of them a company could walk:
grass 878, heather 514, hills 158, rock 105 and sand 99. It runs from x 142 to x 199 and from y 150
to y 210, in the middle of Sylmeer, with Saltreach's Saltings to the west across the water, the
Deepthorn's Penspern to the north-east and Hearth Isle to the east. The zone's band is the folder's:
12–14, the area's, and the boxes rise through it (§4).

**The grid** (EXPANSION §8.2; docs/areas/shelf.md §1). The isle is two boxes, E6 and F6, and 234
squares of shore in the four round them (E5, F5, E7 and F7): E5, F5 and F7 are built as the
bounds' strands (#835, §12), and E7's is laid in the Wold's box (§11). Its only neighbour on the
grid's land is the Wold, 13 squares of shallow at its south-west corner where the Glasswold's coast
comes near; no way runs there.

Its edges are the sea on every side. Its ways:

- **The landing,** at 152,172, at the head of an inlet off E6's west shore (§4.2), where the
  smugglers' boat from Saltmouth puts in (`src/content/atlas.ts`; #164). A crossing, open from the
  start for the fare (EXPANSION §2.2, §7): Wrackholm is the first area a company reaches by paying,
  and the boat is how it leaves.
- **Kelp Hole,** at 154,170 in E6, the cove's mouth in the cliff above the landing. Its sea cave lets
  out by a flooded passage onto F6's east shore at 196,167: a way out and not in (§4.3).
- **The Tide Ship,** boarded from F6's shingle at 182,188 by night, in Dando's boat; the ship lies
  off the shore, its decks' plates at 208,192 and beside it in the sea, and a company rows itself
  back to the shingle at any hour.
- **The Dead-Drop's stair,** from the Tide Ship's hold down to the stair's foot, one room at 26–28
  with the way back up (#190): a warning, not a wall. The Dead-Drop past it is #22's; its three
  levels, the drop, the vaults and the counting house, are built (docs/areas/dead_drop.md §4.1 to
  §4.3).
- **The Brokenback,** at E5's 18,28: the break in a wreck's side in the black rocks at the north
  strand's west end, entered from the strand at 18,29. An enclave at 14–15 beside the road, counted
  in no clear (#835, §12.5).
- **Nick's Locker,** at F5's 16,30: the way in under the reef at the north strand's east end, walked
  into from the strand at 16,31 and waded into from the shallows at 16,29. The artifact's lair at
  30–32, counted in no clear (#835, §12.6).

`node tools/worldmap.ts out.png --zones` paints it.

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

Its atlas rows (`src/content/areas/wrackholm/atlas.ts`, #186): the zone at 12–14, Kelp Hole's two
plates (#188), the Tide Ship at 13–14 and the sites. The atlas has the cove and the ship as planned plates,
the sites (Kelp Hole, the Tide Ship) and the links (the boat and the two ways in); the
Dead-Drop's plates are the drop's, the vaults' and the counting house's, built (#22), and the
built exits draw the stair. Its systems are Saltreach's (#150) and the boat's (#164); its monsters
are drawn in #193.

- **The moor and the landing** (E6, `wrackholm_e6`, core, band 12–13; #187): the landing stage at
  the head of an inlet on the isle's west side, the smugglers' huts round it, Kelp Hole's mouth in
  the cliff above, the heather moor north and east. Its groups: bilge rats in the huts, wrack gulls
  on the inlet's cliff and at the lookout, two crews of smugglers and bowmen on the paths, devilfish
  in the pools under the south hills. The area is listed with it (`src/content/index.ts`), its
  monsters and atlas carried by its Area and no longer in AHEAD or the plan.
- **Kelp Hole** (`smugglers_cove` 12–13 and `smugglers_cove2` 12–14, two levels of 16×16; #188): the
  crews' cave behind the mouth in E6's cliff, its fires, its landing where the sea comes in under the
  rock and the crates under the customs seal, the chained rows and the crews' strongbox; and the sea
  cave below its ledge, with its pools, the Great Devilfish at the back and the boy who feeds it.
  Six groups and the boss (§4.3).
- **The east rocks** (F6, `wrackholm_f6`, core, band 13–14; #189): heather from the moor rising to
  a mass of grey rock, open grass east to the shore, the hermit's cell and the cairn on the point,
  and the cliff over the anchorage with its path down to the boats' shingle at 182,188. Its groups:
  gulls on the rocks, a crew of smugglers and bowmen on the heather, the Hand at the smugglers'
  watch in the rocks, bilge rats at the landed stores on the east shore, and devilfish in the pools
  under the cliff by night. Its items are the founder's seal and, in a hollow in the rock's east face
  behind a second secret door, a lightning morning star and a coat that raises speed (§4.6, #861;
  `items.ts`).
- **The Tide Ship** (`tide_ship` 12–13, `tide_ship2` 12–13 and `tide_ship3` 12–14, three decks of
  16×16, with the Rift `tide_ship_rift` 12–14 and the stair's foot `dead_drop_stair` 26–28; #190):
  boarded by night in Dando's boat from F6's shingle; the weather deck and the devilfish over the
  side, the lower deck's rats, the Hand's post and the captain's cabin with the papers and the log,
  and the hold, its crew among the chained rows, Hale in the last row, the Tide Elder at the
  bulkhead and the shard-cut past him; the Stone's Rift and its Warden, and the stair down (§4.5).
- **The north strand's west end** (E5, `wrackholm_e5`, country, band 12–13; #835): the bounds'
  first, the moor's grass running down from E6 to a strand of sand and weed. A ship's figurehead
  with a riddle; behind the soot on a stack of rock, a hollow where a lamp with a red glass was kept
  (§12.2). In the black rocks at the west end, the break in a wreck's side is the way into the
  Brokenback (§12.5). No group.
- **The north strand's east end** (F5, `wrackholm_f5`, country, band 13–14; #835): the strand
  running on under the east rocks' north face, a cairn of shore stones and, behind the scales on a
  stack's foot, the store where the bait was kept (§12.3). In the reef at the east end is the way in
  under it to Nick's Locker, the lair (§12.6). No group.
- **The strand under the anchorage** (F7, `wrackholm_f7`, country, band 13–14; #835): the shingle's
  sand and the cliff path's rock running on south below F6's cliff, a spring at the cliff's foot and,
  behind the cut chain by a stack, the hollow where someone hid in irons (§12.4). No group.
- **The Brokenback** (`brokenback`, enclave, one level of 16×16, band 14–15; #835): the wreck on
  E5's black rocks, her back broken and her hold open to the tide, entered at her break from the
  strand. Three overseers with a gleaner at the hold's mouth and four gleaners at the master's cabin
  aft; under the cabin's deck, behind one plank worn bright, the master's strongbox, which holds
  Keelhaul, a long axe whose blows carry cold (§12.5). Counted in no clear.
- **Nick's Locker** (`nicks_locker`, the lair, one level of 16×16, band 30–32; #835): Old Nick's sea
  cave under F5's reef, entered at 16,30. Up a passage that floods to the knee, Old Nick, what the
  smugglers fed first, lies in the cave's throat, the one way in; past it the ship it took, on her
  side and stripped to her ribs, and against her keel her master with Holdfast on him, a smuggler's
  knife that casts Grasping Roots; behind the kelp grown green over the rock, his sea chest in a dry
  cleft (§12.6). Counted in no clear.
- **Weather.** The gulf's: mild winters, cool summers, a narrow day, wet autumns and much fog.
  Fronts reach it three hours after they cross the Foreland.

## 4. What is still to build

E6, Kelp Hole, F6 and the Tide Ship are built. The whole of the isle is built at
full density, since a company crosses to it for the ship and nothing else:

| Box | Name | Kind | Band | Land | What is there | Its step of the quest | Issue |
|---|---|---|---|---|---|---|---|
| E6 | The moor and the landing | core | 12–13 | 663 (grass 318, heather 238, hills 76), 72 shallow | the landing at 152,172; the heather moor; Kelp Hole's mouth at 154,170; gulls on the cliffs | the cove's crews, and whose orders they take | #187 |
| | Kelp Hole | dungeon, two levels of 16×16 | 12–13, 12–14 | | the crews' cave and the sea cave, where the Great Devilfish is fed | | #188 |
| F6 | The east rocks | core | 13–14 | 857 (grass 393, heather 276, rock 105), 71 shallow | the rocky east end; the hermit who counts the ships; the Tide Ship's anchorage at 182,188 | the ship at anchor | #189 |
| | The Tide Ship | dungeon, three decks of 16×16 | 13–14 | | the deck, the lower deck, the hold: the chained rows, Hale, the papers, the forward hold and the Stone; the stair down | the Stone found, the papers read | #190 |

The bands rise from the landing, 12, to the forward hold, 14, as the gate asks (EXPANSION §5.2).
The bounds come after the plan (§12, #835): the scraps of shore in E5, F5 and F7 are built as
country at 12–13 and 13–14 and E7's is the Wold's (§11); the enclave, the Brokenback, is built off
E5 at 14–15 and the lair, Nick's Locker, under F5's reef at 30–32.

**The order** is the boat's: E6 and the cove, where the company lands; F6 and the ship. Building
waits on Saltmouth (#176, #177) and the boat (#164), and on Saltreach being played, since no more
than two areas are in flight at once (EXPANSION §3).

The places, as the atlas and the docs have them:

| Place | Box | What the docs say | On the atlas |
|---|---|---|---|
| The landing | E6 | the smugglers' boat from Saltmouth (STORY; #164) | the sea link's far end at 152,172 |
| Kelp Hole (Smugglers' Cove) | E6, and below | the Compact's crews and the Hand's cargo; the sea cave, where the Great Devilfish is fed (MONSTERS §6.2); the captain's brother (#56's 25); what the smugglers feed (#56's 28) | built: its two plates at 150,158 and 150,164, its way in at 154,170 |
| The east rocks | F6 | the hermit who has counted the ships since the founder died (#56's 26) | rock, 105 squares at the isle's east end |
| The Tide Ship | F6, and aboard | the hold's two kinds of cargo; Hale in the last row; the papers on Wenna; the Stone in the forward hold, with its Rift (DESIGN §9, STORY, MONSTERS §6.2); every name in the column (#56's 27) | a planned wreck at 182,188, its plate at 208,192 |
| The Dead-Drop | below the hold | the Compact's orders come from there; three third-prestige quests go down (#22, #19) | built: the drop, the vaults and the counting house, their plates at 208,204, 208,210 and 208,216, band 26–28 (#22); the Compact's Factor's rung, which asks for its orders, is built (§6, #635), and so is the Thief's third prestige, which steals them (docs/areas/dead_drop.md §5) |

### 4.1 The briefs

As Saltreach's (docs/areas/saltreach.md §4.1): drafts for the owner, each settled in its issue,
with the pay shared out over the isle's four maps (§8). Both boxes are core, so each is held to the
Foreland map's density.

### 4.2 E6, the moor and the landing (#187): core, band 12–13

- **Purpose.** Where the boat puts in: the landing, the smugglers' huts, the heather moor above,
  and Kelp Hole's mouth in the cliff. The isle's gentlest groups are nearest the landing, and the
  crossing line meets the company on the stage (#166).
- **Landmarks.** The landing stage at 152,172 and the huts round it; the moor rising north and
  east; the cliffs with the gulls; the cove's mouth at 154,170.
- **Points of interest,** about eight features and eight groups:
  - the landing, and the boat back to Saltmouth (#164);
  - the smugglers' huts, and the cache under one hut's floor;
  - the cove's mouth, the way into #188;
  - a cairn on the moor's crown (#45), a camp in the lee of the cliff (#45);
  - a lookout on the west cliff, with Saltmouth across the water;
  - a shrine the Tidefolk left, its bowl full of shells (#45).
- **Encounters.** Wrack gulls in eights on the moor and the cliffs (two groups); Wrack smugglers
  with their bowmen on the paths (three groups); bilge rats in the huts.
- **Quests.** The chapter's first entry (§5). The Captain's Brother starts here with the captain,
  who will not meet the company's eyes (§6).
- **The secret and its hint.** A smugglers' cache under a hut's floor, with a Compact knife in a
  Helmstow coat and the crews' pay in faceless coins. The hint: the gulls sit on one roof and no
  other.
- **New here.** Heather underfoot (#162); an area reached by a crossing; the crossing line said on a
  landing stage.
- **Finds.** A Long Bow +1 in the cache.
- **Pay.** About 1,700 xp a member.
- **As built** (#187, 1 October): the brief's places, the groups at the line's standard size. The
  plan's landing, 152,172, and the cove's way in, 154,170, lay inland on the atlas, so an inlet is
  cut in from the west shore: the stage stands at its head, at 16,14, and the cliff over its north
  side is carried east so that the cove's mouth, at 18,12, opens in it above the stage. The landing
  is the boat's far end, and #177 built the boat: Kitto sells it on Saltmouth's quay and lands the
  company on the stage at 16,15, and on the stage he sells the way back, at half the fare to a
  member of the Salt Compact as on the quay (#182); the outdoors' walk now
  starts from a crossing's landing too, so the isle is no longer cut off. The crossing line on
  the stage is the boat's to say. The
  captain stands on the stage with two lines and no flag, for The Captain's Brother to hang on
  (#192, #188). Six groups: eight bilge rats in the huts and eight gulls on the inlet's cliff,
  nearest the stage; eight gulls at the lookout; two crews of two smugglers and two bowmen on the
  paths north and east; and four devilfish in the pools under the south hills, the far end. The
  devilfish, at 13, take the place of the brief's third crew: with every other group at 12 the
  groups' levels could not rise to the band's top, as the curve asks, and so E6 places the family
  before Kelp Hole does. The cache is the hut south of the inlet with the gulls on its roof, its
  door found by searching from where they are seen; it holds the Long Bow +1 and 140 gold. The cairn
  on the crown, the camp in the lee of the south hills, the Tidefolk's bowl on the west shore, the
  lookout and four more on the moor are the box's other points: every square is within 8 steps of
  one. As measured it pays about 1,920 xp a member and 404 gold. The gate at 12 wins every fight, at
  7.3 fights to a rest (7.1 as built; re-statted to #409's line, #18), and walks the road (the rats,
  the inlet's gulls, the east path) every time; two under, at 10, it wins every fight too (past 10
  the gate judges a company two under by its day, #851). What the owner finds by hand goes here when
  the box has been played.

### 4.3 Kelp Hole (#188): dungeon, two levels of 16×16, band 12–14

- **Purpose.** The cove where the Compact's crews land the Hand's cargo before it goes out to the
  ship, and the sea cave under it, where the Great Devilfish is fed (MONSTERS §6.2). Kelp Hole,
  once Smugglers' Cove (§10).
- **Landmarks.** The upper cave: crates under the customs seal on the ledges, the crews' fires, an
  overseer with the chained. The sea cave: pools, kelp on the rocks, and the Great Devilfish at
  the back with the boy who feeds it.
- **Points of interest,** about seven features and eight groups a level: the crates and their
  seal, the crews' fires, the chained rows, the ledge down, the pools, the flooded passage.
- **Encounters.** Smugglers and bowmen on the ledges (three groups); an overseer with the chained,
  the first sight of the Hand's grey hands; devilfish in the pools (two groups); the Great
  Devilfish, boss, level 14, size 1.9, at the cave's back.
- **Quests.** The Captain's Brother's end: the brother is the overseer (§6). What the Smugglers
  Feed: the boy, and the choice (§6).
- **The secret and its hint.** A flooded passage from the sea cave to the isle's east shore, a way
  out and not in. The hint: the tide-mark on the cave's wall stops short of the roof at one place.
- **New here.** A boss that is fed; the devilfish in their own water, met first in E6's pools
  (#187).
- **Finds.** The crews' strongbox: a Plate Mail +1, the first plate with a plus on the road and
  plate's wearers' step on the ladder (#399).
- **Pay.** About 2,180 xp a member: 2,400 less what E6 pays over its 1,700 as built (§8).
- **As built** (#188, 1 October): two levels, `smugglers_cove` (the crews' cave, 12–13) and
  `smugglers_cove2` (the sea cave, 12–14), both floored at the area's 12 so that the boss is judged
  at 12 and 14 as the issue asks. The cave's mouth at E6's 18,12 opens on the crews' hall: their
  fires and the first crew; west, the landing, where the sea comes in under the rock and two boats
  tie up, the crates stamped with the Helmstow customs and the second crew; north along the landing,
  the ledge down. Behind the landing, the chamber of the chained rows, where four overseers (13)
  keep the irons, the cave's hardest and farthest group, and beyond them the store with the crews'
  strongbox: the Plate Mail +1 and 600 gold. Colan, the brother, sits by the rows once the overseers
  are down, with #192's first lines and no flag. Below, the third crew at the ledge's foot, four
  devilfish in the west pools and four in the east, and the Great Devilfish (14) in the black pool
  at the back, with Tam a square short of it, his first lines and no flag, gone once it is dead. The
  secret: west of the tide-mark, which breaks by the west wall where the stone below is scoured
  bare, a search finds the flooded passage, and it lets out on F6's east shore at 28,9, north of the
  hermit's point, as the brief has it (#189 moved it from E6's south shore): nothing on that side
  leads back in. The brief's encounters and the boss do not fit 2,180: the boss alone pays about
  1,475 a member, and the six groups and the boss come to about 3,450 a member, and 1,676 gold,
  1,230 of it in the chests. The Great Devilfish is set off the boss line for the gate, at 650 hit
  points and 12d7+15 (600 and 8d7+10 until #806): the bot wins it 66% at 12 and 99% at 14. At 600 and
  8d7+10 it won 66% at 12 and 91% at 14, where the line's 674 and 13d7+19 won
  11% and 28% (69% and 96% after the re-stat to #409's line, #18, which leaves it as set; 96% and
  100% with the first prestige, #541, past the limit at 12, until #806 set it again, §9). The crews'
  cave at 12 wins every fight, at 6.8 fights to a rest (7.0 after the re-stat), and two under, at
  10, wins every fight too; the sea cave at 12 wins 91.5% of its fights with the boss, at 6.5 to a
  rest (92.3% and 6.6 after the re-stat, 99% with the first prestige, 91.5% again since #806), and
  83% at 10, inside the limit. The walkthrough plays both levels, the boss at 14, and leaves by the
  passage. What the owner finds by hand goes here when it has been played.

### 4.4 F6, the east rocks (#189): core, band 13–14

- **Purpose.** The moor's rocky east end, the hermit who has counted the ships since the Compact's
  founder died, and the Tide Ship riding at anchor below the cliffs.
- **Landmarks.** Heather rising to rock; the hermit's cell on the point; the ship seen from the
  cliff top by day, low in the water; the way down to the boats that row out to it at night; the
  cairn on the point.
- **Points of interest,** about eight features and eight groups:
  - the hermit, and the founder's last letter (#56's 26);
  - the cliff top, and the ship below it;
  - the boats, the way into #190 at night (`when`);
  - the cairn on the point, and the grave under it;
  - a bandit den in the rocks, the smugglers' watch (#88);
  - a camp in a hollow (#45), a shrine on the shore (#45).
- **Encounters.** Bilge rats on the shore; smugglers and bowmen at the den; gulls on the rocks;
  devilfish in the pools under the cliff at night.
- **Quests.** The Hermit of the Point (§6). The chapter's entry: the ship at anchor (§5).
- **The secret and its hint.** The founder's grave under the cairn on the point, with his seal.
  The hint: the hermit's count starts at a date. A second secret door, in the rock's east face, with a
  hollow behind it (#861, §4.6): the hint, a groove in the turf that stops at the rock.
- **New here.** Nothing, as built: dens are on the Downs already, and boarding by night is #190's.
- **Finds.** The founder's seal, a quest item the Compact's hall takes at the rank that reveals
  (#22; #182 left it there, so as not to tell the reveal at Runner); and the hollow's two, off the
  ladder (§4.6).
- **Pay.** About 1,600 xp a member.
- **As built** (#189, 1 October): the brief's places, five groups at the line's standard size. The
  company comes in from the moor at the west edge, 0,12, where E6's east path crosses. The rock mass
  in the middle is solid, with one cleft into it from the south, and in the hollow at the cleft's
  head is the smugglers' watch, a den (#88): its keepers are the Hand, two Ashen Overseers and two
  Ashen Gleaners, and its brood the crew of two smugglers and two bowmen on the heather path, back
  every two days until the watch is burnt. The keepers are the box's hardest group, at 14 and 6.6
  fights to a rest at 13, and the gleaner, MONSTERS §6.3's, is met here before the Sunder: the curve
  asks F6 for a group at 14, and the only Wrackholm monsters at 14 are its two bosses. Eight gulls
  on the rocks' north face, eight bilge rats at the landed stores on the east shore, and four
  devilfish in the pools under the cliff, by night only, are the rest. The atlas's 182,188 lay in
  the south hills, so a rock face is cut into them, with a path a square wide from the cliff top
  down to a shingle where the boats lie: the boats are there by night, the shingle empty by day, and
  the way aboard is #190's. The hermit stands at her cell on the point with two lines and no flag,
  for The Hermit of the Point to hang on (#192, #182). Her tally of ships is cut in her cell's
  wall from a date; the cairn a few steps off, on the point itself, has a door a search finds, and
  behind it the founder's grave, with his seal and 150 gold. The camp in a hollow of the south-west
  moor, the shrine on the north-east shore (personality), the cliff top and five more points are the
  box's others: 95.9% of its squares are within 8 steps of one, the furthest 11. As measured it pays
  about 1,658 xp a member and 487 gold. The gate at 13 wins every fight, at 7.67 fights to a rest
  (8.6 in the ladder's gear, #406, over the aim's 8.25; 8.2 after the re-stat to #409's line, #18,
  inside it); the isle's road stays E6's, and F6, its floor above the area's, counts two under in
  the area's pool. What the owner finds by hand goes here when the box has been played.
### 4.5 The Tide Ship (#190): dungeon, three decks of 16×16, band 12–14

- **Purpose.** The act's second dungeon and its heart: the smugglers' ship whose hold carries
  shards and people bound below (DESIGN §9, STORY, MONSTERS §6.2). Boarded from F6 at night.
- **Landmarks.** The weather deck at night, with the rail and the boats; the lower deck, the crews'
  quarters and the captain's cabin with the ship's papers and its log; the hold, the chained rows,
  the beam carved EVERY SHARD IS A STEP, the shards in straw, Hale in the last row; the forward
  hold, bulkheaded off, the Tide Stone glowing through its sacking with its Rift round it; the
  hatch down to the Dead-Drop.
- **Points of interest,** about seven features and eight groups a deck: the rail, the boats, the
  hatches, the cabin and its papers, the log, the rows and their chains, the beam, the Stone, the
  hatch.
- **Encounters.** The deck: smugglers and bowmen on the rail, devilfish coming over the side (two
  on the ship's waist at night, with a bowman on the rail: MONSTERS §6.2's second fight). The lower
  deck: bilge rats, the crews. The hold: two overseers behind four smugglers among the chained rows,
  the chains holding the front row while the bowmen shoot the back (#160, #161). The forward hold:
  the Tide Elder, and the Warden of the Tide, boss, level 14, over the Stone; the tear closes when it
  falls. No machine is met aboard (MONSTERS §2.2; #158).
- **Quests.** Every Name in the Column (§6); the papers, the log and the Stone (§5). Hale is freed,
  not handed to (#43), and his sergeant's token is known to him (#56's 20, #156).
- **The secret and its hint.** The forward hold's bulkhead has a second way through, a shard-cut in
  the planking behind the straw, for a company that cannot take the door head on. The hint: the
  straw is fresh on one side and old on the other.
- **The stair down.** A hatch in the hold's floor, a smell of clean cold air, and a line that says
  what is below is not for a company that came for a Stone. It opens; what is down it is #22's,
  and until that is built it lands on one room of 26–28 country with a way back up: a warning, not
  a wall (EXPANSION §5.2, #22).
- **New here.** A ship as a dungeon, three decks; a boss that closes a tear on a ship; the first
  door into the hull's depths.
- **Finds.** The Tide Stone (a quest item, plain: #151, call 6); the ship's papers and its log
  (letters read from the pack, #76); the captain's Cutlass +2, named; a Long Axe +1, the ladder's
  (#399).
- **Pay.** About 3,300 xp a member.
- **As built** (#190, 1 October): three decks, `tide_ship` (the weather deck, 12–13), `tide_ship2`
  (the lower deck, 12–13) and `tide_ship3` (the hold, 12–14), the forward hold's Rift
  `tide_ship_rift` (12–14) and the stair's foot `dead_drop_stair` (26–28). The decks are floored at
  12, as Kelp Hole's are: the curve asks each map's hardest group to stand near its top, and only the
  bosses and the borrowed gleaner are Wrackholm's 14s, so the plan's 13–14 could not hold. By night
  Dando, an old Compact oarsman, sits in his boat on F6's shingle and rows out whoever pays 20 gold,
  leaving at midnight and landing an hour on (a crossing, #164); by day nobody rows, and a company
  rows itself back over the side at any hour. The weather deck: the rail and the boats under it, the
  foremast, the waist, the main hatch, the helm and the bow, a locker with 300 gold, and four
  devilfish over the side by night. Once the causeway at Sheer Point has been stood on, the
  starboard rail, 11,6, looks east on its line on the sea, once (#449; docs/areas/ashfall.md §9,
  #449's 1 and 2). The lower deck: eight bilge rats in the crews' quarters, three
  Ashen Overseers at the hatch down, and aft the captain's cabin, with the ship's papers and the log
  on the table and the sea chest with Slack Water, a Cutlass +2, and 1,000 gold. The hold: the
  chained rows under the beam carved EVERY SHARD IS A STEP, the shards in straw, and among the rows
  the crew, two smugglers and two overseers before two bowmen, the overseers its leaders, whose fall
  breaks the rest; in the last row strangers while Hale holds the Scarth, and Hale once #156 has taken
  him from it (`q_hale_taken`, a flag #156 sets on its own condition, #415) and the crew is down: he knows the
  company, says the Regent came for him the night he got his copy, and goes over the side with the freed, setting
  `q_hale_freed`. Forward, a Tide Elder and an overseer stand before the bulkhead's door; the straw against the
  bulkhead west of it is fresh on one side, and a search there finds the shard-cut, a way past them.
  In the forward hold the Hand's strongbox (1,200 gold, a Long Axe +1, the ladder's for the barbarian at 13 (#399), and
  an elixir) and the Stone under
  its sacking, with its tear: the Rift is generated (`hall`, brine, seed 2), a Tide Elder and three
  brinelings in its rooms and the Warden of the Tide alone at its heart, with the Tide Stone and 700
  gold in the hoard beside him; his fall quiets the tear. Aft, the hatch in the floor opens on the
  stair, and its foot is one room of clean cold stone, its sign the Dead-Drop's band, a way on into
  the dark at its far end, now an exit down to the drop (4,1, with `dd_door` one in from it at 4,2;
  docs/areas/dead_drop.md §4.1), and the stair back up. The Warden is set off the boss line, at 780 hit
  points and 12d7+18 (674 and 10d7+15 until #806) against the line's 13d7+19 (38% at 12) and the
  escorted boss's 7d7+11 (97%): the gate wins him 66% at 12 and 100% at 14. At 674 and 10d7+15 it
  won 63% at 12 and 96% at 14, dressed by #399's ladder and measured after #414's
  re-stat (94% and 100% once the gate's company took its first prestige, #541, past the limit at
  12, until #806 set him again, §9). As measured the ship pays about 3,500 xp a member, 1,843 of it
  the Rift's, and 3,532 gold, which brings the area's gold to the 6,000 its training costs. Each
  deck at 12 wins every fight, at 6.1, 7.6 and 7.0 fights to a rest, inside the aim of 6 to 8, the
  Rift 83% with its boss (81.5% before the first prestige, 97% with it and the Warden as it was; off
  the aim of 90% and inside the limit of 80%) and 7.6 to a rest; two under, at 10, the decks win
  every fight too, the Rift 55.5%. Every square of every deck is within 5 steps of a point. The
  walkthrough rows out by night, plays the three decks at 12, finds the shard-cut, frees Hale once
  he is taken, wins the Warden at 14 and the Stone, and goes down the stair and back. What the owner
  finds by hand goes here when it has been played.

### 4.6 The hollow in the east rocks (#861): two finds off the ladder

The area's share of epic #18's eight items (DESIGN §5 and §6; the delegate's ruling, D1 to D4): one
weapon whose blows carry an element and one piece of gear that raises a stat while it is worn, to
each act past I, found and never told, off the ladder (no `GEAR` row dresses a company in either),
inside the area's window of 2,500 and in no shop. Wrackholm's are a lightning morning star and a coat
that raises speed. They lie in a hollow cut in F6's rock, behind a second secret door, the blade in
the area's first locked chest.

| Item | Kind | Dice or stat | Where | Price |
|---|---|---|---|---|
| Corposant, Morning Star (`corposant`) | a weapon of the Morning Star's classes: knight, paladin, ranger, barbarian, cleric | 2d6+3, the plain Morning Star's steel, and 1d6 of lightning on every blow that lands (`element`) | the iron-bound chest at the hollow's back, 17,10 (`f6_hollow_locked`, `locked: true`), no gold | 1,150 gold, 575 back |
| Runner's Coat (`runners_coat`) | armour, a coat of the Sharkskin Coat's classes: all but the cleric, the sorcerer and the monk | AC 8, a point under the Sharkskin Coat's 9, and speed +3 while worn (`stat`): a point of armour class and an earlier turn | the sea chest in front of it, 18,10 (`f6_hollow_chest`), no gold | 1,250 gold, 625 back |

**`hits()`.** The blade's is 13.5: the steel's 10 and the die at 3.5 (`ELEMENT_DIE`). The ladder's
weapon of its kind is the Morning Star from 11, +1 from 13 (11) and the Flail from 14 (12), so the
steel is a rung under the ladder's and the die is the gain: 2.5 over the +1 at 13 and 1.5 over the
Flail at 14, with a point less to hit than the +1. The coat's gain is the speed: the Sharkskin Coat's
9 armour against its 8, and a stat the fight reads (armour class, the round's order and a flight).

**Where it is.** The rock's east face on row 10, 20 squares from the way across F6 as a company walks
and 7 as the crow flies, across solid rock. The way across the isle is the one walk the quest needs: from
the moor at F6's west edge, round the rock's foot, to the shingle where Dando rows out. The door is at
20,10, between rock at 20,9 and 20,11; behind it three squares of stone floor, cut from the rock at 17
to 19, the entry with its event, the sea chest and the locked one. The squares are shut to every
walker but through the door, and nothing in the box, the chapter or the side quests sends a company
there. The five secrets the area already had hold a reward or are a way (the cache's Long Bow +1, the
grave's seal, the flooded passage, the shard-cut, the hoist), so none was free, and the cove, the ship
and the drop lie on the quest line.

**The hint** (`f6_drag`, 21,10, on the door's near side, always there): *A groove worn in the turf runs
up from the shore, cask-wide, and stops at the rock.* It explains nothing, and the door is found by a
search where it stops. Inside, an event at the entry (`f6_hollow`, 19,10): *A dry hollow in the rock, a
lamp-hook in its roof. Against the back wall a sea chest, and an iron-bound one.* The sea chest opens
to any company; the iron-bound one says "A locked chest." and, to a company with neither a Lockpick
standing nor an iron key, "Locked." and nothing (DESIGN §5, #857). The premade six's thief is born to
Lockpick. Nothing the road needs lies in it, and no quest turns on either find.

**The lightning.** The isle's maps place 16 monsters, 15 of them past 10, and 5 of those are weak to
lightning and none is immune or resists it (`elementMult`): the Dead-Drop's loader, tally clerk, hold
keeper and tallymaster and Ashfall's deep knocker, which the drop's second level places, machines at 26
to 28. The nine of Wrackholm's own at 12 to 14 and the borrowed gleaner at 15 are neither weak nor
strong: the die lands whole on every one. Sunderwood's nine past 10, the next area's, have none weak or
immune to it. No other element does better: nothing the isle places is weak to fire or cold, and
Sunderwood's one weak to fire is the hound, where its bear is immune to fire and the hound to cold;
nature and holy are the machines' immunities (§9, #861's 4).

**Built** (#861). Inert for every check: no monster, group, gold or pay is added or moved, so §8
stands, and the gate's, the harness's, the ladder's and the curve's figures are byte-identical to
main's (the PR holds the diff). Both prices are under Plate Mail +1's 1,350, the dearest find the curve
names for the area, so that line stands too. Density holds: F6 95.9% within 8 steps (704 of 734, 27
points, four more). `shipped.json` adds the door at 188,168, `corposant`,
`runners_coat` and the ids `f6_drag`, `f6_hollow`, `f6_hollow_chest` and `f6_hollow_locked`; nothing
moves. The walkthrough walks the detour in F6, on from the founder's grave (`theHollow`): the groove,
the search, the door, the coat from the sea chest and the blade from the iron-bound one, which the
company's thief picks; and holds the finds themselves (`hollowFinds`: shape, window, no shop, no row of
the ladder, no monster's drop, the one locked chest, the raise worn and carried, lightning against the
isle, found and never told, the distance from the road) and the lock's refusals on a game of its own
(`hollowLocked`, the real chest: refused with neither, opened by the thief, by a key, by the key spent).

## 5. The one quest here

Wrackholm's chapter is The Stone Carried Home (`chapter.ts`, #191), joined after Saltreach's; it
closes Saltreach's goal, and the zone's one step (EXPANSION §5.8) is the Stone found. Its entries:

- **The cove's crews** take their orders from below, and the crates carry the Helmstow customs
  seal; the goal points east along the moor to the ship.
- **The ship at anchor,** low in the water, boarded by night.
- **The hold:** two kinds of cargo, Hale in the last row, four words carved on a beam; the papers
  in the cabin, which say the girl from Gullwick was delivered below, months since, through the
  dwarves' deepest mine.
- **The Stone found,** glowing through its sacking, its Warden over it.
- **The Stone home:** back by the boat and the fen to Stienwierde, set in its socket; the Hearth
  burns steadier than it has since the Queen died (#168), and in the dark temples behind, something
  begins to sing (#175's `until`). The goal then turns east, to the Sunder, where the papers can be
  read (docs/areas/sunderwood.md §5).

The Stone is a plain quest item; the words carry the weight (#151, call 6). The chapter spends no
lock (call 1): the boat sails both ways for the fare, and a company that boards the ship before it
has seen the temples reads the journal true. The walkthrough plays it at 12, 13 and 14, in order
and with the ship boarded first.

**As built** (#191, 2 October): `chapter.ts`, joined after Saltreach's. It begins on landing
(`visited: 'wrackholm_e6'`) and is done once the Stone is home with the captain's table opened
(`q_tide_home` and `tide_ship2:ts2_table`, exported as `WRACK_DONE`), which is where the Wall now
begins. Seven entries: Kelp Hole's crates, the ship at anchor, the hold, Hale freed (once #156 has
taken him from the Scarth), the papers, the Stone found and the Stone home. Four goals, furthest
along first: back aboard for the papers, for a company that left the table shut; the Stone home to
the plinth in the Delta; down to the Hold; out to the Tide Ship. No goal sits on F6, whose floor of
13 would put the plinth's step over B5's band; the walk raises the level inside its plays, F6 at 13
and the Warden at 14. The plinth at Stienwierde takes the Stone: a feature met by its name, never a
person, there only with the Stone carried or set back, whose hand-in sets `q_tide_home`. That ends
the Tide Stone, lights the Hearth's first step, quiets the Delta's three Rifts and B6's brinelings,
gives the hermit on the hummock a last line and sets the temples singing on the approach to the
far roof's porch and across the nave's head before the apse's stair, whether or not the count has
stopped below. The
walkthrough plays it in order on from Saltreach's run, and with Saltmouth first, the temples not
seen: the ship boarded with the table shut, the Stone home, then the papers and the temples
singing while the Choirmaster stands. Sunderwood's walkthrough plays the Wall on from it.

## 6. Side quests

#56's four for Wrackholm, all taken by the owner on 28 September 2026 (#151, call 13), each built
with its map on the systems of #76 (#192):

| # | Quest | Level | Where | What it needs | Built in |
|---|---|---|---|---|---|
| 25 | The Captain's Brother | 13 | the captain at the landing (E6); the brother, who keeps the rows in Kelp Hole | a letter read from the pack; `after` (#41) | #187, #188 |
| 26 | The Hermit of the Point | 13 | the hermit (F6); the Compact's hall or Tallis, in Saltmouth | a letter; a hand-in at the first meeting (#43) | #189, #182 |
| 27 | Every Name in the Column | 14 | the Tide Ship's hold | the clerk's book read against the freed; a choice put by a person | #190 |
| 28 | What the Smugglers Feed | 14 | Kelp Hole's sea cave; the mother in Saltmouth | a choice; `after` | #188, #177 |

No change to #56's drafts. 26 is the Compact's line's first proof, taken at the harbour tavern
(#182, DESIGN §10.2); 27's sending decides who is at Rime Lodge to meet the freed (#56's 41, Act
III).

**As built** (#192, 3 October): `quests.ts`, the four on the built maps, every line #192's draft
or fitted to the maps by a fable pass (§9, decided by delegate for #192).

- **The Captain's Brother** (`brother`). Kitto on the landing stage asks, setting `q_brother`;
  Colan by the rows in Kelp Hole, once the overseers are down, sets `q_brother_found` and puts the
  choice: the truth carried (`q_brother_truth`) or his letter, sealed (`q_brother_letter`, Colan's
  Letter). Either way he is gone below and his crate stands empty (`kh1_colan_gone`). Told, Kitto
  sets `q_brother_told` and carries for the cove no more: Kelp Hole's landing crew, where his boats
  tie up, stands `until` it, so once next put down it does not come back. Given the letter, he takes
  it at the first meeting, asked or not, and pays 200 (`q_brother_delivered`). Saltmouth's Kitto is
  unchanged.
- **The Hermit of the Point** (`hermit`). Merryn (the draft's Senara is the lorekeeper of
  Henlys) at her cell on the point sets `q_hermit` and asks; Not yet sets nothing and she asks again,
  We'll carry it hands the founder's letter and sets `q_hermit_carried`. Ruan at the Keel takes it
  and pays 300 (`q_hermit_hall`), Tallis on the quay 500 (`q_hermit_tallis`). Her count begins on the
  11th of Frost, as her wall has it, and she does not say where the Old Man lies: the grave under
  the cairn is F6's secret.
- **Every Name in the Column** (`column`). Hale, freed in the hold, goes up the ladder with the
  freed as his words say, and waits at the weather deck's rail over the boats with the thirty and
  Wat's elder boy, at any hour, from `q_hale_freed` until he is answered. He asks for the clerk's
  book (`q_column`), in a chest in the cabin's corner (`ts2_clerk`) beside the papers; with the book
  carried, asked or not, he reads it and puts the choice: Saltmouth by the boat
  (`q_column_saltmouth`), or home by the coast road (`q_column_road`). Answered, they are gone with
  him, and the book stays in the pack. The boy is then on Saltmouth's quay, or on Gullwick's shingle
  beside Wat, who has words for him home with the board in the loft and without it. Before Hale is
  freed the rows ask whose the company is (`ts3_chained`), once the crew is down.
- **What the Smugglers Feed** (`feed`). Loveday on Saltmouth's harbour steps sets `q_feed`; Tam at
  the black pool sets `q_feed_tam`. The beast left alone, Loveday told sets `q_feed_told`; the beast
  slain, Tam's twin at the pool sets `q_feed_home` and he sits on the steps beside her. Her pay is
  words.

The walkthrough plays each both ways, in more than one order, and reads the log after each.

**The Compact's Fence's rung** (#635) is a guild quest and no one of #56's, built in `guilds.ts` on
the rules of DESIGN §8: *Where the Cargo Goes* (`compact_fence`, rank 2). Ruan says cargo goes
aboard the Tide Ship and none comes off, and sends a Fence to find where. The deed is the stair's
foot seen (`dead_drop_stair:dd_foot`), reported at any hall of the Compact for 200 gold and 600 xp;
a company that has been down the hatch already is paid at the taking, with the words for one that
came early, and both say not yet and name nothing below. The walkthrough takes it at the stair's
foot, before the foot is seen and after, and a Runner is not offered it.

**The Compact's Factor's rung** (#635, PR D) is the next in `guilds.ts`: *In the Founder's Hand*
(`compact_factor`, rank 3), offered to a Factor at either hall once Act IV opens (the Sleepers
seen, as the Surveyor's). A hall asks an order brought up from below; the deed is the Compact's
Orders in the pack (`{ item: 'compact_orders' }`, the counting house's out-tray, docs/areas/
dead_drop.md §4.3), a goal and never a hand-in, so the hall takes nothing and the Thief's third
prestige can still carry them. It pays 800 gold and 4,800 xp, once, and makes the company Partners;
a company that carried the orders before it took the rung is paid at the taking, with the words
for one that came early. The rank it pays reveals: Ruan, in the Keel at Saltmouth, puts the
Compact's choice once the rung is paid (docs/areas/saltreach.md §4.9, docs/areas/dead_drop.md §5),
the orders handed to the Wardens or the Compact taken over, each setting its own flag. The
walkthrough plays the rung beside the counting house's orders, not offered before the Sleepers are
seen, paid at the Keel and early, and Ruan's choice both ways.

### The artifact: Holdfast (#846)

Wrackholm's of the bounds' eight (DESIGN §9). Found and never told: no `seek` quest, no line in the
journal and no mark on the world map. #835 built the lair, Nick's Locker, with its door in F5's reef
at 16,30 and the rumour, once #845, #847 and the guardian's drawing were in (§12.6).

- **What it is:** *A smuggler's knife, its haft wound with kelp that has not rotted. / Wet, the weed
  on it moves.*
- **The rumour:** Merryn, the hermit on the east rocks (F6), who counts the ships, two lines more at
  a meeting after her first, words only: *One ship I counted in and never out. Her master had a
  knife the weed obeyed: cut a line with it and the kelp held her fast. / Old Nick had ship, master
  and knife. Nick gives nothing back.* It marks nothing on the world map. Built at every meeting
  after her first while Old Nick lives, whatever has become of the founder's letter; once it has
  fallen and the knife is taken, she says her own words alone (§9, #835's 28).
- **Slot and bearers:** a light weapon: the thief, the bard and the sorcerer.
- **Numbers:** 1d8+15, the Grey Knife's 1d8+14 and a point (EXPANSION §5.2). Found and never sold.
- **Power:** a spell (DESIGN §9, kind 3): Grasping Roots, three a day, of the druid's list, which
  none of its three casts.
- **The lair:** Nick's Locker, a sea cave of one level, its mouth in the reef on F5's strand under
  the east rocks, in sight of the hermit's point, at the cap's band, 30–32 (#845; §12.6).
- **The guardian:** Old Nick (devilfish, a new kind; boss, 32; docs/MONSTERS.md §13): *What the
  smugglers fed first.* Size 2; it reaches the back row, and its hits heal it. Its numbers are set
  by its gate: 1,600 hit points, attack 20 and 20d8+20 (§9, #835's 25).

## 7. Encounters, and what is new

MONSTERS §6.2 has the roster and the fights: the Wrack Gull, the Bilge Rat, the Wrack Smuggler and
the Wrack Bowman, the Ashen Overseer, the Devilfish and the Great Devilfish, the Tide Elder and the
Warden of the Tide; the hold, and over the side. Their drawings are #193's, nine issues (#231 to
#239). Wrackholm spends none of MONSTERS §3.3's asks of its own: it spends Saltreach's. F6 places
Sunderwood's Ashen Gleaner (MONSTERS §6.3) beside the overseers at the smugglers' watch (#189), so
the gleaner is met here first, and the Brokenback places them again: three overseers with one
gleaner at the hold's mouth and four gleaners alone aft (§12.5, #835); MONSTERS' Where column is the
owner's to change.

New in Wrackholm, for the novelty check (EXPANSION §5.4): the devilfish, a new family (E6 claims it,
placing them first); heather underfoot (#162); an area reached by a crossing (#164); a ship as a
dungeon; the Hand's overseers, grey to the wrist (MONSTERS §12); a boss that is fed; the first door
into the hull (#22). Its landmarks: a landing, a sea cave, a wreck. The check holds one of these
besides the devilfish and the heather (#190): the wreck, the Tide Ship's site. Nick's Locker places
Old Nick, the devilfish's third kind, alone (§12.6); the novelty check places the lair with the
Hearth by its floor (EXPANSION §5.2, #845's 7), so nothing of it counts on Wrackholm's line.

## 8. The numbers

- **Experience.** The curve (EXPANSION §5.2, #159) asks the climb from 12 to 14 over 0.75: 7,400 /
  0.75, about 9,867 xp a member, with today's `xpForLevel`. The shares of §4 add up to it, the side
  quests inside and the Dead-Drop outside. The isle is small, two boxes for a band two levels deep
  where Saltreach has nine, so its dungeons carry more of the budget than Saltreach's do: E6 1,920
  as built (#187), Kelp Hole 2,180, F6 1,600, the Tide Ship 3,300 and the four side quests 900
  between them (25 and 26 200 each, 27 and 28 250 each, §6): about 9,900. Kelp Hole as built pays
  about 3,450 (#188), since its boss alone is about 1,475, and F6 about 1,658 (#189); with the rest
  as they stand the area comes to about 11,200, some 14% over the curve's 9,867. The surplus is
  meant; a kill paid by level damps it past 14, and if a measure finds the climb too fast, the Tide
  Ship's groups short of its boss are what to trim. As built the Tide Ship pays about 3,500 (#190),
  200 over its share: its groups are trimmed to one or two a deck, and the brief's crews on the rail
  and in the quarters and the bowman over the side are cut, but each deck keeps a group strong
  enough for the gate's fights to a rest. A clear of the four maps gives 10,526 a member, 7% over
  the curve, and the side quests' 900 would bring it to about 11,430, 16% over. The Fence's rung
  (§6) adds 100 a member: the curve test counts 10,626 of the 9,867, 8% over (§9, #635's 6). The
  Factor's rung (§6) adds 800 more, with the guild quests counted in the area whose file holds
  them: 11,426 of the 9,867, 16% over (§9, PR D's 8).
  From here on a kill pays
  by level (#159); the curve's row reports what a clear falls short of as owed to #154 until the
  maps exist, and MONSTERS' open question 4, what a fight is worth from Saltreach on, is settled on
  the first box built.
- **Gold.** Training six members from 12 to 14 costs about 6,000 with today's `trainPrice`; the
  hold's strongboxes and the crews' drops pay it, and the isle has no shop to spend it in until the
  boat back. As built a clear gives 6,079 (#190): the ship's chests carry 3,200 of it. The curve
  test counts 7,729 now, with the Fence's rung's 200, the Factor's 800 (§9, #635's 6, PR D's 8) and
  the bounds' strands' 450 (§12).
- **The gate.** Each map at its own floor (docs/areas/thornmark.md §9, 17): a company at 12 wins nine
  in ten on E6 and one at 10 no more than one in four (past 10 the gate judges a company two under
  by its day, #851); the Great Devilfish is won two in three at 12 and nearly always at 14, the
  Warden of the Tide the same (§9, #806: their two maps hold their limits at no less).
- **Density.** Both core boxes at the Foreland's floor (EXPANSION §5.3); the bounds' strands at the
  looser floor (§12).
- **The hollow** (#861) pays no xp, gold or group, so the figures above stand (§4.6).
- **The bounds** (#835): the strands hold no group and pay no xp, and their finds hold 450 gold, so
  a clear gives 11,426 xp a member and 7,729 gold, and a company three quarters clearing the area
  from 12 still leaves at 14.3 against the next floor 14, inside the curve's 15 (§12.1). The
  enclave and the lair are counted in no clear. At the gate, re-measured with the strands laid,
  Wrackholm's 25 groups are won 97.3% of their fights at their maps' floors; two under, pooled, a
  company at 10 manages 3.58 fights to a rest, 51.1% of the floor's 7.
- **The Brokenback** (#835, §12.5) is counted in no clear and judged alone at its own floor, 14: a
  company at 14 wins every fight and manages 7.48 fights to a rest, inside the aim (6.5 to 8.5),
  0.7% of its days ending in a fight broken off; two under, at 12, 4.91, 65.5% of the floor's 7.5,
  inside the aim. Density: every square within 7 steps of a point, the furthest 5, no sign among its
  13 points. By the curve's count it pays 750 xp a member and 868 gold, a figure only, and its
  dearest find, Keelhaul at 1,600, sits inside the Sunderwood's window, 3,000. The area's pools and
  day are as they were without it.
- **Nick's Locker** (#835, §12.6) is counted in no clear and judged alone at its own floor, 30, on
  its one group's odds: Old Nick is won 57% at 30, inside the aim (30% to 70%), and 81% at 32,
  between the aim (90%) and the limit (75%). The harness's thrifty bot wins it from fresh 74% at 30
  and 88% at 32, in 11.8 and 10.5 rounds a fight (§9, #835's 25). Density: every square within 7
  steps of a point, the furthest 5, no sign among its 12 points. By the curve's count it pays 3,396
  xp a member and 500 gold, a figure only; with the Brokenback's the enclaves give 4,146 xp a member
  and 1,368 gold. No find is a window's: Holdfast is an artifact and the rest gold and draughts. The
  area's pools and day are as they were without it.

## 9. Decisions

Decided by the owner on 28 September 2026 (#151), and followed here:

1. **No story lock** (call 1): the boat sails for the fare, and the hatch to the Dead-Drop opens.
2. **The forward hold's tear is generated** (call 2), from #165's templates.
3. **The Hand's crews have left the Compact** (call 4): the cove's and the ship's crews are the
   Hand's.
4. **The Tide Stone is a plain quest item** (call 6).
5. **The Tide Stone is the Hearth's first step** (call 8): the night it is home, the sky and the
   title show it (#168).
6. **All four side quests stand** (call 13).
7. **The name:** Kelp Hole (docs/areas/saltreach.md §10).

Proposed, for the owner, each in the issue that would build it:

- **The briefs** of §4.2 to §4.5.
- **Both boxes core** (§4), since the isle is the ship and nothing else.
- **The ship boarded at night** (`when`, #41), by the boats from F6's shore, and its plate left in
  the sea where the atlas has it (#190).
- **The stair's landing room,** one room of 26–28 country with a way back up, until #22 is built.
- **The pay's shares** (§8), the dungeons heavier than Saltreach's, scaled to the curve's 9,867.
- **The bands on the atlas's rows** (#186): the zone 12–14, Kelp Hole 12–14, the Tide Ship 13–14.
  They are set already in `src/content/areas/wrackholm/atlas.ts`, where only the scaffold reads
  them, for a box's draft; the owner's word changes them there.

Decided by delegate for #635 (the Fence's rung), each the owner's to overturn:

1. **The rung is built now, on Act II's country,** since it is a deed on a built map. *Where the
   Cargo Goes* (`compact_fence`, `guilds.ts`, listed in the area's index) is the quest a Fence is
   offered, and its deed is the stair's foot seen (`dead_drop_stair:dd_foot`, the room's first
   once-event, #190). No group, no new feature and no change to a map, so no contact sheet.
2. **The ladder no longer rests from 12 to 24.** As the docs stood, the Compact's climb stopped at
   the Fence from Saltreach's top at 12 to Cinderport's floor at 24; with the rung it climbs on in
   Act II's band. DESIGN §8 says so, and its table of Act IV's guild quests places the other three.
3. **The other three rungs ride Act IV's dungeons,** with no new feature or group: the Surveyor's
   with the Ember Stone (#516), the Mapmaker's with Meridian Camp and the Factor's with the
   Dead-Drop (#22). `OWED_RANKS` in `tools/tests/guilds.ts` drops the Fence's entry and owes the
   three to them, in the order a ladder allows: #516 before the Mapmaker's.
4. **Any hall offers and pays it,** one ladder (DESIGN §8), and the rung has no `after`, since the
   stair opens in Act II: a Fence is offered it as the rank is held. The log's goal names the Keel
   in Saltmouth and the factor's house at Cinderport (#512), and the words name no giver but Ruan.
5. **Her paid words say not yet and name nothing below.** The company is made a Factor, whose
   rung is Act IV's; what lies past the stair's foot is found, never told (DESIGN §7), and the
   Dead-Drop's brief is #22's (docs/areas/dead_drop.md).
6. **The pay is 200 gold and 600 xp,** the next rise of the Compact's ladder after the crate's 100
   and 360 and the lookout's 150 and 480. The 600 is 100 a member, which the area's budget absorbs
   as the side quests' pay is (§8): the curve test counts 10,626 xp a member of the 9,867 asked
   (10,526 before) and 6,479 gold of the 6,000 (6,279 before), both 8% over, so the row needs no
   owed figure.

Decided by delegate for #635 (PR D), each the owner's to overturn:

1. **The rung is built now,** on the counting house's orders (#22): *In the Founder's Hand*
   (`compact_factor`, `guilds.ts`, rank 3), offered to a Factor at either hall, naming no giver but
   Ruan and no Tallymaster.
2. **The deed is `goal: { item: 'compact_orders' }`, never `item:`:** a hall takes nothing, so the
   orders stay in the pack for the Thief's third prestige (#448), which asks for them too.
3. **It waits for Act IV on the Surveyor's `after`** (`q_sleepers_seen`), since the Fence's rung
   below has none; its goal names the Keel and the factor's house.
4. **The pay is 800 gold and 4,800 xp,** 800 a member, the Mapmaker's sum and the ladder's last
   rise after the Fence's 200 and 600. It makes a Partner, the top rank, which has no quest.
5. **Ruan's choice is keyed to the rung paid** (`q_compact_factor_done`), not to `rank_compact`,
   which is the rank's number and holds from Runner. No rank waits on it; it is put until answered.
6. **One question, two answers, a flag each** (`q_compact_wardens`, `q_compact_over`): nothing is
   paid, given or taken, since dead_drop.md §5 names none and the orders stay in the pack. Only
   her words read them.
7. **The founder's seal is not taken by either answer,** though #182 left it to this rank (§4.4):
   its grave is a secret, and an answer that took it would bar a company that never opened it. The
   take-over answer may `take` it, if the owner wants.
8. **The curve holds it** (guild quests count with the area that holds them): 11,426 xp a member of
   the 9,867, 16% over (10,626 before), and 7,279 gold of the 6,000, 21% over (6,479 before). The
   row owes nothing, so `progression.ts` is untouched.
9. **`OWED_RANKS` owes nothing now:** the Compact's entry is all `undefined`, as the other guilds',
   and each guild has its four ranks.
10. **One edit to a built place:** Ruan in the Keel (`saltmouth.ts`) gains three entries in her
    `says`, before the Runner's; no tile, sprite or interior changes, so no contact sheet.

Decided by delegate for #192, each the owner's to overturn:

1. **Hale waits at the weather deck's rail,** not in the hold: his freeing words send the freed up
   to the boats and him to the ladder, and they stand, with the token's twin and Hale's Sergeant's
   checks. He asks for the book there, and goes with the thirty once answered, placed nowhere else;
   the draft's after-lines in the hold are dropped, since the company keeps the book. The chapter's
   Hale entry has him go up the ladder to the boats, which narrows #190's decision 3.
2. **The clerk's book is a third letter,** The Clerk's Book (The Cargo Ledger is the Foreland's),
   in its own chest in the cabin's corner and not on the table, so a save that opened the table
   still finds it. A chest cannot wait on a flag, so it may be taken before Hale asks; then he goes
   straight to it.
3. **The truth's cost falls on Kelp Hole's landing crew,** since the Tide Ship's deck has no
   smugglers to thin: Kitto's boats tie up there, the group stops coming back once next killed, and
   no first clear or gate figure moves. Kitto's after-lines say the cove's landing, not the deck.
4. **Only the landing's Kitto carries 25,** the hand-in with no early words, since his lines read
   true to a company he never asked; the quay's Kitto is left alone, clear of #183.
5. **The hermit is Merryn,** renamed by a fable pass: Senara is Henlys's lorekeeper.
6. **Merryn's count begins on the 11th of Frost,** as her wall has it, and her words keep the grave
   for the company to find.
7. **The pay:** Kitto 200 (the fare back and a bit), Ruan 300, Tallis 500; 27 and 28 pay in words.
8. **28 is done either way:** the beast slain and Tam home (`q_feed_home`), or Tam met and Loveday
   told while the beast lives (`q_feed_told`). Tam's meeting at the pool sets a flag rather than an
   event, since his words are the meeting.
9. **Each quest begins at whichever of its people is met first:** Colan before Kitto, Tam before
   Loveday, the book before Hale, so the log never waits on an order.
10. **Wat has two new versions,** his boy home with the board in the loft and without it; nothing
    for the boy at Saltmouth, who is not home yet. A company that sends the boy home before it
    ever meets Wat hears his boy's words and not the board's ask, and can still hand the board in.
11. **26 is The Hermit of the Point,** since #56's title, The Hermit of the East Rocks, is 7 px too
    wide for the log's list; the point is where she sits.

Decided by delegate for #191, each the owner's to overturn:

1. **The plinth takes the Stone,** a feature on its square named Stienwierde, met as a person is
   met but drawn and worded as the stone: only a person's hand-in takes an item and sets a flag, and
   a new kind of feature would be a systems change. The hermit on the hummock counts the Rifts; he
   is not the step.
2. **The chapter begins on landing,** since only Kitto's boat reaches the isle: a company still in
   the Delta keeps the Tide Stone's goals.
3. **It is done on the Stone home with the captain's table opened,** a condition that stays true and
   asks no item; the Wall begins on the same, or on the papers read (sunderwood.md §9.3). The way
   east is the Wall's own first goal, so the chapter writes none: one at the Eaves would only repeat
   it. The Wall's first goal takes the same condition beside the papers, so the start alone shows a goal.
4. **A Stone home without the papers sends the company back aboard,** a goal at the lower deck, so
   the log is never blank.
5. **No goal on F6:** its floor of 13 would carry every later step over B5's band of 11–12.
6. **The temples sing on the approach to two stairs,** the far roof's porch (B6) and the apse's,
   once the Stone is home, and the count and the quiet there give way to it. The song is the
   god's, so it does not wait on the Choirmaster; the choir below keeps its count while he stands.
   One step short of each stair, since the log holds the count and the song together no other way;
   at the apse across the nave's whole head, heard once, so no way up to the stair misses it.
7. **The Stone home closes the Delta's Rifts** (B5's two and C5's) and B6's brinelings, the other
   way #170 and #173 left to #191. The brinelings at Nynke's window stay The Night-Light's.
8. **The hermit on the hummock gets one line** once the Stone is home, and sets nothing.
9. **The walkthroughs:** Saltreach's runs stop on the landing, the Tide Stone open; Wrackholm's play
   them on, in order and with Saltmouth first; Sunderwood's play the Tide Stone and Wrackholm's
   chapter before the Wall in all three runs, the Foreland and the Grove seeded in two. The Watch
   first and the Sunder first now read both papers, since the table gives both: the papers alone
   and the log alone are no longer walked.
10. **A company that skips the Grove** and brings the Stone home is sent on by the Wall's goal, the
    furthest along, and not back to the Grove, as the log reads every chapter.

Decided by delegate for #190, each the owner's to overturn:

1. **The ship is boarded in Dando's boat by night,** a crossing sold on F6's shingle, since no way
   on a map can keep hours; the fare lands the company rested, as a crossing does. The way back is
   over the side, open at any hour.
2. **Hale is in the last row only once he is gone from the Scarth:** the hold waits on
   `q_hale_taken`, a flag #156 owns and sets on its own condition (the ledger given, Saltreach set
   foot in), so the pass and the hold never both hold him. Until #156 lands the last row holds
   strangers whatever the company has done; the checks owe the flag to #156 (#415). Changed on
   review: the hold first read #156's condition itself, which held Hale in both places until #156.
3. **Freeing Hale is his meeting,** once the crew is down: it sets `q_hale_freed`, and he is gone
   from the hold, over the side with the freed and placed nowhere else. Nothing is taken from the
   company (#43). His words for his sergeant's token (#56's 20) come with the token, which #156
   makes; the chapter (#191) keys on the flag, and 27's choice (#192) is put by one of the freed.
4. **The Rift is generated in brine, floored at 12,** so the gate judges the Warden at 12 and 14 as
   the issue asks; the Warden stands alone at its heart, with the Tide Stone in the hoard beside him.
5. **The ship aims at its share,** about 2,550 as first drawn; the curve and the gate moved it to
   about 3,500 (decision 9), 200 over, which the owner may weigh against the area's curve.
6. **The stair's foot is `dead_drop_stair`,** one room at 26–28 with no group and no chest, the sign
   its warning; `dead_drop` stayed the plan's place until #22 built the drop, and the foot's far end
   is its way on now (docs/areas/dead_drop.md §8, the drop's 6). The curve's band check let it
   stand first, in the quality lane (#407).
7. **The ids** are `tide_ship`, `tide_ship2`, `tide_ship3` and `tide_ship_rift`; the first keeps the
   plan's id and its row.
8. **The papers and the log are two letters** on the captain's table, read from the pack; the log is
   in a hand the company cannot read, for Lantern Watch (#204). The captain is not aboard. On
   review, the papers' seals are past making out, so the Helmstow seal on every cargo stays the
   Watch's to read; their PASSED column answers the crates' stamp in Kelp Hole for whoever looks.
9. **What the checks moved, by the session** on the delegate's draft: the decks floored at 12, since
   no 13–14 deck can hold the curve's hardest group without a 14 the roster lacks; four devilfish
   over the side and no bowman, eight rats and three overseers at the hatch below, and a Tide Elder
   with an overseer at the bulkhead door, the hold's group at 13, so the shard-cut is a way past them:
   on review, each the cheapest change that brings its deck inside the gate's 6 to 8 fights to a
   rest, where thinner decks ran 8.7 to 9.6; a bowman at the post or over the side would sit under
   its deck's top; a Tide Elder and three brinelings in the Rift's
   rooms and the Warden at about two in three at 12, so the Rift's own fights are won as the gate
   asks; and the ship's chests raised to 3,200 gold, as §8 has the hold pay the training.
10. **The area claims the wreck** as new; a group's leader was the delegate's second claim, but
    Saltreach's boxes place one first, a boss that closes a tear is C5's already, and the stair is
    words in §7.

Decided by delegate for #189, each the owner's to overturn:

1. **The hardest group is the Hand at the smugglers' watch,** two Ashen Overseers and two Ashen
   Gleaners, the den's keepers: the curve asks for a group at 14, which only the bosses are in
   Wrackholm's roster, and borrowing the gleaner, as Sunderwood's I2 borrowed the glass bear, needs
   no drawing first. Four gleaners (6.0 fights to a rest) and a smuggler with three (6.4) were
   measured and sat nearer the aim's edge than the pair of pairs (6.6).
2. **Five groups, at about 1,658 xp a member,** against #186's 1,600 and not the issue's 1,300: a
   sixth would add 315 to 370 and overshoot, as E6 held the pay over the brief's count of eight.
3. **The anchorage is a shingle under a cut cliff,** the path down a square wide; the boats are an
   event by night and the way aboard is left to #190, as E6 left Kelp Hole's mouth to #188.
4. **The hermit has two lines and no flag,** and no letter yet: the quest and its hand-in are
   #192's and #182's, built together.
5. **The founder's seal lies in the grave now,** with 150 gold.
6. **F6 claims nothing new;** the shrine gives personality.
7. **The hint is the tally on the cell's wall,** not the cairn beside the door: the date is found at
   one place, and the cairn left for the company to put together with it.
8. **Kelp Hole's flooded passage now lets out on F6's east shore,** at 28,9, facing south down the
   shore to the point, as #188's brief has it; it lay on E6 only until F6 was built (#188's decision
   6). Nothing on the shore leads back in, and the square is clear of every group and the secret.
9. **F6 places the Ashen Overseer at the watch,** as Kelp Hole does, so a company that walks east
   before it goes into the cliff meets the Hand here first. The borrowed Ashen Gleaner is level 15,
   so the Hand at the watch reads 14 as the group's mean.

Decided by delegate for #188, each the owner's to overturn:

1. **The ids are `smugglers_cove` and `smugglers_cove2`,** the crews' cave and the sea cave: the
   first keeps the plan's id and its link from the zone, so nothing outside the area's folder moves.
2. **Both levels are floored at 12,** the crews' cave 12–13 and the sea cave 12–14, so that the
   boss is judged at 12 and 14 as the issue asks.
3. **The brief's encounters, at about 3,450 a member,** not the share's 2,180, which the boss alone
   nearly fills: two crews and four overseers above, a crew and two devilfish groups below, and the
   boss. F6 and the Tide Ship keep their shares, and the area runs about 1,270 over (§8).
4. **The Great Devilfish is set at 650 hit points, 12d7+15 and armour 20** (600 and 8d7+10 until
   #806, below), the one set measured inside both of the gate's aims.
5. **Colan and Tam are placed with #192's first lines and no flags:** Colan by the rows once the
   overseers are down, Tam at the pool's edge until the beast is dead. Their choices, letters and
   after-lines are #192's. The brother keeps the rows; he is no overseer group.
6. **The flooded passage lets out on E6's south shore,** at 30,29, until F6 is built; #189 may
   repoint it to F6's east shore. Nothing on the shore leads back in.
7. **About 1,230 gold in the chests,** 600 of it in the crews' strongbox with the Plate Mail +1,
   behind the overseers.
8. **The crates stamped with the Helmstow customs** are a plain event, keyed to nothing, for #191.
9. **Kelp Hole claims nothing new:** the devilfish are E6's, the cave is on the road before, and it
   adds no mechanic.

Decided by delegate for #187, each the owner's to overturn:

1. **The landing is an inlet's head,** cut in from the west shore, so that the plan's two points
   stand: the stage at 152,172 and the cove's mouth at 154,170 in the cliff above it.
2. **The pay aims at 1,700,** #186's figure, not the issue's 1,400; six groups at the standard size
   come to about 1,920.
3. **The captain stands on the stage** with two lines and no flag; the quest is #192's and #188's.
4. **Nothing for the chapter** (#191) is placed in E6: it keys on what it needs when it is written.
5. **Four devilfish in the south pools,** the box's far end and its level-13 group, so the levels
   rise; E6 claims the devilfish as new, and heather.
6. **The bilge rats are placed in E6's huts,** as the brief has them, not left to #189.
7. **Wrackholm's climate** is the gulf's: mild winters, cool summers, a narrow day, wet autumns and
   much fog, its fronts three hours behind the Foreland's.

Decided by delegate for #186, each the owner's to overturn:

1. **The atlas folder is spread into the plan** (`src/content/atlas.ts` imports it where its rows
   were), as Saltreach's and Sunderwood's are: the area cannot be listed in AREAS until #187 gives
   it a map. #187 points the area's `atlas` at it and takes the import out.
2. **The folder charts the plan's rows and the bands, and no new sites:** the hermit and the east
   rocks are F6's to place (#189), and the landing is the boat's link, which an area's atlas has no
   room for.
3. **The Tide Ship is 13–14,** not the plan's 12–14: §4.5 gives it so, and it is boarded from F6,
   which is 13–14; the world map shows a plate's band.
4. **The Dead-Drop stays the plan's:** its band and brief are Phase 4's (#22), and this act builds
   only the hatch and one room. The three levels are built since (docs/areas/dead_drop.md).
5. **The pay is scaled to 9,867,** the side quests inside and the Dead-Drop outside, as Sunderwood
   counts Wrackholm's: 100 more each to E6, F6 and the Tide Ship.

Decided by delegate for #806, each the owner's to overturn:

1. **The Great Devilfish is set again at 650 hit points and 12d7+15** (600 and 8d7+10 before), by
   hearth_isle.md §7's method: tries of hit points and blow on the gate's seeds. #188's gate set it
   against a company without its first prestige, 66% at 12 and 91% at 14; the gate's company has
   taken the prestige since #541, and won it 96% at 12, past the limit of 80%. The aim is about half
   at the floor (30% to 70%) and nearly always two above (90%). The tries, in percent of the gate's
   400 seeds and of its own hundred, a fight broken off being one still running at the fifteenth
   round, which the gate does not count won:

   | Hit points | Blow | At 12 | Broken off | At 14 | The gate's hundred, 12 and 14 |
   |---|---|---|---|---|---|
   | 600 (before) | 8d7+10 | 98 | 1 | 100 | 96 and 100 |
   | 1,000 | 8d7+10 | 55 | 38 | 93 | 58 and 92 |
   | 800 | 10d7+12 | 63 | 15 | 97 | 63 and 96 |
   | 700 | 12d7+15 | 55 | 4 | 94 | 56 and 97 |
   | **650 (kept)** | **12d7+15** | **62** | **4** | **98** | **66 and 99** |
   | 600 | 14d7+18 | 61 | 1 | 92 | 58 and 94 |

2. **The blow rises with the hit points.** Hit points alone read half at 1,000, but 38 fights in 100
   are then broken off at the fifteenth round: the beast is not beating the company, the clock is,
   and a company that waits it out may well win. The rule for the four Act II bosses (saltreach.md
   holds the Choirmaster's, sunderwood.md the Warden of the Sunder's): raise the hit points till the
   floor reads about half, and where more than one fight in ten is then broken off, raise the blow
   and lower the hit points till it is not. Both Wrackholm blows stay under the line's at 14
   (13d8+15, 73.5): 63 and 66.
3. **It is won two in three at 12, not a half, so that its cave holds its aim.** The cave's four
   groups pool at the floor, the crew and the two devilfish groups won every time: (300 + 66) / 4 is
   91.5%, inside the aim of 90%, as #188 left it. At 700 hit points the beast reads 56% and the cave
   89%, off its aim. The boss stays inside its own aim at both levels, so it is not listed.
4. **The Warden of the Tide is set again at 780 hit points and 12d7+18** (674 and 10d7+15 before), by
   the same method. #190's gate set him 63% at 12 and 96% at 14; the gate's company, with its first
   prestige, won him 94% at 12, past the limit. The tries:

   | Hit points | Blow | At 12 | Broken off | At 14 | The gate's hundred, 12 and 14 |
   |---|---|---|---|---|---|
   | 674 (before) | 10d7+15 | 96 | 0 | 100 | 94 and 100 |
   | 900 | 10d7+15 | 52 | 12 | 98 | 52 and 98 |
   | 850 | 12d7+17 | 49 | 4 | 98 | 49 and 99 |
   | 800 | 12d7+18 | 62 | 4 | 99 | 59 and 100 |
   | **780 (kept)** | **12d7+18** | **67** | **3** | **99** | **66 and 100** |
   | 750 | 13d7+20 | 58 | 0 | 97 | 58 and 97 |
   | 725 | 13d7+20 | 64 | 0 | 98 | 63 and 97 |

5. **Two in three binds the Warden, from below.** The Rift has two groups, the Tide Elder's and the
   Warden, so its fights pool at (100 + the Warden) / 2, and the Rift holds its limit of 80% only if
   the Warden is won 60% or more at 12. At 850 and 12d7+17 he reads 49% and the Rift 74.5%, past its
   limit; at 780 and 12d7+18 he reads 66% and the Rift 83%, off its aim of 90% and inside its limit,
   as #190 left it (81.5%). The check lists the Rift as off its aim; the Warden is inside his own
   aim at both levels.
6. **The `OWED` lines for both go,** and the reasons `OFF_LINE` gives for them
   (`tools/tests/harness.ts`) name this issue. Level, xp, gold, drops, id and the groups stay, so the
   curve and `src/content/shipped.json` do not move. The area's pool two under its floors falls with
   the two bosses, from 93.7% to 92.2%, still past its limit of 90%, which #851 replaced by the day.

Decided by the owner's delegate for #18, each the owner's to overturn:

1. **An elemental weapon,** its blows carrying lightning: its dice a rung under the ladder's at the
   band, so the die is the gain; a class list as its kind has. The rule if the area session finds
   better: an element its own area's monsters are not immune to and the next area's are weak to where
   one is.
2. **A stat item,** a coat or a shield raising speed by 3 while worn: slotted, so one is worn at a time.
3. **Found, off the quest's path,** behind one of Wrackholm's hinted secret doors or in a cairn off the
   road (band 12 to 14); one of the two in a locked chest (`locked: true`), the first the area holds.
   Each priced inside Wrackholm's window, sold by no shop, sellable at half as all found gear is. Off
   the ladder: no `GEAR` row, so no figure moves.
4. **Names and texts pass the pillars;** two lines to a find.

Decided by the builder for #861, each the owner's to overturn:

1. **The hide is a hollow in F6's rock, behind a second secret door in its east face.** The five
   secrets the area already has hold a reward or are a way (E6's cache the Long Bow +1, F6's grave
   the seal, Kelp Hole's passage a way out, the shard-cut a way past, the hoist a way up), so none was
   empty; the cove, the ship and the drop are on or beside the quest line; E6 has no rock, and a hut
   would take walkable squares from the moor. The rock is F6's, and three squares of stone floor cut
   from it at 17 to 19 on row 10 with the door at 20,10 add walkable squares and take none away: every
   id, door square and chest id stays, and the first secret, the grave's, is still the box's first.
2. **Both finds in the one hollow,** the coat in a sea chest at 18,10 and the blade in an iron-bound,
   locked one at 17,10 behind it: one detour, one hint; a company with neither pick nor key still
   takes the coat and sees the lock.
3. **The blade is a Morning Star,** the ladder's weapon at 11 for five classes (knight, paladin,
   ranger, barbarian and cleric, four of the premade six), where the bow is the ranger's alone; its
   `classes` are the Morning Star's, and its steel the plain Morning Star's, 2d6+3, a rung under the +1
   the ladder wears from 13 and the Flail it wears from 14, so the lightning die is the gain: `hits()`
   13.5 against 11 and 12 (10 for the steel alone).
4. **Lightning stands.** Of the 15 monsters the isle places past 10, 5 are weak to it and none is immune
   or resists it, and the nine of its own at 12 to 14 take the die whole; Sunderwood's nine have none
   weak or immune to it; fire is weak in one of them and immune in another, cold immune in one, and
   nothing the isle places is weak to either; nature and holy are the machines' immunities. No element
   is the better the delegate's rule asks for.
5. **The coat is the Sharkskin Coat a point lighter,** AC 8 for 9, of the same classes, raising speed by
   3: the speed is the gain, as the die is the blade's. Worn it is a point of armour class and an
   earlier turn (the thief's speed 15 to 18); in the pack or the bag it gives nothing; and the armour
   slot makes it one coat at a time, a coat and not a shield because a shield is worn beside armour
   and would add to it.
6. **The blade is in the locked chest,** the coat in the plain one: the better find behind the lock, and
   what a company that cannot open it still carries away is a thing worth the walk.
7. **The prices are 1,150 and 1,250,** a point of plus (150, `PLUS_PRICE`) to each point of the gain
   over what the ladder wears: the Morning Star's 700 and three points for a die of a mean 3.5; the
   Sharkskin Coat's 1,100 less 150 for its point of armour and 300 for the raise, a step of armour class
   and a turn. Both are inside the window of 2,500 and under Plate Mail +1's 1,350, the dearest find
   the curve names for the area, so that line of the curve stands as main prints it; they sell back at
   575 and 625.
8. **The names** are Corposant, Morning Star and Runner's Coat (§10): 23 characters for the blade, so
   its sheet line, "WEAPON Corposant, Morning Star, LIGHTNING, EXPERT", ends at 313 of the 334 the
   column allows.
9. **The hint is a groove in the turf** (`f6_drag`, 21,10): a thing seen on the door's near side that
   explains nothing and is there at every hour, as the hint rule asks. The hollow's event says what is
   in it and no more.
10. **No chest holds gold,** so F6's clear, the area's 7,279 gold and §8 stand.
11. **"Off the road" is measured by walking,** from every square on a shortest walk from F6's way in to
    its shingle, since the isle has no road of its own: the groove's end is 20 squares from it by the way
    a company walks and 7 as the crow flies, solid rock between. #875's crater lip was measured so, 10
    by walking and 6 by the crow. A hide ten squares off by the crow would need a new outcrop in F6's
    north-east, turning grass to rock and taking walkable squares from the box.
12. **The walkthrough walks the detour in F6** on from the founder's grave, the company's thief
    (Ottilie, born to Lockpick, #857) picking the lock, and plays the lock's refusals on a game of its
    own against the real chest: the checks were each broken in the tree and watched to fail (the PR
    lists them).
13. **The pilot is not stranded and does nothing new.** It reads the world through what it has seen; the
    door is drawn as rock and the explorer suspects only cells drawn as wall (`suspects`,
    `src/game/pilot/explore.ts`), so it never suspects it, and a locked chest it came to would be
    pressed on once and walked past, as a locked door with no key is (#857).

Decided by the builder for #835, each the owner's to overturn:

1. **The bounds' brief is §12,** for E5, F5, F7, the enclave and the lair, the last two in §4's
   form too, in three pull requests: the three strands with the brief (#828's 3, one pull request
   for the three), then the enclave, then the lair once #847's powers and Old Nick's drawing are in.
2. **Each strand is Wrackholm's, laid whole in its one zone,** E5 at E6's 12–13 and F5 and F7 at
   F6's 13–14, the boxes they run off, so no crossing line is said at their edges.
3. **No strand holds a group.** The curve's rise rule asks a box's hardest group at its top, 13 on
   E5 and 14 on F5 and F7. At 13 the isle has its devilfish (already in E6's pools, Kelp Hole, the
   Tide Ship and F6's pools), the Hand's overseers who keep the chains and the Rift's Tide Elders,
   which keep to the Stone; at 14 only its bosses and F6's keepers. A group on a strand of 56 to 74
   squares would crowd it, beside a door on two of them, and repeat the isle's own. The area's clear
   already gives 11,426 xp a member of the 9,867 the curve asks (§8); the enclave and the lair are
   the bounds' fights.
4. **Each strand has its wilderness feature,** of a kind no other strand has: E5 a ship's
   figurehead with a riddle, answered anchor (+1 endurance once), the isle's first statue; F5 a
   cairn of shore stones; F7 a spring at the cliff's foot, a fountain (+1 speed once), the isle's
   first: a camp there would repeat F6's lee hollow, seven squares across the seam.
5. **Each secret is a hollow behind a face of rock drawn on the strand,** a ring of nine squares
   where the atlas has shallows, sea or sand, its hint a thing seen at the face: soot where a lamp
   burned (E5), fish scales dried on the rock's foot (F5) and a cut chain in the sand (F7). Each
   door stands where the art check takes it.
6. **The finds are gold, Elixirs and Sapphire Vials,** the dearest healing and spell points that
   Saltmouth's Quay Chandlery sells, 450 gold in all; the strands give no gear.
7. **The enclave is a wreck on E5,** the largest strand, held at 14–15: its door was left bare at
   18,28 in black rocks drawn at the strand's west end (18,29 before it) and is built since as the
   break in her side (13 to 21). Its groups are the Hand's overseers and the Sunderwood's gleaners
   in her hold (§12.5), their sizes and its reward set in 15 and 17 inside the Sunderwood's window,
   3,000 (#845's 3).
8. **The lair is Old Nick's sea cave on F5** (§6, DESIGN §9, MONSTERS §13): its door was left bare
   at 16,30 in a reef of rock drawn at the strand's east end, in sight of the hermit's point, 16,31
   before it, and is built since as the way in under the reef into Nick's Locker (22 to 24).
9. **The strands meet E6 and F6 square for square,** their edges worked from the built letters:
   E5's 15,31 and F5's 17,31 and 18,31 are sand, as E6's and F6's are, where the atlas has
   shallows, and F7's row 0 agrees with F6's row 31, sand at 1 and 19 and rock at 11, 12 and 16
   where the atlas has shallows, hills and grass. F7's 17,1 is sand, so the shore's end at 17 to 19,
   walked onto from F6, is walked to inside the box. Every corner agrees with its built letters; no
   built square changes and no `SEAMS_AS_BUILT` row is added. The three `OPEN_ON_NOTHING` rows the
   strands answer go and none comes: every edge they turn to unbuilt land is the sea.
10. **The strands differ from the atlas at 42 squares** (E5 13, F5 14, F7 15): eight at the seams,
    F7's 17,1, the doors' six of rock and the hollows' 27.
11. **E6's `e6_north` says what is now true,** "Open grass runs north to a strand and the sea."
    where it said "then air"; its id, place and once stay.
12. **The walkthrough walks the bounds in one function,** `theBounds`, called last.
13. **The enclave is the Brokenback,** the isle's crews' word for a ship that has broken her back on
    the rocks (§10): the wreck on E5's black rocks, one level of 16 by 16 (§12.5). Her own name is
    gone from her board, and the crews' word stands for it.
14. **It is held at 14–15,** a band over E5's 12–13, its floor over E5's top (#845's 2). Its window
    is the Sunderwood's 3,000, the last road area whose floor is at or under 14 (#845's 3). Its
    floor, 14, is not over the isle's band, so the pace and novelty checks place it with Wrackholm
    (`roadPlace`).
15. **Its groups are three overseers with a gleaner at the hold's mouth and four gleaners at the
    cabin's door,** at 13.5 and 15: the brief's Hand overseers (13) and Sunderwood gleaners (15),
    the hardest the gleaners alone, which the curve's rise rule asks at 15 (`nearTop`) where the
    isle's roster stops at 13 but for its bosses. Two of each would be F6's keepers again. Sized
    with the harness at 14: the first alone 8.7 fights before a rest, the second 6.8 and the two in
    a new order each seed 7.5 (4.8 at 12); three overseers with two gleaners paced 6.4 and two with
    three 6.2, under the aim's 6.5. The gate gives 7.48 and, two under, 4.91.
16. **Both groups stand in doorways,** the first at 7,7 behind the neck at 7,6 into the hold and the
    second at 7,12 just inside the bulkhead's door at 7,11. Groups never move and a fight starts
    only next to one, so a company on foot, wading or climbing comes up to them in that order and
    passes neither: the way aft runs through the first's doorway, and the cabin and the plank lie
    past the second. The walkthrough asserts it.
17. **The reward is Keelhaul, Long Axe,** the master's own: the Seawall Armoury's long axe (2d6+4,
    two-handed, for the four martial classes) with its blows carrying cold, at 1,600, in the
    master's strongbox with 300 gold. It is the plain piece where the ladder wears the Sunderwood's
    Great Axe from 14 (13 a blow) and its plus from 16 (14), the die of cold the gain (14.5, the die
    counted at 3.5); off the ladder, found there alone and sold nowhere (the walkthrough asserts
    each, and the rungs) and inside the enclave's window. The cold is the area's rule for an element
    (#861's 4): it lands whole on all fifteen kinds the isle places past 10, the wreck's two among
    them, and of the Sunderwood's nine only the hound is immune to it; nature and holy are nothing
    to the Dead-Drop's five machines, and lightning, which does better, is the Corposant's already.
    The lair's artifact is another thing.
18. **The secret is the master's strongbox under the cabin's deck,** a hollow two squares long
    behind the cabin's east wall, its hint one plank of the deck worn bright among the grey, by the
    wall at 11,13: searched from there facing east, the wall at 12,13 gives; no company walked,
    waded, climbed or floated reaches the hollow but through it. The strongbox is the secret's
    prize, as Karaordu's sabre is the eldest khan's; the hold's cargo chest holds 250 gold and an
    Elixir, the dearest healing the Quay Chandlery sells.
19. **The door is the brief's square, E5's 18,28,** the one square of E5 that changes: rock drawn as
    stone among the black rocks, with rock at 17,28 and 19,28, walked onto from the strand at 18,29,
    where the way back sets a company down facing south onto the grass; nothing stands within four
    squares of it. The break opens on the strand's side, and 18,27 behind it is shallows that only a
    swimmer reaches, who steps onto the same square. With it E5 holds 74 walkable squares and 5
    points. The plate on the world map is at 150,150, out in the sea four squares from the door each
    way, as the Tide Ship's lie.
20. **The walkthrough walks it in `theBounds`,** after the strands: the break's square and what is
    round it; the door's words at 11, 12 and 14 and its sign; both groups won at 14 and met in
    order; the cargo, the plank and the hollow shut but through its wall; Keelhaul in the strongbox
    and nowhere else; and out onto the strand.
21. **§12.5 is the brief brought to what is built,** with its encounters, reward and pay as they
    stand and its As built; the §12 table's row for the enclave is built.
22. **The lair is Nick's Locker,** the crews' name for Old Nick's sea cave under F5's reef (§10),
    after the sailors' locker of the drowned, from which nothing comes back: one level of 16 by 16
    marked `enclave` at 30–32, as the brief has it (§12.6).
23. **Old Nick lies alone in the cave's throat,** at 7,9, where the passage from the mouth, one
    square wide, comes up to the cave, so the ship, her master, the kelp and the cleft all lie past
    it and nothing in the lair is had without its fight. It never moves and never comes back: a boss
    with no `respawn`, `roams: false` and a `slainText`.
24. **The door is the brief's square, F5's 16,30,** its reef drawn as stone and given the one exit,
    walked into from the strand at 16,31 and waded into from the shallows at 16,29, the way back
    setting a company down on 16,31 facing the land. It is the one square of F5 that changes: F5
    walks 74 squares with it and counts it among 5 points, and nothing stands within four squares of
    it. Its plate is out in the sea at 188,152, four squares from the door each way, as the
    Brokenback's lies.
25. **Old Nick's numbers are set by its gate,** as the Steiger's are (docs/areas/kilns.md §9, #831's
    41). Drawn at the line's boss at 32 (2,100 hit points, attack 20, 34d8+41), every blow it landed
    drinking back what it took, the gate's company never won it at 30 or at 32; at 1,600 hit points
    and 20d8+20, its attack, armour, pace, reach and drinking kept, it is won 57% at 30 and 81% at
    32, where the Stair's Catcher and the Steiger stand (57% and 80%, 56% and 81%). Off the line,
    its row carries its own `offLine` word (#897); it keeps the boss line's 20,373 xp at 32.
26. **Holdfast lies alone on the ship's master,** against her keel past Old Nick, with no gold
    beside it, as the Erzhemd lies alone in the smith's kist: the knife of Merryn's rumour, where
    Old Nick took it with ship and master. One in the world and sold nowhere; the walkthrough
    asserts that no other chest, cairn, statue or shop holds it and no monster drops it.
27. **The secret is the master's sea chest in a dry cleft behind the ship's bows,** two squares
    behind the rock at 9,2, found from the kelp grown green over the rock where no wave comes, as
    the knife's haft has not rotted (§6), and searched there facing north: 500 gold, an Elixir and a
    Sapphire Vial, the dearest healing and spell draught the Quay Chandlery sells, as the strands'
    finds are (§12.1). It lies past Old Nick, and no walker, swimmer, climber or levitator reaches
    it but through the rock.
28. **The rumour is Merryn's while Old Nick lives,** DESIGN §9's two lines after her own words at
    each of her four meetings after the first, whatever has become of the founder's letter. "Nick
    gives nothing back" is not so once it has fallen and the company has the knife, so each such
    entry holds `until` its fall (`slain`), and after it an entry of her own words alone waits on
    the fall. Her first meeting sets `q_hermit` already, so no flag is added; the lines set nothing,
    and where the letter is not yet carried her own question still follows them. A company from an
    old save that has met her hears them at its next meeting.
29. **New here:** the lair itself (#845, #846), the isle's one place at the cap, its guardian a boss
    whose blows heal it and the area's artifact a knife that casts Grasping Roots three times a day
    (#847).
30. **The owed rows go,** as EXPANSION §8.2 (#897's 12) and #847's 6 say: `holdfast` leaves
    `UNPLACED` in tools/tests/items.ts and Old Nick's row the area's `checks.ts`, which owes nothing
    now.
31. **#835 is done with the lair, its last piece:** the three strands, the enclave and the lair are
    built and judged, the enclave at 14–15 and the lair at 30–32 with Holdfast in it, and no built
    map of Wrackholm is open onto unbuilt land (§12.1): every edge its boxes turn away from the isle
    is the sea, and no row of `OPEN_ON_NOTHING` and no crumb faces the area.
32. **§12.6 is the brief brought to what is built,** with its encounters, finds and pay as they
    stand and its As built; the §12 table's row for the lair is built.

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

## 11. What was cut

- **The scraps** of shore in the boxes round the isle: E5 (74 squares), F5 (69), F7 (57) and E7
  (34), 234 in all and every one walkable, shingle and grass at the water's edge. Each was to go
  with its box's edge where E6 or F6 reaches it, and the rest to stay void: a strip of beach with
  nothing on it (DESIGN §1). E5, F5 and F7 are built since as the bounds' strands, country with no
  group (#835, §12). E7's is laid in the Wold's box, whole (#833): no road joins Wrackholm and the
  Glasswold, so the isle's tip stands there as rocks across deep water, and E6's south shore at 13
  to 26, its row 31, is shallows (docs/areas/glasswold.md §12.3).
- **The Dead-Drop** below the ship, which is Phase 4's (#22): this act builds the hatch and one
  room, no more. Its three levels, the drop, the vaults and the counting house, are built since
  (docs/areas/dead_drop.md §4.1 to §4.3).

## 12. The bounds

The land the isle's maps lie open to, built as country off the quest, level for level (the owner,
17 October 2026; #828, #835): the scraps of shore round the isle in E5, F5 and F7, which §11 cut;
then the area's enclave and its artifact's lair, Holdfast's (§6). Three boxes of sea, each with a
strand at the corner nearest the isle, 200 squares a company could walk by the atlas (E5 74, F5 69
and F7 57), which 52 edge squares opened onto: E6's north edge (17) and F6's north (19) and south
(16) edges. The issue's 47 are those the atlas's strands met on foot: E6's 15,0 and F6's 17,0, 18,0,
1,31 and 19,31 are sand where the atlas has shallows, and the strands are drawn as sand there to
meet them (§12.1). E7's 34 are laid in the Wold's box (§11, docs/areas/glasswold.md §12.3). Each
box is built to the looser floor (EXPANSION §5.3) at the zone's band, from the area's own, paid
from its budget (§8), with nothing on the road's quest. This is their brief, in §4's form; each
pull request builds from it and adds its "As built".

| Box | Laid in | Walkable | Built neighbours | Band | Pull request |
|---|---|---|---|---|---|
| E5 | Wrackholm, `wrackholm_e5` | 74 (the atlas's 74) | E6 and F5; D5 (Saltreach's), the sea | 12–13 | the first, built (#835) |
| F5 | Wrackholm, `wrackholm_f5` | 74 (69) | F6 and E5 | 13–14 | the first, built (#835) |
| F7 | Wrackholm, `wrackholm_f7` | 56 (57) | F6; E7 (the Wold's), the sea | 13–14 | the first, built (#835) |
| The enclave | its own, `brokenback`, its door on E5 | 92 (89 outside its hollow) | E5 | 14–15 | the second, built (#835) |
| The lair | its own, `nicks_locker`, its door on F5 | 60 (57 outside its cleft) | F5 | 30–32 | the third, built (#835) |

### 12.1 What every box keeps

- **A box is Wrackholm's, whole,** laid in its one zone, so no crossing line falls at its edges: E5
  at E6's 12–13, the moor it runs off, and F5 and F7 at F6's 13–14 (§9, #835's 2).
- **The seams agree with the built boxes square for square,** each corner worked from the built
  letters first. E5's south edge meets E6's north edge, open at 15 to 31, its 15,31 sand as E6's is
  where the atlas has shallows; E5's east edge meets F5's west edge, open at 26 to 31; F5's south
  edge meets F6's north edge, open at 0 to 18, its 17 and 18 sand as F6's are; F7's north edge
  meets F6's south edge, open at 1 to 10, 13 to 15 and 17 to 19, its rock at 11, 12 and 16 as F6's
  is. E5's west edge against Saltreach's D5 and F7's west edge against the Wold's E7 are the sea on
  both sides, and no road joins Wrackholm to either. Every corner agrees with the built letters:
  E5's 31,31 is grass with E6's 31,0 and F5's 0,31, and F7's 0,0 is shallows with F6's 0,31, the
  Wold's 31,0 deep water beside it. No square of a box built before them changes and no row of
  `SEAMS_AS_BUILT` is added. Every edge the strands turn to unbuilt land (E4, F4, G5, G7 and F8) is
  the sea, so no row of `OPEN_ON_NOTHING` comes, and the three that held E6's north and F6's north
  and south edges go; no built map of Wrackholm now opens onto unbuilt land (#835's Done when).
- **No group** stands on a strand (§9, #835's 3): the curve's rise rule asks a box's hardest at its
  top, 13 on E5 and 14 on F5 and F7, and the isle's own at those levels are its devilfish, the
  Hand's overseers, the Rift's Tide Elders, its bosses and F6's keepers, each placed already. The
  bounds' fights are the enclave's and the lair's.
- **A wilderness feature to each strand** (EXPANSION §5.3), a kind no other strand has: E5 a ship's
  figurehead with a riddle, F5 a cairn of shore stones and F7 a spring at the cliff's foot, a
  fountain.
- **Secrets** each a hollow behind a face of rock drawn on the strand, its hint a thing seen at the
  face: soot (E5), fish scales (F5) and a cut chain (F7). Rock keeps walkers, waders, climbers and
  floaters out.
- **Finds** inside the 2,500 window: gold, the Elixir and the Sapphire Vial, the dearest healing and
  spell points Saltmouth's Quay Chandlery sells; the strands give no gear.
- **Pay.** A clear of Wrackholm gave 11,426 xp a member before the bounds (the curve asks 9,867)
  and 7,279 gold (6,000), and a company entering at 12 and three quarters clearing it left at 14.3;
  the curve holds it to 15 (`LEAD`). The strands pay no xp and 450 gold: with them a clear gives
  11,426 xp and 7,729 gold, and the company still leaves at 14.3. The enclave and the lair are held
  to their own bands and counted in no clear (`tools/tests/curve.ts`), so the lead stays at 14.3 to
  the end of #835.
- **The doors** of the enclave and the lair are each a square of rock with rock either side along
  its face, its way walked to and nothing within four squares (§12.5, §12.6), each the brief's
  square drawn as stone once its place was built.
- **The walkthrough** walks them in one function, `theBounds` in `walkthrough.ts`, called last: each
  box's seams walked and its secret found from its hint, the prize shut to walkers, swimmers,
  climbers and floaters; the enclave and the lair walked into and out of.

### 12.2 E5, the north strand's west end (#835): country, band 12–13

- **Purpose.** The moor's grass running down from E6 to a strand of sand and weed, the open sea
  north and west and black rocks at its west end. Off the road and off the quest.
- **Landmarks.** The strand and the tide's line; a ship's figurehead stood upright above it; a
  stack of rock at its east end; the black rocks at its west end, where the wreck lies (§12.5).
- **Points of interest,** four features, the way into the wreck (§12.5) and no group: the strand,
  the figurehead, the soot on the stack and the hollow behind it.
- **Encounters.** None (§12.1).
- **The ways in and out.** In over the south edge from E6's moor, columns 15 to 31, and along the
  strand from F5 over the east edge, rows 26 to 31. Out through the break at 18,28 into the
  Brokenback (§12.5). North and west the sea.
- **The secret and its hint.** A hollow in the stack where a lamp with a red glass was kept, and a
  sea chest. The hint: soot on the rock's face above head height, old and thick.
- **New here.** Wrackholm's first statue and riddle, the figurehead's (anchor), +1 endurance once.
- **Finds.** 150 gold and an Elixir in the hollow.
- **Pay.** No xp; 150 gold.
- **As built** (#835, 23 October): `wrackholm_e5`, laid at 136,126, start 24,31 facing north. The
  strand's look (`e5_strand`, 24,30) a step in from the moor; the figurehead (`e5_figurehead`,
  25,28); the stack a ring of rock at 27 to 29 on rows 24 to 26, its door at 28,26 where the art
  check takes it and the soot before it (`e5_soot`, 28,27), the hollow (`e5_lamp`, 28,25) with the
  sea chest (`e5_chest`). The black rocks are 17 to 19 on row 28, the break into the Brokenback at
  18,28 drawn as stone among them, with 18,29 open before it (§9, #835's 19). E5 differs from the
  atlas at 13 squares: the seam's one, the black rocks' three (the break among them) and the stack's
  nine. Density: 74 of 74 squares within 12 steps, the furthest 7, no sign among 5 points, the break
  one of them. No group, so the gate has nothing to judge; the box pays 150 gold.

### 12.3 F5, the north strand's east end (#835): country, band 13–14

- **Purpose.** The strand running on east from E5 under the east rocks' north face, F6's grass
  above it, to a reef of grey stone in sight of the hermit's point, Old Nick's (§12.6). Off the road
  and off the quest.
- **Landmarks.** The strand; a cairn of shore stones above the weed; a stack of rock at the water's
  edge; the reef at the strand's east end.
- **Points of interest,** four features, the way into the lair (§12.6) and no group: the strand, the
  cairn, the scales at the stack's foot and the store behind it.
- **Encounters.** None (§12.1).
- **The ways in and out.** In over the south edge from F6's grass, columns 0 to 18, and along the
  strand from E5 over the west edge, rows 26 to 31. Out under the reef at 16,30 into Nick's Locker
  (§12.6). North and east the sea.
- **The secret and its hint.** The store in the stack where the smugglers kept the bait they fed
  Old Nick before the Great Devilfish (MONSTERS §13). The hint: fish scales dried to silver on the
  rock's foot, and the sand before it trodden flat.
- **New here.** The reef where the lair's door stands (§12.6).
- **Finds.** 80 gold and a Sapphire Vial in the cairn; 120 gold and an Elixir in the store.
- **Pay.** No xp; 200 gold.
- **As built** (#835, 23 October): `wrackholm_f5`, laid at 168,126, start 7,31 facing north. The
  strand's look (`f5_strand`, 8,30); the cairn (`f5_cairn`, 2,27); the stack a ring of rock at 8 to
  10 on rows 25 to 27, its door at 9,27 and the scales before it (`f5_scales`, 9,28), the store
  (`f5_store`, 9,26) with a box (`f5_box`). The reef is rock at 15 to 17 on row 30, and the lair's
  door at 16,30 among it is drawn as stone since (§12.6), walked into from 16,31 and waded into from
  the shallows at 16,29. F5 differs from the atlas at 14 squares: the seam's two, the reef's three
  and the stack's nine. It walks 74 squares, the door among them. Density: 74 of 74 squares within
  12 steps, the furthest 6, no sign among 5 points, the door one of them. No group; the box pays 200
  gold.

### 12.4 F7, the strand under the anchorage (#835): country, band 13–14

- **Purpose.** The isle's south-east end below F6's cliff: the shingle's sand and the cliff path's
  rock running on south to a knoll and a strand the boats never use, the Tide Ship's anchorage off
  to the east. Off the road and off the quest.
- **Landmarks.** The knoll under the cliff, the strand, a spring at the cliff's foot and a stack of
  rock at the strand's south end.
- **Points of interest,** four features and no group: the strand, the spring at the cliff's foot
  (a fountain), the cut chain and the hollow behind the rock.
- **Encounters.** None (§12.1).
- **The ways in and out.** In over the north edge from F6, columns 1 to 10 (the south-west moor's
  grass), 13 to 15 (the shingle) and 17 to 19 (the grass east of the cliff path). East, south and
  west the sea; the Wold's E7 is deep water at the corner.
- **The secret and its hint.** The hollow behind the stack where one who got away from the Tide
  Ship's hold hid in irons, filed them off and left his purse. The hint: links of chain rusted
  into the sand by the rock, cut through.
- **New here.** One who got away from the hold, known only by what he left.
- **Finds.** 100 gold and a Sapphire Vial in the purse.
- **Pay.** No xp; 100 gold.
- **As built** (#835, 23 October): `wrackholm_f7`, laid at 168,190, start 14,0 facing south. The
  strand's look (`f7_strand`, 14,1); the spring at the cliff's foot, a fountain (`f7_spring`, 5,1);
  the stack a ring of rock at 9 to 11 on rows 4 to 6, its door at 10,4 and the cut chain before it
  (`f7_links`, 10,3), the hollow (`f7_hole`, 10,5) with the purse (`f7_purse`). Its 17,1 is sand
  where the atlas has shallows, so the shore's end at 17 to 19 on row 0, walked onto from F6, is
  walked to inside the box: density measures a map alone. F7 differs from the atlas at 15 squares:
  the seam's five, the sand at 17,1 and the stack's nine. Density: 56 of 56 squares within 12 steps,
  the furthest 6, no sign among 4 points. No group; the box pays 100 gold.

### 12.5 The enclave: the Brokenback, the wreck on the north strand (#835): enclave, band 14–15

- **Purpose.** A place of its own off E5: a ship that came onto the black rocks at the strand's west
  end and broke her back there, her hold open to the tide, where the Hand's overseers and the
  gleaners they brought strip what she carried. Held to its own band (#845).
- **Band.** 14–15, a band over E5's 12–13 (#845: a band or two, its floor over the box's top).
- **Landmarks.** The break in her side where the sea comes in, the hold, the bulkhead's low door and
  the master's cabin aft.
- **Points of interest.** The way in at her break, the hold and what she carried, the cabin and the
  door's own line, which gives its band (#845).
- **Encounters.** The Hand's ashen overseers (13) and the Sunderwood's ashen gleaners (15, MONSTERS
  §6.3) stripping her hold, as F6's keepers keep its watch: three overseers with a gleaner at the
  hold's mouth, nearer her break; four gleaners alone at the cabin's door aft, the hardest (§9,
  #835's 15); no guardian.
- **The ways in and out.** Its door at E5's 18,28 in the black rocks, with 18,29 open before it; one
  way out, back onto the strand.
- **The secret and its hint.** The master's strongbox under the cabin's deck. The hint: one plank of
  the deck worn bright among the grey.
- **New here.** The enclave itself (#845).
- **Finds.** 250 gold and an Elixir in the hold's cargo chest; 300 gold with the reward in the
  strongbox.
- **Reward.** Keelhaul, Long Axe (§9, #835's 17), found in the master's strongbox and sold nowhere,
  inside the Sunderwood's window, 3,000 (EXPANSION §5.2, #845's 3: the last road area whose floor is
  at or under 14).
- **Pay.** Counted in no clear (`tools/tests/curve.ts`): 750 xp a member and 868 gold, a figure
  only.
- **As built** (#835, 23 October): `brokenback`, a dungeon of one level of 16 by 16 marked an
  enclave, band 14–15, region `wrackholm`, its plate at 150,150 in the sea off E5's door, start 7,1
  facing south, its one way out onto E5's 18,29 facing south. The break (`wb_break`, 7,2) and the
  tide's leavings (`wb_tide`, 6,4) beside four squares of shallows that a swimmer wades; the hold
  across 10 squares at rows 7 to 10, with two pillars, the sight of what she carried (`wb_hold`,
  8,8) and the cargo's chest (`wb_cargo`, 4,10); the bulkhead's forced door (`wb_bulkhead`, 7,10) at
  7,11; the master's cabin aft at rows 12 to 14 (`wb_cabin`, 5,13; `wb_stern`, 8,14). The secret:
  the worn plank (`wb_plank`, 11,13), the wall at 12,13 where the art check takes it and the hollow
  under the deck (`wb_under`, 13,13) with the master's strongbox (`wb_strongbox`, 14,13). Groups:
  `wb_strippers` at 7,7 (three ashen overseers and an ashen gleaner, 13.5) and `wb_gleaners` at 7,12
  (four ashen gleaners, 15), each respawning at 2,880 and neither roaming (§9, #835's 15 and 16). It
  holds 92 squares on foot (89 outside the hollow) and 96 with the shallows. A company at 14 wins
  every fight and manages 7.48 fights to a rest, inside the aim (6.5 to 8.5), 0.7% of its days
  ending in a fight broken off; two under, at 12, 4.91, 65.5% of the floor's 7.5, inside the aim.
  Density: 92 of 92 squares within 7 steps, the furthest 5, no sign among 13 points. The curve's
  rise: rank correlation 1.00, the nearest group at 6 steps (13.5) and the hardest at 11 (15.0). It
  pays 750 xp a member and 868 gold, counted in no clear, so the isle's lead stays at 14.3.

### 12.6 The lair: Nick's Locker, Old Nick's sea cave (#835): one level of 16×16, band 30–32

- **Purpose.** Holdfast's lair (§6, #846): a sea cave of one level under the reef at the east end of
  F5's strand, where Old Nick, what the smugglers fed first, keeps the ship it took, her master and
  his knife. A place of its own off the road and off the quest (#845), held at the cap's band by one
  guardian, with the area's artifact in it: #835's last piece.
- **Band.** The cap's, 30–32.
- **Landmarks.** The mouth in the reef, the flooded passage up from it and the cave where the ship
  lies on her side, stripped to her ribs, her master against her keel.
- **Points of interest,** eight sights, two chests and one group: the mouth; the flooded passage;
  the cave's throat; the cave and the ship; her ribs; her master, and Holdfast on him; the kelp; the
  cleft and the sea chest; the door's own line.
- **Encounters.** Old Nick (devilfish, a new kind; boss, 32; docs/MONSTERS.md §13), the one
  guardian, drawn in the creatures lane, lying in the cave's throat where the way to the ship
  passes, so that no company steps round it.
- **The ways in and out.** Its door at F5's 16,30 in the reef, walked into from the strand at 16,31
  and waded into from the shallows at 16,29, its line and then its band said as a border's are
  (#845's 5); one way out, back onto 16,31, facing the land. F5's square is drawn as stone and given
  its `exits` line, and nothing else of F5 changes.
- **The secret and its hint.** The master's sea chest in a dry cleft behind the ship's bows. The
  hint: kelp grown green over the rock that shuts the cleft, where no wave comes, as the knife's
  haft has not rotted (§6).
- **New here.** Old Nick and the artifact (#846, #847): the lair itself, its guardian a boss whose
  blows heal it.
- **Finds.** Holdfast, a smuggler's knife, 1d8+15, Grasping Roots three a day, found and never sold
  (§6), alone on the ship's master; in the sea chest 500 gold, an Elixir and a Sapphire Vial.
- **The rumour.** Merryn on F6 (§6): at every meeting after her first while Old Nick lives, two
  lines of a ship she counted in and never out, words only. It marks nothing on the world map.
- **Pay.** About 3,400 xp a member, Old Nick's, counted in no clear (`tools/tests/curve.ts`).
- **As built** (#835, 23 October): `nicks_locker`, a dungeon of 16 by 16 marked `enclave`, band
  30–32, region `wrackholm`, its plate at 188,152 in the sea off F5's door. In under the reef at
  F5's 16,30, drawn as stone, onto 5,14 facing north: the door says "Nick's Locker: levels 30-32.",
  with harder one or two under and the warning three or more. The passage, one square wide, runs
  north from the mouth, seen at 5,13 with four squares of shallows west of it that a swimmer wades
  (3 to 4 on rows 12 and 13); east along row 12, the flooded passage seen at 6,12; then north up
  column 7, the cave's throat seen from 7,11. Old Nick lies in the throat at 7,9 (`nl_nick`), the
  one way on: with its square and those a step from it shut, the 10 squares a walker, swimmer,
  climber or levitator reaches from the mouth hold nothing past it. Past it the cave, rows 3 to 8
  and widest at 3 to 13 on rows 4 to 6, seen from 7,7; the ship's ribs, six pillars at 5, 7 and 9 on
  rows 4 and 6, seen at 7,5; her master at 12,5 and on him, at 12,6, Holdfast (`nl_belt`). The kelp
  at 9,3: searched there facing north, the rock gives at 9,2 on the cleft, 8 to 9 on row 1, seen at
  9,1, with the sea chest at 8,1 (`nl_sea_chest`: 500 gold, an Elixir and a Sapphire Vial), which no
  walker, swimmer, climber or levitator reaches but through the rock. Out by the mouth onto F5's
  16,31, facing south. It holds 60 squares on foot (57 outside the cleft) and 64 with the shallows.
  The gate judges Old Nick alone, on its odds: won 57% at 30, inside the aim of 30% to 70%, and 81%
  at 32, under the aim of 90% and inside the limit of 75% (§9, #835's 25). Density: every square
  within 7 steps of a point, the furthest 5, no sign among its 12 points. The curve's rise: one
  group, Old Nick at 7 steps, level 32 where it asks at least 31. By the curve's count it pays 3,396
  xp a member and holds 500 gold, counted in no clear: Wrackholm's clear, 11,426 xp a member and
  7,729 gold, and its lead, 14.3, do not move. Merryn says nothing of Old Nick at her first meeting
  and speaks of it at every one after while it lives, in 6 to 11 of her box's 14 lines, and her own
  words alone once it has fallen.
