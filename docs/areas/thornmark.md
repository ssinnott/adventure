# Thornmark: step II of the road, to its edges

Thornmark's doc is three files (EXPANSION §8.2, #1027), and this, its current state, is read first.
Its decisions, the old §9 whole, are `docs/areas/thornmark/decisions.md`, appended to and never
rewritten. Its plan is `docs/areas/thornmark/plan.md`: the old §4 (the boxes' briefs, §4.1 to §4.7)
and §11 (what was cut) whole, then under "Moved from the state" the lines of the old header, §1, §3
and §5 to §8 that this file does not keep, each under the heading it had, among them §3's gear and
its Tests; §6's table of #56's twelve and the changes to their drafts; §8's shares, gear and spells.
§2 and §10 stand here whole. The figures are main's at `8462ffeb` (24 October 2026), as the suites
print them.

Its ids: the area, its zone and its map are `thornmark`, the Deepthorn `deepthorn` and its boxes
`deepthorn_h3`, `deepthorn_i3`, `deepthorn_i4`, `deepthorn_i5`, `deepthorn_j4` and `deepthorn_j5`,
the town `thornhold`, the Grove Roots `grove1` and the Cut Stone `grove2`.

## 1. Where it is

The second step on the road of levels (DESIGN §4, §9): two zones of the atlas
(`src/content/areas/thornmark/atlas.ts`). Thornmark, band 5–10, is its map, H2 on the grid of boxes
32 squares a side (EXPANSION §8.2), Thornhold in its north-east and the Grove in its south-west. The
Deepthorn, band 8–10, is six boxes south of it: H3 under the Grove; I3, I4 and I5 down the wood; J4
and J5, the Hoarhills' end and Penspern. The town and the dungeons stand off the grid, each entered
from a map.

- **North: the rim,** about nine squares deep, behind Thornhold.
- **West: the ridge,** with the Scarth through it into the Foreland; south of the ridge's
  foot, the Wyke.
- **East: the Hoarhills,** with the east road over them from the Thornmark map's east edge into
  Sunderwood, open from the start: the only way between the two, since I3, I4 and J4 hold
  the Eaves' land over the ridge and round its end with their forest drawn closed.
- **South: the sea,** the Wyke and Sunder Bay meeting round Penspern, the Hearth Isle across the
  water to the south-west.
- **The Deepthorn's way in** is the Grove's: the elves' road south out of its hollow through the
  Thornmark map's south edge into H3.

Its one edge open on nothing is H3's south, at 14 to 16, onto H4, a crumb left unbuilt
(`openOnNothing`, `src/content/areas/thornmark/checks.ts`). The rim (H1, I1), the scraps in I2 and
K4 that went with Sunderwood's boxes, the Dowrdu's mouth (H4) and the Mewstone (G3, G4) are cut
(plan, §11). `node tools/worldmap.ts out.png --zones` paints the zones.

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

Ten maps (`src/content/areas/thornmark/maps/`), a row each: its id and name, kind, size and band;
what is there, with its groups (its encounters); and its secret, a door at the squares given, with
the hint that finds it (the map's `secrets`). Eight maps have one.

| Map | Kind, size, band | What is there | Secret, and its hint |
|---|---|---|---|
| `thornmark`, Thornmark | outdoor, 32×32, 5–10 | over the Scarth from the Foreland, past a Warden checkpoint's warning: the ruined watchtower, a landmark seen over the land from far off (a tower at 4,5, #1096), and its ogre's den, the barrow with bone knights and wraiths, the river with one bridge, the dark survey marker in Lyngwyn, the Wardens' buried chest by Thornhold's north wall, the Lanterns' lit marker by the boulders, the Grove at the end of the chisel-marked road, its great tree a landmark over the wood from far off (a tree at 6,29, an oak made a building square for it, #1096); sixteen groups | none |
| `thornhold`, Thornhold | town, 16×16, 5–10 | the Green Man inn, the Lantern Chapterhouse, the Armoury, the Lantern Hall (to tier 4; the Lanterns' hall), the Elder's Yard (training to 11), the Split Oak, a healing spring; Elder Sylvane; Jago, Derwa and Lowen, three first prestiges (§6) | none |
| `grove1`, the Grove Roots | dungeon, 16×16, 6–9 | two halves joined by a locked door, the iron key behind the secret door, the stairs down guarded; nine groups | 5,11, the iron key's: the grit trail heaped against the root-wall at 6,11 (`g1_grit`) |
| `grove2`, the Cut Stone | dungeon, 16×16, 8–10 | three rings of Underdeep corridor; the Hand of Ash and two adepts at the Stone, the Warden of the Cut two cells on, whose death closes the tear; the chisel and the first Meridian journal; eleven groups | 6,13, the second ring: fresh chisel marks on the north wall at 6,14 (`g2_hint`) |
| `deepthorn_h3`, H3, the Deepthorn's edge | outdoor, 32×32, 8–10 | the elves' road out of the Grove's hollow; the light woods along the Wyke; the Dowrdu's ford and the keeper's empty post; the spiders' nest in the brakes, a den; How Did He Know's camp; the keel's groove on the shingle (Hale's Sergeant); seven groups | 28,24, the keeper's roofless house and her Tower Shield +1: young thorns over an old path at 28,23 (`h3_thorns`) |
| `deepthorn_i3`, I3, Deepthorn Lodge | outdoor, 32×32, 8–10 | the lodge on its rise, its yard shut by brambles and its hunters in the cellar (The Hunters' Bargain); the game trail to the saddle's cairn; Cuthred, the Ranger's second prestige; the dire wolves' den under a fallen oak; eight groups | 12,15, the hunters' path to the den's track: the blazed oak at 11,15 (`i3_blaze`) |
| `deepthorn_i4`, I4, Henlys | outdoor, 32×32, 8–10 | the oldest hold, grown into oaks round a yard: the gate-yard's hearth, the spring and the hall, Senara and the treaty (§5), Mawgan; the old groves; the long glade and the first elder's statue, whose riddle Thornhold's gate answers; nine groups | 21,22, the first grove and its Thornmark Bow +2: the rootwalkers all facing the holly at 20,22 (`i4_holly`) |
| `deepthorn_i5`, I5, the wood to the head | outdoor, 32×32, 8–10 | a strip of forest down Penspern's west side; the owls' roost, a den whose brood walks only by night; a camp; Hendar, the Druid's second prestige, once the Stone is mended; five groups | 22,9, the hold's youths' boat and its cask of Lantern Oil: the root with a rope's groove at 21,9 (`i5_groove`) |
| `deepthorn_j4`, J4, the Hoarhills' end | outdoor, 32×32, 8–10 | the long glade on from Henlys; the last crag over Sunder Bay, a lookout; the hermit on the shore (`q_hermit_deepthorn`); the Eaves' forest, closed; the shore path to K4; five groups | 12,18, the carriers' cleft and its War Hammer +2: boot prints on the glade road at 4,16 (`j4_prints`) |
| `deepthorn_j5`, J5, Penspern | outdoor, 32×32, 8–10 | the head's neck and crown: the standing stone (The Older Mark), the fire-stack (The Light on Penspern), the Eldest at the tip, the Deepthorn's boss, the beach where the Hand's boat lands by night; five groups | 1,19, the sea cave and its Great Sword +2: keel marks on the shingle at 1,20 (`j5_keels`) |

Its content is `src/content/areas/thornmark/`: the maps, then a file each for its monsters, items,
chapter, side quests and guild quests, its part of the world (the atlas), its rows of the suites
(the checks) and what other areas take of it (public). Its walkthrough plays the one quest's chain,
the Foreland's chapter and then The Grove Stone, in order and out of it, then the side quests both
ways and the prestiges' trainers. Its businesses' rooms are `src/ui/interiors/thornmark/`.

## 5. The one quest here

**The Grove Stone** (`grove`, `src/content/areas/thornmark/chapter.ts`): Sylvane's charge, the
Stone found cut, the chisel, the tear and the pay, 1,500 gold for the chisel and a warning to keep
it from Vask; then the Deepthorn's step, the treaty in Henlys sealed with the chisel's mark. It is
done on `q_grove_done` with the treaty seen (`deepthorn_i4:i4_treaty`) or shown by Senara
(`q_treaty`), in either order. The tear closes when the Warden of the Cut dies, and the rift hounds
and the riftling elders stop coming back. Seeing the treaty opens **The Empty Throne** (`throne`),
a subplot with no end yet, as the Warden's Meridian journal opens **The Lost Expedition**
(`meridian`), done at Meridian Camp's fire on `meridian_map`; both live in `quests.ts`.

## 6. Side quests

Fourteen in `src/content/areas/thornmark/quests.ts`: The Lost Expedition and The Empty Throne (§5),
then #56's twelve, its 9 to 20, a line each with its level (the plan's §6 has #56's table and the
changes to its drafts):

- **A Coin Not From Caldera** (`coin`, 5): the Split Oak; the deserters' camp off the Warden road.
- **Leave the Trees Standing** (`trees`, 5): the Grove road and Thornhold.
- **The Dark Glass** (`glass`, 6): Lyngwyn and the Chapterhouse, after the Lanterns' Dark Marker.
- **The Elder's Four** (`four`, 6): the Grove Roots and Thornhold.
- **The Ogre's Boy** (`ogre`, 7): the old tower's ogre, who talks before he fights; Thornhold.
- **How Did He Know** (`orders`, 7): the survey team's camp in H3; Idony at the Split Oak.
- **The Hunters' Bargain** (`hunters`, 8): Deepthorn Lodge (I3) and the hunters' path.
- **The Older Mark** (`mark`, 8): the rubbing at Penspern's stone (J5), for Senara in Henlys (I4);
  kept, it is read at Anvilhall (the Kilns).
- **Terms From the Brigands** (`terms`, 9): a brigands' camp off the Warden road; Thornhold.
- **The Mender** (`mender`, 9): the Grove road, the Grove and the Cut Stone.
- **The Light on Penspern** (`light`, 10): Kea and the fire-stack on Penspern's crown, by night.
- **Hale's Sergeant** (`sergeant`, 10): Wystan at Thornhold's gate once Hale is gone (Act II); the
  boat gone west from H3's shingle.

The guilds' (`src/content/areas/thornmark/guilds.ts`): the Wardens' The Old Watchtower (the tower's
ogre; 150 gold, 900 xp) and The Garrison's Strongbox (by Thornhold's north wall; 200 gold, 1,500
xp); the Lanterns' The Dark Marker (the marker in Lyngwyn; 150 gold, 900 xp) and The Second Marker
(the lit one by the boulders; 200 gold, 1,500 xp). Five prestiges are taught here (#19): in
Thornhold Jago the fletcher (the Ranger's first), Derwa the bone-setter (the Cleric's) and Lowen at
her hives (the Druid's); Cuthred in I3 (the Ranger's second); Hendar in I5 (the Druid's second).
The Druid's third, Ashfall's, is lifted in the Grove: a seedling oak at 3,27 once the Archdruid has
asked (`q_seedling`).

## 7. Encounters, and what is new

Eighteen monsters in its file (MONSTERS §5.3 and §5.4): Thornmark's thirteen (dire wolves, thorn
spiders, brigands and their archers, Ashen zealots and adepts, rift hounds, bone knights, wraiths,
riftling elders and ogres, with two bosses, the Hand of Ash and the Warden of the Cut) and the
Deepthorn's old wood (the bramble, the great owl, the rootwalker, the heartwood and the Eldest, its
boss). The old wood's groups stop coming back once the tear is closed (`until`); the Eldest stands
at the head whatever is done first. Three dens: the thorn spiders' nest in H3, the dire wolves' den
in I3 and the owls' roost in I5. What it claims for the novelty check (`novel`, in its index): the
ogre and the wraith; a group's words on its death and its choice (`slainText`, `choice`); the hold,
the tower, the barrow and the grove.

## 8. The numbers

- **The curve** (`tools/tests/curve.ts`): a clear gives 16,765 xp a member of the 13,667 it asks
  and 9,355 gold of 8,400; a company entering at the floor and clearing three quarters leaves at
  10.2, the next floor 10.
- **The gate** (`tools/tests/gate.ts`): at its maps' floors the area wins 98.2% of its 75 groups'
  fights (`GATE.through`'s aim); two under (a town's or dungeon's, the area's 5), 63.2%, off
  `GATE.back`'s aim and inside its limit. The Thornmark map wins 100% at 5 and 26.1% at 3. The
  bosses at their floors and two above: the Hand of Ash 54% and 100%, the Warden of the Cut 72%
  and 100%, the Eldest 47% and 100%, the three set again for the class changes (#1117).
- **Fights to a rest** (aim 5.5 to 7.5, limit 4 to 10): the Thornmark map 6.32, the Grove Roots
  6.26, the Cut Stone 7.03, H3 8.49, I3 8.27, I4 8.38, I5 8.35, J4 8.36 and J5 7.35. H3, I3, I4,
  I5 and J4 are off their aim, and so are J5's floor (89.4% won), the Warden's 72% and the two
  unders, the map's and the area's: the gate's nine.
- **Density** (`tools/tests/density.ts`): within 8 squares in the core, the Thornmark map 97.7%, I4
  98.9% and J5 100%; within 12 in the country, H3 100%, I3 99.4%, I5 100% and J4 98.6% (its
  furthest square 16 of 20); within 7, the town and the dungeons 99.1% to 100%.
- **The ladder:** rungs 8, 9 and 10 are Thornmark's (`gear`, in its checks): by 8 the Armoury's
  tier, by 9 its chests' gear with a plus, by 10 the Deepthorn's +2s, the Tower Shield +1 and the
  Eldest's Bough, a find for every class, each inside the window of 1,200 gold. Its ranged rungs
  (`ranged`, #1115): the Thornmark Short Bow and the Deerskin Sling, a step and two behind the
  Thornmark Bow, sold beside it in the Armoury and found with its plus beside the bow's +1 in the
  Grove Roots and its +2 in I4. They are on the gate's ladder since #1117.

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

## Open and owed

- **Owed to no check:** its checks have no `owes`, and the curve, the gate, density and the ladder
  hold Thornmark with nothing owed.
- **Watched, not moved:** H3's 8.06, J4's 7.58 and I4's 7.55 fights to a rest sit past the aim and
  inside the limit, and the two under's 60.6% comes of #209's pooling (plan, §8). What the owner
  finds by hand goes here; none yet.
- **Cut:** the rim, the scraps and the Dowrdu's mouth (plan, §11).
- **What is next:** nothing. The plan's briefs are all built, and a new box starts its brief there.
