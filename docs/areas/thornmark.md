# Thornmark: step II of the road, to its edges

The second step of the road of levels (DESIGN §9, EXPANSION §2.2), band 5–10: old forest over the
pass from the Foreland, where the Ashen cut the Grove Stone, and the Deepthorn south of it down to
Penspern. This is its area doc (EXPANSION §4, §6 and §8.2): where the atlas puts it, what is
built, what the atlas and the docs put in it that is not, the plan for building the rest, box by
box. Its work is filed under #208 (Phase 1.1): the boxes as §4's table has them, woods (#210), the
names (#211), the gear (#212) and the side quests on the built maps (#219), and the
gate each map is held to is #65's #209. Figures are measured on main at `54ae56d` (28 September
2026) with `worldGrid` (`src/game/atlas.ts`).

Its content is in `src/content/areas/thornmark/` (maps, monsters, items, its chapter of the one
quest, The Grove Stone, in `chapter.ts`, its side quests, The Lost Expedition and #56's six on the
built maps (#219), in `quests.ts`, climate and its part of the world map) and its businesses' rooms
in `src/ui/interiors/thornmark/`. The systems it runs on, the level cap and the spells, classes and
traits that carry a company to it included, are in [SLICE.md](../SLICE.md) ("The road to level 10").
Its ids: the area, its zone and its map are `thornmark`, the Deepthorn `deepthorn`, the town
`thornhold`, the Grove Roots `grove1` and the Cut Stone `grove2`.

---

## 1. Where it is

The atlas (its rows in `src/content/areas/thornmark/atlas.ts`, merged into `ATLAS` by
`src/content/index.ts`) makes Thornmark two zones:

| Zone | Band | Squares | Built |
|---|---|---|---|
| Thornmark | 5–10, its map's | 2,028 | 901: the Thornmark map, laid at 232,30 |
| The Deepthorn | 8–10 | 3,246 | H3, the Deepthorn's edge, laid at 232,62 (#214); I3, Deepthorn Lodge, at 264,62 (#215); I4, Henlys, at 264,94 (#49); I5, the wood to the head, at 264,126 (#217); J4, the Hoarhills' end, at 296,94 (#216); J5, Penspern, at 296,126 (#218) |
| The area | 5–10 | 5,274 | a sixth |

Squares are the ones the atlas gives each zone, shallows and rivers included. Without the shallows
the area is 4,715 squares, about 4.6 zone maps (EXPANSION §1 has 4.6). It runs from x 213 to x 339
and from the rim down to y 151, the tip of Penspern.

**The grid** (EXPANSION §8.2; docs/areas/shelf.md §1). The Thornmark map is H2, and the Deepthorn is
six boxes: H3 below the Grove; I3, I4 and I5 down the wood; J4 and J5, the Hoarhills' end and
Penspern. The rest is scraps (§11): the rim above (H1, I1); Lyngwyn's east shore under the
Hoarhills (I2) and a strip of Sunder Bay's shore by the dead wood (K4), which go with Sunderwood's
boxes (#195, #203); the Dowrdu's mouth (H4); and the Mewstone in the Wyke (G3, G4).

Its edges:

- **North: the rim,** about nine squares deep, behind Thornhold.
- **West: the ridge,** with the Scarth through it into the Foreland (1–5); south of the ridge's
  foot, the Wyke.
- **East: the Hoarhills,** between Thornmark and Sunderwood (14–16, #155), with the east road over
  them from the Thornmark map's east edge (`src/content/atlas.ts:372`), open from the start: the
  world's end there until Sunderwood's first box is built (#195). The hills run south-east and end in
  Sunder Bay, in J4; round their foot the Deepthorn's shore runs on east into Sunderwood's dead wood.
  Sunderwood's plan cuts its land in I3, I4 and J4, which the Deepthorn builds (§9, 7). The atlas's
  forest runs on over those boxes' north and east edges into Sunderwood's I2, J3 and K4, and no way is
  opened there: the ring between two zones stays mountain (`src/game/outdoors.ts:63`), so the only
  way from Thornmark into Sunderwood is the east road.
- **South: the sea,** the Wyke and Sunder Bay meeting round Penspern, with the Hearth Isle across
  the water to the south-west.
- **The Deepthorn's way in** is the Grove: the atlas's road south out of its hollow
  (`src/content/atlas.ts:371`, at 240,60.5), shut today, since the Thornmark map's last row is
  mountain from end to end (`src/content/areas/thornmark/maps/thornmark.ts:50`).

Between the two zones the area map draws a line across H3 and I3, five to fifteen squares south of
the map. It follows nothing on the ground: it is where the walk out from the Thornmark map meets
the walk from the Deepthorn's seeds, and it moves as soon as a Deepthorn map is laid, since a built
zone starts its walk from its maps. Once H3 and I3 are built the Thornmark zone is its map, and the
line its south edge.

`node tools/worldmap.ts out.png --zones` paints it.

## 2. What it is for

The second half of Act I (DESIGN §9): the Stone found cut, not failing; the Ashen Hand and a chisel
made below; the Warden of the Cut and the first Meridian journal. Every kind the Foreland showed is
here at full strength (MONSTERS §5.3). The Deepthorn is age (MONSTERS §5.4): trees older than
Helmstow in a wood older than the elves' memory, woken by the cut and not knowing friends from
cutters; and Henlys, the oldest elf-hold, which keeps a treaty sealed with the chisel's mark, the
first time the machine's script is seen on something that is not a tool. The act turns here: the
tools were made under the world, and somebody is arming the Hand. The weather is Thornmark's: colder
than the Foreland, hard winters whose snow lies for weeks, mist under the trees.

## 3. What is built

- **Gear.** A Thornmark tier in the Armoury: war hammer, battle axe, great sword, crossbow, the
  Thornmark bow, rune dagger, grove staff, runed robe, brigandine, plate, tower shield, elixirs,
  sapphire vials, lantern oil. The Armoury sells it plain; the chests hold it with a plus (#101),
  the step of the gear ladder past the Foreland's: a War Hammer +1 in the ruined watchtower, a
  Rune Dagger +1 in the barrow, a Grove Staff +1, a Thornmark Bow +1 and Brigandine +1 in the Grove
  Roots, a Great Sword +1 and, in the hoard, Brigandine +2 in the Cut Stone; the Hand of Ash drops
  a Runed Robe +1. No plate with a plus: it would pass the window's 1,200 gold. Every class finds
  one, and the harness and the gate check dress their company from them at 9 (`GEAR`):

  | Class | Its plus in Thornmark |
  |---|---|
  | Knight | War Hammer +1, keeping its shield |
  | Paladin | War Hammer +1 |
  | Ranger | Thornmark Bow +1 |
  | Barbarian | Great Sword +1, Brigandine +1 and +2 |
  | Cleric | War Hammer +1, Runed Robe +1 |
  | Sorcerer | Rune Dagger +1, Runed Robe +1 |
  | Thief, Bard | Rune Dagger +1, Brigandine +1 and +2 |
  | Monk | Grove Staff +1 |
  | Druid | Grove Staff +1, Brigandine +1 and +2 |
- **Monsters.** Thirteen for band 5–10: dire wolves, thorn spiders, brigands and their archers,
  Ashen zealots and adepts, rift hounds, bone knights, wraiths, riftling elders, ogres, and two
  bosses, the Hand of Ash and the Warden of the Cut. Two new drawings (ogre, wraith); the rest
  re-tint and re-scale the slice's ten.
- **Thornmark** (outdoor zone, 32×32, band 5–10): reached through the mountain pass on the
  Foreland's east edge, open to any company; a Warden checkpoint warns it on the way. Thornhold in
  the north-east, a ruined watchtower with an ogre's den, a barrow with bone knights and wraiths, a
  river with one bridge, a dead survey marker in a lake, and the Grove at the end of a chisel-marked
  road in the south-west. Fourteen groups. By Thornhold's north wall, the chest the watchtower's
  garrison buried when the elves shut the gate (`tm_strongbox`), the Wardens' rank 2 quest; their
  rank 1 quest is the tower's ogre (docs/areas/shelf.md §6, the Wardens' quests).
  By the boulders south of the river, a Lantern survey marker still lit (`second_marker`), the
  Lanterns' rank 2 quest; their rank 1 quest is the dark marker in the lake, seen from its west
  shore (docs/areas/shelf.md §6, the Lanterns' quests).
- **Thornhold** (town, 16×16): the Green Man inn, the Lantern Chapterhouse, the Armoury, the Lantern
  Hall (tier 4; the Lanterns' hall), the Elder's Yard, the Split Oak tavern (rumours about Vask's
  timing), a healing spring and Elder Sylvane, who pays 1500 gold for the Underdeep chisel. Ailith
  of the survey is in the Chapterhouse once the company sends her there (docs/areas/shelf.md §6, 8).
  Three first prestiges are taught here, each by a person at their trade (#19): Jago the fletcher
  in the Armoury, whose bows it sells (the Ranger's); Derwa the bone-setter in the Chapterhouse (the
  Cleric's); and Lowen at her hives under the north-east oak (the Druid's).
- **The Grove Roots** (dungeon, 16×16, band 6–9): two halves joined by a locked door; the iron
  key is behind a secret door on the west side; the stairs down are guarded.
- **The Cut Stone** (dungeon, 16×16, band 8–10): three square rings of Underdeep corridor. A
  secret door opens the second ring, a door the third, the key the chamber. The Hand of Ash and
  two adepts wait at the Stone; kill them and the Warden of the Cut, two cells on, is the
  hardest fight in the game. The chisel goes to Sylvane; the Warden drops the first Meridian
  journal. The tear closes when the Warden dies: an encounter's `slainText` is said on the kill, so
  it comes after the fight from whichever side the party fought. From then on the rift hounds and
  the riftling elders stop coming back, in the forest and under the Grove alike (`until:
  TEAR_CLOSED`, in `grove2.ts`); a group still standing stays until it is killed.
- **The Deepthorn's edge** (H3, `deepthorn_h3`, country, band 8–10; #214): the elves' road out of
  the Grove's hollow through Thornmark's south edge, which says the crossing line; the light woods
  along the Wyke; the Dowrdu's ford, the keeper's empty post and, behind young thorns (the hint),
  her roofless house with a Tower Shield +1 in her strongbox; the spiders' nest in the brakes (a
  den, #88, its hoard a Rune Dagger +2); and How Did He Know's camp, whose orders Idony wants at the
  Split Oak. On the shingle below the camp, once Hale's sergeant has asked, the keel's groove and
  the Compact knife where Hale's boat put out west (Hale's Sergeant, #558). Seven groups: dire wolves, the nest's two brood and its keepers, rift hounds until the
  tear is closed, brambles short of the ford and rootwalkers east of it, where the road runs on out
  of the east edge for I3 and Henlys. The gate holds at 8, at 7.9 fights to a rest.
- **Deepthorn Lodge** (I3, `deepthorn_i3`, country, band 8–10; #215): the upper Dowrdu down the
  box's west side, the Hoarhills across it with the Eaves' forest closed over them, and the lodge on
  its rise at 272,76, its yard shut by four brambles (a guardian) with its hunters in the cellar
  (The Hunters' Bargain). A game trail runs north past the hunters' hide and a spring to a cairn on
  the saddle and the cutters' boot prints, and above the hide Cuthred, the lodge's bowman, teaches
  the Ranger's second prestige, 21 squares from the road and eleven from the nearest group (#19); a dire wolves' den lies under a fallen oak off the road
  (its hoard a Runed Robe +2); behind the blazed oak the hunters' path runs south to the den's
  track. Eight groups, none above eight: thorn spiders in the brakes, the den's pack and two brood,
  the ogre alone on the road, the brambles, four great owls over the lodge by night and two
  heartwoods on the game trail. The road comes in from H3 and runs out of the south edge at 12,31
  for Henlys. The gate holds at 8, at 7.3 fights to a rest.
- **Henlys** (I4, `deepthorn_i4`, core, band 8–10; #49): the oldest hold, its halls grown into oaks
  round a yard, its gate shut with brambles; inside, the gate-yard's hearth (a camp), the spring and
  the hall, where Senara keeps the treaty and Mawgan sits under the hall's oak. The Deepthorn's
  step: the treaty's seal, which ends Thornmark's chapter (§5). West and south the old groves, where
  the rootwalkers all face the holly, and behind it the first grove, its chest at the oak's roots a
  Thornmark Bow +2; east the long glade, its sign at the fork, its shrine and at its head the first
  elder's statue, whose riddle Thornhold's gate answers for Brigandine +3. Nine groups, the old wood's
  asleep once the tear is closed. It is reached through I3 (#215): H4 between it and H3 is cut
  (§11). From the groves' path a way runs on south through the trees at 24,29 to 24,31, into I5
  (#217).
- **The wood to the head** (I5, `deepthorn_i5`, country, band 8–10; #217): a strip of forest down
  Penspern's west side, walked by three paths: in from Henlys's groves (its way at 24,29), down the
  shingle and through the trees to the tip, where the beach runs on east under the head for J5. The
  owls' roost, a dead oak on the shore, is the first den whose brood walks only by night (`when`),
  its hoard a Silver Torc; by night the Hearth shows through the trunks; a camp under the last oaks.
  The secret: a root with a rope's groove at the water's edge (the hint), and under it, behind a
  secret door in the trees, the hold's youths' boat with a cask of Lantern Oil and no gold (#218).
  Five groups: the roost's four old owls and its two broods of three, three brambles on the way down
  to the shore and three rootwalkers at the tip. The Hearth Isle's corner is kept, its land drawn as
  rock and never walked. A swimmer can reach the boat round the root by the water, as the skills
  that open the map are to (EXPANSION §7). The gate holds at 8, at 7.4 fights to a rest; the box
  pays 514 xp a member as measured.
- **The Hoarhills' end** (J4, `deepthorn_j4`, country, band 8–10; #216): the long glade down the
  box's west side, in from Henlys's glade at the seam and on south for the head; the last crag over
  Sunder Bay, a lookout, with the carriers' cleft in it behind a door in the rock (a War Hammer +2)
  and the boot prints on the glade road its hint; a hermit on the shore under it; the Eaves' forest
  north-east of the ridge, closed, its 30 squares of dead wood painted over as forest; and the shore
  path east to the box's edge, where K4 is void. Five groups, none above eight: thorn spiders where
  the glade comes in, dire wolves, great owls by night, rootwalkers under the crag and the heartwood
  alone at the glade's south end, the old wood asleep once the tear is closed. The gate holds at 8,
  at 7.3 fights to a rest.
- **Penspern** (J5, `deepthorn_j5`, core, band 8–10; #218): the head's neck, with J4's glade road
  down it to the crown; on the crown the standing stone, where The Older Mark's rubbing is taken,
  and the fire-stack, where Kea and the hold's youths light the Wyke's boats home by night (The
  Light on Penspern); the Eldest at the tip, the Deepthorn's boss, with two heartwoods; the Hearth
  across the water; and under the head, on its west side, the beach where the Hand's boat lands by
  night, its keel marks the hint to the sea cave behind the rock (a Great Sword +2). Five groups,
  none above eight: great owls by night, rootwalkers and a heartwood over two brambles on the neck,
  the landing party by night and the Eldest. The gate holds at 8, at 6.2 fights to a rest, and the
  Eldest is won 55% at 8 and every time at 10.
- **Weather.** Colder than the Foreland, with hard winters whose snow lies deep for weeks over the
  pass, and mist under the trees. Fronts reach it five hours after they cross the Foreland.

One clear of every map, paid by level in road order (#159), is worth level 10 per member and three
quarters of the way to 11 (15,292 xp from the Foreland on; 19,957 summed at ×1); the dungeons
respawn in one to two days, and about seven tenths of one more sweep of the Grove reaches 11, the
Elder's Yard's ceiling (about 1,000 xp a member a sweep at 10, its bosses and the Rift's groups
aside). Levels are still
bought, so the gold matters: about 8,400 for six members from 5 to 10. A clear of Thornmark pays
10,794 xp a member of the 13,667 its curve asks, and 7,600 gold of the 8,400 (the guilds' four
quests and the Wardens' chest give 800 xp a member and 820 gold of it, and #219's side quests 567 xp
and 1,082 gold): the curve (`src/content/progression.ts`) reported both as owed to the pilot (#26)
until the Deepthorn's boxes filled it: with H3, I3, I4, I5 and J4 a clear pays 15,537 xp a member
and 8,897 gold, and nothing is owed (§8).
The curve counts both of a choice's ways, so Leofwin's band and Thora's are each in it though a
company meets one at most.

The gate check (`tools/tests/gate.ts`) holds for Thornmark. Its company is dressed by the Foreland's
gear ladder (#99), so at 3 it wears the band's gear. The zone is judged two under its floor, and the
Grove Roots and the Cut Stone at their own floors only, their groups judged two under in the area's;
a boss is judged on its odds and left out of its map's day (the owner's decisions on #40). The
company wins 23% of the zone's fights at 3 and 22% of the whole area's, and all of the zone's from
4, where the damaging group spells come; at the floors it gives 5.84 fights to a rest in the zone,
5.89 in the Grove Roots and 6.89 in the Cut Stone. The zone and the Grove Roots do it with swarms:
past the two gentle groups at the way in (the dire wolves, and the ogre with his brigands and an
archer), most groups are twelve strong, of thorn spiders or brigands that die to one group spell but
bite hard, with the area's heavier monsters among them. The Grove Roots' floor, 6, is too near 3 for
anything else: a heavier group lost at 3 costs a company at 6 three or four fights' worth of its
rest. The Cut Stone, with its floor at 8, holds with fewer, harder groups of eight at most: six bone
knights, seven rift hounds, four ogres, five wraiths, the zealots with their adepts. The Hand of Ash
is won 63% of the time at level 8 and the Warden of the Cut 43%, both nearly always at 9 and every
time at 10. The area as one pools every group at its own map's floor, and wins 97.2% of them; two
under, the zone's groups at 3 and the dungeons' at the area's 3 too, it wins 21.5% (#209).

### Tests

Its `walkthrough.ts` plays the chain of the one quest, the Foreland's chapter and then its own,
The Grove Stone, a step at a time (`tools/walk.ts`); then again with Thornmark taken before Vask's
hire, and after it but before the wand, where the log must read true and end the same. A step added
to the chapter adds its play there. Then the side quests, both ways, and the prestiges' four trainers:
where each stands, the three firsts taught at 11 and the second at 19, off the road and the fights. The other end-to-end tests (the pass, the stairs) cross between
the Foreland and Thornmark, so they stay in `tools/tests/`.

## 4. What is still to build

About 4,370 squares of land, all of it void in play: the Deepthorn, the Thornmark zone's land
round its map and the rim. On the grid (§1) the Deepthorn is six boxes, which hold 3,323 of those
squares and 2,882 of the dry ones a company could walk:

| Box | Name | Kind | Band | Land | What is there | Its step of the quest | Issue |
|---|---|---|---|---|---|---|---|
| H3 | The Deepthorn's edge | country | 8–10 | 854, and 170 of sea: light woods, forest, the lower Dowrdu | the way in from the Grove; the ford; the survey team's camp; a spiders' nest | none | #214 |
| I3 | Deepthorn Lodge | country | 8–10 | 646, and 378 of the Eaves' over the Hoarhills | the lodge and its hunters; the upper Dowrdu; a wolves' den | none | #215 |
| I4 | Henlys | core | 8–10 | 922, 92 of sea and 10 of the Eaves' | Henlys and its treaty; the old groves; the long glade | the treaty's seal | #49 |
| J4 | The Hoarhills' end | country | 8–10 | 411, 429 of the Eaves' and 184 of sea | the glade road; the last crag over Sunder Bay; the dead wood across the water | none | #216 |
| I5 | The wood to the head | country | 8–10 | 249, 762 of sea and 13 of the Hearth Isle's | the last of the deep; an owls' roost | none | #217 |
| J5 | Penspern | core | 8–10 | 241, and 783 of sea: the headland | the Eldest at its tip; a standing stone; the fire for the boats; the landing | none | #218 |

The core is the two boxes the owner named for it (#49), Henlys and Penspern; the rest is
country, built to the looser floor with the wilderness features (EXPANSION §2.1 (b) and §5.3, #45).

**One band for every box,** the zone's, 8–10, as the Cut Stone has. The gate judges a map at its
floor and its boss at the floor and two above it, never past the cap. The curve holds a map's
monsters to its band, give or take two, and its hardest group above the floor and within two of the
top (`tools/tests/curve.ts:104` and `:124`). A box banded 9 or 10 fails all three with the
Deepthorn's own monsters. The rise from the way in to the head (EXPANSION §5.2) is the groups': the
gentlest at the Grove, at 6 to 8, the old wood's heaviest down the glade and the Eldest, at 10, at
the head. Each box holds a group at 9 or more for the curve.

**Two boxes hold another area's land.** I3 and J4 are more than a third and nearly half the Eaves',
Sunderwood's first zone, over the Hoarhills and round their end, and I5 holds a corner of the Hearth
Isle's rocks across deep water. A map is its whole box (EXPANSION §8.2), as D4 takes the cliff's
foot from the Delta (docs/areas/shelf.md §1): built, each is the Deepthorn's to its edges, the
ridge and its end the border inside it, and J4's Eaves' forest is drawn closed, with few paths and
nothing to find, so that the Eaves' own look is kept for Sunderwood. J4's 30 squares of dead wood
are the Eaves' too; its map paints them over as forest, so that dead wood is still new when
Sunderwood is built (§7). Both are built so (§9, 7), and Sunderwood's plan (#155) cuts the land they
take.

**The order** is the road's: H3 first, the only box that meets the built map and the Deepthorn's
way in; then I4, which holds the step, and I3 beside it; then J4, the glade road on to the head,
and I5; Penspern last. Building waits on the pilot (#47), which measures a box first and tunes
the thresholds the rest are held to. Three of the six hold ground no map character is, woods in H3
and I3 and dead wood in J4, and the scaffold refuses them until it has one: woods here, dead wood in
Sunderwood's #163 (§7).

The places, as the atlas and the docs have them:

| Place | Box | What the docs say | On the atlas |
|---|---|---|---|
| Henlys | I4 | keeps the two-hundred-year-old treaty behind the elves' claim to the throne, sealed with the chisel's mark (DESIGN §9, §10.1) | a planned site, about 274,104 |
| Deepthorn Lodge | I3 | a hunting lodge; the Ranger's second prestige (#19); its hunters took the cutters' pay (#56's 15) | a planned lodge at 278,112, in I4 (`src/content/areas/thornmark/atlas.ts:23`) |
| Penspern | J5, and I5 beside it | the Eldest (MONSTERS §5.4); a standing stone older than the elves (#56's 16); a fire for the boats (#56's 19) | the tip the sea goes round, about 300,148; a site on the crown, at the standing stone, 299.5,144.5 |
| The Dowrdu | I3, H3 and H4 | nothing yet | a river from Lyngwyn to the Wyke, named |
| Lyngwyn | H2 and I2 | its dark survey marker (built), and the Lanterns' Dark Marker (#146) | a lake, half on the built map, lettered |
| The Hoarhills | I2, I3 and J4 | nothing yet | the ridge between Thornmark and Sunderwood, ending in Sunder Bay |
| The long glade | I4 and J4 | nothing yet | a strip of grass down the wood's east side, to the head |
| The Mewstone | G4 | nothing yet | an isle in the Wyke's mouth, the Deepthorn's |

### 4.1 The briefs

Each box's brief is what EXPANSION §8.2 asks of one: its purpose, band, landmarks, the secret and
its hint, the encounters and what is new, with its points of interest and a first share of the pay
beside them. They are drafts for the owner, written before the pilot has measured a box; each is
settled in its issue, and what the pilot teaches changes them.

- **Paths.** Nearly all of the Deepthorn is forest, and a forest square is a tree. Its boxes are
  walked by their paths: the elves' roads, game trails and glades, cut from the scaffold's wood, and
  the brambles close them (§7).
- **Points of interest** (EXPANSION §5.3). A core box is held to the Thornmark map's density:
  twelve features, fourteen groups and three ways in or out to 769 open squares, 91.7% of them
  within eight steps of one and none past fifteen. A country box has about half, and the
  wilderness features (#45) do most of the work. No more than one point in four is a sign.
- **Encounters** are MONSTERS §5.4's roster and fights, with Thornmark's own monsters (§5.3) where
  its forest runs on. A group is about one of MONSTERS §4.4's standard encounters. The old wood's
  numbers came with its drawings (#48) and are drafts: the gate sets them (§8).
- **Pay.** The Deepthorn owes about 3,440 xp a member and 1,200 gold (§8). The shares below add up
  to the xp, for the curve to settle (#31) and the gate to check (#38); they were cut against 5,420
  and scaled down when the Cut Stone's retune (#148) raised Thornmark's clear.
- **Side quests** are #56's, placed as §6 has them.
- **Finds** are the top of Act I's gear ladder (§8): each is an item already or a named one, and its
  box's issue places it.

### 4.2 H3, the Deepthorn's edge (#214): country, band 8–10

- **Purpose.** The way in: the wood south of the Grove, where Thornmark's woods give way to the
  deep and the Dowrdu runs its last miles to the Wyke. The warning and not the wall (EXPANSION
  §5.2): the old wood at its gentlest, in fights a company under the band can survive or run from.
- **Landmarks.** The elves' road south out of the Grove's hollow, through the Thornmark map's south
  edge at 240,61; light woods along the Wyke, with the Foreland's shore across the water; the
  Dowrdu, in at the box's east edge and out at its south edge towards its mouth, with an old
  ford where the road crosses it, about 257,85; the first of the deep's oaks, east of the river.
- **Points of interest,** about six features and five groups:
  - the survey team's camp, a few squares past the Grove and short of the first group, so that a
    company of 7 reaches it without a fight: its tents cut and its fire-pit full of burnt paper (How
    Did He Know, §6);
  - the ford, and its keeper's empty post;
  - a shrine where the road leaves the Grove's hollow (#45);
  - a camp on the Wyke's shore, the Foreland's lights across the water by night (#45);
  - a cairn on the river bank (#45);
  - a sign at the Grove's edge, where the Deepthorn begins;
  - a thorn spiders' nest in the brakes by the river, a den (#88), with its hoard.
- **Encounters.** Brambles across the road south of the Grove, two to a group, the gentlest groups
  past the way in; dire wolves, a pack of eight; rift hounds strayed south from the Grove, which stop
  coming once the tear is closed (`until`, as the Grove's own do); thorn spiders, the nest's brood;
  the nest's keepers; and east of the ford, where the woods turn to the deep, two rootwalkers, the
  box's hardest group, at 9.
- **Quests.** No step of the one quest. How Did He Know (#56's 14).
- **The secret and its hint.** East of the ford an old path runs to the ford-keeper's house, closed
  by thorns: a secret door in the trees. The house is roofless, and the strongbox of her tolls is
  where she left it. The hint, at the ford: the thorns across the old path are younger than the
  rest of the wood.
- **New here.** Woods underfoot (§7); the old wood, at its gentlest; a wood walked by its paths.
- **Finds.** The ford-keeper's strongbox holds a Tower Shield +1; the nest's hoard, a dead
  traveller's Rune Dagger +2.
- **Pay.** About 410 xp a member.
- **As built** (#214, 30 September): the brief's places, with harder monsters, not bigger groups, as
  the Cut Stone has them: no group above eight (the owner's delegate). The bramble and the
  rootwalker are retuned as #298 has them (57 and 83 hit points), the brambles four and the
  rootwalkers four, the rift hounds, the wolves, the nest's keepers and its two brood eight each;
  the nest breeds two brood, not three. The brambles stand rooted across the road short of the ford,
  and they and the rootwalkers stop coming once the tear is closed. A company at 8 wins every fight
  and manages 7.9 fights to a rest. The rise from the way in put the wolves nearest. As measured it
  pays about 1,300 xp a member and 610 gold; the 410 and 160 shared to it here are drafts. It took
  an afternoon's session, the scaffold to a green check. What the owner finds by hand goes here when
  the box has been played.

### 4.3 I3, Deepthorn Lodge (#215): country, band 8–10

- **Purpose.** The Deepthorn's north-east: the upper Dowrdu under the Hoarhills, and the
  hunters' lodge the cutters came through, over the hills, on their way to the Grove.
- **Landmarks.** The Hoarhills, bare above the trees, crossing the box from its north-west corner to
  its south-east, with the Eaves' forest over them (§4); the Dowrdu, out of Lyngwyn at the
  north-west corner and down the box's west side; Deepthorn Lodge on a rise above the river, about
  272,76, its yard grown shut with brambles; a game trail up the ridge's foot to a saddle.
- **Points of interest,** about six features and five groups:
  - Deepthorn Lodge, barred, with its hunters shut in its cellar (The Hunters' Bargain, §6);
  - the lodge's well;
  - a hunters' hide over the game trail, a camp to rest at (#45);
  - a spring under the ridge (#45's fountain);
  - a cairn on the saddle, and boot prints coming down past it from the east (#45);
  - a dire wolves' den under the root plate of a fallen oak, a den (#88), with its hoard.
- **Encounters.** Brambles across the lodge's yard (four); dire wolves, the den's brood, in packs
  of eight to ten, and the den's pack, which never leaves it; thorn spiders in the river brakes; a
  great owl over the lodge by night (`when`); the ogre alone in the deep (MONSTERS §5.4); and a
  heartwood on the game trail, the box's hardest group, at 10.
- **Quests.** The Hunters' Bargain (#56's 15). The Ranger's second prestige is taught at the
  lodge's hide, by Cuthred (#19; §9, 45).
- **The secret and its hint.** The hunters' path: a way south through a thicket the brambles do not
  cross, a secret door in the trees, towards Henlys. The hint: an oak at the thicket's edge
  blazed with three notches, the hunters' mark for a way through. The eldest hunter shows it to a
  company that keeps the lodge's secret (§6); a company that reads the blaze finds it anyway.
- **New here.** A lodge in the deep, and a rest there.
- **Finds.** The den's hoard, what the pack dragged in: a dead Lantern's Runed Robe +2.
- **Pay.** About 470 xp a member.
- **As built** (#215, 30 September): the brief's places, no group above eight, with the bramble, the
  rootwalker, the great owl and the heartwood as #298 retunes them. The den's brood are eight, not
  eight to ten; the owl is four by night; the heartwood two. The yard's brambles are a guardian, so
  Godric comes up once they are cut down. The hunters' path runs south from the yard to the den's
  track, since a way to I4 of its own would cross the road. As measured it pays about 1,100 xp a
  member and 210 gold, and brings Thornmark's gold to the curve's 8,400, so its owed gold is
  dropped. Cuthred teaches the Ranger's second above the hide (#19). What the owner finds by hand
  goes here when the box has been played.

### 4.4 I4, Henlys (#49): core, band 8–10

- **Purpose.** The Deepthorn's step: Henlys, which keeps the treaty sealed with the
  chisel's mark (DESIGN §9), and the old wood at its thickest round it.
- **Landmarks.** Henlys in the deep of the box, about 274,104, its halls grown into oaks
  older than Thornhold's and its gate shut against its own wood; the old groves round it, rings of
  oaks where the rootwalkers stand; the long glade down the box's east side, the road to the head;
  the Wyke's shore on the west, where the trees stand in the water.
- **Points of interest,** about nine features and ten groups:
  - the hold's gate, with brambles standing in it;
  - the lorekeeper and the treaty: the step (§5); she asks for The Older Mark (§6);
  - the hold's elder, who keeps the elves' claim to Helmstow's throne (DESIGN §10.1) and does not
    speak of it to strangers;
  - the hold's spring, a well that heals;
  - a camp inside the gate, to rest at within the hold's walls (#45);
  - the old groves, where the rootwalkers stand in rings;
  - a statue of the hold's first elder at the glade's head, with a riddle answered by the last word
    of Thornhold's gate sign (#45's statue);
  - a shrine in the glade (#45);
  - a sign where the glade road forks: the hold west, the head south.
- **Encounters.** Brambles across the hold's paths (three groups); the oak behind the thicket, a
  heartwood over three brambles (MONSTERS §5.4); rootwalkers in the old groves (two groups of
  three); brambles and a great owl on a path by night (MONSTERS §5.4); dire wolves in the glade;
  thorn spiders.
- **Quests.** The step: the treaty's seal (§5). The Older Mark starts with the lorekeeper (#56's 16).
- **The secret and its hint.** Behind a wall of holly in the old groves, the hold's first grove,
  where the oak the first elders planted stands, and at its roots what the hold lays there: the
  bows of its best hunters, when they die. The hint: the rootwalkers in the old groves all stand
  facing the same way, towards the holly.
- **New here.** The rootwalker and the heartwood; a hold besieged by its own wood.
- **Finds.** The first grove holds a Thornmark Bow +2; the statue gives Brigandine +3 for its
  answer.
- **Pay.** About 890 xp a member.
- **As built** (#49, 30 September): the brief's places and groups, the old wood set on MONSTERS
  §4.4's lines for its roles and levels (§7), since on its drafts every group was won at level 4
  and a company at 8 fought 18.8 to a rest. Harder monsters, not bigger groups: the brambles three
  to a group, the rootwalkers three, the owls two over two brambles by night, the wolves eight. It
  gives a company at 8 7.2 fights to a rest, every group won. It pays 1,098 xp a member and 275
  gold, against the 890 and 275 shared to it here; the old wood's pay is its role's at its level.
  The heartwood is drawn at 1.3, not 1.8: at 1.8 no group of it keeps its label above it (§7).

### 4.5 J4, the Hoarhills' end (#216): country, band 8–10

- **Purpose.** The road down the glade to the head, and the Hoarhills running out into Sunder
  Bay. From the last crag, the first sight of Sunderwood's dead wood across the water: Act II, seen
  from the edge of Act I, as D3 shows the Upper Water (docs/areas/shelf.md §4.8).
- **Landmarks.** The long glade down the box's west side; the Hoarhills' last crags going down into
  the bay; the Eaves' forest north-east of them, built as the Deepthorn's (§4) but drawn as closed
  forest with few paths and nothing to find, so that the Eaves' own look is kept for Sunderwood, and
  its dead wood painted over; the bay shore round the ridge's foot, east to the box's edge, where
  Sunderwood's dead wood begins in K4 (#203) and the world ends until it is built; across the bay,
  dead trees white against the Eaves' green.
- **Points of interest,** about five features and four groups:
  - a lookout on the last crag, over the bay and the dead wood;
  - a hermit on the shore who watches the dead wood, with a rumour of what split it (#45's hermit);
  - a shrine in the glade (#45);
  - a camp in the lee of the crag (#45);
  - a cairn on the shore (#45);
  - a sign where the glade road meets the shore path.
- **Encounters.** A heartwood alone in the glade, the box's hardest group, at 10; rootwalkers under
  the crag (two); dire wolves; thorn spiders on the crag; great owls over the glade by night.
- **Quests.** None.
- **The secret and its hint.** A cleft in the last crag where the Hand's carriers rest their loads
  on the way to the head's landing: rope, sacking and a Compact knife. The hint: boot prints on the
  glade road, many and deep, of people carrying weight: all going south, with a few turning off
  towards the crag.
- **New here.** Sunderwood, across the water.
- **Finds.** The carriers' cleft holds a War Hammer +2.
- **Pay.** About 470 xp a member.
- **As built** (#216, 30 September): the brief's places, no group above eight, the old wood on
  #298's numbers. The rootwalkers under the crag are four, not two, one standard encounter of them;
  the thorn spiders stand where the glade comes in, not on the crag, the gentlest group at the way
  in. The glade road is a track of dirt down the glade, as Henlys's is. The heartwood is one, alone,
  as the brief has it. The shrine, the camp and the cairn are the builder's words. As measured it
  pays about 700 xp a member and 200 gold. What the owner finds by hand goes here when the box has
  been played.

### 4.6 I5, the wood to the head (#217): country, band 8–10

- **Purpose.** The last of the deep: the forest down Penspern's west side to the Wyke's shore.
- **Landmarks.** The forest to the shore; at night the Hearth's light between the trunks, closer
  than it has been anywhere on the road.
- **Points of interest,** about three features and three groups:
  - a camp on the shore (#45);
  - a cairn (#45);
  - an owls' roost in a dead oak, a den (#88), with its hoard.
- **Encounters.** Great owls by night, the roost's brood; the roost's keepers; brambles; rootwalkers,
  the box's hardest group, at 9.
- **Quests.** None.
- **The secret and its hint.** A hollow under an oak's roots at the water's edge, where the hold's
  youths keep their boat and the oil for the fire on the head (§4.7). The hint: a rope's groove worn
  into a root at the shore.
- **New here.** The first den whose brood walks only by night: the owls' roost.
- **Finds.** The roost's hoard, the bright things an owl would carry: a silver torc, a keepsake that
  sells well.
- **Pay.** About 360 xp a member.

### 4.7 J5, Penspern (#218): core, band 8–10

- **Purpose.** The Deepthorn's end and its hardest place: the Eldest at the head's tip, a standing
  stone older than the elves on its crown, the fire the hold's youths light for the boats and the
  Hand's landing under the head by night. The Hearth is closer here than anywhere on the road
  before Act V.
- **Landmarks.** The head's grass, running down to its tip, about 300,148; the Eldest at the tip,
  its roots creeping up the head towards the stone, which they have not yet reached (#56's 16); the
  standing stone and the fire-stack on the crown; the beach under the head, where boats put in; the
  Hearth across the water to the south-west.
- **Points of interest,** about seven features and six groups:
  - the Eldest at the tip, the boss;
  - the standing stone on the crown, short of the Eldest's roots (The Older Mark, §6);
  - the fire-stack, and the youths who light it by night (The Light on Penspern, §6);
  - the landing on the beach: keel marks, and by night the Hand's boat;
  - the Hearth across the water, as close as it comes: on a still night, one low note, held;
  - a camp in the lee of the head (#45);
  - a cairn at the tip (#45);
  - a shrine on the head's crown (#45).
- **Encounters.** The Eldest, the boss, with two heartwoods at its roots, at 10: a boss wants an
  escort (MONSTERS §4.4); a heartwood over brambles on the head; the Hand's landing party by night
  (`when`), zealots with an adept; great owls by night.
- **Quests.** The Older Mark ends here, and The Light on Penspern is here (#56's 16 and 19).
- **The secret and its hint.** A sea cave under the head, where the Hand stacks what it ships: crates
  packed in straw, and in the straw, pieces of cut Stone. The hint: keel marks on the beach under
  the head, which run up to the rock and stop.
- **New here.** A boss outdoors: the Eldest. The Hearth, close.
- **Finds.** The Eldest, beaten, drops the Eldest's Bough, a Grove Staff +2 of its own; the Hand's
  cave holds a Great Sword +2.
- **Pay.** About 830 xp a member.
- **As built** (#218, 1 October): the brief's places, no group above eight, the old wood on #298's
  numbers. The head's neck runs north to south from J4's glade road, which goes on down it as a
  track of dirt to the crown; the stone and the fire-stack stand on the crown and the Eldest at the
  tip with its two heartwoods; the beach and the sea cave are on the head's west side, where its
  shingle meets I5's at 0,20. Rootwalkers (three) on the glade road are the builder's, so that the
  box is won nine fights in ten at 8 with the boss among them: four groups were 88.8%. The heartwood
  over two brambles stands across the neck where it is narrowest, and the rubbing is reached past
  it, not past the Eldest. The landing party is an adept and five zealots, by night; the owls are
  four. The Eldest is the Hand of Ash's weight, 450 hit points and 4d8+12, for the boss's odds: 55%
  at 8 and 100% at 10. It is drawn at 2, a tall boss (#318): in a fight it stands on the third
  rank before its heartwoods, its roots sunk, under its label (§7). The
  rubbing pays 150 at Senara's hand-in, whose ask is now her hire, so that a rubbing brought
  unasked hears her early words. As measured it pays about 1,230 xp a member and 460 gold, the
  Eldest 650 of the xp. What the owner finds by hand goes here when the box has been played.

## 5. The one quest here

Thornmark's chapter is The Grove Stone (`chapter.ts`): Sylvane's charge, the Stone found cut, the
chisel, the tear, the pay and the seal. DESIGN §9 gives the Deepthorn one step, built in #49: in
Henlys (I4), the treaty that says the elves' line and Helmstow's were once one, sealed with the
chisel's mark.

Every zone on the road holds at least one step (EXPANSION §5.8); this is the Deepthorn's. Sylvane
gives the lead: STORY has her know the chisel's marks from the seal of an old treaty her people
keep, and her done words gain the line that sends the company south to see it. The chapter ends on
the seal seen, or shown by Senara, with the chisel paid for, and the log says of the seal that it is the chisel's mark
and no more. A company that reaches the hold early sees a treaty with a seal it does not know yet,
and the chisel, found after, makes the match, so the log reads true in either order.

The treaty is also the elves' claim to Helmstow's throne, which the Lanterns back (DESIGN §10.1), and
seeing it opens The Empty Throne in the log, as the Meridian journal opens The Lost Expedition: a
subplot with no end yet, whose first entry says only what was seen, a treaty the elves keep and
their elder keeps close. Its start is a list, so that a claim met first opens it too; the cousin's
and Tallis's claims add their entries when they are built, and #56's 64 ends it. It lives in
Thornmark's `quests.ts`, as The Lost Expedition does, until subplots that span areas have a home of
their own (§9).

## 6. Side quests

#56 drafts twelve for Thornmark, levels 5 to 10: its 9 to 20. Each is set in Thornmark's own
country at its level, spends no story lock and turns on a person and a choice. As the Foreland's
were (docs/areas/shelf.md §6), each is built where its places are:

| # | Quest | Level | Where | What it needs | Built in |
|---|---|---|---|---|---|
| 9 | A Coin Not From Caldera | 5 | the Split Oak; a deserter's camp off the Warden road | an item no shop buys; a choice put by a person | the built maps (#219), built |
| 10 | Leave the Trees Standing | 5 | the Grove road; Thornhold | a choice put by a person; a person who moves | the built maps (#219), built |
| 11 | The Dark Glass | 6 | Lyngwyn; the Chapterhouse | a hand-in; words that change with a flag; a choice | the built maps (#219), after the Lanterns' Dark Marker (#146), built |
| 12 | The Elder's Four | 6 | the Grove Roots; Thornhold | a person found below; a choice; an event that comes with a flag | the built maps (#219), built |
| 13 | The Ogre's Boy | 7 | the old tower; Thornhold | a group that talks before it fights | held (below) |
| 14 | How Did He Know | 7 | the survey team's camp (H3); the Split Oak | a letter read from the pack; a hand-in; a choice | H3 (#214), built |
| 15 | The Hunters' Bargain | 8 | Deepthorn Lodge (I3) | a choice; the hunters' path, a secret hinted | I3 (#215), built |
| 16 | The Older Mark | 8 | Henlys (I4) and Penspern (J5) | a rubbing, an item made at the stone; a hand-in; a choice | I4 and J5 (#49, #218), built |
| 17 | Terms From the Brigands | 9 | a brigands' camp off the Warden road; Thornhold | a choice; brigand groups that stop coming (`until`) | the built maps (#219), built |
| 18 | The Mender | 9 | the Grove road, the Grove and the Cut Stone | a person who moves; an event that changes with a flag; an item | the built maps (#219), built |
| 19 | The Light on Penspern | 10 | Penspern (J5), by night | people and groups by night (`when`); a choice | J5 (#218), built |
| 20 | Hale's Sergeant | 10 | Thornhold; the Deepthorn's shore | Hale gone from the Scarth | Act II (#558, after #156 and #190), built |

Taken: 9 to 12 and 14 to 20. The changes to #56's drafts:

- **13 is held.** The Wardens' rank 1 quest (#144) kills the tower's ogre, and 13's bargain leaves it
  alive, which asks for a group that talks before it fights: the toll the giants take on their Stair
  (MONSTERS §8.1), first needed in the Whitespine. It is built with that system, not before.
- **20 goes to Act II.** Hale's vanishing is Act II's news (DESIGN §9, STORY) and his checkpoint is
  the Wardens' first task (DESIGN §8); the quest would take him off the Foreland map at level 10. It
  is Act II's: it starts at Thornhold once Hale is gone from the pass (`q_hale_taken`, which #156
  sets) and ends on the Tide Ship with his pass-token (#190). #156 built the pass and left the
  quest to #558: it is a whole quest, and its token is known in Wrackholm's hold. #558 built it:
  Wystan at Thornhold's gate, the boat gone west from H3's shingle, his choice and Hale's token
  (§9, 23 to 40).
- **11 follows the Lanterns' Dark Marker.** #146 builds the Lanterns' rank 1 quest at the same
  marker as a look and a report (DESIGN §8). 11 stays a plain quest, given at the Chapterhouse as #56
  has it, which asks for the glass once the marker is known dark.
- **16's stone stands clear of the Eldest.** #56 has the rubbing taken "before the Eldest takes the
  head": the stone is on the head's crown and the Eldest's roots are creeping towards it, so a
  company of 8 takes the rubbing at J5's floor without fighting the boss.
- **14's camp is at the Deepthorn's very edge,** a few squares past the Grove and short of the first
  group, so that a company of 7 reaches it without a fight in country banded 8–10.
- **17 keeps its prices.** Its cheaper Armoury is a shop whose prices change with a flag, which the
  game lacks; the brigands stopping (`until`) is the consequence, and the Armoury's smith says so.
- **18 stays a side quest.** The build closes the tear at the Warden of the Cut's death and leaves
  the cut for a Lantern to mend (#41), and DESIGN §9's act ends on its revelation, not on the mend.
- **10's woodwarden is a woodward:** *Warden* is taken (MONSTERS §1).
- **14's orders and 16's rubbing are taken, then asked about.** #56 has the company give each or
  keep it; an answer cannot take an item (#76), so Idony and Senara take theirs at the first
  meeting (#43) and put the question at the next, and "keep" hands it back.
- **11's second payment is a Sapphire Vial.** #56 has the Reader pay double for silence; an answer
  cannot pay gold, so it hands over the vial instead.
- **10's burner ends at the pass's Thornmark end,** not the Hearthlight, which is the Foreland's
  file.

What they ask of the systems is #76's: choices put by a person, words that change with a flag,
people and events that come and go with a flag or the hours, several items to one person and
letters read from the pack. Every line they put on screen is written in the issue that builds
them, measured against the game's box and log, as the Foreland's are (#47, #77).

## 7. Encounters, and what is new

MONSTERS §5.4 has the Deepthorn's roster and fights: the Bramble, the Great Owl, the Rootwalker,
the Heartwood and the Eldest, drawn in #48; brambles and an owl on a path at night; the oak behind
the thicket. Back from Thornmark, as MONSTERS §5.4 has them: the Dire Wolf in bigger packs, the
Thorn Spider and the Ogre, alone in the deep. Two more are this plan's: rift hounds strayed south
from the Grove into H3, which stop with the Grove's own; and the Hand at the head's landing, zealots
with an adept. §4.2 to §4.7 place every group, box by box; the Deepthorn's five are unplaced until
then (`tools/tests/maps.ts:21`), and each box drops the entries of those it places first: H3 the
Bramble and the Rootwalker, I4 the Heartwood and the Great Owl, J5 the Eldest. The heartwood is drawn
at 1.3, not the 1.8 it was drawn for: taller, a fight's label falls on its marker (#49, #218). The
Eldest is drawn at its 2, seated in a fight as a tall boss (#318).

The old wood woke when the Stone was cut and sleeps when it is restored (MONSTERS §5.4): in the
build, when the tear closes at the Warden of the Cut's death (#41, #49), its groups stop coming back
(`until`). A group still standing stays until it is killed, and the Eldest, which never comes back
anyway, stands at the head whichever the company does first: the last of the wood awake. Beaten, it
is put back to sleep rather than felled, as its `slainText` says, and MONSTERS §5.4's line for it
says so. Asleep once the tear closes would ask for a group that stands down on a flag, and leave a
company that follows the quest's order with no boss in the Deepthorn and no Eldest's Bough.

New in the Deepthorn, for the novelty check (EXPANSION §5.4):

- **The old wood,** a new family.
- **Woods,** as terrain: the Deepthorn's own light woods along the Wyke, in H3 (243 squares), and 62
  in I3, 15 of them on the Deepthorn's side of the ridge and 47 on the Eaves'. The atlas's woods
  have no map character, so the scaffold refuses both boxes. Woods are given one and walked (#210), as
  hills and farmland were for the Downs (#44). Sunderwood's first boxes hold woods too: the scaffold
  refuses I2 (#195) for 579 squares of them and J2 (#196) for 18, and no issue of Act II's gives
  them a character.
- **Deepthorn Lodge,** the first lodge on the road, a landmark.

Dead wood is Sunderwood's ground (EXPANSION §7), and #163 gives it its character. J4 holds 30
squares of it, all the Eaves'; the scaffold cuts J4 once #163 has landed, and its map paints them
over as forest, so that dead wood is still new when Sunderwood is built.

New but not for the check: a wood walked by its paths, which the brambles close; a boss outdoors,
the Eldest; and the first den whose brood walks only by night, I5's owls' roost. Brambles that never
roam and wake at one square are the Warden of the Cut's rule already (`grove2.ts`), not a new one.

Dens (#88) come back: a thorn spiders' nest in H3, a dire wolves' den in I3 and the owls' roost in
I5.

## 8. The numbers

- **Experience.** A clear of Thornmark pays 10,227 xp a member on main (§3), the Lanterns' quests
  (#146) in it, and 10,794 with #219's side quests. The curve (EXPANSION §5.2, #31) asks the climb
  from 5 to 10 over 0.75, 13,667 (`src/content/progression.ts:38`). The Deepthorn is where the other
  3,440 or so come from, shared among the boxes as §4.1 has it: H3 410, I3 470, I4 890, J4 470, I5
  360 and J5 830, the first shares scaled down by the same fraction when #148 raised the clear.
  #219's 567 are not taken off: they are all Leofwin's band and Thora's, and a company fights one at
  most, the peaceful ways neither, so the Deepthorn's share does not pay for fights most companies
  never have. Until the boxes were built the curve reported the shortfall as owed to #26. A den's
  keepers pay once, and its brood as a group that respawns does; the figures count the brood once.
  Act II's cap and curve (#159) are to pay a kill by the monster's level against the member's, which
  re-prices every figure here if they land first; each box is measured when it is built. H3, built,
  pays about 1,300 xp a member as measured (#214), and brings a clear to 12,101; I3 (#215), I4
  (#49), I5, 514 (#217), and J4 (#216) bring it to 15,537, past the curve's 13,667, and the
  shortfall owed goes; J5 (#218, about 1,230) brings it to 16,765.
- **Gold.** A clear pays 6,518 of the 8,400 that training six members from 5 to 10 costs (§3), the
  Lanterns' quests in it, and 7,600 with #219's side quests. The Deepthorn's share of the rest is
  about 1,200, the 1,900 it was less the two hand-ins' sure 700 (#219): H3 160, I3 170, I4 275, J4
  160, I5 95 and J5 340, in its chests, cairns and hoards, the Hand's drops at the landing and the
  side quests' pay.
- **The gate.** Each box is held to its band as it is built (`tools/tests/gate.ts`): at 8 a box's
  groups are won nine fights in ten, and the Eldest about half the time at 8 and nearly always at
  10. The area as one pools each group at its own map's floor (#209), so the Deepthorn's groups
  count at 8 and the Downs' boxes at theirs. Two under, a box's groups count at 6, two under its own
  floor, in Thornmark's pool, with the zone's at 3 and the dungeons' at 3, the area's floor less
  two; its floor above the area's, a box is not held two under on its own. The Deepthorn is a zone
  of its own, with its road walked at 8 and its warning at its way in from the Grove
  (`ROADS.deepthorn`, from H3), and its boss the Eldest (`BOSSES.deepthorn`), won 55% at 8 and 100%
  at 10. Thornmark's own gate holds, as §3 has it. With all six boxes built, Thornmark two under its
  maps' floors wins 60.6% of its 75 groups' fights, off the aim of 25% and inside the limit: it comes of
  #209's pooling, which the size of a group does not move.
- **Gear.** The top of Act I's gear ladder (#99, #101). Thornmark's chests hold its gear with a
  plus, which every class has by 9; the Deepthorn holds the next step, a +2 or better for every
  class, by 10, every one inside the window's 1,200 gold. The harness and the gate check dress their
  company from it at 10 (`GEAR`, `tools/harness.ts`), and Act II's gate check runs its company at 10
  in it (#159). Saltmouth's armourer, the next rung, is set a step past Thornmark's Armoury (#177);
  it is to be a step past this. A shield is never beside a two-handed weapon
  (`src/game/party.ts:177`), so the Knight and the Paladin keep theirs with a War Hammer; and a Monk
  keeps to a robe's armour, or loses Unarmoured Defence (`robeLike`), so the Monk's step is a weapon
  alone:

  | Class | Its find in the Deepthorn |
  |---|---|
  | Knight | War Hammer +2, Tower Shield +1 |
  | Paladin | War Hammer +2, Tower Shield +1 |
  | Ranger | Thornmark Bow +2 |
  | Barbarian | Great Sword +2, Brigandine +3 |
  | Cleric | War Hammer +2, Runed Robe +2 |
  | Sorcerer | Rune Dagger +2, Runed Robe +2 |
  | Thief, Bard | Rune Dagger +2, Brigandine +3 |
  | Monk | the Eldest's Bough |
  | Druid | the Eldest's Bough, Brigandine +3 |

  With them, a Silver Torc, I5's keepsake. The Monk's is a Grove Staff +2 of its own, the Eldest's
  Bough +2. The gear finds are in the ladder at 10 (`GEAR`), and `tools/tests/ladder.ts` holds each
  class to bettering its Thornmark find with them and each find owed to its box until it is placed.
- **Spells** come with levels (`spellTierAt`), tier 5 at 8, inside the band: `levelUp` teaches
  every spell up to a member's tier free (`src/game/party.ts:271-273`). Thornhold's Lantern Hall
  sells to tier 4 (`src/content/areas/thornmark/maps/thornhold.ts:42`), and stays there. A hall
  offers any spell up to its `maxTier` with no check of level (`src/ui/screens.ts:506-510`), so at
  tier 5 it would sell a caster of 8 nothing, and sell Meteor Swarm, Tempest and Wrath early, at 5 to
  7, against the monsters' tuning (MONSTERS §4.4). #213 asked for it and was closed as not planned,
  as #74 was for the Foreland; what a hall sells beside `levelUp` is a question for later.

## 9. Decisions

Decided by the owner already, and followed here:

1. **The grid, and zones of several maps** (docs/areas/shelf.md §9, 1 and 3): the Deepthorn is one
   zone of several boxes.
2. **The Deepthorn's core** is Henlys and Penspern (#49).
3. **The old wood sleeps with the Grove Stone,** which in the build is the tear closing at the
   Warden of the Cut's death (#41, #49); all but the Eldest, below.

Settled on 28 September 2026 by an agent the owner asked to make the calls, and confirmed by the
owner when the issues were filed on 29 September, under #208:

4. **The briefs** of §4.2 to §4.7 stand as drafts, each settled in its issue.
5. **Six boxes, one band.** The Deepthorn is H3, I3, I4, J4, I5 and J5, each banded 8–10, the
   zone's, with the rise in the groups (§4).
6. **The core** is I4 and J5; H3, I3, J4 and I5 are country (§4).
7. **I3 and J4 are built whole,** the Eaves' squares in them the Deepthorn's and the Hoarhills and
   their end the border inside them (EXPANSION §8.2, as D4 takes the cliff's foot). J4's Eaves'
   forest is closed, with few paths and nothing to find, so that the Eaves' own look is kept for
   Sunderwood. Sunderwood's plan (#155) cuts the same land, so the two agree; the boxes' edges that
   face the Eaves' boxes open no way into them (§1).
8. **The Eldest stays awake** until it is beaten, whichever the company does first; beaten, it is
   put back to sleep, not felled (§7), as MONSTERS §5.4 now says.
9. **#49 becomes Henlys's box,** I4, with the step; Penspern, J5, is filed on its own, and
   the other boxes an issue each, as the Downs' are. Its line on Thornmark's south edge moves to H3,
   the way in.
10. **Henlys is drawn on its box,** as Gullwick is on F3: its halls, its gate and its people
    as features, and a camp to rest at. No businesses, so no new interiors.
11. **Deepthorn Lodge moves** from 278,112 in I4 to about 272,76 in I3, on the cutters' way over the
    Hoarhills and off the road, as #19's second prestige asks.
12. **The step** is the treaty's seal, in Henlys; the chapter ends on it (§5).
13. **The Empty Throne** opens at the treaty (§5).
14. **The side quests:** #56's 9 to 12 and 14 to 19 are taken, with the changes in §6; 13 is held for
    a group that talks before it fights, and 20 is Act II's (#156, #190).
15. **The Mender** stays a side quest, not the chapter's last step (§6).
16. **Woods are walked,** with a map character. Dead wood's is #163's, Sunderwood's, and J4 paints
    its 30 squares over as forest (§7).
17. **The gate pools each group at its own map's floor,** so that the Deepthorn is held at 8 and the
    Downs' boxes at theirs: built (#209), a box's groups two under its own floor in the area's pool
    (§8).
18. **The ladder's top:** a +2 or better for every class in the Deepthorn, the Eldest's Bough and a
    Silver Torc (§8).
19. **Tier 5** comes with level 8, and Thornhold's Lantern Hall stays at tier 4: a hall can only sell
    a tier early (§8; #213, closed as not planned on the owner's delegate's call, 29 September).
20. **The cuts** of §11, the Dowrdu's mouth among them.
21. **The names** of §10.
22. **The epic** is Phase 1.1's, as the owner called it and #151's call 11 numbers #26: under #26 as
    #65 is, the second half of its build-out, before Act II's Phase 1.2 (#149).

Hale's Sergeant (#56's 20), settled on 2 October 2026 by an agent for #558, each the owner's to
overturn:

23. **Wystan, sergeant of the Scarth,** a Foreland Warden of Hale's post, gives it. Leofwin is the
    post's deserter (9) and Cenric is Vask's man on Penspern (19), so the name is free.
24. **He stands by Thornhold's gate at 9,14,** a borrowed horse saddled, `after` `q_hale_taken` and
    `until` either answer: a man about to leave, passed on the way in.
25. **Talked down, he keeps the Split Oak's door:** a second person at 12,13 `after`
    `q_sergeant_stays`, with no `until`, as the tavern's other people stand.
26. **Let go, he is simply gone.** Nothing waits for him in Helmstow, which is the Foreland's file.
27. **"Seen the strangers" is `q_hale_taken` itself.** The strangers set nothing (docs/areas/shelf.md
    §9, 24), and the flag is what puts them at the pass. A company without it finds no sergeant.
28. **The shore is H3's shingle below the camp, at 9,14,** the Deepthorn's edge and the shore
    nearest Thornhold. I5's shingle keeps the youths' boat and J5's beach the Hand's landing.
29. **The shore is one once-event, `h3_boat`, `after` `q_sergeant`:** keel and Warden boots to the
    water, the boat gone west. Before he asks, the shingle shows nothing that would mean nothing.
30. **The trail is the goal alone,** with no events on the way: the goal names the shingle and the
    event is the trail's end.
31. **The Compact knife is a look** in the event's words, not an item, so nothing has to take it.
32. **The choice is put when the company brings the news:** his words `after` `h3_boat` seen, until
    answered. "Don't ride." sets `q_sergeant_stays` and "Ride, then." `q_sergeant_rides`; both give
    the token.
33. **The token is `hale_token`, Hale's Token,** a bronze disc with the Scarth's notch and Hale's
    mark. No shop buys it and nothing takes it, so it stays in the pack for #56's 41.
34. **Hale names the token and leaves it.** In tide_ship3 his freeing words have a twin `after` the
    token carried, setting `q_hale_freed` and `q_sergeant_hale`: three lines, the first two the same
    and the last folding the bilge's pins into his knowing the disc and Wystan.
35. **The quest is done at the answer.** Hale knowing the token is an entry written after the end,
    not a step, so a company that frees Hale first is left with no goal it cannot finish.
36. **Hale freed first changes nothing at Thornhold.** Wystan has not had the news, so he still
    asks and gives the token, which then serves #56's 41 alone.
37. **The quest is `sergeant`, Hale's Sergeant,** in Thornmark's `quests.ts`, begun by `q_sergeant`,
    the hire his first meeting sets.
38. **The journal has five entries, four of which a company writes:** Wystan's ask, the shore, the
    door or the ride, and Hale knowing the token. Its goals are the shingle, then Wystan.
39. **His words keep to the box:** the first meeting three lines, the shore two sentences, each
    answer two lines and the door two.
40. **The walk:** Thornmark's walkthrough sets `q_hale_taken` by hand, finds no sergeant without
    it, plays both answers and frees Hale in the hold with the token and without it.

Decided by delegate for #19's trainers in Thornmark, on 3 October 2026, each the owner's to
overturn:

41. **Four new people teach:** Jago, Derwa and Lowen in Thornhold and Cuthred at the lodge. Kerrow
    is a smith, and stands only once the terms are taken; Tamsin is a Reader; Godric carries a spear,
    his first meeting is the Bargain's choice, and he comes up only once the yard is cut.
42. **Jago, the hold's fletcher, stands in the Armoury,** whose bows are his: no new business, the
    shop his as much as the smith's.
43. **Derwa, the bone-setter, stands in the Lantern Chapterhouse,** whose cures are her trade.
44. **Lowen keeps the hold's bees under the north-east oak, in the street.** Honey and salves wait on
    #18, so she keeps no shop, as Saltmouth's street trainers keep none.
45. **Cuthred, the lodge's bowman, keeps the hunters' hide, at 7,2 above it.** The yard is nine
    squares from the road at most; the hide's height is 21 from it and eleven from the nearest
    group, the heartwood, so the rule Rietum's are held to holds as written.
46. **All four are always there,** with no `after`, `until` or `when`, so no trainer is missed.
    Cuthred was at the hide when the wood came up the yard and is not one of Godric's six; the
    Bargain, kept or told, and the gate shut to the hunters change nothing at the hide.
47. **Names:** the three in Thornhold take the elves' tongue (§10); Cuthred the Crown's English, as
    the lodge's hunters do.
48. **Each has a `seek` line of their own.** Thornhold names its people by a comma, not by their
    trade, and I3's map is The Deepthorn, so the system's line would not read true.
49. **Their words:** three lines at the first meeting and no `says`. No one else's words change; the
    hide's unburnt wood stays true, since Cuthred lights no fire.
50. **The walk** checks each trainer's place and presence, sends a ranger, a cleric and a druid at
    11 and teaches them, holds Cuthred to the road's and the groups' rule, finds him on foot and
    teaches the Deadeye at 19 with the hunters' gate shut.

Fitted on 29 September to Act II, filed as Phase 1.2 (#149) the night before: 7 (Sunderwood's plan
cuts the same land), 14 (20 is #156's and #190's), 16 (#163 gives dead wood its character, so the
scaffold learns no paint-over) and 22 (#151's call 11 numbers #26 1.1).

Left for later: a home for the subplots that span areas. The Lost Expedition and The Empty Throne
live in Thornmark's `quests.ts`. #181 goes on with The Lost Expedition in Saltmouth, which would
edit another area's file (EXPANSION §5.8), and Tallis's claim comes in Phase 4 (#177); a home joined
as the chapters are is a systems ask, wanted before #181.

## 10. Names

Thornmark's naming pass, by the rules of `docs/NAMES.md`, named on 29 September 2026 (#211): the
elves' tongue was left to it (NAMES §2). Two things asked for it: the Deepthorn's new places needed
names, and *thorn* ran through six places (Thornmark, Thornhold, the Deepthorn, Deepthorn Lodge,
the Thornwater and Thorn Head), seven with the still lake, which the atlas's comment called
Thornmere, as Harrow ran through the Foreland's (NAMES §3). It leaves four, each pair a place and
the one it lends its name to:

- **The tongue.** The elves' names Cornish in shape, the older British of the far west beside the
  Foreland's English: short parts, spelled as they are said. *Pen* head, *hen* old, *lys* court,
  *coos* wood, *dar* oak, *spern* thorns, *kelli* grove, *lyn* pool, *dowr* water, *rid* ford, *hir*
  long, *du* dark, *gwyn* white. It is NAMES §2's row for Thornmark's elves, with the line that a
  few of the Foreland's oldest people carry names of it. The Tidefolk's tongue, "modelled on one
  real family of coastal names", is still to choose (#152), and takes another family than this.
- **The names:**

  | Was | Now | What it means | Also thought of |
  |---|---|---|---|
  | the oldest elf-hold | Henlys | the old court | Lysdar, the court of oaks |
  | Thorn Head | Penspern | the head of thorns: the Crown's name, in the elves' tongue | Thorn Head, kept |
  | the Thornwater | the Dowrdu | the dark water | the Blackwater, a Foreland name |
  | the still lake, Thornmere in a comment | Lyngwyn | the white pool: mist under the trees, and a marker gone dark in it | Lynhir, the long pool |

  The atlas names the Dowrdu and letters Lyngwyn, and marks Henlys and Penspern as planned sites
  until their boxes are built (#49, #218). Of the game's texts only Sylvane's words for The Dark
  Glass and its journal name one, Henlys (#219); the texts that come with the boxes use them all.
  The event at the lake's shore on the Thornmark map calls it a still lake, which is what the
  company sees.
- **Kept:** Thornmark and Thornhold, which the story leans on; the Deepthorn, the Crown's name for
  the old wood; Deepthorn Lodge, which the Crown's hunters named; the Hoarhills, the Foreland folk's
  grey hills. The people keep theirs: Sylvane.
- **Wenna** is a name of the tongue's shape, a Cornish saint's. With a treaty that says the elves'
  line and Helmstow's were once one, and the line under all of it (DESIGN §9), that is more than
  chance, and nothing says so. It is kept: a thing found, never told.

## 11. What was cut

- **The rim,** H1 and I1: 436 squares, nearly all mountain, and 102 a company could walk. The maps
  of row 2 end in it.
- **The scraps** of Thornmark's land in boxes that are others' or the sea's: Lyngwyn's east
  shore and the Hoarhills' west face in I2 (128 squares, 22 of them walkable) and a strip of Sunder
  Bay's shore by the dead wood in K4 (76, 55 walkable), which go with Sunderwood's boxes (#195,
  #203); and the
  Mewstone (G3 and G4, 170 squares), an isle off the road, which waits for boats (EXPANSION §2.1).
- **The Dowrdu's mouth,** H4: 128 squares, 81 of them dry, in a box of sea, with nothing new to
  do or see (DESIGN §1). H3 carries the river to its south edge, where the world ends; the mouth goes
  with the Mewstone if boats come.
