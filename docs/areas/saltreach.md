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

Eighteen boxes of it are built, the Delta road and the shore under the Edge (#170), the spur to
Rietum (#171), Rietum (#172), Stienwierde (#173), the Drowned Temples' approach (#174), Saltmouth's
box (#176), the salt pans (#178), the willows (#179) and, of the bounds, the upper valley and its
head, the rim's foot behind the willows, the hills over the heronry, the fen's west shore, the fen
under the rim, the Scarp's foot west of the pans and the plate's old place (#830; §12, whose
enclave and lair come after), the town behind C6's gate, Saltmouth (#177), with the Salt Compact's
hall in it (#182), and the Drowned Temples below B6, two levels (#175); with the first two the area
was listed. Its content is `src/content/areas/saltreach/` (maps,
monsters, items, climate, its part of the world map, its side quests in `quests.ts` and its guild
quests in `guilds.ts`; its chapter of the one quest, The Tide Stone, in `chapter.ts` is still to
come) and its businesses' rooms `src/ui/interiors/saltreach/`. Its ids: the area `saltreach`, its
zones `upperwater`, `delta` and `saltings`, the town `saltmouth` and the temples `drowned_temples`.

---

## 1. Where it is

The atlas (`src/content/areas/saltreach/atlas.ts`, merged into `ATLAS` with the plan) makes
Saltreach three zones:

| Zone | Band | Squares | Built |
|---|---|---|---|
| The Upper Water | 10–11 | 7,714 | C3, Rietum, laid at 72,62 (#172); B3, the willows, at 40,62 (#179); C2, the upper valley, at 72,30, and B2, its head, at 40,30 (#830); A3, the rim's foot, at 8,62 (#830) |
| The Delta | 10–12 | 3,697 | C5, the Delta road, laid at 72,126, and D5, the shore under the Edge, at 104,126 (#170); C4, the spur to Rietum, at 72,94 (#171); B5, Stienwierde, at 40,126 (#173); B6, the temples' approach, at 40,158 (#174); B4, the willows' end, at 40,94 (#179); A4, the hills over the heronry, at 8,94, A5, the fen's west shore, at 8,126, and A6, the fen under the rim, at 8,158 (#830) |
| The Saltings | 11–12 | 3,588 | C6, Saltmouth's box, laid at 72,158 (#176); C7, the salt pans, at 72,190 (#178); B7, the Scarp's foot, at 40,190, and D6, the plate's old place, at 104,158 (#830) |
| The area | 10–12 | 14,999 | eighteen boxes |

Squares are the ones the atlas gives each zone, shallows and rivers included. Without the shallows
the area is 14,143 squares, about 13.8 zone maps (EXPANSION §1 has 13.8), and 11,965 of them a
company could walk: the rest is the rim's mountain in the A column, Kestrel Edge's face and the
Scarp's. It runs from x 11 to x 125 and from the rim down to y 213, the Scarp's foot. The zones'
bands are the folder's: the atlas gives the area 10–12 and the boxes rise through it (§4).

**The grid** (EXPANSION §8.2; docs/areas/shelf.md §1). Saltreach is the B and C columns from row 3
to row 7, with slivers in A and D. The land worth a map is ten boxes: C3, C4 and C5 down the Long
Water's east bank; B3 and B4, the willows and the fen's north; B5 and B6, the plinth and the
temples; C6, Saltmouth's box; C7, the pans. The A column (A2 to A7) and B2, C2 and B7 are the rim,
the upper valley and the Scarp's foot, cut (§11) and brought back as the bounds (§12), all but A2
and A7; D3, D4, D5 and D6 hold slivers of its land
inside the Foreland's boxes and the gulf.

Its edges:

- **North: the rim,** about nine squares deep, and under it the upper valley of the Long Water (B2,
  C2), hills and mountain under the rim, void by the plan (§11) until the bounds built them (§12).
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
  squares down D4's foot and the milestone beside them (SALTMOUTH 4, RIETUM 9, #176); the sand under the
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
  green beside it by night. The gate holds at 10, at 7.0 fights to a rest on the box and 6.6 in the
  Rift (6.8 before the re-stat to #409's line, #18).
- **The spur to Rietum** (C4, `delta_c4`, country, band 10–11; #171): the track up the Long Water's
  east bank from C5's fork to Rietum's first fields; a barge tied at the bank, its master, five
  bargemen and two herons, the first crew that breaks when its master falls; the backwater with a
  heron every few yards along its reed bank; the ford with an eel-trapper at his traps, who knows
  the Stone's poleman for no river man by his stroke; Passage Paid's barge on a shoal (§6); a bull
  toad alone in a flooded drain in the fields; a camp, a shrine and a cairn on the grass under
  Kestrel Edge. The secret is the crews' hide, a reed hut where the herons leave a gap, with a Brine
  Shard and a Long Sword +1 inside; the hint is the gap itself, and the sand trodden hard to the
  hut's wall. The gate holds at 10, at 6.7 fights to a rest.
- **Rietum** (C3, `upperwater_c3`, core, band 10–11; #172): the spur's track up through the
  fields to the village of the Tidefolk on its mound, its houses and net lofts either side of the
  diep, a deep cut from a sluice-house on the west edge to the quay; the drowned god's shrine by the
  sluice, its bowl dry, and its priest, who knows what a pole's mark says; Wytske on the quay, who saw
  the Stone go by green through its sacking, the step; Nynke at her window with a shard in a jar for
  a night-light; the well, the reed-cutters' loft to rest in and a cairn; Auke the old bargeman at a
  silted staithe in the north fields, the Thief's second prestige; and Kestrel Edge down the east
  side, closed as mountain with the Downs' strip above it, with Sjonghol, a cleft in its foot, and
  Douwe at its mouth, the Monk's second. Four herons in the stubble by the track, a barge master and
  three bargemen on the quay by day, four brinelings at the child's window by night and a bull toad
  alone in a flooded drain at the east fields' end. The secret is the old smuggler's cache under the quay, a
  Chain Mail +1 and his sword, Auke's Count, with the ladder's Stiletto +1 and Tidefolk Robe +1; the hint
  is one stone in the quay's face scrubbed clean, the water glowing under it by night. The gate
  holds at 10, at 7.2 fights to a rest.
- **Stienwierde** (B5, `delta_b5`, core, band 11–12; #173): duckboards from the Delta road west over
  the fen and the channel to the Tide Stone's island, its plinth empty and its socket cut clean; a
  driftwood shrine at the boards' start, a cairn and house-footings on the mound, and a hermit on a
  hummock who counts the Rifts' lights. Two groups of five fen toads on the boards and two bull
  toads on the island's far side; two brine Rifts (`b5_rift_n`, #165's cells, and `b5_rift_s`, its
  breach), each two tide elders at the heart, quiet once they fall or the Stone is home. The plinth
  takes the Stone when it comes home and sets `q_tide_home` (#191), and the hermit then counts no
  lights. The secret is a hollow under the
  plinth's landing, a Brine Shard and a Kite Shield +1 in it; the hint is the barge-poles' marks on
  the landing, and one plank among them unscored and new-nailed. The gate holds at 11, at 7.1 fights
  to a rest on the box and 4.9 in each Rift (5.4 before the re-stat to #409's line, #18; §9).
- **The Drowned Temples' approach** (B6, `delta_b6`, core, band 11–12; #174): a causeway south
  from Stienwierde round the temple's roof to its dry door at 16,11, open on a stair, with tidal
  flats at its foot and the priestess beside it, counting; the last dry ground, a camp; a small roof
  with a cairn, an east roof silted shut over the channel and a crossing of sunk stones; the drowned
  standing in the water either side of the causeway south; and the far roof alone in the flats. Five
  fen toads on the causeway in, five brinelings in the channel by night until both of B5's Rifts
  are quiet, and two bull toads on the flats past the far roof. The secret is a door in the far
  roof's wall under the tideline, a porch behind it and a stair down; the hint is the priestess's
  count, one to ten with her hand to each roof and a pause towards the far roof before eleven. The
  dry door is the way into the temples' upper level and the porch's stair the way into the choir's
  back (#175). The gate holds at 11, at 7.0 fights to a rest.
- **The Drowned Temples** (`drowned_temples` and `drowned_temples2`, dungeon, two levels of 16×16,
  band 11–12; #175): the upper temple behind B6's dry door, half flooded, its nave's drowned and the
  bull toads in its north-east chapel; the choir below, the chanters counting and the Choirmaster
  on the chancel step with the Tide Bell; the sacristy at the back, reached only down the far
  roof's wet stair, with the god's silver. §4.7's "As built" has the rest.
- **Saltmouth's box** (C6, `saltings_c6`, core, band 11–12; #176): the Salt Road's last reach from
  C5 down the fen's east side, its milestone (SALTMOUTH 2, RIETUM 7) and the road's end at the town's
  land gate at 26,19, the way into Saltmouth (#177); the coach yard outside it;
  the barge quay on the Long Water's last reach with a crate of the crews' cargo on it, and the
  Compact's warehouse across the road with its clerk at the door; the sea wall down the town's east
  side and the shore path under it, dry at low water only; a camp under the wall; the fen west of
  the road over a ford, with a dry shrine, a cairn, a wierde with no house on it and an eel-catcher's
  hut; the pans' first walls along the south edge. The groups are three: four bargemen and their
  master on the quay by day, two Wrack smugglers and two bowmen under the sea wall by night, and four
  salt crabs at the pans' edge. The secret is the smugglers' stair in the sea wall's dry end, its
  cache at the foot by a sea door barred from within, the hint the rope hanging over it with
  nothing on it. The gate holds at 11, at 7.3 fights to a rest (7.0 before the re-stat, #18). Once
  the causeway at Sheer Point has been stood on, the sand at the east edge, 31,17, says a line on the
  sea under the Hearth's light, once (#449; docs/areas/ashfall.md §9, #449's 1 and 2).
- **Saltmouth** (`saltmouth`, town, band 10–12; #177): the free port behind C6's land gate, §4.9.
- **The salt pans** (C7, `saltings_c7`, country, band 11–12; #178): the salt runs on south from C6's
  pans into six walled pans, walked in lanes, each with a gap for its sluice but one; the last marsh
  west of them with its pools and the drowned god's shrine, its bowl full of salt; the salters' huts
  and a salter with a rumour of a star out of its place; a cairn on the grass under the Scarp; a
  skiff at the creek's end, the night crew's; and the Scarp itself across the south, mountain as
  Kestrel Edge is on D4, with the stair's foot in a notch, its lowest flight fallen. By night a star
  stands over the Scarp where none should, the watch The Star That Moved asks for (#56's 24). The
  groups are two: four salt crabs in the pans and two bull toads in the marsh. The secret is the one
  pan with no sluice, reached by the crabs' hole under its east wall, the salter's hoard in it; the
  hint is the salt trodden at that wall's foot and nowhere else. The gate holds at 11, at 6.0 fights
  to a rest.
- **The willows** (B3, `upperwater_b3`, and B4, `delta_b4`, country, band 10–11, behind the road;
  #179): B3 is the Upper Water behind Rietum, the Long Water out of the rim's hills and down through
  the willows, Rietum's diep carried on west from C3's sluice to the river under its pollards with a
  plank bridge over it, the willows' quay at its mouth with a barge lying up for the sluice, the
  boathouse behind, the ford below and the carr past it; Hiltje cutting withies north of the diep, a
  shrine at the bend whose bowl the river keeps full, and a cairn on the hill. B4 is laid in the
  Delta: the river in under the heronry and out into the broad water that runs on into C4's
  backwater, the drowned god's statue on the hill's crown with his name cut off the plinth, the
  dyke-wrights' flood-store in the hill's side, the strand, C4's ford carried across the water's foot
  and the fen's north end. The groups are five: the quay's crew, a master, three bargemen and two
  herons, and a bull toad in the carr on B3; the heronry's brood of three and its five keepers, and
  a bull toad at the fen's end on B4. The secrets are the boathouse's back room, the hint the green
  worn off its back wall at a hand's height, and the flood-store, the hint the martins nesting where
  the hill's facing is laid looser. The gate holds at 10, at 7.1 fights to a rest on each box.
- **The upper valley** (C2, `upperwater_c2`, and B2, `upperwater_b2`, country, band 10–11, the first
  of the bounds; #830): C2 is the hill pasture over Rietum between the rim and Kestrel Edge, up from
  Rietum's top field: the Hand's watch beside its fire on the crest, Jelle with Rietum's sheep, a tarn
  and the toads come up to it, the shepherds' cairn under the rim and a cleft in the Edge's foot walled
  with dry stone; and east of the face the Edge's top, the Downs' turf laid with the box, open to D2
  and walked to from the Downs alone, with a boundary stone, the lip and a shepherd of the Downs and
  no group. B2 is the valley's head under the rim, up out of B3's grass: a spring and its trough, a
  bull toad and an eel in the mire under it, a cairn and a beehive hut with no door. The groups are
  three: on C2 the watch, a master and three bargemen, and the toads, a bull toad and a fen toad; on
  B2 the toad and the eel. The secrets are the cleft, the hint the lichen rubbed off the walling in a
  line, and the hut's cell, the hint the wrens going in and out low on one side. The gate holds at 10,
  at 6.5 and 5.8 fights to a rest (§12.2, §12.3).
- **The rim's foot and the hills over the heronry** (A3, `upperwater_a3`, and A4, `delta_a4`,
  country, band 10–11, the second of the bounds; #830): A3 is a corner of hill and grass under the
  rim behind B3's willows, the river seen up the line of the trees: a bull toad and a heron, a cairn
  and a well-house walled into the rim's foot. A4 is the hills under the rim west of B4, open to it
  along every row: a woman of stone with a riddle on the crest, a dry valley with a shrine at its
  mouth, a cairn, the reed-cutters' camp at the fen's edge, three herons fishing the fen's corner
  and a bull toad and a leech in its pools; its south edge is the rim's mountain but for the marsh
  at its corner, where A5 meets it. The secrets are the well-house, the hint a willow hung with rags
  at its walling, and a still in a walled cave at the dry valley's head, the hint the reek of peat
  smoke and malt. The gate holds at 10, at 5.9 and 6.8 fights to a rest (§12.4, §12.5).
- **The fen's west shore and the fen under the rim** (A5, `delta_a5`, country, band 10–11, and A6,
  `delta_a6`, country, band 11–12, the third of the bounds; #830): A5 is the fen's west shore under
  the rim, west of Stienwierde, open to B5 along every row: an old dyke let go along the shore, a
  wildfowler in his punt with word of the toads, a shrine, a camp, a cairn, four leeches and an eel
  in the pools, a bull toad alone where the dyke gives out and the drowned mound left bare in the
  marsh for the lair's door. A6 is the fen under the rim, west of the temples' approach, open to B6
  along every row but the last: the temples' bell heard over the fen, a priest of stone with a
  riddle, a cairn, a camp at the rim's foot, two drowned men walked out into the fen and two bull
  toads. The secrets are a sluice-house walled up in the dyke, the hint clear water running out
  under its foot, and an anchorite's cell walled into the rim's foot, the hint a slit that looks
  east to the temples. The gate holds at 10 and 11, at 6.84 and 7.18 fights to a rest (§12.6,
  §12.7).
- **The Scarp's foot and the plate's old place** (B7, `saltings_b7`, and D6, `saltings_d6`, country,
  band 11–12, the fourth of the bounds; #830): B7 is the last marsh and the salters' grass under the
  Scarp, west of the pans, open to B6 along its north edge and to C7 along its east, the Scarp and
  the Glasswold's ground above it shut as mountain: a salt-carter at the end of the salters' track
  with word of a fire under the Scarp, a camp, a cairn, a shrine, three salt crabs on the grass and
  the Hand's smugglers at their fire under the rock. D6 is two pieces of land in the sea off
  Saltmouth, the end of D5's spit and the tidal shore under the town: on the spit the footing of the
  old harbour light with two bull toads come out of the Delta's reeds, and on the shore a cairn of
  ballast stones and a wreck's ribs. The secrets are a salters' bothy walled up in the Scarp's foot,
  the hint a fan of dead white grass pointing at its door, and the light-keeper's store walled up in
  the footing, the hint the hollow boom of each wave under it. The gate holds at 11, at 7.41 and
  5.76 fights to a rest (§12.8, §12.9).
- **Weather.** The delta's: mild and wet, the wettest in late autumn, fog off the gulf. Fronts reach
  it four hours after they cross the Foreland.

## 4. What is still to build

All but C5, D5, C4, C3, B5, B6, C6, C7, B3, B4, C2, B2, A3, A4, A5, A6, B7 and D6, of the area's
14,143 squares of land, 11,965 of them walkable (§1). On the grid (§1) the plan is ten boxes, a
dungeon and a town, and the boxes hold 8,946 of those squares:

| Box | Name | Zone | Kind | Band | Land | What is there | Its step of the quest | Issue |
|---|---|---|---|---|---|---|---|---|
| C5 | The Delta road | the Delta | country | 10–11 | 872 (marsh 783), 122 shallow | the Salt Road through the fen from D4 to C6; the fen's pools; a brine Rift; a camp | none | #170 |
| C4 | The spur to Rietum | the Delta | country | 10–11 | 986 (grass 758, marsh 135) | the Long Water's east bank; barges at dusk; the track up to Rietum | none | #171 |
| C3 | Rietum | the Upper Water | core | 10–11 | 998 (farm 751, grass 216) | Rietum at 80,80 under Kestrel Edge; Sjonghol in the cliff; the barge smuggler | the folk who saw the Stone go by | #172 |
| B5 | Stienwierde, the plinth | the Delta, the Upper Water | core | 11–12 | 948 (marsh) | the plinth at 48,140, empty; fen toads; two brine Rifts | the plinth stands empty | #173 |
| B6 | The Drowned Temples' approach | the Delta, the Saltings | core | 11–12 | 975 (marsh) | the temples' way in at 56,170; the priestess who says the number | the temples gone dark | #174 |
| | The Drowned Temples | | dungeon, two levels of 16×16 | 11–12 | | the choir, the Choirmaster and the bell | | #175 |
| C6 | Saltmouth's box | the Saltings, the Delta | core | 11–12 | 834 (marsh 714, salt 56, sand 51), 175 shallow | the port's land gate at 98,177; the barge quay; tidal ground along the shore | the free port | #176 |
| | Saltmouth | | town, 16×16 | 10–12 | | the two halls, Tallis, four trainers, the boat | the crossing | #177 |
| C7 | The salt pans | the Saltings | country | 12 | 718 (salt 244, grass 241, marsh 193) | the pans and the salt crabs; the Scarp's foot | none | #178 |
| B3, B4 | The willows | the Upper Water, the Delta | country, behind the road | 10–11 | 970 and 775 | willows along the Upper Water; herons; the fen's north | none | #179 |

The core is the four boxes that hold a step of the quest (C3, B5, B6 and C6), built at full
density; the rest is country, built to the looser floor with the wilderness features (EXPANSION
§2.1 (b) and §5.3, #45). The road's two country boxes and the pans are built with the act; the
willows were parked until the owner had played it (#151, call 10), and the owner took them off
parked on 3 October (#179). The bands rise from the way in,
10 at the foot of the Edge, to 12 at the pans and the temples' choir, as the gate asks (EXPANSION
§5.2), and each box holds a group at the top of its band for the curve.

**Two boxes hold land of two zones.** B5 and B6 each straddle two zones' fen. C4 was drafted as
the Delta's grass and the Upper Water's along the river, and is laid in the Delta (§9), so the
Upper Water begins at Rietum. A map is its whole box (EXPANSION §8.2), so each
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
| Rietum (Reedholm) | C3 | the folk who saw the Tide Stone go by one night (DESIGN §9); an old barge smuggler, the Thief's second prestige (#19); the barge child's night-light (#56's 21) | a village on C3, the site at 77.5,77.5 on the mound (#172) |
| Sjonghol (the Wind Cave) | C3, in the cliff | the Monk's second prestige (#19) | a cave at 101.5,72.5, the cleft's mouth on C3 (#71, #172) |
| The Tide Stone's plinth | B5 | stands empty; the Stone comes home to it (DESIGN §9, #191) | a planned stone at 48,140 |
| The Drowned Temples | B6, and below | gone dark; the god used to sing the tides and now only counts, until its Stone comes home (DESIGN §9, STORY); the choir and the Choirmaster (MONSTERS §6.1); the bell (#56's 23) | a planned dungeon at 56,160, its way in at 56,170 |
| Saltmouth | C6, and its own map | the free port, the Compact's home, the seat of Jory Tallis (DESIGN §9, §10.1); four first prestiges (#19); the Cartographers' and the Compact's halls (DESIGN §8); the boat to Wrackholm | a port, its gate at 98,177 and its plate at 99,180; the plate moved from 118,172 (D6) to C6 (#151, call 7, #177) |
| The salt pans | C7 | the Salt Crab's ground (MONSTERS §6.1); the star that moved, seen from them at night (#56's 24) | salt, 337 squares of the Saltings |
| The Long Water | C4, C5, B3, B4 | the Compact's barges, shards and people downriver (DESIGN §9); a barge on a shoal (#56's 22); the willows' quay (#179) | a river from the rim to Saltmouth, lettered |
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
- **Finds** are the ladder's next step (#399): the band's gear at Saltmouth's armourer from 11
  (§4.9), the same with a plus in the boxes by 13, and the first named pieces on the road out of
  it. Each is placed when its box is built; no find or ware is dearer than the band's window on the
  curve. Wrackholm's boxes give two of the pluses: Kelp Hole's Plate Mail +1 and the Tide Ship's
  Long Axe +1.

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
  when the elder falls, or once the Stone is home (#191). Its hoard holds no shard, and
  the brine tear's words show its shard grown into the glass, not lying to be taken, as the
  cellar's Rift shows its Wardstone shard set in the tear's lip (#398). The hint is the mast's stump
  at the arch, which is always there; the green glow is said by night beside it. As measured, the box pays about 680 xp a member and its Rift about 430, 1,115
  together, and 300 gold. What the owner finds by hand goes here when the box has been played.
  D5's first row, the crossing line at D4's foot, holds a once-event on each of its ten squares a
  company can stand on (#156): once Hale has had the ledger, the first step onto the Delta sees two
  riders in Warden grey go over the Edge towards the Scarth and sets `q_hale_taken`, and the rest
  are gone.

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
- **Pay.** About 600 xp a member; as built, about 690 (§8).
- **As built** (#171, 1 October): laid in the Delta, so the crossing line into the Upper Water
  falls at Rietum. Two barges. The fight's is tied at the bank and always there: the master, five
  bargemen and two herons in its back rank. They break when he falls, so it is over in about a
  round. "Dusk" is in its words only: the game has no dusk hour. The other is Passage Paid's, on a
  shoal by the ford (§6). The herons in the reeds are the bank's events, which carry the hint, not
  a group. There is no eel at the ford: the eel-trapper fishes it. A bull toad alone sits in a
  flooded drain in Rietum's fields, at the far end from the fork. It is the box's hardest group and
  a real fight, which the barge (its mean level 10.1) is not by level. With the eel, the box ran 8.4
  fights to a rest, off the aim; without it, 6.7. The shard in the hide is a second Brine Shard. As
  measured, the box pays about 690 xp a member, the crew that comes after Passage Paid about 200
  more (§8 counts it in the side quests'), and about 470 gold with the crew's.

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
- **Finds.** A Chain Mail +1 and a named short sword, the smuggler's, in the cache; a Stiletto +1
  and a Tidefolk Robe +1, the ladder's (#399).
- **Pay.** About 1,000 xp a member; as built, about 1,010 (§8).
- **As built** (#172, 1 October): the first map of the Upper Water, so the crossing line falls at
  the C4/C3 seam. The atlas puts no water in the box, so the quay stands on a diep, a deep cut from a
  sluice-house on the west edge, its way on to the Long Water owed to B3 (#179); with no river there
  is no ford and no eel, and the shrine stands by the sluice. B3 carries the diep on to the river
  (#179). The cliff is mountain, since no map
  character is cliff, and the Downs' strip above it is closed with it. Sjonghol is a cleft of four
  squares in the cliff's foot, Douwe at its mouth teaching the Monk's second prestige; Auke the old
  bargeman teaches the Thief's at his hut in the north fields, so both are more than ten squares off
  the road and off the step (DESIGN §5, whose "willows' quay" is the owner's to reword). The groups
  are four, a company at one hour meeting three: herons by the track, the nearest; the quay's crew
  by day, which breaks when its master falls; brinelings at Nynke's window by night, until her light
  leaves it or the Stone is home (The Night-Light, #183); and a bull toad alone in the
  drain at the east fields' end, the hardest, as on C4 and C5. Nynke gives the hint at her first meeting and no more; The
  Night-Light (§6) is put once the priest has asked, and Tobin, a bargeman from upriver, waits on the
  diep's north bank to buy her light (#183). Wytske's words set `c3_saw_stone` for the chapter (#180). The cache is the
  old bargeman's from his Compact days, closed by deep water and walls on every side but its secret
  door, and he lets the company keep his sword. As measured, the box pays about 1,010 xp a member at
  10, about 950 in the road's order, and 380 gold. What the owner finds by hand goes here when the
  box has been played.

### 4.5 B5, Stienwierde (#173): core, band 11

- **Purpose.** The Delta's first step: the Tide Stone's plinth on its island in the fen, empty,
  and the Rifts open round it because its Stone is gone.
- **Landmarks.** Marsh all through, with duckboards; the plinth's island, Stienwierde (§10), at
  48,140, its socket clean-cut and the same size as the Grove Stone's cut, scaled up; two brine
  Rifts; brine glass glittering in the fen.
- **Points of interest,** about eight features and eight groups:
  - the plinth, the step (§5), which reads two ways (#582) and takes the Stone when it comes home (#191);
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
  go quiet when they fall, or once the Stone is home (#191). No leeches: the pools are
  C5's fight. The hint is the landing's pole-marks, always there; the priest at Rietum's line about
  a pole's mark is #172's. The shard under the landing is a Brine Shard, as C5's is. No camp. As
  measured, the box and its Rifts pay about 1,650 xp a member and 410 gold, the company at about 10
  in the road's order until C4 and C3 are listed ahead of it; at 11 the figure is about 1,700.
- **The plinth's two readings** (#582, 16 October). The plinth told every company it had seen that
  cut before, under the roots, though only one that has stood at the Grove Stone has: the secret
  was told, not found. It is now two `once` events on the square, 8,14, and a company reads one of
  them. One that has stood at the Grove Stone (`grove2:g2_stone`) reads
  `b5_plinth`, held `after` it, with its line as it was: "Stienwierde. The plinth, and nothing on
  it: a socket cut clean, a man's width. You have seen that cut before, a hand-span of it, under
  the roots." One that has not reads `b5_plinth_first`, a new id, held `until` it: the same words
  without the last sentence. A company that read the short line and later stands at the Grove
  Stone is told the cut the next time it steps on the plinth. Either reading is the plinth seen to
  the chapter (§5). No tile, group or door moves.

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
- **Pay.** About 800 xp a member; as built about 970 (§8).
- **As built** (#174, 1 October): band 11–12. The temple's dry door stands at 16,11 with tidal
  flats along its foot, so at high water it seems to stand in the sea; the door, the priestess and
  the causeway to them are dry and reached the same way at either tide, as §5's "the temples open
  at either tide" asks. No drowned men fight here: none stands at 11, and a new one is a drawing and
  a sprite, the creatures' and the systems' lanes, which #175 needs for its nave and its choir's
  front row and so owes before it is built. The causeways' drowned stand in the water and do not
  move. The groups are three, each a real fight at 11: five fen toads on the causeway in, the
  nearest; five brinelings in the channel by night, B5's Rifts' spill, until both are quiet; two bull
  toads on the flats past the far roof, the farthest and the hardest at 12. The far roof's door
  opens on a porch and a stair down, the way into the second level's back since #175; tidal ground
  lies either side of the ledge before it and round the roof's foot, never beside the porch, so nothing behind the door is reached across the flats. The hint is an event beside
  the priestess, always there: she counts the doors one to ten with her hand to each roof, then
  lifts it towards the far roof, where no door shows, and says eleven. The camp is on the last dry
  ground before the door; the cairn holds gold and a potion, no gear. The Tide Bell is #175's
  (§6). As measured, the box pays about 970 xp a member and 70 gold.

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
  and the Tidefolk's blessing given once, a point of Endurance and the cold kept off to the next rest.
- **The secret and its hint.** The door from the far roof into the second level's back (§4.6), and
  behind it the sacristy the priests drowned themselves in, with their god's silver.
- **New here.** A caster among the dead; a boss that blesses (#161); a count that stops.
- **Finds.** The god's silver: a Silver Mace +1 and a Holy Symbol of the tide, a resistance to
  cold carried; beside it a Morning Star +1 and an Ironshod Staff +1, the ladder's (#399).
- **Pay.** About 1,800 xp a member.
- **As built** (#175, 2 October): band 11–12, two levels. The upper temple, `drowned_temples`, is
  entered at B6's dry door into the narthex, where the bell's oak frame stands empty; the nave runs
  north between its pillars, its west aisle under shallow water, two drowned men in its dry strip;
  of its four chapels the north-west is sunk in deep water, the south-west flooded to the chin of
  the drowned standing in it, and the two east are dry, each with a font, two bull toads come in
  with the fen at the north-east's; the apse's stair goes down, the count heard at its head. The
  choir, `drowned_temples2`, is dry: a drowned man alone at the stair's foot; the stalls north,
  two chanters behind two drowned men, the brief's choir cut to the share, and the west bay's
  stalls empty but for their psalters; the Choirmaster alone on the chancel step, blessing itself each round it can, and the
  vestry behind it with the ladder's two finds. The sacristy at the back is cut off from the
  chancel by the deep pool the priests drowned themselves in, and reached only down the far roof's
  wet stair, B6's secret: the god's silver is had that way and no other, by a swimmer or not. When
  the Choirmaster falls the count stops, the stair's head, the stair's foot, the chancel, the
  pool and the sacristy go quiet, and the choir does not come back. The Choirmaster
  drops the Tide Bell, which the priestess takes at the first meeting and rings inside the door
  (§6), and the Tidefolk's blessing waits on its frame once it hangs (§9). The god's name is on its silver alone (§10). The gate
  holds at 11: the upper level wins every fight at 7.2 fights to a rest; the choir wins 83% of its
  fights with the boss among them, every fight but the boss's, at 7.5 to a rest; the Choirmaster
  is won 48% of the time at 11 and 98% at 13 (once the gate's company took its first prestige, #541,
  98% of the choir's fights and 94% of the Choirmaster's at 11, the second past its limit until #806
  set its hit points again at 825: 48% at 11 and 100% at 13, and 82.7% of the choir's fights with it
  among them, off the aim of 90% and inside the limit of 80%; §9). As measured, a clear pays about
  1,580 xp a member at 11 and about 1,130 gold (§8). Once the Tide Stone is home (#191) the god
  sings, very faintly, across the nave's head before the apse's stair and before the far roof's
  porch, whether or not the count has stopped, and the count and the quiet at those stairs give way
  to it.

### 4.8 C6, Saltmouth's box (#176): core, band 11–12

- **Purpose.** The Saltings' step, the free port from outside: the Salt Road's end at the town's
  gate, the barge quay where the Long Water meets the sea, and the shore that floods.
- **Landmarks.** The town's walls and gate at 98,177, the way into #177; the barge quay with a
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
- **As built** (#176, 1 October): laid in the Saltings, all of it, so the crossing line falls at the
  C5/C6 seam. The land gate is at 26,19, the road's end at it and the way into Saltmouth (#177). The smugglers' stair opens from dry sand at the sea wall's north end, beside the gate:
  inside, its cache at the foot of the flight, by a sea door onto the shore path, barred from
  within; the stair's top, a door barred from the far side, is the harbour tavern's cellar, owed
  to #177 and #182 as a way through. The tide may cut nothing off (`tidalFaults`), so the stair is
  dry at either tide, and it is the shore path under it that the tide covers twice a day.
  The Scale Mail is a crate of the crews' cargo on the quay, not the warehouse's, which is the
  Compact's. The eel under the quay is said, not fought, and the groups are three: the bargemen by
  day, the Hand's smugglers by night and the crabs; the smugglers, at 12, are the box's hardest,
  6.1 fights to a rest on their own. The fen west of the road is cut by the river's arms, so a ford
  crosses the west arm and another its mouth. As measured, the box pays about 1,030 xp a member, a
  company at one hour meeting either the quay's day group or its night one, and 556 gold. What the
  owner finds by hand goes here when the box has been played.

### 4.9 Saltmouth (#177): town, 16×16, band 10–12

- **Purpose.** The act's first town: the Compact's home, the seat of Jory Tallis, and where four
  classes take their first prestige. It sells and teaches what the band needs (EXPANSION §4).
- **Businesses,** each with a room of its own (#185): the inn (rest, and the coach yard, #249); the
  drowned god's town shrine (cures and raising at the band's price, #250); the armourer (the
  band's gear, a step past Thornhold's, #251: a Morning Star, a Stiletto, a Horn Bow, a Long Axe,
  an Ironshod Staff, a Sharkskin Coat and a Tidefolk Robe, 600 to 1,100 gold, #399); the
  provisioner, a chandlery (#252); the harbour tavern that is the Compact's hall (#182, #253); the Cartographers' map room (#181, #254), which sells a
  chart (#860); the training hall, to 13 (#159, #255); the locksmith's shop (#19, #256), which sells
  a set of picks (#860). No spell hall: the next tier is sold at Lantern Watch (#151, call 9).
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
- **As built** (#177, 1 October): the land gate at C6's 26,19 opens on the head of the town's
  street, 7,1, and the street runs south to the harbour in the town's south-east, with the quay
  along its north and west sides and the ferry steps at its foot. The businesses are the brief's
  eight, each its own room: the Tide Table (the inn, 25 a head); the Telhus, the drowned god's
  town shrine, which cures; the Seawall Armoury, selling #399's seven and nothing else; the Quay
  Chandlery, the provisions at list price; the Sail Loft, training to 13; the locksmith's, Pender's
  Locks, a shop that sells a set of picks (#860), its keeper, Pender, standing after it on its
  square; the Keel, the harbour tavern; and the Cartographers' map room, its Geographer, Ysolde
  Carrow, at the plotting table, which sells a chart (#860). The four first prestiges are taught each by
  a person at their trade: Hiske the astrologer in the street (the Sorcerer's), Pender in his shop
  (the Thief's), Baukje the stevedore among the bales on the quay (the Barbarian's) and Tjerk the
  ferryman at the steps (the Monk's). Jory Tallis stands at his house front on the quay, his
  lineage framed on the wall through the open door, and his words touch the throne and no more.
  The pump in the square is brackish and does not heal. The halls are #181's and #182's (below),
  the Warden with the news of Hale #180's (built with the chapter, §9), and The Star That Moved #183's. No coach runs from the
  yard yet (§9). Kitto sells the boat at the quay's end: 150 the crossing, out at 20
  and onto Wrackholm's stage at 6 the next morning, and back the same from the stage, landing on
  the quay. Dunstan, at the quay's side, sells the ferry to Kilnhaven, 400 the crossing, out at 8
  and onto Kilnhaven's quay at 16 two days on (#469). The walkthrough goes in by the gate and out again, buys each class its step at the
  armourer, trains a member of 12 to 13 at the loft and makes a Tumbler of Ottilie at 11, once
  the log has sent her to Pender; then, for a company of its own given the gold, it buys the set of
  picks at Pender's door and the chart at the Map Room's; shows the picks open a locked chest that
  the same company without them cannot and the chart map a square further; and sells each back at
  half (#860); then it takes the boat to the isle, saves there and loads, and
  takes it home. The town pays nothing of its own: its 300
  is its quests', which are its halls', its chapter's and its side quests'.
- **The Cartographers' hall** (#181, 1 October): the map room is the Map Room, a shop with the
  Guild's `hall`, selling rations, antidotes, lamp oil and healing potions at list price to
  surveyors going out, and a Guild Chart, 400 gold, that maps a square further for any company
  that carries it (#860); its menu is the trade, the Guild's work, the skills it teaches and Ysolde,
  who stands in it as a person. The Guild's three skills, Swimmer, Cartographer and Pathfinder, are
  taught at the hall for 1,000 gold each to a company with its first task done (#813, #857), and
  Ysolde's words say nothing of them. The book under glass is the Meridian Company's route book,
  left with the Guild the morning they went; the journals went down with them. Ysolde reads the
  first journal to a company that carries it and gives it back (`meridian_read`): Oriel Fane's line
  about lying dry under the causeway's arch points at the dry place under C5's arch, which the
  mast's stump hints too. The walkthrough takes the first task,
  chains the road, is made Chainmen, does both quests of the first rank and is made Surveyors, then
  has the journal read.
- **The Compact's hall** (#182, 1 October): the Keel is the Salt Compact's hall, a tavern that carries `hall`
  (#417), so its menu is the talk of the room, the Compact's work and Ruan, who keeps it. Her words
  are plain to a stranger and a degree warmer to a Runner, and never touch the line's reveal. That
  is hers once the Factor's rung is paid (#635, PR D): she says the orders come from below in the
  founder's hand, ten years under his cairn, and puts the one question the line has, the orders to
  the Wardens or the Compact taken over. Each answer sets its own flag (`q_compact_wardens`, `q_compact_over`), pays
  nothing and changes her words; the question is put again until it is answered, and no rank waits
  on it (docs/areas/wrackholm.md §9). The first task, The Long Way: the warehouse clerk on C6's quay hands over a cask of brandy once the
  run is taken, an event by the customs house door at 4,13 shows only while the cask is carried,
  and the hall pays when that has been seen and takes the cask: 30 gold and 120 xp, and the company
  is a Runner. The first rank's two: What the Crews Carry, the crate of the crews' cargo on C6's
  quay opened (100 gold, 360 xp); and The Watcher on Wrackholm, the lookout on E6's west cliff
  found (150 gold, 480 xp). Both are paid early to a company that came first. The Compact comes to
  960 xp, 160 a member, and 280 gold. Kitto's boat is half to a Runner, 75, both ways, and Kitto
  says so; `free` (Passage Paid, #401) still beats it. The cellar way is a second secret: sawdust
  trodden out along the Keel's end wall at 14,5 is the hint, the wall at 14,4 opens to a search, and
  the cellar's passage at 14,3 comes out on the sand under C6's sea wall at 28,18, on the rope's
  square. The bar is lifted on the cellar side and drops behind, so the way runs one way only, and
  the smugglers' stair and its cache are still had only through C6's own secret. The walkthrough joins the Compact by the run, pays the half fare both ways, walks the
  crate in the log and goes down through the cellar. The hermit's letter (#56's 26) is #192's to
  build end to end, Ruan's hand-in with it.
- **After the Heart** (#765; docs/areas/hearth_isle.md §12): Ysolde, Ruan and the priestess at the
  Drowned Temples' dry door (`delta_b6` 15,12) each have a word for the relit, the opened and the
  finished ending, said before anything else of theirs but Ruan's question and Ysolde's reading of the
  journal while they stand open. The walkthrough hears each after each ending, and before one, none.

### 4.10 C7, the salt pans (#178): country, band 12

- **Purpose.** The Saltings' pans south of Saltmouth, the salt crabs' country, and the Scarp rising
  at the box's south edge toward the Glasswold, Act IV's border.
- **Landmarks.** Salt flats with the pans' walls and the salters' huts, walked in lanes; the Scarp's
  cliff as the south edge with the stair's foot at 80,206 seen and, since the Wold's C8 (#528),
  climbed (docs/areas/glasswold.md §4.6); the last marsh
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
- **Finds.** A named crab-shell buckler and a Horn Bow +1, the ladder's (#399), in the hoard.
- **Pay.** About 700 xp a member.
- **As built** (#178, 1 October): band 11–12, the Saltings', as C6's: a band of 12 alone wants its
  hardest group at 13, which the roster has not. The Scarp is mountain and the Glasswold's ground
  below its line in the box is closed with it, band 26–28 and Act IV's to open by editing the map.
  The stair's foot is a notch at 8,22 at the end of a worn track from the plan's link at 80,206: its
  lowest flight has come down with the face and the flights above climb out of reach, so nothing is
  locked and nothing says "not yet"; Act IV builds a way past the fall and rewrites the event. The
  groups are two, each a real fight at 11 after the re-stat (#18): four salt crabs in the middle
  south pan (6.4 fights to a rest) and two bull toads in the last marsh, the box's hardest (5.8).
  The brief's three crab groups are one here and C6's at the pans' edge, and its smugglers on the
  shore are C6's night crew under the sea wall: the atlas gives C7 no sea, and their skiff at the
  creek's end is said, not fought. The secret is a pan with no sluice, walled on four sides; the
  crabs' hole under its east wall is the way in and the only one, with no lane, sluice or tide
  reaching it. The hoard holds 200 gold, the Crab-Shell Buckler +2 and the ladder's Horn Bow +1
  (#399). The star was a night event that set nothing until #183 made it The Star That Moved's watch
  (§6): the pilots' stone where the lanes cross at 25,7, the watch from it by night, once, and the
  pilots' slate in a chest at its foot. As measured, the box pays about 700 xp a member,
  its share, and 280 gold. What the owner finds by hand goes here when the box has been played.

### 4.11 B3 and B4, the willows (#179): country, band 10–11

- **Purpose.** The Upper Water behind Rietum: willows along the river and the fen's north end,
  built once the owner has played the act (#151, call 10).
- **Landmarks.** The willows' quay; a heronry; the river's bend under the rim.
- **Encounters.** Herons; barges at the willows' quay; a heronry as a den (#88).
- **Pay.** About 400 xp a member each.
- **As built** (#179, 3 October): B3, `upperwater_b3`, is laid in the Upper Water and B4,
  `delta_b4`, in the Delta, so the crossing line falls at their seam as it does at C3/C4's. The
  willows are stands of trees with rides between them. On B3 the Long Water comes out of the rim's
  hills at 1,2, a mountain corner where the atlas's river meets the box under the rim, and bends
  into the willows; the shrine at the bend (intellect) is the drowned god's one bowl the river
  keeps full. Rietum's diep runs on west from C3's sluice along row 12 to the river, deep water under
  its pollards, crossed by a plank bridge at 25,12; at its mouth the willows' quay, the barge lying
  up for the sluice with its crew aboard, and the boathouse behind, its back room the secret at
  11,16, the hint the green worn off its back wall at 11,17. Below the quay the river is forded at
  8–9,18 and the carr lies past it, a bull toad in it, the box's farthest and hardest. Hiltje, a
  withy-cutter of Rietum, cuts in the beds north of the diep: the god on the hill to the south has
  had his name cut off, her grandmother would not say it, and the herons go home to the willows at
  the river's end. On B4 the heronry, a den (#88), stands in the willows' last stand at 8,1 over the
  north ford, breeding grey herons: a brood of three on the grass by the water, back a day after
  they fall until it burns, and five keepers on the nests, the same bird in greater number; burnt,
  it gives 100 gold, a Spear +1 and a draught. The drowned god's statue on the hill's crown asks for
  the name cut off its plinth, which is on the Holy Symbol's rim in the temples' sacristy and
  nowhere else (§10), and gives 50 gold and might. The dyke-wrights' flood-store in the hill's side
  is the secret at 2,12, faced in stone, the hint at 2,13 the martins nesting where the facing is
  laid looser, its chest 150 gold and a War Hammer +1. The strand, C4's ford carried across the
  broad water's foot on row 22 and the fen's north end, a bull toad in it, the hardest. Each box's
  gate holds at 10: B3 at 7.1 fights to a rest, B4 at 7.1, every fight won, the heronry's keepers
  and its brood each won every time. As measured, B3 pays about 615 xp a member at 10 and 320 gold,
  B4 about 730 and 360. What the owner finds by hand goes here when the boxes have been played.

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
  the goal goes on to the temples. The plinth reads two ways (§4.5, #582), and either is the
  step done.
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

**As built** (#180, 2 October): `chapter.ts`, joined after the Grove. It begins once the Foreland
and the Grove are both done, or on Wytske's word at Rietum (`c3_saw_stone`) or Kitto's at
Saltmouth (`sm_ship_word`). Six entries: Wytske's sighting, the plinth, the priestess's count, the
count up the apse's stair, the Warden's news of Hale and Kitto's word on the ship. Seven goals,
furthest along first: the boat; before the boat, the plinth (Saltmouth taken first); Saltmouth;
the temples; the plinth; Rietum; down into the Delta. Its end is `q_tide_home`, the Stone set back,
which the plinth at B5 sets when it takes the Stone (#191); on the isle the goal passes to
Wrackholm's chapter, and the Tide Stone stays open until then. Two
people at Saltmouth carry the beats: Kitto gains a line on the midsummer barge in all three of his
greetings, and a Warden off the coast road sits by the gate at 9,1 once #156 has taken Hale from
the Scarth (`q_hale_taken`), until Hale is freed. The walkthrough plays it in order at 10 and 11
from a new game, the Foreland and the Grove first, and with Saltmouth taken first at 12, before the
Grove; it sets `q_hale_taken` by hand, owed to #156 (§9). Both runs stop on Wrackholm's landing,
and Wrackholm's walkthrough plays them on to the Stone home (#191). The plinth entry and the two
goals that wait on the plinth hold either of its readings (#582): in order the company reads the
cut it has seen, with Saltmouth first the socket and no more.

## 6. Side quests

#56's four for Saltreach, all taken by the owner on 28 September 2026 (#151, call 13), each built
with its box on the systems of #76 (#183):

| # | Quest | Level | Where | What it needs | Built in |
|---|---|---|---|---|---|
| 21 | The Night-Light | 11 | Rietum (C3) | a choice put by a person; `until` (#41) | #183; #172 places the child and her hint |
| 22 | Passage Paid | 11 | the Long Water (C4); the boat at Saltmouth | a choice put by a person; `after` (#41); the fare (#164) | #171; the boat reads its flag (#413) |
| 23 | The Tide Bell | 12 | the Drowned Temples and their door (B6) | a hand-in at the first meeting (#43); a once-only blessing (#45) | #175; the blessing #554 (§9); her after-lines #183 |
| 24 | The Star That Moved | 12 | Saltmouth; the pans at night (C7) | `when` (#41); a choice put by a person | #177, #178; #183 |

One change to #56's drafts, decided with the boat (#164): 22's favour is the boat's fare, never
the boat, which sails for anyone from the start (EXPANSION §2.2).

**Passage Paid, as built** (#171). Hessel, the master of a barge on a shoal by C4's ford, wants it
pushed off; his hold is full of people he swears paid passage to Saltmouth. The people aft have
nothing with them and the second row of notches on his pole is shorter: the Cargo Ledger's column,
seen and never said. Cut loose (`q_passage_freed`), they wade ashore, and a crew of three bargemen
comes up the bank after them. Pushed off (`q_passage_owed`), Hessel's word carries the company to
Wrackholm with no fare: Kitto's boat on Saltmouth's quay (#413) reads the flag as its `free`. Either way he is gone
off the shoal. After it (#183) the shoal has an event for each answer; Geeske, who paid at the spur,
stands on Saltmouth's quay with a text for each; cut loose, a boy of Rietum mends nets by the lofts;
pushed off, Hessel checks a load on Saltmouth's quay.

**The Night-Light, as built** (#183). The priest at the sluice asks for Nynke's light at his first
meeting (`q_nightlight`), and still reads a pole's mark for B5. Nynke's first meeting stays the hint;
once he has asked, she puts the choice. Taken (`q_nightlight_taken`), the light goes in the pack, and
the priest lays it in the shrine's dry bowl for 100 gold (`q_nightlight_temple`) or Tobin, a bargeman
from upriver on the diep's north bank, buys it for 250 and goes down with the tide
(`q_nightlight_sold`), leaving a heron on his berth. Kept (`q_nightlight_kept`), it stays on her sill.
The brinelings at her window and the green on the water by night come until the light leaves her or
the Stone is home (`q_tide_home`), which puts it out; a quest asked and never answered ends there too.
Each of the three has words for each way.

**The Tide Bell's after-lines** (#183). Once the bell hangs, the priestess asks for the Stone home;
once it is home, the god sings the tide down and she sends the company away, not unkindly.

**The Star That Moved, as built** (#183). Hiske asks at her first meeting (`q_star`) for a watch
from the pilots' stone on C7, and still teaches. By night the star walks in the stone's notch
(`c7_star`, once), and the pilots' slate lies in a chest at its foot at any hour. The slate goes to
Hiske's press for 200 gold (`q_star_press`) or to Tallis for 400 (`q_star_tallis`), each at the first
meeting, and Hiske has words for a company that brings it unasked. Tallis's throne words always come
first (`sm_tallis_word`); then his words on the star, and after it his and Hiske's for each way.

### The guilds' quests

Two halls open here (DESIGN §8), on the rules and the hall menu built in #132:

- **The Cartographers' Guild** (#181), a map room in Saltmouth (#254): the first task, a survey
  of the Salt Road's milestones; a first rank of two quests in the boxes and the Delta; the Meridian
  journal read here for the first time, where the Lost Expedition goes on (DESIGN §10.3). Its
  surveyor gives The Length of the Wall in Sunderwood (#56's 32, #205). As built:

  | Rank | Quest | The deed | Pay |
  |---|---|---|---|
  | first task | First Chain | taken, the road chained from D5's milestone (`d5_milestone`, 0,1) to C6's (`c6_milestone`, 26,2), two new once-events that wait on the taking | 30 gold, 120 xp |
  | 1 | The Fen's Edge | west past Stienwierde to where the fen ends (`delta_b5:b5_west`) | 200 gold, 360 xp |
  | 1 | The West Arm | over the west arm's ford to the eel-catcher's hut (`saltings_c6:c6_hut`) | 200 gold, 360 xp |

  The quests of ranks 2 and 3, offered to a Surveyor and a Mapmaker, ride Act IV's dungeons (#635,
  DESIGN §8): the Surveyor's, *The Fourth Journal*, is the Ember Stone's, built
  (docs/areas/ashfall.md §6, §9, #516's 16), and the Mapmaker's, *Fane's Fire*, is Meridian Camp's,
  built (docs/areas/ashfall.md §6, §9, #635's PR C). Geographer, the fourth rank, is the top and has
  none.
- **The Salt Compact** (#182, built), the harbour tavern (#253): the first task, a run of brandy past
  the customs house; a first rank of two quests, the crews' crate on C6's quay and the watcher's
  place on Wrackholm's west cliff; the boat's fare halved for a member (§4.9). Its line begins
  with the hermit's letter from Wrackholm (#56's 26, #192): the founder is a decade dead and the
  orders come from below (DESIGN §10.2). The crews the company fights on the river and the isle
  have left the Compact for the Hand's coin, so killing them costs nothing with the guild (#151,
  call 4). A Fence's rung, *Where the Cargo Goes*, is Wrackholm's, the stair's foot under the Tide
  Ship seen (docs/areas/wrackholm.md §9, #635); the Factor's, *In the Founder's Hand*, is the
  Dead-Drop's, built: an order from its counting house carried up, once the Sleepers are seen
  (docs/areas/wrackholm.md §6, §9, #635's PR D). The rank it pays, Partner, is the top and has no
  quest, and opens Ruan's choice in the Keel (§4.9).

### The artifact: the Telstok (#846)

Saltreach's of the bounds' eight (DESIGN §9), apart from the bounds' brief of #830, which lays the
boxes. Found and never told: no `seek` quest, no line in the journal and no mark on the world map.
#830 builds the lair, its door and the rumour once #845, #847 and the guardian's drawing are in.

- **What it is:** *A staff of black bog oak, its foot worn round on a stone floor. / Struck on
  stone, it rings like a bell under water.* The staff a priest beat time with when the god still
  sang and did not count (§10).
- **The rumour:** Hiltje, the withy-cutter of Rietum, in the beds north of the diep (B3, §4.11), two
  lines more at a meeting after her first, words only: *Before the temples there was a priest who
  sang and never counted. When her staff struck the floor, the dead lay down. / The water came up
  over her mound, and she sang it in.* It marks nothing on the world map.
- **Slot and bearers:** a staff, two-handed: the cleric, the sorcerer, the druid and the monk.
- **Numbers:** 1d10+14, the Grey Staff's 1d10+13 and a point (EXPANSION §5.2). Found and never sold.
- **Power:** an element (DESIGN §9, kind 2): its blows carry holy, an added 1d6 on each that lands.
- **The lair:** a drowned mound of two levels on the fen's west edge under the rim, its door in A5,
  at the cap's band, 30–32 (#845).
- **The guardian:** the Old Chanter (skeleton, a new kind; boss, 32; docs/MONSTERS.md §13): *The
  first of the chanters, and it still sings the old song.* It blesses itself and curses.

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
  8,300 without the willows. Saltmouth's 300 is its two halls': the Cartographers' three quests
  pay 840 xp, 140 a member, and 430 gold (#181), and the Compact's three 960 xp, 160 a member, and
  280 gold (#182). A small Rift is budgeted at
  about 450 a member on top of its box's share: C5's, about 430, brings the sum to about 8,750, some 6% over the curve. B5 as built pays
  about 1,600, its two Rifts inside it (#173): a fight inside the gate's aim at 11 costs about 300
  xp a member whatever its monsters, and its five come to about 1,650 measured with the company at
  about 10, about 1,700 at 11. C4 as built pays about 690 against its 600 (#171): the bull toad its
  curve needs as its hardest group pays about 160, and the eel was cut to keep its day inside the
  aim; the crew that comes after Passage Paid, about 200, is the side quests'. C6 as built pays
  about 1,030 (#176), its three groups each inside the aim, the quay's by day and by night one of
  them at any hour. C7 as built pays its 700 (#178). B6 as built pays about 970 over its 800
  (#174), its three fights at about 300 each and its brinelings only by night. C3 as built pays
  about 1,010 against its 1,000 (#172), its four groups about 260 to 280 each with the company at
  10 and the quay's by day and the brinelings by night both counted. The temples as built pay about
  1,580 a member at 11 and 1,220 at 12 (#175), inside their share and the issue's 1,600: the
  Choirmaster is paid as one fight, not as the boss line (§9). No other share gives back the 600,
  the 90, the 330, the 170 and the 10, so the area comes to about 9,730, some 18% over the curve's
  8,267. Paid by level in the road's order, a clear of what is built gives about 9,100 a member,
  over the curve, and 4,370 gold, the gold's rest owed to #153
  (`src/content/progression.ts`) until the willows paid it. The surplus is for a kill paid by level to damp, and each box
  still to build is priced by its fights, about 300 a fight, and recorded as built where that passes
  its share; the
  sum here is restated with each. The willows, as built (#179), pay about 615 and 730 a member at
  10 against their 800: the heronry needs its keepers and a brood, each box the curve's toad, and
  B3 its quay's crew, five fights where a share of 400 a box buys about three. Paid by level in the
  road's order, a clear of all ten boxes, the temples and the town gives about 10,340 a member, some
  25% over the curve, and 6,197 gold, which meets the curve's 5,040, so #153 no longer owes the
  area's gold. From here on a kill pays
  by level (#159), so a company that arrives at 10 earns the shares as written and one that arrives
  at 13 earns less; the curve's row reports what a clear falls short of as owed to #153 until the
  boxes exist. The bounds (§12) pay from the surplus: C2 and B2 about 490 and 220 xp a member by the
  curve's count, A3 and A4 about 220 and 420, A5 and A6 about 485 and 604, B7 and D6 about 604 and
  315, so that a clear now gives 13,711 xp a member and 8,410 gold, and a company entering at 10 and
  three quarters clearing it leaves at 12.9, against the curve's 13.0 (#634).
- **Gold.** Training six members from 10 to 12 costs about 5,040 with today's `trainPrice`, and the
  first prestiges about 1,000 each (#19); a clear should pay for the training at least, in chests,
  drops and the halls' pay, and the ladder's step at Saltmouth's armourer is priced within the
  band's window (#399): its dearest ware the Sharkskin Coat at 1,100 and its dearest find the
  Sharkskin Coat +1 at 1,250 (B2, §12.3), against 2,000. Its weapons for the premade six come to
  about 4,250, and with the armour about 7,850.
- **The gate.** The gate check (`tools/tests/gate.ts`, #38) holds each box at its own floor
  (docs/areas/thornmark.md §9, 17): a company at 10 wins nine in ten of C5's fights and walks the
  causeway resting at its camp; one at 8 wins no more than one in four (from 10 the gate judges a
  company two under by its day, #851). The Choirmaster is won about half the time at 11 and nearly
  always at 13.
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
7. **The willows are built after the act is played** (call 10): #179 was parked, and the owner took
   it off parked on 3 October.
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

Decided by delegate for #171, each the owner's to overturn:

1. **C4 is laid in the Delta, and named The Delta.** Its band, 10–11, sits in the Delta's, and its
   barges are the Delta road's. The Delta's first map stays D5, which has no groups, and the Upper
   Water begins at Rietum (#172).
2. **Two barges.** The fight's, tied at the bank, is always there: the curve needs its group, and
   it is the road's first crew that breaks, so it may not be missing by day. Dusk lives in its words.
   Passage Paid's, on the shoal, is a person, there until either answer.
3. **Passage Paid takes no fight to help.** The choice is the whole quest. Cut loose, the people go
   ashore and three bargemen with no master come up the bank `after` it; pushed off, the master owes
   the boat's fare, `q_passage_owed`, which Kitto's boat (#413) reads as its `free`. He does not say the half he sold are
   in the ledger's column: the company sees it.
4. **The hide is a reed hut with its secret wall on the sand,** at the one gap in the herons. Its
   shard is a second Brine Shard, not a new item: the area's shards are one kind.
5. **The groups are the barge at the bank and a bull toad alone in the fields' drain; no eel.** The
   curve wants the hardest group at 11 or over by its mean level, and the barge's is 10.1; a lone
   level-11 would pass by level and be no fight. The toad is C5's precedent and MONSTERS' "the Delta,
   alone". With the eel the box ran 8.4 fights to a rest, off the aim; without it, 6.7. C4 is recorded
   as built at about 690 against its share of 600 (§8).
6. **C4's hermit is an eel-trapper at the ford,** not a second net-mender: D5's woman saw the light
   in the sacking, and he heard the barge and knows its poleman for the Hand's by his stroke.
7. **The Delta's road runs on up the spur:** the two pools and C5's bull toad, which sees a company
   at the fork, then C4's barge. It is walked 100% of the time at 10.
8. **The boat reads Hessel's word here:** #413 sold the boat without it, so this pull request adds
   `free: { flag: 'q_passage_owed' }` to Kitto's passage out of Saltmouth. The way back is paid.

Decided by delegate for #183's Passage Paid, each the owner's to overturn:

1. **Passage Paid stays #171's.** There is no chit: the favour is the fare, read off
   `q_passage_owed`, and Kitto already says so, so a letter he took would be the same favour twice.
   There is no hold event: the hold is seen in Hessel's first meeting and never said. The answers keep
   their words.
2. **Its people after:** Geeske (the issue's Elowen, a fen passenger and Frisian) on Saltmouth's quay
   at 9,10 with a text for each answer; Hessel (the issue's Jago) at 12,10 once pushed off; a boy of
   Rietum mending nets by the lofts at 6,11 once cut loose, his wrists marked by rope, as the hold had
   rope; and an event on the shoal for each. Saltmouth's steps are left to #192.
3. **The second barge at dusk is cut:** the game has no dusk, and the crew that comes up the bank
   after the people is it. A third fight on a country box would push C4 further over its share (§8).

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

Decided by delegate for #174, each the owner's to overturn:

1. **The temples' dry door sits beside the flats** (the owner's open question): tidal ground along
   its foot, so at high water the door reads as standing in the sea, while the door, the priestess
   and the causeway to them stay dry and are reached the same way at either tide. It is the brief's
   landmark in the only form the tide check allows, and keeps §5's "the temples open at either
   tide".
2. **No drowned men fight on B6;** it is built from the monsters that exist. A Drowned Chanter here
   would spend #175's caster among the dead early, and a level-11 Drowned Man is a drawing and a
   sprite, outside the area lane. #175 needs one for its nave and its choir's front row, so it is
   owed before #175, for the owner to agree and file; filed and drawn as #451. The causeways'
   drowned are events.
3. **Three groups, each a real fight at 11,** the hardest two bull toads at 12 with no averaging:
   five fen toads on the causeway in, five brinelings in the channel by night until both of B5's
   Rifts are quiet, and the bull toads on the flats past the far roof. The brief's seven groups
   would pay about 2,100 against an 800 share.
4. **B6 is built at about 970 over its 800,** and §8 says so: with C6 and C7 the area comes to
   about 9,850, some 19% over the curve. No other share is cut.
5. **The far roof's door opens on a sunken porch and a stair down,** an event owed to #175 as the
   way into the second level's back; no cache, since the brief has no finds on the box. Tidal
   ground lies either side of the ledge before the door and round the roof's foot, never beside the
   porch.
6. **The hint is the priestess's count, written as an event beside her** and always there: one to
   ten with her hand to each roof, then a pause towards the far roof, where no door shows, and
   eleven, the number the chant ends on.
7. **The band stays 11–12, and the camp and the cairn both stand:** the camp is the company's rest
   before the temples, C5's being two boxes back and B5 having none.

Decided by delegate for #176, each the owner's to overturn:

1. **The box is laid in the Saltings,** band 11–12, all of it, though the atlas gives two thirds of
   its land to the Delta: the brief calls it the Saltings' step, the chapter puts that step at
   Saltmouth and call 3 gives the tide to the Saltings' shore. The crossing line falls at the C5/C6
   seam, where the fen gives way to salt.
2. **The stair's foot is a secret door on dry sand at the sea wall's north end,** beside the gate,
   and the cache is at the flight's foot, by a sea door onto the shore path barred from within, so
   the cache is had only through the secret. This inverts the brief: the stair is dry at either
   tide, and the shore path under it is dry at low water only, since the tide may cut nothing off.
   The stair's top is the tavern's cellar, owed to #177 and #182.
3. **The groups stay three at about 1,030 xp a member,** recorded in §8 as built over C6's 700:
   fights to a rest is the gate, a share a proposal, and trimming to 700 would push the box out of
   aim or lose a group. A company at one hour meets the quay's day group or its night one, not both.
4. **C6's milestone reads SALTMOUTH 2, RIETUM 7, and D5's is corrected to SALTMOUTH 4, RIETUM 9,**
   both counted along the trails at about 13 squares to the unit; D5's RIETUM 5 was short, and the
   Cartographers' first task surveys the Salt Road's milestones (#181), so the stones must agree.
   THE PASS 40 is dropped: the pass lies behind the Edge, off this road's reckoning.
5. **Until #177 the gate is shut wall,** and the event before it says only what is seen: no flag, no
   time and no entry in `locks.ts`. #177 makes 26,19 the way in and rewrites the event. The site
   moves to the gate, 98,177; the plan's way in (`src/content/atlas.ts`, saltings to saltmouth) is
   still at 102,178, a tidal square, and is #177's to move with the town's door. #177 opened the
   gate and moved the way in to 98,177.
6. **The Scale Mail +1 is in a crate of the crews' cargo on the quay,** not the warehouse, which is
   the Compact's: call 4 frees only the crews' goods. The clerk's lines point at the crews.
7. **The eel under the quay is said, not fought:** a lone fen eel is a trivial fight that only pushes
   fights to a rest up, and C5 has eels in both its pools.

Decided by delegate for #172, each the owner's to overturn:

1. **The quay stands on a cut, a diep, with no river in the box:** deep water from a sluice-house
   on the west edge at 0,12 to the quay under the mound. The sluice-house is a building square, so
   the edge check holds with no change to the atlas, and deep water carries the barges and keeps a
   swimmer off the cache. The diep's way on through B3 to the Long Water was owed to #179, which carries it. With no
   river the brief's eel and ford go, and the shrine stands by the sluice.
2. **The Downs' strip above the cliff is closed as mountain with the Edge,** as C7 closed the
   Glasswold's squares (#178's 3). §1 says the only way over the Edge is the Salt Road in D4, and a
   band 4–5 strip left open from a band 10–11 box would be a back way and an empty walk.
3. **Sjonghol is a short cleft of dirt cut into the cliff's foot,** four squares from its mouth at
   28,10 to its back at 30,8, a dead end with the Monk's second-prestige trainer at its mouth. It
   needs no interior, so the Interiors lane stays out. It opens into neither D3 nor the strip above,
   and the site moves to the mouth, still inside C3 as #71 wanted.
4. **The old barge smuggler lives at a hut on a silted drain in the north fields under the hills,**
   in Rietum's box as the brief has it, and well over ten squares from the spur's road, which ends
   at 8,18. So he is off the beaten path and not a step of the quest. DESIGN's "the willows' quay" no
   longer reads true, but DESIGN is outside the area lane, so its rewording is the owner's to make.
5. **The cache is his old one from his Compact days, and he says nothing of it:** found, never told.
   Once the company carries his sword, a line of his `says` lets them keep it, and nothing else
   changes.
6. **Four groups, each always there or keyed to its hour:** four herons in the stubble beside the
   track nearest the way in, the barge master and three bargemen on the quay by day, four brinelings
   at the child's window by night and one bull toad in a flooded drain at the east fields' end, the
   hardest at 12 alone with no averaging. A company at one hour meets three; both hours are counted,
   as on C6. The toad sits twelve squares from Sjonghol's mouth and further from the smuggler's hut,
   so neither trainer's door is a fight's doorstep and both stay relatively safe (DESIGN §5; moved
   from under the Edge, five squares from Douwe, on review).
7. **One bull toad, not two:** the gate measures C3 at its floor of 10. Alone it is 9.0 fights to a
   rest there, inside the limit, and the box's mix is 7.2, inside the aim. Two toads were 2.1 at 10,
   under the limit of 4, and broke a fight off on 27% of days, though 5.8 at 11. One toad still meets
   the curve's rule, a mean level of 12 against the 11 asked, and follows C4 and C5, the other
   floor-10 boxes (#170's 3, #171's 5); B5 refused a lone toad because its floor is 11.
8. **The brinelings take no `until` now, and the child speaks her hint with no quest flags:** no flag
   marks the Stone home until #191 adds it, as #170's 6 and #173's 6 leave it. The Night-Light's
   choice and the brinelings' `until` are owed to whatever builds 21 once the owner approves it.
9. **The hint is one stone in the quay's face scrubbed clean where the rest are weeded,** always there
   on the square before the secret door. Beside it goes a night-only line: the child's night-light
   throws green on the water under that stone (C5's precedent, #170's 2). Her words say only that her
   light shows where the water glows. The brief's way in from the water at low tide is turned round,
   as C6's stair was: deep water and walls close the cache on every other side, so its secret door
   is the only way in.
10. **All four finds are in the cache, as #399's 3 gives Rietum's cache the ladder's two:** the Chain
    Mail +1, the Stiletto +1, the Tidefolk Robe +1 and the smuggler's sword. The sword is a Short
    Sword +2 under a name of its own (1d8+2, 340 gold), the step past the Downs' +1: a +3 or a +4
    would pass Wrackholm's Cutlass +2, found later, and with the Stiletto +1 in the same cache any
    plus is a keepsake.
11. **The step is a Tidefolk quay-hand whose words point west to the plinth, and they set a flag,
    `c3_saw_stone`, for #180's chapter to key on,** as Ysolde's set `meridian_read` (#181's 6). D5's
    net-mender saw the light in the sacking and C4's eel-trapper heard the barge, so this one adds
    what is new. The priest's line, owed by #173's 2, is about how every poleman scores the landing
    he pushes off from, without naming Stienwierde's.

Decided by delegate for #399, each the owner's to overturn:

1. **Every class has a new weapon line at each town,** sold, then found with a plus, as Thornmark's
   was: a point of blow a rung, a two-hander a point over a one-hander. Saltmouth sells the Morning
   Star, the Stiletto, the Horn Bow, the Long Axe and the Ironshod Staff.
2. **Armour steps on alternate rungs:** the medium wearers take the Sharkskin Coat (9) at 11 and the
   Watch's Lamellar (10) at 14; plate's wearers take Kelp Hole's Plate Mail +1 (10) at 13 and the
   Sunder's Plate Mail +2 (11) at 16. So Saltmouth sells nothing past plate's 9, and the Sunder's
   plate is a step past the Watch's stores, as Sunderwood's doc has it.
3. **The plus finds go to boxes that already promise finds:** Rietum's cache (two), the temples
   (two) and the pans' hoard; B6 has none, and B5 and C6 were built before the ladder, so the staff
   went to the temples and the robe to Rietum. Each is owed to its box until placed.
4. **The windows stay as they are:** no ware or find comes within 400 gold of its area's price.
5. **Two under is judged by the day from 10 (#851), not by the fights won:** gear dresses a company
   at a floor past one two under it, but a group a company at the floor fights six or seven of to a
   rest is one a company two under still beats. From 10 the to-a-rest aim and the two-under aim
   pulled against each other, and the day settled it.

Decided by delegate for #18, each the owner's to overturn:

1. **B5's Rifts keep their two tide elders,** at 4.9 fights to a rest at 11 after the re-stat to
   #409's line, under their aim of 5.75 and inside their limit. A warden must average 12 to hold the
   band's top, and only the elder pair does that among the brine family; a room of brinelings ahead
   of it would mend the figure, but it would cost the north Rift its cells and each Rift some 200 xp
   a member more.

Decided by delegate for #177, each the owner's to overturn:

1. **The coach stays owed,** to a coaches issue for the owner to file: a coach that runs one way is
   not honest, its return seller would stand in Helmstow, the Foreland's map, and the docs disagree
   on where it goes (SLICE says Helmstow, docs/areas/sunderwood.md east from Saltmouth). C6's yard
   keeps its "No horses", which is true as it stands.
2. **The locksmith is his own business, and a shop since #860:** Pender stood in
   `saltmouth_locksmith` and taught the Thief's first prestige, as the Split Oak's keeper is his
   tavern, for a shop must sell something and his trade, lock picks, waited on #18, while the
   armourer kept the Stiletto. The picks exist now: his door is a shop, Pender's Locks, selling a
   set of picks, and he stands after it on its square with no room of his own and teaches the
   Thief's first through his person, as Ysolde stands at the Map Room (#860's 1).
3. **The Keel and the map room are drawn with doors, each keeper in their room,** and #177 takes
   their UNPLACED entries: a door with no business fails `doorwayFaults`, and a shut front leaves the
   port short of its tavern. #181 and #182 turn each into its hall (a business with `hall`, which a
   person cannot carry) and add the first tasks and ranks; the keepers' words stay plain until then.
4. **The cellar way through is #182's,** with the tavern: the bar is lifted from the cellar side,
   and who lifts it is the Compact's to say. Until then C6's stair top stays a door barred from the
   far side, which is true.
5. **The boat is sold on the town's own harbour quay** (the second pull request): C6's quay is the
   river's and the barges'. #177 also gives E6's captain the passage back, as wrackholm.md and
   `CUT_OFF` both owe it to #177, landing the company on Saltmouth's quay: 150 each way, sailing at
   20 and landing at 6 the next day. The half fare for a member of the Compact waits on #182, since
   a passage has only `free`.
6. **The astrologer is Hiske,** a Tidefolk name, since Idony is a Lantern in Thornhold; **the
   captain is Kitto,** as #183 drafts him and Kelp Hole's Colan names him, the same man at both
   ends. The trainers' names carry their trades (Pender the locksmith), so the seeking quests' own
   words read true and no `seek` is written.
7. **The inn is 25 a head,** a step past the Green Man's 20 as Thornhold's was past Harrow's 12.
   The chandlery sells the provisions at list price, since a place's own price wants a reason
   Saltmouth does not have; the armourer sells #399's seven and nothing else: no shield steps on
   until the Watch's at 14, and the provisions are the chandlery's.
8. **Tallis stands in the street at his house front on the quay,** a person with no room, his door
   drawn as wall: #185 drew no room for him, and a door needs a business. An event on his square
   shows the lineage on the wall through the open door.
9. **The way in moves to the gate, 98,177,** and the plate from 100,176, the coach yard outside the
   wall, onto the walled ground at 99,180.
10. **Two pull requests, the second stacked on the first:** the town (the map, the eight
    businesses, the four trainers, Tallis and the people, the gate and the atlas), then the boat,
    which reaches into Wrackholm's E6 and `CUT_OFF` and is reviewed on its own.

Decided by delegate for #178, each the owner's to overturn:

1. **The groups are two, both always there:** four salt crabs in the pans and two bull toads in the
   marsh, about 700 a member, the share. Of the brief's three crab groups the second is C6's at the
   pans' edge, and its smugglers are C6's night crew: the atlas gives C7 no sea, and the shore is
   C6's. A lone bull toad is no fight, so the marsh holds two.
2. **The band is 11–12,** the Saltings' and C6's, not the brief's 12: a band of 12 alone wants a
   hardest group at 13, and the bull toads are the band's top as on B5.
3. **The Scarp is mountain, and the Glasswold's squares inside the box are closed with it:** 301 of
   its 1,024 squares are band 26–28, and left open they would be an empty walk from a band 12 box.
   A map is its whole box, so Act IV opens them by editing this one.
4. **The stair's foot is a notch at 8,22,** at the end of a track from the link's 80,206, its lowest
   flight fallen with the face: rock in plain sight with its reason on it, no flag and nothing in
   `locks.ts`. The link stays the plan's: Act IV's C8 (#528) kept it and built the way
   past the fall as a rope ladder (docs/areas/glasswold.md §4.6, §9, #528's 2 and 4).
5. **The Star That Moved's watch is built as a night event that sets nothing,** and the salter's
   rumour names no one: the quest and its choice are #183's, with Hiske, Saltmouth's astrologer
   (#177), and it rewrites `c7_star` as the watch. The quest's pay is §6's, not C7's.
6. **The buckler is the Crab-Shell Buckler +2,** armour 3 and 340 gold, for the martial classes and
   the cleric: a +3 would match Act I's Tower Shield +1 and pass B5's Kite Shield +1, found a box
   earlier.
7. **The shrine gives endurance,** the drowned god's as C5's and C6's are, its bowl full of salt
   where theirs are dry. No camp: C6's under the wall is the next box north.

Decided by delegate for #183's The Star That Moved, each the owner's to overturn:

1. **Hiske asks for the star at her first meeting and still teaches.** She is the issue's Idony,
   since Idony is a Lantern in Thornhold (#177's 6).
2. **Tallis gains `sm_tallis_word` on his first meeting,** so his throne words are always heard
   before the star's. His after-lines are words, not a hand-in's, since #192 gives him a second
   hand-in and of several only the last one's after-lines show.
3. **The pilots' stone is an event where the pans' lanes cross, and `c7_star` becomes the watch from
   it,** a once-event by night that the log keys on as seen, so it needs no flag and is never spent
   by day. The stone says nothing of trodden salt, which is the sealed pan's hint.
4. **The slate is in a plain chest at the stone's foot,** there at any hour, so Hiske has early
   words and the quest begins with the slate carried. She pays 200 gold and Tallis 400; the slate in
   his hands is the record #56's 64 may remember.

Decided by delegate for #181, each the owner's to overturn:

1. **The hall is a shop, the Map Room,** on the map room's door with the Guild's `hall`: only a
   business may carry one, and a shop must sell something real, so it sells rations, antidotes,
   lamp oil and healing potions at list price, what a surveyor takes out. No chart or kit was
   sold at #181, for it would have done nothing until #18's Cartographer existed; a Guild Chart is
   sold beside the stores since #860, for it does the Cartographer's work carried. Ysolde stands
   after it on its square, a person with no room of her own.
2. **The book under glass is the Company's route book,** left with the Guild the morning they went,
   since the room draws a book under glass and the journals went down with them: the first journal
   the company carries is the first read here.
3. **The first task is First Chain,** the road chained from D5's milestone to C6's, two once-events
   beside the stones that wait on the taking, the second on the first. Every company walks past both
   stones on its way in, so without the wait the task would always be paid as done early; with it,
   it is a trip back up the road, as First Watch is. It has no words for a company that came early.
4. **The first rank's two quests are on events already built:** the fen's west edge past
   Stienwierde (B5) and the eel-catcher's hut over the west arm's ford (C6), two trips in two zones,
   both in band 11–12 and off the chapter's road. No map is changed for them.
5. **The pay is small,** 140 xp a member in all, since the area is about 19% over its curve and
   Saltmouth's 300 is shared with the Compact's hall, the chapter and the side quests.
6. **Ysolde reads the journal and gives it back:** her words, after the journal is carried, set
   `meridian_read`. Fane's line about lying dry under the arch where the causeway crosses the
   channel, in off the stones beside it, points at C5's secret without claiming the barge or the
   mast, which are the Tide Stone barge's of this midsummer (#393, STORY) and thirty years too
   young for the Company: the mast's stump stays the hint it was (#170's 2), and the Company's is
   only the dry place under the arch (changed on review). The Lost Expedition's log entry for the
   reading would go in `thornmark/quests.ts`, another area's file, so it is owed to the owner's
   word and not written here; SLICE says the journal is read (#181).
7. **The Length of the Wall is not here:** it is #205's, given by the Guild's surveyor at Lantern
   Watch. The Guild's three skills were #18's, and the hall said nothing of teaching them: they are
   taught at its menu since #813 and #857, for 1,000 gold each once the first task is done, and
   Ysolde's words still say nothing of them.

Decided by delegate for #182, each the owner's to overturn:

1. **The Keel is the hall by a small systems change** (#417): a person with a room may carry `hall`,
   so the tavern keeps the talk of the room and adds the Compact's work. DESIGN §8 wants a hall that
   does not look like one, and a shop would need stock invented for it; the Map Room, which sells
   what a surveyor takes out, is a shop (#181's 1).
2. **The half fare is `Passage.half`** (#417), the fare halved and rounded down once it holds, with
   `free` above it. Both of Kitto's passages carry it, Saltmouth's and the way back from E6, which
   reaches into Wrackholm's lane as #177 did; it turns on the first task's done flag, which marks
   membership exactly, and Kitto alone says so.
3. **The first task is the clerk's cask past the customs house door:** the cask is given only once
   the run is taken and the door's event shows only while it is carried, so the run cannot be done
   early and has no early words. The cask is priced at nothing, so no shop buys it away.
4. **The first rank's two are the crews' crate on C6's quay and the lookout on E6's west cliff:**
   both deal with the Hand's crews and who watches the port, not the founder; the crews and the
   bargemen respawn, so no `slain` deed, and C5's drowned barge is its box's secret.
5. **Ruan is named and stands in the Keel; the hermit's letter is #192's,** which builds 26 end to
   end, the hermit's giving of it and Ruan's hand-in: a hand-in here alone would name an item no one
   can find, and F6 is #410's to edit now. The founder's seal is not taken at Runner, which would
   tell the reveal early; it is left to the rank that reveals (#22, Phase 4).
6. **The cellar way is a second secret, down only:** a rank shuts no way on the map (DESIGN §8) and
   any `needFlag` is a story lock Act II does not spend, so the way is open to anyone who finds it.
   It comes out on the sand by the rope, not on the flight, so C6's stair and cache still need C6's
   own secret, and no one leaving by it is stranded (changed on review).
7. **The Compact pays 160 xp a member and 280 gold** across its three quests, the first task 20 a
   member, so that with the Cartographers' 140 the two halls come to Saltmouth's 300 (§8), the area
   being some 19% over its curve (changed on review).

Decided by delegate for #451, each the owner's to overturn:

1. **It is the Drowned Man again, `temple_drowned`, with a sprite kind of its own:** MONSTERS §6.1
   brings the Drowned Man back in the temples, and the name is the return. It shares a name with the
   Foreland's `drowned`, which does no harm: they stand at 3 and 11 and never meet, and nothing keys
   on a name.
2. **A brute at 11 on #409's line:** 219 hit points, armour 15, +8, 3d8+3, speed 8, 867 xp, and no
   condition. The line's brute carries none, and the choir's chanters already put the front row to
   sleep; a disease would add a cost #175's gate has not measured. The Foreland's keeps its own.
3. **Size 1.15, tint #788672:** heavier than the chanters behind it and level with the Choirmaster,
   under the ogre and clear of every label limit; a pale grey-olive, apart from the Foreland's teal
   and the chanters' blue-grey, in the same dead green.
4. **Gold 0 to 15 and no drop,** as the chanter: the temple's dead pay alike, and its treasure is
   the god's silver in the sacristy, not to be spent early.
5. **The drawing is a ballast stone hugged to the belly,** roped to its own neck, the knot hung with
   one scallop of the god's bronze; the head bowed chin to chest, no hood; planted wide and squared;
   salt and barnacles where the Foreland's has weed. The stone is what tells it apart, from the
   Foreland's slack hang and from the chanters' robes, at a glance.
6. **It stands unplaced, owed to #175,** which puts it in the nave and two in the choir's front row.

Decided by delegate for #175, each the owner's to overturn:

1. **Two levels, the upper temple flooded and the choir dry:** `drowned_temples`, the narthex, the
   nave and its four chapels, the north-west sunk in deep water and the south-west flooded shallow,
   with nothing anyone needs standing in water; and `drowned_temples2`, the choir. Each level's way
   in is the square a company lands on, as Kelp Hole's are, and B6's dry door lands it at the
   narthex.
2. **The sacristy is cut off from the chancel by deep water,** the priests' pool, which nobody
   crosses, so the god's silver is had only down the far roof's wet stair, and a company that comes
   in that way leaves the same way. From the sacristy it sees the Choirmaster's back across the
   water. Neither level has a secret door of its own: B6's is the secret.
3. **The Choirmaster stands alone,** level 12, past MONSTERS §4.4's boss line in its hit points and
   its blows: 825 hit points (680 until #806), armour 20, +11, 11d8+15, speed 13, and paid as 6 says.
   It casts Bless whenever its group is not blessed, so alone it blesses itself; with two chanters
   behind it, the group's mean level was 11.3 and the curve asks the hardest group of a band 11–12
   map to stand at 12. It is won 48% of the time at 11 and 98% at 13.
4. **The choir is MONSTERS' cut to the share,** two chanters behind two drowned men, the front
   row still asleep while the chanters count, with a drowned man alone at the stair's foot, both
   back after two days until the Choirmaster falls, when the choir stops for good. The west bay's
   two chanters were dropped with the pay (6). The lone drowned man is no real fight alone; he
   keeps the level's day at 7.5 fights to a rest. MONSTERS' full four chanters would pay about 190
   more a member, a clear about 1,770.
5. **The upper level's far group is two bull toads,** come in with the fen through the sunk
   chapels, and its nave holds two drowned men: every temple dead is 11, and the curve asks the
   levels to rise from the way in to a group at 12. Three drowned men with the toads measured 5.6
   fights to a rest; two measure 7.2.
6. **The Choirmaster is paid as a fight, not as the boss line** (the owner agreed to bring the
   temples towards their share). Its xp is 1,565 against the line's 7,573, so it pays about 300 a
   member at 11, what any fight there costs (§8). At the line's figure the boss alone paid about
   1,450, nearly the whole share. Levelling it down to 11 would leave level 2 with no group at 12,
   which the curve asks of a map banded 11–12, so it keeps its level and its stats, and the gate
   still judges it at 48% at 11 and 98% at 13; only its pay changes. With the choir cut and the
   west bay's chanters dropped (4), a clear pays about 1,580 a member at 11 and 1,220 at 12. It was
   about 3,115 at 11 before.
7. **The Tide Bell drops from the Choirmaster,** and the priestess at the dry door asks for it at
   her first meeting and takes it at the first meeting from a company she never asked, paying 300
   gold; she rings it inside the door, ten strokes and the eleventh late, and it hangs on the
   narthex's frame after. **The blessing is a shrine on the frame** (#554, decided by delegate and
   the owner's to overturn), `dt1_bell` on its square in the narthex, there once the bell hangs (`after` `q_tide_bell_done`)
   and not before: kneeling gives a point of Endurance to each of the company, once. Endurance is the
   Tidefolk's own, and the area's shrines already give Personality twice. The priestess gives it as
   she gives the bell, by hanging it, and stays at her door. The quest is still done at the hand-in,
   the blessing found after. **It keeps the cold off too, until the next rest** (#555, decided by
   delegate and the owner's to overturn): cold, the sea god's own, comes with the point and does not
   replace it, since the point is the Tidefolk's and a resistance kept to a rest is too small to be
   the whole gift. It is #56's once-only resistance read as one that is spent: kept for good, the
   whole company would halve cold at 12, the Holy Symbol from the same temples would be worth nothing
   and Rimewater would be blunted two acts early, and a resistance for good is the Lamplighter's, at
   the cap. The shrine's text says the cold goes in and stays.
8. **The finds:** the ladder's Morning Star +1 and Ironshod Staff +1 in the vestry behind the boss,
   since the ladder's step should not hang on a secret found from another map; the god's silver,
   a Silver Mace +1 on the morning star's base and the Holy Symbol of the Tide, in the sacristy.
   The Symbol resists cold (#555): it has no slot, so whoever carries it in their pack takes half
   from cold, and their sheet says so.
9. **The god is named on its silver alone,** *Tijsjonger*, the tide singer, read on the Symbol's
   rim and spoken by nobody (§10).
10. **B6's two events move or change:** `b6_stair` moves onto the secret door's square, since an
    event on an exit is never shown, and says the door stands open below; it and the stair's head,
    the stair's foot, the chancel, the pool and the sacristy each have a quiet twin once the count
    has stopped.

Decided by delegate for #180, each the owner's to overturn:

1. **The chapter begins when the Foreland and the Grove are both done, or on a word that names the
   Stone:** Wytske's at Rietum or Kitto's at Saltmouth, for a company there early. Arriving, the
   plinth and the priestess begin nothing, as a thing found begins neither the Grove nor the Wall;
   their entries are written once it begins. A condition holds one `seen`, so the two chapters'
   ends are joined twice, each with a flag standing for the other's event (Senara's `q_treaty`, the
   keeper's `q_keeper`). A company that met the keeper and never opened his log is told of the
   Delta once the Grove is done. Starting on the hand-ins alone overtook the Foreland's Crowness
   goal and broke Thornmark's early run.
2. **Its end is `q_tide_home`,** the Tide Stone's own restored flag (`src/content/stones.ts`),
   owed to #191 in UNSET, so the goal stays open until Wrackholm's chapter sets the Stone back. The
   chapter writes no entry for the Stone home: those are Wrackholm's chapter's words.
3. **The news of Hale is a Warden by Saltmouth's gate, and an entry, not a step:** he sits there
   once `q_hale_taken` holds (#156) and goes once Hale is freed (`q_hale_freed`), so the news is
   never told before it is true or after it is stale. Keyed to `q_hale_taken` alone it would be
   written at the Edge's foot, where #156 sets it, with nobody saying it. No goal waits on him.
4. **Kitto names the ship,** as he already sells the boat: a line on the midsummer barge that never
   tied up and went out to a ship off Wrackholm, in each of his three greetings, each setting
   `sm_ship_word`, so a company with Hessel's word or the Keel's half fare hears it too. STORY puts
   the boat in a harbour tavern, but the Keel's words are kept clear of the Compact.
5. **Saltmouth first, the plinth comes before the boat,** a goal and not a lock, as the Wall sends
   a company down the Sunder before its Watch: the boat sails for the fare whenever.
6. **The walkthrough's third level is played, not given:** no map of Saltreach is floored at 12,
   so the curve gives 10 and 11 in order, and the Saltmouth-first run is played at 12 by hand, as
   Sunderwood's Watch-first run is at 16.

Decided by delegate for #183, each the owner's to overturn:

1. **Main's people keep their names; the issue's become them.** Brannoc is the priest at the
   sluice, Nessa is Nynke at her window, Jago is Hessel, Morwen is the priestess at the dry door and
   Idony is Hiske. The two priests stay unnamed, called by their place as the god is by its office
   (§10). Elowen is Geeske, a fen passenger, Frisian as the Tidefolk are; Tobin, a river bargeman
   from upriver, keeps his English name.
2. **The night-light is green glass, as main has it, and an item of its own,** `night_light`, priced
   at nothing. In kind it is a Brine Shard (#171's 4), but a hand-in cannot tell one Brine Shard from
   another, and C4's or C5's would be taken in its place. No word says the plinth takes it (#173's
   3).
3. **The priest asks and Nynke puts the choice once he has.** His first meeting sets
   `q_nightlight` and keeps the pole-mark line. Her first meeting stays the hint, and her quest words
   keep the stone of the quay that shines back. The light goes to the priest for 100 gold or to
   Tobin for 250, each at the first meeting. Nobody needs early words, since only her choice hands it
   over.
4. **Tobin stands on the diep's north bank at 9,11,** always there until he buys it, then gone, and
   the berth has an event. His barge is the river crews', not the Compact's (call 4), and he names no
   master.
5. **The brinelings and the water's glow go once the light leaves her window,** `until`
   `q_nightlight_taken` or the Stone home, not only once it is sold or given (#172's 8 paid). Kept,
   they come until the Stone is home. The hint stays the scrubbed stone, always there.
6. **The Stone home puts the light out:** Nynke says so, and a quest asked and never answered is done
   with it, the log saying only what is true on every path.
7. **The Tide Bell gains one line,** for the Stone home once the bell hangs, and her hand-in's
   after-line, the Stone away, asks for it. Words would outrank that after-line, so it stays one. Her
   first meeting and the count with the Stone home are #191's sweep.
8. **Three pull requests, in order:** 21 with the bell's lines; 22; 24.

Decided by delegate for #179, each the owner's to overturn:

1. **B3 is laid in the Upper Water and B4 in the Delta,** each named for its zone: row 3 is the
   Upper Water's (C3) and row 4 the Delta's (C4), as #171's 1 has it, so the crossing line falls at
   the B3/B4 seam as at C3/C4's. B4's marsh meets B5's and its broad water C4's, both the Delta's.
2. **B3 carries C3's diep west along row 12 to the Long Water,** deep water one square wide under
   pollards, so C3's sluice line reads true, and a plank bridge at 25,12 crosses it, a road square
   over deep water.
3. **The willows' quay is at the diep's mouth on B3,** where the barges lie up for Rietum's sluice,
   with a boathouse behind. Auke stays at C3 (#172's 4): the quay gives DESIGN §5's line a place,
   and its wording stays the owner's.
4. **The quay's crew is a fight and always there:** a master, three bargemen and two herons in
   their back rank, as C4's barge has, back after two days. A master and three or four bargemen ran
   7.6 to 8.0 fights to a rest, off the aim, since a crew that breaks when its master falls is short
   whatever its number; the herons bring it to 7.1 (changed on measuring).
5. **The heronry is on B4, in the willows' last stand at the water's head,** a den (#88) that
   breeds grey herons: herons nest where they fish, and the broad water and C4's backwater are
   their fishing.
6. **Its keepers are five herons on the nests and its brood three on the grass by the water.** The
   roster has no old heron and none may be drawn here (the creatures' lane), so the keepers are the
   same bird in greater number, the camp's harder fight. Four ran B4 at 7.6 fights to a rest; five
   bring it to 7.1 (changed on measuring).
7. **Each box's hardest group is a bull toad alone,** in B3's carr past the ford and at B4's fen
   end, each the farthest from its way in: neither the keepers nor the crew reaches the 11 the
   curve asks, and this is C3's, C4's and C5's precedent (#172's 7).
8. **The willows are built at about 1,345 a member at 10 against their 800,** and §8 says so: a den
   needs its keepers and a brood and each map its toad, which is four fights before the quay's.
   Fights to a rest is the gate and a share a proposal (#176's 3), and behind the road a company
   that comes later is paid less by level.
9. **The secrets are B3's boathouse back room and B4's flood-store in the hill,** each hint on its
   near side and always there, saying only what is seen: the green worn off the boathouse's back
   wall at a hand's height, and the martins nesting where the hill's facing is laid looser.
10. **The finds are gold, draughts and an earlier act's piece with a plus:** a Brigandine +1 in the
    boathouse, a War Hammer +1 in the store and a Spear +1 in the heronry's hoard. Every rung-13
    plus is placed already (#399's 3), and none of these comes near the window or the ladder. Their
    gold meets the curve's, which #153 owed.
11. **The wilderness features are few:** on B3 a shrine at the bend (intellect), a cairn on the
    hill and Hiltje in the withy beds with a rumour; on B4 the statue on the hill's crown (might)
    and a cairn in the fen. No shrine of the area gave intellect or might. No camp, since C3's loft
    and C4's carters' camp are a box away, and no sign.
12. **The statue's answer is the god's name, *tijsjonger*,** which only the Holy Symbol's rim says
    (#175's 9): the statue asks for it and never says it, so §10's "on its silver alone" holds, and
    a company that has been to the sacristy has a reason to walk back. Hiltje says the name was cut
    off and her grandmother would not say it.
13. **C4's ford is carried into B4,** sand across the broad water's foot on row 22, and each box's
    river has a ford of its own, B4's under the heronry and B3's below the quay, since the river's
    shallows otherwise take a swimmer.
14. **The river comes out of the rim's hills at B3's corner:** the atlas's river meets the box under
    the rim's mountain, where no square can be water to the west and land to the north, so the
    corner is mountain two squares deep and the river starts at 1,2.
15. **The willows hold no step and no quest,** none of the side quests and no guild task; the
    Cartographers' quests of ranks 2 and 3 are the owner's to file, and may point here.
16. **The flood-store is faced in stone, drawn as building squares round its door,** so B4 has wall
    faces enough to dress no more than half of them.

Decided by delegate for #582, each the owner's to overturn:

1. **The plinth is two `once` events on 8,14, held apart by the Grove Stone.** `b5_plinth` keeps its
   line as it was and is held `after` `{ seen: 'grove2:g2_stone' }`; a new `b5_plinth_first` is held
   `until` it, with the same words without the last sentence. The ruling is the issue's own. Ids are
   added and never renamed (EXPANSION §5.5), so the old id keeps the old line.
2. **The condition is one constant in the map, written the same in both events,** which is how the
   pillars check knows the two texts are never said together (`until` X against `after` X).
3. **The chapter takes either reading as the plinth seen,** which the issue does not name. Its
   `plinth` entry and the two goals that wait on the plinth were keyed on `b5_plinth` alone, so a
   company that read the short line would have had the step unwritten and the goal stuck. It is
   Saltreach's own quest, in the lane; the change cannot stand without it.
4. **A company that read the short line and later stands at the Grove Stone is told the cut the next
   time it steps on the plinth,** since `b5_plinth` is `once` and unspent for it. That is the shape
   the issue gives, and the one place the two meet for a company that came by Saltmouth first. A
   second `until` on `b5_plinth` would leave it never told.
5. **A save that read the plinth before this reads the short line on its next step there,** if it
   has not stood at the Grove Stone: `b5_plinth_first` is new to it. Said once, and nothing moves.
6. **The walkthrough holds the words to the letter,** as strings of its own, not read back from the
   map. The plinth step it shares with Sunderwood's seeded runs reads the cut to a company that has
   stood at the Grove Stone and the short line to one that has not, since those runs play it with no
   Grove Stone stood at. In order the company reads the cut; with Saltmouth first and in the area
   walk, the short line; `thePlinth` plays the late company and the early one.

Decided by delegate for #806, each the owner's to overturn:

1. **The Choirmaster is set again at 825 hit points, its blow kept at 11d8+15** (680 hit points
   before), by hearth_isle.md §7's method: tries of hit points and blow on the gate's seeds. #175's
   gate set it against a company without its first prestige, 48% at 11 and 98% at 13; the gate's
   company has taken the prestige since #541, and won it 94% at 11, past the limit of 80%. The aim
   is about half at the floor (30% to 70%) and nearly always two above (90%). The tries, in percent
   of the gate's 400 seeds and of its own hundred, a fight broken off being one still running at the
   fifteenth round, which the gate does not count won:

   | Hit points | Blow | At 11 | Broken off | At 13 | The gate's hundred, 11 and 13 |
   |---|---|---|---|---|---|
   | 680 (before) | 11d8+15 | 94 | 0 | 100 | 94 and 100 |
   | 760 | 11d8+15 | 79 | 1 | 100 | 74 and 100 |
   | 800 | 11d8+15 | 65 | 1 | 100 | 58 and 100 |
   | **825 (kept)** | **11d8+15** | **54** | **3** | **99** | **48 and 100** |
   | 860 | 11d8+15 | 41 | 4 | 98 | 37 and 98 |
   | 900 | 11d8+15 | 31 | 6 | 95 | 26 and 96 |
   | 760 | 14d8+20 | 61 | 1 | 98 | 66 and 99 |

   825 is inside the aim at both levels, on the hundred and on the 400.
2. **Hit points alone,** since 3 fights in 100 are broken off at 825: a company that loses to the
   Choirmaster is beaten by it and not by the clock. The rule for the four Act II bosses (wrackholm.md
   and sunderwood.md §9 hold the others): raise the hit points till the floor reads about half, and
   where more than one fight in ten is then broken off, raise the blow and lower the hit points till
   it is not. A boss that the clock beats asks a company for time and not for lives.
3. **The temples' floor is 82.7% with the boss among its three groups,** 98% before: the verger and
   the choir are won every time and the boss 48%, so the map's fights pool at (100 + 100 + 48) / 3.
   That is off the aim of 90% and inside the limit of 80%, as the choir's 83% was when #175 set the
   boss, and the check lists it. The map's limit binds the boss from below: it must be won 40% or
   more at 11 for the map to hold it.
4. **The `OWED` line for the Choirmaster goes,** and the reason `OFF_LINE` gives for it
   (`tools/tests/harness.ts`) names this issue. Level, xp, gold, drops, id and the group stay, so the
   curve and `src/content/shipped.json` do not move.

Decided by the builder for #860, each the owner's to overturn:

1. **The shop takes the room and Pender stays on its square.** A business carries the room
   (`interior`) and a person after it with none keeps their words and, for Pender, `teaches`, which
   the shop's first menu reaches as "Talk to Pender the locksmith", as the Map Room reaches Ysolde.
   The issue's "as the armourer keeps his" is read so: Saltmouth's armourer teaches nothing, and
   Ysolde and Ruan are the precedent.
2. **One line of his words changes:** "I don't sell picks. I have not yet met anyone I would sell
   them to" becomes "Picks too, now. I have met someone I would sell them to". He sells what he said
   he never would, in his own few words, and neither the price nor what the picks do is told. The
   other two lines and the room stand.
3. **The ids and names are `set_of_picks`, "Set of Picks", `guild_chart`, "Guild Chart" and the
   shop's "Pender's Locks".** Each ware's name is twelve glyphs at most, so that the Sell list's row
   with a member of ten letters (name, member and price) fits the panel as the Buy list's does; the
   walkthrough measures both.
4. **Each reads from the pack,** a line of what it looks like (`text`, as the Holy Symbol of the
   Tide has), so that Space on one says what is in the hand and not "nothing to do with it here".
   Neither line says what the thing does: that is found.
5. **The chart sits last in the Map Room's stock,** beside its stores, at 400; the picks are
   Pender's only ware, at 750. Both are slotless, off the ladder (no `GEAR` row) and inside the
   2,000 window, and a shop buys either back at half, 375 and 200 (two thirds to a Merchant). No
   figure moves: the gate's company buys nothing here and holds no skill.
6. **The walkthrough buys them in a company of its own,** given the gold directly (the road has paid
   it nothing by here, and the armourer's step is bought on gold set by hand), so that a chart or a
   set of picks carried touches none of the walk's later steps. The picks are tried on #857's fixture
   shape, a locked chest under a company with its thief down (the thief is born to Lockpick), since
   Saltreach holds no locked chest; the chart in #857's dungeon hall, where it maps two squares west
   in place of one.

Decided by the owner's delegate for #892, each the owner's to overturn:

1. **Pender's room is a shop with Pender after it: stands** (the builder's 1). Ysolde at the Map
   Room and Ruan at the Keel are the precedent; the picks are his only ware and his teaching is the
   second entry of a two-entry menu, "Talk to Pender the locksmith". The pilot takes the Thief's
   first sooner (tick 26 where it was 71, at 5,000 gold, #880), a report and not a gate
   (docs/PILOT.md). Teaching first would need a person's room to offer a shop, which
   `businessEntries` cannot list today: a systems pull request, then a Saltreach one for the order
   of two rows.

Decided by the builder for #830, each the owner's to overturn:

1. **The bounds' brief is §12,** after §11, in §4's form, for all eight boxes; the boxes come in four
   pull requests, C2 and B2 first, then A3 and A4, A5 and A6, B7 and D6, then the enclave and the lair
   (the delegate's order on #828).
2. **C2 is the Upper Water's, whole,** the Downs' 214 walkable squares on the Edge's top with it:
   open to D2, where the crossing line names the Upper Water and warns a company under 8. No group
   stands there and nothing there pays, so the Foreland's company meets only the view.
3. **Kestrel Edge's face is mountain in C2,** as in C3, and the Scarp will be in B7, as in C7: the
   cliff is the Whitespine's novelty, which the pillars check refuses on a box before it.
4. **B7's ground above the Scarp is closed with it,** as C7 closed its own: B8's north edge is the
   cliff and C7's west edge the void there, so nothing built walks onto it.
5. **A7 stays cut,** with A2 and C1: A6's south edge and B7's west edge stand closed against it. Its
   224 squares are reached from no built box, and building it would widen the issue.
6. **The valley's hardest differ from box to box,** as far as the roster allows (§12.1): a bull toad
   and a fen toad come up to spawn at C2's tarn, as Jelle tells it, and a bull toad and an eel come up
   the Long Water to B2's mire. A lone bull toad paces a company of 10 at about 8.9 fights to a rest
   against an aim of 7.5; each pair, the toad with one at 10, at 5.6 to 5.8.
7. **The watch is the Hand's barge crew** at a fire on the crest, the roster's people: the area has
   no hill folk to place, and the watch on the river ties the valley to the Stone's barge without
   saying more.
8. **The finds are a Long Axe +1 and a Sharkskin Coat +1,** at 900 and 1,250, inside the 2,000
   window. The first builder's Great Sword +1 (2d6+2) and Long Bow +1 (1d8+2) were weaker than the
   Long Axe (2d6+4) and the Horn Bow (1d12+4) that Saltmouth's armoury sells, and the owner's delegate
   rules that no find is worse than the area's nearest shop sells for its slot. The Long Axe +1 betters
   the shop's for C2's slot, the Hand's as the Tide Ship's is; no bow betters the Horn Bow but its +1,
   which the pans give, so B2 takes the coat, the one plus of Saltmouth's step no box gave. Neither is
   given elsewhere in Saltreach.
9. **The walkthrough walks the bounds in one function,** `theBounds`, called last, so each later box
   adds its steps there. No edge pins go into `tools/tests/outdoors.ts`, which holds none for
   Saltreach's boxes: the walkthrough walks each seam the boxes open instead.
10. **Two test fixtures move off B2's land** to C10's steppe in the Glass, the reach, which stays
    unbuilt: the edge fixture in `tools/tests/pillars.ts` and the hills fixture in
    `tools/tests/atlas.ts`, each of which says a map built on it moves it.
11. **The lair's door is on A5 and the enclave's on B7** (§12.10), as the owner's delegate moved them
    on 18 October: #846's design (#908) puts Saltreach's lair in a drowned mound on the fen's west edge
    under the rim, which fits the fen and its rumour's words, and B7's Scarp's foot has room for the
    enclave's door among its 944 squares. #845 and #846 settle what they hold.
12. **The six to come give gold, draughts and elixirs,** no gear: with C2's and B2's finds the
    ladder's pluses at 13 are all given in Act II, and the one Saltreach lacks, Plate Mail +1, is
    Wrackholm's. Their groups as planned pay about 2,600 xp a member against the first reckoning's
    2,200; A6 and B7 build a group fewer if the lead asks it (§12.1).
13. **D6 starts on the spit,** where D5 opens onto it, with its group and its secret there, since the
    hint check walks from a map's start; the shore under the town is walked onto from C6.
14. **A3 meets B3 as B3 is built:** its north-east corner is the rim where B3's ring closes the
    river's way, so the atlas's two squares of shallows at A3's 31,0 and 31,1 are mountain, and its
    31,25 a willow against B3's trees. The shallows are seen up the line of the willows, as §12.4 has
    them, and reached by no one. A4's 23,0 is mountain against A3's.
15. **A4's south edge is shut against A5** with the rim's mountain, a little thicker in places, but
    for its corner: 31,31 is marsh, as B4's 0,31 beside it is, so the seam with B4 agrees square for
    square, as the rule for the seams asks of a box built since it (EXPANSION §5.1). That square is
    the one of A4's open onto unbuilt land; A5 meets it with marsh at its 31,0, as B5's west edge
    asks, and the rest of A4's south edge with mountain (§12.6).
16. **A4's camp stands clear of its groups,** eight squares from the herons and nine from the toad,
    walked or counted, on the dry ground at the fen's edge rather than in its corner: no group keeps
    it, and rest at a camp is refused only with a group next to the party, so a company rests there
    while they stand, and the walkthrough says so. §12.1 and §12.5 say the same.
17. **What is left open:** after A3 and A4, 164 squares of Saltreach's built boxes are open onto
    unbuilt land, where there were 201: A4's south-east corner (1) and B5's west edge (32) onto A5,
    B6's west (32) onto A6 and its south (32) onto B7, C7's west (23) onto B7, C6's east (19) and
    D5's south (6) onto D6, which the next two pull requests close;
    and C7's east (19) onto D7, the Wold's box, where the Glasswold's lair has its way in
    (docs/areas/glasswold.md), which §12 does not build. That edge is shut when D7 is built or C7's
    edge is closed.
18. **A5's pools hold four leeches and an eel,** one leech more than the brief's three, a choice and
    not a need. With three, the plain company two under the floor paced 4.39 fights to a rest, 67.5%
    of the floor's 6.5: over the aim of 66.7% and inside the limit of 100%, which the gate allows.
    With four it paces 3.93, 60.5%, and the floor's own figure is 6.84 against the aim's 7.5. The
    fourth leech pays 65 xp a member more (485 against 419), and A5 stands 35 over the brief's about
    450. §12.6 says so.
19. **The drowned mound is drawn and left bare:** a rise of hills 3 by 3 at 25–27,22–24 in the
    marsh, its crown at 26,23, a ring of water round its north, east and south and its west open to
    a way along row 23 from the gap in the dyke at 20,23. No feature or group stands on it, on the
    way or about it, so the lair's pull request puts its door on the crown and moves nothing, and
    the walkthrough walks to the crown. The atlas has marsh there and the mound touches no edge.
20. **The two blocks have shapes of their own:** A5's sluice-house is 6 wide and 3 deep across the
    dyke at 16–21,14–16, a corridor of four squares behind its door at 21,15 on the fen's side; A6's
    cell is 4 by 4 against the rim's foot at 15–18,8–11, a floor of two by two behind its door at
    18,10. C2's cleft and B2's hut are 3 by 3, A3's well-house 4 by 3 and A4's still 3 by 5. Both
    hints stand on open ground at the door, as A4's does: the clear water at 22,15, with four
    squares of shallows drawn running out of the dyke's foot into the marsh, and the slit at 19,10.
21. **A6's south-east corner is the rim's mountain, and so is B6's 0,31 beside it,** as the owner's
    delegate rules on the review: the two agree square for square and A6's south edge is shut
    against A7, which stays cut (decision 5), with no row of `OPEN_ON_NOTHING` holding a square of
    it. B6's 0,31 is a dead-end square with nothing on it, its neighbours 0,30 and 1,31 joined still
    through 1,30; the pull request takes square 0 out of the row for `delta_b6 south`. A saved
    company standing on it loads onto the void and steps off. B7's 0,0 beside both is the same
    corner, and its pull request draws it to match (§12.8).
22. **The priest of stone's riddle is answered "tide":** TWICE A DAY IT TAKES THE SHORE AND GIVES IT
    BACK, AND IT IS NEVER LATE. It gives 70 gold to the purse and a point of luck to each member.
    The bell heard at 28,4 stops when the Choirmaster falls, as the count it is does, and the
    Stone's coming home keeps it stopped (`until` the temples' own flags, as B6's stair).
23. **Both camps stand clear of both groups,** as A4's does (decision 16): the wildfowlers' hide at
    19,3 is 12 squares from the pools and 31 from the toad, the pilgrims' hearth at 20,24 is 13 from
    the drowned men and 9 from the toads. No group keeps them, and a company rests there while the
    groups stand.
24. **The lead holds without a trim:** with A5 and A6 a clear gives 12,791 xp a member and the lead
    stands at 12.733, against the limit of 13.0 (#634). B7 and D6 as planned, 600 and 300, would
    bring it to about 12.87, so A6's pay stays at the brief's and B7 is the one to trim if it nears
    the limit.
25. **What is left open:** after A5 and A6, 98 squares of Saltreach's built boxes are open onto
    unbuilt land, where there were 164: B6's south edge (31) and C7's west edge (23) onto B7; D5's
    south edge (6) and C6's east edge (19) onto D6; C7's east edge (19) onto D7, the Wold's box,
    which §12 does not build (decision 17). A4's corner, B5's west edge and B6's west edge are
    answered, and A6's south-east corner is shut with B6's 0,31 (decision 21).
26. **B7's edges and corners are worked out from the built letters:** its north edge is B6's south
    edge (the rim's mountain at 0, marsh 1 to 31), its east edge C7's west edge (marsh 0 to 12,
    grass 13 to 22, the mountain 23 to 31) and its south edge the mountain against B8's north edge
    (the mountain at 0 and 1, the cliff from 2); its west edge is the rim's mountain against A7,
    which stays cut. The corners: 0,0 the rim's mountain, with B6's 0,31 and A6's 31,31 as decision
    21 rules; 31,0 marsh, as B6's 31,31, C7's 0,0 and C6's 0,31 are; 0,31 and 31,31 the mountain,
    as B8's 0,0 and C7's 0,31 are, B8's 31,0 being cliff. No row of `SEAMS_AS_BUILT` is added, and
    none of `OPEN_ON_NOTHING` for B7: no square of its west or south edge is open.
27. **The Scarp is mountain the whole of B7's south, and the Glasswold's ground above it with it:**
    the cliff's line, from 0,18 to 31,23, is drawn as mountain as C7's is (decision 3) and every
    square under it, with the rim's two columns on the west, so no walker comes onto the Wold's 219
    squares and none of the box's 614 squares to stand on lies under row 23. A climber crosses the
    mountain there as everywhere between two areas the Scarp stair joins (the seam rule asks no
    row), and the walkthrough measures the edge to a walker.
28. **The enclave's door is left at the Scarp's foot at 22,22,** the first mountain square under the
    grass at 22,21, its way the grass of row 21 from 20 to 31, and nothing stands within four
    squares of it: the salt-carter at 22,16 and the track's end at 23,16 are the nearest, the
    smugglers' fire at 15,20 nine squares off. The enclave's pull request (#845) draws the door
    there and moves nothing; the walkthrough walks the way and measures the clearance.
29. **B7's groups are the brief's, kept to their ground:** three salt crabs on the grass at 20,13,
    the nearest at 14 steps and level 11, and the Hand's smugglers as C6 holds them by night, two
    smugglers and two bowmen in the back rank, at their fire under the Scarp at 15,20, here at every
    hour, the farthest and the hardest at 20 steps and level 12. Neither roams, so the halt at
    14,13, six squares from the crabs and eight from the fire, is clear of both (decision 23). The
    gate holds at 11, at 7.41 fights to a rest against an aim of 5.75 to 7.75.
30. **D6's group is the brief's two bull toads,** and no other make-up serves: the curve's rise rule
    asks the hardest group's mean level at 12 in a box of 11 to 12, which only bull toads and the
    smugglers (B7's) reach, and a lone toad paces about 20 fights to a rest at 11 against a limit of
    10.25. They lie on the spit at 12,2, kept to it, 4 steps from the way in, as A6's pair lie at
    its south end; the gate holds at 11, at 5.76 fights to a rest against an aim of 5.75 to 7.75.
31. **D6 is three pieces of land,** as the atlas has it: the spit at the top (22 squares and the
    store's 6), the shore under the town (36) down the west and the shore's south end (19), each
    walked onto from its own side and none from another, so the map starts on the spit where D5
    opens onto it (decision 13) and each piece has a point of interest of its own, the density
    check walking from every point. Its edges are worked out from the built letters: the north edge
    is D5's south edge; the west edge is C6's east edge, with the warehouse's wall carried on at 0,9
    and 0,10, tidal ground at 0,7, 0,20 and 0,25 to 28 and salt at 0,29 to 31; the east edge is the
    sea against E6's west edge. The south edge is open at 0 (salt) and 1 (tidal ground) onto D7,
    which stays unbuilt, so it has a row of `OPEN_ON_NOTHING`; square 1 is tidal ground, not
    shallows, because the pillars check carries water on into the atlas past an edge and D7's
    atlas is tidal there.
32. **The two secrets have shapes of their own:** B7's bothy is an L of walls 6 wide and 4 deep in
    the Scarp's foot at 5–10,16–19, a short arm behind its door at 9,16 and a long arm of four
    squares along the foot to the strongbox at 6,18; D6's footing is a round of black stone 5 by 5
    at 9–13,4–8, a floor of five squares in the shape of a plus behind its door at its north tip,
    11,4, the keeper's chest at 11,7. C2's cleft and B2's hut are 3 by 3, A3's well-house 4 by 3,
    A4's still 3 by 5, A5's sluice-house 6 by 3 and A6's cell 4 by 4. Both hints stand on open
    ground at the door: the fan of dead white grass, nine squares of salt spreading north from its
    point at 9,15, and the spit's end at 11,3, where each wave booms under the footing.
33. **B7's shrine gives a point of accuracy:** every stat is given by a shrine of the area already,
    accuracy only by C4's. The cairns give 75 gold (B7) and 60 (D6) and a draught each, and the
    finds are the brief's, 250 gold and an elixir in the bothy and 150 gold and a draught in the
    keeper's chest; none repeats a find the area gives or is weaker than the shop's (§12.1).
34. **The lead holds without a trim:** B7 pays about 604 xp a member by the curve's count and 427
    gold, D6 about 315 and 210, 919 in all against the 900 planned; a clear gives 13,711 xp a
    member and 8,410 gold, and the lead goes from 12.733 to 12.910 against the limit of 13.0, with
    0.09 to spare. No group is trimmed.
35. **What is left open:** after B7 and D6, 21 squares of Saltreach's built boxes are open onto
    unbuilt land, where there were 98: C7's east edge (19) and D6's south edge (2) onto D7, the
    Wold's box, which §12 does not build (decision 17). B6's south edge (31), C7's west edge (23),
    C6's east edge (19) and D5's south edge (6) are answered, and B7's west edge, 0,0 with it, is
    shut with no row. The outdoors test reads "169 pairs, 34 of them between two areas, 5400
    squares, 329 of them as built in 62 rows" and "102 edges on nothing, 3248 squares, 675 of them
    open in 42 rows".
36. **A6's step reads B6's 0,31 to a walker now:** the square is the rim's mountain between A6 and
    B7, drawn as the void only while B7 was unbuilt (`layOutdoors` closes a ring's mountain where it
    faces unbuilt land), so the walkthrough's claim that no company climbs it held then and holds
    now for A6's own south edge, which stays void against A7, and for a walker on 0,31. A saved
    company on it stands on a mountain square and steps off north or east, as it would off the void
    (decision 21).

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
  or a cave, *sjong* song, *tel* count, *dyk* dyke, *tij* tide, *sâlt* salt (written *salt*). It
  goes into NAMES §2's row for the Tidefolk.
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
- **The god** is *Tijsjonger*, the tide singer (*tij* tide, *sjonger* singer), a name found only on
  the rim of its Holy Symbol in the temples' sacristy (#175). Nobody speaks it: the Tidefolk say
  *the one who counts* until its Stone is home. *Tij* goes into the tongue's list.
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

The owner brought the most of them back on 17 October 2026, with the rest of the bounds (#828): all
but A2, A7 and C1, as §12 has it.

## 12. The bounds

The land the area's maps lie open to, built as country off the quest, level for level (the owner,
17 October 2026; #828, #830): the rim and the A column, the upper valley, the Scarp's foot and D6's
sliver. Eight boxes, 3,645 squares a company could walk by the atlas, which 244 edge squares of the
Upper Water, the Delta, the Saltings and the Downs open onto. Each box is built to the looser floor
(EXPANSION §5.3) at its zone's band, from the area's roster, paid from its budget (§8), with nothing
on the road's quest. Then the area's enclave and its artifact's lair (§12.10). This is their brief, in
§4's form; each box's pull request builds from it, and adds its "As built".

| Box | Laid in | Walkable | Other land in it | Built neighbours | Band | Pull request |
|---|---|---|---|---|---|---|
| C2 | the Upper Water, `upperwater_c2` | 716 | the Downs' 214 on the Edge's top | C3, D2 (the Downs) | 10–11 | the first, built (#830) |
| B2 | the Upper Water, `upperwater_b2` | 269 | | B3, C2 | 10–11 | the first, built (#830) |
| A3 | the Upper Water, `upperwater_a3` | 49 | | B3 | 10–11 | the second, built (#830) |
| A4 | the Delta, `delta_a4` | 526 | the Upper Water's 318 | B4 | 10–11 | the second, built (#830) |
| A5 | the Delta, `delta_a5` | 589 | | A4, B5 | 10–11 | the third, built (#830) |
| A6 | the Delta, `delta_a6` | 491 | | A5, B6 | 11–12 | the third, built (#830) |
| B7 | the Saltings, `saltings_b7` | 944 | the Delta's 346; the Wold's 219 above the Scarp | B6, C7, B8 (the Wold) | 11–12 | the fourth, built (#830) |
| D6 | the Saltings, `saltings_d6` | 61 | the Delta's 48 | C6, D5, E6 (Wrackholm, across the sea) | 11–12 | the fourth, built (#830) |

### 12.1 What every box keeps

- **A box is its larger zone's, whole** (#830): the zone of most of its squares lays it, its band is
  that zone's and the crossing line (#166) falls at its edges. Where another zone's land in it meets
  that zone's own boxes, the brief says how: C2's top is open to the Downs and named there (§12.2);
  B7's ground above the Scarp is closed with the Scarp, as C7's is (§12.8).
- **Kestrel Edge and the Scarp are drawn as mountain,** as C3 and C7 draw them: the atlas's cliff is
  the Whitespine's to claim (its `novel`), and the pillars check refuses it on a box before it on the
  road.
- **What stays cut:** A2 (the river's source under the rim and no square to walk), C1 (mountain) and
  A7 (the rim's foot and the Wold's top, 224 squares). A6's south edge and B7's west edge stand
  closed against A7 with the rim's mountain, and B6's 0,31 between them (decision 21).
- **Groups** are the roster's (§7), the fewest that pass the gate's pace, none on land a company under
  the band walks onto from another zone. Each box's hardest is at least one over its band's floor (the
  curve's rise rule): 11 in a box of 10–11, 12 in one of 11–12. Only the bull toad reaches 12, and the
  Hand's smugglers that C6 holds by night, so no two boxes take the same hardest where the roster
  allows another: in a box of 10–11 the bull toad goes with one of the four at 10 (a fen toad at C2's
  tarn, an eel in B2's mire, a heron at A3, a leech at A4) or alone beside heavier company (A5); in
  one of 11–12, two bull toads (A6, D6) or the smugglers (B7). By the harness a lone bull toad paces a
  company of 10 at about 8.9 fights to a rest, over the aim's 7.5, and a pair with one at 10 at 5.5 to
  5.8; at 11 a lone one paces about 20 and two about 5.7.
- **A camp stands next to the group that keeps it, or clear of every group,** never two squares off:
  rest at a camp is refused only with a group next to the party (`restRefused`,
  `src/game/wilds.ts`). C2's watch stands beside its fire, and the walkthrough shows the rest
  refused there until it falls; the camps of A4, A5, A6 and B7 are by no group's post and stand
  clear of both, and a company rests there while they stand.
- **Secrets** are each of their own place, with a hint of a different kind and a block of a
  different shape: a walled cleft found from wear (C2), a beehive hut from its wrens (B2), a
  well-house from a rag willow (A3), a still from a smell (A4), a sluice-house from clear water (A5),
  an anchorite's cell from its squint (A6), a salters' bothy from dead grass (B7) and a light's store
  from a sound (D6). Walls, not mountain, keep climbers out.
- **Finds** inside the 2,000 window, none repeating one the area already gives (§4.1) and none weaker
  than what Saltmouth's armoury sells for its slot (the owner's delegate, on #907). C2's Long Axe +1
  and B2's Sharkskin Coat +1 leave no plus of the ladder's at 13 that Saltreach does not give but
  Plate Mail +1, which is Wrackholm's (§4.1), so the six to come give gold, draughts and elixirs; a
  piece of gear among them passes the same test.
- **Pay.** The area's clear stood at 10,343 xp a member before the bounds, and a company entering at
  10 and three quarters clearing it left at 12.4; the curve holds it to 13.0 (`LEAD`). With C2 and
  B2 it leaves at 12.5, with A3 and A4 at 12.6, with A5 and A6 at 12.7 and with B7 and D6 at 12.9, a
  clear giving 13,711 xp a member. The first reckoning gave the six after C2 and B2 about 2,200 xp a
  member between them; A3 and A4 gave about 640 by the curve's count, A5 and A6 about 1,090 and B7
  and D6 about 920 (604 and 315, against the 900 planned), a fight inside the aim costing about 250
  at 10 and 300 at 11 (§8). Each pull request measures the lead, and a box that would carry it past
  13.0 builds a group fewer, and says so; none did, and B7 and D6 leave it at 12.910.
- **The walkthrough** walks them in one function, `theBounds` in `walkthrough.ts`, called last: each
  box's seams walked, its groups won at its floor, its secret found from its hint and its prize shut
  to walkers, swimmers, climbers and levitators.

### 12.2 C2, the upper valley (#830): country, band 10–11

- **Purpose.** The Upper Water's head over Rietum: hill pasture between the rim and Kestrel Edge,
  above Rietum's fields, which C3's north edge opens onto. Off the road and off the quest.
- **Landmarks.** Rietum's top field and the sheep-paths up from it; a crest with the river in sight
  down to Rietum; a tarn in a fold of the hills; the rim's last hill; the Edge's foot. East of the
  face, the Edge's top: the Downs' turf to the lip, a boundary stone.
- **Points of interest,** about seven features and two groups: the stile at the top field; Jelle, a
  shepherd of Rietum, with a rumour of the watch and the toads; the watch's fire, a camp; the tarn; a
  cairn under the rim; on the top, the boundary stone, the lip and a shepherd of the Downs.
- **Encounters.** The Hand's watch beside its fire, a barge master and three bargemen; the toads at
  the tarn, a bull toad and a fen toad, the hardest.
- **The secret and its hint.** A cleft in the Edge's foot walled up with dry stone. The hint: the
  lichen rubbed off the walling in a line.
- **How it meets the Downs.** The top is the Downs' land, laid with the box whole: open to D2 on its
  rows 3 to 31, walked onto from the Downs alone, the face keeping it from the valley on foot. The
  crossing line falls at that seam and names the Upper Water, with its warning to a company under 8.
  No group stands on it and nothing on it pays.
- **New here.** Nothing: the area's roster and features, its third people, the Hand's men off the
  barges, at a fire in the hills.
- **Finds.** A Long Axe +1 in the cleft, the Hand's as the Tide Ship's is.
- **Pay.** About 500 xp a member.
- **As built** (#830, 18 October): `upperwater_c2`, laid at 72,30. North from Rietum's top field at
  8,31 a dirt path climbs to the crest, the watch's fire at 7,22 and the watch next to it at 7,23, a
  master and three bargemen who break when he falls; no company rests at the fire while they stand.
  Jelle stands under the Edge at 20,27: the men off the barges have kept a fire on the crest since
  midsummer, buy a sheep a week in Saltmouth silver and watch the river; the toads come up to the tarn
  to spawn. The tarn lies at 7–12,15–17, a bull toad and a fen toad on its shore, the box's farthest
  and hardest. The shepherds' cairn on the last hill under the rim gives 50 gold and a draught. The
  cleft is a walled block at 16–18,10–12 against the face, its way in at 17,12 and the hint at 17,13;
  inside lie rope, a sack and a lamp of green glass, its shutter turned down the valley, beside a
  chest of 150 gold, a Long Axe +1 and a draught. On the top (214 squares), the boundary stone at
  27,8, a sheaf cut on its east face and a wave on its west; the lip at 25,18, the valley seen from
  it; and Ralf, a shepherd of the Downs, at 29,27, who knows no way down but the Salt Road and has
  seen the smoke on the crest. The gate holds at 10: 6.47 fights to a rest, every fight won; two
  under, 57.8% of the floor's day. Density: every square within 12 steps of a point, the furthest 11.
  By the curve's count the box pays about 490 xp a member and 340 gold.

### 12.3 B2, the valley's head (#830): country, band 10–11

- **Purpose.** Where the upper valley ends under the rim, west of C2 and north of the willows: B3's
  north edge and C2's west edge open onto it.
- **Landmarks.** The rim curving round its north and west; the willows' last grass coming up from
  B3, the trees giving out; a spring at the rim's foot and a mire below it.
- **Points of interest,** about four features and one group: the willows' end; the spring's trough,
  a fountain; a cairn where the valley turns; a beehive hut with no door.
- **Encounters.** A bull toad in the mire and an eel come up the Long Water to its head, the box's
  one fight.
- **The secret and its hint.** The beehive hut's cell under its turf. The hint: wrens going in and
  out low on one side.
- **New here.** Nothing.
- **Finds.** A Sharkskin Coat +1 in the cell, the one piece of Saltmouth's step with a plus that no
  box gave.
- **Pay.** About 250 xp a member.
- **As built** (#830, 18 October): `upperwater_b2`, laid at 40,30, its north and west the rim and the
  world's end. Up out of B3's grass at 24,29 the valley closes in. The spring at 22,13 runs into a
  stone trough with bent pins and old coins on its floor, a fountain of luck; the mire under it at
  22–27,15–16 holds a bull toad and an eel, kept to the mire. The cairn at 28,25 has a sheep's bell
  on a stick and gives 40 gold and a draught. The hut is a walled block at 18–20,19–21, its way in at
  19,21 and the wrens at 19,22; the cell holds a crook, a sharkskin coat in a greased bag and a horn
  of coin: a chest of 100 gold, a Sharkskin Coat +1 and a draught. The gate holds at 10: 5.76
  fights to a rest, every fight won; two under, 44%. Density: every square within 12 steps, the
  furthest 10. By the curve's count the box pays about 220 xp a member and 140 gold.

### 12.4 A3, the rim's foot behind the willows: country, band 10–11

- **Purpose.** To close B3's west edge onto built land: 49 squares of hill and grass in the corner
  under the rim, with the willows' last trees along B3's edge and the rim's mountain behind.
- **Landmarks.** The willows' last trees in a line down B3's edge; the hill corner at their foot,
  where A4's hills come up; the rim behind. At the north-east corner the Long Water's first shallows
  come white out of the rim, seen from the trees and not reached.
- **Points of interest,** three features and one group: the shallows seen from the trees, an event;
  a willow hung with rags, the hint; a cairn in the corner.
- **Encounters.** A bull toad and a heron off the willows, the one group, at 11 for the rise rule:
  about 5.8 fights to a rest at 10.
- **The secret and its hint.** A well-house walled into the rim's foot, where a spring rises under
  the rock, its sill heaped with sea shells carried up the Long Water. The hint: the last willow hung
  with rags, faded, tied on one above another.
- **New here.** Nothing.
- **Finds.** 120 gold among the shells and a draught.
- **Pay.** About 200 xp a member.
- **As built** (#830, 18 October): `upperwater_a3`, laid at 8,62, 51 squares to stand on with the
  well-house's. West out of B3's grass at 0,28 the corner opens under the willows' last trees, which
  stand in a line down its east edge; its north-east corner is the rim, as B3 closes it, so the river
  is seen up the line of the trees from 28,23 and not reached. A bull toad and a heron off the willows
  stand at 28,24, kept to the corner. The cairn at 25,30 gives 30 gold and a draught. The well-house
  is a walled block four wide and three deep at 22–25,26–28 in the rim's foot, its way in at 25,27 in
  its east end, and the rag willow at 26,26 over the hint at 26,27; inside, the spring in its basin
  and the shells on the sill, and a chest of 120 gold and a draught. Its south edge meets A4 on its
  columns 24 to 31. The gate holds at 10: 5.89 fights to a rest, every fight won; two under, 44.9% of
  the floor's day. Density: every square within 12 steps, the furthest 7. By the curve's count the box
  pays about 220 xp a member and 150 gold.

### 12.5 A4, the hills over the heronry: country, band 10–11

- **Purpose.** The rim's foot west of B4: hills under the rim and the fen's north-west corner, B4's
  west edge open onto it along all its rows. The Delta's, whole: the Upper Water's 318 squares in its
  middle rows play at the Delta's band, both zones the area's own and the same band's floor.
- **Landmarks.** The hills under the rim; a dry valley through them, its bed of white stones; the
  fen's north-west corner, marsh to B4's heronry.
- **Points of interest,** about five features and two groups: a statue with a riddle on the hills'
  crest; a shrine at the dry valley's mouth; a cairn; a camp on the dry ground at the fen's edge, by
  no group's post and clear of both; the reek at the valley's head, the hint.
- **Encounters.** Three herons off B4's heronry fishing the fen's corner, the nearest; a bull toad
  and a leech in the corner's pools, the hardest: about 6.8 fights to a rest at 10.
- **The secret and its hint.** A still in a cave at the dry valley's head, where the stream once
  went under the hills, walled up with the valley's stones: a copper worm, kegs and a crock of coin.
  The hint: at the valley's head the air smells of peat smoke and malt, and there is no fire anywhere.
- **New here.** Nothing.
- **Finds.** 200 gold in the crock and an elixir.
- **Pay.** About 450 xp a member.
- **As built** (#830, 18 October): `delta_a4`, laid at 8,94, 502 squares to stand on. In from B4's
  grass, open along every row, and down from A3's corner on its columns 24 to 31, where the line
  names the Delta. The woman of stone on the crest at 24,6 holds an empty pitcher, and her riddle, A
  BED AND A MOUTH, AND IT NEVER SLEEPS, is answered river for 60 gold and a point of intellect; the
  reed-cutters' cairn at 29,10 gives 50 gold and a draught. The dry valley's bed of white stones
  runs back into the hills on row 18 from the grass at 22,18 to the rim's foot at 13,18, the shrine
  at its mouth at 23,19 (a point of speed). Three herons fish the fen's corner at 27,24, the
  nearest, and come back no more once B4's heronry burns; a bull toad and a leech keep its pools at
  27,29, the farthest and the hardest. The reed-cutters' camp is on the dry ground at the fen's edge
  at 21,26, eight squares from the herons and nine from the toad. The still is a walled block three
  wide and five deep at 10–12,16–20 in the rim's foot, its way in at 12,18 in the middle of its long
  side and the reek at 13,18, where the bed ends; inside, the worm, the kegs and the crock, a chest
  of 200 gold and an elixir. The south edge is the rim's mountain but for its corner, marsh as B4's
  beside it is, where A5 meets it. The gate holds at 10: 6.82 fights to a rest, every fight won; two
  under, 56.2%. Density: every square within 12 steps, the furthest 12. By the curve's count the box
  pays about 420 xp a member and 310 gold.

### 12.6 A5, the fen's west shore: country, band 10–11

- **Purpose.** The fen's west edge under the rim, west of Stienwierde, B5's west edge open onto it
  along all its rows. The farthest of the A column from the road at its middle.
- **Its edges.** Its north edge meets A4's south edge square for square: void 0 to 4, the rim's
  mountain 5 to 30 and marsh at 31, where A4's 31,31, B4's 0,31 and B5's 0,0 meet. Its east edge
  meets B5's west edge, marsh the whole way. Its south edge meets A6's north edge, hills and marsh
  as the atlas has them, and its west edge is the world's end. Its pull request deletes the rows of
  `OPEN_ON_NOTHING` for `delta_a4 south` and `delta_b5 west`, which the seam rule refuses once A5 is
  built.
- **Landmarks.** The rim; the hills at its foot; the fen's west shore, marsh to B5; an old dyke along
  the shore, let go; the drowned mound, the lair's (§12.10).
- **Points of interest,** about five features and two groups: a wildfowler of Stienwierde in his
  punt, with word of the toads come up the shore; a camp on the dry ground under the rim; a cairn
  where the hills meet the marsh; a shrine at the fen's edge; the dyke's foot, the hint.
- **Encounters.** The fen's pools, four leeches and an eel (MONSTERS §6.1's second fight, a leech
  more: decision 18), the nearest; a bull toad alone, as the roster has it, the hardest: about 6.84
  fights to a rest at 10.
- **The secret and its hint.** A sluice-house in the old dyke, walled up when the dyke was let go:
  the keeper's tally-sticks and his pay-box. The hint: clear water runs out under the dyke's foot into
  the fen's brown.
- **The lair.** Its door in the drowned mound here (§12.10), in its own pull request once #845, #847
  and the guardian's drawing are in: this box leaves the mound and the way to it clear. Its rumour is
  #846's, said in B3, and no word in this box speaks of it.
- **New here.** Nothing; the lair, when it comes, is #846's and #847's.
- **Finds.** 180 gold in the pay-box and a draught.
- **Pay.** About 450 xp a member.
- **As built** (#830, 23 October): `delta_a5`, laid at 8,126, 535 squares to stand on. In from B5's
  reeds, open along every row, and down from A4's marsh corner at its 31,0, the north edge the rim's
  mountain but for that corner. The wildfowler sits in his punt in the reeds at 27,13 with word of
  the toads up the shore, the big one lying south where the dyke gives out; the shrine of the
  dyke-hands at the fen's edge at 21,8 gives a point of might. The wildfowlers' hide, the camp, is
  on the dry ground under the rim at 19,3, clear of both groups, and the cairn where the hills end
  and the marsh begins, at 18,27, gives 55 gold and a draught. The old dyke runs down the shore on
  column 20 from row 7 to row 26, let go at rows 11 to 12, 18 to 19 and 23. Four leeches and an eel
  keep the fen's pools at 25,9, the nearest, and a bull toad lies alone at 25,28, south of the
  dyke's end, the farthest and the hardest. The drowned mound is a rise of hills at 25–27,22–24 in
  the marsh, ringed with water but on its west, its crown at 26,23 and the way to it along row 23
  left bare for the lair's door. The sluice-house is a walled block 6 wide and 3 deep across the
  dyke at 16–21,14–16, its way in at 21,15 on the fen's side and the hint at 22,15, where clear
  water runs out under the dyke's foot into the marsh; inside, a stool, the tally-sticks and a chest
  of 180 gold and a draught. The gate holds at 10: 6.84 fights to a rest, every fight won; two
  under, 60.5%. Density: 97.0% within 12 steps, the furthest 15. By the curve's count the box pays
  about 485 xp a member and 235 gold.

### 12.7 A6, the fen under the rim: country, band 11–12

- **Purpose.** The fen's west edge south of A5, beside the Drowned Temples' approach, B6's west edge
  open onto it along all its rows. Its south edge stands closed against A7 (§12.1).
- **Its edges.** Its north edge meets A5's south edge square for square, walkable from 14 to 31 on
  both sides: hills 14 to 19, then marsh (A5's marsh at 20 is grass in A6, as the atlas has it). Its
  east edge meets B6's west edge, marsh down to row 30 and the rim's mountain at 31 on both sides,
  and its west edge is the world's end. Its south edge is the rim's mountain against A7, which stays
  cut, to its corner at 31,31 (decision 21). Its pull request deletes the row `delta_b6 west` and
  takes square 0 out of `delta_b6 south`.
- **Landmarks.** The rim; the fen; the temples' bell, heard from the west; a cell in the rim's foot
  facing the temples.
- **Points of interest,** about five features and two groups: the bell heard over the fen, an
  event; a statue with a riddle, a priest of the drowned god knee-deep in the reeds; a cairn; a camp
  at the rim's foot; the squint, the hint.
- **Encounters.** Two drowned men walked out of the temples into the fen, the nearest at 11; two
  bull toads, the hardest at 12: about 7.3 fights to a rest at 11.
- **The secret and its hint.** An anchorite's cell in the rim's foot, walled in as she was: her
  stool, her bowl and what the faithful left her. The hint: a slit cut through the rock at head
  height, looking east to the temples.
- **New here.** Nothing.
- **Finds.** 250 gold in the bowl and an elixir.
- **Pay.** About 600 xp a member, or a group fewer if the lead asks it (§12.1).
- **As built** (#830, 23 October): `delta_a6`, laid at 8,158, 471 squares to stand on. In from B6's
  reeds, open along every row but the last, and down from A5 along its width; the south edge is the
  rim's mountain to its corner, 31,31, which B6's 0,31 shares. The bell is heard over the fen at
  28,4, struck slow and even with the last stroke late, until the count stops. The priest of stone
  stands knee-deep in the reeds at 28,12, his hands out to the temples, and his riddle, TWICE A DAY
  IT TAKES THE SHORE AND GIVES IT BACK, AND IT IS NEVER LATE, is answered tide for 70 gold and a
  point of luck. The cairn of roof slates at 21,4 gives 65 gold and a draught, and the pilgrims'
  hearth, the camp, is at the rim's foot at 20,24, clear of both groups. Two drowned men stand in
  the fen at 27,18, six steps from the way in, the nearest, and two bull toads lie at the fen's
  south end at 26,27, the farthest and the hardest. The anchorite's cell is a walled block 4 by 4 at
  15–18,8–11 against the rim's foot, its way in at 18,10 and the slit, the hint, at 19,10, where the
  temples' roofs are in it; inside, her stool, her bowl and what the faithful left her, a chest of
  250 gold and an elixir. The gate holds at 11: 7.18 fights to a rest, every fight won, 0.3% of days
  with a fight broken off. Density: 100.0% within 12 steps, the furthest 11. By the curve's count
  the box pays about 604 xp a member and 400 gold, the brief's, with no group fewer (decision 24).

### 12.8 B7, the Scarp's foot west of the pans: country, band 11–12

- **Purpose.** The Saltings' grass and the last marsh under the Scarp, west of C7's pans, B6's south
  edge and C7's west edge open onto it. The Saltings', whole: the Delta's marsh in its north half
  plays at the Saltings' band.
- **Its edges.** Its north edge meets B6's south edge, the rim's mountain at 0 and marsh 1 to 31,
  and its east edge C7's west edge, open on rows 0 to 22. Its west edge is the rim's mountain
  against A7, which stays cut, shut at 0,0 too, where B6's 0,31 and A6's 31,31 meet (decision 21),
  so it has no row of `OPEN_ON_NOTHING`. Its south edge meets B8's north edge, the mountain at 0
  and 1 and the cliff from 2, so it is the Scarp's mountain the whole way, and its corners are the
  mountain at 0,0, 0,31 and 31,31 and marsh at 31,0 (decision 26). Its pull request deletes the
  rows `delta_b6 south` and `saltings_c7 west`.
- **Landmarks.** The Scarp across its south, drawn as mountain; the last marsh; the salters' grass;
  a fan of dead grass at the Scarp's foot.
- **How it meets the Wold.** The Wold's 219 squares above the Scarp are closed with it, as C7 closed
  its own (§4.10): B8's north edge is the Scarp's cliff and C7's west edge is the void there, so no
  built box walks onto them; its west edge stands closed against A7.
- **Points of interest,** about six features, two groups and the enclave's door: the salters' track's
  end, an event; a salt-carter at her cart, with a rumour of the fire under the Scarp; a camp
  on the grass; a cairn; a shrine at the marsh's edge; the dead grass, the hint.
- **Encounters.** Three salt crabs on the salters' grass, the nearest; the Hand's smugglers at a fire
  under the Scarp, two smugglers and two bowmen as C6 holds them by night, the hardest at 12: about
  7.4 fights to a rest at 11.
- **The secret and its hint.** A salters' bothy under the Scarp, its door built up with blocks of
  salt. The hint: the grass at the Scarp's foot dead and white in a fan, its point at the rock.
- **The enclave.** Its door in the Scarp's foot here (§12.10), in its own pull request after #845:
  this box leaves the door's square and the way to it clear.
- **New here.** Nothing; the enclave, when it comes, is #845's.
- **Finds.** 250 gold in the salters' strongbox and an elixir.
- **Pay.** About 600 xp a member, or a group fewer if the lead asks it (§12.1).
- **As built** (#830, 23 October): `saltings_b7`, laid at 40,190, 614 squares to stand on, all the
  Saltings' as laid. In from B6's reeds along row 0 (marsh from 1) and from C7's pans along rows 0
  to 22, the Scarp across its south and the Glasswold's ground above it shut as mountain, and the
  rim's mountain down its west two columns. The salters' track runs west along row 16 from C7's
  lanes to its end at 23,16, where the salt-carter sits at her cart at 22,16 with word of a fire
  under the Scarp and four men at it; the shrine at the marsh's edge at 15,9 gives a point of
  accuracy; the salters' halt, the camp, is on the grass at 14,13, clear of both groups; and the
  cairn of salt blocks on the hill at 9,9 gives 75 gold and a draught. Three salt crabs keep the
  grass at 20,13, the nearest at 14 steps, and the Hand's smugglers their fire under the Scarp at
  15,20, the farthest and the hardest at 20 steps. The Scarp's foot at 22,22 is left bare for the
  enclave's door (decision 28). The bothy is an L of walls in the Scarp's foot at 5–10,16–19, its
  door at 9,16 and the hint at 9,15, the point of a fan of dead white grass, nine squares of salt
  spreading north; inside, a cot, a scale and a damp ledger, and a chest of 250 gold and an elixir
  at 6,18. The gate holds at 11: 7.41 fights to a rest, every fight won. Density: 98.0% within 12
  steps, the furthest 16. By the curve's count the box pays about 604 xp a member and 427 gold.

### 12.9 D6, the plate's old place: country, band 11–12

- **Purpose.** Two pieces of land in the sea off Saltmouth: the end of D5's spit at its north, open
  onto D5's south edge, and Saltmouth's shore at its west, open onto C6's east edge. The Saltings',
  whole.
- **Its edges.** Its north edge meets D5's south edge square for square: shallows at 6 and 7,
  grass 8 to 12, sand at 13, shallows at 14 and 15, the sea beyond. Its west edge meets C6's east
  edge: the sea 0 to 5, shallows at 6, tidal ground at 7, sand at 8, the warehouse's wall at 9 and
  10, sand 11 to 19, tidal ground at 20, shallows 21 to 24, tidal ground 25 to 28 and salt 29 to
  31. Its east edge meets E6's west edge, the sea the whole way. Its south edge is the sea but for
  salt at 0 and tidal ground at 1 onto D7, which stays unbuilt (decision 31). Its pull request
  deletes the rows `delta_d5 south` and `saltings_c6 east` and adds one, `saltings_d6 south`.
- **Landmarks.** The spit's end where Saltmouth's plate stood before #177 moved it, and in the world
  the footing of the old harbour light; the tidal shore under the town; the sea.
- **Points of interest,** three features and one group: the light's footing, the hint; a cairn of
  ballast stones on the shore under the town; a wreck's ribs in the sand.
- **Encounters.** Two bull toads come out of the Delta's reeds onto the spit, the one group, at 12
  for the rise rule: about 5.7 fights to a rest at 11, at the aim's floor of 5.75.
- **The secret and its hint.** The light-keeper's store under the footing, its door walled up when
  the light moved to the town. The hint: each wave booms hollow under the footing. The map starts on
  the spit, where D5 opens onto it, since the hint check walks from the start; the shore under the
  town is walked onto from C6.
- **New here.** Nothing.
- **Finds.** 150 gold in the keeper's chest and a draught.
- **Pay.** About 300 xp a member.
- **As built** (#830, 23 October): `saltings_d6`, laid at 104,158, 83 squares to stand on in three
  pieces. The spit, 22 squares of sand and grass with the store's 6 behind its stone, is walked
  onto from D5's south edge (the map starts at 10,0); the shore under the town, 36 squares down
  the west side, and the shore's south end, 19, from C6's east edge. Two bull toads lie on the spit
  at 12,2, 4 steps from the way in, kept to it. The old harbour light's footing is a round of black
  stone 5 by 5 at 9–13,4–8 at the spit's end, its door, walled up, at its north tip at 11,4 and the
  hint at 11,3, where each wave booms hollow under it; inside, a bunk, a cask of oil, a log of
  wrecks and the keeper's chest of 150 gold and a draught at 11,7. On the shore a cairn of ballast
  stones at 1,13 gives 60 gold and a draught, and a wreck's ribs stand in the sand of the south end
  at 2,27. The gate holds at 11: 5.76 fights to a rest, every fight won. Density: 100.0% within 12
  steps, the furthest 8. By the curve's count the box pays about 315 xp a member and 210 gold.

### 12.10 The enclave and the lair

They come after the boxes, each in its own pull request. **The lair** (#846, #847): the artifact's,
at the cap's band, a drowned mound of two levels on the fen's west edge under the rim with one
guardian, its door on A5, as #846's design has it (#908); the artifact, its guardian and the rumour
that first speaks of it are #846's, and where #846 changes them, this note gives way to it. **The
enclave** (#845): its door in the Scarp's foot on B7, a place of its own held a band or two over the
Saltings', with its own reward, as #845 sets them. B7 has the room: 944 squares, its Scarp's foot
clear of the pans and the smugglers' fire. The owner's delegate moved the two doors so on 18
October (call 11).

### 12.11 For the next builders

What the seven areas after Saltreach copy from these boxes, and what they avoid (the review of
#907):

- **Copy:** the table at §12's head and "What every box keeps" (§12.1); the walkthrough's
  `theBounds`, one function called last; seams kept to the atlas's terrain; no group on land a
  company under the band walks onto. Count a zone's share of a box with the built maps laid,
  `worldGrid(ATLAS, MAP_DEFS)`, not the bare atlas.
- **Avoid:**
  - a brief that leaves a box's secret, its hint, its finds or what is new to "the builder's": each
    box names its features, its secret with a hint a company can see without passing its door, a
    New here line ("Nothing" will do) and a find;
  - a camp two squares from a group that does not roam: rest is refused only with a group next to
    the party;
  - a name another map already uses: grep the content first (Wat is Gullwick's boat-builder);
  - a text that takes three lines of the log: two is the aim, measured with the log's own wrap
    (`logLines`);
  - a find weaker than what the area's nearest shop sells for its slot;
  - the same block and the same group in every box;
  - a walkthrough check that a corner of the rim's mountain is shut to climbers: it holds only while
    the box beyond is unbuilt, for `layOutdoors` draws a ring's mountain as the void where it faces
    unbuilt land and as the mountain, climbable, where it faces a box built since (decision 36);
  - a shallow at an edge square where the atlas past the edge has tidal ground: the pillars check
    carries water and roads on into the atlas, even where the neighbour is unbuilt (decision 31).
