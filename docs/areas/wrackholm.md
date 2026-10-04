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
three decks, its Rift and the stair's foot off F6's shore (#190). Its content is
`src/content/areas/wrackholm/` (`index.ts`, its maps, monsters, items and atlas, its walkthrough;
its chapter of the one quest, The Stone Carried Home, in `chapter.ts`, and its side quests in
`quests.ts`, #192); it has no town and no businesses, so no rooms. Its part of the world map is
its folder's (`atlas.ts`, #186), which the Area now carries; the plan no longer spreads it in. Its
ids: the area and its zone `wrackholm`, the cove `smugglers_cove` (the id stays under the new name,
NAMES §3) and its sea cave `smugglers_cove2`, the ship's decks `tide_ship`, `tide_ship2` and
`tide_ship3`, its Rift `tide_ship_rift`, the stair's foot `dead_drop_stair` and, below it, the plan's
`dead_drop`.

---

## 1. Where it is

The atlas (`src/content/areas/wrackholm/atlas.ts`, which the Area carries) makes Wrackholm one zone:

| Zone | Band | Squares | Built |
|---|---|---|---|
| Wrackholm | 12–14 | 2,066 | E6, the moor and the landing, laid at 136,158 (#187); F6, the east rocks, at 168,158 (#189) |

Squares are the ones the atlas gives it, shallows included. Without the shallows the isle is 1,754
squares, about 1.7 zone maps (EXPANSION §1 has 1.7), and every one of them a company could walk:
grass 878, heather 514, hills 158, rock 105 and sand 99. It runs from x 142 to x 199 and from y 150
to y 210, in the middle of Sylmeer, with Saltreach's Saltings to the west across the water, the
Deepthorn's Penspern to the north-east and Hearth Isle to the east. The zone's band is the folder's:
12–14, the area's, and the boxes rise through it (§4).

**The grid** (EXPANSION §8.2; docs/areas/shelf.md §1). The isle is two boxes, E6 and F6, and 234
squares of shore in the four round them (E5, F5, E7, F7), which go with their boxes' edges or stay
void (§11). Its only neighbour on the grid's land is the Wold, 13 squares of shallow at its
south-west corner where the Glasswold's coast comes near; no way runs there.

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
  with the way back up (#190): a warning, not a wall. The Dead-Drop past it is #22's.

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
the sites (Kelp Hole, the Tide Ship) and the links (the boat, the two ways in, the stair); the
Dead-Drop's plate is the plan's (#22). Its systems are Saltreach's (#150) and the boat's (#164); its
monsters are drawn in #193.

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
  under the cliff by night. Its item is the founder's seal (`items.ts`).
- **The Tide Ship** (`tide_ship` 12–13, `tide_ship2` 12–13 and `tide_ship3` 12–14, three decks of
  16×16, with the Rift `tide_ship_rift` 12–14 and the stair's foot `dead_drop_stair` 26–28; #190):
  boarded by night in Dando's boat from F6's shingle; the weather deck and the devilfish over the
  side, the lower deck's rats, the Hand's post and the captain's cabin with the papers and the log,
  and the hold, its crew among the chained rows, Hale in the last row, the Tide Elder at the
  bulkhead and the shard-cut past him; the Stone's Rift and its Warden, and the stair down (§4.5).
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
The scraps of shore in E5, F5, E7 and F7 go with their boxes' edges or stay void (§11).

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
| The Dead-Drop | below the hold | the Compact's orders come from there; three third-prestige quests go down (#22, #19) | a planned dungeon at 208,204, band 26–28, the plan's (#22) |

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
  the inlet's gulls, the east path) every time; two under, at 10, it wins every fight too, which is
  owed to #18 until gear past 10 lands (`tools/tests/gate.ts`'s `OWED`). What the owner finds by
  hand goes here when the box has been played.

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
  1,230 of it in the chests. The Great Devilfish is set off the boss line for the gate, at 600 hit
  points and 8d7+10: the bot wins it 66% at 12 and 91% at 14, where the line's 674 and 13d7+19 won
  11% and 28% (69% and 96% after the re-stat to #409's line, #18, which leaves it as set; 96% and
  100% once the gate's company takes its first prestige, #541, past the limit at 12 and owed to
  #18). The
  crews' cave at 12 wins every fight, at 6.8 fights to a rest (7.0 after the re-stat), and two
  under, at 10, wins every fight too, which is owed to #18 with E6's; the sea cave at 12 wins 91.5%
  of its fights with the boss, at 6.5 to a rest (92.3% and 6.6 after the re-stat, 99% with the
  first prestige), and 83% at 10,
  inside the limit. The walkthrough plays both levels, the boss at 14, and leaves by the passage.
  What the owner finds by hand goes here when it has been played.

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
  The hint: the hermit's count starts at a date.
- **New here.** Nothing, as built: dens are on the Downs already, and boarding by night is #190's.
- **Finds.** The founder's seal, a quest item the Compact's hall takes at the rank that reveals
  (#22; #182 left it there, so as not to tell the reveal at Runner).
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
  the area's pool, which is owed to #18. What the owner finds by hand goes here when the box has
  been played.
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
  devilfish over the side by night. The lower deck: eight bilge rats in the crews' quarters, three
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
  the dark at its far end and the stair back up. The Warden is set off the boss line, at 674 hit
  points and 10d7+15 against the line's 13d7+19 (38% at 12) and the escorted boss's 7d7+11 (97%):
  the gate wins him 63% at 12 and 96% at 14, dressed by #399's ladder and measured after #414's
  re-stat (94% and 100% once the gate's company takes its first prestige, #541, past the limit at
  12 and owed to #18). As measured the ship pays about 3,500 xp a member, 1,843
  of it the Rift's, and 3,532 gold, which brings the area's gold to the 6,000 its
  training costs. Each deck at 12 wins every fight, at 6.1, 7.6 and 7.0 fights to a rest, inside the
  aim of 6 to 8, the Rift 81.5% with its boss (97% with the first prestige) and 7.6 to a rest;
  two under, at 10,
  the decks win every fight too, owed to #18 with E6's, the Rift 55.5%. Every square of every deck is within 5 steps
  of a point. The walkthrough rows out by night, plays the three decks at 12, finds the shard-cut,
  frees Hale once he is taken, wins the Warden at 14 and the Stone, and goes down the stair and
  back. What the owner finds by hand goes here when it has been played.

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

## 7. Encounters, and what is new

MONSTERS §6.2 has the roster and the fights: the Wrack Gull, the Bilge Rat, the Wrack Smuggler and
the Wrack Bowman, the Ashen Overseer, the Devilfish and the Great Devilfish, the Tide Elder and the
Warden of the Tide; the hold, and over the side. Their drawings are #193's, nine issues (#231 to
#239). Wrackholm spends none of MONSTERS §3.3's asks of its own: it spends Saltreach's. F6 places
Sunderwood's Ashen Gleaner (MONSTERS §6.3) beside the overseers at the smugglers' watch (#189), so
the gleaner is met here first; MONSTERS' Where column is the owner's to change.

New in Wrackholm, for the novelty check (EXPANSION §5.4): the devilfish, a new family (E6 claims it,
placing them first); heather underfoot (#162); an area reached by a crossing (#164); a ship as a
dungeon; the Hand's overseers, grey to the wrist (MONSTERS §12); a boss that is fed; the first door
into the hull (#22). Its landmarks: a landing, a sea cave, a wreck. The check holds one of these
besides the devilfish and the heather (#190): the wreck, the Tide Ship's site.

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
  the curve, and the side quests' 900 would bring it to about 11,430, 16% over.
  From here on a kill pays
  by level (#159); the curve's row reports what a clear falls short of as owed to #154 until the
  maps exist, and MONSTERS' open question 4, what a fight is worth from Saltreach on, is settled on
  the first box built.
- **Gold.** Training six members from 12 to 14 costs about 6,000 with today's `trainPrice`; the
  hold's strongboxes and the crews' drops pay it, and the isle has no shop to spend it in until the
  boat back. As built a clear gives 6,079 (#190): the ship's chests carry 3,200 of it.
- **The gate.** Each map at its own floor (docs/areas/thornmark.md §9, 17): a company at 12 wins nine
  in ten on E6 and one at 10 no more than one in four; the Great Devilfish is won about half the time
  at 12 and nearly always at 14, the Warden of the Tide the same.
- **Density.** Both boxes at the Foreland's floor (EXPANSION §5.3).

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
   its warning; `dead_drop` stays the plan's place. The curve's band check let it stand first, in
   the quality lane (#407).
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
4. **The Great Devilfish is set at 600 hit points, 8d7+10 and armour 20,** the one set measured
   inside both of the gate's aims; the narrow rise from 12 to 14 is the gear past 10, #18's.
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
   only the hatch and one room.
5. **The pay is scaled to 9,867,** the side quests inside and the Dead-Drop outside, as Sunderwood
   counts Wrackholm's: 100 more each to E6, F6 and the Tide Ship.

## 10. Names

Wrackholm's names are the sailors' English, the tongue that named Brandy Hole and the Wyke, and
stay: Wrackholm, the isle of wrack (weed and wreckage both); the Tide Ship; and Kelp Hole for
Smugglers' Cove, which NAMES §1 counts a bare description, a sea cave with kelp on its rocks in
Brandy Hole's pattern. The Tidefolk's tongue (docs/areas/saltreach.md §10) names nothing here: the
isle is the Compact's, not theirs. The Dead-Drop keeps its name until #22 says otherwise.

## 11. What was cut

- **The scraps** of shore in the boxes round the isle: E5 (74 squares), F5 (69), F7 (57) and E7
  (34), 234 in all and every one walkable, shingle and grass at the water's edge. Each goes with
  its box's edge where E6 or F6 reaches it, and the rest stays void: a strip of beach with nothing
  on it (DESIGN §1).
- **The Dead-Drop** below the ship, which is Phase 4's (#22): this act builds the hatch and one
  room, no more.
