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
| Callow Downs | 2–5 | 6,569 | F2, F3, E3, E2, D2, D3 and D4, laid at 168,30, 168,62, 136,62, 136,30, 104,30, 104,62 and 104,94 |
| The area | 1–5 | 8,865 | a quarter |

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
- **West: Kestrel Edge,** a cliff from the rim to Sylmeer, the Salt Gulf that was, above Saltreach's Upper Water
  (10–12). The area's border keeps to the cliff's lip except at its two ends. In the rim it drops
  straight down through the mountains at x 94, a few squares east of the cliff, where there is
  nothing to follow. At the south end it leaves the cliff and takes a strip of low ground at the
  cliff's foot, about eight squares wide (x 109–120, y 99–121), so the road down Kestrel Edge
  (`src/content/atlas.ts:364`) ends on the Downs and not in the Delta. Once D3 and D4 are built the
  border there is their edges: the cliff runs through both boxes, and D4 holds the road's last
  squares down it.
- **South-west: the Salt Road down Kestrel Edge** into the Delta (10–12), open from the start: one
  road, lightly held (EXPANSION §2.2).

Between the two zones the area map (M, then Tab) draws a dotted line. With F2 built it is the
Foreland map's west edge: a built zone starts its walk from its whole map, so the Foreland zone is
its map and no more. The Foreland's ring stands there against F2, with the Salt Road through a gap
at 0,29, on the sand beside Brandy Hole's mouth.

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
| Helmstow | town, 16×16 | 1–4 | the Hearthlight Inn, the Chapel of the Lanterns, Mottram's Stores, the Lantern Guildhall (spells to tier 2; the Lanterns' hall), the Warden Drillyard (training to 6; the Wardens' hall), the Gilded Eel and its four rumours, the gatehouse north into the keep's ward; Osmund the sexton in the Chapel, Ebba at the Eel (or in the Chapel once her name is kept) and, while the bell is asked after, a fisherman at the Eel and a Warden on the wall by the Chapel; Maud at the Eel until her husband's seal is found and given; Mottram in his stores, with Lantern Oil on his shelf and the keeper's oil to put, and, by night, a cart (`well_cart`) and Alwin, a Warden mason, at the north gatehouse until the Wardens are told, then the gatehouse swept (`well_swept`); Hob by the Hearthlight's fire until his paper is given, and his empty chair (`hob_chair`) once it went to Vask; the harbour postern in the south wall by the Eel; after Act II, the changed city (§5.1); in both cities, Mottram teaching the Paladin's first prestige and Aldith the luthier under the Hearthlight's eaves the Bard's (#19) |
| The Keep | town, 16×10 | 1–4 | the keep's ward behind Helmstow's north gatehouse, grey stone and the Queen's blue and gold: the Regent's proclamation, petitioners on the steps, the chapel where the Queen lay in state and a mourner, the rookery keeper, the garden well; Vask, who takes Hob's paper too, and his contract in the throne room behind the keep's door, and the keeper's oil to put to him; Wulfric, the keep's armourer, at his bench before the shut armoury, teaching the Knight's first prestige (#19) |
| The Foreland | outdoor zone, 32×32 | 1–5 | the road, woods, marsh and beach; the Lodestone and Gytha; the Ellerby farm where Ashcombe stood, and its store (rations at 3 gold, in the farm kitchen); Hale's checkpoint at the Scarth, where he takes Dunstan's letter, until he is taken from it and two strangers in Warden grey hold it (#156); ten groups; behind the west wood, Ailith's fire-ring (`survey_ring`) and Ailith, until the company sends her on |
| Ashcombe Cellar | dungeon, 16×16 | 2–4 | under Ashcombe in E3; four rings; the dead Lantern and her survey wand; the Rift and its Warden |
| Brandy Hole | dungeon, 16×16 | 2–4 | smugglers, crabs and the drowned; the captain's den and the iron key; a clerk's coat among the drowned (`gw1_coat`) and his seal in the den's strongbox (`gw1_strongbox`, `gw1_seal`) |
| The Seam | dungeon, 16×16 | 3–5 | the Ashen cult's galleries; the Ashen Deacon and the Cargo Ledger |
| Callow Downs, F2 | outdoor zone, 32×32 | 2–3 | the Salt Road west; Coldharbour and Captain Dunstan, retired (Riders in the Dark); Brockholt and its woodcutter's camp; a shrine, a cairn and a milestone; Siward, Dunstan's old standard-bearer, in Coldharbour's east field, teaching the Knight's second prestige (#19); six groups (§4.2) |
| Callow Downs, F3 | outdoor zone, 32×32 | 2–3 | Gullwick at the Wend's mouth, its net loft and boats; the rise; the wreckers' far beach and their cave; three groups (§4.3); Hob on the shingle by the net loft once Hale has sent him |
| Callow Downs, E3 | outdoor zone, 32×32 | 3–4 | Crowness Light and the keeper's cottage on the point; the Salt Road west in fog; the gibbet; the wreck and the wreckers' niche below the light; Aldred, the keeper, his log and the lamp room; eight groups (§4.4); in the north-east corner, Ashcombe: the farmhouse over the cellar, its gate (`ashcombe_gate`) and rats (`farm_rats`) and at its back the kitchen (`ash_kitchen`, the hearth-key in `ash_hearth`) and the flour crock (`ash_crock`, the tenant's paper in `ash_crock_c`) |
| Callow Downs, E2 | outdoor zone, 32×32 | 3–4 | the Wend's fields and its ford on the track from Coldharbour west to the Berth, where the riders come back by night once Dunstan has asked; the drowned mill and its wheel-pit; the rookery in the willows, the first den; a boundary stone with a riddle, a spring, a cairn and a shepherd's camp; five groups (§4.5) |
| Callow Downs, D2 | outdoor zone, 32×32 | 4–5 | the chalk hills and the Berth open on the crest where the track from E2 ends; the ridge's barrows, one of them hollow; the shepherd's hut, the dew pond, a shrine, a cairn and a camp; the Cradle cut in the chalk; the wolves' den in the old chalk pit; the Black Dog by night; seven groups (§4.6) |
| Callow Downs, D3 | outdoor zone, 32×32 | 4–5 | the west downs to the lip of Kestrel Edge; a falconer, the lip over the Upper Water and the cleft with a kestrels' ledge; the bandit camp by the Salt Road, a den; a shrine, a cairn and a shepherd's hollow; seven groups (§4.8) |
| Callow Downs, D4 | outdoor zone, 32×32 | 4–5 | Kestrel Edge: the Salt Road over the top, down the cliff in seven bends and across the low ground at its foot to the Delta; the runners' cave behind a bend; a shrine, a cairn and the waystation; four groups (§4.9) |
| The Berth | dungeon, 16×16 | 4–5 | the Queen's barrow under D2, opened: the forecourt, the passage and four side chambers of the old Queens, their grave goods untouched; the Queen on her bier, her signet cut away; her guard two by two and her captain, the boss; his arms in a niche behind the bier (§4.7) |

Its chapter of the one quest is The Quiet Farm (Vask, `chapter.ts`) and its side quests The Cargo
Ledger (Hale), The Bell That Rang Twice (Osmund), The Rest of the Survey (Ebba and Ailith), The
Clerk's Seal (Maud), The Well Tastes of Iron (Mottram), A Boat With No Name-Board (Wat and Hamo),
Who Lived at Ashcombe (Hob), Oil for the Lamp (Aldred, Mottram and Vask) and Riders in the Dark
(Dunstan; `quests.ts`); the monsters are MONSTERS §5.1's. Each secret door has a hint on its near
side: the cellar's (mill 4,7) a cold draught at 4,6 (`mill_draught`), Brandy Hole's (greywater1
10,11) drag marks at 9,11 (`gw1_drag`), the Seam's the carving over a blank stretch of wall;
Brockholt's (downs_f2 12,3) the bare ground under the holly at 12,4 (`f2_holly`), beside the
woodcutter's word; and the wreckers' cave's (downs_f3 1,16) the soot where the far beach ends at
0,15 (`f3_soot`), beside the shanty's last verse; the wreckers' niche below Crowness Light (downs_e3
19,29), the soot on the ledge beside it at 18,29 (`e3_ledge`); and the wheel-pit's (downs_e2 22,26)
the course of dry stone below the mill at 22,27 (`e2_wheel`), beside the shepherd's word; the hollow
barrow's (downs_d2 20,4) the ringing turf at 20,5 (`d2_ring`), beside the other shepherd's word; and
the kestrels' ledge's (downs_d3 3,18) the cleft in the lip at 4,18 (`d3_cleft`), beside the
falconer's word; and the runners' cave's (downs_d4 20,13) the rock worn smooth between the bends at
19,13 (`d4_worn`); and the captain's niche in the Berth (berth 2,7) the words cut in the forecourt
at 13,6 (`berth_hint`).

In more detail, as SLICE.md had it before the area docs:

- **Helmstow** (town, 16×16): inn (rest, rations), temple (cure and raise, priced by level), shop
  (buy and sell), Lantern Guildhall (join, then buy tier-2 spells), Warden Drillyard (train a level
  when the xp allows; levels are bought, not automatic), the Gilded Eel tavern (rumours), a well, a
  sign and the gatehouse in the north wall.
- **The Keep** (town, 16×10): the keep's ward behind the gatehouse, with a palette of its own and
  the Queen's banners placed (`banners`); Lord Vask on the keep's door, holding court in the throne
  room (the contract and the hand-in); people and a well. A building on its west side stands shut,
  the Queen's armoury; Wulfric, its armourer, works at a bench before it and teaches the Knight's
  first prestige (#19). Its door and shop wait on an interior.
- **The Foreland** (outdoor zone, 32×32): road, woods, hills, marsh, the coast, ten roaming or
  lurking monster groups with respawn timers, the Ellerby farm, lived in, where Ashcombe stood until
  it moved past Gullwick (#87), with a store in its kitchen that sells rations at 3 gold. The
  Lodestone, the Foreland's own Stone and whole, stands at the end of a track east of the south gate
  (the stone said at 20,4), and Gytha, its Lantern, sits at its foot (21,4): she gives a new company
  the lesson (`q_lodestone`), and her words change once Sylvane has spoken (`q_grove`) and again
  once she has the chisel (`q_grove_done`). The stone is its words and is not drawn, as the Grove
  Stone is. It and Thornmark are played as one outdoors ([SLICE.md](../SLICE.md), "The outdoors as
  one map").
- **Ashcombe Cellar** (dungeon, 16×16, band 2–4), under the farmhouse in E3's north-east corner
  (#87): four rings, an iron key, a locked door, a secret door, the dead Lantern and her survey
  wand, the Rift and its Warden.
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
play there. It walks the prestiges' four trainers too: where each stands in both cities, the
firsts taught at 11 and again at 16 after Act II, and the Knight's second at 19. The other
end-to-end tests (the pass, the stairs) cross into Thornmark, so they stay in
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
guard two by two down the passage, and her captain at the bier (MONSTERS §5.2). Its step is
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
| Crowness Light | E3 | the keeper who counted the eleven and wrote down the gaps (DESIGN §9, STORY); the Cleric's second prestige (#19); shore crabs under it | charted on E3 at the point, 156,90 (#67) |
| Coldharbour | F2 | a retired Warden captain's farm; the Knight's second prestige (#19) | a planned farm at 176,42 |
| The Berth | a dungeon, entered from D2 | the Queen's barrow, opened, and only her signet gone (DESIGN §9); band 4–5, her guard two by two down the passage and her captain at the bier (MONSTERS §5.2) | a ruin on D2 at 114.5,42.5, and its plate at 108,54 |
| The Salt Road | F2, F3, E3, a corner of D3, and D4 | the wreckers and their lampman in fog; crows at the gibbet (MONSTERS §5.2) | a road through F2, F3, E3, D3's corner and down the Edge in D4 |
| The Lodestone | G2, the built map (21.5,4) | "already intact; tutorial" (DESIGN §4) | built (#73): the stone's words, Gytha and the track from the gate road |
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
- **Quests.** No step of the one quest (§9). Riders in the Dark is the captain's (§6). The Knight's
  second prestige is taught in the east field by Siward (#19; §9, 34).
- **The secret and its hint.** Under the holly at Brockholt's heart one sett runs deeper than
  badgers dig: a smugglers' cache from before Brandy Hole was cleared, brandy and a crate with the
  customs seal. The woodcutter's rumour is the hint: the badgers never go near the holly.
- **New here.** Farmland and hills underfoot (#44), the wilderness features (#45), the Carrion Crow
  (#46).
- **Finds.** Brockholt's cache holds a Short Sword +1 and a Dagger +1.
- **Pay.** About 130 xp a member.
- **As built** (`maps/downs_f2.ts`, cut by `tools/scaffold.ts downs 168 30`):
  - The Salt Road comes off the Foreland's beach through a gap at its 0,29, a square south of Brandy
    Hole's mouth so the road does not walk a company into the caves, and leaves by the south edge at
    15–17 into F3. The rim is F2's north edge; the west is open land that ends in the void until E2
    is built.
  - Siward in the east field at 19,16, under the two oaks, off the farm's track (#19).
  - Coldharbour at 5–11,9–13: the farmhouse and the barn about a yard, the lamp (an event), the
    well, the rats in the barn and a track down to the road; a square by the gate is left for the
    captain (#68). The shrine stands where the track meets the road, the milestone by the gap.
  - Brockholt: a woodcutter's path in from the east to his camp, then on to the beeches at its
    heart and the holly; the sett is a secret door under it, the cache two squares behind. A glade
    on its west side for the boar. A scarecrow in the south-west fields and a view back over the
    Foreland from the north-east rise make up the country's floor.
  - The brief's groups, of the Downs' own monsters (§7): six crows, three Chalk Wolves, a Tusker,
    five Barn Rats, two Footpads and a Poacher. At level 2 the company wins every fight and
    manages 6.4 fights to a rest; with the Foreland's own wolves, boar, rats and bandits the same
    lines gave 19.6. They pay about 142 xp a member.
  - Density: 94% of its 777 squares within 12 steps of something, the furthest 15.
  - Time: about three session-hours to author and check, the rework to the owner's harder
    monsters included; waiting on the hills and outdoor doors (#142, #141) and the owner's rounds
    came on top.

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
- **Quests.** The step. A Boat With No Name-Board starts and ends here, and Who Lived at
  Ashcombe's tenant starts over here if Hale sends him (§6).
- **The secret and its hint.** A cave in the rock at the far end of the wreckers' beach, where they
  keep the boat they were expecting. The shanty's last verse is the hint: where the lamp goes out,
  the cave goes in.
- **New here.** Groups that walk by night (`when`, #41), and a village drawn on its box.
- **Finds.** The wreckers' cave holds a Mace +1 and a Quarterstaff +1.
- **Pay.** About 110 xp a member.
- **As built** (`maps/downs_f3.ts`, cut by `tools/scaffold.ts downs 168 62`):
  - The Salt Road comes down from F2 at 15–17 and leaves west at 0,10–11 for Crowness; the Wend
    comes in at 0,3–4, passes under the road's bridge at 1,10 and meets the sea at 5,15. Both meet
    the atlas at the west edge, where the raw cut did not.
  - Gullwick east of the mouth: seven cottages, the net loft (the camp), the well, the boats on the
    shingle and the old man with the shanty; the rise above it, on the hills. On the shingle, Hild at
    the tideline (the step, §5) and Wat on his upturned hull; Hamo beside the road west of the bridge,
    off the way from the far beach to Wat, so boards carried home are never sold by stepping on him.
  - The far beach, west of the mouth, is reached from Gullwick by the bridge, and with E3 laid round
    by its ford too, a longer way (42 steps from the hoard to Wat against 20) that never steps on
    Hamo: the wreckers by night, the soot at its end and the cave behind a secret door in the rock
    at 1,16.
  - The brief's groups: six crows in the fields, three crabs on the north-east sand, two wreckers and
    their lampman by night, the wrecker and the lampman statted on MONSTERS §4.4's line at level 4
    (soldier and archer) to hold the day: 7.0 fights to a rest at level 2, every fight won. They pay
    about 85 xp a member, against the brief's 110.
  - A Boat With No Name-Board (§6): the hoard in the rocks at the far beach's north end, the chit
    beside the boards and the night's footprints on the one way onto the beach, at 0,12. Wat pays
    60 from the loft jar and Hamo 140 by the plank; the curve counts the larger once.
  - Density: every one of its 289 squares within 8 steps, the furthest 8, with the people in.

### 4.4 E3, Crowness (#67): core, band 3–4

- **Purpose.** The Downs' second step and their fight in fog: the light that kept the count, on a
  coast where wreckers wait for the dark.
- **Landmarks.** Crowness Light on the point, about 152,89, with the keeper's cottage under it. The
  Salt Road along the coast to the corner of D3. A gibbet at the roadside above the rocks. The last
  of the stubble to the north, and the Wend's last bend in the north-east corner. In that corner,
  across the Wend from Gullwick, Ashcombe, which #87 moved there.
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
- **As built** (`maps/downs_e3.ts`, cut by `tools/scaffold.ts downs 136 62`):
  - The Salt Road comes in from Gullwick at 31,10–11 and runs south-west as cut to the west edge at
    0,30. Its corner into D3 steps diagonally on the atlas, which no edge square can meet: 0,30 and
    0,31 are owed to #71. The Wend's last bend crosses the north-east corner, with a ford at 30,2 so
    its far bank is walked; 29,0 is dry, to meet the atlas's farm beyond.
  - Crowness Light on a headland built out from the point: the tower at 20,28 (156,90) and the
    keeper's cottage at 16,27, both buildings; a track from the fork at 13,23, with the finger-post
    and the shrine; the cairn on the point, the keeper's well and a camp in the lee of the point at
    12,27. At the tower's foot, Aldred the keeper (18,28), the lamp room at the stair's head (19,28),
    dark or lit, and his log on the cottage table, a chest of its own (`e3_log`, 16,28).
  - The gibbet above the rocks at 25,15; the wreck on the rocks under the light at 21,29, its
    salvage (`e3_salvage`, the Buckler +1) at 21,30. A dew pond, a shepherd's fold and a first
    sight of the light from the edge of the stubble fill the downs.
  - The secret: the wreckers' niche, a secret door in the rock at 19,29, with rock beside it at
    20,29 so the door draws as rock, its lamp and chart as words and a small chest behind at 19,30.
    The hint is the soot on the ledge beside it at 18,29 (`e3_ledge`); the keeper's second light is
    the hint in words.
  - The seam with F3: rock at 31,12–15 keeps F3's far beach closed along its edge, and rock at
    31,5–9 keeps every way from E3 to Gullwick off Hamo's square at F3's 0,9, and off the strip of
    field above it.
  - Ashcombe in the corner (#87), off the Salt Road by a track from 28,11 up to its gate at 20,4:
    the farmhouse at 22–25,3–5 with the cellar's door at 21,4, its yard behind and the Foreland's
    ids kept (the outdoors is one map): the gate (`ashcombe_gate`), five rats (`farm_rats`) at
    19,4, the kitchen at the back notch (25,4) and the flour crock (26,3) with their chests. The
    ford (`e3_ford`) stays. With the farm, 96.9% of 836 squares are within 8 steps, the furthest 10.
  - The groups, eight, the harder monsters (#272) at 4: eight crows at the gibbet, nearest the way
    in; a lampman and four wreckers on the road in fog (`when: { sky: 'fog' }`), the lampman first
    so his lamp is the first thing seen; two wreckers and a lampman by night on the rocks of the
    little point (25,20) and again in the bay (12,29); four Barnacle Crabs under the light; two
    Billmen and a Slinger on the road west; three Chalk Wolves on the hills and a Tusker by the
    copse in the north-west. At level 3 the company wins 99.3% of fights and manages 7.28 fights to
    a rest. Two under, the Foreland's pool is E3's groups alone: 72.2% won, off its aim of 25% and
    inside its limit of 90%, and listed. They pay about 365 xp a member, against the brief's 340.
  - Density: 95.3% of its 847 squares within 8 steps, the furthest 11; 23 points, one a sign.
  - Time: about three session-hours to author and check.
  - The keeper's step and Oil for the Lamp (#67's second part) are §5's and §6's.

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
- **As built** (#68). The Wend comes off the rim at 15,1 and leaves for E3 at 28–29,31; it is
  wadeable nowhere, so the ford (19,12) on the track, a road from Coldharbour's yard in F2 west to
  the box's edge at 0,12, is the one way to the west bank, and the atlas carries the track on to the
  Berth as a trail. The stone (10,17) is answered "ten"; the spring (18,3); the cairn (3,26); the
  shepherd's camp (5,29). The mill stands beside the river at 21–22,22–23, the willows round it and
  the rookery (19,20) among them; the wheel-pit (22,25) behind a door in the rock at 22,26. The
  groups: crows over wolves twice as the rookery's brood (six Carrion Crows and two Chalk Wolves,
  27,8 and 25,17), back one a day until it burns; its keepers two Old Rooks (19,21), elites at 4;
  three Chalk Wolves under the western hills (6,9); a Tusker in the willows (18,24). At its floor,
  3, every fight is won and a day is 6.28 fights to a rest; a clear pays about 210 xp a member, the
  brood counted once. The hoards: 40 gold, Robe +1 and Leather Armour +1 in the pit; 30 gold and the
  Silver Locket in the rookery.
- **Riders in the Dark, as built** (#68). Dunstan stands in Coldharbour's yard (downs_f2 10,11) and
  sets `q_riders`. Once he has asked, the riders cross the ford by night (`e2_riders`, once, on the
  day event's square). Told of it, he puts the choice: his letter (`dunstan_letter`,
  `q_riders_letter`) goes to Hale, who takes it at the first meeting and pays nothing
  (`q_riders_hale`), or he keeps it (`q_riders_kept`). The words are the issue's.

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
- **As built** (#69). The track from E2's ford comes in at 31,12 and ends on the crest at the
  Berth's mouth (12–13,12), a long barrow of rock at 7–13,10–14 with its forecourt open; the grooves
  where the stones were dragged clear at 15,13; the sign where the track tops the ridge (22,11). The
  dungeon's door is #70's, on the forecourt. Eight small barrows along the ridge, the hollow one at
  20,3 behind a door at 20,4, hinted at 20,5 (`d2_ring`) and by the shepherd at his hut (3–4,17).
  The dew pond (20–21,17–18), a shrine on the crest (8,2), a cairn on the highest barrow (27,3), a
  camp in the lee (17,27) and the Cradle, cut in the chalk below the ridge at 10–20,18–22 and said
  at 15,23. The chalk pit at 3–8,4–8 holds the den (5,6). The groups: six Carrion Crows by the way
  in (27,15); a Barrow Wolf and two Chalk Wolves three times, the den's brood (24,6, 25,23 and
  8,26); the pack, two Barrow Wolves, beside the den (6,6); the Black Dog by night, one on the track
  (17,10) and two behind the barrow (11,16). The cist holds 60 gold, the Halberd +1 and the Ring of
  Office; the den's hoard 45 gold and the Spear +1. The Berth is on the atlas as a site (a ruin:
  Thornmark claims the barrow's icon), its place with #70's dungeon.
- **The gate.** D2's floor is 4, over the Downs' monsters, so its harder ones are at 5 on MONSTERS
  §4.4's line: the Barrow Wolf, an elite on the wolf frame in the chalk wolf's coat (#313), and the
  Black Dog, an elite at 5. At 4 every fight is won and a day is 7.80 fights to a rest, off the aim
  and inside the limit; a clear pays about 390 xp a member, the brood counted once.

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
- **The bier.** MONSTERS §5.2 put the captain beside an empty bier; STORY has the tomb robbed of
  the ring alone, "not the gold, not the jewels". The brief follows STORY, and MONSTERS now does too
  (#70).
- **Finds.** The niche behind the bier holds the captain's arms, the Captain's Sword +1 and the
  Captain's Mail +1 (a Long Sword and Scale Mail); the first side chamber a Queen's Long Sword +1.
- **Pay.** About 420 xp a member.
- **As built** (#70). The way in is the open forecourt's west square on D2 (12,12), under the
  barrow's lintel, past the mouth's event (13,12), which takes the owner's words; the way out lands
  there too. Inside, the forecourt (13–14,6–8) and its sign, the hint (13,6); the passage west
  along row 7, cut square, said at 12,7; four side chambers, the youngest Queen's north at 10–12,2–4 and the oldest's south
  at 6–8,10–12, each with its words and its chest; the bier chamber (3–4,5–9), the step said at
  4,7; and behind it a secret door (2,7) to the captain's niche (1,6–8), his arms in its chest. The
  guard stands in pairs at 11, 9, 7 and 5 on row 7, holding their ground, and the captain at 3,7.
  None of them respawns. The first chamber's chest holds 70 gold and the Queen's Long Sword +1; the
  second's 90 gold and two healing potions; the third's 60 gold and a spell potion; the fourth's a
  healing potion and an antidote; the niche's the Captain's Sword +1 and the Captain's Mail +1.
  The plate is at 108,54 on the world map, below the mouth.
- **The numbers** (#70). As drawn, the guard (20 hit points, 5.5 a hit) and the captain (60, 9)
  were soft for a company of 4: thirty fights to a rest, and the captain won every time. The guard
  now weighs an elite in an armoured shape, since two are one standard encounter (50 hit points,
  armour 16, 2d8+3, slow; 173 xp), and the captain is 220 hit points, armour 16 and 3d8+8 (1,140
  xp), so the Berth pays 420 a member. At 4, its guard is won every time and 7.12 fights to a rest,
  the captain 45% of the time, and always at 6; the map at its floor is 89% won, the captain
  counted, off the aim and inside the limit. Two under, at 2, a pair is won 79% of the time and the
  captain never; as a dungeon the Berth counts there under the area's floor, where no company is.

### 4.8 D3, the west downs (#71): country, band 4–5

- **Purpose.** The open downs to the lip of Kestrel Edge, and the first sight of Act II: the Upper
  Water below.
- **Landmarks.** The lip of the cliff, with the Upper Water under it and Rietum's smoke far off;
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
- **As built** (`maps/downs_d3.ts`, cut from the atlas at 104,62):
  - The scaffold refuses the cut: no map character is the atlas's cliff (44 squares). The draft was
    cut with the cliff written as mountain, and the Upper Water's 69 squares below it (8 of them the
    atlas's cliff), Saltreach's, as void (`%`), the world's end there until Saltreach is built. Six
    squares of the Downs at the cliff's foot, cut off from the rest, are rock.
  - The Salt Road comes in from E3's 0,30 at 31,30 and leaves by the south edge at 29–30,31, as the
    atlas has it; E3's two squares owed to this box are settled, since two built maps are not held
    to the atlas along their seam. The finger-post (bare words, SALTMOUTH, DOWN THE EDGE) and the
    shrine stand beside it.
  - The bandit camp by the road, a den (#88): the hut of stolen planks at 21–22,25, the den at 21,26,
    two Cutthroats its keepers beside it, and its brood two groups of three Billmen and a Slinger
    on the road, back one a pace while it stands. Burnt, its hoard gives 60 gold and the Long Bow +1.
  - The lip: the lookout over the Upper Water (`d3_lip`), the falconer at 5,21, and the cleft in the
    lip (`d3_cleft`, the hint) beside a secret door in the cliff at 3,18, mountain either side, with
    the kestrels' ledge behind at 2,18: the climber's pack, an Elixir and a Blue Vial.
  - The downs: the cairn on the chalk's last height, a shepherd's hollow (the camp), a long barrow, a
    dry dew pond and the gorse to the lip.
  - The groups, seven: eight Carrion Crows over the camp, nearest the way in; the brood; the
    keepers, two Cutthroats (one standard encounter of elites), the harder monster, new here (the
    elite's line at 5); two packs of four Chalk Wolves; a Tusker in the north-west. The bandits and
    wolves are standard encounters, four to a group (MONSTERS §4.4), not swarms: in threes the
    company at 4 manages 12 fights to a rest. At 4 it wins every fight and manages 7.98 fights to a
    rest, off the aim of 5.5 to 7.5 and inside the limit of 10. They pay about 347 xp a member,
    against the brief's 260, the brood counted once.
  - The crows are over the camp, not along the lip: at level 2 they must be nearest the way in for
    the levels to rise from it. Kestrels keep the lip, and are not monsters.
  - Density: 99.7% of its 912 squares within 12 steps, the furthest 14.

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
- **As built** (`maps/downs_d4.ts`, cut from the atlas at 104,94 as D3 was, the cliff written as
  mountain):
  - The Salt Road comes in from D3 at 29–30,0, crosses the plateau to the top of the Edge and goes
    down the cliff in seven bends (x 12–20, rows 10–16), cut through the cliff widened there, then
    across the low ground at its foot and out by the south-west corner at 1,31, as the atlas has it.
    The atlas's road steps diagonally off that corner, so 0,31 and 1,31 are owed to #170, whose C5
    carries the road over D5's corner. The atlas's cliff stops three squares short of the gulf; it is
    carried on to the water (19–20,18–20), and mountain at 21–22,20 closes the way round by the
    shallows, so the bends are the one way down.
  - At the top, the sign (bare words, THE DELTA, SALTMOUTH.), the shrine and the first sight of the
    Delta (`d4_top`); gulls in the updraught on the plateau.
  - The secret: the runners' cave, a secret door in the rock at 20,13 beside the fourth bend,
    mountain either side, with the Kite Shield +1 in it; the cave and the rock round it (21–22,12–14)
    are cut from the plateau's grass outside the bends. The hint is the rock worn smooth between
    the bends at 19,13 (`d4_worn`). The cairn stands on the seventh bend.
  - At the foot, the waystation (the camp), a mule's bones under the cliff and the reeds of the
    Delta by the south edge.
  - The groups, four: eight Carrion Crows at the top, nearest the way in; two groups of three
    Billmen and a Slinger, one on the bends and one at the foot; two Cutthroats, one standard
    encounter of elites, on the road by the Delta, the hardest and the furthest. At 4 the company
    wins every fight and manages 7.52 fights to a rest, just off the aim of 5.5 to 7.5 and inside
    the limit of 10. They pay about 203 xp a member, against the brief's 200.
  - Density: 96.7% of its 667 squares within 12 steps, the furthest 18.

## 5. The one quest here

DESIGN §9 gives the Downs three steps, and the first is built. The plan puts one in each of the
core's boxes, in the order the Salt Road reaches them:

- in Gullwick (F3), Wenna's mother, Hild, asking the company to find her: built (#47), a step of The
  Quiet Farm between Vask's hire and the farm, which is past Gullwick in E3's corner (#87), and the
  chapter done on both the wand and her word (`done`: `q_ashcombe_done` and `q_wenna`), as the owner
  agreed on 28 September 2026. A company that did the farm first is sent to her by the chapter's
  first goal;
- at Crowness Light (E3), the keeper who logged the night the Queen died: the Hearth went out eleven
  times, and he wrote down the gaps between. Built (#67): Aldred at the foot of the tower stair, and
  his log on the cottage table, a letter read from the pack. The step comes after the farm and its
  cellar and before the wand goes to Vask (#87): the road reaches the farm first, in the corner it
  enters E3 by, and the point after it. The chapter is done on the log read as well (`seen`:
  `downs_e3:e3_log`). The wand in hand, the goal is Crowness before Helmstow; a company that took
  the wand straight back is sent to Gullwick if it has not been, and then to the keeper;
- in the Berth, below D2, the barrow opened, and only the Queen's signet gone.

The Salt Road west, into Act II, starts here. The Foreland's chapter is The Quiet Farm (#42), and
every zone on the road holds at least one step of the quest (EXPANSION §5.8). The Downs are one
zone of seven boxes (§9), so the pilot's step at Gullwick is the zone's, and the other two come
with their boxes. STORY opens at Gullwick on the night the light went out, and the company reaches
Helmstow in the morning; a new game opens in Helmstow.

### 5.1 Helmstow between acts

DESIGN §9: Helmstow changes between acts, under Vask's hand, and never for the better. After Act II
(`q_salt_done`, set by Vask's answer at Lantern Watch's gate) the company comes home to the changed
city, built in #157; a company that has not finished the act finds the old one. Either can enter,
and nothing is a story lock (#151, call 1):

- **The gate.** A company with an orcblood member is turned back at the south gate by a sergeant:
  "No orcblood past the gate. Regent's orders." The Foreland's exit into the town is `shut` on the
  flag and the race (`member.race`), read at every step, so it opens again without him. A company
  with no orcblood member walks in as before, and leaving by the gate is never shut.
- **The harbour postern,** in the south wall by the Gilded Eel (harrow 13,15, out to the track to
  the Lodestone at 18,4), is open in both cities: the fish carts' door down to the boats, and the
  way in for a company the gate turns back. A chalked sign over it inside.
- **Wardens on the walls:** a once-event on the first step inside the gate (7,13 or 8,13), and
  another inside the postern (12,14 or 14,14). No fights.
- **The curfew bell,** by night, every time the company crosses the middle street at 7,6 or 8,6.
- **The Chapel shut:** the temple, and with it cure and raise, is gone; a notice is said on its
  door once, with the chalked word that the sexton went to the Watch with his book, and the door
  hangs no sign. Osmund, Ebba and the bell's two witnesses are gone. An unanswered Bell That Rang
  Twice sends the company back to the Chapel and ends at the notice. Ailith, met in the wood after
  the act, has heard: she asks between Lantern Watch and Thornhold, not the Chapel.
- **The Drillyard** stays, and so do its trainer and its quests. Captain Ordgar, who backs the
  Queen's cousin, sits in it and says the walls are Vask's (#151, call 5). The quests are still
  given by the Drillyard's own hall: a guild's quests come from a business that is its hall, and
  their offer is one text, so a person cannot give them, and the first task's still names the
  drillmaster. Every company of Act II has had it.
- **Prices rise:** the Hearthlight at 18 a night for 12, and Mottram's half as much again, but the
  Lantern Oil, whose forty he names in Oil for the Lamp. The Lantern Guildhall and the trainer
  keep theirs.
- **The Gilded Eel's** talk is the curfew's, the Chapel's and the captains'.
- **The Keep** is unchanged.
- **The trainers stay** (#19): Mottram and Aldith in the city, Wulfric in the keep.
- **No lock:** the lock scan finds the gate shut and passes it on the postern beside it, and finds
  each business gone and passes it on its twin or, for the Chapel, on the temples of Thornhold and
  Saltmouth.

The Foreland's walkthrough walks both cities: the old one, then the changed one to the default
company, whose paladin Idris is orcblood, and to one without him. The flag is set by hand, since
the road's band refuses Helmstow to a company of 16.

## 6. Side quests

#56 drafts eight for the Foreland, levels 1 to 4. The owner asked for the ones that fit to be pulled
into the build (27 September 2026), and all eight fit: each is set in the Foreland's own country at
its level, spends no story lock and turns on a person and a choice. Each is built where its places
are:

| # | Quest | Level | Where | What it needs | Built in |
|---|---|---|---|---|---|
| 1 | The Bell That Rang Twice | 1 | Helmstow: the Chapel, the Gilded Eel | a choice put by a person; a person who moves | #77 (built) |
| 2 | Who Lived at Ashcombe | 1 | the Hearthlight Inn and Ashcombe; the tenant to Gullwick (F3) | hand-ins at the first meeting (#43); a person who moves | #77 (built) |
| 3 | The Well Tastes of Iron | 2 | Helmstow, and the works under the keep | the keep (#17); a choice put by a person | #77 (built) |
| 4 | A Boat With No Name-Board | 2 | Gullwick and its wreckers' beach (F3) | `when` (#41); hand-ins at the first meeting (#43) | #47 (built) |
| 5 | Oil for the Lamp | 3 | Crowness Light (E3); Mottram's Stores and Vask, in Helmstow | a choice put by a person | #67 (built) |
| 6 | Riders in the Dark | 3 | Coldharbour (F2) and the ford (E2) | `when` (#41); a choice put by a person | #68 (built) |
| 7 | The Clerk's Seal | 4 | the Gilded Eel and Brandy Hole | hand-ins at the first meeting (#43) | #77 (built) |
| 8 | The Rest of the Survey | 4 | the Foreland map's south-west woods; the Chapel, or Thornhold | a choice put by a person; a person who moves | #77 (built) |

Three changes to #56's drafts, for the owner:

- **A Boat With No Name-Board keeps to F3.** The hoard is on Gullwick's own wreckers' beach and
  the Compact's man waits on the road west, so that a level 2 quest is not finished in country
  banded 3–4.
- **Oil for the Lamp's chandler is Mottram,** whose stores are built, rather than a chandler of his
  own.
- **3, 5 and 6 stay plain quests,** not the Wardens' or the Lanterns', as DESIGN §8 settles it
  (#21).

A choice put by a person, words that change with a flag, a person who moves once a flag is set, a
person who takes more than one item and a letter to read from the pack are systems the game lacks
(#56, "What they ask of the systems"), built in #76. Every line these quests and the three steps put
on screen is written in the issue that builds them (#47, #67, #68, #70 and #77), and the Lodestone's
keeper's in #73, each in a Dialogue section measured against the game's box and log. The built
quests' words, Vask's, Hale's and the Gilded Eel's, were rewritten to the same bar in #85.

### The Wardens' quests

The Warden Drillyard is the Wardens' hall (DESIGN §8; `hall: 'wardens'`), its trade still training.
Its drillmaster gives their quests, two here and two in Thornmark (`src/content/areas/shelf/guilds.ts`
and Thornmark's):

| Rank | Quest | Deed | Pay |
|---|---|---|---|
| first task | First Watch | the Scarth: a once-event on the road at the checkpoint (`scarth_watch`, 28,9) | 20 gold, 60 xp |
| 1 | The Cellar's Cult | both cultist bands in the Ashcombe cellar (`m_cult1`, `m_cult2`) | 60 gold, 240 xp |
| 1 | The Old Watchtower | Thornmark's ogre (`tm_ogre`) | 150 gold, 900 xp |
| 2 | The Garrison's Strongbox | a chest by Thornhold's north wall (`tm_strongbox`, 23,1) | 200 gold, 1,500 xp |

### The Lanterns' quests

The Lantern Guildhall and the Thornhold Lantern Hall are the Lanterns' halls (`hall: 'lanterns'`),
their trade still spells for the hall's fee. Either gives their quests and takes reports for any,
two here and two in Thornmark:

| Rank | Quest | Deed | Pay |
|---|---|---|---|
| first task | First Light | the Hearth seen from the shore (`coast`, 15,28) | 20 gold, 60 xp |
| 1 | The Drowned Stair | the dead at the stair down in Brandy Hole (`gw1_stairs`) | 80 gold, 300 xp |
| 1 | The Dark Marker | the survey marker in Thornmark's lake, seen from its west shore (`lake`, 26,22) | 150 gold, 900 xp |
| 2 | The Second Marker | a lit marker by the boulders south of Thornmark's river (`second_marker`, 21,27) | 200 gold, 1,500 xp |

A company that did a deed before taking its quest is paid when it takes it. The guilds' quests
take none of #56's: quests 3, 5 and 6 stay plain quests (DESIGN §8).

## 7. Encounters, and what is new

MONSTERS §5.2 has the Downs' roster and fights: the Carrion Crow, the Wrecker and the Lampman, the
Barrow Guard, the Black Dog and the Barrow Captain; crows over wolves in the stubble; a lampman and
four wreckers on the Salt Road on a foggy night; the Berth, the Downs' hardest place. Their drawings
are #46.

The Downs' wolves, boars, rats and road bandits are their own: the Chalk Wolf, the Tusker, the Barn
Rat, the Footpad and the Poacher, variants on the Foreland's frames statted on MONSTERS §4.4's
line (§5.2's table), so a group of the brief's size holds the gate. The Foreland's own stay as they
are, and every later box uses these where its brief says wolves, a boar, rats, bandits or archers.

New in the Downs, for the novelty check (EXPANSION §5.4): the birds, a new family; hills and
farmland as terrain (#44); groups that walk only by night or in fog (`when`, #41); and dens, camps
that breed one kind of monster until a company beats their keepers and burns them (#88): a rookery
in E2 (built: two Old Rooks its keepers, MONSTERS §5.2), a wolves' den in D2 (built: two Barrow
Wolves its keepers, §4.6) and a bandit camp in D3. E2 has the first statue too. §4.2 to §4.9 place
every group, box by box.

## 8. The numbers

- **Experience.** One clear of the area pays 4,101 xp a member today, 110 of it the guilds' pay and
  about 2,150 F2's, F3's, E3's, E2's, D2's, D3's, D4's and the Berth's, past level 4 (1,650). The
  curve (EXPANSION §5.2, #31) gives an area the climb from its floor to the next area's floor,
  divided by 0.75: 2,800 / 0.75, about 3,730. The Downs are where the rest comes from, shared among
  the boxes as §4.1 has it: F2 130, F3 110, E3 340, E2 190, D2 420, the Berth 420, D3 260 and D4
  200. With the Berth the clear meets the curve and goes about a tenth over it, so its shortfall is
  no longer owed to the pilot (#26); the margin is the pilot's to weigh. A den's keepers pay once,
  and its brood as a group that respawns does; the figures count the brood once.
- **Gold.** A clear pays about 4,230 with E3, E2, D2, D3 and D4: 1,190 in chests before them, about
  820 in drops (F2's and F3's among them), 900 in rewards (the clerk's seal and the tenant's paper
  once each, whoever takes them) and 180 in the guilds' pay, and E3's, E2's, D2's, D3's and D4's
  chests, hoards, drops and rewards on top, and the Berth's 300 or so (220 in its chests, the rest
  the captain's and his guard's). Training six members from 1 to 5 costs 1,500, so gold holds.
- **The gate.** The gate check (`tools/tests/gate.ts`, #38) holds every figure to an aim and fails
  it only past a limit (#273); nothing on the Foreland is owed to it. The Smuggler Captain and the
  Deacon, won 99 and 100% of the time at Brandy Hole's and the Seam's floors before the pilot, are
  brought onto the boss line as the Downs' bosses were (#47): the captain 95 hit points and 2d6+4,
  won 50% at 2; the Deacon 175 and 2d8+5, MONSTERS §4.4's boss at 5, won 50% at 3; each always two
  above. The Rift
  Warden, retuned with Ashcombe's move (#87), is won 55% at the cellar's floor, 2, and always at 4;
  the Berth's captain 45% at 4 and always at 6. The area as one pools each group at its own map's
  floor (#209): 97.3% of its 81 groups' fights won, against nine in ten. Two under, only E3's, E2's,
  D2's, D3's and D4's 32 groups have a company: 80.1% won, off the aim of a quarter and inside the
  limit of nine in ten, listed. Each zone walks its own road (both every time) and warns at its own
  way in. Fights to a rest: the Foreland map 4.37, Brandy Hole's caves 4.05, the Seam 6.69, the
  Ashcombe cellar 7.42, F2 6.44, F3 7.01, E3 7.28, E2 6.28, D2 7.80, D3 7.98, D4 7.52 and the Berth
  7.12.
- **The thresholds, as the pilot left them** (#47). Every box of the Downs was tuned to the aims of
  #273, and none moved them:

  | Figure | Aim | Limit | What the Downs did |
  |---|---|---|---|
  | Won at the floor | 90% | 80% | 89% to 100% a box; the Berth's 89% off its aim |
  | Fights to a rest | 5.5 to 7.5 | 4 to 10 | 6.28 to 7.98; D2, D3 and D4 a little over the aim |
  | A boss at its floor | 30% to 70% | 20% to 80% | 45% and 55%; Brandy Hole's now 50% |
  | A boss two above | 90% | 75% | always |
  | Won two under | a quarter | nine in ten | 80.1% over the area; no area meets the aim |
  | The road walked | 80% | 65% | every time |
  | The warning | 1 point | 10 points | the nearest groups at the median or over |
  | Country, density | 90% within 12 | none past 20 | F2 94% (15), E2 96.4% (20), D3 99.7% (14), D4 96.7% (18) |

  Bosses made to MONSTERS §4.4's line with an escort land inside the aim at the first try, so
  Brandy Hole's, made before the line, are retuned, not the limit widened. Two under stays as it
  is: no group both lost at the floor less two and held to the rest line is won a quarter of the
  time or less (#273), so it is listed, never failed; the limit catches a map won always. Two
  figures sit on their limits' edge and are watched, not moved: Brandy Hole's caves at 4.05 fights
  to a rest, and E2's furthest square at 20 steps. The owner has not played the Downs yet; what
  their play shows may move these still.
- **The pilot's hours** (#47). Each box from its pull request's first commit to its merge, by the
  clock, waits for review and for main included:

  | Box | Pull request | Hours |
  |---|---|---|
  | F2, the road west | #145 | 17.4 |
  | F3, Gullwick | #280 | 19.6 |
  | F3's people, Hild's step and the Boat, with the night beach | #283 | 46.1 |
  | E3, Crowness | #284 | 29.4 |
  | E2, the Wend's fields | #291 | 29.4 |
  | D2, the chalk hills | #306 | 2.1 |
  | The Berth | #310 | 2.1 |
  | D3, the west downs | #305 | 1.1 |
  | D4, Kestrel Edge | #309 | 2.0 |

  F2, F3 and its people were begun together on the evening of 28 September and waited on the owner
  overnight; E3 and E2 waited a day on main. D2 to D4 and the Berth were built in parallel on 30
  September, with the owner's calls delegated, and merged within two or three hours of their first
  commit. The work itself was about three session-hours a box where the brief says (§4.2, §4.4).
- **What the owner found by hand.** Nothing yet: the owner has not played the Downs. It goes here
  when they have.
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
   floors the pilot tunes (EXPANSION §5.3). The pilot measured every box of the Downs in the end:
   its hours, and the gate's aims and limits it left as they were, are in §8.
3. **Zones hold several maps.** The Downs are one zone of seven boxes, F2 and F3 from the pilot on;
   an atlas zone lists its maps (`AtlasZone.maps`; #66). A zone to a box would ask a step of the
   quest of every box the road crosses (EXPANSION §5.8), bare country included.
4. **Gullwick** is a village on F3: its houses, its boats and Wenna's mother as features, as the
   Ellerby farm is on the Foreland map, and a camp to rest at (#45). No businesses, so no new
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
   sells rations at its own price (#98): 3 gold, a quarter under Mottram's. Built in #87: the farm
   there is Ellerby (§10).
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
13. **Crowness Light** stands on the point, at 156,90, rather than inland at 140,88 (#67).

Decided by delegate for #157, on 2 October 2026 (the owner's to overturn):

14. **The gate really turns back** a company with an orcblood member, as STORY has the sergeant step in
    front of Idris; the postern, always open, is why it is no lock. It needed `Exit.shut` and
    `member.race` (#454).
15. **The postern is in the south wall by the Eel,** in both cities, and named the harbour postern for
    the boats it goes down to, off the map.
16. **The curfew bell is a night event** on the middle street, said every time, rather than a dusk bell
    the clock would have to learn: a company of 16 is seldom in Helmstow at the turn of the light.
17. **The Chapel shuts with its cure and raise,** which Thornhold and Saltmouth still sell; its people
    go, the notice says where the sexton went, and an unanswered bell ends there. Businesses wear a
    presence for it (#454).
18. **The Wardens are events, not monster groups:** no standing group that does not fight exists
    (the `warden` drawing is the Rift Warden's, not a soldier's), and a fight in a town of band 1–4
    with a company of 16, before the act's war with them, would say the wrong thing.
19. **One of the cousin's captains** sits in the Drillyard, a person with two lines and one after; the
    guild's quests are as they were, given by the hall, since a person cannot give them.
20. **Prices rise** by half: "prices do not" read as do not stay, since Helmstow changes never for the
    better. The inn and the stores are twins on their squares after the flag; the oil keeps its
    forty for Mottram's word.
21. **The Gilded Eel's rumours change,** since its old ones are Act I's; the Keep is left as it is, and
    Vask in his throne room after the act is a question for the owner.

The Scarth once the Regent has the ledger (#156), each the owner's to overturn:

22. **Hale is taken on the Delta's first step,** not at the pass: a once-event on each square of
    D5's first row a company can stand on, there once `q_greywater_done` holds, sets `q_hale_taken`
    (an event sets a flag as it is said, the systems change #156 asked for) and shows two riders in
    Warden grey going over the Edge towards the Scarth. Every way down from the Downs crosses that
    row; a way into Saltreach that does not, such as a later act's boat to Saltmouth, leaves Hale at
    the pass.
23. **Hale and the strangers wear the flag itself,** Hale `until` it and the strangers `after` it,
    as Saltmouth's Warden and the Tide Ship's last row do, so Hale is never at the pass and in the
    hold at once. A company that has been to the Delta and gives the ledger later finds Hale gone on
    its next walk down the Edge, not as it hands the book over.
24. **The strangers are one person,** `two Wardens at the Scarth`, on Hale's square: one up, one
    under his hat, the crate gone. They ask the company's business, do not know Hale's name and warn
    of nothing (#151's call 5: Vask's Wardens). They hire no one and set nothing of their own.
25. **They take Dunstan's letter** if it is still in the pack (`q_riders_grey`), so Riders in the
    Dark does not stick open, and it goes into a coat. They take nothing else: the seal goes to Maud
    and the paper to Vask, and the goals say so once Hale is gone.
26. **Vask's after-words name the Wardens,** not Hale, as holding the Scarth: the words are fixed, and
    are true both before and after.
27. **The sign, First Watch's `scarth_watch` and the rest are kept:** the road is still open, the
    two Wardens watching the pole are the strangers once Hale is gone, and Hob, Dunstan and the
    Eel's dockhand do not know he is.
28. **No journal entry says Hale is gone:** Saltreach's chapter writes the news at Saltmouth's gate,
    where it is told.
29. **Hale's Sergeant (#56's 20) is left to #558** (docs/areas/thornmark.md §6).

Decided by delegate for #19's trainers in the Foreland, on 3 October 2026, each the owner's to
overturn:

30. **Three new people teach and one who was here:** Wulfric in the keep's ward, Aldith in Helmstow
    and Siward at Coldharbour, and Mottram in his stores. Mottram's first meeting puts no choice, so
    the trainer's menu follows it; Dunstan's yard fails the road's rule, and moving him would break
    Riders in the Dark.
31. **Mottram is the chandler,** whose stores sell Lantern Oil and torches. His lesson is a `says`
    said once to a company with a paladin of 11, keyed to his hire as his other words are. The cost:
    the menu follows his words from the first meeting, so a paladin under 11 reads "from level 11"
    there. A lampmaker of his own in the stores is the alternative.
32. **Wulfric works at a bench before the empty building, in the open.** A door there would need a
    business, and every business a room of its own: the armoury's door, its armour and its shields
    wait on an interior (another lane), as Pender's picks wait on #18.
33. **Aldith keeps no shop,** as DESIGN has the luthier, and sits under the Hearthlight's eaves.
34. **Siward, Dunstan's old standard-bearer, teaches in Coldharbour's east field at 19,16.** The yard
    is seven squares from the track to the Berth, a road and the one quest's way, and one from the
    barn's rats; the field is 14 from the road and 13 from the nearest group.
35. **All four are always there,** in both cities and whatever Riders in the Dark came to. A company
    of 16 or more reaches them: an orcblood member by the postern, and the keep's gatehouse is never
    shut. The band warns and never walls.
36. **Each has a `seek` line of their own,** since the system's would read "in The Keep" and "in
    Callow Downs". The goal's "Find Wulfric, armourer of the keep in The Keep." is the system's
    wording, left to it.
37. **Their words:** three lines at the first meeting for the three new people, and three in
    Mottram's lesson. Dunstan's words do not change.
38. **The walk** checks each place and presence in both cities; teaches a knight, a paladin and a
    bard at 11 in the old city and again at 16 in the changed one, Idris let in by the postern;
    holds Siward to the road's and the groups' rule; and teaches the Banneret at 19.

Proposed, for the owner, each in the issue that would build it:

- **The briefs** of §4.2 to §4.9: each box's landmarks, points of interest, encounters, secret and
  hint, share of the pay.
- **The core** is F3, E3 and D2, the boxes that hold a step of the quest; the other four are
  country (§4).
- **Tier 3** is sold by Helmstow's Lantern Guildhall (`maxTier: 3`), so that the band's tier is
  sold in the band (§8; #74).
- **The Berth** goes on the atlas in D2, about 118,42, with a track up to it from Coldharbour across
  E2 (#68 and #69). #56's Riders in the Dark rides it.
- **Sjonghol** (the Wind Cave, `src/content/atlas.ts:309`), Saltreach's cave in the face of Kestrel Edge,
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
| Ashcombe, on the Foreland map | Ellerby | the alder farm, lived in, where Ashcombe stood before it moved past Gullwick (#87); a name first thought of for Coldharbour | |
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
