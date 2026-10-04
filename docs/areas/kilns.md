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

Nothing is built. Its content will be `src/content/areas/kilns/` (maps, monsters, items, climate,
its part of the world map, its chapter of the one quest, The Anvil Stone, in `chapter.ts`, its side
quests in `quests.ts`) and its businesses' rooms `src/ui/interiors/kilns/`. Its ids: the area
`kilns`, its zones `ironfells`, `kilnsheart` and `kilnmouth`, the towns `anvilhall` and `kilnhaven`,
the dungeons `deep_mines`, `anvil_stone` and `lava_tubes`. The ids stay through the naming pass
(§10, NAMES §3).

---

## 1. Where it is

The atlas (`src/content/areas/kilns/atlas.ts`, spread into the plan, §3) makes the Kilns three
zones:

| Zone | Band | Squares | Built |
|---|---|---|---|
| The Iron Fells | 16–17 | 3,059 | none |
| The Kilns' heart (`kilnsheart`, "The Kilns" on the atlas) | 16–18 | 6,933 | none |
| Kilnmouth | 17–18 | 4,799 | none |
| The area | 16–18 | 14,791 | nothing |

Squares are land, without shallows or rivers: about 14.4 zone maps, and 12,399 of them a company
could walk. The rest is the rim's mountain in row 1 and the P column, the Fells' peaks and the
heart's crags. The Fells are hills, mountain, pine and grass; the heart hills and grass with
mountain, rock and 363 squares of ash round the vents; Kilnmouth grass, farm, hills, heather and a
little wood. The bands are this doc's, written on the atlas's rows (§9): the area is 16–18 and the
boxes rise through it (§4).

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
south-east to 430,96 and on to 446,118, past Anvilhall's gate at 452,80 (its spur in N3) and the
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
on the Fells' tops in winter (`climate.ts`, with the area's first box).

## 3. What is built

Nothing a company walks. Its atlas rows are charted in `src/content/areas/kilns/atlas.ts`, spread
into the plan (`src/content/atlas.ts` imports it where its rows were), as Saltreach's and
Sunderwood's were before their first box (docs/areas/saltreach.md §9, docs/areas/sunderwood.md §9):
the zones with their bands (the Iron Fells 16–17, the heart 16–18, Kilnmouth 17–18), the towns
(Anvilhall and Kilnhaven at 16–18), the dungeons (the Tiefzeche 16–18, the Anvil Stone 17–18,
Feuerstollen 17–18) as planned plates, the sites (Anvilhall, the Deep Mines, the Forges, the Anvil
Stone, the Lava Tubes, Kilnhaven, Iron Crag, to be renamed with #435, §10) and its links: the east
road in, the towns' and the dungeons' ways in, the drove road on to High Moor, the ferry and the
Compact ship, and a new `coach` link, Kilnhaven to Rime Lodge, the drove road's coach (#434, call
9; #539 builds it). The first box (#457) points the area's `atlas` at the folder and takes the import
out, and lists the area.

The systems it waits on are #432's: the curve's rows for Act III, the gear ladder's next step and
the Stone's price (#535); ash, ice and pine underfoot (#536: ash on O6, pine on M3 and O3, where
Sunderwood drew its pine as forest, docs/areas/sunderwood.md §9, #200's 1); Kiln-script and
Linguist (#538); the crossings, the ferry, the ship and the coach (#539); the Anvil Stone counting
for the Hearth (#540, #168); and the bot, which must learn to put cold on what fire does not touch
(#541, EXPANSION §5.2). Regeneration, curse and calls (#537) are Cairnmoor's and Rimewater's; the
Kilns need none of them. `after`, for the Anvil Guard, and `when` are #41's; the machine `kind` is
MONSTERS §3.3's, first spent here. Its monsters are drawn in #472, eleven issues, and its rooms in
#473.

Drawn ahead of the boxes that place them (#472): the knockers, the Knocker, the Mender and the
Foreman (`src/ui/monsters/knockers.ts`), for the Tiefzeche's lowest level (#462). Their defs are in
`src/content/areas/kilns/monsters.ts`, listed in `AHEAD` (`src/content/index.ts`) until the first box
lists the area, and each is owed to #462 in `UNPLACED` (`tools/tests/maps.ts`). §9 has the decisions.

## 4. What is still to build

All of it: 14,791 squares of land, 12,399 of them walkable. On the grid (§1) the plan is ten boxes,
three dungeons and two towns, with four more boxes parked, and the ten hold 8,419 of those squares,
7,686 walkable; the parked four 3,886 and 3,397:

| Box | Name | Zone | Kind | Band | Land | What is there | Its step of the quest | Issue |
|---|---|---|---|---|---|---|---|---|
| M3 | The Iron Fells' way in | the Iron Fells | country | 16 | 593 (pine 379, mountain 169, grass 37) | the east road in from Lanternwood at 404,70; the first spoil; the crossing line | none | #457 |
| N3 | Anvilhall's box | the Iron Fells, the heart | core | 16–17 | 1,024 (grass 525, hills 492) | Anvilhall's gate at 452,80; the trail; the spoil heaps | the verse; the thane | #458 |
| | Anvilhall | | town, 16×16 | 16–18 | | the thane and his menu, the forge under the verse, the Lantern reader, training to 19 | the verse read the old way; the choice | #459 |
| N2 | Erzkamm (Iron Crag) | the Iron Fells | country | 17 | 723 (hills 329, mountain 299, grass 95) | the crag at 432,44; KEEP CLEAR OF THE DOORS; the Barbarian's second prestige | none | #460 |
| N4 | The Tiefzeche's box | the heart | core | 16–17 | 1,024 (grass 641, rock 191, hills 99, dirt 92) | the mine's mouth at 440,96; the headworks; the miners' camp; the Hand's wagon yard | the way down | #461 |
| | The Tiefzeche (the Deep Mines) | | dungeon, three levels of 16×16 | 16–18 | | the workings, the old workings, the clean corridor; the Foreman; CREW ONLY | the door | #462 |
| N5 | Gluthutte (the Forges) | the heart, Kilnmouth | core | 17 | 946 (woods 497, hills 137, mountain 120, grass 82), 78 shallow | the smelter at 436,126 in the charcoal woods; the crown on the anvil | none | #463 |
| O5 | The Anvil Stone's box | the heart | core | 17–18 | 1,023 (hills 654, rock 178, mountain 145) | the Stone's cut and the Rift's way in at 468,142; the cutters' sheds; the Anvil Guard, `after` | the Stone | #464 |
| | The Anvil Stone's Rift | | dungeon, one level of 16×16, hand-built | 17–18 | | slag and iron; the Slag Elders; the Warden of the Anvil | the tear closed | #465 |
| O6 | Feuerstollen's box (the Lava Tubes') | the heart | country, with the tubes | 18 | 829 (ash 274, hills 273, grass 203, rock 50) | the vent ridge 479,171 to 484,184; the tubes' mouth at 478,178, two levels; the Great Salamander | none | #466 |
| N6, M6 | The roads south and west | the heart, Kilnmouth | country | 17–18 | 844 (grass 751, woods 49, hills 44) and 837 (grass 362, farm 323, hills 151), 60 shallow | the drove road out at 430,196; the branch to Kilnhaven; the lime kilns and the farms | none | #467 |
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

**Boxes of two zones.** N3 and O3 hold the heart's land along their south rows (202 and 268
squares), N5 holds Kilnmouth's along its west (250) and N6 is near half Kilnmouth's (399). A map is
laid in one zone and all its squares are that zone's (docs/areas/sunderwood.md §4): N3 is laid in
the Fells, N4, N5, O5, O6 and N6 in the heart, M6 and L6 in Kilnmouth, so the heart begins at N4's
north edge, on the trail, and Kilnmouth at the branch into M6 (§9).

**The order** is the east road's, and the quest's: M3, the only box that meets Lanternwood, and the
way in; N3 and Anvilhall, the first steps and the choice; N4 and the Tiefzeche; N5; O5 and the Rift;
O6; N6 and M6, the roads out; L6 and Kilnhaven; then N2, which is off the road. Building waits on
#432's systems (§3) and on the two-areas rule (EXPANSION §3), with Sunderwood's road finished
(#202); the briefs and the drawings do not wait.

The places, as the atlas and the docs have them:

| Place | Box | What the docs say | On the atlas |
|---|---|---|---|
| Anvilhall | N3, and its own map | the great hall with the verse over the forge where the kings' crowns are made; the thane, who sells the Stone back or loses it and never forgives (DESIGN §9, STORY, #434's 1); training to 19 (DESIGN §5); the Lantern reader (#538); 33, 34 and 36 begin or end here (#56) | a planned town at 452,70, its way in at 452,80 |
| The Tiefzeche (the Deep Mines) | N4, and below | the deepest mine, broken into the hull's service ways; the clean corridor, the knockers, the Foreman and the door marked CREW ONLY (DESIGN §9, MONSTERS §7.1, STORY); the service ladders found by reading (#434's 2); the son who carries the crust (#56's 33); the hymn's doors (#56's 36) | a planned dungeon at 440,104, its way in at 440,96 |
| Gluthutte (the Forges) | N5 | the smiths; the crown for Jory Tallis paid in shards (#56's 35); fire beetles at the forges (MONSTERS §7.1) | a site at 436,126 |
| The Anvil Stone | O5, and below | cut by the dwarves to sell the pieces; its Rift in slag and iron; the Warden of the Anvil, whose fall closes the tear; the Anvil Guard, after the taking (MONSTERS §2.1, §7.1, #434's 1); counts for the Hearth (#168, #540) | a planned dungeon at 468,136, its way in at 468,142 |
| Feuerstollen (the Lava Tubes) | O6, and below | the fire things; salamanders and the Great Salamander in the deepest chamber (MONSTERS §7.1) | a planned dungeon at 470,194, its way in at 478,178 |
| Erzkamm (Iron Crag) | N2 | the Barbarian's second prestige, Ironhide, off the beaten path and relatively safe (DESIGN §5); the wall that says KEEP CLEAR OF THE DOORS, which the Regent's scholar copies (#56's 34) | a site at 432,44, a cave |
| Kilnhaven | L6, and its own map | the ore port, whose ship is one way to the far side of the sea (DESIGN §9); the harbourmaster's manifests (#470); training to 19; the ferry, the ship and the coach (#539) | a planned town at 378,158, its way in at 391,162 |
| The drove road | N5, N6 | the road south into Cairnmoor, which has no town (#434's 9); the coach's road | a trail from 446,118 to 430,210, the branch to Kilnhaven off it |

### 4.1 The briefs

As Saltreach's (docs/areas/saltreach.md §4.1): drafts for the owner, written before Act III's
first box is built, each settled in its issue. A core box is held to the Foreland map's density,
about nine features, ten groups and four ways in or out to 870 open squares, a country box to about
half with the wilderness features (#45), and no more than one point in four is a sign. A group is
about one of MONSTERS §4.4's standard encounters at the box's band, paid by level (#159). The area
owes 13,067 xp a member (§8), and the shares below add up to a little over it. Finds are the ladder's
Act III step (#535): the band's gear at Anvilhall's forge by 17, the same at Kilnhaven's smith at a
quarter more (#434's 1), and the same with a plus in the boxes and the dungeons; no find or ware is
dearer than the band's window, 3,500. Side quests are #56's 33 to 36, placed as §6 has them (#471).

**Inscriptions.** An inscription is a sign with two texts (#538): what the dwarves read, and what
it says. The second shows to a company with a reader, a member with Linguist, a dwarf or 34's
copybook, and never has to. Where a brief gives one, the first line is the dwarves' and the second
the machine's; both are drafts. A secret's hint is a thing seen first, and the reading a second
hint beside it, so the hint check (EXPANSION §5.4) passes without a reader.

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
- **Finds.** The step's first piece with a plus, in the wagon (#535).
- **Pay.** About 700 xp a member.

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
  are; the step's armour with a plus (#535).
- **Pay.** About 900 xp a member.

### 4.4 Anvilhall (#459): town, 16×16, band 16–18

- **Purpose.** The act's first town and the dwarves' seat: the great hall with the verse over the
  forge, the thane with his menu, and the first place the company reads the old way.
- **Businesses,** each with a room of its own (#473): the great hall, the thane's, where the choice
  is put as a business puts its menu (#434's 1); the forge, under the verse, the act's first step on
  the ladder by 17 (#535), shut to the company for good if the Stone is taken; the training hall,
  to 19 (DESIGN §5); the inn, the miners' lodging; the mine-surgeon's, cures and raising at the
  band's price; the stores, provisions at list price. No spell hall (#434's 9): Lantern Watch sold
  tier 6 and Rime Lodge sells tier 7 (DESIGN §7). No guild hall (#434's 8).
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

### 4.5 N2, Erzkamm (#460): country, band 17

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
- **Finds.** The hoard: the step's two-hander with a plus (#535), and gold.
- **Pay.** About 600 xp a member.

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
- **Finds.** The cargo's belongings, a Fells' find with a plus (#535).
- **Pay.** About 900 xp a member.

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
- **Finds.** The parts the machines carry, which no shop buys; in the side room the step's weapon
  with a plus (#535), and in the Hand's cages the ladder's gear for the classes the Fells' finds
  miss.
- **Pay.** About 2,400 xp a member.

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
- **Finds.** Shards the Compact paid, and the step's shield with a plus (#535).
- **Pay.** About 900 xp a member.

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
- **Finds.** The cutter's piece, a second Anvil Shard, a keepsake; the step's helm with a plus
  (#535) in the foreman's shed.
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
  (docs/areas/sunderwood.md §9, #199's 6); the first cutter's tools, the step's two pieces with a
  plus (#535).
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
- **Finds.** The first dwarves' shelter: the step's bow with a plus (#535); in the deepest chamber,
  the Great Salamander's hide, a resistance to fire worn.
- **Pay.** About 1,500 xp a member, the box and the tubes together.

### 4.12 N6 and M6, the roads south and west (#467): country, band 17–18

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
- **Finds.** The step's dagger with a plus in the kiln (#535).
- **Pay.** About 700 xp a member, the two together.

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
- **Finds.** The step's robe with a plus in the store (#535).
- **Pay.** About 600 xp a member.

### 4.14 Kilnhaven (#469): town, 16×16, band 16–18

- **Purpose.** The act's second town and the ore port: where the harbourmaster's manifests name the
  Compact ship's cargo, and three ways out of the Kilns leave.
- **Businesses,** each with a room of its own (#473): the inn (rest, and the coach yard outside,
  #539); the smith, the act's first step at a quarter more than Anvilhall's forge (#434's 1, #535),
  the company's only forge if the Stone was taken; the training hall, to 19; the harbourmaster's
  office, where the manifests are read; the chapel, cures and raising; the chandlery, provisions and
  lamp oil at list price. No spell hall and no guild hall (#434's 8 and 9).
- **People.** The harbourmaster, who reads the manifests for a company that asks and hears the
  Compact's cargo named, Cinderport and Sheer Point (§5); the Compact's shipmaster and the ferryman
  at the quay, who sell their passages (#539); the coachman in the yard; Jory Tallis's man, come for
  the crown (#56's 35); a dwarf who says the corridors run south under the world, toward the lakes.
- **Quests.** The chapter's last step (§5); A Crown to Order's end (§6).
- **The crossings** (#539): the ferry to Saltmouth and the Compact ship to Cinderport, each a fare
  and never a favour, both from the start (EXPANSION §2.2); the coach to Rime Lodge, the drove
  road's, a fare and days (#434's 9). Nothing is sold cheaper to a member of any guild here.
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
  Buy it back, about 6,000 gold, or take it (#434's 1): a choice put by a person (#76), which sets
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
eleven issues. §4.2 to §4.13 place every group, box by box, the beetles on M3's spoil the gentlest
and the Warden, the Foreman and the Great Salamander at the top of the band. No machine stands on
the surface or above the Tiefzeche's lowest level (MONSTERS §2.2, #158): the first machines on the
road are met at the bottom of the deepest mine, by a company that has walked all of it.

Proposed, against the roster's Where column, and standing in the briefs as proposals: the Fire
Beetle on every box's spoil, kilns and ore heaps, where the roster has it at the spoil heaps and the
forges; the Salamander on O6's ash outside the tubes and on N3's and N5's heaps, where the roster has
it in the tubes and in the spoil heaps' fight; the Rock Worm in the surface adits and cuts of M3, N2,
N4, N6, M6 and L6, where the roster has it in the old workings. If the owner takes them, MONSTERS'
Where column says so in a pull request of its own. Two things the briefs lean on that the roster
does not hold: the Hand's overseers walking the cargo down (MONSTERS §7.1's Back, with no row), and
the Hand's crew on Kilnhaven's quay by night, both from Act II's roster at level, or said and not
fought, which #461, #462 and #468 settle with the owner; and a surface group at 18, which the roster
has only in the dungeons, so the 17–18 boxes (O5, N6, M6, L6) hold their top with a rock worm pair
at 17 and the dungeons hold the 18s, or #472 adds one (§9).

New in the Kilns, for the novelty check (EXPANSION §5.4): the knockers and the salamanders, two new
families; the machine kind, with the cleric's Wrath passing through it (MONSTERS §2); pine and ash
underfoot (#536); Kiln-script read, a sign with two texts, a shortcut found by reading and a world
map mark made by it (#538); a choice sold like a ware, and a shop that shuts for good; a group that
comes `after` a choice; a coach that runs (#539); the second prestige (#19). Its landmarks: a town cut
into a hill, a mine's headworks, a smelter, a Stone cut by its own people, a ridge of vents, an ore
port.

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
  finds Kilnmouth's 17 waiting on the quay.
- **Gold.** Training six members from 16 to 18 costs 7,920 with today's `trainPrice` (640 and 680 a
  member a level), and the Barbarian's Ironhide about 4,000 (DESIGN §5). The Stone's price is about
  6,000, set with #535 so that a clear of the Fells and the Tiefzeche can just pay it: a company that
  buys trains later, and one that takes pays a quarter more for its gear at Kilnhaven's smith. The
  step's wares at Anvilhall's forge and its finds with a plus sit inside the band's window, 3,500
  (#535), the smith's at a quarter more inside it too.
- **The gate.** Each map at its own floor (docs/areas/thornmark.md §9, 17; EXPANSION §5.2): a
  company at 16 wins nine in ten of M3's fights and walks the trail resting at its camp; one at 14
  wins no more than one in four, which is how the Fells turn an Act II company back. The Foreman and
  the Warden of the Anvil are won about half the time at their maps' floors and nearly always two
  above. Act II's boxes owed their two-under figures to the gear past 10 (#18); the Kilns' hold only
  if #535's ladder dresses the company at 16 as the curve says.
- **Density.** Core boxes at the Foreland's floor, country at the looser one (EXPANSION §5.3); the
  Tiefzeche's lowest level at the dungeons' floor with the corridor's side room inside it.

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
  the inscription beside it has been read, and the stairs stay the way for everyone.
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
   of six knockers at a glance. A soldier's numbers at 17: 196 hit points, armour 20, +10, 3d7+5,
   speed 11, 673 xp; size 0.55, tint #9a9c96.
6. **The Mender casts Mending Light one turn in two** that one of its group is hurt. At every turn,
   the harness's bot, which never singles it out, broke off half its days at fifteen rounds at 16
   and 17; at one in two, 6 to 7% of them, the fight a round longer than with a mender that never
   mends (5.4 rounds to 4.4 at 16, 300 seeds).
7. **The Foreman is a knocker grown long and reared up,** its cowl bowed over a slate held before
   it with the list cut on it in rows, an empty box at each row's end; a stylus goes down the boxes
   and ticks none, and now and then the lamp lifts from the slate to the company. Size 1.3, under
   the tall boss's 1.5, so it stands on its group's rank; tint #5c6068.
8. **The Foreman stands on #409's boss line at 18,** 961 hit points, armour 22, +13, 17d8+20, for
   #462's gate to tune, as #199 tuned the Warden of the Sunder: a company wins it 17% of the time at
   14, 66% at 16, 82% at 18 and 99% at 20 (300 seeds).
9. **One frame, a Build to a kind:** length, dome, taper, rear, plates, legs, stance, step, cowl,
   feelers, spool, needle, slate and the mark, so MONSTERS §11's tallyman, deep knocker, inspector
   and tally clerk are each a Build, a colouring and what their trades carry.
10. **No gold and no drops:** machines carry parts (MONSTERS §2), and the parts are items, #462's
    to add with the groups it places, as the Heart of the Sunder came with #199.
11. **They stand unplaced, owed to #462,** which seats six knockers and a mender twice in the clean
    corridor and the Foreman before the door.

Owed elsewhere: MONSTERS §2's line for the first time the Hearth's light passes through a machine,
*The light goes into it like a hand into a glove.*, is not in the combat log, which says only that a
knocker takes 0. It is the systems lane's, wanted before #462 seats the knockers.

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
