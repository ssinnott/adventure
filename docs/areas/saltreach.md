# Saltreach: step III of the road, the Long Water's country

The third step of the road of levels (DESIGN §9, EXPANSION §2.2), band 10–12, and the first of Act
II, The Salt Road: the Long Water from the foot of Kestrel Edge down through the fen to the sea, the
Tide Stone's country with its Stone gone, and Saltmouth, the free port, where the smugglers' boat
leaves for Wrackholm. This is its area doc (EXPANSION §4, §6 and §8.2): where the atlas puts it,
what the atlas and the docs put in it, the plan for building it, box by box, and the briefs. Its
work is filed under #153 (Phase 1.2, #149): the boxes as §4's table has them, the Drowned Temples
(#175), Saltmouth (#177), its chapter (#180), the two halls (#181, #182), its side quests (#183),
its drawings (#184) and its rooms (#185). Figures are measured on main at `2cc52cd` (29 September
2026) with `worldGrid` (`src/game/atlas.ts`).

Three boxes of it are built, the Delta road and the shore under the Edge (#170) and Stienwierde
(#173); with the first two the area was listed. Its content is `src/content/areas/saltreach/` (maps,
monsters, items, climate and its part of the world map; its chapter of the one quest, The Tide
Stone, in `chapter.ts`, its side quests in `quests.ts` and its guild quests in `guilds.ts` are still
to come) and its businesses' rooms `src/ui/interiors/saltreach/`. Its ids: the area `saltreach`, its
zones `upperwater`, `delta` and `saltings`, the town `saltmouth` and the temples `drowned_temples`.

---

## 1. Where it is

The atlas (`src/content/areas/saltreach/atlas.ts`, merged into `ATLAS` with the plan) makes
Saltreach three zones:

| Zone | Band | Squares | Built |
|---|---|---|---|
| The Upper Water | 10–11 | 7,714 | none |
| The Delta | 10–12 | 3,697 | C5, the Delta road, laid at 72,126, and D5, the shore under the Edge, at 104,126 (#170); B5, Stienwierde, at 40,126 (#173) |
| The Saltings | 11–12 | 3,588 | none |
| The area | 10–12 | 14,999 | three boxes |

Squares are the ones the atlas gives each zone, shallows and rivers included. Without the shallows
the area is 14,143 squares, about 13.8 zone maps (EXPANSION §1 has 13.8), and 11,965 of them a
company could walk: the rest is the rim's mountain in the A column, Kestrel Edge's face and the
Scarp's. It runs from x 11 to x 125 and from the rim down to y 213, the Scarp's foot. The zones'
bands are the folder's: the atlas gives the area 10–12 and the boxes rise through it (§4).

**The grid** (EXPANSION §8.2; docs/areas/shelf.md §1). Saltreach is the B and C columns from row 3
to row 7, with slivers in A and D. The land worth a map is ten boxes: C3, C4 and C5 down the Long
Water's east bank; B3 and B4, the willows and the fen's north; B5 and B6, the plinth and the
temples; C6, Saltmouth's box; C7, the pans. The A column (A2 to A7) and B2, C2 and B7 are the rim,
the upper valley and the Scarp's foot, and are cut (§11); D3, D4, D5 and D6 hold slivers of its land
inside the Foreland's boxes and the gulf.

Its edges:

- **North: the rim,** about nine squares deep, and under it the upper valley of the Long Water (B2,
  C2), hills and mountain with the river between, void by the plan (§11).
- **East: Kestrel Edge,** the cliff that is the Foreland's west border (docs/areas/shelf.md §1),
  with the Upper Water under it. The Foreland's D3 and D4 hold the cliff and its foot; the border
  meets the Downs on 104 squares along the Upper Water and 27 along the Delta, and the only way over
  it is the Salt Road down the Edge, in D4 (#72), open from the start (EXPANSION §2.2). Where the
  road leaves D4 it comes down D5's west column, the shore under the Edge, and steps into C5. Laid
  in the Delta, D5 takes the shore from the Downs, so the crossing line (#166) falls at D4's foot.
- **South: the Scarp,** the escarpment between the Saltings and the Glasswold (26–28, Act IV), 103
  squares of border along B7 and C7. The Scarp stair climbs it at 80,206 (`src/content/atlas.ts`),
  a road link open from the start; it is Act IV's way down, and this act sees its foot and no more
  (§4.9).
- **South-east: the sea,** Sylmeer, once the Salt Gulf (§10), between Kestrel Edge and the
  Saltings, with Wrackholm beyond it. The smugglers' boat crosses from Saltmouth's quay to the
  isle's landing at 152,172 (`src/content/atlas.ts`; #164).
- **West: the rim** again, the A column, mountain and hill with the fen's west edge under it.

The Long Water runs the length of the area: from the rim at 30,44 down the Upper Water's west side,
under the willows, into the fen at about 74,104 and to the sea at Saltmouth (100,170), with two
distributaries through the Delta (from 70,128 and 80,146) that reach the sea either side of the
port. The Salt Road comes down Kestrel Edge into C5, runs south through the fen on the Delta's east
side to Saltmouth, and the spur to Rietum leaves it at 98,156 and follows the river north through
C5 and C4 to the village.

`node tools/worldmap.ts out.png --zones` paints it.

## 2. What it is for

The first half of Act II (DESIGN §9): *who profits?* The Tide Stone is gone from its plinth, taken
downriver on a barge at midsummer, and everything in the area is what a country looks like with its
Stone stolen rather than cut: the fen glitters with brine glass, the Rifts stand open, the Drowned
Temples have gone dark and their god only counts, and the Compact's barges carry shards and people
down the Long Water past folk who saw the Stone go by (MONSTERS §6.1). It is the first content past
`MAX_LEVEL`, where a company takes its first prestige (#19) and the first fights that one spell must
not answer (MONSTERS §3.3): ranks, morale, casting, drain and elements are all first spent here
(#160, #161). It ends at Saltmouth, the free port, the Compact's home and the seat of Jory Tallis
(DESIGN §10.1, §10.2), with the boat out to Wrackholm. STORY has Maren, the company's Tidefolk
healer, come home to it and go into the temple alone.

The weather is the delta's: mild and wet, sea fog off the gulf in the mornings, the tide twice a
day on the Saltings' ground (#162, #151's call 3).

## 3. What is built

Its atlas rows (`src/content/areas/saltreach/atlas.ts`, #169): the zones with their bands (the Upper
Water 10–11, the Delta 10–12, the Saltings 11–12), Saltmouth at 10–12, the Drowned Temples at 11–12
and the sites. The atlas has the area's zones, the town and the dungeon as planned plates, its sites
(Rietum, Saltmouth, the Tide Stone, the Drowned Temples and Sjonghol, its own; Sylmeer, Kestrel Edge
and the Scarp, the plan's, §10) and its links: the road down Kestrel Edge, the town's and the
temples' ways in, the boat to Wrackholm and the Scarp stair. The systems it waits on are #150's: the
cap past 10 and the curve's rows (#159), ranks and morale (#160), casting, drain and elements
(#161), salt, tidal ground and heather (#162), coaches and boats (#164), the Rift generator for its
small Rifts (#165), the band said on crossing (#166) and the log paged by chapter (#167). Its
monsters are drawn in #184 and its rooms in #185. The boxes built:

- **The shore under the Edge** (D5, `delta_d5`, country, band 10–11; #170): the Salt Road's three
  squares down D4's foot and the milestone beside them (SALTMOUTH 4, RIETUM 5); the sand under the
  cliff where Sylmeer opens; a shingle bar out across tidal flats to an islet, where a hermit
  mending nets saw the barge go by and sends the company up the spur; and on south to a spit with a
  wreck's ribs in it. No groups. The rest of the box is the gulf.
- **The Delta road** (C5, `delta_c5`, country, band 10–11; #170): the causeway from the Edge's foot
  down the fen's east side to C6, a camp at its head and the drowned god's dry shrine on it; the
  fork, its sign at 24,27 and a cairn beside it, and the spur north up the river to C4; the fen's
  pools either side of the causeway with leeches and an eel in each; a bull toad alone at the far
  end; a brine Rift (`c5_rift`, #165's ring) on an islet between the spur and the causeway, three
  brinelings in its rooms and a tide elder with one more at its heart, quiet once the elder falls;
  and the river's west fen over two fords. The secret is a barge drowned under the causeway's arch,
  the Brine Shard in its straw; the hint is the mast's stump at the arch, with the stones glowing
  green beside it by night. The gate holds at 10, at 7.0 fights to a rest on the box and 6.8 in the
  Rift.
- **Stienwierde** (B5, `delta_b5`, core, band 11–12; #173): duckboards from the Delta road west over
  the fen and the channel to the Tide Stone's island, its plinth empty and its socket cut clean; a
  driftwood shrine at the boards' start, a cairn and house-footings on the mound, and a hermit on a
  hummock who counts the Rifts' lights. Two groups of five fen toads on the boards and two bull
  toads on the island's far side; two brine Rifts (`b5_rift_n`, #165's cells, and `b5_rift_s`, its
  breach), each two tide elders at the heart, quiet once they fall. The secret is a hollow under the
  plinth's landing, a Brine Shard and a Kite Shield +1 in it; the hint is the barge-poles' marks on
  the landing, and one plank among them unscored and new-nailed. The gate holds at 11, at 7.1 fights
  to a rest on the box and 5.4 in each Rift.
- **Weather.** The delta's: mild and wet, the wettest in late autumn, fog off the gulf. Fronts reach
  it four hours after they cross the Foreland.

## 4. What is still to build

All but C5, D5 and B5: 14,143 squares of land, 11,965 of them walkable. On the grid (§1) the plan is
ten boxes, a dungeon and a town, and the boxes hold 8,946 of those squares:

| Box | Name | Zone | Kind | Band | Land | What is there | Its step of the quest | Issue |
|---|---|---|---|---|---|---|---|---|
| C5 | The Delta road | the Delta | country | 10–11 | 872 (marsh 783), 122 shallow | the Salt Road through the fen from D4 to C6; the fen's pools; a brine Rift; a camp | none | #170 |
| C4 | The spur to Rietum | the Delta, the Upper Water | country | 10–11 | 986 (grass 758, marsh 135) | the Long Water's east bank; barges at dusk; the track up to Rietum | none | #171 |
| C3 | Rietum | the Upper Water | core | 10–11 | 998 (farm 751, grass 216) | Rietum at 80,80 under Kestrel Edge; Sjonghol in the cliff; the barge smuggler | the folk who saw the Stone go by | #172 |
| B5 | Stienwierde, the plinth | the Delta, the Upper Water | core | 11–12 | 948 (marsh) | the plinth at 48,140, empty; fen toads; two brine Rifts | the plinth stands empty | #173 |
| B6 | The Drowned Temples' approach | the Delta, the Saltings | core | 11–12 | 975 (marsh) | the temples' way in at 56,170; the priestess who says the number | the temples gone dark | #174 |
| | The Drowned Temples | | dungeon, two levels of 16×16 | 11–12 | | the choir, the Choirmaster and the bell | | #175 |
| C6 | Saltmouth's box | the Saltings, the Delta | core | 11–12 | 834 (marsh 714, salt 56, sand 51), 175 shallow | the port's approach at 102,178; the barge quay; tidal ground along the shore | the free port | #176 |
| | Saltmouth | | town, 16×16 | 10–12 | | the two halls, Tallis, four trainers, the boat | the crossing | #177 |
| C7 | The salt pans | the Saltings | country | 12 | 718 (salt 244, grass 241, marsh 193) | the pans and the salt crabs; the Scarp's foot | none | #178 |
| B3, B4 | The willows | the Upper Water, the Delta | country, behind the road | 10–11 | 970 and 775 | willows along the Upper Water; herons; the fen's north | none | #179 |

The core is the four boxes that hold a step of the quest (C3, B5, B6 and C6), built at full
density; the rest is country, built to the looser floor with the wilderness features (EXPANSION
§2.1 (b) and §5.3, #45). The road's two country boxes and the pans are built with the act; the
willows are parked until the owner has played it (#151, call 10). The bands rise from the way in,
10 at the foot of the Edge, to 12 at the pans and the temples' choir, as the gate asks (EXPANSION
§5.2), and each box holds a group at the top of its band for the curve.

**Two boxes hold land of two zones.** C4 is the Delta's grass and the Upper Water's along the
river, and B5 and B6 each straddle two zones' fen. A map is its whole box (EXPANSION §8.2), so each
is built to its edges and the zone line runs inside it; the zone a square belongs to decides only
its crossing line (#166) and its band.

**The order** is the Salt Road's, and the quest's: C5, the only box that meets the Downs; C4 and
C3, the spur up to Rietum and the first step; B5 and B6, west across the fen to the plinth and the
temples, and the temples themselves; C6 and Saltmouth; C7. Building waits on the pilot (#47), which
measures a box first and tunes the thresholds every box is held to, and on Saltreach's systems
(§3); the briefs and the drawings do not (#149).

The places, as the atlas and the docs have them:

| Place | Box | What the docs say | On the atlas |
|---|---|---|---|
| Rietum (Reedholm) | C3 | the folk who saw the Tide Stone go by one night (DESIGN §9); an old barge smuggler, the Thief's second prestige (#19); the barge child's night-light (#56's 21) | a planned village at 80,80 |
| Sjonghol (the Wind Cave) | C3, in the cliff | the Monk's second prestige (#19) | a planned cave at 103,76, moved a square west into C3 by #71, so D3 does not hold it |
| The Tide Stone's plinth | B5 | stands empty; the Stone comes home to it (DESIGN §9, #191) | a planned stone at 48,140 |
| The Drowned Temples | B6, and below | gone dark; the god used to sing the tides and now only counts, until its Stone comes home (DESIGN §9, STORY); the choir and the Choirmaster (MONSTERS §6.1); the bell (#56's 23) | a planned dungeon at 56,160, its way in at 56,170 |
| Saltmouth | C6, and its own map | the free port, the Compact's home, the seat of Jory Tallis (DESIGN §9, §10.1); four first prestiges (#19); the Cartographers' and the Compact's halls (DESIGN §8); the boat to Wrackholm | a planned port at 102,178; its plate moved from 118,172 (D6) to C6 (#151, call 7) |
| The salt pans | C7 | the Salt Crab's ground (MONSTERS §6.1); the star that moved, seen from them at night (#56's 24) | salt, 337 squares of the Saltings |
| The Long Water | C4, C5, B3, B4 | the Compact's barges, shards and people downriver (DESIGN §9); a barge on a shoal (#56's 22) | a river from the rim to Saltmouth, lettered |
| The Scarp | C7's south edge | the Glasswold's border; Act IV's stair (#56's 54) | the escarpment, lettered at 70,208; the stair at 80,206 |
| Sylmeer (the Salt Gulf) | east of C6 and C7 | the crossing to Wrackholm | water, lettered at 124,150 |

### 4.1 The briefs

Each box's brief is what EXPANSION §8.2 asks of one: its purpose, band, landmarks, the secret and
its hint, the encounters and what is new, with its points of interest and a first share of the pay
beside them. They are drafts for the owner, written before Act II's first box is built; each is
settled in its issue, and what the pilot teaches changes them.

- **Points of interest** (EXPANSION §5.3). A core box is held to the Foreland map's density: about
  nine features, ten groups and four ways in or out to 870 open squares. A country box has about
  half, and the wilderness features (#45) do most of the work. No more than one point in four is a
  sign.
- **Encounters** are MONSTERS §6.1's roster and fights. A group is about one of MONSTERS §4.4's
  standard encounters, and from here on a kill pays each member by the monster's level against
  theirs (#159), so the figures below are for a company at the box's band.
- **Pay.** The area owes 8,267 xp a member (§8). The shares below add up to a little over that,
  for the curve to settle (#159) and the gate to check (#38).
- **Side quests** are #56's 21 to 24, placed as §6 has them (#183).
- **Finds** are the ladder's next step (#18): the band's gear at Saltmouth's armourer, and the
  first named pieces on the road out of it. Each is an item when its box is built; no find is dearer
  than the band's window on the curve.

### 4.2 C5, the Delta road (#170): country, band 10–11

- **Purpose.** The first box below Kestrel Edge, and Act II's first ground: the Salt Road raised
  through the fen on a causeway, the area's gentlest groups, and the crossing line that tells a
  company under the band how the land feels (#166).
- **Landmarks.** The causeway from D4's foot, over D5's corner (the road's three squares at
  104,126–128 and the milestone, laid as a map of its own), down the fen's east side to C6; the spur
  to Rietum leaving it at 98,156 and following the river north; the fen's pools either side; a small
  brine Rift on an islet west of the road; a camp on dry ground.
- **Points of interest,** about six features and five groups:
  - a milestone where the road leaves the Edge: SALTMOUTH 4, RIETUM 5;
  - the camp, to rest at (#45);
  - a cairn at the spur's fork (#45);
  - a shrine on the causeway, the drowned god's, its bowl dry (#45);
  - a hermit on an islet, who saw the barge go by one night with a light in its sacking, with a
    rumour;
  - the Rift, closed `until` the Tide Stone is home (#41).
- **Encounters.** Leeches with an eel in the water beside the path, the fen's pools (MONSTERS
  §6.1's second fight), two groups; brinelings at the Rift; a fen toad on the causeway's far end.
- **Quests.** None of its own; the chapter's goal points down the road (§5).
- **The secret and its hint.** A drowned barge under the causeway's arch with a shard still in its
  straw, the first the company can hold. The hint: the causeway's stones glow green at night above
  the arch.
- **New here.** Marsh and tidal ground underfoot (#162); the crossing line (#166); the first Rift
  from a template (#165); the leech, the first monster whose hits heal it (#161).
- **Finds.** The barge's shard, a quest item the plinth does not take (§5).
- **Pay.** About 700 xp a member.
- **As built** (#170, 1 October): with D5 beside it, the shore under the Edge (§3), which holds the
  milestone and the hermit; the hermit is on D5's islet, not C5's, so that the islet and the spit
  are land a company reaches. The pools are two groups of three leeches and an eel; the fen toad at
  the far end is the bull toad alone, the box's hardest group, and the fen toads wait for B5. The
  brinelings are the Rift's, three in its rooms and one beside a tide elder at its heart: the Tide
  Stone's Rifts' family (MONSTERS §2.1), and the tide elder's first placing. The Rift goes quiet
  when the elder falls; #191 adds the Stone home as the other way. Its hoard holds no shard, though
  the brine tear's words show one beside it, as the cellar's Rift shows a Wardstone shard it never
  gives. The hint is the mast's stump at the arch, which is always there; the green glow is said by
  night beside it. As measured, the box pays about 680 xp a member and its Rift about 430, 1,115
  together, and 300 gold. What the owner finds by hand goes here when the box has been played.

### 4.3 C4, the spur to Rietum (#171): country, band 10–11

- **Purpose.** The Long Water's east bank between the road and the village: grass, the fen's
  edge, the barges.
- **Landmarks.** The river as the box's west edge, with a ford; the track north to Rietum; a
  barge tied at dusk, a master and his crew aboard; a shrine and a cairn.
- **Points of interest,** about five features and five groups:
  - the ford;
  - a hermit with a rumour of the night the Stone went by, and of who poled the barge;
  - a shrine (#45), a cairn (#45);
  - the barge on a shoal, Passage Paid (#56's 22, §6).
- **Encounters.** A barge at dusk: a master and five bargemen, and two herons over the reeds
  (MONSTERS §6.1's first fight, the first on the road won by who falls first, #160); herons in the
  reeds; an eel at the ford.
- **Quests.** Passage Paid (§6).
- **The secret and its hint.** A hide in the reeds where the bargemen leave what they skim from the
  cargo, a shard among it. The hint: the herons stand everywhere along the bank but one place.
- **New here.** Ranks and morale (#160): a crew that breaks when its master falls.
- **Finds.** A Long Sword +1 in the hide.
- **Pay.** About 600 xp a member.

### 4.4 C3, Rietum (#172): core, band 10–11

- **Purpose.** The Upper Water's step of the quest: the village that saw the Tide Stone go
  downriver one night, glowing through its sacking. Rietum, once Reedholm (§10).
- **Landmarks.** The village at 80,80 under Kestrel Edge's cliff, drawn on its box as Gullwick is on
  F3: a dozen houses on a mound above the flood, a quay with barges tied at it, the net lofts, a
  camp; its fields south and east; the cliff along the box's east edge, with Sjonghol in its face.
- **Points of interest,** about nine features and six groups:
  - the folk on the quay who saw the Stone go by, the step (§5);
  - the priest, and the barge child with her night-light (#56's 21);
  - the old barge smuggler, the Thief's second prestige (#19);
  - the quay, and the Compact's men on the barges;
  - a camp to rest at (#45), and the well;
  - Sjonghol, a short cave in the cliff with the Monk's trainer at its mouth (#19);
  - a shrine by the ford below the village.
- **Encounters.** Herons in the fields; bargemen on the quay by day; brinelings at the child's
  window by night (`when`), `until` the Stone is home; an eel in the river.
- **Quests.** The step. The Night-Light (§6).
- **The secret and its hint.** The smuggler's cache under the quay, reached from the water at low
  tide. The hint: the child's night-light shows where the water glows.
- **New here.** A village of the Tidefolk, on a mound; a trainer in a cave.
- **Finds.** A Chain Mail +1 and a named short sword, the smuggler's, in the cache.
- **Pay.** About 1,000 xp a member.

### 4.5 B5, Stienwierde (#173): core, band 11

- **Purpose.** The Delta's first step: the Tide Stone's plinth on its island in the fen, empty,
  and the Rifts open round it because its Stone is gone.
- **Landmarks.** Marsh all through, with duckboards; the plinth's island, Stienwierde (§10), at
  48,140, its socket clean-cut and the same size as the Grove Stone's cut, scaled up; two brine
  Rifts; brine glass glittering in the fen.
- **Points of interest,** about eight features and eight groups:
  - the plinth, the step (§5), which takes the Stone when it comes home (#191);
  - the duckboards' landings, and the barge-pole marks on the plinth's;
  - the two Rifts, from #165's templates, closed `until` the Stone is home;
  - a cairn on the island (#45), a shrine at the duckboards' start (#45);
  - a hermit on a hummock who counts the Rifts' lights.
- **Encounters.** Fen toads on the duckboards (two groups); a bull toad alone at the island's far
  side; brinelings at each Rift; leeches in the pools.
- **Quests.** The step.
- **The secret and its hint.** The barge-pole marks on the plinth's landing, which show which way
  the Stone went, and under the landing a shard the thieves dropped. The hint: the priest at
  Rietum, who saw the barge and knows a pole's mark.
- **New here.** The toads, a new family (#223); a Stone's plinth without its Stone.
- **Finds.** A Kite Shield +1 under the landing.
- **Pay.** About 1,000 xp a member; as built about 1,600, its two Rifts inside it (§8).
- **As built** (#173, 1 October): band 11–12, so that the bull toads and the tide elders sit in it.
  The plinth's island is reached by the duckboards, a ring of shallows round the rest of it. The
  groups are three on the box and one warden in each Rift, each a fight inside the gate's aim at 11:
  two groups of five fen toads on the boards, and two bull toads on the island's far side, the box's
  hardest; the Rifts, on #165's cells and breach, hold two tide elders each at the tear's heart and
  go quiet when they fall, #191 adding the Stone home as the other way. No leeches: the pools are
  C5's fight. The hint is the landing's pole-marks, always there; the priest at Rietum's line about
  a pole's mark is #172's. The shard under the landing is a Brine Shard, as C5's is. No camp. As
  measured, the box and its Rifts pay about 1,650 xp a member and 410 gold, the company at about 10
  in the road's order until C4 and C3 are listed ahead of it; at 11 the figure is about 1,700.

### 4.6 B6, the Drowned Temples' approach (#174): core, band 11–12

- **Purpose.** The temples' way in and the fen round it, and the priestess who says the number:
  the Delta's second step.
- **Landmarks.** The temples' roofs standing out of the fen at 56,170, their doors under water at
  high tide and clear at low (#162's tidal ground, which opens nothing: the stair inside is dry at
  either); the causeways between the roofs; the priestess at the dry door.
- **Points of interest,** about eight features and seven groups:
  - the priestess, counting: the step (§5), and the Tide Bell's giver (#56's 23);
  - the temples' door, the way into #175;
  - the causeways and their drowned;
  - a cairn (#45), a camp on the last dry ground (#45);
  - the far roof, and the second door under the water.
- **Encounters.** Drowned men on the causeways (two groups); the last fen toads; brinelings in the
  shallows at night.
- **Quests.** The step. The Tide Bell (§6).
- **The secret and its hint.** A second door under the water at the far roof, into the temples'
  second level behind the choir. The hint: the count itself, which the priestess says with a pause
  where the door is.
- **New here.** Tidal ground that shows and hides a door.
- **Finds.** None on the box; the temples' below.
- **Pay.** About 800 xp a member.

### 4.7 The Drowned Temples (#175): dungeon, two levels of 16×16, band 11–12

- **Purpose.** The area's dungeon: the Tidefolk's temples, dark, and their drowned priests
  counting instead of singing (MONSTERS §6.1). The count ends on eleven.
- **Landmarks.** The upper temple, half flooded: its nave and side chapels, the drowned in them,
  and the nave's stair down. The choir below, where the chant is heard from the top of the stair;
  the Choirmaster at its end with the bell.
- **Points of interest,** about seven features and eight groups a level, as the Foreland's dungeons
  are held: the chapels' fonts, the bell's empty frame, the stair, the choir's stalls, the back
  door from the far roof.
- **Encounters.** Drowned men in the nave; the choir, four chanters behind two drowned men, the
  front row asleep while the chanters count (#160, #161); the Choirmaster, boss, level 12, blessing
  its group each round; when it falls, the count stops.
- **Quests.** The Tide Bell (§6): the bell taken from the Choirmaster and set back on its frame,
  and the Tidefolk's blessing given once.
- **The secret and its hint.** The door from the far roof into the second level's back (§4.6), and
  behind it the sacristy the priests drowned themselves in, with their god's silver.
- **New here.** A caster among the dead; a boss that blesses (#161); a count that stops.
- **Finds.** The god's silver: a Silver Mace +1 and a Holy Symbol of the tide, a resistance to
  cold worn.
- **Pay.** About 1,800 xp a member.

### 4.8 C6, Saltmouth's box (#176): core, band 11–12

- **Purpose.** The Saltings' step, the free port from outside: the Salt Road's end at the town's
  gate, the barge quay where the Long Water meets the sea, and the shore that floods.
- **Landmarks.** The town's walls and gate at 102,178, the way into #177; the barge quay with a
  Compact warehouse; the shore path along tidal ground, under water at high tide; the pans
  beginning at the box's south edge; Sylmeer seen east.
- **Points of interest,** about eight features and six groups:
  - the gate, and the coach yard outside it (#164);
  - the quay, the warehouse and its clerk;
  - a shrine of the drowned god by the water (#45);
  - a milestone: RIETUM 5, THE PASS 40;
  - the sea wall, and the smugglers' stair in it;
  - a camp under the wall.
- **Encounters.** Bargemen on the quay by day and Wrack smugglers by night (`when`); the first salt
  crabs at the pans' edge; an eel under the quay.
- **Quests.** The chapter's goals point into the town (§5).
- **The secret and its hint.** A smugglers' stair in the sea wall, dry at low tide only, into the
  harbour tavern's cellar (#182). The hint: a rope tied off at the wall's top with nothing on it.
- **New here.** Salt underfoot (#162); a town on its box with its own map behind the gate.
- **Finds.** A Scale Mail +1 in the warehouse.
- **Pay.** About 700 xp a member.

### 4.9 Saltmouth (#177): town, 16×16, band 10–12

- **Purpose.** The act's first town: the Compact's home, the seat of Jory Tallis, and where four
  classes take their first prestige. It sells and teaches what the band needs (EXPANSION §4).
- **Businesses,** each with a room of its own (#185): the inn (rest, and the coach yard, #249); the
  drowned god's town shrine (cures and raising at the band's price, #250); the armourer (the
  band's gear, a step past Thornhold's, #251); the provisioner, a chandlery (#252); the harbour
  tavern that is the Compact's hall (#182, #253); the Cartographers' map room (#181, #254); the
  training hall, to 13 (#159, #255); the locksmith's shop (#19, #256). No spell hall: the next tier
  is sold at Lantern Watch (#151, call 9).
- **People.** The astrologer, the locksmith, the stevedore and the ferryman, the four trainers (#19),
  each at their job; Jory Tallis at the dockmaster's house with his lineage on the wall, whose words
  touch the throne without opening the subplot (Phase 4); the smugglers' captain who takes the boat
  out (#164, #56's 25); the warehouse clerk; a Warden come down the coast road with the news of
  Hale (§5).
- **Quests.** The chapter's goals (§5); The Star That Moved (§6); the two halls' first tasks and
  first ranks (§6).
- **The boat** from the quay to Wrackholm's landing (#164): a fare, never a favour; halved for a
  member of the Compact (#182).
- **New here.** A guild hall that does not look like one; the first prestiges; a crossing.
- **Pay.** About 300 xp a member in the halls' first tasks and the town's quests.

### 4.10 C7, the salt pans (#178): country, band 12

- **Purpose.** The Saltings' pans south of Saltmouth, the salt crabs' country, and the Scarp rising
  at the box's south edge toward the Glasswold, Act IV's border.
- **Landmarks.** Salt flats with the pans' walls and the salters' huts, walked in lanes; the Scarp's
  cliff as the south edge with the stair's foot at 80,206 seen and not climbed; the last marsh
  between the pans and the town.
- **Points of interest,** about five features and five groups:
  - a salter with a rumour of the star that moved (#56's 24);
  - a shrine, a cairn (#45);
  - the stair's foot, and the line that says what is above it;
  - the crab-hole under a pan's wall.
- **Encounters.** Salt crabs in the pans (three groups); a bull toad in the last marsh; Wrack
  smugglers on the shore at night.
- **Quests.** The Star That Moved's watch, from the pans at night (§6).
- **The secret and its hint.** A crab-hole under a pan's wall with a salter's hoard. The hint: the
  salt is trodden at one wall and nowhere else.
- **New here.** The Scarp, and the way down into Act IV, seen.
- **Finds.** A named crab-shell buckler in the hoard.
- **Pay.** About 700 xp a member.

### 4.11 B3 and B4, the willows (#179): country, band 10–11, parked

- **Purpose.** The Upper Water behind Rietum: willows along the river and the fen's north end,
  built once the owner has played the act (#151, call 10).
- **Landmarks.** The willows' quay; a heronry; the river's bend under the rim.
- **Encounters.** Herons; barges at the willows' quay; a heronry as a den (#88).
- **Pay.** About 400 xp a member each.

## 5. The one quest here

Saltreach's chapter is The Tide Stone (`chapter.ts`, #180), joined after Thornmark's, and every
zone on the road holds a step (EXPANSION §5.8): the Upper Water's at Rietum, the Delta's at the
plinth and the temples, the Saltings' at Saltmouth. Its entries and goals, in the journal's voice,
keyed to flags, events and maps the save holds:

- **The way in.** From Kestrel Edge the Salt Road runs down into the Delta; the goal points down it
  to Saltmouth and up the spur to Rietum.
- **Rietum.** The folk on the quay saw the Stone go downriver one night, glowing through its
  sacking like a lantern in a sack, on a Compact barge; the goal turns west to the plinth.
- **The plinth.** Stienwierde stands empty, its socket cut clean, and the fen round it glitters;
  the goal goes on to the temples.
- **The temples.** The priestess at the dry door says the number, again and again, and it means
  nothing yet; the god used to sing the tides. The goal goes south to the port.
- **Saltmouth.** Word has come down the coast road: Hale's copy of the ledger reached the Regent,
  and Hale has not been seen since; his post at the pass is held by men nobody knows (#156). The
  ship the Stone went to rides off the smugglers' isle, and the boat to it leaves from the quay
  (#164). The goal stays open until the Stone is set back on the plinth, which is Wrackholm's
  chapter's last step (#191).

Nothing in the chapter is a lock (EXPANSION §2.3; #151, call 1): the boat sails for anyone with
the fare, the temples open at either tide, and a company that reaches Saltmouth first reads the
journal true in that order. The walkthrough plays it at 10, 11 and 12, in order and with Saltmouth
taken first.

## 6. Side quests

#56's four for Saltreach, all taken by the owner on 28 September 2026 (#151, call 13), each built
with its box on the systems of #76 (#183):

| # | Quest | Level | Where | What it needs | Built in |
|---|---|---|---|---|---|
| 21 | The Night-Light | 11 | Rietum (C3) | a choice put by a person; `until` (#41) | #172 |
| 22 | Passage Paid | 11 | the Long Water (C4); the boat at Saltmouth | a choice put by a person; `after` (#41); the fare (#164) | #171 |
| 23 | The Tide Bell | 12 | the Drowned Temples and their door (B6) | a hand-in at the first meeting (#43); a once-only blessing (#45) | #175 |
| 24 | The Star That Moved | 12 | Saltmouth; the pans at night (C7) | `when` (#41); a choice put by a person | #177, #178 |

One change to #56's drafts, decided with the boat (#164): 22's favour is the boat's fare, never
the boat, which sails for anyone from the start (EXPANSION §2.2).

### The guilds' quests

Two halls open here (DESIGN §8), on the rules and the hall menu built in #132:

- **The Cartographers' Guild** (#181), a map room in Saltmouth (#254): the first task, a survey
  of the Salt Road's milestones; a first rank of two quests in the boxes and the Delta; the Meridian
  journal read here for the first time, where the Lost Expedition goes on (DESIGN §10.3). Its
  surveyor gives The Length of the Wall in Sunderwood (#56's 32, #205).
- **The Salt Compact** (#182), the harbour tavern (#253): the first task, a run of brandy past the
  customs house; a first rank of two quests; the boat's fare halved for a member. Its line begins
  with the hermit's letter from Wrackholm (#56's 26, #192): the founder is a decade dead and the
  orders come from below (DESIGN §10.2). The crews the company fights on the river and the isle
  have left the Compact for the Hand's coin, so killing them costs nothing with the guild (#151,
  call 4).

## 7. Encounters, and what is new

MONSTERS §6.1 has the roster and the fights: the Fen Eel and the Leech, the Grey Heron, the Fen Toad
and the Bull Toad, the Bargeman and the Barge Master, the Salt Crab, the Brineling, the Drowned
Chanter and the Choirmaster; a barge at dusk, the fen's pools, the choir. Their drawings are #184's,
eleven issues (#261, #221 to #230). §4.2 to §4.11 place every group, box by box, the gentlest at the
foot of the Edge and the choir at the top of the band.

New in Saltreach, for the novelty check (EXPANSION §5.4): the long bodies and the toads, two new
families; salt and tidal ground underfoot (#162); ranks and morale, casting, drain and elements
(#160, #161: a crew that breaks, a caster that sings a row to sleep, a leech that heals as it hits,
a riftling that lightning bites and cold does not); a Rift from a template (#165); the crossing
line (#166); a coach and a boat (#164); the first prestige (#19). Its landmarks: a village on a
mound, a Stone's plinth without its Stone, temples half under water, a port.

## 8. The numbers

- **Experience.** The curve (EXPANSION §5.2, #159) gives an area the climb from its floor to the
  next area's floor, divided by 0.75: from 10 to 12 that is 6,200 / 0.75, about 8,267 xp a member,
  with today's `xpForLevel`. The shares of §4 are C5 700, C4 600, C3 1,000, B5 1,000, B6 800, the
  temples 1,800, C6 700, Saltmouth 300, C7 700 and the four side quests about 700 between them:
  8,300 without the willows. A small Rift is budgeted at about 450 a member on top of its box's
  share: C5's, about 430, brings the sum to about 8,750, some 6% over the curve. B5 as built pays
  about 1,600, its two Rifts inside it (#173): a fight inside the gate's aim at 11 costs about 300
  xp a member whatever its monsters, and its five come to about 1,650 measured with the company at
  about 10, about 1,700 at 11. No other share gives back the 600, so the area comes to about 9,350,
  some 13% over the curve's 8,267. The surplus is for a kill paid by level to damp, and each box
  still to build is priced by its fights, about 300 a fight, and recorded as built where that
  passes its share. The willows add 800 when they are built. From here on a kill pays by level
  (#159), so a company that arrives at 10 earns the shares as written and one that arrives at 13
  earns less; the curve's row reports what a clear falls short of as owed to #153 until the boxes
  exist.
- **Gold.** Training six members from 10 to 12 costs about 5,040 with today's `trainPrice`, and the
  first prestiges about 1,000 each (#19); a clear should pay for the training at least, in chests,
  drops and the halls' pay, and the ladder's step at Saltmouth's armourer is priced within the
  band's window (#18).
- **The gate.** The gate check (`tools/tests/gate.ts`, #38) holds each box at its own floor
  (docs/areas/thornmark.md §9, 17): a company at 10 wins nine in ten of C5's fights and walks the
  causeway resting at its camp; one at 8 wins no more than one in four. The Choirmaster is won about
  half the time at 11 and nearly always at 13.
- **Density.** Core boxes at the Foreland's floor, country at the looser one (EXPANSION §5.3).

## 9. Decisions

Decided by the owner on 28 September 2026, when the act's stories were drafted (#151), and
followed here:

1. **Act II spends no story lock** (call 1): nothing in Saltreach opens on the quest's progress.
2. **The Sunder is hand-built and the small Rifts are generated** (call 2): the Delta road's and
   the plinth's Rifts are #165's templates.
3. **Tidal ground turns with the hour,** twice a day (call 3): the Saltings' shore and the temples'
   doors.
4. **The Hand's crews have left the Compact** (call 4): the bargemen and the smugglers are the
   Hand's, and killing them costs nothing at the hall.
5. **Saltmouth is on C6** (call 7), its gate at about 102,178, and the atlas's plate moves from
   118,172 to match.
6. **Lantern Watch sells the next spell tier** (call 9); Saltmouth sells none.
7. **The willows are built after the act is played** (call 10): #179 is parked.
8. **The cuts stand** (call 12): §11.
9. **All four side quests stand** (call 13): §6.
10. **The names** (§10).

Proposed, for the owner, each in the issue that would build it:

- **The briefs** of §4.2 to §4.11: each box's landmarks, points of interest, encounters, secret
  and hint, finds and share of the pay.
- **The core** is C3, B5, B6 and C6, the boxes that hold a step; the rest is country (§4).
- **Rietum is drawn on its box,** as Gullwick is on F3: houses, quay and people as features, a
  camp to rest at, no businesses (#172).
- **The temples are two levels of 16×16,** the upper temple and the choir, with the back door from
  the far roof (#175).
- **Saltmouth's eight businesses** (§4.9), the locksmith's among them, since #19 gives the trainer
  a shop where the job is a trade.
- **The pay's shares** (§8).
- **The bands on the atlas's rows** (#169): the Upper Water 10–11, the Delta 10–12, the Saltings
  11–12, Saltmouth 10–12, the Drowned Temples 11–12. They are set already in
  `src/content/areas/saltreach/atlas.ts`, where only the scaffold reads them, for a box's draft; the
  owner's word changes them there.

Decided by delegate for #169, each the owner's to overturn:

1. **The atlas folder is spread into the plan** (`src/content/atlas.ts` imports it where its rows
   were), as Sunderwood's is: the area cannot be listed in AREAS until #170 gives it a map. #170
   points the area's `atlas` at it and takes the import out.
2. **The folder charts the plan's rows and the bands, and no new sites:** Stienwierde and the pans
   are their boxes' to place (#173, #178), and the Long Water is lettered as a river.
3. **The Delta is 10–12,** not the 11–12 this doc first gave it: C5 and C4, the way in, are 10–11,
   and the scaffold drafts a box at its zone's band.
4. **Sylmeer, Kestrel Edge and the Scarp stay the plan's:** each is a name on a border Saltreach
   shares, with the Foreland, Wrackholm or the Glasswold.

Decided by delegate for #170, each the owner's to overturn:

1. **D5 is laid with C5, both in the Delta,** band 10–11: the shore under the Edge becomes
   Saltreach's, and the crossing line falls at D4's foot, where its last event already says the
   Delta.
2. **The hint is the mast's stump at the arch,** always there, and the stones' green glow is a
   night-only line beside it: a secret's hint may not come and go (`tools/tests/pillars.ts`).
3. **The groups are three:** the pools' leeches and eel, two groups of four, and the bull toad alone
   at the far end, MONSTERS §6.1's "the Delta, alone", which the curve needs as the box's hardest.
4. **The bull toad stands 1.35, not 1.4:** a group with a monster of 1.4 to 1.5 puts its label on
   its markers, and five hundredths do not show in the drawing.
5. **The Rift is #165's ring in brine,** three brinelings in its rooms and a tide elder with one
   more at its heart, about 430 xp a member: trimmed from two groups and a warden of three, which
   paid about 760, so that a small Rift costs the area about 450 a member and B5's two can follow
   it. The tide elder is placed here first, off #190's list of monsters owed a map, as the Tide
   Stone's Rifts' own (MONSTERS §2.1). Its hoard holds no shard, so the barge's is the first the
   company can hold; the brine tear's words, which show a shard beside it, are the material's
   (`src/content/rifts/materials.ts`), for the owner.
6. **The Rift goes quiet when its warden falls,** as Thornmark's tear does; the Stone home is a flag
   nothing sets until #191, which adds it.
7. **The shard is the Brine Shard,** the fen's own word for it.
8. **The hermit sits on D5's islet,** reached over a shingle bar, and points up the spur to Rietum.

Decided by delegate for #173, each the owner's to overturn:

1. **The band is 11–12,** not the brief's 11: the floor stays 11, and the top meets B6's so the
   box's bull toads and tide elders sit in it.
2. **The hint is the landing's pole-marks,** always there, and one plank among them unscored and
   new-nailed; the priest at Rietum's line about a pole's mark is #172's to add.
3. **The shard is a Brine Shard,** as C5's: a chip of the Stone would be an item with no use until
   #191, and would say the plinth takes it.
4. **Every fight is a real one at 11,** and B5 is built at about 1,600 over its share of 1,000
   (§8): two groups of five fen toads, two bull toads and two tide elders at each Rift's heart,
   each inside the gate's aim or, for the Rifts, a quarter of a fight under it (5.4 to its 5.75) and
   inside its limit. A lone bull toad or tide elder was eighteen to twenty fights to a rest at 11,
   no fight at all, and a tide elder with three brinelings reached the band's top only by averaging.
   No other box's share is cut: a fight at 11 costs about 300 a member in any box, so a cut would
   balance only on paper, and C6 is being built against its 700.
5. **No leeches:** the pools are C5's fight, and the toads are B5's new family.
6. **The Rifts are #165's cells and breach,** each its warden alone and closed `until` it falls; the
   Stone home is #191's. The north Rift was the spiral while it held a room group, which the cells
   put behind the warden.
7. **No camp:** the brief has none, and C5's is the next box.

## 10. Names

Saltreach's naming pass, by the rules of `docs/NAMES.md`: the Tidefolk's tongue was left to it
(NAMES §2), and *salt* ran through five names (Saltreach, Saltmouth, the Saltings, the Salt Gulf and
the salt pans), as Harrow ran through the Foreland's (NAMES §3). Filed as #152.

- **The tongue.** The Tidefolk are the sea people of the delta, who build on mounds above the
  flood, swim like otters and sing to a drowned god (STORY). Their names are Frisian in shape, the
  tongue of the low coast of dykes and tidal flats, beside the Foreland's English and the elves'
  Cornish: short parts, spelled as they are said, with no accent the font lacks. *Wierde* a mound
  above the flood, *-um* home, *riet* reed, *syl* a sluice or a way through the dyke, *diep* a
  channel, *skor* salt marsh, *wad* tidal flat, *meer* a broad water, *stien* stone, *hol* a hollow
  or a cave, *sjong* song, *tel* count, *dyk* dyke, *sâlt* salt (written *salt*). It goes into NAMES
  §2's row for the Tidefolk.
- **The names:**

  | Was | Now | What it means | Also thought of |
  |---|---|---|---|
  | Reedholm | Rietum | the reed home: the village on its mound among the reeds | Rietwierde, the reed mound |
  | the Wind Cave | Sjonghol | the singing hollow: the cave in the cliff that sings in the wind, where the Monk's trainer sits | Wynhol, the wind hollow, which is Wind Cave again |
  | the Salt Gulf | Sylmeer | the sluice water: the broad water the Long Water drains through | the Gulf, kept |
  | the plinth's island, unnamed | Stienwierde | the stone mound: the island the Tide Stone stood on | Telwierde, the counting mound |
  | Smugglers' Cove (Wrackholm) | Kelp Hole | a sea cave with kelp on its rocks, in the sailors' English that named Brandy Hole and Wrackholm | Otter Hole |

- **Kept:** Saltreach and Saltmouth, the Crown's names for the area and the free port, which the
  story leans on; the Saltings, the salters' English for their marsh, since three names with *salt*
  is the light and its headland, not Harrow's five; the salt pans, a thing and not a name, the
  salters' plain word for their flats, lettered nowhere on the map; the Drowned Temples and the Tide
  Stone, plain names for plain things, as the Grove and the Grove Stone are; the Long Water, which the Tidefolk
  call the Diep in their own speech and nowhere on the map; the Upper Water and the Delta, the
  zones; the Scarp and Kestrel Edge, the Foreland folk's; Wrackholm and the Tide Ship, the sailors'.
- **The god** has no name yet; the Tidefolk say *the one who counts* until its Stone is home. It
  is named, if at all, with the temples (#175).
- **Ids stay:** `reedholm` is nowhere yet, so Rietum's id is its own; the rest keep the plan's.

## 11. What was cut

- **The rim and the A column,** A2 to A7: 2,890 squares of land, 1,486 a company could walk, most
  of it mountain and hill under the rim with the fen's west edge below. The maps of the B column
  end in it.
- **The upper valley,** B2 and C2: 1,492 squares, 862 walkable, the Long Water's first miles
  between hill and mountain to the rim, with nothing on the atlas or in the docs. It comes back as
  country if the act plays short.
- **The Scarp's foot,** B7 and A7: 970 squares, most of them the escarpment's face and the mountain
  behind it; the Scarp stair's foot is C7's.
- **The slivers** in the Foreland's boxes and the gulf: D3 and D4 (the cliff's foot, which D4 takes
  as the Foreland's, docs/areas/shelf.md §1); D6 (45, the plate's old place) and C1 (33 of
  mountain). D5, the shore under the Edge, is laid with C5 (#170) to carry the Salt Road into it.

About 5,700 squares in all, to come back as country only if the act plays short.
