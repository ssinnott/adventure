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

Its first box is built, M9, Rime Lodge's box (#486, §4.2), which lists the area, and so is the town
behind its gate, Rime Lodge (#487, §4.3); the bay's keepers are drawn (§3), and the rest is to
build. Its content is
`src/content/areas/rimewater/` (maps, monsters, items, climate, its part of the world map and its
walkthrough; its chapter of the one quest, The Sleepers, in `chapter.ts`, its side quests in
`quests.ts` and the Lanterns' quests in `guilds.ts`, to come), and its businesses' rooms are
`src/ui/interiors/rimewater/`. Its ids: the area `rimewater`, its zones `longmere`, `coldmere` and
`glacierfoot`, the town `rime_lodge`, the bay `sleepers_bay` and the reach's `ice_caves`. The zones
are renamed in §10 and keep their ids (NAMES §3).

---

## 1. Where it is

The atlas (`src/content/areas/rimewater/atlas.ts`, the area's own since #486, §3) makes Rimewater
three zones:

| Zone | Band | Squares | Built |
|---|---|---|---|
| Loch Fada (Longmere) | 20–21 | 4,858 | M9 |
| Loch Fuar (Coldmere) | 21–22 | 5,188 | none |
| Glacier Foot | the reach: the cap (§9, call 7) | 3,173 | none; cut whole to Phase 1.6 (§11) |
| The area | 20–22 | 13,219 | M9 |

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
Cairnfield to 3,672.

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
- **South: the Whitespine** (22–24, Act IV), over the rim's long southern lobe. The high pass leaves
  K10 at 334,302 for Monks' Vale at 318,318, the Whitespine's J11 and Act IV's first box (#499): a
  road through the range (EXPANSION §2.2), open from the start, the world's end beyond it until J11
  is laid.
- **West: mountain,** I9 and the Whitespine's J column, with no way through.

The lochs run the length of the area: Loch Fada, the long loch, from M9's head west under L9 and on
behind the road, and Loch Fuar, the cold loch, filling K9's middle and K10's north shore, with
ridges between them at x≈372–390 and x≈412–430. Both are water on the atlas and frozen from autumn;
in a box the frozen loch is drawn as ice (#536), walked, and the pike strike through it. The drove
road comes down to Rime Lodge's gate at 410,262, then runs west along the long loch's south shore,
over the ridge in L9, round the cold loch's foot through K10 and up to the pass.

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

Two places: one box, the area's first, which lists the area (#486), and the town behind its gate
(#487):

- **Rime Lodge's box** (M9, `longmere_m9`, core, band 20–21; #486): the drove road taken down from
  Cairnmoor's N8 by the notch onto the long loch's shore, past the coach yard to the lodge's gate,
  which is the way into the town; the lodge's walls and the loch's frozen head before them, with
  the lake wall's door onto the ice and the ice-hole a few squares out from it, its fire and the
  one who waits at its foot, and the road on over the head by a causeway and out west along the
  shore. Pines under the fells; along the east the glacier's edge, a guide frostbitten at its foot
  with her cairn half built, and the one bare face of the ice with a hollow behind it. Seven
  groups: snow lynx in the pines three times, ice pike under the loch's ice twice and ice bears at
  the glacier's edge twice; and an eighth (#487), the tallyman and six knockers on the ice over the
  hole on the fourth night, with Wenna the last one out after them.
- **Rime Lodge** (`rime_lodge`, town, band 20–22; #487): a stockade on the shore behind M9's gate,
  with a lane down its middle: the Lanterns' fourth hall at its head, selling to the seventh tier,
  the healer's house and the furrier's either side of it, the provisioner's, the coach house with
  the coach's landing, the trainers' yard to 23 and, down the lane, the inn, The Thaw, whose stays
  count the nights, with its yard and a door onto the ice (§4.3).

#487 opens M9's gate and the lake wall's door, which were drawn shut with events for the town to
drop (`m9_gate`, `m9_lake_door`, in no save), and puts the fourth night's group and Wenna on the
ice (§4.2). The shared code it changed is under the issue's systems lane: an inn can count the
nights it keeps a company (`nights` on the inn feature in `src/game/map.ts`, `stayNight` in
`src/game/party.ts`, the inn's screen in `src/ui/screens.ts`); the curve test reads a caller's
retinue at its own level; and the Kilns' first-machines rule is read as far as the Kilns only
(#487's 1, 6 and 17 in §9).

Its atlas rows are charted in `src/content/areas/rimewater/atlas.ts`, the area's own `atlas` since
M9 lists the area; until then `src/content/atlas.ts` spread them into the plan, as Saltreach's were
before #170 (docs/areas/saltreach.md §9): the zones with their bands (Loch Fada 20–21, with M9 laid
on it, §1; Loch Fuar 21–22; Glacier Foot the reach's), Rime Lodge at 20–22, the Sleepers' Bay at
21–22, the sites (Rime Lodge, its own; the Ice Caves, the reach's, placed and not banded for this
act) and its links: the drove road down from the Cairnfield, the lodge's way in at 410,262, the
pass to Monks' Vale and the Ice Caves' way in.

Its row on the curve and its step on the gear ladder are in (#535). The row is in
`src/content/progression.ts`: band 20–22, next 22, window 4,500, owed to #438 while the area is
built box by box, with 4,203 xp a member and 1,520 gold the clear's floor (§8). The step is in
`src/content/areas/rimewater/items.ts`, made ahead of the area as the Kilns' was
(docs/areas/kilns.md §3; `ITEMS_AHEAD`, `src/content/index.ts`) until M9 took the table into its
Area: the furrier's seven (`FURRIER`) and their plus finds by 22 (§4.1), the seven sold by the
lodge's furrier (#487) and each find owed to its box until it is placed; M9 places the Ice Axe +1.
The systems it waited on, #432's, are all built (the opening names them and where each is
described); the drove road's coach is written (docs/areas/kilns.md §3), Rime Lodge's end of it
lands (#487) and the run waits for Kilnhaven's (#469). Its monsters are drawn in #495 and its rooms
in #496.

The monsters are drawn (#495), the six of MONSTERS §7.3, ahead of the boxes that place them: the
keepers, the Bay Keeper and the Matron (`src/ui/monsters/keepers.ts`), and the cats, the Snow Lynx
(`src/ui/monsters/cats.ts`), two new frames; and the Ice Pike, the Tallyman and the Ice Bear on the
long bodies', the knockers' and the bears' frames. Their defs are in
`src/content/areas/rimewater/monsters.ts`, the area's own since M9 lists it (`AHEAD`,
`src/content/index.ts`, listed them until then), and each was owed in `UNPLACED`
(`tools/tests/maps.ts`) to the issue that places it: M9 places the pike, the lynx and the bear
(#486) and its hole the tallyman (#487), and the keepers are owed to #490. §9 has the decisions.

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

All of it but M9 and Rime Lodge, built (#486, §4.2; #487, §4.3): 13,219 squares of land, 10,021 of
them walkable, the plan's figures (§1); on the road, 10,046. On the grid the plan is four boxes on
the road, a town and a dungeon, with seven boxes behind the road parked, and the owner's epic #438
holds this table:

| Box | Name | Zone | Kind | Band | Land | What is there | Its step of the quest | Issue |
|---|---|---|---|---|---|---|---|---|
| M9 | Rime Lodge's box | Loch Fada | core | 20–21 | 761 (mountain 246, pine 173, grass 129, hills 110), 104 shallow | the drove road down from N8; the lodge's gate at 410,262; the long loch's head; the ice-hole; the glacier's edge | the lodge; the nights | #486 |
| | Rime Lodge | | town, 16×16 | 20–22 | | the inn whose stays count the nights; the Lanterns' fourth hall, to tier 7; the furrier; the trainer to 23; the coach's landing; the hole's fight on the fourth night, on M9 | the four nights; Wenna | #487 |
| L9 | The long lake's shore | Loch Fada 607, Loch Fuar 361 | country | 21 | 968 (pine 652, mountain 169, grass 87, hills 59), 45 shallow | the road west along the loch; the ridge between the lochs; lynx in the pines | none | #488 |
| K9 | Loch Fuar (Coldmere) | Loch Fuar | core | 21–22 | 734 (grass 417, pine 274, hills 41), 113 shallow | the cold loch; the sealed door under the ice at about 352,284; the bell tower under the ice | the door | #489 |
| | The Sleepers' Bay | | dungeon, two levels of 16×16 | 21–22 | | the stair under the ice; the bay of beds; the keepers; the Matron in the last row | the sleepers | #490 |
| K10 | The high pass | Loch Fuar | core | 22 | 782 (pine 770), 65 shallow | the road round the loch's foot and up to the pass at 334,302; the pilgrims | south, over the pass | #491 |
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
| The sealed door | K9, under the ice | opened by Wenna's hand, a soft voice in the wall, "Captain?" (STORY); Act III's lock (call 4) | not placed: nothing on the surface names it (§10); at about 352,284 by the call |
| The Sleepers' Bay | below K9 | rows of long glass beds, every people of Caldera; the keepers and the Matron (MONSTERS §7.3); THE BLOOD OPENS THE DOOR (DESIGN §9) | a planned dungeon, `sleepers_bay`, by call 6; no site paints it |
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
  every Lantern hall does; it gives no quest yet (#487's 12). The furrier's sells the step's seven
  (`FURRIER`), the provisioner's Anvilhall's stores' list, the healer's house is a temple and the
  trainers' yard trains to 23. The coachman speaks of the overdue coach and sells nothing yet: the
  coach lands here, but Kilnhaven's end of the run is #469's (#487's 10). The houses draw in the
  game's one town style, half-timbered and white, where the brief has logs; the palette tints the
  stockade only.
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

### 4.4 L9, the long lake's shore (#488): country, band 21

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

### 4.5 K9, Loch Fuar (#489): core, band 21–22

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

### 4.6 The Sleepers' Bay (#490): dungeon, two levels of 16×16, band 21–22

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

### 4.7 K10, the high pass (#491): core, band 22

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

### 4.8 L10, L11, M10, M11, N9, J9 and K11, the country behind (#497): country, band 20–22, parked

- **Purpose.** The lochs' far shores and the pines behind the road, built once the owner has played
  the act (call 10): Loch Fada's length west and north (L10, L11, M10, M11), the glacier's edge in
  N9, with Glacier Foot's sliver of 255 drawn closed, and Loch Fuar's west and south (J9, K11).
- **Encounters.** Lynx, pike, bears at the glacier's edge; a den (#88).
- **Pay.** About 1,000 xp a member each (§8). The rest of each brief is written when #497 is
  unparked.

## 5. The one quest here

Rimewater's chapter is The Sleepers (`chapter.ts`, #492, its name a working title), the last of
Act III, joined after Cairnmoor's The Ring; every zone on the road holds a step (EXPANSION §5.8):
Loch Fada's at the lodge, Loch Fuar's at the door and the bay. Glacier Foot is the reach and exempt
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

The walkthrough plays it at 20, 21 and 22, standing the nights at the inn, and once with the pass
taken before the bay.

## 6. Side quests

#56's five for Rimewater, all standing (call 11), each built with its box on the systems of #76
(#494):

| # | Quest | Level | Where | What it needs | Built in |
|---|---|---|---|---|---|
| 40 | The Coach That Did Not Come | 20 | Rime Lodge's yard; the drove road on Cairnmoor's N8, where the coach stands in snow (call 11) | the coach (#539); a choice put by a person; a hand-in at the first meeting (#43) | #487, with N8's box |
| 41 | The One Who Went Back Down | 21 | the foot of the ice-hole (M9); the coach yard | the token of #56's 20 or a name from 27 (docs/areas/wrackholm.md §6); a choice put by a person | #486 |
| 42 | The Bell Under the Ice | 21 | Rime Lodge; Loch Fuar's ice at night (K9) | `when` (#41); a group on ice (#536); Kiln-script read (#538); `after` 40 | #487, #489 |
| 43 | Where the Sky Meets the Ice | 22 | Rime Lodge; the glacier's edge (M9's east) | a mark on the world map into the void (call 7) | #487, #486 |
| 44 | The Pilgrims in the Pass | 22 | the pass's mouth (K10) | a choice put by a person; a brother as a person, no fight | #491 |

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
43's flags. Their words and flags are #494's (#487's 15).

### The guilds' quests

One hall opens here, the Lanterns' fourth (call 5; DESIGN §8's three become four), on the rules
and the hall menu of #132: Rime Lodge's hall sells to tier 7, teaches the Lanterns' three skills
once #538 builds Linguist (Spirit Sense and Perception are #18's) and gives the Lanterns' quests to
a member. The fourth rank, Luminary, opens at Lantern Watch and here (call 8, #439): its quests are
the Lanterns' line's, the split that began at the Watch (DESIGN §8, §9), and are #439's to propose.
The first task for a company that is not yet a Taper is to keep the hole's fire a night. As built,
the hall sells and teaches and gives no quest yet: that task waits with the fourth rank for #439
(#487's 12).

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
tallyman's 20 (#487's 4 and 6).

Proposed, against the roster's Where column: the Ice Bear on the lochs' shores and the ridge (L9,
K9), where MONSTERS §7.3 has it at the glacier's edge only; knockers on the bay's stair, the
tallyman's, where the roster has them only at the ice-hole. If the owner takes them, MONSTERS' Where
column says so, in a pull request of its own. **The band's top is a question.** The roster has
nothing at 22 outside the bay: the keeper and the bear are 21, the rest 20. K10 at 22 alone wants a
hardest group at 23 by the curve's rule, as C7 at 12 wanted one at 13 and had none
(docs/areas/saltreach.md §9, #178's 2). Either K9 and K10 are both 21–22 with bear pairs at the top,
as the pans took the bull toads, or the cats are given an elite at 22 for the pass, a seventh drawing
#495 did not make (§9). The owner's, in #491.

New in Rimewater, for the novelty check (EXPANSION §5.4): the keepers and the cats, two new
families; ice and lying snow underfoot (#536), with a group placed on ice; calls (#537); a story
lock (call 4), the act's only one; a town whose inn counts nights; a dungeon entered from the ice;
machines shaped like people, a touch that puts to sleep and a boss that mends; Kiln-script read for
a quest (#538). Its landmarks: a hole in the ice with a fire beside it, a bell tower out of the ice,
a door under the ice, rows of glass beds, a glacier, a pass. The area's `novel` claims each as a box
places it, since the check asks that what is claimed be used: the cats and a group on ice with M9
(#486), the rest with theirs; snow and ice underfoot are Cairnmoor's. Rime Lodge (#487) claims no
landmark, its icon being the road's before, Deepthorn Lodge's, which the check refuses (#487's 16).

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
  the curve's row reports what a clear falls short of as owed to #438 until the boxes exist.
  Scaled to the curve, which §9 proposes as the briefs' working figures until each box is built,
  the shares are M9 2,650, Rime Lodge 900, L9 2,300, K9 2,650, the bay 4,250, K10 1,950 and the
  side quests about 1,600: about 16,300. The issues (#486 to #494) carry the first figures until
  their briefs are settled. As built: M9 3,754 (#486), over the brief's 1,500 and the scaled 2,650,
  and Rime Lodge 449 (#487), the hole's fight alone (the tallyman 793 and six knockers at 317, over
  six), under the brief's 500 and the scaled 900, the hall's quests being owed to #439. Rimewater
  stands at 4,203 of 16,267. The scaled shares still to come (L9 2,300, K9 2,650, the bay 4,250,
  K10 1,950 and the side quests 1,600: 12,750), paid at M9's 1.42 times its scaled share, come to
  about 18,100, and Rimewater would stand at about 22,300, under 1.4 times the ask (22,774), so no
  group is cut (#486's 21; #487's 18).
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
  seventh tier and its inn 45 a member a night.
- **The gate.** The gate check (`tools/tests/gate.ts`, #38) holds each box at its own floor
  (docs/areas/thornmark.md §9, 17): a company at 20 wins nine in ten of M9's fights and walks the
  drove road to the lodge resting at the inn; one at 18 wins no more than one in four, which is how
  the Rimefells turn a Cairnmoor company back. The Matron is won about half the time at 21 and
  nearly always at 23. The ice-hole's fight is judged with the fire at the company's back, one
  group and its call (#537), inside the aim at 20. As built: a company at 20 wins every fight on M9
  and walks Loch Fada's road every time, 9.55 fights to a rest; one at 18 wins every fight too,
  owed to #18 as the Kilns' and Cairnmoor's boxes' are (§4.2). Rime Lodge (#487) puts the hole's
  fight on M9 as a group of its own: Rimewater at its maps' floors wins 100% of its 8 groups'
  fights, and so does a company two under, the same debt; the hole alone is 10.4 fights to a rest at
  20, a little over the aim of 8 to 10 and inside the limit of 12.5 (§4.3).
- **Density.** Core boxes at the Foreland's floor, country at the looser one (EXPANSION §5.3); the
  bay as a dungeon, 90% within 7 and none past 10. As built: M9 98.0% within 8 steps and the
  furthest 13, with no sign among its 31 points (#486), 32 since #487; Rime Lodge, a town, 100%
  within 7 and the furthest 4, no sign among its 19 points (#487).

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
5. **The Lanterns' fourth rank opens at Lantern Watch and Rime Lodge** (call 8, #439).
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
    rank's.
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

## 10. Names

Rimewater's naming pass, by the rules of `docs/NAMES.md`, chosen for #435. The lodge-keepers are
hill folk who share a tongue with Cairnmoor's, modelled on Scots Gaelic, the speech of lochs and
bens: short parts, spelled as they are said, with no accent the font lacks. *Carn* a cairn, *creag*
a crag, *loch* a lake, *moine* a moss or bog, *tulach* a knoll, *dubh* black, *fionn* white or fair,
*beinn* a mountain, *allt* a burn, *clach* a stone, *fuar* cold, *fada* long, *eas* a waterfall,
*ceann* a head, *lios* an enclosure. It goes into NAMES §2's row for the hill folk, Cairnmoor's and
Rimewater's together.

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

Owed by Rime Lodge as built (#487, §4.3):

- **To #439:** the Lanterns' fourth rank and its quests, and the hole's fire as a first task, left
  out of the hall because it would be a second rank-0 quest and keep every company that did
  Helmstow's first task a stranger until Act III (#487's 12); and the rule a hall's own first task
  would need.
- **To #469:** Kilnhaven's end of the coach, its landing and its seller. The coachman sells nothing
  until it lands; then the passage check wants both ends to sell, and the gate counts the town's
  ways out onto M9 as landings and holds the nearest groups to the gentlest (#539's 4), which wants
  another look at the ice pike beside the lake door's landing, 13,12.
- **To #492 and #494:** the chapter's entries on the nights and on Wenna, and her place at the lodge
  after the bay (#492); the words of 39, 40, 42 and 43 on the people placed, and the lodge's guide
  before she goes (#494).
- **To #489 and #490:** Wenna's `until` at the hole, and her place at the door.
