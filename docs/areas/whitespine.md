# The Whitespine: step IX of the road, the range the bells ring over

The ninth step of the road of levels (DESIGN §9, EXPANSION §2.2), band 22–24, and the first of
Act IV, Beyond the Sky: the great southern range south of Rimewater's lakes, with the Peak Stone
whole on its crest and the monastery, Highcell (the Monastery), kept by monks who died long ago;
Sheer Point, the finger of land toward the Hearth where the Ashen Hand builds its causeway of stolen
shards; and the Giants' Stair, the road through the Sheer and down into Ashfall, where the giants
take their toll. This is its area doc (EXPANSION §4, §6 and §8.2): where the atlas puts it, what
is in it, the plan for building it, box by box, and the briefs. Its work is filed under #445 (Phase
1.4, #441): the boxes as §4's table has them, Highcell (#500), its chapter (#505), its side quests
(#506), its eight drawings (#507) and the country behind (#508, parked); this doc is #498 and Act
IV's systems are #442's (§3). Figures are measured on main at `6032251` (2 October 2026) with
`worldGrid` (`src/game/atlas.ts`).

Its first three boxes are built, J11, Monks' Vale (#499, §4.2), which lists the area, I11, the
Peak Stone's (#501, §4.4) and I10, Stairwatch and the Stair's head (#502, §4.5), and so is
Highcell, the dungeon through J11's gate (#500, §4.3); its eight monsters are drawn (§3), and the
rest is to build. Its content is
`src/content/areas/whitespine/` (maps, monsters, items, climate, its part of the world map and its
walkthrough; its chapter of the one quest, The Bells, in `chapter.ts`, and its side quests in
`quests.ts`, to come); it has no town, so no rooms. Its ids: the area `whitespine`, its zones
`monksvale`, `highspine` and `sheerpoint`, the dungeon `monastery` and `monastery2` (the ids stay
under the new name, §10).

---

## 1. Where it is

The atlas (`src/content/areas/whitespine/atlas.ts`, the area's own since #499, §3) makes the
Whitespine three zones:

| Zone | Band | Squares | Built |
|---|---|---|---|
| Monks' Vale | 22–23 | 3,402 | J11 |
| The High Spine | 23–24 | 3,118 | I11, I10 |
| Sheer Point | 23–24 | 1,396 | none |
| The area | 22–24 | 7,916 | J11, I11, I10 |

Squares are land without shallows or rivers. The area is about 7.7 zone maps (EXPANSION §1 has
7.7), and only 3,961 of its squares a company could walk: more than half of it is mountain and peak
(Monks' Vale mountain 1,316, pine 904, hills 448, peak 400, grass 334; the High Spine pine 1,559,
mountain 955, peak 395, cliff 105, hills 62; Sheer Point mountain 457, pine 446, peak 320, hills
134). It runs from the Sheer at x 264 east under Coldmere's pass, and from the Point's tip at about
y 226 south to y 372, where the range runs on. The zones' bands are the folder's: the atlas gives the
area 22–24 and the boxes rise through it (§4).

The squares are the plan's, before any box. J11 (#499), laid whole in Monks' Vale, takes the 110
squares of the High Spine on its crest with it, as a map laid in one zone does (§4, §9). I11 (#501),
laid whole in the High Spine, takes 154 of Monks' Vale's on its crest and 187 of Ashfall's under the
Sheer. I10 (#502), laid whole in the High Spine, takes 31 of Loch Fuar's at its north-east corner,
all peak and mountain, and 3 of Cindercoast's, the cliff at its north-west corner. Laying Highcell
(#500) moves no square: its two plates, at 322,346 and 322,352, are places on the atlas, which the
grid does not read.

**The grid** (EXPANSION §8.2; docs/areas/shelf.md §1). The Whitespine is the I and J columns from
row 8 to row 12, with K11 and K12 holding Monks' Vale's east under the pass. The land worth a map is
eight boxes: J11, the Vale and the monastery; I11, the Stone's; I10, the Stair's head; I9 and I8,
the ridge and the Point; behind them J10, I12 and J12. K11 and K12 are cut (§11).

Its edges:

- **North: the sea,** off Sheer Point's tip, with the Hearth beyond it at 256,174 so near its heat
  is felt (STORY, Act Four). The Point's shallows are I8's (86) and I9's (11).
- **East: Coldmere,** Rimewater's frozen lake (20–22, Act III). The high pass comes over from K10
  at 334,302 and down to J11's north edge at 318,318 (`src/content/atlas.ts`), the one way in from
  the road behind, open from the start (EXPANSION §2.2: the atlas's "Mountaineer" road became a road
  through the range). Rimewater's pass box is #491; the pass is taken, K10's saddle at 328,305 onto
  J11's 20,1 at 316,319 (#499, §4.2).
- **West: the Sheer,** the cliff down the range's west side at x 264–272 from y 272 to y 372,
  walling Ashfall (24–26) off; the Giants' Stair is the road through it, from the head at 272,306
  in I10 to Ashfall's H10 at 258,306 (`src/content/atlas.ts`; #510 built the foot). North of the
  Sheer the Point's west side falls to the sea, Cindercoast across it.
- **South: the range,** on through I12 and J12 to the rim: country behind, parked (#508).

The great spine runs north to south at x 282–304 with snow on it the year round, Spine Summit on
it at 300,328 and the Peak Stone at its foot at 292,318. The ridge trail from the Stone north along
the crest to Sheer Point is new on the atlas (#443, call 3): 292,318 to 286,300, 282,280, 284,262
and 286,236, open from the start. Today's atlas reads Monks' Vale as a dead end (EXPANSION §5.8),
since its border with the High Spine is the crest; J11 and I11 build the way over it.

`node tools/worldmap.ts out.png --zones` paints it.

## 2. What it is for

The first half of Act IV (DESIGN §9): *what is Caldera?* The Peak Stone is whole, the only whole
Stone the company stands beside between the Lodestone and the end, so nothing here is a Rift
(MONSTERS §2.1): the danger is the mountain, the giants and the monastery. The monks died long ago,
and the Custodian's hands keep their hours in their robes: they walk like the keepers of the bay,
speak the dwarves' old script to each other and do not bleed, and the Hearth's light passes through
them (MONSTERS §8.1). Their bells ring the eleven of Crowness Light's log, the Hearth's pulse, rung
by a machine that was told to ring them and never told to stop. On Sheer Point the Hand builds its
road out over the water, every stone a stolen shard, and takes Wenna out along it in the night
(DESIGN §9, the captain's line). The Giants' Stair is the road over the range and down into Ashfall,
and its toll is the second choice put before a fight (#544), after Thornmark's ogre's bargain
(#645). Four of the third prestiges' places lie here and are built with it (#448): Stairwatch,
Spine Summit, Rook's Nest and the bell tower.

Nothing trains or sells here (#443, call 7): Rime Lodge teaches to 23 behind and Cinderport to 27
ahead, so a company carries what it has over the range. The weather is the range's: snow on the
crest the year round, wind, cloud below the peaks; clear and bitter at night.

## 3. What is built

Three boxes and a dungeon, J11, the area's first, which lists the area (#499), Highcell, through
its gate (#500), I11 (#501) and I10 (#502):

- **Monks' Vale** (J11, `monksvale_j11`, core, band 22–23; #499): the pass's road down from K10's
  saddle, which is taken and not walked, over the north edge, then square to square through the
  hills and the vale's grass to the gate in the monastery's wall on its shelf, open now on Highcell
  (§4.3). At the pass's foot the bells first heard and a cairn; by the road the monks'
  shrine, its bell on a post with no rope, and east of it the pilgrims' hostel, kept wrongly, the
  blankets under the beds and a bowl of snow by each. On the west the crest under its snow and a
  path up it in steps to Spine Summit, a camp, with the hermit beside it; at the vale's east edge
  the herder at his fold. The monastery is a block of building squares on its shelf, with two bell
  towers over its wall and a camp in the shelf's lee; behind the wall the snow is trodden in one
  line west to the rock, a brother walking it by night; in the rock, the store (§4.2). Five groups:
  brothers at the pass's foot and on the road to the gate, spine eagles either side of the road and
  snow trolls at the far end of the summit's path.
- **Highcell** (`monastery` and `monastery2`, dungeon, two levels of 16 by 16, band 22–24; #500): in
  at the gate in J11's wall, open now, past the brother standing in it, onto a cloister swept bare
  round a garth of snow with its well, the bucket dry. By the refectory door a board of the hours in
  the old script; in the refectory the tables laid and every bowl empty; along the east walk the
  cells, a brother standing in each, and the Novice in the last. At the south walk's west end the
  bell tower's foot and its stair winding up to the bells, where the ringers ring the eleven and one
  pulls a beat behind the rest; at its east end the night stair down. Brothers keep the hours by the
  cells and ringers come down the tower's stair. Below, the chapter house, a vault on four columns,
  with brothers before two bell-ringers and, at the far end on a seat of stone, the Abbot, a boss
  that does not come back. Behind the seat, found from it, the undercroft: the monks of Highcell in
  their niches, every niche full, the last cut with a count, and their things laid by (§4.3).
- **The Peak Stone's box** (I11, `highspine_i11`, core, band 22–23; #501): over the crest from
  Monks' Vale, J11's summit path going on west in the snow to the snow line, with the pines below it
  and a camp, the last pines, under it. At the north edge the Peak Stone, whole, in a ring of bare
  stone, a brother standing at it, the monks' shrine at its foot and the cairn where the ridge trail
  leaves north; one slab in the ring lifts, over a hollow with the Lanterns' survey marker, lit, and
  a chest (§4.4). Up a spur off the crest path the eagles' nest, with a Lantern's badge among the
  bones. On the west the Sheer, a cliff, a lookout at its top over Ashfall and Fire Mountain, and at
  its foot Ashfall's own grey pines, reached by a climb down. Four groups: spine eagles at the nest
  and over the snow line, brothers on the snow line between the crest path and the Stone and snow
  trolls in the snow at the crest's foot. The Stone counts for the Hearth once stood at (§9, #501's 5).
- **Stairwatch and the Stair's head** (I10, `highspine_i10`, core, band 22–24; #502): up the ridge
  trail from the Stone and on north through the pines, then a road west off it to the Stair's head,
  cut stone at the top of the Stair, where the road goes down through the Sheer to the west edge and
  on down onto Ashfall's H10 (#510).
  Short of the head the road runs past a caravan drawn up and through the Stair in snow, a giant and
  a snow troll in a drift; at the head are a toll-stone and a shrine older than the monks'. The
  Stair-king keeps the top step from his seat of rock, with two giants, and holds out his hand: the
  toll is gold, a grey part or a faceless coin, or the fight (§4.5). Under the seat, walled in rock,
  his hoard. South of the head, in the rock, Stairwatch: a chimney found off the pines climbs to a
  ledge over the Stair, where an old champion keeps his watch. Three groups: spine eagles in the
  pines nearest the way in, the Stair in snow and the king's.

Its atlas rows are charted in `src/content/areas/whitespine/atlas.ts` (#498), the area's own `atlas`
since J11 lists the area; until then `src/content/atlas.ts` spread them into the plan where its rows
were, as Saltreach's was before #170: the zones with their bands (Monks' Vale 22–23, with J11 laid
on it and its crossing line said in its own words, §4.2; the High Spine 23–24, with I11 and I10 laid
on it and its crossing line said in its own words, §4.4; Sheer Point 23–24), Highcell's two plates,
`monastery` at 322,346 and `monastery2` at 322,352 (the first moved from K12's, §9), its sites
(Highcell at J11's gate, 322,342, the Peak Stone, Stairwatch, Spine Summit, Rook's Nest and the
Giants, its own; the Sheer, the plan's, §10) and its links: the pass in, the monastery's way in, the
Giants' Stair and the ridge trail (#443, call 3). Spine Summit is a camp now, the Peak Stone a
stone, Highcell built and Stairwatch a ledge, none planned any more (§9, #499's 12; #500's 1;
#501's 16; #502's 11).

Its ground (#543): peaks (`A`) and cliffs (`|`), the mountain's rock to walk into, see and climb,
with the road through them plain road, so the scaffold drafts each box square for square (J11's 202
peaks, I11's 48 peaks and 64 cliffs) and the view draws a summit and a face (docs/SLICE.md).

Its row on the curve is in (#542), in `src/content/progression.ts`: band 22–24, next 24, window
5,000, owed to #445 while the area is built box by box, with 13,525 xp a member and 3,520 gold in
the boxes built, J11's 2,791 and 700, Highcell's 4,183 and 600, I11's 2,355 and 300 and I10's 4,197
and 1,920 (§8). It has no step on the gear ladder, no town to sell one: Rime Lodge's rung is the
pass's, and Cinderport's step (docs/areas/ashfall.md §4.4) comes two levels on; J11's store holds a
second of Rimewater's Guide's Staff +1 (§4.2), Highcell's undercroft an Ice Axe +1 and a Skinning
Knife +1 (§4.3) and I10's hoard a Bear Spear +1, Rimewater's rung (§4.5). The systems
it waits on are the rest of
#442's: the toll (#544), sweep (#545), stone (#546), the crossings (#547), the Ember Stone (#548)
and the bot (#549).

The monks are drawn (#507), three of MONSTERS §8.1's eight, ahead of the boxes that place them: the
Brother, the Bell-ringer and the Abbot, robed on the keepers' frame (`src/ui/monsters/keepers.ts`).
Their defs are in `src/content/areas/whitespine/monsters.ts`, the area's own since J11 lists it
(`AHEAD`, `src/content/index.ts`, listed them until then), and each was owed in `UNPLACED`
(`tools/tests/maps.ts`) to the issue that places it: J11 places the Brother (#499) and Highcell the
Bell-ringer and the Abbot (#500), so that none of the monks is owed now. §9 has the decisions, the
Abbot's tuned def among them (#500's 6).

Three more on frames that exist are drawn (#507), the Spine Eagle on the birds', the Snow Troll on
the ogre's and the Ashen Mason on the cultists', in the same file, each owed in `UNPLACED` to the
first box whose brief places it (§4): J11 places the eagles and the troll (#499); the masons are
owed to I8 (#504). §9 has the decisions.

The giants are drawn (#507), a new family on a frame of their own (`src/ui/monsters/giants.ts`): the
Stair Giant and the Stair-king. Their defs are with the monks', and I10 places both (#502, §4.5), so
that neither is owed in `UNPLACED` now; both sweep the front row a turn in four, the giant set to
its line and the king by his gate (§9, #502's 2 and 3). §9 has the decisions.

## 4. What is still to build

All of it but J11, Highcell, I11 and I10, built (#499, §4.2; #500, §4.3; #501, §4.4; #502, §4.5):
7,916 squares of land, 3,961 of them walkable, the plan's figures (§1). On the grid the plan is
eight boxes and a dungeon, five boxes on the road and three behind; the five hold 5,138 of those
squares, 2,199 of them walkable:

| Box | Name | Zone | Kind | Band | Land | What is there | Its step of the quest | Issue |
|---|---|---|---|---|---|---|---|---|
| J11 | Monks' Vale | Monks' Vale, the High Spine | core | 22–23 | 1,024 (mountain 342, hills 264, grass 214, peak 202) | the pass's foot at 318,318; Highcell's gate at 322,342; Spine Summit at 300,328; the herder | the bells; the monastery | #499 |
| | Highcell | | dungeon, two levels of 16×16 | 22–24 | | the cloister and the cells; the bell tower; the chapter house and the Abbot; the undercroft behind the seat | | #500 |
| I11 | The Peak Stone's box | the High Spine | core | 22–23 | 837 (pine 536, mountain 210, peak 48, cliff 42) | the Peak Stone at 292,318, whole; the ridge trail's foot; the eagles' nest | none | #501 |
| I10 | Stairwatch and the Stair's head | the High Spine | core | 22–24 | 961 (pine 665, mountain 194, peak 85, cliff 17) | the Stair's head at 272,306 and the toll; the Stair-king; Stairwatch at 270,312 | the Stair and its toll | #502 |
| I9 | The ridge north | Sheer Point | country | 23 | 774 (pine 357, mountain 205, peak 204), 11 shallow | the ridge trail along the crest; snow trolls; the Hearth seen | none | #503 |
| I8 | Sheer Point | Sheer Point | core | 24 | 542 (mountain 261, hills 134, peak 122, pine 17), 86 shallow | the causeway; the Hand's camp and Wenna; Rook's Nest at 286,230 | the causeway; Wenna taken | #504 |
| J10, I12, J12 | The country behind | Monks' Vale, the High Spine | country, behind the road | 23–24 | 875, 959 and 937 | the giants' ground above the Stair at 300,296; the range running on south | none | #508 |

The core is the four boxes the owner's plan names (J11, I10 and I8, which hold a step, and I11,
which holds the Stone), built at full density; the rest is country, built to the looser floor with
the wilderness features (EXPANSION §2.1 (b) and §5.3, #45). I9 is built with the act, the only
country between the Stone and the Point; the country behind is parked until the owner has played it
(#443, call 9). The bands rise from the way in, 22 at the pass's foot, to 24 at the Abbot, the
Stair-king and the causeway, as the gate asks (EXPANSION §5.2), and each box holds a group at the
top of its band for the curve.

**Three boxes hold land of more than one zone.** J11 is Monks' Vale with 110 squares of the High
Spine on its crest, I10 is the High Spine's 990 squares with 31 of Loch Fuar's in its north-east
corner and 3 of Cindercoast's in its north-west, none of them walked, and I11 is the High Spine with
154 of Monks' Vale on its crest and, under the Sheer, 187 of Ashfall's. A map is its whole box
(EXPANSION §8.2), so each is built to its edges and the zone line runs inside it; the zone a square
belongs to decides only its crossing line (#166) and its band. Each is laid in its larger zone
(§9); J11 is, in Monks' Vale (#499), I11 in the High Spine (#501) and I10 in the High Spine (#502).

**The order** is the road's, and the quest's: J11, the only box that meets Coldmere's pass, and
Highcell behind its gate; I11, over the crest to the Stone; I10, the Stair's head, where the road
goes down; I9 and I8, north along the ridge to the Point. Building waits on #442's systems (§3) and
on the two-areas rule (EXPANSION §3); the briefs and the drawings do not (#445).

The places, as the atlas and the docs have them:

| Place | Box | What the docs say | On the atlas |
|---|---|---|---|
| Highcell (the Monastery) | J11, and below | the monks died long ago and the Custodian's hands keep the monastery in their robes; its bells ring the eleven (DESIGN §9, STORY); the chapter house and the Abbot (MONSTERS §8.1); the Bard's third prestige in its bell tower (DESIGN §5); the Novice (#56's 45) | a site at the gate, 322,342, and two plates, 322,346 and 322,352, the first moved from 330,356 |
| The Peak Stone | I11 | whole: the Whitespine has no Rifts (MONSTERS §2.1); a Lantern came to survey it and never came down (#56's 46) | a stone at 292,318, no longer planned (#501) |
| Spine Summit | J11 | the Monk's third prestige: the hermit's vigil through a night (DESIGN §5, #448) | a camp at 300,328 |
| The Giants' Stair | I10, and Ashfall's H10 | the road over the range and down, past the giants who gave it its name (DESIGN §9); the toll (MONSTERS §8.1, #544); the Stair-king; the caravan that cannot pay (#56's 47) | a road link, 272,306 to 258,306 |
| Stairwatch | I10 | the Knight's third prestige: a ledge above the Stair, its way up found off the Stair (DESIGN §5, #448) | a tower at 270,312 |
| Sheer Point | I8 | the Hand's causeway of stolen shards; Wenna taken (DESIGN §9, STORY); the masons (MONSTERS §8.1); the mason's tally (#56's 48) | the zone, its tip at about y 226 |
| Rook's Nest | I8 | the Thief's third prestige: a hide over the causeway, and the Dead-Drop's orders (DESIGN §5, §10.2, #448, #22) | a cave at 286,230 |
| The Giants | J10 | the giants' own ground above the Stair (#443, call 1) | a label at 300,296; the Sheer lettered at 262,300 |

### 4.1 The briefs

Each box's brief is what EXPANSION §8.2 asks of one: its purpose, band, landmarks, the secret and
its hint, the encounters and what is new, with its points of interest and a first share of the pay
beside them. They are drafts for the owner, written before Act IV's first box is built; each is
settled in its issue.

- **Points of interest** (EXPANSION §5.3). A core box is held to the Foreland map's density, about
  nine features, ten groups and four ways in or out to 870 open squares, scaled to the open squares
  the mountain leaves it; a country box has about half, with the wilderness features (#45). No more
  than one point in four is a sign.
- **Encounters** are MONSTERS §8.1's roster and fights. A group is about one of MONSTERS §4.4's
  standard encounters, and a kill pays each member by the monster's level against theirs (#159),
  so the figures below are for a company at the box's band. At 22 a company fights nine or ten
  standard encounters between rests (EXPANSION §5.2).
- **Pay.** The area owes 17,867 xp a member (§8). The shares below are a first cut, and §8 says
  how they stand against the curve.
- **Side quests** are #56's 45 to 48, placed as §6 has them (#506).
- **Finds.** No step of the gear ladder is here (#542): Rime Lodge's rung is behind and
  Cinderport's ahead, so the boxes place gold, potions and a plus or two on Rimewater's rung, each
  inside the band's price window of 5,000. **Lines** are drafts, two to an event (DESIGN §11).

### 4.2 J11, Monks' Vale (#499): core, band 22–23

- **Purpose.** The first box below the pass, and Act IV's first ground: the vale under the crest
  with the monastery on its shelf, the bells heard across the snow before it is seen, the area's
  gentlest groups and the crossing line that tells a company under the band how the range feels
  (#166). Monks' Vale's step of the quest (§5).
- **Landmarks.** The pass's road down from the north edge at 318,318 through hills and grass to
  Highcell's gate at 322,342, the way into #500; the monastery on its shelf against the mountain,
  drawn tall over its square as a landmark is; the crest along the box's west with the snow on it,
  and the path up to Spine Summit at 300,328; the herder's fold at the vale's edge.
- **Points of interest,** about eight features and six groups:
  - the gate, and the brother at it: the step (§5);
  - the bells, heard from the pass's foot: an event on the road, the step's first line;
  - the summit's path, and the hermit at Spine Summit, the Monk's third (#448);
  - the herder, who loses lambs to the eagles (#56's 46);
  - a camp in the lee of the shelf, a cairn at the pass's foot and a shrine by the road, the
    monks', its bell on a post with no rope (#45).
- **Encounters.** Brothers walking the road to the gate (two groups, the gentlest at the pass's
  foot: MONSTERS §8.1's soldier, which a company that fought the bay's keepers knows the walk of);
  spine eagles over the hills; a snow troll in the snow on the summit's path, the box's hardest, at
  the far end from the pass.
- **Quests.** The step. The Eagles' Nest begins here (§6). The Monk's third prestige's quest (#448).
- **The secret and its hint.** Behind the shelf the brothers' path runs on past the monastery's
  wall to a blank face of rock, and the rock opens: a store cut into the mountain, the robes of
  Highcell folded on shelves by the dozen, and the gear of the monks who wore them first. Found,
  never told. The hint: the snow behind the wall is trodden in one straight line to the rock face,
  and no print turns off it; by night a brother is seen walking it.
- **Lines:**
  - the bells: *Across the snow, bells. Eleven, with gaps between, and then eleven again.*
  - the gate, the step: *The gate stands open. A brother at it bows, and the bow is a shape
    someone described to it.*
- **New here.** Peaks underfoot and the road through them (#543); a machine in a robe; the bells.
- **Finds.** A plus on Rimewater's rung in the store, and 400 gold.
- **Pay.** About 1,800 xp a member.
- **As built** (#499, 9 October): the brief's places, with five groups for its six, laid whole in
  Monks' Vale at band 22–23 (§1). The pass is taken, not walked (§9, #499's 3): K10's saddle at 0,19
  (328,305) lands on the road at 20,1 facing south, with *Over the saddle of the pass and down the
  far side.*, and the road's first square, 20,0 (316,318), leads back up to K10's 1,19 facing north,
  with *Back up over the pass to the cold loch.* K10's milestone still reads MONKS' VALE 6, counted
  now along this road. Going over, a company hears *Monks' Vale.* after the saddle's line and, two
  under the floor, in the range's own words on its atlas row, *The range begins here, and it is
  harder than the lochs behind.* (three under, *The range, and nothing in it would spare you. The
  way back over the pass is still open.*); going back it hears the climb's line alone (§9, #499's
  4). The road runs square to square from 20,0 to the gate's front at 26,23, four squares added at
  its diagonal steps (§9, #499's 2). The south and east edges end the world against J12 and K11,
  pinned in `tools/tests/outdoors.ts` with void past them; the west edge is I11's now (§4.4). Down
  off the pass the bells
  (`j11_bells`, 19,2) and, at 17,4, a cairn with 300 gold and a Sapphire Vial. By the road the
  monks' shrine at 21,10 (personality), and east of it the pilgrims' hostel, a building of 2 by 2 at
  24 to 25, 12 to 13, its event at the front, 23,13 (§9, #499's 14). West, snow lying in drifts
  along the crest's foot, a path up it into the snow at 13,12 and Spine Summit at 4,10, a camp, with
  the hermit at 3,10, words only (§9, #499's 12); at the vale's east edge the herder at 27,19, words
  only, and his fold, a ring of rock at 28 to 30, 18 to 20 (§9, #499's 13). The monastery fills rows
  24 to 28 and columns 20 to 29 of its shelf, with two bell towers over its wall (29,22) and the
  camp in the shelf's lee at 21,23; its gate at 26,24, the brother standing in it as the brief's
  line has it, was barred until #500 and is the way into Highcell now (§4.3; §9, #499's 5 to 7,
  #500's 8). Five groups: brothers, 3, at the
  pass's foot, 19,6, the gentlest; spine eagles, 4, west of the road at 15,9 and 4 east of it at
  25,8; brothers, 4, on the road to the gate, 23,19; and two snow trolls at the far end of the
  summit's path, 6,10, who do not roam, the box's hardest at 23 (§9, #499's 8). The store is cut
  into rock, not mountain, so a Mountaineer's climb does not reach it: the secret door at 16,29 is
  drawn as rock, the blank face, and behind it at 14,29 and 15,29 are the robes of Highcell folded
  by the dozen and the chest, 400 gold and a second Guide's Staff +1 (`guides_staff+1`, Rimewater's
  rung). The hint is the trodden line, row 29's snow from 29,29 west to the rock (`j11_trodden`),
  and by night a brother walking it (`j11_walker`) (§9, #499's 10 and 11). The cairn and the store
  hold 700 gold between them. It departs from the brief in the monastery, a block of building
  squares and not drawn tall over one square (§11); in the gate, barred until #500 opened it; and
  in the hostel, which is only kept wrongly where the issue made its cellar the secret (§11). The
  step is owed to the chapter (#505), the Eagles' Nest to #506 and the hermit's vigil to #448 (§9,
  #499's 16).
  - **Measured.** A company at 22 wins every fight and manages 10.50 fights to a rest, the aim's
    top, with 15% of its days ending in a fight broken off; it walks Monks' Vale's road, past the
    brothers at the pass's foot and on the road, every time. J11 pays 2,791 xp a member and 700
    gold. Two under, at 20, it wins every fight too, owed to #18 as Rimewater's boxes' is. Density
    99.1% within 8 steps (418 of 422, with the three squares I11 opened) and the furthest 9, with
    no sign among its 22 points. It claims peaks underfoot as new (§7).

### 4.3 Highcell (#500): dungeon, two levels of 16×16, band 22–24

- **Purpose.** The area's dungeon: a monastery still kept, four hundred years after its monks died,
  by the Custodian's hands in their robes (MONSTERS §8.1). It sells and teaches nothing (#443,
  call 7): its brothers are machines, and the one living man in it hides.
- **Landmarks.** The upper house: the cloister, the cells each with its brother at its hours, the
  refectory with nothing eaten in it, the Novice's cell (#56's 45) and the bell tower's foot, with
  the stair up to the bells and the Laureate hiding among the ringers, the Bard's third (#448). The
  lower house: the chapter house, where the Abbot keeps the hours, and the undercroft behind it.
- **Points of interest,** about seven features and eight groups a level, as the Foreland's
  dungeons are held: the well, the cells, the board, the tower's stair, the seat, the niches.
- **Encounters.** Brothers in the cloister and the cells; the chapter house, brothers in front of
  two bell-ringers, the bells holding the front row while the brothers close, and the cleric's
  light doing nothing (MONSTERS §8.1's first fight); the Abbot, boss, level 24, whose robe falls
  open as it falls.
- **Quests.** The step (§5). The Novice (§6). The Bard's third prestige's quest, sung in the tower
  (#448).
- **The secret and its hint.** The undercroft under the chapter house, through the wall behind the
  Abbot's seat: the monks of Highcell in their niches, one to a niche, every niche filled and the
  last one's lip cut with a tally in Kiln-script, which a dwarf or a Linguist reads as a count that
  ends on eleven. The hint: the Abbot's seat stands a hand off the place its feet have worn in the
  floor.
- **Lines:**
  - the cells: *A brother in each cell, standing. Not one of them is praying.*
  - the undercroft: *Every niche is full. The last is cut with a count, and the count ends on
    eleven.*
- **New here.** A caster whose spell is a bell (paralysis, 0.2); holy light that does nothing; a
  house still kept by what killed nobody.
- **Finds.** Two of Rimewater's rung with a plus in the undercroft (#542), and 600 gold.
- **Pay.** About 2,600 xp a member.
- **As built** (#500, 9 October): two levels of 16 by 16, hand-built, the upper house at band 22–24
  (the area's floor, the brief's 23 less one) and the lower at 23–24 (§9, #500's 2). **The upper
  house** (`monastery`): J11's gate, open now (§4.2), lets a company in to 7,1 facing south, past
  the brother in it, and lets it out onto the road's end before the gate, facing north. Inside the
  wall, at 7,2, a cloister swept bare round a garth of snow, with the well (8,6), its bucket dry. By
  the refectory door (5,4) a board of the hours in the old script, which marks nothing (§9, #500's
  13); in the refectory (2,5) the tables laid and every bowl empty. Along the east walk the cells, a
  brother standing in each (11,5), and three brothers keeping the hours before them (11,7); in the
  last cell the Novice (14,9), words only. At the south walk's west end the bell tower's foot (3,11)
  and its stair winding up (1,13); under the bells (4,13) the ringers at their ropes, the bells
  ringing eleven, a gap, eleven, each time a company comes by, and one who pulls a beat behind the
  rest (6,14), thin, in a robe that is not his, words only: the Laureate. Four bell-ringers come
  down the stair (1,12). At the walk's east end the night stair goes down (12,12; the way down is
  13,13). **The lower house** (`monastery2`): the night stair comes down to 7,1 facing south, and
  the way up lands on the cloister's 12,13 facing west. It opens at 7,3 on the chapter house,
  benches round its walls under a vault on four columns; brothers stand in front of two
  bell-ringers (7,6), and at the far end on a seat cut from one stone the Abbot keeps the hours
  (7,9): level 24, 1,700 hit points, 19d8+16, a boss that does not come back. When it falls its robe
  falls open on grey plate and the bells overhead ring the hour all the same. The hint is the seat
  (7,10), which stands a hand off the hollows its feet have worn in the floor. The secret, searched
  for at the seat, is the wall behind it (7,11), which gives on the undercroft, two rows of rock (12
  and 13): niches cut down both walls, a monk of Highcell laid in each and every niche full (7,12),
  and the last niche's lip cut with marks in the old script (13,12), a count that ends on eleven,
  which a dwarf or a Linguist reads (§9, #500's 14). At the far end the monks' things (2,13) in a
  chest: 600 gold, an Ice Axe +1 and a Skinning Knife +1.
  - **Seams.** J11's gate, 26,24 (322,342), to `monastery` 7,1 facing south, and back from 7,1 to
    J11's 26,23 facing north; the night stair, 13,13, to `monastery2` 7,1 facing south, and back
    from 7,1 to 12,13 facing west. The secret wall is 7,11. There is no other way in or out.
  - **Measured.** A company at 22 wins every fight in the upper house and manages 11.80 fights to a
    rest, over the aim (8.5 to 10.5) and inside the limit (7 to 13), with 5% of its days ending in a
    fight broken off; two under, at 20, it wins every fight too, owed to #18. In the lower house a
    company at 23 wins 83% of the fights, the Abbot counted, off the aim of 90% and inside the limit
    of 80%; it manages 10.99 fights to a rest, a little over the aim (8.75 to 10.75) and inside the
    limit (7.25 to 13.25), with 3.7% of its days broken off, and the Abbot is won 66% at 23 and 93%
    at 25, set off the boss line (§9, #500's 6). Highcell pays 4,183 xp a member for the brief's
    2,600 and holds 600 gold. Density 100.0% within 7 steps on both levels, the furthest 5 on both,
    with one sign among their 15 and 9 points. The curve's rank correlation is 1.00 on both: in the
    upper house the brothers nearest at 10 steps, level 22, and the ringers on the stair the hardest
    at 17, level 23; in the lower the chapter house nearest at 5, level 22.5, and the Abbot the
    hardest at 8, level 24.

### 4.4 I11, the Peak Stone's box (#501): core, band 22–23

- **Purpose.** The High Spine's first box: over the crest from the Vale into the pines, and the
  Peak Stone on the crest at 292,318, whole and steady, the first whole Stone since the Lodestone.
  The ridge trail north begins here (#443, call 3).
- **Landmarks.** The Stone at the box's north edge on the crest, its light steady; the snow line
  across the box, pine below and bare rock above; the Sheer's cliff along the west edge, with a
  lookout over Ashfall where Fire Mountain smokes; the eagles' nest in the peaks above the Stone
  (#56's 46); the ridge trail leaving north for I10 at 286,300.
- **Points of interest,** about eight features and six groups:
  - the Stone, and the brothers who keep it;
  - the nest, and what is in it (§6);
  - the lookout west, the far side seen;
  - a camp under the snow line, a cairn where the trail leaves and the monks' shrine at the
    Stone's foot (#45).
- **Encounters.** Spine eagles (two groups, one at the nest, which takes the light out of the sky
  as it comes down); brothers walking from the monastery to the Stone and back; a snow troll in the
  snow on the crest, the box's hardest.
- **Quests.** The Eagles' Nest (§6).
- **The secret and its hint.** The snow never lies round the Stone: a ring of bare rock, warm to
  the hand. One slab in the ring lifts, and under it is the Lanterns' survey marker, lit, left by
  the Lantern who never came down, and her instruments. The hint: every stone in the ring is
  frosted at its edge but one.
- **Lines:**
  - the Stone: *Whole, and steady. The snow stops a yard short of it all the way round.*
- **New here.** A whole Stone with its field about it; the cliff seen from its top (#543).
- **Finds.** The Lantern's instruments, a thing the Lanterns' halls take (#56's 46); 300 gold.
- **Pay.** About 1,600 xp a member.
- **As built** (#501, 9 October): the brief's places, with four groups for its six, laid whole in
  the High Spine at 264,318, band 22–23 (§9, #501's 1 and 8). The box is its whole 1,024 squares,
  Monks' Vale's 154 on the crest at the east and Ashfall's 187 under the Sheer at the west, and its
  crossing line names the High Spine: going over the crest a company hears *The High Spine.* and,
  two under the floor, in the range's own words, *Over the crest the wind is at you, and the range
  is harder still.* (three under, *Nothing on this crest would spare you. The way back down to the
  vale is still open.*); going back it hears nothing (§9, #501's 3). The seam with J11 is walked,
  not taken: J11's row 10 is opened at 0 to 2, from mountain to snow, and I11's row 10 is snow from
  31,10 west to the snow line at 22,10, so the summit's path goes on over the crest; no exit is
  added (§9, #501's 2). The ridge trail leaves by the north edge at 27,0 (291,318), a square from
  the scaffold's 28,0, to meet the atlas's trail beyond at 291,317, which I10 takes on (§4.5); the
  west and south edges end the world against H11 and I12, pinned in `tools/tests/outdoors.ts` with
  void past them (§9, #501's 4). The Stone stands at 28,0 (292,318) on bare rock beside the trail's
  square, in a ring of bare stone, a 3 by 3 at 27 to 29, 1 to 3, its stones set round it as rocks
  and the ring entered from the snow line through a gap at 26,3; the Stone is on the north edge, so
  the ring was open to I10 there (§9, #501's 6), which closes it round on its row 31 (§9, #502's
  17). Its once event, *The Peak Stone. Whole, and steady. The snow
  stops a yard short of it all the way round.*, is what counts it for the Hearth (§9, #501's 5).
  The brother who keeps it (`i11_keeper`, 28,1) is a thing seen, the snow on its shoulders that does
  not melt; at the Stone's foot the monks' shrine at 29,1 (endurance, its eleven pebbles) and, just
  south of the trail's square, the cairn at 27,1, holding a Sapphire Vial (§9, #501's 12 and 15). The
  slab, a secret door, is the ring's corner stone at 26,4, beside the gap; the hollow under it, 26,5
  (the Lanterns' survey marker, lit) and 26,6 (a chest: the Lantern's Instruments and 300 gold), is
  walled in rock, so no climb reaches it. The hint stands at the gap, 26,3: *Every stone of the ring
  is frosted along its edge but one.* (§9, #501's 7). The nest is an event at 29,8 and a chest at
  30,8 (the Lantern's Badge and a Smooth Grey Part), up a spur off the crest path at 29,9 to 10, the
  eagles on the spur (§9, #501's 10 and 11). The snow line runs down the crest's flank from row 1 to
  row 26, pines below it and rock above, the camp, The last pines, at 20,12 under it (§9, #501's
  14). The Sheer is kept as the atlas cuts it: the cliff, 2 wide, down the west, Ashfall's grey
  pines, grass, hills and ash beyond it, reached by a Mountaineer's climb down and, from I10, down
  the Stair; the lookout at its top, 6,9, sees Fire Mountain, and three events carry the density
  below it (§9, #501's 13).
  Four groups: spine eagles, 4, at the nest, 29,9, the nearest, who do not roam; brothers, 4, on the
  snow line between the crest path and the Stone, 23,5; spine eagles, 4, over the snow line south of
  the path, 22,14; and snow trolls, 2, in the snow at the crest's foot, 22,21, who do not roam, the
  box's hardest at 23, at the far end. It departs from the brief in the band, 22 to 23 and not 23,
  and in its groups, four for six (§9, #501's 1 and 8). The Eagles' Nest's hand-ins are owed to #506
  (§11).
  - **Measured.** A company at 22 wins every fight and manages 10.12 fights to a rest, inside the
    aim, with 14.3% of its days ending in a fight broken off; it walks the High Spine's road, past
    the brothers, every time. I11 pays 2,355 xp a member and 300 gold. Two under, at 20, it wins
    every fight too, owed to #18 as J11's is. Density 99.5% within 8 steps and the furthest 9, with
    no sign among its 26 points. It claims cliffs as new (§7).

### 4.5 I10, Stairwatch and the Stair's head (#502): core, band 22–24

- **Purpose.** The High Spine's step of the quest: the Giants' Stair's head in the Sheer at
  272,306, the giants at it, the Stair-king and his toll, and the road down into Ashfall. Stairwatch
  above it, the Knight's third (#448).
- **Landmarks.** Pines over most of the box, the Sheer's cliff down the west with the Stair cut
  into it, the road through the cliff (#543), going down out of the box at 258,306 for Ashfall's H10
  (#510); the king's seat at the head, a slab the size of a house; the giants' fires above, in J10
  (parked, #508); Stairwatch, a ledge above the head at 270,312, its way up found off the Stair; the
  ridge trail across the box's east at 286,300.
- **Points of interest,** about nine features and seven groups:
  - the head, the king and the toll: the step (§5), and the choice (#544);
  - the caravan that cannot pay, drawn up short of the head (#56's 47);
  - Stairwatch, and the old champion on it (#448);
  - the king's hoard, under the seat;
  - a camp back in the pines, a cairn at the trail's crossing and a shrine at the head, older
    than the monks' (#45).
- **Encounters.** The Stair in snow: a giant and a snow troll, one sweeping the front row (#545)
  and one getting up again unless burned (MONSTERS §8.1's second fight), on the road short of the
  head; eagles in the pines; the Stair-king at the head with two giants, boss, level 24, who asks
  before he fights; the giants are `kind: person` and break when he falls (#443, call 1).
- **Quests.** The step. The Toll (§6). The Knight's third prestige's quest, a night on the ledge
  (#448).
- **The toll** (#544). The king puts his price before the fight the way a business puts its menu:
  pay, and the company walks down the Stair, the giants standing aside; refuse, and the fight is
  his and theirs. The price and its remembering are §9's.
- **The secret and its hint.** Stairwatch's way up: a chimney in the rock behind the pines above
  the head, climbed to the ledge where the old champion keeps his watch on the Stair; the quest
  marks the place (DESIGN §5), and the way is the secret. The hint: smoke from the cliff's top
  where nothing stands, and a rope's wear on one rock at the pines' edge.
- **Lines:**
  - the head, the step: *A stair cut in the cliff, each step the height of a man. At its head a
    giant sits, and holds out his hand.*
  - the toll: *Toll. We have taken it since we were set here, and nobody has come to say stop.*
  - the hoard: *Coin of Helmstow on top. Under it, coin with no face. Under that, nothing.*
- **New here.** The giants, a new family (#507); the toll, a choice before a fight (#544); sweep
  (#545); the cliff with the road through it (#543).
- **Finds.** The king's hoard: 1,200 gold in coin of every age, and a plus on Rimewater's rung.
- **Pay.** About 2,400 xp a member, the king's share only on refusing the toll.
- **As built** (#502, 9 October): the brief's places, with three groups for its seven, laid whole in
  the High Spine at 264,286, band 22–24 (§9, #502's 1 and 9). The box is its whole 1,024 squares:
  pine 586, mountain 178, peak 91, road 56, cliff 46, rock 26, snow 19, cut stone 16, ash 2 and 4 in
  the hollows and the chimney, 990 of them the High Spine's, 31 in the north-east corner Loch Fuar's
  and 3 in the north-west Cindercoast's, none of those walked (§1). The seam with I11 is walked, the
  ridge trail going on from I11's 27,0 (291,318) to I10's 27,31 (291,317), and nothing is said
  there, the floor being 22 on both sides (§9, #502's 1); the mountain closes the Stone's ring round
  on I10's row 31, the trail its one way north (§9, #502's 17). The trail goes on through the pines
  to the north edge at 18,0 (282,286), where the atlas's meets it at 282,285 (§9, #502's 16). The
  road leaves the trail at 23,20 and runs west to 8,20, the atlas's link end (272,306); the head is
  cut stone at 2 to 7,20, 3 to 7,21 and 5 to 7,19, and the Stair, road at 1,20 and 0,20, goes down
  through the Sheer to the west edge (0,20 is 264,306), where Ashfall's ground lies at the cliff's
  foot, 0,21 to 0,31, and runs south into I11's. The north and east edges end the world against I9
  and J10, pinned in `tools/tests/outdoors.ts` with void past them, the south edge is pinned against
  I11's and the west edge meets H10's east edge square for square, the Stair going on down onto H10's
  31,20 (#510; §9, #502's 7). Short of the head, west along the road: a caravan drawn up,
  its master at 18,19 and the wagons at 18,21, and then the Stair in snow at 13,20, a giant and a
  snow troll in a drift (rows 18 to 22, columns 10 to 16); the master's girl is at the head, 6,19,
  off the road. The drift at 12,21, *The wind did not lay it.*, and burnt bones by the trail at
  20,16 are things seen (§9, #502's 8 and 12). At the head a toll-stone at 4,21 bears a ring with a
  bar across it, cut small under its lip, and a shrine older than the monks' at 7,21, of might,
  holds out a stone hand (§9, #502's 13 and 14). The king's seat is a slab of rock (2 to 4,17 and 3
  to 4,18 to 19), and his group, `i10_king`, the king and two giants, stands at 2,20, the Stair's
  top step, so that no company goes down unasked: the Stair is reached from the top only through
  that square (§9, #502's 4). *The king holds out his hand from the seat. "Toll. We have taken it
  since we were set here, and nobody has come to say stop."* A company may pay 1,500 gold, give him
  the grey part from I11's nest, give him the faceless coin of #56's 9, or refuse, and the fight is
  his and theirs; the three that satisfy him set `toll_paid`, `toll_part` or `toll_coin`, for #506's
  47 to read, and the giants step off the Stair and stand aside (§9, #502's 5). Under the seat,
  walled in rock (the Sheer's cliff at 1,18 and 1,19 is made rock, so no climb reaches it), the
  hollow of his hoard: at 2,19 *Coin of Helmstow on top. Under it, coin with no face. Under that,
  nothing.*, and at 2,18 the chest `i10_hoard`, 1,200 gold and a Bear Spear +1, Rimewater's rung at
  2,050, the area's dearest find. Its one mouth is the king's square, so a company that paid walks
  through it and can rob the hoard (§9, #502's 6). South of the head, Stairwatch: rock at 3 to 8,24
  to 25, 4,26, 7 to 8,26 and 4 to 7,27, and in it a chimney, a secret door at 6,24 off the pines,
  its shaft at 6,25 and the ledge at 5,26 and 6,26, where the old champion stands (5,26) and the
  ledge's event, `i10_ledge`, is at the atlas's site, 6,26 (270,312). The hints are smoke at 9,22
  and the rope's wear at 6,23, the secret's declared hint (§9, #502's 11). The camp, The drovers'
  fire, is in the pines at 11,28 and the cairn at the trail's crossing, 22,21, holds a Sapphire Vial
  and no gold (§9, #502's 14). Three groups: spine eagles, 3, in the pines nearest the way in,
  17,25; the Stair in snow, a Stair Giant and a snow troll at 13,20, who do not roam; and the
  king's, the box's hardest at 23.3, who do not roam and do not come back. It departs from the brief
  in the band, 22–24 and not 23–24, in its groups, three for seven, and in its secret, the issue's
  maintenance mark being a thing seen on the toll-stone and the doc's chimney the door (§9, #502's
  1, 9 and 13). The Toll, the quest, and the old champion's trainer entry are owed (§11).
  - **Measured.** A company at 22 wins 86% of the fights, the king counted, and manages 11.72
    fights to a rest, over the aim and inside the limit, with 7.7% of its days ending in a fight
    broken off; it walks the High Spine's road, past the giant and the troll in the snow, every
    time. The king is won 58% at 22 and 79% at 24, the gate's floors for him; measured as the gate
    measures a fight, from 21 to 25 he is won 7%, 58%, 56%, 79% and 97%. Two under, at 20, the box
    is won 68%, inside the limit, so nothing is owed. I10 pays 4,197 xp a member, 1,046 to a
    company that pays the toll, and 1,920 gold a clear. Density 99.7% within 8 steps and the
    furthest 9, with no sign among its 31 points. It claims the giants as new (§7).

### 4.6 I9, the ridge north (#503): country, band 23

- **Purpose.** The ridge trail along the crest from the High Spine into Sheer Point: the first of
  the Point's boxes, with its crossing line, and the Hearth seen ahead over the sea for the first
  time close.
- **Landmarks.** The trail along the crest in snow, from 282,280 to 284,262, with cairns a company
  steers by in cloud; peaks either side; the pines below on the east; a lookout north where the
  Point runs out and the Hearth stands over the water; the first of the sea at the box's north
  edge.
- **Points of interest,** about five features and four groups:
  - the trail's cairns, one with a cache, and a camp in the lee of the crest (#45);
  - the lookout north, the Hearth close;
  - a hermit under the peaks, who has watched the Hand's boats go round the Point.
- **Encounters.** Snow trolls in the snow (two groups, the second two together, the box's
  hardest); spine eagles off the peaks; ashen masons coming up the trail with a sledge of cut stone,
  the Hand's traffic to the causeway, the first of them on the road.
- **Quests.** None of its own; the chapter's goal points on north (§5).
- **The secret and its hint.** A cave under the crest where the trolls lie up, and what they have
  taken from travellers over the years. The hint: the snow at one cleft is trodden to ice, and
  nothing else on the ridge is.
- **New here.** Nothing; the ridge is the walk.
- **Finds.** The trolls' takings: 500 gold and a plus on Rimewater's rung.
- **Pay.** About 1,400 xp a member.

### 4.7 I8, Sheer Point (#504): core, band 24

- **Purpose.** Sheer Point's step of the quest, and the act's turn: the finger of land toward the
  Hearth, the Hand's causeway of cut stone running out over the water, every stone a stolen shard,
  the camp on its shore where Wenna waits for the company, and the night she is taken. Rook's Nest,
  the Thief's third (#448).
- **Landmarks.** The trail's end at 286,236; the Point's tip, mountain and peak falling to the
  shore; the causeway from the shore out into the sea, cut stone a square wide, as far as the
  Hand has built it, the Hearth's light on the water beyond; the Hand's camp on the shore, the
  causeway's camp; Rook's Nest at 286,230, a hide on the tip over the causeway; the rocks where the
  deserter hides (#56's 48).
- **Points of interest,** about eight features and six groups:
  - the causeway's first stone: the step (§5), and after the night, the knot;
  - the camp, and Wenna at it (§5);
  - Rook's Nest, and the one who waits there (#448, #22);
  - the deserter in the rocks, and his tally (#56's 48);
  - the masons' tally-house at the causeway's root; a cairn on the tip and a Tidefolk shrine at
    the shore, its bowl full of shells (#45).
- **Encounters.** Ashen masons on the causeway (two groups, MONSTERS §8.1: a hammer from below and
  a shard to set), the second with their foreman the box's hardest; spine eagles over the tip; a
  snow troll come down to the shore by night (`when`).
- **Quests.** The step. The Mason's Tally (§6). The Thief's third prestige's quest, which goes down
  to the Dead-Drop (#448, #22).
- **Wenna** is a person who moves (#76; §9, 2): at the camp when the company comes, never in a
  fight. Resting there sets `q_wenna_taken`, and the company wakes to the boat going out along the
  stones and her knot on the first one: one once-event, no counter.
- **The secret and its hint.** A sea cave under the tip, below Rook's Nest, where the Hand keeps
  its boats, and in it the shards not yet cut and the Hand's seal on their crates. The hint: oars
  heard under the rock by night, and the boat that goes out along the stones comes from nowhere the
  company saw.
- **Lines:**
  - the causeway, the step: *A road out over the water, of cut stone. Every stone glows a little,
    the way the shards do.*
  - the first stone: *Scratched fresh, at the height of a girl's shoulder, a loop inside a loop.*
- **New here.** The sea reached from the range; a causeway over water; a person taken.
- **Finds.** A shard from the cave, a quest item for #548's Stone; 400 gold.
- **Pay.** About 1,500 xp a member.

### 4.8 J10, I12 and J12, the country behind (#508): country, band 23–24, parked

- **Purpose.** The giants' own ground above the Stair's head (J10, lettered at 300,296) and the
  range running on south of the Stone and the Vale (I12, J12), built once the owner has played the
  act (#443, call 9): the giants' fires and stone seats, and giants at them who ask no toll off the
  Stair; the crest south to the rim, with snow trolls and eagles. About 400 xp a member each.

## 5. The one quest here

The Whitespine's chapter is The Bells (`chapter.ts`, #505, a working title), joined after
Rimewater's The Sleepers, and every zone on the road holds a step (EXPANSION §5.8): Monks' Vale's
at the monastery, the High Spine's at the Stair's head, Sheer Point's at the causeway. Its entries
and goals, in the journal's voice, keyed to flags, events and maps the save holds:

- **South.** The two hundred Wenna left below are marched south, toward the mountains and the sea.
  Two days before the monastery the bells come across the snow: eleven, with gaps between, and then
  again. The night the Queen died, over and over. The goal points at the gate.
- **Highcell.** The monks walk wrong, speak the dwarves' old script to each other and do not bleed;
  something has gone on keeping the monastery for them. The log says what is seen and no more
  (DESIGN §7). The goal turns over the crest, past the Stone, and north along the ridge.
- **The causeway.** The finger of land toward the Hearth, so close its heat is felt; the Hand's
  road of cut stone, every stone a stolen shard. Every shard is a step. Wenna is at the camp.
- **The night.** Wenna gone, a boat going out along the stones, her knot on the first one
  (`q_wenna_taken`). Cassian reads the Meridian journal's last line, *The heart opens for whoever
  makes it whole*: one Stone left, on the far side, never finished. The goal turns south to the
  Stair.
- **The Stair.** The giants and their toll, over the range and down. Paid or fought, the chapter's
  done flag is set at the head, looking down into ash; the next chapter is Ashfall's.

Nothing in the chapter is a lock (EXPANSION §2.3; #450): the gate stands open at any hour, the
Stair goes down for anyone who pays or wins, the ridge trail is open from the start (#443, call 3)
and a company that reaches the Point first reads the journal true in that order. The walkthrough
plays it at 22, 23 and 24, paying the toll once and refusing it once.

## 6. Side quests

#56's four for the Whitespine, all standing (#443, call 9), each built with its box on the systems
of #76 (#506):

| # | Quest | Level | Where | What it needs | Pay | Built in |
|---|---|---|---|---|---|---|
| 45 | The Novice | 23 | Highcell; Anvilhall | a letter carried; a choice put by a person; `after` (#41) | 200 | #500 |
| 46 | The Eagles' Nest | 23 | the herder's fold (J11); the nest (I11); Lantern Watch or Highcell | an item no shop buys; a hand-in at the first meeting (#43) | 200 | #499, #501 |
| 47 | The Toll | 24 | the Stair's head (I10) | the toll (#544); an item given in place of gold; a choice; a person who moves | 250 | #502 |
| 48 | The Mason's Tally | 24 | the rocks on the Point (I8); Cinderport | a choice put by a person; an item swapped | 250 | #504 |

Pay is xp a member, whichever way the choice goes, shared by level: about 900 between the four
(§8). As #56 drafts them:

- **The Novice.** One real novice lives among the brothers and does not know. The company carries
  his letter to his mother in Anvilhall; on its return it tells him, and the brothers let him walk
  out, or does not.
- **The Eagles' Nest.** A herder at the vale's edge loses lambs to the eagles. In the nest on the
  peaks above the Stone are smooth grey parts and a Lantern's badge: a Lantern came to survey the
  Peak Stone and never came down. The badge goes to Lantern Watch, or to Highcell.
- **The Toll.** A caravan at the Stair's head cannot pay, and the Stair-king keeps the
  caravan-master's daughter until it is paid. Pay in gold; or give him something from below, the
  faceless coin of #56's 9 or a part from the nest, and he says his people were on the mountain
  before anyone came down the sky; or fight. His words hint and never say (#443, call 1). As built
  (#502) the king's answers are the box's, and the caravan-master, his wagons and his girl stand
  there as words only; the quest that joins them is #506's (§4.5; §9, #502's 5 and 12).
- **The Mason's Tally.** A mason has deserted the causeway and hides in the rocks with the tally:
  eleven more shards and the road reaches the isle. He wants passage to Cinderport. Buy it for him,
  or swap the tally's page so the Hand sends for the wrong count.

## 7. Encounters, and what is new

MONSTERS §8.1 has the roster and the fights: the Spine Eagle, the Brother, the Bell-ringer, the Snow
Troll, the Stair Giant, the Ashen Mason, the Abbot and the Stair-king; the chapter house and the
Stair in snow. Their drawings are #507's, eight in all, the giants new and the rest on frames that
exist. §4.2 to §4.7 place every group, box by box, the gentlest at the pass's foot and the Abbot,
the king and the masons at the top of the band. All eight of #507's drawings are done (§3, §9): the
monks, the Brother, the Bell-ringer and the Abbot, robed on the keepers' frame; the Spine Eagle, the
Snow Troll and the Ashen Mason; and the giants, the Stair Giant and the Stair-king, on a frame of
their own.

New in the Whitespine, for the novelty check (EXPANSION §5.4): the giants, a new family (#507), and
with them the toll, a choice before a fight (#544), the second after Thornmark's ogre's bargain
(#645), and sweep, one blow at every member of a row (#545); cliffs and peaks with the road through
them (#543); a machine in a robe, which holy light passes through, and a bell that holds (MONSTERS
§8.1). Its landmarks: a monastery kept by what did not build it, a whole Stone with the snow
stopped round it, a stair cut in a cliff, a causeway of shards over the sea. The area's `novel`
claims each as a box places it, since the check asks that what is claimed be used: peaks underfoot
with J11 (#499), the monastery with Highcell (#500), cliffs with I11 (#501) and the giants with I10
(#502), the family alone, since the toll is Thornmark's mechanic (`encounter:choice`) and sweep has
no token to claim; a machine in a robe has no token either and a bell that holds is paralysis, on
the road before in the Kilns and others (§9, #499's 15; #500's 17; #501's 13; #502's 15).

## 8. The numbers

- **Experience.** The curve (EXPANSION §5.2, #159) gives an area the climb from its floor to the
  next area's floor, divided by 0.75: from 22 to 24 that is about 17,867 xp a member with today's
  `xpForLevel`. The shares of §4 are J11 1,800, Highcell 2,600, I11 1,600, I10 2,400 (the king's
  share only on refusing the toll), I9 1,400, I8 1,500 and the four side quests about 900 between
  them: 12,200 without the country behind, which adds about 1,200 when it is built. That is some
  5,700 short of the curve, and the shares are first cuts: from Saltreach on every box built has
  paid over its share, since a fight inside the gate's aim costs what its monsters are worth
  (docs/areas/saltreach.md §8). Each box is priced by its fights when it is built, the sum here is
  restated with each, and the curve's row reports what a clear falls short of as owed to #445 until
  the boxes exist. A company that pays the toll forgoes the king's share and keeps its gold.
  Scaled to the curve, which §9 proposes as the briefs' working figures until each box is built,
  the shares are J11 2,650, Highcell 3,800, I11 2,350, I10 3,500, I9 2,050, I8 2,200 and the side
  quests about 1,300: about 17,850. The issues (#499 to #506) carry the first figures until their
  briefs are settled. As built: J11 2,791 (#499), 1.05 times its scaled share; Highcell 4,183
  (#500), 1.10 times its 3,800; I11 2,355 (#501), 1.00 times its 2,350; I10 4,197 (#502), 1.20 times
  its 3,500, under the 4,375 cap, and 1,046 to a company that pays the toll: 13,525 between them by
  the curve's sum, so with the other scaled shares (5,550) the shares stand at about 19,075, 1.07
  times the ask (§9, #499's 9; #500's 4; #501's 9; #502's 10).
- **Gold.** Training six members from 22 to 24 costs about 10,800 with today's `trainPrice`, but
  nothing trains here (#443, call 7): the gold goes over the range to Cinderport, which teaches to
  27, and the third prestiges ask quests, not gold (DESIGN §5). The band's price window is 5,000
  (#542), and no find or ware in the area comes near it: the pass has no step of its own and wears
  Rimewater's rung, 1,750 to 2,050 gold with its pluses. The toll is set with #544 inside the
  window, dear enough to be a choice and never a wall. A clear should still pay the training, in the hoard, the
  undercroft and the trolls' cave. As built: J11 holds 700 (#499), 300 in the cairn at the pass's
  foot and 400 in the store; Highcell holds 600 (#500), in the undercroft's chest; I11 holds 300
  (#501), in the chest under the slab; I10 holds 1,920 (#502), 1,200 in the hoard under the seat
  and the purses of the king (250 to 500) and of three giants (70 to 160 each); so the four hold
  3,520 of the 10,800. The toll is 1,500, about what the range's finds hold before the head (J11,
  I11 and Highcell, 1,600) and under the dearest ware the pass wears. The dearest find is I10's
  Bear Spear +1 at 2,050, Rimewater's rung, in the hoard, inside the window; Highcell's is the Ice
  Axe +1 at 1,950 and J11's the Guide's Staff +1 at 1,750 (§9, #502's 5 and 6).
- **The gate.** The gate check (`tools/tests/gate.ts`, #38) holds each box at its own floor: a
  company at 22 wins nine in ten of J11's fights and walks the road from the pass's foot to the gate
  resting at its camp; one at 20 wins no more than one in four. The Abbot is won about half the
  time at 23 and nearly always at 25; the Stair-king the same. The bot must know the toll (#549): it
  refuses, so that the gate measures the fight. As built: a company at 22 wins every fight on J11
  and walks Monks' Vale's road every time, 10.50 fights to a rest; one at 20 wins every fight too,
  owed to #18 as Rimewater's boxes' is (§4.2). On Highcell a company at 22 wins every fight in the
  upper house and manages 11.80 fights to a rest, over the aim and inside the limit; one at 20 wins
  every fight too, owed to #18. In the lower house a company at 23 wins 83% of the fights and
  manages 10.99 fights to a rest, a little over the aim; the Abbot is won 66% at 23 and 93% at 25,
  set off the boss line (§4.3; §9, #500's 6). On I11 a company at 22 wins every fight and walks the
  High Spine's road every time, 10.12 fights to a rest; one at 20 wins every fight too, owed to #18
  (§4.4). On I10 a company at 22 wins 86% of the fights, the king counted, and walks the road past
  the giant and the troll every time, 11.72 fights to a rest, over the aim; one at 20 wins 68%, so
  nothing is owed. The Stair-king is won 58% at 22 and 79% at 24, the gate's floors for him, and by
  the gate's own measure 56% at 23 and 97% at 25, so "about half at 23, nearly always at 25" holds
  (§4.5; §9, #502's 1 and 3). The Whitespine's 16 groups are won 95.3% of the fights at their maps'
  floors and 89.9% two under, which holds, so the area's owed entry (#18) is dropped.
- **Density.** Core boxes at the Foreland's floor, country at the looser one (EXPANSION §5.3),
  measured over the squares the mountain leaves. As built: J11 99.1% within 8 steps and the furthest
  9, with no sign among its 22 points (#499); Highcell's two levels 100.0% within 7 steps, the
  furthest 5 on both, with one sign among their 15 and 9 points (#500); I11 99.5% within 8 steps and
  the furthest 9, with no sign among its 26 points (#501); I10 99.7% within 8 steps and the furthest
  9, with no sign among its 31 points (#502).

## 9. Decisions

Decided by the owner's delegate on 2 October 2026 (#443), and followed here:

1. **The giants came in the ship awake** (call 1): the crew that built the inside, the heavy hands
   who raised the ranges and set the Stones, never cargo, so in no bay and in no count; they stayed
   on the mountain when the rest were put to sleep. The Giants' Stair is the service ramp they were
   posted to keep and the toll the order they were given, kept four hundred years. The Stair-king's
   words hint it and never say it (DESIGN §7: the secret is found, never told). They are
   `kind: person`, and break when the king falls. This answers MONSTERS' open question 2.
2. **Sheer Point is reached along the ridge** (call 3): the new trail from the Peak Stone north,
   open from the start, with the causeway's camp on the Point's shore. Wenna is a person who moves
   (#76): after the bay at Rime Lodge, then at Highcell's gate when the company arrives, then at
   the camp, never in a fight. Resting at the camp sets `q_wenna_taken`: one once-event, no counter.
3. **Road order holds** (call 6): the Whitespine is Act IV's first area, the Stair its way on.
4. **Cinderport holds the halls** (call 7): Highcell sells and teaches nothing, its brothers being
   machines, and the Bard's trainer in the bell tower is a living Laureate hiding among them.
5. **The third prestiges are built in Act IV** (call 8, #448): Stairwatch, Spine Summit, Rook's
   Nest and the bell tower here, with their quests as DESIGN §5 sketches them.
6. **The cuts stand, the country behind is parked and all four side quests stand** (call 9): §11,
   #508 and §6. **The names** are #444's (§10).

Proposed, for the owner, each in the issue that would build it:

- **The briefs** of §4.2 to §4.8: each box's landmarks, points of interest, encounters, secret
  and hint, lines, finds and share of the pay.
- **The core** is J11, I11, I10 and I8, as the plan has it: three steps and the Stone (§4).
  **Highcell is two levels of 16×16,** the upper house and the lower, with the undercroft behind
  the Abbot's seat (#500). **The pay's shares** (§8), and the gap to the curve.
- **The bands on the atlas's rows** (#498): Monks' Vale 22–23, the High Spine 23–24, Sheer Point
  23–24, Highcell 23–24. They are set in `src/content/areas/whitespine/atlas.ts`, where only the
  scaffold reads them, for a box's draft; the owner's word changes them there.
- **The monastery's plate moves from K12 to J11's gate,** 330,356 to 322,342, as Saltmouth's moved
  to C6 (docs/areas/saltreach.md §9): K12 is cut, and the plate goes where the way in is.
- **J11 is laid in Monks' Vale and I10 in the High Spine,** each the zone that holds most of its
  land, so the crossing lines fall at the J11/I11 and I10/I9 seams.
- **I8's band.** The plan gives it 24, and a band of 24 alone wants its hardest group at 24; the
  roster's top below the bosses is the masons at 23. Either the box is laid 23–24, as C7 was
  (docs/areas/saltreach.md §9, #178's 2), or the masons' foreman, a stat and not a drawing, averages
  the second group to 24. For the owner, with #504.
- **The toll's price and its remembering** (#544): a sum inside the window (§8); paid once, the
  Stair stays open to that company; the king dead, nobody keeps it. The bot refuses (#549).
- **The giants' ground is J10's,** parked with it; the Stair's head holds the king and the two
  that stand with him. **The lines** of §4 are drafts, the owner's to reword.

Decided by delegate for #507 (the monks), each the owner's to overturn:

1. **The monks are keepers in the dead monks' habits:** a robe goes where the Matron's apron does
   (#495's 4), wool from the shoulders to the hem, girt with a cord, the sleeves wide and the six lit
   fingers out of the cuffs; the plate shows at the shins and the feet, so the bay's walk is known.
2. **Each robe is its def's tint, and the plate under it the Bay Keeper's grey:** the Brother brown,
   its hood up and the lights in its shadow; the Bell-ringer oatmeal, its hood down in a cowl and the
   egg bare; the Abbot black lined pale, the tallest of the three, its hood drawn up to a point.
3. **The Brother walks as it was told to:** idle, one foot and then the other comes up stiff and
   high and is set down flat where it was, and the hem lifts over it.
4. **The Bell-ringer's bell is a bronze handbell held out at the hip,** swung eleven strokes, a gap
   and eleven more. It holds at 0.2 a hit (MONSTERS §8.1) and is `ranged`, as the devilfish is: a
   monster in the back rank without it waits while the front stands, and the chapter house puts the
   bells behind the brothers (§4.3).
5. **The Abbot carries a crook,** lifted and set down at the hour. Its robe has fallen open down the
   chest to the cord, lined pale, on the plate and the chisel's mark (#495's 3), and gapes wider at
   the hour. A drawing is not told its monster's wounds (`drawMonsterSprite` takes none, and the
   fight draws only those standing), so a robe that opens as the Abbot is hurt waits on a systems
   change, the owner's to ask for.
6. **On the line:** the Brother a soldier at 22 (317 hit points, 4d8+2), the Bell-ringer a
   controller at 23 (284, 4d8+2) and the Abbot on the boss line at 24 (1,381, 24d8+24), for #500's
   gate to tune as the Matron was #490's; all three machines, with no gold and no drops until #500
   gives the Abbot a find. Sizes 1.1, 1.1 and 1.4.
7. **Each is owed to the box that places it first:** the Brother to #499, on the vale's road, and
   the Bell-ringer and the Abbot to #500 (`UNPLACED` in `tools/tests/maps.ts`).

Decided by delegate for #507 (the eagle, the troll and the mason), each the owner's to overturn:

1. **The Spine Eagle is the birds' frame at its biggest, coming down on its prey:** the wings
   raised high with the primaries spread, the feathered legs thrust forward and the yellow feet open
   just off the ground; dark brown, the crown and nape gold, a heavy brow and a hooked yellow bill.
2. **The eagle is drawn inside 0.62 of its height, at size 0.9,** so the raised wings keep inside
   the view; its body is still half as big again as the raven's. It does not hop: the wings settle.
3. **The eagle is a skirmisher on the line at 22** (328 hit points, 3d7+6), flying and reaching
   the back row as the raven does (MONSTERS §8.1: it flies); a beast, it carries no gold.
4. **The Snow Troll is the tor troll's frame made of snow,** a Build of it as MONSTERS §11 has it:
   no beds, lichen or heather; rime along the hump and the shoulders, a cornice over the brow with
   icicles at its lip, a maw with icicles for teeth, blue shadows and a cold light in the eyes.
5. **It stands in the drift it rose from, the fists sunk in it:** a drift that stood up, and the
   widest base of any troll, so it reads apart from the tor troll at a glance as well as by colour.
6. **The troll is #537's at 23:** size 1.6 with its crown at 0.80 of its height, under 0.82; three
   quarters of the brute's line, 474 hit points, mending 47 a round unless fire struck it.
7. **The Ashen Mason wears the overseer's hitched robe under a mason's leather apron,** white with
   dust at the hem, the Hand's grey up to the elbow, a step on from the gleaner's. A glass shard to
   set rides on the far shoulder, lit from inside; the hammer is low in the near fist, its head by
   the foot, and now and then it lifts off the stones: a hammer from below.
8. **The mason is a soldier on the line at 23** (319 hit points, 4d8+2); the Hand, it never breaks
   (`steady`), and it carries 45 to 100 gold, on from the overseer's and the gleaner's. Its sprite
   kind is `mason`, as theirs are named for their work.
9. **Nothing is declared apart:** the shard, the hammer, the raised wings and the talons are each
   one piece of ink with the body at combat size.
10. **Each is owed to the first box whose brief places it** (§3): the eagles and the troll to J11
    (#499), the masons to I8 (#504).
11. **What was drawn before is unchanged to the pixel:** the eagle and the troll are Builds on
    their frames, their new parts off for every other kind; the mason is a function of its own.

Decided by delegate for #542, each the owner's to overturn (docs/areas/ashfall.md §9 has the step):

1. **The Whitespine's row is 22–24, next 24, window 5,000,** owed to #445 with nothing given, as
   the issue has it: 17,867 xp a member and 10,800 gold, the training of six from 22 to 24.
2. **The pass has no step on the ladder,** no town to sell one: its gear is Rimewater's rung, the
   top at 22, so a company at 24 wears what one at 22 does and Cinderport's step comes at 25. The
   briefs' pieces of Rimewater's rung with a plus stand; they are the ladder's.

Decided by delegate for #507 (the giants), each the owner's to overturn:

1. **A giant is a man as tall as a house, standing as a man stands:** upright, his weight on both
   feet, no stoop and no club, so he reads apart from the ogres and the trolls at a glance.
2. **His near arm is held out from the elbow, the hand open and cupped, thumb and fingers turned
   up:** the toll asked in the silhouette, the arm the bar across the road. The far hand hangs, huge.
3. **He wears the crew's working clothes kept four hundred years:** a knee-length coat of felted wool,
   belted, split and patched, a fleece collar, leggings bound to the knee and heavy boots.
4. **On his shoulder is a worn round badge whose mark is long gone:** a thing seen, which nothing
   explains (DESIGN §7).
5. **His head is small for his height and bowed to look down at the company,** the hair cropped and
   iron-grey, the beard on his chest, the eyes pale and deep under the brow: patient, not fierce.
6. **The Stair-king is the frame an eighth broader, his head sunk between his shoulders,** under a
   mantle of dark fur to the knee; white-haired, the beard to his belt, his coat slate to their grey.
7. **His crown is the toll:** coin set on edge in a band at his brow, gold and silver either side and
   at the front the oldest, dull and with no face, as his hoard lies (§4.5); more studs his belt.
8. **Both are size 2, as MONSTERS §8.1 has the giant, drawn inside TALL_REACH:** the giant's crown at
   about 0.75 of his height and the king's at 0.81, so the king stands over his giants at their size.
9. **The giant is a brute on the line at 23** (632 hit points, 5d7+8) and the king on the boss line at
   24 (1,381, 24d8+24), for #502's gate to tune.
10. **People carry gold:** the giant 70 to 160 and the king 250 to 500, the toll's coin, for the
    curve to weigh with #502; the hoard is the box's find (§4.5).
11. **Sweep is left to #502:** main has no `sweep` on `MonsterDef` yet (#545), so the box that places
    the giants declares it on both. The toll is #544's, and the leader whose fall breaks them #502's.
12. **Nothing is declared apart:** the hand, the coins and the fur are one piece of ink with the body
    at combat size. Each breathes slowly, the held-out hand lifting a little and settling.

Decided by delegate for #499, each the owner's to overturn:

1. **J11 is laid whole in Monks' Vale at 296,318,** core, band 22–23, region `whitespine`, as the
   call above has it: the High Spine's 110 squares on the crest are the map's, and the crossing line
   names Monks' Vale.
2. **The road crosses the north edge at 20,0,** not the scaffold's 19,0 nor the link's end at
   318,318 (22,0, pine on the cut): the atlas's road beyond runs at 316,317 and the edge check
   binds. It runs square to square to the gate's front at 26,23, four squares added at its diagonal
   steps.
3. **The pass is taken, not walked,** as N8's notch, L9's pass and K10's ridge are: K10's `SADDLE`
   at 0,19 lands on J11's 20,1 facing south and J11's `CLIMB` at 20,0 on K10's 1,19 facing north.
   Each label leaves the land's name to the crossing line (#616).
4. **Monks' Vale's crossing words are the range's own:** two under the floor, *The range begins
   here, and it is harder than the lochs behind.* and three under, *The range, and nothing in it
   would spare you. The way back over the pass is still open.* The walkthrough walks it at 19, 20
   and 22 (the name alone).
5. **The monastery is a block of building squares on its shelf,** rows 24 to 28, columns 20 to 29,
   joined to the mountain by rock (columns 17 to 19). Drawn tall over one square, as the brief asks,
   it needs a `Landmark` kind besides the lighthouse's (`src/game/map.ts`, `src/ui`): a systems
   change for the owner to ask for (§11).
6. **The gate at 26,24 is barred, as N8's door was before #617:** `GATE` is exported and not in
   `exits`, its square a building, and the event `j11_gate` (not `once`) stands at its front, 26,23.
   #500 lists it, makes the square a door, drops the event and sets the landing (asked: 7,1 facing
   south); its way back lands on 26,23. #500 did all four (§9, #500's 8).
7. **The gate's line keeps the brief's,** with the brother standing in the open gate so that it
   reads true while the gate is barred: *The gate stands open, and a brother stands in it. It bows,
   and the bow is a shape someone described to it.* It is the gate's label now (§9, #500's 8).
8. **Five groups for the brief's six:** brothers (3) at the pass's foot, the gentlest and nearest;
   eagles (4) west of the road and (4) east; brothers (4) on the road to the gate; snow trolls (2)
   at the summit path's far end, not roaming, at 23, the hardest. Smaller groups gave 14.6 fights to
   a rest and three trolls 6.6, both outside the limit; these give 10.50, the aim's top.
9. **J11 pays 2,791 xp a member,** 1.05 times the doc's scaled share of 2,650 (the doc wins over the
   issue's 1,800). With the other scaled shares (15,200) the area comes to about 17,990, 1.01 times
   the ask (§8).
10. **The store is walled in rock, not mountain,** so a Mountaineer's climb cannot reach it; the
    secret door at 16,29 among the rock is drawn as rock, the blank face. The trodden line is row
    29's snow from 29,29 west to it, and the hint `j11_trodden` and, by night, `j11_walker` stand at
    29,29.
11. **The finds:** the cairn at the pass's foot (17,4) holds 300 gold and a Sapphire Vial, the store
    (14,29) 400 gold and a second Guide's Staff +1 (`guides_staff+1`, Rimewater's rung; the monks'
    gear). A clear pays 700 gold.
12. **Spine Summit is a camp at the atlas's site,** 4,10, up a snow path carved through the crest
    from the hills at 13,12, and the site loses `planned`. The hermit beside it (3,10) has words
    only: #448 keeps his trainer entry and the vigil. Highcell's plate stayed planned until #500, as
    Carn Dubh's did until #617, and is built (§9, #500's 1).
13. **The herder** at his fold (27,19; the fold a ring of rock at 28 to 30, 18 to 20) has words only
    (#506's 46).
14. **The pilgrims' hostel** is a building of 2 by 2 east of the road (24 to 25, 12 to 13), its
    event at the front (23,13): kept wrongly, the blankets under the beds and a bowl of snow by
    each. The issue's secret, the hostel's cellar, is not built; the doc's store is.
15. **Novelty claims terrain `peak` alone:** the cut has no cliff (I11's 42 or I10's 17 can claim
    it) and `uses()` has no token for a machine in a robe, whose family, the keepers', is
    Rimewater's.
16. **The chapter is owed to #505:** the quests test lists `monksvale`, `highspine` and `sheerpoint`
    as planned and `whitespine` as owing its chapter. The gate figures under the floor are owed to
    #18, as Rimewater's are.
17. **The climate is the range's:** summer 8, winter -12, daily 7, damp 0.03 to 0.08, wettest 330,
    fog 0.4, lag 12; cloud comes down off the crest and thunder rolls along the range.

Decided by delegate for #500, each the owner's to overturn:

1. **Ids follow Carn Dubh's:** `monastery` is the upper house and `monastery2` the lower, plates at
   322,346 and 322,352, both named Highcell as the Sleepers' Bay's two are. The planned row's name
   and band go and the site at 322,342 loses `planned`; ids are `hc1_*` and `hc2_*`.
2. **Bands 22–24 above and 23–24 below.** The upper house is banded from the area's floor, as Carn
   Dubh's cairn is: at 23–24 the rise check wants its hardest group at 24, and only the Abbot is.
   The lower's floor, 23, judges the Abbot at 23 and 25. Two under is owed to #18
   (`monastery: under`).
3. **Four groups for the brief's sixteen,** for the pay: brothers (3) by the cells, the nearest;
   bell-ringers (4) down the tower's stair, the upper house's hardest at 23; brothers (2) before
   bell-ringers (2) in the chapter house; the Abbot alone. Two ringers alone were 28 fights to a
   rest at 22, four are 9.2.
4. **Highcell pays 4,183 xp a member,** 1.10 times the doc's scaled share of 3,800 (the doc wins over
   the issue's 2,600): brother 873 × 5, bell-ringer 913 × 6 and the Abbot 15,253, 25,096 shared by
   six. With J11's it comes to 6,974, and with I11's 2,355 and the other scaled shares (9,050) the
   area to about 18,379, 1.03 times the ask (§8).
5. **The chapter house is two brothers and two ringers, not three and two:** three and two cost the
   lower house 7.53 fights to a rest, under the aim of 8.75, and 146 xp a member more; two and two
   give 10.99.
6. **The Abbot is 1,700 hit points and 19d8+16** for the boss line's 1,381 and 24d8+24: won 66% at
   23 and 93% at 25. The line's 59% at 23 is nearer half, but the lower house counts the boss among
   its fights, and with one other group the mean of that group's 100% and the boss's must reach the
   limit of 80%: 79.5% at 59%, 83% at 66%. A second group below would take the pay past 4,300. Named
   in `OFF_LINE` and in `BOSSES` under `monksvale`.
7. **The upper house sits at 11.80 fights to a rest,** over the aim (8.5 to 10.5) and inside the
   limit (7 to 13): four brothers by the cells would make it about 9.4 and the pay 4,328.
8. **The gate is opened as N8's door was by #617:** J11's 26,24 is a door, `GATE` is in J11's exits,
   `j11_gate` is gone and its line (#499's 7) is the gate's label, said as the company passes the
   brother in it. In at 7,1 facing south, as J11 asked; out lands on 26,23 facing north.
9. **No rest inside,** as in Carn Dubh: the shelf's lee camp, J11's 21,23, is five squares from the
   gate. The well has no `heal`: no foot has crossed the snow to it.
10. **The cells' brothers and the ringers at the ropes are sights, not fights:** the cells' line is
    said on the east walk (11,5) and the ringers who fight are those come down the stair. The
    bells' event (4,13) does not use up and rings eleven, a gap, eleven, each time.
11. **The Laureate is the npc "A ringer"** (6,14), words only: a man in a robe not his, a beat
    behind the rest. The name keeps him hidden; #448 gives him the Bard's trainer entry and may name
    him.
12. **The Novice is "A novice"** in the last cell (14,9), words only: he keeps the fasts and has
    never seen a brother break one. #506 gives him the letter.
13. **The board of the hours is an inscription** (5,4, by the refectory door), read by a dwarf or a
    Linguist as *KEEP THE HOURS. KEEP THE HOUSE. OPEN THE GATE.* It marks nothing.
14. **The secret:** the seat's hint `hc2_seat` (7,10) stands a hand off the hollows its feet have
    worn; the secret door is at 7,11 behind it and the undercroft rows 12 and 13. The doc's line is
    split: the niches' event says *Every niche is full.* and the last niche's lip (13,12) is an
    inscription whose reading, ONE to ELEVEN, is the count that ends on eleven, read only by a dwarf
    or a Linguist.
15. **The finds:** the monks' things at the undercroft's far end (2,13): 600 gold, an Ice Axe +1
    (1,950, the dearest find, in the window of 5,000) and a Skinning Knife +1, Rimewater's rung.
    With J11's, a clear pays 1,300 gold.
16. **The Abbot's slain line says the robe:** *The Abbot falls, and its robe falls open on grey
    plate. Overhead the bells ring the hour all the same.* It never comes back.
17. **Novelty claims the landmark `monastery`,** Highcell's site, built now. A machine in a robe
    still has no token, and paralysis is on the road before, in the Kilns and others.

Decided by delegate for #501, each the owner's to overturn:

1. **I11 is laid whole in the High Spine at 264,318,** core, band 22–23, not the doc's 23: a band of
   23 alone wants its hardest group at 24 (the curve) and the roster tops out at the snow troll's
   23. J11 is laid so, and Saltreach's C7 was (docs/areas/saltreach.md §9, #178's 2); the gate holds
   it at 22, harder than 23. The map is its whole box, Monks' Vale's 154 squares east and Ashfall's
   187 west, and the crossing line names the High Spine.
2. **The J11/I11 seam is walked, not taken:** the boxes share a whole edge and the crossing line
   goes on it. J11's summit path goes on west, its row 10 opened at 0 to 2 from mountain to snow
   (named in J11's header), I11's from 31,10 to the snow line. No exit is added.
3. **The High Spine's crossing words are the range's own,** as Monks' Vale's are (#499's 4), said
   going over and not coming back. The walkthrough walks it at 19 (warning), 20 (harder) and 22
   (the name alone).
4. **The ridge trail crosses the north edge at 27,0,** not the scaffold's 28,0: the atlas's trail
   beyond is at 291,317 and the edge check binds, as it moved J11's road a square. The Stone keeps
   the atlas's site, 28,0, on bare rock beside the trail's square. Past the edge, for now, the
   world ends.
5. **The Peak Stone counts for the Hearth once stood at:** its row in `src/content/stones.ts` reads
   `restored: { seen: 'highspine_i11:i11_stone' }`, set by the once event at 28,0 and kept by the
   save already, so no new flag; `stonesRestored` reads it (`world.stones`, the title's horizon, the
   almanac). §2 has the company stand beside the only whole Stone, and with no condition the
   Hearth's five could never all count. #505 may move it.
6. **The ring** is a 3 by 3 of bare stone under the Stone (27 to 29, 1 to 3), its stones rocks
   round it (26,1 to 2; 25 to 30, 4; 30, 1 to 3), entered from the snow line through the gap at
   26,3 (25,3 is snow). The Stone is on the north edge, so the ring is open to I10 there: #502 may
   close it round on its row 31 (26 to 30).
7. **The slab is the corner stone at 26,4, beside the gap.** The hollow under it, 26,5 (the
   Lanterns' survey marker, lit) and 26,6 (the chest), is walled in rock, so no climb reaches it.
   The hint at the gap, 26,3, is *Every stone of the ring is frosted along its edge but one.* The
   slab's square is one the outdoors leaves undressed and the pre-#9 rule dresses, which the art
   check wants of a map whose only wall face is the slab.
8. **Four groups, the brief's encounters, not §4.1's six:** eagles (4) at the nest, 29,9, who do not
   roam, the nearest; brothers (4) on the snow line between the crest path and the Stone, 23,5;
   eagles (4) over the snow line south of the path, 22,14; snow trolls (2) in the snow at the
   crest's foot, 22,21, who do not roam, at 23, the far end. A fifth group (brothers, 3) would pay
   2,791, past the 2,600 asked.
9. **I11 pays 2,355 xp a member,** 1.00 times the doc's scaled share of 2,350 (the doc wins over the
   issue's 1,600). The area stands at 5,146; with the other scaled shares (12,850) it comes to about
   17,996, 1.01 times the ask (§8).
10. **The nest** is an event at 29,8 and a chest at 30,8 (`i11_nest_bones`: the Lantern's Badge and a
    Smooth Grey Part), up a spur off the crest path at 29,9 to 10, the eagles on the spur; D3's
    kestrels' nest is the precedent (an event and a chest). The hand-in (#56's 46) is #506's; the
    grey part is what #502's toll may take.
11. **Three items, new in `whitespine/items.ts`, priced 0** (no shop buys): the Lantern's Badge, the
    Smooth Grey Part and the Lantern's Instruments, the doc's "thing the Lanterns' halls take",
    whose taking is #506's. Their texts are seen, never explained.
12. **The finds:** the cairn at 27,1, just south of the trail's square, a Sapphire Vial and no gold;
    the hollow's chest 300 gold and the instruments (the doc's 300). I11 holds 300 gold, the area
    1,000.
13. **The Sheer is kept as the atlas cuts it:** the cliff 2 wide down the west, Ashfall's grey
    pines, grass, hills and ash west of it, reached only by a Mountaineer's climb down; three events
    carry the density there (`i11_ash`, `i11_scree`, `i11_fallen`). The lookout at the top, 6,9,
    sees Fire Mountain. Novelty claims terrain `cliff`, first used here.
14. **The snow line** runs down the crest's flank from row 1 to row 26: the last two or three
    columns of pines and the mountain's foot under snow, pines below it (west) and rock above
    (east); the camp, The last pines, at 20,12 under it.
15. **The brothers who keep the Stone** are a thing seen: `i11_keeper` at 28,1, the snow on its
    shoulders that does not melt. The monks' shrine at the Stone's foot, 29,1, trains endurance,
    its eleven pebbles.
16. **The site "Peak Stone" loses `planned`,** and the `highspine` zone row gets its map and its
    crossing words.

Decided by delegate for #502, each the owner's to overturn:

1. **I10 is banded 22–24, not the doc's 23–24.** The curve wants a map's hardest group at least the
   larger of its floor plus one and its top less two, which at 23–24 is 24, and only the king alone
   is that: the brief's group, the king and two giants, is 23.3. Banded from the area's floor, as
   Highcell's upper house and I11 are, it keeps that group with the king its leader. The gate
   judges the box at 22 and the king at 22 and 24 (58% and 79%); as it measures a fight he is 56%
   at 23 and 97% at 25, so "about half at 23, nearly always at 25" holds. The other way: the king
   alone as the boss, as the Abbot is, and the giants a group of their own, which loses their
   breaking when he falls.
2. **The giants sweep** (`sweep: { chance: 0.25 }`, bare: an arm, the front row), both. The Stair
   Giant is MONSTERS §3.3's sweeper, the brute come down whole to 0.85 of its line: 632 hit points
   to 537 and 5d7+8 to 4d7+8; its xp (1,827) and gold (70 to 160) are kept.
3. **The Stair-king is tuned by the gate, level 24 kept:** 1,381 hit points to 1,650 and 24d8+24 to
   16d8+16, sweeping a turn in four; xp 15,253 and gold 250 to 500 kept. 1,600 and 18d8+18 was 73%
   at 24, under the limit; 1,700 and 15d8+15 was 38% at 22, which drops the map's floor figure
   under 80%. He is listed off the line, as the Abbot is (`OFF_LINE`, `tools/tests/harness.ts`).
4. **The king's group** `i10_king` stands at 2,20, the Stair's top step: the king and two giants,
   he their leader, not roaming, not coming back, with a slain line. The Stair (the road at 0,20 and
   1,20 between the Sheer's cliff and the seat's rock) is reached from the top only through 2,20,
   so no company goes down unasked. A Mountaineer can still climb down the Sheer anywhere, as at
   I11.
5. **The toll** (`TOLL`, exported from the map) is 1,500 gold: inside the 5,000 window, about what
   the range's finds hold before the head (J11 700, I11 300, Highcell 600, so the range pays its
   own toll if nothing else is spent) and under the dearest ware the pass wears (2,050). The
   answers: pay; give him the grey part (I11's nest); give him the faceless coin (Thornmark's, #56's
   9); refuse. Each of the three sets a flag, `toll_paid`, `toll_part` or `toll_coin`, for #506's 47
   to read. The ask is the doc's toll line, and the part's answer carries *We were on this mountain
   before anyone came down the sky.*
6. **The hoard** is under the seat, a slab of rock: a hollow at 2,18 (the chest `i10_hoard`: 1,200
   gold and a Bear Spear +1, Rimewater's rung at 2,050, the area's dearest find) and 2,19 (the
   doc's hoard line, `i10_hoard_seen`), walled in rock (the Sheer's cliff at 1,18 and 1,19 made
   rock, so no climb reaches it), its one mouth the king's square. A company that paid walks through
   his square (a group answered stands aside and is walked through, MONSTERS #544's 4), so it can
   rob the hoard: the game has no chest kept shut while its group stands. For the owner: accept it,
   or a systems call.
7. **The Stair and the head:** the road leaves the trail at 23,20 and runs west to 8,20, the
   atlas's link end (272,306); the head is cut stone at 2 to 7,20, 3 to 7,21 and 5 to 7,19, the
   Stair road at 1,20 and 0,20 through the Sheer to the west edge. The atlas draws no road for the
   link, so the edge check's square 0,20 was owed to #510 (`EDGES_OWED`, `tools/tests/pillars.ts`),
   which lays H10's 31,20 as road against it and empties the list.
8. **The Stair in snow,** `i10_stair` at 13,20 on the road short of the head: a giant and a snow
   troll, not roaming, respawning at 2880, snow drifted round them (rows 18 to 22, columns 10 to
   16). The drift at 12,21 (*The wind did not lay it.*) and burnt bones by the trail at 20,16 are
   things seen.
9. **Three groups, the brief's encounters, not §4.5's seven:** eagles (3) in the pines nearest the
   way in (17,25), the Stair in snow and the king's. The king's alone pays 3,151; four eagles would
   pay 4,343 (1.24 times its share), three pay 4,197.
10. **I10 pays 4,197 xp a member,** 1.20 times the doc's scaled share of 3,500 (the doc wins over
    the issue's 2,400), under the 4,375 cap; 1,046 to a company that pays the toll. The area stands
    at 13,525; with I9, I8 and the side quests' scaled shares (5,550) it comes to about 19,075,
    1.07 times the ask (§8).
11. **Stairwatch** is the rock south of the head (3 to 8,24 to 25; 4,26; 7 to 8,26; 4 to 7,27), the
    chimney a secret door at 6,24 off the pines, its shaft 6,25, the ledge 5,26 and 6,26. The
    ledge's event `i10_ledge` is at the atlas's site, 6,26 (270,312), and the site loses `planned`,
    as Spine Summit's did. The hints are the rope's wear at 6,23 (the secret's `hint`) and smoke at
    9,22. The old champion (5,26) has words only; #448 keeps his trainer entry and the night on the
    ledge.
12. **The caravan** short of the head: the caravan-master (18,19) and the wagons (18,21) east of the
    Stair in snow, and his girl (6,19) at the head, off the road. People with words only, as J11's
    herder; #506's 47 makes the quest.
13. **The issue's secret, the maintenance mark,** is a thing seen on the toll-stone (`i10_tollstone`
    at 4,21: a ring with a bar across it), not a door; the doc's secret, the chimney, is the box's.
14. **The shrine older than the monks'** is at 7,21, of might, a stone hand held out; the cairn at
    the trail's crossing, 22,21, holds a Sapphire Vial and no gold; the camp, The drovers' fire, is
    at 11,28.
15. **Novelty claims the family `giants` alone:** `uses()` has no token for sweep (as G10 found),
    and `encounter:choice` is Thornmark's (#645). The toll is the second choice put before a fight,
    and §2 says so.
16. **The trail behind the north ring:** 19,1 is pine and 18,2 road, not the scaffold's road at
    19,1, which sat behind the ring square 19,0 against the atlas's mountain at 283,285 (the edge
    check).
17. **The Stone's ring** (#501's 6) is closed round on I10's row 31 by the mountain at 26 and 28 to
    30, the trail at 27 its one way north.

## 10. Names

The Whitespine's naming pass, by the rules of `docs/NAMES.md`: the range keeps the Crown's and the
Lanterns' English, as Sunderwood did (NAMES §4), since the only people who live here are a monastery
founded from below and the giants, who have no names on the map. Chosen for #444 (#443, call 2).

- **The tongues.** The monks' own speech is Kiln-script, the dwarves' old script (MONSTERS §8.1),
  which is the crew's maintenance language (DESIGN §9, Act III): they have no tongue of their own,
  and a dwarf or a Linguist reads what they say to each other. The giants' words for the Stair, if
  any, are the king's to hint and never the map's.
- **The names:**

  | Was | Now | What it means | Also thought of |
  |---|---|---|---|
  | the Monastery | Highcell | a monastery is cells, and this one is high | Bellhouse, which says too much; Spine Abbey |

- **Kept:** the Whitespine, the Crown's name for the range; Monks' Vale, the High Spine and Sheer
  Point, the zones, each a place and a plain thing; the Giants' Stair, which the giants gave their
  name to and not the other way; Stairwatch, Spine Summit and Rook's Nest, the Lanterns' names for
  the three places where the third prestiges wait (DESIGN §5), each one place and one name; the
  Peak Stone, as the Grove Stone and the Tide Stone are; the Sheer, lettered on the plan's rows as
  Kestrel Edge and the Scarp are (docs/areas/saltreach.md §10).
- **Ids stay:** `monastery` is the dungeon's id under its new name and `monastery2` its lower
  house's, `whitespine`, `monksvale`, `highspine` and `sheerpoint` the plan's.

## 11. What was cut

- **K11 and K12,** Monks' Vale's east under the pass: 353 squares of land, 168 walkable, and 544,
  218 walkable; mountain and pine with nothing on the atlas or in the docs but the monastery's
  plate, which moves to J11's gate (§9). The maps of the J column end in them.
- **The slivers** in Rimewater's and Ashfall's boxes: K10 holds the pass's road as Rimewater's
  (#491) and H10 the Stair's foot as Ashfall's (#510); the rest, about 110 squares of mountain at
  the zone line, goes with those boxes' edges.
- **The country behind** is not cut: J10, I12 and J12, 2,771 squares of land, 1,277 walkable, are
  parked (#508), to be built when the act has been played.

About 900 squares in all cut, to come back as country only if the act plays short.

Owed, from J11 (#499):

- **The monastery drawn tall** over one square, as the brief asks, needs a `Landmark` kind besides
  the lighthouse's (`src/game/map.ts`, `src/ui`): a systems change the owner may ask for. J11 draws
  it as a block of building squares on its shelf (§9, #499's 5).
- **The pilgrims' hostel's cellar,** the issue's secret, is not built: the doc's store behind the
  wall is (§4.2, §9, #499's 14).

Cut and owed, from Highcell (#500):

- **The sparse groups:** four for the brief's sixteen, the pay held (§9, #500's 3). The upper house
  sits at 11.80 fights to a rest, over the aim, and four brothers by the cells would make it about
  9.4 and the pay 4,328 (§9, #500's 7).
- **The Abbot's robe opening as it is hurt** waits on a systems change, the owner's to ask for: a
  drawing is not told its monster's wounds (§9, #507's 5). The slain line says the robe as the
  Abbot falls (§9, #500's 16).
- **The issue's own secret,** the bells' pattern on the frame, hinted by the lighthouse keeper's
  log, is not built: the undercroft behind the seat is, as §4.3 has it (§9, #500's 14).
- **The Novice's letter** is #506's and **the Laureate's** trainer entry is #448's; both stand as
  words only (§9, #500's 11 and 12). The chapter's Highcell entry (§5) is #505's.

Owed, from I11 (#501):

- **The Eagles' Nest hand-ins.** The Lantern's Badge and the Lantern's Instruments, which the
  Lanterns' halls take, are found and not yet taken; the Smooth Grey Part is what the toll at the
  Stair's head takes (#502, §4.5). The quest, #56's 46, is #506's (§9, #501's 10 and 11).

Cut and owed, from I10 (#502):

- **Three groups for the brief's seven,** the pay at 1.20 times its share already: a fourth eagle
  would take the box to 4,343, 1.24 times, near the 4,375 cap (§9, #502's 9).
- **The hoard can be robbed once the toll is paid.** The game has no chest kept shut while its group
  stands, and a company that paid walks through the king's square to the hollow: the owner may
  accept it or ask for a systems change (§9, #502's 6).
- **The issue's own secret,** the maintenance mark, is a thing seen on the toll-stone and not a
  door: the chimney to the ledge is the secret, as §4.5 has it (§9, #502's 13).
- **The Stair's foot** was owed to #510 with the rest of H10, and is built: its 31,20 is road against
  I10's 0,20 and `EDGES_OWED` is empty (§9, #502's 7).
- **The Toll and the ledge.** The Toll (#56's 47) is #506's, with the caravan-master, his wagons and
  his girl as words only and the flags `toll_paid`, `toll_part` and `toll_coin` for it to read; the
  old champion on the ledge has words only, his trainer entry and the night on the ledge being
  #448's (§9, #502's 5, 11 and 12).
