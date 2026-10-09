# Rimewater: step VIII of the road, the lochs under the glacier

The eighth step of the road of levels (DESIGN §9, EXPANSION §2.2), band 20–22, and the third of Act
III, The Deep Script, and its end: two long frozen lochs under the glacier, pinewoods and snow, Rime
Lodge on the shore of the long loch where the cargo comes back up through the ice, and under the
cold loch the sealed bay where every people of Caldera lies asleep in rows. This is its area doc
(EXPANSION §4, §6 and §8.2): where the atlas puts it, what the atlas and the docs put in it, the
plan for building it, box by box, and the briefs. Its work is filed under #438 (Phase 1.3, #431):
the boxes as §4's table has them, Rime Lodge (#487), the Sleepers' Bay (#490), its chapter (#492),
its side quests (#494), its six drawings (#495), Rime Lodge's rooms (#496) and the country behind
the road, parked (#497); this doc is #485. Its systems are #432's, all built: the curve's rows and
the act's gear (#535), ash, ice and pine and a group placed on ice (#536), regeneration, curse and
calls (#537), Kiln-script and Linguist (#538), the crossings with the drove road's coach (#539) and
the bot (#541), which docs/SLICE.md, docs/MONSTERS.md §3 and §4.4 and EXPANSION §5.2 describe.
Figures are measured on main at `6032251` (2 October 2026) with `worldGrid`
(`src/game/atlas.ts`), for land without shallows or rivers; "walkable" is land that is not mountain,
peak, cliff or chasm.

Six places are built: M9, Rime Lodge's box (#486, §4.2), which lists the area; the town behind its
gate, Rime Lodge (#487, §4.3); L9, the long loch's shore (#488, §4.4); K9, Loch Fuar (#489, §4.5),
whose door down to the bay opens for the girl out of the hole; the Sleepers' Bay, two levels under
the ice (#490, §4.6), where Act III's one story lock is signed in (#440, §5); and K10, the high pass
(#491, §4.7), the road's last box and the act's last ground. Its chapter, The Sleepers, is written
(#492, §5), and its five side quests (#494, §6). Its content is `src/content/areas/rimewater/`
(maps, monsters, items, climate, its part of the world map, its walkthrough, its guild quest in
`guilds.ts`, #439, its chapter of the one quest, The Sleepers, in `chapter.ts` and its side quests
in `quests.ts`), and its businesses' rooms are `src/ui/interiors/rimewater/`.
Its ids: the area `rimewater`, its zones `longmere`, `coldmere` and `glacierfoot`, the town
`rime_lodge`, the bay's two levels `sleepers_bay` and `sleepers_bay2` and the reach's `ice_caves`.
The zones are renamed in §10 and keep their ids (NAMES §3).

---

## 1. Where it is

The atlas (`src/content/areas/rimewater/atlas.ts`, the area's own since #486, §3) makes Rimewater
three zones:

| Zone | Band | Squares | Built |
|---|---|---|---|
| Loch Fada (Longmere) | 20–21 | 4,858 | M9, L9 |
| Loch Fuar (Coldmere) | 21–22 | 5,188 | K9, K10 |
| Glacier Foot | the reach: the cap (§9, call 7) | 3,173 | none; cut whole to Phase 1.6 (§11) |
| The area | 20–22 | 13,219 | M9, L9, K9, K10 |

Squares are the land `worldGrid` gives each zone, shallows and rivers left out. The area is about
12.9 zone maps (EXPANSION §1 has 12.9), and 10,021 of its squares a company could walk: the rest is
the rim's mountain along the east and south, the Rimefells' faces on the north and the ridges
between the lochs. On the road, Loch Fada and Loch Fuar together, it is 10,046 squares. It runs from
x 296 to x 487 and from the Rimefells at about y 254 down to the rim at y 381. Rimewater has no
Wardstone (DESIGN §4): its machines are the first shaped like people, and its Stone's work is done
by the bay. The zones' bands are the folder's: the atlas gives the area 20–22 and the boxes rise
through it (§4).

The squares are the plan's, before any box. M9 (#486), laid whole in Loch Fada, and the zones' walk
seeded from every square of it move 1,154 squares, none on a built map: Loch Fada takes 791 of
Glacier Foot's, 176 of the Cairnfield's, 129 of Loch Fuar's and 19 that were void, and about 40
change hands elsewhere on the world. Laid whole, M9 seeded Loch Fada up the Rimefells into most of
M8, so a row of seeds along M8's south edge holds the Cairnfield there (§9, 20); N9's north-west
corner goes to Loch Fada and is left so. With M9 Loch Fada walks to 5,748 squares, Loch Fuar to
5,081 and Glacier Foot to 2,270, the area to 13,099 of land, 10,056 of them walkable, and the
Cairnfield to 3,672. L9 (#488), laid whole in Loch Fada, moves 1,437 squares more by the same walk,
none on a built map: Loch Fada takes 1,327 of Loch Fuar's and 46 of the Cairnfield's, and about 60
change hands elsewhere on the world. Its own squares, 774 Loch Fada's, 239 Loch Fuar's and 11 in
none in the scaffold's cut after M9 (§4 has the plan's 607 and 361), are laid whole in Loch Fada.
K9 (#489), laid whole in Loch Fuar, moves 541 squares more, none on a built map: Loch Fuar takes
272 of Monks' Vale's, 128 of Sheer Point's, 46 of Loch Fada's and 8 of the High Spine's and gives
24 to Monks' Vale and 9 to Loch Fada; about 55 change hands elsewhere on the world. Its own
squares, 518 Loch Fuar's and 216 Loch Fada's in the cut after L9 (§4 has the plan's 734), are laid
whole in Loch Fuar. The bay (#490) is two dungeon maps and lays nothing on the world: the walk is as
K9 left it. K10 (#491), laid whole in Loch Fuar, moves 1,488 squares more, none on a built map: Loch
Fuar takes 940 of Loch Fada's, 506 of Monks' Vale's and 7 of the High Spine's and Loch Fada gives
the Cairnfield 3; about 32 change hands elsewhere on the world. Its own squares, 782 Loch Fuar's and
59 Monks' Vale's in the cut after the bay (§4 has the plan's 782), are laid whole in Loch Fuar.

**The grid** (EXPANSION §8.2; docs/areas/shelf.md §1). Rimewater is the J to O columns from row 9
to row 11, with M9 at its head and slivers in rows 8 and 12. The land worth a map is eleven boxes
on the road: M9, the lodge's box at the long loch's head; L9, its shore and the ridge; K9, the cold
loch; K10, the pass; and behind the road L10, L11, M10, M11 and N9 in Loch Fada and J9 and K11 in
Loch Fuar. Glacier Foot is four more, N10, O9, N11 and O10, cut whole (§11). L12 and I9 are
mountain, and J10, K12, I8, J8 and L8 hold slivers of its land inside the Whitespine's and
Cairnmoor's boxes.

Its edges:

- **North: the Rimefells,** the ridge between Cairnmoor and Rimewater, and over it the Cairnfield
  (18–20). The drove road comes down from Cairnmoor's N8 at 424,250 to 414,262 on M9, the only way
  between the two areas and open from the start (EXPANSION §2.2); it is taken, not walked, since the
  two boxes meet only at a corner across parked M8 (§4.2). The crossing line (#166) falls at the
  Rimefells' foot, but a jump says none (§9, 2).
- **East: the glacier,** coming down from the rim into Glacier Foot, the reach (DESIGN §9), off the
  road and void until Phase 1.6. M9's east edge is the glacier's edge in Loch Fada, where #56's 43
  ends and the guide marks the way into the void (§6; call 7).
- **South: the Whitespine** (22–24, Act IV), over the rim's long southern lobe. The high pass climbs
  out of K10 at its mouth, 333,301, and leaves it by the west edge at 328,305 for Monks' Vale at
  318,318 (the atlas's link runs 334,302 to 318,318), the Whitespine's J11 and Act IV's first box
  (#499): a road through the range (EXPANSION §2.2), open from the start; the pass lands in J11, on
  its 20,1.
- **West: mountain,** I9 and the Whitespine's J column, with no way through.

The lochs run the length of the area: Loch Fada, the long loch, from M9's head west under L9 and on
behind the road, and Loch Fuar, the cold loch, filling K9's middle and K10's north shore, with
ridges between them at x≈372–390 and x≈412–430. Both are water on the atlas and frozen from autumn;
in a box the frozen loch is drawn as ice (#536), walked, and the pike strike through it. The cold
loch's lake lies on the atlas in K10 and L10, at 352–368 by 294–326, and K9 holds only the sea's
shore and the river from that lake to the sea, which K9 freezes and widens into the loch of its
brief (§4.5; §9, #489's 2). The drove road comes down to Rime Lodge's gate at 410,262, then runs
west along the long loch's south shore, over the ridge in L9, round the cold loch's foot through K10
and up to the pass.

`node tools/worldmap.ts out.png --zones` paints it.

## 2. What it is for

The end of Act III (DESIGN §9): *what are the Stones?* Machines, and people came here with them.
Rimewater is the cargo coming home and what follows it (MONSTERS §7.3). At Rime Lodge people come up
through a hole in the ice that the lodge-keepers hold open with fire, blue-lipped, a few a night,
taken below from all over the world; the doors down there opened for some of them and not for
others, the captain's line tested on its victims (DESIGN §9). The company stands the four nights.
On the fourth the machine that counts the cargo comes up after them, and the last one out is a girl
of about fifteen with a nail in her fist and her hair frozen to her face: Wenna of Gullwick, whom
the company has been sent after since F3 (docs/areas/shelf.md §5). She leads it down to the sealed
door under Loch Fuar, which opens for her palm and calls her Captain, and inside are the rows of
long glass beds, every people of Caldera asleep four hundred years (STORY, Act Three). The chapter
ends south, over the pass, after the two hundred she left behind.

It is where the machines first look like people (MONSTERS §7.3): the keepers, tall, grey and gentle,
whose touch puts the company to bed beside the sleepers, and whose walk the monks of the Whitespine
have under their robes. It is Act III's one story lock, the bay's door (EXPANSION §2.3; call 4), the
Lanterns' fourth hall, where tier 7 is sold (DESIGN §7), their skills are taught, Linguist among
them (#538), and their fourth rank opens (call 8), the act's second gear step by 21 (#535) and
training to 23. And it is where the reach is first seen: the glacier at M9's east edge, and a guide
who says the sky came down to the ice and there are stairs in it (#56's 43).

The weather is the lochs': cold and still, snow lying, ice from autumn, clear nights.

## 3. What is built

Six places: one box, the area's first, which lists the area (#486), the town behind its gate (#487),
a second box west along the drove road (#488), a third beyond it, on the cold loch (#489), the
dungeon under the third (#490) and a fourth south of it, the pass (#491):

- **Rime Lodge's box** (M9, `longmere_m9`, core, band 20–21; #486): the drove road taken down from
  Cairnmoor's N8 by the notch onto the long loch's shore, past the coach yard to the lodge's gate,
  which is the way into the town; the lodge's walls and the loch's frozen head before them, with
  the lake wall's door onto the ice and the ice-hole a few squares out from it, its fire and the
  one who waits at its foot, and the road on over the head by a causeway and out west along the
  shore. Pines under the fells; along the east the glacier's edge, old marks cut at its foot, a
  guide frostbitten there by her half-built cairn once she has gone up from the lodge (#494), and
  the one bare face of the ice with a hollow behind it. Seven
  groups: snow lynx in the pines three times, ice pike under the loch's ice twice and ice bears at
  the glacier's edge twice; and an eighth (#487), the tallyman and six knockers on the ice over the
  hole on the fourth night, with Wenna the last one out after them.
- **Rime Lodge** (`rime_lodge`, town, band 20–22; #487): a stockade on the shore behind M9's gate,
  with a lane down its middle: the Lanterns' fourth hall at its head, selling to the seventh tier,
  the healer's house and the furrier's either side of it, the provisioner's, the coach house with
  the coach's landing, the trainers' yard to 23 and, down the lane, the inn, The Thaw, whose stays
  count the nights, with its yard and a door onto the ice (§4.3).
- **The long loch's shore** (L9, `longmere_l9`, country, band 20–21; #488): the drove road walked in
  from M9 and on west under the pines, over the ridge between the lochs by a saddle and out by the
  south edge for K10, where it is taken, not walked, across parked L10's corner (`PASS`, in its
  exits). Loch Fada's ice along the north rows, a woodcutters' camp on its shore and open water in
  its middle; the stream off the fells bending north; a drover wintering in a bothy by the road, who
  hears a bell from under the cold loch; on the ridge a milestone, a cairn and the lookout over both
  lochs. In the high meadow under the ridge's north end, fence posts and a drift, and under it the
  drovers' summer shieling. Four groups: snow lynx in the pines twice, ice pike under the loch's ice
  and an ice bear alone on the ridge's far side.
- **Loch Fuar** (K9, `coldmere_k9`, core, band 20–22; #489): in from L9 over the pines, walked,
  onto the cold loch's shore. The loch's open water along the north and its shallows frozen; its
  arm frozen white down the middle, walked, over the drowned village of Fuar, a bell tower's cap
  standing out of the ice; the old shore's bank on the west, with a house-place above it; a knoll
  east over the ice. At the arm's foot a crack in the ice goes down to a wall of grey with a door in
  it, Act III's one story lock (#490, #440): shut, with its reason on it, to a company that has not
  met the girl out of the hole, who waits at it after the fourth night. Under a clear strip of the
  ice, the drowned smith's hole in the bank, with his iron. Eight groups: snow lynx in the shore's
  pines four times; ice pike under the arm's ice twice, one of them over the tower by night; and ice
  bears in pairs on the far shore and its hills.
- **The Sleepers' Bay** (`sleepers_bay` and `sleepers_bay2`, dungeon, two levels of 16×16, bands
  20–22 and 21–22; #490): down through K9's door. The stair under the ice: a landing still in the
  ice, the door's inside scratched THE BLOOD OPENS THE DOOR at a girl's shoulder, then walls too
  smooth to be stone, lit with no lamp. It parts west by the stair and east by the way the water
  runs, and the two meet at the stair's foot; on the stair a voice in the wall asks its one word.
  Two crews of tallymen and knockers keep the ways, and a keeper waits alone at the foot. Below, the
  bay: forty long glass beds in four rows of ten, frosted over, every people of Caldera asleep in
  them; keepers four to a row, three rows; the Matron alone in the last row; a door at the back with
  Kiln-script over it that opens for nobody; and, behind the last row at the end of the keepers'
  worn path, the locker. Seven groups: the crews twice, the first keeper, the rows three times and
  the Matron.
- **The high pass** (K10, `coldmere_k10`, core, band 20–22; #491): in from L9 by its pass, taken,
  not walked, onto a bridge of split logs over the river out of the lake; in from K9's south row,
  walked. The cold loch's ice runs a tongue into the box's north and the lake lies in its east, its
  shore iced; the road runs west and south through the pines under them, with three new graves by
  it, to the pass's foot: the milestone, then the mouth, where the snow is trodden and the road
  climbs between two walls of mountain and out by the west edge for J11 (#499), where it lands on
  J11's 20,1. In the snow below the mouth the pilgrims from Anvilhall are camped, one of them
  dying; from the pass's first shoulder the first peak of the range is seen. By the road stands a
  Lantern's wayside lamp, dark and its jar full; under its jar-shelf is the Lanterns' cache with the
  lamp's silver and a Guide's Staff +1. Eight groups: snow lynx in the pines three times, ice pike
  under the lake's shore ice twice and ice bears in pairs three times, the box's hardest.

The chapter and the side quests, on the places built (#492, #494):

- **The Sleepers** (`chapter.ts`, #492): begun on M9, down the notch where The Ring ends; the four
  nights at the lodge's inn, the hole's fight and the girl out of it on the fourth, the door under
  Loch Fuar, the beds below it (`sb2_beds`, which sets the chapter's flag) and the pass's mouth on
  K10 (`k10_mouth`), which end it in either order. Its goals stand at Rime Lodge, on M9, K9 and K10
  and in the bay, so Loch Fada and Loch Fuar each hold a step. Back up from the beds the girl out of
  the hole speaks at the door, and then she is at the lodge (§5).
- **The side quests** (`quests.ts`, #494): The Coach That Never Came (the coachman at the lodge,
  the coach on Cairnmoor's N8), The One Who Went Back Down (the man at the hole on M9), The Bell
  Under the Ice (the lodge woman, the tower's cap on K9), Where the Sky Meets Ice (the guide, at the
  lodge and at the glacier's edge on M9) and The Pilgrims in the Pass (below K10's mouth), each
  answered by a choice its person puts (§6).

#487 opens M9's gate and the lake wall's door, which were drawn shut with events for the town to
drop (`m9_gate`, `m9_lake_door`, in no save), and puts the fourth night's group and Wenna on the
ice (§4.2). The shared code it changed is under the issue's systems lane: an inn can count the
nights it keeps a company (`nights` on the inn feature in `src/game/map.ts`, `stayNight` in
`src/game/party.ts`, the inn's screen in `src/ui/screens.ts`); the curve test reads a caller's
retinue at its own level; and the Kilns' first-machines rule is read as far as the Kilns only
(#487's 1, 6 and 17 in §9).

Its atlas rows are charted in `src/content/areas/rimewater/atlas.ts`, the area's own `atlas` since
M9 lists the area; until then `src/content/atlas.ts` spread them into the plan, as Saltreach's were
before #170 (docs/areas/saltreach.md §9): the zones with their bands (Loch Fada 20–21, with M9 and
L9 laid on it, §1; Loch Fuar 21–22, with K9 and K10 laid on it and its crossing words written, #166;
Glacier Foot the reach's), Rime Lodge at 20–22, the Sleepers' Bay's two places, built, with no name
or band of their own (`sleepers_bay` at the door's square, 352,284; `sleepers_bay2` at 352,290, six
below it; #490), the sites (Rime Lodge, its own; the Ice Caves, the reach's, placed and not banded
for this act) and its links: the drove road down from the Cairnfield, the lodge's way in at 410,262,
the pass to Monks' Vale and the Ice Caves' way in.

Its row on the curve and its step on the gear ladder are in (#535). The row is in
`src/content/progression.ts`: band 20–22, next 22, window 4,500, owed to #497, the country behind,
now the area is built (its boxes, chapter and quests), with 7,220 gold the clear's floor, its xp
met: 22,645 a member of the 16,267 asked, the built boxes', the bay's, K10's, the Wardens' ask's and
the side quests' (#439, #490, #491, #494; §8). The step is
in `src/content/areas/rimewater/items.ts`, made ahead of the area as the Kilns' was
(docs/areas/kilns.md §3; `ITEMS_AHEAD`, `src/content/index.ts`) until M9 took the table into its
Area: the furrier's seven (`FURRIER`) and their plus finds by 22 (§4.1), the seven sold by the
lodge's furrier (#487) and each find owed to its box until it is placed; M9 places the Ice Axe +1,
L9 the Skinning Knife +1, K9 the Bear Spear +1 (with a blade of its own beside it off the ladder,
Lann Fuar, §9, #489's 8), the bay the Hunter's Bow +1 and the Plate Mail +4, named in the hill
folk's tongue (§10; #490's 15) and K10 the Guide's Staff +1, the step's last find (#491). The
systems it waited on, #432's, are all built (the opening names them and where each is described);
the drove road's coach is written (docs/areas/kilns.md §3), Rime Lodge's end of it lands (#487) and
the run goes, Kilnhaven's landing written (#469). Its monsters are drawn in #495 and its rooms in #496.

The monsters are drawn (#495), the six of MONSTERS §7.3, ahead of the boxes that place them: the
keepers, the Bay Keeper and the Matron (`src/ui/monsters/keepers.ts`), and the cats, the Snow Lynx
(`src/ui/monsters/cats.ts`), two new frames; and the Ice Pike, the Tallyman and the Ice Bear on the
long bodies', the knockers' and the bears' frames. Their defs are in
`src/content/areas/rimewater/monsters.ts`, the area's own since M9 lists it (`AHEAD`,
`src/content/index.ts`, listed them until then), and each was owed in `UNPLACED`
(`tools/tests/maps.ts`) to the issue that places it: M9 places the pike, the lynx and the bear
(#486) and its hole the tallyman (#487); the bay places the keepers and the Matron (#490), the last
of them, and nothing drawn for Rimewater is owed now. §9 has the decisions.

The rooms are drawn (#496), one to each business of Rime Lodge, ahead of the town as Lantern
Watch's were. `src/content/areas/rimewater/interiors.ts` lists them, and the area's `interiors` has
held the list since M9 lists the area (`ROOMS_AHEAD` in `src/content/index.ts` merged them until
then); each business of the lodge opens into its own (#487), and §4.3 names the ids. They are a
scene to a file in `src/ui/interiors/rimewater/`, what they share in
`lodge.ts`: round logs with moss in the joints, pelts, frost on the glass and the loch through a
window, the keepers' fire out on the ice by the hole. The inn, the great fire with a bear's skull
over it, the lodge's blankets drying on a rail, an ice bear's hide on the boards, the long table
and the yard's door with the ice through its glass; the Lanterns' hall, the spells shelved by tier
up a tall case with the seventh's few new books at the top, an iron stove, the keepers' lanterns on
their pegs with one gone out to the hole and a rubbing off an inscription on the counter; the
temple, a steep gable over a stone with a cup in it, snow in the cup, lights round its foot and the
day let down on it through the smoke hole, the healer's cot, brazier and herbs by; the furrier,
pelts laced in hoops and hung from the beam, the bearskin coat on its stand, the fur robe, the arms
racked and the fleshing beam; the provisioner, fish drying from the rafters, a hand sledge and ice
creepers on the wall and peat heaped for the fire on the ice; the trainer's yard, trodden snow
inside the stockade, a bear of straw and old hide for the spear, fire-baskets for the dark and the
glacier over the stakes. §9 has the decisions.

## 4. What is still to build

All of it but M9, Rime Lodge, L9, K9, the bay and K10, built (#486, §4.2; #487, §4.3; #488, §4.4;
#489, §4.5; #490, §4.6; #491, §4.7): 13,219 squares of land, 10,021 of them walkable, the plan's
figures (§1); on the road, 10,046. On the grid the plan is four boxes on the road, a town and a
dungeon, with seven boxes behind the road parked, and the owner's epic #438 holds this table:

| Box | Name | Zone | Kind | Band | Land | What is there | Its step of the quest | Issue |
|---|---|---|---|---|---|---|---|---|
| M9 | Rime Lodge's box | Loch Fada | core | 20–21 | 761 (mountain 246, pine 173, grass 129, hills 110), 104 shallow | the drove road down from N8; the lodge's gate at 410,262; the long loch's head; the ice-hole; the glacier's edge | the lodge; the nights | #486 |
| | Rime Lodge | | town, 16×16 | 20–22 | | the inn whose stays count the nights; the Lanterns' fourth hall, to tier 7; the furrier; the trainer to 23; the coach's landing; the hole's fight on the fourth night, on M9 | the four nights; Wenna | #487 |
| L9 | The long lake's shore | Loch Fada 607, Loch Fuar 361 | country | 20–21 | 968 (pine 652, mountain 169, grass 87, hills 59), 45 shallow | the road west along the loch; the ridge between the lochs; lynx in the pines | none | #488 |
| K9 | Loch Fuar (Coldmere) | Loch Fuar | core | 20–22 | 734 (grass 417, pine 274, hills 41), 113 shallow | the cold loch; the sealed door under the ice at about 352,284; the bell tower under the ice | the door | #489 |
| | The Sleepers' Bay | | dungeon, two levels of 16×16 | 20–22 (the bay 21–22) | | the stair under the ice; the bay of beds; the keepers; the Matron in the last row | the sleepers | #490 |
| K10 | The high pass | Loch Fuar | core | 20–22 | 782 (pine 770), 65 shallow | the road round the loch's foot and up to the pass at 334,302; the pilgrims | south, over the pass | #491 |
| L10, L11, M10, M11, N9; J9, K11 | The country behind | Loch Fada; Loch Fuar | country, behind the road | 20–22 | 842 (677), 974 (796), 759 (651), 1,015 (646), 851 (735); 885 (797), 632 (568) | pine and the lochs' far shores; the glacier's edge in N9 | none | #497, parked |

The core is the three boxes that hold a step of the quest (M9, K9 and K10), built at full density;
L9 is country, built to the looser floor with the wilderness features (EXPANSION §2.1 (b) and
§5.3, #45). The road's four boxes are built with the act; the seven behind are parked until the
owner has played it (call 10). The bands rise from the way in, 20 at the Rimefells' foot, to 22 at
the pass and the bay's last row, as the gate asks (EXPANSION §5.2), and each box holds a group at
the top of its band for the curve (§7). The four hold 3,245 squares, 2,830 walkable; the seven
behind 5,958, 4,870 walkable.

**One box holds land of two zones.** L9 is Loch Fada's for 607 squares and Loch Fuar's for 361,
the line running down the ridge. A map is its whole box (EXPANSION §8.2), so it is built to its
edges and proposed laid in Loch Fada (§9): Loch Fuar begins at K9 and K10, and the crossing line
(#166) falls at L9's west edge. The boxes behind that hold slivers of Glacier Foot are built whole
as Loch Fada's, the glacier's edge drawn closed in them as M9 draws it (§4.2).

**The order** is the drove road's, and the quest's: M9, the only box that meets Cairnmoor's N8, and
Rime Lodge, where the nights are stood; L9, the shore and the ridge; K9 and the bay; K10 and the
pass. Building waits on #432's systems (§2) and on the two-areas rule (EXPANSION §3), Cairnmoor
first; the briefs and the drawings do not (#431).

The places, as the atlas and the docs have them:

| Place | Box | What the docs say | On the atlas |
|---|---|---|---|
| Rime Lodge | M9, and its own map | the lodge on the long loch's shore where the cargo comes up through the ice; the four nights and Wenna (DESIGN §9, STORY); tier 7 (DESIGN §7); the Lanterns' fourth hall and fourth rank (calls 5 and 8); the coach from Kilnhaven (call 9) | a planned town, its gate at 410,262 and its plate at 412,256 |
| The ice-hole | M9, outside the lodge's lake wall | the hole the lodge-keepers hold open with fire; the tallyman and six knockers on the fourth night (MONSTERS §7.3); the one who went back down at its foot (#56's 41) | not placed; the lodge's |
| Loch Fada (Longmere) | M9, L9, and behind | the long lake and its meadows (MONSTERS §7.3); the ice pike under its ice | water, lettered |
| Loch Fuar (Coldmere) | K9, K10, J9, K11 | the frozen lake with the sealed bay under it (DESIGN §9, MONSTERS §7.3); the bell under the ice (#56's 42) | water, lettered |
| The sealed door | K9, under the ice | opened by Wenna's hand, a soft voice in the wall, "Captain?" (STORY); Act III's lock (call 4) | `sleepers_bay`'s plate at 352,284, the door's square (K9's 24,30), with no name on it: nothing on the surface names it (§10) |
| The Sleepers' Bay | below K9 | rows of long glass beds, every people of Caldera; the keepers and the Matron (MONSTERS §7.3); THE BLOOD OPENS THE DOOR (DESIGN §9) | a dungeon in two places, `sleepers_bay` at 352,284 and `sleepers_bay2` at 352,290, by call 6; no site paints it |
| The high pass | K10 | the road from Coldmere into Monks' Vale, a road through the range (EXPANSION §2.2); the pilgrims and the brother (#56's 44) | a road link at 334,302 to 318,318, "the high pass" |
| The glacier's edge | M9's east, N9 | where the sky meets the ice and the guide marks the way (#56's 43); the reach's way in, in band-20 country (DESIGN §9) | Glacier Foot's border, void |
| The Ice Caves | N11, Glacier Foot | the first of the Vault's dungeons (DESIGN §9, MONSTERS §10.2); the reach's band (call 7) | a planned dungeon at 446,340, its way in at 452,326; Phase 1.6 |

### 4.1 The briefs

As Saltreach's (docs/areas/saltreach.md §4.1): drafts for the owner, each settled in its issue,
written before the act's first box is built, with the act's ladder as #535 set it. Each is what
EXPANSION §8.2 asks of one: purpose, band, landmarks, the secret and its hint, the encounters and
what is new, with points of interest and a first share of the pay.

- **Points of interest** (EXPANSION §5.3). A core box is held to the Foreland map's density: about
  nine features, ten groups and four ways in or out to 870 open squares; a country box to about
  half, with the wilderness features (#45). No more than one point in four is a sign.
- **Encounters** are MONSTERS §7.3's roster and fights (§7), for a company at the box's band, since
  a kill pays by the monster's level against each member's (#159).
- **Pay.** The area owes 16,267 xp a member; the shares below are the plan's (§8).
- **Side quests** are #56's 40 to 44, placed as §6 has them (#494).
- **Finds** are the ladder's next step (#535): the act's second gear step at Rime Lodge's furrier by
  21 (§4.3) and the same with a plus in the boxes by 22: M9's Ice Axe +1, L9's Skinning Knife +1,
  K9's Bear Spear +1, K10's Guide's Staff +1 and the bay's two, a Hunter's Bow +1 and a Plate Mail
  +4, each placed when its box is built and none dearer than the band's window, 4,500. A box may
  give its find a name of its own; the id stays the ladder's.
- **Lines** are drafts for the builder, two lines of the log each (DESIGN §11).

### 4.2 M9, Rime Lodge's box (#486): core, band 20–21

- **Purpose.** The first box below the Rimefells and Act III's last ground: the drove road's end at
  the lodge's gate, the long loch's frozen head with the ice-hole on it, the area's gentlest groups
  and the crossing line that tells a company under the band how the land feels (#166). The glacier
  stands along the east edge, the reach seen and not taken.
- **Landmarks.** The drove road down from N8 at 424,250 to the lodge's gate at 410,262, the way into
  Rime Lodge (#487), with the coach yard outside it (#539); the lodge's walls on the shore and the
  lake wall's door onto the ice; the ice-hole on the loch a few squares out from the wall, a ring of
  black water in the ice with the fire's stones beside it; the long loch's head, drawn as ice
  (#536), the pike under it; the Rimefells' foot along the north; the glacier's edge along the east,
  mountain and void beyond, where the guide of 43 lies.
- **Points of interest,** about nine features and eight groups:
  - the gate, and the coach yard, where the coachman sells the run to Kilnhaven (#539);
  - a milestone where the road comes off the fells: RIME LODGE 1, THE PASS 9;
  - the ice-hole, and the fire kept beside it by a lodge-keeper who is a Lantern (call 5);
  - the foot of the hole, a shelf of ice under the lip, where the one who went back down sits (§6);
  - the guide at the glacier's edge, frostbitten, and the cairn she builds there (§6);
  - a shrine of the Lanterns' by the gate (#45), a cairn on the fells' foot (#45), a camp on the
    shore (#45); a lookout on the hills over the loch, west down its length.
- **Encounters.** Ice pike under the loch's ice, a group placed on ice (#536) between the wall and
  the hole, which strike a company on the ice at one square (MONSTERS §7.3); snow lynx in the pines
  under the fells, the nearest and gentlest; an ice bear at the glacier's edge, the box's hardest
  (MONSTERS §7.3 puts the bears there); and on the fourth night (`night_4`, #487) the ice-hole: a
  tallyman and six knockers up through the hole, the fire at the company's back, the tallyman
  calling more (#537; MONSTERS §7.3's first fight).
- **Quests.** The chapter's steps (§5); The One Who Went Back Down and Where the Sky Meets the Ice
  (§6).
- **The secret and its hint.** A hollow in the glacier's foot where a lodge guide of forty years ago
  made camp and did not come back, her kit and the first of the reach's finds in it. The hint: the
  snow lies on every face of the glacier's foot but one, blue and bare; and the lodge-keepers' word
  that the glacier gives nothing back.
- **Lines:**
  - the hole: *A ring of black water in the ice, and a fire kept beside it. Somebody is coming up.*
  - the glacier: *The ice comes down from the rim in a wall. Snow lies on every face of it but one.*
- **New here.** Ice and lying snow underfoot (#536); a group placed on ice; a call (#537); the cats,
  a new family (#495); the reach seen.
- **Finds.** The lost guide's Ice Axe +1 in the hollow, the ladder's (#535).
- **Pay.** About 1,500 xp a member, the ice-hole's fight inside it.
- **As built** (#486, 8 October): the brief's places, with seven groups for its eight, the hole's
  being #487's (§4.3), laid whole in Loch Fada at band 20–21 (§1, §9). The drove road is taken down
  from N8's notch, 0,28 (424,250),
  onto M9's 22,8 (414,262), facing west: the box's start and no exit, with the way back up the
  square beside it, 23,8 (§9, 1). Snow lies, `*`, in drifts among the pines and on the hills, and
  the loch's head is ice, `i`, from the lake wall to row 20. West from the landing the road passes
  the milestone at 21,8, RIME LODGE 1, THE PASS 9, counted along the roads (§9, 11), and the coach
  yard at 20,7, a trough frozen to the bottom and a mounting block, and comes to the lodge's gate at
  19,8, with the Lanterns' lamp on its post by it at 20,9 (a shrine, personality). The lodge's walls
  stand on the shore, 11 to 18, 6 to 10, building squares as L6's town wall is, grey where the
  brief has logs: the gate, 18,8, and the lake wall's door at 13,10, onto the ice, open into Rime
  Lodge (#487, §4.3; §9, 4). The road runs south down the loch's east
  shore, west over the ice by a causeway at row 16, down the west shore and out by the west edge at
  0,20 (392,274) for L9 (§9, 6). The ice-hole is a ring of black water at 12,14, three squares out
  from the wall, with a fire beside it and a lodge-keeper, a Lantern, feeding it at 14,14, who says
  the glacier gives nothing back; on a shelf of ice under the lip, at 11,14, a man sits with his
  boots over the water (#56's 41). Four ice pike lie under the ice between the wall and the hole,
  13,12, and four beside the causeway, 9,18, where something long and pale turns over. Snow lynx
  wait in the pines in three groups of four: by the landing, 23,10, the nearest and gentlest, under
  the fells to the west, 7,8, and in the south-east, 23,26, with round prints in the snow at 23,22.
  A cairn at the fells' foot, 8,5, holds 320 gold and a great spell-point potion; the shore camp
  stands at 16,19 and the lookout on the hills over the loch, 21,18, looks south down its length.
  East, the glacier comes down from the rim: a strip of ice at its foot, 26 to 28, under a mountain
  wall, 29 to 31, closed against N9 (call 7), and its snout at 27,12. At 27,19 a guide, her hands
  bound in rags, took a party up to where the sky meets the ice and came down; her cairn, half
  built, points east at nothing, 27,20 (#56's 43). Two ice bears keep 27,17 and two 27,28, the
  box's hardest. At 28,24 the ice comes down in a wall with snow on every face of it but one, and
  behind that bare face, through the secret door at 29,24, is the hollow, 30,24: a camp forty years
  cold, a bedroll, a stove and an axe. The lost guide's kit holds her Ice Axe +1 (`ice_axe+1`, the
  ladder's) and 1,200 gold; rock at 30,23 and 30,25 shuts the hollow to a climber over the
  glacier's mountains.
  - **Seams.** North-east, N8's 0,28 (424,250) leads onto M9's 22,8 (414,262) facing west and M9's
    23,8 (415,262) onto N8's 1,28 (425,250) facing east, both jumps; M9's 31,0 (423,254) and N8's
    0,31 (424,253) are mountain, the Rimefells' shoulder, with void past them. The gate, 18,8,
    leads to `rime_lodge` 14,8 facing west and its way back lands on 19,8; the lake wall's door,
    13,10, leads to `rime_lodge` 7,14 facing north and its way back lands on 13,11. Both are
    exported from the map (`GATE`, `LAKE_DOOR`) and listed in its exits since #487 built the town,
    which kept their squares (#487's 9). West, L9 (#488): the stream, water, at 0,2 to 0,4
    against the atlas's at L9's 31,2 to 31,4, and the road out at 0,20 against its 31,20, hills on
    rows 12 to 19 and grass from row 21; L9 puts water at 31,2 to 31,4 and the road at 31,20, which
    the edge check matches. North, M8 (#484, parked): grass and pines at columns 0 to 4, the rest
    the fells, void. East, N9 (parked): mountain the whole edge, void. South, M10 (parked): the
    loch, its shores, the hills, the crag and the pines, the atlas's row with the corner closed.
  - **Measured.** A company at 20 wins every fight and manages 9.55 fights to a rest, inside the
    aim, with 1.7% of its days ending in a fight broken off; it walks Loch Fada's road, the lynx by
    the landing and the pike by the lake wall, every time; each of the seven groups is won ten
    fights in ten. M9 pays about 3,754 xp a member (793 for each of the 12 lynx and 8 pike, 1,667
    for each of the 4 bears) and 1,520 gold. Two under, at 18, it wins every fight too, owed to #18
    as the Kilns' and Cairnmoor's boxes' are. Density 98.0% within 8 steps and the furthest 13,
    with no sign among its 31 points (32 since #487). The curve's rank correlation is 0.25 (0.32
    before the hole's group, #487), the lynx by the landing nearest at 3 steps (level 20) and the
    north bears the hardest at 14 (level 21). It claims the cats and a group on ice as new (§7).

### 4.3 Rime Lodge (#487): town, 16×16, band 20–22

- **Purpose.** The act's last town and the Lanterns' fourth hall (call 5): where the cargo comes up
  through the ice, where the company stands the four nights, where tier 7 is sold (DESIGN §7) and
  the act's gear step is bought (#535), and where Wenna waits after the bay (#76).
- **Businesses,** each with a room of its own (#496), the `interior` its feature names given with
  it:
  - The inn, whose rests count the nights, with the yard's door onto the ice at the hole. Interior:
    `rime_inn`.
  - The Lanterns' hall, selling spells to tier 7 for the hall's fee (DESIGN §7), teaching the
    Lanterns' three skills, Linguist among them (#538), and giving their quests to a member, the
    fourth rank's among them (call 8, #439). Interior: `rime_hall`.
  - A temple, the hill folk's, cures and raising at the band's price. Interior: `rime_temple`.
  - The furrier, the band's gear, a step past the Kilns' (#535: an Ice Axe, a Skinning Knife, a
    Hunter's Bow, a Bear Spear, a Guide's Staff, a Bearskin Coat and a Fur Robe, 1,600 to 2,500
    gold, `FURRIER`). Interior: `rime_furrier`.
  - The provisioner. Interior: `rime_provisioner`.
  - The trainer's yard, to 23 (DESIGN §5). Interior: `rime_yard`.
- **People.** The lodge-keepers, Lanterns who hold the hole open; the arrivals, a few a night, in
  the yard by the fire; Wenna, after the bay (§5); the coachman of the yard (#539), and the one who
  did not come (#56's 40); the stonecutter of Cairnmoor's 39, come down the drove road; the woman of
  42, whose people are under Loch Fuar; the guide of 43, before she goes out to the glacier.
- **The nights.** Four flags, `night_1` to `night_4`, a flag a night, each set by a rest at the inn
  once the one before is set (call 5). Each night's arrivals are a once-event in the yard keyed on
  its flag: a man alone, then three, then a family; on the fourth the tallyman and the knockers out
  onto M9's ice, and Wenna the last one out after them, which sets `q_wenna_up`, the lock's flag
  (§5). A company that rests nowhere else stands the four nights in four rests.
- **Quests.** The chapter's (§5); The Coach That Did Not Come, The Bell Under the Ice and Where the
  Sky Meets the Ice begin here (§6); the Lanterns' quests to a member (§6). The coach from the yard
  to Kilnhaven's (call 9, #539) is a fare, never a favour.
- **Lines:**
  - the gate: *Rime Lodge: log walls on the shore, smoke, and a fire kept out on the ice. The
    keepers carry lanterns.*
  - the first night: *Morning. A man by the fire in a lodge blanket, blue to the lips, who came up
    out of the loch in the night.*
  - Wenna, the fourth: *A girl of fifteen with a nail in her fist and her hair frozen to her face.
    "Are you the ones my mother sent?"*
- **New here.** A town whose inn counts nights; a guild hall that sells the last spell tier; the
  Lanterns' fourth rank.
- **Pay.** About 500 xp a member in the hall's quests and the town's.
- **As built** (#487, 8 October): the brief's six businesses and the four nights, in a stockade on
  the shore with a lane down its middle, all 104 open squares reached from the start. M9's gate is
  open: a company comes in at 14,8 facing west, and the brief's gate line is said as it goes; a
  step on, at 13,8, the stockade is described. The lane runs from the Lanterns' hall at the head of
  the yard (7,3), with the healer's house (1,3) and the furrier's (13,3) either side of it, south to
  the lake wall's door at 7,15; the provisioner's is off the square at 3,6, the trainers' yard at
  11,10 and the inn, The Thaw, at 5,12, with its yard between its door and the lane, 6,12 to 7,13.
  East of the lane stands the coach house, with the coachman at 14,7 and the coach's landing at
  13,7, facing west; a lodge-keeper stands at 9,5, a stonecutter come down the drove road at 2,8
  and a lodge woman at 9,12, lines only and no names (#487's 15).
  The Lodge's Lantern Hall sells to the seventh tier for 500 and teaches a Lantern Linguist, as
  every Lantern hall does, and gives the Lanterns' quests as every hall does (#439, §6). The
  furrier's sells the step's seven (`FURRIER`), the provisioner's Anvilhall's stores' list, the
  healer's house is a temple and the trainers' yard trains to 23. The coachman speaks of the overdue
  coach and sells the run to Kilnhaven's inn yard, whose landing #469 wrote (#487's 10). The houses
  draw in the game's one town style, half-timbered and white, where the brief has logs; the palette
  tints the stockade only.
  The Thaw takes 45 a member and counts the nights: a stay sets the first of `night_1` to `night_4`
  not yet set, so they come in order, and the morning's arrivals stand on the yard square outside
  its door, 6,12, one night's words at a time: a man alone, then three who came up together, then
  a family who say a girl led them to the stair, and on the fourth nobody by the fire and the
  keepers standing back from the hole, which is clicking. That night's fight is M9's, and comes the
  once: the tallyman and six knockers at 12,13, on the ice over the hole, after `night_4`. After it
  a girl with a nail in her fist, who will not go home, stands there and sets `q_wenna_up`. The way
  out by the lake wall's door lands on M9's 13,11, beside the ice pike of `m9_pike_wall` (#486's)
  at 13,12, which strike a company at once as it comes out and are back a day after they are
  killed (§11).
  - **Seams.** M9's gate, 18,8, leads to 14,8 facing west, the town's start; the town's way out,
    15,8, lands on M9's 19,8 facing east. The lake wall's door, M9's 13,10, leads to 7,14 facing
    north; the way out, 7,15, lands on M9's 13,11 facing south, on the ice. Neither arrival on M9
    is an exit (#487's 9). For the chapter (#492) and the quests (#494): the flags `night_1` to
    `night_4` (`NIGHTS`) and `q_wenna_up` (`WENNA_UP`), both exported from `maps/rime_lodge.ts`;
    the events seen `rime_lodge:rl_night_1` to `rl_night_4`, `rl_yard`, `rl_stockade`, `rl_pelts`
    and `rl_coach_house`; the group slain `longmere_m9:m9_night_4`.
  - **Measured.** The town: 100% of its 104 open squares within 7 steps, the furthest 4, no sign
    among its 19 points. The hole's fight is won every time, at 20 and at 18 (owed to #18 with the
    rest): at 20 it is 10.4 fights to a rest, a little over the aim of 8 to 10 and inside the limit
    of 12.5, and at 18 it is 6.5. M9 with it manages 9.55 fights to a rest by the gate (9.6 by the
    harness, the box in a new order each seed), with 7.7% of its days ending in a fight broken off,
    where the seven groups of #486 had 1.7%. The hole pays 449 xp a member and no gold, and the
    town nothing of its own (§8).

### 4.4 L9, the long lake's shore (#488): country, band 20–21

- **Purpose.** The road west from the lodge along Loch Fada's south shore and over the ridge
  between the lochs: pines, the frozen loch's length and the cats' country.
- **Landmarks.** The road from M9 along the shore under the pines, up over the ridge at x≈372–390
  and down to Loch Fuar's foot in K10; the loch's ice along the north rows (45 shallow); the
  ridge's crest with the lookout west over the cold loch; a drovers' shieling under the snow.
- **Points of interest,** about five features and five groups:
  - a milestone on the ridge: RIME LODGE 4, THE PASS 5; the lookout on the crest, both lochs seen;
  - a camp in the pines (#45), a shrine (#45), a cairn on the crest (#45);
  - a drover wintering at the shieling with a rumour of the bell heard through the ice (#56's 42).
- **Encounters.** Snow lynx in the pines, two groups, leaping at the back row (MONSTERS §7.3); ice
  pike under the loch's ice where the road runs by the shore, a group on ice (#536); an ice bear
  alone on the ridge's far side, the box's hardest, proposed against the roster's Where column (§7).
- **Quests.** None of its own; the chapter's goal points down the road (§5).
- **The secret and its hint.** The drovers' summer shieling drifted over, its door under the snow,
  and in it the drove's strongbox, left when the loch rose and the drove stopped. The hint: fence
  posts walk out into the snow in a line where no fence is needed and stop at a drift taller than
  the rest.
- **Lines:**
  - the posts: *Fence posts in a line out into the snow, fencing nothing, and a drift at the end
    of them taller than the rest.*
  - the ridge: *Both lochs from here, white to their far shores. Nothing moves on either.*
- **New here.** Nothing the road has not had by M9; the first box laid over two zones' land in the
  area (§4).
- **Finds.** The drove's strongbox: gold, and a Skinning Knife +1, the ladder's (#535).
- **Pay.** About 1,300 xp a member.
- **As built** (#488, 8 October): the brief's places and its four groups (it says about five), laid
  whole in Loch Fada at band 20–21 (§1, §9, #488's 4). The drove road is walked in from M9 at 31,20
  (391,274), facing west, the box's start; it goes west-south-west in steps under the pines, past
  the drovers' stone at 28,23, a cup cut in its top with coins frozen into the ice in the cup (a
  shrine, luck), the stance at 29,28 and the bothy at 25 and 26,26, where a drover winters at 24,26
  and hears a bell from under the cold loch's ice (#56's 42). It crosses the ridge's south end by a
  saddle at row 27, columns 9 to 17, with the milestone on it at 13,27, RIME LODGE 4, THE PASS 5,
  counted along the roads (§9, #488's 12); it goes out by the south edge at 6,31 and 7,31. From
  there it is taken, not walked: the square at 6,31 is `PASS`, in the exits since K10 (§9, #488's 2;
  #491's 1). From the saddle a path of hills climbs the crest: the lookout at 10,22, both lochs seen
  and nothing moving on either; a cairn at 12,21 holds 300 gold and a great spell-point potion.
  Loch Fada's ice, `i`, runs along the north rows, with a pine islet at 3,1 and a lead of open
  water in its middle, 7 to 12 on rows 0 to 2; the woodcutters' camp stands on its shore at 6,4.
  The stream off the fells comes in at 31,2 to 31,4, bends north under the pines and leaves by the
  north edge at 22 to 27,0, with a frozen ford at 29,1 and 29,2 joining the corner to the box.
  Snow lynx wait in the pines in two groups of five, one by the road at 20,21, the nearest and
  gentlest, the other by the high meadow at 22,12. Four ice pike lie under the ice off the camp at
  5,1, and an ice bear keeps the ridge's far side alone at 5,24, the box's hardest, with its torn
  pine at 6,19. In the high meadow under the ridge's north end fence posts run out into the snow at
  25,8, fencing nothing, to a drift: searched at 24,8 it gives a door, and behind it, in the
  drovers' summer shieling, a 3×3 of building, the drove's strongbox at 23,8 holds 1,100 gold and
  the Skinning Knife +1 (#535).
  - **Seams.** East, M9 (built): L9's 31,0 to 31,31 meets M9's 0,0 to 0,31 square for square, the
    stream at 31,2 to 31,4 against M9's 0,2 to 0,4 and the road at 31,20 (391,274) against its 0,20
    (392,274); the outdoors test pins both ways and the walkthrough walks it, the land not named
    again. West, K9 (#489): L9's 0,0 to 0,31 is ice at rows 0 and 1 and pines below (360,254 to
    360,285), the atlas's pine against K9's 31,0 to 31,31 (359,254 to 359,285); no road crosses,
    and K9 puts dry land on its column 31 at rows 2 to 31. North, L8 (parked): the stream leaves at
    22 to 27,0 (382 to 387,253) where the atlas's goes on, and the world ends. South, L10 (parked):
    the road leaves at 6,31 and 7,31 onto the atlas's at 366,286 and 367,286, pines either side of
    it and the ridge's tail beside them, and the world ends; the atlas's road runs on over about 11
    squares of L10's corner (360 to 369, 286 to 290) to K10's east edge, so L9's 0,31 (360,285) and
    K10's 31,0 (359,286) meet only at a corner. The pass, 6,31 (366,285), is listed in the exits and
    leads to `coldmere_k10` 30,3 (358,289), the bridge, facing west (#491 moved the landing from the
    guess 31,4, §9, #491's 1), and K10's way back, its road's last square 31,3, lands on 7,31,
    facing north; 7,31 stays plain road.
  - **Measured.** A company at 20 wins every fight and manages 9.27 fights to a rest, inside the
    aim, with 0.3% of its days ending in a fight broken off; each of the four groups is won ten
    fights in ten, the lynx at 6.7 fights to a rest each, the pike at 9.5 and the bear at 29.8, the
    box's cheapest fight alone. L9 pays 2,128 xp a member (793 for each of the 10 lynx and 4 pike,
    1,667 for the bear) and 1,400 gold, the strongbox 1,100 and the crest's cairn 300. Two under,
    at 18, it wins every fight too, owed to #18 as M9's is. Density 100.0% within 12 steps (the
    country floor) and the furthest 11, with no sign among its 23 points. The curve's rank
    correlation is 0.26, the lynx by the road nearest at 12 steps (level 20) and the bear the
    hardest at 30 (level 21). It claims nothing as new (§9, #488's 14).

### 4.5 K9, Loch Fuar (#489): core, band 20–22

- **Purpose.** Loch Fuar's step: the cold loch, frozen to the bottom at its edges, the drowned
  village under its ice and, out on the ice at about 352,284, the sealed door that opens for one
  hand in the world (call 4). Coldmere, once (§10).
- **Landmarks.** The loch filling the box's middle (113 shallow), drawn as ice (#536) and walked;
  the shore meadows under snow with the pines behind them; the drowned village's bell tower,
  its cap standing a square out of the ice (#56's 42); the old shore's bank, where the loch rose; the
  door, in a wall of grey under the ice at the loch's deep end, reached down a crack in the ice,
  with nothing on the surface to name it (§10): a thing in plain sight with its reason on it
  (EXPANSION §2.3).
- **Points of interest,** about nine features and eight groups:
  - the door, and the crack in the ice down to it: the step (§5);
  - the bell tower's cap, and the bell under it (#56's 42, §6);
  - the woman of 42's house-place on the old shore, a hearth-stone in the snow;
  - a camp on the shore (#45), a cairn on the old bank (#45), a shrine (#45); a lookout on the
    hills east over the ice.
- **Encounters.** Ice pike under the ice, two groups on ice (#536), one over the tower by night
  (`when`), which 42 walks over; snow lynx in the shore's pines; ice bears on the far shore, the
  box's hardest, proposed (§7).
- **Quests.** The step. The Bell Under the Ice (§6).
- **The secret and its hint.** The drowned village's smith kept his iron in a hole under the old
  bank, above the water; the hole is dry, and the iron is the band's. The hint: the ice is black
  everywhere but one strip, clear to the bottom, and under it a road of stones laid too square runs
  from the village to the bank and stops at it.
- **Lines:**
  - the door, the step: *A wall of grey under the ice, with a door in it: no handle, no seam, and
    no frost on it anywhere.*
  - the strip: *Black ice, and one strip of it clear to the bottom. Stones under it, laid too
    square, going to the bank.*
- **New here.** The story lock (call 4); a dungeon entered from the ice; a door that is a wall
  with its reason on it.
- **Finds.** The smith's iron: a Bear Spear +1, the ladder's (#535), and a named blade off the
  ladder, the box's to name.
- **Pay.** About 1,500 xp a member.
- **As built** (#489, 8 October): the brief's places and its eight groups, laid whole in Loch Fuar
  at band 20–22 (§1, §9, #489's 1). **The loch is the doc's, laid on the atlas's ground** (§9,
  #489's 2): the atlas has no lake in K9. Loch Fuar's lies in K10 and L10, at 352 to 368 by 294 to
  326, and K9 holds the sea's shore along the north and the river from that lake to the sea, the
  113 shallow. So the sea's deep along the north, 174 squares, stays open water, not walked; its
  shallows are ice, and the river through the middle is frozen and widened into a basin at rows 14
  to 23, columns 14 to 26, over the drowned village, and another at its foot, rows 26 to 31,
  columns 21 to 29, for the crack and the door. The map holds 229 squares of ice against the
  atlas's 113 shallow, about 115 land squares become ice, the edges keep the atlas's ground, and
  the world map paints the atlas's river over K9's ice.
  The way in is L9's, over the east edge, walked anywhere along the pines with no road: the box
  starts at 31,21 (359,275) facing west, and Loch Fuar's crossing line is said at it (#166; §9,
  #489's 13). Grass under snow runs round the loch with the pines behind it. On the north shore a
  strand of sand at 20,7 with a boat turned over, a hare's kill at 28,7, the ice ending at open
  water at 7,8 and a fowlers' camp in the pines' lee at 12,9 (#45). East of the arm a knoll of
  hills at 26 to 28, rows 10 to 12, added where the cut has none, with the lookout at 27,11, the
  roofs seen under the ice (§9, #489's 11). In the basin the drowned village of Fuar lies under
  the ice: its bell tower's cap stands out of it at 20,18, a square of building with its line on
  20,17, and the street shows under the ice at 22,21; a clear strip runs west from the cap over a
  road of stones to the old bank (14 to 19, row 18), hinted at 16,18. The old shore's bank is rock
  at 11 to 13, rows 17 to 19, with a cairn on the hills above it at 13,16 (300 gold and a great
  spell-point potion, as L9's) and beyond it, inland, the lodge woman's people's house-place, a
  hearth-stone swept clean at 9,18: lines only, the bell being #494's (§6). Searched at 14,18 the
  bank's face gives at 13,18, and behind it the smith's hole at 12,18 holds his iron, dry: 800
  gold, a Bear Spear +1 and his own blade, Lann Fuar (§9, #489's 8, 9). Pike bones lie on the far
  shore at 3,23; the cold loch's whole length is seen from the hills at 12,30; a shrine stands on
  the south shore at 17,25 (endurance). At the arm's foot the ice gives out at 28,30 and black
  water runs in from the south; a crack in the ice goes down at 24,27 to 24,29 to a wall of grey on
  row 30, 22 to 26, with the door in it at 24,30 (352,284), a `D`, shut to a company that has not met
  the girl out of the hole, who waits on the crack at 24,28 after the fourth night (§5; the door is
  listed in the exits and opens onto the bay, #490, §4.6).
  Eight groups. Snow lynx in the shore's pines four times: five by the way in (`k9_lynx_pines`,
  29,16, the nearest and gentlest) and five at the loch's foot on the way to the crack
  (`k9_lynx_foot`, 30,27), four on the north shore (`k9_lynx_north`, 9,11) and four on the far shore
  (`k9_lynx_far`, 2,15). Ice pike, four to a group, under the arm's ice twice: in the arm
  (`k9_pike_arm`, 19,10) and over the tower's cap by night only (`k9_pike_tower`, 21,18, `when:
  night`), which #56's 42 walks over. Ice bears in pairs on the far shore (`k9_bears_shore`, 4,21)
  and on its hills (`k9_bears_hills`, 6,28), the box's hardest.
  - **Seams.** East, L9 (built): K9's 31,0 to 31,31 meets L9's 0,0 to 0,31 square for square, ice
    at rows 0 and 1 and pines below (359,254 to 359,285 against 360,254 to 360,285); no road
    crosses, and the outdoors test pins both ways. The walkthrough walks L9's 0,21 onto K9's
    31,21 and hears the crossing line at each level. North, K8 (not built): 29 squares of open water
    and the ice at 29 to 31; west, J9 (parked): 10 of open water, 2 of ice and 20 of pines; the
    world ends past both, pinned. South, K10 (#491, built): K9's 0,31 to 31,31 (328,285 to 359,285)
    is `ppppppppppppp^,,,,,,,iiiiiiii~pp` and K10's 0,0 to 31,0 (328,286 to 359,286) is the same row
    square for square, pinned both ways and walked (K9's 20,31 onto K10's 20,0, the land not named
    again); the loch's water runs in at 29,31 only (357,285), where the atlas's river goes on into
    K10, and 28,31 is ice because the atlas beyond it, 356,286, is pine (the edge check). K10 found
    the atlas's lake under its own box (§4.7).
  - **Measured.** A company at 20 wins every fight and manages 8.54 fights to a rest, inside the
    aim, with 0.3% of its days ending in a fight broken off; two under, at 18, it wins every fight
    too, owed to #18 as M9's and L9's are. Its road, in under the pines past the lynx there and
    down the shore past the lynx at the loch's foot to the crack, is walked every time, which the
    gate's `ROADS` now names. Density 99.5% within 8 steps (832 of 836, 833 of 837 since the door's
    square opened, #490) and the furthest 10, with no sign among its 27 points. The curve's rank
    correlation is 0.32, the lynx by the way in nearest at 7 steps (level 20) and the bears on the
    shore the hardest at 27 (level 21). K9 pays 4,547 xp a member (18 lynx and 8 pike at 793 each, 4
    bears at 1,667) and 1,100 gold, the smith's iron 800 and the cairn 300; its dearest find, the
    Bear Spear +1 at 2,050, is inside the window, and Lann Fuar is 2,000. It claims nothing as new
    (§9, #489's 15).

### 4.6 The Sleepers' Bay (#490): dungeon, two levels of 16×16, bands 20–22 and 21–22

- **Purpose.** The act's dungeon and its turn: the stair under the ice and the bay of beds, where
  every people of Caldera lies asleep in rows and the keepers tend them (MONSTERS §7.3). Nothing on
  the surface names it, and no site paints it: the secret is found (§10). Wenna opens the door and
  waits at it; there are no hirelings (call 6).
- **Landmarks.** The upper level, `sleepers_bay`, the stair under the ice: the door's inside, THE
  BLOOD OPENS THE DOOR scratched on it at a girl's shoulder (DESIGN §9); the ice giving way to walls
  too smooth to be stone, drawn smooth as the Sunder's wall is (#424); the way the water runs, a
  passage down with meltwater in it. The lower level, `sleepers_bay2`, the bay: rows of long glass
  beds frosted over, an orcblood with Idris's brow, a Tidefolk woman, a gnome, dwarves, humans, an
  elf with Wren's hands (STORY); the keepers between them; the Matron in the last row; a door at
  the back with Kiln-script on it that opens for nobody and is no lock, as the Mines' CREW ONLY is
  not.
- **Points of interest,** about seven features and eight groups a level, as the Foreland's dungeons
  are held: the door's inside, the voice's wall, the first bed, the rows, the back door, the locker.
- **Encounters.** Knockers on the stair, the tallyman's that did not come up (two groups, proposed,
  §7); a keeper alone at the stair's foot, the first, gentle; the bay, three keepers among the beds,
  whose touch puts to sleep (0.3), who mend each other, and to whom anyone asleep is a sleeper
  (MONSTERS §7.3's second fight); the Matron, boss, level 22, in the last row. Machines: lightning
  bites, sleep and the Hearth's light do nothing, and they never run (MONSTERS §2).
- **Quests.** The chapter's entry: the sleepers (§5).
- **The secret and its hint.** A locker behind the last row where the keepers put what the sleepers
  came with, four hundred years of pockets. The hint: the floor is worn to a path between the beds
  by the keepers' feet, and the path runs on past the last row to a wall.
- **Lines:**
  - the beds, the step: *Rows of long glass beds, frosted over. Wipe one, and there is a face in it
    you have seen before.*
  - the path: *The floor is worn between the beds in a path. It runs on past the last row to the
    wall, and stops.*
- **New here.** The keepers, a new family (#495); machines shaped like people; a touch that puts to
  sleep; a boss that mends; Kiln-script read (#538).
- **Finds.** The Matron's part, a keepsake, as machines carry parts and no gold; in the locker the
  act's named pieces: the ladder's Hunter's Bow +1 and Plate Mail +4 (#535), each the bay's to name,
  and one of the sleepers' own, a ring, for the owner to name or cut.
- **Pay.** About 2,400 xp a member.
- **As built** (#490, 8 October): the brief's two levels, with the door listed and the lock signed
  in (§5; §9, #490's 1 to 4). The stair is band 20–22 and the bay 21–22 (§9, #490's 6), named *Under
  Loch Fuar* and *The Sleepers' Bay* (§10).
  **The stair** (`sleepers_bay`). K9's door lands on a landing in the ice at 8,1, facing south, and
  two squares on, the door's inside has THE BLOOD OPENS THE DOOR scratched at a girl's shoulder
  (`sb1_door`, 8,2). The stair's head runs straight down from it, and the ice gives out at 8,4 on
  walls too smooth to be stone, drawn smooth as the Sunder's wall is, which hum (`sb1_ice`); the
  light is theirs, with no lamp (`sb1_light`, 4,5). The stair parts along row 5. West it is the
  stair itself, down past the voice in the wall at 4,8 (`sb1_voice`): "Captain?", asked once and not
  again. East it is the way the water runs, meltwater in a channel cut smooth (`sb1_water`, 12,6),
  with the knockers' tallies scratched along its wall (`sb1_tallies`, 12,9), and it comes back along
  row 11. The two ways meet at 6,11 and go on to the stair's foot (`sb1_foot`, 6,13), where the last
  flight, 6,14, goes down to the bay. A door in the stair's north wall, 8,0, goes back up onto K9's
  24,29, the crack's foot, facing north. Three groups: a crew on each way (`sb1_knockers1`, 2,7;
  `sb1_knockers2`, 12,8), each of three tallymen and five knockers; and the first keeper alone at
  6,12 where the ways meet (`sb1_keeper`).
  **The bay** (`sleepers_bay2`). The last flight comes out at 7,13, facing north, into a long hall
  lit grey from its walls (`sb2_stair`, 7,12), and up the middle of it between the beds runs the
  path the keepers' feet have worn. Forty long glass beds, four rows of ten, are pillars (§9,
  #490's 18); the first, wiped, has a face in it you have seen before (`sb2_beds`, 7,11, the brief's
  line). Every people of Caldera lies asleep in them: an orcblood with Idris's brow, a Tidefolk
  woman and a gnome (`sb2_row1`, 10,9), dwarves and humans (`sb2_row2`, 3,7), an elf with Wren's
  hands (`sb2_row3`, 11,5), each breathing once in a long while. Keepers go between the rows, four to
  a row, three rows (`sb2_keepers1`, 4,9; `sb2_keepers2`, 10,7; `sb2_keepers3`, 4,5), and the Matron
  stoops alone in the last row (`sb2_matron`, 10,3), who never comes back: when she falls the
  sleepers sleep on. At 3,2 a door with Kiln-script over it (`sb2_back`, 3,3: COLD STORE. WAKE IN
  ORDER.) is a wall with a door in it that opens for nobody, as the Mines' CREW ONLY does not: no
  flag, no lock, no exit (§9, #490's 17).
  **The secret.** The path runs on past the last row to the back wall and stops at 7,3 (`sb2_path`,
  the brief's line). Searched there, the wall gives at 7,2, and behind it is the locker, 6 to 8 on
  row 1: grey drawers from floor to roof, a row's mark on each (`sb2_locker`, 7,1), and in them what
  the sleepers came with, 1,500 gold, **Bogha Fionn +1** and **Luireach Dubh +4** (8,1). Walked, the
  locker is reached only through the wall (§9, #490's 16).
  **The finds.** Bogha Fionn +1 is a ranger's bow of pale wood, the ladder's Hunter's Bow +1, at
  2,050; Luireach Dubh +4 is black plate for the knight and the paladin, the ladder's Plate Mail +4,
  at 1,800; both are inside the window of 4,500, and both are named in the hill folk's tongue (§10;
  #490's 15). The Matron drops her cap, **The Matron's Cap** (`matron_cap`, always, price 0): thin
  grey plate folded stiff and white, and inside the band a loop inside a loop (§9, #490's 14). The
  sleepers' ring is cut (§11).
  - **Seams.** K9's 24,30 (352,284) to `sleepers_bay` 8,1, facing south, on `q_wenna_up` (blocked
    with `DOOR.blockedText` without it); `sleepers_bay` 8,0 to K9's 24,29, facing north;
    `sleepers_bay` 6,14 to `sleepers_bay2` 7,13, facing north; and `sleepers_bay2` 7,14 back to
    `sleepers_bay` 6,13, facing north. On the atlas the stair's plate is the door's square, 352,284,
    and the bay's is 352,290, six below (K10's 24,4): a plate only (§3). Nothing inside the bay
    shuts: the door under the ice is its one lock.
  - **Measured.** On the stair a company at 20 wins every fight and manages 9.64 fights to a rest,
    inside the aim; two under, at 18, it wins every fight too, owed to #18 as K9's is. 42.3% of the
    stair's days end in a fight broken off, which no check asks: most likely the harness's bot
    against the mending keeper and the crews, recorded so that it can be tuned (§8; §9, #490's 21).
    In the bay a company at 21 wins 89.8% of its fights, 0.2 under the aim, which the Matron
    decides: she is won 59% at 21, where the aim is about half (30% to 70%), and 92% at 23, where
    it is nearly always (90%). It manages 9.16 fights to a rest, inside the aim, with 17% of its
    days ending in a fight broken off; its two under is n/a, the floor being over the area's. Alone,
    a company at 20 manages each crew in 6.3 fights to a rest and the first keeper in 30, and one at
    21 each row in 9.3. Density: the stair 100.0% within 7 steps (56 of 56) and the furthest 4, with
    no sign among its 12 points; the bay 100.0% within 7 (66 of 66) and the furthest 5, with one
    sign among its 14. The curve's rank correlation is 0.87 on the stair, the crew on the water's
    way nearest at 11 steps (level 20) and the first keeper the hardest at 21 (level 21); it is 0.77
    in the bay, the first row nearest at 7 steps (level 21) and the Matron the hardest at 13 (level
    22). The bay pays 5,455 xp a member and 1,500 gold (§8). It claims the keepers as new (§9,
    #490's 19).
  - **Walkthrough.** `rimewater/walkthrough.ts` plays the door shut to a company that has not met
    the girl and open to one that has, down onto the landing and back up onto the crack; the stair
    at 20 and the bay at 21, each place's events, the crews, the keepers, the Matron and her cap;
    the back door shut; and the locker found from the path, with its pieces.

### 4.7 K10, the high pass (#491): core, band 20–22

- **Purpose.** Loch Fuar's second step and the act's last ground: the road round the cold loch's
  foot through the pines and up to the pass's mouth, where the chapter points south after the two
  hundred, and the Whitespine's first brother comes down to meet the pilgrims (#56's 44).
- **Landmarks.** Pine all through (770); the road from L9's ridge along the loch's south shore (65
  shallow) and west to the pass's mouth at 334,302, where it climbs out for J11 at 318,318, Act IV's
  first box (#499) and the world's end until it is laid; a milestone; the pilgrims' camp in the snow
  below the mouth; a Lantern's wayside lamp, dark, by the road; the pass's walls rising.
- **Points of interest,** about nine features and eight groups:
  - the pass's mouth, and the event at it: the step (§5);
  - the pilgrims from Anvilhall in the snow, one dying, and the brother who comes down (§6);
  - a milestone: RIME LODGE 9, MONKS' VALE 6; the wayside lamp, dark, its jar full;
  - a camp (#45), a cairn (#45), a shrine (#45); a lookout on the pass's first shoulder.
- **Encounters.** Snow lynx in the pines, three groups, the band's own; ice pike under the shore's
  ice, on ice (#536); the box's group at the band's top is the roster's question (§7).
- **Quests.** The step. The Pilgrims in the Pass (§6).
- **The secret and its hint.** Under the dark lamp's jar-shelf, a Lantern's cache: a tally of the
  pilgrims who went up the pass and the fewer who came down, and the lamp's silver. The hint: every
  dark lamp on the road stood dry (docs/areas/sunderwood.md §4.7); this one's jar is full, and
  someone stopped lighting it on purpose.
- **Lines:**
  - the mouth, the step: *The road climbs into the range between two walls of rock, and the snow on
    it is trodden. South.*
  - the lamp: *A Lantern's wayside lamp, dark. Its jar is full to the stopper. Nobody ran out of
    oil here.*
- **New here.** Act IV seen: the pass, and a brother who does not bleed.
- **Finds.** The lamp's silver, and the Lantern's staff, a Guide's Staff +1, the ladder's (#535).
- **Pay.** About 1,100 xp a member.
- **As built** (#491, 8 October): the brief's places and its eight groups, laid whole in Loch Fuar
  at band 20–22, the floor lowered by two from the brief's 22 (§9, #491's 3). The pass is walled
  with mountain, where the issue had it all walkable (§9, #491's 6).
  **The road.** L9's pass lands on a bridge of split logs over the river out of the lake, 30,3
  (358,289), facing west, the box's start, and the crossing is said a square on (`k10_in`, 29,3).
  The road keeps the atlas's line west and south under the pines, square to square, with four joint
  squares added (26,5; 18,8; 9,12; 7,13) (§9, #491's 2). The new graves stand by it, three mounds
  with red cloth on sticks (`k10_graves`, 13,8; §9, #491's 11). At the pass's foot the milestone
  stands at 9,13, RIME LODGE 9, MONKS' VALE 6 (`k10_milestone`; §9, #491's 9), and the mouth is at
  5,15 (333,301), the brief's line (`k10_mouth`; §5, §9, #491's 10). Beyond it the road climbs
  south-west between two walls of mountain, with hills and snow beside it, and goes out by the west
  edge at 0,19 (328,305), its one way on: the saddle, which lands in J11 at 20,1 (#499).
  **The loch and the lake.** The cold loch's shore goes on from K9's south row, a clearing the deer
  have left (`k10_clearing`, 16,1) and the ice in a tongue three rows into the box's north
  (`k10_foot`, 24,1), with the river from the lake going in under it at 29,0. The atlas's lake lies
  in the east as it is, its deep water open and its shallows iced (#536), with a fishing hole cut in
  the shore ice (`k10_hole`, 24,16), the lake seen white from the south shore (`k10_shore`, 22,29)
  and, in the pines, a bear's lie under a downed pine (`k10_lie`, 10,29); the river from the lake to
  the loch stays open water (§9, #491's 4 and 5).
  **The people, lines only** (§9, #491's 11). The pilgrims from Anvilhall are camped in the snow
  below the mouth, a dozen under one sheet of sailcloth, one of them dying (`k10_pilgrims`, 9,18),
  and the new graves by the road are an event too: no person, no flag, no quest. The brother and the
  words are #494's (§6, §11).
  **The landmarks of #45.** A trappers' camp in the pines (9,5), a cairn on a knoll in the
  north-west with 300 gold and a great spell-point potion (`k10_cairn`, 3,2), a shrine in the pines
  (`k10_shrine`, 17,22; accuracy) and, for the brief's lookout, the pass's first shoulder
  (`k10_shoulder`, 3,10), from which the first peak of the range is seen (§9, #491's 13 and 17).
  **The groups** (§9, #491's 7). Eight: snow lynx, four to a group, by the bridge
  (`k10_lynx_bridge`, 25,4, the nearest and gentlest), by the lamp (`k10_lynx_lamp`, 20,13) and
  south of the pass's foot (`k10_lynx_south`, 10,24); ice pike, four to a group, under the lake's
  shore ice by the river's mouth (`k10_pike_head`, 26,10) and down the shore (`k10_pike_shore`,
  24,22); and ice bears in pairs on the shoulder (`k10_bears_shoulder`, 5,10, the hardest), under
  the pass's south wall (`k10_bears_wall`, 3,26) and in the south pines (`k10_bears_south`, 16,27).
  **The secret.** The dark lamp stands on the road at 16,10 (`k10_lamp`), the brief's line, and is
  the hint: its jar is full to the stopper and nobody ran out of oil. Its jar-shelf is a secret door
  at 16,11, and behind it, shut in rock, is the Lanterns' cache at 16,12 (`k10_cache`, the tally on
  slate; the chest `k10_silver`): 900 gold and a **Guide's Staff +1**, the ladder's, at 1,750. It is
  reached only through the shelf, and nobody walking, wading, climbing or floating gets to it any
  other way (§9, #491's 12).
  - **Seams.** North, K9 (built): K10's 0,0 to 31,0 (328,286 to 359,286) is K9's south row square
    for square, walked anywhere and pinned both ways in the outdoors test (§4.5). East, L10
    (parked): K10's 31,0 to 31,31 reads `ppp=ppp~~` and 23 of deep water; the road at 31,3 (359,289)
    meets the atlas's at 360,289; the world ends past it. The pass is L9's 6,31 to K10's 30,3,
    facing west, and K10's 31,3 back to L9's 7,31, facing north, both taken, not walked: going on it
    says *On down the road to the cold loch.* and then Loch Fuar, with the cold loch's harder words
    after that two under and its warning three under; going back it says *Back up the road to the
    long loch.* alone, and Loch Fada after it to a company come from elsewhere. The atlas test
    (`tools/tests/atlas.ts`) lets the pass's two ends lie apart on the world map, the road across
    parked L10's corner between them, as it lets the notch's. West, J10 (parked): K10's 0,0 to 0,31
    is pines, hills and the road in the outdoors, the walls' mountain at the edge being the map's
    ring and so void, with the road out at 0,19 (328,305) against the atlas's at 327,305, which goes
    on over J10's corner to the link's 318,318 in J11 (#499); the pass is taken, the saddle onto
    J11's 20,1. South, K11 (parked): K10's 0,31 to 31,31 is 27 pines and `iiWWW`, and the world ends
    past it.
  - **Measured.** A company at 20 wins every fight and manages 9.45 fights to a rest, inside the
    aim, with 0.7% of its days ending in a fight broken off; two under, at 18, it wins every fight
    too, owed to #18 as K9's is. The zone's road stays K9's (§9, #491's 15). Density 99.9% within 8
    steps (848 of 849) and the furthest 9, with no sign among its 25 points. The curve's rank
    correlation is 0.62, the lynx by the bridge nearest at 6 steps (level 20) and the bears on the
    shoulder the hardest at 32 (level 21). K10 pays 4,311 xp a member (12 lynx and 8 pike at 793
    each, 6 bears at 1,667, 25,862 over six) and 1,200 gold, the cache's 900 and the cairn's 300;
    its find, the Guide's Staff +1, is the ladder's and inside the window. It claims nothing as new
    (§9, #491's 14).
  - **Walkthrough.** `rimewater/walkthrough.ts` takes L9's pass at 17, 18 and 20, hears the cold
    loch's words after the pass's own and takes the way back; walks K9's south edge onto K10's
    north; walks the road square to square from the bridge to the mouth and out by the west edge;
    counts the milestone (112 squares to the lodge's gate and 72 over the pass to the monks' gate);
    sees the step, the pilgrims, the graves and the shoulder; wins the eight groups at 20, the pike
    under the lake's shore ice; and finds the cache, shut but for the jar-shelf (none of K10's 889
    squares walked, waded, climbed or floated reaches it): searched at the dark lamp, walked into,
    with the lamp's silver and the Guide's Staff +1 in the chest.

### 4.8 L10, L11, M10, M11, N9, J9 and K11, the country behind (#497): country, band 20–22, parked

- **Purpose.** The lochs' far shores and the pines behind the road, built once the owner has played
  the act (call 10): Loch Fada's length west and north (L10, L11, M10, M11), the glacier's edge in
  N9, with Glacier Foot's sliver of 255 drawn closed, and Loch Fuar's west and south (J9, K11).
- **Encounters.** Lynx, pike, bears at the glacier's edge; a den (#88).
- **Pay.** About 1,000 xp a member each (§8). The rest of each brief is written when #497 is
  unparked.

## 5. The one quest here

Rimewater's chapter is The Sleepers (`chapter.ts`, #492), the last of Act III, joined after
Cairnmoor's The Ring; every zone on the road holds a step (EXPANSION §5.8): Loch Fada's at the
lodge, Loch Fuar's at the door and the bay. Glacier Foot is the reach and exempt
(DESIGN §9). Its entries and goals, in the journal's voice, keyed to flags, events and maps the save
holds:

- **The lodge.** Down the drove road from the ring, the lodge on the long loch's shore, and a fire
  kept out on the ice: people are coming up through it at night, a few at a time, taken below from
  all over the world. Down there, they say, there are doors, and the doors open for some and not
  for others. The goal asks the company to stand the nights.
- **The nights.** One entry a night as the flags are set (§4.3): the man alone; the three; the
  family, and what they say of a girl who leads.
- **The fourth night.** The ice-hole: something comes up that clicks once for each of you, and six
  more behind it (MONSTERS §7.3). After them, the last one out: "Are you the ones my mother sent?"
  `q_wenna_up`. She will not go home: "There are two hundred more of us down there. I'm going back
  for them. The doors know me." The goal turns west to the cold loch.
- **The door.** Under Loch Fuar, down the crack in the ice, a door with no handle and no seam. Her
  palm on it, and it opens; a soft voice in the wall, "Captain?" She flinches. She waits at the door
  (call 6).
- **The sleepers.** Rows of long glass beds, every people of Caldera, asleep four hundred years, and
  on the inside of the door, scratched with a nail, THE BLOOD OPENS THE DOOR. "We didn't grow here.
  We were brought." The entry says what is seen and the hand feels; it never says what the Stones
  are (DESIGN §7). The Matron falls, or does not: the step is the beds.
- **South.** Back up, Wenna speaks at the door, and then she is at the lodge (#76). The two hundred
  went south under the world; the goal points over the pass into Monks' Vale, Act IV's first step
  (#499). The chapter's done flag ends the act.

**The lock** (EXPANSION §2.3; call 4). The door is Act III's one story lock: it opens for a company
that has met Wenna, `q_wenna_up`, set when she comes up on the fourth night, and for no one before.
It is declared in `content/locks.ts` with its square on K9 and its reason, and here: the bay is the
act's revelation, and a door that knows a hand of the line is what the act has been about since
the Deep Mines' CREW ONLY. Before the flag it is a door in plain sight with its reason on it, never
"not yet". Nothing else in the area waits on the quest: the pass is open, the lodge sells and
teaches to anyone, and a company that takes the pass first reads the journal true in that order.

As built (#489 and #490, 8 October): the door is `DOOR` on K9, 24,30 (352,284), at the foot of a
crack in the ice: a `D` in a wall of grey, listed in K9's exits, with `q_wenna_up` for its flag and
the line above for its reason, which the door says to a company that has not met the girl
(`DOOR.blockedText`), where K9's `k9_door` said it before the exit was listed. It leads to
`sleepers_bay` 8,1 facing south, a landing still in the ice that looks straight down the stair; the
way back up is a door in the stair's north wall, 8,0, onto K9's 24,29 facing north, the crack's
foot, since a landing is never itself an exit (§9, #490's 1 and 2). On the door's inside, at a
girl's shoulder, THE BLOOD OPENS THE DOOR (`sb1_door`). Wenna waits at the door as the doc has her:
the girl out of the hole stands on the crack at 24,28 once the flag is set, with the lines above
(she lays her palm on it; "Captain?"; she flinches). She goes down with nobody (no hirelings, call
6), and `DOOR.label` says she waits at the door while the company goes down. M9's girl takes an
`until` on the same flag: met once, she goes back down and is never in two places (§9, #489's 5).
She is unnamed in every line.

**The lock is signed in** (#490, #440). `content/locks.ts` holds `q_wenna_up` on `coldmere_k9` at
24,30, with what it is (the door under Loch Fuar's ice, a wall of grey with a door in it, which
opens under the hand of the girl out of the hole and for nobody before her) and why the story
spends it (the paragraph above, in the file's words). It is Act III's one, as Acts I and II spend
none, so the count stays inside EXPANSION §2.3's: one in the area, four on the road. Nothing inside
the bay shuts: its back door, Kiln-script over a wall with a door in it, has no flag, no lock and
no exit (§9, #490's 17).

**#440's fixture** is in `tools/tests/pillars.ts` and holds the pass from Loch Fuar into Monks' Vale
open from the start: a fixture exit from a Loch Fuar map into a Monks' Vale map shut on
`q_wenna_up` fails "a lock between rimewater and whitespine", signed in or not, and the atlas's
`coldmere`-`monksvale` link given `opens` fails "no way on the atlas opens on the story" (that
check is now the function `storyWays`, so that a fixture can be held to it). The pass itself is
K10's road, built open (§4.7), and its way on into Monks' Vale lands in J11 (#499; §9,
#490's 4; #491's 2).

As built (#491, 8 October): the chapter's last step is `k10_mouth`, an event on K10 at 5,15
(333,301), the pass's mouth, `once`, in the brief's line: *The road climbs into the range between
two walls of rock, and the snow on it is trodden. South.* The chapter's last entry reads it by
`seen`, as `coldmere_k10:k10_mouth`, and its goal points over the pass, which is open from the
start; the road ends at K10's west edge, 0,19, the saddle, which lands in J11
(#499; §4.7; §9, #491's 10).

As built (#492, 8 October): `chapter.ts`, begun on M9 (`visited`), down the notch where The Ring
ends. Nine entries: the lodge and its fire on the ice; one a night as `night_1` to `night_4` are set
(the man alone; the three; the family and the girl who led them; nobody, and the hole clicking);
the hole and the girl out of it, on `q_wenna_up`; the door, on the stair reached; the sleepers, on
`sb2_beds`, with the door's inside and *We didn't grow here. We were brought.*, what is seen and
what the hand feels and nothing of what the Stones are; and the south, on the beds and the pass's
mouth together. Five goals: the nights at Rime Lodge, the hole on M9's ice, the door on K9, the bay
(`sleepers_bay2`) and the pass's mouth on K10. `sb2_beds` sets `q_sleepers_seen`, since a condition
holds one `seen`: the chapter is done with it and `k10_mouth` seen, in either order, and the act
with it; the Whitespine's chapter (#505) takes it on over the pass. The door's label now says the
voice's word as it opens, so the journal's door is what every company saw. Back up from the beds,
the girl out of the hole speaks at the door (K9's 24,28): they have marched the two hundred on
south, under the world, for the mountains and the sea. Her words set `q_wenna_lodge`, her `until`
there and her `after` by the yard's fire at Rime Lodge, 10,13, so she is never in two places. She is
unnamed in every line, and in the journal. The walkthrough plays it at 20, 21 and 22: the four
nights stood at the inn and paid, the hole fought and the girl met at 20, the door at 21, the beds
and the mouth at 22; in order, and with the pass's mouth reached first, when the journal writes
nothing of it until the beds end the chapter. Each reads the same and ends once (§9, #492).

## 6. Side quests

#56's five for Rimewater, all standing (call 11), each built with its box on the systems of #76
(#494):

| # | Quest | Level | Where | What it needs | Built in |
|---|---|---|---|---|---|
| 40 | The Coach That Did Not Come | 20 | Rime Lodge's yard; the drove road on Cairnmoor's N8, where the coach stands in snow (call 11) | the coach (#539); a choice put by a person; a hand-in at the first meeting (#43) | #487, with N8's box; #494 |
| 41 | The One Who Went Back Down | 21 | the foot of the ice-hole (M9); the coach yard | the token of #56's 20 or a name from 27 (docs/areas/wrackholm.md §6); a choice put by a person | #486; #494 |
| 42 | The Bell Under the Ice | 21 | Rime Lodge; Loch Fuar's ice at night (K9) | `when` (#41); a group on ice (#536); Kiln-script read (#538); `after` 40 | #487, #489; #494 |
| 43 | Where the Sky Meets the Ice | 22 | Rime Lodge; the glacier's edge (M9's east) | a mark on the world map into the void (call 7) | #487, #486; #494 |
| 44 | The Pilgrims in the Pass | 22 | the pass's mouth (K10) | a choice put by a person; a brother as a person, no fight | #491; #494 |

- **40.** The lodge's coach is overdue. It stands in the snow on the drove road over the fells, the
  coachman dead of cold on his box, and inside a Hand's man in a healer's coat escorting someone who
  will not wake. The sleeper goes to the Lanterns' hall or to the temple's healer; the choice sets
  which, and 42 reads it. The coach stands on N8 (call 11), placed with Cairnmoor's box.
- **41.** Of those who came up, one went back down for his wife and is at the foot of the hole, on
  the shelf of ice under its lip, counted by a tallyman and let go. Shown Hale's sergeant's token
  (#56's 20) or told a name from the column (27), he says what he saw: a door that opened for a girl.
  Send him home by the coach, or keep him at the lodge as a witness (docs/areas/wrackholm.md §6).
- **42.** A lodge woman's people drowned when Loch Fuar rose; their bell tower is under the ice. On
  the ice at night over the pike, at the tower's cap, the clapper, and the bell cast with
  Kiln-script, KEEP THE COLD, which a Linguist reads (#538). If the Lanterns had 40's sleeper, she
  wakes at the bell.
- **43.** A lodge guide goes ahead to the glacier and is found frostbitten at its edge on M9, saying
  the sky came down to the ice and there are stairs in it. Brought in, she marks the way on the world
  map, into the void: the reach seen before it can be taken (DESIGN §9). The quest ends at Loch
  Fada's edge (call 7).
- **44.** Pilgrims from Anvilhall bound for the bells are stuck in the pass in snow, one dying. A
  brother comes down from Monks' Vale and tends him wrongly, and does not bleed: the Whitespine's
  Brother (MONSTERS §8.1), a person here and no fight, the first machine in a robe. Let the brother
  take them up, or turn them back to the lodge.

As built (#487, 8 October): the lodge places the people of three of these, lines only and no names,
as M9's are: the coachman, whose coach is overdue (40), a stonecutter of Cairnmoor's 39, come down
the drove road, and a lodge woman whose people are under Loch Fuar (42). The guide of 43 is not in
the lodge, M9's guide being back from the glacier already: #494 stages her before she goes, with
43's flags. Their words and flags are #494's (#487's 15). K9 (#489) places the ground of 42, lines
only: the tower's cap at 20,18, the pike over it by night (`k9_pike_tower`, 21,18) and the
house-place of the lodge woman's people at 9,18; the bell, its clapper and the words are #494's
(§4.5, §11). K10 (#491) places the ground of 44, lines only: the pilgrims camped in the snow below
the pass's mouth, one of them dying (`k10_pilgrims`, 9,18) and the new graves by the road
(`k10_graves`, 13,8); the brother, his flags and the words are #494's (§4.7, §11).

As built (#494, 8 October), in `quests.ts`, each finished at its level and every answer walked. The
people are the boxes', given words, flags and places; no group, drawing or system is added:

- **The Coach That Never Came** (`coach`): the coachman at the coach house begins it, the coach for
  here two days late (`q_coach`). On N8 its coachman sits frozen on the box (`n8_coach`), and by it
  a man in a healer's coat, salt white on his hem, with a woman under the rugs who does not wake.
  He writes a note for the lodge (`healers_note`, read from the pack), which begins it too
  (`q_coach_note`). The coachman takes the note at the first meeting (#43), his early words to a
  company he never asked, pays 200 and sends the sledge (`q_coach_sledge`): the two are gone from
  the moor and in the lodge's yard, where the man asks where she goes. The Lanterns' hall
  (`q_coach_hall`), a cot at its door under the lamps, or the healer's house (`q_coach_temple`), out
  of sight; he goes back up the road alone. 1,800 xp either way.
- **The One Who Went Back Down** (`wentback`): the man at the hole went back down for his wife and
  was counted and let go; he tells a stranger nothing (`q_wentback`). With Hale's token carried
  (`hale_token`, #56's 20) or the clerk's book read (`tide_ship2:ts2_clerk`, 27) he says what he
  saw, a wall with a door in it that opened for a girl, and asks: home on the coach
  (`q_wentback_home`), gone from the hole, or a witness at the lodge (`q_wentback_witness`), telling
  it at the lodge-keeper's side. Nothing is taken from the pack. 1,800 xp either way.
- **The Bell Under the Ice** (`icebell`): once 40's sleeper has a bed the lodge woman asks for the
  bell rung (`q_icebell`). On K9 the bell's lip shows through the ice by the cap (`k9_bell`, 19,17),
  read KEEP THE COLD (#538); by night, beside the pike over the cap, the clapper (`k9_clapper`,
  21,17) rings it under the ice (`q_icebell_rung`), and by day is not there. The sleeper in the hall
  sits up at it; in the healer's house she sleeps on. The lodge woman goes out to Fuar
  (`q_icebell_out`) to sweep her people's hearth (K9, 9,17), or stays by the fire (`q_icebell_stay`).
  1,800 xp either way.
- **Where the Sky Meets Ice** (`sky`): the guide by the lodge's gate goes up the glacier with a
  party (`q_sky`), and only then is she at its foot on M9 with her half-built cairn
  (`m9_guide_cairn`, `after` it too), frostbitten: the sky comes down to the ice, and there are
  stairs in it. Met, she is carried in (`q_sky_in`) to the inn yard's fire, where she draws the way
  on the company's map, east off the glacier's edge into nothing (`q_sky_marked`, 2,100 xp). It
  ends at the glacier's edge (`m9_sky`, 28,20; call 7). Beside it, old marks at the ice's foot
  (`m9_marks`, 28,19), read SERVICE STAIR. CREW ONLY, put the Ice Caves on the world map: the reach
  seen before it can be taken (DESIGN §9).
- **The Pilgrims in the Pass** (`pilgrims`): the old woman of Anvilhall below the mouth begins it
  (`q_pilgrims`), the boy dying beside her. Met, a brother has come down the pass to them, the
  Whitespine's Brother as a person and no fight: he has the blankets off the boy and rubs snow into
  his chest, and his split hand does not bleed. She asks: up with him (`q_pilgrims_up`), which #445's
  monastery reads, or back to the lodge (`q_pilgrims_back`), where the boy eats by the yard's fire.
  Either way the camp is a cold fire-ring (`k10_camp`). 2,100 xp either way.
- **The Faces on the Tors' end** (39): the stonecutter is at the lodge (2,8) only once sent home from
  the tors (`after` `q_faces_home`), so never in both places, and says the last tor has one eye.

### The guilds' quests

One hall opens here, the Lanterns' fourth (call 5; DESIGN §8's three become four), on the rules
and the hall menu of #132: Rime Lodge's hall sells to tier 7, teaches the Lanterns' three skills
once #538 builds Linguist (Spirit Sense and Perception are #18's) and gives the Lanterns' quests to
a member. The fourth rank, Luminary, opens at Lantern Watch and here (call 8, #439): its quests are
the Lanterns' line's, the split that began at the Watch (DESIGN §8, §9), and are #439's to propose.
The first task for a company that is not yet a Taper is to keep the hole's fire a night.

As built, #487 sold and taught and added no quest of its own, that task waiting with the fourth
rank for #439 (#487's 12), and #439 (8 October) makes the hall one hall of one ladder (DESIGN §8;
docs/areas/kilns.md §9, #439's 2 and 3):

- **The first task is the ladder's own,** First Light, given here as at every hall. The hole's
  fire is dropped: it would be a second rank-0 quest, and a stranger who joins here still goes
  back down the road for ranks 1 and 2, so it saves no road.
- **The Luminary asks are offered and reported here** as at Helmstow, Thornhold and the Watch:
  The Words Over the Dead, the words over the dead in the Tiefzeche copied (docs/areas/kilns.md
  §6), and What the Ring Said, the ring's voice reported (docs/areas/cairnmoor.md §6). Their goals
  name the Watch and the Lodge as where to report, which is how the rank opens at the two. They
  wait for Act II's end.
- **One ask is filed here,** the Wardens': A Sword at the Hole (`wardens_hole`, `guilds.ts`), given
  at the Drillyard in Captain Ordgar's voice, the fourth night's fight at the ice-hole
  (`longmere_m9:m9_night_4`) won. It pays 300 gold and 2,400 xp, 400 a member (§8).

## 7. Encounters, and what is new

MONSTERS §7.3 has the roster and the fights: the Ice Pike, the Snow Lynx, the Tallyman, the Ice
Bear, the Bay Keeper and the Matron; the ice-hole on the fourth night, the bay among the beds.
They are drawn (#495, §3), six, two of them new families: the keepers, tall, thin, grey and
many-fingered, whose frame the Whitespine's monks wear under their robes and the Vault's
lamplighters bare (MONSTERS §11), and the cats, which the Wold's lions follow. The tallyman is the
knockers' (the Kilns', MONSTERS §7.1), the ice pike the long bodies' and the ice bear the bears'.
§4.2 to §4.7 place every group, the lynx under the Rimefells the gentlest and the Matron at the top
of the band. As built, the ice-hole's fight is M9's `m9_night_4` (#487): the tallyman, six knockers
of the Kilns' at 16 and the three more the tallyman calls at half a turn (#537), once, after the
fourth night. The curve test reads a caller's retinue at its own level, so the group stands at the
tallyman's 20 (#487's 4 and 6). K9's eight groups (#489) are snow lynx four times in the shore's
pines, the gentlest by the way in; ice pike twice under the arm's ice, one of them over the tower's
cap by night; and ice bears in pairs on the far shore and its hills, the box's hardest at 21
(§4.5). The bay's seven (#490) are, on the stair, two crews of three tallymen and five knockers each
(a tallyman leading, so that the knockers stand at its 20, as the hole's retinue does) and the first
keeper alone at the stair's foot; and, in the bay, the keepers four to a row in three rows and the
Matron alone in the last row (§4.6; §9, #490's 8 to 11). K10's eight (#491) are snow lynx three
times, four to a group, by the bridge, by the lamp and south of the pass's foot; ice pike twice
under the lake's shore ice; and ice bears in pairs three times, the box's hardest at 21 (§4.7).

Taken, against the roster's Where column, and built on L9's ridge, K9's far shore, the bay's stair
and K10's pass (#488, #489, #490, #491): the Ice Bear on the lochs' shores, the ridge and the pass
(L9, K9, K10), where MONSTERS §7.3 had it at the glacier's edge only; and the tallyman and the
knockers on the bay's stair, where the roster had them at the ice-hole only (the knockers also in
the Deep Mines). MONSTERS' Where column says so now, in this pull request, the owner's to overturn
(§9, #490's 22, and #491's 7 for the pass).
**The band's top is a question.** The roster has nothing at 22 outside the bay: the keeper and the
bear are 21, the rest 20. K10 at 22 alone wants a hardest group at 23 by the curve's rule, as C7 at
12 wanted one at 13 and had none (docs/areas/saltreach.md §9, #178's 2). Either K9 and K10 are both
21–22 with bear pairs at the top, as the pans took the bull toads, or the cats are given an elite at
22 for the pass, a seventh drawing #495 did not make (§9). The owner's, in #491. K9 takes the first
for its part: bear pairs at 21 are its top, in a band lowered to 20–22, as L9's is to 20–21 (§9,
#489's 1 and 6), and K10 after it, in a band of 20–22, the floor lowered by two from its brief's 22
(§9, #491's 3).

New in Rimewater, for the novelty check (EXPANSION §5.4): the keepers and the cats, two new
families; ice and lying snow underfoot (#536), with a group placed on ice; calls (#537); a story
lock (call 4), the act's only one; a town whose inn counts nights; a dungeon entered from the ice;
machines shaped like people, a touch that puts to sleep and a boss that mends; Kiln-script read for
a quest (#538). Its landmarks: a hole in the ice with a fire beside it, a bell tower out of the ice,
a door under the ice, rows of glass beds, a glacier, a pass. The area's `novel` claims each as a box
places it, since the check asks that what is claimed be used: the cats and a group on ice with M9
(#486), the rest with theirs; snow and ice underfoot are Cairnmoor's. Rime Lodge (#487) claims no
landmark, its icon being the road's before, Deepthorn Lodge's, which the check refuses (#487's 16).
K9 (#489) claims nothing: the lock and the dungeon entered from the ice were the bay's to claim when
its exit was listed (#489's 15). The bay (#490) claims the keepers, the family it places. The
sleeping touch is on the road before it (the check refused `inflict:asleep`), and a lock or a
dungeon entered from the ice is no kind the check knows, so neither is claimed (#490's 19). K10
(#491) claims nothing: a landmark claim is an atlas site's icon, and the pass is no site (#491's
14).

## 8. The numbers

- **Experience.** The curve (EXPANSION §5.2, #159) gives an area the climb from its floor to the
  next area's floor, divided by 0.75: from 20 to 22 that is 12,200 / 0.75, about 16,267 xp a
  member, with today's `xpForLevel`. The shares of §4 are M9 1,500, Rime Lodge 500, L9 1,300, K9
  1,500, the bay 2,400, K10 1,100 and the five side quests about 900 between them: about 9,200,
  some 43% under the curve. The gap is the country behind's: seven boxes at about 1,000 each
  (§4.8), parked (call 10), which with the road's shares come to about 16,200. Saltreach's and
  Sunderwood's shares were set to sum a little over their curves so that a kill paid by level could
  damp them (docs/areas/saltreach.md §8); here a company that clears the road alone leaves for the
  pass about a level short of the Whitespine's floor. Either the road's shares rise, each box priced
  by its fights at about 300 a fight as the built boxes were, or part of the country is unparked
  with the act: §9 puts it to the owner. Each box is priced when it is built and recorded here, and
  the curve's row reports what a clear falls short of as owed to #497, the country behind, now the
  area is built.
  Scaled to the curve, which §9 proposes as the briefs' working figures until each box is built,
  the shares are M9 2,650, Rime Lodge 900, L9 2,300, K9 2,650, the bay 4,250, K10 1,950 and the
  side quests about 1,600: about 16,300. The issues (#486 to #494) carry the first figures until
  their briefs are settled. As built: M9 3,754 (#486), over the brief's 1,500 and the scaled 2,650;
  Rime Lodge 449 (#487), the hole's fight alone (the tallyman 793 and six knockers at 317, over
  six), under the brief's 500 and the scaled 900, the hall's quests being the ladder's (#439, §6);
  L9 2,128 (#488), over the brief's 1,300 and the scaled 2,300; K9 4,547 (#489), over the brief's
  1,500 and the scaled 2,650, the brief's eight groups and its figure never having agreed; and the
  Sleepers' Bay 5,455 (#490), over the brief's 2,400 and the scaled 4,250. The bay is two crews at
  3,964 each, the first keeper at 833, three rows at 3,332 each and the Matron at 13,973: 32,730
  over six. The brief's 2,400 is about the Matron alone (13,973 over six, about 2,330), and its
  "about eight groups a level" is not met, its own list naming five fights: seven groups are built
  (§9, #490's 12).
  K10 pays 4,311 (#491), over the brief's 1,100 and the scaled 1,950: three groups of four lynx at
  3,172, two of four pike at 3,172 and three pairs of bears at 3,334, 25,862 over six. Its eight
  groups are the brief's, and its figure never agreed with them (§9, #491's 8).
  Rimewater stands at 20,645 of 16,267 (the shares are rounded down, so they sum to 20,644), and at
  21,045 with the ask #439 files here, A Sword at the Hole, 400 a member: its xp is met, and the
  curve's owed row keeps gold only (§9, #490's 13). The chapter pays nothing, as no chapter does
  (#492), so the share still to come is the side quests' (1,600 scaled).
  **The budget for the rest** (#490's 23; #491's 18). The ask is 16,267 xp and 9,840 gold a member,
  and the line is 1.4 times it, 22,774 xp. With K10 built and A Sword at the Hole filed (#439)
  Rimewater holds 21,045 xp, as the curve test prints it. So the side quests (#494) and the chapter
  (#492) together may pay at most about 1,729 xp a member (22,774 less 21,045); the quests' brief is
  1,600, which leaves about 129 for the chapter. The chapter is written and pays nothing (#492), so
  the 1,729 is the quests' alone. K10 had been held to about 4,440 and paid 4,311.
  The side quests and the chapter cut quests or rewards of their own, the least valuable first,
  rather than pass it. The figures are worked again from the curve test's own output after merging
  main. As built (#494): the side quests pay the scaled 1,600 a member by their answers, 300 each
  for 40, 41 and 42 and 350 each for 43 and 44, every answer of a question paying alike, so a clear
  gives 22,645, 129 under the line.
- **Gold.** Training six members from 20 to 22 costs about 9,840 with today's `trainPrice`, and
  tier 7 its fee at the hall (#20; the Watch's is 400). A clear should pay for the training at
  least, in chests, drops and the hall's pay; the furrier's step is priced within the band's window
  on the curve, 4,500, and no find comes within 400 of it (#535, as #399 held Act II's): the
  dearest ware the Bearskin Coat at 2,500, the dearest finds the Hunter's Bow +1 and the Bear Spear
  +1 at 2,050. The furrier's full set for the premade six comes to about 19,100, its weapons
  10,900. The machines carry no gold, only parts (MONSTERS §2), so the bay's gold is its locker's.
  As built: M9 holds 1,520 (#486) of the 9,840, the lost guide's kit 1,200 and the fells' cairn 320;
  its monsters carry none, and its dearest find, the Ice Axe +1 at 1,950, is inside the window. Rime
  Lodge adds none (#487): its furrier sells the step at the prices above, its hall takes 500 for the
  seventh tier and its inn 45 a member a night. L9 adds 1,400 (#488), the drove's strongbox 1,100
  and the crest's cairn 300; its find, the Skinning Knife +1, is inside the window too. K9 adds
  1,100 (#489), the smith's iron 800 and the old bank's cairn 300; its finds, the Bear Spear +1 at
  2,050 and Lann Fuar at 2,000, are inside the window. The bay adds 1,500 (#490), the locker's, its
  machines carrying none; its finds, Bogha Fionn +1 at 2,050 and Luireach Dubh +4 at 1,800, are
  inside the window too. K10 adds 1,200 (#491), the Lanterns' cache's 900 and a cairn's 300; its
  find, the Guide's Staff +1 at 1,750, is the ladder's and inside the window too, and the clear
  holds 6,720 of the 9,840. A Sword at the Hole pays 300 more (#439): 7,020. The coachman pays 200
  for the healer's note (#494), and no answer pays gold: 7,220, which the curve's owed row keeps.
- **The gate.** The gate check (`tools/tests/gate.ts`, #38) holds each box at its own floor
  (docs/areas/thornmark.md §9, 17): a company at 20 wins nine in ten of M9's fights and walks the
  drove road to the lodge resting at the inn; one at 18 wins no more than one in four, which is how
  the Rimefells turn a Cairnmoor company back. The Matron is won about half the time at 21 and
  nearly always at 23. The ice-hole's fight is judged with the fire at the company's back, one
  group and its call (#537), inside the aim at 20. As built: a company at 20 wins every fight on M9
  and walks Loch Fada's road every time, 9.55 fights to a rest; one at 18 wins every fight too,
  owed to #18 as the Kilns' and Cairnmoor's boxes' are (§4.2). Rime Lodge (#487) puts the hole's
  fight on M9 as a group of its own: Rimewater at its maps' floors won 100% of its 20 groups'
  fights (8 before L9, 12 before K9), and so did a company two under, the same debt; the hole
  alone is 10.4 fights to a rest at 20, a little over the aim of 8 to 10 and inside the limit of
  12.5 (§4.3). L9 the same: at 20 every fight won, 9.27 fights to a rest; at 18 every fight won too,
  owed to #18 (§4.4). K9 the same: at 20 every fight won, 8.54 fights to a rest; at 18 every fight
  won too, owed to #18; its road, in past the lynx by the way and down to the crack, walked every
  time (§4.5). The bay (#490): a company at 20 wins every fight on the stair and manages 9.64
  fights to a rest, inside the aim, and one at 18 wins every fight too, owed to #18; 42.3% of the
  stair's days end in a fight broken off, informational and no check's, most likely the bot against
  the mending keeper and the crews (§9, #490's 21). A company at the bay's floor, 21, wins 89.8% of
  its fights (aim 90%, limit 80%), the Matron deciding it: she is won 59% at 21 (aim 30% to 70%) and
  92% at 23 (aim 90%). It manages 9.16 fights to a rest in the bay (aim 8.25 to 10.25), 17% of its
  days ending in a fight broken off; its two under is n/a, its floor being over the area's (§4.6).
  K10 (#491) the same: at 20 every fight won, 9.45 fights to a rest, 0.7% of its days ending in a
  fight broken off; at 18 every fight won too, owed to #18; its road is not the zone's (§4.7). With
  the bay and K10, Rimewater at its maps' floors wins 98.8% of its 35 groups' fights (98.5% of 27
  before K10), the Matron being the shortfall; a company two under wins 97.2% (96.4%), owed to #18.
  The side quests (#494) place no group, and the gate is as it was.
- **Density.** Core boxes at the Foreland's floor, country at the looser one (EXPANSION §5.3); the
  bay as a dungeon, 90% within 7 and none past 10. As built: M9 98.0% within 8 steps and the
  furthest 13, with no sign among its 31 points (#486), 32 since #487; Rime Lodge, a town, 100%
  within 7 and the furthest 4, no sign among its 19 points (#487); L9 100.0% within 12 steps (the
  country floor) and the furthest 11, with no sign among its 23 points (#488); K9 99.5% within 8
  steps (832 of 836, 833 of 837 since the door's square opened) and the furthest 10, with no sign
  among its 27 points (#489); the bay's stair 100.0% within 7 steps (56 of 56) and the furthest 4,
  with no sign among its 12 points, and its lower level 100.0% within 7 (66 of 66) and the furthest
  5, with one sign among its 14 (#490); K10 99.9% within 8 steps (848 of 849) and the furthest 9,
  with no sign among its 25 points (#491). With the chapter and the side quests (#492, #494), as the
  check prints it now: M9 the same, with one sign, the old marks at the ice's edge, among its 34
  points; Rime Lodge the same, with no sign among its 27; K9 the same, with one sign, the bell's lip,
  among its 30; K10 the same, with no sign among its 28.

## 9. Decisions

Decided by the owner's delegate on 2 October 2026 (#434), and followed here:

1. **The sealed bay's door is Act III's one story lock** (call 4): its flag `q_wenna_up` is set
   when Wenna comes up on the fourth night, the door opens for a company that has met her, and it
   is declared in `content/locks.ts` and in §5 (#440).
2. **Rime Lodge's hall is the Lanterns' fourth** (call 5): DESIGN §8's three become four. The
   lodge-keepers who hold the ice-hole open are Lanterns; the hall sells tier 7, teaches the
   Lanterns' skills, Linguist among them (#538), and gives their quests. The four nights are a flag
   a night, set by resting at the lodge's inn, each night's arrivals a once-event keyed on its flag,
   the tallyman and six knockers on the fourth and Wenna the last one out after them; the chapter
   asks the company to stand the nights.
3. **The Sleepers' Bay is a dungeon on the atlas** (call 6): id `sleepers_bay`, band 21–22, under
   Loch Fuar at about 352,284, entered from the ice; two levels of 16×16, the stair under the ice
   and the bay of beds, the Matron in the last row. Wenna opens the door and waits at it, no
   hirelings, and speaks when the company comes back up.
4. **Glacier Foot is cut whole** (call 7): none of its boxes laid, void until Phase 1.6. #56's 43
   ends at the glacier's edge in Loch Fada, M9's east, where the guide marks the way into the void.
   The reach's bands are the cap's, the Ice Caves at 30–32 and not the atlas's 20–22, written here
   and in MONSTERS §12.
5. **The Lanterns' fourth rank opens at Lantern Watch and Rime Lodge** (call 8, #439): built as
   the Luminary asks at every Lantern hall, the goals naming these two to report at (§6).
6. **The drove road's coach runs Kilnhaven ↔ Rime Lodge** (call 9, #539).
7. **The cuts stand, and the country behind is parked** (call 10): §11, and #497.
8. **All of #56's 40 to 44 stand** (call 11), with 43 ended at Loch Fada's edge and 40's coach found
   stopped on Cairnmoor's N8.

Proposed, for the owner, each in the issue that would build it:

- **The briefs** of §4.2 to §4.8: each box's landmarks, points of interest, encounters, secret and
  hint, finds and share of the pay.
- **The core** is M9, K9 and K10, the boxes that hold a step; L9 is country, and the seven behind
  are parked (§4).
- **L9 is laid in Loch Fada,** all of it, so Loch Fuar begins at K9 and K10 and the crossing line
  falls at L9's west edge (§4).
- **The ice-hole is on M9,** a few squares out from the lodge's lake wall, the inn yard's door its
  second way between town and box as the Keel's cellar is Saltmouth's (docs/areas/saltreach.md
  §4.9), so that the fourth night's fight is placed on ice. The way the sleepers came up runs on
  under the ice from the hole to the door and is theirs, not the company's, which reaches the bay
  by the door Wenna opens (#486, #490).
- **The nights are rests at the inn,** four flags in order (§4.3); whether a night asks the clock
  past midnight as well was #487's to settle, and it asks none (#487's 2).
- **The bay's two levels,** the stair and the beds, with the back door in Kiln-script that opens
  for nobody and is no lock, the Mines' CREW ONLY's precedent (#490).
- **The band's top** on K9 and K10 (§7): both 21–22 with bear pairs, or a cat at 22 (#491, #495).
- **The shares** (§8), and the gap: raise the road's shares to the curve, or unpark part of the
  country with the act.
- **The bands on the atlas's rows** (`src/content/areas/rimewater/atlas.ts`): Loch Fada 20–21, Loch
  Fuar 21–22, Rime Lodge 20–22, the Sleepers' Bay 21–22, Glacier Foot the reach's. They are set
  there already, where only the scaffold reads them, for a box's draft; the owner's word changes
  them there.
- **The names** (§10), for #435.

Decided by delegate for #539, each the owner's to overturn (docs/areas/kilns.md §9 has the rest):

1. **Rime Lodge owes the coach its landing and its seller** (#487): the yard's square, on its end of
   `DROVE_COACH` in `content/crossings.ts`, and a coachman whose `passage` is `sells('rime_lodge',
   DROVE_COACH)`. Once Kilnhaven lands too, the check wants both ends to sell it.
2. **The run is 250 gold and a day,** leaving either end at 6 and landing at 12 the next day, by
   Rime Lodge's floor of 20, the dearer end's. No guild halves it.
3. **The Coach That Did Not Come stops one coach, never the run:** the coachman sells whatever 40's
   flags say, since no crossing waits on the story (EXPANSION §2.2).
4. **The lodge is a way in once the coach runs:** the gate counts its ways out onto M9 as the coach's
   landing (#164's `landings`), so the groups nearest them are held to the zone's gentlest (#486).

Decided by delegate for #535, each the owner's to overturn:

1. **The furrier sells seven, a hunter's and a guide's:** an Ice Axe, a Skinning Knife, a Hunter's
   Bow, a Bear Spear, a Guide's Staff, a Bearskin Coat (12) and a Fur Robe (11), a point of blow
   past the Kilns' finds for every class and the medium wearers' and the casters' armour step. No
   shield: plate's wearers step at 22 instead, with the bay's Plate Mail +4, as the Kilns' doc has
   it (docs/areas/kilns.md §9, #535's 3).
2. **The finds by 22 go where the briefs ask a piece of the step:** the lost guide's Ice Axe +1 in
   M9's hollow, a drover's Skinning Knife +1 in L9's strongbox, the drowned smith's Bear Spear +1 on
   K9, the Lantern's Guide's Staff +1 under K10's lamp and the bay's two, a Hunter's Bow +1 and a
   Plate Mail +4. K9's named blade and the sleepers' ring stay off the ladder, their boxes' own.
3. **A box names its find, and the ladder keeps the id:** the bay's two are "named pieces" and K10's
   a Lantern's, so their names are their boxes' to give, the ids the ladder's.
4. **The ladder's top is 22,** Rimewater's finds, so the Whitespine's floor wears the act's last
   step, and the harness's what-if grows gear past it.

Decided by delegate for #496, each the owner's to overturn:

1. **The rooms are §4.3's six, which are the issue's:** the inn, the Lanterns' hall, the temple, the
   furrier, the provisioner and the trainer's yard. The coachman sells the coach in the yard as a
   person with no room, as Kitto sells his boat on Saltmouth's quay.
2. **The ids are `rime_` and the business,** as Lantern Watch's are `watch_` (`watch_hall`), since
   "lodge" is Deepthorn Lodge's as well; §4.3 gives them for #487 to name, and each scene's file is
   named for its id, as `tools/changed.ts` reads a room by its file.
3. **The temple is the hill folk's, not the Lanterns':** a healer's house round a stone with a cup
   in it, snow in the cup, as the moor's shrines are (docs/areas/cairnmoor.md §4), since 40 sends
   its sleeper to the Lanterns' hall or to the temple's healer, two hands and not one.
4. **Tier 7 is on the shelves, and not lettered:** the hall's case shelves the spells by tier, a
   brass plate with each shelf's number from 1 at the foot to 7 at the top, where a few new books
   stand. No spell's name is written.
5. **The inn shows the ice-hole's fire, never the hole:** the hole is M9's, out on the loch (§4.2),
   so the yard's door shows the fire far off through its glass, smoke by day and its light on the
   ice by night, and lets the snow in under it.
6. **What the rooms share is in `lodge.ts` beside them,** as the Kilns' towns share theirs: the
   logs, the pelts, the frost on the glass and the loch through a window; what one room alone draws
   stays in its scene. The trade helpers are borrowed as they stand: the Lanterns' bookcase, the
   yards' butt and rack and the shops' flask.
7. **Every room lets the day in,** by a window, the door's glass, the temple's smoke hole or the
   open sky, so nine at night is not noon.
8. **The yard looks east to the glacier** over the stockade, as M9 has it on its east edge (§4.2),
   drawn plain, snow on every face: the bare face is M9's hint for its hollow, and stays M9's.
9. **The furrier shows its seven:** the Bearskin Coat on its stand, the Fur Robe on its peg, the
   Bear Spear, the Ice Axe, the Hunter's Bow and the Guide's Staff racked and the Skinning Knife on
   the block by the fleshing beam (#535).

Decided by delegate for #495, each the owner's to overturn:

1. **The keepers are mannequins in the vessel's plate:** too tall and too thin, the knockers' grey
   plate on their ball joints, a waist of rings and an egg of a head with two soft lights and no
   mouth; people in outline and nothing else, so a company knows the walk again under a robe.
2. **Too many fingers is six to a hand, eight to the Matron's,** long, jointed and lit at the tips,
   the sleeping touch's light; now and then a keeper's hand comes up to touch.
3. **The keepers carry the chisel's mark,** the knockers' lozenge on a stem beside the chest's seam,
   by docs/areas/kilns.md §9's rule (#472's 3) and the same drawing (`chiselMark`): every hand of the
   vessel is marked, and the Abbot's robe will fall open on it.
4. **The Matron is a keeper in a matron's shape:** the tallest, stooped, a starched cap and an apron
   of pale plate, a second pair of arms folded over it. One frame, a Build to a kind, and a robe goes
   where her apron does, so a brother is a Build and a robe.
5. **The Bay Keeper mends the most hurt of its group one turn in four,** and its touch sleeps at 0.3:
   at one in two the harness broke off a fifth of the days of four keepers at fifteen rounds, at one
   in four 3%, in fights of 7.6 rounds (300 seeds). On #541's line, 248 hit points and 4d8+2 where it
   had 227 and 3d7+5, one in four breaks off 17%, for #490's gate to weigh.
6. **The Matron does not mend:** her mend is 20 of her 1,145 (1,299 on #541's line), a blow lost, and
   at a quarter of her turns it lifted a company's odds at 20 from 74% to 86% (88% with two keepers by
   her). §4.6's boss that mends is #490's to give her.
7. **The Matron is on the boss line at 22, for #490's gate to tune,** as the Foreman is #462's: won
   74% at 20, 86% at 21, 94% at 22 and 98% at 23 (300 seeds), where #490 asks about half at 21. On
   #541's line, 1,299 hit points and 22d8+27 where she had 1,145 and 20d8+21, 45%, 59%, 78% and 90%.
8. **The cats are posed from a table** of where the body, the head and each leg's joints stand, the
   tufts, the ruff, the tail and the paws in the Build: the lynx at the top of its leap, and the
   Wold's lions a Build and a stalk of their own. The lynx leaps at the back row as flyers reach it.
9. **The Ice Pike comes up through a hole it broke in the ice,** its body dark under the ice behind,
   a bill of a head with one gold eye, spotted: the long bodies' frame takes a straight thrust, a
   head tipped up, the bill, the spots and the body under the ice.
10. **The Tallyman is a knocker that counts:** slate-blue, its front lifted to the company, tallies
    scratched over every plate but the mark's, six lights on its cowl coming on one a click, frost
    and icicles from the hole; the knockers' Build takes `count`, `tally` and `rime`.
11. **The Tallyman calls three knockers at a half a turn,** as #537's test caller calls three fodder,
    so the ice-hole's six leave room for one call: a company of 20 fights it 12.1 times to a rest,
    against 14.3 with no call, and wins it from fresh at 18, which is #487's gate to tune. On #541's
    line the tallyman has 314 hit points and 3d7+5 where it had 241 and 3d8+4: the hole is fought
    10.4 times against 13.8, 30% of its days ending in a fight broken off, and is still won from fresh
    at 18.
12. **The Ice Bear is the bears' frame long in the neck,** low in the hump, the head small and the
    muzzle long, white with black claws, lifting its head to the wind. The roster gives the ice
    things no element, so cold stays an answer here.
13. **Each is today's test monster at its role and level, and none carries gold:** the levels past 16
    are #541's to make again, and all six move with them; the machines' parts are their boxes' to
    add, as the knockers' are #462's. #541 re-stated them: the pike and the lynx 288 hit points and
    3d7+5 where they had 239 and 3d7+4, the bear 570 and 5d7+7 where it had 518 and 4d8+6; the
    tallyman, the keeper and the Matron as 11, 5 and 7 say.
14. **No seventh drawing:** the cats get no elite at 22 for the pass, and K9's and K10's top stays
    #491's (§7).
15. **Each is owed to the box that first places it:** the pike, the lynx and the bear to #486; the
    keepers to #490; the tallyman to #487, whose fourth night holds its fight though the hole is on
    M9's ice (§4.2).

Owed elsewhere: MONSTERS §7.3 has anyone asleep a sleeper to the keepers, and nothing in the combat
lets one leave a sleeper be or tend it; it is the systems lane's to build if it is wanted.

Decided by delegate for #486, each the owner's to overturn:

1. **The way in is the notch's landing, 22,8, facing west,** the box's start and no exit; the way
   back up is 23,8 beside it, onto N8's 1,28 facing east, so that neither landing is an exit, as
   L6's gate and the towns' ways back are.
2. **The notch names the land in its own label** (N8's `NOTCH`: "Down through the notch to the
   frozen loch. Loch Fada."): `World.move` returns on an exit before it says the crossing (#166), so
   a jump says neither the name nor the warning, and a company under 20 is not warned on the way
   down. A small change in `World.move` is the systems lane's to make; the crossing words stay on
   Loch Fada's atlas row for L9's seam. Overtaken: a jump now says the crossing line after its label
   (SLICE, the line at a border), so the label is "Down through the notch to the frozen loch." and
   the loch's name and words follow it.
3. **No road crosses M9's north edge** (M8 parked): the atlas's road comes down the north-east
   diagonal, but here it starts at the landing under a cleft of the fells. The edge is the
   Rimefells, closed but for grass and pines at columns 0 to 4, and the north-east corner mountain,
   the shoulder that meets N8's.
4. **The gate, 18,8, is `GATE` and the lake wall's door, 13,10, `LAKE_DOOR`,** the inn yard's door
   onto the ice: drawn shut in the lodge's wall, with `m9_gate` and `m9_lake_door` for the town to
   drop. They lead to `rime_lodge` 14,8 and 7,14, guesses #487 may move; the ways back land on 19,8
   and 13,11.
5. **The coach yard is an event, as L6's was** (`m9_yard`, 20,7): the coachman and the coach's
   landing are the town's (#487; #539's 1, §4.3), as Kilnhaven's end is its town's. Nobody on M9
   sells passage, and `crossings.ts` owes nothing to #486.
6. **The loch's head is ice** from under the lake wall (row 11) to row 20, the ice-hole a ring of
   deep water at 12,14; a causeway at row 16 carries the drove road over it, then down the west
   shore and out at 0,20, where the atlas's road crosses. South of the ice the loch is open water.
7. **The atlas's farm at the loch's head and its mountain spur are redrawn:** the lodge's walls, the
   ice and the hills over the loch; along the east, ice at the glacier's foot (columns 26 to 28)
   under a mountain wall (29 to 31), closed against N9 (call 7).
8. **Seven groups for the brief's eight,** the fourth night's being #487's: snow lynx, four to a
   group, in three (by the landing, the gentlest; under the fells; south-east); ice pike, four, in
   two under the ice; ice bears, two, in two at the glacier's edge, the hardest. The harness gives
   9.6 fights to a rest (aim 8 to 10); groups of three gave 12.2.
9. **No floor is lowered:** the bear at 21 is the band's top over its floor 20.
10. **Two under is owed to #18** (`longmere_m9` and Rimewater, in the gate's `OWED`), as every Kilns
    and Cairnmoor box is: a company of 18 wins every fight in the act's gear.
11. **The milestone, 21,8, reads RIME LODGE 1, THE PASS 9:** the pass is 119 squares along the
    roads, to the high pass's link at 334,302, and 9 at 13 to the unit; the gate is 3 squares on,
    under a unit, so the stone says 1, the least it can (N8's notch fixes the landing 4 from it).
12. **The secret is §4.2's, not the issue's:** the hollow behind the glacier's bare face, hinted by
    `m9_glacier` and the lodge-keeper's "the glacier gives nothing back"; rock beside it so no
    climber reaches it over the glacier's mountains. The issue's fishing hut and cache are cut
    (§11).
13. **People, lines only, and no names:** a lodge-keeper at the hole's fire, a Lantern; a man on the
    shelf of ice under the hole's lip (#56's 41); a guide at the glacier's foot with her half-built
    cairn (43). #494 builds the quests on them.
14. **#45's three are the Lanterns' lamp by the gate** (a shrine, personality), **a cairn at the
    fells' foot** (320 gold and a great spell-point potion) **and the shore camp.** The lookout
    looks south down the loch's length: the loch runs south here, not west as the brief has it.
15. **Novel claims the cats and a group on ice** (`families: ['cats']`, `mechanics:
    ['encounter:under']`): snow and ice are Cairnmoor's. No landmark is claimed, the lodge's site
    staying planned for #487.
16. **The area's rooms, monsters and items come with it:** the six interiors leave `ROOMS_AHEAD` for
    the Area, the monsters `AHEAD` and the items `ITEMS_AHEAD`; those three lists and `PLANNED`
    stand empty.
17. **The climate is invented, colder than Cairnmoor's:** summer 10, winter -10, a daily swing of 6,
    damp 0.03 to 0.08, the wettest day 320, fog 0.5, lag 12.
18. **The reach holds no step:** the quest-step check skips the pillars' `REACH_ZONES`, Glacier Foot
    being a zone of a listed area now and §5 exempting it (DESIGN §9).
19. **A way taken between two zone maps is walked as a step** in the outdoors' reachability check;
    the "no exit joins one zone to the next" check names the notch's two ways, and the atlas's "exit
    and arrival are neighbours" check lets an exit take one of the atlas's own links between its
    ends.
20. **The Cairnfield is held in parked M8 by seeds** along its south edge (y 253, x 392 to 423,
    `cairnmoor/atlas.ts`): laid whole, M9 seeded Loch Fada up the Rimefells into most of M8. N9's
    north-west corner (x 424 to 426, y 254 to 259) goes from the Cairnfield to Loch Fada and is left
    so, N9 being Rimewater's (§4.8).
21. **Pay is the gate's, not the brief's:** 3,754 xp a member against the issue's 1,500 and §8's
    scaled 2,650. Rimewater stands at 3,754 of 16,267; with §8's scaled shares still to come, about
    13,650, at about 17,400, under 1.4 times the ask (22,774), so no group is cut.

Decided by delegate for #487, each the owner's to overturn:

1. **The nights are the inn's `nights`:** a stay sets the first of `night_1` to `night_4` not yet
   set, so they come in order (`stayNight` in `src/game/party.ts`, called by the inn's screen).
   Nothing set a flag on a rest before; the issue carries the systems lane.
2. **A night asks no clock past midnight** (the question §9 left for #487): a stay always sleeps to
   morning, so a stay is a night.
3. **Each night's arrivals are a once-event on 6,12,** the yard square outside the inn's door, the
   only way out of it, each standing until the next night is set: the square never says more than
   the log's four lines, and a company that stays twice without going out misses the first's words,
   never a flag.
4. **The hole's fight is on M9 at 12,13, `m9_night_4`,** on the ice over the hole (deep water at
   12,14), after `night_4`: a guardian, with no respawn, `roams: false` and a `slainText`. The group
   takes M9's prefix, since a zone map's ids share the outdoors' state.
5. **"The fire at the company's back" is staging, not a mechanic:** the keeper's fire at 14,14, east
   of the hole, and a company out of the inn's fourth stay fresh, as the gate judges it, one group
   and its call from fresh.
6. **The six knockers stay the Kilns' at 16:** the curve test now reads a caller's retinue (the kind
   its `calls` names, in its own group) at its own level, as it reads its calls, so the band check
   and the rise take the group's level from the tallyman, 20. No new def; no monster's level moved.
7. **Wenna is "A girl out of the hole" on M9 at 12,13,** there once `longmere_m9:m9_night_4` is
   slain, lines only (§4.3's line and §5's "two hundred more ... The doors know me."), setting
   `q_wenna_up`. No `until`: the door (#489, #490) and the lodge after the bay (#492) move her.
8. **The gate says §4.3's gate line going in,** as N3's gate says Anvilhall's; the lake door says
   the yard; the first step inside the gate, 13,8, says the stockade.
9. **The arrival squares stay M9's** (14,8, the town's start, facing west; 7,14, facing north): the
   town was laid round them. The ways back land on 19,8 facing east and 13,11 facing south, neither
   an exit.
10. **The coach lands in the coach house inside the gate,** 13,7 facing west, with a landing line;
    the coachman at 14,7 has `passage: sells('rime_lodge', DROVE_COACH)`, which sells nothing until
    Kilnhaven writes its landing (#469), and speaks of the overdue coach (40) either way.
11. **The hall is "The Lodge's Lantern Hall",** the Lanterns' (`hall: 'lanterns'`, so it teaches
    Linguist as every Lantern hall does), `maxTier: 7`, fee 500 (Thornhold's 200 at the fourth
    tier, the Watch's 400 at the sixth).
12. **No guild quest is added:** §6's first task, "keep the hole's fire a night", would be a second
    rank-0 Lanterns quest, and `rankOf` asks every quest of a rank, so every company that did
    Helmstow's first task would stay a stranger until Act III. It waits for #439, with the fourth
    rank's. Settled by #439: the hole's fire is dropped, the hall gives the ladder's own first task
    and the asks are the Luminary's, offered here as at every hall (§6; docs/areas/kilns.md §9,
    #439's 2 and 3).
13. **The rest of the town:** the inn "The Thaw" at 45 a member (Anvilhall's 35 at 16, the Watch's 30
    at 14); the temple "The Healer's House"; the furrier's the seven of `FURRIER`; the provisioner's
    Anvilhall's stores' list; "The Trainers' Yard" to 23 (the band's top plus one, as the check
    asks).
14. **No prestige trainer:** §4.3 places none at the lodge.
15. **People, lines only and no names, as M9's:** the coachman (40's coach overdue), a lodge-keeper
    (a Lantern), a stonecutter down the drove road (39) and a lodge woman whose people are under
    Fuar (42). The guide of 43 is not placed: M9's is already back from the glacier, so the lodge's
    guide before she goes is #494's to stage with 43's flags.
16. **No novel landmark is claimed:** the lodge's icon is on the road before (Deepthorn Lodge), and
    the check refuses it.
17. **The Kilns' first-machines rule is read only as far as the Kilns** (its walkthrough), since the
    hole puts machines on M9.
18. **Pay: no group is cut** (§8): 4,203 xp a member built and about 22,300 projected, under the
    limit of 22,774.
19. **The issue against the doc:** the issue sets the tallyman's fight at the lodge's fire; the doc
    puts it on M9's ice at the hole, and the doc won.

Decided by delegate for #488, each the owner's to overturn:

1. **The road keeps the atlas's line,** out by the south edge at 6,31 and 7,31 and on across parked
   L10's corner to K10: the atlas's road never enters K9, and the edge check holds a map's roads to
   the atlas beyond its edge (a road out of the west edge failed it, and so did closing the south
   edge). The brief's road west for K9 could not hold without editing the shared atlas.
2. **The road is taken from the south edge, not walked** (`PASS`, 6,31, as N8's notch is): L9 and
   K10 meet only at a corner, parked L10 between. It led to `coldmere_k10` at 31,4 (359,290), facing
   west, a guess at the atlas's road at K10's east edge, and was listed in no exits. Built (#491):
   it is listed, the landing is the bridge at 30,3 (358,289) and K10's way back lands on 7,31 facing
   north, which stays plain road (#491's 1).
3. **No road crosses the west edge:** it is the loch's ice at rows 0 and 1 and pines below, against
   K9 (#489). The crossing line (#166) falls there once K9 is laid in Loch Fuar, and the pass for
   K10 says it after its label; Loch Fuar's atlas row has no `crossing` words yet, so the engine's
   defaults speak until K9 writes them.
4. **Band 20–21, the floor lowered by one from the brief's 21:** nothing on the surface is 22, and
   a band of 21 alone would ask a hardest group at 22 (§7); as N2, N8, O8 and Carn Dubh. The bear,
   at 21, is the top.
5. **The brief's four groups, the lynx five to a group:** snow lynx by the road (20,21, the nearest
   and gentlest) and by the meadow (22,12); ice pike, four, under the loch's ice (5,1); an ice bear
   alone on the ridge's far side (5,24), the hardest. Four lynx gave 11.6 fights to a rest (aim 8
   to 10), five 9.27. The bear stays alone as the brief has it, though it is then the box's
   cheapest fight (29.8 fights to a rest); a pair, as M9's, is the owner's call.
6. **The pike lie off the woodcutters' camp, not by the road:** the atlas puts Loch Fada's water
   along the north rows, 15 rows off the road, so the loch is a walk north of it. The issue's
   narrows are not built (§11).
7. **The loch is ice** (#536) where the atlas has shallow; its deep, 11 squares in no zone, is left
   open water, the lead `l9_open` names, and the pine islet at 3,1 is kept.
8. **The stream** from M9's 0,2 to 0,4 runs from 31,2 to 31,4 to the north edge at 22 to 27,0, where
   the atlas's goes on into parked L8 (the edge check moved it from the scaffold's 25 to 28); a
   frozen ford at 29,1 and 29,2 joins the corner north of it to the box, which the density check
   found unreached.
9. **The secret is the brief's:** the drovers' summer shieling under the drift in the high meadow,
   a 3×3 of building with its door at 24,8, hinted by the posts (`l9_posts`, 25,8, the brief's
   line) on the square before it; inside, the drove's strongbox (1,100 gold and the Skinning Knife
   +1, #535). The issue's hollow pine and trapper's cache are not built (§11).
10. **The drover winters in a stone bothy by the road** (24,26; the bothy at 25 and 26,26) and
    hears the bell under the cold loch (#56's 42), a line only: the drovers' shieling under the
    snow is the secret, so nobody stands at it.
11. **#45's three:** the woodcutters' camp on the loch's shore (6,4), the drovers' stone by the
    road (a shrine, luck, 28,23) and a cairn on the crest (12,21: 300 gold and a great spell-point
    potion).
12. **The milestone at the saddle** (13,27) reads RIME LODGE 4, THE PASS 5, as the brief proposes
    and the walkthrough counts: 58 squares to the lodge's gate, 60 to the high pass's link at
    334,302 along the atlas's road beyond. M9's stone stays 1 and 9.
13. **The lookout on the crest** (10,22) is up a path of hills from the saddle, with the brief's
    line; the issue's shrine to the one who counts is the brief's plain shrine.
14. **Novel claims nothing** (the brief has nothing new here) and **no zone-walk seeds are added:**
    laid whole in Loch Fada, L9 moved nothing the zone checks pin.
15. **Pay is 2,128 xp a member** (10 lynx and 4 pike at 793 each, the bear's 1,667, over six)
    against the brief's 1,300 and §8's scaled 2,300. Rimewater stands at 6,332 of 16,267, Rime
    Lodge's share (#487) built; with §8's scaled shares still to come (K9 2,650, the bay 4,250, K10
    1,950 and the side quests 1,600: 10,450) at M9's ratio of 1.42, 14,840, it would stand at about
    21,170, under 1.4 times the ask (22,774), so no group is cut.
16. **Two under is owed to #18** (`longmere_l9`, in the gate's `OWED`), as M9's.

Decided by delegate for #489, each the owner's to overturn:

1. **Band 20–22, the floor lowered by one from the brief's 21:** at 21–22 the curve asks a hardest
   group at 22 and nothing on the surface is; at 20–22 the bear pairs at 21 are the top, as N2, N8,
   O8, Carn Dubh and L9. The atlas row stays 21–22: the zone takes its band from its built map.
2. **The loch is the doc's, laid on the atlas's ground:** the cut holds no lake (§4.5). The north's
   deep stays open water and its shallows are ice; the river is frozen and widened into the basin
   the brief needs. About 115 land squares became ice, and the edges keep the atlas's ground.
3. **The door is `DOOR`, 24,30,** the scaffold's square and the atlas's enter link at 352,284:
   exported, listed in no exits, `needFlag` `WENNA_UP`, to `sleepers_bay` 8,1 facing south, a guess
   #490 may move. It is drawn shut, a `#` in a wall of grey; `k9_door` says the brief's line.
4. **The lock is not signed in:** the pillars check finds locks only on exits a map lists, so a row
   in `content/locks.ts` for an exit listed nowhere fails as closing nothing there. The lock and
   §5's paragraph on it are #490's, with the exit and #440.
5. **The girl out of the hole waits at the door,** on the crack at 24,28 once `q_wenna_up` is set,
   with §5's lines and nothing set; "it opens" is left to #490's exit label. M9's girl takes an
   `until` on the flag (#487's 7): met once, she goes back down, never in two places.
6. **Eight groups, the brief's number:** lynx four times in the shore's pines, pike twice under the
   arm's ice (one over the tower by night) and bears in pairs, the hardest. Five lynx to every lynx
   group gave 7.69 fights to a rest, under the aim of 8; the two far groups at four give 8.54.
7. **Pay is 4,547 xp a member** (18 lynx and 8 pike at 793, 4 bears at 1,667, over six), against
   the brief's 1,500 and §8's scaled 2,650: the brief's eight groups and its figure never agreed. No
   group is cut, the projection at M9's ratio being under 1.4 times the ask (§8).
8. **The smith's iron** (`k9_iron`, 12,18): 800 gold, the Bear Spear +1 and **Lann Fuar**, off the
   ladder: *lann*, the hill folk's blade (not yet in NAMES §2's row) and Fuar, the village the loch
   came up over. A martial blade, 2d10 +6 for 2,000 gold, a sidegrade of the Ice Axe +1; its smith's
   mark is a little bell.
9. **The secret is the brief's:** stones under a clear strip run west from the tower's cap to the
   bank (14 to 19, row 18), `k9_strip` (16,18) says its line, the bank's face is a secret door at
   13,18 and the hole 12,18 behind it. The issue's bell tower door is not built (§11).
10. **#45's three:** a fowlers' camp on the north shore (12,9), a cairn on the old bank (13,16: 300
    gold and a great spell-point potion, as L9's) and a shrine on the south shore (17,25,
    endurance).
11. **The lookout is on a knoll added east over the ice** (hills at 26 to 28, rows 10 to 12, event
    27,11): the cut has no hills east.
12. **The bell tower's cap is a building square, 20,18,** its line on 20,17; the house-place is a
    hearth-stone swept clean at 9,18, above the bank. Lines only: the bell is #494's 42.
13. **Loch Fuar's crossing words are written** on its atlas row, as Loch Fada's: the cold loch
    white below and the land harder than the long loch's shore, two under; black ice that would
    spare no one and the way back east under the pines still open, three under.
14. **The zone's road** (`ROADS` in `tools/tests/gate.ts`, which the gate failed without): the
    lynx by the way in and the lynx at the loch's foot, on the way to the crack.
15. **Core density,** the brief's, not the scaffold's country; **novel claims nothing,** the lock
    and the dungeon from the ice being the bay's to claim when its exit is listed.
16. **Two under is owed to #18** (`coldmere_k9`, in the gate's `OWED`), as M9's and L9's.
17. **K10 meets K9's south row** and finds the atlas's lake under its own box: K9's loch lies on the
    river that feeds the lake, which lies in K10 and L10 (352 to 368 by 294 to 326). The edge is
    pinned (§4.5, §4.7); the world map paints the atlas's river over K9's ice. Built (#491's 4 and
    5).
18. **The bay makes the door and its planned place one:** `PLACES`' planned `sleepers_bay` stands
    at 352,290 (K10's 24,4), while the atlas's enter link and §4.5 put the door at 352,284 (K9's
    24,30). Harmless while planned; #490 lists the exit, signs the lock in and moves one or the
    other (§4.6, §11).
19. **The bay and K10 together may pay at most about 9,895 xp a member** (§8): the line, 22,774,
    less 11,279 (K9 built and #439's 400) and the side quests' 1,600. Each builder cuts groups of
    its own box, the least valuable first, rather than pass it.

Decided by delegate for #490, each the owner's to overturn (1 to 4 complete #489's door half, the
exit and the lock):

1. **The door is K9's `DOOR`, listed:** in `coldmere_k9`'s `exits`, its square opened (`#` to `D`,
   row 30), `k9_door` dropped, its `blockedText` the reason said at the door. Its landing, the
   bay's 8,1 facing south, is kept: it is still in the ice, and it looks straight down the stair
   (#489's 3).
2. **The way back up is a door in the stair's north wall,** 8,0, onto K9's 24,29 facing north, the
   crack's foot, since a landing is never itself an exit. The girl's lines at 24,28 are K9's,
   untouched.
3. **The lock (#440) is signed in** at `coldmere_k9` 24,30 on `q_wenna_up`, with its what and why
   in `src/content/locks.ts`: Act III's one. §5's "not signed in" is its as-built paragraph now
   (#489's 4).
4. **#440's fixture** is in `tools/tests/pillars.ts`: a fixture exit from a Loch Fuar map into a
   Monks' Vale map shut on `q_wenna_up` fails "a lock between rimewater and whitespine", signed in
   or not, and the atlas's `coldmere`-`monksvale` link given `opens` fails "no way on the atlas
   opens on the story" (that check made the function `storyWays` so a fixture can be held to it).
   The pass itself stays open, and its exit is K10's (built open; the way on into J11 is #499's,
   #491's 2).
5. **The bay on the atlas is the door's square:** `PLACES`' `sleepers_bay` moves from 352,290 to
   352,284 and drops its `planned`, `name` and `band`, as Carn Dubh's did; `sleepers_bay2` stands at
   352,290, six below. No `SITES` row: the secret is found (§10). The atlas's `enter` link is
   untouched (#489's 18).
6. **The stair's band is 20–22, the floor lowered by one:** nothing on it is 22, and at 21–22 the
   curve asks a hardest group at 22, where at 20–22 the first keeper, 21, is its top. The bay's is
   21–22, the Matron's 22.
7. **The names:** the stair is *Under Loch Fuar*, as Carn Dubh's is *Under Carn Dubh* (the place's
   plate does not name the bay), and the bay *The Sleepers' Bay* (§10).
8. **The stair's knockers come in two crews of three tallymen and five knockers,** the brief's two
   groups with sizes past the brief's. A tallyman leads, so the knockers stand at its level (the
   curve reads a caller's retinue so; alone, knockers at 16 are astray in 20–22). At one tallyman
   and five knockers the stair was 15.0 fights to a rest, past the limit of 12.5; at eight knockers
   still 14.0; at two tallymen 10.9; at three, 9.64.
9. **The first keeper waits alone at the stair's foot** (6,12), the brief's: it is 30 fights to a
   rest alone, which the crews above it carry.
10. **The bay's keepers are four to a row, three rows,** past the brief's three a group: at three
    the bay was 14.4 fights to a rest, past the limit of 12.75; at five, 7.3, under the aim; at
    four, 9.16.
11. **The Matron is alone in the last row** (10,3), off the boss line as the Foreman and the Cairn
    King are: 1,900 hit points and 17d8+18, from 1,299 and 22d8+27 (won 79% at 21 and 93% at 23),
    and she mends herself one turn in ten, the brief's boss that mends, which #495's 6 left to the
    bay (at one in four she was easier and the curve flatter). She is won 59% at 21 and 92% at 23
    under the gate's fifteen-round cap; more hit points with a lighter blow broke the fight off at
    the cap.
12. **Pay is 5,455 xp a member,** under the 6,400 the bay may take (§8): nothing is cut. The
    brief's "about eight groups a level" is not met, its own list naming five fights; seven groups
    are built.
13. **Rimewater's owed row loses its xp:** a clear now gives 16,734 of the 16,267 asked, and the
    curve test asks the entry dropped. Gold stays owed, 5,820 of 9,840.
14. **The Matron's part is her cap** (`matron_cap`, dropped always, price 0), as machines carry
    parts and no gold: a loop inside a loop worn in its band, Wenna's family knot, the Mines' mark
    at a girl's shoulder seen again (STORY; docs/areas/kilns.md §9).
15. **The locker's two are named in the hill folk's tongue** (§10; NAMES §2): **Bogha Fionn +1**,
    the white bow (`hunters_bow+1`, *bogha* a bow) and **Luireach Dubh +4**, the black mail
    (`plate+4`, *luireach* a coat of mail). The ids stay, so the ladder's rows only lose `#490`.
    **The sleepers' ring is cut:** no name came that did not tell the secret (§11).
16. **The secret is the brief's:** the path worn up the middle at x 7 runs past the last row to the
    back wall; `sb2_path` (7,3) says the brief's line, the wall is a secret door at 7,2 and the
    locker 6 to 8 on row 1 behind it, with 1,500 gold and the two pieces. Walked, it is reached
    only through the wall. The issue's, a bed with a name the company knows, hinted by the Cargo
    Ledger's column, is not built: the doc wins (§11).
17. **The back door is a wall with a door in it** (legend `Z`, 3,2), as CREW ONLY is: no flag, no
    lock, no exit. The Kiln-script over it, `sb2_back` (3,3), reads COLD STORE. WAKE IN ORDER.
18. **The beds are pillars,** forty, four rows of ten, the path between them.
19. **Novelty claims the keepers** (a family). `inflict:asleep` is on the road before it (the check
    refused it), and a lock or a dungeon entered from the ice is no kind the check knows, so
    neither is claimed.
20. **Two under is owed to #18** (`sleepers_bay: under`, as K9's); the bay's own is n/a, its floor
    being over the area's.
21. **The stair's days end in a fight broken off 42.3% of the time,** recorded and not tuned: the
    gate asks no figure of it, and it is most likely the bot against the mending keeper and the
    crews. The bay's is 17%. Left so that the owner can have it tuned later (§8).
22. **MONSTERS §7.3's Where column says what §7 proposed,** in this pull request: the Ice Bear on
    L9's ridge (#488) and K9's far shore (#489), and the tallyman and the knockers on the bay's
    stair as well as the ice-hole and the Deep Mines. The owner may keep the column as it was.
23. **K10 may pay at most about 4,440 xp a member** (§8): the line, 22,774, less 16,734 (the bay
    built, #439's 400 counted) and the side quests' 1,600. K10 cuts groups of its own box, the least
    valuable first, rather than pass it. It paid 4,311 (#491's 8).

Decided by delegate for #491, each the owner's to overturn:

1. **The way in is L9's `PASS`, its landing moved to the bridge at 30,3,** facing west, from the
   guess 31,4 (#488's 2): the edge check holds the road to the atlas beyond, and the atlas's road
   leaves K10's east edge at 360,289 (row 3), not 290. The way back, `RIDGE`, is the road's last
   square, 31,3, beside the landing (a landing is never an exit), and lands on L9's 7,31 facing
   north. L9 lists `PASS`; both are taken, not walked, as N8's notch is. The words that called the
   landing a guess are gone from L9's file and from §4.4, §4.7, §9 and §11.
2. **The road keeps the atlas's line:** in over the lake's river on split logs (30,3) and out by the
   west edge at 0,19 only, the atlas beyond 0,18 being pine, so that 0,18 is a hill. Four joint
   squares (26,5; 18,8; 9,12; 7,13) are added so that it runs square to square, and the river is
   moved off the east edge at rows 4 to 6, the atlas beyond being pine (the edge check).
3. **Band 20–22, the floor lowered by two from the brief's 22:** the curve asks the hardest group at
   the floor plus one or the top less two, whichever is more, and nothing on the surface is 22 (the
   bear, 21, is the top); at 21 it would ask 22. As N2, N8, O8, Carn Dubh, L9 and K9. No monster def
   is added. The issue's "gate holds at 22" is the gate at 20.
4. **The north edge is K9's south row square for square** (`ppppppppppppp^,,,,,,,iiiiiiii~pp`): the
   loch's ice runs a tongue three rows into K10 and the river from the lake goes in under it at 29,0
   (§4.5; #489's 17).
5. **The atlas's lake is taken as it is,** its deep water open and its shallows iced (#536); the
   river from the lake to the loch stays open water.
6. **The pass's walls are mountains,** either side of the road west of the mouth, with hills and
   snow beside it: the brief's "two walls of rock" over the issue's "all walkable", the doc winning.
   At the west edge they are the map's ring, so void in the outdoors.
7. **The brief's eight groups:** snow lynx three times (by the bridge, by the lamp and south of the
   pass's foot), ice pike twice under the shore ice (on ice, `under: 'ice'`) and ice bears in pairs
   three times at the top, the roster's question taken as K9 took it (§7), with MONSTERS §7.3's
   Where column for the Ice Bear gaining the pass, as the bay's pull request gave it the shores. The
   lynx are four to a group, not K9's five: one group of five would pay 4,442 xp, over the 4,440
   line.
8. **Pay is 4,311 xp a member** (25,862 over six), under the 4,440 the bay's budget left (§8):
   nothing of the brief is cut, only the lynx groups are sized at four. Rimewater stands at 21,045
   of the 16,267 asked, under 1.4 times it (22,774).
9. **The milestone, 9,13, reads RIME LODGE 9, MONKS' VALE 6,** the doc's figures and true there: 112
   squares along the roads to the lodge's gate and 72 over the pass to the road's end at the monks'
   gate in Monks' Vale (the atlas's enter link to Highcell, 322,342). 9,12 and 9,13 are the only
   road squares where both figures hold. The walkthrough counts it as L9's is counted, `counted`
   given an optional target (THE PASS by default).
10. **The step is `k10_mouth`,** at the mouth (5,15), the doc's line, `once`: the chapter reads it
    by `seen` (§5).
11. **The pilgrims are lines only** (#494's 44): `k10_pilgrims` in the snow below the mouth (9,18),
    one dying; the new graves by the road (`k10_graves`, 13,8) likewise. No person, no flag, no
    quest; the brother and the words are #494's. 12. **The secret is the doc's:** the dark lamp
    `k10_lamp` on the road (16,10), the doc's line, is the hint; its jar-shelf is the secret square
    (16,11) and the cache behind it (16,12, `k10_cache`, the chest `k10_silver`, 900 gold and a
    Guide's Staff +1) is shut in rock, so no climber reaches it. Its line says what is found and no
    more. The issue's waymark in the old script, with a cache under it, is not built (§11). 13.
    **Gold is 1,200:** the cache's 900 and a cairn's 300 (`k10_cairn`, a great spell-point potion,
    as K9's and L9's cairns). The clear holds 6,720 of the 9,840, 7,020 with the ask (#439), which
    the curve's owed row keeps. 14. **Core density,** the brief's; **novel claims nothing:** a
    landmark claim is an atlas site's icon, and the pass is no site. 15. **`ROADS.coldmere` stays
    K9's:** the gate names a zone's road once and did not ask for K10's, and K10's lynx added would
    make the zone's road four fights without a rest. 16. **Two under is owed to #18**
    (`coldmere_k10: under`, in the gate's `OWED`), as K9's. 17. **Smaller:** the map is named *Loch
    Fuar*, the zone's, as K9's; the shrine's stat is accuracy, not yet given in Rimewater; the
    trappers' camp is the brief's camp (#45); the cache's staff keeps the ladder's plain name,
    Guide's Staff +1 (#535's 3). 18. **The side quests and the chapter may pay at most about 1,729
    xp a member between them** (§8): the line, 22,774, less 21,045 (K10 built, #439's 400 counted).
    The quests' brief is 1,600. Each cuts its own, the least valuable first, rather than pass it.

Decided by delegate for #492, each the owner's to overturn:

1. **The chapter is `sleepers`, The Sleepers,** the working title kept, in `chapter.ts`, joined
   after The Ring since Rimewater follows Cairnmoor in `AREAS`. It is begun on M9 (`visited`), as
   The Ring is on N7, so it begins where The Ring ends.
2. **Nine entries and five goals, as §5 has them.** A night's entry reads the inn's flag, not the
   morning's event: a company that stays twice without going out misses a morning's words (#487's
   3), never a night. The hole and the girl are one entry, on `q_wenna_up`; the door's reads the
   stair reached (`visited` `sleepers_bay`), so it is written only through the door, never before
   the girl. Before her flag the door is the lock's, its reason on it, and the journal says nothing.
3. **The beds set a flag, `q_sleepers_seen`,** as O7's voice sets The Ring's: a condition holds one
   `seen`, and the end asks two, the beds and the pass's mouth. The sleepers' entry reads the beds
   by `seen`; the south's entry and the end read the flag and `k10_mouth`. No system is changed.
4. **The end is the beds and the mouth, in either order.** With the pass taken first the journal
   says nothing of it until the beds, which end the chapter there. The Matron is no step. Nothing in
   the game marks an act, so the chapter's end is the act's and nothing more is set.
5. **The journal leaves the girl unnamed,** as her lines do: a company that carried Hild's name from
   Gullwick (the Shelf's chapter) makes the match itself.
6. **The door's label says the voice's word:** "The door opens under her palm, and a voice in the
   wall says "Captain?" She flinches, and waits at it while you go down.", two lines of the log. The
   journal's door says the word, and every company now sees it: her own lines at the door, #489's
   and untouched, are heard only by a company that talks to her, and the stair's voice is on its
   west way alone.
7. **Back up from the beds she speaks at the door, and then she is at the lodge:** a word of K9's
   girl, `after` the beds' flag, sets `q_wenna_lodge`; K9's girl goes `until` it and a girl by the
   yard's fire at Rime Lodge, 10,13, comes `after` it, as M9's girl hands on to K9's on
   `q_wenna_up`. Her `until` on the beds alone would take her from the door before she could speak
   there, so her words set the one new flag. No entry reads it, so nothing she says is written into
   a chapter done. At the door: the two hundred marched on south, under the world, for the
   mountains and the sea (STORY, Act Four); at the lodge: she goes home to her mother when they are
   brought up, not before. She is unnamed in every line.
8. **The south's entry says what is seen,** the two hundred not in the beds and the pass's snow
   trodden, and not her words, since with the pass taken first it is written at the beds, before she
   speaks. Its goal points up the road from Loch Fuar to the pass's mouth on K10.
9. **The chapter pays nothing,** as no chapter does, so the side quests (#494) have the 1,729 alone
   (§8). `tools/tests/quests.ts` drops `longmere` and `coldmere` from `PLANNED` and Rimewater from
   `CHAPTER_OWED`.
10. **The walkthrough, `theSleepers`,** plays it at 20 (the four nights stood at the inn and paid at
    its price, the hole fought, the girl met), 21 (the door) and 22 (the stair's foot, the beds, the
    mouth), in order and with the pass's mouth reached first. The bay's groups are left to
    `sleepersBay`, which wins them; the Matron is not fought, the chapter not needing her. Every
    goal comes up, the chapter reads the same both ways and it ends once.

Decided by delegate for #494, each the owner's to overturn:

1. **The five are `coach`, `wentback`, `icebell`, `sky` and `pilgrims`,** in `quests.ts`, each given
   by its person, finished at its level (40 at 20, 41 and 42 at 21, 43 and 44 at 22) and walked
   every way it is answered. 42's is `icebell`, and its flags `q_icebell`, because `bell` and
   `q_bell` are the Shelf's.
2. **Two titles lose a word:** The Coach That Never Came and Where the Sky Meets Ice. #56's own run
   a pixel past the log's list (173 of 172).
3. **40's hand-in is a note.** The man in the healer's coat by the coach writes it; the coachman
   takes it at the first meeting (#43), pays 200 and sends the sledge, and the two from the coach
   move by `after` and `until`. The question is put at the lodge, so its pay is Rimewater's.
4. **The man in the healer's coat is shown, not named:** salt on his hem, a sleeper for the lodge,
   and back up the road alone. In the healer's house she is out of sight: a person on its one
   square of yard would shut its door.
5. **41 hears either:** Hale's token carried, or the clerk's book read (`seen` its chest). Both are
   reachable, and nothing is taken. A company with neither leaves him silent and 41 open.
6. **42 has no clapper to carry.** The clapper is a once-event by night beside the pike over the
   cap, `after` the woman's ask; the bell's lip is a sign, since a sign wears no presence, read by
   day or night. Her ask waits on 40's answer, as §6 has it. Her pay is a question: out to Fuar, or
   stay.
7. **43's mark is a reading's.** No person can mark the world map, and only a reading's `marks` names
   a place in the void, for a company with a reader. So the guide draws the way in words, and the
   old marks at the ice's edge, beside where the quest ends, put the Ice Caves on the world map once
   read (§11).
8. **43's guide is staged:** by the lodge's gate until she goes up (`q_sky`), then at the glacier's
   foot with her cairn (both `after` it), carried in when met (`q_sky_in`) and at the inn yard's fire
   after. Handing her the map is her one question, and pays. M9's walkthrough finds nobody at the
   glacier's foot before she goes.
9. **44's brother comes once the pilgrims are met,** beside the boy, and is no fight: snow on a
   freezing boy and a hand that does not bleed, with nothing said of either. The monastery's
   pilgrims stand `after` `q_pilgrims_up` (#445).
10. **39 ends at the lodge:** its stonecutter stands `after` `q_faces_home`, so never on the tors and
    at the lodge at once.
11. **Pay is §8's scaled 1,600 a member:** 300 for 40, 41 and 42, 350 for 43 and 44, every answer
    alike. A clear gives 22,645, 129 under the line; gold 7,220 with the note's 200.

## 10. Names

Rimewater's naming pass, by the rules of `docs/NAMES.md`, chosen for #435. The lodge-keepers are
hill folk who share a tongue with Cairnmoor's, modelled on Scots Gaelic, the speech of lochs and
bens: short parts, spelled as they are said, with no accent the font lacks. *Carn* a cairn, *creag*
a crag, *loch* a lake, *moine* a moss or bog, *tulach* a knoll, *dubh* black, *fionn* white or fair,
*beinn* a mountain, *allt* a burn, *clach* a stone, *fuar* cold, *fada* long, *eas* a waterfall,
*ceann* a head, *lios* an enclosure. Its finds add *lann* a blade, *bogha* a bow and *luireach* a
coat of mail. It goes into NAMES §2's row for the hill folk, Cairnmoor's and Rimewater's together.

- **The names:**

  | Was | Now | What it means | Also thought of |
  |---|---|---|---|
  | Longmere | Loch Fada | the long loch: the zone, named for its water | Loch Mor, the great loch |
  | Coldmere | Loch Fuar | the cold loch: the zone, and the loch the bay lies under | Loch Dubh, the black loch, for its ice |

- **Kept:** Rimewater and Rime Lodge, the Lanterns' English for the area and the lodge they keep,
  which the story leans on (DESIGN §7, §9); Glacier Foot and the Ice Caves, the reach's, to be named
  in Phase 1.6 with the reach; the Sleepers' Bay, the docs' plain name for a plain thing, as the
  Drowned Temples are, since nothing on the surface names it and no site paints it: the secret is
  found; the Rimefells and the high pass, the plan's, names on borders Rimewater shares. The old
  names stand in brackets at first mention above, and the epic's titles keep them until they are
  edited (NAMES §3).
- **Ids stay:** `longmere` and `coldmere`, as `harrow` is Helmstow (NAMES §3). The town, the bay and
  the caves are named as they are planned.
- **The finds,** in the same tongue: K9's smith's blade is **Lann Fuar**, *lann* the hill folk's
  blade and Fuar the village the loch came up over (#489's 8; *lann* was missing from the words
  above and from NAMES §2, and #490 adds it to both). The locker's two, off the ladder's plain
  names, are **Bogha Fionn +1**, the white bow (the Hunter's Bow +1) and **Luireach Dubh +4**, the
  black mail (the Plate Mail +4); their ids stay (#490's 15). The Matron's Cap is plain English, a
  machine's part. The sleepers' ring has no name: none came that did not tell the secret, and it is
  cut (§11).
- **The stair** is *Under Loch Fuar*, as Carn Dubh's is *Under Carn Dubh*, since nothing on the
  surface names the bay; the lower level keeps the docs' plain name (#490's 7).

## 11. What was cut

- **Glacier Foot whole,** N10, O9, N11 and O10: 2,766 squares of land, 1,775 a company could walk,
  N10 795 (783) with its snow 169 and ice 56, O9 729 (442), N11 639 (279) with the Ice Caves' way in
  at 452,326, and O10 603 (271). The reach (DESIGN §9), off the quest and optional by design, void
  until Phase 1.6 (call 7). Its slivers in Loch Fada's boxes behind the road (255, 106, 52 and 61)
  are built closed with them when #497 is unparked, as J4 painted its dead wood over
  (docs/areas/sunderwood.md §9).
- **L12 and I9:** 566 squares, 81 walkable, the rim's mountain south of Loch Fuar and the mountain
  west of J9, with nothing on the atlas or in the docs.
- **The slivers** in the Whitespine's and Cairnmoor's boxes: J10 149, K12 129, I8 118, J8 83 and L8
  67, 546 squares of mountain and pine under the rim and the Rimefells, which those areas' boxes
  take or leave as the Downs took the Edge's foot (docs/areas/shelf.md §1).

About 3,900 squares void, 2,766 of them the reach's, to come back with Phase 1.6. The country
behind the road, 5,958 squares in seven boxes (§4.8), is parked and not cut (#497, call 10).

Cut from a brief as built (§4):

- **The issue's fishing hut and cache,** its draft of M9's secret, on the frozen inlet: the guide's
  hollow behind the glacier's bare face stands in their place, as §4.2 has it (#486's 12).
- **The issue's hollow pine, trapper's cache and woodcutters' hint,** its draft of L9's secret: the
  drovers' shieling under the drift stands in their place, as §4.4 has it (#488's 9).
- **The issue's narrows,** where the pike would lie by the road: the loch is 15 rows off it on the
  atlas, so they lie under the ice off the woodcutters' camp (#488's 6).
- **The issue's bell tower door,** its draft of K9's secret: the smith's hole under the old bank
  stands in its place, as §4.5 has it (#489's 9).
- **The issue's road leaving west,** the pass road through K9: the atlas's road never enters K9
  (#488's 1), so none is built, and the pass is K10's.
- **The issue's one ice bear:** bears in pairs on the far shore and its hills stand in its place, as
  §4.5 has them (#489's 6).
- **The issue's secret,** a bed with a name the company knows, hinted by the Cargo Ledger's column:
  the locker behind the last row stands in its place, as §4.6 has it (#490's 16).
- **The sleepers' ring,** one of the sleepers' own in the locker, for the owner to name or cut: cut,
  no name coming that did not tell the secret (#490's 15).
- **The brief's "about eight groups a level":** its own list names five fights, and seven groups are
  built, three on the stair and four in the bay (#490's 12).
- **The issue's waymark in the old script,** with a cache under it: the dark lamp's jar-shelf and
  the cache behind it stand in its place, as §4.7 has them (#491's 12).
- **The issue's "all walkable" pass:** the walls are mountain, as §4.7's "two walls of rock" has
  them (#491's 6).

Owed by Rime Lodge as built (#487, §4.3):

- **To #439, settled:** the Lanterns' fourth rank and its quests are built, one ladder over the four
  halls (§6). The hole's fire as a first task, left out of the hall because it would be a second
  rank-0 quest and keep every company that did Helmstow's first task a stranger until Act III
  (#487's 12), is dropped, and with it the rule a hall's own first task would need
  (docs/areas/kilns.md §9, #439's 3).
- **To #469, done:** Kilnhaven's end of the coach, its landing and its seller are written
  (docs/areas/kilns.md §4.14), so the coachman sells the run and the passage check holds both ends.
  The gate counts the town's ways out onto M9 as landings and holds the nearest groups to the
  gentlest (#539's 4): the pike beside the lake door's landing, 13,12, is won every time at 18 with
  the lynx, and nothing moves.
- **To #492 and #494:** the chapter's entries on the nights and on Wenna, and her place at the lodge
  after the bay (#492); the words of 39, 40, 42 and 43 on the people placed, and the lodge's guide
  before she goes (#494). The chapter's are built: an entry a night, hers on the fourth and her
  place by the yard's fire after she speaks at the door (§5; #492's 2 and 7). The side quests' are
  built: the words of 39, 40, 42 and 43, with the guide by the gate before she goes (§6; #494's 8
  and 10).
- **To #489 and #490:** Wenna's `until` at the hole, and her place at the door. K9 built both
  (§4.5, §5) and the bay the door's exit (§4.6, §5).

Owed to the boxes beside L9 as built (§4.4, §4.7):

- **K10 lists L9's pass,** `PASS`, in L9's exits and adds the way back onto L9's 7,31 facing north;
  the landing, `coldmere_k10` at 31,4, was a guess for it to move (#488's 2). Built, the landing
  moved to 30,3 (§4.7; #491's 1).
- **K9 puts dry land on its column 31** at rows 2 to 31 against L9's pines and writes Loch
  Fuar's `crossing` words (#488's 3). Built (§4.5; #489's 13).

Owed to the boxes beside K9 as built (§4.5, §4.6, §4.7):

- **To #490:** the door's exit. `DOOR` (K9's 24,30, flag `q_wenna_up`) was exported and listed in no
  exits; the bay lists it in K9's exits, opens the square (`#` to `D`), drops `k9_door` and adds the
  way back onto K9's 24,29, its landing the stair's 8,1 facing south kept (#489's 3). **The lock**
  in `content/locks.ts`, and the lock's paragraph in §5, are the bay's with the exit and #440: the
  pillars check finds locks only on exits a map lists (#489's 4). `PLACES`' planned `sleepers_bay`
  (352,290) and the door (352,284) become one (#489's 18). Built (§4.6, §5; #490's 1 to 5).
- **To #491:** K10's north edge meets K9's south row, pinned, and K10's builder finds the atlas's
  lake under its own box (#489's 17). Built (§4.7; #491's 4 and 5).
- **To #494:** the bell under the ice (#56's 42). K9 places the tower's cap, the pike over it by
  night and the house-place, lines only; the bell, its clapper and the words are #494's. Built:
  the bell's lip and the clapper by the cap, with the lodge woman at the house-place once it has
  rung (§6; #494's 6).
- **To a pull request of its own,** if the owner takes the shores: MONSTERS §7.3's Where column for
  the Ice Bear, which says the glacier's edge only (§7). Done in #490's, with the tallyman's and
  the knockers' (#490's 22).

Owed to the boxes and the chapter beside the bay as built (§4.6, §5, §8):

- **To #491:** K10 and the pass. K10 may pay at most about 4,440 xp a member (§8; #490's 23). The
  pass is open from the start, and #440's fixture holds it so (§5). Built, at 4,311 (§4.7, §8;
  #491's 8).
- **To #492:** the chapter's entries on the door and the sleepers (§5), on the ids the bay leaves.
  `seen`, as map:id: the door's inside `sleepers_bay:sb1_door`; the voice's wall
  `sleepers_bay:sb1_voice`; the stair `sb1_ice`, `sb1_light`, `sb1_water`, `sb1_tallies` and
  `sb1_foot`; the first bed and the beds `sleepers_bay2:sb2_beds` (the brief's step line); the
  stair's foot `sb2_stair`; the rows `sleepers_bay2:sb2_row1`, `sb2_row2` and `sb2_row3`; the path
  `sb2_path`; the locker `sleepers_bay2:sb2_locker`; the back door's reading is kept as `sb2_back`
  once read. `slain`: `sleepers_bay2:sb2_matron`, no respawn, her cap `matron_cap` dropped. Wenna is
  K9's "The girl out of the hole" at 24,28, `after` `q_wenna_up` with no `until`: she waits at the
  door and goes down with nobody (no hirelings, call 6), unnamed in every line. Her place at the
  lodge after the bay is the chapter's. Built: the door's entry reads the stair reached and the
  sleepers' `sb2_beds`, which now sets `q_sleepers_seen`; back up, she speaks at the door and then
  is at the lodge, her words setting the flag that moves her (§5; #492's 2, 3 and 7).
- **To #494:** nothing placed in the bay; the bell under the ice (above) and the words of 39, 40, 42
  and 43 stay its own. Built (§6).

Owed to the chapter, the side quests and the boxes beside K10 as built (§4.7, §5, §6, §8):

- **To #492:** the chapter's last entry, on the step. `seen`, as map:id: `coldmere_k10:k10_mouth`,
  an event at 5,15, `once`; its goal points over the pass, which is open from the start (§5). The
  chapter and the side quests may pay at most about 1,729 xp a member between them (§8; #491's 18).
  Built: the south's entry and the end read it with the beds' flag, and the chapter pays nothing
  (§5, §8; #492's 3 and 9). Its goal stops at the mouth, the road's end, until J11 is laid and the
  Whitespine's chapter takes it on over the pass (#499, #505).
- **To #494:** quest 44, The Pilgrims in the Pass, on the ids K10 leaves, lines only:
  `k10_pilgrims`, an event at K10 9,18, in the snow below the mouth (snow at rows 16 to 20, columns
  6 to 11: room for the pilgrims and the dying one); `k10_graves`, an event at 13,8 by the road,
  three new mounds with red cloth; the mouth, `k10_mouth`, at 5,15. The brother is #494's, and the
  words of both: he comes down the road from the west edge, 0,19, between the walls to the mouth.
  The cache's tally (`k10_cache`, 16,12: many up the pass, fewer down) is a line only, for #494 to
  use or leave. Built: the pilgrims, the boy and the brother as people below the mouth, the brother
  come once they are met; once they go, their camp is a cold fire-ring (`k10_camp`). The graves and
  the tally are left as they stand (§6; #494's 9).

Owed by the side quests as built (§6):

- **To #445:** the pilgrims at the monastery, `after` `q_pilgrims_up`; turned back, they are at the
  lodge (`q_pilgrims_back`).
- **To #469, done:** the coach sells since Kilnhaven landed (docs/areas/kilns.md §4.14); 41's man
  still goes home on it in words only.
- **To the systems lane, if it is wanted:** a mark on the world map for every company. 43's guide
  draws the way in words; only a reader puts the Ice Caves on the map, by the old marks at the
  ice's edge (#494's 7).
- **To Phase 1.6:** the stairs the guide's party went up where the sky meets the ice, and the Ice
  Caves the marks name (call 7).
- **To #499 and #497:** K10's east, west and south edges end the world against parked L10, J10 and
  K11, pinned in `tools/tests/outdoors.ts` with void past them. The road leaves by the west edge at
  0,19 (328,305) against the atlas's at 327,305, which goes on over J10's corner to the link's
  318,318 in J11: #499 lays J11, joins them and moves the pin; #497 does the same for L10 and K11 if
  it is unparked. Built for J11: the saddle lands on J11's 20,1, the pin moved (#499).
