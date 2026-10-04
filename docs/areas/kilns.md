# The Kilns: step VI of the road, the dwarves' country

The sixth step of the road of levels (DESIGN §9, EXPANSION §2.2), band 16–18, and the first of Act
III, The Deep Script: the Iron Fells over the east road from Lanternwood, with the dwarves' great
hall and their deepest mine; the Kilns' heart, the hill country of spoil, smelter and ash where the
dwarves cut their own Anvil Stone to sell the pieces; and Kilnmouth, the farms running down to
Kilnhaven, the ore port, whose ship is one way to the far side of the sea. This is its area doc
(EXPANSION §4, §6 and §8.2): where the atlas puts it, what the atlas and the docs put in it, the
plan for building it, box by box, and the briefs. Its work is filed under #436 (Phase 1.3, #431):
the boxes as §4's table has them, the Tiefzeche (#462), the Anvil Stone's Rift (#465), Anvilhall
(#459) and Kilnhaven (#469), its chapter (#470), its side quests (#471), its drawings (#472), its
rooms (#473) and the country behind the road (#474). This doc is #456. The systems it waits on are
#432's (§3), the owner's calls for the act are #434's (§9) and its names #435's (§10). Figures are
measured on main at `6032251` (2 October 2026) with `worldGrid` (`src/game/atlas.ts`).

Its first seven boxes are built: M3, the Iron Fells' way in (#457, §4.2), which lists the area; N3,
Anvilhall's box (#458, §4.3), and with it its first town, Anvilhall, behind N3's gate (#459, §4.4);
N4, the Tiefzeche's box (#461, §4.6), the heart's first, and under its shaft the Tiefzeche, its
first dungeon (#462, §4.7); N2, Erzkamm (#460, §4.5), with the Barbarian's second prestige; N5,
Gluthutte's box (#463, §4.8), the smelter in the charcoal woods; and N6 and M6, the roads south and
west (#467, §4.12), M6 Kilnmouth's first. Eleven of its monsters and its twelve rooms are drawn
(§3), and the rest is to build. Its content is
`src/content/areas/kilns/` (maps, monsters, items, rooms, climate, its part of the world map and its
walkthrough; its chapter of the one quest, The Anvil Stone, in `chapter.ts`, and its side quests in
`quests.ts`, to come) and its businesses' rooms `src/ui/interiors/kilns/`. Its ids: the area
`kilns`, its zones `ironfells`, `kilnsheart` and `kilnmouth`, the towns `anvilhall` and `kilnhaven`,
the dungeons `deep_mines`, `anvil_stone` and `lava_tubes`. The ids stay through the naming pass
(§10, NAMES §3).

---

## 1. Where it is

The atlas (`src/content/areas/kilns/atlas.ts`, the area's own since #457, §3) makes the Kilns three
zones:

| Zone | Band | Squares | Built |
|---|---|---|---|
| The Iron Fells | 16–17 | 3,059 | M3, N3, N2 |
| The Kilns' heart (`kilnsheart`, "The Kilns" on the atlas) | 16–18 | 6,933 | N4, N5, N6 |
| Kilnmouth | 16–18 | 4,799 | M6 |
| The area | 16–18 | 14,791 | M3, N3, N4, N2, N5, N6, M6 |

Squares are land, without shallows or rivers: about 14.4 zone maps, and 12,399 of them a company
could walk. The rest is the rim's mountain in row 1 and the P column, the Fells' peaks and the
heart's crags. The Fells are hills, mountain, pine and grass; the heart hills and grass with
mountain, rock and 363 squares of ash round the vents; Kilnmouth grass, farm, hills, heather and a
little wood. The bands are this doc's, written on the atlas's rows (§9): the area is 16–18 and the
boxes rise through it (§4).

The squares are the plan's, before any box. M3 (#457), laid whole in the Fells, takes the 554 of
Lanternwood's squares in its west with it, as a map laid in one zone does (§4), and seeds the zones'
walk from every square of it. The line between the Fells and the heart is held on the seam of rows
3 and 4 by seeds in the area's atlas rows, so N4 and O4 are the heart's whole and N3's and O3's south
rows the Fells'; M4's north, about 400 of Lanternwood's squares, goes to the Fells, parked land
nobody walks yet (§9). N3 (#458), laid whole in the Fells, was the Fells' already, square for square;
seeding the walk from it moves 62 squares between zones elsewhere on the world, none on a built map.
N4 (#461), laid whole in the heart, was the heart's already too, and seeding the walk from it moves
1,004: the heart takes M4's south-east (415 squares, the Fells' and Lanternwood's), M5's north-east
(198 of Kilnmouth's), N5's west (271 of Kilnmouth's, which laying N5 in the heart gives it anyway,
§4) and 35 squares of N6 and O6. It is parked land and boxes the plan lays in the heart, and none of
it is held (§9). The seam's seeds under N3 and N4 go, since the two boxes hold their own rows.
N2 (#460), laid whole in the Fells, was the Fells' already too; the void under the rim it draws as
mountain adds 248 squares to them, and seeding the walk from it moves 107 squares between zones
elsewhere on the world, none on a built map.
N5 (#463), laid whole in the heart, gives it the last 10 of Kilnmouth's squares in its west, and
seeding the walk from it moves 1,852: the heart takes 165 of M5's squares and 971 of M6's and N6's,
Kilnmouth's but for 210 of Cairnmoor's; 241 of High Moor's in O6 and P6; and 380 of Cairnmoor's own,
in M7, N7 and O7. About 85 more change hands between zones elsewhere on the world, none on a built
map. M6, N6 and O6 take their own squares when they are laid, M5 is parked and P6 cut, and
Cairnmoor's row holds its own when its boxes are laid or its rows seeded (§9).
N6 and M6 (#467), laid whole, N6 in the heart and M6 in Kilnmouth, settle M6's 517 squares to
Kilnmouth, 422 of them the heart's and 95 the Cairnfield's; N6 was the heart's already. Seeding the
walk from them moves 2,262 in all: Kilnmouth takes 59 more of M5's from the heart and 815 of
Cairnmoor's in K7, L7 and M7, and the heart 46 of High Moor's in O6 and P6 and 735 of Cairnmoor's in
N7, O7 and P7; about 90 change hands elsewhere, L6's and Lanternwood's edges among them, none on a
built map. Row 7, Cairnmoor's, held 2,002 of the Kilns' squares until Cairnmoor's first box, N7,
seeded its rows (#476): the row is the moor's again, and High Moor holds O6's south and P6 until O6
is laid (docs/areas/cairnmoor.md §1, §9).

**The grid** (EXPANSION §8.2; docs/areas/shelf.md §1). The Kilns are the L to P columns from row 1
to row 6, with K6 on the shore. The land worth a map is fourteen boxes: M3, N3, N2 and O3 in the
Fells; N4, O4, N5, O5 and O6 in the heart; N6, M6, L6, M4 and M5 in Kilnmouth. The rim's row (N1,
O1, P1), the east edge under it (P3 to P6), O2, the slivers in M2, L4 and L5 and the heath of K6 are
cut (§11); O3, O4, M4 and M5 are the country behind the road, parked (§4.14).

Its edges:

- **North: the rim,** about nine squares deep along the whole area, with the Fells' tops under it:
  snow on them in winter.
- **West: Lanternwood,** Sunderwood's last zone (14–16), 84 squares of border with the Fells. The
  east road comes out of Lanternwood's M2 (#202) and into M3 at about 404,70 to 416,84
  (`src/content/atlas.ts`), open from the start (EXPANSION §2.2): the only way between the two
  areas. South of the Fells, Kilnmouth meets Lanternwood over the mountains on 69 squares with no
  way through (docs/areas/sunderwood.md §1).
- **South: High Moor,** Cairnmoor's first zone (18–20, Act III's second step), where the drove road
  runs on out of N6 at about 430,196 into Cairnmoor's N7 (the atlas's link, 430,196 to 432,212),
  open from the start. Cairnmoor has no town (#434, call 9): the drove road's coach runs from
  Kilnhaven to Rime Lodge (§4.13).
- **East: the rim** again, the P column, mountain and hill with the heart's crags under it.
- **South-west: the sea,** off Kilnhaven. Two crossings leave the port, both open from the start:
  the ferry to Saltmouth (`kilnhaven` to `saltmouth`, `sea`, "the ferry") and the Compact ship to
  Cinderport ("Compact ship"), the atlas's links. A company may come to the Kilns by water before
  it comes by road; the band's monsters are the gate (EXPANSION §2.2, §5).

The ways, as the atlas draws them. The east road enters M3 and the atlas's trail runs from 410,76
south-east to 430,96 and on to 446,118, past Anvilhall's gate at 452,70 (its spur in N3) and the
Tiefzeche's mouth at 440,96 (N4); the drove road runs south from 446,118 through 440,150 (N5, by
Gluthutte at 436,126) to 428,180 (N6) and out at 430,210 for Cairnmoor, with the branch west from
428,180 through 412,162 (M6) to Kilnhaven's gate at 398,164 (L6). The Anvil Stone's cut is east of
the drove road at 468,142 (O5) and Feuerstollen's mouth at 478,178 (O6), under a ridge of lava vents
from 479,171 to 484,184. Erzkamm stands north of Anvilhall at 432,44 (N2). The area has no river.

`node tools/worldmap.ts out.png --zones` paints it.

## 2. What it is for

The first third of Act III (DESIGN §9): *what are the Stones?* The Kilns are where the machine is
first met. The dwarves' scripture is carved over every door and read aloud at every forge, and read
the old way, word by word, it is signs: the holiest verse in Anvilhall's great hall, THE FIRE IS
KEPT BELOW AND NOT ABOVE, is a warning painted on a boiler, and the lowest door of the deepest mine
says CREW ONLY (STORY, Act Three). Kiln-script is the act's own mechanic, read and never needed
(#434, call 2; #538): a dwarf reads it, a Lantern teaches it, a scholar's copybook fakes it, and
each inscription read gives a hint in the machine's words, finds a service ladder or marks one of
the machine's mouths on the world map. The dwarves have been cutting their own Anvil Stone for years
and selling the pieces to the smugglers, who sell them below: *the mountain has to eat.* The thane
puts the choice to the company the way a business puts its menu: buy the Stone back, or take it;
either way the Warden of the Anvil must fall for the tear to close, and the thane never forgives
(#434, call 1). Under the Tiefzeche the dwarves' tunnel ends and a clean, humming corridor begins,
and the things that live in it come up into the mine knocking on the rock: the first machines on
the road, after two acts of none (MONSTERS §2.2, #158). In the dust before the door that will not
open are hundreds of footprints walking down, and a loop inside a loop scratched on the frame at a
girl's shoulder. The act's one story lock is not here (#434, call 4; #440): it is the sealed bay
under Coldmere.

The weather is the dwarf country's: dry, hot by the forges, ash on the wind near the tubes, and snow
on the Fells' tops in winter (the area's `climate`, with its first box).

## 3. What is built

Seven boxes, a town and a dungeon: the area's first box, which lists the area (#457); the box of
its first town (#458) and the town behind its gate (#459); the box of its first dungeon, the heart's
first (#461), and the dungeon under its shaft (#462); the crag north of Anvilhall, off the road
(#460); the smelter's (#463); and the roads south and west (#467):

- **The Iron Fells' way in** (M3, `ironfells_m3`, country, band 16; #457): the east road out of
  Lanternwood's M2 over the ridge, through the last of Lanternwood's trees with pines at the verge,
  over the pass between the Fells' first tops and onto the trail's head; then the pinewood under the
  mountain to the east edge, where the trail runs on into N3. The lookout west over Lanternwood from a
  knoll at the pass, the woodcutters' camp and a woodcutter under the shoulder, the cairn on the
  shoulder, the milestone and the ruts off the trail and the woodcutters' felling; at the box's far
  end a crag with the old adit in it, walled, the dwarves' cold hearth by its mouth and the first
  spoil heap below it. Three groups: fire beetles at the heap's toe and more on its west side; a rock
  worm in the adit's cut. Behind the wall, the Hand's wagon stage (§4.2).
- **Anvilhall's box** (N3, `ironfells_n3`, core, band 16–17; #458): the trail on from M3 across the
  box's south-west corner and out for N4, and the spur off it north-east up the open fell and the
  stair beside the dwarves' terraces to the forecourt under the crag, where the gate at 28,8 is the
  way into Anvilhall (#459). The outer workings and their warm spoil, an adit in the
  west hills and a working in the crag; the burying ground, the cairn, the hall's air coming up
  through the turf and an old bloomery on the fell; the carters' camp under the knoll; the tithe-house
  at the terraces' foot, the mother at the terrace well and the lookout from the top terrace. Four
  groups: slaglings on the trail by night, beetles and salamanders on the two heaps and a rock worm
  in a collapsed working. Under the lowest terrace, the tithe-cellar, and over its wall the niche,
  the first inscription read (§4.3).
- **Anvilhall** (`anvilhall`, town, band 16–18; #459): the dwarves' hold behind N3's gate, a court
  cut down into the hill with the great hall at its head, where the Lantern reader reads the verse
  and the thane sells the Stone back or loses it; the smiths' forge, the old working that trains to
  19, the inn, the mine-surgeon's and the stores (§4.4).
- **The Tiefzeche's box** (N4, `kilnsheart_n4`, core, band 16–17; #461): the trail on from N3 over
  the line into the heart, down across the box to the drove road's head and out south for N5. The
  headworks at the foot of the first crags: the spur to the shaft at 16,2 and the cage's gate on it,
  the way into the Tiefzeche (#462); the winding house with its tally board, the lookout from the
  gantry, the crust on the fence and the lamp-niche over the shaft with the miners' blessing cut above
  it. The miners' camp and a miner on the grass west of the trail, a cairn on the knoll, an ore tub by
  the trail, a spring under the crag, the old workings' open cuts, the drovers' fold and the smelter's
  smoke past the south edge. Four groups: beetles and salamanders on the fresh spoil below the shaft
  and a rock worm in each of two open cuts. Behind the fresh mortar in its wall, the wagon yard (§4.6).
- **The Tiefzeche** (`deep_mines`, `deep_mines2` and `deep_mines3`, dungeon, three levels of 16 by 16,
  band 16–18; #462): down N4's shaft by the cage. The workings, timbered, the hymn's three doors and
  the crust on its ledge, the hewer at the face, beetles and a rock worm; the old workings, the Hand's
  cages on their rails and what the cargo left in them, beetles and a pair of worms in their bores; and
  the bottom, where the pick marks stop at a smooth face with a square hole cut through it and the
  clean corridor runs beyond: six knockers and a mender twice, the knockers' swept room behind a wall
  and the Foreman before the door marked CREW ONLY, which stays shut. Two service ladders, each
  behind a niche that reads LADDER, are the shortcut down (§4.7).
- **Erzkamm** (N2, `ironfells_n2`, country, band 16–17; #460): the open fell up out of N3 and the
  hills climbing to the crag under the rim, no road on it. In the crag's face the cave where the
  first ore was found: Hartmut at its mouth, who teaches the Barbarian's second prestige, Ironhide
  (#19), and inside it the wall the dwarves call the first blessing, which a reader reads KEEP CLEAR
  OF THE DOORS, with a scholar of Helmstow copying it (#56's 34, his words only). Below the crag the
  first ore-finders' spoil and their two adits; the camp in the crag's lee, the cairn on the crest
  and the lookout south from the Fells' top to Anvilhall's smoke. Three groups: fire beetles on the
  spoil, a rock worm in the west adit and a pair in the one under the rim. Behind a blank face in the
  cave, the doors the wall means, and before them the first ore-finders' hoard (§4.5).
- **Gluthutte's box** (N5, `kilnsheart_n5`, core, band 17; #463): the drove road on south from N4
  through the charcoal woods, over the stream at a ford and out for N6, and the cutters' track off it
  east for the Stone. The smelter at the woods' north edge with its spur and its yard: the verse over
  its mouth, the master smith at the anvil with a crown on its horn and the Compact's factor at the
  door; the slag heap beside it and the lookout from its top. The stream down off the fell with the
  smelter's weir, ore on the hillside under the mountain and fields at the woods' edge; the charcoal
  burners' camp and their clamps, a cairn of fire-bricks, the woodward's hut, a broken cart and an
  older smelter's slag gone to moss. Four groups: beetles behind the smelter and at the yard's foot,
  salamanders on the heap and a slag elder strayed onto the cutters' track. Behind the heap's laid
  face, the shard store (§4.8).
- **The drove road's last reach** (N6, `kilnsheart_n6`, country, band 16–18; #467): the drove road
  on south from N5 out of the charcoal woods over the open grass to the fork, where the branch goes
  west for Kilnhaven, and on south to the moor's first heather and out for Cairnmoor. The drovers'
  stone by the road, a dwarf caravan coming up it by day, the milestone, the drovers' camp and a
  drover at the fork; the dew pond, the cattle and the smoking ridge east past the grass; the heather,
  a curlew, the cairn at the border and the border's line on the road. Two groups: beetles on the
  verge and a rock worm at the far end. Behind the verge worn wide, the coach's old halt (§4.12).
- **The way to Kilnhaven** (M6, `kilnmouth_m6`, country, band 16–18; #467): the branch in from the
  fork past a lime cart, up through the farms, over the stream on a white bridge and west along the
  river's bank to the west edge before Kilnhaven's gate. The farmers' shrine, the farmer at his gate,
  the limed fields and a field barn; the lime kilns in a row in the hill, the quarry in its flank and
  the lookout from its top over the port and the sea; a cairn on the grass. Three groups: beetles
  at either end of the kilns and a rock worm under the fields. Behind the one draw-hole stopped with a
  dressed stone, the drover's cache (§4.12).

Its atlas rows are charted in `src/content/areas/kilns/atlas.ts`, the area's own `atlas` since M3
lists the area; until then `src/content/atlas.ts` spread them into the plan where its rows were, as
Saltreach's and Sunderwood's were before their first box (docs/areas/saltreach.md §9,
docs/areas/sunderwood.md §9): the zones with their bands (the Iron Fells 16–17, with M3, N3 and N2
laid on it and its line to the heart held, §1; the heart 16–18, with N4, N5 and N6 laid on it;
Kilnmouth 16–18, with M6, §9), the towns (Anvilhall and Kilnhaven at 16–18), the dungeons (the
Tiefzeche 16–18, the Anvil Stone 17–18, Feuerstollen 17–18) as planned plates, the Tiefzeche's now
its three levels' (#462), the sites (Anvilhall, the Deep Mines, the Forges, the Anvil Stone, the
Lava Tubes, Kilnhaven, Iron Crag, to be renamed with #435, §10) and its links: the east road in, the
towns' and the dungeons' ways in, the drove road on to High Moor, the ferry and the Compact ship,
and a new `coach` link, Kilnhaven to Rime Lodge, the drove road's coach (#434, call 9; #539 builds
it).

Its row on the curve, its step on the gear ladder and the Stone's price are in (#535). The row is in
`src/content/progression.ts`: band 16–18, next 18, window 3,500, owed to #436 while the area is built
box by box, with M3's, N3's, N4's, N2's, N5's, the Tiefzeche's, N6's and M6's 12,971 xp a member and
7,520 gold the clear's floor (§8). The step is in
`src/content/areas/kilns/items.ts`, made ahead of the area (`ITEMS_AHEAD`, `src/content/index.ts`)
so that the harness and the gate dressed by it before the first box took the table into its Area
(#457): Anvilhall's forge's eight
wares (`FORGE`, §4.4), the step's plus finds by 19 (§4.1), Kilnhaven's smith's prices at a quarter
more (`SMITH_PRICES`, for #469) and the thane's price for the Stone (`ANVIL_STONE_PRICE`, 6,000, for
#459, §8). The forge sells every ware (#459), and each find is owed to its box until it is placed;
N3's Plate Mail +3, N2's Mattock +1, the Tiefzeche's Forge Hammer +1 and M6's Seax +1 are placed
(§4.3, §4.5, §4.7, §4.12), and M3's, N4's, N5's and the Tiefzeche's finds, off the ladder, are their
own (§4.2, §4.6, §4.8, §4.7). The thane asks the price as an answer's `price` (§9).

Its crossings are written (#539), in `src/content/crossings.ts`: the ferry to Saltmouth, the
Compact ship to Cinderport and the drove road's coach to Rime Lodge, each on its link of the atlas
with its fare, its days and its hours, the same either way (§4.14, §9). The ferry lands on
Saltmouth's quay; every other end waits on its town, Kilnhaven's three on #469, and nothing is sold
toward a town not built, so none runs yet.

The systems it waited on were the rest of #432's: ash and pine underfoot (#536, built: ash, `a`, on
O6, slow going as hills are, and pine, `p`, on M3 and O3, a ground of its own where Sunderwood drew
its pine as forest, docs/areas/sunderwood.md §9, #200's 1; the scaffold drafts both, and
docs/SLICE.md says what was decided); Kiln-script and Linguist (#538, built: §4.1 says how a box
writes an inscription, and §9 what was decided); the crossings, the ferry, the ship and the coach
(#539, built: written above, and §9 and docs/SLICE.md say what was decided); the Anvil Stone
counting for the Hearth (#540, #168, built: §9 and docs/SLICE.md say what was decided, and the Rift
sets its flag, #465, not built yet); and the bot (#541, built: it puts cold on what fire does not
touch once it has seen fire do nothing, as it has since #161, and its company takes its prestiges,
MONSTERS §4.4). Regeneration, curse and calls (#537, built) are Cairnmoor's and Rimewater's; the
Kilns need none of them. `after`, for the Anvil Guard, and `when` are #41's; the machine `kind` is
MONSTERS §3.3's, first spent here. Its monsters are drawn in #472, eleven issues, all eleven now
(below), and its rooms in #473.

Drawn ahead of the boxes that place them (#472): the knockers, the Knocker, the Mender and the
Foreman (`src/ui/monsters/knockers.ts`), for the Tiefzeche's lowest level (#462); and the
salamanders, the Salamander and the Great Salamander (`src/ui/monsters/salamanders.ts`), for the
spoil heaps and the tubes (#458, #463, #466). Their defs are in `src/content/areas/kilns/monsters.ts`,
the area's own since M3 lists it (`AHEAD`, `src/content/index.ts`, listed them until then), and each
was owed in `UNPLACED` (`tools/tests/maps.ts`) to the box that places it: the Great Salamander to
#466 still; N3 places the Salamander on its spoil (#458), and the Tiefzeche the knockers at its
bottom (#462). §9 has the decisions.

The six on frames that exist are drawn too (#472): the Fire Beetle on the spider frame, the
Slagling, the Slag Elder and the Warden of the Anvil on the riftling's, the Rock Worm on the long
bodies' and the Anvil Guard on the figure frame, in the same table, each owed a map by the box that
first places it (§7, §9): M3 places the beetle and the worm (#457), N3 the slagling (#458) and N5
the slag elder (#463).

The rooms are drawn (#473), one to each business of the two towns, ahead of the towns as
Saltmouth's and Lantern Watch's were. `src/content/areas/kilns/interiors.ts` lists them, the
area's `interiors` since M3 lists it (`ROOMS_AHEAD` in `src/content/index.ts` merged them until
then); Anvilhall's six open into theirs (#459), and `tools/tests/maps.ts` reports each of
Kilnhaven's owed to #469 until a business there opens into it; §4.4 and §4.14 name the ids. They
are a scene to a file in
`src/ui/interiors/kilns/`, what Anvilhall's share in `hold.ts` and what Kilnhaven's share in
`port.ts`. Anvilhall's are cut stone, iron and fire, the hammer and pick on the banners and the old
script cut over the doors: the great hall, a nave of square pillars up to the thane's seat with the
kings' forge glowing behind it and the verse cut red over all; the forge, the verse big over a
hearth under an iron hood, the great bellows, the anvil and the steel racked; the training hall, an
old working timbered like the mine and broken out onto the hillside, lifting stones and a round of
oak with axes in it; the inn, bunks cut in two tiers in the rock and an arch of candles on the
mantel; the mine-surgeon's, limewashed, the table under its lamp, a canary in the window and a niche
for the dead; the stores, racks to the roof and the mine's tub of potatoes on its rails. Kilnhaven's
are tar, rope and the ore's red dust: the inn, the coach for Rime Lodge in the yard through its
window; the smith, a forge of brick, an anchor in for mending and the quay through the stable door;
the training hall, an ore shed with a ring roped off and an ore tub on the hoist to hit; the
harbourmaster's office, the manifests on the desk under a bay of small panes on the harbour and the
board of sailings by it; the chapel, a ship hung from its tie beam and the sea through the window
behind the altar; the chandlery, candles in pairs and lamps hung from its rods. Every room has the
day in it somewhere, a window, a shaft, a breach or a door, so that nine at night is not noon.

## 4. What is still to build

All of it but M3, N3, N4, N2, N5, N6 and M6, built (#457, §4.2; #458, §4.3; #461, §4.6; #460, §4.5;
#463, §4.8; #467, §4.12), Anvilhall behind N3's gate (#459, §4.4) and the Tiefzeche under N4's
shaft (#462, §4.7): 14,791 squares of land, 12,399 of them walkable, the plan's figures (§1). On the
grid the plan is ten boxes, three dungeons and two towns, with four more boxes parked, and the ten
hold 8,419 of those squares, 7,686 walkable; the parked four 3,886 and 3,397:

| Box | Name | Zone | Kind | Band | Land | What is there | Its step of the quest | Issue |
|---|---|---|---|---|---|---|---|---|
| M3 | The Iron Fells' way in | the Iron Fells | country | 16 | 593 (pine 379, mountain 169, grass 37) | the east road in from Lanternwood at 404,70; the first spoil; the crossing line | none | #457 |
| N3 | Anvilhall's box | the Iron Fells, the heart | core | 16–17 | 1,024 (grass 525, hills 492) | Anvilhall's gate at 452,70; the trail; the spoil heaps | the verse; the thane | #458 |
| | Anvilhall | | town, 16×16 | 16–18 | | the thane and his menu, the forge under the verse, the Lantern reader, training to 19 | the verse read the old way; the choice | #459 |
| N2 | Erzkamm (Iron Crag) | the Iron Fells | country | 16–17 | 723 (hills 329, mountain 299, grass 95) | the crag at 432,44; KEEP CLEAR OF THE DOORS; the Barbarian's second prestige | none | #460 |
| N4 | The Tiefzeche's box | the heart | core | 16–17 | 1,024 (grass 641, rock 191, hills 99, dirt 92) | the mine's mouth at 440,96; the headworks; the miners' camp; the Hand's wagon yard | the way down | #461 |
| | The Tiefzeche (the Deep Mines) | | dungeon, three levels of 16×16 | 16–18 | | the workings, the old workings, the clean corridor; the Foreman; CREW ONLY | the door | #462 |
| N5 | Gluthutte (the Forges) | the heart, Kilnmouth | core | 17 | 946 (woods 497, hills 137, mountain 120, grass 82), 78 shallow | the smelter at 436,126 in the charcoal woods; the crown on the anvil | none | #463 |
| O5 | The Anvil Stone's box | the heart | core | 17–18 | 1,023 (hills 654, rock 178, mountain 145) | the Stone's cut and the Rift's way in at 468,142; the cutters' sheds; the Anvil Guard, `after` | the Stone | #464 |
| | The Anvil Stone's Rift | | dungeon, one level of 16×16, hand-built | 17–18 | | slag and iron; the Slag Elders; the Warden of the Anvil | the tear closed | #465 |
| O6 | Feuerstollen's box (the Lava Tubes') | the heart | country, with the tubes | 18 | 829 (ash 274, hills 273, grass 203, rock 50) | the vent ridge 479,171 to 484,184; the tubes' mouth at 478,178, two levels; the Great Salamander | none | #466 |
| N6, M6 | The roads south and west | the heart, Kilnmouth | country | 16–18 | 844 (grass 751, woods 49, hills 44) and 837 (grass 362, farm 323, hills 151), 60 shallow | the drove road out at 430,196; the branch to Kilnhaven; the lime kilns and the farms | none | #467 |
| L6 | Kilnhaven's box | Kilnmouth | core | 17–18 | 576 (grass 326, heather 170, hills 53, sand 15), 85 shallow | the port's gate at 391,162; the ore quay; the coach yard | the port | #468 |
| | Kilnhaven | | town, 16×16 | 16–18 | | the harbourmaster and his manifests, the smith, the ferry, the ship, the coach, training to 19 | the manifests | #469 |
| O3, O4, M4, M5 | The country behind the road | the Iron Fells, the heart, Kilnmouth | country, behind the road, parked | 17–18 | 937, 972, 974, 1,003 | pine behind Anvilhall; the quarries; Kilnmouth's farms | none | #474 |

The core is the five boxes that hold a step of the quest or a dungeon's door (N3, N4, O5 and L6,
and N5, the smelter), built at full density; the rest is country, built to the looser floor with
the wilderness features (EXPANSION §2.1 (b) and §5.3, #45). The road's country (M3, N2, O6, N6
and M6) is built with the act; the country behind is parked until the owner has played it (#434,
call 10). The bands rise from the way in, 16 under the pines of M3, to 18 at the Rift, the tubes and
the drove road's end, as the gate asks (EXPANSION §5.2), and each box holds a group at the top of
its band for the curve (§7 says where the roster is short).

**Boxes of two zones.** On the plan N3 and O3 held the heart's land along their south rows (202 and
268 squares), N5 holds Kilnmouth's along its west (250) and N6 is near half Kilnmouth's (399). A map is
laid in one zone and all its squares are that zone's (docs/areas/sunderwood.md §4): N3 is laid in
the Fells, N4, N5, O5, O6 and N6 in the heart, M6 and L6 in Kilnmouth, so the heart begins at N4's
north edge, on the trail, and Kilnmouth at the branch into M6 (§9). M3, laid whole in the Fells
(#457), took Lanternwood's land in its west, and the seeds that hold the Fells off N4 give N3's and
O3's south rows to the Fells already (§1).

**The order** is the east road's, and the quest's: M3, the only box that meets Lanternwood, and the
way in; N3 and Anvilhall, the first steps and the choice; N4 and the Tiefzeche; N5; O5 and the Rift;
O6; N6 and M6, the roads out; L6 and Kilnhaven; then N2, which is off the road. Building waits on
#432's systems (§3) and on the two-areas rule (EXPANSION §3), with Sunderwood's road finished
(#202); the briefs and the drawings do not wait.

The places, as the atlas and the docs have them:

| Place | Box | What the docs say | On the atlas |
|---|---|---|---|
| Anvilhall | N3, and its own map | the great hall with the verse over the forge where the kings' crowns are made; the thane, who sells the Stone back or loses it and never forgives (DESIGN §9, STORY, #434's 1); training to 19 (DESIGN §5); the Lantern reader (#538); 33, 34 and 36 begin or end here (#56) | a planned town at 452,70, its way in there, N3's gate (§9) |
| The Tiefzeche (the Deep Mines) | N4, and below | the deepest mine, broken into the hull's service ways; the clean corridor, the knockers, the Foreman and the door marked CREW ONLY (DESIGN §9, MONSTERS §7.1, STORY); the service ladders found by reading (#434's 2); the son who carries the crust (#56's 33); the hymn's doors (#56's 36) | a planned dungeon at 440,104, its way in at 440,96 |
| Gluthutte (the Forges) | N5 | the smiths; the crown for Jory Tallis paid in shards (#56's 35); fire beetles at the forges (MONSTERS §7.1) | a site at 436,126 |
| The Anvil Stone | O5, and below | cut by the dwarves to sell the pieces; its Rift in slag and iron; the Warden of the Anvil, whose fall closes the tear; the Anvil Guard, after the taking (MONSTERS §2.1, §7.1, #434's 1); counts for the Hearth (#168, #540) | a planned dungeon at 468,136, its way in at 468,142 |
| Feuerstollen (the Lava Tubes) | O6, and below | the fire things; salamanders and the Great Salamander in the deepest chamber (MONSTERS §7.1) | a planned dungeon at 470,194, its way in at 478,178 |
| Erzkamm (Iron Crag) | N2 | the Barbarian's second prestige, Ironhide, off the beaten path and relatively safe (DESIGN §5); the wall that says KEEP CLEAR OF THE DOORS, which the Regent's scholar copies (#56's 34) | a site at 432,44, the cave on N2 at 8,14 (#460) |
| Kilnhaven | L6, and its own map | the ore port, whose ship is one way to the far side of the sea (DESIGN §9); the harbourmaster's manifests (#470); training to 19; the ferry, the ship and the coach (#539) | a planned town at 378,158, its way in at 391,162 |
| The drove road | N5, N6 | the road south into Cairnmoor, which has no town (#434's 9); the coach's road | a trail from 446,118 to 430,210, the branch to Kilnhaven off it |

### 4.1 The briefs

As Saltreach's (docs/areas/saltreach.md §4.1): drafts for the owner, written before Act III's
first box is built, each settled in its issue. A core box is held to the Foreland map's density,
about nine features, ten groups and four ways in or out to 870 open squares, a country box to about
half with the wilderness features (#45), and no more than one point in four is a sign. A group is
about one of MONSTERS §4.4's standard encounters at the box's band, paid by level (#159). The area
owes 13,067 xp a member (§8), and the shares below add up to a little over it. Finds are the ladder's
Act III step (#535): the band's gear at Anvilhall's forge by 17 (§4.4), the same at Kilnhaven's
smith at a quarter more (#434's 1) and six of them with a plus in the boxes and the Tiefzeche by
19, with Cairnmoor's one (docs/areas/cairnmoor.md §4.1): N3's Plate Mail +3, the Tiefzeche's Forge
Hammer +1, Erzkamm's Mattock +1, O6's Steel Bow +1, M6's Seax +1 and L6's Kiln Robe +1. The other
boxes' pluses are theirs to choose, off the ladder, and none is Dwarf Mail (§9). No find or ware is
dearer than the band's window, 3,500. Side quests are #56's 33 to 36, placed as §6 has them (#471).

**Inscriptions.** An inscription is a sign with two texts (#538): what the dwarves read, and what
it says. The second shows to a company with a reader, a member with Linguist, a dwarf or 34's
copybook, and never has to. Where a brief gives one, the first line is the dwarves' and the second
the machine's; both are drafts. A secret's hint is a thing seen first, and the reading a second
hint beside it, so the hint check (EXPANSION §5.4) passes without a reader. As built
(`src/game/inscriptions.ts`), it is a sign with an `id`, its words in `text` and the machine's in
`read`, and the log says the reading as its reader's: a brief's *Read: KEEP WHOLE. NO CUTTING.* is
`read: 'KEEP WHOLE. NO CUTTING.'`, said *Maren reads: "KEEP WHOLE. NO CUTTING."* after the sign's
words. Read, it is kept by its id, so `seen: '<map>:<id>'` names it for a person's words or a
journal's entry (the verse, §4.4). One that `marks` names atlas places, which the world map pins
once it is read (Feuerstollen's mouth, §4.11), and its first reading says so. The secret, the
ladder and the mark are what a reading opens; no way waits on one (§9).

### 4.2 M3, the Iron Fells' way in (#457): country, band 16

- **Purpose.** The first box past Lanternwood: pine under the mountain, the east road climbing into
  the Fells, the area's gentlest groups and the crossing line that tells a level-14 company it is
  early (#166). It lists the area.
- **Landmarks.** The east road in at 404,70, up through the pines to the trail's head at 410,76 and
  south-east for N3; the first spoil heap by an old adit, walled; a woodcutters' camp; the mountain
  along the north and east, the Fells' first tops.
- **Points of interest,** about six features and five groups: a milestone, ANVILHALL 4, LANTERN
  WATCH 8, counted along the trails at about 13 squares to the unit (docs/areas/saltreach.md §9,
  #176's 4); the camp, to rest at (#45), and a woodcutter with a rumour of what the dwarves sell; a
  cairn on the shoulder (#45) and a shrine of the dwarves' at the adit, a niche with a cold hearth
  in it (#45); a lookout west over Lanternwood.
- **Encounters.** Fire beetles on the spoil (two groups, the gentlest, a proposal against the
  roster's Where column, §7); a rock worm in the adit at the box's far end, the group above the
  floor.
- **Quests.** None; the chapter's goal points up the road (§5).
- **The secret and its hint.** The walled adit is the Hand's wagon stage, where the cargo stopped
  the night before the mine: a cage-wagon, shackles and what the cargo left. The hint: wheel ruts
  leave the road into the pines where no track is, and the needles are swept from the foot of one
  wall.
- **Lines:** the crossing: *Pine, and the ground going up. Somewhere ahead something is being
  hammered, and has been all day.*
- **New here.** Pine underfoot (#536); the Fells; a company told it is early.
- **Finds.** A piece with a plus in the wagon, off the ladder, the box's to choose (#535).
- **Pay.** About 700 xp a member.

- **As built** (#457, 4 October): the brief's places, with three groups for its five, laid whole in
  the Fells (§1). The road comes over the ridge from M2's south edge, through Lanternwood's last trees
  with pines at the verge, over the pass and out at the trail's head; M2's road says the crossing
  going south, *The Iron Fells. Pine, and the ground going up. Somewhere ahead something is being
  hammered, and has been all day.*, and to a company of 14 or 15 the land is harder than the road
  behind. The woodcutters' camp and a woodcutter, who says the dwarves sell something in little
  boxes by night, are under the shoulder in the pocket north of the trail's head, with the cairn on
  the shoulder above them (240 gold and a Sapphire Vial). The lookout is a knoll at the pass's foot,
  west over Lanternwood by day and the Watch's light by night; the milestone reads ANVILHALL 5 since
  N3 set the gate (#458), LANTERN WATCH 6 (§9). The old adit is in a crag at the box's far end,
  south of the trail by the east edge, with the dwarves' cold hearth by its mouth (might) and the
  spoil heap tipped below it toward the trail: three fire beetles at its toe and three on its west
  side, the gentlest; a rock
  worm in the adit's cut, the box's group at 17. The ruts turn off the trail for the crag and the
  wall's foot is swept; searched there, the wall gives on the Hand's stage: a cage-wagon with a boot
  and a net-needle in its straw; beside it the drover's box, 500 gold and a Drover's Goad +2
  (`drovers_goad`), which no walker, swimmer, climber or levitator reaches but through the wall. A
  company at 16 wins every fight and manages 8.95 fights to a rest, inside the aim, with 6.3% of its
  days ending in a fight broken off (8.97 and 4% once #541 re-stated the worm); the Fells' road, the
  two beetle groups, is walked every time. As
  measured it pays about 1,068 xp a member and 740 gold. Two under, at 14, it wins every fight too,
  owed to #18 as every Act II box's is. Density 98.5% within 12 steps, the furthest 15. It claims pine
  underfoot as new (§7). M2 gains the way over the border with the crossing line and its milestone
  is put right to ANVILHALL 8; its ridge over the Warden's grave is rock for two squares (§9).

### 4.3 N3, Anvilhall's box (#458): core, band 16–17

- **Purpose.** The Fells' step of the quest: the dwarves' terraces and the great hall's gate, the
  trail past it, and the spoil heaps where the sorcerer's fire does nothing (MONSTERS §7.1's second
  fight).
- **Landmarks.** The trail from M3 across the box's south-west and on into N4; the spur north to
  Anvilhall's gate at 452,80, the way into #459, cut into the hill with the terraces below it; the
  spoil heaps along the trail, tipped from the workings above; a dwarf cemetery of iron markers.
- **Points of interest,** about nine features and eight groups: the gate, and the hall's hammering
  heard from the trail; the terraces, and the tithe-house at their foot; the dwarf mother at the
  terraces' well (#56's 33); a camp by the trail (#45), a cairn (#45) and a shrine, a dwarves'
  hearth-niche with the first inscription a company reads (#45); the cemetery, its markers
  lettered in the script; a lookout from the terraces over the heart, the smelter's smoke and the
  ash to the south-east.
- **Encounters.** Fire beetles and salamanders on the spoil heaps (two groups), the roster's fight;
  a rock worm in a collapsed working; by night, slaglings on the trail's far end, strays from the
  Stone (`until` the tear closes, #41).
- **Quests.** The step. The Crust-Bearer begins at the well (§6); The Primer and The Miners' Hymn
  begin inside (#459).
- **The secret and its hint.** The tithe-cellar under the terraces, where the Stone's pieces are
  boxed for the Compact, with the dwarves' tally of what sold and to whom: found, never said. The
  hint: cart ruts run to the terrace wall where no door is, and the grass is worn in a turning
  circle before it. Read, the niche over the wall says STORE.
- **Lines:** the niche: *Cut over the terrace wall, the dwarves' words for plenty. Read the old
  way, one word: STORE.*
- **New here.** The first inscription read (#538); a town cut into a hill.
- **Finds.** A boxed piece of the Stone, the Anvil Shard, a keepsake as the Brine and Sunder Shards
  are; a Plate Mail +3, plate's wearers' armour on the step, the ladder's (#535).
- **Pay.** About 900 xp a member.

- **As built** (#458, 4 October): the brief's places, with four groups for its eight, laid whole in
  the Fells (§1). The trail comes over the line from M3 at rows 27 and 28 and leaves by the south
  edge at 428 and 429,93 for N4, and there by night three slaglings stray from the Stone until its
  tear is closed. Off it at the box's corner the spur runs north-east, 46 squares of road: past the
  hammering, which comes out of the hill, the carters' camp in a knoll's lee and the low spoil heap
  below an old adit in the west hills (three fire beetles and a salamander); along the terraces' foot
  and up the stair at their west end, past the high heap under the crag's warm working (three
  salamanders and a beetle), to the forecourt. The gate is the atlas place's own square, 452,70
  (28,8), a front of dressed stone in the crag, its iron-bound door the way into Anvilhall (#459,
  §4.4), whose way back lands on 28,9 facing south (§9). Four terraces of
  fields step down from the forecourt behind dry walls. The well is on the second down, and the
  mother at it says her son took the crust down and will not come up; the lookout is at the top
  one's east end.
  At their foot stand the tithe-house and the ruts along the lowest wall to a turning circle where
  no door is, the hearth-niche over it (endurance) with the box's inscription, the dwarves' words for
  plenty, which a reader reads STORE. Searched there, the wall gives on the tithe-cellar: crates
  stencilled for the Compact with a stone in each and a tally chalked on the wall; in one, 700 gold,
  the Anvil Shard and the Plate Mail +3, which no walker, swimmer, climber or levitator reaches but
  through the wall. On the open fell are the burying ground of iron markers, the cairn (250 gold and
  a Sapphire Vial), the hall's air coming up through a grating and an old bloomery; at the south-east
  corner the rock worm lies in a collapsed working, the box's group at 17. A company at 16 wins every
  fight and manages 8.49 fights to a rest, inside the aim, with 0.7% of its days ending in a fight
  broken off; the Fells' road, on now past the two heaps, is walked every time. As measured it pays
  about 1,525 xp a member and 950 gold. Two under, at 14, it wins every fight too, owed to #18.
  Density 97.6% within 8 steps, the furthest 10, with one sign among its 22 points. It claims the
  salamanders and the reading as new (§7), and M3's milestone reads ANVILHALL 5 (§9).

### 4.4 Anvilhall (#459): town, 16×16, band 16–18

- **Purpose.** The act's first town and the dwarves' seat: the great hall with the verse over the
  forge, the thane with his menu, and the first place the company reads the old way.
- **Businesses,** each with a room of its own (#473), the `interior` its feature names given with
  it. No spell hall (#434's 9): Lantern Watch sold tier 6 and Rime Lodge sells tier 7 (DESIGN §7).
  No guild hall (#434's 8).
  - The great hall, the thane's, where the choice is put as a business puts its menu (#434's 1).
    Interior: `anvilhall_great_hall`.
  - The forge, under the verse, the act's first step on the ladder by 17 (#535: a Forge Hammer, a
    Seax, a Steel Bow, a Mattock, a Banded Staff, Dwarf Mail, a Kiln Robe and a Forge Shield, 1,100
    to 2,000 gold, `FORGE`), shut to the company for good if the Stone is taken.
    Interior: `anvilhall_forge`.
  - The training hall, to 19 (DESIGN §5). Interior: `anvilhall_training_hall`.
  - The inn, the miners' lodging. Interior: `anvilhall_inn`.
  - The mine-surgeon's, cures and raising at the band's price. Interior: `anvilhall_surgeon`.
  - The stores, provisions at list price. Interior: `anvilhall_stores`.
- **People.** The thane, with the verse over his forge and the Stone on his menu; the Lantern reader,
  a scholar lodged in the hall who reads the verse the old way for the company and teaches Linguist
  as the Lanterns' halls do (#538); the Regent's scholar, before he goes up to Erzkamm (#56's 34);
  the oldest miner, who sings the last verse (#56's 36); the dwarf mother (#56's 33); the smiths at
  the forge.
- **Quests.** The chapter's steps (§5): the verse, and the choice. The Primer, The Miners' Hymn
  and The Crust-Bearer's hand-in (§6).
- **The verse.** THE FIRE IS KEPT BELOW AND NOT ABOVE, over the forge. The reader reads it aloud the
  first time, so no skill is needed; a company with a reader of its own reads it before he does, and
  his words change.
- **Lines:**
  - the gate: *A door in the hill, iron-bound, and the hammering behind it. Over the lintel, words
    cut deep and painted red.*
  - the verse, read: *"It's a warning. The kind you paint on a boiler."*
  - the thane, after, either way: *The mountain has to eat. Remember that, when you are
    somewhere it does not.*
- **New here.** A choice sold like a ware; a shop that shuts for good; a skill taught by a person
  who is not a hall.
- **Pay.** About 300 xp a member in the town's quests and hand-ins.
- **As built** (#459, 4 October): N3's gate at 28,8, its door now open, lets a company in at the foot
  of the court, 7,14, through a gate one door wide, saying the brief's gate line as it goes; the
  hold's name is cut over the gate inside. The court climbs north in three terraces, a stair up
  through each terrace's wall, to the great hall's doors at its head.
  The businesses are the brief's six, each its own room and each a door in the rock: the Great Hall,
  a room with the thane and the Lantern reader in it; the Smiths' Forge, selling the step's eight
  wares and nothing else, gone with its smiths once the Stone is taken, its door barred; the Old
  Working, training to 19; the Candle Arch, the inn, 35 a head; the Mine-Surgeon's, which cures; and
  the Hold Stores, the provisions at list price. The verse is cut over the great hall's doors as over
  the kings' forge within. Wystan Crane, the Lantern reader, reads it aloud the old way, *DANGER.
  KEEP FIRE BELOW THIS LINE.*, and says the brief's line; to a company whose own reader read it at
  the doors he says it after them; either way he sets `anvil_verse_read` for the chapter, and he
  teaches Linguist to a Lantern (#538). Thane Wolfram puts the Stone at 6,000 gold or taken, the
  price barred to a company with less, and sets `anvil_bought` or `anvil_taken`; his last word is the
  brief's either way. Gerda at the forge and Konrad, the gate's warder, change their words with the
  choice; Ilse cuts the old script fresh over the mine-surgeon's door. Four doors and the gate carry
  an inscription: SECTION 7. over the gate, BERTHS. over the inn, SICKBAY. over the mine-surgeon's,
  MUSTER STATION. ALL HANDS. over the old working and the verse over the hall. The Regent's scholar,
  the oldest miner and the Crust-Bearer's hand-in are #471's (§6). The walkthrough rests, buys each
  class its step at the forge, trains a member of 18 to 19, hears the verse read both ways, teaches
  a Lantern Linguist and puts the thane's choice both ways. The town pays nothing of its own: its 300
  is its quests', the chapter's and #471's. Density 100% within 7 steps, the furthest 4, five signs
  among its 22 points.

### 4.5 N2, Erzkamm (#460): country, band 16–17

- **Purpose.** The ore crest north of Anvilhall, off the road and relatively safe: the Barbarian's
  second prestige (DESIGN §5), the oldest carving in the dwarf country and the scholar copying it.
- **Landmarks.** Hills climbing to the crag at 432,44, a cave in its face, with the old adits of the
  first ore-finders below it; the wall inside the cave's mouth cut in the deep script; the mountain
  across the box's north and west, the rim's.
- **Points of interest,** about five features and four groups: the crag, and the Barbarian's
  trainer at its mouth, Ironhide (#19); the wall, KEEP CLEAR OF THE DOORS, and the scholar with
  his primers and his copybook (#56's 34); a cairn on the crest (#45) and a camp in the lee of the
  crag (#45); a lookout south over the Fells to Anvilhall's smoke.
- **Encounters.** Rock worms in the old adits (two groups, the box's top); fire beetles on the
  first ore-finders' spoil.
- **Quests.** The Primer (§6).
- **The secret and its hint.** Behind the wall, the doors it means: a row of iron doors in the
  crag's back that nothing opens, walls with words on them (#434's 4), and before them the first
  ore-finders' hoard, left where they stopped digging. The hint: the cave floor is worn in a line to
  a blank face, and the scholar's chalk marks stop short of it.
- **Lines:** the wall: *Cut into the rock, older than the hall's. The dwarves say it is the first
  blessing. Read: KEEP CLEAR OF THE DOORS.*
- **New here.** A door that is a wall; a trainer in a cave, as Sjonghol's.
- **Finds.** The hoard: a Mattock +1, the ladder's (#535), and gold.
- **Pay.** About 600 xp a member.

- **As built** (#460, 4 October): the brief's places, with three groups for its four, laid whole in
  the Fells (§1) at band 16–17, not 17 (§9). No road climbs to it: the open fell comes up out of N3
  over the south edge at 0 to 12, N3's north row square for square, the crag over Anvilhall's gate
  running on as mountain along the rest of the seam, and climbs into hills under the rim. The cave is
  cut into the crag at the site's square, 432,44 (8,14), its mouth at 8,15, where Hartmut sits in
  his shirt in the wind: to a Berserker of 19 who has heard him he gives his lesson once, and makes
  an Ironhide for 4,000 gold. Inside, the wall is the box's inscription, the dwarves' first blessing,
  which a reader reads KEEP CLEAR OF THE DOORS, and the scholar copies it into a book beside it, his
  primers wrapped in Helmstow paper (his words only; 34 is #471's). The floor is worn in a line to a
  blank face at the back, and the chalk on the wall stops a hand short of it; searched there, the
  face gives on a rough passage and a row of iron doors in the crag's back, smooth and lettered over
  with no handle on any, and before them the first ore-finders' picks and ore, 400 gold and the
  Mattock +1, which no walker, swimmer, climber or levitator reaches but through the face. Below the
  crag the first ore-finders' spoil, three fire beetles on it nearest the way up, and their two
  adits, a rock worm in the one cut into a knob of rock to the west and a pair in the one under the
  rim at the far end, the box's groups at 17. The camp is in the crag's lee, the cairn on the crest
  (240 gold and a Sapphire Vial) and the lookout south from the Fells' top, Anvilhall's smoke coming
  out of the hill by day and the hill glowing at its seams by night. A company at 16 wins every fight
  and manages 8.76 fights to a rest, inside the aim, with 1% of its days ending in a fight broken
  off. As measured it pays about 1,095 xp a member and 640 gold. Two under, at 14, it wins every
  fight too, owed to #18. Density 100% within 12 steps, the furthest 12, with one sign among its 16
  points. It claims nothing new (§7).

### 4.6 N4, the Tiefzeche's box (#461): core, band 16–17

- **Purpose.** The heart's first step: the deepest mine's headworks, the miners' camp and the Hand's
  wagons going in; the way down.
- **Landmarks.** The trail from N3 across the box to 446,118 and the drove road's head; the mine's
  mouth at 440,96, the way into #462, with its headworks, a wheel and a gantry; the miners' camp; the
  rock along the east, the first crags; the wagon yard behind the headworks.
- **Points of interest,** about nine features and nine groups: the mouth, and the event at it, the
  step (§5); the headworks, and the tally board on it; the miners' camp, to rest at (#45), and the
  oldest miner by day when he is not in the hall (#56's 36); a shrine over the shaft, the miners'
  blessing (#45), and a cairn (#45); the wagon yard's gate; a lookout from the gantry.
- **Encounters.** Fire beetles on the fresh spoil (two groups); rock worms in the old workings' open
  cuts (two); the Hand's overseers at the wagon yard by night, walking the cargo in (`when`), from
  Act II's roster at level (MONSTERS §7.1's Back, §7).
- **Quests.** The step. The Miners' Hymn's first verse is sung here (§6).
- **The secret and its hint.** The wagon yard behind the headworks, where the cages the cargo rode
  down in stand under tarpaulins, and what the cargo left in them. The hint: the tally board counts
  loads down and none up, and the yard's wall has a wagon's width of fresh mortar in it. Read, the
  blessing over the shaft says COUNT ALL DOWN. COUNT ALL UP.
- **Lines:** the mouth: *The shaft goes down under a wheel and a gantry. The miners sing going in,
  a verse at the door. Nobody sings coming out.*
- **New here.** A mine's headworks; a count that comes up short.
- **Finds.** The cargo's belongings, and a plus off the ladder, the box's to choose (#535).
- **Pay.** About 900 xp a member.

- **As built** (#461, 4 October): the brief's places, with four groups for its nine, laid whole in
  the heart (§1). The trail comes over the line from N3 at 428 and 429,94 (4,0 and 5,0), where a
  boundary stone carries a hammer on its north face and a kiln on its south; the log names the Kilns,
  and to a company under 16 says the land is harder than the road behind. It runs down across the
  box past the headworks, turns south at the drove road's head (22,24) and leaves by the south edge
  at 444,125 (20,31) for N5. The headworks stand at the foot of the first crags: a spur of nine
  squares off the trail to the shaft at the site's own square, 440,96 (16,2), where the mouth's line
  is said, and the cage's gate on the shaft is the way down into the Tiefzeche (#462, §4.7), whose
  cage brings a company back up to the spur's end (§9). Beside the shaft are the winding house, its
  tally board counting loads down and none up, and the lookout from the gantry, south down the drove
  road by day and to a red glow under a far crag by night. A crust is left on the shaft's fence.
  Over the shaft the lamp-niche (luck) has the box's inscription, the miners' blessing, which a reader
  reads COUNT ALL DOWN. COUNT ALL UP. By night a cart comes down the trail with its lamps hooded and
  turns in for the headworks, the Hand's overseers seen and not fought. Below the shaft the fresh
  spoil is tipped toward the trail: four fire beetles at its head and three salamanders and a beetle
  at its warm end, the roster's fight.
  The wagon yard is walled into the rock behind the headworks, a wagon's width of its wall new
  mortar. Searched there, the wall gives on the cages the cargo rode down in, a name scratched on a
  bar and a child's shoe in the straw; in the overseers' strongbox, 700 gold and a Sharkskin Coat +2
  (`sharkskin+2`), the cargo's, which no walker, swimmer, climber or levitator reaches but through
  the wall. West of the trail are the miners' camp and a miner, who says a verse is sung at every
  door going down and nobody sings coming up, the cairn on the knoll (250 gold and a Sapphire Vial)
  and an ore tub; east, a spring under the crag. In the south-west lie the old workings' open cuts,
  with a rock worm in the deepest, and in the east a second worm in a cut, the box's groups at 17;
  the drovers' fold stands by the road, and the smelter's smoke rises close past the south edge. A
  company at 16 wins every fight and manages 8.73 fights to a rest, inside the aim, with 1% of its
  days ending in a fight broken off; the heart's road, past both groups on the spoil, is walked every
  time. As measured it pays about 1,468 xp a member and 950 gold. Two under, at 14, it wins every fight too,
  owed to #18. Density 97.7% within 8 steps, the furthest 13, with one sign among its 25 points.

### 4.7 The Tiefzeche (#462): dungeon, three levels of 16×16, band 16–18

- **Purpose.** The act's first dungeon and the road's first machines: down through the dwarves'
  workings to where their tunnel ends and the clean corridor begins, and the door that will not open.
- **Landmarks.** The workings (`deep_mines`, 16–17): timbered galleries, the hymn's doors, the crust
  left on a ledge for the knockers, a service ladder down. The old workings (`deep_mines2`, 17):
  the rock worms' tunnels, which the dwarves did not dig, the Hand's cages on their rails, a second
  ladder. The lowest level (`deep_mines3`, 18): the dwarves' tunnel ending in a face of smooth wall
  with a square hole cut through it, the clean corridor beyond, humming, the knockers in it, the
  Foreman before the door, and the door, CREW ONLY, with the footprints and the knot.
- **Points of interest,** about seven features and eight groups a level, as the Foreland's dungeons
  are held: the doors with their verses, the crust ledge, the ladders, the cages, the corridor's
  mouth, the door.
- **Encounters.** Rock worms (two groups) and fire beetles on the first two levels; the Hand's
  overseers with the cargo on the second (§7); on the lowest, the clean corridor, six knockers and a
  mender, twice (MONSTERS §7.1's first fight, where the cleric's Wrath goes in like a hand into a
  glove), and the Foreman, boss, level 18, before the door. No machine above the lowest level
  (#158). The Foreman never comes back; the door stays shut when it falls.
- **Quests.** The step: the door (§5). The Crust-Bearer's son on the lowest level, and The Miners'
  Hymn's verses, one at each door (§6).
- **The service ladders** (#434's 2). Each level's ladder is behind an inscription the dwarves read
  as a prayer for the dead; read, it says LADDER, and the ladder's hatch opens to a search beside
  it. A company with no reader walks the stairs; the ladders are a shortcut, never a key.
- **The secret and its hint.** On the lowest level, a side room off the corridor the knockers keep
  swept, with the parts they carry stacked by kind, and among them things that are not parts: what
  the cargo dropped going down. The hint: the knockers' tracks in the dust run to a wall as often as
  through the corridor, and the dust before that wall is swept in arcs.
- **The door.** CREW ONLY, a wall with words on it (#434's 4): no flag, no lock, nothing in
  `content/locks.ts`. The company cannot pass it and never needs to.
- **Lines:**
  - the end of the tunnel: *The pick marks stop. Past them the wall is smooth, and the air hums.*
  - the knockers: *Something small and grey, knocking on the rock as it comes.* (MONSTERS §7.1)
  - the door: *CREW ONLY, in the old script. In the dust, hundreds of footprints walking down, in a
    line. On the frame, at a girl's shoulder, a loop inside a loop.*
- **New here.** The machine (MONSTERS §2, `kind`); a healer among the machines; a corridor nobody
  dug; a door that is a wall; a shortcut found by reading.
- **Finds.** The parts the machines carry, which no shop buys; in the side room a Forge Hammer +1,
  the ladder's (#535), and in the Hand's cages what the cargo left, pluses off the ladder for the
  classes the Fells' finds miss, the dungeon's to choose.
- **Pay.** About 2,400 xp a member.

- **As built** (#462, 4 October): three levels of 16 by 16 under N4's shaft, hand-built, each with a
  group at the top of its band (§9). **The workings** (`deep_mines`, band 16–17): the cage's gate on
  N4's shaft lets a company down to the shaft's foot, 7,14, facing in, and the cage there takes it up
  to the spur's end, 15,2, facing west. Timbered galleries in stone and beams: the haulage way north
  through two air doors to where the galleries meet, and a third door west to the stair down, an old
  miner on a stool at each to work it, who sings its verse as the company passes, *One door shut, and
  all hands counted.*, then two and three (#56's 36). The crust lies on a ledge by the stair, crumbs
  going on down the steps; at the face east a hewer, who says they do not go to the bottom and hear
  the knocking under the floor, and past it a hole no dwarf cut, a rock worm in it, the level's group
  at 17; four fire beetles in a warm gallery west. Off the haulage way the miners' candles before a
  walled niche lean into the wall, and the prayer for the dead cut over it reads LADDER to a reader;
  searched there, the wall gives on a square shaft with iron rungs, 400 gold in coins on its floor
  pushed through for the dead, and the rungs go down to the old workings. **The old workings**
  (`deep_mines2`, band 16–17): galleries nobody works, a fall of roof at the end of the first, two
  beetles in an old stall, the cargo's footprints down to the old haulage way, its rails bright on
  top, and on them the Hand's cages, the straw fresh; in them what the cargo left, an Ironwood Bow +2,
  a Warden's Dirk +2 and 900 gold. By night the overseers' lamps go away down the bore, seen and not
  fought. A second niche, the dust blown back from it, reads LADDER, and its hatch gives on the shaft
  again, whose rungs run on down to the bottom; the worms' round bores wind north to a pair of rock
  worms, the level's group at 17, and south to the steep stair down. **The bottom** (`deep_mines3`,
  band 17–18): the stair comes down into the dwarves' last squares, earth underfoot, and the brief's
  line is said before a face of smooth wall with a square hole cut through it, crusts on a ledge
  beside it, none eaten. Through it runs the clean corridor, drawn smooth and bare, the hull's: west
  past six knockers and a mender, and a wall their tracks run to, the dust swept in arcs before it,
  where a search opens their room, parts stacked by kind and among them combs and buttons and a spoon,
  with the Forge Hammer +1, a Knocker's Plate and 1,250 gold; north past six knockers and a mender
  again; east to the Foreman, and past it the door at the corridor's end, a wall with a door drawn in
  it, with the brief's line on the square before it. East of the hole the service ladder comes down
  out of the ceiling. The knockers, the menders and the levels' beasts come back; the Foreman never
  does, and drops its slate, and the door stays shut. The stairs join the three levels with no hatch
  found and nothing read. A company at 16 wins every fight on the upper two, 7.52 and 8.67 fights to a
  rest, inside the aim. At 17 it wins every fight with the knockers and half with the Foreman, which
  it wins 95% at 19; the bottom's day runs 9.64 fights to a rest, 13.3% of its days ending in a fight
  broken off, and its groups pooled with the Foreman are won 83.3%, both off the aim and inside the
  limit (§9). Two under, at 14, the upper two are won every time, owed to #18. As measured the three
  levels pay 4,278 xp a member and 2,550 gold. Density 100% within 7 on each, the furthest 4, 4 and
  5, with one sign among 18 and 19 points on the upper two and none among the bottom's 15.

### 4.8 N5, Gluthutte (#463): core, band 17

- **Purpose.** The smelter in the charcoal woods, where the verse is over the forge as it is at
  Anvilhall, and the smiths are making a crown.
- **Landmarks.** The drove road from N4's 446,118 south through the box to 440,150; the smelter at
  436,126, its chimneys and its slag heap, with the charcoal burners' clamps in the woods about it;
  a water of 78 squares the smelter draws on; the mountain along the east.
- **Points of interest,** about nine features and eight groups: the smelter, and the smiths at the
  anvil with the crown (#56's 35); the slag heap; the charcoal burners' camp, to rest at (#45); a
  shrine, the verse carved over the smelter's mouth (#45), and a cairn in the woods (#45); the
  Compact's factor at the smelter door, who pays in shards; a lookout from the slag heap's top,
  south over the heart to the ash.
- **Encounters.** Fire beetles at the forges, the roster's Where (two groups); salamanders on the
  slag heap; a rock worm under the woods.
- **Quests.** A Crown to Order begins here (§6).
- **The secret and its hint.** The shard store under the slag heap, where the smiths keep what the
  Compact pays them, warm. The hint: the heap is tipped loose on every face but one, which is laid
  in blocks. Read, the verse over the mouth is the boiler's warning, as at Anvilhall; it hints at
  nothing here, and the heap does.
- **Lines:** the smelter: *Chimneys, and the heat from the door felt across the yard. Over the
  door, the verse again. Inside, somebody is making a crown.*
- **New here.** A smelter; woods that are a fuel.
- **Finds.** Shards the Compact paid, and a Forge Shield +1, off the ladder (#535).
- **Pay.** About 900 xp a member.

- **As built** (#463, 4 October): the brief's places, with four groups for its eight, laid whole in
  the heart (§1). The drove road comes on from N4 at 444,126 (20,0) into the same land, but the floor
  here is 17, and to a company under it the log says the land is harder, with no name. It runs south
  through the woods, fords the stream on laid flags at 18,12 and leaves by the south edge at 436,157
  (12,31) for N6. Off it at 20,3 a spur of six squares runs west to the smelter's yard, where the
  brief's line is said. The smelter stands a square inside the north edge, at 12,1 to 13,2, with the
  site on it (§9). At its mouth (11,2) the furnace gives accuracy and the verse is cut over it, which
  a reader reads DANGER. KEEP FIRE BELOW THIS LINE., as at Anvilhall. Eckhart, the master smith, is
  at the anvil in the door with a crown on its horn, made to order and paid for in stone; Kerensa,
  the Compact's factor, stands by the door with a strongbox at her feet, and the Compact does not pay
  in coin. West of the yard the slag heap is tipped loose on three sides and laid in blocks on its
  south face; from its top the heart runs south under its smoke by day, and by night a line of red
  breathes far to the south-east. Searched at the laid face (5,4), the heap gives on the shard store:
  boxes of grey stones the size of a fist, a tally of weights for the Compact and, in the smiths'
  chest, 700 gold and a Forge Shield +1 (`forge_shield+1`), which no walker, swimmer, climber or
  levitator reaches but through the face. Four fire beetles behind the smelter and three at the yard's
  foot are the roster's Where; three salamanders and a beetle hold the heap. The stream comes down off
  the fell at the north-east corner, past ore picked over on the hillside and a weir of slag blocks
  with the smelter's leat, across the road at the ford and out by the west edge at 0,25 and 0,26 for
  M5; fields lie at the woods' edge south-west of the smelter. In the woods are the charcoal burners'
  camp, a clamp burnt out by the road and one smoking with its burner asleep, a cairn of fire-bricks
  (250 gold and a Sapphire Vial), hazel cut for the fires, the woodward's hut, a broken charcoal cart
  and an older smelter's slag gone to moss under the mountain. At 440,150 (16,24) the cutters' track
  leaves the road east as dirt to the east edge at 455,150 (31,24), for O5 to run on to the Stone; a
  cutter's wedge lies at its foot, and along it footprints burnt into the dirt come out of the east
  to a slag elder strayed from the Stone, there until the tear is closed, the box's group at 18 (§9). A company
  at 17 wins every fight and manages 8.64 fights to a rest, inside the aim, with 2.3% of its days
  ending in a fight broken off. As measured it pays about 1,679 xp a member and 950 gold. Two under,
  at 15, its groups count in the area's pool, where every fight is won, owed to #18. Density 97.4%
  within 8 steps, the furthest 11, with one sign among its 27 points.

### 4.9 O5, the Anvil Stone's box (#464): core, band 17–18

- **Purpose.** The heart's step: the Stone the dwarves cut themselves, on its anvil of rock with
  the saw-cuts in it, the cutters' sheds, and the tear torn open beside the cut.
- **Landmarks.** Hills and rock east of the drove road, with the cutters' track up from 440,150; the
  Stone at 468,136, cut square on three faces; the Rift's way in at 468,142, the tear in the ground
  below the cut, slag and iron, red (MONSTERS §2.1), the way into #465; the cutters' sheds and their
  saws; the thane's iron, if the Stone is taken.
- **Points of interest,** about nine features and eight groups: the Stone, and the event at it, the
  step (§5); the tear, and the slag walking out of it; the cutters' sheds, the foreman and his saws;
  the Anvil Guard's post on the approach, there only `after` the taking (#434's 1, #41); a camp back
  from the cut (#45), a cairn (#45) and a shrine, the Stone's own inscription on its plinth (#45); a
  lookout from the crag over the Rift's light by night.
- **Encounters.** Slaglings from the tear (two groups); a slag elder at the tear's lip; the Anvil
  Guard, armoured dwarves in the thane's iron, on the approach after the taking: the dwarves, if
  crossed (MONSTERS §2). All but the Guard `until` the Warden falls.
- **Quests.** The step. The chapter's goal turns to the Rift (§5).
- **The secret and its hint.** Under the anvil-rock's lip, a piece of the Stone the size of a head
  that one cutter would not sell, hidden where he cut it. The hint: every saw-cut on the Stone goes
  through but one on its north face, which stops half way. Read, the plinth says KEEP WHOLE. NO
  CUTTING.
- **Lines:**
  - the Stone: *The Stone, on its anvil of rock, cut square on three sides. Below the cut the ground
    is torn open, and runs red.*
  - the plinth: *The dwarves' words for what holds. Read: KEEP WHOLE. NO CUTTING.*
- **New here.** A Stone cut by its own people; a group that comes after a choice (`after`).
- **Finds.** The cutter's piece, a second Anvil Shard, a keepsake; a piece with a plus in the
  foreman's shed, off the ladder, the box's to choose: no item is worn on the head (#535).
- **Pay.** About 1,000 xp a member.

### 4.10 The Anvil Stone's Rift (#465): dungeon, one level of 16×16, hand-built, band 17–18

- **Purpose.** The last Rift on the road (MONSTERS §2.2), hand-built in slag and iron (#434's 3): the
  Anvil Stone's field torn loose at the cut, and the Warden of the Anvil at its heart, whose fall
  closes the tear.
- **Landmarks.** Slag in ridges with iron running in it, red light from below; the Stone's cut face
  showing through the slag at the back, warm; the Warden standing up out of the cut.
- **Points of interest,** as a 16×16 dungeon is held: the slag's lanes, the iron runs, the cut face,
  the Warden's heart.
- **Encounters.** Slaglings (two groups), slag elders (two groups, elite 18) and the Warden of the
  Anvil, boss, level 18, *the Stone's heat, standing up out of the cut.* Cold bites all of them
  (MONSTERS §2.1); the sorcerer's Hoarfrost is the answer, and the cleric's Hearthfire is not. The
  tear closes when the Warden falls, and the Rift's groups and O5's slaglings stop coming
  (`until`); the Warden never comes back.
- **Quests.** The chapter's entry: the tear closed (§5). The Stone counts for the Hearth once the
  tear is closed, bought or taken alike (#540, #168), on the flag the Rift sets (§9).
- **The secret and its hint.** A hollow in the slag where the Stone's cut face shows through, and
  against it the first cutter's tools, left when the ground opened under him. The hint: the slag
  has run downhill in every lane but one, where it has set running up.
- **Lines:**
  - the tear: *Slag, in ridges, and iron running in it like sweat. The light comes up from
    below.*
  - the Warden's fall: *The red goes out of the slag. The ground stops humming. Up at the cut, the
    Stone is only a stone.*
- **New here.** A Rift in slag; the last Rift; a Stone's tear closed by the company for the second
  time, after the Grove's.
- **Finds.** The Warden's heart, the Heart of the Anvil, a keepsake as the Heart of the Sunder is
  (docs/areas/sunderwood.md §9, #199's 6); the first cutter's tools, two pieces with a plus off the
  ladder, the Rift's to choose (#535).
- **Pay.** About 1,800 xp a member.

### 4.11 O6, Feuerstollen's box (#466): country, band 18, with the tubes

- **Purpose.** The ash country under the vent ridge, the fire adit's mouth and the tubes below it:
  the heart's hardest ground, and the band's top on the surface.
- **Landmarks.** Ash from the ridge west to the grass, the drove road beyond the box's west edge in
  N6; the vent ridge from 479,171 to 484,184, blowing hot; the tubes' mouth at 478,178 under it, the
  way into the dungeon; a hermit's shelter in a cold vent.
- **Points of interest,** about five features and five groups: the mouth, and the inscription over
  it; the ridge, and the vents along it; a camp at the ash's edge (#45) and a cairn (#45); a hermit
  who counts the vents by their breath.
- **Encounters.** Salamanders on the ash (two groups, a proposal against the roster's Where
  column, §7); fire beetles at the ridge's foot.
- **Quests.** None.
- **The secret and its hint.** One vent among the hot ones blows cold, and in it the first dwarves'
  shelter, with what they left. The hint: ash lies on every vent's lip but one, where the breath
  comes the other way. Read, the inscription over the mouth says VENT. STAND CLEAR, and the reading
  marks the machine's other mouths on the world map (#434's 2).
- **The tubes** (`lava_tubes` and `lava_tubes2`, two levels, 17–18): tubes of black rock with the
  fire showing through the floor, salamanders in them (two groups a level), fire beetles, and in
  the deepest chamber the Great Salamander, boss, level 18, *the fire in the rock, with a head.*
  The roster's Where for the salamanders. The secret: a tube that was cut, not run, square in
  section, ending at a plate that nothing opens; the hint: the heat drops where the tube's walls go
  square.
- **Lines:** the mouth: *The dwarves' words for the mountain's breath, cut over the adit. Read:
  VENT. STAND CLEAR.*
- **New here.** Ash underfoot (#536); the salamanders, a new family; lava under a floor; a world map
  mark made by reading.
- **Finds.** The first dwarves' shelter: a Steel Bow +1, the ladder's (#535); in the deepest
  chamber, the Great Salamander's hide, a resistance to fire worn.
- **Pay.** About 1,500 xp a member, the box and the tubes together.

### 4.12 N6 and M6, the roads south and west (#467): country, band 16–18

- **Purpose.** N6: the drove road's last reach to Cairnmoor's border at 430,196, the crossing line
  facing back, and the branch west. M6: Kilnmouth's farms along the branch to Kilnhaven, and the
  lime kilns that gave the country its name.
- **Landmarks.** N6: the drove road from N5's 440,150 to 428,180 and south out of the box, the
  coach's road; the fork at 428,180; the heather beginning. M6: the branch from the fork through
  412,162 to L6; the farms; a row of lime kilns on the hill; a water of 60 squares.
- **Points of interest,** about five features and five groups each. N6: a milestone at the fork,
  ANVILHALL 8, KILNHAVEN 3; a camp (#45), a cairn at the border (#45) and a shrine (#45); a drover
  with a rumour of what came up out of the ice at Rime Lodge. M6: the kilns; a farmer whose son
  went down the mine (words only); a shrine (#45) and a cairn (#45); a lookout from the kilns' hill
  over Kilnhaven and the sea.
- **Encounters.** N6: fire beetles on the road's verges; a rock worm pair at the far end, the box's
  top. M6: fire beetles in the kilns, which are warm (two groups); a rock worm under the fields.
- **Quests.** None.
- **The secret and its hint.** M6: a drover's cache in one lime kiln, with what he took off the
  Compact's carts. The hint: every kiln in the row has its draw-hole open but one, stopped with a
  dressed stone. N6: the coach's old halt, a stone shelter off the road with a Rime Lodge coach bill
  in it; the hint, the road's verge worn wide where nothing stops now.
- **Lines:** N6's border: *The road goes on south into heather and wind. Cairns on the skyline,
  and no smoke anywhere.*
- **New here.** Cairnmoor seen: the drove road into Act III's second step.
- **Finds.** A Seax +1 in M6's kiln, the ladder's (#535).
- **Pay.** About 700 xp a member, the two together.

- **As built** (#467, 4 October): the brief's places, with two groups on N6 and three on M6, N6 laid
  whole in the heart and M6 in Kilnmouth (§1), both at 16–18 by the orchestrator's call (§9).
  - **N6.** The drove road comes on from N5 at 436,158 (12,0) into the same land, its floor 16 under
    N5's 17, so nothing is said of it. It runs out of the last of the charcoal woods over the open
    grass, past the drovers' stone (speed) and, by day, a dwarf caravan coming up with its ore under
    tarpaulin, its guards watching and not fighting, to the fork at 4,18, where the milestone reads
    ANVILHALL 13 and KILNHAVEN 4, counted along the roads (§9). The branch goes west from the fork
    and leaves by the west edge at 424,176 (0,18) for M6; the drove road goes on south and leaves by
    the south edge at 427,189 (3,31) into Cairnmoor's N7 (#476), where the border's line is said on
    the road. At the fork are the drovers' camp and a drover with a rumour of
    something come up out of the ice at Rime Lodge. East of the road the grass runs to the hills
    under O6's smoking ridge, with a dew pond and the drovers' black cattle; the moor's first heather
    comes in from the south-east, with a curlew in it and a cairn by the road at the border (110 gold
    and a Sapphire Vial). Off the road at 4,24 the verge is worn wide where nothing stops now;
    searched there, the stopped door beside it gives on the coach's old halt, a stone shelter with a
    bench and a faded coach bill for Rime Lodge, and in it 230 gold and a Healing Draught. Four fire
    beetles on the verge out of the woods and a rock worm by the heather at the far end, the top.
  - **M6.** The branch comes in from the fork at 423,176 (31,18) past a lime cart, climbs through
    the farms, crosses the stream on a white bridge at 16,3 and runs west along the river's north
    bank to the west edge, its last square, 392,162 (0,4), dirt beside Kilnhaven's gate at 391,162,
    since the atlas has no road beyond; past it, for now, the world ends. The stream comes in from M5
    at 415 to 418,158 (23 to 26,0), passes under the bridge and widens into the river's last reach,
    out by the west edge at rows 5 and 6. The farmers' shrine at a field's corner (personality), the
    farmer at his gate, whose son went up to the Tiefzeche and writes nothing, the limed fields over
    the river and a field barn. On the hill the lime kilns stand in a row, warm, each open at its
    draw-hole but one, stopped with a dressed stone; searched there, the stone gives on a drover's
    cache, the Compact's cloth and a strongbox with its seal broken, and in it 250 gold and a Seax +1
    (`seax+1`), the ladder's, which no walker, swimmer, climber or levitator reaches but through the
    stone. From the hill's top the lookout over Kilnhaven's harbour and the sea; a quarry in its
    flank and a cairn of white stones on the grass below (150 gold and a Sapphire Vial). Three fire
    beetles at either end of the kilns and a rock worm under the fields past the river, the top.
  - **Measured.** A company at 16 wins every fight in both and manages 7.52 fights to a rest on N6
    and 8.97 on M6, inside the aim, with 0.7% and 4% of its days ending in a fight broken off; it
    walks Kilnmouth's road, past the kilns' east end, every time. N6 pays about 787 xp a member and
    340 gold, M6 about 1,068 and 400. Two under, at 14, it wins every fight in both, owed to #18.
    Density: N6 99.9% within 12 steps and the furthest 13, no sign among its 17 points; M6 99.4%
    within 12 and the furthest 15, none among its 16.

### 4.13 L6, Kilnhaven's box (#468): core, band 17–18

- **Purpose.** Kilnmouth's step, the ore port from outside: the branch's end at the town's gate, the
  ore quay where the Fells' iron goes down to the ships, the coach yard and the heath on the shore.
- **Landmarks.** The branch from M6 to the gate at 391,162, the way into #469; the ore quay outside
  the wall and the bonded store on it; the coach yard; heather and sand along the shore, 85 squares
  of shallows; the Compact ship riding off the port.
- **Points of interest,** about eight features and six groups: the gate, and the coach yard
  outside it (#539); the ore quay, the store and its clerk; a milestone, ANVILHALL 11; a shrine on
  the shore (#45), a cairn on the heath (#45) and a camp under the wall (#45); a lookout from the
  heath over the sea to the far side.
- **Encounters.** Fire beetles in the ore heaps on the quay (two groups); a rock worm pair under the
  heath, the box's top; by night, the Hand's crew on the quay, from Act II's roster at level (§7).
- **Quests.** The chapter's goals point into the town (§5). A Crown to Order ends here (§6).
- **The secret and its hint.** The bonded store, where the crates stencilled for Cinderport and
  Sheer Point wait under the customs seal, with shards in their straw: found before the
  harbourmaster's manifests say it. The hint: every crate on the quay is open-topped but one row
  under tarpaulins, sealed.
- **Lines:** the quay: *Ore in heaps and a quay black with it. One row of crates is tarred over
  and sealed, and nobody goes near it.*
- **New here.** The sea seen from the far shore of Act II; a coach yard that runs.
- **Finds.** A Kiln Robe +1 in the store, the ladder's (#535).
- **Pay.** About 600 xp a member.

### 4.14 Kilnhaven (#469): town, 16×16, band 16–18

- **Purpose.** The act's second town and the ore port: where the harbourmaster's manifests name the
  Compact ship's cargo, and three ways out of the Kilns leave.
- **Businesses,** each with a room of its own (#473), the `interior` its feature names given with
  it. No spell hall and no guild hall (#434's 8 and 9).
  - The inn (rest, and the coach yard outside, #539). Interior: `kilnhaven_inn`.
  - The smith, the act's first step at a quarter more than Anvilhall's forge (#434's 1, #535: 1,375
    to 2,500 gold, `SMITH_PRICES`), the company's only forge if the Stone was taken.
    Interior: `kilnhaven_smith`.
  - The training hall, to 19. Interior: `kilnhaven_training_hall`.
  - The harbourmaster's office, where the manifests are read. Interior: `kilnhaven_harbourmaster`.
  - The chapel, cures and raising. Interior: `kilnhaven_chapel`.
  - The chandlery, provisions and lamp oil at list price. Interior: `kilnhaven_chandlery`.
- **People.** The harbourmaster, who reads the manifests for a company that asks and hears the
  Compact's cargo named, Cinderport and Sheer Point (§5); the Compact's shipmaster and the ferryman
  at the quay, who sell their passages (#539); the coachman in the yard; Jory Tallis's man, come for
  the crown (#56's 35); a dwarf who says the corridors run south under the world, toward the lakes.
- **Quests.** The chapter's last step (§5); A Crown to Order's end (§6).
- **The crossings** (#539): the ferry to Saltmouth, 400 gold and two days, and the Compact ship to
  Cinderport, 600 and two days, each a fare and never a favour, both from the start (EXPANSION
  §2.2); the coach to Rime Lodge, the drove road's, 250 and a day (#434's 9). Nothing is sold
  cheaper to a member of any guild here. The town writes where each puts a company down, the quay
  for the two boats and the coach yard for the coach, in `content/crossings.ts`, and sells each by
  a person whose `passage` is `sells('kilnhaven', ...)`: the ferryman, the shipmaster and the
  coachman. The ship and the coach are sold only once Cinderport and Rime Lodge are built, and the
  ferry's other seller stands on Saltmouth's quay (§9).
- **Lines:**
  - the gate: *Kilnhaven: ore on the quay, iron in the air, and the sea. Three ways out, and all
    of them cost.*
  - the manifests: *Iron to Cinderport, by the ton. Then a page in another hand: crates, sealed,
    for Cinderport and Sheer Point. No weight given.*
- **New here.** A town with three ways out; the Compact ship, which is the quest's way over the sea
  in Act IV.
- **Pay.** About 300 xp a member in the town's hand-ins, counted in §8 with the side quests.

### 4.15 O3, O4, M4 and M5, the country behind the road (#474): country, band 17–18, parked

- **Purpose.** The land off the roads, built once the owner has played the act (#434, call 10): O3,
  pine and hills behind Anvilhall; O4, the quarries under the crags; M4, pine and grass between the
  Fells and the farms; M5, Kilnmouth's farms.
- **Landmarks.** O4's quarries; M5's farms and the kiln country's lime pits.
- **Encounters.** Fire beetles and rock worms; salamanders at O4's quarries.
- **Pay.** About 450 xp a member each, outside the area's 13,067 (§8).
- Points of interest, the secrets and their hints, what is new and the finds are written when #474
  is unparked.

## 5. The one quest here

The Kilns' chapter is The Anvil Stone (`chapter.ts`, #470; the title is a working one), the first
of Act III, joined after Sunderwood's The Wall; every zone on the road holds a step (EXPANSION
§5.8): the Fells' at Anvilhall, the heart's at the Tiefzeche's door and the Stone, Kilnmouth's at
Kilnhaven. Its entries and goals, in the journal's voice, keyed to flags, events and maps the save
holds:

- **The way in.** From Lanternwood the east road climbs into the Fells; the goal points up the
  trail to Anvilhall, where the ship's papers said the cargo went below.
- **The verse.** In the great hall the Lantern reader reads the verse over the forge the old way,
  word by word: *"It's a warning. The kind you paint on a boiler."* Every holy word in the dwarf
  halls is a sign on a door. The goal turns to the thane.
- **The thane.** The dwarves have been cutting their own Stone for years and selling the pieces.
  Buy it back, 6,000 gold (#535), or take it (#434's 1): a choice put by a person (#76), which sets
  `anvil_bought` or `anvil_taken` and nothing else the map can see but the Anvil Guard (`after`) and
  the forge's door. Either way the thane never forgives: his words change, nothing else. The goal
  points down to the mine and east to the Stone.
- **The door.** At the bottom of the deepest mine the dwarves' tunnel ends and a clean, humming
  corridor begins. The door at its end reads CREW ONLY, and will not open; in the dust before it,
  hundreds of footprints walking down, in a line, and scratched on the frame at a girl's shoulder, a
  loop inside a loop: the knot off her mother's rope (STORY). The entry says what is seen, and the
  log never says what the door is.
- **The Stone.** The Warden of the Anvil falls, and the tear closes. The Stone is a stone again,
  and counts for the Hearth (#168, #540).
- **Kilnhaven.** The harbourmaster's manifests name the Compact ship's cargo: iron to Cinderport,
  and sealed crates for Cinderport and Sheer Point. The dwarves say the corridors run south under
  the world, toward the lakes under the glacier. The goal points down the drove road into Cairnmoor,
  and the chapter's done flag ends the Kilns' part of the act.

Nothing in the chapter is a lock (EXPANSION §2.3; #434, call 4): the door is a wall with words on
it, the thane sells to anyone with the gold and the Guard stands for anyone who took, the Rift opens
whatever the thane said, and the ferry, the ship and the coach run for anyone with the fare. A
company that comes to Kilnhaven first, by ferry from Saltmouth, reads the journal true in that
order: the manifests before the verse. The act's one lock is Coldmere's (#440).

The walkthrough plays it at 16, 17 and 18, in order, both ways at the thane, and with Kilnhaven
reached by ferry first.

## 6. Side quests

#56's four for the Kilns, all standing by the owner's call of 2 October 2026 (#434, call 11), each
built with its box on the systems of #76 (#471):

| # | Quest | Level | Where | What it needs | Pay | Built in |
|---|---|---|---|---|---|---|
| 33 | The Crust-Bearer | 17 | Anvilhall's well (N3) and the Tiefzeche's lowest level | a token carried (#43); a choice put by a person; an inscription with two texts (#538) | 200 | #458, #462 |
| 34 | The Primer | 17 | Anvilhall and Erzkamm (N2) | a choice put by a person; an item that reads while carried (#538) | 200 | #459, #460 |
| 35 | A Crown to Order | 18 | Gluthutte (N5) and Kilnhaven | a choice put by a person; a flag another act reads | 200 | #463, #469 |
| 36 | The Miners' Hymn | 18 | the Tiefzeche's doors and Anvilhall | once-events at each door; a verse for the Bard's third (#448) | 200 | #462, #459 |

Pay is xp a member, whichever way the choice goes, shared by level: about 800 between the four (§8).

- **The Crust-Bearer.** A dwarf mother at Anvilhall's well: her son carries the crust down for the
  knockers and will not come back up. He is on the lowest level, at the ledge where the crust is
  left, and the knockers let him be. Persuaded up with her token, he goes; left, he sends up a note
  in Kiln-script, a sign with two texts, which a company with a reader reads and the mother cannot.
- **The Primer.** The Regent's scholar buys children's primers of Kiln-script at Anvilhall and
  copies the wall at Erzkamm that says KEEP CLEAR OF THE DOORS. Handed to the thane, he is kept;
  his copybook taken, the company carries an item that reads inscriptions as a Linguist does while
  carried (#538), and reads #56's 16's rubbing. He does not say who he copies for: the primers are
  wrapped in Helmstow paper, seen.
- **A Crown to Order.** The smiths at Gluthutte are making a crown under THE FIRE IS KEPT BELOW,
  paid in shards, for Jory Tallis, whose man waits at Kilnhaven for it. Told, the thane stops it and
  keeps the shards; let go, the crown sails and Tallis owes the company, a flag the Empty Throne
  reads later (DESIGN §10.1, Phase 4).
- **The Miners' Hymn.** The miners sing a verse at each of the Tiefzeche's doors going down, a count
  of doors, and the company hears each as it passes. The oldest miner at Anvilhall sings the last
  one above ground, the verse for the door at the bottom: the last door is for the captain. Heard
  whole, it is a verse of the eleven for the Bard's third prestige (#448, DESIGN §5).

### The guilds' quests

None here (#434, call 8): no new guild comes with the act, and no hall gives an Act III side quest.
The Wardens' and the Lanterns' fourth ranks open in this act at their own halls (#439, DESIGN §8),
and the Lanterns teach Linguist at every hall of theirs (#538); Anvilhall's Lantern reader teaches
it too, a person and not a hall. Killing the Anvil Guard costs nothing with any guild: they are the
thane's, and the thane's forgiveness is already spent.

## 7. Encounters, and what is new

MONSTERS §7.1 has the roster and the fights: the Knocker, the Mender and the Foreman, the first
machines; the Salamander and the Great Salamander; the Fire Beetle on the spider frame; the Rock
Worm on the long bodies'; the Slagling, the Slag Elder and the Warden of the Anvil, the Rift in
slag; the Anvil Guard, a dwarf on the figure frame, `after` the taking. Their drawings are #472's,
eleven issues, all drawn: the knockers, the six on frames that exist and the salamanders (§3,
§9). §4.2 to §4.13 place every group, box by box, the beetles on M3's spoil
the gentlest and the Warden, the Foreman and the Great Salamander at the top of the band. No
machine stands on the surface or above the Tiefzeche's lowest level (MONSTERS §2.2, #158): the
first machines on the road are met at the bottom of the deepest mine, by a company that has walked
all of it.

Proposed, against the roster's Where column, and standing in the briefs as proposals: the Fire
Beetle on every box's spoil, kilns and ore heaps, where the roster has it at the spoil heaps and the
forges; the Salamander on O6's ash outside the tubes and on N3's and N5's heaps, where the roster has
it in the tubes and in the spoil heaps' fight; the Rock Worm in the surface adits and cuts of M3, N2,
N4, N6, M6 and L6, where the roster has it in the old workings; the Slag Elder strayed onto N5's
cutters' track, where the roster has it in the Rift. If the owner takes them, MONSTERS'
Where column says so in a pull request of its own. Two things the briefs lean on that the roster
does not hold: the Hand's overseers walking the cargo down (MONSTERS §7.1's Back, with no row), and
the Hand's crew on Kilnhaven's quay by night, both from Act II's roster at level, or said and not
fought, which #461, #462 and #468 settle with the owner; and a surface group at 18, which the roster
has only in the dungeons. The 17–18 boxes (O5, N6, M6, L6) were to hold their top with a rock worm
pair at 17 and the dungeons the 18s (#472's 13), but the curve asks every map's hardest group at its
floor and one more at least (`tools/tests/curve.ts`): 18 on a box whose floor is 17, and 19 on O6 at
18. N5 holds its top with a slag elder strayed from the Stone, gone once the tear is closed (#463's
4), as O5 can at the Stone. By the orchestrator's call (#467's 1), N6, M6 and L6 take their floor a
level down, 16–18, so a worm at 17 is their top, and O6 takes 17–18 with the elder's strays as its
18; no monster of Cairnmoor's roster comes into the Kilns.

New in the Kilns, for the novelty check (EXPANSION §5.4): the knockers and the salamanders, two new
families; the machine kind, with the cleric's Wrath passing through it (MONSTERS §2); pine and ash
underfoot (#536); Kiln-script read, a sign with two texts, a shortcut found by reading and a world
map mark made by it (#538; the mechanics `sign:read` and `sign:marks`); a choice sold like a ware,
and a shop that shuts for good; a group that comes `after` a choice; a coach that runs (#539); the
second prestige (#19). Its landmarks: a town cut into a hill, a mine's headworks, a smelter, a Stone
cut by its own people, a ridge of vents, an ore port. The area's `novel` claims each as a box places
it, since the check asks that what is claimed be used: pine with M3 (#457), the salamanders and
`sign:read` with N3 (#458), the town cut into a hill with Anvilhall (#459, its site's `fortress`),
the smelter with N5 (#463, its site's `forge`), the knockers and the mine's headworks with the
Tiefzeche (#462, the shaft's site's `mine`, built with it), the rest with theirs. N2 (#460) claims
nothing: Act II's road taught the second prestige first (Rietum's two, #425) and Sjonghol held the
first trainer in a cave, and a door that is a wall is no mechanic the check reads.

## 8. The numbers

- **Experience.** The curve (EXPANSION §5.2, #159) asks the climb from 16 to 18 over 0.75: 9,800 /
  0.75, about 13,067 xp a member, with today's `xpForLevel`. The shares of §4 add up to a little over
  it, the side quests inside and the country behind outside, as Sunderwood's do: M3 700, N3 900, N2
  600, N4 900, the Tiefzeche 2,400, N5 900, O5 1,000, the Rift 1,800, O6 and the tubes 1,500, N6 and
  M6 700, L6 600, Kilnhaven 300 for its hand-ins, and the four side quests about 800 between them:
  about 13,100. They are the issues' figures (#457 to #471). The country behind adds about 1,800 when
  it is built (450 each, #474). Each box is measured when it is built and recorded here as built,
  a fight inside the gate's aim costing what it costs; the sum is restated with each. A company
  should leave Kilnhaven at 18 with Cairnmoor's floor ahead, and a company that came by ferry at 16
  finds Kilnmouth's 17 waiting on the quay. As built: M3 1,068 (#457), N3 1,525 (#458), N4 1,468
  (#461), N2 1,095 (#460), N5 1,679 (#463), the Tiefzeche 4,278 (#462), N6 787 and M6 1,068
  (#467), so the shares stand at about 18,970. The Tiefzeche's Foreman alone pays 1,902 a member and
  its two corridor groups 858, past the brief's 2,400 before the upper levels' beasts (§9). Anvilhall
  pays nothing of its own (#459): its 300 is the chapter's and #471's.
- **Gold.** Training six members from 16 to 18 costs 7,920 with today's `trainPrice` (640 and 680 a
  member a level), and the Barbarian's Ironhide about 4,000 (DESIGN §5). The Stone's price is 6,000
  (`ANVIL_STONE_PRICE`, #535), so that a clear of the Fells and the Tiefzeche can just pay it: a
  company that buys trains later, and one that takes pays a quarter more for its gear at Kilnhaven's
  smith. Sized so: M3, N3, N2, N4 and the Tiefzeche are 5,500 of the 13,100 xp a member of §4's
  shares, about 42%. If the area's clear pays both its training and the Stone, and its gold lies
  where its xp does, those boxes hold 42% of 7,920 and the price, which is the price itself at
  about 5,730, or 7,560 with the three side quests that lie in them (33, 34 and 36) and Anvilhall's
  hand-ins counted in; 6,000 lies between, nearer the boxes alone. So the Kilns' clear owes about
  13,900 gold, the training and the Stone, 6,000 of it in the Fells and the Tiefzeche; the curve's
  row asks only the training, so each box's issue carries its share of the Stone. The step's
  wares at Anvilhall's forge and its finds with a plus sit inside the band's window, 3,500 (#535):
  the dearest ware the Dwarf Mail at 2,000 and the dearest finds the Plate Mail +3, the Mattock +1
  and the Steel Bow +1 at 1,650; the smith's quarter more on the Dwarf Mail, 2,500, sits inside too.
  The forge's full set for the premade six comes to about 17,300, its weapons 8,500; at the smith a
  taker pays about 4,300 more for the same. As built: M3 holds 740 (#457), its share by the brief's
  700 of the 13,900, in its cairn and the drover's box; N3 holds 950 (#458), its share by the brief's
  900, in its cairn and the tithe-cellar; N4 holds 950 too (#461), in its cairn and the wagon yard;
  N2 holds 640 (#460), its share by the brief's 600, in its cairn and the hoard; N5 950 (#463), in
  its cairn and the shard store; N6 340 and M6 400 (#467), their share by the brief's 700 together,
  in their cairns, the halt and the kiln; their monsters carry none. The Tiefzeche holds 2,550
  (#462), its share by the brief's 2,400, in the coins behind the first niche (400), the Hand's cages
  (900) and the knockers' room (1,250); its beasts carry none, and its machines carry parts.
  Anvilhall holds none (#459): its forge sells the step at the prices above, and its thane takes the
  6,000.
- **The gate.** Each map at its own floor (docs/areas/thornmark.md §9, 17; EXPANSION §5.2): a
  company at 16 wins nine in ten of M3's fights and walks the trail resting at its camp; one at 14
  wins no more than one in four, which is how the Fells turn an Act II company back. The Foreman and
  the Warden of the Anvil are won about half the time at their maps' floors and nearly always two
  above. Act II's boxes owed their two-under figures to the gear past 10 (#18). #535's ladder now
  dresses a company at each of the Kilns' floors past one two under it, Anvilhall's forge at 17 and
  its finds by 19; whether that holds the figure is each box's to measure. As built: M3's does not,
  nor N3's, N4's, N2's, N5's, N6's or M6's. A company at its floor, 17 on N5 and 16 on the rest,
  wins every fight in each and walks the Fells' road, the heart's and Kilnmouth's every time, and one
  two under wins every fight too, owed to #18 as Act II's are (§4.2, §4.3, §4.5, §4.6, §4.8, §4.12);
  so do the Tiefzeche's two upper levels, banded from the area's floor (§4.7). The Foreman is won 50%
  at the bottom's floor, 17, and 95% at 19, its hit points and its blow set off the line by the gate
  (§9); the bottom's day, 9.64 fights to a rest, and its groups pooled with the Foreman, won 83.3%,
  are off the aim and inside the limit.
- **Density.** Core boxes at the Foreland's floor, country at the looser one (EXPANSION §5.3); the
  Tiefzeche's lowest level at the dungeons' floor with the corridor's side room inside it. As built:
  M3 98.5% within 12 steps and the furthest 15, with no sign among its 14 points (#457); N3 97.6%
  within 8 and the furthest 10, with one sign among its 22 (#458; the open gate's exit takes the
  place of its event, #459); Anvilhall, a town, 100% within 7 and the furthest 4, five signs among
  its 22 points (#459); N4 97.7% within 8 and the furthest 13, with one sign among its 25 (#461); N2
  100% within 12 and the furthest 12, with one sign among its 16 (#460); N5 97.4% within 8 and the
  furthest 11, with one sign among its 27 (#463); the Tiefzeche's three levels 100% within 7, the
  furthest 4, 4 and 5, with one sign among 18 and 19 points on the upper two and none among the
  bottom's 15, the side room inside it (#462); N6 99.9% within 12 and the furthest 13, with no sign
  among its 17 points, and M6 99.4% within 12 and the furthest 15, with none among its 16 (#467).

## 9. Decisions

Decided by the owner's delegate on 2 October 2026 (#434), and followed here; the calls are #434's by
number, and those that are not the Kilns' are left out:

1. **The Anvil Stone is bought back or taken** (call 1), a choice the thane puts in Anvilhall the
   way a business puts its menu. Buying costs about 6,000 gold, set with #535 so a clear of the Fells
   and the Tiefzeche can just pay it. Taking puts the Anvil Guard on the Stone's approach (`after`)
   and shuts Anvilhall's forge to the company for good, so the gear step is Kilnhaven's smith's at a
   quarter more. Either way the Warden of the Anvil must fall for the tear to close, the Stone counts
   for the Hearth (#168, #540), and the thane never forgives: words change, nothing else.
2. **Kiln-script is read, never needed** (call 2): an inscription is a sign with two texts; a
   reader is a member with Linguist, a dwarf (free) or 34's copybook; reading gives a secret's hint
   in the machine's words, finds the Tiefzeche's service ladders between levels, a shortcut, and
   marks the machine's mouths (the ice-hole, the bay under Coldmere, the vents) on the world map.
   The Lanterns teach Linguist at every hall of theirs, and a Lantern reader in Anvilhall teaches it
   too (#538).
3. **The Anvil Stone's Rift is hand-built** (call 3), one level of 16×16 in slag and iron, the last
   Rift on the road.
4. **The act's one story lock is the sealed bay under Coldmere** (call 4; #440), not the CREW ONLY
   door, which is a wall with words on it.
5. **No new guild** (call 8): no hall gives an Act III side quest, and the Wardens' and Lanterns'
   fourth ranks open in this act (#439).
6. **Cairnmoor has no town** (call 9): Anvilhall and Kilnhaven teach to 19, and the drove road's
   coach runs Kilnhaven to Rime Lodge.
7. **The cuts stand and the country behind is parked** (call 10): §11, and #474.
8. **All of #56's 33 to 36 stand** (call 11): §6.
9. **The names** (#435): §10.

Proposed, for the owner, each in the issue that would build it:

- **The briefs** of §4.2 to §4.15: each box's landmarks, points of interest, encounters, secret and
  hint, inscriptions, finds and share of the pay.
- **The core** is N3, N4, O5 and L6, the boxes that hold a step, and N5, the smelter, where the
  crown is made and the verse stands over a second forge; the rest is country (§4).
- **The dungeons' sizes:** the Tiefzeche three levels of 16×16, the workings, the old workings and
  the lowest (#462); the Rift one level of 16×16 (#465, call 3); Feuerstollen two levels of 16×16
  (#466).
- **The towns' businesses:** Anvilhall's six (§4.4), the great hall carrying the choice as a
  business carries a menu, the forge shutting on `anvil_taken`; Kilnhaven's six (§4.14), the
  harbourmaster's office a business so that the manifests have a room.
- **The verse is read aloud by the Lantern reader the first time,** so the step needs no skill, and
  a company with a reader of its own reads it first (§4.4, #459).
- **The service ladders are secret doors found by reading** (§4.7): the hatch opens to a search once
  the inscription beside it has been read, and the stairs stay the way for everyone. As #538 built
  it, the reading is the hatch's hint and a search finds it as any door (#538's 5, below).
- **The pay's shares** (§8).
- **The bands on the atlas's rows** (#456): the Iron Fells 16–17, the Kilns' heart 16–18,
  Kilnmouth 17–18, Anvilhall 16–18, the Tiefzeche 16–18, the Anvil Stone 17–18 (the plan has 16–18),
  Feuerstollen 17–18, Kilnhaven 16–18. They are set in `src/content/areas/kilns/atlas.ts`, where
  only the scaffold reads them, for a box's draft; the owner's word changes them there.
- **N4 is the heart's,** as the walk gives it, so the heart reads 16–18 and the Tiefzeche is the
  heart's dungeon: the plan's link (`ironfells` to `deep_mines`) and MONSTERS §7.1's parenthesis,
  which put the Mines in the Fells with Anvilhall, are the owner's to reword or to overturn by laying
  N4 in the Fells, which would make the Fells 16–17 still and the heart 17–18.
- **The surface roster's top** (§7): the 17–18 boxes hold their top with rock worm pairs at 17 and
  leave the 18s to the Rift, the tubes and the Foreman, or #472 adds a surface monster at 18.
- **The Fire Beetle, the Salamander and the Rock Worm off their Where column,** and the Hand's
  overseers and crew from Act II's roster at level (§7).
- **The keepsakes:** the Anvil Shard (N3's and O5's), the Heart of the Anvil and the parts the
  machines carry, none taken by a hand-in, as the Brine Shard, the Sunder Shard and the Heart of the
  Sunder are not.
- **The heart's zone keeps the area's name on the atlas** ("The Kilns", `kilnsheart`): a name of
  its own is the owner's to give with #435 (§10), since the crossing line into it says the area's
  name twice.

Decided by delegate for #540, each the owner's to overturn:

1. **The flag is `q_anvil_closed`,** set once the Warden of the Anvil has fallen and the tear is
   closed. The Rift sets it (#465), the chapter's Stone entry reads it (#470) and O5's slaglings may
   stop `until` it before the Rift is built (#464). It is the Stones' own form (`q_tide_home`,
   `q_grove_mended`), and not `_done`, which would read as the chapter's end. Nobody renames it or
   adds a second.
2. **The Hearth does not read the thane's choice.** Bought (`anvil_bought`) or taken
   (`anvil_taken`), the count is the same: the choice is how the Stone came to the company, never
   what restores it, and the Rift opens whatever the thane said (§5). A company that closes the tear
   before it has spoken to him steadies the Hearth all the same. §4.10 asked that the Stone be the
   company's as well, and now says bought or taken alike.
3. **A flag, not the Warden's death read as `slain`,** as the issue has it: the Rift's map is not
   built to name, and one flag is what the Hearth, the chapter and O5's groups all read. It is owed
   to #470 in `tools/tests/quests.ts`'s `UNSET` (#415) until something sets it, and the first to do
   so drops the entry there.
4. **No wording changes.** The title, the sky and the almanac read the count, which stands at five
   Stones already, so the Anvil Stone is one step more wherever it falls.

Decided by delegate for #539, each the owner's to overturn:

1. **A crossing is written once, both ends together,** in `content/crossings.ts`, as
   `content/stones.ts` lists the Stones: one fare, length and timetable either way, and each end's
   landing once its town is built. A town sells one by a person whose `passage` is `sells(...)`.
2. **Nothing is sold toward a town not built:** an end with no landing names the issue that writes
   it (#469 for Kilnhaven's three, #487 for Rime Lodge and #512 for Cinderport), and a seller whose
   crossings all wait only talks. So none runs yet; the ferry runs first, once #469 writes the quay.
3. **Once both ends land, both sell it** (a crossing that runs one way is not honest, #177's 1), or
   the check fails: #469 puts the ferry's seller on Saltmouth's quay, as #177 gave E6's captain the
   way back. Saltmouth's landing is written now: 13,10 on the quay, facing west, where Kitto's lands.
4. **A fare is 12.5 gold a level of the dearer end's floor for each day,** as Kitto's boat is 150
   for a night to Wrackholm's 12: the ferry 400, the Compact ship 600 (Cinderport's 24) and the coach
   250 (Rime Lodge's 20). The check holds the rule.
5. **The days are the way's length at Kitto's pace,** some five squares an hour, and at least one:
   two for the ferry's 290 squares of sea and the ship's 230, one for the coach's 140 of road. The
   ferry sails at 8 and the ship at 20, as his does, each landing at 16; the coach runs 6 to 12.
6. **A seller may halve a fare for his own guild at his own end,** and Kilnhaven halves none
   (§4.14). Whether Cinderport halves the ship for the Compact, as docs/areas/ashfall.md §4 has it,
   is #547's to settle with #512.
7. **The atlas's link, sold both ways, is drawn as that way built,** on its course and under its
   name, and not again as planned.
8. **The gate needs nothing new:** #164's `landings` makes a town a crossing lands in a way into the
   zones its ways out open on, so each town is held to it from the day a crossing to it runs.

Decided by delegate for #538, each the owner's to overturn:

1. **An inscription is a sign with `read`**, not a feature of its own: its words are said as any
   sign's, and the reading after them as its reader's line, *Maren reads: "STORE."*, so a brief's
   *Read: X* is written `read: 'X'`.
2. **A reader** is the first standing member with Linguist or a dwarf, else, while an item with
   `skill: 'linguist'` is carried, its carrier or the first standing member; one knocked down reads
   nothing.
3. **A reading is kept by the inscription's id in its map's `used`,** as a once-event is: `seen`
   names it for a person's words or an entry, and nothing new is saved. An inscription must have an
   id, and the type asks for one.
4. **A reading may be a secret's only hint, and the hint check counts it** as any sign on the near
   side; the briefs' seen hint beside it (§4.1) stays the boxes' practice, so no secret needs a
   reader.
5. **A reading is a hint, never a key:** a hatch it names is found by a search as any secret door
   is. Gating the hatch on the reading (the ladders' proposal below) is not built; it would want a
   field on `secrets`, #462's to ask for.
6. **`marks` names atlas places,** planned or built, one or several; once read, the world map pins
   each with a hollow square of its own colour, with no name and no word in the legend, which is
   full, and the first reading says *Maren marks the world map.*
7. **Reading never opens the road:** it sets no flag and changes no door, and the check refuses a
   way whose `shut` names a reading.
8. **Linguist is a list on the member, `skills`,** absent in an old save and read as none, so no
   save bump; the dwarves are born to it (the skill's `race`), so the sheet lists it for a dwarf too.
9. **A guild's halls teach its skills to its members** (DESIGN §5 and §8, "taught to its members"):
   every business with `hall: 'lanterns'` offers "Learn a skill", Rime Lodge's too once #487 builds
   it, and a stranger to the guild hears *"We teach our own."*
10. **A person teaches a skill with `skill`,** beside `teaches`, which stays the prestiges', so the
    walkthroughs that read `teaches.cls` keep their types; Anvilhall's reader is #459's to place.
11. **Linguist costs 1,000 gold a member:** a first prestige's price, under a tier 6 spell at the
    Watch (1,280) and an eighth of training six through the band (7,920, §8).
12. **The copybook is any item with `skill: 'linguist'`,** tested with a fixture until #471 builds
    the Primer's. A carried thing's own Kiln-script (34's rubbing) is not built: an item would want
    a reading of its own, a few lines in the systems lane, for #471 to ask for.
13. **The line check hears an inscription as a reader with a ten-letter name does the first time:**
    its words, reading and mark said together, which Feuerstollen's brief (§4.11) fills exactly.
14. **The novelty check names the new mechanics** `sign:read` and `sign:marks`, for §7's claim.

Decided by delegate for #472 (the knockers), each the owner's to overturn:

1. **The knockers are woodlice the vessel made:** smooth grey plates laid one over the next, round
   over the back and flat under the belly, on thin legs with ball joints, all alike, stepping in a
   wave. Small, many-legged and smooth read at once, and nothing on the road is shaped so; the
   spider frame, eight legs with the knees high, was left to the spiders.
2. **One lamp in the cowl's face, under a brow,** warm as a miner's lamp and the same in every one:
   a pool of it lies on the rock ahead of a knocker, and now and then it dims, as a blink. The cowl
   is a plate of its own over the shell's front.
3. **The chisel's mark is a lozenge on a stem,** cut straight and even into a plate of every one.
   It is the mark's first drawing, so the chisel's and the treaty's seal can follow it. It is not the
   loop inside a loop: that is Wenna's family knot (STORY, Acts One and Three), hers alone, on the
   frame of the door marked CREW ONLY.
4. **The Knocker knocks:** two feelers off the cowl's chin end in knobs, and it raps the rock ahead
   with them in turn. Fodder on #409's line at 16: 127 hit points, armour 18, +9, 3d5+2, speed 12,
   317 xp; size 0.45, tint #84878e.
5. **The Mender carries its trade,** domed higher, a spool of copper wire on its back and an arm
   that brings a needle down before its cowl, a cold light at the point, so a company picks it out
   of six knockers at a glance. A soldier's numbers at 17: 199 hit points, armour 20, +10, 3d8+4,
   speed 11, 673 xp, on #541's line (196 and 3d7+5 on #409's); size 0.55, tint #9a9c96.
6. **The Mender casts Mending Light one turn in two** that one of its group is hurt. At every turn,
   the harness's bot, which never singles it out, broke off half its days at fifteen rounds at 16
   and 17; at one in two, 6 to 7% of them, the fight a round longer than with a mender that never
   mends (5.4 rounds to 4.4 at 16, 300 seeds). On #541's line, the Mender re-stated, 7% and 13%.
7. **The Foreman is a knocker grown long and reared up,** its cowl bowed over a slate held before
   it with the list cut on it in rows, an empty box at each row's end; a stylus goes down the boxes
   and ticks none, and now and then the lamp lifts from the slate to the company. Size 1.3, under
   the tall boss's 1.5, so it stands on its group's rank; tint #5c6068.
8. **The Foreman stands on the boss line at 18,** 1,001 hit points, armour 22, +13, 18d8+20 on #541's
   line (961 and 17d8+20 on #409's), for #462's gate to tune, as #199 tuned the Warden of the Sunder:
   a company wins it 9% of the time at 14, 50% at 16, 79% at 18 and 99% at 20 (300 seeds; 17%, 66%,
   82% and 99% when it was drawn).
9. **One frame, a Build to a kind:** length, dome, taper, rear, plates, legs, stance, step, cowl,
   feelers, spool, needle, slate and the mark, so MONSTERS §11's tallyman, deep knocker, inspector
   and tally clerk are each a Build, a colouring and what their trades carry.
10. **No gold and no drops:** machines carry parts (MONSTERS §2), and the parts are items, #462's
    to add with the groups it places, as the Heart of the Sunder came with #199.
11. **They stand unplaced, owed to #462,** which seats six knockers and a mender twice in the clean
    corridor and the Foreman before the door.

Built since, in the systems lane: MONSTERS §2's line for the first time the Hearth's light passes
through a machine, *The light goes into it like a hand into a glove.*, follows in the combat log the
knocker that takes 0, once a game (MONSTERS §3).

Decided by delegate for #535, each the owner's to overturn:

1. **Act III's ladder is built as Act II's was** (#399's 1): each town sells every class a new line,
   a point of blow a rung and a two-hander a point over a one-hander, and the boxes give it with a
   plus: Anvilhall's forge at 17, the Kilns' and Cairnmoor's finds by 19, Rime Lodge's furrier at
   21 and Rimewater's finds by 22.
2. **The forge sells eight, a smith's and a miner's:** a Forge Hammer, a Seax, a Steel Bow, a
   Mattock, a Banded Staff, Dwarf Mail, a Kiln Robe and a Forge Shield (§4.4).
3. **Armour steps on alternate rungs, as Act II's** (#399's 2): the medium wearers take the Dwarf
   Mail (11) at 17 and the furrier's Bearskin Coat (12) at 21; plate's wearers the Forge Shield (6)
   at 17, N3's Plate Mail +3 (12) at 19 and the Sleepers' Bay's Plate Mail +4 (13) at 22; the
   casters the Kiln Robe (9) at 17, L6's Kiln Robe +1 (10) at 19 and the furrier's Fur Robe (11)
   at 21. Each gains in the act what it gained in Act II.
4. **No Dwarf Mail with a plus, and no Forge Shield +1 on the ladder:** a Dwarf Mail +1 would leave
   the furrier's coat no step, and N5's shield with a plus is its box's to place or not.
5. **The finds by 19 go where the briefs name the piece** (#399's 3): N3's armour, the Tiefzeche's
   weapon, Erzkamm's two-hander, O6's bow, M6's dagger and L6's robe, with Cairnmoor's caster's plus
   at O7. M3's, N4's, O5's and the Rift's are their boxes' to choose, off the ladder; O5's helm is
   none, as no item is worn on the head.
6. **The finds' rung is 19,** as Act II's was 13, in the middle of the act's second area: a company
   two under Cairnmoor's floors at 20 goes without it.
7. **A ware rises about a quarter a town, its dearest a little over half its window,** as
   Saltmouth's Sharkskin Coat (1,100 of 2,000) and the Watch's Lamellar (1,600 of 3,000) were: the
   Dwarf Mail 2,000 of 3,500, the Bearskin Coat 2,500 of 4,500. Act II's half again a town would
   bring Cinderport's step to the edge of Ashfall's 5,500 (#542).
8. **Kilnhaven's smith asks a quarter more, in whole gold** (`quarterMore` and `SMITH_PRICES`, for
   #469): its dearest, 2,500, sits inside the window, and the ladder test holds it and owes the
   shop to #469.
9. **The Stone is 6,000** (`ANVIL_STONE_PRICE`, for #459), sized as §8 says; the curve's row asks
   the training alone, and the boxes carry the Stone.
10. **The step is made ahead of the area** (`ITEMS_AHEAD`, `src/content/index.ts`), as monsters and
    rooms drawn ahead are: no save holds it until a listed area sells or places it, and the first
    box takes the table.
11. **The harness's line at 24 is owed to #541:** in the ladder's gear to 22 a company of 24 fights
    14.9 standard encounters to a rest where 10 are asked, and #541 makes the line past 16 again
    with it, as #409 did after Act II's (made again, 9.9 at 24: MONSTERS §4.4).
12. **The windows stay at 3,500, 4,000 and 4,500,** 500 a band as the issue has them: no ware or
    find comes within 400 of its area's.

Decided by delegate for #472 (the six), each the owner's to overturn:

1. **The six on frames that exist are drawn ahead of the first box,** in AHEAD, each owed a map by
   the box that first places it: the beetle and the worm #457's, the slagling #458's, the slag elder
   and the guard #464's, the Warden #465's. The salamanders come on their own, as the knockers did.
2. **Each is on its role's line at its level** (MONSTERS §4.4): the beetle armoured and the
   slagling a skirmisher at 16, the worm a brute and the guard armoured at 17, the slag elder an
   elite at 18. #541 re-stated the worm, the guard and the elder to its line: 404 hit points and
   4d8+7, 250 and 3d7+6, 365 and 4d8+3, where they had 422, 263 and 383.
3. **The Warden of the Anvil is on the boss line at 18,** 1,001 hit points and 18d8+20 on #541's
   line (961 and 17d8+20 on #409's), its blow left for #465's gate to set, as #426 set the Sunder's;
   it shrugs off sleep, as every warden does.
4. **Cold bites the slag and fire does it half:** the slagling, the slag elder and the Warden are
   weak to cold and resist fire, so in the Rift Hoarfrost is the answer and Hearthfire is not.
5. **The Fire Beetle is immune to fire and nothing more,** so on the spoil heaps the sorcerer's fire
   does nothing and Hailstorm is the answer (MONSTERS §7.1).
6. **The slag holds as the other Rifts' things do:** the slagling paralyses at 0.1 a hit and the
   slag elder at 0.15, as the sunderling and the tide elder.
7. **Sizes:** the beetle 0.72, the slagling 0.74, the slag elder 0.95 and the guard 0.8, drawn as
   broad as he is tall; the worm 1.6, MONSTERS' figure, a tall monster; the Warden 1.45, the biggest
   warden yet and short of a tall boss.
8. **The beetle is a body of its own on the spider frame,** six legs under a dome with the coal set
   in its top, as the crabs have theirs, so Ashfall's cinder beetle can be its variant.
9. **The slag is the riftling broken rough as clinker,** cracked red and hung with drops still
   molten, the elder running with iron; the Warden has no legs, and stands up out of a pool of slag.
10. **The Warden's cut is a straight fissure down its chest,** opening on the heart, with a low crown
    of clinker, hot at the tips, where the other wardens wear shards.
11. **The worm comes up through a ring of rubble,** blind, its maw ring inside ring of teeth; the
    guard is a dwarf rebuilt on the figure frame, a maul stood beside him and an anvil buckle.
12. **The Warden drops nothing yet:** the Heart of the Anvil comes with #465, which places it, as the
    Heart of the Sunder came with the Sunder's box (#426).
13. **No surface monster at 18:** #472 adds none; the 17–18 boxes hold their top with rock worm
    pairs at 17, as §7 proposes.

Decided by delegate for #472 (the salamanders), each the owner's to overturn:

1. **The Salamander is a beast, a skirmisher on MONSTERS §4.4's line at 16** (179 hit points, armour
   19, 3d8+2, speed 15), immune to fire and weak to cold as its row says, size 0.68: the sorcerer's
   cold is the answer, and the cleric's Hearthfire and the druid's Wildfire are not (DESIGN §7).
2. **The Great Salamander is a beast boss on the boss line at 18** (1,001, armour 22, 18d8+20 on
   #541's line; 961 and 17d8+20 on #409's), immune to fire and to sleep and weak to cold, as its kin
   and as the Eldest and the Great Devilfish. Its blow is #466's to set for the gate, as #426 set the
   Warden of the Sunder's, and its hide #466's to drop.
3. **It is a tall boss, size 1.6,** seated on the third rank with its crown at 0.79 of its height,
   under its markers' 0.82: the deepest chamber's boss, and the biggest thing in the tubes.
4. **The frame is a lizard three-quarter on, coming at the company,** its head turned on toward the
   company's right. Side on, as the bears stand, a lizard is as wide as a bear and read as a dinosaur
   standing up; three-quarter on it reads as a lizard at a glance, and its mouth can open to them.
5. **The fire shows in blotches, as a fire salamander wears its yellow,** and on the Great Salamander
   in the seams of a crust of rock and in its open mouth. The embers are the parts apart, declared in
   `tools/smoke.ts` as the rift hound's are: three pieces, 1% of the ink.
6. **The frame is a Build for the kin to come** (MONSTERS §11): the ember salamander a hotter fire on
   a lither body, the basilisk no fire, a crest, a crown and a stare, each a Build and a colouring.
7. **The Salamander is owed to N3 (#458),** the first box whose brief places one (§4.3's spoil heaps,
   the roster's second fight), and the Great Salamander to the tubes (#466): `UNPLACED` in
   `tools/tests/maps.ts` says so until each is placed.

Decided by delegate for #473, each the owner's to overturn:

1. **The ids follow the towns,** `anvilhall_` or `kilnhaven_` and the business, as Saltmouth's do
   (`saltmouth_inn`): §4.4 and §4.14 give them for #459 and #469 to name, and each scene's file is
   named for its id, as `tools/changed.ts` reads a room by its file.
2. **The verse is lettered twice:** in the great hall over the kings' forge, where the reader reads
   it (§5), and in the forge over its hearth (§4.4, "under the verse"), since the dwarves read it at
   their forges and Gluthutte has it again (§4.8). It is the dwarves' words, cut and painted red in
   the font's capitals, never a reading (#538).
3. **The old script over the other doors is drawn as cut marks, never letters,** angular like the
   runes on the Grove Stone's copy in Thornhold: #459's "every door carries a verse" is kept without
   lettering verses the docs do not hold, and what one says is an inscription's on the town's map
   (#538, #459).
4. **The great hall's forge is the kings' forge, behind the thane's seat** (STORY, #459), its coals
   heaped in the arch so the seat stands dark against them; the forge business is the smiths'
   working forge, a room of its own.
5. **No crown on Anvilhall's anvil,** though #473's list had one: A Crown to Order's crown is made
   at Gluthutte (§6, #463), and a second in Anvilhall's forge would put it in two places.
6. **The rooms follow §4.4 and §4.14, not #473's older list:** the mine-surgeon's for a temple, the
   stores for a provisioner, training halls for trainers' yards. Kilnhaven's chapel is the Lanterns'
   (the ring on its altar) and a sailors' chapel, a ship hung from its beam as the coast hangs them.
7. **Kilnhaven's chandlery is a chandler's in the old sense,** candles and lamps, the miners' frog
   lamps among them, so that it is not Saltmouth's ship's chandlery again; it sells what §4.14 says.
8. **Kilnhaven letters its three ways out and nothing else:** RIME LODGE on the coach's board,
   SALTMOUTH and CINDERPORT on the board of sailings, with no times or fares, which are #539's. The
   manifests are ruled and never lettered: Sheer Point is the harbourmaster's to say (§4.14).
9. **Every room lets the day in,** by a window, a shaft, a breach or a door, so nine at night is not
   noon: Anvilhall's look out from the terraces over the heart, Gluthutte's smoke by day and the far
   fires red by night; Kilnhaven's on the harbour, the yard and the street; and the harbourmaster's
   and the chapel's windows hold the Hearth on the sea, as Helmstow's throne room's does.

Decided by delegate for #457, each the owner's to overturn:

1. **The brief is §4.2, not the issue's draft:** the issue's waymark in Kiln-script and the cache
   under it gave way to §4.2's milestone and walled adit, written after it, so N3's niche stays the
   first inscription a company reads (§4.3).
2. **The old adit is in a crag at the box's far end,** south of the trail by the east edge, not in
   the Fells' flank: the curve walks the mountains as a climber does, and only there is the worm
   further from the way in than the beetles on its spoil, as the rise asks.
3. **Three groups for five:** two threes of beetles on the spoil and the one worm, 1,068 xp a member
   for the brief's 700. Beetle pairs put fights to a rest past 10, and "a rock worm" is one; fights to
   a rest is the gate and a share a proposal, as Saltreach's C6 had it (docs/areas/saltreach.md §9).
4. **The milestone reads ANVILHALL 4, LANTERN WATCH 6,** at about 13 squares to the unit along the
   trails: the brief's 8 was long. M2's stone is put right from 12 to 8 so that the two agree, as
   Saltreach's D5 was; N3's spur, about 40 squares from M3's edge to the gate, keeps them so.
5. **M3 is laid whole in the Fells,** with Lanternwood's 554 squares of trees in its west, so the
   pass, the crossing and 404,70 are the Fells'. M2's road says the crossing as it arrives, with the
   world's harder line after it under the floor; going back the land's name is said. This is the line
   facing back that #202's 1 owed to this box.
6. **A pine verge at the crossing:** the forest beside the road in M3's first eight rows is pine two
   squares deep, so the pine the crossing names is there; the rest of the west stays forest, shut
   against L3.
7. **The Fells' line with the heart is held on the seam of rows 3 and 4** by seeds in the area's own
   rows, as at M2's edge: laid whole, M3 would run the Fells into N4, its mine's mouth and O4. N3's and
   O3's south rows go to the Fells, as laying N3 will make them; M4's north goes too, unheld, parked.
8. **M2's ridge over the Warden's grave is rock for two squares:** with M3 laid, M2's south row is
   mountain and no longer the world's end, and a climber off the road would come down on the grave.
9. **The find is a Drover's Goad +2,** the Watch Staff's line at 1,300 gold: off the ladder as §4.2
   asks and the wagon's own, a staff a monk or a druid has a level before the forge's.
10. **Its gold is 740, its share by the brief of the 13,900** (§8): 240 in the cairn on the shoulder
    and 500 with the goad. The dwarves' hearth by the adit gives might.
11. **Two under is owed to #18:** a company of 14 in the Watch's gear beats every group at the line's
    standard size, as on every Act II box; the gate's other figures are inside their aims.
12. **The woodcutters camp under the shoulder north of the trail's head and fell in the pines
    south-west of it,** each a point where the country floor wants one and the land is otherwise bare.

Decided by delegate for #458, each the owner's to overturn:

1. **The brief is §4.3, not the issue's draft:** no dwarf guards here, since the Anvil Guard stands
   at the Stone (#464), and the secret is the tithe-cellar, not an old working's second mouth; the
   verse and the Lantern reader are the town's (#459), as §4.4 and #538's 10 have them, and nobody
   camps at the gate.
2. **The gate is the atlas place's own square, 452,70 (N3's 28,8), not 452,80:** the town and the box
   are built at once, so both take the place's square, and the atlas's site and its way in move to
   it. The spur runs 46 squares of road from the trail to the forecourt before it.
3. **The gate is barred until the town is built,** as Lantern Watch's was on L2 (#200's 2): an exit
   leads only to a built map. Its exit is written beside the map, `GATE` in `ironfells_n3.ts`, into
   the town's start inside its own gate at 7,14 facing north, for #459 to list and to open the
   square; the town's way back lands on 28,9, facing south. The gate's event, `n3_gate`, leaves the
   town's line (§4.4) to the town, which says it on arrival.
4. **M3's milestone reads ANVILHALL 5:** the gate is 61 squares on from it along the trail and the
   spur, where #457's 4 counted about 52 to 452,80; M2's 8 holds at 106. The walkthrough holds the
   figure.
5. **Four groups for eight:** three slaglings by night on the trail's far end, gone once the tear is
   closed (`q_anvil_closed`, #540); three fire beetles and a salamander on the low heap and three
   salamanders and a beetle on the high one, the roster's fight; and the worm. They give 8.49 fights
   to a rest at 16 and 1,525 xp a member for the brief's 900: fights to a rest is the gate and a share
   a proposal, as #457's 3 has it.
6. **The worm lies in a collapsed working at the box's south-east corner,** in the rock the atlas puts
   there: the box's group at 17, further from the way in than every group but the high heap's (a rank
   correlation of 0.26).
7. **The terraces are fields behind dry-stone walls,** four of them, stepped up from a stair at their
   west end with steps at their east end, and the crag over the gate is mountain where the atlas has
   hills: a town cut into a hill, seen from its door. The gate's front is three squares of dressed
   stone.
8. **The niche is the shrine and the inscription on one square,** over the lowest wall: the hearth
   gives endurance on Space, the words are said on the step and the reading is the hint's second half
   after the ruts (#538's 4), so no company needs a reader to find the cellar.
9. **The mother at the well has her words and nothing more:** her token, her flag and the journal
   come with her son on the Tiefzeche's lowest level (#462, #471), so 33 never stands in the log with
   nothing to do until the mine is built.
10. **The fell holds the hall's air shaft and an old bloomery** besides the brief's burying ground and
    cairn, and the camp is under a knoll by the spur: a core box's points must reach its open grass,
    and the brief's gather at the terraces and the trail.
11. **Its gold is 950, its share by the brief of the 13,900** (§8): 250 in the cairn and 700 in the
    cellar with the Anvil Shard (`anvil_shard`) and the Plate Mail +3, the ladder's (#535).
12. **Two under is owed to #18,** as M3's is: a company of 14 beats every group at the line's standard
    size; the gate's other figures are inside their aims.

Decided by delegate for #459, each the owner's to overturn:

1. **The Stone is sold as a ware: an answer may have a `price`** (`src/game/map.ts`,
   `src/game/people.ts`), listed at it, barred to a company with less and paid as it is answered. No
   answer could take gold, and a negative pay would have run a purse below nothing.
2. **The great hall is a room with people in it,** as Lantern Watch's prior's room holds its Reader:
   the room says the nave and the verse, and the thane and the Lantern reader are each a "Talk to" on
   its menu, the thane's question the menu he puts.
3. **The verse is cut over the great hall's doors as over the kings' forge,** so a company with a
   reader of its own reads it at the doors, kept by its id (`seen: 'anvilhall:ah_verse'`), and the
   reader then says it after them; either way he sets `anvil_verse_read`, the chapter's step (#470).
4. **The reading is DANGER. KEEP FIRE BELOW THIS LINE.,** the line painted on a boiler, which the
   reader says aloud to a company with no reader before the brief's words.
5. **Four doors and the gate carry an inscription, not all six:** one point in four may be a sign,
   so the town holds five among its 22 points. The forge and the stores carry none.
6. **The forge is gone `until` `anvil_taken`,** its smiths with it, a barred door's word after it, as
   Helmstow's chapel shut (#157); no lock, since its trade is had at Kilnhaven's smith (§5, §9's 1).
7. **The thane's answers set their flags and pay nothing;** his first meeting sets `thane_met`, for
   the chapter to read. The town pays nothing of its own, as Saltmouth paid nothing of its own (#177).
8. **The town is a court cut down into the hill and open to the sky,** three terraces up from a gate
   one door wide to the great hall's doors: a town has the sky over it, so the hold's rooms are the
   rooms (#473) and the court their street.
9. **N3's gate opens** (#458's 3): the town lists `GATE` in N3's exits and its square is a door in
   the dressed front; `n3_gate`, which said the door was barred, goes, since the gate's label says
   the door as a company goes in (10). The way out lands on N3's 28,9, facing south. The plate
   moves into the hill behind the gate, at 452,66, as Saltmouth's moved onto its walled ground
   (docs/areas/saltreach.md §9, #177's 9), and the site at the gate is built.
10. **The brief's gate line is the gate's own,** `GATE`'s label, said as a company goes in: the game
    says an arrival square's events only once it is stepped on again. A step inside, the court is
    named, and the hold's name is over the gate.
11. **The inn is 35 a head,** a step past the Watch's refectory (30), as each town's is past the
    last; the stores sell the provisions at list price, and the forge the step and nothing else.
12. **The names are the dwarves':** Thane Wolfram, Gerda at the forge, Konrad the warder and Ilse the
    carver; the reader is Wystan Crane, a Reader by his rank. The businesses are named for what they
    are: the Old Working, the Smiths' Forge, the Candle Arch for its arch of candles.
13. **The side quests' people are #471's,** which places them: the Regent's scholar, the oldest miner
    and the Crust-Bearer's hand-in (§6). The court leaves its free squares for them.
14. **A condition's `seen` names a reading in the checks too:** `tools/tests/quests.ts` knew only
    once-events and caches, though #538 keeps a reading by its id as a once-event is.

Decided by delegate for #461, each the owner's to overturn:

1. **The brief is §4.6, not the issue's draft:** the secret is the wagon yard, not a miners' bothy
   in the spoil, and its hint the tally board and the fresh mortar, with the blessing's reading
   beside them. The issue's salamanders at the heap's warm end and its crust at the mouth are kept.
   Ash stays O6's, as §4.11 and §7 have it.
2. **The shaft is the site's own square, 440,96 (N4's 16,2),** where the atlas's site and its way in
   stand; the dungeon's plate stays at 440,104. `MOUTH` lands on the workings' first level at 7,14,
   facing north, the start this asks #462 to give `deep_mines`, and the way back up lands on 15,2,
   facing west, the spur's end.
3. **The shaft is shut until the Tiefzeche is built,** as N3's gate is (#458's 3): the shaft's square
   is wall and `n4_cage` says the cage is chained at the top. #462 lists `MOUTH` in N4's exits, opens
   the square and drops the event. The mouth's line, `n4_mouth`, is said once on the spur before it,
   for the chapter (#470) to read.
4. **Four groups for nine:** four fire beetles at the spoil's head by the trail, three salamanders and
   a beetle at its warm end and a rock worm in each of two open cuts, the box's groups at 17. They give
   8.73 fights to a rest at 16 and 1,468 xp a member for the brief's 900, as #457's 3 has it.
5. **The Hand's overseers are seen, not fought:** a cart comes down the trail by night with its lamps
   hooded and turns in for the headworks. The roster holds no overseer, and one at level would want a
   drawing of its own (§7).
6. **The oldest miner is left to #471** with The Miners' Hymn, as #459's 13 leaves him, so that one
   man does not stand in two places built by two hands. A miner at the camp speaks of the verses, and
   the mouth's line says them.
7. **The find is a Sharkskin Coat +2** (`sharkskin+2`, 1,400 gold), left in a cage by the cargo,
   which came from the coast. It is off the ladder as §4.6 asks, a coat the medium wearers have a
   level before the forge's Dwarf Mail, as M3's goad is a staff before its Banded Staff.
8. **Its gold is 950, its share by the brief of the 13,900** (§8): 250 in the cairn and 700 in the
   overseers' strongbox in the yard. The lamp-niche over the shaft gives luck.
9. **The crossing says the heart's atlas name,** *The Kilns.*, and to a company under 16 that the land
   is harder; a name of the zone's own is #435's (§9's proposal above).
10. **The stream for the smelter touches the box's south-east corner,** so the corner's two edge
    squares are its water, as the edge check asks.
11. **The zone walk moves 1,004 squares, unheld** (§1): the heart takes parked land in M4 and M5 and
    boxes the plan lays in the heart, as M4's north went to the Fells (#457's 7). The seam's seeds
    under N3 and N4 go, the two boxes holding their own rows.
12. **Two under is owed to #18,** as M3's and N3's are.

Decided by delegate for #460, each the owner's to overturn:

1. **The brief is §4.5, not the issue's draft:** the secret is the doors behind the wall and the hoard
   before them, hinted by the worn floor and the chalk, not a ledge path to the Fells' top hinted by
   the trainer's words; Hartmut says nothing of it.
2. **N2's band is 16–17, not 17:** the curve holds a map's hardest group within two of its top but
   over its floor, so a band of 17 alone asks a group at 18, which no surface monster is (#472's 13).
   At 16–17 the worms at 17 are its top, as N3's worm is, and the box is the relatively safe place
   DESIGN §5 asks for a second. Its floor is then the area's, so two under is asked of it alone (12).
3. **Three groups for four:** three fire beetles on the spoil nearest the way up, a rock worm in the
   west adit and a pair in the one under the rim. They give 8.76 fights to a rest at 16, inside the
   aim, where two lone worms gave 12.6, past the limit, and 1,095 xp a member for the brief's 600:
   fights to a rest is the gate and a share a proposal (#457's 3).
4. **No road climbs to it, and N3 is untouched:** the company walks up the open fell, grass on both
   sides of the seam at x 0 to 12, so Hartmut stands far off every road (DESIGN §5) and N3's map needs
   no change. N2's south row is N3's north row square for square, the crag over Anvilhall's gate
   running on as mountain along the rest of the seam.
5. **Hartmut, a dwarf, keeps the cave's mouth and teaches Ironhide:** his own words first, then his
   lesson once to a Berserker of 19, as Aylmer's and Leofrun's are, for the second's 4,000. His name
   is the dwarves' tongue's (§10): hard courage.
6. **The cave is cut at the site's square, 432,44 (8,14), its mouth at 8,15,** a cleft in the crag
   as Sjonghol's is. The passage and the room behind the face are walled in rock, so that no climber
   comes down into them, and only the doors at the back are dressed stone, out of sight from every
   square outside. The wall is an inscription on 8,14, the second hint beside the worn floor (#538's
   4), so no company needs a reader for the doors.
7. **The scholar has his words and nothing more,** unnamed and at the wall from a new game: his
   primers in Helmstow paper are seen, and he says he copies for himself. The choice, the copybook,
   his journal and when he comes up from Anvilhall are #471's (34), as the mother's are (#458's 9).
8. **The doors are walls with words** (#434's 4): five squares of dressed stone in a row at the
   room's back, lettered over and with no handle. Nothing opens them and nothing is declared in
   `content/locks.ts`; the lettering is seen and not read, as N3's markers are, since the brief gives
   it no words and a reading behind the face would hint at nothing.
9. **The find is the ladder's Mattock +1** (`mattock+1`, #535), with 400 gold in the hoard. Its gold
   is 640, its share by the brief of the 13,900 (§8), 240 of it in the cairn on the crest.
10. **The map is cut by hand:** the scaffold refuses the void under the rim, so it is drawn as
    mountain, as M2's corner was (docs/areas/sunderwood.md §4.9), and goes to the Fells (§1).
11. **Erzkamm's site is built,** at the cave on N2 (8.5,14.5), as Sunderfall's is on K2, and N2
    claims nothing new (§7).
12. **Two under is owed to #18,** as M3's, N3's and N4's are: a company of 14 beats every group at
    the line's standard size; the gate's other figures are inside their aims.

Decided by delegate for #463, each the owner's to overturn:

1. **The brief is §4.8, not the issue's draft:** the secret is the shard store behind the slag heap's
   laid face, not a smith's hoard in a cold furnace, and the verse over the mouth hints at nothing
   here. The issue's slag off the Stone's road is kept, as a slag elder on the cutters' track (4).
2. **The smelter stands a square inside the north edge,** at 12,1 to 13,2, since the atlas's 436,126
   is the edge row itself: the site moves onto it, map-relative at 12.5,1.5, as Anvilhall's moved
   onto its gate (#458's 2). Its spur runs six squares west from the road at 20,3.
3. **Four groups for eight:** four fire beetles behind the smelter, three at the yard's foot, three
   salamanders and a beetle on the heap, and the elder. They give 8.64 fights to a rest at 17 and
   1,679 xp a member for the brief's 900, as #457's 3 has it.
4. **A slag elder for the brief's rock worm,** strayed from the Stone onto the cutters' track and
   gone once the tear is closed (`q_anvil_closed`, #540), as N3's slaglings go: the curve asks a box
   at 17 for a group at 18, and the elder is the roster's only 18 that is not a boss. A worm, or a
   pair, is 17 (§7); N2 took 16–17 instead (#460's 2), but N5's issue asks the gate at 17. The box
   places the elder first, so `UNPLACED` owes it to nobody.
5. **The smith and the factor have their words and nothing more:** A Crown to Order's choice, its
   flags and its journal are #471's (§6), as the mother's were (#458's 9). They are Eckhart, the
   master smith, his name the dwarves' tongue's (§10), and Kerensa, the Compact's factor, hers
   Saltmouth's.
6. **The furnace mouth is the shrine and the inscription on one square,** as N3's niche is (#458's
   8): it gives accuracy, and a reader reads the verse as the boiler's warning, as at Anvilhall
   (#459's 4).
7. **The shards are seen, not carried:** the store has them boxed and weighed for the Compact, and
   the smiths' chest a Forge Shield +1 (`forge_shield+1`, 1,250 gold), their own work, which #535's 4
   left the box to place. O5's cutter keeps the area's second Anvil Shard (#464).
8. **Its gold is 950, its share by the brief of the 13,900** (§8): 250 in the cairn and 700 in the
   store.
9. **The water is a stream,** the atlas's 78 squares, down from the north-east corner, where N4's
   meets it (#461's 10), to the west edge at 0,25 and 0,26, where the atlas runs it on into M5; the
   drove road fords it at 18,12.
10. **The cutters' track is dirt** from the drove road at 440,150 (16,24) to the east edge at 455,150
    (31,24): the atlas draws no road beyond, and the edge check asks road only where it does.
11. **The zone walk moves 1,852 squares, unheld** (§1). M6, N6 and O6 take their own when they are
    laid; Cairnmoor's 380 in M7, N7 and O7 go back when its boxes are laid or its own rows are
    seeded, which is Cairnmoor's to do (#437).
12. **Two under is the area's pool's:** N5's floor is over the area's, so the gate counts its groups
    at 15 in the area's pool, where every fight is won, owed to #18 as the others are.
13. **Owed on:** the drove road at N6's 12,0 (436,158, #467); the cutters' track at O5's 0,24
    (456,150, #464), to be run on to the Stone; the stream at M5's 31,25 and 31,26, with no road
    across that edge (#474, parked); the elder's flag, the Rift's (#465).

Decided by delegate for #462, each the owner's to overturn:

1. **The brief is §4.7, not the issue's draft:** the issue's corridor at 17–18 and its Foreman half
   won at 16 gave way to §4.7's levels and to a Foreman half won at its map's floor (§8).
2. **The levels are banded 16–17, 16–17 and 17–18,** not §4.7's 16–17, 17 and 18: the curve's rise
   asks a group at a map's top above its floor, so a band of one level would want a group a level over
   it, and the old workings hold none at 18 nor the bottom one at 19. The Foreman is judged at 17.
3. **The Foreman is set off the line by the gate,** as #199 set the Warden of the Sunder: 1,500 hit
   points and 15d8+14, where the line's 1,001 and 18d8+20 won 71% at 17 and 93% at 19 and a harder
   blow alone took 19 under 90%. It is won 50% and 95%, and named in `OFF_LINE`.
4. **Two groups a level above the bottom, not eight:** four fire beetles and a rock worm in its hole
   on the workings, two beetles and a pair of worms in their bore on the old workings, 7.52 and 8.67
   fights to a rest at 16; a worm at each level's far end is its group at 17.
5. **The bottom holds the brief's groups and no more,** six knockers and a mender twice and the
   Foreman. Its day, 9.64 fights to a rest, and its groups pooled with a Foreman won half, 83.3%, are
   off the aim and inside the limit, as the Sunder's floor's were; the menders draw fights out, and a
   third group would be one the brief does not hold.
6. **The pay is 4,278 xp a member for the brief's 2,400:** the Foreman (1,902) and the corridor (858)
   pass the brief before the beasts above them, fights to a rest being the gate and a share a proposal
   (#457's 3). Its gold is 2,550, its share by the brief of the 13,900 (§8).
7. **The bottom is drawn smooth throughout** (`wallStyle: 'smooth'`, `bare`), the corridor being the
   hull's, and the dwarves' last squares show earth underfoot where the corridor has its floor. A wall
   style a square at a time is the systems lane's to give, and would show the pick marks stopping.
8. **The door marked CREW ONLY is a wall with a door drawn in it,** a seam in the smooth wall as the
   Sunder's is (`solid: 'wall', door: 'door'`): the brief's line on the square before it, *A wall
   blocks the way.* into it, no exit, no flag and nothing in `content/locks.ts`. #56's 60 opens it
   from the other side.
9. **The service ladders are two hatches,** secret doors at a walled niche whose prayer reads LADDER,
   each with a hint seen beside it, the candles leaning into the wall and the dust blown back in a fan,
   so no company needs a reader (#538's 4 and 5). A search finds each as any secret door, and the
   field that would gate it on the reading, #538's 5 left to this issue, is not asked for. One shaft
   of rungs runs from the workings to the bottom's ceiling; behind the first hatch lie the coins the
   miners push through for the dead.
10. **The hymn's doors are the workings' three air doors,** an old miner at each to work it who sings
    its verse as the company passes, *One door shut, and all hands counted.*, then two and three:
    once-events for #471 to read. No door below has a verse; the last is CREW ONLY's, the oldest
    miner's to sing (§6).
11. **The crust lies on two ledges:** by the workings' stair, §4.7's landmark, crumbs going on down
    the steps; and by the hole at the bottom, crusts in a row and none eaten, where #471 puts the
    crust-bearer's son (§6). Neither says who carries them.
12. **The Hand's overseers are seen, not fought,** as on N4 (#461's 5): their lamps go away down the
    bore by night, and the cages, their fresh straw and the cargo's footprints say the rest.
13. **The machines carry parts, three keepsakes** with no price and no hand-in: a Knocker's Plate,
    which about one knocker in seven drops; the Mender's Spool, which every mender drops; and the
    Foreman's Slate, its list with no box ticked, read from the pack. The knockers' room holds a plate.
14. **The finds:** the ladder's Forge Hammer +1 in the knockers' room; in the cages an Ironwood Bow +2
    and a Warden's Dirk +2, Sunderwood's, at the forge's blow a level before it, for the ranger and
    the light blades the Fells' finds miss.
15. **The ids are `deep_mines`, `deep_mines2` and `deep_mines3`,** as the brief and the Sunder's second
    level have them, named The Tiefzeche, The Old Workings and The Clean Corridor, their plates under
    the shaft at 440,104, 110 and 116. The shaft's site is built, and the area claims the knockers and
    the mine (§7).
16. **N4's shaft opens** (#461's 2 and 3): `MOUTH` is listed with the cage's line said going down, its
    square the cage's gate, a door, and `n4_cage` goes; the cage at the shaft's foot brings a company
    back up to 15,2, facing west.
17. **Two under is owed to #18** on the upper two levels, as on every box; the bottom's floor is over
    the area's, so its groups count two under in the area's pool.

Decided for #467, each the owner's to overturn, the first and the last by the orchestrator and the
rest by delegate:

1. **The roster call, binding for N6, M6, L6 and O6:** the curve asks a box's hardest group at its
   floor and one more at least, and the roster's only surface 18 is the slag elder, a Rift's thing.
   Where the roster cannot meet the check at the doc's band, a box takes its floor a level down, as
   N2 did (#460's 2), and a worm at 17 is its top; or the elder stands only where the Stone's strays
   plausibly roam, by O5 and O6. N6, M6 and L6 take 16–18, and O6 17–18 with the elder's strays as
   its 18. No monster of Cairnmoor's roster comes into the Kilns: its families, regeneration, curse
   and calls, the hounds, the ravens and the bog bodies are its novelty and stay its.
2. **The top stays 18:** the call said 16–17, but the curve holds the area's band to its built zone
   maps' bands, and with Kilnmouth built at 16–17 the Kilns would read 16–17 until O5 is built. At
   16–18 the top the curve asks is still 17, the floor and one more, so a worm meets it. Kilnmouth's
   band on the atlas goes to 16–18 with it.
3. **The brief is §4.12, not the issue's draft:** M6's secret is the drover's cache in the stopped
   kiln, not a dwarf's hoard in a farm's cellar hinted by a verse. The issue's drovers' camp at the
   fork, its first heather at N6's south edge and its dwarf caravan, whose guards do not fight, are
   kept; the caravan comes up the road by day, seen and not fought, as N4's overseers are (#461's 5).
4. **Two groups on N6 and three on M6, for five each:** on N6 four beetles on the verge and a lone
   worm at the far end give 7.52 fights to a rest, where the brief's worm pair gave 5.63, under the
   aim, and 5.84 with another beetle group. On M6 three beetles at either end of the kilns and the
   worm under the fields give 8.97. They pay 787 and 1,068 xp a member for the brief's 700 together,
   as #457's 3 has it.
5. **The milestone reads ANVILHALL 13, KILNHAVEN 4,** the brief's 8 and 3 counted again at 13
   squares to the unit (#457's 4): 167 squares along the roads to the front of Anvilhall's gate, a
   corner walked where the road turns on a diagonal, as it does on N4 and N5, and 53 to Kilnhaven's
   gate at 391,162, two squares past the branch's last road square. The walkthrough holds both.
6. **The branch crosses into M6 at row 18,** N6's 0,18 to M6's 31,18, where the atlas's road stepped
   on a diagonal between 423,174 and 424,175. The two edges meet square for square, and both roads are
   laid square to square.
7. **The branch ends at M6's west edge in dirt,** 392,162 (0,4), beside Kilnhaven's gate at 391,162
   on L6's east edge: the atlas's trail stopped in the river at 398,164, and the edge check asks for
   no road where the atlas has none beyond. #468 takes it on into the gate, and may make the square
   road once L6 is laid.
8. **The stream** comes in from M5 at 23 to 26,0, as the atlas's river asks, passes under the bridge
   at row 3 and goes out at the west edge's rows 5 and 6; from the bridge west the branch keeps to its
   north bank, where the atlas took it into the water.
9. **The halt is a shelter with its door stopped,** two squares inside, the worn verge before it the
   hint, and the coach bill is seen, not carried. M6's kilns are a row of fronts with every draw-hole
   open but the stopped one, which is a secret door; the cache lies two squares deep behind it.
10. **The find is the ladder's Seax +1** (#535), in M6's cache. The gold is 740, the two boxes' share
    by the brief of the 13,900 (§8): 110 in N6's cairn, 230 in the halt, 150 in M6's cairn and 250 in
    the cache. The drovers' stone gives speed and the farmers' shrine personality.
11. **Kilnmouth's road is the kilns' east end,** where the beetles overlook the branch: the gate names
    each zone's road (`ROADS`), and Kilnmouth's way in is M6's start at 31,18, on the branch.
12. **The zone walk moves 2,262 squares, unheld** (§1): M6's own settle to Kilnmouth, and Cairnmoor's
    row 7 holds 2,002 of the Kilns' squares until its boxes are laid or its rows seeded, which is
    Cairnmoor's to do (#437, #476).
13. **Two under is owed to #18,** as the other boxes' is.
14. **Owed on:** the drove road at N7's 3,0 (427,190, #476), the coach's road over it without a stop
    (#539); the branch at L6's 31,4 (391,162, #468), Kilnhaven's gate; on M6's north the stream at
    M5's 23 to 26,31 (415 to 418,157), with no road (#474, parked); on N6's east the grass and the
    heather against O6, with no road (#466); on M6's south the grass and the hill against
    Cairnmoor's M7, with no road.
15. **The save budget scales with the content:** `tools/tests/save.ts` held the outdoors' saved state
    under a fixed 20,000 characters, and N6's and M6's five groups took it to 20,106, as every later
    box would. It now holds the state to its explored bits as stored, which the world's size fixes,
    60 characters for each group the outdoors holds as played and 1,000 to spare: 24,923 today. It
    still fails if the cells are kept a number apiece or a group's state grows past 60 characters,
    and its probes show both.

## 10. Names

The Kilns' naming pass, by the rules of `docs/NAMES.md`: the dwarves' tongue was left to choose
(NAMES §2), and the plan's names were descriptions (Iron Crag, the Deep Mines, the Forges, the Lava
Tubes). Filed as #435.

- **The tongue.** The dwarves are the mining people of the Fells, who read their scripture at the
  forge and sell what they dig. Their names are modelled on the German of the old mining country,
  the Erzgebirge, beside the Foreland's English, the elves' Cornish and the Tidefolk's Frisian:
  short parts, written without the umlaut the font lacks. *Erz* ore, *eisen* iron, *berg* mountain,
  *hutte* a smelter, *stollen* an adit, *schacht* a shaft, *zeche* a pit or a mine, *halde* a spoil
  heap, *kamm* a crest, *feuer* fire, *glut* ember, *hammer*, *stein* stone. NAMES §2's row for the
  dwarves has it, and NAMES §4 lists the pass.
- **The names:**

  | Was | Now | What it means | Also thought of |
  |---|---|---|---|
  | Iron Crag | Erzkamm | the ore crest: the crag where the first ore was found, with the oldest carving in its mouth | Eisenkamm, the iron crest, which is Iron Crag again |
  | the Deep Mines | the Tiefzeche | the deep pit: the mine that went down until the tunnel ended | Tiefschacht, the deep shaft, which is one shaft and not a mine |
  | the Forges | Gluthutte | the ember smelter: the furnace in the charcoal woods | Feuerhutte, the fire smelter, which took *feuer* from the adit |
  | the Lava Tubes | Feuerstollen | the fire adit: the way into the rock where the fire is | Glutstollen, the ember adit |

- **Kept,** as the Crown's or the crew's: the Kilns and Kilnmouth, the Crown's names for the dwarf
  country and its farmland, from the lime kilns; the Iron Fells, the Crown's for the hills; Anvilhall,
  the Anvil Stone and Kilnhaven, the plan's, which the story leans on, each a place and the one it
  lends its name to (NAMES §3); and CREW ONLY, the crew's words, read and never translated.
- **People** are named with their issues, in the same tongue: the thane, the mother, the oldest
  miner, the harbourmaster. The Regent's scholar and Tallis's man are Helmstow's and Saltmouth's.
  Named so far: Hartmut, *hart* and *mut*, hard courage, who keeps Erzkamm's mouth (#460); Eckhart,
  *eck* and *hart*, a hard edge, the master smith at Gluthutte (#463).
- **Ids stay** (NAMES §3): `deep_mines` is the Tiefzeche and `lava_tubes` is Feuerstollen; Erzkamm
  and Gluthutte are sites with no id. The old names stand in the issues until they are edited.

## 11. What was cut

- **The rim's row,** N1, O1 and P1: by subtraction from the area's totals about 95 squares of land,
  64 a company could walk, mountain under the world's edge. The maps of row 2 and row 3 end in it.
- **The east edge under the rim,** P3 to P6: 1,300 squares of land, 536 walkable (P4 326 and 46, P5
  560 and 280, P6 414 and 210; P3 counts none), hills and crag east of the Stone and the vents, with
  nothing on the atlas or in the docs.
- **O2,** 194 squares, 21 walkable: mountain over Erzkamm.
- **The slivers:** M2's 109 (23), the corner of Lanternwood's box that is the Fells'
  (docs/areas/sunderwood.md §4, #202 owes it four squares of road); L4's 91 (20) and L5's 214 (169),
  over the mountains between Lanternwood and Kilnmouth, with no way through (§1).
- **K6,** the heath west of the port: 483 squares, all walkable, heather, grass and sand on the
  shore, with nothing on the atlas or in the docs. It comes back first if the act plays short.

About 2,500 squares in all, 1,316 of them walkable, to come back as country only if the act plays
short. The country behind the road (O3, O4, M4 and M5, 3,886 squares) is not cut: it is parked
(#474, #434's call 10).
