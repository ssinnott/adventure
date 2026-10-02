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
behind, parked (#534). The act's systems are #442's: the curve's row and the gear ladder (#542),
steppe and dunes underfoot (#543), the toll (#544) and the sweep (#545), stone and its cure (#546),
the crossings, the Rider's ride to Cinderport among them (#547), and the bot (#549). The owner's
calls are #443's, the names #444's, the third prestiges' quests #448's and the road behind #449's.
Figures are measured on main at `6032251` (2 October 2026) with `worldGrid` (`src/game/atlas.ts`):
land without shallows or rivers, and "walkable" what is not mountain, peak, cliff or chasm.

Nothing is built. Its content will be `src/content/areas/glasswold/` (maps, monsters, items,
climate, its part of the world map in `atlas.ts`, its chapter of the one quest, The Warning, in
`chapter.ts` and its side quests in `quests.ts`); it has no town and no businesses, so no rooms.
Its ids: the area `glasswold`, its zones `wold` and `theglass`, the plan's; the Buried Tower
`buried_tower`, the plan's, left to the reach. Akordu's (the Wold Riders' camp) and Kushtash's (the
Eyrie) ids are their boxes' to set (#526, #529); the Eyrie's site keeps its name in the issues until
#444 renames it.

---

## 1. Where it is

The atlas (`src/content/areas/glasswold/atlas.ts`, spread into the plan) makes the Glasswold two
zones:

| Zone | Band | Squares today | Built |
|---|---|---|---|
| The Wold | 26–28 | 6,240 (steppe 3,133, hills 1,151, mountain 646, dunes 540, grass 369) | nothing |
| The Glass, the reach | 30–32 | 4,813 (steppe 1,306, mountain 1,028, hills 838, glass 817, dunes 626) | nothing, and not this phase's |
| The area | 26–28 | 11,053 | nothing |

Squares are the land `worldGrid` gives each zone by today's seeds, without shallows or rivers;
9,349 of them a company could walk, and nearly half of those are steppe. That is about 10.8 zone
maps (EXPANSION §1 had 12.9 at an older head). The zones' line is wrong today: the Glass's seeds at
80,280 and 110,300 pull a third of the steppe into it, D10 among them. This plan moves the seeds
(§9) so that the steppe is the Wold's and the Glass is the fused desert and its dunes: C9, C10,
D11, B10, C11 and B9's south; the zones' figures are measured again when the folder lands (#523).
The Wold's band is the area's, 26–28, and the boxes rise through it (§4); the Glass's is the cap's,
as the reach is (DESIGN §9; MONSTERS open question 3, answered by call 5). No Wardstone stands here.

**The grid** (EXPANSION §8.2; docs/areas/shelf.md §1). Boxes are 32×32 with A1's corner at 8,−2,
so a box's corner is x = 8 + 32i, y = −2 + 32j. The Wold is the B, C, D and E columns from row 8 to
row 10, with E9 and E8 behind it on the coast; the Glass is C9 and C10 with the dunes and slivers
round them. The land worth a map on the road is seven boxes: E10, D9, D8, D10, C8, B8 and B9 (§4).
E9 and E8, the country behind, are parked (#534); A7, A8, A9 and B7, the rim's mountain and the
Scarp's lip, are cut (§11).

Its edges:

- **North: the Scarp,** the cliff ridge along y 206 to 216 between the Saltings below and the Wold
  above. The Scarp stair climbs it at 80,206 → 80,216, a road link open from the start (EXPANSION
  §2.2), its foot a notch in Saltreach's C7 where the lowest flight has fallen (docs/areas/saltreach.md
  §4.10; #412, the Scarp's fallen stair). Its head at 80,216 is in C7 too, so the Wold's C8 meets it
  at its north edge, and the way past the fall is built with C8 (§4.6).
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

Its atlas rows (`src/content/areas/glasswold/atlas.ts`, spread into the plan as Saltreach's and
Wrackholm's were until each had a map, docs/areas/saltreach.md §9, #169's 1): the zones with their
bands, the Wold 26–28 and the Glass 30–32, the Buried Tower's plate at 30–32, and the sites, Akordu
(the plan's Wold Riders camp at 120,250), Kushtash (the Eyrie, moved to about 46,242, call 5) and
the Buried Tower, "The Glass" and "Buried Tower" lettered as the plan letters them. The lava flow
is drawn in the plan's ridges (`src/content/atlas.ts`), the one line outside the folder this doc
asks for (call 5). Nothing else: no map, no monster, no quest. Every brief below is a draft.

## 4. What is still to build

All of it: 11,053 squares of land, 9,349 of them walkable. On the grid (§1) the plan is seven
boxes, which hold 5,557 of those squares, 5,379 walkable, the table the epic #447 carries:

| Box | Name | Zone | Kind | Band | Land | What is there | Its step of the quest | Issue |
|---|---|---|---|---|---|---|---|---|
| E10 | The road onto the steppe | the Wold | country | 26 | 620 (hills 302, steppe 215, ash 64, grass 39) | the road over the Cinder Hills from the Waste at 156,312 → 144,300; the first vultures; the crossing line | none | #524 |
| D9 | The steppe | the Wold | core | 26–27 | 1,024 (steppe 827, dunes 180, rock 11) | the grass with glass in it; the lions' prides; the dunes' first edge at the south-west corner | the glass in the grass | #525 |
| D8 | The Riders' camp | the Wold | core | 27 | 810 (steppe 657, rock 85, hills 68) | Akordu at 120,250 under its mesa: the eldest, the trader, the Rider who rides to Cinderport; the garden of glass | the eldest's story | #526 |
| D10 | The mesas | the Wold | core | 27 | 1,024 (steppe 772, hills 141, rock 88, dunes 23) | the basilisks' mesas; the mesa fight; the Eyrie's old mesa at 132,289, empty | none | #527 |
| C8 | The Scarp's edge | the Wold | country | 27 | 367 (steppe 314, hills 53) | the Scarp's lip over the pans; the stair's head at 80,216 on C7; the Riders' watch on it | none | #528 |
| B8 | The Wold's heart | the Wold | core | 28 | 795 (steppe 587, rock 116, hills 92) | the Grey Lion's ground; Kushtash, the far-west mesa under the rim at about 46,242, the Ranger's third | none | #529 |
| B9 | The Glass's edge | the Wold | country | 28 | 917 (dunes 500, mountain 178, steppe 83, hills 79), 739 walkable | the dunes and the scorpions; the gap at the mesas and dunes; the Riders' watch on the only way in; the glass walkers | the Riders keep the way in | #530 |
| E9, E8 | The country behind | the Wold | country, behind the road, parked | 27–28 | 931 (hills 411, steppe 264, grass 222) and 305 | the hills down to the coast; the shore | none | #534 |

The core is the four boxes the Riders and their beasts fill, D9, D8, D10 and B8, built at full
density; E10, C8 and B9 are country, built to the looser floor with the wilderness features
(EXPANSION §2.1 (b) and §5.3, #45). The Glass's boxes are not in the table: C9 (899), C10 (967, 712
walkable), D11 (500, 202), B10 (287, 72), C11 (133, 10) and E11's west part, about 3,000 squares,
are the reach's (§11). The bands rise from the way in, 26 at the Cinder Hills' foot, to 28 at the
Wold's heart and the Glass's edge, as the gate asks (EXPANSION §5.2), and each box holds a group at
the top of its band for the curve. Nothing in the area trains, sells gear or teaches a spell (call
7): Cinderport does, a Rider's ride away (call 5, #547), and the ladder takes no step on the Wold
(#542).

**Two boxes hold land of two zones by today's seeds.** B9's dunes run south into the Glass, and
D9's south-west corner is dunes too; with the seeds moved (§9) both are laid in the Wold, and the
zone line runs along the glass's own edge in C9. A map is its whole box (EXPANSION §8.2), so each
is built to its edges; the zone a square belongs to decides only its crossing line (#166) and its
band, and the crossing line into the Glass is the Riders' watch's to say (§4.8).

**The order** is the road's from Cinderport, and the quest's: E10, the only box that meets the
Waste; D9 and D8, west over the steppe to Akordu; D10, south to the mesas; C8, north to the Scarp's
edge; B8 and B9, west to the Wold's heart and the gap. Building waits on Ashfall's Waste road
(#517) and Cinderport (#512), on the act's systems (#442) and on Ashfall being played, since no
more than two areas are in flight at once (EXPANSION §3); the briefs and the drawings do not (#447).

The places, as the atlas and the docs have them:

| Place | Box | What the docs say | On the atlas |
|---|---|---|---|
| Akordu (the Wold Riders' camp) | D8 | the horse people and their eldest, who tells the oldest story on that side of the sea (STORY, Act Four; DESIGN §9); the Wold's rest, a trader and the Rider's ride (call 5); the garden of glass (#56's 55); the horse that came back (#56's 51) | a camp, "Wold Riders", at 120,250, planned |
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
- **Stone.** The basilisk turns a member to glass (stone, 0.15), and #546 gives stone a cure short
  of a temple; the temple is Cinderport's. No box with a basilisk is built before #546 lands.

### 4.2 E10, the road onto the steppe (#524): country, band 26

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

### 4.4 D8, the Riders' camp, Akordu (#526): core, band 27

- **Purpose.** The Wold's rest and its step: Akordu, the white camp, under its mesa's north face at
  120,250, where the eldest tells the oldest story on that side of the sea (STORY, Act Four), a
  trader sells the band's consumables and leather and a Rider rides a company to Cinderport and
  back (call 5). The camp sells and teaches nothing else (call 7).
- **Landmarks.** The white tents in a ring, the horses' lines, the fires; the mesa above with the
  Riders' watch-fire on its top; the garden of glass at the camp's east edge, its figures facing
  the Glass; the wells; the horse that came back, tethered apart with a walker in its saddle.
- **Points of interest,** about nine features and six groups:
  - the eldest at her fire, the step (§5), and the Lion's Share's other voice (§6);
  - the trader's tent, a shop for consumables and leather at list price (call 5, call 7);
  - the Rider at the horse-lines, who sells the ride to Cinderport: a `coach` link open from the
    start (#547), a fare and a day, landing at Cinderport's gate, and the same back;
  - the camp, to rest at (#45), the Riders' own; a well, a shrine (#45);
  - the garden of glass, and the mother among the figures (#56's 55);
  - the horse that came back, and the Riders who want it broken (#56's 51);
  - the young Rider at the lines who wants the last blow (#56's 53).
- **Encounters.** A pride of lions that comes at the horses by night (`when`); vultures over the
  garden; a basilisk in the mesa's shade at the box's south, the hardest at 27; glass scorpions in
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

### 4.5 D10, the mesas (#527): core, band 27

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
- **Finds.** Gold, a Shield with a plus, Cinderport's step (#542), and the stone cure's own item
  if #546 makes one, so a company that climbs without it is not stranded.
- **Pay.** About 2,000 xp a member.

### 4.6 C8, the Scarp's edge (#528): country, band 27

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
  mountain and left the lowest flight fallen (docs/areas/saltreach.md §9, #178's 3 and 4). C8 opens
  them and builds the way past the fall, and rewrites C7's notch event: an edit outside the area's
  folder, with the owner's leave (#412, #528). The link stays the plan's.

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
  burned once. The goal goes on to Akordu.
- **Akordu.** The eldest tells the oldest story on that side of the sea: long ago a door opened in
  the sky, something rose toward it on a pillar of fire and fell, and the land where it fell burned
  to glass. *What lies in the glass tried to leave. The sky opened for it. Remember what that cost,
  if anyone ever offers to open it for you.* The goal turns west, to the way into the Glass.
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
glasses whoever looks up. Their drawings are #533's, six: four on frames that exist, the walker and
the Grey Lion their own. §4.2 to §4.8 place every group, box by box, the vultures at the hills'
foot and the walkers in their pair at the gap. The Wold spends MONSTERS §3.3's stone (#546); the
sweep (#545) and the toll (#544) are the Whitespine's and Ashfall's, spent before it.

New in the Glasswold, for the novelty check (EXPANSION §5.4): the glass walkers, a new family (D9
claims it, placing one first); steppe and dunes underfoot (#543); stone and its cure (#546); a camp
that is an area's rest, with a `coach` sold from it (#547); the reach seen from the road and its
band said. Its landmarks: a mesa, a camp of tents, a garden of the glassed, a lava flow seen, a
cliff from its top.

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
- **Gold.** Training six members from 26 to 28 costs about 12,720 with today's `trainPrice`, and
  nothing on the Wold trains: Cinderport teaches to 27, a Rider's ride away (call 5, #547), and 28
  is Hearth Isle's to teach or the owner's to place. A clear should pay for the training at least,
  in the hoards, the drops and the quests' pay, and the ride's fare on top; the band's price window
  is 6,000, and no find or ware comes within 400 of it (docs/areas/saltreach.md §9, #399's 4).
- **The gate.** The gate check (`tools/tests/gate.ts`, #38) holds each box at its own floor
  (docs/areas/thornmark.md §9, 17): a company at 26 wins nine in ten of E10's fights and walks the
  road over the hills resting at its camp; one at 24 wins no more than one in four. The Grey Lion is
  won about half the time at 28 and nearly always at 30. The reach's own gate is the cap's
  (EXPANSION §5.2) and not this doc's. A company that climbs the Scarp stair from the Saltings at
  12 meets C8's line and C8's lions: a warning, not a wall, and a fight it can run from.
- **Density.** Core boxes at the Foreland's floor, country at the looser one (EXPANSION §5.3).

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
  100,320 (`src/content/areas/glasswold/atlas.ts`, #523). Today's seeds give the Glass 993 of D10's
  1,024 squares and 440 of E10's 620, the road in among them.
- **The lava flow's line** as decision 1 has it; the owner's word moves a point.
- **The names** (§10): Akordu, Kushtash and Tashkum, the last left for the reach's doc to decide.
- **The eldest at Akordu,** her own fire, where STORY has her tell the story at the port (#531):
  the chapter's step wants a place on the Wold, and the Rider's ride carries the company between
  the two. The owner may put a second telling at Cinderport's gate, or move the step.
- **The stair's head opened by C8** (#528), an edit to Saltreach's C7, with #412.
- **The pay's shares** (§8), the epic's 12,900 against the curve's 21,067, closed by the fights as
  the boxes are built or rescaled by the owner.
- **The bands on the atlas's rows:** the Wold 26–28, the Glass 30–32 and the Buried Tower 30–32,
  set in `src/content/areas/glasswold/atlas.ts`, where only the scaffold reads them; the owner's
  word changes them there.

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
  issues until #444 renames it, and its id is #529's to set when it is placed; Akordu's is #526's.

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
