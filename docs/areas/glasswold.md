# The Glasswold: step XI of the road, the steppe round the Glass

The eleventh step of the road of levels (DESIGN §9, EXPANSION §2.2), band 26–28, and the last of
Act IV, Beyond the Sky: the Wold, a dry steppe with glass in its grass, where the Wold Riders keep
their white tents and the only way into the Glass; and the Glass itself, Tashkum in the Riders'
tongue (§10), the desert of fused sand the day the sky opened left, with the Buried Tower sunk in
it. The Wold is on the road and this doc plans it. The Glass is the reach (DESIGN §9, EXPANSION
§5.8), off the quest and optional by design, and is described here only as what the Wold keeps out;
its doc is Phase 1.6's. This is the area doc (EXPANSION §4, §6 and §8.2): where the atlas puts it,
what the atlas and the docs put in it, the plan for building it, box by box, and the briefs. Its
work is filed under #447 (Phase 1.4, #441): this doc (#523), the boxes as §4's table has them
(#524 to #530), its chapter (#531), its side quests (#532), its six drawings (#533) and the country
behind, parked (#534). The act's systems are #442's: the curve's row (#542, in: §3), steppe and
dunes underfoot (#543, in: §3), the toll (#544) and the sweep (#545), stone and its cure (#546),
the crossings, the Rider's ride to Cinderport among them (#547), and the bot (#549). The owner's
calls are #443's, the names #444's, the third prestiges' quests #448's and the road behind #449's.
Figures are measured on main at `6032251` (2 October 2026) with `worldGrid` (`src/game/atlas.ts`):
land without shallows or rivers, and "walkable" what is not mountain, peak, cliff or chasm.

Built so far: E10's Wold half (#524, §4.2), on the box laid whole for Ashfall's Ember Waste (#517);
D9, the steppe (#525, §4.3), which lists the area and places the glass scorpion E10 cut and the
first glass walker; D10, the mesas (#527, §4.5), which joins E10 and D9 overland, so `CUT_OFF`
is empty, and places the basilisk and spends stone first; D8, Akordu, the Riders' camp (#526,
§4.4), which lands the Rider's ride to Cinderport; and C8, the Scarp's edge (#528, §4.6), where the
Scarp stair from the Saltings' C7 comes up onto the lip, nine squares of C7 opened for it. `AHEAD`
and `PLANNED` are empty; the Wold's step of the quest and the area's chapter are owed to #531. Its
content is `src/content/areas/glasswold/`
(maps, interiors, monsters, items, climate, its part of the world map in `atlas.ts` and its
walkthrough; its chapter of the one quest, The Warning, in `chapter.ts` and its side quests in
`quests.ts`, to come); it has no town and one business, the Riders' trader at Akordu, whose tent has
a room.
Its ids: the area `glasswold`, its zones `wold` and `theglass`, the plan's; the Buried Tower
`buried_tower`, the plan's, left to the reach. Akordu's (the Wold Riders' camp) is the site's name
and its map `wold_d8` (#526); Kushtash's (the Eyrie) id is B8's to set (#529), and the Eyrie's site
keeps its name in the issues until #444 renames it.

---

## 1. Where it is

The atlas (`src/content/areas/glasswold/atlas.ts`, the area's own since #525, §3) makes the
Glasswold two zones:

| Zone | Band | Squares today | Built |
|---|---|---|---|
| The Wold | 26–28 | 6,240 (steppe 3,133, hills 1,151, mountain 646, dunes 540, grass 369) | D9, D10, D8 and C8 |
| The Glass, the reach | 30–32 | 4,813 (steppe 1,306, mountain 1,028, hills 838, glass 817, dunes 626) | nothing, and not this phase's |
| The area | 26–28 | 11,053 | D9, D10, D8 and C8 |

Squares are the land `worldGrid` gives each zone by today's seeds, without shallows or rivers;
9,349 of them a company could walk, and nearly half of those are steppe. That is about 10.8 zone
maps (EXPANSION §1 had 12.9 at an older head). The zones' line is wrong today: the Glass's seeds at
80,280 and 110,300 pull a third of the steppe into it, D10 among them. This plan moves the seeds
(§9) so that the steppe is the Wold's and the Glass is the fused desert and its dunes: C9, C10,
D11, B10, C11 and B9's south; the zones' figures are measured again when the folder lands (#523).
The Wold's band is the area's, 26–28, and the boxes rise through it (§4); the Glass's is the cap's,
as the reach is (DESIGN §9; MONSTERS open question 3, answered by call 5). No Wardstone stands here.

The squares are the plan's, before any box. D9 (#525), D10 (#527), D8 (#526) and C8 (#528) are laid
whole in the Wold (§4, §9).

**The grid** (EXPANSION §8.2; docs/areas/shelf.md §1). Boxes are 32×32 with A1's corner at 8,−2,
so a box's corner is x = 8 + 32i, y = −2 + 32j. The Wold is the B, C, D and E columns from row 8 to
row 10, with E9 and E8 behind it on the coast; the Glass is C9 and C10 with the dunes and slivers
round them. The land worth a map on the road is seven boxes: E10, D9, D8, D10, C8, B8 and B9 (§4).
E9 and E8, the country behind, are parked (#534); A7, A8, A9 and B7, the rim's mountain and the
Scarp's lip, are cut (§11).

**D9 and E10 meet at a corner only,** D9's 31,31 (135,285) and E10's 0,0 (136,286), and D10 (#527)
lies between them and joins them overland: E10's west-edge road, at its 0,6, meets D10 at its 31,6,
and D10's north edge, at 22 to 23,0, meets D9's south edge, where the atlas's road crosses at 22 to
23,31 (126 to 127,285). `CUT_OFF`, the outdoors reach test's list, is empty, D9 no longer owed (§9,
#525's 6, #527's 16); D8 (#526) meets D9's north edge from the north, square for square, the Riders'
track at 16,31 against D9's 16,0 (§4.4).

Its edges:

- **North: the Scarp,** the cliff ridge along y 206 to 216 between the Saltings below and the Wold
  above. The Scarp stair climbs it at 80,206 → 80,216, a road link open from the start (EXPANSION
  §2.2), its foot a notch in Saltreach's C7 where the lowest flight has fallen (docs/areas/saltreach.md
  §4.10; #412, the Scarp's fallen stair). The link's ends, 80,206 and 80,216, are in C7 too, so the Wold's C8
  meets the stair at its north edge. As built (#528) the flights run on through C7's column 8 to its
  south edge, the last is C8's 8,0 (80,222), the head and the Riders' watch lie at 80,223 and the
  way past the fall is a rope ladder (§4.6).
- **East: the Cinder Hills,** a hills ridge at x 146 to 152 between the Wold and Ashfall's Ember
  Waste. The road from the Waste crosses it at 156,312 → 144,300, inside E10, open from the start;
  Ashfall's side of it is #517's, and Cinderport, the act's town, is #512's. North of the hills E9
  meets Ashfall's F9 along the coast with no road, and E8 is the shore, where Wrackholm's south-west
  corner comes within 13 squares of shallow (docs/areas/wrackholm.md §1); no way runs there.
- **South and south-west: the Glass,** the reach. A lava flow seals it from the Ember Waste, new
  on the atlas by call 5: a ridge of kind `lava`, width 2, from the road's south side at about
  160,318 south-west through 150,332, 140,348 and 134,362 to the rim at 130,376. With it the Glass
  is entered only through the gap at the mesas and dunes, B9 and C9, from the Wold, and EXPANSION
  §5.8's reach check passes: a dead end with a single way in, which cutting off leaves the road
  whole. Before the flow the Wold bordered four zones on the road and the Glass two.
- **West: the rim,** the A column, mountain with the Wold's last grass under it; Kushtash, the
  far-west mesa, stands under it in B8.

The steppe runs from the Scarp's lip south to the dunes and east to the Cinder Hills, with mesas
standing out of it; the dunes lie in a crescent round the glass, which is C9's, 602 squares, with
the Buried Tower's crown breaking it at 84,280. No river crosses the area; the Riders' water is
wells.

`node tools/worldmap.ts out.png --zones` paints it.

## 2. What it is for

The end of Act IV (DESIGN §9): *what is Caldera?* By the Wold the company has seen the window at
Meridian Camp and knows the sky is a ceiling. The Wold is the warning against arriving, in person:
the Riders remember the day the sky opened and the land burned to glass, their grass has glass in
it, the beasts that hunt it are the biggest on the road, and now and then something walks out of
the Glass that fell with the pillar of fire and has not stopped trying to get up (MONSTERS §8.3).
The Riders keep the only way in, and they are right to. STORY has the eldest tell it: *What lies in
the glass tried to leave. The sky opened for it. Remember what that cost, if anyone ever offers to
open it for you.* It is the last ground before Hearth Isle's 28, with no Stone to mend, so what it
gives the quest is the words and the land they are said over. Two third prestiges are taught in the
Glasswold (DESIGN §5, #448): the Ranger's at Kushtash, the Eyrie, on the Wold; the Sorcerer's at
the Buried Tower's crown, the reach's. Akordu, the Riders' camp, is the Wold's rest, and a Rider
rides a company to Cinderport and back (call 5), so the Wold trains there, to 27. There are no
Rifts in Act IV (MONSTERS §8), and the glass walker is a machine on open ground, bare, as MONSTERS
§2.2 allows past the Mines.

The weather is the steppe's: dry, hot by day and cold by night, dust on the wind, and the Glass's
glare from the south-west on a clear noon.

## 3. What is built

Four boxes of its own, the first of which lists the area (#525):

- **The steppe** (D9, `wold_d9`, core, band 26–27; #525): open grass with glass in it, laid whole at
  104,254. The atlas's road comes over the south edge and runs north-west and west to the gap; a
  Riders' track leaves it for the north edge and the tents, past their well and camp; the dunes'
  edge lies in the south-west, with a cairn, the Glass seen from a dune and the glass walker's
  tracks. The herd grazes in the north-west, and a long mound in the grass, which the horses will
  not graze, holds the fallen walker. Four groups: two prides of four lions, each with the three
  vultures over its kill, four glass scorpions at the dunes' edge and a glass walker alone at the
  far south-west (§4.3).
- **The mesas** (D10, `wold_d10`, core, band 26–27; #527): the Wold's way in, laid whole at 104,286.
  The atlas's road comes over the east edge from E10 and runs west along the great mesa's south foot
  and north up its west side to D9. The great mesa stands in the north-east, where the Eyrie stood,
  its top an enclosed grass with a cold fire-ring, a nest and a hoard, reached by a secret door over
  a scree; the small mesa stands on the west edge, the glassed stand round both, the great mesa's
  all facing the scree, and the dunes' edge lies in the north-west with the Glass's glare beyond.
  Five groups: two prides of four lions, the near one with three vultures over its kill, the mesa
  fight, three lions in the scree with a basilisk behind them, four glass scorpions at the dunes'
  edge and a basilisk alone under the small mesa (§4.5).
- **The Riders' camp** (D8, `wold_d8`, core, band 26–27; #526): Akordu, white tents in a ring under
  the mesa's south face, laid whole at 104,222, north of D9 and joined to its Riders' track. The
  eldest tells the oldest story at her fire; the trader's tent, with a room of its own, sells
  consumables and a leather coat; a Rider at the horse-lines sells the ride to Cinderport and back.
  East of the ring stands a garden of glass, and against the mesa's foot a dry well with no rope
  hides the Riders' hoard. Three groups: a pride of four lions by night, six glass scorpions in the
  broken ground under the mesa's east face and the basilisk alone in the mesa's shade, on its north
  side (§4.4).
- **The Scarp's edge** (C8, `wold_c8`, country, band 26–27; #528): the Wold's north edge over the
  Saltings, laid whole at 72,222, west of Akordu. The Scarp stair comes up from the Saltings' C7
  through nine squares of its column 8 and a last flight cut through the lip, to the stair's head,
  where the Riders keep a watch of a cairn, a yurt and a fire with two Riders. A Compact runner
  sits on the last flight getting her wind. The grass runs south and east from the lip to Akordu. Under
  the lip, east of the head, a cleft behind a rock holds the Compact's last three drops. Three
  groups: six vultures on the lip's updraught, a pride of four lions with three vultures over it
  and two basilisks in the hills at the east (§4.6).

Its atlas rows are charted in `src/content/areas/glasswold/atlas.ts`, the area's own `atlas` since
D9 lists the area; until then `src/content/atlas.ts` spread them into the plan where its rows were,
as Saltreach's and Wrackholm's were until each had a map (docs/areas/saltreach.md §9, #169's 1):
the zones with their bands, the Wold 26–28, with D9, D10, D8 and C8 laid on it, D10 first, and the Glass
30–32, the Buried Tower's plate at 30–32, and the sites, Akordu (the plan's Wold Riders camp at
120,250), Kushtash (the Eyrie, moved to about 46,242, call 5) and the Buried Tower, "The Glass" and
"Buried Tower" lettered as the plan letters them. The lava flow is drawn in the plan's ridges
(`src/content/atlas.ts`), the one line outside the folder this doc asks for (call 5). Its row on the
curve is in (#542), in `src/content/progression.ts` (band 26–28, next 28, window 6,000), owed to
#447 while the area is built box by box, with the four boxes' 9,861 xp a member and 5,450 gold the
clear's floor (§8); the Wold takes no step on the gear ladder, no town to sell one (§9); the
trader's coat is off it (§9, #526's 7). Its ground is laid (#543): steppe (`s`), walked as grass and
tawny at Harvest, and dunes (`u`), sand in ridges walked as slowly as hills, so the scaffold drafted
D9 with its 807 squares of steppe and 171 of dunes (docs/SLICE.md). Its six monsters are drawn
(#533, MONSTERS §8.3): five on frames that exist, the vulture, the Wold lion, the Grey Lion, the
glass scorpion and the basilisk, and the glass walker, the first of a family of its own
(`src/ui/monsters/glasswalkers.ts`); their defs are in `src/content/areas/glasswold/monsters.ts`,
the Area's own since D9 lists it (`AHEAD`, `src/content/index.ts`, listed them until then), and each
was owed in `UNPLACED` (`tools/tests/maps.ts`) to the box that first places it: E10 places the
vulture and the Wold lion (#524), D9 the glass scorpion and the glass walker (#525) and D10 the
basilisk (#527); the Grey Lion is owed to #529, though listing the area records all six in
`src/content/shipped.json`. Its items, the Etched Glass, the hoard's Basalt Shield +2, the Leather
Coat with its plus and the cleft's Letter in Cipher, are in `items.ts` (§9, #525's 11, #527's 12,
#526's 7, #528's 13), and its climate is the steppe's (§9, #525's 2). Its crossing line is on the
Wold's zone row (#524), said where a map of the Wold is first entered, and walked at D10, over
E10's west edge (§9, #527's 14) and at C8, on the step up the Scarp stair onto the lip (§9, #528's
2). The ride's crossing has its Akordu end in D8 (§4.4). E10's Wold half is built on the Waste's
map (§4.2). C8 is cut through the Saltings' C7, nine squares of its column 8 and its notch's
words, with the owner's leave (#412, #528; §4.6). Nothing else: no quest.
Every brief below is a draft.

## 4. What is still to build

All of it but D9, D10, D8 and C8, built (#525, #527, #526, #528; §4.3, §4.5, §4.4, §4.6), and E10's
Wold half (#524, §4.2): 11,053
squares of land, 9,349 of them walkable, the plan's figures (§1). On the grid the plan is seven
boxes, which hold 5,557 of those squares, 5,379 walkable, the table the epic #447 carries:

| Box | Name | Zone | Kind | Band | Land | What is there | Its step of the quest | Issue |
|---|---|---|---|---|---|---|---|---|
| E10 | The road onto the steppe | the Wold | country | 25–26 | 620 (hills 302, steppe 215, ash 64, grass 39) | the road over the Cinder Hills from the Waste at 156,312 → 144,300, laid whole by #517 (ashfall.md §4.9); its Wold half built by #524 at 25–26: beetles over from the Waste, the first vultures and a pride, a camp, the Riders and the glare from the crest (§4.2) | none | #524 |
| D9 | The steppe | the Wold | core | 26–27 | 1,024 (steppe 807, dunes 171, road 29, rock 11, hills 6) | the grass with glass in it; the lions' prides; the dunes' first edge at the south-west corner; built by #525 at 26–27: the Riders' well and track, two prides with their vultures, the scorpions and the glass walker at the dunes' edge, the fallen walker in the long mound and the horse that came back, seen (§4.3) | the glass in the grass | #525, built |
| D8 | The Riders' camp | the Wold | core | 26–27 | 1,024 (steppe 757, hills 93, rock 90, earth 67, felt 9, crystal 6, doors 2) | Akordu at 120,250 under its mesa: the eldest, the trader, the Rider who rides to Cinderport; the garden of glass; built by #526 at 26–27: the eldest's story told once, the trader's tent with its own room, the Rider who sells the ride to Cinderport and back, the garden of glass, the dry well and its hoard, the mesa with the basilisk in its shade (§4.4) | the eldest's story | #526, built |
| D10 | The mesas | the Wold | core | 26–27 | 1,024 (steppe 765, hills 160, rock 53, dunes 23, road 22, a secret door 1) | the basilisks' mesas; the mesa fight; the Eyrie's old mesa at 132,289, empty; built by #527 at 26–27: the road from E10 to D9 under the great mesa, the glassed all facing the notch, the secret door and the top with its nest, hoard and view of the Glass, two prides with the near one's vultures, the mesa fight, the scorpions and a basilisk alone under the small mesa (§4.5) | none | #527, built |
| C8 | The Scarp's edge | the Wold | country | 26–27 | 1,024 (steppe 923, hills 54, cliff 23, earth 11, rock 8, stone 3, felt 1, a secret door 1) | the Scarp's lip over the pans; the stair's head at 80,216 on C7; the Riders' watch on it; built by #528 at 26–27: the Scarp stair opened up C7's column 8 to the lip, the stair's head and the Riders' watch with their cairn, yurt and fire at 80,223, the Compact's runner on the last flight, the Saltings seen from the lip, the cleft under the lip with the Compact's last three drops, vultures, a pride and two basilisks (§4.6) | none | #528, built |
| B8 | The Wold's heart | the Wold | core | 28 | 795 (steppe 587, rock 116, hills 92) | the Grey Lion's ground; Kushtash, the far-west mesa under the rim at about 46,242, the Ranger's third | none | #529 |
| B9 | The Glass's edge | the Wold | country | 28 | 917 (dunes 500, mountain 178, steppe 83, hills 79), 739 walkable | the dunes and the scorpions; the gap at the mesas and dunes; the Riders' watch on the only way in; the glass walkers | the Riders keep the way in | #530 |
| E9, E8 | The country behind | the Wold | country, behind the road, parked | 27–28 | 931 (hills 411, steppe 264, grass 222) and 305 | the hills down to the coast; the shore | none | #534 |

The core is the four boxes the Riders and their beasts fill, D9, D8, D10 and B8, built at full
density; E10, C8 and B9 are country, built to the looser floor with the wilderness features
(EXPANSION §2.1 (b) and §5.3, #45). The Glass's boxes are not in the table: C9 (899), C10 (967, 712
walkable), D11 (500, 202), B10 (287, 72), C11 (133, 10) and E11's west part, about 3,000 squares,
are the reach's (§11). The bands rise from the way in, 26 at the Cinder Hills' foot, to 28 at the
Wold's heart and the Glass's edge, as the gate asks (EXPANSION §5.2), and each box holds a group at
the top of its band for the curve. Nothing in the area trains or teaches a spell (call 7), and its
one trader sells consumables and a leather coat, no steel (call 5): Cinderport sells the gear, a
Rider's ride away (call 5, #547), and the ladder takes no step on the Wold (#542).

**Five boxes hold land of more than one zone by today's seeds.** B9's dunes run south into the
Glass; D9's cut gives 913 squares to the Wold and 111 to the Ember Waste, none to the Glass; D10's
gives 659 to the Wold, 316 to the Ember Waste and 49 to the Glass; D8's gives 845 to the Wold and
179 to the Saltings; and C8's gives 496 to the Wold and 528 to the Saltings. Each is laid in the
Wold, D9, D10, D8 and C8 whole (§9, #525's 1, #527's 1, #526's 21, #528's 17), and with the seeds
moved (§9) the zone line runs along the glass's own edge in C9. A map
is its whole box (EXPANSION §8.2), so each is built to its edges; the zone a square belongs to
decides only its crossing line (#166) and its band, and the crossing line into the Glass is the
Riders' watch's to say (§4.8).

**The order** is the road's from Cinderport, and the quest's: E10, the only box that meets the
Waste; D10, the mesas, the road's way in; D9 and D8, west over the steppe to Akordu; C8, north to
the Scarp's edge; B8 and B9, west to the Wold's heart and the gap. Building waits on Ashfall's Waste
road (#517) and Cinderport (#512), on the act's systems (#442) and on Ashfall being played, since no
more than two areas are in flight at once (EXPANSION §3); the briefs and the drawings do not (#447).

The places, as the atlas and the docs have them:

| Place | Box | What the docs say | On the atlas |
|---|---|---|---|
| Akordu (the Wold Riders' camp) | D8 | the horse people and their eldest, who tells the oldest story on that side of the sea (STORY, Act Four; DESIGN §9); the Wold's rest, a trader and the Rider's ride (call 5); the garden of glass (#56's 55); the horse that came back (#56's 51) | a camp, "Akordu", at 120,250, built with D8 (#526) |
| Kushtash (the Eyrie) | B8 | the Wold Rider scout who guided the Meridian Company, on the far-west mesa under the rim: the Ranger's third prestige (DESIGN §5, #448) | a camp at 132,289 in D10 today; moves to about 46,242 (call 5) |
| The mesas | D10, D8, B8 | the basilisks' ground; the mesa fight (MONSTERS §8.3) | rock, five outcrops of 11 to 16 squares |
| The dunes | B9, D9 | the glass scorpions' ground (MONSTERS §8.3); the crescent round the glass | dunes, 1,166 squares across both zones |
| The Scarp stair | C8, and C7 | Act IV's way down into Saltreach; the Compact runner on it (#56's 54) | a road link at 80,206 → 80,216, "the Scarp stair" |
| The Cinder Hills | E10 | the border with Ashfall's Waste (#517) | a hills ridge at x 146 to 152 |
| The Glass (Tashkum) | C9, C10 and round them | the reach: what the day the sky opened left; the only way in kept by the Riders (DESIGN §9; EXPANSION §5.8; MONSTERS §10.1) | glass, 602 squares in C9, lettered at 96,304 |
| The Buried Tower | C9, and below | the mast of a lander sunk in the glass it made, its decks running down; the Sorcerer's third at its crown (DESIGN §5, §9; MONSTERS §10.1) | a planned dungeon at 84,286, its way in at 84,280; band 30–32 (call 5) |
| The lava flow | E11, D12 | seals the Glass from the Ember Waste (DESIGN §9; EXPANSION §7) | new: a `lava` ridge from 160,318 to the rim at 130,376 (call 5) |

### 4.1 The briefs

Each box's brief is what EXPANSION §8.2 asks of one: its purpose, band, landmarks, the secret and
its hint, the encounters and what is new, with its points of interest and a first share of the pay
beside them. They are drafts for the owner, written before any box of Act IV is built; each is
settled in its issue, and what Ashfall teaches changes them.

- **Points of interest** (EXPANSION §5.3). A core box is held to the Foreland map's density: about
  nine features, ten groups and four ways in or out to 870 open squares. A country box has about
  half, and the wilderness features (#45) do most of the work. No more than one point in four is a
  sign, and the Riders letter none: their marks are cairns, wells and the horses' tracks.
- **Encounters** are MONSTERS §8.3's roster and fight, a group about one of MONSTERS §4.4's
  standard encounters, paid by level (#159), so the figures below are for a company at the box's
  band. The glass walker is a machine: it never breaks (#160), and no Rift stands in the act.
- **Pay.** The area owes 21,067 xp a member (§8). The shares below are the epic's first division
  and add up to less than that; §8 says how.
- **Side quests** are #56's 51, 53, 54 and 55, placed as §6 has them (#532).
- **Finds.** The Wold adds no rung to the gear ladder (#542): its finds are gold, the band's
  consumables and, where a box promises one, a piece of Cinderport's with a plus, inside the band's
  price window of 6,000. The Riders' own gear is leather and horn, sold at Akordu (call 5).
- **Stone.** The basilisk turns a member to glass (stone, 0.15), and #546 has built it with its
  cures: Absolve, the Quickening Draught (2,000 gold, the trader's at Akordu and Cinderport's
  chandler's) and a temple, Cinderport's the nearest (MONSTERS §3.3).

### 4.2 E10, the road onto the steppe (#524): country, band 25–26

- **Purpose.** Act IV's last way in, and the Wold's first ground: the road from the Ember Waste
  over the Cinder Hills, the area's gentlest groups, and the crossing line that tells a company
  under the band how the land feels (#166). The Glass's glare is first seen from the hills' crest.
- **Landmarks.** The road from the Waste at 156,312 climbing the Cinder Hills and coming down
  their west foot at 144,300 onto grass; the hills themselves, the box's east half, ash on their
  far side; the lava flow's head at the road's south side, seen and not crossed; the first steppe
  west of the hills; a Riders' cairn where the grass begins.
- **Points of interest,** about six features and five groups:
  - the road's crest, with the line that says the Wold's band (#166) and the glare to the west;
  - a camp in the hills' lee (#45), and a shrine on the crest, the Riders' sky-stone (#45);
  - a Riders' cairn at the hills' foot, the first of their marks;
  - a Rider met on the road, with a rumour of the camp and of what the vultures mean;
  - the lava flow's head, an event at the box's south edge, the ash hot through boots.
- **Encounters.** Vultures over the hills (two groups, the nearest); a pride of three lions in the
  first grass, the box's hardest; a glass scorpion alone where the flow's heat has burned the grass
  to sand.
- **Quests.** None of its own; the chapter's goal points west over the steppe (§5).
- **The secret and its hint.** A Rider's grave in the hills, a cleft walled with stones, his bow and
  his horse-gear with him. The hint: the vultures circle one place where nothing is dying.
- **New here.** Steppe underfoot (#543); the crossing line said on a hills' crest; the vulture, the
  first monster that flies on the road since the gulls.
- **Finds.** A Horn Bow with a plus, Cinderport's step (#542), in the grave, and gold.
- **Pay.** About 1,500 xp a member.
- **Built** (#517 and #524, 9 October; docs/areas/ashfall.md §4.9): the box whole as the Ember
  Waste's, steppe and grass included, its band raised from 24–26 to 25–26 for the Wold's groups at
  26 (§9, #524's 1). #517 laid the road, the Hills' notch and waymark, the cairns, the Riders'
  sky-stone, a hermit, two cinder drakes at 25 and the secret, the Rider's grave with the Horn Bow +2
  (a cairn that looks back at the Stone, a woman on her saddle and 700 gold in it). #524 added four
  cinder beetles come over from the Waste, on the ash nearest the way in (27,23); six vultures at the
  hills' foot (21,18); a pride of three Wold lions in the first grass west of the Hills (7,23); the
  Riders' camp under the hills by the road (17,22); vultures seen from the road turning over the
  grave's hills (`e10_circle`, 26,26), the grave's second hint; the glare off the Glass from the
  crest (`e10_glare`, 12,18); the Riders' cairn where the grass begins (`e10_mark`, 7,14); and a
  Rider coming up the road (9,13), with word of Akordu and of the vultures, and two outriders on the
  last rise (3,16), who watch and stop nobody, words only. The Wold's line is its zone row's, said
  where D10 is entered (#524's 4). Cut for the gate's day: the second vulture group and the glass
  scorpion (#524's 2), the scorpion placed by D9 and D10 (§4.3, §4.5). It pays 2,543 xp a member,
  662 of it #517's (§8). "Steppe underfoot" cannot be claimed, E10 laying steppe first (ashfall.md
  §11): the owner's.

### 4.3 D9, the steppe (#525): core, band 26–27

- **Purpose.** The Wold itself: open grass with glass in it, the lions' country, the chapter's
  first entry, and the road's long reach west from the hills to Akordu.
- **Landmarks.** The grass glittering where the glass is in it, thickest to the south-west; the
  road's track west and north-west toward the white tents, seen from the box's middle; a well of
  the Riders with its trough; the dunes' first edge at the south-west corner, where the grass
  gives out; the horses of Akordu grazing under a Rider.
- **Points of interest,** about nine features and eight groups:
  - the glass in the grass, an event the chapter keys on (§5);
  - the well (#45, a fountain: it gives endurance once), and a camp beside it (#45);
  - a Riders' cairn on the track, and a second at the dunes' edge;
  - a herder with a rumour of what the horses will not graze;
  - a hermit, a Rider too old to ride, with the first words of the day the sky opened;
  - the dunes' edge, and the glass walker's tracks across it.
- **Encounters.** Two prides of three or four lions, tawny as the grass and seen only when they
  move; vultures over each kill; a group of glass scorpions at the dunes' edge; a glass walker
  alone, walking, at the box's far south-west, the box's hardest at 27 and the first machine seen
  on the Wold.
- **Quests.** The step. The Horse That Came Back begins here if the horse is met on the grass
  before the camp (§6).
- **The secret and its hint.** A glass walker fallen in the grass long ago and grown over, a mound
  with a hollow in its chest where the Riders have never looked. The hint: the horses will not
  graze one patch of grass, and the lions will not cross it.
- **New here.** The glass walkers, a new family, placed here first (#533); a herd as a feature.
- **Finds.** Gold and an elixir in the walker's chest, and a thing of glass the Cartographers at
  Cinderport will pay for (#56's 51 names the trade).
- **Pay.** About 2,000 xp a member.
- **Built** (#525, 9 October): the brief's places, with four groups for its six, laid whole in the
  Wold at 104,254, band 26–27 (§1). The road is the atlas's, squared to four-way steps: in over the
  south edge at 22 to 23,31 (126 to 127,285), where D10's side of the atlas has it and the
  scaffold's 20 to 21 did not, and out at the west edge at 0,21 (104,275), toward the gap (§9,
  #525's 3). The way in is the road's end, 22,31 facing north (§9, #525's 5). A Riders' track of
  trodden earth, 30 squares, leaves the road at 15,26 for the north edge at 16,0 (120,254), in
  Akordu's column, the atlas's road going west and reaching no tent (§9, #525's 4). The four edges
  end the world against D10, C9, D8 and E9, pinned in `tools/tests/outdoors.ts` with void past
  them: the road at 22 to 23 on the south edge, D10's 22 to 23,0 to meet it; the road at 0,21 on
  the west edge, against the atlas's at C9's 31,21 (103,275); the track at 16,0 on the north edge,
  for D8's 16,31 (120,253); and steppe all along the east edge, E9's, parked (#534). E10 touches it
  at the south-east corner only (§1). On the road in, the glass in the grass (`d9_glass`, 18,29),
  the chapter's (§5), and the Riders' well where the track leaves the road, a fountain that gives
  endurance once (14,24), their camp beside it (13,23). Up the track, the tents seen from the
  middle (16,15) and the Riders' cairn on the watch-mound by the north edge (15,3), with 300 gold
  and a Sapphire Vial. The herd grazes in the north-west (4,4) and its herder (9,8) tells what it
  will not graze; an old Rider in the east (28,12), the hermit, has the first words of the day the
  sky opened and leaves the rest to the eldest at Akordu, words only. The prides leave their kills:
  a horse pulled down (28,26), a wild ass's bones (29,3) and the lions' lie, warm (24,17). At the
  dunes' edge, the horse that came back comes in off the dunes toward the herd, glass in its hooves
  and something still in its saddle (`d9_horse`, 8,17), seen and no more (§9, #525's 12); the
  cairn where the grass gives out (7,21), with 300 gold and an Elixir; the Glass seen from a dune's
  top (2,14); and the glass walker's tracks across the dunes' edge (7,27). Eighteen features for the
  brief's nine (§9, #525's 13). Four groups, for the brief's six (§9, #525's 7): a pride of four
  lions at its kill with the three vultures over it, 27,25, the nearest, at 26 and 11 steps from the
  way in; the glass scorpions, 4, at the dunes' edge, 7,26, the group E10 cut (#524's 2); the glass
  walker alone at the far south-west, 1,30, the box's hardest, at 27 and 22 steps in; and a second
  pride with its vultures by the track in the north, 23,6, 26 steps in. The secret is the fallen
  walker: a long mound of rock round a hollow of two squares, 9 to 12,12 to 14, its mouth a secret
  door at 12,13 (116,267) facing east. The hint is the grass: it stands long on the mound where the
  herd has cropped all round, and the lions' tracks go round it (`d9_ungrazed`, 13,13), the herder's
  word its other half. Inside, under the turf, a man of green bronze twice a man's height, one arm
  gone to glass (`d9_fallen`, 11,13), and in his chest the chest (`d9_hollow`, 10,13): 750 gold, an
  Elixir and the Etched Glass, which no shop buys (§9, #525's 10 and 11). It departs from the brief
  in the groups, four for six, the vultures fighting with the prides (§9, #525's 7); in the pay,
  2,940 xp a member against the share of 3,250 (§8, §9, #525's 8); and in the secret, the doc's
  fallen walker where the issue has a lions' den (§9, #525's 10). The step's event, `d9_glass`, is
  the chapter's, #531's, and the horse's quest #532's; the Wold's crossing words, on its zone row,
  are walked at D10 (§4.5; §9, #525's 14 and 18).

### 4.4 D8, the Riders' camp, Akordu (#526): core, band 26–27

- **Purpose.** The Wold's rest and its step: Akordu, the white camp, under its mesa's south face at
  120,250, where the eldest tells the oldest story on that side of the sea (STORY, Act Four), a
  trader sells the band's consumables and leather and a Rider rides a company to Cinderport and
  back (call 5). The camp sells and teaches nothing else (call 7).
- **Landmarks.** The white tents in a ring, the horses' lines, the fires; the mesa above with the
  Riders' watch-fire on its top; the garden of glass at the camp's east edge, its figures facing
  the Glass; the wells; the horse that came back, tethered apart with a walker in its saddle.
- **Points of interest,** about nine features and six groups:
  - the eldest at her fire, the step (§5), and the Lion's Share's other voice (§6);
  - the trader's tent, a shop for consumables and leather at list price (call 5, call 7), the
    Quickening Draught among them (#546);
  - the Rider at the horse-lines, who sells the ride to Cinderport: a `coach` link open from the
    start (#547), a fare and a day, landing at Cinderport's gate, and the same back;
  - the camp, to rest at (#45), the Riders' own; a well, a shrine (#45);
  - the garden of glass, and the mother among the figures (#56's 55);
  - the horse that came back, and the Riders who want it broken (#56's 51);
  - the young Rider at the lines who wants the last blow (#56's 53).
- **Encounters.** A pride of lions that comes at the horses by night (`when`); vultures over the
  garden; a basilisk in the mesa's shade on its north side, the hardest at 27; glass scorpions in
  the broken ground under the mesa.
- **Quests.** The step. The Horse That Came Back, The Lion's Share and The Garden of Glass all
  begin or end here (§6); Orders on the Scarp Stair ends here (§6).
- **The secret and its hint.** A dry well among the camp's wells, its shaft walled off at the
  bottom with a Rider's hoard behind: what they have taken from the walkers over the years, and
  will not sell. The hint: one well has no rope.
- **New here.** A camp that is an area's rest, with a crossing sold from it (#547); a garden of the
  glassed; a trader on the road who sells leather and nothing of steel.
- **Finds.** Gold in the hoard, and a Leather Coat with a plus, the Riders' own make.
- **Pay.** About 1,200 xp a member, the camp's quests inside it (§6).
- **Note for the builder (#525).** D9's Riders' track ends at D9's north edge, 16,0 (120,254): D8
  meets it at its 16,31 (120,253) or lets it fade into the grass. The atlas's road runs west from
  D9 to the gap and never to Akordu, so the track is the only way laid toward the camp, and the
  atlas may want a road drawn to it here (§9, #525's 4).
- **Built** (#526, 9 October): the brief's places, with three groups for its four encounters, laid
  whole in the Wold at 104,222, band 26–27, the gate holding it at 26, not 27 (§9, #526's 1). The
  mesa stands north of the camp, rock in rows 13 to 22 and columns 10 to 19, as the atlas cuts it:
  the camp lies under its south face and the basilisk in its shade on the north side (§9, #526's
  2). The camp is trodden earth in an oval round the fires, 67 squares, its rest the camp feature at
  16,27; nine squares of white felt make the ring of tents: the eldest's against the mesa at 16,23,
  five round the ring and the trader's, three squares and a door at 21,27 facing in (§9, #526's 3).
  The start is the end of D9's Riders' track on the south edge, 16,31 facing north, its earth going
  on into the ring; the ride's landing at the horse-lines, 9,27 facing east, is the second way in
  (§9, #526's 4). The four edges are pinned in `tools/tests/outdoors.ts`: the south square for
  square with D9's north (steppe at 0 to 15, the track at 16, steppe at 17 to 31), the west square
  for square with C8's east (#528, §4.6) and the others in the void, the north against a box that is
  not built and the east against E8's (parked, #534). The ride's Akordu end is on the crossing
  (`src/content/crossings.ts`):
  the landing at the horse-lines and the Rider there (9,26) who sells it, 325 gold and a day,
  leaving at 14 and coming in at 9; it runs both ways now, Cinderport's Rider at the gate (9,13)
  selling it from his end (§9, #526's 5). The Trader's Tent (21,27) is a shop with a room of its
  own, `akordu_trader`, drawn for it in `src/ui/interiors/glasswold/`; it sells consumables, the
  Quickening Draught and the Leather Coat, nothing of steel (§9, #526's 6 and 7). The eldest sits
  before her tent (16,24) and tells the story once, her words below (§9, #526's 11); the Rider at
  the lines, a young Rider (8,29), a Rider with a hammer (5,25) and a woman among the figures
  (26,27) have words only (§9, #526's 12); the horse that came back stands tethered apart at 4,24,
  seen and no more (§9, #526's 13). East of the ring is the garden of glass, six crystal squares,
  its figures facing south-west, a boy among them with his hand to his eyes and the vultures
  turning over it (§9, #526's 14); under the mesa the watch-fire seen from below, smoke by day and a
  fire by night (15,23), a shrine of horses' tails (19,21) and two wells beside the dry one (§9,
  #526's 15 and 16); thirty features for the brief's nine in all (§9, #526's 17). Three groups, for
  the brief's four: a pride of four lions by night, 4,21, west of the lines; six glass scorpions in
  the broken ground under the mesa's east face, 22,17, the nearest, at 26 and 20 steps from the way
  in; and the basilisk alone, 13,12, the box's hardest, at 27 and 30 steps in. The vultures over the
  garden are seen, not fought (§9, #526's 8). The secret is the dry well with no rope. Its hint is
  a well against the mesa's foot with its windlass bare (`d8_ropeless`, 13,23); its mouth a secret
  door at 13,22 (117,244), searched facing north, into a hollow of two squares in the rock, 12 to
  13,21: bronze plates, a lamp of glass and a hand of metal laid in rows, what the Riders took from
  the walkers (`d8_hollow`, 13,21); and their chest (`d8_hoard`, 12,21), 1,500 gold and the Leather
  Coat +2 (§9, #526's 10). It departs from the brief in the band, 26–27 for 27; in the groups,
  three for four; in the pay, 1,901 xp a member against the share of 1,950 (§8, §9, #526's 9); and
  in the mesa's faces, corrected above (§9, #526's 2). The step on `akordu_story` is the chapter's,
  #531's, and the Akordu ends of 51, 53, 54 and 55 are #532's (§9, #526's 11 and 12).
- **The eldest's words,** verbatim, for the owner's review (§9, #526's 11). At the first meeting,
  which sets `akordu_story`:

  > The eldest sits at her fire before her tent, a horse-blanket round her and her braid white to the waist.
  >
  > "On the day the sky opened, the grass stood still and the birds came down out of the air."
  >
  > "A door stood open in the sky to the south-west. Something went up to it on a pillar of fire, slow, as a heavy thing climbs."
  >
  > "Halfway, the fire failed. It fell, and where it fell the land burned three days, and cooled to glass."
  >
  > "What lies in the glass tried to leave. The sky opened for it. Remember what that cost, if anyone ever offers to open it for you."

  After it, once the flag holds:

  > The eldest looks into her fire.
  >
  > "That is the story as the young hear it. The rest is for those who have earned it."

  The camp's other people:

  - The Rider at the lines: "East to the port, a day over the grass and the ash. We go at two, and we do not wait."
  - The young Rider: "They hunt the Grey Lion at the turn of the year, and the last blow is the youngest's. I have asked for it. The eldest says let him die."
  - The Rider with a hammer: "The horse is ours. What sits on it is not. When it moves, I break it."
  - The woman among the figures: "My son went to look at the basilisk under the mesa. He is looking still."

### 4.5 D10, the mesas (#527): core, band 26–27

- **Purpose.** The basilisks' country south of the camp: the mesas, the mesa fight, and the glassed
  figures on the ground round each, who looked up.
- **Landmarks.** The great mesa at 128–136,284–293 where the Eyrie stood until call 5, its top
  empty but for a cold fire-ring; the small mesa at the box's south-west; the hills under them; the
  glassed figures, three or four to a mesa, all facing one way; the dunes' edge at the box's west
  seam with C10, and the Glass's glare beyond.
- **Points of interest,** about nine features and eight groups:
  - the great mesa's top, reached by a way the glassed dead point at, and the view from it: the
    Glass whole, and the Tower's crown in it;
  - the glassed figures, an event at each, the last one a Rider with his bow still drawn;
  - a cairn, a camp in the hills and a shrine, the Riders' sky-stone (#45);
  - a Rider who watches the mesas from a hill and will not go nearer, with a rumour of the garden.
- **Encounters.** The mesa fight at the great mesa, a basilisk behind a pride of lions, the lions
  keeping the front row busy while the basilisk glasses whoever looks up (MONSTERS §8.3), the
  box's hardest; a basilisk alone under the small mesa; two prides in the grass; vultures; glass
  scorpions at the dunes' edge.
- **Quests.** None of its own; the garden's dead are its (§6).
- **The secret and its hint.** The way up the great mesa, a notch in its north face above a scree,
  and on top the basilisk's nest among the glassed bones of what looked up, with the hoard they
  carried. The hint: every glassed figure round the mesa faces the same notch.
- **New here.** Stone and its cure (#546), first spent here; a fight won by not looking up.
- **Finds.** Gold, a Shield with a plus, Cinderport's step (#542) and a Quickening Draught, the
  stone cure (#546), so a company that climbs without one is not stranded.
- **Pay.** About 2,000 xp a member.
- **Built** (#527, 9 October): the brief's places, with five groups for its eight, laid whole in the
  Wold at 104,286, band 26–27 and not 27: a floor of 27 asks a group at 28, and the Wold's only 28
  is the Grey Lion, B8's (§9, #527's 1). It is the Wold's way in and joins E10 to D9. The road is
  the atlas's at both edges, 31,6 on the east and 22 to 23,0 on the north, and square to square
  between, 22 squares: west along the great mesa's south foot, then north up its west side, where
  the atlas's diagonal ran over the mesa's rock (§9, #527's 3). The way in is its east end, 31,6
  facing west (135,292), where E10's road comes over (§9, #527's 2). The great mesa stands in the
  north-east, rock at 24 to 31, rows 0 to 5, with D9's rock above it on its rows 30 to 31 (the doc's
  128–136,284–291); its top is an enclosed grass of 18 squares at 25 to 30,2 to 4, the Eyrie's cold
  fire-ring at 28,3 (`d10_ring`, 132,289). The small mesa is the atlas's west outcrop, rock at 0 to
  3, rows 15 to 22, and hills lie under both (§9, #527's 4 and 7). The secret is the way up, a door
  at 26,1 (130,287), entered going south from 26,0, with the top inside it. The notch is on D10's
  side, over a scree inside the mesa: the mesa's true north face is D9's, built (rows 30 to 31), and
  D10 holds a nook of scree at 24 to 26,0 between D9's rock and its own, open to the road at 23,0,
  with the face over it facing north (§9, #527's 5). The hint is the last glassed figure, a Rider
  with his bow still drawn, the arrow aimed up at the mesa's face above the scree
  (`d10_glassed_rider`, 21,4). The four round the great mesa stand on one line out from the scree
  (15,10; 17,8; 19,6; 21,4), each facing north-east, and the small mesa's three (6,16; 6,19; 6,22)
  all face it, west; no text names the notch (§9, #527's 6). On the top, the nest of scraped stone
  among glass bones, every head up (`d10_nest`, 26,2); the hoard (`d10_hoard`, 25,2), with 1,100
  gold, a Basalt Shield +2 and a Quickening Draught (the stone cure, so a company that climbs
  without one is not stranded); and the view west (`d10_view`, 25,4): the Glass whole and a dark
  crown standing up out of the glare, nothing said of what it is. Round the box, the mesa seen from
  the way in (`d10_mesa_seen`, 29,7); the Riders' cairn in the north (12,2), with 400 gold and an
  Elixir; a Rider on a hill (8,7), words only, who goes no nearer and says where the ones carried
  home stand; the glare past the dunes (1,4); the near pride's kill (28,13) and the lions' lie
  (14,16); a camp in the hills (10,29); the Riders' sky-stone (18,24), a shrine that gives luck,
  where E10's gives accuracy and D9's well endurance; a horse's bones (2,27) and a glass hare
  (27,27). Twenty-one features for the brief's nine (§9, #527's 13). Five groups, for the brief's
  eight (§9, #527's 8): a pride of four lions at its kill with the three vultures down on it
  (`d10_pride`, 27,11) and a second pride of four in the grass (`d10_pride_south`, 28,17), 9 steps
  each from the way in and the nearest, at 26; the mesa fight, three lions in the scree with the
  basilisk behind them (`d10_mesa`, 24,0), 15 steps in; four glass scorpions at the dunes' edge
  (`d10_scorpions`, 4,3), a second group after D9's, the lone scorpion E10 cut (#524's 2) placed
  twice over; and a basilisk alone in the small mesa's shade (`d10_basilisk`, 4,19), the box's
  hardest at 27 and 40 steps in. The Wold's crossing words, on its zone row, are walked here first,
  over E10's west edge onto 31,6 (§9, #527's 14): a company at 26 or over reads "The Wold." alone;
  at 25 or 24, "The Wold. The grass is long, and what hunts in it is harder than the road behind.";
  at 23 or under, "The Wold. Nothing that hunts the grass would spare you. The way back is still
  open."; going straight back says nothing. D10 onto D9 says nothing: one land. The edges: east,
  D10's rock on rows 0 to 5 against E10's steppe and hills, the road at 31,6 against E10's 0,6
  (136,292), hills on row 7 and steppe on rows 8 to 31 open both sides; north, dunes, hills and
  steppe on columns 0 to 21 open against D9's, the road at 22 to 23 (126 to 127) on both, D10's
  scree at 24 to 26 against D9's rock and its rock at 27 to 31 against D9's rock and steppe; west
  and south end the world against C10 and D11, the Glass's and parked, with void past them, all
  pinned in `tools/tests/outdoors.ts`. It pays 3,199 xp a member, 0.98 times the scaled share of
  3,250, and 1,500 gold (§8, §9, #527's 11 and 12). It departs from the brief in the band, 26–27 for
  27; the groups, five for eight, the vultures fighting in the near pride; the notch, over a scree
  inside the mesa and not in its north face; the hint, the doc's figures facing the notch where the
  issue has the garden's mother; and the pay, the doc's share over the issue's 2,000.

### 4.6 C8, the Scarp's edge (#528): country, band 26–27

- **Purpose.** The steppe's north edge over the Saltings: the Scarp's lip, the stair's head, and the
  Riders' watch on it. The way a company that came up from Saltreach enters the Wold, two acts
  early, and is told so.
- **Landmarks.** The Scarp as the box's north edge, cliff seen from above with the pans glittering
  below; the stair's head at 80,216, on C7 (§1), with the way past the fallen flight; a Riders'
  watch-cairn and a yurt at the head; the grass running south to Akordu.
- **Points of interest,** about five features and four groups:
  - the stair's head and the line that says the Wold's band to whoever climbs it (#166);
  - the Riders' watch, two Riders who ask the company's business and send it to Akordu;
  - a cairn, a camp (#45);
  - the Compact runner, on the stair's top flight (#56's 54, §6);
  - the lip, and the view down over the Saltings.
- **Encounters.** Vultures on the lip's updraught; a pride of lions in the grass; a basilisk in the
  hills at the box's east, the hardest.
- **Quests.** Orders on the Scarp Stair (§6).
- **The secret and its hint.** A cleft under the lip, east of the stair's head, where the Compact's
  runners leave what they carry up when the Riders will not take it: the Dead-Drop's last three
  drops, gold and a letter the company cannot read. The hint: a horse's tracks run along the lip
  where no Rider rides.
- **New here.** A way into an area from two acts back; the Scarp seen from its top.
- **Finds.** Gold, and the letter for Lantern Watch's reader (#204) or the Compact's hall.
- **Pay.** About 1,000 xp a member.
- **The stair.** The head is on C7, Saltreach's map, which closed the Glasswold's 301 squares as
  mountain and left the lowest flight fallen (docs/areas/saltreach.md §9, #178's 3 and 4). C8 builds
  the way past the fall and rewrites C7's notch event, an edit outside the area's folder, with the
  owner's leave (#412, #528). As built it opens the stair's nine squares and no more: C7's column 8,
  rows 23 to 31 (80,213 to 80,221), goes from mountain to stone, nine flights between mountain, and
  the other 292 stay closed, since opened whole they would be the Wold's grass on a band 11–12 map,
  walked with no line until C8 and bare of points (§9, #528's 3). The notch at 8,22 and the track
  from 8,16 are as they were; `c7_stair` now reads "The stair's foot: its lowest flight fallen with
  the face. A rope ladder hangs past the fall, pegged to the flight above." (§9, #528's 4). The
  link stays the plan's, 80,206 to 80,216, and is walked and not moved or jumped: the flights meet
  C8's last flight at 8,0 (80,222) and the Wold's crossing line is said on the step onto it, the
  stair's head being the border (§9, #528's 2). As built the foot is the notch at 80,212 and the
  head the watch at 80,223. C7's groups, gate lines and density are as they were, the nine squares
  lying within nine steps of `c7_stair`. The stair is open both ways from the start, no flag and no
  lock: the walkthrough climbs it at 12, 25 and 26 and comes down again.
- **Built** (#528, 9 October): the brief's places, with three groups for its four and nineteen
  features for its five, laid whole in the Wold at 72,222, band 26–27 and not 27, the gate holding
  it at 26: a floor of 27 asks a group at 28, and the Wold's only 28 is the Grey Lion, B8's (§9,
  #528's 1). It is the fourth map on the Wold's zone row, after D10, D9 and D8. Its start is the
  stair's head, 8,1 facing south (80,223), which the curve's rise reads; a company on the road walks
  in over the east edge from D8 as well (§9, #528's 5). Of its 1,024 squares 992 are open: steppe
  923, hills 54, cliff 23, earth 11, rock 8, stone 3 (the last flight and the cleft), felt 1 and
  the secret door 1. The lip is its north edge, a row of cliff but for the last flight at 8,0, a
  knot of rock at 21 to 24 where the cleft lies and steppe at 28 to 31, where the lip bends north
  toward D7. The Wold's crossing words, on its zone row, are walked here from the Saltings, on the
  step from C7's 8,31 onto 8,0 (§9, #528's 2 and 8): a company at 26 or over reads "The Wold."
  alone; at 25 or 24, "The Wold. The grass is long, and what hunts in it is harder than the road
  behind."; at 23 or under, a company at 12 among them, "The Wold. Nothing that hunts the grass
  would spare you. The way back is still open." At the head a Rider gets up at the cairn and says
  it again in his own words (`c8_line`, once), a warning and not a wall. The watch is trodden
  earth, 11 squares, round the head: the yurt, one square of white felt in Akordu's palette (6,2);
  the watch-cairn (9,2) with 200 gold and an Elixir; the two Riders (10,1), who ask the company's
  business and send it on to Akordu; and the fire, a `camp` (#45) (9,3), where a company may rest
  (§9, #528's 6). On the last flight, 8,0, a Compact runner gets her wind: she carries the
  Dead-Drop's orders for the Riders and does not name the cleft (§9, #528's 7). Both are words
  only, and the runner's quest (#56's 54) is #532's. The lip has the view down over the Saltings
  (`c8_view`, 4,1), the edge (15,1) and the updraught (26,2); the grass is seen running south and
  east to Akordu, its smoke (16,9), the Riders' waymarks (27,10), a runner's satchel torn open
  (4,12), the pride's lie (15,17), an old skull (21,21), the herd's grazing (4,25) and the Glass's
  glare past the dunes (15,28); and in the hills stands a lion of glass (25,24), the basilisks'
  sign. Three groups, the fewest that bring the day inside its aim (§9, #528's 9): six vultures on
  the lip's updraught (`c8_vultures`, 27,3), 21 steps from the head; a pride of four lions at its lie
  in the grass with three vultures waiting over it (`c8_pride`, 12,19), 22; and two basilisks in the
  hills at the box's east (`c8_basilisk`, 28,27), the hardest at 27 and 46 steps in. None stands
  within 12 steps of the head, so a company that climbs at 12 hears its line and can walk back down.
  The secret is the cleft (§9, #528's 12). The hint is a horse's prints (`c8_prints`, 22,3, not
  once) along the lip to the rock and back: shod, where the Riders' horses are unshod, and no text
  says so. The mouth is a secret door at 22,2 (94,224) in the knot of rock, searched facing north;
  the cleft behind it, at 22 to 23,1, is stone, shut by rock on every side, rock and not cliff, since
  a Mountaineer climbs cliff and mountain and not rock. In it are three bundles in oilcloth sealed in
  black wax (`c8_cleft`, 22,1) and the chest `c8_drops` (23,1): 900 gold and a Letter in Cipher,
  the Compact's last three drops. Nobody on the Wold reads the letter and no shop buys it (§9,
  #528's 13; §11). The edges: north, C7's row 31, mountain but for the flight at its column 8
  (80,221) and void at its corners, against C8's row 0, cliff at 0 to 7, the last flight at 8, cliff
  at 9 to 20, the cleft's rock at 21 to 24, cliff at 25 to 27 and steppe at 28 to 31, open only at
  column 8; east, D8's west edge square for square (x 103 against x 104), steppe at rows 0 to 17,
  hills at 18 to 19, steppe at 20 to 24, hills at 25 to 30 and steppe at 31, all walkable, and
  nothing said over it: one land; the west, the lip's cliff at row 0 and steppe below it, lies
  against B8 (#529) and the south, steppe at 0 to 26, hills at 27 to 28 and steppe at 29 to 31,
  against C9, the Glass's and left to the reach, and the world ends at both. All are pinned in
  `tools/tests/outdoors.ts`. It has no exit: it is reached over D8's west edge and up the stair
  from C7, and `CUT_OFF` stays empty. It pays 1,822 xp a member, 1.10 times the scaled share of
  1,650, and 1,100 gold, the cleft's 900 and the cairn's 200 and an Elixir (§8, §9, #528's 10 and
  11). It departs from the brief in the band, 26–27 for 27; the basilisks, two for one; the squares
  of C7 opened, nine for 301; the novelty, none claimed (§9, #528's 14); and the pay, the scaled
  share over the brief's about 1,000 (§9, #528's 17).

### 4.7 B8, the Wold's heart, and Kushtash (#529): core, band 28

- **Purpose.** The far west under the rim: the Grey Lion's ground, the Riders' hunt, and Kushtash,
  the bird's rock, the far-west mesa where the scout who guided the Meridian Company keeps her
  lookout, the Ranger's third prestige (DESIGN §5, #448). The band's top on the Wold.
- **Landmarks.** Kushtash at about 46,242, the tallest mesa of the Wold, its top out of sight; the
  second mesa east of it; the lion's kill-ground between them; the rim as the box's west edge; the
  Riders' hunting camp.
- **Points of interest,** about nine features and eight groups:
  - the Grey Lion's ground, the boss;
  - the Riders' hunting camp, the young Rider and the eldest's word (#56's 53, §6);
  - Kushtash's top, the scout at her fire, who teaches the Unerring for the Meridian journals'
    quest and nothing else (#448);
  - the way up Kushtash, the box's secret;
  - a cairn, a shrine (#45), a well;
  - a hermit under the rim, a Rider who went into the Glass once and came out, with the walkers'
    look in his words.
- **Encounters.** The Grey Lion, boss, level 28, old and scarred, alone or with his pride once it
  has fallen back to him; a basilisk behind a pride at the second mesa, the mesa fight at 28; two
  prides; vultures over the kill-ground; a glass walker come up from the dunes to the box's south.
- **Quests.** The Lion's Share (§6). The Ranger's third (#448): the quest's own fights are set at
  26 where it goes down Fire Mountain's vents, and the scout waits here while it does.
- **The secret and its hint.** The way up Kushtash, a stepped scree on the mesa's rim side where the
  stones have been set, not fallen, and a ledge path from its top. The hint: smoke from the top by
  day and a fire by night, and the vultures never land there.
- **New here.** A third prestige's trainer on a mesa top; the area's boss on open ground.
- **Finds.** Gold and an elixir at the lion's kill-ground; the scout gives nothing but the prestige.
- **Pay.** About 2,600 xp a member, the Grey Lion's on the hunt.

### 4.8 B9, the Glass's edge (#530): country, band 28

- **Purpose.** Where the Wold ends: dunes to the rim's foot, the gap at the mesas and dunes where
  the Glass is entered, the Riders' watch on it, and the glass walkers walking out. The chapter's
  last step on the Wold, and the reach's one door, seen and not opened.
- **Landmarks.** The dunes, the box's half, shifting with the wind; the rim down the west; the gap
  at the box's south-east seam with C9, where the dunes give way to glass, the Riders' watch-yurt
  on the last grass; the Glass beyond, the glare, the Tower's crown at 84,280 standing out of it; a
  glass walker's tracks across the sand, one set, going out.
- **Points of interest,** about five features and five groups:
  - the Riders' watch, three Riders who keep the gap and say what it keeps, the step (§5); the
    crossing line into the Glass is theirs to say (#166), the cap's band and the reach's word;
  - a cairn at the dunes' head, a camp on the last grass (#45);
  - the walker's tracks, an event that ends at the glass's edge, where sand becomes glass underfoot.
- **Encounters.** Glass scorpions in the dunes (two groups); vultures; a glass walker alone at the
  dunes' middle; two glass walkers at the gap, the hardest, and the only group a company need not
  fight to see the Glass.
- **Quests.** The step. The Horse That Came Back's horse came this way (§6).
- **The secret and its hint.** A walker that stopped half-buried in a dune long ago, its chest
  open to the sand and a cache in it: gold, and the first thing of the Tower's a company can hold,
  a piece of glass with a light in it that does nothing yet (Phase 1.6's to make do something). The
  hint: the dunes shift, and one does not.
- **New here.** Dunes underfoot (#543); the reach seen from the road, and its band said; a machine
  that walks in a pair.
- **Finds.** Gold, and the glass with a light in it, a plain item until the reach.
- **Pay.** About 1,600 xp a member.

### 4.9 E9 and E8, the country behind (#534): country, band 27–28, parked

- **Purpose.** The hills north of the road down to the coast, and the shore: the Wold's back,
  built once the owner has played the act (call 9).
- **Landmarks.** The hills' north face over the sea; the shore; the Riders' summer pasture.
- **Encounters.** Prides, vultures, a basilisk in the hills; nothing of the Glass.
- **Pay.** About 800 xp a member for E9 and 400 for E8, a first guess outside §8's sum.

## 5. The one quest here

The Glasswold's chapter is The Warning (`chapter.ts`, #531), joined after Ashfall's The Window, and
the Wold, the one zone on the road here, holds its steps (EXPANSION §5.8); the Glass is declared
the reach and is exempt. Its entries and goals, in the journal's voice, keyed to flags, events and
maps the save holds:

- **The way in.** From the Waste the road climbs the Cinder Hills and comes down onto grass; the
  goal points west over the steppe to the horse people's white tents.
- **The grass.** There is glass in it, and it glitters to the south-west for miles: this land
  burned once. The goal goes on to Akordu. D9 lays the event this keys on, `d9_glass` at 18,29 on
  the road in; the step is #531's (§9, #525's 13 and 18).
- **Akordu.** The eldest tells the oldest story on that side of the sea: long ago a door opened in
  the sky, something rose toward it on a pillar of fire and fell, and the land where it fell burned
  to glass. *What lies in the glass tried to leave. The sky opened for it. Remember what that cost,
  if anyone ever offers to open it for you.* The goal turns west, to the way into the Glass. D8 lays
  the flag this keys on, `akordu_story`, set by her telling and exported as `STORY` from the map;
  the step is #531's (§9, #526's 11).
- **The gap.** The Riders keep the only way in, three of them at a fire on the last grass, and they
  are right to: something walks out of it now and then, and has walked a long way. The Glass is
  seen, and the Tower's crown in it. The goal turns back east, to Cinderport and the last crossing,
  Ashfall's (#512).

The Wold holds the step; the Glass is the reach, and no step of the quest lies in it (EXPANSION
§5.8). Nothing in the chapter is a lock (EXPANSION §2.3): the Riders' watch keeps the gap with
words and its band, not a wall, the ride to Cinderport is a fare and the stair is open both ways.
The walkthrough plays it at 26, 27 and 28, in order, and once with the Wold entered by the Scarp
stair from the Saltings, the journal still true.

STORY has the eldest tell her story at the port, where the Riders come down to trade; the chapter
puts her at Akordu, her own fire, with the Rider's ride between (§9).

## 6. Side quests

#56's four for the Glasswold, all standing by call 9 (#443), each built with its box on the
systems of #76 (#532); 51 and 54 are given from Cinderport's halls (call 7), since the camp sells
and teaches nothing but its trade:

| # | Quest | Level | Where | What it needs | Built in |
|---|---|---|---|---|---|
| 51 | The Horse That Came Back | 26 | the Cartographers' hall at Cinderport (#512); the horse at Akordu (D8); the Glass's edge (B9) | a choice put by a person; a hand-in at the first meeting (#43) | #526, #530, #512 |
| 53 | The Lion's Share | 27 | Akordu (D8); the hunting camp and the Grey Lion (B8) | a choice put by a person; `after` (#41) | #526, #529 |
| 54 | Orders on the Scarp Stair | 27 | the Compact's hall at Cinderport (#512); the runner on the stair (C8); the Riders at Akordu (D8) | a letter read from the pack (#76); a three-way choice; a hand-in (#43) | #528, #526, #512 |
| 55 | The Garden of Glass | 28 | the garden at Akordu (D8); the temple at Cinderport (#512) | the Rider's ride with a passenger (#547); stone's cure at a temple (#546) | #526, #512 |

**The Horse That Came Back** (51). A Rider's horse strayed into the Glass and came back with glass
in its hooves and a glass walker in the saddle, sitting still. The Riders want it broken; the
Cartographers' guildsman at Cinderport wants it whole for the map, the first thing out of the Glass
anyone has held. Broken, the Riders say what they saw it do on the way home; carried whole, the
Guild's map gains the Glass's edge.

**The Lion's Share** (53). The Riders hunt the Grey Lion as a rite, and a young Rider asks to
strike the last blow. The eldest says the lion is old and should be let die. Hunt it with the boy
and he is a Rider, and the camp trades: what that adds once the trader sells from the start (call
5) is #532's to settle. Let it die, and the eldest tells the rest of the story of the day the sky
opened, the part the chapter does not: words only, and the secret found in them, never told.

**Orders on the Scarp Stair** (54). A Compact runner on the stair's top flight carries orders from
the Dead-Drop for the Riders: coin to buy their silence about the Glass. Deliver them, and the
Riders take the coin and say nothing; give them to the Riders as what they are, and the Riders shut
the Glass to the Hand; burn them, and the runner's next climb finds the company. The Compact's hall
at Cinderport gives it (DESIGN §10.2).

**The Garden of Glass** (55). The Riders keep a garden of their glassed dead at Akordu's edge, the
ones who went to look at the basilisk. A mother asks that her son be carried to the temple at
Cinderport: the Rider's ride takes him (#547). Carried, he wakes cured and says what he saw before
his eyes went: the Buried Tower's crown, and something moving on it. The reach's first rumour, left
for Phase 1.6 to pick up.

### The third prestiges

Two of DESIGN §5's thirds sit in the Glasswold (#448, call 8). The Ranger's is built with B8: the
scout on Kushtash names the Meridian journals and sends the company down Fire Mountain's vents to
Meridian Camp for Oriel Fane's map, Ashfall's dungeon (#441), and teaches the Unerring when it is
brought back. The Sorcerer's, at the Buried Tower's crown, is the reach's and waits for Phase 1.6;
until then the seeking quest names the place (DESIGN §5) and the gap's Riders say what stands
between.

## 7. Encounters, and what is new

MONSTERS §8.3 has the roster and the fight: the Vulture (fodder, 26, the birds), the Wold Lion
(skirmisher, 26, the cats; prides of three or four), the Glass Scorpion (controller, 26, the spider
frame; poison 0.35), the Basilisk (controller, 27, the salamanders; stone 0.15), the Glass Walker
(elite, 27, the glass walkers, new; a machine older than the rest) and the Grey Lion (boss, 28, the
cats); the mesa, a basilisk behind a pride, the lions holding the front row while the basilisk
glasses whoever looks up. Their drawings are #533's, six, all drawn (§3): five on frames that exist,
the Grey Lion the cats' with a mane, and the glass walker the first of its new family. §4.2 to §4.8
place every group, box by box, the vultures at the hills' foot and the walkers in their pair at the
gap. D9's vultures fight with its prides, three to a pride, and have no flocks of their own: they
land where something is about to die, and six groups failed the gate (§4.3, §9, #525's 7). D10's
near pride has its three, for the same reason (§4.5, §9, #527's 8). D8's vultures turn over the
garden and never come down, seen and not fought, and its basilisk stands alone, since the curve
wants the hardest group to average 27 and only a basilisk or a walker is 27 (§4.4, §9, #526's 8).
C8's pride has its three too. Its vultures come as a flock of six on the lip's updraught and its
basilisks stand as a pair, one having run the day past its aim (§4.6, §9, #528's 9). The Wold
spends MONSTERS §3.3's stone (#546), first at D10, where the basilisk is placed, behind the mesa's
lions and alone under the small mesa (§4.5, §9, #527's 15 and 16), and again at D8, alone in the
mesa's shade (§4.4), then at C8, a pair in the hills (§4.6); the sweep (#545) and the toll (#544)
are the Whitespine's and Ashfall's, spent before it.

New in the Glasswold, for the novelty check (EXPANSION §5.4): the glass walkers, a new family, and
dunes underfoot (#543), both claimed by D9, which places them first (§9, #525's 15); steppe
underfoot, E10's first; stone and its cure (#546), claimed by D10, which places the basilisk first
(§9, #527's 15); a camp that is an area's rest, with a `coach` sold from it (#547), built at Akordu,
though the check refuses the camp landmark, which is on the road before (§9, #526's 18); the reach
seen from the road and its band said. C8 claims nothing of its own (§9, #528's 14). Its landmarks: a mesa, a camp of tents, a garden of the
glassed, a lava flow seen, a cliff from its top.

## 8. The numbers

- **Experience.** The curve (EXPANSION §5.2, #159) gives an area the climb from its floor to the
  next area's floor, divided by 0.75: from 26 to 28, Hearth Isle's floor, that is 15,800 / 0.75,
  about 21,067 xp a member, with today's `xpForLevel`. The shares of §4 are the epic's: E10 1,500,
  D9 2,000, D8 1,200 (the camp's quests inside it), D10 2,000, C8 1,000, B8 2,600 (the Grey Lion's
  on the hunt), B9 1,600 and the four side quests about 1,000 between them: 12,900, about three
  fifths of the curve. The gap is for the owner, and the briefs are expected to close it as every
  box built so far has come over its share: a fight inside the gate's aim costs what it costs
  whatever its monsters (docs/areas/saltreach.md §8, about 300 a member at 11, and several times
  that at 26), and the briefs' groups, about forty across the seven boxes with the boss, are priced
  by their fights when each box is built and recorded here as built. If the first box says the
  shares cannot reach 21,067 inside the gate's fights to a rest, the curve's row is #542's to weigh.
  A kill pays by level (#159), so a company that arrives at 26 earns the shares as written and one
  at 28 earns less; the curve's row reports what a clear falls short of as owed to #447 until the
  boxes exist.
  Scaled to the curve, which §9 proposes as the briefs' working figures until each box is built,
  the shares are E10 2,450, D9 3,250, D8 1,950, D10 3,250, C8 1,650, B8 4,250, B9 2,600 and the
  side quests about 1,650: about 21,050. The issues (#524 to #532) carry the first figures until
  their briefs are settled.
- **Gold.** Training six members from 26 to 28 costs about 12,720 with today's `trainPrice`, and
  nothing on the Wold trains: Cinderport teaches to 27, a Rider's ride away (call 5, #547), and 28
  is Hearth Isle's to teach or the owner's to place. A clear should pay for the training at least,
  in the hoards, the drops and the quests' pay, and the ride's fare on top; the band's price window
  is 6,000 (#542), and no find or ware comes within 400 of it (docs/areas/saltreach.md §9, #399's
  4). The Wold adds no rung: Akordu's trader sells consumables and one Leather Coat (armour 12,
  2,400 gold, off the ladder), and a company that rides to Cinderport buys there, the armourer's
  step 1,400 to 3,100 gold (docs/areas/ashfall.md §8).
- **The gate.** The gate check (`tools/tests/gate.ts`, #38) holds each box at its own floor
  (docs/areas/thornmark.md §9, 17): a company at 26 wins nine in ten of E10's fights and walks the
  road over the hills resting at its camp; one at 24 wins no more than one in four. The Grey Lion is
  won about half the time at 28 and nearly always at 30. The reach's own gate is the cap's
  (EXPANSION §5.2) and not this doc's. A company that climbs the Scarp stair from the Saltings at
  12 meets C8's line on the step onto the lip and, 21 steps from the head, its vultures: a warning,
  not a wall, and a fight it can run from.
- **Density.** Core boxes at the Foreland's floor, country at the looser one (EXPANSION §5.3).
- **As built.** E10 (#517, #524) pays 2,543 xp a member, 1.04 times its scaled 2,450, and 950 gold,
  counted in Ashfall's row since its map is the Waste's (20,142 of 19,467, the row's xp met). At its floor, 25, a
  company wins every fight and manages 10.83 fights to a rest (aim 9.25 to 11.25), 7.7% of days
  ending in a fight broken off; two under, its groups count in Ashfall's pool, all won (owed to #18).
  Density 100.0% within 12, no sign among its 24 points.
- **As built, D9** (#525). It pays 2,940 xp a member, 0.90 times its scaled 3,250 (each pride 947,
  the scorpions 689, the walker 358), and 1,350 gold: 300 and a Sapphire Vial in the track's cairn,
  300 and an Elixir in the dunes', 750 with an Elixir and the Etched Glass in the hollow. The
  Glasswold's row is owed to #447 for the rest: a clear gives 2,940 xp a member of the 21,067 asked
  and 1,350 gold of the 12,720. With the other scaled shares (17,800, E10's 2,450 among them) the
  area comes to about 20,740, 0.98 times the ask. At its floor, 26, a company wins every fight and
  manages 9.67 fights to a rest (aim 9.5 to 11.5, limit 8 to 14), 16% of days ending in a fight
  broken off, and walks the Wold's road, the four groups in the order of their steps from the way
  in, every time; two under, at 24, it wins every fight too, owed to #18 as the Glasswold's pool is.
  The pay stands under the share because the day sits at the aim's foot: no group more fits (§9,
  #525's 8). Density 99.8% within 8 steps (1,003 of its 1,005 open squares) and the furthest 9, with
  no sign among its 22 points.
- **As built, D10** (#527). It pays 3,199 xp a member, 0.98 times its scaled 3,250 (the near pride
  947, the south pride 689, the mesa 695, the scorpions 689, the basilisk 179), and 1,500 gold: 400
  and an Elixir in the Riders' cairn, 1,100 with a Basalt Shield +2 and a Quickening Draught in the
  hoard. The shield, 1,700 gold, is the dearest find against the window of 6,000. The Glasswold's
  row is owed to #447 for the rest: a clear gives 6,139 xp a member of the 21,067 asked and 2,850
  gold of the 12,720. With the other scaled shares (E10 2,450, D8 1,950, C8 1,650, B8 4,250, B9
  2,600 and the side quests 1,650) the area comes to about 20,690, 0.98 times the ask. At its floor,
  26, a company wins every fight and manages 10.76 fights to a rest (aim 9.5 to 11.5, limit 8 to
  14), 22.7% of days ending in a fight broken off, and walks the Wold's road, D10's five groups in
  the order of their steps from the way in and then D9's four, every time; two under, at 24, it wins
  every fight too, the two nearest prides included, owed to #18 as the Glasswold's pool is. The
  basilisk is left as the drawing has it, the gate needing no tuning: the mesa fight costs the most
  a fight in the box, 12% at 26, and is 9.2 fights to a rest alone (§9, #527's 9 and 10). Density
  99.4% within 8 steps (965 of its 971 open squares) and the furthest 10, with no sign among its 26
  points.
- **As built, D8** (#526). It pays 1,901 xp a member, 0.97 times its scaled 1,950 (the cap is about
  2,440), and 1,500 gold, all in the hoard behind the dry well, with the Leather Coat +2. The
  Glasswold's row is owed to #447 for the rest: a clear gives 8,040 xp a member of the 21,067 asked
  and 4,350 gold of the 12,720. With the other scaled shares (E10 2,450, C8 1,650, B8 4,250, B9
  2,600 and the side quests 1,650) the area comes to about 20,640, 0.98 times the ask. At its floor,
  26, a company wins every fight and manages 10.95 fights to a rest (aim 9.5 to 11.5, limit 8 to
  14), 17.3% of days ending in a fight broken off; two under, at 24, it wins every fight too, owed
  to #18 as the Glasswold's pool is. From the horse's landing, 9,27, the groups nearest, the pride
  and the basilisk, are won at 24 as often as the median group (100%). The gate holds the box at 26
  though its band is 26–27 (§9, #526's 1). Density 100.0% within 8 steps (919 of its 919 open
  squares) and the furthest 8, with no sign among its 32 points. The dearest find is now the Leather
  Coat +2, 2,700 gold of the window's 6,000.
- **As built, C8** (#528). It pays 1,822 xp a member, 1.10 times its scaled 1,650 (the cap is about
  2,060; the vultures about 516, the pride 947, the basilisks 358), and 1,100 gold: 900 and the
  Letter in Cipher in the cleft, 200 and an Elixir in the watch-cairn. The Glasswold's row is owed
  to #447 for the rest: a clear gives 9,861 xp a member of the 21,067 asked and 5,450 gold of the
  12,720. With the other scaled shares (E10 2,450, B8 4,250, B9 2,600 and the side quests 1,650) the
  area comes to about 20,810, 0.99 times the ask. At its floor, 26, a company wins every fight and
  manages 10.46 fights to a rest (aim 9.5 to 11.5, limit 8 to 14), 22% of days ending in a fight
  broken off; two under, at 24, it wins every fight too, owed to #18 as the Glasswold's pool is. C8
  is off the Wold's road, which stands as it was (§9, #528's 15). The pair of basilisks is what
  brings the day inside its aim: one ran it to 13.1 fights to a rest at 26 (§9, #528's 9). Density
  100.0% within 12 steps (992 of its 992 open squares) and the furthest 12 of 20, with no sign among
  its 22 points. Its dearest find is the Elixir; the area's stays the
  Leather Coat +2, 2,700 gold of the window's 6,000.

## 9. Decisions

Decided by the owner's delegate on 2 October 2026 (#443), and followed here:

1. **The lava flow is drawn** (call 5): a `lava` ridge, width 2, from the road's south side at
   about 160,318 south-west through 150,332, 140,348 and 134,362 to the rim at 130,376. The Glass
   is a dead end with a single way in, the gap at the mesas and dunes (B9 and C9), and EXPANSION
   §5.8's reach check passes.
2. **Akordu is the Wold's rest** (call 5): a camp, a trader who sells the band's consumables and
   leather, and a Rider who carries a company to Cinderport and back, a `coach` link open from the
   start (#547). The Wold trains at Cinderport.
3. **The Buried Tower's band is the cap's,** 30–32, as the Ice Caves' is (call 5; MONSTERS open
   question 3 answered).
4. **The Eyrie moves** from 132,289 in D10 to the far-west mesa under the rim at about 46,242 in B8
   (call 5), where DESIGN §5 already puts it and a third is hard to find.
5. **The camp sells and teaches nothing but that trade** (call 7); 51 and 54 are given from
   Cinderport's halls.
6. **The third prestiges built in Act IV are the Eyrie's** (call 8, #448): the Ranger's, the
   Meridian journals followed down Fire Mountain's vents to Meridian Camp and Oriel Fane's map
   brought back to the scout. The Sorcerer's at the Buried Tower's crown is the reach's (Phase 1.6).
7. **The cuts stand, the country behind is parked and all four side quests stand** (call 9): §11,
   #534, §6.

Proposed, for the owner, each in the issue that would build it:

- **The briefs** of §4.2 to §4.9: each box's landmarks, points of interest, encounters, secret and
  hint, finds and share of the pay.
- **The core** is D9, D8, D10 and B8, the boxes the Riders and their beasts fill; E10, C8 and B9
  are country (§4).
- **The seeds move** so the steppe is the Wold's and the Glass is the fused desert and its dunes:
  the Wold's at about 100,232, 132,262, 50,230, 150,300 and 120,296, the Glass's at about 80,282 and
  100,320 (`src/content/areas/glasswold/atlas.ts`, #523); the fourth, built at 140,296, moved to
  134,296 for #517, just west of E10, since the atlas check holds each zone's seed inside the zone
  and E10, laid for the Waste, now holds that square, and 134,296 keeps the Wold's border where it
  was. The old seeds gave the Glass 993 of D10's 1,024 squares and 440 of E10's 620, the road in
  among them; moved, they give it 49 of D10's (§9, #527's 1).
- **The lava flow's line** as decision 1 has it; the owner's word moves a point.
- **The names** (§10): Akordu, Kushtash and Tashkum, the last left for the reach's doc to decide.
- **The eldest at Akordu,** her own fire, where STORY has her tell the story at the port (#531):
  the chapter's step wants a place on the Wold, and the Rider's ride carries the company between
  the two. The owner may put a second telling at Cinderport's gate, or move the step.
- **The stair's head opened by C8** (#528), an edit to Saltreach's C7, with #412: done, nine of its
  301 squares (§4.6, §9, #528's 3).
- **The pay's shares** (§8), the epic's 12,900 against the curve's 21,067, closed by the fights as
  the boxes are built or rescaled by the owner.
- **The bands on the atlas's rows:** the Wold 26–28, the Glass 30–32 and the Buried Tower 30–32,
  set in `src/content/areas/glasswold/atlas.ts`, where only the scaffold reads them; the owner's
  word changes them there.

Decided by delegate for #542, each the owner's to overturn (docs/areas/ashfall.md §9 has the step):

1. **The Glasswold's row is 26–28, next 28, window 6,000,** owed to #447 with nothing given, as
   the issue has it: 21,067 xp a member and 12,720 gold, the training of six from 26 to 28.
2. **The Wold takes no step on the ladder:** no town sells, and the Riders buy at Cinderport by the
   ride (call 5, #547). A company at 26 wears Cinderport's step. A box that places a piece of it
   with a plus, the briefs' Horn Bow or Shield, takes the Ashwood Bow or the Basalt Shield of
   `src/content/areas/ashfall/items.ts`, off the ladder (docs/areas/ashfall.md §9, #542's 6).

Decided by delegate for #547, each the owner's to overturn (docs/areas/ashfall.md §9 has the rest):

1. **Akordu owes the ride its landing and its seller** (#526): a square at the horse-lines, on its
   end of `RIDERS_RIDE` in `content/crossings.ts` with D8's map as its `map`, and the Rider whose
   `passage` is `sells('wold', RIDERS_RIDE)`. Once Cinderport lands too, the check wants both ends
   to sell it. Built by #526 (§4.4, #526's 5).
2. **The ride is 325 gold and a day** on a Rider's horse, leaving either end at 14 and coming in at
   9 the next day, by the Wold's floor of 26, the dearer end's. Nobody halves it.
3. **The camp is a way in once the ride runs:** the gate counts the landing as a way into the Wold
   (#164's `landings`), so the groups nearest it are held to the zone's gentlest.

Decided by delegate for #533 (the Wold's five on frames), each the owner's to overturn:

1. **Each is the test monster of its roster role and level, on the line #661 made again:** the
   vulture fodder at 26 (191 hit points, 3d8+4), the Wold lion a skirmisher at 26 (332, 3d8+6), the
   glass scorpion a controller at 26 (290, 4d8+4), the basilisk the test basilisk at 27 (376, 5d7+7)
   and the Grey Lion the boss at 28 (1,552, 26d8+29). None is owed a restating; B8's gate may set
   the Grey Lion off the line, as the Act III bosses were set.
2. **The vulture flies, so it reaches the back row** (`ranged`), as the raven and the spine eagle do.
3. **The Wold lion does not leap at the back row,** where the snow lynx does: the mesa's lions keep
   the front row busy, and the test skirmishers behind which #546 tried the basilisk are not ranged.
4. **The glass scorpion's hold is the roster's poison at 0.35,** in place of the controller's
   paralysis; the basilisk's is stone at 0.15 with its gaze reaching the back row, as #546 has it.
5. **None resists anything:** the roster gives none, and nothing of the Wold is fire's.
6. **Sizes:** the vulture 0.65, the Wold lion 1, the glass scorpion 0.7, the basilisk 0.85 and the
   Grey Lion 1.4, under a tall boss's 1.5, so it stands in its group's rank and no crown is held.
7. **Each is owed to the first box whose brief places it** (`UNPLACED`): the vulture, the lions and
   the glass scorpion to E10 (#524), whose brief has all three; the basilisk to D8 (#526), in its
   mesa's shade; the Grey Lion to B8 (#529).
8. **The Wold's glass is green:** the scorpion's shell and the basilisk's crown and crest, where the
   Sunder's is black (the glass spider). A tint and a Build to change.
9. **The defs wait in the area's folder,** listed in `AHEAD` until #524 lists the area, as Ashfall's
   did; the glass walkers' family joins the same file in the second pull request.

Decided by delegate for #533 (the glass walkers), each the owner's to overturn:

1. **A man's shape, not a beast's:** the briefs give a walker a chest that opens (§4.3's and
   §4.8's secrets) and sit one in a horse's saddle (§6), so it is a tall machine in a man's shape.
2. **Older than the vessel's hands, and unlike them:** smooth bronze gone green in its seams, balls
   and rods at the joints, a lamp for a head; no plate on drums, shell on rods or robe.
3. **Fused with its glass on one side:** waded to the knees, its left arm gone into a club of glass
   dragging beside it, shards off the shoulder; the right side bare, the silhouette the glass's.
4. **The glass is the Wold's green** (8 above), lit at its edges, the arm dark through it and a
   light held in it, as the Tower's glass holds one (§4.8); the lamp the basilisk's green-white.
5. **The test elite at 27, on the line #661 made again:** 670 hit points, armour 25, +16, 7d8+7,
   speed 15, 2,147 xp; its hold the elite's paralysis at 0.15, a grip, as the Sentry's is.
6. **A machine** (MONSTERS §2): it never breaks and carries no gold, only parts, none set yet;
   it resists nothing, the roster giving nothing (5 above).
7. **Size 1.2,** a head over a man and under the Sentry's 1.45, so it stands in its group's rank and
   no crown is held; its span [0.39, 0.22], wider on the club's side.
8. **Owed to D9 (#525), not B9:** D9's brief places the first walker, "placed here first"
   (§4.3), so by 7 above it is owed there.
9. **One kind, on a Build:** the Buried Tower's walkers, at their worst (MONSTERS §10.1), are to
   be a Build and a colouring of this frame, not a module of their own.

Decided by delegate for #524, each the owner's to overturn:

1. **E10's band is 25–26,** up from #517's 24–26: the Wold's groups stand at 26 and the issue's gate
   turns back a company under the band. F10 stays 24–26, so onto E10 at 24 the Waste's harder words.
2. **The fewest groups that pass:** four beetles, six vultures and three lions with the drakes, 10.83
   fights to a rest at 25; each set tried with a second vulture group or the lone scorpion missed the
   day's aim (12.3 to 15.7). Both cut, the scorpion owed to D9's dunes (#525).
3. **The beetles stand nearest the way in,** on the ash: at 24 they let the levels rise to the drakes
   at the far end (rank correlation 0.32), where a group at 26 nearest would not.
4. **The Wold's line is its zone row's,** not a crest event: the line is said by level where the
   land changes (#166), an event the same to all. E10 is the Waste's land, so D10 (#527) says it
   first, and C8's stair (#528, walked and not jumped: #528's 2) too, so its words hold both ways in.
5. **The camp is under the hills' east face** (17,22), out of the steppe's wind, by the road below
   the notch, so a company rests before the crest and the grass.
6. **The grave's second hint is seen from the road on the ash:** vultures turning over its hills,
   nothing under them moving. The Rider's word, that they come down where something is about to die,
   is the other half; no text joins them.
7. **The Rider names Akordu** (§10) and the hoofprints north-west, toward D8 (#526); no quest, the
   chapter's and #532's.
8. **Pay 1,881 xp a member,** 2,543 with #517's 662, 1.04 times the scaled 2,450; no gold or find
   added, the grave's Horn Bow +2 and gold standing as the finds.
9. **Nothing new is claimed:** steppe is #517's first, and the vulture, lion and beetle come of
   families already on the road.

Decided by delegate for #525, each the owner's to overturn:

1. **D9 is laid whole as the atlas cuts it,** `wold_d9`, "The Wold", core, band 26–27, region
   `glasswold`, at 104,254 on the Wold's row (band 26–28 kept). The seeds give 913 squares to the
   Wold and 111 to the Ember Waste; a map is one land, so all of it is the Wold's for its crossing
   line and band, as E10 is the Waste's.
2. **D9 lists the area,** as G10 listed Ashfall: `src/content/areas/glasswold/index.ts` in
   Ashfall's form, in `AREAS` after Ashfall; `AHEAD` goes empty (the Area takes the six monsters
   and their sprites), `PLANNED` too, and the atlas's import and spreads leave the plan (the Area
   carries `ZONES`, `PLACES` and `SITES`). The climate is the steppe's: summer 26, winter −4, daily
   11, damp 0.01 to 0.06, wettest day 120, fog 0.1, lag 18; dust for fog.
3. **The road is the atlas's, squared and met at the edges:** four-way steps at 12,25, 14,26,
   19,29, 21,30 and 22,30. Its south crossing moved from the scaffold's 20 to 21,31 to 22 to 23,31
   (126 to 127,285), where D10's side of the atlas has it (the pillars' edge check binds); west it
   leaves at 0,21 (104,275) into C9, toward the gap at 92,272.
4. **A Riders' track of trodden earth,** 30 squares, runs from the road at 15,26 north to the north
   edge at 16,0 (120,254), Akordu's column: the atlas's road goes west to the gap and reaches no
   tent, and the brief wants a track toward the tents with a cairn on it. Earth is no road, so the
   edge check holds. D8 (#526) must meet it at its 16,31 (120,253) or let it fade (§4.4); the atlas
   may want the road drawn to Akordu.
5. **The way in is the road's end on the south edge,** 22,31 facing north (the map's `start`, which
   the gate reads): where the atlas's road comes over from D10's corner, a company's way from E10.
6. **`CUT_OFF` owes D9 to #527:** D10 lies between E10 and D9, which meet at a corner only (§1), and
   the mesas join them. D8 (#526) and the ride's landing there reach it from the north later.
7. **Four groups, the fewest that pass:** two prides of four lions, each with the three vultures
   over its kill in its fight (they land where something is about to die), not flocks of their own;
   four glass scorpions at the dunes' edge; the glass walker alone at the far south-west, the box's
   hardest at 27. Six groups (the prides 4 and 4, the vultures 5 and 5, the scorpions 4 and the
   walker) gave 14.6 fights to a rest, past the limit of 14, at 3,286 xp.
8. **Pay 2,940 xp a member, 0.90 times the scaled share of 3,250** (the doc wins over the issue's
   2,000): each pride 947, the scorpions 689, the walker 358. Under the share because the day, 9.67
   fights to a rest, is at the aim's foot (9.5): no group more fits. With the other scaled shares
   (17,800, E10's 2,450 among them) the area comes to about 20,740, 0.98 times the ask.
9. **Gold 1,350:** the track's cairn 300 and a Sapphire Vial, the dunes' cairn 300 and an Elixir,
   the hollow 750 with an Elixir and the Etched Glass. #533's "a walker carries no gold" holds: the
   hollow is a chest, not a drop.
10. **The secret is the doc's,** the issue's lions' den superseded: the long mound, its mouth a
    secret door at 12,13 (116,267), its hint `d9_ungrazed` (13,13) with the herder's rumour for its
    words, the fallen walker and the chest inside (§4.3).
11. **The thing of glass is `etched_glass`, "Etched Glass"** (slot none, price 0: no shop buys it),
    in the area's new `items.ts`: lines in glass a cartographer would want, nothing explained. Its
    buyer at Cinderport is #532's and #512's.
12. **The horse that came back is seen and no more:** `d9_horse` at 8,17, coming in off the dunes
    toward the herd, glass in its hooves, something still in its saddle. No flag or quest: 51 is
    #532's, with #526.
13. **The brief's places are each a feature,** eighteen for its nine (§4.3): the well a fountain
    that gives endurance, the tents seen from the middle, two cairns, the herd and its herder, the
    old Rider (the hermit, words only), the kills, the lions' lie, the Glass seen from a dune and the
    walker's tracks. The glass in the grass, `d9_glass` (18,29), is the chapter's id for #531.
14. **The Wold's crossing words are #524's,** on the zone row beside D9's map: D9's own first words
    are dropped, E10's having merged first and been made true both ways in (#524's 4). Not walked:
    no built map meets D9, and D10 (#527) is the first Wold map entered.
15. **Novelty claims the glass walkers and dunes,** both new by the check. Steppe is E10's first,
    the lions the cats', and a herd has no token (it is an event).
16. **The gate:** the Wold's road is the four groups by steps from the way in (pride 11, scorpions
    20, walker 22, north pride 26); the gate names the area ("the Glasswold"); D9's and the
    Glasswold's figures two under the floor are owed to #18, as every box's.
17. **`UNPLACED` drops the glass scorpion and the glass walker,** placed here; E10 dropped the
    vulture and the Wold lion (#524).
18. **The quests test** owes the Wold's step (its `PLANNED` zone) and the Glasswold's chapter
    (`CHAPTER_OWED`) to #531; the walkthrough is new, in Ashfall's form.

Decided by delegate for #527, each the owner's to overturn:

1. **D10 is laid whole as the atlas cuts it,** `wold_d10`, "The Wold", core, **band 26–27, not the
   brief's 27**: the curve holds a map's hardest group at its floor plus one or its top less two,
   whichever is higher, so a floor of 27 asks a group at 28, and the Wold's one 28 is the Grey Lion,
   B8's boss. 26–27 is D9's, the basilisk alone at 27 the top; the gate holds at 26 and so at 27.
   The cut gives the Wold 659 squares, the Ember Waste 316 and the Glass 49; a map is one land, so
   all of it is the Wold's for its line and band.
2. **D10 is the zone's way in:** first on the `wold` row and in the Area's `maps`, in road order,
   its `start` the road's east end, 31,6 facing west, where E10's road comes over. The gate's
   warning reads the zone's first map's start.
3. **The road is the atlas's at both edges and square to square between,** 22 squares, west along
   the great mesa's south foot and north up its west side; the atlas's diagonal ran over the mesa's
   rock.
4. **The great mesa is rock at 24 to 31, rows 0 to 5,** with D9's rock above it on its rows 30 to
   31; its top an enclosed grass of 18 squares, the Eyrie's cold fire-ring at 28,3 (132,289). Hills
   lie under it.
5. **The notch is on D10's side,** the mesa's north face proper being D9's, built: a nook of scree
   at 24 to 26,0 and the secret door over it at 26,1 (130,287), entered going south. At 26, not 25,
   for the art check (25,1 is dressed).
6. **The hint is the last figure,** `d10_glassed_rider` at 21,4, a Rider of glass with his bow still
   drawn on the mesa's face above the scree. The four round the great mesa stand on one line out
   from the scree and face north-east; the small mesa's three face it. No text names the notch.
7. **The small mesa is the atlas's west outcrop,** rock at 0 to 3, rows 15 to 22, with a skirt of
   hills at its east foot.
8. **Five groups, the fewest that pass and the brief's kinds,** for its eight: two prides, the mesa
   fight, four glass scorpions (a second group after D9's) and a basilisk alone. The vultures fight
   in the near pride, as D9's do, and have no flock of their own. The prides stand nearest the way
   in (9 steps each) so the zone's warning reads gentle groups; the mesa fight comes third (15
   steps), the lone basilisk last (40), the hardest by level.
9. **The mesa fight is the basilisk behind three lions,** #546's shape, a basilisk behind three
   skirmishers: the box's costliest fight, 12% at 26, and 9.2 fights to a rest. A fourth lion was
   not added: the pay sits at the share, the day at its aim.
10. **The basilisk is set to nothing:** #533's test basilisk as it stands (27, 376 hit points, stone
    0.15, its gaze `ranged`). The gate needs no tuning, the mesa fight won 100% at 26, so no
    `OFF_LINE` entry.
11. **Pay 3,199 xp a member, 0.98 times the scaled share of 3,250** (the doc's, over the issue's
    2,000): near pride 947, south pride 689, mesa 695, scorpions 689, basilisk 179. The Wold's row
    stands at 6,139 of 21,067; with the other scaled shares the area comes to about 20,690, 0.98
    times the ask (§8).
12. **Gold 1,500:** the Riders' cairn 400 and an Elixir; the hoard on the top 1,100, a Basalt Shield
    +2 and a Quickening Draught, so a company that climbs without one is not stranded. The shield is
    Cinderport's step with a plus, `basalt_shield+2`, 1,700 gold, made in the area's `items.ts`. The
    Wold stands at 2,850 gold of 12,720.
13. **The brief's places are each a feature,** twenty-one for its nine (§4.5): the mesa seen from
    the way in, seven glassed figures, the nest, the hoard, the ring, the view (the Glass whole and
    a dark crown standing up out of the glare, nothing said of what it is), the Riders' cairn, a
    Rider on the hill (words only: she goes no nearer), the glare, the kill, the lions' lie, a camp,
    the sky-stone (a shrine, luck), a horse's bones and a glass hare.
14. **The Wold's words are walked over E10's west edge,** the zone row's own, nothing changed: true
    at the border, grass on both sides, E10 (25–26) the gentler. D10 onto D9 says nothing, one land.
    What they read by level is in §4.5.
15. **Novelty claims `inflict:stoned`:** no placed monster inflicted stone before (the Mechanic
    token exists). The draught has no token.
16. **`UNPLACED` drops the basilisk,** placed here first (#533's 7 owed it to D8). **`CUT_OFF` drops
    `wold_d9`:** the reach test passes without it, 1,005 of 1,005, and the list is empty.
17. **The gate:** `ROADS.wold` is D10's five groups by steps from the way in, then D9's four; D10's
    figures two under the floor are owed to #18 (`OWED`), as every box's.
18. **The way-in event is `d10_mesa_seen`,** not `d10_mesa`, the mesa fight's group id.
19. **Stone's cure is walked in the walkthrough:** the hoard's draught lifts a glassed member and a
    temple asks 80 a level (2,080 at 26). Cinderport's temple and chandler stay Ashfall's
    walkthrough's.

Decided by delegate for #526, each the owner's to overturn:

1. **The band is 26–27, not the brief's 27,** and the gate holds D8 at 26, as D9 and D10 (#527's 1):
   the curve's rise check holds a box's hardest group at max(floor + 1, top − 2), 28 for a band of
   27 alone, and nothing on the Wold but the Grey Lion, B8's boss, is past 27. `wold_d8`, "The
   Wold", core, region `glasswold`, at 104,222, second on the zone row `wold`. B8's band, 28 in
   §4.7, will need the same: a one-level band wants a group above it.
2. **The atlas wins over §4.4's prose on the mesa:** it stands north of the site, rock in rows 13 to
   22 and columns 10 to 19, and Akordu's site (120,250, local 16,28) and the ride's link are fixed
   south of it. So the camp lies under the mesa's south face, not its north, and the basilisk in
   its shade on the north side, 13,12, not at the box's south, where it is the group furthest from
   both ways in, as the curve's rise and the gate's landing check want. §4.4 is corrected.
3. **The camp is trodden earth,** 67 squares in an oval round the fires, its rest the camp feature
   `Akordu` at 16,27. Nine squares of white felt make the ring of tents, in the map's `palette`
   (wall #e4dac8, smooth): the eldest's against the mesa at 16,23, five round the ring (13,24;
   19,24; 11,27; 13,30; 19,30) and the trader's, three squares and a door facing in.
4. **Two ways in:** the map's `start` is the end of D9's Riders' track on the south edge, 16,31
   facing north, its earth going on into the ring; the ride's landing at the horse-lines, 9,27
   facing east, is the second (the gate's `landings`).
5. **The ride's Akordu end** (`src/content/crossings.ts`) is the landing `wold_d8` 9,27 facing east,
   `owed` dropped and its label kept. Its seller is "A Rider at the lines" (9,26), with `passage:
   sells('wold', RIDERS_RIDE)`: the end's `at` is the zone `wold` (#547's 1), and `sells('akordu')`
   would throw. Cinderport's Rider (9,13) already had `sells('cinderport', RIDERS_RIDE)`, which
   sells by itself now, so Cinderport's map is unchanged. The fare is #547's, 325 gold and a day.
6. **The trader is a shop with a room of its own:** "The Trader's Tent" at 21,27, interior
   `akordu_trader`. The maps check wants every business to have a door and a room of its own, and
   no tent room existed, so the builder drew one, an art-lane piece the shop needed:
   `src/ui/interiors/glasswold/akordu_trader.ts` (white felt on its lattice, roof poles to the
   crown, three leather coats on a pole, a horse's skull with a red brow, the painted chest, sacks,
   a dung brazier), listed in the area's new `interiors.ts` and registered in `src/ui/interior.ts`.
   It sells at list price the band's consumables (rations, torch, lantern oil, healing draught,
   antidote, elixir, the blue and sapphire vials), the Quickening Draught (`CURES`, #546) and the
   Leather Coat; nothing of steel (call 7), and no inn, temple, guild or trainer at Akordu.
7. **Leather:** `leather_coat`, "Leather Coat" (armour 12, 2,400 gold, `NO_CASTER_HEAVY`), in the
   Wold's `items.ts`: a step under Cinderport's Drakeskin (13, 3,100) and off the ladder, #542's 2
   giving the Wold no step. The hoard holds `leather_coat+2` (14, 2,700), the Riders' own make. The
   trader sells no Bearskin or Drakeskin (Rimewater's and Cinderport's).
8. **Three groups, the fewest that pass:** a pride of four lions by night (`when: { hours: 'night'
   }`) at 4,21, west of the horse-lines; six glass scorpions at 22,17, in broken ground under the
   mesa's east face (six rocks laid there); the basilisk alone at 13,12, the hardest at 27. It must
   be alone: the curve wants the hardest group to average 27, and only a basilisk or a walker is 27.
   The vultures over the garden are seen, not fought (`d8_vultures`: they turn over it and never
   come down). The brief's four groups (pride 4, vultures 5, scorpions 4, basilisk) gave 16.3
   fights to a rest at 26, past the limit of 14, and a flock heavy enough to count, 8 vultures,
   takes the pay past the cap.
9. **Pay 1,901 xp a member,** 0.97 times the scaled share of 1,950: the doc wins over the issue's
   1,200. The cap is about 2,440. Gold 1,500, all in the hoard. The Glasswold's owed row is set to
   4,841 xp and 2,850 gold, "the Glasswold is built box by box" (§8).
10. **The secret is the doc's: the dry well with no rope.** The hint is `d8_ropeless` at 13,23
    against the mesa's foot (no rope, no bucket, the horses watered at the others). The mouth is a
    secret door at 13,22 (117,244), searched facing north, into a hollow of two squares cut into
    the rock at 12 to 13,21, with rock added at 12,22. Inside, `d8_hollow` (13,21: bronze plates, a
    lamp of glass, a hand of metal, laid in rows, what the Riders took from the walkers) and the
    chest `d8_hoard` (12,21): 1,500 gold and the Leather Coat +2. The issue's hint, the eldest's
    story, is superseded (21).
11. **The eldest is G10's,** the Riders' eldest at the port's trading ground, a horse-blanket and a
    braid white to the waist: "The eldest" at 16,24, before her tent. Her first meeting is the whole
    telling (a look and four lines) and sets the flag `akordu_story`, exported as `STORY` from the
    map for #531's step to key on; after it her `says` holds, so the story is told once. Her first
    line carries on from D9's old Rider ("the grass stood still and the birds came down out of the
    air"). No word of a hull, ship, orbit, voyage or Custodian; the walkthrough checks for those
    words. Her words are in §4.4, for the owner's review.
12. **People with words only,** with no flag, quest or choice (#532's): the Rider at the lines, who
    sells the ride; a young Rider (8,29), who wants the last blow at the Grey Lion, the eldest
    saying let him die (53); a Rider with a hammer (5,25), who waits to break what sits the horse
    (51); a woman among the figures (26,27), whose son went to look at the basilisk (55).
13. **The horse that came back is `d8_horse`** at 4,24, tethered apart from the lines, glass in its
    hooves, the thing in its saddle unmoved since it came in. It matches D9's `d9_horse`, in off
    the dunes with something very still in the saddle. No flag.
14. **The garden:** six crystal squares (`c`) east of the ring (25,24; 27,24; 26,26; 28,26; 25,28;
    27,28), with the events `d8_garden` (23,25: the figures face south-west), `d8_figure` (25,26: a
    boy, his hand to his eyes) and `d8_vultures` (29,25). Crystal draws purplish and the Wold's
    glass is green in every text, so D8's says "glass" and no colour.
15. **The mesa's watch-fire** is two events on 15,23, `d8_watch` by day (smoke) and
    `d8_watch_night` (a fire), as Cinderport's mountain is two.
16. **Shrine and wells:** `d8_shrine` at 19,21 against the rock (might), a post hung with horses'
    tails, one for each Rider who rode into the Glass; two `well`s, at 18,22 under the mesa and
    6,29 by the lines, beside the dry one.
17. **The rest of the box:** the herd (4,4), skull poles at the grazing's end (9,1), the view from
    the hill's crown (20,5), a dead foal (28,4), Riders on the skyline (28,14), graves (4,12), lion
    tracks toward the lines (7,17), a glassed horse in the mesa's shade (17,12, the basilisk's
    sign) and the broken ground (22,21). D8 has 30 features, 32 points with the groups, the
    watch-fire's two sharing a square.
18. **Novelty claims nothing of its own.** The stone is D10's, first on the road (#527's 15); the
    check refused the `camp` landmark, which is on the road before.
19. **`ROADS.wold` is unchanged,** D9's four: D8 lies north of the steppe, off the road to the gap;
    the landing's warning check holds its groups instead.
20. **Test entries:** gate OWED `wold_d8: under` to #18 (100% won two under, as every box's); maps
    `UNPLACED` has lost the basilisk to D10 already; ladder `CURE_SOLD` for the Glasswold is '', so
    #546's second half is settled and nothing stays owed for the cure; outdoors, D9's north edge is
    re-pinned against D8 and D8's four edges are pinned, `CUT_OFF` being empty since D10 (#527's
    16). The walkthrough rides the Rider both ways.
21. **The issue is superseded by the doc in three places:** its glass walker "once, at the camp's
    edge by night" (the walker seen is the one in the horse's saddle), its hint "by the eldest's
    story" (the ropeless well) and its 1,200 xp (the doc's share is 1,950). Its squares, "810,
    steppe 657, rock 85, hills 68", are not today's cut: the scaffold gives steppe 845, hills 94
    and rock 85, its zones in the cut the Wold 845 and the Saltings 179. A map is one land, so all
    of it is the Wold's.

Decided by delegate for #528, each the owner's to overturn:

1. **The band is 26–27, not the brief's 27,** and the gate holds C8 at 26, as D9, D8 and D10 (#527's
   1, #526's 1): the curve holds a box's hardest group at max(floor + 1, top − 2), so a floor of 27
   wants a group at 28, and the Wold's one 28 is the Grey Lion, B8's boss. `wold_c8`, "The Wold",
   country, region `glasswold`, at 72,222, fourth on the zone row `wold` (D10, D9, D8, C8).
2. **The stair is walked, not jumped:** C7's column 8 is opened from the notch to C7's south edge
   and meets C8's last flight at 8,0, so the Wold's crossing line is said on the step onto C8: the
   stair's head is the border. A jump from the notch (#616) would need the atlas's link moved, both
   its ends (80,206 and 80,216) lying on C7 and the atlas check wanting a jump's two squares beside
   the link's ends. The brief keeps the link the plan's, so it is untouched and walked, and the
   zone row's comment, which said "a jump: #616", now says walked.
3. **Of C7's 301 Glasswold squares only the stair's nine are opened,** with the owner's leave (#412,
   #528). Opened whole they would be the Wold's grass on a band 11–12 map of the Saltings, walked
   with no line until C8 and bare of points (C7's density). The Scarp's mass stays closed; the lip
   is C8's north edge, a row of cliff but for the stair, a knot of rock at the cleft and steppe at
   the east end, where the lip bends north toward D7.
4. **The way past the fall is a rope ladder,** pegged to the flight above (`c7_stair`'s new words).
   No flag and no lock: the stair is open both ways from the start, and the walkthrough climbs it
   at 12, 25 and 26 and comes down again.
5. **C8's way in is the stair's head,** `start` 8,1 facing south, which the curve's rise reads. A
   company on the road walks in over the east edge from D8 as well.
6. **The watch** is trodden earth, 11 squares, round the head: the yurt, one square of white felt
   in Akordu's palette (6,2), the watch-cairn (9,2), the two Riders (10,1) and the fire, a `camp`
   (#45) (9,3). The yurt sits at 6,2 and the cleft's door at 22,2 because the art check (walls
   dressed as before #9 must fail) wants a small map's two wall squares dressed by the old rule and
   under today's cap: at 7,2 the yurt was dressed today, and at 21,2 the door was bare under the
   old rule.
7. **The runner** is "A Compact runner" on the last flight, 8,0, words only (#56's 54 is #532's).
   She carries the Dead-Drop's orders for the Riders and does not name the cleft: the secret is
   found.
8. **The line at the top is an event,** `c8_line` (once) at the head, in a Rider's voice. The zone
   row's crossing words come with it, said by the engine at the company's level on the step before.
9. **Three groups, the doc's kinds, the fewest that bring the day inside its aim:** six vultures on
   the lip's updraught (27,3); the pride at its lie in the grass (12,19), four lions with three
   vultures waiting over it, D9's pride; and **two basilisks** in the hills at the box's east
   (28,27), the hardest at 27, not the doc's one. With one basilisk (29.4 fights to a rest alone)
   the day at 26 ran to 13.1 fights to a rest, off its aim of 9.5 to 11.5; a flock of eight with
   the lone basilisk gave 12.5; the pair (13.1 alone) brings the day to 10.46. None stands within 12
   steps of the head: the nearest, the vultures, are 21 off.
10. **Pay 1,822 xp a member,** 1.10 times the scaled share of 1,650, under the cap (about 2,060):
    the vultures about 516, the pride 947, the basilisks 358. The Wold's row stands at 9,861 of
    21,067; with the other scaled shares (E10 2,450, B8 4,250, B9 2,600 and the side quests 1,650)
    the area comes to about 20,810, 0.99 times the ask (§8).
11. **Gold 1,100:** the cleft 900 and the letter; the watch-cairn 200 and an Elixir. The Wold stands
    at 5,450 gold of 12,720.
12. **The secret is the doc's cleft.** The hint, `c8_prints` (22,3, not once), is a shod horse's
    prints along the lip to the rock and back; the Riders' horses are unshod (D9's herd) and no
    text says so. The mouth is a secret door at 22,2 (94,224) in a knot of rock at the lip,
    searched facing north. The cleft, 22 to 23,1, is stone, shut by rock on every side: rock and
    not cliff, since a Mountaineer climbs cliff and mountain and not rock. The walkthrough checks
    that nothing reaches it but its mouth. Inside are `c8_cleft` (22,1) and the chest `c8_drops`
    (23,1).
13. **The letter** is `cipher_letter`, "Letter in Cipher" (slot none, price 0), in the area's
    `items.ts`. Nobody on the Wold reads it and no shop buys it. What takes it is owed: Lantern
    Watch's reader (#204) or the Compact's hall at Cinderport (#512, #532); neither is edited here
    (§11).
14. **Novelty claims nothing new:** C8's ground (steppe, hills, cliff, stone, rock and earth), its
    features and its kinds are all on the road before, cliff and stone being Ashfall's and the
    Whitespine's. The brief's "a way into an area from two acts back" has no token.
15. **`ROADS.wold` is unchanged,** D10's five groups then D9's four: C8 is off the road, and the
    gate reads the zone's way in from its first map.
16. **Test entries:** gate OWED `wold_c8: under` to #18 (100% won two under, as every box's);
    outdoors: D8's west edge, which faced the void, is pinned square for square against C8's east
    edge; C8's four edges and C7's south edge are pinned; `CUT_OFF` stays empty; maps has nothing to
    drop, D8 having dropped the basilisk's `UNPLACED`. The Glasswold's walkthrough asks of the zone
    row that it hold D8 at 104,222, not that it be exactly D10, D9 and D8.
17. **The issue is superseded by the doc in three places:** its secret, a smugglers' cache hinted by
    the runner's orders (the doc's is the cleft, hinted by a horse's prints: 12), its 1,000 xp (the
    doc's share is 1,650: 10) and its squares, "367, steppe 314, hills 53", which are not today's
    cut: the scaffold gives steppe 971 and hills 53, its zones in the cut the Saltings 528 and the
    Wold 496. A map is one land, so all of it is the Wold's.

## 10. Names

The Glasswold's naming pass, by the rules of `docs/NAMES.md`: the Wold Riders' tongue was left to
it (NAMES §2), and the Crown's names for the area, the steppe and the escarpment are kept. Chosen
for #444.

- **The tongue.** The Wold Riders are the horse people of the steppe, who live in white tents, ride
  down to Cinderport to trade and keep the only way into the Glass (STORY, DESIGN §9). Their names
  are Turkic in shape, the tongue of the steppe, beside the Foreland's English, the elves' Cornish,
  the Tidefolk's Frisian, the dwarves' German and the hill folk's Gaelic: short parts, spelled as
  they are said, with no accent the font lacks. *Ak* white, *kara* black, *tash* stone, *kum* sand,
  *su* water, *ordu* a camp, *yurt* a tent, *kush* a bird, *dag* a mountain, *kol* a lake, *bash* a
  head, *uzun* long, *yol* a road. NAMES §2's row for the Wold Riders has it.
- **The names:**

  | Was | Now | What it means | Also thought of |
  |---|---|---|---|
  | the Wold Riders' camp | Akordu | the white camp, for its tents | Ordubash, the head camp |
  | the Eyrie | Kushtash | the bird's rock: the scout's lookout on the far-west mesa, where the vultures never land | Kushdag, the bird's mountain |
  | the Glass, in the Riders' mouths | Tashkum | the stone sand; noted here and left for the reach's doc (Phase 1.6), with "The Glass" and "Buried Tower" still lettered | Akkum, the white sand |

- **Kept:** the Glasswold and the Wold, the Crown's names for the area and its steppe, which the
  road leans on; the Scarp and the Scarp stair, the Foreland folk's, Saltreach's border
  (docs/areas/saltreach.md §10); the Cinder Hills, Ashfall's; the Glass and the Buried Tower, plain
  names for plain things as the Grove Stone is, lettered as the plan has them until the reach's doc
  says otherwise; the Grey Lion, a beast and not a place.
- **Ids stay:** `wold` and `theglass` are the plan's zones; the Eyrie's site keeps its name in the
  issues until #444 renames it, and its id is #529's to set when it is placed; Akordu's is its
  site's name and its map `wold_d8`, set by #526.

## 11. What was cut

- **The rim's mountain,** A8 (587 squares of land, 305 walkable), A7 (259, 111) and A9 (141, 5):
  the A column under the rim, mountain with a strip of the Wold's last grass at A8's east edge. The
  maps of the B column end in it.
- **The Scarp's lip,** B7 (186, 168): a strip of steppe above the cliff west of the stair, with
  nothing on the atlas or in the docs; the plan's lettering "The Scarp" at 70,208 stands in it and
  is Saltreach's border's, not a thing to build.
- **The Glass whole,** C9 (899), C10 (967, 712 walkable), D11 (500, 202), B10 (287, 72), C11 (133,
  10) and E11's west part: about 3,000 squares of land, the fused glass, its dunes and the Buried
  Tower's site and plate. Not cut but left: it is the reach, Phase 1.6's, and this doc describes it
  only as what the Wold keeps out. Its doc decides Tashkum, the Tower's floors and the cap's gate.
- **The country behind,** E9 (931) and E8 (305): parked, not cut (#534, call 9), built once the
  owner has played the act.

About 1,170 squares cut in all, and 3,000 left for the reach; the cut land comes back as country
only if the act plays short.

Owed, from D9 (#525):

- **The vultures' flocks are cut into the prides:** the brief's six groups stand as four, each
  pride's three vultures fighting with it (§4.3, §9, #525's 7). Six gave 14.6 fights to a rest,
  past the limit of 14, and the pay stays under the share, 2,940 xp a member of 3,250 (§8).
- **D9's edges end in the void:** the west edge against C9, the Glass's and left to the reach, and
  the east against E9 (#534); its north edge meets D8's, the track at 16,0 (#526, §4.4), and its
  south edge meets D10 and `CUT_OFF` is empty (#527; §1, §9, #525's 3 to 6).
- **The step and the chapter** on `d9_glass` are #531's (§5); **quest 51** and the Etched Glass's
  buyer are #532's, #526's and #512's (§6, §9, #525's 11 and 12).
- **The Wold's crossing words** are walked at D10 (#527) and at the Scarp stair's head (#528)
  (§9, #525's 14, #528's 2).
- **The figures two under the floor** are owed to #18 and **the area's pay and gold** to #447: 2,940
  xp of 21,067 and 1,350 gold of 12,720 (§8).

Owed, from D10 (#527):

- **The vultures have no flock of their own, and five groups stand for the brief's eight:** two
  prides, the mesa fight, the scorpions and a basilisk alone, the vultures fighting in the near
  pride (§4.5, §9, #527's 8). The pay stays under the share, 3,199 xp a member of 3,250 (§8).
- **The garden at Akordu** is built (#526, §4.4) and **the mothers who sit in it** are #532's (55);
  the Rider on the hill says only that the ones carried home stand there (§4.5).
- **The chapter's steps** on the Wold are #531's (§5); **the draught at Akordu's trader** is built
  (§4.4, §9, #526's 6).
- **The figures two under the floor** are owed to #18 and **the area's pay and gold** to #447: 6,139
  xp of 21,067 and 2,850 gold of 12,720 (§8).

Owed, from D8 (#526):

- **The vultures' flock and the night walker are cut:** the vultures over the garden are seen, not
  fought, and the issue's glass walker seen once at the camp's edge by night is cut, the thing in
  the horse's saddle being the walker seen. The brief's four groups gave 16.3 fights to a rest at
  26, past the limit of 14, and a flock heavy enough to count takes the pay past the cap (§4.4, §7,
  §9, #526's 8 and 21).
- **The step and the chapter's Akordu** are #531's, keyed on `akordu_story` (§5, §9, #526's 11);
  **quests 51, 53, 54 and 55** have their Akordu ends in #532's, with the rest of the eldest's story
  for 53 ("the rest is for those who have earned it"): the young Rider, the Rider with a hammer, the
  woman among the figures and the horse that came back stand there with words only (§6, §9, #526's
  12 and 13).
- **The tents draw as white felt boxes:** the renderer gives buildings one shape, and its only
  landmark kind is the lighthouse, so a tent shape is a renderer change, not made.
- **D8's north and east edges end in the void:** a box not built to the north and E8 (#534,
  parked) to the east; its west edge meets C8's (#528, §4.6) (§4.4, §9, #526's 20).
- **B8's band** will need a floor below its top, as D8's 26–27 has (§9, #526's 1).
- **The figures two under the floor** are owed to #18 and **the area's pay and gold** to #447:
  8,040 xp of 21,067 and 4,350 gold of 12,720 (§8).

Owed, from C8 (#528):

- **The letter in the cleft has no reader:** nobody on the Wold reads the Letter in Cipher and no
  shop buys it. What takes it is owed: Lantern Watch's reader (#204) or the Compact's hall at
  Cinderport (#512, #532). Neither is changed here (§4.6, §9, #528's 13).
- **The runner and the Riders at the watch are people with words only,** and the quest, Orders on
  the Scarp Stair (#56's 54), with its Akordu end, is #532's (§6, §4.6, §9, #528's 7).
- **The Scarp's mass stays closed:** 292 of C7's 301 Glasswold squares are mountain still, the
  stair's nine being the only ones opened (§4.6, §9, #528's 3).
- **The chapter's play** with the Wold entered by the stair is #531's (§5): the walkthrough here
  climbs the stair at 12, 25 and 26 and plays no step.
- **C8's west and south edges end in the void:** B8 (#529) to the west and C9, the Glass's and left
  to the reach, to the south (§4.6, §9, #528's 16).
- **The figures two under the floor** are owed to #18 and **the area's pay and gold** to #447:
  9,861 xp of 21,067 and 5,450 gold of 12,720 (§8).
