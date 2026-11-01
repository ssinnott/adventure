# The Kilns: step VI of the road, the dwarves' country

The Kilns' doc is three files (EXPANSION §8.2, #1027), and this, its current state, is read first.
Its decisions, the old §9 whole, are `docs/areas/kilns/decisions.md`, appended to and never
rewritten. Its plan is `docs/areas/kilns/plan.md`: the old §4 (the boxes' briefs, §4.1 to §4.15),
§11 (what was cut) and §12 (the bounds, §12.1 to §12.8) whole, then under "Moved from the state"
the lines of the old header, §1, §3 and §5 to §8 that this file does not keep, each under the
heading it had, among them §1's squares as each box moved them, §3's atlas rows, crossings, systems,
drawings and rooms, §6's table of #56's four, the guilds' asks and the Erzhemd's brief, §7's
proposals against the roster and §8's sums box by box. §2 and §10 stand here whole. The figures are
main's at `5231c94d` (24 October 2026), as the suites print them.

Its ids: the area `kilns`; its zones `ironfells`, `kilnsheart` and `kilnmouth`; the towns
`anvilhall` and `kilnhaven`; the dungeons `deep_mines` (with `deep_mines2` and `deep_mines3`),
`anvil_stone` and `lava_tubes` (with `lava_tubes2`); the bounds' enclave `seestollen` and the lair
`randzeche` (with `randzeche2`). They stayed through the naming pass (§10, NAMES §3).

## 1. Where it is

The sixth step on the road of levels (DESIGN §4, §9), the first of Act III: three zones of
the atlas (`src/content/areas/kilns/atlas.ts`). The Iron Fells, band 16–17, are M3, N3, N2 and O3,
over the east road from Lanternwood. The Kilns' heart (`kilnsheart`, "The Kilns" on the atlas),
band 16–18, is N4, O4, N5, O5, N6 and O6, the hill country of spoil, smelter and ash, with P4, P5
and P6 under the rim. Kilnmouth, band 16–18, is M4, M5, M6 and L6, the farms down to Kilnhaven,
with K6 and L7 on the shore. Nineteen boxes of the grid (EXPANSION §8.2; docs/areas/shelf.md §1),
in the K to P columns from row 2 to row 7; K6, P4, P5, P6 and L7 are the bounds' (#831). The towns
and the dungeons stand off the grid, each entered from a map.

- **North: the rim,** the mountains inside the world's edge, with the Fells' tops under it: snow on
  them in winter. Its row (N1 to P1) and O2 are cut (plan, §11).
- **West: Sunderwood.** The east road comes out of Lanternwood's M2 into M3, open from the
  start: the only way between the two areas. South of the Fells, Kilnmouth meets Lanternwood over
  the mountains with no way through.
- **South: Cairnmoor**, where the drove road runs on out of N6 into High Moor's N7, open
  from the start.
- **East: the rim** again and the world's end past the P column.
- **South-west: the sea,** off Kilnhaven. The ferry to Saltmouth, the Compact ship to Cinderport
  and the drove road's coach to Rime Lodge leave the port (`src/content/crossings.ts`), each sold
  on Kilnhaven's quay or in its yard and open from the start; the band's monsters are the gate.

Its edges open on nothing (`openOnNothing`, `src/content/areas/kilns/checks.ts`): L6's north at 29
to 31 and M5's west at 24 to 31, where L5 is the sea; O3's north at 2 to 7, onto O2, a crumb left
unbuilt. The area has no river. `node tools/worldmap.ts out.png --zones` paints the zones.

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

Thirty maps (`src/content/areas/kilns/maps/`), a row each: its id and name, kind, size and band;
what is there, with its groups (the gate's count); and its secret, a door at the squares given, with
the hint on its near side that finds it (the map's `secrets`). Twenty-six maps have one; the two
towns, the tubes' first level and the Dark Seam have none.

| Map | Kind, size, band | What is there | Secret, and its hint |
|---|---|---|---|
| `ironfells_m3`, M3 | outdoor, 32×32, 16 | the Iron Fells' way in: the east road out of Lanternwood over the pass onto the trail's head; the lookout, the woodcutters' camp, the cairn and the milestone; the crag with the old adit walled, the dwarves' cold hearth and the first spoil heap; three groups | 23,29, the Hand's wagon stage: the foot of the adit's wall swept clean of needles at 23,28 (`m3_needles`) |
| `ironfells_n3`, N3 | outdoor, 32×32, 16–17 | Anvilhall's box: the trail across its south-west corner and the spur up the fell and the terraces to the forecourt and the gate into Anvilhall, which stands over the crag from far off as a fortress (a landmark at 28,7, #1096); the outer workings, the burying ground, the carters' camp, the tithe-house and the mother at the terrace well (33); four groups | 29,20, the tithe-cellar and the first inscription read: cart ruts ending against the wall at 28,21 (`n3_ruts`) |
| `anvilhall`, Anvilhall | town, 16×16, 16–18 | the dwarves' hold behind N3's gate, a court cut down into the hill: the great hall, where the Lantern reader reads the verse and the thane sells the Stone back or loses it; the smiths' forge, the training hall in an old working, the inn, the mine-surgeon's and the stores; the oldest miner on the bench by the inn (36) | none |
| `kilnsheart_n4`, N4 | outdoor, 32×32, 16–17 | the Tiefzeche's box: the trail over the line into the heart and down to the drove road's head; the headworks, the cage's gate at the shaft, the winding house and its tally board; the miners' camp and the drovers' fold; four groups | 17,5, the wagon yard: the tally board on the winding house, strokes under DOWN and none under UP, at 16,1 (`n4_tally`) |
| `deep_mines`, the Tiefzeche | dungeon, 16×16, 16–17 | down N4's shaft by the cage: the workings, timbered, the hymn's three doors (36), the crust on its ledge and the hewer at the face; two groups | 13,10, the service ladder down and the coins pushed through for the dead: candles leaning to a walled niche at 11,10 (`dm1_candles`) |
| `deep_mines2`, the Old Workings | dungeon, 16×16, 16–17 | the Hand's cages on their rails and what the cargo left in them; the bores; two groups | 5,10, the second service ladder: the dust blown back in a fan under the niche at 6,9 (`dm2_draught`) |
| `deep_mines3`, the Clean Corridor | dungeon, 16×16, 17–18 | the bottom: the pick marks stop at a smooth face, and the clean corridor runs beyond to the door marked CREW ONLY, which stays shut; the son at the crusts (33); three groups, the Foreman's among them, and three of the Kilns' knockers come up through the door once it is opened from the Ways (`ud_mines`, the Hearth's road behind) | 5,10, the knockers' swept room: small tracks to the wall and the dust swept in arcs at 5,11 (`dm3_tracks`) |
| `ironfells_n2`, N2, Erzkamm | outdoor, 32×32, 16–17 | the open fell up out of N3 to the crag under the rim, no road on it; Hartmut at the cave's mouth (the Barbarian's second prestige) and the wall the scholar copies (34); the first ore-finders' spoil and adits; three groups | 9,13, the doors the wall means and the first ore-finders' hoard: the floor worn in a line to a blank face at 9,14 (`n2_floor`) |
| `kilnsheart_n5`, N5, Gluthutte | outdoor, 32×32, 17 | the drove road south through the charcoal woods and the cutters' track east for the Stone; the smelter, its three chimneys a landmark over the woods from far off (stacks at 12,1, #1096), the master smith at the anvil with a crown on its horn (35) and the Compact's factor; the slag heap and the burners' camp; four groups | 5,4, the shard store: the heap's one face laid in blocks, warm to the hand, at 5,5 (`n5_laid`) |
| `kilnsheart_n6`, N6 | outdoor, 32×32, 16–18 | the drove road's last reach over the open grass to the fork, where the branch goes west for Kilnhaven, then on south to the moor's first heather; the drovers' stone, a dwarf caravan by day and the drovers' camp; two groups | 5,24, the coach's old halt: the verge worn wide and flat at 4,24 (`n6_verge`) |
| `kilnmouth_m6`, M6 | outdoor, 32×32, 16–18 | the way to Kilnhaven: the branch in past a lime cart, through the farms and over the white bridge to the gate; the lime kilns in the hill, the quarry and its lookout; three groups | 21,20, the drover's cache: the one kiln stopped with a dressed stone at 21,19 (`m6_kilns`) |
| `kilnsheart_o5`, O5, the Anvil Stone | outdoor, 32×32, 17–18 | the cutters' track up into bare hills past the tear, the way into the Rift, to the Stone on its anvil of rock, cut square on three sides; the cutters' sheds and the foreman; a path off the track across the hill to the crag's lookout, and an outcrop under the rim (#1106); four groups, the Anvil Guard's on the approach once the Stone is taken | 11,9, the piece one cutter would not sell: the one saw-cut that stops half way down at 12,9 (`o5_cut`) |
| `anvil_stone`, the Slag Rift | dungeon, 16×16, 17–18 | down through O5's tear into slag and iron, its lanes up to the heart under the Stone's cut face, where the Warden of the Anvil stands up out of a cut; when it falls the tear closes; five groups | 14,2, the hollow with the first cutter's tools: ripples running uphill at 14,6 (`as_ripples`) |
| `kilnmouth_l6`, L6 | outdoor, 32×32, 16–18 | Kilnhaven's box: the branch to the gate in the town's wall, the coach yard, the ore quay, its heaps and its pier out to where the Compact ship rides, the bonded store and its clerk; four groups, the Hand's crew on the pier by night among them | 21,11, the bonded store: the sealed row stacked against its wall at 21,10 (`l6_store`) |
| `kilnhaven`, Kilnhaven | town, 16×16, 16–18 | the ore port behind L6's gate: the inn yard where the coach stands, the quay where the ferry and the Compact ship's boat put in; the harbourmaster and his manifests, the smith at a quarter more, the ore shed that trains, the inn, the Lanterns' chapel and the chandler's; a dwarf on the quay and Tallis's man (35) | none |
| `kilnsheart_o6`, O6, Feuerstollen's box | outdoor, 32×32, 17–18 | the grass and hills in to the ash and, across it, the vent ridge, blowing hot at four vents; Einhart the hermit in a dead vent; the adit into the tubes, whose words read VENT. STAND CLEAR. and mark the machine's mouths on the world map; four groups | 25,25, the first dwarves' shelter: a vent whose air goes in, cool, at 24,25 (`o6_cold`) |
| `lava_tubes`, Feuerstollen | dungeon, 16×16, 16–17 | the fire adit, the dwarves' cut broken into a tube of black glassy rock with the fire through its floor; a cutters' strongbox in a cooled side tube; four groups | none |
| `lava_tubes2`, the Deep Tubes | dungeon, 16×16, 17–18 | the deep tubes, hotter; in the deepest chamber, its floor all fire, the Great Salamander; three groups | 2,11, a tube cut and not run, ending at a plate nothing opens: the walls going square at 2,10 (`lt2_square`) |
| `kilnmouth_m4`, M4 | outdoor, 32×32, 16–18 | Kilnmouth's north: the pines down off the Fells to the summer grass, the drovers' track from their shieling, the colliers' cold clamps and a standing stone; one group | 22,13, the drovers' store: a cold hearth whose soot runs up into a crack at 22,12 (`m4_hearth`) |
| `kilnmouth_m5`, M5 | outdoor, 32×32, 16–18 | Kilnmouth's farms: the farmyard, a barn and a farmhouse, the lime pits under a rock face and the stream out to M6; one group | 12,6, the loft: swallows at a hole high in the barn's end wall at 16,6 (`m5_swallows`) |
| `ironfells_o3`, O3 | outdoor, 32×32, 16–18 | the Fells' east: bare hills, the hall's crag down the west edge, the high pines and the world's end at the north-east corner; the pitch-burner's camp and the worms' warren; one group | 19,13, the hunter's cache: a path trodden through the needles to the rock at 17,13 (`o3_path`) |
| `kilnsheart_o4`, O4 | outdoor, 32×32, 16–18 | the heart's hills: the crag with the quarries at its foot and the crane on its lip, the quarrymen's camp and a warm stream; the sledges' track from the spoil past the camp to the block that got no further, N4's turf over the west edge and an outcrop under the pines and one over the stream (#1106); no road; two groups | 3,7, the quarrymen's pay-hole: the one block never taken, its joints mortared, at 4,7 (`o4_face`) |
| `kilnmouth_k6`, K6 | outdoor, 32×32, 16–18 | the heath west of the port, the bounds' first: a turf windbreak, a sheepfold, a kelp-burner and an ore barge's ribs on the shingle; the dwarves' first quay on the headland with its slipway, rails and winch-house wall; the grate down into the Seestollen; one group | 17,14, a strongroom: the old rails' heads rubbed bright at the winch-house wall at 18,14 (`k6_rails`) |
| `kilnsheart_p5`, P5 | outdoor, 24×32, 16–18 | the hills under the rim at the Stone, pocked with the cutters' trial pits: the old cutter who stayed, a waymark with a riddle, the deepest pit and, in the rim's foot, the adit into the Randzeche; two groups | 11,16, the trial that struck nothing: a fan of spoil with no pit above it at 10,16 (`p5_fan`) |
| `kilnsheart_p6`, P6 | outdoor, 24×32, 16–18 | the ash under the vents, a wedge under the rim: a milestone with a riddle, a warm vent and the vent-keepers' shelter; two groups | 13,2, the vent-keepers' store: the one ledge where the ash stirs at 12,2 (`p6_ledges`) |
| `kilnmouth_l7`, L7 | outdoor, 32×32, 16–18 | the shore under the port: an ore spill off the quay road, a sea-coaler at a driftwood fire, a lighter aground and the dunes; two groups | 26,4, the chamber under the boundary mound: a kerbstone leaning out of its ring at 25,4 (`l7_kerb`) |
| `kilnsheart_p4`, P4 | outdoor, 24×32, 16–18 | the strip's north end: two pockets of hills under the rim, the south one walked to from P5 alone; no group | 3,12, the dwarves' spring-head: rushes green along the rock's foot at 2,12 (`p4_rushes`) |
| `seestollen`, the Seestollen | dungeon, 16×16, 19–20 | the bounds' enclave: the first quay's galleries under K6's point, down the rails from the grate; the loading gallery, the tally-room and the drowned quay with the quay-master's strongbox and Durchschlag; three groups of machines | 12,4, the dwarves' store: the one dry stretch of the gallery's wall at 11,4 (`ss_dry`) |
| `randzeche`, the Randzeche | dungeon, 16×16, 30–32 | the Erzhemd's lair, an old working under the rim in by P5's adit: the miners' door, the lamp room, the stopes and the winze down; no group | 9,4, the walled stope with the miners' pay-chest: something knocking behind the drift's west wall at 10,4 (`rz_knock`) |
| `randzeche2`, the Dark Seam | dungeon, 16×16, 30–32 | the lair's second level: the drift to the face, where the Steiger stands and the smith who went down for more sits by his kist, the Erzhemd in it; one group, the guardian | none |

Its content is `src/content/areas/kilns/`: the maps, then a file each for its monsters, items,
chapter, side quests and guild quests, its rooms, its part of the world (the atlas), its rows of
the suites (the checks) and what other areas take of it (public). Its walkthrough plays the chapter
both ways at the thane and by ferry first. Its businesses' rooms are `src/ui/interiors/kilns/`, six
in each town.

## 5. The one quest here

**The Anvil Stone** (`anvil`, `src/content/areas/kilns/chapter.ts`), the first of Act III, joined
after Sunderwood's The Wall and before Cairnmoor's: begun on M3 or at Kilnhaven; the verse read
the old way in the great hall (`anvil_verse_read`); the Stone bought for 6,000 gold
(`ANVIL_STONE_PRICE`) or taken (`anvil_bought`, `anvil_taken`), and either way the thane never
forgives; the door at the bottom of the Tiefzeche, which reads CREW ONLY and stays shut, its
footprints and her knot (`deep_mines3:dm3_door`); the Warden of the Anvil fallen and the tear closed
(`q_anvil_closed`), the Stone counting for the Hearth; the manifests (`manifests_read`) and the
corridors south (`kh_dwarf_met`) at Kilnhaven. It is done on the moor's first map, `highmoor_n7`,
with the Stone bought or taken, its tear closed and Kilnhaven's two heard. Nothing in it is a lock.

## 6. Side quests

#56's four, in `src/content/areas/kilns/quests.ts`, a line each (the plan's §6 has #56's table):

- **The Crust-Bearer** (`crust`, 33): the mother at N3's well, her ring carried down to her son at
  the bottom; he comes up to Anvilhall's inn (`q_crust_up`) and pays 300 gold.
- **The Primer** (`primer`, 34): the scholar at Erzkamm's wall, kept by the thane (`q_primer_kept`,
  500 gold) or parted from his copybook, which reads the old script (`q_primer_book`).
- **A Crown to Order** (`crown`, 35): the crown off Gluthutte's anvil carried down to Wiebe at
  Kilnhaven for 800 gold (`q_crown_sailed`), Tallis then owing the company, or told to the thane
  (`q_crown_told`).
- **The Miners' Hymn** (`hymn`, 36): a verse at each of the Tiefzeche's three doors and the last
  sung by the oldest miner at Anvilhall (`q_hymn_sung`), which the Bard's third reads.

The guilds' (`src/content/areas/kilns/guilds.ts`), from Act II's end: the Wardens' The Night Carts
(`wardens_cages`, the Hand's cages on the old workings) and the Lanterns' The Words Over the Dead
(`lanterns_niche`, a niche's words read), each 300 gold and 2,400 xp. No new guild comes with the
act.

**The Erzhemd** (#846), the bounds' artifact: on the Dark Seam, by the smith's kist, behind the
Steiger (boss, 32: 2,400 hit points, attack 24), found and never told. The rumour is the oldest
miner's at Anvilhall, once he has sung the hymn's last verse. Armour 15, borne by the Grey Mail's
seven; its wearer's speed is raised by 5.

## 7. Encounters, and what is new

MONSTERS §7.1's roster, in its monsters file: the knockers, the Knocker, the Mender and the
Foreman, the first machines on the road, met only at the bottom of the deepest mine; the
salamanders, the Salamander and the Great Salamander; the Fire Beetle; the Rock Worm; the Slagling,
the Slag Elder and the Warden of the Anvil, the Rift in slag; and the Anvil Guard, a dwarf, `after`
the taking. The Seestollen's menders, knockers and Rimewater's tallymen are placed by its band,
19–20; the Randzeche holds the Steiger at the cap, which calls Meridian Camp's deep knockers. New
here (`novel`): the knockers and the salamanders; pine, ash and lava underfoot; Kiln-script read
(`sign:read`) and the world map marked by it (`sign:marks`); a group that comes after a choice
(`encounter:sets`); a town cut into a hill, a smelter and a mine's headworks.

## 8. The numbers

- **The curve** (`tools/tests/curve.ts`): a clear gives 32,265 xp a member of the 13,067 it asks
  and 17,497 gold of 7,920; a company entering at the floor and clearing three quarters leaves at
  19.4, +1.4 over the next floor 18, a named exception held at 19.5 (`overRoad`, in its checks).
  The enclave and the lair, counted in no clear, give 4,617 xp a member and 1,200 gold.
- **The gate** (`tools/tests/gate.ts`): at its maps' floors the area wins 97.9% of its 66 groups'
  fights (`GATE.through`'s aim); two under, its groups pooled at 14 manage 4.63 fights to a rest,
  57.9% of the floor's 8 (at most: `GATE.backDay`'s aim). Each zone's road is walked every time
  at 16. The bosses at their floors and two above: the Foreman 56% and 92%, the Warden of the Anvil
  51% and 95%, the Great Salamander 55% and 95%; the Steiger 69.5% at 30 and 85.5% at 32; the four
  proof against a hold since the class changes (#1117). The bottom's groups with the Foreman are won
  85.3% and the deep tubes' with the Great Salamander 85%, off the aim and inside the limit; the
  Rift's 90.2%.
- **Fights to a rest** (aim 7 to 9 at 16, 7.25 to 9.25 at 17): M3 9.68, N3 8.67, N4 8.93, the
  Tiefzeche's three levels 7.21, 9.32 and 10.16, N2 9.07, N5 9.06, N6 7.21, M6 9.68, O5 7.92, the
  Rift 7.73, L6 8.23, O6 8.91, the tubes' two levels 7.51 and 7.31, M4, M5, O3 and K6 6.25 each, O4
  8.14, P5 8.18, P6 8.93 and L7 7.21; the Seestollen 8.43 at 19, 82% of its days ending in a fight
  broken off. Thirteen figures are off their aim, inside the limits, since the class changes
  (#1117): M3's, M6's, N2's and the Tiefzeche's second level's fights, the bottom's two, the deep
  tubes' 85%, the Steiger's 85.5% at 32, the four 6.25s (a worm pair is a heavy fight) and N2's two
  under, 69%.
- **Density** (`tools/tests/density.ts`): within 8 squares in the core, N3 97.6%, N4 97.7%, N5
  97.4%, O5 97.4% and L6 100%; within 12 in the country, M3 98.5%, N6 99.9%, M6 99.4%, O6 98.6%,
  O4 99.1% (its furthest square 17) and N2, M4, M5, O3, K6, P5, P6, L7 and P4 100%; the towns and
  the dungeons 100% within 7.
- **The ladder:** rung 17 is the Kilns' (`gear`, in its checks): Anvilhall's forge's eight wares;
  by 19 the same with a plus from the Kilns' and Cairnmoor's boxes (Cairnmoor's checks). The
  dearest find, the Plate Mail +3 at 1,650 gold, sits in the window, 3,500. Its ranged rung
  (`ranged`, #1115): the Steel Short Bow and the Wire Sling, a step and two behind the Steel Bow,
  sold beside it at the forge and, a quarter more, at the Anchor Smithy (1,407 and 938 gold), and
  found with a plus beside the Steel Bow +1 in the shelter on O6. They are on the gate's ladder
  since #1117.

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
  Named: Hartmut, *hart* and *mut*, hard courage, who keeps Erzkamm's mouth (#460); Eckhart,
  *eck* and *hart*, a hard edge, the master smith at Gluthutte (#463); Reinhart, *rein* and *hart*,
  clean and hard, the cutters' foreman at the Stone (#464); Einhart, *ein* and *hart*, alone and
  hard, the hermit in O6's dead vent (#466); Irmgard, *irmin* and *gard*, a great enclosure, the
  harbourmaster who keeps Kilnhaven's harbour, and Dietmar, *diet* and *mar*, known to the folk, the
  port's smith (#469); Wiebe, Tallis's man, takes a Tidefolk name, as Saltmouth's people do (#469).
  Anvilhall's people are named in #459's 12 and the port's boatmen and coachman in #469's 16 (§9).
- **The bounds' enclave** (#831): the Seestollen, *see* and *stollen*, the sea adit, the first
  quay's galleries under K6's point; and the reward in its strongbox, Durchschlag, *the
  breakthrough*, the miners' word for the blow that meets another gallery.
- **The bounds' lair** (#831): the Randzeche, *rand* and *zeche*, the mine in the rim, the old
  working under P5's rim; its lower level, the Dark Seam; and Brandt, the smith of the oldest
  miner's rumour (#846).
- **Ids stay** (NAMES §3): `deep_mines` is the Tiefzeche and `lava_tubes` is Feuerstollen; Erzkamm
  and Gluthutte are sites with no id. The old names stand in the issues until they are edited.

## Open and owed

- **Owed to no check:** its checks have no `owes`; the curve, the gate, density and the ladder hold
  the Kilns with nothing owed, the lead over the road held by name at 19.5.
- **Watched, not moved:** the bottom of the Tiefzeche (9.64 fights to a rest, 83.3% won) and the
  deep tubes' 84.3% sit between their aims and their limits (plan, §8). What the owner finds by
  hand goes here; none yet.
- **Cut:** the rim's row, P3, O2 and the slivers in M2, L4 and L5 (plan, §11).
- **What is next:** nothing. The plan's briefs are all built, and a new box starts its brief there.
