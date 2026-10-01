# Sunderwood: step V of the road, the wood the rift split

The fifth step of the road of levels (DESIGN §9, EXPANSION §2.2), band 14–16, and the last of Act
II: the old wood east of Thornmark down the east road, split in half by the Sunder, the oldest and
biggest Rift in the world, with the Eaves west of the gorge and Lanternwood east of it, joined by
the rope bridge. At the Sunder's floor stands a wall too smooth to be stone, and across the gorge
is Lantern Watch, where the Tide Ship's papers are read, Vask comes to the watchtower, and the act
turns. This is its area doc (EXPANSION §4, §6 and §8.2). Its work is filed under #155 (Phase 1.2,
#149): the boxes as §4's table has them, the Sunder (#199), Lantern Watch (#201), its chapter
(#204), its side quests (#205), its drawings (#206) and its rooms (#207). Figures are measured on
main at `2cc52cd` (29 September 2026) with `worldGrid` (`src/game/atlas.ts`).

Six maps are built: I2, the Eaves' way in (#195), which lists the area, J2, the Eaves (#196), K2,
Sunderfall (#197), K3, the Sunder's mouth (#198), with its Rift, L2, Lanternwood (#200), and Lantern
Watch, the town behind L2's gate (#201). Its content is
`src/content/areas/sunderwood/` (maps, monsters, items, its chapter of the one quest, The Wall, in
`chapter.ts` (#204), its side quests in `quests.ts`, climate and its part of the world map) and its
businesses' rooms `src/ui/interiors/sunderwood/`. Its ids: the area `sunderwood`, its zones `eaves`
and `lanternwood`, the town `lantern_watch` and the Sunder `the_sunder`.

---

## 1. Where it is

The atlas makes Sunderwood two zones:

| Zone | Band | Squares | Built |
|---|---|---|---|
| The Eaves | 14–16 | 6,717 | I2, the Eaves' way in, laid at 264,30 (#195); J2, the Eaves, at 296,30 (#196); K2, Sunderfall, at 328,30 (#197); K3, the Sunder's mouth, at 328,62 (#198) |
| Lanternwood | 15–16 | 5,926 | L2, Lanternwood, laid at 360,30 (#200) |
| The area | 14–16 | 12,643 | five boxes |

Squares are the land the zone check counts in each zone with K2 and K3 laid in the Eaves (#197,
#198) and L2 in Lanternwood (#200). K2 moved the zone line east and L2 moved it back west. K3 takes
its own 265 squares that were not the Eaves' (152 of the Deepthorn's and 113 of Lanternwood's), and
Lanternwood's line is held at K3's east and south edges by seeds (`atlas.ts`), since a laid map seeds
the zones' walk from every square of it: without them the Eaves would run on into L3, L4 and K4. The
walk still moves 252 more of the Deepthorn's into the Eaves in J3 and K4 (5,955 to 5,551), both boxes
Sunderwood's on the grid, and 4 of Lanternwood's; the Iron Fells stand at 3,052 against 3,045.
Holding the Deepthorn's line would need seeds in Thornmark's rows (§9). The plan gave the Eaves 5,764 and Lanternwood 7,971, shallows and rivers
included, 13,735 in all. Without the shallows the area is 13,387 squares, about 13.1 zone maps (EXPANSION §1 has 13.1), and 11,383 of them a
company could walk: the rest is the rim's mountain along its north, the mountains at its
south-east and the chasm of the Sunder itself. It runs from x 267 to x 422 and from the rim down
to y 131 on Sunder Bay. The bands are this doc's, written on the atlas's rows: the area is 14–16
and the boxes rise through it (§4).

**The grid** (EXPANSION §8.2; docs/areas/shelf.md §1). Sunderwood is the I to M columns from row 1
to row 4, with a corner of L5. The land worth a map is ten boxes: I2, J2, K2 and L2 along the east
road; K3, the Sunder's mouth, and J3 under the Eaves; M2, the road on to the Iron Fells; L3, L4 and
K4, Lanternwood's depths. The rim's row (I1 to M1) and the mountain edges (M3, M4, L5) are cut
(§11), and three boxes of the Eaves' land, I3, I4 and J4, are the Deepthorn's, built whole by
Thornmark (docs/areas/thornmark.md §4 and §9, 7).

Its edges:

- **North: the rim,** about nine squares deep along the whole area, with pine under it in L1 and
  K1 and the springs of both rivers.
- **West: the Hoarhills,** the ridge between Thornmark and Sunderwood, 58 squares of border with
  the Thornmark zone and 103 with the Deepthorn. The east road comes over them from the Thornmark
  map's east edge at 263.5,40.5 (`src/content/atlas.ts:372`), open from the start (EXPANSION §2.2),
  which #195 opens as #47 opened the Foreland's west and #49 opens Thornmark's south. It is the only
  way between the two areas: the Deepthorn's boxes I3, I4 and J4 hold the Eaves' land over the ridge
  and round its end, and open no way into the Eaves' boxes; their forest is drawn closed so that the
  Eaves' own look is kept for here (docs/areas/thornmark.md §9, 7).
- **South: Sunder Bay,** and the Deepthorn's shore running on into the dead wood at K4 (15
  squares of border); Penspern across the water.
- **East: the Iron Fells,** the Kilns' first zone (16–18, Act III), 84 squares of border, with the
  east road running on into them at 404,70 (`src/content/atlas.ts:377`), open from the start: the
  world's end there until Act III's first box; and south of the Fells, Kilnmouth (69 squares) over
  the mountains, with no way through.

The Sunder runs north to south through K1, K2, K3 and K4: a gorge of chasm with dead wood and
crystal along both lips, 272 squares of chasm in all, that the east road crosses by the rope bridge
at 330–346,56 in K2 and that opens to the way down at 338,70 in K3. Two rivers: one from the rim
at 360,10 down to Sunderfall at 340,60, where it goes over the lip into the gorge; one from the rim
at 398,24 south through Lanternwood to Sunder Bay at 364,122. The east road runs I2, J2, K2 (the
bridge), L2 (Lantern Watch at 372,46) and M2 into the Fells.

`node tools/worldmap.ts out.png --zones` paints it.

## 2. What it is for

The end of Act II (DESIGN §9): what a Stone's failure looks like at full size. The Sunder is the
oldest and biggest Rift in the world, a wood torn in half, the trees along its edges gone to glass,
and the beasts along it are changed by it, glass growing through their fur (MONSTERS §6.3). At its
floor, under the soil and the rock, stands a wall, flat and seamless and warm to the hand, with
nothing living near it: the silence at the bottom is the monsters' part in the act's turn. Across
the gorge the Lanterns keep a watchtower, and there they read the smugglers' papers for the company:
every cargo went below under the Helmstow customs seal, countersigned by the Regent. Vask rides up
the next morning with two Wardens and no fear at all, tells the company the world is a cage and the
Hearth its lock, and asks for its help; it says no. *Then stay out of my way. I don't need you. I
have the girl.* (STORY, Act Two.) The Lanterns begin to split here (DESIGN §8), and when the
company goes home Helmstow has changed (#157).

The Warden of the Sunder is the first on the road whose death closes nothing: its Stone is long
gone, and some damage stays done (MONSTERS §6.3). The weather is the wood's: rain in the gorge you
cannot see the bottom of, mist under the pines, and by night the moths to any light.

## 3. What is built

Its atlas rows (`src/content/areas/sunderwood/atlas.ts`, #194): the zones with their bands (the
Eaves 14–15, Lanternwood 15–16), the town at 14–16, the Sunder at 15–16 and the sites, the area's
own since I2 listed it, the steading's since J2 (#196). Its maps:

- **The Eaves' way in** (I2, `eaves_i2`, country, band 14–15; #195): the east road out of
  Thornmark's east edge through a gap in its ring, over the Hoarhills' shoulder and east under the
  pines to the box's far edge, where it runs on for J2. The rim closes the north, Lyngwyn fills the
  south-west and a crest along the south shuts the box from the Deepthorn's I3. A shrine where the
  road enters the wood, a cairn on the shoulder, the woodcutter's camp, the lookout on the crest and
  the milestone face down by the road, with the Watch's last patrol's pack under it. Three groups:
  a pair of pine bears by the way in, lantern moths at the camp by night and a pine bear with a
  glass bear on the road at the far end.
- **The Eaves** (J2, `eaves_j2`, core, band 14–15; #196): the east road on from I2 through the
  pines and south-east for the bridge; the rim closes the north and the gorge's west lip, a strip of
  chasm with glass trees along it, the east. The pine-cutters' steading among the first glass trees,
  Garret the cutter, the two graves and the dog at the north path's foot; the bear's cave under the
  rim at the path's end, with the gleaner's sack in it behind the rock; the hermit under the rim by
  the lip, a shrine by the road, a camp and a cairn in the pines south of it, and the rim, the step.
  Four groups: pine bears by the way in and at the cave, lantern moths by the steading by night and
  sunder hounds on the lip by the road at the far end.
- **Sunderfall** (K2, `eaves_k2`, core, band 15; #197): the gorge down the box's west, from J2's lip
  to the atlas's line, with glass trees along both lips; the east road over it by the rope bridge,
  through the river by a ford and on east through the pines for Lantern Watch. The river from the rim
  is dammed where it leaves the pines, and Sunderfall, where it goes over the east lip, has gone
  quiet. The shrine at the fall and Orm its keeper, the rocks under the fall and the ledge behind
  them, the camp on the west lip, the lookout down the gorge, the sawn glass, a cairn in the pines and
  a Lantern's stone by the road. Three groups: sunder hounds with a glass spider at the bridge's far
  end, gleaners with a hound at the dam and two glass bears on the road at the far end.
- **The Sunder's mouth** (K3, `eaves_k3`, core, band 15–16; #198): the gorge on south from K2, both
  lips dead wood, the glass grown thick to the south-east; the ledges cut into the east face, a
  square wide, down from the east lip to the first landing, where the door stands shut in the rock
  at 338,70, and on to a lower landing where they stop; the river's old bed on the east lip, the
  camp back from it and the glass's light to the south; on the west lip the lookout, a cut rope, the
  Lanterns' shrine and a cairn; and in a clearing in the crystal a black-glass Rift (`k3_rift`) that
  stays open. Two groups: gleaners with sunder hounds on the first landing and two glass bears at
  the far end; sunderlings and glass spiders in the Rift.
- **Lanternwood** (L2, `lanternwood_l2`, core, band 15–16; #200): the east road on from the bridge
  through the old forest and out at the box's south-east corner by the river for M2, with a spur
  north to the tower's gate, the way into Lantern Watch (#201). Two wayside lamps
  on the road, one lit and one dark, and a young sister of the Watch by the dark one; the knoll in
  the north-west with the signal fire's ash and the pit under it; a shrine in the tower's yard, a
  cairn in the wood north-east of it and a camp south of the road. Four groups: moths with a
  deathshead at the lit lamp by night, sunder hounds on the knoll's path, two deathsheads at the
  tower by night and two glass bears on the road by the river.
- **Lantern Watch** (`lantern_watch`, town, band 14–16; #201): one tower in a walled yard over the
  gorge, through L2's gate. The Lamp Gallery at the top trains to 17; the prior's room, where the
  Reader of the Watch sits; the stores, the band's step on the ladder; the refectory; and the
  Lanterns' hall at the tower's foot, which sells to tier 6. Prior Osric in the yard under the lamp,
  Wouter Brink of the Cartographers on the west wall. No temple: Sunderfall's shrine cures.
- **Weather.** Colder than the Foreland and milder than the pass, wetter than both: rain in the
  gorge and mist under the pines. Fronts reach it eight hours after they cross the Foreland.

The atlas has the area's zones, the town and the dungeon as planned plates, its sites (Lantern
Watch, the Sunder, Sunderfall) and its links: the east road in and on, the rope bridge, the Sunder's
and the Watch's ways in. Its systems are #150's, dead
wood, crystal and the chasm (#163) its own; the coach east from Saltmouth (#164) is how the act
stays a road between Wrackholm and here. Its monsters are drawn in #206 and its rooms in #207.

## 4. What is still to build

All of it: 13,387 squares of land, 11,383 of them walkable. On the grid (§1) the plan is ten boxes,
a dungeon and a town, and the boxes hold 9,181 of those squares:

| Box | Name | Zone | Kind | Band | Land | What is there | Its step of the quest | Issue |
|---|---|---|---|---|---|---|---|---|
| I2 | The Eaves' way in | the Eaves | country | 14 | 755 (woods 601, hills 60), 28 shallow | the east road out of Thornmark; the gentlest groups, pine bears | none | #195 |
| J2 | The Eaves | the Eaves | core | 14–15 | 1,024 (forest 866, deadwood 139) | pines under the rim; pine bears; the pine-cutters' steading at the glass trees; the road on to the bridge | the Sunder seen | #196 |
| K2 | Sunderfall and the rope bridge | the Eaves, Lanternwood | core | 15 | 968 (forest 368, deadwood 383, crystal 117, chasm 82), 56 shallow | the bridge at 330–346,56; Sunderfall at 340,60 and its shrine; the glass trees | the crossing of the gorge | #197 |
| K3 | The Sunder's mouth | the Eaves, Lanternwood | core | 15–16 | 1,024 (forest 402, deadwood 462, crystal 78, chasm 82) | the way down at 338,70; the gleaners' ledges; sunder hounds | the way down | #198 |
| | The Sunder | | dungeon, two levels of 32×32 | 15–16 | | the ledges down the gorge; the floor and the wall; the Warden above the wall | the wall | #199 |
| L2 | Lantern Watch's box | Lanternwood | core | 15–16 | 1,021 (forest 957, pine 64) | the tower at 372,46; moths by night; the road east | the papers read; Vask comes | #200 |
| | Lantern Watch | | town, 16×16, a tower | 14–16 | | the hall, the refectory, the stores, the prior's room | the midpoint | #201 |
| M2, J3 | The road on, and under the Eaves | Lanternwood, the Eaves | country | 16 | 796 (forest 643) and 1,024 (forest 996) | the road east to the Iron Fells and Act III's border; the forest south of J2 | none | #202 |
| L3, L4, K4 | Lanternwood's depths | Lanternwood, the Eaves | country, behind the road | 16 | 973, 866, 730 | forest, moths and deathsheads, a bear's den; the dead wood at K4's gorge and Sunder Bay's shore | none | #203 |

The core is the four boxes that hold a step of the quest (J2, K2, K3 and L2), built at full
density; the rest is country, built to the looser floor with the wilderness features (EXPANSION
§2.1 (b) and §5.3, #45). The road's country (I2, M2 and J3) is built with the act; the depths are
parked until the owner has played it (#151, call 10). The bands rise from the way in, 14 over the
Hoarhills, to 16 at the Sunder's floor and the Watch, as the gate asks (EXPANSION §5.2), and each
box holds a group at the top of its band for the curve.

**Boxes of two zones.** K2 and K3 are the gorge, half the Eaves' and half Lanternwood's, and K4 is
mostly Lanternwood's with the Eaves' dead wood at its gorge; each is built to its edges. A map is
laid in one zone and all its squares are that zone's, so K2, laid in the Eaves (#197), moves the
zone line to its east edge: Lanternwood begins at L2.

**The order** is the east road's, and the quest's: I2, the only box that meets the Thornmark map,
and the way in; J2, the Eaves and the first step; K2, the bridge; K3 and the Sunder; L2 and the
Watch; then M2 and J3. Building waits on the pilot (#47) and its thresholds, on #163's ground and
on the two-areas rule (EXPANSION §3): Wrackholm first, or Saltreach if the owner lets the isle and
the wood be in flight together. The briefs and the drawings do not wait (#149).

The places, as the atlas and the docs have them:

| Place | Box | What the docs say | On the atlas |
|---|---|---|---|
| The Sunder | K2 and K3, and below | a Rift that split a whole wood; the wall at its floor (DESIGN §9, STORY); the Warden of the Sunder, whose death closes nothing (MONSTERS §6.3); the length of the wall (#56's 32) | a planned dungeon at 320,62, its way in at 338,70; chasm from K1 to K4 |
| The rope bridge | K2 | the east road's crossing of the gorge (DESIGN §9) | a road link at 330–346,56 |
| Sunderfall | K2 | the Paladin's second prestige, a shrine (#19); the dammed fall (#56's 30) | a planned falls at 340,60 |
| Lantern Watch | L2, and its own map | the Lanterns' watchtower across the gorge, where the papers are read and the Lanterns begin to split (DESIGN §8, §9); the prior and the sister (#56's 31); the next spell tier (#151, call 9) | a planned town at 372,36, its way in at 372,46 |
| The pine-cutters' steading | J2 | the family at the glass trees (#56's 29) | a site on J2 at 20.5,7.5 (#196) |
| The Hoarhills | I2, and the Deepthorn's I3 and J4 | the ridge between Thornmark and Sunderwood (docs/areas/thornmark.md) | hills and mountain, lettered |
| The Iron Fells | east of M2 | the Kilns' first zone, Act III | mountain, lettered at 420,70 |

### 4.1 The briefs

As Saltreach's (docs/areas/saltreach.md §4.1): drafts for the owner, each settled in its issue; a
core box held to the Foreland map's density and a country box to about half, with the wilderness
features; the pay shared out over the area (§8).

### 4.2 I2, the Eaves' way in (#195): country, band 14

- **Purpose.** The first box past Thornmark's east edge: woods and hills over the Hoarhills, the
  area's gentlest groups, and the crossing line that tells a level-10 company it is early (#166).
  It opens the Thornmark map's east edge for the east road.
- **Landmarks.** The east road over the Hoarhills' shoulder, out of Thornmark at 263.5,40.5 and down
  into the first woods; the crest along the box's south, with Lyngwyn's east shore grey under it
  (docs/areas/thornmark.md §10); a woodcutter's camp; the milestone, down.
- **Points of interest,** about six features and five groups:
  - a milestone with its face turned to the ground, HELMSTOW 40;
  - the woodcutter's camp, to rest at (#45), and the woodcutter with a rumour of the gorge;
  - a cairn on the ridge's shoulder (#45), a shrine where the road enters the wood (#45);
  - a lookout on the crest, west over Thornmark.
- **Encounters.** Pine bears (two groups, the stronger alone at the box's far end); lantern moths at
  the camp's fire by night.
- **Quests.** None; the chapter's goal points down the road (§5).
- **The secret and its hint.** Under the fallen milestone, a Warden's pack from the tower's last
  patrol, the patrol's orders still in it. The hint is in two parts: the turf under the stone's edge
  cut square, not torn, and the woodcutter's word that it stood in spring.
- **Lines,** drafts for the builder:
  - the milestone: *A milestone on its face in the bracken, HELMSTOW 40 turned to the sky. The
    turf under its edge is cut square, not torn.*
  - the woodcutter: *Stood when I came up in spring. No frost lays a stone that size flat.*
- **New here.** Woods underfoot (#210); the east road; a company told it is early.
- **Finds.** A Warden's Halberd +1 in the pack.
- **Pay.** About 1,150 xp a member.

- **As built** (#195, 1 October): the brief's places, with three groups for its five. The lantern
  moths, eight, stand beside the camp by night, not on it, so the camp stays a rest. The stronger
  group at the far end is a pine bear with a glass bear (MONSTERS §6.3 has the glass bear at the
  Sunder's floor): with one pine bear on the roster, pine bears alone could not be the hardest, and
  the curve asks a group at 15 or more on every map. The first glass in the Eaves comes down the
  road to meet the company. The pack holds a Warden's Halberd +1 (`wardens_halberd`), and the
  milestone reads STOW 40, the end of its line clear of the turf. A company at 14 wins every fight
  and manages 7.3 fights to a rest, inside the aim (8.7 in the ladder's gear, #406, over it; 7.5
  after the re-stat to #409's line, #18, inside it again); the road is walked every time. As
  measured it pays about 1,060 xp a member and 460 gold. Two under, at 12, it wins every fight too:
  past 10 the company's gear stops growing, so a level-14 group cannot turn a level-10 or 12 company
  back, which the gate's limit asks (§8): owed to #18, as every Act II box will owe it until the
  gear past 10 is built. Woods are on the road before it (the Downs' E2, the Deepthorn's H3 and I3),
  so the area claims the bears, the moths and the moths' sleep as new, and not the woods. What the
  owner finds by hand goes here when the box has been played. Since J2 (#196) its east edge is the
  wood on into J2, the rim's mountain kept on its north rows and the road through.

### 4.3 J2, the Eaves (#196): core, band 14–15

- **Purpose.** The Eaves' step of the quest: the Sunder first seen from its west rim, a wood split
  in half and the trees along the edge gone to glass. The pine bears; the pine-cutters' steading.
- **Landmarks.** Pines under the rim, thinning east to dead wood where the ground stops: the rim
  looks over the gorge, which is K2's and K3's; the steading among the glass trees; the road bending
  north-east for the bridge; a bear's cave under the rim at the north path's end.
- **Points of interest,** about nine features and nine groups:
  - the rim, and the event at it: the step (§5);
  - the steading, the family and the child going to glass (#56's 29);
  - the bear's cave, and the gleaner's sack in it;
  - a camp (#45), a cairn (#45), a shrine at the road's bend (#45);
  - a hermit under the rim who has watched the glass spread.
- **Encounters.** Pine bears (three groups, one at the cave); sunder hounds along the rim at the
  gorge; lantern moths by night at the steading's lamp.
- **Quests.** The step. The Family at the Glass Trees (§6).
- **The secret and its hint.** The bear's cave, with a gleaner's sack in it: shards, and a tally
  of where each went. The hint: the cutters' dog sits at the foot of the north path and will not go
  up it, and the cutter's word that it never minded the bear before.
- **Lines:**
  - the rim, the step: *The wood ends in a line, and the ground with it. Across the gap the trees
    stand clear as glass, and the rain goes down further than you can see.*
  - the dog: *The dog sits at the foot of the north path and will go no further. It never minded
    the bear before, the cutter says.*
- **New here.** Dead wood underfoot (#163); the bears, a new family (#240); the Sunder seen.
- **Finds.** A Great Axe +1 in the cave, the ladder's (#399).
- **Pay.** About 1,350 xp a member.

- **As built** (#196, 1 October): the brief's places, with four groups for its nine. The road runs
  south-east as the atlas paints it, not north-east, out of the east edge at 31,23 for the bridge.
  The step's line stands at the lip, a strip of chasm one to three wide down the box's east edge
  north of the road, glass trees along it: the wood ends where the line says, and K2 draws its west
  lip from x 328 to meet it. The cave is behind a door in the rim's rock at the north path's end,
  with a pair of pine bears on the path below it; the dog sits at the path's foot by the cabin, and
  Garret says it never minded the bear up there. The sack holds a tally, SHIP, SHIP, BELOW, and a
  Great Axe +1 (`great_axe+1`, the Watch's ware with a plus, #399) with 250 gold. Garret has lines
  of his own and the hint; Nell, his choice and the lamp are #205's. Five sunder hounds are the
  hardest group, the one a company at 14 manages fewest of between rests (6.2), and six moths stand
  by the steading by night. A company at 14 wins every fight and manages 6.8 fights to a rest,
  inside the aim (6.9 after the re-stat to #409's line, #18); the road is walked every time. As
  measured it pays about 1,510 xp a member and 430 gold, I2 and J2 together 2,570 against their
  2,500. Two under, at 12, it wins every fight: owed to #18, as I2's. The area claims dead wood,
  crystal and the chasm as new, all three first on the road here. What the owner finds by hand goes
  here when the box has been played.

### 4.4 K2, Sunderfall and the rope bridge (#197): core, band 15

- **Purpose.** The crossing of the gorge: the rope bridge the east road crosses the Sunder by,
  Sunderfall where the river goes over the lip, and its shrine, the Paladin's second prestige.
- **Landmarks.** The chasm down the box's middle, glass trees along both lips; the bridge at
  330–346,56, the one crossing, a way and never a lock; Sunderfall at 340,60 on the east lip, where
  the river goes over, with its shrine and its hermit; the dam above the fall; the ledge behind the
  water.
- **Points of interest,** about nine features and eight groups:
  - the bridge, and the event on it: the step (§5);
  - the shrine at Sunderfall, the Paladin's trainer (#19) and the hermit (#56's 30);
  - the dam, and the gleaners' foreman;
  - the ledge behind the fall;
  - a camp on the west lip (#45), a cairn on the east (#45);
  - a lookout over the gorge, and the first sight of the ledges below.
- **Encounters.** Sunder hounds and a glass spider at the bridge's far end (MONSTERS §6.3);
  sunderlings in the glass along the lips; gleaners at the dam.
- **Quests.** The step. The Dammed Fall (§6).
- **The secret and its hint.** A ledge behind the fall's water, with the first gleaner's tally. The
  hint: every rock under the fall is green with its spray but one, bare and worn, where feet go
  through the water.
- **Lines:**
  - the bridge, the step: *Rope and planks over the gorge, swaying. Rain goes down past your boots
    and never lands that you can hear.*
  - the rocks: *Every rock under the fall is green with its spray. One is bare, and worn.*
  - the fall, the dam's doing (§6): *A thread down wet rock, and a quiet where the roar should
    be.*
- **New here.** A bridge over a Rift; crystal and the chasm's edge are J2's first (#196).
- **Finds.** A Holy Symbol of the fall, from the shrine, and a Long Sword +2 on the ledge.
- **Pay.** About 1,350 xp a member.

- **As built** (#197, 1 October): the brief's places, with three groups for its eight, and the
  dam, which #205 puts on the river above the fall. The gorge runs from J2's lip at x 328, seven to
  nine wide north of the road, to the atlas's line south of it, with a strip of dead wood and glass
  on the west lip; the road crosses it on world row 54, straight on from J2, by seven planks of road
  over the chasm, then the river by a ford. The dam is pine trunks across the river where it leaves
  the pines, and the fall below it a thread, as quest 30 finds it: its lines (#205's) are written for
  a fall gone quiet, and the map draws no other. Orm keeps the shrine with lines of his own; his
  ask, Hew and the choice are #205's. The shrine gives personality; the Paladin's trainer there is
  owed to #19. The ledge is behind the bare rock under the fall, with the first gleaner's tally,
  BELOW, a Long Sword +2 (`longsword+2`) and 200 gold. Four sunder hounds and a glass spider were the
  plan at the bridge's far end; three and the spider keep fights to a rest inside the aim. Two glass
  bears on the road at the far end, where Lanternwood begins, are the box's group at 16: a narrow
  band asks a group above its floor, and the bears are a fight of their own, not a level carried by
  others. Since #409's line and #414's re-stat, three bears were past the limit alone (4.3 fights to
  a rest) and two hold it (9.4). A company at 15 wins every fight and manages 7.8 fights to a rest,
  inside the aim; the Eaves' road, I2 to K2, is
  walked every time at 14. As measured it pays about 1,070 xp a member and 510 gold, I2, J2 and K2
  together 3,644 against their 3,850. Its floor is above the area's, so its groups count two under
  in the area's pool, which is owed to #18. The area claims the falls as a landmark, the first built
  on the road. What the owner finds by hand goes here when the box has been played. Since K3 (#198)
  its south edge is the gorge on into K3, both lips through and the rock under the ledge kept, so
  the lookout's path south along the wall is walked.

### 4.5 K3, the Sunder's mouth (#198): core, band 15–16

- **Purpose.** The way down into the Sunder, dead wood and crystal along the gorge, and the Hand
  quarrying the Rift: a sack of glowing shards, and a knife for the next.
- **Landmarks.** Dead wood to the lip; the ledges cut into the gorge's face, the way down, with the
  dungeon's door on the first landing at 338,70; the gleaners' camps along them; the dry bed behind
  the dam; a black-glass Rift at the box's south end, open whatever the company does.
- **Points of interest,** about nine features and nine groups:
  - the ledges, and the door: the step (§5);
  - the gleaners' camps, and the foreman's tally;
  - the dry bed behind the dam;
  - the Rift, open whatever the company does: the Sunder's Stone is long gone;
  - a camp back from the lip (#45), a shrine of the Lanterns' with its lamp out (#45).
- **Encounters.** Gleaners with sunder hounds on a ledge a square wide (MONSTERS §6.3's second
  fight, two groups); sunderlings at the Rift; a glass spider on the threads between the ledges.
- **Quests.** The step. The Dammed Fall's ledges, which stop when the dam is broken (§6).
- **The secret and its hint.** The dry bed behind the dam, where the first shards were quarried,
  and a shard the size of a fist still in the rock. The hint: dead wood stacked across the old
  channel at the bed's mouth, cut ends outward; and K2's fall, gone quiet.
- **Lines:**
  - the ledges, the step: *Ledges cut into the gorge's face, a square wide, switchbacking down
    into rain. On the first landing, a door, and chip marks all round it.*
  - the bed: *Dead wood stacked across the old river bed, cut ends outward. Nobody stacks firewood
    on a riverbed.*
- **New here.** The Hand as quarrymen; a Rift that stays open.
- **Finds.** The fist-sized shard, the first Sunder Shard the company can hold; a Warden's Dirk +1 in the
  gleaners' camps, the ladder's (#399).
- **Pay.** About 1,350 xp a member.

- **As built** (#198, 1 October): the brief's ledges, door and Rift, with two groups on the box and
  two in the Rift for its nine, and a new secret, since K2 took the dam (#197): the river's old bed
  from before the Sunder took the river over the fall, on the east lip. The gorge runs on at x 4–8
  from K2's seam and bends back to the atlas's line below the landings. The ledges are cut stone a
  square wide, chasm to the west and the face to the east, from the east lip at 340,63 down to the
  first landing, where the door stands shut in the face at 338,70, and on to a lower landing where
  they stop, with the gleaners' camp: a Warden's Dirk +1 (`wardens_dirk+1`) and 120 gold. The door is
  a wall until the Sunder (#199) opens it and writes its way back; it sets no flag and holds no lock.
  Two gleaners and two sunder hounds stand on the first landing, MONSTERS §6.3's fight, and bar the
  only way down; two glass bears in the dead wood past the crystal are the box's group at 16. The
  bed's round stones in a gully cut off at the lip, and dead wood stacked across it, cut ends
  outward, are the hint; behind the stack, a Sunder Shard (`sunder_shard`) half cut from the rock and
  200 gold, walled by rock and pines so that no swimmer, climber or levitator reaches it. The camp,
  the light in the glass, the lookout, a cut rope, the Lanterns' shrine (accuracy) and a cairn (170
  gold and a Sapphire Vial) hold the lips. The Rift (`k3_rift`, the spiral in black glass, band
  14–15, seed 2) has four sunderlings by the way in and four glass spiders by the tear, back after a
  day, with no warden and no `until`: nothing closes it. A company at 15 wins every fight and manages
  8.2 fights to a rest on the box, inside the aim; one at 14, 7.7 in the Rift, inside it too. Two
  under, the Rift is won every time, owed to #18 as C5's; the box's floor is above the area's. As
  measured the box pays about 677 xp a member and the Rift 764: 1,441 with 725 gold, about 90 over
  the brief. Density 95.9% within 8 steps, the furthest 10. What the owner finds by hand goes here
  when the box has been played.

### 4.6 The Sunder (#199): dungeon, two levels of 32×32, band 15–16

- **Purpose.** The act's last dungeon and its biggest Rift, hand-built (#151, call 2): the ledges
  down the gorge and the floor, where under the soil and the rock stands the wall.
- **Landmarks.** The upper level: ledges switchbacking down the gorge's face, glass threads strung
  between them and the spiders on them, sunderlings in the black glass. The floor: dead wood and
  crystal in the dark, the river gone into the rock, a glass bear (MONSTERS §6.3 puts it here), the
  Warden of the Sunder in the gorge's narrowest place; past it four squares of nothing (MONSTERS
  §6.3), and the wall: flat and warm, without a join, further both ways than the light.
- **Points of interest,** as a 32×32 dungeon is held: the ledges' landings, the threads, the
  river's fall into the rock, the Warden's narrows, the wall's length, the seam.
- **Encounters.** Glass spiders (three groups), sunderlings (three), a glass bear; the Warden of the
  Sunder, boss, level 16, whose death closes nothing: the Sunder's groups keep coming after.
- **Quests.** The Length of the Wall (§6). The chapter's entry: the wall (§5).
- **The secret and its hint.** A place where the wall's face is not flat, a seam, and something
  scratched beside it that is not the knot. The hint: the surveyor chalked a mark every ten paces
  and stopped where his paper tore, and the chalk on the wall runs out there.
- **Lines:**
  - the wall, the step: *A wall, under everything. Flat, no join, further both ways than the light.
    Warm under the hand.*
  - the chalk: *Chalk on the wall, a mark every ten paces, the surveyor's. Past the last one there
    are none.*
  - the surveyor, at the Watch: *I chalked it every ten paces and took rubbings. At one mark the
    paper tore. I stopped chalking there.*
- **New here.** A Rift that stays open; a wall no one built; the first thing on the road the
  company cannot fight.
- **Finds.** The Warden's heart, a black-glass shard, named; a Plate Mail +2 in a gleaner's cache on
  the ledges, a step past the Watch's stores, which are the ladder's last in the act (§8); a Flail
  +1 and an Ironwood Bow +1 at the Warden's narrows, the ladder's (#399).
- **Pay.** About 2,350 xp a member.

### 4.7 L2, Lantern Watch's box (#200): core, band 15–16

- **Purpose.** Lanternwood's step: the Lanterns' watchtower across the gorge, the wood round it,
  and the moths that come to its lamp by night.
- **Landmarks.** Forest with the road through it to the tower's gate at 372,46, #201's way in; two
  Lantern wayside lamps on the road, one lit, one dark; the old signal fire's knoll, its ash cold; a
  camp.
- **Points of interest,** about nine features and eight groups:
  - the tower's gate;
  - the two wayside lamps;
  - the knoll, and the signal fire's ash;
  - a camp (#45), a cairn (#45), a shrine of the Lanterns' (#45);
  - a lookout on the knoll, west over the gorge to the bridge.
- **Encounters.** Lantern moths by night with a deathshead among them, the back row their first
  choice (MONSTERS §6.3's first fight, two groups; `when`); a glass bear on the road at dusk and
  sunder hounds in the wood, both proposed (§7).
- **Quests.** The step is in the tower (§5); The Watch's Lamp begins on the road (§6).
- **The secret and its hint.** Under the signal fire's ash, a Lantern's letter about the papers,
  written before the company came. The hint is in two parts: the ash raked flatter than ash is owed,
  and the young sister's word that she burnt it.
- **Lines:**
  - the lamps: *A Lantern's wayside lamp, lit, and moths at it thick as snow. Down the road its twin
    stands dark, and nothing comes to it.*
  - the ash: *The signal fire's ash, cold, and raked flat with more care than ash is owed.*
  - the sister: *If the prior asks, I burnt it on the knoll. The fire there draws badly in rain.*
- **New here.** The moths, a new family (#241); a Rift hound gone to glass on the wolf frame.
- **Finds.** A Lantern's Staff +1 under the ash, the ladder's (#399).
- **Pay.** About 1,150 xp a member.

- **As built** (#200, 1 October): the brief's places, with four groups for its eight. The road comes
  in off K2 on world row 52 and leaves at the box's south-east corner, where the river from the rim
  meets it, as the atlas runs it; the atlas carries it on through M2's corner into M3, which is cut,
  so four squares of the edge are owed to #202. The tower's foot is drawn north of the gate, a block
  five wide in a yard of woods, with a spur of road up to the gate at 12,16, barred until #201 made
  it the way in. The lit lamp stands by the road at the way in, with a text by day
  and one by night; the dark lamp down the road, and by it a young sister of the Watch with lines of
  her own and the hint; her quest, 31, and where she moves are #201's and #205's. The knoll is hills
  in the north-west, its path down to the road; the ash on its crown, and north of it, under the
  search, a pit with the letter, from a Reader at Helmstow, written before the company came and naming neither
  the seal nor the Regent, and a chest: the Lantern's Staff +1 (`lanterns_staff`), the monk's and the
  druid's step at 16 (#406), with 250 gold. Nothing walked or waded reaches the pit but through the
  ash. The plan's groups paid 1,370 and gave 9.6 fights to a rest at 15, over the aim: the lamp's
  moths are four with their deathshead, and the tower's are two deathsheads, the box's group at 16,
  the hardest fight on it (5.3 fights to a rest alone). Three hounds hold the knoll's path and two
  glass bears the road by the river. A company at 15 wins every fight and manages 8.2 fights to a
  rest, inside the aim; Lanternwood's road is walked every time. As measured it pays about 1,400 xp a
  member and 430 gold, which takes up what I2, J2 and K2 fell short by: the four boxes pay 5,040
  against their 5,000. Two under, at 13, it wins every fight: its floor is above the area's, so its
  groups count two under in the area's pool, owed to #18. The moths and the bears were new on I2, so
  the box claims nothing new. What the owner finds by hand goes here when the box has been played.

### 4.8 Lantern Watch (#201): town, 16×16, a tower, band 14–16

- **Purpose.** The act's second town: the Lanterns' watchtower where they read the smugglers'
  papers, where the next spell tier is sold (#151, call 9), and where the Lanterns begin to split.
- **Businesses,** each with a room of its own (#207): the Lantern hall (spells to the next tier for
  the fee, and the Lanterns' quests to a member, #257); the refectory (rest and food, #258); the
  stores (the band's gear, a step past Saltmouth's, and lamp oil, #259: a Flail, a Warden's Dirk,
  an Ironwood Bow, a Great Axe, a Watch Staff, Lamellar, a Watch Habit and a Watch Shield, 900
  to 1,600 gold, #399); the prior's room, where
  the papers are read (#260). A trainer to 17 (#159). No temple: the shrine at Sunderfall cures.
- **People.** The prior and the young sister, on their two sides (#56's 31); the Cartographers'
  surveyor (#56's 32); the Lantern who reads the papers and the log, the hand-in that sets the
  midpoint's flag; Vask, the next morning, in the rain at the gate, with two Wardens (§5).
- **Quests.** The chapter's turn (§5); The Watch's Lamp and The Length of the Wall (§6); the
  Lanterns' quests to a member of the guild (#146, DESIGN §8).
- **Lines:**
  - the gate: *Lantern Watch: one tower, and a lamp at the top lit in daylight. Moth dust lies on
    the step like flour.*
  - Vask's morning: *Morning, and rain. Three horses at the gate, two Wardens holding them, and a
    man standing in the wet as if it were not raining.*
- **New here.** A town that is one tower; the act's midpoint.
- **Pay.** About 300 xp a member in the tower's quests.

- **As built** (#201, 1 October): one tower in a walled yard, the yard's wall the map's edge, the
  road up from the gate to the tower's foot, grass and six oaks. The tower is six squares a side
  with its five doors: the Lantern hall at its foot (The Watch's Lantern Hall, the Lanterns' hall,
  spells to tier 6 for a fee of 400), the refectory (rest at 30), the stores (the eight wares of
  #399, lamp oil, elixirs, great spell potions and rations), the prior's room, and the Lamp Gallery
  at the top, the trainer to 17 in a fifth room of its own (`watch_gallery`), since every business
  has one and #207 drew four. Prior Osric stands in the yard under the lamp at every hour, his side
  felt and not told; Hester Dunmore, Reader of the Watch, sits in his room at every hour; Wouter
  Brink, the Cartographers' surveyor, sights the gorge from the west wall. Both speak and set
  nothing: 31 and 32 are #205's. The young sister stays by L2's dark lamp: where she moves is 31's.
  Six events, a sign and a well: the gate, the lamp by night, the lookout, the oil jars stopper out,
  the brothers' graves and the bell tied up. Every square is within five steps of a point. The
  papers are read in the prior's room: once she has met the company, the Reader shuts the door and
  reads what it carries, the Helmstow customs seal on every cargo and the Regent's countersign on
  every page of the papers, and the one name at the foot of the log's entries, Vask, and puts what
  she read back in the company's hands. That sets `papers_read`, the midpoint's flag, which #204's
  chapter will read; what Vask believes is his to say the next morning. The prior, met and shown
  the papers, asks for them for Helmstow's oil cart and takes nothing. The 300 xp of
  the tower's quests waits on 31 and 32, so the area's curve stays owed to #155.

### 4.9 M2 and J3, the road on and under the Eaves (#202): country, band 16

- **Purpose.** M2: where the east road leaves Lanternwood for the Iron Fells at 404,70, Act III's
  border, the Kilns' gentlest groups on the far side and the crossing line facing back. J3: the
  forest south of J2 between the Eaves' rim and the mountains, the bears' country.
- **Landmarks.** M2: the road east into the Fells, and the world's end beyond it until Act III; the
  mountains rising. J3: deep forest, a bear's den, the hermit's clearing.
- **Points of interest,** about five features and five groups each:
  - M2: a milestone (ANVILHALL 12), a camp (#45), a cairn at the border (#45), a shrine (#45);
  - J3: a hermit who has seen the Rift grow, a bear's den (#88), a shrine, a cairn.
- **Encounters.** M2: glass bears (proposed, §7) and a deathshead at the box's far end, the band's
  top. J3: pine bears, the den's brood; moths by night.
- **Quests.** None.
- **The secret and its hint.** J3: a gleaners' cache in the den's back, which the bears have not
  touched; the hint is in two parts: moths at the den's mouth by night, thick as at a lamp where no
  lamp is, and the hermit's word that something goes up to the den on two legs and comes down
  lighter. M2: a Warden's grave by the milestone, with Hale's old patrol badge on it; the hint, the
  milestone's second face, cut by another hand.
- **Lines:**
  - M2's milestone: *ANVILHALL 12 on the face. On the back, cut with a knife, the Wardens' mark and
    two words: THIS FAR.*
  - J3's den, by night: *Moths at the den's mouth after dark, thick as at any lamp. Bears keep no
    lamp.*
  - the hermit: *Bears go up to that den. So does something on two legs, and it comes down
    lighter.*
- **New here.** Act III seen: the Iron Fells' road.
- **Finds.** A Chain Mail +2 in the cache.
- **Pay.** About 800 xp a member each.

### 4.10 L3, L4 and K4, Lanternwood's depths (#203): country, band 16, parked

- **Purpose.** The forest south of the Watch, built once the owner has played the act (#151, call
  10): moths and deathsheads by night, a bear's den, and K4's dead wood at the gorge, where the
  Deepthorn's shore runs on into Sunderwood.
- **Landmarks.** The river south to Sunder Bay; K4's gorge and shore.
- **Encounters.** Lantern moths and deathsheads; bears (proposed, §7); sunderlings at K4's gorge.
- **Pay.** About 450 xp a member each, outside the area's 11,467 (§8).
- Points of interest, the secret and its hint, what is new and the finds are written when #203 is
  unparked (#151, call 10).

## 5. The one quest here

Sunderwood's chapter is The Wall (`chapter.ts`, #204), the last of Act II, joined after
Wrackholm's; every zone holds a step (EXPANSION §5.8): the Eaves' at the rim, the bridge and the
way down, Lanternwood's at the Watch. Its entries:

- **The wood split in half,** seen from the Eaves' rim: the trees along the edge gone to glass, and
  the gorge falling away further than the rain lets you see. The goal points to the bridge.
- **The crossing,** on the rope bridge over the gorge, and the way down from the ledges beyond it.
- **The wall,** at the bottom, under the soil and the rock: flat and seamless, going down further
  than the light reaches, and warm. Nothing more than what the hand feels; the log never says what
  it is (DESIGN §7).
- **The papers read,** at the Watch: every cargo, the shards and the people, went below under the
  Helmstow customs seal, the same seal as on the crates in the caves, and every page is
  countersigned by the Regent. The Tide Ship's log names Vask (DESIGN §9's midpoint, at 16).
- **Vask in the rain,** the next morning at the gate, with two Wardens: *You've read the papers.
  Good. Then you know half of what I know.* He tells the rest; the company says no; *I don't need
  you. I have the girl.* His choice, put by a person (#76), sets a flag and nothing else: the
  endings are the one quest's later (DESIGN §9).
- **Home.** The goal turns back west to Helmstow, where the walls have Wardens on them (#157). The
  chapter's done flag ends the act; its name is #204's.

No lock (#151, call 1): the bridge stands whatever the story does, and the Watch reads the papers
for whoever carries them, whenever they come; a company that takes the Sunder before the Tide Ship
finds the wall all the same.

The walkthrough plays it at 14, 15 and 16, in order and with the Sunder taken first.

## 6. Side quests

#56's four for Sunderwood, all taken by the owner on 28 September 2026 (#151, call 13), each built
with its box on the systems of #76 (#205):

| # | Quest | Level | Where | What it needs | Pay | Built in |
|---|---|---|---|---|---|---|
| 29 | The Family at the Glass Trees | 15 | the steading (J2); the Watch's stores | a choice put by a person; an item from a shop's stock (#98) | 200 | #196, #201 |
| 30 | The Dammed Fall | 15 | Sunderfall's shrine, the dam above it and the foreman (K2); the ledges that stop (K3) | a choice; `until` (#41) | 200 | #197, #198 |
| 31 | The Watch's Lamp | 16 | Lantern Watch (L2) | a choice; a person who moves | 250 | #205 (L2, #200, places the sister and her hint only; #201 leaves her there) |
| 32 | The Length of the Wall | 16 | the surveyor at the Watch; the Sunder's floor | a choice; a once-event at the wall's end that is not there | 250 | #205, #199 (#201 places the surveyor and his lines only) |

Pay is xp a member, whichever way the choice goes, shared by level: 900 between the four (§8).

No change to #56's drafts. 31 opens the Lanterns' split now, with the company on the sister's side,
or leaves the prior his Watch (#21); 32 puts a wall in it.

## 7. Encounters, and what is new

MONSTERS §6.3 has the roster and the fights: the Pine Bear and the Glass Bear, the Lantern Moth and
the Deathshead, the Sunderling, the Glass Spider, the Sunder Hound, the Ashen Gleaner and the
Warden of the Sunder; moths to the lamp, the gleaners' ledge. Their drawings are #206's, nine
issues (#240 to #248). Sunderwood asks one thing of the systems of its own: `when` for the moths
by night, which #41 gave, and MONSTERS' wanted line, moths that come more often to a company
carrying Light, which is proposed with #200.

Proposed, against the roster's Where column: the Glass Bear on Lanternwood's road (L2, M2) and in
its depths, and the Sunder Hound in Lanternwood's wood (L2), where MONSTERS §6.3 has them at the
Sunder only and nothing of Lanternwood's by day. They stand in the briefs as proposals; if the owner
takes them, MONSTERS' Where column says "the Sunder and Lanternwood", in a pull request of its own.
I2 has no wolves: none is on the roster, and Thornmark's are Act I's; its groups are the gentlest
bears.

New in Sunderwood, for the novelty check (EXPANSION §5.4): the moths and the bears, two new
families; dead wood, crystal and the chasm's edge underfoot (#163); a Rift that stays open when its
Warden falls; a bridge over a Rift; a town that is one tower; the machine's wall, seen and never
named. Its landmarks: a falls, a bridge, a tower, a rift.

## 8. The numbers

- **Experience.** The curve (EXPANSION §5.2, #159) asks the climb from 14 to 16 over 0.75: 8,600 /
  0.75, about 11,467 xp a member, with today's `xpForLevel`. The shares of §4 add up to it, as
  Saltreach's and Wrackholm's do, the side quests inside and the depths outside: I2 1,150, J2
  1,350, K2 1,350, K3 1,350, the Sunder 2,350, L2 1,150, the Watch 300, M2 800 and J3 800; and the
  four side quests 900 between them (29 and 30 200 each, 31 and 32 250 each, §6): about 11,500. They were the plan's, 11,800 before the
  side quests, scaled down by one fraction to fit; the box issues' figures are the plan's, and these
  supersede them. The depths add about 1,350 when they are built (450 each). Each box is measured
  when it is built: I2 1,063, J2 1,509, K2 1,072, K3 with its Rift 1,441 and L2 1,396 so far, 6,481
  against their 6,350, about 130 over. A company should leave the Watch at 16, where the midpoint is, with the Kilns'
  floor ahead.
- **Gold.** Training six members from 14 to 16 costs about 6,960 with today's `trainPrice`, and the
  next spell tier its fee (#20); the Watch's stores are the ladder's last step in the act (#399), their dearest ware the Lamellar
  at 1,600 and the act's dearest find the Sunder's Plate Mail +2 at 1,500, against 3,000. The
  stores' full set for the premade six comes to about 10,000.
- **The gate.** Each map at its own floor (docs/areas/thornmark.md §9, 17): a company at 14 wins nine
  in ten on I2 and one at 10 no more than one in four, which is how the east road out of Thornmark
  turns an Act I company back (#40); the Warden of the Sunder is won about half the time at 14 and
  nearly always at 16.
- **Density.** Core boxes at the Foreland's floor, country at the looser one, and the Sunder's
  floor held empty within four squares of the wall (MONSTERS §6.3): the density check's one
  allowed silence, to be declared when the map is built.

## 9. Decisions

Decided by the owner on 28 September 2026 (#151), and followed here:

1. **Act II spends no story lock** (call 1).
2. **The Sunder is hand-built,** a dungeon of two levels of 32×32 (call 2); K3's Rift is #165's.
3. **The Wardens' hall stays open and the guild splits quietly** (call 5): Vask's two Wardens at
   the Watch's gate are his, and the Drillyard's quests go on under the cousin's captains (#157).
4. **Lantern Watch sells the next spell tier** (call 9).
5. **The depths are built after the act is played** (call 10): #203 is parked.
6. **The cuts stand** (call 12): §11, and the Deepthorn's three boxes.
7. **All four side quests stand** (call 13).

Fitted to Thornmark's plan (docs/areas/thornmark.md §9, 7, filed 29 September 2026 under #208): I3,
I4 and J4 are the Deepthorn's, built whole, their Eaves' forest drawn closed and no way opened
between them and the Eaves' boxes; the east road, opened by #195, is the only way from Thornmark
into Sunderwood. #163 gives dead wood its map character, and J4 (#216) paints its 30 squares of it
over as forest all the same, by hand, so that dead wood is first walked in Sunderwood; the
Deepthorn's scaffold learns no paint-over.

Proposed, for the owner, each in the issue that would build it:

- **The briefs** of §4.2 to §4.10.
- **The core** is J2, K2, K3 and L2, the boxes that hold a step; the rest is country (§4).
- **The Sunder's two levels** as §4.6 has them, the ledges above and the floor below, with the
  wall's silence declared to the density check.
- **Lantern Watch's four rooms** (§4.8), and its trainer to 17.
- **Moths that come more often to a company carrying Light** (MONSTERS §6.3's wanted line), a small
  systems ask, filed if #200 wants it.
- **The pay's shares** (§8).
- **The bands on the atlas's rows** (#194): the Eaves 14–15, Lanternwood 15–16, the Sunder 15–16.
  They are set already in `src/content/areas/sunderwood/atlas.ts`, where only the scaffold reads
  them, for a box's draft; the owner's word changes them there.
- **The Glass Bear and the Sunder Hound in Lanternwood** (§7), against MONSTERS §6.3's Where
  column.

Decided by delegate for #194, each the owner's to overturn:

1. **The atlas folder is spread into the plan** (`src/content/atlas.ts` imports it where its rows
   were): the area cannot be listed in AREAS without a map, a chapter and a walkthrough, and the
   registry and `chart()` stay as they are. #195 points the area's `atlas` at it and takes the
   import out.
2. **The folder charts the plan's rows and the bands, and no new sites:** a site's place is its
   box's to settle (#196, #197), and the bridge is a link, which an area's atlas has no room for.
3. **The pay is scaled to 11,467, the side quests inside and the depths outside,** as Saltreach and
   Wrackholm count theirs.
4. **I2's wolves give way to pine bears,** and the Sunder's glass bear goes from the last landing to
   the floor: the roster's.
5. **The depths' brief stays short** until #203 is unparked: it waits on the owner's play.
6. **The hints are things a player sees** (I2's cut turf, K2's bare rock, K3's stacked wood, the
   Sunder's chalk, L2's raked ash, J3's moths at the den): a hint that is only a person's name tells
   a player nothing to look for.

Decided by delegate for #195, each the owner's to overturn:

1. **A pine bear with a glass bear is the far end's stronger group,** against MONSTERS §6.3's
   Where column: the curve asks a group at 15 or more on the map, the roster's one pine bear is 14,
   and a new bear at 15 would want a drawing first. A glass bear alone passed the curve only by
   its level and was the easiest fight on the map; the pair is a real one.
2. **One pair of pine bears by the way in and eight moths by night beside the camp:** a pair and
   eight are the standard encounters the harness measures. A second pair in the south-east woods
   was dropped with the far end's pair in: the box pays about 1,060 xp a member against the
   brief's 1,150, where keeping it paid 1,430, and fights to a rest at 14 sit inside the aim.
3. **Every bear group comes back after two days, the moths after one,** as Thornmark's ogre and
   owls do.
4. **The shrine gives speed,** which no shrine or fountain on the road gave; the cairn 160 gold and
   a Sapphire Vial; the pack 300 gold and a Warden's Halberd +1 of its own.
5. **The gate two under is owed to #18,** for I2 and for the area, with the groups kept at the
   line's standard size: no group size turns back a company whose gear is the same as at 14, and
   bigger groups only push fights to a rest at 14 under its limit.
6. **The climate:** summer 16, winter -2, damp to 0.08, fog 0.6, eight hours behind the Foreland.

Decided by delegate for #196, each the owner's to overturn:

1. **Four groups, not nine:** a pair of pine bears by the way in (the gentlest), a pair at the
   cave on the north path, lantern moths by the steading's lamp by night (beside it and not on it,
   so the steading stays a place to talk) and sunder hounds on the lip by the road at the far end
   (the hardest, at 15, the band's top). Nine groups would pay about 3,000 a member against the
   brief's 1,350. The hounds are five, not the standard four: at four they cost a company less a
   fight than the bears did, and the hardest group has to be a real fight. The moths are six and
   the cave's bears two, so that fights to a rest at 14 sit inside the aim (6.8) and the box pays
   about 1,510, which with I2's 1,060 is 2,570 against the Eaves' 2,500.
2. **The lip is J2's east edge,** a strip of chasm one to three wide north of the road with glass
   trees along it, against the atlas's dead wood beyond: the step's line has to be true where it is
   read, and a ring of mountains or the void would make it false. K2 draws its west lip from x 328
   to meet the strip; south of the road the box stays dry, so the road reaches the bridge.
3. **The road runs south-east, as the atlas paints it:** north-east in the brief was a slip.
4. **Quest 29 stays #205's:** J2 builds its cabin, the two graves under the glass trees and
   Garret, a pine-cutter whose lines of his own carry the secret's hint. Nell, the choice, the
   warding lamp and the flags are #205's to add: #205 is not approved, and names #196 as the
   builder of the cabin and the graves only.
5. **The area claims dead wood, crystal and the chasm as new terrain,** all three first on the road
   in J2: novelty is checked per area, and K2's new things are the bridge and Sunderfall.
6. **The finds:** in the cave a Great Axe +1 and 250 gold, the Great Axe a new two-handed base at
   2d8+1 and 600 gold, so its +1 (750) is a step past Thornmark's Great Sword +2 and inside the
   area's window of 3,000; the cairn 180 gold and a Sapphire Vial, as I2's; the shrine gives might,
   which only the Foreland's D2 gave before.
7. **Bears and hounds come back after two days, moths after one:** the moths are the night's.
8. **I2's east edge opens where J2's west edge meets it:** the mountain wall was the world's end
   while J2 was unbuilt, and kept it would be a range through one wood. J2's column 0 is pine but
   for the road, so no new way opens and I2's figures stand.
9. **J2 is built at core density** (90% within 8 steps, none past 15): it holds the Eaves' step.

Decided by delegate for #399, each the owner's to overturn:

1. **The Watch sells a new weapon line for every class,** a point of blow past Saltmouth's finds,
   and the Sunder and the boxes round it give each with a plus by 16. The Great Axe and the Watch
   Staff are among the wares, so J2's Great Axe +1 and L2's Lantern's Staff +1, already in the
   briefs, are the barbarian's and the monk's and druid's steps.
2. **The stores' Lamellar (10) is the medium wearers' armour step,** and the Watch Shield (5) plate's
   wearers', whose armour step is the Sunder's Plate Mail +2 (11) at 16, a step past the stores.
3. **No robe or Lamellar with a plus at 16:** the casters better their gear with the dirk or the
   flail.
4. **The window stays at 3,000:** the dearest ware is the Lamellar at 1,600.
5. **The Halberd +1, the Long Sword +2 and the Chain Mail +2 stay off the ladder,** finds that sell.
6. **J2's Great Axe is the Watch's ware,** 2d8+4 at 1,200 gold, not the 2d8+1 at 600 that #196 gave
   it: its +1 at 2d8+2 would not better Saltmouth's Long Axe +1, and at 2d8+5 (1,350) the cave's
   find is the barbarian's step at 16, early, inside the window. Saves are fine: the base was never
   sold or placed, so a save holds only `great_axe+1`, which keeps its id and grows stronger; no id
   goes or moves (EXPANSION §5.5), and nobody loses gear or gold.
7. **The Watch's staff is the Watch Staff,** so that L2's Lantern's Staff +1 reads as a named copy
   of it and not as the same thing.

Decided by delegate for #201, each the owner's to overturn:

1. **The trainer has a fifth room, the Lamp Gallery** (`watch_gallery`): the open walk round the
   great lamp at the tower's top, a straw pell lashed to the parapet and staves racked against the
   lamp-house, the gorge below. A trainer is a business, every business has a room of its own, #207
   drew four, and no other town can teach to 17.
2. **The prior's room is a room with a keeper who is out:** its doorway opens on the room, and the
   Reader sits in it at every hour, so nothing the company does or when it comes shuts it.
3. **Prior Osric keeps the yard,** under the lamp, at every hour; his lines keep to the lamp, the
   oil and Helmstow. The letter under L2's ash says why the papers are not read in front of him.
4. **The young sister stays on L2:** a person who moves is 31's, and 31 is #205's.
5. **Wouter Brink, the Cartographers' surveyor,** stands on the west wall with lines of his own and
   no quest; his name is Saltreach's, as his guild is. His ruled line under the ledges is the wall's
   hint, never its name.
6. **The hall's fee is 400,** twice Thornhold's for two tiers more, small beside 1,280 a sixth-tier
   spell; **the refectory is 30,** the inns' climb from 12, 20 and 25.
7. **The stores sell the eight wares, lamp oil, elixirs, great spell potions and rations,**
   Thornhold's four goods: with no temple, the oil's and elixirs' cures matter. Quest 29's warding
   lamp is #205's to add.
8. **The map is one tower in a walled yard,** its wall the map's edge: a town that is one tower.
   The tower is not claimed as a new landmark, since Thornmark's old tower has the icon already.
9. **The gate's two events keep their ids,** and now read open: no id moves.
10. **Two pull requests:** the tower and its businesses first, then the papers read and the
    midpoint's flag, which is the act's turn and is reviewed on its own.
11. **The Reader reads the papers, not the prior,** in his room with the door shut, as the letter
    under L2's ash asks: Hester Dunmore, Reader of the Watch, the Lanterns' third rank.
12. **The midpoint's flag is `papers_read`,** set by her words once the company carries the papers or
    the log, at any hour and with nothing but her introduction done. It is not a hand-in: she reads them and gives
    them back, as Ysolde reads the Meridian journal, so #204 and the company keep them.
13. **The letter changes only how she begins** ("You have been on the knoll, then."): the reading is
    never missed for want of the secret.
14. **The reveal stops at what is written:** the seal, the countersign and the name. She draws no
    conclusion aloud; cages, the sky and the Hand are Vask's to say in the rain (#204).
15. **The prior asks for the papers and takes nothing,** and once they are read says the chair in his
    room was warm: his side is felt, and no flag of the split or choice is spent on it (31 is
    #205's).
16. **The reading follows what is carried:** the papers alone are read for the seal and the
    countersign, the log alone for the name, and both for all three; the drafting agent wrote each.
17. **The introduction comes first:** the Reader and the prior each set a flag on meeting
    (`watch_reader_met`, `watch_prior_met`), and their words about the papers wait on it, so a
    company that comes in carrying them hears who they are before the reading, and "Shut it, if you
    would" sets up the shut door.

## 10. Names

Sunderwood's names are English already, the Crown's and the Lanterns', and stay: the Sunder, the
wood it sundered, the Eaves under the rim, Lanternwood and Lantern Watch, Sunderfall, the Hoarhills,
the Iron Fells. No people of their own live here to name it otherwise: the cutters are Thornmark's
and the Lanterns Helmstow's. A naming pass is the owner's to ask for; none is filed.

## 11. What was cut

- **The rim's row,** I1 to M1: 2,984 squares of land, 1,708 a company could walk, mountain and
  pine under the world's edge, with the springs of both rivers in it. The maps of row 2 end in it.
- **The mountain edges,** M3, M4 and L5: 405 squares, 264 walkable, the mountains between
  Lanternwood and Kilnmouth, with no way through (§1).
- **The Deepthorn's boxes,** I3, I4 and J4: 817 squares of the Eaves' land over the Hoarhills and
  round their end, built whole by Thornmark as its own (docs/areas/thornmark.md §4 and §9, 7), their
  Eaves' forest drawn closed. Not void: the Deepthorn's, and not Sunderwood's to build.

About 3,400 squares void, and 817 another area's.

Decided by delegate for #197, each the owner's to overturn:

1. **K2 is laid whole in the Eaves, band 15:** the chapter makes the bridge the Eaves' step. The zone
   line moves to its east edge (§4). A narrow band asks a group above its floor (the curve's check),
   so the hardest group is at 16.
2. **The gorge runs from J2's lip at x 328,** seven to nine wide north of the road, narrowing south
   of it to the atlas's line, and the bridge carries the road straight on from J2 on world row 54
   rather than bending down to the link's 56. The atlas's link keeps its ends: it is a planned line,
   and moving it is a shared file's change for nothing a player walks.
3. **J2's east ring opens:** its mountain north of the road becomes chasm, so the lip runs unbroken
   to the road, and south of the road pines, so its woods meet K2's west lip.
4. **Three groups, about 1,070 xp a member, all back after two days:** three sunder hounds and a
   glass spider at the bridge's far end (four hounds put fights to a rest at 15 under the aim, 6.1);
   three gleaners and a hound at the dam, #205's "men with grey hands and dogs with glass in them";
   and two glass bears on the road at the far end, where Lanternwood begins, the box's group at 16:
   since #414's re-stat three were past the limit alone and two hold it, a true fight where a mixed
   group would only average to 16. Glass bears there are against MONSTERS §6.3's Where column, as I2's is, and
   stand with §7's proposal. Sunderlings in the glass were dropped: the box paid 1,580 with them,
   and they are K3's (#198).
5. **The dam is K2's,** on the river above the fall, as #205 has it, and the fall below it a thread:
   a line of pine trunks across the river where it leaves the pines, with #205's line. §6 had the dam
   and the foreman in K3, a slip; K3 keeps the ledges that stop. Hew, the choice, the fall's second
   text and Orm's after-lines are #205's.
6. **The shrine gives personality,** the Paladin's spell stat; the Paladin's trainer is owed to #19.
   Orm, #205's name for the keeper, has lines of his own and asks nothing.
7. **The finds:** on the ledge a Long Sword +2 and 200 gold, a one-handed blade beside J2's Great Axe;
   the cairn 180 gold and a Sapphire Vial, as I2's and J2's. The Holy Symbol is dropped: the shrine's
   blessing is the find, and a keepsake that does nothing is clutter.
8. **The map is `eaves_k2`, called Sunderfall,** and its fall is the area's site, built where the river
   meets the lip at 336.5,57.5, not the plan's 340,60. The area claims the falls as a new landmark.
9. **J2's two nits are fixed in the text:** the cabin is fieldstone and turf, as it draws, and the
   cairn is out of sight of the road, not off any path.
10. **The Long Sword +2 stays, under the Watch's stores:** #399 kept it off the ladder, a find that
    sells, as I2's halberd is. Every +1 has its box (#399), and none moves to K2.

Decided by delegate for #198, each the owner's to overturn:

1. **The ledges are cut into the east face,** and the gorge's north half is K2's line carried on,
   at x 4–8 to the landings, then back to the atlas's x 10–12. K2's lookout sees a path to them going
   south along the wall, and the face behind them lets nobody step off the lip onto a lower ledge: a
   ledge is open only to its own way, or to Levitate.
2. **Below the door the ledges go on to a lower landing and stop there in rain.** The rest of the
   way down is the Sunder's upper level (#199).
3. **The door is drawn shut until #199:** a wall in the face at 338,70, with the step's event at the
   ledges' head and the landing plain. It sets no flag and is no entry in `locks.ts`, as C6's gate
   was none before #177. #199 makes the square its way in and writes its exit back to the landing.
4. **The secret is the river's old bed, from before the Sunder took the river over the fall,** where
   the first shards were quarried. The dam and the quiet fall are K2's (#197), so the bed needs
   neither. It lies on the east lip, the river's side: on the west lip, reached only from K2's
   bridgehead, the hint check, which walks a map from its own start, could not find it.
5. **The hint is two things seen:** round stones, the river's kind, in a gully on dry ground that
   ends in air at the lip, and dead wood stacked across the bed, cut ends outward (the brief's line).
   "K2's fall gone quiet" goes: it is the dam's, and hints at nothing here.
6. **The prize is a Sunder Shard and 200 gold,** the shard (`sunder_shard`, slot none, price 0, as
   the Brine Shard) half cut from the rock. The bed is walled by rock and pines,
   so neither a swimmer, a climber nor Levitate reaches it.
7. **Two groups on the box and two in the Rift, about 1,440 xp a member.** On the box, back after two
   days: two gleaners and two sunder hounds on the first landing, MONSTERS §6.3's fight, barring the
   only way down; and two glass bears in the dead wood past the crystal, the group at 16, as on K2, a
   real fight. The bear is the only fit at 16: the deathshead is Lanternwood's by night. The Sunder's
   mouth is nearer the glass bear's Where column than K2 or I2, and stands with §7's proposal. A
   second gleaner group on the lower landing was dropped: the Rift holds its aim only at full size, and
   with both the box paid about 1,840, where at three it was off its aim (9.0 fights to a rest).
8. **The glass spider leaves the threads,** which are the Sunder's upper level (§4.6); K3's spiders
   are in the Rift.
9. **The Rift is the spiral in black glass, band 14–15, in a clearing in the crystal at the box's
   south end,** reached by a lane from the dead wood by the gorge: the crystal reads as its own grown
   glass. Seed 2 puts four sunderlings, its gentlest at 14, by the way in and four glass spiders, its
   all-15 group, by the tear. Smaller groups ran past the limit on fights to a rest (14.9 at three and
   two). Its two-under figure is owed to #18, as C5's Rift's is.
10. **The Rift has no `until` and no warden:** both groups come back after a day and the tear never
    goes quiet. A warden is the one group that never returns, the opposite of open whatever the
    company does, and a heart whose fall closes nothing is the Warden of the Sunder's turn (MONSTERS
    §6.3). The hoard is 150 gold and a Healing Draught, with no shard: the bed holds the box's.
11. **The pay is about 90 over the brief's 1,350,** recorded in §8 and not cut: with L2's (#200), the
    five boxes stand about 130 over their 6,350.
12. **The foreman's tally is dropped,** and quest 30's ledges that stop: the tally is K2's ledge, and
    the foreman and the stopping are #205's, which is not approved. No `until` on the landing's group.
13. **The gleaners' camp on the lower landing holds the Warden's Dirk +1 and 120 gold,** behind the
    landing's group, with a sack of shards that glow in words only.
14. **The camp is on the east lip by the last pines,** the company's rest before the ledges and the
    Rift; the light in the glass to its south points at the Rift without naming it.
15. **The Lanterns' shrine is on the west lip's south end, facing the gorge, its lamp cold, and gives
    accuracy:** no shrine in Act II had, and the lamp was for seeing far. The west lip carries the
    lookout across to the door, a cut rope at the lip and a cairn of 170 gold and a Sapphire Vial, as
    I2's to K2's.
16. **K2's south ring opens to K3's north row square for square:** both lips' dead wood, the chasm,
    the rock under K2's ledge and the pines. K3's west, south and east edges stay ringed, for J3, K4
    and L3 to open.
17. **The map is `eaves_k3`, called The Sunder's Mouth, laid whole in the Eaves,** core, band 15–16,
    so the Eaves reads 14–16. The atlas's link at 338,70 keeps its ends. Its floor is above the
    area's, so its groups count two under in the area's pool, owed to #18.
18. **K3's Rift claims nothing new:** a Rift that stays open is the Sunder's (§4.6), where its
    Warden falls and nothing closes, as §7 has it; K3's open Rift comes before it unclaimed.
19. **The Sunder Shard is a keepsake, the bed's find and nothing more.** No hand-in takes it: the Watch
    reads the Tide Ship's papers and log, not a shard (§5, #201, #204), so a secret's find never holds
    up the act. It follows the Brine Shard, which neither the plinth nor any hand-in takes.
20. **Lanternwood's line is held at K3's edges by seeds,** one a square down its east edge and along
    its south edge east of the gorge, so that L4, L5 and M4 keep their squares and K4 its Lanternwood.
    With L2 laid the Iron Fells keep their line. The Deepthorn's would need seeds in Thornmark's rows,
    another lane's, or a systems change that settles unbuilt land as the plan has it; both are proposed
    to the owner, not made here.

Decided by delegate for #200, each the owner's to overturn:

1. **The rim's pines are drawn as forest, and no pine character is filed.** The atlas's 64 squares of
   pine under the rim have no map character, so the scaffold refuses the box; it is cut by hand with
   pine read as forest, as the Eaves draw theirs. Rimewater's pinewoods can ask for the character.
2. **The tower's foot is drawn small, its gate shut until #201,** as Saltmouth's was on C6 (#176):
   building squares north of the gate in a yard of woods, a spur of road to it, and one event before
   it that says only what is seen. The atlas's site and link at 372,46 stand on it, so nothing moves.
3. **The back row is the moths' reach, and nothing is filed.** The moths and the deathshead are
   `ranged`, so they strike the back row from the first round, and their sleep does the rest. A
   targeting preference would be a systems pull request of its own. The Light ask is not filed:
   groups are placed, not wandering, so "come more often" has no rate to raise.
4. **No dusk:** `when` has none, and the glass bears stand on the road by the river at all hours, as
   §7 proposes them for Lanternwood by day; against MONSTERS §6.3's Where column, as I2's and K2's.
5. **Four groups, measured down from the plan's:** five moths and a deathshead at the lamp, three
   moths and one at the tower, three hounds and two bears paid 1,370 and gave 9.6 fights to a rest at
   15. Four moths and a deathshead at the lamp and two deathsheads at the tower give 8.2, inside the
   aim, with a true fight at 16, and pay about 1,400, taking up the Eaves' 200.
6. **The young sister stands by the dark lamp** with a look, a line of her own and the brief's line
   as half the hint: no flags and no `when`. Quest 31 is #201's and #205's.
7. **The secret is on the knoll, under the ash:** a secret door north of the ash into a pit closed on
   every other side, with the letter as event text only and a chest with the Lantern's Staff +1 and
   250 gold. The letter names neither the seal nor the Regent: those are the tower's to read (§5).
8. **The shrine gives intellect:** the Lanterns read, and sell the next spell tier.
9. **The cairn gives 180 gold and a Sapphire Vial,** as J2's and K2's.
10. **K2's east ring opens to forest where it meets L2,** with the road through, as J2's opened for
    K2. L2's south and east edges are the ring, with the road out at its corner.
11. **Bears and hounds come back after two days, the moths after one.**
12. **The map is `lanternwood_l2`, called Lanternwood:** "Lantern Watch" is #201's map, and two places
    of one name would confuse the log.
13. **The road's corner is owed to #202:** the atlas runs the road out of L2 through M2's corner into
    M3, which is cut; the four squares where map and atlas disagree wait on M2.
