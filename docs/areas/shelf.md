# The Foreland: step I of the road, to its edges

The Foreland is the first step on the road of levels (DESIGN §9, EXPANSION §2.2): Helmstow, its
coast and Callow Downs, band 1–5. This is its area doc (EXPANSION §4, §6 and §8.2): where the atlas
puts it, what is built, what the atlas and the docs put in it that is not, the plan for building
the rest, box by box. Figures are measured on main at `4129f47` (27 September 2026) with `worldGrid`
(`src/game/atlas.ts`).

It was the Shelf until its naming pass (§10). Its ids are as they were: the area, its zone and its
map are `shelf`, the Downs `downs`, the city `harrow`.

---

## 1. Where it is

The atlas (its rows in `src/content/areas/shelf/atlas.ts`, merged into `ATLAS` by
`src/content/index.ts`) makes the Foreland two zones:

| Zone | Band | Squares | Built |
|---|---|---|---|
| The Foreland | 1–5, its map's | 2,296 | 879: the Foreland map, laid at 200,30 |
| Callow Downs | 2–5 | 6,569 | none |
| The area | 1–5 | 8,865 | a tenth |

Squares are the ones the atlas gives each zone, shallows and rivers included. Without the shallows
the area is 8,594 squares, about 8.4 zone maps (EXPANSION §1 has 8.3). It runs from x 94 to x 231
and from the rim down to y 120.

**The grid.** Every outdoor map is one box of the grid the Foreland and Thornmark sit on: 32 squares
a side, with its corner at x = 8 + 32i and y = −2 + 32j, cut to the world at its edges (EXPANSION
§8.2). A box is named as the old maps were, by its column's letter and its row's number: the
Foreland is G2 and Thornmark H2. The world map's border letters these boxes, the strips at the
world's west and south edges unlettered (#66).

On the grid the Foreland's map is G2, and the Downs are seven boxes, by column: F2 and F3 beside it;
E2 and E3; D2, D3 and D4 (§4). The row above, C1 to G1, is the rim. C2 and C3 hold a strip of the
Downs' cliff top among Saltreach's land, and E4, G3 and G4 a few squares of shore in the sea.

Its edges:

- **North: the rim,** the band of mountains inside the world's edge, about nine squares deep. It
  stands right behind Helmstow's north wall, and the maps of row 2 end in it.
- **East: the ridge, with the Scarth through it** into Thornmark (5–10). The only built way out.
- **South: the Wyke.** The Mewstone lies in its mouth, in G4, a box of sea round the islet. The
  atlas gives it to the Deepthorn (110 of its 116 squares), since an islet goes to the nearest zone
  across the water. It is off the road, and waits for boats.
- **West: Kestrel Edge,** a cliff from the rim to the Salt Gulf, above Saltreach's Upper Water
  (10–12). The area's border keeps to the cliff's lip except at its two ends. In the rim it drops
  straight down through the mountains at x 94, a few squares east of the cliff, where there is
  nothing to follow. At the south end it leaves the cliff and takes a strip of low ground at the
  cliff's foot, about eight squares wide (x 109–120, y 99–121), so the road down Kestrel Edge
  (`src/content/atlas.ts:364`) ends on the Downs and not in the Delta. Once D3 and D4 are built the
  border there is their edges: the cliff runs through both boxes, and D4 holds the road's last
  squares down it.
- **South-west: the Salt Road down Kestrel Edge** into the Delta (10–12), open from the start: one
  road, lightly held (EXPANSION §2.2).

Between the two zones the area map (M, then Tab) draws a dotted line from the rim down through
Brockholt and the fields to Gullwick. It follows nothing on the ground. It is where the walk out
from the Foreland map meets the walk from the Downs' seed in Brockholt (180,30), and it moves as
soon as a Downs map is laid, since a built zone starts its walk from its whole map: once F2 is
built, the Foreland zone is its map and no more, and the line is the map's west edge. Until then
the Foreland zone holds about 780 walkable squares of field and wood west of its map that are void
in play.

`node tools/worldmap.ts out.png --zones` paints it.

## 2. What it is for

The start of the road and the first half of Act I (DESIGN §9): the company's first contract, its
first dungeon and its first Rift, the Ashen Hand's creed on a wall for the first time, and the night
the light went out, seen from the shore. Every kind of monster but the machine is met here at its
gentlest (MONSTERS §5). The Downs are that night on the coast: the fishermen steer by the Hearth,
and with it failing the coast is dark, and the dark has people in it who were waiting for it
(MONSTERS §5.2). The weather is the Foreland's: mild, wet, and foggy off the sea in the autumn.

## 3. What is built

| Map | Kind | Band | What is there |
|---|---|---|---|
| Helmstow | town, 16×16 | 1–4 | the Hearthlight Inn, the Chapel of the Lanterns, Mottram's Stores, the Lantern Guildhall (spells to tier 2), the Warden Drillyard (training to 6), the Gilded Eel and its four rumours, the gatehouse north into the keep's ward |
| The Keep | town, 16×10 | 1–4 | the keep's ward behind Helmstow's north gatehouse, grey stone and the Queen's blue and gold: the Regent's proclamation, petitioners on the steps, the chapel where the Queen lay in state and a mourner, the rookery keeper, the garden well; Vask and his contract in the throne room behind the keep's door |
| The Foreland | outdoor zone, 32×32 | 1–5 | the road, woods, marsh and beach; the Ashcombe farm; Hale's checkpoint at the Scarth; ten groups |
| Ashcombe Cellar | dungeon, 16×16 | 1–4 | four rings; the dead Lantern and her survey wand; the Rift and its Warden |
| Brandy Hole | dungeon, 16×16 | 2–4 | smugglers, crabs and the drowned; the captain's den and the iron key |
| The Seam | dungeon, 16×16 | 3–5 | the Ashen cult's galleries; the Ashen Deacon and the Cargo Ledger |

Its chapter of the one quest is The Quiet Farm (Vask, `chapter.ts`) and its side quest The Cargo
Ledger (Hale, `quests.ts`); the monsters are MONSTERS §5.1's.
Each secret door has a hint on its near side: the cellar's (mill 4,7) a cold draught at 4,6
(`mill_draught`), Brandy Hole's (greywater1 10,11) drag marks at 9,11 (`gw1_drag`) and the Seam's
the carving over a blank stretch of wall.

In more detail, as SLICE.md had it before the area docs:

- **Helmstow** (town, 16×16): inn (rest, rations), temple (cure and raise, priced by level), shop
  (buy and sell), Lantern Guildhall (join, then buy tier-2 spells), Warden Drillyard (train a level
  when the xp allows; levels are bought, not automatic), the Gilded Eel tavern (rumours), a well, a
  sign and the gatehouse in the north wall.
- **The Keep** (town, 16×10): the keep's ward behind the gatehouse, with a palette of its own and
  the Queen's banners placed (`banners`); Lord Vask on the keep's door, holding court in the throne
  room (the contract and the hand-in); people and a well. A building on its west side stands empty
  for the armourer (#19).
- **The Foreland** (outdoor zone, 32×32): road, woods, hills, marsh, the coast, ten roaming or lurking
  monster groups with respawn timers, the Ashcombe farm. It and Thornmark are played as one
  outdoors ([SLICE.md](../SLICE.md), "The outdoors as one map").
- **Ashcombe Cellar** (dungeon, 16×16): four rings, an iron key, a locked door, a secret door, the
  dead Lantern and her survey wand, the Rift and its Warden.
- **Brandy Hole** (two dungeon levels, 16×16 each, band 2–5): smugglers' caves in the south-west
  cliffs, reached from the beach. Level one, the caves: smugglers, shore crabs and drowned
  men, a secret stash, and the captain's den with the iron key to the stairs. Level two, the
  Seam: an Ashen cult's galleries around a sealed shrine; a secret vestry holds the key, and the
  Ashen Deacon guards the Cargo Ledger. Captain Hale at the pass checkpoint gives the contract
  and takes the ledger. Chests carry the Foreland's mid-tier gear (long sword, kite shield, scale,
  chain, long bow).
- **The ramp to Thornmark.** The pass is open from the start. The sign at the Warden checkpoint
  (30,9), on the one square the road into the pass is entered from, warns every company that goes
  through, and Hale warns in his lines; Thornmark's monsters decide. The slice's early monsters give
  about double their old xp, so one clear of the Foreland and the cellar is worth level 2 per
  member, and adding Brandy Hole is worth level 4; respawns make up the step to Thornmark's band 5.
  The curve (`src/content/progression.ts`) checks what the area pays, in place of the tests that
  pinned both.

Its content is in `src/content/areas/shelf/` (maps, monsters, items, chapter, quests, climate and
its part of the world map) and its businesses' rooms in `src/ui/interiors/shelf/`. Its
`walkthrough.ts` plays its chapter, The Quiet Farm, from a new game, a step at a time
(`tools/walk.ts`); Thornmark's plays the chain on from it. A step added to the chapter adds its
play there. The other end-to-end tests (the pass, the stairs) cross into Thornmark, so they stay in
`tools/tests/`.

## 4. What is still to build

About 7,700 squares of land, all of it void in play: some 6,400 a company could walk, and the rest
the rim and Kestrel Edge. On the grid (§1) the Downs are seven boxes and a dungeon, and the boxes
hold 5,654 of those squares and 5,570 of the walkable ones:

| Box | Name | Kind | Band | Land | What is there | Its step of the quest | Issue |
|---|---|---|---|---|---|---|---|
| F2 | The road west | country | 2–3 | 1,024: fields, Brockholt's wood | Coldharbour; Brockholt; the Salt Road west from Brandy Hole's beach | none | #47 |
| F3 | Gullwick | core | 2–3 | 300, and 724 of sea | the village at the Wend's mouth, its boats and a camp; wreckers on the shore by night; crows in the stubble | Wenna's mother | #47 |
| E3 | Crowness | core | 3–4 | 857, and 167 of sea | Crowness Light and its keeper; the Salt Road west; a lampman and four wreckers in fog; the gibbet and its crows; shore crabs under the light | the keeper's log of the eleven | #67 |
| E2 | The Wend's fields | country | 3–4 | 1,024: fields, the Wend | crows over wolves in the stubble; the track from Coldharbour up to the Berth | none | #68 |
| D2 | The chalk hills | core | 4–5 | 1,024: the chalk | wolves by day and the Black Dog by night; the Berth's mouth | in the Berth, below it | #69 |
| D3 | The west downs | country | 4–5 | 944 | open down to the lip of Kestrel Edge | none | #71 |
| D4 | Kestrel Edge | country | 4–5 | 481, and the cliff's foot | the Salt Road down the cliff, and bandits with their archers on it | none | #72 |

**The Berth** is a dungeon of its own, one level of 16 by 16, band 4–5, entered from D2: the Queen's
guard two by two down the passage, and her captain at the empty bier (MONSTERS §5.2). Its step is
the barrow opened, and only her signet gone (#70).

The core is the three boxes that hold a step of the quest, built at full density; the rest is
country, built to the looser floor with the wilderness features (EXPANSION §2.1 (b) and §5.3, #45).
The bands rise from the way in to the far end, as the gate asks (EXPANSION §5.2).

**The order** is the Salt Road's, and the quest's: F2 and F3, the pilot (#47); then E3, E2, D2 and
the Berth, D3 and D4. They are the epic #65, with the grid (#66), the Lodestone (#73) and tier 3
(#74). F2 is first because it is the only box that meets the Foreland, and the road
west runs into it. The steps come in the order the road reaches them: Gullwick, Crowness, the Berth.
D3 comes before D4 because the Salt Road cuts a corner of D3 on its way down, and the way into Act
II comes last.

The places, as the atlas and the docs have them:

| Place | Box | What the docs say | On the atlas |
|---|---|---|---|
| The chalk hills | D2, and the north of D3 | wolves, and the Black Dog round the Berth by night (MONSTERS §5.2) | hills, 1,824 squares of the Downs |
| The fields round Gullwick | F2, E2 and F3 | crows over wolves in the stubble | farmland, 1,123 squares |
| Brockholt | F2 | nothing yet | a wood astride the two zones, its north tip in the rim's row |
| The Wend | E2 and F3 | nothing yet | a river from the rim down to Gullwick, cutting a corner of E3 |
| Gullwick | F3 | Wenna's village, where her mother asks the company to find her (DESIGN §9) and where STORY opens; an old shanty singer who teaches the Bard's second prestige (#19) | a planned village at 172,70 |
| Crowness Light | E3 | the keeper who counted the eleven and wrote down the gaps (DESIGN §9, STORY); the Cleric's second prestige (#19); shore crabs under it | a planned lighthouse at 140,88, inland of the point (about 152,89) |
| Coldharbour | F2 | a retired Warden captain's farm; the Knight's second prestige (#19) | a planned farm at 176,42 |
| The Berth | a dungeon, entered from D2 | the Queen's barrow, opened, and only her signet gone (DESIGN §9); band 4–5, her guard two by two down the passage and her captain at the empty bier (MONSTERS §5.2) | not on the atlas |
| The Salt Road | F2, F3, E3, a corner of D3, and D4 | the wreckers and their lampman in fog; crows at the gibbet (MONSTERS §5.2) | a planned road, and the way down the Edge |
| The Lodestone | G2, the built map (21.5,4) | "already intact; tutorial" (DESIGN §4) | a planned site; nothing in the game |
| The Mewstone | G4 | nothing yet | an isle, the Deepthorn's |

### 4.1 The briefs

Each box's brief is what EXPANSION §8.2 asks of one: its purpose, band, landmarks, the secret and
its hint, the encounters and what is new, with its points of interest and a first share of the pay
beside them. They are drafts for the owner, written before the pilot has measured a box; each is
settled in its issue, and what the pilot teaches changes the ones after it.

- **Points of interest** (EXPANSION §5.3). A core box is held to the Foreland map's density: nine
  features, ten groups and four ways in or out to 868 open squares. A country box has about half,
  and the wilderness features (#45) do most of the work. No more than one point in four is a sign.
- **Encounters** are MONSTERS §5.2's roster and fights, with the Foreland's own monsters (§5.1)
  where its land runs on. A group is about one of MONSTERS §4.4's standard encounters.
- **Pay.** The Downs owe about 2,070 xp a member (§8). The shares below add up to that, for the
  curve to settle (#31) and the gate to check (#38).
- **Side quests** are #56's, placed as §6 has them.
- **Finds** are the gear ladder's (§8, #99): each is an item already, and its box's issue places it.

### 4.2 F2, the road west (#47): country, band 2–3

- **Purpose.** The first land off the built map: the fields and wood between Helmstow and Gullwick,
  walked on the Salt Road. Quiet country, where a company meets the wilderness features and its
  first crows.
- **Landmarks.** The Salt Road, out of the Foreland by Brandy Hole's beach and bending south-west
  into F3; Coldharbour at 176,42, a steading with a barn and a lamp kept lit in the window;
  Brockholt in the north-east, beeches over the badgers' setts; stubble fields between.
- **Points of interest,** about six features and five groups:
  - the captain at Coldharbour, retired from the Wardens, and his lamp;
  - Coldharbour's well;
  - a wayside shrine where the farm track leaves the road, its candle out (#45);
  - a woodcutter's camp in Brockholt, to rest at (#45), and the woodcutter, with a rumour;
  - a cairn on the rise at the box's west edge (#45);
  - a milestone where the road leaves the Foreland: GULLWICK 2, CROWNESS 4.
- **Encounters.** Wolves in Brockholt (three), a boar in the wood, bandits with an archer on the
  road, as on the Foreland map; crows in the stubble (six); rats in Coldharbour's barn (five).
- **Quests.** No step of the one quest (§9). Riders in the Dark is the captain's (§6).
- **The secret and its hint.** Under the holly at Brockholt's heart one sett runs deeper than
  badgers dig: a smugglers' cache from before Brandy Hole was cleared, brandy and a crate with the
  customs seal. The woodcutter's rumour is the hint: the badgers never go near the holly.
- **New here.** Farmland and hills underfoot (#44), the wilderness features (#45), the Carrion Crow
  (#46).
- **Finds.** Brockholt's cache holds a Short Sword +1 and a Dagger +1.
- **Pay.** About 130 xp a member.

### 4.3 F3, Gullwick (#47): core, band 2–3

- **Purpose.** The Downs' first step, and where STORY begins: the village that stood in the surf
  with lanterns the night the light went out.
- **Landmarks.** Gullwick at the Wend's mouth, 172,70: a dozen cottages, the net loft, and boats on
  the shingle with a loop inside a loop painted on their bows (STORY). The Salt Road along the
  shore. The rise above the village where the company camped that night. The wreckers' beach at the
  box's south-west end, towards Crowness.
- **Points of interest,** about seven features and three groups:
  - Wenna's mother, who asks the company to find her daughter: the step (§5). A company that has
    already read the Cargo Ledger has seen Wenna's name, and she hears it in their faces;
  - the boats, and the mark on them;
  - the net loft, a camp to rest at (#45);
  - an old man mending nets who sings the shanty, with a rumour (the Bard's second prestige, later:
    #19);
  - the family whose boat never came in, and the Compact's man on the road west (The Boat With No
    Name-Board, §6);
  - the ashes of a camp on the rise, and the whole bay below it;
  - the village well.
- **Encounters.** Two wreckers and their lampman on the beach by night (`when`); crows in the fields
  above the village (six); shore crabs on the shingle (three).
- **Quests.** The step. The Boat With No Name-Board starts and ends here, and Who Lived at
  Ashcombe's tenant starts over here if Hale sends him (§6).
- **The secret and its hint.** A cave in the rock at the far end of the wreckers' beach, where they
  keep the boat they were expecting. The shanty's last verse is the hint: where the lamp goes out,
  the cave goes in.
- **New here.** Groups that walk by night (`when`, #41), and a village drawn on its box.
- **Finds.** The wreckers' cave holds a Mace +1 and a Quarterstaff +1.
- **Pay.** About 110 xp a member.

### 4.4 E3, Crowness (#67): core, band 3–4

- **Purpose.** The Downs' second step and their fight in fog: the light that kept the count, on a
  coast where wreckers wait for the dark.
- **Landmarks.** Crowness Light on the point, about 152,89, with the keeper's cottage under it. The
  Salt Road along the coast to the corner of D3. A gibbet at the roadside above the rocks. The last
  of the stubble to the north, and the Wend's last bend in the north-east corner. That corner,
  across the Wend from Gullwick, is left free for Ashcombe, which #87 moves there.
- **Points of interest,** about nine features and eight groups:
  - the keeper who counted the eleven, and his log: the step (§5);
  - the lamp room at the top of the stair, dark until Oil for the Lamp is done (§6);
  - the gibbet, and who hangs from it;
  - a wreck on the rocks below the point, with its salvage (a chest);
  - a shrine where the path leaves the road for the light (#45);
  - a cairn on the point (#45);
  - a camp in the lee of the headland (#45);
  - the keeper's well;
  - a sign at the fork: CROWNESS LIGHT.
- **Encounters.** A lampman and four wreckers on the road in fog, the lamp the first thing the
  company sees (MONSTERS §5.2); wreckers on the rocks by night (two groups); crows at the gibbet
  (eight); shore crabs under the light (four); bandits with an archer on the road.
- **Quests.** The step. Oil for the Lamp (§6).
- **The secret and its hint.** The wreckers' false light: a niche in the rocks below the point, with
  their lamp and a chart of the reef. The keeper's hint: some nights there is a second light on the
  rocks, lower than his.
- **New here.** The weather as a warning: fog that leaves two squares of sight, and a fight that
  begins in it.
- **Finds.** The wreck's salvage holds a Buckler +1.
- **Pay.** About 340 xp a member.

### 4.5 E2, the Wend's fields (#68): country, band 3–4

- **Purpose.** The middle of the Downs: the fields either side of the Wend, and the way up to the
  chalk.
- **Landmarks.** The Wend, from the rim down through the box towards Gullwick, with a ford where the
  track to the Berth crosses it; the stubble; a drowned mill on the river; the hills rising at the
  west edge.
- **Points of interest,** about six features and five groups:
  - the ford, with hoofprints going west and coming back (Riders in the Dark, §6);
  - a boundary stone with a riddle cut in it, answered with the shanty's first word (#45's statue);
  - a spring above the river (#45's fountain);
  - a cairn (#45);
  - a shepherd's camp (#45), and the shepherd, who has heard the Black Dog on the hill;
  - a sign at the ford: THE BERTH, and something scratched under it;
  - a rookery in the willows by the drowned mill, a den (#88), with its hoard.
- **Encounters.** Crows over wolves in the stubble (six crows and two wolves: MONSTERS §5.2's
  fight), the crows the rookery breeds; the rookery's keepers, which never leave it; wolves where
  the fields meet the hills (three); a boar in the willows.
- **Quests.** Riders in the Dark's night watch at the ford (§6).
- **The secret and its hint.** The drowned mill's wheel-pit, with the miller's hoard behind it. The
  shepherd's hint: the miller never trusted a bank, nor the river.
- **New here.** The first riddle, answered with a word the company heard somewhere else, and the
  first den.
- **Finds.** The miller's hoard holds a Robe +1 and Leather Armour +1; the rookery's hoard, the
  bright things a crow would carry, a Silver Locket, a keepsake.
- **Pay.** About 190 xp a member.

### 4.6 D2, the chalk hills (#69): core, band 4–5

- **Purpose.** The way into the Berth, and the hills by night.
- **Landmarks.** The chalk ridge; the Berth's mouth on the crest, about 118,42, its stones pulled
  aside; smaller barrows along the ridge; a dew pond; the track up from the ford in E2. Proposed: a
  figure cut in the chalk below the ridge, older than the Crown, which the shepherds call the
  Cradle; seen from the Berth's mouth, it is a ship. Nothing says so (NAMES §1).
- **Points of interest,** about nine features and nine groups:
  - the Berth's mouth, the way in;
  - the pulled stones: fresh chisel marks, and the hoofprints of shod horses;
  - a shepherd's hut, and a shepherd who has heard the Black Dog every night since the barrow was
    opened (#45's hermit);
  - the dew pond (#45's fountain);
  - a shrine on the crest (#45);
  - a cairn on the highest barrow (#45);
  - a camp in the lee of the ridge (#45);
  - a sign where the track tops the ridge;
  - the chalk figure, if it is kept;
  - a wolves' den dug into an old chalk pit, a den (#88), with its hoard.
- **Encounters.** Wolves on the chalk by day (three groups of three), the wolves the den breeds; the
  den's pack, which never leaves it; the Black Dog by night round the barrow (one, and then two;
  `when`); crows (six).
- **Quests.** The way to the step, which is in the Berth. Riders in the Dark's hoofprints lead here.
- **The secret and its hint.** One of the small barrows is hollow: a cist with a guardsman's grave
  goods, a halberd and a ring of office. The shepherd's hint: nine barrows on the ridge, and one of
  them rings when the sheep run over it.
- **New here.** The Black Dog, whose bite holds (paralysis), and a group that walks only by night,
  round one place.
- **Finds.** The hollow barrow's cist holds the guardsman's Halberd +1 and his Ring of Office, a
  keepsake that sells well; the wolves' den's hoard, a dead traveller's Spear +1.
- **Pay.** About 420 xp a member.

### 4.7 The Berth (#70): dungeon, 16 by 16, band 4–5

- **Purpose.** The Downs' hardest place, their third step and their boss.
- **Shape.** A long barrow: a forecourt behind the pulled stones; a passage with side chambers,
  where the Queens of the line lie in their niches; and the bier chamber at the end.
- **Points of interest,** about seven features and five groups, the dungeons' floor (EXPANSION
  §5.3):
  - the forecourt, where the stones were pulled from outside, by many hands;
  - four side chambers: the old Queens, each with a name over her niche worn past reading, and grave
    goods nobody has touched (chests);
  - the bier, with the Queen on it and her hand bare where her signet was: the step (§5);
  - the captain's post beside it.
- **Encounters.** The guard two by two down the passage (four pairs of Barrow Guards, which hold
  their ground and never roam); the Barrow Captain at the bier, the boss. None of them comes back.
- **The secret and its hint.** A niche behind the bier, which the captain guards: his own arms, in
  the Queen's colours (deep blue and gold, #17). The hint is cut in the forecourt: HER CAPTAIN LIES
  BEHIND HER.
- **New here.** The Barrow Guard and the Barrow Captain, in the Queen's colours, and a boss that
  asks: won about half the time at the band's floor (EXPANSION §5.2).
- **For the owner.** MONSTERS §5.2 puts the captain beside an empty bier; STORY has the tomb robbed
  of the ring alone, "not the gold, not the jewels". The brief follows STORY.
- **Finds.** The niche behind the bier holds the captain's arms, the Captain's Sword +1 and the
  Captain's Mail +1 (a Long Sword and Scale Mail); the first side chamber a Queen's Long Sword +1.
- **Pay.** About 420 xp a member.

### 4.8 D3, the west downs (#71): country, band 4–5

- **Purpose.** The open downs to the lip of Kestrel Edge, and the first sight of Act II: the Upper
  Water below.
- **Landmarks.** The lip of the cliff, with the Upper Water under it and Reedholm's smoke far off;
  the chalk's last slopes; the Salt Road cutting the south-east corner.
- **Points of interest,** about six features and five groups:
  - a lookout on the lip, over the Upper Water;
  - a falconer who flies kestrels along the edge, with a rumour of the road down (#45's hermit);
  - a shrine to the travellers who went down the Edge (#45);
  - a cairn (#45);
  - a camp (#45);
  - a sign where the Salt Road crosses: SALTMOUTH, DOWN THE EDGE;
  - a bandit camp by the Salt Road, its hut of stolen planks a den (#88), with the road's takings
    for its hoard.
- **Encounters.** Wolves (two groups), bandits with an archer on the road, the bandits the camp
  breeds; the camp's keepers, which never leave it; crows along the lip; a boar.
- **Quests.** None.
- **The secret and its hint.** A cleft in the lip, and a ledge below it with a kestrels' nest and
  what they have carried there: a lost climber's pack. The falconer's hint: his birds bring back
  bright things from the ledge by the cleft.
- **New here.** The next area, seen from the last one's edge.
- **Finds.** The bandit camp's hoard holds a Long Bow +1, the best bow on the road.
- **Pay.** About 260 xp a member.

### 4.9 D4, Kestrel Edge (#72): country, band 4–5

- **Purpose.** The Downs' way out west: the Salt Road down the cliff into the Delta, where Act II
  begins.
- **Landmarks.** The road's hairpins, cut into the cliff; the cliff's foot, and the reeds of the
  Delta beyond the box's edge.
- **Points of interest,** about four features and three groups:
  - the top of the descent, and a sign: THE DELTA, SALTMOUTH;
  - a shrine at the top, where travellers leave a coin for the road (#45);
  - a waystation at the foot, a camp to rest at (#45);
  - a cairn on the seventh hairpin (#45).
- **Encounters.** Bandits and their archers on the road (two groups), crows on the cliff.
- **Quests.** None.
- **The secret and its hint.** A cave behind one hairpin, where runners coming up from Saltreach
  leave what they carry for the Downs. The cairn's hint: count seven bends.
- **New here.** The road into Act II.
- **Finds.** The runners' cave holds a Kite Shield +1.
- **Pay.** About 200 xp a member.

## 5. The one quest here

DESIGN §9 gives the Downs three steps, and none is built. The plan puts one in each of the core's
boxes, in the order the Salt Road reaches them:

- in Gullwick (F3), Wenna's mother, asking the company to find her;
- at Crowness Light (E3), the keeper who logged the night the Queen died: the Hearth went out eleven
  times, and he wrote down the gaps between;
- in the Berth, below D2, the barrow opened, and only the Queen's signet gone.

The Salt Road west, into Act II, starts here. The Foreland's chapter is The Quiet Farm (#42), and
every zone on the road holds at least one step of the quest (EXPANSION §5.8). The Downs are one
zone of seven boxes (§9), so the pilot's step at Gullwick is the zone's, and the other two come
with their boxes. STORY opens at Gullwick on the night the light went out, and the company reaches
Helmstow in the morning; a new game opens in Helmstow.

## 6. Side quests

#56 drafts eight for the Foreland, levels 1 to 4. The owner asked for the ones that fit to be pulled
into the build (27 September 2026), and all eight fit: each is set in the Foreland's own country at
its level, spends no story lock and turns on a person and a choice. Each is built where its places
are:

| # | Quest | Level | Where | What it needs | Built in |
|---|---|---|---|---|---|
| 1 | The Bell That Rang Twice | 1 | Helmstow: the Chapel, the Gilded Eel | a choice put by a person; a person who moves | #77 |
| 2 | Who Lived at Ashcombe | 1 | the Hearthlight Inn and Ashcombe; the tenant to Gullwick (F3) | hand-ins at the first meeting (#43); a person who moves | #77 |
| 3 | The Well That Tastes of Iron | 2 | Helmstow, and the works under the keep | the keep (#17); a choice put by a person | #77 |
| 4 | The Boat With No Name-Board | 2 | Gullwick and its wreckers' beach (F3) | `when` (#41); hand-ins at the first meeting (#43) | #47 |
| 5 | Oil for the Lamp | 3 | Crowness Light (E3); Mottram's Stores and Vask, in Helmstow | a choice put by a person | #67 |
| 6 | Riders in the Dark | 3 | Coldharbour (F2) and the ford (E2) | `when` (#41); a choice put by a person | #68 |
| 7 | The Clerk's Seal | 4 | the Gilded Eel and Brandy Hole | hand-ins at the first meeting (#43) | #77 |
| 8 | The Rest of the Survey Team | 4 | the Foreland map's south-west woods; the Chapel, or Thornhold | a choice put by a person; a person who moves | #77 |

Three changes to #56's drafts, for the owner:

- **The Boat With No Name-Board keeps to F3.** The hoard is on Gullwick's own wreckers' beach and
  the Compact's man waits on the road west, so that a level 2 quest is not finished in country
  banded 3–4.
- **Oil for the Lamp's chandler is Mottram,** whose stores are built, rather than a chandler of his
  own.
- **3 and 6 could be the Wardens' and 5 the Lanterns',** given from their halls (#21). They are
  built as plain quests unless #21 takes them.

A choice put by a person, words that change with a flag, a person who moves once a flag is set, a
person who takes more than one item and a letter to read from the pack are systems the game lacks
(#56, "What they ask of the systems"), built in #76. Every line these quests and the three steps put
on screen is written in the issue that builds them (#47, #67, #68, #70 and #77), and the Lodestone's
keeper's in #73, each in a Dialogue section measured against the game's box and log. The built
quests' words, Vask's, Hale's and the Gilded Eel's, were rewritten to the same bar in #85.

## 7. Encounters, and what is new

MONSTERS §5.2 has the Downs' roster and fights: the Carrion Crow, the Wrecker and the Lampman, the
Barrow Guard, the Black Dog and the Barrow Captain; crows over wolves in the stubble; a lampman and
four wreckers on the Salt Road on a foggy night; the Berth, the Downs' hardest place. Their drawings
are #46.

New in the Downs, for the novelty check (EXPANSION §5.4): the birds, a new family; hills and
farmland as terrain (#44); groups that walk only by night or in fog (`when`, #41); and dens, camps
that breed one kind of monster until a company beats their keepers and burns them (#88): a rookery
in E2, a wolves' den in D2 and a bandit camp in D3. §4.2 to §4.9 place every group, box by box.

## 8. The numbers

- **Experience.** One clear of the area pays 1,660 xp a member today, just past level 4 (1,650). The
  curve (EXPANSION §5.2, #31) gives an area the climb from its floor to the next area's floor,
  divided by 0.75: 2,800 / 0.75, about 3,730. The Downs are where the other 2,070 or so come from,
  shared among the boxes as §4.1 has it: F2 130, F3 110, E3 340, E2 190, D2 420, the Berth 420, D3
  260 and D4 200. Until they are built the curve reports the shortfall as owed to the pilot (#26). A
  den's keepers pay once, and its brood as a group that respawns does; the figures count the brood
  once.
- **Gold.** A clear pays about 2,530: 1,065 in chests, about 765 in drops and 700 in rewards.
  Training six members from 1 to 5 costs 1,500, so gold holds.
- **The gate.** The gate check (`tools/tests/gate.ts`, #38) reports the Foreland outside the
  starting thresholds, as the pilot's to settle (#47). The Rift Warden, the Smuggler Captain and the
  Deacon are won 98, 99 and 100% of the time at their maps' floors, where a boss should be won about
  half the time. The Seam is won 66% of the time two levels under its floor, where the gate wants a
  quarter. The area as one is won 88.6% of the time at level 1, against nine in ten. The Foreland
  map and Brandy Hole give 4.6 and 4.1 fights to a rest, against six or seven; the Seam 6.3, now
  that the company at 3 wears the band's gear. The pilot settles them, by retuning or by moving the
  thresholds.
- **Gear.** The ladder (#99) is what a company has in its hands by a level. Mottram's sells the
  band's gear: the Long Sword, the Hand Axe, the Long Bow, Scale Mail, Chain Mail and the Kite
  Shield. The Downs hold the kits with a plus and the band's gear with one, box by box as §4.2 to
  §4.9 have it, the named finds at the top; the Halberd is neither sold nor placed, the base of the
  guardsman's. Every class betters its kit by level 3 and again by level 5:

  | Class | By level 3 | By level 5 |
  |---|---|---|
  | Knight | Chain Mail, Kite Shield | the Captain's Sword +1, Kite Shield +1 |
  | Paladin | Long Sword, Chain Mail | a Queen's Long Sword +1, Kite Shield +1 |
  | Ranger | Long Bow, Chain Mail | Long Bow +1 |
  | Barbarian | Long Sword | Halberd +1, Leather Armour +1 |
  | Cleric | Mace +1 | Robe +1, Buckler +1 |
  | Sorcerer | Dagger +1 | Robe +1 |
  | Thief, Bard | Short Sword +1 | Leather Armour +1 |
  | Monk | Quarterstaff +1 | Robe +1, Spear +1 |
  | Druid | Quarterstaff +1 | Leather Armour +1, Spear +1 |

  The harness and the gate check dress their company from it (`GEAR`, `tools/harness.ts`), at 3 and
  at 5; `tools/tests/ladder.ts` walks it class by class, and owes each find to its box until a
  chest, cairn or statue gives it or a monster drops it.
- **Spells.** Tier 3 comes at level 4, inside the band (`spellTierAt`), and Helmstow's Lantern
  Guildhall sells to tier 2 (it sets no `maxTier`; `src/ui/screens.ts:410`). EXPANSION §4 has an
  area's towns sell its band's tier.

## 9. Decisions

Decided by the owner on 27 and 28 September 2026:

1. **The grid.** Every outdoor map is one box of the grid the built maps sit on (§1), so a map's
   place is its box, and whatever is not built is whole boxes. Borders become box edges as boxes
   are built, and the rim's row above the Downs is left unbuilt (§11).
2. **The pilot** (#47) is F2 and F3, the road west to Gullwick: F2 is the only box that meets the
   Foreland, and F3 holds the Downs' first step. Gullwick's box is two-thirds sea, so the two are
   about 1.3 maps of land, and between them they measure a country box and a core box, the two
   floors the pilot tunes (EXPANSION §5.3).
3. **Zones hold several maps.** The Downs are one zone of seven boxes, F2 and F3 from the pilot on;
   an atlas zone lists its maps (`AtlasZone.maps`; #66). A zone to a box would ask a step of the
   quest of every box the road crosses (EXPANSION §5.8), bare country included.
4. **Gullwick** is a village on F3: its houses, its boats and Wenna's mother as features, as the
   Ashcombe farm is on the Foreland map, and a camp to rest at (#45). No businesses, so no new
   interiors.
5. **The Berth** is a dungeon of its own: one level of 16 by 16, entered from D2 (#70).
6. **The Lodestone** is a stone to see, beside Helmstow on the Foreland map, with a Lantern who
   tells a new company what a Stone is, so that the cut Grove Stone reads as wrong when the company
   finds it (#73).
7. **The names** (§10).
8. **The side quests:** #56's eight for the Foreland are pulled into the build, each built where its
   places are (§6): with their boxes, or in #77, on the systems of #76.
9. **Ashcombe moves past Gullwick,** so that the first job is further and a bit harder (#85 and
   #87): into E3's north-east corner, across the Wend from Gullwick, with its cellar starting at
   level 2 and its Rift Warden held to the gate's rule for a boss there. The Foreland map keeps a
   farm where it stood, under a name of its own, with a small store in a farm kitchen (#97) that
   sells rations at its own price (#98): 3 gold, a quarter under Mottram's. #87 recuts the briefs
   when it is built; until then the Foreland map's keeps the farm, and E3's leaves the corner free.
10. **Dens** (#88): a camp that breeds one kind of monster until a company beats its keepers and
    burns it; its hoard is theirs, and it stands as a ruin after. The first three are a rookery in
    E2, a wolves' den in D2 and a bandit camp in D3.
11. **Gear.** A plus is +1 to hit and damage on a weapon and +1 armour class on armour (#100).
    Mottram's sells the band's gear, and in Act I pluses are found, not sold (#99 and #101). No
    find is dearer than its band's window on the curve (`src/content/progression.ts`), so the
    captain's mail is Scale Mail +1 and Thornmark has no plate with a plus. The ladder (§8): every
    class betters its kit by level 3 and again by level 5, from Mottram's and then the Downs' finds,
    the named ones at the top.
12. **The world map's lettering** is on the grid: the border names each box, and the strips at the
    world's edges go unlettered (§1; #66).

Proposed, for the owner, each in the issue that would build it:

- **The briefs** of §4.2 to §4.9: each box's landmarks, points of interest, encounters, secret and
  hint, share of the pay.
- **The core** is F3, E3 and D2, the boxes that hold a step of the quest; the other four are
  country (§4).
- **Tier 3** is sold by Helmstow's Lantern Guildhall (`maxTier: 3`), so that the band's tier is
  sold in the band (§8; #74).
- **Crowness Light** stands on the point, about 152,89, rather than inland at 140,88 (#67).
- **The Berth** goes on the atlas in D2, about 118,42, with a track up to it from Coldharbour across
  E2 (#68 and #69). #56's Riders in the Dark rides it.
- **The Wind Cave** (`src/content/atlas.ts:309`), Saltreach's cave in the face of Kestrel Edge,
  moves a square west into C3, so that D3 does not hold it (#71).
- **The chalk figure** below the Berth, a ship that only the Berth's mouth shows as one (§4.6).
- **The Queen on her bier,** her hand bare, as STORY has the tomb, where MONSTERS §5.2 has the bier
  empty (§4.7).
- **Three changes to #56's side quests** (§6).

## 10. Names

The area's naming pass, by the rules of `docs/NAMES.md`. Each name is the Foreland folk's, or one
of the old names the first crew left (marked *old*).

| Was | Now | What it means | Also thought of |
|---|---|---|---|
| the Shelf | the Foreland | the land in front of the mountains, facing the sea; *old*, faintly | |
| Harrow | Helmstow | *old*: "the helm's place", the Crown's seat in the old word for a crown | |
| | the Keep | the ward behind Helmstow's north gate, and the keep at its head; short, as the map's frame wants | the Keep's Ward |
| Harrow Downs | Callow Downs | the bare downs; and callow, like the companies that meet them first | Chaldon Downs |
| Harrow Bay | the Wyke | the bay, in the old word Gullwick's wick comes from | Mewstone Bay |
| Harrow Light | Crowness Light | the light on Crowness, the crows' headland; *old* | |
| the Harrow Stone | the Lodestone | the stone that shows the way; *old* | |
| the Ledge | Kestrel Edge | the edge the kestrels hunt along | the Bulwark, *old* |
| the Queen's barrow | the Berth | the barrow's name, older than the Crown's; *old* | |
| Warden Pass | the Scarth | the notch in the ridge | Thorngate |
| Captain's Farm | Coldharbour | a cold shelter: an old roadside name the farm kept | Ellerby |
| Gull Isle | the Mewstone | the gulls' rock | |
| Greywater, and its caves | Brandy Hole | where the cheap brandy came from | Kelp Hole |
| the Drowned Shrine | the Seam | the glowing seam the cult dug down to; *old*, faintly | the Undercliff |
| the Greywater Ledger | the Cargo Ledger | the smugglers' book, with its column headed CARGO BELOW | |
| Harrow Provisioner | Mottram's Stores | its keeper's name | |
| the river | the Wend | the winding one | |
| the copse | Brockholt | the badgers' wood | |
| the coast road | the Salt Road | the road down to Saltreach, where Act II begins and takes its name | |

**The old names,** read after Act IV: Helmstow is the helm, where the captain's line sat; Crowness
is the crow's nest, where the keeper watched and counted the eleven; the Berth is where a sailor
sleeps, and the Queens of the line lie there; a lodestone steers a ship and is a field's own stone,
as every Wardstone is; a seam is where two plates of a hull meet; and the fore is the front of a
ship. If that is too many for Act I, the Foreland and the Seam are the first to go plain.

**Kept:** Gullwick, which the story leans on (Wenna of Gullwick); Ashcombe and its cellar, whose
ash is the Ashen Hand's first hiding place; the Hearthlight Inn, the Gilded Eel, the Chapel of the
Lanterns and the Warden Drillyard; and the Lantern Guildhall, whose name is also its members' flag
(docs/NAMES.md §3). The people keep theirs: Vask, Hale, Wenna, Isaure.

**On the map:** the area, its zones and every place above that the atlas letters take their new
names; Kestrel Edge is lettered beside its cliff, as the Scarp and the Sheer are, and the Wend is
named in the atlas.

## 11. What was cut

- **The rim's foothills,** C1 to G1: 1,622 squares, nearly all of them mountain, and 414 a company
  could walk. The maps of row 2 end in the rim (§9).
- **The scraps** of the Foreland's land in boxes that are other areas' or the sea's: the Downs'
  cliff top in C2 and C3 (272 squares, 221 of them walkable), which goes with Saltreach's boxes,
  and a few squares of shore in E4, G3 and G4.
