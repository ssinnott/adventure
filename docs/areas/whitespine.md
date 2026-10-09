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

Nothing is built. Its content will be `src/content/areas/whitespine/` (maps, monsters, items,
climate, its part of the world map, its chapter of the one quest, The Bells, in `chapter.ts` and
its side quests in `quests.ts`); it has no town, so no rooms. Its ids: the area `whitespine`, its
zones `monksvale`, `highspine` and `sheerpoint`, the monastery `monastery`, which stays under its
new name (§10).

---

## 1. Where it is

The atlas (`src/content/areas/whitespine/atlas.ts`, spread into the plan, §3) makes the Whitespine
three zones:

| Zone | Band | Squares | Built |
|---|---|---|---|
| Monks' Vale | 22–23 | 3,402 | none |
| The High Spine | 23–24 | 3,118 | none |
| Sheer Point | 23–24 | 1,396 | none |
| The area | 22–24 | 7,916 | none |

Squares are land without shallows or rivers. The area is about 7.7 zone maps (EXPANSION §1 has
7.7), and only 3,961 of its squares a company could walk: more than half of it is mountain and peak
(Monks' Vale mountain 1,316, pine 904, hills 448, peak 400, grass 334; the High Spine pine 1,559,
mountain 955, peak 395, cliff 105, hills 62; Sheer Point mountain 457, pine 446, peak 320, hills
134). It runs from the Sheer at x 264 east under Coldmere's pass, and from the Point's tip at about
y 226 south to y 372, where the range runs on. The zones' bands are the folder's: the atlas gives the
area 22–24 and the boxes rise through it (§4).

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
  through the range). Rimewater's pass box is #491.
- **West: the Sheer,** the cliff down the range's west side at x 264–272 from y 272 to y 372,
  walling Ashfall (24–26) off; the Giants' Stair is the road through it, from the head at 272,306
  in I10 to Ashfall's H10 at 258,306 (`src/content/atlas.ts`; #510 builds the foot). North of the
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
and its toll is the first choice put before a fight (#544). Four of the third prestiges' places lie
here and are built with it (#448): Stairwatch, Spine Summit, Rook's Nest and the bell tower.

Nothing trains or sells here (#443, call 7): Rime Lodge teaches to 23 behind and Cinderport to 27
ahead, so a company carries what it has over the range. The weather is the range's: snow on the
crest the year round, wind, cloud below the peaks; clear and bitter at night.

## 3. What is built

Its atlas rows (`src/content/areas/whitespine/atlas.ts`, #498): the zones with their bands (Monks'
Vale 22–23, the High Spine 23–24, Sheer Point 23–24), Highcell at 23–24 with its plate at J11's
gate, 322,342 (moved from K12's, §9), its sites (the Peak Stone, Stairwatch, Spine Summit,
Rook's Nest and the Giants, its own; the Sheer, the plan's, §10) and its links: the pass in, the
monastery's way in, the Giants' Stair and the ridge trail (#443, call 3). The folder is spread into
the plan (`src/content/atlas.ts` imports it where its rows were), as Saltreach's was before #170:
the area cannot be listed in AREAS until #499 gives it a map, which points the area's `atlas` at
the folder and takes the import out.

Its ground (#543): peaks (`A`) and cliffs (`|`), the mountain's rock to walk into, see and climb,
with the road through them plain road, so the scaffold drafts each box square for square (J11's 202
peaks, I11's 48 peaks and 64 cliffs) and the view draws a summit and a face (docs/SLICE.md).

Its row on the curve is in (#542), in `src/content/progression.ts`, planned until #499 lists the
area (band 22–24, next 24, window 5,000). It has no step on the gear ladder, no town to sell one:
Rime Lodge's rung is the pass's, and Cinderport's step (docs/areas/ashfall.md §4.4) comes two
levels on. Nothing else is built but its eight monsters (below). The systems it waits on are the
rest of #442's: the toll (#544), sweep (#545), stone (#546), the crossings (#547), the Ember Stone
(#548) and the bot (#549).

The monks are drawn (#507), three of MONSTERS §8.1's eight, ahead of the boxes that place them: the
Brother, the Bell-ringer and the Abbot, robed on the keepers' frame (`src/ui/monsters/keepers.ts`).
Their defs are in `src/content/areas/whitespine/monsters.ts`, listed in `AHEAD`
(`src/content/index.ts`) until #499 lists the area, and each is owed in `UNPLACED`
(`tools/tests/maps.ts`) to the issue that places it: the Brother to #499 and the Bell-ringer and the
Abbot to #500. §9 has the decisions.

Three more on frames that exist are drawn (#507), the Spine Eagle on the birds', the Snow Troll on
the ogre's and the Ashen Mason on the cultists', in the same file and list, each owed in `UNPLACED`
to the first box whose brief places it (§4): the eagles and the troll to J11 (#499) and the masons
to I8 (#504). §9 has the decisions.

The giants are drawn (#507), a new family on a frame of their own (`src/ui/monsters/giants.ts`): the
Stair Giant and the Stair-king, ahead of the box that places them. Their defs are with the monks', and
both are owed in `UNPLACED` to I10 (#502), whose brief places them (§4.5). §9 has the decisions.

## 4. What is still to build

All of it: 7,916 squares of land, 3,961 of them walkable. On the grid (§1) the plan is eight boxes
and a dungeon, five boxes on the road and three behind; the five hold 5,138 of those squares, 2,199
of them walkable:

| Box | Name | Zone | Kind | Band | Land | What is there | Its step of the quest | Issue |
|---|---|---|---|---|---|---|---|---|
| J11 | Monks' Vale | Monks' Vale, the High Spine | core | 22–23 | 1,024 (mountain 342, hills 264, grass 214, peak 202) | the pass's foot at 318,318; Highcell's gate at 322,342; Spine Summit at 300,328; the herder | the bells; the monastery | #499 |
| | Highcell | | dungeon, two levels of 16×16 | 23–24 | | the cloister and the cells; the bell tower; the chapter house and the Abbot | | #500 |
| I11 | The Peak Stone's box | the High Spine | core | 23 | 837 (pine 536, mountain 210, peak 48, cliff 42) | the Peak Stone at 292,318, whole; the ridge trail's foot; the eagles' nest | none | #501 |
| I10 | Stairwatch and the Stair's head | the High Spine, Sheer Point | core | 23–24 | 961 (pine 665, mountain 194, peak 85, cliff 17) | the Stair's head at 272,306 and the toll; the Stair-king; Stairwatch at 270,312 | the Stair and its toll | #502 |
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

**Two boxes hold land of two zones.** J11 is Monks' Vale with 110 squares of the High Spine on its
crest, and I10 is the High Spine with 65 of Sheer Point at its north edge. A map is its whole box
(EXPANSION §8.2), so each is built to its edges and the zone line runs inside it; the zone a square
belongs to decides only its crossing line (#166) and its band. Each is laid in its larger zone (§9).

**The order** is the road's, and the quest's: J11, the only box that meets Coldmere's pass, and
Highcell behind its gate; I11, over the crest to the Stone; I10, the Stair's head, where the road
goes down; I9 and I8, north along the ridge to the Point. Building waits on #442's systems (§3) and
on the two-areas rule (EXPANSION §3); the briefs and the drawings do not (#445).

The places, as the atlas and the docs have them:

| Place | Box | What the docs say | On the atlas |
|---|---|---|---|
| Highcell (the Monastery) | J11, and below | the monks died long ago and the Custodian's hands keep the monastery in their robes; its bells ring the eleven (DESIGN §9, STORY); the chapter house and the Abbot (MONSTERS §8.1); the Bard's third prestige in its bell tower (DESIGN §5); the Novice (#56's 45) | a planned dungeon, its plate moved from 330,356 to the gate at 322,342 |
| The Peak Stone | I11 | whole: the Whitespine has no Rifts (MONSTERS §2.1); a Lantern came to survey it and never came down (#56's 46) | a planned stone at 292,318 |
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

### 4.3 Highcell (#500): dungeon, two levels of 16×16, band 23–24

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

### 4.4 I11, the Peak Stone's box (#501): core, band 23

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

### 4.5 I10, Stairwatch and the Stair's head (#502): core, band 23–24

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
  before anyone came down the sky; or fight. His words hint and never say (#443, call 1).
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
with them the toll, a choice before a fight (#544), and sweep, one blow at every member of a row
(#545); cliffs and peaks with the road through them (#543); a machine in a robe, which holy light
passes through, and a bell that holds (MONSTERS §8.1). Its landmarks: a monastery kept by what did
not build it, a whole Stone with the snow stopped round it, a stair cut in a cliff, a causeway of
shards over the sea.

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
  briefs are settled.
- **Gold.** Training six members from 22 to 24 costs about 10,800 with today's `trainPrice`, but
  nothing trains here (#443, call 7): the gold goes over the range to Cinderport, which teaches to
  27, and the third prestiges ask quests, not gold (DESIGN §5). The band's price window is 5,000
  (#542), and no find or ware in the area comes near it: the pass has no step of its own and wears
  Rimewater's rung, 1,750 to 2,050 gold with its pluses. The toll is set with #544 inside the
  window, dear enough to be a choice and never a wall. A clear should still pay the training, in the hoard, the
  undercroft and the trolls' cave.
- **The gate.** The gate check (`tools/tests/gate.ts`, #38) holds each box at its own floor: a
  company at 22 wins nine in ten of J11's fights and walks the road from the pass's foot to the gate
  resting at its camp; one at 20 wins no more than one in four. The Abbot is won about half the
  time at 23 and nearly always at 25; the Stair-king the same. The bot must know the toll (#549): it
  refuses, so that the gate measures the fight.
- **Density.** Core boxes at the Foreland's floor, country at the looser one (EXPANSION §5.3),
  measured over the squares the mountain leaves.

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
- **Ids stay:** `monastery` is the dungeon's id under its new name, `whitespine`, `monksvale`,
  `highspine` and `sheerpoint` the plan's.

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
