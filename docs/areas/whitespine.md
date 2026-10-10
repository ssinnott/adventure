# The Whitespine: step IX of the road, the range the bells ring over

The ninth step of the road of levels (DESIGN §9, EXPANSION §2.2), band 22–24, and the first of
Act IV, Beyond the Sky: the great southern range south of Rimewater's lakes, with the Peak Stone
whole on its crest and the monastery, Highcell (the Monastery), kept by monks who died long ago;
Sheer Point, the finger of land toward the Hearth where the Ashen Hand builds its causeway of stolen
shards; and the Giants' Stair, the road through the Sheer and down into Ashfall, where the giants
take their toll. This is its area doc (EXPANSION §4, §6 and §8.2): where the atlas puts it, what
is in it, the plan for building it, box by box, and the briefs. Its work is filed under #445 (Phase
1.4, #441): the boxes as §4's table has them, Highcell (#500), its chapter (#505), its side quests
(#506), its eight drawings (#507) and the country behind (#508); this doc is #498 and Act
IV's systems are #442's (§3). Figures are measured on main at `6032251` (2 October 2026) with
`worldGrid` (`src/game/atlas.ts`).

Its eight boxes are built, J11, Monks' Vale (#499, §4.2), which lists the area, I11, the
Peak Stone's (#501, §4.4), I10, Stairwatch and the Stair's head (#502, §4.5), I9, the ridge north
(#503, §4.6), I8, Sheer Point (#504, §4.7) and, behind the road, J10, the giants' ground, I12, the
Spine's south and J12, the vale's end (#508, §4.8), and so is Highcell, the dungeon through J11's
gate (#500, §4.3); its eight monsters are drawn (§3), its chapter, The Bells, is written (#505, §5),
its four side quests are in the log (#506, §6) and so are its four third prestiges' quests,
the Knight's, the Monk's, the Bard's and the Thief's (#448, §6); K11 and K12 stay cut (§11). Its content is `src/content/areas/whitespine/` (maps, monsters, items,
climate, its part of the world map, its walkthrough and its chapter of the one quest, The Bells, in
`chapter.ts`; its side quests in `quests.ts`, #506); it has no town, so no rooms. Its ids:
the area `whitespine`, its zones `monksvale`, `highspine` and `sheerpoint`, the dungeon `monastery`
and `monastery2` (the ids stay under the new name, §10).

---

## 1. Where it is

The atlas (`src/content/areas/whitespine/atlas.ts`, the area's own since #499, §3) makes the
Whitespine three zones:

| Zone | Band | Squares | Built |
|---|---|---|---|
| Monks' Vale | 22–23 | 3,402 | J11, J10, J12 |
| The High Spine | 23–24 | 3,118 | I11, I10, I12 |
| Sheer Point | 23–24 | 1,396 | I9, I8 |
| The area | 22–24 | 7,916 | J11, I11, I10, I9, I8, J10, I12, J12 |

Squares are land without shallows or rivers. The area is about 7.7 zone maps (EXPANSION §1 has
7.7), and only 3,961 of its squares a company could walk: more than half of it is mountain and peak
(Monks' Vale mountain 1,316, pine 904, hills 448, peak 400, grass 334; the High Spine pine 1,559,
mountain 955, peak 395, cliff 105, hills 62; Sheer Point mountain 457, pine 446, peak 320, hills
134). It runs from the Sheer at x 264 east under Coldmere's pass, and from the Point's tip at about
y 226 south to y 372, where the range runs on. The zones' bands are the folder's: the atlas gives the
area 22–24 and the boxes rise through it (§4).

The squares are the plan's, before any box. J11 (#499), laid whole in Monks' Vale, takes the 110
squares of the High Spine on its crest with it, as a map laid in one zone does (§4, §9). I11 (#501),
laid whole in the High Spine, takes 154 of Monks' Vale's on its crest and 187 of Ashfall's under the
Sheer. I10 (#502), laid whole in the High Spine, takes 31 of Loch Fuar's at its north-east corner,
all peak and mountain, and 3 of Cindercoast's, the cliff at its north-west corner. I9 (#503), laid
whole in Sheer Point, holds 278 of its 1,024 squares in that zone by the atlas's cut as it stands,
with 547 of the High Spine's, 194 of Loch Fuar's and 5 of no zone's (§4; §9, #503's 1). I8 (#504),
laid whole in Sheer Point, has nothing of another zone's: by the atlas's cut as it stands 757 of its
1,024 squares are the Point's, land and shallows, and 267 are sea in no zone (§4; §9, #504's 1).
Laying Highcell (#500) moves no square: its two plates, at 322,346 and 322,352, are places on the
atlas, which the grid does not read. J10, I12 and J12 (#508), laid whole in Monks' Vale and the
High Spine (§9, #508's 2), are counted as the plan has them, and what the zone walk moves is not
counted here.

**The grid** (EXPANSION §8.2; docs/areas/shelf.md §1). The Whitespine is the I and J columns from
row 8 to row 12, with K11 and K12 holding Monks' Vale's east under the pass. The land worth a map is
eight boxes: J11, the Vale and the monastery; I11, the Stone's; I10, the Stair's head; I9 and I8,
the ridge and the Point; behind them J10, I12 and J12, built since (#508, §4.8). K11 and K12 are
cut (§11).

Its edges:

- **North: the sea,** off Sheer Point's tip, with the Hearth beyond it at 256,174 so near its heat
  is felt (STORY, Act Four). The Point's shallows are I8's (86) and I9's (11).
- **East: Coldmere,** Rimewater's frozen lake (20–22, Act III). The high pass comes over from K10
  at 334,302 and down to J11's north edge at 318,318 (`src/content/atlas.ts`), the one way in from
  the road behind, open from the start (EXPANSION §2.2: the atlas's "Mountaineer" road became a road
  through the range). Rimewater's pass box is #491; the road is walked, K10's west edge at 328,305 onto
  J10's 31,19 at 327,305, across J10's corner and down onto J11's 20,0 at 316,318 (#508, §4.8).
- **West: the Sheer,** the cliff down the range's west side at x 264–272 from y 272 to y 372,
  walling Ashfall (24–26) off; the Giants' Stair is the road through it, from the head at 272,306
  in I10 to Ashfall's H10 at 258,306 (`src/content/atlas.ts`; #510 built the foot). North of the
  Sheer the Point's west side falls to the sea, Cindercoast across it.
- **South: the range,** on through I12 and J12 to the rim: the country behind, built (#508, §4.8).

The great spine runs north to south at x 282–304 with snow on it the year round, Spine Summit on
it at 300,328 and the Peak Stone at its foot at 292,318. The ridge trail from the Stone north along
the crest to Sheer Point is new on the atlas (#443, call 3): 292,318 to 286,300, 282,280, 284,262
and 286,236, open from the start. Today's atlas reads Monks' Vale as a dead end (EXPANSION §5.8),
since its border with the High Spine is the crest; J11 and I11 build the way over it.

`node tools/worldmap.ts out.png --zones` paints it.

## 2. What it is for

The first half of Act IV (DESIGN §9): *what is Caldera?* The Peak Stone is whole, the only whole
Stone the company stands beside between the Lodestone and the end, so nothing here is a Rift
(MONSTERS §2.1): the danger is the mountain, the giants and the monastery. The monks died long ago,
and the Custodian's hands keep their hours in their robes: they walk like the keepers of the bay,
speak the dwarves' old script to each other and do not bleed, and the Hearth's light passes through
them (MONSTERS §8.1). Their bells ring the eleven of Crowness Light's log, the Hearth's pulse, rung
by a machine that was told to ring them and never told to stop. On Sheer Point the Hand builds its
road out over the water, every stone a stolen shard, and takes Wenna out along it in the night
(DESIGN §9, the captain's line). The Giants' Stair is the road over the range and down into Ashfall,
and its toll is the second choice put before a fight (#544), after Thornmark's ogre's bargain
(#645). Four of the third prestiges' places lie here and are built with it (#448): Stairwatch,
Spine Summit, Rook's Nest and the bell tower. Their four quests are built, the Knight's, the
Monk's, the Bard's and the Thief's, out to the Dead-Drop (§6, #448).

Nothing trains or sells here (#443, call 7): Rime Lodge teaches to 23 behind and Cinderport to 27
ahead, so a company carries what it has over the range. The weather is the range's: snow on the
crest the year round, wind, cloud below the peaks; clear and bitter at night.

## 3. What is built

Eight boxes and a dungeon, J11, the area's first, which lists the area (#499), Highcell, through
its gate (#500), I11 (#501), I10 (#502), I9 (#503), I8 (#504) and the country behind the road,
J10, I12 and J12 (#508):

- **Monks' Vale** (J11, `monksvale_j11`, core, band 22–23; #499): the pass's road down from K10's
  west edge, walked across J10's corner (#508), over the north edge, then square to square through the
  hills and the vale's grass to the gate in the monastery's wall on its shelf, open now on Highcell
  (§4.3). At the pass's foot the bells first heard and a cairn; by the road the monks'
  shrine, its bell on a post with no rope, and east of it the pilgrims' hostel, kept wrongly, the
  blankets under the beds and a bowl of snow by each. On the west the crest under its snow and a
  path up it in steps to Spine Summit, a camp, with Oswin the hermit beside it, who teaches the
  Monk's third for a night's vigil (§6, #448); at the vale's east edge
  the herder at his fold. The monastery is a block of building squares on its shelf, with two bell
  towers over its wall and a camp in the shelf's lee; behind the wall the snow is trodden in one
  line west to the rock, a brother walking it by night; in the rock, the store (§4.2). Five groups:
  brothers at the pass's foot and on the road to the gate, spine eagles either side of the road and
  snow trolls at the far end of the summit's path; and a sixth, the vigil's brothers, up the path by
  night once Oswin is answered.
- **Highcell** (`monastery` and `monastery2`, dungeon, two levels of 16 by 16, band 22–24; #500): in
  at the gate in J11's wall, open now, past the brother standing in it, onto a cloister swept bare
  round a garth of snow with its well, the bucket dry. By the refectory door a board of the hours in
  the old script; in the refectory the tables laid and every bowl empty; along the east walk the
  cells, a brother standing in each, and the Novice in the last. At the south walk's west end the
  bell tower's foot and its stair winding up to the bells, where the ringers ring the eleven and one
  pulls a beat behind the rest, Brother Lark, who teaches the Bard's third for the eleven's verses
  (§6, #448); at its east end the night stair down. Brothers keep the hours by the
  cells and ringers come down the tower's stair. Below, the chapter house, a vault on four columns,
  with brothers before two bell-ringers and, at the far end on a seat of stone, the Abbot, a boss
  that does not come back. Behind the seat, found from it, the undercroft: the monks of Highcell in
  their niches, every niche full, the last cut with a count, and their things laid by (§4.3).
- **The Peak Stone's box** (I11, `highspine_i11`, core, band 22–23; #501): over the crest from
  Monks' Vale, J11's summit path going on west in the snow to the snow line, with the pines below it
  and a camp, the last pines, under it. At the north edge the Peak Stone, whole, in a ring of bare
  stone, a brother standing at it, the monks' shrine at its foot and the cairn where the ridge trail
  leaves north; one slab in the ring lifts, over a hollow with the Lanterns' survey marker, lit, and
  a chest (§4.4). Up a spur off the crest path the eagles' nest, with a Lantern's badge among the
  bones. On the west the Sheer, a cliff, a lookout at its top over Ashfall and Fire Mountain, and at
  its foot Ashfall's own grey pines, reached by a climb down. Four groups: spine eagles at the nest
  and over the snow line, brothers on the snow line between the crest path and the Stone and snow
  trolls in the snow at the crest's foot. The Stone counts for the Hearth once stood at (§9, #501's 5).
- **Stairwatch and the Stair's head** (I10, `highspine_i10`, core, band 22–24; #502): up the ridge
  trail from the Stone and on north through the pines, then a road west off it to the Stair's head,
  cut stone at the top of the Stair, where the road goes down through the Sheer to the west edge and
  on down onto Ashfall's H10 (#510).
  Short of the head the road runs past a caravan drawn up and through the Stair in snow, a giant and
  a snow troll in a drift; at the head are a toll-stone and a shrine older than the monks'. The
  Stair-king keeps the top step from his seat of rock, with two giants, and holds out his hand: the
  toll is gold, a grey part or a faceless coin, or the fight (§4.5). Under the seat, walled in rock,
  his hoard. South of the head, in the rock, Stairwatch: a chimney found off the pines climbs to a
  ledge over the Stair, where Edric, an old champion, keeps his watch and teaches the Knight's third
  for a night held with him (§6, #448). Three groups: spine eagles in the pines nearest the way in,
  the Stair in snow and the king's; and by night, once Edric is answered, the toll-takers up the
  shaft, two and then two more.
- **The ridge north** (I9, `sheerpoint_i9`, country, band 22–23; #503): on up the ridge trail from
  I10, north along the crest in the snow, peaks either side and the pines below on the west, the
  Sheer beyond them and the sea in the north-west corner. The wind turns warm and the snow wet,
  then the snow is gone off the rocks. At the trail's end the Hearth stands over the water, so
  close its heat is on the face, and a road of cut stone runs out over the sea. On the crest the
  giants' cairn, set and not rolled, and a cairn to steer by in cloud; snow trolls lie in a gully
  cut through the crest's shoulder. Off the trail, the masons' first camp, a tally in the rock face
  running on into a crack and, behind the crack, their cache (§4.6). Past the camp a sledge of cut
  stone stands on the trail and the masons beyond it. In the pines a camp in the crest's lee, a
  lamp kept burning at the Sheer's edge and a hermit by the shore. Three groups: spine eagles in
  the pines by the way in, snow trolls in the gully and Ashen masons at the trail's end.
- **Sheer Point** (I8, `sheerpoint_i8`, core, band 22–24; #504): on up the ridge trail, the rock
  warm under it, to its end on a lip over the tip, where the Point runs out into the sea and the
  heat comes up off it. A masons' track goes down through the rock to the shore, and from the shore
  the Hand's causeway of cut stone runs out over the water, a square wide, every stone glowing a
  little, and stops over deep water, as far as the Hand has built it, the Hearth's light beyond.
  Masons work at its root and, with their foreman, on its end; eagles hunt over the tip, and by
  night a snow troll comes down to the east shore. On the shingle west of the root a camp, where
  Wenna waits and asks whether the company will sleep by her fire; if it does, it wakes to her
  blanket cold, a boat going out along the stones and, on the first stone, her knot. In the tip's
  rock Rook's Nest, a hollow where Hereward watches and counts the stones, the Thief's third's
  trainer (§6, #448); its back wall is wet and by night
  oars are heard behind it, where the Hand keeps its boats and its crates under seal. On the tip's
  last rock a cairn and, at the tide's edge, the drowned god's shrine; down the pines to the east a
  deserter in the rocks with his tally. Four groups: spine eagles by the track's foot, masons at the
  causeway's root, their foreman's on its end and a snow troll by night.
- **The giants' ground** (J10, `monksvale_j10`, country, band 22–23; #508): the road over the saddle
  from K10's west edge, walked, down through the box's south-east corner to the vale; the pines
  under the range's slope, the range itself on the west and the cold loch seen white to the north.
  On the slope a fire of whole pines burning with nobody at it, and in a snow clearing in the pines
  the giants' own, with a ring of stone seats; their prints, felled pines and a pine rubbed bare. A
  goatherd who grazes their ground and says they ask nothing off the Stair, a lean-to for a camp, a
  cairn and a fallen seat with a pool that does not freeze, which gives might. Old coins in the snow
  lead to the rock, and in it stands the giants' cauldron of the toll with its chest, shut to
  walkers, swimmers, climbers and floaters. One group: two stair giants at their fire.
- **The Spine's south** (I12, `highspine_i12`, country, band 22–23; #508): south from the Peak
  Stone's box along the Sheer's edge, the pines running on with no trail through them; Ashfall's ash
  lies under the cliff on the west and a wall of rock, the rim, closes the south. A charcoal-burner
  with his hut for a camp, who says the trolls lie up where the pines stop and that fire stops their
  mending; a cairn, a warm spring that gives endurance, a pine leaning out over the drop, the
  eagles' nest high on the Spine and pines stripped of their bark. Old tracks go up to the rock face
  and stop at it, and behind it lie a cleft, packs frozen under a hide and a strongbox, shut to
  walkers, swimmers, climbers and floaters. One group: two snow trolls.
- **The vale's end** (J12, `monksvale_j12`, country, band 22–23; #508): south from Monks' Vale over
  the hills, the vale running out under the peaks with the snow going up to their feet unbroken and
  the far pines in the south; a bell is heard faintly below, underfoot. A stone seat in the hills
  that gives intellect, a cairn, the drop to the east, eagles turning over the crags with bones in
  the snow under them, and in the pines the trolls' bowl scraped to the earth and a pilgrim frozen
  where he sat. A bell-rope hangs out of a crack in the rock, the snow under it worn by knees, and
  behind the rock is a cell with a bell with no tongue and an alms box, shut to walkers, swimmers,
  climbers and floaters. One group: two snow trolls.

Its atlas rows are charted in `src/content/areas/whitespine/atlas.ts` (#498), the area's own `atlas`
since J11 lists the area; until then `src/content/atlas.ts` spread them into the plan where its rows
were, as Saltreach's was before #170: the zones with their bands (Monks' Vale 22–23, with J11, J10 and
J12 laid on it and its crossing line said in its own words, §4.2; the High Spine 23–24, with I11, I10 and I12
laid on it and its crossing line said in its own words, §4.4; Sheer Point 23–24, with I9 and I8 laid
on it and its crossing line said in its own words, §4.6), Highcell's two plates,
`monastery` at 322,346 and `monastery2` at 322,352 (the first moved from K12's, §9), its sites
(Highcell at J11's gate, 322,342, the Peak Stone, Stairwatch, Spine Summit, Rook's Nest and the
Giants, its own; the Sheer, the plan's, §10) and its links: the pass in, the monastery's way in, the
Giants' Stair and the ridge trail (#443, call 3). Spine Summit is a camp now, the Peak Stone a
stone, Highcell built, Stairwatch a ledge and Rook's Nest a hollow, none planned any more, and the Giants' label has its land laid, J10, and is
planned no more (§9, #499's 12; #500's 1; #501's 16; #502's 11; #504's 11; #508's 12).

Its ground (#543): peaks (`A`) and cliffs (`|`), the mountain's rock to walk into, see and climb,
with the road through them plain road, so the scaffold drafts each box square for square (J11's 202
peaks, I11's 48 peaks and 64 cliffs) and the view draws a summit and a face (docs/SLICE.md).

The chapter, on the places built (#505):

- **The Bells** (`chapter.ts`, #505): begun where The Sleepers ends, the beds seen and K10's pass's
  mouth reached, or in Monks' Vale: the bells on J11's road; Highcell's cells, its board read and
  its Abbot fallen; the Peak Stone; the causeway's first stone; the night she is taken and her
  knot; and the Stair's head and its toll, paid or refused. Its goals stand in Highcell, on I8 and
  on I10, so Monks' Vale, Sheer Point and the High Spine each hold a step. It is done on the
  Stair's first step below the king's, I10's 1,20, which sets `q_stair_top` once the toll is
  answered or the king is down; Ashfall's chapter (#518) reads that flag (§5).

The side quests, on the places built and three beyond the range (#506):

- **The Novice, The Eagles' Nest, The Toll and The Mason's Tally** (`quests.ts`, #506): #56's 45
  to 48, their people on Highcell's, J11's, I10's and I8's maps and the nest on I11's, and three
  beyond the range: the novice's mother at Anvilhall (Kilns), the deserter at Cinderport (Ashfall)
  and the Reader at Lantern Watch (Sunderwood), who takes the badge and the instruments.
  Each pays its xp whichever way it goes, 200, 200, 250 and 250 a member (§6, §8).

Its row on the curve is in (#542), in `src/content/progression.ts`: band 22–24, next 24, window
5,000, its gold owed to #445 while the area was built box by box, the entry gone with the country
behind (§9, #508's 11): a clear gives 22,101 xp a member of the 17,867 asked and 11,080 gold of
the 10,800. The boxes gave
17,429 xp and 5,290 gold before the country behind, J11's 2,791 and 700, Highcell's 4,183 and 600,
I11's 2,355 and 300, I10's 4,197 and 1,920, I9's 1,800 and 790 and I8's 2,104 and 980; the side
quests' 900 xp took a clear to 18,329, past the curve's 17,867 (§8, #506), the third prestiges'
fights to 20,274 and 5,750 gold (§9, #448's 1) and the country behind's 609 xp and 1,700 gold a
box, J10 with two giants' purses besides, to 22,101 and 11,080 (§8; §9, #508's 3 and 10). It has no
step on the gear ladder, no town to
sell one: Rime Lodge's rung is the pass's, and Cinderport's step (docs/areas/ashfall.md §4.4) comes
two levels on; J11's store holds a second of Rimewater's Guide's Staff +1 (§4.2), Highcell's
undercroft an Ice Axe +1 and a Skinning Knife +1 (§4.3), I10's hoard a Bear Spear +1, Rimewater's
rung (§4.5) and I9's cache a Hunter's Bow +1 on the same rung (§4.6); I8's cave holds none (§4.7).
The systems it waits on are the rest of #442's: the toll (#544), sweep (#545), stone (#546), the
crossings (#547), the Ember Stone (#548) and the bot (#549).

The monks are drawn (#507), three of MONSTERS §8.1's eight, ahead of the boxes that place them: the
Brother, the Bell-ringer and the Abbot, robed on the keepers' frame (`src/ui/monsters/keepers.ts`).
Their defs are in `src/content/areas/whitespine/monsters.ts`, the area's own since J11 lists it
(`AHEAD`, `src/content/index.ts`, listed them until then), and each was owed in `UNPLACED`
(`tools/tests/maps.ts`) to the issue that places it: J11 places the Brother (#499) and Highcell the
Bell-ringer and the Abbot (#500), so that none of the monks is owed now. §9 has the decisions, the
Abbot's tuned def among them (#500's 6).

Three more on frames that exist are drawn (#507), the Spine Eagle on the birds', the Snow Troll on
the ogre's and the Ashen Mason on the cultists', in the same file, each owed in `UNPLACED` to the
first box whose brief places it (§4): J11 places the eagles and the troll (#499) and I9 the masons
(#503), so that none of the three is owed now (§9, #503's 10). §9 has the decisions.

The giants are drawn (#507), a new family on a frame of their own (`src/ui/monsters/giants.ts`): the
Stair Giant and the Stair-king. Their defs are with the monks', and I10 places both (#502, §4.5), so
that neither is owed in `UNPLACED` now; both sweep the front row a turn in four, the giant set to
its line and the king by his gate (§9, #502's 2 and 3). §9 has the decisions.

## 4. What is still to build

All of it is built, J11, Highcell, I11, I10, I9, I8 and the three behind the road (#499, §4.2;
#500, §4.3; #501, §4.4; #502, §4.5; #503, §4.6; #504, §4.7; #508, §4.8): 7,916 squares of land,
3,961 of them walkable, the plan's figures (§1). On the grid the plan is eight boxes and a
dungeon, five boxes on the road and three behind; the five hold 5,138 of those squares, 2,199 of
them walkable, and the three behind 2,771, 1,277 of them walkable (§11):

| Box | Name | Zone | Kind | Band | Land | What is there | Its step of the quest | Issue |
|---|---|---|---|---|---|---|---|---|
| J11 | Monks' Vale | Monks' Vale, the High Spine | core | 22–23 | 1,024 (mountain 342, hills 264, grass 214, peak 202) | the pass's foot at 318,318; Highcell's gate at 322,342; Spine Summit at 300,328; the herder | the bells; the monastery | #499 |
| | Highcell | | dungeon, two levels of 16×16 | 22–24 | | the cloister and the cells; the bell tower; the chapter house and the Abbot; the undercroft behind the seat | | #500 |
| I11 | The Peak Stone's box | the High Spine | core | 22–23 | 837 (pine 536, mountain 210, peak 48, cliff 42) | the Peak Stone at 292,318, whole; the ridge trail's foot; the eagles' nest | none | #501 |
| I10 | Stairwatch and the Stair's head | the High Spine | core | 22–24 | 961 (pine 665, mountain 194, peak 85, cliff 17) | the Stair's head at 272,306 and the toll; the Stair-king; Stairwatch at 270,312 | the Stair and its toll | #502 |
| I9 | The ridge north | Sheer Point | country | 22–23 | 774 (pine 357, mountain 205, peak 204), 11 shallow | the ridge trail along the crest; snow trolls; the Hearth seen | none | #503 |
| I8 | Sheer Point | Sheer Point | core | 22–24 | 542 (mountain 261, hills 134, peak 122, pine 17), 86 shallow | the causeway; the Hand's camp and Wenna; Rook's Nest at 286,230 | the causeway; Wenna taken | #504 |
| J10, I12, J12 | The giants' ground; the Spine's south; the vale's end | Monks' Vale (J10, J12), the High Spine (I12) | country, behind the road | 22–23 (§9, #508's 1) | 875, 959 and 937 | the road across J10's corner, walked; the giants' fire on the slope and their own seats and the goatherd (J10); the pines along the Sheer, the charcoal-burner and the snow trolls (I12); the bell heard below and the trolls' bowl (J12) | none | #508 |

The core is the four boxes the owner's plan names (J11, I10 and I8, which hold a step, and I11,
which holds the Stone), built at full density; the rest is country, built to the looser floor with
the wilderness features (EXPANSION §2.1 (b) and §5.3, #45). I9 is built with the act, the only
country between the Stone and the Point; the country behind was parked until the owner had played it
(#443, call 9) and is built (#508). The bands rise from the way in, 22 at the pass's foot, to 24 at the Abbot, the
Stair-king and the causeway, as the gate asks (EXPANSION §5.2), and each box holds a group at the
top of its band for the curve.

**Four boxes hold land of more than one zone.** J11 is Monks' Vale with 110 squares of the High
Spine on its crest. I10 is the High Spine's 990 squares with 31 of Loch Fuar's in its north-east
corner and 3 of Cindercoast's in its north-west, none of them walked. I11 is the High Spine with 154
of Monks' Vale on its crest and, under the Sheer, 187 of Ashfall's. I9 is Sheer Point's 278 squares
with 547 of the High Spine's, 194 of Loch Fuar's and 5 of no zone's. A map is its whole box
(EXPANSION §8.2), so each is built to its edges and the zone line runs inside it; the zone a square
belongs to decides only its crossing line (#166) and its band. Each but I9 is laid in its larger
zone (§9); J11 is, in Monks' Vale (#499), I11 in the High Spine (#501) and I10 in the High Spine
(#502). I9 is laid in Sheer Point, though the High Spine holds more of it, for the atlas check wants
300 squares of land in every zone and laid in the High Spine the box would leave the Point's 79
(§9, #503's 1). J10 and J12 (#508) are laid in Monks' Vale and I12 in the High Spine (§9, #508's 2).

**The order** is the road's, and the quest's: J11, the only box that meets Coldmere's pass, and
Highcell behind its gate; I11, over the crest to the Stone; I10, the Stair's head, where the road
goes down; I9 and I8, north along the ridge to the Point; then the country behind (#508), J10 across the
road's corner and I12 and J12 south of the Stone and the Vale. Building waits on #442's systems (§3) and
on the two-areas rule (EXPANSION §3); the briefs and the drawings do not (#445).

The places, as the atlas and the docs have them:

| Place | Box | What the docs say | On the atlas |
|---|---|---|---|
| Highcell (the Monastery) | J11, and below | the monks died long ago and the Custodian's hands keep the monastery in their robes; its bells ring the eleven (DESIGN §9, STORY); the chapter house and the Abbot (MONSTERS §8.1); the Bard's third prestige in its bell tower (DESIGN §5); the Novice (#56's 45) | a site at the gate, 322,342, and two plates, 322,346 and 322,352, the first moved from 330,356 |
| The Peak Stone | I11 | whole: the Whitespine has no Rifts (MONSTERS §2.1); a Lantern came to survey it and never came down (#56's 46) | a stone at 292,318, no longer planned (#501) |
| Spine Summit | J11 | the Monk's third prestige: the hermit's vigil through a night (DESIGN §5, #448) | a camp at 300,328 |
| The Giants' Stair | I10, and Ashfall's H10 | the road over the range and down, past the giants who gave it its name (DESIGN §9); the toll (MONSTERS §8.1, #544); the Stair-king; the caravan that cannot pay (#56's 47) | a road link, 272,306 to 258,306 |
| Stairwatch | I10 | the Knight's third prestige: a ledge above the Stair, its way up found off the Stair (DESIGN §5, #448) | a tower at 270,312 |
| Sheer Point | I8 | the Hand's causeway of stolen shards; Wenna taken (DESIGN §9, STORY); the masons (MONSTERS §8.1); the mason's tally (#56's 48) | the zone, its tip at about y 226 |
| Rook's Nest | I8 | the Thief's third prestige: a hide over the causeway, and the Dead-Drop's orders (DESIGN §5, §10.2, #448, #22); Hereward, built with Whose Hand (§6) | a cave at 286,230 |
| The Giants | J10 | the giants' own ground above the Stair (#443, call 1) | a label at 300,296, no longer planned (#508); the Sheer lettered at 262,300 |

### 4.1 The briefs

Each box's brief is what EXPANSION §8.2 asks of one: its purpose, band, landmarks, the secret and
its hint, the encounters and what is new, with its points of interest and a first share of the pay
beside them. They are drafts for the owner, written before Act IV's first box is built; each is
settled in its issue.

- **Points of interest** (EXPANSION §5.3). A core box is held to the Foreland map's density, about
  nine features, ten groups and four ways in or out to 870 open squares, scaled to the open squares
  the mountain leaves it; a country box has about half, with the wilderness features (#45). No more
  than one point in four is a sign.
- **Encounters** are MONSTERS §8.1's roster and fights. A group is about one of MONSTERS §4.4's
  standard encounters, and a kill pays each member by the monster's level against theirs (#159),
  so the figures below are for a company at the box's band. At 22 a company fights nine or ten
  standard encounters between rests (EXPANSION §5.2).
- **Pay.** The area owes 17,867 xp a member (§8). The shares below are a first cut, and §8 says
  how they stand against the curve.
- **Side quests** are #56's 45 to 48, placed and built as §6 has them (#506).
- **Finds.** No step of the gear ladder is here (#542): Rime Lodge's rung is behind and
  Cinderport's ahead, so the boxes place gold, potions and a plus or two on Rimewater's rung, each
  inside the band's price window of 5,000. **Lines** are drafts, two to an event (DESIGN §11).

### 4.2 J11, Monks' Vale (#499): core, band 22–23

- **Purpose.** The first box below the pass, and Act IV's first ground: the vale under the crest
  with the monastery on its shelf, the bells heard across the snow before it is seen, the area's
  gentlest groups and the crossing line that tells a company under the band how the range feels
  (#166). Monks' Vale's step of the quest (§5).
- **Landmarks.** The pass's road down from the north edge at 318,318 through hills and grass to
  Highcell's gate at 322,342, the way into #500; the monastery on its shelf against the mountain,
  drawn tall over its square as a landmark is; the crest along the box's west with the snow on it,
  and the path up to Spine Summit at 300,328; the herder's fold at the vale's edge.
- **Points of interest,** about eight features and six groups:
  - the gate, and the brother at it: the step (§5);
  - the bells, heard from the pass's foot: an event on the road, the step's first line;
  - the summit's path, and the hermit at Spine Summit, the Monk's third (#448);
  - the herder, who loses lambs to the eagles (#56's 46);
  - a camp in the lee of the shelf, a cairn at the pass's foot and a shrine by the road, the
    monks', its bell on a post with no rope (#45).
- **Encounters.** Brothers walking the road to the gate (two groups, the gentlest at the pass's
  foot: MONSTERS §8.1's soldier, which a company that fought the bay's keepers knows the walk of);
  spine eagles over the hills; a snow troll in the snow on the summit's path, the box's hardest, at
  the far end from the pass.
- **Quests.** The step. The Eagles' Nest begins here (§6). The Monk's third prestige's quest, The
  Vigil, built (§6, #448).
- **The secret and its hint.** Behind the shelf the brothers' path runs on past the monastery's
  wall to a blank face of rock, and the rock opens: a store cut into the mountain, the robes of
  Highcell folded on shelves by the dozen, and the gear of the monks who wore them first. Found,
  never told. The hint: the snow behind the wall is trodden in one straight line to the rock face,
  and no print turns off it; by night a brother is seen walking it.
- **Lines:**
  - the bells: *Across the snow, bells. Eleven, with gaps between, and then eleven again.*
  - the gate, the step: *The gate stands open. A brother at it bows, and the bow is a shape
    someone described to it.*
- **New here.** Peaks underfoot and the road through them (#543); a machine in a robe; the bells.
- **Finds.** A plus on Rimewater's rung in the store, and 400 gold.
- **Pay.** About 1,800 xp a member.
- **As built** (#499, 9 October): the brief's places, with five groups for its six, laid whole in
  Monks' Vale at band 22–23 (§1). The pass was taken, not walked, until J10 was laid (§9, #499's 3;
  #508's 7): the road is walked now from K10's west edge at 0,19 (328,305) onto J10's 31,19, across
  J10's corner to its south edge at 20,31 and onto this box's 20,0 (316,318), the road's first
  square; the start stays at 20,1, the second (§9, #508's 9). K10's milestone still reads MONKS'
  VALE 6: 72 squares, now walked across J10. Going over, a company hears *Monks' Vale.* at K10's
  edge and, two under the floor, in the range's own words on its atlas row, *The range begins here,
  and it is harder than the lochs behind.* (three under, *The range, and nothing in it would spare
  you. The way back over the pass is still open.*); going back it hears nothing straight away, and
  *Loch Fuar.* when it comes to K10's edge from elsewhere, as at any walked border, and nothing is
  said where J10's road meets this box (§9, #499's 4; #508's 8). The road runs square to square
  from 20,0 to the gate's front at 26,23, four squares added at its diagonal steps (§9, #499's 2).
  The north edge meets J10's south row, hills, grass and pines at 13 to 22 on both sides, walked,
  and the south edge J12's north row, hills at 19 to 31 on both sides, walked (J11's 18 is hills
  against J12's mountain); the east edge ends the world against K11, pinned in
  `tools/tests/outdoors.ts` with void past it; the west edge is I11's now (§4.4). Down
  off the pass the bells
  (`j11_bells`, 19,2) and, at 17,4, a cairn with 300 gold and a Sapphire Vial. By the road the
  monks' shrine at 21,10 (personality), and east of it the pilgrims' hostel, a building of 2 by 2 at
  24 to 25, 12 to 13, its event at the front, 23,13 (§9, #499's 14). West, snow lying in drifts
  along the crest's foot, a path up it into the snow at 13,12 and Spine Summit at 4,10, a camp, with
  Oswin, the summit's hermit, at 3,10, the Monk's third's trainer (§6, #448); at the vale's east edge the herder at 27,19, who
  gives The Eagles' Nest (§6, #506), and his fold, a ring of rock at 28 to 30, 18 to 20 (§9, #499's 13). The monastery fills rows
  24 to 28 and columns 20 to 29 of its shelf, with two bell towers over its wall (29,22) and the
  camp in the shelf's lee at 21,23; its gate at 26,24, the brother standing in it as the brief's
  line has it, was barred until #500 and is the way into Highcell now (§4.3; §9, #499's 5 to 7,
  #500's 8). Five groups: brothers, 3, at the
  pass's foot, 19,6, the gentlest; spine eagles, 4, west of the road at 15,9 and 4 east of it at
  25,8; brothers, 4, on the road to the gate, 23,19; and two snow trolls at the far end of the
  summit's path, 6,10, who do not roam, the box's hardest at 23 (§9, #499's 8). A sixth, the
  vigil's, comes only by night once Oswin is answered: five brothers at 5,10, beside the summit's
  camp, who do not roam and do not come back (§6; §9, #448's 2). The store is cut
  into rock, not mountain, so a Mountaineer's climb does not reach it: the secret door at 16,29 is
  drawn as rock, the blank face, and behind it at 14,29 and 15,29 are the robes of Highcell folded
  by the dozen and the chest, 400 gold and a second Guide's Staff +1 (`guides_staff+1`, Rimewater's
  rung). The hint is the trodden line, row 29's snow from 29,29 west to the rock (`j11_trodden`),
  and by night a brother walking it (`j11_walker`) (§9, #499's 10 and 11). The cairn and the store
  hold 700 gold between them. It departs from the brief in the monastery, a block of building
  squares and not drawn tall over one square (§11); in the gate, barred until #500 opened it; and
  in the hostel, which is only kept wrongly where the issue made its cellar the secret (§11). The
  step is the chapter's (§5, #505); the Eagles' Nest is built (§6, #506) and so is the hermit's
  vigil (§6, #448; §9, #499's 16).
  - **Measured.** A company at 22 wins every fight, the vigil's counted, and manages 8.69 fights to
    a rest, inside the aim, with 38.7% of its days ending in a fight broken off (10.50 and 15%
    before the vigil); it walks Monks' Vale's road, past the
    brothers at the pass's foot and on the road, every time. J11 pays 2,791 xp a member and 700
    gold, and the vigil's brothers 727 more to a company that keeps it. Two under, at 20, it wins
    every fight too, owed to #18 as Rimewater's boxes' is. Density
    99.1% within 8 steps (419 of 423, with the three squares I11 opened) and the furthest 9, with
    no sign among its 24 points. It claims peaks underfoot as new (§7).

### 4.3 Highcell (#500): dungeon, two levels of 16×16, band 22–24

- **Purpose.** The area's dungeon: a monastery still kept, four hundred years after its monks died,
  by the Custodian's hands in their robes (MONSTERS §8.1). It sells and teaches nothing (#443,
  call 7): its brothers are machines, and the one living man in it hides.
- **Landmarks.** The upper house: the cloister, the cells each with its brother at its hours, the
  refectory with nothing eaten in it, the Novice's cell (#56's 45) and the bell tower's foot, with
  the stair up to the bells and the Laureate hiding among the ringers, the Bard's third (#448). The
  lower house: the chapter house, where the Abbot keeps the hours, and the undercroft behind it.
- **Points of interest,** about seven features and eight groups a level, as the Foreland's
  dungeons are held: the well, the cells, the board, the tower's stair, the seat, the niches.
- **Encounters.** Brothers in the cloister and the cells; the chapter house, brothers in front of
  two bell-ringers, the bells holding the front row while the brothers close, and the cleric's
  light doing nothing (MONSTERS §8.1's first fight); the Abbot, boss, level 24, whose robe falls
  open as it falls.
- **Quests.** The step (§5). The Novice (§6). The Bard's third prestige's quest, The Eleven, sung
  in the tower, built (§6, #448).
- **The secret and its hint.** The undercroft under the chapter house, through the wall behind the
  Abbot's seat: the monks of Highcell in their niches, one to a niche, every niche filled and the
  last one's lip cut with a tally in Kiln-script, which a dwarf or a Linguist reads as a count that
  ends on eleven. The hint: the Abbot's seat stands a hand off the place its feet have worn in the
  floor.
- **Lines:**
  - the cells: *A brother in each cell, standing. Not one of them is praying.*
  - the undercroft: *Every niche is full. The last is cut with a count, and the count ends on
    eleven.*
- **New here.** A caster whose spell is a bell (paralysis, 0.2); holy light that does nothing; a
  house still kept by what killed nobody.
- **Finds.** Two of Rimewater's rung with a plus in the undercroft (#542), and 600 gold.
- **Pay.** About 2,600 xp a member.
- **As built** (#500, 9 October): two levels of 16 by 16, hand-built, the upper house at band 22–24
  (the area's floor, the brief's 23 less one) and the lower at 23–24 (§9, #500's 2). **The upper
  house** (`monastery`): J11's gate, open now (§4.2), lets a company in to 7,1 facing south, past
  the brother in it, and lets it out onto the road's end before the gate, facing north. Inside the
  wall, at 7,2, a cloister swept bare round a garth of snow, with the well (8,6), its bucket dry. By
  the refectory door (5,4) a board of the hours in the old script, which marks nothing (§9, #500's
  13); in the refectory (2,5) the tables laid and every bowl empty. Along the east walk the cells, a
  brother standing in each (11,5), and three brothers keeping the hours before them (11,7); in the
  last cell the Novice (14,9), who gives The Novice, and in the first (14,3) a brother who takes
  the Eagles' Nest's badge (§6, #506). At the south walk's west end the bell tower's foot (3,11)
  and its stair winding up (1,13); under the bells (4,13) the ringers at their ropes, the bells
  ringing eleven, a gap, eleven, each time a company comes by, and one who pulls a beat behind the
  rest (6,14), thin, in a robe that is not his: Brother Lark, the Laureate, the Bard's third's
  trainer (§6, #448). Four bell-ringers come
  down the stair (1,12). At the walk's east end the night stair goes down (12,12; the way down is
  13,13). **The lower house** (`monastery2`): the night stair comes down to 7,1 facing south, and
  the way up lands on the cloister's 12,13 facing west. It opens at 7,3 on the chapter house,
  benches round its walls under a vault on four columns; brothers stand in front of two
  bell-ringers (7,6), and at the far end on a seat cut from one stone the Abbot keeps the hours
  (7,9): level 24, 1,700 hit points, 19d8+16, a boss that does not come back. When it falls its robe
  falls open on grey plate and the bells overhead ring the hour all the same. The hint is the seat
  (7,10), which stands a hand off the hollows its feet have worn in the floor. The secret, searched
  for at the seat, is the wall behind it (7,11), which gives on the undercroft, two rows of rock (12
  and 13): niches cut down both walls, a monk of Highcell laid in each and every niche full (7,12),
  and the last niche's lip cut with marks in the old script (13,12), a count that ends on eleven,
  which a dwarf or a Linguist reads (§9, #500's 14). At the far end the monks' things (2,13) in a
  chest: 600 gold, an Ice Axe +1 and a Skinning Knife +1.
  - **Seams.** J11's gate, 26,24 (322,342), to `monastery` 7,1 facing south, and back from 7,1 to
    J11's 26,23 facing north; the night stair, 13,13, to `monastery2` 7,1 facing south, and back
    from 7,1 to 12,13 facing west. The secret wall is 7,11. There is no other way in or out.
  - **Measured.** A company at 22 wins every fight in the upper house and manages 11.80 fights to a
    rest, over the aim (8.5 to 10.5) and inside the limit (7 to 13), with 5% of its days ending in a
    fight broken off; two under, at 20, it wins every fight too, owed to #18. In the lower house a
    company at 23 wins 83% of the fights, the Abbot counted, off the aim of 90% and inside the limit
    of 80%; it manages 10.99 fights to a rest, a little over the aim (8.75 to 10.75) and inside the
    limit (7.25 to 13.25), with 3.7% of its days broken off, and the Abbot is won 66% at 23 and 93%
    at 25, set off the boss line (§9, #500's 6). Highcell pays 4,183 xp a member for the brief's
    2,600 and holds 600 gold. Density 100.0% within 7 steps on both levels, the furthest 5 on both,
    with one sign among their 15 and 9 points. The curve's rank correlation is 1.00 on both: in the
    upper house the brothers nearest at 10 steps, level 22, and the ringers on the stair the hardest
    at 17, level 23; in the lower the chapter house nearest at 5, level 22.5, and the Abbot the
    hardest at 8, level 24.

### 4.4 I11, the Peak Stone's box (#501): core, band 22–23

- **Purpose.** The High Spine's first box: over the crest from the Vale into the pines, and the
  Peak Stone on the crest at 292,318, whole and steady, the first whole Stone since the Lodestone.
  The ridge trail north begins here (#443, call 3).
- **Landmarks.** The Stone at the box's north edge on the crest, its light steady; the snow line
  across the box, pine below and bare rock above; the Sheer's cliff along the west edge, with a
  lookout over Ashfall where Fire Mountain smokes; the eagles' nest in the peaks above the Stone
  (#56's 46); the ridge trail leaving north for I10 at 286,300.
- **Points of interest,** about eight features and six groups:
  - the Stone, and the brothers who keep it;
  - the nest, and what is in it (§6);
  - the lookout west, the far side seen;
  - a camp under the snow line, a cairn where the trail leaves and the monks' shrine at the
    Stone's foot (#45).
- **Encounters.** Spine eagles (two groups, one at the nest, which takes the light out of the sky
  as it comes down); brothers walking from the monastery to the Stone and back; a snow troll in the
  snow on the crest, the box's hardest.
- **Quests.** The Eagles' Nest (§6).
- **The secret and its hint.** The snow never lies round the Stone: a ring of bare rock, warm to
  the hand. One slab in the ring lifts, and under it is the Lanterns' survey marker, lit, left by
  the Lantern who never came down, and her instruments. The hint: every stone in the ring is
  frosted at its edge but one.
- **Lines:**
  - the Stone: *Whole, and steady. The snow stops a yard short of it all the way round.*
- **New here.** A whole Stone with its field about it; the cliff seen from its top (#543).
- **Finds.** The Lantern's instruments, a thing the Lanterns' halls take (#56's 46); 300 gold.
- **Pay.** About 1,600 xp a member.
- **As built** (#501, 9 October): the brief's places, with four groups for its six, laid whole in
  the High Spine at 264,318, band 22–23 (§9, #501's 1 and 8). The box is its whole 1,024 squares,
  Monks' Vale's 154 on the crest at the east and Ashfall's 187 under the Sheer at the west, and its
  crossing line names the High Spine: going over the crest a company hears *The High Spine.* and,
  two under the floor, in the range's own words, *On the crest the wind is at you, and nothing up
  here is any kinder.* (three under, *Nothing on this crest would spare you. The way back is still
  open.*); going back it hears nothing (§9, #501's 3; #503's 4). The seam with J11 is walked,
  not taken: J11's row 10 is opened at 0 to 2, from mountain to snow, and I11's row 10 is snow from
  31,10 west to the snow line at 22,10, so the summit's path goes on over the crest; no exit is
  added (§9, #501's 2). The ridge trail leaves by the north edge at 27,0 (291,318), a square from
  the scaffold's 28,0, to meet the atlas's trail beyond at 291,317, which I10 takes on (§4.5); the
  west edge ends the world against H11, pinned in `tools/tests/outdoors.ts` with void past it, and
  the south edge meets I12's north row, the pines walked and the Sheer at 7 and 8 (#508, §4.8; §9,
  #501's 4). The Stone stands at 28,0 (292,318) on bare rock beside the trail's
  square, in a ring of bare stone, a 3 by 3 at 27 to 29, 1 to 3, its stones set round it as rocks
  and the ring entered from the snow line through a gap at 26,3; the Stone is on the north edge, so
  the ring was open to I10 there (§9, #501's 6), which closes it round on its row 31 (§9, #502's
  17). Its once event, *The Peak Stone. Whole, and steady. The snow
  stops a yard short of it all the way round.*, is what counts it for the Hearth (§9, #501's 5).
  The brother who keeps it (`i11_keeper`, 28,1) is a thing seen, the snow on its shoulders that does
  not melt; at the Stone's foot the monks' shrine at 29,1 (endurance, its eleven pebbles) and, just
  south of the trail's square, the cairn at 27,1, holding a Sapphire Vial (§9, #501's 12 and 15). The
  slab, a secret door, is the ring's corner stone at 26,4, beside the gap; the hollow under it, 26,5
  (the Lanterns' survey marker, lit) and 26,6 (a chest: the Lantern's Instruments and 300 gold), is
  walled in rock, so no climb reaches it. The hint stands at the gap, 26,3: *Every stone of the ring
  is frosted along its edge but one.* (§9, #501's 7). The nest is an event at 29,8 and a chest at
  30,8 (the Lantern's Badge and a Smooth Grey Part), up a spur off the crest path at 29,9 to 10, the
  eagles on the spur (§9, #501's 10 and 11). The snow line runs down the crest's flank from row 1 to
  row 26, pines below it and rock above, the camp, The last pines, at 20,12 under it (§9, #501's
  14). The Sheer is kept as the atlas cuts it: the cliff, 2 wide, down the west, Ashfall's grey
  pines, grass, hills and ash beyond it, reached by a Mountaineer's climb down and, from I10, down
  the Stair; the lookout at its top, 6,9, sees Fire Mountain, and three events carry the density
  below it (§9, #501's 13).
  Four groups: spine eagles, 4, at the nest, 29,9, the nearest, who do not roam; brothers, 4, on the
  snow line between the crest path and the Stone, 23,5; spine eagles, 4, over the snow line south of
  the path, 22,14; and snow trolls, 2, in the snow at the crest's foot, 22,21, who do not roam, the
  box's hardest at 23, at the far end. It departs from the brief in the band, 22 to 23 and not 23,
  and in its groups, four for six (§9, #501's 1 and 8). The Eagles' Nest's hand-ins are built
  (§6, #506).
  - **Measured.** A company at 22 wins every fight and manages 10.12 fights to a rest, inside the
    aim, with 14.3% of its days ending in a fight broken off; it walks the High Spine's road, past
    the brothers, every time. I11 pays 2,355 xp a member and 300 gold. Two under, at 20, it wins
    every fight too, owed to #18 as J11's is. Density 99.5% within 8 steps and the furthest 9, with
    no sign among its 26 points. It claims cliffs as new (§7).

### 4.5 I10, Stairwatch and the Stair's head (#502): core, band 22–24

- **Purpose.** The High Spine's step of the quest: the Giants' Stair's head in the Sheer at
  272,306, the giants at it, the Stair-king and his toll, and the road down into Ashfall. Stairwatch
  above it, the Knight's third (#448).
- **Landmarks.** Pines over most of the box, the Sheer's cliff down the west with the Stair cut
  into it, the road through the cliff (#543), going down out of the box at 258,306 for Ashfall's H10
  (#510); the king's seat at the head, a slab the size of a house; the giants' fires above, in J10
  (#508, built); Stairwatch, a ledge above the head at 270,312, its way up found off the Stair; the
  ridge trail across the box's east at 286,300.
- **Points of interest,** about nine features and seven groups:
  - the head, the king and the toll: the step (§5), and the choice (#544);
  - the caravan that cannot pay, drawn up short of the head (#56's 47);
  - Stairwatch, and the old champion on it (#448);
  - the king's hoard, under the seat;
  - a camp back in the pines, a cairn at the trail's crossing and a shrine at the head, older
    than the monks' (#45).
- **Encounters.** The Stair in snow: a giant and a snow troll, one sweeping the front row (#545)
  and one getting up again unless burned (MONSTERS §8.1's second fight), on the road short of the
  head; eagles in the pines; the Stair-king at the head with two giants, boss, level 24, who asks
  before he fights; the giants are `kind: person` and break when he falls (#443, call 1).
- **Quests.** The step. The Toll (§6). The Knight's third prestige's quest, The Ledge, a night on
  the ledge, built (§6, #448).
- **The toll** (#544). The king puts his price before the fight the way a business puts its menu:
  pay, and the company walks down the Stair, the giants standing aside; refuse, and the fight is
  his and theirs. The price and its remembering are §9's.
- **The secret and its hint.** Stairwatch's way up: a chimney in the rock behind the pines above
  the head, climbed to the ledge where the old champion keeps his watch on the Stair; the quest
  marks the place (DESIGN §5), and the way is the secret. The hint: smoke from the cliff's top
  where nothing stands, and a rope's wear on one rock at the pines' edge.
- **Lines:**
  - the head, the step: *A stair cut in the cliff, each step the height of a man. At its head a
    giant sits, and holds out his hand.*
  - the toll: *Toll. We have taken it since we were set here, and nobody has come to say stop.*
  - the hoard: *Coin of Helmstow on top. Under it, coin with no face. Under that, nothing.*
- **New here.** The giants, a new family (#507); the toll, a choice before a fight (#544); sweep
  (#545); the cliff with the road through it (#543).
- **Finds.** The king's hoard: 1,200 gold in coin of every age, and a plus on Rimewater's rung.
- **Pay.** About 2,400 xp a member, the king's share only on refusing the toll.
- **As built** (#502, 9 October): the brief's places, with three groups for its seven, laid whole in
  the High Spine at 264,286, band 22–24 (§9, #502's 1 and 9). The box is its whole 1,024 squares:
  pine 586, mountain 178, peak 91, road 56, cliff 46, rock 26, snow 19, cut stone 16, ash 2 and 4 in
  the hollows and the chimney, 990 of them the High Spine's, 31 in the north-east corner Loch Fuar's
  and 3 in the north-west Cindercoast's, none of those walked (§1). The seam with I11 is walked, the
  ridge trail going on from I11's 27,0 (291,318) to I10's 27,31 (291,317), and nothing is said
  there, the floor being 22 on both sides (§9, #502's 1); the mountain closes the Stone's ring round
  on I10's row 31, the trail its one way north (§9, #502's 17). The trail goes on through the pines
  to the north edge at 18,0 (282,286), where the atlas's meets it at 282,285 and I9 takes it on
  (§4.6; §9, #502's 16). The road leaves the trail at 23,20 and runs west to 8,20, the atlas's link
  end (272,306); the head is cut stone at 2 to 7,20, 3 to 7,21 and 5 to 7,19, and the Stair, road
  at 1,20 and 0,20, goes down through the Sheer to the west edge (0,20 is 264,306), where Ashfall's
  ground lies at the cliff's foot, 0,21 to 0,31, and runs south into I11's. The east edge meets
  J10's west edge (#508), the range on both sides and nothing walked, pinned in
  `tools/tests/outdoors.ts`, the south and north edges are pinned against I11's and I9's and the west edge meets H10's east edge square for square, the
  Stair going on down onto H10's 31,20 (#510; §9, #502's 7). Short of the head, west along the road:
  a caravan drawn up,
  its master at 18,19 and the wagons at 18,21, and then the Stair in snow at 13,20, a giant and a
  snow troll in a drift (rows 18 to 22, columns 10 to 16); the master's girl is at the head, 6,19,
  off the road, and by the wagons, 19,19, once the toll is answered or the king is down (§6, #506). The drift at 12,21, *The wind did not lay it.*, and burnt bones by the trail at
  20,16 are things seen (§9, #502's 8 and 12). At the head a toll-stone at 4,21 bears a ring with a
  bar across it, cut small under its lip, and a shrine older than the monks' at 7,21, of might,
  holds out a stone hand (§9, #502's 13 and 14). The king's seat is a slab of rock (2 to 4,17 and 3
  to 4,18 to 19), and his group, `i10_king`, the king and two giants, stands at 2,20, the Stair's
  top step, so that no company goes down unasked: the Stair is reached from the top only through
  that square (§9, #502's 4). *The king holds out his hand from the seat. "Toll. We have taken it
  since we were set here, and nobody has come to say stop."* A company may pay 1,500 gold, give him
  the grey part from I11's nest, give him the faceless coin of #56's 9, or refuse, and the fight is
  his and theirs; the three that satisfy him set `toll_paid`, `toll_part` or `toll_coin`, which The
  Toll reads (§6, #506), and the giants step off the Stair and stand aside (§9, #502's 5). Below the king's
  square, at 1,20, the way down is seen once the toll is answered or the king is down (`i10_top`),
  and the chapter ends there (§5, #505). Under the seat,
  walled in rock (the Sheer's cliff at 1,18 and 1,19 is made rock, so no climb reaches it), the
  hollow of his hoard: at 2,19 *Coin of Helmstow on top. Under it, coin with no face. Under that,
  nothing.*, and at 2,18 the chest `i10_hoard`, 1,200 gold and a Bear Spear +1, Rimewater's rung at
  2,050, the area's dearest find. Its one mouth is the king's square, so a company that paid walks
  through it and can rob the hoard (§9, #502's 6). South of the head, Stairwatch: rock at 3 to 8,24
  to 25, 4,26, 7 to 8,26 and 4 to 7,27, and in it a chimney, a secret door at 6,24 off the pines,
  its shaft at 6,25 and the ledge at 5,26 and 6,26, where Edric, the old champion, stands (5,26),
  the Knight's third's trainer (§6, #448), and the
  ledge's event, `i10_ledge`, is at the atlas's site, 6,26 (270,312). The hints are smoke at 9,22
  and the rope's wear at 6,23, the secret's declared hint (§9, #502's 11). The camp, The drovers'
  fire, is in the pines at 11,28 and the cairn at the trail's crossing, 22,21, holds a Sapphire Vial
  and no gold (§9, #502's 14). Three groups: spine eagles, 3, in the pines nearest the way in,
  17,25; the Stair in snow, a Stair Giant and a snow troll at 13,20, who do not roam; and the
  king's, the box's hardest at 23.3, who do not roam and do not come back. Two more come only by
  night once Edric is answered, the toll-takers up the shaft at 6,25, two Stair Giants and, once
  they are down, two more, who do not roam and do not come back (§6; §9, #448's 2). It departs from the brief
  in the band, 22–24 and not 23–24, in its groups, three for seven, and in its secret, the issue's
  maintenance mark being a thing seen on the toll-stone and the doc's chimney the door (§9, #502's
  1, 9 and 13). The Toll is built (§6, #506) and so is Edric's night (§6, #448).
  - **Measured.** A company at 22 wins 91.6% of the fights, the king and the toll-takers counted,
    and manages 10.59 fights to a rest, just over the aim and inside the limit, with 2.7% of its
    days ending in a fight broken off (86%, 11.72 and 7.7% before the toll-takers); it walks the
    High Spine's road, past the giant and the troll in the snow, every
    time. The king is won 58% at 22 and 79% at 24, the gate's floors for him; measured as the gate
    measures a fight, from 21 to 25 he is won 7%, 58%, 56%, 79% and 97%. Two under, at 20, the box
    is won 80.8%, inside the limit, so nothing is owed. I10 pays 4,197 xp a member, 1,046 to a
    company that pays the toll, and 1,920 gold a clear, and the toll-takers 1,218 xp a member and
    about 460 gold more to a company that holds the ledge. Density 99.7% within 8 steps (681 of
    683) and the furthest 9, with no sign among its 34 points. It claims the giants as new (§7).

### 4.6 I9, the ridge north (#503): country, band 22–23

- **Purpose.** The ridge trail along the crest from the High Spine into Sheer Point: the first of
  the Point's boxes, with its crossing line, and the Hearth seen ahead over the sea for the first
  time close.
- **Landmarks.** The trail along the crest in snow, from 282,280 to 284,262, with cairns a company
  steers by in cloud; peaks either side; the pines below on the east; a lookout north where the
  Point runs out and the Hearth stands over the water; the first of the sea at the box's north
  edge.
- **Points of interest,** about five features and four groups:
  - the trail's cairns, one with a cache, and a camp in the lee of the crest (#45);
  - the lookout north, the Hearth close;
  - a hermit under the peaks, who has watched the Hand's boats go round the Point.
- **Encounters.** Snow trolls in the snow (two groups, the second two together, the box's
  hardest); spine eagles off the peaks; ashen masons coming up the trail with a sledge of cut stone,
  the Hand's traffic to the causeway, the first of them on the road.
- **Quests.** None of its own; the chapter's goal points on north (§5).
- **The secret and its hint.** A cave under the crest where the trolls lie up, and what they have
  taken from travellers over the years. The hint: the snow at one cleft is trodden to ice, and
  nothing else on the ridge is.
- **New here.** Nothing; the ridge is the walk.
- **Finds.** The trolls' takings: 500 gold and a plus on Rimewater's rung.
- **Pay.** About 1,400 xp a member.
- **As built** (#503, 9 October): the brief's places, with three groups for its four, laid whole in
  Sheer Point at 264,254, band 22–23 (§9, #503's 1, 2 and 8). The box is its whole 1,024 squares:
  pine 356, mountain 302, peak 272, road 36, snow 16, cliff 15, shallow 11, rock 7, sea 5, sand 1
  and 3 in the cache and the crack; by the atlas's cut 278 are Sheer Point's, 547 the High Spine's,
  194 Loch Fuar's and 5 no zone's (§1). The seam with I10 is walked, the pines open across it, the
  Sheer at 0 on both sides and the ridge trail going on from I10's 18,0 (282,286) to I9's 18,31
  (282,285). The crossing line names Sheer Point: going north a company hears *Sheer Point.* and,
  two under the floor, in its own words, *Out here the land runs thin toward the sea, and nothing
  on it is any kinder than the range.* (three under, *Nothing on the Point would spare you. The way
  you came is still open.*); the floor is 22 on both sides, so nothing rises; straight back it
  hears nothing (§9, #503's 2 and 3). The trail goes up the crest to the north edge, at 18 from row
  31 to 16, at 19 from 15 to 7 and at 20 from 7 to 0, out at 20,0 (284,254), where the atlas's
  meets it at 284,253 and I8 takes it on (§4.7; §9, #503's 5). The west and east edges end the world
  against H9 and J9, pinned in `tools/tests/outdoors.ts` with void past them, and I10's north edge
  is pinned against this south one and I8's south edge against this north one (§4.7). Up the trail
  the Hearth's heat grows: at 18,28 the wind comes warm out of the north and the snow is wet; at
  19,15
  the snow is gone off the rocks; at 20,2 the Hearth stands up out of the water, *so close its heat
  is on your face*; at 20,1 a road of cut stone runs out over the sea, *and every stone of it
  catches the light*, the causeway seen and no word of the shards (§9, #503's 13). On the crest at
  18,18 stands a cairn of stones a cart could not carry, *They were set, not rolled.*, the giants'
  (§9, #503's 14), and at 20,13, cut in the peaks beside the trail, the cairn to steer by in cloud,
  with a Sapphire Vial and no gold (§9, #503's 12). West of the trail a gully of snow is cut
  through the crest's shoulder (16 to 17,19; 13 to 17,20; 15 to 17,21) from the pines to the trail,
  and the snow trolls lie in it, at 15,20, not roaming; at its mouth, 12,20, *The snow in the
  gully is trodden to ice, and nothing else on the ridge is.*, the brief's hint as a thing seen
  (§9, #503's 6 and 7). Off the trail on a shelf of snow cut in the peaks (18,9; 17 to 18,10; 17 to
  18,11) is the masons' first camp, at 18,11, its fire long out, *Hammers lie on a stone, put down
  and never taken up.* At 17,10 a tally is cut in the rock face in fives, its last row running on
  into a crack, the secret's hint; the crack is a secret door at 16,10, and behind it the cache,
  walled in rock (14 to 16,9; 13,10; 14 to 16,11) so that no climb reaches it: at 15,10 *In the
  straw, shards of every colour, laid in fives.*, seen and not taken, and at 14,10 the chest
  `i9_cache`, 500 gold and a Hunter's Bow +1, Rimewater's rung at 2,050 (§9, #503's 6). The
  masons' sledge, loaded with cut stone, stands on the trail at 20,6, and the masons at 20,4 past
  it. In the pines, west of the crest and not east as the brief has them: the camp, The lee of the
  crest, at 13,25; a shrine of luck at the Sheer's edge, 1,19, a lamp kept burning; the hermit,
  words only, under the peaks by the shore, 8,7, who has watched the Hand's grey boats round the
  Point by night; and things seen, steam on the sea at 4,2, a warm hollow the size of a cart at
  8,14, Ashfall's coast far down from the Sheer at 1,27 and the eagles' kill at 8,30 (§9, #503's
  12 and 14). Three groups: spine eagles, 4, in the pines by the way in, 15,28; snow trolls, 2, in
  the gully, 15,20, who do not roam, the box's hardest at 23.0; and Ashen masons, 4, at the trail's
  end, 20,4, past their sledge (§9, #503's 8). It departs from the brief in the band, 22–23 and not
  23, and in its groups, three for four. Its secret is the issue's, the masons' cache being the
  door and the doc's trolls' cave not built (§9, #503's 2, 6 and 8).
  - **Measured.** A company at 22 wins every fight and manages 9.43 fights to a rest, inside the
    aim, with 21.3% of its days ending in a fight broken off; it walks Sheer Point's road, past the
    trolls and the masons, every time. Two under, at 20, it wins every fight too, owed to #18 (§9,
    #503's 11). I9 pays 1,800 xp a member and 790 gold a clear. Density 100.0% within 12 steps (all
    412 squares, 371 needed) and the furthest 10, with no sign among its 22 points. It claims
    nothing as new (§7).

### 4.7 I8, Sheer Point (#504): core, band 22–24

- **Purpose.** Sheer Point's step of the quest, and the act's turn: the finger of land toward the
  Hearth, the Hand's causeway of cut stone running out over the water, every stone a stolen shard,
  the camp on its shore where Wenna waits for the company, and the night she is taken. Rook's Nest,
  the Thief's third (#448).
- **Landmarks.** The trail's end at 286,236; the Point's tip, mountain and peak falling to the
  shore; the causeway from the shore out into the sea, cut stone a square wide, as far as the
  Hand has built it, the Hearth's light on the water beyond; the Hand's camp on the shore, the
  causeway's camp; Rook's Nest at 286,230, a hide on the tip over the causeway; the rocks where the
  deserter hides (#56's 48).
- **Points of interest,** about eight features and six groups:
  - the causeway's first stone: the step (§5), and after the night, the knot;
  - the camp, and Wenna at it (§5);
  - Rook's Nest, and the one who waits there (#448, #22);
  - the deserter in the rocks, and his tally (#56's 48);
  - the masons' tally-house at the causeway's root; a cairn on the tip and a Tidefolk shrine at
    the shore, its bowl full of shells (#45).
- **Encounters.** Ashen masons on the causeway (two groups, MONSTERS §8.1: a hammer from below and
  a shard to set), the second with their foreman the box's hardest; spine eagles over the tip; a
  snow troll come down to the shore by night (`when`).
- **Quests.** The step. The Mason's Tally (§6). The Thief's third prestige's quest, Whose Hand,
  which goes down to the Dead-Drop, built (§6, #448).
- **Wenna** is a person who moves (#76; §9, 2): at the camp when the company comes, never in a
  fight. Resting there sets `q_wenna_taken`, and the company wakes to the boat going out along the
  stones and her knot on the first one: one once-event, no counter.
- **The secret and its hint.** A sea cave under the tip, below Rook's Nest, where the Hand keeps
  its boats, and in it the shards not yet cut and the Hand's seal on their crates. The hint: oars
  heard under the rock by night, and the boat that goes out along the stones comes from nowhere the
  company saw.
- **Lines:**
  - the causeway, the step: *A road out over the water, of cut stone. Every stone glows a little,
    the way the shards do.*
  - the first stone: *Scratched fresh, at the height of a girl's shoulder, a loop inside a loop.*
- **New here.** The sea reached from the range; a causeway over water; a person taken.
- **Finds.** A shard from the cave, a quest item for #548's Stone; 400 gold.
- **Pay.** About 1,500 xp a member.
- **As built** (#504, 9 October): the brief's places, its secret the doc's sea cave, laid whole in
  Sheer Point at 264,222, band 22–24 (§9, #504's 1, 2 and 9). The box is its whole 1,024 squares:
  mountain 307, sea 270, hills 142, peak 121, shallow 89, pine 35, road 20, dirt 13, rock 7, stone
  6, sand 6, grass 6, the hut 1 and the door 1; by the atlas's cut 757 are the Point's and 267 sea
  in no zone (§1). The seam with I9 is walked, the shallows at 2 to 3 and the pines at 4 to 6 open
  across it, and the ridge trail goes on from I9's 20,0 (284,254) to I8's 20,31 (284,253); the zone
  and the floor are the same, so nothing is said going or coming back. The trail runs at 20 from row
  31 to 27 and at 21 from 27 to 14, to its end at 22,14 (286,236), the atlas's, with the rock warm
  under it at 21,24; from its end the masons' track, dirt, goes down through the rock to the tip's
  hills at 20,9 (§9, #504's 3). The north and west edges are the sea and the east edge the tip's
  hills and the pines against J8, pinned in `tools/tests/outdoors.ts` with void past them, and I9's
  north edge is pinned against this south one; nothing leaves the box. The causeway is cut stone, a
  square wide, from its first stone on the shore at 17,6 to 17,1 (281,223), over deep water one
  short of the north edge: as far as the Hand has built it, the Hearth's light beyond (§9, #504's
  4). At its root the masons' tally-house, a hut of the same stone, at 18,6; on the causeway a stone
  at 17,4 is cut deep with THE SKY IS A LID, plain, with no reading and no word of it elsewhere. The
  step is the first stone's, in the doc's line, and after the night the doc's other line shows on it
  as the knot (§9, #504's 13). Wenna goes on ahead: by the lodge's fire until the company is in
  Monks' Vale, at J11's gate, 27,23, until it is on the Point, and then at the camp, The shingle
  fire, 14,8, standing at 13,8 until she is taken (§9, #504's 8). The game has no hook for a rest at
  a camp, so the night is her question: her first words end in *Sleep by her fire?* and Sleep sets
  `q_wenna_taken` (`WENNA_TAKEN`, exported from `maps/sheerpoint_i8.ts`), with *One of you is
  shouting at the water. Her blanket by the fire is cold.* and *Out along the stones a boat is
  going, rowed hard, and none of you saw where it put out from.*; Not yet sets nothing and she asks
  again. The camp's own rest does not take her: that wants a camp `nights` like the inn's, a systems
  change, the owner's to ask for, and the chapter's step (#505) reads `q_wenna_taken`, which only
  this choice sets (§9, #504's 7; §11). Rook's Nest is a hollow high in the tip's rock at the
  atlas's site, 22,8 (286,230), its mouth onto the hills at 22,9, and the watcher in it, at 21,7, is
  Hereward, who teaches the Thief's third for a set of the Compact's orders and whose hand writes
  them (§6; §9, #504's 11; the Ranger's and the Thief's 1 to 4). At the hollow's
  back, 22,7, the rock is wet and smells of the sea, the hint (`i8_damp`, always there), and by
  night oars are heard under it (`i8_oars`); the wet rock hides a secret door at 22,6, and behind it
  the sea cave, 20 to 22,5, walled in rock and deep water so that no climb, wade or float reaches it
  (740 squares checked). In it are the Hand's grey boats at 20,5, their water, 20,4, running out
  under the rock beside the stones and hidden from the causeway by the mountain at 19,4 and 5;
  crates under the Hand's seal at 21,5, with shards of every colour not yet cut in the straw, seen
  and not taken, the act having no Rift to take one to; and at 22,5 the chest `i8_hold`, 400 gold
  and no item (§9, #504's 9 and 10). The boat from nowhere is in the waking's words. On the tip's
  last rock, 26,3, a cairn, a Sapphire Vial in it and no gold; at the tide's edge, 27,5, the drowned
  god's shrine, its bowl heaped with shells (endurance). Things seen: the troll's leavings at 28,12,
  a grey boat's ribs at 8,13 and the pines grown down into the sea at 6,26. Down the east pines a
  mason's hammer dropped at 30,19 and, in the rocks at their end, 31,30, the deserter,
  with his tally at 31,29, which ends ELEVEN; his quest, The Mason's Tally, is built (§6, #506; §9,
  #504's 12 and 13). Four groups (§9, #504's 5): spine eagles, 4, at the track's foot, 18,9, the
  nearest, at 22; Ashen masons, 3, at the causeway's root, 17,7; the foreman's, five masons, the
  foreman their `leader`, not roaming, at work on the causeway's end, 17,2, the box's hardest; and a
  snow troll, 1, by night, not roaming, at the east shore, 29,8. It departs from the brief in the
  band, 22–24 and not 24, in the night, which is Wenna's question and not the camp's rest, in the
  finds, which hold no shard, and in the secret, which is the doc's and not the issue's (§9, #504's
  2, 7, 9 and 10).
  - **Measured.** A company at 22 wins every fight and manages 8.99 fights to a rest, inside the
    aim, with 64.7% of its days ending in a fight broken off, the foreman's five, against I9's
    21.3%; the check does not bind it. It walks Sheer Point's road, I9's trolls and masons and I8's
    eagles, masons and foreman's, every time. Two under, at 20, it wins every fight too, owed to #18
    (§9, #504's 15). I8 pays 2,104 xp a member and 980 gold a clear. Density 100.0% within 8 steps
    (all 229 squares, 207 needed) and the furthest 8, with no sign among its 26 points. It claims
    nothing as new (§7).

### 4.8 J10, I12 and J12, the country behind (#508): country, band 22–23

- **Purpose.** The giants' own ground above the Stair's head (J10, lettered at 300,296) and the
  range running on south of the Stone and the Vale (I12, J12), built after the owner had played the
  act (#443, call 9): the giants' fires and stone seats, and giants at them who ask no toll off the
  Stair; the crest south to the rim, with snow trolls and eagles. All three are built, and this
  closes #508.
- **Encounters.** Stair giants and snow trolls, a heavy pair a box; the eagles are sights and no
  group (§9, #508's 4), and the den (#88) is in none of the three (§9, #508's 13).
- **Pay.** About 400 xp a member each in the brief. As built about 609 a box (§8; §9, #508's 3).
- **As built** (#508, 10 October): all three laid whole at band 22–23, the brief's 23–24 lowered by
  one (§9, #508's 1), with no exit and no step of the quest. J10 and J12 are laid in Monks' Vale and
  I12 in the High Spine (§9, #508's 2). Each has a heavy pair for its one group, one secret and no
  den; nothing is claimed as new (§7). The road across J10's corner is walked (§9, #508's 7).
  - **J10, the giants' ground** (`monksvale_j10`, corner 296,286; start 31,19, facing west on the
    road). **The land.** The road comes in from K10's west edge at 31,19, goes over the saddle and
    down through the box's south-east corner to the south edge at 20,31, walked, three road squares
    added at its diagonal steps (30,19, 29,20 and 20,29; §9, #508's 7). The pines stand under the
    range's slope, the range filling the west; the giants' fire is in a snow clearing on the slope
    (6 to 10, 8 to 10) and their own in another in the pines (15 to 21, 5 to 7). The density check
    counts 666 open squares. **The landmarks.** The saddle, where the road drops through the pines
    and the range stands up ahead (`j10_saddle`, 30,20), and the vale below with a bell far off
    (`j10_vale`, 20,30); a fallen stone seat with a pool that does not freeze, which gives might
    (`j10_pool`, 28,28); the fire on the slope, whole pines laid end to end and burning, nobody
    sitting at it, which answers I10's `i10_fires` on the same row (`j10_fire`, 7,9; §9, #508's 6);
    the giants' seats, slabs stood on end round a fire (`j10_seats`, 17,6); their prints
    (`j10_tracks`, 18,21), felled pines (`j10_felled`, 21,25) and a pine rubbed bare (`j10_rubbed`,
    14,24); a goatherd at 16,28, who says *Off the Stair they ask nothing of anybody.*, and his goat
    on a ledge (`j10_goat`, 6,3); a camp, The lean-to (27,4); the cold loch seen north through the
    pines (`j10_loch`, 20,1); and a cairn, 300 gold and a Sapphire Vial (`j10_cairn`, 25,13). **The
    secret.** The hint is old coins in the snow at the foot of the rock (`j10_coins`, 13,16).
    Searched from there, the rock gives at 12,16 on the giants' cauldron of the toll (`j10_cave`,
    11,16), the coins at the bottom without faces: the chest (`j10_tolls`, 10,16), 1,400 gold and an
    elixir. It is shut in rock to walkers, swimmers, climbers and floaters; its door is at 12,16,
    not 12,15 (§9, #508's 14). **The group.** Two stair giants at their fire (`j10_giants`, 19,6;
    back after two days), the box's nearest at 25 steps and its hardest (level 23); they do not
    roam, and ask no toll (§9, #508's 5).
  - **I12, the Spine's south** (`highspine_i12`, corner 264,350; start 18,0, facing south). **The
    land.** South from I11 along the Sheer's edge, the pines running on with no trail through them,
    the Sheer itself at 5 to 8 with Ashfall's ash under it on the west, and the rim's wall of rock
    from row 20, the world ending past it. The density check counts 539 open squares. **The
    landmarks.** The pines along the Sheer (`i12_south`, 17,2); a cairn at the Sheer's edge, 300
    gold and a Sapphire Vial (`i12_cairn`, 10,5); a pine leaning out over the drop (`i12_edge`,
    8,9); the eagles' nest high on the Spine, a sight (`i12_eyrie`, 26,7); a warm spring that gives
    endurance (`i12_spring`, 14,12); a charcoal-burner at 21,10, who says the trolls lie up where
    the pines stop and that fire stops their mending, and his hut for a camp, The burner's hut
    (23,11); pines stripped of their bark (`i12_stripped`, 14,16); the rim, the pines stopping under
    a wall of rock (`i12_rim`, 24,20); and under the Sheer the ash in drifts (`i12_under`, 2,4) and
    a pack burst open at the cliff's foot (`i12_pack`, 2,15). **The secret.** The hint is old tracks
    in the snow going up to the rock face and stopping at it (`i12_tracks`, 17,19). Searched from
    there, the rock gives at 17,20 on a cleft (`i12_cleft`, 17,21) with packs frozen under a hide
    and a strongbox nobody came back for: the chest (`i12_packs`, 17,22), 1,400 gold and an elixir.
    It is shut in rock as J10's is; its door is at 17,20, not 18,20 (§9, #508's 14). **The group.**
    Two snow trolls (`i12_trolls`, 12,18; back after two days), the box's nearest at 24 steps and
    its hardest (level 23); they do not roam.
  - **J12, the vale's end** (`monksvale_j12`, corner 296,350; start 25,0, facing south). **The
    land.** South from J11's hills, the vale's hills and grass running out under the peaks, with the
    far pines at 18 to 30, 15 to 21. The plate of `monastery2` lies at 26,2, a plate only:
    Highcell's lower house is under the vale. The east edge is hills, grass and pines at rows 0 to
    15 against K12, cut, and void past it; the south edge is the rim. The density check counts 250
    open squares. **The landmarks.** The vale's end, the snow going up to the peaks' feet unbroken
    (`j12_end`, 25,3); a bell heard faintly below, underfoot (`j12_under`, 27,5); a stone seat in
    the hills with a bowl cut in its arm, which gives intellect (`j12_seat`, 22,7); a cairn, 300
    gold and a Sapphire Vial (`j12_cairn`, 29,7); the drop to the east (`j12_drop`, 30,4); eagles
    over the crags and bones under them (`j12_eyrie`, 21,13); and in the pines the trolls' bowl, the
    snow scraped back to the earth (`j12_bowl`, 23,17), and a pilgrim frozen where he sat
    (`j12_pilgrim`, 28,15). **The secret.** The hint is a bell-rope hanging out of a crack in the
    rock, the snow under it worn into a hollow by knees (`j12_rope`, 19,11). Searched from there,
    the rock gives at 18,11 on a cell (`j12_cell`, 17,11), a shelf for a bed and a bell hung with no
    tongue: the chest (`j12_alms`, 16,11), 1,400 gold and an elixir. It is shut in rock as the
    others are; its door is at 18,11, not 18,10 (§9, #508's 14). **The group.** Two snow trolls in
    the far pines (`j12_trolls`, 21,19; back after two days), the box's nearest at 23 steps and its
    hardest (level 23); they do not roam.
  - **Seams, J10 to J12.** J10's north, 0,0 to 31,0 (296 to 327,286), meets J9's south row (285)
    square for square: mountain at 0 to 3 and pines at 4 to 31 on both sides, walked. J10's east (x
    327) meets K10's west (328): the road at 31,19 against K10's 0,19 (328,305), walked, J10's pines
    meeting K10's pines and hills at rows 0 to 12, 18 and 23 to 30, K10's pass walls at 13 to 17 and
    20 to 22 being mountain. J10's south (y 317) meets J11's north row (318): the road at 20,31
    against J11's 20,0 (316,318), walked, hills, grass and pines on both sides at 13 to 22 and the
    peaks and mountain elsewhere. J10's west (296) meets I10's east (295): the range on both sides,
    nothing walked, a climber's only. I12's north (y 350) meets I11's south row (349): the ash,
    hills and pines under the Sheer at 0 to 6 and the pines at 9 to 25 on both sides, walked, the
    Sheer at 7 and 8. I12's west (264) meets H12's east (263, Ashfall's country, not built): ash,
    grass and hills at rows 0 to 19 and mountain below, pinned with void past it for H12 to match.
    I12's east (295) meets J12's west (296): mountain and peaks on both sides, nothing walked. J12's
    north (350) meets J11's south row (349): hills at 19 to 31 on both sides, walked (J11's 18 is
    hills against J12's mountain). J12's east (327) meets K12, cut: hills, grass and pines at rows 0
    to 15, void past it. The south edges of I12 and J12 are the rim, the world's end, pinned. The
    outdoors test follows the neighbours: J9's south and west, K10's west, J11's four edges, I11's
    east and south and I10's north, south and east are re-pinned, their ring reading mountain, not
    void.
  - **Measured, J10, I12 and J12.** At 22 a company wins every fight in all three, and at 20 too,
    owed to #18 as every box's. J10 manages 9.72 fights to a rest, inside the aim of 8.5 to 10.5
    (limit 7 to 13), with no day ending in a fight broken off; I12 and J12 manage 8.22, just under
    the aim and inside the limit, 48.3% of their days ending in a fight broken off. Density, within
    12 steps (the country floor): J10 100.0% (666 of 666, 600 needed) and the furthest 9, with no
    sign among its 17 points; I12 100.0% (539 of 539, 486 needed) and the furthest 9, with none
    among its 15; J12 100.0% (250 of 250, 225 needed) and the furthest 9, with none among its 12.
    Each pays about 609 xp a member and holds 1,700 gold, the secret's 1,400 and a cairn's 300,
    J10's two giants' purses (70 to 160 each) besides; the finds are elixirs and Sapphire Vials, no
    ware (§9, #508's 10). None claims anything as new.
  - **Walkthrough, J10, I12 and J12.** `whitespine/walkthrough.ts` walks the pass over J10: K10's
    0,19 onto J10's 31,19 at 19, 20 and 22 for the crossing line, back with nothing said, J10's
    20,31 onto J11's 20,0 with nothing said, and the road square to square from K10's edge to the
    gate's front. `spineBehind`, called before `theBells`, walks the three: each way in, the sights,
    the person, the group won at 22 and the prize, shut to walkers, swimmers, climbers and floaters
    and found from its hint. `rimewater/walkthrough.ts` has no exit to take from K10: its road goes
    on onto J10's.
  - **Built boxes changed.** Rimewater's K10 loses `SADDLE` and J11 loses `CLIMB`, and the atlas
    test its corner exception; the headers of K10, J9, J11, I10 and I11 are restated; the outdoors
    pins of J9, K10, J11, I10 and I11 follow the new neighbours (§9, #508's 7).

## 5. The one quest here

The Whitespine's chapter is The Bells (`chapter.ts`, #505, a working title), joined after
Rimewater's The Sleepers, and every zone on the road holds a step (EXPANSION §5.8): Monks' Vale's
at the monastery, the High Spine's at the Stair's head, Sheer Point's at the causeway. Its entries
and goals, in the journal's voice, keyed to flags, events and maps the save holds:

- **South.** The two hundred Wenna left below are marched south, toward the mountains and the sea.
  Two days before the monastery the bells come across the snow: eleven, with gaps between, and then
  again. The night the Queen died, over and over. The goal points at the gate.
- **Highcell.** The monks walk wrong, speak the dwarves' old script to each other and do not bleed;
  something has gone on keeping the monastery for them. The log says what is seen and no more
  (DESIGN §7). The goal turns over the crest, past the Stone, and north along the ridge.
- **The causeway.** The finger of land toward the Hearth, so close its heat is felt; the Hand's
  road of cut stone, every stone a stolen shard. Every shard is a step. Wenna is at the camp.
- **The night.** Wenna gone, a boat going out along the stones, her knot on the first one
  (`q_wenna_taken`, which only her question at the camp sets, not a rest: §4.7). Cassian reads the
  Meridian journal's last line, *The heart opens for whoever makes it whole*: one Stone left, on the
  far side, never finished. The goal turns south to the Stair.
- **The Stair.** The giants and their toll, over the range and down. Paid or fought, the chapter's
  done flag is set at the head, looking down into ash; the next chapter is Ashfall's.

Nothing in the chapter is a lock (EXPANSION §2.3; #450): the gate stands open at any hour, the
Stair goes down for anyone who pays or wins, the ridge trail is open from the start (#443, call 3)
and a company that reaches the Point first reads the journal true in that order.

As built (#505, 9 October): `chapter.ts`, begun where The Sleepers ends (`q_sleepers_seen` with
`k10_mouth` seen) or in Monks' Vale (`visited`). Fourteen entries, none over two lines on the
journal's page: the bells, on `j11_bells`, the same eleven and the same gaps; the brothers in their
cells, on `hc1_cells`; their board of the hours, on `hc1_board`, a reader's alone; that none of them
bled and the Abbot's grey plate, on `hc2_abbot` slain; the Peak Stone whole, on `i11_stone`; the
road of cut stone, on `i8_causeway`, its first stone; the night, the explorers' line read again and
the one Stone left, each on `q_wenna_taken`; her knot, on `i8_knot`; the Stair's head, on
`i10_head`; the toll paid (`toll_paid`, `toll_part` or `toll_coin`) or the king fought (`i10_king`
slain); and the way down, on `q_stair_top`. Seven goals, furthest along first: the way down (on
`STAIR_PASSED`, the toll answered or the king slain), the toll (on `i10_head`) and the Stair (on
`q_wenna_taken`), all on I10; her fire (on `i8_causeway`) and the Point (on `hc2_chapter`), on I8;
Highcell's chapter house (on `monastery` visited) and its gate (the start), in Highcell. The
chapter is done on `q_stair_top` (`STAIR_TOP`, exported from `maps/highspine_i10.ts`), which a new
once-event, `i10_top`, sets on the Stair's first step below the king's, I10's 1,20; it is
there only once the toll is answered or the king is down. **Ashfall's chapter (#518) reads
`q_stair_top`.** She is unnamed in the journal, as in every line, and nobody is named reading the
line. The chapter pays no xp of its own (§8 gives it none). The walkthrough plays it at 22, 23 and
24: in order, over the pass at 22, Highcell and the Point at 23, the night (she is taken at 24) and
the Stair at 24, the toll paid; and with the Point reached first, the night before Highcell, the
toll refused and the king fought, when the journal holds nothing of Highcell until it is walked and
the goal stays on the Stair. Each ends once and reads the same but for the toll (§9, #505).

## 6. Side quests

#56's four for the Whitespine, all standing (#443, call 9), each built with its box on the systems
of #76 and joined by #506, their journal in `quests.ts`:

| # | Quest | Level | Where | What it needs | Pay | Built in |
|---|---|---|---|---|---|---|
| 45 | The Novice | 23 | Highcell; Anvilhall | a letter carried; a choice put by a person; `after` (#41) | 200, either answer (`q_novice_told`, `q_novice_kept`) | #500, #506 |
| 46 | The Eagles' Nest | 23 | the herder's fold (J11); the nest (I11); Lantern Watch or Highcell | an item no shop buys; a hand-in at the first meeting (#43) | 200, either taker (`q_nest_watch`, `q_nest_cell`) | #499, #501, #506 |
| 47 | The Toll | 24 | the Stair's head (I10) | the toll (#544); an item given in place of gold; a choice; a person who moves | 250, any answer or the king slain (`q_toll_done`) | #502, #506 |
| 48 | The Mason's Tally | 24 | the rocks on the Point (I8); Cinderport | a choice put by a person; an item swapped | 250, either answer (`q_mason_passage`, `q_mason_swapped`) | #504, #506 |

Pay is xp a member, whichever way the choice goes: 900 between the four (§8), paid by the answer
that ends each and split among the living as a fight's is (§9, #506's 1). As #56 drafts them, and
as built:

- **The Novice.** One real novice lives among the brothers and does not know. The company carries
  his letter to his mother in Anvilhall; on its return it tells him, and the brothers let him walk
  out, or does not. As built (#506) the boy in the last cell gives his letter to a company that
  will carry it, and the woman knitting on Anvilhall's middle terrace (5,9) takes it at the first
  meeting: *"Hungry, he says, and all of them fasting. Tell him his mother says come home."* Back in
  the cell, told, he walks out at the gate and is on the step below her (6,9); told she is well,
  he sweeps on.
- **The Eagles' Nest.** A herder at the vale's edge loses lambs to the eagles. In the nest on the
  peaks above the Stone are smooth grey parts and a Lantern's badge: a Lantern came to survey the
  Peak Stone and never came down. The badge goes to Lantern Watch, or to Highcell. As built (#506)
  the herder gives it, or the nest does, opened, and once it is he remembers a Lantern going up for
  the Stone with a glass and a chain. The badge goes to Hester Dunmore, the Reader at Lantern Watch,
  who may be refused, or to a brother standing in Highcell's first cell (14,3), who holds out its
  hand only to a company carrying it; the Reader takes the Lantern's Instruments too, for nothing.
- **The Toll.** A caravan at the Stair's head cannot pay, and the Stair-king keeps the
  caravan-master's daughter until it is paid. Pay in gold; or give him something from below, the
  faceless coin of #56's 9 or a part from the nest, and he says his people were on the mountain
  before anyone came down the sky; or fight. His words hint and never say (#443, call 1). The
  king's answers are the box's (#502, §4.5) and the quest rides on them (#506): the caravan-master
  gives it, and once the toll is answered or the king is down his girl is gone from the head and by
  the wagons (19,19), and her father asks what he owes. Nothing, and the pay is the company's.
- **The Mason's Tally.** A mason has deserted the causeway and hides in the rocks with the tally:
  eleven more shards and the road reaches the isle. He wants passage to Cinderport. Buy it for him,
  or swap the tally's page so the Hand sends for the wrong count. As built (#504, #506) the
  deserter in the rocks asks: his passage bought, the Compact's fare of 600, he is by the fire in
  Cinderport's inn; or the page swapped, he chalks a slate short of the true count and goes back to
  work below the tally-house (18,8), and the true tally, ELEVEN, is the company's.

**The third prestiges' quests.** The four whose trainers live here are built (#448), their journal
in `quests.ts` beside the side quests. Each is its trainer's `asks`: the trainer puts it only to a
company whose member of the class is at 27 with the second taken, and its seeking quest (#384) is
done once it begins. Each pays nothing but the prestige, which the trainer's menu teaches once the
done flag holds, for no gold (§9, #448's 1). The Thief's goes down to the Dead-Drop's counting house
(docs/areas/dead_drop.md §4.3).

| Class | Quest | Trainer | What it asks | Fights | Flags |
|---|---|---|---|---|---|
| Knight | The Ledge (`ledge`) | Edric, the old champion, on Stairwatch's ledge (I10, 5,26) | hold the ledge with him through a night | by night, two toll-takers up the shaft, then two more (`i10_tolltakers`, `i10_tolltakers2`) | `q_ledge` asked; `q_ledge_held` done |
| Monk | The Vigil (`vigil`) | Oswin, the summit's hermit, on Spine Summit (J11, 3,10) | sit the night with him on the summit | by night, five brothers up the path (`j11_vigil`) | `q_vigil` asked; `q_vigil_kept` done |
| Bard | The Eleven (`eleven`) | Brother Lark, a ringer a beat behind the rest, in Highcell's bell tower (`monastery`, 6,14) | find the eleven's three verses and sing them to him under the bells | none | `q_eleven` asked; `q_eleven_sung` done |
| Thief | Whose Hand (`whose_hand`) | Hereward, the watcher, in Rook's Nest (I8, 21,7) | a set of the Compact's orders out of the Dead-Drop, and whose hand writes them | none of its own: the Dead-Drop's as built, and the orders taken without one | `q_rook_orders` asked; `q_writer_seen` (dead_drop3's `dd3_writes`); `q_rook_read` done |

- **The Ledge.** Edric looks at the knight's banner and asks the company to hold the ledge till
  morning: *"At night they come up to see who is watching."* Answered, by night two Stair Giants
  come up the shaft at 6,25, and once they are down two more; neither pair comes by day or comes
  back. Spoken to after, at first light, he wipes his blade in the snow and sets `q_ledge_held`.
- **The Vigil.** Oswin opens one eye at the monk: *"Every night something comes up the path to see
  if I still sit here."* Answered, by night five brothers come up the summit's path to 5,10, beside
  the camp; where they fall the snow is not red, and the last one's hood has come away on grey
  plate. Spoken to after, at dawn, he sets `q_vigil_kept`.
- **The Eleven.** Brother Lark wants words for the bells: *"A drowned bell's count, a miners'
  hymn, a lighthouse log."* The three are what the save already holds: the Tide Bell back on its
  frame in the drowned temples' door (`q_tide_bell_done`, #56's 23), the oldest miner's last verse
  at Anvilhall (`q_hymn_sung`, #56's 36) and the keeper's log taken off Crowness Light's table
  (`downs_e3:e3_log`, #67). Asked and holding all three, the company sings them to him under the
  bells, and every word falls on a stroke; that sets `q_eleven_sung`.
- **Whose Hand.** Hereward lowers his glass at the thief: *"The Compact's orders come up out of the
  Dead-Drop, under the Tide Ship. Bring me a set."* At the counting house's foot, through the gate in
  the rail, the Tallymaster is seen writing (`dd3_writes` sets `q_writer_seen`), and the orders
  (`compact_orders`) are taken from the out-tray at its right hand, no group beside it. Spoken to
  with the orders in the pack and the writer seen, he reads them through twice and hands them back,
  which sets `q_rook_read`; they are never handed in (§9, the Ranger's and the Thief's 2 and 3).

## 7. Encounters, and what is new

MONSTERS §8.1 has the roster and the fights: the Spine Eagle, the Brother, the Bell-ringer, the Snow
Troll, the Stair Giant, the Ashen Mason, the Abbot and the Stair-king; the chapter house and the
Stair in snow. Their drawings are #507's, eight in all, the giants new and the rest on frames that
exist. §4.2 to §4.8 place every group, box by box, the gentlest at the pass's foot and the Abbot,
the king and the masons at the top of the band. All eight of #507's drawings are done (§3, §9): the
monks, the Brother, the Bell-ringer and the Abbot, robed on the keepers' frame; the Spine Eagle, the
Snow Troll and the Ashen Mason; and the giants, the Stair Giant and the Stair-king, on a frame of
their own.

New in the Whitespine, for the novelty check (EXPANSION §5.4): the giants, a new family (#507), and
with them the toll, a choice before a fight (#544), the second after Thornmark's ogre's bargain
(#645), and sweep, one blow at every member of a row (#545); cliffs and peaks with the road through
them (#543); a machine in a robe, which holy light passes through, and a bell that holds (MONSTERS
§8.1). Its landmarks: a monastery kept by what did not build it, a whole Stone with the snow
stopped round it, a stair cut in a cliff, a causeway of shards over the sea. The area's `novel`
claims each as a box places it, since the check asks that what is claimed be used: peaks underfoot
with J11 (#499), the monastery with Highcell (#500), cliffs with I11 (#501) and the giants with I10
(#502), the family alone, since the toll is Thornmark's mechanic (`encounter:choice`) and sweep has
no token to claim; a machine in a robe has no token either and a bell that holds is paralysis, on
the road before in the Kilns and others (§9, #499's 15; #500's 17; #501's 13; #502's 15). I9 (#503)
claims nothing, its brief having nothing new: the ridge is the walk (§4.6; §9, #503's 16). I8 (#504)
claims nothing either: the sea reached from the range, a causeway over water and a person taken have
no token to claim, the causeway's stone being the Kilns' pier's, and a cave on the atlas is on the
road before (§4.7; §9, #504's 14). J10, I12 and J12 (#508) claim nothing either: the giants are
I10's and the trolls J11's (§4.8).

## 8. The numbers

- **Experience.** The curve (EXPANSION §5.2, #159) gives an area the climb from its floor to the
  next area's floor, divided by 0.75: from 22 to 24 that is about 17,867 xp a member with today's
  `xpForLevel`. The shares of §4 are J11 1,800, Highcell 2,600, I11 1,600, I10 2,400 (the king's
  share only on refusing the toll), I9 1,400, I8 1,500 and the four side quests about 900 between
  them: 12,200 without the country behind, which adds about 1,200 when it is built (1,827 as built, below). That is some
  5,700 short of the curve, and the shares are first cuts: from Saltreach on every box built has
  paid over its share, since a fight inside the gate's aim costs what its monsters are worth
  (docs/areas/saltreach.md §8). Each box is priced by its fights when it is built, the sum here is
  restated with each, and the curve's row reported what a clear fell short of as owed to #445 until
  the boxes existed; it keeps none now (§9, #508's 11). A company that pays the toll forgoes the king's share and keeps its gold.
  Scaled to the curve, which §9 proposes as the briefs' working figures until each box is built,
  the shares are J11 2,650, Highcell 3,800, I11 2,350, I10 3,500, I9 2,050, I8 2,200 and the side
  quests about 1,300: about 17,850. The issues (#499 to #506) carry the first figures until their
  briefs are settled. As built: J11 2,791 (#499), 1.05 times its scaled share; Highcell 4,183
  (#500), 1.10 times its 3,800; I11 2,355 (#501), 1.00 times its 2,350; I10 4,197 (#502), 1.20 times
  its 3,500, under the 4,375 cap, and 1,046 to a company that pays the toll; I9 1,800 (#503), 0.88
  times its 2,050; I8 2,104 (#504), 0.96 times its 2,200: 17,429 between them by the curve's sum, so
  with the side quests' scaled share (1,300) the shares stand at about 18,729, 1.05 times the ask
  (§9, #499's 9; #500's 4; #501's 9; #502's 10; #503's 9; #504's 6). The side quests as built (#506)
  pay 900 a member, not the scaled 1,300: a clear gives 18,329, 1.03 times the ask, and the curve's
  row owes no xp (§9, #506's 1 and 14). The third prestiges' fights take it to 20,274 (§9, #448's
  1). The country behind (#508) pays about 609 a member in each of J10, I12 and J12, 1,827 between
  them, against the brief's about 400 a box and inside the 400 to 700 asked (§9, #508's 3): a clear
  gives 22,101 xp a member of the 17,867 asked, 1.24 times, and the curve's row owes nothing.
  Entered at its floor and three quarters cleared, paid by level, a company leaves at 24.3, +0.3
  over the next floor, 24, where the lead allows +1 (EXPANSION §5.2, #634).
- **Gold.** Training six members from 22 to 24 costs about 10,800 with today's `trainPrice`, but
  nothing trains here (#443, call 7): the gold goes over the range to Cinderport, which teaches to
  27, and the third prestiges ask quests, not gold (DESIGN §5). The band's price window is 5,000
  (#542), and no find or ware in the area comes near it: the pass has no step of its own and wears
  Rimewater's rung, 1,750 to 2,050 gold with its pluses. The toll is set with #544 inside the
  window, dear enough to be a choice and never a wall. A clear should still pay the training, in the
  hoard, the undercroft, the masons' cache and the sea cave. As built: J11 holds 700 (#499), 300 in
  the cairn at the pass's foot and 400 in the store; Highcell holds 600 (#500), in the undercroft's
  chest; I11 holds 300 (#501), in the chest under the slab; I10 holds 1,920 (#502), 1,200 in the
  hoard under the seat and the purses of the king (250 to 500) and of three giants (70 to 160 each);
  I9 holds 790 (#503), 500 in the cache behind the tally and the purses of four masons (45 to 100
  each); I8 holds 980 (#504), 400 in the sea cave's chest and the purses of eight masons; so the six
  hold 5,290 of the 10,800. The toll is 1,500, about what the range's finds hold before the head
  (J11, I11 and Highcell, 1,600) and under the dearest ware the pass wears. The dearest find is
  I10's Bear Spear +1 at 2,050, Rimewater's rung, in the hoard, inside the window; I9's Hunter's Bow
  +1 in the cache is the same rung at the same price; Highcell's is the Ice Axe +1 at 1,950 and
  J11's the Guide's Staff +1 at 1,750; I8 holds no ware, its chest gold alone (§9, #502's 5 and 6;
  #503's 6; #504's 10). The country behind (#508) holds 1,700 in each of J10, I12 and J12, 1,400 in
  the strongbox behind the secret and 300 in the cairn, and J10 the purses of its two giants (70 to
  160 each); its finds are elixirs and Sapphire Vials, no ware, as the Whitespine sells nothing (§9,
  #508's 10). A clear gives 11,080 gold of the 10,800, 5,750 before the three, and the curve's owed
  row is gone (§9, #508's 11).
- **The gate.** The gate check (`tools/tests/gate.ts`, #38) holds each box at its own floor: a
  company at 22 wins nine in ten of J11's fights and walks the road from the pass's foot to the gate
  resting at its camp; one at 20 wins no more than one in four. The Abbot is won about half the time
  at 23 and nearly always at 25; the Stair-king the same. The bot must know the toll (#549): it
  refuses, so that the gate measures the fight. As built: a company at 22 wins every fight on J11
  and walks Monks' Vale's road every time, 10.50 fights to a rest; one at 20 wins every fight too,
  owed to #18 as Rimewater's boxes' is (§4.2). On Highcell a company at 22 wins every fight in the
  upper house and manages 11.80 fights to a rest, over the aim and inside the limit; one at 20 wins
  every fight too, owed to #18. In the lower house a company at 23 wins 83% of the fights and
  manages 10.99 fights to a rest, a little over the aim; the Abbot is won 66% at 23 and 93% at 25,
  set off the boss line (§4.3; §9, #500's 6). On I11 a company at 22 wins every fight and walks the
  High Spine's road every time, 10.12 fights to a rest; one at 20 wins every fight too, owed to #18
  (§4.4). On I10 a company at 22 wins 86% of the fights, the king counted, and walks the road past
  the giant and the troll every time, 11.72 fights to a rest, over the aim; one at 20 wins 68%, so
  nothing is owed. The Stair-king is won 58% at 22 and 79% at 24, the gate's floors for him, and by
  the gate's own measure 56% at 23 and 97% at 25, so "about half at 23, nearly always at 25" holds
  (§4.5; §9, #502's 1 and 3). On I9 a company at 22 wins every fight and walks the road past the
  trolls and the masons every time, 9.43 fights to a rest, inside the aim; one at 20 wins every
  fight too, owed to #18 (§4.6; §9, #503's 11). On I8 a company at 22 wins every fight and walks the
  road past I9's trolls and masons and I8's eagles, masons and foreman's every time, 8.99 fights to
  a rest, inside the aim, with 64.7% of its days ending in a fight broken off; one at 20 wins every
  fight too, owed to #18 (§4.7; §9, #504's 15). On J10 (#508) a company at 22 wins every fight and
  manages 9.72 fights to a rest, inside the aim of 8.5 to 10.5 (limit 7 to 13), no day ending in a
  fight broken off; on I12 and J12 it wins every fight and manages 8.22, just under the aim and
  inside the limit, 48.3% of its days ending in a fight broken off; at 20 it wins every fight in
  each too, owed to #18 (§4.8; §9, #508's 3). The Whitespine's 23 groups were won 96.7% of the
  fights at their maps' floors and 93% two under, over the limit of 90%, so the area's owed entry
  (#18) stays; with the country behind its 29 groups are won 97.4% and 94.4% two under, and it
  stays.
- **Density.** Core boxes at the Foreland's floor, country at the looser one (EXPANSION §5.3),
  measured over the squares the mountain leaves. As built: J11 99.1% within 8 steps and the furthest
  9, with no sign among its 22 points (#499); Highcell's two levels 100.0% within 7 steps, the
  furthest 5 on both, with one sign among their 15 and 9 points (#500); I11 99.5% within 8 steps and
  the furthest 9, with no sign among its 26 points (#501); I10 99.7% within 8 steps and the furthest
  9, with no sign among its 31 points (#502); I9, country, 100.0% within 12 steps (all 412 squares,
  371 needed) and the furthest 10, with no sign among its 22 points (#503); I8, core, 100.0% within
  8 steps (all 229 squares, 207 needed) and the furthest 8, with no sign among its 26 points (#504); J10, country, 100.0% within 12 steps (all
  666 squares, 600 needed) and the furthest 9, with no sign among its 17 points; I12 100.0% (all
  539, 486 needed) and the furthest 9, with none among its 15; J12 100.0% (all 250, 225 needed) and
  the furthest 9, with none among its 12 (#508).

## 9. Decisions

Decided by the owner's delegate on 2 October 2026 (#443), and followed here:

1. **The giants came in the ship awake** (call 1): the crew that built the inside, the heavy hands
   who raised the ranges and set the Stones, never cargo, so in no bay and in no count; they stayed
   on the mountain when the rest were put to sleep. The Giants' Stair is the service ramp they were
   posted to keep and the toll the order they were given, kept four hundred years. The Stair-king's
   words hint it and never say it (DESIGN §7: the secret is found, never told). They are
   `kind: person`, and break when the king falls. This answers MONSTERS' open question 2.
2. **Sheer Point is reached along the ridge** (call 3): the new trail from the Peak Stone north,
   open from the start, with the causeway's camp on the Point's shore. Wenna is a person who moves
   (#76): after the bay at Rime Lodge, by the yard's fire until the company is in Monks' Vale, then
   at Highcell's gate, J11's 27,23, until it is on the Point, then at the camp, never in a fight.
   At the camp her question sets `q_wenna_taken`, not a rest: one once-event, no counter (§4.7; §9,
   #504's 7 and 8).
3. **Road order holds** (call 6): the Whitespine is Act IV's first area, the Stair its way on.
4. **Cinderport holds the halls** (call 7): Highcell sells and teaches nothing, its brothers being
   machines, and the Bard's trainer in the bell tower is a living Laureate hiding among them.
5. **The third prestiges are built in Act IV** (call 8, #448): Stairwatch, Spine Summit, Rook's
   Nest and the bell tower here, with their quests as DESIGN §5 sketches them.
6. **The cuts stand, the country behind was parked and all four side quests stand** (call 9): §11,
   #508 and §6; the country behind is built since (§4.8). **The names** are #444's (§10).

Proposed, for the owner, each in the issue that would build it:

- **The briefs** of §4.2 to §4.8: each box's landmarks, points of interest, encounters, secret
  and hint, lines, finds and share of the pay.
- **The core** is J11, I11, I10 and I8, as the plan has it: three steps and the Stone (§4).
  **Highcell is two levels of 16×16,** the upper house and the lower, with the undercroft behind
  the Abbot's seat (#500). **The pay's shares** (§8), and the gap to the curve.
- **The bands on the atlas's rows** (#498): Monks' Vale 22–23, the High Spine 23–24, Sheer Point
  23–24, Highcell 23–24. They are set in `src/content/areas/whitespine/atlas.ts`, where only the
  scaffold reads them, for a box's draft; the owner's word changes them there.
- **The monastery's plate moves from K12 to J11's gate,** 330,356 to 322,342, as Saltmouth's moved
  to C6 (docs/areas/saltreach.md §9): K12 is cut, and the plate goes where the way in is.
- **J11 is laid in Monks' Vale and I10 in the High Spine,** each the zone that holds most of its
  land, so the crossing lines fall at the J11/I11 and I10/I9 seams.
- **I8's band.** The plan gives it 24, and a band of 24 alone wants its hardest group at 24; the
  roster's top below the bosses is the masons at 23. Either the box is laid 23–24, as C7 was
  (docs/areas/saltreach.md §9, #178's 2), or the masons' foreman, a stat and not a drawing, averages
  the second group to 24. For the owner, with #504. Built at 22–24, neither way (§9, #504's 2).
- **The toll's price and its remembering** (#544): a sum inside the window (§8); paid once, the
  Stair stays open to that company; the king dead, nobody keeps it. The bot refuses (#549).
- **The giants' ground is J10's,** parked with it and built since (§4.8); the Stair's head holds the king and the two
  that stand with him. **The lines** of §4 are drafts, the owner's to reword.

Decided by delegate for #507 (the monks), each the owner's to overturn:

1. **The monks are keepers in the dead monks' habits:** a robe goes where the Matron's apron does
   (#495's 4), wool from the shoulders to the hem, girt with a cord, the sleeves wide and the six lit
   fingers out of the cuffs; the plate shows at the shins and the feet, so the bay's walk is known.
2. **Each robe is its def's tint, and the plate under it the Bay Keeper's grey:** the Brother brown,
   its hood up and the lights in its shadow; the Bell-ringer oatmeal, its hood down in a cowl and the
   egg bare; the Abbot black lined pale, the tallest of the three, its hood drawn up to a point.
3. **The Brother walks as it was told to:** idle, one foot and then the other comes up stiff and
   high and is set down flat where it was, and the hem lifts over it.
4. **The Bell-ringer's bell is a bronze handbell held out at the hip,** swung eleven strokes, a gap
   and eleven more. It holds at 0.2 a hit (MONSTERS §8.1) and is `ranged`, as the devilfish is: a
   monster in the back rank without it waits while the front stands, and the chapter house puts the
   bells behind the brothers (§4.3).
5. **The Abbot carries a crook,** lifted and set down at the hour. Its robe has fallen open down the
   chest to the cord, lined pale, on the plate and the chisel's mark (#495's 3), and gapes wider at
   the hour. A drawing is not told its monster's wounds (`drawMonsterSprite` takes none, and the
   fight draws only those standing), so a robe that opens as the Abbot is hurt waits on a systems
   change, the owner's to ask for.
6. **On the line:** the Brother a soldier at 22 (317 hit points, 4d8+2), the Bell-ringer a
   controller at 23 (284, 4d8+2) and the Abbot on the boss line at 24 (1,381, 24d8+24), for #500's
   gate to tune as the Matron was #490's; all three machines, with no gold and no drops until #500
   gives the Abbot a find. Sizes 1.1, 1.1 and 1.4.
7. **Each is owed to the box that places it first:** the Brother to #499, on the vale's road, and
   the Bell-ringer and the Abbot to #500 (`UNPLACED` in `tools/tests/maps.ts`).

Decided by delegate for #507 (the eagle, the troll and the mason), each the owner's to overturn:

1. **The Spine Eagle is the birds' frame at its biggest, coming down on its prey:** the wings
   raised high with the primaries spread, the feathered legs thrust forward and the yellow feet open
   just off the ground; dark brown, the crown and nape gold, a heavy brow and a hooked yellow bill.
2. **The eagle is drawn inside 0.62 of its height, at size 0.9,** so the raised wings keep inside
   the view; its body is still half as big again as the raven's. It does not hop: the wings settle.
3. **The eagle is a skirmisher on the line at 22** (328 hit points, 3d7+6), flying and reaching
   the back row as the raven does (MONSTERS §8.1: it flies); a beast, it carries no gold.
4. **The Snow Troll is the tor troll's frame made of snow,** a Build of it as MONSTERS §11 has it:
   no beds, lichen or heather; rime along the hump and the shoulders, a cornice over the brow with
   icicles at its lip, a maw with icicles for teeth, blue shadows and a cold light in the eyes.
5. **It stands in the drift it rose from, the fists sunk in it:** a drift that stood up, and the
   widest base of any troll, so it reads apart from the tor troll at a glance as well as by colour.
6. **The troll is #537's at 23:** size 1.6 with its crown at 0.80 of its height, under 0.82; three
   quarters of the brute's line, 474 hit points, mending 47 a round unless fire struck it.
7. **The Ashen Mason wears the overseer's hitched robe under a mason's leather apron,** white with
   dust at the hem, the Hand's grey up to the elbow, a step on from the gleaner's. A glass shard to
   set rides on the far shoulder, lit from inside; the hammer is low in the near fist, its head by
   the foot, and now and then it lifts off the stones: a hammer from below.
8. **The mason is a soldier on the line at 23** (319 hit points, 4d8+2); the Hand, it never breaks
   (`steady`), and it carries 45 to 100 gold, on from the overseer's and the gleaner's. Its sprite
   kind is `mason`, as theirs are named for their work.
9. **Nothing is declared apart:** the shard, the hammer, the raised wings and the talons are each
   one piece of ink with the body at combat size.
10. **Each is owed to the first box whose brief places it** (§3): the eagles and the troll to J11
    (#499), the masons to I8 (#504).
11. **What was drawn before is unchanged to the pixel:** the eagle and the troll are Builds on
    their frames, their new parts off for every other kind; the mason is a function of its own.

Decided by delegate for #542, each the owner's to overturn (docs/areas/ashfall.md §9 has the step):

1. **The Whitespine's row is 22–24, next 24, window 5,000,** owed to #445 with nothing given, as
   the issue has it: 17,867 xp a member and 10,800 gold, the training of six from 22 to 24.
2. **The pass has no step on the ladder,** no town to sell one: its gear is Rimewater's rung, the
   top at 22, so a company at 24 wears what one at 22 does and Cinderport's step comes at 25. The
   briefs' pieces of Rimewater's rung with a plus stand; they are the ladder's.

Decided by delegate for #507 (the giants), each the owner's to overturn:

1. **A giant is a man as tall as a house, standing as a man stands:** upright, his weight on both
   feet, no stoop and no club, so he reads apart from the ogres and the trolls at a glance.
2. **His near arm is held out from the elbow, the hand open and cupped, thumb and fingers turned
   up:** the toll asked in the silhouette, the arm the bar across the road. The far hand hangs, huge.
3. **He wears the crew's working clothes kept four hundred years:** a knee-length coat of felted wool,
   belted, split and patched, a fleece collar, leggings bound to the knee and heavy boots.
4. **On his shoulder is a worn round badge whose mark is long gone:** a thing seen, which nothing
   explains (DESIGN §7).
5. **His head is small for his height and bowed to look down at the company,** the hair cropped and
   iron-grey, the beard on his chest, the eyes pale and deep under the brow: patient, not fierce.
6. **The Stair-king is the frame an eighth broader, his head sunk between his shoulders,** under a
   mantle of dark fur to the knee; white-haired, the beard to his belt, his coat slate to their grey.
7. **His crown is the toll:** coin set on edge in a band at his brow, gold and silver either side and
   at the front the oldest, dull and with no face, as his hoard lies (§4.5); more studs his belt.
8. **Both are size 2, as MONSTERS §8.1 has the giant, drawn inside TALL_REACH:** the giant's crown at
   about 0.75 of his height and the king's at 0.81, so the king stands over his giants at their size.
9. **The giant is a brute on the line at 23** (632 hit points, 5d7+8) and the king on the boss line at
   24 (1,381, 24d8+24), for #502's gate to tune.
10. **People carry gold:** the giant 70 to 160 and the king 250 to 500, the toll's coin, for the
    curve to weigh with #502; the hoard is the box's find (§4.5).
11. **Sweep is left to #502:** main has no `sweep` on `MonsterDef` yet (#545), so the box that places
    the giants declares it on both. The toll is #544's, and the leader whose fall breaks them #502's.
12. **Nothing is declared apart:** the hand, the coins and the fur are one piece of ink with the body
    at combat size. Each breathes slowly, the held-out hand lifting a little and settling.

Decided by delegate for #499, each the owner's to overturn:

1. **J11 is laid whole in Monks' Vale at 296,318,** core, band 22–23, region `whitespine`, as the
   call above has it: the High Spine's 110 squares on the crest are the map's, and the crossing line
   names Monks' Vale.
2. **The road crosses the north edge at 20,0,** not the scaffold's 19,0 nor the link's end at
   318,318 (22,0, pine on the cut): the atlas's road beyond runs at 316,317 and the edge check
   binds. It runs square to square to the gate's front at 26,23, four squares added at its diagonal
   steps.
3. **The pass was taken, not walked,** as N8's notch is and L9's pass and K10's ridge were: K10's
   `SADDLE` at 0,19 landed on J11's 20,1 facing south and J11's `CLIMB` at 20,0 on K10's 1,19 facing
   north. Each label left the land's name to the crossing line (#616). J10 laid (#508), the road is
   walked and both are gone (#508's 7).
4. **Monks' Vale's crossing words are the range's own:** two under the floor, *The range begins
   here, and it is harder than the lochs behind.* and three under, *The range, and nothing in it
   would spare you. The way back over the pass is still open.* The walkthrough walks it at 19, 20
   and 22 (the name alone). Since #508 it is said where K10 meets J10 (#508's 2 and 8).
5. **The monastery is a block of building squares on its shelf,** rows 24 to 28, columns 20 to 29,
   joined to the mountain by rock (columns 17 to 19). Drawn tall over one square, as the brief asks,
   it needs a `Landmark` kind besides the lighthouse's (`src/game/map.ts`, `src/ui`): a systems
   change for the owner to ask for (§11).
6. **The gate at 26,24 is barred, as N8's door was before #617:** `GATE` is exported and not in
   `exits`, its square a building, and the event `j11_gate` (not `once`) stands at its front, 26,23.
   #500 lists it, makes the square a door, drops the event and sets the landing (asked: 7,1 facing
   south); its way back lands on 26,23. #500 did all four (§9, #500's 8).
7. **The gate's line keeps the brief's,** with the brother standing in the open gate so that it
   reads true while the gate is barred: *The gate stands open, and a brother stands in it. It bows,
   and the bow is a shape someone described to it.* It is the gate's label now (§9, #500's 8).
8. **Five groups for the brief's six:** brothers (3) at the pass's foot, the gentlest and nearest;
   eagles (4) west of the road and (4) east; brothers (4) on the road to the gate; snow trolls (2)
   at the summit path's far end, not roaming, at 23, the hardest. Smaller groups gave 14.6 fights to
   a rest and three trolls 6.6, both outside the limit; these give 10.50, the aim's top.
9. **J11 pays 2,791 xp a member,** 1.05 times the doc's scaled share of 2,650 (the doc wins over the
   issue's 1,800). With the other scaled shares (15,200) the area comes to about 17,990, 1.01 times
   the ask (§8).
10. **The store is walled in rock, not mountain,** so a Mountaineer's climb cannot reach it; the
    secret door at 16,29 among the rock is drawn as rock, the blank face. The trodden line is row
    29's snow from 29,29 west to it, and the hint `j11_trodden` and, by night, `j11_walker` stand at
    29,29.
11. **The finds:** the cairn at the pass's foot (17,4) holds 300 gold and a Sapphire Vial, the store
    (14,29) 400 gold and a second Guide's Staff +1 (`guides_staff+1`, Rimewater's rung; the monks'
    gear). A clear pays 700 gold.
12. **Spine Summit is a camp at the atlas's site,** 4,10, up a snow path carved through the crest
    from the hills at 13,12, and the site loses `planned`. The hermit beside it (3,10) has words
    only: #448 keeps his trainer entry and the vigil. Highcell's plate stayed planned until #500, as
    Carn Dubh's did until #617, and is built (§9, #500's 1).
13. **The herder** at his fold (27,19; the fold a ring of rock at 28 to 30, 18 to 20) has words only
    (#506's 46).
14. **The pilgrims' hostel** is a building of 2 by 2 east of the road (24 to 25, 12 to 13), its
    event at the front (23,13): kept wrongly, the blankets under the beds and a bowl of snow by
    each. The issue's secret, the hostel's cellar, is not built; the doc's store is.
15. **Novelty claims terrain `peak` alone:** the cut has no cliff (I11's 42 or I10's 17 can claim
    it) and `uses()` has no token for a machine in a robe, whose family, the keepers', is
    Rimewater's.
16. **The chapter is owed to #505:** the quests test listed `monksvale`, `highspine` and
    `sheerpoint` as planned and `whitespine` as owing its chapter, until #505 wrote it. The gate
    figures under the floor are owed to #18, as Rimewater's are.
17. **The climate is the range's:** summer 8, winter -12, daily 7, damp 0.03 to 0.08, wettest 330,
    fog 0.4, lag 12; cloud comes down off the crest and thunder rolls along the range.

Decided by delegate for #500, each the owner's to overturn:

1. **Ids follow Carn Dubh's:** `monastery` is the upper house and `monastery2` the lower, plates at
   322,346 and 322,352, both named Highcell as the Sleepers' Bay's two are. The planned row's name
   and band go and the site at 322,342 loses `planned`; ids are `hc1_*` and `hc2_*`.
2. **Bands 22–24 above and 23–24 below.** The upper house is banded from the area's floor, as Carn
   Dubh's cairn is: at 23–24 the rise check wants its hardest group at 24, and only the Abbot is.
   The lower's floor, 23, judges the Abbot at 23 and 25. Two under is owed to #18
   (`monastery: under`).
3. **Four groups for the brief's sixteen,** for the pay: brothers (3) by the cells, the nearest;
   bell-ringers (4) down the tower's stair, the upper house's hardest at 23; brothers (2) before
   bell-ringers (2) in the chapter house; the Abbot alone. Two ringers alone were 28 fights to a
   rest at 22, four are 9.2.
4. **Highcell pays 4,183 xp a member,** 1.10 times the doc's scaled share of 3,800 (the doc wins over
   the issue's 2,600): brother 873 × 5, bell-ringer 913 × 6 and the Abbot 15,253, 25,096 shared by
   six. With J11's it comes to 6,974, and with I11's 2,355 and the other scaled shares (9,050) the
   area to about 18,379, 1.03 times the ask (§8).
5. **The chapter house is two brothers and two ringers, not three and two:** three and two cost the
   lower house 7.53 fights to a rest, under the aim of 8.75, and 146 xp a member more; two and two
   give 10.99.
6. **The Abbot is 1,700 hit points and 19d8+16** for the boss line's 1,381 and 24d8+24: won 66% at
   23 and 93% at 25. The line's 59% at 23 is nearer half, but the lower house counts the boss among
   its fights, and with one other group the mean of that group's 100% and the boss's must reach the
   limit of 80%: 79.5% at 59%, 83% at 66%. A second group below would take the pay past 4,300. Named
   in `OFF_LINE` and in `BOSSES` under `monksvale`.
7. **The upper house sits at 11.80 fights to a rest,** over the aim (8.5 to 10.5) and inside the
   limit (7 to 13): four brothers by the cells would make it about 9.4 and the pay 4,328.
8. **The gate is opened as N8's door was by #617:** J11's 26,24 is a door, `GATE` is in J11's exits,
   `j11_gate` is gone and its line (#499's 7) is the gate's label, said as the company passes the
   brother in it. In at 7,1 facing south, as J11 asked; out lands on 26,23 facing north.
9. **No rest inside,** as in Carn Dubh: the shelf's lee camp, J11's 21,23, is five squares from the
   gate. The well has no `heal`: no foot has crossed the snow to it.
10. **The cells' brothers and the ringers at the ropes are sights, not fights:** the cells' line is
    said on the east walk (11,5) and the ringers who fight are those come down the stair. The
    bells' event (4,13) does not use up and rings eleven, a gap, eleven, each time.
11. **The Laureate is the npc "A ringer"** (6,14), words only: a man in a robe not his, a beat
    behind the rest. The name keeps him hidden; #448 gives him the Bard's trainer entry and may name
    him.
12. **The Novice is "A novice"** in the last cell (14,9), words only: he keeps the fasts and has
    never seen a brother break one. #506 gives him the letter.
13. **The board of the hours is an inscription** (5,4, by the refectory door), read by a dwarf or a
    Linguist as *KEEP THE HOURS. KEEP THE HOUSE. OPEN THE GATE.* It marks nothing.
14. **The secret:** the seat's hint `hc2_seat` (7,10) stands a hand off the hollows its feet have
    worn; the secret door is at 7,11 behind it and the undercroft rows 12 and 13. The doc's line is
    split: the niches' event says *Every niche is full.* and the last niche's lip (13,12) is an
    inscription whose reading, ONE to ELEVEN, is the count that ends on eleven, read only by a dwarf
    or a Linguist.
15. **The finds:** the monks' things at the undercroft's far end (2,13): 600 gold, an Ice Axe +1
    (1,950, the dearest find, in the window of 5,000) and a Skinning Knife +1, Rimewater's rung.
    With J11's, a clear pays 1,300 gold.
16. **The Abbot's slain line says the robe:** *The Abbot falls, and its robe falls open on grey
    plate. Overhead the bells ring the hour all the same.* It never comes back.
17. **Novelty claims the landmark `monastery`,** Highcell's site, built now. A machine in a robe
    still has no token, and paralysis is on the road before, in the Kilns and others.

Decided by delegate for #501, each the owner's to overturn:

1. **I11 is laid whole in the High Spine at 264,318,** core, band 22–23, not the doc's 23: a band of
   23 alone wants its hardest group at 24 (the curve) and the roster tops out at the snow troll's
   23. J11 is laid so, and Saltreach's C7 was (docs/areas/saltreach.md §9, #178's 2); the gate holds
   it at 22, harder than 23. The map is its whole box, Monks' Vale's 154 squares east and Ashfall's
   187 west, and the crossing line names the High Spine.
2. **The J11/I11 seam is walked, not taken:** the boxes share a whole edge and the crossing line
   goes on it. J11's summit path goes on west, its row 10 opened at 0 to 2 from mountain to snow
   (named in J11's header), I11's from 31,10 to the snow line. No exit is added.
3. **The High Spine's crossing words are the range's own,** as Monks' Vale's are (#499's 4), said
   going over and not coming back. The walkthrough walks it at 19 (warning), 20 (harder) and 22
   (the name alone). The rule stands; #503 changed the words (#503's 4).
4. **The ridge trail crosses the north edge at 27,0,** not the scaffold's 28,0: the atlas's trail
   beyond is at 291,317 and the edge check binds, as it moved J11's road a square. The Stone keeps
   the atlas's site, 28,0, on bare rock beside the trail's square. Past the edge, for now, the
   world ends.
5. **The Peak Stone counts for the Hearth once stood at:** its row in `src/content/stones.ts` reads
   `restored: { seen: 'highspine_i11:i11_stone' }`, set by the once event at 28,0 and kept by the
   save already, so no new flag; `stonesRestored` reads it (`world.stones`, the title's horizon, the
   almanac). §2 has the company stand beside the only whole Stone, and with no condition the
   Hearth's five could never all count. #505 may move it.
6. **The ring** is a 3 by 3 of bare stone under the Stone (27 to 29, 1 to 3), its stones rocks
   round it (26,1 to 2; 25 to 30, 4; 30, 1 to 3), entered from the snow line through the gap at
   26,3 (25,3 is snow). The Stone is on the north edge, so the ring is open to I10 there: #502 may
   close it round on its row 31 (26 to 30).
7. **The slab is the corner stone at 26,4, beside the gap.** The hollow under it, 26,5 (the
   Lanterns' survey marker, lit) and 26,6 (the chest), is walled in rock, so no climb reaches it.
   The hint at the gap, 26,3, is *Every stone of the ring is frosted along its edge but one.* The
   slab's square is one the outdoors leaves undressed and the pre-#9 rule dresses, which the art
   check wants of a map whose only wall face is the slab.
8. **Four groups, the brief's encounters, not §4.1's six:** eagles (4) at the nest, 29,9, who do not
   roam, the nearest; brothers (4) on the snow line between the crest path and the Stone, 23,5;
   eagles (4) over the snow line south of the path, 22,14; snow trolls (2) in the snow at the
   crest's foot, 22,21, who do not roam, at 23, the far end. A fifth group (brothers, 3) would pay
   2,791, past the 2,600 asked.
9. **I11 pays 2,355 xp a member,** 1.00 times the doc's scaled share of 2,350 (the doc wins over the
   issue's 1,600). The area stands at 5,146; with the other scaled shares (12,850) it comes to about
   17,996, 1.01 times the ask (§8).
10. **The nest** is an event at 29,8 and a chest at 30,8 (`i11_nest_bones`: the Lantern's Badge and a
    Smooth Grey Part), up a spur off the crest path at 29,9 to 10, the eagles on the spur; D3's
    kestrels' nest is the precedent (an event and a chest). The hand-in (#56's 46) is #506's; the
    grey part is what #502's toll may take.
11. **Three items, new in `whitespine/items.ts`, priced 0** (no shop buys): the Lantern's Badge, the
    Smooth Grey Part and the Lantern's Instruments, the doc's "thing the Lanterns' halls take",
    whose taking is #506's. Their texts are seen, never explained.
12. **The finds:** the cairn at 27,1, just south of the trail's square, a Sapphire Vial and no gold;
    the hollow's chest 300 gold and the instruments (the doc's 300). I11 holds 300 gold, the area
    1,000.
13. **The Sheer is kept as the atlas cuts it:** the cliff 2 wide down the west, Ashfall's grey
    pines, grass, hills and ash west of it, reached only by a Mountaineer's climb down; three events
    carry the density there (`i11_ash`, `i11_scree`, `i11_fallen`). The lookout at the top, 6,9,
    sees Fire Mountain. Novelty claims terrain `cliff`, first used here.
14. **The snow line** runs down the crest's flank from row 1 to row 26: the last two or three
    columns of pines and the mountain's foot under snow, pines below it (west) and rock above
    (east); the camp, The last pines, at 20,12 under it.
15. **The brothers who keep the Stone** are a thing seen: `i11_keeper` at 28,1, the snow on its
    shoulders that does not melt. The monks' shrine at the Stone's foot, 29,1, trains endurance,
    its eleven pebbles.
16. **The site "Peak Stone" loses `planned`,** and the `highspine` zone row gets its map and its
    crossing words.

Decided by delegate for #502, each the owner's to overturn:

1. **I10 is banded 22–24, not the doc's 23–24.** The curve wants a map's hardest group at least the
   larger of its floor plus one and its top less two, which at 23–24 is 24, and only the king alone
   is that: the brief's group, the king and two giants, is 23.3. Banded from the area's floor, as
   Highcell's upper house and I11 are, it keeps that group with the king its leader. The gate
   judges the box at 22 and the king at 22 and 24 (58% and 79%); as it measures a fight he is 56%
   at 23 and 97% at 25, so "about half at 23, nearly always at 25" holds. The other way: the king
   alone as the boss, as the Abbot is, and the giants a group of their own, which loses their
   breaking when he falls.
2. **The giants sweep** (`sweep: { chance: 0.25 }`, bare: an arm, the front row), both. The Stair
   Giant is MONSTERS §3.3's sweeper, the brute come down whole to 0.85 of its line: 632 hit points
   to 537 and 5d7+8 to 4d7+8; its xp (1,827) and gold (70 to 160) are kept.
3. **The Stair-king is tuned by the gate, level 24 kept:** 1,381 hit points to 1,650 and 24d8+24 to
   16d8+16, sweeping a turn in four; xp 15,253 and gold 250 to 500 kept. 1,600 and 18d8+18 was 73%
   at 24, under the limit; 1,700 and 15d8+15 was 38% at 22, which drops the map's floor figure
   under 80%. He is listed off the line, as the Abbot is (`OFF_LINE`, `tools/tests/harness.ts`).
4. **The king's group** `i10_king` stands at 2,20, the Stair's top step: the king and two giants,
   he their leader, not roaming, not coming back, with a slain line. The Stair (the road at 0,20 and
   1,20 between the Sheer's cliff and the seat's rock) is reached from the top only through 2,20,
   so no company goes down unasked. A Mountaineer can still climb down the Sheer anywhere, as at
   I11.
5. **The toll** (`TOLL`, exported from the map) is 1,500 gold: inside the 5,000 window, about what
   the range's finds hold before the head (J11 700, I11 300, Highcell 600, so the range pays its
   own toll if nothing else is spent) and under the dearest ware the pass wears (2,050). The
   answers: pay; give him the grey part (I11's nest); give him the faceless coin (Thornmark's, #56's
   9); refuse. Each of the three sets a flag, `toll_paid`, `toll_part` or `toll_coin`, for #506's 47
   to read. The ask is the doc's toll line, and the part's answer carries *We were on this mountain
   before anyone came down the sky.*
6. **The hoard** is under the seat, a slab of rock: a hollow at 2,18 (the chest `i10_hoard`: 1,200
   gold and a Bear Spear +1, Rimewater's rung at 2,050, the area's dearest find) and 2,19 (the
   doc's hoard line, `i10_hoard_seen`), walled in rock (the Sheer's cliff at 1,18 and 1,19 made
   rock, so no climb reaches it), its one mouth the king's square. A company that paid walks through
   his square (a group answered stands aside and is walked through, MONSTERS #544's 4), so it can
   rob the hoard: the game has no chest kept shut while its group stands. For the owner: accept it,
   or a systems call.
7. **The Stair and the head:** the road leaves the trail at 23,20 and runs west to 8,20, the
   atlas's link end (272,306); the head is cut stone at 2 to 7,20, 3 to 7,21 and 5 to 7,19, the
   Stair road at 1,20 and 0,20 through the Sheer to the west edge. The atlas draws no road for the
   link, so the edge check's square 0,20 was owed to #510 (`EDGES_OWED`, `tools/tests/pillars.ts`),
   which lays H10's 31,20 as road against it and empties the list.
8. **The Stair in snow,** `i10_stair` at 13,20 on the road short of the head: a giant and a snow
   troll, not roaming, respawning at 2880, snow drifted round them (rows 18 to 22, columns 10 to
   16). The drift at 12,21 (*The wind did not lay it.*) and burnt bones by the trail at 20,16 are
   things seen.
9. **Three groups, the brief's encounters, not §4.5's seven:** eagles (3) in the pines nearest the
   way in (17,25), the Stair in snow and the king's. The king's alone pays 3,151; four eagles would
   pay 4,343 (1.24 times its share), three pay 4,197.
10. **I10 pays 4,197 xp a member,** 1.20 times the doc's scaled share of 3,500 (the doc wins over
    the issue's 2,400), under the 4,375 cap; 1,046 to a company that pays the toll. The area stands
    at 13,525; with I9, I8 and the side quests' scaled shares (5,550) it comes to about 19,075,
    1.07 times the ask (§8).
11. **Stairwatch** is the rock south of the head (3 to 8,24 to 25; 4,26; 7 to 8,26; 4 to 7,27), the
    chimney a secret door at 6,24 off the pines, its shaft 6,25, the ledge 5,26 and 6,26. The
    ledge's event `i10_ledge` is at the atlas's site, 6,26 (270,312), and the site loses `planned`,
    as Spine Summit's did. The hints are the rope's wear at 6,23 (the secret's `hint`) and smoke at
    9,22. The old champion (5,26) has words only; #448 keeps his trainer entry and the night on the
    ledge.
12. **The caravan** short of the head: the caravan-master (18,19) and the wagons (18,21) east of the
    Stair in snow, and his girl (6,19) at the head, off the road. People with words only, as J11's
    herder; #506's 47 makes the quest.
13. **The issue's secret, the maintenance mark,** is a thing seen on the toll-stone (`i10_tollstone`
    at 4,21: a ring with a bar across it), not a door; the doc's secret, the chimney, is the box's.
14. **The shrine older than the monks'** is at 7,21, of might, a stone hand held out; the cairn at
    the trail's crossing, 22,21, holds a Sapphire Vial and no gold; the camp, The drovers' fire, is
    at 11,28.
15. **Novelty claims the family `giants` alone:** `uses()` has no token for sweep (as G10 found),
    and `encounter:choice` is Thornmark's (#645). The toll is the second choice put before a fight,
    and §2 says so.
16. **The trail behind the north ring:** 19,1 is pine and 18,2 road, not the scaffold's road at
    19,1, which sat behind the ring square 19,0 against the atlas's mountain at 283,285 (the edge
    check).
17. **The Stone's ring** (#501's 6) is closed round on I10's row 31 by the mountain at 26 and 28 to
    30, the trail at 27 its one way north.

Decided by delegate for #503, each the owner's to overturn:

1. **I9 is laid in Sheer Point** (`sheerpoint_i9`, 264,254), as §4's table and the issue have it,
   though the atlas's cut now gives the High Spine 547 squares of the box to Sheer Point's 278
   (Loch Fuar's 194, none's 5). Laid in the High Spine, the box would take Sheer Point's seed at
   276,262 and leave the zone 79 squares, under the atlas check's 300 (`tools/tests/atlas.ts`,
   "holds land"); laid in Sheer Point the zone holds 2,587 and the High Spine 4,792. So it bends
   the rule that a box goes in the zone holding most of its land, for the check's sake, and the
   crossing line falls at the I10/I9 seam, as the bands block planned. The issue counted 755 of the
   box's 774 squares as Sheer Point's and 19 as the High Spine's, on the cut before; the figures
   here are the atlas's now.
2. **Band 22–23, not the doc's 23,** banded from the area's floor as I11 is: a band of 23 alone
   wants a group at 24 (the curve's rise) and the roster's top below the bosses is 23. The gate
   judges it at 22, I10's floor, so north along the ridge nothing rises; the land changes, so the
   name is said.
3. **Sheer Point's crossing words are its own** (`atlas.ts`): two under the floor, *Out here the
   land runs thin toward the sea, and nothing on it is any kinder than the range.*; three under,
   *Nothing on the Point would spare you. The way you came is still open.* The defaults ("harder
   than the road behind") are untrue at the same floor. Walked at 19, 20 and 22; straight back,
   nothing is said.
4. **The High Spine's words are made true from the ridge too:** *On the crest the wind is at you,
   and nothing up here is any kinder.* and, three under, *Nothing on this crest would spare you.
   The way back is still open.* The old ones named a crest crossed and the vale behind, and a
   company coming south from the Point (the chapter sends every one back to the Stair) does
   neither. #501's 3 keeps its rule, not its words.
5. **The trail as the atlas cuts it:** at 18 from row 31 to 16, at 19 from 15 to 7, at 20 from 7 to
   0, out at 20,0 (the atlas's trail goes on at 284,253); a square is added at each diagonal step
   (18,23, 18,25 and 19,7), as J11's road has them.
6. **The secret is the issue's,** the masons' cache behind their tally, not §4.6's trolls' cave:
   the tally (the hint) at 17,10, its last row running into a crack; the secret door at 16,10; the
   cache at 15,10 (shards in the straw laid in fives, seen, no shard items, as G10's hide) and
   14,10 (the chest `i9_cache`: §4.6's takings, 500 gold and a Hunter's Bow +1, Rimewater's rung
   at 2,050), walled in rock so that no climb reaches it. The first masons' camp is a snow shelf
   off the trail, `i9_masons_camp` at 18,11. §4.6's hint words are kept as a thing seen at the
   gully, `i9_trodden`, 12,20.
7. **The gully:** snow cut through the crest's west shoulder (16 to 17,19; 13 to 17,20; 15 to
   17,21), joining the pines to the trail; the snow trolls lie in it at 15,20 and do not roam.
8. **Three groups for §4.6's four,** the brief's kinds, the fewest that pass: eagles (4) in the
   pines by the way in, 15,28; snow trolls (2) in the gully; Ashen masons (4) at the trail's end,
   20,4, past their sledge. Five masons drew the day to 6.5 fights to a rest, under the limit of 7;
   a fourth group, a lone troll in the north-west pines, paid 2,104 but drew it to 11.5, off the
   aim. These three give 9.43, inside the aim.
9. **I9 pays 1,800 xp a member,** 0.88 times the doc's scaled 2,050 (the doc wins over the issue's
   1,400): eagles 4 × 873, trolls 2 × 1,827 and masons 4 × 913, 10,798 between six. It holds 790
   gold, the cache's 500 and four masons' purses of 45 to 100 each. The area stands at 15,325 of
   17,867; with I8's and the side quests' scaled shares (3,500) it comes to about 18,825, 1.05
   times the ask (§8).
10. **The Ashen Mason is placed here first:** #507's 10 owed it to I8, and it is out of `UNPLACED`
    (`tools/tests/maps.ts`).
11. **Two under is owed to #18:** I9 at 20 wins every fight (`'sheerpoint_i9: under'`), and with its
    three groups the area's pool is 91.5% two under, over the limit of 90%, so
    `'the Whitespine: under'` is back (I10 dropped it at 89.9%).
12. **The wilderness features:** the cairn beside the trail at 20,13 (a snow square cut in the
    peaks; a Sapphire Vial and no gold, as the range's cairns; *to steer by when the cloud is
    down*); the camp, The lee of the crest, at 13,25; a shrine of luck at the Sheer's edge, 1,19, a
    lamp kept burning; the hermit, words only, under the peaks by the shore, 8,7: the Hand's grey
    boats round the Point by night, low going out, high coming back.
13. **The Hearth's heat grows north up the trail:** `i9_wind` at 18,28 (the wind warm, the snow
    wet), `i9_thaw` at 19,15 (the snow gone off the rocks), `i9_hearth` at 20,2 (*so close its heat
    is on your face*, the doc's "so close its heat is felt"). **The causeway is seen,**
    `i9_causeway` at 20,1: a road of cut stone out over the sea, every stone catching the light;
    the stolen shards are found and not told.
14. **The giants' cairn** is a thing seen on the crest, `i9_giants` at 18,18 (*They were set, not
    rolled.*); the masons' sledge, `i9_sledge`, is at 20,6. In the pines: `i9_shore` 4,2 (steam on
    the sea), `i9_hollow` 8,14 (a warm hollow the size of a cart), `i9_sheer` 1,27 (Ashfall's coast
    far down) and `i9_kill` 8,30 (the eagles' kill).
15. **The scaffold's four pines at 31,0 to 3,** walled in by mountain and unreachable, are
    mountain: the density cap counts an unreached square as past it, and the edge check agrees
    (dry against dry).
16. **Novelty claims nothing:** §4.6 has "Nothing; the ridge is the walk", and `novel` is
    unchanged.
17. **Sheer Point's road** (the gate's `ROADS`) is the trolls and the masons; the eagles are off
    the trail, as I10's are off the High Spine's road.
18. **No exit north:** the world ends past 20,0 until I8 (#504) is built, and the walkthrough says
    so. I8 is built: the trail goes on into it (#504's 3).

Decided by delegate for #504, each the owner's to overturn:

1. **I8 is laid in Sheer Point** (`sheerpoint_i8`, 264,222, core): the cut is all the Point's, 757
   squares of land and shallows, and 267 are sea in no zone. No crossing line from I9: same zone,
   same floor.
2. **Band 22–24, not the doc's 24:** the curve wants the hardest group at the greater of the floor
   plus 1 and the top less 2, 25 at 24 alone and 24 at 23–24, and the roster's top below the bosses
   is 23, so the box is banded from the area's floor as I10 is (#502's 1). The foreman is the
   group's `leader`, not a level; the gate judges the box at 22.
3. **The trail as the atlas cuts it,** ending at 22,14 (286,236); the masons' track goes down from
   it to the tip's hills, dirt.
4. **The causeway** is cut stone, as the Kilns' pier is, a square wide, from the shore at 17,6 to
   17,1 (281,223) out of the tip's north-west shore, since off the north shore it could run two or
   three squares only. It ends over deep water one short of the north edge: as far as the Hand has
   built it.
5. **Four groups, the brief's kinds once each, the fewest that pass:** eagles (4), masons (3), the
   foreman's five and a snow troll by night. Four masons with the foreman drew 13.17 fights to a
   rest, past the limit of 13; five give 8.99.
6. **I8 pays 2,104 xp a member,** 0.96 times the doc's scaled 2,200 (the doc wins over the issue's
   1,500): eagles 4 × 873, masons 3 × 913, the foreman's 5 × 913 and the troll 1,827, 12,623 between
   six. It holds 980 gold, the cave's 400 and eight masons' purses. The area stands at 17,429 of
   17,867, about 18,729 with the side quests' scaled 1,300, 1.05 times the ask (§8).
7. **The night is Wenna's question, not the camp's rest:** the game has no hook for a rest at a camp
   (an inn's `nights` set a flag on a stay, and the Whitespine has no inn room). Sleep sets
   `q_wenna_taken` (`WENNA_TAKEN`, exported from `maps/sheerpoint_i8.ts`) and says the waking; Not
   yet sets nothing. A camp `nights` is a systems change, the owner's to ask for; #505's step reads
   the flag, which only that choice sets.
8. **Wenna moves** (#76), named The girl out of the hole as at M9, K9 and the lodge: the lodge's
   fire gains an `until`, the first visit to J11 (a one-line edit to `rime_lodge.ts`); then J11's
   gate, 27,23, until the first visit to the Point; then the camp, 13,8, until the flag. One place
   at a time, never in a fight; the walkthrough checks the four states.
9. **The secret is the doc's sea cave,** not the issue's way up to Rook's Nest: shut to climb, wade
   and float (740 squares checked), its water running out under the rock beside the stones. The hint
   is `i8_damp`, always there; the doc's oars, `i8_oars`, are by night on the same square, since the
   pillars' hint rule refuses a hint by night alone; the boat from nowhere is in the waking's words.
10. **The finds:** the chest `i8_hold`, 400 gold and no item; the uncut shards are seen in the
    crates under the Hand's seal (`i8_crates`), as at G10's hide and I9's cache. Act IV has no Rift,
    so there is no shard item and no quest item for #548: the doc's *a shard from the cave* is
    #548's to place.
11. **Rook's Nest** is a hollow in the tip's rock at the atlas's site, 22,8 (286,230); the watcher
    is words only, #448 keeping his trainer entry and the Thief's quest. The site loses `planned`.
12. **The deserter** (#56's 48) is words only, #506 making the quest: he stands in the rocks at the
    east pines' end, 31,30, his tally seen at 31,29 (ELEVEN).
13. **The features** are the Point's own: a cairn (a Sapphire Vial, no gold), the drowned god's
    shrine (endurance), the camp and eight things seen (§4.7). The step's line, the doc's, is
    `i8_causeway` on the first stone.
14. **Novelty claims nothing:** there is no token for the sea reached from the range, a causeway
    over water (its stone is the Kilns' pier's) or a person taken, and a cave on the atlas is on the
    road before.
15. **The gate:** `ROADS` `sheerpoint` runs on to `i8_eagles`, `i8_masons` and `i8_foreman`, the
    troll being off the road, by night; `'sheerpoint_i8: under'` is owed to #18.

Decided by delegate for #505, each the owner's to overturn:

1. **Begun where The Sleepers ends, or in Monks' Vale:** its start is Rimewater's end, so the goal
   goes on over the pass with no gap, and a company in J11 by any other way begins it there.
2. **Done on `q_stair_top`:** `i10_top`, on the step below the king's, there once the toll is
   answered or the king is down; named for the place, not the working title, for #518 to read.
3. **She is unnamed in the journal:** the girl out of the hole in the goal and her in the entries,
   as Rimewater's journal and every line have her; Wenna is the docs' name.
4. **Nobody is named reading the explorers' line:** the doc's Cassian is a member a company may not
   have, so one of us reads it; the line is in no text before this (§11).
5. **The bells are the same eleven and the same gaps,** the issue's words, not the doc's night the
   Queen died: the keeper's log holds that, and the company finds it (DESIGN §7).
6. **Highcell is three entries:** the cells for every company; the board for a reader alone (its id
   is kept only when read, #538); the grey plate on the Abbot slain, as the brothers come back.
7. **Two goals in Highcell:** the gate turns the goal to the chapter house, whose sight
   (`hc2_chapter`) turns it north before any fight there, so the Abbot locks nothing.
8. **The Stone is an entry and no step:** the High Spine's step is the Stair's, one to a zone
   (EXPANSION §5.8).
9. **Paid and fought are two entries,** on the toll's three flags and on the king slain, so the
   journal says which.
10. **Her fire's goal names her:** a company that never heard her at Rimewater's door finds nobody
    there, and the Stair's goals still come once its head is seen, so nothing locks.
11. **Fourteen short entries** in place of the doc's five long ones, each two lines at most on the
    journal's page.
12. **The walkthrough sets her words at the door** (`q_wenna_lodge`) by hand, as I8's block does,
    and plays The Sleepers' last two triggers; the toll is paid from 1,500 gold given.
13. **The chapter pays no xp:** §8 gives it none, so the curve's row is unchanged.

Decided by delegate for #506, each the owner's to overturn:

1. **The pay rides on the answer that ends each quest,** a hand-in (#43) paying only gold: 1,200,
   1,200, 1,500 and 1,500 xp, split evenly among the living as a fight's is, 900 a member.
2. **The Novice ends where §6 puts it,** Highcell and Anvilhall, not the issue's Rime Lodge too:
   told, the boy is on the step below his mother (`after` `q_novice_told`).
3. **"Tells him" is the company's answer, not the text's:** *Tell him.* never says what the brothers
   are; the letter, his mother and the boy say only what he saw, that nobody eats.
4. **The badge's two takers:** Hester Dunmore, the Reader at Lantern Watch, whose book takes it, and
   a brother standing in Highcell's first cell (14,3), who holds out its hand only to the badge.
5. **The Reader may be refused** (*Keep it.*), so Sunderwood's clear counts no pay from an Act IV
   quest; the brother's question has the one answer, so the Whitespine's counts the 200.
6. **The Lantern's Instruments go to the Reader too,** a hand-in at the first meeting that pays
   nothing, I11's chest having paid 300 with them (#501's 11).
7. **The herder hires, and the nest opened begins it too;** once it is, he remembers the Lantern
   going up for the Stone with a glass and a chain, the instruments' own.
8. **The girl moves, not the caravan:** at the head until the toll is answered or the king is down
   (`STAIR_PASSED`), then by the wagons (19,19); nobody says the caravan goes down.
9. **Her father's thanks pay the 250,** a one-answer question as Rimewater's guide's, and set
   `q_toll` too, so a company that answered the toll before meeting him still has the quest.
10. **The passage is a price on the deserter's question,** the Compact's fare, 600, unhalved (he is
    no member): no ticket is carried and no seller beyond the range is touched.
11. **The swap is his:** he chalks a slate short of the true count and goes back to the causeway,
    below the tally-house (18,8); the item swapped is the true page, The Masons' Tally.
12. **No `after` on the masons' number:** the doc's only count is the tally's ELEVEN; the masons'
    groups come back, so `slain` cannot key on them; nothing counts them.
13. **Quest ids `novice`, `nest`, `toll` and `mason`,** the flags `q_mason*`: Cairnmoor's quest is
    `tally`, with `q_tally*`.
14. **The curve's row owes no xp now:** the quests take the clear to 18,329, past 17,867, and the
    test asks the entry dropped; the gold, 5,290 of 10,800, stays owed to #445.

Decided by delegate for #448 (the Whitespine's three), each the owner's to overturn:

1. **The prestige is the pay.** No answer pays xp or gold; the quests' own fights pay as any fight
   does, and the curve counts them with every group: the clear is 20,274 xp a member (18,329
   before) and 5,750 gold, the owed row's floor raised to it. The budgets stand.
2. **Set at 26 with monsters already drawn.** Each night is a group of the box's own kind that
   comes only `after` the trainer is answered and only by night, never back once down. By the
   harness, a company at 26 fights 10.7 of the five brothers to a rest (10.5 asked) and 15.7 of two
   giants, so the two pairs together cost it a fight and a third of its day.
3. **Two pairs, not three giants, on the ledge.** Three giants at once ran I10's day to 6.62 fights
   to a rest, past the gate's limit; two pairs keep it at 10.59 and the floor at 91.6% (86% before).
   The second pair comes once the first is down, so the night is a hold, wave after wave.
4. **A night is the hours, not the whole of one.** No engine counts a night through; the groups
   walk only by night (`hours: 'night'`) and the trainer's words after the last is down are the
   dawn. A company may fight the two pairs on two nights (§11).
5. **The trainers are named,** since the seeking quest's goal reads "Find <name> in <place>.":
   Edric, the old champion; Oswin, the summit's hermit; Brother Lark, whose name keeps him among
   the brothers until he is met.
6. **Asked only of the class at 27 with the second,** as the third is taught (DESIGN §5): to any
   other company the trainer says only their first words.
7. **The Stone Ring's call is the miners' hymn.** DESIGN names the Stone Ring's call; #56's 36 as
   built (#471) is the hymn, its flag `q_hymn_sung` written for this quest, so the Bard keys on it.
8. **The keeper's log is the chest taken** (`downs_e3:e3_log`), not the item carried, so it holds
   once the log is found whatever later leaves the pack (the Cleric's crossing to Anchorhold).
9. **The vigil's brothers at 5,10, beside the camp,** where a company resting there keeps the
   vigil; the toll-takers at the shaft's 6,25, the ledge's one way up.
10. **Quest ids `ledge`, `vigil` and `eleven`;** flags `q_ledge`, `q_ledge_held`, `q_vigil`,
    `q_vigil_kept`, `q_eleven` and `q_eleven_sung`.

Decided by delegate for #448 (the Ranger's and the Thief's), each the owner's to overturn:

1. **The watcher is Hereward** (§10), named as the other trainers are, so the seeking goal reads
   "Find Hereward, the watcher in Sheer Point."; his words from #504 stand as his first meeting's.
2. **The orders are read from the pack, never handed in:** holding them with the writer seen, he
   reads them once (`q_rook_read`) and hands them back, so the Factor's rung (#635) finds them
   carried. He teaches on both held at once, or on `q_rook_read`, so they may leave the pack after.
3. **Learning who writes them is seeing it write,** `dd3_writes` and its flag `q_writer_seen`
   (#22); nothing says whose hand. No fight is asked: the walkthrough takes the orders with no
   group beside and leaves the Tallymaster at its desk, but a company that fights it still finishes.
4. **No group placed and no pay:** the Dead-Drop's levels are 26 to 28 as built, the groups that
   stand won at 27 in the walkthrough; no gate, density or curve figure moves.
5. **Quest id `whose_hand`; flags `q_rook_orders` and `q_rook_read`,** since `orders` and
   `q_orders_read` are Thornmark's survey orders already.

Decided by delegate for #508, each the owner's to overturn:

1. **Band 22–23 for all three, not the brief's 23–24:** the curve wants the hardest group at 24 in
   23–24 and the roster's ordinary monsters top out at 23, its 24s being guardians; as I9, I11 and
   J11 are built.
2. **J10 and J12 are in Monks' Vale's zone, I12 in the High Spine's:** the crossing from K10 is said
   where it meets J10, in the range's own words as the jump said it, and not again down into J11;
   J12 and I12 go on from J11's and I11's land, so no line falls between.
3. **One group a box, a heavy pair:** two stair giants at their fire (J10), two snow trolls (I12,
   J12), the fewest the pace, gate and density checks pass. Each pays about 609 xp a member, inside
   the 400 to 700 asked.
4. **The brief's eagles are sights, not a group:** the nest on the Spine in I12, the eagles and
   bones over J12's crags. An eagle group or a mixed one falls under the hardest-group floor of 23
   or pays past the share.
5. **The giants ask no toll:** their group has no choice, no leader and no king (the Stair-king is a
   guardian, never repeated). The goatherd says *Off the Stair they ask nothing of anybody.*
6. **J10's fire on the slope answers I10's `i10_fires`** on the same row (9): *Nobody sits at it,
   but somebody keeps it fed.* The giants sit at their own fire in a snow clearing in the pines,
   with its ring of stone seats.
7. **The road across J10's corner is walked,** as #712 walked L10's: K10's `SADDLE` and J11's
   `CLIMB` are removed, the atlas test's corner exception (`across`) goes with them, none being
   left, and the outdoors test's taken-exits check names the notch alone. Three road squares are
   added at the diagonal steps (30,19, 29,20 and 20,29), so that the road runs square to square as
   J11's four do (#499's 2).
8. **`SADDLE`'s words live on as a sight on J10's road** (`j10_saddle`, 30,20). `CLIMB`'s line is
   gone: back over the border straight away nothing is said, and come to it from elsewhere the log
   names Loch Fuar, as at any walked border.
9. **J11's start stays at 20,1,** where `SADDLE` landed, the road's second square: nothing needs it
   moved.
10. **Gold is carried in finds, 1,700 a box:** 1,400 in each strongbox (the giants' cauldron of the
    toll, the abandoned packs in the cleft, the cell's alms box) and 300 in each cairn; elixirs in
    the strongboxes and Sapphire Vials in the cairns, no ware, as the Whitespine sells nothing.
11. **The owed row (`CURVE.whitespine.owed`, #508) is removed:** the curve says xp and gold both
    hold.
12. **The Giants label on the atlas loses `planned`,** its land being laid.
13. **No den (#88) in any of the three:** a den's keepers and brood pace past the limit or pay past
    the share, as in Rimewater's seven (#497's 20).
14. **The secret doors stand a square from the first cut** (J10 12,16; I12 17,20; J12 18,11): each
    is its box's only counted wall, so one door decides the art check's 0% or 100%, and these
    squares pass both its rules (as M10's did, #497's 24).
15. **The people are unnamed** ("A goatherd", "A charcoal-burner"), as I9's hermit and L10's
    trapper.

## 10. Names

The Whitespine's naming pass, by the rules of `docs/NAMES.md`: the range keeps the Crown's and the
Lanterns' English, as Sunderwood did (NAMES §4), since the only people who live here are a monastery
founded from below and the giants, who have no names on the map. Chosen for #444 (#443, call 2).

- **The tongues.** The monks' own speech is Kiln-script, the dwarves' old script (MONSTERS §8.1),
  which is the crew's maintenance language (DESIGN §9, Act III): they have no tongue of their own,
  and a dwarf or a Linguist reads what they say to each other. The giants' words for the Stair, if
  any, are the king's to hint and never the map's.
- **The names:**

  | Was | Now | What it means | Also thought of |
  |---|---|---|---|
  | the Monastery | Highcell | a monastery is cells, and this one is high | Bellhouse, which says too much; Spine Abbey |

- **A person:** Hereward, the watcher in Rook's Nest, the Thief's third (#448), in the Crown's old
  English as Edric and Oswin are. He was "A watcher" while he had words only.
- **Kept:** the Whitespine, the Crown's name for the range; Monks' Vale, the High Spine and Sheer
  Point, the zones, each a place and a plain thing; the Giants' Stair, which the giants gave their
  name to and not the other way; Stairwatch, Spine Summit and Rook's Nest, the Lanterns' names for
  the three places where the third prestiges wait (DESIGN §5), each one place and one name; the
  Peak Stone, as the Grove Stone and the Tide Stone are; the Sheer, lettered on the plan's rows as
  Kestrel Edge and the Scarp are (docs/areas/saltreach.md §10).
- **Ids stay:** `monastery` is the dungeon's id under its new name and `monastery2` its lower
  house's, `whitespine`, `monksvale`, `highspine` and `sheerpoint` the plan's.

## 11. What was cut

- **K11 and K12,** Monks' Vale's east under the pass: 353 squares of land, 168 walkable, and 544,
  218 walkable; mountain and pine with nothing on the atlas or in the docs but the monastery's
  plate, which moves to J11's gate (§9). The maps of the J column end in them.
- **The slivers** in Rimewater's and Ashfall's boxes: K10 holds the pass's road as Rimewater's
  (#491) and H10 the Stair's foot as Ashfall's (#510); the rest, about 110 squares of mountain at
  the zone line, goes with those boxes' edges.
- **The country behind** is not cut: J10, I12 and J12, 2,771 squares of land, 1,277 walkable, are
  built (#508, §4.8), which closes #508.

About 900 squares in all cut, to come back as country only if the act plays short.

Owed, from J11 (#499):

- **The monastery drawn tall** over one square, as the brief asks, needs a `Landmark` kind besides
  the lighthouse's (`src/game/map.ts`, `src/ui`): a systems change the owner may ask for. J11 draws
  it as a block of building squares on its shelf (§9, #499's 5).
- **The pilgrims' hostel's cellar,** the issue's secret, is not built: the doc's store behind the
  wall is (§4.2, §9, #499's 14).

Cut and owed, from Highcell (#500):

- **The sparse groups:** four for the brief's sixteen, the pay held (§9, #500's 3). The upper house
  sits at 11.80 fights to a rest, over the aim, and four brothers by the cells would make it about
  9.4 and the pay 4,328 (§9, #500's 7).
- **The Abbot's robe opening as it is hurt** waits on a systems change, the owner's to ask for: a
  drawing is not told its monster's wounds (§9, #507's 5). The slain line says the robe as the
  Abbot falls (§9, #500's 16).
- **The issue's own secret,** the bells' pattern on the frame, hinted by the lighthouse keeper's
  log, is not built: the undercroft behind the seat is, as §4.3 has it (§9, #500's 14).
- **The Laureate's** trainer entry is built: Brother Lark teaches the Bard's third for The Eleven
  (§6, #448); the Novice's letter is built (§6, #506; §9, #500's 11 and 12). The chapter's Highcell
  entries are written (§5, #505).

Owed, from I11 (#501):

- **The Eagles' Nest hand-ins** are built: the Reader at Lantern Watch takes the Lantern's Badge
  and the Lantern's Instruments, a brother at Highcell the badge, and the Smooth Grey Part is what
  the toll at the Stair's head takes (#502, §4.5; §6, #506; §9, #501's 10 and 11).

Cut and owed, from I10 (#502):

- **Three groups for the brief's seven,** the pay at 1.20 times its share already: a fourth eagle
  would take the box to 4,343, 1.24 times, near the 4,375 cap (§9, #502's 9).
- **The hoard can be robbed once the toll is paid.** The game has no chest kept shut while its group
  stands, and a company that paid walks through the king's square to the hollow: the owner may
  accept it or ask for a systems change (§9, #502's 6).
- **The issue's own secret,** the maintenance mark, is a thing seen on the toll-stone and not a
  door: the chimney to the ledge is the secret, as §4.5 has it (§9, #502's 13).
- **The Stair's foot** was owed to #510 with the rest of H10, and is built: its 31,20 is road against
  I10's 0,20 and `EDGES_OWED` is empty (§9, #502's 7).
- **The Toll and the ledge.** The Toll (#56's 47) is built, on the flags `toll_paid`, `toll_part`
  and `toll_coin` and the king slain (§6, #506); the old champion on the ledge, Edric, has his
  trainer entry and the night on the ledge, The Ledge (§6, #448; §9, #502's 5, 11 and 12).

Cut and owed, from I9 (#503):

- **Three groups for the brief's four,** the pay at 0.88 times its share: a fourth, a lone troll in
  the north-west pines, would pay 2,104 and draw the day to 11.5 fights to a rest, off the aim;
  five masons draw it to 6.5, under the limit of 7 (§9, #503's 8 and 9).
- **The trolls' cave,** the doc's secret, is not built: the issue's own, the masons' cache behind
  their tally, is, as §4.6 has it, and the hint's words stand as a thing seen at the gully (§9,
  #503's 6).
- **Two under.** I9 at 20 and the area's pool, 91.5% two under against a limit of 90%, are owed to
  #18, as the Whitespine's was before I10 dropped it (§9, #503's 11).
- **The world ends past I9** to the west until H9 is built and to the east until J9 is; north the
  trail goes on into I8 (#504) (§9, #503's 18).
- **The shrine's kneel.** The walkthrough checks the lamp at 1,19 by place: `kneel` in
  `tools/walk.ts` compares the map def's shrine with the outdoors' placed copy, so it fails on any
  zone map's shrine, which only a dungeon's had used; a systems change, the owner's to ask for
  (§9, #503's 12).

Cut and owed, from I8 (#504):

- **The camp's rest.** The game has no hook for a rest at a camp, so the night is Wenna's question
  and the camp's own rest does not take her; a camp `nights` like the inn's is a systems change, the
  owner's to ask for. The chapter's step (#505) reads `q_wenna_taken`, which only her question sets
  (§4.7; §9, #504's 7).
- **The shard from the cave,** the doc's quest item for #548's Stone, is not placed: Act IV has no
  Rift to take one to. The cave holds the Hand's boats, crates of uncut shards under its seal, seen
  and not taken, and a chest of 400 gold; #548 places the item if it wants one (§9, #504's 10).
- **The issue's own secret,** the way up to Rook's Nest, hinted by the deserter, is not built: the
  doc's sea cave is, as §4.7 has it (§9, #504's 9).
- **The Mason's Tally and the Thief's third.** The Mason's Tally (#56's 48) is built (§6, #506);
  the watcher in Rook's Nest has words only, his trainer entry and the Thief's quest being #448's
  (§9, #504's 11 and 12).
- **Two under.** I8 at 20 and the area's pool, 93% two under against a limit of 90%, are owed to #18
  (§9, #504's 15).
- **The world ends past I8,** in the sea to the north and west and against J8, not built, to the
  east (§4.7).
- **The shrine's kneel,** as I9's: the drowned god's shrine at 27,5 is checked by place (§9, #503's
  12).

Owed, from the chapter (#505):

- **The explorers' line** is first written in the journal: the Meridian Journal, vol. I
  (Thornmark's item) has no text, so *The heart opens for whoever makes it whole* is nowhere else in
  the game. Its last page is Thornmark's to write, the owner's to ask for (§9, #505's 4).

Cut, from the side quests (#506):

- **The issue's Rime Lodge** for The Novice, its `after` on the masons' number for The Mason's
  Tally and a passage ticket carried: §6 has none of them (§9, #506's 2, 10 and 12).

Owed, from the third prestiges (#448):

- **A night held through** needs the engine to count one: the nights are groups that walk only by
  night, so a company may fight the ledge's two pairs on two nights, and nothing stops it resting
  between them. A systems change the owner may ask for (§9, #448's 4).
- **The orders kept to the end:** nothing takes them from the pack today. Were a later hand-in to
  (the Factor's rung, #635, if it took them), a company that gave them up before Hereward read them
  could not finish the Thief's (§9, the Ranger's and the Thief's 2).

Cut and owed, from the country behind (#508):

- **The brief's eagles** as a group in I12 and J12: they are sights, the nest on the Spine and the
  eagles and bones over the crags; an eagle group or a mixed one falls under the hardest-group floor
  of 23 or pays past the share (§9, #508's 4).
- **The giants' toll:** they ask none off the Stair, and J10's group has no king, no leader and no
  choice (§9, #508's 5).
- **The den (#88)** in none of the three: a den's keepers and brood pace past the limit or pay past
  the share, as in Rimewater's seven (§9, #508's 13).
- **Two under.** J10, I12 and J12 at 20 win every fight, owed to #18 as every box's: `OWED` in
  `tools/tests/gate.ts` names each, and the area's pool stays over the limit (§8).
- **To H12, Ashfall's country behind (#522):** I12's west edge, ash, grass and hills at rows 0 to 19
  and mountain below, is pinned against void; H12's builder matches it and moves the pin.
- **The world ends past J12** to the east against K12, cut, and to the south at the rim, as I12's
  does (§4.8).
